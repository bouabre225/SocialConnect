<?php
//posts_comments.php
require_once '../../api/users/common.php';
require '../config.php';

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents('php://input'), true);

$user = authentificateToken();

if ($method !== 'GET') {
    jsonResponse(['status' => 'error', 'message' => 'Méthode non autorisée'], 405);
}
try {
    $stmt = $pdo->prepare('
        SELECT c.*, u.username, CONCAT(u.firstname, " ", u.lastname) AS full_name, u.avatar_url
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.post_id = ?
        ORDER BY c.created_at ASC
    ');
    $stmt->execute([$data['post_id']]);
    $comments = $stmt->fetchAll(PDO::FETCH_ASSOC);
    jsonResponse(['status' => 'success', 'comments' => $comments]);
} catch (Exception $e) {
    jsonResponse(['status' => 'error', 'message' => 'Erreur lors de la récupération des commentaires'], 500);
}

?>