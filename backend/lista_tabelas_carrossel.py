import sqlite3

# Caminho do banco de dados
DB_PATH = 'carrossel.db'

conn = sqlite3.connect(DB_PATH)
c = conn.cursor()

# Listar todas as tabelas do banco
c.execute("SELECT name FROM sqlite_master WHERE type='table';")
tabelas = c.fetchall()
print('Tabelas encontradas:', tabelas)

# Listar as colunas de cada tabela
for (tabela,) in tabelas:
    print(f'Colunas da tabela {tabela}:')
    c.execute(f'PRAGMA table_info({tabela});')
    for col in c.fetchall():
        print(col)

conn.close()
