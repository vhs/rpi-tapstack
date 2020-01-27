const Gpio = require("onoff").Gpio;
const Relays = require("./lib/relays");
const Pin = require("./lib/pin");
const {
  RELAY_CH1_PIN, RELAY_CH2_PIN, RELAY_CH3_PIN,
  RESTING_CH1, RESTING_CH2, RESTING_CH3,
  ON_ARRIVE_CH1, ON_ARRIVE_CH2, ON_ARRIVE_CH3,
  ON_ACCEPT_CH1, ON_ACCEPT_CH2, ON_ACCEPT_CH3,
  ON_DENIED_CH1, ON_DENIED_CH2, ON_DENIED_CH3
} = require("./config");

if (!Gpio.accessible) {
  throw new Error("GPIO is not accessible");
  process.exit(1);
}

const relays = {
  ch1: new Pin(RELAY_CH1_PIN, "RELAY_CH1_PIN", RESTING_CH1),
  ch2: new Pin(RELAY_CH2_PIN, "RELAY_CH2_PIN", RESTING_CH2),
  ch3: new Pin(RELAY_CH3_PIN, "RELAY_CH3_PIN", RESTING_CH3)
};

relays.ch1.on("arrive", ON_ARRIVE_CH1);
relays.ch2.on("arrive", ON_ARRIVE_CH2);
relays.ch3.on("arrive", ON_ARRIVE_CH3);

relays.ch1.on("accept", ON_ACCEPT_CH1);
relays.ch2.on("accept", ON_ACCEPT_CH2);
relays.ch3.on("accept", ON_ACCEPT_CH3);

relays.ch1.on("denied", ON_DENIED_CH1);
relays.ch2.on("denied", ON_DENIED_CH2);
relays.ch3.on("denied", ON_DENIED_CH3);

module.exports = new Relays(Object.entries(relays));
