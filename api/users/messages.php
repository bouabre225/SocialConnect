<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require '../config.php';
require_once '../../api/users/common.php';

define('API', 'http://localhost:8000');
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: http://localhost:8000');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-CSRF-Token');
header('Access-Control-Allow-Credentials: true');
error_log("En-têtes CORS configurés");

// Gérer la requête OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    error_log("Requête OPTIONS reçue");
    http_response_code(200);
    exit();
}


$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents('php://input'), true);

$user = authentificateToken();

try{
    if ($method !== 'GET') {
        jsonResponse(['status' => 'error', 'message' => 'Méthode non autorisée'], 405);
    }
    $user = authentificateToken();
    $conversation_id = $_GET['conversation_id'] ?? null;
    if (!$conversation_id) {
        jsonResponse(['status' => 'error', 'message' => 'ID de conversation requis'], 400);
    }
    try {
        $stmt = $pdo->prepare('
            SELECT m.id, m.content, m.media_url, m.media_type, m.created_at, 
                u.username, u.avatar_url,
                (SELECT status FROM message_status ms WHERE ms.message_id = m.id AND ms.user_id = ?) as status
            FROM messages m
            JOIN users u ON m.sender_id = u.id
            WHERE m.conversation_id = ?
            ORDER BY m.created_at ASC
            LIMIT 50
        ');
        $stmt->execute([$user->user_id, $conversation_id]);
        $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);
        jsonResponse(['status' => 'success', 'messages' => $messages]);
    } catch (Exception $e) {
        jsonResponse(['status' => 'error', 'message' => 'Erreur lors de la récupération des messages'], 500);
    } 
} catch (Exception $e) {
    jsonResponse(['status' => 'error', 'message' => 'Erreur lors de la récupération des messages'], 500);
}

try{
    $content = $data['content'] ?? null;
    if (!$conversation_id || !$content) {
        jsonResponse(['status' => 'error', 'message' => 'Conversation ID et contenu requis'], 400);
    }
    try {
        // Vérifier si l'utilisateur est dans la conversation
        $stmt = $pdo->prepare('SELECT 1 FROM conversation_participants WHERE conversation_id = ? AND user_id = ?');
        $stmt->execute([$conversation_id, $user->user_id]);
        if (!$stmt->fetch()) {
            jsonResponse(['status' => 'error', 'message' => 'Utilisateur non autorisé dans cette conversation'], 403);
        }
        // Insérer le message
        $stmt = $pdo->prepare('INSERT INTO messages (conversation_id, sender_id, content, media_type) VALUES (?, ?, ?, ?)');
        $stmt->execute([$conversation_id, $user->user_id, $content, 'text']);
        $message_id = $pdo->lastInsertId();
        // Mettre à jour le statut pour l'expéditeur
        $stmt = $pdo->prepare('INSERT INTO message_status (message_id, user_id, status) VALUES (?, ?, ?)');
        $stmt->execute([$message_id, $user->user_id, 'sent']);
        jsonResponse(['status' => 'success', 'message_id' => $message_id], 201);
    } catch (Exception $e) {
        jsonResponse(['status' => 'error', 'message' => 'Erreur lors de l\'envoi du message'], 500);
    } 
} catch (Exception $e) {
    jsonResponse(['status' => 'error', 'message' => 'Erreur lors de l\'envoi du message'], 500);
}

?>  



