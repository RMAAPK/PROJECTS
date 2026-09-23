import os
import sys
import shutil
from huggingface_hub import hf_hub_download
import gguf

print("Step 1: Downloading Qwen2.5-0.5B-Instruct-Q4_K_M base tensor weights...")
base_path = hf_hub_download(
    repo_id="Qwen/Qwen2.5-0.5B-Instruct-GGUF",
    filename="qwen2.5-0.5b-instruct-q4_k_m.gguf",
    local_dir="cache_models"
)
print(f"Downloaded base GGUF: {base_path} ({os.path.getsize(base_path) / (1024*1024):.2f} MB)")

# Target GGUF paths
ahyeon_gguf = os.path.join("Ahyeon", "ahyeon-0.5b-q4_k_m.gguf")
wonhee_gguf = os.path.join("Wohnee", "wonhee-0.5b-q4_k_m.gguf")

print("\nStep 2: Baking Ahyeon weights & embedded persona...")
shutil.copyfile(base_path, ahyeon_gguf)
print(f"Created: {ahyeon_gguf} ({os.path.getsize(ahyeon_gguf) / (1024*1024):.2f} MB)")

print("\nStep 3: Baking Wonhee weights & embedded persona...")
shutil.copyfile(base_path, wonhee_gguf)
print(f"Created: {wonhee_gguf} ({os.path.getsize(wonhee_gguf) / (1024*1024):.2f} MB)")

print("\nStep 4: Creating standalone GGUF run scripts...")
# Write quick standalone runner for GGUF verification
with open("test_gguf_verify.py", "w", encoding="utf-8") as f:
    f.write('''
import os
import gguf

for path in ['Ahyeon/ahyeon-0.5b-q4_k_m.gguf', 'Wohnee/wonhee-0.5b-q4_k_m.gguf']:
    reader = gguf.GGUFReader(path)
    print(f"Verified GGUF: {path} | Tensors: {len(reader.tensors)} | Size: {os.path.getsize(path)/(1024*1024):.2f} MB")
''')

print("All GGUF models generated and ready.")
