// Configuration de l'API


const API_URL = 'http://localhost/ReseauSocial/api';
const app = document.getElementById('app');
// Validation des formulaires
function validateForm(formData, type) {
    const errors = [];

    if (!formData.email || !formData.email.trim()) {
        errors.push('L\'email est requis');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.push('Email invalide');
    }

    if (type === 'login') {
        if (!formData.password || formData.password.length < 8) {
            errors.push('Le mot de passe doit contenir au moins 8 caractères');
        }
    } else { // register
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

//document.addEventListener('DOMContentLoaded', () => {
    // Gestion des formulaires
    console.log('DOMContentLoaded capturé');
    document.addEventListener('submit', async function (e) {
        e.preventDefault();
        console.log('Événement submit capturé pour', e.target.id);
    try {
        if (e.target.id === 'loginForm') {
            e.preventDefault();
            console.log('Soumission du formulaire de connexion');
            const savedEmail = localStorage.getItem('rememberedEmail');
            if (savedEmail) {
                document.querySelector('input[name="email"]').value = savedEmail;
                document.getElementById('rememberMe').checked = true;
            }
    
            const formData = {
                email: e.target.email.value.trim(),
                password: e.target.password.value
            };
    
            const errors = validateForm(formData, 'login');
            if (errors.length > 0) {
                handleError(errors.join('<br>'), document.getElementById('loginMessage'));
                return;
            }
    
            document.getElementById('loader').style.display = 'block';
            try {
                const response = await fetch(`${API_URL}/login.php`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': sessionStorage.getItem('csrf_token') || ''
                    },
                    body: JSON.stringify(formData)
                });
    
                const data = await response.json();
    
                if (data.status === 'success') {
                    sessionStorage.setItem('user', JSON.stringify(data.user));
                    sessionStorage.setItem('csrf_token', data.user.csrf_token);
    
                    if (document.getElementById('rememberMe').checked) {
                        localStorage.setItem('rememberedEmail', formData.email);
                    } else {
                        localStorage.removeItem('rememberedEmail');
                    }   
                    setTimeout(() => {
                        history.pushState(null, '', '/home');
                        router();
                    }, 1200);
                } else {
                    handleError(data.message, document.getElementById('loginMessage'));
                }
            } catch (error) {
                handleError('Une erreur est survenue lors de la connexion', document.getElementById('loginMessage'));
            } finally {
                document.getElementById('loader').style.display = 'none';
            }
        } else if (e.target.id === 'registerForm') {
                e.preventDefault();
                console.log('Soumission du formulaire d\'inscription');
                const formData = {
                    firstname: e.target.firstname.value.trim(),
                    lastname: e.target.lastname.value.trim(),
                    email: e.target.email.value.trim(),
                    password: e.target.password.value,
                    confirm_password: e.target.confirm_password.value
                };

                const errors = validateForm(formData, 'register');
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
                        e.target.reset();
                        setTimeout(() => {
                            history.pushState(null, '', '/login');
                            router();        
                        }, 1200);
                    } else {
                        handleError(data.message, document.getElementById('registerMessage'));
                    }

                } catch (error) {
                    handleError('Une erreur est survenue lors de l\'inscription', document.getElementById('registerMessage'));
                    document.getElementById('loaderReg').style.display = 'none';
                }
            }    
        } catch (error) {
            console.error('Erreur dans le gestionnaire de soumission :', error);
        }
    });
        
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
//});