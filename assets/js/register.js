function register(formData){
    ApiCall('register', 'POST', formData)
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
            displayMessage(data.message, 'danger', 'registerMessage');
        }
    })
    .catch(error => {
        displayMessage('Une erreur est survenue lors de l\'inscription', 'danger', 'registerMessage');
    })
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

            const errors = validateForm(formData, 'register');
            if (errors.length > 0) {
                displayMessage(errors.join('<br>'), 'danger', 'registerMessage');
                return;
            }

            document.getElementById('loaderReg').style.display = 'block';

            try {
                const response = await register(formData);
                document.getElementById('loaderReg').style.display = 'none';

                if (response.status === 'success') {
                    document.getElementById('registerMessage').innerHTML = `
                        <div class="alert alert-success">
                            ${response.message}
                        </div>
                    `;
                    this.reset();
                    setTimeout(() => {
                        navigated('home');
                    }, 1200);
                } else {
                    displayMessage(response.message, 'danger', 'registerMessage');
                }

            } catch (error) {
                displayMessage('Une erreur est survenue lors de l\'inscription', 'danger', 'registerMessage');
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
