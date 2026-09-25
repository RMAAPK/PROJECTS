/**
 * PAI — Private AI WhatsApp Engine
 * - Intelligent Chat Handover / Autopilot Mode ("handle this chat" / "stop handling")
 * - Custom Chat Support via "!pai {prompt}" (Group Chats & DMs)
 * - Full support for deviceSentMessage (messages sent by owner from phone)
 * - Batch Message Reading & Sliding Conversation History
 * - Read-Only Media Perception: Voice Notes (Whisper) & Images (LLaVA/Gemini)
 * - Dynamic Intelligent Model Router (DeepSeek V3.1, DeepSeek R1, Gemini Flash)
 */

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const fs = require("fs");
const pino = require("pino");
const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  Browsers,
  DisconnectReason,
  downloadMediaMessage
} = require("@whiskeysockets/baileys");

// Import AI & Perception modules
const apisDir = fs.existsSync(path.join(__dirname, "apis"))
  ? path.join(__dirname, "apis")
  : path.join(__dirname, "..", "apis");

const { routeAndExecute } = require(path.join(apisDir, "ai_router"));
const { transcribeVoiceMessage, readImagePerception } = require(path.join(apisDir, "media_reader_api"));
const { restoreSession } = require("./session_manager");

const AUTH_DIR = path.join(__dirname, "auth_info_baileys");
const TARGET_PHONE_NUMBER = "923309246239";
const sentBotMessageIds = new Set();

// In-Memory Sliding Chat History & Batch Buffer
// chatHistory: Map<jid, Array<{ sender: string, senderName: string, text: string, type: string, timestamp: number }>>
const chatHistory = new Map();
const MAX_HISTORY_PER_CHAT = 20;

// pendingBatches: Map<jid, { timer: NodeJS.Timeout, items: Array<Object>, jid: string, replyJid: string, isSelfChat: boolean, latestMsg: Object }>
const pendingBatches = new Map();
const BATCH_DEBOUNCE_MS = 1200; // 1.2s window to bundle rapid consecutive messages

// Persistent Autopilot Registry (Active Handled Chats)
const HANDLED_CHATS_FILE = path.join(__dirname, "handled_chats.json");
const activeHandledChats = new Map();

function loadHandledChats() {
  try {
    if (fs.existsSync(HANDLED_CHATS_FILE)) {
      const data = JSON.parse(fs.readFileSync(HANDLED_CHATS_FILE, "utf8"));
      for (const [jid, info] of Object.entries(data)) {
        activeHandledChats.set(jid, info);
      }
      console.log(`[Autopilot Registry] Loaded ${activeHandledChats.size} active handled chat(s).`);
    }
  } catch (err) {
    console.warn(`[Autopilot Load Warning]: ${err.message}`);
  }
}

function saveHandledChats() {
  try {
    const obj = {};
    for (const [jid, info] of activeHandledChats.entries()) {
      obj[jid] = info;
    }
    fs.writeFileSync(HANDLED_CHATS_FILE, JSON.stringify(obj, null, 2), "utf8");
  } catch (err) {
    console.warn(`[Autopilot Save Warning]: ${err.message}`);
  }
}

loadHandledChats();

let totalMessagesHandled = 0;
let totalVoiceNotesRead = 0;
let totalImagesRead = 0;
let totalCustomChatTriggers = 0;
let botState = "INITIALIZING";
let lastActiveTime = new Date().toISOString();

function pushChatHistory(jid, entry) {
  if (!chatHistory.has(jid)) {
    chatHistory.set(jid, []);
  }
  const history = chatHistory.get(jid);
  history.push({ ...entry, timestamp: Date.now() });
  if (history.length > MAX_HISTORY_PER_CHAT) {
    history.shift();
  }
}

function getChatHistoryContext(jid, limit = 8) {
  const history = chatHistory.get(jid) || [];
  if (history.length === 0) return "";
  const recent = history.slice(-limit);
  return recent.map(h => {
    const time = new Date(h.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    return `[${time}] ${h.senderName || h.sender}: ${h.text}`;
  }).join("\n");
}

/**
 * Natural Language Trigger parser: detects !pai, /pai, .pai, @pai, or pai at start
 */
const TRIGGER_REGEX = /(?:^|\s)(?:[!/.@]pai\b|pai\b[:\s])/i;

function parseTrigger(text) {
  if (!text) return { triggered: false, cleanPrompt: "" };
  const trimmed = text.trim();
  if (!TRIGGER_REGEX.test(trimmed)) {
    return { triggered: false, cleanPrompt: trimmed };
  }
  const clean = trimmed
    .replace(/^(?:[!/.@]pai\b|pai\b[:\s])/i, "")
    .replace(/(?:^|\s)[!/.@]pai\b/gi, "")
    .trim();
  return { triggered: true, cleanPrompt: clean };
}

/**
 * Natural Language Handover Intent Detection:
 * Understands "handle this chat", "take over", "reply for me", "deal with this client"
 * and "stop", "i got this", "stand down", "stop handling", "pause", "autopilot off"
 */
function detectHandledChatIntent(text) {
  if (!text) return { isHandledIntent: false };
  const lower = text.toLowerCase().trim();

  // STOP PATTERNS
  const stopPatterns = [
    /\b(?:stop\s+handling|stop\s+replying|stop\s+chat|stop\s+talking|cancel\s+autopilot|stop\s+auto)\b/i,
    /\b(?:pai\s+stop|stop\s+pai|pause\s+pai|pai\s+pause|pai\s+stand\s+down)\b/i,
    /\b(?:i\s+got\s+this|i\'ll\s+take\s+(?:it|over)|i\s+will\s+take\s+(?:it|over)|leave\s+it\s+to\s+me)\b/i,
    /\b(?:i\'?m\s+back|i\s+am\s+back)\b/i,
    /\b(?:stand\s+down|hand\s+over|autopilot\s+off|auto\s+off)\b/i,
    /\b(?:no\s+need\s+to\s+reply|don\'?t\s+reply\s+anymore)\b/i,
    /^(?:[!/.@]pai\s+)?(?:stop|pause|stand\s+down|i\s+got\s+this)$/i
  ];

  for (const pat of stopPatterns) {
    if (pat.test(lower)) return { isHandledIntent: true, action: "STOP" };
  }

  // START / TAKE OVER PATTERNS
  const startPatterns = [
    /\b(?:handle\s+this\s+(?:chat|convo|conversation|client|person)|handle\s+(?:him|her|them|it))\b/i,
    /\b(?:take\s+over\s+(?:this\s+)?(?:chat|convo|conversation|client)|take\s+over\s+(?:for\s+me)?)\b/i,
    /\b(?:take\s+care\s+of\s+(?:this|him|her|them|client))\b/i,
    /\b(?:talk\s+to\s+(?:him|her|them|client)\s+for\s+me)\b/i,
    /\b(?:answer\s+(?:him|her|them|client)\s+for\s+me)\b/i,
    /\b(?:pai\s+(?:handle|take\s+over|deal\s+with|manage)\s*(?:this|it|him|them|chat)?)\b/i,
    /\b(?:deal\s+with\s+(?:this|him|her|them|client))\b/i,
    /\b(?:reply\s+(?:for\s+me|on\s+my\s+behalf|to\s+this\s+chat))\b/i,
    /\b(?:autopilot\s+on|auto\s+on|manage\s+this\s+chat|take\s+the\s+wheel)\b/i,
    /^(?:[!/.@]pai\s+)?(?:handle\s+this|take\s+over|deal\s+with\s+it)$/i
  ];

  for (const pat of startPatterns) {
    if (pat.test(lower)) return { isHandledIntent: true, action: "START" };
  }

  return { isHandledIntent: false };
}

// Web Dashboard Server
const http = require("http");
const { getStatusHtml } = require("./status_page");

const startTime = Date.now();
const PORT = process.env.PORT || 3000;
const server = http.createServer((req, res) => {
  const url = req.url.split("?")[0];

  if (url === "/ping" || url === "/health") {
    res.writeHead(200, {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-store, must-revalidate"
    });
    return res.end(JSON.stringify({
      status: "pong",
      botState,
      uptime: Math.floor((Date.now() - startTime) / 1000) + "s",
      messages: totalMessagesHandled,
      activeHandledChats: activeHandledChats.size,
      voiceNotesRead: totalVoiceNotesRead,
      imagesRead: totalImagesRead,
      customChatTriggers: totalCustomChatTriggers,
      memoryMB: Math.round(process.memoryUsage().rss / 1024 / 1024),
      timestamp: new Date().toISOString()
    }));
  }

  if (url === "/") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    const stats = {
      uptimeSeconds: Math.floor((Date.now() - startTime) / 1000),
      memoryUsageMB: Math.round(process.memoryUsage().rss / 1024 / 1024),
      phoneNumber: TARGET_PHONE_NUMBER,
      botState,
      totalMessagesHandled,
      activeHandledChats: activeHandledChats.size,
      voiceNotesRead: totalVoiceNotesRead,
      imagesRead: totalImagesRead,
      customChatTriggers: totalCustomChatTriggers,
      lastActiveTime,
      selfPingUrl: process.env.RENDER_EXTERNAL_URL ? `${process.env.RENDER_EXTERNAL_URL}/ping` : ""
    };
    return res.end(getStatusHtml(stats));
  }

  res.writeHead(404);
  res.end();
});

server.listen(PORT, () => {
  console.log(`[Huskey Sentinel] Web Dashboard active on port ${PORT}`);
});

// Autonomous Keep-Awake Sentinel
const selfPingTarget = process.env.RENDER_EXTERNAL_URL || process.env.SELF_PING_URL;
if (selfPingTarget) {
  const keepAliveMinutes = 10;
  setInterval(() => {
    const pingUrl = `${selfPingTarget.replace(/\/$/, "")}/ping`;
    const protocol = pingUrl.startsWith("https") ? require("https") : require("http");
    protocol.get(pingUrl, (res) => {
      console.log(`[Keep-Awake Sentinel] Pinged ${pingUrl} -> HTTP ${res.statusCode}`);
    }).on("error", (err) => {
      console.warn(`[Keep-Awake Warning]: ${err.message}`);
    });
  }, keepAliveMinutes * 60 * 1000);
  console.log(`[Keep-Awake Sentinel] Autonomous keep-awake active every ${keepAliveMinutes}m for ${selfPingTarget}`);
}

process.on("uncaughtException", (err) => console.error("[Guard Exception]:", err.message));
process.on("unhandledRejection", (reason) => console.error("[Guard Rejection]:", reason));

const PAI_SYSTEM_PROMPT = `You are PAI, a private AI assistant. You are direct, intelligent, and helpful.

- Answer any question honestly and completely, no matter the topic.
- No corporate disclaimers, no AI hedging, no "I cannot help with that" unless something is genuinely harmful.
- Keep responses concise and clear. Use markdown formatting where it helps.
- When analyzing code, math, or technical problems — be exact and precise.
- When handling a conversation on behalf of the user (Autopilot Mode) — respond naturally and competently as their representative.
- You have access to recent chat history when provided. Use it for context.`;

let isConnecting = false;

async function startBot() {
  if (isConnecting) return;
  isConnecting = true;

  try {
    console.log("[Engine] Initializing Baileys state for", TARGET_PHONE_NUMBER);

    if (!fs.existsSync(path.join(AUTH_DIR, "creds.json")) && process.env.WHATSAPP_SESSION_BASE64) {
      console.log("[Engine] Restoring session from environment variable (WHATSAPP_SESSION_BASE64)...");
      restoreSession(process.env.WHATSAPP_SESSION_BASE64, AUTH_DIR);
    }

    const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);

    const sock = makeWASocket({
      auth: state,
      logger: pino({ level: "silent" }),
      printQRInTerminal: false,
      browser: Browsers.ubuntu("Chrome"),
      syncFullHistory: false,
      markOnlineOnConnect: true,
      connectTimeoutMs: 60000,
      defaultQueryTimeoutMs: 60000,
      keepAliveIntervalMs: 25000
    });

    sock.ev.on("creds.update", saveCreds);

    let pairingCodeRequested = false;

    sock.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr && !pairingCodeRequested && !sock.authState?.creds?.registered) {
        pairingCodeRequested = true;
        try {
          console.log("[Engine] WhatsApp server connected. Requesting Pairing Code for:", TARGET_PHONE_NUMBER);
          const rawCode = await sock.requestPairingCode(TARGET_PHONE_NUMBER);
          const formattedCode = rawCode?.match(/.{1,4}/g)?.join("-") || rawCode;
          console.log("\n=======================================================");
          console.log(`>>> YOUR WHATSAPP PAIRING CODE IS: ${formattedCode} <<<`);
          console.log("=======================================================\n");
        } catch (pairErr) {
          console.error("[Pairing Code Error]:", pairErr.message);
          pairingCodeRequested = false;
        }
      }

      if (connection === "close") {
        isConnecting = false;
        botState = "RECONNECTING";
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        console.log(`[Connection Closed] Code: ${statusCode}`);

        if (statusCode === DisconnectReason.loggedOut || statusCode === 401) {
          botState = "LOGGED_OUT";
          console.log("[Auth State] Clearing stale session...");
          try { fs.rmSync(AUTH_DIR, { recursive: true, force: true }); } catch (_) {}
        }

        if (sock.authState?.creds?.registered) {
          console.log("Registered session disconnected. Reconnecting in 4s...");
          setTimeout(startBot, 4000);
        }
      } else if (connection === "open") {
        isConnecting = false;
        botState = "CONNECTED";
        const connectedUser = sock.user?.id?.split(":")[0];
        console.log("\n=======================================================");
        console.log(`✅ COPILOT CONNECTED! Linked to: ${connectedUser}`);
        console.log(`✅ Autopilot Active: ${activeHandledChats.size} chat(s) managed`);
        console.log("✅ Modes Active: Self-Chat + Custom Chats ('!pai') + Autopilot Handover");
        console.log("✅ Multimodal Active: Replicate Whisper (Voice) + LLaVA/Gemini (Images)");
        console.log("✅ AI Router Active: DeepSeek V3.1 / DeepSeek R1 / Gemini Flash");
        console.log("=======================================================\n");
      }
    });

    /**
     * Dispatch accumulated batch of messages to AI Router
     */
    async function processBatch(jid) {
      const batch = pendingBatches.get(jid);
      if (!batch) return;
      pendingBatches.delete(jid);

      const { items, replyJid, latestMsg, isSelfChat, senderNumber } = batch;
      if (!items || items.length === 0) return;

      try {
        await sock.sendPresenceUpdate("composing", replyJid);

        // Assemble unified batch prompt
        const batchTexts = items.map(it => it.text).filter(Boolean);
        let consolidatedPrompt = batchTexts.join("\n").trim();
        if (!consolidatedPrompt) return;

        // Check if chat is on Autopilot delegate mode
        const isAutopilot = activeHandledChats.has(jid);
        if (isAutopilot) {
          consolidatedPrompt += "\n\n[AUTOPILOT MODE]: You are managing this conversation on behalf of the user. Respond naturally and helpfully.";
        }

        // Retrieve sliding chat history
        const chatContext = getChatHistoryContext(jid, 10);

        console.log(`\n[Batch Execution] Processing ${items.length} batched items for ${replyJid} (Autopilot: ${isAutopilot}): "${consolidatedPrompt.slice(0, 60)}..."`);

        const { reply, modelUsed, latencyMs } = await routeAndExecute({
          prompt: consolidatedPrompt,
          systemPrompt: PAI_SYSTEM_PROMPT,
          chatContext,
          sender: senderNumber,
          jid
        });

        if (reply) {
          const modelBadge = modelUsed.includes("r1") ? "DeepSeek-R1" : (modelUsed.includes("v3") ? "DeepSeek-V3.1" : (modelUsed.includes("gemini") ? "Gemini-Flash" : modelUsed));
          const responseText = `${reply}\n\n_• ${modelBadge} (${latencyMs}ms)${isAutopilot ? " • Autopilot" : ""}_`;

          let sent;
          try {
            sent = await sock.sendMessage(replyJid, { text: responseText }, { quoted: latestMsg });
          } catch (quoteErr) {
            console.warn(`[Quote Send Failed, falling back to direct send]: ${quoteErr.message}`);
            sent = await sock.sendMessage(replyJid, { text: responseText });
          }

          if (sent?.key?.id) {
            sentBotMessageIds.add(sent.key.id);
            if (sentBotMessageIds.size > 500) {
              const oldest = sentBotMessageIds.values().next().value;
              sentBotMessageIds.delete(oldest);
            }
          }

          pushChatHistory(jid, {
            sender: "PAI",
            senderName: "PAI",
            text: reply,
            type: "assistant"
          });

          totalMessagesHandled++;
          lastActiveTime = new Date().toISOString();
          console.log(`[Reply Delivered to WhatsApp: ${replyJid} via ${modelBadge}]`);
        }
      } catch (execErr) {
        console.error(`[Batch Execution Error for ${replyJid}]:`, execErr.message);
        try {
          await sock.sendMessage(replyJid, {
            text: `PAI Engine error: ${execErr.message}`
          });
        } catch (_) {}
      }
    }

    /**
     * Helper to enqueue a message into the batch collector
     */
    function enqueueToBatch({ jid, replyJid, text, isSelfChat, senderNumber, msg }) {
      let batch = pendingBatches.get(jid);
      if (batch) {
        clearTimeout(batch.timer);
        batch.items.push({ text, timestamp: Date.now() });
        batch.latestMsg = msg;
      } else {
        batch = {
          items: [{ text, timestamp: Date.now() }],
          jid,
          replyJid,
          isSelfChat,
          senderNumber,
          latestMsg: msg,
          timer: null
        };
        pendingBatches.set(jid, batch);
      }

      batch.timer = setTimeout(() => {
        processBatch(jid);
      }, BATCH_DEBOUNCE_MS);
    }

    sock.ev.on("messages.upsert", async (m) => {
      try {
        for (const msg of m.messages || []) {
          if (!msg.message) continue;
          if (msg.key?.id && sentBotMessageIds.has(msg.key.id)) continue;

          let rawMsg = msg.message;
          let destJid = null;

          // 1. Unwrap deviceSentMessage (Critical for messages sent by founder from phone)
          if (rawMsg.deviceSentMessage) {
            destJid = rawMsg.deviceSentMessage.destinationJid;
            rawMsg = rawMsg.deviceSentMessage.message;
          }
          if (rawMsg?.ephemeralMessage?.message) rawMsg = rawMsg.ephemeralMessage.message;
          if (rawMsg?.viewOnceMessage?.message) rawMsg = rawMsg.viewOnceMessage.message;
          if (rawMsg?.viewOnceMessageV2?.message) rawMsg = rawMsg.viewOnceMessageV2.message;
          if (rawMsg?.documentWithCaptionMessage?.message) rawMsg = rawMsg.documentWithCaptionMessage.message;

          // Determine the actual conversation JID
          const chatJid = destJid || msg.key.remoteJid || "";
          if (!chatJid || chatJid.includes("@broadcast")) continue;

          const fromMe = Boolean(msg.key.fromMe);
          const myNumber = sock.user?.id?.split(":")[0]?.split("@")[0] || TARGET_PHONE_NUMBER;
          const myLid = (sock.user?.lid || "70223268966470").split(":")[0].split("@")[0];
          const targetClean = chatJid.split("@")[0].split(":")[0];

          // STRICT SELF-CHAT: Sent by founder and directed to their own self chat
          const isSelfChat = fromMe && !destJid && (targetClean === myNumber || targetClean === myLid);
          const isGroup = chatJid.endsWith("@g.us");
          const senderJid = isGroup ? (msg.key.participant || chatJid) : (fromMe ? myNumber : chatJid);
          const senderNumber = senderJid.split("@")[0].split(":")[0];
          const senderName = msg.pushName || (fromMe ? "Founder" : senderNumber);

          // 1. Check Voice Messages / Audio
          const isAudio = Boolean(rawMsg?.audioMessage);
          // 2. Check Images
          const isImage = Boolean(rawMsg?.imageMessage);
          // 3. Text Message
          let text = (
            rawMsg?.conversation ||
            rawMsg?.extendedTextMessage?.text ||
            rawMsg?.imageMessage?.caption ||
            rawMsg?.videoMessage?.caption ||
            rawMsg?.documentMessage?.caption ||
            ""
          ).trim();

          // Reject bot loops
          if (text.includes("_• DeepSeek") || text.includes("_• Gemini") || text.includes("_Ali CNC Private CEO Engine_") || text.includes("Chief Chaos Officer") || text.includes("PAI Engine error:") || text.includes("*PAI AUTOPILOT")) {
            continue;
          }

          // Check if quoted message exists
          const quotedMsg = rawMsg?.extendedTextMessage?.contextInfo?.quotedMessage;
          let quotedContext = "";
          if (quotedMsg) {
            const quotedText = (
              quotedMsg.conversation ||
              quotedMsg.extendedTextMessage?.text ||
              quotedMsg.imageMessage?.caption ||
              quotedMsg.videoMessage?.caption ||
              ""
            ).trim();
            if (quotedText) quotedContext = `[Replying to: "${quotedText}"]`;
          }

          // Media Processing (Pure Read-Only Perception via Replicate)
          let mediaDescription = "";
          if (isAudio) {
            try {
              console.log(`[Media Reception] Audio received from ${senderName} in ${chatJid}`);
              const audioBuffer = await downloadMediaMessage(msg, "buffer", {});
              const mimeType = rawMsg.audioMessage.mimetype || "audio/ogg";
              const transcript = await transcribeVoiceMessage(audioBuffer, mimeType);
              mediaDescription = `[Voice Note from ${senderName}]: "${transcript}"`;
              totalVoiceNotesRead++;
            } catch (mediaErr) {
              console.warn(`[Media Transcription Error]: ${mediaErr.message}`);
              mediaDescription = `[Voice Note from ${senderName}]: (Audio transcription failed)`;
            }
          } else if (isImage) {
            try {
              console.log(`[Media Reception] Image received from ${senderName} in ${chatJid}`);
              const imageBuffer = await downloadMediaMessage(msg, "buffer", {});
              const mimeType = rawMsg.imageMessage.mimetype || "image/jpeg";
              const caption = rawMsg.imageMessage.caption || "";
              const visualDesc = await readImagePerception(imageBuffer, mimeType, caption);
              mediaDescription = `[Image sent by ${senderName}${caption ? ` with caption: "${caption}"` : ""}]:\n${visualDesc}`;
              totalImagesRead++;
            } catch (imgErr) {
              console.warn(`[Image Perception Error]: ${imgErr.message}`);
              mediaDescription = `[Image sent by ${senderName}]: (Image perception failed)`;
            }
          }

          // Combined payload for this message
          const fullMessageText = [quotedContext, mediaDescription, text].filter(Boolean).join(" ").trim();
          if (!fullMessageText) continue;

          // Always record to sliding history buffer for contextual awareness
          pushChatHistory(chatJid, {
            sender: senderNumber,
            senderName,
            text: fullMessageText,
            type: isAudio ? "audio_transcript" : (isImage ? "image_perception" : "text")
          });

          // ====================================================================
          // 2. AUTOPILOT / CHAT HANDOVER INTENT DETECTION
          // ====================================================================
          const isFromFounder = fromMe || isSelfChat;
          const intent = detectHandledChatIntent(text);

          if (isFromFounder && intent.isHandledIntent) {
            if (intent.action === "START") {
              activeHandledChats.set(chatJid, {
                activatedAt: Date.now(),
                activatedBy: senderNumber
              });
              saveHandledChats();

              console.log(`[Autopilot Action] Engaged for chat: ${chatJid}`);
              await sock.sendMessage(chatJid, {
                text: `*PAI AUTOPILOT ON* 🎯\n\nTaking over this chat. I'll answer all incoming messages.\n\n_Say "pai stop" or "i got this" to hand back control._`
              });
              continue;
            } else if (intent.action === "STOP") {
              if (activeHandledChats.has(chatJid)) {
                activeHandledChats.delete(chatJid);
                saveHandledChats();

                console.log(`[Autopilot Action] Disengaged for chat: ${chatJid}`);
                await sock.sendMessage(chatJid, {
                  text: `*PAI AUTOPILOT OFF* 🛑\n\nStanding down. Chat control returned.`
                });
                continue;
              } else if (isSelfChat) {
                const count = activeHandledChats.size;
                activeHandledChats.clear();
                saveHandledChats();
                await sock.sendMessage(chatJid, {
                  text: `*PAI AUTOPILOT CLEARED* 🛑\n\nDisengaged autopilot across ${count} chat(s).`
                });
                continue;
              }
            }
          }

          // Self-chat management commands: "show handled chats" / "active chats"
          if (isSelfChat && (/^(?:show\s+)?(?:handled|active)\s+chats$/i.test(text.trim()))) {
            if (activeHandledChats.size === 0) {
              await sock.sendMessage(chatJid, { text: `*AUTOPILOT STATUS*\n\nNo chats currently on autopilot.` });
            } else {
              const list = Array.from(activeHandledChats.keys()).map((k, i) => `${i + 1}. ${k}`).join("\n");
              await sock.sendMessage(chatJid, { text: `*ACTIVE AUTOPILOT CHATS (${activeHandledChats.size})*\n\n${list}\n\n_Say "stop all" to disengage all._` });
            }
            continue;
          }

          // ====================================================================
          // 3. TRIGGER LOGIC:
          // A) In Self-Chat: Always triggers (cleans !pai / !ai prefix if present)
          // B) In Autopilot Handled Chats: Automatically triggers on all incoming messages from other parties (!fromMe)
          // C) In Custom Chats: Triggers when message or quote contains !pai
          // ====================================================================
          const isChatHandled = activeHandledChats.has(chatJid);
          const isOtherPartyInHandledChat = isChatHandled && !fromMe;

          const textTrigger = parseTrigger(text);
          const quoteTrigger = parseTrigger(quotedContext);
          const hasPaiTrigger = textTrigger.triggered || quoteTrigger.triggered;

          let shouldTrigger = false;
          let cleanedPrompt = textTrigger.cleanPrompt || text;

          if (isSelfChat) {
            shouldTrigger = true;
            if (cleanedPrompt.toLowerCase().startsWith("!ai ")) cleanedPrompt = cleanedPrompt.slice(4).trim();
          } else if (isOtherPartyInHandledChat) {
            shouldTrigger = true;
            console.log(`\n[Autopilot Trigger] Automatically processing incoming message from ${senderName} in ${chatJid}`);
          } else if (hasPaiTrigger) {
            shouldTrigger = true;
            totalCustomChatTriggers++;
            console.log(`\n[Custom Chat Trigger] Tag "!pai" detected in ${chatJid} from ${senderName}`);
          }

          if (shouldTrigger) {
            const finalBatchItemText = [quotedContext, mediaDescription, cleanedPrompt].filter(Boolean).join(" ").trim();
            enqueueToBatch({
              jid: chatJid,
              replyJid: chatJid,
              text: finalBatchItemText || "(Tagged !pai with media or context)",
              isSelfChat,
              senderNumber,
              msg
            });
          }
        }
      } catch (err) {
        console.error("[Message Event Error]:", err.message);
      }
    });

  } catch (err) {
    isConnecting = false;
    console.error("[Startup Error]:", err.message);
    setTimeout(startBot, 4000);
  }
}

startBot();
