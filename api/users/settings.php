<?php
require_once __DIR__.'/../../config/config.php';

// Vérification de l'authentification
if (!isset($_SESSION['user_id'])) {
    header('Location: C:\xampp\htdocs\ReseauSocial\vues\clients\login.html');
    exit;
}

$user = getUserData($_SESSION['user_id'], $pdo);
?>