
function format(msg) {
  return JSON.stringify({
    time: (new Date()).toISOString(),
    message: msg
  });
}

function error(msg) {
  console.error(format(msg));
}

function warn(msg) {
  console.warn(format(msg));
}

function info(msg) {
  console.info(format(msg));
}

function debug(msg) {
  console.debug(format(msg));
}

module.exports = {
  error: error,
  warn: warn,
  info: info,
  debug: debug
};
