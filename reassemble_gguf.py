import os
import sys

def reassemble(parts_dir, output_file):
    if not os.path.exists(parts_dir):
        print(f"Parts directory not found: {parts_dir}")
        return False
    parts = sorted([os.path.join(parts_dir, f) for f in os.listdir(parts_dir) if '.part' in f])
    if not parts:
        print(f"No parts found in {parts_dir}")
        return False
        
    print(f"Reassembling {len(parts)} parts into {output_file}...")
    with open(output_file, 'wb') as outfile:
        for p in parts:
            with open(p, 'rb') as pf:
                outfile.write(pf.read())
                
    size_mb = os.path.getsize(output_file) / (1024 * 1024)
    print(f"[SUCCESS] Reassembled {output_file} ({size_mb:.2f} MB)")
    return True

if __name__ == '__main__':
    print("==================================================")
    print("      RMAA AI - GGUF REASSEMBLY SENTINEL          ")
    print("==================================================")
    reassemble("Ahyeon/weights_parts", "Ahyeon/ahyeon-0.5b-q4_k_m.gguf")
    reassemble("Wohnee/weights_parts", "Wohnee/wonhee-0.5b-q4_k_m.gguf")
    print("\nModels are ready for Ollama creation (`ollama create ... -f Modelfile`).")
