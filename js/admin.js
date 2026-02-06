// admin.js - lógica do painel administrativo (integração com backend)

let produtos = [];

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
  // tenta carregar do backend (/motos). Se falhar, usa localStorage como fallback.
  try {
    const r = await fetch('/motos');
    if (r.ok) {
      const data = await r.json();
      // espera-se um array de objetos com ao menos {id, nome, preco, imagem, descricao, categoria}
      produtos = Array.isArray(data) ? data : [];
      salvarProdutos();
      renderProdutos();
      return;
    }
  } catch (e) {
    // ignore e tenta fallback
  }

  // fallback localStorage
  produtos = JSON.parse(localStorage.getItem('produtos')) || [];
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
    const r = await fetch('/admin/add_moto', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(novo)
    });
    if (r.ok) {
      const resp = await r.json();
      // se o backend retornar o objeto criado, usa-o; caso contrário, usa o que foi enviado
      produtos.unshift(resp && resp.id ? resp : novo);
      salvarProdutos();
      renderProdutos();
      form.reset();
      return;
    }
  } catch (err) {
    // segue para fallback
  }

  // fallback: local
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
      const r = await fetch('/admin/delete_moto', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id: produto.id})
      });
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
      // fallback
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
