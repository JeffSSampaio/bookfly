
var usuarioLogadoRaw = sessionStorage.getItem('usuarioLogado');
if (!usuarioLogadoRaw) {
  window.location.replace('/Interface/pages/login.html');
}
var usuarioLogado = JSON.parse(usuarioLogadoRaw);

function btnMenu(){
const menu = document.getElementById("icon-menu")
const navbar= document.getElementById("h-navbar-right")
const closeBtn = document.getElementById("close-menu");
   menu.addEventListener("click", () => {
        navbar.classList.toggle("active");
        overlay.classList.toggle("active");
});

closeBtn.addEventListener("click", () => {
  navbar.classList.remove("active");
  overlay.classList.remove("active");
});

}

function logout() {
  sessionStorage.removeItem('usuarioLogado');
  window.location.replace('/Interface/pages/login.html');
}

var buttonsProfile = [ 
    "<a href='../pages/perfil.html'>Perfil</a>",
    "<a href='../pages/homepage.html'>HomePage</a>",
    "<a href='../pages/meus-livros.html'>Minhas Estantes</a>",
    "<a href='../pages/bookloan.html'>Livros</a>",
    "<a href='#' onclick='logout()'>Desconectar</a>",

]

var buttonAdmin =[
    "<a href='../pages/emprestimo.html'>Emprestimo</a>",
    "<a href='../pages/estoque.html'>Estoque</a>",
    "<a href='../pages/multas.html'>Multas</a>",
    "<a href='../pages/movimentacoes.html'>Movimentações</a>",
    "<a href='#' onclick='logout()'>Desconectar</a>",
]








content = document.getElementById("menu-content")


if(usuarioLogado.role == 'USER'){

    
    buttonsProfile.forEach(element => {
        
       
        content.innerHTML+=
        ` 
        <div class='btns-menu'>
        ${element}
        </div>
        `
        
    });
    } else if(usuarioLogado.role == 'ADMIN'){
        
        buttonAdmin.forEach(element=>{
    
            content.innerHTML+=
             ` 
            <div class='btns-menu'>
                ${element}
                    </div>
    `
        }) 
    }else{
            alert('Usuário não reconhecido')
        }





 