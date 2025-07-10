// Validation email basique
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.trim());
}

// Affichage message d'erreur ou succès
function displayMessage(message, type, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = `
        <div class="alert alert-${type}">
            ${message}
        </div>
    `;
}

function forgot(formData){
    ApiCall('forgot', 'POST', formData)
    .then(data => {
        if (data.status === 'success') {
            displayMessage(data.message, 'success', 'forgotMessage');
            forgotForm.reset();
        } else {
            displayMessage(data.message, 'danger', 'forgotMessage');
        }
    })
    .catch(error => {
        console.error(error);
        displayMessage('Une erreur réseau est survenue. Veuillez réessayer.', 'danger', 'forgotMessage');
    })
}

//document.addEventListener('DOMContentLoaded', () => {
    const forgotForm = document.getElementById('forgotForm');
    if (forgotForm) {
        forgotForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = forgotForm.email.value.trim();
            const messageContainer = 'forgotMessage';

            // Validation email
            if (!validateEmail(email)) {
                displayMessage('Veuillez entrer une adresse e-mail valide.', 'danger', messageContainer);
                return;
            }

            // Affiche loader
            document.getElementById('loaderForgot').style.display = 'block';

            try {
                const response = await forgot({ email });
                document.getElementById('loaderForgot').style.display = 'none';

                if (response.status === 'success') {
                    displayMessage(response.message, 'success', messageContainer);
                    forgotForm.reset();
                } else {
                    displayMessage(response.message, 'danger', messageContainer);
                }

            } catch (error) {
                console.error(error);
                document.getElementById('loaderForgot').style.display = 'none';
                displayMessage('Une erreur réseau est survenue. Veuillez réessayer.', 'danger', messageContainer);
            }
        });
    }
//});
