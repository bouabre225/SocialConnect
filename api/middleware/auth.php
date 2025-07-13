<?php
session_start();
// Configurer les en-têtes CORS
if (isset($_SERVER['HTTP_ORIGIN'])) {
    $origin = $_SERVER['HTTP_ORIGIN'];
    $allowed_origins = ['http://localhost:8000'];
    if (in_array($origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: $origin");
        header("Access-Control-Allow-Credentials: true");
        header("Access-Control-Allow-Methods: GET, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, X-CSRF-Token");
    }
}

// Protection : vérifie si l'utilisateur est connecté
if (!isset($_SESSION['user'])) {
    http_response_code(403);
    echo json_encode([
        'status' => 'error',
        'message' => 'Accès interdit. Veuillez vous connecter.'
    ]);
    exit;
}
?>
