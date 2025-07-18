<?php
// verify_password.php
ob_start();
require_once '../api/users/common.php';
require_once '../api/config.php';

// Gérer la requête OPTIONS (pour CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
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
    if (!$user) {
        ob_clean();
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Utilisateur non trouvé']);
        exit;
    }

    if (password_verify($data['password'], $user['password'])) {
        ob_clean();
        echo json_encode(['status' => 'success', 'message' => 'Mot de passe correct']);
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