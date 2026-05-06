
'use strict'

const loggedUser = sessionStorage.getItem('usuarioLogado');


const profile = JSON.parse(loggedUser)


var profileHtml = document.getElementById('profile');

if(profile){

        profileHtml.innerHTML+=`
        <h3 onclick="openEditNameProfile(${profile.id})"> Nome: ${profile.name}</h3>
        <h3 onclick="openEditEmailProfile(${profile.id})" >Email: ${profile.email}</h3> 
        `;
        } else{
                console.error("Usuário não enontrado")
        }




