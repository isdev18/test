import os
import shutil
import sqlite3

CSS_IMG_DIR = os.path.join(os.path.dirname(__file__), '../css')
CARROSSEL_DIR = os.path.join(os.path.dirname(__file__), '../static/carrossel')
DB_PATH = os.path.join(os.path.dirname(__file__), '../carrossel.db')

# Lista de imagens a importar
imagens = [
    'bros.jpg',
    'fan.jpg',
    'imgDeskctop.png',
    'IMGRonald.jpeg',
    'pcx.jpg',
    'twister.jpg',
    'XRE.jpg'
]

conn = sqlite3.connect(DB_PATH)
c = conn.cursor()

for img in imagens:
    src = os.path.join(CSS_IMG_DIR, img)
    dst = os.path.join(CARROSSEL_DIR, img)
    if os.path.exists(src):
        shutil.copy2(src, dst)
        url = f'/static/carrossel/{img}'
        c.execute('INSERT INTO imagens_carrossel (filename, url) VALUES (?, ?)', (img, url))
        print(f'Importada: {img}')
    else:
        print(f'Não encontrada: {img}')

conn.commit()
conn.close()
print('Importação concluída.')
