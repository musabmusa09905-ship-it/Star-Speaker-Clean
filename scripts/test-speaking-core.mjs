import assert from "node:assert/strict";
import {
  releaseTracks,
  recordingMime,
  timedFetch,
} from "../src/scripts/speaking-core.js";
let stopped = 0;
releaseTracks({
  getTracks: () => [{ stop: () => stopped++ }, { stop: () => stopped++ }],
});
releaseTracks(null);
assert.equal(stopped, 2);
assert.equal(
  recordingMime({ isTypeSupported: (t) => t === "audio/mp4" }),
  "audio/mp4",
);
assert.equal(recordingMime({ isTypeSupported: () => false }), "");
const original = globalThis.fetch;
globalThis.fetch = async (url, { signal }) =>
  new Promise((resolve, reject) =>
    signal.addEventListener("abort", () =>
      reject(new DOMException("Timed out", "AbortError")),
    ),
  );
await assert.rejects(timedFetch("http://localhost", {}, 5), {
  name: "AbortError",
});
globalThis.fetch = original;
const values = new Map();
globalThis.sessionStorage = {
  getItem: (k) => values.get(k),
  setItem: (k, v) => values.set(k, v),
};
let request;
globalThis.fetch = async (url, options) => {
  request = options;
  return Response.json(
    { error: "Türkçe hata", code: "question_invalid" },
    { status: 400 },
  );
};
try {
  const { localizedFetch } = await import(
    "../src/scripts/performance-english-transport.js"
  );
  let response = await localizedFetch("http://localhost", {
    body: JSON.stringify({ action: "get_result" }),
  });
  assert.match((await response.json()).error, /question could not be verified/);
  const identity = JSON.parse(request.body);
  assert.equal(identity.locale, "en");
  assert.match(identity.session_token, /^[a-f0-9]{64}$/);
  const form = new FormData();
  form.set("phase", "first");
  await localizedFetch("http://localhost", { body: form });
  assert.equal(request.body.get("locale"), "en");
  assert.equal(request.body.get("session_token"), identity.session_token);
} finally {
  globalThis.fetch = original;
}
console.log(
  "PASS shared track cleanup, MIME fallback, timeout, English transport ownership and safe error copy. Recorder behavior is covered by canonical browser QA.",
);
