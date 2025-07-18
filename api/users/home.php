<?php
require_once 'common.php';
require '../config.php';

// Gérer la requête OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    error_log("Requête OPTIONS reçue");
    http_response_code(200);
    exit();
}

//define('JWT_SECRET_KEY1', 'ta-cle-super-secrete'); //voila ce que j'ai fais 
//define('JWT_SECRET_KEY', 'ta-cle-super-secrete'); //voila ce que j'ai fais 

// Authentification du token
error_log("Début de l'authentification dans home.php");
try {
    // Vérifier le token JWT
    $user = authentificateToken();
    $user_id = $user->user_id;

    // Récupérer les informations de l'utilisateur, y compris le rôle
    $stmt = $pdo->prepare('SELECT id, username, firstname, lastname, role FROM users WHERE id = ?');
    $stmt->execute([$user_id]);
    $user_data = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user_data) {
        jsonResponse(['status' => 'error', 'message' => 'Utilisateur non trouvé'], 404);
    }

    // Vérifier que le rôle est défini
    if (empty($user_data['role'])) {
        error_log("Erreur: le rôle de l'utilisateur ID $user_id est vide");
        jsonResponse(['status' => 'error', 'message' => 'Rôle non défini'], 500);
    }

    jsonResponse([
        'status' => 'success',
        'user' => [
            'id' => $user_data['id'],
            'username' => $user_data['username'],
            'firstname' => $user_data['firstname'],
            'lastname' => $user_data['lastname'],
            'role' => $user_data['role'] // Assurez-vous que 'role' est inclus
        ]
    ]);
} catch (Exception $e) {
    error_log("Erreur dans home.php: " . $e->getMessage());
    jsonResponse(['status' => 'error', 'message' => 'Erreur serveur: ' . $e->getMessage()], 500);
}

function jsonResponse($data, $status = 200) {
    header('Content-Type: application/json');
    http_response_code($status);
    echo json_encode($data);
    exit;
}
?>