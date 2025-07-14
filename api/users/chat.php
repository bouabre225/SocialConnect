<?php
require_once '../config.php';
require_once '../../vendor/autoload.php'; // Composer pour JWT
require_once '../../api/users/common.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// CORS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin:' . API);
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Credentials: true');
    http_response_code(200);
    exit();
}

header('Content-Type: application/json');
header('Access-Control-Allow-Origin:' . API);
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

$secretKey = 'JWT_SECRET_KEY'; // À stocker dans .env

// Gestion des routes
$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

switch ($uri) {
    case '/chat/conversations':
        if ($method !== 'GET') {
            jsonResponse(['status' => 'error', 'message' => 'Méthode non autorisée'], 405);
        }
        $user = authentificateToken();
        try {
            $stmt = $pdo->prepare('SELECT c.id, c.name, c.type,
                    (SELECT GROUP_CONCAT(u.username) 
                    FROM conversation_participants cp 
                    JOIN users u ON cp.user_id = u.id 
                    WHERE cp.conversation_id = c.id AND cp.user_id != ?) as participants
                FROM conversations c
                JOIN conversation_participants cp ON c.id = cp.conversation_id
                WHERE cp.user_id = ?
            ');
            $stmt->execute([$user->user_id, $user->user_id]);
            $conversations = $stmt->fetchAll(PDO::FETCH_ASSOC);
            jsonResponse(['status' => 'success', 'conversations' => $conversations]);
        } catch (Exception $e) {
            jsonResponse(['status' => 'error', 'message' => 'Erreur lors de la récupération des conversations'], 500);
        }
        break;

    case '/chat/messages':
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
        break;

    case '/chat/message':
        if ($method !== 'POST') {
            jsonResponse(['status' => 'error', 'message' => 'Méthode non autorisée'], 405);
        }
        $user = authentificateToken();
        $data = json_decode(file_get_contents('php://input'), true);
        $conversation_id = $data['conversation_id'] ?? null;
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
        break;

    default:
        jsonResponse(['status' => 'error', 'message' => 'Route non trouvée'], 404);
}

?>