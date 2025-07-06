<?php
 
 include "C:\xampp\htdocs\SocialConnect\vues\clients\Pro.php";
  
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profil de <?= htmlspecialchars($user['firstname'] . ' ' . $user['lastname']) ?> | SocialConnect</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        /* CSS styles pour la page profile */
        :root {
            --primary-color: #1877f2;
            --secondary-color: #42b72a;
            --bg-color: #f0f2f5;
            --card-color: #ffffff;
            --text-color: #050505;
            --text-secondary: #65676b;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
            background-color: var(--bg-color);
            color: var(--text-color);
        }
        
        .navbar {
            background-color: var(--card-color);
            height: 56px;
            display: flex;
            align-items: center;
            padding: 0 16px;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 100;
        }
        
        .navbar-logo {
            font-size: 24px;
            font-weight: bold;
            color: var(--primary-color);
            margin-right: 16px;
        }
        
        .profile-container {
            max-width: 1200px;
            margin: 56px auto 0;
            padding: 20px;
        }
        
        .cover-photo {
            height: 350px;
            background-color: #ddd;
            border-radius: 8px;
            overflow: hidden;
            position: relative;
            margin-bottom: 16px;
        }
        
        .cover-photo img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .profile-info {
            background-color: var(--card-color);
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 16px;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
        
        .profile-header {
            display: flex;
            align-items: center;
            margin-bottom: 16px;
        }
        
        .profile-avatar {
            width: 168px;
            height: 168px;
            border-radius: 50%;
            border: 4px solid var(--card-color);
            margin-top: -84px;
            background-color: #ddd;
            overflow: hidden;
        }
        
        .profile-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .profile-name {
            margin-left: 16px;
            flex-grow: 1;
        }
        
        .profile-name h1 {
            font-size: 32px;
            margin-bottom: 4px;
        }
        
        .profile-name p {
            color: var(--text-secondary);
            margin-bottom: 8px;
        }
        
        .profile-stats {
            display: flex;
            gap: 16px;
            margin-bottom: 16px;
        }
        
        .profile-stat {
            display: flex;
            align-items: center;
            gap: 4px;
            color: var(--text-secondary);
        }
        
        .profile-actions {
            display: flex;
            gap: 8px;
            margin-bottom: 16px;
        }
        
        .btn {
            padding: 8px 12px;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
            border: none;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        
        .btn-primary {
            background-color: var(--primary-color);
            color: white;
        }
        
        .btn-secondary {
            background-color: #e4e6eb;
            color: var(--text-color);
        }
        
        .profile-tabs {
            display: flex;
            border-bottom: 1px solid #ddd;
            margin-bottom: 16px;
        }
        
        .profile-tab {
            padding: 16px;
            font-weight: 600;
            color: var(--text-secondary);
            cursor: pointer;
            position: relative;
        }
        
        .profile-tab.active {
            color: var(--primary-color);
        }
        
        .profile-tab.active::after {
            content: '';
            position: absolute;
            bottom: -1px;
            left: 0;
            right: 0;
            height: 3px;
            background-color: var(--primary-color);
            border-radius: 3px 3px 0 0;
        }
        
        .profile-content {
            display: flex;
            gap: 16px;
        }
        
        .profile-left {
            flex: 1;
        }
        
        .profile-right {
            width: 360px;
        }
        
        .info-card {
            background-color: var(--card-color);
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 16px;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
        
        .info-card h2 {
            font-size: 20px;
            margin-bottom: 16px;
        }
        
        .info-item {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 12px;
        }
        
        .info-item i {
            color: var(--text-secondary);
            width: 20px;
            text-align: center;
        }
        
        .friends-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
        }
        
        .friend-item {
            aspect-ratio: 1;
            background-color: #ddd;
            border-radius: 8px;
            overflow: hidden;
        }
        
        .friend-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .post {
            background-color: var(--card-color);
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 16px;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
        
        .post-header {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
        }
        
        .post-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: #ddd;
            overflow: hidden;
            margin-right: 8px;
        }
        
        .post-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .post-user {
            flex-grow: 1;
        }
        
        .post-user h4 {
            font-size: 15px;
        }
        
        .post-user p {
            font-size: 13px;
            color: var(--text-secondary);
        }
        
        .post-content {
            margin-bottom: 12px;
        }
        
        .post-image {
            width: 100%;
            max-height: 500px;
            background-color: #ddd;
            border-radius: 8px;
            overflow: hidden;
            margin-bottom: 12px;
        }
        
        .post-image img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
        
        .post-actions {
            display: flex;
            border-top: 1px solid #ddd;
            border-bottom: 1px solid #ddd;
            padding: 8px 0;
            margin-bottom: 12px;
        }
        
        .post-action {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            padding: 8px;
            border-radius: 4px;
            cursor: pointer;
        }
        
        .post-action:hover {
            background-color: #f0f2f5;
        }
        
        .post-comments {
            margin-top: 12px;
        }
        
        .comment {
            display: flex;
            margin-bottom: 12px;
        }
        
        .comment-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background-color: #ddd;
            overflow: hidden;
            margin-right: 8px;
        }
        
        .comment-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .comment-content {
            flex-grow: 1;
            background-color: #f0f2f5;
            border-radius: 18px;
            padding: 8px 12px;
        }
        
        .comment-user {
            font-weight: 600;
            font-size: 13px;
        }
        
        .comment-text {
            font-size: 14px;
        }
        
        .comment-input {
            display: flex;
            margin-top: 12px;
        }
        
        .comment-input input {
            flex-grow: 1;
            border-radius: 18px;
            border: none;
            background-color: #f0f2f5;
            padding: 8px 12px;
            outline: none;
        }
        
        /* Modal styles */
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            align-items: center;
            justify-content: center;
        }
        
        .modal-content {
            background-color: white;
            border-radius: 8px;
            width: 500px;
            max-width: 90%;
            padding: 20px;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .modal-header h2 {
            font-size: 20px;
        }
        
        .modal-close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
        }
        
        .form-group {
            margin-bottom: 16px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
        }
        
        .form-group input, .form-group textarea, .form-group select {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 16px;
        }
        
        .form-group textarea {
            min-height: 100px;
            resize: vertical;
        }
        
        .form-actions {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 20px;
        }
        
        .btn-cancel {
            background-color: #e4e6eb;
            color: #050505;
        }
        
        .btn-save {
            background-color: var(--primary-color);
            color: white;
        }
        
        /* Password verification modal */
        .password-modal {
            display: none;
        }
    </style>
</head>
<body>
    <!-- Barre de Navigation --> 
    <nav class="navbar">
        <div class="navbar-logo">SocialConnect</div>
    </nav>
    
    <!-- Main Profile Container -->
    <div class="profile-container">
        <!-- Photo de couverture -->
        <div class="cover-photo">
            <img src="<?= $user['cover_photo'] ? htmlspecialchars($user['cover_photo']) : 'default-cover.jpg' ?>" alt="Cover photo">
        </div>
        
        <!-- Profile Info Section -->
        <div class="profile-info">
            <div class="profile-header">
                <div class="profile-avatar">
                    <img src="<?= $user['avatar'] ? htmlspecialchars($user['avatar']) : 'default-avatar.jpg' ?>" alt="Profile picture">
                </div>
                <div class="profile-name">
                    <h1><?= htmlspecialchars($user['firstname'] . ' ' . $user['lastname']) ?></h1>
                    <p><?= $friendCount ?> amis</p>
                    <div class="profile-stats">
                        <div class="profile-stat">
                            <i class="fas fa-globe"></i>
                            <span>Public</span>
                        </div>
                    </div>
                </div>
                <div class="profile-actions">
                    <?php if ($isOwnProfile): ?>
                        <button class="btn btn-secondary" id="editProfileBtn">
                            <i class="fas fa-pencil-alt"></i>
                            Modifier le profil
                        </button>
                    <?php else: ?>
                        <button class="btn btn-primary">
                            <i class="fas fa-user-plus"></i>
                            Ajouter comme ami
                        </button>
                        <button class="btn btn-secondary">
                            <i class="fas fa-comment"></i>
                            Envoyer un message
                        </button>
                    <?php endif; ?>
                </div>
            </div>
            
            <!-- Profile Tabs -->
            <div class="profile-tabs">
                <div class="profile-tab active">Publications</div>
                <div class="profile-tab">À propos</div>
                <div class="profile-tab">Amis</div>
                <div class="profile-tab">Photos</div>
                <div class="profile-tab">Vidéos</div>
                <div class="profile-tab">Vérifications</div>
                <div class="profile-tab">Plus</div>
            </div>
        </div>
        
        <!-- Profile Content -->
        <div class="profile-content">
            <!-- Left Column -->
            <div class="profile-left">
                <!-- About Card -->
                <div class="info-card">
                    <h2>Intro</h2>
                    <?php if ($user['bio']): ?>
                        <p><?= htmlspecialchars($user['bio']) ?></p>
                    <?php endif; ?>
                    
                    <?php if ($user['education']): ?>
                        <div class="info-item">
                            <i class="fas fa-graduation-cap"></i>
                            <span><?= htmlspecialchars($user['education']) ?></span>
                        </div>
                    <?php endif; ?>
                    
                    <?php if ($user['location']): ?>
                        <div class="info-item">
                            <i class="fas fa-home"></i>
                            <span><?= htmlspecialchars($user['location']) ?></span>
                        </div>
                    <?php endif; ?>
                    
                    <div class="info-item">
                        <i class="fas fa-calendar-alt"></i>
                        <span>A rejoint en <?= date('F Y', strtotime($user['created_at'])) ?></span>
                    </div>
                </div>
                
                <!-- Amis Card -->
                <div class="info-card">
                    <h2>Amis</h2>
                    <p><?= $friendCount ?> amis</p>
                    <div class="friends-grid">
                        <!-- Éléments d'amis d'exemple -->
                        <div class="friend-item">
                            <img src="default-avatar.jpg" alt="Friend">
                        </div>
                        <div class="friend-item">
                            <img src="default-avatar.jpg" alt="Friend">
                        </div>
                        <div class="friend-item">
                            <img src="default-avatar.jpg" alt="Friend">
                        </div>
                        <div class="friend-item">
                            <img src="default-avatar.jpg" alt="Friend">
                        </div>
                        <div class="friend-item">
                            <img src="default-avatar.jpg" alt="Friend">
                        </div>
                        <div class="friend-item">
                            <img src="default-avatar.jpg" alt="Friend">
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Right Column -->
            <div class="profile-right">
                <!-- Créer une carte de publication -->
                <?php if ($isOwnProfile): ?>
                    <div class="info-card">
                        <h3>Créer une publication</h3>
                        <div class="post-input">
                            <div class="post-avatar">
                                <img src="<?= $user['avatar'] ? htmlspecialchars($user['avatar']) : 'default-avatar.jpg' ?>" alt="Profile picture">
                            </div>
                            <input type="text" placeholder="À quoi pensez-vous ?" id="postContent">
                        </div>
                        <div class="post-options">
                            <button class="btn btn-secondary">
                                <i class="fas fa-images"></i> Photo/vidéo
                            </button>
                            <button class="btn btn-secondary">
                                <i class="fas fa-smile"></i> Humeur/activité
                            </button>
                            <button class="btn btn-primary" id="publishPostBtn">
                                Publier
                            </button>
                        </div>
                    </div>
                <?php endif; ?>
                
                <!-- Posts Section -->
                <?php foreach ($posts as $post): ?>
                    <div class="post">
                        <div class="post-header">
                            <div class="post-avatar">
                                <img src="<?= $user['avatar'] ? htmlspecialchars($user['avatar']) : 'default-avatar.jpg' ?>" alt="Profile picture">
                            </div>
                            <div class="post-user">
                                <h4><?= htmlspecialchars($user['firstname'] . ' ' . $user['lastname']) ?></h4>
                                <p><?= date('d/m/Y à H:i', strtotime($post['created_at'])) ?></p>
                            </div>
                        </div>
                        <div class="post-content">
                            <p><?= htmlspecialchars($post['content']) ?></p>
                        </div>
                        <?php if (!empty($post['image'])): ?>
                            <div class="post-image">
                                <img src="<?= htmlspecialchars($post['image']) ?>" alt="Post image">
                            </div>
                        <?php endif; ?>
                        <div class="post-actions">
                            <div class="post-action">
                                <i class="far fa-thumbs-up"></i>
                                <span>J'aime</span>
                            </div>
                            <div class="post-action">
                                <i class="far fa-comment"></i>
                                <span>Commenter</span>
                            </div>
                            <div class="post-action">
                                <i class="fas fa-share"></i>
                                <span>Partager</span>
                            </div>
                        </div>
                        <div class="post-comments">
                            <!-- Commentaire d'exemple - dans une vraie application vous récupéreriez les commentaires depuis la base de données -->
                            <div class="comment">
                                <div class="comment-avatar">
                                    <img src="default-avatar.jpg" alt="Commenter">
                                </div>
                                <div class="comment-content">
                                    <div class="comment-user">Marie Dubois</div>
                                    <div class="comment-text">Magnifique !</div>
                                </div>
                            </div>
                            <div class="comment-input">
                                <input type="text" placeholder="Écrire un commentaire...">
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
    
    <!-- Password Verification Modal -->
    <div class="modal password-modal" id="passwordModal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Confirmer votre mot de passe</h2>
                <button class="modal-close">&times;</button>
            </div>
            <form id="passwordForm">
                <input type="hidden" name="csrf_token" value="<?= $_SESSION['csrf_token'] ?>">
                <div class="form-group">
                    <label for="password">Entrez votre mot de passe pour continuer</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-cancel modal-close">Annuler</button>
                    <button type="submit" class="btn btn-save">Continuer</button>
                </div>
            </form>
        </div>
    </div>
    
    <!-- Edit Profile Modal -->
    <div class="modal" id="editProfileModal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Modifier le profil</h2>
                <button class="modal-close">&times;</button>
            </div>
            <form id="profileForm" enctype="multipart/form-data">
                <input type="hidden" name="csrf_token" value="<?= $_SESSION['csrf_token'] ?>">
                <div class="form-group">
                    <label>Photo de profil</label>
                    <input type="file" name="avatar" accept="image/*">
                </div>
                <div class="form-group">
                    <label>Photo de couverture</label>
                    <input type="file" name="cover_photo" accept="image/*">
                </div>
                <div class="form-group">
                    <label for="bio">Bio</label>
                    <textarea id="bio" name="bio"><?= htmlspecialchars($user['bio'] ?? '') ?></textarea>
                </div>
                <div class="form-group">
                    <label for="education">Éducation</label>
                    <input type="text" id="education" name="education" value="<?= htmlspecialchars($user['education'] ?? '') ?>">
                </div>
                <div class="form-group">
                    <label for="location">Localisation</label>
                    <input type="text" id="location" name="location" value="<?= htmlspecialchars($user['location'] ?? '') ?>">
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-cancel modal-close">Annuler</button>
                    <button type="submit" class="btn btn-save">Enregistrer</button>
                </div>
            </form>
        </div>
    </div>
    
    <script src="C:\xampp\htdocs\SocialConnect\vues\clients\profile.js">
       
    </script>

             <!-- Modals (à inclure en bas du fichier) -->
              <?php include __DIR__.'/../C:\xampp\htdocs\SocialConnect\api\config\Verify_password.php'; ?>
              <?php include __DIR__.'/../C:\xampp\htdocs\SocialConnect\api\config\Update_Profil.php'; ?>
               <?php include __DIR__.'/../C:\xampp\htdocs\SocialConnect\api\config\Gestion_profile.php'; ?>

</body>
</html>