<?php
//websocket.php 
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
        echo "Serveur WebSocket démarré\n";
    }

    public function onOpen(ConnectionInterface $conn) {
        $this->clients->attach($conn);
        echo "Nouvelle connexion : {$conn->resourceId}\n";
    }

    public function onMessage(ConnectionInterface $from, $msg) {
        try {
            $data = json_decode($msg, true);
            if (!$data || !isset($data['action']) || !isset($data['conversation_id']) || !isset($data['message'])) {
                return;
            }

            if ($data['action'] === 'message') {
                $conversation_id = $data['conversation_id'];
                $message = $data['message'];

                // Vérifier les participants de la conversation
                $stmt = $this->pdo->prepare('SELECT user_id FROM conversation_participants WHERE conversation_id = ?');
                $stmt->execute([$conversation_id]);
                $participants = $stmt->fetchAll(PDO::FETCH_COLUMN);

                // Diffuser le message à tous les participants connectés (sauf l'expéditeur)
                foreach ($this->clients as $client) {
                    $stmt = $this->pdo->prepare('SELECT 1 FROM conversation_participants WHERE conversation_id = ? AND user_id = ?');
                    $stmt->execute([$conversation_id, $client->user_id ?? 0]);
                    if ($stmt->fetch() && $client !== $from) {
                        $client->send(json_encode([
                            'status' => 'success',
                            'action' => 'message',
                            'conversation_id' => $conversation_id,
                            'message' => $message
                        ]));
                    }
                }
            }
        } catch (Exception $e) {
            error_log("Erreur WebSocket: " . $e->getMessage());
            $from->send(json_encode(['status' => 'error', 'message' => 'Erreur lors du traitement du message']));
        }
    }

    public function onClose(ConnectionInterface $conn) {
        $this->clients->detach($conn);
        echo "Connexion fermée : {$conn->resourceId}\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        error_log("Erreur WebSocket: {$e->getMessage()}");
        $conn->close();
    }
}

$server = \Ratchet\Server\IoServer::factory(
    new \Ratchet\Http\HttpServer(
        new \Ratchet\WebSocket\WsServer(
            new Chat()
        )
    ),
    8002
);

$server->run();

?>