FROM php:8.2-fpm

# Installer les dépendances système pour PostgreSQL
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libpq-dev \
    postgresql-client \
    libzip-dev  # ← AJOUT IMPORTANT

# Installer les extensions PHP (sans zip pour l'instant)
RUN docker-php-ext-install pdo pdo_pgsql mbstring exif pcntl bcmath

# Installer zip séparément avec la configuration nécessaire
RUN docker-php-ext-configure zip && docker-php-ext-install zip

# Installer Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www
COPY . .

RUN composer install --no-dev --optimize-autoloader

RUN chown -R www-data:www-data storage bootstrap/cache
RUN chmod -R 775 storage bootstrap/cache

EXPOSE 9000
CMD ["php-fpm"]
