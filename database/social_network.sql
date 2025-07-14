-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : lun. 14 juil. 2025 à 02:56
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

-- --------------------------------------------------------

--
-- Structure de la table `conversations`
--

CREATE TABLE `conversations` (
  `id` int(10) UNSIGNED NOT NULL,
  `type` enum('private','group') NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `conversation_participants`
--

CREATE TABLE `conversation_participants` (
  `conversation_id` int(10) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(63, 1, 'pending', '2025-07-14 01:50:14'),
(63, 3, 'pending', '2025-07-14 01:50:16'),
(63, 4, 'pending', '2025-07-14 01:53:25'),
(63, 6, 'pending', '2025-07-14 01:53:29'),
(63, 7, 'pending', '2025-07-14 01:50:42'),
(63, 10, 'pending', '2025-07-14 01:50:22');

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

-- --------------------------------------------------------

--
-- Structure de la table `posts`
--

CREATE TABLE `posts` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `content` text DEFAULT NULL,
  `media_url` varchar(255) DEFAULT NULL,
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

INSERT INTO `posts` (`id`, `user_id`, `content`, `media_url`, `media_type`, `location_name`, `latitude`, `longitude`, `likes`, `created_at`, `updated_at`) VALUES
(1, 1, 'Nouvelle journée, nouvelles possibilités ! 🌅 Prêt à coder de nouveaux projets passionnants !', '/uploads/post_sunrise.jpg', 'image', 'Paris, France', 48.856600, 2.352200, 0, '2024-07-08 08:00:00', '2024-07-08 08:00:00'),
(2, 2, 'Session photo matinale dans les jardins du Luxembourg. La lumière était parfaite ! 📸✨', '/uploads/post_garden.jpg', 'image', 'Jardins du Luxembourg, Paris', 48.846200, 2.337100, 0, '2024-07-08 09:30:00', '2024-07-08 09:30:00'),
(3, 3, 'Réunion productive avec l\'équipe aujourd\'hui. Nouvelle stratégie marketing en cours ! 💼', NULL, NULL, 'Bureau WeWork, Paris', 48.869800, 2.328200, 0, '2024-07-08 10:15:00', '2024-07-08 10:15:00'),
(4, 4, 'Nouveau design pour une app mobile. Qu\'est-ce que vous en pensez ? 🎨', '/uploads/post_design.jpg', 'image', NULL, NULL, NULL, 0, '2024-07-08 11:45:00', '2024-07-08 11:45:00'),
(5, 5, 'Séance d\'entraînement intense ce matin ! 💪 Qui est motivé pour rejoindre le défi fitness ?', '/uploads/post_workout.mp4', 'video', 'Salle de sport BasicFit', 48.853400, 2.348800, 0, '2024-07-08 12:30:00', '2024-07-08 12:30:00'),
(6, 6, 'Recette du jour : Tarte aux pommes façon grand-mère 🍎 Recette complète sur mon blog !', '/uploads/post_apple_pie.jpg', 'image', 'Ma cuisine', 48.860600, 2.337600, 0, '2024-07-08 13:20:00', '2024-07-08 13:20:00'),
(7, 7, 'Répétition avec le groupe ce soir. Nouveau morceau en préparation ! 🎵', '/uploads/post_band.jpg', 'image', 'Studio d\'enregistrement', 48.873800, 2.350100, 0, '2024-07-08 14:00:00', '2024-07-08 14:00:00'),
(8, 8, 'Souvenir de mon voyage au Japon l\'année dernière. Tokyo by night 🌃', '/uploads/post_tokyo.jpg', 'image', 'Tokyo, Japon', 35.676200, 139.650300, 0, '2024-07-08 15:30:00', '2024-07-08 15:30:00'),
(9, 9, 'Stream live dans 30 minutes ! On va tester le nouveau jeu qui sort aujourd\'hui 🎮', '/uploads/post_gaming_setup.jpg', 'image', NULL, NULL, NULL, 0, '2024-07-08 16:15:00', '2024-07-08 16:15:00'),
(10, 10, 'Nouvelle toile terminée ! Inspiration venue d\'un rêve étrange... 🎨', '/uploads/post_painting.jpg', 'image', 'Mon atelier', 48.858900, 2.346900, 0, '2024-07-08 17:45:00', '2024-07-08 17:45:00'),
(11, 11, 'Débuggage intensif aujourd\'hui. Parfois les bugs les plus simples sont les plus difficiles à trouver 😅', NULL, NULL, NULL, NULL, NULL, 0, '2024-07-08 18:30:00', '2024-07-08 18:30:00'),
(12, 12, 'Cours de yoga au coucher du soleil. Moment de paix absolue 🧘‍♀️', '/uploads/post_yoga_sunset.jpg', 'image', 'Parc des Buttes-Chaumont', 48.880200, 2.382500, 0, '2024-07-08 19:00:00', '2024-07-08 19:00:00'),
(13, 1, 'Café et code, le combo parfait pour démarrer la semaine ! ☕💻', '/uploads/post_coffee_code.jpg', 'image', 'Café de Flore', 48.854200, 2.332500, 0, '2024-07-09 08:30:00', '2024-07-09 08:30:00'),
(14, 3, 'Pitch deck finalisé ! Rendez-vous avec les investisseurs demain 🚀', NULL, NULL, NULL, NULL, NULL, 0, '2024-07-09 09:45:00', '2024-07-09 09:45:00'),
(15, 5, 'Nouveau record personnel au deadlift ! 💪 180kg 🔥', '/uploads/post_deadlift.mp4', 'video', 'Salle de sport', 48.853400, 2.348800, 0, '2024-07-09 10:20:00', '2024-07-09 10:20:00');

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
  `status` enum('pending','active','suspended','banned') NOT NULL DEFAULT 'pending',
  `activation_token` varchar(255) DEFAULT NULL,
  `csrf_token` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expire` datetime DEFAULT NULL,
  `avatar_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `firstname`, `lastname`, `username`, `birthdate`, `gender`, `relationship_status`, `profession`, `country`, `city`, `interests`, `email`, `password`, `status`, `activation_token`, `csrf_token`, `created_at`, `updated_at`, `reset_token`, `reset_token_expire`, `avatar_url`) VALUES
(1, 'John', 'Doe', 'john_doe', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'john.doe@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'pending', NULL, NULL, '2024-01-15 08:30:00', '2024-01-15 08:30:00', NULL, NULL, '/uploads/avatar_john.jpg'),
(2, 'Marie', 'Martin', 'marie_martin', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'marie.martin@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'pending', NULL, NULL, '2024-01-16 09:15:00', '2024-01-16 09:15:00', NULL, NULL, '/uploads/avatar_marie.jpg'),
(3, 'Alex', 'Smith', 'alex_smith', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'alex.smith@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'pending', NULL, NULL, '2024-01-17 10:45:00', '2024-01-17 10:45:00', NULL, NULL, '/uploads/avatar_alex.jpg'),
(4, 'Sarah', 'Wilson', 'sarah_wilson', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'sarah.wilson@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'pending', NULL, NULL, '2024-01-18 11:20:00', '2024-01-18 11:20:00', NULL, NULL, '/uploads/avatar_sarah.jpg'),
(5, 'Mike', 'Johnson', 'mike_johnson', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'mike.johnson@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'pending', NULL, NULL, '2024-01-19 12:00:00', '2024-01-19 12:00:00', NULL, NULL, '/uploads/avatar_mike.jpg'),
(6, 'Emma', 'Brown', 'emma_brown', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'emma.brown@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'pending', NULL, NULL, '2024-01-20 13:30:00', '2024-01-20 13:30:00', NULL, NULL, '/uploads/avatar_emma.jpg'),
(7, 'David', 'Garcia', 'david_garcia', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'david.garcia@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'pending', NULL, NULL, '2024-01-21 14:15:00', '2024-01-21 14:15:00', NULL, NULL, '/uploads/avatar_david.jpg'),
(8, 'Lisa', 'Taylor', 'lisa_taylor', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'lisa.taylor@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'pending', NULL, NULL, '2024-01-22 15:45:00', '2024-01-22 15:45:00', NULL, NULL, '/uploads/avatar_lisa.jpg'),
(9, 'Chris', 'Anderson', 'chris_anderson', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'chris.anderson@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'pending', NULL, NULL, '2024-01-23 16:30:00', '2024-01-23 16:30:00', NULL, NULL, '/uploads/avatar_chris.jpg'),
(10, 'Anna', 'Davis', 'anna_davis', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'anna.davis@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'pending', NULL, NULL, '2024-01-24 17:00:00', '2024-01-24 17:00:00', NULL, NULL, '/uploads/avatar_anna.jpg'),
(11, 'Kevin', 'White', 'kevin_white', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'kevin.white@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'pending', NULL, NULL, '2024-01-25 18:15:00', '2024-01-25 18:15:00', NULL, NULL, '/uploads/avatar_kevin.jpg'),
(12, 'Jessica', 'Miller', 'jessica_miller', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'jessica.miller@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'pending', NULL, NULL, '2024-01-26 19:30:00', '2024-01-26 19:30:00', NULL, NULL, '/uploads/avatar_jessica.jpg'),
(60, 'Ebony', 'Ward', 'syfejymyt', '1981-02-14', 'female', 'complicated', 'A id dolor ea at ad', 'CA', 'Laborum aspernatur o', 'Tempor saepe anim qu', 'rebeccahessouh@outlook.fr', '$2y$10$uA7CL4eeuB40UF9d5cnsPeBIjOf.ogrQ7.aul4pibx2GyWRxU3t5K', 'pending', '001f00d588fce97c16b881a0a96d4941708f3d9e790f0fddffd1dcb560d25439', 'd444062a5e5a2e5beb581e3c527fb4a3c220542928d58708e09d170b2acec647', '2025-07-12 06:00:23', '2025-07-12 06:00:23', NULL, NULL, NULL),
(62, 'Shellie', 'Swanson', 'dovaqeh', '1972-07-12', 'male', 'married', 'Odio id harum inven', 'SS', 'Illum quis autem Na', 'Sed quas eaque nihil', 'lehidubih@mailinator.com', '$2y$10$8k4nPzL62JWANS07GjfEnOjOf7FuEsORdgrvtLvJskI28WdSbLnTC', 'active', '4c351ced39e3dac94d58d4aa53ed61c0ed2a5f4ecb2931f89f19b88ffc30ebf2', 'd9d3d2210fbbc1c2c252345c6593d5864ec9aa1075fde8787aa7ac45ce432746', '2025-07-12 21:29:58', '2025-07-12 21:46:30', NULL, NULL, NULL),
(63, 'Ange', 'Kore', 'rycus', '1973-08-19', 'male', '', 'Id cupiditate excep', 'CI', 'Agboville', 'Provident aut offic', 'angebouabre463@gmail.com', '$2y$10$82F8r/71IfjPnaFryTER3Oq7oeqHALdxclXB1cEa4nZqMhuwg8c7K', 'active', NULL, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NTI0NTM2NzEsImV4cCI6MTc1MjU0MDA3MSwidXNlcl9pZCI6NjMsImVtYWlsIjoiYW5nZWJvdWFicmU0NjNAZ21haWwuY29tIiwiZmlyc3RuYW1lIjoiQW5nZSIsImxhc3RuYW1lIjoiS29yZSJ9.XbgIGx2_RAc-toobwG1PhavrjYOW7xdKY9cp8t_g270', '2025-07-12 21:47:58', '2025-07-14 02:41:11', NULL, NULL, NULL),
(65, 'Zia', 'Carson', 'babybum', '1998-05-18', 'female', 'complicated', 'Sequi repellendus M', 'KH', 'Ex amet qui et volu', 'Eum maiores ad aute', 'loicbouabre4@gmail.com', '$2y$10$E2ZDNw0FgeS//YHVr9aSbuU8YPbg4JgdIQSIOazVjDU38l0lOzGD2', 'active', NULL, 'b08858f9d5a48415b1d96d8baafd77c4db81a3a851679ceaec792a8640858cd5', '2025-07-13 19:28:56', '2025-07-13 19:42:11', NULL, NULL, NULL);

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
  ADD PRIMARY KEY (`id`);

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
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `conversations`
--
ALTER TABLE `conversations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `likes`
--
ALTER TABLE `likes`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT pour la table `profiles`
--
ALTER TABLE `profiles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `stories`
--
ALTER TABLE `stories`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `story_views`
--
ALTER TABLE `story_views`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

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
