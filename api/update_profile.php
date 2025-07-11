<?php
require_once 'config.php';

// Récupérer les données de la requête
$data = json_decode(file_get_contents('php://input'), true);
$user_id = 1; // ID de l'utilisateur connecté (en production, ce serait à partir de la session)

// Vérifier d'abord le mot de passe
if (empty($data['current_password'])) {
    jsonResponse(['success' => false, 'message' => 'Mot de passe actuel requis'], 400);
}

// Vérifier le mot de passe
$passwordVerify = json_decode(file_get_contents('http://localhost/verify_password.php'), true);
if (!$passwordVerify['success']) {
    jsonResponse(['success' => false, 'message' => 'Mot de passe incorrect'], 401);
}

// Préparer les données pour la mise à jour
$updateData = [
    'firstname' => $data['firstname'] ?? '',
    'lastname' => $data['lastname'] ?? '',
    'birthdate' => $data['birthdate'] ?? null,
    'city' => $data['city'] ?? null,
    'profession' => $data['profession'] ?? null,
    'relationship_status' => $data['relationship_status'] ?? null,
    'bio' => $data['bio'] ?? null,
    'user_id' => $user_id
];

try {
    // Mettre à jour la table users
    $stmt = $pdo->prepare("
        UPDATE users 
        SET 
            firstname = :firstname,
            lastname = :lastname,
            birthdate = :birthdate,
            city = :city,
            profession = :profession,
            relationship_status = :relationship_status,
            updated_at = NOW()
        WHERE id = :user_id
    ");
    $stmt->execute($updateData);

    // Vérifier si un profil existe déjà
    $stmt = $pdo->prepare("SELECT id FROM profiles WHERE user_id = ?");
    $stmt->execute([$user_id]);
    $profileExists = $stmt->fetch();

    if ($profileExists) {
        // Mettre à jour le profil existant
        $stmt = $pdo->prepare("
            UPDATE profiles 
            SET 
                bio = :bio,
                updated_at = NOW()
            WHERE user_id = :user_id
        ");
        $stmt->execute([
            'bio' => $updateData['bio'],
            'user_id' => $user_id
        ]);
    } else {
        // Créer un nouveau profil
        $stmt = $pdo->prepare("
            INSERT INTO profiles (user_id, bio, created_at, updated_at) 
            VALUES (?, ?, NOW(), NOW())
        ");
        $stmt->execute([$user_id, $updateData['bio']]);
    }

    jsonResponse(['success' => true, 'message' => 'Profil mis à jour avec succès']);

} catch (PDOException $e) {
    jsonResponse(['success' => false, 'message' => 'Erreur de base de données: ' . $e->getMessage()], 500);
}