/**
 * PAI Dynamic Intelligent Model Router
 *
 * Automatically analyzes prompt intent and routes to best model:
 * - Heavy reasoning / multi-step logic -> DeepSeek R1
 * - General / coding / analysis       -> DeepSeek V3.1
 * - Ultra-fast lookups / one-liners   -> Gemini 2.5 Flash
 * - Explicit overrides: [model:r1], [model:v3], [model:gemini], [model:llama]
 *
 * Automatic cascading failover — queries never drop.
 */

const path = require("path");
const fs = require("fs");

const apisDir = fs.existsSync(path.join(__dirname, "apis"))
  ? path.join(__dirname, "apis")
  : __dirname;

const { generatePrediction } = require(path.join(apisDir, "replicate_api"));
const { generateGeminiContent } = require(path.join(apisDir, "gemini_api"));

const REASONING_KEYWORDS = [
  "calculate", "derivative", "integral", "eigenvalue", "prove", "proof",
  "derive", "solve", "physics formula", "modal analysis", "step by step"
];

const FAST_KEYWORDS = [
  "quick check", "summarize in one word", "yes or no", "ping", "status"
];

const CLAUDE_KEYWORDS = [
  "write code", "refactor", "front-end", "react", "ui", "ux", "claude"
];

const GPT_KEYWORDS = [
  "gpt", "openai", "general", "draft", "email"
];

/**
 * Detect the optimal model based on query and manual tags
 * @param {string} rawPrompt 
 * @returns {{ cleanPrompt: string, targetModel: string, reason: string }}
 */
function determineModel(rawPrompt) {
  let prompt = (rawPrompt || "").trim();
  let reason = "automatic_intent";

  // Check explicit model tag
  const tagMatch = prompt.match(/\[model:(r1|v3|v3\.1|deepseek-r1|deepseek-v3|gemini|flash|llama|claude|gpt)\]/i) ||
                    prompt.match(/^!(r1|v3|gemini|llama|claude|gpt)\s+/i);

  if (tagMatch) {
    const tag = (tagMatch[1] || "").toLowerCase();
    prompt = prompt.replace(tagMatch[0], "").trim();
    if (tag.includes("r1")) return { cleanPrompt: prompt, targetModel: "deepseek-ai/deepseek-r1", reason: "explicit_tag_r1" };
    if (tag.includes("gemini") || tag.includes("flash")) return { cleanPrompt: prompt, targetModel: "gemini-2.5-flash", reason: "explicit_tag_gemini" };
    if (tag.includes("llama")) return { cleanPrompt: prompt, targetModel: "meta/meta-llama-3-70b-instruct", reason: "explicit_tag_llama" };
    if (tag.includes("claude")) return { cleanPrompt: prompt, targetModel: "claude-4.5-sonnet", reason: "explicit_tag_claude" };
    if (tag.includes("gpt")) return { cleanPrompt: prompt, targetModel: "gpt-5.4-omni", reason: "explicit_tag_gpt" };
    return { cleanPrompt: prompt, targetModel: "deepseek-ai/deepseek-v3.1", reason: "explicit_tag_v3" };
  }

  const lower = prompt.toLowerCase();

  if (REASONING_KEYWORDS.some(kw => lower.includes(kw))) {
    return { cleanPrompt: prompt, targetModel: "deepseek-ai/deepseek-r1", reason: "heavy_reasoning" };
  }
  if (FAST_KEYWORDS.some(kw => lower.includes(kw)) && prompt.length < 50) {
    return { cleanPrompt: prompt, targetModel: "gemini-2.5-flash", reason: "low_latency_lookup" };
  }
  if (CLAUDE_KEYWORDS.some(kw => lower.includes(kw))) {
    return { cleanPrompt: prompt, targetModel: "claude-4.5-sonnet", reason: "coding_ui_ux" };
  }
  if (GPT_KEYWORDS.some(kw => lower.includes(kw))) {
    return { cleanPrompt: prompt, targetModel: "gpt-5.4-omni", reason: "general_text" };
  }

  // Default
  return { cleanPrompt: prompt, targetModel: "claude-4.5-sonnet", reason: "default_claude_4_6" };
}

/**
 * Format thought tags from DeepSeek R1 cleanly
 */
function cleanThinkingOutput(text) {
  if (!text) return "";
  // Strip <think>...</think> blocks if present, or format as quote
  return text.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
}

/**
 * Execute query through the intelligent router with automatic failover
 * @param {Object} options
 * @param {string} options.prompt - Clean user query
 * @param {string} options.systemPrompt - System prompt
 * @param {string} [options.chatContext] - Preceding conversation messages (batch)
 * @param {string} [options.sender] - Sender phone or handle
 * @param {string} [options.jid] - Chat JID
 * @returns {Promise<{ reply: string, modelUsed: string, latencyMs: number }>}
 */
async function routeAndExecute({ prompt, systemPrompt, chatContext = "", sender = "", jid = "" }) {
  const startTime = Date.now();
  const { cleanPrompt, targetModel, reason } = determineModel(prompt);

  console.log(`[AI Router] Routed to: ${targetModel} (${reason}) for query: "${cleanPrompt.slice(0, 50)}..."`);

  // Assemble Prompt with optional chat context
  let assembledPrompt = "";
  if (chatContext && chatContext.trim()) {
    assembledPrompt += `--- RECENT CHAT CONTEXT ---\n${chatContext.trim()}\n\n`;
  }
  assembledPrompt += cleanPrompt;

  // Execution Pipeline with Cascading Fallback
  const candidateChain = [
    targetModel,
    targetModel === "deepseek-ai/deepseek-v3.1" ? "deepseek-ai/deepseek-r1" : "deepseek-ai/deepseek-v3.1",
    "gemini-2.5-flash",
    "meta/meta-llama-3-70b-instruct"
  ];

  let lastError = null;
  for (const model of candidateChain) {
    try {
      let reply = "";
      if (model.startsWith("gemini")) {
        const geminiKey = process.env.GEMINI_API_KEY;
        reply = await generateGeminiContent(assembledPrompt, systemPrompt, geminiKey);
      } else {
        reply = await generatePrediction(assembledPrompt, systemPrompt, null, model);
        reply = cleanThinkingOutput(reply);
      }

      if (reply && reply.trim()) {
        const latencyMs = Date.now() - startTime;
        console.log(`[AI Router] ✅ Success via ${model} in ${latencyMs}ms`);
        return {
          reply: reply.trim(),
          modelUsed: model,
          latencyMs
        };
      }
    } catch (modelErr) {
      console.warn(`[AI Router] Model ${model} failed: ${modelErr.message}. Cascading to next candidate...`);
      lastError = modelErr;
    }
  }

  throw new Error(`AI Router execution exhausted: ${lastError?.message || "Unknown error"}`);
}

module.exports = {
  routeAndExecute,
  determineModel
};
