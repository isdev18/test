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

GOOGLE_API = "https://script.google.com/macros/s/AKfycbwtyQTUTE9wP7UjHQvcJXolbMxoDZM7nraTczVdc-VV0T4VidhZLMiNDFcRKy7yWzQB/exec"

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


# Helper para chamadas ao Apps Script (padroniza logs e tratamento)
def call_google(action, payload=None, method='POST'):
    url = GOOGLE_API + f"?action={action}"
    try:
        print(f"CHAMANDO APPS SCRIPT: {url} payload={payload}")
        if method == 'GET':
            r = requests.get(url, timeout=10)
        else:
            r = requests.post(url, json=payload, timeout=10)
        # sempre logar a resposta bruta para facilitar diagnóstico
        print('RESPOSTA GOOGLE:', r.status_code, r.text)
        r.raise_for_status()
        try:
            data = r.json()
            return True, data, r.status_code
        except ValueError:
            # retorno não-JSON
            return False, {'status': 'error', 'detail': 'Invalid JSON from Apps Script', 'text': r.text}, r.status_code
    except requests.RequestException as e:
        print('ERRO REQUEST PARA APPS SCRIPT:', e)
        return False, {'status': 'error', 'error': str(e)}, 502



# ===============================
# ROTAS PÚBLICAS
# ===============================


@app.route('/')
def index():
    return send_from_directory('.', 'index.html')


@app.route('/<path:filename>')
def serve_files(filename):
    # Normaliza e tenta várias variantes do caminho solicitado antes de 404.
    # Exemplos: adicionar .html, trocar espaços por hífen, remover espaços.
    candidates = [filename, filename + '.html']

    if ' ' in filename:
        candidates.extend([
            filename.replace(' ', '-'),
            filename.replace(' ', '-') + '.html',
            filename.replace(' ', ''),
            filename.replace(' ', '') + '.html'
        ])

    # também testar versão em minúsculas (ex.: /Moto Top -> mototop.html)
    lower = filename.lower()
    if lower not in candidates:
        candidates.append(lower)
        candidates.append(lower + '.html')

    for candidate in candidates:
        # prevenir caminhos fora da pasta atual
        candidate_clean = os.path.normpath(candidate)
        if os.path.exists(candidate_clean):
            return send_from_directory('.', candidate_clean)

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
    ok, data, status = call_google('list', None, method='GET')
    if not ok:
        return jsonify(data), status if isinstance(status, int) else 502
    # garantir que sempre retornamos array (ou objeto convertido em array)
    if isinstance(data, dict) and not isinstance(data, list):
        # se o Apps Script retornou um objeto com chave única, convertemos para lista
        try:
            arr = list(data.values())
            return jsonify(arr)
        except Exception:
            return jsonify(data)
    return jsonify(data)


@app.route('/health')
def health():
    return jsonify({"status": "ok"})


@app.route('/debug', methods=['GET'])
def debug():
    """Rota de diagnóstico: testa conexão com o Apps Script e retorna resultado."""
    ok, data, status = call_google('list', None, method='GET')
    if not ok:
        return jsonify({'status': 'error', 'detail': 'Falha ao conectar com Apps Script', 'response': data}), status if isinstance(status, int) else 502
    return jsonify({'status': 'ok', 'count': len(data) if isinstance(data, list) else 0, 'sample': (data[:5] if isinstance(data, list) else data)})


@app.route('/admin/add_moto', methods=['POST'])
def add_moto():
    """Adiciona moto: encaminha o JSON recebido para o Apps Script com action=add."""
    data = request.get_json() or {}
    app.logger.info('add_moto -> forwarding to Apps Script: %s', data)
    ok, resp, status = call_google('add', data, method='POST')
    if not ok:
        return jsonify(resp), status if isinstance(status, int) else 502
    return jsonify(resp)


@app.route('/admin/delete_moto', methods=['POST'])
def delete_moto():
    """Deleta moto: envia {"id":...} para Apps Script com action=delete."""
    data = request.get_json() or {}
    # validação: id obrigatório e numérico
    id_val = data.get('id')
    if id_val is None:
        return jsonify({'status': 'error', 'error': 'id obrigatório'}), 400
    try:
        id_int = int(id_val)
    except Exception:
        return jsonify({'status': 'error', 'error': 'id deve ser numérico'}), 400

    payload = {'id': id_int}
    app.logger.info('delete_moto -> received payload: %s', payload)
    ok, resp, status = call_google('delete', payload, method='POST')
    if not ok:
        return jsonify(resp), status if isinstance(status, int) else 502
    return jsonify(resp)


@app.route('/admin/edit_moto', methods=['POST'])
def edit_moto():
    """Edita moto: envia JSON para Apps Script com action=edit."""
    data = request.get_json() or {}
    # id obrigatório para editar
    id_val = data.get('id')
    if id_val is None:
        return jsonify({'status': 'error', 'error': 'id obrigatório para edição'}), 400
    try:
        data['id'] = int(id_val)
    except Exception:
        return jsonify({'status': 'error', 'error': 'id deve ser numérico'}), 400

    app.logger.info('edit_moto -> forwarding to Apps Script: %s', data)
    ok, resp, status = call_google('edit', data, method='POST')
    if not ok:
        return jsonify(resp), status if isinstance(status, int) else 502
    return jsonify(resp)




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
