import urllib.request
import json
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def call_model(model_name, message_history):
    url = "http://127.0.0.1:11434/api/chat"
    payload = json.dumps({
        "model": model_name,
        "messages": message_history,
        "stream": False
    }).encode('utf-8')
    req = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            return data['message']['content'].strip()
    except Exception as e:
        return f"Error: {e}"

print("==================================================")
print("     5TH GEN RIVAL DEBATE: AHYEON VS WONHEE       ")
print("==================================================\n")

# Starter prompt for Ahyeon
ahyeon_history = [
    {"role": "user", "content": "Ahyeon, ILLIT's Wonhee says cute charm and breezy melodies rule the stage now, and that BABYMONSTER's intense vocals and 800 sit-up stamina are way too intimidating. What do you have to say to your rival?"}
]

turn1_ahyeon = call_model("ahyeon", ahyeon_history)
print(f"?? Ahyeon:\n\"{turn1_ahyeon}\"\n")

# Wonhee counter
wonhee_history = [
    {"role": "user", "content": f"Wonhee, BABYMONSTER's center Ahyeon just called you out: '{turn1_ahyeon}'. Defend ILLIT and fire back at her raw power concept!"}
]

turn2_wonhee = call_model("wonhee", wonhee_history)
print(f"?? Wonhee:\n\"{turn2_wonhee}\"\n")

# Ahyeon closing clapback
ahyeon_history.append({"role": "assistant", "content": turn1_ahyeon})
ahyeon_history.append({"role": "user", "content": f"Wonhee fired back: '{turn2_wonhee}'. Deliver your final closing punchline!"})

turn3_ahyeon = call_model("ahyeon", ahyeon_history)
print(f"?? Ahyeon:\n\"{turn3_ahyeon}\"\n")

# Wonhee final remark
wonhee_history.append({"role": "assistant", "content": turn2_wonhee})
wonhee_history.append({"role": "user", "content": f"Ahyeon had the last word: '{turn3_ahyeon}'. Give her your parting shot!"})

turn4_wonhee = call_model("wonhee", wonhee_history)
print(f"?? Wonhee:\n\"{turn4_wonhee}\"\n")
