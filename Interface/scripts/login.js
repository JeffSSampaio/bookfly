import api from './apiService.js';

const form = document.querySelector('.auth-form');
const emailInput = document.getElementById('login-email');
const passwordInput = document.getElementById('login-password');
const btnEnter = form.querySelector('button');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  await doLogin();
});

btnEnter.addEventListener('click', async (e) => {
  try{
    e.preventDefault();
    await doLogin();
  }catch(error){
    alert('Erro ao fazer login: ' + error.message);
  }
});

async function doLogin() {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    alert('Preencha email e senha.');
    return;
  }

  try {
   
    const users = await api.getAllUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      alert('Usuário não encontrado.');
      return;
    }

   
    if (user.password !== password) {
      alert('Senha incorreta.');
      return;
    }

    sessionStorage.setItem('loggedUser', JSON.stringify(user));

    window.location.href = '/Interface/pages/homepage.html';

  } catch (error) {
    alert('Erro ao fazer login: ' + error.message);
  }
}