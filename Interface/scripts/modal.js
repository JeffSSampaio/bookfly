function modalForm({ titulo, campos = [], onSubmit }) {

    let htmlContent = "";

    campos.forEach(campo => {
        htmlContent += `
            <div>
                <label>${campo.label}</label>
                <input type="${campo.type}" name="${campo.name}" />
            </div>
        `;
    });

    const modalHTML = `
    <div class="modal" id="modal">
        <div class="c-modal">
            <div class="b-modal">
                <h1>${titulo}</h1>
                <form class="c-modal-form" id="modalForm">
                    ${htmlContent}
                </form>
                <div class="c-modal-btn">
                    <button onclick="closeModal()">Fechar</button>
                    <button id="confirmBtn">Confirmar</button>
                </div>
            </div>
        </div>
    </div>
    `;
    
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    document.getElementById("confirmBtn").addEventListener("click", function(e){
        e.preventDefault();

        const form = document.getElementById("modalForm");
        const formData = new FormData(form);

        let dados = {};

        formData.forEach((value, key) => {
            dados[key] = value;
        });

        if(onSubmit){
            onSubmit(dados);
        }
    });
}