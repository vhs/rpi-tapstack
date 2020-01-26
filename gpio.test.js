const Gpio = require("onoff").Gpio;

const RELAY_CH3_PIN = process.env.RELAY_CH3_PIN || 40;

if (!Gpio.accessible) {
  throw new Error("GPIO is not accessible");
  process.exit(1);
}

const relay = {
  ch3: new Gpio(RELAY_CH3_PIN, "low", { activeLow: true })
};

async function signal(gpio, on = true, timeout) {
  return new Promise(resolve => {
    gpio.writeSync(on ? 1 : 0);
  
    if (timeout) {
      setTimeout(() => { 
        gpio.writeSync(on ? 0 : 1);
        resolve();
      }, timeout);
    } else {
      resolve();
    }
  });
}

await signal(relay.ch3, true, 100);
await signal(relay.ch3, false, 10);
await signal(relay.ch3, true, 100);
