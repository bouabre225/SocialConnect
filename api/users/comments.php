<?php
require_once '../../api/users/common.php';
require '../config.php';

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents('php://input'), true);

$user = authentificateToken();

if ($method === 'POST') {
    $post_id = $data['post_id'] ?? null;
    $content = $data['content'] ?? null;
    $errors = [];
    if (empty($post_id) || empty($content)) {
        $errors[] = 'Post ID et contenu requis';
    }
    if (!empty($errors)) {
        jsonResponse(['status' => 'error', 'errors' => $errors], 400);
    }
    try {
        $stmt = $pdo->prepare('INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)');
        $stmt->execute([$post_id, $user->user_id, $content]);
        jsonResponse(['status' => 'success', 'message' => 'Commentaire ajouté', 'id' => $pdo->lastInsertId()], 201);
    } catch (Exception $e) {
        jsonResponse(['status' => 'error', 'message' => 'Erreur lors de l\'ajout du commentaire'], 500);
    }
} elseif ($method === 'GET') {
    $post_id = $data['post_id'] ?? null;
    try {
        $stmt = $pdo->prepare('SELECT c.*, u.username, CONCAT(u.firstname, " ", u.lastname) AS full_name, u.avatar_url FROM comments c JOIN users u ON c.user_id = u.id WHERE c.post_id = ? ORDER BY c.created_at ASC');
        $stmt->execute([$post_id]);
        $comments = $stmt->fetchAll(PDO::FETCH_ASSOC);
        jsonResponse(['status' => 'success', 'comments' => $comments]);
    } catch (Exception $e) {
        jsonResponse(['status' => 'error', 'message' => 'Erreur lors de la récupération des commentaires'], 500);
    }
}
