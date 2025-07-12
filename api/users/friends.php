<?php
require_once '../../api/users/common.php';

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents('php://input'), true);

$user = authentificateToken();

if ($method === 'POST') {
    $friend_id = $data['friend_id'] ?? null;
    
    try {
        $stmt = $pdo->prepare('INSERT INTO friends (user_id, friend_id, status) VALUES (?, ?, ?)');
        $stmt->execute([$user->user_id, $friend_id, 'pending']);
        jsonResponse(['status' => 'success', 'message' => 'Demande d\'ami envoyée'], 201);
    } catch (Exception $e) {
        jsonResponse(['status' => 'error', 'message' => 'Erreur lors de l\'envoi de la demande d\'ami'], 500);
    }
} elseif ($method === 'GET') {
    $user = authentificateToken();
    try {
        $stmt = $pdo->prepare('
            SELECT u.id, u.username, CONCAT(u.firstname, " ", u.lastname) AS full_name, u.avatar_url
            FROM users u
            JOIN friends f ON u.id = f.friend_id
            WHERE f.user_id = ? AND f.status = "accepted"
        ');
        $stmt->execute([$user->user_id]);
        $friends = $stmt->fetchAll(PDO::FETCH_ASSOC);
        jsonResponse(['status' => 'success', 'friends' => $friends]);
    } catch (Exception $e) {
        jsonResponse(['status' => 'error', 'message' => 'Erreur lors de la récupération des amis'], 500);
    }
} else {
    jsonResponse(['status' => 'error', 'message' => 'Méthode non autorisée'], 405);
}