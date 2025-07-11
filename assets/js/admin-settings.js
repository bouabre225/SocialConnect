
    // Initialisation Google Translate
    function googleTranslateElementInit() {
        new google.translate.TranslateElement({
            pageLanguage: 'fr',
            includedLanguages: 'fr,en,es,de,it,ar,pt,zh-CN,ru,ja',
            layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false
        }, 'google_translate_element');
    }
 
    // Affiche le sélecteur de langue Google Translate
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

    document.addEventListener('DOMContentLoaded', function () {
        // Gestion thème sombre + checkbox toggle
        const themeToggle = document.getElementById('themeToggle');

        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('darkTheme');

        if (savedTheme === 'true' || (savedTheme === null && prefersDark)) {
            document.body.classList.add('dark-theme');
            if (themeToggle) themeToggle.checked = true;
        }

        if (themeToggle) {
            themeToggle.addEventListener('change', function () {
                const isDark = this.checked;
                document.body.classList.toggle('dark-theme', isDark);
                localStorage.setItem('darkTheme', isDark);
            });
        }

        // Toggle visibilité mot de passe pour tous les boutons avec la classe toggle-password
        document.querySelectorAll('.toggle-password').forEach(button => {
            button.addEventListener('click', function () {
                const passwordField = this.closest('.input-group').querySelector('.password-field');
                if (!passwordField) return;
                const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordField.setAttribute('type', type);
                this.querySelector('i').classList.toggle('bi-eye');
                this.querySelector('i').classList.toggle('bi-eye-slash');
            });
        });

        // Exemple de gestion soumission formulaire login 
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', function (e) {
                e.preventDefault();
                const loginText = document.getElementById('loginText');
                const loginSpinner = document.getElementById('loginSpinner');

                if (loginText) loginText.classList.add('d-none');
                if (loginSpinner) loginSpinner.classList.remove('d-none');

                setTimeout(() => {
                    if (loginText) loginText.classList.remove('d-none');
                    if (loginSpinner) loginSpinner.classList.add('d-none');

                    //alert('Fonctionnalité de connexion à implémenter');
                }, 1500);
            });
        }
    });

