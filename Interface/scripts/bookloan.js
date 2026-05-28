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

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
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

  let textSearched = searchInput.value 

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
    
    const returnText = isAlreadyLoaned ? 'Você ja tem este livro emprestado' : 'Disponível para empréstimo';
   const loanObject = allLoans.find(l => 
        (l.book?.bookId || l.bookId) === book.bookId && l.statusLoan !== 'FINALIZADO'
    );
    const loanId = loanObject ? (loanObject.id || loanObject.loanId): null;

    const btnCancelLoan = isAlreadyLoaned && quantity> 0 ?
     `<button class="loan-cancel-button" type='button' data-loan-id="${loanId}">
        <span>x</span>
     </button>`:
     
     '';
    
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

    const btnSwitch = isAlreadyLoaned ? btnCancelLoan : buttonMarkup;
    
    card.innerHTML = `
      <img class="book-card-cover" src="${cover}" alt="${title}">
      <div class="book-card-info">
        <h3 class="book-card-title">${title}</h3>
        <p class="book-card-author">${authors}</p>
        <p class="book-card-return ${'book-card-rented'} ">${returnText}</p>
      </div>
      ${btnSwitch}
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
    .filter(loan => loan.statusLoan !== 'FINALIZADO' && loan.statusLoan !== 'CANCELADO')
    .map(loan => loan.book?.bookId || loan.bookId)
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
  const cancelLoan = event.target.closest('.loan-cancel-button')
  const card = event.target.closest('.book-card');
  if (!card) return;

  const bookId = Number(card.dataset.bookId);
  if (!bookId) return;

  if (cancelLoan) {
    if (cancelLoan.disabled) return;
    cancelLoan.disabled = true;
    cancelLoan.style.opacity = '0.5';

    try {
        const loanId = cancelLoan.dataset.loanId;
        
        if (!loanId || loanId === "undefined") {
            throw new Error("Invalid loan ID.");
        }

        await api.cancelLoan(loanId);
        
  
        loanedBookIds.delete(bookId);
        allLoans = allLoans.filter(l => String(l.id || l.loanId) !== String(loanId));
        
        renderBooks(allStock); 
        alert('Emprestimo cancelado com sucesso.');
    } catch (error) {
        alert('Error cancelling loan: ' + (error.message || error));
        console.error(error);
        cancelLoan.disabled = false;
        cancelLoan.style.opacity = '1';
    }
    return;
}

 if (button) {
    button.disabled = true;
    button.style.opacity = '0.65';

    try {
        const loanResponse = await api.createLoan(bookId, loggedUser.id, returnDateString);

        loanedBookIds.add(bookId);
        allLoans.push({
          ...loanResponse,
          book: { bookId: bookId },   
          statusLoan: loanResponse.status  
              });
        
        renderBooks(allStock); 
        alert('Emprestimo criado com sucesso.');
    } catch (error) {
        alert('Error creating loan: ' + (error.message || error));
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
