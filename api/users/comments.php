<?php
require_once '../../api/users/common.php';
require '../config.php';

// Activer le débogage
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


// Configuration des en-têtes CORS
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: http://localhost:8000');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-CSRF-Token');
header('Access-Control-Allow-Credentials: true');
header('Vary: Origin');
error_log("En-têtes CORS configurés pour /posts_comments.php");

// Gérer la requête OPTIONS (preflight CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    error_log("Requête OPTIONS reçue pour /posts_comments.php");
    http_response_code(200);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents('php://input'), true);

$user = authentificateToken();

if ($method === 'POST') {
    $post_id = $data['post_id'] ? (int)$data['post_id'] : null;
    $content = $data['content'] ? trim($data['content']) : null;
    $errors = [];
    if (empty($post_id) || empty($content)) {
        $errors[] = 'Post ID et contenu requis';
    }
    if (!empty($errors)) {
        jsonResponse(['status' => 'error', 'errors' => $errors], 400);
    }
    try {
        $stmt = $pdo->prepare('INSERT INTO comments (post_id, user_id, content, created_at) VALUES (?, ?, ?, NOW())');
        $stmt->execute([$post_id, $user->user_id, $content]);
        jsonResponse(['status' => 'success', 'message' => 'Commentaire ajouté', 'id' => $pdo->lastInsertId()], 201);
    } catch (Exception $e) {
        jsonResponse(['status' => 'error', 'message' => 'Erreur lors de l\'ajout du commentaire'], 500);
    }
} elseif ($method === 'GET') {
    $post_id = $data['post_id'] ? (int)$data['post_id'] : null;
    try {
        $stmt = $pdo->prepare('SELECT c.*, u.username, CONCAT(u.firstname, " ", u.lastname) AS full_name, u.avatar_url FROM comments c JOIN users u ON c.user_id = u.id WHERE c.post_id = ? ORDER BY c.created_at DESC');
        $stmt->execute([$post_id]);
        $comments = $stmt->fetchAll(PDO::FETCH_ASSOC);
        jsonResponse(['status' => 'success', 'comments' => $comments]);
    } catch (Exception $e) {
        jsonResponse(['status' => 'error', 'message' => 'Erreur lors de la récupération des commentaires'], 500);
    }
}

?>
