#!/bin/sh

sudo apt update
sudo apt install -y qemu-user jq
sudo docker run --rm --privileged multiarch/qemu-user-static --reset -p yes
