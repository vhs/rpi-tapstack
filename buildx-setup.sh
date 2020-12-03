#!/bin/sh

sudo apt install qemu-user
docker run --rm --privileged multiarch/qemu-user-static --reset -p yes
