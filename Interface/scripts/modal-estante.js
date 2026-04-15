'use strict'

function openModal(){

    const modal = document.querySelector('.modal-bookcase');
     modal.style.display='block';
}

function closeModal(){
      const modal = document.querySelector('.modal-bookcase');
     modal.style.display='none';
}

function confirmModal(){
     
     var bookcase = document.getElementById('bookcase');

     var name_bookcase = document.getElementById('input-bookcase').value;
     closeModal()

     if(name_bookcase != ''){
     bookcase.innerHTML +=  `
     <div class="title-bookase-container">
            <h1>${name_bookcase}</h1>
            <span>  <img src="/Interface/assets/iconAdd.svg" alt=""></span>
            <span>  <img src="/Interface/assets/iconEdit.svg" alt=""></span>
        </div>
     <div class='books-container'>


    </div>
     `
     }

    
    


}