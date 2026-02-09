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

function escapeCsv(val) {
  if (val === null || val === undefined) return '';
  const s = String(val);
  if (s.includes('"') || s.includes(',') || s.includes('\n')) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

const rows = [];
rows.push(['id','nome','cilindrada','preco','descricao','plano','valor','cores','imagem','ativo'].join(','));

products.forEach(p => {
  const cores = Array.isArray(p.cores) ? p.cores.join('; ') : '';
  const descricao = p.descricao || '';
  if (Array.isArray(p.consorcios) && p.consorcios.length > 0) {
    p.consorcios.forEach(c => {
      const row = [
        p.id,
        escapeCsv(p.nome),
        p.cilindrada,
        escapeCsv(p.preco),
        escapeCsv(descricao),
        escapeCsv(c.plano),
        escapeCsv(c.valor),
        escapeCsv(cores),
        escapeCsv(p.imagem),
        p.ativo ? 'TRUE' : 'FALSE'
      ];
      rows.push(row.join(','));
    });
  } else {
    const row = [
      p.id,
      escapeCsv(p.nome),
      p.cilindrada,
      escapeCsv(p.preco),
      escapeCsv(descricao),
      '',
      '',
      escapeCsv(cores),
      escapeCsv(p.imagem),
      p.ativo ? 'TRUE' : 'FALSE'
    ];
    rows.push(row.join(','));
  }
});

const outPath = path.join(__dirname, '..', 'motos_consorcios.csv');
fs.writeFileSync(outPath, rows.join('\n'), 'utf8');
console.log('CSV gerado:', outPath, 'linhas:', rows.length);