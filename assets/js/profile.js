// DOM Elements
const updateProfileBtn = document.getElementById('update-profile-btn');
const updateProfileModal = document.getElementById('update-profile-modal');
const closeModalBtns = document.querySelectorAll('.close-modal');
const saveProfileBtn = document.getElementById('save-profile-btn');
const createPostInput = document.getElementById('create-post-input');
const createPostModal = document.getElementById('create-post-modal');
const publishPostBtn = document.getElementById('publish-post-btn');
const postsContainer = document.getElementById('posts-container');

// Functions to open/close modals
function openModal(modal) {
    modal.style.display = 'flex';
}

function closeModal(modal) {
    modal.style.display = 'none';
}

// Event listeners
updateProfileBtn.addEventListener('click', () => {
    openModal(updateProfileModal);
});

createPostInput.addEventListener('click', () => {
    openModal(createPostModal);
});

closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const modal = btn.closest('.modal');
        closeModal(modal);
    });
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        closeModal(e.target);
    }
});

// Function to load profile data
async function loadProfileData() {
    try {
        const response = await fetch('api/profile.php');
        const data = await response.json();
        
        if (data.success) {
            updateProfileUI(data.user);
        } else {
            console.error('Erreur de chargement du profil:', data.message);
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Function to update profile UI
function updateProfileUI(user) {
    document.querySelector('.profile-name').textContent = `${user.firstname} ${user.lastname}`;
    document.querySelector('.friend-count').textContent = `${user.friend_count || 0} amis`;
    document.getElementById('firstname').value = user.firstname;
    document.getElementById('lastname').value = user.lastname;
    document.getElementById('birthdate').value = user.birthdate || '';
    document.getElementById('city').value = user.city || '';
    document.getElementById('profession').value = user.profession || '';
    document.getElementById('relationship-status').value = user.relationship_status || '';
    document.getElementById('bio').value = user.bio || '';
}

// Function to load posts
async function loadPosts() {
    try {
        const response = await fetch('api/profile.php?posts=true');
        const data = await response.json();
        
        if (data.success) {
            renderPosts(data.posts);
        } else {
            console.error('Erreur de chargement des publications:', data.message);
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Function to render posts
function renderPosts(posts) {
    postsContainer.innerHTML = '';
    
    if (posts.length === 0) {
        postsContainer.innerHTML = '<div class="post"><div class="post-content"><p>Aucune publication pour le moment</p></div></div>';
        return;
    }
    
    posts.forEach(post => {
        const postElement = createPostElement(post);
        postsContainer.appendChild(postElement);
    });
}

// Function to create a post element
function createPostElement(post) {
    const postDate = new Date(post.created_at);
    const formattedDate = postDate.toLocaleDateString('fr-FR', {
        day: 'numeric', 
        month: 'long', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    return `
        <div class="post">
            <div class="post-header">
                <div class="post-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="post-user-info">
                    <div class="post-username">${post.firstname} ${post.lastname}</div>
                    <div class="post-time">
                        ${formattedDate}
                        <i class="fas fa-globe-europe"></i>
                    </div>
                </div>
            </div>
            <div class="post-content">
                <p class="post-text">${post.content}</p>
            </div>
            <div class="post-actions">
                <div class="action-btn">
                    <i class="far fa-thumbs-up"></i> J'aime
                </div>
                <div class="action-btn">
                    <i class="far fa-comment"></i> Commenter
                </div>
                <div class="action-btn">
                    <i class="far fa-share-square"></i> Partager
                </div>
            </div>
        </div>
    `;
}

// Function to update profile
async function updateProfile() {
    const formData = {
        firstname: document.getElementById('firstname').value,
        lastname: document.getElementById('lastname').value,
        birthdate: document.getElementById('birthdate').value,
        city: document.getElementById('city').value,
        profession: document.getElementById('profession').value,
        relationship_status: document.getElementById('relationship-status').value,
        bio: document.getElementById('bio').value,
        current_password: document.getElementById('current-password').value
    };
    
    try {
        const response = await fetch('api/update_profile.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
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

// Function to create a post
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

// Event listeners for saving and publishing
saveProfileBtn.addEventListener('click', updateProfile);
publishPostBtn.addEventListener('click', createPost);

// Load data on page load
document.addEventListener('DOMContentLoaded', () => {
    loadProfileData();
    loadPosts();
});