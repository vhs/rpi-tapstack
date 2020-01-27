class Relays {
  constructor(relays = []) {
    this.relays = relays;
  }

  trigger(event) {
    for(let relay of this.relays) {
      relay.trigger(event);
    }
  }
}

module.exports = Relays;
