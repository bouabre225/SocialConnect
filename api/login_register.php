<?php
//ajout de l'entete de la reponse
header('Content-Type: application/json');

//inclusion de la base de données
include 'config.php';

//recuperation de la reponse
$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['firstname'], $data['lastname'], $data['email'], $data['password'])) {
    $firstname = htmlspecialchars($data['firstname']);
    $lastname = htmlspecialchars($data['lastname']);
    $email = htmlspecialchars($data['email']);
    $password = password_hash($data['password'], PASSWORD_DEFAULT);

    // Vérifie si l'email existe déjà
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(['status' => 'error', 'message' => 'Email déjà utilisé.']);
        exit;
    }

    // Insertion
    $insert = $pdo->prepare("INSERT INTO users (firstname, lastname, email, password) VALUES (?, ?, ?, ?)");
    $insert->execute([$firstname, $lastname, $email, $password]);

    //TODO : Envoi email HTML de confirmation ici (hook disponible)
    $subject = "Confirmation d'inscription - SocialConnect";
    $to = $email;
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type:text/html; charset=UTF-8\r\n";
    $headers .= "From: no-reply@socialconnect.com\r\n";

    // Contenu HTML de l'email
    $message = "
    <html>
    <head>
    <title>Confirmation d'inscription</title>
    </head>
    <body>
    <h2>Bienvenue $firstname !</h2>
    <p>Merci de vous être inscrit sur SocialConnect.</p>
    <p>Vous pouvez maintenant vous connecter et rejoindre vos amis.</p>
    <br>
    <a href='https://tonsite.infinityfreeapp.com/vues/clients/login.html' style='
        padding: 10px 20px;
        background-color: #007bff;
        color: #fff;
        text-decoration: none;
        border-radius: 5px;'>Se connecter</a>
    </body>
    </html>
    ";
    
// Envoi de l'email
mail($to, $subject, $message, $headers);


    echo json_encode(['status' => 'success', 'message' => 'Inscription réussie.']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Données incomplètes.']);
}

?>