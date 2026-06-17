"use strict"
import api from './apiService.js';

const form = document.querySelector('.auth-form');
const inputs = form.querySelectorAll('input');
const nameInput = document.getElementById('register-name');
const emailInput = document.getElementById('register-email');
const passwordInput = document.getElementById('register-password');
const confirmPasswordInput = document.getElementById('register-confirm-password');
const btnRegister = form.querySelector('button');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  await register();
});

btnRegister.addEventListener('click', async (e) => {
  e.preventDefault();
  await register();
});

async function register() {
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const confirmPassword = confirmPasswordInput.value.trim();

  if (!name || !email || !password || !confirmPassword) {
    alert('Preencha todos os campos.');
    return;
  }

  if (password !== confirmPassword) {
    alert('As senhas não coincidem.');
    return;
  }

  try {
    const newUser = await api.createUser({
      name: name,
      email: email,
      password: password,
      role: 'USER', 
    });

    alert('Cadastro realizado com sucesso!');
    sessionStorage.setItem('loggedUser', JSON.stringify(newUser));
    window.location.href = '/Interface/pages/homepage.html';

  } catch (error) {
    alert('Erro ao cadastrar: ' + erro.message);
  }
}