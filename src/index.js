const nci = require("node-nfc-nci");
const log = require("./lib/log");
const relays = require("./relays");
const { checkRfid } = require("./lib/nomos");

log.info("initializing nci context...");

nci.listen(context => {
  context.on("error", msg => log.error(msg));
  
  context.on("arrived", async tag => {
    log.info(`tag arrived: ${JSON.stringify(tag)}`);

    relays.trigger("arrive");

    const resp = await checkRfid(tag.uid.id);
    
    log.info(`tag challenge: ${JSON.stringify(resp)}`);
    
    if (resp) {
      relays.trigger("accept");
    } else {
      relays.trigger("denied");
    }
  });
  
  log.info("nci listening...");
});
