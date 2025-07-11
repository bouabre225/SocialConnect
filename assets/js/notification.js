document.addEventListener('DOMContentLoaded', function() {
    // Éléments du DOM
    const notificationList = document.getElementById('notification-list');
    const tabs = document.querySelectorAll('.notification-tab');
    const markAllReadBtn = document.getElementById('mark-all-read');
    
    // Charger les notifications initiales
    loadNotifications('all');
    
    // Gestion des onglets
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            loadNotifications(this.dataset.tab);
        });
    });
    
    // Marquer toutes les notifications comme lues
    markAllReadBtn.addEventListener('click', function() {
        markAllNotificationsAsRead();
    });
    
    // Fonction pour charger les notifications
    function loadNotifications(filter) {
        fetch('notification.php?action=get&filter=' + filter)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    renderNotifications(data.notifications);
                } else {
                    console.error('Erreur:', data.message);
                }
            })
            .catch(error => console.error('Erreur:', error));
    }
    
    // Fonction pour afficher les notifications
    function renderNotifications(notifications) {
        if (notifications.length === 0) {
            notificationList.innerHTML = `
                <div class="notification-empty">
                    <i class="far fa-bell"></i>
                    <p>Aucune notification pour le moment</p>
                </div>
            `;
            return;
        }
        
        notificationList.innerHTML = '';
        
        notifications.forEach(notification => {
            const notificationItem = document.createElement('div');
            notificationItem.className = `notification-item ${notification.is_read ? '' : 'unread'}`;
            notificationItem.dataset.id = notification.id;
            
            // Déterminer l'icône en fonction du type de notification
            let iconClass = 'far fa-bell';
            if (notification.type === 'friend_request') iconClass = 'fas fa-user-plus';
            else if (notification.type === 'post_like') iconClass = 'fas fa-thumbs-up';
            else if (notification.type === 'message') iconClass = 'fas fa-envelope';
            else if (notification.type === 'comment') iconClass = 'fas fa-comment';
            
            notificationItem.innerHTML = `
                <div class="notification-avatar">
                    <i class="${iconClass}"></i>
                </div>
                <div class="notification-content">
                    <div class="notification-text">${notification.content}</div>
                    <div class="notification-time">${formatTime(notification.created_at)}</div>
                </div>
            `;
            
            // Ajouter un événement de clic pour marquer comme lu
            notificationItem.addEventListener('click', function() {
                if (!notification.is_read) {
                    markNotificationAsRead(notification.id);
                    this.classList.remove('unread');
                }
            });
            
            notificationList.appendChild(notificationItem);
        });
    }
    
    // Fonction pour formater la date/heure
    function formatTime(timestamp) {
        const now = new Date();
        const date = new Date(timestamp);
        const diff = Math.floor((now - date) / 1000); // différence en secondes
        
        if (diff < 60) return 'À l\'instant';
        if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} minutes`;
        if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)} heures`;
        if (diff < 604800) return `Il y a ${Math.floor(diff / 86400)} jours`;
        
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }
    
    // Fonction pour marquer une notification comme lue
    function markNotificationAsRead(notificationId) {
        fetch('notification.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'mark_read',
                notification_id: notificationId
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status !== 'success') {
                console.error('Erreur:', data.message);
            }
        })
        .catch(error => console.error('Erreur:', error));
    }
    
    // Fonction pour marquer toutes les notifications comme lues
    function markAllNotificationsAsRead() {
        fetch('notification.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'mark_all_read'
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // Recharger les notifications
                const activeTab = document.querySelector('.notification-tab.active').dataset.tab;
                loadNotifications(activeTab);
            } else {
                console.error('Erreur:', data.message);
            }
        })
        .catch(error => console.error('Erreur:', error));
    }
});