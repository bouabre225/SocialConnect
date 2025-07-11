<?php
require_once 'config.php';

// Récupérer l'ID de l'utilisateur (en production, ce serait à partir de la session)
$user_id = 1; // ID de l'utilisateur connecté

try {
    // Récupérer les informations de base de l'utilisateur
    $stmt = $pdo->prepare("
        SELECT 
            u.*, 
            (SELECT COUNT(*) FROM posts WHERE user_id = u.id) AS post_count,
            (SELECT COUNT(*) FROM friends WHERE (user_id = u.id OR friend_id = u.id) AND status = 'accepted') AS friend_count,
            (SELECT COUNT(*) FROM posts WHERE user_id = u.id AND media_url IS NOT NULL) AS photo_count
        FROM users u 
        WHERE u.id = ?
    ");
    $stmt->execute([$user_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        jsonResponse(['success' => false, 'message' => 'Utilisateur non trouvé'], 404);
    }

    // Si on demande les publications
    if (isset($_GET['posts'])) {
        $stmt = $pdo->prepare("
            SELECT p.*, u.firstname, u.lastname 
            FROM posts p
            JOIN users u ON p.user_id = u.id
            WHERE p.user_id = ?
            ORDER BY p.created_at DESC
        ");
        $stmt->execute([$user_id]);
        $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        jsonResponse([
            'success' => true,
            'user' => $user,
            'posts' => $posts
        ]);
    }

    // Sinon, retourner seulement les infos du profil
    jsonResponse([
        'success' => true,
        'user' => $user
    ]);

} catch (PDOException $e) {
    jsonResponse(['success' => false, 'message' => 'Erreur de base de données: ' . $e->getMessage()], 500);
}