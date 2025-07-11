// Gestion des formulaires avec AJAX
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        
        if (result.success) {
            alert('Modifications enregistrées !');
            if (form.id === 'avatarForm') {
                location.reload();
            }
        } else {
            alert(result.message || 'Une erreur est survenue');
        }
    });
});