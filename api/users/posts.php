<?php
require_once 'common.php';

$method = $_SERVER['REQUEST_METHOD'];
$user = authentificateToken(getallheaders());

if ($method === 'POST') {
    $user = authentificateToken(getallheaders());
    $data = json_decode(file_get_contents('php://input'), true);
    $content = $data['content'] ?? null;
    $location_name = $data['location_name'] ?? null;
    $latitude = $data['latitude'] ?? null;
    $longitude = $data['longitude'] ?? null;
    $media_url = null;
    $media_type = null;
    if (!empty($data['media'])) {
        $fileInfo = handFileUpload($data['media']);
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
            'INSERT INTO posts (user_id, content, media_url, media_type, location_name, latitude, longitude) 
            VALUES (?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([$user->user_id, $content, $media_url, $media_type, $location_name, $latitude, $longitude]);
        jsonResponse(['status' => 'success', 'message' => 'Post créé', 'id' => $pdo->lastInsertId()], 201);
    } catch (Exception $e) {
        jsonResponse(['status' => 'error', 'message' => 'Erreur lors de la création du post'], 500);
    }
} elseif ($method === 'GET') {
    $user = authentificateToken(getallheaders());
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