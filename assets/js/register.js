
import { ApiCall, handleError, loadAuthView } from './main.js';
import { showLoader, showSuccess, addLoadingState, removeLoadingState, hashPassword, isStrongPassword } from './utils.js';
import { ERROR_MESSAGES } from './utils.js';
import { API_URL } from './main.js';
// Fonction d'inscription
export async function register(formData, submitButton) {
    try {
        addLoadingState(submitButton);
        showLoader(true);

        if (!isStrongPassword(formData.password)) {
            throw new Error('Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre');
        }
        const response = await fetch(`${API_URL}/register.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body :JSON.stringify({
                firstname: formData.firstname,
                lastname: formData.lastname,
                email: formData.email,
                password: hashPassword(formData.password)
            })
        });

        if (response.status === 'success') {
            sessionStorage.setItem('user', JSON.stringify(response.user));
            sessionStorage.setItem('csrf_token', response.user.csrf_token);

            if (document.getElementById('rememberMe').checked) {
                localStorage.setItem('rememberedEmail', formData.email);
            }

            showSuccess('Inscription réussie', 'registerMessage');
            setTimeout(() => loadAuthView('home'), 1000);
        } else {
            await handleError(response.message || ERROR_MESSAGES.INVALID_CREDENTIALS, 'registerMessage');
        }
    } catch (error) {
        await handleError(error.message || ERROR_MESSAGES.NETWORK_ERROR, 'registerMessage');
    } finally {
        removeLoadingState(submitButton);
        showLoader(false);
    }
}
