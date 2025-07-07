export const ERROR_MESSAGES = {
    NETWORK_ERROR: "Une erreur réseau est survenue",
    INVALID_CREDENTIALS: "Email ou mot de passe incorrect",
    TIMEOUT: "La requête a pris trop de temps",
    UNKNOWN_ERROR: "Une erreur inconnue est survenue"
};

export const TIMEOUT_DURATION = 10000; // 10 seconds

export function isEmailValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isPasswordValid(password) {
    return password.length >= 8;
}

export function isStrongPassword(password) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password);
}

export function hashPassword(password) {
    // Utiliser une bibliothèque de hachage sécurisée en production
    return btoa(password); // Temporaire pour la démonstration
}

export function clearForm(form) {
    form.reset();
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.classList.remove('is-invalid');
        input.classList.remove('is-valid');
    });
}

export function showLoader(show = true) {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.display = show ? 'block' : 'none';
    }
}

export function showError(message, containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="alert alert-danger alert-dismissible fade show">
                <strong>Erreur :</strong> ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
    }
}

export function showSuccess(message, containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="alert alert-success alert-dismissible fade show">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
    }
}

export function addLoadingState(button) {
    if (!button) return;
    button.disabled = true;
    button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Chargement...';
}

export function removeLoadingState(button) {
    if (!button) return;
    button.disabled = false;
    button.innerHTML = 'Envoyer';
}

export function createTimeoutPromise(ms) {
    return new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), ms);
    });
}

export async function safeApiCall(url, method, data = {}) {
    try {
        const timeout = createTimeoutPromise(TIMEOUT_DURATION);
        const response = await Promise.race([
            fetch(`${API_URL}/api/${url}.php`, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': sessionStorage.getItem('csrf_token') || ''
                },
                body: JSON.stringify(data)
            }),
            timeout
        ]);

        if (!response.ok) {
            throw new Error('Erreur réseau');
        }

        return await response.json();
    } catch (error) {
        console.error('Erreur API:', error);
        throw error;
    }
}
