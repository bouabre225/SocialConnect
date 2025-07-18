<?php
// Suppress error output to prevent HTML in JSON response
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(E_ALL);

require '../config.php';
require_once '../../api/users/common.php';
require_once '../../vendor/autoload.php';
require '../config/phpmailer.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;


// Handle OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    error_log("Requête OPTIONS reçue");
    http_response_code(200);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents('php://input'), true);

try {
    $user = authentificateToken();
} catch (Exception $e) {
    jsonResponse(['status' => 'error', 'message' => 'Authentification échouée: ' . $e->getMessage()], 401);
}

if ($method === 'GET') {
    $conversation_id = $_GET['conversation_id'] ?? null;
    if (!$conversation_id) {
        jsonResponse(['status' => 'error', 'message' => 'ID de conversation requis'], 400);
    }
    try {
        $stmt = $pdo->prepare('
            SELECT m.id, m.content, m.media_url, m.media_type, m.created_at, 
                u.username, u.avatar_url,
                (SELECT status FROM message_status ms WHERE ms.message_id = m.id AND ms.user_id = ?) as status
            FROM messages m
            JOIN users u ON m.sender_id = u.id
            WHERE m.conversation_id = ?
            ORDER BY m.created_at ASC
            LIMIT 50
        ');
        $stmt->execute([$user->user_id, $conversation_id]);
        $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);
        jsonResponse(['status' => 'success', 'messages' => $messages]);
    } catch (Exception $e) {
        error_log("Erreur lors de la récupération des messages: " . $e->getMessage());
        jsonResponse(['status' => 'error', 'message' => 'Erreur lors de la récupération des messages'], 500);
    }
} elseif ($method === 'POST' && !isset($_GET['action'])) {
    $conversation_id = $_GET['conversation_id'] ?? null;
    $content = $data['content'] ?? null;
    if (!$conversation_id || !$content) {
        jsonResponse(['status' => 'error', 'message' => 'Conversation ID et contenu requis'], 400);
    }
    try {
        // Check if user is in the conversation
        $stmt = $pdo->prepare('SELECT 1 FROM conversation_participants WHERE conversation_id = ? AND user_id = ?');
        $stmt->execute([$conversation_id, $user->user_id]);
        if (!$stmt->fetch()) {
            jsonResponse(['status' => 'error', 'message' => 'Utilisateur non autorisé dans cette conversation'], 403);
        }

        // Get conversation participants (excluding sender)
        $stmt = $pdo->prepare('SELECT u.id, u.email, u.username FROM conversation_participants cp JOIN users u ON cp.user_id = u.id WHERE cp.conversation_id = ? AND cp.user_id != ?');
        $stmt->execute([$conversation_id, $user->user_id]);
        $participants = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Get sender's username
        $stmt = $pdo->prepare('SELECT username FROM users WHERE id = ?');
        $stmt->execute([$user->user_id]);
        $sender = $stmt->fetch(PDO::FETCH_ASSOC);
        $sender_username = $sender['username'];

        // Insert message
        $pdo->beginTransaction();
        $stmt = $pdo->prepare('INSERT INTO messages (conversation_id, sender_id, content, media_type, created_at) VALUES (?, ?, ?, ?, NOW())');
        $stmt->execute([$conversation_id, $user->user_id, $content, 'text']);
        $message_id = $pdo->lastInsertId();

        // Insert status for all participants
        $stmt = $pdo->prepare('INSERT INTO message_status (message_id, user_id, status) VALUES (?, ?, ?)');
        foreach ($participants as $participant) {
            $stmt->execute([$message_id, $participant['id'], 'delivered']);
        }
        $stmt->execute([$message_id, $user->user_id, 'sent']);

        // Update conversation's last message
        $stmt = $pdo->prepare('UPDATE conversations SET last_message_id = ? WHERE id = ?');
        $stmt->execute([$message_id, $conversation_id]);

        // Get message details for WebSocket
        $stmt = $pdo->prepare('
            SELECT m.id, m.content, m.created_at, u.username, u.avatar_url, m.sender_id
            FROM messages m
            JOIN users u ON m.sender_id = u.id
            WHERE m.id = ?
        ');
        $stmt->execute([$message_id]);
        $message = $stmt->fetch(PDO::FETCH_ASSOC);

        $pdo->commit();

       /* // Send email notification with PHPMailer
        $mail = new PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host = $phpmailer_config['host'];
            $mail->SMTPAuth = $phpmailer_config['smtp_auth'];
            $mail->Username = $phpmailer_config['username'];
            $mail->Password = $phpmailer_config['password'];
            $mail->SMTPSecure = $phpmailer_config['smtp_secure'];
            $mail->Port = $phpmailer_config['port'];

            $mail->setFrom($phpmailer_config['from_email'], $phpmailer_config['from_name']);
            $mail->isHTML(false);

            foreach ($participants as $participant) {
                if (!empty($participant['email'])) {
                    $mail->addAddress($participant['email'], $participant['username']);
                    $mail->Subject = 'Nouveau message dans la conversation';
                    $mail->Body = "Vous avez reçu un nouveau message de {$sender_username} :\n\n{$content}\n\nConnectez-vous à http://localhost:8000/chat pour répondre.";
                    if (!$mail->send()) {
                        error_log("Échec de l'envoi de l'e-mail à {$participant['email']}: " . $mail->ErrorInfo);
                    } else {
                        error_log("E-mail envoyé à {$participant['email']}");
                    }
                    $mail->clearAddresses();
                }
            }
        } catch (Exception $e) {
            error_log("Erreur PHPMailer: {$e->getMessage()}");
        }*/

        // Broadcast via WebSocket
        try {
            if (file_exists('websocket_broadcast.php')) {
                require_once 'websocket_broadcast.php';
                broadcastMessage($conversation_id, [
                    'status' => 'success',
                    'action' => 'message',
                    'conversation_id' => $conversation_id,
                    'message' => $message
                ]);
            }
        } catch (Exception $e) {
            error_log("Erreur lors de la diffusion WebSocket: {$e->getMessage()}");
        }

        jsonResponse(['status' => 'success', 'message_id' => $message_id], 201);
    } catch (Exception $e) {
        $pdo->rollBack();
        error_log("Erreur lors de l'envoi du message: " . $e->getMessage());
        jsonResponse(['status' => 'error', 'message' => 'Erreur lors de l\'envoi du message'], 500);
    }
} elseif ($method === 'POST' && isset($_GET['action']) && $_GET['action'] === 'mark-read') {
    try {
        $conversation_id = $_GET['conversation_id'] ?? null;
        if (!$conversation_id) {
            jsonResponse(['status' => 'error', 'message' => 'ID de conversation requis'], 400);
        }
        $stmt = $pdo->prepare('SELECT 1 FROM conversation_participants WHERE conversation_id = ? AND user_id = ?');
        $stmt->execute([$conversation_id, $user->user_id]);
        if (!$stmt->fetch()) {
            jsonResponse(['status' => 'error', 'message' => 'Utilisateur non autorisé dans cette conversation'], 403);
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
?>