import api from './apiService.js';

const tableStyles = {
    container: {
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid var(--color-dark-green)',
        boxShadow: 'var(--box-shadow)',
        margin: '10px 60px 30px 60px',
        backgroundColor: 'var(--color-ivory)'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        margin: '0',
        tableLayout: 'fixed'
    },
    header: {
        backgroundColor: 'var(--color-dark-green)',
        color: 'var(--color-ivory)',
        fontWeight: 'bold',
        padding: '12px 10px',
        textAlign: 'center',
        fontFamily: 'var(--font-primary)',
        borderBottom: '2px solid var(--color-dark-green)'
    },
    cell: {
        borderBottom: '1px solid rgba(0, 74, 57, 0.15)',
        padding: '10px 8px',
        textAlign: 'center',
        color: 'var(--color-dark-green)',
        fontWeight: '700',
        fontFamily: 'var(--font-primary)',
        fontSize: '15px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    },
    row: {
        backgroundColor: 'var(--color-ivory)',
        color: 'var(--color-dark-green)'
    }
};

var allStock = await api.getAllStock();
var allLoans = await api.getAllLoans();
var allMovements = await api.getAllMoviments();
var allFines = await api.getAllPenalties();
var allBooks = await api.getAllBooks();

const loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Sao_Paulo'
});

const loanTableConfig = {
    headers: ['ID', 'Usuário', 'Livro', 'Data de Empréstimo', 'Data de Devolução', 'Status'],
    rows: allLoans.map(r => ({
        id: r.id,
        user: r.user.name.toUpperCase(),
        book: r.bookTitle.toUpperCase(),
        loanDate: dateFormatter.format(new Date(r.loanDate)),
        returnDate: dateFormatter.format(new Date(r.returnDate)),
        status: r.status
    }))
};

const finesTableConfig = {
    headers: ['ID', 'Usuário', 'Valor da Multa', 'Data de Multa', 'Data de Entrega do Livro', 'Status'],
    columnConfig:{
        amount: {render: (cell ,value) =>{
            cell.innerHTML = 'R$'+ value
        }
    }
    },
    rows: allFines.map(r => ({
        id: r.penaltyId,
        user: r.userName.toUpperCase(),
        amount: r.amount || 'sem valor',
        penaltyDate: r.penaltyDate ? dateFormatter.format(new Date(r.penaltyDate)) : 'sem data',
        returnDateLoan: r.returnloanDate ? dateFormatter.format(new Date(r.returnloanDate)) : 'sem data',
        status: r.statusPenalty
    }))
};

const stockTableConfig = {
    headers: ['ID', 'Livro', 'Autor', 'Quantidade'],
    rows: allStock.map(r => ({
        id: r.stockId,
        _bookId: r.book.bookId ?? r.book.bookid ?? r.id,
        title: r.book.title.toUpperCase(),
        author: r.book.authors.map(a => a.name).join(',') || 'Sem author',
        qtd: r.qtd
    }))
};

const booksTableConfig = {
    headers: ['ID', 'Livro', 'Autores', 'Genero'],
    rows: allBooks.map(r => ({
        id: r.bookid,
        title: r.title,
        authors: r.authors.map(a => a.name).join(',') || 'autor não identificado',
        genders: r.genders.map(g => g.name || g).join(', ') || 'Sem Gênero'
    }))
};

const movimentTableConfig = {
    headers: ['ID', 'Data de Criação', 'Usuário', 'Tipo do Usuário', 'Livro', 'Quantidade', 'Tipo', 'Descrição'],
    columnConfig: {
        description: {
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            maxWidth: '300px',
            textAlign: 'justify'
        },
        id: {
            width: '70px'
        },
        type: {
            render: (cell, value) => {
                const isEntrada = value.includes('ENTRADA');
                cell.innerHTML = `<span style="background:${isEntrada ? '#e1f5ee' : '#fcebeb'};color:${isEntrada ? '#0f6e56' : '#a32d2d'};font-size:11px;font-weight:700;padding:3px 10px;border-radius:999px;display:inline-block;">${value}</span>`;
            }
        },
        qtd: {
            render: (cell, value) => {
                const isPositive = String(value).startsWith('+');
                cell.textContent = value;
                cell.style.color = isPositive ? '#0f6e56' : '#a32d2d';
            }
        }
    },
    rows: allMovements.map(r => ({
        id: r.movimentId,
        createdTime: dateFormatter.format(new Date(r.createdTime)) || 'sem data de criação',
        user: r.user.name.toUpperCase(),
        userType: r.user.role,
        book: r.book.title.toUpperCase(),
        qtd: (r.type === 'ENTRADA' || r.type === 'ENTRADA_ADMIN') ? '+' + r.qtdMoved : '-' + r.qtdMoved,
        type: r.type.trim(),
        description: r.description || ''
    }))
};

window.table = function (tableData) {
    let container = document.createElement('div');
    Object.assign(container.style, tableStyles.container);

    let tbl = document.createElement('table');
    Object.assign(tbl.style, tableStyles.table);

    let thead = document.createElement('thead');
    let headerRow = document.createElement('tr');

    tableData.headers.forEach(headerText => {
        let th = document.createElement('th');
        th.textContent = headerText;
        Object.assign(th.style, tableStyles.header);
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    tbl.appendChild(thead);

    let tbody = document.createElement('tbody');

    tableData.rows.forEach(rowData => {
        let row = document.createElement('tr');
        Object.assign(row.style, tableStyles.row);

        Object.values(rowData).forEach(value => {
            let cell = document.createElement('td');
            cell.textContent = value;
            Object.assign(cell.style, tableStyles.cell);
            row.appendChild(cell);
        });

        tbody.appendChild(row);
    });

    tbl.appendChild(tbody);
    container.appendChild(tbl);
    return container;
};

window.table_with_edit = function (tableData, onEdit, btnWidth = '16px', btnHeight = '16px') {
    let container = document.createElement('div');
    Object.assign(container.style, tableStyles.container);

    let tbl = document.createElement('table');
    Object.assign(tbl.style, tableStyles.table);

    let config = tableData.columnConfig || {};

    let thead = document.createElement('thead');
    let headerRow = document.createElement('tr');

    tableData.headers.forEach(headerText => {
        let th = document.createElement('th');
        if (headerText === 'ID') th.style.width = '10px';
        th.textContent = headerText;
        Object.assign(th.style, tableStyles.header);
        headerRow.appendChild(th);
    });

    let thActions = document.createElement('th');
    thActions.textContent = 'Ações';
    Object.assign(thActions.style, tableStyles.header);
    headerRow.appendChild(thActions);

    thead.appendChild(headerRow);
    tbl.appendChild(thead);

    let tbody = document.createElement('tbody');

    tableData.rows.forEach((rowData, index) => {
        let row = document.createElement('tr');
        Object.assign(row.style, tableStyles.row);

        Object.keys(rowData).forEach(key => {
            if (key.startsWith('_')) return;

            let cell = document.createElement('td');
            Object.assign(cell.style, tableStyles.cell);

            if (config[key]?.render) {
                config[key].render(cell, rowData[key], rowData);
            } else {
                cell.textContent = rowData[key];
            }

            if (config[key]) {
                const { render, ...styleOnly } = config[key];
                Object.assign(cell.style, styleOnly);
            }

            row.appendChild(cell);
        });

        let actionsCell = document.createElement('td');
        Object.assign(actionsCell.style, tableStyles.cell);

        let btn = document.createElement('button');
        btn.innerHTML = `<img src="/Interface/assets/iconEditWhite.svg" alt="Editar" style="width:${btnWidth};height:${btnHeight};display:block;">`;
        btn.style.padding = '6px 12px';
        btn.style.border = 'none';
        btn.style.backgroundColor = 'var(--color-dark-green)';
        btn.style.borderRadius = '20px';
        btn.style.cursor = 'pointer';
        btn.style.display = 'inline-flex';
        btn.style.alignItems = 'center';
        btn.style.justifyContent = 'center';
        btn.style.margin = '0 auto';
        btn.style.transition = 'background-color 0.2s ease';
        btn.onmouseover = () => btn.style.backgroundColor = '#003327';
        btn.onmouseout  = () => btn.style.backgroundColor = 'var(--color-dark-green)';
        btn.onclick = () => { if (onEdit) onEdit(rowData, index, row); };

        actionsCell.appendChild(btn);
        row.appendChild(actionsCell);
        tbody.appendChild(row);
    });

    tbl.appendChild(tbody);
    container.appendChild(tbl);
    return container;
};

window.openEditMoviment = async function (movimentData, index, rowElement) {
    const uid = `modal-edit-moviment-${movimentData.id}`;
    const currentQtd = parseInt(String(movimentData.qtd).replace('+', '').replace('-', ''));

    const modalHTML = `
        <div class="modal" id="${uid}">
            <div class="c-modal modal-movements">
              <div class="b-modal b-modal-movements">
                <h1>Editar Movimentação N°${movimentData.id}</h1>
                <div class="f-input-modal modal-movements-field">
                    <label>Quantidade</label>
                    <input type="number" id="qtd-${uid}" value="${currentQtd}" min="1">
                </div>
                <div class="f-input-modal modal-movements-field">
                    <label>Tipo da Movimentação</label>
                    <select id="type-${uid}" class="select-movement-books">
                        <option value="ENTRADA" ${movimentData.type.includes('ENTRADA') ? 'selected' : ''}>ENTRADA</option>
                        <option value="SAIDA" ${movimentData.type.includes('SAIDA') ? 'selected' : ''}>SAIDA</option>
                    </select>
                </div>
                <div class="f-input-modal modal-movements-field">
                    <label>Descrição</label>
                    <input type="text" id="description-${uid}" value="${movimentData.description || ''}">
                </div>
                <div class="c-modal-btn modal-movements-actions">
                    <button type="button" id="btn-cancelar-${uid}">Cancel</button>
                    <button type="button" id="btn-salvar-${uid}">Salvar</button>
                </div>
              </div>
            </div>
        </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = document.getElementById(uid);

    document.getElementById(`btn-salvar-${uid}`).addEventListener('click', async () => {
        try {
            const qtd = parseInt(document.getElementById(`qtd-${uid}`).value);
            const type = document.getElementById(`type-${uid}`).value;
            const description = document.getElementById(`description-${uid}`).value;

            if (isNaN(qtd) || qtd <= 0) { alert('Quantidade inválida'); return; }

            await api.updateMoviment(movimentData.id, {
                userId: loggedUser.id,
                qtdMoviment: qtd,
                typeItem: type,
                description: description
            });

            alert('Movimentação atualizada com sucesso!');
            modal.remove();
            location.reload();
        } catch (e) {
            alert('Erro ao atualizar movimentação: ' + (e.message || e));
        }
    });

    document.getElementById(`btn-cancelar-${uid}`).addEventListener('click', () => modal.remove());
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
};

window.openEditStockModal = function (stockData, index, rowElement) {
    const uid = `modal-edit-stock-${stockData.id}`;

    const modalHTML = `
    <div class="modal" id="${uid}">
        <div class="c-modal modal-movements">
            <div class="b-modal b-modal-movements">
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
                    <textarea id="description-${stockData.id}"></textarea>
                </div>
                <div class="c-modal-btn">
                    <button type="button" id="btn-cancelar-${uid}">Cancel</button>
                    <button type="button" id="btn-salvar-${uid}">Salvar</button>
                </div>
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = document.getElementById(uid);

    document.getElementById(`btn-salvar-${uid}`).addEventListener('click', async () => {
        const newQtd = parseInt(document.getElementById(`qtd-nova-${stockData.id}`).value);
        const qtdCurrent = parseInt(document.getElementById(`qtd-atual-${stockData.id}`).value);
        const description = document.getElementById(`description-${stockData.id}`).value;

        if (isNaN(newQtd) || newQtd < 0) { alert('Informe uma quantidade válida.'); return; }

        try {
            const diference = newQtd - qtdCurrent;
            if (diference !== 0) {
                await api.updateStockQtd(stockData._bookId, loggedUser.id, diference, description);
            }
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

window.openAddMoviment = async function () {
    const books = await api.getAllBooks();
    const uid = 'modal-add-moviment';

    let options = '';
    books.forEach(book => {
        options += `<option value="${book.bookId}">${book.title} - ${book.authors.map(a => a.name).join(',')}</option>`;
    });

    const modalHTML = `
    <div class="modal" id="${uid}">
        <div class="c-modal modal-movements">
            <div class="b-modal b-modal-movements">
                <h1>Adicionar Movimentação</h1>
                <div class="f-input-modal modal-movements-field">
                    <label>Selecionar Livro</label>
                    <select id="select-${uid}" class="select-movement-books">${options}</select>
                </div>
                <div class="f-input-modal modal-movements-field">
                    <label>Quantidade</label>
                    <input type="number" id="qtd-${uid}">
                </div>
                <div class="f-input-modal modal-movements-field">
                    <label>Descrição</label>
                    <input type="text" id="desc-${uid}">
                </div>
                <div class="c-modal-btn modal-movements-actions">
                    <button type="button" id="btn-cancelar-${uid}">Cancel</button>
                    <button type="button" id="btn-salvar-${uid}">Salvar</button>
                </div>
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = document.getElementById(uid);

    document.getElementById(`btn-cancelar-${uid}`).addEventListener('click', () => modal.remove());
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
};

window.openEditBookModal = function (BookData, index, rowElement) {
    const uid = `modal-edit-book-${BookData.id}`;

    const authorsList = Array.isArray(BookData.authors)
        ? BookData.authors.map(a => a.name || a)
        : (typeof BookData.authors === 'string' ? BookData.authors.split(',') : []);

    const gendersList = Array.isArray(BookData.genders)
        ? BookData.genders
        : (typeof BookData.genders === 'string' ? BookData.genders.split(',') : []);

    const titleText   = typeof BookData.title === 'string' ? BookData.title : BookData.name || 'sem titulo';
    const authorsText = authorsList.length > 0 ? authorsList.join(', ') : 'sem autores';
    const gendersText = gendersList.length > 0 ? gendersList.join(', ') : 'sem gêneros';

    const modalHTML = `
    <div class="modal" id="${uid}">
        <div class="c-modal modal-book-edit">
            <div class="b-modal">
                <h1>Editar Livro N°${BookData.id}</h1>
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
                    <label>Novos Generos</label>
                    <input type="text" id="generos-novo-${BookData.id}" value="${gendersText}">
                </div>
                <div class="c-modal-btn">
                    <button type="button" id="btn-cancelar-${uid}">Cancel</button>
                    <button type="button" id="btn-salvar-${uid}">Salvar</button>
                </div>
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = document.getElementById(uid);

    document.getElementById(`btn-salvar-${uid}`).addEventListener('click', async () => {
        const title   = document.getElementById(`titulo-novo-${BookData.id}`).value.toUpperCase();
        const authors = document.getElementById(`autores-novo-${BookData.id}`).value.split(',').map(a => a.trim()).filter(Boolean);
        const genders = document.getElementById(`generos-novo-${BookData.id}`).value.split(',').map(g => g.trim().toUpperCase()).filter(Boolean);

        try {
            await api.updateBook(BookData.id, { title, authors, genders });
            alert('Livro atualizado com sucesso!');
            modal.remove();
            location.reload();
        } catch (e) {
            alert('Erro ao atualizar: ' + (e.message || e));
        }
    });

    document.getElementById(`btn-cancelar-${uid}`).addEventListener('click', () => modal.remove());
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
};




function renderTable({idHtmlElement , data, configTable, searchFunction, functionTable}){
    const container = document.getElementById(idHtmlElement);

    if (!container) return;

    container.appendChild(functionTable(configTable));
    if(searchFunction) searchFunction(data);

    if(!data || data.length === 0){
        const warning = document.createElement('p');
        warning.style.color = 'var(--color-mid-green)';
        warning.style.fontWeight = '500';
        warning.style.display='flex';
        warning.style.flexDirection='row';
        warning.style.alignItems='center'
        warning.style.justifyContent='center'
        warning.innerHTML = "Nenhuma informação na tabela";
        container.appendChild(warning);
    }
}


window.openEditLoanModal = function (loanData, index, rowElement) {
    const uid = `modal-edit-loan-${loanData.id}`;

    const LOAN_STATUSES = ['ATIVO', 'ATRASADO', 'FINALIZADO'];

    const statusOptions = LOAN_STATUSES.map(s =>
        `<option value="${s}" ${loanData.status === s ? 'selected' : ''}>${s}</option>`
    ).join('');

    const modalHTML = `
    <div class="modal" id="${uid}">
        <div class="c-modal modal-movements">
            <div class="b-modal b-modal-movements">
                <h1>Editar Empréstimo N°${loanData.id}</h1>
                <div class="f-input-modal modal-movements-field">
                    <label>Usuário</label>
                    <input type="text" value="${loanData.user}" disabled style="opacity:0.6;">
                </div>
                <div class="f-input-modal modal-movements-field">
                    <label>Livro</label>
                    <input type="text" value="${loanData.book}" disabled style="opacity:0.6;">
                </div>
                <div class="f-input-modal modal-movements-field">
                    <label>Status do Empréstimo</label>
                    <select id="status-${uid}" class="select-loan">${statusOptions}</select>
                </div>
                <div class="c-modal-btn modal-movements-actions">
                    <button type="button" id="btn-cancelar-${uid}">Cancelar</button>
                    <button type="button" id="btn-salvar-${uid}">Salvar</button>
                </div>
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = document.getElementById(uid);

    document.getElementById(`btn-salvar-${uid}`).addEventListener('click', async () => {
        const newStatus = document.getElementById(`status-${uid}`).value;
        try {
            
            await api.updateLoan(loanData.id, {status:newStatus});
            alert('Empréstimo atualizado com sucesso!');
            modal.remove();
            location.reload();
        } catch (e) {
            alert('Erro ao atualizar empréstimo: ' + (e.message || e));
        }
    });

    document.getElementById(`btn-cancelar-${uid}`).addEventListener('click', () => modal.remove());
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
};

window.openEditFineModal = function (fineData, index, rowElement) {
    const uid = `modal-edit-fine-${fineData.id}`;

    const FINE_STATUSES = [ 'PENDENTE', 'PAGO', 'CANCELADA' ];

    const statusOptions = FINE_STATUSES.map(s =>
        `<option value="${s}" ${fineData.status === s ? 'selected' : ''}>${s}</option>`
    ).join('');

    const currentAmount = fineData.amount === 'sem valor' ? '' : fineData.amount;

    const modalHTML = `
    <div class="modal" id="${uid}">
        <div class="c-modal modal-fines">
            <div class="b-modal b-modal-fines">
                <h1>Editar Multa N°${fineData.id}</h1>
                <div class="f-input-modal modal-fines-field">
                    <label>Usuário</label>
                    <input type="text" value="${fineData.user}" disabled style="opacity:0.6;">
                </div>
                <div class="f-input-modal modal-fines-field">
                    <label>Valor da Multa (R$)</label>
                    <input type="number" id="amount-${uid}" value="${currentAmount}" min="0" step="0.01" placeholder="0.00">
                </div>
                <div class="f-input-modal modal-fines-field">
                    <label>Status da Multa</label>
                    <select id="status-${uid}" class="select-fine-status">${statusOptions}</select>
                </div>
                <div class="c-modal-btn modal-fines-actions">
                    <button type="button" id="btn-cancelar-${uid}">Cancelar</button>
                    <button type="button" id="btn-salvar-${uid}">Salvar</button>
                </div>
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = document.getElementById(uid);

    document.getElementById(`btn-salvar-${uid}`).addEventListener('click', async () => {
        const amountVal = document.getElementById(`amount-${uid}`).value;
        const newStatus = document.getElementById(`status-${uid}`).value;
        const amount = amountVal !== '' ? parseFloat(amountVal) : null;

        if (amountVal !== '' && (isNaN(amount) || amount < 0)) {
            alert('Informe um valor de multa válido.');
            return;
        }

    try {
         const payload = { status: newStatus };

            if (amount !== null) {
                payload.amount = amount;
            }

            await api.updatePenalty(fineData.id, payload);

            alert('Multa atualizada com sucesso!');
            modal.remove();
            location.reload();

            } catch (e) {
                alert('Erro ao atualizar multa: ' + (e.message || e));
            }
    });

    document.getElementById(`btn-cancelar-${uid}`).addEventListener('click', () => modal.remove());
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
};

renderTable({
    idHtmlElement: 'table-loans',
    data: allLoans,
    configTable: loanTableConfig,
    searchFunction: window.setupLoanSearch,
    functionTable: (config) => window.table_with_edit(config, window.openEditLoanModal)
});

renderTable({
    idHtmlElement: 'table-fines',
    data: allFines,
    configTable: finesTableConfig,
    searchFunction: window.setupPenaltySearch,
    functionTable: (config) => window.table_with_edit(config, window.openEditFineModal)
});

renderTable({
    idHtmlElement: 'table-stock',
    data: allStock,
    configTable: stockTableConfig,
    searchFunction: window.setupStockSearch,
    functionTable: (config) => window.table_with_edit(config, window.openEditStockModal)
});

renderTable({
    idHtmlElement: 'table-movements',
    data: allMovements,
    configTable: movimentTableConfig,
    searchFunction: window.setupMovementSearch,
    functionTable: (config) => window.table_with_edit(config, window.openEditMoviment)
});

renderTable({
    idHtmlElement: 'table-books',
    data: allBooks,
    configTable: booksTableConfig,
    searchFunction: window.setupBooksSearch,
    functionTable: (config) => window.table_with_edit(config, window.openEditBookModal)
});