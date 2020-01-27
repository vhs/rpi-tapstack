const fs = require("fs");
const nci = require("node-nfc-nci");
const https = require("https");
const Gpio = require("onoff").Gpio;

const NOMOS_BASE_URI = process.env.NOMOS_BASE_URI || "https://membership.vanhack.ca/services/web";

function resolveApiKey() {
  if (process.env.NOMOS_API_KEY_FILE) {
    return fs.readFileSync(process.env.NOMOS_API_KEY_FILE);
  }
  
  return process.env.NOMOS_API_KEY || "";
}

const NOMOS_API_KEY = resolveApiKey();

// BCM pins https://www.waveshare.com/wiki/RPi_Relay_Board
const RELAY_CH1_PIN = process.env.RELAY_CH1_PIN || 26;
const RELAY_CH2_PIN = process.env.RELAY_CH2_PIN || 20;
const RELAY_CH3_PIN = process.env.RELAY_CH3_PIN || 21;

if (!Gpio.accessible) {
  throw new Error("GPIO is not accessible");
  process.exit(1);
}

const relay = {
  ch1: new Gpio(RELAY_CH1_PIN, "low", { activeLow: true }),
  ch2: new Gpio(RELAY_CH2_PIN, "low", { activeLow: true }),
  ch3: new Gpio(RELAY_CH3_PIN, "low", { activeLow: true })
};

function checkRfid(id) {
  return new Promise((resolve, reject) => {
    const url = `${NOMOS_BASE_URI}/AuthService1.svc/CheckRfid?rfid=${id}`;
    const opts = {
      headers: { "X-Api-Key": NOMOS_API_KEY }
    };
    
    https
      .get(url, opts, (resp) => {
        let data = "";
        
        resp.on("data", chunk => {
          data += chunk;
        });
        
        resp.on("end", () => {
          console.log(`GET ${url} ${resp.statusCode} ${data}`);

          if (resp.statusCode !== 200 || !data) {
            resolve(false);
            return;
          }

          const json = JSON.parse(data);
          
          resolve(json);
        });
      })
      .on("error", e => {
        reject(e);
      });
  });
}

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

console.log("initializing nci context...");

nci.listen(context => {
  context.on("error", msg => console.error(msg));
  
  context.on("arrived", async tag => {
    console.log(`tag arrived: ${JSON.stringify(tag)}`);
    
    signal(relay.ch2, true, 200);
    
    const resp = await checkRfid(tag.uid.id);
    
    console.log(`tag challenge: ${JSON.stringify(resp)}`);
    
    if (resp) {
      signal(relay.ch1, true, 3000);
      signal(relay.ch2, true, 200);
    } else {
      await signal(relay.ch2, true, 100);
      await signal(relay.ch2, false, 10);
      await signal(relay.ch2, true, 100);
    }
  });
  
  console.log("nci listening...");
});
