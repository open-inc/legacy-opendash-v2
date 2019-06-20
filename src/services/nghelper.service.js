const applyFunctions = [];

export function triggerDigestCycle() {
  try {
    applyFunctions.forEach(fn => fn());
  } catch (error) {
    // do nothing..
  }
}

export function init(fn) {
  applyFunctions.push(fn);
}
