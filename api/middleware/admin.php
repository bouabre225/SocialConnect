<?php
require_once 'auth.php'; // vérifie d'abord que l'utilisateur est connecté

// Ensuite on vérifie qu'il est admin
if ($_SESSION['user']['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode([
        'status' => 'error',
        'message' => 'Accès réservé aux administrateurs.'
    ]);
    exit;
}
?>
