FROM node:current-buster-slim

# Install packages
RUN apt-get update \
    && apt-get install -y supervisor \
    && rm -rf /var/lib/apt/lists/*
    
# Setup app
RUN mkdir -p /app

# Add application
WORKDIR /app
COPY challenge .

# Copy flag
COPY flag /flag

# Set admin password
RUN SECRET=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 15 | head -n 1) \
    && sed -i "s/REDACTED_SECRET_0/$SECRET/g" /app/database.js

# Add SECRET used for the first tenant
RUN SECRET=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 15 | head -n 1) \
	&& sed -i "s/REDACTED_SECRET_1/$SECRET/g" /app/database.js

# Add SECRET used for the second tenant
RUN SECRET=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 15 | head -n 1) \
    && sed -i "s/REDACTED_SECRET_2/$SECRET/g" /app/database.js

# Install dependencies
RUN yarn

# Setup superivsord
COPY config/supervisord.conf /etc/supervisord.conf

# Expose the port node-js is reachable on
EXPOSE 1337

# Start the node-js application
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]



