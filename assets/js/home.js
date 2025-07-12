//document.addEventListener('DOMContentLoaded', function() {
    //const API_URL = 'http://localhost/api/users';
    //let localStorage.getItem('token');
    //let currentUser = null;

    //verifier l'authentification
    async function checkAuth(){
        if (!localStorage.getItem('token')){
            router('/login');
            return;
        }
        try {
            const response = await fetch(`${API_URL}/home`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            const data = await response.json();
            if (response.ok && data.status === 'success') {
                //currentUser = data;
                console.log('Utilisateur authentifié:', data);
                return true;
            } else {
                console.error('Erreur lors de l\'authentification:', data);
                router('/login');
                return false;
            }
        } catch (error) {
            console.error('Erreur lors de l\'authentification:', error);
            router('/login');
            return false;
        }
    }

    // Fonction pour faire des requêtes API
    async function fetchApi(endpoint, method = 'GET', body = null, isFormData = false) {
        const options = {
            method,
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        };
        if (body && !isFormData) {
            options.headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify(body);
        } else if (body && isFormData) {
            options.body = body;
        }
        const response = await fetch(`${API_URL}${endpoint}`, options);
        console.log(`${API_URL}${endpoint}`);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erreur API');
        }
        return await response.json();
    }

    // Récupérer et afficher les contacts (amis)
    async function fetchContacts() {
        const contactsList = document.querySelector('.contacts-list');
        if (!contactsList) {
            console.warn('contacts-list introuvable dans le DOM');
            return;
        }
        contactsList.innerHTML = '';
        const friends = await fetchApi('/friends?status=accepted');
        friends.forEach(contact => {
            const contactItem = document.createElement('div');
            contactItem.className = 'contact-item';
            contactItem.innerHTML = `
                <div class="position-relative">
                    <img src="${contact.avatar_url || 'https://via.placeholder.com/36'}" 
                        alt="${contact.full_name}" class="contact-avatar">
                    ${contact.online ? '<div class="online-status"></div>' : ''}
                </div>
                <span class="contact-name">${contact.full_name}</span>
            `;
            contactsList.appendChild(contactItem);
        });
    }
    
    // Récupérer et afficher les suggestions d'amis
    async function fetchSuggestions() {
        const suggestionsList = document.querySelector('.suggestions-list');
        if (!suggestionsList) return;
        suggestionsList.innerHTML = '';
        const data = await fetchApi('/friends/suggestions');
        const suggestions = data.suggestions || [];
        suggestions.forEach(suggestion => {
            const suggestionItem = document.createElement('div');
            suggestionItem.className = 'suggestion-item';
            suggestionItem.innerHTML = `
                <div class="suggestion-header">
                    <img src="${suggestion.avatar_url || 'https://via.placeholder.com/40'}" 
                        alt="${suggestion.full_name}" class="suggestion-avatar">
                    <div class="suggestion-info">
                        <div class="suggestion-name">${suggestion.full_name}</div>
                        <div class="suggestion-mutuals">${suggestion.mutual_friends} amis en commun</div>
                    </div>
                </div>
                <div class="suggestion-actions">
                    <button class="suggestion-btn suggestion-btn-primary" data-id="${suggestion.id}">Ajouter</button>
                    <button class="suggestion-btn suggestion-btn-secondary">Supprimer</button>
                </div>
            `;
            suggestionsList.appendChild(suggestionItem);
            suggestionItem.querySelector('.suggestion-btn-primary').addEventListener('click', async () => {
                await fetchApi('/friends', 'POST', { friend_id: suggestion.id });
                suggestionItem.remove();
            });
        });
    }

    // Récupérer et afficher les stories
    async function fetchStories() {
        const storiesScroll = document.querySelector('.stories-scroll');
        if (!storiesScroll) return;
        storiesScroll.innerHTML = '';
        const stories = await fetchApi('/stories');
        stories.forEach(story => {
            const storyItem = document.createElement('div');
            storyItem.className = 'story-item';
            if (story.user_id === currentUser.user_id) {
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
                            `<div class="d-flex align-items-center justify-content-center" style="font-size:2.5rem;">${story.emoji_content}</div>` :
                            story.media_type === 'video' ?
                            `<video src="${story.media_url}" controls class="story-image"></video>` :
                            `<img src="${story.media_url}" alt="${story.full_name}" class="story-image">`
                        }
                        <img src="${story.avatar_url || 'https://via.placeholder.com/32'}" 
                            alt="${story.full_name}" class="story-avatar">
                        <div class="story-name">${story.full_name.split(' ')[0]}</div>
                    </div>
                `;
                storyItem.addEventListener('click', async () => {
                    await fetchApi(`/stories/${story.story_id}/views`, 'POST');
                });
            }
            storiesScroll.appendChild(storyItem);
        });
        document.querySelector('.story-create-btn')?.addEventListener('click', showStoryModal);
    }

    // Modal pour créer une story
    function showStoryModal() {
        let modal = document.getElementById('storyModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'storyModal';
            modal.style.position = 'fixed';
            modal.style.top = 0;
            modal.style.left = 0;
            modal.style.width = '100vw';
            modal.style.height = '100vh';
            modal.style.background = 'rgba(0,0,0,0.4)';
            modal.style.display = 'flex';
            modal.style.alignItems = 'center';
            modal.style.justifyContent = 'center';
            modal.style.zIndex = 9999;
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
                await fetchApi('/stories', 'POST', formData, true);
                modal.style.display = 'none';
                loadStories();
            } catch (error) {
                alert('Erreur lors de l\'ajout de la story: ' + error.message);
            }
        };
    }


    // Récupérer et afficher les posts
    async function fetchPosts() {
    const feedPosts = document.querySelector('.feed-posts');
    if (!feedPosts) return;
        feedPosts.innerHTML = '';
        const posts = await fetchApi('/posts');
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'post-container';
            postElement.innerHTML = `
                <div class="post-header">
                    <div class="post-author">
                        <div class="post-author-info">
                            <img src="${post.avatar_url || 'https://via.placeholder.com/40'}" 
                                alt="${post.full_name}" class="post-avatar">
                            <div>
                                <div class="post-author-name">${post.full_name}</div>
                                <div class="post-time">${new Date(post.created_at).toLocaleString()}</div>
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
                        `<video src="${post.media_url}" controls class="post-image"></video>` : 
                        `<img src="${post.media_url}" alt="Post content" class="post-image">`
                    ) : ''
                }
                <div class="post-stats">
                    <div class="post-stats-content">
                        <div class="post-likes">
                            <div class="post-likes-icons">
                                <div class="post-like-icon"><i class="bi bi-hand-thumbs-up-fill"></i></div>
                                <div class="post-like-icon"><i class="bi bi-heart-fill"></i></div>
                            </div>
                            <span class="post-likes-count">${post.likes_count}</span>
                        </div>
                        <div class="post-comments-share">
                            <span>${post.comments_count} commentaires</span>
                            <span>0 partages</span>
                        </div>
                    </div>
                </div>
                <div class="post-actions">
                    <div class="post-action-buttons">
                        <button class="post-action-btn post-like-btn" data-id="${post.post_id}">
                            <i class="bi bi-hand-thumbs-up"></i><span>J'aime</span>
                        </button>
                        <button class="post-action-btn post-comment-btn" data-id="${post.post_id}">
                            <i class="bi bi-chat-left"></i><span>Commenter</span>
                        </button>
                        <button class="post-action-btn"><i class="bi bi-share"></i><span>Partager</span></button>
                    </div>
                </div>
                <div class="post-comments-section mt-2 p-2" style="background:#f6f7f9;border-radius:0.5rem;">
                    <div class="comments-list mb-2"></div>
                    <form class="comment-form d-flex align-items-center gap-2" data-id="${post.post_id}">
                        <div class="user-avatar-small" style="width:28px;height:28px;"></div>
                        <input type="text" class="form-control form-control-sm comment-input" placeholder="Écrire un commentaire..." style="background:#fff;border-radius:1rem;">
                        <button type="submit" class="btn btn-primary btn-sm px-3">Publier</button>
                    </form>
                </div>
            `;
            // Gestion des likes
            const likeBtn = postElement.querySelector('.post-like-btn');
            const likesCount = postElement.querySelector('.post-likes-count');
            likeBtn.addEventListener('click', async () => {
                try {
                    const isLiked = likeBtn.classList.contains('liked');
                    await fetchApi('/likes', isLiked ? 'DELETE' : 'POST', { post_id: post.post_id });
                    likeBtn.classList.toggle('liked');
                    likesCount.textContent = isLiked ? parseInt(likesCount.textContent) - 1 : parseInt(likesCount.textContent) + 1;
                } catch (error) {
                    alert('Erreur lors de la gestion du like: ' + error.message);
                }
            });
            // Gestion des commentaires
            const commentForm = postElement.querySelector('.comment-form');
            const commentsList = postElement.querySelector('.comments-list');
            commentForm.addEventListener('submit', async (ev) => {
                ev.preventDefault();
                const input = commentForm.querySelector('.comment-input');
                const content = input.value.trim();
                if (content) {
                    await fetchApi('/comments', 'POST', { post_id: post.post_id, content });
                    input.value = '';
                    loadComments(post.post_id, commentsList);
                }
            });
            // Charger les commentaires
            async function loadComments(post_id, commentsList) {
                const comments = await fetchApi(`/posts/${post_id}/comments`);
                commentsList.innerHTML = '';
                document.getElementById(`comments-count-${post_id}`).textContent = `${comments.length} commentaires`;
                comments.forEach(comment => {
                    const commentDiv = document.createElement('div');
                    commentDiv.className = 'comment-item mb-1';
                    commentDiv.innerHTML = `
                        <img src="${comment.avatar_url || 'https://via.placeholder.com/28'}" alt="${comment.full_name}" style="width:28px;height:28px;border-radius:50%;margin-right:8px;">
                        <span class="fw-bold text-primary">${comment.full_name} :</span> <span>${comment.content}</span>
                    `;
                    commentsList.appendChild(commentDiv);
                });
            }
            loadComments(post.post_id, commentsList);
            feedPosts.appendChild(postElement);
        });
    }

    function setupPublishCreation() {
        // Gestion de la publication
        const createPostForm = document.querySelector('.create-post-container form');
        const postInput = document.querySelector('.post-input');
        let selectedPostMediaFile = null;
        let selectedEmoji = '';
        let selectedLocation = '';
        let selectedLatLng = null;

            // Ajouter le bouton "Publier" au formulaire
            if (createPostForm) {
                const submitButton = document.createElement('button');
                submitButton.type = 'submit';
                submitButton.className = 'btn btn-primary btn-sm';
                submitButton.textContent = 'Publier';
                createPostForm.querySelector('.create-post').appendChild(submitButton);
            }
        
        // Publication avec média, emoji et localisation
        createPostForm?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData();
            formData.append('content', postInput.value);
            if (selectedEmoji) formData.append('content', postInput.value + ' ' + selectedEmoji);
            if (selectedLocation) formData.append('location_name', selectedLocation);
            if (selectedLatLng) {
                formData.append('latitude', selectedLatLng.lat);
                formData.append('longitude', selectedLatLng.lng);
            }
            if (selectedPostMediaFile) formData.append('media', selectedPostMediaFile);
            
            try {
                await fetchApi('/posts', 'POST', formData, true);
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
                alert('Erreur lors de la publication: ' + error.message);
            }
        });
    }

    // Gestion du bouton photo/vidéo
    function setupPhotoCreation() {
        const photoButton = document.querySelector('.photo-action');
        if (!photoButton) {
            console.warn('photo-action introuvable');
            return;
        }
        photoButton.addEventListener('click', (e) => {
            e.preventDefault();
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*,video/*';
            input.onchange = (ev) => {
            selectedPostMediaFile = ev.target.files[0];
            let preview = document.getElementById('postMediaPreview');
            if (!preview) {
                preview = document.createElement('div');
                preview.id = 'postMediaPreview';
                preview.style.margin = '10px 0';
                document.querySelector('.create-post-container .create-post').appendChild(preview);
            }
            const url = URL.createObjectURL(selectedPostMediaFile);
            const isVideo = selectedPostMediaFile.type.startsWith('video');
            preview.innerHTML = isVideo ? `<video src="${url}" controls style="max-width:100%;max-height:200px;"></video>` : 
                                        `<img src="${url}" style="max-width:100%;max-height:200px;">`;
            };
            input.click();
        });
    }

    // Gestion du bouton humeur
    function setupEmojiCreation() {
        const feelingButton = document.querySelector('.feeling-action');
        if (!feelingButton) {
            console.warn('Bouton humeur non trouvé');
            return;
        }
        feelingButton.addEventListener('click', (e) => {
            e.preventDefault();
            let modal = document.getElementById('emojiModal');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'emojiModal';
                modal.style.position = 'fixed';
                modal.style.top = 0;
                modal.style.left = 0;
                modal.style.width = '100vw';
                modal.style.height = '100vh';
                modal.style.background = 'rgba(0,0,0,0.4)';
                modal.style.display = 'flex';
                modal.style.alignItems = 'center';
                modal.style.justifyContent = 'center';
                modal.style.zIndex = 9999;
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
                    selectedEmoji = span.textContent;
                    let emojiPreview = document.getElementById('postEmojiPreview');
                    if (!emojiPreview) {
                        emojiPreview = document.createElement('span');
                        emojiPreview.id = 'postEmojiPreview';
                        emojiPreview.style.fontSize = '2rem';
                        emojiPreview.style.marginLeft = '10px';
                        document.querySelector('.post-input-container').appendChild(emojiPreview);
                    }
                    emojiPreview.textContent = selectedEmoji;
                    modal.style.display = 'none';
                };
            });
        });
    }

    // Gestion du bouton lieu
    document.querySelector('.location-action')?.addEventListener('click', (e) => {
        e.preventDefault();
        let modal = document.getElementById('locationModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'locationModal';
            modal.style.position = 'fixed';
            modal.style.top = 0;
            modal.style.left = 0;
            modal.style.width = '100vw';
            modal.style.height = '100vh';
            modal.style.background = 'rgba(0,0,0,0.4)';
            modal.style.display = 'flex';
            modal.style.alignItems = 'center';
            modal.style.justifyContent = 'center';
            modal.style.zIndex = 9999;
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
                    selectedLatLng = e.latlng;
                    selectedLocation = '';
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
                                    selectedLatLng = {lat: parseFloat(place.lat), lng: parseFloat(place.lon)};
                                    selectedLocation = place.display_name;
                                }
                            });
                    }, 500);
                };
            }, 200);
        }
        modal.querySelector('#closeLocationModal').onclick = () => modal.style.display = 'none';
        modal.querySelector('#addLocationBtn').onclick = () => {
            if (selectedLatLng) {
                let locationPreview = document.getElementById('postLocationPreview');
                if (!locationPreview) {
                    locationPreview = document.createElement('span');
                    locationPreview.id = 'postLocationPreview';
                    locationPreview.style.fontSize = '1rem';
                    locationPreview.style.marginLeft = '10px';
                    document.querySelector('.post-input-container').appendChild(locationPreview);
                }
                locationPreview.textContent = selectedLocation || `Lat: ${selectedLatLng.lat.toFixed(4)}, Lng: ${selectedLatLng.lng.toFixed(4)}`;
            }
            modal.style.display = 'none';
        };
    });
 // Gestion du bouton chat
document.getElementById('go-to-chat')?.addEventListener('click', () => {
    setTimeout(() => {
        history.pushState(null, '', '/chat');
        router();        
    }, 1200);});

if (checkAuth()) {
    fetchContacts();
    fetchSuggestions();
    fetchStories();
    fetchPosts();
    //fetchNotifications();
    setupPublishCreation();
    setupEmojiCreation();
    setupPhotoCreation();
}


//});