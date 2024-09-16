# Basis-Image für Backend
FROM php:8.0-fpm AS backend

WORKDIR /var/www/html

RUN apt-get update && apt-get install -y \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    nano

RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

COPY . /var/www/html

RUN chown -R www-data:www-data /var/www/html/storage

# Build-Phase für Frontend
FROM node:16-alpine AS frontend-build

WORKDIR /app

COPY . . 
RUN npm install
RUN npm run build

# Produktions-Phase
FROM nginx:alpine

# Kopiere den Build aus der Frontend-Phase
COPY --from=frontend-build /app/public/build /usr/share/nginx/html

# Kopiere die Backend-Dateien und Konfiguriere Nginx
COPY --from=backend /var/www/html /var/www/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
