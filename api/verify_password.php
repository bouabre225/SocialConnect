<?php
// verify_password.php
ob_start();
require_once '../../api/users/common.php';
require_once '../config.php';

// Configuration des en-têtes CORS
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: http://localhost:8000');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-CSRF-Token');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Max-Age: 86400');
error_log("En-têtes CORS configurés pour verify_password.php");

// Gérer la requête OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    error_log("Requête OPTIONS reçue");
    http_response_code(200);
    ob_clean();
    exit();
}

try {
    // Vérifier le token JWT
    $decoded = authentificateToken();
    $userId = $decoded->data->user_id;

    $data = json_decode(file_get_contents('php://input'), true);
    if (!isset($data['password'])) {
        ob_clean();
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Mot de passe requis']);
        exit;
    }

    $stmt = $pdo->prepare("SELECT password FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (password_verify($data['password'], $user['password'])) {
        ob_clean();
        echo json_encode(['status' => 'success', 'message' => 'Mot de passe valide']);
    } else {
        ob_clean();
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Mot de passe incorrect']);
    }
} catch (Exception $e) {
    ob_clean();
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>