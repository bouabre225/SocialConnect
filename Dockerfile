FROM php:8.2-apache

# Installer extensions PHP
RUN docker-php-ext-install pdo pdo_mysql mysqli

# Activer les modules Apache nécessaires
RUN a2enmod rewrite headers

# Copier tout le projet dans le conteneur
COPY . /var/www/html/

# Créer le dossier upload (il ne doit PAS exister localement ou être vide)
RUN mkdir -p /var/www/html/views/clients/upload

# Donner les bons droits pour les fichiers
RUN chown -R www-data:www-data /var/www/html && \
    chmod -R 775 /var/www/html/views/clients/upload

# Appliquer configuration personnalisée Apache (si tu en as une)
COPY apache.conf /etc/apache2/sites-available/000-default.conf

EXPOSE 80
CMD ["apache2-foreground"]
