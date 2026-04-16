function modalForm({ titulo, campos = [], onSubmit }) {

    let htmlContent = "";

    campos.forEach(campo => {
        htmlContent += `
        <div class="f-input-modal">
            <label>${campo.label}</label>
            <input type="${campo.type}" name="${campo.name}" />
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



      function closeModal(){
    const modal = document.getElementById("modal");
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
        }
    });
}
