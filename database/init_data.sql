-- Insertion des données de test

-- Insertion des utilisateurs de test
INSERT INTO users (firstname, lastname, email, password, status, csrf_token) VALUES
('John', 'Doe', 'john@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', 'test_token_1'),
('Jane', 'Smith', 'jane@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', 'test_token_2'),
('Mike', 'Johnson', 'mike@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'active', 'test_token_3');

-- Insertion des publications de test
INSERT INTO posts (user_id, content) VALUES
(1, 'Bonjour à tous ! Je suis ravi de rejoindre ce réseau social.'),
(2, 'Premier post pour partager mes aventures !'),
(3, 'Bonjour à tous, je suis Mike !');

-- Insertion des likes de test
INSERT INTO likes (user_id, post_id) VALUES
(1, 2),
(2, 1),
(3, 1);

-- Insertion des commentaires de test
INSERT INTO comments (user_id, post_id, content) VALUES
(1, 2, 'Super post !'),
(2, 1, 'Bienvenue !'),
(3, 1, 'Bonjour !');

-- Insertion des relations d'amis de test
INSERT INTO friendships (user_id, friend_id, status) VALUES
(1, 2, 'accepted'),
(1, 3, 'accepted'),
(2, 3, 'accepted');

-- Insertion des messages privés de test
INSERT INTO messages (sender_id, receiver_id, content) VALUES
(1, 2, 'Salut ! Comment ça va ?'),
(2, 1, 'Bien et toi ?'),
(3, 1, 'Bonjour !');

-- Insertion des notifications de test
INSERT INTO notifications (user_id, type, content) VALUES
(1, 'friend_request', 'Jane Smith vous a envoyé une demande d\'amitié'),
(2, 'post_like', 'John Doe a aimé votre publication'),
(3, 'message', 'Vous avez un nouveau message de John Doe');
