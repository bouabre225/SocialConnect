<?php
require_once '../../api/users/common.php';
require '../config.php';

define('API', 'http://localhost:8000');

// Configuration des en-têtes CORS
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: ' . API);
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-CSRF-Token');
header('Access-Control-Allow-Credentials: true');

// Gérer la requête OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents('php://input'), true);

$user = authentificateToken();

if ($method === 'POST') {
    $post_id = $data['post_id'] ?? null;
    $comment_id = $data['comment_id'] ?? null;
    
    try {
        $stmt = $pdo->prepare('SELECT * FROM likes WHERE user_id = ? AND (post_id = ? OR comment_id = ?)');
        $stmt->execute([$user->user_id, $post_id, $comment_id]);
        if ($stmt->fetch()) {
            jsonResponse(['status' => 'error', 'message' => 'Like déjà ajouté'], 400);
        }
        
        $stmt = $pdo->prepare('INSERT INTO likes (user_id, post_id, comment_id) VALUES (?, ?, ?)');
        $stmt->execute([$user->user_id, $post_id, $comment_id]);
        
        jsonResponse(['status' => 'success', 'message' => 'Like ajouté'], 201);
    } catch (Exception $e) {
        jsonResponse(['status' => 'error', 'message' => 'Erreur lors de l\'ajout du like'], 500);
    }
} elseif ($method === 'DELETE') {
    $post_id = $data['post_id'] ?? null;
    $comment_id = $data['comment_id'] ?? null;
    
    try {
        $stmt = $pdo->prepare('DELETE FROM likes WHERE user_id = ? AND (post_id = ? OR comment_id = ?)');
        $stmt->execute([$user->user_id, $post_id, $comment_id]);
        
        jsonResponse(['status' => 'success', 'message' => 'Like supprimé']);
    } catch (Exception $e) {
        jsonResponse(['status' => 'error', 'message' => 'Erreur lors de la suppression du like'], 500);
    }
} else {
    jsonResponse(['status' => 'error', 'message' => 'Méthode non autorisée'], 405);
}   