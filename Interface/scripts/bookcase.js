import api from './apiService.js';

var usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
var bookcases = await api.getBookcasesByUser(usuarioLogado.id);
var bookcase = document.getElementById('bookcase');

bookcases.forEach(element => {

    let livros = "";

    element.books.forEach(book => {
        const autor = book.authors
            ? book.authors.map(a => a.name).join(', ')
            : (book.author || 'Autor desconhecido');

        livros += cardBook(book.cover, book.title, autor, element.id, book.stockId);
    });

    bookcase.innerHTML += `
        <div class="books-container">
            <div class="title-bookase-container">
                <h1>${element.name}</h1>
                <span>
                    <img src="/Interface/assets/iconAdd.svg" alt="Adicionar livro"
                         onclick="openAddBookModal(${element.id}, '${element.name}', this)">
                </span>
                <span>
                    <img src="/Interface/assets/iconEdit.svg" alt="Editar estante"
                         onclick="openBookcaseEditModal(${element.id}, '${element.name}', this)">
                </span>
            </div>
            <div class="c-book grid-cards-book" id="c-book-${element.id}">
                ${livros}
            </div>
        </div>
    `;
});



function cardBook(cover, title, author, bookcaseId, stockId) {
    const btnRemover = (bookcaseId !== undefined && stockId !== undefined)
        ? `<button class="btn-card-remover"
                   onclick="removeBook(${bookcaseId}, ${stockId}, this)"
                   title="Remover">
               <img src="/Interface/assets/iconDelete.svg" alt="Remover">
           </button>`
        : '';

    return `
        <div class="c-card-emprestimo c-card-book">
            <img src="${cover || '/Interface/assets/livro.png'}" alt="">
            <div class="card-book-info">
                <h1 class="c-emprestimo-text-title card-book-title">${(title || '').toUpperCase()}</h1>
                <p class="c-emprestimo-text-author card-book-author">${author || ''}</p>
            </div>
            ${btnRemover}
        </div>
    `;
}

window.cardBook = cardBook;