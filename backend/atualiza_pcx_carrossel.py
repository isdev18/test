c = conn.cursor()

import sqlite3

# Caminho do banco de dados
DB_PATH = 'carrossel.db'

# Caminho correto da imagem azul da PCX
NOVO_CAMINHO = 'static/carrossel/pcx.png'
NOME_PCX = 'pcx.png'

conn = sqlite3.connect(DB_PATH)
c = conn.cursor()

# Atualiza o caminho da imagem da PCX na tabela correta
c.execute("UPDATE imagens_carrossel SET url = ? WHERE filename = ?", (NOVO_CAMINHO, NOME_PCX))

# Se não existir, insere
if c.rowcount == 0:
    c.execute("INSERT INTO imagens_carrossel (filename, url, ordem) VALUES (?, ?, 0)", (NOME_PCX, NOVO_CAMINHO))

conn.commit()
conn.close()

print('Imagem da PCX azul atualizada no banco!')
