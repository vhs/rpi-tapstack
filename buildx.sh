#!/bin/bash

TEMPLATE=vanhack/rpi-tapstack:test

if [ -f .build.env ]; then
        . .build.env
fi

XBUILDER=$(docker buildx ls | egrep xbuilder)

if [ "$XBUILDER" = "" ]; then
        docker buildx create --name xbuilder --driver docker-container --use
else
        docker buildx use xbuilder
fi

docker buildx build --platform linux/arm/v7 -t $TEMPLATE --load .
