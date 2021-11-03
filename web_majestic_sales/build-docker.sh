#!/bin/bash
docker rm -f web_majestic_sales
docker build -t web_majestic_sales . 
docker run --name=web_majestic_sales --rm -p1337:1337 -it web_majestic_sales
