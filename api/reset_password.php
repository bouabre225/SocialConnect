<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Méthode non autorisée.']);
    exit;
}

if (!isset($_GET['token'])) {
    echo json_encode(['status' => 'error', 'message' => 'Token manquant.']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['password'])) {
    echo json_encode(['status' => 'error', 'message' => 'Mot de passe requis.']);
    exit;
}

$token = $_GET['token'];
$password = $data['password'];

if (strlen($password) < 8) {
    echo json_encode(['status' => 'error', 'message' => 'Le mot de passe doit contenir au moins 8 caractères.']);
    exit;
}

// Vérifie si le token est valide et pas expiré
$stmt = $pdo->prepare("SELECT id FROM users WHERE reset_token = ? AND reset_token_expire > NOW()");
$stmt->execute([$token]);

if ($stmt->rowCount() !== 1) {
    echo json_encode(['status' => 'error', 'message' => 'Token invalide ou expiré.']);
    exit;
}

$user = $stmt->fetch();

// Hash et met à jour le mot de passe
$newPassword = password_hash($password, PASSWORD_DEFAULT);
$update = $pdo->prepare("UPDATE users SET password = ?, reset_token = NULL, reset_token_expire = NULL WHERE id = ?");
$update->execute([$newPassword, $user['id']]);

echo json_encode(['status' => 'success', 'message' => 'Votre mot de passe a été réinitialisé avec succès.']);

//header('Location: http://localhost/ReseauSocial/index.html');
//exit();
