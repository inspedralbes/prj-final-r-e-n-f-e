# Build stage - Construir dependencias y extensiones
FROM php:8.4.2-fpm AS builder

WORKDIR /app

# Instalar dependencias del sistema requeridas para compilar extensiones
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    unzip \
    libpq-dev \
    libzip-dev \
    libonig-dev \
    && docker-php-ext-install pdo pdo_pgsql zip bcmath mbstring \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 1. Copiar solo los archivos de dependencias para aprovechar la caché de Docker
COPY back/principal/composer.json back/principal/composer.lock* ./

# 2. Instalar dependencias SIN el autoloader (el código de la app aún no está aquí)
RUN composer install --no-dev --no-scripts --no-autoloader

# 3. Copiar el código fuente de la aplicación
COPY back/principal/ ./

# 4. Generar el autoloader optimizado ahora que el código está presente
RUN composer dump-autoload --optimize

# Production stage - Imagen final ligera
FROM php:8.4.2-fpm

WORKDIR /app

# Instalar SOLO librerías en tiempo de ejecución (sin dependencias de compilación)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    libzip4 \
    libonig5 \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copiar composer desde la imagen oficial
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copiar las extensiones de PHP ya compiladas desde la etapa builder
COPY --from=builder /usr/local/lib/php/extensions/ /usr/local/lib/php/extensions/
COPY --from=builder /usr/local/etc/php/conf.d/ /usr/local/etc/php/conf.d/

# Copiar configuración PHP optimizada
RUN echo "memory_limit=256M" > /usr/local/etc/php/conf.d/app.ini \
    && echo "max_execution_time=30" >> /usr/local/etc/php/conf.d/app.ini \
    && echo "upload_max_filesize=20M" >> /usr/local/etc/php/conf.d/app.ini \
    && echo "post_max_size=20M" >> /usr/local/etc/php/conf.d/app.ini \
    && echo "expose_php=Off" >> /usr/local/etc/php/conf.d/app.ini \
    && echo "opcache.enable=1" >> /usr/local/etc/php/conf.d/app.ini \
    && echo "opcache.enable_cli=0" >> /usr/local/etc/php/conf.d/app.ini \
    && echo "opcache.memory_consumption=256" >> /usr/local/etc/php/conf.d/app.ini \
    && echo "opcache.interned_strings_buffer=16" >> /usr/local/etc/php/conf.d/app.ini \
    && echo "opcache.max_accelerated_files=20000" >> /usr/local/etc/php/conf.d/app.ini \
    && echo "opcache.validate_timestamps=0" >> /usr/local/etc/php/conf.d/app.ini \
    && echo "opcache.revalidate_freq=0" >> /usr/local/etc/php/conf.d/app.ini

# Copiar aplicación completa (código + vendor) desde el builder
COPY --from=builder /app /app

# Crear directorios necesarios con permisos adecuados
RUN mkdir -p storage/logs bootstrap/cache \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    && chown -R www-data:www-data /app \
    && chmod -R 755 storage bootstrap/cache

# Pre-generar cachés de Laravel (config, rutas)
RUN cd /app && php artisan config:cache && php artisan route:cache

# Generar archivo de preload para opcache
RUN cd /app && php artisan package:discover --ansi

USER www-data

EXPOSE 9000

CMD ["php-fpm"]
