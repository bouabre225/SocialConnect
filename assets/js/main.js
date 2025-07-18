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


const publicRoutes = ['/','/login', '/register', '/forgot', '/reset','/home', '/chat', '/profile', '/settings', '/notification', '/moderator', '/dashboard-admin', '/settings-admin', '/statistiques', '/utilisateurs', '/articles', '/signalements', '/roles'];
//const privateRoutes = ['/home', '/chat', '/profile', '/settings', '/notification', '/moderator', '/dashboard-admin', '/settings-admin', '/statistiques', '/utilisateurs', '/articles', '/signalements', '/roles'];

// Variable pour éviter les boucles infinies
let isRouting = false;

// Configuration API (à adapter selon votre configuration)
//const API_URL = 'http://localhost/ReseauSocial/api'; // Définissez votre URL d'API

// Fonction pour charger dynamiquement un script
function loadScript(url, callback) {
    document.querySelectorAll('script.dynamic').forEach(script => script.remove());
    const script = document.createElement('script');
    script.src = url;
    script.classList.add('dynamic');
    if (callback) script.onload = callback;
    script.onerror = () => {
        //.warn(`Impossible de charger le script: ${url}`);
        if (callback) callback();
    };
    document.body.appendChild(script);
}

// Fonction pour charger une vue et son CSS + JS
async function loadView(url) {
    const app = document.getElementById('app'); // Correction: suppression du 'd' en trop
    if (!app) {
        //.error('Élément #app introuvable.');
        return;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erreur de chargement : ${url}`);
        const view = await response.text();
        app.innerHTML = view;
    } catch (err) {
        //.error(err);
        app.innerHTML = '<h2>Erreur de chargement de la page.</h2>';
        return;
    }

    // Charger le CSS et JS de la vue et l'api
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
        const styleElement = document.getElementById('style');
        if (styleElement) {
            styleElement.href = cssPath;
        }
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

// Fonction de vérification d'authentification
async function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        navigateTo('/login');
        return { isAuthenticated: false };
    }

    try {
        const response = await fetch(`${API_URL}/home.php`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        if (response.ok && data.status === 'success') {
            const role = data.user?.role; // Récupérer le rôle directement
            if (!role) {
                console.warn('Rôle non défini dans la réponse de l\'API:', data);
                localStorage.removeItem('token');
                navigateTo('/login');
                return { isAuthenticated: false };
            }
            return { isAuthenticated: true, role: role };
        } else {
            console.error('Erreur de l\'API:', data);
            localStorage.removeItem('token');
            navigateTo('/login');
            return { isAuthenticated: false };
        }
    } catch (error) {
        console.error('Erreur lors de l\'authentification:', error);
        localStorage.removeItem('token');
        navigateTo('/login');
        return { isAuthenticated: false };
    }
}

// Fonction de navigation sécurisée
function navigateTo(path) {
    if (isRouting) return; // Évite les boucles infinies
    if (window.location.pathname !== path) {
        history.pushState(null, '', path);
        router();
    }
}

// Fonction routeur principale
async function router() {
    if (isRouting) return;
    isRouting = true;

    const path = window.location.pathname;
    const route = routes[path];
    const adminRoutes = ['/admin', '/moderator', '/dashboard-admin', '/settings-admin', '/statistiques', '/utilisateurs', '/articles', '/signalements', '/roles'];

    if (!publicRoutes.includes(path)) {
        const auth = await checkAuth();
        console.log('Résultat de checkAuth:', auth); // Ajout de log
        if (!auth.isAuthenticated) {
            console.log('Utilisateur non authentifié, redirection vers /login');
            isRouting = false;
            return;
        }
        if (adminRoutes.includes(path) && auth.role !== 'admin' && auth.role !== 'moderator') {
            console.log('Accès non autorisé pour le rôle:', auth.role, 'Route demandée:', path);
            navigateTo('/home');
            isRouting = false;
            return;
        }
    }

    if (route) {
        try {
            await loadView(route);
            // Actions spécifiques par vue
            switch (path) {
                case '/home':
                    //.log('API_URL:', API_URL);
                    break;
                case '/chat':
                    //.log('Chat ouvert');
                    break;
                case '/profile':
                    //.log('Profile ouvert');
                    break;
                case '/settings':
                    //.log('Settings ouvert');
                    break;
                case '/notification':
                    //.log('Notification ouvert');
                    break;
                case '/moderator':
                    //.log('Dashboard modérateur ouvert');
                    break;
                case '/admin':
                    //.log('Admin ouvert');
                    break;
                case '/dashboard-admin':
                    //.log('Dashboard admin ouvert');
                    break;
                case '/settings-admin':
                    //.log('Settings admin ouvert');
                    break;
                case '/statistiques':
                    //.log('Statistiques ouvert');
                    break;
                case '/articles':
                    //.log('Articles ouvert');
                    break;
                case '/signalements':
                    //.log('Signalements ouvert');
                    break;
                case '/roles':
                    //.log('Roles ouvert');
                    break;
            }
        } catch (err) {
            //.error('Erreur lors du chargement de la vue :', err);
            document.getElementById('app').innerHTML = '<h2>Erreur de chargement de la page.</h2>';
        } finally {
            isRouting = false; // Permet de nouvelles navigations
        }
    } else {
        // Gestion des routes non trouvées
        //.warn(`Route non trouvée : ${path}`);
        document.getElementById('app').innerHTML = '<h2>Page introuvable.</h2>';
        isRouting = false;
    }
}

// Navigation via clic sur liens internes
document.addEventListener('click', (e) => {
    if (e.target.hasAttribute('data-url')) {
        e.preventDefault();
        const route = e.target.getAttribute('data-url');
        navigateTo(route);
    }
});

// Écoute navigation via bouton précédent/suivant
window.addEventListener('popstate', () => {
    if (!isRouting) {
        router();
    }
});

// Charge la vue initiale
document.addEventListener('DOMContentLoaded', () => {
    // Petit délai pour s'assurer que le DOM est complètement chargé
    setTimeout(() => {
        router();
    }, 100);
});