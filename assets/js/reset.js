const API_URL = 'http://localhost/ReseauSocial/api';
const params = new URLSearchParams(window.location.search);
const token = params.get('token');

if (!token) {
    document.getElementById('resetMessage').innerHTML = `
        <div class="alert alert-danger">Lien invalide ou expiré.</div>
    `;
    document.getElementById('resetForm').style.display = 'none';
}

document.getElementById('resetForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const password = e.target.password.value;
    const confirm_password = e.target.confirm_password.value;

    if (password.length < 8) {
        document.getElementById('resetMessage').innerHTML = `
            <div class="alert alert-danger">Le mot de passe doit contenir au moins 8 caractères.</div>
        `;
        return;
    }

    if (password !== confirm_password) {
        document.getElementById('resetMessage').innerHTML = `
            <div class="alert alert-danger">Les mots de passe ne correspondent pas.</div>
        `;
        return;
    }

    try {
        const response = await fetch(`${API_URL}/reset_password.php?token=${token}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });
        const data = await response.json();

        if (data.status === 'success') {
            document.getElementById('resetMessage').innerHTML = `
                <div class="alert alert-success">${data.message}</div>
            `;
            e.target.reset();
            setTimeout(() => {
                history.pushState(null, '', '/login');
                router();
            }, 1200);
        } else {
            document.getElementById('resetMessage').innerHTML = `
                <div class="alert alert-danger">${data.message}</div>
            `;
        }
    } catch (err) {
        document.getElementById('resetMessage').innerHTML = `
            <div class="alert alert-danger">Erreur réseau, veuillez réessayer.</div>
        `;
    }
});