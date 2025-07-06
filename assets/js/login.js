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

function login(formData){
    ApiCall('login', 'POST', formData)
    .then(data => {
        if (data.status === 'success') {
            sessionStorage.setItem('user', JSON.stringify(data.user));
            sessionStorage.setItem('csrf_token', data.user.csrf_token);
            
            if (document.getElementById('rememberMe').checked) {
                localStorage.setItem('rememberedEmail', formData.email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }
            setTimeout(() => {
                window.location.href = 'vues/clients/home.html';
            }, 1200);
        } else {
            handleError(data.message, document.getElementById('loginMessage'));
        }
    })
    .catch(error => {
        handleError('Une erreur est survenue lors de la connexion', document.getElementById('loginMessage'));
    })
}

document.addEventListener('DOMContentLoaded', () => {
    // Gestion connexion
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        
    //preremplir le champs si rememberMe est coche
    const savedEmail = localStorage.getItem('email');
    if (savedEmail) {
        document.querySelector('input[name="email"]').value = savedEmail;
        document.getElementById('rememberMe').checked = true;
    }
        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const formData = {
                email: this.email.value.trim(),
                password: this.password.value
            };

            const errors = validateForm(formData, 'login');
            if (errors.length > 0) {
                handleError(errors.join('<br>'), document.getElementById('loginMessage'));
                return;
            }

            document.getElementById('loader').style.display = 'block';

            try {
                const response = await login(formData);
                document.getElementById('loader').style.display = 'none';

                if (response.status === 'success') {
                    sessionStorage.setItem('user', JSON.stringify(response.user));
                    sessionStorage.setItem('csrf_token', response.user.csrf_token);
                    
                    if (document.getElementById('rememberMe').checked) {
                        localStorage.setItem('rememberedEmail', formData.email);
                    } else {
                        localStorage.removeItem('rememberedEmail');
                    }
                    setTimeout(() => {
                        window.location.href = 'vues/clients/home.html';
                    }, 1200);
                } else {
                    handleError(response.message, document.getElementById('loginMessage'));
                }
                
                

            } catch (error) {
                handleError('Une erreur est survenue lors de la connexion', document.getElementById('loginMessage'));
                document.getElementById('loader').style.display = 'none';
            }
        });
    }

    const params = new URLSearchParams(window.location.search);
    if (params.has('activated')) {
        document.getElementById('activationMessage').innerHTML = `
            <div class="alert alert-success">
                ✅ Votre compte a été activé avec succès. Vous pouvez maintenant vous connecter.
            </div>
        `;
    }
});


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