    //document.addEventListener('DOMContentLoaded', () => {
        const updateProfileBtn = document.getElementById('update-profile-btn');
        const updateProfileModal = document.getElementById('update-profile-modal');
        const closeModalBtns = document.querySelectorAll('.close-modal');
        const saveProfileBtn = document.getElementById('save-profile-btn');
        const createPostInput = document.getElementById('create-post-input');
        const createPostModal = document.getElementById('create-post-modal');
        const publishPostBtn = document.getElementById('publish-post-btn');
        const postsContainer = document.getElementById('posts-container');
        const editCoverBtn = document.getElementById('edit-cover-btn');
        const editAvatarBtn = document.getElementById('edit-avatar-btn');
    
        const profileData = JSON.parse(localStorage.getItem('profileData')) || {};
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        const contacts = [
            { name: 'Jean Dupont', online: true },
            { name: 'Marie Leclerc', online: false },
            { name: 'Pierre Martin', online: true }
        ];
        function openModal(modal) {
            modal.classList.add('active');
        }
    
        function closeModal(modal) {
            modal.classList.remove('active');
        }
    
        updateProfileBtn.addEventListener('click', () => {
            openModal(document.getElementById('password-modal'));
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
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                closeModal(e.target);
            }
        });
    
        async function checkAuth() {
            const token = localStorage.getItem('token');
            if (!token) {
                navigateTo('/login');
                return false;
            }
            try {
                const response = await fetch(`${API_URL}/home.php`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (response.ok && data.status === 'success') {
                    return true;
                } else {
                    localStorage.removeItem('token');
                    navigateTo('/login');
                    return false;
                }
            } catch (error) {
                console.error('Erreur lors de l\'authentification:', error);
                localStorage.removeItem('token');
                navigateTo('/login');
                return false;
            }
        }
        
        async function loadProfileData() {
            const isAuthenticated = await checkAuth();
            if (!isAuthenticated) return;
            try {
                const response = await fetch('https://socialconnect-94gz.onrender.com/api/profile.php', {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Authorization': `Bearer ${getToken()}`,
                        'Accept': 'application/json'
                    }
                });
                const data = await response.json();
                console.log('Réponse de /api/profile.php:', JSON.stringify(data, null, 2)); // Débogage
                if (data.status === 'success' && data.user) {
                    updateProfileUI(data.user);
                    profileData = data.user;
                    localStorage.setItem('profileData', JSON.stringify(profileData));
                } else {
                    console.error('Erreur de chargement du profil:', data.message);
                }
            } catch (error) {
                console.error('Erreur:', error);
            }
        }
    
        function updateProfileUI(user) {
            if (!user) {
                console.error('Aucun utilisateur fourni pour updateProfileUI');
                return;
            }
            const profileName = document.querySelector('.profile-name');
            if (profileName) {
                profileName.textContent = `${user.firstname || ''} ${user.lastname || ''}`;
            } else {
                console.warn('Élément .profile-name introuvable');
            }
            const friendCount = document.querySelector('.friend-count');
            if (friendCount) {
                friendCount.textContent = `${user.friend_count || 0} amis`;
            } else {
                console.warn('Élément .friend-count introuvable');
            }
            const fields = [
                { id: 'first-name', value: user.firstname, isInput: true },
                { id: 'last-name', value: user.lastname, isInput: true },
                { id: 'username', value: user.username, isInput: true },
                { id: 'birthdate', value: user.birthdate, isInput: true },
                { id: 'city', value: user.city, isInput: true },
                { id: 'profession', value: user.profession, isInput: true },
                { id: 'relationship-status', value: user.relationship_status, isInput: true },
                { id: 'bio', value: user.bio, isInput: true },
                { id: 'sidebar-username', value: user.username, isInput: false },
                { id: 'post-username', value: user.username || 'Utilisateur', isInput: false },
                { id: 'birthdate-text', value: user.birthdate, isInput: false }, // ID unique
                { id: 'city-text', value: user.city, isInput: false }, // ID unique
                { id: 'profession-text', value: user.profession, isInput: false }, // ID unique
                { id: 'relationship-text', value: user.relationship_status, isInput: false } // ID unique
            ];
            fields.forEach(field => {
                const element = document.getElementById(field.id);
                if (element) {
                    if (field.isInput) {
                        element.value = field.value || '';
                    } else {
                        element.textContent = field.value || '';
                    }
                } else {
                    console.warn(`Élément ${field.id} introuvable`);
                }
            });
        
            if (user.avatar_url) {
                const elements = [
                    { id: 'profile-picture', html: `<img src="${user.avatar_url}" alt="Profile Picture">` },
                    { id: 'create-post-avatar', html: `<img src="${user.avatar_url}" alt="Avatar">` },
                    { id: 'post-avatar', html: `<img src="${user.avatar_url}" alt="Avatar">` },
                    { id: 'header-profile-icon', html: `<img src="${user.avatar_url}" alt="Profile Icon">` }
                ];
                elements.forEach(el => {
                    const element = document.getElementById(el.id);
                    if (element) {
                        element.innerHTML = el.html;
                    }
                });
            }
        
            const coverPhoto = document.getElementById('cover-photo');
            if (coverPhoto && user.cover_url) {
                coverPhoto.style.backgroundImage = `url(${user.cover_url})`;
            }
        
            const interestsContainer = document.getElementById('profile-interests');
            if (interestsContainer && user.interests) {
                interestsContainer.innerHTML = user.interests
                    .split(',')
                    .map(tag => tag.trim())
                    .map(tag => `<span class="tag">${tag}</span>`)
                    .join('');
            }
        
            const profilePicPreview = document.getElementById('profile-pic-preview');
            if (profilePicPreview && user.avatar_url) {
                profilePicPreview.src = user.avatar_url;
            }
        
            const coverPicPreview = document.getElementById('cover-pic-preview');
            if (coverPicPreview && user.cover_url) {
                coverPicPreview.src = user.cover_url;
            }
        }
    
        async function loadPosts() {
            try {
                const response = await fetch('https://socialconnect-94gz.onrender.com/api/profile.php?posts=true', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${getToken()}`
                    }
                });
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
    
        function renderPosts(postsData) {
            postsContainer.innerHTML = '';
            if (postsData.length === 0) {
                postsContainer.innerHTML = '<div class="post"><div class="post-content"><p>Aucune publication pour le moment</p></div></div>';
                return;
            }
            postsData.forEach(post => {
                const postElement = createPostElement(post);
                postsContainer.appendChild(postElement);
            });
        }
    
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
                <div class="post" data-post-id="${post.id}">
                    <div class="post-header">
                        <div class="post-avatar">
                            ${profileData.avatar_url ? `<img src="${profileData.avatar_url}" alt="Avatar">` : '<i class="fas fa-user"></i>'}
                        </div>
                        <div class="post-user">
                            <h4>${post.firstname || profileData.username || 'Utilisateur'} ${post.lastname || ''}</h4>
                            <p>${formattedDate} <i class="fas fa-globe-europe"></i></p>
                        </div>
                    </div>
                    <div class="post-content">
                        <p class="post-text">${post.content}</p>
                        ${post.media_url ? `<img src="${post.media_url}" class="post-image" alt="Post Media">` : ''}
                    </div>
                    <div class="post-actions">
                        <div class="action-btn like-btn" data-post-id="${post.id}">
                            <i class="far fa-thumbs-up"></i> J'aime <span class="like-count">${post.likes || 0}</span>
                        </div>
                        <div class="action-btn comment-btn" data-post-id="${post.id}">
                            <i class="far fa-comment"></i> Commenter
                        </div>
                        <div class="action-btn share-btn" data-post-id="${post.id}">
                            <i class="far fa-share-square"></i> Partager
                        </div>
                    </div>
                    <div class="comments-section" data-post-id="${post.id}" style="display: none;">
                        <div class="comments-list"></div>
                        <div class="comment-form">
                            <input type="text" class="comment-input" placeholder="Écrire un commentaire...">
                            <button class="submit-comment-btn" data-post-id="${post.id}">Envoyer</button>
                        </div>
                    </div>
                </div>
            `;
        }
    
        async function loadComments(postId) {
            try {
                const response = await fetch('https://socialconnect-94gz.onrender.com/api/profile.php?comments=true&post_id=${postId}');
                const data = await response.json();
                if (data.success) {
                    renderComments(postId, data.comments);
                }
            } catch (error) {
                console.error('Erreur:', error);
            }
        }
    
        function renderComments(postId, comments) {
            const commentsList = document.querySelector(`.comments-section[data-post-id="${postId}"] .comments-list`);
            commentsList.innerHTML = '';
            comments.forEach(comment => {
                const commentDate = new Date(comment.created_at);
                const formattedDate = commentDate.toLocaleDateString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit'
                });
                commentsList.innerHTML += `
                    <div class="comment" data-comment-id="${comment.id}">
                        <div class="comment-content">${comment.content}</div>
                        <div class="comment-actions">
                            <span class="comment-date">${formattedDate}</span>
                            <button class="like-comment-btn" data-comment-id="${comment.id}"><i class="far fa-thumbs-up"></i> (${comment.likes || 0})</button>
                            <button class="reply-btn" data-comment-id="${comment.id}">Répondre</button>
                        </div>
                        <div class="replies" data-comment-id="${comment.id}"></div>
                    </div>
                `;
            });
        }
    
        async function updateProfile() {
           // e.preventDefault();
            if (!validateForm()) return;
    
            const saveBtn = document.getElementById('save-profile-btn');
            saveBtn.classList.add('is-loading');
    
            const formData = new FormData();
            formData.append('firstname', document.getElementById('first-name').value.trim());
            formData.append('lastname', document.getElementById('last-name').value.trim());
            formData.append('username', document.getElementById('username').value.trim());
            formData.append('birthdate', document.getElementById('birthdate').value);
            formData.append('city', document.getElementById('city').value.trim());
            formData.append('profession', document.getElementById('profession').value.trim());
            formData.append('relationship_status', document.getElementById('relationship-status').value);
            formData.append('bio', document.getElementById('bio').value.trim());
            formData.append('interests', document.getElementById('interests').value.trim());
            formData.append('gender', document.getElementById('gender').value);
            formData.append('country', document.getElementById('country').value);
            formData.append('address', document.getElementById('address').value.trim());
            formData.append('current_password', document.getElementById('current-password').value);
            if (document.getElementById('profile-pic').files[0]) {
                formData.append('profile_pic', document.getElementById('profile-pic').files[0]);
            }
            if (document.getElementById('cover-pic').files[0]) {
                formData.append('cover_pic', document.getElementById('cover-pic').files[0]);
            }
    
            try {
                const response = await fetch('https://socialconnect-94gz.onrender.com/api/update_profile.php', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${getToken()}`
                    },
                    body: formData
                });
                const data = await response.json();
                if (data.success) {
                    console.log('Profil mis à jour avec succès!');
                    closeModal(updateProfileModal);
                    profileData.firstName = document.getElementById('first-name').value.trim();
                    profileData.lastName = document.getElementById('last-name').value.trim();
                    profileData.username = document.getElementById('username').value.trim();
                    profileData.birthdate = document.getElementById('birthdate').value;
                    profileData.city = document.getElementById('city').value.trim();
                    profileData.profession = document.getElementById('profession').value.trim();
                    profileData.relationship = document.getElementById('relationship-status').value;
                    profileData.bio = document.getElementById('bio').value.trim();
                    profileData.interests = document.getElementById('interests').value.trim();
                    profileData.gender = document.getElementById('gender').value;
                    profileData.country = document.getElementById('country').value;
                    profileData.address = document.getElementById('address').value.trim();
                    if (document.getElementById('profile-pic').files[0]) {
                        profileData.avatar_url = URL.createObjectURL(document.getElementById('profile-pic').files[0]);
                    }
                    if (document.getElementById('cover-pic').files[0]) {
                        profileData.cover_url = URL.createObjectURL(document.getElementById('cover-pic').files[0]);
                    }
                    localStorage.setItem('profileData', JSON.stringify(profileData));
                    loadProfile();
                    loadProfileData();
                } else {
                    //alert('Erreur: ' + data.message);
                }
            } catch (error) {
                console.error('Erreur:', error);
               // alert('Une erreur est survenue lors de la mise à jour du profil');
            } finally {
                saveBtn.classList.remove('is-loading');
            }
        }
    
        // Fonction pour obtenir le token depuis localStorage
        function getToken() {
            return localStorage.getItem('token');
        }
    
        async function createPost() {
            const content = document.getElementById('post-content').value.trim();
            if (!content) {
                //alert('Veuillez saisir du contenu pour votre publication');
                return;
            }
    
            const formData = new FormData();
            formData.append('content', content);
            if (document.getElementById('post-media').files[0]) {
                formData.append('media', document.getElementById('post-media').files[0]);
            }
    
            try {
                const response = await fetch('https://socialconnect-94gz.onrender.com/api/users/posts.php', {
                    method: 'POST', 
                    headers: {
                        'Authorization': `Bearer ${getToken()}` 
                    },
                    body: formData
                });
                const data = await response.json();
                if (data.success) {
                    closeModal(createPostModal);
                    document.getElementById('post-content').value = '';
                    loadPosts();
                } else {
                    console.log('Erreur: ' + data.message);
                }
            } catch (error) {
                console.error('Erreur:', error);
                console.log('Une erreur est survenue lors de la création de la publication');
            }
        }
    
        saveProfileBtn.addEventListener('click', (e) => {
            e.preventDefault();
            updateProfile();
        });
    
        publishPostBtn.addEventListener('click', (e) => {
            e.preventDefault();
            createPost();
        });
    
        function loadProfile() {
            document.getElementById('profile-name').textContent = profileData.firstName && profileData.lastName
                ? `${profileData.firstName} ${profileData.lastName}`
                : '';
            document.getElementById('sidebar-username').textContent = profileData.username || '';
            document.getElementById('post-username').textContent = profileData.username || 'Utilisateur';
            document.getElementById('birthdate').textContent = profileData.birthdate || '';
            document.getElementById('city').textContent = profileData.city || '';
            document.getElementById('profession').textContent = profileData.profession || '';
            document.getElementById('relationship').textContent = profileData.relationship || '';
            if (profileData.avatar_url) {
                document.getElementById('profile-picture').innerHTML = `<img src="${profileData.avatar_url}" alt="Profile Picture">`;
                document.getElementById('create-post-avatar').innerHTML = `<img src="${profileData.avatar_url}" alt="Avatar">`;
                document.getElementById('post-avatar').innerHTML = `<img src="${profileData.avatar_url}" alt="Avatar">`;
                document.getElementById('header-profile-icon').innerHTML = `<img src="${profileData.avatar_url}" alt="Profile Icon">`;
            }
            if (profileData.cover_url) {
                document.getElementById('cover-photo').style.backgroundImage = `url(${profileData.cover_url})`;
            }
            if (profileData.interests) {
                const interestsContainer = document.getElementById('profile-interests');
                interestsContainer.innerHTML = profileData.interests
                    .split(',')
                    .map(tag => tag.trim())
                    .map(tag => `<span class="tag">${tag}</span>`)
                    .join('');
            }
        }
    
        function loadContacts() {
            const contactsContainer = document.getElementById('contacts-container');
            contactsContainer.innerHTML = contacts.map(contact => `
                <div class="contact-item">
                    <div class="contact-avatar">
                        <i class="fas fa-user"></i>${contact.online ? '<span class="online-status"></span>' : ''}
                    </div>
                    <div class="contact-name">${contact.name}</div>
                </div>
            `).join('');
        }
    
        function loadPostsLocal() {
            postsContainer.innerHTML = posts.map(post => `
                <div class="post animate__animated animate__fadeIn" data-post-id="${post.id || Date.now()}">
                    <div class="post-header">
                        <div class="post-avatar">
                            ${profileData.avatar_url ? `<img src="${profileData.avatar_url}" alt="Avatar">` : '<i class="fas fa-user"></i>'}
                        </div>
                        <div class="post-user">
                            <h4>${profileData.username || 'Utilisateur'}</h4>
                            <p>${new Date(post.timestamp).toLocaleString('fr-FR')}</p>
                        </div>
                    </div>
                    <div class="post-content">
                        <p>${post.content}</p>
                        ${post.media ? `<img src="${post.media}" class="post-image" alt="Post Media">` : ''}
                    </div>
                    <div class="post-actions">
                        <div class="post-action like-btn" data-post-id="${post.id || Date.now()}">
                            <i class="far fa-heart"></i>
                            <span>J'aime</span> <span class="like-count">${post.likes || 0}</span>
                        </div>
                        <div class="post-action comment-btn" data-post-id="${post.id || Date.now()}">
                            <i class="far fa-comment"></i>
                            <span>Commenter</span>
                        </div>
                        <div class="post-action share-btn" data-post-id="${post.id || Date.now()}">
                            <i class="fas fa-share"></i>
                            <span>Partager</span>
                        </div>
                    </div>
                    <div class="comments-section" data-post-id="${post.id || Date.now()}">
                        <div class="comments-list"></div>
                        <div class="comment-form">
                            <input type="text" class="comment-input" placeholder="Écrire un commentaire...">
                            <button class="submit-comment-btn" data-post-id="${post.id || Date.now()}">Envoyer</button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    
        const profilePicInput = document.getElementById('profile-pic');
        const profilePicPreview = document.getElementById('profile-pic-preview');
        const profileFileName = document.querySelector('#update-profile-modal .file-name');
        const profilePicture = document.getElementById('profile-picture');
    
        profilePicInput.addEventListener('change', function() {
            if (profilePicInput.files && profilePicInput.files.length > 0) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    profilePicPreview.src = event.target.result;
                    profilePicPreview.style.display = 'block';
                    profilePicture.innerHTML = `<img src="${event.target.result}" alt="Profile Picture">`;
                    document.getElementById('create-post-avatar').innerHTML = `<img src="${event.target.result}" alt="Avatar">`;
                    document.getElementById('post-avatar').innerHTML = `<img src="${event.target.result}" alt="Avatar">`;
                    document.getElementById('header-profile-icon').innerHTML = `<img src="${event.target.result}" alt="Profile Icon">`;
                };
                reader.readAsDataURL(profilePicInput.files[0]);
                profileFileName.textContent = profilePicInput.files[0].name;
            } else {
                profilePicPreview.style.display = 'none';
                profileFileName.textContent = 'Aucun fichier sélectionné';
                profilePicture.innerHTML = '<i class="fas fa-user"></i>';
                document.getElementById('create-post-avatar').innerHTML = '<i class="fas fa-user"></i>';
                document.getElementById('post-avatar').innerHTML = '<i class="fas fa-user"></i>';
                document.getElementById('header-profile-icon').innerHTML = '<i class="fas fa-user"></i>';
            }
        });
    
        const coverPicInput = document.getElementById('cover-pic');
        const coverFileName = document.querySelector('#update-profile-modal .file-name:last-of-type');
    
        coverPicInput.addEventListener('change', function() {
            if (coverPicInput.files.length > 0) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    document.getElementById('cover-photo').style.backgroundImage = `url(${event.target.result})`;
                };
                reader.readAsDataURL(coverPicInput.files[0]);
                coverFileName.textContent = coverPicInput.files[0].name;
            } else {
                coverFileName.textContent = 'Aucun fichier sélectionné';
            }
        });
    
        const postMediaInput = document.getElementById('post-media');
        const postMediaPreview = document.getElementById('post-media-preview');
        const postFileName = document.querySelector('#create-post-modal .file-name');
    
        postMediaInput.addEventListener('change', function() {
            if (postMediaInput.files.length > 0) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    postMediaPreview.src = event.target.result;
                    postMediaPreview.style.display = 'block';
                };
                reader.readAsDataURL(postMediaInput.files[0]);
                postFileName.textContent = postMediaInput.files[0].name;
            } else {
                postMediaPreview.style.display = 'none';
                postFileName.textContent = 'Aucun fichier sélectionné';
            }
        });
    
        const birthdateInput = document.getElementById('birthdate');
        const ageInput = document.getElementById('age');
    
        birthdateInput.addEventListener('change', function() {
            if (birthdateInput.value) {
                const birthDate = new Date(birthdateInput.value);
                const today = new Date();
                let age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
                ageInput.value = age;
            }
        });
    
        const bioTextarea = document.getElementById('bio');
        const bioCounter = document.getElementById('bio-counter');
    
        bioTextarea.addEventListener('input', function() {
            bioCounter.textContent = bioTextarea.value.length;
        });
    
        function validateForm() {
            let isValid = true;
            const firstName = document.getElementById('first-name').value.trim();
            const lastName = document.getElementById('last-name').value.trim();
            const username = document.getElementById('username').value.trim();
            const birthdate = document.getElementById('birthdate').value;
            const password = document.getElementById('current-password').value;
    
            if (!firstName) {
                document.getElementById('first-name-error').style.display = 'block';
                isValid = false;
            } else {
                document.getElementById('first-name-error').style.display = 'none';
            }
    
            if (!lastName) {
                document.getElementById('last-name-error').style.display = 'block';
                isValid = false;
            } else {
                document.getElementById('last-name-error').style.display = 'none';
            }
    
            if (!username || username.length < 3) {
                document.getElementById('username-error').style.display = 'block';
                isValid = false;
            } else {
                document.getElementById('username-error').style.display = 'none';
            }
    
            if (!birthdate) {
                document.getElementById('birthdate-error').style.display = 'block';
                isValid = false;
            } else {
                document.getElementById('birthdate-error').style.display = 'none';
            }
    
            if (!password) {
                document.getElementById('current-password-error').style.display = 'block';
                isValid = false;
            } else {
                document.getElementById('current-password-error').style.display = 'none';
            }
    
            return isValid;
        }
    
        document.getElementById('verify-password-btn').addEventListener('click', function() {
            const password = document.getElementById('password').value;
            if (password) {
                closeModal(document.getElementById('password-modal'));
                openModal(updateProfileModal);
                document.getElementById('first-name').value = profileData.firstName || '';
                document.getElementById('last-name').value = profileData.lastName || '';
                document.getElementById('username').value = profileData.username || '';
                document.getElementById('birthdate').value = profileData.birthdate || '';
                document.getElementById('age').value = profileData.age || '';
                document.getElementById('gender').value = profileData.gender || '';
                document.getElementById('relationship-status').value = profileData.relationship || '';
                document.getElementById('profession').value = profileData.profession || '';
                document.getElementById('country').value = profileData.country || '';
                document.getElementById('city').value = profileData.city || '';
                document.getElementById('address').value = profileData.address || '';
                document.getElementById('bio').value = profileData.bio || '';
                document.getElementById('interests').value = profileData.interests || '';
                bioCounter.textContent = profileData.bio ? profileData.bio.length : 0;
                if (profileData.avatar_url) {
                    profilePicPreview.src = profileData.avatar_url;
                    profilePicPreview.style.display = 'block';
                    profileFileName.textContent = 'Image chargée';
                }
            } else {
                document.getElementById('password-error').style.display = 'block';
            }
        });
    
        const profileForm = document.getElementById('edit-profile-form');
        profileForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            if (!validateForm()) return;
    
            const saveBtn = document.getElementById('save-profile-btn');
            saveBtn.classList.add('is-loading');
    
            const formData = new FormData();
            formData.append('firstname', document.getElementById('first-name').value.trim());
            formData.append('lastname', document.getElementById('last-name').value.trim());
            formData.append('username', document.getElementById('username').value.trim());
            formData.append('birthdate', document.getElementById('birthdate').value);
            formData.append('age', document.getElementById('age').value);
            formData.append('gender', document.getElementById('gender').value);
            formData.append('relationship_status', document.getElementById('relationship-status').value);
            formData.append('profession', document.getElementById('profession').value.trim());
            formData.append('country', document.getElementById('country').value);
            formData.append('city', document.getElementById('city').value.trim());
            formData.append('address', document.getElementById('address').value.trim());
            formData.append('bio', document.getElementById('bio').value.trim());
            formData.append('interests', document.getElementById('interests').value.trim());
            if (document.getElementById('profile-pic').files[0]) {
                formData.append('profile_pic', document.getElementById('profile-pic').files[0]);
            }
            if (document.getElementById('cover-pic').files[0]) {
                formData.append('cover_pic', document.getElementById('cover-pic').files[0]);
            }
            formData.append('current_password', document.getElementById('current-password').value);
    
            try {
                const response = await fetch('https://socialconnect-94gz.onrender.com/api/update_profile.php', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${getToken()}`
                    },
                    body: formData
                });
                const data = await response.json();
                if (data.status === 'success') {
                    //alert('Profil mis à jour avec succès !');
                    closeModal(updateProfileModal);
                    profileData.firstName = document.getElementById('first-name').value.trim();
                    profileData.lastName = document.getElementById('last-name').value.trim();
                    profileData.username = document.getElementById('username').value.trim();
                    profileData.birthdate = document.getElementById('birthdate').value;
                    profileData.city = document.getElementById('city').value.trim();
                    profileData.profession = document.getElementById('profession').value.trim();
                    profileData.relationship = document.getElementById('relationship-status').value;
                    profileData.bio = document.getElementById('bio').value.trim();
                    profileData.interests = document.getElementById('interests').value.trim();
                    profileData.gender = document.getElementById('gender').value;
                    profileData.country = document.getElementById('country').value;
                    profileData.address = document.getElementById('address').value.trim();
                    if (document.getElementById('profile-pic').files[0]) {
                        profileData.profilePic = URL.createObjectURL(document.getElementById('profile-pic').files[0]);
                    }
                    if (document.getElementById('cover-pic').files[0]) {
                        profileData.coverPic = URL.createObjectURL(document.getElementById('cover-pic').files[0]);
                    }
                    localStorage.setItem('profileData', JSON.stringify(profileData));
                    loadProfile();
                    loadProfileData();
                } else {
                    //alert('Erreur: ' + data.message);
                }
            } catch (error) {
                console.error('Erreur:', error);
                //alert('Une erreur est survenue lors de la mise à jour du profil');
            } finally {
                saveBtn.classList.remove('is-loading');
            }
        });
    
        // Vérification du mot de passe
        document.getElementById('verify-password-btn').addEventListener('click', async function() {
            const password = document.getElementById('password').value;
            if (!password) {
                document.getElementById('password-error').style.display = 'block';
                return;
            }
    
            try {
                const response = await fetch('https://socialconnect-94gz.onrender.com/api/verify_password.php', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getToken()}`
                    },
                    body: JSON.stringify({ password })
                });
                const data = await response.json();
                if (data.status === 'success') {
                    closeModal(document.getElementById('password-modal'));
                    openModal(updateProfileModal);
                    document.getElementById('first-name').value = profileData.firstName || '';
                    document.getElementById('last-name').value = profileData.lastName || '';
                    document.getElementById('username').value = profileData.username || '';
                    document.getElementById('birthdate').value = profileData.birthdate || '';
                    document.getElementById('city').value = profileData.city || '';
                    document.getElementById('profession').value = profileData.profession || '';
                    document.getElementById('relationship-status').value = profileData.relationship_status || '';
                    document.getElementById('bio').value = profileData.bio || '';
                    document.getElementById('interests').value = profileData.interests || '';
                    document.getElementById('gender').value = profileData.gender || '';
                    document.getElementById('country').value = profileData.country || '';
                    document.getElementById('address').value = profileData.address || '';
                    document.getElementById('profile-pic').value = profileData.profilePic || '';
                    document.getElementById('cover-pic').value = profileData.coverPic || '';
                    document.getElementById('current-password').value = profileData.currentPassword || '';
                } else {
                    document.getElementById('password-error').style.display = 'block';
                    document.getElementById('password-error').textContent = data.message;
                }
            } catch (error) {
                console.error('Erreur:', error);
                document.getElementById('password-error').style.display = 'block';
                document.getElementById('password-error').textContent = 'Une erreur est survenue';
            }
        });
    
        publishPostBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const content = document.getElementById('post-content').value.trim();
            if (!content) {
                document.getElementById('post-content-error').style.display = 'block';
                return;
            }
            document.getElementById('post-content-error').style.display = 'none';
    
            const formData = new FormData();
            formData.append('content', content);
            if (document.getElementById('post-media').files[0]) {
                formData.append('media', document.getElementById('post-media').files[0]);
            }
    
            posts.unshift({ content, media: postMediaPreview.src || null, timestamp: new Date().toISOString(), likes: 0, id: Date.now() });
            localStorage.setItem('posts', JSON.stringify(posts));
            loadPostsLocal();
            createPost();
            closeModal(createPostModal);
            document.getElementById('post-content').value = '';
            postMediaPreview.style.display = 'none';
            postFileName.textContent = 'Aucun fichier sélectionné';
        });
    
        editCoverBtn.addEventListener('click', () => coverPicInput.click());
        editAvatarBtn.addEventListener('click', () => profilePicInput.click());
    
        postsContainer.addEventListener('click', async (e) => {
            const postId = e.target.closest('.post')?.dataset.postId;
            if (!postId) return;
    
            if (e.target.classList.contains('like-btn')) {
                await likePost(postId);
            } else if (e.target.classList.contains('comment-btn')) {
                const commentsSection = document.querySelector(`.comments-section[data-post-id="${postId}"]`);
                commentsSection.style.display = commentsSection.style.display === 'block' ? 'none' : 'block';
                if (commentsSection.style.display === 'block') {
                    await loadComments(postId);
                }
            } else if (e.target.classList.contains('share-btn')) {
                sharePost(postId);
            } else if (e.target.classList.contains('submit-comment-btn')) {
                const commentInput = e.target.previousElementSibling;
                await submitComment(postId, commentInput.value);
                commentInput.value = '';
            } else if (e.target.classList.contains('like-comment-btn')) {
                const commentId = e.target.dataset.commentId;
                await likeComment(commentId);
            } else if (e.target.classList.contains('reply-btn')) {
                const commentId = e.target.dataset.commentId;
                await replyToComment(postId, commentId);
            }
        });
    
        async function likePost(postId) {
            try {
                const response = await fetch('https://socialconnect-94gz.onrender.com/api/profile.php?like=true&post_id=${postId}', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${getToken()}`
                    }
                });
                const data = await response.json();
                if (data.success) {
                    const likeCount = document.querySelector(`.like-btn[data-post-id="${postId}"] .like-count`);
                    likeCount.textContent = data.likes;
                    // Mettre à jour localStorage
                    const postIndex = posts.findIndex(p => p.id === parseInt(postId));
                    if (postIndex !== -1) {
                        posts[postIndex].likes = data.likes;
                        localStorage.setItem('posts', JSON.stringify(posts));
                    }
                }
            } catch (error) {
                console.error('Erreur:', error);
            }
        }
    
        async function submitComment(postId, content) {
            if (!content.trim()) return;
            try {
                const response = await fetch('https://socialconnect-94gz.onrender.com/api/profile.php?comment=true', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getToken()}`
                    },
                    body: JSON.stringify({ post_id: postId, content })
                });
                const data = await response.json();
                if (data.success) {
                    await loadComments(postId);
                }
            } catch (error) {
                console.error('Erreur:', error);
            }
        }
    
        async function likeComment(commentId) {
            try {
                const response = await fetch('https://socialconnect-94gz.onrender.com/api/profile.php?like_comment=true&comment_id=${commentId}', {
                    method: 'POST', 
                    headers: {
                        'Authorization': `Bearer ${getToken()}`
                    }
                });
                const data = await response.json();
                if (data.success) {
                    const likeCount = document.querySelector(`.like-comment-btn[data-comment-id="${commentId}"]`);
                    likeCount.innerHTML = `<i class="far fa-thumbs-up"></i> (${data.likes})`;
                }
            } catch (error) {
                console.error('Erreur:', error);
            }
        }
    
        async function replyToComment(postId, commentId) {
            const replyContent = prompt('Répondez au commentaire :');
            if (!replyContent) return;
            try {
                const response = await fetch('https://socialconnect-94gz.onrender.com/api/profile.php?reply=true', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getToken()}`
                    },
                    body: JSON.stringify({ post_id: postId, comment_id: commentId, content: replyContent })
                });
                const data = await response.json();
                if (data.success) {
                    await loadComments(postId);
                }
            } catch (error) {
                console.error('Erreur:', error);
            }
        }
    
        function sharePost(postId) {
            const postUrl = window.location.href + '?post=' + postId;
            navigator.clipboard.writeText(postUrl).then(() => {
                alert('Lien copié : ' + postUrl);
            }).catch(err => {
                console.error('Erreur:', err);
                alert('Échec de la copie du lien');
            });
        }
    
        loadProfile();
        loadContacts();
        loadPostsLocal();
        loadProfileData();
    //});
    