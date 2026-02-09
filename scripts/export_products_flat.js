const fs = require('fs');
const vm = require('vm');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'js', 'data.js');
const code = fs.readFileSync(dataPath, 'utf8');

const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(code, sandbox);

const products = sandbox.window.PRODUCTS;
if (!Array.isArray(products)) {
  console.error('ERRO: window.PRODUCTS não encontrado.');
  process.exit(1);
}

const maxCons = products.reduce((m, p) => {
  const len = Array.isArray(p.consorcios) ? p.consorcios.length : 0;
  return Math.max(m, len);
}, 0);

function escapeCsv(val) {
  if (val === null || val === undefined) return '';
  const s = String(val);
  if (s.includes('"') || s.includes(',') || s.includes('\n')) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

const header = ['id','nome','cilindrada','preco','descricao','ativo','imagem','cores'];
for (let i = 1; i <= maxCons; i++) {
  header.push(`plano_${i}`);
  header.push(`valor_${i}`);
}

const rows = [header.join(',')];

products.forEach(p => {
  const cores = Array.isArray(p.cores) ? p.cores.join('; ') : '';
  const descricao = p.descricao || '';
  const base = [
    p.id,
    escapeCsv(p.nome),
    p.cilindrada,
    escapeCsv(p.preco),
    escapeCsv(descricao),
    p.ativo ? 'TRUE' : 'FALSE',
    escapeCsv(p.imagem),
    escapeCsv(cores)
  ];

  const cons = Array.isArray(p.consorcios) ? p.consorcios : [];
  for (let i = 0; i < maxCons; i++) {
    if (cons[i]) {
      base.push(escapeCsv(cons[i].plano));
      base.push(escapeCsv(cons[i].valor));
    } else {
      base.push('');
      base.push('');
    }
  }

  rows.push(base.join(','));
});

const outPath = path.join(__dirname, '..', 'motos_produtos_planos.csv');
fs.writeFileSync(outPath, rows.join('\n'), 'utf8');
console.log('CSV gerado:', outPath, 'linhas:', rows.length);