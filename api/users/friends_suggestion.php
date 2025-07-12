<?php

require_once '../../api/users/common.php';

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
        LIMIT 10
    ');
    $stmt->execute([$user->user_id, $user->user_id, $user->user_id]);
    $suggestions = $stmt->fetchAll(PDO::FETCH_ASSOC);
    jsonResponse(['status' => 'success', 'suggestions' => $suggestions]);
} catch (Exception $e) {
    jsonResponse(['status' => 'error', 'message' => 'Erreur lors de la récupération des suggestions d\'ami'], 500);
}

?>
