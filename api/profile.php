<?php
require_once 'config.php';

session_start();
$user_id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : 1; 

try {
    
    $stmt = $pdo->prepare("
        SELECT 
            u.*, 
            p.bio,
            (SELECT COUNT(*) FROM posts WHERE user_id = u.id) AS post_count,
            (SELECT COUNT(*) FROM friends WHERE (user_id = u.id OR friend_id = u.id) AND status = 'accepted') AS friend_count,
            (SELECT COUNT(*) FROM posts WHERE user_id = u.id AND media_url IS NOT NULL) AS photo_count
        FROM users u 
        LEFT JOIN profiles p ON u.id = p.user_id
        WHERE u.id = ?
    ");
    $stmt->execute([$user_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        jsonResponse(['success' => false, 'message' => 'Utilisateur non trouvé'], 404);
    }

   
    $response = ['success' => true, 'user' => $user];

    if (isset($_GET['posts'])) {
        $stmt = $pdo->prepare("
            SELECT p.id, p.content, p.media_url, p.created_at, p.likes, u.firstname, u.lastname
            FROM posts p
            JOIN users u ON p.user_id = u.id
            WHERE p.user_id = ?
            ORDER BY p.created_at DESC
        ");
        $stmt->execute([$user_id]);
        $response['posts'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    if (isset($_GET['comments']) && isset($_GET['post_id'])) {
        $stmt = $pdo->prepare("
            SELECT c.id, c.content, c.created_at, c.parent_id, COUNT(l.id) as likes, u.firstname, u.lastname
            FROM comments c
            LEFT JOIN likes l ON l.comment_id = c.id
            JOIN users u ON c.user_id = u.id
            WHERE c.post_id = ?
            GROUP BY c.id, c.content, c.created_at, c.parent_id, u.firstname, u.lastname
        ");
        $stmt->execute([$_GET['post_id']]);
        $response['comments'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    if (isset($_GET['like']) && isset($_GET['post_id']) && $_SERVER['REQUEST_METHOD'] === 'POST') {
        $stmt = $pdo->prepare("
            INSERT INTO likes (user_id, post_id, created_at) 
            VALUES (?, ?, NOW())
            ON DUPLICATE KEY UPDATE created_at = NOW()
        ");
        $stmt->execute([$user_id, $_GET['post_id']]);
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM likes WHERE post_id = ?");
        $stmt->execute([$_GET['post_id']]);
        $response['success'] = true;
        $response['likes'] = $stmt->fetchColumn();
        jsonResponse($response);
        exit;
    }

    if (isset($_GET['like_comment']) && isset($_GET['comment_id']) && $_SERVER['REQUEST_METHOD'] === 'POST') {
        $stmt = $pdo->prepare("
            INSERT INTO likes (user_id, comment_id, created_at) 
            VALUES (?, ?, NOW())
            ON DUPLICATE KEY UPDATE created_at = NOW()
        ");
        $stmt->execute([$user_id, $_GET['comment_id']]);
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM likes WHERE comment_id = ?");
        $stmt->execute([$_GET['comment_id']]);
        $response['success'] = true;
        $response['likes'] = $stmt->fetchColumn();
        jsonResponse($response);
        exit;
    }

    if (isset($_GET['comment']) && $_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!empty($data['content'])) {
            $stmt = $pdo->prepare("
                INSERT INTO comments (post_id, user_id, content, created_at) 
                VALUES (?, ?, ?, NOW())
            ");
            $stmt->execute([$data['post_id'], $user_id, $data['content']]);
            $response['success'] = true;
        }
        jsonResponse($response);
        exit;
    }

    if (isset($_GET['reply']) && $_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!empty($data['content'])) {
            $stmt = $pdo->prepare("
                INSERT INTO comments (post_id, user_id, content, created_at, parent_id) 
                VALUES (?, ?, ?, NOW(), ?)
            ");
            $stmt->execute([$data['post_id'], $user_id, $data['content'], $data['comment_id']]);
            $response['success'] = true;
        }
        jsonResponse($response);
        exit;
    }

    jsonResponse($response);

} catch (PDOException $e) {
    jsonResponse(['success' => false, 'message' => 'Erreur de base de données: ' . $e->getMessage()], 500);
}

function jsonResponse($data, $status = 200) {
    header('Content-Type: application/json');
    http_response_code($status);
    echo json_encode($data);
    exit;
}