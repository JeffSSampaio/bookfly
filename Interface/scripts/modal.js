'use scripts'


function modalForm(titulo, content = [], inHtml){

    let htmlContent = "";
        content.forEach(element => {
            
          htmlContent += element;

        })


    return `
    <div class="modal">
        <div class="c-modal">
            <div class="b-modal">
                <h1>${titulo}</h1>
                <form class="c-modal-form" action="" method="post">
                   ${htmlContent}
                </form>
                <div class="c-modal-btn">
                    <button onclick="closeModal()">fechar</button>
                    <button>confirmar</button>
                </div>
            </div>
        </div>

    </div>
    `

}




function openModal(modal,id){

    const modal = document.getElementById(id);
     modal.style.display='block';
}

function closeModal(modal,id){
      const modal = document.querySelector(id);
     modal.style.display='none';
}