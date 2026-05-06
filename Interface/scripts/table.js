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



var table_loan = {
    headers: ['ID','Usuário', 'Livro', 'Data de Empréstimo', 'Data de Devolução', 'Status'],
    rows: allLoans.map(
        r => ({
            id: r.id,
            user: r.user.name.toUpperCase(),
            book: r.bookTitle.toUpperCase(),
            loanDate: r.loanDate,
            returnDate: r.returnDate,
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
    headers:['Id','Usuário','Data de Multa', 'Data de Entrega do Livro','Status'],
    rows: allPenalties.map(
        r =>({
            id: r.penaltyId,
            user: r.userName.toUpperCase(),
            penaltyDate: r.penaltyDate,
            returnDateLoan: r.returnloanDate,
            status: r.statusPenalty
        })
    )
}


var table_stock = {
    headers: ['Id','Livro', 'Autor','Quantidade'],
    rows: allStockBook.map(r => ({
        id: r.stockId,
        title: r.book.title.toUpperCase(), 
        author: r.book.authors.map(a=>a.name).join(',') || 'Sem author',
        qtd: r.qtd
    }))
}




var table_books= {
    headers: ['Id','Livro','Autores','Genero'],
    rows: allBooks.map(r=>({
            id: r.bookid,
            name: r.title,
            authors: r.authors.map(a=> a.name).join(',') || "autor não identificado",
            genders: r.genders

    }))
}

console.log(allBooks)

var table_moviment = {
    headers: ['Id','Usuário','Tipo do Usuário' ,'Livro', 'Quantidade', 'Tipo'],
    rows: allMoviments.map(
        r=>({
            id:r.movimentId,
            user: r.user.name.toUpperCase(),
            userType: r.user.role,
            book: r.book.title.toUpperCase(),
            qtd: (r.type == ('ENTRADA') ||  r.type == ('ENTRADA_ADMIN') )? '+'+ r.qtdMoved : '-'+ r.qtdMoved ,
            type: r.type.trim(),
        })
    )
}
console.log(allMoviments)

function table(tableData) {
    let tbl = document.createElement('table');
    tbl.style.width = 'calc(100% - 120px)';
    tbl.style.borderCollapse = 'collapse';
    tbl.style.margin = '0 60px';

  
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

if (document.getElementById('table-emprestimos'))
    document.getElementById('table-emprestimos').appendChild(table(table_loan));

if (document.getElementById('table-multas'))
    document.getElementById('table-multas').appendChild(table(table_penalty));

if (document.getElementById('table-estoque'))
    document.getElementById('table-estoque').appendChild(table(table_stock));

if (document.getElementById('table-movimentacoes'))
    document.getElementById('table-movimentacoes').appendChild(table(table_moviment));

if (document.getElementById('table-livros'))
    document.getElementById('table-livros').appendChild(table(table_books));