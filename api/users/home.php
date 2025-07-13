<?php

require_once '../../api/users/common.php';
//require_once '../../api/cors.php';
define('API', 'http://localhost:8000');

// Autoriser toutes les origines (en dev uniquement)
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: " . API);
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Authorization, Content-Type");
header("Access-Control-Allow-Credentials: true");



if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['status' => 'error', 'message' => 'Méthode non autorisée'], 405);
}
$user = authentificateToken();
$userData = getUserById($user->user_id);

if ($userData) {
    jsonResponse(['status' => 'success', 'user' => $userData]);
} else {
    jsonResponse(['status' => 'error', 'message' => 'Utilisateur non trouvé'], 404);
}
?>