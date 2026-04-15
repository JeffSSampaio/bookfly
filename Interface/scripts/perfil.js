'use strict'




var perfil ={
        'name': 'Jefferson',
        'email':'jeff@gmail.com'
};

var profile = document.getElementById('profile');


profile.innerHTML+=`
    <div>
    <h3>Nome:${perfil.name}</h3>
    <h3> Email:${perfil.email.toLowerCase()}</h3>
    </div>
   
    `;


