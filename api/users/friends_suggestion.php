<?php
require '../config.php';

require_once '../../api/users/common.php';


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

if ($method !== 'GET') {
    jsonResponse(['status' => 'error', 'message' => 'Méthode non autorisée'], 405);
}
try {
    $stmt = $pdo->prepare('
        SELECT u.id, u.username, CONCAT(u.firstname, " ", u.lastname) AS full_name, u.avatar_url,
            (SELECT COUNT(*) FROM friends f1 
                WHERE f1.user_id IN (
                    SELECT friend_id FROM friends WHERE user_id = ? AND status = "accepted"
                ) AND f1.friend_id = u.id AND f1.status = "accepted") AS mutual_friends
        FROM users u
        WHERE u.id != ? 
        AND u.id NOT IN (
            SELECT friend_id FROM friends WHERE user_id = ? AND status = "accepted"
        )
        AND u.id NOT IN (
            SELECT friend_id FROM friends WHERE user_id = ? AND status = "pending"
        )
        LIMIT 10
    ');
    $stmt->execute([$user->user_id, $user->user_id, $user->user_id, $user->user_id]);
    $suggestions = $stmt->fetchAll(PDO::FETCH_ASSOC);
    jsonResponse(['status' => 'success', 'suggestions' => $suggestions]);
} catch (Exception $e) {
    jsonResponse(['status' => 'error', 'message' => 'Erreur lors de la récupération des suggestions d\'ami'], 500);
}

?>
