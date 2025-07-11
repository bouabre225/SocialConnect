<?php
//congig
require '../../api/config.php';

// Inclure le chargeur automatique de Composer pour JWT
require_once '../../vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
//use \Exception;

//inclusion des headers
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    // Configuration des headers
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-CSRF-Token');
    header('Access-Control-Allow-Credentials: true');
    http_response_code(200);
    exit();
}

// Configuration des headers pour toutes les requêtes
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-CSRF-Token');
header('Access-Control-Allow-Credentials: true');

// Clé secrète pour JWT
$secretKey = 'JWT_SECRET_KEY';

// Fonction pour vérifier le token JWT
function authentificateToken($headers){
    global $secretKey;
    if (!isset($headers['Authorization'])) {
        jsonResponse(['status' => 'error', 'message' => 'Aucun token fourni'], 401);
    }
    $token = str_replace('Bearer ', '', $headers['Authorization']);
    try {
        $decoded = JWT::decode($token, new Key($secretKey, 'HS256'));
        return $decoded;
    } catch (Exception $e) {
        jsonResponse(['status' => 'error', 'message' => 'Token invalide'], 401);
    }
}

// Fonction pour gérer les uploads de fichiers
function handFileUpload($file, $uploadDir = './uploads/'){
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    // Vérifie et crée le .htaccess si nécessaire
    $htaccessPath = $uploadDir . '.htaccess';
    if (!file_exists($htaccessPath)) {
        $htaccessContent = "php_flag engine off\n";
        $htaccessContent .= "RemoveHandler .php .phtml .php3 .php4 .php5 .php7 .phps\n";
        file_put_contents($htaccessPath, $htaccessContent);
    }

    // Vérification sécurisée du type MIME via finfo
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);

    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!in_array($mimeType, $allowedTypes)) {
        jsonResponse(['status' => 'error', 'message' => 'Type de fichier non autorisé'], 400);
    }

    // Vérification de l'extension du fichier
    $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($extension, $allowedExtensions)) {
        jsonResponse(['status' => 'error', 'message' => 'Extension de fichier non autorisée'], 400);
    }

    // Limite de taille 5MB
    $maxSize = 5 * 1024 * 1024;
    if ($file['size'] > $maxSize) {
        jsonResponse(['status' => 'error', 'message' => 'Fichier trop volumineux'], 400);
    }

    // Nettoyage et génération du nom de fichier sécurisé
    $safeName = preg_replace('/[^a-zA-Z0-9-_\.]/', '_', pathinfo($file['name'], PATHINFO_FILENAME));
    $fileName = uniqid() . '_' . $safeName . '.' . $extension;
    $uploadPath = $uploadDir . $fileName;

    // Déplacement du fichier
    if (!move_uploaded_file($file['tmp_name'], $uploadPath)) {
        jsonResponse(['status' => 'error', 'message' => 'Erreur lors du téléchargement du fichier'], 500);
    }

    // Retour structuré des infos
    return [
        'name' => $fileName,
        'url' => $uploadPath,
        'type' => $mimeType,
        'size' => $file['size']
    ];
}


// Fonction pour récupérer un utilisateur par ID
function getUserById($userId) {
    global $pdo;
    $stmt = $pdo->prepare('SELECT id, username, CONCAT(firstname, " ", lastname) AS full_name, avatar_url FROM users WHERE id = ?');
    $stmt->execute([$userId]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

function jsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

// Gestion des routes
switch ($uri) {
    case '/api/users/home':
        if ($method !== 'GET') {
            jsonResponse(['status' => 'error', 'message' => 'Méthode non autorisée'], 405);
        }
        $user = authentificateToken(getallheaders());
        $userData = getUserById($user->user_id);
        if ($userData) {
            jsonResponse(['status' => 'success', 'user' => $userData]);
        } else {
            jsonResponse(['status' => 'error', 'message' => 'Utilisateur non trouvé'], 404);
        }
        break;

    case '/api/users/posts':
        if ($method === 'POST') {
            $user = authentificateToken(getallheaders());
            $data = json_decode(file_get_contents('php://input'), true);
            $content = $data['content'] ?? null;
            $location_name = $data['location_name'] ?? null;
            $latitude = $data['latitude'] ?? null;
            $longitude = $data['longitude'] ?? null;
            $media_url = null;
            $media_type = null;
            if (!empty($data['media'])) {
                $fileInfo = handFileUpload($data['media']);
                $media_url = $fileInfo['url'];
                $media_type = strpos($fileInfo['type'], 'video') !== false ? 'video' : 'image';
            }
            $errors = [];
            if (empty($content) && empty($media_url) && empty($emoji_content)) {
                $errors[] = 'Contenu ou média requis';
            }
            if (!empty($errors)) {
                jsonResponse(['status' => 'error', 'errors' => $errors], 400);
            }
            try {
                $stmt = $pdo->prepare(
                    'INSERT INTO posts (user_id, content, media_url, media_type, location_name, latitude, longitude) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)'
                );
                $stmt->execute([$user->user_id, $content, $media_url, $media_type, $location_name, $latitude, $longitude]);
                jsonResponse(['status' => 'success', 'message' => 'Post créé', 'id' => $pdo->lastInsertId()], 201);
            } catch (Exception $e) {
                jsonResponse(['status' => 'error', 'message' => 'Erreur lors de la création du post'], 500);
            }
        } elseif ($method === 'GET') {
            $user = authentificateToken(getallheaders());
            try {
                $stmt = $pdo->prepare('
                    SELECT p.*, u.username, CONCAT(u.firstname, " ", u.lastname) AS full_name, u.avatar_url,
                            (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS likes_count,
                            (SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS comments_count
                    FROM posts p
                    JOIN users u ON p.user_id = u.id
                    ORDER BY p.created_at DESC
                    LIMIT 20
                ');
                $stmt->execute();
                $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);
                jsonResponse(['status' => 'success', 'posts' => $posts]);
            } catch (Exception $e) {
                jsonResponse(['status' => 'error', 'message' => 'Erreur lors de la récupération des posts'], 500);
            }
        }
        break;

    case '/api/users/stories':
        if ($method === 'POST') {
            $user = authentificateToken(getallheaders());
            $emoji_content = $data['emoji_content'] ?? null;
            $media_url = null;
            $media_type = 'emoji';
            if (!empty($data['media'])) {
                $fileInfo = handFileUpload($data['media']);
                $media_url = $fileInfo['url'];
                $media_type = strpos($fileInfo['type'], 'video') !== false ? 'video' : 'image';
            }
            $expires_at = date('Y-m-d H:i:s', strtotime('+24 hours'));
            try {
                $stmt = $pdo->prepare(
                    'INSERT INTO stories (user_id, media_url, media_type, emoji_content, expires_at) 
                    VALUES (?, ?, ?, ?, ?)'
                );
                $stmt->execute([$user->user_id, $media_url, $media_type, $emoji_content, $expires_at]);
                jsonResponse(['status' => 'success', 'message' => 'Story créée', 'id' => $pdo->lastInsertId()], 201);
            } catch (Exception $e) {
                jsonResponse(['status' => 'error', 'message' => 'Erreur lors de la création de la story'], 500);
            }
        } elseif ($method === 'GET') {
            $user = authentificateToken(getallheaders());
            try {
                $stmt = $pdo->prepare('
                    SELECT s.*, u.username, CONCAT(u.firstname, " ", u.lastname) AS full_name, u.avatar_url
                    FROM stories s
                    JOIN users u ON s.user_id = u.id
                    WHERE s.expires_at > NOW()
                    ORDER BY s.created_at DESC
                    LIMIT 20
                ');
                $stmt->execute();
                $stories = $stmt->fetchAll(PDO::FETCH_ASSOC);
                jsonResponse(['status' => 'success', 'stories' => $stories]);
            } catch (Exception $e) {
                jsonResponse(['status' => 'error', 'message' => 'Erreur lors de la récupération des stories'], 500);
            }
        }
        break;

    case '/api/users/comments':
        if ($method === 'POST') {
            $user = authentificateToken(getallheaders());
            $data = json_decode(file_get_contents('php://input'), true);
            $post_id = $data['post_id'] ?? null;
            $content = $data['content'] ?? null;
            $errors = [];
            if (empty($post_id) || empty($content)) {
                $errors[] = 'Post ID et contenu requis';
            }
            if (!empty($errors)) {
                jsonResponse(['status' => 'error', 'errors' => $errors], 400);
            }
            try {
                $stmt = $pdo->prepare('INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)');
                $stmt->execute([$post_id, $user->user_id, $content]);
                jsonResponse(['status' => 'success', 'message' => 'Commentaire ajouté', 'id' => $pdo->lastInsertId()], 201);
            } catch (Exception $e) {
                jsonResponse(['status' => 'error', 'message' => 'Erreur lors de l\'ajout du commentaire'], 500);
            }
        }
        break;
        case '/api/users/likes':
            if ($method === 'POST') {
                $user = authentificateToken(getallheaders());
                $data = json_decode(file_get_contents('php://input'), true);
                $post_id = $data['post_id'] ?? null;
                $comment_id = $data['comment_id'] ?? null;
                
                try {
                    $stmt = $pdo->prepare('SELECT * FROM likes WHERE user_id = ? AND (post_id = ? OR comment_id = ?)');
                    $stmt->execute([$user->user_id, $post_id, $comment_id]);
                    if ($stmt->fetch()) {
                        jsonResponse(['status' => 'error', 'message' => 'Like déjà ajouté'], 400);
                    }
                    
                    $stmt = $pdo->prepare('INSERT INTO likes (user_id, post_id, comment_id) VALUES (?, ?, ?)');
                    $stmt->execute([$user->user_id, $post_id, $comment_id]);
                    
                    jsonResponse(['status' => 'success', 'message' => 'Like ajouté'], 201);
                } catch (Exception $e) {
                    jsonResponse(['status' => 'error', 'message' => 'Erreur lors de l\'ajout du like'], 500);
                }
            } elseif ($method === 'DELETE') {
                $user = authentificateToken(getallheaders());
                $data = json_decode(file_get_contents('php://input'), true);
                $post_id = $data['post_id'] ?? null;
                $comment_id = $data['comment_id'] ?? null;
                
                try {
                    $stmt = $pdo->prepare('DELETE FROM likes WHERE user_id = ? AND (post_id = ? OR comment_id = ?)');
                    $stmt->execute([$user->user_id, $post_id, $comment_id]);
                    
                    jsonResponse(['status' => 'success', 'message' => 'Like supprimé']);
                } catch (Exception $e) {
                    jsonResponse(['status' => 'error', 'message' => 'Erreur lors de la suppression du like'], 500);
                }
            } else {
                jsonResponse(['status' => 'error', 'message' => 'Méthode non autorisée'], 405);
            }
            break;
            case '/api/users/friends':
                if ($method === 'POST') {
                    $user = authentificateToken(getallheaders());
                    $data = json_decode(file_get_contents('php://input'), true);
                    $friend_id = $data['friend_id'] ?? null;
                    
                    try {
                        $stmt = $pdo->prepare('INSERT INTO friends (user_id, friend_id, status) VALUES (?, ?, ?)');
                        $stmt->execute([$user->user_id, $friend_id, 'pending']);
                        jsonResponse(['status' => 'success', 'message' => 'Demande d\'ami envoyée'], 201);
                    } catch (Exception $e) {
                        jsonResponse(['status' => 'error', 'message' => 'Erreur lors de l\'envoi de la demande d\'ami'], 500);
                    }
                } elseif ($method === 'GET') {
                    $user = authentificateToken(getallheaders());
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
                break;
            case '/api/users/friends/suggestions':
                if ($method !== 'GET') {
                    jsonResponse(['status' => 'error', 'message' => 'Méthode non autorisée'], 405);
                }
                $user = authentificateToken(getallheaders());
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
                break;
            default:
                // Gestion des routes dynamiques
                if (preg_match('/^\/api\/users\/posts\/(\d+)\/comments$/', $uri, $matches)) {
                    if ($method !== 'GET') {
                        jsonResponse(['status' => 'error', 'message' => 'Méthode non autorisée'], 405);
                    }
                $user = authentificateToken(getallheaders());
                $post_id = $matches[1];
                try {
                    $stmt = $pdo->prepare('
                        SELECT c.*, u.username, CONCAT(u.firstname, " ", u.lastname) AS full_name, u.avatar_url
                        FROM comments c
                        JOIN users u ON c.user_id = u.id
                        WHERE c.post_id = ?
                        ORDER BY c.created_at ASC
                    ');
                    $stmt->execute([$post_id]);
                    $comments = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    jsonResponse(['status' => 'success', 'comments' => $comments]);
                } catch (Exception $e) {
                    jsonResponse(['status' => 'error', 'message' => 'Erreur lors de la récupération des commentaires'], 500);
                }
            } elseif (preg_match('/^\/api\/users\/stories\/(\d+)\/views$/', $uri, $matches)) {
                if ($method !== 'POST') {
                    jsonResponse(['status' => 'error', 'message' => 'Méthode non autorisée'], 405);
                }
                $user = authentificateToken(getallheaders());
                $story_id = $matches[1];
                try {
                    $stmt = $pdo->prepare('INSERT INTO story_views (story_id, user_id) VALUES (?, ?)');
                    $stmt->execute([$story_id, $user->user_id]);
                    jsonResponse(['status' => 'success', 'message' => 'Vue enregistrée'], 201);
                } catch (Exception $e) {
                    jsonResponse(['status' => 'error', 'message' => 'Erreur lors de l\'enregistrement de la vue'], 500);
                }
            } elseif (preg_match('/^\/api\/users\/friends\/(\d+)$/', $uri, $matches) && $method === 'PUT') {    
                $user = authentificateToken(getallheaders());
                $friend_id = $matches[1];
                try {
                    $stmt = $pdo->prepare('UPDATE friends SET status = ? WHERE user_id = ? AND friend_id = ?');
                    $stmt->execute(['accepted', $friend_id, $user->user_id]);
                    jsonResponse(['status' => 'success', 'message' => 'Demande d\'ami acceptée']);
                } catch (Exception $e) {
                    jsonResponse(['status' => 'error', 'message' => 'Erreur lors de l\'acceptation de la demande d\'ami'], 500);
                }
            } elseif (preg_match('/^\/Uploads\/(.+)$/', $uri, $matches)) {
                $file = __DIR__ . '/../../Uploads/' . $matches[1];
                if (file_exists($file)) {
                    $mimeType = mime_content_type($file);
                    header('Content-Type: ' . $mimeType);
                    header('Content-Length: ' . filesize($file));
                    header('Cache-Control: public, max-age=31536000');
                    readfile($file);
                    exit;
                } else {
                    jsonResponse(['status' => 'error', 'message' => 'Fichier non trouvé'], 404);
                }
            } else {
                jsonResponse(['status' => 'error', 'message' => 'Route non trouvée'], 404);
            }
        }
?>