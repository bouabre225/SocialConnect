<?php

require_once 'common.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['status' => 'error', 'message' => 'Méthode non autorisée'], 405);
}
$user = authentificateToken(getallheaders());
$userData = getUserById($user->user_id);

if ($userData) {
    jsonResponse(['status' => 'success', 'user' => $userData]);
} else {
    jsonResponse(['status' => 'error', 'message' => 'Utilisateur non trouvé'], 404);
}
?>