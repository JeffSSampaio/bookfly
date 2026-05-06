import api from './apiService.js';

const searchInput = document.getElementById('search-book');
const bookGrid = document.getElementById('book-grid');
const emptyMessage = document.getElementById('empty-message');
const loadingMessage = document.getElementById('loading-message');
const userMessage = document.getElementById('user-message');



const loggedUser = JSON.parse(sessionStorage.getItem('usuarioLogado'));
const returnDate = new Date();
returnDate.setDate(returnDate.getDate() + 7);
const returnDateString = returnDate.toISOString();

let allStock = [];
let loanedBookIds = new Set();

function renderBooks(stockList) {
  const filtered = stockList.filter(stock => {
    const title = (stock.book?.title || '').toLowerCase();
    const authors = (stock.book?.authors || []).map(a => a.name).join(' ').toLowerCase();
    const search = searchInput.value.toLowerCase();
    return title.includes(search) || authors.includes(search);
  });

  bookGrid.innerHTML = '';
  emptyMessage.classList.add('hidden');

  if (!filtered.length) {
    emptyMessage.textContent = 'Nenhum livro encontrado para esse filtro.';
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
    const availableText = quantity > 0 ? `Disponível` : 'Indisponível';
    const returnText = isAlreadyLoaned ? 'Você fez o empréstimo desse livro' : 'Disponível para empréstimo';

    const buttonMarkup = !isAlreadyLoaned && quantity > 0
      ? `
      <button class="loan-button" type="button" data-book-id="${book.bookId}" data-stock-id="${stock.stockId}">
        <img src="/Interface/assets/iconAdd.svg" alt="Empréstimo">
      </button>
    `
      : '';

    const card = document.createElement('article');
    card.className = 'book-card';
    card.dataset.bookId = book.bookId;
    card.dataset.stockId = stock.stockId;

    const stockRow = isAlreadyLoaned ? '' : `<p class="book-card-stock">${availableText}</p>`;
    
    card.innerHTML = `
      <img class="book-card-cover" src="${cover}" alt="${title}">
      <div class="book-card-info">
        <h3 class="book-card-title">${title}</h3>
        <p class="book-card-author">${authors}</p>
        ${stockRow}
        <p class="book-card-return ${isAlreadyLoaned ? 'book-card-rented' : ''}">${returnText}</p>
      </div>
      ${buttonMarkup}
    `;

    

    bookGrid.appendChild(card);
  });
}

async function loadBooks() {
  if (!loggedUser?.id) {
    userMessage.textContent = 'Faça login para ver os livros e solicitar empréstimos.';
    loadingMessage.classList.add('hidden');
    return;
  }

  try {
    const [stock, loans] = await Promise.all([
      api.getAllStock(),
      api.getLoansByUser(loggedUser.id),
    ]);

    loanedBookIds = new Set(
      (loans || [])
        .filter(loan => loan.statusLoan !== 'FINALIZADO')
        .map(loan => loan.book?.bookId || loan.bookId)
    );

    allStock = stock || [];
    renderBooks(allStock);
    loadingMessage.classList.add('hidden');
  } catch (error) {
    loadingMessage.textContent = 'Erro ao carregar livros. Tente novamente mais tarde.';
    console.error(error);
  }
}

bookGrid.addEventListener('click', async event => {
  const button = event.target.closest('.loan-button');
  const card = event.target.closest('.book-card');
  if (!card) return;

  const bookId = Number(card.dataset.bookId);
  if (!bookId) return;

  if (button) {
    button.disabled = true;
    button.style.opacity = '0.65';

    try {
      await api.createLoan(bookId, loggedUser.id, returnDateString);
      loanedBookIds.add(bookId);

      const returnText = card.querySelector('.book-card-return');
      if (returnText) {
        returnText.textContent = 'Você fez o empréstimo desse livro';
        returnText.classList.add('book-card-rented');
      }
      button.remove();
    } catch (error) {
      alert('Erro ao fazer empréstimo: ' + (error.message || error));
      console.error(error);
      button.disabled = false;
      button.style.opacity = '1';
    }
  } else {
    if (typeof window.openBookModal === 'function') {
      window.openBookModal(bookId);
    }
  }
});

searchInput.addEventListener('input', () => renderBooks(allStock));

loadBooks();
