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

  exportPdfUsers: async () => {

    const response = await fetch(
        `${BASE_URL}/users/pdf`
    );

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'usuarios.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },

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

  deleteAuthor: (id,userId) =>
    fetch(`${BASE_URL}/authors/${id}userId=${userId}`, { method: 'DELETE' }).then(handleResponse),



  getAllBooks: () =>
    fetch(`${BASE_URL}/books/list/active`).then(handleResponse),


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

 
  deleteBook: (id,userId) =>
    fetch(`${BASE_URL}/books/${id}?userId=${userId}`, { method: 'DELETE' }).then(handleResponse),

  exportPdfBooks: async () => {

    const response = await fetch(
        `${BASE_URL}/books/pdf`
    );

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Livros.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },

  
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


  updateStockQtd: (bookId, userId, qtd,description) =>
    fetch(`${BASE_URL}/stock/update-qtd`, {
      method: 'PUT',
      headers: postHeaders(),
      body: JSON.stringify({ bookId, userId, qtd ,description}),
    }).then(handleResponse),


  removeBookFromStock: (bookId,userId) =>
    fetch(`${BASE_URL}/stock/remove/${bookId}?userId=${userId}`, { method: 'DELETE' }).then(handleResponse),
 
  exportPdfBooksStock: async () => {

    const response = await fetch(
        `${BASE_URL}/stock/pdf`
    );

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'LivrosEstoque.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },


  getAllLoans: () =>
    fetch(`${BASE_URL}/loans/list`).then(handleResponse),

  getLoansByUser: (userId) =>
    fetch(`${BASE_URL}/loans/list-loans-user/${userId}`, {
      method: 'GET'
    }).then(handleResponse),

  getBookByLoanForUser:(userId,bookId) =>
    fetch(`${BASE_URL}/loans/list/user/${userId}/book/${bookId}`,{
       method:'GET' 
    }).then(handleResponse),
  


  createLoan: (bookId, userId, returnDateBook) =>
    fetch(`${BASE_URL}/loans/create`, {
      method: 'POST',
      headers: postHeaders(),
      body: JSON.stringify({ bookId, userId, returnDateBook }),
    }).then(handleResponse),

  activateLoan: (loanId,userId) => fetch(`${BASE_URL}/loans/activate/loan/${loanId}/user/${userId}`,{
      method: 'PUT'
    }).then(handleResponse),

  returnBook: (loanId) =>
    fetch(`${BASE_URL}/loans/return/${loanId}`, {
      method: 'PUT',
    }).then(handleResponse),
  
  cancelLoan:(loanId) =>
    fetch(`${BASE_URL}/loans/cancel/${loanId}`, {
      method:'PUT',
    }).then(handleResponse),

  updateLoanStatus: (loanId, status) =>
    fetch(`${BASE_URL}/loans/update-status/${loanId}`, {
      method: 'PATCH',
      headers: postHeaders(),
      body: JSON.stringify({ status }),
    }).then(handleResponse),

    updateLoan: (loanId, newLoan) => 
      fetch(`${BASE_URL}/loans/edit/${loanId}`,{
        method:'PUT',
        headers: postHeaders(),
        body: JSON.stringify(newLoan)
      }).then(handleResponse), 

    exportPdfLoans: async () => {

    const response = await fetch(
        `${BASE_URL}/loans/pdf`
    );

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Emprestimos.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },  

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

  deletePenalty: (id , userId) =>
      fetch(`${BASE_URL}/penalties/${id}?userId=${userId}`,{
          method:'DELETE',
        }).then(handleResponse),

     exportPdfPenalties: async () => {

    const response = await fetch(
        `${BASE_URL}/penalties/pdf`
    );

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Multas.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },

  getAllMoviments: () =>
    fetch(`${BASE_URL}/moviments`).then(handleResponse),

 
  getMoviment: (id) =>
    fetch(`${BASE_URL}/moviments/${id}`).then(handleResponse),

  createMoviment: (bookId, userId, qtd, description = '') =>
    fetch(`${BASE_URL}/moviments`, {
      method: 'POST',
      headers: postHeaders(),
      body: JSON.stringify({ bookId, userId, qtd, description }),
    }).then(handleResponse),

 
updateMoviment: (id, moviment) =>
  fetch(`${BASE_URL}/moviments/${id}`, {
    method: 'PUT',
    headers: postHeaders(),
    body: JSON.stringify(moviment),
  }).then(handleResponse),

  deleteMoviment: (id) =>
    fetch(`${BASE_URL}/moviments/${id}`, { method: 'DELETE' }).then(handleResponse),

  exportPdfMoviment: async () => {

    const response = await fetch(
        `${BASE_URL}/moviments/pdf`
    );

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'movimentacoes.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },


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