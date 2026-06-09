'use strict'

import api from './apiService.js'

const loggedUser  = JSON.parse(sessionStorage.getItem('loggedUser'));
const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Sao_Paulo'
});

const PAGE_SIZE = 4;

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

function fmt(dateStr) {
    try { return dateFormatter.format(new Date(dateStr)); }
    catch { return '—'; }
}


function renderCards(loans) {
    const loanContainer   = document.getElementById('loans-container');
    const returnContainer = document.getElementById('returns-container');

    if (!loanContainer || !returnContainer) return;

    loanContainer.innerHTML   = '';
    returnContainer.innerHTML = '';

    let hasActive  = false;
    let hasReturns = false;

    loans.forEach(loan => {
        if (loan.status === 'CANCELADO') return;

        const isActive  = ['ATIVO', 'ATRASADO', 'EM_ESPERA', 'ANALISE'].includes(loan.status);
        const isDone    = loan.status === 'FINALIZADO';

        const statusLabel = (loan.status === 'ATIVO' && loan.returnDate && new Date(loan.returnDate) < new Date())
            ? 'ATRASADO'
            : loan.status;

        const cardHTML = `
            <div class="db-loan-card" onclick="openBookModalLoaned(${loggedUser.id}, ${loan.book.bookId})">
                <img src="${loan.book.cover || '/Interface/assets/book.png'}" alt="${loan.book.title}" onerror="this.src='/Interface/assets/book.png'">
                <div class="db-loan-card-info">
                    <p class="db-loan-card-title" title="${loan.book.title}">${loan.book.title}</p>
                    <p class="db-loan-card-author">${loan.book.authors.map(a => a.name).join(', ') || 'sem autor'}</p>
                    <span class="db-badge ${badgeClass(statusLabel)}">${statusLabel}</span>
                    ${loan.returnDate && isActive
                        ? `<p class="db-loan-card-date">Entrega: ${fmt(loan.returnDate)}</p>`
                        : ''}
                    ${isDone
                        ? `<p class="db-loan-card-date">Devolvido: ${fmt(loan.loanDate)}</p>`
                        : ''}
                </div>
            </div>`;

        if (isActive) {
            hasActive = true;
            loanContainer.innerHTML += cardHTML;
        }
        if (isDone) {
            hasReturns = true;
            returnContainer.innerHTML += cardHTML;
        }
    });

    if (!hasActive) {
        loanContainer.innerHTML = `<p class="db-empty">Você não tem empréstimos ativos.</p>`;
    }
    if (!hasReturns) {
        returnContainer.innerHTML = `<p class="db-empty">Você não tem devoluções.</p>`;
    }
}



function buildPagination(total, current, onPage) {
    const totalPages = Math.ceil(total / PAGE_SIZE);
    if (totalPages <= 1) return null;

    const nav = document.createElement('div');
    nav.className = 'db-pagination';

    const makeBtn = (label, target, disabled = false, active = false) => {
        const btn = document.createElement('button');
        btn.className = 'db-page-btn' + (active ? ' active' : '');
        btn.innerHTML = label;
        btn.disabled  = disabled;
        btn.onclick   = () => { if (!disabled) onPage(target); };
        return btn;
    };

    nav.appendChild(makeBtn('|&#60;', 1,           current === 1));
    nav.appendChild(makeBtn('&#60;', current - 1, current === 1));

    let start = Math.max(1, current - 2);
    let end   = Math.min(totalPages, start + 4);
    if (end - start < 4) start = Math.max(1, end - 4);

    for (let p = start; p <= end; p++) {
        nav.appendChild(makeBtn(p, p, false, p === current));
    }

    nav.appendChild(makeBtn('&#62;',  current + 1, current === totalPages));
    nav.appendChild(makeBtn('&#62;|', totalPages,  current === totalPages));

    return nav;
}

function buildTable(rows, page) {
    const wrapper = document.createElement('div');

    const tableWrap = document.createElement('div');
    tableWrap.className = 'db-table-wrap';

    const tbl = document.createElement('table');
    tbl.className = 'db-table';

    const thead = tbl.createTHead();
    const hrow  = thead.insertRow();
    ['ID', 'Livro', 'Status', 'Data de Empréstimo', 'Data de Retorno'].forEach(h => {
        const th = document.createElement('th');
        th.textContent = h;
        hrow.appendChild(th);
    });


    const tbody = tbl.createTBody();
    const slice = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    slice.forEach(r => {
        const tr = tbody.insertRow();

        const tdId = tr.insertCell(); tdId.textContent = r.id;

        const tdBook = tr.insertCell(); tdBook.textContent = r.book;

        const tdStatus = tr.insertCell();
        tdStatus.innerHTML = `<span class="db-badge ${badgeClass(r.status)}">${r.status}</span>`;

        const tdLoan   = tr.insertCell(); tdLoan.textContent   = r.loanDate;
        const tdReturn = tr.insertCell(); tdReturn.textContent = r.returnDate;
    });

    tableWrap.appendChild(tbl);
    wrapper.appendChild(tableWrap);

  
    const pag = buildPagination(rows.length, page, (p) => {
        const host = document.getElementById('table-user-loans');
        if (host) { host.innerHTML = ''; host.appendChild(buildTable(rows, p)); }
    });
    if (pag) wrapper.appendChild(pag);

    return wrapper;
}

function renderTable(loans) {
    const host = document.getElementById('table-user-loans');
    if (!host) return;

    host.innerHTML = '';

    if (!loans || loans.length === 0) {
        host.innerHTML = `<p style="color:var(--color-dark-green);font-family:var(--font-primary);padding:20px;font-weight:700;">Nenhum empréstimo encontrado.</p>`;
        return;
    }

    const rows = loans
        .filter(r => r.status !== 'CANCELADO')
        .map(r => ({
            id:         r.loanId,
            book:       r.book.title,
            status:     r.status,
            loanDate:   fmt(r.loanDate),
            returnDate: fmt(r.returnDate),
        }));

    host.appendChild(buildTable(rows, 1));
}



window.switchView = function(view) {
    const isCards = view === 'cards';
    document.getElementById('view-cards').style.display = isCards ? '' : 'none';
    document.getElementById('view-table').style.display = isCards ? 'none' : '';
    document.getElementById('btn-view-cards').classList.toggle('active',  isCards);
    document.getElementById('btn-view-table').classList.toggle('active', !isCards);
};


(async () => {
    try {
        const loans = await api.getLoansByUser(loggedUser.id);
        renderCards(loans);
        renderTable(loans);
    } catch (e) {
        console.error('dashboard.js: erro ao carregar empréstimos', e);
    }
})();
