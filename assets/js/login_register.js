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

// Fonction async pour gérer la connexion
async function loginUser(formData) {
    console.log('Envoi de la requête de connexion avec :', formData);
    try {
        const response = await fetch('http://localhost:8001/login.php', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        console.log('Statut de la réponse login.php :', response.status);
        // Vérifier si la réponse est du JSON valide
        const text = await response.text();
        console.log('Contenu brut de la réponse :', text);
        try {
            const data = JSON.parse(text);
            console.log('Réponse de login.php :', data);

            if (data.status === 'success') {
                localStorage.setItem('token', data.user.token); // Stocker le token JWT
                localStorage.setItem('user', JSON.stringify(data.user)); // Stocker les données utilisateur
                /*if (document.getElementById('rememberMe')?.checked) {
                    localStorage.setItem('rememberedEmail', formData.email);
                } else {
                    localStorage.removeItem('rememberedEmail');
                }*/
                console.log('Connexion réussie, redirection vers /home');
                navigateTo('/home');
            } else {
                throw new Error(data.message);
            }
        } catch (jsonError) {
            console.error('Erreur de parsing JSON :', jsonError, 'Contenu brut :', text);
            throw new Error('Réponse du serveur non valide. Veuillez vérifier la configuration du serveur.');
        }
    } catch (error) {
        console.error('Erreur dans loginUser :', error);
        throw new Error(error.message || 'Une erreur est survenue lors de la connexion');
    } finally {
        if (document.getElementById('loader')) {
            document.getElementById('loader').style.display = 'none';
        }
    }
}

// Fonction async pour gérer l'inscription
async function registerUser(formData) {
    console.log('Envoi de la requête d\'inscription avec :', formData);
    try {
        const response = await fetch('http://localhost:8001/register.php', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        console.log('Statut de la réponse register.php :', response.status);
        const data = await response.json();
        console.log('Réponse de register.php :', data);

        if (data.status === 'success') {
            return data;
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Erreur dans registerUser :', error);
        throw new Error(error.message || 'Une erreur est survenue lors de l\'inscription');
    }
}

// Gestion des formulaires
//document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOMContentLoaded capturé');

    // Vérifier si l'utilisateur est déjà connecté dans sessionStorage
    const user = sessionStorage.getItem('user');
    if (user) {
        console.log('Utilisateur trouvé dans sessionStorage, redirection vers /home');
        navigateTo('/home');
    }

    document.addEventListener('submit', async function (e) {
        e.preventDefault();
        console.log('Événement submit capturé pour', e.target.id);

        try {
            // LOGIN
            if (e.target.id === 'loginForm') {
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
                    const data = await loginUser(formData);

                    if (document.getElementById('rememberMe').checked) {
                        localStorage.setItem('rememberedEmail', formData.email);
                    } else {
                        localStorage.removeItem('rememberedEmail');
                    }

                    console.log('Connexion réussie, redirection vers /home');
                    navigateTo('/home');
                } catch (error) {
                    handleError(error.message, document.getElementById('loginMessage'));
                } finally {
                    document.getElementById('loader').style.display = 'none';
                }

            // REGISTER
            } else if (e.target.id === 'registerForm') {
                console.log('Soumission du formulaire d\'inscription');

                const formData = {
                    firstname: e.target.firstname.value.trim(),
                    lastname: e.target.lastname.value.trim(),
                    username: e.target.username.value.trim(),
                    birthdate: e.target.birthdate.value,
                    gender: e.target.gender.value,
                    relationship_status: e.target.relationship_status.value,
                    profession: e.target.profession.value.trim(),
                    country: e.target.country.value,
                    city: e.target.city.value.trim(),
                    email: e.target.email.value.trim(),
                    interests: e.target.interests.value.trim(),
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
                    const data = await registerUser(formData);

                    document.getElementById('registerMessage').innerHTML = `
                        <div class="alert alert-success">
                            ${data.message}
                        </div>
                    `;
                    e.target.reset();
                    console.log('Inscription réussie, redirection vers /login');
                    setTimeout(() => {
                        navigateTo('/login');
                    }, 1200);
                } catch (error) {
                    handleError(error.message, document.getElementById('registerMessage'));
                } finally {
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