<?php
// Activation d'un compte   
header('Content-Type: application/json');
require_once 'config.php';

// Vérifie si le token est fourni
if (!isset($_GET['token'])) {
    jsonResponse(['status' => 'error', 'message' => 'Token d\'activation manquant'], 400);
}

$token = $_GET['token'];

try {
    // Cherche l'utilisateur avec ce token
    $stmt = $pdo->prepare("SELECT id FROM users WHERE activation_token = ? AND status = 'pending'");
    $stmt->execute([$token]);

    if ($stmt->rowCount() !== 1) {
        jsonResponse(['status' => 'error', 'message' => 'Token invalide ou compte déjà activé'], 400);
    }

    // Active le compte
    $update = $pdo->prepare("UPDATE users SET status = 'active', activation_token = NULL WHERE activation_token = ?");
    $update->execute([$token]);

    header('Location: ../index.html?activated=1');
    exit;
    
} catch (Exception $e) {
    jsonResponse(['status' => 'error', 'message' => 'Erreur serveur'], 500);
}
?>
