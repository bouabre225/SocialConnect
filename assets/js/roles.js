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

// Données de démonstration
let roles = [
    {
        id: 1,
        nom: "KORE",
        prenom: "Ange",
        email: "ange.kore@gmail.com",
        role: "admin",
        dateAjout: "2025-07-10"
    },
    {
        id: 2,
        nom: "Floriane",
        prenom: ".",
        email: "floriane@gmail.com",
        role: "moderator",
        dateAjout: "2025-07-11"
    },
];

function renderRoles(filteredRoles = null) {
    const tbody = document.getElementById('rolesTableBody');
    tbody.innerHTML = '';

    const rolesToRender = filteredRoles || roles;

    if (rolesToRender.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-5">
                    <div class="empty-state">
                        <i class="bi bi-people"></i>
                        <h4>Aucun rôle trouvé</h4>
                        <p>Les utilisateurs avec des rôles apparaîtront ici.</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    rolesToRender.forEach((role, index) => {
        const tr = document.createElement('tr');
        tr.className = `animate__animated animate__fadeInUp`;
        tr.style.animationDelay = `${index * 0.1}s`;
        
        let roleBadge = '';
        if (role.role === 'admin') {
            roleBadge = '<span class="badge bg-danger">Administrateur</span>';
        } else if (role.role === 'moderator') {
            roleBadge = '<span class="badge bg-purple">Modérateur</span>';
        }

        let actions = '';
        if (role.role === 'admin') {
            actions = `
                <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-action btn-demote" onclick="demoteUser(${role.id}, '${role.prenom} ${role.nom}')">
                        <i class="bi bi-arrow-down"></i> Rétrograder
                    </button>
                    <button class="btn btn-sm btn-action btn-delete" onclick="removeRole(${role.id}, '${role.prenom} ${role.nom}')">
                        <i class="bi bi-trash"></i> Supprimer
                    </button>
                </div>
            `;
        } else {
            actions = `
                <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-action btn-promote" onclick="promoteUser(${role.id}, '${role.prenom} ${role.nom}')">
                        <i class="bi bi-arrow-up"></i> Promouvoir
                    </button>
                    <button class="btn btn-sm btn-action btn-delete" onclick="removeRole(${role.id}, '${role.prenom} ${role.nom}')">
                        <i class="bi bi-trash"></i> Supprimer
                    </button>
                </div>
            `;
        }

        tr.innerHTML = `
            <td><span class="badge bg-primary">#${role.id}</span></td>
            <td>${role.nom}</td>
            <td>${role.prenom}</td>
            <td>${role.email}</td>
            <td>${roleBadge}</td>
            <td><span class="badge-date">${role.dateAjout}</span></td>
            <td>${actions}</td>
        `;
        
        tbody.appendChild(tr);
    });
}

let currentAction = null;
let currentRoleId = null;
let currentRoleName = null;

function promoteUser(roleId, roleName) {
    currentAction = 'promote';
    currentRoleId = roleId;
    currentRoleName = roleName;
    
    document.getElementById('confirmationModalLabel').textContent = 'Confirmer la promotion';
    document.getElementById('confirmationModalBody').innerHTML = `
        <div class="text-center">
            <i class="bi bi-arrow-up-circle text-success" style="font-size: 3rem;"></i>
            <h5 class="mt-3">Êtes-vous sûr de vouloir promouvoir cet utilisateur ?</h5>
            <p class="text-muted"><strong>${roleName}</strong> (ID: ${roleId})</p>
            <div class="alert alert-info">
                <i class="bi bi-info-circle"></i> L'utilisateur deviendra administrateur avec tous les droits.
            </div>
        </div>
    `;
    document.getElementById('confirmActionBtn').className = 'btn btn-success';
    document.getElementById('confirmActionBtn').innerHTML = '<i class="bi bi-arrow-up"></i> Promouvoir';
    
    new bootstrap.Modal(document.getElementById('confirmationModal')).show();
}

function demoteUser(roleId, roleName) {
    currentAction = 'demote';
    currentRoleId = roleId;
    currentRoleName = roleName;
    
    document.getElementById('confirmationModalLabel').textContent = 'Confirmer la rétrogradation';
    document.getElementById('confirmationModalBody').innerHTML = `
        <div class="text-center">
            <i class="bi bi-arrow-down-circle text-warning" style="font-size: 3rem;"></i>
            <h5 class="mt-3">Êtes-vous sûr de vouloir rétrograder cet administrateur ?</h5>
            <p class="text-muted"><strong>${roleName}</strong> (ID: ${roleId})</p>
            <div class="alert alert-warning">
                <i class="bi bi-exclamation-triangle"></i> L'utilisateur deviendra modérateur avec des droits réduits.
            </div>
        </div>
    `;
    document.getElementById('confirmActionBtn').className = 'btn btn-warning';
    document.getElementById('confirmActionBtn').innerHTML = '<i class="bi bi-arrow-down"></i> Rétrograder';
    
    new bootstrap.Modal(document.getElementById('confirmationModal')).show();
}

function removeRole(roleId, roleName) {
    currentAction = 'remove';
    currentRoleId = roleId;
    currentRoleName = roleName;
    
    document.getElementById('confirmationModalLabel').textContent = 'Confirmer la suppression';
    document.getElementById('confirmationModalBody').innerHTML = `
        <div class="text-center">
            <i class="bi bi-trash text-danger" style="font-size: 3rem;"></i>
            <h5 class="mt-3">Êtes-vous sûr de vouloir supprimer ce rôle ?</h5>
            <p class="text-muted"><strong>${roleName}</strong> (ID: ${roleId})</p>
            <div class="alert alert-danger">
                <i class="bi bi-exclamation-triangle"></i> L'utilisateur perdra tous ses privilèges d'administration/modération.
            </div>
        </div>
    `;
    document.getElementById('confirmActionBtn').className = 'btn btn-danger';
    document.getElementById('confirmActionBtn').innerHTML = '<i class="bi bi-trash"></i> Supprimer';
    
    new bootstrap.Modal(document.getElementById('confirmationModal')).show();
}

document.getElementById('confirmActionBtn').addEventListener('click', function() {
    if (currentAction && currentRoleId) {
        executeRoleAction(currentAction, currentRoleId, currentRoleName);
    }
});

function executeRoleAction(action, roleId, roleName) {
    bootstrap.Modal.getInstance(document.getElementById('confirmationModal')).hide();
    
    let actionText = '';
    let actionClass = '';
    
    switch(action) {
        case 'promote':
            actionText = 'promu administrateur';
            actionClass = 'success';
            roles = roles.map(role => {
                if (role.id === roleId) {
                    return {...role, role: 'admin'};
                }
                return role;
            });
            break;
        case 'demote':
            actionText = 'rétrogradé modérateur';
            actionClass = 'warning';
            roles = roles.map(role => {
                if (role.id === roleId) {
                    return {...role, role: 'moderator'};
                }
                return role;
            });
            break;
        case 'remove':
            actionText = 'supprimé des rôles';
            actionClass = 'danger';
            roles = roles.filter(role => role.id !== roleId);
            break;
    }
    
    showNotification(`L'utilisateur ${roleName} a été ${actionText} avec succès.`, actionClass);
    renderRoles();
    
    currentAction = null;
    currentRoleId = null;
    currentRoleName = null;
}

document.getElementById('confirmAddRole').addEventListener('click', function() {
    const email = document.getElementById('userEmail').value.trim();
    const role = document.getElementById('roleSelect').value;
    
    if (!email || !role) {
        showNotification('Veuillez remplir tous les champs', 'danger');
        return;
    }
    
    if (roles.some(r => r.email.toLowerCase() === email.toLowerCase())) {
        showNotification('Cet utilisateur a déjà un rôle attribué', 'warning');
        return;
    }
    
    const newRole = {
        id: roles.length > 0 ? Math.max(...roles.map(r => r.id)) + 1 : 1,
        nom: email.split('@')[0].toUpperCase(),
        prenom: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        email: email,
        role: role,
        dateAjout: new Date().toISOString().split('T')[0]
    };
    
    roles.push(newRole);
    renderRoles();
    
    bootstrap.Modal.getInstance(document.getElementById('addRoleModal')).hide();
    document.getElementById('addRoleForm').reset();
    
    showNotification(`Nouveau rôle ${role === 'admin' ? 'd\'administrateur' : 'de modérateur'} ajouté avec succès`, 'success');
});


document.getElementById('searchInput').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    if (searchTerm.length === 0) {
        renderRoles();
        return;
    }
    
    const filteredRoles = roles.filter(role => 
        role.nom.toLowerCase().includes(searchTerm) || 
        role.prenom.toLowerCase().includes(searchTerm) ||
        role.email.toLowerCase().includes(searchTerm) ||
        role.role.toLowerCase().includes(searchTerm)             
    );
    
    renderRoles(filteredRoles);
});


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
            <i class="bi ${type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2"></i>
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


//document.addEventListener('DOMContentLoaded', function() {
    renderRoles();
    
    document.querySelectorAll('.btn-action').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
//});


document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        themeToggle.click();
    }
});
