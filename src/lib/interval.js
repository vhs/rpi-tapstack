const MILLISECONDS_IN_SECONDS = 1000;
const MILLISECONDS_IN_MINUTES = 60000;

function milliseconds(n) {
  return n;
}

function seconds(n) {
  return n * MILLISECONDS_IN_SECONDS;
}

function minutes(n) {
  return n * MILLISECONDS_IN_MINUTES;
}

module.exports = {
  milliseconds: milliseconds,
  seconds: seconds,
  minutes: minutes
};
