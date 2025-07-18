FROM php:8.2-apache

# Installer zip + git (nécessaires pour Composer)
RUN apt-get update && apt-get install -y zip unzip git

# Installer extensions PHP
RUN docker-php-ext-install pdo pdo_mysql mysqli

# Installer Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Dossier de travail
WORKDIR /var/www/html

# Copier composer.json depuis le bon dossier
COPY composer.json ./composer.json

# Installer les dépendances PHP
RUN composer install --no-interaction --prefer-dist --no-progress

# Copier tout le projet ensuite
COPY . .

# Activer les modules Apache
RUN a2enmod rewrite headers

# Dossier upload + permissions
RUN mkdir -p /var/www/html/views/clients/upload && \
    chown -R www-data:www-data /var/www/html && \
    chmod -R 775 /var/www/html/views/clients/upload

# Config Apache
COPY apache.conf /etc/apache2/sites-available/000-default.conf

# Script de démarrage
COPY api/users/start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 80
EXPOSE 8002

CMD ["/start.sh"]
