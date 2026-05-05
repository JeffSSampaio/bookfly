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
    const cover = book.cover || '/Interface/assets/livro.png';
    const title = book.title || 'Título indisponível';
    const authors = (book.authors || []).map(a => a.name).join(', ') || 'Autor desconhecido';
    const quantity = stock.qtd ?? 0;

    const card = document.createElement('article');
    card.className = 'book-card';
    card.innerHTML = `
      <img class="book-card-cover" src="${cover}" alt="${title}">
      <div class="book-card-info">
        <h3 class="book-card-title">${title}</h3>
        <p class="book-card-author">${authors}</p>
        <p class="book-card-stock">Disponível: ${quantity}</p>
        <p class="book-card-return">Devolução em até 7 dias</p>
      </div>
      <button class="loan-button" type="button" data-book-id="${book.bookId}" data-stock-id="${stock.stockId}">
        <img src="/Interface/assets/iconAdd.svg" alt="Empréstimo">
      </button>
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
    const stock = await api.getAllStock();
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
  if (!button) return;

  const bookId = Number(button.dataset.bookId);
  if (!bookId) return;

  button.disabled = true;
  button.style.opacity = '0.65';

  try {
    await api.createLoan(bookId, loggedUser.id, returnDateString);
    alert('Empréstimo realizado! Você tem 7 dias para devolver.');
    window.location.href = '/Interface/pages/homepage.html';
  } catch (error) {
    alert('Erro ao fazer empréstimo: ' + (error.message || error));
    console.error(error);
    button.disabled = false;
    button.style.opacity = '1';
  }
});

searchInput.addEventListener('input', () => renderBooks(allStock));

loadBooks();
