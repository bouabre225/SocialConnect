<?php
//congig
require '../../api/config.php';

// Inclure le chargeur automatique de Composer pour JWT
require_once '../../vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;

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


// Vérification de la méthode HTTP
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['status' => 'error', 'message' => 'Méthode non autorisée'], 405);
}

// Clé secrète pour JWT
$secretKey = 'your-secret-key';

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












?>