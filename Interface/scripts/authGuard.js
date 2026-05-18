(function() {
  const publicPages = ['/Interface/pages/login.html', '/Interface/pages/register.html'];
  const userPages = [
    '/Interface/pages/homepage.html',
    '/Interface/pages/my-books.html',
    '/Interface/pages/bookloan.html',
    '/Interface/pages/profile.html',
    '/Interface/pages/livro.html'
  ];
  const adminPages = [
    '/Interface/pages/loans.html',
    '/Interface/pages/stock.html',
    '/Interface/pages/fines.html',
    '/Interface/pages/movements.html'
  ];

  const path = window.location.pathname.replace(/\\/g, '/');
  const page = publicPages.concat(userPages, adminPages).find(p => path.endsWith(p)) || path;
  const loggedUser = sessionStorage.getItem('loggedUser');

  const redirectToLoginPage = () => window.location.replace('/Interface/pages/login.html');
  const redirectToUserHomePage = () => window.location.replace('/Interface/pages/homepage.html');
  const redirectToAdminHomePage = () => window.location.replace('/Interface/pages/StockandBooks.html');

  if (!loggedUser) {
    if (!publicPages.some(p => path.endsWith(p))) {
      redirectToLoginPage();
    }
    return;
  }

  const user = JSON.parse(loggedUser);
  const role = user.role || 'USER';

  if (publicPages.some(p => path.endsWith(p))) {
    if (role === 'ADMIN') {
      redirectToAdminHomePage();
    } else {
      redirectToUserHomePage();
    }
    return;
  }

  if (userPages.some(p => path.endsWith(p)) && role !== 'USER') {
    redirectToAdminHomePage();
    return;
  }

  if (adminPages.some(p => path.endsWith(p)) && role !== 'ADMIN') {
    redirectToUserHomePage();
    return;
  }
})();
