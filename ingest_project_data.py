import sqlite3
import json
import os

db_path = 'unified.db'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

cursor.execute('''
CREATE TABLE IF NOT EXISTS project_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_folder TEXT,
    file_name TEXT,
    category TEXT,
    title TEXT,
    content TEXT,
    ingested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
''')

# 1. Ingest from Website/src/data/blogs.json
blogs_path = r'C:\Users\Muhammad Ali\Desktop\RMAA AI\Website\src\data\blogs.json'
if os.path.exists(blogs_path):
    with open(blogs_path, 'r', encoding='utf-8') as f:
        blogs = json.load(f)
        for blog in blogs:
            cursor.execute('''
            INSERT INTO project_data (source_folder, file_name, category, title, content)
            VALUES (?, ?, ?, ?, ?)
            ''', ('Website', 'blogs.json', blog.get('category', 'Blog'), blog.get('title', ''), blog.get('content', '')))
    print(f"Ingested {len(blogs)} entries from Website blogs.json")

# 2. Ingest from Private folder markdown files
private_dir = r'C:\Users\Muhammad Ali\Desktop\RMAA AI\Private'
docs_to_ingest = ['GEMINI.md', 'API_DOCUMENTATION.md', 'README.md']

for doc in docs_to_ingest:
    doc_path = os.path.join(private_dir, doc)
    if os.path.exists(doc_path):
        with open(doc_path, 'r', encoding='utf-8') as f:
            content = f.read()
            cursor.execute('''
            INSERT INTO project_data (source_folder, file_name, category, title, content)
            VALUES (?, ?, ?, ?, ?)
            ''', ('Private', doc, 'Documentation', doc, content))
            print(f"Ingested {doc} from Private folder")

conn.commit()
conn.close()
print("Data successfully committed to unified.db")
