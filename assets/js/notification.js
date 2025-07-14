const notifications = [
    { id: 1, type: 'security', title: 'Nouvelle connexion détectée', message: 'Une nouvelle connexion a été détectée depuis un appareil non reconnu.', time: '2 minutes', unread: true, icon: 'fas fa-shield-alt', iconClass: 'danger' },
    { id: 2, type: 'system', title: 'Mise à jour système disponible', message: 'Une nouvelle version du système est disponible pour téléchargement.', time: '15 minutes', unread: true, icon: 'fas fa-download', iconClass: 'info' },
    { id: 3, type: 'social', title: 'Nouveau message reçu', message: 'Vous avez reçu un nouveau message dans votre boîte de réception.', time: '1 heure', unread: true, icon: 'fas fa-envelope', iconClass: 'primary' },
    { id: 4, type: 'system', title: 'Sauvegarde terminée', message: 'La sauvegarde automatique de vos données a été effectuée avec succès.', time: '2 heures', unread: false, icon: 'fas fa-cloud-upload-alt', iconClass: 'success' },
    { id: 5, type: 'security', title: 'Mot de passe modifié', message: 'Votre mot de passe a été modifié avec succès.', time: '3 heures', unread: true, icon: 'fas fa-key', iconClass: 'warning' },
    { id: 6, type: 'update', title: 'Maintenance programmée', message: 'Une maintenance système est prévue demain de 2h à 4h du matin.', time: '5 heures', unread: false, icon: 'fas fa-tools', iconClass: 'warning' },
    { id: 7, type: 'social', title: 'Invitation reçue', message: 'Vous avez été invité à rejoindre un nouveau projet collaboratif.', time: '6 heures', unread: false, icon: 'fas fa-users', iconClass: 'info' },
    { id: 8, type: 'system', title: 'Espace de stockage faible', message: 'Votre espace de stockage est presque plein. Veuillez libérer de l\'espace.', time: '1 jour', unread: true, icon: 'fas fa-hdd', iconClass: 'danger' },
    { id: 9, type: 'security', title: 'Tentative de connexion bloquée', message: 'Une tentative de connexion suspecte a été automatiquement bloquée.', time: '2 jours', unread: false, icon: 'fas fa-ban', iconClass: 'danger' },
    { id: 10, type: 'system', title: 'Rapport mensuel disponible', message: 'Votre rapport d\'activité mensuel est maintenant disponible.', time: '3 jours', unread: false, icon: 'fas fa-chart-bar', iconClass: 'info' },
    { id: 11, type: 'update', title: 'Nouvelles fonctionnalités', message: 'Découvrez les nouvelles fonctionnalités ajoutées dans cette version.', time: '4 jours', unread: false, icon: 'fas fa-star', iconClass: 'success' },
    { id: 12, type: 'social', title: 'Commentaire ajouté', message: 'Un nouveau commentaire a été ajouté à votre publication.', time: '5 jours', unread: false, icon: 'fas fa-comment', iconClass: 'primary' }
];

let currentTab = 'all';
let currentFilter = 'all';

// Éléments DOM
const notificationList = document.getElementById('notification-list');
const tabs = document.querySelectorAll('.notification-tab');
const markAllReadBtn = document.getElementById('mark-all-read');
const typeFilter = document.getElementById('type-filter');
const totalCount = document.getElementById('total-count');
const unreadCount = document.getElementById('unread-count');

// Fonction pour créer une notification
function createNotificationElement(notification) {
    const div = document.createElement('div');
    div.className = `notification-item ${notification.unread ? 'unread' : ''} animate__animated animate__fadeInUp`;
    div.dataset.id = notification.id;
    div.dataset.type = notification.type;
    div.innerHTML = `
        <div class="notification-icon ${notification.iconClass}">
            <i class="${notification.icon}"></i>
        </div>
        <div class="notification-content">
            <div class="notification-title">${notification.title}</div>
            <div class="notification-message">${notification.message}</div>
            <div class="notification-time">
                <i class="fas fa-clock"></i> Il y a ${notification.time}
            </div>
        </div>
        <div class="notification-actions">
            ${notification.unread ? '<button class="action-btn mark-read" onclick="markAsRead(' + notification.id + ')"><i class="fas fa-check"></i> Marquer comme lu</button>' : ''}
            <button class="action-btn delete" onclick="deleteNotification(' + notification.id + ')"><i class="fas fa-trash"></i> Supprimer</button>
        </div>
    `;
    return div;
}

// Fonction pour afficher les notifications
function displayNotifications() {
    notificationList.innerHTML = '';
    let filteredNotifications = notifications.filter(notification => {
        const tabMatch = currentTab === 'all' || (currentTab === 'unread' && notification.unread);
        const typeMatch = currentFilter === 'all' || notification.type === currentFilter;
        return tabMatch && typeMatch;
    });

    if (filteredNotifications.length === 0) {
        notificationList.innerHTML = `
            <div class="notification-empty animate__animated animate__fadeIn">
                <i class="far fa-bell"></i>
                <p>Aucune notification pour le moment</p>
            </div>
        `;
        return;
    }

    filteredNotifications.forEach((notification, index) => {
        const element = createNotificationElement(notification);
        element.style.animationDelay = `${index * 0.1}s`;
        notificationList.appendChild(element);
    });
}

// Fonction pour mettre à jour les compteurs
function updateCounters() {
    const total = notifications.length;
    const unread = notifications.filter(n => n.unread).length;
    totalCount.textContent = total;
    unreadCount.textContent = unread;

    // Mettre à jour les badges des onglets
    document.querySelector('[data-tab="all"] .notification-badge').textContent = total;
    document.querySelector('[data-tab="unread"] .notification-badge').textContent = unread;
}

// Fonction pour marquer comme lu
function markAsRead(id) {
    const notification = notifications.find(n => n.id === id);
    if (notification) {
        notification.unread = false;
        updateCounters();
        displayNotifications();
    }
}

// Fonction pour supprimer une notification
function deleteNotification(id) {
    const index = notifications.findIndex(n => n.id === id);
    if (index !== -1) {
        const element = document.querySelector(`[data-id="${id}"]`);
        element.classList.add('animate__animated', 'animate__fadeOutRight');
        setTimeout(() => {
            notifications.splice(index, 1);
            updateCounters();
            displayNotifications();
        }, 500);
    }
}

// Fonction pour marquer toutes comme lues
function markAllAsRead() {
    notifications.forEach(notification => {
        notification.unread = false;
    });
    updateCounters();
    displayNotifications();
}

// Gestionnaires d'événements
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentTab = tab.dataset.tab;
        displayNotifications();
    });
});

markAllReadBtn.addEventListener('click', markAllAsRead);
typeFilter.addEventListener('change', (e) => {
    currentFilter = e.target.value;
    displayNotifications();
});

// Initialisation
updateCounters();
displayNotifications();

// Ajouter des nouvelles notifications périodiquement pour la démonstration
setInterval(() => {
    const newNotification = {
        id: Date.now(),
        type: ['system', 'security', 'social', 'update'][Math.floor(Math.random() * 4)],
        title: 'Nouvelle notification',
        message: 'Une nouvelle notification vient d\'arriver.',
        time: 'maintenant',
        unread: true,
        icon: 'fas fa-bell',
        iconClass: 'primary'
    };
    notifications.unshift(newNotification);
    updateCounters();
    if (currentTab === 'all' || currentTab === 'unread') {
        displayNotifications();
    }
}, 30000); 