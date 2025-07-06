<?php
require_once __DIR__.'/../../config/config.php';

// Vérification de l'authentification
if (!isset($_SESSION['user_id'])) {
    header('Location: /login.php');
    exit;
}

$user = getUserData($_SESSION['user_id'], $pdo);
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Paramètres | SocialConnect</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            --primary: #1877f2;
            --secondary: #42b72a;
            --bg: #f0f2f5;
            --card: #ffffff;
            --text: #050505;
            --text-light: #65676b;
        }

        .settings-container {
            max-width: 1200px;
            margin: 20px auto;
            display: grid;
            grid-template-columns: 280px 1fr;
            gap: 20px;
        }

        .settings-sidebar {
            background: var(--card);
            border-radius: 8px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
            padding: 16px 0;
        }

        .settings-main {
            background: var(--card);
            border-radius: 8px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
            padding: 20px;
        }

        .settings-menu-item {
            display: flex;
            align-items: center;
            padding: 12px 16px;
            cursor: pointer;
            transition: background 0.2s;
        }

        .settings-menu-item:hover {
            background: var(--bg);
        }

        .settings-menu-item.active {
            border-left: 3px solid var(--primary);
            background: #f0f2f5;
        }

        .settings-menu-item i {
            margin-right: 12px;
            color: var(--text-light);
            width: 20px;
            text-align: center;
        }

        .settings-section {
            margin-bottom: 32px;
        }

        .settings-section h2 {
            font-size: 20px;
            margin-bottom: 16px;
            padding-bottom: 8px;
            border-bottom: 1px solid #ddd;
        }

        .form-group {
            margin-bottom: 16px;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
        }

        .form-control {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 15px;
        }

        .btn {
            padding: 8px 16px;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
            border: none;
        }

        .btn-primary {
            background: var(--primary);
            color: white;
        }
    </style>
</head>
<body>
    <?php include __DIR__.'/../partials/header.php'; ?>

    <div class="settings-container">
        <!-- Menu latéral -->
        <div class="settings-sidebar">
            <div class="settings-menu-item active">
                <i class="fas fa-user"></i>
                <span>Informations personnelles</span>
            </div>
            <div class="settings-menu-item">
                <i class="fas fa-lock"></i>
                <span>Confidentialité</span>
            </div>
            <div class="settings-menu-item">
                <i class="fas fa-bell"></i>
                <span>Notifications</span>
            </div>
            <div class="settings-menu-item">
                <i class="fas fa-shield-alt"></i>
                <span>Sécurité</span>
            </div>
            <div class="settings-menu-item">
                <i class="fas fa-ad"></i>
                <span>Préférences pubs</span>
            </div>
        </div>

        <!-- Contenu principal -->
        <div class="settings-main">
            <!-- Section Informations personnelles -->
            <div class="settings-section">
                <h2>Informations personnelles</h2>
                
                <form id="personalInfoForm" action="/controllers/settings/update_personal_info.php" method="POST">
                    <input type="hidden" name="csrf_token" value="<?= $_SESSION['csrf_token'] ?>">

                    <div class="form-group">
                        <label>Nom</label>
                        <input type="text" class="form-control" name="lastname" value="<?= htmlspecialchars($user['lastname']) ?>">
                    </div>

                    <div class="form-group">
                        <label>Prénom</label>
                        <input type="text" class="form-control" name="firstname" value="<?= htmlspecialchars($user['firstname']) ?>">
                    </div>

                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" class="form-control" name="email" value="<?= htmlspecialchars($user['email']) ?>">
                    </div>

                    <div class="form-group">
                        <label>Bio</label>
                        <textarea class="form-control" name="bio" rows="3"><?= htmlspecialchars($user['bio'] ?? '') ?></textarea>
                    </div>

                    <button type="submit" class="btn btn-primary">Enregistrer</button>
                </form>
            </div>

            <!-- Section Mot de passe -->
            <div class="settings-section">
                <h2>Changer de mot de passe</h2>
                
                <form id="passwordForm" action="/controllers/settings/update_password.php" method="POST">
                    <input type="hidden" name="csrf_token" value="<?= $_SESSION['csrf_token'] ?>">

                    <div class="form-group">
                        <label>Ancien mot de passe</label>
                        <input type="password" class="form-control" name="current_password" required>
                    </div>

                    <div class="form-group">
                        <label>Nouveau mot de passe</label>
                        <input type="password" class="form-control" name="new_password" required minlength="8">
                    </div>

                    <div class="form-group">
                        <label>Confirmer le nouveau mot de passe</label>
                        <input type="password" class="form-control" name="confirm_password" required>
                    </div>

                    <button type="submit" class="btn btn-primary">Mettre à jour</button>
                </form>
            </div>

            <!-- Section Avatar -->
            <div class="settings-section">
                <h2>Photo de profil</h2>
                
                <form id="avatarForm" action="/controllers/settings/update_avatar.php" method="POST" enctype="multipart/form-data">
                    <input type="hidden" name="csrf_token" value="<?= $_SESSION['csrf_token'] ?>">

                    <div class="form-group">
                        <label>Choisir une image (JPG/PNG, max 5MB)</label>
                        <input type="file" class="form-control" name="avatar" accept="image/jpeg,image/png">
                    </div>

                    <button type="submit" class="btn btn-primary">Mettre à jour</button>
                </form>
            </div>
        </div>
    </div>

    <?php include __DIR__.'/../partials/footer.php'; ?>

    <script>
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
    </script>
</body>
</html>