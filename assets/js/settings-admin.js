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

function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeToggleCard = document.getElementById('themeToggleCard');
    
    function toggleTheme(isChecked) {
        document.body.classList.toggle('dark-theme', isChecked);
        localStorage.setItem('darkTheme', isChecked);
        
        if (themeToggle) themeToggle.checked = isChecked;
        if (themeToggleCard) themeToggleCard.checked = isChecked;
    }
    
    const savedTheme = localStorage.getItem('darkTheme') === 'true';
    toggleTheme(savedTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('change', function() {
            toggleTheme(this.checked);
        });
    }
    
    if (themeToggleCard) {
        themeToggleCard.addEventListener('change', function() {
            toggleTheme(this.checked);
        });
    }
}
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'fr',
        includedLanguages: 'fr,en,es,de,it,ar,pt,zh-CN,ru,ja',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
    }, 'google_translate_element');
}

function showLanguageSelector() {
    const translateElement = document.getElementById('google_translate_element');
    if (translateElement.style.display === 'none' || !translateElement.style.display) {
        translateElement.style.display = 'block';
        
        if (!window.google || !window.google.translate) {
            const script = document.createElement('script');
            script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            document.body.appendChild(script);
        }
    } else {
        translateElement.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initThemeToggle();
    
    document.querySelector('.fade-in').style.opacity = '1';
});


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
