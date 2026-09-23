# COMPLETE PROFILE & ARCHITECTURE DOSSIER
**Comprehensive System Profile, Historical Ledger & Private Autonomous Agent Blueprint**

* **Subject:** Raja Muhammad Ali Asghar (Ali CNC / Muhammad Ali)
* **Date Generated:** September 8, 2026
* **Location:** Rawalpindi / Sector F-11, Islamabad, Pakistan
* **Status:** Complete Intelligence & Architecture Summary

---

## Part 1: Primary Identity & Demographics

| Attribute | Recorded Value & Historical Details |
| :--- | :--- |
| **Full Legal / Operating Name** | Raja Muhammad Ali Asghar (also known as Muhammad Ali; operates professionally as Ali CNC) |
| **Date of Birth** | December 24, 2003 (Age: 22 as of 2026) |
| **Nationality & Residency** | Pakistani. Resident of Rawalpindi; maintains workshop operations in Sector F-11, Islamabad. |
| **Core Occupation & Title** | 2D / 2.5D / 3D CAD/CAM Designer, 3-Axis CNC Router Operator & Programmer, Additive Manufacturing Specialist. |
| **Personality Typology** | INTJ (Mastermind / Architect) |
| **Career Origin & Progression** | Began professional CNC router file designing and machining on September 7, 2025. Transitions between shops in early 2026 before consolidating operations under Ali CNC and expanding to 3D parametric CAD. |

---

## Part 2: Personal Relationships & Workshop Network

| Individual / Entity | Relationship / Role | Recorded Context & Association |
| :--- | :--- | :--- |
| **Ghulam Asghar (Raja Ghulam Asghar Abbasi)** | Father | Prominent local figure; served as President (Saddar) of the Tajran (Traders Association) in Pindora, Rawalpindi. |
| **Iftikhar (Iftikhar Bhai)** | Workshop Mentor & Boss | Senior woodworking and CNC craftsman; regarded as a primary mentor and father figure in precision routing. |
| **Haseeb** | Cousin | Close cousin; caretaker of Fargo the German Shepherd dog; subject of transaction and communication tracking. |
| **Fargo** | Family Dog (German Shepherd) | German Shepherd cared for alongside Haseeb in Rawalpindi. |
| **R M Faizan** | Cousin | Close family relation identified in personal records. |
| **Siblings** | Brother & Sister | Immediate family circle recorded in personal profile. |
| **Muneeb, Usama, Merab, Chacha** | Workshop Crew | Daily operating team in Sector F-11 workshop (trainees, associates, machine operators, and senior shop coworkers). |

---

## Part 3: Technical Skills, Tooling & Hardware Ecosystem

### Hardware Machinery & Manufacturing Rigs
* **CNC Router:** Hefei Mingda 1325 (3-Axis Industrial Wood Router), controlled via NC Studio motion control interface.
* **Machining Media:** MDF, Lasani, HDF, HDX, super-gloss acrylic/laminate panels, hardwoods.
* **Tooling Inventory:** Flat end mills, V-carve bits (60°, 90°), 6mm ball nose bits (for 3D relief finishing with climb milling).
* **3D Additive Manufacturing:** Bambu Lab A1 3D Printer running Bambu Studio for slicer optimization.
* **Custom Hardware Projects:** Designed an ESP32 / NodeMCU wireless Bluetooth remote pendant communicating with a custom Python background service on Windows to control NC Studio wirelessly.

### Software, CAD/CAM & Web Infrastructure
* **CAD/CAM & Engineering:** Vectric Aspire, Onshape 3D, Vector Magic Pro, Adobe Illustrator, KiCad EDA, KeyShot, CAMotics, PTC Creo, Siemens NX, Fusion 360, AutoCAD.
* **Web & Digital Operations:** Fully configured and secured primary web domain `alicnc.pk` via Cloudflare DNS, Vercel deployments, Zoho Mail MX/SPF/DKIM records, and DMCA.com content protection.
* **SVGV Format Development:** Developed `encoder.js`, an experimental binary vector format utilizing opcodes, 16-bit delta coordinates, mesh gradients, and raster patches.

### Personal Devices & Audio Equipment
* **Mobile Device:** POCO C85 running Xiaomi HyperOS; utilizes Termux, Onshape Mobile, VLC, and MPV.
* **Audio Monitoring Setup:** KZ Castor Pro (Bass Edition) IEMs driven by Conexant CX31993 USB-C DAC dongle; calibrated with Google Sound Amplifier and Poweramp Equalizer custom parametric EQ profiles.
* **Benchmark Audio Interests:** 64 Audio A18t, Sony IER-M500, SoundPEATS T3 Pro.

---

## Part 4: Major Projects & Chronology (2025–2026)

| Date / Window | Initiative / Application | Core Execution & Details |
| :--- | :--- | :--- |
| **June 2026** | TM-01 Trademark Application (ALI CNC) | Filed official Class 42 trademark application with IPO Pakistan covering CAD, 3D modeling, and engineering design services. Formally responded to examination notices in August 2026 (Application No. 890258). |
| **July 2026** | 80 Hexagon Interlocking Nesting | Engineered zero-waste puzzle nesting in Vectric Aspire cutting 80 identical interlocking MDF hexagons on a single sheet. |
| **July 2026** | TM-01 Trademark Application (AHYEON) | Submitted trademark application with IPO Pakistan under Class 9 for digital media and downloads. |
| **July 2026** | Lion Head 3D Relief Carving | Generated 3D mesh model using Hunyuan3D-2; engineered multi-layer slicing and toolpaths for 3-axis CNC router execution. |
| **August 2026** | Functional Inverted V-Carve QR Code | Converted, vectorized, and carved a scannable QR code panel in MDF using Vector Magic Pro, Adobe Illustrator, and Vectric Aspire. |
| **August 2026** | Municipal Civic Action (CDA / MCI) | Lodged formal civic complaint with Capital Development Authority regarding storm water road flooding outside the Sector F-11 workshop. |
| **September 2026** | Y Combinator W27 Application (Forge AI) | Authored application and one-minute founder video script for Forge AI—an AI-driven predictive tool breakage and spindle protection system for CNC routers. |

---

## Part 5: Personal Interests, Media & Cultural Preferences

| Category | Favorites & Dedicated Interests |
| :--- | :--- |
| **K-Pop Ultimate Bias** | BIBI (Ultimate bias, admired for genuine engagement) & Jung Ahyeon (정아현) of BABYMONSTER. |
| **Additional Biases & Groups** | Jennie (2nd bias), Lisa (original bias), Rosé, Jisoo. Follows BABYMONSTER, BLACKPINK, ILLIT, LE SSERAFIM, TWICE, NewJeans, IVE. |
| **K-Drama Passion** | Over 500+ Korean dramas completed. Key favorites include *Itaewon Class*, *Queen Seondeok*, *The Woman Who Swallowed the Sun*. High admiration for actresses Suzy, Jisoo, and IU. |
| **Motorsports & Gaming** | Follows Formula 1 Grand Prix racing. Custom scenario and map designer in Age of Mythology. |
| **Streaming Services** | Spotify, YouTube Music, Weverse. |

---

## Part 6: Full Architecture Blueprint – The Private Zero-Dollar Autonomous Agent

Summary of the end-to-end private agent system engineered to transition away from managed platform boundaries into complete data ownership:

### 1. The Storage & Data Fabric
* **Supabase PostgreSQL (Free Tier):** Acts as the system brain. Stores prompt templates (`agent_prompts`), raw chat sessions, parsed notices, and transaction state.
* **PostgreSQL tsvector Full-Text Search:** Provides deterministic lexical search over conversations and knowledge documents with GIN indexing (avoiding hallucinated embeddings for exact part numbers, names, and parameters).
* **Multi-Cloud Storage Hierarchy:**
  * **Cloudinary:** Stores phone screenshots and UI captures; runs on-the-fly image transformations and WebP compression before feeding payloads to Gemini Vision.
  * **Zoho WorkDrive & Google Drive:** Serves as long-term object storage for PDFs, backups, and invoices referenced via Supabase URI pointers.

### 2. On-Device Android Execution Engine (Zero-Root Architecture)
* **Bridge Layer:** Shizuku + `rish` running locally on Termux under UID 2000 (`Shell`). Replaces dangerous `su` root shells while granting full hardware UI control.
* **UI Automation:** Employs `uiautomator dump` for low-latency XML node hierarchy parsing (eliminating expensive multimodal OCR passes), paired with `input tap`, `input text`, and `screencap -p`.
* **Hardware Access:** Termux API handles direct notifications, SMS interception, battery states, and clipboard reads.
* **Safety Boundary (Human-in-the-Loop):** High-stakes actions (such as money transfers, loan authorizations, or bank interactions) are parsed into a pending ledger state. Execution halts at biometric authentication and system `FLAG_SECURE` boundaries, requiring physical confirmation.

### 3. Backend Orchestration & The 100% Free Keepalive Matrix
* **Inference Engine:** Google AI Studio Gemini API (Gemini Flash) with direct system instructions and function-calling schemas.
* **Render Web Service Router:** Free-tier container running Express or FastAPI for payload sanitization, failover handling, and long-running pipelines.
* **Keepalive Architecture (Bypassing Inactivity Sleeps):**
  * **cron-job.org Job A:** Fires an HTTP ping every 10–12 minutes to Render's `/internal/ping` endpoint. The route responds with `200 OK` immediately in-memory (0 DB dependencies) to keep Render awake 24/7 without exceeding the 750 free instance hours.
  * **cron-job.org Job B:** Triggers a lightweight Supabase query once every 24 hours, completely eliminating the 7-day Supabase inactivity database pause rule.
* **Development Framework:** Autonomous prototyping and artifact generation managed via Google Antigravity 2.0.
