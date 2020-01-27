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

module.exports = {
  REQUIRED_PRIVILEGES: REQUIRED_PRIVILEGES,
  NOMOS_BASE_URI: NOMOS_BASE_URI,
  NOMOS_API_KEY: NOMOS_API_KEY,
  RELAY_CH1_PIN: RELAY_CH1_PIN,
  RELAY_CH2_PIN: RELAY_CH2_PIN,
  RELAY_CH3_PIN: RELAY_CH3_PIN
};
