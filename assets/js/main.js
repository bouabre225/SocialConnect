//config des routes 
const routes = {
    '/home' : '/vues/clients/home.html',
    '/login' : '/vues/clients/login.html',
    '/register' : '/vues/clients/register.html',
    '/forgot' : '/vues/clients/forgot_password.html',
    '/reset' : '/vues/clients/reset_password.html',
    '/chat' : '/vues/clients/chat.html'
};

// Fonction pour charger un script dynamiquement
function loadScript(url, callback){
    document.querySelectorAll('script.dynamic').forEach(script => script.remove());
    const script = document.createElement('script');
    script.src = url;
    script.classList.add('dynamic');
    if (callback) script.onload = callback;
    document.body.appendChild(script);
}

// fonction pour charger la vue
async function loadView(url){
    const app = document.getElementById('app');
    app.innerHTML = '';

    const response = await fetch(url);
    const view = await response.text();
    app.innerHTML = view;

    //charger le css de la vue
    switch(url){
        case '/vues/clients/home.html':
            document.getElementById('style').href = '../../assets/css/style.css';
            break;
        case '/vues/clients/login.html':
            document.getElementById('style').href = '../../assets/css/login.css';
            break;
        case '/vues/clients/register.html':
            document.getElementById('style').href = '../../assets/css/register.css';
            break;
        case '/vues/clients/forgot_password.html':
            document.getElementById('style').href = '../../assets/css/forgot.css';
            break;
        case '/vues/clients/reset_password.html':
            document.getElementById('style').href = '../../assets/css/reset.css';
            break;
        case '/vues/clients/chat.html':
            document.getElementById('style').href = '../../assets/css/chat.css';
            break;
    }

    return new Promise(resolve =>{
        //charger le js de la vue
        switch(url){
            case '/vues/clients/home.html':
                loadScript('../../assets/js/home.js', resolve);
                break;
            case '/vues/clients/login.html':
                loadScript('../../assets/js/login_register.js', resolve);
                break;
            case '/vues/clients/register.html':
                loadScript('../../assets/js/login_register.js', resolve);
                break;
            case '/vues/clients/forgot_password.html':
                loadScript('../../assets/js/forgot.js', resolve);
                break;
            case '/vues/clients/reset_password.html':
                loadScript('../../assets/js/reset.js', resolve);
                break;
            case '/vues/clients/chat.html':
                loadScript('../../assets/js/chat.js', resolve);
                break;
            default:
                resolve();
        }
    });
}

// Gestion du routage basé sur l'URL
function router(){
    const path = window.location.pathname;
    const route = routes[path];
    if(route){
        loadView(route).then(() =>{
            if (route === '/vues/clients/home.html') {
                console.log(API_URL);
                checkAuth();
                //setupPublishCreation();
                //setupEmojiCreation();
                //setupPhotoCreation();
            }
        });
    }else{
        loadView(routes['/login']);
    }
}

// Écouter les changements d'URL
window.addEventListener('popstate', router);

// Charger la vue initiale
document.addEventListener('DOMContentLoaded', () => {
    router();
});

// Gestion des liens internes
document.addEventListener('click', (e) => {
    if (e.target.hasAttribute('data-url')) {
        e.preventDefault(); // Empêche le rechargement de la page
        const route = e.target.getAttribute('data-url');
        history.pushState(null, '', route); // Met à jour l'URL
        router(); // Charge la vue correspondante
    }
});
