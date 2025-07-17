# Utilise l’image officielle PHP avec Apache
FROM php:8.2-apache

# Copie les fichiers dans le dossier du serveur
COPY . /var/www/html/

# Active les modules Apache si besoin (ex: rewrite)
RUN a2enmod rewrite

# Dépendances (facultatif, si tu utilises MySQL par exemple)
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Droits corrects
RUN chown -R www-data:www-data /var/www/html

EXPOSE 80