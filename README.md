# RPi Tapstack #

Raspberry Pi + Relay shield + NFC shield + docker

- Raspberry Pi 3 B+ or newer https://www.buyapi.ca/product/raspberry-pi-4-model-b-1gb/
- Raspberry Pi relay HAT https://www.waveshare.com/wiki/RPi_Relay_Board https://www.buyapi.ca/product/rpi-relay-board/
- NXP NFC OM5578/PN7150RPIM https://www.nxp.com/products/rfid-nfc/nfc-hf/nfc-readers/development-kits-for-pn7150-plugn-play-nfc-controller:OM5578 https://www.digikey.ca/product-detail/en/nxp-usa-inc/OM5578%2FPN7150RPIM/568-12997-ND/6128024

This is a docker image that with configuration will activate relays on successful NFC based authentication with VHS nomos.

`npm run build` to build the docker image. `vanhack/rpi-tapstack`

# Enviroment #
`NOMOS_BASE_URI` - default https://membership.vanhack.ca/services/web
`NOMOS_API_KEY_FILE` - API key with Check RFID privilege
`RELAY_CH1_PIN` - GPIO pin for relay 1 default: 37
`RELAY_CH2_PIN` - GPIO pin for relay 1 default: 38
`RELAY_CH3_PIN` - GPIO pin for relay 1 default: 40
