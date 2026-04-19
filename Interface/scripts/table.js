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
        textAlign: 'center' 
    },
    row: {
        backgroundColor: 'var(--marfin)',
        color: 'var(--verde-escuro)'
    }
}

var table_loan = {
    headers: ['Usuário', 'Livro', 'Data de Empréstimo', 'Data de Devolução', 'Status'],
    rows: [{ usuario: 'João Silva', livro: 'O Alquimista', dataEmprestimo: '01/10/2024', dataDevolucao: '15/10/2024', status: 'Em Empréstimo' }]
}

var table_penalty = {
    headers: ['Usuário', 'Valor', 'Data de Multa', 'Status'],
    rows: [{ usuario: 'João Silva', valor: 'R$ 50,00', dataMulta: '01/10/2024', status: 'Pendente' },
        { usuario: 'Maria Oliveira', valor: 'R$ 30,00', dataMulta: '05/10/2024', status: 'Pago' },
            { usuario: 'Carlos Pereira', valor: 'R$ 20,00', dataMulta: '10/10/2024', status: 'Pendente' },
                { usuario: 'Ana Santos', valor: 'R$ 40,00', dataMulta: '15/10/2024', status: 'Pago' },
                    { usuario: 'Pedro Costa', valor: 'R$ 25,00', dataMulta: '20/10/2024', status: 'Pendente' }       
    ]
}

var table_stock = {
    headers: ['Livro', 'Autor', 'Gênero', 'Quantidade'],
    rows: [{ livro: 'O Alquimista', autor: 'Paulo Coelho', genero: 'Ficção', quantidade: '5' }]
}

var table_moviment = {
    headers: ['Usuário', 'Livro', 'Quantidade', 'Tipo', 'Status'],
    rows: [{ usuario: 'João Silva', livro: 'O Alquimista', quantidade: '1', tipo: 'Empréstimo', status: 'Pendente' }]
}


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

        cell.addEventListener('mouseover', () => {
            cell.style.fontWeight = '700';
        });
        cell.addEventListener('mouseout', () => {
            cell.style.fontWeight = 'normal';
        });

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

        Object.values(rowData).forEach(value => {
            let cell = document.createElement('td');
            cell.textContent = value;
            Object.assign(cell.style, style_table.cell);
            cell.addEventListener('mouseover', () => cell.style.fontWeight = '700');
            cell.addEventListener('mouseout', () => cell.style.fontWeight = 'normal');
            row.appendChild(cell);
        });

        tbody.appendChild(row);
        rows.push(row); 
    });

    tbl.appendChild(tbody);
    container.appendChild(tbl);

   
    requestAnimationFrame(() => {
        const containerTop = container.getBoundingClientRect().top;

        rows.forEach((row, index) => {
            const rowRect = row.getBoundingClientRect();
            const topRelative = rowRect.top - containerTop + window.scrollY;

            let btn = document.createElement('img');
            btn.src = '/Interface/assets/iconVerified.svg';
            btn.alt = 'Confirmar';
            btn.style.cursor = 'pointer';
            btn.style.width = '22px';
            btn.style.height = '22px';
            btn.style.position = 'absolute';
            btn.style.right = '0px';
            btn.style.top = (topRelative + rowRect.height / 2 - 11) + 'px'; 
            
            btn.addEventListener('mouseover', () => btn.style.filter = 'brightness(0.8)');
            btn.addEventListener('mouseout', () => btn.style.filter = 'none');


            btn.onclick = () => {
                tableData.rows.splice(index, 1);
                let cont = document.getElementById('table-multas');
                cont.innerHTML = '';
                cont.appendChild(table_with_actions(tableData));
                cont.removeChild(btn);
            };

            container.appendChild(btn);
        });
    });

    return container;
}

if (document.getElementById('table-emprestimos'))
    document.getElementById('table-emprestimos').appendChild(table(table_loan));

if (document.getElementById('table-multas'))
    document.getElementById('table-multas').appendChild(table_with_actions(table_penalty));

if (document.getElementById('table-estoque'))
    document.getElementById('table-estoque').appendChild(table(table_stock));

if (document.getElementById('table-movimentacoes'))
    document.getElementById('table-movimentacoes').appendChild(table(table_moviment));