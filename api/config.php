<?php
// Activer l'affichage des erreurs pour le débogage
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Configurer la gestion des sessions
if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params([
    'lifetime' => 86400, // 1 jour
    'path' => '/',
    'domain' => 'localhost',
    'secure' => true, // Mettez à true si vous utilisez HTTPS
    'httponly' => true, 
    'samesite' => 'Lax'
]);
session_start();
}


// Configuration de la base de données
define('DB_HOST', 'nue.domcloud.co');
define('DB_NAME', 'flippant_fault_buf_db');
define('DB_USER', 'flippant-fault-buf');
define('DB_PASS', 'UqF+)988-W8vu7aYWe');

// Clé secrète
define('JWT_SECRET_KEY', 'ta-cle-super-secrete'); //voila ce que j'ai fais 

// Fonction utilitaire pour la réponse JSON
if (!function_exists('jsonResponse')) {
    function jsonResponse($data, $code = 200) {
        header('Content-Type: application/json');
        http_response_code($code);
        echo json_encode($data);
        exit();
    }
}

// Connexion à la base de données
try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo->setAttribute(PDO::MYSQL_ATTR_INIT_COMMAND, "SET NAMES utf8mb4");
    error_log("Connexion à la base de données réussie");
} catch (PDOException $e) {
    error_log("Erreur de connexion à la base de données : " . $e->getMessage());
    jsonResponse(['status' => 'error', 'message' => 'Erreur de connexion à la base de données'], 500);
}
?>