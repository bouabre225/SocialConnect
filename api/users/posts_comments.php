<?php
//posts_comments.php
require_once '../../api/users/common.php';
require '../config.php';

// Activer le débogage PHP
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


// Gérer la requête OPTIONS (preflight CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    error_log("Requête OPTIONS reçue pour /posts_comments.php");
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
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Récupérer post_id depuis les paramètres de requête
        $post_id = isset($_GET['post_id']) ? (int)$_GET['post_id'] : null;
        if (!$post_id || $post_id <= 0) {
            error_log("Erreur: post_id invalide ou manquant dans /posts_comments.php");
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'ID du post invalide ou manquant']);
            exit();
        }
        // Vérifier si le post existe
        $stmt = $pdo->prepare('SELECT id FROM posts WHERE id = ?');
        $stmt->execute([$post_id]);
        if (!$stmt->fetch()) {
            error_log("Erreur: post_id $post_id non trouvé dans la table posts");
            jsonResponse(['status' => 'error', 'message' => 'Post non trouvé'], 404);
        }
    
        $stmt = $pdo->prepare('
            SELECT c.*, u.username, CONCAT(u.firstname, " ", u.lastname) AS full_name, u.avatar_url
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.post_id = ?
            ORDER BY c.created_at DESC
        ');
        $stmt->execute([$post_id]);
        $comments = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Adapter les URLs des avatars pour l'environnement de production
        $base_url = 'https://socialconnect-94gz.onrender.com/uploads/';
        foreach ($comments as &$comment) {
            if ($comment['avatar_url']) {
                $comment['avatar_url'] = $base_url . basename($comment['avatar_url']);
            } else {
                $comment['avatar_url'] = null; // Ou une URL par défaut
            }
        }

        jsonResponse(['status' => 'success', 'comments' => $comments]);
    } else {
        jsonResponse(['status' => 'error', 'message' => 'Méthode non autorisée'], 405);
    }
} catch (Exception $e) {
    error_log("Erreur serveur dans /posts_comments.php: " . $e->getMessage());
    jsonResponse(['status' => 'error', 'message' => 'Erreur serveur: ' . $e->getMessage()], 500);
}

function jsonResponse($data, $status = 200) {
    header('Content-Type: application/json');
    http_response_code($status);
    echo json_encode($data);
    exit;
}

?>