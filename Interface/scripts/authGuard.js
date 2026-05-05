(function() {
  const publicPages = ['/Interface/pages/login.html', '/Interface/pages/cadastro.html'];
  const userPages = [
    '/Interface/pages/homepage.html',
    '/Interface/pages/meus-livros.html',
    '/Interface/pages/bookloan.html',
    '/Interface/pages/perfil.html',
    '/Interface/pages/livro.html'
  ];
  const adminPages = [
    '/Interface/pages/emprestimo.html',
    '/Interface/pages/estoque.html',
    '/Interface/pages/multas.html',
    '/Interface/pages/movimentacoes.html'
  ];

  const path = window.location.pathname.replace(/\\/g, '/');
  const page = publicPages.concat(userPages, adminPages).find(p => path.endsWith(p)) || path;
  const usuarioLogado = sessionStorage.getItem('usuarioLogado');

  const redirectToLogin = () => window.location.replace('/Interface/pages/login.html');
  const redirectToUserHome = () => window.location.replace('/Interface/pages/homepage.html');
  const redirectToAdminHome = () => window.location.replace('/Interface/pages/emprestimo.html');

  if (!usuarioLogado) {
    if (!publicPages.some(p => path.endsWith(p))) {
      redirectToLogin();
    }
    return;
  }

  const user = JSON.parse(usuarioLogado);
  const role = user.role || 'USER';

  if (publicPages.some(p => path.endsWith(p))) {
    if (role === 'ADMIN') {
      redirectToAdminHome();
    } else {
      redirectToUserHome();
    }
    return;
  }

  if (userPages.some(p => path.endsWith(p)) && role !== 'USER') {
    redirectToAdminHome();
    return;
  }

  if (adminPages.some(p => path.endsWith(p)) && role !== 'ADMIN') {
    redirectToUserHome();
    return;
  }
})();
