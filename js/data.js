// Dados das motos Honda
window.PRODUCTS = [
  {
    id: 1,
    nome: "Honda CG 160 Titan",
    cilindrada: 160,
    preco: "R$ 25.390 à vista",
    imagem: "https://www.honda.com.br/motos/sites/hda/files/2025-08/visao-da-lateral-direita-da-honda-cg-160-titan.webp",
    descricao: "A Honda CG 160 Titan é ideal para quem busca economia, conforto e confiabilidade no dia a dia.",
    ativo: true,
    consorcios: [
      { plano: "24x", valor: "1.348,60" },
      { plano: "36x", valor: "916,89" },
      { plano: "48x", valor: "695,96" },
      { plano: "60x", valor: "565,01" },
      { plano: "80x", valor: "436,04" }
    ],
    cores: ["Vermelha", "Preta", "Cinza"]
  },
  {
    id: 2,
    nome: "Honda Biz 125 ES",
    cilindrada: 125,
    preco: "R$ 16.490 à vista",
    imagem: "https://www.honda.com.br/motos/sites/hda/files/2025-08/Imagem-Home-Honda-Biz-125-ES-Preto-Black_0.webp",
    descricao: "Prática, econômica e perfeita para uso urbano.",
    ativo: true,
    consorcios: [
      { plano: "12x", valor: "1.646,11" },
      { plano: "18x", valor: "1.103,83" },
      { plano: "24x", valor: "832,69" },
      { plano: "36x", valor: "566,13" },
      { plano: "48x", valor: "429,72" },
      { plano: "60x", valor: "348,88" },
      { plano: "80x", valor: "269,36" }
    ],
    cores: ["Azul", "Branca", "Vermelha"]
  },
  {
    id: 3,
    nome: "Honda Biz 125 EX",
    cilindrada: 125,
    preco: "R$ 20.490 à vista",
    imagem: "https://www.honda.com.br/motos/sites/hda/files/2025-08/Imagem-Home-Biz-125-EX-Vermelho-Perolizado-Pearl-Pimenta%20Red_0.webp",
    descricao: "Mais tecnologia, conforto e economia para o dia a dia.",
    ativo: true,
    consorcios: [
      { plano: "12x", valor: "2.037,26" },
      { plano: "18x", valor: "1.366,12" },
      { plano: "24x", valor: "1.030,56" },
      { plano: "36x", valor: "700,66" },
      { plano: "48x", valor: "531,84" },
      { plano: "60x", valor: "431,78" },
      { plano: "80x", valor: "333,37" }
    ],
    cores: ["Azul", "Branca"]
  },
  {
    id: 4,
    nome: "Honda Pop 110i ES",
    cilindrada: 110,
    preco: "R$ 13.890 à vista",
    imagem: "https://www.honda.com.br/motos/sites/hda/files/2025-08/Imagem-Home-Pop-110i-Es-Preto-Black_0.webp",
    descricao: "Econômica, resistente e ideal para o dia a dia.",
    ativo: true,
    consorcios: [
      { plano: "24x", valor: "732,49" },
      { plano: "36x", valor: "497,99" },
      { plano: "48x", valor: "377,96" },
      { plano: "60x", valor: "306,83" },
      { plano: "80x", valor: "236,79" }
    ],
    cores: ["Vermelha", "Branca"]
  },
  {
    id: 5,
    nome: "Honda Sahara 300 ABS",
    cilindrada: 300,
    preco: "R$ 38.090 à vista",
    imagem: "https://www.honda.com.br/motos/sites/hda/files/2025-08/Imagem-Home-Sahara-300-Cinza-Met%C3%A1lico.webp",
    descricao: "Força, robustez e segurança para qualquer terreno.",
    ativo: true,
    consorcios: [
      { plano: "24x", valor: "1.970,55" },
      { plano: "36x", valor: "1.339,74" },
      { plano: "48x", valor: "1.016,94" },
      { plano: "60x", valor: "825,62" },
      { plano: "80x", valor: "637,39" }
    ],
    cores: ["Preta", "Cinza"]
  },
  {
    id: 6,
    nome: "Honda Sahara 300 ADV",
    cilindrada: 300,
    preco: "R$ 40.090 à vista",
    imagem: "https://www.honda.com.br/motos/sites/hda/files/2025-08/Imagem-Home-Sahara-300-Adventure-Bege%20Met%C3%A1lico.webp",
    descricao: "Versão aventureira, completa e pronta para qualquer desafio.",
    ativo: true,
    consorcios: [
      { plano: "24x", valor: "2.051,46" },
      { plano: "36x", valor: "1.394,76" },
      { plano: "48x", valor: "1.058,71" },
      { plano: "60x", valor: "859,53" },
      { plano: "80x", valor: "663,55" }
    ],
    cores: ["Bege", "Preta"]
  },
  {
    id: 7,
    nome: "Honda CG 160 Fan",
    cilindrada: 160,
    preco: "R$ 23.690 à vista",
    imagem: "https://www.honda.com.br/motos/sites/hda/files/2025-08/Imagem-Home-Honda-CG-160-Fan-Prata-Met%C3%A1lico.webp",
    descricao: "Robusta, econômica e perfeita para o uso diário.",
    ativo: true,
    consorcios: [
      { plano: "24x", valor: "1.234,44" },
      { plano: "36x", valor: "839,28" },
      { plano: "48x", valor: "637,05" },
      { plano: "60x", valor: "517,11" },
      { plano: "80x", valor: "399,25" }
    ],
    cores: ["Preta", "Prata"]
  },
  {
    id: 8,
    nome: "Honda CG 160 Start",
    cilindrada: 160,
    preco: "R$ 21.690 à vista",
    imagem: "https://www.honda.com.br/motos/sites/hda/files/2025-08/Imagem-Home-Honda-CG-160-Start-Vermelho-Perolizado_0.webp",
    descricao: "Modelo acessível e econômico.",
    ativo: true,
    consorcios: [
      { plano: "24x", valor: "1.144,38" },
      { plano: "36x", valor: "778,03" },
      { plano: "48x", valor: "590,51" },
      { plano: "60x", valor: "479,37" },
      { plano: "80x", valor: "369,96" }
    ],
    cores: ["Vermelha", "Preta"]
  },
  {
    id: 9,
    nome: "Honda XRE 190",
    cilindrada: 190,
    preco: "R$ 29.590 à vista",
    imagem: "https://santaremmotos.com.br/wp-content/uploads/2025/01/imagem-home-honda-xre-190-lateral-vermelho-1.webp",
    descricao: "Versátil e pronta para qualquer caminho.",
    ativo: true,
    consorcios: [
      { plano: "24x", valor: "1.520,31" },
      { plano: "36x", valor: "1.033,63" },
      { plano: "48x", valor: "784,57" },
      { plano: "60x", valor: "636,97" },
      { plano: "80x", valor: "491,73" }
    ],
    cores: ["Vermelha", "Preta"]
  },

  {
    id: 10,
    nome: "Honda PCX CBS",
    cilindrada: 160,
    preco: "R$ 23.190 à vista",
    imagem: "https://www.honda.com.br/motos/sites/hda/files/2025-08/imagem-home-honda-pcx-branco_0.webp",
    descricao: "Scooter premium com conforto e tecnologia.",
    ativo: true,
    consorcios: [
      { plano: "24x", valor: "1.490,13" },
      { plano: "36x", valor: "1.013,12" },
      { plano: "48x", valor: "769,00" },
      { plano: "60x", valor: "624,33" },
      { plano: "80x", valor: "482,03" }
    ],
    cores: ["Branca", "Preta"]
  },

  {
    id: 11,
    nome: "Honda Hornet 500",
    cilindrada: 471,
    preco: "R$ 50.990 à vista",
    imagem: "https://www.honda.com.br/motos/sites/hda/files/2025-08/Imagem-home-honda-Hornet500-Vermelha-Lateral_0.webp",
    descricao: "Performance e esportividade em alto nível.",
    ativo: true,
    consorcios: [{ plano: "72x", valor: "1.018,49" }],
    cores: ["Vermelha", "Preta"]
  },

  {
    id: 12,
    nome: "Honda CB 650R",
    cilindrada: 649,
    preco: "R$ 66.490 à vista",
    imagem: "https://www.honda.com.br/motos/sites/hda/files/2025-08/Imagem-Home-da-Moto-Honda-CB-650R-Azul-Perolizado.webp",
    descricao: "Estilo Neo Sports Café com performance incrível.",
    ativo: true,
    consorcios: [{ plano: "72x", valor: "1.052,60" }],
    cores: ["Vermelha", "Preta"]
  },

  {
    id: 13,
    nome: "Honda Twister ABS",
    cilindrada: 300,
    preco: "R$ 31.090 à vista",
    imagem: "https://www.honda.com.br/motos/sites/hda/files/2025-08/Imagem-home-honda-Twister-ABS-Azul-Lateral.webp",
    descricao: "Desempenho e segurança com freios ABS.",
    ativo: true,
    consorcios: [
      { plano: "24x", valor: "1.597,93" },
      { plano: "36x", valor: "1.086,41" },
      { plano: "48x", valor: "824,65" },
      { plano: "60x", valor: "669,50" },
      { plano: "80x", valor: "516,88" }
    ],
    cores: ["Azul", "Preta"]
  },

  {
    id: 14,
    nome: "Honda Twister CBS",
    cilindrada: 300,
    preco: "R$ 30.090 à vista",
    imagem: "https://www.honda.com.br/motos/sites/hda/files/2025-08/Imagem-home-honda-Twister-CBS-Vermelha-Lateral.webp",
    descricao: "Agilidade urbana com frenagem combinada.",
    ativo: true,
    consorcios: [
      { plano: "24x", valor: "1.521,65" },
      { plano: "36x", valor: "1.034,55" },
      { plano: "48x", valor: "785,27" },
      { plano: "60x", valor: "637,53" },
      { plano: "80x", valor: "492,17" }
    ],
    cores: ["Vermelha", "Prata"]
  },

  {
    id: 15,
    nome: "Honda Tornado 300L",
    cilindrada: 300,
    preco: "R$ 36.990 à vista",
    imagem: "https://www.honda.com.br/motos/sites/hda/files/2025-08/Imagem-Home-XR-300L-Tornado-Vermelho-Fighting-Red.webp",
    descricao: "A lenda voltou com muito mais força e tecnologia.",
    ativo: true,
    consorcios: [
      { plano: "24x", valor: "1.890,65" },
      { plano: "36x", valor: "1.285,42" },
      { plano: "48x", valor: "975,71" },
      { plano: "60x", valor: "792,15" },
      { plano: "80x", valor: "611,54" }
    ],
    cores: ["Vermelha"]
  },

  {
    id: 16,
    nome: "NXR 160 Bros ABS",
    cilindrada: 160,
    preco: "R$ 27.990 à vista",
    imagem: "https://www.honda.com.br/motos/sites/hda/files/2025-08/Imagem-Home-Honda-NXR-160-Bros-ABS-Cinza-Tempestade-Gray.webp",
    descricao: "Adventure versátil com performance equilibrada.",
    ativo: true,
    consorcios: [
      { plano: "24x", valor: "1.393,22" },
      { plano: "36x", valor: "947,23" },
      { plano: "48x", valor: "718,99" },
      { plano: "60x", valor: "583,73" },
      { plano: "80x", valor: "450,68" }
    ],
    cores: ["Cinza"]
  },

  {
    id: 17,
    nome: "NXR 160 Bros CBS",
    cilindrada: 160,
    preco: "R$ 27.190 à vista",
    imagem: "https://www.honda.com.br/motos/sites/hda/files/2025-08/Imagem-Home-Honda-NXR-160-Bros-CBS-Vermelha-Fighting-Red.webp",
    descricao: "Conforto e robustez para todos os terrenos.",
    ativo: true,
    consorcios: [
      { plano: "24x", valor: "1.335,61" },
      { plano: "36x", valor: "908,06" },
      { plano: "48x", valor: "689,26" },
      { plano: "60x", valor: "559,59" },
      { plano: "80x", valor: "432,04" }
    ],
    cores: ["Vermelha", "Preta"]
  },

  {
    id: 18,
    nome: "Honda ADV 160",
    cilindrada: 160,
    preco: "R$ 28.590 à vista",
    imagem: "https://www.honda.com.br/motos/sites/hda/files/2025-08/Imagem-home-Honda-ADV-Vermelha-Lateral_0.webp",
    descricao: "A Scooter aventureira pronta para o asfalto e além.",
    ativo: true,
    consorcios: [
      { plano: "24x", valor: "1.547,03" },
      { plano: "36x", valor: "1.051,80" },
      { plano: "48x", valor: "798,37" },
      { plano: "60x", valor: "648,17" },
      { plano: "80x", valor: "500,43" }
    ],
    cores: ["Vermelha", "Cinza"]
  },

  {
    id: 19,
    nome: "Honda CRF 300F",
    cilindrada: 300,
    preco: "R$ 24.190 à vista",
    imagem: "https://www.honda.com.br/motos/sites/hda/files/2025-08/Imagem-Home-Honda-CRF-300F-Vermelho-Extreme-Red.webp",
    descricao: "Performance off-road pura para trilhas profissionais.",
    ativo: true,
    consorcios: [
      { plano: "24x", valor: "1.337,36" },
      { plano: "36x", valor: "909,25" },
      { plano: "48x", valor: "690,16" },
      { plano: "60x", valor: "560,32" },
      { plano: "80x", valor: "432,61" }
    ],
    cores: ["Vermelha"]
  },

  {
    id: 20,
    nome: "Honda Elite 125",
    cilindrada: 125,
    preco: "R$ 15.690 à vista",
    imagem: "https://www.honda.com.br/motos/sites/hda/files/2025-08/Imagem-Home-Elite-125-Azul-Met%C3%A1lico-Mystery-Blue-Metallic_0.webp",
    descricao: "Design moderno e muita facilidade de pilotagem.",
    ativo: true,
    consorcios: [
      { plano: "24x", valor: "1.130,51" },
      { plano: "36x", valor: "768,60" },
      { plano: "48x", valor: "583,35" },
      { plano: "60x", valor: "473,56" },
      { plano: "80x", valor: "365,48" }
    ],
    cores: ["Azul", "Branca", "Vermelha"]
  },

  {
    id: 21,
    nome: "Honda Africa Twin",
    cilindrada: 1084,
    preco: "R$ 82.990 à vista",
    imagem: "https://www.honda.com.br/motos/sites/hda/files/2025-12/CRF1100L-Africa-Twin-DCT-ES-vista-lateralmente.webp",
    descricao: "A aventureira definitiva para grandes viagens.",
    ativo: true,
    consorcios: [{ plano: "72x", valor: "1.078,04" }],
    cores: ["Preta", "Branca"]
  },

  {
    id: 22,
    nome: "Honda Transalp 750",
    cilindrada: 755,
    preco: "R$ 67.890 à vista",
    imagem: "https://www.honda.com.br/motos/sites/hda/files/2025-11/honda-transalp-vista-lateral-completa-da-motocicleta.webp",
    descricao: "Equilíbrio entre turismo e off-road.",
    ativo: true,
    consorcios: [{ plano: "72x", valor: "1.042,30" }],
    cores: ["Branca", "Preta"]
  },

  {
    id: 24,
    nome: "Honda Hornet 750",
    cilindrada: 755,
    preco: "R$ 55.990 à vista",
    imagem: "https://www.honda.com.br/motos/sites/hda/files/2025-10/360-site-16fr_MLBF_Hornet75000_3.webp",
    descricao: "A lenda voltou com um motor bicilíndrico explosivo.",
    ativo: true,
    consorcios: [{ plano: "72x", valor: "1.018,48" }],
    cores: ["Branca", "Preta"]
  },

  {
    id: 25,
    nome: "Honda NC 750X",
    cilindrada: 745,
    preco: "R$ 59.990 à vista",
    imagem: "https://www.honda.com.br/motos/sites/hda/files/2025-10/Lateral-v.webp",
    descricao: "Tecnologia e praticidade com porta-capacete integrado.",
    ativo: true,
    consorcios: [{ plano: "72x", valor: "1.056,58" }],
    cores: ["Vermelha", "Azul"]
  },

  {
    id: 26,
    nome: "Honda TRX 420",
    cilindrada: 420,
    preco: "R$ 53.290 à vista",
    imagem: "https://www.honda.com.br/motos/sites/hda/files/2025-08/TRX%20Vermelha%202023%20Cor%20Eixo_lateral.webp",
    descricao: "O quadriciclo campeão de vendas para o trabalho.",
    ativo: true,
    consorcios: [
      { plano: "24x", valor: "3.520,38" },
      { plano: "36x", valor: "2.393,49" },
      { plano: "48x", valor: "1.816,79" },
      { plano: "60x", valor: "1.474,01" },
      { plano: "80x", valor: "1.138,44" }
    ],
    cores: ["Vermelha", "Verde"]
  },

  {
    id: 27,
    nome: "Honda CBR 650R",
    cilindrada: 649,
    preco: "R$ 69.990 à vista",
    imagem: "https://powersports.honda.com/motorcycle/sport/-/media/products/family/cbr650r/trims/trim-main/cbr650r-e-clutch/2026/2026-cbr650r-e-clutch-matte_black_metallic-1505x923.png",
    descricao: "Esportividade e adrenalina com 4 cilindros.",
    ativo: true,
    consorcios: [{ plano: "72x", valor: "1.000,52" }],
    cores: ["Vermelha", "Preta"]
  },

  {
    id: 28,
    nome: "Honda CB 1000R",
    cilindrada: 998,
    preco: "R$ 87.990 à vista",
    imagem: "https://www.honda.com.br/motos/sites/hda/files/2023-09/moto-honda-cb-1000r-vermelho-met%C3%A1lico-bordeaux-red-metallic-lateral_0.webp",
    descricao: "A poderosa Black Edition com design Neo Sports Café.",
    ativo: true,
    consorcios: [{ plano: "72x", valor: "994,93" }],
    cores: ["Preta"]
  },

  {
    id: 29,
    nome: "Honda PCX ABS",
    cilindrada: 160,
    preco: "R$ 25.590 à vista",
    imagem: "https://www.honda.com.br/motos/sites/hda/files/2025-08/visao-da-lateral-direita-da-honda-pcx-azul.webp",
    descricao: "Segurança avançada com freios ABS.",
    ativo: true,
    consorcios: [
      { plano: "24x", valor: "1.621,79" },
      { plano: "36x", valor: "1.102,64" },
      { plano: "48x", valor: "836,97" },
      { plano: "60x", valor: "679,51" },
      { plano: "80x", valor: "524,61" }
    ],
    cores: ["Azul", "Branca"]
  },

  {
    id: 30,
    nome: "Honda NX 500",
    cilindrada: 471,
    preco: "R$ 51.990 à vista",
    imagem: "https://www.honda.com.br/motos/sites/hda/files/2025-08/Imagem-home-honda-NX500-Vermelha-Lateral.webp",
    descricao: "Estilo crossover para o seu dia a dia.",
    ativo: true,
    consorcios: [{ plano: "72x", valor: "1.042,33" }],
    cores: ["Preta", "Vermelha"]
  },

  {
    id: 31,
    nome: "Honda Pop 110i ES +10",
    cilindrada: 110,
    preco: "R$ 13.890 à vista",
    imagem: "https://www.honda.com.br/motos/sites/hda/files/2025-08/Imagem-Home-Pop-110i-Es-Vermelho-Fighting-Red_0.webp",
    descricao: "Condição especial com o Plano +10 para a sua Pop.",
    ativo: true,
    consorcios: [
      { plano: "24x", valor: "732,49" },
      { plano: "36x", valor: "497,99" },
      { plano: "48x", valor: "377,96" },
      { plano: "60x", valor: "306,83" },
      { plano: "80x", valor: "236,79" }
    ],
    cores: ["Vermelha", "Branca"]
  }
];


// Retorna a categoria da moto conforme padrão Honda Brasil
window.getCategoria = function(produto) {
  if (!produto || produto.ativo === false) return null;
  const nome = (produto.nome || "").toUpperCase();
  
  // 1. SCOOTER: PCX, ADV 160, Elite, Biz, Pop (por nome)
  // Nota: "Sahara ADV" NÃO é scooter, apenas "ADV 160" é scooter
  if (
    nome.includes("PCX") ||
    nome.includes("ELITE") ||
    nome.includes("BIZ") ||
    nome.includes("POP") ||
    (nome.includes("ADV") && nome.includes("160"))
  ) {
    return "scooter";
  }
  
  // 2. CILINDRADA
  const cc = Number(produto.cilindrada);
  if (!isFinite(cc)) return null;
  if (cc <= 160) return "baixa";
  if (cc > 160 && cc <= 500) return "media";
  if (cc > 500) return "alta";
  return null;
};

// Filtra produtos ativos pela categoria exata
window.filtrarPorCategoria = function(categoria) {
  const cat = categoria.toLowerCase();
  return window.PRODUCTS.filter(produto => {
    if (!produto.ativo) return false;
    return window.getCategoria(produto) === cat;
  });
};

// (Opcional) Badge visual de categoria
window.getCategoriaBadge = function(categoria) {
  switch (categoria) {
    case "alta":
      return "<span class='badge badge-alta'>🔴 Alta Cilindrada</span>";
    case "media":
      return "<span class='badge badge-media'>🟡 Média Cilindrada</span>";
    case "baixa":
      return "<span class='badge badge-baixa'>🟢 Baixa Cilindrada</span>";
    case "scooter":
      return "<span class='badge badge-scooter'>🛵 Scooter</span>";
    default:
      return "";
  }
};

// Log para debug
console.log("[DATA.JS] Carregado com", window.PRODUCTS.length, "motos");
