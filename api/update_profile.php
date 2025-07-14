<?php
require_once 'config.php';

$data = json_decode(file_get_contents('php://input'), true);
session_start();
$user_id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : 1; 

+    jsonResponse(['success' => false, 'message' => 'Mot de passe actuel requis'], 400);
}

$stmt = $pdo->prepare("SELECT password FROM users WHERE id = ?");
$stmt->execute([$user_id]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$user || !password_verify($data['current_password'], $user['password'])) {
    jsonResponse(['success' => false, 'message' => 'Mot de passe incorrect'], 401);
}

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

$avatar_url = null;
if (isset($_FILES['profile_pic']) && $_FILES['profile_pic']['error'] == UPLOAD_ERR_OK) {
    $upload_dir = 'uploads/';
    if (!file_exists($upload_dir)) mkdir($upload_dir, 0777, true);
    
    $file_name = uniqid() . '_' . basename($_FILES['profile_pic']['name']);
    $target_file = $upload_dir . $file_name;
    
    if (move_uploaded_file($_FILES['profile_pic']['tmp_name'], $target_file)) {
        $avatar_url = $target_file;
        $updateData['avatar_url'] = $avatar_url;
    }
}


$cover_url = null;
if (isset($_FILES['cover_pic']) && $_FILES['cover_pic']['error'] == UPLOAD_ERR_OK) {
    $upload_dir = 'uploads/';
    if (!file_exists($upload_dir)) mkdir($upload_dir, 0777, true);
    
    $file_name = uniqid() . '_' . basename($_FILES['cover_pic']['name']);
    $target_file = $upload_dir . $file_name;
    
    if (move_uploaded_file($_FILES['cover_pic']['tmp_name'], $target_file)) {
        $cover_url = $target_file;
        $updateData['coverPic'] = $cover_url;
    }
}

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
            avatar_url = :avatar_url,
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
                avatar_url = :avatar_url,
                updated_at = NOW()
            WHERE user_id = :user_id
        ");
        $stmt->execute([
            'bio' => $updateData['bio'],
            'avatar_url' => $avatar_url ?? null,
            'user_id' => $user_id
        ]);
    } else {

        $stmt = $pdo->prepare("
            INSERT INTO profiles (user_id, bio, avatar_url, created_at, updated_at) 
            VALUES (?, ?, ?, NOW(), NOW())
        ");
        $stmt->execute([$user_id, $updateData['bio'], $avatar_url ?? null]);
    }

    jsonResponse(['success' => true, 'message' => 'Profil mis à jour avec succès']);

} catch (PDOException $e) {
    jsonResponse(['success' => false, 'message' => 'Erreur de base de données: ' . $e->getMessage()], 500);
}

function jsonResponse($data, $status = 200) {
    header('Content-Type: application/json');
    http_response_code($status);
    echo json_encode($data);
    exit;
}