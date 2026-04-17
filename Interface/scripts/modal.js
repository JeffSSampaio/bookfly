

function modalForm({ titulo, campos = [], onSubmit }) {

    let htmlContent = "";

    campos.forEach(campo => {
        htmlContent += `
        <div class="f-input-modal">
            <label for="${campo.name}">${campo.label}</label>
            <input type="${campo.type}" name="${campo.name}" id="${campo.name}" />
        </div>
        `;
    });

    const modalHTML = `
    <div class="modal">
        <div class="c-modal">
            <div class="b-modal">
                <h1>${titulo}</h1>
                <form class="c-modal-form">
                    ${htmlContent}
                </form>
                <div class="c-modal-btn">
                    <button type="button" class="closeBtn">Fechar</button>
                    <button type="button" class="confirmBtn">Confirmar</button>
                </div>
            </div>
        </div>
    </div>
    `;

  
    document.body.insertAdjacentHTML("beforeend", modalHTML);


    const modals = document.querySelectorAll(".modal");
    const modal = modals[modals.length - 1];

    const confirmBtn = modal.querySelector(".confirmBtn");
    const closeBtn = modal.querySelector(".closeBtn");
    const form = modal.querySelector("form");

   
    confirmBtn.addEventListener("click", function () {

        const formData = new FormData(form);
        let dados = {};

        formData.forEach((value, key) => {
            dados[key] = value;
        });

        console.log("Dados capturados:", dados); 

        if (onSubmit) {
            onSubmit(dados);
        }

        modal.remove(); 
    });

   
    closeBtn.addEventListener("click", function () {
        modal.remove();
    });

    
    modal.addEventListener("click", function (e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// modal so que com o style
function modalFormStyle({ titulo, campos = [], onSubmit, styles = {} }) {

    let htmlContent = "";

    campos.forEach(campo => {
        htmlContent += `
        <div class="f-input-modal ${campo.wrapperClass || ""}">
            <label class="${campo.labelClass || ""}">${campo.label}</label>
            <input 
                type="${campo.type}" 
                name="${campo.name}" 
                class="${campo.class || ""}"
            />
        </div>
        `;
    });

    const modalHTML = `
    <div class="modal">
        <div class="c-modal">
            <div class="b-modal">
                <h1>${titulo}</h1>
                <form class="c-modal-form">
                    ${htmlContent}
                </form>
                <div class="c-modal-btn">
                    <button type="button" class="closeBtn">Fechar</button>
                    <button type="button" class="confirmBtn">Confirmar</button>
                </div>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);

    const modals = document.querySelectorAll(".modal");
    const modal = modals[modals.length - 1];

    const confirmBtn = modal.querySelector(".confirmBtn");
    const closeBtn = modal.querySelector(".closeBtn");
    const form = modal.querySelector("form");

  
    applyStyles(styles, modal);

    confirmBtn.addEventListener("click", function () {

        const formData = new FormData(form);
        let dados = {};

        formData.forEach((value, key) => {
            dados[key] = value;
        });

        console.log("Dados capturados:", dados);

        if (onSubmit) {
            onSubmit(dados);
        }

        modal.remove();
    });

    closeBtn.addEventListener("click", function () {
        modal.remove();
    });

    modal.addEventListener("click", function (e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}



function applyStyles(styles, modal) {
    if (!styles) return;

    let css = "";

    Object.keys(styles).forEach(selector => {
        css += `${selector} {`;

        Object.keys(styles[selector]).forEach(prop => {
            css += `${prop}: ${styles[selector][prop]};`;
        });

        css += `}`;
    });

    const styleTag = document.createElement("style");
    styleTag.innerHTML = css;

    modal.appendChild(styleTag);
}


function closeModal(){
    const modals = document.querySelectorAll(".modal");
    const modal = modals[modals.length - 1];

    if(modal){
        modal.remove();
    }
}

function abrirModalCadastro(){
      modalForm({
        titulo: "Cadastro",
        campos: [
            { label: "Nome", type: "text", name: "nome" },
            { label: "Email", type: "email", name: "email" }
        ],
        onSubmit: (dados) => {
            console.log(dados);
            let content = document.getElementById('c-register-books');

        }
    });
}


function abrirModalEstante(){

 modalForm({
        titulo: "Criar Estante",
        campos: [
            { label: "Nome da Estante", type: "text", name: "name" },
            
        ],
        onSubmit: (dado) => {
            console.log(dado);


     var bookcase = document.getElementById('bookcase');

     var name_bookcase = dado.name;

    if (name_bookcase !== '') {
        
                bookcase.innerHTML += `
                <div class="title-bookase-container">
                    <h1>${name_bookcase}</h1>
                    <span> 
                        <img src="/Interface/assets/iconAdd.svg" onClick="abrirModalEstanteAdicao()" alt="Adicionar">
                    </span>
                    <span> 
                        <img src="/Interface/assets/iconEdit.svg" onClick="abrirModalEstanteEdicao('${name_bookcase}')" alt="Editar">
                    </span>
                </div>
                <div class='books-container'></div>
                `;
            }
        }
    });
}

function abrirModalEstanteEdicao(title=String){
modalForm(
    {
        titulo:`Editar Livros de "${title}"`,
        campos:
        [
            {label:'Edição',type:'text',name:'edit'}
        ],
        onSubmit: (dado)=>{
            console.log(dado)
        }
    }
)

}

function abrirModalEstanteAdicao(){
modalForm(
    {
        titulo:'Adicionar Livros ',
        campos:
        [
            {label:'Edição',type:'text',name:'edit'}
        ],
        onSubmit: (dado)=>{
            console.log(dado)
        }
    }
)

}

function abrirModalEmprestimo(){
    modalForm(
        {
            titulo: 'Fazer Emprestimo',
            campos:[
                {label:'Nome do Livro',type:'search', name:'name'}
                ],
                onSubmit: (dado)=>{
                    var container_emprestimo = document.getElementById('emprestimo');
var container_devolucao = document.getElementById('devolucao')

 dado.forEach(element => {
    
    var status = [
        'style="color: blue ;"',
        'style="color: red ;"',
        'style="color: green ;"'    
        
    ] 

        if(element.situation == 'lending' ){


        if(element.status == "Devolvido"){
             container_emprestimo.innerHTML += `
        <div class="c-card-emprestimo">
          <img src=${element.cover}>
          <div class="card-info-text">
          <h1>${element.title.toUpperCase()}</h1>
          <p>${element.author}</p>
          <span ${status[2]} >${element.status}</span>
          </div>
        </div>
        `  
        } else if(element.status == "Em Andamento"){
             container_emprestimo.innerHTML += `
        <div class="c-card-emprestimo">
          <img src=${element.cover}>
          <div class="card-info-text">
          <h1>${element.title.toUpperCase()}</h1>
          <p>${element.author}</p>
          <span ${status[0]} >${element.status}</span>
          </div>
        </div>
        `  
        } else if(element.status =="Devolver"){
             container_emprestimo.innerHTML += `
        <div class="c-card-emprestimo">
          <img src=${element.cover}>
          <div class="card-info-text">
          <h1>${element.title.toUpperCase()}</h1>
          <p>${element.author}</p>
          <span ${status[1]} >${element.status}</span>
          </div>
        </div>
        `  
        } 

          }

            if(element.situation == 'devolution' ){


        if(element.status == "Devolvido"){
             container_devolucao.innerHTML += `
        <div class="c-card-emprestimo">
          <img src=${element.cover}>
          <div class="card-info-text">
          <h1>${element.title.toUpperCase()}</h1>
          <p>${element.author}</p>
          <span ${status[2]} >${element.status}</span>
          </div>
        </div>
        `  
        } else if(element.status == "Em Andamento"){
             container_devolucao.innerHTML += `
        <div class="c-card-emprestimo">
          <img src=${element.cover}>
          <div class="card-info-text">
          <h1>${element.title.toUpperCase()}</h1>
          <p>${element.author}</p>
          <span ${status[0]} >${element.status}</span>
          </div>
        </div>
        `  
        } else if(element.status =="Devolver"){
             container_devolucao.innerHTML += `
        <div class="c-card-emprestimo">
          <img src=${element.cover}>
          <div class="card-info-text">
          <h1>${element.title}</h1>
          <p>${element.author}</p>
          <span ${status[1]} >${element.status}</span>
          </div>
        </div>
        `  
        } 

          }




      
    });

                }
        }
    )

}

function abrirCadastrarLivro(){
    modalForm(
    {
        titulo:'Cadastrar Livros ',
        campos:
        [
            {label:'Titulo',type:'text',name:'titulo'},
            {label:'Capa',type:'text',name:'capa'},
             {label:'Qtd',type:'text',name:'quantidade'}

        ],
        onSubmit: (dado)=>{
            console.log(dado)
            var content = document.getElementById('c-register-books');

                content.innerHTML += `
                <div clas="c-book">
                     <h2>${dado.titulo}</h2>
                     <img src="${dado.capa}" alt="" />
                     <p>Quantidade Disponível: ${dado.quantidade}</p>
                 </div>
                 `;
            

        }
    }
)
}