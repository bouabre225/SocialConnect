const API_URL = 'http://localhost/ReseauSocial';


//gestion du loader
function loader(state){
    const loader = document.getElementById('loader');
    if (state) loader.style.display = 'block';
    else loader.style.display = 'none';
}


//Appel Api php depuis une page
function ApiCall(url, method, data = {}){
    loader(true);
    return fetch(`${API_URL}/api/${url}.php`, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        loader(false);
        return data;
    })
    .catch(error => {
        console.log(error);
        loader(false);
        return error;
    })
    .finally(() => loader(false));
}

// Gestion des routes et chargement des pages
function navigated(page){
    // Gestion des routes protégées
    const protectedPages = ['home', 'profile', 'settings'];
    const token = sessionStorage.getItem('csrf_token');
    if (protectedPages.includes(page) && !token) {
        navigated('login');
        return;
    }
    loader(true);
    //charger le html
    fetch(`./vues/clients/${page}.html`)
    .then(response => response.text())
    .then(data => {
        loader(false);
        document.querySelector('.container-flex').innerHTML = data;
        //charger le css
        document.getElementById('loginCSS').href = `./assets/css/${page}.css`;

        // Supprimer les anciens scripts spécifiques
        const oldScript = document.getElementById('page-js');
        if (oldScript) oldScript.remove();

        //charger le js
        const script = document.createElement('script');
        script.src = `./assets/js/${page}.js`;
        script.id = 'page-js';
        document.body.appendChild(script);

        //ajouter l'element de navigation dans l'historique
        history.pushState({page: page}, '', `/${page}`);
    })
    .finally(() => loader(false));
}

// Logout simple
function logout(){
    sessionStorage.clear();
    localStorage.clear();
    navigated('login');
}

window.onpopstate = (e) => e.state && navigated(e.state.page);
window.onload = () => navigated('login');

function validateForm(formData, type) {
    const errors = [];
    if (!formData.email?.trim()) errors.push("L'email est requis");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.push("Email invalide");

    if (!formData.password || formData.password.length < 8) errors.push("Le mot de passe doit contenir au moins 8 caractères");

    if (type === 'register') {
        if (!formData.firstname?.trim()) errors.push("Le prénom est requis");
        if (!formData.lastname?.trim()) errors.push("Le nom est requis");
        if (formData.password !== formData.confirm_password) errors.push("Les mots de passe ne correspondent pas");
    }

    return errors;
}

function handleError(message, container){
    if (container) {
        container.innerHTML = `<div class="alert alert-danger"><strong>Erreur :</strong> ${message}</div>`;
    }
}