import api from './apiService.js';

var style_table = {
    header: {
        backgroundColor: 'var(--verde-escuro)',
        color: 'var(--marfin)',
        fontWeight: 'bold',
        textAlign: 'left',
        padding: '10px',
        textAlign: 'center'
    },
    cell: {
        border: '1px solid var(--verde-escuro)',
        padding: '10px',
        textAlign: 'center' ,
        color: 'var(--verde-escuro)',
        fontWeight: '800'
    },
    row: {
        backgroundColor: 'var(--marfin)',
        color: 'var(--verde-escuro)'
    }
}

var allStockBook = await api.getAllStock();
var allLoans = await api.getAllLoans();
var allMoviments = await api.getAllMoviments();
var allPenalties = await api.getAllPenalties();
var allBooks = await api.getAllBooks();

const formatador = new  Intl.DateTimeFormat('pt-BR', {
  dateStyle:'short',
  timeStyle:'short',
  timeZone: 'America/Sao_Paulo' 
})


var table_loan = {
    headers: ['ID','Usuário', 'Livro' ,'Data de Empréstimo', 'Data de Devolução', 'Status'],
    rows: allLoans.map(
        r => ({
            id: r.id,
            user: r.user.name.toUpperCase(),
            book: r.bookTitle.toUpperCase(),
            loanDate:  formatador.format(new Date(r.loanDate)) ,
            returnDate: formatador.format(new Date(r.returnDate)),
            status: r.status
        })
    )
}
/* 
var table_penalty = {
    headers: ['Usuário', 'Valor', 'Data de Multa', 'Status'],
    rows: [{ usuario: 'João Silva', valor: 'R$ 50,00', dataMulta: '01/10/2024', status: 'Pendente' },
        { usuario: 'Maria Oliveira', valor: 'R$ 30,00', dataMulta: '05/10/2024', status: 'Pago' },
            { usuario: 'Carlos Pereira', valor: 'R$ 20,00', dataMulta: '10/10/2024', status: 'Pendente' },
                { usuario: 'Ana Santos', valor: 'R$ 40,00', dataMulta: '15/10/2024', status: 'Pago' },
                    { usuario: 'Pedro Costa', valor: 'R$ 25,00', dataMulta: '20/10/2024', status: 'Pendente' }       
    ]
} */


    

var table_penalty = {
    headers:['Id','Usuário','Valor da Multa','Data de Multa', 'Data de Entrega do Livro','Status'],
    rows: allPenalties.map(
        r =>({
            id: r.penaltyId,
            user: r.userName.toUpperCase(),
            amount: r.amount || "sem valor",
            penaltyDate: formatador.format(new Date(r.penaltyDate)), 
            returnDateLoan: formatador.format(new Date(r.returnloanDate)),
            status: r.statusPenalty
        })
    )
}


var table_stock = {
    headers: ['Id','Identificador','Livro', 'Autor','Quantidade'],
    rows: allStockBook.map(r => ({
        id: r.stockId,
        bookId: r.book.bookId ?? r.book.bookid,
        title: r.book.title.toUpperCase(), 
        author: r.book.authors.map(a=>a.name).join(',') || 'Sem author',
        qtd: r.qtd
    }))
}




var table_books= {
    headers: ['Id','Livro','Autores','Genero'],
    rows: allBooks.map(r=>({
            id: r.bookid,
            title: r.title,
            authors: r.authors.map(a=> a.name).join(',') || "autor não identificado",
            genders: r.genders.map(g=>g.name || g).join(', ') || 'Sem Gênero'.toUpperCase()

    }))
}



var table_moviment = {
    headers: ['Id','Data de Criação','Usuário','Tipo do Usuário' ,'Livro', 'Quantidade', 'Tipo','Descrição'],
    rows: allMoviments.map(
        r=>({
            id:r.movimentId,
            createdTime: formatador.format(new Date(r.createdTime)) || "sem data de criação",
            user: r.user.name.toUpperCase(),
            userType: r.user.role,
            book: r.book.title.toUpperCase(),
            qtd: (r.type == ('ENTRADA') ||  r.type == ('ENTRADA_ADMIN') )? '+'+ r.qtdMoved : '-'+ r.qtdMoved ,
            type: r.type.trim(),
            description: r.description
        })
    )
}
console.log(allMoviments)

function table(tableData) {
    let tbl = document.createElement('table');
    tbl.style.width = 'calc(100% - 120px)';
    tbl.style.borderCollapse = 'collapse';
    tbl.style.margin = '20px 60px';

  
    let thead = document.createElement('thead');
    let headerRow = document.createElement('tr');

    tableData.headers.forEach(headerText => {
        let th = document.createElement('th');
        th.textContent = headerText;
        Object.assign(th.style, style_table.header);
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    tbl.appendChild(thead);

  
    let tbody = document.createElement('tbody');

    tableData.rows.forEach((rowData, index) => {
        let row = document.createElement('tr');
        Object.assign(row.style, style_table.row);

      
        Object.values(rowData).forEach(value => {
        let cell = document.createElement('td');
        cell.textContent = value;
        Object.assign(cell.style, style_table.cell);

        row.appendChild(cell);
});

        tbody.appendChild(row);
    });

    tbl.appendChild(tbody);
    return tbl;
}

function table_costumize(tableData,styleData) {
    let tbl = document.createElement('table');
    tbl.style.width = 'calc(100% - 120px)';
    tbl.style.borderCollapse = 'collapse';
    tbl.style.margin = '0 60px';

  
    let thead = document.createElement('thead');
    let headerRow = document.createElement('tr');

    tableData.headers.forEach(headerText => {
        let th = document.createElement('th');
        th.textContent = headerText;
        Object.assign(th.style, styleData.header);
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    tbl.appendChild(thead);

  
    let tbody = document.createElement('tbody');

    tableData.rows.forEach((rowData, index) => {
        let row = document.createElement('tr');
        Object.assign(row.style, styleData.row);

      
        Object.values(rowData).forEach(value => {
        let cell = document.createElement('td');
        cell.textContent = value;
        Object.assign(cell.style, styleData.cell);

        row.appendChild(cell);
});

        tbody.appendChild(row);
    });

    tbl.appendChild(tbody);
    return tbl;
}


function table_with_actions(tableData) {
    let container = document.createElement('div');
    container.style.margin = '0 60px';
    container.style.paddingRight = '50px';
    container.style.position = 'relative';

    let tbl = document.createElement('table');
    tbl.style.width = '100%';
    tbl.style.borderCollapse = 'collapse';

    let thead = document.createElement('thead');
    let headerRow = document.createElement('tr');

    tableData.headers.forEach(headerText => {
        let th = document.createElement('th');
        th.textContent = headerText;
        Object.assign(th.style, style_table.header);
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    tbl.appendChild(thead);

    let tbody = document.createElement('tbody');
    let rows = []; 

    tableData.rows.forEach((rowData, index) => {
        let row = document.createElement('tr');
        Object.assign(row.style, style_table.row);


        tbody.appendChild(row);
        rows.push(row); 
    });

    tbl.appendChild(tbody);
    container.appendChild(tbl);

   
  

    return container;
}

function table_with_edit(tableData, onEdit) {

    let wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'flex-start';
    wrapper.style.gap = '8px';

    let tbl = document.createElement('table');
    tbl.style.width = 'calc(100% - 120px)';
    tbl.style.borderCollapse = 'collapse';
    tbl.style.margin = '0 0 0 60px';

    let thead = document.createElement('thead');
    let headerRow = document.createElement('tr');

    tableData.headers.forEach(headerText => {
        let th = document.createElement('th');
        th.textContent = headerText;
        Object.assign(th.style, style_table.header);
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    tbl.appendChild(thead);

    let tbody = document.createElement('tbody');

    let actionsColumn = document.createElement('div');
    actionsColumn.style.display = 'flex';
    actionsColumn.style.flexDirection = 'column';
    actionsColumn.style.marginTop = '42px';
    actionsColumn.style.gap = '2px';

    tableData.rows.forEach((rowData, index) => {

        let row = document.createElement('tr');

        Object.values(rowData).forEach(value => {
            let cell = document.createElement('td');
            cell.textContent = value;
            Object.assign(cell.style, style_table.cell);
            row.appendChild(cell);
        });

        tbody.appendChild(row);

        let btn = document.createElement('button');

        btn.innerHTML = `
            <img 
                src="/Interface/assets/iconEdit.svg" 
                alt="Editar"
               style="width:10px;height:10px;"
            >
        `;

        btn.style.padding = '10px';
        btn.style.border = '1px solid rgba(0,0,0,0.08)';
        btn.style.backgroundColor = 'var(--verde-medio)';
        btn.style.borderRadius = '4px';
        btn.style.cursor = 'pointer';
        btn.style.height = '100%';

        btn.onmouseover = () => {
            btn.style.backgroundColor = 'var(--verde-escuro)';
        };

        btn.onmouseout = () => {
            btn.style.backgroundColor = 'var(--verde-medio)';
        };

        btn.onclick = () => {
            if (onEdit) onEdit(rowData, index, row);
        };

        actionsColumn.appendChild(btn);
    });

    tbl.appendChild(tbody);

    wrapper.appendChild(tbl);
    wrapper.appendChild(actionsColumn);

    return wrapper;
}

window.openEditStockModal = function(stockData, index, rowElement) {
    const loggedUser = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    const uid = `modal-edit-stock-${stockData.id}`;

    const modalHTML = `
    <div class="modal" id="${uid}">
        <div class="c-modal" style="width: 50%; max-width: 500px; margin: 8% auto;">
            <div class="b-modal">
                <h1>Editar Estoque</h1>
                
                <div class="f-input-modal">
                    <label>Livro</label>
                    <input type="text" value="${stockData.title}" disabled style="opacity: 0.6;">
                </div>

                <div class="f-input-modal">
                    <label>Quantidade Atual</label>
                    <input type="number" id="qtd-atual-${stockData.id}" value="${stockData.qtd}" disabled style="opacity: 0.6;">
                </div>

                <div class="f-input-modal">
                    <label>Nova Quantidade</label>
                    <input type="number" id="qtd-nova-${stockData.id}" value="${stockData.qtd}" min="0">
                </div>

                <div class="c-modal-btn">
                    <button type="button" id="btn-cancelar-${uid}">Cancelar</button>
                    <button type="button" id="btn-salvar-${uid}">Salvar</button>
                </div>
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = document.getElementById(uid);
    const inputNovaQtd = document.getElementById(`qtd-nova-${stockData.id}`);
    const inputQtdAtual = document.getElementById(`qtd-atual-${stockData.id}`);

    document.getElementById(`btn-salvar-${uid}`).addEventListener('click', async () => {
        const novaQtd = parseInt(inputNovaQtd.value);
        const qtdAtual = parseInt(inputQtdAtual.value);

        if (isNaN(novaQtd) || novaQtd < 0) {
            alert('Informe uma quantidade válida.');
            return;
        }

        try {
            const diferenca = novaQtd - qtdAtual;

            if (diferenca !== 0) {
                await api.updateStockQtd(stockData.bookId, loggedUser.id, diferenca);

                if (rowElement) {
                    const cells = rowElement.querySelectorAll('td');
                    if (cells.length > 0) {
                        cells[cells.length - 1].textContent = novaQtd;
                    }
                }
            }

            alert('Estoque atualizado com sucesso!');
            modal.remove();
        } catch (e) {
            alert('Erro ao atualizar: ' + (e.message || e));
        }
    });

    document.getElementById(`btn-cancelar-${uid}`).addEventListener('click', () => modal.remove());
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
};

console.log(allBooks)



window.openEditBookModal = function(BookData, index, rowElement) {
    const loggedUser = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    const uid = `modal-edit-book-${BookData.bookId}`;

   
   


    const authorsList =  BookData.authors =! null ? BookData.authors.split(',') : [];
    const gendersList = typeof BookData.genders ==='string' ? BookData.genders.split(',') : [];
    const titleText = typeof BookData.title ==='string' ? BookData.title : 'sem titulo encontrado';

    const authorsText = Array.isArray(authorsList) ? authorsList.join(', ') : "sem autores";
    const gendersText = Array.isArray(gendersList) ? gendersList.join(', ') : "sem autores";



    const modalHTML = `
    <div class="modal" id="${uid}">
        <div class="c-modal modal-livro-edit">
            <div class="b-modal">
                <h1>Editar Livro</h1>
                
                <div class="f-input-modal">
                    <label>Livro Atual</label>
                    <input type="text" value="${titleText}" disabled style="opacity: 0.6;">
                </div>
                  

                <div class="f-input-modal">
                    <label>Novo titulo</label>
                    <input type="text" id="titulo-novo-${BookData.id}" value="${titleText}">
                </div>

              
                 <div class="f-input-modal">
                    <label>Novos Autores</label>
                    <input type="text" id="autores-novo-${BookData.id}" value="${authorsText}">
                </div>

                  <div class="f-input-modal">
                    <label>Novos generos</label>
                    <input type="text" id="generos-novo-${BookData.id}" value="${gendersText}">
                </div>

                <div class="c-modal-btn">
                    <button type="button" id="btn-cancelar-${uid}">Cancelar</button>
                    <button type="button" id="btn-salvar-${uid}">Salvar</button>
                </div>
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = document.getElementById(uid);
    // const inputNovaQtd = document.getElementById(`qtd-nova-${stockData.id}`);
    // const inputQtdAtual = document.getElementById(`qtd-atual-${stockData.id}`);
    const inputNewTitle = document.getElementById(`titulo-novo-${BookData.id}`);
    const inputNewAuthors = document.getElementById(`autores-novo-${BookData.id}`);
    const inputNewGenders = document.getElementById(`autores-novo-${BookData.id}`);

    document.getElementById(`btn-salvar-${uid}`).addEventListener('click', async () => {
         const title = inputNewTitle.value.toUpperCase() ;
        
         const authorsNames = inputNewAuthors.value.split(',');
        const authorsObjects = authorsNames.map(name => ({ name: name.trim() }));
        const gendersNames = inputNewGenders.value.split(',');
        const gendersObjects = gendersNames.map(name => ({ name: name.trim() }));
        try {

        let book = { 
        title: title, 
        authors: authorsObjects, 
        genders: gendersObjects 
            };
            api.updateBook(BookData.id,book);
            alert('Estoque atualizado com sucesso!');
            modal.remove();
        } catch (e) {
            alert('Erro ao atualizar: ' + (e.message || e));
        }
    });

    document.getElementById(`btn-cancelar-${uid}`).addEventListener('click', () => modal.remove());
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
};

if (document.getElementById('table-emprestimos')) {
    document.getElementById('table-emprestimos').appendChild(table(table_loan));
    if (window.setupLoanSearch) window.setupLoanSearch(allLoans);
}

if (document.getElementById('table-multas')) {
    document.getElementById('table-multas').appendChild(table(table_penalty));
    if (window.setupPenaltySearch) window.setupPenaltySearch(allPenalties);
}

if (document.getElementById('table-estoque')) {
    document.getElementById('table-estoque').appendChild(table_with_edit(table_stock, window.openEditStockModal));
    if (window.setupStockSearch) window.setupStockSearch(allStockBook);
}

if (document.getElementById('table-movimentacoes')) {
    document.getElementById('table-movimentacoes').appendChild(table(table_moviment));
    if (window.setupMovementSearch) window.setupMovementSearch(allMoviments);
}

if (document.getElementById('table-livros')) {
    document.getElementById('table-livros').appendChild(table_with_edit(table_books,window.openEditBookModal));
    if (window.setupBooksSearch) window.setupBooksSearch(allBooks);
}