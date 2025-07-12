
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
    }
    try {
        const response = await fetch(`${API_URL}/home`, {
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
            }, 1200);        }
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
    ws.onopen = () => console.log('Connecté au WebSocket');
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.status === 'success' && data.conversation_id == currentConversationId) {
            displayMessage(data.message, 'received');
        }
    };
    ws.onclose = () => console.log('WebSocket déconnecté');
    ws.onerror = (error) => console.error('Erreur WebSocket:', error);
}

// Récupérer les conversations
async function fetchConversations() {
    try {
        const response = await fetch(`${API_URL}/conversations`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await response.json();
        if (data.status === 'success') {
            const conversationsList = document.querySelector('.conversations-list');
            conversationsList.innerHTML = '';
            data.conversations.forEach(conv => {
                const convItem = document.createElement('div');
                convItem.className = 'conversation-item';
                convItem.innerHTML = `
                    <strong>${conv.name || conv.participants}</strong>
                    <small>${conv.type === 'group' ? 'Groupe' : 'Privé'}</small>
                `;
                convItem.addEventListener('click', () => {
                    currentConversationId = conv.id;
                    document.getElementById('chat-title').textContent = conv.name || conv.participants;
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
        const response = await fetch(`${API_URL}/messages?conversation_id=${conversationId}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await response.json();
        if (data.status === 'success') {
            const messagesList = document.querySelector('.messages-list');
            messagesList.innerHTML = '';
            data.messages.forEach(msg => {
                displayMessage(msg, msg.sender_id === currentUser.id ? 'sent' : 'received');
            });
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des messages:', error);
    }
}

// Afficher un message
function displayMessage(message, type) {
    const messagesList = document.querySelector('.messages-list');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message-item ${type}`;
    msgDiv.innerHTML = `
        <div><strong>${message.username}</strong> (${new Date(message.created_at).toLocaleString()})</div>
        <div>${message.content}</div>
        ${message.media_url ? `<img src="${message.media_url}" style="max-width: 200px;" />` : ''}
        <small>${message.status || 'sent'}</small>
    `;
    messagesList.appendChild(msgDiv);
    messagesList.scrollTop = messagesList.scrollHeight;
}

// Envoyer un message
document.querySelector('.message-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentConversationId) {
        alert('Veuillez sélectionner une conversation');
        return;
    }
    const content = document.getElementById('message-input').value.trim();
    if (!content) return;

    try {
        // Envoyer via WebSocket
        ws.send(JSON.stringify({
            token: localStorage.getItem('token'),
            conversation_id: currentConversationId,
            content: content
        }));

        // Envoyer via API pour assurer la persistance
        const response = await fetch(`${API_URL}/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ conversation_id: currentConversationId, content })
        });
        const data = await response.json();
        if (data.status === 'success') {
            document.getElementById('message-input').value = '';
            displayMessage({
                id: data.message_id,
                content: content,
                created_at: new Date().toISOString(),
                username: currentUser.username,
                avatar_url: currentUser.avatar_url,
                status: 'sent'
            }, 'sent');
        }
    } catch (error) {
        console.error('Erreur lors de l\'envoi du message:', error);
        alert('Erreur lors de l\'envoi du message');
    }
});