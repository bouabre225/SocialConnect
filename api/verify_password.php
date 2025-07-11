<?php
require_once 'config.php';

// Récupérer les données de la requête
$data = json_decode(file_get_contents('php://input'), true);
$password = $data['password'] ?? '';
$user_id = $data['user_id'] ?? 0; // En production, ce serait à partir de la session

if (empty($password) || $user_id <= 0) {
    jsonResponse(['success' => false, 'message' => 'Données manquantes'], 400);
}

try {
    // Récupérer le mot de passe hashé de l'utilisateur
    $stmt = $pdo->prepare("SELECT password FROM users WHERE id = ?");
    $stmt->execute([$user_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        jsonResponse(['success' => false, 'message' => 'Utilisateur non trouvé'], 404);
    }

    // Vérifier le mot de passe
    if (password_verify($password, $user['password'])) {
        jsonResponse(['success' => true]);
    } else {
        jsonResponse(['success' => false, 'message' => 'Mot de passe incorrect']);
    }

} catch (PDOException $e) {
    jsonResponse(['success' => false, 'message' => 'Erreur de base de données: ' . $e->getMessage()], 500);
}