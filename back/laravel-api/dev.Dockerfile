FROM php:8.4.2-fpm

WORKDIR /app

RUN apt-get update && apt-get install -y \
    git unzip libpq-dev libzip-dev libonig-dev \
    libjpeg-dev libpng-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/* \
    && docker-php-ext-install pdo pdo_pgsql zip bcmath mbstring gd

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY back/laravel-api/composer.json back/laravel-api/composer.lock* ./

RUN composer install --no-dev --optimize-autoloader --no-scripts

COPY back/laravel-api/ ./

RUN composer run-script post-autoload-dump \
    && mkdir -p storage/framework/views storage/framework/cache storage/logs bootstrap/cache \
    && chown -R www-data:www-data /app

USER www-data
EXPOSE 9000

CMD ["php-fpm"]
