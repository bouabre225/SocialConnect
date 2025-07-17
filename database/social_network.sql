-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : lun. 14 juil. 2025 à 20:17
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `social_network`
--

-- --------------------------------------------------------

--
-- Structure de la table `comments`
--

CREATE TABLE `comments` (
  `id` bigint(20) NOT NULL,
  `post_id` bigint(20) NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `content` text NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `comments`
--

INSERT INTO `comments` (`id`, `post_id`, `user_id`, `content`, `created_at`) VALUES
(1, 1, 2, 'Wow, super motivant ! Quel projet travailles-tu ?', '2024-07-08 08:15:00'),
(2, 1, 3, 'Belle photo du lever de soleil !', '2024-07-08 08:20:00'),
(3, 2, 1, 'Magnifique lumière, Marie !', '2024-07-08 09:45:00'),
(4, 2, 4, 'J’adore tes photos, continue !', '2024-07-08 10:00:00'),
(5, 5, 6, 'Impressionnant ! Tu m’inspires à bouger !', '2024-07-08 12:45:00'),
(6, 6, 7, 'Miam, j’ai hâte de tester cette recette !', '2024-07-08 13:30:00'),
(7, 9, 10, 'Quel jeu vas-tu streamer ? Je serai là !', '2024-07-08 16:20:00'),
(8, 10, 8, 'Ta toile est incroyable, quelle inspiration !', '2024-07-08 17:50:00'),
(9, 12, 5, 'Ça a l’air tellement relaxant !', '2024-07-08 19:15:00'),
(10, 15, 2, 'Félicitations pour ton record, Mike !', '2024-07-09 10:30:00'),
(11, 15, 63, 'uuyuuy', '2025-07-14 12:22:49'),
(12, 15, 63, 'jkghuj', '2025-07-14 12:25:32'),
(13, 14, 63, 'felicitation', '2025-07-14 12:25:39'),
(14, 14, 63, 'c\'est bon non', '2025-07-14 12:26:02'),
(15, 14, 63, 'Il reste quoi ??', '2025-07-14 12:26:26'),
(16, 17, 63, 'et l\'image?', '2025-07-14 12:44:57'),
(17, 17, 63, 'je vais voir', '2025-07-14 12:45:09'),
(18, 21, 63, 'f\'e\"\"t', '2025-07-14 12:55:56'),
(19, 21, 63, 'ez', '2025-07-14 12:56:01'),
(20, 21, 63, 'c;est bon', '2025-07-14 12:59:09'),
(21, 21, 63, 'C\'est dohiii', '2025-07-14 12:59:34'),
(22, 23, 63, 'iu', '2025-07-14 13:32:17');

-- --------------------------------------------------------

--
-- Structure de la table `conversations`
--

CREATE TABLE `conversations` (
  `id` int(10) UNSIGNED NOT NULL,
  `type` enum('private','group') NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_message_id` int(10) UNSIGNED DEFAULT NULL,
  `last_message_time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `conversations`
--

INSERT INTO `conversations` (`id`, `type`, `name`, `created_at`, `last_message_id`, `last_message_time`) VALUES
(1, 'private', 'john_doe,rycus', '2024-07-08 08:00:00', 3, '2025-07-14 18:58:29'),
(2, 'group', 'Amis Parisiens', '2024-07-08 09:00:00', NULL, NULL),
(3, 'private', NULL, '2024-07-08 10:00:00', NULL, NULL),
(4, 'group', 'Club de Code', '2024-07-08 11:00:00', NULL, NULL),
(5, 'private', NULL, '2025-07-14 16:41:34', NULL, NULL),
(10, 'private', 'Ange Kore - John Doe', '2025-07-14 16:58:28', NULL, NULL),
(15, 'private', 'Ange Kore - John Doe', '2025-07-14 16:59:55', NULL, NULL),
(16, 'private', 'Ange Kore - John Doe', '2025-07-14 17:01:19', 24, '2025-07-14 19:01:20'),
(20, 'private', 'ange ziac', '2025-07-14 17:07:50', 1, NULL),
(21, 'private', 'ziac ange', '2025-07-14 17:07:50', 1, NULL),
(22, 'private', 'ange ziac', '2025-07-14 17:07:58', 1, NULL),
(23, 'private', 'ziac ange', '2025-07-14 17:07:58', 1, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `conversation_participants`
--

CREATE TABLE `conversation_participants` (
  `conversation_id` int(10) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `online` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `conversation_participants`
--

INSERT INTO `conversation_participants` (`conversation_id`, `user_id`, `online`) VALUES
(1, 1, 0),
(1, 63, 1),
(16, 1, 0),
(16, 63, 1),
(23, 63, 1),
(23, 65, 1);

-- --------------------------------------------------------

--
-- Structure de la table `friends`
--

CREATE TABLE `friends` (
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `friend_id` bigint(20) UNSIGNED NOT NULL,
  `status` enum('pending','accepted','rejected') DEFAULT 'pending',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `friends`
--

INSERT INTO `friends` (`user_id`, `friend_id`, `status`, `created_at`) VALUES
(63, 1, 'pending', '2025-07-14 13:24:09'),
(63, 2, 'pending', '2025-07-14 13:24:09'),
(63, 3, 'pending', '2025-07-14 13:24:10'),
(63, 4, 'pending', '2025-07-14 13:24:10'),
(63, 5, 'pending', '2025-07-14 13:29:31'),
(63, 6, 'pending', '2025-07-14 13:29:33'),
(63, 7, 'pending', '2025-07-14 13:29:34'),
(63, 8, 'pending', '2025-07-14 13:29:34'),
(63, 9, 'pending', '2025-07-14 13:29:34'),
(63, 10, 'pending', '2025-07-14 13:29:35'),
(63, 11, 'pending', '2025-07-14 13:29:35'),
(63, 12, 'pending', '2025-07-14 13:29:36'),
(63, 60, 'pending', '2025-07-14 13:29:37'),
(63, 62, 'pending', '2025-07-14 13:29:38'),
(63, 65, 'pending', '2025-07-14 13:30:03');

-- --------------------------------------------------------

--
-- Structure de la table `likes`
--

CREATE TABLE `likes` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `post_id` bigint(20) DEFAULT NULL,
  `comment_id` bigint(20) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ;

--
-- Déchargement des données de la table `likes`
--

INSERT INTO `likes` (`id`, `user_id`, `post_id`, `comment_id`, `created_at`) VALUES
(1, 2, 1, NULL, '2024-07-08 08:10:00'),
(2, 3, 1, NULL, '2024-07-08 08:12:00'),
(3, 1, 2, NULL, '2024-07-08 09:40:00'),
(4, 4, 2, NULL, '2024-07-08 09:50:00'),
(5, 5, 2, NULL, '2024-07-08 10:00:00'),
(6, 6, 5, NULL, '2024-07-08 12:40:00'),
(7, 7, 6, NULL, '2024-07-08 13:25:00'),
(8, 8, 10, NULL, '2024-07-08 17:55:00'),
(9, 9, 10, NULL, '2024-07-08 18:00:00'),
(10, 10, 12, NULL, '2024-07-08 19:10:00'),
(11, 2, NULL, 1, '2024-07-08 08:16:00'),
(12, 4, NULL, 3, '2024-07-08 09:46:00'),
(14, 63, 18, NULL, '2025-07-14 12:46:39'),
(21, 63, 26, NULL, '2025-07-14 13:59:48');

-- --------------------------------------------------------

--
-- Structure de la table `messages`
--

CREATE TABLE `messages` (
  `id` int(10) UNSIGNED NOT NULL,
  `conversation_id` int(10) UNSIGNED NOT NULL,
  `sender_id` bigint(20) UNSIGNED NOT NULL,
  `content` text NOT NULL,
  `media_url` varchar(255) DEFAULT NULL,
  `media_type` enum('text','image','video') NOT NULL DEFAULT 'text',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `messages`
--

INSERT INTO `messages` (`id`, `conversation_id`, `sender_id`, `content`, `media_url`, `media_type`, `created_at`) VALUES
(1, 1, 1, 'Salut Marie, super tes photos !', NULL, 'text', '2024-07-08 08:05:00'),
(2, 1, 2, 'Merci John ! Tu viens au meetup photo demain ?', NULL, 'text', '2024-07-08 08:10:00'),
(3, 2, 3, 'Salut tout le monde, on organise un apéro ce soir ?', NULL, 'text', '2024-07-08 09:05:00'),
(4, 2, 4, 'Je suis partante ! 19h au café du coin ?', NULL, 'text', '2024-07-08 09:10:00'),
(5, 3, 6, 'David, tu as la recette de la tarte aux pommes ?', NULL, 'text', '2024-07-08 10:05:00'),
(6, 3, 7, 'Oui, je t’envoie le lien du blog d’Emma !', NULL, 'text', '2024-07-08 10:07:00'),
(7, 4, 1, 'Kevin, tu as avancé sur le bug du backend ?', NULL, 'text', '2024-07-08 11:05:00'),
(8, 4, 11, 'Oui, je pense avoir trouvé. Je t’envoie le fix.', '/uploads/fix_patch.jpg', 'image', '2024-07-08 11:10:00'),
(21, 1, 63, 'Salut John, comment vas-tu ?', NULL, 'text', '2025-07-14 16:58:29'),
(22, 1, 1, 'Salut Ange ! Ça va, et toi ?', NULL, 'text', '2025-07-14 16:58:29'),
(23, 1, 63, 'Super, merci !', NULL, 'text', '2025-07-14 16:58:29'),
(24, 16, 63, 'Salut John, comment vas-tu ?', NULL, 'text', '2025-07-14 17:01:20'),
(25, 16, 1, 'Salut Ange ! Ça va, et toi ?', NULL, 'text', '2025-07-14 17:01:20'),
(26, 16, 63, 'Super, merci !', NULL, 'text', '2025-07-14 17:01:20');

-- --------------------------------------------------------

--
-- Structure de la table `message_status`
--

CREATE TABLE `message_status` (
  `message_id` int(10) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `status` enum('sent','delivered','read') NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `message_status`
--

INSERT INTO `message_status` (`message_id`, `user_id`, `status`, `updated_at`) VALUES
(1, 2, 'read', '2024-07-08 08:06:00'),
(2, 1, 'delivered', '2024-07-08 08:11:00'),
(3, 1, 'read', '2024-07-08 09:06:00'),
(3, 4, 'read', '2024-07-08 09:07:00'),
(3, 5, 'sent', '2024-07-08 09:05:00'),
(4, 3, 'read', '2024-07-08 09:11:00'),
(5, 7, 'read', '2024-07-08 10:06:00'),
(6, 6, 'delivered', '2024-07-08 10:08:00'),
(7, 11, 'read', '2024-07-08 11:06:00'),
(8, 1, 'read', '2024-07-08 11:11:00'),
(22, 1, 'delivered', '2025-07-14 17:01:20'),
(22, 63, 'sent', '2025-07-14 17:01:20'),
(23, 1, 'sent', '2025-07-14 17:01:20'),
(23, 63, 'read', '2025-07-14 17:01:20'),
(24, 1, 'delivered', '2025-07-14 17:01:20'),
(24, 63, 'read', '2025-07-14 17:48:50');

-- --------------------------------------------------------

--
-- Structure de la table `posts`
--

CREATE TABLE `posts` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `content` text DEFAULT NULL,
  `media_url` varchar(255) DEFAULT NULL,
  `emoji_content` varchar(50) DEFAULT NULL,
  `media_type` enum('image','video') DEFAULT NULL,
  `location_name` varchar(255) DEFAULT NULL,
  `latitude` decimal(9,6) DEFAULT NULL,
  `longitude` decimal(9,6) DEFAULT NULL,
  `likes` int(11) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `posts`
--

INSERT INTO `posts` (`id`, `user_id`, `content`, `media_url`, `emoji_content`, `media_type`, `location_name`, `latitude`, `longitude`, `likes`, `created_at`, `updated_at`) VALUES
(1, 1, 'Nouvelle journée, nouvelles possibilités ! 🌅 Prêt à coder de nouveaux projets passionnants !', '/uploads/post_sunrise.jpg', NULL, 'image', 'Paris, France', 48.856600, 2.352200, 2, '2024-07-08 08:00:00', '2025-07-14 03:03:02'),
(2, 2, 'Session photo matinale dans les jardins du Luxembourg. La lumière était parfaite ! 📸✨', '/uploads/post_garden.jpg', NULL, 'image', 'Jardins du Luxembourg, Paris', 48.846200, 2.337100, 3, '2024-07-08 09:30:00', '2025-07-14 03:03:02'),
(3, 3, 'Réunion productive avec l\'équipe aujourd\'hui. Nouvelle stratégie marketing en cours ! 💼', NULL, NULL, NULL, 'Bureau WeWork, Paris', 48.869800, 2.328200, 0, '2024-07-08 10:15:00', '2024-07-08 10:15:00'),
(4, 4, 'Nouveau design pour une app mobile. Qu\'est-ce que vous en pensez ? 🎨', '/uploads/post_design.jpg', NULL, 'image', NULL, NULL, NULL, 0, '2024-07-08 11:45:00', '2024-07-08 11:45:00'),
(5, 5, 'Séance d\'entraînement intense ce matin ! 💪 Qui est motivé pour rejoindre le défi fitness ?', '/uploads/post_workout.mp4', NULL, 'video', 'Salle de sport BasicFit', 48.853400, 2.348800, 1, '2024-07-08 12:30:00', '2025-07-14 03:03:02'),
(6, 6, 'Recette du jour : Tarte aux pommes façon grand-mère 🍎 Recette complète sur mon blog !', '/uploads/post_apple_pie.jpg', NULL, 'image', 'Ma cuisine', 48.860600, 2.337600, 1, '2024-07-08 13:20:00', '2025-07-14 03:03:02'),
(7, 7, 'Répétition avec le groupe ce soir. Nouveau morceau en préparation ! 🎵', '/uploads/post_band.jpg', NULL, 'image', 'Studio d\'enregistrement', 48.873800, 2.350100, 0, '2024-07-08 14:00:00', '2024-07-08 14:00:00'),
(8, 8, 'Souvenir de mon voyage au Japon l\'année dernière. Tokyo by night 🌃', '/uploads/post_tokyo.jpg', NULL, 'image', 'Tokyo, Japon', 35.676200, 139.650300, 0, '2024-07-08 15:30:00', '2024-07-08 15:30:00'),
(9, 9, 'Stream live dans 30 minutes ! On va tester le nouveau jeu qui sort aujourd\'hui 🎮', '/uploads/post_gaming_setup.jpg', NULL, 'image', NULL, NULL, NULL, 0, '2024-07-08 16:15:00', '2024-07-08 16:15:00'),
(10, 10, 'Nouvelle toile terminée ! Inspiration venue d\'un rêve étrange... 🎨', '/uploads/post_painting.jpg', NULL, 'image', 'Mon atelier', 48.858900, 2.346900, 2, '2024-07-08 17:45:00', '2025-07-14 03:03:02'),
(11, 11, 'Débuggage intensif aujourd\'hui. Parfois les bugs les plus simples sont les plus difficiles à trouver 😅', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2024-07-08 18:30:00', '2024-07-08 18:30:00'),
(12, 12, 'Cours de yoga au coucher du soleil. Moment de paix absolue 🧘‍♀️', '/uploads/post_yoga_sunset.jpg', NULL, 'image', 'Parc des Buttes-Chaumont', 48.880200, 2.382500, 1, '2024-07-08 19:00:00', '2025-07-14 03:03:02'),
(13, 1, 'Café et code, le combo parfait pour démarrer la semaine ! ☕💻', '/uploads/post_coffee_code.jpg', NULL, 'image', 'Café de Flore', 48.854200, 2.332500, 0, '2024-07-09 08:30:00', '2024-07-09 08:30:00'),
(14, 3, 'Pitch deck finalisé ! Rendez-vous avec les investisseurs demain 🚀', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2024-07-09 09:45:00', '2024-07-09 09:45:00'),
(15, 5, 'Nouveau record personnel au deadlift ! 💪 180kg 🔥', '/uploads/post_deadlift.mp4', NULL, 'video', 'Salle de sport', 48.853400, 2.348800, 0, '2024-07-09 10:20:00', '2024-07-09 10:20:00'),
(16, 63, 'qqqq', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-14 12:44:11', '2025-07-14 12:44:11'),
(17, 63, 'jhgjj', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-14 12:44:31', '2025-07-14 12:44:31'),
(18, 63, 'ju', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-14 12:45:38', '2025-07-14 12:45:38'),
(19, 63, 'essai img', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-14 12:47:06', '2025-07-14 12:47:06'),
(20, 63, 'test', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-14 12:55:31', '2025-07-14 12:55:31'),
(21, 63, NULL, './uploads/6874e22b97192_Background.png', NULL, 'image', NULL, NULL, NULL, 0, '2025-07-14 12:55:39', '2025-07-14 12:55:39'),
(22, 63, 'C\'est bon', NULL, NULL, NULL, NULL, NULL, NULL, 0, '2025-07-14 13:30:50', '2025-07-14 13:30:50'),
(23, 63, 'oki vais voir ce qui reste il reste les stories et autres', NULL, '😁', NULL, NULL, NULL, NULL, 0, '2025-07-14 13:32:07', '2025-07-14 13:32:07'),
(24, 63, NULL, './uploads/6874ec34319b7_Enregistrement_2025-07-14_133425.mp4', NULL, 'video', NULL, NULL, NULL, 0, '2025-07-14 13:38:28', '2025-07-14 13:38:28'),
(25, 63, NULL, './uploads/6874ec54373bc_Enregistrement_de_l___cran_2025-07-14_133415.mp4', NULL, 'video', NULL, NULL, NULL, 0, '2025-07-14 13:39:00', '2025-07-14 13:39:00'),
(26, 63, 'ca fait pas capture ??', './uploads/6874ee520d832_Enregistrement_de_l___cran_2025-07-14_134701.mp4', NULL, 'video', NULL, NULL, NULL, 0, '2025-07-14 13:47:30', '2025-07-14 13:47:30');

-- --------------------------------------------------------

--
-- Structure de la table `profiles`
--

CREATE TABLE `profiles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `bio` text DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `birthdate` date DEFAULT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `relationship_status` enum('single','in_relationship','married','complicated') DEFAULT NULL,
  `profession` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `interests` text DEFAULT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `profiles`
--

INSERT INTO `profiles` (`id`, `user_id`, `bio`, `phone`, `website`, `address`, `birthdate`, `gender`, `relationship_status`, `profession`, `country`, `city`, `interests`, `avatar_url`, `created_at`, `updated_at`) VALUES
(1, 1, 'Développeur passionné par les nouvelles technologies.', '+33123456789', 'https://johndoe.dev', '123 Rue de Paris', '1990-05-15', 'male', 'single', 'Développeur Web', 'France', 'Paris', 'Programmation, randonnée, musique', '/uploads/profile_john.jpg', '2024-01-15 08:30:00', '2024-01-15 08:30:00'),
(2, 2, 'Photographe amatrice, adore capturer la beauté du quotidien.', '+33198765432', NULL, '45 Avenue des Lilas', '1992-08-22', 'female', 'in_relationship', 'Photographe', 'France', 'Paris', 'Photographie, voyage, cuisine', '/uploads/profile_marie.jpg', '2024-01-16 09:15:00', '2024-01-16 09:15:00'),
(3, 3, 'Marketeur en quête d\'innovation.', '+33145678912', 'https://alexsmith.biz', NULL, '1988-03-10', 'male', 'married', 'Consultant Marketing', 'France', 'Paris', 'Marketing, tech, sport', '/uploads/profile_alex.jpg', '2024-01-17 10:45:00', '2024-01-17 10:45:00'),
(4, 4, 'Designer UX/UI, fan de minimalisme.', '+33111223344', 'https://sarahdesigns.com', '12 Boulevard Saint-Germain', '1995-11-30', 'female', 'single', 'Designer UX/UI', 'France', 'Paris', 'Design, art, yoga', '/uploads/profile_sarah.jpg', '2024-01-18 11:20:00', '2024-01-18 11:20:00'),
(5, 5, 'Amoureux du fitness et de la musculation.', '+33155667788', NULL, '78 Rue du Sport', '1993-07-12', 'male', 'single', 'Coach Fitness', 'France', 'Paris', 'Fitness, nutrition, course', '/uploads/profile_mike.jpg', '2024-01-19 12:00:00', '2024-01-19 12:00:00'),
(6, 6, 'Cuisine avec amour, partage avec passion.', '+33199887766', 'https://emmacuisine.fr', '56 Rue des Pommes', '1989-04-25', 'female', 'married', 'Blogueuse Culinaire', 'France', 'Paris', 'Cuisine, pâtisserie, voyages', '/uploads/profile_emma.jpg', '2024-01-20 13:30:00', '2024-01-20 13:30:00'),
(7, 7, 'Musicien et compositeur, toujours à la recherche de nouvelles mélodies.', '+33122334455', NULL, '89 Avenue de la Musique', '1991-09-17', 'male', 'in_relationship', 'Musicien', 'France', 'Paris', 'Musique, concerts, écriture', '/uploads/profile_david.jpg', '2024-01-21 14:15:00', '2024-01-21 14:15:00'),
(8, 8, 'Voyageuse dans l\'âme, toujours en quête de nouvelles aventures.', '+33166778899', 'https://lisatravels.com', '34 Rue du Monde', '1994-02-28', 'female', 'single', 'Blogueuse Voyage', 'France', 'Paris', 'Voyage, photographie, culture', '/uploads/profile_lisa.jpg', '2024-01-22 15:45:00', '2024-01-22 15:45:00'),
(9, 9, 'Gamer passionné et streamer occasionnel.', '+33144556677', 'https://twitch.tv/chrisgaming', NULL, '1996-06-05', 'male', 'single', 'Streamer', 'France', 'Paris', 'Jeux vidéo, tech, cinéma', '/uploads/profile_chris.jpg', '2024-01-23 16:30:00', '2024-01-23 16:30:00'),
(10, 10, 'Artiste peintre, inspirée par les rêves et la nature.', '+33188990011', 'https://annapaintings.art', '23 Rue des Couleurs', '1990-12-01', 'female', 'complicated', 'Peintre', 'France', 'Paris', 'Peinture, nature, méditation', '/uploads/profile_anna.jpg', '2024-01-24 17:00:00', '2024-01-24 17:00:00'),
(11, 11, 'Codeur nocturne, chasseur de bugs.', '+33133445566', NULL, '67 Rue du Code', '1992-10-20', 'male', 'single', 'Développeur Backend', 'France', 'Paris', 'Programmation, jeux de société', '/uploads/profile_kevin.jpg', '2024-01-25 18:15:00', '2024-01-25 18:15:00'),
(12, 12, 'Yogi passionnée, en quête d\'équilibre.', '+33177889900', 'https://jessyoga.fr', '45 Rue de la Paix', '1993-03-15', 'female', 'in_relationship', 'Professeur de Yoga', 'France', 'Paris', 'Yoga, méditation, nature', '/uploads/profile_jessica.jpg', '2024-01-26 19:30:00', '2024-01-26 19:30:00');

-- --------------------------------------------------------

--
-- Structure de la table `stories`
--

CREATE TABLE `stories` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `media_url` varchar(255) DEFAULT NULL,
  `media_type` enum('image','video','emoji') NOT NULL,
  `emoji_content` varchar(50) DEFAULT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `stories`
--

INSERT INTO `stories` (`id`, `user_id`, `media_url`, `media_type`, `emoji_content`, `expires_at`, `created_at`) VALUES
(1, 1, '/uploads/story_code.jpg', 'image', NULL, '2024-07-09 08:00:00', '2024-07-08 08:00:00'),
(2, 2, '/uploads/story_photo.mp4', 'video', NULL, '2024-07-09 09:30:00', '2024-07-08 09:30:00'),
(3, 3, NULL, 'emoji', '🚀', '2024-07-09 10:15:00', '2024-07-08 10:15:00'),
(4, 5, '/uploads/story_workout.jpg', 'image', NULL, '2024-07-09 12:30:00', '2024-07-08 12:30:00'),
(5, 6, '/uploads/story_pie.jpg', 'image', NULL, '2024-07-09 13:20:00', '2024-07-08 13:20:00'),
(6, 12, '/uploads/story_yoga.mp4', 'video', NULL, '2024-07-09 19:00:00', '2024-07-08 19:00:00');

-- --------------------------------------------------------

--
-- Structure de la table `story_views`
--

CREATE TABLE `story_views` (
  `id` bigint(20) NOT NULL,
  `story_id` bigint(20) NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `viewed_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `story_views`
--

INSERT INTO `story_views` (`id`, `story_id`, `user_id`, `viewed_at`) VALUES
(1, 1, 2, '2024-07-08 08:05:00'),
(2, 1, 3, '2024-07-08 08:10:00'),
(3, 2, 1, '2024-07-08 09:35:00'),
(4, 2, 4, '2024-07-08 09:40:00'),
(5, 3, 5, '2024-07-08 10:20:00'),
(6, 4, 6, '2024-07-08 12:35:00'),
(7, 5, 7, '2024-07-08 13:25:00'),
(8, 6, 8, '2024-07-08 19:05:00');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `firstname` varchar(100) NOT NULL,
  `lastname` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `birthdate` date DEFAULT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `relationship_status` enum('single','in_relationship','married','complicated') DEFAULT NULL,
  `profession` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `interests` text DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin','moderator') NOT NULL DEFAULT 'user',
  `status` enum('pending','active','suspended','banned') NOT NULL DEFAULT 'pending',
  `activation_token` varchar(255) DEFAULT NULL,
  `csrf_token` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expire` datetime DEFAULT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `online` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `firstname`, `lastname`, `username`, `birthdate`, `gender`, `relationship_status`, `profession`, `country`, `city`, `interests`, `email`, `password`, `role`, `status`, `activation_token`, `csrf_token`, `created_at`, `updated_at`, `reset_token`, `reset_token_expire`, `avatar_url`, `online`) VALUES
(1, 'John', 'Doe', 'john_doe', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'john.doe@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'pending', NULL, NULL, '2024-01-15 08:30:00', '2024-01-15 08:30:00', NULL, NULL, '/uploads/avatar_john.jpg', 0),
(2, 'Marie', 'Martin', 'marie_martin', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'marie.martin@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'pending', NULL, NULL, '2024-01-16 09:15:00', '2024-01-16 09:15:00', NULL, NULL, '/uploads/avatar_marie.jpg', 0),
(3, 'Alex', 'Smith', 'alex_smith', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'alex.smith@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'pending', NULL, NULL, '2024-01-17 10:45:00', '2024-01-17 10:45:00', NULL, NULL, '/uploads/avatar_alex.jpg', 0),
(4, 'Sarah', 'Wilson', 'sarah_wilson', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'sarah.wilson@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'pending', NULL, NULL, '2024-01-18 11:20:00', '2024-01-18 11:20:00', NULL, NULL, '/uploads/avatar_sarah.jpg', 0),
(5, 'Mike', 'Johnson', 'mike_johnson', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'mike.johnson@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'pending', NULL, NULL, '2024-01-19 12:00:00', '2024-01-19 12:00:00', NULL, NULL, '/uploads/avatar_mike.jpg', 0),
(6, 'Emma', 'Brown', 'emma_brown', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'emma.brown@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'pending', NULL, NULL, '2024-01-20 13:30:00', '2024-01-20 13:30:00', NULL, NULL, '/uploads/avatar_emma.jpg', 0),
(7, 'David', 'Garcia', 'david_garcia', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'david.garcia@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'pending', NULL, NULL, '2024-01-21 14:15:00', '2024-01-21 14:15:00', NULL, NULL, '/uploads/avatar_david.jpg', 0),
(8, 'Lisa', 'Taylor', 'lisa_taylor', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'lisa.taylor@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'pending', NULL, NULL, '2024-01-22 15:45:00', '2024-01-22 15:45:00', NULL, NULL, '/uploads/avatar_lisa.jpg', 0),
(9, 'Chris', 'Anderson', 'chris_anderson', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'chris.anderson@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'pending', NULL, NULL, '2024-01-23 16:30:00', '2024-01-23 16:30:00', NULL, NULL, '/uploads/avatar_chris.jpg', 0),
(10, 'Anna', 'Davis', 'anna_davis', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'anna.davis@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'pending', NULL, NULL, '2024-01-24 17:00:00', '2024-01-24 17:00:00', NULL, NULL, '/uploads/avatar_anna.jpg', 0),
(11, 'Kevin', 'White', 'kevin_white', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'kevin.white@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'pending', NULL, NULL, '2024-01-25 18:15:00', '2024-01-25 18:15:00', NULL, NULL, '/uploads/avatar_kevin.jpg', 0),
(12, 'Jessica', 'Miller', 'jessica_miller', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'jessica.miller@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'pending', NULL, NULL, '2024-01-26 19:30:00', '2024-01-26 19:30:00', NULL, NULL, '/uploads/avatar_jessica.jpg', 0),
(60, 'Ebony', 'Ward', 'syfejymyt', '1981-02-14', 'female', 'complicated', 'A id dolor ea at ad', 'CA', 'Laborum aspernatur o', 'Tempor saepe anim qu', 'rebeccahessouh@outlook.fr', '$2y$10$uA7CL4eeuB40UF9d5cnsPeBIjOf.ogrQ7.aul4pibx2GyWRxU3t5K', 'user', 'pending', '001f00d588fce97c16b881a0a96d4941708f3d9e790f0fddffd1dcb560d25439', 'd444062a5e5a2e5beb581e3c527fb4a3c220542928d58708e09d170b2acec647', '2025-07-12 06:00:23', '2025-07-12 06:00:23', NULL, NULL, NULL, 0),
(62, 'Shellie', 'Swanson', 'dovaqeh', '1972-07-12', 'male', 'married', 'Odio id harum inven', 'SS', 'Illum quis autem Na', 'Sed quas eaque nihil', 'lehidubih@mailinator.com', '$2y$10$8k4nPzL62JWANS07GjfEnOjOf7FuEsORdgrvtLvJskI28WdSbLnTC', 'user', 'active', '4c351ced39e3dac94d58d4aa53ed61c0ed2a5f4ecb2931f89f19b88ffc30ebf2', 'd9d3d2210fbbc1c2c252345c6593d5864ec9aa1075fde8787aa7ac45ce432746', '2025-07-12 21:29:58', '2025-07-12 21:46:30', NULL, NULL, NULL, 0),
(63, 'Ange', 'Kore', 'rycus', '1973-08-19', 'male', '', 'Id cupiditate excep', 'CI', 'Agboville', 'Provident aut offic', 'angebouabre463@gmail.com', '$2y$10$82F8r/71IfjPnaFryTER3Oq7oeqHALdxclXB1cEa4nZqMhuwg8c7K', 'user', 'active', NULL, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NTI1MTMyNzUsImV4cCI6MTc1MjU5OTY3NSwidXNlcl9pZCI6NjMsImVtYWlsIjoiYW5nZWJvdWFicmU0NjNAZ21haWwuY29tIiwiZmlyc3RuYW1lIjoiQW5nZSIsImxhc3RuYW1lIjoiS29yZSJ9.6mT9rWlMTIpCadsOIN0xZwwuf-2GQqdM4b4SlDtz-Ao', '2025-07-12 21:47:58', '2025-07-14 19:14:35', NULL, NULL, NULL, 0),
(65, 'Zia', 'Carson', 'babybum', '1998-05-18', 'female', 'complicated', 'Sequi repellendus M', 'KH', 'Ex amet qui et volu', 'Eum maiores ad aute', 'loicbouabre4@gmail.com', '$2y$10$E2ZDNw0FgeS//YHVr9aSbuU8YPbg4JgdIQSIOazVjDU38l0lOzGD2', 'admin', 'active', NULL, 'b08858f9d5a48415b1d96d8baafd77c4db81a3a851679ceaec792a8640858cd5', '2025-07-13 19:28:56', '2025-07-14 16:33:29', NULL, NULL, NULL, 0);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `post_id` (`post_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `conversations`
--
ALTER TABLE `conversations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `last_message_id` (`last_message_id`);

--
-- Index pour la table `conversation_participants`
--
ALTER TABLE `conversation_participants`
  ADD PRIMARY KEY (`conversation_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `friends`
--
ALTER TABLE `friends`
  ADD PRIMARY KEY (`user_id`,`friend_id`),
  ADD KEY `friend_id` (`friend_id`);

--
-- Index pour la table `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `post_id` (`post_id`),
  ADD KEY `comment_id` (`comment_id`);

--
-- Index pour la table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `conversation_id` (`conversation_id`),
  ADD KEY `sender_id` (`sender_id`);

--
-- Index pour la table `message_status`
--
ALTER TABLE `message_status`
  ADD PRIMARY KEY (`message_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `profiles`
--
ALTER TABLE `profiles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `stories`
--
ALTER TABLE `stories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `story_views`
--
ALTER TABLE `story_views`
  ADD PRIMARY KEY (`id`),
  ADD KEY `story_id` (`story_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT pour la table `conversations`
--
ALTER TABLE `conversations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT pour la table `likes`
--
ALTER TABLE `likes`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT pour la table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT pour la table `profiles`
--
ALTER TABLE `profiles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT pour la table `stories`
--
ALTER TABLE `stories`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `story_views`
--
ALTER TABLE `story_views`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `conversations`
--
ALTER TABLE `conversations`
  ADD CONSTRAINT `conversations_ibfk_1` FOREIGN KEY (`last_message_id`) REFERENCES `messages` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `conversation_participants`
--
ALTER TABLE `conversation_participants`
  ADD CONSTRAINT `conversation_participants_ibfk_1` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `conversation_participants_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `friends`
--
ALTER TABLE `friends`
  ADD CONSTRAINT `friends_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `friends_ibfk_2` FOREIGN KEY (`friend_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `likes_ibfk_3` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `message_status`
--
ALTER TABLE `message_status`
  ADD CONSTRAINT `message_status_ibfk_1` FOREIGN KEY (`message_id`) REFERENCES `messages` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `message_status_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `profiles`
--
ALTER TABLE `profiles`
  ADD CONSTRAINT `profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `stories`
--
ALTER TABLE `stories`
  ADD CONSTRAINT `stories_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `story_views`
--
ALTER TABLE `story_views`
  ADD CONSTRAINT `story_views_ibfk_1` FOREIGN KEY (`story_id`) REFERENCES `stories` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `story_views_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
