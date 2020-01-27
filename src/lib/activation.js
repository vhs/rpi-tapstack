/*
`on|off[:duration[:on|off]][,...]`

`off` - will set to off state
`on` - will set to on state
`on:200` - will set on to 200 milliseconds then return to resting state
`on:200:off` - will set to on for 200 milliseconds then return to defined resting state of off
`on:200,off:10,on:200` - on for 200 milliseconds then off for 10 milliseconds then on for 200 milliseconds

example:
let default pin resting = on
arrive event `off` - on a tag arrival set state to off, without a duration it will stay at state indefinitely
denied event `on:200:off` - will set on for 200 milliseconds then return to defined resting of off
accept event `on:200` - will set on for 200 milliseconds then return to default resting of on
 */
function* parseActivationScript(pin, script) {
  const steps = script.split(",").filter(s => s).map(s => s.trim());

  if (steps.length <= 0) {
    return [];
  }

  for (let step of steps) {
    const parts = step.split(":").filter(s => s).map(s => s.trim());

    if (parts <= 0) continue;

    const state = parts[0] === "on";
    let duration = undefined;
    let rest = !state;

    if (parts.length > 1) {
      duration = parts[1];
    }

    if (parts.length > 2) {
      rest = parts[2] === "on";
    }

    yield async () => { await pin.signal(state, duration, rest); };
  }
}

module.exports = parseActivationScript;
