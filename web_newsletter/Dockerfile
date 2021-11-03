FROM python:3-alpine

# Install packages
RUN apk --no-cache add supervisor

# Install dependencies
RUN pip install flask

# Setup app
RUN mkdir -p /app

# Set working environment
WORKDIR /app

# Add application
COPY challenge .

# Setup superivsord
COPY config/supervisord.conf /etc/supervisord.conf

# Expose the port flask is reachable on
EXPOSE 1337

# Start the python application
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]