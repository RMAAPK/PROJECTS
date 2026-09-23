/**
 * LiteLLM Proxy / Unified API Client
 * Compatible with LiteLLM Proxy, OpenRouter, and standard OpenAI-format providers.
 * Pure zero-dependency HTTP client using native Node.js fetch.
 */

const DEFAULT_LITELLM_MODEL = process.env.LITELLM_MODEL || "deepseek-ai/deepseek-v3.1";
const DEFAULT_LITELLM_BASE_URL = process.env.LITELLM_BASE_URL || "http://localhost:4000";

/**
 * Generate completion via LiteLLM Proxy or OpenAI-compatible endpoint
 * @param {string} prompt - Augmented prompt with memory fabric context
 * @param {string} systemPrompt - Huskey CEO Persona system prompt
 * @param {string} apiKey - LiteLLM / API Key
 * @param {string} [baseUrl] - Optional custom LiteLLM base URL
 * @param {string} [model] - Optional custom model name
 * @returns {Promise<string>}
 */
async function generateLiteLLMContent(prompt, systemPrompt, apiKey, baseUrl, model) {
  const token = apiKey || process.env.LITELLM_API_KEY;
  if (!token) {
    throw new Error("LITELLM_API_KEY is missing");
  }

  let host = (baseUrl || process.env.LITELLM_BASE_URL || DEFAULT_LITELLM_BASE_URL).replace(/\/+$/, "");
  
  // Ensure endpoint ends with chat/completions
  let endpoint;
  if (host.endsWith("/chat/completions")) {
    endpoint = host;
  } else if (host.endsWith("/v1")) {
    endpoint = `${host}/chat/completions`;
  } else {
    endpoint = `${host}/v1/chat/completions`;
  }

  const targetModel = model || process.env.LITELLM_MODEL || DEFAULT_LITELLM_MODEL;

  const payload = {
    model: targetModel,
    messages: [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.3,
    max_tokens: 1024
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`LiteLLM error (${response.status}): ${errorBody}`);
  }

  const result = await response.json();
  const reply = result?.choices?.[0]?.message?.content;

  if (!reply) {
    throw new Error("LiteLLM returned empty choices in response");
  }

  return reply.trim();
}

module.exports = {
  generateLiteLLMContent,
  DEFAULT_LITELLM_MODEL,
  DEFAULT_LITELLM_BASE_URL
};
