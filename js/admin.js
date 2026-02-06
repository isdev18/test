// admin.js - painel administrativo: listar, adicionar, editar e deletar motos

let produtos = [];
let editingId = null;

function salvarProdutos() {
  try { localStorage.setItem('produtos', JSON.stringify(produtos)); } catch (e) {}
}

async function carregarProdutos() {
  try {
    const r = await fetch('/motos');
    if (r.ok) {
      const data = await r.json();
      produtos = Array.isArray(data) ? data : [];
      salvarProdutos();
      renderProdutos();
      return;
    }
    console.error('Erro ao carregar /motos', r.status);
  } catch (e) {
    console.error('Erro ao conectar com /motos:', e);
  }

  // fallback: carregar do localStorage
  try { produtos = JSON.parse(localStorage.getItem('produtos')) || []; } catch (e) { produtos = []; }
  renderProdutos();
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
      <div style="display:flex;align-items:center">
        <img src="${p.imagem || ''}" alt="${p.nome}" />
        <div class="product-info">
          <strong>${p.nome || ''}</strong><br>
          <span>${p.preco || ''}</span><br>
          <span>${p.categoria || ''}</span>
        </div>
      </div>
      <div class="product-actions">
        <button data-idx="${idx}" class="edit-btn">Editar</button>
        <button data-idx="${idx}" class="del-btn">Remover</button>
      </div>
    `;
    lista.appendChild(item);
  });

  // attach handlers
  document.querySelectorAll('.del-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const i = Number(e.currentTarget.dataset.idx);
      await removerProduto(i);
    });
  });
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const i = Number(e.currentTarget.dataset.idx);
      editarProduto(i);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('addProductForm');
  if (form) {
    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const payload = {
        nome: form.nome.value,
        preco: form.preco.value,
        imagem: form.imagem.value,
        descricao: form.descricao.value,
        categoria: form.categoria.value
      };

      try {
        if (editingId) {
          const r = await fetch('/admin/edit_moto', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(Object.assign({id: editingId}, payload))
          });
          const resp = await r.json().catch(() => ({}));
          if (!r.ok || resp.status === 'error') {
            alert('Erro ao editar: ' + (resp.error || resp.detail || JSON.stringify(resp)));
          } else {
            editingId = null;
            await carregarProdutos();
            form.reset();
            return;
          }
        } else {
          const r = await fetch('/admin/add_moto', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
          });
          const resp = await r.json().catch(() => ({}));
          if (!r.ok || resp.status === 'error') {
            alert('Erro ao adicionar: ' + (resp.error || resp.detail || JSON.stringify(resp)));
          } else {
            await carregarProdutos();
            form.reset();
            return;
          }
        }
      } catch (err) {
        console.error('Erro ao salvar via backend:', err);
      }

      // fallback local
      produtos.unshift(payload);
      salvarProdutos();
      renderProdutos();
      form.reset();
    });
  }

  carregarProdutos();
});

function editarProduto(idx) {
  const p = produtos[idx];
  const form = document.getElementById('addProductForm');
  if (!p || !form) return;
  form.nome.value = p.nome || '';
  form.preco.value = p.preco || '';
  form.imagem.value = p.imagem || '';
  form.descricao.value = p.descricao || '';
  form.categoria.value = p.categoria || '';
  editingId = p.id || null;
}

async function removerProduto(idx) {
  if (!confirm('Remover este produto?')) return;
  const produto = produtos[idx];
  if (!produto) return;

  // tenta remover pelo backend Flask — exige id numérico
  if (produto.id != null) {
    const idNum = Number(produto.id);
    if (!Number.isFinite(idNum)) {
      alert('ID inválido para exclusão');
      return;
    }
    try {
      const r = await fetch('/admin/delete_moto', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id: idNum})
      });
      if (r.ok) {
        const resp = await r.json();
        // Se backend retornou status de erro, mostra mensagem
        if (resp && resp.status === 'error') {
          alert('Erro ao deletar: ' + (resp.error || resp.detail || JSON.stringify(resp)));
        } else {
          // recarrega lista do backend para sincronizar
          await carregarProdutos();
        }
        return;
      }
      console.error('Falha ao deletar via backend', r.status);
    } catch (err) {
      console.error('Erro ao deletar via backend:', err);
    }
  }

  // fallback local
  produtos.splice(idx, 1);
  salvarProdutos();
  renderProdutos();
}
