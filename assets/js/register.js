// Configuration de l'API
const API_URL = 'http://localhost/ReseauSocial/api';

// Validation des formulaires
function validateForm(formData) {
    const errors = [];

    if (!formData.email || !formData.email.trim()) {
        errors.push('L\'email est requis');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.push('Email invalide');
    }

    if (!formData.password || formData.password.length < 8) {
        errors.push('Le mot de passe doit contenir au moins 8 caractères');
    }
    
    if (!formData.firstname || !formData.firstname.trim()) {
            errors.push('Le prénom est requis');
        }
        if (!formData.lastname || !formData.lastname.trim()) {
            errors.push('Le nom est requis');
        }
        if (formData.password !== formData.confirm_password) {
            errors.push('Les mots de passe ne correspondent pas');
        }
        if (formData.password.length < 8 || formData.password.length > 72) {
            errors.push('Le mot de passe doit contenir entre 8 et 72 caractères');
        }
    
    return errors;
}

// Affichage des erreurs
function handleError(error, container) {
    if (container) {
        container.innerHTML = `
            <div class="alert alert-danger">
                <strong>Erreur :</strong> ${error}
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {

    // Gestion inscription
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const formData = {
                firstname: this.firstname.value.trim(),
                lastname: this.lastname.value.trim(),
                email: this.email.value.trim(),
                password: this.password.value,
                confirm_password: this.confirm_password.value
            };

            const errors = validateForm(formData);
            if (errors.length > 0) {
                handleError(errors.join('<br>'), document.getElementById('registerMessage'));
                return;
            }

            document.getElementById('loaderReg').style.display = 'block';

            try {
                const response = await fetch(`${API_URL}/register.php`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': sessionStorage.getItem('csrf_token') || ''
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();
                document.getElementById('loaderReg').style.display = 'none';

                if (data.status === 'success') {
                    document.getElementById('registerMessage').innerHTML = `
                        <div class="alert alert-success">
                            ${data.message}
                        </div>
                    `;
                    this.reset();
                    setTimeout(() => {
                        window.location.href = 'vues/clients/home.html';
                    }, 1200);
                } else {
                    handleError(data.message, document.getElementById('registerMessage'));
                }

            } catch (error) {
                handleError('Une erreur est survenue lors de l\'inscription', document.getElementById('registerMessage'));
                document.getElementById('loaderReg').style.display = 'none';
            }
        });
    }

    // Message activation
    const params = new URLSearchParams(window.location.search);
    if (params.has('activated')) {
        const activationMsg = document.getElementById('activationMessage');
        if (activationMsg) {
            activationMsg.innerHTML = `
                <div class="alert alert-success">
                    ✅ Votre compte a été activé avec succès. Vous pouvez maintenant vous connecter.
                </div>
            `;
        }
    }

    // Gestion oeil togglePassword s'il existe
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', () => {
            const icon = togglePassword.querySelector('i');
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
    }
});
