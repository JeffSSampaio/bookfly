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

const loggedUser = JSON.parse(sessionStorage.getItem('usuarioLogado'));

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


async function refreshTables() {
    allLoans = await api.getAllLoans();
    allPenalties = await api.getAllPenalties();
    allStockBook = await api.getAllStock();
    allMoviments = await api.getAllMoviments();
    allBooks = await api.getAllBooks();

    if (document.getElementById('table-emprestimos')) {
        const container = document.getElementById('table-emprestimos');
        container.innerHTML = '';
        const rows = allLoans.map(r => ({
            id: r.id,
            user: r.user.name.toUpperCase(),
            book: r.bookTitle.toUpperCase(),
            loanDate: formatador.format(new Date(r.loanDate)),
            returnDate: formatador.format(new Date(r.returnDate)),
            status: r.status
        }));
        container.appendChild(window.table({ headers: table_loan.headers, rows }));
    }

    if (document.getElementById('table-multas')) {
        const container = document.getElementById('table-multas');
        container.innerHTML = '';
        const rows = allPenalties.map(r => ({
            id: r.penaltyId,
            user: r.userName.toUpperCase(),
            amount: r.amount || 'sem valor',
            penaltyDate: formatador.format(new Date(r.penaltyDate)),
            returnDateLoan: formatador.format(new Date(r.returnloanDate)),
            status: r.statusPenalty
        }));
        container.appendChild(window.table({ headers: table_penalty.headers, rows }));
    }

    if (document.getElementById('table-estoque')) {
        const container = document.getElementById('table-estoque');
        container.innerHTML = '';
        const rows = allStockBook.map(r => ({
            id: r.stockId,
            bookId: r.book.bookId ?? r.book.bookid,
            title: r.book.title.toUpperCase(),
            author: r.book.authors.map(a => a.name).join(',') || 'Sem author',
            qtd: r.qtd
        }));
        container.appendChild(window.table_with_edit({ headers: table_stock.headers, rows }, window.openEditStockModal));
    }

    if (document.getElementById('table-livros')) {
        const container = document.getElementById('table-livros');
        container.innerHTML = '';
        const rows = allBooks.map(r => ({
            id: r.bookid,
            title: r.title,
            authors: r.authors.map(a => a.name).join(',') || 'autor não identificado',
            genders: r.genders.map(g => g.name || g).join(', ') || 'Sem Gênero'
        }));
        container.appendChild(window.table_with_edit({ headers: table_books.headers, rows }, window.openEditBookModal));
    }

    if (document.getElementById('table-movimentacoes')) {
        const container = document.getElementById('table-movimentacoes');
        container.innerHTML = '';
        const rows = allMoviments.map(r => ({
            id: r.movimentId,
            createdTime: formatador.format(new Date(r.createdTime)),
            user: r.user.name.toUpperCase(),
            userType: r.user.role,
            book: r.book.title.toUpperCase(),
            qtd: (r.type === 'ENTRADA' || r.type === 'ENTRADA_ADMIN') ? '+' + r.qtdMoved : '-' + r.qtdMoved,
            type: r.type.trim(),
            description: r.description
        }));
        container.appendChild(window.table({ headers: table_moviment.headers, rows }));
    }
}

setInterval(refreshTables, 30000);

window.table = function(tableData) {
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

window.table_costumize = function(tableData,styleData) {
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


window.table_with_actions = function(tableData) {
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

window.table_with_edit = function(tableData, onEdit) {

    let wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'flex-start';
    wrapper.style.gap = '8px';

    let tbl = document.createElement('table');
    tbl.style.width = 'calc(100% - 120px)';
    tbl.style.borderCollapse = 'collapse';
    tbl.style.margin = '0 0 0 55px';

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
    actionsColumn.style.justifyContent ='center';
    actionsColumn.style.alignItems ='center';
    actionsColumn.style.marginTop = '45px';
    actionsColumn.style.gap = '13px';

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
                src="/Interface/assets/iconEditWhite.svg" 
                alt="Editar"
               style="width:10px;height:10px;"
            >
        `;

        btn.style.padding = '5px';
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

window.openEditMoviment = async function(movimentData,index,rowElement){ 

    const uid = `modal-edit-moviment-${movimentData.id}`;

    const currentQtd = parseInt(
        String(movimentData.qtd).replace('+','').replace('-','')
    );

    const modalHTML = ` 
        <div class="modal" id="${uid}">
            <div class="c-modal modal-movimentacoes"> 
              <div class="b-modal b-modal-movimentacoes ">
                
                <h1>Editar Movimentação N°${movimentData.id}</h1>

                <div class="f-input-modal f-input-modal-moviment">
                    <label>Quantidade</label>

                    <input 
                        type="number" 
                        id="qtd-${uid}" 
                        value="${currentQtd}"
                        min="1"
                    >
                </div>

                <div class="f-input-modal f-input-modal-moviment">
                    <label>Tipo da Movimentação</label>

                    <select id="type-${uid}" class="select-moviment-books">

                        <option 
                            value="ENTRADA"
                            ${movimentData.type.includes('ENTRADA') ? 'selected' : ''}
                        >
                            ENTRADA
                        </option>

                        <option 
                            value="SAIDA"
                            ${movimentData.type.includes('SAIDA') ? 'selected' : ''}
                        >
                            SAIDA
                        </option>

                    </select>
                </div>

                <div class="f-input-modal f-input-modal-moviment">
                    <label>Descrição</label>

                    <input 
                        type="text" 
                        id="description-${uid}"
                        value="${movimentData.description || ''}"
                    >
                </div>

                <div class="c-modal-btn c-btn-act-moviments">

                    <button 
                        type="button" 
                        id="btn-cancelar-${uid}"
                    >
                        Cancelar
                    </button>

                    <button 
                        type="button" 
                        id="btn-salvar-${uid}"
                    >
                        Salvar
                    </button>

                </div>

              </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById(uid);

    document.getElementById(`btn-salvar-${uid}`)
    .addEventListener('click', async () => {

        try {

            const qtd = parseInt(
                document.getElementById(`qtd-${uid}`).value
            );

            const type = document.getElementById(`type-${uid}`).value;

            const description = document.getElementById(`description-${uid}`).value;

            if (isNaN(qtd) || qtd <= 0) {
                alert('Quantidade inválida');
                return;
            }

            const movimentUpdated = {
                 userId: loggedUser.id,
                qtdMoviment: qtd,

                typeItem: type,

                description: description

            };

            await api.updateMoviment(
                movimentData.id,
                movimentUpdated
            );

            alert('Movimentação atualizada com sucesso!');

            modal.remove();

            refreshTables();

        } catch(e) {

            alert(
                'Erro ao atualizar movimentação: ' + 
                (e.message || e)
            );

        }

    });

    document.getElementById(`btn-cancelar-${uid}`)
    .addEventListener('click', () => modal.remove());

    modal.addEventListener('click', e => { 
        
        if (e.target === modal) modal.remove(); 
    
    });

}

window.openEditStockModal = function(stockData, index, rowElement) {
    
    const uid = `modal-edit-stock-${stockData.id}`;

    const modalHTML = `
    <div class="modal" id="${uid}">
        <div class="c-modal modal-movimentacoes" >
            <div class="b-modal b-modal-movimentacoes">
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

                  <div class="f-input-modal">
                    <label>Descrição</label>
                    <textarea name="" id="description-${stockData.id}"></textarea>
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
    const inputNewQtd = document.getElementById(`qtd-nova-${stockData.id}`);
    const inputQtdCurrent = document.getElementById(`qtd-atual-${stockData.id}`);
    const inputDescription = document.getElementById(`description-${stockData.id}`);
    document.getElementById(`btn-salvar-${uid}`).addEventListener('click', async () => {
        const newQtd = parseInt(inputNewQtd.value);
        const qtdCurrent = parseInt(inputQtdCurrent.value);
        const description = inputDescription.value
        if (isNaN(newQtd) || newQtd < 0) {
            alert('Informe uma quantidade válida.');
            return;
        }

        try {
            const diference = newQtd - qtdCurrent;

            if (diference !== 0) {
                await api.updateMoviment(stockData.bookId, loggedUser.id, diference,description);

                if (rowElement) {
                    const cells = rowElement.querySelectorAll('td');
                    if (cells.length > 0) {
                        cells[cells.length - 1].textContent = newQtd;
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




window.openAddMoviment = async function() {
    const books = await api.getAllBooks();
    const stock = await api.getAllStock;
    const uid = 'modal-add-moviment';
    
  

    let options = "";
    
    books.forEach(book => {
       options += `<option value="${book.bookId}">${book.title} - ${book.authors.map(a=> a.name).join(',')}</option>`
    });

      let selectedBooks = `
     <select name="" id="select-${uid}" class="select-moviment-books">
            ${options}
     </select>
    `;
    
    const modalHTML =`
    <div class="modal" id="${uid}">
        <div class="c-modal modal-movimentacoes">
            <div class="b-modal b-modal-movimentacoes">
                <h1>Adicionar Movimentação</h1>


                 <div class="f-input-modal  f-input-modal-moviment">
                <label> Selecionar Livro</label>
                ${selectedBooks}
                </div>
                <div class="f-input-modal f-input-modal-moviment">
                    <label>Quantidade</label>
                    <input type="number">
                </div>
                <div class="f-input-modal f-input-modal-moviment">
                    <label>Descrição</label>
                    <input type="text">
                </div>
                <div class="c-modal-btn c-btn-act-moviments">
                    <button type="button" id="btn-cancelar-${uid}">Cancelar</button>
                    <button type="button" id="btn-salvar-${uid}">Salvar</button>
                </div>
            </div>
        </div>
    </div>`;

     document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = document.getElementById(uid);

    document.getElementById(`btn-cancelar-${uid}`).addEventListener('click', () => modal.remove());
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
}



window.openEditBookModal = function(BookData, index, rowElement) {
    const loggedUser = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    const uid = `modal-edit-book-${BookData.bookId}`;

    const authorsList = Array.isArray(BookData.authors) 
    ? BookData.authors.map(a => a.name || a) 
    : (typeof BookData.authors === 'string' ? BookData.authors.split(',') : []);

    const gendersList = Array.isArray(BookData.genders) 
         ? BookData.genders 
    : (typeof BookData.genders === 'string' ? BookData.genders.split(',') : []);

    const titleText = typeof BookData.title === 'string' ? BookData.title : 'sem titulo encontrado';

    const authorsText = authorsList.length > 0 ? authorsList.join(', ') : "sem autores";
    const gendersText = gendersList.length > 0 ? gendersList.join(', ') : "sem autores";


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
    const inputNewGenders = document.getElementById(`generos-novo-${BookData.id}`);

    document.getElementById(`btn-salvar-${uid}`).addEventListener('click', async () => {
         const title = inputNewTitle.value.toUpperCase() ;
        
       
        const authors = inputNewAuthors.value.split(',')
                                    .map(a => a.trim())
                                    .filter(a => a !== "");
       const genders = inputNewGenders.value.split(',')
                                    .map(g => g.trim().toUpperCase())
                                    .filter(g => g !== "");
       
        try {

        let book = { 
        title: title, 
        authors: authors, 
        genders: genders
            };
           await api.updateBook(BookData.id,book);
            alert('Estoque atualizado com sucesso!');
            modal.remove();
            location.reload();
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
    document.getElementById('table-movimentacoes').appendChild(table_with_edit(table_moviment, window.openEditMoviment));
    if (window.setupMovementSearch) window.setupMovementSearch(allMoviments);
}

if (document.getElementById('table-livros')) {
    document.getElementById('table-livros').appendChild(table_with_edit(table_books,window.openEditBookModal));
    if (window.setupBooksSearch) window.setupBooksSearch(allBooks);
}