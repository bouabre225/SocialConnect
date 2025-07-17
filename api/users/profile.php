<?php
// profile.php
ob_start();
require_once '../../api/users/common.php';
require_once '../config.php';

// Configuration des en-têtes CORS
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: http://localhost:8000');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-CSRF-Token');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Max-Age: 86400');
error_log("En-têtes CORS configurés pour profile.php");

// Gérer la requête OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    error_log("Requête OPTIONS reçue");
    http_response_code(200);
    ob_clean();
    exit();
}

try {
// Vérifier le token JWT
$decoded = authentificateToken();
$currentUserId = $decoded->data->user_id; // Supposons que l'ID utilisateur est dans le payload du JWT
$profileUserId = isset($_GET['id']) ? (int)$_GET['id'] : $currentUserId;



// Gérer les commentaires
if (isset($_GET['comment']) && $_GET['comment'] === 'true') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data || !isset($data['post_id']) || !isset($data['content'])) {
        ob_clean();
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Données manquantes']);
        exit;
    }

    $stmt = $pdo->prepare("INSERT INTO comments (post_id, user_id, content, created_at) VALUES (?, ?, ?, NOW())");
    $stmt->execute([$data['post_id'], $currentUserId, $data['content']]);

    ob_clean();
    echo json_encode(['status' => 'success', 'message' => 'Commentaire ajouté']);
    exit;
}

// Gérer les likes
if (isset($_GET['like']) && $_GET['like'] === 'true' && isset($_GET['post_id'])) {
    $postId = (int)$_GET['post_id'];
    $stmt = $pdo->prepare("INSERT INTO likes (post_id, user_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE created_at = NOW()");
    $stmt->execute([$postId, $currentUserId]);

    $stmt = $pdo->prepare("SELECT COUNT(*) FROM likes WHERE post_id = ?");
    $stmt->execute([$postId]);
    $likes = $stmt->fetchColumn();

    ob_clean();
    echo json_encode(['status' => 'success', 'likes' => $likes]);
    exit;
}

// Obtenir les données utilisateur
$user = getUserData($profileUserId, $pdo);
if (!$user) {
    ob_clean();
    http_response_code(404);
    echo json_encode(['status' => 'error', 'message' => 'Utilisateur non trouvé']);
    exit;
}

// Vérifier si c'est le profil de l'utilisateur connecté
$isOwnProfile = ($currentUserId === $profileUserId);

// Obtenir les publications de l'utilisateur
$stmt = $pdo->prepare("SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC");
$stmt->execute([$profileUserId]);
$posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Obtenir le nombre d'amis
$stmt = $pdo->prepare("SELECT COUNT(*) FROM friendships WHERE (user_id = ? OR friend_id = ?) AND status = 'accepted'");
$stmt->execute([$profileUserId, $profileUserId]);
$friendCount = $stmt->fetchColumn();

// Formater la réponse
$response = [
    'status' => 'success',
    'user' => $user,
    'isOwnProfile' => $isOwnProfile,
    'posts' => $posts,
    'friendCount' => $friendCount
];

ob_clean();
echo json_encode($response);
exit;
} catch (Exception $e) {
    ob_clean();
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Erreur lors de la récupération des données']);
    exit;
}
?>