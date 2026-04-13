'use strict'

var books = [
        {
        'cover':'/Interface/assets/livro.png',
        'title':'girassol na Janela',
        'author':'Ganymédes José',
        'status':'Em Andamento',
        'situation':'lending',
    },
    {
        'cover':'/Interface/assets/livro.png',
        'title':'girassol na Janela',
        'author':'Ganymédes José',
        'status':'Devolvido',
        'situation':'devolution',
    },
    {
        'cover':'/Interface/assets/livro.png',
        'title':'girassol na Janela',
        'author':'Ganymédes José',
        'status':'Devolvido',
        'situation':'devolution',
    }
    ,
    {
        'cover':'/Interface/assets/livro.png',
        'title':'girassol na Janela',
        'author':'Ganymédes José',
        'status':'Devolver',
        'situation':'lending',
    }

]

var container_emprestimo = document.getElementById('emprestimo');
var container_devolucao = document.getElementById('devolucao')

 books.forEach(element => {
    
    var status = [
        'style="color: blue ;"',
        'style="color: red ;"',
        'style="color: green ;"'    
        
    ] 

        if(element.situation == 'lending' ){


        if(element.status == "Devolvido"){
             container_emprestimo.innerHTML += `
        <div class="c-card-emprestimo">
          <img src=${element.cover}>
          <div class="card-info-text">
          <h1>${element.title.toUpperCase()}</h1>
          <p>${element.author}</p>
          <span ${status[2]} >${element.status}</span>
          </div>
        </div>
        `  
        } else if(element.status == "Em Andamento"){
             container_emprestimo.innerHTML += `
        <div class="c-card-emprestimo">
          <img src=${element.cover}>
          <div class="card-info-text">
          <h1>${element.title.toUpperCase()}</h1>
          <p>${element.author}</p>
          <span ${status[0]} >${element.status}</span>
          </div>
        </div>
        `  
        } else if(element.status =="Devolver"){
             container_emprestimo.innerHTML += `
        <div class="c-card-emprestimo">
          <img src=${element.cover}>
          <div class="card-info-text">
          <h1>${element.title.toUpperCase()}</h1>
          <p>${element.author}</p>
          <span ${status[1]} >${element.status}</span>
          </div>
        </div>
        `  
        } 

          }

            if(element.situation == 'devolution' ){


        if(element.status == "Devolvido"){
             container_devolucao.innerHTML += `
        <div class="c-card-emprestimo">
          <img src=${element.cover}>
          <div class="card-info-text">
          <h1>${element.title.toUpperCase()}</h1>
          <p>${element.author}</p>
          <span ${status[2]} >${element.status}</span>
          </div>
        </div>
        `  
        } else if(element.status == "Em Andamento"){
             container_devolucao.innerHTML += `
        <div class="c-card-emprestimo">
          <img src=${element.cover}>
          <div class="card-info-text">
          <h1>${element.title.toUpperCase()}</h1>
          <p>${element.author}</p>
          <span ${status[0]} >${element.status}</span>
          </div>
        </div>
        `  
        } else if(element.status =="Devolver"){
             container_devolucao.innerHTML += `
        <div class="c-card-emprestimo">
          <img src=${element.cover}>
          <div class="card-info-text">
          <h1>${element.title}</h1>
          <p>${element.author}</p>
          <span ${status[1]} >${element.status}</span>
          </div>
        </div>
        `  
        } 

          }




      
    });






