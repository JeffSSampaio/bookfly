import api from './apiService.js';

const searchInput = document.getElementById('search-book');
const bookGrid = document.getElementById('book-grid');
const emptyMessage = document.getElementById('empty-message');
const loadingMessage = document.getElementById('loading-message');
const userMessage = document.getElementById('user-message');

const loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));
const returnDate = new Date();
returnDate.setDate(returnDate.getDate() + 7);
const returnDateString = returnDate.toISOString();

let allStock = [];
let allLoans = [];
let loanedBookIds = new Set();

function renderBooks(stockList) {
  const filtered = stockList.filter(stock => {
    const title = (stock.book?.title || '').toLowerCase();
    const authors = (stock.book?.authors || []).map(a => a.name).join(' ').toLowerCase();
    const search = searchInput.value.toLowerCase();
    return title.includes(search) || authors.includes(search);
  });

  const textSearched = searchInput.value;

  bookGrid.innerHTML = '';
  emptyMessage.classList.add('hidden');

  if (!filtered.length) {
    emptyMessage.textContent = `Livro "${textSearched}" Não Encontrado `;
    emptyMessage.classList.remove('hidden');
    return;
  }

  filtered.forEach(stock => {
    const book = stock.book || {};
    const cover = book.cover || 'sem capa disponível';
    const title = book.title || 'Título indisponível';
    const authors = (book.authors || []).map(a => a.name).join(', ') || 'Autor desconhecido';
    const quantity = stock.qtd ?? 0;

    const isAlreadyLoaned = loanedBookIds.has(book.bookId);

   const loanObject = allLoans.find(l =>
  Number(l.book?.bookId) === Number(book.bookId) &&
  l.status !== 'FINALIZADO' &&
  l.status !== 'CANCELADO'
);

const loanId = loanObject ? (loanObject.loanId || loanObject.id) : null;

const canCancel = loanObject?.status === 'EM_ESPERA';

const returnText = isAlreadyLoaned
  ? loanObject?.status === 'EM_ESPERA'
    ? 'Empréstimo aguardando aprovação'
    : 'Livro emprestado'
  : 'Disponível para empréstimo';

const btnCancelLoan = isAlreadyLoaned && quantity > 0 && canCancel
  ? `<button class="loan-cancel-button" type="button" data-loan-id="${loanId}">
       <span>x</span>
     </button>`
  : '';
  
    const buttonMarkup = !isAlreadyLoaned && quantity > 0
      ? `<button class="loan-button" type="button" data-book-id="${book.bookId}" data-stock-id="${stock.stockId}">
           <img src="/Interface/assets/iconAdd.svg" alt="Empréstimo">
         </button>`
      : '';

    const card = document.createElement('article');
    card.className = 'book-card';
    card.dataset.bookId = book.bookId;
    card.dataset.stockId = stock.stockId;

    card.innerHTML = `
      <img class="book-card-cover" src="${cover}" alt="${title}">
      <div class="book-card-info">
        <h3 class="book-card-title">${title}</h3>
        <p class="book-card-author">${authors}</p>
        <p class="book-card-return book-card-rented">${returnText}</p>
      </div>
      ${isAlreadyLoaned ? btnCancelLoan : buttonMarkup}
    `;

    bookGrid.appendChild(card);
  });
}

async function loadBooks() {
  if (!loggedUser?.id) {
    userMessage.textContent = 'log para acessar livros e solicitar empréstimos.';
    loadingMessage.classList.add('hidden');
    return;
  }

  try {
    const [stock, loans] = await Promise.all([
      api.getAllStock(),
      api.getLoansByUser(loggedUser.id),
    ]);

    allLoans = loans || [];

  
    loanedBookIds = new Set(
      allLoans
        .filter(loan => loan.status !== 'FINALIZADO' && loan.status !== 'CANCELADO')
        .map(loan => loan.book?.bookId)
    );

    allStock = stock || [];
    renderBooks(allStock);
    loadingMessage.classList.add('hidden');
  } catch (error) {
    loadingMessage.textContent = 'falha ao carregar livros. Tente novamente mais tarde.';
    console.error(error);
  }
}

bookGrid.addEventListener('click', async event => {
  const button = event.target.closest('.loan-button');
  const cancelLoan = event.target.closest('.loan-cancel-button');
  const card = event.target.closest('.book-card');
  if (!card) return;

  const bookId = Number(card.dataset.bookId);
  if (!bookId) return;

 if (cancelLoan) {
  const loan = allLoans.find(
    l => String(l.loanId ?? l.id) === String(cancelLoan.dataset.loanId)
  );

  if (!loan || loan.status !== 'EM_ESPERA') {
    alert('Este empréstimo já foi aprovado e não pode mais ser cancelado.');
    return;
  }

  if (cancelLoan.disabled) return;

  cancelLoan.disabled = true;
  cancelLoan.style.opacity = '0.5';

  try {
    const loanId = cancelLoan.dataset.loanId;

    await api.cancelLoan(loanId);

    loanedBookIds.delete(bookId);

    allLoans = allLoans.filter(
      l => String(l.loanId ?? l.id) !== String(loanId)
    );

    renderBooks(allStock);
    alert('Empréstimo cancelado com sucesso.');
  } catch (error) {
    alert('Erro ao cancelar empréstimo: ' + (error.message || error));
    cancelLoan.disabled = false;
    cancelLoan.style.opacity = '1';
  }

  return;
}


if (button) {
  button.disabled = true;
  button.style.opacity = '0.65';

  try {
    const loanResponse = await api.createLoan(
      bookId,
      loggedUser.id,
      returnDateString
    );

    loanedBookIds.add(bookId);

    allLoans.push({
      loanId: loanResponse.id,
      id: loanResponse.id,
      status: loanResponse.status,
      book: { bookId }
    });

    renderBooks(allStock);
    alert('Empréstimo criado com sucesso.');
  } catch (error) {
    alert('Erro ao criar empréstimo: ' + (error.message || error));
    button.disabled = false;
    button.style.opacity = '1';
  }

  return;
}

});

searchInput.addEventListener('input', () => renderBooks(allStock));

loadBooks();