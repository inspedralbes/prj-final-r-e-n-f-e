FROM php:8.4.2

WORKDIR /app

# Instalar todo en un RUN (mejor cache)
RUN apt-get update && apt-get install -y \
    git unzip libpq-dev libzip-dev libonig-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/* \
    && docker-php-ext-install pdo pdo_pgsql zip bcmath mbstring

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY back/principal/composer.json back/principal/composer.lock* ./

RUN composer install --no-dev --optimize-autoloader --no-scripts

COPY back/principal/ ./

RUN composer run-script post-autoload-dump

CMD ["sh", "-c", "php artisan storage:link || true && php artisan serve --host=0.0.0.0 --port=8000"]
EXPOSE 8000
