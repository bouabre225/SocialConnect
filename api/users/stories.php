<?php
require_once 'common.php';

$method = $_SERVER['REQUEST_METHOD'];
$user = authentificateToken(getallheaders());


if ($method === 'POST') {
    $user = authentificateToken(getallheaders());
    $emoji_content = $data['emoji_content'] ?? null;
    $media_url = null;
    $media_type = 'emoji';
    if (!empty($data['media'])) {
        $fileInfo = handFileUpload($data['media']);
        $media_url = $fileInfo['url'];
        $media_type = strpos($fileInfo['type'], 'video') !== false ? 'video' : 'image';
    }
    $expires_at = date('Y-m-d H:i:s', strtotime('+24 hours'));
    try {
        $stmt = $pdo->prepare(
            'INSERT INTO stories (user_id, media_url, media_type, emoji_content, expires_at) 
            VALUES (?, ?, ?, ?, ?)'
        );
        $stmt->execute([$user->user_id, $media_url, $media_type, $emoji_content, $expires_at]);
        jsonResponse(['status' => 'success', 'message' => 'Story créée', 'id' => $pdo->lastInsertId()], 201);
    } catch (Exception $e) {
        jsonResponse(['status' => 'error', 'message' => 'Erreur lors de la création de la story'], 500);
    }
} elseif ($method === 'GET') {
    $user = authentificateToken(getallheaders());
    try {
        $stmt = $pdo->prepare('
            SELECT s.*, u.username, CONCAT(u.firstname, " ", u.lastname) AS full_name, u.avatar_url
            FROM stories s
            JOIN users u ON s.user_id = u.id
            WHERE s.expires_at > NOW()
            ORDER BY s.created_at DESC
            LIMIT 20
        ');
        $stmt->execute();
        $stories = $stmt->fetchAll(PDO::FETCH_ASSOC);
        jsonResponse(['status' => 'success', 'stories' => $stories]);
    } catch (Exception $e) {
        jsonResponse(['status' => 'error', 'message' => 'Erreur lors de la récupération des stories'], 500);
    }
}

?>