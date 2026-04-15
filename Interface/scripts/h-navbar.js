

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
var buttons = [ 
    "<a href='../pages/perfil.html'>Perfil</a>",
    "<a href='../pages/homepage.html'>HomePage</a>",
    "<a href='../pages/meus-livros.html'>Minhas Estantes</a>",
    "<a href='../pages/login.html'>Desconectar</a>",

]



 var page = new URL(window.location.href)

 if (page.pathname == '/Interface/pages/homepage.html') {
    var index = buttons.indexOf("<a href='../pages/homepage.html'>HomePage</a>")
    buttons.splice(index,1)
 };



content = document.getElementById("menu-content")

buttons.forEach(element => {
    
    content.innerHTML+=
    ` 
    <div class='btns-menu'>
    ${element}
    </div>
    `

});