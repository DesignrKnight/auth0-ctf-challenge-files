#!/bin/bash

docker build --tag=web_newsletter . && \
docker run -p 1337:1337 --rm --name=web_newsletter web_newsletter