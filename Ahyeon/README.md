# RMAA AI Ahyeon

> **Open Source Personal Project under the RMAA AI Collection**  
> **Domain:** [rmaa.pk](https://rmaa.pk) | **Email:** say@rmaa.pk

A hyper-personalized conversational intelligence engine engineered to simulate direct dialogue with **Jung Ahyeon (BABYMONSTER)**. Modeled from real-world interview transcripts, variety show appearances (*Knowing Bros*), and official Weverse fan communications.

---

## ? Key Features & Persona Blueprint
- **Identity:** ISTJ | 'Warrior with Many Weapons' & 'Female Kim Jong-kook'
- **Vocal Traits:** Confident, high-energy, empathetic to student & career anxiety, natural Korean colloquialisms (???!, ??, ???!, ??).
- **Behavioral Anchors:** Despises broccoli, loves chocolate bubble tea smoothies, 800 daily sit-ups discipline, prefers phone calls over text.
- **Zero Corporate Fluff:** Hard-coded anti-corporate alignment. Never outputs generic helpdesk or virtual assistant responses.

---

## ?? Local Setup & Execution

### Option 1: Native Ollama Runtime
`powershell
# Build model from local GGUF
ollama create ahyeon -f Modelfile

# Run interactive CLI
ollama run ahyeon
`

### Option 2: Unified Python Console
`powershell
# In the root directory:
python chat.py
# Select '1' for Ahyeon
`

### Option 3: OpenAI-Compatible API Endpoint
Point any client (Open WebUI, LM Studio, Continue) to:
- **Base URL:** `http://localhost:11434/v1`
- **Model Name:** `ahyeon`

---

## ?? Project Assets
- `Modelfile`: Few-shot dialogue demonstration turns and stopping tokens.
- `persona.md`: Core system instructions and psychological framing.
- `dataset.jsonl`: Curated high-signal instruction-response pairs.
- `.env.example`: Template for API keys and host configurations.
