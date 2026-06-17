'use stricts'


var container_book_info = document.getElementById('book-info-container');


var book = {
        'cover':'/Interface/assets/book.png',
        'title':'girassol na Janela',
        'author':'Ganymédes José',
        'status':'Indisponivel',
        'summary':"sdasdaaasasdawddaasdadssdafasfufufuyffyuydasd"
    }







container_book_info.innerHTML+=`
    <img src=${book.cover} alt="">
      <div class="book-info-body">

            <h1 class="book-main-title">${book.title.toUpperCase()}</h1>
            <h2 class="book-author-title">${book.author}</h2>

           <div class="book-status-row">
                <h2>Status</h2>
                    <p class="book-status-badge">${book.status.toUpperCase()}</p>
           </div> 
            <div class="book-summary">
                <h2>Sumario</h2>
                <p class="s-field-status ">${book.summary}</p>
           </div> 


    '</div>

`





