<?php
//update-profile.php
require_once '../../api/users/common.php';
require '../config.php';

// Configuration des en-têtes CORS
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: http://localhost:8000');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-CSRF-Token');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Max-Age: 86400');
error_log("En-têtes CORS configurés pour l'origine: http://localhost:8000");

// Gérer la requête OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    error_log("Requête OPTIONS reçue");
    http_response_code(200);
    exit();
}

try {
    // Vérifier le token JWT
    $decoded = authentificateToken();
    $userId = $decoded->data->user_id;

    // Vérifier le mot de passe
    $stmt = $pdo->prepare("SELECT password FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!password_verify($_POST['current_password'], $user['password'])) {
        ob_clean();
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Mot de passe incorrect']);
        exit;
    }

    // Gérer les fichiers
    $avatarUrl = null;
    $coverUrl = null;

    if (isset($_FILES['profile_pic']) && $_FILES['profile_pic']['error'] === UPLOAD_ERR_OK) {
        $fileInfo = handFileUpload($_FILES['profile_pic'], '../../Uploads/');
        $avatarUrl = $fileInfo['url'];
    }

    if (isset($_FILES['cover_pic']) && $_FILES['cover_pic']['error'] === UPLOAD_ERR_OK) {
        $fileInfo = handFileUpload($_FILES['cover_pic'], '../../Uploads/');
        $coverUrl = $fileInfo['url'];
    }

    // Mettre à jour le profil
    $stmt = $pdo->prepare("
        UPDATE profiles 
        SET 
            firstname = ?, 
            lastname = ?, 
            username = ?, 
            birthdate = ?, 
            city = ?, 
            profession = ?, 
            relationship_status = ?, 
            bio = ?, 
            interests = ?, 
            gender = ?, 
            country = ?, 
            address = ?,
            avatar_url = COALESCE(?, avatar_url),
            cover_url = COALESCE(?, cover_url)
        WHERE user_id = ?
    ");
    $stmt->execute([
        $_POST['firstname'] ?? '',
        $_POST['lastname'] ?? '',
        $_POST['username'] ?? '',
        $_POST['birthdate'] ?: null,
        $_POST['city'] ?? '',
        $_POST['profession'] ?? '',
        $_POST['relationship_status'] ?: null,
        $_POST['bio'] ?? '',
        $_POST['interests'] ?? '',
        $_POST['gender'] ?: null,
        $_POST['country'] ?? '',
        $_POST['address'] ?? '',
        $avatarUrl,
        $coverUrl,
        $userId
    ]);

    ob_clean();
    echo json_encode(['status' => 'success', 'message' => 'Profil mis à jour avec succès']);
} catch (Exception $e) {
    ob_clean();
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}








?>