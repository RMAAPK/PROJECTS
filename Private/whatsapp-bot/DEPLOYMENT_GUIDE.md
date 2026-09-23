# Ali CNC Private CEO AI — Cloud Production Deployment Guide

## 1. Overview & Architecture
The WhatsApp Copilot daemon is completely self-contained, requiring no local device or active PC connection once deployed to cloud. It connects via Baileys multi-device protocol using your serialized session credentials.

* **Target Account**: `+92 330 9246239` (Linked & Verified)
* **Primary Brain**: Replicate AI (`@thealidev` API)
* **High-Speed Fallback**: Google Gemini 3.6 Flash (`gemini-3.6-flash`)
* **Knowledge Fabric**: 25 Dossier Nodes (Local) + Supabase (`wfccdwzreyspzewrzjjy.supabase.co`)

---

## 2. Production Environment Variables
Set these environment variables in your cloud provider (Render, Railway, Fly.io, or `.env` on VPS):

| Key | Value / Source | Description |
|---|---|---|
| `WHATSAPP_SESSION_BASE64` | *Contents of `whatsapp_session_base64.txt`* | Full serialized 36-file WhatsApp auth state. Allows zero-pairing instant boot. |
| `REPLICATE_API_TOKEN` | `REDACTED_REPLICATE_KEY` | Solo Founder Replicate account token |
| `GEMINI_API_KEY` | `REDACTED_GEMINI_KEY` | Gemini 3.6 Flash key |
| `SUPABASE_URL` | `https://wfccdwzreyspzewrzjjy.supabase.co` | Supabase Telemetry DB |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Full admin key |
| `LITELLM_API_KEY` | *Your LiteLLM Proxy / API token* | LiteLLM Proxy or OpenAI-compatible token |
| `LITELLM_BASE_URL` | `https://...` (e.g. `http://localhost:4000`) | LiteLLM Proxy base URL |
| `LITELLM_MODEL` | `gpt-4o-mini` / `claude-3-5-sonnet` | Target model routed via LiteLLM |

---

## 3. Deployment Methods

### Option A: Render.com (Background Worker)
1. In Render Dashboard, click **New +** > **Background Worker**.
2. Connect your GitHub repository: `thealidev/PAI` (or separate repo).
3. Settings:
   - **Root Directory**: `whatsapp-bot`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add the Environment Variables from Section 2 above.
5. Deploy. The bot will unpack `WHATSAPP_SESSION_BASE64` and log:
   `✅ COPILOT CONNECTED! Linked to: 923309246239`.

### Option B: Railway.app / Fly.io / Coolify
1. Deploy from the `whatsapp-bot/` directory or using the provided `Dockerfile`.
2. Add the environment variables.
3. Done.

### Option C: Linux VPS (Ubuntu / Debian Systemd or PM2)
```bash
# Clone and enter directory
cd /opt/pai/whatsapp-bot

# Install dependencies
npm install --omit=dev

# Put session base64 or bundle in place
# (whatsapp_session_bundle.json or WHATSAPP_SESSION_BASE64 in .env)

# Run with PM2 (auto-restarts on reboot)
npm install -g pm2
pm2 start bot.js --name "alicnc-whatsapp-pai"
pm2 save
pm2 startup
```

---

## 4. Verification
Once deployed in production, message yourself on WhatsApp:
`Who is Fargo?` or `!ai summarize our cutting parameters`
Your bot will answer 24/7 without needing your laptop to be on.

