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

# Install dependencies
RUN yarn

# Patch library
RUN sed -i "s/return done[(]new JsonWebTokenError[(]'jwt signature is required'))/\/\//" /app/node_modules/jsonwebtoken/verify.js

# Setup superivsord
COPY config/supervisord.conf /etc/supervisord.conf

# Expose the port node-js is reachable on
EXPOSE 1337

# Start the node-js application
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
