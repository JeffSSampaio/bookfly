


var bookcases = [
    {
        'name':"Estante 1",
        'books': [
        {
        'cover':'../assets/livro.png',
        'title':'girassol na Janela',
        'author':'Ganymédes José',
         },
          {
        'cover':'../assets/livro.png',
        'title':'girassol na Janela',
        'author':'Ganymédes José',
         },
         {
        'cover':'../assets/livro.png',
        'title':'girassol na Janela',
        'author':'Ganymédes José',
         },
         {
        'cover':'../assets/livro.png',
        'title':'girassol na Janela',
        'author':'Ganymédes José',
         },
         
         
        ]
    },
      {
        'name':"Estante 2",
        'books': [
        {
        'cover':'../assets/livro.png',
        'title':'girassol na Janela',
        'author':'Ganymédes José',
         },
          {
        'cover':'../assets/livro.png',
        'title':'girassol na Janela',
        'author':'Ganymédes José',
         },
         {
        'cover':'../assets/livro.png',
        'title':'girassol na Janela',
        'author':'Ganymédes José',
         },
         {
        'cover':'../assets/livro.png',
        'title':'girassol na Janela',
        'author':'Ganymédes José',
         },
         
         
        ]
    },
    
]


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


