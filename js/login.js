// login.js - lógica simples de autenticação

const USUARIO_PADRAO = 'admin';
const SENHA_PADRAO = '1234'; // Troque para uma senha forte em produção

const form = document.getElementById('loginForm');
const erro = document.getElementById('loginError');

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const usuario = form.usuario.value.trim();
  const senha = form.senha.value;
  if (usuario === USUARIO_PADRAO && senha === SENHA_PADRAO) {
    localStorage.setItem('logadoADM', '1');
    window.location.href = 'dashboard.html';
  } else {
    erro.style.display = 'block';
  }
});
