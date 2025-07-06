document.addEventListener('DOMContentLoaded', function() {
    // Envoi de message dynamique
    const input = document.querySelector('.message-input');
    const sendBtn = document.querySelector('.send-button');
    const messagesContainer = document.querySelector('.messages-container');

    function sendMessage() {
        const text = input.value.trim();
        if (!text) return;
        const now = new Date();
        const time = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
        const msg = document.createElement('div');
        msg.className = 'message sent';
        msg.innerHTML = `<div class="message-content">${text}<div class="message-time">${time}</div></div>`;
        messagesContainer.appendChild(msg);
        input.value = '';
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') sendMessage();
    });
});