document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("carouselContainer");
  const track = document.getElementById("carouselTrack");
  const indicatorsWrap = document.getElementById("carouselIndicators");
  if (!container || !track) return;

  let speed = 0.6;
  const pauseOnHover = true;

  // Função para criar item do carrossel
  function criarItemCarrossel(img) {
    const div = document.createElement('div');
    div.className = 'carousel-item';
    div.dataset.title = img.filename;
    const image = document.createElement('img');
    image.src = img.url;
    image.alt = img.filename;
    div.appendChild(image);
    return div;
  }

  // Imagens padrão (fallback)
  const imagensPadrao = [
    { filename: 'XRE.jpg', url: 'css/XRE.jpg' },
    { filename: 'fan.jpg', url: 'css/fan.jpg' },
    { filename: 'bros.jpg', url: 'css/bros.jpg' },
    { filename: 'pcx.png', url: 'css/pcx.png' },
    { filename: 'twister.jpg', url: 'css/twister.jpg' }
  ];

  // Tenta carregar imagens do banco de dados
  let imagens = [];
  try {
    const res = await fetch('http://localhost:5000/carrossel/list');
    const imagensDB = await res.json();
    if (imagensDB && imagensDB.length > 0) {
      imagens = imagensDB;
      console.log("[CARROSSEL] Imagens carregadas do banco:", imagens.length);
    } else {
      imagens = imagensPadrao;
      console.log("[CARROSSEL] Usando imagens padrão");
    }
  } catch (err) {
    console.warn("[CARROSSEL] Erro ao conectar com backend, usando fallback:", err);
    imagens = imagensPadrao;
  }

  track.innerHTML = '';
  imagens.forEach(img => {
    const item = criarItemCarrossel(img);
    track.appendChild(item);
  });
  iniciarCarrossel();

  function iniciarCarrossel() {
    let items = Array.from(track.children);

    // adiciona label dentro de cada item (se já houver não adiciona)
    items.forEach(it => {
      if (!it.querySelector('.item-label')) {
        const title = it.dataset.title || "";
        const label = document.createElement('div');
        label.className = 'item-label';
        label.textContent = title;
        it.appendChild(label);
      }
    });

    // duplicação para loop infinito (faz o clone apenas uma vez)
    track.innerHTML += track.innerHTML;
    // atualiza lista completa (original + clone)
    const allItems = Array.from(track.children);

    // cria indicadores baseados no número original de itens
    function createIndicators() {
      if (!indicatorsWrap) return;
      indicatorsWrap.innerHTML = '';
      for (let i = 0; i < items.length; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot';
        dot.dataset.index = i;
        dot.addEventListener('click', () => {
          centerOnIndex(i);
        });
        indicatorsWrap.appendChild(dot);
      }
    }
    createIndicators();

    // variáveis do loop
    let rafId = null;
    let scrollPos = 0;

    // função de auto-scroll por RAF
    function step() {
      scrollPos += speed;
      container.scrollLeft = scrollPos;
      if (scrollPos >= track.scrollWidth / 2) {
        scrollPos -= track.scrollWidth / 2;
        container.scrollLeft = scrollPos;
      }
      updateActiveByCenter();
      rafId = requestAnimationFrame(step);
    }
    rafId = requestAnimationFrame(step);

    if (pauseOnHover) {
      container.addEventListener('mouseenter', () => cancelAnimationFrame(rafId));
      container.addEventListener('mouseleave', () => { rafId = requestAnimationFrame(step); });
    }
    container.addEventListener('touchstart', () => cancelAnimationFrame(rafId), { passive: true });
    container.addEventListener('touchend', () => { rafId = requestAnimationFrame(step); });

    function updateActiveByCenter() {
      const containerRect = container.getBoundingClientRect();
      const centerX = containerRect.left + containerRect.width / 2;
      let minDist = Infinity;
      let closest = null;
      let originalIndexOfClosest = 0;
      allItems.forEach((it, idx) => {
        const rect = it.getBoundingClientRect();
        const itemCenter = rect.left + rect.width / 2;
        const dist = Math.abs(centerX - itemCenter);
        if (dist < minDist) {
          minDist = dist;
          closest = it;
          originalIndexOfClosest = idx % items.length;
        }
      });
      allItems.forEach(it => {
        it.classList.remove('active');
        it.classList.add('inactive');
      });
      if (closest) {
        closest.classList.remove('inactive');
        closest.classList.add('active');
      }
      if (indicatorsWrap) {
        const dots = Array.from(indicatorsWrap.children);
        dots.forEach(d => d.classList.remove('active'));
        if (dots[originalIndexOfClosest]) dots[originalIndexOfClosest].classList.add('active');
      }
    }
  }
});
