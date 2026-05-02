import api from './apiService.js';

const form = document.querySelector('.login-container-form');
const emailInput = document.getElementById('email-login');
const senhaInput = document.getElementById('senha-login');
const btnEntrar = form.querySelector('button');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  await doLogin();
});

btnEntrar.addEventListener('click', async (e) => {
  e.preventDefault();
  await doLogin();
});

async function doLogin() {
  const email = emailInput.value.trim();
  const senha = senhaInput.value.trim();

  if (!email || !senha) {
    alert('Preencha email e senha.');
    return;
  }

  try {
   
    const usuarios = await api.getAllUsers();
    const usuario = usuarios.find(u => u.email === email);

    if (!usuario) {
      alert('Usuário não encontrado.');
      return;
    }

   
    if (usuario.password !== senha) {
      alert('Senha incorreta.');
      return;
    }

    sessionStorage.setItem('usuarioLogado', JSON.stringify(usuario));

    window.location.href = '/Interface/pages/homepage.html';

  } catch (erro) {
    alert('Erro ao fazer login: ' + erro.message);
  }
}