<?php
// Activer le débogage
error_reporting(E_ALL);
ini_set('display_errors', 0);
ob_start();

error_log("Démarrage de login.php");

// Vérifier la sortie inattendue
$output = ob_get_contents();
if (!empty($output)) {
    error_log("Sortie inattendue détectée : " . $output);
    ob_clean();
}

// Configuration des en-têtes CORS
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: http://localhost:8000');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-CSRF-Token');
header('Access-Control-Allow-Credentials: true');
error_log("En-têtes CORS configurés");

// Gérer la requête OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    error_log("Requête OPTIONS reçue");
    http_response_code(200);
    exit();
}

// Vérification des inclusions
if (!file_exists('config.php')) {
    error_log("Erreur : config.php introuvable");
    jsonResponse(['status' => 'error', 'message' => 'Erreur de configuration : fichier config.php introuvable'], 500);
}
require_once 'config.php';
error_log("config.php chargé");

if (!file_exists('../api/users/common.php')) {
    error_log("Erreur : common.php introuvable");
    jsonResponse(['status' => 'error', 'message' => 'Erreur de configuration : fichier common.php introuvable'], 500);
}
require_once '../api/users/common.php';
error_log("common.php chargé");

if (!file_exists('../vendor/autoload.php')) {
    error_log("Erreur : vendor/autoload.php introuvable");
    jsonResponse(['status' => 'error', 'message' => 'Erreur de configuration : fichier autoload.php introuvable'], 500);
}
require_once '../vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
error_log("vendor/autoload.php chargé");

// Vérification de la clé secrète
if (!defined('JWT_SECRET_KEY')) {
    error_log("Erreur : JWT_SECRET_KEY non défini dans config.php");
    jsonResponse(['status' => 'error', 'message' => 'Erreur de configuration serveur'], 500);
}

// Vérification de la méthode HTTP
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['status' => 'error', 'message' => 'Méthode non autorisée'], 405);
}

// Récupération des données
$data = json_decode(file_get_contents('php://input'), true);
error_log("Données reçues : " . print_r($data, true));

$email = $data['email'] ?? null;
$password = $data['password'] ?? null;

// Validation des données
if (!isset($email, $password)) {
    jsonResponse(['status' => 'error', 'message' => 'Données manquantes'], 400);
}

// Validation de l'email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(['status' => 'error', 'message' => 'Email invalide'], 400);
}

// Sécurisation des données
$email = filter_var($email, FILTER_SANITIZE_EMAIL);
error_log("Email sécurisé : $email");

// Vérification de l'utilisateur
try {
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? AND status = 'active'");
    $stmt->execute([$email]);
    error_log("Requête SQL exécutée pour l'email : $email");
    
    if ($stmt->rowCount() === 1) {
        $user = $stmt->fetch();
        error_log("Utilisateur trouvé : " . print_r($user, true));
        
        // Vérification du mot de passe
        if (password_verify($password, $user['password'])) {
            // Génération d'un token JWT
            $payload = [
                'iat' => time(),
                'exp' => time() + (60 * 60 * 24),
                'user_id' => $user['id'],
                'email' => $user['email'],
                'firstname' => $user['firstname'],
                'lastname' => $user['lastname']
            ];
            $jwt = JWT::encode($payload, JWT_SECRET_KEY, 'HS256');
            error_log("Token JWT généré : $jwt");

            // Mise à jour du token dans la base (optionnel)
            $pdo->prepare("UPDATE users SET csrf_token = ? WHERE id = ?")->execute([$jwt, $user['id']]);
            error_log("Token JWT mis à jour dans la base pour l'utilisateur ID : {$user['id']}");
            
            // Préparation des données de réponse
            $response = [
                'status' => 'success',
                'message' => 'Connexion réussie.',
                'user' => [
                    'id' => $user['id'],
                    'firstname' => htmlspecialchars($user['firstname'], ENT_QUOTES, 'UTF-8'),
                    'lastname' => htmlspecialchars($user['lastname'], ENT_QUOTES, 'UTF-8'),
                    'email' => $email,
                    'token' => $jwt,
                    'status' => $user['status']
                ]
            ];
            jsonResponse($response, 200);
        }
    }
    
    jsonResponse(['status' => 'error', 'message' => 'Email ou mot de passe incorrect.'], 401);
} catch (PDOException $e) {
    error_log("Erreur de connexion PDO : " . $e->getMessage());
    jsonResponse(['status' => 'error', 'message' => 'Erreur serveur'], 500);
}

// Fonction pour envoyer une réponse JSON
function jsonResponse($data, $statusCode) {
    http_response_code($statusCode);
    echo json_encode($data);
    error_log("Réponse envoyée : " . json_encode($data));
    ob_end_flush();
    exit();
}
?>