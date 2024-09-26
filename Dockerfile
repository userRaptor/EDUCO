# Dockerfile
# Stage 1: Build the frontend
FROM node:16-alpine AS frontend-build

WORKDIR /app

# Kopiere die package.json und package-lock.json für die Installation der Abhängigkeiten
COPY package.json package-lock.json ./

RUN npm install

# Kopiere den Rest der Anwendung und baue das Projekt
COPY . .

RUN npm run build

# Stage 2: Set up the backend
FROM php:8.2-fpm

WORKDIR /var/www

# Installiere benötigte PHP-Erweiterungen
RUN docker-php-ext-install pdo pdo_mysql

# Installiere Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Kopiere den Code aus der Frontend-Build-Stage
COPY --from=frontend-build /app/public/build ./public/build

# Kopiere den Rest der Anwendung
COPY . .

# Setze die Umgebungsvariablen
COPY .env .env 
RUN php artisan key:generate

# Installiere die PHP-Abhängigkeiten
COPY composer.json composer.lock ./
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# Expose Port
EXPOSE 9000

CMD ["php-fpm"]
