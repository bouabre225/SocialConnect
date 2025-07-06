<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-CSRF-Token');
    header('Access-Control-Allow-Credentials: true');
    http_response_code(200);
    exit();
}

try {
    require_once 'config.php';
    require_once 'config/phpmailer.php';
    require '../vendor/phpmailer/phpmailer/src/Exception.php';
    require '../vendor/phpmailer/phpmailer/src/PHPMailer.php';
    require '../vendor/phpmailer/phpmailer/src/SMTP.php';

    $data = json_decode(file_get_contents('php://input'), true);
    if (!isset($data['email'])) {
        echo json_encode(['status' => 'error', 'message' => 'Adresse e-mail requise.']);
        exit;
    }

    $email = htmlspecialchars($data['email'], ENT_QUOTES, 'UTF-8');

    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);

    if ($stmt->rowCount() !== 1) {
        echo json_encode(['status' => 'error', 'message' => 'Aucun utilisateur trouvé avec cet e-mail.']);
        exit;
    }

    $reset_token = bin2hex(random_bytes(32));

    $update = $pdo->prepare("UPDATE users SET reset_token = ?, reset_token_expire = DATE_ADD(NOW(), INTERVAL 30 MINUTE) WHERE email = ?");
    $update->execute([$reset_token, $email]);

    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host       = $phpmailer_config['host'];
    $mail->SMTPAuth   = $phpmailer_config['smtp_auth'];
    $mail->Username   = $phpmailer_config['username'];
    $mail->Password   = $phpmailer_config['password'];
    $mail->SMTPSecure = $phpmailer_config['smtp_secure'];
    $mail->Port       = $phpmailer_config['port'];

    $mail->setFrom($phpmailer_config['from_email'], $phpmailer_config['from_name']);
    $mail->addAddress($email);

    $mail->isHTML(true);
    $mail->CharSet = 'UTF-8';
    $mail->Subject = 'Réinitialisation de votre mot de passe - SocialConnect';

    $reset_link = "http://localhost/ReseauSocial/vues/clients/reset_password.html?token=$reset_token";
    $mail->Body = "
        <h2>Réinitialisation de mot de passe</h2>
        <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous :</p>
        <p style='margin:20px 0;'>
            <a href='$reset_link' style='display:inline-block;padding:12px 24px;background-color:#007bff;color:#fff;text-decoration:none;border-radius:5px;'>Réinitialiser mon mot de passe</a>
        </p>
        <p>Ce lien expirera dans 30 minutes.</p>
        <p>Si vous n'avez pas fait cette demande, ignorez cet email.</p>
        <br>
        <p>L'équipe SocialConnect</p>
    ";

    $mail->send();

    echo json_encode(['status' => 'success', 'message' => 'Un email de réinitialisation vous a été envoyé.']);
} catch (Exception $e) {
    error_log("Erreur : " . $e->getMessage());
    echo json_encode(['status' => 'error', 'message' => 'Erreur serveur : ' . $e->getMessage()]);
}
?>
