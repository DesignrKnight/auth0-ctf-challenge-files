FROM alpine:3.9

# Add user
RUN adduser -D -u 1000 -g 1000 -s /bin/sh www

# Install system packages
RUN apk add --no-cache --update supervisor \
    nginx php7-fpm

# Install PHP dependencies
RUN apk add --no-cache --update php7-phar \
    php7-fileinfo php7-soap php7-json

# Configure php-fpm and nginx
COPY config/fpm.conf /etc/php7/php-fpm.d/www.conf
COPY config/supervisord.conf /etc/supervisord.conf
COPY config/nginx.conf /etc/nginx/nginx.conf

# Copy challenge files
COPY challenge /www

# Copy flag
COPY flag /flag

# Setup permissions
RUN chown -R www:www /www /var/tmp/nginx

# Expose the port nginx is listening on
EXPOSE 80

# Populate database and start supervisord
COPY --chown=root entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]