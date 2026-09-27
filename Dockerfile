FROM php:8.2-cli

# Install system dependencies & PHP extensions for Laravel & MySQL
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    && docker-php-ext-install pdo_mysql mbstring zip exif pcntl bcmath gd \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copy backend directory
COPY backend/ /app

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Permissions
RUN chmod -R 777 storage bootstrap/cache

ENV PORT=10000
EXPOSE 10000

CMD sh -c "php artisan serve --host=0.0.0.0 --port=${PORT}"
