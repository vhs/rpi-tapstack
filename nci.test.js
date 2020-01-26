const nci = require("node-nfc-nci");

console.log("initializing nci context...");

nci.listen(context => {
  context.on("error", msg => console.error(msg));
  
  context.on("arrived", tag => {
    console.log(`tag arrived: ${JSON.stringify(tag)}`);
  });
  
  console.log("nci listening...");
});
