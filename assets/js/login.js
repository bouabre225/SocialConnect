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
                navigated('home');
            }, 1200);
        } else {
            displayMessage(data.message, 'danger', 'loginMessage');
        }
    })
    .catch(error => {
        displayMessage('Une erreur est survenue lors de la connexion', 'danger', 'loginMessage');
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
                displayMessage(errors.join('<br>'), 'danger', 'loginMessage');
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
                        navigated('home');
                    }, 1200);
                } else {
                    displayMessage(response.message, 'danger', 'loginMessage');
                }
                
                

            } catch (error) {
                displayMessage('Une erreur est survenue lors de la connexion', 'danger', 'loginMessage');
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