

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
    "<a href='../pages/a-homepage.html'>Homepage</a>",
    "<a href='../pages/login.html'>Desconectar</a>",
]



 var page = new URL(window.location.href)

 if (page.pathname == '/Interface/pages/homepage.html') {
    var index = buttonsProfile.indexOf("<a href='../pages/homepage.html'>HomePage</a>")
    buttonsProfile.splice(index,1)
 };

if (page.pathname.substr(-16).includes('/a-homepage.html')) {
    var index = buttonAdmin.indexOf("<a href='../pages/a-homepage.html'>HomePage</a>")
    buttonAdmin.splice(index,0)
 };


content = document.getElementById("menu-content")


if(page.pathname.substr(-16).startsWith("/a-")){

        buttonAdmin.forEach(element=>{

            content.innerHTML+=
             ` 
            <div class='btns-menu'>
                ${element}
                    </div>
    `
        })

    } else{
    buttonsProfile.forEach(element => {
   
   
    content.innerHTML+=
    ` 
    <div class='btns-menu'>
    ${element}
    </div>
    `

});

    }





 