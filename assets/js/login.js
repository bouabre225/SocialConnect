import { ApiCall, handleError, loadAuthView } from './main.js';
import { showLoader, showSuccess, addLoadingState, removeLoadingState, hashPassword, isStrongPassword } from './utils.js';
import { ERROR_MESSAGES } from './utils.js';

// Fonction de connexion
export async function login(formData, submitButton) {
    try {
        addLoadingState(submitButton);
        showLoader(true);

        const response = await ApiCall('login', 'POST', {
            email: formData.email,
            password: hashPassword(formData.password)
        });

        if (response.status === 'success') {
            sessionStorage.setItem('user', JSON.stringify(response.user));
            sessionStorage.setItem('csrf_token', response.user.csrf_token);

            if (document.getElementById('rememberMe').checked) {
                localStorage.setItem('rememberedEmail', formData.email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }

            showSuccess('Connexion réussie', 'loginMessage');
            setTimeout(() => loadAuthView('home'), 1000);
        } else {
            await handleError(response.message || ERROR_MESSAGES.INVALID_CREDENTIALS, 'loginMessage');
        }
    } catch (error) {
        await handleError(error.message || ERROR_MESSAGES.NETWORK_ERROR, 'loginMessage');
    } finally {
        removeLoadingState(submitButton);
        showLoader(false);
    }
}


// Gestion de l'activation
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('activated')) {
        showSuccess('Votre compte a été activé avec succès. Vous pouvez maintenant vous connecter.', 'activationMessage');
    }

    // Pré-remplir l'email si rememberMe est actif
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
        const emailInput = document.querySelector('input[name="email"]');
        if (emailInput) {
            emailInput.value = savedEmail;
            const rememberMe = document.getElementById('rememberMe');
            if (rememberMe) rememberMe.checked = true;
        }
    }
});