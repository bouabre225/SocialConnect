<?php
//common.php
//require '/api/config.php';
include __DIR__ . '/../../vendor/autoload.php';
// Inclure le chargeur automatique de Composer pour JWT
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
//use \Exception;
define('JWT_SECRET_KEY1', 'ta-cle-super-secrete'); 


// Clé secrète pour JWT
$secretKey = JWT_SECRET_KEY1;

$data = json_decode(file_get_contents('php://input'), true);

// Fonction pour vérifier le token JWT
function getAuthorizationHeader() {
    $headers = null;
    if (isset($_SERVER['Authorization'])) {
        $headers = trim($_SERVER['Authorization']);
    } elseif (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $headers = trim($_SERVER['HTTP_AUTHORIZATION']);
    } elseif (function_exists('apache_request_headers')) {
        $requestHeaders = apache_request_headers();
        foreach ($requestHeaders as $key => $value) {
            if (strcasecmp($key, 'Authorization') == 0) {
                $headers = trim($value);
                break;
            }
        }
    }
    error_log("Authorization Header: " . ($headers ?: 'Aucun en-tête trouvé')); // Débogage
    return $headers;
}

function authentificateToken() {
    global $secretKey;

    $authHeader = getAuthorizationHeader();
    if (!$authHeader) {
        http_response_code(401);
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'Aucun token fourni']);
        exit;
    }

    $token = str_replace('Bearer ', '', $authHeader);

    try {
        $decoded = JWT::decode($token, new Key($secretKey, 'HS256'));
        return $decoded;
    } catch (Exception $e) {
        http_response_code(401);
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'Token invalide']);
        exit;
    }
}

// Fonction pour gérer les uploads de fichiers
function handFileUpload($file, $uploadDir = './uploads/') {
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $htaccessPath = $uploadDir . '.htaccess';
    if (!file_exists($htaccessPath)) {
        $htaccessContent = "php_flag engine off\n";
        $htaccessContent .= "RemoveHandler .php .phtml .php3 .php4 .php5 .php7 .phps\n";
        file_put_contents($htaccessPath, $htaccessContent);
    }

    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);

    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!in_array($mimeType, $allowedTypes)) {
        http_response_code(400);
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'Type de fichier non autorisé']);
        exit;
    }

    $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($extension, $allowedExtensions)) {
        http_response_code(400);
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'Extension de fichier non autorisée']);
        exit;
    }

    $maxSize = 5 * 1024 * 1024;
    if ($file['size'] > $maxSize) {
        http_response_code(400);
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'Fichier trop volumineux']);
        exit;
    }

    $safeName = preg_replace('/[^a-zA-Z0-9-_\.]/', '_', pathinfo($file['name'], PATHINFO_FILENAME));
    $fileName = uniqid() . '_' . $safeName . '.' . $extension;
    $uploadPath = $uploadDir . $fileName;

    if (!move_uploaded_file($file['tmp_name'], $uploadPath)) {
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'Erreur lors du téléchargement du fichier']);
        exit;
    }

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
    if (!$pdo) {
        error_log("Erreur: \$pdo est null dans getUserById");
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Erreur de connexion à la base de données']);
        exit;
    }
    $stmt = $pdo->prepare('SELECT id, username, CONCAT(firstname, " ", lastname) AS full_name, avatar_url FROM users WHERE id = ?');
    $stmt->execute([$userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($user && $user['avatar_url']) {
        $user['avatar_url'] = 'http://localhost:8000/uploads/' . basename($user['avatar_url']);
    }
    return $user;
}
?>
