<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

// Définition de l'origine autorisée
define('API', 'https://endearing-strudel-046558.netlify.app');

// Configuration des en-têtes CORS
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: ' . API);
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-CSRF-Token');
header('Access-Control-Allow-Credentials: true');

// Gérer la requête OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    require_once 'config.php';
    require_once 'config/phpmailer.php';
    require '../vendor/phpmailer/phpmailer/src/Exception.php';
    require '../vendor/phpmailer/phpmailer/src/PHPMailer.php';
    require '../vendor/phpmailer/phpmailer/src/SMTP.php';

    // Récupération des données
    $data = json_decode(file_get_contents('php://input'), true);
    if (!isset($data['email'])) {
        jsonResponse(['status' => 'error', 'message' => 'Adresse e-mail requise.'], 400);
    }

    $email = htmlspecialchars($data['email'], ENT_QUOTES, 'UTF-8');

    // Vérification de l'existence de l'utilisateur
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);

    if ($stmt->rowCount() !== 1) {
        jsonResponse(['status' => 'error', 'message' => 'Aucun utilisateur trouvé avec cet e-mail.'], 404);
    }

    // Génération du token de réinitialisation
    $reset_token = bin2hex(random_bytes(32));

    // Mise à jour du token dans la base de données
    $update = $pdo->prepare("UPDATE users SET reset_token = ?, reset_token_expire = DATE_ADD(NOW(), INTERVAL 30 MINUTE) WHERE email = ?");
    $update->execute([$reset_token, $email]);

    // Configuration de l'email
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = $phpmailer_config['host'];
    $mail->SMTPAuth = $phpmailer_config['smtp_auth'];
    $mail->Username = $phpmailer_config['username'];
    $mail->Password = $phpmailer_config['password'];
    $mail->SMTPSecure = $phpmailer_config['smtp_secure'];
    $mail->Port = $phpmailer_config['port'];

    $mail->setFrom($phpmailer_config['from_email'], $phpmailer_config['from_name']);
    $mail->addAddress($email);

    $mail->isHTML(true);
    $mail->CharSet = 'UTF-8';
    $mail->Subject = 'Réinitialisation de votre mot de passe - SocialConnect';

    $reset_link = "http://localhost:8000/reset?token=$reset_token";
    $mail->Body = "
        <html>
        <head>
        <title>Réinitialisation de mot de passe</title>
        </head>
        <body style='font-family: Arial, sans-serif; line-height: 1.6;'>
        <div style='max-width: 600px; margin: 0 auto; padding: 20px;'>
            <h2>Réinitialisation de mot de passe</h2>
            <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous :</p>
            <p style='margin: 20px 0;'>
                <a href='$reset_link' style='display:inline-block;padding:12px 24px;background-color:#007bff;color:#fff;text-decoration:none;border-radius:5px;'>Réinitialiser mon mot de passe</a>
            </p>
            <p>Ce lien expirera dans 30 minutes.</p>
            <p>Si vous n'avez pas fait cette demande, ignorez cet email.</p>
            <br>
            <p>L'équipe SocialConnect</p>
        </div>
        </body>
        </html>
    ";

    // Envoi de l'email
    $mail->send();

    jsonResponse(['status' => 'success', 'message' => 'Un email de réinitialisation vous a été envoyé.'], 200);
} catch (Exception $e) {
    error_log("Erreur : " . $e->getMessage());
    jsonResponse(['status' => 'error', 'message' => 'Erreur serveur : ' . $e->getMessage()], 500);
}

// Fonction pour envoyer une réponse JSON
function jsonResponse($data, $statusCode) {
    http_response_code($statusCode);
    echo json_encode($data);
    exit();
}
?>