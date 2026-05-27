'use strict'

import api from './apiService.js'
var loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));

/* console.log(usuarioLogado)

var books = [
        {
        'cover':'/Interface/assets/book.png',
        'title':'girassol na Janela',
        'author':'Ganymédes José',
        'status':'Em Andamento',
        'situation':'lending',
    },
     {
        'cover':'/Interface/assets/book.png',
        'title':'girassol na Janela',
        'author':'Ganymédes José',
        'status':'Em Andamento',
        'situation':'lending',
    },
    {
        'cover':'/Interface/assets/book.png',
        'title':'girassol na Janela',
        'author':'Ganymédes José',
        'status':'Devolvido',
        'situation':'devolution',
    },
    {
        'cover':'/Interface/assets/book.png',
        'title':'girassol na Janela',
        'author':'Ganymédes José',
        'status':'Devolvido',
        'situation':'devolution',
    }
    ,
    {
        'cover':'/Interface/assets/book.png',
        'title':'girassol na Janela',
        'author':'Ganymédes José',
        'status':'Devolvido',
        'situation':'devolution',
    }
    ,
   
    {
        'cover':'/Interface/assets/book.png',
        'title':'girassol na Janela',
        'author':'Ganymédes José',
        'status':'Devolver',
        'situation':'lending',
    }

] */

var userLoans = await api.getLoansByUser(loggedUser.id);
const dateFormatter = new  Intl.DateTimeFormat('pt-BR', {
  dateStyle:'short',
  timeStyle:'short'
})


let hasActiveLoans = false;
let hasReturns = false;

var loanContainer = document.getElementById('loans-container');
var returnContainer = document.getElementById('returns-container');



   

 userLoans.forEach(element => {
    
  const loanDate = new Date(element.loanDate);
  const formattedDate = dateFormatter.format(loanDate);
   
    

 
        if(element.statusLoan == "ATIVO" || element.statusLoan == "ATRASADO"){
            hasActiveLoans = true;
            const overdue = element.statusLoan == "ATRASADO" || (element.returnDate && new Date(element.returnDate) < new Date());
            const statusLabel = overdue ? "ATRASADO" : element.statusLoan;
            const statusClass ="badge-status-active";
            let returnText = "";

            if (element.returnDate) {
                const formattedReturn = dateFormatter.format(new Date(element.returnDate));
                returnText = `<p class="date">Entrega prevista: ${formattedReturn}</p>`;
            }

            loanContainer.innerHTML += `
            <div class="loan-card " onclick="openBookModal(${element.book.bookId})">
              <img src=${element.book.cover}>
              <div class="loan-card-info">
              <h1 class="loan-card-title">${element.book.title}</h1>
              <p class="loan-card-author">${element.book.authors.map(a=> a.name).join(', ') || "sem author"}</p>
              <span class="${statusClass}">${statusLabel}</span>
              ${returnText}
              </div>
            </div>
            `;
        }
      


        if(element.statusLoan == "FINALIZADO"){
             hasReturns = true;
             returnContainer.innerHTML += `
        <div class="loan-card" onclick="openBookModal(${element.book.bookId})">
          <img src=${element.book.cover}>
          <div class="loan-card-info">
          <h1 class="loan-card-title">${element.book.title}</h1>
          <p class="loan-card-author">${element.book.authors.map(a=> a.name).join(', ') || "sem author"}</p>
          <span class="badge-status-returned">${element.statusLoan}</span>
          <p class="date">${formattedDate}</p>
          </div>
        </div>
        `   
        } 

          

   }
     

      
    );

   if(!hasActiveLoans){
            loanContainer.innerHTML = `<p class="empty-loans">Você não tem empréstimos.</p>`;
        }
        if(!hasReturns){
            returnContainer.innerHTML = `<p class="empty-returns">Você não tem devoluções.</p>`;
        }
     





