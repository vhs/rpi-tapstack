#!/bin/bash

TEMPLATE=vanhack/rpi-tapstack:buildx-test

if [ -f .build.env ]; then
        . .build.env
fi

XBUILDER=$(docker buildx ls | egrep xbuilder)

if [ "$XBUILDER" = "" ]; then
        docker buildx create --name xbuilder --driver docker-container --use
else
        docker buildx use xbuilder
fi

docker buildx build --platform linux/arm64,linux/arm/v7,linux/arm/v6 -t $TEMPLATE --push .
