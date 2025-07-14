<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

//api/admin/login.php
//require '../config.php';
require '../users/common.php';
include '../config.php';

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
    if (!file_exists('../config.php')) {
    error_log("Erreur : config.php introuvable");
    jsonResponse(['status' => 'error', 'message' => 'Erreur de configuration : fichier config.php introuvable'], 500);
}
//require_once 'config.php';
error_log("config.php chargé");

if (!file_exists('../users/common.php')) {
    error_log("Erreur : common.php introuvable");
    jsonResponse(['status' => 'error', 'message' => 'Erreur de configuration : fichier common.php introuvable'], 500);
}
require_once '../users/common.php';
error_log("common.php chargé");

if (!file_exists('../../vendor/autoload.php')) {
    error_log("Erreur : vendor/autoload.php introuvable");
    jsonResponse(['status' => 'error', 'message' => 'Erreur de configuration : fichier autoload.php introuvable'], 500);
}
require_once '../../vendor/autoload.php';
use Firebase\JWT\JWT;
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

// Vérification de l'utilisateur pour admin
try {
    $stmt = $pdo->prepare("SELECT id, email, password, role FROM users WHERE email = ? AND (role = 'admin' OR role = 'moderator')");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        error_log("Utilisateur non trouvé ou non admin : $email");
        jsonResponse(['status' => 'error', 'message' => 'Identifiants incorrects ou utilisateur non administrateur'], 401);
    }

    // Vérification du mot de passe
    if (!password_verify($password, $user['password'])) {
        error_log("Mot de passe incorrect pour l'utilisateur : $email");
        jsonResponse(['status' => 'error', 'message' => 'Mot de passe incorrect'], 401);
    }

    // Génération du token JWT
    $payload = [
        'iss' => 'http://localhost:8001',
        'aud' => 'http://localhost:8000',
        'iat' => time(),
        'exp' => time() + (60 * 60 * 24), // Token valide pendant 24 heures
        'user_id' => $user['id'],
        'role' => $user['role']
    ];
    $token = JWT::encode($payload, JWT_SECRET_KEY, 'HS256');

    error_log("Connexion réussie pour l'utilisateur : $email, token généré");
    jsonResponse([
        'status' => 'success',
        'message' => 'Connexion réussie',
        'token' => $token,
        'user_id' => $user['id']
    ], 200);

} catch (\Throwable $th) {
    error_log("Erreur lors de la vérification de l'utilisateur : " . $th->getMessage());
    jsonResponse(['status' => 'error', 'message' => 'Erreur lors de la vérification de l\'utilisateur'], 500);
}
?>