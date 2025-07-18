// home.js
(function () {
    //const API_URL = 'https://socialconnect-94gz.onrender.com/users';
    let isCheckingAuth = false;
    let failedAttempts = 0;
    const maxAttempts = 3;
    const DEFAULT_AVATAR = 'https://via.placeholder.com/40'; // Image par défaut

    async function checkAuth() {
        console.log('Démarrage de checkAuth:', new Date().toISOString());
        if (isCheckingAuth) {
            console.log('Authentification déjà en cours, arrêt de la vérification');
            return false;
        }
        isCheckingAuth = true;

        const token = localStorage.getItem('token');
        console.log('Token récupéré:', token || 'Aucun token');
        if (!token) {
            console.log('Aucun token trouvé, redirection vers /login');
            isCheckingAuth = false;
            navigateTo('/login');
            return false;
        }

        try {
            console.log(`Envoi de la requête à ${API_URL}/home.php`);
            const response = await fetch(`${API_URL}/home.php`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Réponse reçue:', response.status, response.statusText);
            const text = await response.text();
            console.log('Contenu brut de la réponse:', text);
            let data;
            try {
                data = JSON.parse(text);
            } catch (jsonError) {
                console.error('Erreur de parsing JSON:', jsonError, 'Contenu brut:', text);
                throw new Error('Réponse du serveur non valide');
            }
            console.log('Données reçues:', data);
            if (response.ok && data.status === 'success') {
                console.log('Utilisateur authentifié:', data);
                isCheckingAuth = false;
                failedAttempts = 0;
                return true;
            } else {
                console.error('Erreur lors de l\'authentification:', data);
                localStorage.removeItem('token');
                isCheckingAuth = false;
                navigateTo('/login');
                return false;
            }
        } catch (error) {
            console.error('Erreur lors de l\'authentification:', error);
            localStorage.removeItem('token');
            isCheckingAuth = false;
            navigateTo('/login');
            return false;
        }
    }

    async function fetchApi(endpoint, method = 'GET', body = null, isFormData = false) {
        /*if (failedAttempts >= maxAttempts) {
            console.error('Nombre maximum de tentatives atteint, redirection vers /login');
            localStorage.removeItem('token');
            navigateTo('/login');
            return null;
        }*/

        const token = localStorage.getItem('token');
        //console.log('Token envoyé dans fetchApi:', token || 'Aucun token');

        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;
        if (body && !isFormData) headers['Content-Type'] = 'application/json';

        const options = {
            method,
            headers,
        };

        if (body) {
            options.body = isFormData ? body : JSON.stringify(body);
        }

        try {
            //console.log(`Requête API vers: ${API_URL}${endpoint}`, options);
            const response = await fetch(`${API_URL}${endpoint}`, options);
            console.log(`Réponse reçue pour ${endpoint}: ${response.status} ${response.statusText}`);
            if (response.status === 401) {
                failedAttempts++;
                console.error(`Erreur 401: Token invalide, tentative ${failedAttempts}/${maxAttempts}`);
                localStorage.removeItem('token');
                navigateTo('/login');
                throw new Error('Token invalide');
            }
            if (!response.ok) {
                failedAttempts++;
                const error = await response.json().catch(() => null);
                console.error('Détails de l\'erreur serveur:', error);
                throw new Error(error?.message || `Erreur HTTP ${response.status}`);
            }
            failedAttempts = 0;
            const text = await response.text();
            //console.log(`Contenu brut pour ${endpoint}:`, text);
            try {
                return JSON.parse(text);
            } catch (jsonError) {
                console.error(`Erreur de parsing JSON pour ${endpoint}:`, jsonError, 'Contenu brut:', text);
                throw new Error('Réponse du serveur non valide');
            }
        } catch (err) {
            console.error(`Erreur sur l'API : ${endpoint}`, err);
            throw err;
        }
    }

    async function fetchContacts() {
        console.log('Démarrage de fetchContacts');
        const contactsList = document.querySelector('.contacts-list');
        if (!contactsList) {
            console.warn('contacts-list introuvable dans le DOM');
            return;
        }
        contactsList.innerHTML = '';
        try {
            const data = await fetchApi('/friends.php?status=accepted');
            console.log('Amis récupérés:', data);
            if (data.status === 'success' && Array.isArray(data.friends)) {
                if (data.friends.length === 0) {
                    contactsList.innerHTML = '<p>Aucun contact disponible</p>';
                } else {
                    data.friends.forEach(contact => {
                        const contactItem = document.createElement('div');
                        contactItem.className = 'contact-item';
                        contactItem.innerHTML = `
                            <div class="position-relative">
                                <img src="${contact.avatar_url || DEFAULT_AVATAR}" 
                                    alt="${contact.full_name || 'Utilisateur'}" class="contact-avatar">
                                ${contact.online ? '<div class="online-status"></div>' : ''}
                            </div>
                            <span class="contact-name">${contact.full_name || 'Utilisateur'}</span>
                        `;
                        contactsList.appendChild(contactItem);
                    });
                }
            } else {
                console.error('Réponse invalide de /friends.php:', data);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des contacts:', error);
        }
    }

    async function fetchSuggestions() {
        console.log('Démarrage de fetchSuggestions');
        const suggestionsList = document.querySelector('.suggestions-list');
        if (!suggestionsList) {
            console.warn('suggestions-list introuvable dans le DOM');
            return;
        }
        suggestionsList.innerHTML = '';
        try {
            const data = await fetchApi('/friends_suggestion.php');
            console.log('Suggestions récupérées:', data);
            if (data.status === 'success' && Array.isArray(data.suggestions)) {
                if (data.suggestions.length === 0) {
                    suggestionsList.innerHTML = '<p>Aucune suggestion disponible</p>';
                } else {
                    data.suggestions.forEach(suggestion => {
                        const suggestionItem = document.createElement('div');
                        suggestionItem.className = 'suggestion-item';
                        suggestionItem.innerHTML = `
                            <div class="suggestion-header">
                                <img src="${suggestion.avatar_url || DEFAULT_AVATAR}" 
                                    alt="${suggestion.full_name || 'Utilisateur'}" class="suggestion-avatar">
                                <div class="suggestion-info">
                                    <div class="suggestion-name">${suggestion.full_name || 'Utilisateur'}</div>
                                    <div class="suggestion-mutuals">${suggestion.mutual_friends || 0} amis en commun</div>
                                </div>
                            </div>
                            <div class="suggestion-actions">
                                <button class="suggestion-btn suggestion-btn-primary" data-id="${suggestion.id}">Ajouter</button>
                                <button class="suggestion-btn suggestion-btn-secondary" data-id="${suggestion.remove_id}">Supprimer</button>
                            </div>
                        `;
                        suggestionsList.appendChild(suggestionItem);
                        suggestionItem.querySelector('.suggestion-btn-primary').addEventListener('click', async () => {
                            try {
                                await fetchApi('/friends.php', 'POST', { friend_id: suggestion.id });
                                suggestionItem.remove();
                            } catch (error) {
                                console.error('Erreur lors de l\'ajout d\'ami:', error);
                            }
                        });
                        suggestionItem.querySelector('.suggestion-btn-secondary').addEventListener('click', async () => {
                            try {
                                await fetchApi('/friends.php', 'DELETE',{ friend_id: suggestion.id});
                                suggestionItem.remove();
                            } catch (error) {
                                console.error('Erreur lors de la suppression d\'ami:', error);
                            }
                        });
                    });
                }
            } else {
                console.error('Réponse invalide de /friends_suggestion.php:', data);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des suggestions:', error);
        }
    }

    async function fetchStories() {
        console.log('Démarrage de fetchStories');
        const storiesScroll = document.querySelector('.stories-scroll');
        if (!storiesScroll) {
            console.warn('stories-scroll introuvable dans le DOM');
            return;
        }
        storiesScroll.innerHTML = '';
        try {
            const data = await fetchApi('/stories.php');
            console.log('Stories récupérées:', data);
            if (data.status === 'success' && Array.isArray(data.stories)) {
                if (data.stories.length === 0) {
                    storiesScroll.innerHTML = '<p>Aucune story disponible</p>';
                } else {
                    const userId = localStorage.getItem('user_id') || data.user?.id;
                    if (!userId) {
                        console.warn('user_id non défini dans localStorage ou dans la réponse');
                    }
                    data.stories.forEach(story => {
                        const storyItem = document.createElement('div');
                        storyItem.className = 'story-item';
                        if (story.user_id === userId) {
                            storyItem.innerHTML = `
                                <div class="story-own story-create-btn" style="cursor:pointer;">
                                    <div class="story-add-btn">
                                        <i class="bi bi-plus"></i>
                                    </div>
                                    <span class="story-own-text">Créer</span>
                                </div>
                            `;
                        } else {
                            storyItem.innerHTML = `
                                <div class="story-other">
                                    ${story.media_type === 'emoji' ? 
                                        `<div class="d-flex align-items-center justify-content-center" style="font-size:2.5rem;">${story.emoji_content || ''}</div>` :
                                        story.media_type === 'video' ?
                                        `<video src="${story.media_url || ''}" controls class="story-image"></video>` :
                                        `<img src="${story.media_url || DEFAULT_AVATAR}" alt="${story.full_name || 'Utilisateur'}" class="story-image">`
                                    }
                                    <img src="${story.avatar_url || DEFAULT_AVATAR}" 
                                        alt="${story.full_name || 'Utilisateur'}" class="story-avatar">
                                    <div class="story-name">${story.full_name?.split(' ')[0] || 'Utilisateur'}</div>
                                </div>
                            `;
                            storyItem.addEventListener('click', async () => {
                                try {
                                    await fetchApi(`/stories/views/${story.story_id}.php`, 'POST');
                                } catch (error) {
                                    console.error('Erreur lors de l\'enregistrement de la vue de story:', error);
                                }
                            });
                        }
                        storiesScroll.appendChild(storyItem);
                    });
                    document.querySelector('.story-create-btn')?.addEventListener('click', showStoryModal);
                }
            } else {
                console.error('Réponse invalide de /stories.php:', data);
                storiesScroll.innerHTML = '<p>Erreur lors du chargement des stories</p>';
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des stories:', error);
            storiesScroll.innerHTML = '<p>Erreur lors du chargement des stories</p>';
        }
    }

    function showStoryModal() {
        console.log('Affichage du modal de story');
        let modal = document.getElementById('storyModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'storyModal';
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100vw';
            modal.style.height = '100vh';
            modal.style.background = 'rgba(0,0,0,0.4)';
            modal.style.display = 'flex';
            modal.style.alignItems = 'center';
            modal.style.justifyContent = 'center';
            modal.style.zIndex = '9999';
            modal.innerHTML = `
                <div style="background:#fff;padding:2rem 1.5rem;border-radius:1rem;min-width:300px;max-width:90vw;box-shadow:0 2px 16px #0002;">
                    <h5>Créer une story</h5>
                    <input type="file" accept="image/*,video/*" class="form-control mb-2" id="storyMediaInput">
                    <input type="text" class="form-control mb-2" id="storyEmojiInput" placeholder="Humeur ou emoji (😊, 😎, etc)">
                    <div class="d-flex gap-2 justify-content-end">
                        <button class="btn btn-secondary btn-sm" id="closeStoryModal">Annuler</button>
                        <button class="btn btn-primary btn-sm" id="addStoryBtn">Ajouter</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        } else {
            modal.style.display = 'flex';
        }
        modal.querySelector('#closeStoryModal').onclick = () => modal.style.display = 'none';
        modal.querySelector('#addStoryBtn').onclick = async () => {
            const mediaInput = modal.querySelector('#storyMediaInput');
            const emojiInput = modal.querySelector('#storyEmojiInput');
            const formData = new FormData();
            if (mediaInput.files[0]) formData.append('media', mediaInput.files[0]);
            if (emojiInput.value.trim()) formData.append('emoji_content', emojiInput.value.trim());

            try {
                await fetchApi('/stories.php', 'POST', formData, true);
                modal.style.display = 'none';
                fetchStories();
            } catch (error) {
                alert('Erreur lors de l\'ajout de la story: ' + error.message);
            }
        };
    }

    async function fetchPosts() {
        console.log('Démarrage de fetchPosts');
        const feedPosts = document.querySelector('.feed-posts');
        if (!feedPosts) {
            console.warn('feed-posts introuvable dans le DOM');
            return;
        }
        feedPosts.innerHTML = '';
        try {
            const data = await fetchApi('/posts.php');
            //console.log('Posts récupérés:', JSON.stringify(data, null, 2));
            if (data.status === 'success' && Array.isArray(data.posts)) {
                if (data.posts.length === 0) {
                    feedPosts.innerHTML = '<p>Aucun post disponible</p>';
                } else {
                    data.posts.forEach(post => {
                        if (!post.id) {
                            console.warn('Post sans post_id:', post);
                            return; // Ignorer les posts sans post_id
                        }

                        if (post.id) {
                            loadComments(post.id);
                        } else {
                            console.error("Post ID manquant:", post);
                        }
                        const postElement = document.createElement('div');
                        postElement.className = 'post-container';
                        postElement.innerHTML = `
                            <div class="post-header">
                                <div class="post-author">
                                    <div class="post-author-info">
                                        <img src="${post.avatar_url || DEFAULT_AVATAR}" 
                                            alt="${post.full_name || 'Utilisateur'}" class="post-avatar">
                                        <div>
                                            <div class="post-author-name">${post.full_name || 'Utilisateur'}</div>
                                            <div class="post-time">${new Date(post.created_at || Date.now()).toLocaleString()}</div>
                                        </div>
                                    </div>
                                    <button class="post-more-btn">
                                        <i class="bi bi-three-dots"></i>
                                    </button>
                                </div>
                                <p class="post-content">${post.content || ''}${post.location_name ? `<br><span style="font-size:0.95em;color:#1877f2;"><i class="bi bi-geo-alt"></i> ${post.location_name}</span>` : ''}</p>
                            </div>
                            ${post.media_url ? 
                                (post.media_type === 'video' ? 
                                    `<video src="${API_URL}${post.media_url}" controls class="post-image"></video>` : 
                                `<img src="${API_URL}${post.media_url}" alt="Post content" class="post-image">`
                                ) : ''
                            }
                            <div class="post-stats">
                                <div class="post-stats-content">
                                    <div class="post-likes">
                                        <div class="post-likes-icons">
                                            <div class="post-like-icon"><i class="bi bi-hand-thumbs-up-fill"></i></div>
                                            <div class="post-like-icon"><i class="bi bi-heart-fill"></i></div>
                                        </div>
                                        <span class="post-likes-count">${post.likes_count || 0}</span>
                                    </div>
                                    <div class="post-comments-share">
                                        <span id="comments-count-${post.id || 0}">${post.comments_count || 0} commentaires</span>
                                        <span>0 partages</span>
                                    </div>
                                </div>
                            </div>
                            <div class="post-actions">
                                <div class="post-action-buttons">
                                    <button class="post-action-btn post-like-btn" data-id="${post.id || 0}">
                                        <i class="bi bi-hand-thumbs-up"></i><span>J'aime</span>
                                    </button>
                                    <button class="post-action-btn post-comment-btn" data-id="${post.id || 0}">
                                        <i class="bi bi-chat-left"></i><span>Commenter</span>
                                    </button>
                                    <button class="post-action-btn"><i class="bi bi-share"></i><span>Partager</span></button>
                                </div>
                            </div>
                            <div class="post-comments-section mt-2 p-2" style="background:#f6f7f9;border-radius:0.5rem;">
                                <div class="comments-list mb-2"></div>
                                <form class="comment-form d-flex align-items-center gap-2" data-id="${post.id || 0}">
                                    <div class="user-avatar-small" style="width:28px;height:28px;"></div>
                                    <input type="text" class="form-control form-control-sm comment-input" placeholder="Écrire un commentaire..." style="background:#fff;border-radius:1rem;">
                                    <button type="submit" class="btn btn-primary btn-sm px-3">Publier</button>
                                </form>
                            </div>
                        `;
                        const likeBtn = postElement.querySelector('.post-like-btn');
                        const likesCount = postElement.querySelector('.post-likes-count');
                        likeBtn.addEventListener('click', async () => {
                            try {
                                const isLiked = likeBtn.classList.contains('liked');
                                await fetchApi('/likes.php', isLiked ? 'DELETE' : 'POST', { post_id: post.id });
                                likeBtn.classList.toggle('liked');
                                likesCount.textContent = isLiked ? parseInt(likesCount.textContent) - 1 : parseInt(likesCount.textContent) + 1;
                            } catch (error) {
                                alert('Erreur lors de la gestion du like: ' + error.message);
                            }
                        });
                        const commentForm = postElement.querySelector('.comment-form');
                        const commentsList = postElement.querySelector('.comments-list');
                        commentForm.addEventListener('submit', async (ev) => {
                            ev.preventDefault();
                            const input = commentForm.querySelector('.comment-input');
                            const content = input.value.trim();
                            if (content) {
                                try {
                                    await fetchApi('/comments.php', 'POST', { post_id: post.id, content });
                                    input.value = '';
                                    loadComments(post.id, commentsList);
                                } catch (error) {
                                    console.error('Erreur lors de l\'ajout de commentaire:', error);
                                }
                            }
                        });
                        async function loadComments(post_id, commentsList) {
                            if (!post_id || isNaN(post_id)) {
                                console.error('post_id is undefined or invalid:', post_id);
                                commentsList.innerHTML = '<p>Erreur : ID de post invalide</p>';
                                return;
                            }
                            try {
                                console.log("postId:", post_id); // Débogage
                                const data = await fetchApi(`/posts_comments.php?post_id=${post_id}`);
                                console.log('Commentaires récupérés pour post', post_id, ':', data);
                                commentsList.innerHTML = '';
                                document.getElementById(`comments-count-${post_id}`).textContent = `${data.comments?.length || 0} commentaires`;
                                if (data.status === 'success' && Array.isArray(data.comments)) {
                                    data.comments.forEach(comment => {
                                        const commentDiv = document.createElement('div');
                                        commentDiv.className = 'comment-item mb-1';
                                        commentDiv.innerHTML = `
                                            <img src="${comment.avatar_url || DEFAULT_AVATAR}" alt="${comment.full_name || 'Utilisateur'}" style="width:28px;height:28px;border-radius:50%;margin-right:8px;">
                                            <span class="fw-bold text-primary">${comment.full_name || 'Utilisateur'} :</span> <span>${comment.content || ''}</span>
                                        `;
                                        commentsList.appendChild(commentDiv);
                                    });
                                }
                            } catch (error) {
                                console.error('Erreur lors de la récupération des commentaires:', error);
                            }
                        }
                        loadComments(post.id, commentsList);
                        feedPosts.appendChild(postElement);
                    });
                }
            } else {
                console.error('Réponse invalide de /posts.php:', data);
                feedPosts.innerHTML = '<p>Erreur lors du chargement des posts</p>';
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des posts:', error);
            feedPosts.innerHTML = '<p>Erreur lors du chargement des posts</p>';
        }
    }

    function setupPublishCreation() {
        console.log('Configuration de setupPublishCreation');
        const createPostForm = document.querySelector('.create-post-container form');
        const postInput = document.querySelector('.post-input');
        if (!createPostForm || !postInput) {
            console.warn('create-post-container form ou post-input introuvable dans le DOM');
            return;
        }

        let selectedPostMediaFile = null;
        let selectedEmoji = '';
        let selectedLocation = '';
        let selectedLatLng = null;

        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.className = 'btn btn-primary btn-sm';
        submitButton.textContent = 'Publier';
        createPostForm.querySelector('.create-post')?.appendChild(submitButton);

        createPostForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Soumission du formulaire de publication');
            const formData = new FormData();
            const content = postInput.value.trim();
            if (content) formData.append('content', content);
            if (selectedEmoji) formData.append('emoji_content', selectedEmoji);
            if (selectedLocation) formData.append('location_name', selectedLocation);
            if (selectedLatLng) {
                formData.append('latitude', selectedLatLng.lat);
                formData.append('longitude', selectedLatLng.lng);
            }
            if (selectedPostMediaFile) formData.append('media', selectedPostMediaFile);

            console.log('Données envoyées à /posts.php:', Object.fromEntries(formData));
            try {
                await fetchApi('/posts.php', 'POST', formData, true);
                postInput.value = '';
                selectedPostMediaFile = null;
                selectedEmoji = '';
                selectedLocation = '';
                selectedLatLng = null;
                document.getElementById('postMediaPreview')?.remove();
                document.getElementById('postEmojiPreview')?.remove();
                document.getElementById('postLocationPreview')?.remove();
                fetchPosts();
            } catch (error) {
                console.error('Erreur lors de la publication:', error);
                alert('Erreur lors de la publication: ' + error.message);
            }
        });

        /* createPostForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Soumission du formulaire de publication');
            const formData = new FormData();
            const content = postInput.value.trim();
            if (!content) {
                alert('Le contenu du post est requis');
                return;
            }
            formData.append('content', content);
            // Ne pas ajouter selectedPostMediaFile pour tester
            console.log('Données envoyées à /posts.php:');
            for (let [key, value] of formData.entries()) {
                console.log(`${key}: ${value instanceof File ? value.name : value}`);
            }
            try {
                await fetchApi('/posts.php', 'POST', formData, true);
                postInput.value = '';
                selectedPostMediaFile = null;
                selectedEmoji = '';
                selectedLocation = '';
                selectedLatLng = null;
                document.getElementById('postMediaPreview')?.remove();
                document.getElementById('postEmojiPreview')?.remove();
                document.getElementById('postLocationPreview')?.remove();
                fetchPosts();
            } catch (error) {
                console.error('Erreur lors de la publication:', error);
                alert('Erreur lors de la publication: ' + error.message);
            }
        });*/

        // Exposer les variables pour les autres fonctions
        window.postCreationState = {
            setMediaFile: (file) => { selectedPostMediaFile = file; },
            setEmoji: (emoji) => { selectedEmoji = emoji; },
            setLocation: (location, latLng) => {
                selectedLocation = location;
                selectedLatLng = latLng;
            }
        };
    }

    function setupPhotoCreation() {
        console.log('Configuration de setupPhotoCreation');
        const photoButton = document.querySelector('.photo-action');
        if (!photoButton) {
            console.warn('photo-action introuvable');
            return;
        }
        photoButton.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Clic sur le bouton photo');
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*,video/*';
            input.onchange = (ev) => {
                const file = ev.target.files[0];
                if (file) {
                    window.postCreationState.setMediaFile(file);
                    let preview = document.getElementById('postMediaPreview');
                    if (!preview) {
                        preview = document.createElement('div');
                        preview.id = 'postMediaPreview';
                        preview.style.margin = '10px 0';
                        document.querySelector('.create-post-container .create-post')?.appendChild(preview);
                    }
                    const url = URL.createObjectURL(file);
                    const isVideo = file.type.startsWith('video');
                    preview.innerHTML = isVideo ? `<video src="${url}" controls style="max-width:100%;max-height:200px;"></video>` : 
                                            `<img src="${url}" style="max-width:100%;max-height:200px;">`;
                }
            };
            input.click();
        });
    }

    function setupEmojiCreation() {
        console.log('Configuration de setupEmojiCreation');
        const feelingButton = document.querySelector('.feeling-action');
        if (!feelingButton) {
            console.warn('Bouton humeur non trouvé');
            return;
        }
        feelingButton.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Clic sur le bouton humeur');
            let modal = document.getElementById('emojiModal');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'emojiModal';
                modal.style.position = 'fixed';
                modal.style.top = '0';
                modal.style.left = '0';
                modal.style.width = '100vw';
                modal.style.height = '100vh';
                modal.style.background = 'rgba(0,0,0,0.4)';
                modal.style.display = 'flex';
                modal.style.alignItems = 'center';
                modal.style.justifyContent = 'center';
                modal.style.zIndex = '9999';
                const emojis = ['😀','😃','😄','😁','😆','😅','😂','😊','😇','🙂','🙃','😉','😍','🥰','😘','😜','🤩','😎','😔','😢','😭','😡','😱','😴','🤒','🤕','🤧','🥳','😇','🤠','😶‍🌫️','😬','🥶','🥵','🤯','😤','😩','😳','🥺','😤','😐','😑','😶'];
                modal.innerHTML = `
                    <div style="background:#fff;padding:2rem 1.5rem;border-radius:1rem;min-width:320px;max-width:95vw;box-shadow:0 2px 16px #0002;">
                        <h5>Choisissez votre humeur</h5>
                        <div style="display:flex;flex-wrap:wrap;gap:8px;max-width:350px;">
                            ${emojis.map(e => `<span class="emoji-choice" style="font-size:2rem;cursor:pointer;">${e}</span>`).join('')}
                        </div>
                        <div class="d-flex gap-2 justify-content-end mt-3">
                            <button class="btn btn-secondary btn-sm" id="closeEmojiModal">Annuler</button>
                        </div>
                    </div>
                `;
                document.body.appendChild(modal);
            } else {
                modal.style.display = 'flex';
            }
            modal.querySelector('#closeEmojiModal').onclick = () => modal.style.display = 'none';
            modal.querySelectorAll('.emoji-choice').forEach(span => {
                span.onclick = () => {
                    window.postCreationState.setEmoji(span.textContent);
                    let emojiPreview = document.getElementById('postEmojiPreview');
                    if (!emojiPreview) {
                        emojiPreview = document.createElement('span');
                        emojiPreview.id = 'postEmojiPreview';
                        emojiPreview.style.fontSize = '2rem';
                        emojiPreview.style.marginLeft = '10px';
                        document.querySelector('.post-input-container')?.appendChild(emojiPreview);
                    }
                    emojiPreview.textContent = span.textContent;
                    modal.style.display = 'none';
                };
            });
        });
    }

    function setupLocationCreation() {
        console.log('Configuration de setupLocationCreation');
        const locationButton = document.querySelector('.location-action');
        if (!locationButton) {
            console.warn('location-action introuvable');
            return;
        }
        locationButton.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Clic sur le bouton lieu');
            let modal = document.getElementById('locationModal');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'locationModal';
                modal.style.position = 'fixed';
                modal.style.top = '0';
                modal.style.left = '0';
                modal.style.width = '100vw';
                modal.style.height = '100vh';
                modal.style.background = 'rgba(0,0,0,0.4)';
                modal.style.display = 'flex';
                modal.style.alignItems = 'center';
                modal.style.justifyContent = 'center';
                modal.style.zIndex = '9999';
                modal.innerHTML = `
                    <div style="background:#fff;padding:1.5rem 1rem;border-radius:1rem;min-width:340px;max-width:98vw;box-shadow:0 2px 16px #0002;">
                        <h5>Choisissez un lieu</h5>
                        <input type="text" class="form-control mb-2" id="locationSearchInput" placeholder="Rechercher un lieu...">
                        <div id="mapContainer" style="width:320px;height:220px;border-radius:0.5rem;overflow:hidden;"></div>
                        <div class="d-flex gap-2 justify-content-end mt-2">
                            <button class="btn btn-secondary btn-sm" id="closeLocationModal">Annuler</button>
                            <button class="btn btn-primary btn-sm" id="addLocationBtn">Ajouter</button>
                        </div>
                    </div>
                `;
                document.body.appendChild(modal);
                if (!document.getElementById('leafletCSS')) {
                    const link = document.createElement('link');
                    link.id = 'leafletCSS';
                    link.rel = 'stylesheet';
                    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                    document.head.appendChild(link);
                }
                if (!window.L) {
                    const script = document.createElement('script');
                    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                    script.onload = initMap;
                    document.body.appendChild(script);
                } else {
                    initMap();
                }
            } else {
                modal.style.display = 'flex';
                initMap();
            }
            function initMap() {
                setTimeout(() => {
                    const mapDiv = document.getElementById('mapContainer');
                    if (!mapDiv) return;
                    mapDiv.innerHTML = '';
                    let map = L.map(mapDiv).setView([5.3599517, -4.0082563], 6);
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '© OpenStreetMap'
                    }).addTo(map);
                    let marker = null;
                    map.on('click', function(e) {
                        if (marker) map.removeLayer(marker);
                        marker = L.marker(e.latlng).addTo(map);
                        window.postCreationState.setLocation('', e.latlng);
                        document.getElementById('locationSearchInput').value = '';
                    });
                    const searchInput = document.getElementById('locationSearchInput');
                    let searchTimeout = null;
                    searchInput.oninput = function() {
                        clearTimeout(searchTimeout);
                        const query = this.value.trim();
                        if (query.length < 3) return;
                        searchTimeout = setTimeout(() => {
                            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
                                .then(r => r.json())
                                .then(results => {
                                    if (results.length > 0) {
                                        const place = results[0];
                                        map.setView([place.lat, place.lon], 13);
                                        if (marker) map.removeLayer(marker);
                                        marker = L.marker([place.lat, place.lon]).addTo(map);
                                        window.postCreationState.setLocation(place.display_name, { lat: parseFloat(place.lat), lng: parseFloat(place.lon) });
                                    }
                                });
                        }, 500);
                    };
                }, 200);
            }
            modal.querySelector('#closeLocationModal').onclick = () => modal.style.display = 'none';
            modal.querySelector('#addLocationBtn').onclick = () => {
                if (window.postCreationState.selectedLatLng) {
                    let locationPreview = document.getElementById('postLocationPreview');
                    if (!locationPreview) {
                        locationPreview = document.createElement('span');
                        locationPreview.id = 'postLocationPreview';
                        locationPreview.style.fontSize = '1rem';
                        locationPreview.style.marginLeft = '10px';
                        document.querySelector('.post-input-container')?.appendChild(locationPreview);
                    }
                    locationPreview.textContent = window.postCreationState.selectedLocation || 
                        `Lat: ${window.postCreationState.selectedLatLng.lat.toFixed(4)}, Lng: ${window.postCreationState.selectedLatLng.lng.toFixed(4)}`;
                }
                modal.style.display = 'none';
            };
        });
    }

    document.getElementById('go-to-chat')?.addEventListener('click', () => {
        console.log('Clic sur le bouton chat, redirection vers /chat');
        navigateTo('/chat');
    });

    document.getElementById('go-to-notifications')?.addEventListener('click', () => {
        console.log('Clic sur le bouton notifications, redirection vers /notifications');
        navigateTo('/notification');
    });

    document.getElementById('go-to-profile')?.addEventListener('click', () => {
        console.log('Clic sur le bouton profile, redirection vers /profile');
        navigateTo('/profile');
    });

    document.getElementById('go-to-settings')?.addEventListener('click', () => {
        console.log('Clic sur le bouton settings, redirection vers /settings');
        navigateTo('/settings');
    });

    document.getElementById('go-to-dashboard')?.addEventListener('click', () => {
        console.log('Clic sur le bouton dashboard, redirection vers /dashboard');
        navigateTo('/admin');
    });

    document.getElementById('go-to-logout')?.addEventListener('click', async () => {
        console.log('Clic sur le bouton logout');
        try {
            const formData = {
                token: localStorage.getItem('token')
            };  
            const response = await fetch('http://localhost:8001/logout.php', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            console.log('Réponse de logout.php :', data);
            if (data.status === 'success') {
                localStorage.removeItem('token');
                localStorage.removeItem('user_id');
                navigateTo('/login');
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user_id');
            navigateTo('/login');
        }
    });

    async function loadHomePage() {
        console.log('Démarrage de loadHomePage, chemin actuel:', window.location.pathname);
        if (window.location.pathname.includes('/login')) {
            console.log('Déjà sur la page de login, arrêt du chargement');
            return;
        }
        const authResult = await checkAuth();
        console.log('Résultat de checkAuth:', authResult);
        if (authResult) {
            console.log('Authentification réussie, chargement des données');
            try {
                await Promise.all([
                    fetchContacts(),
                    fetchSuggestions(),
                    fetchStories(),
                    fetchPosts()
                ]);
                console.log('Données chargées avec succès');
                setupPublishCreation();
                setupEmojiCreation();
                setupPhotoCreation();
                setupLocationCreation();
            } catch (error) {
                console.error('Erreur lors du chargement des données:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user_id');
                navigateTo('/login');
            }
        } else {
            console.log('Échec de l\'authentification, redirection vers /login');
            navigateTo('/login');
        }
    }

    console.log('Événement DOMContentLoaded déclenché');
    loadHomePage();
})();   