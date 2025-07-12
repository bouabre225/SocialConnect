<?php

require_once '../../api/users/common.php';

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents('php://input'), true);

$user = authentificateToken();

if ($method !== 'PUT') {
    jsonResponse(['status' => 'error', 'message' => 'Méthode non autorisée'], 405);
}

// Récupérer l'ID du friend depuis l'URL via REQUEST_URI
if (!preg_match('/\/api\/users\/friends\/(\d+)$/', $_SERVER['REQUEST_URI'], $matches)) {
    jsonResponse(['status' => 'error', 'message' => 'friend_id invalide dans l\'URL'], 400);
}
$friend_id = $matches[1];
try {
    $stmt = $pdo->prepare('UPDATE friends SET status = ? WHERE user_id = ? AND friend_id = ?');
    $stmt->execute(['accepted', $user->user_id, $friend_id]);
    jsonResponse(['status' => 'success', 'message' => 'Demande d\'ami acceptée']);
} catch (Exception $e) {
    jsonResponse(['status' => 'error', 'message' => 'Erreur lors de l\'acceptation de la demande d\'ami'], 500);
}

?>
