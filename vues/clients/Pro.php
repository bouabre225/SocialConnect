
<?php

require_once 'C:\xampp\htdocs\SocialConnect\api\config.php';

// Verifier si l'utilisateur est connecté
if (!isset($_SESSION['user_id'])) {
    header('Location: C:\xampp\htdocs\SocialConnect\api\login.php');
    exit;
}

$currentUserId = $_SESSION['user_id'];
$profileUserId = isset($_GET['id']) ? (int)$_GET['id'] : $currentUserId;

// Obtenir les données utilisateur
$user = getUserData($profileUserId, $pdo);
if (!$user) {
    die("User not found");
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