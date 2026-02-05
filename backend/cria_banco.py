import sqlite3

# Criação do banco e tabelas
conn = sqlite3.connect('motos.db')
c = conn.cursor()

# Tabela principal de produtos
c.execute('''
CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY,
    nome TEXT,
    preco TEXT,
    imagem TEXT,
    descricao TEXT,
    ativo BOOLEAN
)
''')

# Tabela de consórcios
c.execute('''
CREATE TABLE IF NOT EXISTS consorcios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    produto_id INTEGER,
    plano TEXT,
    valor TEXT,
    FOREIGN KEY(produto_id) REFERENCES produtos(id)
)
''')

# Tabela de cores
c.execute('''
CREATE TABLE IF NOT EXISTS cores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    produto_id INTEGER,
    cor TEXT,
    FOREIGN KEY(produto_id) REFERENCES produtos(id)
)
''')

conn.commit()
conn.close()
print('Banco e tabelas criados com sucesso!')
