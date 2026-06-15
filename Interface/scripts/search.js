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




function rerenderTable(containerId, tableConfig, filtered, onEdit, extraButtons=[]) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const tableElement = onEdit
    ? window.table_with_edit(
        { ...tableConfig, rows: filtered },
        onEdit,
        '16px',
        '16px',
        extraButtons
      )
    : window.table({ ...tableConfig, rows: filtered });
    
    container.replaceChildren(tableElement);
    if(!filtered || filtered.length === 0){
        const warning = document.createElement('p');
        warning.style.color = 'var(--color-dark-green) !important';
        warning.style.fontWeight = '500';
        warning.style.display='flex';
        warning.style.flexDirection='row';
        warning.style.alignItems='center';
        warning.style.justifyContent='center';
        warning.innerHTML = "Nenhuma informação na tabela";
        container.appendChild(warning);
    }
}

window.setupLoanSearch = function (allLoans) {
    const formatador = new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
        timeZone: 'America/Sao_Paulo'
    });


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
        rerenderTable('table-loans', window.loanTableConfig, filtered, window.openEditLoanModal);
    });
};

window.setupPenaltySearch = function (allPenalties) {
    const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
        timeZone: 'America/Sao_Paulo'
    });


    const penaltiesData = allPenalties.map(r => ({
        id: r.penaltyId,
        user: r.userName.toUpperCase(),
        book: r.bookName.toUpperCase(),
        amount: r.amount || 0.0,
        penaltyDate: r.penaltyDate ? dateFormatter.format(new Date(r.penaltyDate)) : 'sem data'.toUpperCase(),
        returnDateLoan: r.returnLoanDate && r.statusPenalty == "PAGO" 
        ? dateFormatter.format(new Date(r.returnLoanDate)) 
        : 'Livro não devolvido'.toUpperCase(),
        status: r.statusPenalty
    }));

    const input = document.getElementById('search-fine');
    if (!input) return;

    input.addEventListener('input', e => {
        const filtered = searchTable(e.target.value, penaltiesData, ['id', 'user', 'book','amount', 'status']);
        rerenderTable('table-fines', window.finesTableConfig, filtered, window.openEditFineModal);
    });
};

window.setupStockSearch = function (allStockBook) {

    const stockData = allStockBook.map(r => ({
        id: r.stockId,
        title: r.book.title.toUpperCase(),
        author: r.book.authors.map(a => a.name).join(', ') || 'Sem autor'.toUpperCase(),
        qtd: r.qtd,
        _bookId: r.book.bookId ?? r.book.bookid ?? r.id
    }));

    const input = document.getElementById('search-stock');
    if (!input) return;

    input.addEventListener('input', e => {
        const filtered = searchTable(e.target.value, stockData, ['id', 'title', 'author', 'qtd']);
        rerenderTable('table-stock',
             window.stockTableConfig,
             filtered,
             window.openEditStockModal,
             [window.deleteButton(window.openDeleteStockModal)]);
    });
};

window.setupMovementSearch = function (allMoviments) {
    const formatador = new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
        timeZone: 'America/Sao_Paulo'
    });



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
        rerenderTable('table-movements', window.movimentTableConfig, filtered, window.openEditMoviment);
    });
};

window.setupUsersSearch = function (allUsers) {
  const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
        timeZone: 'America/Sao_Paulo'
    });
 

    const usersData = allUsers.map(r =>({
        id: r.id,
        name:r.name.toUpperCase(),
        email: r.email,
        role:r.role,
        recordStatus: r.recordStatus,
        recordDateTime: r.recordDateTime
    ? dateFormatter.format(new Date(r.recordDateTime))
    : "-"  ,
    }));

    const input = document.getElementById('search-users');

    if (!input) return;

    input.addEventListener('input', e => {

        const filtered = searchTable(
            e.target.value,
            usersData,
            ['id', 'name', 'email', 'role', 'state']
        );

        rerenderTable(
            'table-users',
            window.usersTableConfig,
            filtered,
            window.openEditUser,
            [window.deleteButton(window.openDeleteUser)]
        );
    });
};

window.setupBooksSearch = function (allBooks) {
   

    const booksData = allBooks.map(r => {
        const authorsList = r.authors && r.authors.length > 0 
            ? r.authors.map(a => a.name.toUpperCase()) 
            : ['AUTOR NÃO IDENTIFICADO'];

        const rawGenders = Array.isArray(r.genders)
            ? r.genders.map(g => g.name || g)
            : (r.genders ? r.genders.split(',') : []);

        const gendersList = rawGenders.length > 0
            ? rawGenders.map(g => String(g).trim().toUpperCase())
            : ['SEM GÊNERO'];

        return {
            id: r.bookid,
            name: r.title.toUpperCase(),
            authors: authorsList,
            genders: gendersList,
            _search_authors: authorsList.join(' '),
            _search_genders: gendersList.join(' ')
        };
    });

    const input = document.getElementById('search-books');
    if (!input) return;

    input.addEventListener('input', e => {
        const filtered = searchTable(e.target.value, booksData, ['id', 'name', '_search_authors', '_search_genders']);
        rerenderTable(
            'table-books',
            window.booksTableConfig, 
            filtered, 
            window.openEditBookModal,
            [window.deleteButton(window.openDeleteBookModal)]);
    });
};

