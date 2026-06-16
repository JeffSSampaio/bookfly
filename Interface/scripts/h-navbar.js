
var loggedUserRaw = sessionStorage.getItem('loggedUser');
if (!loggedUserRaw) {
  window.location.replace('/Interface/pages/login.html');
}
var loggedUser = JSON.parse(loggedUserRaw);

window.btnMenu = function(){
const menu = document.getElementById("icon-menu")
const navbar= document.getElementById("h-navbar-right")
const closeBtn = document.getElementById("close-menu");
const overlay = document.getElementById("overlay");

  if (menu && navbar) {
    menu.addEventListener("click", () => {
      navbar.classList.toggle("active");
      if (overlay) overlay.classList.toggle("active");
    });
  }

 
  if (closeBtn && navbar) {
    closeBtn.addEventListener("click", () => {
      navbar.classList.remove("active");
      if (overlay) overlay.classList.remove("active");
    });
  }
}

window.logout = function() {
  sessionStorage.removeItem('loggedUser');
  window.location.replace('/Interface/pages/login.html');
}

var userMenuLinks = [ 
    "<a href='../pages/profile.html'>Perfil</a>",
    "<a href='../pages/homepage.html'>Home</a>",
    // "<a href='../pages/my-books.html'>Minhas Estantes</a>",
    "<a href='../pages/bookloan.html'>Livros</a>",
   

]

var adminMenuLinks =[
    "<a href='../pages/LoansAndFines.html'>Emprestimos</a>",
    // "<a href='../pages/books.html'>Livros</a>",
    "<a href='../pages/StockandBooks.html'>Estoque</a>",
    // "<a href='../pages/fines.html'>Multas</a>",
    loggedUser.role == 'ADMIN'? "<a href='../pages/users.html'>Usuários</a>"  : '',
    "<a href='../pages/movements.html'>Movimentações</a>"
  
]

const currentPath = window.location.pathname.replace(/\\/g, '/');
const currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1);

function shouldShowLink(linkHtml) {
  const match = linkHtml.match(/href=['"]([^'"]+)['"]/);
  if (!match) return true;
  const href = match[1];
  return !href.endsWith(currentPage);
}

let content = document.getElementById("menu-content");

let linksToRender = [];

switch (loggedUser.role) {
  case 'USER':
    linksToRender = userMenuLinks;
    break;
  case 'ADMIN':
    linksToRender = adminMenuLinks;
    break;
  case 'BIBLIOTECARIO':
    linksToRender = adminMenuLinks;
    break;
  default:
    alert('Usuário não reconhecido');
    break;
}

linksToRender.forEach(element => {
  if (!shouldShowLink(element)) return;
  content.innerHTML += ` 
    <div class='btns-menu'>
      ${element}
    </div>`;
});

content.innerHTML += `
  <div class='btns-menu logout-container'>
    <a class='log' href='#' onclick='logout()'>Desconectar</a>
  </div>
`;

// if(loggedUser.role == 'USER'){
//     userMenuLinks.forEach(element => {
//         if (!shouldShowLink(element)) return;
//         content.innerHTML += ` 
//         <div class='btns-menu'>
//           ${element}
//         </div>`;
//     });
// } else if(loggedUser.role == 'ADMIN'){
//     adminMenuLinks.forEach(element => {
//         if (!shouldShowLink(element)) return;
//         content.innerHTML += ` 
//         <div class='btns-menu'>
//           ${element}
//         </div>`;
//     });
// } else {
//     alert('Usuário não reconhecido');
// }





 