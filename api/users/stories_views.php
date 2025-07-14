<?php
require_once 'common.php';
require '../config.php';

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents('php://input'), true);

$user = authentificateToken(getallheaders());
$story_id = $data['story_id'];

if ($method !== 'POST') {
    jsonResponse(['status' => 'error', 'message' => 'Méthode non autorisée'], 405);
}
try {
    $stmt = $pdo->prepare('INSERT INTO story_views (story_id, user_id) VALUES (?, ?)');
    $stmt->execute([$story_id, $user->user_id]);
    jsonResponse(['status' => 'success', 'message' => 'Vue enregistrée'], 201);
} catch (Exception $e) {
    jsonResponse(['status' => 'error', 'message' => 'Erreur lors de l\'enregistrement de la vue'], 500);
}

?>
