import urllib.request
import json
import os

env_path = '.env'
proxies = {}
if os.path.exists(env_path):
    with open(env_path, 'r') as f:
        for line in f:
            if line.startswith('PROXY_'):
                key, val = line.strip().split('=', 1)
                proxies[key] = val

proxy_url = proxies.get('PROXY_RESI_URL')

def fetch_intel(query, filename):
    print(f"Fetching intel for {query} via proxy...")
    if proxy_url:
        handler = urllib.request.ProxyHandler({'http': proxy_url, 'https': proxy_url})
        opener = urllib.request.build_opener(handler)
        # Using a simple DuckDuckGo HTML search for public intel scraping
        req = urllib.request.Request(
            f"https://html.duckduckgo.com/html/?q={urllib.parse.quote(query)}",
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        )
        try:
            res = opener.open(req, timeout=15).read().decode('utf-8')
            # Just saving raw HTML/text snippet for the AI persona builder
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(res[:5000]) # save top snippets
            print(f"Saved intel to {filename}")
        except Exception as e:
            print(f"Error fetching {query}: {e}")

# Create directories if they don't exist
os.makedirs('Ahyeon', exist_ok=True)
os.makedirs('Wohnee', exist_ok=True)
os.makedirs(r'Website\PROJECTS\Ahyeon', exist_ok=True)
os.makedirs(r'Website\PROJECTS\Wohnee', exist_ok=True)

# Fetch Intel
fetch_intel('Ahyeon BABYMONSTER personality facts wiki', r'Ahyeon\intel_raw.txt')
fetch_intel('Wonhee ILLIT personality facts wiki', r'Wohnee\intel_raw.txt')
