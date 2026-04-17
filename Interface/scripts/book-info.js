'use stricts'


var container_book_info = document.getElementById('book-info-container');


var book = {
        'cover':'/Interface/assets/livro.png',
        'title':'girassol na Janela',
        'author':'Ganymédes José',
        'status':'Indisponivel',
        'summary':"sdasdaaasasdawddaasdadssdafasfufufuyffyuydasd"
    }







container_book_info.innerHTML+=`
    <img src=${book.cover} alt="">
      <div class="b-book-info">

            <h1 class="t-book">${book.title.toUpperCase()}</h1>
            <h2 class="t-author">${book.author}</h2>

           <div class="s-book-status">
                <h2>Status</h2>
                    <p class="s-field-status">${book.status.toUpperCase()}</p>
           </div> 
            <div class="s-book">
                <h2>Sumario</h2>
                <p class="s-field-status ">${book.summary}</p>
           </div> 


    '</div>

`





