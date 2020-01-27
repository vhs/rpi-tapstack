# RPi Tapstack #

Raspberry Pi + Relay shield + NFC shield + docker

- Raspberry Pi 3 B+ or newer https://www.buyapi.ca/product/raspberry-pi-4-model-b-1gb/
- Raspberry Pi relay HAT https://www.waveshare.com/wiki/RPi_Relay_Board https://www.buyapi.ca/product/rpi-relay-board/
- NXP NFC OM5578/PN7150RPIM https://www.nxp.com/products/rfid-nfc/nfc-hf/nfc-readers/development-kits-for-pn7150-plugn-play-nfc-controller:OM5578 https://www.digikey.ca/product-detail/en/nxp-usa-inc/OM5578%2FPN7150RPIM/568-12997-ND/6128024

This is a docker image that with configuration will activate relays on successful NFC based authentication with VHS nomos.

`npm run build` to build the docker image. `vanhack/rpi-tapstack`

# Enviroment #
- `NOMOS_BASE_URI` - default https://membership.vanhack.ca/services/web
- `NOMOS_API_KEY_FILE` - API key with Check RFID privilege

see https://www.waveshare.com/wiki/RPi_Relay_Board
- `RELAY_CH1_PIN` - GPIO pin for relay 1 default: 26
- `RELAY_CH2_PIN` - GPIO pin for relay 2 default: 20
- `RELAY_CH3_PIN` - GPIO pin for relay 3 default: 21

relay channel default resting states
- `RESTING_CH1` - relay pin activation script string, default `off`
- `RESTING_CH2` - relay pin activation script string, default `off`
- `RESTING_CH3` - relay pin activation script string, default `off`

tag `arrive` event
- `ON_ARRIVE_CH1` - relay pin activation script string, default `off`
- `ON_ARRIVE_CH2` - relay pin activation script string, default `off`
- `ON_ARRIVE_CH3` - relay pin activation script string, default `off`

tag `accept` event
- `ON_ACCEPT_CH1` - relay pin activation script string, default `off`
- `ON_ACCEPT_CH2` - relay pin activation script string, default `off`
- `ON_ACCEPT_CH3` - relay pin activation script string, default `off`

tag `denied` event
- `ON_DENIED_CH1` - relay pin activation script string, default `off`
- `ON_DENIED_CH2` - relay pin activation script string, default `off`
- `ON_DENIED_CH3` - relay pin activation script string, default `off`

relay pin activation scripts:
`on|off[:duration[:on|off]][,...]`

- `off` - will set to off state
- `on` - will set to on state
- `on:200` - will set on to 200 milliseconds then return to resting state
- `on:200:off` - will set to on for 200 milliseconds then return to defined resting state of off
- `on:200,off:10,on:200` - on for 200 milliseconds then off for 10 milliseconds then on for 200 milliseconds

example:
- let default pin resting = on
- arrive event `off` - on a tag arrival set state to off, without a duration it will stay at state indefinitely
- denied event `on:200:off` - will set on for 200 milliseconds then return to defined resting of off
- accept event `on:200` - will set on for 200 milliseconds then return to default resting of on
