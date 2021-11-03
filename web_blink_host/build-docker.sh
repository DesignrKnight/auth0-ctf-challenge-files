#!/bin/bash
docker rm -f web_blink_host
docker build -t web_blink_host . 
docker run --name=web_blink_host --rm -p1337:1337 -it web_blink_host
