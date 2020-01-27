const nci = require("node-nfc-nci");
const log = require("./lib/log");
const interval = require("./lib/interval");
const relays = require("./pins");
const { checkRfid } = require("./lib/nomos");

log.info("initializing nci context...");

nci.listen(context => {
  context.on("error", msg => log.error(msg));
  
  context.on("arrived", async tag => {
    log.info(`tag arrived: ${JSON.stringify(tag)}`);

    relays.ch2.signal(true, interval.milliseconds(200));
    
    const resp = await checkRfid(tag.uid.id);
    
    log.info(`tag challenge: ${JSON.stringify(resp)}`);
    
    if (resp) {
      relays.ch1.signal(true, interval.seconds(3));
      relays.ch2.signal(true, interval.milliseconds(200));
    } else {
      await relays.ch2.signal(true, interval.milliseconds(100));
      await relays.ch2.signal(false, interval.milliseconds(10));
      await relays.ch2.signal(true, interval.milliseconds(100));
    }
  });
  
  log.info("nci listening...");
});

setInterval(() => {
  log.info("reporting relay states...");
  const intv = setInterval(() => {
    const isAtRest = Object.entries(relays).every(relay => !relay.timer);

    log.info(`relays at rest: ${isAtRest}`);

    if (!isAtRest) {
      return;
    }

    clearInterval(intv);

    const states = Object.entries(relays).map(relay => `${relay.name}:${relay.id}=${relay.state}`).join(", ");

    log.info(states);
  }, interval.seconds(5));
}, interval.minutes(15));
