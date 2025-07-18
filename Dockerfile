FROM php:8.2-apache

# Installer extensions PHP
RUN docker-php-ext-install pdo pdo_mysql mysqli

# Installer Composer depuis une image officielle
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Définir le répertoire de travail
WORKDIR /var/www/html

# Copier les fichiers nécessaires AVANT composer install
COPY composer.json ./
COPY composer.lock ./

# Installer les dépendances PHP
RUN composer install --no-interaction --prefer-dist --no-progress

# Copier le reste du projet
COPY . .

# Activer modules Apache
RUN a2enmod rewrite headers

# Créer upload
RUN mkdir -p /var/www/html/views/clients/upload
RUN chown -R www-data:www-data /var/www/html && \
    chmod -R 775 /var/www/html/views/clients/upload

COPY apache.conf /etc/apache2/sites-available/000-default.conf
COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 80
EXPOSE 8002

CMD ["/start.sh"]
