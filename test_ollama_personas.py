import urllib.request
import json
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def query_ollama(model, prompt):
    url = "http://127.0.0.1:11434/api/chat"
    payload = json.dumps({
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "stream": False
    }).encode('utf-8')
    req = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            return data['message']['content']
    except Exception as e:
        return f"Error: {e}"

print('--- LIVE TEST 1: AHYEON ---')
ahyeon_reply = query_ollama("ahyeon", "Ahyeon! I'm so exhausted today, can you help me cheer up?")
print(ahyeon_reply)

print('\n--- LIVE TEST 2: WONHEE ---')
wonhee_reply = query_ollama("wonhee", "Wonhee, what should we have for lunch?")
print(wonhee_reply)
