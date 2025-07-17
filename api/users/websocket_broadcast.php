<?php 
require_once '../config.php';
require_once '../../vendor/autoload.php';

use Ratchet\Client\WebSocket;
use React\EventLoop\Loop;

function broadcastMessage($conversation_id, $message) {
    global $pdo;

    try {
        // Récupérer l'EventLoop
        $loop = Loop::get();

        // Connect to WebSocket server
        \Ratchet\Client\connect('ws://127.0.0.1:8002', [], [], $loop)->then(
            function(WebSocket $conn) use ($conversation_id, $message) {
                // Send message
                $conn->send(json_encode($message));
                $conn->close();
                error_log("WebSocket message sent for conversation_id: $conversation_id");
            },
            function (\Exception $e) {
                error_log("WebSocket connection error: {$e->getMessage()}");
            }
        );

        // Run the event loop
        $loop->run();
    } catch (\Exception $e) {
        error_log("Error in broadcastMessage: {$e->getMessage()}");
    }
}
?>