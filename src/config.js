const fs = require("fs");

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

const RESTING_CH1 = process.env.RESTING_CH1 || "off";
const RESTING_CH2 = process.env.RESTING_CH1 || "off";
const RESTING_CH3 = process.env.RESTING_CH1 || "off";

const ON_ARRIVE_CH1 = process.env.ON_ARRIVE_CH1 || "off";
const ON_ARRIVE_CH2 = process.env.ON_ARRIVE_CH1 || "on:200";
const ON_ARRIVE_CH3 = process.env.ON_ARRIVE_CH1 || "off";

const ON_ACCEPT_CH1 = process.env.ON_ACCEPT_CH1 || "on:3000";
const ON_ACCEPT_CH2 = process.env.ON_ACCEPT_CH2 || "on:200";
const ON_ACCEPT_CH3 = process.env.ON_ACCEPT_CH3 || "off";

const ON_DENIED_CH1 = process.env.ON_DENIED_CH1 || "off";
const ON_DENIED_CH2 = process.env.ON_DENIED_CH2 || "on:200,off:10,on:200";
const ON_DENIED_CH3 = process.env.ON_DENIED_CH3 || "off";

module.exports = {
  REQUIRED_PRIVILEGES: REQUIRED_PRIVILEGES,
  NOMOS_BASE_URI: NOMOS_BASE_URI,
  NOMOS_API_KEY: NOMOS_API_KEY,
  RELAY_CH1_PIN: RELAY_CH1_PIN,
  RELAY_CH2_PIN: RELAY_CH2_PIN,
  RELAY_CH3_PIN: RELAY_CH3_PIN,
  RESTING_CH1: RESTING_CH1,
  RESTING_CH2: RESTING_CH2,
  RESTING_CH3: RESTING_CH3,
  ON_ARRIVE_CH1: ON_ARRIVE_CH1,
  ON_ARRIVE_CH2: ON_ARRIVE_CH2,
  ON_ARRIVE_CH3: ON_ARRIVE_CH3,
  ON_ACCEPT_CH1: ON_ACCEPT_CH1,
  ON_ACCEPT_CH2: ON_ACCEPT_CH2,
  ON_ACCEPT_CH3: ON_ACCEPT_CH3,
  ON_DENIED_CH1: ON_DENIED_CH1,
  ON_DENIED_CH2: ON_DENIED_CH2,
  ON_DENIED_CH3: ON_DENIED_CH3
};
