'use strict'
import api from './apiService.js';

function modalForm({ title, fields = [], onSubmit }) {

    let htmlContent = "";

    fields.forEach(field => {
        htmlContent += `
        <div class="f-input-modal">
            <label for="${field.name}">${field.label}</label>
            <input type="${field.type}" name="${field.name}" id="${field.name}" />
        </div>
        `;
    });

    const modalHTML = `
    <div class="modal">
        <div class="c-modal">
            <div class="b-modal">
                <h1>${title}</h1>
                <form class="c-modal-form">
                    ${htmlContent}
                </form>
                <div class="c-modal-btn">
                    <button type="button" class="closeBtn">Fechar</button>
                    <button type="button" class="confirmBtn">Confirmar</button>
                </div>
            </div>
        </div>
    </div>
    `;

  
    document.body.insertAdjacentHTML("beforeend", modalHTML);


    const modals = document.querySelectorAll(".modal");
    const modal = modals[modals.length - 1];

    const confirmBtn = modal.querySelector(".confirmBtn");
    const closeBtn = modal.querySelector(".closeBtn");
    const form = modal.querySelector("form");

   
    confirmBtn.addEventListener("click", function () {

        const formData = new FormData(form);
        let data = {};

        formData.forEach((value, key) => {
            data[key] = value;
        });

        console.log("Dados capturados:", data); 

        if (onSubmit) {
            onSubmit(data);
        }

        modal.remove(); 
    });

   
    closeBtn.addEventListener("click", function () {
        modal.remove();
    });

    
    modal.addEventListener("click", function (e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// modal so que com o style
function modalFormStyle({ title, fields = [], onSubmit, styles = {} }) {

    let htmlContent = "";

    fields.forEach(field => {
        htmlContent += `
        <div class="f-input-modal ${field.wrapperClass || ""}">
            <label class="${field.labelClass || ""}">${field.label}</label>
            <input 
                type="${field.type}" 
                name="${field.name}" 
                class="${field.class || ""}"
            />
        </div>
        `;
    });

    const modalHTML = `
    <div class="modal">
        <div class="c-modal">
            <div class="b-modal">
                <h1>${title}</h1>
                <form class="c-modal-form">
                    ${htmlContent}
                </form>
                <div class="c-modal-btn">
                    <button type="button" class="closeBtn">Fechar</button>
                    <button type="button" class="confirmBtn">Confirmar</button>
                </div>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);

    const modals = document.querySelectorAll(".modal");
    const modal = modals[modals.length - 1];

    const confirmBtn = modal.querySelector(".confirmBtn");
    const closeBtn = modal.querySelector(".closeBtn");
    const form = modal.querySelector("form");

  
    applyStyles(styles, modal);

    confirmBtn.addEventListener("click", function () {

        const formData = new FormData(form);
        let data = {};

        formData.forEach((value, key) => {
            data[key] = value;
        });

        console.log("Dados capturados:", data);

        if (onSubmit) {
            onSubmit(data);
        }

        modal.remove();
    });

    closeBtn.addEventListener("click", function () {
        modal.remove();
    });

    modal.addEventListener("click", function (e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}



function applyStyles(styles, modal) {
    if (!styles) return;

    let css = "";

    Object.keys(styles).forEach(selector => {
        css += `${selector} {`;

        Object.keys(styles[selector]).forEach(prop => {
            css += `${prop}: ${styles[selector][prop]};`;
        });

        css += `}`;
    });

    const styleTag = document.createElement("style");
    styleTag.innerHTML = css;

    modal.appendChild(styleTag);
}


function closeModal(){
    const modals = document.querySelectorAll(".modal");
    const modal = modals[modals.length - 1];

    if(modal){
        modal.remove();
    }
}





function openLoanModal(){
    modalForm(
        {
            title: 'Fazer Emprestimo',
            fields:[
                {label:'Nome do Livro',type:'search', name:'name'}
                ],
                onSubmit: (formData)=>{
                    var loanContainer = document.getElementById('emprestimo');
                    var returnContainer = document.getElementById('devolucao');

                    formData.forEach(element => {
    
    var status = [
        'style="color: blue ;"',
        'style="color: red ;"',
        'style="color: green ;"'    
        
    ] 

        if(element.situation == 'lending' ){


        if(element.status == "Devolvido"){
             loanContainer.innerHTML += `
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
             loanContainer.innerHTML += `
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
             loanContainer.innerHTML += `
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
             returnContainer.innerHTML += `
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
             returnContainer.innerHTML += `
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
             returnContainer.innerHTML += `
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

                }
        }
    )

}

function openRegisterBookModal(){
    modalForm(
    {
        title:'Cadastrar Livros ',
        fields:
        [
            {label:'Titulo',type:'text',name:'titulo'},
            {label:'Capa',type:'text',name:'capa'},
             {label:'Qtd',type:'text',name:'quantidade'}

        ],
        onSubmit: (formData)=>{
            console.log(formData)
            var content = document.getElementById('c-register-books');

                content.innerHTML += `
                <div clas="c-book">
                     <h2>${formData.titulo}</h2>
                     <img src="${formData.capa}" alt="" />
                     <p>Quantidade Disponível: ${formData.quantidade}</p>
                 </div>
                 `;
            

        }
    }
)
}


window.openBookcaseModal = function () {
  const loggedUser = JSON.parse(sessionStorage.getItem('usuarioLogado'));

  modalForm({
    title: "Criar Estante",
    fields: [
      { label: "Nome da Estante", type: "text", name: "name" },
    ],
    onSubmit: async (data) => {
      try {
        if (!data.name || data.name.trim() === '') {
          alert('Nome inválido');
          return;
        }

        const newBookcase = await api.createBookcase(data.name, loggedUser.id);

        const bookcaseEl = document.getElementById('bookcase');

        bookcaseEl.innerHTML += `
          <div class='books-container'>
            <div class="title-bookase-container">
              <h1>${newBookcase.name}</h1>
              <span>
                <img src="/Interface/assets/iconAdd.svg" alt=""
                     onclick="openAddBookModal(${newBookcase.id}, '${newBookcase.name}', this)">
              </span>
              <span>
                <img src="/Interface/assets/iconEdit.svg" alt=""
                     onclick="openBookcaseEditModal(${newBookcase.id}, '${newBookcase.name}', this)">
              </span>
            </div>
            <div class="c-book" id="c-book-${newBookcase.id}">
            </div>
          </div>
        `;

      } catch (error) {
        alert("Erro ao criar estante: " + error.message);
      }
    }
  });
};



window.openBookcaseEditModal = function (bookcaseId, currentName, triggerElement) {
  const modalHTML = `
    <div class="modal" id="modal-edicao">
      <div class="c-modal" style="min-width:520px; max-width:620px;">
        <div class="b-modal">
          <h1>Alterar</h1>

          <div class="f-input-modal">
            <label>Estante</label>
            <input type="text" id="novo-nome-estante" value="${currentName}" />
          </div>

          <div style="margin: 12px 0;">
            <div style="display:flex; align-items:center; border:1px solid #ccc; border-radius:8px; padding:6px 10px; gap:8px;">
              <input type="search" id="busca-livros-edicao" placeholder="Buscar" style="border:none; outline:none; width:100%; font-size:14px;" />
              <img src="/Interface/assets/iconlupa.svg" style="width:18px; height:18px;">
            </div>
          </div>

          <div id="grid-livros-edicao" style="
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            max-height: 320px;
            overflow-y: auto;
            padding: 4px;
          "></div>

          <div class="c-modal-btn" style="margin-top:16px;">
            <button type="button" id="btn-cancelar-edicao">Cancelar</button>
            <button type="button" id="btn-confirmar-edicao">Adicionar</button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);

  const modal = document.getElementById('modal-edicao');
  const grid = document.getElementById('grid-livros-edicao');
  const searchInput = document.getElementById('busca-livros-edicao');


  searchInput.addEventListener('input', () => {
      const term = searchInput.value.toLowerCase();
      const filteredBooks = allBooks.filter(b =>
        b.title.toLowerCase().includes(term) || b.author.toLowerCase().includes(term)
      );
      renderBooks(filteredBooks);
    });


 
  api.getBookcaseById(bookcaseId).then(bookcase => {
    let allBooks = bookcase.books || [];

    function renderBooks(books) {
      grid.innerHTML = '';
      books.forEach(book => {
        grid.innerHTML += `
          <div class="book" style="position:relative; flex-direction:column; align-items:center; padding:10px;">
            <img src="${book.cover}" style="width:48px; height:48px;">
            <div class="book-info" style="text-align:center;">
              <h3 style="font-size:13px;">${book.title.toUpperCase()}</h3>
              <p style="font-size:12px;">${book.author}</p>
            </div>
          </div>
        `;
      });
    }

    renderBooks(allBooks);

    
  });

  document.getElementById('btn-confirmar-edicao').addEventListener('click', async () => {
    const newName = document.getElementById('novo-nome-estante').value.trim();
    if (!newName) { alert('Nome inválido'); return; }

    try {
      await api.updateBookcase(bookcaseId, newName, null);
      const titleContainer = triggerElement.closest('.title-bookase-container');
      const h1 = titleContainer.querySelector('h1');
      if (h1) h1.textContent = newName;
      modal.remove();
    } catch (error) {
      alert('Erro ao atualizar: ' + error.message);
    }
  });

  document.getElementById('btn-cancelar-edicao').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
};


window.openAddBookModal = function (bookcaseId, bookcaseName, triggerElement) {
  const modalHTML = `
    <div class="modal" id="modal-adicionar">
      <div class="c-modal" style="min-width:520px; max-width:620px;">
        <div class="b-modal">
          <h1>Adicionar a ${bookcaseName}</h1>

          <div style="margin: 12px 0;">
            <div style="display:flex; align-items:center; border:1px solid #ccc; border-radius:8px; padding:6px 10px; gap:8px;">
              <input type="search" id="busca-estoque" placeholder="Buscar" style="border:none; outline:none; width:100%; font-size:14px;" />
              <img src="/Interface/assets/iconlupa.svg" style="width:18px; height:18px;">
            </div>
          </div>

          <div id="grid-estoque" style="
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            max-height: 320px;
            overflow-y: auto;
            padding: 4px;
          "></div>

          <div class="c-modal-btn" style="margin-top:16px;">
            <button type="button" id="btn-cancelar-adicao">Cancelar</button>
            <button type="button" id="btn-confirmar-adicao">Adicionar</button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);

  const modal = document.getElementById('modal-adicionar');
  const grid = document.getElementById('grid-estoque');
  const searchInput = document.getElementById('busca-estoque');
  let selectedBooks = new Set(); 

  api.getAllStock().then(stock => {
    let allBooks = stock || [];


     window.toggleSelectBook = function(btn) {
      const rawId = btn.dataset.stockId;

      if(!rawId || rawId == "undefined"){
        console.error("id não encontrado para este livro")
        return;
      }

      const id = Number(rawId);


      if (isNaN(id)) {
        console.error("O ID fornecido não é um número válido:", rawId);
         return;
       }


      const bookCard = btn.closest('.book');
      if (selectedBooks.has(id)) {
        selectedBooks.delete(id);
        if (bookCard) bookCard.style.outline = 'none';
        btn.innerHTML = '<img src="/Interface/assets/iconAdd.svg" style="width:18px; height:18px;">';
      } else {
        selectedBooks.add(id);
        if (bookCard) bookCard.style.outline = '2px solid var(--verde-escuro)';
        btn.innerHTML = '<img src="/Interface/assets/iconAddRounded.svg" style="width:18px; height:18px;">';
      }
    };

    function renderStock(items) {
      grid.innerHTML = '';
      items.forEach(i => {
        const isSelected = selectedBooks.has(i.id);
        grid.innerHTML += `
          <div class="book" style="position:relative; flex-direction:column; align-items:center; padding:10px; ${isSelected ? 'outline:2px solid var(--verde-escuro);' : ''}">
            <img src="${i.book?.cover || i.cover}" style="width:48px; height:48px;">
            <div class="book-info" style="text-align:center;">
              <h3 style="font-size:13px;">${(i.book?.title || i.book.title || '').toUpperCase()}</h3>
              <p style="font-size:12px;">${i.book?.authors.map(a=> a.name).join(',') || i.book.authors.map(a=> a.name).join(',') || ''}</p>
            </div>
            <button 
              data-stock-id="${i.id}"
              onclick="toggleSelectBook(this)"
              style="position:absolute; top:6px; right:6px; background:none; border:none; cursor:pointer; font-size:18px;"
              title="Adicionar">${isSelected ? '<img src="/Interface/assets/iconAddRounded.svg" style="width:18px; height:18px;">' : '<img src="/Interface/assets/iconAdd.svg" style="width:18px; height:18px;">'}</button>
          </div>
        `;
      });
    }

    renderStock(allBooks);

   

    searchInput.addEventListener('input', () => {
      const term = searchInput.value.toLowerCase();
      const filteredBooks = allBooks.filter(s => {
        const title = (s.book?.title || s.title || '').toLowerCase();
        const author = (s.book?.author || s.author || '').toLowerCase();
        return title.includes(term) || author.includes(term);
      });
      renderStock(filteredBooks);
    });
  });

  document.getElementById('btn-confirmar-adicao').addEventListener('click', async () => {
    if (selectedBooks.size === 0) { alert('Selecione ao menos um livro'); return; }

    try {
      for (const stockId of selectedBooks) {
        if(isNaN(stockId)) continue;
        
        await api.addBookToBookcase(bookcaseId, stockId);
      }
      alert('Livros adicionados!');
      location.reload();
    } catch (error) {
      alert('Erro: ' + error.message);
    }
  });

  document.getElementById('btn-cancelar-adicao').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
};


window.removeBook = function (bookcaseId, stockBookId, btnEl) {
  if (!confirm('Remover este livro da estante?')) return;

  api.removeBookFromBookcase(bookcaseId, stockBookId)
    .then(() => {
      const bookEl = btnEl.closest('.book');
      if (bookEl) bookEl.remove();
    })
    .catch(error => alert('Erro ao remover: ' + error.message));
};