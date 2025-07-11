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
            removeUserRow(userId);
            break;
        case 'block':
            actionText = 'bloqué';
            actionClass = 'warning';
            markUserAsBlocked(userId);
            break;
        case 'ban':
            actionText = 'banni';
            actionClass = 'danger';
            markUserAsBanned(userId);
            break;
    }
    
    showNotification(`L'utilisateur ${userName} a été ${actionText} avec succès.`, actionClass);
    
    currentAction = null;
    currentUserId = null;
    currentUserName = null;
}
function removeUserRow(userId) {
    const row = document.querySelector(`tr:has(span:contains("#${userId}"))`);
    if (row) {
        row.classList.add('animate__animated', 'animate__fadeOut');
        setTimeout(() => {
            row.remove();
        }, 500);
    }
}

function markUserAsBlocked(userId) {
    const row = document.querySelector(`tr:has(.badge:contains("#${userId}"))`);
    if (row) {
        const actionsCell = row.querySelector('td:last-child');
        const blockBtn = actionsCell.querySelector('.btn-block');
        blockBtn.innerHTML = '<i class="bi bi-unlock"></i> Débloquer';
        blockBtn.classList.remove('btn-block');
        blockBtn.classList.add('btn-success');
        blockBtn.onclick = () => unblockUser(userId, row.cells[1].textContent + ' ' + row.cells[2].textContent);
    }
}

function markUserAsBanned(userId) {
    const row = document.querySelector(`tr:has(.badge:contains("#${userId}"))`);
    if (row) {
        const actionsCell = row.querySelector('td:last-child');
        actionsCell.innerHTML = '<span class="badge bg-danger">BANNI</span>';
        row.style.opacity = '0.6';
    }
}

function unblockUser(userId, userName) {
    const row = document.querySelector(`tr:has(.badge:contains("#${userId}"))`);
    if (row) {
        const actionsCell = row.querySelector('td:last-child');
        const unblockBtn = actionsCell.querySelector('.btn-success');
        unblockBtn.innerHTML = '<i class="bi bi-lock"></i> Bloquer';
        unblockBtn.classList.remove('btn-success');
        unblockBtn.classList.add('btn-block');
        unblockBtn.onclick = () => blockUser(userId, userName);
        
        showNotification(`L'utilisateur ${userName} a été débloqué avec succès.`, 'success');
    }
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
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach((row, index) => {
        setTimeout(() => {
            row.classList.add('animate__animated', 'animate__fadeInUp');
        }, index * 100);
    });
});

document.querySelectorAll('.btn-action').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px) scale(1.05)';
    });
    
    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

function addSearchFunctionality() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Rechercher un utilisateur...';
    searchInput.className = 'form-control mb-3';
    searchInput.style.cssText = `
        border-radius: 16px;
        border: 2px solid var(--primary);
        padding: 0.75rem 1rem;
        font-size: 1rem;
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(10px);
    `;
    
    const tableContainer = document.querySelector('.table-responsive');
    tableContainer.parentNode.insertBefore(searchInput, tableContainer);
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const rows = document.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                row.style.display = '';
                row.classList.add('animate__animated', 'animate__fadeIn');
            } else {
                row.style.display = 'none';
            }
        });
    });
}


// addSearchFunctionality();

function exportToCSV() {
    const rows = document.querySelectorAll('tbody tr');
    let csvContent = 'ID,Nom,Prénom,Email,Créé le\n';
    
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const rowData = [
            cells[0].textContent.replace('#', ''),
            cells[1].textContent,
            cells[2].textContent,
            cells[3].textContent,
            cells[4].textContent
        ].join(',');
        csvContent += rowData + '\n';
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'utilisateurs.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}

document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        themeToggle.click();
    }
    

    // if (e.ctrlKey && e.key === 'e') {
    //     e.preventDefault();
    //     exportToCSV();
    // }
});

document.querySelectorAll('.badge').forEach(badge => {
    badge.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
        this.style.transition = 'transform 0.2s ease';
    });
    
    badge.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

function updateStats() {
    const totalUsers = document.querySelectorAll('tbody tr').length;
    const activeUsers = document.querySelectorAll('tbody tr:not([style*="opacity: 0.6"])').length;
    const bannedUsers = document.querySelectorAll('.badge:contains("BANNI")').length;
    
    
    console.log(`Total: ${totalUsers}, Actifs: ${activeUsers}, Bannis: ${bannedUsers}`);
}


updateStats();
