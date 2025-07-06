<?php
// Inclusion de la configuration
require_once 'config.php';

// Handle preflight (OPTIONS) request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    // Configuration des headers
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-CSRF-Token');
    header('Access-Control-Allow-Credentials: true');
    http_response_code(200);
    exit();
}

// Vérification de la méthode HTTP
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['status' => 'error', 'message' => 'Méthode non autorisée'], 405);
}

// Récupération des données
$data = json_decode(file_get_contents('php://input'), true);

// Validation des données
if (!isset($data['email'], $data['password'])) {
    jsonResponse(['status' => 'error', 'message' => 'Données manquantes'], 400);
}

// Validation de l'email
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    jsonResponse(['status' => 'error', 'message' => 'Email invalide'], 400);
}

// Sécurisation des données
$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$password = $data['password'];

// Vérification de l'utilisateur
try {
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? AND status = 'active'");
    $stmt->execute([$email]);
    
    if ($stmt->rowCount() === 1) {
        $user = $stmt->fetch();
        
        // Vérification du mot de passe
        if (password_verify($password, $user['password'])) {
            // Génération d'un token CSRF
            $csrf_token = bin2hex(random_bytes(32));
            
            // Mise à jour du token CSRF dans la base
            $pdo->prepare("UPDATE users SET csrf_token = ? WHERE id = ?")->execute([$csrf_token, $user['id']]);
            
            // Préparation des données de réponse
            $response = [
                'status' => 'success',
                'message' => 'Connexion réussie.',
                'user' => [
                    'id' => $user['id'],
                    'firstname' => htmlspecialchars($user['firstname']),
                    'lastname' => htmlspecialchars($user['lastname']),
                    'email' => $email,
                    'csrf_token' => $csrf_token
                ]
            ];
            
            jsonResponse($response, 200);
        }
    }
    
    jsonResponse(['status' => 'error', 'message' => 'Email ou mot de passe incorrect.'], 401);
} catch (PDOException $e) {
    error_log("Erreur de connexion: " . $e->getMessage());
    jsonResponse(['status' => 'error', 'message' => 'Erreur serveur'], 500);
}
