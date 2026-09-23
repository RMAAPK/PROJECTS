# Ali CNC Private CEO AI — Master API Specification & Architecture Dossier

This document provides the definitive, zero-omission technical documentation for every API, protocol, data schema, and security mechanism developed for **Ali CNC Private CEO AI (`PAI`)**.

---

## 1. Twilio WhatsApp Gateway API (Incoming & Outgoing Protocol)

### Architecture & Data Flow
When a user sends a WhatsApp message to the Twilio number, Twilio executes an `HTTP POST` request to our cloud webhook endpoint (`/api/whatsapp`).

### Inbound Payload (Twilio -> Webhook)
* **Format**: `application/x-www-form-urlencoded`
* **Key Fields**:
  ```
  From=whatsapp%3A%2B923001234567       # Sender WhatsApp ID with country code
  To=whatsapp%3A%2B14155238886          # Twilio WhatsApp number
  Body=Who+is+Fargo                     # Raw text message sent by user
  ProfileName=Ali                       # Sender's WhatsApp display profile
  MessageSid=SMXXXXXXXXXXXXXXXXX        # Unique Twilio message identifier
  NumMedia=0                            # Count of attached media files (images, audio)
  ```

### Whitelist Security Verification Gate
Before executing any AI query or memory retrieval, verify the sender:
```javascript
const authorizedNumber = process.env.AUTHORIZED_NUMBER; // e.g. "+923001234567"
const incomingNumber = req.body.From.replace("whatsapp:", "").replace(/[^\d]/g, "");
if (incomingNumber !== authorizedNumber.replace(/[^\d]/g, "")) {
  // Discard or return 403 Forbidden with security denial
}
```

### Outbound Response (Webhook -> Twilio)
* **Format**: `text/xml` (TwiML)
* **Status**: `200 OK`
* **Payload**:
  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <Response>
      <Message>
          <Body>*ALI CNC EXECUTIVE INTEL*&#10;&#10;Cousin Haseeb is the primary caretaker of Fargo.</Body>
      </Message>
  </Response>
  ```
* **XML Escaping Rules**: Special characters `&`, `<`, `>`, `"`, `'` must be escaped to prevent TwiML parser rejection.

---

## 2. Replicate Cloud Inference API (`meta-llama-3-70b-instruct`)

### Endpoint & Protocol
* **Base URL**: `https://api.replicate.com/v1/models/meta/meta-llama-3-70b-instruct/predictions`
* **Method**: `POST`
* **Headers**:
  ```http
  Authorization: Bearer <REPLICATE_API_TOKEN>
  Content-Type: application/json
  Prefer: wait=60
  User-Agent: PAI-CEO-Assistant/3.0
  ```

### Request Payload
```json
{
  "input": {
    "prompt": "<Augmented Prompt with Recalled Memory Dossier Nodes>",
    "system_prompt": "You are Ali CNC Private CEO AI (PAI)... [INTJ Persona]",
    "max_new_tokens": 1024,
    "temperature": 0.3
  }
}
```

### Response Schema & Polling
* **Synchronous (HTTP 200/201 with `Prefer: wait`)**:
  ```json
  {
    "id": "pred_xxxxxxxxxxxx",
    "status": "succeeded",
    "output": ["Response ", "text ", "chunks..."]
  }
  ```
* **Asynchronous Fallback**:
  If status is `"starting"` or `"processing"`, query `urls.get` via `GET` every 2 seconds until `status === "succeeded"`.
* **Error Handling**:
  * `402 Payment Required`: Billing quota exhausted at `replicate.com/account/billing`.
  * `429 Too Many Requests`: Rate limit throttle.

---

## 3. Google Gemini Flash Lite REST API

### Endpoint & Protocol
* **Base URL**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=<GEMINI_API_KEY>`
* **Method**: `POST`
* **Headers**: `Content-Type: application/json`

### Request Payload
```json
{
  "contents": [
    {
      "role": "user",
      "parts": [{ "text": "<User prompt with context>" }]
    }
  ],
  "systemInstruction": {
    "parts": [{ "text": "<Executive INTJ CEO System Prompt>" }]
  },
  "generationConfig": {
    "temperature": 0.3,
    "maxOutputTokens": 1024
  }
}
```

### Response Schema
```json
{
  "candidates": [
    {
      "content": {
        "parts": [{ "text": "Generated response string" }],
        "role": "model"
      },
      "finishReason": "STOP"
    }
  ]
}
```

---

## 4. Supabase Hybrid Memory & Storage API

### PostgREST Queries (`/rest/v1`)
* **Endpoint**: `https://wfccdwzreyspzewrzjjy.supabase.co/rest/v1`
* **Headers**:
  ```http
  apikey: <SUPABASE_ANON_OR_SERVICE_KEY>
  Authorization: Bearer <SUPABASE_ANON_OR_SERVICE_KEY>
  Content-Type: application/json
  ```
* **Read Memories**:
  `GET /rest/v1/memories?select=*&order=created_at.desc`
* **Write Chat Session Telemetry**:
  `POST /rest/v1/chat_sessions`
  ```json
  {
    "session_id": "whatsapp_session",
    "role": "user",
    "content": "query text"
  }
  ```

### Storage Bucket Object API (`/storage/v1`)
* **Download Master Dossier**:
  `GET /storage/v1/object/pai-vault/ali_cnc_master_dossier.json`
* **Upload Event Log Backup**:
  `POST /storage/v1/object/pai-vault/<filename>.json` with header `x-upsert: true`.

---

## 5. Ali CNC Forge AI Spindle Acoustics & NcStudio Defense

### Acoustic Physics Formulas
* **Tooth-Pass Frequency ($f_{tp}$)**:
  $$f_{tp} = \frac{\text{RPM} \times \text{Flutes}}{60}$$
  *Example*: 18,000 RPM with 2-flute carbide endmill:
  $$f_{tp} = \frac{18000 \times 2}{60} = 600\text{ Hz}$$
* **Chatter Anomaly Detection**:
  Harmonic spike at ~2.4 kHz (or out-of-phase resonance with $f_{tp}$) indicates regenerative spindle chatter.

### Win32 Sentinel Hook (`ForgeAI_NcStudio_Defense.exe`)
* **Target Software**: `NcStudio.exe` (Weihong PCIMC-3D PCI card, WCH CH365 chip, `whnc3d.sys`).
* **Win32 Message Hook**:
  ```csharp
  [DllImport("user32.dll")]
  static extern bool PostMessage(IntPtr hWnd, uint Msg, IntPtr wParam, IntPtr lParam);

  const uint WM_KEYDOWN = 0x0100;
  const int VK_NEXT = 0x22; // PageDown key code

  // Drops feed rate instantly from 100% to 25% within < 5ms:
  PostMessage(hWndNcStudio, WM_KEYDOWN, (IntPtr)VK_NEXT, IntPtr.Zero);
  ```

---

## 6. Deterministic Memory Fabric Engine (25 Master Dossier Nodes)

### Tokenization & Scoring Mechanics
* **Input**: User prompt (e.g. *"Who is Fargo and who feeds him?"*)
* **Steps**:
  1. Clean & lower-case string.
  2. Filter 50+ conversational stop words (`what`, `who`, `is`, `the`, `tell`, etc.).
  3. Generate token variations: exact, stripped hyphens, underscore replacements, plural stems (`-s`).
  4. Match against 25 master dossier records:
     * **Exact Sneak Key Match**: `+120 pts`
     * **Full Substring in Title**: `+80 pts`
     * **Full Substring in Content**: `+50 pts`
     * **Variant in Sneak Key**: `+35 pts`
     * **Variant in Title**: `+25 pts`
     * **Variant in Content**: `+15 pts`
  5. Sort descending; return top 4 context nodes in < 1ms.

---

## 7. Shizuku UID 2000 ADB System Bridge (`ShizukuBridge.java`)
* **Interface**: Android Binder IPC to `/data/local/tmp/rish` or `/system/bin/sh`.
* **Zero-Root Execution**: Runs under UID 2000 (`Shell`).
* **Key Commands**:
  * `uiautomator dump /sdcard/window_dump.xml`: Dumps full UI layout hierarchy without OCR latency.
  * `screencap -p /sdcard/screencap.png`: Captures screen frame buffer.
  * `input keyevent <keycode>`: Dispatches hardware keystrokes and gestures.

---

## 8. Security Vault Architecture (`EncryptedVault.java`)
* **Encryption**: AES-256-GCM hardware KeyStore backed.
* **Key Derivation**: Dynamically assembled 32-byte master key from split seeds (`AliCNC_CEO_2026!` + `SectorF11_POCO85`).
* **Safety Ledger Boundary**: Biometric and `FLAG_SECURE` hard-stops that abort critical actions (financial transfers, root resets) without physical operator presence.
