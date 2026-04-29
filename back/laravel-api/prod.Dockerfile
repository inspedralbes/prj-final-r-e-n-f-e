# ==========================================
# Etapa 1: Builder (Construcció)
# ==========================================
FROM php:8.4.2-fpm AS builder

# Directori de treball
WORKDIR /app

# Instal·lar dependències del sistema per compilar extensions
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    unzip \
    libpq-dev \
    libzip-dev \
    libonig-dev \
    libjpeg-dev \
    libpng-dev \
    && docker-php-ext-install pdo pdo_pgsql zip bcmath mbstring gd \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copiar Composer des de la imatge oficial
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 1. Copiar fitxers de dependències primer per aprofitar el cache de capes
COPY back/laravel-api/composer.json back/laravel-api/composer.lock* ./

# 2. Instal·lar dependències (sense scripts per evitar errors si el codi encara no hi és)
RUN composer install --no-dev --no-scripts --no-autoloader --no-interaction

# 3. Copiar la resta del codi de l'aplicació
COPY back/laravel-api/ ./

# 4. Finalitzar instal·lació de Composer (genera l'autoloader i executa scripts)
RUN composer install --no-dev --optimize-autoloader --no-interaction


# ==========================================
# Etapa 2: Imatge Final (Producció)
# ==========================================
FROM php:8.4.2-fpm

WORKDIR /app

# Instal·lar llibreries de temps d'execució (runtime)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    libzip4 \
    libonig5 \
    libjpeg62-turbo \
    libpng16-16 \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copiar extensions PHP des del builder
COPY --from=builder /usr/local/lib/php/extensions/ /usr/local/lib/php/extensions/
COPY --from=builder /usr/local/etc/php/conf.d/ /usr/local/etc/php/conf.d/

# Configuració de PHP per a producció
RUN echo "memory_limit=256M" > /usr/local/etc/php/conf.d/app.ini \
    && echo "opcache.enable=1" >> /usr/local/etc/php/conf.d/app.ini \
    && echo "opcache.validate_timestamps=0" >> /usr/local/etc/php/conf.d/app.ini \
    && echo "expose_php=Off" >> /usr/local/etc/php/conf.d/app.ini

# Copiar l'aplicació completa (incloent la carpeta VENDOR) des del builder
COPY --from=builder /app /app

# Assegurar permisos correctes per a Laravel
RUN mkdir -p storage/logs bootstrap/cache \
    storage/framework/cache/data \
    storage/framework/sessions \
    storage/framework/views \
    && chown -R www-data:www-data /app \
    && chmod -R 775 storage bootstrap/cache

# Canviar a l'usuari www-data per seguretat
USER www-data

# Optimització interna de Laravel (això crea els fitxers de memòria cau a /app)
RUN php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache

EXPOSE 9000

CMD ["php-fpm"]
