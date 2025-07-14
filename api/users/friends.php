<?php

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
$data = json_decode(file_get_contents('php://input'), true);

$user = authentificateToken();

try {
    $user = authentificateToken();
    if (!$user || !isset($user->user_id)) {
        error_log("Erreur: Token invalide ou user_id manquant dans /friends.php");
        jsonResponse(['status' => 'error', 'message' => 'Token invalide ou utilisateur non authentifié'], 401);
    }

    $method = $_SERVER['REQUEST_METHOD'];
    $data = json_decode(file_get_contents('php://input'), true);

    if ($method === 'POST') {
        $friend_id = isset($data['friend_id']) ? (int)$data['friend_id'] : null;
        if (!$friend_id || $friend_id == $user->user_id) {
            error_log("Erreur: friend_id invalide ($friend_id) ou identique à user_id ($user->user_id)");
            jsonResponse(['status' => 'error', 'message' => 'ID d\'ami invalide ou identique à l\'utilisateur'], 400);
        }

        global $pdo;
        if (!$pdo) {
            error_log("Erreur: \$pdo est null dans /friends.php");
            jsonResponse(['status' => 'error', 'message' => 'Erreur de connexion à la base de données'], 500);
        }

        // Vérifier si la relation existe déjà
        $stmt = $pdo->prepare('SELECT * FROM friends WHERE user_id = ? AND friend_id = ?');
        $stmt->execute([$user->user_id, $friend_id]);
        if ($stmt->fetch()) {
            error_log("Erreur: Demande d'ami déjà existante pour user_id=$user->user_id, friend_id=$friend_id");
            jsonResponse(['status' => 'error', 'message' => 'Demande d\'ami déjà existante'], 400);
        }

        // Insérer la demande d'ami
        $stmt = $pdo->prepare('INSERT INTO friends (user_id, friend_id, status, created_at) VALUES (?, ?, ?, NOW())');
        $stmt->execute([$user->user_id, $friend_id, 'pending']);
        error_log("Demande d'ami ajoutée: user_id=$user->user_id, friend_id=$friend_id");
        jsonResponse(['status' => 'success', 'message' => 'Demande d\'ami envoyée'], 201);
    } elseif ($method === 'GET') {
        global $pdo;
        if (!$pdo) {
            error_log("Erreur: \$pdo est null dans /friends.php");
            jsonResponse(['status' => 'error', 'message' => 'Erreur de connexion à la base de données'], 500);
        }

        $stmt = $pdo->prepare('
            SELECT u.id, u.username, CONCAT(u.firstname, " ", u.lastname) AS full_name, u.avatar_url
            FROM users u
            JOIN friends f ON u.id = f.friend_id
            WHERE f.user_id = ? AND f.status = "accepted"
        ');
        $stmt->execute([$user->user_id]);
        $friends = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($friends as &$friend) {
            if ($friend['avatar_url']) {
                $friend['avatar_url'] = API . '/uploads/' . basename($friend['avatar_url']);
            }
        }
        jsonResponse(['status' => 'success', 'friends' => $friends]);
    } elseif ($method === 'DELETE') {
        $friend_id = isset($data['friend_id']) ? (int)$data['friend_id'] : null;
        if (!$friend_id || $friend_id == $user->user_id) {
            error_log("Erreur: friend_id invalide ($friend_id) ou identique à user_id ($user->user_id)");
            jsonResponse(['status' => 'error', 'message' => 'ID d\'ami invalide ou identique à l\'utilisateur'], 400);
        }

        global $pdo;
        if (!$pdo) {
            error_log("Erreur: \$pdo est null dans /friends.php");
            jsonResponse(['status' => 'error', 'message' => 'Erreur de connexion à la base de données'], 500);
        }

        $stmt = $pdo->prepare('DELETE FROM friends WHERE user_id = ? AND friend_id = ?');
        $stmt->execute([$user->user_id, $friend_id]);
        error_log("Demande d'ami supprimée: user_id=$user->user_id, friend_id=$friend_id");
        jsonResponse(['status' => 'success', 'message' => 'Demande d\'ami supprimée'], 200);
    } else {
        error_log("Erreur: Méthode non autorisée ($method)");
        jsonResponse(['status' => 'error', 'message' => 'Méthode non autorisée'], 405);
    }
} catch (Exception $e) {
    error_log("Erreur dans /friends.php: " . $e->getMessage());
    jsonResponse(['status' => 'error', 'message' => 'Erreur serveur: ' . $e->getMessage()], 500);
}

?>