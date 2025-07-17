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

try{
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
} catch (Exception $e) {
    jsonResponse(['status' => 'error', 'message' => 'Erreur lors de la récupération des conversations'], 500);
}

?>