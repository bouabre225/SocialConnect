function navigated(page){
    //charger le html
    fetch(`vues/clients/${page}.html`)
    .then(response => response.text())
    .then(data => {
        document.querySelector('.container-flex').innerHTML = data;
        //charger le css
        document.getElementById('loginCSS').href = `assets/css/${page}.css`;

        // Supprimer les anciens scripts spécifiques
        const oldScript = document.getElementById('page-js');
        if (oldScript) oldScript.remove();

        //charger le js
        const script = document.createElement('script');
        script.src = `assets/js/${page}.js`;
        script.id = 'page-js';
        document.body.appendChild(script);
    })
}

//Appel Api php depuis une page
function ApiCall(url, method = 'POST', data = {}){
    return fetch(`api/${url}.php`, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        return data;
    })
    .catch(error => {
        console.log(error);
        return error;
    })
}

// Chargement initial
window.onload = () => navigated('login');