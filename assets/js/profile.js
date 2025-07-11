// profile.js - Version adaptée pour la nouvelle structure HTML

document.addEventListener('DOMContentLoaded', function() {
    // Chargement initial des données
    loadProfileData();
    
    // Gestionnaires d'événements
    document.querySelector('.btn-secondary').addEventListener('click', showPasswordModal);
    document.getElementById('cancelPassword').addEventListener('click', hidePasswordModal);
    document.getElementById('confirmPassword').addEventListener('click', verifyPassword);
    document.getElementById('profileForm').addEventListener('submit', updateProfile);
});

// Charger les données du profil
async function loadProfileData() {
    try {
        showLoader();
        
        const response = await fetch('../api/get_profile.php');
        if (!response.ok) throw new Error('Erreur réseau');
        
        const data = await response.json();
        
        // Mise à jour de l'UI
        updateProfileUI(data);
        
    } catch (error) {
        console.error('Erreur:', error);
        showError('Échec du chargement du profil');
    } finally {
        hideLoader();
    }
}

// Mettre à jour l'interface
function updateProfileUI(profileData) {
    // Infos de base
    if (profileData.firstname || profileData.lastname) {
        document.getElementById('profileName').textContent = 
            `${profileData.firstname} ${profileData.lastname}`;
    }
    
    // Photo de profil
    if (profileData.profile_pic) {
        const img = document.getElementById('profileImage');
        img.src = profileData.profile_pic;
        img.style.display = 'block';
        document.getElementById('profileIcon').style.display = 'none';
    }
    
    // Détails du profil
    const detailsContainer = document.getElementById('profileDetails');
    detailsContainer.innerHTML = generateProfileDetailsHTML(profileData);
}

// Générer le HTML des détails
function generateProfileDetailsHTML(profileData) {
    return `
        ${profileData.bio ? `
        <div class="detail-item">
            <div class="detail-icon"><i class="fas fa-pen"></i></div>
            <span>${profileData.bio}</span>
        </div>` : ''}
        
        ${profileData.education ? `
        <div class="detail-item">
            <div class="detail-icon"><i class="fas fa-graduation-cap"></i></div>
            <span>${profileData.education}</span>
        </div>` : ''}
        
        ${profileData.location ? `
        <div class="detail-item">
            <div class="detail-icon"><i class="fas fa-home"></i></div>
            <span>Habite à ${profileData.location}</span>
        </div>` : ''}
        
        ${profileData.relationship_status ? `
        <div class="detail-item">
            <div class="detail-icon"><i class="fas fa-heart"></i></div>
            <span>${profileData.relationship_status}</span>
        </div>` : ''}
        
        <div class="edit-info" id="editDetailsBtn">
            <i class="fas fa-pencil-alt"></i>
            <span>Modifier les infos</span>
        </div>
    `;
}

// Gestion de la modale de mot de passe
function showPasswordModal() {
    document.getElementById('passwordModal').style.display = 'flex';
    document.getElementById('passwordInput').focus();
}

function hidePasswordModal() {
    document.getElementById('passwordModal').style.display = 'none';
    document.getElementById('passwordInput').value = '';
}

// Vérification du mot de passe
async function verifyPassword() {
    const password = document.getElementById('passwordInput').value.trim();
    if (!password) return;
    
    try {
        const response = await fetch('../api/verify_password.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            hidePasswordModal();
            showEditModal();
        } else {
            alert('Mot de passe incorrect');
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur de vérification');
    }
}

// Gestion de la modale d'édition
function showEditModal() {
    // Charger les données actuelles dans le formulaire
    loadCurrentProfileData();
    document.getElementById('editProfileModal').style.display = 'flex';
}

async function loadCurrentProfileData() {
    const response = await fetch('../api/get_profile.php');
    const data = await response.json();
    
    document.getElementById('editFirstname').value = data.firstname || '';
    document.getElementById('editLastname').value = data.lastname || '';
    document.getElementById('editBio').value = data.bio || '';
    // ... autres champs
}

// Mise à jour du profil
async function updateProfile(e) {
    e.preventDefault();
    
    const formData = {
        firstname: document.getElementById('editFirstname').value.trim(),
        lastname: document.getElementById('editLastname').value.trim(),
        bio: document.getElementById('editBio').value.trim(),
        // ... autres champs
    };
    
    try {
        const response = await fetch('../api/update_profile.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('editProfileModal').style.display = 'none';
            loadProfileData(); // Recharger les données
            alert('Profil mis à jour avec succès');
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Échec de la mise à jour');
    }
}

// Utilitaires
function showLoader() {
    document.getElementById('loader').style.display = 'block';
}

function hideLoader() {
    document.getElementById('loader').style.display = 'none';
}

function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => errorDiv.style.display = 'none', 5000);
}