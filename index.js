const fs = require("fs");
const nci = require("node-nfc-nci");
const https = require("https");
const Gpio = require("onoff").Gpio;

const REQUIRED_PRIVILEGES = (process.env.REQUIRED_PRIVILEGES || "").split(",").filter(p => p).map(p => p.trim());

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
  ch1: new Gpio(RELAY_CH1_PIN, "low"),
  ch2: new Gpio(RELAY_CH2_PIN, "low"),
  ch3: new Gpio(RELAY_CH3_PIN, "low")
};

relay.ch1.writeSync(0);
relay.ch2.writeSync(1);
relay.ch3.writeSync(0);

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

          let json = null;
          
          try {
            json = JSON.parse(data);
          } catch(e) {
            console.log(e);
            resolve(false);
            return;
          }
          
          if (!json) {
            console.log("empty response");
            resolve(false);
            return;
          }
          
          if (!json.valid) {
            console.log("user invalid");
            resolve(false);
            return;
          }
          
          if (REQUIRED_PRIVILEGES.length <= 0) {
            console.log("user is valid but no required privileges");
            resolve(false);
            return;
          }
          
          if (!json.privileges || json.privileges.length <= 0) {
            console.log("user has no privileges");
            resolve(false);
            return;
          }
          
          const hasAllRequiredPrivileges = REQUIRED_PRIVILEGES.every(code => json.privileges.some(privilege => privilege && privilege.code === code));
          
          if (!hasAllRequiredPrivileges) {
            console.log("user is lacking required privileges");
            resolve(false);
            return;
          }
          
          console.log("user has all required privileges");
          resolve(true);
        });
      })
      .on("error", e => {
        console.log(e);
        resolve(false);
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
