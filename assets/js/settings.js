const themeSwitches = document.querySelectorAll('[data-theme]');
if (themeSwitches.length) {
document.querySelector('[data-theme="light"]').classList.add('active');
document.querySelector('[data-theme="dark"]').classList.remove('active');
document.querySelector('[data-theme="auto"]').classList.remove('active');
}

const translations = {
fr: {
        settings: "Paramètres",
        settings_desc: "Personnalisez votre expérience et gérez vos préférences",
        profile: "Profil",
        security: "Sécurité",
        notifications: "Notifications",
        privacy: "Confidentialité",
        preferences: "Préférences",
        ads: "Préférences pubs",
        personal_info: "Informations personnelles",
        change_photo: "Changer la photo",
        firstname_placeholder: "Votre prénom",
        firstname_desc: "Votre prénom tel qu'il apparaîtra sur votre profil",
        lastname_placeholder: "Votre nom",
        lastname_desc: "Votre nom de famille",
        email_placeholder: "votre.email@example.com",
        email_desc: "Votre adresse email principale",
        phone_placeholder: "Votre numéro",
        phone_desc: "Votre numéro de téléphone",
        bio_placeholder: "Parlez-nous de vous...",
        bio_desc: "Une courte description de vous",
        save_changes: "Enregistrer les modifications",
        security_title: "Sécurité du compte",
        current_password_placeholder: "Mot de passe actuel",
        current_password_desc: "Saisissez votre mot de passe actuel",
        new_password_placeholder: "Nouveau mot de passe",
        new_password_desc: "Choisissez un mot de passe fort",
        confirm_password_placeholder: "Confirmer le mot de passe",
        confirm_password_desc: "Confirmez votre nouveau mot de passe",
        update_password: "Mettre à jour le mot de passe",
        notifications_title: "Préférences de notification",
        email_notifications: "Notifications par email",
        email_notifications_desc: "Recevez des mises à jour importantes par email",
        push_notifications: "Notifications push",
        push_notifications_desc: "Notifications instantanées dans votre navigateur",
        sms_notifications: "Notifications SMS",
        sms_notifications_desc: "Alertes importantes par message texte",
        privacy_title: "Confidentialité",
        public_profile: "Profil public",
        public_profile_desc: "Permettre aux autres de voir votre profil",
        searchable: "Apparaître dans les recherches",
        searchable_desc: "Permettre à votre profil d'être trouvé via la recherche",
        mentionable: "Mentionnable",
        mentionable_desc: "Permettre aux autres de vous mentionner",
        data_sharing: "Partage de données",
        data_sharing_none: "Ne partager aucune donnée avec des tiers",
        data_sharing_basic: "Partager des données basiques pour une expérience personnalisée",
        data_sharing_full: "Partager toutes les données pour une expérience optimale",
        data_sharing_desc: "Contrôlez comment vos données sont partagées avec nos partenaires",
        delete_account: "Supprimer mon compte",
        language_region: "Langue et région",
        language_fr: "Français",
        language_en: "English",
        language_desc: "Langue d'affichage",
        region_fr: "France",
        region_be: "Belgique",
        region_ca: "Canada",
        region_ch: "Suisse",
        region_lu: "Luxembourg",
        region_desc: "Région pour le contenu local",
        theme: "Thème",
        theme_light: "Thème clair",
        theme_light_desc: "Interface lumineuse avec couleurs vives",
        theme_dark: "Thème sombre",
        theme_dark_desc: "Interface sombre pour un confort visuel",
        theme_auto: "Automatique",
        theme_auto_desc: "Adapte le thème à vos préférences système",
        ads_title: "Préférences publicitaires",
        personalized_ads: "Publicités personnalisées",
        personalized_ads_desc: "Recevoir des publicités adaptées à vos centres d'intérêt",
        interests: "Centres d'intérêt",
        interests_desc: "Sélectionnez vos centres d'intérêt pour améliorer la pertinence des publicités",
        interest_technology: "Technologie",
        interest_sports: "Sports",
        interest_travel: "Voyage",
        interest_fashion: "Mode",
        interest_food: "Cuisine",
        interest_gaming: "Jeux vidéo",
        interest_music: "Musique",
        interest_movies: "Cinéma",
        interest_fitness: "Fitness",
        interest_reading: "Lecture",
        ad_frequency: "Fréquence publicitaire",
        ad_frequency_minimal: "Minimale (moins de publicités)",
        ad_frequency_normal: "Normale",
        ad_frequency_frequent: "Fréquente (pour soutenir la plateforme)",
        ad_frequency_desc: "Contrôlez la fréquence des publicités que vous voyez",
        success_notification: "Modifications enregistrées avec succès!",
        delete_account_confirm: "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.",
        delete_account_success: "Votre compte a été supprimé. Redirection..."
    },
    en: {
        settings: "Settings",
        settings_desc: "Customize your experience and manage your preferences",
        profile: "Profile",
        security: "Security",
        notifications: "Notifications",
        privacy: "Privacy",
        preferences: "Preferences",
        ads: "Ad Preferences",
        personal_info: "Personal Information",
        change_photo: "Change Photo",
        firstname_placeholder: "Your first name",
        firstname_desc: "Your first name as it will appear on your profile",
        lastname_placeholder: "Your last name",
        lastname_desc: "Your last name",
        email_placeholder: "your.email@example.com",
        email_desc: "Your primary email address",
        phone_placeholder: "Your phone number",
        phone_desc: "Your phone number",
        bio_placeholder: "Tell us about yourself...",
        bio_desc: "A short description about you",
        save_changes: "Save Changes",
        security_title: "Account Security",
        current_password_placeholder: "Current password",
        current_password_desc: "Enter your current password",
        new_password_placeholder: "New password",
        new_password_desc: "Choose a strong password",
        confirm_password_placeholder: "Confirm password",
        confirm_password_desc: "Confirm your new password",
        update_password: "Update Password",
        notifications_title: "Notification Preferences",
        email_notifications: "Email Notifications",
        email_notifications_desc: "Receive important updates via email",
        push_notifications: "Push Notifications",
        push_notifications_desc: "Instant notifications in your browser",
        sms_notifications: "SMS Notifications",
        sms_notifications_desc: "Important alerts via text message",
        privacy_title: "Privacy",
        public_profile: "Public Profile",
        public_profile_desc: "Allow others to see your profile",
        searchable: "Appear in Searches",
        searchable_desc: "Allow your profile to be found via search",
        mentionable: "Mentionable",
        mentionable_desc: "Allow others to mention you",
        data_sharing: "Data Sharing",
        data_sharing_none: "Do not share any data with third parties",
        data_sharing_basic: "Share basic data for a personalized experience",
        data_sharing_full: "Share all data for an optimal experience",
        data_sharing_desc: "Control how your data is shared with our partners",
        delete_account: "Delete My Account",
        language_region: "Language and Region",
        language_fr: "French",
        language_en: "English",
        language_desc: "Display language",
        region_fr: "France",
        region_be: "Belgium",
        region_ca: "Canada",
        region_ch: "Switzerland",
        region_lu: "Luxembourg",
        region_desc: "Region for local content",
        theme: "Theme",
        theme_light: "Light Theme",
        theme_light_desc: "Bright interface with vibrant colors",
        theme_dark: "Dark Theme",
        theme_dark_desc: "Dark interface for visual comfort",
        theme_auto: "Automatic",
        theme_auto_desc: "Adapts the theme to your system preferences",
        ads_title: "Ad Preferences",
        personalized_ads: "Personalized Ads",
        personalized_ads_desc: "Receive ads tailored to your interests",
        interests: "Interests",
        interests_desc: "Select your interests to improve ad relevance",
        interest_technology: "Technology",
        interest_sports: "Sports",
        interest_travel: "Travel",
        interest_fashion: "Fashion",
        interest_food: "Food",
        interest_gaming: "Gaming",
        interest_music: "Music",
        interest_movies: "Movies",
        interest_fitness: "Fitness",
        interest_reading: "Reading",
        ad_frequency: "Ad Frequency",
        ad_frequency_minimal: "Minimal (fewer ads)",
        ad_frequency_normal: "Normal",
        ad_frequency_frequent: "Frequent (to support the platform)",
        ad_frequency_desc: "Control how often you see ads",
        success_notification: "Changes saved successfully!",
        delete_account_confirm: "Are you sure you want to delete your account? This action is irreversible.",
        delete_account_success: "Your account has been deleted. Redirecting..."
    }
};      

    let currentLanguage = 'fr'; 

    function changeLanguage(lang) {
    currentLanguage = lang;
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (translations[lang][key]) {
            element.placeholder = translations[lang][key];
        }
    });
    }

    function showSuccessNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
        <i class="bi bi-check-circle"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
    }

//document.addEventListener('DOMContentLoaded', function() {
    changeLanguage(currentLanguage);

    const menuItems = document.querySelectorAll('.settings-menu-item');
    const sections = document.querySelectorAll('.settings-section');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            menuItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            sections.forEach(section => {
                section.style.display = 'none';
            });
            
            const sectionId = this.getAttribute('data-section') + '-section';
            document.getElementById(sectionId).style.display = 'block';
        });
    });

    const themeToggle = document.querySelector('.theme-toggle');
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        
        const icon = this.querySelector('i');
        if (document.body.classList.contains('dark-theme')) {
            icon.classList.remove('bi-moon');
            icon.classList.add('bi-sun');
        } else {
            icon.classList.remove('bi-sun');
            icon.classList.add('bi-moon');
        }

        const themeSwitches = document.querySelectorAll('[data-theme]');
        themeSwitches.forEach(t => t.classList.remove('active'));
        const theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
        document.querySelector(`[data-theme="${theme}"]`).classList.add('active');
    });

    const toggleSwitches = document.querySelectorAll('.toggle-switch');
    
    toggleSwitches.forEach(toggle => {
        toggle.addEventListener('click', function() {
            this.classList.toggle('active');
            
            if (this.hasAttribute('data-theme')) {
                document.querySelectorAll(`[data-theme]`).forEach(t => {
                    if (t !== this) t.classList.remove('active');
                });
                const theme = this.getAttribute('data-theme');
                if (theme === 'dark') {
                    document.body.classList.add('dark-theme');
                    themeToggle.querySelector('i').classList.remove('bi-moon');
                    themeToggle.querySelector('i').classList.add('bi-sun');
                } else if (theme === 'light') {
                    document.body.classList.remove('dark-theme');
                    themeToggle.querySelector('i').classList.remove('bi-sun');
                    themeToggle.querySelector('i').classList.add('bi-moon');
                } else if (theme === 'auto') {
                    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    document.body.classList.toggle('dark-theme', prefersDarkScheme);
                    themeToggle.querySelector('i').classList.toggle('bi-sun', prefersDarkScheme);
                    themeToggle.querySelector('i').classList.toggle('bi-moon', !prefersDarkScheme);
                }
            }
        });
    });

    const interestTags = document.querySelectorAll('.interest-tag');
    
    interestTags.forEach(tag => {
        tag.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });

    const avatarUpload = document.getElementById('avatar-upload');
    const avatarPreview = document.querySelector('.avatar-preview');
    
    if (avatarUpload) {
        avatarUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    avatarPreview.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    const newPasswordInput = document.querySelector('input[name="new_password"]');
    const passwordStrength = document.getElementById('password-strength');
    
    if (newPasswordInput && passwordStrength) {
        newPasswordInput.addEventListener('input', function() {
            const password = this.value;
            if (password.length === 0) {
                passwordStrength.style.display = 'none';
                return;
            }
            
            passwordStrength.style.display = 'block';
            
            let strength = 0;
            if (password.length >= 8) strength++;
            if (password.match(/[A-Z]/)) strength++;
            if (password.match(/[0-9]/)) strength++;
            if (password.match(/[^A-Za-z0-9]/)) strength++;
            
            if (strength < 2) {
                passwordStrength.className = 'password-strength password-weak';
                passwordStrength.textContent = translations[currentLanguage].weak_password || 'Faible';
            } else if (strength < 4) {
                passwordStrength.className = 'password-strength password-medium';
                passwordStrength.textContent = translations[currentLanguage].medium_password || 'Moyen';
            } else {
                passwordStrength.className = 'password-strength password-strong';
                passwordStrength.textContent = translations[currentLanguage].strong_password || 'Fort';
            }
        });
    }

    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> ' + (translations[currentLanguage].saving || 'Enregistrement...');
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                showSuccessNotification(translations[currentLanguage].success_notification);
            }, 1500);
        });
    });

    const deleteAccountBtn = document.getElementById('delete-account-btn');
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', function() {
            if (confirm(translations[currentLanguage].delete_account_confirm)) {
                this.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> ' + (translations[currentLanguage].deleting || 'Suppression...');
                
                setTimeout(() => {
                    showSuccessNotification(translations[currentLanguage].delete_account_success);
                    setTimeout(() => {
                        navigate('/home');
                    }, 2000);
                }, 2000);
            }
        });
    }

    document.body.classList.remove('dark-theme');
    if (themeToggle) {
        themeToggle.querySelector('i').classList.add('bi-moon');
        themeToggle.querySelector('i').classList.remove('bi-sun');
    }
//});
