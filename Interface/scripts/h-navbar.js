

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
var buttonsProfile = [ 
    "<a href='../pages/perfil.html'>Perfil</a>",
    "<a href='../pages/a-homepage.html'>HomePage</a>",
    "<a href='../pages/meus-livros.html'>Minhas Estantes</a>",
    "<a href='../pages/login.html'>Desconectar</a>",

]

var buttonAdmin =[
    "<a href='../pages/emprestimo.html'>Emprestimo</a>",
    "<a href='../pages/estoque.html'>Estoque</a>",
    "<a href='../pages/multas.html'>Multas</a>",
    "<a href='../pages/movimentacoes.html'>Movimentações</a>",
    "<a href='../pages/login.html'>Desconectar</a>",
]



 var page = new URL(window.location.href)

 if (page.pathname == '/Interface/pages/homepage.html') {
    var index = buttonsProfile.indexOf("<a href='../pages/homepage.html'>HomePage</a>")
    buttonsProfile.splice(index,1)
 };

if (page.pathname == '/Interface/pages/emprestimo.html') {
    index = buttonsProfile.indexOf("<a href='../pages/emprestimo.html'>Emprestimo</a>")

 };


content = document.getElementById("menu-content")


if(page.pathname == '/Interface/pages/homepage.html' || page.pathname == '/Interface/pages/perfil.html' || page.pathname == '/Interface/pages/meus-livros.html'){

    
    buttonsProfile.forEach(element => {
        
       
        content.innerHTML+=
        ` 
        <div class='btns-menu'>
        ${element}
        </div>
        `
        
    });
    } else{
        
        buttonAdmin.forEach(element=>{
    
            content.innerHTML+=
             ` 
            <div class='btns-menu'>
                ${element}
                    </div>
    `
        })
    }





 