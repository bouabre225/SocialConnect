<?php

require_once '../../api/users/common.php';
require_once '../../api/cors.php';

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