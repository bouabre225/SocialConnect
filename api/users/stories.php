<?php
require_once 'common.php';
require '../config.php';



// Gérer la requête OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Vérification de la méthode HTTP
$method = $_SERVER['REQUEST_METHOD'];
if (!in_array($method, ['POST', 'GET'])) {
    jsonResponse(['status' => 'error', 'message' => 'Méthode non autorisée'], 405);
}

// Authentification de l'utilisateur
$user = authentificateToken(getallheaders());
if (!$user) {
    jsonResponse(['status' => 'error', 'message' => 'Authentification requise'], 401);
}

// Traitement des requêtes
if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
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
        error_log("Erreur lors de la création de la story: " . $e->getMessage());
        jsonResponse(['status' => 'error', 'message' => 'Erreur lors de la création de la story'], 500);
    }
} elseif ($method === 'GET') {
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
        jsonResponse(['status' => 'success', 'stories' => $stories], 200);
    } catch (Exception $e) {
        error_log("Erreur lors de la récupération des stories: " . $e->getMessage());
        jsonResponse(['status' => 'error', 'message' => 'Erreur lors de la récupération des stories'], 500);
    }
}

// Fonction pour envoyer une réponse JSON
function jsonResponse($data, $statusCode) {
    http_response_code($statusCode);
    echo json_encode($data);
    exit();
}
?>