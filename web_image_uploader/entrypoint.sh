#!/bin/ash

# Secure entrypoint
chmod 600 /entrypoint.sh

FLAG=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 5 | head -n 1)
mv /flag /flag$FLAG

# Cronjob to delete images every 2 minutes
echo '*/2 * * * * rm /www/uploads/*' >> /var/spool/cron/crontabs/root

# Start cron deamon
crond -f &

/usr/bin/supervisord -c /etc/supervisord.conf