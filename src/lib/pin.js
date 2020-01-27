const Gpio = require("onoff").Gpio;
const log = require("./log");

const ON = 1;
const OFF = 0;

class Pin {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.gpio = new Gpio(this.id, "low", { activeLow: true });

    this._state = null;

    this.off();

    this.timer = null;
  }

  get state() {
    return this._state;
  }

  set state(value) {
    const v = value ? ON : OFF;
    this._state = v;
    this.gpio.writeSync(v);
    log.info(`PIN ${this.name}:${this.id} ${v}`);
  }

  clear() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  off() {
    this.clear();
    this.state = OFF;
  }

  on() {
    this.clear();
    this.state = ON;
  }

  async signal(on = true, timeout) {
    this.state = on;

    if (timeout) {
      this.clear();

      const self = this;
      await new Promise(resolve => {
        self.timer = setTimeout(() => {
          self.state = !on;
          resolve();
        }, timeout);
      });
    }
  }
}

module.exports = Pin;
