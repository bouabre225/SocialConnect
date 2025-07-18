FROM php:8.2-apache

# Installer extensions PHP
RUN docker-php-ext-install pdo pdo_mysql mysqli

# Installer composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Installer modules Apache nécessaires
RUN a2enmod rewrite headers

# Copier les fichiers de l'application
COPY . /var/www/html/

# Installer dépendances PHP
WORKDIR /var/www/html
RUN composer install

# Créer dossier upload si absent
RUN mkdir -p /var/www/html/views/clients/upload

# Droits
RUN chown -R www-data:www-data /var/www/html && \
    chmod -R 775 /var/www/html/views/clients/upload

# Config Apache
COPY apache.conf /etc/apache2/sites-available/000-default.conf

# Script d'entrée
COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 80
EXPOSE 8002

CMD ["/start.sh"]
