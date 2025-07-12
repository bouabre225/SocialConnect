<?php

require_once '../../api/users/common.php';

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