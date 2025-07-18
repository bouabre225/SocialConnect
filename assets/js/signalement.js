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

let reports = [
    {
        id: 1,
        title: "Contenu inapproprié",
        content: "L'article contient des propos discriminatoires qui ne respectent pas les règles de la communauté.",
        author: "Ange KORE",
        date: "2025-07-10",
        status: "pending",
        type: "Article",
        relatedItem: "Introduction à l'IA"
    },
    {
        id: 2,
        title: "Spam",
        content: "L'utilisateur poste des messages publicitaires non sollicités dans les commentaires.",
        author: "Aurelle",
        date: "2025-07-09",
        status: "reviewed",
        type: "Commentaire",
        relatedItem: "Commentaire #1234"
    },
    {
        id: 3,
        title: "Harcèlement",
        content: "Je reçois des messages privés insultants et menaçants de cet utilisateur.",
        author: "Floriane",
        date: "2025-07-08",
        status: "pending",
        type: "Message privé",
        relatedItem: "Conversation avec User123"
    },
    {
        id: 4,
        title: "Fausse information",
        content: "L'article partage des informations scientifiquement incorrectes sans sources.",
        author: "Ange KORE",
        date: "2025-07-07",
        status: "rejected",
        type: "Article",
        relatedItem: "Les bienfaits du café"
    }
];

let nextId = 5;
let currentAction = null;
let currentReportId = null;
let currentReportTitle = null;
let currentFilter = 'all';

function renderReports() {
    const tbody = document.getElementById('reportsTableBody');
    tbody.innerHTML = '';

    const filteredReports = currentFilter === 'all' 
        ? reports 
        : reports.filter(r => r.status === currentFilter);

    if (filteredReports.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-5">
                    <div class="empty-state">
                        <i class="bi bi-flag"></i>
                        <h4>Aucun signalement trouvé</h4>
                        <p>${currentFilter === 'all' ? 'Aucun signalement n\'a été soumis.' : 'Aucun signalement avec ce statut.'}</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    filteredReports.forEach((report, index) => {
        const tr = document.createElement('tr');
        tr.className = `animate__animated animate__fadeInUp`;
        tr.style.animationDelay = `${index * 0.1}s`;

        let statusBadge = '';
        switch (report.status) {
            case 'pending':
                statusBadge = '<span class="report-status status-pending">En attente</span>';
                break;
            case 'reviewed':
                statusBadge = '<span class="report-status status-reviewed">Traité</span>';
                break;
            case 'rejected':
                statusBadge = '<span class="report-status status-rejected">Rejeté</span>';
                break;
        }

        let actions = '';
        if (report.status === 'pending') {
            actions = `
                <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-action btn-review" onclick="viewReportDetails(${report.id})">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-action btn-resolve" onclick="resolveReportPrompt(${report.id}, '${report.title}')">
                        <i class="bi bi-check-circle"></i>
                    </button>
                    <button class="btn btn-sm btn-action btn-reject" onclick="rejectReportPrompt(${report.id}, '${report.title}')">
                        <i class="bi bi-x-circle"></i>
                    </button>
                </div>
            `;
        } else {
            actions = `
                <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-action btn-review" onclick="viewReportDetails(${report.id})">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-action btn-delete" onclick="deleteReportPrompt(${report.id}, '${report.title}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            `;
        }

        tr.innerHTML = `
            <td><span class="badge bg-primary">#${report.id}</span></td>
            <td><div class="report-title" title="${report.title}">${report.title}</div></td>
            <td><div class="report-content" title="${report.content}">${report.content}</div></td>
            <td>${report.author}</td>
            <td><span class="badge-date">${report.date}</span></td>
            <td>${statusBadge}</td>
            <td>${actions}</td>
        `;

        tbody.appendChild(tr);
    });
}

function filterReports(status) {
    currentFilter = status;
    renderReports();
}

function viewReportDetails(id) {
    const report = reports.find(r => r.id === id);
    if (!report) return;

    document.getElementById('reportModalTitle').textContent = report.title;
    document.getElementById('reportModalContent').textContent = report.content;
    document.getElementById('reportModalAuthor').textContent = report.author;
    document.getElementById('reportModalDate').textContent = report.date;
    document.getElementById('reportModalType').textContent = report.type;
    
    let statusText = '';
    switch (report.status) {
        case 'pending': statusText = 'En attente'; break;
        case 'reviewed': statusText = 'Traité'; break;
        case 'rejected': statusText = 'Rejeté'; break;
    }
    document.getElementById('reportModalStatus').textContent = statusText;
    
    const resolveBtn = document.getElementById('resolveReportBtn');
    if (report.status === 'pending') {
        resolveBtn.style.display = 'inline-block';
        resolveBtn.onclick = () => resolveReport(id);
    } else {
        resolveBtn.style.display = 'none';
    }
    
    new bootstrap.Modal(document.getElementById('reportDetailsModal')).show();
}

function resolveReport(id) {
    const report = reports.find(r => r.id === id);
    if (report) {
        report.status = 'reviewed';
        showNotification(`Le signalement "${report.title}" a été marqué comme traité.`, 'success');
        renderReports();
        bootstrap.Modal.getInstance(document.getElementById('reportDetailsModal')).hide();
    }
}

function resolveReportPrompt(id, title) {
    currentAction = 'resolve';
    currentReportId = id;
    currentReportTitle = title;
    openConfirmationModal('Traiter', 'success', `Marquer le signalement <strong>${title}</strong> comme traité ?`, 'check-circle');
}

function rejectReportPrompt(id, title) {
    currentAction = 'reject';
    currentReportId = id;
    currentReportTitle = title;
    openConfirmationModal('Rejeter', 'warning', `Rejeter le signalement <strong>${title}</strong> ?`, 'x-circle');
}

function deleteReportPrompt(id, title) {
    currentAction = 'delete';
    currentReportId = id;
    currentReportTitle = title;
    openConfirmationModal('Supprimer', 'danger', `Supprimer définitivement le signalement <strong>${title}</strong> ?`, 'trash');
}

function openConfirmationModal(actionText, btnClass, message, icon) {
    document.getElementById('confirmationModalLabel').textContent = `Confirmer ${actionText.toLowerCase()}`;
    document.getElementById('confirmationModalBody').innerHTML = `
        <div class="text-center">
            <i class="bi bi-${icon} text-${btnClass}" style="font-size: 3rem;"></i>
            <h5 class="mt-3">${message}</h5>
        </div>
    `;
    const confirmBtn = document.getElementById('confirmActionBtn');
    confirmBtn.className = `btn btn-${btnClass}`;
    confirmBtn.innerHTML = `<i class="bi bi-${icon}"></i> ${actionText}`;
    confirmBtn.onclick = confirmAction;
    new bootstrap.Modal(document.getElementById('confirmationModal')).show();
}

function confirmAction() {
    if (currentAction === 'delete') {
        reports = reports.filter(r => r.id !== currentReportId);
        showNotification(`Le signalement "${currentReportTitle}" a été supprimé.`, 'danger');
    } else if (currentAction === 'reject') {
        const report = reports.find(r => r.id === currentReportId);
        if (report) report.status = 'rejected';
        showNotification(`Le signalement "${currentReportTitle}" a été rejeté.`, 'warning');
    } else if (currentAction === 'resolve') {
        const report = reports.find(r => r.id === currentReportId);
        if (report) report.status = 'reviewed';
        showNotification(`Le signalement "${currentReportTitle}" a été marqué comme traité.`, 'success');
    }

    bootstrap.Modal.getInstance(document.getElementById('confirmationModal')).hide();
    renderReports();
}


function showNotification(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-4 animate__animated animate__fadeInRight`;
    alertDiv.style.zIndex = 2000;
    alertDiv.innerHTML = `
        <strong>${message}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fermer"></button>
    `;
    document.body.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.classList.remove('show');
        alertDiv.classList.add('animate__fadeOutRight');
        setTimeout(() => {
            alertDiv.remove();
        }, 500);
    }, 3500);
}

renderReports();
//document.addEventListener('DOMContentLoaded', renderReports);
