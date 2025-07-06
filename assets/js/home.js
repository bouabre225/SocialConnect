document.addEventListener('DOMContentLoaded', function() {
    // Contacts data
    const contacts = [
        { name: 'Thomas Chen', avatar: 'photo-1507003211169-0a1dd7228f2d', online: true },
        { name: 'Julie Martin', avatar: 'photo-1438761681033-6461ffad8d80', online: false },
        { name: 'Alexandre Dubois', avatar: 'photo-1472099645785-5658abf4ff4e', online: true },
        { name: 'Sarah Bernard', avatar: 'photo-1544725176-7c40e5a71c5e', online: false },
        { name: 'Emma Dubois', avatar: 'photo-1529626455594-4ff0802cfb7e', online: true },
        { name: 'Noah Lefevre', avatar: 'photo-1535713875002-d1d0cf377fde', online: false },
    ];

    // Suggestions data
    const suggestions = [
        { name: 'Marina Costa', avatar: 'photo-1489424731084-a5d8b219a5bb', mutualFriends: 3 },
        { name: 'David Wilson', avatar: 'photo-1500648767791-00dcc994a43e', mutualFriends: 5 },
    ];

    // Stories data
    const stories = [
        { id: 1, name: 'Votre story', isOwn: true, avatar: '' },
        { id: 2, name: 'Pierre Martin', avatar: 'photo-1507003211169-0a1dd7228f2d' },
        { id: 3, name: 'Sophie Chen', avatar: 'photo-1438761681033-6461ffad8d80' },
        { id: 4, name: 'Lucas Bernard', avatar: 'photo-1472099645785-5658abf4ff4e' },
        { id: 5, name:'Noah Lefevre', avatar: 'photo-1535713875002-d1d0cf377fde' },
        { id: 6, name: 'Alexandre Dubois', avatar: 'photo-1472099645785-5658abf4ff4e'},
        { id: 7, name: 'Manon Petit', avatar: 'photo-1547425260-76bcadfb4f2c'}
    ];

    // Posts data
    const posts = [
        {
            id: 1,
            author: "Marie Dubois",
            time: "Il y a 2 heures",
            content: "Je viens de passer un excellent week-end à la montagne ! 🏔️",
            image: "photo-1518630382442-5397b102c9f9",
            likes: 42,
            comments: 8,
            avatar: "photo-1494790108755-2616b612b0e8"
        },
        {
            id: 2,
            author: "Pierre Martin",
            time: "Hier à 18:30",
            content: "Juste partager cette citation inspirante : 'Le succès c'est d'aller d'échec en échec sans perdre son enthousiasme.' - Winston Churchill",
            likes: 28,
            comments: 3,
            avatar: "photo-1507003211169-0a1dd7228f2d"
        },
        {
            id: 3,
            author: "Sophie Chen",
            time: "Lundi à 09:15",
            content: "Nouvelle recette testée ce week-end, un délice !",
            image: "photo-1546069901-ba9599a7e63c",
            likes: 56,
            comments: 12,
            avatar: "photo-1438761681033-6461ffad8d80"
        }
    ];

    // Left sidebar data
    const menuItems = [
        { icon: 'bi-people', label: 'Amis', colorClass: 'friends' },
        { icon: 'bi-clock', label: 'Souvenirs', colorClass: 'memories' },
        { icon: 'bi-bookmark', label: 'Enregistrés', colorClass: 'saved' },
        { icon: 'bi-calendar-event', label: 'Événements', colorClass: 'events' },
        { icon: 'bi-camera-reels', label: 'Watch', colorClass: 'watch' }
    ];

    const shortcuts = [
        'Groupe de voyage',
        'Photographes amateurs',
        'Cuisine du monde'
    ];

    // Generate contacts
    const contactsList = document.querySelector('.contacts-list');
    contacts.forEach(contact => {
        const contactItem = document.createElement('div');
        contactItem.className = 'contact-item';
        contactItem.innerHTML = `
            <div class="position-relative">
                <img src="https://images.unsplash.com/${contact.avatar}?w=36&h=36&fit=crop&crop=face" 
                     alt="${contact.name}" class="contact-avatar">
                ${contact.online ? '<div class="online-status"></div>' : ''}
            </div>
            <span class="contact-name">${contact.name}</span>
        `;
        contactsList.appendChild(contactItem);
    });

    // Generate suggestions
    const suggestionsList = document.querySelector('.suggestions-list');
    suggestions.forEach(suggestion => {
        const suggestionCard = document.createElement('div');
        suggestionCard.className = 'suggestion-card';
        suggestionCard.innerHTML = `
            <div class="suggestion-header">
                <img src="https://images.unsplash.com/${suggestion.avatar}?w=40&h=40&fit=crop&crop=face" 
                     alt="${suggestion.name}" class="suggestion-avatar">
                <div class="suggestion-info">
                    <div class="suggestion-name">${suggestion.name}</div>
                    <div class="suggestion-mutuals">${suggestion.mutualFriends} amis en commun</div>
                </div>
            </div>
            <div class="suggestion-actions">
                <button class="suggestion-btn suggestion-btn-primary">Ajouter</button>
                <button class="suggestion-btn suggestion-btn-secondary">Supprimer</button>
            </div>
        `;
        suggestionsList.appendChild(suggestionCard);
    });

    // Generate stories
    const storiesScroll = document.querySelector('.stories-scroll');
    stories.forEach(story => {
        const storyItem = document.createElement('div');
        storyItem.className = 'story-item';
        if (story.isOwn) {
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
                    <img src="https://images.unsplash.com/${story.avatar}?w=80&h=112&fit=crop&crop=face" 
                         alt="${story.name}" class="story-image">
                    <img src="https://images.unsplash.com/${story.avatar}?w=32&h=32&fit=crop&crop=face" 
                         alt="${story.name}" class="story-avatar">
                    <div class="story-name">${story.name.split(' ')[0]}</div>
                </div>
            `;
        }
        storiesScroll.appendChild(storyItem);
    });

    // Ajout : Modal création de story
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
        // Fermer
        modal.querySelector('#closeStoryModal').onclick = function() {
            modal.style.display = 'none';
        };
        // Ajouter
        modal.querySelector('#addStoryBtn').onclick = function() {
            const mediaInput = modal.querySelector('#storyMediaInput');
            const emojiInput = modal.querySelector('#storyEmojiInput');
            let storyHTML = '';
            if (mediaInput.files && mediaInput.files[0]) {
                const file = mediaInput.files[0];
                const url = URL.createObjectURL(file);
                const isVideo = file.type.startsWith('video');
                storyHTML = `<div class='story-other'>${isVideo ? `<video src='${url}' controls style='width:100%;height:100%;object-fit:cover;'></video>` : `<img src='${url}' class='story-image' style='object-fit:cover;'>`}<div class='story-name'>Vous</div></div>`;
            } else if (emojiInput.value.trim()) {
                storyHTML = `<div class='story-other d-flex align-items-center justify-content-center' style='font-size:2.5rem;'>${emojiInput.value.trim()}<div class='story-name'>Vous</div></div>`;
            }
            if (storyHTML) {
                storiesScroll.insertAdjacentHTML('afterbegin', `<div class='story-item'>${storyHTML}</div>`);
                modal.style.display = 'none';
            }
        };
    }
    // Clic sur "Créer" story
    document.querySelector('.story-create-btn').onclick = showStoryModal;

    // Generate posts
    const feedPosts = document.querySelector('.feed-posts');
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post-container';
        postElement.innerHTML = `
            <div class="post-header">
                <div class="post-author">
                    <div class="post-author-info">
                        <img src="https://images.unsplash.com/${post.avatar}?w=40&h=40&fit=crop&crop=face" 
                             alt="${post.author}" class="post-avatar">
                        <div>
                            <div class="post-author-name">${post.author}</div>
                            <div class="post-time">${post.time}</div>
                        </div>
                    </div>
                    <button class="post-more-btn">
                        <i class="bi bi-three-dots"></i>
                    </button>
                </div>
                <p class="post-content">${post.content}</p>
            </div>
            
            ${post.image ? `
            <img src="https://images.unsplash.com/${post.image}?w=600&h=400&fit=crop" 
                 alt="Post content" class="post-image">
            ` : ''}
            
            <div class="post-stats">
                <div class="post-stats-content">
                    <div class="post-likes">
                        <div class="post-likes-icons">
                            <div class="post-like-icon">
                                <i class="bi bi-hand-thumbs-up-fill"></i>
                            </div>
                            <div class="post-like-icon">
                                <i class="bi bi-heart-fill"></i>
                            </div>
                        </div>
                        <span class="post-likes-count">${post.likes}</span>
                    </div>
                    <div class="post-comments-share">
                        <span>${post.comments} commentaires</span>
                        <span>12 partages</span>
                    </div>
                </div>
            </div>
            
            <div class="post-actions">
                <div class="post-action-buttons">
                    <button class="post-action-btn post-like-btn">
                        <i class="bi bi-hand-thumbs-up"></i>
                        <span>J'aime</span>
                    </button>
                    <button class="post-action-btn">
                        <i class="bi bi-chat-left"></i>
                        <span>Commenter</span>
                    </button>
                    <button class="post-action-btn">
                        <i class="bi bi-share"></i>
                        <span>Partager</span>
                    </button>
                </div>
            </div>
        `;
        
        // Add like functionality
        const likeBtn = postElement.querySelector('.post-like-btn');
        const likesCount = postElement.querySelector('.post-likes-count');
        let isLiked = false;
        let currentLikes = post.likes;
        
        likeBtn.addEventListener('click', () => {
            isLiked = !isLiked;
            likeBtn.classList.toggle('liked', isLiked);
            currentLikes = isLiked ? currentLikes + 1 : currentLikes - 1;
            likesCount.textContent = currentLikes;
        });
        
        // Ajout de la zone de commentaires sous chaque post publié dynamiquement
        const commentSection = document.createElement('div');
        commentSection.className = 'post-comments-section mt-2 p-2';
        commentSection.style.background = '#f6f7f9';
        commentSection.style.borderRadius = '0.5rem';
        commentSection.innerHTML = `
            <div class="comments-list mb-2"></div>
            <form class="comment-form d-flex align-items-center gap-2">
                <div class="user-avatar-small" style="width:28px;height:28px;"></div>
                <input type="text" class="form-control form-control-sm comment-input" placeholder="Écrire un commentaire..." style="background:#fff;border-radius:1rem;">
                <button type="submit" class="btn btn-primary btn-sm px-3">Publier</button>
            </form>
        `;
        postElement.appendChild(commentSection);
        // Gestion de l'ajout de commentaire
        const commentForm = commentSection.querySelector('.comment-form');
        const commentsList = commentSection.querySelector('.comments-list');
        commentForm.addEventListener('submit', function(ev) {
            ev.preventDefault();
            const input = commentForm.querySelector('.comment-input');
            const text = input.value.trim();
            if (text) {
                const commentDiv = document.createElement('div');
                commentDiv.className = 'comment-item mb-1';
                commentDiv.innerHTML = `<span class='fw-bold text-primary'>Vous :</span> <span>${text}</span>`;
                commentsList.appendChild(commentDiv);
                input.value = '';
            }
        });
        
        feedPosts.appendChild(postElement);
    });

    // Generate left sidebar menu
    const menuItemsContainer = document.querySelector('.menu-items');
    menuItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.innerHTML = `
            <div class="menu-icon-container">
                <i class="bi ${item.icon} menu-icon ${item.colorClass}"></i>
            </div>
            <span class="menu-label">${item.label}</span>
        `;
        menuItemsContainer.appendChild(menuItem);
    });

    // Generate shortcuts
    const shortcutsContainer = document.querySelector('.shortcuts-items');
    shortcuts.forEach(shortcut => {
        const shortcutItem = document.createElement('div');
        shortcutItem.className = 'shortcut-item';
        shortcutItem.innerHTML = `
            <div class="shortcut-icon"></div>
            <span class="shortcut-name">${shortcut}</span>
        `;
        shortcutsContainer.appendChild(shortcutItem);
    });

    // Publication : Ajout d'une modale pour photo/vidéo
    function showPostMediaModal(callback) {
        let modal = document.getElementById('postMediaModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'postMediaModal';
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
                    <h5>Ajouter une photo ou vidéo</h5>
                    <input type="file" accept="image/*,video/*" class="form-control mb-2" id="postMediaInput">
                    <div class="d-flex gap-2 justify-content-end">
                        <button class="btn btn-secondary btn-sm" id="closePostMediaModal">Annuler</button>
                        <button class="btn btn-primary btn-sm" id="addPostMediaBtn">Ajouter</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        } else {
            modal.style.display = 'flex';
        }
        // Fermer
        modal.querySelector('#closePostMediaModal').onclick = function() {
            modal.style.display = 'none';
        };
        // Ajouter
        modal.querySelector('#addPostMediaBtn').onclick = function() {
            const mediaInput = modal.querySelector('#postMediaInput');
            if (mediaInput.files && mediaInput.files[0]) {
                callback(mediaInput.files[0]);
                modal.style.display = 'none';
            }
        };
    }

    // Gestion du bouton photo/vidéo
    const photoActionBtn = document.querySelector('.photo-action');
    let selectedPostMediaFile = null;
    if (photoActionBtn) {
        photoActionBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showPostMediaModal(function(file) {
                selectedPostMediaFile = file;
                // Affiche un aperçu dans le champ de publication (optionnel)
                let preview = document.getElementById('postMediaPreview');
                if (!preview) {
                    preview = document.createElement('div');
                    preview.id = 'postMediaPreview';
                    preview.style.margin = '10px 0';
                    document.querySelector('.create-post-container .create-post').appendChild(preview);
                }
                const url = URL.createObjectURL(file);
                const isVideo = file.type.startsWith('video');
                preview.innerHTML = isVideo ? `<video src='${url}' controls style='max-width:100%;max-height:200px;'></video>` : `<img src='${url}' style='max-width:100%;max-height:200px;'>`;
            });
        });
    }

    // Publication d'un post avec média sélectionné
    const createPostBtn = document.querySelector('.photo-action');
    const postInput = document.querySelector('.post-input');
    let feedPostsEl = document.querySelector('.feed-posts');
    if (createPostBtn && postInput && feedPostsEl) {
        createPostBtn.closest('form')?.addEventListener('submit', function(e) {
            e.preventDefault();
            let postContent = postInput.value;
            let mediaHTML = '';
            if (selectedPostMediaFile) {
                const url = URL.createObjectURL(selectedPostMediaFile);
                const isVideo = selectedPostMediaFile.type.startsWith('video');
                mediaHTML = isVideo ? `<video src='${url}' controls style='width:100%;max-height:300px;object-fit:cover;'></video>` : `<img src='${url}' class='post-image' style='object-fit:cover;'>`;
            }
            const postElement = document.createElement('div');
            postElement.className = 'post-container';
            postElement.innerHTML = `
                <div class='post-header'>
                    <div class='post-author'>
                        <div class='post-author-info'>
                            <div class='post-avatar' style='background:linear-gradient(to bottom right,#60a5fa,#2563eb);'></div>
                            <div>
                                <div class='post-author-name'>Vous</div>
                                <div class='post-time'>À l'instant</div>
                            </div>
                        </div>
                    </div>
                    <p class='post-content'>${postContent}</p>
                </div>
                ${mediaHTML}
                <div class='post-stats'>
                    <div class='post-stats-content'>
                        <div class='post-likes'>
                            <div class='post-likes-icons'>
                                <div class='post-like-icon'><i class='bi bi-hand-thumbs-up-fill'></i></div>
                                <div class='post-like-icon'><i class='bi bi-heart-fill'></i></div>
                            </div>
                            <span class='post-likes-count'>0</span>
                        </div>
                        <div class='post-comments-share'>
                            <span>0 commentaire</span>
                            <span>0 partage</span>
                        </div>
                    </div>
                </div>
                <div class='post-actions'>
                    <div class='post-action-buttons'>
                        <button class='post-action-btn post-like-btn'><i class='bi bi-hand-thumbs-up'></i><span>J'aime</span></button>
                        <button class='post-action-btn'><i class='bi bi-chat-left'></i><span>Commenter</span></button>
                        <button class='post-action-btn'><i class='bi bi-share'></i><span>Partager</span></button>
                    </div>
                </div>
            `;
            // Like
            const likeBtn = postElement.querySelector('.post-like-btn');
            const likesCount = postElement.querySelector('.post-likes-count');
            let isLiked = false;
            let currentLikes = 0;
            likeBtn.addEventListener('click', () => {
                isLiked = !isLiked;
                likeBtn.classList.toggle('liked', isLiked);
                currentLikes = isLiked ? currentLikes + 1 : currentLikes - 1;
                likesCount.textContent = currentLikes;
            });
            // Ajout de la zone de commentaires sous chaque post publié dynamiquement
            const commentSection = document.createElement('div');
            commentSection.className = 'post-comments-section mt-2 p-2';
            commentSection.style.background = '#f6f7f9';
            commentSection.style.borderRadius = '0.5rem';
            commentSection.innerHTML = `
                <div class="comments-list mb-2"></div>
                <form class="comment-form d-flex align-items-center gap-2">
                    <div class="user-avatar-small" style="width:28px;height:28px;"></div>
                    <input type="text" class="form-control form-control-sm comment-input" placeholder="Écrire un commentaire..." style="background:#fff;border-radius:1rem;">
                    <button type="submit" class="btn btn-primary btn-sm px-3">Publier</button>
                </form>
            `;
            postElement.appendChild(commentSection);
            // Gestion de l'ajout de commentaire
            const commentForm = commentSection.querySelector('.comment-form');
            const commentsList = commentSection.querySelector('.comments-list');
            commentForm.addEventListener('submit', function(ev) {
                ev.preventDefault();
                const input = commentForm.querySelector('.comment-input');
                const text = input.value.trim();
                if (text) {
                    const commentDiv = document.createElement('div');
                    commentDiv.className = 'comment-item mb-1';
                    commentDiv.innerHTML = `<span class='fw-bold text-primary'>Vous :</span> <span>${text}</span>`;
                    commentsList.appendChild(commentDiv);
                    input.value = '';
                }
            });
            feedPostsEl.insertAdjacentElement('afterbegin', postElement);
            postInput.value = '';
            selectedPostMediaFile = null;
            let preview = document.getElementById('postMediaPreview');
            if (preview) preview.remove();
        });
    }

    // Humeur : Affichage d'un sélecteur d'emoji
    const feelingActionBtn = document.querySelector('.feeling-action');
    let selectedEmoji = '';
    if (feelingActionBtn) {
        feelingActionBtn.addEventListener('click', function(e) {
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
                // Liste d'emojis populaires pour humeur
                const emojis = ['😀','😃','😄','😁','😆','😅','😂','😊','😇','🙂','🙃','😉','😍','🥰','😘','😜','🤩','😎','😔','😢','😭','😡','😱','😴','🤒','🤕','🤧','🥳','😇','🤠','😶‍🌫️','😬','🥶','🥵','🤯','😤','😩','😳','🥺','😤','😐','😑','😶'];
                modal.innerHTML = `
                    <div style="background:#fff;padding:2rem 1.5rem;border-radius:1rem;min-width:320px;max-width:95vw;box-shadow:0 2px 16px #0002;">
                        <h5>Choisissez votre humeur</h5>
                        <div style="display:flex;flex-wrap:wrap;gap:8px;max-width:350px;">
                            ${emojis.map(e=>`<span class='emoji-choice' style='font-size:2rem;cursor:pointer;'>${e}</span>`).join('')}
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
            // Fermer
            modal.querySelector('#closeEmojiModal').onclick = function() {
                modal.style.display = 'none';
            };
            // Sélection emoji
            modal.querySelectorAll('.emoji-choice').forEach(span => {
                span.onclick = function() {
                    selectedEmoji = this.textContent;
                    // Affiche l'emoji choisi dans le champ de publication
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
    // Ajout de l'emoji sélectionné lors de la publication
    if (createPostBtn && postInput && feedPostsEl) {
        createPostBtn.closest('form')?.addEventListener('submit', function(e) {
            e.preventDefault();
            let postContent = postInput.value;
            if (selectedEmoji) postContent += ' ' + selectedEmoji;
            let mediaHTML = '';
            if (selectedPostMediaFile) {
                const url = URL.createObjectURL(selectedPostMediaFile);
                const isVideo = selectedPostMediaFile.type.startsWith('video');
                mediaHTML = isVideo ? `<video src='${url}' controls style='width:100%;max-height:300px;object-fit:cover;'></video>` : `<img src='${url}' class='post-image' style='object-fit:cover;'>`;
            }
            const postElement = document.createElement('div');
            postElement.className = 'post-container';
            postElement.innerHTML = `
                <div class='post-header'>
                    <div class='post-author'>
                        <div class='post-author-info'>
                            <div class='post-avatar' style='background:linear-gradient(to bottom right,#60a5fa,#2563eb);'></div>
                            <div>
                                <div class='post-author-name'>Vous</div>
                                <div class='post-time'>À l'instant</div>
                            </div>
                        </div>
                    </div>
                    <p class='post-content'>${postContent}</p>
                </div>
                ${mediaHTML}
                <div class='post-stats'>
                    <div class='post-stats-content'>
                        <div class='post-likes'>
                            <div class='post-likes-icons'>
                                <div class='post-like-icon'><i class='bi bi-hand-thumbs-up-fill'></i></div>
                                <div class='post-like-icon'><i class='bi bi-heart-fill'></i></div>
                            </div>
                            <span class='post-likes-count'>0</span>
                        </div>
                        <div class='post-comments-share'>
                            <span>0 commentaire</span>
                            <span>0 partage</span>
                        </div>
                    </div>
                </div>
                <div class='post-actions'>
                    <div class='post-action-buttons'>
                        <button class='post-action-btn post-like-btn'><i class='bi bi-hand-thumbs-up'></i><span>J'aime</span></button>
                        <button class='post-action-btn'><i class='bi bi-chat-left'></i><span>Commenter</span></button>
                        <button class='post-action-btn'><i class='bi bi-share'></i><span>Partager</span></button>
                    </div>
                </div>
            `;
            // Like
            const likeBtn = postElement.querySelector('.post-like-btn');
            const likesCount = postElement.querySelector('.post-likes-count');
            let isLiked = false;
            let currentLikes = 0;
            likeBtn.addEventListener('click', () => {
                isLiked = !isLiked;
                likeBtn.classList.toggle('liked', isLiked);
                currentLikes = isLiked ? currentLikes + 1 : currentLikes - 1;
                likesCount.textContent = currentLikes;
            });
            // Ajout de la zone de commentaires sous chaque post publié dynamiquement
            const commentSection = document.createElement('div');
            commentSection.className = 'post-comments-section mt-2 p-2';
            commentSection.style.background = '#f6f7f9';
            commentSection.style.borderRadius = '0.5rem';
            commentSection.innerHTML = `
                <div class="comments-list mb-2"></div>
                <form class="comment-form d-flex align-items-center gap-2">
                    <div class="user-avatar-small" style="width:28px;height:28px;"></div>
                    <input type="text" class="form-control form-control-sm comment-input" placeholder="Écrire un commentaire..." style="background:#fff;border-radius:1rem;">
                    <button type="submit" class="btn btn-primary btn-sm px-3">Publier</button>
                </form>
            `;
            postElement.appendChild(commentSection);
            // Gestion de l'ajout de commentaire
            const commentForm = commentSection.querySelector('.comment-form');
            const commentsList = commentSection.querySelector('.comments-list');
            commentForm.addEventListener('submit', function(ev) {
                ev.preventDefault();
                const input = commentForm.querySelector('.comment-input');
                const text = input.value.trim();
                if (text) {
                    const commentDiv = document.createElement('div');
                    commentDiv.className = 'comment-item mb-1';
                    commentDiv.innerHTML = `<span class='fw-bold text-primary'>Vous :</span> <span>${text}</span>`;
                    commentsList.appendChild(commentDiv);
                    input.value = '';
                }
            });
            feedPostsEl.insertAdjacentElement('afterbegin', postElement);
            postInput.value = '';
            selectedPostMediaFile = null;
            selectedEmoji = '';
            let preview = document.getElementById('postMediaPreview');
            if (preview) preview.remove();
        });
    }

    // Lieu : Affichage d'une carte avec recherche (OpenStreetMap + Nominatim)
    const locationActionBtn = document.querySelector('.location-action');
    let selectedLocation = '';
    let selectedLatLng = null;
    if (locationActionBtn) {
        locationActionBtn.addEventListener('click', function(e) {
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
                // Ajout de Leaflet.js et CSS si pas déjà présent
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
                    let map = L.map(mapDiv).setView([5.3599517, -4.0082563], 6); // Abidjan par défaut
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
                    // Recherche
                    const searchInput = document.getElementById('locationSearchInput');
                    let searchTimeout = null;
                    searchInput.oninput = function() {
                        clearTimeout(searchTimeout);
                        const query = this.value.trim();
                        if (query.length < 3) return;
                        searchTimeout = setTimeout(() => {
                            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
                                .then(r=>r.json())
                                .then(results => {
                                    if (results.length > 0) {
                                        const place = results[0];
                                        map.setView([place.lat, place.lon], 13);
                                        if (marker) map.removeLayer(marker);
                                        marker = L.marker([place.lat, place.lon]).addTo(map);
                                        selectedLatLng = {lat:parseFloat(place.lat),lng:parseFloat(place.lon)};
                                        selectedLocation = place.display_name;
                                    }
                                });
                        }, 500);
                    };
                }, 200);
            }
            // Fermer
            modal.querySelector('#closeLocationModal').onclick = function() {
                modal.style.display = 'none';
            };
            // Ajouter
            modal.querySelector('#addLocationBtn').onclick = function() {
                if (selectedLatLng) {
                    let locationPreview = document.getElementById('postLocationPreview');
                    if (!locationPreview) {
                        locationPreview = document.createElement('span');
                        locationPreview.id = 'postLocationPreview';
                        locationPreview.style.fontSize = '1rem';
                        locationPreview.style.marginLeft = '10px';
                        document.querySelector('.post-input-container').appendChild(locationPreview);
                    }
                    locationPreview.textContent = selectedLocation ? selectedLocation : `Lat: ${selectedLatLng.lat.toFixed(4)}, Lng: ${selectedLatLng.lng.toFixed(4)}`;
                }
                modal.style.display = 'none';
            };
        });
    }
    // Ajout du lieu sélectionné lors de la publication
    if (createPostBtn && postInput && feedPostsEl) {
        createPostBtn.closest('form')?.addEventListener('submit', function(e) {
            e.preventDefault();
            let postContent = postInput.value;
            if (selectedEmoji) postContent += ' ' + selectedEmoji;
            if (selectedLocation) postContent += '<br><span style="font-size:0.95em;color:#1877f2;"><i class="bi bi-geo-alt"></i> ' + selectedLocation + '</span>';
            let mediaHTML = '';
            if (selectedPostMediaFile) {
                const url = URL.createObjectURL(selectedPostMediaFile);
                const isVideo = selectedPostMediaFile.type.startsWith('video');
                mediaHTML = isVideo ? `<video src='${url}' controls style='width:100%;max-height:300px;object-fit:cover;'></video>` : `<img src='${url}' class='post-image' style='object-fit:cover;'>`;
            }
            const postElement = document.createElement('div');
            postElement.className = 'post-container';
            postElement.innerHTML = `
                <div class='post-header'>
                    <div class='post-author'>
                        <div class='post-author-info'>
                            <div class='post-avatar' style='background:linear-gradient(to bottom right,#60a5fa,#2563eb);'></div>
                            <div>
                                <div class='post-author-name'>Vous</div>
                                <div class='post-time'>À l'instant</div>
                            </div>
                        </div>
                    </div>
                    <p class='post-content'>${postContent}</p>
                </div>
                ${mediaHTML}
                <div class='post-stats'>
                    <div class='post-stats-content'>
                        <div class='post-likes'>
                            <div class='post-likes-icons'>
                                <div class='post-like-icon'><i class='bi bi-hand-thumbs-up-fill'></i></div>
                                <div class='post-like-icon'><i class='bi bi-heart-fill'></i></div>
                            </div>
                            <span class='post-likes-count'>0</span>
                        </div>
                        <div class='post-comments-share'>
                            <span>0 commentaire</span>
                            <span>0 partage</span>
                        </div>
                    </div>
                </div>
                <div class='post-actions'>
                    <div class='post-action-buttons'>
                        <button class='post-action-btn post-like-btn'><i class='bi bi-hand-thumbs-up'></i><span>J'aime</span></button>
                        <button class='post-action-btn'><i class='bi bi-chat-left'></i><span>Commenter</span></button>
                        <button class='post-action-btn'><i class='bi bi-share'></i><span>Partager</span></button>
                    </div>
                </div>
            `;
            // Like
            const likeBtn = postElement.querySelector('.post-like-btn');
            const likesCount = postElement.querySelector('.post-likes-count');
            let isLiked = false;
            let currentLikes = 0;
            likeBtn.addEventListener('click', () => {
                isLiked = !isLiked;
                likeBtn.classList.toggle('liked', isLiked);
                currentLikes = isLiked ? currentLikes + 1 : currentLikes - 1;
                likesCount.textContent = currentLikes;
            });
            // Ajout de la zone de commentaires sous chaque post publié dynamiquement
            const commentSection = document.createElement('div');
            commentSection.className = 'post-comments-section mt-2 p-2';
            commentSection.style.background = '#f6f7f9';
            commentSection.style.borderRadius = '0.5rem';
            commentSection.innerHTML = `
                <div class="comments-list mb-2"></div>
                <form class="comment-form d-flex align-items-center gap-2">
                    <div class="user-avatar-small" style="width:28px;height:28px;"></div>
                    <input type="text" class="form-control form-control-sm comment-input" placeholder="Écrire un commentaire..." style="background:#fff;border-radius:1rem;">
                    <button type="submit" class="btn btn-primary btn-sm px-3">Publier</button>
                </form>
            `;
            postElement.appendChild(commentSection);
            // Gestion de l'ajout de commentaire
            const commentForm = commentSection.querySelector('.comment-form');
            const commentsList = commentSection.querySelector('.comments-list');
            commentForm.addEventListener('submit', function(ev) {
                ev.preventDefault();
                const input = commentForm.querySelector('.comment-input');
                const text = input.value.trim();
                if (text) {
                    const commentDiv = document.createElement('div');
                    commentDiv.className = 'comment-item mb-1';
                    commentDiv.innerHTML = `<span class='fw-bold text-primary'>Vous :</span> <span>${text}</span>`;
                    commentsList.appendChild(commentDiv);
                    input.value = '';
                }
            });
            feedPostsEl.insertAdjacentElement('afterbegin', postElement);
            postInput.value = '';
            selectedPostMediaFile = null;
            selectedEmoji = '';
            selectedLocation = '';
            selectedLatLng = null;
            let preview = document.getElementById('postMediaPreview');
            if (preview) preview.remove();
            let locationPreview = document.getElementById('postLocationPreview');
            if (locationPreview) locationPreview.remove();
        });
    }

    // Ajout du bouton "Publier" dans la zone de publication, visible et aligné sous le champ de saisie
    const createPostForm = document.querySelector('.create-post-container form');
    if (createPostForm && !document.getElementById('publishPostBtn')) {
        // Vérifie s'il y a déjà un bouton publier
        const createPostDiv = createPostForm.querySelector('.create-post');
        if (createPostDiv) {
            const publishBtn = document.createElement('button');
            publishBtn.type = 'submit';
            publishBtn.className = 'btn btn-primary btn-sm w-100 mt-2'; // btn-sm pour petit bouton
            publishBtn.id = 'publishPostBtn';
            publishBtn.textContent = 'Publier';
            // Ajoute le bouton tout en bas de la zone de création de post
            createPostDiv.appendChild(publishBtn);
        }
    }
});