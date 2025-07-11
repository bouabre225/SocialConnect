document.getElementById('sidebarMobileBtn').addEventListener('click', function () {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    sidebar.classList.toggle('show');
    overlay.classList.toggle('show');
});

document.getElementById('overlay').addEventListener('click', function () {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    sidebar.classList.remove('show');
    overlay.classList.remove('show');
});


const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    const savedTheme = localStorage.getItem('darkTheme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'true' || (savedTheme === null && prefersDark)) {
        document.body.classList.add('dark-theme');
        themeToggle.checked = true;
    }

    themeToggle.addEventListener('change', function () {
        const isDark = this.checked;
        document.body.classList.toggle('dark-theme', isDark);
        localStorage.setItem('darkTheme', isDark);
    });
}

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeIn 0.6s ease-out';
        }
    });
}, observerOptions);

document.querySelectorAll('.card-stat, .card').forEach(card => {
    observer.observe(card);
});
