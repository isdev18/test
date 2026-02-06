import os
import sqlite3
import requests
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename


app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)


# ===============================
# CONFIG
# ===============================

GOOGLE_API = "https://script.google.com/macros/s/AKfycbzK9VqA5SNt9Zavp2D2FkU3hAWNU928OdzR0k888FLFLrqNAsRapKUnaklmaYuVvobY/exec"

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'static', 'carrossel')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

CARROSSEL_DB = os.path.join(os.path.dirname(__file__), 'carrossel.db')


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def get_carrossel_db():
    conn = sqlite3.connect(CARROSSEL_DB)
    conn.row_factory = sqlite3.Row
    return conn


# ===============================
# ROTAS PÚBLICAS
# ===============================


@app.route('/')
def index():
    return send_from_directory('.', 'index.html')


@app.route('/<path:filename>')
def serve_files(filename):
    if os.path.exists(filename):
        return send_from_directory('.', filename)
    return "Arquivo não encontrado", 404


# ===============================
# CARROSSEL (UPLOAD / LIST / DELETE)
# ===============================


@app.route('/carrossel/upload', methods=['POST'])
def upload_carrossel():
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    if 'file' not in request.files:
        return jsonify({'erro': 'Nenhum arquivo enviado'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'erro': 'Nome vazio'}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(save_path)

        url = f'/static/carrossel/{filename}'

        conn = get_carrossel_db()
        conn.execute('CREATE TABLE IF NOT EXISTS imagens_carrossel (id INTEGER PRIMARY KEY AUTOINCREMENT, filename TEXT, url TEXT)')
        conn.execute('DELETE FROM imagens_carrossel WHERE filename = ?', (filename,))
        conn.execute('INSERT INTO imagens_carrossel (filename, url) VALUES (?, ?)', (filename, url))
        conn.commit()
        conn.close()

        return jsonify({'url': url})

    return jsonify({'erro': 'Arquivo não permitido'}), 400


@app.route('/carrossel/list', methods=['GET'])
def list_carrossel():
    conn = get_carrossel_db()
    conn.execute('CREATE TABLE IF NOT EXISTS imagens_carrossel (id INTEGER PRIMARY KEY AUTOINCREMENT, filename TEXT, url TEXT)')
    imagens = conn.execute('SELECT id, filename, url FROM imagens_carrossel ORDER BY id DESC').fetchall()
    conn.close()

    return jsonify([{'id': img['id'], 'filename': img['filename'], 'url': img['url']} for img in imagens])


@app.route('/carrossel/delete', methods=['POST'])
def delete_carrossel():
    data = request.get_json() or {}
    filename = data.get('filename')

    if not filename:
        return jsonify({'erro': 'Arquivo não especificado'}), 400

    file_path = os.path.join(app.config['UPLOAD_FOLDER'], os.path.basename(filename))

    conn = get_carrossel_db()
    conn.execute('DELETE FROM imagens_carrossel WHERE filename = ?', (os.path.basename(filename),))
    conn.commit()
    conn.close()

    if os.path.exists(file_path):
        try:
            os.remove(file_path)
        except Exception:
            pass

    return jsonify({'ok': True})


# ===============================
# INTEGRAÇÃO GOOGLE SHEETS (MOTOS)
# ===============================


@app.route('/motos', methods=['GET'])
def listar_motos():
    try:
        r = requests.get(GOOGLE_API, timeout=10)
        data = r.json()
        return jsonify(data)
    except Exception as e:
        print("Erro ao buscar Google Sheets:", e)
        return jsonify([])


@app.route('/health')
def health():
    return jsonify({"status": "ok"})


@app.route('/admin/add_moto', methods=['POST'])
def add_moto():
    """Adiciona moto: encaminha o JSON recebido para o Apps Script com action=add."""
    data = request.get_json() or {}
    try:
        r = requests.post(GOOGLE_API + "?action=add", json=data, timeout=10)
        r.raise_for_status()
        try:
            resp = r.json()
        except ValueError:
            return jsonify({'status': 'error', 'detail': 'Invalid JSON from Apps Script', 'text': r.text}), 502
        return jsonify(resp)
    except requests.RequestException as e:
        return jsonify({'status': 'error', 'error': str(e)}), 502


@app.route('/admin/delete_moto', methods=['POST'])
def delete_moto():
    """Deleta moto: envia {"id":...} para Apps Script com action=delete."""
    data = request.get_json() or {}
    try:
        r = requests.post(GOOGLE_API + "?action=delete", json=data, timeout=10)
        r.raise_for_status()
        try:
            resp = r.json()
        except ValueError:
            return jsonify({'status': 'error', 'detail': 'Invalid JSON from Apps Script', 'text': r.text}), 502
        return jsonify(resp)
    except requests.RequestException as e:
        return jsonify({'status': 'error', 'error': str(e)}), 502


@app.route('/admin/edit_moto', methods=['POST'])
def edit_moto():
    """Edita moto: envia JSON para Apps Script com action=edit."""
    data = request.get_json() or {}
    try:
        r = requests.post(GOOGLE_API + "?action=edit", json=data, timeout=10)
        r.raise_for_status()
        try:
            resp = r.json()
        except ValueError:
            return jsonify({'status': 'error', 'detail': 'Invalid JSON from Apps Script', 'text': r.text}), 502
        return jsonify(resp)
    except requests.RequestException as e:
        return jsonify({'status': 'error', 'error': str(e)}), 502




if __name__ == '__main__':
    # Segurança ao ler a porta da env var: valores inválidos (ex: "$PORT") não devem quebrar o app.
    port_env = os.environ.get('PORT')
    try:
        if port_env is None or port_env == '':
            port = 5000
        else:
            port = int(port_env)
            if not (1 <= port <= 65535):
                raise ValueError('porta fora do intervalo')
    except Exception:
        print(f"AVISO: variável PORT inválida ({port_env!r}), usando 5000")
        port = 5000

    app.run(host='0.0.0.0', port=port, debug=True)
