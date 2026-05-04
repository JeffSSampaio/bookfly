'use strict'

import api from './apiService.js'
var usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));

console.log(usuarioLogado)

var books = [
        {
        'cover':'/Interface/assets/livro.png',
        'title':'girassol na Janela',
        'author':'Ganymédes José',
        'status':'Em Andamento',
        'situation':'lending',
    },
     {
        'cover':'/Interface/assets/livro.png',
        'title':'girassol na Janela',
        'author':'Ganymédes José',
        'status':'Em Andamento',
        'situation':'lending',
    },
    {
        'cover':'/Interface/assets/livro.png',
        'title':'girassol na Janela',
        'author':'Ganymédes José',
        'status':'Devolvido',
        'situation':'devolution',
    },
    {
        'cover':'/Interface/assets/livro.png',
        'title':'girassol na Janela',
        'author':'Ganymédes José',
        'status':'Devolvido',
        'situation':'devolution',
    }
    ,
    {
        'cover':'/Interface/assets/livro.png',
        'title':'girassol na Janela',
        'author':'Ganymédes José',
        'status':'Devolvido',
        'situation':'devolution',
    }
    ,
   
    {
        'cover':'/Interface/assets/livro.png',
        'title':'girassol na Janela',
        'author':'Ganymédes José',
        'status':'Devolver',
        'situation':'lending',
    }

]

var booksLoan = await api.getLoansByUser(usuarioLogado.id);
const formatador = new  Intl.DateTimeFormat('pt-BR', {
  dateStyle:'short',
  timeStyle:'short'
})


var container_emprestimo = document.getElementById('emprestimo');
var container_devolucao = document.getElementById('devolucao');
var container_atrasado = document.getElementById("atrasado");
var content_atrasado = document.getElementById('c-atrasado').style.display='none'


 booksLoan.forEach(element => {
    
  const dataloan = new Date(element.loanDate);
  const dataFormated = formatador.format(dataloan);

        if(element.statusLoan == "ATIVO"){
             container_emprestimo.innerHTML += `
        <div class="c-card-emprestimo">
          <img src=${element.book.cover}>
          <div class="card-info-text">
          <h1 class="c-emprestimo-text-title">${element.book.title}</h1>
          <p class="c-emprestimo-text-author">${element.book.authors.map(a=> a.name).join(', ') || "sem author"}</p>
          <span class="text-emprestimo-ongoing">${element.statusLoan}</span>
          <p class="date">${dataFormated}</p>
          </div>
        </div>
        `  }
      


        if(element.statusLoan == "ATRASADO"){
          container_atrasado.style.display='block'
             container_atrasado.innerHTML += `
        <div class="c-card-emprestimo">
          <img src=${element.book.cover}>
          <div class="card-info-text">
          <h1 class="c-emprestimo-text-title">${element.book.title}</h1>
          <p class="c-emprestimo-text-author">${element.book.authors.map(a=> a.name).join(', ') || "sem author"}</p>
          <span class="text-emprestimo-ongoing">${element.statusLoan}</span>
          <p class="date">${dataFormated}</p>
          </div>
        </div>
        `  }


        if(element.statusLoan == "FINALIZADO"){
             container_devolucao.innerHTML += `
        <div class="c-card-emprestimo">
          <img src=${element.book.cover}>
          <div class="card-info-text">
          <h1 class="c-emprestimo-text-title">${element.book.title}</h1>
          <p class="c-emprestimo-text-author">${element.book.authors.map(a=> a.name).join(', ') || "sem author"}</p>
          <span class="text-emprestimo-verde">${element.statusLoan}</span>
          <p class="date">${dataFormated}</p>
          </div>
        </div>
        `   
        } 

          


        }

      
    );






