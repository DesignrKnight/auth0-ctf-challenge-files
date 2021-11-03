#!/bin/bash
docker rm -f web_temp_note
docker build -t web_temp_note . 
docker run --name=web_temp_note --rm -p1337:1337 -it web_temp_note
