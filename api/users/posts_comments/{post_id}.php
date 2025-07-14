<?php
// posts_comments/{post_id}.php

// Activer le débogage PHP
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once '../../api/users/common.php';
require '../../config.php';

// Configuration des en-têtes CORS
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: http://localhost:8000'); // Domaine frontend autorisé
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-CSRF-Token');
header('Access-Control-Allow-Credentials: true');
header('Vary: Origin'); // Important pour éviter des problèmes de cache CORS
error_log("En-têtes CORS configurés pour /posts_comments/{post_id}.php");

// Gérer la requête OPTIONS (preflight CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    error_log("Requête OPTIONS reçue pour /posts_comments/{post_id}.php");
    http_response_code(200);
    exit();
}

// Extraire post_id depuis l'URL
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$pathParts = explode('/', rtrim($path, '/'));
$post_id = end($pathParts);
$post_id = str_replace('.php', '', $post_id);

// Vérification de validité de post_id
if (!is_numeric($post_id)) {
    error_log("Erreur: post_id invalide ($post_id)");
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'ID du post invalide']);
    exit();
}

try {
    // Authentifier le token
    $decoded = authentificateToken();

    if (!$decoded) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Token invalide']);
        exit();
    }

    // Vérifier connexion base de données
    global $pdo;
    if (!$pdo) {
        error_log("Erreur: \$pdo est null");
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Erreur de connexion à la base de données']);
        exit();
    }

    // Traiter la requête GET pour récupérer les commentaires du post
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $stmt = $pdo->prepare('
            SELECT c.id, c.content, c.created_at, u.id AS user_id,
                CONCAT(u.firstname, " ", u.lastname) AS full_name, u.avatar_url
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.post_id = ?
            ORDER BY c.created_at DESC
        ');
        $stmt->execute([$post_id]);
        $comments = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Adapter les URLs des avatars
        foreach ($comments as &$comment) {
            if ($comment['avatar_url']) {
                $comment['avatar_url'] = 'http://localhost:8000/uploads/' . basename($comment['avatar_url']);
            }
        }

        echo json_encode(['status' => 'success', 'comments' => $comments]);

    } else {
        // Méthode non autorisée
        http_response_code(405);
        echo json_encode(['status' => 'error', 'message' => 'Méthode non autorisée']);
    }

} catch (Exception $e) {
    // Gestion des exceptions serveur
    error_log("Erreur dans posts_comments/{post_id}.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Erreur serveur']);
}
?>
