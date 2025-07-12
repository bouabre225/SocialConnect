<?php

require_once '../config.php';
//toutees ces verifications tu devrais le faire avec le js directement 
//oui c'est la bas je gere ça ceci c'est , ce que Aurelle a envoyé elle a mis php partout a

//c'est pas du tout du spa ca inh | tu as fait quel api 
//dans le dossier user tout sauf profile et setting et en dehors tout sauf update_profile, verify_password, profile.php, settings.php, updatet e_profile.php et create_post en gros tout ce qui concerne le profil

//oui je modifie et je corrige au fur et a mesure mais il fautv que tu me donnes le code com
$currentUserId = $_SESSION['user_id'];
$profileUserId = isset($_GET['id']) ? (int)$_GET['id'] : $currentUserId;

// Obtenir les données utilisateur
$user = getUserData($profileUserId, $pdo);
if (!$user) {
    die("User not found");
}

function getUserData($userId, $pdo) {
    $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

// Verifier si on consulte son propre profil
$isOwnProfile = ($currentUserId == $profileUserId);

// Otenir les plublications de l'utilisateur
$stmt = $pdo->prepare("SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC");
$stmt->execute([$profileUserId]);
$posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Obtenir le nombre d'amis
$stmt = $pdo->prepare("SELECT COUNT(*) FROM friendships WHERE (user_id = ? OR friend_id = ?) AND status = 'accepted'");
$stmt->execute([$profileUserId, $profileUserId]);
$friendCount = $stmt->fetchColumn();

?>