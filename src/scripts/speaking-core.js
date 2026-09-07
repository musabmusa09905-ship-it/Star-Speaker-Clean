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
