# Verwende ein Basis-Image für PHP mit Apache
FROM php:8.2-apache

# Installiere System-Abhängigkeiten und PHP-Erweiterungen
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    libpq-dev \
    curl \
    git \
    unzip \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd zip pdo pdo_pgsql

# Composer installieren
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Arbeitsverzeichnis im Container setzen
WORKDIR /var/www/html

# Kopiere die Composer-Datei und installiere Abhängigkeiten
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader

# Kopiere die restlichen Dateien ins Container-Arbeitsverzeichnis
COPY . .

# Autoload neu generieren
RUN composer dump-autoload --optimize

# Füge Node.js hinzu und installiere NPM-Pakete
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && npm install

# Baue das React-Frontend
RUN npm run build

# Führe Datenbank-Migrationen aus
RUN php artisan migrate --force

# Setze die richtigen Berechtigungen für den public-Ordner
RUN chown -R www-data:www-data /var/www/html/public
RUN chmod -R 755 /var/www/html/public

# Kopiere die benutzerdefinierte Apache-Konfigurationsdatei
COPY ./apache/000-default.conf /etc/apache2/sites-available/000-default.conf

# Setze den Standard-Befehl
CMD ["apache2-foreground"]

# Exponiere den Port
EXPOSE 80
