(function () {
    // Variables
    const API_URL = 'https://socialconnect-94gz.onrender.com/api/users';
    const WS_URL = 'ws://socialconnect-94gz.onrender.com:8002';
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');
    const settingsBtn = document.getElementById('settings-btn');
    const settingsPanel = document.getElementById('settings-panel');
    const settingsClose = document.getElementById('settings-close');
    const emojiBtn = document.getElementById('emoji-btn');
    const emojiPanel = document.getElementById('emoji-panel');
    const messageForm = document.getElementById('message-form');
    const messageInput = document.getElementById('message-input');
    const messagesList = document.getElementById('messages-list');
    const conversationsList = document.getElementById('conversations-list');
    const newConversationBtn = document.getElementById('new-conversation-btn');
    const newConversationModal = document.getElementById('new-conversation-modal');
    const newConversationClose = document.getElementById('new-conversation-close');
    const newConversationForm = document.getElementById('new-conversation-form');
    const newConversationCancel = document.getElementById('new-conversation-cancel');
    const conversationType = document.getElementById('conversation-type');
    const groupNameField = document.getElementById('group-name-field');
    const groupName = document.getElementById('group-name');
    const conversationParticipants = document.getElementById('conversation-participants');
    const typingIndicator = document.getElementById('typing-indicator');
    const chatTitle = document.getElementById('chat-title');
    const chatStatus = document.getElementById('chat-status');
    const searchInput = document.getElementById('search-input');

    let currentConversation = null;
    let ws = null;
    let token = localStorage.getItem('token') || '';
    let user_id = localStorage.getItem('user_id') || null;
    let failedAttempts = 0;
    let typingTimeout = null;
    const maxAttempts = 3;

    // Fonction pour naviguer vers une page
    function navigateTo(path) {
        console.log(`Redirection vers ${path}`);
        window.location.href = path;
    }

    // Fonction fetchApi
    async function fetchApi(endpoint, method = 'GET', body = null, isFormData = false) {
        if (failedAttempts >= maxAttempts) {
            console.error('Nombre maximum de tentatives atteint, redirection vers /login');
            localStorage.removeItem('token');
            localStorage.removeItem('user_id');
            navigateTo('/login');
            return null;
        }

        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;
        if (body && !isFormData) headers['Content-Type'] = 'application/json';

        const options = { method, headers };
        if (body) {
            options.body = isFormData ? body : JSON.stringify(body);
        }

        try {
            console.log(`Requête API vers: ${API_URL}${endpoint}`, options);
            const response = await fetch(`${API_URL}${endpoint}`, options);
            console.log(`Réponse reçue pour ${endpoint}: ${response.status} ${response.statusText}`);
            if (response.status === 401) {
                failedAttempts++;
                console.error(`Erreur 401: Token invalide, tentative ${failedAttempts}/${maxAttempts}`);
                localStorage.removeItem('token');
                localStorage.removeItem('user_id');
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

    // Vérifier l'authentification
    async function checkAuth() {
        console.log('Démarrage de checkAuth:', new Date().toISOString());
        if (!token) {
            console.log('Aucun token trouvé, redirection vers /login');
            navigateTo('/login');
            return false;
        }

        try {
            const response = await fetchApi('/home.php');
            if (response.status === 'success') {
                console.log('Utilisateur authentifié:', response);
                user_id = response.user?.id || localStorage.getItem('user_id');
                if (user_id) localStorage.setItem('user_id', user_id);
                return true;
            } else {
                console.error('Erreur lors de l\'authentification:', response);
                localStorage.removeItem('token');
                localStorage.removeItem('user_id');
                navigateTo('/login');
                return false;
            }
        } catch (error) {
            console.error('Erreur lors de l\'authentification:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user_id');
            navigateTo('/login');
            return false;
        }
    }

    // Récupérer la liste des utilisateurs pour la sélection des participants
    async function fetchUsers() {
        try {
            const data = await fetchApi('/users.php');
            if (data.status === 'success' && Array.isArray(data.users)) {
                return data.users;
            } else {
                console.error('Réponse invalide de /users.php:', data);
                return [];
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs:', error);
            return [];
        }
    }

    // Remplir le sélecteur de participants
    async function populateParticipants() {
        const users = await fetchUsers();
        conversationParticipants.innerHTML = '';
        users.forEach(user => {
            if (user.id !== parseInt(user_id)) { // Exclure l'utilisateur connecté
                const option = document.createElement('option');
                option.value = user.id;
                option.textContent = user.username;
                conversationParticipants.appendChild(option);
            }
        });
    }

    // Afficher/masquer le champ de nom de groupe
    function toggleGroupNameField() {
        groupNameField.classList.toggle('hidden', conversationType.value !== 'group');
    }

    // Créer une nouvelle conversation
    async function createConversation() {
        const type = conversationType.value;
        const name = type === 'group' ? groupName.value.trim() : null;
        const participantIds = Array.from(conversationParticipants.selectedOptions).map(option => parseInt(option.value));

        if (type === 'private' && participantIds.length !== 1) {
            alert('Veuillez sélectionner exactement un participant pour une conversation privée.');
            return;
        }
        if (type === 'group' && !name) {
            alert('Veuillez entrer un nom pour le groupe.');
            return;
        }
        if (participantIds.length === 0) {
            alert('Veuillez sélectionner au moins un participant.');
            return;
        }

        try {
            const response = await fetchApi('/conversations.php', 'POST', {
                type,
                name,
                participants: participantIds
            });
            if (response.status === 'success') {
                newConversationModal.classList.add('hidden');
                newConversationForm.reset();
                await fetchConversations();
            } else {
                alert('Erreur lors de la création de la conversation : ' + (response.message || 'Erreur inconnue'));
            }
        } catch (error) {
            alert('Erreur lors de la création de la conversation : ' + error.message);
        }
    }

    // Envoyer un message
    async function sendMessage(content) {
        if (!currentConversation) {
            alert('Veuillez sélectionner une conversation.');
            return;
        }
        if (!content.trim()) {
            alert('Le message ne peut pas être vide.');
            return;
        }

        try {
            // Envoyer via API
            const response = await fetchApi(`/messages.php?conversation_id=${currentConversation.id}`, 'POST', {
                content: content
            });
            if (response.status === 'success') {
                // Envoyer via WebSocket
                if (ws && ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({
                        action: 'message',
                        conversation_id: currentConversation.id,
                        message: {
                            id: response.message_id,
                            sender_id: user_id,
                            username: 'Vous', // À remplacer par le vrai username si nécessaire
                            content: content,
                            created_at: new Date().toISOString(),
                            avatar_url: null
                        }
                    }));
                }
                messageInput.value = '';
                currentConversation.messages = await fetchMessages(currentConversation.id);
                renderMessages();
            } else {
                alert('Erreur lors de l\'envoi du message : ' + (response.message || 'Erreur inconnue'));
            }
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message:', error);
            alert('Erreur lors de l\'envoi du message : ' + error.message);
        }
    }

    

   // Initialiser WebSocket
    function initWebSocket() {
        ws = new WebSocket(WS_URL);

        ws.onopen = () => {
            console.log('Connexion WebSocket établie');
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
        if (data.status === 'success' && data.action === 'message') {
            if (currentConversation && data.conversation_id === currentConversation.id) {
                currentConversation.messages.push({
                    id: data.message.id,
                    sender: data.message.username,
                    content: data.message.content,
                    time: new Date(data.message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    sent: data.message.sender_id === parseInt(user_id)
                });
                renderMessages();
            }
            fetchConversations();
        } else if (data.status === 'error') {
            console.error('Erreur WebSocket:', data.message);
        }
    };

        ws.onclose = () => {
            console.log('Connexion WebSocket fermée. Tentative de reconnexion...');
            setTimeout(initWebSocket, 5000);
        };

        ws.onerror = (error) => {
            console.error('Erreur WebSocket:', error);
        };
}

// Polling fallback for messages
function startPolling() {
    setInterval(async () => {
        if (!ws || ws.readyState !== WebSocket.OPEN) {
            console.log('WebSocket non connecté, polling pour les messages...');
            if (currentConversation) {
                currentConversation.messages = await fetchMessages(currentConversation.id);
                renderMessages();
            }
            await fetchConversations();
        }
    }, 30000); // Poll every 30 seconds
}


    // Initialiser l'application
    async function init() {
        const authResult = await checkAuth();
        if (!authResult) return;

        initWebSocket();
        startPolling();
        await fetchConversations();
        await populateParticipants();
        setupEventListeners();
    }

    // Récupérer les conversations depuis l'API
    async function fetchConversations() {
        try {
            const data = await fetchApi('/conversations.php');
            if (data.status === 'success' && Array.isArray(data.conversations)) {
                renderConversations(data.conversations);
                return data.conversations;
            } else {
                console.error('Réponse invalide de /conversations.php:', data);
                return [];
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des conversations:', error);
            return [];
        }
    }

    // Récupérer les messages d'une conversation
    async function fetchMessages(conversationId) {
        try {
            const data = await fetchApi(`/messages.php?conversation_id=${conversationId}`);
            if (data.status === 'success' && Array.isArray(data.messages)) {
                return data.messages.map(message => ({
                    id: message.id,
                    sender: message.username,
                    content: message.content,
                    time: new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    sent: message.sender_id === parseInt(user_id)
                }));
            } else {
                console.error('Réponse invalide pour les messages:', data);
                return [];
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des messages:', error);
            return [];
        }
    }

    // Rendre la liste des conversations
    async function renderConversations(conversations) {
        conversationsList.innerHTML = '';
        if (!conversations || conversations.length === 0) {
            conversationsList.innerHTML = '<div class="text-center py-5 text-muted">Aucune conversation disponible</div>';
            return;
        }

        conversations.forEach(conversation => {
            const conversationItem = document.createElement('div');
            conversationItem.className = 'conversation-item';
            conversationItem.dataset.id = conversation.id;

            if (currentConversation && currentConversation.id === conversation.id) {
                conversationItem.classList.add('active');
            }

            // Gérer le cas où name est null ou undefined
            const displayName = conversation.name || (conversation.participants ? conversation.participants.split(',')[0] : 'Conversation sans nom');
            const avatarInitial = displayName.charAt(0).toUpperCase();

            conversationItem.innerHTML = `
                <div class="conversation-item-avatar" style="background: ${getRandomColor()}">${avatarInitial}</div>
                <div class="conversation-item-content">
                    <div class="conversation-item-name">${displayName}</div>
                    <div class="conversation-item-message">${conversation.last_message || 'Aucun message'}</div>
                </div>
                <div class="conversation-item-time">${conversation.last_message_time || ''}</div>
                ${conversation.unread_count > 0 ? `<div class="conversation-item-badge">${conversation.unread_count}</div>` : ''}
            `;

            conversationItem.addEventListener('click', async () => {
                conversation.messages = await fetchMessages(conversation.id);
                setCurrentConversation(conversation);
            });

            conversationsList.appendChild(conversationItem);
        });
        // Sélectionner la première conversation au démarrage
        /*if (conversations.length > 0 && !currentConversation) {
            conversations[0].messages =  fetchMessages(conversations[0].id);
            setCurrentConversation(conversations[0]);
        }*/
       // Sélectionner la première conversation au démarrage
        if (conversations.length > 0 && !currentConversation) {
            conversations[0].messages = await fetchMessages(conversations[0].id); // Ajoute await
            setCurrentConversation(conversations[0]);
        }
    }

    // Définir la conversation actuelle
    async function setCurrentConversation(conversation) {
        currentConversation = conversation;
        chatTitle.textContent = conversation.name || (conversation.participants ? conversation.participants.split(',')[0] : 'Conversation sans nom');
        chatStatus.textContent = conversation.online ? 'En ligne' : 'Hors ligne';

        document.querySelectorAll('.conversation-item').forEach(item => {
            item.classList.remove('active');
            if (parseInt(item.dataset.id) === conversation.id) {
                item.classList.add('active');
            }
        });

        renderMessages();

        try {
            await fetchApi(`/messages.php?conversation_id=${conversation.id}&action=mark-read`, 'POST');
            fetchConversations();
        } catch (error) {
            console.error('Erreur lors du marquage des messages comme lus:', error);
        }
    }

    // Rendre les messages de la conversation actuelle
    /*
    function renderMessages() {
        messagesList.innerHTML = '';

        if (!currentConversation) {
            messagesList.innerHTML = '<div class="text-center py-5 text-muted">Sélectionnez une conversation pour commencer à discuter</div>';
            return;
        }

        currentConversation.messages.forEach(message => {
            const messageItem = document.createElement('div');
            messageItem.className = `message-item ${message.sent ? 'sent' : 'received'}`;

            messageItem.innerHTML = `
                <div class="message-header">
                    <div class="message-sender">${message.sender}</div>
                    <div class="message-time">${message.time}</div>
                </div>
                <div class="message-content">${message.content}</div>
                <div class="message-actions">
                    <button class="message-action-btn"><i class="far fa-thumbs-up"></i></button>
                    <button class="message-action-btn"><i class="far fa-comment"></i></button>
                    <button class="message-action-btn"><i class="fas fa-reply"></i></button>
                </div>
            `;

            messagesList.appendChild(messageItem);
        });

        scrollToBottom();
    }*/
        function renderMessages() {
            messagesList.innerHTML = '';

        
            if (!currentConversation) {
                messagesList.innerHTML = '<div class="text-center py-5 text-muted">Sélectionnez une conversation pour commencer à discuter</div>';
                return;
            }
        
            // Vérifie si messages est un tableau
            if (!Array.isArray(currentConversation.messages)) {
                console.error('currentConversation.messages n\'est pas un tableau:', currentConversation.messages);
                messagesList.innerHTML = '<div class="text-center py-5 text-muted">Aucun message disponible</div>';
                return;
            }
        
            currentConversation.messages.forEach(message => {
                const messageItem = document.createElement('div');
                messageItem.className = `message-item ${message.sent ? 'sent' : 'received'}`;
        
                messageItem.innerHTML = `
                    <div class="message-header">
                        <div class="message-sender">${message.sender}</div>
                        <div class="message-time">${message.time}</div>
                    </div>
                    <div class="message-content">${message.content}</div>
                    <div class="message-actions">
                        <button class="message-action-btn"><i class="far fa-thumbs-up"></i></button>
                        <button class="message-action-btn"><i class="far fa-comment"></i></button>
                        <button class="message-action-btn"><i class="fas fa-reply"></i></button>
                    </div>
                `;
        
                messagesList.appendChild(messageItem);

            });
        
            scrollToBottom();

        }

    // Faire défiler jusqu'en bas
    function scrollToBottom() {
        messagesList.scrollTop = messagesList.scrollHeight;
    }

    // Générer une couleur aléatoire pour l'avatar
    function getRandomColor() {
        const colors = ['#4a6fa5', '#ff7e5f', '#6b8cba', '#3a5784', '#28a745', '#ffc107', '#17a2b8', '#6c757d'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // Show typing indicator
    function showTypingIndicator() {
        typingIndicator.style.display = 'block';
        scrollToBottom();
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                action: 'typing',
                conversation_id: currentConversation?.id,
                user_id: user_id
            }));
        }
    }

    // Hide typing indicator
    function hideTypingIndicator() {
        typingIndicator.style.display = 'none';
    }

    // Configurer les écouteurs d'événements
    function setupEventListeners() {
        hamburger.addEventListener('click', () => {
            sidebar.classList.toggle('show');
        });

        settingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            settingsPanel.classList.toggle('show');
        });

        settingsClose.addEventListener('click', () => {
            settingsPanel.classList.remove('show');
        });

        document.addEventListener('click', (e) => {
            if (!settingsPanel.contains(e.target) && e.target !== settingsBtn) {
                settingsPanel.classList.remove('show');
            }
        });

        emojiBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            emojiPanel.classList.toggle('show');
        });

        document.addEventListener('click', (e) => {
            if (!emojiPanel.contains(e.target) && e.target !== emojiBtn) {
                emojiPanel.classList.remove('show');
            }
        });

        document.querySelectorAll('.emoji-item').forEach(emoji => {
            emoji.addEventListener('click', () => {
                messageInput.value += emoji.dataset.emoji;
                messageInput.focus();
            });
        });

        // Gestion de la modale pour nouvelle conversation
        newConversationBtn.addEventListener('click', () => {
            newConversationModal.classList.remove('hidden');
            toggleGroupNameField();
        });

        newConversationClose.addEventListener('click', () => {
            newConversationModal.classList.add('hidden');
            newConversationForm.reset();
        });

        newConversationCancel.addEventListener('click', () => {
            newConversationModal.classList.add('hidden');
            newConversationForm.reset();
        });

        conversationType.addEventListener('change', toggleGroupNameField);

        newConversationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await createConversation();
        });

        // Gestion de l'envoi de message
        messageForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const content = messageInput.value.trim();
            if (content) {
                await sendMessage(content);
                clearTimeout(typingTimeout);
                hideTypingIndicator();
            }
        });

        // Typing indicator event
        messageInput.addEventListener('input', () => {
            if (messageInput.value.trim()) {
                showTypingIndicator();
                clearTimeout(typingTimeout);
                typingTimeout = setTimeout(hideTypingIndicator, 3000);
            } else {
                hideTypingIndicator();
            }
        });


        // Gestion de la recherche
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase();
            document.querySelectorAll('.conversation-item').forEach(item => {
                const name = item.querySelector('.conversation-item-name').textContent.toLowerCase();
                item.style.display = name.includes(searchTerm) ? '' : 'none';
            });
        });
    }

    // Afficher l'indicateur de saisie
    function showTypingIndicator() {
        typingIndicator.style.display = 'block';
        scrollToBottom();
    }

    // Cacher l'indicateur de saisie
    function hideTypingIndicator() {
        typingIndicator.style.display = 'none';
    }

    // Initialiser l'application
    init();
})();
