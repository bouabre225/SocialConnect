<?php

require_once 'common.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'GET') {
    jsonResponse(['status' => 'error', 'message' => 'Méthode non autorisée'], 405);
}

// Récupérer le nom du fichier depuis l'URL
if (!preg_match('/\/Uploads\/(.+)$/', $_SERVER['REQUEST_URI'], $matches)) {
    jsonResponse(['status' => 'error', 'message' => 'Nom de fichier invalide dans l\'URL'], 400);
}

$filename = basename($matches[1]);
$filePath = __DIR__ . '/../../Uploads/' . $filename;

if (!file_exists($filePath)) {
    jsonResponse(['status' => 'error', 'message' => 'Fichier non trouvé'], 404);
}

// Détecter le type MIME du fichier
$mimeType = mime_content_type($filePath);

// Envoyer les en-têtes HTTP appropriés
header('Content-Type: ' . $mimeType);
header('Content-Length: ' . filesize($filePath));
header('Content-Disposition: inline; filename="' . $filename . '"');
header('Cache-Control: public, max-age=31536000');

// Lire et afficher le fichier
readfile($filePath);

?>