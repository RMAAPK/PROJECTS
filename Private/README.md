# Ali CNC Private CEO AI (PAI)

> **Autonomous Private Executive AI Assistant & On-Device Copilot for Raja Muhammad Ali Asghar (Ali CNC)**  
> Native Android application (`pk.alicnc.ceo`) designed for POCO C85 (Xiaomi HyperOS).  
> Modeled after Gemini for Android with zero-root Shizuku automation, AES-256 encrypted security vault, and real-time Supabase hybrid memory.

---

## 🌟 Executive Overview

**Ali CNC Private CEO AI** is a fully autonomous, ultra-lightweight, 100% private mobile assistant engineered specifically for **Raja Muhammad Ali Asghar**, Solo Founder & CEO of **[Ali CNC](https://alicnc.pk)** and **[Ali CNC Forge AI](https://forge.alicnc.pk)**.

The app features:
- **AMOLED Dark Theme**: Deep obsidian `#090A0F` aesthetic with electric cyan `#38BDF8` and violet `#A855F7` accents.
- **Dual Presentation Modes**:
  - **Full-Screen Command Center**: Full conversational chat, voice recognition, speech synthesis readout, and quick executive prompt chips.
  - **Gemini-Style Floating Overlay (`AssistantOverlayService`)**: Summonable over any application (Onshape 3D, Termux, Weverse, YouTube, WhatsApp) via `SYSTEM_ALERT_WINDOW`.
- **Zero-Training Guarantee**: Configured with private zero-retention flags—your data is never used to train external models.
- **Google Antigravity Autonomous Agent Engine**: Embedded on-device task planner and multi-step worker capable of handling ad-hoc automation, G-code / CAD synthesis, and system tools on the go.
- **Zero-Root Hardware Bridge (Shizuku + `rish`)**: Sub-second `uiautomator dump` XML parsing without OCR lag, input automation, and system diagnostics under UID 2000 (`Shell`).
- **AES-256 Encrypted Keystore Vault**: Credentials and API keys protected against static decompilation.
- **Cloud & Local Memory Fabric**: 25 structured profile nodes with exact **Deterministic Sneak Keys** (`[MINGDA_1325_CNC]`, `[IFTIKHAR_MENTOR_BOSS]`, `[AHYEON_BIAS]`, `[FORGE_AI_YC_W27]`) synced with Supabase `pai-vault`.

---

## 📱 Pre-Compiled Release APK

A production-signed APK has been built directly on this machine with full signature schemes (v1, v2, v3):
```
Location: C:\Users\Muhammad Ali\Desktop\Ali_CNC_Private_CEO_AI.apk
Package:  pk.alicnc.ceo
Target:   POCO C85 (Xiaomi HyperOS / Android 14+)
Size:     ~163 KB (Zero bloated runtimes)
```

To install on your phone:
```bash
adb install "C:\Users\Muhammad Ali\Desktop\Ali_CNC_Private_CEO_AI.apk"
```
Or transfer `Ali_CNC_Private_CEO_AI.apk` via USB / Quick Share directly to your POCO C85 and tap to install.

---

## 🏗️ Architecture & Modules

```
app/src/main/
├── AndroidManifest.xml          # All requested permissions & overlay service
├── java/pk/alicnc/ceo/
│   ├── MainActivity.java        # Core executive UI, voice, chips, permissions
│   ├── AssistantOverlayService.java # Floating Gemini-style overlay
│   ├── GeminiClient.java        # Private Gemini Flash Lite inference client
│   ├── MemoryFabric.java        # In-memory dual-engine retrieval & sneak keys
│   ├── ShizukuBridge.java       # Zero-root UID 2000 shell & safety boundary
│   ├── EncryptedVault.java      # AES-256 & XOR keystore protection
│   ├── AntigravityAgent.java    # Embedded autonomous multi-step worker
│   ├── SupabaseSyncService.java # Async telemetry and memory sync
│   ├── ChatAdapter.java         # Native chat message adapter
│   └── ChatMessage.java         # Chat data model
└── res/
    ├── drawable/                # Glassmorphism bubbles, chips, buttons
    ├── layout/                  # Activity & overlay XML layouts
    ├── mipmap-*/                # Ali CNC spindle branded launcher icons
    └── values/                  # AMOLED colors, strings, styles
```

---

## 🔒 Security & Privacy Boundary

1. **Human-in-the-Loop Safety Ledger**: High-stakes operations (money transfers via Nayapay/Sadapay, file wipe, system resets) are automatically halted at biometric / `FLAG_SECURE` boundaries and require physical confirmation.
2. **Encrypted Vault**: Credentials are never stored as plaintext strings in the APK; they are dynamically decrypted at runtime.
3. **Zero External Model Training**: User conversations and shop floor parameters are strictly isolated and never fed into public foundation model training pools.

---

## 🛠️ Building From Source

### Option A: Android Studio
1. Open the `PAI` folder in Android Studio.
2. Let Gradle sync and select **Build > Build Bundle(s) / APK(s) > Build APK(s)**.

### Option B: Command Line (Gradle)
```bash
./gradlew assembleRelease
```

---

## 📜 Intellectual Property & Demographics
- **Founder & CEO:** Raja Muhammad Ali Asghar (Ali CNC / Muhammad Ali)
- **Certifications:** TITANS of CNC (TITAN-2M, TITAN-3M), PSEB Registered
- **Domains:** `alicnc.pk` • `forge.alicnc.pk`
- **Workshop:** Sector F-11, Islamabad, Pakistan