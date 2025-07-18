<?php
session_start();
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once 'config.php';


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    error_log("Requête OPTIONS reçue pour check-session.php");
    jsonResponse([], 200);
}

error_log("check-session.php - Session ID: " . session_id());
error_log("check-session.php - Contenu de \$_SESSION: " . print_r($_SESSION, true));

if (isset($_SESSION['user'])) {
    error_log("Utilisateur trouvé dans la session: " . print_r($_SESSION['user'], true));
    jsonResponse([
        'status' => 'success',
        'user' => $_SESSION['user']
    ], 200);
} else {
    error_log("Aucun utilisateur dans la session");
    jsonResponse(['status' => 'error', 'message' => 'Non connecté'], 401);
}
?>