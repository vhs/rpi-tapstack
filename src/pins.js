const Pin = require("./lib/pin");

if (!Gpio.accessible) {
  throw new Error("GPIO is not accessible");
  process.exit(1);
}

module.exports = {
  ch1: new Pin(RELAY_CH1_PIN, "RELAY_CH1_PIN"),
  ch2: new Pin(RELAY_CH2_PIN, "RELAY_CH1_PIN"),
  ch3: new Pin(RELAY_CH3_PIN, "RELAY_CH1_PIN")
};
