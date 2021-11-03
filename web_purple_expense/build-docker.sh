#!/bin/bash
docker rm -f web_purple_expense
docker build -t web_purple_expense . 
docker run --name=web_purple_expense --rm -p1337:1337 -it web_purple_expense
