'use strict';
let originalTableData = {};


function searchTable(searchTerm, tableData, fieldsToSearch) {
    if (!searchTerm.trim()) {
        return tableData;
    }

    const term = searchTerm.toLowerCase();
    return tableData.filter(row => {
        return fieldsToSearch.some(field => {
            const value = String(row[field] || '').toLowerCase();
            return value.includes(term);
        });
    });
}


function renderFilteredTable(tableId, filteredData, tableConfig) {
    const container = document.getElementById(tableId);
    if (!container) return;

    
    container.innerHTML = '';

  
    const tbl = document.createElement('table');
    tbl.style.width = 'calc(100% - 120px)';
    tbl.style.borderCollapse = 'collapse';
    tbl.style.margin = ' 20px 60px';

    const style_table = {
        header: {
            backgroundColor: 'var(--verde-escuro)',
            color: 'var(--marfin)',
            fontWeight: 'bold',
            textAlign: 'center',
            padding: '10px'
        },
        cell: {
            border: '1px solid var(--verde-escuro)',
            padding: '10px',
            textAlign: 'center',
            color: 'var(--verde-escuro)',
            fontWeight: '800'
        },
        row: {
            backgroundColor: 'var(--marfin)',
            color: 'var(--verde-escuro)'
        }
    };

 
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    tableConfig.headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        Object.assign(th.style, style_table.header);
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    tbl.appendChild(thead);

 
    const tbody = document.createElement('tbody');
    filteredData.forEach(rowData => {
        const row = document.createElement('tr');
        Object.assign(row.style, style_table.row);

        Object.values(rowData).forEach(value => {
            const cell = document.createElement('td');
            cell.textContent = value;
            Object.assign(cell.style, style_table.cell);
            row.appendChild(cell);
        });

        tbody.appendChild(row);
    });
    tbl.appendChild(tbody);

    container.appendChild(tbl);
}


window.setupLoanSearch = function(allLoans) {
    const formatador = new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
        timeZone: 'America/Sao_Paulo'
    });

    const tableConfig = {
        headers: ['ID', 'Usuário', 'Livro', 'Data de Empréstimo', 'Data de Devolução', 'Status'],
    };

    const loansData = allLoans.map(r => ({
        id: r.id,
        user: r.user.name.toUpperCase(),
        book: r.bookTitle.toUpperCase(),
        loanDate: formatador.format(new Date(r.loanDate)),
        returnDate: formatador.format(new Date(r.returnDate)),
        status: r.status
    }));

    originalTableData.loans = loansData;

    const searchInput = document.querySelector('.search-input-container input');
    if (searchInput && searchInput.id === '') {
        searchInput.id = 'search-loans';
    }

    const searchLoanInput = document.getElementById('search-loans');
    if (searchLoanInput) {
        searchLoanInput.addEventListener('input', (e) => {
            const filtered = searchTable(e.target.value, loansData, ['user', 'book', 'status']);
            renderFilteredTable('table-emprestimos', filtered, tableConfig);
        });
    }
};


window.setupPenaltySearch = function(allPenalties) {
    const formatador = new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
        timeZone: 'America/Sao_Paulo'
    });

    const tableConfig = {
        headers: ['Id', 'Usuário', 'Valor da Multa', 'Data de Multa', 'Data de Entrega do Livro', 'Status'],
    };

    const penaltiesData = allPenalties.map(r => ({
        id: r.penaltyId,
        user: r.userName.toUpperCase(),
        amount: r.amount || 'sem valor',
        penaltyDate: formatador.format(new Date(r.penaltyDate)),
        returnDateLoan: formatador.format(new Date(r.returnloanDate)),
        status: r.statusPenalty
    }));

    originalTableData.penalties = penaltiesData;

    const searchInput = document.querySelector('.search-input-container input');
    if (searchInput && searchInput.id === '') {
        searchInput.id = 'search-penalties';
    }

    const searchPenaltyInput = document.getElementById('search-penalties');
    if (searchPenaltyInput) {
        searchPenaltyInput.addEventListener('input', (e) => {
            const filtered = searchTable(e.target.value, penaltiesData, ['user', 'status', 'amount','id']);
            renderFilteredTable('table-multas', filtered, tableConfig);
        });
    }
};


window.setupStockSearch = function(allStockBook) {
    const tableConfig = {
        headers: ['Id', 'Identificador', 'Livro', 'Autor', 'Quantidade'],
    };

    const stockData = allStockBook.map(r => ({
        id: r.stockId,
        bookId: r.book.bookId ?? r.book.bookid,
        title: r.book.title.toUpperCase(),
        author: r.book.authors.map(a => a.name).join(',') || 'Sem author',
        qtd: r.qtd
    }));

    originalTableData.stock = stockData;

    const searchContainer = document.querySelector('.search-input-container');
    if (searchContainer && !searchContainer.querySelector('input')) {
        const searchInput = document.createElement('input');
        searchInput.type = 'search';
        searchInput.id = 'search-stock';
        searchInput.placeholder = 'Buscar livro, autor...';
        searchContainer.appendChild(searchInput);

        const icon = document.createElement('img');
        icon.src = '/Interface/assets/iconlupa.svg';
        icon.alt = 'Buscar';
        searchContainer.appendChild(icon);
    }

    const searchStockInput = document.getElementById('search-stock');
    if (searchStockInput) {
        searchStockInput.addEventListener('input', (e) => {
            const filtered = searchTable(e.target.value, stockData, ['title', 'author','id']);
            const container = document.getElementById('table-estoque');
             if (!container) return;
            container.innerHTML = '';
             container.appendChild(
                table_with_edit(
                    { headers: tableConfig.headers, rows: filtered },
                    window.openEditStockModal
                )
            );
            // renderFilteredTable('table-estoque', filtered, tableConfig);
        });
    }
};


window.setupMovementSearch = function(allMoviments) {
     const formatador = new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
        timeZone: 'America/Sao_Paulo'
    });
    const tableConfig = {
        headers: ['Id', 'Usuário', 'Tipo do Usuário', 'Livro', 'Quantidade', 'Tipo', 'Descrição','Data de Criação'],
    };

    const movementsData = allMoviments.map(r => ({
        id: r.movimentId,
        user: r.user.name.toUpperCase(),
        userType: r.user.role,
        book: r.book.title.toUpperCase(),
        qtd: (r.type === 'ENTRADA' || r.type === 'ENTRADA_ADMIN') ? '+' + r.qtdMoved : '-' + r.qtdMoved,
        type: r.type.trim(),
        description: r.description || '',
        createdTime: formatador.format(new Date(r.createdTime))
    }));

    originalTableData.movements = movementsData;

    const searchInput = document.querySelector('.search-input-container input');
    if (searchInput && searchInput.id === '') {
        searchInput.id = 'search-movements';
    }

    const searchMovementInput = document.getElementById('search-movements');
    if (searchMovementInput) {
        searchMovementInput.addEventListener('input', (e) => {
            const filtered = searchTable(e.target.value, movementsData, ['user', 'book', 'type', 'description','id','createdTime','qtd']);
                const container = document.getElementById('table-movimentacoes');
                if (!container) return;
            container.innerHTML = '';
             container.appendChild(
                table_with_edit(
                    { headers: tableConfig.headers, rows: filtered },
                    window.openEditMoviment
                )

            )
        });
    }
};


window.setupBooksSearch = function(allBooks) {
    const tableConfig = {
        headers: ['Id', 'Livro', 'Autores', 'Genero'],
    };

    const booksData = allBooks.map(r => ({
        id: r.bookid,
        name: r.title,
        authors: r.authors.map(a => a.name).join(',') || 'autor não identificado',
        genders: r.genders
    }));

    originalTableData.books = booksData;

    const searchInput = document.querySelector('.search-input-container input');
    if (searchInput && searchInput.id === '') {
        searchInput.id = 'search-books';
    }

    const searchBooksInput = document.getElementById('search-books');
    if (searchBooksInput) {
        searchBooksInput.addEventListener('input', (e) => {
            const filtered = searchTable(e.target.value, booksData, ['name', 'authors', 'genders','id']);
              const container = document.getElementById('table-livros');
            if (!container) return;
            container.innerHTML = '';
            container.appendChild(
                table_with_edit(
                    { headers: tableConfig.headers, rows: filtered },
                    window.openEditBookModal
                )
            );
        });
    }
};
