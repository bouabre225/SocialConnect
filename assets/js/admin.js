//document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const inputGroup = this.closest('.input-group');
            if (!inputGroup) return;
            const input = inputGroup.querySelector('input[type="password"], input[type="text"]');
            if (!input) return;
            const icon = this.querySelector('i');
            if (!icon) return;
            input.type = input.type === 'password' ? 'text' : 'password';
            if (icon.classList.contains('bi-eye')) {
                icon.classList.replace('bi-eye', 'bi-eye-slash');
            } else if (icon.classList.contains('bi-eye-slash')) {
                icon.classList.replace('bi-eye-slash', 'bi-eye');
            }
        });
    });

    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage'); 
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const loginSpinner = document.getElementById('loginSpinner');
            
            loginSpinner.classList.remove('d-none');
            
            
            setTimeout(() => {
                loginSpinner.classList.add('d-none');
                
            
                //alert('Fonctionnalité de connexion à implémenter');
            }, 1500);
            const submitButton = this.querySelector('button[type="submit"]');
            const spinner = submitButton.querySelector('#loginSpinner');

            submitButton.disabled = true;
            if (spinner) spinner.classList.remove('d-none');
            if (spinner) spinner.classList.remove('d-none');
            if (loginMessage) loginMessage.innerHTML = '';

            const formData = {
                email: this.email.value.trim(),
                password: this.password.value
            };

            try {
                const response = await fetch(API_URL3 + 'login.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                const data = await response.json();

                if (data.status === 'success') {
                    localStorage.setItem('token', data.token); // Stocker le token JWT
                    localStorage.setItem('user-id', data.user_id); // Stocker les données utilisateur
                    setTimeout(() => {
                        history.pushState(null, '', '/dashboard-admin');
                        router();
                    }, 1200);                
                } else {
            
                    if (loginMessage) loginMessage.innerHTML = `<div class="alert alert-danger">${data.message}</div>`;
                }
            } catch (error) {
                if (loginMessage) loginMessage.innerHTML = `<div class="alert alert-danger">Erreur réseau ou serveur.</div>`;
            } finally {
                submitButton.disabled = false;
                if (spinner) spinner.classList.add('d-none');
            }
                // Initialisation Google Translate
                if (typeof google !== 'undefined' && google.translate) {
                    googleTranslateElementInit();
                }
        });
    }
//});

function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'fr',
        includedLanguages: 'fr,en,es,de,it,ar,pt,zh-CN,ru,ja',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
    }, 'google_translate_element');
}


function showLanguageSelector() {
    const frame = document.querySelector('.goog-te-menu-frame');
    if (frame) {
        try {
            const menu = frame.contentDocument.querySelector('.goog-te-menu2-item');
            if (menu) menu.click();
            else alert("Le menu de langue n'est pas encore prêt.");
        } catch (e) {
            alert("Erreur lors de l'accès au menu Google Translate.");
        }
    } else {
        alert("Le traducteur Google n'est pas encore chargé. Veuillez réessayer.");
    }
}


document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('darkTheme');
    
    if (savedTheme === 'true' || (savedTheme === null && prefersDark)) {
        document.body.classList.add('dark-theme');
        themeToggle.checked = true;
    }
    

    themeToggle.addEventListener('change', function() {
        const isDark = this.checked;
        document.body.classList.toggle('dark-theme', isDark);
        localStorage.setItem('darkTheme', isDark);
    });
    

    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const passwordField = this.closest('.input-group').querySelector('.password-field');
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);
            this.querySelector('i').classList.toggle('bi-eye');
            this.querySelector('i').classList.toggle('bi-eye-slash');
        });
    });
    

    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const loginText = document.getElementById('loginText');
        const loginSpinner = document.getElementById('loginSpinner');
        
        loginText.classList.add('d-none');
        loginSpinner.classList.remove('d-none');
        
        
        setTimeout(() => {
            loginText.classList.remove('d-none');
            loginSpinner.classList.add('d-none');
            
        
            alert('Fonctionnalité de connexion à implémenter');
        }, 1500);
    });
});

    
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'fr',
        includedLanguages: 'fr,en,es,de,it,ar,pt,zh-CN,ru,ja',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
    }, 'google_translate_element');
}


function showLanguageSelector() {
    const frame = document.querySelector('.goog-te-menu-frame');
    if (frame) {
        try {
            const menu = frame.contentDocument.querySelector('.goog-te-menu2-item');
            if (menu) menu.click();
            else alert("Le menu de langue n'est pas encore prêt.");
        } catch (e) {
            alert("Erreur lors de l'accès au menu Google Translate.");
        }
    } else {
        alert("Le traducteur Google n'est pas encore chargé. Veuillez réessayer.");
    }
}


document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('darkTheme');
    
    if (savedTheme === 'true' || (savedTheme === null && prefersDark)) {
        document.body.classList.add('dark-theme');
        themeToggle.checked = true;
    }
    

    themeToggle.addEventListener('change', function() {
        const isDark = this.checked;
        document.body.classList.toggle('dark-theme', isDark);
        localStorage.setItem('darkTheme', isDark);
    });
    

    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const passwordField = this.closest('.input-group').querySelector('.password-field');
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);
            this.querySelector('i').classList.toggle('bi-eye');
            this.querySelector('i').classList.toggle('bi-eye-slash');
        });
    });
});
