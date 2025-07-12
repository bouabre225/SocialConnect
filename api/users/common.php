<?php
require_once '../../api/config.php';


//inclusion des headers
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    // Configuration des headers
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin:' . API);
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-CSRF-Token');
    header('Access-Control-Allow-Credentials: true');
    http_response_code(200);
    exit();
}

// Configuration des headers pour toutes les requêtes
header('Content-Type: application/json');
header('Access-Control-Allow-Origin:' . API);
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-CSRF-Token');
header('Access-Control-Allow-Credentials: true');


// Inclure le chargeur automatique de Composer pour JWT
require_once '../../vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
//use \Exception;

// Clé secrète pour JWT
$secretKey = 'JWT_SECRET_KEY';


$data = json_decode(file_get_contents('php://input'), true);


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
?>