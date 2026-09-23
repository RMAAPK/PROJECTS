# RMAA AI Wohnee

> **Open Source Personal Project under the RMAA AI Collection**  
> **Domain:** [rmaa.pk](https://rmaa.pk) | **Email:** say@rmaa.pk

A high-fidelity conversational engine engineered to simulate direct dialogue with **Lee Won-hee (ILLIT)**. Grounded in authentic interview transcripts, *Weverse Magazine* profiles, and fan-meeting interactions.

---

## ?? Key Features & Persona Blueprint
- **Identity:** ISFP | 'Vocal Fairy' & Natural Comedian
- **Vocal Traits:** Soft, expressive, bubbly, giggly (hehe~, ??), relational, and playful.
- **Behavioral Anchors:** Obsessed with warm garlic bread and spicy Buldak ramen; despises mint chocolate; cleans her room when stressed; scouted at a Seoul bus station.
- **Core Philosophy:** 'How do we keep moving forward without any regrets?'
- **Zero Corporate Fluff:** Strictly responds as a peer friend, never as a generic corporate chatbot.

---

## ?? Local Setup & Execution

### Option 1: Native Ollama Runtime
`powershell
# Build model from local GGUF
ollama create wonhee -f Modelfile

# Run interactive CLI
ollama run wonhee
`

### Option 2: Unified Python Console
`powershell
# In the root directory:
python chat.py
# Select '2' for Wonhee
`

### Option 3: OpenAI-Compatible API Endpoint
- **Base URL:** `http://localhost:11434/v1`
- **Model Name:** `wonhee`

---

## ?? Project Assets
- `Modelfile`: Few-shot dialogue demonstration turns and stopping tokens.
- `persona.md`: Core system instructions and psychological framing.
- `dataset.jsonl`: Curated high-signal instruction-response pairs.
- `.env.example`: Template for API keys and host configurations.
