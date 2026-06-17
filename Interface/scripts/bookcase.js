import api from './apiService.js';

var loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));
var bookcases = await api.getBookcasesByUser(loggedUser.id) || '<p class="modal-loading-text">Estante vazia</p>';
var bookcase = document.getElementById('bookcase');


if (!bookcases || bookcases.length === 0) {
    bookcase.innerHTML = `
        <p class="modal-loading-text">Não há Nenhuma Estante!</p>
    `;}


bookcases.forEach(element => {

    let booksHtml = "";

    element.books.forEach(book => {
        const autor = book.authors
            ? book.authors.map(a => a.name).join(', ')
            : (book.author || 'Autor desconhecido');

        booksHtml += cardBook(book.cover, book.title, autor, element.id, book.stockId);
    });

    bookcase.innerHTML += `
        <div class="books-container">
            <div class="shelf-header">
                <h1>${element.name}</h1>
                <span>
                    <img src="/Interface/assets/iconAdd.svg" alt="Add book"
                         onclick="openAddBookModal(${element.id}, '${element.name}', this)">
                </span>
                <span>
                    <img src="/Interface/assets/iconEdit.svg" alt="Editar estante"
                         onclick="openBookcaseEditModal(${element.id}, '${element.name}', this)">
                </span>
            </div>
            <div class="c-book grid-cards-book" id="c-book-${element.id}">
                ${booksHtml}
            </div>
        </div>
    `;
});



function cardBook(cover, title, author, bookcaseId, stockId) {
    const btnRemover = (bookcaseId !== undefined && stockId !== undefined)
        ? `<button class="btn-remove-book"
                   onclick="removeBook(${bookcaseId}, ${stockId}, this)"
                   title="Remover">
               <img src="/Interface/assets/iconDelete.svg" alt="Remover">
           </button>`
        : '';

    return `
        <div class="loan-card c-card-book">
            <img src="${cover || '/Interface/assets/book.png'}" alt="">
            <div class="shelf-book-info">
                <h1 class="loan-card-title card-book-title">${(title || '').toUpperCase()}</h1>
                <p class="loan-card-author card-book-author">${author || ''}</p>
            </div>
            ${btnRemover}
        </div>
    `;
}

window.cardBook = cardBook;