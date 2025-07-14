

let currentUser = null;
let currentConversationId = null;
let ws = null;

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
});

// Vérifier l'authentification
async function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        setTimeout(() => {
            history.pushState(null, '', '/login');
            router();
        }, 1200);
        return;
    }
    try {
        const response = await fetch(`${API_URL}/auth/check`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok && data.status === 'success') {
            currentUser = data.user;
            initWebSocket();
            fetchConversations();
        } else {
            setTimeout(() => {
                history.pushState(null, '', '/login');
                router();
            }, 1200);
        }
    } catch (error) {
        console.error('Erreur d\'authentification:', error);
        setTimeout(() => {
            history.pushState(null, '', '/login');
            router();
        }, 1200);
    }
}

// Initialiser WebSocket
function initWebSocket() {
    ws = new WebSocket(WS_URL);
    ws.onopen = () => {
        console.log('Connecté au WebSocket');
        ws.send(JSON.stringify({ token: localStorage.getItem('token'), action: 'join' }));
    };
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.status === 'success' && data.conversation_id === currentConversationId) {
            displayMessage(data.message, 'received');
            markAsRead(data.message.id);
        }
    };
    ws.onclose = () => console.log('WebSocket déconnecté');
    ws.onerror = (error) => console.error('Erreur WebSocket:', error);
}

// Récupérer les conversations
async function fetchConversations() {
    try {
        const response = await fetch(`${API_URL1}/conversations`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await response.json();
        if (data.status === 'success') {
            const conversationsList = document.getElementById('conversations-list');
            conversationsList.innerHTML = '';
            data.conversations.forEach(conv => {
                const convItem = document.createElement('div');
                convItem.className = 'conversation-item d-flex justify-content-between align-items-center';
                convItem.innerHTML = `
                    <div>
                        <strong>${conv.name || conv.participants.join(', ')}</strong>
                        <small class="d-block text-muted">${conv.type === 'group' ? 'Groupe' : 'Privé'} - ${conv.last_message?.content || 'Aucun message'}</small>
                    </div>
                    <span class="badge bg-primary rounded-pill">${conv.unread_count || 0}</span>
                `;
                convItem.addEventListener('click', () => {
                    currentConversationId = conv.id;
                    document.getElementById('chat-title').textContent = conv.name || conv.participants.join(', ');
                    document.getElementById('chat-status').textContent = 'En ligne';
                    fetchMessages(conv.id);
                });
                conversationsList.appendChild(convItem);
            });
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des conversations:', error);
    }
}

// Récupérer les messages d'une conversation
async function fetchMessages(conversationId) {
    try {
        const response = await fetch(`${API_URL1}/messages?conversation_id=${conversationId}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await response.json();
        if (data.status === 'success') {
            const messagesList = document.getElementById('messages-list');
            messagesList.innerHTML = '';
            data.messages.forEach(msg => {
                displayMessage(msg, msg.sender_id === currentUser.id ? 'sent' : 'received');
            });
            markAsReadAll(conversationId);
            messagesList.scrollTop = messagesList.scrollHeight;
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des messages:', error);
    }
}

// Afficher un message
function displayMessage(message, type) {
    const messagesList = document.getElementById('messages-list');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message-item ${type} shadow-sm`;
    msgDiv.innerHTML = `
        <div class="d-flex justify-content-between">
            <strong>${message.username}</strong>
            <small class="text-muted">${new Date(message.created_at).toLocaleString()}</small>
        </div>
        <div class="mt-1">${message.content}</div>
        ${message.media_url ? `<img src="${message.media_url}" class="img-fluid mt-2" style="max-width: 250px; border-radius: 8px;" />` : ''}
        <small class="text-muted">${message.status || 'envoyé'}</small>
    `;
    messagesList.appendChild(msgDiv);
    messagesList.scrollTop = messagesList.scrollHeight;
}

// Envoyer un message
document.getElementById('message-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentConversationId) {
        alert('Veuillez sélectionner une conversation');
        return;
    }
    const content = document.getElementById('message-input').value.trim();
    if (!content && !document.getElementById('media-input').files.length) return;

    const formData = new FormData();
    formData.append('conversation_id', currentConversationId);
    formData.append('content', content);
    if (document.getElementById('media-input').files[0]) {
        formData.append('media', document.getElementById('media-input').files[0]);
    }

    try {
        const response = await fetch(`${API_URL1}/message`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            body: formData
        });
        const data = await response.json();
        if (data.status === 'success') {
            const message = {
                id: data.message_id,
                content: content,
                created_at: new Date().toISOString(),
                username: currentUser.username,
                avatar_url: currentUser.avatar_url,
                status: 'envoyé',
                media_url: data.media_url || null
            };
            ws.send(JSON.stringify({ token: localStorage.getItem('token'), conversation_id: currentConversationId, message }));
            document.getElementById('message-input').value = '';
            document.getElementById('media-input').value = '';
            displayMessage(message, 'sent');
        }
    } catch (error) {
        console.error('Erreur lors de l\'envoi du message:', error);
        alert('Erreur lors de l\'envoi du message');
    }
});

// Marquer un message comme lu
async function markAsRead(messageId) {
    try {
        await fetch(`${API_URL1}/message/${messageId}/read`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
    } catch (error) {
        console.error('Erreur lors du marquage comme lu:', error);
    }
}

// Marquer tous les messages comme lus
async function markAsReadAll(conversationId) {
    try {
        await fetch(`${API_URL1}/messages/${conversationId}/read`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
    } catch (error) {
        console.error('Erreur lors du marquage de tous comme lus:', error);
    }
}

// Nouvelle conversation
document.getElementById('new-conversation-btn').addEventListener('click', () => {
    const participant = prompt('Entrez l\'ID ou le nom de l\'utilisateur :');
    if (participant) {
        fetch(`${API_URL1}/conversations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ participant })
        }).then(response => response.json())
          .then(data => {
              if (data.status === 'success') fetchConversations();
          })
          .catch(error => console.error('Erreur lors de la création:', error));
    }
});

// Attacher un média
document.getElementById('attach-media-btn').addEventListener('click', () => {
    document.getElementById('media-input').click();
});
