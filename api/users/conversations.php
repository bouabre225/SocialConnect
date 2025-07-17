<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require '../config.php';
require_once '../../api/users/common.php';

define('API', 'http://localhost:8000');

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: http://localhost:8000');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-CSRF-Token');
header('Access-Control-Allow-Credentials: true');
error_log("En-têtes CORS configurés");

// Gérer la requête OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    error_log("Requête OPTIONS reçue");
    http_response_code(200);
    exit();
}


$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents('php://input'), true);

$user = authentificateToken();


try{
    if ($method === 'GET' && !isset($_GET['conversation_id'])) {
        try {
            $user = authentificateToken();
            $stmt = $pdo->prepare('
                SELECT c.id, c.name, c.type,
                    (SELECT GROUP_CONCAT(u.username) 
                    FROM conversation_participants cp 
                    JOIN users u ON cp.user_id = u.id 
                    WHERE cp.conversation_id = c.id AND cp.user_id != ?) as participants,
                    m.content AS last_message,
                    m.created_at AS last_message_time,
                    (SELECT COUNT(*) FROM message_status ms WHERE ms.message_id IN (SELECT id FROM messages WHERE conversation_id = c.id) AND ms.user_id = ? AND ms.status = "delivered") AS unread_count,
                    (SELECT COUNT(*) FROM conversation_participants cp2 WHERE cp2.conversation_id = c.id AND cp2.user_id != ? AND cp2.online = 1) > 0 AS online
                FROM conversations c
                JOIN conversation_participants cp ON c.id = cp.conversation_id
                LEFT JOIN messages m ON m.id = c.last_message_id
                WHERE cp.user_id = ?
                ORDER BY m.created_at DESC
            ');
            $stmt->execute([$user->user_id, $user->user_id, $user->user_id, $user->user_id]);
            $conversations = $stmt->fetchAll(PDO::FETCH_ASSOC);
            jsonResponse(['status' => 'success', 'conversations' => $conversations]);
        } catch (Exception $e) {
            error_log("Erreur lors de la récupération des conversations: " . $e->getMessage());
            jsonResponse(['status' => 'error', 'message' => 'Erreur lors de la récupération des conversations'], 500);
        }
    } elseif ($method === 'GET' && isset($_GET['conversation_id'])) {
        try {
            $user = authentificateToken();
            $conversation_id = $_GET['conversation_id'];
            $stmt = $pdo->prepare('SELECT 1 FROM conversation_participants WHERE conversation_id = ? AND user_id = ?');
            $stmt->execute([$conversation_id, $user->user_id]);
            if (!$stmt->fetch()) {
                jsonResponse(['status' => 'error', 'message' => 'Accès non autorisé'], 403);
            }
    
            $stmt = $pdo->prepare('
                SELECT m.id, m.content, m.created_at, u.username, m.sender_id
                FROM messages m
                JOIN users u ON m.sender_id = u.id
                WHERE m.conversation_id = ?
                ORDER BY m.created_at ASC
            ');
            $stmt->execute([$conversation_id]);
            $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);
            jsonResponse(['status' => 'success', 'messages' => $messages]);
        } catch (Exception $e) {
            error_log("Erreur lors de la récupération des messages: " . $e->getMessage());
            jsonResponse(['status' => 'error', 'message' => 'Erreur lors de la récupération des messages'], 500);
        }
    } elseif ($method === 'POST' && !isset($_GET['conversation_id'])) {
        try {
            $user = authentificateToken();
            $data = json_decode(file_get_contents('php://input'), true);
            $type = $data['type'] ?? '';
            $name = $data['name'] ?? null;
            $participants = $data['participants'] ?? [];
    
            if (!in_array($type, ['private', 'group'])) {
                jsonResponse(['status' => 'error', 'message' => 'Type de conversation invalide'], 400);
            }
            if ($type === 'group' && empty($name)) {
                jsonResponse(['status' => 'error', 'message' => 'Nom du groupe requis'], 400);
            }
            if (empty($participants)) {
                jsonResponse(['status' => 'error', 'message' => 'Aucun participant sélectionné'], 400);
            }
            if ($type === 'private' && count($participants) !== 1) {
                jsonResponse(['status' => 'error', 'message' => 'Une conversation privée doit avoir exactement un participant'], 400);
            }
    
            // Vérifier que les participants existent
            $stmt = $pdo->prepare('SELECT id FROM users WHERE id IN (' . implode(',', array_fill(0, count($participants), '?')) . ') AND status = "active"');
            $stmt->execute($participants);
            $valid_participants = $stmt->fetchAll(PDO::FETCH_COLUMN);
            if (count($valid_participants) !== count($participants)) {
                jsonResponse(['status' => 'error', 'message' => 'Certains participants sont invalides'], 400);
            }
    
            // Ajouter l'utilisateur connecté comme participant
            $participants[] = $user->user_id;
    
            // Générer un nom par défaut pour les conversations privées
            if ($type === 'private') {
                $stmt = $pdo->prepare('SELECT username FROM users WHERE id = ?');
                $stmt->execute([$participants[0]]);
                $other_user = $stmt->fetch(PDO::FETCH_ASSOC);
                $stmt = $pdo->prepare('SELECT username FROM users WHERE id = ?');
                $stmt->execute([$user->user_id]);
                $current_user = $stmt->fetch(PDO::FETCH_ASSOC);
                if (!$other_user || !$current_user) {
                    jsonResponse(['status' => 'error', 'message' => 'Utilisateur introuvable'], 404);
                }
                $name = $current_user['username'] . ' - ' . $other_user['username'];
            }
    
            // Créer la conversation
            $pdo->beginTransaction();
            $stmt = $pdo->prepare('INSERT INTO conversations (type, name, created_at) VALUES (?, ?, NOW())');
            $stmt->execute([$type, $name]);
            $conversation_id = $pdo->lastInsertId();
    
            // Ajouter les participants
            $stmt = $pdo->prepare('INSERT INTO conversation_participants (conversation_id, user_id, online) VALUES (?, ?, ?)');
            foreach ($participants as $participant_id) {
                $online = $participant_id == $user->user_id ? 1 : 0;
                $stmt->execute([$conversation_id, $participant_id, $online]);
            }
    
            $pdo->commit();
            jsonResponse(['status' => 'success', 'conversation_id' => $conversation_id]);
        } catch (Exception $e) {
            $pdo->rollBack();
            error_log("Erreur lors de la création de la conversation: " . $e->getMessage());
            jsonResponse(['status' => 'error', 'message' => 'Erreur lors de la création de la conversation'], 500);
        }
    } elseif ($method === 'POST' && isset($_GET['conversation_id']) && isset($_GET['action']) && $_GET['action'] === 'mark-read') {
        try {
            $user = authentificateToken();
            $conversation_id = $_GET['conversation_id'];
            $stmt = $pdo->prepare('SELECT 1 FROM conversation_participants WHERE conversation_id = ? AND user_id = ?');
            $stmt->execute([$conversation_id, $user->user_id]);
            if (!$stmt->fetch()) {
                jsonResponse(['status' => 'error', 'message' => 'Accès non autorisé'], 403);
            }
    
            $stmt = $pdo->prepare('UPDATE message_status SET status = "read" WHERE user_id = ? AND message_id IN (SELECT id FROM messages WHERE conversation_id = ?)');
            $stmt->execute([$user->user_id, $conversation_id]);
            jsonResponse(['status' => 'success']);
        } catch (Exception $e) {
            error_log("Erreur lors du marquage des messages comme lus: " . $e->getMessage());
            jsonResponse(['status' => 'error', 'message' => 'Erreur lors du marquage des messages comme lus'], 500);
        }
    } else {
        jsonResponse(['status' => 'error', 'message' => 'Méthode ou paramètres non valides'], 405);
    }
    
    function jsonResponse($data, $statusCode = 200) {
        http_response_code($statusCode);
        echo json_encode($data);
        error_log("Réponse envoyée: " . json_encode($data));
        exit();
    }
} catch (Exception $e) {
    error_log("Erreur lors de la récupération des conversations: " . $e->getMessage());
    jsonResponse(['status' => 'error', 'message' => 'Erreur lors de la récupération des conversations'], 500);
}
?>