export function releaseTracks(stream) {
  stream?.getTracks().forEach((track) => track.stop());
}
export function recordingMime(Recorder = globalThis.MediaRecorder) {
  return (
    [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/mp4",
      "audio/ogg;codecs=opus",
    ].find((type) => Recorder?.isTypeSupported?.(type)) || ""
  );
}
export async function timedFetch(url, options = {}, timeout = 120000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}
export function microphoneError(error) {
  if (["NotAllowedError", "PermissionDeniedError"].includes(error?.name))
    return "permission_denied";
  if (
    [
      "NotFoundError",
      "DevicesNotFoundError",
      "NotReadableError",
      "OverconstrainedError",
    ].includes(error?.name)
  )
    return "device_unavailable";
  return "start_failure";
}
export class SpeakingRecorder {
  constructor({ onTick, onStop, onError }) {
    Object.assign(this, { onTick, onStop, onError, generation: 0 });
  }
  async start() {
    this.cancel();
    const generation = this.generation;
    if (
      !globalThis.MediaRecorder ||
      !globalThis.navigator?.mediaDevices?.getUserMedia
    )
      throw new Error("unsupported");
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (error) {
      throw new Error(microphoneError(error));
    }
    if (generation !== this.generation) {
      releaseTracks(stream);
      return;
    }
    this.stream = stream;
    let recorder;
    try {
      const mimeType = recordingMime();
      recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      this.recorder = recorder;
      const chunks = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size) chunks.push(event.data);
      };
      recorder.onerror = () => {
        this.cancel();
        this.onError("recorder_error");
      };
      stream.getTracks().forEach((track) => {
        track.onended = () => {
          if (this.recorder) {
            this.cancel();
            this.onError("interrupted");
          }
        };
      });
      recorder.onstop = () => {
        const blob = new Blob(chunks, {
          type: recorder.mimeType || "audio/webm",
        });
        const elapsed = Math.min(60, (Date.now() - this.startedAt) / 1000);
        this.cleanup();
        if (generation === this.generation) this.onStop(blob, elapsed);
      };
      recorder.start(250);
      this.startedAt = Date.now();
      this.onTick(60);
      this.timer = setInterval(() => {
        const remaining = Math.max(
          0,
          60 - Math.floor((Date.now() - this.startedAt) / 1000),
        );
        this.onTick(remaining);
        if (!remaining) this.stop();
      }, 200);
      this.deadline = setTimeout(() => this.stop(), 60000);
    } catch {
      this.cancel();
      throw new Error("start_failure");
    }
  }
  cleanup() {
    clearInterval(this.timer);
    clearTimeout(this.deadline);
    const stream = this.stream;
    this.stream = null;
    this.recorder = null;
    stream?.getTracks().forEach((track) => {
      track.onended = null;
    });
    releaseTracks(stream);
  }
  stop() {
    if (this.recorder?.state === "recording") this.recorder.stop();
  }
  cancel() {
    this.generation++;
    if (this.recorder) {
      this.recorder.onstop = null;
      this.recorder.onerror = null;
      if (this.recorder.state === "recording") this.recorder.stop();
    }
    this.cleanup();
  }
}
