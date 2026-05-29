'use strict'

import api from './apiService.js'

var loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));

var userLoans = await api.getLoansByUser(loggedUser.id);

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short'
})

let hasActiveLoans = false;
let hasReturns = false;

var loanContainer = document.getElementById('loans-container');
var returnContainer = document.getElementById('returns-container');

if (loanContainer) loanContainer.innerHTML = '';
if (returnContainer) returnContainer.innerHTML = '';

userLoans.forEach(element => {

  
    if (element.status === "CANCELADO") {
        return;
    }

    const loanDate = new Date(element.loanDate);
    const formattedDate = dateFormatter.format(loanDate);

  
    if (element.status === "ATIVO" || element.status === "ATRASADO") {

        hasActiveLoans = true;

        const overdue =
            element.status === "ATRASADO" ||
            (element.returnDate && new Date(element.returnDate) < new Date());

        const statusLabel = overdue ? "ATRASADO" : element.status;

        const statusClass = "badge-status-active";

        let returnText = "";

        if (element.returnDate) {
            const formattedReturn = dateFormatter.format(new Date(element.returnDate));

            returnText = `
                <p class="date">
                    Entrega prevista: ${formattedReturn}
                </p>
            `;
        }

        if (loanContainer) {
            loanContainer.innerHTML += `
        
             <div class="loan-card" onclick="openBookModalLoaned(${loggedUser.id}, ${element.book.bookId})">
              <img src="${element.book.cover}">

              <div class="loan-card-info">
                <h1 class="loan-card-title" title="${element.book.title}">
                    ${element.book.title}
                </h1>

                <p class="loan-card-author">
                    ${element.book.authors.map(a => a.name).join(', ') || "sem author"}
                </p>

                <span class="${statusClass}">
                    ${statusLabel}
                </span>

                ${returnText}
              </div>
            </div>
            `;
        }
    }


    if (element.status === "FINALIZADO") {

        hasReturns = true;

        if (returnContainer) {
            returnContainer.innerHTML += `
            <div class="loan-card" onclick="openBookModal(${element.book.bookId})">
              <img src="${element.book.cover}">

              <div class="loan-card-info">
                <h1 class="loan-card-title">
                    ${element.book.title}
                </h1>

                <p class="loan-card-author">
                    ${element.book.authors.map(a => a.name).join(', ') || "sem author"}
                </p>

                <span class="badge-status-returned">
                    ${element.status}
                </span>

                <p class="date">
                    ${formattedDate}
                </p>
              </div>
            </div>
            `;
        }
    }
});

if (!hasActiveLoans && loanContainer) {
    loanContainer.innerHTML = `
        <p class="empty-loans">
            Você não tem empréstimos.
        </p>
    `;
}

if (!hasReturns && returnContainer) {
    returnContainer.innerHTML = `
        <p class="empty-returns">
            Você não tem devoluções.
        </p>
    `;
}