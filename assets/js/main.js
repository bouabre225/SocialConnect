// Config des routes
const routes = {
    '/': '/vues/clients/login.html',
    '/home': '/vues/clients/home.html',
    '/login': '/vues/clients/login.html',
    '/register': '/vues/clients/register.html',
    '/forgot': '/vues/clients/forgot_password.html',
    '/reset': '/vues/clients/reset_password.html',
    '/chat': '/vues/clients/chat.html',
    '/profile': '/vues/clients/profile.html',
    '/settings': '/vues/clients/settings.html',
    '/notification': '/vues/clients/notification.html',
    '/admin': '/vues/admin/index.html',
    '/moderator': '/vues/admin/dashboard-moderator.html',
    '/dashboard-admin': '/vues/admin/dashboard-admin.html',
    '/settings-admin': '/vues/admin/settings.html',
    '/statistiques': '/vues/admin/statistiques.html',
    '/utilisateurs': '/vues/admin/utilisateurs.html',   
    '/articles': '/vues/admin/articles.html',
    '/signalements': '/vues/admin/signalements.html',
    '/roles': '/vues/admin/gestion_des_roles.html',
};

// Fonction pour charger dynamiquement un script
function loadScript(url, callback) {
    document.querySelectorAll('script.dynamic').forEach(script => script.remove());
    const script = document.createElement('script');
    script.src = url;
    script.classList.add('dynamic');
    if (callback) script.onload = callback;
    document.body.appendChild(script);
}

// Fonction pour charger une vue et son CSS + JS
async function loadView(url) {
    const app = document.getElementById('app');
    if (!app) {
        console.error('Élément #app introuvable.');
        return;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erreur de chargement : ${url}`);
        const view = await response.text();
        app.innerHTML = view;
    } catch (err) {
        console.error(err);
        app.innerHTML = '<h2>Erreur de chargement de la page.</h2>';
        return;
    }

    // Charger le CSS et JS de la vue
    const cssMap = {
        '/vues/clients/home.html': '../../assets/css/style.css',
        '/vues/clients/login.html': '../../assets/css/login.css',
        '/vues/clients/register.html': '../../assets/css/register.css',
        '/vues/clients/forgot_password.html': '../../assets/css/forgot.css',
        '/vues/clients/reset_password.html': '../../assets/css/reset.css',
        '/vues/clients/chat.html': '../../assets/css/chat.css',
        '/vues/clients/profile.html': '../../assets/css/profile.css',
        '/vues/clients/settings.html': '../../assets/css/settings.css',
        '/vues/clients/notification.html': '../../assets/css/notification.css',
        '/vues/admin/dashboard-moderator.html': '../../assets/css/moderator.css',
        '/vues/admin/index.html': '../../assets/css/login_admin.css',
        '/vues/admin/dashboard-admin.html': '../../assets/css/admin.css',
        '/vues/admin/settings.html': '../../assets/css/settings-admin.css',
        '/vues/admin/statistiques.html': '../../assets/css/statistiques.css',
        '/vues/admin/utilisateurs.html': '../../assets/css/utilisateurs.css',
        '/vues/admin/articles.html': '../../assets/css/articles.css',
        '/vues/admin/signalements.html': '../../assets/css/signalement.css',
        '/vues/admin/gestion_des_roles.html': '../../assets/css/roles.css',
    };

    const jsMap = {
        '/vues/clients/home.html': '../../assets/js/home.js',
        '/vues/clients/login.html': '../../assets/js/login_register.js',
        '/vues/clients/register.html': '../../assets/js/login_register.js',
        '/vues/clients/forgot_password.html': '../../assets/js/forgot.js',
        '/vues/clients/reset_password.html': '../../assets/js/reset.js',
        '/vues/clients/chat.html': '../../assets/js/chat.js',
        '/vues/clients/profile.html': '../../assets/js/profile.js',
        '/vues/clients/settings.html': '../../assets/js/settings.js',
        '/vues/clients/notification.html': '../../assets/js/notification.js',
        '/vues/admin/dashboard-moderator.html': '../../assets/js/moderator.js',
        '/vues/admin/index.html': '../../assets/js/admin.js',
        '/vues/admin/dashboard-admin.html': '../../assets/js/dashboard.js',
        '/vues/admin/settings.html': '../../assets/js/settings-admin.js',
        '/vues/admin/statistiques.html': '../../assets/js/statistiques.js',
        '/vues/admin/utilisateurs.html': '../../assets/js/utilisateurs.js',
        '/vues/admin/articles.html': '../../assets/js/articles.js',
        '/vues/admin/signalements.html': '../../assets/js/signalements.js',

    };

    const cssPath = cssMap[url];
    if (cssPath) {
        document.getElementById('style').href = cssPath;
    }

    return new Promise(resolve => {
        const jsPath = jsMap[url];
        if (jsPath) {
            loadScript(jsPath, resolve);
        } else {
            resolve();
        }
    });
}

// Fonction routeur principale
function router() {
    const path = window.location.pathname;
    const route = routes[path];

    if (route) {
        loadView(route).then(() => {
            // Actions spécifiques par vue
            switch (path) {
                case '/home':
                    console.log(API_URL);
                    checkAuth();
                    break;
                case '/chat':
                    console.log('Chat ouvert');
                    break;
                case '/profile':
                    console.log('Profile ouvert');
                    break;
                case '/settings':
                    console.log('Settings ouvert');
                    break;
                case '/notification':
                    console.log('Notification ouvert');
                    break;
                case '/ moderator':
                    console.log('Dashboard modérateur ouvert');
                    break;
                case '/admin':
                    console.log('Admin ouvert');
                    break;
                case '/dashboard-admin':
                    console.log('Dashboard admin ouvert');
                    break;
                case '/settings-admin':
                    console.log('Settings admin ouvert');
                    break;
                case '/statistiques':
                    console.log('Statistiques ouvert');
                    break;
                case '/articles':
                    console.log('Articles ouvert');
                    break;
                case '/signalements':
                    console.log('Signalements ouvert');
                    break;
                case '/roles':
                    console.log('Roles ouvert');
                    break;
                // ajoute d'autres cas au besoin
            }
        });
    } else {
        console.warn(`Aucune route définie pour ${path}. Redirection vers /`);
        history.replaceState(null, '', '/');
        router();
    }
}

// Navigation via clic sur liens internes
document.addEventListener('click', (e) => {
    if (e.target.hasAttribute('data-url')) {
        e.preventDefault();
        const route = e.target.getAttribute('data-url');

        // Évite de router si c'est déjà la route courante
        if (window.location.pathname !== route) {
            history.pushState(null, '', route);
            router();
        }
    }
});

// Écoute navigation via bouton précédent/suivant
window.addEventListener('popstate', router);

// Charge la vue initiale
document.addEventListener('DOMContentLoaded', router);
