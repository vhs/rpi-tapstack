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
