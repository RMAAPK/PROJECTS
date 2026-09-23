import sqlite3
conn = sqlite3.connect('unified.db')
cursor = conn.cursor()

print('======== YOUR PERSONAL KNOWLEDGE BASE ========')
cursor.execute("SELECT title FROM project_data WHERE source_folder='Website' LIMIT 5")
print('\n[Website Data - Top 5 Entries]')
for row in cursor.fetchall():
    print(f"- {row[0]}")

cursor.execute("SELECT file_name, content FROM project_data WHERE source_folder='Private'")
print('\n[Private Project Docs]')
for row in cursor.fetchall():
    print(f"\n>> {row[0]}:")
    print(row[1][:300] + '... [TRUNCATED]')
conn.close()
