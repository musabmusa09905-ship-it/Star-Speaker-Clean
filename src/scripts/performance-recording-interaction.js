export const RECORDING_INTERACTION_STATES = Object.freeze({
  ready: "ready",
  countdown: "countdown",
  starting: "starting",
  recording: "recording",
  stopping: "stopping",
  recorded: "recorded",
});

// A double-click/tap can retarget its second activation after the countdown overlay disappears.
// Keep Stop unavailable across that interaction boundary; the state guard remains authoritative
// even if CSS, layout, or a browser's synthesized click behavior changes.
export const RECORDING_START_INTERACTION_GUARD_MS = 1200;

export function createRecordingInteractionGuard({
  schedule = (callback, delay) => window.setTimeout(callback, delay),
  cancel = (id) => window.clearTimeout(id),
} = {}) {
  let phase = RECORDING_INTERACTION_STATES.ready;
  let stableTimer = null;

  const clearStableTimer = () => {
    if (stableTimer !== null) cancel(stableTimer);
    stableTimer = null;
  };

  return {
    phase: () => phase,
    beginCountdown() {
      if (![RECORDING_INTERACTION_STATES.ready, RECORDING_INTERACTION_STATES.recorded].includes(phase)) return false;
      clearStableTimer();
      phase = RECORDING_INTERACTION_STATES.countdown;
      return true;
    },
    cancelCountdown() {
      if (phase !== RECORDING_INTERACTION_STATES.countdown) return false;
      clearStableTimer();
      phase = RECORDING_INTERACTION_STATES.ready;
      return true;
    },
    beginStarting(onStable) {
      if (phase !== RECORDING_INTERACTION_STATES.countdown) return false;
      phase = RECORDING_INTERACTION_STATES.starting;
      stableTimer = schedule(() => {
        stableTimer = null;
        if (phase !== RECORDING_INTERACTION_STATES.starting) return;
        phase = RECORDING_INTERACTION_STATES.recording;
        onStable?.();
      }, RECORDING_START_INTERACTION_GUARD_MS);
      return true;
    },
    beginStopping() {
      if (phase !== RECORDING_INTERACTION_STATES.recording) return false;
      phase = RECORDING_INTERACTION_STATES.stopping;
      return true;
    },
    markRecorded() {
      if (![RECORDING_INTERACTION_STATES.recording, RECORDING_INTERACTION_STATES.stopping].includes(phase)) return false;
      clearStableTimer();
      phase = RECORDING_INTERACTION_STATES.recorded;
      return true;
    },
    reset() {
      clearStableTimer();
      phase = RECORDING_INTERACTION_STATES.ready;
    },
  };
}
