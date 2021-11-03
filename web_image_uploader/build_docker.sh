#!/bin/bash
docker build -t image_uploader .
docker run --rm -p8080:80 -it image_uploader
