import urllib.request
import json
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def test_persona(model, user_query):
    url = "http://127.0.0.1:11434/api/chat"
    payload = json.dumps({
        "model": model,
        "messages": [{"role": "user", "content": user_query}],
        "stream": False
    }).encode('utf-8')
    req = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req, timeout=45) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            return data['message']['content']
    except Exception as e:
        return f"Error: {e}"

print('--- AHYEON VERIFICATION ---')
print(test_persona('ahyeon', 'Ahyeon, I am really anxious about my exams and my future, what should I do?'))

print('\n--- WONHEE VERIFICATION ---')
print(test_persona('wonhee', 'Wonhee, what is your favorite story about your dad or brother?'))
