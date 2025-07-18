<?php
session_start();

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
