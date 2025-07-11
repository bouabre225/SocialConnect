<<<<<<< HEAD
// Récupération des éléments DOM
const updateProfileBtn = document.getElementById('update-profile-btn');
const updateProfileModal = document.getElementById('update-profile-modal');
const closeModalBtns = document.querySelectorAll('.close-modal');
const saveProfileBtn = document.getElementById('save-profile-btn');
const createPostInput = document.getElementById('create-post-input');
const createPostModal = document.getElementById('create-post-modal');
const publishPostBtn = document.getElementById('publish-post-btn');
const postsContainer = document.getElementById('posts-container');

// Fonction pour charger les données du profilsss
async function loadProfileData() {
    try {
        const response = await fetch('api/profile.php?data=true');
        const data = await response.json();
        
        if (data.success) {
            const user = data.user;
            
            // Mise à jour des informations du profil
            document.getElementById('fullname').textContent = `${user.firstname} ${user.lastname}`;
            document.getElementById('birthdate').textContent = formatDate(user.birthdate);
            document.getElementById('city').textContent = user.city || 'Non spécifié';
            document.getElementById('profession').textContent = user.profession || 'Non spécifié';
            document.getElementById('relationship').textContent = getRelationshipStatus(user.relationship_status);
            document.getElementById('post-count').textContent = user.post_count || '0';
            document.getElementById('friend-count').textContent = user.friend_count || '0';
            document.getElementById('photo-count').textContent = user.photo_count || '0';
            
            // Préremplir le formulaire de mise à jour
            document.getElementById('firstname').value = user.firstname;
            document.getElementById('lastname').value = user.lastname;
            document.getElementById('birthdate-input').value = user.birthdate;
            document.getElementById('city-input').value = user.city || '';
            document.getElementById('profession-input').value = user.profession || '';
            document.getElementById('relationship-input').value = user.relationship_status || '';
            document.getElementById('bio-input').value = user.bio || '';
            
            // Charger les publications
            loadPosts();
        } else {
            console.error('Erreur lors du chargement du profil:', data.message);
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Fonction pour charger les publications
async function loadPosts() {
    try {
        const response = await fetch('api/profile.php?posts=true');
        const data = await response.json();
        
        if (data.success) {
            postsContainer.innerHTML = '';
            
            data.posts.forEach(post => {
                const postElement = createPostElement(post);
                postsContainer.appendChild(postElement);
            });
        } else {
            console.error('Erreur lors du chargement des publications:', data.message);
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Fonction pour créer un élément de publication
function createPostElement(post) {
    const postElement = document.createElement('div');
    postElement.className = 'post';
    
    const postDate = new Date(post.created_at);
    const formattedDate = postDate.toLocaleDateString('fr-FR', {
        day: 'numeric', 
        month: 'long', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    postElement.innerHTML = `
        <div class="post-header">
            <div class="post-avatar"></div>
            <div class="post-user-info">
                <div class="post-username">${post.firstname} ${post.lastname}</div>
                <div class="post-time">${formattedDate}</div>
            </div>
        </div>
        <div class="post-content">
            <p>${post.content}</p>
        </div>
        <div class="post-actions">
            <div class="action-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.77,11h-4.23l1.52-4.94C16.38,5.03,15.54,4,14.38,4c-0.58,0-1.14,0.24-1.52,0.65L7,11H3v10h4h1h9.43 c1.06,0,1.98-0.67,2.19-1.61l1.34-6C21.23,12.15,20.18,11,18.77,11z M7,20H4v-8h3V20z M19.98,13.17l-1.34,6 C18.54,19.65,18.03,20,17.43,20H8v-8.61l5.6-6.06C13.79,5.12,14.08,5,14.38,5c0.26,0,0.5,0.11,0.63,0.3 c0.07,0.1,0.15,0.26,0.09,0.47l-1.52,4.94L13.18,12h1.35h4.23c0.41,0,0.8,0.17,1.03,0.46C19.92,12.61,20.05,12.86,19.98,13.17z"></path>
                </svg>
                <span>J'aime</span>
            </div>
            <div class="action-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 11H6a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1zm9-3h-4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1z"></path>
                    <path d="M22 4h-6a1 1 0 0 0-1 1v5h2V6h4v15h-4v-2h-2v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1z"></path>
                </svg>
                <span>Partager</span>
            </div>
        </div>
    `;
    
    return postElement;
}

// Fonction pour formater la date
function formatDate(dateString) {
    if (!dateString) return 'Non spécifié';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        day: 'numeric', 
        month: 'long', 
        year: 'numeric'
    });
}

// Fonction pour obtenir le statut relationnel en français
function getRelationshipStatus(status) {
    switch(status) {
        case 'single': return 'Célibataire';
        case 'in_relationship': return 'En couple';
        case 'married': return 'Marié(e)';
        case 'complicated': return "C'est compliqué";
        default: return 'Non spécifié';
    }
}

// Fonction pour mettre à jour le profil
async function updateProfile() {
    const formData = {
        firstname: document.getElementById('firstname').value,
        lastname: document.getElementById('lastname').value,
        birthdate: document.getElementById('birthdate-input').value,
        city: document.getElementById('city-input').value,
        profession: document.getElementById('profession-input').value,
        relationship_status: document.getElementById('relationship-input').value,
        bio: document.getElementById('bio-input').value,
        current_password: document.getElementById('current-password').value
    };
    
    try {
        const response = await fetch('api/update_profile.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
=======
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
>>>>>>> ef27a33f333e63b4df057d3a37aec4e4389ba785
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
<<<<<<< HEAD
            alert('Profil mis à jour avec succès!');
            closeModal(updateProfileModal);
            loadProfileData();
        } else {
            alert('Erreur: ' + data.message);
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Une erreur est survenue lors de la mise à jour du profil');
    }
}

// Fonction pour créer une publication
async function createPost() {
    const content = document.getElementById('post-content').value;
    
    if (!content.trim()) {
        alert('Veuillez saisir du contenu pour votre publication');
        return;
    }
    
    try {
        const response = await fetch('api/create_post.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content })
        });
        
        const data = await response.json();
        
        if (data.success) {
            closeModal(createPostModal);
            document.getElementById('post-content').value = '';
            loadPosts();
        } else {
            alert('Erreur: ' + data.message);
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Une erreur est survenue lors de la création de la publication');
    }
}

// Fonction pour fermer les modales
function closeModal(modal) {
    modal.style.display = 'none';
}

// Événements
updateProfileBtn.addEventListener('click', () => {
    updateProfileModal.style.display = 'flex';
});

closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const modal = btn.closest('.modal');
        closeModal(modal);
    });
});

saveProfileBtn.addEventListener('click', updateProfile);

createPostInput.addEventListener('click', () => {
    createPostModal.style.display = 'flex';
});

publishPostBtn.addEventListener('click', createPost);

// Charger les données du profil au chargement de la page
document.addEventListener('DOMContentLoaded', loadProfileData);
=======
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
>>>>>>> ef27a33f333e63b4df057d3a37aec4e4389ba785
