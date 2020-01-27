const nci = require("node-nfc-nci");
const log = require("./lib/log");
const relays = require("./pins");
const { checkRfid } = require("./lib/nomos");

log.info("initializing nci context...");

nci.listen(context => {
  context.on("error", msg => log.error(msg));
  
  context.on("arrived", async tag => {
    log.info(`tag arrived: ${JSON.stringify(tag)}`);

    relays.ch2.signal(true, 200);
    
    const resp = await checkRfid(tag.uid.id);
    
    log.info(`tag challenge: ${JSON.stringify(resp)}`);
    
    if (resp) {
      relays.ch1.signal(true, 3000);
      relays.ch2.signal(true, 200);
    } else {
      await relays.ch2.signal(true, 100);
      await relays.ch2.signal(false, 10);
      await relays.ch2.signal(true, 100);
    }
  });
  
  log.info("nci listening...");
});
