import os
import sys

CHUNK_SIZE = 48 * 1024 * 1024  # 48 MB (safely under 50 MB)

def split_file(file_path, output_dir):
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return []
    os.makedirs(output_dir, exist_ok=True)
    base_name = os.path.basename(file_path)
    part_files = []
    
    with open(file_path, 'rb') as f:
        part_num = 0
        while True:
            chunk = f.read(CHUNK_SIZE)
            if not chunk:
                break
            part_name = f"{base_name}.part{part_num:02d}"
            part_path = os.path.join(output_dir, part_name)
            with open(part_path, 'wb') as pf:
                pf.write(chunk)
            part_files.append(part_path)
            print(f"Created: {part_path} ({len(chunk)/(1024*1024):.2f} MB)")
            part_num += 1
            
    print(f"Successfully split {file_path} into {len(part_files)} chunks.")
    return part_files

print("Splitting Ahyeon GGUF...")
split_file("Ahyeon/ahyeon-0.5b-q4_k_m.gguf", "Ahyeon/weights_parts")

print("\nSplitting Wonhee GGUF...")
split_file("Wohnee/wonhee-0.5b-q4_k_m.gguf", "Wohnee/weights_parts")
