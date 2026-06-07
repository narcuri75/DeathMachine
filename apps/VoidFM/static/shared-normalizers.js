(function initSharedNormalizers(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  root.VoidFmNormalizers = api;
})(typeof globalThis !== "undefined" ? globalThis : this, () => {
  const MAX_FADE_SECONDS = 10;

  function preciseMs(value) {
    const number = Number(value);
    if (!Number.isFinite(number) || number <= 0) return 0;
    return Math.round(number * 1000) / 1000;
  }

  function normalizeFadeSeconds(value, fallback = 0) {
    if (value === null || value === undefined || value === "") return fallback;
    const seconds = Number(value);
    if (!Number.isFinite(seconds)) return fallback;
    return Math.round(Math.max(0, Math.min(MAX_FADE_SECONDS, seconds)) * 10) / 10;
  }

  function normalizeTrackTrim(value = {}, durationMs = 0) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return null;
    let startMs = Number(value.startMs ?? value.trimStartMs ?? value.startTimeMs ?? 0);
    let endMs = Number(value.endMs ?? value.trimEndMs ?? value.endTimeMs ?? 0);
    startMs = Number.isFinite(startMs) ? Math.max(0, Math.round(startMs)) : 0;
    endMs = Number.isFinite(endMs) ? Math.max(0, Math.round(endMs)) : 0;
    const duration = Math.max(0, Math.round(Number(durationMs || 0)));
    if (duration > 0) {
      if (startMs >= duration) startMs = Math.max(0, duration - 1000);
      if (endMs > duration) endMs = duration;
    }
    if (endMs > 0 && endMs <= startMs) endMs = 0;
    return startMs > 0 || endMs > 0 ? { startMs, endMs } : null;
  }

  return {
    MAX_FADE_SECONDS,
    preciseMs,
    normalizeFadeSeconds,
    normalizeTrackTrim
  };
});
