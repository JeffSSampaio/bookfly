import api from './apiService.js';

var usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));

var bookcases = await api.getBookcasesByUser(usuarioLogado.id);

var bookcase = document.getElementById('bookcase');

bookcases.forEach(element => {

    let livros = "";

    element.books.forEach(book => {
        livros += `
            <div class="book">
                <img src="${book.cover}" alt="">
                <div class="book-info">
                    <h3>${book.title.toUpperCase()}</h3>
                    <p>${book.author}</p>
                    <button 
                        class="btn-remover-livro"
                        onclick="removeBook(${element.id}, ${book.stockId}, this)">
                        Remover
                    </button>
                </div>
            </div>
        `;
    });

    bookcase.innerHTML += `
        <div class='books-container'>
            <div class="title-bookase-container">
                <h1>${element.name}</h1>
                <span>
                    <img src="/Interface/assets/iconAdd.svg" alt=""
                         onclick="openAddBookModal(${element.id}, '${element.name}', this)">
                </span>
                <span>
                    <img src="/Interface/assets/iconEdit.svg" alt=""
                         onclick="openBookcaseEditModal(${element.id}, '${element.name}', this)">
                </span>
            </div>
            <div class="c-book" id="c-book-${element.id}">
                ${livros}
            </div>
        </div>
    `;
});