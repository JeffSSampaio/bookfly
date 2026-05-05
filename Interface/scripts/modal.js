'use strict'
import api from './apiService.js';


function modalForm({ titulo, campos = [], onSubmit }) {
    let htmlContent = "";
    campos.forEach(campo => {
        htmlContent += `
        <div class="f-input-modal">
            <label for="${campo.name}">${campo.label}</label>
            <input type="${campo.type}" name="${campo.name}" id="${campo.name}" />
        </div>
        `;
    });

    const modalHTML = `
    <div class="modal">
        <div class="c-modal">
            <div class="b-modal">
                <h1>${titulo}</h1>
                <form class="c-modal-form">${htmlContent}</form>
                <div class="c-modal-btn">
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
        let dados = {};
        formData.forEach((value, key) => { dados[key] = value; });
        if (onSubmit) onSubmit(dados);
        modal.remove();
    });
    closeBtn.addEventListener("click", () => modal.remove());
    modal.addEventListener("click", e => { if (e.target === modal) modal.remove(); });
}



window.abrirModalEstante = function () {
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));

    modalForm({
        titulo: "Criar Estante",
        campos: [{ label: "Nome da Estante", type: "text", name: "name" }],
        onSubmit: async (dado) => {
            try {
                if (!dado.name?.trim()) { alert('Nome inválido'); return; }
                const novaEstante = await api.createBookcase(dado.name, usuarioLogado.id);
                const bookcase = document.getElementById('bookcase');
                bookcase.innerHTML += `
                    <div class='books-container'>
                        <div class="title-bookase-container">
                            <h1>${novaEstante.name}</h1>
                            <span><img src="/Interface/assets/iconAdd.svg" alt=""
                                onclick="openAddBookModal(${novaEstante.id}, '${novaEstante.name}', this)"></span>
                            <span><img src="/Interface/assets/iconEdit.svg" alt=""
                                onclick="openBookcaseEditModal(${novaEstante.id}, '${novaEstante.name}', this)"></span>
                        </div>
                        <div class="c-book grid-cards-book" id="c-book-${novaEstante.id}"></div>
                    </div>
                `;
            } catch (e) { alert("Erro ao criar estante: " + e.message); }
        }
    });
};



window.openBookcaseEditModal = function (bookcaseId, nomeAtual, imgEl) {
    const uid = `modal-edit-${bookcaseId}`;

    const modalHTML = `
    <div class="modal" id="${uid}">
        <div class="c-modal" style="width:60%; max-width:640px; margin:8% auto;">
            <div class="b-modal">
                <h1>Alterar</h1>

                <div class="f-input-modal" style="margin-bottom:12px;">
                    <label>Estante</label>
                    <input class="modal-input-nome-estante" type="text"
                           id="input-nome-${bookcaseId}" value="${nomeAtual}" />
                </div>

                <div class="modal-busca-container">
                    <input type="search" id="busca-edit-${bookcaseId}" placeholder="Buscar livro..." />
                    <img src="/Interface/assets/iconlupa.svg" alt="">
                </div>

                <div class="modal-grid-livros" id="grid-edit-${bookcaseId}">
                    <p style="color:var(--verde-medio); grid-column:1/-1; text-align:center;">Carregando...</p>
                </div>

                <div class="c-modal-btn" style="margin-top:16px;">
                    <button type="button" id="btn-cancelar-${uid}">Cancelar</button>
                    <button type="button" id="btn-salvar-${uid}">Salvar nome</button>
                </div>
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML("beforeend", modalHTML);
    const modal = document.getElementById(uid);
    const grid  = document.getElementById(`grid-edit-${bookcaseId}`);
    const busca = document.getElementById(`busca-edit-${bookcaseId}`);

   
    api.getBookcaseById(bookcaseId).then(bookcase => {
        let todos = bookcase.books || [];

        function render(lista) {
            if (!lista.length) {
                grid.innerHTML = `<p style="color:var(--verde-medio); grid-column:1/-1; text-align:center;">Estante vazia</p>`;
                return;
            }
            grid.innerHTML = lista.map(book => {
                const autor = book.authors
                    ? book.authors.map(a => a.name).join(', ')
                    : (book.author || '');

                
                return `
                    <div class="c-card-emprestimo c-card-book" style="align-items:flex-start;">
                        <img src="${book.cover || '/Interface/assets/livro.png'}" alt="">
                        <div class="card-book-info">
                            <h1 class="c-emprestimo-text-title card-book-title">${(book.title || '').toUpperCase()}</h1>
                            <p class="c-emprestimo-text-author card-book-author">${autor}</p>
                        </div>
                        <button class="btn-card-remover" style="opacity:1;"
                            title="Remover"
                            onclick="removeBook(${bookcaseId}, ${book.bookId}, this)">
                            <img src="/Interface/assets/iconDelete.svg" alt="Remover">
                        </button>
                    </div>`;
            }).join('');
        }

        render(todos);

        busca.addEventListener('input', () => {
            const t = busca.value.toLowerCase();
            render(todos.filter(b =>
                (b.title || '').toLowerCase().includes(t) ||
                (b.author || '').toLowerCase().includes(t) ||
                (b.authors || []).some(a => a.name.toLowerCase().includes(t))
            ));
        });
    }).catch(() => {
        grid.innerHTML = `<p style="color:red; grid-column:1/-1;">Erro ao carregar livros.</p>`;
    });

   
    document.getElementById(`btn-salvar-${uid}`).addEventListener('click', async () => {
        const novoNome = document.getElementById(`input-nome-${bookcaseId}`).value.trim();
        if (!novoNome) { alert('Nome inválido'); return; }
        try {
            await api.updateBookcase(bookcaseId, novoNome, null);
            const h1 = imgEl.closest('.title-bookase-container')?.querySelector('h1');
            if (h1) h1.textContent = novoNome;
            modal.remove();
        } catch (e) { alert('Erro ao atualizar: ' + e.message); }
    });

    document.getElementById(`btn-cancelar-${uid}`).addEventListener('click', () => modal.remove());
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
};



window.openAddBookModal = function (bookcaseId, nomeEstante, imgEl) {
    const uid = `modal-add-${bookcaseId}`;
    let selecionados = new Map(); 

    const modalHTML = `
    <div class="modal" id="${uid}">
        <div class="c-modal" style="width:60%; max-width:640px; margin:8% auto;">
            <div class="b-modal">
                <h1>Adicionar a ${nomeEstante}</h1>

                <div class="modal-busca-container">
                    <input type="search" id="busca-add-${bookcaseId}" placeholder="Buscar livro..." />
                    <img src="/Interface/assets/iconlupa.svg" alt="">
                </div>

                <div class="modal-grid-livros" id="grid-add-${bookcaseId}">
                    <p style="color:var(--verde-medio); grid-column:1/-1; text-align:center;">Carregando...</p>
                </div>

                <div class="c-modal-btn" style="margin-top:16px;">
                    <button type="button" id="btn-cancelar-${uid}">Cancelar</button>
                    <button type="button" id="btn-adicionar-${uid}">Adicionar</button>
                </div>
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML("beforeend", modalHTML);
    const modal = document.getElementById(uid);
    const grid  = document.getElementById(`grid-add-${bookcaseId}`);
    const busca = document.getElementById(`busca-add-${bookcaseId}`);

   
    api.getAllStock().then(estoque => {
        let todos = estoque || [];

        function render(lista) {
            if (!lista.length) {
                grid.innerHTML = `<p style="color:var(--verde-medio); grid-column:1/-1; text-align:center;">Nenhum livro encontrado</p>`;
                return;
            }
            grid.innerHTML = lista.map(stock => {
                const book   = stock.book || stock;
                const titulo = book.title || stock.title || '';
                const autor  = book.authors
                    ? book.authors.map(a => a.name).join(', ')
                    : (book.author || stock.author || '');
                const cover  = book.cover || stock.cover || '/Interface/assets/livro.png';
                const sel= selecionados.has(stock.stockId);

                return `
                    <div class="c-card-emprestimo c-card-book ${sel ? 'selecionado' : ''}"
                         data-stock-id="${stock.stockId}"
                         onclick='toggleSelectBook(this, ${stock.stockId}, ${JSON.stringify(titulo)}, ${JSON.stringify(autor)}, ${JSON.stringify(cover)})'>
                        <img src="${cover}" alt="">
                        <div class="card-book-info">
                            <h1 class="c-emprestimo-text-title card-book-title">${titulo.toUpperCase()}</h1>
                            <p class="c-emprestimo-text-author card-book-author">${autor}</p>
                        </div>
                        <button class="btn-card-adicionar" tabindex="-1">
                            <img src="/Interface/assets/${sel ? 'iconVerified' : 'iconAddRounded'}.svg" alt="">
                        </button>
                    </div>`;
            }).join('');
        }

        render(todos);

        busca.addEventListener('input', () => {
            const t = busca.value.toLowerCase();
            render(todos.filter(s => {
                const b = s.book || s;
                return (b.title  || '').toLowerCase().includes(t) ||
                       (b.author || '').toLowerCase().includes(t) ||
                       (b.authors || []).some(a => a.name.toLowerCase().includes(t));
            }));
        });
    }).catch(() => {
        grid.innerHTML = `<p style="color:red; grid-column:1/-1;">Erro ao carregar estoque.</p>`;
    });


    window.toggleSelectBook = function (cardEl, stockId, titulo, autor, cover) {
        if (selecionados.has(stockId)) {
            selecionados.delete(stockId);
            cardEl.classList.remove('selecionado');
            cardEl.querySelector('.btn-card-adicionar img').src = '/Interface/assets/iconAddRounded.svg';
        } else {
            selecionados.set(stockId, { titulo, autor, cover });
            cardEl.classList.add('selecionado');
            cardEl.querySelector('.btn-card-adicionar img').src = '/Interface/assets/iconVerified.svg';
        }
    };

   
    document.getElementById(`btn-adicionar-${uid}`).addEventListener('click', async () => {
        if (!selecionados.size) { alert('Selecione ao menos um livro'); return; }
        try {
            const cBook = document.getElementById(`c-book-${bookcaseId}`);
            for (const [stockId, book] of selecionados) {
                await api.addBookToBookcase(bookcaseId, stockId);
                if (cBook) {
                    cBook.innerHTML += `
                        <div class="c-card-emprestimo c-card-book">
                            <img src="${book.cover}" alt="">
                            <div class="card-book-info">
                                <h1 class="c-emprestimo-text-title card-book-title">${book.titulo.toUpperCase()}</h1>
                                <p class="c-emprestimo-text-author card-book-author">${book.autor}</p>
                            </div>
                            <button class="btn-card-remover"
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
        .catch(e => alert('Erro ao remover: ' + e.message));
};



window.openBookModal = function (stockId) {
    api.getStockById(stockId).then(stock => {
        const book = stock.book || stock;
        const autor = book.authors
            ? book.authors.map(a => a.name).join(', ')
            : (book.author || 'Autor desconhecido');
        const modalHTML = `
        <div class="modal">
            <div class="c-modal" style="width:400px; max-width:90%; margin:10% auto;">
                <div class="b-modal" style="padding:20px;">
                    <img src="${book.cover || '/Interface/assets/livro.png'}" alt="" style="width:100%; height:auto; margin-bottom:20px;">
                    <h1 style="margin-bottom:10px;">${book.title || 'Título desconhecido'}</h1>
                    <p style="color:var(--verde-medio); margin-bottom:20px;">${autor}</p>
                    <p>${book.description || 'Sem descrição disponível.'}</p>
                    <button style="margin-top:20px;" onclick="this.closest('.modal').remove()">Fechar</button>
                </div>
            </div>
        </div>`;
        document.body.insertAdjacentHTML("beforeend", modalHTML);
        const modal = document.querySelector(".modal:last-child");
        modal.addEventListener("click", e => { if (e.target === modal) modal.remove(); });
    }).catch(() => {
        alert('Erro ao carregar detalhes do livro.');
    });
}
