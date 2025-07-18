<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require '../config.php';
require_once '../../api/users/common.php';

// Gérer la requête OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    error_log("Requête OPTIONS reçue");
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $user = authentificateToken();
        $stmt = $pdo->prepare('SELECT id, username FROM users WHERE id != ? AND status = "active"');
        $stmt->execute([$user->user_id]);
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        jsonResponse(['status' => 'success', 'users' => $users]);
    } catch (Exception $e) {
        error_log("Erreur lors de la récupération des utilisateurs: " . $e->getMessage());
        jsonResponse(['status' => 'error', 'message' => 'Erreur lors de la récupération des utilisateurs'], 500);
    }
} else {
    jsonResponse(['status' => 'error', 'message' => 'Méthode non autorisée'], 405);
}

function jsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data);
    error_log("Réponse envoyée: " . json_encode($data));
    exit();
}
?>