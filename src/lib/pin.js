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

  off() {
    if (self.timer) {
      clearTimeout(self.timer);
      self.timer = null;
    }

    this._state = OFF;
    this.gpio.writeSync(OFF);
  }

  on() {
    if (self.timer) {
      clearTimeout(self.timer);
      self.timer = null;
    }

    this._state = ON;
    this.gpio.writeSync(OFF);
  }

  async signal(on = true, timeout) {
    const self = this;

    self.state = on;

    if (timeout) {
      if (self.timer) {
        clearTimeout(self.timer);
        self.timer = null;
      }

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
