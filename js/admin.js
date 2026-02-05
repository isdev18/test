// admin.js - lógica do painel administrativo

// Mock: carrega produtos do localStorage ou array vazio
let produtos = JSON.parse(localStorage.getItem('produtos')) || [];

function salvarProdutos() {
  localStorage.setItem('produtos', JSON.stringify(produtos));
}

function renderProdutos() {
  const lista = document.getElementById('productList');
  lista.innerHTML = '';
  if (produtos.length === 0) {
    lista.innerHTML = '<p>Nenhum produto cadastrado.</p>';
    return;
  }
  produtos.forEach((p, idx) => {
    const item = document.createElement('div');
    item.className = 'product-item';
    item.innerHTML = `
      <img src="${p.imagem}" alt="${p.nome}">
      <div class="product-info">
        <strong>${p.nome}</strong><br>
        <span>${p.preco}</span><br>
        <span>${p.categoria}</span>
      </div>
      <div class="product-actions">
        <button onclick="editarProduto(${idx})">Editar</button>
        <button onclick="removerProduto(${idx})">Remover</button>
      </div>
    `;
    lista.appendChild(item);
  });
}

function adicionarProduto(e) {
  e.preventDefault();
  const form = e.target;
  const novo = {
    nome: form.nome.value,
    preco: form.preco.value,
    imagem: form.imagem.value,
    descricao: form.descricao.value,
    categoria: form.categoria.value
  };
  produtos.push(novo);
  salvarProdutos();
  renderProdutos();
  form.reset();
}

document.getElementById('addProductForm').addEventListener('submit', adicionarProduto);

function removerProduto(idx) {
  if (confirm('Remover este produto?')) {
    produtos.splice(idx, 1);
    salvarProdutos();
    renderProdutos();
  }
}

function editarProduto(idx) {
  const p = produtos[idx];
  const form = document.getElementById('addProductForm');
  form.nome.value = p.nome;
  form.preco.value = p.preco;
  form.imagem.value = p.imagem;
  form.descricao.value = p.descricao;
  form.categoria.value = p.categoria;
  produtos.splice(idx, 1);
  renderProdutos();
}

// Inicializa
renderProdutos();
