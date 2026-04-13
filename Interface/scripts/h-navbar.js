

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

buttons = [ 
    "<a href='../pages/perfil.html'>Perfil</a>",
    "<a href='../pages/meus-livros.html'>Meus Livros</a>",
    "<a href='../pages/login.html'>Desconectar</a>",

]

content = document.getElementById("menu-content")

buttons.forEach(element => {
    
    content.innerHTML+=
    ` 
    <div class='btns-menu'>
    ${element}
    </div>
    `

});