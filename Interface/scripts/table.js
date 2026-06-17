import api from './apiService.js';



const PAGE_SIZE = 4; 



const tableStyleValues= {
    color:{
         headerBackgroundColor:'var( --color-ivory)',
         containerBackgroundColor:'white',
         rowBackgroundColor: 'white',
         cellTextColor: 'var(--color-mid-green)',
         headerTextColor: 'var(--color-dark-green)'
    },
    border: {
    // borderContainer: '1px solid var( --color-wine)',
     borderContainer: 'none',
    // borderHeaderBottom: '2px solid var(--color-wine)',
    // borderCellBottom:'1px solid rgba(0, 74, 57, 0.15)'
    }

}

const tableStyles = {
    container: {
borderRadius: '0px',
overflowX: 'auto',
overflowY: 'visible',
border: tableStyleValues.border.borderContainer,
margin: '10px 0.9px',
backgroundColor: tableStyleValues.color.containerBackgroundColor
},

    table: {
        width: '100%',
        borderCollapse: 'collapse',
        margin: '0',
        tableLayout: 'fixed'
    },
    header: {
        backgroundColor: tableStyleValues.color.headerBackgroundColor,
        color: tableStyleValues.color.headerTextColor,
        fontWeight: 'bold',
        padding: '12px 1px',
        textAlign: 'center',
        fontFamily: 'var(--font-primary)',
        borderBottom: tableStyleValues.border.borderHeaderBottom
    },
    cell: {
        borderBottom: tableStyleValues.border.borderCellBottom,
        padding: '10px 8px',
        textAlign: 'center',
        color: tableStyleValues.color.cellTextColor,
        fontWeight: '700',
        fontFamily: 'var(--font-primary)',
        fontSize: '15px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    },
    row: {
        backgroundColor: tableStyleValues.color.rowBackgroundColor,
        color: 'var(--color-dark-green)'
    }
};
const loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));

var allLoansByUser = await api.getLoansByUser(loggedUser.id)
var allStock = await api.getAllStock();
var allLoans = await api.getAllLoans();
var allMovements = await api.getAllMoviments();
var allFines = await api.getAllPenalties();
var allBooks = await api.getAllBooks();
var allUsers = await api.getAllUsers();


function badgeClass(status) {
    const map = {
        ATIVO:      'db-badge--ativo',
        ATRASADO:   'db-badge--atrasado',
        FINALIZADO: 'db-badge--finalizado',
        EM_ESPERA:  'db-badge--espera',
        ANALISE:    'db-badge--analise',
    };
    return map[status] || 'db-badge--default';
}

function renderTable({
idHtmlElement,
data,
configTable,
searchFunction,
functionTable,
extraButtons = [],
onEdit
}) {


const container = document.getElementById(idHtmlElement);

if (!container) return;

container.innerHTML = '';

container.appendChild(
    functionTable(
        configTable,
        onEdit,
        extraButtons
    )
);

if (searchFunction) {
    searchFunction(data);
}

if (!data || data.length === 0) {

    const warning = document.createElement('p');
    warning.innerHTML = "Nenhuma informação na tabela";
    warning.style.color=`var(--color-dark-green)`

    container.appendChild(warning);
}


}

function buildPagination(totalRows, currentPage, onPageChange) {
    const totalPages = Math.ceil(totalRows / PAGE_SIZE);
    if (totalPages <= 1) return null;

    const nav = document.createElement('div');
    nav.style.cssText = `
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 4px;
        padding: 8px 12px 6px;
        font-family: var(--font-primary);
    `;

    const btnStyle = (active) => `
        min-width: 28px;
        height: 28px;
        border: 1px solid ${active ? 'var(--color-wine)' : '#ddd'};
        border-radius: 6px;
        background: ${active ? 'var(--color-mid-green)' : 'white'};
        color: ${active ? 'white' : 'var(--color-mid-green)'};
        font-weight: ${active ? '700' : '500'};
        font-size: 13px;
        cursor: pointer;
        padding: 0 6px;
        font-family: var(--font-primary);
        transition: all 0.15s ease;
    `;

    const makeBtn = (label, targetPage, disabled = false) => {
        const btn = document.createElement('button');
        btn.innerHTML = label;
        btn.style.cssText = btnStyle(targetPage === currentPage);
        btn.disabled = disabled;
        
        if (disabled) { 
            btn.style.opacity = '0.35'; 
            btn.style.cursor = 'default'; 
        }
        
        btn.onmouseover = () => { if (!disabled && targetPage !== currentPage) btn.style.background = 'var(--color-dark-green)'; };
        btn.onmouseout  = () => { if (!disabled && targetPage !== currentPage) btn.style.background = 'white'; };
        btn.onclick = () => { if (!disabled) onPageChange(targetPage); };
        return btn;
    };

  
    nav.appendChild(makeBtn('|&lt;', 1, currentPage === 1));
    nav.appendChild(makeBtn('&lt;', currentPage - 1, currentPage === 1));

  
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + 4);
    if (end - start < 4) {
        start = Math.max(1, end - 4);
    }

    for (let p = start; p <= end; p++) {

        nav.appendChild(makeBtn(p, p, false));
    }

    nav.appendChild(makeBtn('&gt;', currentPage + 1, currentPage === totalPages));
    nav.appendChild(makeBtn('&gt;|', totalPages, currentPage === totalPages));

    return nav;
}



const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Sao_Paulo'
});

const loanByUserConfig = {
    headers:['ID','Livro','Status','Data de Empréstimo','Data de Retorno'],
    rows: allLoansByUser.map(r=>({
        id: r.loanId,
        status: r.status,
        book: r.book.title,
        loanDate: dateFormatter.format(new Date(r.loanDate)),
        returnDate: dateFormatter.format(new Date(r.returnDate)),
        _penalty: r.penalty.penaltyId
    }))
}


const usersTableConfig ={
    headers:['ID','Nome', 'Email','Tipo de Usuario','Estado','H/T'],
    rows: allUsers.map(r =>({
        id: r.id,
        name:r.name.toUpperCase(),
        email: r.email,
        role:r.role,
        recordStatus: r.recordStatus,
        recordDateTime: r.recordDateTime
    ? dateFormatter.format(new Date(r.recordDateTime))
    : "-"  ,
    }))
}

const loanTableConfig = {
    headers: ['ID', 'Usuário', 'Livro', 'Data de Empréstimo', 'Data de Devolução', 'Status'],
    columnConfig:{
        status:{
            render:(cell,value) =>{
              cell.innerHTML = `<span class="db-badge ${badgeClass(value)}">${value}</span>`
            }
        }
    },
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
    headers: ['ID', 'Usuário','Livro' ,'Valor da Multa', 'Data de Multa', 'Data de Entrega do Livro', 'Status'],
    columnConfig: {
        amount: {
            render: (cell, value) => {
               (value == 0.0) ? cell.innerHTML= '||' : cell.innerHTML = `<span class="db-badge ${badgeClass(value)}">R$${value}</span>` ;
            }
        },
        status:{
            render:(cell,value) =>{
              cell.innerHTML = `<span class="db-badge ${badgeClass(value)}">${value}</span>`
            }
        }

    },
    rows: allFines.map(r => ({
        id: r.penaltyId,
        user: r.userName.toUpperCase(),
        book: r.bookName.toUpperCase(),
        amount: r.amount || 0.0,
        penaltyDate: r.penaltyDate ? dateFormatter.format(new Date(r.penaltyDate)) : 'sem data'.toUpperCase(),
        returnDateLoan: r.returnLoanDate && r.statusPenalty == "PAGO" 
        ? dateFormatter.format(new Date(r.returnLoanDate)) 
        : 'Livro não devolvido'.toUpperCase(),
        status: r.statusPenalty
    }))
};


const stockTableConfig = {
    headers: ['ID', 'Livro', 'Autor', 'Quantidade'],
    columnConfig:{
        author:{
            render:(cell,value) => {
                 cell.innerHTML = `<span class="db-badge db-badge--espera ">${value}</span>`
            }
        }
    },
    rows: allStock.map(r => ({
        id: r.stockId,
        _bookId: r.book.bookId ?? r.book.bookid ?? r.id,
        title: r.book.title.toUpperCase(),
        author: r.book.authors.map(a => a.name.toUpperCase()).join(',') || 'Sem author'.toUpperCase(),
        qtd: r.qtd
    }))
};

const booksTableConfig = {
    headers: ['ID', 'Livro', 'Autores', 'Gênero'],
    columnConfig: {
        authors: {
            render: (cell, valuesArray) => {
                cell.innerHTML = valuesArray.map(author => 
                    `<span class="db-badge db-badge--espera">${author}</span>`
                ).join(' ');
            }
        },
        genders: {
            render: (cell, valuesArray) => {
                cell.innerHTML = valuesArray.map(gender => 
                    `<span class="db-badge db-badge--analise">${gender}</span>`
                ).join(' ');
            }
        }
    },
    rows: allBooks.map(r => {
        const authorsList = r.authors.length > 0 
            ? r.authors.map(a => a.name.toUpperCase()) 
            : ['AUTOR NÃO IDENTIFICADO'];

        const gendersList = r.genders.length > 0 
            ? r.genders.map(g => (g.name || g).toUpperCase()) 
            : ['SEM GÊNERO'];

        return {
            id: r.bookid,
            title: r.title.toUpperCase(),
            authors: authorsList,
            genders: gendersList
        };
    })
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
        book:{

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
        createdTime: dateFormatter.format(new Date(r.createdTime)) || 'sem data de criação'.toUpperCase(),
        user: r.user.name.toUpperCase(),
        userType: r.user.role,
        book: r.book.title.toUpperCase(),
        qtd: (r.type === 'ENTRADA' || r.type === 'ENTRADA_ADMIN') ? '+' + r.qtdMoved : '-' + r.qtdMoved,
        type: r.type.trim(),
        description: r.description.toUpperCase() || ''
    }))
};


window.loanTableConfig = loanTableConfig;
window.usersTableConfig = usersTableConfig;
window.booksTableConfig = booksTableConfig;
window.stockTableConfig = stockTableConfig;
window.movimentTableConfig = movimentTableConfig;
window.finesTableConfig = finesTableConfig;

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

window.table_with_edit = function (tableData, onEdit, btnWidth = '16px', btnHeight = '16px', extraButtons = [], showEditButton = () => true) {
    const wrapper = document.createElement('div');

    function render(page) {
        wrapper.innerHTML = '';
        const sortedRows = [...tableData.rows].sort((a, b) => {
            return Number(a.id) - Number(b.id);
        });

        let container = document.createElement('div');
        Object.assign(container.style, tableStyles.container);

        let tbl = document.createElement('table');
        Object.assign(tbl.style, tableStyles.table);

        let config = tableData.columnConfig || {};

        let thead = document.createElement('thead');
        let headerRow = document.createElement('tr');

        tableData.headers.forEach(headerText => {
            let th = document.createElement('th');
            if (headerText === 'ID') th.style.width = '40px';
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

        const start = (page - 1) * PAGE_SIZE;
        const pageRows = sortedRows.slice(start, start + PAGE_SIZE);

        pageRows.forEach((rowData, index) => {
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
            actionsCell.style.whiteSpace = 'nowrap';

            const defaultButtons = [
                {
                    icon: '/Interface/assets/iconEditBlue.svg',
                    alt: 'Editar',
                    bgColor: 'var(--color-blue-smooth)',
                    show: showEditButton,
                    hoverColor: 'var(--color-blue-smooth-bk)',
                    onClick: (rowData, index, row) => { if (onEdit) onEdit(rowData, index, row); }
                }
            ];

            const allButtons = [...defaultButtons, ...extraButtons];

            allButtons.forEach(btnConfig => {
                if (btnConfig.show && !btnConfig.show(rowData)) {
                        return; 
                      }
                let btn = document.createElement('button');
                btn.innerHTML = `<img src="${btnConfig.icon}" alt="${btnConfig.alt}" style="width:${btnWidth};height:${btnHeight};display:block;">`;
                btn.style.padding = '6px 10px';
                btn.style.border = 'none';
                btn.style.backgroundColor = btnConfig.bgColor || 'var(--color-dark-green)';
                btn.style.borderRadius = '10px';
                btn.style.cursor = 'pointer';
                btn.style.display = 'inline-flex';
                btn.style.margin = '0 2px';
                btn.style.alignItems = 'center';
                btn.style.justifyContent = 'center';
                btn.style.transition = 'background-color 0.2s ease';
                btn.onmouseover = () => btn.style.backgroundColor = btnConfig.hoverColor || '#003327';
                btn.onmouseout  = () => btn.style.backgroundColor = btnConfig.bgColor || 'var(--color-dark-green)';
                btn.onclick = () => { if (btnConfig.onClick) btnConfig.onClick(rowData, start + index, row); };
                actionsCell.appendChild(btn);
            });

            row.appendChild(actionsCell);
            tbody.appendChild(row);
        });

        tbl.appendChild(tbody);
        container.appendChild(tbl);
        wrapper.appendChild(container);
      
        const pagination = buildPagination(tableData.rows.length, page, render);
        if (pagination) wrapper.appendChild(pagination);
    }

    render(1);
    return wrapper;
};


function openConfirmDeleteModal({ uid, title, message, onConfirm }) {
    const modalHTML = `
    <div class="modal" id="${uid}">
        <div class="c-modal ">
            <div class="b-modal b-modal-movements" style="text-align:center;">
            <div class="modal-header">
            <h1 class="t-modal">${title}</h1>
            </div>
                <p style="color:var(--color-dark-green);font-family:var(--font-primary);margin:12px 0 24px; padding:10px; font-size:15px;">${message}</p>
                <div class="c-modal-btn modal-movements-actions">
                    <button type="button" class="closeBtn" id="btn-cancelar-${uid}">Cancelar</button>
                    <button type="button" class="confirmBtn" id="btn-confirmar-${uid}" style="background-color:#a32d2d;">Excluir</button>
                </div>
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = document.getElementById(uid);

    document.getElementById(`btn-confirmar-${uid}`).addEventListener('click', async () => {
        try {
            await onConfirm();
            modal.remove();
            location.reload();
        } catch (e) {
            alert('Erro ao excluir: ' + (e.message || e));
        }
    });

    document.getElementById(`btn-cancelar-${uid}`).addEventListener('click', () => modal.remove());
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
}




function openConfirmModal({ uid, title, message, onConfirm }) {
    const modalHTML = `
    <div class="modal" id="${uid}">
        <div class="c-modal ">
            <div class="b-modal b-modal-movements" style="text-align:center;">
            <div class="modal-header">
            <h1 class="t-modal">${title}</h1>
            </div>
                <p style="color:var(--color-dark-green);font-family:var(--font-primary);margin:12px 0 24px; padding:10px; font-size:15px;">${message}</p>
                <div class="c-modal-btn modal-movements-actions">
                    <button type="button" class="closeBtn" id="btn-cancelar-${uid}">Cancelar</button>
                    <button type="button" class="confirmBtn" id="btn-confirmar-${uid}" style="background-color:#a32d2d;">Confirmar</button>
                </div>
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = document.getElementById(uid);

    document.getElementById(`btn-confirmar-${uid}`).addEventListener('click', async () => {
        try {
            await onConfirm();
            modal.remove();
            location.reload();
        } catch (e) {
            alert('Erro ao excluir: ' + (e.message || e));
        }
    });

    document.getElementById(`btn-cancelar-${uid}`).addEventListener('click', () => modal.remove());
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
}


window.openDeleteBookModal = function (bookData) {
    openConfirmDeleteModal({
        uid: `modal-delete-book-${bookData.id}`,
        title: `Excluir Livro N°${bookData.id}`,
        message: `Tem certeza que deseja excluir o livro <strong>${bookData.title}</strong>? Esta ação não pode ser desfeita.`,
        onConfirm: () => api.deleteBook(bookData.id,loggedUser.id)
    });
};


// window.openDeleteMovimentModal = function (movimentData) {
//     openConfirmDeleteModal({
//         uid: `modal-delete-moviment-${movimentData.id}`,
//         title: `Excluir Movimentação N°${movimentData.id}`,
//         message: `Tem certeza que deseja excluir esta movimentação do livro <strong>${movimentData.book}</strong>? Esta ação não pode ser desfeita.`,
//         onConfirm: () => api.deleteMoviment(movimentData.id)
//     });
// };


window.openDeleteStockModal = function (stockData) {
    openConfirmDeleteModal({
        uid: `modal-delete-stock-${stockData.id}`,
        title: `Remover do Estoque`,
        message: `Tem certeza que deseja remover <strong>${stockData.title}</strong> do estoque? Esta ação não pode ser desfeita.`,
        onConfirm: () => api.removeBookFromStock(stockData._bookId,loggedUser.id)
    });
};

window.openDeleteUser = function (userData) {
    openConfirmDeleteModal({
        uid: `modal-delete-stock-${userData.id}`,
        title: `Remover Usuário ID°${userData.id}`,
        message: `Tem certeza que deseja remover <strong>${userData.name}</strong> do estoque? Esta ação não pode ser desfeita.`,
        onConfirm: () => api.deleteUser(userData.id)
    });
};



window.openEditMoviment = async function (movimentData, index, rowElement) {
    const uid = `modal-edit-moviment-${movimentData.id}`;
    const currentQtd = parseInt(String(movimentData.qtd).replace('+', '').replace('-', ''));

    const modalHTML = `
        <div class="modal" id="${uid}">
            <div class="c-modal modal-movements">
           
              <div class="modal-header">
                <h1 class="t-modal">Editar Movimentação N°${movimentData.id}</h1>
              </div>

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
                    <button type="button" class="closeBtn" id="btn-cancelar-${uid}">Cancelar</button>
                    <button type="button" class="confirmBtn" id="btn-salvar-${uid}">Salvar</button>
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
        <div class="c-modal ">
                <div class="modal-header">
                <h1 class="t-modal">Editar Estoque</h1>
                </div>
                <div class="f-input-modal">
                    <label style="opacity: 0.6;">Livro</label>
                    <input type="text" value="${stockData.title}" disabled style="opacity: 0.6;">
                </div>
                <div class="f-input-modal">
                    <label style="opacity: 0.6;">Quantidade Atual</label>
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
                    <button type="button" class="closeBtn" id="btn-cancelar-${uid}">Cancelar</button>
                    <button type="button" class="confirmBtn" id="btn-salvar-${uid}">Salvar</button>
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



window.openEditUser = function (userData, index, rowElement) {
    const uid = `modal-edit-user-${userData.id}`;

     const USER_ROLE = ['USER','BIBLIOTECARIO','ADMIN'];

    const statusOptions = USER_ROLE.map(s =>
        `<option value="${s}" >${s}</option>`
    ).join('');

    const modalHTML = `
    <div class="modal" id="${uid}">
        <div class="c-modal ">
                <div class="modal-header">
                <h1 class="t-modal">Editar Usuario N°${userData.id}</h1>
                </div>
                <div class="f-input-modal">
                    <label>Nome do Usuario</label>
                    <input type="text" value="${userData.name}" id="nome-nova-${userData.id}" ">
                </div>

                 <div class="f-input-modal">
                    <label>Email do Usuario</label>
                    <input type="text" value="${userData.email}" id="email-nova-${userData.id}">
                </div>
                <div class="f-input-modal ">
                <label>Papel do Usuário</label>
                <select id="status-${uid}" class="select-user"> >${statusOptions}</select>
                </div>
               
                <div class="c-modal-btn">
                    <button type="button" class="closeBtn" id="btn-cancelar-${uid}">Cancelar</button>
                    <button type="button" class="confirmBtn" id="btn-salvar-${uid}">Salvar</button>
                </div>
         
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = document.getElementById(uid);

    document.getElementById(`btn-salvar-${uid}`).addEventListener('click', async () => {
        const newName = document.getElementById(`nome-nova-${userData.id}`).value;
        const newEmail = document.getElementById(`email-nova-${userData.id}`).value;
        const newRole = document.getElementById(`status-${uid}`).value;

        try {
            const user = {
                name: newName,
                email: newEmail,
                role: newRole
            };
            api.updateUser(userData.id,user)
            alert('Usuário atualizado com sucesso!');
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
           
            <div class="modal-header">
            <h1 class="t-modal">Editar Livro N°${BookData.id}</h1>
            </div>
                <div class="f-input-modal">
                    <label style="opacity: 0.6;">Livro Atual</label>
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
                    <button type="button" class="closeBtn" id="btn-cancelar-${uid}">Cancelar</button>
                    <button type="button" class="confirmBtn" id="btn-salvar-${uid}">Salvar</button>
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


            await api.updateBook(BookData.id,{ userId: loggedUser.id ,title: title, authors: authors,genders: genders });
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



window.openEditLoanModal = function (loanData, index, rowElement) {
    const uid = `modal-edit-loan-${loanData.id}`;

    const LOAN_STATUS = ['ATIVO', 'ATRASADO', 'FINALIZADO', 'ANALISE'];

    const isWaiting = loanData.status === "EM_ESPERA";


    const statusOptions = LOAN_STATUS.map(s =>
        `<option value="${s}" ${loanData.status === s ? 'selected' : ''}>${s}</option>`
    ).join('');

    const modalHTML = `
    <div class="modal" id="${uid}">
        <div class="c-modal modal-book-edit">
            
                <div class="modal-header">
                <h1 class="t-modal">Editar Empréstimo N°${loanData.id}</h1>
                </div>
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
                <select id="status-${uid}" class="select-loan" ${isWaiting ? 'disabled' : ''}> >${statusOptions}</select>
                </div>
                <div class="c-modal-btn">
                <button type="button" class="closeBtn" id="btn-cancelar-${uid}">Cancelar</button>
                <button type="button" class="confirmBtn" id="btn-salvar-${uid}">Salvar</button>
                </div>
                
              
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = document.getElementById(uid);

    document.getElementById(`btn-salvar-${uid}`).addEventListener('click', async () => {
        const newStatus = document.getElementById(`status-${uid}`).value;
        try {
            await api.updateLoan(loanData.id, { status: newStatus });
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

    const FINE_STATUSES = ['PENDENTE','ANALISE' ,'PAGO'];

    const statusOptions = FINE_STATUSES.map(s =>
        `<option value="${s}" ${fineData.status === s ? 'selected' : ''}>${s}</option>`
    ).join('');

    const currentAmount = fineData.amount === 'sem valor' ? '' : fineData.amount;

    const modalHTML = `
    <div class="modal" id="${uid}">
        <div class="c-modal modal-book-edit">
                <div class="modal-header">
                <h1 class="t-modal">Editar Multa N°${fineData.id}</h1>
                </div>
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
                    <button type="button" class="closeBtn" id="btn-cancelar-${uid}">Cancelar</button>
                    <button type="button" class="confirmBtn" id="btn-salvar-${uid}">Salvar</button>
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
            if (amount !== null) payload.amount = amount;

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

 window.activateLoan = function(loanData){
    openConfirmModal({
        uid: `modal-activate-${loanData.id}`,
        message: "Você deseja ativar esse Emprestimo",
        title:`Ativar Empréstimo ID°${loanData.id} `,
        onConfirm: () => api.activateLoan(loanData.id,loggedUser.id)

    })
 }



window.deleteButton = (onDelete) => ({
    icon: '/Interface/assets/iconDeleteRed.svg',
    alt: 'Excluir',
    bgColor: 'var(--color-red-smooth)',
    hoverColor: 'var(--color-red-smooth-bk)',
    onClick: (rowData) => onDelete(rowData)
});

window.activateLoanBtn = (onActivate) => ({
    icon:'/Interface/assets/iconPlus.svg',
    alt: 'Ativar',
    bgColor:'var(--color-dark-green)',
    show: (rowData) => rowData.status === 'EM_ESPERA',
    hoverColor:'var(--color-mid-green)',
    onClick: (rowData) => onActivate(rowData) 
})



renderTable({
idHtmlElement: 'table-loans',
data: allLoans,
configTable: loanTableConfig,
searchFunction: window.setupLoanSearch,
onEdit: window.openEditLoanModal,
functionTable: (config, onEdit, extraButtons) =>
window.table_with_edit(
config,
onEdit,
'16px',
'16px',
extraButtons,
(rowData) => rowData.status !== 'EM_ESPERA'
),
extraButtons: [activateLoanBtn(window.activateLoan)]
});

renderTable({
idHtmlElement: 'table-fines',
data: allFines,
configTable: finesTableConfig,
searchFunction: window.setupPenaltySearch,
onEdit: window.openEditFineModal,
functionTable: (config, onEdit, extraButtons) =>
window.table_with_edit(
config,
onEdit,
'16px',
'16px',
extraButtons
)
});

renderTable({
idHtmlElement: 'table-stock',
data: allStock,
configTable: stockTableConfig,
searchFunction: window.setupStockSearch,
onEdit: window.openEditStockModal,
functionTable: (config, onEdit, extraButtons) =>
window.table_with_edit(
config,
onEdit,
'16px',
'16px',
extraButtons
),
extraButtons: [deleteButton(window.openDeleteStockModal)]
});

renderTable({
idHtmlElement: 'table-movements',
data: allMovements,
configTable: movimentTableConfig,
searchFunction: window.setupMovementSearch,
onEdit: window.openEditMoviment,
functionTable: (config, onEdit, extraButtons) =>
window.table_with_edit(
config,
onEdit,
'16px',
'16px',
extraButtons
),
// extraButtons: [deleteButton(window.openDeleteMovimentModal)]
});

renderTable({
idHtmlElement: 'table-books',
data: allBooks,
configTable: booksTableConfig,
searchFunction: window.setupBooksSearch,
onEdit: window.openEditBookModal,
functionTable: (config, onEdit, extraButtons) =>
window.table_with_edit(
config,
onEdit,
'16px',
'16px',
extraButtons
),
extraButtons: [
deleteButton(window.openDeleteBookModal)
]
});



renderTable({
idHtmlElement:'table-users',
data: allUsers,
configTable: usersTableConfig,
searchFunction: window.setupUsersSearch ,
onEdit: window.openEditUser ,
functionTable: (config, onEdit, extraButtons) =>
window.table_with_edit(
config,
onEdit,
'16px',
'16px',
extraButtons,
(rowData) => rowData.recordStatus !== 'DELETED'
),
extraButtons:[deleteButton(window.openDeleteUser)]
});


function executeBtn(btn, content, action = 'click') {

    if (!btn) {
        return;
    }

    btn.addEventListener(action, async () => {
        try {
            await content();
        } catch (e) {
            alert("Não foi Possível Executar Ação: " + e);
        }
    });
}


const btnRelStock = document.getElementById('btnRelStock');
const btnRelBook = document.getElementById('btnRelBook');
const btnRelMoviment = document.getElementById('btnRelMoviment');
const btnRelPenalty = document.getElementById('btnRelPenalty');
const btnRelLoan = document.getElementById('btnRelLoan');
const btnRelUser = document.getElementById('btnRelUser');

[
    [btnRelBook, api.exportPdfBooks],
    [btnRelLoan, api.exportPdfLoans],
    [btnRelMoviment, api.exportPdfMoviment],
    [btnRelPenalty, api.exportPdfPenalties],
    [btnRelStock, api.exportPdfBooksStock],
     [btnRelUser, api.exportPdfUsers],
].forEach(([btn, action]) => executeBtn(btn, action));

