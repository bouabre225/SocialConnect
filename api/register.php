<?php
    // Utilisation de PHPMailer
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;
    use PHPMailer\PHPMailer\SMTP;

    // Inclusion des fichiers de configuration
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

    // Configuration PHPMailer
    require_once 'config/phpmailer.php';

    //include 'vendor/autoload.php';
    require '../vendor/phpmailer/phpmailer/src/Exception.php';
    require '../vendor/phpmailer/phpmailer/src/PHPMailer.php';
    require '../vendor/phpmailer/phpmailer/src/SMTP.php';

    // Vérification de la méthode HTTP
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        jsonResponse(['status' => 'error', 'message' => 'Méthode non autorisée'], 405);
    }

    // Récupération des données
    $data = json_decode(file_get_contents('php://input'), true);

    // Validation des données
    if (!isset($data['firstname'], $data['lastname'], $data['email'], $data['password'], $data['confirm_password'])) {
        jsonResponse(['status' => 'error', 'message' => 'Données manquantes'], 400);
    }

    // Validation des noms
    if (!preg_match("/^[À-ſa-zA-Z\s]+$/u", $data['firstname']) || !preg_match("/^[À-ſa-zA-Z\s]+$/u", $data['lastname'])) {
        jsonResponse(['status' => 'error', 'message' => 'Les noms ne sont pas valides'], 400);
    }

    // Validation de l'email
    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        jsonResponse(['status' => 'error', 'message' => 'Email invalide'], 400);
    }

    // Validation du mot de passe
    if (strlen($data['password']) < 8 || strlen($data['password']) > 72) {
        jsonResponse(['status' => 'error', 'message' => 'Le mot de passe doit contenir entre 8 et 72 caractères'], 400);
    }

    if ($data['password'] !== $data['confirm_password']) {
        jsonResponse(['status' => 'error', 'message' => 'Les mots de passe ne correspondent pas'], 400);
    }

    // Sécurisation des données
    $firstname = htmlspecialchars($data['firstname'], ENT_QUOTES, 'UTF-8');
    $lastname = htmlspecialchars($data['lastname'], ENT_QUOTES, 'UTF-8'); 
    $email = htmlspecialchars($data['email'], ENT_QUOTES, 'UTF-8');
    $password = $data['password'];

    // Génération de variables pour l'inscription
    $csrf_token = bin2hex(random_bytes(32));
    $activation_token = bin2hex(random_bytes(32));
    //$activation_link = "http://localhost/ReseauSocial/index.html?token=" . $activation_token;

    try {
        // Vérification de l'email
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        
        if ($stmt->rowCount() > 0) {
            jsonResponse(['status' => 'error', 'message' => 'Email déjà utilisé'], 400);
        }
        
        // Hash du mot de passe
        $password_hash = password_hash($password, PASSWORD_DEFAULT);
        
        // Insertion de l'utilisateur
        $insert = $pdo->prepare("
            INSERT INTO users 
            (firstname, lastname, email, password, csrf_token, activation_token, status) 
            VALUES (?, ?, ?, ?, ?, ?, 'pending')
        ");
        $insert->execute([$firstname, $lastname, $email, $password_hash, $csrf_token, $activation_token]);
        

        // Envoi de l'email de confirmation
        try {
            $mail = new PHPMailer();
            $mail->SMTPDebug = SMTP::DEBUG_SERVER; // Décommentez pour le débogage: 2;
            
            // Configuration serveur
            $mail->isSMTP();
            $mail->Host = $phpmailer_config['host'];
            $mail->SMTPAuth = $phpmailer_config['smtp_auth'];
            $mail->Username = $phpmailer_config['username'];
            $mail->Password = $phpmailer_config['password'];
            $mail->SMTPSecure = $phpmailer_config['smtp_secure'];
            $mail->Port = $phpmailer_config['port'];

            // Expéditeur
            $mail->setFrom($phpmailer_config['from_email'], $phpmailer_config['from_name']);
            
            // Destinataire
            $mail->addAddress($email);
            
            // Contenu
            $mail->isHTML(true);
            $activation_link = "http://localhost/ReseauSocial/api/activate.php?token=" . $activation_token;
            $mail->CharSet = 'UTF-8';
            $mail->Encoding = 'base64';
            $mail->Subject = "Confirmation d'inscription - SocialConnect";
            $mail->Body = "
            <html>
            <head>
            <title>Confirmation d'inscription</title>
            </head>
            <body style='font-family: Arial, sans-serif; line-height: 1.6;'>
            <div style='max-width: 600px; margin: 0 auto; padding: 20px;'>
                <h2 style='color: #333;'>Bienvenue sur SocialConnect !</h2>
                <p style='color: #666;'>Merci de vous être inscrit. Pour activer votre compte, veuillez cliquer sur le lien suivant :</p>
                <p style='margin: 20px 0;'><a href='" . $activation_link . "' style='display: inline-block; padding: 12px 24px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;'>Activer mon compte</a></p>
                <p style='color: #666;'>Cordialement,</p>
                <p style='color: #666;'>L'équipe SocialConnect</p>
            </div>
            </body>
            </html>
            ";
            
            // Envoi de l'email
            if(!$mail->send()) {
                error_log("Erreur d'envoi de l'email: " . $mail->ErrorInfo);
            }
        } catch (Exception $e) {
            // En cas d'échec de l'envoi, on continue quand même l'inscription
            error_log("Erreur d'envoi de l'email: " . $e->getMessage());
        }


        echo json_encode(['status' => 'success', 'message' => 'Inscription réussie.']);
    } catch (Exception $e) {
        error_log("Erreur d'inscription: " . $e->getMessage());
        echo json_encode(['status' => 'error', 'message' => 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.']);
    }

?>