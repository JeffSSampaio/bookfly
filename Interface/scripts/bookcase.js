import api from './apiService.js';

var usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));

var bookcases = await api.getBookcasesByUser(usuarioLogado.id);



var bookcase = document.getElementById('bookcase');


bookcases.forEach(element => {
   

   
    
  
    let livros = ""


    element.books.forEach(book => {
        
        livros +=  ` 
  

            <div class="book">
                  <img src=${book.cover} alt="">
                 <div class="book-info">
                    <h3>${book.title.toUpperCase()}</h3>
                     <p>${book.author}</p>
                </div>
            </div>

    
    `
 
    })



    bookcase.innerHTML +=
    ` 
    <div class='books-container'>
        <div class="title-bookase-container">
            <h1>${element.name}</h1>
            <span>  <img src="/Interface/assets/iconAdd.svg" alt="" onClick="abrirModalEstanteAdicao()"></span>
            <span>  <img src="/Interface/assets/iconEdit.svg" alt="" onClick="abrirModalEstanteEdicao('${element.name}')"></span>
        </div>
        <div class="c-book">
            ${livros}
        </div>

    </div>
    `

   // bookcase.innerHTML += estante(livros)

   
});


