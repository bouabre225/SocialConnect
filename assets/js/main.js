const API_URL = 'http://localhost/ReseauSocial';
export {API_URL}
import {login} from './login.js';
import { register } from './register.js';

// Gestion du loader
export async function loader(state) {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.display = state ? 'block' : 'none';
    }
}

// Appel API générique
export async function ApiCall(url, method, data = {}) {
    try {
        const response = await fetch(`${API_URL}/api/${url}.php`, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': sessionStorage.getItem('csrf_token') || ''
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Erreur réseau : ' + response.status);
        }

        return await response.json();
    } catch (error) {
        console.error('Erreur API:', error);
        throw error;
    }
}

// Validation de formulaire
export async function validateForm(formData, type) {
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

// Gestion des erreurs
export async function handleError(message, container) {
    const containerElement = document.getElementById(container);
    if (containerElement) {
        containerElement.innerHTML = `
            <div class="alert alert-danger alert-dismissible fade show">
                <strong>Erreur :</strong> ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
    }
}

// Gestion des routes protégées et chargement des pages
export async function navigated(page) {
    const protectedPages = ['home', 'profile', 'settings'];
    const token = sessionStorage.getItem('csrf_token');
    if (protectedPages.includes(page) && !token) {
        await loadAuthView('login');
        return;
    }

    try {
        const response = await fetch(`./vues/clients/${page}.html`);
        if (!response.ok) throw new Error('Erreur chargement page');
        const data = await response.text();
        document.querySelector('.container-flex').innerHTML = data;

        // Charger le CSS
        const cssLink = document.getElementById('loginCSS');
        if (cssLink) {
            cssLink.href = `./assets/css/${page}.css`;
        }

        // Charger le JavaScript spécifique
        const existingScript = document.getElementById('page-js');
        if (existingScript) existingScript.remove();
        const script = document.createElement('script');
        script.type = 'module';
        script.src = `./assets/js/${page}.js`;
        script.id = 'page-js';
        document.body.appendChild(script);

        // Ajouter à l'historique
        history.pushState({ page: page }, '', `/${page}`);
    } catch (error) {
        console.error('Erreur navigation:', error);
        await handleError('Erreur lors du chargement de la page', 'errorContainer');
    }
}

// Fonction pour charger la vue d'authentification (login/register)
export async function loadAuthView(view) {
    try {
        await navigated(view); // Charger la vue correspondante
        const form = document.getElementById(view === 'login' ? 'loginForm' : 'registerForm');
        const submitButton = form?.querySelector('[type="submit"]');

        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = view === 'login' ? {
                    email: form.email.value.trim(),
                    password: form.password.value
                } : {
                    firstname: form.firstname?.value.trim(),
                    lastname: form.lastname?.value.trim(),
                    email: form.email.value.trim(),
                    password: form.password.value,
                    confirm_password: form.confirm_password?.value
                };

                const errors = await validateForm(formData, view);
                if (errors.length > 0) {
                    await handleError(errors.join('<br>'), `${view}Message`);
                    return;
                }

                // Appeler la méthode appropriée
                if (view === 'login') {
                    await login(formData, submitButton);
                } else {
                    await register(formData, submitButton);
                }
            });

            // Gestion du toggle password
            document.querySelectorAll('.togglePassword').forEach(button => {
                button.addEventListener('click', function () {
                    const passwordInput = this.closest('.input-group').querySelector('.password-field');
                    const icon = this.querySelector('i');
                    if (passwordInput.type === 'password') {
                        passwordInput.type = 'text';
                        icon.classList.remove('bi-eye');
                        icon.classList.add('bi-eye-slash');
                    } else {
                        passwordInput.type = 'password';
                        icon.classList.remove('bi-eye-slash');
                        icon.classList.add('bi-eye');
                    }
                });
            });
        }
    } catch (error) {
        console.error('Erreur chargement vue auth:', error);
        await handleError('Erreur lors du chargement de la vue', `${view}Message`);
    }
}

// Logout
export async function logout() {
    sessionStorage.clear();
    localStorage.clear();
    await loadAuthView('login');
}

window.onpopstate = (e) => e.state && loadAuthView(e.state.page);
window.onload = () => loadAuthView('login');
window.navigated = navigated;