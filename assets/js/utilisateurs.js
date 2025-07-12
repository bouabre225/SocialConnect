const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const themeIcon = themeToggle.querySelector('i');

const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') {
    body.classList.add('dark-theme');
    themeIcon.className = 'bi bi-sun-fill';
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    const isDark = body.classList.contains('dark-theme');
    
    themeIcon.className = isDark ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    themeToggle.style.transform = 'scale(0.8)';
    setTimeout(() => {
        themeToggle.style.transform = 'scale(1)';
    }, 150);
});

let users = [
    {
        id: 1,
        nom: "KORE",
        prenom: "Ange",
        email: "ange.kore@gmail.com",
        dateCreation: "2025-07-11",
        status: "actif"
    }
];

function renderUsers() {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '';

    if (users.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-5">
                    <div class="empty-state">
                        <i class="bi bi-people"></i>
                        <h4>Aucun utilisateur trouvé</h4>
                        <p>Les utilisateurs apparaîtront ici lorsqu'ils s'inscriront.</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    users.forEach((user, index) => {
        const tr = document.createElement('tr');
        tr.className = `animate__animated animate__fadeInUp`;
        tr.style.animationDelay = `${index * 0.1}s`;
        
        let statusBadge = '';
        if (user.status === 'banned') {
            statusBadge = '<span class="user-status status-banned">Banni</span>';
        } else if (user.status === 'blocked') {
            statusBadge = '<span class="user-status status-blocked">Bloqué</span>';
        } else {
            statusBadge = '<span class="user-status status-active">Actif</span>';
        }

        let actions = '';
        if (user.status === 'banned') {
            actions = `
                <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-action btn-delete" onclick="deleteUser(${user.id}, '${user.prenom} ${user.nom}')">
                        <i class="bi bi-trash"></i> Supprimer
                    </button>
                </div>
            `;
        } else if (user.status === 'blocked') {
            actions = `
                <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-action btn-delete" onclick="deleteUser(${user.id}, '${user.prenom} ${user.nom}')">
                        <i class="bi bi-trash"></i> Supprimer
                    </button>
                    <button class="btn btn-sm btn-action btn-success" onclick="unblockUser(${user.id}, '${user.prenom} ${user.nom}')">
                        <i class="bi bi-unlock"></i> Débloquer
                    </button>
                    <button class="btn btn-sm btn-action btn-ban" onclick="banUser(${user.id}, '${user.prenom} ${user.nom}')">
                        <i class="bi bi-ban"></i> Bannir
                    </button>
                </div>
            `;
        } else {
            actions = `
                <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-action btn-delete" onclick="deleteUser(${user.id}, '${user.prenom} ${user.nom}')">
                        <i class="bi bi-trash"></i> Supprimer
                    </button>
                    <button class="btn btn-sm btn-action btn-block" onclick="blockUser(${user.id}, '${user.prenom} ${user.nom}')">
                        <i class="bi bi-lock"></i> Bloquer
                    </button>
                    <button class="btn btn-sm btn-action btn-ban" onclick="banUser(${user.id}, '${user.prenom} ${user.nom}')">
                        <i class="bi bi-ban"></i> Bannir
                    </button>
                </div>
            `;
        }

        tr.innerHTML = `
            <td><span class="badge bg-primary">#${user.id}</span></td>
            <td>${user.nom}</td>
            <td>${user.prenom}</td>
            <td>${user.email}</td>
            <td><span class="badge-date">${user.dateCreation}</span></td>
            <td>${statusBadge}</td>
            <td>${actions}</td>
        `;
        
        tbody.appendChild(tr);
    });
}

let currentAction = null;
let currentUserId = null;
let currentUserName = null;
function deleteUser(userId, userName) {
    currentAction = 'delete';
    currentUserId = userId;
    currentUserName = userName;
    
    document.getElementById('confirmationModalLabel').textContent = 'Confirmer la suppression';
    document.getElementById('confirmationModalBody').innerHTML = `
        <div class="text-center">
            <i class="bi bi-exclamation-triangle text-danger" style="font-size: 3rem;"></i>
            <h5 class="mt-3">Êtes-vous sûr de vouloir supprimer l'utilisateur ?</h5>
            <p class="text-muted"><strong>${userName}</strong> (ID: ${userId})</p>
            <div class="alert alert-warning">
                <i class="bi bi-warning"></i> Cette action est irréversible !
            </div>
        </div>
    `;
    document.getElementById('confirmActionBtn').className = 'btn btn-danger';
    document.getElementById('confirmActionBtn').innerHTML = '<i class="bi bi-trash"></i> Supprimer';
    
    new bootstrap.Modal(document.getElementById('confirmationModal')).show();
}

function blockUser(userId, userName) {
    currentAction = 'block';
    currentUserId = userId;
    currentUserName = userName;
    
    document.getElementById('confirmationModalLabel').textContent = 'Confirmer le blocage';
    document.getElementById('confirmationModalBody').innerHTML = `
        <div class="text-center">
            <i class="bi bi-lock text-warning" style="font-size: 3rem;"></i>
            <h5 class="mt-3">Êtes-vous sûr de vouloir bloquer l'utilisateur ?</h5>
            <p class="text-muted"><strong>${userName}</strong> (ID: ${userId})</p>
            <div class="alert alert-info">
                <i class="bi bi-info-circle"></i> L'utilisateur ne pourra plus se connecter temporairement.
            </div>
        </div>
    `;
    document.getElementById('confirmActionBtn').className = 'btn btn-warning';
    document.getElementById('confirmActionBtn').innerHTML = '<i class="bi bi-lock"></i> Bloquer';
    
    new bootstrap.Modal(document.getElementById('confirmationModal')).show();
}

function banUser(userId, userName) {
    currentAction = 'ban';
    currentUserId = userId;
    currentUserName = userName;
    
    document.getElementById('confirmationModalLabel').textContent = 'Confirmer le bannissement';
    document.getElementById('confirmationModalBody').innerHTML = `
        <div class="text-center">
            <i class="bi bi-ban text-danger" style="font-size: 3rem;"></i>
            <h5 class="mt-3">Êtes-vous sûr de vouloir bannir l'utilisateur ?</h5>
            <p class="text-muted"><strong>${userName}</strong> (ID: ${userId})</p>
            <div class="alert alert-danger">
                <i class="bi bi-exclamation-triangle"></i> L'utilisateur sera définitivement banni de la plateforme !
            </div>
        </div>
    `;
    document.getElementById('confirmActionBtn').className = 'btn btn-danger';
    document.getElementById('confirmActionBtn').innerHTML = '<i class="bi bi-ban"></i> Bannir';
    
    new bootstrap.Modal(document.getElementById('confirmationModal')).show();
}

function unblockUser(userId, userName) {
    currentAction = 'unblock';
    currentUserId = userId;
    currentUserName = userName;
    
    document.getElementById('confirmationModalLabel').textContent = 'Confirmer le déblocage';
    document.getElementById('confirmationModalBody').innerHTML = `
        <div class="text-center">
            <i class="bi bi-unlock text-success" style="font-size: 3rem;"></i>
            <h5 class="mt-3">Êtes-vous sûr de vouloir débloquer l'utilisateur ?</h5>
            <p class="text-muted"><strong>${userName}</strong> (ID: ${userId})</p>
            <div class="alert alert-success">
                <i class="bi bi-info-circle"></i> L'utilisateur pourra à nouveau se connecter.
            </div>
        </div>
    `;
    document.getElementById('confirmActionBtn').className = 'btn btn-success';
    document.getElementById('confirmActionBtn').innerHTML = '<i class="bi bi-unlock"></i> Débloquer';
    
    new bootstrap.Modal(document.getElementById('confirmationModal')).show();
}

document.getElementById('confirmActionBtn').addEventListener('click', function() {
    if (currentAction && currentUserId) {
        executeAction(currentAction, currentUserId, currentUserName);
    }
});

function executeAction(action, userId, userName) {
    bootstrap.Modal.getInstance(document.getElementById('confirmationModal')).hide();
    
    let actionText = '';
    let actionClass = '';
    
    switch(action) {
        case 'delete':
            actionText = 'supprimé';
            actionClass = 'danger';
            users = users.filter(user => user.id !== userId);
            break;
        case 'block':
            actionText = 'bloqué';
            actionClass = 'warning';
            users = users.map(user => {
                if (user.id === userId) {
                    return {...user, status: 'blocked'};
                }
                return user;
            });
            break;
        case 'ban':
            actionText = 'banni';
            actionClass = 'danger';
            users = users.map(user => {
                if (user.id === userId) {
                    return {...user, status: 'banned'};
                }
                return user;
            });
            break;
        case 'unblock':
            actionText = 'débloqué';
            actionClass = 'success';
            users = users.map(user => {
                if (user.id === userId) {
                    return {...user, status: 'active'};
                }
                return user;
            });
            break;
    }
    
    showNotification(`L'utilisateur ${userName} a été ${actionText} avec succès.`, actionClass);
    renderUsers();
    
    currentAction = null;
    currentUserId = null;
    currentUserName = null;
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        border-radius: 16px;
        backdrop-filter: blur(10px);
    `;
    
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="bi bi-check-circle-fill me-2"></i>
            <span>${message}</span>
            <button type="button" class="btn-close ms-auto" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 150);
        }
    }, 5000);
}

document.addEventListener('DOMContentLoaded', function() {
    renderUsers();
    
    document.querySelectorAll('.btn-action').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        themeToggle.click();
    }
});
