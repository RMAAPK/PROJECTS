/**
 * Google Gemini Flash Lite API Client
 * Direct HTTP REST implementation without heavy external SDKs.
 */

const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";
const DEFAULT_GEMINI_MODEL = "gemini-3.6-flash";

/**
 * Generate content using Google Gemini REST API
 * @param {string} prompt - User prompt
 * @param {string} systemInstruction - INTJ CEO Persona & dossier context
 * @param {string} apiKey - Google Gemini API Key
 * @returns {Promise<string>}
 */
async function generateGeminiContent(prompt, systemInstruction, apiKey) {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  const endpoint = `${GEMINI_BASE_URL}/${DEFAULT_GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }]
      }
    ],
    systemInstruction: {
      parts: [{ text: systemInstruction }]
    },
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 1024
    }
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const candidate = data.candidates && data.candidates[0];
  if (candidate && candidate.content && candidate.content.parts && candidate.content.parts[0]) {
    return candidate.content.parts[0].text.trim();
  }

  return "No text returned by Gemini.";
}

module.exports = {
  generateGeminiContent,
  GEMINI_BASE_URL,
  DEFAULT_GEMINI_MODEL
};
