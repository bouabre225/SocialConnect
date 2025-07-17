<?php
session_start(); // Démarrer la session pour pouvoir la détruire

// Activer l'affichage des erreurs
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once 'config.php';
require_once '../api/users/common.php'; // Vérifie qu'un utilisateur est connecté

// Définition de l'origine autorisée
define('API', 'https://endearing-strudel-046558.netlify.app');

// Configuration des en-têtes CORS
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: ' . API);
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-CSRF-Token');
header('Access-Control-Allow-Credentials: true');

// Gérer la requête OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Gérer les requêtes OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    jsonResponse([], 200);
}

// Vérifier la méthode HTTP
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['status' => 'error', 'message' => 'Méthode non autorisée'], 405);
}


// Détruire la session
session_unset();  // vide les variables de session
session_destroy(); // détruit la session côté serveur

// Réponse JSON
echo json_encode([
    'status' => 'success',
    'message' => 'Déconnexion réussie.'
]);
?>
