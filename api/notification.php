<?php
require_once 'config.php';

// Vérifier la méthode de la requête
$method = $_SERVER['REQUEST_METHOD'];

// Traitement des requêtes GET
if ($method === 'GET' && isset($_GET['action'])) {
    $action = $_GET['action'];
    $filter = $_GET['filter'] ?? 'all';
    
    if ($action === 'get') {
        // Dans une application réelle, vous auriez un système d'authentification
        // et vous récupéreriez l'ID de l'utilisateur connecté
        $user_id = 1; // Temporaire - à remplacer par l'utilisateur connecté
        
        try {
            $query = "SELECT * FROM notifications WHERE user_id = :user_id";
            
            if ($filter === 'unread') {
                $query .= " AND is_read = 0";
            }
            
            $query .= " ORDER BY created_at DESC";
            
            $stmt = $pdo->prepare($query);
            $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
            $stmt->execute();
            
            $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            jsonResponse([
                'status' => 'success',
                'notifications' => $notifications
            ]);
            
        } catch (PDOException $e) {
            jsonResponse([
                'status' => 'error',
                'message' => 'Erreur lors de la récupération des notifications'
            ], 500);
        }
    }
}

// Traitement des requêtes POST
if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $action = $data['action'] ?? '';
    
    if ($action === 'mark_read' && isset($data['notification_id'])) {
        $notification_id = $data['notification_id'];
        
        try {
            $stmt = $pdo->prepare("UPDATE notifications SET is_read = 1 WHERE id = :id");
            $stmt->bindParam(':id', $notification_id, PDO::PARAM_INT);
            $stmt->execute();
            
            jsonResponse([
                'status' => 'success',
                'message' => 'Notification marquée comme lue'
            ]);
            
        } catch (PDOException $e) {
            jsonResponse([
                'status' => 'error',
                'message' => 'Erreur lors de la mise à jour de la notification'
            ], 500);
        }
    }
    
    if ($action === 'mark_all_read') {
        $user_id = 1; // Temporaire - à remplacer par l'utilisateur connecté
        
        try {
            $stmt = $pdo->prepare("UPDATE notifications SET is_read = 1 WHERE user_id = :user_id");
            $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
            $stmt->execute();
            
            jsonResponse([
                'status' => 'success',
                'message' => 'Toutes les notifications marquées comme lues'
            ]);
            
        } catch (PDOException $e) {
            jsonResponse([
                'status' => 'error',
                'message' => 'Erreur lors de la mise à jour des notifications'
            ], 500);
        }
    }
}

// Si aucune action valide n'est trouvée
jsonResponse([
    'status' => 'error',
    'message' => 'Action non valide'
], 400);