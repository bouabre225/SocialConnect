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

let articles = [
    {
        id: 1,
        title: "Introduction à l'Intelligence Artificielle",
        excerpt: "Découvrez les bases de l'IA et son impact sur notre société moderne.",
        author: "Ange KORE",
        date: "2025-07-11",
        status: "published",
        content: "L'intelligence artificielle représente l'une des avancées technologiques les plus significatives de notre époque..."
    },
];

let nextId = 5;
let currentAction = null;
let currentArticleId = null;
let currentArticleTitle = null;

function renderArticles() {
    const tbody = document.getElementById('articlesTableBody');
    tbody.innerHTML = '';

    if (articles.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-5">
                    <div class="empty-state">
                        <i class="bi bi-file-earmark-text"></i>
                        <h4>Aucun article trouvé</h4>
                        <p>Commencez par créer votre premier article.</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    articles.forEach((article, index) => {
        const tr = document.createElement('tr');
        tr.className = `animate__animated animate__fadeInUp`;
        tr.style.animationDelay = `${index * 0.1}s`;

        let statusBadge = '';
        switch (article.status) {
            case 'published':
                statusBadge = '<span class="article-status status-published">Publié</span>';
                break;
            case 'draft':
                statusBadge = '<span class="article-status status-draft">Brouillon</span>';
                break;
            case 'archived':
                statusBadge = '<span class="article-status status-archived">Archivié</span>';
                break;
        }

        let actions = '';
        if (article.status === 'archived') {
            actions = `
                <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-action btn-delete" onclick="deleteArticle(${article.id}, '${article.title}')">
                        <i class="bi bi-trash"></i>
                    </button>
                    <button class="btn btn-sm btn-action btn-publish" onclick="publishArticle(${article.id}, '${article.title}')">
                        <i class="bi bi-arrow-up-circle"></i>
                    </button>
                </div>
            `;
        } else {
            actions = `
                <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-action btn-edit" onclick="editArticle(${article.id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-action btn-delete" onclick="deleteArticle(${article.id}, '${article.title}')">
                        <i class="bi bi-trash"></i>
                    </button>
                    <button class="btn btn-sm btn-action btn-archive" onclick="archiveArticle(${article.id}, '${article.title}')">
                        <i class="bi bi-archive"></i>
                    </button>
                </div>
            `;
        }

        tr.innerHTML = `
            <td><span class="badge bg-primary">#${article.id}</span></td>
            <td><div class="article-title" title="${article.title}">${article.title}</div></td>
            <td><div class="article-excerpt" title="${article.excerpt}">${article.excerpt}</div></td>
            <td>${article.author}</td>
            <td><span class="badge-date">${article.date}</span></td>
            <td>${statusBadge}</td>
            <td>${actions}</td>
        `;

        tbody.appendChild(tr);
    });
}

function openAddArticleModal() {
    document.getElementById('addArticleForm').reset();
    document.querySelector('#addArticleModal .modal-title').innerHTML = `<i class="bi bi-plus-circle"></i> Nouvel Article`;
    const btn = document.querySelector('#addArticleModal .btn-success');
    btn.innerHTML = `<i class="bi bi-plus-circle"></i> Ajouter l'article`;
    btn.onclick = addArticle;
    new bootstrap.Modal(document.getElementById('addArticleModal')).show();
}

function addArticle() {
    const title = document.getElementById('articleTitle').value;
    const excerpt = document.getElementById('articleExcerpt').value;
    const author = document.getElementById('articleAuthor').value;
    const status = document.getElementById('articleStatus').value;
    const content = document.getElementById('articleContent').value;

    if (!title || !excerpt || !author || !status || !content) {
        alert('Veuillez remplir tous les champs.');
        return;
    }

    articles.unshift({
        id: nextId++,
        title,
        excerpt,
        author,
        date: new Date().toISOString().split('T')[0],
        status,
        content
    });

    bootstrap.Modal.getInstance(document.getElementById('addArticleModal')).hide();
    showNotification(`L'article "${title}" a été ajouté avec succès.`, 'success');
    renderArticles();
}

function deleteArticle(id, title) {
    currentAction = 'delete';
    currentArticleId = id;
    currentArticleTitle = title;
    openConfirmationModal('Supprimer', 'danger', `Êtes-vous sûr de vouloir supprimer l’article <strong>${title}</strong> ?`, 'trash');
}

function archiveArticle(id, title) {
    currentAction = 'archive';
    currentArticleId = id;
    currentArticleTitle = title;
    openConfirmationModal('Archiver', 'warning', `Voulez-vous archiver l’article <strong>${title}</strong> ?`, 'archive');
}

function publishArticle(id, title) {
    currentAction = 'publish';
    currentArticleId = id;
    currentArticleTitle = title;
    openConfirmationModal('Publier', 'success', `Publier maintenant l’article <strong>${title}</strong> ?`, 'arrow-up-circle');
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
        articles = articles.filter(a => a.id !== currentArticleId);
        showNotification(`L'article "${currentArticleTitle}" a été supprimé.`, 'danger');
    } else if (currentAction === 'archive') {
        const article = articles.find(a => a.id === currentArticleId);
        if (article) article.status = 'archived';
        showNotification(`L'article "${currentArticleTitle}" a été archivé.`, 'warning');
    } else if (currentAction === 'publish') {
        const article = articles.find(a => a.id === currentArticleId);
        if (article) article.status = 'published';
        showNotification(`L'article "${currentArticleTitle}" a été publié.`, 'success');
    }

    bootstrap.Modal.getInstance(document.getElementById('confirmationModal')).hide();
    renderArticles();
}

function editArticle(id) {
    const article = articles.find(a => a.id === id);
    if (!article) return;

    document.getElementById('articleTitle').value = article.title;
    document.getElementById('articleExcerpt').value = article.excerpt;
    document.getElementById('articleAuthor').value = article.author;
    document.getElementById('articleStatus').value = article.status;
    document.getElementById('articleContent').value = article.content;

    document.querySelector('#addArticleModal .modal-title').innerHTML = `<i class="bi bi-pencil"></i> Modifier l'Article`;
    const btn = document.querySelector('#addArticleModal .btn-success');
    btn.innerHTML = `<i class="bi bi-save"></i> Sauvegarder`;
    btn.onclick = () => saveEditedArticle(id);

    new bootstrap.Modal(document.getElementById('addArticleModal')).show();
}

function saveEditedArticle(id) {
    const article = articles.find(a => a.id === id);
    if (!article) return;

    article.title = document.getElementById('articleTitle').value;
    article.excerpt = document.getElementById('articleExcerpt').value;
    article.author = document.getElementById('articleAuthor').value;
    article.status = document.getElementById('articleStatus').value;
    article.content = document.getElementById('articleContent').value;

    bootstrap.Modal.getInstance(document.getElementById('addArticleModal')).hide();
    showNotification(`L'article "${article.title}" a été modifié.`, 'info');

    renderArticles();
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
renderArticles();
//document.addEventListener('DOMContentLoaded', renderArticles);
