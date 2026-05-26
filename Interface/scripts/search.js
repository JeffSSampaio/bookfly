'use strict';

function searchTable(searchTerm, tableData, fieldsToSearch) {
    if (!searchTerm || !searchTerm.trim()) return tableData;

    const term = searchTerm.toLowerCase();

    return tableData.filter(row =>
        fieldsToSearch.some(field => {
            const value = String(row[field] ?? '').toLowerCase();
            return value.includes(term);
        })
    );
}

function rerenderTable(containerId, tableConfig, filtered, onEdit) {
    const container = document.getElementById(containerId);
    if (!container) return;

    
    
    const tableElement = onEdit
    ? window.table_with_edit({ ...tableConfig, rows: filtered }, onEdit)
    : window.table({ ...tableConfig, rows: filtered });
    
    container.replaceChildren(tableElement);
    if(!filtered || filtered.length === 0){
        const warning = document.createElement('p');
        warning.style.color = 'var(--color-wine)';
        warning.style.fontWeight = '500';
        warning.style.display='flex';
        warning.style.flexDirection='row';
        warning.style.alignItems='center'
        warning.style.justifyContent='center'
        warning.innerHTML = "Nenhuma informação na tabela";
        container.appendChild(warning);
        container.appendChild(warning);
    }


}

window.setupLoanSearch = function (allLoans) {
    const formatador = new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
        timeZone: 'America/Sao_Paulo'
    });

    const tableConfig = {
        headers: ['ID', 'Usuário', 'Livro', 'Data de Empréstimo', 'Data de Devolução', 'Status']
    };

    const loansData = allLoans.map(r => ({
        id: r.id,
        user: r.user.name.toUpperCase(),
        book: r.bookTitle.toUpperCase(),
        loanDate: formatador.format(new Date(r.loanDate)),
        returnDate: formatador.format(new Date(r.returnDate)),
        status: r.status
    }));

    const input = document.getElementById('search-loans');
    if (!input) return;

    input.addEventListener('input', e => {
        const filtered = searchTable(e.target.value, loansData, ['id', 'user', 'book', 'status']);
        rerenderTable('table-loans', tableConfig, filtered, window.openEditLoanModal);
    });
};

window.setupPenaltySearch = function (allPenalties) {
    const formatador = new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
        timeZone: 'America/Sao_Paulo'
    });

    const tableConfig = {
        headers: ['ID', 'Usuário', 'Valor da Multa', 'Data de Multa', 'Data de Entrega do Livro', 'Status']
    };

    const penaltiesData = allPenalties.map(r => ({
        id: r.penaltyId,
        user: r.userName.toUpperCase(),
        amount: r.amount || 'sem valor',
        penaltyDate: r.penaltyDate ? formatador.format(new Date(r.penaltyDate)) : 'sem data',
        returnDateLoan: r.returnloanDate ? formatador.format(new Date(r.returnloanDate)) : 'sem data',
        status: r.statusPenalty
    }));

    const input = document.getElementById('search-fine');
    if (!input) return;

    input.addEventListener('input', e => {
        const filtered = searchTable(e.target.value, penaltiesData, ['id', 'user', 'amount', 'status']);
        rerenderTable('table-fines', tableConfig, filtered, window.openEditFineModal);
    });
};

window.setupStockSearch = function (allStockBook) {
    const tableConfig = {
        headers: ['ID', 'Livro', 'Autor', 'Quantidade']
    };

    const stockData = allStockBook.map(r => ({
        id: r.stockId,
        title: r.book.title.toUpperCase(),
        author: r.book.authors.map(a => a.name).join(', ') || 'Sem author',
        qtd: r.qtd,
        _bookId: r.book.bookId ?? r.book.bookid ?? r.id
    }));

    const input = document.getElementById('search-stock');
    if (!input) return;

    input.addEventListener('input', e => {
        const filtered = searchTable(e.target.value, stockData, ['id', 'title', 'author', 'qtd']);
        rerenderTable('table-stock', tableConfig, filtered, window.openEditStockModal);
    });
};

window.setupMovementSearch = function (allMoviments) {
    const formatador = new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
        timeZone: 'America/Sao_Paulo'
    });

    const tableConfig = {
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
        }
    };

    const movementsData = allMoviments.map(r => ({
        id: r.movimentId,
        createdTime: formatador.format(new Date(r.createdTime)),
        user: r.user.name.toUpperCase(),
        userType: r.user.role,
        book: r.book.title.toUpperCase(),
        qtd: (r.type === 'ENTRADA' || r.type === 'ENTRADA_ADMIN')
            ? '+' + r.qtdMoved
            : '-' + r.qtdMoved,
        type: r.type.trim(),
        description: r.description || ''
    }));

    const input = document.getElementById('search-movements');
    if (!input) return;

    input.addEventListener('input', e => {
        const filtered = searchTable(
            e.target.value,
            movementsData,
            ['id', 'createdTime', 'user', 'userType', 'type', 'book', 'qtd', 'description']
        );
        rerenderTable('table-movements', tableConfig, filtered, window.openEditMoviment);
    });
};

window.setupBooksSearch = function (allBooks) {
    const tableConfig = {
        headers: ['ID', 'Livro', 'Autores', 'Genero'],
        columnConfig: {
              id: {
                width: '70px'
            },
        }
    };

    const booksData = allBooks.map(r => ({
        id: r.bookid,
        name: r.title,
        authors: r.authors.map(a => a.name).join(', ') || 'autor não identificado',
        genders: Array.isArray(r.genders)
            ? r.genders.map(g => g.name || g).join(', ')
            : r.genders || ''
    }));

    const input = document.getElementById('search-books');
    if (!input) return;

    input.addEventListener('input', e => {
        const filtered = searchTable(e.target.value, booksData, ['id', 'name', 'authors', 'genders']);
        rerenderTable('table-books', tableConfig, filtered, window.openEditBookModal);
    });
};