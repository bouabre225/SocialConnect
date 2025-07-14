<?php
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

require_once '../config.php';
require_once '../../vendor/autoload.php'; // Composer pour JWT

class Chat implements MessageComponentInterface {
    protected $clients;
    protected $pdo;

    public function __construct() {
        $this->clients = new \SplObjectStorage;
        global $pdo;
        $this->pdo = $pdo;
    }

    public function onOpen(ConnectionInterface $conn) {
        $this->clients->attach($conn);
        echo "Nouvelle connexion : {$conn->resourceId}\n";
    }

    public function onMessage(ConnectionInterface $from, $msg) {
        $data = json_decode($msg, true);
        if (!isset($data['token']) || !isset($data['conversation_id']) || !isset($data['content'])) {
            return;
        }

        // Vérifier le token JWT
        $secretKey = 'JWT_SECRET_KEY';
        try {
            $decoded = \Firebase\JWT\JWT::decode($data['token'], new \Firebase\JWT\Key($secretKey, 'HS256'));
            $user_id = $decoded->user_id;

            // Vérifier si l'utilisateur est dans la conversation
            $stmt = $this->pdo->prepare('SELECT 1 FROM conversation_participants WHERE conversation_id = ? AND user_id = ?');
            $stmt->execute([$data['conversation_id'], $user_id]);
            if (!$stmt->fetch()) {
                return;
            }

            // Insérer le message
            $stmt = $this->pdo->prepare('INSERT INTO messages (conversation_id, sender_id, content, media_type) VALUES (?, ?, ?, ?)');
            $stmt->execute([$data['conversation_id'], $user_id, $data['content'], 'text']);
            $message_id = $this->pdo->lastInsertId();

            // Mettre à jour le statut pour tous les participants
            $stmt = $this->pdo->prepare('SELECT user_id FROM conversation_participants WHERE conversation_id = ?');
            $stmt->execute([$data['conversation_id']]);
            $participants = $stmt->fetchAll(PDO::FETCH_COLUMN);
            foreach ($participants as $participant_id) {
                $status = $participant_id == $user_id ? 'sent' : 'delivered';
                $stmt = $this->pdo->prepare('INSERT INTO message_status (message_id, user_id, status) VALUES (?, ?, ?)');
                $stmt->execute([$message_id, $participant_id, $status]);
            }

            // Récupérer les détails du message
            $stmt = $this->pdo->prepare('
                SELECT m.id, m.content, m.created_at, u.username, u.avatar_url  
                FROM messages m
                JOIN users u ON m.sender_id = u.id
                WHERE m.id = ?
            ');
            $stmt->execute([$message_id]);
            $message = $stmt->fetch(PDO::FETCH_ASSOC);

            // Envoyer le message à tous les participants connectés
            foreach ($this->clients as $client) {
                if ($client !== $from) {
                    $client->send(json_encode([
                        'status' => 'success',
                        'message' => $message,
                        'conversation_id' => $data['conversation_id']
                    ]));
                }
            }
        } catch (Exception $e) {
            $from->send(json_encode(['status' => 'error', 'message' => 'Token invalide']));
        }
    }

    public function onClose(ConnectionInterface $conn) {
        $this->clients->detach($conn);
        echo "Connexion fermée : {$conn->resourceId}\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "Erreur : {$e->getMessage()}\n";
        $conn->close();
    }
}

$server = \Ratchet\Server\IoServer::factory(
    new \Ratchet\Http\HttpServer(
        new \Ratchet\WebSocket\WsServer(
            new Chat()
        )
    ),
    8080
);
$server->run();





?>