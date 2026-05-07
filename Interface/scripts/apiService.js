const BASE_URL = 'http://localhost:8080/api';


async function handleResponse(response) {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Erro HTTP: ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

function postHeaders() {
  return { 'Content-Type': 'application/json' };
}

const api = {

  getAllUsers: () =>
    fetch(`${BASE_URL}/users/list`).then(handleResponse),


  getUserById: (id) =>
    fetch(`${BASE_URL}/users/${id}`).then(handleResponse),


  createUser: (user) =>
    fetch(`${BASE_URL}/users/create`, {
      method: 'POST',
      headers: postHeaders(),
      body: JSON.stringify(user),
    }).then(handleResponse),


  updateUser: (id, user) =>
    fetch(`${BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: postHeaders(),
      body: JSON.stringify(user),
    }).then(handleResponse),

  deleteUser: (id) =>
    fetch(`${BASE_URL}/users/${id}`, { method: 'DELETE' }).then(handleResponse),



  getAllAuthors: () =>
    fetch(`${BASE_URL}/authors/list`).then(handleResponse),


  createAuthor: (author) =>
    fetch(`${BASE_URL}/authors/create`, {
      method: 'POST',
      headers: postHeaders(),
      body: JSON.stringify(author),
    }).then(handleResponse),


  editAuthor: (id, author) =>
    fetch(`${BASE_URL}/authors/${id}`, {
      method: 'PUT',
      headers: postHeaders(),
      body: JSON.stringify(author),
    }).then(handleResponse),


  addAuthorToBook: (authorId, bookId) =>
    fetch(`${BASE_URL}/authors/${authorId}/books/${bookId}`, {
      method: 'POST',
    }).then(handleResponse),

  deleteAuthor: (id) =>
    fetch(`${BASE_URL}/authors/${id}`, { method: 'DELETE' }).then(handleResponse),



  getAllBooks: () =>
    fetch(`${BASE_URL}/books/list`).then(handleResponse),


  getBookById: (id) =>
    fetch(`${BASE_URL}/books/${id}`).then(handleResponse),


  createBook: (book) =>
    fetch(`${BASE_URL}/books/create`, {
      method: 'POST',
      headers: postHeaders(),
      body: JSON.stringify(book),
    }).then(handleResponse),

 
  updateBook: (id, book) =>
    fetch(`${BASE_URL}/books/${id}`, {
      method: 'PUT',
      headers: postHeaders(),
      body: JSON.stringify(book),
    }).then(handleResponse),

 
  deleteBook: (id) =>
    fetch(`${BASE_URL}/books/${id}`, { method: 'DELETE' }).then(handleResponse),


  
  getAllStock: () =>
    fetch(`${BASE_URL}/stock/list`).then(handleResponse),


  getStockByBook: (bookId) =>
    fetch(`${BASE_URL}/stock/book/${bookId}`).then(handleResponse),

 
  addBookToStock: (bookId, userId, qtd) =>
    fetch(`${BASE_URL}/stock/addbook`, {
      method: 'POST',
      headers: postHeaders(),
      body: JSON.stringify({ bookId, userId, qtd }),
    }).then(handleResponse),


  updateStockQtd: (bookId, userId, qtd) =>
    fetch(`${BASE_URL}/stock/update-qtd`, {
      method: 'PUT',
      headers: postHeaders(),
      body: JSON.stringify({ bookId, userId, qtd }),
    }).then(handleResponse),


  removeBookFromStock: (bookId) =>
    fetch(`${BASE_URL}/stock/remove/${bookId}`, { method: 'DELETE' }).then(handleResponse),



  getAllLoans: () =>
    fetch(`${BASE_URL}/loans/list`).then(handleResponse),

  getLoansByUser: (userId) =>
    fetch(`${BASE_URL}/loans/list-loans-user/${userId}`, {
      method: 'GET'
    }).then(handleResponse),


  createLoan: (bookId, userId, returnDateBook) =>
    fetch(`${BASE_URL}/loans/create`, {
      method: 'POST',
      headers: postHeaders(),
      body: JSON.stringify({ bookId, userId, returnDateBook }),
    }).then(handleResponse),


  returnBook: (loanId) =>
    fetch(`${BASE_URL}/loans/return/${loanId}`, {
      method: 'PUT',
    }).then(handleResponse),


  getAllPenalties: () =>
    fetch(`${BASE_URL}/penalties/list`).then(handleResponse),

 
  createPenalty: (userId, loanId) =>
    fetch(`${BASE_URL}/penalties/create`, {
      method: 'POST',
      headers: postHeaders(),
      body: JSON.stringify({ userId, loanId }),
    }).then(handleResponse),

  updatePenalty: (id, penaltyData) =>
    fetch(`${BASE_URL}/penalties/update/${id}`, {
      method: 'PATCH',
      headers: postHeaders(),
      body: JSON.stringify(penaltyData),
    }).then(handleResponse),



  getAllMoviments: () =>
    fetch(`${BASE_URL}/moviments`).then(handleResponse),

 
  getMoviment: (id) =>
    fetch(`${BASE_URL}/moviments/${id}`).then(handleResponse),

  createMoviment: (bookId, userId, qtd) =>
    fetch(`${BASE_URL}/moviments`, {
      method: 'POST',
      headers: postHeaders(),
      body: JSON.stringify({ bookId, userId, qtd }),
    }).then(handleResponse),

 
  updateMoviment: (id, userId, typeItem, qtd) =>
    fetch(`${BASE_URL}/moviments/${id}`, {
      method: 'PUT',
      headers: postHeaders(),
      body: JSON.stringify({ userId, typeItem, qtd }),
    }).then(handleResponse),


  deleteMoviment: (id) =>
    fetch(`${BASE_URL}/moviments/${id}`, { method: 'DELETE' }).then(handleResponse),


  getAllBookcases: () =>
    fetch(`${BASE_URL}/bookcases`).then(handleResponse),

  getBookcaseById: (id) =>
    fetch(`${BASE_URL}/bookcases/${id}`).then(handleResponse),


  getBookcasesByUser: (userId) =>
    fetch(`${BASE_URL}/bookcases/user/${userId}`).then(handleResponse),


  getBookcasesByAuthor: (authorId) =>
    fetch(`${BASE_URL}/bookcases/author/${authorId}`).then(handleResponse),

 
  createBookcase: (name, userId) =>
    fetch(`${BASE_URL}/bookcases`, {
      method: 'POST',
      headers: postHeaders(),
      body: JSON.stringify({ name, userId }),
    }).then(handleResponse),

 
  addBookToBookcase: (bookcaseId, stockBookId) =>
    fetch(`${BASE_URL}/bookcases/${bookcaseId}/books/${stockBookId}`, {
      method: 'POST',
    }).then(handleResponse),


  updateBookcase: (id, name, stockBookId) =>
    fetch(`${BASE_URL}/bookcases/${id}`, {
      method: 'PUT',
      headers: postHeaders(),
      body: JSON.stringify({ name, stockBookId }),
    }).then(handleResponse),

 
  removeBookFromBookcase: (bookcaseId, stockBookId) =>
    fetch(`${BASE_URL}/bookcases/${bookcaseId}/books/${stockBookId}`, {
      method: 'DELETE',
    }).then(handleResponse),


  deleteBookcase: (id) =>
    fetch(`${BASE_URL}/bookcases/${id}`, { method: 'DELETE' }).then(handleResponse),

};

export default api;