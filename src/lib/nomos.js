const { NOMOS_BASE_URI, NOMOS_API_KEY, REQUIRED_PRIVILEGES } = require("../config");
const log = require("./log");

function checkRfid(id) {
  return new Promise((resolve) => {
    const url = `${NOMOS_BASE_URI}/AuthService1.svc/CheckRfid?rfid=${id}`;
    const opts = {
      headers: { "X-Api-Key": NOMOS_API_KEY }
    };

    https
      .get(url, opts, (resp) => {
        let data = "";

        resp.on("data", chunk => {
          data += chunk;
        });

        resp.on("end", () => {
          log.info(`GET ${url} ${resp.statusCode} ${data}`);

          if (resp.statusCode !== 200 || !data) {
            resolve(false);
            return;
          }

          let json = null;

          try {
            json = JSON.parse(data);
          } catch(e) {
            log.error(e);
            resolve(false);
            return;
          }

          if (!json) {
            log.warn("empty response");
            resolve(false);
            return;
          }

          if (!json.valid) {
            log.info("user invalid");
            resolve(false);
            return;
          }

          if (REQUIRED_PRIVILEGES.length <= 0) {
            log.warn("user is valid but no required privileges");
            resolve(false);
            return;
          }

          if (!json.privileges || json.privileges.length <= 0) {
            log.info("user has no privileges");
            resolve(false);
            return;
          }

          const hasAllRequiredPrivileges = REQUIRED_PRIVILEGES.every(code => json.privileges.some(privilege => privilege && privilege.code === code));

          if (!hasAllRequiredPrivileges) {
            log.info("user is lacking required privileges");
            resolve(false);
            return;
          }

          log.info("user has all required privileges");
          resolve(true);
        });
      })
      .on("error", e => {
        console.log(e);
        resolve(false);
      });
  });
}

module.exports = {
  checkRfid: checkRfid
};
