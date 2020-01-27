const Gpio = require("onoff").Gpio;
const log = require("./log");
const parseActivationScript = require("./activation");

const ON = 1;
const OFF = 0;

class Pin {
  constructor(id, name, rest) {
    this.id = id;
    this.name = name;
    this.rest = rest === "on" || rest === 1 || rest === true;

    this.gpio = new Gpio(this.id, "low", { activeLow: true });

    this._state = null;

    this.timer = null;
    this.events = {};

    this.state = this.rest;
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

  async signal(on = true, timeout = 0, rest) {
    this.state = on;

    if (timeout) {
      this.clear();

      const self = this;
      await new Promise(resolve => {
        self.timer = setTimeout(() => {
          self.state = rest !== undefined ? rest : this.rest;
          resolve();
        }, timeout);
      });
    }
  }

  on(event, script) {
    let funcs = [];

    for(let step of parseActivationScript(this, script)) {
      funcs.push(step);
    }

    this.events[event] = async () => {
      for(let func of funcs) {
        await func();
      }
    };
  }

  async trigger(event) {
    if (this.events[event]) {
      await this.events[event]();
    }
  }
}

module.exports = Pin;
