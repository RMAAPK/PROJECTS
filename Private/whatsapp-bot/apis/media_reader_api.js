/**
 * Ali CNC PAI Multimodal Perception Reader
 * Pure read-only media perception:
 * - Transcribes Voice Messages (VMs) using Replicate OpenAI Whisper
 * - Reads & Analyzes Images (OCR, diagrams, parts) using Replicate LLaVA-13B (with Gemini Flash fallback)
 * 
 * STRICT COMPLIANCE: Zero generation of audio or images. Pure reading/transcription only.
 */

const REPLICATE_BASE_URL = "https://api.replicate.com/v1";
const HARDCODED_REPLICATE_TOKEN = "REDACTED_REPLICATE_KEY";

// Verified Replicate deployment versions
const WHISPER_VERSION = "8099696689d249cf8b122d833c36ac3f75505c666a395ca40ef26f68e7d3d16e"; // openai/whisper
const LLAVA_VERSION = "80537f9eead1a5bfa72d5ac6ea6414379be41d4d4f6679fd776e9535d1eb58bb";   // yorickvp/llava-13b

/**
 * Convert Buffer to Data URI string
 * @param {Buffer} buffer 
 * @param {string} mimeType 
 * @returns {string}
 */
function bufferToDataUri(buffer, mimeType) {
  const base64 = buffer.toString("base64");
  const cleanMime = (mimeType || "application/octet-stream").split(";")[0].trim();
  return `data:${cleanMime};base64,${base64}`;
}

/**
 * Helper to poll Replicate prediction until finished
 */
async function pollReplicate(getUrl, token, maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(r => setTimeout(r, 2000));
    const res = await fetch(getUrl, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      if (data.status === "succeeded") {
        return data.output;
      }
      if (data.status === "failed" || data.status === "canceled") {
        throw new Error(`Replicate prediction ${data.status}: ${data.error || "Unknown error"}`);
      }
    }
  }
  throw new Error("Polling timeout waiting for Replicate prediction");
}

/**
 * Transcribe incoming WhatsApp Voice Message / Audio using Replicate Whisper
 * @param {Buffer} audioBuffer - raw audio buffer from Baileys
 * @param {string} [mimeType='audio/ogg'] - audio MIME type
 * @param {string} [apiToken]
 * @returns {Promise<string>} Transcribed text
 */
async function transcribeVoiceMessage(audioBuffer, mimeType = "audio/ogg", apiToken) {
  const token = apiToken || process.env.REPLICATE_API_TOKEN || HARDCODED_REPLICATE_TOKEN;
  if (!token) throw new Error("REPLICATE_API_TOKEN is required for Whisper transcription");

  const dataUri = bufferToDataUri(audioBuffer, mimeType || "audio/ogg");
  const endpoint = `${REPLICATE_BASE_URL}/predictions`;

  console.log(`[Media Perception] Transcribing ${audioBuffer.length} bytes of audio via Replicate Whisper...`);

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      version: WHISPER_VERSION,
      input: {
        audio: dataUri,
        transcription: "plain text",
        language: "auto",
        translate: false
      }
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Whisper API error (${res.status}): ${errText}`);
  }

  const result = await res.json();
  let rawOutput = result.output;
  if (result.status !== "succeeded" && result.urls?.get) {
    rawOutput = await pollReplicate(result.urls.get, token);
  }

  let text = "";
  if (typeof rawOutput === "string") {
    text = rawOutput;
  } else if (rawOutput && typeof rawOutput.transcription === "string") {
    text = rawOutput.transcription;
  } else if (Array.isArray(rawOutput)) {
    text = rawOutput.join(" ");
  }

  const cleanText = text.trim();
  console.log(`[Media Perception] Voice Message Transcribed: "${cleanText.slice(0, 80)}..."`);
  return cleanText || "(Inaudible audio / silence)";
}

/**
 * Read and analyze incoming image using Replicate LLaVA-13B (with Gemini Flash fallback)
 * @param {Buffer} imageBuffer - raw image buffer from Baileys
 * @param {string} [mimeType='image/jpeg'] - image MIME type
 * @param {string} [prompt] - optional focus prompt
 * @param {string} [apiToken]
 * @returns {Promise<string>} Detailed visual perception & OCR text
 */
async function readImagePerception(imageBuffer, mimeType = "image/jpeg", prompt = "", apiToken) {
  const token = apiToken || process.env.REPLICATE_API_TOKEN || HARDCODED_REPLICATE_TOKEN;
  const dataUri = bufferToDataUri(imageBuffer, mimeType || "image/jpeg");
  const userPrompt = prompt
    ? `Examine this image carefully in the context of this question/caption: "${prompt}". Transcribe any visible text/numbers, identify objects, CAD drawings, machine components, or blueprints, and describe everything in detail.`
    : "Examine this image in high detail. Transcribe all visible text, numbers, symbols, identify any CNC tools, parts, blueprints, technical diagrams, or objects present.";

  // 1. Try Replicate LLaVA-13B
  try {
    console.log(`[Media Perception] Reading ${imageBuffer.length} bytes image via Replicate LLaVA-13B...`);
    const endpoint = `${REPLICATE_BASE_URL}/predictions`;
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        version: LLAVA_VERSION,
        input: {
          image: dataUri,
          prompt: userPrompt,
          max_tokens: 1024,
          temperature: 0.2
        }
      })
    });

    if (res.ok) {
      const result = await res.json();
      let rawOutput = result.output;
      if (result.status !== "succeeded" && result.urls?.get) {
        rawOutput = await pollReplicate(result.urls.get, token);
      }
      const outputText = Array.isArray(rawOutput) ? rawOutput.join("").trim() : (typeof rawOutput === "string" ? rawOutput.trim() : "");
      if (outputText) {
        console.log(`[Media Perception] Image read successfully via LLaVA-13B: "${outputText.slice(0, 80)}..."`);
        return outputText;
      }
    } else {
      console.warn(`[Media Perception] LLaVA-13B HTTP ${res.status}: ${await res.text()}`);
    }
  } catch (err) {
    console.warn(`[Media Perception] LLaVA-13B error (${err.message}). Trying Gemini Flash vision...`);
  }

  // 2. High-speed Fallback: Google Gemini Flash Vision API
  const geminiKey = process.env.GEMINI_API_KEY || "REDACTED_GEMINI_KEY";
  if (geminiKey) {
    try {
      console.log(`[Media Perception] Reading image via Gemini 2.5 Flash Vision fallback...`);
      const base64Data = imageBuffer.toString("base64");
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: userPrompt },
                {
                  inlineData: {
                    mimeType: (mimeType || "image/jpeg").split(";")[0],
                    data: base64Data
                  }
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 1024
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidate) {
          console.log(`[Media Perception] Image read successfully via Gemini Vision: "${candidate.slice(0, 80)}..."`);
          return candidate.trim();
        }
      }
    } catch (gErr) {
      console.error(`[Media Perception] Gemini Vision fallback error:`, gErr.message);
    }
  }

  return "Image could not be processed.";
}

module.exports = {
  transcribeVoiceMessage,
  readImagePerception
};

