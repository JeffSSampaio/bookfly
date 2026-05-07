'use strict'

import api from './apiService.js'
var usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));

/* console.log(usuarioLogado)

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

] */

var booksLoan = await api.getLoansByUser(usuarioLogado.id);
const formatador = new  Intl.DateTimeFormat('pt-BR', {
  dateStyle:'short',
  timeStyle:'short'
})


let isLoaned = false;
let isDevolved = false;

var container_emprestimo = document.getElementById('emprestimo');
var container_devolucao = document.getElementById('devolucao');





console.log(booksLoan)


   

 booksLoan.forEach(element => {
    
  const dataloan = new Date(element.loanDate);
  const dataFormated = formatador.format(dataloan);
   
    

 
        if(element.statusLoan == "ATIVO" || element.statusLoan == "ATRASADO"){
            isLoaned = true;
            const overdue = element.statusLoan == "ATRASADO" || (element.returnDate && new Date(element.returnDate) < new Date());
            const statusLabel = overdue ? "ATRASADO" : element.statusLoan;
            const statusClass = overdue ? "text-emprestimo-atrasado" : "text-emprestimo-ongoing";
            let returnText = "";

            if (element.returnDate) {
                const formattedReturn = formatador.format(new Date(element.returnDate));
                returnText = `<p class="date">Entrega prevista: ${formattedReturn}</p>`;
            }

            container_emprestimo.innerHTML += `
            <div class="c-card-emprestimo " onclick="openBookModal(${element.book.bookId})">
              <img src=${element.book.cover}>
              <div class="card-info-text">
              <h1 class="c-emprestimo-text-title">${element.book.title}</h1>
              <p class="c-emprestimo-text-author">${element.book.authors.map(a=> a.name).join(', ') || "sem author"}</p>
              <span class="${statusClass}">${statusLabel}</span>
              ${returnText}
              </div>
            </div>
            `;
        }
      


        if(element.statusLoan == "FINALIZADO"){
             isDevolved = true;
             container_devolucao.innerHTML += `
        <div class="c-card-emprestimo" onclick="openBookModal(${element.book.bookId})">
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

   if(!isLoaned){
            container_emprestimo.innerHTML = `<p>Você não tem empréstimos.</p>`;
        }
        if(!isDevolved){
            container_devolucao.innerHTML = `<p>Você não tem devoluções.</p>`;
        }
     





