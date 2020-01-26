Copy image to SD

`dd bs=4M if=2019-09-26-raspbian-buster-lite.img of=/dev/sdX status=progress conv=fsync`

create wpa_supplicant.conf on boot partition

```
```

enable ssh

create ssh file on the boot partition
`touch ssh`

boot, apt update && apt upgrade

reboot

raspi-config

enable i2c

reboot

apt update && apt upgrade

install docker
`curl -sSL https://get.docker.com | sh`
