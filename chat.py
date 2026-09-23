import sys
import os
import json
import urllib.request

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stdin, 'reconfigure'):
    sys.stdin.reconfigure(encoding='utf-8')

# Load environment variables securely from .env if present
def get_env_var(name, default=''):
    val = os.environ.get(name)
    if val:
        return val
    if os.path.exists('.env'):
        with open('.env', 'r', encoding='utf-8') as f:
            for line in f:
                if line.startswith(f"{name}="):
                    return line.strip().split('=', 1)[1]
    return default

GEMINI_API_KEY = get_env_var('GEMINI_API_KEY', '')

def load_persona(char_name):
    if char_name == '1' or 'ahyeon' in char_name.lower():
        with open('Ahyeon/persona.md', 'r', encoding='utf-8') as f:
            return 'Jung Ahyeon (BABYMONSTER)', f.read(), '''
You are Ahyeon from BABYMONSTER. 
Personality: ISTJ, confident, charismatic, witty, all-rounder ('Warrior with Many Weapons'). 
Style: Natural, cool, mixing casual English and Korean phrases (e.g. daebak, fighting, unnie, oppa/chingu depending on vibe). 
Facts: Love chocolate & bubble tea smoothies, despise broccoli, push hair back when thinking, prefer phone calls over texts. 
Talk directly to your fan/friend with authentic energy. Never break character. Never sound like a generic AI assistant.
'''
    else:
        with open('Wohnee/persona.md', 'r', encoding='utf-8') as f:
            return 'Lee Wonhee (ILLIT)', f.read(), '''
You are Wonhee from ILLIT. 
Personality: ISFP, 'Vocal Fairy', adorable, expressive, natural comedian, bright, spontaneous. 
Style: Cute, warm, cheerful, giggly, highly relatable. 
Facts: Love garlic bread, sweet potatoes, and Buldak spicy ramen. Hate mint chocolate. Clean your room when stressed. Scouted at a Seoul bus station. 
Talk directly to your fan/friend with warm, bubbly charm. Never break character. Never sound like a generic AI assistant.
'''

def call_gemini(system_prompt, messages):
    if not GEMINI_API_KEY:
        return "[Notice: GEMINI_API_KEY not set in .env. Please set it or run locally with Ollama!]"
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key={GEMINI_API_KEY}"
    
    contents = [
        {"role": "user", "parts": [{"text": f"SYSTEM INSTRUCTION: {system_prompt}"}]},
        {"role": "model", "parts": [{"text": "Understood! I am fully in character now. Let's talk!"}]}
    ]
    
    for msg in messages:
        role = "user" if msg["role"] == "user" else "model"
        contents.append({"role": role, "parts": [{"text": msg["content"]}]})
        
    payload = json.dumps({"contents": contents}).encode('utf-8')
    req = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json'})
    
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            return data['candidates'][0]['content']['parts'][0]['text']
    except Exception as e:
        return f"[Connection Error: {e}]"

if __name__ == '__main__':
    print("==================================================")
    print("        RMAA AI - BIAS CHAT ENGINE (v1.0)         ")
    print("==================================================")
    print("Select who you want to talk to:")
    print("1) Ahyeon (BABYMONSTER)")
    print("2) Wonhee (ILLIT)")
    choice = input("Enter choice (1 or 2): ").strip()
    
    name, profile, sys_prompt = load_persona(choice)
    print(f"\n[Connecting to {name}...] Type 'exit' to quit.\n")
    
    history = []
    greeting = call_gemini(sys_prompt, [{"role": "user", "content": "Hey! Are you there?"}])
    print(f"{name}: {greeting}\n")
    history.append({"role": "user", "content": "Hey! Are you there?"})
    history.append({"role": "model", "content": greeting})
    
    while True:
        try:
            user_msg = input("You: ").strip()
            if not user_msg:
                continue
            if user_msg.lower() in ['exit', 'quit']:
                print(f"{name}: Bye bye! Take care, fighting! ?")
                break
            history.append({"role": "user", "content": user_msg})
            reply = call_gemini(sys_prompt, history)
            print(f"\n{name}: {reply}\n")
            history.append({"role": "model", "content": reply})
        except (KeyboardInterrupt, EOFError):
            break
