
import os
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import sqlite3
import glob

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

# Configuração de upload
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'static', 'carrossel')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Rota principal - serve index.html
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

# Rota para servir arquivos HTML
@app.route('/<path:filename>')
def serve_files(filename):
    if os.path.exists(filename):
        return send_from_directory('.', filename)
    return "Arquivo não encontrado", 404

# Banco de imagens do carrossel
CARROSSEL_DB = os.path.join(os.path.dirname(__file__), 'carrossel.db')

def get_carrossel_db():
    conn = sqlite3.connect(CARROSSEL_DB)
    conn.row_factory = sqlite3.Row
    return conn

# Upload de imagem do carrossel
@app.route('/carrossel/upload', methods=['POST'])
def upload_carrossel():
    # Garante que a pasta existe
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    if 'file' not in request.files:
        return jsonify({'erro': 'Nenhum arquivo enviado'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'erro': 'Nome de arquivo vazio'}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(save_path)
        url = f'/static/carrossel/{filename}'
        # Salva no banco (evita duplicidade)
        conn = get_carrossel_db()
        conn.execute('DELETE FROM imagens_carrossel WHERE filename = ?', (filename,))
        conn.execute('INSERT INTO imagens_carrossel (filename, url) VALUES (?, ?)', (filename, url))
        conn.commit()
        conn.close()
        return jsonify({'url': url})
    return jsonify({'erro': 'Arquivo não permitido'}), 400

# Listar imagens do carrossel
@app.route('/carrossel/list', methods=['GET'])
def list_carrossel():
    conn = get_carrossel_db()
    imagens = conn.execute('SELECT id, filename, url FROM imagens_carrossel ORDER BY ordem, id').fetchall()
    conn.close()
    return jsonify([{'id': img['id'], 'filename': img['filename'], 'url': img['url']} for img in imagens])

# Excluir imagem do carrossel
@app.route('/carrossel/delete', methods=['POST'])
def delete_carrossel():
    data = request.json
    filename = data.get('filename')
    if not filename:
        return jsonify({'erro': 'Arquivo não especificado'}), 400
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], os.path.basename(filename))
    # Remove do banco
    conn = get_carrossel_db()
    conn.execute('DELETE FROM imagens_carrossel WHERE filename = ?', (os.path.basename(filename),))
    conn.commit()
    conn.close()
    # Remove arquivo físico
    if os.path.exists(file_path):
        os.remove(file_path)
        return jsonify({'ok': True})
    return jsonify({'ok': True})

DB_PATH = os.path.join(os.path.dirname(__file__), 'motos.db')

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def get_motos():
    conn = get_db_connection()
    produtos = conn.execute('SELECT * FROM produtos').fetchall()
    motos = []
    for prod in produtos:
        consorcios = conn.execute('SELECT plano, valor FROM consorcios WHERE produto_id = ?', (prod['id'],)).fetchall()
        cores = conn.execute('SELECT cor FROM cores WHERE produto_id = ?', (prod['id'],)).fetchall()
        motos.append({
            'id': prod['id'],
            'nome': prod['nome'],
            'preco': prod['preco'],
            'imagem': prod['imagem'],
            'descricao': prod['descricao'],
            'categoria': prod['categoria'] if 'categoria' in prod.keys() else None,
            'subcategoria': prod['subcategoria'] if 'subcategoria' in prod.keys() else None,
            'cilindrada': prod['cilindrada'] if 'cilindrada' in prod.keys() else None,
            'ativo': bool(prod['ativo']),
            'consorcios': [dict(c) for c in consorcios],
            'cores': [c['cor'] for c in cores]
        })
    conn.close()
    return motos

# Inicializa banco com campos necessários
def init_db():
    conn = get_db_connection()
    # Verifica e adiciona coluna categoria se não existir
    try:
        conn.execute('ALTER TABLE produtos ADD COLUMN categoria TEXT')
        conn.commit()
    except:
        pass
    # Verifica e adiciona coluna subcategoria se não existir
    try:
        conn.execute('ALTER TABLE produtos ADD COLUMN subcategoria TEXT')
        conn.commit()
    except:
        pass
    # Verifica e adiciona coluna cilindrada se não existir
    try:
        conn.execute('ALTER TABLE produtos ADD COLUMN cilindrada INTEGER')
        conn.commit()
    except:
        pass
    conn.close()

# Rota para adicionar uma nova moto ao banco de dados
@app.route('/motos', methods=['POST'])
def adicionar_moto():
    data = request.json
    if not data:
        return jsonify({'erro': 'Dados ausentes'}), 400
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO produtos (nome, preco, imagem, descricao, categoria, subcategoria, cilindrada, ativo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                   (data.get('nome'), data.get('preco'), data.get('imagem'), data.get('descricao'), 
                    data.get('categoria'), data.get('subcategoria'), data.get('cilindrada'), int(data.get('ativo', True))))
    produto_id = cursor.lastrowid
    # Consórcios
    for cons in data.get('consorcios', []):
        cursor.execute('INSERT INTO consorcios (produto_id, plano, valor) VALUES (?, ?, ?)',
                       (produto_id, cons.get('plano'), cons.get('valor')))
    # Cores
    for cor in data.get('cores', []):
        cursor.execute('INSERT INTO cores (produto_id, cor) VALUES (?, ?)', (produto_id, cor))
    conn.commit()
    conn.close()
    return jsonify({'id': produto_id}), 201


# Rota para atualizar uma moto
@app.route('/motos/<int:id>', methods=['PUT'])
def atualizar_moto(id):
    data = request.json
    if not data:
        return jsonify({'erro': 'Dados ausentes'}), 400
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''UPDATE produtos SET nome=?, preco=?, imagem=?, descricao=?, categoria=?, subcategoria=?, cilindrada=?, ativo=? WHERE id=?''',
                   (data.get('nome'), data.get('preco'), data.get('imagem'), data.get('descricao'),
                    data.get('categoria'), data.get('subcategoria'), data.get('cilindrada'), int(data.get('ativo', True)), id))
    # Atualiza consórcios
    cursor.execute('DELETE FROM consorcios WHERE produto_id = ?', (id,))
    for cons in data.get('consorcios', []):
        cursor.execute('INSERT INTO consorcios (produto_id, plano, valor) VALUES (?, ?, ?)',
                       (id, cons.get('plano'), cons.get('valor')))
    # Atualiza cores
    cursor.execute('DELETE FROM cores WHERE produto_id = ?', (id,))
    for cor in data.get('cores', []):
        cursor.execute('INSERT INTO cores (produto_id, cor) VALUES (?, ?)', (id, cor))
    conn.commit()
    conn.close()
    return jsonify({'ok': True})


@app.route('/motos', methods=['GET'])
def listar_motos():
    return jsonify(get_motos())



# Rota para deletar uma moto do banco de dados
@app.route('/motos/<int:id>', methods=['DELETE'])
def deletar_moto(id):
    conn = get_db_connection()
    # Remove consórcios e cores relacionados
    conn.execute('DELETE FROM consorcios WHERE produto_id = ?', (id,))
    conn.execute('DELETE FROM cores WHERE produto_id = ?', (id,))
    # Remove o produto
    result = conn.execute('DELETE FROM produtos WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    if result.rowcount:
        return '', 204
    else:
        return jsonify({'erro': 'Moto não encontrada'}), 404


@app.route('/health', methods=['GET'])
def health():
    """Health endpoint for container orchestration and monitoring."""
    return jsonify({'status': 'ok'})


# Health endpoint for container orchestration
if 'health_check' not in app.view_functions:
    @app.route('/health', methods=['GET'], endpoint='health_check')
    def health_check():
        return jsonify({'status': 'ok'}), 200

if __name__ == '__main__':
    init_db()  # Inicializa/atualiza estrutura do banco
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', '0') == '1'
    app.run(host='0.0.0.0', port=port, debug=debug)
