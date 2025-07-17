<?php
// posts.php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

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
$user = authentificateToken();

if ($method === 'POST') {
    $content = $_POST['content'] ?? null;
    $location_name = $_POST['location_name'] ?? null;
    $latitude = $_POST['latitude'] ?? null;
    $longitude = $_POST['longitude'] ?? null;
    $emoji_content = $_POST['emoji_content'] ?? null; // Ajout pour gérer emoji_content
    $media_url = null;
    $media_type = null;

    if (!empty($_FILES['media'])) {
        $fileInfo = handFileUpload($_FILES['media']);
        $media_url = $fileInfo['url'];
        $media_type = strpos($fileInfo['type'], 'video') !== false ? 'video' : 'image';
    }

    $errors = [];
    if (empty($content) && empty($media_url) && empty($emoji_content)) {
        $errors[] = 'Contenu ou média requis';
    }

    if (!empty($errors)) {
        jsonResponse(['status' => 'error', 'errors' => $errors], 400);
    }

    try {
        $stmt = $pdo->prepare(
            'INSERT INTO posts (user_id, content, media_url, media_type, location_name, latitude, longitude, emoji_content) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([$user->user_id, $content, $media_url, $media_type, $location_name, $latitude, $longitude, $emoji_content]);
        jsonResponse(['status' => 'success', 'message' => 'Post créé', 'id' => $pdo->lastInsertId()], 201);
    } catch (Exception $e) {
        jsonResponse(['status' => 'error', 'message' => 'Erreur lors de la création du post: ' . $e->getMessage()], 500);
    }
} elseif ($method === 'GET') {
    try {
        $stmt = $pdo->prepare('
            SELECT p.*, u.username, CONCAT(u.firstname, " ", u.lastname) AS full_name, u.avatar_url,
                (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS likes_count,
                (SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS comments_count
            FROM posts p
            JOIN users u ON p.user_id = u.id
            ORDER BY p.created_at DESC
            LIMIT 20
        ');
        $stmt->execute();
        $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);
        jsonResponse(['status' => 'success', 'posts' => $posts]);
    } catch (Exception $e) {
        jsonResponse(['status' => 'error', 'message' => 'Erreur lors de la récupération des posts'], 500);
    }
}
?>