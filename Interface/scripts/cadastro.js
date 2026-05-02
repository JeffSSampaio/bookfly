"use strict"
import api from './apiService.js';

const form = document.querySelector('.login-container-form');
const inputs = form.querySelectorAll('input');
const nomeInput = document.getElementById('nome-cadastro');
const emailInput = document.getElementById('email-cadastro');
const senhaInput = document.getElementById('senha-cadastro');
const confirmarSenhaInput = document.getElementById('confirmar-senha-cadastro');
const btnCadastrar = form.querySelector('button');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  await register();
});

btnCadastrar.addEventListener('click', async (e) => {
  e.preventDefault();
  await register();
});

async function register() {
  const nome = nomeInput.value.trim();
  const email = emailInput.value.trim();
  const senha = senhaInput.value.trim();
  const confirmarSenha = confirmarSenhaInput.value.trim();

  if (!nome || !email || !senha || !confirmarSenha) {
    alert('Preencha todos os campos.');
    return;
  }

  if (senha !== confirmarSenha) {
    alert('As senhas não coincidem.');
    return;
  }

  try {
    const novoUsuario = await api.createUser({
      name: nome,
      email: email,
      password: senha,
      role: 'USER', 
    });

    alert('Cadastro realizado com sucesso!');
    sessionStorage.setItem('usuarioLogado', JSON.stringify(novoUsuario));
    window.location.href = '/Interface/pages/homepage.html';

  } catch (erro) {
    alert('Erro ao cadastrar: ' + erro.message);
  }
}