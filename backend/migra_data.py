import sqlite3
import re
import json
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
JS_PATH = os.path.join(BASE_DIR, '../js/data.js')
DB_PATH = os.path.join(BASE_DIR, '../motos.db')


# Extrai apenas o array de objetos do arquivo JS
with open(JS_PATH, 'r', encoding='utf-8') as f:
    js = f.read()

# Pega só o trecho entre 'const PRODUCTS = [' e o primeiro '];'
array_match = re.search(r'const PRODUCTS = (\[.*?\]);', js, re.DOTALL)
if not array_match:
    raise Exception('Array de produtos não encontrado no data.js')
array_str = array_match.group(1)

# Corrige para JSON válido
def js_to_json(js_array):
    # Coloca aspas nas chaves
    js_array = re.sub(r'(\{|,|\[)\s*(\w+)\s*:', r'\1 "\2":', js_array)
    # Aspas duplas em strings
    js_array = js_array.replace("'", '"')
    # true/false para minúsculo
    js_array = js_array.replace('true', 'true').replace('false', 'false')
    # Remove vírgulas antes de ] ou }
    js_array = re.sub(r',\s*([\]}])', r'\1', js_array)
    return js_array

json_str = js_to_json(array_str)
products = json.loads(json_str)

conn = sqlite3.connect(DB_PATH)
c = conn.cursor()

for prod in products:
    c.execute('INSERT OR REPLACE INTO produtos (id, nome, preco, imagem, descricao, ativo) VALUES (?, ?, ?, ?, ?, ?)',
              (prod['id'], prod['nome'], prod['preco'], prod['imagem'], prod['descricao'], int(prod['ativo'])))
    for cons in prod['consorcios']:
        c.execute('INSERT INTO consorcios (produto_id, plano, valor) VALUES (?, ?, ?)',
                  (prod['id'], cons['plano'], cons['valor']))
    for cor in prod['cores']:
        c.execute('INSERT INTO cores (produto_id, cor) VALUES (?, ?)', (prod['id'], cor))

conn.commit()
conn.close()
print('Dados migrados com sucesso!')
