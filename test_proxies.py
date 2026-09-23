import urllib.request
import json

env_path = '.env'
proxies_to_test = {}

with open(env_path, 'r') as f:
    for line in f:
        if line.startswith('PROXY_'):
            key, val = line.strip().split('=', 1)
            proxies_to_test[key] = val

print(f'Found {len(proxies_to_test)} proxies from DataImpulse.')

for name, url in proxies_to_test.items():
    print(f'Testing {name}...')
    try:
        proxy_handler = urllib.request.ProxyHandler({'http': url, 'https': url})
        opener = urllib.request.build_opener(proxy_handler)
        req = urllib.request.Request('http://api.ipify.org?format=json')
        response = opener.open(req, timeout=15)
        data = json.loads(response.read().decode('utf-8'))
        print(f'  ? [SUCCESS] {name} -> Proxied IP: {data.get("ip")}')
    except Exception as e:
        print(f'  ? [FAILED] {name} -> {e}')
