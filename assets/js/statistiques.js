
const sidebarMobileBtn = document.getElementById('sidebarMobileBtn');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');

if (sidebarMobileBtn) {
    sidebarMobileBtn.addEventListener('click', function() {
        sidebar.classList.toggle('show');
        sidebarOverlay.classList.toggle('show');
        document.body.style.overflow = sidebar.classList.contains('show') ? 'hidden' : 'auto';
    });
}

if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', function() {
        this.classList.remove('show');
        sidebar.classList.remove('show');
        document.body.style.overflow = 'auto';
    });
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && sidebar.classList.contains('show')) {
        sidebar.classList.remove('show');
        sidebarOverlay.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
});

const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    themeToggle.addEventListener('change', function() {
        document.body.classList.toggle('dark-theme');
        localStorage.setItem('darkMode', this.checked);
    });
    
    if (localStorage.getItem('darkMode') === 'true') {
        themeToggle.checked = true;
        document.body.classList.add('dark-theme');
    }
}

function showLanguageSelector() {
    const translateElement = document.getElementById('google_translate_element');
    translateElement.style.display = translateElement.style.display === 'none' ? 'block' : 'none';
    
    if (!window.googleTranslateElementInit) {
        window.googleTranslateElementInit = function() {
            new google.translate.TranslateElement({
                pageLanguage: 'fr',
                includedLanguages: 'en,es,de,it,pt',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE
            }, 'google_translate_element');
        };
        
        const script = document.createElement('script');
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        document.body.appendChild(script);
    }
}


document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});


window.addEventListener('load', function() {
    document.querySelector('.fade-in').style.opacity = '1';
});


const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
});
