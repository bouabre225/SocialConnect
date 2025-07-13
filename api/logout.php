<?php
session_start(); // Démarrer la session pour pouvoir la détruire

// Activer l'affichage des erreurs
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once 'config.php';
require_once '../../api/middleware/auth.php'; // Vérifie qu'un utilisateur est connecté

// CORS headers
if (isset($_SERVER['HTTP_ORIGIN'])) {
    $origin = $_SERVER['HTTP_ORIGIN'];
    $allowed_origins = ['http://localhost:8000'];
    if (in_array($origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: $origin");
        header("Access-Control-Allow-Credentials: true");
        header("Access-Control-Allow-Methods: POST, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, X-CSRF-Token");
    }
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
