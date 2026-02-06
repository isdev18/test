// admin.js - lógica do painel administrativo (integração com backend)

let produtos = [];
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzK9VqA5SNt9Zavp2D2FkU3hAWNU928OdzR0k888FLFLrqNAsRapKUnaklmaYuVvobY/exec';

function salvarProdutos() {
  try {
    localStorage.setItem('produtos', JSON.stringify(produtos));
  } catch (e) {}
}

function renderProdutos() {
  const lista = document.getElementById('productList');
  lista.innerHTML = '';
  if (!produtos || produtos.length === 0) {
    lista.innerHTML = '<p>Nenhum produto cadastrado.</p>';
    return;
  }
  produtos.forEach((p, idx) => {
    const item = document.createElement('div');
    item.className = 'product-item';
    item.innerHTML = `
      <img src="${p.imagem || ''}" alt="${p.nome}">
      <div class="product-info">
        <strong>${p.nome}</strong><br>
        <span>${p.preco || ''}</span><br>
        <span>${p.categoria || ''}</span>
      </div>
      <div class="product-actions">
        <button onclick="editarProduto(${idx})">Editar</button>
        <button onclick="removerProduto(${idx})">Remover</button>
      </div>
    `;
    lista.appendChild(item);
  });
}

async function carregarProdutos() {
  // Carrega diretamente do Apps Script (Google Sheets)
  try {
    const r = await fetch(APPS_SCRIPT_URL);
    if (r.ok) {
      const data = await r.json();
      produtos = Array.isArray(data) ? data : [];
      renderProdutos();
      return;
    }
    console.error('Erro ao carregar motos do Apps Script', r.status);
  } catch (err) {
    console.error('Erro ao conectar com Apps Script:', err);
  }

  // Se falhar, mostra mensagem vazia
  produtos = [];
  renderProdutos();
}

document.getElementById('addProductForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const form = e.target;
  const novo = {
    nome: form.nome.value,
    preco: form.preco.value,
    imagem: form.imagem.value,
    descricao: form.descricao.value,
    categoria: form.categoria.value
  };

  // tenta enviar para backend; se falhar, salva localmente
  try {
    const r = await fetch(APPS_SCRIPT_URL + '?action=add', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(novo)
    });
    if (r.ok) {
      const resp = await r.json();
      produtos.unshift(resp && resp.id ? resp : novo);
      renderProdutos();
      form.reset();
      return;
    }
    console.error('Erro ao adicionar via Apps Script', r.status);
  } catch (err) {
    console.error('Erro ao enviar add para Apps Script:', err);
  }

  // Fallback local apenas como último recurso
  produtos.unshift(novo);
  salvarProdutos();
  renderProdutos();
  form.reset();
});

async function removerProduto(idx) {
  if (!confirm('Remover este produto?')) return;

  const produto = produtos[idx];

  // tenta remover pelo backend se existir id
  if (produto && produto.id) {
    try {
      // usar GET com query param para evitar CORS preflight
      const r = await fetch(APPS_SCRIPT_URL + '?action=delete&id=' + encodeURIComponent(produto.id));
      if (r.ok) {
        const resp = await r.json();
        if (resp && (resp.status === 'ok' || resp.status === 'deletado' || resp.status === 'deleted')) {
          produtos.splice(idx, 1);
          salvarProdutos();
          renderProdutos();
          return;
        }
      }
    } catch (e) {
      console.error('Erro ao deletar via Apps Script', e);
    }
  }

  // fallback local
  produtos.splice(idx, 1);
  salvarProdutos();
  renderProdutos();
}

function editarProduto(idx) {
  const p = produtos[idx];
  const form = document.getElementById('addProductForm');
  form.nome.value = p.nome || '';
  form.preco.value = p.preco || '';
  form.imagem.value = p.imagem || '';
  form.descricao.value = p.descricao || '';
  form.categoria.value = p.categoria || '';
  produtos.splice(idx, 1);
  renderProdutos();
}

// Inicializa
carregarProdutos();
