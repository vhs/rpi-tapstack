#!/bin/sh

sudo apt install qemu-user
sudo docker run --rm --privileged multiarch/qemu-user-static --reset -p yes
