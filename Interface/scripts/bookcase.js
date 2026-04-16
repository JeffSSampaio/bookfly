


var bookcases = [
    {
        'name':"Terror em Dobro",
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
         
         
        ]
    },
      {
        'name':"Terror em Dobro2",
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
        ]
    },
    
]


var bookcase = document.getElementById('bookcase');


bookcases.forEach(element => {
   

    bookcase.innerHTML += `
    
    
        <div class="title-bookase-container">
            <h1>${element.name}</h1>
            <span>  <img src="/Interface/assets/iconAdd.svg" alt="" onClick="abrirModalEstanteAdicao()"></span>
            <span>  <img src="/Interface/assets/iconEdit.svg" alt="" onClick="abrirModalEstanteEdicao('${element.name}')"></span>
        </div>
       

 ` 
    
  
    let livros = ""


    element.books.forEach(book => {
        
        livros +=  ` 
  

            <div class="book">
                  <img src=${book.cover} alt="">
                 <div class="book-info">
                    <p>${book.title.toUpperCase()}</p>
                     <p>${book.author}</p>
                </div>
            </div>

    
    `
 
    })

    bookcase.innerHTML +=
    ` 
    <div class='books-container'>

    ${livros}

    </div>
    `

   // bookcase.innerHTML += estante(livros)

   
});


