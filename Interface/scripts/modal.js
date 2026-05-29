'use strict'
import api from './apiService.js';

const loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));

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
    <div class="c-modal ">

        <div class= "content-modal">

        
        <div class="modal-header">
        <h1 class="t-modal">${title}</h1>
        </div>
        
        <div class="modal-body">
        <form class="c-modal-form">
        ${htmlContent}
        </form>
        </div>
        
        <div class="c-modal-btn modal-footer">
        <button type="button" class="closeBtn">Cancelar</button>
        <button type="button" class="confirmBtn">Confirmar</button>
        </div>
        
        </div>
    </div>
</div>`;



    document.body.insertAdjacentHTML("beforeend", modalHTML);
    const modals = document.querySelectorAll(".modal");
    const modal = modals[modals.length - 1];
    const confirmBtn = modal.querySelector(".confirmBtn");
    const closeBtn  = modal.querySelector(".closeBtn");
    const form      = modal.querySelector("form");

    confirmBtn.addEventListener("click", function () {
        const formData = new FormData(form);
        let data = {};
        formData.forEach((value, key) => { data[key] = value; });
        if (onSubmit) onSubmit(data);
        modal.remove();
    });
    closeBtn.addEventListener("click", () => modal.remove());
    modal.addEventListener("click", e => { if (e.target === modal) modal.remove(); });
}



window.openModalBookcase = function () {
    

    modalForm({
        title: "Criar Estante",
        fields: [{ label: "Nome da Estante", type: "text", name: "name" }],
        onSubmit: async (dado) => {
            try {
                if (!dado.name?.trim()) { alert('Invalid name'); return; }
                const novaShelf = await api.createBookcase(dado.name, loggedUser.id);
                const bookcase = document.getElementById('bookcase');
                bookcase.innerHTML += `
                    <div class='books-container'>
                        <div class="shelf-header">
                            <h1>${novaShelf.name}</h1>
                            <span><img src="/Interface/assets/iconAdd.svg" alt=""
                                onclick="openAddBookModal(${novaShelf.id}, '${novaShelf.name}', this)"></span>
                            <span><img src="/Interface/assets/iconEdit.svg" alt=""
                                onclick="openBookcaseEditModal(${novaShelf.id}, '${novaShelf.name}', this)"></span>
                        </div>
                        <div class="c-book grid-cards-book" id="c-book-${novaShelf.id}"></div>
                    </div>
                `;
                location.reload();
            } catch (e) { alert("Error creating shelf: " + e.message); }
        }
    });
};




window.openBookcaseEditModal = function (bookcaseId, nomeAtual, imgEl) {
    const uid = `modal-edit-${bookcaseId}`;

    const modalHTML = `
    <div class="modal" id="${uid}">
        <div class="c-modal">
            <div class="c-modal">
                <h1>Editar Estante</h1>

                <div class="f-input-modal modal-input-container">
                    <label>Nome da Estante</label>
                    <input class="modal-shelf-name-input" type="text"
                           id="input-nome-${bookcaseId}" value="${nomeAtual}" />
                </div>

                <div class="modal-search-container">
                    <input type="search" id="search-shelf-edit-${bookcaseId}" placeholder="Buscar livros..." />
                    <img src="/Interface/assets/iconSearch.svg" alt="">
                </div>

                <div class="modal-books-grid" id="grid-edit-${bookcaseId}">
                    <p class="modal-loading-text">Carregando...</p>
                </div>

                <div class="c-modal-btn modal-btn-container">
                <button type="button" id="btn-cancelar-${uid}">Cancelar</button>
                <button type="button" id="btn-delete-${uid}" class="btn-delete-bookcase">Excluir estante</button>
                    <button type="button" id="btn-salvar-${uid}">Salvar</button>
                </div>
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML("beforeend", modalHTML);
    const modal = document.getElementById(uid);
    const grid  = document.getElementById(`grid-edit-${bookcaseId}`);
    const busca = document.getElementById(`search-shelf-edit-${bookcaseId}`);

   
    api.getBookcaseById(bookcaseId).then(bookcase => {
        let allItems = bookcase.books || [];

        function render(lista) {
            if (!lista.length) {
                grid.innerHTML = `<p class="modal-loading-text">Estante vazia</p>`;
                return;
            }
            grid.innerHTML = lista.map(book => {
                const autor = book.authors
                    ? book.authors.map(a => a.name).join(', ')
                    : (book.author || '');

                
                return `
                    <div class="loan-card c-card-book card-book-edit">
                        <img src="${book.cover || '/Interface/assets/book.png'}" alt="">
                        <div class="shelf-book-info">
                            <h1 class="loan-card-title card-book-title">${(book.title || '').toUpperCase()}</h1>
                            <p class="loan-card-author card-book-author">${autor}</p>
                        </div>
                        <button class="btn-remove-book"
                            title="Remover"
                            onclick="removeBook(${bookcaseId}, ${book.bookId}, this)">
                            <img src="/Interface/assets/iconDelete.svg" alt="Remover">
                        </button>
                    </div>`;
            }).join('');
        }

        render(allItems);

        busca.addEventListener('input', () => {
            const t = busca.value.toLowerCase();
            render(allItems.filter(b =>
                (b.title || '').toLowerCase().includes(t) ||
                (b.author || '').toLowerCase().includes(t) ||
                (b.authors || []).some(a => a.name.toLowerCase().includes(t))
            ));
        });
    }).catch(() => {
        grid.innerHTML = `<p style="color:red; grid-column:1/-1;">Error loading books.</p>`;
    });

   
    document.getElementById(`btn-salvar-${uid}`).addEventListener('click', async () => {
        const novoNome = document.getElementById(`input-nome-${bookcaseId}`).value.trim();
        if (!novoNome) { alert('Invalid name'); return; }
        try {
            await api.updateBookcase(bookcaseId, novoNome, null);
            const h1 = imgEl.closest('.title-bookase-container')?.querySelector('h1');
            if (h1) h1.textContent = novoNome;
            modal.remove();
            location.reload();
        } catch (e) { alert('Error performing atualizar: ' + e.message); }
    });

    document.getElementById(`btn-delete-${uid}`).addEventListener('click', async () => {
        if (!confirm('Deseja realmente excluir esta estante?')) return;
        try {
            await api.deleteBookcase(bookcaseId);
            const container = imgEl.closest('.books-container');
            if (container) container.remove();
            modal.remove();
        } catch (e) {
            alert('Error performing excluir estante: ' + e.message);
        }
    });

    document.getElementById(`btn-cancelar-${uid}`).addEventListener('click', () => modal.remove());
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
};



window.openAddBookModal = function (bookcaseId, nomeShelf, imgEl) {
    const uid = `modal-add-${bookcaseId}`;
    let selected = new Map(); 

    const modalHTML = `
    <div class="modal" id="${uid}">
        <div class="c-modal modal-bookcase-add">
            <div class="b-modal">
                <h1>Adicionar a ${nomeShelf}</h1>

                <div class="modal-search-container">
                    <input type="search" id="search-shelf-add-${bookcaseId}" placeholder="Procurar livro" />
                    <img src="/Interface/assets/iconSearch.svg" alt="">
                </div>

                <div class="modal-books-grid" id="grid-add-${bookcaseId}">
                    <p class="modal-loading-text">Carregando...</p>
                </div>

                <div class="c-modal-btn modal-btn-container">
                    <button type="button" id="btn-cancelar-${uid}">Cancel</button>
                    <button type="button" id="btn-adicionar-${uid}">Adicionar</button>
                </div>
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML("beforeend", modalHTML);
    const modal = document.getElementById(uid);
    const grid  = document.getElementById(`grid-add-${bookcaseId}`);
    const search = document.getElementById(`search-shelf-add-${bookcaseId}`);

   
    api.getAllStock().then(stockData => {
        let allItems = stockData || [];

        function render(lista) {
            if (!lista.length) {
                grid.innerHTML = `<p class="modal-loading-text">Nenhum livro encontrado</p>`;
                return;
            }
            grid.innerHTML = lista.map(stock => {
                const book   = stock.book || stock;
                const titulo = book.title || stock.title || '';
                const autor  = book.authors
                    ? book.authors.map(a => a.name).join(', ')
                    : (book.author || stock.author || '');
                const cover  = book.cover || stock.cover || '/Interface/assets/book.png';
                const sel= selected.has(stock.stockId);

                return `
                    <div class="loan-card c-card-book ${sel ? 'selected' : ''}"
                         data-stock-id="${stock.stockId}"
                         onclick='toggleSelectBook(this, ${stock.stockId}, ${JSON.stringify(titulo)}, ${JSON.stringify(autor)}, ${JSON.stringify(cover)})'>
                        <img src="${cover}" alt="">
                        <div class="shelf-book-info">
                            <h1 class="loan-card-title card-book-title">${titulo.toUpperCase()}</h1>
                            <p class="loan-card-author card-book-author">${autor}</p>
                        </div>
                        <button class="btn-add-book" tabindex="-1">
                            <img src="/Interface/assets/${sel ? 'iconVerified' : 'iconAddRounded'}.svg" alt="">
                        </button>
                    </div>`;
            }).join('');
        }

        render(allItems);

        search.addEventListener('input', () => {
            const t = search.value.toLowerCase();
            render(allItems.filter(s => {
                const b = s.book || s;
                return (b.title  || '').toLowerCase().includes(t) ||
                       (b.author || '').toLowerCase().includes(t) ||
                       (b.authors || []).some(a => a.name.toLowerCase().includes(t));
            }));
        });
    }).catch(() => {
        grid.innerHTML = `<p style="color:red; grid-column:1/-1;">Error loading stock.</p>`;
    });


    window.toggleSelectBook = function (cardEl, stockId, titulo, autor, cover) {
        const icon = cardEl.querySelector('.btn-add-book img');
        if (selected.has(stockId)) {
            selected.delete(stockId);
            cardEl.classList.remove('selected');
            icon.src = '/Interface/assets/iconAddRounded.svg';
        } else {
            selected.set(stockId, { titulo, autor, cover });
            cardEl.classList.add('selected');
              icon.src = '/Interface/assets/iconVerified.svg';
        }
    };

   
    document.getElementById(`btn-adicionar-${uid}`).addEventListener('click', async () => {
        if (!selected.size) { alert('Select at least one book'); return; }
        try {
            const cBook = document.getElementById(`c-book-${bookcaseId}`);
            for (const [stockId, book] of selected) {
                await api.addBookToBookcase(bookcaseId, stockId);
                if (cBook) {
                    cBook.innerHTML += `
                        <div class="loan-card c-card-book">
                            <img src="${book.cover}" alt="">
                            <div class="shelf-book-info">
                                <h1 class="loan-card-title card-book-title">${book.titulo.toUpperCase()}</h1>
                                <p class="loan-card-author card-book-author">${book.autor}</p>
                            </div>
                            <button class="btn-remove-book"
                                onclick="removeBook(${bookcaseId}, ${stockId}, this)" title="Remover">
                                <img src="/Interface/assets/iconDelete.svg" alt="Remover">
                            </button>
                        </div>`;
                }
            }
            modal.remove();
        } catch (e) { alert('Erro: ' + e.message); }
    });

    document.getElementById(`btn-cancelar-${uid}`).addEventListener('click', () => modal.remove());
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
};


window.removeBook = function (bookcaseId, stockBookId, btnEl) {
    if (!confirm('Remover este livro da estante?')) return;
    api.removeBookFromBookcase(bookcaseId, stockBookId)
        .then(() => { btnEl.closest('.c-card-book')?.remove(); })
        .catch(e => alert('Error performing remover: ' + e.message));
};



window.openBookModal = function (bookId) {
    api.getStockByBook(bookId).then(stock => {
        const book = stock.book || stock;
        const autor = book.authors
            ? book.authors.map(a => a.name).join(', ')
            : (book.author || 'Autor desconhecido');
        const statusText = (stock?.qtd ?? 0) > 0 ? 'Disponível' : 'Indisponível';
        const statusClass = (stock?.qtd ?? 0) > 0 ? 'status-available' : 'status-unavailable';
        const summary = stock.book.summary || "Sem sumario";

        const modalHTML = `
        <div class="modal">
            <div class="book-detail-modal">
                <button class="book-detail-close" type="button">×</button>
                <div class="book-detail-card">
                    <img class="book-detail-cover" src="${book.cover || '/Interface/assets/book.png'}" alt="${book.title || 'Book cover'}">
                    <div class="book-detail-info">
                        <h1 class="book-detail-title">${book.title || 'Título desconhecido'}</h1>
                        <p class="book-detail-authors">${autor}</p>
                        <div class="book-detail-status-row">
                            <span class="book-detail-label">Status</span>
                            <span class="book-detail-status ${statusClass}">${statusText}</span>
                        </div>
                        <p class="book-detail-label">Sumário</p>
                        <p class="book-detail-description">${summary}</p>
                    </div>
                </div>
            </div>
        </div>`;

        document.body.insertAdjacentHTML("beforeend", modalHTML);
        const modal = document.querySelector(".modal:last-child");
        const closeBtn = modal.querySelector('.book-detail-close');
        closeBtn.addEventListener('click', () => modal.remove());
        modal.addEventListener("click", e => { if (e.target === modal) modal.remove(); });
    }).catch(() => {
        alert('Error performing carregar detalhes do livro.');
    });
}


window.openBookModalLoaned = function (userId,bookId) {

    const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Sao_Paulo'
});

    api.getBookByLoanForUser(userId,bookId).then(loan => {
        const book = loan.bookTitle || "Sem Livro";
        const statusText = loan.status;
        const loanDate = dateFormatter.format(new Date(loan.loanDate));
        const returnDate = dateFormatter.format(new Date(loan.returnDate));


        const modalHTML = `
        <div class="modal">
            <div class="book-detail-modal">
                <button class="book-detail-close" type="button">×</button>
                <div class="book-detail-card">
                  
                    <div class="book-detail-info">
                        <h1 class="book-detail-title">${book || 'Título desconhecido'}</h1>
                        <div class="book-detail-status-row">
                            <span class="book-detail-label">Status</span>
                            <span class="book-detail-status status-available">${statusText}</span>
                        </div>
                        <p class="book-detail-label">Dia do Empréstimo: ${loanDate} </p>
                         <p class="book-detail-label">Dia da Entrega do Livro: ${returnDate}</p>
                       
                    </div>
                </div>
            </div>
        </div>`;

        document.body.insertAdjacentHTML("beforeend", modalHTML);
        const modal = document.querySelector(".modal:last-child");
        const closeBtn = modal.querySelector('.book-detail-close');
        closeBtn.addEventListener('click', () => modal.remove());
        modal.addEventListener("click", e => { if (e.target === modal) modal.remove(); });
    }).catch((e) => {
        alert('Error performing carregar detalhes do livro.'+ e);
    });
}


window.openRegisterBook= async function (){

   modalForm({
       title: "Registrar Livro",
       fields: [
                {label:"Nome do Livro", type:"text", name:"bookName"},
                {label:"Capa do Livro", type:"text", name:"coverBook"},
                {label:"Autores", type:"text", name:"authorName"},
                {label:"Sumário", type:"textArea" ,name:"summaryBook"},
                {label:"Gênero", type:"text", name:"genderBook"}
            ],
        onSubmit: async(data)=> {

            let nameBook = data.bookName;
            let coverBook = data.coverBook;
            const authorsName = data.authorName ? data.authorName.split(',').map(a => a.trim()) : [];
            const gendersBook = data.genderBook ? data.genderBook.split(',').map(g => g.trim()) : [];
            let summaryBook = data.summaryBook || 'Sem sumario'
            let book =  {title: nameBook, cover: coverBook,summary:summaryBook,authors: authorsName,genders: gendersBook }
            try {
            await api.createBook(book)

            alert('Livro registrado com sucesso!');
            location.reload();
            }
            catch(e){
                alert('Erro ao Registrar: ' + e.message);
            }
        }   

       
    }
   )
}


window.openEditNameProfile = function(userId){
    modalForm({
        title:"Editar Nome",
        fields: [
            {label:'Novo Nome', type:'text',name:'newName'}
        ],
        onSubmit: async(data)=>{
            const newName = data.newName?.trim();
            if (!newName) {
                alert('Informe um nome válido.');
                return;
            }

            try {
                const userUpdate = { id: userId, name: newName };
                const updatedUser = await api.updateUser(userId, userUpdate);
                sessionStorage.setItem('loggedUser', JSON.stringify(updatedUser));
                alert('Perfil atualizado!');
                location.reload();
            } catch (e) {
                alert('Error performing atualizar: ' + (e.message || e));
            }
        }
    })
}

window.openEditEmailProfile = function(userId){
    modalForm({
        title:"Editar Email",
        fields: [
            {label:'Novo Email', type:'email',name:'newEmail'}
        ],
        onSubmit: async(data)=>{
            const newEmail = data.newEmail?.trim();
            if (!newEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
                alert('Informe um email válido.');
                return;
            }

            try {
                const userUpdate = { id: userId, email: newEmail };
                const updatedUser = await api.updateUser(userId, userUpdate);
                sessionStorage.setItem('loggedUser', JSON.stringify(updatedUser));
                alert('Perfil atualizado!');
                location.reload();
            } catch (e) {
                alert('Error performing atualizar: ' + (e.message || e));
            }
        }
    })
}

window.openEditPasswordProfile = function(userId){
    modalForm({
        title:"Editar Senha",
        fields: [
            {label:'Nova Senha', type:'password',name:'newPassword'},
            {label:'Confirm Senha', type:'password',name:'confirmPassword'}
        ],
        onSubmit: async(data)=>{
            const password = data.newPassword?.trim();
            const confirm = data.confirmPassword?.trim();
            if (!password || password.length < 6) {
                alert('A senha deve ter pelo menos 6 caracteres.');
                return;
            }
            if (password !== confirm) {
                alert('As senhas não conferem.');
                return;
            }

            try {
                const userUpdate = { id: userId, password };
                const updatedUser = await api.updateUser(userId, userUpdate);
                sessionStorage.setItem('loggedUser', JSON.stringify(updatedUser));
                alert('Senha atualizada!');
                location.reload();
            } catch (e) {
                alert('Error performing atualizar: ' + (e.message || e));
            }
        }
    })
}



window.openAddItemOnStock = async function() {
    const books = await api.getAllBooks();
    const uid = 'modal-add-stock';
    const selectedBooks = new Set();

    let allCards = books.map(book => {
        const bookId = book.bookid ?? book.id;
        const cover = book.cover || '/Interface/assets/book.png';
        const title = (book.title || 'Título desconhecido').replace(/"/g, '&quot;');
        const author = book.authors
            ? book.authors.map(a => a.name).join(', ')
            : (book.author || 'Autor desconhecido');

        return {
            bookId,
            cover,
            title: title.replace(/&quot;/g, '"'),
            author,
            html: `
            <div class="card-select-book" data-book-id="${bookId}">
                <div class="card-select-book-inner">
                    <div class="card-select-indicator">
                        <img src="/Interface/assets/iconAddRounded.svg" alt="Selecionar" />
                    </div>
                    <img class="card-select-cover" src="${cover}" alt="${title}" />
                    <div class="card-select-book-info">
                        <div class="card-select-book-title">${title}</div>
                        <div class="card-select-book-author">${author}</div>
                    </div>
                    <div class="card-select-qty-container">
                        <label>Qtd</label>
                        <div class="qty-control">
                            <button type="button" class="qty-btn qty-minus" data-book-id="${bookId}">−</button>
                            <input class="card-book-qtd" type="number" min="1" value="1" data-book-id="${bookId}" />
                            <button type="button" class="qty-btn qty-plus" data-book-id="${bookId}">+</button>
                        </div>
                    </div>
                </div>
            </div>`
        };
    });

    const modalHTML = `
    <div class="modal" id="${uid}">
        <div class="c-modal modal-stock-table">
            <div class="b-modal modal-stock-body">

                <div class="modal-stock-header">
                    <h1 class="t-modal">Adicionar Estoque</h1>
                </div>

                <div class="modal-content-wrapper">
                    <div class="modal-add-stock-search">
                        <input type="text" id="search-stock" placeholder="Pesquisar Livro.." />
                        <img src="/Interface/assets/iconSearch.svg" alt="Buscar" />
                    </div>
                    <div class="modal-add-stock-grid" id="grid-add-stock">
                        ${allCards.map(c => c.html).join('') || '<p>Nenhum livro encontrado.</p>'}
                    </div>
                </div>

                <div class="c-modal-btn">
                    <button type="button" class="closeBtn">Cancelar</button>
                    <button type="button" class="confirmBtn">Confirmar</button>
                </div>
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal      = document.getElementById(uid);
    const grid       = modal.querySelector('#grid-add-stock');
    const searchInput = modal.querySelector('#search-stock');
    const confirmBtn = modal.querySelector('.confirmBtn');
    const closeBtn   = modal.querySelector('.closeBtn');


    searchInput.addEventListener('input', () => {
        const term = searchInput.value.toLowerCase();
        const filtered = allCards.filter(c =>
            c.title.toLowerCase().includes(term) ||
            c.author.toLowerCase().includes(term)
        );
        grid.innerHTML = filtered.length > 0
            ? filtered.map(c => c.html).join('')
            : '<p>Nenhum livro encontrado.</p>';
    });

    
    grid.addEventListener('click', e => {
       
        if (e.target.closest('.qty-control')) return;

        const card = e.target.closest('.card-select-book');
        if (!card) return;

        const bookId = card.dataset.bookId;
        const indicator = card.querySelector('.card-select-indicator img');

        if (selectedBooks.has(bookId)) {
            selectedBooks.delete(bookId);
            card.classList.remove('selected');
            indicator.src = '/Interface/assets/iconAddRounded.svg';
        } else {
            selectedBooks.add(bookId);
            card.classList.add('selected');
            indicator.src = '/Interface/assets/iconVerified.svg';
        }
    });


    grid.addEventListener('click', e => {
        const btn = e.target.closest('.qty-btn');
        if (!btn) return;

        e.stopPropagation();

        const bookId = btn.dataset.bookId;
        const input  = grid.querySelector(`.card-book-qtd[data-book-id="${bookId}"]`);
        if (!input) return;

        let val = parseInt(input.value, 10) || 1;

        if (btn.classList.contains('qty-plus')) {
            input.value = val + 1;
        } else if (btn.classList.contains('qty-minus')) {
            input.value = Math.max(1, val - 1);
        }
    });

   
    grid.addEventListener('mousedown', e => {
        if (e.target.closest('.qty-control')) e.stopPropagation();
    });


    confirmBtn.addEventListener('click', async () => {
        if (!selectedBooks.size) {
            alert('Selecione pelo menos um livro.');
            return;
        }

        const userId = loggedUser?.id || loggedUser?.userId;
        if (!userId) {
            alert('Usuário não logado. Faça login antes de continuar.');
            return;
        }

        try {
            for (const bookId of selectedBooks) {
                const qtyInput = modal.querySelector(`.card-book-qtd[data-book-id="${bookId}"]`);
                const quantidade = Math.max(1, Number(qtyInput?.value) || 1);
                await api.addBookToStock(bookId, userId, quantidade);
            }
            alert('Estoque atualizado com sucesso!');
            modal.remove();
            location.reload();
        } catch (err) {
            alert('Erro ao adicionar livro: ' + err.message);
        }
    });


    closeBtn.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
};