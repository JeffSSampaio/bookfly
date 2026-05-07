
'use strict'

const loggedUserRaw = sessionStorage.getItem('usuarioLogado');
const profileHtml = document.getElementById('profile');

if (!loggedUserRaw || !profileHtml) {
    console.error('Usuário não encontrado ou elemento de perfil ausente');
} else {
    const profile = JSON.parse(loggedUserRaw);

    function renderProfile() {
        profileHtml.innerHTML = `
            <div class="profile-row" data-field="name">
                <div class="profile-info">
                    <span class="profile-label">Nome</span>
                    <span class="profile-value">${profile.name || ''}</span>
                </div>
                <button type="button" class="profile-edit-btn" data-field="name" title="Editar nome">
                    <img src="/Interface/assets/iconEdit.svg" alt="Editar">
                </button>
            </div>
            <div class="profile-row" data-field="email">
                <div class="profile-info">
                    <span class="profile-label">Email</span>
                    <span class="profile-value">${profile.email || ''}</span>
                </div>
                <button type="button" class="profile-edit-btn" data-field="email" title="Editar email">
                    <img src="/Interface/assets/iconEdit.svg" alt="Editar">
                </button>
            </div>
            <div class="profile-row" data-field="password">
                <div class="profile-info">
                    <span class="profile-label">Senha</span>
                    <span class="profile-value">********</span>
                </div>
                <button type="button" class="profile-edit-btn" data-field="password" title="Alterar senha">
                    <img src="/Interface/assets/iconEdit.svg" alt="Editar">
                </button>
            </div>
        `;
    }

    profileHtml.addEventListener('click', async (event) => {
        const editButton = event.target.closest('.profile-edit-btn');
        if (!editButton) return;

        const field = editButton.dataset.field;
        const userId = profile.id;

        if (field === 'name') {
            window.openEditNameProfile(userId);
        } else if (field === 'email') {
            window.openEditEmailProfile(userId);
        } else if (field === 'password') {
            window.openEditPasswordProfile(userId);
        }
    });

    renderProfile();
}




