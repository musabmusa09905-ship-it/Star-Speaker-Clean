import assert from "node:assert/strict";
import {
  SpeakingRecorder,
  recordingMime,
  microphoneError,
  timedFetch,
} from "../src/scripts/speaking-core.js";
let stopped = 0,
  output,
  failure;
const tracks = [
  {
    stop() {
      stopped++;
    },
    onended: null,
  },
];
Object.defineProperty(globalThis, "navigator", {
  configurable: true,
  value: {
    mediaDevices: { getUserMedia: async () => ({ getTracks: () => tracks }) },
  },
});
class Recorder {
  static isTypeSupported(type) {
    return type === "audio/mp4";
  }
  constructor() {
    this.mimeType = "audio/mp4";
    this.state = "inactive";
  }
  start() {
    this.state = "recording";
  }
  stop() {
    this.state = "inactive";
    this.ondataavailable?.({ data: new Blob(["sample"]) });
    this.onstop?.();
  }
}
globalThis.MediaRecorder = Recorder;
assert.equal(recordingMime(), "audio/mp4");
assert.equal(recordingMime({ isTypeSupported: () => false }), "");
for (const [name, code] of [
  ["NotAllowedError", "permission_denied"],
  ["NotFoundError", "device_unavailable"],
  ["NotReadableError", "device_unavailable"],
  ["Unknown", "start_failure"],
])
  assert.equal(microphoneError({ name }), code);
const r = new SpeakingRecorder({
  onTick() {},
  onStop: (b) => (output = b),
  onError: (c) => (failure = c),
});
await r.start();
r.stop();
assert.ok(output instanceof Blob);
assert.equal(stopped, 1);
assert.equal(r.stream, null);
assert.equal(r.recorder, null);
await r.start();
r.cancel();
assert.equal(stopped, 2);
assert.equal(r.stream, null);
await r.start();
r.recorder.onerror();
assert.equal(stopped, 3);
assert.equal(failure, "recorder_error");
await r.start();
tracks[0].onended();
assert.equal(stopped, 4);
assert.equal(failure, "interrupted");
globalThis.MediaRecorder = class extends Recorder {
  start() {
    throw Error("start");
  }
};
await assert.rejects(() => r.start(), /start_failure/);
assert.equal(stopped, 5);
let resolvePermission;
navigator.mediaDevices.getUserMedia = () =>
  new Promise((resolve) => {
    resolvePermission = resolve;
  });
const pending = r.start();
r.cancel();
resolvePermission({ getTracks: () => tracks });
await pending;
assert.equal(stopped, 6);
assert.equal(r.recorder, null);
globalThis.fetch = (_url, { signal }) =>
  new Promise((_resolve, reject) =>
    signal.addEventListener("abort", () =>
      reject(new DOMException("aborted", "AbortError")),
    ),
  );
await assert.rejects(() => timedFetch("https://example.invalid", {}, 5), {
  name: "AbortError",
});
console.log(
  "Shared recording: stop, cancel, error, interruption, start failure, late permission, MIME fallback and timeout passed.",
);
