// =============================
// ELEMENTOS
// =============================
const container = document.getElementById("products");
const menuBtn = document.getElementById("menuBtn");
const menu = document.getElementById("menu");
const searchInput = document.getElementById("searchInput");

// =============================
// CONTROLE
// =============================
let motoSelecionada = "";
let origemAcao = "";
let detalhesAtivos = null;
let filtroCategoria = null;
let filtroSubcategoria = null;

// =============================
// MODAL
// =============================
const modal = document.createElement("div");
modal.id = "modalInfo";
modal.style.cssText = `
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.6);
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

modal.innerHTML = `
  <div style="background:#fff;max-width:420px;width:90%;border-radius:10px;padding:22px;">
    <button id="fecharModal" style="float:right;border:none;background:none;font-size:18px;cursor:pointer">✕</button>
    <h3 id="modalTitulo"></h3>
    <p id="modalTexto"></p>
    <button id="btnContinuar" style="margin-top:14px;width:100%;padding:13px;background:#d50000;color:#fff;border:none;border-radius:6px;font-weight:bold;cursor:pointer">
      Continuar
    </button>
  </div>
`;

document.body.appendChild(modal);

const modalTitulo = document.getElementById("modalTitulo");
const modalTexto = document.getElementById("modalTexto");

function atualizarModal(tipo) {
  if (tipo === "consorcio") {
    modalTitulo.textContent = "Consórcio";
    modalTexto.innerHTML =
      "Você pode ser contemplado a qualquer momento.<br><br>Consulte o vendedor.";
  }
  if (tipo === "financiamento") {
    modalTitulo.textContent = "Financiamento";
    modalTexto.innerHTML =
      "Aquisição imediata.<br><br><i>Sujeito à análise de crédito.</i>";
  }
}

document.getElementById("fecharModal").onclick = () => {
  modal.style.display = "none";
};

document.getElementById("btnContinuar").onclick = () => {
  modal.style.display = "none";
  if (origemAcao === "financiamento") {
    window.location.href = `form.html?moto=${encodeURIComponent(motoSelecionada)}`;
  }
  if (origemAcao === "consorcio" && detalhesAtivos) {
    detalhesAtivos.style.display = "block";
  }
};

// =============================
// CLASSIFICAÇÃO HONDA
// =============================
function getCategoriaHonda(produto) {
  if (!produto) return null;

  // Se já tem categoria definida no banco, usa ela
  if (produto.categoria) {
    return produto.categoria;
  }

  // Classificação automática baseada no nome da moto
  const nome = (produto.nome || "").toUpperCase();

  // TOURING - motos de viagem
 

  // SPORT - motos esportivas
  if (nome.includes("CBR") || nome.includes("FIREBLADE")) {
    return "sport";
  }

  // ADVENTURE - motos de aventura
  if (nome.includes("AFRICA") || nome.includes("ADV") || 
      nome.includes("XRE") || nome.includes("SAHARA")) {
    return "adventure";
  }

  // OFF ROAD - motos de trilha
  if (nome.includes("CRF") || nome.includes("XR") || nome.includes("TORNADO")) {
    return "offroad";
  }

  // STREET - urbanas (padrão)
  if (nome.includes("CG") || nome.includes("FAN") || nome.includes("TITAN") ||
      nome.includes("BIZ") || nome.includes("POP") || nome.includes("PCX") ||
      nome.includes("ELITE") || nome.includes("CB") || nome.includes("TWISTER") ||
      nome.includes("HORNET") || nome.includes("BROS")) {
    return "street";
  }

  return "street"; // categoria padrão
}

// =============================
// DADOS (através do backend Flask)
// - Usa a rota Flask `/motos` que por sua vez chama o Apps Script.
// - Garante que erros do Apps Script sejam tratados e a dashboard atualize corretamente.
// =============================
let produtos = [];

async function carregarProdutos() {
  try {
    const res = await fetch('/motos');
    const dados = await res.json();
    if (res.ok && dados && dados.status !== 'error') {
      produtos = Array.isArray(dados) ? dados : Object.values(dados || {});
      console.log('[API] Motos carregadas do backend:', produtos.length);
    } else {
      console.warn('[API] Resposta de /motos indica erro:', dados);
      produtos = [];
    }
  } catch (err) {
    console.error('[API] Erro ao conectar com backend /motos:', err);
    produtos = [];
  }

  let lista = produtos;

  // Filtra por categoria se estiver definida
  if (typeof window.CATEGORIA_ATUAL === "string") {
    lista = produtos.filter(p => getCategoriaHonda(p) === window.CATEGORIA_ATUAL);
  }

  renderProducts(lista);
}

// =============================
// RENDER
// =============================
function renderProducts(lista) {
  if (!container) return;

  container.innerHTML = "";

  const ativos = lista.filter(p => p && p.ativo !== false);

  if (!ativos.length) {
    container.innerHTML = "<p style='text-align:center;padding:40px;'>Nenhuma moto encontrada nesta categoria.</p>";
    return;
  }

  ativos.forEach(prod => {
    const card = document.createElement("div");
    card.className = "card";

    // Compatibilidade: aceita `prod.consorcios` (array) ou campos planos/valor_flat (plano_1..valor_1)
    let consList = [];
    if (Array.isArray(prod.consorcios) && prod.consorcios.length) {
      consList = prod.consorcios;
    } else {
      // Reconstruir a lista a partir de plano_1..plano_7 e valor_1..valor_7
      for (let i = 1; i <= 7; i++) {
        const planoKey = `plano_${i}`;
        const valorKey = `valor_${i}`;
        const planoVal = prod[planoKey];
        const valorVal = prod[valorKey];
        if (planoVal && (valorVal !== undefined && valorVal !== null && valorVal !== "")) {
          const valorStr = typeof valorVal === 'number' ? String(valorVal).replace('.', ',') : String(valorVal);
          consList.push({ plano: planoVal, valor: valorStr });
        }
      }
    }

    const consorciosHTML = (consList || [])
      .map(c => `<option value="${c.plano} - R$ ${c.valor}">${c.plano} de R$ ${c.valor}</option>`)
      .join("");

    card.innerHTML = `
      <img src="${prod.imagem}" alt="${prod.nome}">
      <h3>${prod.nome}</h3>
      <p class="descricao">${prod.descricao || ""}</p>
      <p class="preco">${prod.preco || "Consulte"}</p>
      <button class="btn saiba-mais">Planos de Consórcio</button>
      <button class="btn financiamento">Simular financiamento</button>
      <div class="detalhes" style="display:none;">
        <select class="select-consorcio">
          <option value="">Selecione</option>
          ${consorciosHTML}
        </select>
        <a class="btn whatsapp" target="_blank" style="display:none;">Falar no WhatsApp</a>
      </div>
    `;

    container.appendChild(card);

    const detalhes = card.querySelector(".detalhes");
    const select = card.querySelector(".select-consorcio");
    const btnWhatsapp = card.querySelector(".whatsapp");

    card.querySelector(".saiba-mais").onclick = () => {
      // Mostra/oculta os detalhes de consórcio diretamente no card
      if (detalhes.style.display === 'none' || detalhes.style.display === '') {
        detalhes.style.display = 'block';
        // define estado para manter compatibilidade com modal/continuar
        motoSelecionada = prod.nome;
        origemAcao = 'consorcio';
        detalhesAtivos = detalhes;
      } else {
        detalhes.style.display = 'none';
      }
    };

    card.querySelector(".financiamento").onclick = () => {
      motoSelecionada = prod.nome;
      origemAcao = "financiamento";
      atualizarModal("financiamento");
      modal.style.display = "flex";
    };

    select.onchange = () => {
      if (!select.value) return;
      const msg = `Olá! Tenho interesse na ${prod.nome}\nPlano: ${select.value}`;
      btnWhatsapp.href = "https://wa.me/5575998646978?text=" + encodeURIComponent(msg);
      btnWhatsapp.style.display = "block";
    };
  });
}

// =============================
// CATEGORIAS (NAVEGAÇÃO)
// =============================
function applyActiveCategory(category) {
  document.querySelectorAll(".floating-category").forEach(el => {
    el.classList.toggle("active", el.dataset.category === category);
  });
}

function initCategoryFilters() {
  const items = document.querySelectorAll(".floating-category");
  if (!items.length) return;

  const pageMap = {
    street: "motos-street.html",
    adventure: "motos-adventure.html",
    offroad: "motos-offroad.html",
    sport: "motos-sport.html",
    touring: "motos-touring.html"
  };

  items.forEach(el => {
    el.onclick = () => {
      const destino = pageMap[el.dataset.category];
      if (destino) {
        window.location.href = destino;
      }
    };
  });

  applyActiveCategory(window.CATEGORIA_ATUAL || null);
}

// =============================
// MENU
// =============================
if (menuBtn && menu) {
  menuBtn.onclick = e => {
    e.stopPropagation();
    menu.classList.toggle("open");
  };

  document.onclick = e => {
    if (!menu.contains(e.target) && !menuBtn.contains(e.target)) {
      menu.classList.remove("open");
    }
  };
}

// =============================
// BUSCA
// =============================
if (searchInput) {
  searchInput.oninput = () => {
    const termo = searchInput.value.toLowerCase().trim();
    let lista = produtos;

    // Aplica filtro de categoria/subcategoria
    lista = aplicarFiltros(lista);

    if (termo) {
      lista = lista.filter(p => 
        (p.nome || "").toLowerCase().includes(termo) ||
        (p.descricao || "").toLowerCase().includes(termo)
      );
    }

    renderProducts(lista);
  };
}

// =============================
// MENU DE CATEGORIAS HONDA (CARDS FLUTUANTES)
// =============================
function initHondaCategoryMenu() {
  const catItems = document.querySelectorAll('.floating-category[data-category]');
  const resetBtn = document.getElementById('resetFilter');
  
  if (!catItems.length) return;

  // Toggle accordion/dropdown ao clicar no card
  catItems.forEach(item => {
    item.addEventListener('click', (e) => {
      // Se clicou em subcategoria, não faz toggle
      if (e.target.classList.contains('subcat-btn')) return;
      
      e.stopPropagation();
      
      // Fecha outros menus abertos
      catItems.forEach(other => {
        if (other !== item) other.classList.remove('open');
      });
      
      // Toggle atual
      item.classList.toggle('open');
    });

    // Subcategorias
    const subcatBtns = item.querySelectorAll('.subcat-btn');
    subcatBtns.forEach(subBtn => {
      subBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        
        const categoria = item.dataset.category;
        const subcategoria = subBtn.dataset.subcategory;
        
        // Aplica filtro
        filtroCategoria = categoria;
        filtroSubcategoria = subcategoria;
        
        // Atualiza visual
        atualizarMenuVisual(categoria, subcategoria);
        
        // Filtra produtos
        filtrarProdutos();
        
        // Fecha menu
        item.classList.remove('open');
      });
    });
  });

  // Fecha menu ao clicar fora
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.floating-categories')) {
      catItems.forEach(item => item.classList.remove('open'));
    }
  });

  // Reset filtro
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      filtroCategoria = null;
      filtroSubcategoria = null;
      atualizarMenuVisual(null, null);
      filtrarProdutos();
    });
  }
}

function atualizarMenuVisual(categoria, subcategoria) {
  const catCards = document.querySelectorAll('.floating-category[data-category]');
  const subcatBtns = document.querySelectorAll('.subcat-btn');
  const resetBtn = document.getElementById('resetFilter');
  
  // Remove classes ativas
  catCards.forEach(card => card.classList.remove('active'));
  subcatBtns.forEach(btn => btn.classList.remove('active'));
  
  if (categoria && subcategoria) {
    // Marca categoria ativa
    const catCard = document.querySelector(`.floating-category[data-category="${categoria}"]`);
    if (catCard) {
      catCard.classList.add('active');
      const subBtn = catCard.querySelector(`.subcat-btn[data-subcategory="${subcategoria}"]`);
      if (subBtn) subBtn.classList.add('active');
    }
    
    // Mostra botão reset
    if (resetBtn) resetBtn.classList.add('show');
  } else {
    // Esconde botão reset
    if (resetBtn) resetBtn.classList.remove('show');
  }
}

function aplicarFiltros(lista) {
  // Filtro por página de categoria (quando está em página específica)
  if (typeof window.CATEGORIA_ATUAL === "string") {
    lista = lista.filter(p => getCategoriaHonda(p) === window.CATEGORIA_ATUAL);
  }
  
  // Filtro por menu de categoria
  if (filtroCategoria) {
    lista = lista.filter(p => getCategoriaHonda(p) === filtroCategoria);
  }
  
  // Filtro por subcategoria
  if (filtroSubcategoria) {
    lista = lista.filter(p => getSubcategoriaHonda(p) === filtroSubcategoria);
  }
  
  return lista;
}

function filtrarProdutos() {
  let lista = aplicarFiltros(produtos);
  renderProducts(lista);
}
// Retorna subcategoria do produto
function getSubcategoriaHonda(produto) {
  if (!produto) return null;
  
  // Se tem subcategoria definida no banco, usa ela
  if (produto.subcategoria) {
    return produto.subcategoria;
  }
  
  // Classificação automática por nome
  const nome = (produto.nome || "").toUpperCase();
  
  // SCOOTER
  if (nome.includes("PCX") || nome.includes("ELITE") || nome.includes("SH") || nome.includes("LEAD")) {
    return "scooter";
  }
  
  // CITY (urbanas compactas)
  if (nome.includes("POP") || nome.includes("BIZ")) {
    return "city";
  }
  
  // NAKED
  if (nome.includes("CB") && !nome.includes("CBR") || nome.includes("HORNET") || nome.includes("TWISTER")) {
    return "naked";
  }
  
  // BIG TRAIL
  if (nome.includes("AFRICA") || nome.includes("TRANSALP")) {
    return "bigtrail";
  }
  
  // TRAIL
  if (nome.includes("XRE") || nome.includes("SAHARA") || nome.includes("BROS")) {
    return "trail";
  }
  
  // CROSSOVER
  if (nome.includes("ADV") || nome.includes("X-ADV")) {
    return "crossover";
  }
  
  // OFF ROAD
  if (nome.includes("CRF") || nome.includes("XR") || nome.includes("TORNADO")) {
    return "offroad";
  }
  
  // SPORT
  if (nome.includes("CBR") || nome.includes("FIREBLADE")) {
    return "sport";
  }
  
  // TOURING
  if (nome.includes("GL") || nome.includes("GOLD WING")) {
    return "touring";
  }
  
  // Se não identificou, retorna baseado na categoria
  const cat = getCategoriaHonda(produto);
  if (cat === "street") return "city";
  
  return cat;
}

// =============================
// INIT (executa imediatamente pois o script está no fim do body)
// =============================
(async function init() {
  console.log("[INIT] Iniciando vitrine...");
  console.log("[INIT] CATEGORIA_ATUAL =", window.CATEGORIA_ATUAL);
  
  // Adiciona botão voltar se não existir
  adicionarBotaoVoltar();
  
  // Inicializa menus de categoria
  initCategoryFilters();
  initHondaCategoryMenu();
  
  await carregarProdutos();
  
  console.log("[INIT] Produtos carregados:", produtos.length);
})();

// =============================
// BOTÃO VOLTAR
// =============================
function adicionarBotaoVoltar() {
  // Só adiciona se estiver em página de categoria
  if (!window.CATEGORIA_ATUAL) return;
  
  // Verifica se já existe
  if (document.querySelector('.btn-voltar-fixo')) return;
  
  const btn = document.createElement('a');
  btn.href = 'index.html';
  btn.className = 'btn-voltar-fixo';
  btn.innerHTML = '← Voltar';
  // estilização via CSS para respeito ao tema (usa variáveis CSS)
  btn.classList.add('btn-voltar-fixo');
  
  document.body.appendChild(btn);
}
