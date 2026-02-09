// ========== CARROSSEL ==========
// usar caminho relativo em produção
const CARROSSEL_API = '/carrossel';
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwtyQTUTE9wP7UjHQvcJXolbMxoDZM7nraTczVdc-VV0T4VidhZLMiNDFcRKy7yWzQB/exec';

async function listarImagensCarrossel() {
  const MAX_SLOTS = 5; // número de espaços do carrossel na vitrine
  const res = await fetch(CARROSSEL_API + '/list');
  const imagens = await res.json();
  const container = document.getElementById('carrosselImagens');
  container.innerHTML = '';
  // Renderiza imagens existentes
  imagens.forEach(img => {
    const div = document.createElement('div');
    div.style.position = 'relative';
    div.style.display = 'inline-block';
    div.innerHTML = `
      <img src="${img.url}" style="max-width:160px;max-height:110px;border-radius:8px;border:1.5px solid #ececec;box-shadow:0 2px 8px rgba(208,0,0,0.07);margin-bottom:6px;">
      <button class="btn-excluir-carrossel" style="position:absolute;top:6px;right:6px;background:#fff;color:#d00000;border:1.5px solid #d00000;padding:2px 10px;border-radius:6px;font-weight:700;cursor:pointer;">Excluir</button>
    `;
    div.querySelector('button').onclick = async () => {
      if (confirm('Excluir esta imagem do carrossel?')) {
        await fetch(CARROSSEL_API + '/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: img.filename })
        });
        listarImagensCarrossel();
      }
    };
    container.appendChild(div);
  });
  // Renderiza espaços vazios
  const espacosVazios = MAX_SLOTS - imagens.length;
  for (let i = 0; i < espacosVazios; i++) {
    const slot = document.createElement('div');
    slot.className = 'carrossel-slot empty-slot';
    slot.innerHTML = '<div class="empty-slot-text">Vazio</div>';
    container.appendChild(slot);
  }
  if (!imagens.length) {
    container.innerHTML = '<p style="color:#888">Nenhuma imagem enviada.</p>' + container.innerHTML;
  }
}

const formCarrossel = document.getElementById('formCarrossel');
if (formCarrossel) {
  formCarrossel.onsubmit = async e => {
    e.preventDefault();
    const input = document.getElementById('inputCarrossel');
    if (!input.files.length) return alert('Selecione uma imagem.');
    const formData = new FormData();
    formData.append('file', input.files[0]);
    await fetch(CARROSSEL_API + '/upload', { method: 'POST', body: formData });
    input.value = '';
    document.getElementById('previewCarrossel').style.display = 'none';
    listarImagensCarrossel();
  };
  // Carregar imagens ao abrir aba
  document.getElementById('tabCarrossel').addEventListener('click', listarImagensCarrossel);
}

// dashboard.js - Integração com o backend Flask

const API_URL = '/motos';

async function fetchMotos() {
  const res = await fetch(API_URL);
  try { return await res.json(); } catch (e) { console.error('Erro parse /motos', e); return []; }
}

async function renderDashboard() {
  const lista = document.getElementById('dashboardList');
  lista.innerHTML = '<p style="text-align:center;">Carregando...</p>';
  let motos = await fetchMotos();
  // lidar com respostas de erro do backend
  if (!motos) motos = [];
  if (motos && motos.status === 'error') {
    lista.innerHTML = `<p>Erro ao carregar motos: ${motos.error || motos.detail || ''}</p>`;
    return;
  }
  // normalizar para array caso Apps Script retorne um objeto
  if (!Array.isArray(motos)) {
    if (typeof motos === 'object') motos = Object.values(motos);
    else motos = [];
  }
  if (!motos.length) {
    lista.innerHTML = '<p>Nenhuma moto cadastrada.</p>';
    return;
  }
  lista.innerHTML = '';
  motos.forEach((moto, idx) => {
    const item = document.createElement('div');
    item.className = 'dashboard-item';
    item.innerHTML = `
      <img src="${moto.imagem}" alt="${moto.nome}">
      <div class="dashboard-info">
        <strong>${moto.nome}</strong><br>
        <span>${moto.preco}</span><br>
        <span>${moto.categoria || '-'} </span>
        <div class="dashboard-stats">
          <span>ID: <b>${moto.id}</b></span>
        </div>
      </div>
      <div class="dashboard-actions">
        <button class="del-btn" data-id="${moto.id}">Deletar</button>
      </div>
    `;
    lista.appendChild(item);
  });

  // attach handlers for delete buttons
  lista.querySelectorAll('.del-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.currentTarget.dataset.id;
      if (!id) return alert('ID da moto não disponível');
      await deletarMotoById(id);
    });
  });
}

async function deletarMotoById(id) {
  if (!confirm('Deseja deletar esta moto?')) return;
  const idNum = Number(id);
  if (!Number.isFinite(idNum)) return alert('ID inválido para exclusão');

  try {
    const r = await fetch('/admin/delete_moto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: idNum })
    });
    const resp = await r.json().catch(() => ({}));
    if (!r.ok || resp.status === 'error') {
      alert('Erro ao deletar: ' + (resp.error || resp.detail || JSON.stringify(resp)));
    } else {
      await renderDashboard();
    }
    return;
  } catch (e) {
    console.error('Falha ao chamar /admin/delete_moto', e);
    alert('Erro de rede ao deletar');
    await renderDashboard();
    return;
  }
}

async function adicionarMoto(e) {
  e.preventDefault();
  const form = e.target;
  // Consórcios
  const consorcios = Array.from(document.querySelectorAll('#consorciosContainer > div')).map(div => ({
    plano: div.querySelector('.plano').value,
    valor: div.querySelector('.valor').value
  }));
  // Cores
  const cores = Array.from(document.querySelectorAll('#coresContainer > div')).map(div => div.querySelector('.cor').value);
  // Formatar preço à vista
  let preco = form.preco.value.trim();
  // Extrai apenas números
  let valorNumerico = preco.replace(/\D/g, '');
  if (valorNumerico) {
    // Formata para moeda brasileira
    let valorFormatado = Number(valorNumerico).toLocaleString('pt-BR');
    preco = `R$ ${valorFormatado} à vista`;
  } else {
    preco = '';
  }
  const nova = {
    nome: form.nome.value,
    preco,
    imagem: form.imagem.value,
    descricao: form.descricao.value,
    categoria: form.categoria.value,
    subcategoria: form.subcategoria.value,
    ativo: true,
    consorcios,
    cores
  };
  try {
    const r = await fetch('/admin/add_moto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nova)
    });
    const resp = await r.json().catch(() => ({}));
    if (!r.ok || resp.status === 'error') {
      alert('Erro ao adicionar: ' + (resp.error || resp.detail || JSON.stringify(resp)));
    }
  } catch (e) {
    console.error('Erro ao adicionar via Apps Script:', e);
  }
  form.reset();
  // Limpa campos dinâmicos e adiciona um novo campo padrão
  document.getElementById('consorciosContainer').innerHTML = '';
  document.getElementById('coresContainer').innerHTML = '';
  if (window.addConsorcioField) addConsorcioField();
  if (window.addCorField) addCorField();
  // Atualiza subcategorias
  if (typeof atualizarSubcategorias === 'function') atualizarSubcategorias();
  renderDashboard();
}

document.getElementById('addMotoForm').addEventListener('submit', adicionarMoto);

// Expor para HTML caso outro script chame
window.deletarMoto = deletarMotoById;

// Inicializa
renderDashboard();