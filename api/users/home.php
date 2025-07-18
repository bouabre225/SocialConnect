<?php
require_once 'common.php';
require '../config.php';

// Gérer la requête OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    error_log("Requête OPTIONS reçue");
    http_response_code(200);
    exit();
}

//define('JWT_SECRET_KEY1', 'ta-cle-super-secrete'); //voila ce que j'ai fais 
//define('JWT_SECRET_KEY', 'ta-cle-super-secrete'); //voila ce que j'ai fais 

// Authentification du token
error_log("Début de l'authentification dans home.php");
try {
    $decoded = authentificateToken();
    error_log("Token décodé: " . json_encode($decoded));
    if ($decoded) {
        $userData = getUserById($decoded->user_id);
        if ($userData) {
            echo json_encode(['status' => 'success', 'user' => $userData]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Utilisateur non trouvé']);
            http_response_code(404);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Token invalide']);
        http_response_code(401);
    }
} catch (Exception $e) {
    error_log("Erreur d'authentification: " . $e->getMessage());
    echo json_encode(['status' => 'error', 'message' => 'Token invalide']);
    http_response_code(401);
}
?>