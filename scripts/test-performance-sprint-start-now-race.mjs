import assert from "node:assert/strict";
import {
  createRecordingInteractionGuard,
  RECORDING_INTERACTION_STATES,
  RECORDING_START_INTERACTION_GUARD_MS,
} from "../src/scripts/performance-recording-interaction.js";

let scheduled = null;
let scheduledDelay = null;
let startEvents = 0;
let stopEvents = 0;
let skipEvents = 0;

const guard = createRecordingInteractionGuard({
  schedule(callback, delay) {
    scheduled = callback;
    scheduledDelay = delay;
    return 1;
  },
  cancel() {},
});

const startNow = () => {
  if (!guard.beginStarting()) return false;
  startEvents += 1;
  skipEvents += 1;
  return true;
};
const stop = () => {
  if (!guard.beginStopping()) return false;
  stopEvents += 1;
  guard.markRecorded();
  return true;
};

assert.equal(guard.beginCountdown(), true);
assert.equal(startNow(), true, "the first Start now activation is accepted");
assert.equal(guard.phase(), RECORDING_INTERACTION_STATES.starting);
assert.equal(startNow(), false, "a rapid duplicate Start now activation is rejected synchronously");
assert.equal(stop(), false, "same-coordinate click-through cannot stop during starting");
assert.equal(startEvents, 1);
assert.equal(skipEvents, 1);
assert.equal(stopEvents, 0);
assert.equal(scheduledDelay, RECORDING_START_INTERACTION_GUARD_MS);

scheduled();
assert.equal(guard.phase(), RECORDING_INTERACTION_STATES.recording);
assert.equal(stop(), true, "a deliberate Stop works after the safe interaction boundary");
assert.equal(stopEvents, 1);
assert.equal(guard.phase(), RECORDING_INTERACTION_STATES.recorded);

guard.reset();
assert.equal(guard.beginCountdown(), true);
assert.equal(guard.cancelCountdown(), true);
assert.equal(guard.phase(), RECORDING_INTERACTION_STATES.ready);

assert.equal(guard.beginCountdown(), true);
assert.equal(guard.beginStarting(), true, "natural countdown completion enters the same guarded start path");
startEvents += 1;
scheduled();
assert.equal(stop(), true);
assert.equal(startEvents, 2);
assert.equal(skipEvents, 1, "natural completion does not emit a skip event");

guard.reset();
assert.equal(guard.beginCountdown(), true);
assert.equal(startNow(), true, "retry Start now uses an independent guard cycle");
scheduled();
assert.equal(stop(), true);
assert.equal(startEvents, 3);
assert.equal(skipEvents, 2);
assert.equal(stopEvents, 3);

console.log("Performance Sprint Start Now click-through regression passed");
