/**
 * Replicate Inference API Client
 * Supports DeepSeek V3.1, DeepSeek R1, Meta Llama 3 70B, and custom models on Replicate.
 */

const REPLICATE_BASE_URL = "https://api.replicate.com/v1";
const DEFAULT_MODEL = "deepseek-ai/deepseek-v3.1";
const HARDCODED_TOKEN = "REDACTED_REPLICATE_KEY";

/**
 * Run prediction via Replicate REST API
 * @param {string} prompt - Augmented user prompt with memory context
 * @param {string} systemPrompt - Executive CCO system prompt
 * @param {string} [apiToken] - Replicate API Token (r8_...)
 * @param {string} [customModel] - Optional custom model override
 * @returns {Promise<string>}
 */
async function generatePrediction(prompt, systemPrompt, apiToken, customModel) {
  const token = apiToken || process.env.REPLICATE_API_TOKEN || HARDCODED_TOKEN;
  if (!token) {
    throw new Error("REPLICATE_API_TOKEN is missing");
  }

  const targetModel = customModel || process.env.REPLICATE_MODEL || DEFAULT_MODEL;
  const endpoint = `${REPLICATE_BASE_URL}/models/${targetModel}/predictions`;

  const cleanPromptText = String(prompt || "").trim();
  const cleanSystemText = String(systemPrompt || "").trim();

  let input;
  if (targetModel.toLowerCase().includes("deepseek")) {
    const unifiedPrompt = cleanSystemText
      ? `${cleanSystemText}\n\n---\nFounder Query: ${cleanPromptText}`
      : cleanPromptText;
    input = {
      prompt: unifiedPrompt,
      max_tokens: 1536,
      temperature: 0.6,
      top_p: 0.95
    };
  } else if (targetModel.toLowerCase().includes("llama")) {
    input = {
      prompt: cleanPromptText,
      system_prompt: cleanSystemText,
      max_new_tokens: 1536,
      temperature: 0.5
    };
  } else {
    input = {
      prompt: cleanPromptText,
      system_prompt: cleanSystemText,
      max_tokens: 1536,
      temperature: 0.5
    };
  }

  const payload = { input };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "Prefer": "wait=60"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    if (response.status === 402) {
      throw new Error("Replicate 402 Payment Required: Account balance exhausted at replicate.com/account/billing");
    }
    throw new Error(`Replicate API error (${response.status}): ${errorText}`);
  }

  const result = await response.json();

  // If returned synchronously
  if (result.status === "succeeded") {
    return formatOutput(result.output);
  }

  // If still processing, poll get URL
  if (result.urls && result.urls.get) {
    return await pollPrediction(result.urls.get, token);
  }

  throw new Error(`Replicate prediction incomplete. Status: ${result.status}`);
}

async function pollPrediction(getUrl, token, maxAttempts = 35) {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(r => setTimeout(r, 2000));

    const res = await fetch(getUrl, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (res.ok) {
      const data = await res.json();
      if (data.status === "succeeded") {
        return formatOutput(data.output);
      }
      if (data.status === "failed" || data.status === "canceled") {
        throw new Error(`Prediction ${data.status}: ${data.error || "Unknown error"}`);
      }
    }
  }
  throw new Error("Polling timeout waiting for Replicate prediction");
}

function formatOutput(output) {
  if (Array.isArray(output)) {
    return output.join("").trim();
  }
  if (typeof output === "string") {
    return output.trim();
  }
  return "";
}

module.exports = {
  generatePrediction,
  REPLICATE_BASE_URL,
  DEFAULT_MODEL
};
