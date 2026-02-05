import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), '../carrossel.db')

conn = sqlite3.connect(DB_PATH)
c = conn.cursor()

c.execute('''
CREATE TABLE IF NOT EXISTS imagens_carrossel (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    url TEXT NOT NULL,
    ordem INTEGER DEFAULT 0
)
''')

conn.commit()
conn.close()
print('Banco de imagens do carrossel criado com sucesso!')
