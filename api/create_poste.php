<?php
require_once 'config.php';

// Récupérer les données de la requête
$data = json_decode(file_get_contents('php://input'), true);
$content = $data['content'] ?? '';
$user_id = 1; // ID de l'utilisateur connecté (en production, ce serait à partir de la session)

if (empty($content)) {
    jsonResponse(['success' => false, 'message' => 'Le contenu ne peut pas être vide'], 400);
}

try {
    // Insérer la nouvelle publication
    $stmt = $pdo->prepare("
        INSERT INTO posts (user_id, content, created_at, updated_at) 
        VALUES (?, ?, NOW(), NOW())
    ");
    $stmt->execute([$user_id, $content]);
    
    jsonResponse(['success' => true, 'message' => 'Publication créée avec succès']);

} catch (PDOException $e) {
    jsonResponse(['success' => false, 'message' => 'Erreur de base de données: ' . $e->getMessage()], 500);
}