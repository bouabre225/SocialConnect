 // DOM Elements
        const editProfileBtn = document.getElementById('editProfileBtn');
        const passwordModal = document.getElementById('passwordModal');
        const editProfileModal = document.getElementById('editProfileModal');
        const passwordForm = document.getElementById('passwordForm');
        const profileForm = document.getElementById('profileForm');
        const modalCloses = document.querySelectorAll('.modal-close');
        const publishPostBtn = document.getElementById('publishPostBtn');
        const postContent = document.getElementById('postContent');
        
        // Ouvrir la fenêtre modale de mot de passe quand le bouton modifier le profil est cliqué
        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', () => {
                passwordModal.style.display = 'flex';
            });
        }
        
        // Fermer la fenêtre modale quand le bouton fermer est cliqué
        modalCloses.forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.modal').forEach(modal => {
                    modal.style.display = 'none';
                });
            });
        });
        
        // Fermer la fenêtre modale en cliquant à l'extérieur du contenu de la fenêtre modale
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });
        
        // Gérer la soumission du formulaire de mot de passe
        passwordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(passwordForm);
            
            try {
                const response = await fetch('verify_password.php', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                
                if (data.success) {
                    passwordModal.style.display = 'none';
                    editProfileModal.style.display = 'flex';
                } else {
                    alert(data.message || 'Mot de passe incorrect');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Une erreur est survenue');
            }
        });
        
        // Gérer la soumission du formulaire du profil
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(profileForm);
            
            try {
                const response = await fetch('Update_Profil.php', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                
                if (data.success) {
                    alert('Profil mis à jour avec succès');
                    location.reload();
                } else {
                    alert(data.message || 'Erreur lors de la mise à jour du profil');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Une erreur est survenue');
            }
        });
        
        // Gérer la publication
        publishPostBtn.addEventListener('click', async () => {
    if (!content || content.trim() === '') {
        alert('Veuillez entrer du contenu');
        return;
    }
    
    try {
        const response = await fetch('create_post.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: content,
                csrf_token: '<?= $_SESSION['csrf_token'] ?>'
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
            alert('Publication créée avec succès');
            location.reload();
        } else {
            alert(data.message || 'Erreur lors de la création de la publication');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Une erreur est survenue lors de la création de la publication');
    }
});
