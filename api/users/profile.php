<?php
// profile.php
ob_start();
require_once '../../api/users/common.php';
require_once '../config.php';

// Définir l'URL de l'API pour correspondre au port utilisé par le frontend
define('API', 'http://localhost:8000');

// Configuration des en-têtes CORS
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: ' . API);
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-CSRF-Token');
header('Access-Control-Allow-Credentials: true');

// Gérer la requête OPTIONS (pour CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    // Vérifier la connexion PDO
    if (!$pdo) {
        error_log("Erreur: \$pdo est null dans profile.php");
        jsonResponse(['status' => 'error', 'message' => 'Erreur de connexion à la base de données'], 500);
    }

    // Vérifier le token JWT
    $user = authentificateToken();
    if (!$user || !isset($user->user_id)) {
        error_log("Erreur: Token invalide ou user_id manquant dans profile.php");
        jsonResponse(['status' => 'error', 'message' => 'Token invalide ou utilisateur non authentifié'], 401);
    }

    // Gérer les commentaires
    if (isset($_GET['comment']) && $_GET['comment'] === 'true') {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data || !isset($data['post_id']) || !isset($data['content'])) {
            ob_clean();
            jsonResponse(['status' => 'error', 'message' => 'Données manquantes'], 400);
        }

        $stmt = $pdo->prepare("INSERT INTO comments (post_id, user_id, content, created_at) VALUES (?, ?, ?, NOW())");
        $stmt->execute([$data['post_id'], $user->user_id, $data['content']]);

        ob_clean();
        jsonResponse(['status' => 'success', 'message' => 'Commentaire ajouté'], 200);
    }

    // Gérer les likes
    if (isset($_GET['like']) && $_GET['like'] === 'true' && isset($_GET['post_id'])) {
        $postId = (int)$_GET['post_id'];
        $stmt = $pdo->prepare("INSERT INTO likes (post_id, user_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE created_at = NOW()");
        $stmt->execute([$postId, $user->user_id]);

        $stmt = $pdo->prepare("SELECT COUNT(*) FROM likes WHERE post_id = ?");
        $stmt->execute([$postId]);
        $likes = $stmt->fetchColumn();

        ob_clean();
        jsonResponse(['status' => 'success', 'likes' => $likes], 200);
    }

    // Récouvrir les données de l'utilisateur avec la fonction de common.php
    $userData = getUserData($user->user_id, $pdo);
    if (!$userData) {
        ob_clean();
        jsonResponse(['status' => 'error', 'message' => 'Utilisateur non trouvé'], 404);
    }

    // Vérifier si c'est le profil de l'utilisateur connecté
    $isOwnProfile = true; // Toujours true pour profile.php (profil de l'utilisateur connecté)

    // Obtenir les publications de l'utilisateur
    $stmt = $pdo->prepare("SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC");
    $stmt->execute([$user->user_id]);
    $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Obtenir le nombre d'amis
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM friends WHERE (user_id = ? OR friend_id = ?) AND status = 'accepted'");
    $stmt->execute([$user->user_id, $user->user_id]);
    $friendCount = $stmt->fetchColumn();

    // Formater la réponse
    $response = [
        'status' => 'success',
        'user' => $userData,
        'isOwnProfile' => $isOwnProfile,
        'posts' => $posts,
        'friendCount' => $friendCount
    ];

    ob_clean();
    jsonResponse($response, 200);

} catch (Exception $e) {
    error_log("Exception dans profile.php: " . $e->getMessage() . " à la ligne " . $e->getLine());
    ob_clean();
    jsonResponse(['status' => 'error', 'message' => 'Erreur lors de la récupération des données: ' . $e->getMessage()], 500);
}

/**
 * Fonction utilitaire pour envoyer une réponse JSON
 * @param array $data Données à envoyer
 * @param int $statusCode Code HTTP
 */
function jsonResponse($data, $statusCode) {
    http_response_code($statusCode);
    echo json_encode($data);
    exit;
}
?>