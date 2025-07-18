<?php

//update-profile.php
require_once 'config.php';
require_once '../api/users/common.php';

// Récupérer les données de la requête
$data = json_decode(file_get_contents('php://input'), true);
//session_start();

try {
    $user = authentificateToken();
    if (empty($_POST['current_password'])) {
        jsonResponse(['success' => false, 'message' => 'Mot de passe actuel requis'], 400);
    }

    $stmt = $pdo->prepare("SELECT password FROM users WHERE id = ?");
    $stmt->execute([$user->user_id]);
    $dbUser = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$dbUser || !password_verify($_POST['current_password'], $dbUser['password'])) {
        jsonResponse(['success' => false, 'message' => 'Mot de passe incorrect'], 401);
    }

    $updateData = [
        'firstname' => $_POST['firstname'] ?? '',
        'lastname' => $_POST['lastname'] ?? '',
        'birthdate' => $_POST['birthdate'] ?? null,
        'city' => $_POST['city'] ?? null,
        'profession' => $_POST['profession'] ?? null,
        'relationship_status' => $_POST['relationship_status'] ?? null,
        'bio' => $_POST['bio'] ?? null,
        'username' => $_POST['username'] ?? null,
        'interests' => $_POST['interests'] ?? null,
        'gender' => $_POST['gender'] ?? null,
        'country' => $_POST['country'] ?? null,
        'address' => $_POST['address'] ?? null,
        'user_id' => $user->user_id
    ];

    $avatar_url = null;
    if (isset($_FILES['profile_pic']) && $_FILES['profile_pic']['error'] == UPLOAD_ERR_OK) {
        $allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
        $max_size = 5 * 1024 * 1024; // 5MB
        if (!in_array($_FILES['profile_pic']['type'], $allowed_types) || $_FILES['profile_pic']['size'] > $max_size) {
            jsonResponse(['success' => false, 'message' => 'Type ou taille de fichier invalide'], 400);
        }
        $upload_dir = '../../Uploads/';
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
        $allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
        $max_size = 5 * 1024 * 1024; // 5MB
        if (!in_array($_FILES['cover_pic']['type'], $allowed_types) || $_FILES['cover_pic']['size'] > $max_size) {
            jsonResponse(['success' => false, 'message' => 'Type ou taille de fichier invalide'], 400);
        }
        $upload_dir = '../../Uploads/';
        if (!file_exists($upload_dir)) mkdir($upload_dir, 0777, true);
        $file_name = uniqid() . '_' . basename($_FILES['cover_pic']['name']);
        $target_file = $upload_dir . $file_name;
        if (move_uploaded_file($_FILES['cover_pic']['tmp_name'], $target_file)) {
            $cover_url = $target_file;
            $updateData['coverPic'] = $cover_url;
        }
    }

    $stmt = $pdo->prepare("
        UPDATE users 
        SET 
            firstname = :firstname,
            lastname = :lastname,
            birthdate = :birthdate,
            city = :city,
            profession = :profession,
            relationship_status = :relationship_status,
            username = :username,
            gender = :gender,
            country = :country,
            address = :address,
            avatar_url = :avatar_url,
            updated_at = NOW()
        WHERE id = :user_id
    ");
    $stmt->execute($updateData);

    $stmt = $pdo->prepare("SELECT id FROM profiles WHERE user_id = ?");
    $stmt->execute([$user->user_id]);
    $profileExists = $stmt->fetch();

    if ($profileExists) {
        $stmt = $pdo->prepare("
            UPDATE profiles 
            SET 
                bio = :bio,
                interests = :interests,
                avatar_url = :avatar_url,
                updated_at = NOW()
            WHERE user_id = :user_id
        ");
        $stmt->execute([
            'bio' => $updateData['bio'],
            'interests' => $updateData['interests'],
            'avatar_url' => $avatar_url ?? null,
            'user_id' => $user->user_id
        ]);
    } else {
        $stmt = $pdo->prepare("
            INSERT INTO profiles (user_id, bio, interests, avatar_url, created_at, updated_at) 
            VALUES (?, ?, ?, ?, NOW(), NOW())
        ");
        $stmt->execute([$user->user_id, $updateData['bio'], $updateData['interests'], $avatar_url ?? null]);
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

?>