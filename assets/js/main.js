
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
    '/settings': '/vues/clients/settings.html'
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
        '/vues/clients/settings.html': '../../assets/css/settings.css'
    };

    const jsMap = {
        '/vues/clients/home.html': '../../assets/js/home.js',
        '/vues/clients/login.html': '../../assets/js/login_register.js',
        '/vues/clients/register.html': '../../assets/js/login_register.js',
        '/vues/clients/forgot_password.html': '../../assets/js/forgot.js',
        '/vues/clients/reset_password.html': '../../assets/js/reset.js',
        '/vues/clients/chat.html': '../../assets/js/chat.js',
        '/vues/clients/profile.html': '../../assets/js/profile.js',
        '/vues/clients/settings.html': '../../assets/js/settings.js'
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
