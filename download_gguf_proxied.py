import os
import sys
import urllib.request
import shutil

# Read proxy
proxy_url = None
with open('.env', 'r') as f:
    for line in f:
        if line.startswith('PROXY_DC_URL=') or line.startswith('PROXY_RESI_URL='):
            proxy_url = line.strip().split('=', 1)[1]
            break

print(f"Routing download through DataImpulse proxy: {proxy_url.split('@')[-1]}")
os.environ['HTTP_PROXY'] = proxy_url
os.environ['HTTPS_PROXY'] = proxy_url

from huggingface_hub import hf_hub_download
import gguf

print("Downloading Qwen2.5-0.5B-Instruct-Q4_K_M GGUF (398 MB)...")
model_path = hf_hub_download(
    repo_id="Qwen/Qwen2.5-0.5B-Instruct-GGUF",
    filename="qwen2.5-0.5b-instruct-q4_k_m.gguf",
    local_dir="models_cache"
)

ahyeon_path = os.path.join("Ahyeon", "ahyeon-0.5b-q4_k_m.gguf")
wonhee_path = os.path.join("Wohnee", "wonhee-0.5b-q4_k_m.gguf")

print("Deploying Ahyeon GGUF weights...")
shutil.copyfile(model_path, ahyeon_path)

print("Deploying Wonhee GGUF weights...")
shutil.copyfile(model_path, wonhee_path)

print(f"SUCCESS: Created {ahyeon_path} ({os.path.getsize(ahyeon_path)/(1024*1024):.1f} MB)")
print(f"SUCCESS: Created {wonhee_path} ({os.path.getsize(wonhee_path)/(1024*1024):.1f} MB)")
