const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));
const APP_ASSET_VERSION = "20260605-cleanup-normalizers";
const STARTUP_LOADER_MIN_MS = 350;
const STARTUP_LOADER_PREVIEW = new URLSearchParams(window.location.search).get("previewLoader") === "1";
const STARTUP_LOADER_STARTED_AT = typeof performance !== "undefined" && typeof performance.now === "function"
  ? performance.now()
  : Date.now();
let startupLoaderProgress = 0;
let startupLoaderTrickleTimer = 0;
const CLICK_FEEDBACK_SELECTOR = "button, a.tool-button";
const CLICK_FEEDBACK_CLASS = "button-click-feedback";
const clickFeedbackTimers = new WeakMap();
let localApiToken = "";
const {
  preciseMs,
  normalizeFadeSeconds,
  normalizeTrackTrim
} = window.VoidFmNormalizers || {};

function startupNow() {
  return typeof performance !== "undefined" && typeof performance.now === "function"
    ? performance.now()
    : Date.now();
}

function setStartupLoaderStatus(status, stage = "") {
  const statusEl = $("#startupLoaderStatus");
  const stageEl = $("#startupLoaderStage");
  if (statusEl) statusEl.textContent = status;
  if (stageEl && stage) stageEl.textContent = stage;
}

function setStartupLoaderProgress(value) {
  const loader = $("#startupLoader");
  if (!loader) return;
  startupLoaderProgress = Math.max(startupLoaderProgress, Math.max(0, Math.min(1, Number(value) || 0)));
  loader.style.setProperty("--startup-progress", startupLoaderProgress.toFixed(3));
  const percent = loader.querySelector("[data-startup-progress-percent]");
  if (percent) percent.textContent = `${Math.round(startupLoaderProgress * 100)}%`;
}

function startStartupLoaderTrickle() {
  if (startupLoaderTrickleTimer) return;
  setStartupLoaderProgress(0.04);
  startupLoaderTrickleTimer = window.setInterval(() => {
    const target = startupLoaderProgress < 0.55 ? 0.055 : startupLoaderProgress < 0.78 ? 0.028 : 0.01;
    setStartupLoaderProgress(Math.min(0.9, startupLoaderProgress + target));
    if (startupLoaderProgress >= 0.9) {
      clearInterval(startupLoaderTrickleTimer);
      startupLoaderTrickleTimer = 0;
    }
  }, 420);
}

function completeStartupLoader() {
  const loader = $("#startupLoader");
  if (!loader) {
    window.__VOIDFM_READY__ = true;
    return;
  }
  if (startupLoaderTrickleTimer) {
    clearInterval(startupLoaderTrickleTimer);
    startupLoaderTrickleTimer = 0;
  }
  setStartupLoaderProgress(1);
  loader.setAttribute("aria-busy", "false");
  const elapsed = startupNow() - STARTUP_LOADER_STARTED_AT;
  const delay = Math.max(260, STARTUP_LOADER_MIN_MS - elapsed);
  window.setTimeout(() => {
    loader.classList.add("is-complete");
    window.setTimeout(() => {
      loader.remove();
      window.__VOIDFM_READY__ = true;
    }, 420);
  }, delay);
}

function showStartupLoaderError(error) {
  const loader = $("#startupLoader");
  if (!loader) {
    document.body.innerHTML = `<div class="empty-state">${escapeHtml(error.message)}</div>`;
    return;
  }
  loader.classList.add("is-error");
  loader.setAttribute("aria-busy", "false");
  setStartupLoaderStatus("VoidFM could not finish loading", error.message || "Startup failed.");
}

function ensureCurrentStylesheet() {
  if (document.getElementById("voidfm-current-stylesheet")) return;
  const link = document.createElement("link");
  link.id = "voidfm-current-stylesheet";
  link.rel = "stylesheet";
  link.href = `./styles.css?v=${APP_ASSET_VERSION}`;
  document.head.append(link);
}

const icons = {
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/></svg>',
  list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/></svg>',
  ban: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="m5.7 5.7 12.6 12.6"/></svg>',
  link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.1 0l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1"/><path d="M14 11a5 5 0 0 0-7.1 0l-2 2A5 5 0 0 0 12 20.1l1.1-1.1"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/><path d="M19.4 15a1.8 1.8 0 0 0 .36 2l.04.04a2.1 2.1 0 0 1-3 3l-.04-.04a1.8 1.8 0 0 0-2-.36 1.8 1.8 0 0 0-1 1.64V21a2.1 2.1 0 0 1-4.2 0v-.06a1.8 1.8 0 0 0-1-1.64 1.8 1.8 0 0 0-2 .36l-.04.04a2.1 2.1 0 0 1-3-3l.04-.04a1.8 1.8 0 0 0 .36-2 1.8 1.8 0 0 0-1.64-1H3a2.1 2.1 0 0 1 0-4.2h.06a1.8 1.8 0 0 0 1.64-1 1.8 1.8 0 0 0-.36-2l-.04-.04a2.1 2.1 0 0 1 3-3l.04.04a1.8 1.8 0 0 0 2 .36H9.4a1.8 1.8 0 0 0 1-1.64V3a2.1 2.1 0 0 1 4.2 0v.06a1.8 1.8 0 0 0 1 1.64 1.8 1.8 0 0 0 2-.36l.04-.04a2.1 2.1 0 0 1 3 3l-.04.04a1.8 1.8 0 0 0-.36 2v.06a1.8 1.8 0 0 0 1.64 1H21a2.1 2.1 0 0 1 0 4.2h-.06a1.8 1.8 0 0 0-1.54 1Z"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>',
  refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 0 0-15.3-6.3L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 15.3 6.3L21 16"/><path d="M16 16h5v5"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7Z"/></svg>',
  pause: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>',
  next: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m6 18 8.5-6L6 6v12Z"/><path d="M16 6h2v12h-2z"/></svg>',
  previous: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 6 9.5 12 18 18V6Z"/><path d="M6 6h2v12H6z"/></svg>',
  shuffle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 3h5v5"/><path d="M4 20 21 3"/><path d="M21 16v5h-5"/><path d="m15 15 6 6"/><path d="m4 4 5 5"/></svg>',
  repeat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m17 2 4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15"/><path d="m7 22-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/></svg>',
  repeatOne: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m17 2 4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15"/><path d="m7 22-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/><path d="M12 10v5"/></svg>',
  grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="4" width="6" height="6" rx="1.5"/><rect x="4" y="14" width="6" height="6" rx="1.5"/><rect x="14" y="14" width="6" height="6" rx="1.5"/></svg>',
  power: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v10"/><path d="M18.4 6.6a9 9 0 1 1-12.8 0"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',
  minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/></svg>',
  volume: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="M16 9a5 5 0 0 1 0 6"/></svg>',
  volumeMuted: '<svg class="volume-muted-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M11 5 6 9H3v6h3l5 4V5Z"/><path class="mute-x" d="m17 9 4 4"/><path class="mute-x" d="m21 9-4 4"/></svg>',
  speaker: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a9 9 0 0 1 0 14"/></svg>',
  mic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><path d="M12 19v3"/><path d="M8 22h8"/></svg>',
  popout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></svg>',
  arrowLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>',
  arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>',
  save: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/></svg>',
  upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/></svg>',
  edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"/></svg>',
  more: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  chord: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l10-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="16" cy="16" r="3"/></svg>',
  equalizer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 21V9"/><path d="M12 21V3"/><path d="M20 21v-7"/><path d="M2 9h4"/><path d="M10 3h4"/><path d="M18 14h4"/></svg>',
  wave: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h3l2-5 4 10 3-7 2 2h4"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg>',
  folder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/></svg>',
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>'
};

const DEFAULT_VOLUME = 0.5;
const ADVANCED_PLAYBACK_SETTINGS_KEY = "voidfm.advancedPlayback.v1";
const LIBRARY_FILTER_SETTINGS_KEY = "voidfm.libraryFilterSettings.v1";
const PLAYLIST_SORT_SETTINGS_KEY = "voidfm.playlistSort.v1";
const PLEX_AUTH_COLLAPSED_KEY = "voidfm.plexAuthCollapsed.v1";
const YEAR_REVIEW_SEEN_KEY_PREFIX = "voidfm.yearReviewSeen.";
const YEAR_REVIEW_HOTKEY = ";sumyear";
const YEAR_REVIEW_CLIP_SECONDS = 14;
const YEAR_REVIEW_AUDIO_FADE_MS = 700;
const SHUFFLE_PROFILE_EXPORT_KIND = "voidfm.shuffleProfile";
const MAX_FADE_SECONDS = 10;
const LYRICS_LOOKUP_VERSION = 3;
const LYRICS_MISS_RETRY_MS = 24 * 60 * 60 * 1000;
const LYRICS_PLAIN_RETRY_MS = 7 * 24 * 60 * 60 * 1000;
const LYRICS_INSTRUMENTAL_RETRY_MS = 30 * 24 * 60 * 60 * 1000;
const EQ_GAIN_MIN = -12;
const EQ_GAIN_MAX = 12;
const EQ_PREAMP_MIN = -12;
const EQ_PREAMP_MAX = 6;
const EQ_EXPORT_KIND = "voidfm.eqPresets";
const PLAYBACK_SPEED_MIN = -4;
const PLAYBACK_SPEED_MAX = 4;
const PLAYBACK_SPEED_STEP = 0.25;
const SLEEP_TIMER_MINUTES = Array.from({ length: 12 }, (_, index) => (index + 1) * 15);
const PITCH_SHIFT_MIN = -12;
const PITCH_SHIFT_MAX = 12;
const PITCH_SHIFT_DELAY_DEPTH_SECONDS = 0.085;
const SOFT_SKIP_FADE_SECONDS = 2.5;
const SOFT_SKIP_PREPARE_TIMEOUT_MS = 6500;
const AB_LOOP_MIN_MS = 500;
const AB_LOOP_TIMELINE_MARGIN_MS = 1000;
const AB_LOOP_BOUNDARY_EARLY_MS = 4;
const AB_LOOP_SEEK_GUARD_MS = 110;
const AB_LOOP_SEEKING_GUARD_MS = 35;
const AB_LOOP_ADVANCED_VIEW = "looperAdvanced";
const AB_LOOP_WAVEFORM_PEAK_COUNT = 7200;
const AB_LOOP_WAVEFORM_PEAKS_PER_SECOND = 80;
const AB_LOOP_WAVEFORM_MAX_PEAK_COUNT = 48000;
const AB_LOOP_WAVEFORM_CACHE_LIMIT = 6;
const AB_LOOP_WAVEFORM_MIN_WINDOW_MS = 1250;
const AB_LOOP_WAVEFORM_ZOOM_FACTOR = 1.28;
const TIMELINE_RANGE_MAX = 1000000;
const TIMELINE_SCRUB_SEEK_THROTTLE_MS = 75;
const TIMELINE_SCRUB_IDLE_COMMIT_MS = 220;
const REVERSE_PLAYBACK_TICK_MS = 90;
const REVERSE_BUFFER_CACHE_LIMIT = 2;
const EQ_STANDARD_BANDS = [
  { key: "bass", label: "Bass", frequency: 60, display: "60 Hz", type: "lowshelf" },
  { key: "lowMids", label: "Low-Mids", frequency: 250, display: "250 Hz", type: "peaking", q: 1 },
  { key: "mids", label: "Mids", frequency: 1000, display: "1 kHz", type: "peaking", q: 1 },
  { key: "highMids", label: "High Mids", frequency: 4000, display: "4 kHz", type: "peaking", q: 1 },
  { key: "treble", label: "Treble", frequency: 16000, display: "16 kHz", type: "highshelf" }
];
const EQ_ADVANCED_BANDS = [
  { key: "hz31", label: "31 Hz", frequency: 31, display: "31 Hz", type: "lowshelf" },
  { key: "hz62", label: "62 Hz", frequency: 62, display: "62 Hz", type: "peaking", q: 1.4 },
  { key: "hz125", label: "125 Hz", frequency: 125, display: "125 Hz", type: "peaking", q: 1.4 },
  { key: "hz250", label: "250 Hz", frequency: 250, display: "250 Hz", type: "peaking", q: 1.4 },
  { key: "hz500", label: "500 Hz", frequency: 500, display: "500 Hz", type: "peaking", q: 1.4 },
  { key: "hz1000", label: "1 kHz", frequency: 1000, display: "1 kHz", type: "peaking", q: 1.4 },
  { key: "hz2000", label: "2 kHz", frequency: 2000, display: "2 kHz", type: "peaking", q: 1.4 },
  { key: "hz4000", label: "4 kHz", frequency: 4000, display: "4 kHz", type: "peaking", q: 1.4 },
  { key: "hz8000", label: "8 kHz", frequency: 8000, display: "8 kHz", type: "peaking", q: 1.4 },
  { key: "hz16000", label: "16 kHz", frequency: 16000, display: "16 kHz", type: "highshelf" }
];
const EQ_PRESET_GROUPS = [
  ["Core", ["Flat", "Bass Boost", "Deep Bass", "Punchy Bass", "Bass Reducer", "Treble Boost", "Treble Reducer", "Loudness", "Warm", "Bright", "V-Shape"]],
  ["Voice", ["Vocal Boost", "Vocal Softener", "Podcast"]],
  ["Listening", ["Night Mode", "Headphones", "Harsh Headphones Fix", "Car", "Small Speakers", "Bluetooth Speaker", "Ear Saver"]],
  ["Genres", ["Rock", "Pop", "Hip-Hop", "West Coast Hip-Hop", "Electronic", "Synthwave", "Metal", "Progressive Metal", "Nu Metal", "Jazz", "Classical", "Acoustic", "Lo-Fi"]],
  ["VoidFM", ["Cyberpunk"]],
  ["Advanced Fixes", ["Mud Cleaner", "Boxy Room Fix", "Presence Boost", "De-Harsh", "Air Boost", "Vinyl Warmth", "Compressed Audio Rescue", "Old Speakers Fix", "Subwoofer Tame", "Live Room", "Studio Reference"]]
];
const STANDARD_EQ_PRESETS = [
  { name: "Flat", bands: { bass: 0, lowMids: 0, mids: 0, highMids: 0, treble: 0 } },
  { name: "Bass Boost", bands: { bass: 4, lowMids: 2, mids: 0, highMids: 0, treble: 0 } },
  { name: "Deep Bass", bands: { bass: 5, lowMids: 1, mids: -1, highMids: 0, treble: 1 } },
  { name: "Bass Reducer", bands: { bass: -4, lowMids: -2, mids: 0, highMids: 0, treble: 1 } },
  { name: "Treble Boost", bands: { bass: 0, lowMids: -1, mids: 0, highMids: 2, treble: 4 } },
  { name: "Treble Reducer", bands: { bass: 1, lowMids: 0, mids: 0, highMids: -2, treble: -4 } },
  { name: "Loudness", bands: { bass: 4, lowMids: 1, mids: 0, highMids: 1, treble: 3 } },
  { name: "Warm", bands: { bass: 2, lowMids: 2, mids: 0, highMids: -1, treble: -2 } },
  { name: "Bright", bands: { bass: -1, lowMids: -1, mids: 0, highMids: 2, treble: 3 } },
  { name: "V-Shape", bands: { bass: 4, lowMids: 0, mids: -2, highMids: 2, treble: 4 } },
  { name: "Vocal Boost", bands: { bass: -2, lowMids: -1, mids: 2, highMids: 4, treble: 1 } },
  { name: "Vocal Softener", bands: { bass: 1, lowMids: 1, mids: 0, highMids: -3, treble: -2 } },
  { name: "Podcast", bands: { bass: -3, lowMids: -2, mids: 3, highMids: 3, treble: -1 } },
  { name: "Night Mode", bands: { bass: -4, lowMids: -2, mids: 0, highMids: 1, treble: -2 } },
  { name: "Headphones", bands: { bass: -1, lowMids: 0, mids: 1, highMids: 1, treble: 2 } },
  { name: "Car", bands: { bass: 3, lowMids: 1, mids: -1, highMids: 2, treble: 2 } },
  { name: "Small Speakers", bands: { bass: 2, lowMids: 1, mids: 0, highMids: 2, treble: 3 } },
  { name: "Bluetooth Speaker", bands: { bass: 3, lowMids: 1, mids: -1, highMids: 2, treble: 2 } },
  { name: "Rock", bands: { bass: 3, lowMids: 1, mids: -1, highMids: 2, treble: 2 } },
  { name: "Pop", bands: { bass: 2, lowMids: 0, mids: 1, highMids: 2, treble: 3 } },
  { name: "Hip-Hop", bands: { bass: 5, lowMids: 2, mids: -1, highMids: 1, treble: 2 } },
  { name: "West Coast Hip-Hop", bands: { bass: 4, lowMids: 2, mids: 0, highMids: 1, treble: 3 } },
  { name: "Electronic", bands: { bass: 4, lowMids: 0, mids: -1, highMids: 2, treble: 4 } },
  { name: "Synthwave", bands: { bass: 3, lowMids: 1, mids: -1, highMids: 2, treble: 4 } },
  { name: "Metal", bands: { bass: 3, lowMids: -1, mids: -2, highMids: 3, treble: 2 } },
  { name: "Progressive Metal", bands: { bass: 2, lowMids: -1, mids: -2, highMids: 4, treble: 2 } },
  { name: "Jazz", bands: { bass: 2, lowMids: 1, mids: 1, highMids: 1, treble: 2 } },
  { name: "Classical", bands: { bass: 1, lowMids: 0, mids: 1, highMids: 2, treble: 3 } },
  { name: "Acoustic", bands: { bass: 1, lowMids: 0, mids: 2, highMids: 3, treble: 2 } },
  { name: "Lo-Fi", bands: { bass: 2, lowMids: 3, mids: 0, highMids: -3, treble: -5 } },
  { name: "Cyberpunk", bands: { bass: 4, lowMids: 0, mids: -2, highMids: 3, treble: 5 } }
];
const ADVANCED_EQ_PRESETS = [
  { name: "Flat", bands: { hz31: 0, hz62: 0, hz125: 0, hz250: 0, hz500: 0, hz1000: 0, hz2000: 0, hz4000: 0, hz8000: 0, hz16000: 0 } },
  { name: "Bass Boost", bands: { hz31: 3, hz62: 4, hz125: 3, hz250: 1, hz500: 0, hz1000: 0, hz2000: 0, hz4000: 0, hz8000: 0, hz16000: 0 } },
  { name: "Deep Bass", bands: { hz31: 5, hz62: 5, hz125: 2, hz250: 0, hz500: -1, hz1000: -1, hz2000: 0, hz4000: 0, hz8000: 1, hz16000: 1 } },
  { name: "Punchy Bass", bands: { hz31: 2, hz62: 4, hz125: 4, hz250: 1, hz500: -1, hz1000: 0, hz2000: 0, hz4000: 1, hz8000: 0, hz16000: 0 } },
  { name: "Bass Reducer", bands: { hz31: -4, hz62: -4, hz125: -3, hz250: -1, hz500: 0, hz1000: 0, hz2000: 0, hz4000: 0, hz8000: 1, hz16000: 1 } },
  { name: "Treble Boost", bands: { hz31: 0, hz62: 0, hz125: 0, hz250: -1, hz500: 0, hz1000: 1, hz2000: 2, hz4000: 3, hz8000: 4, hz16000: 4 } },
  { name: "Treble Reducer", bands: { hz31: 1, hz62: 1, hz125: 0, hz250: 0, hz500: 0, hz1000: -1, hz2000: -2, hz4000: -3, hz8000: -4, hz16000: -4 } },
  { name: "Loudness", bands: { hz31: 4, hz62: 4, hz125: 2, hz250: 0, hz500: -1, hz1000: 0, hz2000: 1, hz4000: 2, hz8000: 3, hz16000: 3 } },
  { name: "Warm", bands: { hz31: 2, hz62: 2, hz125: 2, hz250: 1, hz500: 0, hz1000: 0, hz2000: -1, hz4000: -2, hz8000: -2, hz16000: -3 } },
  { name: "Bright", bands: { hz31: -1, hz62: -1, hz125: -1, hz250: 0, hz500: 0, hz1000: 1, hz2000: 2, hz4000: 3, hz8000: 3, hz16000: 4 } },
  { name: "V-Shape", bands: { hz31: 4, hz62: 4, hz125: 2, hz250: 0, hz500: -2, hz1000: -2, hz2000: 1, hz4000: 3, hz8000: 4, hz16000: 4 } },
  { name: "Vocal Boost", bands: { hz31: -3, hz62: -2, hz125: -1, hz250: -1, hz500: 1, hz1000: 2, hz2000: 3, hz4000: 4, hz8000: 2, hz16000: 0 } },
  { name: "Vocal Softener", bands: { hz31: 1, hz62: 1, hz125: 1, hz250: 1, hz500: 0, hz1000: 0, hz2000: -1, hz4000: -3, hz8000: -3, hz16000: -2 } },
  { name: "Podcast", bands: { hz31: -4, hz62: -3, hz125: -2, hz250: -1, hz500: 1, hz1000: 3, hz2000: 4, hz4000: 3, hz8000: 0, hz16000: -2 } },
  { name: "Night Mode", bands: { hz31: -5, hz62: -4, hz125: -2, hz250: -1, hz500: 0, hz1000: 1, hz2000: 1, hz4000: 0, hz8000: -2, hz16000: -3 } },
  { name: "Headphones", bands: { hz31: -1, hz62: -1, hz125: 0, hz250: 0, hz500: 1, hz1000: 1, hz2000: 1, hz4000: 2, hz8000: 2, hz16000: 1 } },
  { name: "Harsh Headphones Fix", bands: { hz31: 1, hz62: 1, hz125: 0, hz250: 0, hz500: 0, hz1000: 0, hz2000: -2, hz4000: -4, hz8000: -2, hz16000: -1 } },
  { name: "Car", bands: { hz31: 3, hz62: 4, hz125: 2, hz250: 0, hz500: -1, hz1000: 0, hz2000: 1, hz4000: 2, hz8000: 3, hz16000: 2 } },
  { name: "Small Speakers", bands: { hz31: 3, hz62: 3, hz125: 2, hz250: 1, hz500: 0, hz1000: 1, hz2000: 2, hz4000: 2, hz8000: 3, hz16000: 3 } },
  { name: "Bluetooth Speaker", bands: { hz31: 3, hz62: 3, hz125: 2, hz250: 0, hz500: -1, hz1000: 1, hz2000: 2, hz4000: 3, hz8000: 3, hz16000: 2 } },
  { name: "Rock", bands: { hz31: 3, hz62: 3, hz125: 2, hz250: 0, hz500: -1, hz1000: -1, hz2000: 1, hz4000: 3, hz8000: 2, hz16000: 2 } },
  { name: "Pop", bands: { hz31: 2, hz62: 3, hz125: 2, hz250: 0, hz500: 0, hz1000: 1, hz2000: 2, hz4000: 3, hz8000: 3, hz16000: 2 } },
  { name: "Hip-Hop", bands: { hz31: 5, hz62: 5, hz125: 3, hz250: 1, hz500: -1, hz1000: -1, hz2000: 0, hz4000: 1, hz8000: 2, hz16000: 2 } },
  { name: "West Coast Hip-Hop", bands: { hz31: 4, hz62: 5, hz125: 3, hz250: 1, hz500: 0, hz1000: -1, hz2000: 0, hz4000: 1, hz8000: 2, hz16000: 3 } },
  { name: "Electronic", bands: { hz31: 4, hz62: 5, hz125: 2, hz250: 0, hz500: -1, hz1000: -1, hz2000: 1, hz4000: 2, hz8000: 4, hz16000: 4 } },
  { name: "Synthwave", bands: { hz31: 3, hz62: 4, hz125: 2, hz250: 1, hz500: -1, hz1000: -1, hz2000: 1, hz4000: 2, hz8000: 4, hz16000: 5 } },
  { name: "Cyberpunk", bands: { hz31: 4, hz62: 5, hz125: 2, hz250: 0, hz500: -2, hz1000: -1, hz2000: 1, hz4000: 3, hz8000: 4, hz16000: 5 } },
  { name: "Metal", bands: { hz31: 3, hz62: 4, hz125: 2, hz250: -1, hz500: -2, hz1000: -2, hz2000: 1, hz4000: 4, hz8000: 3, hz16000: 2 } },
  { name: "Progressive Metal", bands: { hz31: 2, hz62: 3, hz125: 2, hz250: -1, hz500: -2, hz1000: -1, hz2000: 2, hz4000: 4, hz8000: 3, hz16000: 2 } },
  { name: "Nu Metal", bands: { hz31: 4, hz62: 5, hz125: 3, hz250: 0, hz500: -2, hz1000: -2, hz2000: 0, hz4000: 3, hz8000: 2, hz16000: 1 } },
  { name: "Jazz", bands: { hz31: 1, hz62: 2, hz125: 1, hz250: 1, hz500: 0, hz1000: 1, hz2000: 1, hz4000: 1, hz8000: 2, hz16000: 2 } },
  { name: "Classical", bands: { hz31: 1, hz62: 1, hz125: 0, hz250: 0, hz500: 0, hz1000: 1, hz2000: 1, hz4000: 2, hz8000: 3, hz16000: 3 } },
  { name: "Acoustic", bands: { hz31: 1, hz62: 1, hz125: 1, hz250: 0, hz500: 0, hz1000: 2, hz2000: 3, hz4000: 3, hz8000: 2, hz16000: 1 } },
  { name: "Lo-Fi", bands: { hz31: 2, hz62: 3, hz125: 3, hz250: 2, hz500: 0, hz1000: -1, hz2000: -2, hz4000: -4, hz8000: -5, hz16000: -6 } },
  { name: "Mud Cleaner", bands: { hz31: -1, hz62: -1, hz125: 0, hz250: -3, hz500: -4, hz1000: -2, hz2000: 0, hz4000: 1, hz8000: 1, hz16000: 0 } },
  { name: "Boxy Room Fix", bands: { hz31: 0, hz62: 0, hz125: -1, hz250: -4, hz500: -3, hz1000: -1, hz2000: 1, hz4000: 1, hz8000: 0, hz16000: 0 } },
  { name: "Presence Boost", bands: { hz31: -1, hz62: -1, hz125: 0, hz250: 0, hz500: 0, hz1000: 1, hz2000: 3, hz4000: 4, hz8000: 2, hz16000: 0 } },
  { name: "De-Harsh", bands: { hz31: 0, hz62: 0, hz125: 0, hz250: 0, hz500: 0, hz1000: 0, hz2000: -1, hz4000: -4, hz8000: -3, hz16000: -1 } },
  { name: "Air Boost", bands: { hz31: 0, hz62: 0, hz125: 0, hz250: 0, hz500: 0, hz1000: 0, hz2000: 1, hz4000: 1, hz8000: 3, hz16000: 5 } },
  { name: "Vinyl Warmth", bands: { hz31: 1, hz62: 2, hz125: 2, hz250: 1, hz500: 0, hz1000: -1, hz2000: -2, hz4000: -2, hz8000: -3, hz16000: -4 } },
  { name: "Compressed Audio Rescue", bands: { hz31: 1, hz62: 1, hz125: 0, hz250: -1, hz500: 0, hz1000: 1, hz2000: 2, hz4000: 2, hz8000: 3, hz16000: 2 } },
  { name: "Old Speakers Fix", bands: { hz31: 4, hz62: 3, hz125: 2, hz250: 0, hz500: 0, hz1000: 1, hz2000: 2, hz4000: 2, hz8000: 3, hz16000: 3 } },
  { name: "Subwoofer Tame", bands: { hz31: -5, hz62: -4, hz125: -2, hz250: 0, hz500: 0, hz1000: 0, hz2000: 0, hz4000: 1, hz8000: 1, hz16000: 1 } },
  { name: "Ear Saver", bands: { hz31: -2, hz62: -2, hz125: -1, hz250: 0, hz500: 0, hz1000: 0, hz2000: -1, hz4000: -3, hz8000: -4, hz16000: -5 } },
  { name: "Live Room", bands: { hz31: 2, hz62: 3, hz125: 1, hz250: 0, hz500: -1, hz1000: 0, hz2000: 1, hz4000: 2, hz8000: 3, hz16000: 2 } },
  { name: "Studio Reference", bands: { hz31: 0, hz62: 0, hz125: 0, hz250: 0, hz500: 0, hz1000: 0, hz2000: 0, hz4000: 0, hz8000: 0, hz16000: 0 } }
];

const state = {
  settings: null,
  tracks: [],
  sections: [],
  playlists: [],
  customShuffles: [],
  metadataStatus: null,
  metadataJob: null,
  metadataPollTimer: null,
  metadataAutoStarted: false,
  lyricsScanStatus: null,
  lyricsScanJob: null,
  lyricsScanPollTimer: null,
  shuffleInspectorTab: "inspector",
  ruleLibraryFilter: "all",
  selectedShuffleRuleIndex: 0,
  workshopDraft: null,
  workshopDraftProfileId: "",
  workshopPreviewQueue: [],
  workshopPreviewStatus: "",
  listeningStats: {},
  listeningEvents: [],
  blacklist: [],
  links: [],
  selectedIds: new Set(),
  selectionAnchorId: "",
  queue: [],
  currentIndex: -1,
  currentTime: 0,
  volume: DEFAULT_VOLUME,
  muted: false,
  fakeTimer: null,
  isPlaying: false,
  nowPlayingOpen: false,
  nowPlayingTab: "queue",
  advancedPlaybackOpen: false,
  playbackSpeedOffset: 1,
  sleepTimerMinutes: 0,
  sleepTimerEndsAt: 0,
  sleepTimerTickTimer: null,
  pitchShiftSemitones: 0,
  softSkip: false,
  abLoop: {
    active: false,
    id: "",
    trackId: "",
    aMs: 0,
    bMs: 0,
    name: ""
  },
  abLoopPowerEnabled: true,
  savedAbLoops: [],
  abLoopQueueEnabled: false,
  abLoopQueueIds: [],
  abLoopEditingId: "",
  abLoopPlayCount: 1,
  abLoopPlayRemaining: 1,
  abLoopSeekGuardUntil: 0,
  abLoopSeekGuardTargetMs: null,
  abLoopLauncherOpen: false,
  abLoopPadLayouts: {},
  abLoopPadAssignmentMenu: {
    open: false,
    padIndex: -1,
    x: 0,
    y: 0
  },
  abLoopSavedLoopMenu: {
    open: false,
    loopId: "",
    x: 0,
    y: 0
  },
  abLoopSaveDialog: {
    open: false,
    name: "",
    status: ""
  },
  abLoopAdvanced: {
    trackId: "",
    markerMs: 0,
    zoomStartMs: 0,
    zoomEndMs: 0,
    markerMenu: {
      open: false,
      x: 0,
      y: 0
    }
  },
  abLoopWaveform: {
    trackId: "",
    url: "",
    status: "idle",
    peaks: null,
    durationMs: 0,
    error: "",
    token: 0
  },
  abLoopMenuOpen: false,
  abLoopMarkerDrag: "",
  abLoopMarkerDragScope: "",
  abLoopMarkerDragWindow: null,
  timelineScrub: {
    active: false,
    pointerActive: false,
    trackId: "",
    timelineWindow: null,
    value: 0,
    targetMs: 0,
    lastSeekAt: 0,
    idleTimer: 0
  },
  shuffle: true,
  activeShuffleProfileId: "",
  repeat: "all",
  view: "library",
  libraryView: "home",
  activePlaylistId: "",
  playlistEditMode: false,
  playlistSettingsId: "",
  playlistAddDialog: {
    open: false,
    trackIds: [],
    status: "",
    duplicatePlaylistId: ""
  },
  queuePlaylistDialog: {
    open: false,
    trackIds: [],
    status: ""
  },
  playlistTrackDialog: {
    playlistId: "",
    trackId: ""
  },
  trackInfoDialog: {
    trackId: "",
    playlistId: ""
  },
  contextMenu: {
    open: false,
    x: 0,
    y: 0,
    trackId: "",
    trackIds: [],
    playlistId: "",
    queueIndex: -1
  },
  shuffleContextMenu: {
    open: false,
    x: 0,
    y: 0,
    source: "",
    playlistId: ""
  },
  queueContextMenu: {
    open: false,
    x: 0,
    y: 0
  },
  confirmDialog: {
    open: false,
    type: "",
    playlistId: "",
    shuffleProfileId: "",
    pending: false,
    status: ""
  },
  shuffleSaveDialog: {
    open: false,
    name: "",
    status: "",
    pending: false
  },
  yearReview: {
    open: false,
    year: new Date().getFullYear(),
    slideIndex: 0,
    story: null,
    playlistId: "",
    loading: false,
    error: ""
  },
  yearReviewTypedBuffer: "",
  yearReviewAutoChecked: false,
  recoveryNotice: null,
  runtime: null,
  runtimeMismatch: false,
  runtimeWarningDismissed: false,
  plexAuth: {
    pending: false,
    id: "",
    code: "",
    authUrl: "",
    status: ""
  },
  plexAuthCollapsed: null,
  plexAuthHelpOpen: false,
  directPlexPlaybackAvailable: false,
  directPlexPlaybackProbeKey: "",
  directPlexPlaybackDisabled: false,
  toast: "",
  toastTimer: null,
  artistFilter: "",
  albumFilter: "",
  libraryFilterField: "all",
  libraryFilterValue: "",
  librarySort: "titleAsc",
  playlistSort: "orderAdded",
  playlistQuery: "",
  query: "",
  playbackSession: null,
  playbackSaveTimer: null,
  queueContext: { type: "", playlistId: "", shuffleProfileId: "", fadeSeconds: 0 },
  playbackHandoffStartedAt: 0,
  playbackHandoffReason: "",
  playbackErrorRecovery: { trackId: "", count: 0 },
  audioTransitioning: false,
  crossfadeTimer: null,
  crossfadeToken: 0,
  streamPrepareToken: 0,
  eqSaveTimer: null,
  lyricsByTrackId: {},
  lyricsRequestToken: 0,
  lyricsPanelOpen: false,
  lyricsPopout: null,
  activeLyricIndex: -1,
  lastLyricsBroadcastAt: 0,
  chordsByTrackId: {},
  chordsRequestToken: 0,
  chordsPanelOpen: false,
  chordsPopout: null,
  activeChordIndex: -1,
  activeChordSheetLineIndex: -1,
  lastChordsBroadcastAt: 0,
  chordImportStatus: "",
  backupStatus: null,
  libraryDataVersion: 0,
  playlistDataVersion: 0,
  statsDataVersion: 0,
  blacklistDataVersion: 0,
  selectionVersion: 0,
  libraryRenderSignature: ""
};

let audio = $("#audio");
const primaryAudio = audio;
const secondaryAudio = new Audio();
const yearReviewPreviewAudio = new Audio();
primaryAudio.preload = "auto";
secondaryAudio.preload = "auto";
yearReviewPreviewAudio.preload = "auto";
const streamPreloadPromises = new Map();
const abLoopWaveformCache = new Map();
const MEDIA_END_GRACE_MS = 3500;
const MEDIA_EARLY_END_RETRY_LIMIT = 3;
const EARLY_END_RECOVERY_WAIT_MS = 5000;
const PLAYBACK_FAST_RECOVERY_MS = 750;
const PLAYBACK_START_GUARD_MS = 2200;
const PLAYBACK_ERROR_RETRY_LIMIT = 1;
const STREAM_PRELOAD_LOOKAHEAD_COUNT = 3;
const STREAM_LOOKAHEAD_WARM_DELAY_MS = 3500;
const STREAM_START_PRELOAD_DELAY_MS = 4500;
let standbyAudioPreload = { player: null, trackId: "", url: "", queueIndex: -1 };
let earlyEndedRecovery = { trackId: "", count: 0 };
let playbackRecoveryTimer = 0;
let playbackStartGuardTimer = 0;
let streamLookaheadWarmTimer = 0;
let streamLookaheadWarmToken = 0;
let activeStartWarmTimer = 0;
let activeStartWarmToken = 0;
let activeStartWarmCleanup = null;
let trackCompanionLoadTimer = 0;
let trackCompanionLoadCleanup = null;
let playbackTraceFlushTimer = 0;
let smoothProgressFrame = 0;
let smoothProgressLastRenderAt = 0;
let progressSlowSyncLastAt = 0;
const playbackTracePending = [];
let plexAuthPollTimer = 0;
let yearReviewPreviewFadeTimer = 0;
let yearReviewPreviewToken = 0;
const lyricsChannel = typeof BroadcastChannel === "undefined" ? null : new BroadcastChannel("voidfm-lyrics");
const chordsChannel = typeof BroadcastChannel === "undefined" ? null : new BroadcastChannel("voidfm-chords");
let eqAudioContext = null;
const eqAudioGraphs = new Map();
let reverseAudioGraph = null;
const reverseAudioBufferCache = new Map();
let reversePlaybackToken = 0;
let reversePlayback = {
  active: false,
  loading: false,
  token: 0,
  trackId: "",
  source: null,
  gain: null,
  timer: 0,
  startedAt: 0,
  startMs: 0,
  minMs: 0,
  maxMs: 0,
  rate: 1,
  durationMs: 0,
  stopping: false
};

function nowPerfMs() {
  return typeof performance !== "undefined" && typeof performance.now === "function"
    ? performance.now()
    : Date.now();
}

function playbackTrace(event, detail = {}) {
  const entry = {
    event,
    at: Math.round(nowPerfMs()),
    wallTime: new Date().toISOString(),
    assetVersion: APP_ASSET_VERSION,
    ...detail
  };
  if (!window.__VOIDFM_PLAYBACK_TRACE__) window.__VOIDFM_PLAYBACK_TRACE__ = [];
  window.__VOIDFM_PLAYBACK_TRACE__.push(entry);
  if (window.__VOIDFM_PLAYBACK_TRACE__.length > 120) window.__VOIDFM_PLAYBACK_TRACE__.shift();
  playbackTracePending.push(entry);
  if (playbackTracePending.length > 200) playbackTracePending.splice(0, playbackTracePending.length - 200);
  schedulePlaybackTraceFlush();
  if (window.__VOIDFM_DEBUG_PLAYBACK__) console.debug("[VoidFM playback]", event, detail);
}

function flushPlaybackTrace(options = {}) {
  if (playbackTraceFlushTimer) {
    clearTimeout(playbackTraceFlushTimer);
    playbackTraceFlushTimer = 0;
  }
  if (!playbackTracePending.length) return;
  const events = playbackTracePending.splice(0, playbackTracePending.length);
  const payload = JSON.stringify({
    client: {
      assetVersion: APP_ASSET_VERSION,
      userAgent: navigator.userAgent,
      url: window.location.href
    },
    events
  });
  if (options.beacon && navigator.sendBeacon && !window.VoidFMBrowserApi?.enabled) {
    navigator.sendBeacon(localApiTokenUrl("/api/playback-diagnostics"), new Blob([payload], { type: "application/json" }));
    return;
  }
  fetch("/api/playback-diagnostics", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(localApiToken ? { "X-VoidFM-Token": localApiToken } : {})
    },
    body: payload,
    keepalive: true
  }).catch(() => {
    playbackTracePending.unshift(...events.slice(-80));
  });
}

function schedulePlaybackTraceFlush() {
  if (playbackTraceFlushTimer) return;
  playbackTraceFlushTimer = setTimeout(() => flushPlaybackTrace(), 1200);
}

function setupDesktopTitlebar() {
  if (window.voidfmWindow?.isElectron) {
    document.documentElement.classList.add("electron-shell");
  }

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-window-control]");
    if (!button) return;
    const windowApi = window.voidfmWindow;
    if (!windowApi?.isElectron) return;
    event.preventDefault();
    const control = button.dataset.windowControl;
    if (control === "minimize") windowApi.minimize();
    if (control === "maximize") windowApi.toggleMaximize();
    if (control === "close") windowApi.close();
  });

  window.addEventListener("voidfm-window-maximized", (event) => {
    document.documentElement.classList.toggle("window-maximized", Boolean(event.detail?.maximized));
  });
}

function showButtonClickFeedback(control, event) {
  if (!control || control.disabled || control.getAttribute("aria-disabled") === "true") return;
  const rect = control.getBoundingClientRect();
  if (rect.width > 0 && rect.height > 0 && event && Number.isFinite(event.clientX) && Number.isFinite(event.clientY)) {
    const x = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100));
    control.style.setProperty("--click-x", `${x}%`);
    control.style.setProperty("--click-y", `${y}%`);
  } else {
    control.style.setProperty("--click-x", "50%");
    control.style.setProperty("--click-y", "50%");
  }

  const existingTimer = clickFeedbackTimers.get(control);
  if (existingTimer) window.clearTimeout(existingTimer);
  control.classList.remove(CLICK_FEEDBACK_CLASS);
  void control.offsetWidth;
  control.classList.add(CLICK_FEEDBACK_CLASS);
  clickFeedbackTimers.set(control, window.setTimeout(() => {
    control.classList.remove(CLICK_FEEDBACK_CLASS);
    clickFeedbackTimers.delete(control);
  }, 520));
}

function closestClickFeedbackControl(target) {
  if (!(target instanceof Element)) return null;
  if (target.closest("[data-ab-loop-launcher-collapse]")) return null;
  return target.closest(CLICK_FEEDBACK_SELECTOR);
}

function setupButtonClickFeedback() {
  document.addEventListener("pointerdown", (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    const control = closestClickFeedbackControl(event.target);
    if (!control) return;
    showButtonClickFeedback(control, event);
  }, { capture: true });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const control = closestClickFeedbackControl(event.target);
    if (!control) return;
    showButtonClickFeedback(control);
  }, { capture: true });
}

function clearPlaybackStartGuard() {
  if (playbackStartGuardTimer) clearTimeout(playbackStartGuardTimer);
  playbackStartGuardTimer = 0;
}

function isIgnorablePlayInterruption(error) {
  const message = String(error?.message || error || "").toLowerCase();
  return error?.name === "AbortError"
    || message.includes("interrupted by a call to pause")
    || message.includes("interrupted by a new load request")
    || message.includes("play() request was interrupted");
}

function browserOnlyPlaybackActive() {
  return Boolean(window.VoidFMBrowserApi?.enabled);
}

function stopBrowserOnlyPlaybackFailure(track, reason = "stream-error") {
  clearPlaybackStartGuard();
  clearPlaybackRecoveryTimer();
  clearFakeTimer();
  state.streamPrepareToken += 1;
  state.audioTransitioning = false;
  state.isPlaying = false;
  try {
    audio.pause();
    audio.removeAttribute("src");
    audio.load?.();
  } catch {}
  playbackTrace("browser-only-playback-held", {
    trackId: track?.id || "",
    source: track?.source || "",
    reason
  });
  const message = track?.source === "plex"
    ? "Plex blocked this browser playback path. Try allowing CORS on Plex, use a same-protocol Plex URL, or import local files."
    : "This browser no longer has access to that local audio file. Re-select the folder or import the files again.";
  showToast(message);
  renderPlaybackSurfaces();
  schedulePlaybackSave();
}

function retryActivePlaybackThroughProxy(track, prepareToken, reason, attempt) {
  const retryAttempt = attempt + 1;
  const retryToken = `${Date.now()}-start-${retryAttempt}`;
  resetAudioElement(audio);
  audio.src = audioStreamUrlForTrack(track, { direct: true, retryToken });
  beginAudioLoad(audio, track, "playback-start-proxy-fallback");
  audio.volume = state.volume;
  audio.muted = state.muted;
  applyAdvancedPlaybackSettings();
  applyEqSettingsToAudio();
  syncAudioMetadataForTrack(audio, track, {
    validate: () => prepareToken === state.streamPrepareToken && currentTrack()?.id === track.id
  });
  playbackTrace("playback-start-proxy-fallback", {
    trackId: track.id,
    reason,
    attempt: retryAttempt
  });
  audio.play()
    .then(finishAudioTransition)
    .catch((error) => handleAudioPlayFailure(track, error));
  guardPlaybackStart(track, prepareToken, { reason, attempt: retryAttempt, proxyRetry: true });
}

function guardPlaybackStart(track, prepareToken, options = {}) {
  clearPlaybackStartGuard();
  if (!track || !canStreamTrack(track)) return;
  const attempt = Number(options.attempt || 0);
  const reason = options.reason || "playback-start";
  playbackStartGuardTimer = setTimeout(() => {
    playbackStartGuardTimer = 0;
    if (prepareToken !== state.streamPrepareToken || currentTrack()?.id !== track.id) return;
    if (!state.audioTransitioning && !audio.paused) return;

    playbackTrace("playback-start-timeout", {
      trackId: track.id,
      reason,
      attempt,
      paused: Boolean(audio.paused),
      readyState: audio.readyState,
      src: audio.currentSrc || audio.src || ""
    });

    if (!audio.paused && audio.readyState < 2) {
      if (attempt < 1 && usesStablePlexStream(track) && !options.proxyRetry) {
        retryActivePlaybackThroughProxy(track, prepareToken, reason, attempt);
        return;
      }
      if (attempt >= 3) {
        finishAudioTransition();
        return;
      }
      guardPlaybackStart(track, prepareToken, {
        reason,
        attempt: attempt + 1,
        pendingOnly: true,
        proxyRetry: Boolean(options.proxyRetry)
      });
      return;
    }

    if (options.pendingOnly) {
      finishAudioTransition();
      return;
    }

    if (attempt < 1 && usesStablePlexStream(track) && audio.paused) {
      retryActivePlaybackThroughProxy(track, prepareToken, reason, attempt);
      return;
    }

    finishAudioTransition();
  }, PLAYBACK_START_GUARD_MS);
}

function markPlaybackHandoff(reason, track = currentTrack()) {
  state.playbackHandoffStartedAt = nowPerfMs();
  state.playbackHandoffReason = reason || "";
  playbackTrace("handoff-start", {
    reason: state.playbackHandoffReason,
    trackId: track?.id || "",
    queueIndex: state.currentIndex
  });
}

function finishPlaybackHandoff(track = currentTrack()) {
  if (!state.playbackHandoffStartedAt) return;
  const elapsedMs = Math.round(nowPerfMs() - state.playbackHandoffStartedAt);
  playbackTrace("handoff-play", {
    reason: state.playbackHandoffReason,
    trackId: track?.id || "",
    elapsedMs
  });
  state.playbackHandoffStartedAt = 0;
  state.playbackHandoffReason = "";
}

function clearPlaybackRecoveryTimer() {
  if (playbackRecoveryTimer) clearTimeout(playbackRecoveryTimer);
  playbackRecoveryTimer = 0;
}

function clearTrackCompanionLoadTimer() {
  if (trackCompanionLoadTimer) clearTimeout(trackCompanionLoadTimer);
  trackCompanionLoadTimer = 0;
  if (trackCompanionLoadCleanup) {
    trackCompanionLoadCleanup();
    trackCompanionLoadCleanup = null;
  }
}

function runTrackCompanionLoads() {
  loadLyricsForCurrentTrack();
  loadChordsForCurrentTrack();
}

function scheduleTrackCompanionLoads(track, options = {}) {
  clearTrackCompanionLoadTimer();
  if (!track) {
    runTrackCompanionLoads();
    return;
  }
  const prepareToken = state.streamPrepareToken;
  const runIfCurrent = () => {
    trackCompanionLoadTimer = 0;
    trackCompanionLoadCleanup = null;
    if (prepareToken !== state.streamPrepareToken || currentTrack()?.id !== track.id) return;
    runTrackCompanionLoads();
  };
  if (options.immediate) {
    trackCompanionLoadTimer = setTimeout(runIfCurrent, 0);
    return;
  }
  if (audio.readyState < 2 && currentTrack()?.id === track.id) {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      cleanup();
      trackCompanionLoadTimer = setTimeout(runIfCurrent, 650);
    };
    const cleanup = () => {
      audio.removeEventListener("canplay", finish);
      audio.removeEventListener("playing", finish);
      if (trackCompanionLoadTimer) clearTimeout(trackCompanionLoadTimer);
      trackCompanionLoadTimer = 0;
      trackCompanionLoadCleanup = null;
    };
    trackCompanionLoadCleanup = cleanup;
    audio.addEventListener("canplay", finish, { once: true });
    audio.addEventListener("playing", finish, { once: true });
    trackCompanionLoadTimer = setTimeout(finish, 2500);
    return;
  }
  trackCompanionLoadTimer = setTimeout(runIfCurrent, 900);
}
const NOW_PLAYING_SPECTRUM_GROUPS = [
  { key: "treble", scale: 0.82, shape: [0.06, 0.1, 0.16, 0.26, 0.4, 0.6, 0.84, 0.6, 0.4, 0.26, 0.16, 0.1, 0.06] },
  { key: "mid", scale: 0.98, shape: [0.06, 0.1, 0.18, 0.3, 0.48, 0.7, 0.94, 0.7, 0.48, 0.3, 0.18, 0.1, 0.06] },
  { key: "bass", scale: 1.12, shape: [0.05, 0.1, 0.2, 0.36, 0.6, 0.82, 1, 0.82, 0.6, 0.36, 0.2, 0.1, 0.05] },
  { key: "mid", scale: 0.98, shape: [0.06, 0.1, 0.18, 0.3, 0.48, 0.7, 0.94, 0.7, 0.48, 0.3, 0.18, 0.1, 0.06] },
  { key: "treble", scale: 0.82, shape: [0.06, 0.1, 0.16, 0.26, 0.4, 0.6, 0.84, 0.6, 0.4, 0.26, 0.16, 0.1, 0.06] }
];
const NOW_PLAYING_SPECTRUM_BAR_COUNT = NOW_PLAYING_SPECTRUM_GROUPS.reduce((total, group) => total + group.shape.length, 0);
let nowPlayingVisualizerFrame = 0;
const nowPlayingSpectrumLevels = new Float32Array(NOW_PLAYING_SPECTRUM_BAR_COUNT);
nowPlayingSpectrumLevels.fill(0.05);
const nowPlayingSpectrumTargets = new Float32Array(NOW_PLAYING_SPECTRUM_BAR_COUNT);
const nowPlayingSpectrumBlendedTargets = new Float32Array(NOW_PLAYING_SPECTRUM_BAR_COUNT);
let nowPlayingSpectrumBassPulse = 0;
const nowPlayingSpectrumBandEnergies = { bass: 0.05, mid: 0.05, treble: 0.05 };
const nowPlayingPaletteCache = new Map();
let nowPlayingPaletteToken = 0;

const memo = {
  duplicateKeysVersion: -1,
  duplicateKeys: new Set(),
  filterOptions: new Map(),
  sortOptionsVersion: -1,
  sortOptions: [],
  filteredTracksKey: "",
  filteredTracks: [],
  artistSummariesKey: "",
  artistSummaries: [],
  albumSummariesKey: "",
  albumSummaries: [],
  similarArtistsKey: "",
  similarArtists: []
};

const TRACK_INITIAL_RENDER_LIMIT = 700;
const TRACK_RENDER_CHUNK_SIZE = 350;
const BROWSER_GRID_INITIAL_RENDER_LIMIT = 42;
const BROWSER_GRID_RENDER_CHUNK_SIZE = 42;
let lazyTrackRenderToken = 0;
let lazyBrowserGridRenderToken = 0;
let lazySimilarArtistToken = 0;
let lazyArtworkObserver = null;
let pendingTrackSelectionPointer = { trackId: "", shiftKey: false };
let suppressNextContextDismissClick = false;
let suppressNextOutsideContextMenu = false;
const QUEUE_INITIAL_RENDER_LIMIT = 300;
const QUEUE_RENDER_CHUNK_SIZE = 200;
let lazyQueueRenderToken = 0;
const NAVIGATION_HISTORY_LIMIT = 80;
const navigationHistory = {
  back: [],
  forward: []
};
const playlistDragState = {
  sourceId: "",
  targetId: "",
  position: "",
  lastDropAt: 0
};
const libraryDragState = {
  type: "",
  id: "",
  label: "",
  trackIds: [],
  targetPlaylistId: "",
  lastDropAt: 0
};

function clearDerivedLibraryCaches() {
  memo.filteredTracksKey = "";
  memo.artistSummariesKey = "";
  memo.albumSummariesKey = "";
  memo.similarArtistsKey = "";
  memo.similarArtists = [];
  state.libraryRenderSignature = "";
}

function markTracksChanged() {
  state.libraryDataVersion += 1;
  memo.duplicateKeysVersion = -1;
  memo.filterOptions.clear();
  memo.sortOptionsVersion = -1;
  clearDerivedLibraryCaches();
}

function markPlaylistsChanged() {
  state.playlistDataVersion += 1;
  memo.filterOptions.clear();
  clearDerivedLibraryCaches();
}

function markStatsChanged() {
  state.statsDataVersion += 1;
  clearDerivedLibraryCaches();
}

function markBlacklistChanged() {
  state.blacklistDataVersion += 1;
  state.libraryRenderSignature = "";
}

function markSelectionChanged() {
  state.selectionVersion += 1;
  state.libraryRenderSignature = "";
}

function currentSelectionTrackIds() {
  if (state.view === "playlists" && state.activePlaylistId) {
    return activePlaylistTracks().map((track) => track.id);
  }
  if (state.view === "library" && (state.artistFilter || state.albumFilter || state.libraryView === "songs")) {
    return filteredTracks().map((track) => track.id);
  }
  return $$(".view.active .track-row").map((row) => row.dataset.trackId).filter(Boolean);
}

function checkedSelectionTrackIds() {
  return Array.from(document.querySelectorAll("[data-select-track]:checked"))
    .map((input) => input.dataset.selectTrack)
    .filter(Boolean);
}

function selectedTrackIdsForAction() {
  return uniqueTrackIds(Array.from(state.selectedIds).concat(checkedSelectionTrackIds()))
    .filter((id) => Boolean(trackById(id)));
}

function syncSelectionCheckbox(trackId, checked) {
  $$("[data-select-track]").forEach((input) => {
    if (input.dataset.selectTrack === trackId) input.checked = checked;
  });
}

function setTrackSelection(trackId, checked) {
  if (checked) state.selectedIds.add(trackId);
  else state.selectedIds.delete(trackId);
  syncSelectionCheckbox(trackId, checked);
}

function trackSelectionInputFromTarget(target) {
  return target?.closest?.("[data-select-track]")
    || target?.closest?.(".select-check")?.querySelector("[data-select-track]")
    || null;
}

function currentSelectionInputs(input) {
  const scope = input?.closest?.(".playlist-detail-table")
    || input?.closest?.(".view.active")
    || document;
  return Array.from(scope.querySelectorAll("[data-select-track]"));
}

function rememberTrackSelectionPointer(event) {
  const input = trackSelectionInputFromTarget(event.target);
  pendingTrackSelectionPointer = {
    trackId: input?.dataset.selectTrack || "",
    shiftKey: Boolean(input && event.shiftKey)
  };
}

function consumeTrackSelectionRangeIntent(input, event) {
  const trackId = input.dataset.selectTrack || "";
  const pointerShift = pendingTrackSelectionPointer.trackId === trackId && pendingTrackSelectionPointer.shiftKey;
  pendingTrackSelectionPointer = { trackId: "", shiftKey: false };
  return Boolean(event.shiftKey || pointerShift);
}

function handleTrackSelection(input, useRange) {
  const trackId = input.dataset.selectTrack;
  const checked = input.checked;
  const orderedInputs = currentSelectionInputs(input);
  const anchorIndex = orderedInputs.findIndex((item) => item.dataset.selectTrack === state.selectionAnchorId);
  const targetIndex = orderedInputs.indexOf(input);

  if (useRange && anchorIndex !== -1 && targetIndex !== -1) {
    const start = Math.min(anchorIndex, targetIndex);
    const end = Math.max(anchorIndex, targetIndex);
    orderedInputs.slice(start, end + 1).forEach((item) => setTrackSelection(item.dataset.selectTrack, checked));
  } else {
    setTrackSelection(trackId, checked);
  }

  state.selectionAnchorId = trackId;
  markSelectionChanged();
}

const FILTER_FIELDS = [
  ["all", "Any"],
  ["artist", "Artist"],
  ["album", "Album"],
  ["albumArtist", "Album Artist"],
  ["genre", "Genre"],
  ["mood", "Mood"],
  ["language", "Language"],
  ["decade", "Decade"],
  ["year", "Year"],
  ["releaseDate", "Release Date"],
  ["rating", "Rating"],
  ["liked", "Liked / Favorited"],
  ["playCount", "Play Count"],
  ["skipCount", "Skip Count"],
  ["lastPlayed", "Last Played"],
  ["dateAdded", "Date Added"],
  ["duration", "Duration"],
  ["fileType", "File Type"],
  ["audioQuality", "Audio Quality"],
  ["sourceLibrary", "Source / Library"],
  ["tag", "Tags"],
  ["playlist", "Playlist Membership"],
  ["compilation", "Compilation"],
  ["featuredArtists", "Featured Artists"],
  ["live", "Live / Studio"],
  ["remix", "Remix"],
  ["acoustic", "Acoustic"],
  ["duplicate", "Duplicate Songs"],
  ["neverPlayed", "Never Played"],
  ["rarelyPlayed", "Rarely Played"],
  ["recentlyPlayed", "Recently Played"],
  ["recentlyAdded", "Recently Added"],
  ["mostPlayed", "Most Played"],
  ["leastPlayed", "Least Played"],
  ["lyrics", "Lyrics Available"],
  ["explicit", "Explicit / Clean"]
];

const BASE_SORT_OPTIONS = [
  ["titleAsc", "Title A-Z"],
  ["artistAsc", "Artist A-Z"],
  ["albumAsc", "Album A-Z"],
  ["albumArtistAsc", "Album Artist A-Z"],
  ["trackNumber", "Track Number"],
  ["discNumber", "Disc Number"],
  ["releaseDateDesc", "Newest First"],
  ["releaseDateAsc", "Oldest First"],
  ["dateAddedDesc", "Recently Added"],
  ["dateAddedAsc", "Date Added: Oldest"],
  ["ratingDesc", "Highest Rated"],
  ["ratingAsc", "Lowest Rated"],
  ["playCountDesc", "Most Played"],
  ["playCountAsc", "Least Played"],
  ["skipCountAsc", "Least Skipped"],
  ["skipCountDesc", "Most Skipped"],
  ["lastPlayedDesc", "Recently Played"],
  ["lastPlayedAsc", "Neglected First"],
  ["durationAsc", "Shortest"],
  ["durationDesc", "Longest"],
  ["random", "Random"],
  ["weightedRandom", "Weighted Random"],
  ["neglectedFirst", "Neglected First"],
  ["overplayedFirst", "Overplayed First"]
];

const PLAYLIST_SORT_OPTIONS = [
  ["orderAdded", "Order Added"],
  ["artist", "Artist"],
  ["title", "Track Name"],
  ["album", "Album"],
  ["duration", "Length"]
];

const shuffleEngine = window.VoidFMShuffle;
const SHUFFLE_RULE_DEFINITIONS = shuffleEngine?.RULE_DEFINITIONS || [];
const SHUFFLE_PRESETS = shuffleEngine?.PRESETS || [];
const SHUFFLE_RULE_CATEGORIES = [
  ["Artist Rules", ["artist-repeat", "artist-spacing", "album-pairing"]],
  ["Title Rules", ["title-pattern", "song-title-chain"]],
  ["Mood & Energy", ["energy-bpm-flow", "mood-theme-filter"]],
  ["Genre", ["genre-flow"]],
  ["Time", ["release-date-flow"]],
  ["Discovery", ["discovery-bias", "singalong"]]
];
const RULE_TONE_BY_CATEGORY = {
  "Artist Rules": "artist",
  "Title Rules": "title",
  "Mood & Energy": "mood",
  Genre: "genre",
  Time: "time",
  Discovery: "discovery"
};
const METADATA_RULE_TYPES = new Set([
  "moodThemeFilter",
  "moodLock",
  "energyFlow",
  "energyRollercoaster",
  "rampUp",
  "cooldown",
  "noVibeCrash",
  "bpmClimb",
  "bpmDrop",
  "theme",
  "weather",
  "birthday",
  "releaseDateFlow",
  "genreFlow",
  "genreTourist",
  "forbiddenGenreCombo"
]);
const RULE_LIBRARY_FILTERS = [
  ["all", "All", "Show all shuffle rules"],
  ["standard", "Standard", "Rules based on standard song data"],
  ["metadata", "Needs metadata", "Rules based on enriched metadata"]
];

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function msToTime(ms) {
  const total = Math.max(0, Math.floor(Number(ms || 0) / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = String(total % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function msToPreciseTime(ms) {
  const totalMicros = Math.max(0, Math.round(Number(ms || 0) * 1000));
  const totalSeconds = Math.floor(totalMicros / 1000000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  const micros = totalMicros % 1000000;
  const fractionDigits = micros % 1000 === 0 ? 3 : 6;
  const fraction = String(micros).padStart(6, "0").slice(0, fractionDigits);
  return `${minutes}:${seconds}.${fraction}`;
}

function clampVolume(value) {
  if (value === null || value === undefined || value === "") return DEFAULT_VOLUME;
  const volume = Number(value);
  return Number.isFinite(volume) ? Math.max(0, Math.min(1, volume)) : DEFAULT_VOLUME;
}

function fadeSecondsText(value) {
  const seconds = normalizeFadeSeconds(value);
  return Number.isInteger(seconds) ? String(seconds) : String(seconds).replace(/0$/, "");
}

function fadeLabel(value) {
  const seconds = normalizeFadeSeconds(value);
  return seconds > 0 ? `${fadeSecondsText(seconds)}s fade` : "No fade";
}

function formatSignedNumber(value) {
  const amount = Math.round(Number(value || 0) * 10) / 10;
  if (!amount) return "0";
  const text = Number.isInteger(amount) ? String(amount) : String(amount).replace(/0$/, "");
  return amount > 0 ? `+${text}` : text;
}

function normalizePlaybackSpeedOffset(value, fallback = 1) {
  const speed = Number(value);
  if (!Number.isFinite(speed)) return fallback;
  let rounded = Math.round(speed / PLAYBACK_SPEED_STEP) * PLAYBACK_SPEED_STEP;
  if (Math.abs(rounded) < PLAYBACK_SPEED_STEP) rounded = rounded < 0 ? -PLAYBACK_SPEED_STEP : PLAYBACK_SPEED_STEP;
  return Math.max(PLAYBACK_SPEED_MIN, Math.min(PLAYBACK_SPEED_MAX, Math.round(rounded * 100) / 100));
}

function playbackRateFromSpeedOffset(value = state.playbackSpeedOffset) {
  const speed = normalizePlaybackSpeedOffset(value, 1);
  return Math.max(PLAYBACK_SPEED_STEP, Math.min(PLAYBACK_SPEED_MAX, Math.abs(speed)));
}

function playbackSpeedRateLabel(value = state.playbackSpeedOffset) {
  const speed = normalizePlaybackSpeedOffset(value, 1);
  const amount = Math.abs(speed);
  const text = Number.isInteger(amount) ? String(amount) : amount.toFixed(2).replace(/0$/, "");
  return `x${speed < 0 ? "-" : ""}${text}`;
}

function reversePlaybackRequested(value = state.playbackSpeedOffset) {
  return normalizePlaybackSpeedOffset(value, 1) < 0;
}

function playbackSpeedStatusText() {
  if (!reversePlaybackRequested()) return "Normal direction";
  if (!globalThis.AudioContext && !globalThis.webkitAudioContext) return "Reverse needs Web Audio";
  if (reversePlayback.loading) return "Preparing reverse audio...";
  if (reversePlayback.active) return "Reverse mode active";
  return "Reverse starts on play";
}

function stepPlaybackSpeed(direction) {
  const current = normalizePlaybackSpeedOffset(state.playbackSpeedOffset, 1);
  let next = current + (direction < 0 ? -PLAYBACK_SPEED_STEP : PLAYBACK_SPEED_STEP);
  if (current > 0 && next <= 0) next = -PLAYBACK_SPEED_STEP;
  if (current < 0 && next >= 0) next = PLAYBACK_SPEED_STEP;
  return normalizePlaybackSpeedOffset(next, 1);
}

function normalizePitchShift(value, fallback = 0) {
  const semitones = Number(value);
  if (!Number.isFinite(semitones)) return fallback;
  return Math.max(PITCH_SHIFT_MIN, Math.min(PITCH_SHIFT_MAX, Math.round(semitones)));
}

function semitoneLabel(value = state.pitchShiftSemitones) {
  const semitones = normalizePitchShift(value);
  return `${formatSignedNumber(semitones)} st`;
}

function normalizeSleepTimerMinutes(value) {
  const minutes = Number(value);
  return SLEEP_TIMER_MINUTES.includes(minutes) ? minutes : 0;
}

function formatSleepTimerOption(minutes) {
  if (!minutes) return "Off";
  if (minutes < 60) return `${minutes} min`;
  const hours = minutes / 60;
  return Number.isInteger(hours) ? `${hours}h` : `${Math.floor(hours)}h ${minutes % 60}m`;
}

function formatCountdown(ms) {
  const totalSeconds = Math.max(0, Math.ceil(Number(ms || 0) / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours) return `${hours}h ${String(minutes).padStart(2, "0")}m`;
  if (minutes) return `${minutes}m ${String(seconds).padStart(2, "0")}s`;
  return `${seconds}s`;
}

function normalizeAbLoop(value = {}) {
  const aMs = preciseMs(value.aMs || 0);
  const bMs = preciseMs(value.bMs || 0);
  return {
    active: Boolean(value.active),
    id: value.id ? String(value.id) : "",
    trackId: value.trackId ? String(value.trackId) : "",
    aMs,
    bMs,
    name: String(value.name || "").trim().slice(0, 80)
  };
}

function normalizeSavedAbLoops(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((loop) => {
      const normalized = normalizeAbLoop(loop);
      if (!normalized.trackId || normalized.bMs - normalized.aMs < AB_LOOP_MIN_MS) return null;
      return {
        ...normalized,
        id: loop.id ? String(loop.id) : randomId("ab-loop"),
        active: false,
        createdAt: loop.createdAt ? String(loop.createdAt) : new Date().toISOString()
      };
    })
    .filter(Boolean)
    .slice(0, 100);
}

function normalizeAbLoopPadLayouts(value) {
  const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  const layouts = {};
  for (const [trackId, layout] of Object.entries(source)) {
    const normalizedTrackId = String(trackId || "").trim();
    if (!normalizedTrackId || (!Array.isArray(layout) && (typeof layout !== "object" || layout === null))) continue;
    const pads = Array.from({ length: 10 }, (_, index) => {
      return normalizeAbLoopPad(Array.isArray(layout) ? layout[index] : layout[String(index)]);
    });
    if (pads.some((pad) => pad.loopId || normalizeLoopPlayCount(pad.plays) !== 1)) layouts[normalizedTrackId] = pads;
  }
  return layouts;
}

function normalizeLoopPlayCount(value) {
  const count = Math.round(Number(value || 1));
  if (!Number.isFinite(count)) return 1;
  return Math.max(1, Math.min(64, count));
}

function normalizeAbLoopPad(value) {
  if (!value) return { loopId: "", plays: 1 };
  if (typeof value === "string") return { loopId: value, plays: 1 };
  if (typeof value !== "object" || Array.isArray(value)) return { loopId: "", plays: 1 };
  return {
    loopId: value.loopId ? String(value.loopId) : "",
    plays: normalizeLoopPlayCount(value.plays ?? value.repeatCount ?? value.repeats)
  };
}

function normalizeQueuedAbLoopEntry(value) {
  if (!value) return null;
  if (typeof value === "string") return { loopId: value, plays: 1 };
  if (typeof value !== "object" || Array.isArray(value)) return null;
  const loopId = value.loopId || value.id;
  return loopId ? { loopId: String(loopId), plays: normalizeLoopPlayCount(value.plays ?? value.repeatCount ?? value.repeats) } : null;
}

function saveAdvancedPlaybackSettings() {
  try {
    localStorage.setItem(ADVANCED_PLAYBACK_SETTINGS_KEY, JSON.stringify({
      playbackSpeedOffset: state.playbackSpeedOffset,
      sleepTimerMinutes: state.sleepTimerMinutes,
      sleepTimerEndsAt: state.sleepTimerEndsAt,
      pitchShiftSemitones: state.pitchShiftSemitones,
      softSkip: state.softSkip,
      abLoop: state.abLoop,
      abLoopPowerEnabled: state.abLoopPowerEnabled,
      abLoopQueueEnabled: state.abLoopQueueEnabled,
      abLoopEditingId: state.abLoopEditingId,
      abLoopLauncherOpen: state.abLoopLauncherOpen
    }));
  } catch {
    // Advanced playback settings are local convenience state; playback still works without storage.
  }
}

async function persistSavedAbLoops() {
  if (!state.settings) return;
  const advancedPlayback = {
    ...(state.settings.advancedPlayback || {}),
    softSkip: state.softSkip,
    abLoops: state.savedAbLoops,
    abLoopPadLayouts: state.abLoopPadLayouts
  };
  state.settings.advancedPlayback = advancedPlayback;
  try {
    await saveSettingsPatch({ advancedPlayback });
  } catch (error) {
    showToast(error.message || "Could not save A-B loops.");
  }
}

async function persistAbLoopPadLayouts() {
  if (!state.settings) return;
  const advancedPlayback = {
    ...(state.settings.advancedPlayback || {}),
    softSkip: state.softSkip,
    abLoops: state.savedAbLoops,
    abLoopPadLayouts: state.abLoopPadLayouts
  };
  state.settings.advancedPlayback = advancedPlayback;
  try {
    await saveSettingsPatch({ advancedPlayback });
  } catch (error) {
    showToast(error.message || "Could not save loop pads.");
  }
}

async function persistSoftSkipSetting(options = {}) {
  if (!state.settings) return;
  const advancedPlayback = {
    ...(state.settings.advancedPlayback || {}),
    softSkip: state.softSkip,
    softSkipConfigured: true
  };
  state.settings.advancedPlayback = advancedPlayback;
  try {
    const settings = await saveSettingsPatch({ advancedPlayback: { softSkip: state.softSkip } });
    state.softSkip = settings.advancedPlayback?.softSkip === true;
    saveAdvancedPlaybackSettings();
  } catch (error) {
    if (!options.silent) showToast(error.message || "Could not save soft skip.");
  } finally {
    if (state.view === "settings") renderSettings();
  }
}

function restoreAdvancedPlaybackSettings() {
  state.savedAbLoops = normalizeSavedAbLoops(state.settings?.advancedPlayback?.abLoops);
  state.abLoopPadLayouts = normalizeAbLoopPadLayouts(state.settings?.advancedPlayback?.abLoopPadLayouts);
  const advancedPlayback = state.settings?.advancedPlayback && typeof state.settings.advancedPlayback === "object"
    ? state.settings.advancedPlayback
    : {};
  const serverSoftSkip = advancedPlayback.softSkipConfigured === true
    ? advancedPlayback.softSkip === true
    : null;
  let localSoftSkip = null;
  try {
    const raw = localStorage.getItem(ADVANCED_PLAYBACK_SETTINGS_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      state.playbackSpeedOffset = normalizePlaybackSpeedOffset(saved.playbackSpeedOffset, 1);
      state.pitchShiftSemitones = normalizePitchShift(saved.pitchShiftSemitones, 0);
      localSoftSkip = Object.prototype.hasOwnProperty.call(saved, "softSkip") ? Boolean(saved.softSkip) : null;
      state.abLoop = normalizeAbLoop(saved.abLoop);
      state.abLoopPowerEnabled = Object.prototype.hasOwnProperty.call(saved, "abLoopPowerEnabled")
        ? saved.abLoopPowerEnabled === true
        : true;
      state.abLoopQueueEnabled = saved.abLoopQueueEnabled === true;
      state.abLoopEditingId = saved.abLoopEditingId ? String(saved.abLoopEditingId) : "";
      state.abLoopLauncherOpen = saved.abLoopLauncherOpen === true;
      state.sleepTimerMinutes = normalizeSleepTimerMinutes(saved.sleepTimerMinutes);
      state.sleepTimerEndsAt = Number(saved.sleepTimerEndsAt || 0);
      if (!state.sleepTimerMinutes || state.sleepTimerEndsAt <= Date.now()) {
        state.sleepTimerMinutes = 0;
        state.sleepTimerEndsAt = 0;
      }
    }
  } catch {
    state.playbackSpeedOffset = 1;
    state.pitchShiftSemitones = 0;
    state.sleepTimerMinutes = 0;
    state.sleepTimerEndsAt = 0;
    state.abLoop = normalizeAbLoop();
    state.abLoopPowerEnabled = true;
    state.abLoopQueueEnabled = false;
    state.abLoopEditingId = "";
    state.abLoopLauncherOpen = false;
  }
  if (!savedAbLoopById(state.abLoopEditingId) || state.abLoop.id !== state.abLoopEditingId) {
    state.abLoopEditingId = "";
  }
  if (!state.abLoopPowerEnabled) {
    state.abLoop.active = false;
    state.abLoopQueueIds = [];
    state.abLoopLauncherOpen = false;
  }
  state.softSkip = serverSoftSkip ?? localSoftSkip ?? false;
  if (serverSoftSkip === null && localSoftSkip !== null) {
    persistSoftSkipSetting({ silent: true });
  }
}

function normalizedPlaylistTrackTrims(playlist = {}) {
  const source = playlist?.trackTrims && typeof playlist.trackTrims === "object" ? playlist.trackTrims : {};
  const result = {};
  for (const [trackId, value] of Object.entries(source)) {
    const track = trackById(trackId);
    const trim = normalizeTrackTrim(value, track ? durationForTrack(track) : 0);
    if (trackId && trim) result[trackId] = trim;
  }
  return result;
}

function playlistTrackTrim(playlist, trackId, track = null) {
  if (!playlist?.trackTrims || !trackId) return null;
  const duration = track ? durationForTrack(track) : 0;
  return normalizeTrackTrim(playlist.trackTrims[trackId], duration);
}

function playlistTrimCount(playlist) {
  return Object.keys(normalizedPlaylistTrackTrims(playlist)).length;
}

function trackTitleWithTrimMarker(track, trim) {
  return `${track?.title || ""}${trim ? " (*)" : ""}`;
}

function trimTimeText(ms) {
  return Number(ms || 0) > 0 ? msToTime(ms) : "";
}

function parseTrimTimeInput(value) {
  const text = String(value || "").trim();
  if (!text) return { ok: true, ms: 0 };
  if (/^\d+(?:\.\d+)?$/.test(text)) {
    return { ok: true, ms: Math.round(Number(text) * 1000) };
  }
  const parts = text.split(":");
  if (parts.length < 2 || parts.length > 3) return { ok: false, ms: 0 };
  let seconds = 0;
  for (const part of parts) {
    if (!/^\d+(?:\.\d+)?$/.test(part.trim())) return { ok: false, ms: 0 };
    seconds = (seconds * 60) + Number(part);
  }
  return Number.isFinite(seconds) ? { ok: true, ms: Math.round(seconds * 1000) } : { ok: false, ms: 0 };
}

function parsePreciseTimeInput(value) {
  const text = String(value || "").trim();
  if (!text) return { ok: true, ms: 0 };
  if (/^\d+(?:\.\d+)?$/.test(text)) {
    return { ok: true, ms: preciseMs(Number(text) * 1000) };
  }
  const parts = text.split(":");
  if (parts.length < 2 || parts.length > 3) return { ok: false, ms: 0 };
  let seconds = 0;
  for (let index = 0; index < parts.length; index += 1) {
    const part = parts[index].trim();
    const isLast = index === parts.length - 1;
    if (!/^\d+(?:\.\d+)?$/.test(part)) return { ok: false, ms: 0 };
    if (!isLast && part.includes(".")) return { ok: false, ms: 0 };
    seconds = (seconds * 60) + Number(part);
  }
  return Number.isFinite(seconds) ? { ok: true, ms: preciseMs(seconds * 1000) } : { ok: false, ms: 0 };
}

function importedTrimValueMs(value, numbersAreSeconds = false) {
  if (value === null || value === undefined || value === "") return 0;
  if (typeof value === "string" && value.includes(":")) {
    const parsed = parseTrimTimeInput(value);
    return parsed.ok ? parsed.ms : 0;
  }
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) return 0;
  return Math.round(numbersAreSeconds ? numeric * 1000 : numeric);
}

function importedTrackTrim(record = {}) {
  if (!record || typeof record !== "object") return null;
  const startMs = record.trimStartMs ?? record.startMs ?? record.customStartMs ?? record.startTimeMs;
  const endMs = record.trimEndMs ?? record.endMs ?? record.customEndMs ?? record.endTimeMs;
  const fallbackStart = startMs === undefined ? importedTrimValueMs(record.start ?? record.startTime, true) : importedTrimValueMs(startMs);
  const fallbackEnd = endMs === undefined ? importedTrimValueMs(record.end ?? record.endTime, true) : importedTrimValueMs(endMs);
  return normalizeTrackTrim({ startMs: fallbackStart, endMs: fallbackEnd });
}

function currentContextPlaylist(context = state.queueContext) {
  return context?.type === "playlist" && context.playlistId ? playlistById(context.playlistId) : null;
}

function trackTrimForContext(track, context = state.queueContext) {
  const playlist = currentContextPlaylist(context);
  return track && playlist ? playlistTrackTrim(playlist, track.id, track) : null;
}

function playbackWindowForTrack(track, context = state.queueContext) {
  const duration = durationForTrack(track);
  const trim = trackTrimForContext(track, context);
  let startMs = trim?.startMs || 0;
  let endMs = trim?.endMs || 0;
  if (duration > 0) {
    if (startMs >= duration) startMs = Math.max(0, duration - 1000);
    if (!endMs || endMs > duration) endMs = duration;
  }
  if (endMs > 0 && endMs <= startMs) endMs = duration > startMs ? duration : 0;
  const durationMs = endMs > 0 ? Math.max(0, endMs - startMs) : Math.max(0, duration - startMs);
  const hasTrim = Boolean(trim && (startMs > 0 || (trim.endMs > 0 && (!duration || trim.endMs < duration))));
  return { startMs, endMs, durationMs, hasTrim };
}

function currentPlaybackWindow() {
  return playbackWindowForTrack(currentTrack());
}

function timelineWindowForTrack(track, context = state.queueContext) {
  const window = playbackWindowForTrack(track, context);
  const loop = state.abLoop;
  if (!track || !abLoopEnabled(loop) || loop.trackId !== track.id || loop.bMs - loop.aMs < AB_LOOP_MIN_MS) {
    return { ...window, zoomed: false };
  }
  const duration = durationForTrack(track);
  const playbackEnd = window.endMs || duration || Math.max(loop.bMs + AB_LOOP_TIMELINE_MARGIN_MS, window.startMs);
  const startMs = preciseMs(Math.max(window.startMs, loop.aMs - AB_LOOP_TIMELINE_MARGIN_MS));
  const endMs = preciseMs(Math.min(playbackEnd, loop.bMs + AB_LOOP_TIMELINE_MARGIN_MS));
  if (!(endMs > startMs)) return { ...window, zoomed: false };
  return {
    ...window,
    startMs,
    endMs,
    durationMs: preciseMs(endMs - startMs),
    zoomed: true,
    playbackStartMs: window.startMs,
    playbackEndMs: window.endMs
  };
}

function currentTimelineWindow() {
  const track = currentTrack();
  if (state.abLoopMarkerDrag && state.abLoopMarkerDragWindow?.trackId === track?.id) {
    return state.abLoopMarkerDragWindow;
  }
  return timelineWindowForTrack(track);
}

function clampToPlaybackWindowEnd(track, timeMs, context = state.queueContext) {
  const window = playbackWindowForTrack(track, context);
  let target = Number(timeMs);
  if (!Number.isFinite(target) || target <= 0) target = window.startMs;
  if (target < window.startMs) target = window.startMs;
  if (window.endMs > 0 && target > window.endMs) target = window.endMs;
  return preciseMs(target);
}

function clampToPlaybackWindow(track, timeMs, context = state.queueContext) {
  const window = playbackWindowForTrack(track, context);
  let target = Number(timeMs);
  if (!Number.isFinite(target) || target <= 0) target = window.startMs;
  if (target < window.startMs) target = window.startMs;
  if (window.endMs > 0 && target >= window.endMs) target = window.startMs;
  return preciseMs(target);
}

function seekPlaybackWindowOffset(track, offsetMs, context = state.queueContext) {
  const window = playbackWindowForTrack(track, context);
  let target = window.startMs + Math.max(0, Number(offsetMs || 0));
  if (window.endMs > 0) target = Math.min(target, Math.max(window.startMs, window.endMs - 50));
  return preciseMs(target);
}

function seekTimelineWindowOffset(track, offsetMs, options = {}) {
  const window = options.window || currentTimelineWindow();
  let target = window.startMs + Math.max(0, Number(offsetMs || 0));
  if (window.endMs > 0) {
    const end = options.allowEnd ? window.endMs : Math.max(window.startMs, window.endMs - 50);
    target = Math.min(target, end);
  }
  return preciseMs(target);
}

function applyVolume(value) {
  state.volume = clampVolume(value);
  primaryAudio.volume = state.volume;
  secondaryAudio.volume = state.volume;
  syncReversePlaybackVolume();
  applyMuteState();
  renderVolumeControl();
}

function applyMuteState() {
  primaryAudio.muted = state.muted;
  secondaryAudio.muted = state.muted;
  syncReversePlaybackVolume();
}

function applyPlaybackRateToPlayer(player) {
  if (!player) return;
  const rate = playbackRateFromSpeedOffset();
  try {
    player.defaultPlaybackRate = rate;
    player.playbackRate = rate;
    player.preservesPitch = true;
    player.mozPreservesPitch = true;
    player.webkitPreservesPitch = true;
  } catch {
    try {
      const fallbackRate = playbackRateFromSpeedOffset();
      player.defaultPlaybackRate = fallbackRate;
      player.playbackRate = fallbackRate;
    } catch {
      // Playback rate support varies by media backend.
    }
  }
}

function applyAdvancedPlaybackSettings(options = {}) {
  applyPlaybackRateToPlayer(primaryAudio);
  applyPlaybackRateToPlayer(secondaryAudio);
  syncReversePlaybackRate();
  syncReversePlaybackVolume();
  applyEqSettingsToAudio({ ensure: options.ensureAudioGraph === true });
  syncMediaSessionPosition();
  syncAdvancedPlaybackUi();
}

function setPlaybackSpeedOffset(value) {
  const previousSpeed = normalizePlaybackSpeedOffset(state.playbackSpeedOffset, 1);
  state.playbackSpeedOffset = normalizePlaybackSpeedOffset(value);
  applyAdvancedPlaybackSettings();
  saveAdvancedPlaybackSettings();
  renderAdvancedPlaybackPanel();
  handlePlaybackSpeedChange(previousSpeed);
}

function resetPlaybackSpeed() {
  setPlaybackSpeedOffset(1);
}

function setPitchShift(value) {
  state.pitchShiftSemitones = normalizePitchShift(value);
  if (state.pitchShiftSemitones) resumeEqAudioContext();
  applyAdvancedPlaybackSettings({ ensureAudioGraph: state.pitchShiftSemitones !== 0 });
  saveAdvancedPlaybackSettings();
  renderAdvancedPlaybackPanel();
}

async function setSoftSkip(value, options = {}) {
  state.softSkip = Boolean(value);
  saveAdvancedPlaybackSettings();
  if (options.persist !== false) await persistSoftSkipSetting();
  if (state.view === "settings") renderSettings();
  syncAdvancedPlaybackUi();
}

function clearSleepTimerTick() {
  if (state.sleepTimerTickTimer) clearTimeout(state.sleepTimerTickTimer);
  state.sleepTimerTickTimer = null;
}

function sleepTimerRemainingMs() {
  return Math.max(0, Number(state.sleepTimerEndsAt || 0) - Date.now());
}

function sleepTimerStatusText() {
  if (!state.sleepTimerMinutes || !state.sleepTimerEndsAt) return "Off";
  return `Stops in ${formatCountdown(sleepTimerRemainingMs())}`;
}

function handleSleepTimerElapsed() {
  clearSleepTimerTick();
  state.sleepTimerMinutes = 0;
  state.sleepTimerEndsAt = 0;
  saveAdvancedPlaybackSettings();
  pausePlayback();
  showToast("Sleep timer paused playback.");
  renderAdvancedPlaybackPanel();
}

function scheduleSleepTimerTick() {
  clearSleepTimerTick();
  if (!state.sleepTimerMinutes || !state.sleepTimerEndsAt) return;
  const remaining = sleepTimerRemainingMs();
  if (remaining <= 0) {
    handleSleepTimerElapsed();
    return;
  }
  state.sleepTimerTickTimer = setTimeout(() => {
    syncAdvancedPlaybackUi();
    scheduleSleepTimerTick();
  }, Math.min(1000, remaining));
}

function setSleepTimer(minutes) {
  state.sleepTimerMinutes = normalizeSleepTimerMinutes(minutes);
  state.sleepTimerEndsAt = state.sleepTimerMinutes ? Date.now() + state.sleepTimerMinutes * 60 * 1000 : 0;
  saveAdvancedPlaybackSettings();
  scheduleSleepTimerTick();
  renderAdvancedPlaybackPanel();
}

function stepSleepTimer(direction) {
  const current = normalizeSleepTimerMinutes(state.sleepTimerMinutes);
  const next = direction > 0
    ? Math.min(180, current + 15 || 15)
    : Math.max(0, current - 15);
  setSleepTimer(next);
}

function renderVolumeControl() {
  const muted = state.muted || state.volume <= 0;
  const volumeRow = $("#volumeControl") || $(".volume-row");
  const equalizerButton = $("#equalizerButton");
  const muteButton = $("#muteButton");
  const volumeInput = $("#volumeInput");
  if (volumeRow) volumeRow.classList.toggle("is-muted", muted);
  if (equalizerButton) {
    const eq = eqSettings();
    equalizerButton.innerHTML = icons.equalizer;
    equalizerButton.classList.toggle("active", state.view === "equalizer");
    equalizerButton.classList.toggle("is-bypassed", Boolean(eq.bypass));
    equalizerButton.title = eq.bypass ? "Equalizer bypassed" : `Equalizer: ${eq.mode === "advanced" ? "Advanced" : "Standard"}`;
    equalizerButton.setAttribute("aria-label", equalizerButton.title);
  }
  if (volumeInput) {
    volumeInput.value = String(state.volume);
    volumeInput.style.setProperty("--volume-percent", `${Math.round(state.volume * 100)}%`);
  }
  if (muteButton) {
    muteButton.innerHTML = muted ? icons.volumeMuted : icons.volume;
    muteButton.classList.toggle("active", muted);
    muteButton.title = muted ? "Unmute" : "Mute";
    muteButton.setAttribute("aria-label", muted ? "Unmute" : "Mute");
    muteButton.setAttribute("aria-pressed", String(muted));
  }
  syncNowPlayingPlaybackControls();
}

function setMuted(value) {
  state.muted = Boolean(value);
  applyMuteState();
  renderVolumeControl();
}

function toggleMute() {
  const muted = state.muted || state.volume <= 0;
  if (muted) {
    if (state.volume <= 0) applyVolume(DEFAULT_VOLUME);
    setMuted(false);
  } else {
    setMuted(true);
  }
  schedulePlaybackSave();
}

function sanitizeHex(value) {
  const text = String(value || "").trim();
  return /^#[0-9a-f]{6}$/i.test(text) ? text : "#7d3cff";
}

function optionalHex(value) {
  const text = String(value || "").trim();
  return /^#[0-9a-f]{6}$/i.test(text) ? text : "";
}

function hexToRgb(hex) {
  const clean = sanitizeHex(hex).slice(1);
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16)
  };
}

function optionalHexToRgb(hex) {
  const clean = optionalHex(hex).slice(1);
  if (!clean) return null;
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16)
  };
}

function colorTextToHex(value) {
  const text = String(value || "").trim();
  const clean = text.startsWith("#") ? text.slice(1) : text;
  if (/^[0-9a-f]{3}$/i.test(clean)) {
    return `#${clean.split("").map((digit) => `${digit}${digit}`).join("")}`.toLowerCase();
  }
  if (/^[0-9a-f]{6}$/i.test(clean)) return `#${clean}`.toLowerCase();
  return "";
}

function clampColorValue(value, fallback, min, max) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.max(min, Math.min(max, Math.round(numeric)));
}

function rgbToHex({ r, g, b }) {
  return `#${[r, g, b].map((channel) => clampColorValue(channel, 0, 0, 255).toString(16).padStart(2, "0")).join("")}`;
}

function rgbToHsl({ r, g, b }) {
  const red = clampColorValue(r, 0, 0, 255) / 255;
  const green = clampColorValue(g, 0, 0, 255) / 255;
  const blue = clampColorValue(b, 0, 0, 255) / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const lightness = (max + min) / 2;

  if (max === min) return { h: 0, s: 0, l: Math.round(lightness * 100) };

  const delta = max - min;
  const saturation = lightness > 0.5
    ? delta / (2 - max - min)
    : delta / (max + min);
  let hue;

  if (max === red) hue = (green - blue) / delta + (green < blue ? 6 : 0);
  else if (max === green) hue = (blue - red) / delta + 2;
  else hue = (red - green) / delta + 4;

  return {
    h: Math.round(hue * 60),
    s: Math.round(saturation * 100),
    l: Math.round(lightness * 100)
  };
}

function hslToRgb({ h, s, l }) {
  const hue = ((clampColorValue(h, 0, 0, 360) % 360) + 360) % 360 / 360;
  const saturation = clampColorValue(s, 0, 0, 100) / 100;
  const lightness = clampColorValue(l, 0, 0, 100) / 100;

  if (saturation === 0) {
    const channel = Math.round(lightness * 255);
    return { r: channel, g: channel, b: channel };
  }

  const hueToRgb = (p, q, t) => {
    let next = t;
    if (next < 0) next += 1;
    if (next > 1) next -= 1;
    if (next < 1 / 6) return p + (q - p) * 6 * next;
    if (next < 1 / 2) return q;
    if (next < 2 / 3) return p + (q - p) * (2 / 3 - next) * 6;
    return p;
  };

  const q = lightness < 0.5
    ? lightness * (1 + saturation)
    : lightness + saturation - lightness * saturation;
  const p = 2 * lightness - q;

  return {
    r: Math.round(hueToRgb(p, q, hue + 1 / 3) * 255),
    g: Math.round(hueToRgb(p, q, hue) * 255),
    b: Math.round(hueToRgb(p, q, hue - 1 / 3) * 255)
  };
}

function shiftHex(hex, amount) {
  const { r, g, b } = hexToRgb(hex);
  const next = [r, g, b].map((channel) => {
    const value = amount > 0
      ? channel + (255 - channel) * amount
      : channel * (1 + amount);
    return Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, "0");
  });
  return `#${next.join("")}`;
}

function applyAccentColor(color) {
  const accent = sanitizeHex(color);
  const rgb = hexToRgb(accent);
  document.documentElement.style.setProperty("--accent", accent);
  document.documentElement.style.setProperty("--accent-2", shiftHex(accent, 0.22));
  document.documentElement.style.setProperty("--accent-3", shiftHex(accent, 0.58));
  document.documentElement.style.setProperty("--accent-dark", shiftHex(accent, -0.42));
  document.documentElement.style.setProperty("--accent-rgb", `${rgb.r}, ${rgb.g}, ${rgb.b}`);
}

function randomId(prefix = "id") {
  return globalThis.crypto?.randomUUID?.() || `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function clampDb(value, fallback = 0, min = EQ_GAIN_MIN, max = EQ_GAIN_MAX) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.max(min, Math.min(max, Math.round(numeric * 2) / 2));
}

function dbText(value, signed = false) {
  const amount = clampDb(value);
  const text = Number.isInteger(amount) ? String(amount) : amount.toFixed(1);
  return `${signed && amount > 0 ? "+" : ""}${text} dB`;
}

function dbToGain(value) {
  return Math.pow(10, clampDb(value, 0, -36, 36) / 20);
}

function eqBandsForMode(mode) {
  return mode === "advanced" ? EQ_ADVANCED_BANDS : EQ_STANDARD_BANDS;
}

function eqPresetsForMode(mode) {
  return mode === "advanced" ? ADVANCED_EQ_PRESETS : STANDARD_EQ_PRESETS;
}

function defaultEqBandValues(mode = "standard") {
  return Object.fromEntries(eqBandsForMode(mode).map((band) => [band.key, 0]));
}

function normalizeEqBandValues(value, mode = "standard") {
  const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  return Object.fromEntries(eqBandsForMode(mode).map((band) => [band.key, clampDb(source[band.key])]));
}

function normalizeEqPlaylistDefaults(value = {}) {
  const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  const result = {};
  for (const [playlistId, reference] of Object.entries(source)) {
    const id = cleanText(playlistId);
    const preset = cleanText(reference).slice(0, 220);
    if (id && preset) result[id] = preset;
  }
  return result;
}

function defaultEqSettings() {
  return {
    mode: "standard",
    standardPresetName: "Flat",
    standardPresetId: "",
    advancedPresetName: "Flat",
    advancedPresetId: "",
    standard: defaultEqBandValues("standard"),
    advanced: defaultEqBandValues("advanced"),
    preamp: 0,
    bypass: false,
    autoHeadroom: true,
    limiter: true,
    userPresets: [],
    playlistDefaults: {}
  };
}

function normalizeEqUserPreset(preset) {
  if (!preset || typeof preset !== "object" || Array.isArray(preset)) return null;
  const mode = preset.mode === "advanced" ? "advanced" : preset.mode === "standard" ? "standard" : "";
  const name = cleanText(preset.name || "").slice(0, 80);
  if (!mode || !name) return null;
  return {
    id: String(preset.id || randomId("eq-preset")),
    name,
    mode,
    bands: normalizeEqBandValues(preset.bands, mode),
    preamp: clampDb(preset.preamp, 0, EQ_PREAMP_MIN, EQ_PREAMP_MAX),
    userPreset: true,
    createdAt: preset.createdAt || new Date().toISOString(),
    updatedAt: preset.updatedAt || preset.createdAt || new Date().toISOString()
  };
}

function normalizeEqSettings(value = {}) {
  const defaults = defaultEqSettings();
  const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  return {
    ...defaults,
    ...source,
    mode: source.mode === "advanced" ? "advanced" : "standard",
    standardPresetName: cleanText(source.standardPresetName || source.presetName || defaults.standardPresetName) || "Flat",
    standardPresetId: String(source.standardPresetId || ""),
    advancedPresetName: cleanText(source.advancedPresetName || source.presetName || defaults.advancedPresetName) || "Flat",
    advancedPresetId: String(source.advancedPresetId || ""),
    standard: normalizeEqBandValues(source.standard, "standard"),
    advanced: normalizeEqBandValues(source.advanced, "advanced"),
    preamp: clampDb(source.preamp, defaults.preamp, EQ_PREAMP_MIN, EQ_PREAMP_MAX),
    bypass: Boolean(source.bypass),
    autoHeadroom: source.autoHeadroom !== false,
    limiter: source.limiter !== false,
    userPresets: Array.isArray(source.userPresets)
      ? source.userPresets.map(normalizeEqUserPreset).filter(Boolean)
      : [],
    playlistDefaults: normalizeEqPlaylistDefaults(source.playlistDefaults)
  };
}

function eqSettings() {
  const eq = normalizeEqSettings(state.settings?.eq);
  if (state.settings) state.settings.eq = eq;
  return eq;
}

function setEqSettings(eq) {
  if (!state.settings) return normalizeEqSettings(eq);
  state.settings.eq = normalizeEqSettings(eq);
  return state.settings.eq;
}

function eqPresetNameField(mode) {
  return mode === "advanced" ? "advancedPresetName" : "standardPresetName";
}

function eqPresetIdField(mode) {
  return mode === "advanced" ? "advancedPresetId" : "standardPresetId";
}

function eqBandValuesEqual(left, right, mode) {
  return eqBandsForMode(mode).every((band) => clampDb(left?.[band.key]) === clampDb(right?.[band.key]));
}

function matchingEqPreset(mode, bands) {
  const builtIn = eqPresetsForMode(mode).find((preset) => eqBandValuesEqual(preset.bands, bands, mode));
  if (builtIn) return { type: "builtin", id: "", name: builtIn.name };
  const userPreset = eqSettings().userPresets.find((preset) => preset.mode === mode && eqBandValuesEqual(preset.bands, bands, mode));
  return userPreset ? { type: "user", id: userPreset.id, name: userPreset.name } : null;
}

function applyEqPresetMatch(eq, mode) {
  const match = matchingEqPreset(mode, eq[mode]);
  eq[eqPresetNameField(mode)] = match?.name || "Custom";
  eq[eqPresetIdField(mode)] = match?.type === "user" ? match.id : "";
}

function maxEqBoost(eq, mode = eq.mode) {
  return Math.max(0, ...Object.values(eq[mode] || {}).map((value) => clampDb(value)));
}

function recommendedEqPreamp(eq, mode = eq.mode) {
  const boost = maxEqBoost(eq, mode);
  if (boost <= 0) return 0;
  if (boost <= 2) return -1;
  if (boost <= 3) return -2;
  if (boost <= 4) return -3;
  if (boost <= 5) return -4;
  return -Math.min(12, Math.ceil(boost));
}

function applyAutoHeadroom(eq, mode = eq.mode) {
  if (eq.autoHeadroom) eq.preamp = recommendedEqPreamp(eq, mode);
}

function eqClippingInfo(eq = eqSettings()) {
  if (eq.bypass) return { tone: "muted", label: "Bypassed", detail: "Original signal" };
  const peak = maxEqBoost(eq, eq.mode) + clampDb(eq.preamp, 0, EQ_PREAMP_MIN, EQ_PREAMP_MAX);
  if (peak <= 0) return { tone: "safe", label: "Clean", detail: "Headroom OK" };
  if (eq.limiter) return { tone: "limit", label: "Limiter", detail: `${dbText(peak, true)} peak guard` };
  return { tone: "risk", label: "Clipping Risk", detail: `${dbText(peak, true)} over` };
}

function setAudioParam(param, value) {
  if (!param) return;
  const context = param.context || eqAudioContext;
  try {
    const now = context?.currentTime || 0;
    param.cancelScheduledValues(now);
    param.setTargetAtTime(value, now, 0.018);
  } catch {
    param.value = value;
  }
}

function ensureEqAudioContext() {
  const AudioContextClass = globalThis.AudioContext || globalThis.webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!eqAudioContext) eqAudioContext = new AudioContextClass();
  return eqAudioContext;
}

function createPitchModulationBuffer(context, cycleSeconds, ratio) {
  const sampleRate = context.sampleRate || 44100;
  const length = Math.max(2, Math.ceil(cycleSeconds * sampleRate));
  const buffer = context.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);
  for (let index = 0; index < length; index += 1) {
    const phase = index / Math.max(1, length - 1);
    data[index] = ratio >= 1
      ? PITCH_SHIFT_DELAY_DEPTH_SECONDS * (1 - phase)
      : PITCH_SHIFT_DELAY_DEPTH_SECONDS * phase;
  }
  return buffer;
}

function createPitchFadeBuffer(context, cycleSeconds) {
  const sampleRate = context.sampleRate || 44100;
  const length = Math.max(2, Math.ceil(cycleSeconds * sampleRate));
  const buffer = context.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);
  for (let index = 0; index < length; index += 1) {
    const phase = index / Math.max(1, length - 1);
    data[index] = Math.sin(Math.PI * phase);
  }
  return buffer;
}

function createPitchStage(context) {
  const input = context.createGain();
  const output = context.createGain();
  let currentSemitones = null;
  let internals = [];
  let modulators = [];

  const clear = () => {
    try {
      input.disconnect();
    } catch {}
    for (const source of modulators) {
      try {
        source.stop();
      } catch {}
    }
    for (const node of [...modulators, ...internals]) {
      try {
        node.disconnect();
      } catch {}
    }
    internals = [];
    modulators = [];
  };

  const connectBypass = () => {
    clear();
    input.connect(output);
  };

  const setSemitones = (value) => {
    const semitones = normalizePitchShift(value);
    if (semitones === currentSemitones) return;
    currentSemitones = semitones;
    if (!semitones) {
      connectBypass();
      return;
    }

    clear();
    const ratio = Math.pow(2, semitones / 12);
    const distance = Math.max(0.01, Math.abs(ratio - 1));
    const cycleSeconds = Math.max(0.045, Math.min(0.42, PITCH_SHIFT_DELAY_DEPTH_SECONDS / distance));
    const delayBuffer = createPitchModulationBuffer(context, cycleSeconds, ratio);
    const fadeBuffer = createPitchFadeBuffer(context, cycleSeconds);
    const mix = context.createGain();
    setAudioParam(mix.gain, 0.72);

    for (const offset of [0, cycleSeconds / 2]) {
      const delay = context.createDelay(PITCH_SHIFT_DELAY_DEPTH_SECONDS + 0.02);
      const gain = context.createGain();
      const delayMod = context.createBufferSource();
      const fadeMod = context.createBufferSource();
      delay.delayTime.value = 0;
      gain.gain.value = 0;
      delayMod.buffer = delayBuffer;
      fadeMod.buffer = fadeBuffer;
      delayMod.loop = true;
      fadeMod.loop = true;
      input.connect(delay);
      delay.connect(gain);
      gain.connect(mix);
      delayMod.connect(delay.delayTime);
      fadeMod.connect(gain.gain);
      delayMod.start(0, offset);
      fadeMod.start(0, offset);
      internals.push(delay, gain);
      modulators.push(delayMod, fadeMod);
    }

    mix.connect(output);
    internals.push(mix);
  };

  connectBypass();
  return { input, output, setSemitones };
}

function createEqAudioGraph(player) {
  const context = ensureEqAudioContext();
  if (!context) return null;
  const source = context.createMediaElementSource(player);
  const dryGain = context.createGain();
  const wetInput = context.createGain();
  const pitchStage = createPitchStage(context);
  const preamp = context.createGain();
  const filters = EQ_ADVANCED_BANDS.map(() => context.createBiquadFilter());
  const limiter = context.createDynamicsCompressor();
  const wetGain = context.createGain();
  source.connect(dryGain);
  dryGain.connect(context.destination);
  source.connect(wetInput);
  wetInput.connect(pitchStage.input);
  pitchStage.output.connect(preamp);
  let node = preamp;
  for (const filter of filters) {
    node.connect(filter);
    node = filter;
  }
  node.connect(limiter);
  limiter.connect(wetGain);
  wetGain.connect(context.destination);
  const analyser = context.createAnalyser();
  analyser.fftSize = 2048;
  analyser.minDecibels = -96;
  analyser.maxDecibels = -30;
  analyser.smoothingTimeConstant = 0.1;
  dryGain.connect(analyser);
  wetGain.connect(analyser);
  return { source, dryGain, wetInput, pitchStage, preamp, filters, limiter, wetGain, analyser, analyserData: new Uint8Array(analyser.frequencyBinCount) };
}

function createReverseAudioGraph() {
  const context = ensureEqAudioContext();
  if (!context) return null;
  const input = context.createGain();
  const dryGain = context.createGain();
  const wetInput = context.createGain();
  const pitchStage = createPitchStage(context);
  const preamp = context.createGain();
  const filters = EQ_ADVANCED_BANDS.map(() => context.createBiquadFilter());
  const limiter = context.createDynamicsCompressor();
  const wetGain = context.createGain();
  input.connect(dryGain);
  dryGain.connect(context.destination);
  input.connect(wetInput);
  wetInput.connect(pitchStage.input);
  pitchStage.output.connect(preamp);
  let node = preamp;
  for (const filter of filters) {
    node.connect(filter);
    node = filter;
  }
  node.connect(limiter);
  limiter.connect(wetGain);
  wetGain.connect(context.destination);
  const analyser = context.createAnalyser();
  analyser.fftSize = 2048;
  analyser.minDecibels = -96;
  analyser.maxDecibels = -30;
  analyser.smoothingTimeConstant = 0.1;
  dryGain.connect(analyser);
  wetGain.connect(analyser);
  return { input, dryGain, wetInput, pitchStage, preamp, filters, limiter, wetGain, analyser, analyserData: new Uint8Array(analyser.frequencyBinCount) };
}

function ensureEqAudioGraph(player) {
  if (!player) return null;
  if (browserOnlyPlaybackActive()) return null;
  if (eqAudioGraphs.has(player)) return eqAudioGraphs.get(player);
  try {
    const graph = createEqAudioGraph(player);
    if (graph) eqAudioGraphs.set(player, graph);
    return graph;
  } catch (error) {
    console.warn("Equalizer audio graph unavailable:", error.message);
    return null;
  }
}

function ensureReverseAudioGraph() {
  if (reverseAudioGraph) return reverseAudioGraph;
  try {
    reverseAudioGraph = createReverseAudioGraph();
    return reverseAudioGraph;
  } catch (error) {
    console.warn("Reverse playback audio graph unavailable:", error.message);
    return null;
  }
}

function configureEqFilter(filter, band, gain) {
  if (!filter || !band) return;
  filter.type = band.type || "peaking";
  setAudioParam(filter.frequency, band.frequency);
  setAudioParam(filter.Q, band.q || 1);
  setAudioParam(filter.gain, gain);
}

function applyEqSettingsToAudio(options = {}) {
  if (browserOnlyPlaybackActive()) return;
  const eq = eqSettings();
  if (options.ensure) {
    ensureEqAudioGraph(primaryAudio);
    ensureEqAudioGraph(secondaryAudio);
  }
  const bands = eqBandsForMode(eq.mode);
  const values = eq[eq.mode] || {};
  const pitchShift = normalizePitchShift(state.pitchShiftSemitones);
  const usesWetPath = !eq.bypass || pitchShift !== 0;
  const graphs = [...eqAudioGraphs.values()];
  if (reverseAudioGraph) graphs.push(reverseAudioGraph);
  for (const graph of graphs) {
    graph.pitchStage?.setSemitones(pitchShift);
    setAudioParam(graph.dryGain.gain, usesWetPath ? 0 : 1);
    setAudioParam(graph.wetGain.gain, usesWetPath ? 1 : 0);
    setAudioParam(graph.preamp.gain, eq.bypass ? 1 : dbToGain(eq.preamp));
    graph.filters.forEach((filter, index) => {
      const band = bands[index];
      if (band) configureEqFilter(filter, band, eq.bypass ? 0 : clampDb(values[band.key]));
      else configureEqFilter(filter, { frequency: 1000, type: "peaking", q: 1 }, 0);
    });
    graph.limiter.threshold.value = !eq.bypass && eq.limiter ? -1 : 0;
    graph.limiter.knee.value = 0;
    graph.limiter.ratio.value = !eq.bypass && eq.limiter ? 20 : 1;
    graph.limiter.attack.value = !eq.bypass && eq.limiter ? 0.003 : 0;
    graph.limiter.release.value = 0.25;
  }
}

function resumeEqAudioContext() {
  if (browserOnlyPlaybackActive()) return;
  applyEqSettingsToAudio({ ensure: true });
  if (eqAudioContext?.state === "suspended") {
    eqAudioContext.resume().catch(() => {});
  }
}

function syncReversePlaybackVolume() {
  if (!reversePlayback.gain) return;
  setAudioParam(reversePlayback.gain.gain, state.muted ? 0 : state.volume);
}

function syncReversePlaybackRate() {
  reversePlayback.rate = playbackRateFromSpeedOffset();
  if (reversePlayback.source?.playbackRate) {
    setAudioParam(reversePlayback.source.playbackRate, reversePlayback.rate);
  }
}

function reversePlaybackActive() {
  return Boolean((reversePlayback.active || reversePlayback.loading) && reversePlayback.trackId === currentTrack()?.id);
}

function reversePlaybackPositionMs() {
  if (!reversePlayback.active || !eqAudioContext) return Math.round(state.currentTime || 0);
  const elapsedMs = Math.max(0, (eqAudioContext.currentTime - reversePlayback.startedAt) * 1000 * reversePlayback.rate);
  const position = reversePlayback.startMs - elapsedMs;
  return Math.round(Math.max(reversePlayback.minMs, Math.min(reversePlayback.maxMs || reversePlayback.startMs, position)));
}

function createReversedAudioBuffer(context, sourceBuffer) {
  const channelCount = sourceBuffer.numberOfChannels || 1;
  const length = sourceBuffer.length;
  const reversed = context.createBuffer(channelCount, length, sourceBuffer.sampleRate);
  for (let channel = 0; channel < channelCount; channel += 1) {
    const source = sourceBuffer.getChannelData(channel);
    const target = reversed.getChannelData(channel);
    for (let left = 0, right = length - 1; left < length; left += 1, right -= 1) {
      target[left] = source[right];
    }
  }
  return reversed;
}

function reverseCacheKey(track, url) {
  return [
    track?.id || "",
    track?.streamKey || "",
    track?.updatedAt || "",
    url || ""
  ].join(":");
}

function trimReverseAudioCache() {
  while (reverseAudioBufferCache.size > REVERSE_BUFFER_CACHE_LIMIT) {
    const firstKey = reverseAudioBufferCache.keys().next().value;
    if (!firstKey) break;
    reverseAudioBufferCache.delete(firstKey);
  }
}

function reversePlaybackErrorMessage(track) {
  if (!track || !canStreamTrack(track)) return "Reverse playback needs a playable audio stream.";
  if (needsPlexBrowserTranscode(track)) return "Reverse playback needs a directly decodable stream for this track.";
  if (!globalThis.AudioContext && !globalThis.webkitAudioContext) return "Reverse playback needs Web Audio support.";
  return "";
}

async function loadReverseAudioBuffers(track, token) {
  const context = ensureEqAudioContext();
  if (!context) throw new Error("Reverse playback needs Web Audio support.");
  const url = audioStreamUrlForTrack(track, { cache: true });
  const key = reverseCacheKey(track, url);
  const cached = reverseAudioBufferCache.get(key);
  if (cached) return cached;
  playbackTrace("reverse-decode-start", { trackId: track.id, url });
  const response = await fetch(url, { cache: "force-cache" });
  if (token !== reversePlaybackToken) throw new Error("Reverse playback was cancelled.");
  if (!response.ok) throw new Error(`Reverse playback stream failed (${response.status}).`);
  const bytes = await response.arrayBuffer();
  if (token !== reversePlaybackToken) throw new Error("Reverse playback was cancelled.");
  const decoded = await context.decodeAudioData(bytes.slice(0));
  if (token !== reversePlaybackToken) throw new Error("Reverse playback was cancelled.");
  const reversed = createReversedAudioBuffer(context, decoded);
  const payload = {
    url,
    decoded,
    reversed,
    durationMs: Math.round(decoded.duration * 1000)
  };
  reverseAudioBufferCache.set(key, payload);
  trimReverseAudioCache();
  playbackTrace("reverse-decode-finish", {
    trackId: track.id,
    durationMs: payload.durationMs,
    channels: decoded.numberOfChannels
  });
  return payload;
}

function resetReversePlaybackState() {
  reversePlayback = {
    active: false,
    loading: false,
    token: 0,
    trackId: "",
    source: null,
    gain: null,
    timer: 0,
    startedAt: 0,
    startMs: 0,
    minMs: 0,
    maxMs: 0,
    rate: 1,
    durationMs: 0,
    stopping: false
  };
}

function stopReversePlayback(options = {}) {
  const wasActive = reversePlayback.active || reversePlayback.loading;
  const positionMs = options.positionMs ?? reversePlaybackPositionMs();
  if (options.cancelPending !== false) reversePlaybackToken += 1;
  if (reversePlayback.timer) clearInterval(reversePlayback.timer);
  reversePlayback.stopping = true;
  if (reversePlayback.source) {
    try {
      reversePlayback.source.stop();
    } catch {}
    try {
      reversePlayback.source.disconnect();
    } catch {}
  }
  if (reversePlayback.gain) {
    try {
      reversePlayback.gain.disconnect();
    } catch {}
  }
  resetReversePlaybackState();
  if (options.updateState !== false && Number.isFinite(positionMs)) {
    const track = currentTrack();
    state.currentTime = track ? clampToPlaybackWindow(track, positionMs) : Math.max(0, Math.round(positionMs));
  }
  if (wasActive && options.render) renderProgress();
}

function reverseStartMsForTrack(track, requestedMs, durationMs) {
  const window = playbackWindowForTrack(track);
  const endMs = window.endMs || durationMs || durationForTrack(track);
  let target = clampToPlaybackWindow(track, requestedMs);
  if (abLoopEnabled() && state.abLoop.trackId === track.id) {
    if (target <= state.abLoop.aMs + 120 || target > state.abLoop.bMs) target = state.abLoop.bMs;
  } else if (target <= window.startMs + 120 && endMs > window.startMs) {
    target = Math.max(window.startMs, endMs - 30);
  }
  return target;
}

function startReverseSource(track, buffers, startMs, token) {
  const context = ensureEqAudioContext();
  const graph = ensureReverseAudioGraph();
  if (!context || !graph) throw new Error("Reverse playback needs Web Audio support.");
  const window = playbackWindowForTrack(track);
  const durationMs = buffers.durationMs || Math.round(buffers.reversed.duration * 1000);
  const endMs = window.endMs || durationMs || durationForTrack(track);
  const source = context.createBufferSource();
  const gain = context.createGain();
  const rate = playbackRateFromSpeedOffset();
  source.buffer = buffers.reversed;
  source.playbackRate.value = rate;
  gain.gain.value = state.muted ? 0 : state.volume;
  source.connect(gain);
  gain.connect(graph.input);
  const offsetSeconds = Math.max(0, Math.min(buffers.reversed.duration - 0.001, ((durationMs || endMs) - startMs) / 1000));
  reversePlayback = {
    active: true,
    loading: false,
    token,
    trackId: track.id,
    source,
    gain,
    timer: 0,
    startedAt: context.currentTime,
    startMs,
    minMs: window.startMs,
    maxMs: endMs || startMs,
    rate,
    durationMs,
    stopping: false
  };
  source.onended = () => {
    if (reversePlayback.token !== token || reversePlayback.stopping) return;
    tickReversePlayback({ ended: true });
  };
  source.start(0, offsetSeconds);
  reversePlayback.timer = setInterval(tickReversePlayback, REVERSE_PLAYBACK_TICK_MS);
}

async function startReversePlayback(options = {}) {
  const track = currentTrack();
  const message = reversePlaybackErrorMessage(track);
  if (message) {
    showToast(message);
    state.isPlaying = false;
    state.audioTransitioning = false;
    renderPlaybackSurfaces();
    return false;
  }

  const requestedMs = Number.isFinite(Number(options.positionMs)) ? Number(options.positionMs) : playbackPositionMs();
  stopReversePlayback({ updateState: false, cancelPending: false });
  const token = reversePlaybackToken + 1;
  reversePlaybackToken = token;
  reversePlayback = {
    ...reversePlayback,
    loading: true,
    token,
    trackId: track.id,
    startMs: clampToPlaybackWindow(track, requestedMs),
    rate: playbackRateFromSpeedOffset()
  };
  state.audioTransitioning = true;
  state.isPlaying = true;
  audio.pause();
  clearFakeTimer();
  renderPlaybackSurfaces();
  syncAdvancedPlaybackUi();

  try {
    const context = ensureEqAudioContext();
    await context?.resume?.();
    const buffers = await loadReverseAudioBuffers(track, token);
    if (token !== reversePlaybackToken || currentTrack()?.id !== track.id || !reversePlaybackRequested()) return false;
    const startMs = reverseStartMsForTrack(track, requestedMs, buffers.durationMs);
    state.currentTime = startMs;
    startReverseSource(track, buffers, startMs, token);
    state.audioTransitioning = false;
    finishPlaybackHandoff();
    applyEqSettingsToAudio();
    syncAdvancedPlaybackUi();
    renderPlaybackSurfaces();
    schedulePlaybackSave();
    return true;
  } catch (error) {
    if (token !== reversePlaybackToken) return false;
    console.warn("Reverse playback failed:", error?.message || error);
    playbackTrace("reverse-playback-error", {
      trackId: track?.id || "",
      error: error?.message || String(error || "")
    });
    stopReversePlayback({ positionMs: requestedMs, updateState: true });
    state.isPlaying = false;
    state.audioTransitioning = false;
    showToast(error?.message || "Reverse playback could not start.");
    renderPlaybackSurfaces();
    schedulePlaybackSave();
    return false;
  }
}

function seekPlaybackToMs(timeMs, options = {}) {
  const track = currentTrack();
  const target = track ? clampToPlaybackWindow(track, timeMs) : Math.max(0, Math.round(Number(timeMs || 0)));
  state.currentTime = target;
  if (reversePlaybackRequested()) {
    if (reversePlayback.active || reversePlayback.loading || (state.isPlaying && options.restartReverse !== false)) {
      startReversePlayback({ positionMs: target });
    }
  } else if (audio.src) {
    try {
      audio.currentTime = target / 1000;
    } catch {
      // Some streams are not seekable until metadata is ready.
    }
  }
  if (options.save !== false) schedulePlaybackSave();
  if (options.render !== false) renderProgress();
  return target;
}

function handlePlaybackSpeedChange(previousSpeed) {
  const track = currentTrack();
  const wasReverse = reversePlaybackRequested(previousSpeed);
  const isReverse = reversePlaybackRequested();
  if (!track) {
    stopReversePlayback({ updateState: false });
    return;
  }

  if (isReverse) {
    const target = playbackPositionMs();
    audio.pause();
    if (state.isPlaying) startReversePlayback({ positionMs: target });
    else stopReversePlayback({ positionMs: target, render: true });
    return;
  }

  if (wasReverse || reversePlayback.active || reversePlayback.loading) {
    const target = playbackPositionMs();
    stopReversePlayback({ positionMs: target, render: true });
    if (canStreamTrack(track)) {
      if (!audio.src) loadCurrentTrack({ preserveTime: true, currentTime: target, autoplay: state.isPlaying, preservePlaybackSession: true });
      else {
        try {
          audio.currentTime = target / 1000;
        } catch {}
        if (state.isPlaying) audio.play().catch((error) => handleAudioPlayFailure(track, error));
      }
    }
  }
}

function tickReversePlayback(options = {}) {
  if (!reversePlayback.active || reversePlayback.trackId !== currentTrack()?.id) return;
  const track = currentTrack();
  const position = reversePlaybackPositionMs();
  state.currentTime = position;
  if (abLoopEnabled() && position <= state.abLoop.aMs + 60) {
    maybeApplyAbLoop();
    return;
  }
  const window = playbackWindowForTrack(track);
  if (options.ended || position <= window.startMs + 60) {
    const restartMs = window.endMs || durationForTrack(track) || reversePlayback.durationMs;
    stopReversePlayback({ positionMs: window.startMs, updateState: true });
    if (state.repeat === "one") {
      startReversePlayback({ positionMs: restartMs });
    } else {
      handleEnded();
    }
    return;
  }
  maybeScrobbleCurrent();
  renderProgress();
  schedulePlaybackSave();
}

function nowPlayingPaletteKey(track = currentTrack()) {
  if (!track) return "";
  return [track.id, track.thumb || "", track.album || "", track.updatedAt || ""].join(":");
}

function fallbackNowPlayingPalette(track = currentTrack()) {
  const base = sanitizeHex(track?.color || state.settings?.accentColor || colorForTrack(track || {}));
  return [
    shiftHex(base, -0.38),
    shiftHex(base, 0.12),
    shiftHex(base, -0.08),
    shiftHex(base, 0.34),
    "#050507"
  ];
}

function paletteStyle(colors = fallbackNowPlayingPalette()) {
  const palette = colors.length ? colors : fallbackNowPlayingPalette();
  return Array.from({ length: 5 }, (_item, index) => `--np-color-${index + 1}: ${palette[index] || palette[palette.length - 1] || "#050507"}`).join("; ");
}

function rgbToHslParts(r, g, b) {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const lightness = (max + min) / 2;
  let hue = 0;
  let saturation = 0;

  if (max !== min) {
    const delta = max - min;
    saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    if (max === red) hue = (green - blue) / delta + (green < blue ? 6 : 0);
    else if (max === green) hue = (blue - red) / delta + 2;
    else hue = (red - green) / delta + 4;
    hue *= 60;
  }

  return { hue, saturation, lightness };
}

function rgbToHexColor(r, g, b) {
  return `#${[r, g, b].map((channel) => Math.max(0, Math.min(255, Math.round(channel))).toString(16).padStart(2, "0")).join("")}`;
}

function vividPaletteColor(hex) {
  const hsl = rgbToHsl(hexToRgb(hex));
  return rgbToHex(hslToRgb({
    h: hsl.h,
    s: Math.max(68, Math.min(100, Math.round(hsl.s * 1.28))),
    l: Math.max(34, Math.min(58, hsl.l < 26 ? 40 : hsl.l))
  }));
}

function extractPaletteFromImageElement(image, maxColors = 5) {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return [];
  context.drawImage(image, 0, 0, size, size);
  const pixels = context.getImageData(0, 0, size, size).data;
  const buckets = new Map();

  for (let index = 0; index < pixels.length; index += 4) {
    const alpha = pixels[index + 3];
    if (alpha < 180) continue;
    const r = pixels[index];
    const g = pixels[index + 1];
    const b = pixels[index + 2];
    const chroma = Math.max(r, g, b) - Math.min(r, g, b);
    const { hue, saturation, lightness } = rgbToHslParts(r, g, b);
    if (lightness < 0.045 || lightness > 0.96 || saturation < 0.18 || chroma < 22) continue;
    const key = `${Math.round(hue / 14)}:${Math.round(saturation * 6)}:${Math.round(lightness * 6)}`;
    const bucket = buckets.get(key) || { r: 0, g: 0, b: 0, count: 0, score: 0, hue, saturation, lightness };
    bucket.r += r;
    bucket.g += g;
    bucket.b += b;
    bucket.count += 1;
    bucket.score += (saturation ** 2.15) * (0.62 + Math.min(0.82, lightness * 1.55)) * (0.55 + chroma / 255);
    buckets.set(key, bucket);
  }

  const candidates = Array.from(buckets.values())
    .map((bucket) => ({
      hex: vividPaletteColor(rgbToHexColor(bucket.r / bucket.count, bucket.g / bucket.count, bucket.b / bucket.count)),
      hue: bucket.hue,
      score: bucket.score * Math.pow(bucket.count + 1, 0.36)
    }))
    .sort((left, right) => right.score - left.score);

  const selected = [];
  for (const candidate of candidates) {
    const separateEnough = selected.every((color) => {
      const distance = Math.abs(candidate.hue - color.hue);
      return Math.min(distance, 360 - distance) > 14;
    });
    if (separateEnough || selected.length < 2) selected.push(candidate);
    if (selected.length >= maxColors) break;
  }

  return selected.map((color) => color.hex);
}

function loadNowPlayingPalette(track = currentTrack()) {
  const key = nowPlayingPaletteKey(track);
  if (!key || !track?.thumb || nowPlayingPaletteCache.get(key)?.status === "ready" || nowPlayingPaletteCache.get(key)?.status === "loading") return;
  const entry = { status: "loading", colors: fallbackNowPlayingPalette(track) };
  nowPlayingPaletteCache.set(key, entry);
  const token = ++nowPlayingPaletteToken;
  const image = new Image();
  image.onload = () => {
    if (token !== nowPlayingPaletteToken || nowPlayingPaletteKey(currentTrack()) !== key) return;
    const colors = extractPaletteFromImageElement(image);
    entry.status = "ready";
    entry.colors = colors.length ? colors : fallbackNowPlayingPalette(track);
    applyNowPlayingPalette(entry.colors);
  };
  image.onerror = () => {
    entry.status = "error";
    entry.colors = fallbackNowPlayingPalette(track);
    applyNowPlayingPalette(entry.colors);
  };
  image.src = artworkUrlForTrack(track);
}

function nowPlayingPalette(track = currentTrack()) {
  const key = nowPlayingPaletteKey(track);
  const cached = key ? nowPlayingPaletteCache.get(key) : null;
  const colors = cached?.colors?.length ? cached.colors : fallbackNowPlayingPalette(track);
  loadNowPlayingPalette(track);
  return colors;
}

function applyNowPlayingPalette(colors = nowPlayingPalette()) {
  const shell = $(".now-playing-mode");
  if (!shell) return;
  const palette = colors.length ? colors : fallbackNowPlayingPalette();
  for (let index = 0; index < 5; index += 1) {
    shell.style.setProperty(`--np-color-${index + 1}`, palette[index] || palette[palette.length - 1] || "#050507");
  }
}

function emptyNowPlayingSpectrum() {
  return Array.from({ length: NOW_PLAYING_SPECTRUM_BAR_COUNT }, () => 0.05);
}

function nowPlayingSpectrumBarsHtml() {
  const levels = nowPlayingSpectrumLevels.length ? Array.from(nowPlayingSpectrumLevels) : emptyNowPlayingSpectrum();
  let levelIndex = 0;
  return NOW_PLAYING_SPECTRUM_GROUPS.map((group, groupIndex) => {
    const bars = group.shape.map((_shape, barIndex) => {
      const clamped = Math.max(0.035, Math.min(1.2, levels[levelIndex] || 0.05));
      levelIndex += 1;
      return `<span class="now-playing-spectrum-bar ${group.key}" data-spectrum-group="${groupIndex}" data-spectrum-bar="${barIndex}" style="--level:${clamped.toFixed(3)}"></span>`;
    }).join("");
    return `<div class="now-playing-spectrum-group ${group.key}" aria-hidden="true">${bars}</div>`;
  }).join("");
}

function nowPlayingSpectrumGraph() {
  resumeEqAudioContext();
  if (reversePlaybackActive()) return ensureReverseAudioGraph();
  return ensureEqAudioGraph(audio);
}

function frequencyBinIndex(frequency, analyser, context = eqAudioContext) {
  const nyquist = (context?.sampleRate || 44100) / 2;
  const ratio = Math.max(0, Math.min(1, frequency / nyquist));
  return Math.max(0, Math.min(analyser.frequencyBinCount - 1, Math.round(ratio * analyser.frequencyBinCount)));
}

function spectrumBandEnergy(data, analyser, lowFreq, highFreq) {
  const startBin = frequencyBinIndex(lowFreq, analyser);
  const endBin = Math.max(startBin, frequencyBinIndex(highFreq, analyser));
  let average = 0;
  let squareSum = 0;
  let peak = 0;
  let count = 0;

  for (let bin = startBin; bin <= endBin; bin += 1) {
    const value = Math.max(0, ((data[bin] || 0) / 255) - 0.06) / 0.94;
    average += value;
    squareSum += value * value;
    if (value > peak) peak = value;
    count += 1;
  }

  if (!count) return 0;
  average /= count;
  const rms = Math.sqrt(squareSum / count);
  return (average * 0.25) + (rms * 0.35) + (peak * 0.4);
}

function shapeNowPlayingBandEnergy(raw, band) {
  const curve = band === "bass" ? 0.62 : band === "mid" ? 0.72 : 0.66;
  const gain = band === "bass" ? 1.18 : band === "mid" ? 1.08 : 1.12;
  const lifted = Math.pow(Math.max(0, raw), curve) * gain;
  return Math.min(1.2, lifted);
}

function nowPlayingSpectrumBandSlices(data, analyser, band, lowFreq, highFreq, barCount) {
  const halfCount = Math.ceil(barCount / 2);
  const slices = [];
  const minLog = Math.log10(lowFreq);
  const maxLog = Math.log10(highFreq);
  for (let index = 0; index < halfCount; index += 1) {
    const start = 10 ** (minLog + ((maxLog - minLog) * index) / halfCount);
    const end = 10 ** (minLog + ((maxLog - minLog) * (index + 1)) / halfCount);
    slices.push(shapeNowPlayingBandEnergy(spectrumBandEnergy(data, analyser, start, end), band));
  }
  return Array.from({ length: barCount }, (_item, index) => {
    const mirrorIndex = index < halfCount ? index : barCount - 1 - index;
    return slices[Math.max(0, Math.min(slices.length - 1, mirrorIndex))] || 0;
  });
}

function smoothNowPlayingBandEnergy(band, target) {
  const previous = nowPlayingSpectrumBandEnergies[band] || 0.05;
  const attack = band === "bass" ? 0.86 : band === "mid" ? 0.74 : 0.7;
  const decay = band === "bass" ? 0.18 : band === "mid" ? 0.15 : 0.14;
  const speed = target > previous ? attack : decay;
  const next = previous + (target - previous) * speed;
  nowPlayingSpectrumBandEnergies[band] = next;
  return next;
}

function decorativeSpectrumLevel(value) {
  const floor = 0.045;
  const ceiling = 1.2;
  const shaped = floor + Math.max(0, value) * (ceiling - floor);
  return Math.max(floor, Math.min(ceiling, shaped));
}

function bridgeNowPlayingSpectrumTargets(targets) {
  let boundary = 0;
  for (let groupIndex = 0; groupIndex < NOW_PLAYING_SPECTRUM_GROUPS.length - 1; groupIndex += 1) {
    boundary += NOW_PLAYING_SPECTRUM_GROUPS[groupIndex].shape.length;
    const leftEdge = boundary - 1;
    const rightEdge = boundary;
    const leftBridge = Math.max(0, leftEdge - 2);
    const rightBridge = Math.min(targets.length - 1, rightEdge + 2);
    const bridge = ((targets[leftBridge] || 0) + (targets[rightBridge] || 0)) * 0.5;
    targets[leftEdge] = Math.max(targets[leftEdge] * 0.74, (targets[leftEdge] * 0.42) + (bridge * 0.58));
    targets[rightEdge] = Math.max(targets[rightEdge] * 0.74, (targets[rightEdge] * 0.42) + (bridge * 0.58));
    if (leftEdge - 1 >= 0) targets[leftEdge - 1] = Math.max(targets[leftEdge - 1] * 0.84, (targets[leftEdge - 1] * 0.68) + (bridge * 0.32));
    if (rightEdge + 1 < targets.length) targets[rightEdge + 1] = Math.max(targets[rightEdge + 1] * 0.84, (targets[rightEdge + 1] * 0.68) + (bridge * 0.32));
  }
}

function smoothNowPlayingSpectrumTargets(source, target) {
  for (let index = 0; index < source.length; index += 1) {
    const previous = source[Math.max(0, index - 1)] || 0;
    const current = source[index] || 0;
    const next = source[Math.min(source.length - 1, index + 1)] || 0;
    target[index] = (previous * 0.18) + (current * 0.64) + (next * 0.18);
  }
}

function updateNowPlayingSpectrumLevels(graph) {
  const analyser = graph?.analyser;
  const data = graph?.analyserData;
  window.__VOIDFM_AUDIO_CONTEXT_STATE__ = eqAudioContext?.state || "";
  const playbackAudible = reversePlaybackActive() || (!audio.paused && audio.src);
  if (!analyser || !data || !state.isPlaying || !playbackAudible) {
    for (let index = 0; index < nowPlayingSpectrumLevels.length; index += 1) {
      nowPlayingSpectrumLevels[index] = Math.max(0.035, nowPlayingSpectrumLevels[index] * 0.86);
    }
    nowPlayingSpectrumBassPulse *= 0.86;
    Object.keys(nowPlayingSpectrumBandEnergies).forEach((band) => {
      nowPlayingSpectrumBandEnergies[band] = Math.max(0.035, nowPlayingSpectrumBandEnergies[band] * 0.9);
    });
    return { active: false, peak: 0, bassPulse: nowPlayingSpectrumBassPulse };
  }

  analyser.getByteFrequencyData(data);
  const energies = {
    bass: smoothNowPlayingBandEnergy("bass", shapeNowPlayingBandEnergy(spectrumBandEnergy(data, analyser, 35, 220), "bass")),
    mid: smoothNowPlayingBandEnergy("mid", shapeNowPlayingBandEnergy(spectrumBandEnergy(data, analyser, 220, 4200), "mid")),
    treble: smoothNowPlayingBandEnergy("treble", shapeNowPlayingBandEnergy(spectrumBandEnergy(data, analyser, 4200, 16000), "treble"))
  };
  const detail = {
    bass: nowPlayingSpectrumBandSlices(data, analyser, "bass", 35, 220, 13),
    mid: nowPlayingSpectrumBandSlices(data, analyser, "mid", 220, 4200, 13),
    treble: nowPlayingSpectrumBandSlices(data, analyser, "treble", 4200, 16000, 13)
  };
  let peak = 0;
  let levelIndex = 0;

  for (const group of NOW_PLAYING_SPECTRUM_GROUPS) {
    const energy = energies[group.key] || 0;
    for (let barIndex = 0; barIndex < group.shape.length; barIndex += 1) {
      const shape = group.shape[barIndex];
      const barEnergy = (energy * 0.55) + ((detail[group.key]?.[barIndex] || 0) * 0.45);
      const shapeLift = 0.28 + (shape * 0.72);
      const target = decorativeSpectrumLevel((0.04 + barEnergy * group.scale) * shapeLift);
      nowPlayingSpectrumTargets[levelIndex] = target;
      levelIndex += 1;
    }
  }

  bridgeNowPlayingSpectrumTargets(nowPlayingSpectrumTargets);
  smoothNowPlayingSpectrumTargets(nowPlayingSpectrumTargets, nowPlayingSpectrumBlendedTargets);
  levelIndex = 0;

  for (const group of NOW_PLAYING_SPECTRUM_GROUPS) {
    for (let barIndex = 0; barIndex < group.shape.length; barIndex += 1) {
      const target = nowPlayingSpectrumBlendedTargets[levelIndex] || 0.045;
      const previous = nowPlayingSpectrumLevels[levelIndex] || 0.035;
      const attack = group.key === "bass" ? 0.94 : group.key === "mid" ? 0.82 : 0.78;
      const decay = group.key === "bass" ? 0.2 : group.key === "mid" ? 0.17 : 0.15;
      const speed = target > previous ? attack : decay;
      const next = previous + (target - previous) * speed;
      nowPlayingSpectrumLevels[levelIndex] = next;
      if (next > peak) peak = next;
      levelIndex += 1;
    }
  }

  const bassTarget = Math.min(1, energies.bass);
  const bassAttack = bassTarget > nowPlayingSpectrumBassPulse ? 0.5 : 0.08;
  nowPlayingSpectrumBassPulse += (bassTarget - nowPlayingSpectrumBassPulse) * bassAttack;

  return { active: true, peak, bassPulse: nowPlayingSpectrumBassPulse };
}

function updateNowPlayingVisualizer() {
  nowPlayingVisualizerFrame = 0;
  if (!state.nowPlayingOpen) return;

  const bars = $$(".now-playing-spectrum-bar");
  if (!bars.length) {
    startNowPlayingVisualizer();
    return;
  }

  const graph = nowPlayingSpectrumGraph();
  const spectrum = updateNowPlayingSpectrumLevels(graph);

  bars.forEach((bar, index) => {
    const level = nowPlayingSpectrumLevels[index] || 0.045;
    bar.style.setProperty("--level", level.toFixed(3));
  });

  const container = $(".now-playing-spectrum");
  if (container) {
    container.classList.toggle("listening", spectrum.active);
    container.style.setProperty("--spectrum-peak", spectrum.peak.toFixed(3));
    container.style.setProperty("--bass-pulse", spectrum.bassPulse.toFixed(3));
    container.style.setProperty("--bass-scale", (1 + spectrum.bassPulse * 0.11).toFixed(3));
  }
  if (window.__VOIDFM_DEBUG_SPECTRUM__) {
    window.__VOIDFM_SPECTRUM_DEBUG__ = {
      active: spectrum.active,
      peak: Number(spectrum.peak.toFixed(3)),
      bassPulse: Number(spectrum.bassPulse.toFixed(3)),
      bandEnergies: Object.fromEntries(Object.entries(nowPlayingSpectrumBandEnergies).map(([band, value]) => [band, Number(value.toFixed(3))])),
      levels: Array.from(nowPlayingSpectrumLevels).map((level) => Number(level.toFixed(3)))
    };
  }

  startNowPlayingVisualizer();
}

function startNowPlayingVisualizer() {
  if (!state.nowPlayingOpen || nowPlayingVisualizerFrame) return;
  nowPlayingVisualizerFrame = requestAnimationFrame(updateNowPlayingVisualizer);
}

function stopNowPlayingVisualizer() {
  if (nowPlayingVisualizerFrame) cancelAnimationFrame(nowPlayingVisualizerFrame);
  nowPlayingVisualizerFrame = 0;
}

function scheduleEqSettingsSave() {
  if (state.eqSaveTimer) clearTimeout(state.eqSaveTimer);
  state.eqSaveTimer = setTimeout(async () => {
    state.eqSaveTimer = null;
    try {
      const settings = await api("/api/settings", {
        method: "POST",
        body: JSON.stringify({ eq: eqSettings() })
      });
      state.settings = settings;
      state.settings.eq = normalizeEqSettings(settings.eq);
      applyEqSettingsToAudio();
      renderPlayer();
    } catch (error) {
      showToast(error.message || "Could not save equalizer.");
    }
  }, 600);
}

async function saveEqSettingsNow(options = {}) {
  if (state.eqSaveTimer) clearTimeout(state.eqSaveTimer);
  state.eqSaveTimer = null;
  const settings = await api("/api/settings", {
    method: "POST",
    body: JSON.stringify({ eq: eqSettings() })
  });
  state.settings = settings;
  state.settings.eq = normalizeEqSettings(settings.eq);
  applyEqSettingsToAudio();
  if (options.render !== false) renderAll();
  return state.settings.eq;
}

function colorForTrack(track) {
  if (track.color) return track.color;
  const colors = ["#7d3cff", "#9f65ff", "#46d0d9", "#efad45", "#ff5579", "#49d39d"];
  let hash = 0;
  for (const char of `${track.artist}${track.album}${track.title}`) hash += char.charCodeAt(0);
  return colors[hash % colors.length];
}

function artStyle(track) {
  if (!track) return "";
  if (track.thumb) {
    const browserArtwork = window.VoidFMBrowserApi?.syncArtworkUrl?.(track.thumb);
    const artwork = browserArtwork || `/api/artwork?path=${encodeURIComponent(track.thumb)}`;
    return `background-image: linear-gradient(145deg, rgba(0,0,0,.08), rgba(0,0,0,.28)), url('${escapeHtml(artwork)}')`;
  }
  return `background: linear-gradient(145deg, rgba(255,255,255,.18), rgba(255,255,255,.02)), ${colorForTrack(track)}`;
}

function artworkUrlForTrack(track) {
  if (!track?.thumb) return "";
  return window.VoidFMBrowserApi?.syncArtworkUrl?.(track.thumb) || `/api/artwork?path=${encodeURIComponent(track.thumb)}`;
}

function artFallbackStyle(track) {
  if (!track) return "";
  return `background-image: linear-gradient(145deg, rgba(255,255,255,.18), rgba(255,255,255,.02)); background-color: ${colorForTrack(track)}`;
}

function cssUrl(value) {
  return String(value || "").replaceAll("\\", "\\\\").replaceAll("'", "\\'");
}

function lazyArtAttributes(track) {
  const fallback = artFallbackStyle(track);
  const artworkUrl = artworkUrlForTrack(track);
  return artworkUrl
    ? `style="${escapeHtml(fallback)}" data-lazy-art-url="${escapeHtml(artworkUrl)}"`
    : `style="${escapeHtml(fallback)}"`;
}

function applyLazyArtwork(element) {
  const artworkUrl = element?.dataset?.lazyArtUrl;
  if (!artworkUrl) return;
  element.style.backgroundImage = `linear-gradient(145deg, rgba(0,0,0,.08), rgba(0,0,0,.28)), url('${cssUrl(artworkUrl)}')`;
  element.style.backgroundPosition = "center";
  element.style.backgroundRepeat = "no-repeat";
  element.style.backgroundSize = element.classList.contains("artist-card-art") ? "contain" : "cover";
  element.classList.add("lazy-art-loaded");
  delete element.dataset.lazyArtUrl;
}

function resetLazyArtworkObserver() {
  if (lazyArtworkObserver) lazyArtworkObserver.disconnect();
  lazyArtworkObserver = null;
}

function hydrateLazyArtwork(root = document) {
  const elements = Array.from(root.querySelectorAll("[data-lazy-art-url]"));
  if (!elements.length) return;

  if (typeof window.IntersectionObserver !== "function") {
    window.requestAnimationFrame(() => elements.forEach(applyLazyArtwork));
    return;
  }

  if (!lazyArtworkObserver) {
    lazyArtworkObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        lazyArtworkObserver.unobserve(entry.target);
        applyLazyArtwork(entry.target);
      }
    }, {
      root: $(".main"),
      rootMargin: "700px 0px",
      threshold: 0.01
    });
  }

  elements.forEach((element) => lazyArtworkObserver.observe(element));
}

function playlistArtStyle(playlist, fallbackTrack = null) {
  if (playlist?.photoDataUrl) {
    return `background-image: linear-gradient(145deg, rgba(0,0,0,.08), rgba(0,0,0,.28)), url('${cssUrl(playlist.photoDataUrl)}')`;
  }
  return artStyle(fallbackTrack);
}

function playlistHeroBackground(playlist) {
  const textColor = optionalHex(playlist?.textColor);
  const highlightColor = optionalHex(playlist?.highlightColor);
  if (textColor && highlightColor) {
    return `linear-gradient(160deg, rgba(0,0,0,.16), rgba(0,0,0,.48)), linear-gradient(135deg, ${textColor}, ${highlightColor})`;
  }
  const singleColor = highlightColor || textColor;
  return singleColor ? `linear-gradient(160deg, rgba(0,0,0,.14), rgba(0,0,0,.5)), ${singleColor}` : "";
}

function playlistPlayingRowStyle(playlist) {
  const background = playlistHeroBackground(playlist);
  return background ? `--playlist-playing-background: ${background}` : "";
}

function playlistSidebarStyle(playlist) {
  const styles = [];
  const textColor = optionalHex(playlist?.textColor);
  const highlightColor = optionalHex(playlist?.highlightColor);
  const highlightRgb = optionalHexToRgb(highlightColor);
  if (textColor) styles.push(`--playlist-text: ${textColor}`);
  if (highlightColor) styles.push(`--playlist-highlight: ${highlightColor}`);
  if (highlightRgb) styles.push(`--playlist-highlight-rgb: ${highlightRgb.r}, ${highlightRgb.g}, ${highlightRgb.b}`);
  return styles.length ? styles.join("; ") : "";
}

function playlistCardStyle(playlist) {
  const styles = playlistSidebarStyle(playlist);
  const background = playlistHeroBackground(playlist);
  return [styles, background ? `--playlist-card-glow: ${background}` : ""].filter(Boolean).join("; ");
}

function playlistSidebarClass(playlist, active) {
  return [
    "sidebar-playlist",
    active ? "active" : "",
    optionalHex(playlist?.textColor) ? "has-playlist-text" : "",
    optionalHex(playlist?.highlightColor) ? "has-playlist-highlight" : "",
    playlistDragClass(playlist?.id)
  ].filter(Boolean).join(" ");
}

function playlistDragClass(playlistId) {
  return [
    playlistDragState.sourceId === playlistId ? "is-dragging" : "",
    playlistDragState.targetId === playlistId && playlistDragState.position === "before" ? "drag-over-before" : "",
    playlistDragState.targetId === playlistId && playlistDragState.position === "after" ? "drag-over-after" : "",
    libraryDragState.targetPlaylistId === playlistId ? "drag-over-playlist" : ""
  ].filter(Boolean).join(" ");
}

async function api(path, options = {}) {
  const method = String(options.method || "GET").toUpperCase();
  const localTokenHeaders = localApiToken && !["GET", "HEAD", "OPTIONS"].includes(method)
    ? { "X-VoidFM-Token": localApiToken }
    : {};
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...localTokenHeaders,
      ...(options.headers || {})
    }
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.detail || payload.error || "Request failed.");
  return payload;
}

function localApiTokenUrl(path) {
  if (window.VoidFMBrowserApi?.enabled) return path;
  if (!localApiToken) return path;
  const url = new URL(path, window.location.origin);
  url.searchParams.set("localApiToken", localApiToken);
  return `${url.pathname}${url.search}`;
}

function runtimeLooksFresh(runtime) {
  if (!runtime || typeof runtime !== "object") return false;
  const assetVersion = runtime.versions?.assetVersion || "";
  const preloadVersion = runtime.versions?.preloadImplementation || "";
  const fingerprintMode = runtime.versions?.fingerprintMode || "";
  return Number(runtime.runtimeApiVersion || 0) >= 2
    && assetVersion === APP_ASSET_VERSION
    && preloadVersion === "plex-warm-v2"
    && fingerprintMode === "startup";
}

function trackById(id) {
  return state.tracks.find((track) => track.id === id || track.ratingKey === id);
}

function albumKey(track) {
  return encodeURIComponent(`${track?.artist || "Unknown Artist"}\u001f${track?.album || "Unknown Album"}`);
}

function cleanText(value) {
  return String(value || "").trim();
}

function lowerText(value) {
  return cleanText(value).toLowerCase();
}

function hasSyncedLyrics(lyrics) {
  return lyrics?.status === "available"
    && Array.isArray(lyrics.syncedLines)
    && lyrics.syncedLines.length > 0;
}

function hasLyricsContent(lyrics) {
  return hasSyncedLyrics(lyrics)
    || (lyrics?.status === "plain_only" && cleanText(lyrics.plainLyrics));
}

function lyricsForTrack(trackOrId) {
  const trackId = typeof trackOrId === "string" ? trackOrId : trackOrId?.id;
  return trackId ? state.lyricsByTrackId[trackId] || null : null;
}

function currentLyrics() {
  return lyricsForTrack(currentTrack());
}

function terminalLyricsStatus(lyrics) {
  return ["available", "not_found", "plain_only", "instrumental", "error"].includes(lyrics?.status);
}

function completedLyricsLookupStatus(lyrics) {
  return ["available", "not_found", "plain_only", "instrumental"].includes(lyrics?.status);
}

function lyricsLookupAgeMs(lyrics) {
  const searchedAt = lyrics?.searchedAt ? new Date(lyrics.searchedAt).getTime() : 0;
  if (!Number.isFinite(searchedAt) || searchedAt <= 0) return Infinity;
  return Math.max(0, Date.now() - searchedAt);
}

function shouldRetryLyricsLookup(lyrics) {
  if (!lyrics) return true;
  if (lyrics.status === "loading") return false;
  if (Number(lyrics.lookupVersion || 0) < LYRICS_LOOKUP_VERSION) return true;
  if (hasSyncedLyrics(lyrics)) return false;
  if (lyrics.status === "error") return true;
  if (lyrics.status === "not_found") return lyricsLookupAgeMs(lyrics) > LYRICS_MISS_RETRY_MS;
  if (lyrics.status === "plain_only") return lyricsLookupAgeMs(lyrics) > LYRICS_PLAIN_RETRY_MS;
  if (lyrics.status === "instrumental") return lyricsLookupAgeMs(lyrics) > LYRICS_INSTRUMENTAL_RETRY_MS;
  return true;
}

function lyricsButtonVisible(track, lyrics) {
  if (!track) return false;
  if (hasLyricsContent(lyrics)) return true;
  if (!lyrics || lyrics.status === "loading" || lyrics.status === "error") return true;
  return shouldRetryLyricsLookup(lyrics);
}

function plainLyricsLines(lyrics) {
  return cleanText(lyrics?.plainLyrics)
    .split(/\r?\n/)
    .map((line) => cleanText(line))
    .filter(Boolean)
    .map((text) => ({ text }));
}

function updateTrackLyricsAvailability(trackId, available) {
  let changed = false;
  for (const track of state.tracks) {
    if (track.id === trackId || track.ratingKey === trackId) {
      changed = changed || track.hasLyrics !== available;
      track.hasLyrics = available;
    }
  }
  for (const track of state.queue) {
    if (track.id === trackId || track.ratingKey === trackId) {
      track.hasLyrics = available;
    }
  }
  if (changed) markTracksChanged();
}

function applyLyricsPayload(trackId, lyrics, track = null) {
  const id = String(trackId || "");
  if (!id) return;
  state.lyricsByTrackId[id] = lyrics || { status: "unknown" };
  const available = Boolean(hasLyricsContent(lyrics));
  updateTrackLyricsAvailability(id, available);
  if (track?.id) {
    const libraryTrack = trackById(track.id);
    if (libraryTrack) libraryTrack.hasLyrics = available;
  }
  if (currentTrack()?.id === id) broadcastLyricsState({ immediate: true });
}

function lyricIndexForTime(lines = [], currentMs = 0) {
  let active = -1;
  const position = Number(currentMs || 0) + 120;
  for (let index = 0; index < lines.length; index += 1) {
    if (Number(lines[index].timeMs || 0) <= position) active = index;
    else break;
  }
  return active;
}

function activeLyricIndex() {
  const lyrics = currentLyrics();
  if (!hasSyncedLyrics(lyrics)) return -1;
  return lyricIndexForTime(lyrics.syncedLines, playbackPositionMs());
}

function lyricsSnapshot() {
  const track = currentTrack();
  const lyrics = currentLyrics();
  const synced = hasSyncedLyrics(lyrics);
  const lines = synced ? lyrics.syncedLines : plainLyricsLines(lyrics);
  return {
    type: "voidfm:lyrics",
    track: track ? {
      id: track.id,
      title: track.title,
      artist: track.artist,
      album: track.album
    } : null,
    status: lyrics?.status || (track ? "loading" : "idle"),
    currentMs: playbackPositionMs(),
    activeIndex: synced ? activeLyricIndex() : -1,
    isPlaying: state.isPlaying,
    lines
  };
}

function shouldThrottlePlaybackBroadcast(lastAt, options = {}) {
  if (options.immediate) return false;
  if (!state.isPlaying) return false;
  const now = nowPerfMs();
  return lastAt && now - lastAt < 220;
}

function broadcastLyricsState(options = {}) {
  if (shouldThrottlePlaybackBroadcast(state.lastLyricsBroadcastAt, options)) return;
  state.lastLyricsBroadcastAt = nowPerfMs();
  const message = lyricsSnapshot();
  lyricsChannel?.postMessage(message);
  if (state.lyricsPopout && !state.lyricsPopout.closed) {
    state.lyricsPopout.postMessage(message, window.location.origin);
  }
}

function syncActiveLyricLine() {
  const nextIndex = activeLyricIndex();
  const changed = nextIndex !== state.activeLyricIndex;
  if (changed) {
    state.activeLyricIndex = nextIndex;
    $$(".lyrics-line").forEach((line) => {
      line.classList.toggle("active", Number(line.dataset.lyricIndex) === nextIndex);
    });
  }

  const queueActive = $(`.lyrics-line:not(.now-playing-lyric-line)[data-lyric-index="${nextIndex}"]`);
  if (queueActive && state.lyricsPanelOpen && changed) {
    queueActive.scrollIntoView({ block: "center", behavior: "smooth" });
  }

  if (state.nowPlayingOpen && state.nowPlayingTab === "lyrics") {
    const container = $(".now-playing-lyrics-list");
    const active = container?.querySelector(`.now-playing-lyric-line[data-lyric-index="${nextIndex}"]`);
    keepElementNearScrollTop(active, container, 6);
  }
}

function syncLyricsPlayback() {
  syncActiveLyricLine();
  broadcastLyricsState();
}

function showLyricsPanel() {
  if (!currentTrack()) return;
  if (!hasLyricsContent(currentLyrics()) && !lyricsButtonVisible(currentTrack(), currentLyrics())) return;
  state.lyricsPanelOpen = true;
  state.chordsPanelOpen = false;
  state.activeLyricIndex = -1;
  renderPlayer();
  renderQueue();
  syncLyricsPlayback();
  broadcastChordsState();
  if (shouldRetryLyricsLookup(currentLyrics())) loadLyricsForCurrentTrack();
}

function hideLyricsPanel() {
  state.lyricsPanelOpen = false;
  renderPlayer();
  renderQueue();
  broadcastLyricsState();
}

async function openLyricsPopout() {
  if (!currentTrack()) return;
  if (window.voidfmWindow?.isElectron && typeof window.voidfmWindow.openPopout === "function") {
    const opened = await window.voidfmWindow.openPopout("lyrics");
    if (opened) {
      setTimeout(() => broadcastLyricsState({ immediate: true }), 120);
      return;
    }
  }
  if (!state.lyricsPopout || state.lyricsPopout.closed) {
    state.lyricsPopout = window.open("/lyrics-popout.html", "voidfmLyrics", "width=430,height=720");
  } else {
    state.lyricsPopout.focus();
  }
  setTimeout(() => broadcastLyricsState({ immediate: true }), 120);
  if (shouldRetryLyricsLookup(currentLyrics())) loadLyricsForCurrentTrack();
}

async function loadLyricsForCurrentTrack() {
  const track = currentTrack();
  const token = ++state.lyricsRequestToken;
  state.activeLyricIndex = -1;
  if (!track) {
    state.lyricsPanelOpen = false;
    renderPlayer();
    renderQueue();
    broadcastLyricsState();
    return;
  }

  if (!state.lyricsByTrackId[track.id]) {
    state.lyricsByTrackId[track.id] = { status: "loading" };
  }
  renderPlayer();
  if (state.lyricsPanelOpen) renderQueue();

  try {
    const cached = await api(`/api/lyrics/${encodeURIComponent(track.id)}`);
    if (token !== state.lyricsRequestToken || currentTrack()?.id !== track.id) return;
    applyLyricsPayload(track.id, cached.lyrics, cached.track);
    if ((hasLyricsContent(cached.lyrics) || completedLyricsLookupStatus(cached.lyrics)) && !shouldRetryLyricsLookup(cached.lyrics)) {
      renderPlayer();
      renderQueue();
      broadcastLyricsState();
      return;
    }

    if (!hasLyricsContent(cached.lyrics)) state.lyricsByTrackId[track.id] = { status: "loading" };
    renderPlayer();
    if (state.lyricsPanelOpen) renderQueue();
    const synced = await api(`/api/lyrics/${encodeURIComponent(track.id)}/sync`, { method: "POST", body: "{}" });
    if (token !== state.lyricsRequestToken || currentTrack()?.id !== track.id) return;
    applyLyricsPayload(track.id, synced.lyrics, synced.track);
    renderPlayer();
    renderQueue();
    broadcastLyricsState();
  } catch (error) {
    if (token !== state.lyricsRequestToken || currentTrack()?.id !== track.id) return;
    applyLyricsPayload(track.id, { status: "error", detail: error.message });
    renderPlayer();
    renderQueue();
    broadcastLyricsState();
  }
}

function hasTimedChords(chords) {
  return chords?.status === "available"
    && Array.isArray(chords.changes)
    && chords.changes.length > 0;
}

function hasChordSheet(chords) {
  return ["available", "sheet_only"].includes(chords?.status)
    && Array.isArray(chords.sheetLines)
    && chords.sheetLines.some((line) => Array.isArray(line.chords) && line.chords.length > 0);
}

function hasDisplayableChords(chords) {
  return hasTimedChords(chords) || hasChordSheet(chords);
}

function chordNeedsRealignment(chords) {
  return chords?.provider === "manual"
    && chords?.rawSheet
    && Number(chords.alignment?.version || 0) < Number(window.VoidFMChords?.ALIGNMENT_VERSION || 0);
}

function chordResultIsGenerated(chords = {}) {
  return chords.provider === "voidfm-detector" || chords.sourceType === "generated";
}

function chordResultAllowed(chords = {}) {
  return !chordResultIsGenerated(chords);
}

function publicChords(chords) {
  if (!chords) return null;
  return chordResultAllowed(chords) ? chords : null;
}

function chordsForTrack(trackOrId) {
  const trackId = typeof trackOrId === "string" ? trackOrId : trackOrId?.id;
  return trackId ? publicChords(state.chordsByTrackId[trackId]) : null;
}

function currentChords() {
  return chordsForTrack(currentTrack());
}

function updateTrackChordsAvailability(trackId, available) {
  let changed = false;
  for (const track of state.tracks) {
    if (track.id === trackId || track.ratingKey === trackId) {
      changed = changed || track.hasChords !== available;
      track.hasChords = available;
    }
  }
  for (const track of state.queue) {
    if (track.id === trackId || track.ratingKey === trackId) {
      track.hasChords = available;
    }
  }
  if (changed) markTracksChanged();
}

function applyChordsPayload(trackId, chords, track = null) {
  const id = String(trackId || "");
  if (!id) return;
  state.chordsByTrackId[id] = chords || { status: "idle" };
  const available = hasDisplayableChords(publicChords(chords));
  updateTrackChordsAvailability(id, available);
  if (track?.id) {
    const libraryTrack = trackById(track.id);
    if (libraryTrack) libraryTrack.hasChords = available;
  }
  if (currentTrack()?.id === id) broadcastChordsState({ immediate: true });
}

function chordsButtonVisible(track, chords) {
  return Boolean(track);
}

function activeChordIndex() {
  const chords = currentChords();
  if (!hasTimedChords(chords)) return -1;
  return window.VoidFMChords?.chordIndexForTime
    ? window.VoidFMChords.chordIndexForTime(chords.changes, playbackPositionMs())
    : -1;
}

function activeChordSheetLineIndex() {
  const chords = currentChords();
  if (hasChordSheet(chords)) {
    const position = playbackPositionMs() + 120;
    let active = -1;
    for (let index = 0; index < chords.sheetLines.length; index += 1) {
      const line = chords.sheetLines[index];
      const start = Number(line.timeMs);
      if (!Number.isFinite(start)) continue;
      const end = Number(line.endTimeMs || 0);
      if (start <= position && (!end || end > position)) return index;
      if (start <= position) active = index;
      else break;
    }
    if (active >= 0) return active;
  }
  const active = activeChordIndex();
  const lineIndex = active >= 0 ? Number(chords?.changes?.[active]?.lineIndex) : -1;
  return Number.isFinite(lineIndex) ? lineIndex : -1;
}

function keepElementNearScrollTop(element, container = $("#queueList"), topPaddingPx = 8) {
  if (!element || !container || !element.isConnected || !container.isConnected) return;
  const containerRect = container.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();
  if (!containerRect.height || !elementRect.height) return;

  const sticky = container.querySelector(".chords-sticky");
  const stickyRect = sticky?.getBoundingClientRect();
  const stickyBottom = stickyRect ? Math.min(containerRect.bottom, Math.max(containerRect.top, stickyRect.bottom)) : containerRect.top;
  const targetTop = stickyBottom + topPaddingPx;
  const maxScrollTop = Math.max(0, container.scrollHeight - container.clientHeight);
  const nextScrollTop = Math.max(0, Math.min(maxScrollTop, container.scrollTop + elementRect.top - targetTop));
  if (Math.abs(nextScrollTop - container.scrollTop) < 2) return;
  container.scrollTo({ top: nextScrollTop, behavior: "smooth" });
}

function chordsSnapshot() {
  const track = currentTrack();
  const chords = currentChords();
  const hasChords = hasTimedChords(chords);
  return {
    type: "voidfm:chords",
    track: track ? {
      id: track.id,
      title: track.title,
      artist: track.artist,
      album: track.album
    } : null,
    status: chords?.status || (track ? "idle" : "idle"),
    currentMs: playbackPositionMs(),
    activeIndex: hasChords ? activeChordIndex() : -1,
    activeSheetLineIndex: hasChordSheet(chords) ? activeChordSheetLineIndex() : -1,
    activeChord: "",
    isPlaying: state.isPlaying,
    key: chords?.key || "",
    summaryChords: hasDisplayableChords(chords) ? chords.summaryChords || [] : [],
    changes: hasChords ? chords.changes : [],
    sheetLines: hasChordSheet(chords) ? chords.sheetLines : [],
    alignment: chords?.alignment || null
  };
}

function broadcastChordsState(options = {}) {
  if (shouldThrottlePlaybackBroadcast(state.lastChordsBroadcastAt, options)) return;
  state.lastChordsBroadcastAt = nowPerfMs();
  const message = chordsSnapshot();
  chordsChannel?.postMessage(message);
  if (state.chordsPopout && !state.chordsPopout.closed) {
    state.chordsPopout.postMessage(message, window.location.origin);
  }
}

function syncActiveChordLine() {
  const previousIndex = state.activeChordIndex;
  const previousLineIndex = state.activeChordSheetLineIndex;
  const nextIndex = activeChordIndex();
  const activeLineIndex = activeChordSheetLineIndex();
  state.activeChordIndex = nextIndex;
  state.activeChordSheetLineIndex = activeLineIndex;
  $$(".chord-change").forEach((line) => {
    line.classList.toggle("active", Number(line.dataset.chordIndex) === nextIndex);
  });
  $$(".chord-chip.active").forEach((chip) => chip.classList.remove("active"));
  $$(".chord-sheet-line").forEach((line) => {
    line.classList.toggle("active", Number(line.dataset.sheetLineIndex) === activeLineIndex);
  });
  const active = $(`.chord-change[data-chord-index="${nextIndex}"]`);
  const activeSheetLine = $(`.chord-sheet-line[data-sheet-line-index="${activeLineIndex}"]`);
  if (state.chordsPanelOpen && (activeLineIndex !== previousLineIndex || (!activeSheetLine && nextIndex !== previousIndex))) {
    keepElementNearScrollTop(activeSheetLine || active, $("#queueList"));
  }
}

function syncChordPlayback() {
  syncActiveChordLine();
  broadcastChordsState();
}

function chordSyncSettings() {
  return {
    onlineLookup: state.settings?.chordSync?.onlineLookup === true,
    analysisFallback: false
  };
}

function showChordsPanel() {
  const track = currentTrack();
  if (!track) return;
  state.chordsPanelOpen = true;
  state.lyricsPanelOpen = false;
  state.activeChordIndex = -1;
  state.activeChordSheetLineIndex = -1;
  state.chordImportStatus = "";
  renderPlayer();
  renderQueue();
  syncChordPlayback();
  broadcastLyricsState();
  loadChordsForCurrentTrack({ sync: true });
}

function hideChordsPanel() {
  state.chordsPanelOpen = false;
  renderPlayer();
  renderQueue();
  broadcastChordsState();
}

async function openChordsPopout() {
  if (!hasDisplayableChords(currentChords())) return;
  if (window.voidfmWindow?.isElectron && typeof window.voidfmWindow.openPopout === "function") {
    const opened = await window.voidfmWindow.openPopout("chords");
    if (opened) {
      setTimeout(broadcastChordsState, 120);
      return;
    }
  }
  if (!state.chordsPopout || state.chordsPopout.closed) {
    state.chordsPopout = window.open("/chords-popout.html", "voidfmChords", "width=430,height=720");
  } else {
    state.chordsPopout.focus();
  }
  setTimeout(broadcastChordsState, 120);
}

async function loadChordsForCurrentTrack(options = {}) {
  const track = currentTrack();
  const sync = Boolean(options.sync);
  const settings = chordSyncSettings();
  const shouldLookupOnline = sync && settings.onlineLookup;
  const token = ++state.chordsRequestToken;
  state.activeChordIndex = -1;
  if (!track) {
    state.chordsPanelOpen = false;
    renderPlayer();
    renderQueue();
    broadcastChordsState();
    return;
  }

  if (!state.chordsByTrackId[track.id]) {
    state.chordsByTrackId[track.id] = { status: sync ? "searching" : "loading" };
  }
  renderPlayer();
  if (state.chordsPanelOpen) renderQueue();

  try {
    const cached = await api(`/api/chords/${encodeURIComponent(track.id)}`);
    if (token !== state.chordsRequestToken || currentTrack()?.id !== track.id) return;
    applyChordsPayload(track.id, cached.chords, cached.track);
    if (sync && chordNeedsRealignment(cached.chords)) {
      state.chordImportStatus = "Refreshing chord alignment...";
      renderQueue();
      const realigned = await api(`/api/chords/${encodeURIComponent(track.id)}/manual`, {
        method: "POST",
        body: JSON.stringify({ lookupLyrics: true })
      });
      if (token !== state.chordsRequestToken || currentTrack()?.id !== track.id) return;
      applyChordsPayload(track.id, realigned.chords, realigned.track);
      state.chordImportStatus = "Chord alignment refreshed.";
      renderPlayer();
      renderQueue();
      broadcastChordsState();
      return;
    }
    if (hasDisplayableChords(cached.chords) || !sync) {
      if (!cached.chords && !sync) state.chordsByTrackId[track.id] = { status: "idle" };
      renderPlayer();
      renderQueue();
      broadcastChordsState();
      return;
    }

    let onlineChords = null;
    if (shouldLookupOnline) {
      state.chordsByTrackId[track.id] = { status: "searching" };
      renderPlayer();
      renderQueue();
      broadcastChordsState();
      const synced = await api(`/api/chords/${encodeURIComponent(track.id)}/sync`, { method: "POST", body: "{}" });
      if (token !== state.chordsRequestToken || currentTrack()?.id !== track.id) return;
      onlineChords = synced.chords;
      applyChordsPayload(track.id, synced.chords, synced.track);
      if (hasDisplayableChords(synced.chords)) {
        renderPlayer();
        renderQueue();
        broadcastChordsState();
        return;
      }
    }

    applyChordsPayload(track.id, onlineChords || { status: "not_found", provider: "isophonics", sourceType: "annotation", changes: [], summaryChords: [] });
    renderPlayer();
    renderQueue();
    broadcastChordsState();
  } catch (error) {
    if (token !== state.chordsRequestToken || currentTrack()?.id !== track.id) return;
    applyChordsPayload(track.id, {
      status: "error",
      provider: "isophonics",
      sourceType: "annotation",
      detail: error.message,
      changes: [],
      summaryChords: []
    });
    renderPlayer();
    renderQueue();
    broadcastChordsState();
  }
}

async function saveManualChordsForCurrentTrack(sheetText) {
  const track = currentTrack();
  const rawSheet = String(sheetText || "").trim();
  if (!track) return;
  if (!rawSheet) {
    state.chordImportStatus = "Paste a chord sheet first.";
    renderQueue();
    return;
  }
  state.chordImportStatus = "Aligning chords with synced lyrics...";
  state.chordsByTrackId[track.id] = { status: "loading", detail: state.chordImportStatus };
  renderPlayer();
  renderQueue();
  try {
    const saved = await api(`/api/chords/${encodeURIComponent(track.id)}/manual`, {
      method: "POST",
      body: JSON.stringify({ sheetText: rawSheet, lookupLyrics: true })
    });
    applyChordsPayload(track.id, saved.chords, saved.track);
    const alignment = saved.chords?.alignment;
    state.chordImportStatus = alignment?.method === "synced-lyrics" && alignment.matchedLines
      ? `Aligned ${alignment.matchedLines} chord lines with synced lyrics.`
      : "Saved chord sheet. Synced lyrics were not available, so timing is not automatic yet.";
    renderPlayer();
    renderQueue();
    broadcastChordsState();
  } catch (error) {
    state.chordImportStatus = error.message || "Could not save manual chords.";
    const cached = await api(`/api/chords/${encodeURIComponent(track.id)}`).catch(() => null);
    if (cached) applyChordsPayload(track.id, cached.chords, cached.track);
    renderPlayer();
    renderQueue();
    broadcastChordsState();
  }
}

async function clearChordsForCurrentTrack() {
  const track = currentTrack();
  if (!track) return;
  state.chordImportStatus = "Clearing saved chords...";
  renderQueue();
  try {
    const cleared = await api(`/api/chords/${encodeURIComponent(track.id)}`, { method: "DELETE" });
    applyChordsPayload(track.id, cleared.chords, cleared.track);
    state.chordsByTrackId[track.id] = { status: "not_found", provider: "manual", sourceType: "manual", changes: [], summaryChords: [] };
    state.chordImportStatus = "Saved chords cleared.";
    renderPlayer();
    renderQueue();
    broadcastChordsState();
  } catch (error) {
    state.chordImportStatus = error.message || "Could not clear chords.";
    renderQueue();
  }
}

function dateValue(value) {
  const time = value ? new Date(value).getTime() : 0;
  return Number.isFinite(time) ? time : 0;
}

function daysAgo(value) {
  const time = dateValue(value);
  if (!time) return Infinity;
  return (Date.now() - time) / 86400000;
}

function decadeForYear(year) {
  const numeric = Number(year || 0);
  return numeric ? `${Math.floor(numeric / 10) * 10}s` : "";
}

function statForTrack(trackOrId) {
  const id = typeof trackOrId === "string" ? trackOrId : trackOrId?.id;
  return state.listeningStats[id] || {};
}

function playCountFor(track) {
  return Number(statForTrack(track).playCount || track?.playCount || 0);
}

function skipCountFor(track) {
  return Number(statForTrack(track).skipCount || track?.skipCount || 0);
}

function lastPlayedFor(track) {
  return statForTrack(track).lastPlayedAt || track?.lastPlayedAt || "";
}

function totalListenMsFor(track) {
  return Number(statForTrack(track).totalListenMs || 0);
}

function ratingFor(track) {
  return Number(track?.rating || 0);
}

function dateAddedFor(track) {
  return track?.dateAdded || (track?.addedAt ? new Date(Number(track.addedAt) * 1000).toISOString() : "");
}

function releaseDateFor(track) {
  return track?.releaseDate || (track?.year ? `${track.year}-01-01` : "");
}

function albumArtistFor(track) {
  return track?.albumArtist || track?.artist || "Unknown Artist";
}

function sourceFor(track) {
  return track?.sourceLibrary || track?.sectionTitle || "Music";
}

function trackFileTypeText(track) {
  return cleanText(track?.fileType || track?.audioCodec || "").toLowerCase();
}

function isM4aTrack(track) {
  const type = trackFileTypeText(track);
  const codec = cleanText(track?.audioCodec).toLowerCase();
  const streamKey = cleanText(track?.streamKey || track?.key).toLowerCase();
  return type === "m4a"
    || codec === "alac"
    || streamKey.endsWith(".m4a")
    || (type === "mp4" && streamKey.includes(".m4a"));
}

function unsupportedPlaybackReason(track) {
  return isM4aTrack(track) ? "M4A unsupported" : "";
}

function unsupportedPlaybackMessage(track) {
  return `${track?.title || "This song"} is M4A. VoidFM cannot play M4A reliably; convert it to MP3, FLAC, or WAV.`;
}

function unsupportedFormatBadgeHtml(track) {
  const reason = unsupportedPlaybackReason(track);
  if (!reason) return "";
  return `<span class="track-format-warning" title="${escapeHtml(unsupportedPlaybackMessage(track))}">${escapeHtml(reason)}</span>`;
}

function canStreamTrack(track) {
  if (unsupportedPlaybackReason(track)) return false;
  return track?.source === "local" || (track?.source === "plex" && track.streamKey);
}

function durationForTrack(track) {
  const storedDuration = Number(track?.duration || 0);
  const storedDurationMs = Number(track?.durationMs || 0);
  if (storedDurationMs > 0 && (!storedDuration || storedDuration < storedDurationMs / 10)) return storedDurationMs;
  if (storedDuration > 0) return storedDuration;
  if (currentTrack()?.id === track?.id && Number.isFinite(audio.duration) && audio.duration > 0) {
    return Math.round(audio.duration * 1000);
  }
  return 0;
}

function bpmForTrack(track = currentTrack()) {
  const bpm = Number(track?.bpm || track?.tempo || 0);
  return Number.isFinite(bpm) && bpm >= 20 && bpm <= 400 ? bpm : 0;
}

function fileTypeFor(track) {
  return trackFileTypeText(track);
}

function audioQualityFor(track) {
  if (track?.audioQuality) return track.audioQuality;
  const codec = cleanText(track?.audioCodec).toUpperCase();
  const bitrate = Number(track?.bitrate || 0);
  if (["FLAC", "ALAC", "WAV", "AIFF"].includes(codec)) return "Lossless";
  if (bitrate >= 320) return "High";
  if (bitrate >= 192) return "Medium";
  if (bitrate > 0) return "Low";
  return codec || "";
}

function nowPlayingContextLabel() {
  const playlist = currentContextPlaylist();
  if (playlist?.name) return playlist.name;
  const profile = shuffleProfileById(state.queueContext?.shuffleProfileId) || activeShuffleProfile();
  if (state.queueContext?.type === "shuffle" && profile?.name) return profile.name;
  const track = currentTrack();
  return track ? sourceFor(track) : "VoidFM";
}

function nowPlayingBadgesHtml(track) {
  const codec = cleanText(track?.audioCodec || track?.fileType).toUpperCase();
  const bitrate = Number(track?.bitrate || 0);
  const unsupported = unsupportedPlaybackReason(track);
  const quality = audioQualityFor(track);
  const source = track?.source ? `${String(track.source).toUpperCase()} SOURCE` : sourceFor(track);
  const badges = [
    unsupported ? { label: unsupported, className: "unsupported" } : null,
    quality && quality.toUpperCase() !== codec ? { label: quality } : null,
    codec ? { label: codec } : null,
    bitrate > 0 ? { label: `${bitrate} kbps` } : null,
    source ? { label: source, className: "source" } : null
  ].filter(Boolean);
  return badges.map((badge) => `
    <span class="now-playing-badge ${badge.className || ""}">
      ${badge.className === "source" ? "<i></i>" : ""}
      <span>${escapeHtml(badge.label)}</span>
    </span>
  `).join("");
}

function nowPlayingUpcomingTracks(limit = 7) {
  if (!state.queue.length || state.currentIndex < 0) return [];
  const tracks = [];
  const seen = new Set();
  for (let offset = 1; offset <= state.queue.length && tracks.length < limit; offset += 1) {
    let index = state.currentIndex + offset;
    if (index >= state.queue.length) {
      if (state.repeat !== "all") break;
      index %= state.queue.length;
    }
    const track = state.queue[index];
    if (!track || seen.has(`${track.id}:${index}`)) continue;
    seen.add(`${track.id}:${index}`);
    tracks.push({ track, index });
  }
  return tracks;
}

function clampTimelineRangeValue(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.max(0, Math.min(TIMELINE_RANGE_MAX, number));
}

function activeTimelineScrub(track = currentTrack()) {
  const scrub = state.timelineScrub;
  if (!scrub?.active || !track || scrub.trackId !== track.id) return null;
  return scrub;
}

function playbackProgressSnapshotFromPosition(rawCurrentMs, options = {}) {
  const track = currentTrack();
  const window = currentPlaybackWindow();
  const timelineWindow = options.timelineWindow || currentTimelineWindow();
  const duration = window.durationMs || durationForTrack(track);
  const timelineDuration = timelineWindow.durationMs || duration;
  const currentMs = window.hasTrim ? Math.max(0, Math.min(duration, rawCurrentMs - window.startMs)) : rawCurrentMs;
  const timelineCurrentMs = timelineDuration ? Math.max(0, Math.min(timelineDuration, rawCurrentMs - timelineWindow.startMs)) : 0;
  const value = options.value !== undefined
    ? clampTimelineRangeValue(options.value)
    : timelineDuration ? Math.min(TIMELINE_RANGE_MAX, Math.round((timelineCurrentMs / timelineDuration) * TIMELINE_RANGE_MAX)) : 0;
  return { track, window, timelineWindow, duration, timelineDuration, rawCurrentMs, currentMs, timelineCurrentMs, value };
}

function playbackProgressSnapshot() {
  const scrub = activeTimelineScrub();
  if (scrub) {
    return playbackProgressSnapshotFromPosition(scrub.targetMs, {
      timelineWindow: scrub.timelineWindow,
      value: scrub.value
    });
  }
  return playbackProgressSnapshotFromPosition(playbackPositionMs());
}

function timelineProgressPercent(value) {
  return Math.max(0, Math.min(100, (Number(value || 0) / TIMELINE_RANGE_MAX) * 100));
}

function resetTimelineScrubState() {
  if (state.timelineScrub?.idleTimer) clearTimeout(state.timelineScrub.idleTimer);
  state.timelineScrub = {
    active: false,
    pointerActive: false,
    trackId: "",
    timelineWindow: null,
    value: 0,
    targetMs: 0,
    lastSeekAt: 0,
    idleTimer: 0
  };
}

function beginTimelineScrub(input, options = {}) {
  const track = currentTrack();
  if (!track || !input) return null;
  const existing = activeTimelineScrub(track);
  if (existing) {
    existing.pointerActive = existing.pointerActive || options.pointer === true;
    if (existing.idleTimer) {
      clearTimeout(existing.idleTimer);
      existing.idleTimer = 0;
    }
    return existing;
  }
  const progress = playbackProgressSnapshotFromPosition(playbackPositionMs());
  state.timelineScrub = {
    active: true,
    pointerActive: options.pointer === true,
    trackId: track.id,
    timelineWindow: { ...progress.timelineWindow },
    value: clampTimelineRangeValue(input.value || progress.value),
    targetMs: progress.rawCurrentMs,
    lastSeekAt: 0,
    idleTimer: 0
  };
  return state.timelineScrub;
}

function timelineRangeValueToMs(value, timelineWindow) {
  const track = currentTrack();
  if (!track) return 0;
  const window = timelineWindow || currentTimelineWindow();
  const duration = window.durationMs || durationForTrack(track);
  return seekTimelineWindowOffset(track, (clampTimelineRangeValue(value) / TIMELINE_RANGE_MAX) * duration, { window });
}

function commitTimelineScrubSeek(options = {}) {
  const scrub = activeTimelineScrub();
  if (!scrub) return;
  const now = typeof performance !== "undefined" && typeof performance.now === "function" ? performance.now() : Date.now();
  if (options.throttle && scrub.lastSeekAt && now - scrub.lastSeekAt < TIMELINE_SCRUB_SEEK_THROTTLE_MS) return;
  scrub.lastSeekAt = now;
  seekPlaybackToMs(scrub.targetMs, { render: false, save: options.save !== false });
}

function endTimelineScrub(options = {}) {
  const scrub = activeTimelineScrub();
  if (!scrub) return;
  const targetMs = scrub.targetMs;
  resetTimelineScrubState();
  if (options.commit !== false) seekPlaybackToMs(targetMs, { render: false, save: options.save !== false });
  renderProgress();
}

function scheduleTimelineScrubIdleCommit() {
  const scrub = activeTimelineScrub();
  if (!scrub || scrub.pointerActive) return;
  if (scrub.idleTimer) clearTimeout(scrub.idleTimer);
  scrub.idleTimer = setTimeout(() => {
    endTimelineScrub();
  }, TIMELINE_SCRUB_IDLE_COMMIT_MS);
}

function updateTimelineScrubFromInput(input) {
  const scrub = beginTimelineScrub(input);
  if (!scrub) return;
  const value = clampTimelineRangeValue(input.value);
  scrub.value = value;
  scrub.targetMs = timelineRangeValueToMs(value, scrub.timelineWindow);
  renderProgress();
  commitTimelineScrubSeek({ throttle: true, save: false });
  scheduleTimelineScrubIdleCommit();
}

function progressDisplayCurrentMs(progress) {
  return progress.timelineWindow?.zoomed ? progress.timelineCurrentMs : progress.currentMs;
}

function progressDisplayDurationMs(progress) {
  return progress.timelineWindow?.zoomed ? progress.timelineDuration : progress.duration;
}

function progressZoomTitle(progress) {
  if (!progress.timelineWindow?.zoomed) return "";
  return `Zoomed to ${msToPreciseTime(progress.timelineWindow.startMs)} - ${msToPreciseTime(progress.timelineWindow.endMs)}`;
}

function nowPlayingLyricsSideHtml() {
  const track = currentTrack();
  const lyrics = currentLyrics();
  let body = '<div class="now-playing-side-empty">Lyrics are not available for this track</div>';
  if (track && !hasLyricsContent(lyrics) && (lyrics?.status === "loading" || !terminalLyricsStatus(lyrics))) {
    body = '<div class="now-playing-side-empty">Finding lyrics...</div>';
  } else if (track && hasLyricsContent(lyrics)) {
    const synced = hasSyncedLyrics(lyrics);
    const active = synced ? activeLyricIndex() : -1;
    const lines = synced ? lyrics.syncedLines : plainLyricsLines(lyrics);
    body = `
      <div class="now-playing-lyrics-list">
        ${lines.map((line, index) => `
          <div class="lyrics-line now-playing-lyric-line ${synced && index === active ? "active" : ""} ${synced ? "" : "plain"}" data-lyric-index="${index}" data-lyric-time="${Number(line.timeMs || 0)}">
            ${escapeHtml(line.text)}
          </div>
        `).join("")}
      </div>
    `;
  }
  return `
    <aside class="now-playing-side-card now-playing-lyrics-card">
      <div class="now-playing-side-head">
        <span>Lyrics</span>
        <span>${track ? escapeHtml(track.artist) : "VoidFM"}</span>
      </div>
      ${body}
    </aside>
  `;
}

function nowPlayingUpNextCardHtml() {
  const upcoming = nowPlayingUpcomingTracks(1)[0];
  if (!upcoming?.track) {
    return `
      <aside class="now-playing-up-next-card empty">
        <span>Up Next:</span>
        <strong>Queue is clear</strong>
      </aside>
    `;
  }
  const { track, index } = upcoming;
  const duration = durationForTrack(track);
  return `
    <button type="button" class="now-playing-up-next-card" data-queue-index="${index}">
      <span class="now-playing-up-next-label">Up Next:</span>
      <span class="now-playing-up-next-art" style="${artStyle(track)}"></span>
      <span class="now-playing-up-next-copy">
        <strong>${escapeHtml(track.title || "Unknown Title")}</strong>
        <small>${escapeHtml(track.artist || "Unknown Artist")}</small>
      </span>
      <span class="now-playing-up-next-time">${escapeHtml(msToTime(duration))}</span>
      <span class="now-playing-up-next-chevron">${icons.arrowRight}</span>
    </button>
  `;
}

function nowPlayingModeHtml() {
  if (!state.nowPlayingOpen) return "";
  const track = currentTrack();
  if (!track) return "";
  const trim = trackTrimForContext(track);
  const progress = playbackProgressSnapshot();
  const progressPercent = timelineProgressPercent(progress.value);
  const volumePercent = Math.round(state.volume * 100);
  const lyricsOpen = state.nowPlayingTab === "lyrics";
  const title = trackTitleWithTrimMarker(track, trim);
  return `
    <section class="now-playing-mode ${lyricsOpen ? "lyrics-open" : ""} ${state.advancedPlaybackOpen ? "advanced-open" : ""} ${state.abLoopMenuOpen ? "ab-loop-menu-open" : ""} ${state.abLoopLauncherOpen ? "ab-loop-launcher-open" : ""}" role="dialog" aria-modal="true" aria-label="Now playing">
      <div class="now-playing-bg" style="${paletteStyle(nowPlayingPalette(track))}" aria-hidden="true"></div>
      <div class="now-playing-scrim" aria-hidden="true"></div>

      <header class="now-playing-top">
        <div class="now-playing-context-card now-playing-top-context">
          <span class="now-playing-context-icon">${icons.equalizer}</span>
          <span>
            <small>Playing From</small>
            <strong>${escapeHtml(nowPlayingContextLabel())}</strong>
          </span>
        </div>

        <div class="now-playing-brand">
          <span class="now-playing-brand-mark"><img src="./assets/voidfm-icon.png" alt=""></span>
          <span>
            <strong>VoidFM</strong>
          </span>
        </div>

        <div class="now-playing-top-actions">
          <button class="now-playing-pill ${lyricsOpen ? "active" : ""}" type="button" data-now-playing-tab="${lyricsOpen ? "queue" : "lyrics"}">
            ${icons.mic}<span>Lyrics</span>
          </button>
          <button class="now-playing-pill icon-only ${state.advancedPlaybackOpen ? "active" : ""}" type="button" title="${state.advancedPlaybackOpen ? "Hide advanced playback" : "Advanced playback"}" aria-label="${state.advancedPlaybackOpen ? "Hide advanced playback" : "Advanced playback"}" aria-expanded="${state.advancedPlaybackOpen}" data-now-playing-action="advanced">
            ${icons.more}
          </button>
        </div>
      </header>

      <section class="now-playing-stage">
        <main class="now-playing-main">
          <div class="now-playing-art-wrap">
            <div class="now-playing-art" style="${artStyle(track)}"></div>
            ${lyricsOpen ? nowPlayingLyricsSideHtml() : ""}
          </div>

          <div class="now-playing-info">
            <div class="now-playing-kicker">
              <span>Now Playing</span>
              <i></i><i></i><i></i><i></i>
            </div>
            <div class="now-playing-title-row">
              <h2>${escapeHtml(title)}</h2>
            </div>
            <button class="now-playing-artist" type="button" data-view-artist="${escapeHtml(track.artist)}">
              <span>${escapeHtml(track.artist || "Unknown Artist")}</span>
              ${icons.arrowRight}
            </button>
            <div class="now-playing-album">${escapeHtml(track.album || "Unknown Album")}</div>
            <div class="now-playing-badges">${nowPlayingBadgesHtml(track)}</div>
          </div>
        </main>

        <div class="now-playing-spectrum-wrap" aria-label="Stylized live audio visualizer">
          <div class="now-playing-spectrum ${state.isPlaying ? "listening" : ""}" aria-hidden="true">
            ${nowPlayingSpectrumBarsHtml()}
          </div>
        </div>

        <div class="now-playing-progress">
          <span id="nowPlayingCurrentTime" title="${escapeHtml(progressZoomTitle(progress))}">${escapeHtml(msToTime(progressDisplayCurrentMs(progress)))}</span>
          <div class="now-playing-timeline ${progress.timelineWindow.zoomed ? "timeline-zoomed" : ""}" style="--progress-percent:${progressPercent}%" title="${escapeHtml(progressZoomTitle(progress))}">
            <div class="ab-loop-marker-layer now-playing-ab-loop-marker-layer" id="nowPlayingAbLoopMarkerLayer" aria-hidden="true"></div>
            <input id="nowPlayingProgressInput" data-now-playing-progress type="range" min="0" max="${TIMELINE_RANGE_MAX}" step="1" value="${progress.value}" style="--progress-percent:${progressPercent}%" aria-label="Progress">
          </div>
          <span id="nowPlayingDurationTime" title="${escapeHtml(progressZoomTitle(progress))}">${escapeHtml(msToTime(progressDisplayDurationMs(progress)))}</span>
        </div>

        <div class="player-advanced-panel now-playing-advanced-panel" id="nowPlayingAdvancedPanel" aria-hidden="${!state.advancedPlaybackOpen}">
          ${advancedPlaybackPanelHtml()}
        </div>

        <div class="now-playing-center-actions now-playing-transport-row">
          <div class="now-playing-controls">
            <button class="now-playing-control ${state.shuffle ? "active" : ""}" id="nowPlayingShuffleButton" type="button" title="Shuffle" data-now-playing-action="shuffle">${icons.shuffle}</button>
            <button class="now-playing-control" type="button" title="Previous" data-now-playing-action="previous">${icons.previous}</button>
            <button class="now-playing-play ${state.isPlaying ? "active" : ""}" id="nowPlayingPlayButton" type="button" title="${state.isPlaying ? "Pause" : "Play"}" data-now-playing-action="play">${state.isPlaying ? icons.pause : icons.play}</button>
            <button class="now-playing-control" type="button" title="Next" data-now-playing-action="next">${icons.next}</button>
            <button class="now-playing-control ${state.repeat !== "off" ? "active" : ""}" id="nowPlayingRepeatButton" type="button" title="Repeat" data-now-playing-action="repeat">${state.repeat === "one" ? icons.repeatOne : icons.repeat}</button>
          </div>
          <div class="now-playing-volume">
            <button class="volume-icon volume-button" type="button" id="nowPlayingMuteButton" data-now-playing-action="mute" title="${state.muted ? "Unmute" : "Mute"}" aria-label="${state.muted ? "Unmute" : "Mute"}">${state.muted || state.volume <= 0 ? icons.volumeMuted : icons.volume}</button>
            <input id="nowPlayingVolumeInput" data-now-playing-volume type="range" min="0" max="1" step="0.01" value="${state.volume}" style="--volume-percent:${volumePercent}%" aria-label="Volume">
            <span id="nowPlayingVolumeText">${volumePercent}%</span>
          </div>
        </div>
      </section>

      <footer class="now-playing-bottom">
        <button class="now-playing-exit-button" type="button" data-close-now-playing>
          ${icons.popout}<span>Exit Now Playing</span>
        </button>

        ${nowPlayingUpNextCardHtml()}
      </footer>
    </section>
  `;
}

function syncNowPlayingPlaybackControls() {
  if (!state.nowPlayingOpen) return;
  const progress = playbackProgressSnapshot();
  const progressPercent = timelineProgressPercent(progress.value);
  const progressInput = $("#nowPlayingProgressInput");
  if (progressInput) {
    progressInput.max = String(TIMELINE_RANGE_MAX);
    progressInput.step = "1";
    progressInput.value = String(progress.value);
    progressInput.style.setProperty("--progress-percent", `${progressPercent}%`);
    progressInput.title = progressZoomTitle(progress);
  }
  const timeline = $(".now-playing-timeline");
  if (timeline) {
    timeline.style.setProperty("--progress-percent", `${progressPercent}%`);
    timeline.classList.toggle("timeline-zoomed", Boolean(progress.timelineWindow?.zoomed));
    timeline.title = progressZoomTitle(progress);
  }
  renderAbLoopMarkers();
  const currentTime = $("#nowPlayingCurrentTime");
  const durationTime = $("#nowPlayingDurationTime");
  if (currentTime) {
    currentTime.textContent = msToTime(progressDisplayCurrentMs(progress));
    currentTime.title = progressZoomTitle(progress);
  }
  if (durationTime) {
    durationTime.textContent = msToTime(progressDisplayDurationMs(progress));
    durationTime.title = progressZoomTitle(progress);
  }
  const playButton = $("#nowPlayingPlayButton");
  if (playButton) {
    playButton.innerHTML = state.isPlaying ? icons.pause : icons.play;
    playButton.classList.toggle("active", state.isPlaying);
    playButton.title = state.isPlaying ? "Pause" : "Play";
  }
  $("#nowPlayingShuffleButton")?.classList.toggle("active", state.shuffle);
  const repeatButton = $("#nowPlayingRepeatButton");
  if (repeatButton) {
    repeatButton.innerHTML = state.repeat === "one" ? icons.repeatOne : icons.repeat;
    repeatButton.classList.toggle("active", state.repeat !== "off");
  }
  $(".now-playing-spectrum")?.classList.toggle("listening", state.isPlaying);
  startNowPlayingVisualizer();
  const volumePercent = Math.round(state.volume * 100);
  const volumeInput = $("#nowPlayingVolumeInput");
  if (volumeInput) {
    volumeInput.value = String(state.volume);
    volumeInput.style.setProperty("--volume-percent", `${volumePercent}%`);
  }
  const volumeText = $("#nowPlayingVolumeText");
  if (volumeText) volumeText.textContent = `${volumePercent}%`;
  const muted = state.muted || state.volume <= 0;
  const muteButton = $("#nowPlayingMuteButton");
  if (muteButton) {
    muteButton.innerHTML = muted ? icons.volumeMuted : icons.volume;
    muteButton.title = muted ? "Unmute" : "Mute";
    muteButton.setAttribute("aria-label", muted ? "Unmute" : "Mute");
  }
}

function openNowPlayingMode() {
  if (!currentTrack()) return;
  state.nowPlayingOpen = true;
  resumeEqAudioContext();
  if (!["queue", "lyrics"].includes(state.nowPlayingTab)) state.nowPlayingTab = "queue";
  renderGlobalOverlays();
  syncNowPlayingPlaybackControls();
  startNowPlayingVisualizer();
}

function closeNowPlayingMode() {
  state.nowPlayingOpen = false;
  stopNowPlayingVisualizer();
  renderGlobalOverlays();
}

function setNowPlayingTab(tab) {
  state.nowPlayingTab = tab === "lyrics" ? "lyrics" : "queue";
  renderGlobalOverlays();
  syncLyricsPlayback();
  if (state.nowPlayingTab === "lyrics" && shouldRetryLyricsLookup(currentLyrics())) loadLyricsForCurrentTrack();
}

function duplicateKeyFor(track) {
  return `${lowerText(track?.artist)}\u001f${lowerText(track?.title)}`;
}

function duplicateKeys() {
  if (memo.duplicateKeysVersion === state.libraryDataVersion) return memo.duplicateKeys;
  const counts = new Map();
  for (const track of state.tracks) {
    const key = duplicateKeyFor(track);
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  memo.duplicateKeysVersion = state.libraryDataVersion;
  memo.duplicateKeys = new Set(Array.from(counts.entries()).filter(([, count]) => count > 1).map(([key]) => key));
  return memo.duplicateKeys;
}

function playlistNamesForTrack(track) {
  return state.playlists
    .filter((playlist) => playlist.trackIds.includes(track.id))
    .map((playlist) => playlist.name);
}

function activeShuffleProfile() {
  const profile = state.customShuffles.find((candidate) => candidate.id === state.activeShuffleProfileId) || null;
  return profile ? normalizeShuffleProfileClient(profile) : null;
}

function currentWorkshopProfileId() {
  return state.activeShuffleProfileId || "";
}

function workshopDraftIsCurrent() {
  return state.workshopDraft
    && state.workshopDraftProfileId === currentWorkshopProfileId();
}

function workshopProfileForRender() {
  if (workshopDraftIsCurrent()) return normalizeShuffleProfileClient(state.workshopDraft);
  return activeShuffleProfile();
}

function clearWorkshopPreview(status = "") {
  state.workshopPreviewQueue = [];
  state.workshopPreviewStatus = status;
}

function resetWorkshopDraft() {
  state.workshopDraft = null;
  state.workshopDraftProfileId = currentWorkshopProfileId();
  clearWorkshopPreview();
}

function shuffleProfileById(profileId) {
  return state.customShuffles.find((profile) => profile.id === profileId) || null;
}

function shuffleProfileNameKey(name) {
  return lowerText(name).replace(/\s+/g, " ");
}

function shuffleProfileByName(name) {
  const key = shuffleProfileNameKey(name);
  if (!key) return null;
  return state.customShuffles.find((profile) => shuffleProfileNameKey(profile.name) === key) || null;
}

function playlistNameKey(name) {
  return lowerText(name).replace(/\s+/g, " ");
}

function playlistByName(name) {
  const key = playlistNameKey(name);
  if (!key) return null;
  return state.playlists.find((playlist) => playlistNameKey(playlist.name) === key) || null;
}

function normalizeBlacklistTargetType(value) {
  const targetType = lowerText(value);
  return ["track", "artist", "album"].includes(targetType) ? targetType : "track";
}

function normalizeBlacklistName(value) {
  return cleanText(value).replace(/\s+/g, " ");
}

function normalizeBlacklistRule(rule = {}) {
  if (!rule || typeof rule !== "object" || Array.isArray(rule)) return null;
  const targetType = normalizeBlacklistTargetType(rule.targetType);
  const targetId = cleanText(rule.targetId);
  const targetName = normalizeBlacklistName(rule.targetName);
  if (!targetId && !targetName) return null;
  const normalized = {
    ...rule,
    id: cleanText(rule.id),
    targetType,
    targetId,
    targetName,
    createdAt: rule.createdAt || new Date().toISOString()
  };
  delete normalized.alreadyExists;
  return normalized;
}

function blacklistRuleKey(rule = {}) {
  const targetType = normalizeBlacklistTargetType(rule.targetType);
  const targetId = cleanText(rule.targetId);
  const targetName = normalizeBlacklistName(rule.targetName);
  if (targetType === "track" && targetId) return `track:id:${targetId}`;
  if (targetId && !targetName) return `${targetType}:id:${targetId}`;
  const nameKey = lowerText(targetName);
  return nameKey ? `${targetType}:name:${nameKey}` : "";
}

function dedupeBlacklistRules(rules) {
  if (!Array.isArray(rules)) return [];
  const seen = new Set();
  const deduped = [];
  for (const rawRule of rules) {
    const rule = normalizeBlacklistRule(rawRule);
    const key = blacklistRuleKey(rule);
    if (!rule || !key || seen.has(key)) continue;
    seen.add(key);
    deduped.push(rule);
  }
  return deduped;
}

function blacklistRuleExists(rule) {
  const key = blacklistRuleKey(rule);
  return Boolean(key && state.blacklist.some((item) => blacklistRuleKey(item) === key));
}

function appendBlacklistRule(rule) {
  const normalized = normalizeBlacklistRule(rule);
  if (!normalized || blacklistRuleExists(normalized)) return false;
  state.blacklist.push(normalized);
  return true;
}

function editingShuffleProfile() {
  return state.customShuffles.find((profile) => profile.id === state.activeShuffleProfileId) || null;
}

function normalizeShuffleProfileClient(profile) {
  if (!profile) return null;
  return shuffleEngine?.migrateProfile ? shuffleEngine.migrateProfile(profile) : profile;
}

function shuffleProfileSummary(profile) {
  const normalized = normalizeShuffleProfileClient(profile);
  if (shuffleEngine?.profileSummary) return shuffleEngine.profileSummary(normalized);
  return normalized?.terms || "Default smart shuffle";
}

function isBlocked(track) {
  if (!track) return true;
  return state.blacklist.some((rule) => {
    const targetType = normalizeBlacklistTargetType(rule.targetType);
    if (targetType === "track") return cleanText(rule.targetId) === track.id || (!rule.targetId && lowerText(rule.targetName) === lowerText(track.title));
    if (targetType === "artist") return lowerText(rule.targetName) === lowerText(track.artist);
    if (targetType === "album") return lowerText(rule.targetName) === lowerText(track.album);
    return false;
  });
}

function linkedFollowerIds() {
  return new Set(state.links.map((link) => link.nextId));
}

function expandChain(startTrack, allowedIds = null) {
  const chain = [];
  const seen = new Set();
  let current = startTrack;

  while (current) {
    if (seen.has(current.id) || isBlocked(current)) return null;
    if (allowedIds && !allowedIds.has(current.id)) return null;
    seen.add(current.id);
    chain.push(current);

    const link = state.links.find((candidate) => candidate.triggerId === current.id);
    current = link ? trackById(link.nextId) : null;
    if (link && !current) return null;
  }

  return chain;
}

function shuffleArray(items) {
  const shuffled = items.slice();
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function profileTerms(profile) {
  return String(profile?.terms || "")
    .split(/[,\n/]+/)
    .map((term) => term.trim().toLowerCase())
    .filter(Boolean);
}

function trackMatchesProfile(track, profile) {
  if (!profile) return true;

  if (profile.yearMin && (!track.year || track.year < profile.yearMin)) return false;
  if (profile.yearMax && (!track.year || track.year > profile.yearMax)) return false;

  const terms = profileTerms(profile);
  if (!terms.length) return true;

  const haystack = [
    track.title,
    track.artist,
    track.album,
    track.sectionTitle,
    ...(track.genres || [])
  ].join(" ").toLowerCase();

  return terms.some((term) => haystack.includes(term));
}

function titleLetters(title) {
  const chars = String(title || "").toLowerCase().match(/[a-z0-9]/g) || [];
  return {
    first: chars[0] || "",
    last: chars[chars.length - 1] || ""
  };
}

function unitStartLetter(unit) {
  return titleLetters(unit[0]?.title).first;
}

function unitEndLetter(unit) {
  return titleLetters(unit[unit.length - 1]?.title).last;
}

function unitArtist(unit) {
  return unit[0]?.artist || "Unknown Artist";
}

function artistSongCount(unit, artist) {
  return unit.filter((track) => (track.artist || "Unknown Artist") === artist).length;
}

function blockStartLetter(block) {
  return unitStartLetter(block[0]);
}

function blockEndLetter(block) {
  return unitEndLetter(block[block.length - 1]);
}

function tryBuildArtistBlock(group, runLength, chainTitles) {
  const starts = group.map((_, index) => index);

  for (const startIndex of starts) {
    const remaining = group.slice();
    const block = [remaining.splice(startIndex, 1)[0]];
    const artist = unitArtist(block[0]);
    let songCount = artistSongCount(block[0], artist);

    while (remaining.length && songCount < runLength) {
      const needed = blockEndLetter(block);
      const nextIndex = chainTitles && needed
        ? remaining.findIndex((unit) => unitStartLetter(unit) === needed)
        : 0;
      if (nextIndex === -1) break;

      const next = remaining.splice(nextIndex, 1)[0];
      block.push(next);
      songCount += artistSongCount(next, artist);
    }

    if (songCount >= runLength) {
      for (const unit of block) {
        const index = group.indexOf(unit);
        if (index !== -1) group.splice(index, 1);
      }
      return block;
    }
  }

  return null;
}

function makeArtistBlocks(units, profile) {
  const runLength = Math.max(1, Number(profile?.artistRunLength || 1));
  if (runLength <= 1) return units.map((unit) => [unit]);

  const groups = new Map();
  for (const unit of units) {
    const artist = unitArtist(unit);
    if (!groups.has(artist)) groups.set(artist, []);
    groups.get(artist).push(unit);
  }

  if (profile?.requireFullArtistRun !== false) {
    for (const [artist, group] of groups) {
      const songCount = group.reduce((total, unit) => total + artistSongCount(unit, artist), 0);
      if (songCount < runLength) groups.delete(artist);
    }
  }

  const artists = shuffleArray(Array.from(groups.keys()));
  const blocks = [];
  let guard = 0;

  while (groups.size && guard < 100000) {
    guard += 1;
    const artist = artists.shift();
    if (!artist || !groups.has(artist)) continue;

    const group = groups.get(artist);
    const block = tryBuildArtistBlock(group, runLength, Boolean(profile?.titleLetterChain));
    if (block) blocks.push(block);

    const remainingSongs = group.reduce((total, unit) => total + artistSongCount(unit, artist), 0);
    if (remainingSongs >= runLength || (profile?.requireFullArtistRun === false && group.length)) artists.push(artist);
    else groups.delete(artist);
  }

  return blocks;
}

function applyTitleLetterChainBlocks(blocks, requiredStartLetter = "") {
  const remaining = blocks.slice();
  const chained = [];

  const firstIndex = requiredStartLetter
    ? remaining.findIndex((block) => blockStartLetter(block) === requiredStartLetter)
    : 0;
  if (firstIndex === -1) return chained;

  let current = remaining.splice(firstIndex, 1)[0];
  chained.push(current);

  while (remaining.length) {
    const needed = blockEndLetter(current);
    if (!needed) break;

    const candidates = remaining
      .map((block, index) => ({ block, index }))
      .filter(({ block }) => blockStartLetter(block) === needed);

    if (!candidates.length) break;

    const chosen = candidates[Math.floor(Math.random() * candidates.length)];
    current = chosen.block;
    chained.push(current);
    remaining.splice(chosen.index, 1);
  }

  return chained;
}

function arrangeShuffleUnits(units, profile, requiredStartLetter = "") {
  const blocks = makeArtistBlocks(shuffleArray(units), profile);
  const arrangedBlocks = profile?.titleLetterChain
    ? applyTitleLetterChainBlocks(blocks, requiredStartLetter)
    : blocks;

  return arrangedBlocks.flat();
}

function eligibleTracks(sourceTracks = state.tracks) {
  const followers = linkedFollowerIds();
  return sourceTracks.filter((track) => track && !isBlocked(track) && !followers.has(track.id));
}

function buildSmartQueue(seedId = null, options = {}) {
  const sourceTracks = options.sourceTracks || state.tracks;
  const allowedIds = sourceTracks === state.tracks ? null : new Set(sourceTracks.map((track) => track.id));
  const profile = Object.prototype.hasOwnProperty.call(options, "profile")
    ? (options.profile ? normalizeShuffleProfileClient(options.profile) : null)
    : options.profileId
    ? normalizeShuffleProfileClient(state.customShuffles.find((candidate) => candidate.id === options.profileId) || null)
    : state.shuffle ? activeShuffleProfile() : null;
  const shouldShuffle = options.forceShuffle ?? state.shuffle;
  const units = eligibleTracks(sourceTracks)
    .map((track) => expandChain(track, allowedIds))
    .filter(Boolean)
    .filter((unit) => !profile || unit.some((track) => trackMatchesProfile(track, profile)));
  if (seedId) {
    const seedTrack = trackById(seedId);
    const seedChain = expandChain(seedTrack, allowedIds) || [seedTrack].filter((track) => track && (!allowedIds || allowedIds.has(track.id)));
    if (shuffleEngine?.buildQueueFromUnits) {
      return shuffleEngine.buildQueueFromUnits(units, {
        profile,
        shuffle: shouldShuffle,
        seedUnit: seedChain,
        statsById: state.listeningStats,
        allTracks: sourceTracks
      });
    }
    const seedSet = new Set(seedChain.map((track) => track.id));
    const candidateUnits = units.filter((unit) => unit.every((track) => !seedSet.has(track.id)));
    const ordered = shouldShuffle ? arrangeShuffleUnits(candidateUnits, profile) : candidateUnits;
    return seedChain.concat(ordered.flat().filter((track) => !seedSet.has(track.id)));
  }

  if (shuffleEngine?.buildQueueFromUnits) {
    return shuffleEngine.buildQueueFromUnits(units, {
      profile,
      shuffle: shouldShuffle,
      statsById: state.listeningStats,
      allTracks: sourceTracks
    });
  }
  const ordered = shouldShuffle ? arrangeShuffleUnits(units, profile) : units;
  return ordered.flat();
}

function trackMatchesSearch(track) {
  const query = state.query.trim().toLowerCase();
  if (!query) return true;
  return [
    track.title,
    track.artist,
    track.album,
    albumArtistFor(track),
    sourceFor(track),
    ...(track.genres || []),
    ...(track.moods || []),
    ...(track.tags || [])
  ]
    .some((value) => String(value || "").toLowerCase().includes(query));
}

function trackMatchesPlaylistSearch(track) {
  const query = state.playlistQuery.trim().toLowerCase();
  if (!query) return true;
  return [
    track.title,
    track.artist,
    track.album,
    albumArtistFor(track)
  ].some((value) => String(value || "").toLowerCase().includes(query));
}

function uniqueValues(values) {
  return Array.from(new Set(values.map(cleanText).filter(Boolean))).sort((left, right) => left.localeCompare(right));
}

function filterValueOptions(field) {
  const cacheKey = `${state.libraryDataVersion}:${state.playlistDataVersion}:${field}`;
  if (memo.filterOptions.has(cacheKey)) return memo.filterOptions.get(cacheKey);
  const tracks = state.tracks;
  const booleanOptions = [["yes", "Yes"], ["no", "No"]];
  let options = [["", "Any"]];
  if (field === "all") options = [["", "Any"]];
  else if (["liked", "compilation", "featuredArtists", "remix", "acoustic", "duplicate", "lyrics"].includes(field)) options = booleanOptions;
  else if (field === "live") options = [["live", "Live"], ["studio", "Studio"]];
  else if (field === "explicit") options = [["explicit", "Explicit"], ["clean", "Clean"]];
  else if (["neverPlayed", "rarelyPlayed", "recentlyPlayed", "recentlyAdded", "mostPlayed", "leastPlayed"].includes(field)) options = [["yes", "Yes"]];
  else if (field === "artist") options = uniqueValues(tracks.map((track) => track.artist)).map((value) => [value, value]);
  else if (field === "album") options = uniqueValues(tracks.map((track) => track.album)).map((value) => [value, value]);
  else if (field === "albumArtist") options = uniqueValues(tracks.map(albumArtistFor)).map((value) => [value, value]);
  else if (field === "genre") options = uniqueValues(tracks.flatMap((track) => track.genres || [])).map((value) => [value, value]);
  else if (field === "mood") options = uniqueValues(tracks.flatMap((track) => track.moods || [])).map((value) => [value, value]);
  else if (field === "language") options = uniqueValues(tracks.map((track) => track.language)).map((value) => [value, value]);
  else if (field === "tag") options = uniqueValues(tracks.flatMap((track) => track.tags || [])).map((value) => [value, value]);
  else if (field === "decade") options = uniqueValues(tracks.map((track) => decadeForYear(track.year))).map((value) => [value, value]);
  else if (field === "year") options = uniqueValues(tracks.map((track) => track.year ? String(track.year) : "")).map((value) => [value, value]);
  else if (field === "rating") options = [["liked", "Liked"], ["rated", "Any rating"], ["high", "8+"], ["low", "Below 5"], ["unrated", "Unrated"]];
  else if (field === "playCount") options = [["0", "Never"], ["1-2", "1-2 plays"], ["3-9", "3-9 plays"], ["10+", "10+ plays"]];
  else if (field === "skipCount") options = [["0", "None"], ["any", "Any skips"], ["3+", "3+ skips"]];
  else if (field === "lastPlayed") options = [["never", "Never"], ["week", "Past week"], ["month", "Past month"], ["year", "Past year"], ["older", "Older"]];
  else if (field === "dateAdded" || field === "releaseDate") options = [["week", "Past week"], ["month", "Past month"], ["year", "Past year"], ["older", "Older"], ["missing", "No date"]];
  else if (field === "duration") options = [["short", "Under 2 min"], ["medium", "2-6 min"], ["long", "6+ min"]];
  else if (field === "fileType") options = uniqueValues(tracks.map(fileTypeFor)).map((value) => [value, value.toUpperCase()]);
  else if (field === "audioQuality") options = uniqueValues(tracks.map(audioQualityFor)).map((value) => [value, value]);
  else if (field === "sourceLibrary") options = uniqueValues(tracks.map(sourceFor)).map((value) => [value, value]);
  else if (field === "playlist") options = state.playlists.map((playlist) => [playlist.id, playlist.name]);
  memo.filterOptions.set(cacheKey, options);
  return options;
}

function fieldHasData(field) {
  if (!["mood", "language", "tag", "fileType", "audioQuality", "playlist"].includes(field)) return true;
  return filterValueOptions(field).length > 0;
}

function sortOptions() {
  if (memo.sortOptionsVersion === state.libraryDataVersion) return memo.sortOptions;
  const extras = [];
  if (state.tracks.some((track) => Number.isFinite(Number(track.bpm)))) {
    extras.push(["bpmAsc", "Slowest BPM"], ["bpmDesc", "Fastest BPM"]);
  }
  if (state.tracks.some((track) => Number.isFinite(Number(track.energy)))) {
    extras.push(["energyAsc", "Lowest Energy"], ["energyDesc", "Highest Energy"]);
  }
  memo.sortOptionsVersion = state.libraryDataVersion;
  memo.sortOptions = BASE_SORT_OPTIONS.concat(extras);
  return memo.sortOptions;
}

function normalizeLibraryFilterSettings(settings = {}) {
  const fields = FILTER_FIELDS.filter(([field]) => fieldHasData(field));
  let field = fields.some(([value]) => value === settings.field) ? settings.field : "all";
  let value = String(settings.value || "");
  const options = filterValueOptions(field);
  if (field === "all") {
    value = "";
  } else if (options.length && !options.some(([optionValue]) => optionValue === value)) {
    value = options[0]?.[0] || "";
  }

  const sort = sortOptions().some(([optionValue]) => optionValue === settings.sort)
    ? settings.sort
    : "titleAsc";

  return { field, value, sort };
}

function applyLibraryFilterSettings(settings = {}) {
  const normalized = normalizeLibraryFilterSettings(settings);
  state.libraryFilterField = normalized.field;
  state.libraryFilterValue = normalized.value;
  state.librarySort = normalized.sort;
}

function savedLibraryFilterSettings() {
  try {
    const raw = localStorage.getItem(LIBRARY_FILTER_SETTINGS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_error) {
    return null;
  }
}

function saveLibraryFilterSettings() {
  try {
    localStorage.setItem(LIBRARY_FILTER_SETTINGS_KEY, JSON.stringify({
      field: state.libraryFilterField,
      value: state.libraryFilterValue,
      sort: state.librarySort
    }));
  } catch (_error) {
    // Local storage can be disabled in constrained browser profiles.
  }
}

function restoreLibraryFilterSettings() {
  const saved = savedLibraryFilterSettings();
  if (saved) applyLibraryFilterSettings(saved);
}

function clearSavedLibraryFilterSettings() {
  try {
    localStorage.removeItem(LIBRARY_FILTER_SETTINGS_KEY);
  } catch (_error) {
    // Local storage can be disabled in constrained browser profiles.
  }
}

function restorePlaylistSortSettings() {
  try {
    state.playlistSort = normalizePlaylistSort(localStorage.getItem(PLAYLIST_SORT_SETTINGS_KEY));
  } catch (_error) {
    state.playlistSort = "orderAdded";
  }
}

function savePlaylistSortSettings() {
  try {
    localStorage.setItem(PLAYLIST_SORT_SETTINGS_KEY, state.playlistSort);
  } catch (_error) {
    // Local storage can be disabled in constrained browser profiles.
  }
}

function libraryFilterContext() {
  const field = state.libraryFilterField;
  const value = state.libraryFilterValue;
  const context = {};
  if (field === "duplicate") context.duplicateSet = duplicateKeys();
  if (field === "playlist" && value) {
    const playlist = state.playlists.find((item) => item.id === value);
    context.playlistTrackIds = new Set(playlist?.trackIds || []);
  }
  return context;
}

function trackMatchesLibraryFilter(track, context = {}) {
  const field = state.libraryFilterField;
  const value = state.libraryFilterValue;
  if (!field || field === "all") return true;
  if (!value && !["neverPlayed", "rarelyPlayed", "recentlyPlayed", "recentlyAdded", "mostPlayed", "leastPlayed"].includes(field)) return true;
  const plays = playCountFor(track);
  const skips = skipCountFor(track);

  if (field === "artist") return track.artist === value;
  if (field === "album") return track.album === value;
  if (field === "albumArtist") return albumArtistFor(track) === value;
  if (field === "genre") return (track.genres || []).includes(value);
  if (field === "mood") return (track.moods || []).includes(value);
  if (field === "language") return track.language === value;
  if (field === "tag") return (track.tags || []).includes(value);
  if (field === "decade") return decadeForYear(track.year) === value;
  if (field === "year") return String(track.year || "") === value;
  if (field === "rating") {
    if (value === "liked") return Boolean(track.liked) || ratingFor(track) >= 8;
    if (value === "rated") return ratingFor(track) > 0;
    if (value === "high") return ratingFor(track) >= 8;
    if (value === "low") return ratingFor(track) > 0 && ratingFor(track) < 5;
    if (value === "unrated") return ratingFor(track) <= 0;
  }
  if (field === "liked") return value === "yes" ? Boolean(track.liked) || ratingFor(track) >= 8 : !track.liked && ratingFor(track) < 8;
  if (field === "playCount") {
    if (value === "0") return plays === 0;
    if (value === "1-2") return plays >= 1 && plays <= 2;
    if (value === "3-9") return plays >= 3 && plays <= 9;
    if (value === "10+") return plays >= 10;
  }
  if (field === "skipCount") {
    if (value === "0") return skips === 0;
    if (value === "any") return skips > 0;
    if (value === "3+") return skips >= 3;
  }
  if (field === "lastPlayed") {
    const days = daysAgo(lastPlayedFor(track));
    if (value === "never") return !Number.isFinite(days);
    if (value === "week") return days <= 7;
    if (value === "month") return days <= 30;
    if (value === "year") return days <= 365;
    if (value === "older") return days > 365;
  }
  if (field === "dateAdded" || field === "releaseDate") {
    const days = daysAgo(field === "dateAdded" ? dateAddedFor(track) : releaseDateFor(track));
    if (value === "missing") return !Number.isFinite(days);
    if (value === "week") return days <= 7;
    if (value === "month") return days <= 30;
    if (value === "year") return days <= 365;
    if (value === "older") return days > 365;
  }
  if (field === "duration") {
    const minutes = Number(track.duration || 0) / 60000;
    if (value === "short") return minutes < 2;
    if (value === "medium") return minutes >= 2 && minutes <= 6;
    if (value === "long") return minutes > 6;
  }
  if (field === "fileType") return fileTypeFor(track) === value;
  if (field === "audioQuality") return audioQualityFor(track) === value;
  if (field === "sourceLibrary") return sourceFor(track) === value;
  if (field === "playlist") return context.playlistTrackIds?.has(track.id) || false;
  if (field === "compilation") return value === "yes" ? Boolean(track.compilation) : !track.compilation;
  if (field === "featuredArtists") return value === "yes" ? Boolean(track.featuredArtists) : !track.featuredArtists;
  if (field === "live") return value === "live" ? Boolean(track.live) : !track.live;
  if (field === "remix") return value === "yes" ? Boolean(track.remix) : !track.remix;
  if (field === "acoustic") return value === "yes" ? Boolean(track.acoustic) : !track.acoustic;
  if (field === "duplicate") {
    const duplicateSet = context.duplicateSet || duplicateKeys();
    return value === "yes" ? duplicateSet.has(duplicateKeyFor(track)) : !duplicateSet.has(duplicateKeyFor(track));
  }
  if (field === "neverPlayed") return plays === 0;
  if (field === "rarelyPlayed") return plays > 0 && plays <= 2;
  if (field === "recentlyPlayed") return daysAgo(lastPlayedFor(track)) <= 30;
  if (field === "recentlyAdded") return daysAgo(dateAddedFor(track)) <= 30;
  if (field === "mostPlayed") return plays >= 10;
  if (field === "leastPlayed") return plays <= 1;
  if (field === "lyrics") return value === "yes" ? Boolean(track.hasLyrics) : !track.hasLyrics;
  if (field === "explicit") return value === "explicit" ? Boolean(track.explicit) : !track.explicit;
  return true;
}

function compareText(left, right) {
  return cleanText(left).localeCompare(cleanText(right), undefined, { numeric: true, sensitivity: "base" });
}

function normalizePlaylistSort(value) {
  return PLAYLIST_SORT_OPTIONS.some(([optionValue]) => optionValue === value) ? value : "orderAdded";
}

function playlistSortValue(track, sort = state.playlistSort) {
  if (sort === "artist") return track.artist;
  if (sort === "title") return track.title;
  if (sort === "album") return track.album;
  if (sort === "duration") return durationForTrack(track);
  return "";
}

function sortedPlaylistTracks(playlist) {
  const tracks = playlistTracks(playlist);
  const sort = normalizePlaylistSort(state.playlistSort);
  if (sort === "orderAdded") return tracks;

  return tracks
    .map((track, index) => ({ track, index }))
    .sort((left, right) => {
      if (sort === "duration") {
        const durationDifference = playlistSortValue(left.track, sort) - playlistSortValue(right.track, sort);
        return durationDifference || left.index - right.index;
      }
      return compareText(playlistSortValue(left.track, sort), playlistSortValue(right.track, sort))
        || compareText(left.track.title, right.track.title)
        || left.index - right.index;
    })
    .map((item) => item.track);
}

function sortTrackList(tracks) {
  const items = tracks.slice();
  if (state.librarySort === "random") return shuffleArray(items);
  if (state.librarySort === "weightedRandom") {
    return items
      .map((track) => ({ track, weight: Math.random() * (1 / (playCountFor(track) + 1)) }))
      .sort((left, right) => right.weight - left.weight)
      .map((item) => item.track);
  }

  const valueFor = (track) => {
    switch (state.librarySort) {
      case "artistAsc": return track.artist;
      case "albumAsc": return track.album;
      case "albumArtistAsc": return albumArtistFor(track);
      case "trackNumber": return Number(track.trackNumber || 0);
      case "discNumber": return Number(track.discNumber || 0) * 1000 + Number(track.trackNumber || 0);
      case "releaseDateDesc":
      case "releaseDateAsc": return dateValue(releaseDateFor(track));
      case "dateAddedDesc":
      case "dateAddedAsc": return dateValue(dateAddedFor(track));
      case "ratingDesc":
      case "ratingAsc": return ratingFor(track);
      case "playCountDesc":
      case "playCountAsc": return playCountFor(track);
      case "skipCountDesc":
      case "skipCountAsc": return skipCountFor(track);
      case "lastPlayedDesc":
      case "lastPlayedAsc":
      case "neglectedFirst": return dateValue(lastPlayedFor(track));
      case "durationAsc":
      case "durationDesc": return Number(track.duration || 0);
      case "bpmAsc":
      case "bpmDesc": return Number(track.bpm || 0);
      case "energyAsc":
      case "energyDesc": return Number(track.energy || 0);
      case "overplayedFirst": return playCountFor(track) - skipCountFor(track);
      default: return track.title;
    }
  };

  items.sort((left, right) => {
    if (state.librarySort === "titleAsc") return compareText(left.title, right.title);
    if (["artistAsc", "albumAsc", "albumArtistAsc"].includes(state.librarySort)) {
      return compareText(valueFor(left), valueFor(right)) || compareText(left.title, right.title);
    }
    const leftValue = valueFor(left);
    const rightValue = valueFor(right);
    const descending = ["releaseDateDesc", "dateAddedDesc", "ratingDesc", "playCountDesc", "skipCountDesc", "lastPlayedDesc", "durationDesc", "bpmDesc", "energyDesc", "overplayedFirst"].includes(state.librarySort);
    if (leftValue === rightValue) return compareText(left.title, right.title);
    return descending ? rightValue - leftValue : leftValue - rightValue;
  });

  return items;
}

function filteredTracks() {
  const cacheKey = [
    state.libraryDataVersion,
    state.playlistDataVersion,
    state.statsDataVersion,
    state.artistFilter,
    state.albumFilter,
    state.query.trim().toLowerCase(),
    state.libraryFilterField,
    state.libraryFilterValue,
    state.librarySort
  ].join("\u001f");
  if (memo.filteredTracksKey === cacheKey) return memo.filteredTracks;

  let tracks = state.tracks;
  const context = libraryFilterContext();
  if (state.artistFilter) {
    tracks = tracks.filter((track) => track.artist === state.artistFilter);
  }
  if (state.albumFilter) {
    tracks = tracks.filter((track) => albumKey(track) === state.albumFilter);
  }
  const result = sortTrackList(tracks.filter(trackMatchesSearch).filter((track) => trackMatchesLibraryFilter(track, context)));
  memo.filteredTracksKey = cacheKey;
  memo.filteredTracks = result;
  return result;
}

function artistSummaries(includeSearch = true) {
  const cacheKey = [
    state.libraryDataVersion,
    state.playlistDataVersion,
    state.statsDataVersion,
    includeSearch ? state.query.trim().toLowerCase() : "",
    state.libraryFilterField,
    state.libraryFilterValue,
    state.librarySort
  ].join("\u001f");
  if (memo.artistSummariesKey === cacheKey) return memo.artistSummaries;

  const groups = new Map();
  const context = libraryFilterContext();
  const sourceTracks = state.tracks.filter((track) => (!includeSearch || trackMatchesSearch(track)) && trackMatchesLibraryFilter(track, context));
  for (const track of sourceTracks) {
    const name = track.artist || "Unknown Artist";
    if (!groups.has(name)) groups.set(name, { name, tracks: [], albums: new Set(), cover: track, playCount: 0, skipCount: 0, lastPlayedAt: "" });
    const summary = groups.get(name);
    summary.tracks.push(track);
    summary.albums.add(track.album || "Unknown Album");
    summary.playCount += playCountFor(track);
    summary.skipCount += skipCountFor(track);
    if (dateValue(lastPlayedFor(track)) > dateValue(summary.lastPlayedAt)) summary.lastPlayedAt = lastPlayedFor(track);
    if (!summary.cover?.thumb && track.thumb) summary.cover = track;
  }

  const result = sortSummaries(Array.from(groups.values()), "artist");
  memo.artistSummariesKey = cacheKey;
  memo.artistSummaries = result;
  return result;
}

function albumSummaries(includeSearch = true) {
  const cacheKey = [
    state.libraryDataVersion,
    state.playlistDataVersion,
    state.statsDataVersion,
    includeSearch ? state.query.trim().toLowerCase() : "",
    state.libraryFilterField,
    state.libraryFilterValue,
    state.librarySort
  ].join("\u001f");
  if (memo.albumSummariesKey === cacheKey) return memo.albumSummaries;

  const groups = new Map();
  const context = libraryFilterContext();
  const sourceTracks = state.tracks.filter((track) => (!includeSearch || trackMatchesSearch(track)) && trackMatchesLibraryFilter(track, context));
  for (const track of sourceTracks) {
    const key = albumKey(track);
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        title: track.album || "Unknown Album",
        artist: track.artist || "Unknown Artist",
        albumArtist: albumArtistFor(track),
        year: track.year || null,
        releaseDate: releaseDateFor(track),
        dateAdded: dateAddedFor(track),
        tracks: [],
        cover: track,
        playCount: 0,
        skipCount: 0,
        lastPlayedAt: ""
      });
    }
    const summary = groups.get(key);
    summary.tracks.push(track);
    summary.playCount += playCountFor(track);
    summary.skipCount += skipCountFor(track);
    if (dateValue(lastPlayedFor(track)) > dateValue(summary.lastPlayedAt)) summary.lastPlayedAt = lastPlayedFor(track);
    if (!summary.cover?.thumb && track.thumb) summary.cover = track;
    if (!summary.year && track.year) summary.year = track.year;
    if (!summary.releaseDate && releaseDateFor(track)) summary.releaseDate = releaseDateFor(track);
    if (!summary.dateAdded && dateAddedFor(track)) summary.dateAdded = dateAddedFor(track);
  }

  const result = sortSummaries(Array.from(groups.values()), "album");
  memo.albumSummariesKey = cacheKey;
  memo.albumSummaries = result;
  return result;
}

function sortSummaries(summaries, type) {
  const items = summaries.slice();
  if (state.librarySort === "random") return shuffleArray(items);
  if (state.librarySort === "weightedRandom") {
    return items
      .map((item) => ({ item, weight: Math.random() * (1 / (Number(item.playCount || 0) + 1)) }))
      .sort((left, right) => right.weight - left.weight)
      .map((entry) => entry.item);
  }

  items.sort((left, right) => {
    if (type === "artist") {
      if (state.librarySort === "playCountDesc") return right.playCount - left.playCount || compareText(left.name, right.name);
      if (state.librarySort === "playCountAsc" || state.librarySort === "leastPlayed") return left.playCount - right.playCount || compareText(left.name, right.name);
      if (state.librarySort === "lastPlayedDesc") return dateValue(right.lastPlayedAt) - dateValue(left.lastPlayedAt) || compareText(left.name, right.name);
      if (state.librarySort === "lastPlayedAsc" || state.librarySort === "neglectedFirst") return dateValue(left.lastPlayedAt) - dateValue(right.lastPlayedAt) || compareText(left.name, right.name);
      return compareText(left.name, right.name);
    }

    if (state.librarySort === "artistAsc") return compareText(left.artist, right.artist) || compareText(left.title, right.title);
    if (state.librarySort === "albumArtistAsc") return compareText(left.albumArtist, right.albumArtist) || compareText(left.title, right.title);
    if (state.librarySort === "releaseDateDesc") return dateValue(right.releaseDate) - dateValue(left.releaseDate) || compareText(left.title, right.title);
    if (state.librarySort === "releaseDateAsc") return dateValue(left.releaseDate) - dateValue(right.releaseDate) || compareText(left.title, right.title);
    if (state.librarySort === "dateAddedDesc") return dateValue(right.dateAdded) - dateValue(left.dateAdded) || compareText(left.title, right.title);
    if (state.librarySort === "dateAddedAsc") return dateValue(left.dateAdded) - dateValue(right.dateAdded) || compareText(left.title, right.title);
    if (state.librarySort === "playCountDesc") return right.playCount - left.playCount || compareText(left.title, right.title);
    if (state.librarySort === "playCountAsc") return left.playCount - right.playCount || compareText(left.title, right.title);
    if (state.librarySort === "lastPlayedDesc") return dateValue(right.lastPlayedAt) - dateValue(left.lastPlayedAt) || compareText(left.title, right.title);
    if (state.librarySort === "lastPlayedAsc" || state.librarySort === "neglectedFirst") return dateValue(left.lastPlayedAt) - dateValue(right.lastPlayedAt) || compareText(left.title, right.title);
    return compareText(left.title, right.title);
  });

  return items;
}

function albumSummaryByKey(key) {
  const matchKey = key || state.albumFilter;
  const tracks = state.tracks.filter((track) => albumKey(track) === matchKey);
  if (!tracks.length) return null;
  return {
    key: matchKey,
    title: tracks[0].album || "Unknown Album",
    artist: tracks[0].artist || "Unknown Artist",
    albumArtist: albumArtistFor(tracks[0]),
    year: tracks.find((track) => track.year)?.year || null,
    tracks,
    cover: tracks.find((track) => track.thumb) || tracks[0]
  };
}

function clearSearch() {
  state.query = "";
  const searchInput = $("#searchInput");
  if (searchInput) searchInput.value = "";
}

function clearPlaylistSearch() {
  state.playlistQuery = "";
  const playlistSearchInput = $("[data-playlist-search]");
  if (playlistSearchInput) playlistSearchInput.value = "";
}

function routeGlobalSearchToLibrary() {
  state.view = "library";
  state.libraryView = "songs";
  state.artistFilter = "";
  state.albumFilter = "";
  state.activePlaylistId = "";
  state.playlistEditMode = false;
  state.playlistSettingsId = "";
  state.playlistQuery = "";
  state.libraryFilterField = "all";
  state.libraryFilterValue = "";
  state.libraryRenderSignature = "";
  syncViewShell("library");
  renderLibraryNav();
  renderSidebarPlaylists();
}

function captureNavigationScroll() {
  const main = $(".main-panel");
  return {
    main: main?.scrollTop || 0,
    windowX: window.scrollX || 0,
    windowY: window.scrollY || 0
  };
}

function navigationSnapshot() {
  return {
    view: state.view,
    libraryView: state.libraryView,
    artistFilter: state.artistFilter,
    albumFilter: state.albumFilter,
    activePlaylistId: state.activePlaylistId,
    playlistEditMode: state.playlistEditMode,
    playlistSettingsId: state.playlistSettingsId,
    playlistQuery: state.playlistQuery,
    query: state.query,
    libraryFilterField: state.libraryFilterField,
    libraryFilterValue: state.libraryFilterValue,
    librarySort: state.librarySort,
    scroll: captureNavigationScroll()
  };
}

function navigationSnapshotKey(snapshot) {
  return JSON.stringify({
    view: snapshot?.view || "library",
    libraryView: snapshot?.libraryView || "home",
    artistFilter: snapshot?.artistFilter || "",
    albumFilter: snapshot?.albumFilter || "",
    activePlaylistId: snapshot?.activePlaylistId || "",
    playlistEditMode: Boolean(snapshot?.playlistEditMode),
    playlistSettingsId: snapshot?.playlistSettingsId || "",
    playlistQuery: snapshot?.playlistQuery || "",
    query: snapshot?.query || "",
    libraryFilterField: snapshot?.libraryFilterField || "all",
    libraryFilterValue: snapshot?.libraryFilterValue || "",
    librarySort: snapshot?.librarySort || "titleAsc"
  });
}

function sameNavigationPlace(left, right) {
  return navigationSnapshotKey(left) === navigationSnapshotKey(right);
}

function pushNavigationSnapshot(stack, snapshot) {
  if (!snapshot) return;
  const last = stack[stack.length - 1];
  if (last && sameNavigationPlace(last, snapshot)) {
    stack[stack.length - 1] = snapshot;
  } else {
    stack.push(snapshot);
  }
  if (stack.length > NAVIGATION_HISTORY_LIMIT) stack.shift();
}

function restoreNavigationScroll(scroll) {
  requestAnimationFrame(() => {
    const main = $(".main-panel");
    if (main && Number.isFinite(Number(scroll?.main))) main.scrollTop = Number(scroll.main);
    if (Number.isFinite(Number(scroll?.windowX)) || Number.isFinite(Number(scroll?.windowY))) {
      window.scrollTo(Number(scroll?.windowX || 0), Number(scroll?.windowY || 0));
    }
  });
}

function renderHistoryButtons() {
  const backButton = $('[data-action="back"]');
  const forwardButton = $('[data-action="forward"]');
  if (backButton) {
    backButton.disabled = !navigationHistory.back.length;
    backButton.setAttribute("aria-disabled", String(backButton.disabled));
  }
  if (forwardButton) {
    forwardButton.disabled = !navigationHistory.forward.length;
    forwardButton.setAttribute("aria-disabled", String(forwardButton.disabled));
  }
}

function syncViewShell(view = state.view) {
  const targetView = view || "library";
  const navView = targetView === "equalizer" ? "settings" : targetView === AB_LOOP_ADVANCED_VIEW ? "library" : targetView;
  $$(".nav-item").forEach((button) => button.classList.toggle("active", button.dataset.view === navView));
  $$(".view").forEach((panel) => panel.classList.remove("active"));
  $(`#view${targetView[0].toUpperCase()}${targetView.slice(1)}`)?.classList.add("active");
}

function applyNavigationSnapshot(snapshot) {
  if (!snapshot) return;
  const validViews = new Set(["library", "playlists", "shuffle", "blocked", "settings", "equalizer", AB_LOOP_ADVANCED_VIEW]);
  state.view = validViews.has(snapshot.view) ? snapshot.view : "library";
  state.libraryView = snapshot.libraryView || "home";
  state.artistFilter = snapshot.artistFilter || "";
  state.albumFilter = snapshot.albumFilter || "";
  state.activePlaylistId = snapshot.activePlaylistId || "";
  state.playlistEditMode = Boolean(snapshot.playlistEditMode);
  state.playlistSettingsId = snapshot.playlistSettingsId || "";
  state.playlistQuery = snapshot.playlistQuery || "";
  state.query = snapshot.query || "";
  applyLibraryFilterSettings({
    field: snapshot.libraryFilterField || "all",
    value: snapshot.libraryFilterValue || "",
    sort: snapshot.librarySort || "titleAsc"
  });
  if (state.activePlaylistId && !playlistById(state.activePlaylistId)) {
    state.activePlaylistId = "";
    state.playlistEditMode = false;
  }
  if (state.playlistSettingsId && !playlistById(state.playlistSettingsId)) state.playlistSettingsId = "";
  const searchInput = $("#searchInput");
  if (searchInput) searchInput.value = state.query;
  const playlistSearchInput = $("[data-playlist-search]");
  if (playlistSearchInput) playlistSearchInput.value = state.playlistQuery;
  state.selectionAnchorId = "";
  state.libraryRenderSignature = "";
  renderAll();
  restoreNavigationScroll(snapshot.scroll || {});
}

function navigateWithHistory(navigate, options = {}) {
  const before = navigationSnapshot();
  navigate();
  const after = navigationSnapshot();
  if (sameNavigationPlace(before, after)) {
    renderHistoryButtons();
    return;
  }
  pushNavigationSnapshot(navigationHistory.back, before);
  navigationHistory.forward = [];
  renderHistoryButtons();
  if (options.resetScroll !== false) restoreNavigationScroll({ main: 0, windowX: 0, windowY: 0 });
}

function goBack() {
  const snapshot = navigationHistory.back.pop();
  if (!snapshot) {
    renderHistoryButtons();
    return;
  }
  pushNavigationSnapshot(navigationHistory.forward, navigationSnapshot());
  applyNavigationSnapshot(snapshot);
  renderHistoryButtons();
}

function goForward() {
  const snapshot = navigationHistory.forward.pop();
  if (!snapshot) {
    renderHistoryButtons();
    return;
  }
  pushNavigationSnapshot(navigationHistory.back, navigationSnapshot());
  applyNavigationSnapshot(snapshot);
  renderHistoryButtons();
}

function setView(view) {
  if (view !== "playlists") {
    state.activePlaylistId = "";
    state.playlistEditMode = false;
    state.playlistSettingsId = "";
    state.playlistQuery = "";
  }
  if (view !== AB_LOOP_ADVANCED_VIEW) closeAbLoopAdvancedMarkerMenu();
  state.view = view;
  syncViewShell(view);
  renderSurface();
  renderLibraryNav();
  renderSidebarPlaylists();
  renderActiveView();
}

function openAbLoopAdvancedView() {
  if (!abLoopControlsEnabled()) return;
  navigateWithHistory(() => {
    state.nowPlayingOpen = false;
    state.advancedPlaybackOpen = false;
    state.abLoopLauncherOpen = false;
    state.abLoopMenuOpen = false;
    closeAbLoopPadAssignmentMenu();
    closeAbLoopSavedLoopMenu();
    closeAbLoopAdvancedMarkerMenu();
    setView(AB_LOOP_ADVANCED_VIEW);
  });
}

function exitAbLoopAdvancedView() {
  closeAbLoopAdvancedMarkerMenu();
  if (navigationHistory.back.length) {
    goBack();
    return;
  }
  setLibraryView("home");
}

function setLibraryView(view) {
  state.view = "library";
  state.libraryView = view;
  state.artistFilter = "";
  state.albumFilter = "";
  state.activePlaylistId = "";
  state.playlistEditMode = false;
  state.playlistSettingsId = "";
  state.selectionAnchorId = "";
  setView("library");
}

function openArtist(artist) {
  state.libraryView = "artists";
  state.artistFilter = artist;
  state.albumFilter = "";
  state.selectionAnchorId = "";
  clearSearch();
  setView("library");
}

function openAlbum(key) {
  state.libraryView = "albums";
  state.artistFilter = "";
  state.albumFilter = key;
  state.selectionAnchorId = "";
  clearSearch();
  setView("library");
}

function playlistById(playlistId) {
  return state.playlists.find((item) => item.id === playlistId);
}

function playlistReorderElement(target) {
  return target?.closest?.("[data-playlist-reorder-id]") || null;
}

function playlistDropElement(target) {
  return target?.closest?.("[data-playlist-drop-id]") || null;
}

function libraryDragElement(target) {
  return target?.closest?.("[data-library-drag-type][data-library-drag-id]") || null;
}

function playlistDropPosition(event, element) {
  const rect = element.getBoundingClientRect();
  if (element.classList.contains("playlist-card")) {
    return event.clientX < rect.left + rect.width / 2 ? "before" : "after";
  }
  return event.clientY < rect.top + rect.height / 2 ? "before" : "after";
}

function setPlaylistDragTarget(targetId, position) {
  playlistDragState.targetId = targetId || "";
  playlistDragState.position = targetId ? position : "";
  syncPlaylistDragClasses();
}

function clearPlaylistDragState() {
  playlistDragState.sourceId = "";
  playlistDragState.targetId = "";
  playlistDragState.position = "";
  syncPlaylistDragClasses();
}

function clearLibraryDragState() {
  libraryDragState.type = "";
  libraryDragState.id = "";
  libraryDragState.label = "";
  libraryDragState.trackIds = [];
  libraryDragState.targetPlaylistId = "";
  syncPlaylistDragClasses();
  syncLibraryDragClasses();
}

function syncPlaylistDragClasses() {
  $$("[data-playlist-reorder-id]").forEach((element) => {
    const playlistId = element.dataset.playlistReorderId;
    element.classList.toggle("is-dragging", playlistDragState.sourceId === playlistId);
    element.classList.toggle("drag-over-before", playlistDragState.targetId === playlistId && playlistDragState.position === "before");
    element.classList.toggle("drag-over-after", playlistDragState.targetId === playlistId && playlistDragState.position === "after");
  });
  $$("[data-playlist-drop-id]").forEach((element) => {
    element.classList.toggle("drag-over-playlist", libraryDragState.targetPlaylistId === element.dataset.playlistDropId);
  });
}

function syncLibraryDragClasses() {
  $$("[data-library-drag-type][data-library-drag-id]").forEach((element) => {
    element.classList.toggle(
      "is-library-dragging",
      libraryDragState.type === element.dataset.libraryDragType && libraryDragState.id === element.dataset.libraryDragId
    );
  });
}

function setLibraryDropTarget(playlistId) {
  libraryDragState.targetPlaylistId = playlistId || "";
  syncPlaylistDragClasses();
}

function trackIdsForLibraryDrag(type, id) {
  if (type === "track") return trackById(id) ? [id] : [];
  if (type === "artist") return state.tracks.filter((track) => (track.artist || "Unknown Artist") === id).map((track) => track.id);
  if (type === "album") return state.tracks.filter((track) => albumKey(track) === id).map((track) => track.id);
  return [];
}

function labelForLibraryDrag(type, id, trackIds) {
  if (type === "track") return trackById(trackIds[0])?.title || "Track";
  if (type === "artist") return id || "Artist";
  if (type === "album") return albumSummaryByKey(id)?.title || "Album";
  return `${trackIds.length} songs`;
}

async function dropLibraryItemOnPlaylist(playlistId) {
  const playlist = playlistById(playlistId);
  const trackIds = uniqueTrackIds(libraryDragState.trackIds);
  if (!playlist || !trackIds.length) return;
  const sourceLabel = libraryDragState.label;
  const result = await addTrackIdsToPlaylist(playlist, trackIds);
  renderAll();
  const baseMessage = playlistAddMessage(result.added, result.duplicate, result.total, result.playlist?.name || playlist.name);
  showToast(sourceLabel ? `${sourceLabel}: ${baseMessage}` : baseMessage);
}

function reorderedPlaylists(sourceId, targetId, position) {
  if (!sourceId || !targetId || sourceId === targetId) return null;
  const source = playlistById(sourceId);
  if (!source || !playlistById(targetId)) return null;
  const withoutSource = state.playlists.filter((playlist) => playlist.id !== sourceId);
  const targetIndex = withoutSource.findIndex((playlist) => playlist.id === targetId);
  if (targetIndex === -1) return null;
  const insertIndex = targetIndex + (position === "after" ? 1 : 0);
  const next = withoutSource.slice();
  next.splice(insertIndex, 0, source);
  const currentIds = state.playlists.map((playlist) => playlist.id).join("\n");
  const nextIds = next.map((playlist) => playlist.id).join("\n");
  return currentIds === nextIds ? null : next;
}

function renderPlaylistOrderSurfaces() {
  renderSidebarPlaylists();
  if (state.view === "playlists" && !state.activePlaylistId) renderPlaylists();
}

async function savePlaylistOrder(nextPlaylists) {
  const previousPlaylists = state.playlists;
  state.playlists = nextPlaylists;
  markPlaylistsChanged();
  renderPlaylistOrderSurfaces();
  try {
    const payload = await api("/api/playlists/order", {
      method: "PUT",
      body: JSON.stringify({ playlistIds: nextPlaylists.map((playlist) => playlist.id) })
    });
    state.playlists = payload.playlists;
    markPlaylistsChanged();
    renderPlaylistOrderSurfaces();
  } catch (error) {
    state.playlists = previousPlaylists;
    markPlaylistsChanged();
    renderPlaylistOrderSurfaces();
    showToast(error.message || "Could not reorder playlists.");
  }
}

function playlistTracks(playlist) {
  return (playlist?.trackIds || []).map(trackById).filter(Boolean);
}

function activePlaylist() {
  return playlistById(state.activePlaylistId);
}

function activePlaylistTracks() {
  return sortedPlaylistTracks(activePlaylist());
}

function recommendationEngine() {
  return window.VoidFMRecommendations || null;
}

function playableRecommendationCandidates() {
  return state.tracks.filter((track) => track && !isBlocked(track) && !unsupportedPlaybackReason(track));
}

function playlistSuggestionItems(playlist, limit = 12) {
  const engine = recommendationEngine();
  if (!engine?.playlistRecommendations || !playlist) return [];
  return engine.playlistRecommendations({
    playlistTracks: playlistTracks(playlist),
    candidateTracks: playableRecommendationCandidates(),
    existingTrackIds: playlist.trackIds || [],
    statsById: state.listeningStats,
    limit,
    maxPerArtist: 2
  });
}

function uniqueTrackIds(trackIds = []) {
  return Array.from(new Set(trackIds.map(String).filter(Boolean)));
}

function pendingPlaylistTrackIds() {
  const selected = selectedTrackIdsForAction();
  if (selected.length) return selected;
  if (state.queue.length) return state.queue.map((track) => track.id);
  return currentSelectionTrackIds();
}

function playlistDefaultProfile(playlist) {
  const profileId = playlist?.defaultShuffleProfileId || "";
  return profileId ? state.customShuffles.find((profile) => profile.id === profileId) || null : null;
}

function playlistQueueBuildOptions(playlist, options = {}) {
  if (!playlist) return options;
  const shouldUseProfile = (options.forceShuffle ?? state.shuffle) !== false;
  const profile = Object.prototype.hasOwnProperty.call(options, "profile")
    ? options.profile
    : shouldUseProfile ? playlistDefaultProfile(playlist) : null;
  return {
    ...options,
    sourceTracks: options.sourceTracks || sortedPlaylistTracks(playlist),
    profile
  };
}

function currentSurfaceQueueBuildOptions(options = {}) {
  if (state.view === "playlists" && state.activePlaylistId) {
    return playlistQueueBuildOptions(activePlaylist(), options);
  }
  return options;
}

function queueContextBuildOptions(context = state.queueContext, options = {}) {
  const shouldUseProfile = (options.forceShuffle ?? state.shuffle) !== false;
  if (context?.type === "playlist" && context.playlistId) {
    const playlist = playlistById(context.playlistId);
    return playlistQueueBuildOptions(playlist, {
      ...options,
      profile: shouldUseProfile && context.shuffleProfileId ? shuffleProfileById(context.shuffleProfileId) : null
    });
  }
  if (context?.type === "shuffleProfile" && context.shuffleProfileId) {
    return {
      ...options,
      profile: shouldUseProfile ? shuffleProfileById(context.shuffleProfileId) : null
    };
  }
  return options;
}

function playlistShuffleLabel(playlist) {
  const profile = playlistDefaultProfile(playlist);
  if (profile) return profile.name;
  return playlist?.defaultShuffleProfileId ? "Custom shuffle unavailable" : "Standard Shuffle";
}

function playlistQueueContext(playlist, profileId = playlist?.defaultShuffleProfileId || "") {
  const defaultEqPreset = playlistDefaultEqPreset(playlist);
  return {
    type: playlist?.id ? "playlist" : "",
    playlistId: playlist?.id || "",
    shuffleProfileId: profileId || "",
    defaultEqPreset,
    fadeSeconds: normalizeFadeSeconds(playlist?.fadeSeconds)
  };
}

function playlistDefaultEqPreset(playlist) {
  if (!playlist?.id) return "";
  const eq = eqSettings();
  return String(playlist.defaultEqPreset || eq.playlistDefaults?.[playlist.id] || "");
}

function setLocalPlaylistDefaultEqPreset(playlistId, reference) {
  const id = String(playlistId || "");
  if (!id) return;
  const value = cleanText(reference).slice(0, 220);
  state.playlists = state.playlists.map((playlist) => (
    playlist.id === id ? { ...playlist, defaultEqPreset: value } : playlist
  ));
  const eq = eqSettings();
  const playlistDefaults = normalizeEqPlaylistDefaults(eq.playlistDefaults);
  if (value) playlistDefaults[id] = value;
  else delete playlistDefaults[id];
  eq.playlistDefaults = playlistDefaults;
  setEqSettings(eq);
}

async function savePlaylistDefaultEqPreset(playlistId, reference) {
  setLocalPlaylistDefaultEqPreset(playlistId, reference);
  const settings = await api("/api/settings", {
    method: "POST",
    body: JSON.stringify({ eq: eqSettings() })
  });
  state.settings = settings;
  state.settings.eq = normalizeEqSettings(settings.eq);
  if (state.queueContext?.type === "playlist" && state.queueContext.playlistId === playlistId) {
    state.queueContext.defaultEqPreset = playlistDefaultEqPreset(playlistById(playlistId));
    applyPlaylistDefaultEqForContext(state.queueContext, { save: false, render: false });
    schedulePlaybackSave();
  }
}

function applyPlaylistDefaultEqForContext(context, options = {}) {
  const playlist = context?.type === "playlist" && context.playlistId ? playlistById(context.playlistId) : null;
  const reference = String(context?.defaultEqPreset || playlistDefaultEqPreset(playlist) || "");
  if (!reference) return false;
  return applyEqPresetReference(reference, {
    save: options.save === true,
    render: options.render === true
  });
}

function shuffleQueueContext(profile = activeShuffleProfile()) {
  return {
    type: profile?.id ? "shuffleProfile" : "",
    playlistId: "",
    shuffleProfileId: profile?.id || "",
    fadeSeconds: normalizeFadeSeconds(profile?.fadeSeconds)
  };
}

function currentSurfaceQueueContext() {
  if (state.view === "playlists" && state.activePlaylistId) return playlistQueueContext(activePlaylist());
  return state.shuffle ? shuffleQueueContext(activeShuffleProfile()) : { type: "", playlistId: "", shuffleProfileId: "", fadeSeconds: 0 };
}

function openPlaylist(playlistId) {
  if (!playlistById(playlistId)) return;
  state.activePlaylistId = playlistId;
  state.playlistEditMode = false;
  state.playlistSettingsId = "";
  state.selectedIds.clear();
  state.selectionAnchorId = "";
  markSelectionChanged();
  clearSearch();
  clearPlaylistSearch();
  setView("playlists");
}

async function savePlaylistTrackIds(playlistId, trackIds) {
  const playlist = await api(`/api/playlists/${playlistId}`, {
    method: "PUT",
    body: JSON.stringify({ trackIds })
  });
  state.playlists = state.playlists.map((item) => item.id === playlist.id ? playlist : item);
  markPlaylistsChanged();
  return playlist;
}

async function savePlaylistSettings(playlistId, payload) {
  const shouldSaveEqDefault = Object.prototype.hasOwnProperty.call(payload || {}, "defaultEqPreset");
  const playlist = await api(`/api/playlists/${encodeURIComponent(playlistId)}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
  state.playlists = state.playlists.map((item) => item.id === playlist.id ? playlist : item);
  if (shouldSaveEqDefault) {
    await savePlaylistDefaultEqPreset(playlist.id, payload.defaultEqPreset);
  }
  if (state.queueContext?.type === "playlist" && state.queueContext.playlistId === playlist.id) {
    const currentPlaylist = playlistById(playlist.id) || playlist;
    const profile = playlistDefaultProfile(currentPlaylist);
    state.queueContext = playlistQueueContext(currentPlaylist, profile?.id || "");
    state.activeShuffleProfileId = profile?.id || "";
    applyPlaylistDefaultEqForContext(state.queueContext, { save: false, render: false });
    schedulePlaybackSave();
  }
  markPlaylistsChanged();
  return playlist;
}

async function savePlaylistTrackTrim(playlistId, trackId, trim) {
  const playlist = playlistById(playlistId);
  if (!playlist || !trackId) return null;
  const trackTrims = normalizedPlaylistTrackTrims(playlist);
  if (trim) trackTrims[trackId] = trim;
  else delete trackTrims[trackId];
  const updated = await savePlaylistSettings(playlistId, { trackTrims });
  if (state.queueContext?.type === "playlist" && state.queueContext.playlistId === playlistId && currentTrack()?.id === trackId) {
    const nextTime = clampToPlaybackWindow(currentTrack(), playbackPositionMs());
    if (audio.src && nextTime !== playbackPositionMs()) audio.currentTime = nextTime / 1000;
    state.currentTime = nextTime;
    renderPlaybackSurfaces();
  }
  return updated;
}

function safeFileName(value, fallback = "playlist") {
  return cleanText(value).replace(/[\\/:*?"<>|]+/g, "-").replace(/\s+/g, " ").slice(0, 80) || fallback;
}

function fileNameStem(name) {
  return cleanText(name).replace(/\.[^.]+$/, "");
}

function downloadJson(payload, fileName) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function contentDispositionFileName(header, fallback) {
  const value = String(header || "");
  const utf8Match = value.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match) return decodeURIComponent(utf8Match[1].replace(/^"|"$/g, ""));
  const match = value.match(/filename="?([^";]+)"?/i);
  return match?.[1] || fallback;
}

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function collectBrowserStorageBackup() {
  const entries = {};
  try {
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (key && key.startsWith("voidfm.")) entries[key] = localStorage.getItem(key) || "";
    }
  } catch {
    return null;
  }
  return {
    capturedAt: new Date().toISOString(),
    origin: window.location.origin,
    userAgent: navigator.userAgent,
    entries
  };
}

function backupTimeLabel(value) {
  if (!value) return "No automatic backup recorded yet.";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No automatic backup recorded yet.";
  return `Last auto backup: ${date.toLocaleString()}`;
}

function backupStatusSummary() {
  const status = state.backupStatus || {};
  const counts = status.counts || {};
  const parts = [
    `${state.playlists.length} playlists`,
    `${state.customShuffles.length} custom shuffles`,
    `${state.tracks.length} library tracks`
  ];
  if (counts.databaseBackups || counts.criticalStateBackups || counts.playlistBackupFiles) {
    parts.push(`${Number(counts.databaseBackups || 0)} database backups`);
    parts.push(`${Number(counts.playlistBackupFiles || 0)} playlist backups`);
  }
  return parts.join(" / ");
}

async function refreshBackupStatus(options = {}) {
  const status = await api("/api/backup/status").catch(() => null);
  if (status) state.backupStatus = status;
  if (options.render !== false && state.view === "settings") renderSettings();
  return status;
}

async function exportUserDataBackup(button = null) {
  const status = $("[data-export-user-data-status]");
  const previousLabel = button?.querySelector("span")?.textContent || "";
  if (button) {
    button.disabled = true;
    const label = button.querySelector("span");
    if (label) label.textContent = "Saving...";
  }
  if (status) status.textContent = "Preparing backup archive...";

  try {
    const response = await fetch("/api/export-user-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(localApiToken ? { "X-VoidFM-Token": localApiToken } : {})
      },
      body: JSON.stringify({ browserStorage: collectBrowserStorageBackup() })
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload.detail || payload.error || "Could not export user data.");
    }
    const blob = await response.blob();
    const fileName = contentDispositionFileName(response.headers.get("Content-Disposition"), "VoidFM_UserData_Backup.zip");
    downloadBlob(blob, fileName);
    if (status) status.textContent = `Downloaded ${fileName}.`;
    await refreshBackupStatus({ render: false });
    showToast("Exported VoidFM user data backup.");
  } catch (error) {
    if (status) status.textContent = error.message || "Could not export user data.";
    showToast(error.message || "Could not export user data.");
  } finally {
    if (button) {
      button.disabled = false;
      const label = button.querySelector("span");
      if (label) label.textContent = previousLabel || "Export User Data";
    }
  }
}

async function openBackupFolder(button = null) {
  const status = $("[data-export-user-data-status]");
  if (button) button.disabled = true;
  try {
    const result = await window.voidfmWindow?.openBackupFolder?.();
    if (result?.ok) {
      if (status) status.textContent = "Opened backup folder.";
      showToast("Opened backup folder.");
      return;
    }
    const folder = result?.path || state.backupStatus?.backupFolder || "";
    if (folder && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(folder);
      if (status) status.textContent = `Copied backup folder path: ${folder}`;
      showToast("Backup folder path copied.");
      return;
    }
    if (status) status.textContent = folder ? `Backup folder: ${folder}` : "Backup folder is unavailable in this browser.";
    showToast("Backup folder path is shown in Settings.");
  } catch (error) {
    if (status) status.textContent = error.message || "Could not open backup folder.";
    showToast(error.message || "Could not open backup folder.");
  } finally {
    if (button) button.disabled = false;
  }
}

function exportTrackRecord(track, index = 0, playlist = null) {
  const trim = playlist ? playlistTrackTrim(playlist, track.id, track) : null;
  const record = {
    position: index + 1,
    id: track.id,
    ratingKey: track.ratingKey || "",
    title: track.title,
    artist: track.artist,
    album: track.album,
    albumArtist: albumArtistFor(track),
    duration: track.duration,
    source: track.source,
    sourceLibrary: sourceFor(track),
    sectionTitle: track.sectionTitle || "",
    trackNumber: track.trackNumber || 0,
    discNumber: track.discNumber || 0,
    year: track.year || null,
    releaseDate: releaseDateFor(track),
    dateAdded: dateAddedFor(track),
    genres: track.genres || [],
    moods: track.moods || [],
    tags: track.tags || [],
    language: track.language || "",
    bpm: track.bpm || null,
    energy: track.energy || null,
    rating: ratingFor(track),
    playCount: playCountFor(track),
    skipCount: skipCountFor(track),
    lastPlayedAt: lastPlayedFor(track),
    fileType: fileTypeFor(track),
    audioQuality: audioQualityFor(track)
  };
  if (trim) {
    record.trimStartMs = trim.startMs;
    record.trimEndMs = trim.endMs;
  }
  return record;
}

function exportPlaylist(playlistId) {
  const playlist = playlistById(playlistId);
  if (!playlist) return;
  const tracks = playlistTracks(playlist).map((track, index) => exportTrackRecord(track, index, playlist));
  const trackTrims = normalizedPlaylistTrackTrims(playlist);
  const defaultEqPreset = playlistDefaultEqPreset(playlist);
  const payload = {
    exportedAt: new Date().toISOString(),
    playlist: {
      id: playlist.id,
      name: playlist.name,
      photoDataUrl: playlist.photoDataUrl || "",
      tileImageDataUrl: playlist.photoDataUrl || "",
      defaultShuffleProfileId: playlist.defaultShuffleProfileId || "",
      defaultEqPreset,
      fadeSeconds: normalizeFadeSeconds(playlist.fadeSeconds),
      textColor: optionalHex(playlist.textColor),
      highlightColor: optionalHex(playlist.highlightColor),
      settings: {
        photoDataUrl: playlist.photoDataUrl || "",
        tileImageDataUrl: playlist.photoDataUrl || "",
        defaultShuffleProfileId: playlist.defaultShuffleProfileId || "",
        defaultEqPreset,
        fadeSeconds: normalizeFadeSeconds(playlist.fadeSeconds),
        textColor: optionalHex(playlist.textColor),
        highlightColor: optionalHex(playlist.highlightColor)
      },
      trackTrims,
      trackIds: playlist.trackIds || []
    },
    tracks
  };
  downloadJson(payload, `${safeFileName(playlist.name)}.json`);
}

function exportLibraryTrackList() {
  const payload = {
    exportedAt: new Date().toISOString(),
    library: {
      name: "Full Library",
      trackCount: state.tracks.length,
      sources: uniqueValues(state.tracks.map(sourceFor))
    },
    tracks: state.tracks.map(exportTrackRecord)
  };
  downloadJson(payload, "VoidFM Library Track List.json");
}

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value ?? null));
}

function finiteNumberOrNull(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function hasFiniteNumberValue(value) {
  return finiteNumberOrNull(value) !== null;
}

function exportableShuffleProfile(profile) {
  const normalized = normalizeShuffleProfileClient(profile) || {};
  const rules = Array.isArray(normalized.rules)
    ? cloneJson(normalized.rules).map((rule) => ({
      ...rule,
      type: String(rule?.type || "").trim()
    })).filter((rule) => rule.type)
    : [];

  return {
    name: cleanText(normalized.name) || "Custom Shuffle",
    schemaVersion: 2,
    presetId: normalized.presetId ? String(normalized.presetId) : "",
    terms: cleanText(normalized.terms),
    yearMin: finiteNumberOrNull(normalized.yearMin),
    yearMax: finiteNumberOrNull(normalized.yearMax),
    artistRunLength: Math.max(1, Math.min(10, Number(normalized.artistRunLength || 1))),
    requireFullArtistRun: normalized.requireFullArtistRun !== false,
    titleLetterChain: Boolean(normalized.titleLetterChain),
    fadeSeconds: normalizeFadeSeconds(normalized.fadeSeconds),
    rules
  };
}

function shuffleProfileHasLogic(profile) {
  return Boolean(
    cleanText(profile?.terms)
      || hasFiniteNumberValue(profile?.yearMin)
      || hasFiniteNumberValue(profile?.yearMax)
      || Number(profile?.artistRunLength || 1) > 1
      || profile?.titleLetterChain
      || (Array.isArray(profile?.rules) && profile.rules.length)
  );
}

function currentWorkshopExportProfile() {
  const form = $("#shuffleProfileForm");
  if (form) {
    const payload = currentWorkshopProfile();
    const hasProfileBasics = Boolean($('[name="name"][form="shuffleProfileForm"]'));
    const active = workshopProfileForRender();
    if (!hasProfileBasics && active) {
      return {
        ...active,
        rules: payload.rules,
        schemaVersion: 2
      };
    }
    return payload;
  }
  return activeShuffleProfile();
}

function exportShuffleProfile(profileOrId = currentWorkshopExportProfile()) {
  const source = typeof profileOrId === "string"
    ? state.customShuffles.find((profile) => profile.id === profileOrId)
    : profileOrId;
  if (!source) {
    showToast("Choose or save a shuffle flow before exporting.");
    return;
  }

  const profile = exportableShuffleProfile(source);
  if (!shuffleProfileHasLogic(profile)) {
    showToast("Add at least one shuffle rule before exporting.");
    return;
  }

  const payload = {
    app: "VoidFM",
    kind: SHUFFLE_PROFILE_EXPORT_KIND,
    exportedAt: new Date().toISOString(),
    profile
  };
  downloadJson(payload, `${safeFileName(profile.name, "shuffle-profile")}.voidfm-shuffle.json`);
  showToast(`Exported ${profile.name}.`);
}

function shuffleProfileNameTaken(name, reservedNames = new Set()) {
  const key = shuffleProfileNameKey(name);
  return Boolean(key && (reservedNames.has(key) || shuffleProfileByName(name)));
}

function uniqueImportedShuffleProfileName(name, reservedNames = new Set()) {
  const base = cleanText(name) || "Imported Shuffle";
  if (!shuffleProfileNameTaken(base, reservedNames)) return base;
  const imported = `${base} (Imported)`;
  if (!shuffleProfileNameTaken(imported, reservedNames)) return imported;
  let index = 2;
  let candidate = `${base} (${index})`;
  while (shuffleProfileNameTaken(candidate, reservedNames)) {
    index += 1;
    candidate = `${base} (${index})`;
  }
  return candidate;
}

function shuffleProfileImportCandidates(data) {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== "object") return [];
  const candidates = [];
  if (Array.isArray(data.shuffleProfiles)) candidates.push(...data.shuffleProfiles);
  if (Array.isArray(data.profiles)) candidates.push(...data.profiles);
  if (data.shuffleProfile && typeof data.shuffleProfile === "object") candidates.push(data.shuffleProfile);
  if (data.profile && typeof data.profile === "object") candidates.push(data.profile);
  return candidates.length ? candidates : [data];
}

function shuffleProfileImportPayload(candidate, file, reservedNames = new Set()) {
  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) return null;
  const profile = exportableShuffleProfile({
    ...candidate,
    name: candidate.name || fileNameStem(file?.name) || "Imported Shuffle"
  });
  if (!shuffleProfileHasLogic(profile)) return null;
  const payload = {
    ...profile,
    name: uniqueImportedShuffleProfileName(profile.name, reservedNames)
  };
  reservedNames.add(shuffleProfileNameKey(payload.name));
  return payload;
}

function shuffleProfileImportPayloads(data, file) {
  const reservedNames = new Set();
  const payloads = shuffleProfileImportCandidates(data)
    .map((candidate) => shuffleProfileImportPayload(candidate, file, reservedNames))
    .filter(Boolean);
  if (!payloads.length) {
    throw new Error(`${file?.name || "JSON file"} does not look like a VoidFM shuffle export.`);
  }
  return payloads;
}

async function importShuffleProfileFiles(fileList) {
  const files = Array.from(fileList || []);
  if (!files.length) return;

  let imported = 0;
  let firstProfileId = "";
  const errors = [];
  for (const file of files) {
    try {
      const text = await readFileAsText(file);
      const payloads = shuffleProfileImportPayloads(JSON.parse(text), file);
      for (const payload of payloads) {
        const profile = await api("/api/shuffle-profiles", {
          method: "POST",
          body: JSON.stringify(payload)
        });
        state.customShuffles.unshift(profile);
        if (!firstProfileId) firstProfileId = profile.id;
        imported += 1;
      }
    } catch (error) {
      errors.push({ file: file.name, message: error.message });
    }
  }

  if (imported) {
    state.activeShuffleProfileId = firstProfileId;
    resetWorkshopDraft();
    state.shuffle = true;
    schedulePlaybackSave();
    renderAll();
  }
  if (errors.length) console.warn("Shuffle profile import errors", errors);
  if (imported && errors.length) showToast(`Imported ${imported} shuffle profile${imported === 1 ? "" : "s"}. ${errors.length} file${errors.length === 1 ? "" : "s"} skipped.`);
  else if (imported) showToast(`Imported ${imported} shuffle profile${imported === 1 ? "" : "s"}.`);
  else showToast(errors[0]?.message || "No shuffle profile JSON imported.");
}

function importedDurationMs(record = {}) {
  const raw = Number(record.duration ?? record.durationMs ?? record.length ?? 0);
  if (!Number.isFinite(raw) || raw <= 0) return 0;
  return raw < 10000 ? raw * 1000 : raw;
}

function importedRecordIds(record = {}) {
  if (!record || typeof record !== "object") return [];
  return [
    record.id,
    record.trackId,
    record.ratingKey,
    record.key
  ].map((value) => String(value || "")).filter(Boolean);
}

function matchImportedTrack(record) {
  if (typeof record === "string" || typeof record === "number") {
    return trackById(String(record))?.id || "";
  }
  if (!record || typeof record !== "object") return "";

  for (const id of importedRecordIds(record)) {
    const track = trackById(id);
    if (track) return track.id;
  }

  const title = lowerText(record.title || record.name || record.trackName);
  const artist = lowerText(record.artist || record.artistName);
  const album = lowerText(record.album || record.albumName);
  if (!title) return "";

  const matches = state.tracks.filter((track) => {
    if (lowerText(track.title) !== title) return false;
    if (artist && lowerText(track.artist) !== artist) return false;
    if (album && lowerText(track.album) !== album) return false;
    return true;
  });
  if (!matches.length) return "";

  const duration = importedDurationMs(record);
  if (duration) {
    const durationMatch = matches.find((track) => Math.abs(durationForTrack(track) - duration) <= 2500);
    if (durationMatch) return durationMatch.id;
  }
  return matches[0].id;
}

function uniqueImportedPlaylistName(name) {
  const base = cleanText(name) || "Imported Playlist";
  if (!playlistByName(base)) return base;
  let index = 2;
  let candidate = `${base} (${index})`;
  while (playlistByName(candidate)) {
    index += 1;
    candidate = `${base} (${index})`;
  }
  return candidate;
}

function playlistImportPayload(data, file) {
  const root = Array.isArray(data) ? { tracks: data } : data && typeof data === "object" ? data : {};
  const source = root.playlist && typeof root.playlist === "object" ? root.playlist : root;
  const trackRecords = []
    .concat(Array.isArray(root.tracks) ? root.tracks : [])
    .concat(Array.isArray(source.tracks) ? source.tracks : []);
  const idRecords = []
    .concat(Array.isArray(source.trackIds) ? source.trackIds : [])
    .concat(Array.isArray(root.trackIds) ? root.trackIds : [])
    .concat(Array.isArray(source.ids) ? source.ids : [])
    .concat(Array.isArray(root.ids) ? root.ids : []);
  const trackIds = [];
  const trackTrims = {};
  const importedIdMap = new Map();
  const addTrackId = (trackId) => {
    if (trackId && !trackIds.includes(trackId)) trackIds.push(trackId);
  };

  for (const record of trackRecords.concat(idRecords)) {
    const matchedId = matchImportedTrack(record);
    if (!matchedId) continue;
    addTrackId(matchedId);
    if (record && typeof record === "object") {
      for (const rawId of importedRecordIds(record)) importedIdMap.set(rawId, matchedId);
      const trim = importedTrackTrim(record);
      if (trim) trackTrims[matchedId] = trim;
    } else {
      importedIdMap.set(String(record), matchedId);
    }
  }

  const exportedTrims = source.trackTrims || root.trackTrims || source.trackTimings || root.trackTimings || {};
  if (exportedTrims && typeof exportedTrims === "object" && !Array.isArray(exportedTrims)) {
    for (const [rawTrackId, rawTrim] of Object.entries(exportedTrims)) {
      const matchedId = importedIdMap.get(String(rawTrackId)) || matchImportedTrack(rawTrackId);
      if (!matchedId) continue;
      const track = trackById(matchedId);
      const trim = normalizeTrackTrim(rawTrim, track ? durationForTrack(track) : 0);
      if (trim) trackTrims[matchedId] = trim;
    }
  }

  const hasPlaylistShape = Boolean(root.playlist)
    || Array.isArray(root.tracks)
    || Array.isArray(source.tracks)
    || Array.isArray(root.trackIds)
    || Array.isArray(source.trackIds)
    || Object.keys(exportedTrims).length > 0;

  if (!hasPlaylistShape) {
    throw new Error(`${file?.name || "JSON file"} does not look like a playlist export.`);
  }

  const sourceSettings = source.settings && typeof source.settings === "object" ? source.settings : {};

  return {
    name: uniqueImportedPlaylistName(source.name || root.name || fileNameStem(file?.name) || "Imported Playlist"),
    trackIds,
    trackTrims,
    photoDataUrl: source.photoDataUrl || source.tileImageDataUrl || sourceSettings.photoDataUrl || sourceSettings.tileImageDataUrl || "",
    defaultShuffleProfileId: source.defaultShuffleProfileId || sourceSettings.defaultShuffleProfileId || "",
    defaultEqPreset: source.defaultEqPreset || sourceSettings.defaultEqPreset || "",
    fadeSeconds: normalizeFadeSeconds(source.fadeSeconds ?? sourceSettings.fadeSeconds),
    textColor: optionalHex(source.textColor || sourceSettings.textColor),
    highlightColor: optionalHex(source.highlightColor || sourceSettings.highlightColor)
  };
}

async function importPlaylistFiles(fileList) {
  const files = Array.from(fileList || []);
  if (!files.length) return;

  let imported = 0;
  const errors = [];
  for (const file of files) {
    try {
      const text = await readFileAsText(file);
      const payload = playlistImportPayload(JSON.parse(text), file);
      const playlist = await api("/api/playlists", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      state.playlists.unshift(playlist);
      imported += 1;
    } catch (error) {
      errors.push({ file: file.name, message: error.message });
    }
  }

  if (imported) {
    markPlaylistsChanged();
    renderAll();
  }
  if (errors.length) console.warn("Playlist import errors", errors);
  if (imported && errors.length) showToast(`Imported ${imported} playlist${imported === 1 ? "" : "s"}. ${errors.length} file${errors.length === 1 ? "" : "s"} skipped.`);
  else if (imported) showToast(`Imported ${imported} playlist${imported === 1 ? "" : "s"}.`);
  else showToast(errors[0]?.message || "No playlist JSON imported.");
}

function playlistAddMessage(added, duplicate, total, playlistName) {
  if (total === 1 && duplicate === 1) return "That song is already in this playlist.";
  if (total === 1 && added === 1) return `1/1 song added to ${playlistName}.`;
  if (duplicate > 0) return `${added}/${total} songs added to ${playlistName}, ${duplicate}/${total} songs are already in the playlist.`;
  return `${added}/${total} songs added to ${playlistName}.`;
}

async function addTrackIdsToPlaylist(playlist, trackIds) {
  if (!playlist) return { added: 0, duplicate: 0, total: trackIds.length, playlist: null };
  const existing = new Set(playlist.trackIds || []);
  const uniqueIncoming = uniqueTrackIds(trackIds);
  const missing = uniqueIncoming.filter((id) => !existing.has(id));
  const duplicate = trackIds.filter((id) => existing.has(id)).length;
  const updated = missing.length
    ? await savePlaylistTrackIds(playlist.id, (playlist.trackIds || []).concat(missing))
    : playlist;
  return {
    added: missing.length,
    duplicate,
    total: trackIds.length,
    playlist: updated
  };
}

function selectedPlaylistTrackIdsForRemoval(playlist) {
  const playlistTrackIds = playlist?.trackIds || [];
  const playlistTrackSet = new Set(playlistTrackIds);
  const stateSelected = Array.from(state.selectedIds).filter((id) => playlistTrackSet.has(id));
  const checkedSelected = $$("[data-select-track]:checked")
    .map((input) => input.dataset.selectTrack)
    .filter((id) => playlistTrackSet.has(id));
  return uniqueTrackIds(stateSelected.concat(checkedSelected));
}

function openDeletePlaylistConfirm(playlistId) {
  if (!playlistById(playlistId)) return;
  state.confirmDialog = { open: true, type: "deletePlaylist", playlistId, shuffleProfileId: "", pending: false, status: "" };
  renderGlobalOverlays();
}

function openDeleteShuffleProfileConfirm(profileId) {
  if (!shuffleProfileById(profileId)) return;
  state.confirmDialog = { open: true, type: "deleteShuffleProfile", playlistId: "", shuffleProfileId: profileId, pending: false, status: "" };
  renderGlobalOverlays();
}

function closeConfirmDialog() {
  if (state.confirmDialog.pending) return;
  state.confirmDialog = { open: false, type: "", playlistId: "", shuffleProfileId: "", pending: false, status: "" };
  renderGlobalOverlays();
}

async function deletePlaylist(playlistId) {
  const playlist = playlistById(playlistId);
  const playlistName = playlist?.name || "Playlist";
  await api(`/api/playlists/${encodeURIComponent(playlistId)}`, { method: "DELETE" });
  state.playlists = state.playlists.filter((item) => item.id !== playlistId);
  if (state.activePlaylistId === playlistId) {
    state.activePlaylistId = "";
    state.playlistEditMode = false;
    state.selectedIds.clear();
    state.selectionAnchorId = "";
    markSelectionChanged();
  }
  if (state.playlistSettingsId === playlistId) state.playlistSettingsId = "";
  if (state.confirmDialog.playlistId === playlistId) state.confirmDialog = { open: false, type: "", playlistId: "", shuffleProfileId: "", pending: false, status: "" };
  markPlaylistsChanged();
  renderAll();
  showToast(`Deleted ${playlistName}.`);
}

async function deleteShuffleProfile(profileId) {
  if (state.confirmDialog.pending) return;
  const profile = shuffleProfileById(profileId);
  const profileName = profile?.name || "Custom shuffle";
  state.confirmDialog = {
    open: true,
    type: "deleteShuffleProfile",
    playlistId: "",
    shuffleProfileId: profileId,
    pending: true,
    status: `Deleting "${profileName}". Playback controls are still available.`
  };
  renderGlobalOverlays();
  try {
    await api(`/api/shuffle-profiles/${encodeURIComponent(profileId)}`, { method: "DELETE" });
    state.customShuffles = state.customShuffles.filter((candidate) => candidate.id !== profileId);
    state.playlists = state.playlists.map((playlist) => playlist.defaultShuffleProfileId === profileId
      ? { ...playlist, defaultShuffleProfileId: "" }
      : playlist);
    if (state.activeShuffleProfileId === profileId) state.activeShuffleProfileId = "";
    if (state.confirmDialog.shuffleProfileId === profileId) {
      state.confirmDialog = { open: false, type: "", playlistId: "", shuffleProfileId: "", pending: false, status: "" };
    }
    markPlaylistsChanged();
    schedulePlaybackSave();
    renderAll();
    showToast(`Deleted ${profileName}.`);
  } catch (error) {
    state.confirmDialog = {
      open: true,
      type: "deleteShuffleProfile",
      playlistId: "",
      shuffleProfileId: profileId,
      pending: false,
      status: error.message || "Could not delete this custom shuffle."
    };
    renderGlobalOverlays();
    showToast(error.message || "Could not delete custom shuffle.");
  }
}

async function addPendingTracksToExistingPlaylist(playlistId) {
  const playlist = playlistById(playlistId);
  const trackIds = uniqueTrackIds(state.playlistAddDialog.trackIds);
  if (!trackIds.length) {
    state.playlistAddDialog.status = "Select songs or build a queue first.";
    renderGlobalOverlays();
    return;
  }
  if (!playlist) {
    state.playlistAddDialog.status = "Choose an existing playlist.";
    state.playlistAddDialog.duplicatePlaylistId = "";
    renderGlobalOverlays();
    return;
  }
  const result = await addTrackIdsToPlaylist(playlist, trackIds);
  state.selectedIds.clear();
  state.selectionAnchorId = "";
  markSelectionChanged();
  markPlaylistsChanged();
  closePlaylistAddDialog();
  renderAll();
  showToast(playlistAddMessage(result.added, result.duplicate, result.total, result.playlist?.name || playlist.name));
}

function showToast(message) {
  state.toast = String(message || "");
  if (state.toastTimer) clearTimeout(state.toastTimer);
  state.toastTimer = null;
  renderGlobalOverlays();
  if (!state.toast) return;
  state.toastTimer = setTimeout(() => {
    state.toast = "";
    state.toastTimer = null;
    renderGlobalOverlays();
  }, 4200);
}

function saveFeedbackButton(control) {
  if (!control) return null;
  return control.matches("button") ? control : control.querySelector("button[type='submit'], .primary-button, .tool-button");
}

async function withSavingFeedback(target, task, options = {}) {
  const form = target?.matches?.("form") ? target : target?.closest?.("form");
  if (form?.dataset.saving === "1") return null;
  const button = saveFeedbackButton(options.button || target?.submitter || form);
  const previousHtml = button?.innerHTML || "";
  if (form) {
    form.dataset.saving = "1";
    form.setAttribute("aria-busy", "true");
  }
  if (button) {
    button.disabled = true;
    button.innerHTML = `${icons.refresh}<span>${escapeHtml(options.savingLabel || "Saving...")}</span>`;
  }
  try {
    const result = await task();
    if (options.successToast) showToast(options.successToast);
    return result;
  } finally {
    if (button) {
      button.disabled = false;
      button.innerHTML = previousHtml;
    }
    if (form) {
      delete form.dataset.saving;
      form.removeAttribute("aria-busy");
    }
  }
}

function recoverySourceLabel(notice = {}) {
  if (notice.recoverySource === "full-db") return "full database backup";
  if (notice.recoverySource === "critical-state") return "verified critical-state backup";
  if (notice.recoverySource === "playlist-backups") return "playlist backup set";
  if (notice.recoverySource === "fresh") return "fresh database";
  return notice.recoveredFrom ? "backup" : "stable state";
}

function recoveryNoticeHtml() {
  const notice = state.recoveryNotice;
  if (!notice) return "";
  const details = [];
  if (notice.recoveredFrom) details.push(`Restored from ${recoverySourceLabel(notice)}.`);
  if (notice.cacheRescanNeeded) details.push("The music library cache may need a rescan.");
  if (notice.settingsReconfigureNeeded) details.push("Some settings may need to be checked.");
  const detailText = details.join(" ");
  return `
    <section class="recovery-notice recovery-${escapeHtml(notice.level || "recovered")}" role="alert" aria-live="assertive">
      <div>
        <strong>${escapeHtml(notice.title || "Recovered From Backup")}</strong>
        <p>${escapeHtml(notice.message || "VoidFM found a corrupt database and restored the most recent stable state.")}</p>
        ${detailText ? `<span>${escapeHtml(detailText)}</span>` : ""}
      </div>
      <button class="tool-button" type="button" data-dismiss-recovery-notice="${escapeHtml(notice.id || "")}">${icons.x}<span>Dismiss</span></button>
    </section>
  `;
}

function runtimeNoticeHtml() {
  if (!state.runtimeMismatch || state.runtimeWarningDismissed) return "";
  const serverVersion = state.runtime?.versions?.assetVersion || "unknown";
  const processId = state.runtime?.processId ? ` PID ${state.runtime.processId}.` : "";
  return `
    <section class="runtime-notice" role="alert" aria-live="assertive">
      <div>
        <strong>VoidFM server needs a restart</strong>
        <p>The browser is running ${escapeHtml(APP_ASSET_VERSION)}, but the server reported ${escapeHtml(serverVersion)}.${escapeHtml(processId)} Restart from the launcher so instant playback code is actually live.</p>
      </div>
      <button class="tool-button" type="button" data-dismiss-runtime-notice>${icons.x}<span>Dismiss</span></button>
    </section>
  `;
}

async function dismissRecoveryNotice(id) {
  const noticeId = String(id || state.recoveryNotice?.id || "");
  state.recoveryNotice = null;
  if (state.settings) state.settings.recoveryNotice = null;
  renderGlobalOverlays();
  try {
    const payload = await api("/api/recovery-notice/ack", {
      method: "POST",
      body: JSON.stringify({ id: noticeId })
    });
    if (payload?.settings) {
      state.settings = payload.settings;
      state.recoveryNotice = payload.settings.recoveryNotice || null;
    }
  } catch (error) {
    showToast(error.message || "Could not dismiss recovery notice.");
  }
}

function openPlaylistAddDialog(trackIds = pendingPlaylistTrackIds()) {
  const selectedTrackIds = uniqueTrackIds(trackIds);
  state.playlistAddDialog = {
    open: true,
    trackIds: selectedTrackIds,
    status: selectedTrackIds.length ? "" : "Select songs or build a queue first.",
    duplicatePlaylistId: ""
  };
  renderGlobalOverlays();
}

function closePlaylistAddDialog() {
  state.playlistAddDialog = { open: false, trackIds: [], status: "", duplicatePlaylistId: "" };
  renderGlobalOverlays();
}

function openQueuePlaylistDialog() {
  const trackIds = state.queue.map((track) => track?.id).filter(Boolean).map(String);
  state.queuePlaylistDialog = {
    open: true,
    trackIds,
    status: trackIds.length ? "" : "Build a queue first."
  };
  renderGlobalOverlays();
  setTimeout(() => $('#queuePlaylistForm [name="queuePlaylistName"]')?.focus(), 0);
}

function closeQueuePlaylistDialog() {
  state.queuePlaylistDialog = { open: false, trackIds: [], status: "" };
  renderGlobalOverlays();
}

function resetContextMenuState() {
  return {
    open: false,
    x: 0,
    y: 0,
    trackId: "",
    trackIds: [],
    playlistId: "",
    queueIndex: -1
  };
}

function resetShuffleContextMenuState() {
  return {
    open: false,
    x: 0,
    y: 0,
    source: "",
    playlistId: ""
  };
}

function resetQueueContextMenuState() {
  return {
    open: false,
    x: 0,
    y: 0
  };
}

function closeContextMenu(render = true) {
  if (!state.contextMenu.open && !state.contextMenu.trackId) return;
  state.contextMenu = resetContextMenuState();
  if (render) renderGlobalOverlays();
}

function closeShuffleContextMenu(render = true) {
  if (!state.shuffleContextMenu.open) return;
  state.shuffleContextMenu = resetShuffleContextMenuState();
  if (render) renderGlobalOverlays();
}

function closeQueueContextMenu(render = true) {
  if (!state.queueContextMenu.open) return;
  state.queueContextMenu = resetQueueContextMenuState();
  if (render) renderGlobalOverlays();
}

function closeAllContextMenus(render = true) {
  const hadOpenMenu = state.contextMenu.open || state.shuffleContextMenu.open || state.queueContextMenu.open;
  state.contextMenu = resetContextMenuState();
  state.shuffleContextMenu = resetShuffleContextMenuState();
  state.queueContextMenu = resetQueueContextMenuState();
  if (render && hadOpenMenu) renderGlobalOverlays();
}

function hasOpenContextMenu() {
  return Boolean(state.contextMenu.open || state.shuffleContextMenu.open || state.queueContextMenu.open);
}

function closeTrackInfoDialog(render = true) {
  if (!state.trackInfoDialog.trackId && !state.trackInfoDialog.playlistId) return;
  state.trackInfoDialog = { trackId: "", playlistId: "" };
  if (render) renderGlobalOverlays();
}

function openTrackInfoDialog(trackId, playlistId = "") {
  const track = trackById(trackId);
  if (!track) return;
  state.trackInfoDialog = {
    trackId: track.id,
    playlistId: playlistById(playlistId) ? playlistId : ""
  };
  renderGlobalOverlays();
}

function contextMenuPosition(event, options = {}) {
  const margin = 8;
  const estimatedWidth = Number(options.width || 280);
  const estimatedHeight = Number(options.height || 340);
  return {
    x: Math.max(margin, Math.min(event.clientX, window.innerWidth - estimatedWidth - margin)),
    y: Math.max(margin, Math.min(event.clientY, window.innerHeight - estimatedHeight - margin))
  };
}

function trackContextFromTarget(target) {
  const row = target?.closest?.("[data-track-id]");
  if (row?.dataset.trackId) {
    return {
      trackId: row.dataset.trackId,
      playlistId: row.dataset.playlistId || "",
      queueIndex: -1
    };
  }

  const queueItem = target?.closest?.("[data-queue-index]");
  if (queueItem && !state.lyricsPanelOpen && !state.chordsPanelOpen) {
    const queueIndex = Number(queueItem.dataset.queueIndex);
    const track = state.queue[queueIndex];
    if (track) {
      return {
        trackId: track.id,
        playlistId: "",
        queueIndex
      };
    }
  }

  const playTarget = target?.closest?.("[data-play-track]");
  if (playTarget?.dataset.playTrack) {
    return {
      trackId: playTarget.dataset.playTrack,
      playlistId: playTarget.dataset.playlistId || playTarget.closest?.("[data-playlist-id]")?.dataset.playlistId || "",
      queueIndex: -1
    };
  }

  return null;
}

function trackIdsForContextTrack(trackId) {
  const track = trackById(trackId);
  if (!track) return [];
  const selected = selectedTrackIdsForAction();
  return selected.some((id) => trackById(id) === track) ? selected : [trackId];
}

function contextMenuActionTrackIds(menu = state.contextMenu) {
  const explicit = uniqueTrackIds(menu.trackIds).filter((id) => Boolean(trackById(id)));
  if (explicit.length) return explicit;
  return trackIdsForContextTrack(menu.trackId);
}

function openTrackContextMenu(event, context) {
  const track = trackById(context?.trackId);
  if (!track) return;
  const point = contextMenuPosition(event);
  state.shuffleContextMenu = resetShuffleContextMenuState();
  state.contextMenu = {
    open: true,
    x: point.x,
    y: point.y,
    trackId: track.id,
    trackIds: trackIdsForContextTrack(context.trackId || track.id),
    playlistId: playlistById(context.playlistId) ? context.playlistId : "",
    queueIndex: Number.isFinite(context.queueIndex) ? context.queueIndex : -1
  };
  renderGlobalOverlays();
}

function shuffleContextFromTarget(target) {
  const playlistTarget = target?.closest?.("[data-shuffle-menu-playlist]");
  if (playlistTarget?.dataset.shuffleMenuPlaylist) {
    return {
      source: "playlist",
      playlistId: playlistTarget.dataset.shuffleMenuPlaylist
    };
  }

  const shuffleButton = target?.closest?.("#shuffleButton, #shuffleAllButton, [data-now-playing-action=\"shuffle\"]");
  if (!shuffleButton) return null;

  if (shuffleButton.id === "shuffleAllButton") {
    const playlist = state.view === "playlists" && state.activePlaylistId ? activePlaylist() : null;
    return playlist?.id
      ? { source: "playlist", playlistId: playlist.id }
      : { source: "surface", playlistId: "" };
  }

  return { source: "controls", playlistId: "" };
}

function openShuffleContextMenu(event, context) {
  const itemCount = 1 + state.customShuffles.length;
  const point = contextMenuPosition(event, {
    width: 296,
    height: Math.min(440, 86 + itemCount * 40)
  });
  state.contextMenu = resetContextMenuState();
  state.shuffleContextMenu = {
    open: true,
    x: point.x,
    y: point.y,
    source: context?.source || "controls",
    playlistId: playlistById(context?.playlistId) ? context.playlistId : ""
  };
  renderGlobalOverlays();
}

function openQueueContextMenu(trigger) {
  const rect = trigger.getBoundingClientRect();
  const width = 272;
  const height = 172;
  const margin = 8;
  state.contextMenu = resetContextMenuState();
  state.shuffleContextMenu = resetShuffleContextMenuState();
  state.queueContextMenu = {
    open: true,
    x: Math.max(margin, Math.min(rect.right - width, window.innerWidth - width - margin)),
    y: Math.max(margin, Math.min(rect.bottom + 8, window.innerHeight - height - margin))
  };
  renderGlobalOverlays();
}

function shuffleContextSelectedProfileId(menu = state.shuffleContextMenu) {
  if (menu.source === "playlist") {
    return playlistById(menu.playlistId)?.defaultShuffleProfileId || "";
  }
  if (menu.source === "controls" && state.queueContext?.type === "playlist") {
    return state.queueContext.shuffleProfileId || "";
  }
  return state.activeShuffleProfileId || "";
}

function shuffleContextSubtitle(menu = state.shuffleContextMenu) {
  if (menu.source === "playlist") return playlistById(menu.playlistId)?.name || "Playlist";
  if (menu.source === "surface") return "Shuffle button";
  return currentTrack() ? "Current queue" : "Playback controls";
}

function shuffleProfileMenuLabel(profileId) {
  if (!profileId) return "Default Shuffle";
  return shuffleProfileById(profileId)?.name || "Custom shuffle unavailable";
}

function setSurfaceShuffleProfile(profileId) {
  const profile = profileId ? shuffleProfileById(profileId) : null;
  if (profileId && !profile) {
    showToast("That custom shuffle is unavailable.");
    renderGlobalOverlays();
    return;
  }
  state.activeShuffleProfileId = profile?.id || "";
  state.shuffle = true;
  schedulePlaybackSave();
  renderAll();
  showToast(`Shuffle button will use ${shuffleProfileMenuLabel(profile?.id || "")}.`);
}

async function setPlaylistShuffleProfile(playlistId, profileId) {
  const playlist = playlistById(playlistId);
  const profile = profileId ? shuffleProfileById(profileId) : null;
  if (!playlist) {
    showToast("Open a playlist first.");
    renderGlobalOverlays();
    return;
  }
  if (profileId && !profile) {
    showToast("That custom shuffle is unavailable.");
    renderGlobalOverlays();
    return;
  }

  await savePlaylistSettings(playlist.id, { defaultShuffleProfileId: profile?.id || "" });
  renderAll();
  showToast(`${playlist.name} will use ${shuffleProfileMenuLabel(profile?.id || "")}.`);
}

function playbackShuffleContextForProfile(profile) {
  if (state.queueContext?.type === "playlist" && state.queueContext.playlistId) {
    return playlistQueueContext(playlistById(state.queueContext.playlistId), profile?.id || "");
  }
  return profile ? shuffleQueueContext(profile) : { type: "", playlistId: "", shuffleProfileId: "", fadeSeconds: 0 };
}

function setPlaybackShuffleProfile(profileId) {
  const profile = profileId ? shuffleProfileById(profileId) : null;
  if (profileId && !profile) {
    showToast("That custom shuffle is unavailable.");
    renderGlobalOverlays();
    return;
  }

  state.activeShuffleProfileId = profile?.id || "";
  state.shuffle = true;
  const context = playbackShuffleContextForProfile(profile);

  if (state.queue.length) {
    const queue = buildSmartQueue(currentTrack()?.id || null, queueContextBuildOptions(context, { forceShuffle: true }));
    if (!queue.length) {
      schedulePlaybackSave();
      renderPlayer();
      renderGlobalOverlays();
      showToast("That shuffle method does not match any playable songs.");
      return;
    }
    setQueue(queue, 0, state.isPlaying, context);
  } else {
    schedulePlaybackSave();
    renderPlayer();
  }

  renderGlobalOverlays();
  showToast(`Shuffle is using ${shuffleProfileMenuLabel(profile?.id || "")}.`);
}

async function handleShuffleContextMenuProfile(profileId) {
  const context = { ...state.shuffleContextMenu };
  closeShuffleContextMenu(false);
  try {
    const selectedId = profileId && shuffleProfileById(profileId) ? profileId : "";
    if (context.source === "playlist") {
      await setPlaylistShuffleProfile(context.playlistId, selectedId);
    } else if (context.source === "controls") {
      setPlaybackShuffleProfile(selectedId);
    } else {
      setSurfaceShuffleProfile(selectedId);
    }
  } catch (error) {
    renderGlobalOverlays();
    showToast(error.message || "Could not change shuffle method.");
  }
}

function regenerateQueueShuffle() {
  if (!state.queue.length) {
    showToast("Build a queue first.");
    return;
  }
  state.shuffle = true;
  const context = state.queueContext?.type
    ? state.queueContext
    : shuffleQueueContext(activeShuffleProfile());
  const queue = buildSmartQueue(currentTrack()?.id || null, queueContextBuildOptions(context, { forceShuffle: true }));
  if (!queue.length) {
    schedulePlaybackSave();
    renderPlayer();
    renderGlobalOverlays();
    showToast("That shuffle did not match any playable songs.");
    return;
  }
  setQueue(queue, 0, state.isPlaying, context);
  renderGlobalOverlays();
  showToast("Queue regenerated.");
}

async function createPlaylistFromQueue(name) {
  const trackIds = state.queuePlaylistDialog.trackIds.map(String).filter(Boolean);
  const playlistName = cleanText(name);
  if (!trackIds.length) {
    state.queuePlaylistDialog.status = "Build a queue first.";
    renderGlobalOverlays();
    return;
  }
  if (!playlistName) {
    state.queuePlaylistDialog.status = "Enter a playlist name.";
    renderGlobalOverlays();
    return;
  }
  const duplicatePlaylist = playlistByName(playlistName);
  if (duplicatePlaylist) {
    state.queuePlaylistDialog.status = `A playlist named "${duplicatePlaylist.name}" already exists. Choose a new name.`;
    renderGlobalOverlays();
    return;
  }

  const playlist = await api("/api/playlists", {
    method: "POST",
    body: JSON.stringify({ name: playlistName, trackIds })
  });
  state.playlists.unshift(playlist);
  markPlaylistsChanged();
  closeQueuePlaylistDialog();
  renderAll();
  showToast(`Created ${playlist.name} with ${trackIds.length} song${trackIds.length === 1 ? "" : "s"}.`);
}

function handleQueueContextMenuAction(action) {
  closeQueueContextMenu(false);
  if (action === "create-playlist") {
    openQueuePlaylistDialog();
    return;
  }
  if (action === "regenerate") {
    regenerateQueueShuffle();
    return;
  }
  if (action === "clear") {
    setQueue([], -1, false);
    renderGlobalOverlays();
    return;
  }
  renderGlobalOverlays();
}

function contextMenuCountLabel(trackIds = state.contextMenu.trackIds) {
  const count = uniqueTrackIds(trackIds).length;
  return count === 1 ? "song" : `${count} songs`;
}

function queueableTracksForIds(trackIds) {
  return uniqueTrackIds(trackIds)
    .map(trackById)
    .filter(Boolean)
    .filter((track) => !unsupportedPlaybackReason(track));
}

function addTrackIdsToQueue(trackIds, placement) {
  const uniqueIds = uniqueTrackIds(trackIds);
  const tracks = queueableTracksForIds(uniqueIds);
  const skipped = Math.max(0, uniqueIds.length - tracks.length);
  if (!tracks.length) {
    showToast(skipped ? "Those songs cannot be queued in this browser." : "No songs to queue.");
    return;
  }

  if (!state.queue.length || state.currentIndex < 0) {
    setQueue(tracks, 0, false, state.queueContext);
  } else {
    const insertIndex = placement === "next"
      ? Math.min(state.queue.length, state.currentIndex + 1)
      : state.queue.length;
    state.queue = state.queue.slice(0, insertIndex).concat(tracks, state.queue.slice(insertIndex));
    renderPlaybackSurfaces({ queueChanged: true });
    schedulePlaybackSave();
    warmUpcomingStreams();
  }

  const target = tracks.length === 1 ? tracks[0].title : `${tracks.length} songs`;
  const base = placement === "next" ? `Queued ${target} next.` : `Added ${target} to queue.`;
  showToast(skipped ? `${base} ${skipped} unsupported song${skipped === 1 ? "" : "s"} skipped.` : base);
}

function removeQueueItemAt(queueIndex) {
  const index = Number(queueIndex);
  if (!Number.isInteger(index) || index < 0 || index >= state.queue.length) {
    showToast("That queue item is no longer available.");
    return;
  }

  const removedTrack = state.queue[index];
  const previousTrackId = currentTrack()?.id || "";
  const nextQueue = state.queue.slice(0, index).concat(state.queue.slice(index + 1));
  let nextIndex = -1;
  if (nextQueue.length) {
    if (state.currentIndex < 0) nextIndex = 0;
    else if (index < state.currentIndex) nextIndex = state.currentIndex - 1;
    else if (index === state.currentIndex) nextIndex = Math.min(index, nextQueue.length - 1);
    else nextIndex = Math.min(state.currentIndex, nextQueue.length - 1);
  }

  const keepsCurrentTrack = Boolean(previousTrackId && nextQueue[nextIndex]?.id === previousTrackId);
  setQueue(nextQueue, nextIndex, nextQueue.length ? state.isPlaying : false, nextQueue.length ? state.queueContext : null);
  if (keepsCurrentTrack) warmUpcomingStreams();
  showToast(`${removedTrack?.title || "Song"} removed from queue.`);
}

async function removeTrackIdsFromPlaylist(playlistId, trackIds) {
  const playlist = playlistById(playlistId);
  if (!playlist) {
    showToast("Open a playlist first.");
    return;
  }
  const removing = new Set(uniqueTrackIds(trackIds).filter((id) => playlist.trackIds.includes(id)));
  if (!removing.size) {
    showToast("No playlist songs selected to remove.");
    return;
  }
  await savePlaylistTrackIds(playlist.id, playlist.trackIds.filter((id) => !removing.has(id)));
  removing.forEach((id) => state.selectedIds.delete(id));
  state.selectionAnchorId = "";
  markSelectionChanged();
  renderAll();
  showToast(`${removing.size} song${removing.size === 1 ? "" : "s"} removed from ${playlist.name}.`);
}

async function blacklistTrackIds(trackIds) {
  const tracks = uniqueTrackIds(trackIds).map(trackById).filter(Boolean);
  if (!tracks.length) {
    showToast("No songs selected to block.");
    return;
  }

  let added = 0;
  let alreadyBlocked = 0;
  let changed = false;
  for (const track of tracks) {
    if (isBlocked(track)) {
      alreadyBlocked += 1;
      continue;
    }
    const rule = await api("/api/blacklist", {
      method: "POST",
      body: JSON.stringify({ targetType: "track", targetId: track.id, targetName: track.title })
    });
    const appended = appendBlacklistRule(rule);
    if (appended) changed = true;
    if (rule.alreadyExists || !appended) {
      alreadyBlocked += 1;
    } else {
      added += 1;
    }
  }

  if (changed) markBlacklistChanged();
  if (!added) {
    showToast(tracks.length === 1 ? "That song is already blocked." : "Those songs are already blocked.");
    if (changed) renderAll();
    return;
  }
  renderAll();
  showToast(`${added} song${added === 1 ? "" : "s"} added to blocked music.${alreadyBlocked ? ` ${alreadyBlocked} already blocked.` : ""}`);
}

async function handleTrackContextMenuAction(action) {
  const context = { ...state.contextMenu, trackIds: contextMenuActionTrackIds() };
  closeContextMenu(false);
  try {
    if (action === "add-playlist") {
      openPlaylistAddDialog(context.trackIds);
    } else if (action === "remove-playlist") {
      await removeTrackIdsFromPlaylist(context.playlistId, context.trackIds);
    } else if (action === "remove-queue") {
      removeQueueItemAt(context.queueIndex);
    } else if (action === "blacklist") {
      await blacklistTrackIds(context.trackIds);
    } else if (action === "block-artist") {
      await addBlock("artist", context.trackId);
    } else if (action === "play-next") {
      addTrackIdsToQueue(context.trackIds, "next");
    } else if (action === "add-queue") {
      addTrackIdsToQueue(context.trackIds, "end");
    } else if (action === "track-info") {
      openTrackInfoDialog(context.trackId, context.playlistId);
    } else {
      renderGlobalOverlays();
    }
  } catch (error) {
    renderGlobalOverlays();
    showToast(error.message || "Could not complete that action.");
  }
}

function formatInfoDate(value, fallback = "Never") {
  const time = dateValue(value);
  if (!time) return fallback;
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(time));
}

function formatInfoDateOnly(value, fallback = "Unknown") {
  const text = cleanText(value);
  if (/^\d{4}-\d{2}-\d{2}/.test(text)) return text.slice(0, 10);
  if (/^\d{4}$/.test(text)) return text;
  const time = dateValue(value);
  if (!time) return fallback;
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(time));
}

function formatListenTime(ms) {
  const totalSeconds = Math.max(0, Math.round(Number(ms || 0) / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours) return `${hours}h ${minutes}m`;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function infoValue(value, fallback = "Unknown") {
  if (Array.isArray(value)) return value.map(cleanText).filter(Boolean).join(", ") || fallback;
  const text = cleanText(value);
  return text || fallback;
}

function trackInfoRow(label, value) {
  return `
    <div class="track-info-row">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </div>
  `;
}

function trackInfoStat(label, value) {
  return `
    <div class="track-info-stat">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </div>
  `;
}

function trackInfoStoredData(track, playlist = null) {
  return {
    app: {
      playCount: playCountFor(track),
      skipCount: skipCountFor(track),
      totalListenMs: totalListenMsFor(track),
      lastPlayedAt: lastPlayedFor(track),
      playlists: playlistNamesForTrack(track),
      blocked: isBlocked(track),
      currentPlaylistId: playlist?.id || "",
      currentPlaylistName: playlist?.name || "",
      playlistTrackTrim: playlist ? playlistTrackTrim(playlist, track.id, track) : null,
      lyricsStatus: lyricsForTrack(track)?.status || "",
      chordsStatus: chordsForTrack(track)?.status || ""
    },
    track
  };
}

function trackContextMenuHtml() {
  if (!state.contextMenu.open) return "";
  const track = trackById(state.contextMenu.trackId);
  if (!track) return "";
  const trackIds = contextMenuActionTrackIds();
  const count = trackIds.length || 1;
  const selectedLabel = count === 1 ? track.title : `${count} selected songs`;
  const playlist = playlistById(state.contextMenu.playlistId);
  const canRemove = Boolean(playlist && playlist.trackIds.includes(track.id));
  const canRemoveFromQueue = Number.isInteger(state.contextMenu.queueIndex)
    && state.contextMenu.queueIndex >= 0
    && state.contextMenu.queueIndex < state.queue.length
    && state.queue[state.contextMenu.queueIndex]?.id === track.id;
  const queueDisabled = queueableTracksForIds(trackIds).length ? "" : "disabled";
  const style = `--context-x: ${Number(state.contextMenu.x || 0)}px; --context-y: ${Number(state.contextMenu.y || 0)}px`;
  return `
    <div class="app-context-menu-shield" data-close-context-menu></div>
    <div class="app-context-menu" role="menu" aria-label="Song options" style="${style}">
      <div class="app-context-menu-head">
        <div class="song-art context-menu-art" style="${artStyle(track)}"></div>
        <div>
          <strong>${escapeHtml(selectedLabel)}</strong>
          <span>${escapeHtml(count === 1 ? track.artist || "Unknown Artist" : contextMenuCountLabel(trackIds))}</span>
        </div>
      </div>
      <button type="button" role="menuitem" data-context-action="add-playlist">${icons.plus}<span>Add to Playlist</span></button>
      ${canRemove ? `<button type="button" role="menuitem" data-context-action="remove-playlist">${icons.trash}<span>${count === 1 ? "Remove from Playlist" : `Remove ${count} from Playlist`}</span></button>` : ""}
      ${canRemoveFromQueue ? `<button type="button" role="menuitem" data-context-action="remove-queue">${icons.trash}<span>Remove from Queue</span></button>` : ""}
      <div class="app-context-menu-separator" role="separator"></div>
      <button type="button" role="menuitem" data-context-action="play-next" ${queueDisabled}>${icons.next}<span>${count === 1 ? "Play Next" : "Play Selected Next"}</span></button>
      <button type="button" role="menuitem" data-context-action="add-queue" ${queueDisabled}>${icons.list}<span>Add to Queue</span></button>
      <button type="button" role="menuitem" data-context-action="blacklist">${icons.ban}<span>${count === 1 ? "Block Track" : "Block Selected Tracks"}</span></button>
      ${count === 1 ? `<button type="button" role="menuitem" data-context-action="block-artist">${icons.x}<span>Block Artist</span></button>` : ""}
      <div class="app-context-menu-separator" role="separator"></div>
      <button type="button" role="menuitem" data-context-action="track-info">${icons.more}<span>Track Info</span></button>
    </div>
  `;
}

function shuffleContextMenuButtonHtml(profileId, label, selected) {
  return `
    <button type="button" role="menuitemradio" aria-checked="${selected ? "true" : "false"}" ${selected ? 'class="selected"' : ""} data-shuffle-menu-profile="${escapeHtml(profileId)}">
      ${icons.shuffle}
      <span>${escapeHtml(label)}</span>
    </button>
  `;
}

function shuffleContextMenuHtml() {
  if (!state.shuffleContextMenu.open) return "";
  const selectedId = shuffleContextSelectedProfileId();
  const style = `--context-x: ${Number(state.shuffleContextMenu.x || 0)}px; --context-y: ${Number(state.shuffleContextMenu.y || 0)}px`;
  const profileButtons = state.customShuffles.map((profile) => (
    shuffleContextMenuButtonHtml(profile.id, profile.name || "Custom Shuffle", selectedId === profile.id)
  )).join("");
  return `
    <div class="app-context-menu-shield" data-close-context-menu></div>
    <div class="app-context-menu shuffle-context-menu" role="menu" aria-label="Shuffle methods" style="${style}">
      <div class="app-context-menu-head shuffle-context-menu-head">
        ${icons.shuffle}
        <div>
          <strong>Shuffle Method</strong>
          <span>${escapeHtml(shuffleContextSubtitle())}</span>
        </div>
      </div>
      ${shuffleContextMenuButtonHtml("", "Default Shuffle", !selectedId)}
      ${profileButtons ? '<div class="app-context-menu-separator" role="separator"></div>' : ""}
      ${profileButtons}
    </div>
  `;
}

function queueContextMenuHtml() {
  if (!state.queueContextMenu.open) return "";
  const disabled = state.queue.length ? "" : "disabled";
  const style = `--context-x: ${Number(state.queueContextMenu.x || 0)}px; --context-y: ${Number(state.queueContextMenu.y || 0)}px`;
  return `
    <div class="app-context-menu-shield" data-close-context-menu></div>
    <div class="app-context-menu queue-context-menu" role="menu" aria-label="Queue options" style="${style}">
      <div class="app-context-menu-head shuffle-context-menu-head">
        ${icons.more}
        <div>
          <strong>Queue</strong>
          <span>${state.queue.length} song${state.queue.length === 1 ? "" : "s"}</span>
        </div>
      </div>
      <button type="button" role="menuitem" data-queue-menu-action="create-playlist" ${disabled}>${icons.plus}<span>Create playlist from queue</span></button>
      <button type="button" role="menuitem" data-queue-menu-action="regenerate" ${disabled}>${icons.shuffle}<span>Regenerate Shuffle</span></button>
      <button type="button" role="menuitem" data-queue-menu-action="clear" ${disabled}>${icons.trash}<span>Clear Queue</span></button>
    </div>
  `;
}

function trackInfoDialogHtml() {
  const track = trackById(state.trackInfoDialog.trackId);
  if (!track) return "";
  const playlist = playlistById(state.trackInfoDialog.playlistId);
  const storedJson = JSON.stringify(trackInfoStoredData(track, playlist), null, 2);
  const details = [
    ["Artist", infoValue(track.artist)],
    ["Album", infoValue(track.album)],
    ["Album Artist", infoValue(albumArtistFor(track))],
    ["Duration", msToTime(durationForTrack(track))],
    ["Source", infoValue(sourceFor(track))],
    ["File Type", infoValue(fileTypeFor(track) || track.audioCodec)],
    ["Audio Quality", infoValue(audioQualityFor(track))],
    ["Rating", ratingFor(track) ? `${ratingFor(track)}/10` : "Unrated"],
    ["Date Added", formatInfoDateOnly(dateAddedFor(track))],
    ["Release Date", formatInfoDateOnly(releaseDateFor(track))],
    ["BPM", track.bpm ? String(track.bpm) : "Unknown"],
    ["Track Number", track.trackNumber ? String(track.trackNumber) : "Unknown"],
    ["Disc Number", track.discNumber ? String(track.discNumber) : "Unknown"],
    ["Genres", infoValue(track.genres, "None")],
    ["Moods", infoValue(track.moods, "None")],
    ["Tags", infoValue(track.tags, "None")],
    ["Playlists", infoValue(playlistNamesForTrack(track), "None")],
    ["Blocked", isBlocked(track) ? "Yes" : "No"],
    ["MusicBrainz Recording", infoValue(track.mbRecordingId || track.musicBrainzRecordingId)],
    ["MusicBrainz Artists", infoValue(track.mbArtistIds, "None")]
  ];
  return `
    <div class="playlist-window-backdrop track-info-backdrop" data-close-track-info>
      <section class="playlist-window track-info-window" role="dialog" aria-modal="true" aria-labelledby="trackInfoTitle">
        <div class="playlist-settings-form">
          <header class="playlist-window-head">
            <div>
              <div class="section-title">Track Info</div>
              <h2 id="trackInfoTitle">${escapeHtml(track.title || "Track")}</h2>
            </div>
            <button class="icon-button" type="button" title="Close" data-close-track-info>${icons.x}</button>
          </header>

          <div class="track-editor-summary">
            <div class="song-art track-editor-art" style="${artStyle(track)}"></div>
            <div>
              <div class="song-title">${escapeHtml(track.title || "Unknown Title")}</div>
              <div class="muted-text">${escapeHtml(track.artist || "Unknown Artist")} / ${escapeHtml(track.album || "Unknown Album")}</div>
            </div>
          </div>

          <div class="track-info-stats">
            ${trackInfoStat("Plays", playCountFor(track).toLocaleString())}
            ${trackInfoStat("Skips", skipCountFor(track).toLocaleString())}
            ${trackInfoStat("Listened", formatListenTime(totalListenMsFor(track)))}
            ${trackInfoStat("Last Played", formatInfoDate(lastPlayedFor(track)))}
          </div>

          <div class="track-info-grid">
            ${details.map(([label, value]) => trackInfoRow(label, value)).join("")}
          </div>

          <details class="track-data-details" open>
            <summary>Saved App Metadata</summary>
            <pre class="track-data-json">${escapeHtml(storedJson)}</pre>
          </details>

          <footer class="playlist-window-actions">
            <button class="tool-button" type="button" data-close-track-info>${icons.x}<span>Close</span></button>
          </footer>
        </div>
      </section>
    </div>
  `;
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(String(reader.result || "")));
    reader.addEventListener("error", () => reject(reader.error || new Error("Could not read image.")));
    reader.readAsDataURL(file);
  });
}

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(String(reader.result || "")));
    reader.addEventListener("error", () => reject(reader.error || new Error("Could not read file.")));
    reader.readAsText(file);
  });
}

function preserveCurrentPlaybackAfterQueueUpdate(track, currentTime) {
  if (!track) return false;
  if (unsupportedPlaybackReason(track)) return false;
  if (canStreamTrack(track) && !audio.src) return false;

  state.currentTime = clampToPlaybackWindow(track, currentTime);
  if (state.playbackSession?.trackId !== track.id) startPlaybackSession(track);

  if (state.isPlaying) {
    if (canStreamTrack(track)) {
      if (audio.paused) {
        audio.play()
          .then(finishAudioTransition)
          .catch((error) => handleAudioPlayFailure(track, error));
      } else {
        finishAudioTransition();
      }
    } else if (!state.fakeTimer) {
      startFakePlayback(track);
    }
  } else {
    clearFakeTimer();
    if (audio.src && !audio.paused) audio.pause();
    finishAudioTransition();
  }

  renderPlaybackSurfaces({ queueChanged: true });
  return true;
}

function setQueue(queue, startIndex = 0, autoplay = true, context = null) {
  const previousTrack = currentTrack();
  const previousTime = playbackPositionMs();
  const nextQueue = queue.filter(Boolean);
  const nextIndex = nextQueue.length ? Math.min(Math.max(0, startIndex), nextQueue.length - 1) : -1;
  const nextTrack = nextQueue[nextIndex] || null;
  const sameCurrentTrack = Boolean(previousTrack?.id && previousTrack.id === nextTrack?.id);

  if (!sameCurrentTrack) maybeRecordSkipCurrent();

  state.queue = nextQueue;
  state.currentIndex = nextIndex;
  state.isPlaying = Boolean(state.queue.length && autoplay);
  if (state.isPlaying) resumeEqAudioContext();
  state.queueContext = normalizedQueueContext(context);
  applyPlaylistDefaultEqForContext(state.queueContext, { save: false, render: false });

  if (sameCurrentTrack && preserveCurrentPlaybackAfterQueueUpdate(nextTrack, previousTime)) {
    schedulePlaybackSave();
    return;
  }

  loadCurrentTrack({ queueChanged: true, preserveTime: sameCurrentTrack && previousTime > 0, currentTime: sameCurrentTrack ? previousTime : 0 });
  schedulePlaybackSave();
}

function normalizedQueueContext(context = null) {
  return context
    ? { ...context, fadeSeconds: normalizeFadeSeconds(context.fadeSeconds) }
    : { type: "", playlistId: "", shuffleProfileId: "", fadeSeconds: 0 };
}

function canStartSoftFade(shouldAutoplay) {
  return Boolean(
    state.softSkip
    && shouldAutoplay
    && state.isPlaying
    && !reversePlaybackRequested()
    && audio.src
    && !audio.paused
    && !state.audioTransitioning
  );
}

function completeSoftFadeQueueCommit(nextQueue, nextIndex, nextContext, nextTrack) {
  state.queue = nextQueue;
  state.currentIndex = nextIndex;
  state.isPlaying = true;
  state.queueContext = normalizedQueueContext(nextContext);
  state.currentTime = playbackWindowForTrack(nextTrack).startMs;
  if (state.abLoop.trackId && state.abLoop.trackId !== nextTrack.id) {
    state.abLoop.active = false;
    state.abLoopEditingId = "";
  }
  closeAbLoopPadAssignmentMenu();
  closeAbLoopSavedLoopMenu();
  pruneAbLoopQueueForCurrentTrack();
  applyPlaylistDefaultEqForContext(state.queueContext, { save: false, render: false });
  startPlaybackSession(nextTrack);
  renderPlaybackSurfaces({ queueChanged: true });
  schedulePlaybackSave();
  scheduleTrackCompanionLoads(nextTrack);
}

async function runSoftFadeToQueue(nextQueue, nextIndex, shouldAutoplay, nextContext, options = {}) {
  const oldTrack = currentTrack();
  const nextTrack = nextQueue[nextIndex];
  if (!oldTrack || !nextTrack || oldTrack.id === nextTrack.id) return false;
  if (!canStartSoftFade(shouldAutoplay) || !canStreamTrack(oldTrack) || !canStreamTrack(nextTrack)) return false;

  const oldAudio = audio;
  const durationSeconds = crossfadeDurationSeconds(oldTrack, oldAudio, SOFT_SKIP_FADE_SECONDS);
  const token = state.crossfadeToken + 1;
  state.crossfadeToken = token;
  state.audioTransitioning = true;
  maybeRecordSkipCurrent();
  resumeEqAudioContext();
  playbackTrace("soft-choice-fade-start", {
    fromIndex: state.currentIndex,
    toIndex: nextIndex,
    fromTrackId: oldTrack.id,
    toTrackId: nextTrack.id,
    reason: options.reason || "song-choice"
  });

  const newAudio = prepareCrossfadeAudio(nextTrack, token, "soft-choice-load", {
    nextContext
  });

  try {
    await playAudioWithTimeout(newAudio, options.startTimeoutMs || PLAYBACK_START_GUARD_MS);
  } catch (error) {
    if (token === state.crossfadeToken) {
      playbackTrace("soft-choice-fade-start-failed", {
        trackId: nextTrack.id,
        error: error?.message || String(error || "")
      });
      resetAudioElement(newAudio);
      oldAudio.volume = state.volume;
      finishAudioTransition();
      setQueue(nextQueue, nextIndex, shouldAutoplay, nextContext);
    }
    return false;
  }

  if (token !== state.crossfadeToken) {
    resetAudioElement(newAudio);
    return false;
  }

  audio = newAudio;
  completeSoftFadeQueueCommit(nextQueue, nextIndex, nextContext, nextTrack);

  startCrossfadeVolumeTimer(token, oldAudio, newAudio, durationSeconds);
  return true;
}

function setQueueWithSoftFade(queue, startIndex = 0, autoplay = true, context = null, options = {}) {
  const nextQueue = queue.filter(Boolean);
  const nextIndex = nextQueue.length ? Math.min(Math.max(0, startIndex), nextQueue.length - 1) : -1;
  const shouldAutoplay = Boolean(nextQueue.length && autoplay);
  const current = currentTrack();
  const next = nextQueue[nextIndex] || null;

  if (state.crossfadeTimer && state.softSkip && shouldAutoplay && state.isPlaying && audio.src && !audio.paused) {
    clearCrossfade();
  }

  if (!current || !next || current.id === next.id || !canStartSoftFade(shouldAutoplay) || !canStreamTrack(current) || !canStreamTrack(next)) {
    setQueue(nextQueue, nextIndex, autoplay, context);
    return false;
  }

  runSoftFadeToQueue(nextQueue, nextIndex, shouldAutoplay, context, options)
    .then((started) => {
      if (!started && currentTrack()?.id === current.id) {
        setQueue(nextQueue, nextIndex, shouldAutoplay, context);
      }
    })
    .catch((error) => {
      playbackTrace("soft-choice-fade-error", {
        trackId: next.id,
        error: error?.message || String(error || "")
      });
      if (currentTrack()?.id === current.id) {
        setQueue(nextQueue, nextIndex, shouldAutoplay, context);
      }
    });
  return true;
}

function currentTrack() {
  return state.queue[state.currentIndex] || null;
}

function currentTrackSavedAbLoops() {
  const trackId = currentTrack()?.id || "";
  return state.savedAbLoops.filter((loop) => loop.trackId === trackId);
}

function currentTrackQueuedAbLoopIds() {
  return currentTrackQueuedAbLoopEntries().map((entry) => entry.loopId);
}

function currentTrackQueuedAbLoopEntries() {
  const validIds = new Set(currentTrackSavedAbLoops().map((loop) => loop.id));
  return state.abLoopQueueIds
    .map(normalizeQueuedAbLoopEntry)
    .filter((entry) => entry && validIds.has(entry.loopId));
}

function currentTrackQueuedAbLoops() {
  const loopsById = new Map(currentTrackSavedAbLoops().map((loop) => [loop.id, loop]));
  return currentTrackQueuedAbLoopEntries()
    .map((entry) => ({ loop: loopsById.get(entry.loopId), plays: entry.plays }))
    .filter((item) => item.loop)
    .map((item) => ({ ...item.loop, queuedPlays: item.plays }))
    .filter(Boolean);
}

function pruneAbLoopQueueForCurrentTrack() {
  const nextEntries = currentTrackQueuedAbLoopEntries();
  if (nextEntries.length !== state.abLoopQueueIds.length) {
    state.abLoopQueueIds = nextEntries;
  }
  return nextEntries;
}

function queuedAbLoopCount(loopId) {
  return currentTrackQueuedAbLoopEntries().filter((entry) => entry.loopId === loopId).length;
}

function currentTrackAbLoopPadLayout() {
  const trackId = currentTrack()?.id || "";
  const layout = trackId ? state.abLoopPadLayouts[trackId] : null;
  return Array.from({ length: 10 }, (_, index) => normalizeAbLoopPad(layout?.[index]));
}

function savedAbLoopById(loopId) {
  return state.savedAbLoops.find((loop) => loop.id === loopId) || null;
}

function savedAbLoopForPad(padIndex) {
  const track = currentTrack();
  const loopId = currentTrackAbLoopPadLayout()[padIndex]?.loopId || "";
  const loop = savedAbLoopById(loopId);
  return loop && track && loop.trackId === track.id ? loop : null;
}

function abLoopEditingLoop(loop = state.abLoop) {
  const track = currentTrack();
  const saved = savedAbLoopById(state.abLoopEditingId);
  if (!track || !saved || saved.trackId !== track.id) return null;
  if (loop.trackId && loop.trackId !== saved.trackId) return null;
  if (loop.id && loop.id !== saved.id) return null;
  return saved;
}

function preserveOrClearAbLoopEditIdentity(loop) {
  const editing = abLoopEditingLoop(loop);
  if (editing) {
    loop.id = editing.id;
    loop.name = loop.name || editing.name || "";
    return true;
  }
  loop.id = "";
  loop.name = "";
  state.abLoopEditingId = "";
  return false;
}

function closeAbLoopPadAssignmentMenu() {
  state.abLoopPadAssignmentMenu = { open: false, padIndex: -1, x: 0, y: 0 };
}

function closeAbLoopSavedLoopMenu() {
  state.abLoopSavedLoopMenu = { open: false, loopId: "", x: 0, y: 0 };
}

function closeAbLoopAdvancedMarkerMenu() {
  if (!state.abLoopAdvanced) return;
  state.abLoopAdvanced.markerMenu = { open: false, x: 0, y: 0 };
}

function collapseAbLoopLauncher() {
  state.abLoopLauncherOpen = false;
  closeAbLoopPadAssignmentMenu();
  closeAbLoopSavedLoopMenu();
  closeAbLoopAdvancedMarkerMenu();
  saveAdvancedPlaybackSettings();
  renderAdvancedPlaybackPanel();
}

function openAbLoopPadAssignmentMenu(event, padIndex) {
  event.preventDefault();
  event.stopPropagation();
  if (!state.abLoopPowerEnabled) return;
  closeAbLoopSavedLoopMenu();
  state.abLoopPadAssignmentMenu = {
    open: true,
    padIndex,
    x: Math.max(8, Math.min(window.innerWidth - 220, event.clientX || 8)),
    y: Math.max(8, Math.min(window.innerHeight - 260, event.clientY || 8))
  };
  renderAdvancedPlaybackPanel();
}

function openAbLoopSavedLoopMenu(event, loopId) {
  const loop = savedAbLoopById(loopId);
  const track = currentTrack();
  if (!loop || !track || loop.trackId !== track.id) return;
  event.preventDefault();
  event.stopPropagation();
  closeAbLoopPadAssignmentMenu();
  state.abLoopSavedLoopMenu = {
    open: true,
    loopId,
    x: Math.max(8, Math.min(window.innerWidth - 220, event.clientX || 8)),
    y: Math.max(8, Math.min(window.innerHeight - 180, event.clientY || 8))
  };
  renderAdvancedPlaybackPanel();
}

function removeLoopFromPadLayouts(loopId) {
  const nextLayouts = {};
  for (const [trackId, layout] of Object.entries(state.abLoopPadLayouts)) {
    const pads = Array.from({ length: 10 }, (_, index) => {
      const pad = normalizeAbLoopPad(layout?.[index]);
      return pad.loopId === loopId ? { loopId: "", plays: pad.plays } : pad;
    });
    if (pads.some((pad) => pad.loopId || normalizeLoopPlayCount(pad.plays) !== 1)) nextLayouts[trackId] = pads;
  }
  state.abLoopPadLayouts = nextLayouts;
}

async function deleteSavedAbLoop(loopId) {
  const loop = savedAbLoopById(loopId);
  if (!loop) return;
  state.savedAbLoops = state.savedAbLoops.filter((item) => item.id !== loopId);
  state.abLoopQueueIds = state.abLoopQueueIds
    .map(normalizeQueuedAbLoopEntry)
    .filter((entry) => entry && entry.loopId !== loopId);
  removeLoopFromPadLayouts(loopId);
  if (state.abLoop.id === loopId) {
    state.abLoop = normalizeAbLoop({ ...state.abLoop, id: "", name: "" });
  }
  if (state.abLoopEditingId === loopId) state.abLoopEditingId = "";
  closeAbLoopSavedLoopMenu();
  closeAbLoopPadAssignmentMenu();
  saveAdvancedPlaybackSettings();
  await persistSavedAbLoops();
  renderProgress();
  renderAdvancedPlaybackPanel();
  showToast(`Deleted ${loop.name || "saved loop"}.`);
}

async function assignAbLoopPad(padIndex, loopId) {
  const track = currentTrack();
  if (!track || padIndex < 0 || padIndex >= 10) return;
  const layout = currentTrackAbLoopPadLayout();
  const loop = loopId ? savedAbLoopById(loopId) : null;
  const currentPad = normalizeAbLoopPad(layout[padIndex]);
  layout[padIndex] = loop && loop.trackId === track.id
    ? { loopId: loop.id, plays: currentPad.plays }
    : { loopId: "", plays: currentPad.plays };
  state.abLoopPadLayouts = {
    ...state.abLoopPadLayouts,
    [track.id]: layout
  };
  if (!layout.some((pad) => pad.loopId || normalizeLoopPlayCount(pad.plays) !== 1)) delete state.abLoopPadLayouts[track.id];
  closeAbLoopPadAssignmentMenu();
  renderAdvancedPlaybackPanel();
  await persistAbLoopPadLayouts();
  renderAdvancedPlaybackPanel();
}

async function setAbLoopPadPlays(padIndex, plays) {
  const track = currentTrack();
  if (!track || padIndex < 0 || padIndex >= 10) return;
  const layout = currentTrackAbLoopPadLayout();
  const pad = normalizeAbLoopPad(layout[padIndex]);
  layout[padIndex] = { ...pad, plays: normalizeLoopPlayCount(plays) };
  state.abLoopPadLayouts = {
    ...state.abLoopPadLayouts,
    [track.id]: layout
  };
  if (!layout.some((item) => item.loopId || normalizeLoopPlayCount(item.plays) !== 1)) delete state.abLoopPadLayouts[track.id];
  renderAdvancedPlaybackPanel();
  await persistAbLoopPadLayouts();
  renderAdvancedPlaybackPanel();
}

function launchAbLoopPad(padIndex) {
  if (!state.abLoopPowerEnabled) {
    showToast("Turn on A-B Loop power to use pads.");
    return;
  }
  const loop = savedAbLoopForPad(padIndex);
  const pad = currentTrackAbLoopPadLayout()[padIndex] || { plays: 1 };
  if (!loop) {
    showToast("Right-click a pad to assign a saved loop.");
    return;
  }
  if (state.abLoopQueueEnabled && abLoopEnabled()) queueSavedAbLoop(loop.id, pad.plays);
  else loadSavedAbLoop(loop.id, pad.plays);
}

function setActiveAbLoop(loop, plays = 1, options = {}) {
  state.abLoop = normalizeAbLoop({ ...loop, active: state.abLoopPowerEnabled });
  state.abLoopEditingId = options.editing ? state.abLoop.id : "";
  state.abLoopPlayCount = normalizeLoopPlayCount(plays);
  state.abLoopPlayRemaining = state.abLoopPlayCount;
}

function editSavedAbLoop(loopId) {
  if (!state.abLoopPowerEnabled) {
    showToast("Turn on A-B Loop power to edit loops.");
    return;
  }
  const loop = savedAbLoopById(loopId);
  const track = currentTrack();
  if (!loop || !track || loop.trackId !== track.id) return;
  setActiveAbLoop(loop, state.abLoopPlayCount, { editing: true });
  state.advancedPlaybackOpen = true;
  state.abLoopMenuOpen = false;
  closeAbLoopSavedLoopMenu();
  closeAbLoopPadAssignmentMenu();
  const target = clampToPlaybackWindow(track, reversePlaybackRequested() ? loop.bMs : loop.aMs);
  seekPlaybackToMs(target, { render: false });
  saveAdvancedPlaybackSettings();
  renderProgress();
  renderAdvancedPlaybackPanel();
  showToast(`Editing ${loop.name || "saved loop"}. Adjust times, then Save to overwrite.`);
}

function resetActiveAbLoopPlayCount() {
  state.abLoopPlayCount = 1;
  state.abLoopPlayRemaining = 1;
}

function consumeAbLoopPlayCount() {
  state.abLoopPlayCount = normalizeLoopPlayCount(state.abLoopPlayCount);
  state.abLoopPlayRemaining = normalizeLoopPlayCount(state.abLoopPlayRemaining || state.abLoopPlayCount);
  if (state.abLoopPlayRemaining <= 1) return false;
  state.abLoopPlayRemaining -= 1;
  return true;
}

function resetAbLoopBoundaryPlayCount() {
  state.abLoopPlayRemaining = normalizeLoopPlayCount(state.abLoopPlayCount);
}

function abLoopReady(loop = state.abLoop) {
  const track = currentTrack();
  return Boolean(
    track
    && loop.trackId === track.id
    && loop.bMs - loop.aMs >= AB_LOOP_MIN_MS
  );
}

function abLoopEnabled(loop = state.abLoop) {
  return Boolean(state.abLoopPowerEnabled && abLoopReady(loop));
}

function abLoopHasCurrentPoints(loop = state.abLoop) {
  const track = currentTrack();
  return Boolean(track && loop.trackId === track.id && (loop.aMs > 0 || loop.bMs > 0));
}

function abLoopControlsEnabled() {
  return Boolean(state.abLoopPowerEnabled && currentTrack());
}

function savedAbLoopMatchesCurrent(loop = state.abLoop) {
  if (!loop.id) return false;
  const saved = state.savedAbLoops.find((item) => item.id === loop.id && item.trackId === loop.trackId);
  if (!saved) return false;
  return preciseMs(saved.aMs) === preciseMs(loop.aMs)
    && preciseMs(saved.bMs) === preciseMs(loop.bMs)
    && String(saved.name || "") === String(loop.name || "");
}

function abLoopNeedsSave(loop = state.abLoop) {
  return Boolean(state.abLoopPowerEnabled && abLoopReady(loop) && (abLoopEditingLoop(loop) || !savedAbLoopMatchesCurrent(loop)));
}

function snapAbLoopTime(point, timeMs, loop, options = {}) {
  const track = currentTrack();
  if (!track) return 0;
  if (options.allowZero && (!Number.isFinite(Number(timeMs)) || Number(timeMs) <= 0)) return 0;
  if (options.window) {
    let target = Number(timeMs);
    if (!Number.isFinite(target) || target <= 0) target = options.window.startMs || 0;
    if (target < options.window.startMs) target = options.window.startMs;
    if (options.window.endMs > 0 && target > options.window.endMs) target = options.window.endMs;
    return preciseMs(target);
  }
  return clampToPlaybackWindowEnd(track, timeMs);
}

function snapAbLoopPartnerAfterPoint(loop, point) {
  return;
}

function setAbLoopPoint(point) {
  const track = currentTrack();
  if (!state.abLoopPowerEnabled) return;
  if (!track) return;
  const loop = state.abLoop.trackId === track.id ? state.abLoop : normalizeAbLoop({ trackId: track.id });
  const positionMs = snapAbLoopTime(point, playbackPositionMs(), loop);
  if (point === "a") {
    loop.aMs = positionMs;
    snapAbLoopPartnerAfterPoint(loop, point);
    preserveOrClearAbLoopEditIdentity(loop);
    if (loop.bMs && loop.bMs - loop.aMs < AB_LOOP_MIN_MS) loop.bMs = 0;
  } else {
    loop.bMs = positionMs;
    preserveOrClearAbLoopEditIdentity(loop);
    if (loop.bMs - loop.aMs < AB_LOOP_MIN_MS) {
      showToast("Set B after A.");
    }
  }
  loop.trackId = track.id;
  loop.active = state.abLoopPowerEnabled && loop.bMs - loop.aMs >= AB_LOOP_MIN_MS;
  state.abLoop = normalizeAbLoop(loop);
  resetActiveAbLoopPlayCount();
  saveAdvancedPlaybackSettings();
  renderProgress();
  renderAdvancedPlaybackPanel();
}

function clearAbLoop() {
  state.abLoop = normalizeAbLoop();
  state.abLoopMenuOpen = false;
  state.abLoopQueueIds = [];
  state.abLoopEditingId = "";
  resetActiveAbLoopPlayCount();
  saveAdvancedPlaybackSettings();
  renderProgress();
  renderAdvancedPlaybackPanel();
}

function savedAbLoopLabel(loop) {
  const name = loop.name || "Saved loop";
  return `${name} (${msToPreciseTime(loop.aMs)} - ${msToPreciseTime(loop.bMs)})`;
}

function openAbLoopSaveDialog() {
  const loop = state.abLoop;
  if (!state.abLoopPowerEnabled) {
    showToast("Turn on A-B Loop power to save loops.");
    return;
  }
  if (!abLoopReady(loop)) {
    showToast("Set a valid A-B loop first.");
    return;
  }
  state.abLoopSaveDialog = {
    open: true,
    name: loop.name || "",
    status: ""
  };
  renderGlobalOverlays();
}

function closeAbLoopSaveDialog() {
  state.abLoopSaveDialog = {
    open: false,
    name: "",
    status: ""
  };
  renderGlobalOverlays();
}

async function saveCurrentAbLoop(nameValue = "") {
  const loop = state.abLoop;
  if (!state.abLoopPowerEnabled) return;
  if (!abLoopReady(loop)) {
    showToast("Set a valid A-B loop first.");
    return;
  }
  const editing = abLoopEditingLoop(loop);
  const name = String(nameValue || loop.name || "Saved loop").trim().slice(0, 80) || "Saved loop";
  const saved = {
    id: editing?.id || loop.id || randomId("ab-loop"),
    trackId: loop.trackId,
    aMs: loop.aMs,
    bMs: loop.bMs,
    name,
    createdAt: editing?.createdAt || loop.createdAt || new Date().toISOString()
  };
  setActiveAbLoop(saved, state.abLoopPlayCount, { editing: Boolean(editing) });
  if (editing) {
    const updated = state.savedAbLoops.map((item) => item.id === saved.id ? saved : item);
    state.savedAbLoops = updated.some((item) => item.id === saved.id) ? updated : [saved, ...updated];
  } else {
    state.savedAbLoops = [saved, ...state.savedAbLoops.filter((item) => {
      return item.id !== saved.id;
    })].slice(0, 100);
  }
  saveAdvancedPlaybackSettings();
  closeAbLoopSaveDialog();
  showToast(`${name} has been saved.`);
  renderProgress();
  renderAdvancedPlaybackPanel();
  await persistSavedAbLoops();
  renderProgress();
  renderAdvancedPlaybackPanel();
}

function loadSavedAbLoop(loopId, plays = 1) {
  if (!state.abLoopPowerEnabled) {
    showToast("Turn on A-B Loop power to load loops.");
    return;
  }
  const loop = state.savedAbLoops.find((item) => item.id === loopId);
  const track = currentTrack();
  if (!loop || !track || loop.trackId !== track.id) return;
  if (state.abLoopQueueEnabled && abLoopEnabled()) {
    closeAbLoopSavedLoopMenu();
    queueSavedAbLoop(loopId, plays);
    return;
  }
  setActiveAbLoop(loop, plays);
  const target = clampToPlaybackWindow(track, reversePlaybackRequested() ? state.abLoop.bMs : state.abLoop.aMs);
  seekPlaybackToMs(target, { render: false });
  state.abLoopMenuOpen = false;
  closeAbLoopSavedLoopMenu();
  saveAdvancedPlaybackSettings();
  renderProgress();
  renderAdvancedPlaybackPanel();
}

function setAbLoopQueueEnabled(value) {
  if (!state.abLoopPowerEnabled && value) return;
  state.abLoopQueueEnabled = Boolean(value);
  if (!state.abLoopQueueEnabled) state.abLoopQueueIds = [];
  pruneAbLoopQueueForCurrentTrack();
  saveAdvancedPlaybackSettings();
  renderAdvancedPlaybackPanel();
}

function queueSavedAbLoop(loopId, plays = 1) {
  if (!state.abLoopPowerEnabled) {
    showToast("Turn on A-B Loop power to queue loops.");
    return;
  }
  const loop = state.savedAbLoops.find((item) => item.id === loopId);
  const track = currentTrack();
  if (!loop || !track || loop.trackId !== track.id) return;
  if (!abLoopEnabled()) {
    setActiveAbLoop(loop, plays);
    seekPlaybackToMs(reversePlaybackRequested() ? loop.bMs : loop.aMs, { render: false });
    showToast(`Loaded ${loop.name || "saved loop"}${normalizeLoopPlayCount(plays) > 1 ? ` (${normalizeLoopPlayCount(plays)} plays)` : ""}.`);
  } else {
    const playCount = normalizeLoopPlayCount(plays);
    state.abLoopQueueIds = [...pruneAbLoopQueueForCurrentTrack(), { loopId: loop.id, plays: playCount }];
    showToast(`Queued ${loop.name || "saved loop"}${playCount > 1 ? ` (${playCount} plays)` : ""}.`);
  }
  saveAdvancedPlaybackSettings();
  renderProgress();
  renderAdvancedPlaybackPanel();
}

function advanceToQueuedAbLoop() {
  if (!state.abLoopQueueEnabled) return false;
  const track = currentTrack();
  if (!track) return false;
  const queued = currentTrackQueuedAbLoopEntries();
  const nextEntry = queued[0] || null;
  state.abLoopQueueIds = queued.slice(1);
  const nextLoop = nextEntry ? savedAbLoopById(nextEntry.loopId) : null;
  if (!nextLoop) return false;
  setActiveAbLoop(nextLoop, nextEntry.plays);
  const target = reversePlaybackRequested() ? state.abLoop.bMs : state.abLoop.aMs;
  holdAbLoopBoundaryGuard(target);
  seekPlaybackToMs(target, { save: false, render: false });
  saveAdvancedPlaybackSettings();
  renderProgress();
  renderAdvancedPlaybackPanel();
  schedulePlaybackSave();
  return true;
}

function setAbLoopPowerEnabled(value) {
  const nextEnabled = Boolean(value);
  state.abLoopPowerEnabled = nextEnabled;
  if (!nextEnabled) {
    state.abLoop.active = false;
    state.abLoopQueueIds = [];
    state.abLoopLauncherOpen = false;
    state.abLoopMenuOpen = false;
    closeAbLoopPadAssignmentMenu();
    closeAbLoopSavedLoopMenu();
    resetActiveAbLoopPlayCount();
  } else if (abLoopReady()) {
    state.abLoop.active = true;
  }
  saveAdvancedPlaybackSettings();
  renderProgress();
  renderAdvancedPlaybackPanel();
}

function toggleAbLoopPowerEnabled() {
  setAbLoopPowerEnabled(!state.abLoopPowerEnabled);
}

function toggleAbLoopEnabled() {
  toggleAbLoopPowerEnabled();
}

function updateAbLoopPoint(point, timeMs, options = {}) {
  const track = currentTrack();
  if (!state.abLoopPowerEnabled) return;
  if (!track || !["a", "b"].includes(point)) return;
  const loop = state.abLoop.trackId === track.id ? state.abLoop : normalizeAbLoop({ trackId: track.id });
  const rawTime = Number(timeMs);
  const nextTime = options.allowZero && (!Number.isFinite(rawTime) || rawTime <= 0)
    ? 0
    : snapAbLoopTime(point, rawTime, loop, options);
  if (point === "a") loop.aMs = nextTime;
  else loop.bMs = nextTime;
  snapAbLoopPartnerAfterPoint(loop, point);
  if (loop.bMs && loop.aMs && loop.bMs < loop.aMs) {
    const oldA = loop.aMs;
    loop.aMs = loop.bMs;
    loop.bMs = oldA;
  }
  preserveOrClearAbLoopEditIdentity(loop);
  loop.active = state.abLoopPowerEnabled && loop.bMs - loop.aMs >= AB_LOOP_MIN_MS;
  state.abLoop = normalizeAbLoop(loop);
  saveAdvancedPlaybackSettings();
  renderProgress();
  renderAdvancedPlaybackPanel();
}

function timelinePointFromClientX(clientX, element, options = {}) {
  const track = currentTrack();
  if (!track || !element) return 0;
  const markerLayer = element.matches?.(".ab-loop-marker-layer")
    ? element
    : element.querySelector?.(".ab-loop-marker-layer");
  const rect = (markerLayer || element).getBoundingClientRect();
  const percent = rect.width > 0 ? Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)) : 0;
  const window = options.window || currentTimelineWindow();
  return seekTimelineWindowOffset(track, percent * (window.durationMs || durationForTrack(track)), options);
}

function loopBoundaryNow() {
  return typeof performance !== "undefined" && typeof performance.now === "function" ? performance.now() : Date.now();
}

function holdAbLoopBoundaryGuard(targetMs) {
  state.abLoopSeekGuardUntil = loopBoundaryNow() + AB_LOOP_SEEK_GUARD_MS;
  state.abLoopSeekGuardTargetMs = preciseMs(targetMs);
}

function abLoopBoundaryGuardActive() {
  const now = loopBoundaryNow();
  if (Number(state.abLoopSeekGuardUntil || 0) > now) return true;
  const target = Number(state.abLoopSeekGuardTargetMs);
  if (state.abLoopSeekGuardTargetMs !== null && Number.isFinite(target)) {
    if (audio?.seeking || reversePlayback.loading) {
      state.abLoopSeekGuardUntil = now + AB_LOOP_SEEKING_GUARD_MS;
      return true;
    }
    state.abLoopSeekGuardTargetMs = null;
  }
  return false;
}

function repeatCurrentAbLoopBoundary() {
  const track = currentTrack();
  if (!track) return false;
  const target = reversePlaybackRequested() ? state.abLoop.bMs : clampToPlaybackWindow(track, state.abLoop.aMs);
  holdAbLoopBoundaryGuard(target);
  seekPlaybackToMs(target, { save: false, render: false, restartReverse: false });
  renderProgress();
  schedulePlaybackSave();
  return true;
}

function maybeApplyAbLoop() {
  if (!abLoopEnabled()) return false;
  if (abLoopBoundaryGuardActive()) return true;
  const loop = state.abLoop;
  const positionMs = playbackPositionMs();
  if (reversePlaybackRequested()) {
    if (positionMs > loop.aMs + AB_LOOP_BOUNDARY_EARLY_MS) return false;
    if (consumeAbLoopPlayCount()) return repeatCurrentAbLoopBoundary();
    if (advanceToQueuedAbLoop()) return true;
    resetAbLoopBoundaryPlayCount();
    return repeatCurrentAbLoopBoundary();
  }
  if (positionMs < loop.bMs - AB_LOOP_BOUNDARY_EARLY_MS) return false;
  if (consumeAbLoopPlayCount()) return repeatCurrentAbLoopBoundary();
  if (advanceToQueuedAbLoop()) return true;
  resetAbLoopBoundaryPlayCount();
  return repeatCurrentAbLoopBoundary();
}

function clearFakeTimer() {
  if (state.fakeTimer) clearInterval(state.fakeTimer);
  state.fakeTimer = null;
}

function inactiveAudio() {
  return audio === primaryAudio ? secondaryAudio : primaryAudio;
}

function usesStablePlexStream(track) {
  return track?.source === "plex" && track.streamKey;
}

function needsPlexBrowserTranscode(track) {
  return track?.source === "plex" && cleanText(track.audioCodec).toLowerCase() === "alac";
}

function shouldUseDirectPlexPlayback(track) {
  if (!usesStablePlexStream(track) || needsPlexBrowserTranscode(track)) return false;
  const mode = state.settings?.plexPlaybackMode || "proxy";
  return mode === "auto" && state.directPlexPlaybackAvailable && !state.directPlexPlaybackDisabled;
}

function isDirectPlexStreamSrc(src = "") {
  return String(src || "").includes("/api/plex-direct-stream/");
}

function streamModeForSrc(src = "") {
  const value = String(src || "");
  if (!value) return "none";
  if (value.includes("/api/plex-direct-stream/")) return "direct";
  if (value.includes("/api/transcode/") || value.includes("/api/plex-hls/")) return "transcode";
  if (value.includes("/api/stream/")) {
    try {
      const url = new URL(value, window.location.origin);
      if (url.searchParams.get("direct") === "1") return "proxy-bypass-cache";
      if (url.searchParams.get("cache") === "1") return "proxy-cache";
    } catch {}
    return "proxy";
  }
  return value.startsWith("http") ? "remote" : "local";
}

function disableDirectPlexPlayback(reason, track = null) {
  if (state.directPlexPlaybackDisabled && (state.settings?.plexPlaybackMode || "proxy") === "proxy") return;
  state.directPlexPlaybackAvailable = false;
  state.directPlexPlaybackDisabled = true;
  state.directPlexPlaybackProbeKey = "";
  const previousMode = state.settings?.plexPlaybackMode || "proxy";
  if (state.settings) state.settings.plexPlaybackMode = "proxy";
  playbackTrace("direct-plex-disabled", {
    trackId: track?.id || "",
    reason,
    previousMode
  });
  if (previousMode !== "proxy") {
    api("/api/settings", {
      method: "POST",
      body: JSON.stringify({ plexPlaybackMode: "proxy" })
    }).then((settings) => {
      state.settings = settings;
      state.settings.eq = normalizeEqSettings(settings.eq);
    }).catch(() => {});
  }
}

function streamUrlForTrack(track, options = {}) {
  const browserUrl = window.VoidFMBrowserApi?.getStreamUrl?.(track, options);
  if (browserUrl) return browserUrl;
  if (needsPlexBrowserTranscode(track)) {
    const url = `/api/transcode/${encodeURIComponent(track.id)}/master.m3u8`;
    return options.retryToken ? `${url}?retry=${encodeURIComponent(options.retryToken)}` : url;
  }
  if (!options.direct && !options.cache && shouldUseDirectPlexPlayback(track)) {
    const url = new URL(`/api/plex-direct-stream/${encodeURIComponent(track.id)}`, window.location.origin);
    if (options.retryToken) url.searchParams.set("retry", String(options.retryToken));
    return `${url.pathname}${url.search}`;
  }
  const url = new URL(`/api/stream/${encodeURIComponent(track.id)}`, window.location.origin);
  if (usesStablePlexStream(track) && options.cache === true) url.searchParams.set("cache", "1");
  if (usesStablePlexStream(track) && options.direct === true) url.searchParams.set("direct", "1");
  if (options.retryToken) url.searchParams.set("retry", String(options.retryToken));
  return `${url.pathname}${url.search}`;
}

function audioStreamUrlForTrack(track, options = {}) {
  return streamUrlForTrack(track, options);
}

function streamPreloadKey(track, wait, cache) {
  return [
    track?.id || "",
    track?.streamKey || "",
    track?.updatedAt || "",
    wait ? "wait" : "warm",
    cache === false ? "no-cache" : "cache"
  ].join(":");
}

async function preloadTrackStream(track, options = {}) {
  if (!usesStablePlexStream(track) || needsPlexBrowserTranscode(track)) return null;
  const wait = Boolean(options.wait);
  const cache = options.cache !== false;
  const key = streamPreloadKey(track, wait, cache);
  if (streamPreloadPromises.has(key)) return streamPreloadPromises.get(key);

  const startedAt = nowPerfMs();
  const params = new URLSearchParams();
  if (wait) params.set("wait", "1");
  if (!cache) params.set("cache", "0");
  if (options.priority) params.set("priority", options.priority);
  if (options.lookahead) params.set("lookahead", String(options.lookahead));
  playbackTrace("preload-start", {
    trackId: track.id,
    wait,
    cache,
    priority: options.priority || "background",
    lookahead: Number(options.lookahead || 0)
  });
  const query = params.toString();
  const promise = api(`/api/preload/${encodeURIComponent(track.id)}${query ? `?${query}` : ""}`, { method: "POST" })
    .then((payload) => {
      playbackTrace("preload-result", {
        trackId: track.id,
        status: payload?.status || "",
        warm: Boolean(payload?.warm),
        cached: Boolean(payload?.cached),
        bytesWarmed: Number(payload?.bytesWarmed || payload?.bytes || 0),
        elapsedMs: Math.round(nowPerfMs() - startedAt)
      });
      return payload;
    })
    .catch((error) => {
      if (wait) throw error;
      console.warn("Stream preload failed:", error.message);
      playbackTrace("preload-error", {
        trackId: track.id,
        error: error.message,
        elapsedMs: Math.round(nowPerfMs() - startedAt)
      });
      return null;
    })
    .finally(() => streamPreloadPromises.delete(key));
  streamPreloadPromises.set(key, promise);
  return promise;
}

function maybeProbeDirectPlexPlayback(track) {
  if (!track || !usesStablePlexStream(track) || needsPlexBrowserTranscode(track)) return;
  if ((state.settings?.plexPlaybackMode || "proxy") !== "auto") return;
  const key = `${track.id}:${track.streamKey}:${track.updatedAt || ""}`;
  if (state.directPlexPlaybackProbeKey === key) return;
  const wasAvailable = Boolean(state.directPlexPlaybackAvailable);
  state.directPlexPlaybackProbeKey = key;
  const probe = new Audio();
  probe.preload = "metadata";
  probe.crossOrigin = "anonymous";
  probe.muted = true;
  probe.volume = 0;
  const startedAt = nowPerfMs();
  let finished = false;
  const complete = (ok, reason) => {
    if (finished) return;
    finished = true;
    probe.pause();
    probe.removeAttribute("src");
    probe.load?.();
    state.directPlexPlaybackAvailable = ok ? true : wasAvailable;
    playbackTrace("direct-plex-probe", {
      trackId: track.id,
      ok: Boolean(ok),
      retainedAvailable: !ok && wasAvailable,
      reason,
      elapsedMs: Math.round(nowPerfMs() - startedAt)
    });
  };
  const confirmPlayable = () => {
    probe.play()
      .then(() => {
        setTimeout(() => {
          const advanced = Number.isFinite(probe.currentTime) && probe.currentTime > 0.05;
          clearTimeout(timer);
          complete(advanced, advanced ? "muted-playback" : "no-time-advance");
        }, 650);
      })
      .catch((error) => {
        clearTimeout(timer);
        complete(false, error?.message || "play-rejected");
      });
  };
  const timer = setTimeout(() => complete(false, "timeout"), 1800);
  probe.addEventListener("canplay", () => {
    confirmPlayable();
  }, { once: true });
  probe.addEventListener("error", () => {
    clearTimeout(timer);
    complete(false, probe.error?.message || `media-${probe.error?.code || "error"}`);
  }, { once: true });
  probe.src = `/api/plex-direct-stream/${encodeURIComponent(track.id)}?probe=1`;
  try {
    probe.load?.();
  } catch (error) {
    clearTimeout(timer);
    complete(false, error.message || "load-error");
  }
}

function queueIndexWithOffset(offset) {
  if (!state.queue.length || state.currentIndex < 0) return -1;
  const rawIndex = state.currentIndex + offset;
  if (rawIndex < state.queue.length) return rawIndex;
  return state.repeat === "all" ? rawIndex % state.queue.length : -1;
}

function nextPreloadIndex() {
  if (state.repeat === "one") return -1;
  return queueIndexWithOffset(1);
}

function upcomingPreloadItems(limit = STREAM_PRELOAD_LOOKAHEAD_COUNT) {
  if (!state.queue.length || state.currentIndex < 0 || state.repeat === "one") return [];
  const items = [];
  const seen = new Set();
  for (let offset = 1; offset <= limit; offset += 1) {
    const queueIndex = queueIndexWithOffset(offset);
    if (queueIndex === state.currentIndex) continue;
    if (queueIndex < 0 || seen.has(queueIndex)) continue;
    seen.add(queueIndex);
    const track = state.queue[queueIndex];
    if (track && canStreamTrack(track)) items.push({ track, queueIndex, offset });
  }
  return items;
}

function emptyStandbyAudioPreload() {
  return { player: null, trackId: "", url: "", queueIndex: -1, fingerprint: "" };
}

function clearStandbyAudioPreload(options = {}) {
  const player = standbyAudioPreload.player;
  if (player && player !== audio && player !== options.keepPlayer) resetAudioElement(player);
  standbyAudioPreload = emptyStandbyAudioPreload();
}

function fallbackDirectAudioToProxy(player, track, reason) {
  if (!player || !track || !isDirectPlexStreamSrc(player.currentSrc || player.src || "")) return false;
  disableDirectPlexPlayback(reason, track);
  const retryToken = `${Date.now()}-${reason}`;
  const url = audioStreamUrlForTrack(track, { direct: true, retryToken });
  playbackTrace("direct-plex-proxy-fallback", {
    trackId: track.id,
    reason,
    active: player === audio,
    standby: standbyAudioPreload.player === player,
    readyState: player.readyState,
    networkState: player.networkState
  });
  resetAudioElement(player);
  player.preload = "auto";
  player.src = url;
  player.volume = state.volume;
  player.muted = state.muted;
  applyPlaybackRateToPlayer(player);
  if (standbyAudioPreload.player === player) {
    standbyAudioPreload = {
      ...standbyAudioPreload,
      trackId: track.id,
      url,
      fingerprint: standbyStreamFingerprint(track)
    };
  }
  try {
    player.load?.();
  } catch {
    return false;
  }
  if (player === audio && state.isPlaying) {
    state.audioTransitioning = true;
    guardPlaybackStart(track, state.streamPrepareToken, { reason });
    player.play()
      .then(finishAudioTransition)
      .catch((error) => handleAudioPlayFailure(track, error));
  }
  return true;
}

function standbyStreamFingerprint(track) {
  return [
    track?.id || "",
    track?.source || "",
    track?.streamKey || "",
    track?.filePath || "",
    track?.updatedAt || "",
    track?.duration || ""
  ].join(":");
}

function standbyAudioForTrack(track) {
  if (!track || !standbyAudioPreload.player) return null;
  const player = standbyAudioPreload.player;
  const src = player.currentSrc || player.src || "";
  if (!src) return null;
  if (standbyAudioPreload.trackId !== track.id) return null;
  if (standbyAudioPreload.fingerprint && standbyAudioPreload.fingerprint !== standbyStreamFingerprint(track)) return null;
  if (isDirectPlexStreamSrc(src) && !shouldUseDirectPlexPlayback(track)) return null;
  return player;
}

function prepareNextAudioPreload() {
  const nextIndex = nextPreloadIndex();
  const track = nextIndex >= 0 ? state.queue[nextIndex] : null;
  if (!track || !canStreamTrack(track)) {
    clearStandbyAudioPreload();
    return false;
  }

  const player = inactiveAudio();
  if (!player || player === audio) return false;
  const url = audioStreamUrlForTrack(track);
  const fingerprint = standbyStreamFingerprint(track);
  const currentStandbySrc = standbyAudioPreload.player === player
    ? standbyAudioPreload.player.currentSrc || standbyAudioPreload.player.src || ""
    : "";
  if (
    standbyAudioPreload.player === player
    && standbyAudioPreload.trackId === track.id
    && standbyAudioPreload.fingerprint === fingerprint
    && currentStandbySrc
    && !(isDirectPlexStreamSrc(currentStandbySrc) && !shouldUseDirectPlexPlayback(track))
  ) {
    return true;
  }

  clearStandbyAudioPreload({ keepPlayer: player });
  resetAudioElement(player);
  player.preload = "auto";
  player.src = url;
  player.volume = state.volume;
  player.muted = state.muted;
  applyPlaybackRateToPlayer(player);
  standbyAudioPreload = { player, trackId: track.id, url, queueIndex: nextIndex, fingerprint };
  const startedAt = nowPerfMs();
  const onCanPlay = () => {
    if (standbyAudioPreload.player !== player || standbyAudioPreload.trackId !== track.id) return;
    playbackTrace("standby-canplay", {
      trackId: track.id,
      queueIndex: nextIndex,
      elapsedMs: Math.round(nowPerfMs() - startedAt)
    });
  };
  player.addEventListener("canplay", onCanPlay, { once: true });
  try {
    player.load?.();
    playbackTrace("standby-load", { trackId: track.id, queueIndex: nextIndex });
    return true;
  } catch {
    player.removeEventListener("canplay", onCanPlay);
    clearStandbyAudioPreload();
    return false;
  }
}

function warmUpcomingStreams(options = {}) {
  const upcoming = upcomingPreloadItems();
  if (!upcoming.length) {
    clearDeferredLookaheadWarm();
    clearStandbyAudioPreload();
    return;
  }

  const nextAudioPrepared = options.prepareAudio !== false ? prepareNextAudioPreload() : false;
  const immediateWarmItems = [];
  const deferredWarmItems = [];
  for (const item of upcoming) {
    const { track, offset } = item;
    if (!usesStablePlexStream(track) || needsPlexBrowserTranscode(track)) continue;
    if (offset === 1 && nextAudioPrepared) {
      playbackTrace("preload-skip-standby", {
        trackId: track.id,
        reason: "standby-audio"
      });
      continue;
    }
    if (offset <= 1) immediateWarmItems.push(item);
    else deferredWarmItems.push(item);
  }

  warmStreamPreloadItems(immediateWarmItems);
  scheduleDeferredLookaheadWarm(deferredWarmItems);
}

function clearDeferredLookaheadWarm() {
  if (streamLookaheadWarmTimer) clearTimeout(streamLookaheadWarmTimer);
  streamLookaheadWarmTimer = 0;
  streamLookaheadWarmToken += 1;
}

function validLookaheadWarmItems(items = []) {
  return items.filter((item) => {
    const track = item?.track;
    const queueIndex = Number(item?.queueIndex);
    return track
      && queueIndex >= 0
      && state.queue[queueIndex]?.id === track.id
      && queueIndex !== state.currentIndex
      && canStreamTrack(track);
  });
}

function scheduleDeferredLookaheadWarm(items = []) {
  const validItems = validLookaheadWarmItems(items);
  if (!validItems.length) {
    clearDeferredLookaheadWarm();
    return;
  }
  if (streamLookaheadWarmTimer) clearTimeout(streamLookaheadWarmTimer);
  const token = streamLookaheadWarmToken + 1;
  streamLookaheadWarmToken = token;
  streamLookaheadWarmTimer = setTimeout(() => {
    streamLookaheadWarmTimer = 0;
    if (token !== streamLookaheadWarmToken) return;
    if (!state.isPlaying) return;
    if (state.audioTransitioning) {
      scheduleDeferredLookaheadWarm(validItems);
      return;
    }
    warmStreamPreloadItems(validLookaheadWarmItems(validItems), { deferred: true });
  }, STREAM_LOOKAHEAD_WARM_DELAY_MS);
}

function warmStreamPreloadItems(items = [], options = {}) {
  const validItems = validLookaheadWarmItems(items);
  if (!validItems.length) return;
  if (!state.directPlexPlaybackAvailable) maybeProbeDirectPlexPlayback(validItems[0]?.track);
  for (const item of validItems) {
    const { track, offset } = item;
    preloadTrackStream(track, {
      wait: false,
      cache: false,
      priority: offset === 1 ? "foreground" : "background",
      lookahead: offset
    }).catch((error) => {
      if (offset === 1) console.warn("Next stream preload failed:", error.message);
    });
  }
  if (options.deferred) {
    playbackTrace("preload-lookahead-deferred", {
      count: validItems.length,
      offsets: validItems.map((item) => item.offset)
    });
  }
}

function clearActiveStartWarm() {
  if (activeStartWarmTimer) clearTimeout(activeStartWarmTimer);
  activeStartWarmTimer = 0;
  activeStartWarmToken += 1;
  if (activeStartWarmCleanup) activeStartWarmCleanup();
  activeStartWarmCleanup = null;
}

function scheduleWarmUpcomingStreamsAfterActiveStart(options = {}) {
  clearActiveStartWarm();
  const track = currentTrack();
  if (!track || !canStreamTrack(track)) return;
  if (!state.isPlaying || !state.audioTransitioning || audio.readyState >= 3) {
    warmUpcomingStreams(options);
    return;
  }

  const player = audio;
  const trackId = track.id;
  const token = activeStartWarmToken + 1;
  activeStartWarmToken = token;

  const cleanup = () => {
    player.removeEventListener("playing", onReady);
    player.removeEventListener("canplay", onReady);
    activeStartWarmCleanup = null;
  };
  const run = (reason) => {
    if (token !== activeStartWarmToken) return;
    if (activeStartWarmTimer) clearTimeout(activeStartWarmTimer);
    activeStartWarmTimer = 0;
    cleanup();
    if (player !== audio || currentTrack()?.id !== trackId) return;
    if (state.isPlaying && state.audioTransitioning && player.readyState < 2) {
      playbackTrace("preload-after-active-start-skipped", {
        trackId,
        reason,
        readyState: player.readyState,
        networkState: player.networkState
      });
      return;
    }
    playbackTrace("preload-after-active-start", {
      trackId,
      reason,
      readyState: player.readyState,
      networkState: player.networkState
    });
    warmUpcomingStreams(options);
  };
  function onReady(event) {
    run(event?.type || "ready");
  }

  activeStartWarmCleanup = cleanup;
  player.addEventListener("playing", onReady, { once: true });
  player.addEventListener("canplay", onReady, { once: true });
  activeStartWarmTimer = setTimeout(() => run("delay"), STREAM_START_PRELOAD_DELAY_MS);
}

function resetAudioElement(player) {
  player.pause();
  player.removeAttribute("src");
  player.load?.();
  player.volume = state.volume;
  player.muted = state.muted;
  applyPlaybackRateToPlayer(player);
}

function beginAudioLoad(player, track = null, reason = "audio-load") {
  try {
    player.load?.();
    return true;
  } catch (error) {
    playbackTrace("audio-load-error", {
      trackId: track?.id || "",
      reason,
      error: error?.message || String(error || "")
    });
    return false;
  }
}

function clearCrossfade(options = {}) {
  clearPlaybackStartGuard();
  if (state.crossfadeTimer) {
    clearInterval(state.crossfadeTimer);
    state.crossfadeTimer = null;
  }
  state.crossfadeToken += 1;
  primaryAudio.volume = state.volume;
  secondaryAudio.volume = state.volume;
  applyMuteState();
  const standby = inactiveAudio();
  if (standby !== audio && standby !== options.keepPlayer) resetAudioElement(standby);
  state.audioTransitioning = false;
}

function finishAudioTransition() {
  if (state.crossfadeTimer) return;
  clearPlaybackStartGuard();
  state.audioTransitioning = false;
}

function playAudioWithTimeout(player, timeoutMs = PLAYBACK_START_GUARD_MS) {
  const playPromise = player.play();
  if (!playPromise || typeof playPromise.then !== "function") return Promise.resolve();
  playPromise.catch(() => {});
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("Audio playback timed out."));
    }, Math.max(250, Number(timeoutMs) || PLAYBACK_START_GUARD_MS));
    playPromise
      .then(resolve, reject)
      .finally(() => clearTimeout(timer));
  });
}

function syncAudioMetadataForTrack(player, track, options = {}) {
  const validate = typeof options.validate === "function" ? options.validate : () => true;
  const targetMs = typeof options.targetMs === "function" ? options.targetMs : () => state.currentTime;
  const updateState = options.updateState !== false;
  const apply = () => {
    if (!validate()) return;
    const mediaDuration = Number.isFinite(player.duration) && player.duration > 0
      ? Math.round(player.duration * 1000)
      : 0;
    if (mediaDuration && !track.duration) track.duration = mediaDuration;
    const nextTime = clampToPlaybackWindow(track, targetMs());
    if (updateState) state.currentTime = nextTime;
    if (nextTime > 0 && Number.isFinite(nextTime)) {
      try {
        if (!Number.isFinite(player.currentTime) || Math.abs(player.currentTime - (nextTime / 1000)) > 0.25) {
          player.currentTime = nextTime / 1000;
        }
      } catch {
        // Some streams are not seekable until more metadata has loaded.
      }
    }
    renderProgress({ smooth: true });
  };

  if (player.readyState >= 1) apply();
  else player.addEventListener("loadedmetadata", apply, { once: true });
}

function loadCurrentTrack(options = {}) {
  const prepareToken = state.streamPrepareToken + 1;
  state.streamPrepareToken = prepareToken;
  const track = currentTrack();
  const reverseResumeTime = reversePlaybackActive() ? playbackPositionMs() : 0;
  stopReversePlayback({ updateState: false });
  const preparedAudio = standbyAudioForTrack(track);
  clearCrossfade({ keepPlayer: preparedAudio });
  clearFakeTimer();
  const shouldAutoplay = options.autoplay ?? state.isPlaying;
  const requestedTime = Number(options.currentTime ?? reverseResumeTime ?? 0);
  state.currentTime = track ? (options.preserveTime ? clampToPlaybackWindow(track, requestedTime) : playbackWindowForTrack(track).startMs) : 0;
  state.audioTransitioning = true;
  for (const player of [primaryAudio, secondaryAudio]) {
    if (player !== preparedAudio) resetAudioElement(player);
  }
  if (preparedAudio) {
    audio = preparedAudio;
    clearStandbyAudioPreload({ keepPlayer: preparedAudio });
  } else {
    clearStandbyAudioPreload();
  }

  if (!track) {
    state.isPlaying = false;
    state.abLoop.active = false;
    state.abLoopQueueIds = [];
    state.abLoopEditingId = "";
    resetActiveAbLoopPlayCount();
    finishAudioTransition();
    startPlaybackSession(null);
    renderPlaybackSurfaces({ queueChanged: options.queueChanged });
    scheduleTrackCompanionLoads(null, { immediate: true });
    return;
  }

  state.isPlaying = shouldAutoplay;
  if (state.abLoop.trackId && state.abLoop.trackId !== track.id) {
    state.abLoop.active = false;
    state.abLoopEditingId = "";
    resetActiveAbLoopPlayCount();
  }
  closeAbLoopPadAssignmentMenu();
  closeAbLoopSavedLoopMenu();
  pruneAbLoopQueueForCurrentTrack();
  applyPlaylistDefaultEqForContext(state.queueContext, { save: false, render: false });

  if (canStreamTrack(track)) {
    const attachAudio = () => {
      if (prepareToken !== state.streamPrepareToken || currentTrack()?.id !== track.id) return;
      if (!preparedAudio) {
        audio.src = audioStreamUrlForTrack(track);
        beginAudioLoad(audio, track, "track-load");
      }
      playbackTrace("track-load", {
        trackId: track.id,
        preparedAudio: Boolean(preparedAudio),
        autoplay: Boolean(shouldAutoplay),
        srcMode: streamModeForSrc(audio.currentSrc || audio.src || ""),
        readyState: audio.readyState,
        networkState: audio.networkState
      });
      audio.volume = state.volume;
      audio.muted = state.muted;
      applyAdvancedPlaybackSettings();
      applyEqSettingsToAudio();
      syncAudioMetadataForTrack(audio, track, {
        validate: () => prepareToken === state.streamPrepareToken && currentTrack()?.id === track.id
      });

      if (shouldAutoplay && state.isPlaying && reversePlaybackRequested()) {
        startReversePlayback({ positionMs: state.currentTime });
      } else if (shouldAutoplay && state.isPlaying) {
        guardPlaybackStart(track, prepareToken, {
          reason: preparedAudio ? "prepared-audio" : "track-load"
        });
        audio.play()
          .then(finishAudioTransition)
          .catch((error) => handleAudioPlayFailure(track, error));
      } else {
        finishAudioTransition();
      }
    };

    attachAudio();
    scheduleWarmUpcomingStreamsAfterActiveStart({ includeCurrent: false });
  } else if (unsupportedPlaybackReason(track)) {
    state.isPlaying = false;
    finishAudioTransition();
    if (shouldAutoplay) showToast(unsupportedPlaybackMessage(track));
  } else if (shouldAutoplay) {
    startFakePlayback(track);
  } else {
    finishAudioTransition();
  }

  if (!(options.preservePlaybackSession && state.playbackSession?.trackId === track.id)) {
    startPlaybackSession(track);
  }
  schedulePlaybackSave();
  renderPlaybackSurfaces({ queueChanged: options.queueChanged });
  scheduleTrackCompanionLoads(track);
}

function handleAudioPlayFailure(track, error) {
  console.warn("Audio playback failed:", error?.message || error);
  if (isIgnorablePlayInterruption(error)) {
    playbackTrace("play-interruption-ignored", {
      trackId: track?.id || "",
      error: error?.message || String(error || "")
    });
    finishAudioTransition();
    return;
  }
  clearFakeTimer();
  if (track && canStreamTrack(track) && recoverAudioStreamError(track, error, "play-failure")) return;
  finishAudioTransition();
  state.isPlaying = false;
  if (track && canStreamTrack(track)) {
    showToast("Could not start the audio stream. Skipping to the next song.");
  }
  renderPlaybackSurfaces();
  schedulePlaybackSave();
}

function recoverAudioStreamError(track, error, reason = "stream-error") {
  if (!track || !canStreamTrack(track)) return false;
  if (browserOnlyPlaybackActive()) {
    stopBrowserOnlyPlaybackFailure(track, reason);
    return true;
  }
  if (isIgnorablePlayInterruption(error)) {
    playbackTrace("stream-error-ignored", {
      trackId: track.id,
      reason,
      error: error?.message || String(error || "")
    });
    finishAudioTransition();
    return true;
  }
  const currentRecovery = state.playbackErrorRecovery?.trackId === track.id
    ? state.playbackErrorRecovery
    : { trackId: track.id, count: 0 };
  if (currentRecovery.count >= PLAYBACK_ERROR_RETRY_LIMIT) {
    markPlaybackHandoff(reason, track);
    return advanceToNextPlayable({ autoplay: true, reason, forceWrap: true });
  }

  const count = currentRecovery.count + 1;
  state.playbackErrorRecovery = { trackId: track.id, count };
  const retryToken = `${Date.now()}-${count}`;
  const retryTime = clampToPlaybackWindow(track, playbackPositionMs());
  playbackTrace("stream-error-retry", {
    trackId: track.id,
    reason,
    attempt: count,
    positionMs: retryTime,
    error: error?.message || String(error || "")
  });

  clearPlaybackRecoveryTimer();
  state.isPlaying = true;
  state.audioTransitioning = true;
  state.currentTime = retryTime;
  resetAudioElement(audio);
  audio.src = audioStreamUrlForTrack(track, { direct: true, retryToken });
  audio.volume = state.volume;
  audio.muted = state.muted;
  applyAdvancedPlaybackSettings();
  applyEqSettingsToAudio();
  syncAudioMetadataForTrack(audio, track, {
    validate: () => currentTrack()?.id === track.id && state.playbackErrorRecovery?.count === count
  });

  playbackRecoveryTimer = setTimeout(() => {
    if (currentTrack()?.id !== track.id) return;
    if (state.playbackErrorRecovery?.trackId !== track.id || state.playbackErrorRecovery?.count !== count) return;
    if (state.audioTransitioning || audio.paused || !audio.src) {
      playbackTrace("stream-error-advance", {
        trackId: track.id,
        reason,
        waitedMs: PLAYBACK_FAST_RECOVERY_MS
      });
      markPlaybackHandoff(reason, track);
      advanceToNextPlayable({ autoplay: true, reason, forceWrap: true });
    }
  }, PLAYBACK_FAST_RECOVERY_MS);

  audio.play()
    .then(finishAudioTransition)
    .catch((playError) => {
      if (currentTrack()?.id !== track.id || state.playbackErrorRecovery?.count !== count) return;
      playbackTrace("stream-error-retry-failed", {
        trackId: track.id,
        reason,
        error: playError?.message || String(playError || "")
      });
      markPlaybackHandoff(reason, track);
      advanceToNextPlayable({ autoplay: true, reason, forceWrap: true });
    });
  renderPlaybackSurfaces();
  schedulePlaybackSave();
  return true;
}

function startFakePlayback(track) {
  clearFakeTimer();
  finishAudioTransition();
  const window = playbackWindowForTrack(track);
  const endMs = window.endMs || track.duration;
  state.currentTime = reversePlaybackRequested() && endMs ? endMs : window.startMs;
  state.isPlaying = true;
  state.fakeTimer = setInterval(() => {
    state.currentTime += Math.round(1000 * playbackRateFromSpeedOffset() * (reversePlaybackRequested() ? -1 : 1));
    if (maybeApplyAbLoop()) return;
    const nextWindow = playbackWindowForTrack(track);
    const nextEndMs = nextWindow.endMs || track.duration;
    if ((reversePlaybackRequested() && state.currentTime <= nextWindow.startMs) || (nextEndMs && state.currentTime >= nextEndMs)) {
      handleEnded();
    } else {
      maybeScrobbleCurrent();
      renderProgress();
      schedulePlaybackSave();
    }
  }, 1000);
  renderPlayer();
}

function playbackPositionMs() {
  if (reversePlaybackActive()) return reversePlaybackPositionMs();
  if (audio.src && !Number.isNaN(audio.currentTime)) return preciseMs(audio.currentTime * 1000);
  return preciseMs(state.currentTime || 0);
}

function expectedPlaybackEndMs(track, player = audio) {
  if (!track) return 0;
  const window = playbackWindowForTrack(track);
  if (window.endMs > 0) return window.endMs;
  const storedDuration = Number(track.duration || 0);
  if (storedDuration > 0) return storedDuration;
  if (Number.isFinite(player.duration) && player.duration > 0) return Math.round(player.duration * 1000);
  return 0;
}

function isAudioAtExpectedEnd(player, track) {
  const expectedEndMs = expectedPlaybackEndMs(track, player);
  if (!expectedEndMs) return true;
  const positionMs = Number.isFinite(player.currentTime)
    ? Math.round(player.currentTime * 1000)
    : playbackPositionMs();
  return positionMs >= expectedEndMs - MEDIA_END_GRACE_MS;
}

function holdEarlyEndedPlayback(track, resumeMs, reason) {
  clearPlaybackRecoveryTimer();
  finishAudioTransition();
  state.isPlaying = false;
  state.currentTime = clampToPlaybackWindow(track, resumeMs);
  if (audio.src) {
    try {
      audio.currentTime = state.currentTime / 1000;
    } catch {
      // The stream may not be seekable after an early ended event.
    }
  }
  playbackTrace("early-ended-held", {
    trackId: track?.id || "",
    reason,
    resumeMs: state.currentTime,
    expectedEndMs: expectedPlaybackEndMs(track, audio)
  });
  showToast("Audio stopped before the song finished. Playback paused instead of skipping ahead.");
  renderPlaybackSurfaces();
  schedulePlaybackSave();
}

function recoverEarlyAudioEnd(player) {
  const track = currentTrack();
  if (!track || !canStreamTrack(track)) return false;
  if (isAudioAtExpectedEnd(player, track)) return false;

  if (earlyEndedRecovery.trackId !== track.id) {
    earlyEndedRecovery = { trackId: track.id, count: 0 };
  }
  const window = playbackWindowForTrack(track);
  const positionMs = Number.isFinite(player.currentTime)
    ? Math.round(player.currentTime * 1000)
    : playbackPositionMs();
  const resumeMs = Math.max(window.startMs, positionMs - 250);
  if (earlyEndedRecovery.count >= MEDIA_EARLY_END_RETRY_LIMIT) {
    holdEarlyEndedPlayback(track, resumeMs, "retry-limit");
    return true;
  }

  earlyEndedRecovery.count += 1;
  const attempt = earlyEndedRecovery.count;
  console.warn("Audio stream ended before the expected track end; retrying current song.", {
    trackId: track.id,
    positionMs,
    expectedEndMs: expectedPlaybackEndMs(track, player),
    attempt: earlyEndedRecovery.count
  });
  playbackTrace("early-ended-retry", {
    trackId: track.id,
    positionMs,
    expectedEndMs: expectedPlaybackEndMs(track, player),
    attempt
  });
  state.isPlaying = true;
  state.currentTime = resumeMs;
  clearPlaybackRecoveryTimer();
  playbackRecoveryTimer = setTimeout(() => {
    if (currentTrack()?.id !== track.id) return;
    if (earlyEndedRecovery.trackId !== track.id || earlyEndedRecovery.count !== attempt) return;
    if (state.audioTransitioning || audio.paused || !audio.src) {
      playbackTrace("early-ended-retry-timeout", {
        trackId: track.id,
        waitedMs: EARLY_END_RECOVERY_WAIT_MS
      });
      holdEarlyEndedPlayback(track, resumeMs, "retry-timeout");
    }
  }, EARLY_END_RECOVERY_WAIT_MS);
  loadCurrentTrack({ preserveTime: true, currentTime: resumeMs, autoplay: true, preservePlaybackSession: true });
  return true;
}

function maybeFinishPlaybackWindow() {
  if (state.crossfadeTimer || state.audioTransitioning) return false;
  const track = currentTrack();
  const window = playbackWindowForTrack(track);
  if (!track || !window.endMs || !audio.src) return false;
  if (playbackPositionMs() < window.endMs - 80) return false;
  handleEnded();
  return true;
}

function nextCrossfadeIndex() {
  if (!state.queue.length || state.repeat === "one") return -1;
  if (state.currentIndex < state.queue.length - 1) return state.currentIndex + 1;
  if (state.repeat === "all" && state.queue.length > 1) return 0;
  return -1;
}

function crossfadeDurationSeconds(oldTrack, oldAudio, fadeSeconds) {
  const oldWindow = playbackWindowForTrack(oldTrack);
  const oldEndSeconds = oldWindow.endMs > 0
    ? oldWindow.endMs / 1000
    : Number.isFinite(oldAudio.duration) ? oldAudio.duration : 0;
  const remaining = oldEndSeconds && Number.isFinite(oldAudio.currentTime)
    ? Math.max(0, oldEndSeconds - oldAudio.currentTime)
    : fadeSeconds;
  return Math.max(0.2, Math.min(fadeSeconds, remaining || fadeSeconds));
}

function prepareCrossfadeAudio(nextTrack, token, label, options = {}) {
  const preloadedAudio = standbyAudioForTrack(nextTrack);
  const newAudio = preloadedAudio || inactiveAudio();
  if (preloadedAudio) {
    clearStandbyAudioPreload({ keepPlayer: preloadedAudio });
  } else {
    clearStandbyAudioPreload({ keepPlayer: newAudio });
    resetAudioElement(newAudio);
    newAudio.src = audioStreamUrlForTrack(nextTrack);
    beginAudioLoad(newAudio, nextTrack, label);
  }
  newAudio.volume = 0;
  applyPlaybackRateToPlayer(newAudio);
  if (options.nextContext) {
    applyPlaylistDefaultEqForContext(normalizedQueueContext(options.nextContext), { save: false, render: false });
  }
  applyEqSettingsToAudio();
  syncAudioMetadataForTrack(newAudio, nextTrack, {
    targetMs: () => playbackWindowForTrack(nextTrack).startMs,
    updateState: false,
    validate: () => token === state.crossfadeToken
  });
  return newAudio;
}

function startCrossfadeVolumeTimer(token, oldAudio, newAudio, durationSeconds) {
  const startedAt = performance.now();
  state.crossfadeTimer = setInterval(() => {
    if (token !== state.crossfadeToken) return;
    const progress = Math.min(1, (performance.now() - startedAt) / (durationSeconds * 1000));
    oldAudio.volume = state.volume * (1 - progress);
    newAudio.volume = state.volume * progress;
    if (progress >= 1) finishCrossfade(token, oldAudio, newAudio);
  }, 50);
}

function finishCrossfade(token, oldAudio, newAudio) {
  if (token !== state.crossfadeToken) return;
  if (state.crossfadeTimer) {
    clearInterval(state.crossfadeTimer);
    state.crossfadeTimer = null;
  }
  resetAudioElement(oldAudio);
  newAudio.volume = state.volume;
  finishAudioTransition();
  warmUpcomingStreams({ includeCurrent: false });
  renderPlaybackSurfaces();
  schedulePlaybackSave();
}

async function startCrossfadeToIndex(nextIndex, options = {}) {
  const fadeSeconds = normalizeFadeSeconds(options.fadeSeconds ?? state.queueContext?.fadeSeconds);
  const oldTrack = currentTrack();
  const next = state.queue[nextIndex];
  if (!fadeSeconds || !oldTrack || !next || !canStreamTrack(oldTrack) || !canStreamTrack(next)) return false;

  const oldAudio = audio;
  const durationSeconds = crossfadeDurationSeconds(oldTrack, oldAudio, fadeSeconds);
  const token = state.crossfadeToken + 1;
  state.crossfadeToken = token;
  state.audioTransitioning = true;
  if (options.scrobbleCurrent === false) maybeRecordSkipCurrent();
  else maybeScrobbleCurrent(true);

  const newAudio = prepareCrossfadeAudio(next, token, "crossfade-load");

  try {
    await playAudioWithTimeout(newAudio, options.startTimeoutMs || PLAYBACK_START_GUARD_MS);
  } catch (error) {
    if (token === state.crossfadeToken) {
      playbackTrace("crossfade-start-failed", {
        trackId: next.id,
        error: error?.message || String(error || "")
      });
      resetAudioElement(newAudio);
      oldAudio.volume = state.volume;
      finishAudioTransition();
      if (options.fallbackOnFailure !== false && state.queue[nextIndex]) {
        state.currentIndex = nextIndex;
        loadCurrentTrack({ autoplay: options.autoplay ?? true });
      }
    }
    return false;
  }

  if (token !== state.crossfadeToken) {
    resetAudioElement(newAudio);
    return false;
  }

  audio = newAudio;
  state.currentIndex = nextIndex;
  state.currentTime = playbackWindowForTrack(next).startMs;
  state.isPlaying = true;
  startPlaybackSession(next);
  renderPlaybackSurfaces();
  schedulePlaybackSave();

  startCrossfadeVolumeTimer(token, oldAudio, newAudio, durationSeconds);
  return true;
}

function maybeStartCrossfade() {
  if (reversePlaybackRequested()) return;
  const fadeSeconds = normalizeFadeSeconds(state.queueContext?.fadeSeconds);
  if (!fadeSeconds || state.crossfadeTimer || state.audioTransitioning || state.fakeTimer || !state.isPlaying || !audio.src || audio.paused) return;
  const track = currentTrack();
  const nextIndex = nextCrossfadeIndex();
  const next = nextIndex >= 0 ? state.queue[nextIndex] : null;
  if (!track || !next || !canStreamTrack(track) || !canStreamTrack(next)) return;
  const window = playbackWindowForTrack(track);
  const duration = window.endMs > 0
    ? window.endMs / 1000
    : Number.isFinite(audio.duration) && audio.duration > 0
    ? audio.duration
    : durationForTrack(track) / 1000;
  if (!duration || !Number.isFinite(audio.currentTime)) return;
  const remaining = duration - audio.currentTime;
  if (remaining > 0 && remaining <= fadeSeconds + 0.08) startCrossfadeToIndex(nextIndex);
}

function scrobbleThreshold(track) {
  const duration = playbackWindowForTrack(track).durationMs || Number(track?.duration || 0);
  return Math.min(30000, Math.max(10000, duration * 0.45));
}

function startPlaybackSession(track) {
  const previousTrackId = state.playbackSession?.trackId || "";
  if ((track?.id || "") !== previousTrackId) {
    earlyEndedRecovery = { trackId: "", count: 0 };
    state.playbackErrorRecovery = { trackId: "", count: 0 };
    clearPlaybackRecoveryTimer();
  }
  state.playbackSession = track
    ? {
      trackId: track.id,
      startedAt: Date.now(),
      startMs: playbackPositionMs(),
      scrobbled: false
    }
    : null;
}

function mergeListeningStat(stat) {
  if (!stat?.trackId) return;
  state.listeningStats = {
    ...state.listeningStats,
    [stat.trackId]: stat
  };
  markStatsChanged();
}

function postListeningEvent(type, track, options = {}) {
  if (!track) return;
  const positionMs = playbackPositionMs();
  const listenedMs = Math.max(0, positionMs - Number(state.playbackSession?.startMs || 0));
  const durationMs = playbackWindowForTrack(track).durationMs || track.duration || 0;
  api("/api/listening-events", {
    method: "POST",
    body: JSON.stringify({
      trackId: track.id,
      type,
      positionMs,
      listenedMs: options.listenedMs ?? listenedMs,
      durationMs
    })
  }).then((payload) => {
    mergeListeningStat(payload.stat);
    if (payload.event) state.listeningEvents.push(payload.event);
    renderSurface();
    renderLibrary();
  }).catch(() => {});
}

function maybeScrobbleCurrent(force = false) {
  const track = currentTrack();
  const session = state.playbackSession;
  if (!track || !session || session.trackId !== track.id || session.scrobbled) return;
  const positionMs = playbackPositionMs();
  if (!force && positionMs < scrobbleThreshold(track)) return;
  session.scrobbled = true;
  postListeningEvent(force ? "complete" : "play", track);
}

function maybeRecordSkipCurrent() {
  const track = currentTrack();
  const session = state.playbackSession;
  if (!track || !session || session.trackId !== track.id || session.scrobbled) return;
  const positionMs = playbackPositionMs();
  const listenedMs = Math.max(0, positionMs - Number(session.startMs || 0));
  if (listenedMs >= 5000 && listenedMs < scrobbleThreshold(track)) {
    session.scrobbled = true;
    postListeningEvent("skip", track);
  }
}

function playbackSnapshot() {
  const track = currentTrack();
  const currentMs = playbackPositionMs();

  return {
    trackId: track?.id || "",
    queueIds: state.queue.map((item) => item.id),
    currentIndex: state.currentIndex,
    currentTime: currentMs,
    volume: state.volume,
    muted: state.muted,
    shuffle: state.shuffle,
    repeat: state.repeat,
    activeShuffleProfileId: state.activeShuffleProfileId,
    queueContext: {
      ...state.queueContext,
      fadeSeconds: normalizeFadeSeconds(state.queueContext?.fadeSeconds)
    }
  };
}

function schedulePlaybackSave() {
  if (state.playbackSaveTimer) return;
  state.playbackSaveTimer = setTimeout(() => {
    state.playbackSaveTimer = null;
    api("/api/playback-state", {
      method: "POST",
      body: JSON.stringify(playbackSnapshot())
    }).catch(() => {});
  }, 1500);
}

function savePlaybackNow() {
  const payload = JSON.stringify(playbackSnapshot());
  if (navigator.sendBeacon && !window.VoidFMBrowserApi?.enabled) {
    navigator.sendBeacon(localApiTokenUrl("/api/playback-state"), new Blob([payload], { type: "application/json" }));
    return;
  }
  api("/api/playback-state", { method: "POST", body: payload }).catch(() => {});
}

function mediaSessionSupported() {
  return Boolean(navigator.mediaSession);
}

function mediaSessionArtworkForTrack(track) {
  if (track?.thumb) {
    const browserArtwork = window.VoidFMBrowserApi?.syncArtworkUrl?.(track.thumb);
    return [
      { src: browserArtwork || `/api/artwork?path=${encodeURIComponent(track.thumb)}`, sizes: "512x512", type: "image/jpeg" }
    ];
  }
  return [
    { src: "./assets/voidfm-icon-192.png", sizes: "192x192", type: "image/png" },
    { src: "./assets/voidfm-icon-512.png", sizes: "512x512", type: "image/png" }
  ];
}

function syncMediaSessionPosition() {
  if (!mediaSessionSupported() || typeof navigator.mediaSession.setPositionState !== "function") return;
  const progress = playbackProgressSnapshot();
  if (!progress.track || progress.duration <= 0) {
    try {
      navigator.mediaSession.setPositionState();
    } catch {
      // Some Chromium builds reject clearing position state; metadata still works.
    }
    return;
  }
  const duration = progress.duration / 1000;
  const position = Math.min(duration, Math.max(0, progress.currentMs / 1000));
  try {
    navigator.mediaSession.setPositionState({ duration, playbackRate: reversePlaybackRequested() ? -playbackRateFromSpeedOffset() : playbackRateFromSpeedOffset(), position });
  } catch {
    // Media keys should keep working even if position reporting is unavailable.
  }
}

function syncMediaSession() {
  if (!mediaSessionSupported()) return;
  const track = currentTrack();
  try {
    if (track && typeof MediaMetadata === "function") {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: trackTitleWithTrimMarker(track, trackTrimForContext(track)),
        artist: track.artist || "Unknown Artist",
        album: track.album || "",
        artwork: mediaSessionArtworkForTrack(track)
      });
    } else if (!track) {
      navigator.mediaSession.metadata = null;
    }
    navigator.mediaSession.playbackState = track ? (state.isPlaying ? "playing" : "paused") : "none";
  } catch {
    // Media Session is a best-effort OS integration; playback itself is unaffected.
  }
}

function seekBySeconds(seconds) {
  const track = currentTrack();
  if (!track) return;
  const nextTime = clampToPlaybackWindow(track, playbackPositionMs() + seconds * 1000);
  seekPlaybackToMs(nextTime);
}

function pausePlayback(options = {}) {
  clearCrossfade();
  stopReversePlayback({ positionMs: playbackPositionMs(), render: options.render !== false });
  audio.pause();
  clearFakeTimer();
  state.isPlaying = false;
  schedulePlaybackSave();
  if (options.render !== false) renderPlayer();
}

function stopPlayback() {
  const track = currentTrack();
  clearCrossfade();
  stopReversePlayback({ positionMs: playbackPositionMs() });
  audio.pause();
  clearFakeTimer();
  state.isPlaying = false;
  state.currentTime = track ? playbackWindowForTrack(track).startMs : 0;
  if (audio.src) {
    try {
      audio.currentTime = state.currentTime / 1000;
    } catch {
      // The stream may not be seekable yet; state will still resume from the start.
    }
  }
  schedulePlaybackSave();
  renderPlayer();
}

function setMediaSessionAction(action, handler) {
  if (!mediaSessionSupported() || typeof navigator.mediaSession.setActionHandler !== "function") return;
  try {
    navigator.mediaSession.setActionHandler(action, handler);
  } catch {
    // Unsupported actions differ by browser/version, so skip whatever this build lacks.
  }
}

function wireMediaSession() {
  if (!mediaSessionSupported()) return;
  setMediaSessionAction("play", () => {
    if (!state.isPlaying) togglePlay();
  });
  setMediaSessionAction("pause", () => pausePlayback());
  setMediaSessionAction("stop", () => stopPlayback());
  setMediaSessionAction("previoustrack", () => previousTrack());
  setMediaSessionAction("nexttrack", () => nextTrack({ manual: true, reason: "media-session-next" }));
  setMediaSessionAction("seekbackward", (details = {}) => seekBySeconds(-Number(details.seekOffset || 10)));
  setMediaSessionAction("seekforward", (details = {}) => seekBySeconds(Number(details.seekOffset || 10)));
  setMediaSessionAction("seekto", (details = {}) => {
    const track = currentTrack();
    if (!track || typeof details.seekTime !== "number") return;
    const nextTime = clampToPlaybackWindow(track, details.seekTime * 1000);
    seekPlaybackToMs(nextTime);
  });
  syncMediaSession();
}

function handleMediaKeyDown(event) {
  if (event.repeat) return false;
  const actions = {
    MediaPlayPause: () => togglePlay(),
    MediaStop: () => stopPlayback(),
    MediaTrackPrevious: () => previousTrack(),
    MediaTrackNext: () => nextTrack({ manual: true, reason: "media-key-next" })
  };
  const action = actions[event.key];
  if (!action) return false;
  event.preventDefault();
  action();
  return true;
}

function restorePlayback(saved) {
  applyVolume(saved?.volume ?? state.volume);
  setMuted(Boolean(saved?.muted));
  if (!saved?.queueIds?.length) return;
  const queue = saved.queueIds.map(trackById).filter(Boolean);
  if (!queue.length) return;

  state.queue = queue;
  state.currentIndex = Math.min(Math.max(0, Number(saved.currentIndex || 0)), queue.length - 1);
  state.currentTime = Number(saved.currentTime || 0);
  state.shuffle = Boolean(saved.shuffle);
  state.repeat = ["off", "all", "one"].includes(saved.repeat) ? saved.repeat : "all";
  state.activeShuffleProfileId = saved.activeShuffleProfileId || "";
  state.queueContext = saved.queueContext
    ? { ...saved.queueContext, fadeSeconds: normalizeFadeSeconds(saved.queueContext.fadeSeconds) }
    : shuffleQueueContext(activeShuffleProfile());
  if (state.queueContext?.type === "playlist") {
    const playlist = playlistById(state.queueContext.playlistId);
    const profile = state.queueContext.shuffleProfileId ? shuffleProfileById(state.queueContext.shuffleProfileId) : playlistDefaultProfile(playlist);
    if (playlist) state.queueContext = playlistQueueContext(playlist, profile?.id || "");
    state.activeShuffleProfileId = profile?.id || "";
    applyPlaylistDefaultEqForContext(state.queueContext, { save: false, render: false });
  }
  state.isPlaying = false;
  loadCurrentTrack({ preserveTime: true, currentTime: state.currentTime });
}

function cycleShuffleProfile() {
  if (!state.customShuffles.length) return false;
  const currentIndex = state.customShuffles.findIndex((profile) => profile.id === state.activeShuffleProfileId);
  const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % state.customShuffles.length;
  state.activeShuffleProfileId = state.customShuffles[nextIndex].id;
  state.shuffle = true;
  schedulePlaybackSave();
  return true;
}

function togglePlay() {
  resumeEqAudioContext();
  if (!currentTrack()) {
    setQueue(buildSmartQueue(null, currentSurfaceQueueBuildOptions()), 0, true, currentSurfaceQueueContext());
    return;
  }

  const track = currentTrack();
  if (!state.isPlaying && unsupportedPlaybackReason(track)) {
    showToast(unsupportedPlaybackMessage(track));
    renderPlayer();
    return;
  }

  state.isPlaying = !state.isPlaying;

  if (state.isPlaying) {
    applyPlaylistDefaultEqForContext(state.queueContext, { save: false, render: false });
    const nextTime = clampToPlaybackWindow(track, playbackPositionMs());
    if (!reversePlaybackRequested() && audio.src && nextTime !== playbackPositionMs()) audio.currentTime = nextTime / 1000;
    state.currentTime = nextTime;
    if (canStreamTrack(track)) {
      if (reversePlaybackRequested()) {
        startReversePlayback({ positionMs: state.currentTime });
      } else if (!audio.src) {
        loadCurrentTrack({ preserveTime: true, currentTime: state.currentTime, autoplay: true });
      } else {
        audio.play().catch((error) => handleAudioPlayFailure(track, error));
      }
    } else {
      startFakePlayback(track);
    }
  } else {
    clearCrossfade();
    stopReversePlayback({ positionMs: playbackPositionMs() });
    audio.pause();
    clearFakeTimer();
  }

  renderPlayer();
}

function playTrack(trackId) {
  const track = trackById(trackId);
  if (unsupportedPlaybackReason(track)) {
    showToast(unsupportedPlaybackMessage(track));
    return;
  }
  setQueueWithSoftFade(
    buildSmartQueue(trackId, currentSurfaceQueueBuildOptions({ sourceTracks: currentSurfaceTracks() })),
    0,
    true,
    currentSurfaceQueueContext(),
    { reason: "track-choice" }
  );
}

function playPlaylist(playlistId) {
  const playlist = state.playlists.find((item) => item.id === playlistId);
  if (!playlist) return;
  const defaultProfile = playlistDefaultProfile(playlist);
  const queue = buildSmartQueue(null, playlistQueueBuildOptions(playlist, {
    forceShuffle: defaultProfile ? true : state.shuffle
  }));
  if (!queue.length) {
    alert("No playable songs in this playlist.");
    return;
  }
  if (defaultProfile) {
    state.activeShuffleProfileId = defaultProfile.id;
    state.shuffle = true;
  } else {
    state.activeShuffleProfileId = "";
  }
  setQueueWithSoftFade(queue, 0, true, playlistQueueContext(playlist, defaultProfile?.id || ""), { reason: "playlist-choice" });
}

function playShuffleProfile(profileId, sourceTracks = state.tracks) {
  const profile = state.customShuffles.find((item) => item.id === profileId);
  if (!profile) return;
  const queue = buildSmartQueue(null, {
    sourceTracks,
    profileId: profile.id,
    forceShuffle: true
  });
  if (!queue.length) {
    alert("That custom shuffle does not match enough playable songs here.");
    return;
  }
  state.activeShuffleProfileId = profile.id;
  state.shuffle = true;
  setQueueWithSoftFade(queue, 0, true, shuffleQueueContext(profile), { reason: "shuffle-profile-choice" });
}

function currentSurfaceTracks() {
  if (state.view === "playlists" && state.activePlaylistId) return activePlaylistTracks();
  if (state.view !== "library") return state.tracks;
  if (!state.artistFilter && !state.albumFilter && state.libraryView === "home") return state.tracks;
  return filteredTracks();
}

function canStartSoftSkip(shouldAutoplay) {
  return canStartSoftFade(shouldAutoplay) && !state.crossfadeTimer;
}

function softSkipTargetIndex() {
  if (!state.queue.length || state.currentIndex < 0 || state.repeat === "one") return -1;
  return nextPlayableIndex({ wrap: state.repeat === "all" });
}

function fadeOutThenLoadSoftSkipTarget(targetIndex, shouldAutoplay, options = {}) {
  if (targetIndex < 0 || targetIndex === state.currentIndex || !state.queue[targetIndex]) return false;
  const oldAudio = audio;
  const oldTrack = currentTrack();
  const next = state.queue[targetIndex];
  if (options.recordSkip !== false) maybeRecordSkipCurrent();
  playbackTrace("soft-skip-fadeout-fallback", {
    fromIndex: state.currentIndex,
    toIndex: targetIndex,
    fromTrackId: oldTrack?.id || "",
    toTrackId: next?.id || "",
    reason: options.reason || ""
  });

  if (state.crossfadeTimer) {
    clearInterval(state.crossfadeTimer);
    state.crossfadeTimer = null;
  }
  clearPlaybackStartGuard();
  const token = state.crossfadeToken + 1;
  state.crossfadeToken = token;
  state.audioTransitioning = true;

  const startedAt = performance.now();
  const durationMs = Math.max(350, SOFT_SKIP_FADE_SECONDS * 1000);
  const startVolume = oldAudio?.src ? oldAudio.volume : state.volume;
  state.crossfadeTimer = setInterval(() => {
    if (token !== state.crossfadeToken) return;
    const progress = Math.min(1, (performance.now() - startedAt) / durationMs);
    if (oldAudio?.src) oldAudio.volume = Math.max(0, startVolume * (1 - progress));
    if (progress < 1) return;
    clearInterval(state.crossfadeTimer);
    state.crossfadeTimer = null;
    if (token !== state.crossfadeToken) return;
    state.currentIndex = targetIndex;
    state.currentTime = playbackWindowForTrack(next).startMs;
    loadCurrentTrack({ autoplay: shouldAutoplay });
  }, 50);
  return true;
}

function attemptSoftSkip(shouldAutoplay) {
  if (!canStartSoftSkip(shouldAutoplay)) return false;
  const targetIndex = softSkipTargetIndex();
  const current = currentTrack();
  const next = targetIndex >= 0 ? state.queue[targetIndex] : null;
  if (targetIndex < 0 || targetIndex === state.currentIndex || !canStreamTrack(current)) return false;
  if (!canStreamTrack(next)) {
    return fadeOutThenLoadSoftSkipTarget(targetIndex, shouldAutoplay, {
      reason: "next-not-streamable"
    });
  }
  const currentId = current.id;
  startCrossfadeToIndex(targetIndex, {
    fadeSeconds: SOFT_SKIP_FADE_SECONDS,
    scrobbleCurrent: false,
    autoplay: shouldAutoplay,
    fallbackOnFailure: false,
    startTimeoutMs: SOFT_SKIP_PREPARE_TIMEOUT_MS
  }).then((started) => {
    if (!started && currentTrack()?.id === currentId) {
      fadeOutThenLoadSoftSkipTarget(targetIndex, shouldAutoplay, {
        recordSkip: false,
        reason: "prepare-timeout"
      });
    }
  }).catch(() => {
    if (currentTrack()?.id === currentId) {
      fadeOutThenLoadSoftSkipTarget(targetIndex, shouldAutoplay, {
        recordSkip: false,
        reason: "prepare-error"
      });
    }
  });
  return true;
}

function shouldHoldManualNextForSoftSkip(shouldAutoplay) {
  return Boolean(
    state.softSkip
    && shouldAutoplay
    && state.isPlaying
    && (state.crossfadeTimer || state.audioTransitioning)
  );
}

function nextTrack(options = {}) {
  if (!state.queue.length) return;
  const shouldAutoplay = options.autoplay ?? state.isPlaying;
  const manualSkip = options.manual !== false;
  if (manualSkip && attemptSoftSkip(shouldAutoplay)) return;
  if (manualSkip && shouldHoldManualNextForSoftSkip(shouldAutoplay)) return;
  if (manualSkip) maybeRecordSkipCurrent();
  if (state.repeat === "one") {
    loadCurrentTrack({ autoplay: shouldAutoplay });
    return;
  }
  if (state.currentIndex < state.queue.length - 1) {
    state.currentIndex += 1;
  } else if (state.repeat === "all") {
    state.currentIndex = 0;
  } else {
    state.isPlaying = false;
    state.playbackHandoffStartedAt = 0;
    state.playbackHandoffReason = "";
    renderPlayer();
    return;
  }
  loadCurrentTrack({ autoplay: shouldAutoplay });
}

function isPlayableQueueTrack(track) {
  return Boolean(track && !unsupportedPlaybackReason(track));
}

function nextPlayableIndex(options = {}) {
  if (!state.queue.length || state.currentIndex < 0) return -1;
  const shouldWrap = options.wrap ?? (state.repeat === "all");
  for (let step = 1; step <= state.queue.length; step += 1) {
    let index = state.currentIndex + step;
    if (index >= state.queue.length) {
      if (!shouldWrap) break;
      index %= state.queue.length;
    }
    if (index === state.currentIndex) break;
    if (isPlayableQueueTrack(state.queue[index])) return index;
  }
  return -1;
}

function advanceToNextPlayable(options = {}) {
  const nextIndex = nextPlayableIndex({ wrap: state.repeat === "all" || options.forceWrap === true });
  if (nextIndex < 0) {
    playbackTrace("skip-to-next-empty", { reason: options.reason || "", queueIndex: state.currentIndex });
    state.isPlaying = false;
    state.playbackHandoffStartedAt = 0;
    state.playbackHandoffReason = "";
    finishAudioTransition();
    renderPlaybackSurfaces();
    schedulePlaybackSave();
    return false;
  }
  playbackTrace("skip-to-next", {
    reason: options.reason || "",
    fromIndex: state.currentIndex,
    toIndex: nextIndex,
    fromTrackId: currentTrack()?.id || "",
    toTrackId: state.queue[nextIndex]?.id || ""
  });
  state.currentIndex = nextIndex;
  loadCurrentTrack({ autoplay: options.autoplay ?? true });
  return true;
}

function previousTrack() {
  if (!state.queue.length) return;
  const window = currentPlaybackWindow();
  const positionSeconds = playbackPositionMs() / 1000;
  if (positionSeconds - (window.startMs / 1000) > 4) {
    seekPlaybackToMs(window.startMs);
    return;
  }
  maybeRecordSkipCurrent();
  state.currentIndex = Math.max(0, state.currentIndex - 1);
  loadCurrentTrack();
}

function handleAudioEnded(player) {
  if (player !== audio) return;
  if (recoverEarlyAudioEnd(player)) return;
  earlyEndedRecovery = { trackId: "", count: 0 };
  handleEnded();
}

function handleEnded() {
  const endedTrack = currentTrack();
  markPlaybackHandoff("ended", endedTrack);
  maybeScrobbleCurrent(true);
  stopReversePlayback({ updateState: false });
  clearFakeTimer();
  nextTrack({ manual: false, autoplay: true });
}

function renderNav() {
  const labels = [
    ["library", '<img class="nav-voidfm-icon" src="./assets/voidfm-icon.png" alt="">', "Home"],
    ["playlists", icons.list, "Playlists"],
    ["shuffle", icons.shuffle, "Custom Shuffle"],
    ["settings", icons.settings, "Settings"]
  ];

  $$(".nav-item").forEach((button) => {
    const item = labels.find(([view]) => view === button.dataset.view);
    if (!item) return;
    button.innerHTML = `${item[1]}<span>${item[2]}</span>`;
  });
  renderLibraryNav();

  $(".search-icon").innerHTML = icons.search;
  renderVolumeControl();
  $('[data-action="back"]').innerHTML = icons.arrowLeft;
  $('[data-action="forward"]').innerHTML = icons.arrowRight;
  renderHistoryButtons();
  $("#refreshButton").innerHTML = `${icons.refresh}<span>Refresh</span>`;
  $("#refreshButton").title = "Rescan music sources";
  $("#refreshButton").setAttribute("aria-label", "Rescan music sources");
  $("#playAllButton").innerHTML = icons.play;
  $("#shuffleAllButton").innerHTML = `${icons.shuffle}<span>Standard Shuffle</span>`;
  $("#playlistFromSelectedButton").innerHTML = `${icons.plus}<span>Playlist</span>`;
  if ($("#queueMenuButton")) $("#queueMenuButton").innerHTML = icons.more;
}

function renderLibraryNav() {
  $$(".nav-subitem").forEach((button) => {
    const active = button.dataset.libraryView === state.libraryView
      && state.view === "library"
      && !state.artistFilter
      && !state.albumFilter;
    const detailActive = state.view === "library"
      && ((button.dataset.libraryView === "artists" && state.artistFilter)
        || (button.dataset.libraryView === "albums" && state.albumFilter));
    button.classList.toggle("active", active || detailActive);
  });
}

function shuffleLabel() {
  const profile = activeShuffleProfile();
  return profile ? profile.name : "Standard Shuffle";
}

function currentShuffleLabel() {
  if (state.view === "playlists" && state.activePlaylistId) return playlistShuffleLabel(activePlaylist());
  return shuffleLabel();
}

function shuffleProfileOptions(selectedId = state.activeShuffleProfileId, includeNone = false, noneLabel = "Standard Shuffle") {
  const noneOption = includeNone ? `<option value="" ${selectedId ? "" : "selected"}>${escapeHtml(noneLabel)}</option>` : "";
  return noneOption + state.customShuffles.map((profile) => `
    <option value="${escapeHtml(profile.id)}" ${profile.id === selectedId ? "selected" : ""}>
      ${escapeHtml(profile.name)}
    </option>
  `).join("");
}

function renderConnection() {
  const plexSelected = state.settings?.musicSectionKeys?.length || 0;
  const localSelected = (state.settings?.localLibraries || []).filter((library) => library.enabled !== false).length;
  const sources = [];
  if (state.settings?.configured) sources.push(plexSelected ? `${plexSelected} Plex` : "Plex");
  if (localSelected) sources.push(`${localSelected} Local`);
  $("#connectionStatus").textContent = sources.length
    ? `${sources.join(" / ")} Source${sources.length === 1 ? "" : "s"}`
    : "Demo Library";
}

function renderSurface() {
  const titles = {
    library: ["Library", "All Music"],
    playlists: ["Collection", "Playlists"],
    shuffle: ["Shuffle Rules", "Custom Shuffle"],
    blocked: ["Rules", "Blocked"],
    settings: ["", "Settings"],
    equalizer: ["", "Equalizer"],
    [AB_LOOP_ADVANCED_VIEW]: ["Looper", "Advanced"]
  };
  const utilityView = ["blocked", "settings", "shuffle", "equalizer", AB_LOOP_ADVANCED_VIEW].includes(state.view);
  const surface = $(".now-surface");
  surface.classList.toggle("utility-surface", utilityView);
  surface.classList.toggle("hidden-surface", state.view === "shuffle" || state.view === AB_LOOP_ADVANCED_VIEW);
  $(".surface-actions").style.display = utilityView ? "none" : "";
  $("#coverStack").style.display = utilityView ? "none" : "";

  let [eyebrow, title] = titles[state.view] || titles.library;
  const localLibraryCount = (state.settings?.localLibraries || []).filter((library) => library.enabled !== false).length;
  let meta = state.view === "settings"
    ? `${state.settings?.configured ? "Plex connected" : "Plex not connected"} / ${state.sections.length} Plex libraries / ${localLibraryCount} local / ${state.customShuffles.length} shuffle profiles`
    : state.view === "equalizer"
      ? "Fine-tune your sound. Adjust frequencies to match your vibe."
    : `${state.tracks.length} tracks, ${state.blacklist.length} blocked, ${state.links.length} links`;
  let covers = state.tracks.slice(0, 3);
  let heroCoverStyle = "";
  let heroBackground = "";

  if (state.view === "library") {
    if (state.artistFilter) {
      const visibleTracks = filteredTracks();
      eyebrow = "Artist";
      title = state.artistFilter;
      meta = `${visibleTracks.length} songs`;
      covers = visibleTracks.slice(0, 3);
    } else if (state.albumFilter) {
      const visibleTracks = filteredTracks();
      const album = albumSummaryByKey(state.albumFilter);
      eyebrow = "Album";
      title = album?.title || "Album";
      meta = `${album?.artist || "Unknown Artist"} / ${visibleTracks.length} songs${album?.year ? ` / ${album.year}` : ""}`;
      covers = visibleTracks.slice(0, 3);
    } else if (state.libraryView === "home") {
      const artists = artistSummaries(false);
      const albums = albumSummaries(false);
      const featured = homeFeaturedTracks();
      eyebrow = "Library";
      title = "Home";
      meta = `${state.tracks.length} songs / ${artists.length} artists / ${albums.length} albums`;
      covers = featured.slice(0, 3);
    } else if (state.libraryView === "artists") {
      const artists = artistSummaries();
      eyebrow = "Library";
      title = "Artists";
      meta = `${artists.length} artists`;
      covers = artists.map((artist) => artist.cover).slice(0, 3);
    } else if (state.libraryView === "albums") {
      const albums = albumSummaries();
      eyebrow = "Library";
      title = "Albums";
      meta = `${albums.length} albums`;
      covers = albums.map((album) => album.cover).slice(0, 3);
    } else {
      const visibleTracks = filteredTracks();
      eyebrow = "Library";
      title = "Songs";
      meta = `${visibleTracks.length} songs`;
      covers = visibleTracks.slice(0, 3);
    }
  } else if (state.view === "playlists" && state.activePlaylistId) {
    const playlist = activePlaylist();
    const tracks = playlistTracks(playlist);
    if (playlist) {
      eyebrow = "Playlist";
      title = playlist.name;
      meta = `${tracks.length} song${tracks.length === 1 ? "" : "s"}`;
      covers = tracks.slice(0, 3);
      heroCoverStyle = playlistArtStyle(playlist, tracks[0]);
      heroBackground = playlistHeroBackground(playlist);
    }
  }

  surface.classList.toggle("playlist-custom-surface", Boolean(heroBackground));
  if (heroBackground) surface.style.setProperty("--playlist-hero-background", heroBackground);
  else surface.style.removeProperty("--playlist-hero-background");

  $("#surfaceEyebrow").textContent = eyebrow;
  $("#surfaceEyebrow").hidden = !eyebrow;
  $("#surfaceTitle").textContent = title;
  $("#surfaceMeta").textContent = meta;
  const coverStack = $("#coverStack");
  coverStack.classList.toggle("single-cover", Boolean(heroCoverStyle));
  coverStack.innerHTML = heroCoverStyle
    ? `<div class="cover-tile" style="${heroCoverStyle}"></div>`
    : covers.map((track) => `<div class="cover-tile" style="${artStyle(track)}"></div>`).join("");
}

function renderSidebarPlaylists() {
  $("#sidebarPlaylists").innerHTML = state.playlists.length
    ? state.playlists.map((playlist) => {
      const active = state.view === "playlists" && state.activePlaylistId === playlist.id;
      const style = playlistSidebarStyle(playlist);
      return `
      <button type="button" class="${playlistSidebarClass(playlist, active)}" draggable="true" ${style ? `style="${escapeHtml(style)}"` : ""} data-open-playlist="${escapeHtml(playlist.id)}" data-playlist-reorder-id="${escapeHtml(playlist.id)}" data-playlist-drop-id="${escapeHtml(playlist.id)}">
        ${escapeHtml(playlist.name)}
      </button>`;
    }).join("")
    : '<div class="muted-text">No playlists</div>';
}

function renderLibraryControls() {
  const fields = FILTER_FIELDS.filter(([field]) => fieldHasData(field));
  const options = filterValueOptions(state.libraryFilterField);
  const hasValueControl = options.length > 1 || state.libraryFilterField !== "all";
  const valueControl = hasValueControl
    ? `<label class="filter-field">
        <span>Value</span>
        <select data-library-filter-value>
          ${options.map(([value, label]) => `<option value="${escapeHtml(value)}" ${value === state.libraryFilterValue ? "selected" : ""}>${escapeHtml(label)}</option>`).join("")}
        </select>
      </label>`
    : "";

  return `
    <div class="filter-toolbar ${hasValueControl ? "has-filter-value" : ""}">
      <label class="filter-field">
        <span>Filter</span>
        <select data-library-filter-field>
          ${fields.map(([value, label]) => `<option value="${escapeHtml(value)}" ${value === state.libraryFilterField ? "selected" : ""}>${escapeHtml(label)}</option>`).join("")}
        </select>
      </label>
      ${valueControl}
      <label class="filter-field filter-sort-field">
        <span>Sort</span>
        <select data-library-sort>
          ${sortOptions().map(([value, label]) => `<option value="${escapeHtml(value)}" ${value === state.librarySort ? "selected" : ""}>${escapeHtml(label)}</option>`).join("")}
        </select>
      </label>
      <button class="tool-button" type="button" data-action="clear-library-filter" title="Reset filters" aria-label="Reset filters">${icons.x}<span>Reset</span></button>
    </div>
  `;
}

function shouldShowVoidReview(date = new Date()) {
  return date.getMonth() === 11 && date.getDate() >= 1;
}

function normalizedReviewYear(value = new Date().getFullYear()) {
  const year = Number(value || 0);
  return Number.isInteger(year) && year > 1999 && year < 10000 ? year : new Date().getFullYear();
}

function yearReviewPlaylistName(year) {
  return `VoidFM ${normalizedReviewYear(year)}`;
}

function isYearReviewPlaylist(playlist) {
  return playlist?.generatedBy === "voidfm-year-review" && Number(playlist.annualReviewYear || 0) > 0;
}

function yearReviewPlaylistForYear(year) {
  const targetYear = normalizedReviewYear(year);
  return state.playlists.find((playlist) => isYearReviewPlaylist(playlist) && Number(playlist.annualReviewYear) === targetYear) || null;
}

function yearReviewPlaylists() {
  return state.playlists
    .filter(isYearReviewPlaylist)
    .slice()
    .sort((left, right) => Number(right.annualReviewYear || 0) - Number(left.annualReviewYear || 0));
}

function reviewEventInYear(event, year) {
  if (!["play", "complete"].includes(event?.type)) return false;
  const time = dateValue(event.at);
  return Boolean(time && new Date(time).getFullYear() === year);
}

function reviewListeningEvents(year) {
  const targetYear = normalizedReviewYear(year);
  return (state.listeningEvents || []).filter((event) => reviewEventInYear(event, targetYear));
}

function reviewTrackScores(year) {
  const scores = new Map();
  for (const event of reviewListeningEvents(year)) {
    const track = trackById(event.trackId);
    if (!track) continue;
    const current = scores.get(track.id) || {
      track,
      trackId: track.id,
      plays: 0,
      listenedMs: 0,
      lastPlayedAt: 0
    };
    current.plays += 1;
    current.listenedMs += Math.max(0, Number(event.listenedMs || 0));
    current.lastPlayedAt = Math.max(current.lastPlayedAt, dateValue(event.at));
    scores.set(track.id, current);
  }
  return Array.from(scores.values()).sort((left, right) => (
    right.plays - left.plays
    || right.listenedMs - left.listenedMs
    || right.lastPlayedAt - left.lastPlayedAt
    || compareText(left.track.title, right.track.title)
  ));
}

function reviewScoreByPlays(left, right) {
  return right.plays - left.plays
    || right.listenedMs - left.listenedMs
    || right.lastPlayedAt - left.lastPlayedAt
    || compareText(left.track?.title, right.track?.title);
}

function bestReviewClipTrack(group, item) {
  if (!group.track || item.plays > group.clipPlays || (item.plays === group.clipPlays && item.listenedMs > group.clipScore)) {
    group.track = item.track;
    group.clipScore = item.listenedMs;
    group.clipPlays = item.plays;
  }
}

function reviewArtistScores(trackScores) {
  const groups = new Map();
  for (const item of trackScores) {
    const name = cleanText(item.track.artist) || "Unknown Artist";
    const group = groups.get(name) || { name, listenedMs: 0, plays: 0, tracks: 0, track: null, clipScore: -1, clipPlays: -1 };
    group.listenedMs += item.listenedMs;
    group.plays += item.plays;
    group.tracks += 1;
    bestReviewClipTrack(group, item);
    groups.set(name, group);
  }
  return Array.from(groups.values()).sort((left, right) => (
    right.plays - left.plays
    || right.listenedMs - left.listenedMs
    || compareText(left.name, right.name)
  ));
}

function reviewGenreScores(trackScores) {
  const groups = new Map();
  for (const item of trackScores) {
    const genres = (item.track.genres || []).map(cleanText).filter(Boolean);
    for (const name of genres) {
      const group = groups.get(name) || { name, listenedMs: 0, plays: 0, tracks: 0, track: null, clipScore: -1, clipPlays: -1 };
      group.listenedMs += item.listenedMs;
      group.plays += item.plays;
      group.tracks += 1;
      bestReviewClipTrack(group, item);
      groups.set(name, group);
    }
  }
  return Array.from(groups.values()).sort((left, right) => (
    right.plays - left.plays
    || right.listenedMs - left.listenedMs
    || compareText(left.name, right.name)
  ));
}

function randomYearReviewItem(items) {
  if (!items.length) return null;
  return items[Math.floor(Math.random() * items.length)] || null;
}

function firstUnusedReviewTrack(items, usedIds) {
  return items.find((item) => item?.track?.id && !usedIds.has(item.track.id))?.track || null;
}

function firstUnusedReviewTrackFromTracks(tracks, usedIds) {
  return tracks.find((track) => track?.id && !usedIds.has(track.id)) || null;
}

function addReviewClip(plan, key, track, usedIds, fallbackItems = []) {
  const picked = track?.id && !usedIds.has(track.id) ? track : firstUnusedReviewTrack(fallbackItems, usedIds);
  plan[key] = picked || track || null;
  if (plan[key]?.id) usedIds.add(plan[key].id);
}

function buildYearReviewClipPlan(story) {
  const usedIds = new Set();
  const plan = {};
  const byPlays = story.allTrackScores.slice().sort(reviewScoreByPlays);
  const topTen = byPlays.slice(0, 10);
  const topArtistName = story.topArtists[0]?.name || "";
  const artistItems = byPlays.filter((item) => (cleanText(item.track.artist) || "Unknown Artist") === topArtistName);
  const topGenreName = story.topGenres[0]?.name || "";
  const genreItems = byPlays.filter((item) => (item.track.genres || []).map(cleanText).includes(topGenreName));

  addReviewClip(plan, "songs", firstUnusedReviewTrack(byPlays, usedIds), usedIds, byPlays);
  addReviewClip(plan, "artists", firstUnusedReviewTrack(artistItems, usedIds), usedIds, byPlays);
  addReviewClip(plan, "genres", firstUnusedReviewTrack(genreItems, usedIds), usedIds, byPlays);

  const hourCandidates = topTen.filter((item) => !usedIds.has(item.track.id));
  const randomHourTrack = randomYearReviewItem(hourCandidates)?.track || firstUnusedReviewTrack(topTen, usedIds);
  addReviewClip(plan, "hours", randomHourTrack, usedIds, byPlays);

  const playlistTrack = firstUnusedReviewTrackFromTracks(story.playlistTracks, usedIds)
    || firstUnusedReviewTrack(byPlays, usedIds);
  addReviewClip(plan, "playlist", playlistTrack, usedIds, byPlays);
  return plan;
}

function buildYearReviewStory(year = new Date().getFullYear(), playlist = null, clipPlan = null) {
  const targetYear = normalizedReviewYear(year);
  const events = reviewListeningEvents(targetYear);
  const allTrackScores = reviewTrackScores(targetYear);
  const totalMs = events.reduce((total, event) => total + Math.max(0, Number(event.listenedMs || 0)), 0);
  const artists = reviewArtistScores(allTrackScores);
  const genres = reviewGenreScores(allTrackScores);
  const resolvedPlaylist = playlist || yearReviewPlaylistForYear(targetYear);
  const story = {
    year: targetYear,
    events,
    totalMs,
    playCount: events.length,
    uniqueTrackCount: allTrackScores.length,
    allTrackScores,
    topSongs: allTrackScores.slice(0, 10),
    topArtists: artists.slice(0, 5),
    topGenres: genres.slice(0, 5),
    playlist: resolvedPlaylist,
    playlistTracks: resolvedPlaylist ? playlistTracks(resolvedPlaylist) : allTrackScores.slice(0, 50).map((item) => item.track)
  };
  story.clipPlan = clipPlan || buildYearReviewClipPlan(story);
  return story;
}

function formatReviewHours(ms) {
  const hours = Math.max(0, Number(ms || 0) / 3600000);
  if (hours >= 100) return Math.round(hours).toLocaleString();
  if (hours >= 10) return hours.toFixed(1).replace(/\.0$/, "");
  if (hours > 0) return hours.toFixed(1);
  return "0";
}

function formatReviewListenTime(ms) {
  const hours = Math.max(0, Number(ms || 0) / 3600000);
  if (hours >= 1) return `${formatReviewHours(ms)}h`;
  const minutes = Math.round(Math.max(0, Number(ms || 0)) / 60000);
  return `${minutes}m`;
}

function reviewRankList(items, labelForItem, metaForItem, options = {}) {
  const empty = options.empty || "Nothing here yet";
  return `
    <ol class="year-review-rank-list ${options.compact ? "compact" : ""}">
      ${items.length ? items.map((item, index) => `
        <li>
          <span class="year-review-rank">${index + 1}</span>
          <span class="year-review-rank-main">
            <strong>${escapeHtml(labelForItem(item))}</strong>
            <small>${escapeHtml(metaForItem(item))}</small>
          </span>
        </li>
      `).join("") : `<li class="year-review-empty-row">${escapeHtml(empty)}</li>`}
    </ol>
  `;
}

function yearReviewSlides(story) {
  const topSong = story.topSongs[0]?.track || null;
  const clips = story.clipPlan || {};
  if (!story.topSongs.length) {
    return [{
      id: "empty",
      label: "Review",
      title: `${story.year} is still quiet`,
      stat: "0 hours",
      copy: "Play music in VoidFM and this will fill with your year.",
      clipTrack: null,
      body: '<div class="year-review-empty">No listening history for this year yet.</div>'
    }];
  }

  return [
    {
      id: "hours",
      label: "Hours",
      title: `${story.year} in the speakers`,
      stat: `${formatReviewHours(story.totalMs)} hours`,
      copy: `${story.playCount.toLocaleString()} plays across ${story.uniqueTrackCount.toLocaleString()} songs.`,
      clipTrack: clips.hours || topSong,
      body: `
        <div class="year-review-stat-grid">
          <div><strong>${story.playCount.toLocaleString()}</strong><span>plays</span></div>
          <div><strong>${story.uniqueTrackCount.toLocaleString()}</strong><span>songs</span></div>
          <div><strong>${formatReviewListenTime(story.topSongs[0]?.listenedMs || 0)}</strong><span>top song time</span></div>
        </div>
      `
    },
    {
      id: "artists",
      label: "Artists",
      title: "Top Artists",
      stat: story.topArtists[0]?.name || "Unknown Artist",
      copy: "The voices that kept returning.",
      clipTrack: clips.artists || story.topArtists[0]?.track || topSong,
      body: reviewRankList(
        story.topArtists,
        (item) => item.name,
        (item) => `${formatReviewListenTime(item.listenedMs)} / ${item.plays.toLocaleString()} plays`,
        { empty: "No artists yet" }
      )
    },
    {
      id: "songs",
      label: "Songs",
      title: "Top Songs",
      stat: story.topSongs[0]?.track?.title || "Unknown Title",
      copy: "The tracks that earned repeat gravity.",
      clipTrack: clips.songs || topSong,
      body: reviewRankList(
        story.topSongs,
        (item) => item.track.title || "Unknown Title",
        (item) => `${item.track.artist || "Unknown Artist"} / ${formatReviewListenTime(item.listenedMs)}`,
        { compact: true, empty: "No songs yet" }
      )
    },
    {
      id: "genres",
      label: "Genres",
      title: "Top Genres",
      stat: story.topGenres[0]?.name || "Genre data pending",
      copy: story.topGenres.length ? "The shapes your year kept choosing." : "Add genres through metadata and this gets sharper.",
      clipTrack: clips.genres || story.topGenres[0]?.track || topSong,
      body: reviewRankList(
        story.topGenres,
        (item) => item.name,
        (item) => `${formatReviewListenTime(item.listenedMs)} / ${item.tracks.toLocaleString()} songs`,
        { empty: "No genre metadata yet" }
      )
    },
    {
      id: "playlist",
      label: "Playlist",
      title: yearReviewPlaylistName(story.year),
      stat: `${story.playlistTracks.length || Math.min(50, story.topSongs.length)} songs`,
      copy: "Your top 50 most listened songs, saved with your playlists.",
      clipTrack: clips.playlist || story.playlistTracks[0] || topSong,
      body: `
        <div class="year-review-playlist-card">
          <div class="year-review-playlist-art" style="${playlistArtStyle(story.playlist, story.playlistTracks[0] || topSong)}"></div>
          <div>
            <strong>${escapeHtml(yearReviewPlaylistName(story.year))}</strong>
            <span>${(story.playlistTracks.length || Math.min(50, story.topSongs.length)).toLocaleString()} songs saved for ${story.year}</span>
          </div>
        </div>
      `
    }
  ];
}

function renderVoidReview() {
  if (!shouldShowVoidReview()) return "";
  const year = new Date().getFullYear();
  const story = buildYearReviewStory(year);
  const topSong = story.topSongs[0]?.track;

  return `
    <section class="void-review">
      <div>
        <div class="section-title">VoidFM ${year}</div>
        <h2>Year in Review</h2>
        <p>${escapeHtml(topSong ? `${topSong.title} led the year.` : "Your annual review is ready when the listening history is.")}</p>
      </div>
      <div class="review-stats">
        <div><strong>${formatReviewHours(story.totalMs)}</strong><span>hours</span></div>
        <div><strong>${escapeHtml(story.topArtists[0]?.name || "No artist yet")}</strong><span>top artist</span></div>
        <div><strong>${escapeHtml(topSong?.title || "No song yet")}</strong><span>top song</span></div>
        <div><strong>${escapeHtml(story.topGenres[0]?.name || "No genre yet")}</strong><span>top genre</span></div>
      </div>
      <div class="void-review-actions">
        <button class="primary-button" type="button" data-open-year-review="${year}">${icons.play}<span>Start Review</span></button>
        ${story.playlist ? `<button class="tool-button" type="button" data-open-playlist="${escapeHtml(story.playlist.id)}">${icons.list}<span>Open Playlist</span></button>` : ""}
      </div>
    </section>
  `;
}

function monthlyMostPlayedTracks(limit = 8) {
  const since = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const counts = new Map();
  for (const event of state.listeningEvents || []) {
    const time = dateValue(event.at);
    if (time < since || !["play", "complete"].includes(event.type)) continue;
    const current = counts.get(event.trackId) || { count: 0, lastPlayedAt: 0 };
    current.count += 1;
    current.lastPlayedAt = Math.max(current.lastPlayedAt, time);
    counts.set(event.trackId, current);
  }

  if (counts.size) {
    return Array.from(counts.entries())
      .map(([id, info]) => ({ track: trackById(id), ...info }))
      .filter((item) => item.track)
      .sort((left, right) => right.count - left.count || right.lastPlayedAt - left.lastPlayedAt)
      .slice(0, limit)
      .map((item) => item.track);
  }

  return state.tracks
    .filter((track) => playCountFor(track) > 0)
    .slice()
    .sort((left, right) => playCountFor(right) - playCountFor(left) || dateValue(lastPlayedFor(right)) - dateValue(lastPlayedFor(left)))
    .slice(0, limit);
}

function recentlyAddedTracks(limit = 8) {
  return state.tracks
    .filter((track) => dateValue(dateAddedFor(track)) > 0)
    .slice()
    .sort((left, right) => dateValue(dateAddedFor(right)) - dateValue(dateAddedFor(left)) || compareText(left.title, right.title))
    .slice(0, limit);
}

function newReleaseAlbums(limit = 8) {
  const groups = new Map();
  for (const track of state.tracks) {
    const releaseTime = dateValue(releaseDateFor(track));
    if (!releaseTime) continue;
    const key = albumKey(track);
    const existing = groups.get(key);
    if (!existing) {
      groups.set(key, {
        key,
        title: track.album || "Unknown Album",
        artist: albumArtistFor(track),
        releaseTime,
        year: track.year || new Date(releaseTime).getFullYear(),
        tracks: [track],
        cover: track
      });
      continue;
    }
    existing.tracks.push(track);
    existing.releaseTime = Math.max(existing.releaseTime, releaseTime);
    if (!existing.cover?.thumb && track.thumb) existing.cover = track;
  }

  return Array.from(groups.values())
    .sort((left, right) => right.releaseTime - left.releaseTime || compareText(left.title, right.title))
    .slice(0, limit);
}

function homeFeaturedTracks() {
  return [
    ...monthlyMostPlayedTracks(3),
    ...recentlyAddedTracks(3),
    ...newReleaseAlbums(3).map((album) => album.cover)
  ].filter(Boolean);
}

function homeTrackCard(track) {
  const unsupported = unsupportedPlaybackReason(track);
  const title = unsupported ? unsupportedPlaybackMessage(track) : `Play ${track.title}`;
  return `
    <button class="home-card ${unsupported ? "unsupported-format" : ""}" type="button" draggable="true" data-library-drag-type="track" data-library-drag-id="${escapeHtml(track.id)}" data-play-track="${escapeHtml(track.id)}" title="${escapeHtml(title)}" ${unsupported ? "disabled" : ""}>
      <div class="home-card-art" style="${artStyle(track)}"></div>
      <span>
        <strong>${escapeHtml(track.title)}</strong>
        <small>${escapeHtml(track.artist)}</small>
        ${unsupported ? unsupportedFormatBadgeHtml(track) : `<small>${escapeHtml(track.album)}</small>`}
      </span>
    </button>
  `;
}

function homeAlbumCard(album) {
  return `
    <button class="home-card" type="button" draggable="true" data-library-drag-type="album" data-library-drag-id="${escapeHtml(album.key)}" data-view-album="${escapeHtml(album.key)}">
      <div class="home-card-art" style="${artStyle(album.cover)}"></div>
      <span>
        <strong>${escapeHtml(album.title)}</strong>
        <small>${escapeHtml(album.artist)}</small>
        <small>${album.year ? escapeHtml(album.year) : `${album.tracks.length} songs`}</small>
      </span>
    </button>
  `;
}

function homeYearReviewPlaylistCard(playlist) {
  const tracks = playlistTracks(playlist);
  const year = Number(playlist.annualReviewYear || 0) || "";
  return `
    <button class="home-card year-playlist-home-card" type="button" data-open-playlist="${escapeHtml(playlist.id)}">
      <div class="home-card-art" style="${playlistArtStyle(playlist, tracks[0])}"></div>
      <span>
        <strong>${escapeHtml(playlist.name || yearReviewPlaylistName(year))}</strong>
        <small>${tracks.length.toLocaleString()} songs</small>
        <small>${year ? `VoidFM ${year}` : "VoidFM Year"}</small>
      </span>
    </button>
  `;
}

function renderHomeSection(title, items, cardRenderer, emptyText) {
  return `
    <section class="home-section">
      <div class="home-section-head">
        <h2>${escapeHtml(title)}</h2>
        <span>${items.length} shown</span>
      </div>
      <div class="home-card-grid">
        ${items.length ? items.map(cardRenderer).join("") : `<div class="empty-state home-empty">${escapeHtml(emptyText)}</div>`}
      </div>
    </section>
  `;
}

function renderHomeDashboard() {
  const monthly = monthlyMostPlayedTracks();
  const recent = recentlyAddedTracks();
  const releases = newReleaseAlbums();
  const yearPlaylists = yearReviewPlaylists();
  return `
    ${renderVoidReview()}
    <div class="home-dashboard">
      ${yearPlaylists.length ? renderHomeSection("VoidFM Years", yearPlaylists, homeYearReviewPlaylistCard, "No year playlists yet.") : ""}
      ${renderHomeSection("Monthly Most Played", monthly, homeTrackCard, "Play some music and this will fill in.")}
      ${renderHomeSection("Recently Added", recent, homeTrackCard, "No recent additions found.")}
      ${renderHomeSection("New Releases", releases, homeAlbumCard, "No release dates found yet.")}
    </div>
  `;
}

function trackRowHtml(track, activeId = currentTrack()?.id) {
  const blocked = isBlocked(track);
  const playing = activeId === track.id;
  const albumId = escapeHtml(albumKey(track));
  const unsupported = unsupportedPlaybackReason(track);
  const playTitle = unsupported ? unsupportedPlaybackMessage(track) : "Play";
  const playDisabled = unsupported ? "disabled" : "";
  return `
    <div class="track-row ${blocked ? "blocked" : ""} ${playing ? "playing" : ""} ${unsupported ? "unsupported-format" : ""}" draggable="true" data-library-drag-type="track" data-library-drag-id="${escapeHtml(track.id)}" data-track-id="${escapeHtml(track.id)}">
      <label class="select-check">
        <input type="checkbox" data-select-track="${escapeHtml(track.id)}" ${state.selectedIds.has(track.id) ? "checked" : ""}>
      </label>
      <div class="song-main">
        <button class="song-art" type="button" title="${escapeHtml(playTitle)}" data-play-track="${escapeHtml(track.id)}" style="${artStyle(track)}" ${playDisabled}></button>
        <div class="song-copy">
          <div class="song-title-line"><span class="song-title">${escapeHtml(track.title)}</span>${unsupportedFormatBadgeHtml(track)}</div>
          <button class="library-link song-subtitle" type="button" draggable="true" data-library-drag-type="artist" data-library-drag-id="${escapeHtml(track.artist)}" data-view-artist="${escapeHtml(track.artist)}">${escapeHtml(track.artist)}</button>
        </div>
      </div>
      <button class="library-link album-cell" type="button" draggable="true" data-library-drag-type="album" data-library-drag-id="${albumId}" data-view-album="${albumId}">${escapeHtml(track.album)}</button>
      <button class="library-link artist-cell" type="button" draggable="true" data-library-drag-type="artist" data-library-drag-id="${escapeHtml(track.artist)}" data-view-artist="${escapeHtml(track.artist)}">${escapeHtml(track.artist)}</button>
      <div class="time-cell">${msToTime(track.duration)}</div>
    </div>`;
}

function cancelLazyTrackRows() {
  lazyTrackRenderToken += 1;
}

function scheduleLazyHtmlChunks({
  items,
  startIndex,
  chunkSize,
  token,
  currentToken,
  markerSelector,
  renderChunk,
  afterChunk
}) {
  let index = startIndex;

  function appendChunk() {
    const marker = $(markerSelector);
    if (token !== currentToken() || !marker?.isConnected) return;
    const end = Math.min(index + chunkSize, items.length);
    marker.insertAdjacentHTML("beforebegin", renderChunk(items.slice(index, end), index));
    index = end;
    afterChunk?.();
    if (index < items.length) {
      setTimeout(appendChunk, 0);
    } else {
      marker.remove();
    }
  }

  setTimeout(appendChunk, 0);
}

function scheduleLazyTrackRows(tracks, rowRenderer = trackRowHtml) {
  if (tracks.length <= TRACK_INITIAL_RENDER_LIMIT) {
    cancelLazyTrackRows();
    return;
  }
  const token = ++lazyTrackRenderToken;
  scheduleLazyHtmlChunks({
    items: tracks,
    startIndex: TRACK_INITIAL_RENDER_LIMIT,
    chunkSize: TRACK_RENDER_CHUNK_SIZE,
    token,
    currentToken: () => lazyTrackRenderToken,
    markerSelector: "#lazyTrackRows",
    renderChunk: (chunk) => {
      const activeId = currentTrack()?.id;
      return chunk.map((track) => rowRenderer(track, activeId)).join("");
    },
    afterChunk: syncPlayingRows
  });
}

function tracksForArtist(artistName) {
  const target = artistName || "Unknown Artist";
  return state.tracks.filter((track) => (track.artist || "Unknown Artist") === target);
}

function artistTopTracksFor(tracks, limit = 10) {
  const engine = recommendationEngine();
  if (engine?.artistTopTracks) {
    return engine.artistTopTracks(tracks, { statsById: state.listeningStats, limit });
  }
  return tracks.slice()
    .sort((left, right) => playCountFor(right) - playCountFor(left)
      || ratingFor(right) - ratingFor(left)
      || compareText(left.title, right.title))
    .slice(0, limit);
}

function artistAlbumsFor(tracks) {
  const engine = recommendationEngine();
  if (engine?.artistAlbums) return engine.artistAlbums(tracks);
  const groups = new Map();
  for (const track of tracks) {
    const key = albumKey(track);
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        title: track.album || "Unknown Album",
        artist: albumArtistFor(track),
        year: track.year || null,
        releaseDate: releaseDateFor(track),
        cover: track,
        tracks: []
      });
    }
    const album = groups.get(key);
    album.tracks.push(track);
    if (!album.cover?.thumb && track.thumb) album.cover = track;
  }
  return Array.from(groups.values())
    .map((album) => ({
      ...album,
      tracks: album.tracks.slice().sort((left, right) => {
        const leftNumber = Number(left.discNumber || 0) * 1000 + Number(left.trackNumber || 0);
        const rightNumber = Number(right.discNumber || 0) * 1000 + Number(right.trackNumber || 0);
        return (leftNumber || rightNumber ? leftNumber - rightNumber : 0) || compareText(left.title, right.title);
      })
    }))
    .sort((left, right) => compareText(left.title, right.title));
}

function similarArtistsFor(artistName, artistTracks) {
  const engine = recommendationEngine();
  if (!engine?.similarLibraryArtists) return [];
  const cacheKey = [
    state.libraryDataVersion,
    state.playlistDataVersion,
    artistName || "Unknown Artist"
  ].join("\u001f");
  if (memo.similarArtistsKey === cacheKey) return memo.similarArtists;

  const result = engine.similarLibraryArtists(artistName, artistTracks, state.tracks, {
    limit: 8,
    playlists: state.playlists
  });
  memo.similarArtistsKey = cacheKey;
  memo.similarArtists = result;
  return result;
}

function artistTopTrackRowHtml(track, index, activeId = currentTrack()?.id) {
  const blocked = isBlocked(track);
  const playing = activeId === track.id;
  const trackId = escapeHtml(track.id);
  const albumId = escapeHtml(albumKey(track));
  const unsupported = unsupportedPlaybackReason(track);
  const playTitle = unsupported ? unsupportedPlaybackMessage(track) : "Play";
  const playDisabled = unsupported ? "disabled" : "";
  return `
    <div class="track-row artist-top-track-row ${blocked ? "blocked" : ""} ${playing ? "playing" : ""} ${unsupported ? "unsupported-format" : ""}" draggable="true" data-library-drag-type="track" data-library-drag-id="${trackId}" data-track-id="${trackId}">
      <label class="select-check">
        <input type="checkbox" data-select-track="${trackId}" ${state.selectedIds.has(track.id) ? "checked" : ""}>
      </label>
      <div class="artist-track-rank">${index + 1}</div>
      <div class="song-main">
        <button class="song-art" type="button" title="${escapeHtml(playTitle)}" data-play-track="${trackId}" style="${artStyle(track)}" ${playDisabled}></button>
        <div class="song-copy">
          <div class="song-title-line"><span class="song-title">${escapeHtml(track.title || "Untitled")}</span>${unsupportedFormatBadgeHtml(track)}</div>
          <button class="library-link song-subtitle" type="button" draggable="true" data-library-drag-type="album" data-library-drag-id="${albumId}" data-view-album="${albumId}">${escapeHtml(track.album || "Unknown Album")}</button>
        </div>
      </div>
      <button class="library-link album-cell artist-top-album" type="button" draggable="true" data-library-drag-type="album" data-library-drag-id="${albumId}" data-view-album="${albumId}">${escapeHtml(track.album || "Unknown Album")}</button>
      <div class="time-cell">${msToTime(track.duration)}</div>
    </div>`;
}

function artistAlbumTrackRowHtml(track, activeId = currentTrack()?.id) {
  const blocked = isBlocked(track);
  const playing = activeId === track.id;
  const trackId = escapeHtml(track.id);
  const unsupported = unsupportedPlaybackReason(track);
  const playTitle = unsupported ? unsupportedPlaybackMessage(track) : "Play";
  const playDisabled = unsupported ? "disabled" : "";
  const trackNumber = Number(track.trackNumber || 0);
  return `
    <div class="track-row artist-album-track-row ${blocked ? "blocked" : ""} ${playing ? "playing" : ""} ${unsupported ? "unsupported-format" : ""}" draggable="true" data-library-drag-type="track" data-library-drag-id="${trackId}" data-track-id="${trackId}">
      <label class="select-check">
        <input type="checkbox" data-select-track="${trackId}" ${state.selectedIds.has(track.id) ? "checked" : ""}>
      </label>
      <div class="artist-track-number">${trackNumber || ""}</div>
      <div class="song-copy">
        <div class="song-title-line"><span class="song-title">${escapeHtml(track.title || "Untitled")}</span>${unsupportedFormatBadgeHtml(track)}</div>
      </div>
      <div class="time-cell">${msToTime(track.duration)}</div>
    </div>`;
}

function artistAlbumGroupHtml(album, activeId = currentTrack()?.id) {
  const cover = album.cover || album.tracks?.[0];
  const albumId = escapeHtml(albumKey(cover));
  const year = album.year || (album.releaseDate ? String(album.releaseDate).slice(0, 4) : "");
  return `
    <article class="artist-album-group">
      <header class="artist-album-head">
        <button class="artist-album-art" type="button" style="${artStyle(cover)}" data-view-album="${albumId}" aria-label="${escapeHtml(album.title || "Album")}"></button>
        <div class="artist-album-copy">
          <button class="library-link artist-album-title" type="button" draggable="true" data-library-drag-type="album" data-library-drag-id="${albumId}" data-view-album="${albumId}">${escapeHtml(album.title || "Unknown Album")}</button>
          <span>${[year, `${album.tracks?.length || 0} songs`].filter(Boolean).map(escapeHtml).join(" / ")}</span>
        </div>
      </header>
      <div class="artist-album-tracks">
        ${(album.tracks || []).map((track) => artistAlbumTrackRowHtml(track, activeId)).join("")}
      </div>
    </article>
  `;
}

function similarArtistCardHtml(artist) {
  return `
    <button class="browser-card artist-card" type="button" draggable="true" data-library-drag-type="artist" data-library-drag-id="${escapeHtml(artist.name)}" data-view-artist="${escapeHtml(artist.name)}">
      <div class="browser-card-art artist-card-art" ${lazyArtAttributes(artist.cover)}></div>
      <div class="browser-card-copy">
        <strong>${escapeHtml(artist.name)}</strong>
        <span>${artist.tracks.length} songs / ${artist.albums.size} albums</span>
      </div>
    </button>
  `;
}

function artistBrowserCardHtml(artist) {
  return `
    <button class="browser-card artist-card" type="button" draggable="true" data-library-drag-type="artist" data-library-drag-id="${escapeHtml(artist.name)}" data-view-artist="${escapeHtml(artist.name)}">
      <div class="browser-card-art artist-card-art" ${lazyArtAttributes(artist.cover)}></div>
      <div class="browser-card-copy">
        <strong>${escapeHtml(artist.name)}</strong>
        <span>${artist.tracks.length} songs / ${artist.albums.size} albums</span>
      </div>
    </button>
  `;
}

function albumBrowserCardHtml(album) {
  return `
    <button class="browser-card album-card" type="button" draggable="true" data-library-drag-type="album" data-library-drag-id="${escapeHtml(album.key)}" data-view-album="${escapeHtml(album.key)}">
      <div class="browser-card-art" ${lazyArtAttributes(album.cover)}></div>
      <div class="browser-card-copy">
        <strong>${escapeHtml(album.title)}</strong>
        <span>${escapeHtml(album.artist)}${album.year ? ` / ${album.year}` : ""}</span>
        <span>${album.tracks.length} songs</span>
      </div>
    </button>
  `;
}

function lazyBrowserGridMarkerHtml(items, itemLabel) {
  return items.length > BROWSER_GRID_INITIAL_RENDER_LIMIT
    ? `<div id="lazyBrowserCards" class="empty-state lazy-row-status lazy-browser-status">Loading ${items.length - BROWSER_GRID_INITIAL_RENDER_LIMIT} more ${itemLabel}...</div>`
    : "";
}

function cancelLazyBrowserCards() {
  lazyBrowserGridRenderToken += 1;
}

function scheduleIdleRender(callback) {
  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(callback, { timeout: 700 });
  } else {
    setTimeout(callback, 16);
  }
}

function scheduleLazyBrowserCards(items, renderer) {
  if (items.length <= BROWSER_GRID_INITIAL_RENDER_LIMIT) {
    cancelLazyBrowserCards();
    return;
  }

  const token = ++lazyBrowserGridRenderToken;
  let index = BROWSER_GRID_INITIAL_RENDER_LIMIT;

  const appendChunk = () => {
    const marker = $("#lazyBrowserCards");
    if (token !== lazyBrowserGridRenderToken || !marker?.isConnected) return;
    const end = Math.min(index + BROWSER_GRID_RENDER_CHUNK_SIZE, items.length);
    const html = items.slice(index, end).map(renderer).join("");
    marker.insertAdjacentHTML("beforebegin", html);
    hydrateLazyArtwork(marker.parentElement || document);
    index = end;
    if (index < items.length) {
      scheduleIdleRender(appendChunk);
    } else {
      marker.remove();
    }
  };

  scheduleIdleRender(appendChunk);
}

function similarArtistSkeletonHtml() {
  return Array.from({ length: 4 }, () => `
    <div class="browser-card artist-card artist-card-skeleton" aria-hidden="true">
      <div class="browser-card-art artist-card-art"></div>
      <div class="browser-card-copy">
        <span></span>
        <span></span>
      </div>
    </div>
  `).join("");
}

function similarArtistSectionHtml(similarArtists = null) {
  if (Array.isArray(similarArtists) && similarArtists.length === 0) return "";
  const loading = similarArtists === null;
  return `
    <section class="artist-detail-section similar-artist-section" data-similar-artist-section>
      <div class="artist-section-head">
        <h2>Similar Artists</h2>
        <span>${loading ? "Loading" : `${similarArtists.length} in library`}</span>
      </div>
      <div class="browser-grid artist-grid">${loading ? similarArtistSkeletonHtml() : similarArtists.map(similarArtistCardHtml).join("")}</div>
    </section>
  `;
}

function cancelSimilarArtistsRender() {
  lazySimilarArtistToken += 1;
}

function scheduleSimilarArtistsRender(artistName) {
  const token = ++lazySimilarArtistToken;
  const renderSimilarArtists = () => {
    if (token !== lazySimilarArtistToken || state.view !== "library" || state.artistFilter !== artistName) return;
    const section = $("#viewLibrary")?.querySelector("[data-similar-artist-section]");
    if (!section) return;
    const similarArtists = similarArtistsFor(artistName, tracksForArtist(artistName));
    if (token !== lazySimilarArtistToken || state.artistFilter !== artistName || !section.isConnected) return;
    const html = similarArtistSectionHtml(similarArtists);
    const parent = section.parentElement;
    if (html) {
      section.outerHTML = html;
      hydrateLazyArtwork(parent || $("#viewLibrary") || document);
    } else {
      section.remove();
    }
  };

  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(renderSimilarArtists, { timeout: 600 });
  } else {
    setTimeout(renderSimilarArtists, 0);
  }
}

function renderArtistDetail(tracks) {
  const artistName = state.artistFilter || "Unknown Artist";
  const topTracks = artistTopTracksFor(tracks);
  const albums = artistAlbumsFor(tracks);
  const activeId = currentTrack()?.id;
  const similarHtml = similarArtistSectionHtml();

  return `
    ${renderVoidReview()}
    <div class="library-toolbar">
      <div class="muted-text">${tracks.length} visible</div>
      <div class="row-actions">
        <button class="tool-button" type="button" data-library-view="artists">${icons.list}<span>Artists</span></button>
      </div>
    </div>
    ${renderLibraryControls()}
    <div class="artist-detail">
      <section class="artist-detail-section">
        <div class="artist-section-head">
          <h2>Top 10 Tracks</h2>
          <span>${topTracks.length} songs</span>
        </div>
        <div class="artist-track-list">
          ${topTracks.length ? topTracks.map((track, index) => artistTopTrackRowHtml(track, index, activeId)).join("") : '<div class="empty-state compact-empty">No tracks</div>'}
        </div>
      </section>
      <section class="artist-detail-section">
        <div class="artist-section-head">
          <h2>Albums</h2>
          <span>${albums.length} albums</span>
        </div>
        <div class="artist-album-list">
          ${albums.length ? albums.map((album) => artistAlbumGroupHtml(album, activeId)).join("") : '<div class="empty-state compact-empty">No albums</div>'}
        </div>
      </section>
      ${similarHtml}
    </div>
  `;
}

function renderTrackTable(tracks) {
  const detailBack = state.artistFilter
    ? `<button class="tool-button" type="button" data-library-view="artists">${icons.list}<span>Artists</span></button>`
    : state.albumFilter
    ? `<button class="tool-button" type="button" data-library-view="albums">${icons.list}<span>Albums</span></button>`
    : "";
  const toolbarActions = detailBack ? `<div class="row-actions">${detailBack}</div>` : "";
  const activeId = currentTrack()?.id;
  const initialTracks = tracks.slice(0, TRACK_INITIAL_RENDER_LIMIT);
  const rows = initialTracks.map((track) => trackRowHtml(track, activeId)).join("");
  const lazyMarker = tracks.length > TRACK_INITIAL_RENDER_LIMIT
    ? `<div id="lazyTrackRows" class="empty-state lazy-row-status">Loading ${tracks.length - TRACK_INITIAL_RENDER_LIMIT} more songs...</div>`
    : "";

  return `
    ${renderVoidReview()}
    <div class="library-toolbar">
      <div class="muted-text">${tracks.length} visible</div>
      ${toolbarActions}
    </div>
    ${renderLibraryControls()}
    <div class="table">
      <div class="table-head">
        <div></div>
        <div>Title</div>
        <div>Album</div>
        <div class="artist-head">Artist</div>
        <div>Time</div>
      </div>
      ${rows || '<div class="empty-state">No tracks</div>'}
      ${lazyMarker}
    </div>
  `;
}

function renderArtistsBrowser() {
  const artists = artistSummaries();
  const initialArtists = artists.slice(0, BROWSER_GRID_INITIAL_RENDER_LIMIT);
  const cards = initialArtists.map(artistBrowserCardHtml).join("");
  const lazyMarker = lazyBrowserGridMarkerHtml(artists, "artists");

  return `
    ${renderVoidReview()}
    <div class="library-toolbar">
      <div class="muted-text">${artists.length} artists</div>
    </div>
    ${renderLibraryControls()}
    <div class="browser-grid artist-grid">${cards || '<div class="empty-state">No artists</div>'}${lazyMarker}</div>
  `;
}

function renderAlbumsBrowser() {
  const albums = albumSummaries();
  const initialAlbums = albums.slice(0, BROWSER_GRID_INITIAL_RENDER_LIMIT);
  const cards = initialAlbums.map(albumBrowserCardHtml).join("");
  const lazyMarker = lazyBrowserGridMarkerHtml(albums, "albums");

  return `
    ${renderVoidReview()}
    <div class="library-toolbar">
      <div class="muted-text">${albums.length} albums</div>
    </div>
    ${renderLibraryControls()}
    <div class="browser-grid album-grid">${cards || '<div class="empty-state">No albums</div>'}${lazyMarker}</div>
  `;
}

function libraryRenderSignature() {
  return [
    state.view,
    state.libraryView,
    state.artistFilter,
    state.albumFilter,
    state.query.trim().toLowerCase(),
    state.libraryFilterField,
    state.libraryFilterValue,
    state.librarySort,
    state.libraryDataVersion,
    state.playlistDataVersion,
    state.statsDataVersion,
    state.blacklistDataVersion,
    state.selectionVersion
  ].join("\u001f");
}

function syncPlayingRows() {
  $$(".view.active .track-row.playing").forEach((row) => row.classList.remove("playing"));
  const activeId = currentTrack()?.id;
  if (!activeId) return;
  const activeRow = $$(".view.active .track-row").find((row) => row.dataset.trackId === activeId);
  if (activeRow) activeRow.classList.add("playing");
}

function renderLibrary() {
  if (state.view !== "library") return;
  const signature = libraryRenderSignature();
  if (state.libraryRenderSignature === signature) {
    syncPlayingRows();
    return;
  }

  let lazyTracks = null;
  let lazyBrowserCards = null;
  let scheduledSimilarArtists = false;
  resetLazyArtworkObserver();
  if (!state.artistFilter && !state.albumFilter && state.libraryView === "home") {
    $("#viewLibrary").innerHTML = renderHomeDashboard();
    cancelLazyTrackRows();
  } else if (state.artistFilter) {
    $("#viewLibrary").innerHTML = renderArtistDetail(filteredTracks());
    scheduleSimilarArtistsRender(state.artistFilter || "Unknown Artist");
    scheduledSimilarArtists = true;
  } else if (state.albumFilter || state.libraryView === "songs") {
    const tracks = filteredTracks();
    $("#viewLibrary").innerHTML = renderTrackTable(tracks);
    lazyTracks = tracks;
  } else if (state.libraryView === "artists") {
    $("#viewLibrary").innerHTML = renderArtistsBrowser();
    lazyBrowserCards = { items: artistSummaries(), renderer: artistBrowserCardHtml };
  } else if (state.libraryView === "albums") {
    $("#viewLibrary").innerHTML = renderAlbumsBrowser();
    lazyBrowserCards = { items: albumSummaries(), renderer: albumBrowserCardHtml };
  }
  state.libraryRenderSignature = signature;
  if (lazyTracks) scheduleLazyTrackRows(lazyTracks);
  else cancelLazyTrackRows();
  if (lazyBrowserCards) scheduleLazyBrowserCards(lazyBrowserCards.items, lazyBrowserCards.renderer);
  else cancelLazyBrowserCards();
  if (!scheduledSimilarArtists) cancelSimilarArtistsRender();
  hydrateLazyArtwork($("#viewLibrary") || document);
  syncPlayingRows();
}

function playlistTrackRowHtml(track, playlist, editing, activeId = currentTrack()?.id) {
  const blocked = isBlocked(track);
  const playing = activeId === track.id;
  const playlistId = escapeHtml(playlist.id);
  const trackId = escapeHtml(track.id);
  const albumId = escapeHtml(albumKey(track));
  const playingStyle = playlistPlayingRowStyle(playlist);
  const customPlayingClass = playingStyle ? "playlist-custom-playing" : "";
  const trim = playlistTrackTrim(playlist, track.id, track);
  const title = trackTitleWithTrimMarker(track, trim);
  const timeCell = `<div class="time-cell">${msToTime(track.duration)}</div>`;
  const unsupported = unsupportedPlaybackReason(track);
  const playTitle = unsupported ? unsupportedPlaybackMessage(track) : "Play";
  const playDisabled = unsupported ? "disabled" : "";
  return `
    <div class="track-row playlist-track-row ${customPlayingClass} ${blocked ? "blocked" : ""} ${playing ? "playing" : ""} ${unsupported ? "unsupported-format" : ""}" draggable="true" ${playingStyle ? `style="${escapeHtml(playingStyle)}"` : ""} data-library-drag-type="track" data-library-drag-id="${trackId}" data-playlist-id="${playlistId}" data-track-id="${trackId}">
      <label class="select-check">
        <input type="checkbox" data-select-track="${trackId}" ${state.selectedIds.has(track.id) ? "checked" : ""}>
      </label>
      <div class="song-main">
        <button class="song-art" type="button" title="${escapeHtml(playTitle)}" data-play-track="${trackId}" style="${artStyle(track)}" ${playDisabled}></button>
        <div class="song-copy">
          <div class="song-title-line"><span class="song-title">${escapeHtml(title)}</span>${unsupportedFormatBadgeHtml(track)}</div>
          <button class="library-link song-subtitle" type="button" draggable="true" data-library-drag-type="artist" data-library-drag-id="${escapeHtml(track.artist)}" data-view-artist="${escapeHtml(track.artist)}">${escapeHtml(track.artist)}</button>
        </div>
      </div>
      <button class="library-link album-cell" type="button" draggable="true" data-library-drag-type="album" data-library-drag-id="${albumId}" data-view-album="${albumId}">${escapeHtml(track.album)}</button>
      <button class="library-link artist-cell" type="button" draggable="true" data-library-drag-type="artist" data-library-drag-id="${escapeHtml(track.artist)}" data-view-artist="${escapeHtml(track.artist)}">${escapeHtml(track.artist)}</button>
      ${timeCell}
    </div>`;
}

function playlistColorChannelHtml(label, value, type, key, min, max) {
  return `
    <label class="playlist-color-channel">
      <span>${label}</span>
      <input type="number" min="${min}" max="${max}" step="1" value="${value}" data-color-${type}="${key}" aria-label="${label}">
    </label>
  `;
}

function playlistColorEditorHtml(name, useName, label, hex, fallbackHex) {
  const activeHex = sanitizeHex(hex || fallbackHex);
  const rgb = hexToRgb(activeHex);
  const hsl = rgbToHsl(rgb);
  return `
    <div class="playlist-color-row" data-playlist-color-editor="${escapeHtml(name)}" data-current-hex="${escapeHtml(activeHex)}">
      <label class="checkbox-field compact-checkbox playlist-color-use">
        <input name="${escapeHtml(useName)}" type="checkbox" ${hex ? "checked" : ""}>
        <span>${escapeHtml(label)}</span>
      </label>
      <label class="playlist-color-swatch" data-color-swatch style="--playlist-color-preview: ${escapeHtml(activeHex)}" title="Pick ${escapeHtml(label)} color">
        <input type="color" value="${escapeHtml(activeHex)}" data-color-native aria-label="Pick ${escapeHtml(label)} color">
      </label>
      <label class="playlist-color-format playlist-color-hex">
        <span>Hex</span>
        <input name="${escapeHtml(name)}" value="${escapeHtml(activeHex)}" maxlength="7" inputmode="text" autocomplete="off" spellcheck="false" data-color-hex>
      </label>
      <div class="playlist-color-format">
        <span>RGB</span>
        <div class="playlist-color-channel-grid">
          ${playlistColorChannelHtml("R", rgb.r, "rgb", "r", 0, 255)}
          ${playlistColorChannelHtml("G", rgb.g, "rgb", "g", 0, 255)}
          ${playlistColorChannelHtml("B", rgb.b, "rgb", "b", 0, 255)}
        </div>
      </div>
      <div class="playlist-color-format">
        <span>HSL</span>
        <div class="playlist-color-channel-grid">
          ${playlistColorChannelHtml("H", hsl.h, "hsl", "h", 0, 360)}
          ${playlistColorChannelHtml("S", hsl.s, "hsl", "s", 0, 100)}
          ${playlistColorChannelHtml("L", hsl.l, "hsl", "l", 0, 100)}
        </div>
      </div>
    </div>
  `;
}

function playlistColorNumber(editor, selector, fallback, min, max) {
  const input = editor.querySelector(selector);
  const value = String(input?.value || "").trim() === "" ? fallback : input.value;
  return clampColorValue(value, fallback, min, max);
}

function setPlaylistColorEditorHex(editor, hex) {
  const nextHex = colorTextToHex(hex) || colorTextToHex(editor.dataset.currentHex) || "#ffffff";
  const rgb = hexToRgb(nextHex);
  const hsl = rgbToHsl(rgb);
  const hexInput = editor.querySelector("[data-color-hex]");
  const nativeInput = editor.querySelector("[data-color-native]");
  const swatch = editor.querySelector("[data-color-swatch]");
  const channels = {
    r: rgb.r,
    g: rgb.g,
    b: rgb.b,
    h: hsl.h,
    s: hsl.s,
    l: hsl.l
  };

  editor.dataset.currentHex = nextHex;
  if (hexInput) hexInput.value = nextHex;
  if (nativeInput) nativeInput.value = nextHex;
  if (swatch) swatch.style.setProperty("--playlist-color-preview", nextHex);

  Object.entries(channels).forEach(([key, value]) => {
    const input = editor.querySelector(`[data-color-rgb="${key}"], [data-color-hsl="${key}"]`);
    if (input) input.value = String(value);
  });
}

function syncPlaylistColorEditor(target) {
  const editor = target.closest("[data-playlist-color-editor]");
  if (!editor) return;
  const currentHex = colorTextToHex(editor.dataset.currentHex) || "#ffffff";
  const currentRgb = hexToRgb(currentHex);

  if (target.matches("[data-color-native]")) {
    setPlaylistColorEditorHex(editor, target.value);
    return;
  }

  if (target.matches("[data-color-hex]")) {
    const text = String(target.value || "").trim();
    if (!/^#?[0-9a-f]{6}$/i.test(text)) return;
    const nextHex = colorTextToHex(target.value);
    if (nextHex) setPlaylistColorEditorHex(editor, nextHex);
    return;
  }

  if (target.matches("[data-color-rgb]")) {
    setPlaylistColorEditorHex(editor, rgbToHex({
      r: playlistColorNumber(editor, '[data-color-rgb="r"]', currentRgb.r, 0, 255),
      g: playlistColorNumber(editor, '[data-color-rgb="g"]', currentRgb.g, 0, 255),
      b: playlistColorNumber(editor, '[data-color-rgb="b"]', currentRgb.b, 0, 255)
    }));
    return;
  }

  if (target.matches("[data-color-hsl]")) {
    const currentHsl = rgbToHsl(currentRgb);
    setPlaylistColorEditorHex(editor, rgbToHex(hslToRgb({
      h: playlistColorNumber(editor, '[data-color-hsl="h"]', currentHsl.h, 0, 360),
      s: playlistColorNumber(editor, '[data-color-hsl="s"]', currentHsl.s, 0, 100),
      l: playlistColorNumber(editor, '[data-color-hsl="l"]', currentHsl.l, 0, 100)
    })));
  }
}

function normalizePlaylistColorEditors(root) {
  if (!root) return;
  const editors = root.matches?.("[data-playlist-color-editor]")
    ? [root]
    : Array.from(root.querySelectorAll("[data-playlist-color-editor]"));
  editors.forEach((editor) => {
    const hexInput = editor.querySelector("[data-color-hex]");
    setPlaylistColorEditorHex(editor, colorTextToHex(hexInput?.value) || editor.dataset.currentHex);
  });
}

function playlistSettingsWindowHtml(playlist) {
  if (!playlist || state.playlistSettingsId !== playlist.id) return "";
  const firstTrack = playlist.trackIds.map(trackById).find(Boolean);
  const fallbackStyle = playlistArtStyle({ ...playlist, photoDataUrl: "" }, firstTrack);
  const currentStyle = playlistArtStyle(playlist, firstTrack);
  const textColor = optionalHex(playlist.textColor);
  const highlightColor = optionalHex(playlist.highlightColor);
  const defaultHighlight = sanitizeHex(state.settings?.accentColor || "#7d3cff");
  return `
    <div class="playlist-window-backdrop" data-close-playlist-settings>
      <section class="playlist-window" role="dialog" aria-modal="true" aria-labelledby="playlistSettingsTitle">
        <form id="playlistSettingsForm" class="playlist-settings-form" data-playlist-id="${escapeHtml(playlist.id)}">
          <header class="playlist-window-head">
            <div>
              <div class="section-title">Playlist</div>
              <h2 id="playlistSettingsTitle">Edit Playlist</h2>
            </div>
            <button class="icon-button" type="button" title="Close" data-close-playlist-settings>${icons.x}</button>
          </header>

          <div class="playlist-settings-grid">
            <div class="playlist-photo-editor">
              <div class="playlist-photo-preview" data-playlist-photo-preview data-fallback-style="${escapeHtml(fallbackStyle)}" style="${currentStyle}"></div>
              <label class="field">
                <span>Photo</span>
                <input name="photoFile" type="file" accept="image/*" data-playlist-photo-input>
              </label>
              <input type="hidden" name="photoDataUrl" value="${escapeHtml(playlist.photoDataUrl || "")}">
              <button class="tool-button" type="button" data-clear-playlist-photo>${icons.x}<span>Clear Photo</span></button>
            </div>

            <div class="playlist-settings-fields">
              <label class="field">
                <span>Name</span>
                <input name="name" value="${escapeHtml(playlist.name)}" placeholder="Playlist name">
              </label>
              <label class="field">
                <span>Playlist shuffle</span>
                <select name="defaultShuffleProfileId">
                  ${shuffleProfileOptions(playlist.defaultShuffleProfileId || "", true)}
                </select>
              </label>
              <label class="field">
                <span>Default equalizer</span>
                <select name="defaultEqPreset">
                  ${playlistEqPresetOptionsHtml(playlistDefaultEqPreset(playlist))}
                </select>
              </label>
              <label class="field">
                <span>Custom fade</span>
                <input name="fadeSeconds" type="number" min="0" max="${MAX_FADE_SECONDS}" step="0.5" value="${escapeHtml(fadeSecondsText(playlist.fadeSeconds))}" placeholder="0">
              </label>
            </div>
          </div>

          <div class="playlist-color-grid">
            ${playlistColorEditorHtml("textColor", "useTextColor", "Text", textColor, "#ffffff")}
            ${playlistColorEditorHtml("highlightColor", "useHighlightColor", "Highlight", highlightColor, defaultHighlight)}
          </div>

          <footer class="playlist-window-actions">
            <button class="tool-button danger-button" type="button" data-delete-playlist="${escapeHtml(playlist.id)}">${icons.trash}<span>Delete</span></button>
            <button class="tool-button" type="button" data-export-playlist="${escapeHtml(playlist.id)}">${icons.save}<span>Export</span></button>
            <button class="tool-button" type="button" data-close-playlist-settings>${icons.x}<span>Cancel</span></button>
            <button class="primary-button" type="submit">${icons.save}<span>Save Playlist</span></button>
          </footer>
        </form>
      </section>
    </div>
  `;
}

function closePlaylistTrackDialog() {
  state.playlistTrackDialog = { playlistId: "", trackId: "" };
}

function trackStoredData(track, playlist) {
  const trim = playlistTrackTrim(playlist, track.id, track);
  return {
    ...track,
    playlistTrackTrim: trim || { startMs: 0, endMs: 0 }
  };
}

function playlistTrackEditorWindowHtml() {
  const playlist = playlistById(state.playlistTrackDialog.playlistId);
  const track = trackById(state.playlistTrackDialog.trackId);
  if (!playlist || !track) return "";
  const trim = playlistTrackTrim(playlist, track.id, track);
  const startText = trimTimeText(trim?.startMs);
  const endText = trimTimeText(trim?.endMs);
  const storedJson = JSON.stringify(trackStoredData(track, playlist), null, 2);
  return `
    <div class="playlist-window-backdrop playlist-track-editor-backdrop" data-close-playlist-track-editor>
      <section class="playlist-window playlist-track-editor-window" role="dialog" aria-modal="true" aria-labelledby="playlistTrackEditorTitle">
        <form id="playlistTrackEditorForm" class="playlist-settings-form" data-playlist-id="${escapeHtml(playlist.id)}" data-track-id="${escapeHtml(track.id)}">
          <header class="playlist-window-head">
            <div>
              <div class="section-title">Track Data</div>
              <h2 id="playlistTrackEditorTitle">${escapeHtml(trackTitleWithTrimMarker(track, trim))}</h2>
            </div>
            <button class="icon-button" type="button" title="Close" data-close-playlist-track-editor>${icons.x}</button>
          </header>

          <div class="track-editor-summary">
            <div class="song-art track-editor-art" style="${artStyle(track)}"></div>
            <div>
              <div class="song-title">${escapeHtml(track.title)}</div>
              <div class="muted-text">${escapeHtml(track.artist)} / ${escapeHtml(track.album)} / ${escapeHtml(msToTime(track.duration))}</div>
            </div>
          </div>

          <div class="track-editor-fields">
            <label class="field">
              <span>Start time</span>
              <input name="startTime" value="${escapeHtml(startText)}" placeholder="0:00">
            </label>
            <label class="field">
              <span>End time</span>
              <input name="endTime" value="${escapeHtml(endText)}" placeholder="${escapeHtml(msToTime(track.duration))}">
            </label>
          </div>

          <details class="track-data-details" open>
            <summary>Stored Track Data</summary>
            <pre class="track-data-json">${escapeHtml(storedJson)}</pre>
          </details>

          <footer class="playlist-window-actions">
            <button class="tool-button" type="button" data-clear-editor-track-trim="${escapeHtml(track.id)}">${icons.clock}<span>Clear Trim</span></button>
            <button class="tool-button" type="button" data-close-playlist-track-editor>${icons.x}<span>Cancel</span></button>
            <button class="primary-button" type="submit">${icons.save}<span>Save Track</span></button>
          </footer>
        </form>
      </section>
    </div>
  `;
}

function playlistSortControlHtml() {
  return `
    <label class="playlist-sort-field">
      <span>Sort</span>
      <select data-playlist-sort title="Sort playlist tracks">
        ${PLAYLIST_SORT_OPTIONS.map(([value, label]) => `<option value="${escapeHtml(value)}" ${value === state.playlistSort ? "selected" : ""}>${escapeHtml(label)}</option>`).join("")}
      </select>
    </label>
  `;
}

function playlistSearchControlHtml() {
  return `
    <label class="playlist-search-field">
      <span class="search-icon" aria-hidden="true">${icons.search}</span>
      <input data-playlist-search type="search" autocomplete="off" placeholder="Find in playlist" aria-label="Find in playlist" value="${escapeHtml(state.playlistQuery)}">
    </label>
  `;
}

function playlistSuggestionCardHtml(item, playlist) {
  const track = item?.track || item;
  if (!track) return "";
  const trackId = escapeHtml(track.id);
  const playlistId = escapeHtml(playlist.id);
  const unsupported = unsupportedPlaybackReason(track);
  const playTitle = unsupported ? unsupportedPlaybackMessage(track) : "Play";
  const playDisabled = unsupported ? "disabled" : "";
  return `
    <div class="playlist-suggestion-card" data-track-id="${trackId}">
      <button class="song-art" type="button" title="${escapeHtml(playTitle)}" data-play-track="${trackId}" style="${artStyle(track)}" ${playDisabled}></button>
      <div class="playlist-suggestion-copy">
        <strong>${escapeHtml(track.title || "Untitled")}</strong>
        <span>${escapeHtml(track.artist || "Unknown Artist")}</span>
        <small>${escapeHtml(track.album || "Unknown Album")}</small>
      </div>
      <button class="icon-button" type="button" title="Add to playlist" data-add-suggested-track="${trackId}" data-playlist-id="${playlistId}">${icons.plus}</button>
    </div>
  `;
}

function playlistSuggestionsHtml(playlist) {
  const suggestions = playlistSuggestionItems(playlist);
  if (!suggestions.length && !(playlist?.trackIds || []).length) return "";
  return `
    <section class="playlist-suggestion-panel" aria-label="Suggested Tracks">
      <div class="section-title">Suggested Tracks</div>
      <div class="playlist-suggestion-grid">
        ${suggestions.length
          ? suggestions.map((item) => playlistSuggestionCardHtml(item, playlist)).join("")
          : '<div class="empty-state compact-empty">No suggestions available</div>'}
      </div>
    </section>
  `;
}

function renderPlaylistDetail(playlist) {
  const allTracks = sortedPlaylistTracks(playlist);
  const tracks = allTracks.filter(trackMatchesPlaylistSearch);
  const editing = state.playlistEditMode;
  const activeId = currentTrack()?.id;
  const trims = playlistTrimCount(playlist);
  const hasPlaylistQuery = Boolean(state.playlistQuery.trim());
  const trackCountText = hasPlaylistQuery
    ? `${tracks.length} of ${allTracks.length} songs`
    : `${allTracks.length} songs`;
  const initialTracks = tracks.slice(0, TRACK_INITIAL_RENDER_LIMIT);
  const rows = initialTracks.map((track) => playlistTrackRowHtml(track, playlist, editing, activeId)).join("");
  const lazyMarker = tracks.length > TRACK_INITIAL_RENDER_LIMIT
    ? `<div id="lazyTrackRows" class="empty-state lazy-row-status">Loading ${tracks.length - TRACK_INITIAL_RENDER_LIMIT} more songs...</div>`
    : "";
  const editPanel = editing ? `
    <div class="playlist-edit-panel">
      <form id="playlistTrackForm" class="playlist-track-form" data-playlist-id="${escapeHtml(playlist.id)}">
        ${trackSearchPicker("playlistTrack", "Add track", "Search title, artist, or album")}
        <button class="primary-button" type="submit">${icons.plus}<span>Add</span></button>
      </form>
      <button class="tool-button danger-button" type="button" data-remove-selected-from-playlist="${escapeHtml(playlist.id)}">${icons.trash}<span>Remove Selected</span></button>
      ${playlistSuggestionsHtml(playlist)}
    </div>
  ` : "";

  $("#viewPlaylists").innerHTML = `
    <button class="playlist-detail-back" type="button" title="Back to playlists" aria-label="Back to playlists" data-playlist-detail-back>${icons.arrowLeft}</button>
    <div class="library-toolbar">
      <div class="muted-text">${trackCountText} / ${escapeHtml(playlistShuffleLabel(playlist))}${trims ? ` / ${trims} trimmed` : ""}</div>
      <div class="row-actions playlist-detail-actions">
        ${playlistSearchControlHtml()}
        ${playlistSortControlHtml()}
        <button class="tool-button" type="button" data-play-playlist="${escapeHtml(playlist.id)}">${icons.play}<span>Play</span></button>
        <button class="tool-button" type="button" data-edit-playlist-settings="${escapeHtml(playlist.id)}">${icons.edit}<span>Edit Playlist</span></button>
        <button class="tool-button ${editing ? "active" : ""}" type="button" data-action="toggle-playlist-edit">${editing ? icons.save : icons.edit}<span>${editing ? "Done" : "Edit Tracks"}</span></button>
      </div>
    </div>
    ${editPanel}
    <div class="table playlist-detail-table">
      <div class="table-head">
        <div></div>
        <div>Title</div>
        <div>Album</div>
        <div class="artist-head">Artist</div>
        <div>Time</div>
        <div></div>
      </div>
      ${rows || `<div class="empty-state">${hasPlaylistQuery ? "No matches in this playlist" : "No tracks in this playlist"}</div>`}
      ${lazyMarker}
    </div>
    ${playlistSettingsWindowHtml(playlist)}
    ${playlistTrackEditorWindowHtml()}
  `;

  if (tracks.length > TRACK_INITIAL_RENDER_LIMIT) {
    scheduleLazyTrackRows(tracks, (track, activeTrackId) => playlistTrackRowHtml(track, playlist, editing, activeTrackId));
  } else {
    cancelLazyTrackRows();
  }
  syncPlayingRows();
}

function renderPlaylists() {
  const detailPlaylist = activePlaylist();
  if (state.activePlaylistId && detailPlaylist) {
    renderPlaylistDetail(detailPlaylist);
    return;
  }
  if (state.activePlaylistId && !detailPlaylist) {
    state.activePlaylistId = "";
    state.playlistEditMode = false;
    state.playlistQuery = "";
  }
  cancelLazyTrackRows();

  const cards = state.playlists.map((playlist) => {
    const firstTrack = playlist.trackIds.map(trackById).find(Boolean);
    const trims = playlistTrimCount(playlist);
    const fadeSummary = `${escapeHtml(fadeLabel(playlist.fadeSeconds))}${trims ? ` / ${trims} trimmed` : ""}`;
    const cardStyle = playlistCardStyle(playlist);
    return `
      <article class="playlist-card ${playlistDragClass(playlist.id)}" draggable="true" ${cardStyle ? `style="${escapeHtml(cardStyle)}"` : ""} data-open-playlist="${escapeHtml(playlist.id)}" data-playlist-reorder-id="${escapeHtml(playlist.id)}" data-playlist-drop-id="${escapeHtml(playlist.id)}">
        <div class="playlist-art-wrap">
          <div class="playlist-art" aria-hidden="true" style="${playlistArtStyle(playlist, firstTrack)}"></div>
        </div>
        <div class="playlist-card-copy">
          <strong class="playlist-name" title="${escapeHtml(playlist.name)}">${escapeHtml(playlist.name)}</strong>
          <div class="muted-text">${playlist.trackIds.length} songs</div>
          <div class="playlist-fade-summary"><span aria-hidden="true"></span>${fadeSummary}</div>
        </div>
        <button class="icon-button playlist-card-play" type="button" title="Play playlist" aria-label="Play ${escapeHtml(playlist.name)}" data-play-playlist="${escapeHtml(playlist.id)}">${icons.play}</button>
      </article>`;
  }).join("");

  $("#viewPlaylists").innerHTML = `
    <div class="library-toolbar">
      <div class="muted-text">${state.playlists.length} playlists</div>
    </div>
    <div class="playlist-grid">${cards || '<div class="empty-state">No playlists</div>'}</div>
    ${playlistSettingsWindowHtml(playlistById(state.playlistSettingsId))}
  `;
}

function renderBlocked() {
  const rows = state.blacklist.map((rule) => `
    <div class="rule-row">
      <span class="pill">${escapeHtml(rule.targetType)}</span>
      <div>${escapeHtml(rule.targetName || rule.targetId)}</div>
      <button class="icon-button" type="button" title="Remove" data-delete-block="${rule.id}">${icons.trash}</button>
    </div>
  `).join("");

  $("#viewBlocked").innerHTML = `
    <div class="rules-band">
      <div class="section-title">Blocked</div>
      <div class="rule-grid">${rows || '<div class="empty-state">No blocked music</div>'}</div>
    </div>
  `;
}

function trackLabel(track) {
  return track ? `${track.artist} - ${track.title}` : "";
}

function trackSearchResults(query, limit = 8) {
  const terms = String(query || "").trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return state.tracks
    .filter((track) => {
      const haystack = `${track.title} ${track.artist} ${track.album}`.toLowerCase();
      return terms.every((term) => haystack.includes(term));
    })
    .slice(0, limit);
}

function normalizedTrackSearchLabel(value) {
  return lowerText(value).replace(/\s+/g, " ");
}

function trackBySearchText(query) {
  const normalized = normalizedTrackSearchLabel(query);
  if (!normalized) return null;
  const exact = state.tracks.find((track) => [
    trackLabel(track),
    `${track.title} - ${track.artist}`,
    `${track.artist} ${track.title}`,
    `${track.title} ${track.artist}`,
    track.title
  ].some((label) => normalizedTrackSearchLabel(label) === normalized));
  if (exact) return exact;
  const results = trackSearchResults(query, 2);
  return results.length === 1 ? results[0] : null;
}

function trackSearchPicker(name, label, placeholder) {
  return `
    <label class="field track-search-field">
      <span>${escapeHtml(label)}</span>
      <input name="${escapeHtml(name)}Search" data-track-search="${escapeHtml(name)}" autocomplete="off" placeholder="${escapeHtml(placeholder)}">
      <input type="hidden" name="${escapeHtml(name)}Id">
      <div class="track-search-results" data-track-search-results="${escapeHtml(name)}"></div>
    </label>
  `;
}

function renderTrackSearchResults(name, query) {
  const container = $(`[data-track-search-results="${name}"]`);
  if (!container) return;
  const results = trackSearchResults(query);
  container.innerHTML = results.length
    ? results.map((track) => `
      <button type="button" class="track-search-result" data-track-search-pick="${escapeHtml(name)}" data-track-id="${escapeHtml(track.id)}">
        <span>${escapeHtml(track.title)}</span>
        <small>${escapeHtml(track.artist)} / ${escapeHtml(track.album)}</small>
      </button>
    `).join("")
    : query.trim()
    ? '<div class="track-search-empty">No matches</div>'
    : "";
}

function renderLinkManager() {
  const rows = state.links.map((link) => {
    const trigger = trackById(link.triggerId);
    const next = trackById(link.nextId);
    return `
      <div class="link-row">
        <div>${escapeHtml(trigger ? `${trigger.artist} - ${trigger.title}` : link.triggerId)}</div>
        <div class="muted-text">then</div>
        <div>${escapeHtml(next ? `${next.artist} - ${next.title}` : link.nextId)}</div>
        <button class="icon-button" type="button" title="Remove" data-delete-link="${link.id}">${icons.trash}</button>
      </div>
    `;
  }).join("");

  return `
    <form id="linkForm" class="settings-form link-form">
        ${trackSearchPicker("trigger", "If this song plays", "Search title, artist, or album")}
        ${trackSearchPicker("next", "This must play next", "Search title, artist, or album")}
        <button class="primary-button" type="submit">${icons.link}<span>Link</span></button>
    </form>
    <div class="rule-grid link-rule-grid">${rows || '<div class="empty-state compact-empty">No linked songs</div>'}</div>
  `;
}

function shuffleRuleLabel(type) {
  return SHUFFLE_RULE_DEFINITIONS.find((rule) => rule.id === type)?.label || type || "Rule";
}

function shuffleRuleHint(type) {
  return SHUFFLE_RULE_DEFINITIONS.find((rule) => rule.id === type)?.hint || "Tune how this rule shapes the queue.";
}

function helpDot(text, attrs = "") {
  const safe = escapeHtml(text);
  return `<span class="help-dot" tabindex="0" title="${safe}" aria-label="${safe}" ${attrs}>?</span>`;
}

function labelWithHelp(label, help, extraClass = "") {
  return `<span class="label-help ${escapeHtml(extraClass)}"><span>${escapeHtml(label)}</span>${helpDot(help)}</span>`;
}

function ruleNumberValue(rule) {
  return rule.count ?? rule.distance ?? rule.window ?? rule.interval ?? rule.threshold ?? rule.maxPlays ?? "";
}

function artistRepeatCooldownValue(rule = {}) {
  return rule.distance ?? rule.cooldown ?? 20;
}

function artistRepeatSameAlbum(rule = {}) {
  return Boolean(rule.sameAlbum || rule.byAlbum || rule.albumOnly);
}

function titleChainIgnoresThe(rule = {}) {
  return Boolean(rule.ignoreThe || rule.ignoreTheWord || rule.skipThe);
}

function titlePatternSelection(rule = {}) {
  const selected = new Set(ruleTokens(ruleValueText(rule) || "one-word")
    .map((item) => item === "a-z" || item === "az" || item === "alphabet" ? "starts-a-z" : item));
  return ["one-word", "question", "number", "starts-a-z"].filter((item) => selected.has(item));
}

function titlePatternOrder(rule = {}) {
  const value = lowerText(rule.order || rule.alphabetOrder);
  return ["asc", "desc"].includes(value) ? value : "";
}

function energyFlowModeValue(rule = {}) {
  const value = lowerText(rule.mode || rule.value || "bpm-climb").replaceAll("_", "-");
  if (value === "climb") return "bpm-climb";
  if (value === "drop" || value === "descend") return "bpm-drop";
  if (value === "wave" || value === "both") return "bpm-wave";
  return ["bpm-climb", "bpm-drop", "bpm-wave", "energy-climb", "energy-drop", "energy-wave"].includes(value) ? value : "bpm-climb";
}

function releaseDateModeValue(rule = {}) {
  const value = lowerText(rule.mode || rule.value || "decade-ladder").replaceAll("_", "-");
  if (value === "birthday" || value === "date" || value === "date-match") return "date-match";
  if (value === "year" || value === "year-chain") return "year-chain";
  return "decade-ladder";
}

function discoveryModeValue(rule = {}) {
  const value = lowerText(rule.mode || rule.value || "deep-cut").replaceAll("_", "-");
  if (value === "never") return "never-played";
  if (value === "neglected") return "neglected-artist";
  return ["deep-cut", "never-played", "neglected-artist", "mix"].includes(value) ? value : "deep-cut";
}

function genreFlowBlockedTransitions(rule = {}) {
  return cleanText(rule.blockedTransitions || rule.blocked || rule.blocks || "");
}

function ruleStrictnessValue(rule = {}) {
  const value = lowerText(rule.strictness);
  return ["relaxed", "strict"].includes(value) ? value : "normal";
}

function ruleValueText(rule) {
  return cleanText(rule.value || [rule.min, rule.max].filter(Boolean).join("-"));
}

function ruleTokens(value) {
  return String(value || "")
    .split(/[,\n/|]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function ruleTone(type) {
  for (const [category, presetIds] of SHUFFLE_RULE_CATEGORIES) {
    const match = presetIds
      .map((id) => SHUFFLE_PRESETS.find((preset) => preset.id === id))
      .filter(Boolean)
      .some((preset) => preset.rules?.some((rule) => rule.type === type));
    if (match) return RULE_TONE_BY_CATEGORY[category] || "default";
  }
  return "default";
}

function ruleHelpText(type) {
  return ({
    keyword: "Limits the source library to tracks whose title, artist, album, genre, mood, tag, or source text matches these terms.",
    yearRange: "Only allows songs whose release year falls inside the selected range.",
    noArtistRepeat: "Prevents the same artist from appearing again until the repeat gap has passed.",
    rivalArtists: "Keeps manually grouped or closely related artists from playing too near each other.",
    artistSpacing: "Combines same-artist and rival-artist spacing in one rule.",
    albumPairing: "After one album track plays, another song from that album should appear within the pairing window.",
    deepCut: "Prefers lesser-played, lower-rated, or less familiar tracks at the chosen interval.",
    discoveryBias: "Combines deep cuts, never-played tracks, and neglected artist discovery.",
    energyFlow: "Controls BPM or energy direction, including climb, drop, and wave patterns.",
    alphabetClimb: "Only includes song titles starting with A-Z, then orders them by title.",
    titlePattern: "Filters songs by title shape, such as one-word titles, titles with question marks, or titles containing numbers.",
    energyRollercoaster: "Alternates between lower, medium, and higher energy songs instead of staying flat.",
    rampUp: "Starts calmer and gradually moves toward more intense songs.",
    cooldown: "Starts intense and gradually moves toward calmer songs.",
    moodLock: "Keeps the shuffle inside selected mood or tag values.",
    noVibeCrash: "Avoids abrupt transitions between songs with very different energy, BPM, mood, or genre.",
    decadeLadder: "Moves through release decades in order.",
    yearChain: "Keeps each next song close to the previous song's release year.",
    birthday: "Matches songs to a release year, month-day, or birthday-like date.",
    releaseDateFlow: "Combines decade ladder, year-chain, and birthday/date matching.",
    neglectedArtist: "Boosts artists you have many tracks from but have not listened to recently.",
    neverPlayed: "Only allows tracks with a zero play count.",
    forbiddenGenreCombo: "Blocks genre transitions you dislike, such as metal directly into lofi.",
    genreFlow: "Rotates selected genres and blocks disliked genre transitions.",
    genreTourist: "Rotates across selected genres so one genre does not dominate the queue.",
    bpmClimb: "Chooses songs that move toward faster BPM values.",
    bpmDrop: "Chooses songs that move toward slower BPM values.",
    theme: "Matches title, genre, mood, and tag text against a theme you enter.",
    weather: "Matches weather words or weather-like mood and tag text.",
    moodThemeFilter: "Combines mood lock, weather terms, and themed keyword filtering.",
    singalongEvery: "Places a familiar or manually marked singalong track at a fixed interval.",
    artistRun: "Plays a set number of songs by the same artist, then keeps that artist out for a cooldown.",
    titleChain: "Requires the next song title to start with the previous song title's final letter."
  })[type] || shuffleRuleHint(type);
}

function ruleNumberHelp(type) {
  return ({
    noArtistRepeat: "How many songs must play before the same artist may appear again.",
    rivalArtists: "How many songs must separate artists in the same rival or similarity group.",
    artistSpacing: "How many songs must separate the same artist.",
    albumPairing: "How soon another song from the same album should appear.",
    deepCut: "How often the flow should prefer a lesser-played or lower-rated track.",
    discoveryBias: "Maximum play count for tracks treated as deep cuts.",
    energyFlow: "How many songs each climb/drop wave segment lasts.",
    genreTourist: "How many songs to choose from each selected genre before rotating.",
    genreFlow: "How many songs to choose from each selected genre before rotating.",
    singalongEvery: "How often to place a familiar or manually marked singalong track.",
    noVibeCrash: "The largest energy jump allowed between neighboring songs.",
    artistRun: "How many songs by one artist must play in a row."
  })[type] || "The numeric setting this rule uses.";
}

function ruleValueHelp(type) {
  return ({
    keyword: "Comma-separated search terms used against track, artist, album, genre, mood, tag, and library text.",
    yearRange: "The release year span to allow. Use the From year and To year fields in Profile basics for saved presets.",
    rivalArtists: "Artists or groups that should be treated as too similar to play close together.",
    artistSpacing: "Artists or groups that should be treated as too similar to play close together.",
    titlePattern: "The title shape to enforce: one-word, question, or number titles.",
    discoveryBias: "Which discovery behavior to use.",
    energyFlow: "Which BPM or energy pattern to use.",
    releaseDateFlow: "Which release-date behavior to use.",
    moodLock: "Comma-separated moods or tags that are allowed in this shuffle.",
    moodThemeFilter: "Comma-separated moods, weather words, tags, or theme terms allowed in this shuffle.",
    birthday: "A year or month-day value to match against release dates.",
    forbiddenGenreCombo: "A blocked transition, such as metal > lofi or comedy > sad.",
    genreFlow: "Comma-separated genres to rotate through evenly.",
    genreTourist: "Comma-separated genres to rotate through evenly.",
    theme: "Theme words to match against title, genre, mood, and tag data.",
    weather: "Weather words or weather-like tags to match, such as rain, sunny, storm, or snow."
  })[type] || "The text or selection this rule uses.";
}

function ruleNumberLabel(type) {
  return ({
    noArtistRepeat: "Repeat gap",
    rivalArtists: "Rival gap",
    artistSpacing: "Same artist gap",
    albumPairing: "Pairing window",
    deepCut: "Deep cut every",
    discoveryBias: "Deep cut max plays",
    energyFlow: "Segment length",
    genreTourist: "Songs per genre",
    genreFlow: "Songs per genre",
    singalongEvery: "Singalong interval",
    noVibeCrash: "Max energy jump",
    artistRun: "Artist plays"
  })[type] || "Amount";
}

function ruleValueLabel(type) {
  return ({
    keyword: "Keywords",
    yearRange: "Year range",
    rivalArtists: "Rival groups",
    artistSpacing: "Rival groups",
    titlePattern: "Title pattern",
    discoveryBias: "Discovery mode",
    energyFlow: "Flow mode",
    releaseDateFlow: "Date mode",
    moodLock: "Allowed moods",
    moodThemeFilter: "Mood / theme terms",
    birthday: "Birthday date/year",
    forbiddenGenreCombo: "Blocked transition",
    genreFlow: "Genres",
    genreTourist: "Genres",
    theme: "Theme terms",
    weather: "Weather"
  })[type] || "Details";
}

function ruleNeedsNumber(type) {
  return ["noArtistRepeat", "rivalArtists", "albumPairing", "deepCut", "genreTourist", "singalongEvery", "noVibeCrash", "artistRun"].includes(type);
}

function ruleNeedsValue(type) {
  return ["keyword", "yearRange", "rivalArtists", "titlePattern", "moodLock", "birthday", "forbiddenGenreCombo", "genreTourist", "theme", "weather"].includes(type);
}

function ruleSentence(rule) {
  const type = rule.type || "noArtistRepeat";
  const value = ruleValueText(rule);
  const number = ruleNumberValue(rule);
  if (type === "noArtistRepeat") return `Avoid the same artist for ${number || 8} songs.`;
  if (type === "rivalArtists") return `Keep related artists apart for ${number || 2} songs.`;
  if (type === "artistSpacing") return `Avoid same artists for ${rule.count ?? 8} songs and rivals for ${rule.distance ?? 2}.`;
  if (type === "albumPairing") return `Bring another album track within ${number || 5} songs.`;
  if (type === "deepCut") return `Prefer lesser-played tracks every ${number || 2} songs.`;
  if (type === "discoveryBias") {
    const labels = { "deep-cut": "deep cuts", "never-played": "never-played songs", "neglected-artist": "neglected artists", mix: "a discovery mix" };
    return `Favor ${labels[discoveryModeValue(rule)] || "discovery tracks"}.`;
  }
  if (type === "energyFlow") {
    const labels = {
      "bpm-climb": "climb by BPM",
      "bpm-drop": "drop by BPM",
      "bpm-wave": `climb then drop by BPM every ${rule.count || 4} songs`,
      "energy-climb": "climb by energy",
      "energy-drop": "drop by energy",
      "energy-wave": `wave energy every ${rule.count || 4} songs`
    };
    return `Make the queue ${labels[energyFlowModeValue(rule)] || "flow by energy"}.`;
  }
  if (type === "alphabetClimb") return "Only allow titles starting with A-Z, arranged A to Z.";
  if (type === "titlePattern") {
    const labels = {
      "one-word": "one-word titles",
      question: "titles with a question mark",
      number: "titles with numbers",
      "starts-a-z": "titles starting A-Z"
    };
    const selected = titlePatternSelection(rule).map((item) => labels[item]).filter(Boolean);
    const order = titlePatternOrder(rule);
    const orderText = order === "asc" ? ", arranged A-Z" : order === "desc" ? ", arranged Z-A" : "";
    return selected.length ? `Only allow ${selected.join(" and ")}${orderText}.` : `Filter titles${orderText}.`;
  }
  if (type === "energyRollercoaster") return "Alternate low, medium, and high energy.";
  if (type === "rampUp") return "Start calm and grow more intense.";
  if (type === "cooldown") return "Start intense and wind down.";
  if (type === "moodLock") return value ? `Keep the shuffle inside ${value} moods.` : "Keep the shuffle inside selected moods.";
  if (type === "noVibeCrash") return `Avoid abrupt vibe jumps above ${number || 4}.`;
  if (type === "decadeLadder") return "Move through decades in order.";
  if (type === "yearChain") return "Keep adjacent release years together.";
  if (type === "birthday") return value ? `Match songs near ${value}.` : "Match songs by release date or year.";
  if (type === "releaseDateFlow") {
    const mode = releaseDateModeValue(rule);
    if (mode === "year-chain") return "Keep adjacent release years together.";
    if (mode === "date-match") return rule.date ? `Match songs near ${rule.date}.` : "Match songs by release date or year.";
    return "Move through release decades in order.";
  }
  if (type === "neglectedArtist") return "Boost artists with low listening history.";
  if (type === "neverPlayed") return "Only include tracks with zero plays.";
  if (type === "forbiddenGenreCombo") return value ? `Block ${value} transitions.` : "Block disliked genre transitions.";
  if (type === "genreFlow") {
    const block = genreFlowBlockedTransitions(rule);
    if (value && block) return `Rotate ${value} and block ${block}.`;
    if (value) return `Rotate evenly between ${value}.`;
    if (block) return `Block ${block} transitions.`;
    return "Rotate genres or block disliked transitions.";
  }
  if (type === "genreTourist") return value ? `Rotate evenly between ${value}.` : "Rotate evenly between selected genres.";
  if (type === "bpmClimb") return "Move toward faster songs.";
  if (type === "bpmDrop") return "Move toward slower songs.";
  if (type === "theme") return value ? `Build around ${value}.` : "Build around selected theme terms.";
  if (type === "weather") return value ? `Match ${value} weather terms.` : "Match weather words and mood tags.";
  if (type === "moodThemeFilter") return value ? `Keep the shuffle around ${value}.` : "Filter by moods, weather, tags, or theme terms.";
  if (type === "singalongEvery") return `Place a familiar track every ${number || 5} songs.`;
  if (type === "keyword") return value ? `Limit the library to ${value}.` : "Limit the library by keyword or genre.";
  if (type === "yearRange") return value ? `Limit releases to ${value}.` : "Limit releases by year range.";
  if (type === "artistRun") {
    const albumPart = artistRepeatSameAlbum(rule) ? " from the same album" : "";
    return `Play ${number || 2} by an artist${albumPart}, then avoid them for ${artistRepeatCooldownValue(rule)} songs.`;
  }
  if (type === "titleChain") return titleChainIgnoresThe(rule)
    ? "Next title starts with the previous final letter, ignoring 'the'."
    : "Next title starts with the previous title's final letter.";
  return shuffleRuleHint(type);
}

function ruleMetadataMissing(type) {
  if (["bpmClimb", "bpmDrop", "energyFlow"].includes(type)) return state.tracks.filter((track) => Number(track.bpm) > 0 || Number(track.energy) > 0).length;
  if (["moodLock", "theme", "weather", "moodThemeFilter"].includes(type)) return state.tracks.filter((track) => (track.moods || []).length || (track.tags || []).length).length;
  if (["genreTourist", "forbiddenGenreCombo", "genreFlow"].includes(type)) return state.tracks.filter((track) => (track.genres || []).length).length;
  if (type === "birthday" || type === "releaseDateFlow") return state.tracks.filter((track) => track.releaseDate || track.year).length;
  return state.tracks.length;
}

function trackHasAnyTerm(track, terms) {
  if (!terms.length) return true;
  const haystack = [
    track.title,
    track.artist,
    track.album,
    track.albumArtist,
    track.sectionTitle,
    ...(track.genres || []),
    ...(track.moods || []),
    ...(track.tags || [])
  ].join(" ").toLowerCase();
  return terms.some((term) => haystack.includes(term.toLowerCase()));
}

function ruleMatchesTrack(rule, track) {
  const type = rule.type;
  const value = ruleValueText(rule);
  const terms = ruleTokens(value);
  if (type === "keyword" || type === "theme" || type === "weather" || type === "moodThemeFilter") return trackHasAnyTerm(track, terms);
  if (type === "alphabetClimb") return /^[A-Za-z]/.test(cleanText(track.title));
  if (type === "yearRange") {
    const [min, max] = value.includes("-") ? value.split("-") : [rule.min, rule.max];
    const year = Number(track.year || String(track.releaseDate || "").slice(0, 4));
    if (!year) return false;
    return (!Number(min) || year >= Number(min)) && (!Number(max) || year <= Number(max));
  }
  if (type === "titlePattern") {
    const title = cleanText(track.title);
    const titleWithoutEdgePunctuation = title.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");
    return titlePatternSelection(rule).every((pattern) => {
      if (pattern === "question") return title.includes("?");
      if (pattern === "number") return /\d/.test(title) || /\b(one|two|three|four|five|six|seven|eight|nine|ten|ninety|hundred|thousand)\b/i.test(title);
      if (pattern === "starts-a-z") return /^[A-Za-z]/.test(title);
      return /^[\p{L}\p{N}'-]+$/u.test(titleWithoutEdgePunctuation);
    });
  }
  if (type === "moodLock") {
    const moods = (track.moods || []).map(lowerText).concat((track.tags || []).map(lowerText));
    return terms.length ? terms.some((term) => moods.includes(term.toLowerCase())) : moods.length > 0;
  }
  if (type === "neverPlayed") return playCountFor(track) === 0;
  if (type === "discoveryBias" && discoveryModeValue(rule) === "never-played") return playCountFor(track) === 0;
  if (type === "birthday") {
    if (!value) return Boolean(track.releaseDate || track.year);
    const release = releaseDateFor(track);
    return release.includes(value) || String(track.year || "").includes(value);
  }
  if (type === "releaseDateFlow") {
    const mode = releaseDateModeValue(rule);
    if (mode !== "date-match") return Boolean(track.releaseDate || track.year);
    const target = cleanText(rule.date || rule.target || "");
    if (!target) return Boolean(track.releaseDate || track.year);
    const release = releaseDateFor(track);
    return release.includes(target) || String(track.year || "").includes(target);
  }
  if (type === "genreTourist") {
    if (!terms.length) return (track.genres || []).length > 0;
    return (track.genres || []).some((genre) => terms.some((term) => lowerText(genre).includes(term.toLowerCase())));
  }
  if (type === "genreFlow") {
    if (!terms.length) return (track.genres || []).length > 0;
    return (track.genres || []).some((genre) => terms.some((term) => lowerText(genre).includes(term.toLowerCase())));
  }
  if (["bpmClimb", "bpmDrop"].includes(type)) return Number(track.bpm) > 0;
  if (type === "energyFlow") return Number(track.bpm) > 0 || Number(track.energy) > 0;
  return true;
}

function ruleAvailableCount(rule) {
  if (!state.tracks.length) return 0;
  return state.tracks.filter((track) => ruleMatchesTrack(rule, track)).length;
}

function activeFlowRules() {
  return $$("[data-shuffle-rule-row]").map(ruleFromBuilderRow).filter(Boolean);
}

function flowWarnings(rules) {
  const types = new Set(rules.map((rule) => rule.type));
  const warnings = [];
  if (types.has("bpmClimb") && types.has("cooldown")) warnings.push(["BPM Climb conflicts with Cooldown Mode.", "Both control speed or energy in opposite directions."]);
  if (types.has("bpmDrop") && types.has("rampUp")) warnings.push(["BPM Drop conflicts with Ramp-Up Mode.", "Both control speed or energy in opposite directions."]);
  if (types.has("neverPlayed") && types.has("singalongEvery")) warnings.push(["Never Played may limit Singalong rules.", "Most singalong tracks are usually already played."]);
  if (types.has("genreTourist") && types.has("forbiddenGenreCombo")) warnings.push(["Genre Tourist may fight forbidden genre combos.", "The flow may over-filter genre transitions."]);
  if (types.has("alphabetClimb") && types.has("moodLock")) warnings.push(["Alphabet Climb plus Mood Lock can be restrictive.", "Title order and mood filters may leave fewer songs."]);
  for (const rule of rules) {
    if (METADATA_RULE_TYPES.has(rule.type)) {
      const available = ruleMetadataMissing(rule.type);
      if (available && available < state.tracks.length * 0.25) warnings.push([`${shuffleRuleLabel(rule.type)} needs more metadata.`, `${available.toLocaleString()} of ${state.tracks.length.toLocaleString()} tracks have useful data.`]);
    }
  }
  return warnings;
}

function flowEligibleCount(rules) {
  const filteringRules = rules.filter((rule) => ["keyword", "yearRange", "alphabetClimb", "titlePattern", "moodLock", "moodThemeFilter", "neverPlayed", "birthday", "releaseDateFlow", "theme", "weather", "genreTourist", "genreFlow", "bpmClimb", "bpmDrop", "energyFlow"].includes(rule.type)
    || (rule.type === "discoveryBias" && discoveryModeValue(rule) === "never-played"));
  if (!filteringRules.length) return state.tracks.length;
  const filtered = state.tracks.filter((track) => filteringRules.every((rule) => ruleMatchesTrack(rule, track)));
  return filtered.length || Math.min(...filteringRules.map(ruleAvailableCount));
}

function flowHealthHtml(rules) {
  const total = state.tracks.length || 0;
  const eligible = flowEligibleCount(rules);
  const warnings = flowWarnings(rules);
  const hardConflicts = warnings.filter(([title]) => title.toLowerCase().includes("conflict")).length;
  const ratio = total ? eligible / total : 0;
  const status = hardConflicts ? "Warning" : ratio < 0.05 ? "Restrictive" : ratio < 0.25 ? "Narrow" : "Strong";
  return `
    <div class="flow-health flow-health-${status.toLowerCase()}" data-flow-health>
      <div>
        <span class="section-title">Flow Health</span>
        <strong>${status}</strong>
      </div>
      <div>
        <strong>${eligible.toLocaleString()}</strong>
        <span title="Estimated songs that remain available after the current filter-style rules are applied.">eligible tracks</span>
      </div>
      <div>
        <strong>${hardConflicts}</strong>
        <span title="Rules that directly fight each other and may stop queue generation from working well.">hard conflicts</span>
      </div>
      <div>
        <strong>${Math.max(0, warnings.length - hardConflicts)}</strong>
        <span title="Rules that can still work, but may narrow the library or need more metadata.">soft warnings</span>
      </div>
    </div>
  `;
}

function flowWarningsHtml(rules) {
  const warnings = flowWarnings(rules).slice(0, 3);
  if (!warnings.length) return '<div class="inspector-note good">No conflicts detected.</div>';
  return warnings.map(([title, body]) => `
    <div class="inspector-warning">
      <strong>${escapeHtml(title)}</strong>
      <span>${escapeHtml(body)}</span>
    </div>
  `).join("");
}

function shuffleRuleRowHtml(rule = {}, index = 0) {
  const enabled = rule.enabled !== false;
  const type = rule.type || "noArtistRepeat";
  const value = ruleValueText(rule);
  const number = ruleNumberValue(rule);
  const strictness = ruleStrictnessValue(rule);
  const tone = ruleTone(type);
  return `
    <div class="shuffle-rule-row flow-rule-card rule-tone-${escapeHtml(tone)}" data-shuffle-rule-row data-rule-index="${index}">
      <input type="hidden" name="ruleType" value="${escapeHtml(type)}">
      <input type="hidden" name="ruleValue" value="${escapeHtml(value)}">
      <input type="hidden" name="ruleNumber" value="${escapeHtml(number)}">
      <input type="hidden" name="ruleStrictness" value="${escapeHtml(strictness)}">
      <div class="flow-rule-index">${index + 1}</div>
      <div class="flow-rule-main">
        <div class="flow-rule-title-line">
          <strong data-flow-rule-title>${escapeHtml(shuffleRuleLabel(type))}</strong>
        </div>
        <p data-flow-rule-summary>${escapeHtml(ruleSentence(rule))}</p>
      </div>
      <label class="toggle-pill flow-rule-toggle" title="Turn this rule on or off without deleting it." aria-label="Rule enabled">
        <input name="ruleEnabled" type="checkbox" ${enabled ? "checked" : ""}>
      </label>
      <button class="icon-button" type="button" title="Remove rule" data-remove-shuffle-rule="${index}">${icons.trash}</button>
      ${ruleInlineSettingsHtml(rule)}
    </div>
  `;
}

function ruleInlineSettingsHtml(rule = {}) {
  const type = rule.type || "noArtistRepeat";
  const value = ruleValueText(rule);
  const number = ruleNumberValue(rule);
  const strictness = ruleStrictnessValue(rule);
  const optionHtml = (options, selected) => options.map(([optionValue, label]) => `
    <option value="${escapeHtml(optionValue)}" ${selected === optionValue ? "selected" : ""}>${escapeHtml(label)}</option>
  `).join("");
  const titlePatternFields = type === "titlePattern" ? (() => {
    const selected = new Set(titlePatternSelection(rule));
    return `
      <div class="flow-rule-setting-wide">
        <div class="control-label">${labelWithHelp("Title criteria", "All selected criteria must match.")}</div>
        <div class="rule-checkbox-grid">
          ${[
            ["one-word", "One word"],
            ["question", "Has ?"],
            ["number", "Has number"],
            ["starts-a-z", "Starts A-Z"]
          ].map(([optionValue, label]) => `
            <label class="toggle-pill rule-inline-toggle">
              <input data-rule-title-pattern="${escapeHtml(optionValue)}" type="checkbox" ${selected.has(optionValue) ? "checked" : ""}>
              <span>${escapeHtml(label)}</span>
            </label>
          `).join("")}
        </div>
      </div>
      <label class="field">
        ${labelWithHelp("Title order", "Optionally order matching titles alphabetically.")}
        <select data-rule-title-order>
          ${optionHtml([["", "No ordering"], ["asc", "A to Z"], ["desc", "Z to A"]], titlePatternOrder(rule))}
        </select>
      </label>
    `;
  })() : "";
  const energyFlowFields = type === "energyFlow" ? `
    <label class="field">
      ${labelWithHelp("Flow mode", "Choose whether BPM or energy climbs, drops, or cycles upward then downward.")}
      <select data-rule-energy-mode>
        ${optionHtml([
          ["bpm-climb", "BPM climb"],
          ["bpm-drop", "BPM drop"],
          ["bpm-wave", "BPM climb/drop"],
          ["energy-climb", "Energy climb"],
          ["energy-drop", "Energy drop"],
          ["energy-wave", "Energy wave"]
        ], energyFlowModeValue(rule))}
      </select>
    </label>
    <label class="field">
      ${labelWithHelp("Segment length", "For wave modes, how many songs to climb before dropping.")}
      <input data-rule-energy-segment type="number" min="1" max="9999" value="${escapeHtml(rule.count ?? 4)}">
    </label>
    <label class="field">
      ${labelWithHelp("Max energy jump", "Optional cap for abrupt energy jumps. Use 0 to allow any jump.")}
      <input data-rule-energy-threshold type="number" min="0" max="10" value="${escapeHtml(rule.threshold ?? 0)}">
    </label>
  ` : "";
  const releaseDateFields = type === "releaseDateFlow" ? `
    <label class="field">
      ${labelWithHelp("Date mode", "Choose decade ordering, adjacent-year chaining, or date matching.")}
      <select data-rule-release-mode>
        ${optionHtml([["decade-ladder", "Decade ladder"], ["year-chain", "Year chain"], ["date-match", "Date match"]], releaseDateModeValue(rule))}
      </select>
    </label>
    <label class="field">
      ${labelWithHelp("Date / year", "For date match, use a year like 1994 or a month-day like 04-05.")}
      <input data-rule-release-date value="${escapeHtml(rule.date || rule.target || "")}" placeholder="1994 or 04-05">
    </label>
  ` : "";
  const discoveryFields = type === "discoveryBias" ? `
    <label class="field">
      ${labelWithHelp("Discovery mode", "Choose the kind of discovery this rule should prefer or enforce.")}
      <select data-rule-discovery-mode>
        ${optionHtml([["deep-cut", "Deep cuts"], ["never-played", "Never played"], ["neglected-artist", "Neglected artists"], ["mix", "Mixed discovery"]], discoveryModeValue(rule))}
      </select>
    </label>
    <label class="field">
      ${labelWithHelp("Deep cut max plays", "Tracks at or below this play count count as deep cuts.")}
      <input data-rule-discovery-max-plays type="number" min="0" max="9999" value="${escapeHtml(rule.maxPlays ?? rule.count ?? 2)}">
    </label>
  ` : "";
  const artistSpacingFields = type === "artistSpacing" ? `
    <label class="field">
      ${labelWithHelp("Same artist gap", "How many songs must pass before the same artist may return.")}
      <input data-rule-artist-same-gap type="number" min="0" max="9999" value="${escapeHtml(rule.count ?? rule.sameDistance ?? 8)}">
    </label>
    <label class="field">
      ${labelWithHelp("Rival gap", "How many songs must separate manually grouped or similar artists.")}
      <input data-rule-artist-rival-gap type="number" min="0" max="9999" value="${escapeHtml(rule.distance ?? rule.rivalDistance ?? 2)}">
    </label>
    <label class="field flow-rule-setting-wide">
      ${labelWithHelp("Rival groups", "Optional groups separated by semicolons. Example: Beatles, Oasis; Metallica, Megadeth")}
      <input data-rule-artist-rival-groups value="${escapeHtml(value)}" placeholder="Beatles, Oasis; Metallica, Megadeth">
    </label>
  ` : "";
  const genreFlowFields = type === "genreFlow" ? `
    <label class="field">
      ${labelWithHelp("Genres", "Comma-separated genres to rotate. Leave blank to rotate discovered genres.")}
      <input data-rule-genre-flow-genres value="${escapeHtml(value)}" placeholder="rock, jazz, metal">
    </label>
    <label class="field">
      ${labelWithHelp("Songs per genre", "How many songs to play from a genre before rotating.")}
      <input data-rule-genre-flow-count type="number" min="1" max="9999" value="${escapeHtml(rule.count ?? 2)}">
    </label>
    <label class="field flow-rule-setting-wide">
      ${labelWithHelp("Blocked transitions", "Comma-separated transitions such as metal > lofi or comedy > sad.")}
      <input data-rule-genre-flow-blocked value="${escapeHtml(genreFlowBlockedTransitions(rule))}" placeholder="metal > lofi, comedy > sad">
    </label>
  ` : "";
  const moodThemeFields = type === "moodThemeFilter" ? `
    <label class="field flow-rule-setting-wide">
      ${labelWithHelp("Mood / theme terms", "Comma-separated moods, weather words, tags, or theme terms allowed in this shuffle.")}
      <input data-rule-mood-theme-terms value="${escapeHtml(value)}" placeholder="rain, sad, night">
    </label>
  ` : "";
  const artistRepeatFields = type === "artistRun" ? `
    <label class="field">
      ${labelWithHelp("Cooldown", "How many songs must play before this artist may appear again after a repeat block.")}
      <input data-rule-artist-cooldown type="number" min="0" max="9999" value="${escapeHtml(artistRepeatCooldownValue(rule))}">
    </label>
    <label class="toggle-pill inspector-toggle rule-inline-toggle flow-rule-setting-wide" title="Require the repeated artist tracks to come from the same album.">
      <input data-rule-artist-same-album type="checkbox" ${artistRepeatSameAlbum(rule) ? "checked" : ""}>
      ${labelWithHelp("Same album", "When repeating an artist, only use tracks from the same album for that repeat block.")}
    </label>
  ` : "";
  const titleChainFields = type === "titleChain" ? `
    <div class="flow-rule-setting-wide rule-toggle-row">
      <span class="control-label">${labelWithHelp("Chain options", "Options for how title letters are read.")}</span>
      <label class="toggle-pill inspector-toggle rule-inline-toggle" title="Ignore the word 'the' when reading the first or final title letter.">
        <input data-rule-title-ignore-the type="checkbox" ${titleChainIgnoresThe(rule) ? "checked" : ""}>
        <span>Ignore 'the'</span>
      </label>
    </div>
  ` : "";
  const specialFields = titlePatternFields || energyFlowFields || releaseDateFields || discoveryFields || artistSpacingFields || genreFlowFields || moodThemeFields;
  const valueField = !specialFields && ruleNeedsValue(type) ? `
    <label class="field">
      ${labelWithHelp(ruleValueLabel(type), ruleValueHelp(type))}
      <input data-rule-editor-value value="${escapeHtml(value)}" placeholder="${escapeHtml(shuffleRuleHint(type))}">
    </label>
  ` : "";
  const numberField = !specialFields && ruleNeedsNumber(type) ? `
    <label class="field">
      ${labelWithHelp(ruleNumberLabel(type), ruleNumberHelp(type))}
      <input data-rule-editor-number type="number" min="0" max="9999" value="${escapeHtml(number)}" placeholder="Auto">
    </label>
  ` : "";
  return `
    <div class="flow-rule-settings" data-flow-rule-settings>
      <div class="flow-rule-setting-wide">
        <div class="control-label">${labelWithHelp("Strictness", "How firmly this rule should be enforced when the library cannot satisfy it perfectly.")}</div>
        <div class="segmented-control compact-segmented" aria-label="Rule strictness">
          ${["relaxed", "normal", "strict"].map((setting) => `
            <button type="button" class="${strictness === setting ? "active-primary" : ""}" aria-pressed="${strictness === setting ? "true" : "false"}" data-rule-editor-strictness="${setting}">
              ${escapeHtml(setting[0].toUpperCase() + setting.slice(1))}
            </button>
          `).join("")}
        </div>
      </div>
      ${valueField}
      ${numberField}
      ${specialFields}
      ${artistRepeatFields}
      ${titleChainFields}
    </div>
  `;
}

function presetNeedsMetadata(preset) {
  return Boolean(preset?.rules?.some((rule) => METADATA_RULE_TYPES.has(rule.type)));
}

function sortedRuleLibraryPresets() {
  return SHUFFLE_PRESETS.slice().sort((left, right) => {
    const leftMetadata = presetNeedsMetadata(left) ? 1 : 0;
    const rightMetadata = presetNeedsMetadata(right) ? 1 : 0;
    if (leftMetadata !== rightMetadata) return leftMetadata - rightMetadata;
    return String(left.name || "").localeCompare(String(right.name || ""), undefined, { sensitivity: "base" });
  });
}

function ruleLibraryFilterPillsHtml() {
  const active = RULE_LIBRARY_FILTERS.some(([value]) => value === state.ruleLibraryFilter)
    ? state.ruleLibraryFilter
    : "all";
  return RULE_LIBRARY_FILTERS.map(([value, label, description]) => `
    <button type="button" class="mini-pill ${active === value ? "active" : ""}" title="${escapeHtml(description)}" aria-label="${escapeHtml(description)}" data-rule-library-filter="${escapeHtml(value)}">${escapeHtml(label)}</button>
  `).join("");
}

function ruleLibraryHtml() {
  return sortedRuleLibraryPresets().map((preset) => {
    const type = preset.rules?.[0]?.type || "";
    const metadataGroup = presetNeedsMetadata(preset) ? "metadata" : "standard";
    return `
      <button class="rule-library-item rule-tone-${escapeHtml(ruleTone(type))}" type="button" data-add-preset-rule="${escapeHtml(preset.id)}" data-rule-metadata="${metadataGroup}">
        <span class="rule-grip">::</span>
        <span>
          <strong>${escapeHtml(preset.name)}</strong>
          <small>${escapeHtml(preset.description)}</small>
        </span>
        <span class="rule-add">+</span>
      </button>
    `;
  }).join("");
}

function savedWorkshopBlocksHtml() {
  const profiles = state.customShuffles;
  return profiles.map((profile) => {
    return `
      <article class="workshop-block-card">
        <div class="workshop-block-copy">
          <strong>${escapeHtml(profile.name)}</strong>
          <span>${escapeHtml(`${shuffleProfileSummary(profile)}${normalizeFadeSeconds(profile.fadeSeconds) ? ` / ${fadeLabel(profile.fadeSeconds)}` : ""}`)}</span>
        </div>
        <div class="row-actions">
          <button class="icon-button" type="button" title="Edit preset" data-edit-shuffle-profile="${escapeHtml(profile.id)}">${icons.edit}</button>
          <button class="icon-button" type="button" title="Use profile" data-use-shuffle-profile="${escapeHtml(profile.id)}">${icons.shuffle}</button>
          <button class="icon-button" type="button" title="Play profile" data-play-shuffle-profile="${escapeHtml(profile.id)}">${icons.play}</button>
          <button class="icon-button" type="button" title="Export profile" data-export-shuffle-profile="${escapeHtml(profile.id)}">${icons.save}</button>
          <button class="icon-button danger-button" type="button" title="Delete profile" data-delete-shuffle-profile="${escapeHtml(profile.id)}">${icons.trash}</button>
        </div>
      </article>
    `;
  }).join("");
}

function workshopStatCardsHtml(activeRules) {
  const status = state.metadataStatus || {};
  const total = Number(status.cachedTracks || state.tracks.length || 0);
  const enriched = Math.min(total, Number(status.enrichedTracks || 0));
  const pct = total ? Math.round((enriched / total) * 100) : 0;
  const warnings = flowWarnings(activeRules);
  const hardConflicts = warnings.filter(([title]) => title.toLowerCase().includes("conflict")).length;
  return `
    <div class="workshop-stat">
      <span class="stat-icon">${icons.list}</span>
      <strong>${total.toLocaleString()}</strong>
      <small>Tracks from library</small>
    </div>
    <div class="workshop-stat">
      <span class="stat-icon">${icons.refresh}</span>
      <strong>${pct}%</strong>
      <small>Smart tags coverage</small>
    </div>
    <div class="workshop-stat">
      <span class="stat-icon">${icons.ban}</span>
      <strong>${hardConflicts}</strong>
      <small>Conflicts detected</small>
    </div>
    <div class="workshop-stat">
      <span class="stat-icon">${icons.shuffle}</span>
      <strong>${activeRules.length}</strong>
      <small>Active rules in flow</small>
    </div>
  `;
}

function queuePreviewHtml(rules = activeFlowRules()) {
  const tracks = state.workshopPreviewQueue.slice(0, 5);
  return tracks.map((track) => `
    <div class="queue-preview-row">
      <div class="queue-art" style="${artStyle(track)}"></div>
      <div>
        <strong>${escapeHtml(track.title)}</strong>
        <span>${escapeHtml(track.artist)}</span>
        <div class="queue-reason-row">
          ${previewReasonChips(track, rules).map((chip) => `<em title="${escapeHtml(`Why this song: ${chip.replaceAll("-", " ")} contributed to this preview choice.`)}">${escapeHtml(chip)}</em>`).join("")}
        </div>
      </div>
      <small>${msToTime(track.duration)}</small>
    </div>
  `).join("") || `<div class="empty-state compact-empty">${escapeHtml(state.workshopPreviewStatus || "No preview yet")}</div>`;
}

function previewReasonChips(track, rules) {
  const chips = [];
  if (rules.some((rule) => rule.type === "noArtistRepeat")) chips.push("artist ok");
  if (rules.some((rule) => rule.type === "genreTourist" || rule.type === "keyword") && (track.genres || []).length) chips.push("genre match");
  if (rules.some((rule) => rule.type === "moodLock") && (track.moods || track.tags || []).length) chips.push("mood match");
  if (rules.some((rule) => rule.type === "deepCut") && playCountFor(track) <= 2) chips.push("deep cut");
  if (rules.some((rule) => rule.type === "singalongEvery") && (track.singalong || playCountFor(track) >= 5)) chips.push("singalong");
  return chips.slice(0, 3);
}

function selectedRuleRow() {
  const rows = $$("[data-shuffle-rule-row]");
  if (!rows.length) return null;
  const index = Math.max(0, Math.min(state.selectedShuffleRuleIndex || 0, rows.length - 1));
  return rows[index] || rows[0];
}

function ruleFromRow(row) {
  const rule = ruleFromBuilderRow(row);
  if (rule) return rule;
  return {
    type: row?.querySelector('[name="ruleType"]')?.value || "noArtistRepeat",
    value: row?.querySelector('[name="ruleValue"]')?.value || "",
    count: row?.querySelector('[name="ruleNumber"]')?.value || "",
    strictness: ruleStrictnessValue({ strictness: row?.querySelector('[name="ruleStrictness"]')?.value || "normal" })
  };
}

function profileBasicsHtml(active) {
  return `
    <details class="profile-basics" data-detail-key="profile-basics" open>
      <summary>Profile basics</summary>
      <div class="inspector-fields">
        <label class="field">
          <span>Name</span>
          <input ${formAttrs()} name="name" value="${escapeHtml(active?.name || "")}" placeholder="Late Night Discovery">
        </label>
        <label class="field">
          ${labelWithHelp("Genre / keyword terms", "Optional comma-separated terms used as a broad filter against song titles, artists, albums, genres, moods, tags, and libraries.")}
          <input ${formAttrs()} name="terms" value="${escapeHtml(active?.terms || "")}" placeholder="rock, metal">
        </label>
        <div class="field-pair">
          <label class="field">
            <span>From year</span>
            <input ${formAttrs()} name="yearMin" type="number" min="0" max="3000" value="${escapeHtml(active?.yearMin || "")}" placeholder="1970">
          </label>
          <label class="field">
            <span>To year</span>
            <input ${formAttrs()} name="yearMax" type="number" min="0" max="3000" value="${escapeHtml(active?.yearMax || "")}" placeholder="2000">
          </label>
        </div>
        <label class="field">
          <span>Fade seconds</span>
          <input ${formAttrs()} name="fadeSeconds" type="number" min="0" max="${MAX_FADE_SECONDS}" step="0.5" value="${escapeHtml(fadeSecondsText(active?.fadeSeconds))}" placeholder="0">
        </label>
      </div>
    </details>
  `;
}

function workshopPreviewPaneHtml(flowRules) {
  return `
    <div class="queue-preview-panel standalone-preview">
      <div class="panel-head compact-head">
        <div>
          <div class="section-title">Queue Preview</div>
          <p class="muted-text">Preview does not change playback until you generate the queue.</p>
        </div>
        <button class="mini-pill" type="button" data-workshop-preview>Test Preview</button>
      </div>
      <div class="queue-preview-list">${queuePreviewHtml(flowRules)}</div>
      <div class="inspector-note" data-workshop-preview-status ${state.workshopPreviewStatus && state.workshopPreviewQueue.length ? "" : "hidden"}>${escapeHtml(state.workshopPreviewStatus)}</div>
      <div data-flow-warnings>${flowWarningsHtml(flowRules)}</div>
    </div>
  `;
}

function updateRuleCard(row) {
  if (!row) return;
  const rule = ruleFromRow(row);
  const type = rule.type || "noArtistRepeat";
  row.className = `shuffle-rule-row flow-rule-card rule-tone-${ruleTone(type)}${row.classList.contains("selected") ? " selected" : ""}`;
  row.querySelector("[data-flow-rule-title]").textContent = shuffleRuleLabel(type);
  row.querySelector("[data-flow-rule-summary]").textContent = ruleSentence(rule);
  const help = row.querySelector("[data-flow-rule-help]");
  if (help) {
    const text = ruleHelpText(type);
    help.title = text;
    help.setAttribute("aria-label", text);
  }
}

function syncShuffleFlowUi(selectedIndex = state.selectedShuffleRuleIndex || 0, options = {}) {
  const rows = $$("[data-shuffle-rule-row]");
  state.selectedShuffleRuleIndex = rows.length ? Math.max(0, Math.min(selectedIndex, rows.length - 1)) : 0;
  rows.forEach((row, index) => {
    row.dataset.ruleIndex = String(index);
    row.classList.toggle("selected", index === state.selectedShuffleRuleIndex);
    const indexEl = row.querySelector(".flow-rule-index");
    if (indexEl) indexEl.textContent = String(index + 1);
    updateRuleCard(row);
  });
  const rules = activeFlowRules();
  const health = $("[data-flow-health-mount]");
  if (health) health.innerHTML = flowHealthHtml(rules);
  const warningList = $("[data-flow-warnings]");
  if (warningList) warningList.innerHTML = flowWarningsHtml(rules);
  const hint = $("[data-rule-add-hint]");
  if (hint) {
    hint.classList.toggle("compact-drop-zone", rows.length > 0);
    const label = hint.querySelector("span");
    if (label) label.textContent = rows.length
      ? "Click a rule in the library to add another."
      : "Click a rule in the library to start.";
  }
  if (options.syncDraft !== false) {
    syncWorkshopDraftFromDom({ clearPreview: options.clearPreview !== false });
  }
  const previewList = $(".queue-preview-list");
  if (previewList) previewList.innerHTML = queuePreviewHtml(rules);
  const previewStatus = $("[data-workshop-preview-status]");
  if (previewStatus) {
    previewStatus.textContent = state.workshopPreviewStatus || "";
    previewStatus.hidden = !(state.workshopPreviewStatus && state.workshopPreviewQueue.length);
  }
}

function setSelectedShuffleRule(index, options = {}) {
  state.selectedShuffleRuleIndex = index;
  syncShuffleFlowUi(index, {
    ...options,
    clearPreview: options.clearPreview === true
  });
}

function updateSelectedRuleFromInspector(source) {
  const sourceElement = source && typeof source.closest === "function" ? source : null;
  const row = sourceElement?.closest("[data-shuffle-rule-row]") || selectedRuleRow();
  if (!row) return;
  const typeInput = row.querySelector('[name="ruleType"]');
  const valueInput = row.querySelector('[name="ruleValue"]');
  const numberInput = row.querySelector('[name="ruleNumber"]');
  const strictnessInput = row.querySelector('[name="ruleStrictness"]');
  const enabledInput = row.querySelector('[name="ruleEnabled"]');
  const editorRoot = sourceElement?.closest("[data-shuffle-rule-row], [data-rule-editor]") || document;
  const editorValue = editorRoot.querySelector("[data-rule-editor-value]");
  const editorNumber = editorRoot.querySelector("[data-rule-editor-number]");
  const editorStrictness = editorRoot.querySelector("[data-rule-editor-strictness].active-primary");
  const editorEnabled = editorRoot.querySelector("[data-rule-editor-enabled]");
  if (typeInput && !typeInput.value) typeInput.value = ruleFromRow(row).type || "noArtistRepeat";
  if (valueInput && editorValue) valueInput.value = editorValue.value;
  if (numberInput && editorNumber) numberInput.value = editorNumber.value;
  if (strictnessInput && editorStrictness) strictnessInput.value = ruleStrictnessValue({ strictness: editorStrictness.dataset.ruleEditorStrictness });
  if (enabledInput && editorEnabled) enabledInput.checked = editorEnabled.checked;
  syncShuffleFlowUi(Number(row.dataset.ruleIndex || state.selectedShuffleRuleIndex || 0), {
    renderInspector: false,
    clearPreview: true
  });
}

function formAttrs() {
  return 'form="shuffleProfileForm"';
}

function currentWorkshopProfile() {
  return syncWorkshopDraftFromDom({ clearPreview: false }) || workshopProfileForRender();
}

function workshopTargetProfile(name) {
  return shuffleProfileByName(name) || editingShuffleProfile();
}

function workshopSaveLabel(name) {
  return workshopTargetProfile(name) ? "Update Preset" : "Save Preset";
}

function updateWorkshopSaveButton() {
  const button = $("[data-workshop-save-button]");
  const label = $("[data-workshop-save-label]");
  if (!button || !label) return;
  const name = $('[name="name"][form="shuffleProfileForm"]')?.value || $("#shuffleProfileForm")?.querySelector('[name="name"]')?.value || "";
  const next = workshopSaveLabel(name);
  label.textContent = next;
  button.title = next === "Update Preset"
    ? "Update the matching saved preset."
    : "Save the current flow as a reusable preset.";
}

function defaultShufflePresetName(profile = currentWorkshopProfile()) {
  const existing = cleanText(profile?.name);
  if (existing) return existing;
  const rules = activeFlowRules();
  if (!rules.length) return "Custom Shuffle";
  return rules.slice(0, 2).map((rule) => shuffleRuleLabel(rule.type)).join(" + ");
}

function openShuffleSaveDialog() {
  const profile = currentWorkshopProfile();
  state.shuffleSaveDialog = {
    open: true,
    name: defaultShufflePresetName(profile),
    status: "",
    pending: false
  };
  renderGlobalOverlays();
  setTimeout(() => {
    const input = $('[name="shufflePresetName"]');
    input?.focus({ preventScroll: true });
    input?.select();
  }, 0);
}

function closeShuffleSaveDialog() {
  if (state.shuffleSaveDialog.pending) return;
  state.shuffleSaveDialog = { open: false, name: "", status: "", pending: false };
  renderGlobalOverlays();
}

async function saveWorkshopPresetWithName(name) {
  if (state.shuffleSaveDialog.pending) return;
  const presetName = cleanText(name);
  if (!presetName) {
    state.shuffleSaveDialog.status = "Name this preset before saving.";
    state.shuffleSaveDialog.pending = false;
    renderGlobalOverlays();
    return;
  }
  const source = currentWorkshopProfile() || {};
  const { id, ...sourceWithoutId } = source;
  const payload = {
    ...sourceWithoutId,
    name: presetName,
    schemaVersion: 2,
    rules: activeFlowRules()
  };
  const target = workshopTargetProfile(presetName);
  state.shuffleSaveDialog = {
    open: true,
    name: presetName,
    status: "Saving custom shuffle. Please wait.",
    pending: true
  };
  renderGlobalOverlays();
  try {
    let profile;
    if (target) {
      profile = await api(`/api/shuffle-profiles/${encodeURIComponent(target.id)}`, {
        method: "PUT",
        body: JSON.stringify(payload)
      });
      const index = state.customShuffles.findIndex((candidate) => candidate.id === target.id);
      if (index === -1) state.customShuffles.unshift(profile);
      else state.customShuffles[index] = profile;
    } else {
      profile = await api("/api/shuffle-profiles", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      state.customShuffles.unshift(profile);
    }
    state.activeShuffleProfileId = profile.id;
    state.shuffleSaveDialog = { open: false, name: "", status: "", pending: false };
    resetWorkshopDraft();
    state.shuffle = true;
    schedulePlaybackSave();
    renderAll();
    showToast(`Saved ${profile.name}.`);
  } catch (error) {
    state.shuffleSaveDialog = {
      open: true,
      name: presetName,
      status: error.message || "Could not save this custom shuffle.",
      pending: false
    };
    renderGlobalOverlays();
    showToast(error.message || "Could not save custom shuffle.");
  }
}

function buildWorkshopQueue() {
  const profile = currentWorkshopProfile();
  return {
    profile,
    queue: buildSmartQueue(null, {
      sourceTracks: currentSurfaceTracks(),
      profile,
      forceShuffle: true
    })
  };
}

function previewWorkshopQueue() {
  const { queue } = buildWorkshopQueue();
  if (!queue.length) {
    clearWorkshopPreview("This shuffle flow does not match enough playable songs yet.");
    state.shuffleInspectorTab = "preview";
    renderShuffle({ preserveUi: true, captureDraft: false });
    showToast(state.workshopPreviewStatus);
    return;
  }
  state.workshopPreviewQueue = queue;
  state.workshopPreviewStatus = `Previewing ${queue.length.toLocaleString()} song${queue.length === 1 ? "" : "s"} from this flow.`;
  renderShuffle({ preserveUi: true, captureDraft: false });
}

function runWorkshopQueue(autoplay) {
  const { profile, queue } = buildWorkshopQueue();
  if (!queue.length) {
    alert("This shuffle flow does not match enough playable songs yet.");
    return;
  }
  state.shuffle = true;
  setQueueWithSoftFade(queue, 0, autoplay, {
    type: profile.id ? "shuffleProfile" : "workshop",
    playlistId: "",
    shuffleProfileId: profile.id || "",
    fadeSeconds: normalizeFadeSeconds(profile.fadeSeconds)
  }, { reason: "workshop-choice" });
}

function metadataStatusLine() {
  const status = state.metadataStatus || {};
  const enabled = status.providers
    ? Object.entries(status.providers).filter(([, value]) => value).map(([key]) => key).join(", ")
    : "MusicBrainz, AcousticBrainz, ListenBrainz";
  const total = Number(status.cachedTracks || state.tracks.length || 0);
  const enriched = Math.min(total, Number(status.enrichedTracks || 0));
  const job = state.metadataJob || status.runningJob;
  if (job && ["queued", "running"].includes(job.status)) {
    return `Enriching ${job.done || 0}/${job.total || total} tracks via ${enabled}.`;
  }
  return `${enriched}/${total} tracks enriched via ${enabled}.`;
}

function metadataActionJob() {
  return state.metadataJob || state.metadataStatus?.runningJob || null;
}

function metadataActionCounts() {
  const status = state.metadataStatus || {};
  const total = Number(status.cachedTracks || state.tracks.length || 0);
  const enriched = Math.min(total, Number(status.enrichedTracks || 0));
  const job = metadataActionJob();
  return { status, total, enriched, job };
}

function metadataActionLabel() {
  const { total, enriched, job } = metadataActionCounts();
  if (job && ["queued", "running"].includes(job.status)) {
    return `Enriching ${Number(job.done || 0).toLocaleString()}/${Number(job.total || total || 0).toLocaleString()}`;
  }
  const missing = Math.max(0, total - enriched);
  return missing ? `${missing.toLocaleString()} need metadata` : "Metadata complete";
}

function metadataActionDetail() {
  const { total, enriched, job } = metadataActionCounts();
  if (job && ["queued", "running"].includes(job.status)) {
    return "Building smart tags";
  }
  return `${enriched.toLocaleString()}/${total.toLocaleString()} tracks enriched`;
}

function metadataActionProgressPercent() {
  const { total, enriched, job } = metadataActionCounts();
  const running = job && ["queued", "running"].includes(job.status);
  const progressTotal = Number(running ? job.total || total : total);
  const progressDone = Number(running ? job.done || 0 : enriched);
  if (!progressTotal) return 0;
  return Math.max(0, Math.min(100, (progressDone / progressTotal) * 100));
}

function metadataActionButtonHtml() {
  const enriching = metadataEnrichmentRunning();
  const title = enriching ? metadataStatusLine() : "Run metadata enrichment for the library.";
  return `
    <button class="metadata-action-button enrichment-status-card ${enriching ? "is-running" : ""}" type="button" title="${escapeHtml(title)}" style="--metadata-progress: ${metadataActionProgressPercent().toFixed(2)}%;" data-enrich-library ${enriching ? "disabled" : ""}>
      ${icons.refresh}
      <span>
        <strong data-enrich-label>${escapeHtml(metadataActionLabel())}</strong>
        <small data-metadata-action-line>${escapeHtml(metadataActionDetail())}</small>
      </span>
    </button>
  `;
}

function lyricsScanActionJob() {
  return state.lyricsScanJob || state.lyricsScanStatus?.runningJob || null;
}

function lyricsScanRunning() {
  return ["queued", "running"].includes(lyricsScanActionJob()?.status)
    || Number(state.lyricsScanStatus?.runningJobs || 0) > 0;
}

function lyricsScanActionCounts() {
  const status = state.lyricsScanStatus || {};
  const total = Number(status.cachedTracks || state.tracks.length || 0);
  const lyricTracks = Number.isFinite(Number(status.lyricTracks))
    ? Number(status.lyricTracks)
    : state.tracks.filter((track) => track.hasLyrics).length;
  const synced = Number(status.syncedTracks || 0);
  const plain = Number(status.plainLyricsTracks || 0);
  const eligible = Number(status.scanEligibleTracks || Math.max(0, total - lyricTracks));
  const job = lyricsScanActionJob();
  return { status, total, lyricTracks, synced, plain, eligible, job };
}

function lyricsScanStatusLine() {
  const { total, lyricTracks, synced, plain, job } = lyricsScanActionCounts();
  if (job && ["queued", "running"].includes(job.status)) {
    return `Scanning ${Number(job.done || 0).toLocaleString()}/${Number(job.total || total || 0).toLocaleString()} tracks.`;
  }
  const syncedPart = synced ? `${synced.toLocaleString()} synced` : "no synced lyrics yet";
  const plainPart = plain ? `, ${plain.toLocaleString()} plain` : "";
  return `${lyricTracks.toLocaleString()}/${total.toLocaleString()} tracks have lyrics (${syncedPart}${plainPart}).`;
}

function lyricsScanActionLabel() {
  const { total, job } = lyricsScanActionCounts();
  if (job && ["queued", "running"].includes(job.status)) {
    return `Scanning lyrics ${Number(job.done || 0).toLocaleString()}/${Number(job.total || total || 0).toLocaleString()}`;
  }
  return "Scan all songs for lyrics";
}

function lyricsScanActionDetail() {
  const { total, lyricTracks, eligible, job } = lyricsScanActionCounts();
  if (job && ["queued", "running"].includes(job.status)) {
    const found = Number(job.synced || 0) + Number(job.plainOnly || 0);
    return `${found.toLocaleString()} found / ${Number(job.skipped || 0).toLocaleString()} skipped`;
  }
  return eligible
    ? `${eligible.toLocaleString()} missing or stale`
    : `${lyricTracks.toLocaleString()}/${total.toLocaleString()} ready`;
}

function lyricsScanProgressPercent() {
  const { total, lyricTracks, job } = lyricsScanActionCounts();
  const running = job && ["queued", "running"].includes(job.status);
  const progressTotal = Number(running ? job.total || total : total);
  const progressDone = Number(running ? job.done || 0 : lyricTracks);
  if (!progressTotal) return 0;
  return Math.max(0, Math.min(100, (progressDone / progressTotal) * 100));
}

function lyricsScanButtonHtml() {
  const scanning = lyricsScanRunning();
  const title = scanning ? lyricsScanStatusLine() : "Scan all songs for lyrics.";
  return `
    <button class="metadata-action-button lyrics-scan-button ${scanning ? "is-running" : ""}" type="button" title="${escapeHtml(title)}" style="--lyrics-progress: ${lyricsScanProgressPercent().toFixed(2)}%;" data-scan-lyrics-library ${scanning ? "disabled" : ""}>
      ${icons.refresh}
      <span>
        <strong data-lyrics-scan-label>${escapeHtml(lyricsScanActionLabel())}</strong>
        <small data-lyrics-scan-line>${escapeHtml(lyricsScanActionDetail())}</small>
      </span>
    </button>
  `;
}

function metadataEnrichmentRunning() {
  return ["queued", "running"].includes((state.metadataJob || state.metadataStatus?.runningJob)?.status)
    || Number(state.metadataStatus?.runningJobs || 0) > 0;
}

function ruleFromBuilderRow(row) {
  const enabledInput = row.querySelector('[name="ruleEnabled"]');
  if (enabledInput && !enabledInput.checked) return null;
  const type = row.querySelector('[name="ruleType"]')?.value || "";
  if (!type) return null;
  const value = cleanText(row.querySelector('[name="ruleValue"]')?.value || "");
  const number = row.querySelector('[name="ruleNumber"]')?.value;
  const strictness = ruleStrictnessValue({ strictness: row.querySelector('[name="ruleStrictness"]')?.value || "normal" });
  const numeric = Number(number);
  const rule = { type, strictness };
  if (value) {
    if (type === "yearRange" && value.includes("-")) {
      const [min, max] = value.split("-").map((part) => part.trim());
      if (min) rule.min = min;
      if (max) rule.max = max;
    } else {
      rule.value = value;
    }
  }
  if (String(number || "").trim() && Number.isFinite(numeric)) {
    if (["artistRun", "genreTourist"].includes(type)) rule.count = numeric;
    else if (["noArtistRepeat", "rivalArtists"].includes(type)) rule.distance = numeric;
    else if (type === "albumPairing") rule.window = numeric;
    else if (type === "singalongEvery") rule.interval = numeric;
    else if (type === "noVibeCrash") rule.threshold = numeric;
    else if (type === "deepCut") rule.maxPlays = numeric;
    else rule.count = numeric;
  }
  if (type === "titlePattern") {
    const selected = $$("[data-rule-title-pattern]")
      .filter((input) => input.closest("[data-shuffle-rule-row]") === row && input.checked)
      .map((input) => input.dataset.ruleTitlePattern)
      .filter(Boolean);
    rule.value = selected.length ? selected.join(",") : "one-word";
    const order = row.querySelector("[data-rule-title-order]")?.value || "";
    if (order) rule.order = order;
  }
  if (type === "energyFlow") {
    rule.value = row.querySelector("[data-rule-energy-mode]")?.value || "bpm-climb";
    const segment = Number(row.querySelector("[data-rule-energy-segment]")?.value);
    const threshold = Number(row.querySelector("[data-rule-energy-threshold]")?.value);
    rule.count = Number.isFinite(segment) ? Math.max(1, segment) : 4;
    rule.threshold = Number.isFinite(threshold) ? Math.max(0, threshold) : 0;
  }
  if (type === "releaseDateFlow") {
    rule.value = row.querySelector("[data-rule-release-mode]")?.value || "decade-ladder";
    const date = cleanText(row.querySelector("[data-rule-release-date]")?.value || "");
    if (date) rule.date = date;
  }
  if (type === "discoveryBias") {
    rule.value = row.querySelector("[data-rule-discovery-mode]")?.value || "deep-cut";
    const maxPlays = Number(row.querySelector("[data-rule-discovery-max-plays]")?.value);
    rule.maxPlays = Number.isFinite(maxPlays) ? Math.max(0, maxPlays) : 2;
  }
  if (type === "artistSpacing") {
    const sameGap = Number(row.querySelector("[data-rule-artist-same-gap]")?.value);
    const rivalGap = Number(row.querySelector("[data-rule-artist-rival-gap]")?.value);
    rule.count = Number.isFinite(sameGap) ? Math.max(0, sameGap) : 8;
    rule.distance = Number.isFinite(rivalGap) ? Math.max(0, rivalGap) : 2;
    rule.value = cleanText(row.querySelector("[data-rule-artist-rival-groups]")?.value || "");
  }
  if (type === "genreFlow") {
    rule.value = cleanText(row.querySelector("[data-rule-genre-flow-genres]")?.value || "");
    const count = Number(row.querySelector("[data-rule-genre-flow-count]")?.value);
    rule.count = Number.isFinite(count) ? Math.max(1, count) : 2;
    rule.blockedTransitions = cleanText(row.querySelector("[data-rule-genre-flow-blocked]")?.value || "");
  }
  if (type === "moodThemeFilter") {
    rule.value = cleanText(row.querySelector("[data-rule-mood-theme-terms]")?.value || "");
  }
  if (type === "artistRun") {
    const cooldownValue = row.querySelector("[data-rule-artist-cooldown]")?.value;
    const cooldown = Number(cooldownValue);
    rule.count = Math.max(1, Number.isFinite(Number(rule.count)) ? Number(rule.count) : 2);
    rule.distance = Number.isFinite(cooldown) ? Math.max(0, cooldown) : 20;
    rule.sameAlbum = Boolean(row.querySelector("[data-rule-artist-same-album]")?.checked);
  }
  if (type === "titleChain") {
    rule.ignoreThe = Boolean(row.querySelector("[data-rule-title-ignore-the]")?.checked);
  }
  return rule;
}

function collectShuffleProfilePayload(form) {
  const artistRunLength = 1;
  const rules = [];
  const terms = cleanText(form.get("terms"));
  const yearMin = cleanText(form.get("yearMin"));
  const yearMax = cleanText(form.get("yearMax"));
  if (terms) rules.push({ type: "keyword", value: terms });
  if (yearMin || yearMax) rules.push({ type: "yearRange", min: yearMin, max: yearMax });
  for (const row of $$("[data-shuffle-rule-row]")) {
    const rule = ruleFromBuilderRow(row);
    if (rule) rules.push(rule);
  }
  return {
    name: form.get("name"),
    terms,
    yearMin,
    yearMax,
    artistRunLength,
    fadeSeconds: normalizeFadeSeconds(form.get("fadeSeconds")),
    schemaVersion: 2,
    rules
  };
}

function shuffleProfileBasicsVisible() {
  return Boolean($('[name="name"][form="shuffleProfileForm"]'));
}

function mergeWorkshopPayloadWithBase(payload) {
  if (shuffleProfileBasicsVisible()) return payload;
  const base = workshopProfileForRender() || {};
  return {
    ...base,
    schemaVersion: payload.schemaVersion || base.schemaVersion || 2,
    rules: payload.rules
  };
}

function syncWorkshopDraftFromDom(options = {}) {
  const form = $("#shuffleProfileForm");
  if (!form) return workshopProfileForRender();
  const renderedProfileId = $("[data-workshop-profile-select]")?.value || "";
  if (renderedProfileId !== currentWorkshopProfileId()) return workshopProfileForRender();
  const payload = mergeWorkshopPayloadWithBase(collectShuffleProfilePayload(new FormData(form)));
  state.workshopDraft = normalizeShuffleProfileClient(payload);
  state.workshopDraftProfileId = renderedProfileId;
  if (options.clearPreview !== false) clearWorkshopPreview();
  return state.workshopDraft;
}

function applyRuleLibrarySearch(query) {
  const normalized = String(query || "").trim().toLowerCase();
  const filter = RULE_LIBRARY_FILTERS.some(([value]) => value === state.ruleLibraryFilter)
    ? state.ruleLibraryFilter
    : "all";
  let visibleCount = 0;
  $$(".rule-library-item").forEach((item) => {
    const matchesSearch = !normalized || item.textContent.toLowerCase().includes(normalized);
    const matchesFilter = filter === "all" || item.dataset.ruleMetadata === filter;
    item.hidden = !(matchesSearch && matchesFilter);
    if (!item.hidden) visibleCount += 1;
  });
  const empty = $("[data-rule-library-empty]");
  if (empty) empty.hidden = visibleCount > 0;
}

function captureShuffleUiState() {
  const root = $("#viewShuffle");
  if (!root) return null;
  const main = $(".main-panel");
  return {
    ruleSearch: root.querySelector("[data-rule-search]")?.value || "",
    scrolls: {
      main: main?.scrollTop || 0,
      library: root.querySelector(".rule-library-list")?.scrollTop || 0,
      flow: root.querySelector(".shuffle-flow-panel")?.scrollTop || 0,
      inspector: root.querySelector(".workshop-inspector")?.scrollTop || 0
    },
    details: Object.fromEntries($$("#viewShuffle details[data-detail-key]").map((detail) => [detail.dataset.detailKey, detail.open]))
  };
}

function detailKeySelector(key) {
  return `details[data-detail-key="${String(key || "").replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"]`;
}

function restoreShuffleUiState(snapshot) {
  if (!snapshot) return;
  requestAnimationFrame(() => {
    const root = $("#viewShuffle");
    if (!root) return;
    for (const [key, open] of Object.entries(snapshot.details || {})) {
      const detail = root.querySelector(detailKeySelector(key));
      if (detail) detail.open = Boolean(open);
    }
    const search = root.querySelector("[data-rule-search]");
    if (search) {
      search.value = snapshot.ruleSearch || "";
      applyRuleLibrarySearch(search.value);
    }
    const main = $(".main-panel");
    const scrollTargets = [
      [main, snapshot.scrolls?.main],
      [root.querySelector(".rule-library-list"), snapshot.scrolls?.library],
      [root.querySelector(".shuffle-flow-panel"), snapshot.scrolls?.flow],
      [root.querySelector(".workshop-inspector"), snapshot.scrolls?.inspector]
    ];
    for (const [element, value] of scrollTargets) {
      if (element && Number.isFinite(Number(value))) element.scrollTop = Number(value);
    }
  });
}

function renderShuffle(options = {}) {
  const uiSnapshot = options.preserveUi === false ? null : captureShuffleUiState();
  if (options.captureDraft !== false) syncWorkshopDraftFromDom({ clearPreview: false });
  const active = workshopProfileForRender();
  const flowRules = active?.rules?.length ? active.rules : [];
  state.selectedShuffleRuleIndex = Math.max(0, Math.min(state.selectedShuffleRuleIndex || 0, Math.max(0, flowRules.length - 1)));
  const selectedProfile = state.activeShuffleProfileId || "";
  const saveLabel = workshopSaveLabel(active?.name || "");
  const recipeSummary = flowRules.length
    ? `This flow will ${flowRules.slice(0, 4).map((rule) => ruleSentence(rule).replace(/\.$/, "").toLowerCase()).join(", ")}.`
    : "Add rules or start from a template to build a custom queue.";

  $("#viewShuffle").innerHTML = `
    <div class="shuffle-workshop">
      <header class="workshop-hero">
        <div>
          <h2>Custom Shuffle Workshop</h2>
          <p class="muted-text">${escapeHtml(recipeSummary)}</p>
        </div>
        <div class="workshop-actions">
          <select class="workshop-profile-select" data-workshop-profile-select title="Choose a saved preset to load into the workshop.">
            <option value="">My Presets</option>
            ${state.customShuffles.map((profile) => `<option value="${escapeHtml(profile.id)}" ${profile.id === selectedProfile ? "selected" : ""}>${escapeHtml(profile.name)}</option>`).join("")}
          </select>
          <button class="tool-button" type="button" title="Import shared shuffle profile JSON" data-action="import-shuffle-profile">${icons.upload}<span>Import</span></button>
          <button class="tool-button" type="button" title="Export this shuffle flow as shareable JSON" data-action="export-shuffle-profile">${icons.save}<span>Export</span></button>
          <button class="tool-button" type="button" title="${saveLabel === "Update Preset" ? "Update the matching saved preset." : "Save the current flow as a reusable preset."}" data-workshop-save-button data-open-shuffle-save-dialog>${icons.save}<span data-workshop-save-label>${escapeHtml(saveLabel)}</span></button>
          <div class="workshop-generate-stack">
            ${metadataActionButtonHtml()}
            <button class="primary-button generate-button" type="button" title="Generate the actual playback queue from this flow." data-workshop-generate>${icons.shuffle}<span>Generate Queue</span></button>
          </div>
        </div>
      </header>

      <div class="workshop-stats">${workshopStatCardsHtml(flowRules)}</div>

      <section class="profile-basics-panel workshop-panel">
        ${profileBasicsHtml(active)}
      </section>

      <div class="workshop-grid">
        <aside class="rule-library-panel workshop-panel">
          <div class="panel-head">
            <div>
              <div class="section-title">Rule Library</div>
            </div>
          </div>
          <label class="workshop-search">
            ${icons.search}
            <input type="search" placeholder="Search" aria-label="Search rules" data-rule-search>
          </label>
          <div class="rule-filter-pills">
            ${ruleLibraryFilterPillsHtml()}
          </div>
          <div class="rule-library-list">
            ${ruleLibraryHtml()}
            <div class="empty-state compact-empty" data-rule-library-empty hidden>No matching rules</div>
          </div>
        </aside>

        <form id="shuffleProfileForm" class="shuffle-flow-panel workshop-panel">
          <div class="panel-head">
            <div>
              <div class="section-title">Shuffle Flow</div>
              <p class="muted-text">Top to bottom is execution order.</p>
            </div>
            <button class="link-button" type="button" data-clear-flow>Clear All</button>
          </div>
          <div data-flow-health-mount>${flowHealthHtml(flowRules)}</div>
          <div class="shuffle-rule-list flow-stack" data-shuffle-rule-list>
            ${flowRules.map((rule, index) => shuffleRuleRowHtml(rule, index)).join("")}
          </div>
          <div class="drop-rule-zone ${flowRules.length ? "compact-drop-zone" : ""}" data-rule-add-hint>${icons.plus}<span>${flowRules.length ? "Click a rule in the library to add another." : "Click a rule in the library to start."}</span></div>
        </form>

        <aside class="workshop-inspector workshop-preview-pane workshop-panel">
          ${workshopPreviewPaneHtml(flowRules)}
        </aside>
      </div>

      <section class="saved-workshop-panel workshop-panel">
        <div class="panel-head">
          <div>
            <div class="section-title">Saved Workshop Blocks</div>
            <p class="muted-text">Reuse, play, and refine your favorite rule stacks.</p>
          </div>
          <button class="tool-button" type="button" data-clear-shuffle-profile>${icons.x}<span>Default</span></button>
        </div>
        <div class="workshop-block-grid">${savedWorkshopBlocksHtml() || '<div class="muted-text">No saved shuffle profiles yet.</div>'}</div>
      </section>
    </div>
  `;
  restoreShuffleUiState(uiSnapshot);
}

let accentColorSaveTimer = 0;

async function saveSettingsPatch(payload) {
  const settings = await api("/api/settings", {
    method: "POST",
    body: JSON.stringify(payload)
  });
  state.settings = settings;
  state.settings.eq = normalizeEqSettings(settings.eq);
  state.savedAbLoops = normalizeSavedAbLoops(settings.advancedPlayback?.abLoops);
  state.abLoopPadLayouts = normalizeAbLoopPadLayouts(settings.advancedPlayback?.abLoopPadLayouts);
  return settings;
}

async function applyConnectionSettings() {
  const formElement = $("#settingsForm");
  if (!formElement) return;
  const form = new FormData(formElement);
  const token = String(form.get("plexToken") || "").trim();
  const plexBaseUrl = String(form.get("plexBaseUrl") || "").trim();
  const payload = {
    plexBaseUrl,
    plexPlaybackMode: browserOnlyPlaybackActive() ? "auto" : form.get("plexPlaybackMode")
  };
  if (token) payload.plexToken = token;
  if (!token && state.settings?.tokenSet) {
    delete payload.plexToken;
  }
  await saveSettingsPatch(payload);
  state.directPlexPlaybackAvailable = false;
  state.directPlexPlaybackProbeKey = "";
  state.directPlexPlaybackDisabled = false;
  applyAccentColor(state.settings.accentColor);
  try {
    const sections = await api("/api/library/sections");
    state.sections = sections.sections;
    showToast("Connection settings applied.");
  } catch (error) {
    const pageIsHttps = location.protocol === "https:";
    const plexIsHttp = /^http:\/\//i.test(plexBaseUrl);
    const hint = browserOnlyPlaybackActive() && pageIsHttps && plexIsHttp
      ? " Mobile browsers often block GitHub Pages from reaching an http Plex server. Try an https Plex URL, a browser-accessible Plex relay URL, or host VoidFM on the same local network/protocol."
      : browserOnlyPlaybackActive()
        ? " GitHub Pages can only connect directly from this browser, so Plex must allow this device/browser to reach it."
        : "";
    state.plexAuth = { pending: false, id: "", code: "", authUrl: "", status: `${error.message || "Could not load Plex libraries."}${hint}` };
    showToast("Settings saved, but Plex libraries could not load.");
  }
  renderAll();
  refreshLibrary();
}

async function saveSelectedPlexLibraries() {
  await saveSettingsPatch({
    musicSectionKeys: $$('[name="musicSectionKeys"]:checked').map((input) => input.value)
  });
  renderAll();
  refreshLibrary();
}

async function saveAccentColor(value) {
  const accentColor = sanitizeHex(value || state.settings?.accentColor || "#7d3cff");
  applyAccentColor(accentColor);
  await saveSettingsPatch({ accentColor });
  applyAccentColor(state.settings.accentColor);
}

function scheduleAccentColorSave(value) {
  if (accentColorSaveTimer) clearTimeout(accentColorSaveTimer);
  accentColorSaveTimer = setTimeout(() => {
    accentColorSaveTimer = 0;
    saveAccentColor(value).catch((error) => {
      showToast(error.message || "Could not save accent color.");
      renderSettings();
    });
  }, 350);
}

async function saveChordSyncSetting(onlineLookup) {
  await saveSettingsPatch({
    chordSync: {
      onlineLookup: Boolean(onlineLookup),
      analysisFallback: false
    }
  });
  if (state.view === "settings") renderSettings();
}

function storedPlexAuthCollapsed() {
  try {
    const value = localStorage.getItem(PLEX_AUTH_COLLAPSED_KEY);
    if (value === "1") return true;
    if (value === "0") return false;
  } catch {
    // Storage may be unavailable; fall back to the connection-aware default.
  }
  return null;
}

function plexAuthCollapsed() {
  if (state.plexAuth.pending) return false;
  if (state.plexAuthCollapsed === null) state.plexAuthCollapsed = storedPlexAuthCollapsed();
  if (state.plexAuthCollapsed !== null) return Boolean(state.plexAuthCollapsed);
  return Boolean(state.settings?.configured);
}

function setPlexAuthCollapsed(collapsed) {
  state.plexAuthCollapsed = Boolean(collapsed);
  try {
    localStorage.setItem(PLEX_AUTH_COLLAPSED_KEY, collapsed ? "1" : "0");
  } catch {
    // This is only a UI preference.
  }
  renderSettings();
}

function plexAuthHelpHtml() {
  if (!state.plexAuthHelpOpen) return "";
  return `
    <div class="playlist-window-backdrop plex-auth-help-backdrop" data-close-plex-auth-help>
      <section class="playlist-window plex-auth-help-window" role="dialog" aria-modal="true" aria-labelledby="plexAuthHelpTitle">
        <div class="playlist-settings-form">
          <header class="playlist-window-head">
            <div>
              <div class="section-title">Plex Sign-In</div>
              <h2 id="plexAuthHelpTitle">How Plex Sign-In Works</h2>
            </div>
            <button class="icon-button" type="button" title="Close" data-close-plex-auth-help>${icons.x}</button>
          </header>
          <div class="plex-auth-help-copy">
            <p>Use Sign in with Plex first. VoidFM creates a Plex pairing link, waits for approval, then saves the Plex token automatically.</p>
            <p>The token field is only a fallback if Plex sign-in cannot finish.</p>
            <p>If Plex approves the token but VoidFM cannot detect your server URL, enter your Plex server URL to finish. For a server on this computer, try http://127.0.0.1:32400. For another computer, use the LAN URL shown by Plex.</p>
          </div>
          <footer class="playlist-window-actions">
            <button class="primary-button" type="button" data-close-plex-auth-help>${icons.x}<span>Done</span></button>
          </footer>
        </div>
      </section>
    </div>
  `;
}

function plexAuthPanelHtml() {
  const authUrl = String(state.plexAuth.authUrl || "");
  return `
    <div class="plex-auth-panel">
      <button class="tool-button" type="button" data-plex-auth-start ${state.plexAuth.pending ? "disabled" : ""}>${icons.link}<span>${state.plexAuth.pending ? "Waiting for Plex" : "Sign in with Plex"}</span></button>
      <p class="muted-text">Sign in with Plex obtains and saves the token automatically after you approve VoidFM.</p>
      ${state.plexAuth.code ? `
        <div class="plex-auth-link-row">
          <a class="tool-button" href="${escapeHtml(authUrl)}" target="_blank" rel="noreferrer">${icons.link}<span>Open Plex Sign-In</span></a>
          <code>${escapeHtml(authUrl)}</code>
          <button class="tool-button" type="button" data-copy-text="${escapeHtml(authUrl)}">${icons.copy}<span>Copy</span></button>
        </div>
        <div class="pairing-code" aria-label="Plex pairing code">${escapeHtml(state.plexAuth.code)}</div>
      ` : ""}
      ${state.plexAuth.status ? `<p class="muted-text">${escapeHtml(state.plexAuth.status)}</p>` : ""}
    </div>
  `;
}

function renderSettings() {
  const sectionKeys = new Set(state.settings?.musicSectionKeys || []);
  const sectionRows = state.sections.map((section) => `
    <label class="section-check">
      <input
        type="checkbox"
        name="musicSectionKeys"
        value="${escapeHtml(section.key)}"
        ${sectionKeys.has(section.key) ? "checked" : ""}
      >
      <span>
        <strong>${escapeHtml(section.title)}</strong>
        <small>${escapeHtml(section.type || "library")}${section.scanner ? ` / ${escapeHtml(section.scanner)}` : ""}</small>
      </span>
    </label>
  `).join("");
  const localLibraries = state.settings?.localLibraries || [];
  const localRows = localLibraries.map((library) => {
    const scanned = library.lastScannedAt ? new Date(library.lastScannedAt).toLocaleString() : "Not scanned";
    return `
      <div class="local-library-row">
        <label class="section-check local-library-check">
          <input type="checkbox" data-local-library-enabled="${escapeHtml(library.id)}" ${library.enabled !== false ? "checked" : ""}>
          <span>
            <strong>${escapeHtml(library.name)}</strong>
            <small>${escapeHtml(library.path)}</small>
            <small>${Number(library.trackCount || 0)} songs / ${escapeHtml(scanned)}</small>
            ${library.error ? `<small class="error-text">${escapeHtml(library.error)}</small>` : ""}
          </span>
        </label>
        <div class="row-actions">
          <button class="icon-button" type="button" title="Scan library" data-scan-local-library="${escapeHtml(library.id)}">${icons.refresh}</button>
          <button class="icon-button" type="button" title="Remove library" data-delete-local-library="${escapeHtml(library.id)}">${icons.trash}</button>
        </div>
      </div>
    `;
  }).join("");
  const accent = sanitizeHex(state.settings?.accentColor || "#7d3cff");
  const chordSync = chordSyncSettings();
  const plexCollapsed = plexAuthCollapsed();
  $("#viewSettings").innerHTML = `
    <div class="settings-layout settings-dashboard">
      <div class="settings-action-bar">
        <button class="tool-button settings-eq-button" type="button" data-view="equalizer">${icons.equalizer}<span>Equalizer</span></button>
        <button class="primary-button settings-apply-button" type="button" data-apply-settings>${icons.save}<span>Apply</span></button>
      </div>

      <section class="settings-group settings-wide settings-plex-card ${plexCollapsed ? "collapsed" : "expanded"}">
        <div class="settings-group-head">
          <div>
            <div class="section-title">Plex Connection</div>
            <p class="muted-text">Connect to a Plex Media Server and choose which libraries this player should use.</p>
          </div>
          <div class="plex-connection-actions">
            <button class="tool-button plex-auth-toggle" type="button" data-toggle-plex-auth aria-expanded="${plexCollapsed ? "false" : "true"}">
              ${plexCollapsed ? icons.arrowRight : icons.minus}<span>${plexCollapsed ? "Show Plex Connection" : "Hide Plex Connection"}</span>
            </button>
            <button class="icon-button plex-auth-help-button" type="button" title="Plex connection help" aria-label="Plex connection help" data-open-plex-auth-help>?</button>
          </div>
        </div>
        ${plexCollapsed ? "" : `
          <div class="plex-connection-body">
            <form id="settingsForm" class="settings-form connection-form settings-connection-form">
              <label class="field">
                <span>Plex URL</span>
                <input name="plexBaseUrl" value="${escapeHtml(state.settings?.plexBaseUrl || "")}" placeholder="http://127.0.0.1:32400">
              </label>
              <label class="field">
                <span>Token</span>
                <input name="plexToken" value="" placeholder="${state.settings?.tokenSet ? "Saved" : "X-Plex-Token"}" type="password">
                <small>Only paste an X-Plex-Token here if sign-in does not work.</small>
              </label>
              <label class="field">
                <span>Playback</span>
                <select name="plexPlaybackMode">
                  <option value="proxy" ${(state.settings?.plexPlaybackMode || "proxy") === "proxy" ? "selected" : ""}>Proxy</option>
                  <option value="auto" ${state.settings?.plexPlaybackMode === "auto" ? "selected" : ""}>Auto Direct</option>
                </select>
              </label>
            </form>
            ${plexAuthPanelHtml()}
            <form id="librarySectionsForm" class="section-picker settings-library-picker">
              <div class="settings-subsection-head">
                <div class="section-title">Selected Plex Libraries</div>
              </div>
              <div class="section-checks settings-library-checks">
                ${sectionRows || '<div class="muted-text">Apply Plex settings to load library choices.</div>'}
              </div>
            </form>
          </div>
        `}
      </section>

      <div class="settings-grid settings-grid-two">
        <section class="settings-group">
          <div class="settings-group-head">
            <div>
              <div class="section-title">Local Libraries</div>
              <p class="muted-text">Use folders on this computer as music sources without Plex.</p>
            </div>
            <button class="tool-button" type="button" data-scan-local-libraries>${icons.refresh}<span>Scan All</span></button>
          </div>
          <form id="localLibraryForm" class="settings-form local-library-form">
            <label class="field local-path-field">
              <span>Local Music</span>
              <input name="path" placeholder="D:\\Music">
            </label>
            <input name="name" value="Local Music" type="hidden">
            <button class="primary-button" type="submit">${icons.plus}<span>Add</span></button>
          </form>
          <div class="local-library-list">
            ${localRows || '<div class="muted-text">No local media libraries yet.</div>'}
          </div>
        </section>

        <section class="settings-group">
          <div class="settings-group-head">
            <div>
              <div class="section-title">Library Files</div>
              <p class="muted-text">Export the full track list or import playlists / JSON files.</p>
            </div>
          </div>
          <div class="settings-file-actions">
            <button class="tool-button" type="button" title="Export track list" data-action="export-library">${icons.download}<span>Export Track List</span></button>
            <button class="tool-button" type="button" title="Import playlists" data-action="import-playlists">${icons.upload}<span>Import Playlists</span></button>
          </div>
        </section>

        <section class="settings-group">
          <div class="settings-group-head">
            <div>
              <div class="section-title">Lyrics Enrichment</div>
              <p class="muted-text" data-lyrics-scan-summary>${escapeHtml(lyricsScanStatusLine())}</p>
            </div>
          </div>
          <div class="settings-file-actions lyrics-scan-actions">
            ${lyricsScanButtonHtml()}
            ${metadataActionButtonHtml()}
          </div>
        </section>
      </div>

      <div class="settings-grid settings-grid-three">
        <section class="settings-group">
          <div class="settings-group-head">
            <div>
              <div class="section-title">General</div>
              <p class="muted-text">Set app-wide preferences that are not tied to your Plex connection.</p>
            </div>
          </div>
          <form id="accentForm" class="accent-form">
            <label class="field color-field">
              <span>Accent Color</span>
              <input name="accentColor" value="${escapeHtml(accent)}" type="color">
            </label>
          </form>
          <form id="playbackBehaviorForm" class="settings-form playback-behavior-form">
            <label class="section-check settings-toggle-row">
              <input name="softSkip" type="checkbox" ${state.softSkip ? "checked" : ""}>
              <span>
                <strong>Soft Skip</strong>
                <small>Fade manual skips into the next playable song.</small>
              </span>
            </label>
          </form>
          <form id="chordSyncForm" class="settings-form chord-sync-form">
            <label class="section-check settings-toggle-row">
              <input name="onlineLookup" type="checkbox" ${chordSync.onlineLookup ? "checked" : ""}>
              <span>
                <strong>Online chord annotations</strong>
                <small>Try public chord annotation sources first for known timed chords.</small>
              </span>
            </label>
          </form>
        </section>
        <section class="settings-group">
          <div class="settings-group-head">
            <div>
              <div class="section-title">Music Rules</div>
              <p class="muted-text">Manage blocked music and required follow-up songs.</p>
            </div>
            <button class="tool-button" type="button" data-view="blocked">${icons.ban}<span>Blocked Music</span></button>
          </div>
          <div class="settings-subsection">
            <div class="settings-subsection-head">
              <div class="section-title">Linked Songs</div>
              <p class="muted-text">If one song is an intro, search for it and choose the song that must follow.</p>
            </div>
            ${renderLinkManager()}
          </div>
        </section>
      </div>

      <section class="settings-group settings-wide">
        <div class="settings-group-head">
          <div>
            <div class="section-title">Export User Data</div>
            <p class="muted-text">Download playlists, custom shuffles, Plex connection details, local library locations, rules, metadata, listening history, and the full VoidFM database as one backup zip.</p>
            <p class="muted-text">${escapeHtml(backupTimeLabel(state.backupStatus?.latestAutoBackupAt))}</p>
            ${state.backupStatus?.backupFolder ? `<p class="muted-text backup-folder-path">${escapeHtml(state.backupStatus.backupFolder)}</p>` : ""}
          </div>
          <div class="settings-file-actions">
            <button class="tool-button" type="button" data-action="open-backup-folder">${icons.folder}<span>Open Backup Folder</span></button>
            <button class="tool-button" type="button" data-action="export-user-data">${icons.download}<span>Export Backup</span></button>
          </div>
        </div>
        <div class="settings-file-actions">
          <div class="muted-text">
            ${escapeHtml(backupStatusSummary())}
          </div>
          <div class="muted-text" data-export-user-data-status></div>
        </div>
      </section>

      <section class="settings-group settings-wide">
        <div class="settings-group-head">
          <div>
            <div class="section-title">Import User Data</div>
            <p class="muted-text">Restore a VoidFM browser backup ZIP exported from this web app, or an older JSON browser backup.</p>
          </div>
          <div class="settings-file-actions">
            <button class="tool-button" type="button" data-browser-import-backup>${icons.upload}<span>Import Backup ZIP</span></button>
            <input type="file" accept="application/zip,.zip,application/json,.json" data-browser-import-backup-input hidden>
          </div>
        </div>
        <div class="settings-file-actions">
          <div class="muted-text" data-import-user-data-status>Imported backups replace the browser database. Local folder permissions must be granted again after restore.</div>
        </div>
      </section>
    </div>
  `;
}

function eqPresetSelectValue(eq, mode) {
  const presetId = eq[eqPresetIdField(mode)];
  if (presetId) return `user::${presetId}`;
  const name = eq[eqPresetNameField(mode)] || "Flat";
  if (eqPresetsForMode(mode).some((preset) => preset.name === name)) return `builtin::${name}`;
  return "custom";
}

function eqPresetOptionsHtml(mode, eq) {
  const selected = eqPresetSelectValue(eq, mode);
  const presetsByName = new Map(eqPresetsForMode(mode).map((preset) => [preset.name, preset]));
  const groupHtml = EQ_PRESET_GROUPS.map(([label, names]) => {
    const options = names
      .filter((name) => presetsByName.has(name))
      .map((name) => {
        const value = `builtin::${name}`;
        return `<option value="${escapeHtml(value)}" ${selected === value ? "selected" : ""}>${escapeHtml(name)}</option>`;
      })
      .join("");
    return options ? `<optgroup label="${escapeHtml(label)}">${options}</optgroup>` : "";
  }).join("");
  const userOptions = eq.userPresets
    .filter((preset) => preset.mode === mode)
    .map((preset) => {
      const value = `user::${preset.id}`;
      return `<option value="${escapeHtml(value)}" ${selected === value ? "selected" : ""}>${escapeHtml(preset.name)}</option>`;
    })
    .join("");
  return `
    <option value="custom" ${selected === "custom" ? "selected" : ""}>Custom</option>
    ${groupHtml}
    ${userOptions ? `<optgroup label="Saved Presets">${userOptions}</optgroup>` : ""}
  `;
}

function builtinEqPresetReference(mode, name) {
  return `builtin::${mode}::${name}`;
}

function userEqPresetReference(id) {
  return `user::${id}`;
}

function eqModeLabel(mode) {
  return mode === "advanced" ? "Advanced EQ" : "Standard EQ";
}

function resolveEqPresetReference(reference) {
  const value = String(reference || "");
  const eq = eqSettings();
  if (value.startsWith("user::")) {
    const id = value.slice("user::".length);
    const preset = eq.userPresets.find((item) => item.id === id);
    return preset ? { preset, mode: preset.mode, userPreset: true } : null;
  }
  if (value.startsWith("builtin::")) {
    const [, mode, ...nameParts] = value.split("::");
    const name = nameParts.join("::");
    if (!["standard", "advanced"].includes(mode) || !name) return null;
    const preset = eqPresetsForMode(mode).find((item) => item.name === name);
    return preset ? { preset: { ...preset, userPreset: false }, mode, userPreset: false } : null;
  }
  return null;
}

function playlistEqPresetOptionsHtml(selectedValue = "") {
  const selected = String(selectedValue || "");
  const known = new Set([""]);
  const eq = eqSettings();
  const selectedResolved = selected ? resolveEqPresetReference(selected) : null;
  const userOptions = eq.userPresets.map((preset) => {
    const value = userEqPresetReference(preset.id);
    known.add(value);
    return `<option value="${escapeHtml(value)}" ${selected === value ? "selected" : ""}>${escapeHtml(`${preset.name} (${eqModeLabel(preset.mode)})`)}</option>`;
  }).join("");
  const builtInGroups = ["standard", "advanced"].map((mode) => {
    const options = eqPresetsForMode(mode).map((preset) => {
      const value = builtinEqPresetReference(mode, preset.name);
      known.add(value);
      return `<option value="${escapeHtml(value)}" ${selected === value ? "selected" : ""}>${escapeHtml(preset.name)}</option>`;
    }).join("");
    return `<optgroup label="${escapeHtml(eqModeLabel(mode))}">${options}</optgroup>`;
  }).join("");
  const missingSelected = selected && !known.has(selected)
    ? `<option value="${escapeHtml(selected)}" selected>${escapeHtml(selectedResolved?.preset?.name || "Preset unavailable")}</option>`
    : "";
  return `
    <option value="" ${selected ? "" : "selected"}>Use current equalizer</option>
    ${missingSelected}
    ${userOptions ? `<optgroup label="Saved Presets">${userOptions}</optgroup>` : ""}
    ${builtInGroups}
  `;
}

function eqSliderPercent(value) {
  return ((clampDb(value) - EQ_GAIN_MIN) / (EQ_GAIN_MAX - EQ_GAIN_MIN)) * 100;
}

function eqBandHtml(band, value, mode) {
  const amount = clampDb(value);
  const fill = eqSliderPercent(amount);
  return `
    <div class="eq-band ${mode === "advanced" ? "eq-advanced-band" : "eq-standard-band"}" data-eq-band-card="${escapeHtml(band.key)}">
      <div class="eq-band-title">${escapeHtml(band.label)}</div>
      <div class="eq-band-frequency">${escapeHtml(band.display)}</div>
      <div class="eq-slider-row">
        <div class="eq-scale" aria-hidden="true">
          <span>+12</span>
          <span>+6</span>
          <span>0</span>
          <span>-6</span>
          <span>-12</span>
        </div>
        <div class="eq-slider-shell" style="--eq-fill: ${fill}%">
          <div class="eq-slider-track"></div>
          <div class="eq-slider-fill"></div>
          <input
            type="range"
            min="${EQ_GAIN_MIN}"
            max="${EQ_GAIN_MAX}"
            step="1"
            value="${escapeHtml(amount)}"
            data-eq-band="${escapeHtml(band.key)}"
            aria-label="${escapeHtml(`${band.label} gain`)}"
            aria-valuetext="${escapeHtml(dbText(amount, true))}"
          >
        </div>
        <div class="eq-ticks" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></div>
      </div>
      <output class="eq-value-box" data-eq-band-value="${escapeHtml(band.key)}">${escapeHtml(dbText(amount))}</output>
    </div>
  `;
}

function eqClippingHtml(eq) {
  const info = eqClippingInfo(eq);
  return `
    <div class="eq-clip-indicator ${escapeHtml(info.tone)}" data-eq-clip-indicator>
      <span>${escapeHtml(info.label)}</span>
      <small>${escapeHtml(info.detail)}</small>
    </div>
  `;
}

function eqPreampKnobStyle(value) {
  const percent = (clampDb(value, 0, EQ_PREAMP_MIN, EQ_PREAMP_MAX) - EQ_PREAMP_MIN) / (EQ_PREAMP_MAX - EQ_PREAMP_MIN);
  const angle = -135 + (270 * percent);
  return `--eq-knob-angle: ${angle}deg; --eq-knob-fill: ${Math.max(0, Math.min(100, percent * 100))}%`;
}

function renderEqualizer() {
  ensureCurrentStylesheet();
  const eq = eqSettings();
  const mode = eq.mode;
  const bands = eqBandsForMode(mode);
  const values = eq[mode] || {};
  const presetLabel = mode === "advanced" ? "10-Band Equalizer" : "5-Band Equalizer";
  const presetCopy = mode === "advanced"
    ? "Precise control over 10 frequency bands for advanced sound shaping."
    : "Adjust the major frequency ranges.";
  $("#viewEqualizer").innerHTML = `
    <div class="eq-layout">
      <div class="eq-mode-tabs" role="tablist" aria-label="Equalizer mode">
        <button class="eq-mode-button ${mode === "standard" ? "active" : ""}" type="button" data-eq-mode="standard">${icons.equalizer}<span>Standard EQ</span></button>
        <button class="eq-mode-button ${mode === "advanced" ? "active" : ""}" type="button" data-eq-mode="advanced">${icons.wave}<span>Advanced EQ</span></button>
      </div>

      <section class="eq-panel ${mode === "advanced" ? "advanced" : "standard"}">
        <div class="eq-panel-head">
          <div>
            <div class="section-title">${escapeHtml(presetLabel)}</div>
            <p class="muted-text">${escapeHtml(presetCopy)}</p>
          </div>
          <div class="eq-preset-toolbar">
            <label class="eq-preset-select">
              <span>Presets</span>
              <select data-eq-preset-select>${eqPresetOptionsHtml(mode, eq)}</select>
            </label>
            ${mode === "advanced" ? `
              <button class="tool-button" type="button" data-action="export-eq-presets" title="Export advanced EQ presets">${icons.download}<span>Export</span></button>
              <button class="tool-button" type="button" data-action="import-eq-presets" title="Import advanced EQ presets">${icons.upload}<span>Import</span></button>
            ` : ""}
            <button class="tool-button" type="button" data-eq-save-preset>${icons.save}<span>Save Preset</span></button>
            <button class="tool-button" type="button" data-eq-reset>${icons.refresh}<span>Reset</span></button>
          </div>
        </div>

        <div class="eq-bands ${mode}">
          ${bands.map((band) => eqBandHtml(band, values[band.key], mode)).join("")}
        </div>
      </section>

      <section class="eq-control-panel">
        <div class="eq-preamp-block">
          <div>
            <div class="section-title">Preamp</div>
            <p class="muted-text">Adjust overall output volume.</p>
          </div>
          <label class="eq-knob-control" style="${eqPreampKnobStyle(eq.preamp)}">
            <span class="eq-knob" aria-hidden="true"></span>
            <input type="range" min="${EQ_PREAMP_MIN}" max="${EQ_PREAMP_MAX}" step="0.5" value="${escapeHtml(eq.preamp)}" data-eq-preamp aria-label="Preamp gain">
          </label>
          <output class="eq-preamp-value" data-eq-preamp-value>${escapeHtml(dbText(eq.preamp))}</output>
        </div>

        <div class="eq-save-block eq-safety-block">
          <div class="eq-option-row">
            <label class="toggle-pill">
              <input type="checkbox" data-eq-auto-headroom ${eq.autoHeadroom ? "checked" : ""}>
              <span>Auto Headroom</span>
            </label>
            <label class="toggle-pill">
              <input type="checkbox" data-eq-limiter ${eq.limiter ? "checked" : ""}>
              <span>Limiter</span>
            </label>
            ${eqClippingHtml(eq)}
          </div>
        </div>

        <div class="eq-bypass-block">
          <div>
            <div class="section-title">EQ Bypass</div>
            <p class="muted-text">Turn off the equalizer to hear the original sound.</p>
          </div>
          <label class="eq-switch">
            <input type="checkbox" data-eq-bypass ${eq.bypass ? "checked" : ""} aria-label="EQ bypass">
            <span></span>
          </label>
        </div>
      </section>
    </div>
  `;
}

function syncEqControls() {
  const eq = eqSettings();
  const values = eq[eq.mode] || {};
  for (const input of $$("[data-eq-band]")) {
    const key = input.dataset.eqBand;
    const value = clampDb(values[key]);
    input.value = String(value);
    input.setAttribute("aria-valuetext", dbText(value, true));
    input.closest(".eq-slider-shell")?.style.setProperty("--eq-fill", `${eqSliderPercent(value)}%`);
    const output = $(`[data-eq-band-value="${CSS.escape(key)}"]`);
    if (output) output.textContent = dbText(value);
  }
  const presetSelect = $("[data-eq-preset-select]");
  if (presetSelect) presetSelect.value = eqPresetSelectValue(eq, eq.mode);
  const preamp = $("[data-eq-preamp]");
  if (preamp) preamp.value = String(eq.preamp);
  const knob = $(".eq-knob-control");
  if (knob) knob.setAttribute("style", eqPreampKnobStyle(eq.preamp));
  const preampValue = $("[data-eq-preamp-value]");
  if (preampValue) preampValue.textContent = dbText(eq.preamp);
  const autoHeadroom = $("[data-eq-auto-headroom]");
  if (autoHeadroom) autoHeadroom.checked = eq.autoHeadroom;
  const limiter = $("[data-eq-limiter]");
  if (limiter) limiter.checked = eq.limiter;
  const bypass = $("[data-eq-bypass]");
  if (bypass) bypass.checked = eq.bypass;
  const clip = $("[data-eq-clip-indicator]");
  if (clip) clip.outerHTML = eqClippingHtml(eq);
  renderPlayer();
}

function updateEqBand(key, value) {
  const eq = eqSettings();
  const mode = eq.mode;
  eq[mode] = {
    ...eq[mode],
    [key]: clampDb(value)
  };
  applyEqPresetMatch(eq, mode);
  applyAutoHeadroom(eq, mode);
  setEqSettings(eq);
  applyEqSettingsToAudio();
  syncEqControls();
  scheduleEqSettingsSave();
}

function updateEqPreamp(value) {
  const eq = eqSettings();
  eq.preamp = clampDb(value, 0, EQ_PREAMP_MIN, EQ_PREAMP_MAX);
  eq.autoHeadroom = false;
  setEqSettings(eq);
  applyEqSettingsToAudio();
  syncEqControls();
  scheduleEqSettingsSave();
}

async function switchEqMode(mode) {
  if (!["standard", "advanced"].includes(mode)) return;
  const eq = eqSettings();
  if (eq.mode === mode) return;
  const previousName = eq[eqPresetNameField(eq.mode)];
  eq.mode = mode;
  const matchingPreset = eqPresetsForMode(mode).find((preset) => preset.name === previousName)
    || eq.userPresets.find((preset) => preset.mode === mode && preset.name === previousName);
  if (matchingPreset) {
    eq[mode] = normalizeEqBandValues(matchingPreset.bands, mode);
    eq[eqPresetNameField(mode)] = matchingPreset.name;
    eq[eqPresetIdField(mode)] = matchingPreset.userPreset ? matchingPreset.id : "";
    if (matchingPreset.preamp !== undefined && !eq.autoHeadroom) eq.preamp = clampDb(matchingPreset.preamp, eq.preamp, EQ_PREAMP_MIN, EQ_PREAMP_MAX);
  }
  applyAutoHeadroom(eq, mode);
  setEqSettings(eq);
  applyEqSettingsToAudio();
  renderEqualizer();
  await saveEqSettingsNow({ render: false });
}

async function applyEqPresetSelection(value) {
  const mode = eqSettings().mode;
  let reference = "";
  if (value.startsWith("builtin::")) {
    const name = value.slice("builtin::".length);
    reference = builtinEqPresetReference(mode, name);
  } else if (value.startsWith("user::")) {
    reference = value;
  }
  if (reference && applyEqPresetReference(reference, { save: false, render: false })) {
    renderEqualizer();
    await saveEqSettingsNow({ render: false });
    return;
  }
  const eq = eqSettings();
  eq[eqPresetNameField(mode)] = "Custom";
  eq[eqPresetIdField(mode)] = "";
  applyAutoHeadroom(eq, mode);
  setEqSettings(eq);
  applyEqSettingsToAudio();
  renderEqualizer();
  await saveEqSettingsNow({ render: false });
}

function applyEqPresetReference(reference, options = {}) {
  const resolved = resolveEqPresetReference(reference);
  if (!resolved) return false;
  const eq = eqSettings();
  const mode = resolved.mode;
  const preset = resolved.preset;
  eq.mode = mode;
  eq[mode] = normalizeEqBandValues(preset.bands, mode);
  eq[eqPresetNameField(mode)] = preset.name;
  eq[eqPresetIdField(mode)] = resolved.userPreset ? preset.id : "";
  if (preset.preamp !== undefined && !eq.autoHeadroom) {
    eq.preamp = clampDb(preset.preamp, eq.preamp, EQ_PREAMP_MIN, EQ_PREAMP_MAX);
  }
  applyAutoHeadroom(eq, mode);
  setEqSettings(eq);
  applyEqSettingsToAudio();
  if (options.render !== false) {
    if (state.view === "equalizer") renderEqualizer();
    else renderPlayer();
  }
  if (options.save) scheduleEqSettingsSave();
  return true;
}

async function resetCurrentEq() {
  const eq = eqSettings();
  const flat = eqPresetsForMode(eq.mode).find((preset) => preset.name === "Flat");
  eq[eq.mode] = normalizeEqBandValues(flat?.bands, eq.mode);
  eq[eqPresetNameField(eq.mode)] = "Flat";
  eq[eqPresetIdField(eq.mode)] = "";
  eq.preamp = 0;
  setEqSettings(eq);
  applyEqSettingsToAudio();
  renderEqualizer();
  await saveEqSettingsNow({ render: false });
}

async function saveCurrentEqPreset(name) {
  const eq = eqSettings();
  const mode = eq.mode;
  const presetName = cleanText(name).slice(0, 80);
  if (!presetName) {
    showToast("Name the EQ preset first.");
    return;
  }
  const existingIndex = eq.userPresets.findIndex((preset) => preset.mode === mode && preset.name.toLowerCase() === presetName.toLowerCase());
  if (existingIndex >= 0 && !confirm("Overwrite existing preset?")) return;
  const now = new Date().toISOString();
  const existing = existingIndex >= 0 ? eq.userPresets[existingIndex] : null;
  const preset = {
    id: existing?.id || randomId("eq-preset"),
    name: presetName,
    mode,
    bands: normalizeEqBandValues(eq[mode], mode),
    preamp: clampDb(eq.preamp, 0, EQ_PREAMP_MIN, EQ_PREAMP_MAX),
    userPreset: true,
    createdAt: existing?.createdAt || now,
    updatedAt: now
  };
  if (existingIndex >= 0) eq.userPresets[existingIndex] = preset;
  else eq.userPresets.unshift(preset);
  eq[eqPresetNameField(mode)] = preset.name;
  eq[eqPresetIdField(mode)] = preset.id;
  setEqSettings(eq);
  renderEqualizer();
  await saveEqSettingsNow({ render: false });
  showToast(`Saved ${preset.name}.`);
}

function exportAdvancedEqPresets() {
  const eq = eqSettings();
  const advancedPresets = eq.userPresets.filter((preset) => preset.mode === "advanced");
  const presets = advancedPresets.length
    ? advancedPresets
    : [{
      id: randomId("eq-preset"),
      name: eq.advancedPresetName === "Custom" ? "Custom Advanced EQ" : eq.advancedPresetName,
      mode: "advanced",
      bands: normalizeEqBandValues(eq.advanced, "advanced"),
      preamp: eq.preamp,
      userPreset: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }];
  downloadJson({
    kind: EQ_EXPORT_KIND,
    version: 1,
    mode: "advanced",
    exportedAt: new Date().toISOString(),
    presets: presets.map((preset) => ({
      name: preset.name,
      mode: "advanced",
      bands: normalizeEqBandValues(preset.bands, "advanced"),
      preamp: clampDb(preset.preamp, 0, EQ_PREAMP_MIN, EQ_PREAMP_MAX)
    }))
  }, "VoidFM Advanced EQ Presets.voidfm-eq.json");
  showToast("Exported advanced EQ presets.");
}

async function importEqPresetFiles(fileList) {
  const files = Array.from(fileList || []);
  if (!files.length) return;
  const eq = eqSettings();
  let imported = 0;
  const errors = [];
  for (const file of files) {
    try {
      const raw = await readFileAsText(file);
      const parsed = JSON.parse(raw);
      const records = Array.isArray(parsed?.presets) ? parsed.presets : Array.isArray(parsed) ? parsed : [parsed];
      for (const record of records) {
        const preset = normalizeEqUserPreset({
          ...record,
          mode: "advanced",
          id: randomId("eq-preset")
        });
        if (!preset || preset.mode !== "advanced") continue;
        eq.userPresets = eq.userPresets.filter((item) => !(item.mode === "advanced" && item.name.toLowerCase() === preset.name.toLowerCase()));
        eq.userPresets.unshift(preset);
        imported += 1;
      }
    } catch (error) {
      errors.push(error);
    }
  }
  setEqSettings(eq);
  renderEqualizer();
  await saveEqSettingsNow({ render: false });
  if (imported) showToast(`Imported ${imported} advanced EQ preset${imported === 1 ? "" : "s"}.`);
  else showToast(errors[0]?.message || "No advanced EQ presets imported.");
}

function renderActiveView() {
  if (state.view === "library") renderLibrary();
  else {
    cancelLazyTrackRows();
    if (state.view === "playlists") renderPlaylists();
    else if (state.view === "shuffle") renderShuffle();
    else if (state.view === "blocked") renderBlocked();
    else if (state.view === "settings") renderSettings();
    else if (state.view === "equalizer") renderEqualizer();
    else if (state.view === AB_LOOP_ADVANCED_VIEW) renderAbLoopAdvancedView();
  }
}

function queueRowHtml(track, index) {
  const active = index === state.currentIndex;
  const title = trackTitleWithTrimMarker(track, trackTrimForContext(track));
  const unsupported = unsupportedPlaybackReason(track);
  return `
    <button type="button" class="queue-item ${active ? "active" : ""} ${unsupported ? "unsupported-format" : ""}" data-queue-index="${index}" title="${unsupported ? escapeHtml(unsupportedPlaybackMessage(track)) : ""}">
      <div class="queue-status">${active ? icons.speaker : `<span>${index + 1}</span>`}</div>
      <div class="queue-art" style="${artStyle(track)}"></div>
      <div>
        <div class="song-title-line"><span class="queue-title">${escapeHtml(title)}</span>${unsupportedFormatBadgeHtml(track)}</div>
        <div class="queue-artist">${escapeHtml(track.artist)}</div>
      </div>
    </button>`;
}

function cancelLazyQueueRows() {
  lazyQueueRenderToken += 1;
}

function scheduleLazyQueueRows(queueSnapshot, startIndex) {
  if (queueSnapshot.length <= startIndex) {
    cancelLazyQueueRows();
    return;
  }
  const token = ++lazyQueueRenderToken;
  scheduleLazyHtmlChunks({
    items: queueSnapshot,
    startIndex,
    chunkSize: QUEUE_RENDER_CHUNK_SIZE,
    token,
    currentToken: () => lazyQueueRenderToken,
    markerSelector: "#lazyQueueRows",
    renderChunk: (chunk, index) => chunk.map((track, offset) => queueRowHtml(track, index + offset)).join(""),
    afterChunk: syncQueueActive
  });
}

function renderQueueHeader() {
  const track = currentTrack();
  const lyricsOpen = state.lyricsPanelOpen;
  const chordsOpen = state.chordsPanelOpen;
  $(".app-shell")?.classList.toggle("chords-open", chordsOpen);
  $(".app-shell")?.classList.toggle("lyrics-open", lyricsOpen);
  $(".queue-panel")?.classList.toggle("lyrics-mode", lyricsOpen);
  $(".queue-panel")?.classList.toggle("lyrics-open", lyricsOpen);
  $(".queue-panel")?.classList.toggle("chords-mode", chordsOpen);
  $(".queue-panel")?.classList.toggle("chords-open", chordsOpen);
  $("#queuePanelTitle").textContent = lyricsOpen ? "Lyrics" : chordsOpen ? "Chords" : "Queue";
  $("#queueCount").textContent = lyricsOpen || chordsOpen
    ? (track ? `${track.title} - ${track.artist}` : "Nothing playing")
    : `${state.queue.length} songs`;
  $("#queueHeaderActions").innerHTML = lyricsOpen
    ? `
      <button class="icon-button" type="button" title="Pop out lyrics" data-popout-lyrics>${icons.popout}</button>
      <button class="icon-button" type="button" title="Hide lyrics" data-hide-lyrics>${icons.x}</button>
    `
    : chordsOpen
      ? `
        <button class="icon-button" type="button" title="Clear chords" data-clear-chords>${icons.trash}</button>
        <button class="icon-button" type="button" title="Pop out chords" data-popout-chords>${icons.popout}</button>
        <button class="icon-button" type="button" title="Hide chords" data-hide-chords>${icons.x}</button>
      `
    : `<button class="icon-button" type="button" title="Queue options" aria-label="Queue options" id="queueMenuButton" data-queue-menu-trigger>${icons.more}</button>`;
}

function lyricsPanelHtml() {
  const track = currentTrack();
  const lyrics = currentLyrics();
  if (!track) return '<div class="empty-state">Nothing playing</div>';
  if (!hasLyricsContent(lyrics)) {
    const statusText = lyrics?.status === "error"
      ? "Lyrics lookup could not reach LRCLIB. It will retry."
      : lyrics?.status === "loading" || !terminalLyricsStatus(lyrics)
        ? "Finding lyrics..."
        : "No lyrics found yet.";
    return `<div class="empty-state">${escapeHtml(statusText)}</div>`;
  }
  const synced = hasSyncedLyrics(lyrics);
  const active = synced ? activeLyricIndex() : -1;
  const lines = synced ? lyrics.syncedLines : plainLyricsLines(lyrics);
  return `
    <div class="lyrics-panel" data-lyrics-panel>
      <div class="lyrics-now">
        <div class="queue-art" style="${artStyle(track)}"></div>
        <div>
          <div class="queue-title">${escapeHtml(track.title)}</div>
          <div class="queue-artist">${escapeHtml(synced ? track.artist : `${track.artist} - sync not available for this track`)}</div>
        </div>
      </div>
      <div class="lyrics-lines">
        ${lines.map((line, index) => `
          <div class="lyrics-line ${synced && index === active ? "active" : ""} ${synced ? "" : "plain"}" data-lyric-index="${index}" data-lyric-time="${Number(line.timeMs || 0)}">
            ${escapeHtml(line.text)}
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function chordPanelStatusText(chords, track) {
  if (chords?.status === "searching") return "Looking for online chord annotations...";
  if (chords?.status === "loading") return "Checking for cached chords...";
  if (chords?.status === "error") return chords.detail || "Chord sync failed";
  if (!chordSyncSettings().onlineLookup) return "Chord lookup is off.";
  if (chords?.status === "not_found") return "No online chords found. Paste a chord sheet to add the correct chords.";
  if (!canStreamTrack(track) && !chordSyncSettings().onlineLookup) return "No chord sync";
  return "Open chord sync to find online chords.";
}

function chordChangeRange(change) {
  return `${msToTime(change.timeMs)} - ${msToTime(change.endTimeMs)}`;
}

function chordSourceLabel(chords) {
  if (chords?.provider === "manual") return chords.status === "available" ? "Manual - lyric aligned" : "Manual chord sheet";
  if (chords?.provider === "isophonics") return "Isophonics";
  return "Chord sync";
}

function chordSheetLineHidden(line) {
  const text = String(line?.lyric || line?.raw || "").trim();
  const chords = Array.isArray(line?.chords) ? line.chords : [];
  return !chords.length && /\b(tuning|capo)\b/i.test(text);
}

function chordImportFormHtml(chords, open = false) {
  const sheet = chords?.rawSheet || "";
  return `
    <details class="chord-import" ${open ? "open" : ""}>
      <summary>${escapeHtml(hasDisplayableChords(chords) ? "Edit pasted chords" : "Paste chords")}</summary>
      <form class="chord-import-form" data-chord-import-form>
        <textarea name="sheetText" spellcheck="false" placeholder="[Intro]\nAm F C G\n\nAm                 F\nGo on and close the curtains">${escapeHtml(sheet)}</textarea>
        <div class="chord-import-note">Please note: if the chord sheet flow does not match the karaoke lyrics flow, chord scrolling may ignore or skip lines.</div>
        ${state.chordImportStatus ? `<div class="chord-import-status">${escapeHtml(state.chordImportStatus)}</div>` : ""}
        <button class="primary-button" type="submit">${icons.save}<span>Save & Align</span></button>
      </form>
    </details>
  `;
}

function looksLikeChordTabText(value) {
  const text = String(value || "").trim();
  if (!text.includes("|")) return false;
  const stripped = text.replace(/[|()[\],.:;xX0-9\-–—]/g, " ");
  const tokens = stripped.split(/\s+/).filter(Boolean);
  return Boolean(tokens.length) && tokens.every((token) => {
    return chordTokenLooksRenderable(token);
  });
}

function chordTabText(line) {
  const raw = String(line?.raw || "").trim();
  if (raw && !raw.includes("\n") && looksLikeChordTabText(raw)) return raw;
  const lyric = String(line?.lyric || "").trim();
  if (lyric && looksLikeChordTabText(lyric)) return lyric;
  return "";
}

function chordProgressionText(line, chords) {
  const tab = chordTabText(line);
  if (tab) return tab;
  const raw = String(line.raw || "").trim();
  if (raw && !line.lyric) return raw;
  return chords.map((chord) => chord.chord).join("  ");
}

function chordTokenLooksRenderable(value) {
  return /^[A-G](?:#|b)?(?:(?:maj|min|m|major|minor|7|maj7|min7|m7|m?add(?:2|4|6|9|11|13)|m?(?:6|9|11|13)|sus|sus2|sus4|5|dim|dim7|m7b5|min7b5|aug|\+|o|-)?)(?:\/[A-G](?:#|b)?)?$/i.test(String(value || "").trim());
}

function chordProgressionHtml(line, chords) {
  const text = chordProgressionText(line, chords);
  const tokens = String(text || "").match(/\||[^\s|]+/g) || [];
  return tokens.map((token) => {
    const cleaned = token
      .replace(/^[([{]+/, "")
      .replace(/[\])},;:]+$/g, "");
    const tokenClass = token === "|"
      ? "bar"
      : /^x\d+$/i.test(cleaned)
        ? "repeat"
        : chordTokenLooksRenderable(cleaned)
          ? "chord"
          : "text";
    return `<span class="chord-sheet-progression-token ${tokenClass}">${escapeHtml(token)}</span>`;
  }).join("");
}

function rawChordLyricPair(line) {
  const raw = String(line?.raw || "").replace(/\r\n/g, "\n");
  const parts = raw.split("\n");
  if (parts.length < 2) return { chordText: "", lyricText: String(line?.lyric || "") };
  const chordText = parts[0].replace(/\s+$/g, "");
  const lyricText = parts.slice(1).join("\n").replace(/\s+$/g, "") || String(line?.lyric || "");
  return { chordText, lyricText };
}

function synthesizeChordLine(lyric, chords) {
  if (!Array.isArray(chords) || !chords.length) return "";
  let output = "";
  chords
    .map((chord) => ({
      label: String(chord.chord || "").trim(),
      column: Math.max(0, Math.round(Number(chord.charIndex || 0)))
    }))
    .filter((chord) => chord.label)
    .sort((a, b) => a.column - b.column)
    .forEach((chord) => {
      let column = chord.column;
      if (column < output.length) column = output.length + 1;
      output = output.padEnd(column, " ") + chord.label;
    });
  return output.replace(/\s+$/g, "");
}

function chordLyricPairText(line, chords, lyric) {
  const rawPair = chords.length ? rawChordLyricPair(line) : { chordText: "", lyricText: String(line?.lyric || "") };
  const chordText = chords.length ? (rawPair.chordText || synthesizeChordLine(lyric, chords)) : "";
  const lyricText = rawPair.lyricText || lyric || String(line.raw || "") || chords.map((chord) => chord.chord).join(" ");
  return { chordText, lyricText };
}

function chordSheetLineHtml(line, index, activeLineIndex, showSection = true) {
  const lyric = line.lyric || "";
  const chords = Array.isArray(line.chords) ? line.chords : [];
  const tab = chordTabText(line);
  if ((!lyric && chords.length) || tab) {
    return `
      <div class="chord-sheet-line chord-sheet-progression-line ${index === activeLineIndex ? "active" : ""}" data-sheet-line-index="${index}">
        ${showSection && line.section ? `<div class="chord-sheet-section">${escapeHtml(line.section)}</div>` : ""}
        <div class="chord-sheet-progression">${chordProgressionHtml(line, chords)}</div>
      </div>
    `;
  }
  const pair = chordLyricPairText(line, chords, lyric);
  const chordRow = pair.chordText ? `<div class="chord-sheet-chordline">${escapeHtml(pair.chordText)}</div>` : "";
  return `
    <div class="chord-sheet-line ${index === activeLineIndex ? "active" : ""}" data-sheet-line-index="${index}">
      ${showSection && line.section ? `<div class="chord-sheet-section">${escapeHtml(line.section)}</div>` : ""}
      <div class="chord-sheet-pair ${pair.chordText ? "has-chords" : "no-chords"}">
        ${chordRow}
        <div class="chord-sheet-lyric">${escapeHtml(pair.lyricText)}</div>
      </div>
    </div>
  `;
}

function chordSheetHtml(chords) {
  if (!hasChordSheet(chords)) return "";
  const activeLine = activeChordSheetLineIndex();
  const displayLines = chords.sheetLines
    .map((line, index) => ({ line, index }))
    .filter((entry) => !chordSheetLineHidden(entry.line));
  return `
    <div class="chord-sheet">
      ${displayLines.map((entry, displayIndex) => {
        const previous = displayLines[displayIndex - 1]?.line;
        const { line, index } = entry;
        const showSection = Boolean(line.section && line.section !== previous?.section);
        return chordSheetLineHtml(line, index, activeLine, showSection);
      }).join("")}
    </div>
  `;
}

function chordsPanelHtml() {
  const track = currentTrack();
  const chords = currentChords();
  if (!track) return '<div class="empty-state">Nothing playing</div>';
  const displayable = hasDisplayableChords(chords);
  const useChordSheet = hasChordSheet(chords);
  const active = activeChordIndex();
  const summary = Array.isArray(chords?.summaryChords) ? chords.summaryChords : [];
  return `
    <div class="chords-panel" data-chords-panel>
      <div class="chords-sticky">
        <div class="lyrics-now chords-now">
          <div class="queue-art" style="${artStyle(track)}"></div>
          <div>
            <div class="queue-title">${escapeHtml(track.title)}</div>
            <div class="queue-artist">${escapeHtml(displayable ? chordSourceLabel(chords) : track.artist)}</div>
          </div>
        </div>
        ${displayable && summary.length ? `
          <div class="chord-reference" aria-label="Song chords">
            ${summary.map((chord) => `
              <span class="chord-chip" data-chord="${escapeHtml(chord)}">${escapeHtml(chord)}</span>
            `).join("")}
          </div>
        ` : ""}
      </div>
      ${displayable ? `
        ${chords.alignment ? `
          <div class="chord-align-note">
            ${escapeHtml(chords.alignment.method === "synced-lyrics" && chords.alignment.matchedLines
              ? `${chords.alignment.matchedLines}/${chords.alignment.totalChordLines} chord lines aligned from synced lyrics.`
              : "Saved as a chord sheet. Add synced lyrics for automatic timing.")}
          </div>
        ` : ""}
        ${hasTimedChords(chords) && !useChordSheet ? `
          <div class="chord-changes">
            ${chords.changes.map((change, index) => `
              <div class="chord-change ${index === active ? "active" : ""}" data-chord-index="${index}" data-chord="${escapeHtml(change.chord)}">
                <span class="chord-time">${escapeHtml(chordChangeRange(change))}</span>
                <span class="chord-name">${escapeHtml(change.chord)}</span>
                <span class="chord-confidence">${chords.provider === "manual" ? "lyrics" : `${Math.round(Number(change.confidence || chords.confidence || 0) * 100)}%`}</span>
              </div>
            `).join("")}
          </div>
        ` : ""}
        ${useChordSheet ? chordSheetHtml(chords) : ""}
        ${chordImportFormHtml(chords)}
      ` : `
        <div class="empty-state">${escapeHtml(chordPanelStatusText(chords, track))}</div>
        ${chordImportFormHtml(chords, true)}
      `}
    </div>
  `;
}

function renderQueue() {
  renderQueueHeader();
  if (state.lyricsPanelOpen) {
    cancelLazyQueueRows();
    $("#queueList").innerHTML = lyricsPanelHtml();
    state.activeLyricIndex = -1;
    syncActiveLyricLine();
    return;
  }
  if (state.chordsPanelOpen) {
    cancelLazyQueueRows();
    $("#queueList").innerHTML = chordsPanelHtml();
    state.activeChordIndex = -1;
    state.activeChordSheetLineIndex = -1;
    syncActiveChordLine();
    return;
  }

  if (!state.queue.length) {
    cancelLazyQueueRows();
    $("#queueList").innerHTML = '<div class="empty-state">No queue</div>';
    return;
  }

  const initialCount = Math.min(
    state.queue.length,
    Math.max(QUEUE_INITIAL_RENDER_LIMIT, state.currentIndex + 1)
  );
  const rows = state.queue.slice(0, initialCount).map(queueRowHtml).join("");
  const lazyMarker = state.queue.length > initialCount
    ? `<div id="lazyQueueRows" class="empty-state lazy-queue-status">Loading ${state.queue.length - initialCount} more queued songs...</div>`
    : "";
  $("#queueList").innerHTML = rows + lazyMarker;
  if (state.queue.length > initialCount) scheduleLazyQueueRows(state.queue.slice(), initialCount);
  else cancelLazyQueueRows();
}

function syncQueueActive() {
  const items = $$("#queueList .queue-item");
  if (!items.length) return false;
  for (const item of items) {
    const index = Number(item.dataset.queueIndex);
    const active = index === state.currentIndex;
    item.classList.toggle("active", active);
    const status = item.querySelector(".queue-status");
    if (status) status.innerHTML = active ? icons.speaker : `<span>${index + 1}</span>`;
  }
  return true;
}

function renderPlaybackSurfaces(options = {}) {
  if (options.queueChanged || !syncQueueActive()) renderQueue();
  renderPlayer();
  syncPlayingRows();
}

function advancedStepperHtml({ label, value, minusAttr, plusAttr, resetAttr, status = "", statusAttr = "" }) {
  return `
    <section class="player-advanced-card stepper-card">
      <div class="advanced-card-head">
        <span>${escapeHtml(label)}</span>
      </div>
      <div class="advanced-stepper">
        <button type="button" ${minusAttr} aria-label="Decrease ${escapeHtml(label)}">${icons.minus}</button>
        <output>${escapeHtml(value)}</output>
        <button type="button" ${plusAttr} aria-label="Increase ${escapeHtml(label)}">${icons.plus}</button>
      </div>
      <button class="advanced-reset-button" type="button" ${resetAttr}>Reset</button>
      ${status ? `<small ${statusAttr}>${escapeHtml(status)}</small>` : ""}
    </section>
  `;
}

function abLoopStatusText() {
  const loop = state.abLoop;
  if (!state.abLoopPowerEnabled) return "Inactive";
  if (!currentTrack()) return "No track";
  if (loop.trackId && loop.trackId !== currentTrack().id) return "Inactive";
  const editing = abLoopEditingLoop(loop);
  if (loop.aMs && !loop.bMs) return `A ${msToPreciseTime(loop.aMs)}`;
  if (!loop.aMs && loop.bMs) return `B ${msToPreciseTime(loop.bMs)}`;
  if (loop.bMs - loop.aMs >= AB_LOOP_MIN_MS) {
    return `${editing ? "Editing - " : ""}${msToPreciseTime(loop.aMs)} - ${msToPreciseTime(loop.bMs)}`;
  }
  return "Set A and B";
}

function abLoopQueueStatusText() {
  if (!state.abLoopPowerEnabled || !state.abLoopQueueEnabled) return "";
  const queued = currentTrackQueuedAbLoops();
  if (!queued.length) return "Queue ready";
  const next = queued[0];
  const plays = normalizeLoopPlayCount(next.queuedPlays);
  const extra = queued.length > 1 ? ` +${queued.length - 1}` : "";
  return `Next: ${next.name || "Saved loop"}${plays > 1 ? ` x${plays}` : ""}${extra}`;
}

function abLoopCardStatus() {
  const track = currentTrack();
  const loop = state.abLoop;
  if (!state.abLoopPowerEnabled) {
    return {
      title: "A-B Loop off",
      subtitle: "Enable power to set a loop",
      note: "Inactive"
    };
  }
  if (!track) {
    return {
      title: "No track",
      subtitle: "Choose a track",
      note: "Inactive"
    };
  }
  if (loop.trackId && loop.trackId !== track.id) {
    return {
      title: "No active loop",
      subtitle: "Set A and B",
      note: state.abLoopQueueEnabled ? "Queue ready" : "Inactive"
    };
  }
  if (abLoopReady(loop)) {
    const editing = abLoopEditingLoop(loop);
    const queueNote = abLoopQueueStatusText();
    return {
      title: state.isPlaying && abLoopEnabled(loop) ? "Loop active" : "Loop ready",
      subtitle: editing
        ? `Editing ${loop.name || editing.name || "saved loop"}`
        : `${msToPreciseTime(loop.aMs)} - ${msToPreciseTime(loop.bMs)}`,
      note: queueNote || (state.isPlaying && abLoopEnabled(loop) ? "Playing" : "Inactive")
    };
  }
  if (loop.trackId === track.id && loop.aMs > 0 && !loop.bMs) {
    return {
      title: "Set B point",
      subtitle: `A ${msToPreciseTime(loop.aMs)}`,
      note: state.abLoopQueueEnabled ? "Queue ready" : "Inactive"
    };
  }
  if (loop.trackId === track.id && loop.bMs > 0 && !loop.aMs) {
    return {
      title: "Set A point",
      subtitle: `B ${msToPreciseTime(loop.bMs)}`,
      note: state.abLoopQueueEnabled ? "Queue ready" : "Inactive"
    };
  }
  return {
    title: "No active loop",
    subtitle: "Set A and B",
    note: state.abLoopQueueEnabled ? "Queue ready" : "Inactive"
  };
}

function abLoopPadAssignmentMenuHtml() {
  if (!state.abLoopPadAssignmentMenu.open) return "";
  const padIndex = state.abLoopPadAssignmentMenu.padIndex;
  const pad = currentTrackAbLoopPadLayout()[padIndex] || { plays: 1 };
  const assignedLoop = savedAbLoopById(pad.loopId);
  const loops = currentTrackSavedAbLoops();
  return `
    <div class="ab-loop-pad-menu" role="menu" aria-label="Assign loop pad" style="left:${state.abLoopPadAssignmentMenu.x}px; top:${state.abLoopPadAssignmentMenu.y}px;">
      <div class="ab-loop-pad-menu-title">Pad ${padIndex + 1}</div>
      ${assignedLoop ? `
        <button class="ab-loop-pad-edit-action" type="button" role="menuitem" data-ab-loop-edit="${escapeHtml(assignedLoop.id)}">
          ${icons.edit}<span>Edit assigned loop</span>
        </button>
      ` : ""}
      <div class="ab-loop-pad-plays">
        <span>Plays before next</span>
        <div>
          <button type="button" data-ab-loop-pad-plays-step="-1" data-ab-loop-pad-index="${padIndex}" aria-label="Fewer plays">-</button>
          <strong>${normalizeLoopPlayCount(pad.plays)}x</strong>
          <button type="button" data-ab-loop-pad-plays-step="1" data-ab-loop-pad-index="${padIndex}" aria-label="More plays">+</button>
        </div>
      </div>
      ${loops.length ? loops.map((loop) => `
        <button type="button" role="menuitem" data-ab-loop-pad-assign="${escapeHtml(loop.id)}" data-ab-loop-pad-index="${padIndex}">
          <strong>${escapeHtml(loop.name || "Saved loop")}</strong>
          <small>${escapeHtml(`${msToPreciseTime(loop.aMs)} - ${msToPreciseTime(loop.bMs)}`)}</small>
        </button>
      `).join("") : '<div class="ab-loop-empty">Save loops for this song first</div>'}
      <button type="button" role="menuitem" data-ab-loop-pad-clear data-ab-loop-pad-index="${padIndex}">Clear pad</button>
    </div>
  `;
}

function abLoopSavedLoopMenuHtml() {
  if (!state.abLoopSavedLoopMenu.open) return "";
  const loop = savedAbLoopById(state.abLoopSavedLoopMenu.loopId);
  if (!loop) return "";
  return `
    <div class="ab-loop-saved-menu" role="menu" aria-label="Saved loop actions" style="left:${state.abLoopSavedLoopMenu.x}px; top:${state.abLoopSavedLoopMenu.y}px;">
      <div class="ab-loop-pad-menu-title">${escapeHtml(loop.name || "Saved loop")}</div>
      <button class="ab-loop-menu-action" type="button" role="menuitem" data-ab-loop-edit="${escapeHtml(loop.id)}">
        ${icons.edit}<span>Edit loop</span>
      </button>
      <button class="ab-loop-menu-action danger" type="button" role="menuitem" data-ab-loop-delete="${escapeHtml(loop.id)}">
        ${icons.trash}<span>Delete loop</span>
      </button>
    </div>
  `;
}

function abLoopPadButtonsHtml() {
  const layout = currentTrackAbLoopPadLayout();
  return layout.map((pad, index) => {
    const loop = savedAbLoopForPad(index);
    const queuedCount = loop ? queuedAbLoopCount(loop.id) : 0;
    const active = loop && abLoopEnabled() && state.abLoop.id === loop.id;
    const plays = normalizeLoopPlayCount(pad.plays);
    const label = loop ? (loop.name || "Saved loop") : "Empty";
    const stateClass = !loop ? "empty" : active ? "playing active" : queuedCount ? "queued" : "assigned";
    const status = active
      ? icons.play
      : queuedCount
        ? `<span>${queuedCount}</span>`
        : loop
          ? '<span></span>'
          : "";
    return `
      <button class="ab-loop-pad loop-pad ${stateClass}" type="button" data-ab-loop-pad="${index}" title="Right-click to assign a saved loop" aria-label="Loop pad ${index + 1}: ${escapeHtml(label)}">
        <span class="loop-pad-number">${index + 1}</span>
        <span class="loop-pad-status" aria-hidden="true">${status}</span>
        <span class="loop-pad-core" aria-hidden="true"></span>
        <strong class="loop-pad-name">${escapeHtml(label)}</strong>
        <small class="loop-pad-meta">${loop ? escapeHtml(`${plays}x - ${msToPreciseTime(loop.aMs)} - ${msToPreciseTime(loop.bMs)}`) : `${plays}x - Right-click to assign`}</small>
      </button>
    `;
  }).join("");
}

function abLoopPadGridSignature() {
  const track = currentTrack();
  if (!track) return "no-track";
  const layout = currentTrackAbLoopPadLayout().map((pad) => {
    const normalized = normalizeAbLoopPad(pad);
    return `${normalized.loopId}:${normalizeLoopPlayCount(normalized.plays)}`;
  }).join("|");
  const queued = currentTrackQueuedAbLoopEntries()
    .map((entry) => `${entry.loopId}:${normalizeLoopPlayCount(entry.plays)}`)
    .join("|");
  const active = state.abLoopPowerEnabled && abLoopEnabled() ? state.abLoop.id || `${state.abLoop.aMs}:${state.abLoop.bMs}` : "";
  return [track.id, layout, queued, active, state.abLoopPowerEnabled ? "on" : "off"].join("::");
}

function syncAbLoopAdvancedPads(force = false) {
  if (state.view !== AB_LOOP_ADVANCED_VIEW) return;
  const grid = $("#viewLooperAdvanced .ab-loop-pad-grid");
  if (!grid) return;
  const signature = abLoopPadGridSignature();
  if (!force && grid.dataset.abLoopPadSignature === signature) return;
  grid.innerHTML = abLoopPadButtonsHtml();
  grid.dataset.abLoopPadSignature = signature;
}

function abLoopLauncherPanelHtml() {
  const track = currentTrack();
  return `
    <section class="player-advanced-card ab-loop-launcher-panel loop-launcher-popout">
      <button class="loop-launcher-grab-handle" type="button" title="Collapse pads" aria-label="Collapse loop pads" data-ab-loop-launcher-collapse></button>
      <div class="ab-loop-launcher-head loop-launcher-header">
        <strong>${icons.repeat}<span>Loop Launcher</span></strong>
        <small>${track ? "Right-click a pad to assign a saved loop" : "Choose a track"}<span class="loop-launcher-help" aria-hidden="true">?</span></small>
      </div>
      <div class="ab-loop-pad-grid loop-launcher-grid">
        ${abLoopPadButtonsHtml()}
      </div>
      <footer class="loop-launcher-footer">
        <div class="loop-launcher-legend" aria-hidden="true">
          <span><i class="legend-dot playing"></i>Playing</span>
          <span><i class="legend-dot queued"></i>Queued</span>
          <span><i class="legend-dot empty"></i>Empty / Idle</span>
        </div>
        <div class="loop-launcher-footer-actions" aria-hidden="true">
          <span>${icons.edit}<span>Edit</span></span>
          <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg><span>Lock Pads</span></span>
        </div>
      </footer>
    </section>
  `;
}

function abLoopAdvancedDurationForTrack(track = currentTrack()) {
  if (!track) return 0;
  if (state.abLoopWaveform.trackId === track.id && state.abLoopWaveform.durationMs > 0) {
    return state.abLoopWaveform.durationMs;
  }
  if (currentTrack()?.id === track.id && Number.isFinite(audio.duration) && audio.duration > 0) {
    return preciseMs(audio.duration * 1000);
  }
  return durationForTrack(track);
}

function abLoopAdvancedPlaybackWindowForTrack(track = currentTrack()) {
  const baseWindow = playbackWindowForTrack(track);
  const duration = abLoopAdvancedDurationForTrack(track);
  if (!track || !duration) return baseWindow;
  let startMs = baseWindow.startMs || 0;
  let endMs = baseWindow.endMs || 0;
  if (startMs >= duration) startMs = Math.max(0, duration - 1000);
  if (!endMs || endMs > duration) endMs = duration;
  if (endMs > 0 && endMs <= startMs) endMs = duration > startMs ? duration : 0;
  const durationMs = endMs > 0 ? Math.max(0, endMs - startMs) : Math.max(0, duration - startMs);
  return {
    ...baseWindow,
    startMs: preciseMs(startMs),
    endMs: preciseMs(endMs),
    durationMs: preciseMs(durationMs)
  };
}

function clampToAbLoopAdvancedWindowEnd(track, timeMs) {
  const window = abLoopAdvancedPlaybackWindowForTrack(track);
  let target = Number(timeMs);
  if (!Number.isFinite(target) || target <= 0) target = window.startMs;
  if (target < window.startMs) target = window.startMs;
  if (window.endMs > 0 && target > window.endMs) target = window.endMs;
  return preciseMs(target);
}

function abLoopAdvancedLaneRect(element) {
  const layer = $("#looperAdvancedMarkerLayer");
  if (layer) return layer.getBoundingClientRect();
  const rect = element?.getBoundingClientRect?.();
  if (!rect) return { left: 0, width: 1 };
  return {
    left: rect.left + 18,
    width: Math.max(1, rect.width - 36)
  };
}

function abLoopAdvancedPercentFromClientX(clientX, element) {
  const rect = abLoopAdvancedLaneRect(element);
  return rect.width > 0 ? Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)) : 0;
}

function abLoopAdvancedWindowForTrack(track = currentTrack()) {
  const playbackWindow = abLoopAdvancedPlaybackWindowForTrack(track);
  if (!track) return { ...playbackWindow, startMs: 0, endMs: 0, durationMs: 0 };
  const advanced = state.abLoopAdvanced || {};
  if (advanced.trackId === track.id && advanced.zoomEndMs > advanced.zoomStartMs) {
    const startMs = clampToAbLoopAdvancedWindowEnd(track, advanced.zoomStartMs);
    const endMs = clampToAbLoopAdvancedWindowEnd(track, advanced.zoomEndMs);
    if (endMs > startMs) {
      return {
        ...playbackWindow,
        startMs,
        endMs,
        durationMs: preciseMs(endMs - startMs),
        zoomed: startMs > playbackWindow.startMs || (playbackWindow.endMs > 0 && endMs < playbackWindow.endMs)
      };
    }
  }
  return {
    ...playbackWindow,
    endMs: playbackWindow.endMs || durationForTrack(track),
    zoomed: false
  };
}

function resetAbLoopAdvancedZoom(track = currentTrack()) {
  if (!track) return;
  const window = abLoopAdvancedPlaybackWindowForTrack(track);
  state.abLoopAdvanced.zoomStartMs = window.startMs || 0;
  state.abLoopAdvanced.zoomEndMs = window.endMs || abLoopAdvancedDurationForTrack(track) || window.durationMs || 0;
}

function ensureAbLoopAdvancedTrackState(track = currentTrack()) {
  if (!track) return;
  if (state.abLoopAdvanced.trackId !== track.id) {
    state.abLoopAdvanced.trackId = track.id;
    state.abLoopAdvanced.markerMs = clampToAbLoopAdvancedWindowEnd(track, playbackPositionMs());
    closeAbLoopAdvancedMarkerMenu();
    resetAbLoopAdvancedZoom(track);
  }
  if (!state.abLoopAdvanced.markerMs) state.abLoopAdvanced.markerMs = clampToAbLoopAdvancedWindowEnd(track, playbackPositionMs());
}

function abLoopAdvancedPercent(timeMs, track = currentTrack()) {
  const window = abLoopAdvancedWindowForTrack(track);
  const duration = window.durationMs || durationForTrack(track);
  if (!track || !duration) return 0;
  return Math.max(0, Math.min(100, ((timeMs - window.startMs) / duration) * 100));
}

function abLoopAdvancedTimeFromClientX(clientX, element) {
  const track = currentTrack();
  if (!track || !element) return 0;
  const percent = abLoopAdvancedPercentFromClientX(clientX, element);
  const window = abLoopAdvancedWindowForTrack(track);
  return seekTimelineWindowOffset(track, percent * (window.durationMs || abLoopAdvancedDurationForTrack(track)), { window, allowEnd: true });
}

function setAbLoopAdvancedMarker(timeMs) {
  const track = currentTrack();
  if (!track) return;
  ensureAbLoopAdvancedTrackState(track);
  state.abLoopAdvanced.markerMs = clampToAbLoopAdvancedWindowEnd(track, timeMs);
  closeAbLoopAdvancedMarkerMenu();
  syncAbLoopAdvancedView();
}

function zoomAbLoopAdvancedWaveform(event, element) {
  const track = currentTrack();
  if (!track || !element) return;
  ensureAbLoopAdvancedTrackState(track);
  const playbackWindow = abLoopAdvancedPlaybackWindowForTrack(track);
  const fullStart = playbackWindow.startMs || 0;
  const fullEnd = playbackWindow.endMs || abLoopAdvancedDurationForTrack(track) || playbackWindow.durationMs || 0;
  if (!(fullEnd > fullStart)) return;
  const current = abLoopAdvancedWindowForTrack(track);
  const currentStart = current.startMs || fullStart;
  const currentEnd = current.endMs || fullEnd;
  const currentDuration = Math.max(AB_LOOP_WAVEFORM_MIN_WINDOW_MS, currentEnd - currentStart);
  const ratio = abLoopAdvancedPercentFromClientX(event.clientX, element);
  const anchorMs = currentStart + currentDuration * ratio;
  let nextDuration = event.deltaY < 0
    ? currentDuration / AB_LOOP_WAVEFORM_ZOOM_FACTOR
    : currentDuration * AB_LOOP_WAVEFORM_ZOOM_FACTOR;
  nextDuration = Math.max(AB_LOOP_WAVEFORM_MIN_WINDOW_MS, Math.min(fullEnd - fullStart, nextDuration));
  let startMs = anchorMs - nextDuration * ratio;
  let endMs = startMs + nextDuration;
  if (startMs < fullStart) {
    startMs = fullStart;
    endMs = startMs + nextDuration;
  }
  if (endMs > fullEnd) {
    endMs = fullEnd;
    startMs = endMs - nextDuration;
  }
  state.abLoopAdvanced.zoomStartMs = preciseMs(Math.max(fullStart, startMs));
  state.abLoopAdvanced.zoomEndMs = preciseMs(Math.min(fullEnd, endMs));
  closeAbLoopAdvancedMarkerMenu();
  syncAbLoopAdvancedView();
}

function openAbLoopAdvancedMarkerMenu(event) {
  const track = currentTrack();
  if (!track) return;
  event.preventDefault();
  event.stopPropagation();
  ensureAbLoopAdvancedTrackState(track);
  state.abLoopAdvanced.markerMenu = {
    open: true,
    x: Math.max(8, Math.min(window.innerWidth - 184, event.clientX || 8)),
    y: Math.max(8, Math.min(window.innerHeight - 148, event.clientY || 8))
  };
  renderGlobalOverlays();
}

function abLoopAdvancedMarkerMenuHtml() {
  const track = currentTrack();
  if (state.view !== AB_LOOP_ADVANCED_VIEW || !track || !state.abLoopAdvanced.markerMenu.open) return "";
  return `
    <div class="ab-loop-saved-menu looper-advanced-marker-menu" role="menu" aria-label="Advanced marker actions" style="left:${state.abLoopAdvanced.markerMenu.x}px; top:${state.abLoopAdvanced.markerMenu.y}px;">
      <div class="ab-loop-pad-menu-title">Marker ${escapeHtml(msToPreciseTime(state.abLoopAdvanced.markerMs || 0))}</div>
      <button class="ab-loop-menu-action" type="button" role="menuitem" data-ab-loop-advanced-set="a">
        <span>A</span><span>Set A</span>
      </button>
      <button class="ab-loop-menu-action" type="button" role="menuitem" data-ab-loop-advanced-set="b">
        <span>B</span><span>Set B</span>
      </button>
      <button class="ab-loop-menu-action" type="button" role="menuitem" data-ab-loop-advanced-seek>
        ${icons.play}<span>Seek here</span>
      </button>
    </div>
  `;
}

function setAbLoopAdvancedMarkerAs(point) {
  const track = currentTrack();
  if (!track || !state.abLoopPowerEnabled) return;
  updateAbLoopPoint(point, state.abLoopAdvanced.markerMs, { allowZero: false, window: abLoopAdvancedPlaybackWindowForTrack(track) });
  closeAbLoopAdvancedMarkerMenu();
  renderGlobalOverlays();
}

function seekToAbLoopAdvancedMarker() {
  const track = currentTrack();
  if (!track) return;
  seekPlaybackToMs(state.abLoopAdvanced.markerMs, { render: false });
  closeAbLoopAdvancedMarkerMenu();
  renderProgress();
  renderGlobalOverlays();
}

function abLoopAdvancedWaveformCacheKey(track, url) {
  return [
    track?.id || "",
    track?.streamKey || "",
    track?.updatedAt || "",
    url || ""
  ].join(":");
}

function trimAbLoopWaveformCache() {
  while (abLoopWaveformCache.size > AB_LOOP_WAVEFORM_CACHE_LIMIT) {
    const firstKey = abLoopWaveformCache.keys().next().value;
    if (!firstKey) break;
    abLoopWaveformCache.delete(firstKey);
  }
}

function emptyWaveformPeak() {
  return { min: 0, max: 0, rms: 0 };
}

function clampWaveformUnit(value, fallback = 0) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(-1, Math.min(1, number));
}

function waveformPeaksFromAudioBuffer(buffer) {
  const durationSeconds = Number.isFinite(buffer.duration) ? buffer.duration : 0;
  const peakCount = Math.max(
    AB_LOOP_WAVEFORM_PEAK_COUNT,
    Math.min(AB_LOOP_WAVEFORM_MAX_PEAK_COUNT, Math.ceil(durationSeconds * AB_LOOP_WAVEFORM_PEAKS_PER_SECOND))
  );
  const channels = Array.from({ length: buffer.numberOfChannels || 1 }, (_, index) => buffer.getChannelData(index));
  const peaks = Array.from({ length: peakCount }, emptyWaveformPeak);
  const length = buffer.length || 0;
  if (!length) return peaks;
  for (let peakIndex = 0; peakIndex < peakCount; peakIndex += 1) {
    const start = Math.floor((peakIndex / peakCount) * length);
    const end = Math.max(start + 1, Math.floor(((peakIndex + 1) / peakCount) * length));
    const step = Math.max(1, Math.floor((end - start) / 160));
    let min = 0;
    let max = 0;
    let sumSquares = 0;
    let sampleCount = 0;
    for (let sampleIndex = start; sampleIndex < end; sampleIndex += step) {
      for (const channel of channels) {
        const value = channel[sampleIndex] || 0;
        if (value < min) min = value;
        if (value > max) max = value;
        sumSquares += value * value;
        sampleCount += 1;
      }
    }
    peaks[peakIndex] = {
      min: clampWaveformUnit(min),
      max: clampWaveformUnit(max),
      rms: sampleCount ? Math.max(0, Math.min(1, Math.sqrt(sumSquares / sampleCount))) : 0
    };
  }
  return peaks;
}

function normalizeWaveformPeak(peak) {
  if (typeof peak === "number") {
    const amp = Math.max(0, Math.min(1, peak));
    return { min: -amp, max: amp, rms: amp * 0.68 };
  }
  if (!peak || typeof peak !== "object") return emptyWaveformPeak();
  const min = clampWaveformUnit(peak.min);
  const max = clampWaveformUnit(peak.max);
  const peakAmp = Math.max(Math.abs(min), Math.abs(max));
  const rms = Math.max(0, Math.min(1, Number.isFinite(Number(peak.rms)) ? Number(peak.rms) : peakAmp * 0.62));
  return { min: Math.min(min, max), max: Math.max(min, max), rms };
}

function aggregateWaveformPeaks(peaks, start, end) {
  if (!Array.isArray(peaks) || !peaks.length) return emptyWaveformPeak();
  const low = Math.min(start, end);
  const high = Math.max(start, end);
  const first = Math.max(0, Math.min(peaks.length - 1, Math.floor(low)));
  const last = Math.max(first, Math.min(peaks.length - 1, Math.ceil(high)));
  let min = 0;
  let max = 0;
  let rmsTotal = 0;
  let rmsPeak = 0;
  let count = 0;
  for (let index = first; index <= last; index += 1) {
    const peak = normalizeWaveformPeak(peaks[index]);
    if (peak.min < min) min = peak.min;
    if (peak.max > max) max = peak.max;
    rmsTotal += peak.rms;
    if (peak.rms > rmsPeak) rmsPeak = peak.rms;
    count += 1;
  }
  return {
    min,
    max,
    rms: count ? Math.min(1, ((rmsTotal / count) * 0.68) + (rmsPeak * 0.32)) : 0
  };
}

function shapedWaveformAmplitude(value, gain) {
  const signed = clampWaveformUnit(value * gain);
  const sign = signed < 0 ? -1 : 1;
  return sign * Math.pow(Math.abs(signed), 0.74);
}

function appendSmoothedWaveformPath(context, points, moveToStart = false) {
  if (!points.length) return;
  if (moveToStart) {
    context.moveTo(points[0].x, points[0].y);
  } else {
    context.lineTo(points[0].x, points[0].y);
  }
  if (points.length === 1) return;
  for (let index = 1; index < points.length - 1; index += 1) {
    const point = points[index];
    const next = points[index + 1];
    context.quadraticCurveTo(point.x, point.y, (point.x + next.x) / 2, (point.y + next.y) / 2);
  }
  const last = points[points.length - 1];
  context.lineTo(last.x, last.y);
}

async function loadAbLoopAdvancedWaveform(track = currentTrack()) {
  if (!track || state.view !== AB_LOOP_ADVANCED_VIEW) return;
  if (!canStreamTrack(track)) {
    state.abLoopWaveform = {
      ...state.abLoopWaveform,
      trackId: track.id,
      status: "error",
      peaks: null,
      durationMs: durationForTrack(track),
      error: "Waveform unavailable"
    };
    syncAbLoopAdvancedView();
    return;
  }
  const url = audioStreamUrlForTrack(track, { cache: true });
  const key = abLoopAdvancedWaveformCacheKey(track, url);
  const cached = abLoopWaveformCache.get(key);
  if (cached) {
    state.abLoopWaveform = { ...cached, trackId: track.id, url, status: "ready", error: "" };
    syncAbLoopAdvancedView();
    return;
  }
  if (state.abLoopWaveform.trackId === track.id && state.abLoopWaveform.url === url && state.abLoopWaveform.status === "loading") return;
  const token = (state.abLoopWaveform.token || 0) + 1;
  state.abLoopWaveform = {
    trackId: track.id,
    url,
    status: "loading",
    peaks: null,
    durationMs: durationForTrack(track),
    error: "",
    token
  };
  syncAbLoopAdvancedView();
  try {
    const context = ensureEqAudioContext();
    if (!context) throw new Error("Waveform needs Web Audio support.");
    const response = await fetch(url, { cache: "force-cache" });
    if (state.abLoopWaveform.token !== token) return;
    if (!response.ok) throw new Error(`Waveform stream failed (${response.status}).`);
    const contentType = response.headers.get("content-type") || "";
    if (/mpegurl|application\/vnd\.apple/i.test(contentType)) throw new Error("Waveform unavailable for this stream.");
    const bytes = await response.arrayBuffer();
    if (state.abLoopWaveform.token !== token) return;
    const decoded = await context.decodeAudioData(bytes.slice(0));
    if (state.abLoopWaveform.token !== token) return;
    const payload = {
      trackId: track.id,
      url,
      status: "ready",
      peaks: waveformPeaksFromAudioBuffer(decoded),
      durationMs: Math.round(decoded.duration * 1000),
      error: "",
      token
    };
    abLoopWaveformCache.set(key, payload);
    trimAbLoopWaveformCache();
    state.abLoopWaveform = payload;
  } catch (error) {
    if (state.abLoopWaveform.token !== token) return;
    state.abLoopWaveform = {
      trackId: track.id,
      url,
      status: "error",
      peaks: null,
      durationMs: durationForTrack(track),
      error: error?.message || "Waveform unavailable",
      token
    };
  }
  syncAbLoopAdvancedView();
}

function abLoopAdvancedMarkersHtml() {
  const track = currentTrack();
  if (!track) return "";
  const loop = state.abLoop;
  const markers = [];
  if (loop.trackId === track.id && (loop.aMs > 0 || loop.bMs - loop.aMs >= AB_LOOP_MIN_MS)) {
    const percent = abLoopAdvancedPercent(loop.aMs, track);
    markers.push(`<button class="ab-loop-marker looper-advanced-boundary marker-a" type="button" data-ab-loop-marker="a" style="--marker-left:${percent}%" aria-label="A loop marker"><span>A</span></button>`);
  }
  if (loop.trackId === track.id && loop.bMs > 0) {
    const percent = abLoopAdvancedPercent(loop.bMs, track);
    markers.push(`<button class="ab-loop-marker looper-advanced-boundary marker-b" type="button" data-ab-loop-marker="b" style="--marker-left:${percent}%" aria-label="B loop marker"><span>B</span></button>`);
  }
  if (state.abLoopAdvanced.markerMs > 0) {
    const percent = abLoopAdvancedPercent(state.abLoopAdvanced.markerMs, track);
    markers.push(`<button class="looper-advanced-placement-marker ${abLoopAdvancedEdgeClass(percent)}" type="button" data-ab-loop-advanced-marker style="--marker-left:${percent}%" aria-label="Placed loop marker"><span>${escapeHtml(msToPreciseTime(state.abLoopAdvanced.markerMs))}</span></button>`);
  }
  return markers.join("");
}

function abLoopAdvancedStatusText() {
  const track = currentTrack();
  if (!track) return "Choose a track";
  if (state.abLoopWaveform.status === "loading") return "Loading real waveform";
  if (state.abLoopWaveform.status === "error") return state.abLoopWaveform.error || "Waveform unavailable";
  const window = abLoopAdvancedWindowForTrack(track);
  if (window.zoomed) return `${msToPreciseTime(window.startMs)} - ${msToPreciseTime(window.endMs)}`;
  return abLoopStatusText();
}

function abLoopAdvancedEdgeClass(percent) {
  if (percent <= 6) return "edge-start";
  if (percent >= 94) return "edge-end";
  return "";
}

function drawAbLoopAdvancedWaveform() {
  const canvas = $("#looperAdvancedWaveformCanvas");
  if (!(canvas instanceof HTMLCanvasElement)) return;
  const track = currentTrack();
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width));
  const height = Math.max(1, Math.round(rect.height));
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  const context = canvas.getContext("2d");
  if (!context) return;
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.clearRect(0, 0, width, height);
  const gradient = context.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, "rgba(255,255,255,0.075)");
  gradient.addColorStop(0.52, "rgba(255,255,255,0.018)");
  gradient.addColorStop(1, "rgba(0,0,0,0.16)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);
  context.strokeStyle = "rgba(255,255,255,0.07)";
  context.lineWidth = 1;
  for (let i = 0; i <= 8; i += 1) {
    const x = Math.round((i / 8) * width) + 0.5;
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, height);
    context.stroke();
  }
  const centerY = height / 2;
  const usableHeight = Math.max(18, height - 62);
  const halfHeight = usableHeight / 2;
  const peaks = state.abLoopWaveform.trackId === track?.id && state.abLoopWaveform.status === "ready"
    ? state.abLoopWaveform.peaks
    : null;
  const duration = state.abLoopWaveform.durationMs || abLoopAdvancedDurationForTrack(track) || 1;
  const visibleWindow = abLoopAdvancedWindowForTrack(track);
  const windowDuration = visibleWindow.durationMs || abLoopAdvancedDurationForTrack(track) || 1;
  const loop = state.abLoop;
  if (track && loop.trackId === track.id && loop.bMs - loop.aMs >= AB_LOOP_MIN_MS) {
    const left = (abLoopAdvancedPercent(loop.aMs, track) / 100) * width;
    const right = (abLoopAdvancedPercent(loop.bMs, track) / 100) * width;
    context.fillStyle = "rgba(240, 201, 74, 0.08)";
    context.fillRect(Math.min(left, right), 0, Math.abs(right - left), height);
  }
  if (Array.isArray(peaks) && peaks.length) {
    const columns = [];
    let visibleMax = 0;
    for (let x = 0; x < width; x += 1) {
      const startTimeMs = visibleWindow.startMs + (x / width) * windowDuration;
      const endTimeMs = visibleWindow.startMs + ((x + 1) / width) * windowDuration;
      const column = aggregateWaveformPeaks(
        peaks,
        (Math.max(0, startTimeMs) / duration) * peaks.length,
        (Math.min(duration, endTimeMs) / duration) * peaks.length
      );
      visibleMax = Math.max(visibleMax, Math.abs(column.min), Math.abs(column.max), column.rms * 1.25);
      columns.push(column);
    }
    const gain = visibleMax > 0.0001 ? Math.min(4.2, Math.max(0.62, 0.82 / visibleMax)) : 1;
    const minVisibleAmp = 0.65 / Math.max(1, halfHeight);
    const topPoints = [];
    const bottomPoints = [];
    const rmsTopPoints = [];
    const rmsBottomPoints = [];
    for (let x = 0; x < columns.length; x += 1) {
      const column = columns[x];
      const positiveAmp = Math.max(0, shapedWaveformAmplitude(Math.max(0, column.max), gain));
      const negativeAmp = Math.max(0, Math.abs(shapedWaveformAmplitude(Math.min(0, column.min), gain)));
      const topAmp = positiveAmp > 0.001 ? Math.max(minVisibleAmp, positiveAmp) : 0;
      const bottomAmp = negativeAmp > 0.001 ? Math.max(minVisibleAmp, negativeAmp) : 0;
      const rmsAmp = Math.pow(Math.min(1, column.rms * gain), 0.68) * 0.62;
      const pointX = x + 0.5;
      topPoints.push({ x: pointX, y: centerY - (topAmp * halfHeight) });
      bottomPoints.push({ x: pointX, y: centerY + (bottomAmp * halfHeight) });
      rmsTopPoints.push({ x: pointX, y: centerY - (rmsAmp * halfHeight) });
      rmsBottomPoints.push({ x: pointX, y: centerY + (rmsAmp * halfHeight) });
    }
    const waveGradient = context.createLinearGradient(0, centerY - halfHeight, 0, centerY + halfHeight);
    waveGradient.addColorStop(0, "rgba(252, 251, 255, 0.78)");
    waveGradient.addColorStop(0.48, "rgba(185, 182, 204, 0.62)");
    waveGradient.addColorStop(1, "rgba(252, 251, 255, 0.72)");
    context.fillStyle = waveGradient;
    context.beginPath();
    appendSmoothedWaveformPath(context, topPoints, true);
    appendSmoothedWaveformPath(context, bottomPoints.slice().reverse());
    context.closePath();
    context.fill();

    const rmsGradient = context.createLinearGradient(0, centerY - halfHeight, 0, centerY + halfHeight);
    rmsGradient.addColorStop(0, "rgba(255,255,255,0.18)");
    rmsGradient.addColorStop(0.5, "rgba(255,255,255,0.06)");
    rmsGradient.addColorStop(1, "rgba(255,255,255,0.16)");
    context.fillStyle = rmsGradient;
    context.beginPath();
    appendSmoothedWaveformPath(context, rmsTopPoints, true);
    appendSmoothedWaveformPath(context, rmsBottomPoints.slice().reverse());
    context.closePath();
    context.fill();

    context.strokeStyle = "rgba(255,255,255,0.28)";
    context.lineWidth = 1;
    context.beginPath();
    appendSmoothedWaveformPath(context, topPoints, true);
    context.stroke();
    context.beginPath();
    appendSmoothedWaveformPath(context, bottomPoints, true);
    context.stroke();
  }
  context.strokeStyle = "rgba(255,255,255,0.16)";
  context.beginPath();
  context.moveTo(0, centerY + 0.5);
  context.lineTo(width, centerY + 0.5);
  context.stroke();
}

function syncAbLoopAdvancedPlayhead(playhead, track) {
  const playedRegion = $("#looperAdvancedPlayedRegion");
  const waveform = $("[data-ab-loop-advanced-waveform]");
  if (!playhead || !track) {
    if (playhead) playhead.hidden = true;
    if (playedRegion) playedRegion.style.setProperty("--played-width", "0px");
    return;
  }
  const positionMs = clampToAbLoopAdvancedWindowEnd(track, playbackPositionMs());
  const percent = abLoopAdvancedPercent(positionMs, track);
  const rect = waveform?.getBoundingClientRect?.();
  const laneWidth = Math.max(1, (rect?.width || 0) - 36);
  const x = 18 + (laneWidth * percent) / 100;
  playhead.hidden = false;
  playhead.style.setProperty("--playhead-x", `${x}px`);
  playhead.classList.toggle("edge-start", percent <= 6);
  playhead.classList.toggle("edge-end", percent >= 94);
  const label = playhead.querySelector("[data-ab-loop-advanced-playhead-time]");
  if (label) label.textContent = msToPreciseTime(positionMs);
  if (playedRegion) playedRegion.style.setProperty("--played-width", `${Math.max(0, x - 18)}px`);
}

function syncAbLoopAdvancedView() {
  if (state.view !== AB_LOOP_ADVANCED_VIEW) return;
  const track = currentTrack();
  if (track) ensureAbLoopAdvancedTrackState(track);
  const markerLayer = $("#looperAdvancedMarkerLayer");
  if (markerLayer) markerLayer.innerHTML = abLoopAdvancedMarkersHtml();
  const status = $("[data-ab-loop-advanced-status]");
  if (status) status.textContent = abLoopAdvancedStatusText();
  const loopTitle = $("[data-ab-loop-advanced-loop-title]");
  if (loopTitle) loopTitle.textContent = abLoopCardStatus().title;
  const loopSubtitle = $("[data-ab-loop-advanced-loop-subtitle]");
  if (loopSubtitle) loopSubtitle.textContent = abLoopCardStatus().subtitle;
  const playhead = $("#looperAdvancedPlayhead");
  syncAbLoopAdvancedPlayhead(playhead, track);
  const zoomButton = $("[data-ab-loop-advanced-reset-zoom]");
  if (zoomButton) zoomButton.disabled = !track || !abLoopAdvancedWindowForTrack(track).zoomed;
  const saveButton = $("[data-ab-loop-advanced-save]");
  if (saveButton) saveButton.hidden = !abLoopNeedsSave();
  syncAbLoopAdvancedPads();
  window.requestAnimationFrame(drawAbLoopAdvancedWaveform);
}

function renderAbLoopAdvancedView() {
  const root = $("#viewLooperAdvanced");
  if (!root) return;
  const track = currentTrack();
  if (track) ensureAbLoopAdvancedTrackState(track);
  const waveformStatus = abLoopAdvancedStatusText();
  root.innerHTML = `
    <section class="looper-advanced-view">
      <header class="looper-advanced-header">
        <button class="tool-button looper-advanced-back" type="button" data-ab-loop-advanced-close>${icons.arrowLeft}<span>Back</span></button>
        <div class="looper-advanced-track">
          <div class="looper-advanced-art" style="${track ? artStyle(track) : ""}" aria-hidden="true"></div>
          <div>
            <div class="section-title">Advanced Looper</div>
            <h2>${escapeHtml(track ? trackTitleWithTrimMarker(track, trackTrimForContext(track)) : "No track selected")}</h2>
            <p>${escapeHtml(track ? track.artist || "Unknown Artist" : "Choose a song to edit loops")}</p>
          </div>
        </div>
        <div class="looper-advanced-loop-summary">
          <strong data-ab-loop-advanced-loop-title>${escapeHtml(abLoopCardStatus().title)}</strong>
          <small data-ab-loop-advanced-loop-subtitle>${escapeHtml(abLoopCardStatus().subtitle)}</small>
        </div>
      </header>

      <section class="looper-advanced-editor">
        <div class="looper-advanced-toolbar">
          <div class="ab-loop-actions looper-advanced-actions">
            ${abLoopTimeControlHtml("a", "Set A")}
            ${abLoopTimeControlHtml("b", "Set B")}
            <button class="tool-button ab-loop-save-button" type="button" data-ab-loop-save data-ab-loop-advanced-save ${abLoopNeedsSave() ? "" : "hidden"}>${icons.save}<span>${abLoopEditingLoop() ? "Update" : "Save"}</span></button>
          </div>
          <button class="tool-button" type="button" data-ab-loop-advanced-reset-zoom ${track && abLoopAdvancedWindowForTrack(track).zoomed ? "" : "disabled"}>${icons.x}<span>Reset Zoom</span></button>
        </div>

        <div class="looper-advanced-waveform" data-ab-loop-advanced-waveform title="${escapeHtml(waveformStatus)}">
          <canvas id="looperAdvancedWaveformCanvas" aria-hidden="true"></canvas>
          <div class="looper-advanced-played-region" id="looperAdvancedPlayedRegion"></div>
          <div class="looper-advanced-playhead" id="looperAdvancedPlayhead"><span data-ab-loop-advanced-playhead-time>${track ? escapeHtml(msToPreciseTime(playbackPositionMs())) : ""}</span></div>
          <div class="looper-advanced-marker-layer" id="looperAdvancedMarkerLayer">
            ${abLoopAdvancedMarkersHtml()}
          </div>
          <div class="looper-advanced-waveform-status" data-ab-loop-advanced-status>${escapeHtml(waveformStatus)}</div>
        </div>
      </section>

      <section class="looper-advanced-pads">
        <div class="ab-loop-launcher-head loop-launcher-header">
          <strong>${icons.grid}<span>Pads</span></strong>
          <small>${track ? "Current song" : "Choose a track"}</small>
        </div>
        <div class="ab-loop-pad-grid loop-launcher-grid">
          ${abLoopPadButtonsHtml()}
        </div>
      </section>
    </section>
  `;
  loadAbLoopAdvancedWaveform(track);
  syncAbLoopAdvancedView();
}

function abLoopPointInputValue(point) {
  const track = currentTrack();
  const loop = state.abLoop;
  if (!track || loop.trackId !== track.id) return "";
  if (point === "a") return msToPreciseTime(loop.aMs);
  return loop.bMs > 0 ? msToPreciseTime(loop.bMs) : "";
}

function abLoopTimeControlHtml(point, label) {
  const setAttr = point === "a" ? "data-ab-loop-set-a" : "data-ab-loop-set-b";
  const pointLabel = point.toUpperCase();
  const disabledAttr = abLoopControlsEnabled() ? "" : "disabled";
  return `
    <div class="ab-loop-time-control">
      <button class="tool-button" type="button" ${setAttr} ${disabledAttr}>${label}</button>
      <input
        class="ab-loop-time-input"
        type="text"
        inputmode="decimal"
        autocomplete="off"
        spellcheck="false"
        value="${escapeHtml(abLoopPointInputValue(point))}"
        placeholder="0:00.000"
        aria-label="${pointLabel} loop time"
        title="${pointLabel} loop time"
        data-ab-loop-time="${point}"
        ${disabledAttr}
      >
    </div>
  `;
}

function resetAbLoopTimeInput(input) {
  const point = input?.dataset?.abLoopTime || "";
  if (!point) return;
  input.value = abLoopPointInputValue(point);
  input.removeAttribute("aria-invalid");
}

function commitAbLoopTimeInput(input) {
  const point = input?.dataset?.abLoopTime || "";
  if (!["a", "b"].includes(point)) return;
  const text = String(input.value || "").trim();
  const parsed = parsePreciseTimeInput(text);
  if (!parsed.ok) {
    input.setAttribute("aria-invalid", "true");
    showToast("Use times like 0:18.250, 2:45.000, or 18.25.");
    input.select?.();
    return;
  }
  input.removeAttribute("aria-invalid");
  updateAbLoopPoint(point, parsed.ms, { allowZero: text === "" });
}

function savedAbLoopOptionsHtml() {
  const loops = currentTrackSavedAbLoops();
  if (!loops.length) return '<option value="">No saved sections</option>';
  return [
    '<option value="">Saved sections</option>',
    ...loops.map((loop) => `<option value="${escapeHtml(loop.id)}">${escapeHtml(savedAbLoopLabel(loop))}</option>`)
  ].join("");
}

function advancedPlaybackPanelHtml() {
  const loopNeedsSave = abLoopNeedsSave();
  const editingLoop = abLoopEditingLoop();
  const loopActive = abLoopEnabled();
  const powerEnabled = state.abLoopPowerEnabled;
  const controlsEnabled = abLoopControlsEnabled();
  const queuedLoopIds = pruneAbLoopQueueForCurrentTrack();
  const queuedLoopCount = queuedLoopIds.length;
  const status = abLoopCardStatus();
  const savedLoops = currentTrackSavedAbLoops();
  const hasCurrentLoopPoints = abLoopHasCurrentPoints();
  const disabledAttr = controlsEnabled ? "" : "disabled";
  const clearDisabledAttr = hasCurrentLoopPoints ? "" : "disabled";
  return `
    ${advancedStepperHtml({
      label: "Sleep Timer",
      value: state.sleepTimerMinutes ? formatSleepTimerOption(state.sleepTimerMinutes) : "Off",
      minusAttr: "data-sleep-timer-step=\"-1\"",
      plusAttr: "data-sleep-timer-step=\"1\"",
      resetAttr: "data-sleep-timer-reset",
      status: sleepTimerStatusText(),
      statusAttr: "data-sleep-timer-status"
    })}

    ${advancedStepperHtml({
      label: "Speed",
      value: playbackSpeedRateLabel(),
      minusAttr: "data-playback-speed-step=\"-1\"",
      plusAttr: "data-playback-speed-step=\"1\"",
      resetAttr: "data-playback-speed-reset",
      status: playbackSpeedStatusText(),
      statusAttr: "data-speed-status"
    })}

    <section class="player-advanced-card pitch-card">
      <div class="advanced-card-head">
        <span>Pitch Shift</span>
        <strong data-pitch-shift-value>${escapeHtml(semitoneLabel())}</strong>
      </div>
      <div class="advanced-stepper">
        <button type="button" data-pitch-shift-step="-1" aria-label="Lower pitch">${icons.minus || "-"}</button>
        <output>${escapeHtml(semitoneLabel())}</output>
        <button type="button" data-pitch-shift-step="1" aria-label="Raise pitch">${icons.plus}</button>
      </div>
      <small>Speed unchanged</small>
    </section>

    <section class="player-advanced-card ab-loop-card ${powerEnabled ? "power-on" : "power-off"}">
      <div class="ab-loop-head">
        <div class="ab-loop-head-left">
          <span class="ab-loop-title-icon" aria-hidden="true">${icons.repeat}</span>
          <strong>A-B Loop</strong>
        </div>
        <div class="ab-loop-head-middle">
          <button class="ab-loop-launcher-toggle ${state.view === AB_LOOP_ADVANCED_VIEW && powerEnabled ? "active" : ""}" type="button" title="Advanced looper" aria-label="Advanced looper" aria-expanded="${state.view === AB_LOOP_ADVANCED_VIEW && powerEnabled}" data-ab-loop-advanced-toggle ${disabledAttr}>
            ${icons.wave}<span>Advanced</span>
          </button>
        </div>
        <div class="ab-loop-head-right">
          <div class="ab-loop-queue-control">
            <span>Queue${queuedLoopCount && powerEnabled ? ` ${queuedLoopCount}` : ""}</span>
            <button class="advanced-switch ab-loop-queue-toggle ${state.abLoopQueueEnabled && powerEnabled ? "active" : ""}" type="button" role="switch" aria-checked="${state.abLoopQueueEnabled && powerEnabled}" title="Queue saved loops" data-ab-loop-queue-toggle ${disabledAttr}>
              <span></span>
            </button>
          </div>
          <button class="ab-loop-clear-inline" type="button" data-ab-loop-clear ${clearDisabledAttr}>${icons.trash}<span>Clear</span></button>
          <button class="ab-loop-power-button ${powerEnabled ? "active" : ""}" type="button" aria-pressed="${powerEnabled}" title="${powerEnabled ? "Turn A-B Loop off" : "Turn A-B Loop on"}" aria-label="${powerEnabled ? "Turn A-B Loop off" : "Turn A-B Loop on"}" data-ab-loop-power>
            ${icons.power}
          </button>
        </div>
      </div>
      <div class="ab-loop-actions">
        ${abLoopTimeControlHtml("a", "Set A")}
        ${abLoopTimeControlHtml("b", "Set B")}
        <button class="tool-button ab-loop-save-button" type="button" data-ab-loop-save ${loopNeedsSave ? "" : "hidden"}>${icons.save}<span>${editingLoop ? "Update" : "Save"}</span></button>
      </div>
      <div class="ab-loop-active-wrap">
        <button class="ab-loop-active-button ${loopActive ? "active" : ""} ${powerEnabled ? "" : "off"}" type="button" data-ab-loop-active-menu aria-disabled="${(!powerEnabled || !savedLoops.length)}">
          <strong data-ab-loop-card-title>${escapeHtml(status.title)}</strong>
          <small data-ab-loop-card-subtitle>${escapeHtml(status.subtitle)}</small>
          <small class="ab-loop-status-note ${state.abLoopQueueEnabled && powerEnabled ? "queue-ready" : ""}" data-ab-loop-status>${escapeHtml(status.note)}</small>
        </button>
        ${state.abLoopMenuOpen && powerEnabled ? `
          <div class="ab-loop-popover" role="menu" aria-label="Saved loops for this song">
            ${savedLoops.length ? savedLoops.map((loop) => `
              <button type="button" role="menuitem" data-ab-loop-load="${escapeHtml(loop.id)}" class="${state.abLoop.id === loop.id ? "active" : ""}">
                <strong>${escapeHtml(loop.name || "Saved loop")}</strong>
                <small>${escapeHtml(`${msToPreciseTime(loop.aMs)} - ${msToPreciseTime(loop.bMs)}${queuedAbLoopCount(loop.id) ? ` - Queued ${queuedAbLoopCount(loop.id)}` : ""}`)}</small>
              </button>
            `).join("") : '<div class="ab-loop-empty">No saved loops for this song</div>'}
          </div>
        ` : ""}
      </div>
    </section>
  `;
}

function syncAdvancedPlaybackShell() {
  const bar = $(".player-bar");
  const panel = $("#playerAdvancedPanel");
  const button = $("#advancedPlayerButton");
  const nowPlayingMode = $(".now-playing-mode");
  const nowPlayingPanel = $("#nowPlayingAdvancedPanel");
  const nowPlayingButton = $('[data-now-playing-action="advanced"]');
  if (bar) bar.classList.toggle("advanced-open", state.advancedPlaybackOpen);
  if (bar) bar.classList.toggle("ab-loop-menu-open", state.abLoopMenuOpen);
  if (bar) bar.classList.toggle("ab-loop-launcher-open", state.abLoopLauncherOpen);
  if (panel) panel.setAttribute("aria-hidden", String(!state.advancedPlaybackOpen));
  if (nowPlayingMode) nowPlayingMode.classList.toggle("advanced-open", state.advancedPlaybackOpen);
  if (nowPlayingMode) nowPlayingMode.classList.toggle("ab-loop-menu-open", state.abLoopMenuOpen);
  if (nowPlayingMode) nowPlayingMode.classList.toggle("ab-loop-launcher-open", state.abLoopLauncherOpen);
  if (nowPlayingPanel) nowPlayingPanel.setAttribute("aria-hidden", String(!state.advancedPlaybackOpen));
  if (button) {
    button.innerHTML = icons.more;
    button.classList.toggle("active", state.advancedPlaybackOpen);
    button.title = state.advancedPlaybackOpen ? "Hide advanced playback" : "Advanced playback";
    button.setAttribute("aria-label", button.title);
    button.setAttribute("aria-expanded", String(state.advancedPlaybackOpen));
  }
  if (nowPlayingButton) {
    nowPlayingButton.classList.toggle("active", state.advancedPlaybackOpen);
    nowPlayingButton.title = state.advancedPlaybackOpen ? "Hide advanced playback" : "Advanced playback";
    nowPlayingButton.setAttribute("aria-label", nowPlayingButton.title);
    nowPlayingButton.setAttribute("aria-expanded", String(state.advancedPlaybackOpen));
  }
}

function syncAdvancedPlaybackUi() {
  syncAdvancedPlaybackShell();
  $$("[data-sleep-timer-status]").forEach((sleepStatus) => {
    sleepStatus.textContent = sleepTimerStatusText();
  });
  $$("[data-speed-status]").forEach((speedStatus) => {
    speedStatus.textContent = playbackSpeedStatusText();
  });
  $$("[data-pitch-shift-value], .advanced-stepper output").forEach((item) => {
    const card = item.closest(".player-advanced-card");
    if (card?.classList.contains("pitch-card") || item.matches("[data-pitch-shift-value]")) item.textContent = semitoneLabel();
    else if (card?.querySelector("[data-playback-speed-step]")) item.textContent = playbackSpeedRateLabel();
    else if (card?.querySelector("[data-sleep-timer-step]")) item.textContent = state.sleepTimerMinutes ? formatSleepTimerOption(state.sleepTimerMinutes) : "Off";
  });
  $$("[data-ab-loop-status]").forEach((loopStatus) => {
    loopStatus.textContent = abLoopCardStatus().note;
  });
  $$("[data-ab-loop-card-title]").forEach((item) => {
    item.textContent = abLoopCardStatus().title;
  });
  $$("[data-ab-loop-card-subtitle]").forEach((item) => {
    item.textContent = abLoopCardStatus().subtitle;
  });
  $$("[data-ab-loop-queue-status]").forEach((queueStatus) => {
    queueStatus.textContent = abLoopQueueStatusText();
  });
  $$("[data-ab-loop-time]").forEach((input) => {
    if (document.activeElement !== input) resetAbLoopTimeInput(input);
    input.disabled = !abLoopControlsEnabled();
  });
  $$("[data-ab-loop-save]").forEach((saveButton) => {
    saveButton.hidden = !abLoopNeedsSave();
  });
  $$("[data-ab-loop-power]").forEach((powerButton) => {
    powerButton.classList.toggle("active", state.abLoopPowerEnabled);
    powerButton.setAttribute("aria-pressed", String(state.abLoopPowerEnabled));
    powerButton.title = state.abLoopPowerEnabled ? "Turn A-B Loop off" : "Turn A-B Loop on";
    powerButton.setAttribute("aria-label", powerButton.title);
  });
  $$("[data-ab-loop-queue-toggle]").forEach((queueToggle) => {
    queueToggle.disabled = !abLoopControlsEnabled();
    queueToggle.classList.toggle("active", state.abLoopPowerEnabled && state.abLoopQueueEnabled);
    queueToggle.setAttribute("aria-checked", String(state.abLoopPowerEnabled && state.abLoopQueueEnabled));
  });
  $$("[data-ab-loop-advanced-toggle]").forEach((launcherToggle) => {
    launcherToggle.disabled = !abLoopControlsEnabled();
    launcherToggle.classList.toggle("active", state.abLoopPowerEnabled && state.view === AB_LOOP_ADVANCED_VIEW);
    launcherToggle.setAttribute("aria-expanded", String(state.abLoopPowerEnabled && state.view === AB_LOOP_ADVANCED_VIEW));
  });
  $$("[data-ab-loop-clear]").forEach((clearButton) => {
    clearButton.disabled = !abLoopHasCurrentPoints();
  });
}

function renderAdvancedPlaybackPanel() {
  const panel = $("#playerAdvancedPanel");
  if (panel) panel.innerHTML = advancedPlaybackPanelHtml();
  syncAdvancedPlaybackUi();
  syncAbLoopAdvancedPads();
  renderGlobalOverlays();
}

function toggleAdvancedPlaybackPanel() {
  const closing = state.advancedPlaybackOpen;
  state.advancedPlaybackOpen = !state.advancedPlaybackOpen;
  if (closing) {
    state.abLoopLauncherOpen = false;
    state.abLoopMenuOpen = false;
    closeAbLoopPadAssignmentMenu();
    closeAbLoopSavedLoopMenu();
    saveAdvancedPlaybackSettings();
  }
  renderAdvancedPlaybackPanel();
}

function renderPlayer() {
  const track = currentTrack();
  $("#playerTitle").textContent = track ? trackTitleWithTrimMarker(track, trackTrimForContext(track)) : "Nothing playing";
  $("#playerArtist").textContent = track ? track.artist : "Choose a track";
  const playerArt = $("#playerArt");
  playerArt.setAttribute("style", track ? artStyle(track) : "");
  playerArt.disabled = !track;
  playerArt.title = track ? "Open now playing" : "Nothing playing";
  playerArt.setAttribute("aria-label", track ? `Open now playing for ${track.title}` : "Nothing playing");
  $("#playButton").innerHTML = state.isPlaying ? icons.pause : icons.play;
  $("#playButton").title = state.isPlaying ? "Pause" : "Play";
  $("#playButton").classList.toggle("active", state.isPlaying);
  $("#shuffleButton").innerHTML = icons.shuffle;
  $("#shuffleButton").classList.toggle("active", state.shuffle);
  $("#shuffleButton").title = state.customShuffles.length
    ? `Shuffle: ${currentShuffleLabel()} / Right-click to choose`
    : "Shuffle";
  $("#shuffleAllButton").innerHTML = `${icons.shuffle}<span>${escapeHtml(currentShuffleLabel())}</span>`;
  $("#shuffleAllButton").title = state.customShuffles.length
    ? "Right-click to choose a shuffle method"
    : "Standard Shuffle";
  $("#repeatButton").innerHTML = state.repeat === "one" ? icons.repeatOne : icons.repeat;
  $("#repeatButton").classList.toggle("active", state.repeat !== "off");
  $("#previousButton").innerHTML = icons.previous;
  $("#nextButton").innerHTML = icons.next;
  const chordButtonAvailable = chordsButtonVisible(track, currentChords());
  $("#chordsButton").innerHTML = icons.chord;
  $("#chordsButton").hidden = !chordButtonAvailable;
  $("#chordsButton").classList.toggle("active", chordButtonAvailable && state.chordsPanelOpen);
  $("#chordsButton").title = hasTimedChords(currentChords())
    ? "Chord sync"
    : hasChordSheet(currentChords())
      ? "Chord sheet"
      : "Find or add chords";
  $("#lyricsButton").innerHTML = icons.mic;
  $("#lyricsButton").hidden = !lyricsButtonVisible(track, currentLyrics());
  $("#lyricsButton").classList.toggle("active", state.lyricsPanelOpen);
  $("#lyricsButton").title = hasSyncedLyrics(currentLyrics())
    ? "Synced lyrics"
    : hasLyricsContent(currentLyrics())
      ? "Lyrics"
      : "Find lyrics";
  syncMediaSession();
  renderProgress();
  renderVolumeControl();
  renderAdvancedPlaybackPanel();
  if (state.nowPlayingOpen) renderGlobalOverlays();
  syncNowPlayingPlaybackControls();
  syncSmoothProgressTicker();
}

function abLoopMarkerPercent(ms) {
  const track = currentTrack();
  const window = currentTimelineWindow();
  const duration = window.durationMs || durationForTrack(track);
  if (!track || !duration) return 0;
  return Math.max(0, Math.min(100, ((ms - window.startMs) / duration) * 100));
}

function abLoopMarkersHtml() {
  const track = currentTrack();
  const loop = state.abLoop;
  if (!track || loop.trackId !== track.id) return "";
  const markers = [];
  if (loop.aMs > 0 || loop.bMs - loop.aMs >= AB_LOOP_MIN_MS) {
    markers.push(`<button class="ab-loop-marker marker-a" type="button" data-ab-loop-marker="a" style="--marker-left:${abLoopMarkerPercent(loop.aMs)}%" aria-label="A loop marker"><span>A</span></button>`);
  }
  if (loop.bMs > 0) {
    markers.push(`<button class="ab-loop-marker marker-b" type="button" data-ab-loop-marker="b" style="--marker-left:${abLoopMarkerPercent(loop.bMs)}%" aria-label="B loop marker"><span>B</span></button>`);
  }
  return markers.join("");
}

function renderAbLoopMarkers() {
  const html = abLoopMarkersHtml();
  const mainLayer = $("#abLoopMarkerLayer");
  if (mainLayer) mainLayer.innerHTML = html;
  const nowPlayingLayer = $("#nowPlayingAbLoopMarkerLayer");
  if (nowPlayingLayer) nowPlayingLayer.innerHTML = html;
}

function shouldRunSmoothProgressTicker() {
  return Boolean(state.isPlaying && currentTrack() && !state.timelineScrub.active);
}

function stopSmoothProgressTicker() {
  if (smoothProgressFrame) cancelAnimationFrame(smoothProgressFrame);
  smoothProgressFrame = 0;
  smoothProgressLastRenderAt = 0;
}

function smoothProgressTick(now) {
  if (!shouldRunSmoothProgressTicker()) {
    stopSmoothProgressTicker();
    return;
  }
  if (maybeApplyAbLoop()) {
    smoothProgressFrame = requestAnimationFrame(smoothProgressTick);
    return;
  }
  if (!smoothProgressLastRenderAt || now - smoothProgressLastRenderAt >= 33) {
    smoothProgressLastRenderAt = now;
    renderProgress();
  }
  smoothProgressFrame = requestAnimationFrame(smoothProgressTick);
}

function syncSmoothProgressTicker() {
  if (!shouldRunSmoothProgressTicker()) {
    stopSmoothProgressTicker();
    return;
  }
  if (!smoothProgressFrame) smoothProgressFrame = requestAnimationFrame(smoothProgressTick);
}

function renderProgress(options = {}) {
  const progress = playbackProgressSnapshot();
  const zoomTitle = progressZoomTitle(progress);
  const progressPercent = timelineProgressPercent(progress.value);
  $("#currentTime").textContent = msToTime(progressDisplayCurrentMs(progress));
  $("#currentTime").title = zoomTitle;
  $("#durationTime").textContent = msToTime(progressDisplayDurationMs(progress));
  $("#durationTime").title = zoomTitle || (progress.window.hasTrim ? `Trimmed from ${msToTime(progress.window.startMs)} to ${msToTime(progress.window.endMs)}` : "");
  const progressInput = $("#progressInput");
  progressInput.max = String(TIMELINE_RANGE_MAX);
  progressInput.step = "1";
  progressInput.value = String(progress.value);
  progressInput.title = zoomTitle;
  progressInput.style.setProperty("--progress-percent", `${progressPercent}%`);
  const scrubWrap = $("#progressScrubWrap");
  if (scrubWrap) {
    scrubWrap.classList.toggle("timeline-zoomed", Boolean(progress.timelineWindow?.zoomed));
    scrubWrap.title = zoomTitle;
  }
  const now = nowPerfMs();
  const slowSync = !options.smooth || !progressSlowSyncLastAt || now - progressSlowSyncLastAt >= 180;
  if (!slowSync) return;
  progressSlowSyncLastAt = now;
  renderAbLoopMarkers();
  syncAbLoopAdvancedView();
  syncNowPlayingPlaybackControls();
  syncLyricsPlayback();
  syncChordPlayback();
  syncMediaSessionPosition();
}

function playlistAddDialogHtml() {
  if (!state.playlistAddDialog.open) return "";
  const count = state.playlistAddDialog.trackIds.length;
  const duplicatePlaylist = playlistById(state.playlistAddDialog.duplicatePlaylistId);
  const options = state.playlists.map((playlist) => `
    <option value="${escapeHtml(playlist.id)}">${escapeHtml(playlist.name)} (${playlist.trackIds.length})</option>
  `).join("");
  const disabled = count ? "" : "disabled";
  const duplicateActions = duplicatePlaylist ? `
    <div class="playlist-inline-actions">
      <button class="tool-button" type="button" data-add-to-existing-playlist="${escapeHtml(duplicatePlaylist.id)}">${icons.plus}<span>Add to Existing</span></button>
      <button class="tool-button" type="button" data-clear-playlist-duplicate>${icons.x}<span>Use Different Name</span></button>
    </div>
  ` : "";
  return `
    <div class="playlist-window-backdrop playlist-add-backdrop" data-close-playlist-add>
      <section class="playlist-window playlist-add-window" role="dialog" aria-modal="true" aria-labelledby="playlistAddTitle">
        <form id="playlistAddForm" class="playlist-settings-form">
          <header class="playlist-window-head">
            <div>
              <div class="section-title">Playlist</div>
              <h2 id="playlistAddTitle">Add to Playlist</h2>
            </div>
            <button class="icon-button" type="button" title="Close" data-close-playlist-add>${icons.x}</button>
          </header>
          <div class="playlist-add-fields">
            <label class="field">
              <span>Existing playlist</span>
              <select name="playlistId" ${state.playlists.length ? "" : "disabled"}>
                <option value="">Choose playlist</option>
                ${options}
              </select>
            </label>
            <label class="field">
              <span>New playlist name</span>
              <input name="newPlaylistName" placeholder="Road trip, gym, late night">
            </label>
            <div class="playlist-add-summary">${count ? `${count} song${count === 1 ? "" : "s"} selected` : "No songs selected"}</div>
            ${state.playlistAddDialog.status ? `<div class="playlist-inline-status">${escapeHtml(state.playlistAddDialog.status)}</div>` : ""}
            ${duplicateActions}
          </div>
          <footer class="playlist-window-actions">
            <button class="tool-button" type="button" data-close-playlist-add>${icons.x}<span>Cancel</span></button>
            <button class="primary-button" type="submit" ${disabled}>${icons.plus}<span>Add Songs</span></button>
          </footer>
        </form>
      </section>
    </div>
  `;
}

function queuePlaylistDialogHtml() {
  if (!state.queuePlaylistDialog.open) return "";
  const count = state.queuePlaylistDialog.trackIds.length;
  const disabled = count ? "" : "disabled";
  return `
    <div class="playlist-window-backdrop queue-playlist-backdrop" data-close-queue-playlist>
      <section class="playlist-window playlist-add-window" role="dialog" aria-modal="true" aria-labelledby="queuePlaylistTitle">
        <form id="queuePlaylistForm" class="playlist-settings-form">
          <header class="playlist-window-head">
            <div>
              <div class="section-title">Queue</div>
              <h2 id="queuePlaylistTitle">Create Playlist from Queue</h2>
            </div>
            <button class="icon-button" type="button" title="Close" data-close-queue-playlist>${icons.x}</button>
          </header>
          <div class="playlist-add-fields">
            <label class="field">
              <span>New playlist name</span>
              <input name="queuePlaylistName" placeholder="Road trip, gym, late night" required autofocus>
            </label>
            <div class="playlist-add-summary">${count ? `${count} queued song${count === 1 ? "" : "s"}` : "No queued songs"}</div>
            ${state.queuePlaylistDialog.status ? `<div class="playlist-inline-status">${escapeHtml(state.queuePlaylistDialog.status)}</div>` : ""}
          </div>
          <footer class="playlist-window-actions">
            <button class="tool-button" type="button" data-close-queue-playlist>${icons.x}<span>Cancel</span></button>
            <button class="primary-button" type="submit" ${disabled}>${icons.plus}<span>Create Playlist</span></button>
          </footer>
        </form>
      </section>
    </div>
  `;
}

function abLoopSaveDialogHtml() {
  if (!state.abLoopSaveDialog.open) return "";
  const loop = state.abLoop;
  const editing = abLoopEditingLoop(loop);
  return `
    <div class="playlist-window-backdrop ab-loop-save-backdrop" data-close-ab-loop-save>
      <section class="playlist-window ab-loop-save-window" role="dialog" aria-modal="true" aria-labelledby="abLoopSaveTitle">
        <form id="abLoopSaveForm" class="playlist-settings-form">
          <header class="playlist-window-head">
            <div>
              <div class="section-title">A-B Loop</div>
              <h2 id="abLoopSaveTitle">${editing ? "Edit Loop" : "Save Loop"}</h2>
            </div>
            <button class="icon-button" type="button" title="Close" data-close-ab-loop-save>${icons.x}</button>
          </header>
          <label class="field">
            <span>Loop name</span>
            <input name="abLoopName" value="${escapeHtml(state.abLoopSaveDialog.name || loop.name || "")}" placeholder="Chorus, Solo, Practice part" required>
          </label>
          <div class="playlist-add-summary">${escapeHtml(`${msToPreciseTime(loop.aMs)} - ${msToPreciseTime(loop.bMs)}`)}</div>
          ${state.abLoopSaveDialog.status ? `<div class="playlist-inline-status">${escapeHtml(state.abLoopSaveDialog.status)}</div>` : ""}
          <footer class="playlist-window-actions">
            <button class="tool-button" type="button" data-close-ab-loop-save>${icons.x}<span>Cancel</span></button>
            <button class="primary-button" type="submit">${icons.save}<span>${editing ? "Overwrite Loop" : "Save Loop"}</span></button>
          </footer>
        </form>
      </section>
    </div>
  `;
}

function shuffleSaveDialogHtml() {
  if (!state.shuffleSaveDialog.open) return "";
  const pending = Boolean(state.shuffleSaveDialog.pending);
  return `
    <div class="playlist-window-backdrop shuffle-save-backdrop ${pending ? "playback-friendly-backdrop" : ""}" data-close-shuffle-save-dialog>
      <section class="playlist-window shuffle-save-window" role="dialog" aria-modal="true" aria-labelledby="shuffleSaveTitle" aria-busy="${pending ? "true" : "false"}">
        <form id="shuffleSaveDialogForm" class="playlist-settings-form">
          <header class="playlist-window-head">
            <div>
              <div class="section-title">Custom Shuffle</div>
              <h2 id="shuffleSaveTitle">Save Preset</h2>
            </div>
            <button class="icon-button" type="button" title="Close" data-close-shuffle-save-dialog ${pending ? "disabled" : ""}>${icons.x}</button>
          </header>
          <label class="field">
            <span>Preset name</span>
            <input name="shufflePresetName" value="${escapeHtml(state.shuffleSaveDialog.name || "")}" placeholder="Late night discovery" required ${pending ? "disabled" : ""}>
          </label>
          ${pending ? `
            <div class="dialog-pending-status" role="status">
              ${icons.refresh}
              <span>
                <strong>Saving Custom Shuffle</strong>
                <small>Please wait. Playback controls are still available.</small>
              </span>
            </div>
          ` : state.shuffleSaveDialog.status ? `<div class="playlist-inline-status">${escapeHtml(state.shuffleSaveDialog.status)}</div>` : ""}
          <footer class="playlist-window-actions">
            <button class="tool-button" type="button" data-close-shuffle-save-dialog ${pending ? "disabled" : ""}>${icons.x}<span>Cancel</span></button>
            <button class="primary-button" type="submit" ${pending ? "disabled" : ""}>${pending ? icons.refresh : icons.save}<span>${pending ? "Saving" : "Save Preset"}</span></button>
          </footer>
        </form>
      </section>
    </div>
  `;
}

function confirmDialogHtml() {
  if (!state.confirmDialog.open) return "";
  let detail = null;
  const pending = Boolean(state.confirmDialog.pending);
  if (state.confirmDialog.type === "deletePlaylist") {
    const playlist = playlistById(state.confirmDialog.playlistId);
    if (playlist) {
      detail = {
        section: "Playlist",
        title: "Delete Playlist",
        copy: `Are you sure you wish to delete "${playlist.name}"?`,
        cancelLabel: "Cancel",
        confirmLabel: "Delete",
        confirmAttr: `data-confirm-delete-playlist="${escapeHtml(playlist.id)}"`
      };
    }
  } else if (state.confirmDialog.type === "deleteShuffleProfile") {
    const profile = shuffleProfileById(state.confirmDialog.shuffleProfileId);
    if (profile) {
      detail = {
        section: "Custom Shuffle",
        title: "Delete Custom Shuffle",
        copy: `Are you sure you wish to delete "${profile.name}"?`,
        cancelLabel: "No",
        confirmLabel: "Yes",
        confirmAttr: `data-confirm-delete-shuffle-profile="${escapeHtml(profile.id)}"`
      };
    }
  }
  if (!detail) return "";
  return `
    <div class="playlist-window-backdrop confirm-backdrop ${pending ? "playback-friendly-backdrop" : ""}">
      <section class="playlist-window confirm-window" role="dialog" aria-modal="true" aria-labelledby="confirmDialogTitle" aria-busy="${pending ? "true" : "false"}">
        <div class="playlist-settings-form">
          <header class="playlist-window-head">
            <div>
              <div class="section-title">${escapeHtml(detail.section)}</div>
              <h2 id="confirmDialogTitle">${escapeHtml(detail.title)}</h2>
            </div>
            <button class="icon-button" type="button" title="Close" data-close-confirm-dialog ${pending ? "disabled" : ""}>${icons.x}</button>
          </header>
          <p class="confirm-copy">${escapeHtml(detail.copy)}</p>
          ${pending ? `
            <div class="dialog-pending-status" role="status">
              ${icons.refresh}
              <span>
                <strong>Deleting Custom Shuffle</strong>
                <small>Please wait. Playback controls are still available.</small>
              </span>
            </div>
          ` : state.confirmDialog.status ? `<div class="playlist-inline-status">${escapeHtml(state.confirmDialog.status)}</div>` : ""}
          <footer class="playlist-window-actions">
            <button class="tool-button" type="button" data-close-confirm-dialog ${pending ? "disabled" : ""}>${icons.x}<span>${escapeHtml(detail.cancelLabel)}</span></button>
            <button class="tool-button danger-button" type="button" ${detail.confirmAttr} ${pending ? "disabled" : ""}>${pending ? icons.refresh : icons.trash}<span>${pending ? "Deleting" : escapeHtml(detail.confirmLabel)}</span></button>
          </footer>
        </div>
      </section>
    </div>
  `;
}

function cancelYearReviewPreviewFade() {
  if (yearReviewPreviewFadeTimer) clearInterval(yearReviewPreviewFadeTimer);
  yearReviewPreviewFadeTimer = 0;
}

function yearReviewPreviewTargetVolume() {
  return Math.min(0.58, Math.max(0.18, state.volume || DEFAULT_VOLUME));
}

function resetYearReviewPreviewAudio() {
  cancelYearReviewPreviewFade();
  yearReviewPreviewAudio.pause();
  yearReviewPreviewAudio.removeAttribute("src");
  delete yearReviewPreviewAudio.dataset.trackId;
  yearReviewPreviewAudio.load?.();
}

function stopYearReviewPreview() {
  yearReviewPreviewToken += 1;
  resetYearReviewPreviewAudio();
}

function fadeYearReviewPreviewTo(targetVolume, durationMs = YEAR_REVIEW_AUDIO_FADE_MS) {
  cancelYearReviewPreviewFade();
  const startVolume = Number(yearReviewPreviewAudio.volume || 0);
  const endVolume = Math.max(0, Math.min(1, Number(targetVolume || 0)));
  const startedAt = performance.now();
  if (durationMs <= 0 || Math.abs(startVolume - endVolume) < 0.01) {
    yearReviewPreviewAudio.volume = endVolume;
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    yearReviewPreviewFadeTimer = setInterval(() => {
      const progress = Math.min(1, (performance.now() - startedAt) / durationMs);
      yearReviewPreviewAudio.volume = startVolume + (endVolume - startVolume) * progress;
      if (progress >= 1) {
        cancelYearReviewPreviewFade();
        yearReviewPreviewAudio.volume = endVolume;
        resolve();
      }
    }, 30);
  });
}

async function fadeOutYearReviewPreview() {
  if (!yearReviewPreviewAudio.src || yearReviewPreviewAudio.paused) {
    resetYearReviewPreviewAudio();
    return;
  }
  await fadeYearReviewPreviewTo(0);
  resetYearReviewPreviewAudio();
}

async function playYearReviewSlideClip() {
  if (!state.yearReview.open) return;
  const story = state.yearReview.story || buildYearReviewStory(state.yearReview.year);
  const slides = yearReviewSlides(story);
  const slide = slides[Math.min(Math.max(0, state.yearReview.slideIndex), slides.length - 1)];
  const track = slide?.clipTrack;
  if (!track || !canStreamTrack(track)) {
    await fadeOutYearReviewPreview();
    return;
  }
  if (yearReviewPreviewAudio.dataset.trackId === track.id && !yearReviewPreviewAudio.paused) return;

  const duration = durationForTrack(track);
  const clipMs = YEAR_REVIEW_CLIP_SECONDS * 1000;
  const startMs = duration > clipMs + 1000
    ? Math.min(Math.round(duration * 0.32), Math.max(0, duration - clipMs - 1000))
    : 0;
  const token = ++yearReviewPreviewToken;
  await fadeOutYearReviewPreview();
  if (token !== yearReviewPreviewToken || !state.yearReview.open) return;
  yearReviewPreviewAudio.src = audioStreamUrlForTrack(track);
  yearReviewPreviewAudio.dataset.trackId = track.id;
  yearReviewPreviewAudio.volume = 0;
  yearReviewPreviewAudio.muted = state.muted;
  const seekPreview = () => {
    if (startMs > 0 && Number.isFinite(yearReviewPreviewAudio.duration)) {
      try {
        yearReviewPreviewAudio.currentTime = startMs / 1000;
      } catch {
        // Preview streams can be non-seekable until the browser has buffered enough.
      }
    }
  };
  yearReviewPreviewAudio.addEventListener("loadedmetadata", seekPreview, { once: true });
  yearReviewPreviewAudio.play()
    .then(() => {
      if (token !== yearReviewPreviewToken || !state.yearReview.open) return null;
      return fadeYearReviewPreviewTo(yearReviewPreviewTargetVolume());
    })
    .catch(() => {});
}

function yearReviewSlideStyle(slide) {
  const track = slide?.clipTrack;
  const color = track ? colorForTrack(track) : state.settings?.accentColor || "#7d3cff";
  return `--year-review-tone: ${color}`;
}

function renderYearReviewOverlay() {
  if (!state.yearReview.open) return "";
  const story = state.yearReview.story || buildYearReviewStory(state.yearReview.year);
  const slides = yearReviewSlides(story);
  const index = Math.min(Math.max(0, state.yearReview.slideIndex), slides.length - 1);
  const slide = slides[index];
  const playlistId = state.yearReview.playlistId || story.playlist?.id || "";
  const artTracks = [slide.clipTrack]
    .concat(story.topSongs.map((item) => item.track))
    .filter(Boolean)
    .filter((track, trackIndex, tracks) => tracks.findIndex((candidate) => candidate.id === track.id) === trackIndex)
    .slice(0, 4);
  const loadingText = state.yearReview.loading ? '<span class="year-review-saving">Saving playlist...</span>' : "";
  const errorText = state.yearReview.error ? `<span class="year-review-error">${escapeHtml(state.yearReview.error)}</span>` : "";

  return `
    <div class="year-review-backdrop" data-close-year-review>
      <section class="year-review-modal" role="dialog" aria-modal="true" aria-labelledby="yearReviewTitle" style="${yearReviewSlideStyle(slide)}">
        <div class="year-review-bg" aria-hidden="true">
          ${artTracks.map((track) => `<span style="${artStyle(track)}"></span>`).join("")}
        </div>
        <header class="year-review-top">
          <div>
            <div class="section-title">VoidFM ${escapeHtml(story.year)}</div>
            <h2 id="yearReviewTitle">${escapeHtml(slide.title)}</h2>
          </div>
          <button class="icon-button" type="button" title="Close" data-close-year-review>${icons.x}</button>
        </header>
        <div class="year-review-progress" aria-label="Review sections">
          ${slides.map((item, slideIndex) => `
            <button type="button" class="${slideIndex === index ? "active" : ""}" title="${escapeHtml(item.label)}" data-year-review-slide="${slideIndex}">
              <span></span>
            </button>
          `).join("")}
        </div>
        <div class="year-review-stage">
          <div class="year-review-copy">
            <span>${escapeHtml(slide.label)}</span>
            <strong>${escapeHtml(slide.stat)}</strong>
            <p>${escapeHtml(slide.copy)}</p>
            ${loadingText}
            ${errorText}
          </div>
          <div class="year-review-body">${slide.body}</div>
        </div>
        <footer class="year-review-actions">
          <button class="tool-button" type="button" data-year-review-prev ${index === 0 ? "disabled" : ""}>${icons.arrowLeft}<span>Back</span></button>
          ${playlistId ? `<button class="tool-button" type="button" data-year-review-open-playlist="${escapeHtml(playlistId)}">${icons.list}<span>Open Playlist</span></button>` : ""}
          <button class="primary-button" type="button" data-year-review-next>${index === slides.length - 1 ? icons.x : icons.arrowRight}<span>${index === slides.length - 1 ? "Done" : "Next"}</span></button>
        </footer>
      </section>
    </div>
  `;
}

function syncYearReviewPlaylist(playlist) {
  if (!playlist?.id) return;
  const index = state.playlists.findIndex((item) => item.id === playlist.id);
  if (index === -1) state.playlists.unshift(playlist);
  else state.playlists[index] = playlist;
  markPlaylistsChanged();
}

function refreshYearReviewSurfaces() {
  renderSurface();
  renderSidebarPlaylists();
  if (state.view === "library" || state.view === "playlists") renderActiveView();
  renderGlobalOverlays();
}

async function ensureYearReviewPlaylist(year) {
  const payload = await api(`/api/year-review/${encodeURIComponent(normalizedReviewYear(year))}`, {
    method: "POST",
    body: "{}"
  });
  syncYearReviewPlaylist(payload.playlist);
  return payload.playlist;
}

async function openYearReview(options = {}) {
  const year = normalizedReviewYear(options.year || new Date().getFullYear());
  const initialStory = buildYearReviewStory(year);
  state.yearReview = {
    open: true,
    year,
    slideIndex: 0,
    story: initialStory,
    playlistId: initialStory.playlist?.id || "",
    loading: true,
    error: ""
  };
  renderGlobalOverlays();
  playYearReviewSlideClip();

  try {
    const playlist = await ensureYearReviewPlaylist(year);
    state.yearReview = {
      ...state.yearReview,
      story: buildYearReviewStory(year, playlist, state.yearReview.story?.clipPlan),
      playlistId: playlist.id,
      loading: false,
      error: ""
    };
    refreshYearReviewSurfaces();
  } catch (error) {
    state.yearReview = {
      ...state.yearReview,
      loading: false,
      error: error.message || "Could not save the year playlist."
    };
    renderGlobalOverlays();
  }
}

async function closeYearReview(options = {}) {
  if (options.fade !== false) await fadeOutYearReviewPreview();
  state.yearReview = {
    ...state.yearReview,
    open: false,
    loading: false,
    error: ""
  };
  stopYearReviewPreview();
  renderGlobalOverlays();
}

async function setYearReviewSlide(slideIndex, options = {}) {
  const story = state.yearReview.story || buildYearReviewStory(state.yearReview.year);
  const slides = yearReviewSlides(story);
  const nextIndex = Math.min(Math.max(0, Number(slideIndex || 0)), slides.length - 1);
  if (nextIndex === state.yearReview.slideIndex) {
    await playYearReviewSlideClip();
    return;
  }
  if (options.fade !== false) await fadeOutYearReviewPreview();
  state.yearReview.slideIndex = nextIndex;
  renderGlobalOverlays();
  playYearReviewSlideClip();
}

function handleYearReviewHotkey(event) {
  if (event.ctrlKey || event.metaKey || event.altKey) return false;
  const key = event.key && event.key.length === 1 ? event.key.toLowerCase() : "";
  if (!key) return false;
  state.yearReviewTypedBuffer = `${state.yearReviewTypedBuffer}${key}`.slice(-YEAR_REVIEW_HOTKEY.length);
  if (state.yearReviewTypedBuffer !== YEAR_REVIEW_HOTKEY) return false;
  state.yearReviewTypedBuffer = "";
  event.preventDefault();
  openYearReview({ year: new Date().getFullYear() });
  return true;
}

function maybeAutoOpenYearReview() {
  if (state.yearReviewAutoChecked) return;
  state.yearReviewAutoChecked = true;
  if (!shouldShowVoidReview()) return;
  const year = new Date().getFullYear();
  const story = buildYearReviewStory(year);
  if (!story.topSongs.length) return;
  const storageKey = `${YEAR_REVIEW_SEEN_KEY_PREFIX}${year}`;
  try {
    if (localStorage.getItem(storageKey)) return;
    localStorage.setItem(storageKey, new Date().toISOString());
  } catch {
    // Storage can be unavailable in hardened browser contexts; the review can still open.
  }
  openYearReview({ year });
}

function renderGlobalOverlays() {
  if (state.nowPlayingOpen && !currentTrack()) state.nowPlayingOpen = false;
  if (!state.nowPlayingOpen) stopNowPlayingVisualizer();
  document.body.classList.toggle("now-playing-active", state.nowPlayingOpen);
  document.body.classList.toggle("modal-playback-unlocked", Boolean(
    state.shuffleSaveDialog.pending
    || (state.confirmDialog.pending && state.confirmDialog.type === "deleteShuffleProfile")
  ));
  let root = $("#globalOverlays");
  if (!root) {
    root = document.createElement("div");
    root.id = "globalOverlays";
    document.body.appendChild(root);
  }
  root.innerHTML = `
    ${nowPlayingModeHtml()}
    ${renderYearReviewOverlay()}
    ${runtimeNoticeHtml()}
    ${recoveryNoticeHtml()}
    ${plexAuthHelpHtml()}
    ${playlistAddDialogHtml()}
    ${queuePlaylistDialogHtml()}
    ${abLoopSaveDialogHtml()}
    ${abLoopAdvancedMarkerMenuHtml()}
    ${abLoopPadAssignmentMenuHtml()}
    ${abLoopSavedLoopMenuHtml()}
    ${shuffleSaveDialogHtml()}
    ${trackInfoDialogHtml()}
    ${confirmDialogHtml()}
    ${trackContextMenuHtml()}
    ${shuffleContextMenuHtml()}
    ${queueContextMenuHtml()}
    ${state.toast ? `<div class="app-toast" role="status">${escapeHtml(state.toast)}</div>` : ""}
  `;
}

function renderAll() {
  renderConnection();
  syncViewShell();
  renderSurface();
  renderLibraryNav();
  renderSidebarPlaylists();
  renderActiveView();
  renderQueue();
  renderPlayer();
  renderGlobalOverlays();
  renderHistoryButtons();
}

async function loadInitialData() {
  setStartupLoaderStatus("Launching VoidFM", "Opening your library...");
  setStartupLoaderProgress(0);
  startStartupLoaderTrickle();
  const [runtime, settings, library, sections, playlists, rules, shuffleProfiles, playbackState, listening, metadata, lyricsStatus, backupStatus] = await Promise.all([
    api("/api/runtime").catch(() => null),
    api("/api/settings"),
    api("/api/library/tracks"),
    api("/api/library/sections"),
    api("/api/playlists"),
    api("/api/rules"),
    api("/api/shuffle-profiles"),
    api("/api/playback-state"),
    api("/api/listening-stats"),
    api("/api/metadata/status").catch(() => null),
    api("/api/lyrics/status").catch(() => null),
    api("/api/backup/status").catch(() => null)
  ]);

  setStartupLoaderStatus("Loading library", "Preparing your music...");
  setStartupLoaderProgress(0.72);
  state.runtime = runtime;
  localApiToken = String(runtime?.localApiToken || "");
  state.runtimeMismatch = !runtimeLooksFresh(runtime);
  state.settings = settings;
  state.settings.eq = normalizeEqSettings(settings.eq);
  state.recoveryNotice = settings.recoveryNotice || null;
  applyAccentColor(settings.accentColor);
  applyEqSettingsToAudio();
  state.tracks = library.tracks;
  markTracksChanged();
  state.sections = sections.sections;
  state.playlists = playlists.playlists;
  markPlaylistsChanged();
  state.blacklist = dedupeBlacklistRules(rules.blacklist);
  markBlacklistChanged();
  state.links = rules.links;
  state.customShuffles = shuffleProfiles.profiles;
  state.listeningStats = listening.stats || {};
  state.listeningEvents = listening.events || [];
  markStatsChanged();
  restoreLibraryFilterSettings();
  restorePlaylistSortSettings();
  state.metadataStatus = metadata;
  state.metadataJob = metadata?.runningJob || null;
  state.lyricsScanStatus = lyricsStatus;
  state.lyricsScanJob = lyricsStatus?.runningJob || null;
  state.backupStatus = backupStatus;
  state.activeShuffleProfileId = playbackState.activeShuffleProfileId || "";
  restoreAdvancedPlaybackSettings();
  applyAdvancedPlaybackSettings();
  scheduleSleepTimerTick();
  restorePlayback(playbackState);
  setStartupLoaderStatus("Almost ready", "Drawing the interface...");
  setStartupLoaderProgress(0.92);
  renderAll();
  maybeAutoOpenYearReview();
  if (state.recoveryNotice) {
    showToast("VoidFM recovered from database corruption. Details are shown above.");
  }
  if (state.lyricsScanJob?.id && ["queued", "running"].includes(state.lyricsScanJob.status)) {
    pollLyricsScanJob(state.lyricsScanJob.id);
  }
  maybeAutoStartMetadataEnrichment();
  completeStartupLoader();
}

async function refreshLibrary() {
  $("#refreshButton").disabled = true;
  try {
    const library = await api("/api/library/refresh", { method: "POST", body: "{}" });
    state.tracks = library.tracks;
    markTracksChanged();
    applyLibraryFilterSettings({
      field: state.libraryFilterField,
      value: state.libraryFilterValue,
      sort: state.librarySort
    });
    if (library.sections) state.sections = library.sections;
    state.settings = library.settings;
    state.metadataStatus = await api("/api/metadata/status").catch(() => state.metadataStatus);
    state.lyricsScanStatus = await api("/api/lyrics/status").catch(() => state.lyricsScanStatus);
    renderAll();
  } catch (error) {
    alert(error.message);
  } finally {
    $("#refreshButton").disabled = false;
  }
}

function applyLibraryPayload(payload) {
  if (payload?.settings) {
    state.settings = payload.settings;
    applyAccentColor(state.settings.accentColor);
  }
  if (payload?.sections) state.sections = payload.sections;
  if (payload?.tracks) {
    state.tracks = payload.tracks;
    markTracksChanged();
    applyLibraryFilterSettings({
      field: state.libraryFilterField,
      value: state.libraryFilterValue,
      sort: state.librarySort
    });
  }
  renderAll();
}

function updateMetadataActionUi() {
  const enriching = metadataEnrichmentRunning();
  const progress = `${metadataActionProgressPercent().toFixed(2)}%`;
  $$("[data-metadata-status-line]").forEach((line) => {
    line.textContent = metadataStatusLine();
  });
  $$("[data-metadata-action-line]").forEach((line) => {
    line.textContent = metadataActionDetail();
  });
  $$(".enrichment-status-card").forEach((card) => {
    card.classList.toggle("is-running", enriching);
    card.style.setProperty("--metadata-progress", progress);
  });
  $$("[data-enrich-library]").forEach((button) => {
    button.disabled = enriching;
    button.classList.toggle("is-running", enriching);
    button.title = enriching ? metadataStatusLine() : "Run metadata enrichment for the library.";
    const label = button.querySelector("[data-enrich-label]");
    if (label) label.textContent = metadataActionLabel();
  });
}

function updateShuffleStatusUi() {
  updateMetadataActionUi();
  if (state.view !== "shuffle") return;
  const rules = activeFlowRules();
  const stats = $("#viewShuffle .workshop-stats");
  if (stats) stats.innerHTML = workshopStatCardsHtml(rules);
  const health = $("[data-flow-health-mount]");
  if (health) health.innerHTML = flowHealthHtml(rules);
  const warningList = $("[data-flow-warnings]");
  if (warningList) warningList.innerHTML = flowWarningsHtml(rules);
}

async function refreshMetadataStatus() {
  const status = await api("/api/metadata/status").catch(() => state.metadataStatus);
  state.metadataStatus = status;
  if (status?.runningJob && !["queued", "running"].includes(state.metadataJob?.status)) {
    state.metadataJob = status.runningJob;
  }
  updateShuffleStatusUi();
}

async function pollMetadataJob(jobId) {
  if (!jobId) return;
  if (state.metadataPollTimer) clearTimeout(state.metadataPollTimer);
  const job = await api(`/api/metadata/enrich/${jobId}`).catch(() => null);
  if (job) state.metadataJob = job;
  await refreshMetadataStatus();
  if (job && ["queued", "running"].includes(job.status)) {
    state.metadataPollTimer = setTimeout(() => pollMetadataJob(jobId), 1500);
    return;
  }
  const library = await api("/api/library/tracks").catch(() => null);
  if (library?.tracks) {
    state.tracks = library.tracks;
    markTracksChanged();
  }
  renderAll();
}

function metadataProvidersEnabled() {
  const providers = state.metadataStatus?.providers || state.settings?.metadataProviders || {};
  return Object.values(providers).some(Boolean);
}

function metadataNeedsAutoEnrichment() {
  const status = state.metadataStatus || {};
  const total = Number(status.cachedTracks || state.tracks.length || 0);
  if (!total || !metadataProvidersEnabled() || metadataEnrichmentRunning()) return false;
  return Number(status.enrichedTracks || 0) < total;
}

async function maybeAutoStartMetadataEnrichment() {
  if (state.metadataJob?.id && ["queued", "running"].includes(state.metadataJob.status)) {
    pollMetadataJob(state.metadataJob.id);
    return;
  }
  if (state.metadataAutoStarted || !metadataNeedsAutoEnrichment()) return;
  state.metadataAutoStarted = true;
  await startMetadataEnrichment({ missingOnly: true, silent: true });
}

async function startMetadataEnrichment(options = {}) {
  $$("[data-enrich-library]").forEach((button) => {
    button.disabled = true;
  });
  try {
    if (metadataEnrichmentRunning() && state.metadataJob?.id) {
      pollMetadataJob(state.metadataJob.id);
      return;
    }
    state.metadataJob = {
      status: "queued",
      done: 0,
      total: Number(state.metadataStatus?.cachedTracks || state.tracks.length || 0)
    };
    updateShuffleStatusUi();
    const payload = await api("/api/metadata/enrich", {
      method: "POST",
      body: JSON.stringify({ limit: 0, missingOnly: Boolean(options.missingOnly) })
    });
    state.metadataJob = payload.job;
    updateShuffleStatusUi();
    if (payload.job?.id && ["queued", "running"].includes(payload.job.status)) {
      pollMetadataJob(payload.job.id);
    } else {
      await refreshMetadataStatus();
      renderAll();
    }
  } catch (error) {
    state.metadataJob = null;
    updateShuffleStatusUi();
    if (options.silent) console.warn("Automatic metadata enrichment failed:", error);
    else alert(error.message);
  }
}

function updateLyricsScanUi() {
  const summary = $("[data-lyrics-scan-summary]");
  if (summary) summary.textContent = lyricsScanStatusLine();
  const scanning = lyricsScanRunning();
  const progress = `${lyricsScanProgressPercent().toFixed(2)}%`;
  $$("[data-scan-lyrics-library]").forEach((button) => {
    button.disabled = scanning;
    button.classList.toggle("is-running", scanning);
    button.title = scanning ? lyricsScanStatusLine() : "Scan all songs for lyrics.";
    button.style.setProperty("--lyrics-progress", progress);
    const label = button.querySelector("[data-lyrics-scan-label]");
    if (label) label.textContent = lyricsScanActionLabel();
    const line = button.querySelector("[data-lyrics-scan-line]");
    if (line) line.textContent = lyricsScanActionDetail();
  });
}

async function refreshLyricsScanStatus() {
  const status = await api("/api/lyrics/status").catch(() => state.lyricsScanStatus);
  state.lyricsScanStatus = status;
  if (status?.runningJob && !["queued", "running"].includes(state.lyricsScanJob?.status)) {
    state.lyricsScanJob = status.runningJob;
  }
  updateLyricsScanUi();
}

async function pollLyricsScanJob(jobId) {
  if (!jobId) return;
  if (state.lyricsScanPollTimer) clearTimeout(state.lyricsScanPollTimer);
  const job = await api(`/api/lyrics/scan/${jobId}`).catch(() => null);
  if (job) state.lyricsScanJob = job;
  await refreshLyricsScanStatus();
  if (job && ["queued", "running"].includes(job.status)) {
    state.lyricsScanPollTimer = setTimeout(() => pollLyricsScanJob(jobId), 1500);
    return;
  }
  const library = await api("/api/library/tracks").catch(() => null);
  if (library?.tracks) {
    state.tracks = library.tracks;
    markTracksChanged();
    applyLibraryFilterSettings({
      field: state.libraryFilterField,
      value: state.libraryFilterValue,
      sort: state.librarySort
    });
  }
  await refreshLyricsScanStatus();
  renderAll();
}

async function startLyricsScan() {
  const button = $("[data-scan-lyrics-library]");
  if (button) button.disabled = true;
  try {
    const active = lyricsScanActionJob();
    if (active?.id && ["queued", "running"].includes(active.status)) {
      pollLyricsScanJob(active.id);
      return;
    }
    state.lyricsScanJob = {
      status: "queued",
      done: 0,
      total: Number(state.lyricsScanStatus?.cachedTracks || state.tracks.length || 0),
      skipped: 0,
      synced: 0,
      plainOnly: 0
    };
    updateLyricsScanUi();
    const payload = await api("/api/lyrics/scan", {
      method: "POST",
      body: JSON.stringify({ limit: 0 })
    });
    state.lyricsScanJob = payload.job;
    updateLyricsScanUi();
    if (payload.job?.id && ["queued", "running"].includes(payload.job.status)) {
      pollLyricsScanJob(payload.job.id);
    } else {
      await refreshLyricsScanStatus();
      renderAll();
    }
  } catch (error) {
    state.lyricsScanJob = null;
    updateLyricsScanUi();
    alert(error.message);
  }
}

async function startPlexAuth() {
  if (browserOnlyPlaybackActive()) {
    state.plexAuthCollapsed = false;
    state.plexAuth = {
      pending: false,
      id: "",
      code: "",
      authUrl: "",
      status: "Plex sign-in needs VoidFM's server helper, which GitHub Pages cannot run. Paste your Plex server URL and X-Plex-Token instead."
    };
    renderSettings();
    return;
  }
  if (plexAuthPollTimer) clearTimeout(plexAuthPollTimer);
  state.plexAuthCollapsed = false;
  state.plexAuth = { pending: true, id: "", code: "", authUrl: "", status: "Requesting Plex sign-in..." };
  renderSettings();
  try {
    const pin = await api("/api/plex/auth/start", { method: "POST", body: "{}" });
    state.plexAuth = {
      pending: true,
      id: String(pin.id || ""),
      code: String(pin.code || ""),
      authUrl: String(pin.authUrl || pin.linkUrl || ""),
      status: "Open the Plex sign-in link, approve VoidFM, then this panel will update."
    };
    renderSettings();
    pollPlexAuth(pin.id, 0);
  } catch (error) {
    state.plexAuth = { pending: false, id: "", code: "", authUrl: "", status: error.message || "Plex sign-in failed." };
    renderSettings();
  }
}

function pollPlexAuth(pinId, attempt) {
  if (!pinId || state.plexAuth.id !== String(pinId)) return;
  plexAuthPollTimer = setTimeout(async () => {
    try {
      const payload = await api(`/api/plex/auth/poll?id=${encodeURIComponent(pinId)}`);
      if (payload.authorized) {
        if (payload.settings) {
          state.settings = payload.settings;
          state.settings.eq = normalizeEqSettings(payload.settings.eq);
          applyAccentColor(state.settings.accentColor);
        }
        if (payload.configured || payload.settings?.configured) {
          state.plexAuth = { pending: false, id: "", code: "", authUrl: "", status: "Plex sign-in complete." };
          const sections = await api("/api/library/sections").catch(() => null);
          if (sections?.sections) state.sections = sections.sections;
          showToast("Plex sign-in complete.");
        } else {
          const resourceNote = payload.resourceError ? ` ${payload.resourceError}` : "";
          state.plexAuth = {
            pending: false,
            id: "",
            code: "",
            authUrl: "",
            status: `Plex approved and token saved. Enter your Plex server URL to finish.${resourceNote}`
          };
          showToast("Plex token saved. Plex URL needed.");
        }
        renderAll();
        return;
      }
      state.plexAuth.status = "Waiting for Plex approval...";
      renderSettings();
      if (attempt < 240) pollPlexAuth(pinId, attempt + 1);
      else {
        state.plexAuth = { pending: false, id: "", code: "", authUrl: "", status: "Plex sign-in timed out." };
        renderSettings();
      }
    } catch (error) {
      state.plexAuth = { pending: false, id: "", code: "", authUrl: "", status: error.message || "Plex sign-in failed." };
      renderSettings();
    }
  }, attempt ? 2500 : 1200);
}

async function createPlaylistFromSelection() {
  openPlaylistAddDialog();
}

async function addBlock(targetType, trackId) {
  const track = trackById(trackId);
  if (!track) return;
  const targetName = targetType === "artist" ? track.artist : targetType === "album" ? track.album : track.title;
  const targetId = targetType === "track" ? track.id : "";
  const candidate = { targetType, targetId, targetName };
  const label = targetType === "artist" ? "That artist" : targetType === "album" ? "That album" : "That song";
  if ((targetType === "track" && isBlocked(track)) || blacklistRuleExists(candidate)) {
    showToast(`${label} is already blocked.`);
    return;
  }
  const rule = await api("/api/blacklist", {
    method: "POST",
    body: JSON.stringify({ targetType, targetId, targetName })
  });
  const appended = appendBlacklistRule(rule);
  if (rule.alreadyExists || !appended) {
    showToast(`${label} is already blocked.`);
    if (appended) {
      markBlacklistChanged();
      renderAll();
    }
    return;
  }
  markBlacklistChanged();
  renderAll();
  showToast(`${label} blocked.`);
}

function bindAudioEvents(player) {
  const traceMediaEvent = (eventName) => {
    const track = player === audio ? currentTrack() : state.queue.find((item) => standbyAudioPreload.trackId === item.id) || null;
    playbackTrace(`audio-${eventName}`, {
      trackId: track?.id || "",
      active: player === audio,
      standby: standbyAudioPreload.player === player,
      readyState: player.readyState,
      networkState: player.networkState,
      currentTimeMs: Number.isFinite(player.currentTime) ? Math.round(player.currentTime * 1000) : 0,
      src: player.currentSrc || player.src || ""
    });
  };
  ["loadstart", "loadedmetadata", "canplay", "playing", "waiting", "stalled", "suspend"].forEach((eventName) => {
    player.addEventListener(eventName, () => {
      if (player !== audio && standbyAudioPreload.player !== player) return;
      traceMediaEvent(eventName);
      if ((eventName === "waiting" || eventName === "stalled") && isDirectPlexStreamSrc(player.currentSrc || player.src || "")) {
        const directTrack = player === audio
          ? currentTrack()
          : state.queue.find((item) => standbyAudioPreload.trackId === item.id) || null;
        if (fallbackDirectAudioToProxy(player, directTrack, `direct-${eventName}`)) return;
      }
      if (eventName === "playing" && player === audio) {
        clearPlaybackStartGuard();
        clearPlaybackRecoveryTimer();
        finishPlaybackHandoff();
      }
    });
  });
  player.addEventListener("timeupdate", () => {
    if (player !== audio) return;
    if (maybeApplyAbLoop()) return;
    if (maybeFinishPlaybackWindow()) return;
    maybeScrobbleCurrent();
    renderProgress();
    schedulePlaybackSave();
    maybeStartCrossfade();
  });
  player.addEventListener("ended", () => {
    handleAudioEnded(player);
  });
  player.addEventListener("play", () => {
    if (player !== audio || state.crossfadeTimer) return;
    if (player.readyState >= 3) finishAudioTransition();
    state.isPlaying = true;
    schedulePlaybackSave();
    renderPlayer();
  });
  player.addEventListener("pause", () => {
    if (player !== audio) return;
    clearPlaybackStartGuard();
    clearPlaybackRecoveryTimer();
    if (state.audioTransitioning) {
      state.audioTransitioning = false;
      schedulePlaybackSave();
      renderPlayer();
      return;
    }
    if (!state.fakeTimer) state.isPlaying = false;
    schedulePlaybackSave();
    renderPlayer();
  });
  player.addEventListener("error", () => {
    if (player !== audio) {
      const standbyTrack = state.queue.find((item) => standbyAudioPreload.trackId === item.id) || null;
      if (fallbackDirectAudioToProxy(player, standbyTrack, "direct-standby-error")) return;
      if (standbyAudioPreload.player === player) clearStandbyAudioPreload();
      return;
    }
    const track = currentTrack();
    console.warn("Audio element error:", player.error?.message || player.error?.code || "unknown");
    clearFakeTimer();
    playbackTrace("stream-error", {
      trackId: track?.id || "",
      code: player.error?.code || "",
      message: player.error?.message || ""
    });
    if (fallbackDirectAudioToProxy(player, track, "direct-active-error")) return;
    if (track && recoverAudioStreamError(track, player.error, "stream-error")) return;
    finishAudioTransition();
    state.isPlaying = false;
    showToast(track ? "Audio stream stalled or failed. Skipping to the next song." : "Audio stream failed.");
    schedulePlaybackSave();
    renderPlaybackSurfaces();
  });
}

function wireEvents() {
  document.body.addEventListener("dragstart", (event) => {
    const item = playlistReorderElement(event.target);
    if (item) {
      const playlistId = item.dataset.playlistReorderId || "";
      if (!playlistById(playlistId)) return;
      playlistDragState.sourceId = playlistId;
      playlistDragState.targetId = "";
      playlistDragState.position = "";
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", playlistId);
      }
      syncPlaylistDragClasses();
      return;
    }

    const libraryItem = libraryDragElement(event.target);
    if (!libraryItem) return;
    const type = libraryItem.dataset.libraryDragType || "";
    const id = libraryItem.dataset.libraryDragId || "";
    const trackIds = uniqueTrackIds(trackIdsForLibraryDrag(type, id));
    if (!trackIds.length) return;
    libraryDragState.type = type;
    libraryDragState.id = id;
    libraryDragState.trackIds = trackIds;
    libraryDragState.label = labelForLibraryDrag(type, id, trackIds);
    libraryDragState.targetPlaylistId = "";
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = "copy";
      event.dataTransfer.setData("text/plain", libraryDragState.label);
    }
    syncLibraryDragClasses();
  });

  document.body.addEventListener("dragover", (event) => {
    if (playlistDragState.sourceId) {
      const item = playlistReorderElement(event.target);
      if (!item) return;
      const targetId = item.dataset.playlistReorderId || "";
      if (!targetId || targetId === playlistDragState.sourceId) {
        setPlaylistDragTarget("", "");
        return;
      }
      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
      setPlaylistDragTarget(targetId, playlistDropPosition(event, item));
      return;
    }

    if (libraryDragState.trackIds.length) {
      const item = playlistDropElement(event.target);
      const playlistId = item?.dataset.playlistDropId || "";
      if (!playlistId || !playlistById(playlistId)) {
        setLibraryDropTarget("");
        return;
      }
      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
      setLibraryDropTarget(playlistId);
    }
  });

  document.body.addEventListener("drop", async (event) => {
    if (playlistDragState.sourceId) {
      const item = playlistReorderElement(event.target);
      const targetId = item?.dataset.playlistReorderId || "";
      const sourceId = playlistDragState.sourceId;
      const position = item ? playlistDropPosition(event, item) : playlistDragState.position;
      event.preventDefault();
      playlistDragState.lastDropAt = Date.now();
      clearPlaylistDragState();
      const next = reorderedPlaylists(sourceId, targetId, position);
      if (next) await savePlaylistOrder(next);
      return;
    }

    if (libraryDragState.trackIds.length) {
      const item = playlistDropElement(event.target);
      const playlistId = item?.dataset.playlistDropId || libraryDragState.targetPlaylistId;
      event.preventDefault();
      libraryDragState.lastDropAt = Date.now();
      try {
        await dropLibraryItemOnPlaylist(playlistId);
      } catch (error) {
        showToast(error.message || "Could not add songs to playlist.");
      } finally {
        clearLibraryDragState();
      }
    }
  });

  document.body.addEventListener("dragend", () => {
    clearPlaylistDragState();
    clearLibraryDragState();
  });

  document.body.addEventListener("pointerdown", (event) => {
    if (hasOpenContextMenu() && !event.target.closest(".app-context-menu")) {
      closeAllContextMenus();
      if (event.button === 2) {
        suppressNextOutsideContextMenu = true;
        window.setTimeout(() => {
          suppressNextOutsideContextMenu = false;
        }, 600);
      } else {
        event.preventDefault();
        event.stopPropagation();
        suppressNextContextDismissClick = true;
        window.setTimeout(() => {
          suppressNextContextDismissClick = false;
        }, 400);
      }
      return;
    }

    const launcherCollapse = event.target.closest("[data-ab-loop-launcher-collapse]");
    if (launcherCollapse) {
      event.preventDefault();
      event.stopPropagation();
      collapseAbLoopLauncher();
      return;
    }

    const marker = event.target.closest("[data-ab-loop-marker]");
    if (marker) {
      if (!state.abLoopPowerEnabled) return;
      event.preventDefault();
      state.abLoopMarkerDrag = marker.dataset.abLoopMarker || "";
      state.abLoopMarkerDragScope = marker.closest(".looper-advanced-waveform")
        ? "advanced"
        : marker.closest(".now-playing-timeline") ? "now-playing" : "main";
      const track = currentTrack();
      const dragWindow = state.abLoopMarkerDragScope === "advanced"
        ? abLoopAdvancedWindowForTrack(track)
        : timelineWindowForTrack(track);
      state.abLoopMarkerDragWindow = track ? { ...dragWindow, trackId: track.id } : null;
      marker.setPointerCapture?.(event.pointerId);
      return;
    }
    const progressInput = event.target.closest("#progressInput, [data-now-playing-progress]");
    if (progressInput) {
      beginTimelineScrub(progressInput, { pointer: true });
      return;
    }
    rememberTrackSelectionPointer(event);
  });

  document.body.addEventListener("pointermove", (event) => {
    if (!state.abLoopMarkerDrag) return;
    const timeline = state.abLoopMarkerDragScope === "advanced"
      ? $("#looperAdvancedMarkerLayer") || $(".looper-advanced-waveform")
      : state.abLoopMarkerDragScope === "now-playing"
        ? $("#nowPlayingAbLoopMarkerLayer") || $(".now-playing-timeline") || $("#progressScrubWrap")
        : $("#abLoopMarkerLayer") || $("#progressScrubWrap") || $(".now-playing-timeline");
    updateAbLoopPoint(state.abLoopMarkerDrag, timelinePointFromClientX(event.clientX, timeline, { allowEnd: true, window: state.abLoopMarkerDragWindow }));
  });

  document.body.addEventListener("pointerup", () => {
    const wasDragging = Boolean(state.abLoopMarkerDrag);
    state.abLoopMarkerDrag = "";
    state.abLoopMarkerDragScope = "";
    state.abLoopMarkerDragWindow = null;
    if (state.timelineScrub.active && state.timelineScrub.pointerActive) endTimelineScrub();
    if (wasDragging) renderProgress();
  });

  document.body.addEventListener("pointercancel", () => {
    const wasDragging = Boolean(state.abLoopMarkerDrag);
    state.abLoopMarkerDrag = "";
    state.abLoopMarkerDragScope = "";
    state.abLoopMarkerDragWindow = null;
    if (state.timelineScrub.active && state.timelineScrub.pointerActive) endTimelineScrub();
    if (wasDragging) renderProgress();
  });

  document.body.addEventListener("dblclick", (event) => {
    const row = event.target.closest(".track-row");
    if (!row || event.target.closest("button,input,label,select,textarea,a")) return;
    if (row.dataset.trackId) playTrack(row.dataset.trackId);
  });

  document.body.addEventListener("contextmenu", (event) => {
    if (suppressNextOutsideContextMenu) {
      suppressNextOutsideContextMenu = false;
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    if (hasOpenContextMenu() && !event.target.closest(".app-context-menu")) {
      if (event.target.matches("[data-close-context-menu]")) {
        event.preventDefault();
        event.stopPropagation();
        closeAllContextMenus();
        return;
      }
      closeAllContextMenus(false);
    }

    const advancedMarker = event.target.closest("[data-ab-loop-advanced-marker]");
    if (advancedMarker) {
      openAbLoopAdvancedMarkerMenu(event);
      return;
    }

    const pad = event.target.closest("[data-ab-loop-pad]");
    if (pad) {
      openAbLoopPadAssignmentMenu(event, Number(pad.dataset.abLoopPad || 0));
      return;
    }

    const savedLoop = event.target.closest("[data-ab-loop-load]");
    if (savedLoop) {
      openAbLoopSavedLoopMenu(event, savedLoop.dataset.abLoopLoad || "");
      return;
    }

    const shuffleContext = shuffleContextFromTarget(event.target);
    if (shuffleContext) {
      event.preventDefault();
      event.stopPropagation();
      openShuffleContextMenu(event, shuffleContext);
      return;
    }

    const context = trackContextFromTarget(event.target);
    if (!context?.trackId || !trackById(context.trackId)) return;
    event.preventDefault();
    event.stopPropagation();
    openTrackContextMenu(event, context);
  });

  document.body.addEventListener("wheel", (event) => {
    const waveform = event.target.closest?.("[data-ab-loop-advanced-waveform]");
    if (!waveform) return;
    event.preventDefault();
    zoomAbLoopAdvancedWaveform(event, waveform);
  }, { passive: false });

  document.body.addEventListener("click", async (event) => {
    if (suppressNextContextDismissClick && !event.target.closest(".app-context-menu")) {
      suppressNextContextDismissClick = false;
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    suppressNextContextDismissClick = false;

    if (event.target.matches("[data-close-plex-auth-help]")) {
      state.plexAuthHelpOpen = false;
      renderGlobalOverlays();
      return;
    }

    const advancedSet = event.target.closest("[data-ab-loop-advanced-set]");
    if (advancedSet) {
      setAbLoopAdvancedMarkerAs(advancedSet.dataset.abLoopAdvancedSet || "");
      return;
    }

    const advancedSeek = event.target.closest("[data-ab-loop-advanced-seek]");
    if (advancedSeek) {
      seekToAbLoopAdvancedMarker();
      return;
    }

    if (state.abLoopAdvanced.markerMenu.open && !event.target.closest(".looper-advanced-marker-menu") && !event.target.closest("[data-ab-loop-advanced-marker]")) {
      closeAbLoopAdvancedMarkerMenu();
      renderGlobalOverlays();
    }

    const padAssign = event.target.closest("[data-ab-loop-pad-assign]");
    if (padAssign) {
      await assignAbLoopPad(Number(padAssign.dataset.abLoopPadIndex || -1), padAssign.dataset.abLoopPadAssign || "");
      return;
    }

    const padClear = event.target.closest("[data-ab-loop-pad-clear]");
    if (padClear) {
      await assignAbLoopPad(Number(padClear.dataset.abLoopPadIndex || -1), "");
      return;
    }

    const padPlaysStep = event.target.closest("[data-ab-loop-pad-plays-step]");
    if (padPlaysStep) {
      const padIndex = Number(padPlaysStep.dataset.abLoopPadIndex || -1);
      const pad = currentTrackAbLoopPadLayout()[padIndex] || { plays: 1 };
      await setAbLoopPadPlays(padIndex, normalizeLoopPlayCount(pad.plays) + Number(padPlaysStep.dataset.abLoopPadPlaysStep || 0));
      return;
    }

    const loopEdit = event.target.closest("[data-ab-loop-edit]");
    if (loopEdit) {
      editSavedAbLoop(loopEdit.dataset.abLoopEdit || "");
      return;
    }

    const loopDelete = event.target.closest("[data-ab-loop-delete]");
    if (loopDelete) {
      await deleteSavedAbLoop(loopDelete.dataset.abLoopDelete || "");
      return;
    }

    if (state.abLoopPadAssignmentMenu.open && !event.target.closest(".ab-loop-pad-menu") && !event.target.closest("[data-ab-loop-pad]")) {
      closeAbLoopPadAssignmentMenu();
      renderAdvancedPlaybackPanel();
    }

    if (state.abLoopSavedLoopMenu.open && !event.target.closest(".ab-loop-saved-menu") && !event.target.closest("[data-ab-loop-load]")) {
      closeAbLoopSavedLoopMenu();
      renderAdvancedPlaybackPanel();
    }

    const advancedWaveform = event.target.closest("[data-ab-loop-advanced-waveform]");
    if (advancedWaveform && !event.target.closest("button,[data-ab-loop-marker],[data-ab-loop-advanced-marker]")) {
      setAbLoopAdvancedMarker(abLoopAdvancedTimeFromClientX(event.clientX, advancedWaveform));
      return;
    }

    const copyButton = event.target.closest("[data-copy-text]");
    if (copyButton) {
      try {
        await navigator.clipboard.writeText(copyButton.dataset.copyText || "");
        showToast("Pairing link copied.");
      } catch (_error) {
        showToast("Could not copy text.");
      }
      return;
    }

    const queueMenuAction = event.target.closest("[data-queue-menu-action]");
    if (queueMenuAction) {
      handleQueueContextMenuAction(queueMenuAction.dataset.queueMenuAction || "");
      return;
    }

    const queueMenuTrigger = event.target.closest("[data-queue-menu-trigger]");
    if (queueMenuTrigger) {
      openQueueContextMenu(queueMenuTrigger);
      return;
    }

    const shuffleMenuAction = event.target.closest("[data-shuffle-menu-profile]");
    if (shuffleMenuAction) {
      await handleShuffleContextMenuProfile(shuffleMenuAction.dataset.shuffleMenuProfile || "");
      return;
    }

    const contextAction = event.target.closest("[data-context-action]");
    if (contextAction) {
      await handleTrackContextMenuAction(contextAction.dataset.contextAction);
      return;
    }

    if (event.target.matches("[data-close-context-menu]")) {
      closeAllContextMenus();
      return;
    }

    if (hasOpenContextMenu() && !event.target.closest(".app-context-menu")) {
      closeAllContextMenus();
    }

    if (state.abLoopMenuOpen && !event.target.closest(".ab-loop-active-wrap") && !event.target.closest("[data-ab-loop-active-menu]")) {
      state.abLoopMenuOpen = false;
      renderAdvancedPlaybackPanel();
    }

    if (event.target.matches("[data-select-track]")) {
      handleTrackSelection(event.target, consumeTrackSelectionRangeIntent(event.target, event));
      return;
    }

    const clickedRuleRow = event.target.closest("[data-shuffle-rule-row]");
    if (clickedRuleRow && !event.target.closest("button,label,input,select")) {
      setSelectedShuffleRule(Number(clickedRuleRow.dataset.ruleIndex || 0));
      return;
    }

    if (event.target.matches(".playlist-add-backdrop")) {
      closePlaylistAddDialog();
      return;
    }

    if (event.target.matches(".queue-playlist-backdrop")) {
      closeQueuePlaylistDialog();
      return;
    }

    if (event.target.matches(".ab-loop-save-backdrop")) {
      closeAbLoopSaveDialog();
      return;
    }

    if (event.target.matches(".shuffle-save-backdrop")) {
      closeShuffleSaveDialog();
      return;
    }

    if (event.target.matches(".confirm-backdrop")) {
      closeConfirmDialog();
      return;
    }

    if (event.target.matches(".playlist-track-editor-backdrop")) {
      closePlaylistTrackDialog();
      renderActiveView();
      return;
    }

    if (event.target.matches(".track-info-backdrop")) {
      closeTrackInfoDialog();
      return;
    }

    if (event.target.matches(".year-review-backdrop") || event.target.matches("[data-close-year-review]")) {
      await closeYearReview();
      return;
    }

    if (event.target.matches(".playlist-window-backdrop")) {
      navigateWithHistory(() => {
        state.playlistSettingsId = "";
        renderActiveView();
      }, { resetScroll: false });
      return;
    }

    const playlistCard = event.target.closest?.(".playlist-card[data-open-playlist]");
    if (playlistCard && !event.target.closest("button, a, input, select, textarea, label, [data-shuffle-menu-playlist]")) {
      if (Date.now() - playlistDragState.lastDropAt < 350) return;
      navigateWithHistory(() => openPlaylist(playlistCard.dataset.openPlaylist));
      return;
    }

    const button = event.target.closest("button");
    if (!button) return;
    if (Date.now() - libraryDragState.lastDropAt < 350) return;

    if (button.dataset.ruleEditorStrictness) {
      const group = button.closest(".segmented-control");
      group?.querySelectorAll("[data-rule-editor-strictness]").forEach((item) => {
        const active = item === button;
        item.classList.toggle("active-primary", active);
        item.setAttribute("aria-pressed", active ? "true" : "false");
      });
      updateSelectedRuleFromInspector(button);
      return;
    }

    if (button.dataset.ruleLibraryFilter) {
      state.ruleLibraryFilter = RULE_LIBRARY_FILTERS.some(([value]) => value === button.dataset.ruleLibraryFilter)
        ? button.dataset.ruleLibraryFilter
        : "all";
      button.closest(".rule-filter-pills")?.querySelectorAll("[data-rule-library-filter]").forEach((item) => {
        item.classList.toggle("active", item === button);
      });
      applyRuleLibrarySearch($("[data-rule-search]")?.value || "");
      return;
    }

    if (button.hasAttribute("data-apply-settings")) {
      await withSavingFeedback(button, () => applyConnectionSettings(), {
        button,
        successToast: "Settings saved."
      });
      return;
    }

    if (button.dataset.action === "back") {
      goBack();
      return;
    }
    if (button.dataset.action === "forward") {
      goForward();
      return;
    }

    if (button.hasAttribute("data-close-year-review")) {
      await closeYearReview();
      return;
    }
    if (button.dataset.openYearReview) {
      await openYearReview({ year: button.dataset.openYearReview });
      return;
    }
    if (button.dataset.yearReviewSlide !== undefined) {
      await setYearReviewSlide(button.dataset.yearReviewSlide);
      return;
    }
    if (button.hasAttribute("data-year-review-prev")) {
      await setYearReviewSlide(state.yearReview.slideIndex - 1);
      return;
    }
    if (button.hasAttribute("data-year-review-next")) {
      const story = state.yearReview.story || buildYearReviewStory(state.yearReview.year);
      const slides = yearReviewSlides(story);
      if (state.yearReview.slideIndex >= slides.length - 1) await closeYearReview();
      else await setYearReviewSlide(state.yearReview.slideIndex + 1);
      return;
    }
    if (button.dataset.yearReviewOpenPlaylist) {
      const playlistId = button.dataset.yearReviewOpenPlaylist;
      await closeYearReview();
      navigateWithHistory(() => openPlaylist(playlistId));
      return;
    }

    if (button.id === "advancedPlayerButton") {
      toggleAdvancedPlaybackPanel();
      return;
    }
    if (button.dataset.playbackSpeedStep) {
      setPlaybackSpeedOffset(stepPlaybackSpeed(Number(button.dataset.playbackSpeedStep || 0)));
      return;
    }
    if (button.hasAttribute("data-playback-speed-reset")) {
      resetPlaybackSpeed();
      return;
    }
    if (button.dataset.sleepTimerStep) {
      stepSleepTimer(Number(button.dataset.sleepTimerStep || 0));
      return;
    }
    if (button.hasAttribute("data-sleep-timer-reset")) {
      setSleepTimer(0);
      return;
    }
    if (button.dataset.pitchShiftStep) {
      setPitchShift(state.pitchShiftSemitones + Number(button.dataset.pitchShiftStep || 0));
      return;
    }
    if (button.hasAttribute("data-ab-loop-advanced-close")) {
      exitAbLoopAdvancedView();
      return;
    }
    if (button.hasAttribute("data-ab-loop-advanced-reset-zoom")) {
      resetAbLoopAdvancedZoom();
      syncAbLoopAdvancedView();
      return;
    }
    if (button.hasAttribute("data-ab-loop-set-a")) {
      setAbLoopPoint("a");
      return;
    }
    if (button.hasAttribute("data-ab-loop-set-b")) {
      setAbLoopPoint("b");
      return;
    }
    if (button.hasAttribute("data-ab-loop-clear")) {
      clearAbLoop();
      return;
    }
    if (button.hasAttribute("data-ab-loop-save")) {
      openAbLoopSaveDialog();
      return;
    }
    if (button.hasAttribute("data-ab-loop-power")) {
      toggleAbLoopPowerEnabled();
      return;
    }
    if (button.hasAttribute("data-ab-loop-queue-toggle")) {
      if (!abLoopControlsEnabled()) return;
      setAbLoopQueueEnabled(!state.abLoopQueueEnabled);
      return;
    }
    if (button.hasAttribute("data-ab-loop-advanced-toggle")) {
      if (!abLoopControlsEnabled()) return;
      if (state.view === AB_LOOP_ADVANCED_VIEW) exitAbLoopAdvancedView();
      else openAbLoopAdvancedView();
      return;
    }
    if (button.hasAttribute("data-ab-loop-launcher-collapse")) {
      collapseAbLoopLauncher();
      return;
    }
    if (button.dataset.abLoopPad !== undefined) {
      launchAbLoopPad(Number(button.dataset.abLoopPad || 0));
      return;
    }
    if (button.hasAttribute("data-ab-loop-active-menu")) {
      if (!state.abLoopPowerEnabled || !currentTrackSavedAbLoops().length) return;
      state.abLoopMenuOpen = !state.abLoopMenuOpen;
      renderAdvancedPlaybackPanel();
      return;
    }
    if (button.dataset.abLoopLoad) {
      loadSavedAbLoop(button.dataset.abLoopLoad);
      return;
    }
    if (button.id === "playerArt") {
      openNowPlayingMode();
      return;
    }
    if (button.hasAttribute("data-close-now-playing")) {
      closeNowPlayingMode();
      return;
    }
    if (button.dataset.nowPlayingTab) {
      setNowPlayingTab(button.dataset.nowPlayingTab);
      return;
    }
    if (button.dataset.nowPlayingAction) {
      const action = button.dataset.nowPlayingAction;
      if (action === "shuffle") $("#shuffleButton")?.click();
      else if (action === "previous") previousTrack();
      else if (action === "play") togglePlay();
      else if (action === "next") nextTrack();
      else if (action === "repeat") $("#repeatButton")?.click();
      else if (action === "mute") toggleMute();
      else if (action === "advanced") toggleAdvancedPlaybackPanel();
      else if (action === "more" && currentTrack()) {
        openTrackContextMenu(event, {
          trackId: currentTrack().id,
          playlistId: "",
          queueIndex: state.currentIndex
        });
      }
      else if (action === "equalizer") {
        closeNowPlayingMode();
        navigateWithHistory(() => setView("equalizer"));
      }
      syncNowPlayingPlaybackControls();
      return;
    }

    if (button.dataset.eqMode) {
      await switchEqMode(button.dataset.eqMode);
      return;
    }
    if (button.hasAttribute("data-eq-reset")) {
      await resetCurrentEq();
      return;
    }
    if (button.hasAttribute("data-eq-save-preset")) {
      const name = prompt("Preset name");
      if (name === null) return;
      await saveCurrentEqPreset(name);
      return;
    }
    if (button.dataset.action === "export-eq-presets") {
      exportAdvancedEqPresets();
      return;
    }
    if (button.dataset.action === "import-eq-presets") {
      $("#eqPresetImportInput")?.click();
      return;
    }

    if (button.hasAttribute("data-clear-queue")) {
      setQueue([], -1, false);
      return;
    }
    if (button.hasAttribute("data-close-queue-playlist")) {
      closeQueuePlaylistDialog();
      return;
    }
    if (button.id === "lyricsButton") {
      showLyricsPanel();
      return;
    }
    if (button.id === "chordsButton") {
      showChordsPanel();
      return;
    }
    if (button.id === "equalizerButton") {
      navigateWithHistory(() => setView("equalizer"));
      return;
    }
    if (button.hasAttribute("data-hide-lyrics")) {
      hideLyricsPanel();
      return;
    }
    if (button.hasAttribute("data-popout-lyrics")) {
      openLyricsPopout();
      return;
    }
    if (button.hasAttribute("data-hide-chords")) {
      hideChordsPanel();
      return;
    }
    if (button.hasAttribute("data-clear-chords")) {
      clearChordsForCurrentTrack();
      return;
    }
    if (button.hasAttribute("data-popout-chords")) {
      openChordsPopout();
      return;
    }

    if (button.dataset.trackSearchPick) {
      const name = button.dataset.trackSearchPick;
      const track = trackById(button.dataset.trackId);
      const field = button.closest(".track-search-field");
      if (track && field) {
        const searchInput = field.querySelector(`[name="${name}Search"]`);
        const hiddenInput = field.querySelector(`[name="${name}Id"]`);
        const results = field.querySelector(`[data-track-search-results="${name}"]`);
        if (searchInput) searchInput.value = trackLabel(track);
        if (hiddenInput) hiddenInput.value = track.id;
        if (results) results.innerHTML = "";
      }
      return;
    }

    if (button.dataset.addSuggestedTrack) {
      const playlist = playlistById(button.dataset.playlistId);
      const trackId = button.dataset.addSuggestedTrack;
      if (!playlist || !trackById(trackId)) return;
      const result = await addTrackIdsToPlaylist(playlist, [trackId]);
      state.selectionAnchorId = "";
      showToast(playlistAddMessage(result.added, result.duplicate, result.total, result.playlist?.name || playlist.name));
      renderAll();
      return;
    }

    if (button.dataset.view) {
      navigateWithHistory(() => {
        if (button.dataset.view === "library") setLibraryView("home");
        else {
          if (button.dataset.view === "playlists") {
            state.activePlaylistId = "";
            state.playlistEditMode = false;
            state.selectedIds.clear();
            state.selectionAnchorId = "";
            markSelectionChanged();
          }
          setView(button.dataset.view);
        }
      });
      return;
    }
    if (button.dataset.libraryView) {
      navigateWithHistory(() => setLibraryView(button.dataset.libraryView));
      return;
    }
    if (button.dataset.viewArtist) {
      state.nowPlayingOpen = false;
      renderGlobalOverlays();
      navigateWithHistory(() => openArtist(button.dataset.viewArtist));
      return;
    }
    if (button.dataset.viewAlbum) {
      navigateWithHistory(() => openAlbum(button.dataset.viewAlbum));
      return;
    }
    if (button.dataset.openPlaylist) {
      if (Date.now() - playlistDragState.lastDropAt < 350) return;
      navigateWithHistory(() => openPlaylist(button.dataset.openPlaylist));
      return;
    }
    if (button.hasAttribute("data-playlist-detail-back")) {
      navigateWithHistory(() => {
        state.activePlaylistId = "";
        state.playlistEditMode = false;
        state.playlistQuery = "";
        state.selectedIds.clear();
        state.selectionAnchorId = "";
        markSelectionChanged();
        renderPlaylists();
      });
      return;
    }
    if (button.dataset.editPlaylistSettings) {
      navigateWithHistory(() => {
        state.playlistSettingsId = button.dataset.editPlaylistSettings;
        renderActiveView();
      }, { resetScroll: false });
      return;
    }
    if (button.dataset.editPlaylistTrack) {
      state.playlistTrackDialog = {
        playlistId: button.dataset.playlistId || button.closest(".playlist-track-row")?.dataset.playlistId || "",
        trackId: button.dataset.editPlaylistTrack
      };
      renderActiveView();
      return;
    }
    if (button.hasAttribute("data-close-playlist-settings")) {
      navigateWithHistory(() => {
        state.playlistSettingsId = "";
        renderActiveView();
      }, { resetScroll: false });
      return;
    }
    if (button.hasAttribute("data-close-playlist-track-editor")) {
      closePlaylistTrackDialog();
      renderActiveView();
      return;
    }
    if (button.hasAttribute("data-close-track-info")) {
      closeTrackInfoDialog();
      return;
    }
    if (button.hasAttribute("data-close-playlist-add")) {
      closePlaylistAddDialog();
      return;
    }
    if (button.hasAttribute("data-close-ab-loop-save")) {
      closeAbLoopSaveDialog();
      return;
    }
    if (button.hasAttribute("data-open-shuffle-save-dialog")) {
      openShuffleSaveDialog();
      return;
    }
    if (button.hasAttribute("data-close-shuffle-save-dialog")) {
      closeShuffleSaveDialog();
      return;
    }
    if (button.hasAttribute("data-close-confirm-dialog")) {
      closeConfirmDialog();
      return;
    }
    if (button.dataset.dismissRecoveryNotice !== undefined) {
      await dismissRecoveryNotice(button.dataset.dismissRecoveryNotice);
      return;
    }
    if (button.hasAttribute("data-dismiss-runtime-notice")) {
      state.runtimeWarningDismissed = true;
      renderGlobalOverlays();
      return;
    }
    if (button.dataset.addToExistingPlaylist) {
      await addPendingTracksToExistingPlaylist(button.dataset.addToExistingPlaylist);
      return;
    }
    if (button.hasAttribute("data-clear-playlist-duplicate")) {
      state.playlistAddDialog.status = "";
      state.playlistAddDialog.duplicatePlaylistId = "";
      renderGlobalOverlays();
      return;
    }
    if (button.hasAttribute("data-clear-playlist-photo")) {
      const form = button.closest("#playlistSettingsForm");
      const hidden = form?.querySelector('[name="photoDataUrl"]');
      const preview = form?.querySelector("[data-playlist-photo-preview]");
      if (hidden) hidden.value = "";
      if (preview) preview.setAttribute("style", preview.dataset.fallbackStyle || "");
    }
    if (button.dataset.exportPlaylist) exportPlaylist(button.dataset.exportPlaylist);
    if (button.dataset.confirmDeletePlaylist) {
      await deletePlaylist(button.dataset.confirmDeletePlaylist);
      return;
    }
    if (button.dataset.confirmDeleteShuffleProfile) {
      await deleteShuffleProfile(button.dataset.confirmDeleteShuffleProfile);
      return;
    }
    if (button.dataset.playTrack) playTrack(button.dataset.playTrack);
    if (button.dataset.queueIndex !== undefined) {
      setQueueWithSoftFade(state.queue.slice(), Number(button.dataset.queueIndex), true, state.queueContext, { reason: "queue-choice" });
    }
    if (button.dataset.playPlaylist) playPlaylist(button.dataset.playPlaylist);
    if (button.dataset.playShuffleProfile) playShuffleProfile(button.dataset.playShuffleProfile);
    if (button.dataset.exportShuffleProfile) exportShuffleProfile(button.dataset.exportShuffleProfile);
    if (button.dataset.blockTrack) await addBlock("track", button.dataset.blockTrack);
    if (button.dataset.blockArtist) await addBlock("artist", button.dataset.blockArtist);
    if (button.dataset.deleteBlock) {
      await api(`/api/blacklist/${button.dataset.deleteBlock}`, { method: "DELETE" });
      state.blacklist = state.blacklist.filter((rule) => rule.id !== button.dataset.deleteBlock);
      markBlacklistChanged();
      renderAll();
    }
    if (button.dataset.deleteLink) {
      await api(`/api/links/${button.dataset.deleteLink}`, { method: "DELETE" });
      state.links = state.links.filter((link) => link.id !== button.dataset.deleteLink);
      renderAll();
    }
    if (button.dataset.deletePlaylist) {
      openDeletePlaylistConfirm(button.dataset.deletePlaylist);
      return;
    }
    if (button.dataset.clearTrackTrim) {
      const playlistId = button.dataset.playlistId || button.closest(".playlist-track-row")?.dataset.playlistId || "";
      const trackId = button.dataset.clearTrackTrim;
      const track = trackById(trackId);
      await savePlaylistTrackTrim(playlistId, trackId, null);
      renderActiveView();
      showToast(track ? `Cleared trim for ${track.title}.` : "Cleared trim.");
      return;
    }
    if (button.dataset.clearEditorTrackTrim) {
      const playlistId = button.dataset.playlistId || button.closest("#playlistTrackEditorForm")?.dataset.playlistId || state.playlistTrackDialog.playlistId;
      const trackId = button.dataset.clearEditorTrackTrim;
      const track = trackById(trackId);
      await savePlaylistTrackTrim(playlistId, trackId, null);
      closePlaylistTrackDialog();
      renderActiveView();
      showToast(track ? `Cleared trim for ${track.title}.` : "Cleared trim.");
      return;
    }
    if (button.dataset.removePlaylistTrack) {
      const playlist = playlistById(button.dataset.playlistId);
      if (playlist) {
        const trackId = button.dataset.removePlaylistTrack;
        await savePlaylistTrackIds(playlist.id, playlist.trackIds.filter((id) => id !== trackId));
        state.selectedIds.delete(trackId);
        markSelectionChanged();
        renderAll();
      }
    }
    if (button.dataset.removeSelectedFromPlaylist) {
      const playlist = playlistById(button.dataset.removeSelectedFromPlaylist);
      if (playlist) {
        const selectedIds = selectedPlaylistTrackIdsForRemoval(playlist);
        if (!selectedIds.length) {
          showToast("Select tracks to remove from this playlist.");
          return;
        }
        const selected = new Set(selectedIds);
        await savePlaylistTrackIds(playlist.id, playlist.trackIds.filter((id) => !selected.has(id)));
        selectedIds.forEach((id) => state.selectedIds.delete(id));
        state.selectionAnchorId = "";
        markSelectionChanged();
        renderAll();
        showToast(`${selectedIds.length} song${selectedIds.length === 1 ? "" : "s"} removed from ${playlist.name}.`);
      }
    }
    if (button.dataset.deleteLocalLibrary) {
      const payload = await api(`/api/local-libraries/${encodeURIComponent(button.dataset.deleteLocalLibrary)}`, { method: "DELETE" });
      applyLibraryPayload(payload);
    }
    if (button.dataset.scanLocalLibrary) {
      button.disabled = true;
      try {
        const payload = await api(`/api/local-libraries/${encodeURIComponent(button.dataset.scanLocalLibrary)}/scan`, { method: "POST", body: "{}" });
        applyLibraryPayload(payload);
      } catch (error) {
        alert(error.message);
      } finally {
        button.disabled = false;
      }
    }
    if (button.hasAttribute("data-scan-local-libraries")) {
      button.disabled = true;
      try {
        const payload = await api("/api/local-libraries/scan", { method: "POST", body: "{}" });
        applyLibraryPayload(payload);
      } catch (error) {
        alert(error.message);
      } finally {
        button.disabled = false;
      }
    }
    if (button.dataset.useShuffleProfile) {
      state.activeShuffleProfileId = button.dataset.useShuffleProfile;
      resetWorkshopDraft();
      state.shuffle = true;
      if (state.queue.length) setQueue(buildSmartQueue(currentTrack()?.id), 0, state.isPlaying, shuffleQueueContext(activeShuffleProfile()));
      schedulePlaybackSave();
      renderAll();
    }
    if (button.dataset.editShuffleProfile) {
      state.activeShuffleProfileId = button.dataset.editShuffleProfile;
      resetWorkshopDraft();
      state.shuffle = true;
      state.selectedShuffleRuleIndex = 0;
      renderAll();
      $("#shuffleProfileForm")?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
    if (button.dataset.deleteShuffleProfile) {
      openDeleteShuffleProfileConfirm(button.dataset.deleteShuffleProfile);
      return;
    }
    if (button.dataset.saveShufflePreset) {
      const preset = SHUFFLE_PRESETS.find((item) => item.id === button.dataset.saveShufflePreset);
      if (preset) {
        const profile = await api("/api/shuffle-profiles", {
          method: "POST",
          body: JSON.stringify({
            name: preset.name,
            presetId: preset.id,
            schemaVersion: 2,
            rules: preset.rules
          })
        });
        state.customShuffles.unshift(profile);
        state.activeShuffleProfileId = profile.id;
        resetWorkshopDraft();
        state.shuffle = true;
        schedulePlaybackSave();
        renderAll();
      }
    }
    if (button.dataset.addPresetRule) {
      const preset = SHUFFLE_PRESETS.find((item) => item.id === button.dataset.addPresetRule);
      const list = $("[data-shuffle-rule-list]");
      if (preset && list) {
        for (const rule of preset.rules) {
          list.insertAdjacentHTML("beforeend", shuffleRuleRowHtml(rule, list.children.length));
        }
        setSelectedShuffleRule(list.children.length - 1, { clearPreview: true });
      }
    }
    if (button.hasAttribute("data-clear-flow")) {
      const list = $("[data-shuffle-rule-list]");
      if (list) list.innerHTML = "";
      syncShuffleFlowUi(0);
    }
    if (button.hasAttribute("data-remove-shuffle-rule")) {
      button.closest("[data-shuffle-rule-row]")?.remove();
      syncShuffleFlowUi(state.selectedShuffleRuleIndex);
    }
    if (button.dataset.inspectorTab) {
      state.shuffleInspectorTab = button.dataset.inspectorTab;
      renderShuffle();
    }
    if (button.hasAttribute("data-workshop-preview")) {
      previewWorkshopQueue();
    }
    if (button.hasAttribute("data-workshop-generate")) {
      runWorkshopQueue(true);
    }
    if (button.hasAttribute("data-enrich-library")) {
      await startMetadataEnrichment();
    }
    if (button.hasAttribute("data-scan-lyrics-library")) {
      await startLyricsScan();
    }
    if (button.hasAttribute("data-toggle-plex-auth")) {
      setPlexAuthCollapsed(!plexAuthCollapsed());
      return;
    }
    if (button.hasAttribute("data-open-plex-auth-help")) {
      state.plexAuthHelpOpen = true;
      renderGlobalOverlays();
      return;
    }
    if (button.hasAttribute("data-close-plex-auth-help")) {
      state.plexAuthHelpOpen = false;
      renderGlobalOverlays();
      return;
    }
    if (button.hasAttribute("data-plex-auth-start")) {
      await startPlexAuth();
      return;
    }
    if (button.hasAttribute("data-clear-shuffle-profile")) {
      state.activeShuffleProfileId = "";
      resetWorkshopDraft();
      if (state.queue.length) setQueue(buildSmartQueue(currentTrack()?.id), 0, state.isPlaying, { type: "", playlistId: "", shuffleProfileId: "", fadeSeconds: 0 });
      schedulePlaybackSave();
      renderAll();
    }
    if (button.dataset.action === "clear-library-filter") {
      state.libraryFilterField = "all";
      state.libraryFilterValue = "";
      state.librarySort = "titleAsc";
      state.selectionAnchorId = "";
      clearSavedLibraryFilterSettings();
      renderSurface();
      renderLibrary();
    }
    if (button.dataset.action === "close-playlist-detail") {
      navigateWithHistory(() => {
        state.activePlaylistId = "";
        state.playlistEditMode = false;
        state.playlistSettingsId = "";
        state.playlistQuery = "";
        state.selectedIds.clear();
        state.selectionAnchorId = "";
        markSelectionChanged();
        renderAll();
      });
      return;
    }
    if (button.dataset.action === "toggle-playlist-edit") {
      navigateWithHistory(() => {
        state.playlistEditMode = !state.playlistEditMode;
        state.selectionAnchorId = "";
        renderSurface();
        renderSidebarPlaylists();
        renderActiveView();
      }, { resetScroll: false });
      return;
    }
    if (button.dataset.action === "new-playlist") createPlaylistFromSelection();
    if (button.dataset.action === "export-library") exportLibraryTrackList();
    if (button.dataset.action === "export-user-data") await exportUserDataBackup(button);
    if (button.dataset.action === "open-backup-folder") await openBackupFolder(button);
    if (button.hasAttribute("data-browser-import-backup")) {
      $("[data-browser-import-backup-input]")?.click();
      return;
    }
    if (button.dataset.action === "import-playlists") $("#playlistImportInput")?.click();
    if (button.dataset.action === "export-shuffle-profile") exportShuffleProfile();
    if (button.dataset.action === "import-shuffle-profile") $("#shuffleProfileImportInput")?.click();
  });

  document.body.addEventListener("change", async (event) => {
    if (event.target.id === "playlistImportInput") {
      await importPlaylistFiles(event.target.files);
      event.target.value = "";
      return;
    }
    if (event.target.id === "shuffleProfileImportInput") {
      await importShuffleProfileFiles(event.target.files);
      event.target.value = "";
      return;
    }
    if (event.target.id === "eqPresetImportInput") {
      await importEqPresetFiles(event.target.files);
      event.target.value = "";
      return;
    }
    if (event.target.matches("[data-browser-import-backup-input]")) {
      const status = $("[data-import-user-data-status]");
      const file = event.target.files?.[0];
      if (!file) return;
      if (status) status.textContent = "Importing backup...";
      try {
        if (!window.VoidFMBrowserApi?.importBackupFile) throw new Error("Browser backup import is not available.");
        await window.VoidFMBrowserApi.importBackupFile(file);
      } catch (error) {
        if (status) status.textContent = error.message || "Could not import backup.";
        showToast(error.message || "Could not import backup.");
      } finally {
        event.target.value = "";
      }
      return;
    }
    if (event.target.matches("[data-ab-loop-time]")) {
      commitAbLoopTimeInput(event.target);
      return;
    }
    if (event.target.matches("[data-eq-preset-select]")) {
      await applyEqPresetSelection(event.target.value);
      return;
    }
    if (event.target.matches("[data-eq-auto-headroom], [data-eq-limiter], [data-eq-bypass]")) {
      const eq = eqSettings();
      if (event.target.matches("[data-eq-auto-headroom]")) {
        eq.autoHeadroom = event.target.checked;
        applyAutoHeadroom(eq, eq.mode);
      }
      if (event.target.matches("[data-eq-limiter]")) eq.limiter = event.target.checked;
      if (event.target.matches("[data-eq-bypass]")) eq.bypass = event.target.checked;
      setEqSettings(eq);
      applyEqSettingsToAudio();
      syncEqControls();
      scheduleEqSettingsSave();
      return;
    }
    if (event.target.matches("[data-playlist-photo-input]")) {
      const file = event.target.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        alert("Choose an image file for the playlist photo.");
        event.target.value = "";
        return;
      }
      try {
        const dataUrl = await readFileAsDataUrl(file);
        const form = event.target.closest("#playlistSettingsForm");
        const hidden = form?.querySelector('[name="photoDataUrl"]');
        const preview = form?.querySelector("[data-playlist-photo-preview]");
        if (hidden) hidden.value = dataUrl;
        if (preview) preview.setAttribute("style", playlistArtStyle({ photoDataUrl: dataUrl }));
      } catch (error) {
        alert(error.message);
      }
    }
    if (event.target.matches("[data-color-native], [data-color-hex], [data-color-rgb], [data-color-hsl]")) {
      syncPlaylistColorEditor(event.target);
      normalizePlaylistColorEditors(event.target.closest("[data-playlist-color-editor]"));
      return;
    }
    if (event.target.matches("[data-local-library-enabled]")) {
      const payload = await api(`/api/local-libraries/${encodeURIComponent(event.target.dataset.localLibraryEnabled)}`, {
        method: "PUT",
        body: JSON.stringify({ enabled: event.target.checked })
      });
      applyLibraryPayload(payload);
    }
    if (event.target.matches('#librarySectionsForm [name="musicSectionKeys"]')) {
      await saveSelectedPlexLibraries();
      return;
    }
    if (event.target.matches('#playbackBehaviorForm [name="softSkip"]')) {
      await setSoftSkip(event.target.checked);
      return;
    }
    if (event.target.matches('#chordSyncForm [name="onlineLookup"]')) {
      await saveChordSyncSetting(event.target.checked);
      return;
    }
    if (event.target.matches("[data-library-filter-field]")) {
      state.libraryFilterField = event.target.value;
      const options = filterValueOptions(state.libraryFilterField);
      state.libraryFilterValue = options[0]?.[0] || "";
      state.selectionAnchorId = "";
      saveLibraryFilterSettings();
      renderSurface();
      renderLibrary();
    }
    if (event.target.matches("[data-library-filter-value]")) {
      state.libraryFilterValue = event.target.value;
      state.selectionAnchorId = "";
      saveLibraryFilterSettings();
      renderSurface();
      renderLibrary();
    }
    if (event.target.matches("[data-library-sort]")) {
      state.librarySort = event.target.value;
      state.selectionAnchorId = "";
      saveLibraryFilterSettings();
      renderLibrary();
    }
    if (event.target.matches("[data-playlist-sort]")) {
      state.playlistSort = normalizePlaylistSort(event.target.value);
      state.selectionAnchorId = "";
      savePlaylistSortSettings();
      renderSurface();
      renderActiveView();
    }
    if (event.target.matches("[data-workshop-profile-select]")) {
      state.activeShuffleProfileId = event.target.value;
      resetWorkshopDraft();
      state.shuffle = Boolean(event.target.value);
      schedulePlaybackSave();
      renderAll();
    }
    if (event.target.matches('[name="ruleEnabled"]')) {
      const row = event.target.closest("[data-shuffle-rule-row]");
      if (row) setSelectedShuffleRule(Number(row.dataset.ruleIndex || 0), { clearPreview: true });
    }
    if (event.target.matches("[data-rule-editor-enabled]")) {
      updateSelectedRuleFromInspector(event.target);
    }
    if (event.target.matches("[data-rule-artist-same-album], [data-rule-title-ignore-the], [data-rule-title-pattern]")) {
      updateSelectedRuleFromInspector(event.target);
    }
    if (event.target.matches("[data-rule-title-order], [data-rule-energy-mode], [data-rule-release-mode], [data-rule-discovery-mode]")) {
      updateSelectedRuleFromInspector(event.target);
    }
    if (event.target.matches('[form="shuffleProfileForm"]')) {
      syncWorkshopDraftFromDom();
    }
  });

  document.body.addEventListener("input", (event) => {
    if (event.target.matches("[data-now-playing-progress]")) {
      updateTimelineScrubFromInput(event.target);
      return;
    }
    if (event.target.matches("[data-now-playing-volume]")) {
      applyVolume(event.target.value);
      if (state.volume > 0) setMuted(false);
      schedulePlaybackSave();
      return;
    }
    if (event.target.matches("[data-eq-band]")) {
      updateEqBand(event.target.dataset.eqBand, event.target.value);
      return;
    }
    if (event.target.matches("[data-eq-preamp]")) {
      updateEqPreamp(event.target.value);
      return;
    }
    if (event.target.matches('#accentForm [name="accentColor"]')) {
      applyAccentColor(event.target.value);
      scheduleAccentColorSave(event.target.value);
      return;
    }
    if (event.target.matches("[data-color-native], [data-color-hex], [data-color-rgb], [data-color-hsl]")) {
      syncPlaylistColorEditor(event.target);
      return;
    }
    if (event.target.matches("[data-track-search]")) {
      const name = event.target.dataset.trackSearch;
      const field = event.target.closest(".track-search-field");
      const hiddenInput = field?.querySelector(`[name="${name}Id"]`);
      if (hiddenInput) hiddenInput.value = "";
      renderTrackSearchResults(name, event.target.value);
    }
    if (event.target.matches("[data-playlist-search]")) {
      const selectionStart = event.target.selectionStart;
      const selectionEnd = event.target.selectionEnd;
      state.playlistQuery = event.target.value;
      state.selectionAnchorId = "";
      renderActiveView();
      const nextInput = $("[data-playlist-search]");
      if (nextInput) {
        nextInput.focus({ preventScroll: true });
        const start = Math.min(Number.isFinite(selectionStart) ? selectionStart : nextInput.value.length, nextInput.value.length);
        const end = Math.min(Number.isFinite(selectionEnd) ? selectionEnd : start, nextInput.value.length);
        nextInput.setSelectionRange(start, end);
      }
    }
    if (event.target.matches("[data-rule-search]")) {
      applyRuleLibrarySearch(event.target.value);
    }
    if (event.target.matches('[name="name"][form="shuffleProfileForm"], #shuffleProfileForm [name="name"]')) {
      updateWorkshopSaveButton();
    }
    if (event.target.matches('[form="shuffleProfileForm"]')) {
      syncWorkshopDraftFromDom();
    }
    if (event.target.matches("[data-rule-editor-value], [data-rule-editor-number], [data-rule-artist-cooldown], [data-rule-energy-segment], [data-rule-energy-threshold], [data-rule-release-date], [data-rule-discovery-max-plays], [data-rule-artist-same-gap], [data-rule-artist-rival-gap], [data-rule-artist-rival-groups], [data-rule-genre-flow-genres], [data-rule-genre-flow-count], [data-rule-genre-flow-blocked], [data-rule-mood-theme-terms]")) {
      updateSelectedRuleFromInspector(event.target);
    }
  });

  document.body.addEventListener("change", (event) => {
    if (event.target.matches("#progressInput, [data-now-playing-progress]")) {
      endTimelineScrub();
    }
  });

  document.body.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (event.target.matches("[data-chord-import-form]")) {
      await withSavingFeedback(event.target, async () => {
        const form = new FormData(event.target);
        await saveManualChordsForCurrentTrack(form.get("sheetText"));
      }, { successToast: "Chord sheet saved." });
      return;
    }

    if (event.target.id === "eqPresetForm") {
      await withSavingFeedback(event.target, async () => {
        const form = new FormData(event.target);
        await saveCurrentEqPreset(form.get("eqPresetName"));
      });
      return;
    }

    if (event.target.id === "settingsForm") {
      await withSavingFeedback(event.target, () => applyConnectionSettings(), { successToast: "Settings saved." });
      return;
    }

    if (event.target.id === "accentForm") {
      await withSavingFeedback(event.target, async () => {
        const form = new FormData(event.target);
        if (accentColorSaveTimer) clearTimeout(accentColorSaveTimer);
        accentColorSaveTimer = 0;
        await saveAccentColor(form.get("accentColor"));
      }, { successToast: "Accent color saved." });
      return;
    }

    if (event.target.id === "playbackBehaviorForm") {
      await withSavingFeedback(event.target, async () => {
        const form = new FormData(event.target);
        await setSoftSkip(form.has("softSkip"));
      }, { successToast: "Playback setting saved." });
      return;
    }

    if (event.target.id === "chordSyncForm") {
      await withSavingFeedback(event.target, async () => {
        const form = new FormData(event.target);
        await saveChordSyncSetting(form.has("onlineLookup"));
      }, { successToast: "Chord setting saved." });
      return;
    }

    if (event.target.id === "librarySectionsForm") {
      await withSavingFeedback(event.target, () => saveSelectedPlexLibraries(), { successToast: "Library settings saved." });
      return;
    }

    if (event.target.id === "localLibraryForm") {
      await withSavingFeedback(event.target, async () => {
        const form = new FormData(event.target);
        const payload = await api("/api/local-libraries", {
          method: "POST",
          body: JSON.stringify({
            name: form.get("name"),
            path: form.get("path")
          })
        });
        event.target.reset();
        applyLibraryPayload(payload);
      }, { successToast: "Local library saved." });
      return;
    }

    if (event.target.id === "metadataProviderForm") {
      await withSavingFeedback(event.target, async () => {
        const form = new FormData(event.target);
        await saveSettingsPatch({
          musicBrainzContact: form.get("musicBrainzContact"),
          metadataProviders: {
            musicBrainz: form.has("musicBrainz"),
            acousticBrainz: form.has("acousticBrainz"),
            listenBrainz: form.has("listenBrainz")
          }
        });
        state.metadataStatus = await api("/api/metadata/status").catch(() => state.metadataStatus);
        renderAll();
      }, { successToast: "Metadata settings saved." });
      return;
    }

    if (event.target.id === "shuffleSaveDialogForm") {
      await withSavingFeedback(event.target, async () => {
        const form = new FormData(event.target);
        await saveWorkshopPresetWithName(form.get("shufflePresetName"));
      });
      return;
    }

    if (event.target.id === "abLoopSaveForm") {
      await withSavingFeedback(event.target, async () => {
        const form = new FormData(event.target);
        await saveCurrentAbLoop(form.get("abLoopName"));
      });
      return;
    }

    if (event.target.id === "shuffleProfileForm") {
      openShuffleSaveDialog();
      return;
    }

    if (event.target.id === "playlistAddForm") {
      await withSavingFeedback(event.target, async () => {
        const form = new FormData(event.target);
        const trackIds = uniqueTrackIds(state.playlistAddDialog.trackIds);
        const playlistId = String(form.get("playlistId") || "");
        const newName = cleanText(form.get("newPlaylistName"));
        if (!trackIds.length) {
          state.playlistAddDialog.status = "Select songs or build a queue first.";
          renderGlobalOverlays();
          return;
        }
        if (!newName && !playlistId) {
          state.playlistAddDialog.status = "Choose a playlist or enter a new playlist name.";
          renderGlobalOverlays();
          return;
        }

        let message = "";
        if (newName) {
          const duplicatePlaylist = playlistByName(newName);
          if (duplicatePlaylist) {
            state.playlistAddDialog.status = `A playlist named "${duplicatePlaylist.name}" already exists. Add these songs to that playlist instead?`;
            state.playlistAddDialog.duplicatePlaylistId = duplicatePlaylist.id;
            renderGlobalOverlays();
            return;
          }
          const playlist = await api("/api/playlists", {
            method: "POST",
            body: JSON.stringify({ name: newName, trackIds })
          });
          state.playlists.unshift(playlist);
          markPlaylistsChanged();
          message = playlistAddMessage(trackIds.length, 0, trackIds.length, playlist.name);
        } else {
          const playlist = playlistById(playlistId);
          if (!playlist) {
            state.playlistAddDialog.status = "Choose an existing playlist.";
            renderGlobalOverlays();
            return;
          }
          const result = await addTrackIdsToPlaylist(playlist, trackIds);
          message = playlistAddMessage(result.added, result.duplicate, result.total, result.playlist?.name || playlist.name);
          markPlaylistsChanged();
        }

        state.selectedIds.clear();
        state.selectionAnchorId = "";
        markSelectionChanged();
        closePlaylistAddDialog();
        renderAll();
        showToast(message);
      });
      return;
    }

    if (event.target.id === "queuePlaylistForm") {
      await withSavingFeedback(event.target, async () => {
        const form = new FormData(event.target);
        await createPlaylistFromQueue(form.get("queuePlaylistName"));
      });
      return;
    }

    if (event.target.id === "playlistTrackForm") {
      await withSavingFeedback(event.target, async () => {
        const form = new FormData(event.target);
        const playlist = playlistById(event.target.dataset.playlistId);
        const pickedTrack = trackById(String(form.get("playlistTrackId") || ""))
          || trackBySearchText(form.get("playlistTrackSearch"));
        const trackId = pickedTrack?.id || "";
        if (!playlist) return;
        if (!trackId) {
          showToast("Choose a track from the search results first.");
          return;
        }
        const result = await addTrackIdsToPlaylist(playlist, [trackId]);
        state.selectionAnchorId = "";
        showToast(playlistAddMessage(result.added, result.duplicate, result.total, result.playlist?.name || playlist.name));
        renderAll();
      });
      return;
    }

    if (event.target.id === "playlistSettingsForm") {
      await withSavingFeedback(event.target, async () => {
        normalizePlaylistColorEditors(event.target);
        const form = new FormData(event.target);
        const playlistId = event.target.dataset.playlistId;
        await savePlaylistSettings(playlistId, {
          name: form.get("name"),
          photoDataUrl: form.get("photoDataUrl"),
          defaultShuffleProfileId: form.get("defaultShuffleProfileId"),
          defaultEqPreset: form.get("defaultEqPreset"),
          fadeSeconds: normalizeFadeSeconds(form.get("fadeSeconds")),
          textColor: form.has("useTextColor") ? optionalHex(form.get("textColor")) : "",
          highlightColor: form.has("useHighlightColor") ? optionalHex(form.get("highlightColor")) : ""
        });
        state.playlistSettingsId = "";
        renderAll();
      }, { successToast: "Playlist saved." });
      return;
    }

    if (event.target.id === "playlistTrackEditorForm") {
      await withSavingFeedback(event.target, async () => {
        const form = new FormData(event.target);
        const playlistId = event.target.dataset.playlistId || "";
        const trackId = event.target.dataset.trackId || "";
        const track = trackById(trackId);
        if (!playlistById(playlistId) || !track) return;
        const start = parseTrimTimeInput(form.get("startTime"));
        const end = parseTrimTimeInput(form.get("endTime"));
        if (!start.ok || !end.ok) {
          showToast("Use times like 0:18, 2:45, or 18.");
          return;
        }
        const duration = durationForTrack(track);
        let startMs = start.ms;
        let endMs = end.ms;
        if (duration > 0 && startMs >= duration) {
          showToast("Start time must be before the song ends.");
          return;
        }
        if (duration > 0 && endMs > duration) endMs = duration;
        if (endMs > 0 && endMs <= startMs) {
          showToast("End time must be after the start time.");
          return;
        }
        const trim = normalizeTrackTrim({ startMs, endMs }, duration);
        await savePlaylistTrackTrim(playlistId, trackId, trim);
        closePlaylistTrackDialog();
        renderAll();
        showToast(trim ? `Saved trim for ${track.title}.` : `Cleared trim for ${track.title}.`);
      });
      return;
    }

    if (event.target.id === "linkForm") {
      await withSavingFeedback(event.target, async () => {
        const form = new FormData(event.target);
        const triggerId = String(form.get("triggerId") || "");
        const nextId = String(form.get("nextId") || "");
        if (!triggerId || !nextId) {
          alert("Search and choose both songs first.");
          return;
        }
        if (triggerId === nextId) {
          alert("Choose two different songs.");
          return;
        }
        const link = await api("/api/links", {
          method: "POST",
          body: JSON.stringify({
            triggerId,
            nextId
          })
        });
        if (!state.links.some((item) => item.id === link.id)) state.links.push(link);
        renderAll();
      }, { successToast: "Linked song saved." });
      return;
    }
  });

  $("#searchInput").addEventListener("input", (event) => {
    state.query = event.target.value;
    state.selectionAnchorId = "";
    if (state.query.trim()) routeGlobalSearchToLibrary();
    renderLibrary();
    renderSurface();
  });

  $("#refreshButton").addEventListener("click", refreshLibrary);
  $("#playAllButton").addEventListener("click", () => {
    const sourceTracks = currentSurfaceTracks();
    setQueueWithSoftFade(
      buildSmartQueue(null, currentSurfaceQueueBuildOptions({ sourceTracks, forceShuffle: state.shuffle })),
      0,
      true,
      currentSurfaceQueueContext(),
      { reason: "play-all-choice" }
    );
  });
  $("#shuffleAllButton").addEventListener("click", (event) => {
    if (event.shiftKey) cycleShuffleProfile();
    state.shuffle = true;
    setQueueWithSoftFade(
      buildSmartQueue(null, currentSurfaceQueueBuildOptions({
        sourceTracks: currentSurfaceTracks(),
        forceShuffle: true,
        ...(event.shiftKey ? { profile: activeShuffleProfile() } : {})
      })),
      0,
      true,
      currentSurfaceQueueContext(),
      { reason: "shuffle-all-choice" }
    );
  });
  $("#playlistFromSelectedButton").addEventListener("click", createPlaylistFromSelection);
  $("#playButton").addEventListener("click", togglePlay);
  $("#nextButton").addEventListener("click", nextTrack);
  $("#previousButton").addEventListener("click", previousTrack);
  $("#shuffleButton").addEventListener("click", (event) => {
    if (event.shiftKey) {
      cycleShuffleProfile();
      const activeProfile = activeShuffleProfile();
      const context = state.queueContext?.type === "playlist" && state.queueContext.playlistId
        ? playlistQueueContext(playlistById(state.queueContext.playlistId), activeProfile?.id || "")
        : shuffleQueueContext(activeProfile);
      if (state.queue.length) setQueue(buildSmartQueue(currentTrack()?.id, queueContextBuildOptions(context)), 0, state.isPlaying, context);
      renderPlayer();
      return;
    }
    state.shuffle = !state.shuffle;
    const context = state.queueContext?.type === "playlist"
      ? state.queueContext
      : state.shuffle ? shuffleQueueContext(activeShuffleProfile()) : { type: "", playlistId: "", shuffleProfileId: "", fadeSeconds: 0 };
    if (state.queue.length) setQueue(buildSmartQueue(currentTrack()?.id, queueContextBuildOptions(context)), 0, state.isPlaying, context);
    schedulePlaybackSave();
    renderPlayer();
  });
  $("#repeatButton").addEventListener("click", () => {
    state.repeat = state.repeat === "off" ? "all" : state.repeat === "all" ? "one" : "off";
    schedulePlaybackSave();
    renderPlayer();
  });
  $("#progressInput").addEventListener("input", (event) => {
    updateTimelineScrubFromInput(event.target);
  });
  $("#volumeInput").addEventListener("input", (event) => {
    applyVolume(event.target.value);
    if (state.volume > 0) setMuted(false);
    schedulePlaybackSave();
  });
  $("#muteButton").addEventListener("click", toggleMute);

  bindAudioEvents(primaryAudio);
  bindAudioEvents(secondaryAudio);
  wireMediaSession();
  window.addEventListener("message", (event) => {
    if (event.origin === window.location.origin && event.data?.type === "voidfm:lyrics-ready") {
      broadcastLyricsState();
    }
    if (event.origin === window.location.origin && event.data?.type === "voidfm:chords-ready") {
      broadcastChordsState();
    }
  });
  window.addEventListener("keydown", (event) => {
    if (event.target instanceof HTMLInputElement && event.target.matches("[data-ab-loop-time]")) {
      if (event.key === "Enter") {
        event.preventDefault();
        event.target.blur();
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        resetAbLoopTimeInput(event.target);
        event.target.blur();
        return;
      }
    }
    if (handleMediaKeyDown(event)) return;
    if (handleYearReviewHotkey(event)) return;
    if (event.key === "Escape" && state.yearReview.open) {
      closeYearReview();
      return;
    }
    if (event.key === "Escape" && (state.contextMenu.open || state.shuffleContextMenu.open || state.queueContextMenu.open)) {
      closeAllContextMenus();
      return;
    }
    if (event.key === "Escape" && state.abLoopPadAssignmentMenu.open) {
      closeAbLoopPadAssignmentMenu();
      renderAdvancedPlaybackPanel();
      return;
    }
    if (event.key === "Escape" && state.abLoopSavedLoopMenu.open) {
      closeAbLoopSavedLoopMenu();
      renderAdvancedPlaybackPanel();
      return;
    }
    if (event.key === "Escape" && state.abLoopAdvanced.markerMenu.open) {
      closeAbLoopAdvancedMarkerMenu();
      renderGlobalOverlays();
      return;
    }
    if (event.key === "Escape" && state.trackInfoDialog.trackId) {
      closeTrackInfoDialog();
      return;
    }
    if (event.key === "Escape" && state.shuffleSaveDialog.open) {
      closeShuffleSaveDialog();
      return;
    }
    if (event.key === "Escape" && state.view === AB_LOOP_ADVANCED_VIEW) {
      exitAbLoopAdvancedView();
      return;
    }
    if (event.key === "Escape" && state.nowPlayingOpen) {
      closeNowPlayingMode();
    }
  });
  window.addEventListener("resize", () => closeAllContextMenus());
  window.addEventListener("beforeunload", () => {
    savePlaybackNow();
    flushPlaybackTrace({ beacon: true });
  });
  window.addEventListener("pagehide", () => {
    savePlaybackNow();
    flushPlaybackTrace({ beacon: true });
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      savePlaybackNow();
      flushPlaybackTrace({ beacon: true });
    }
  });
}

setupButtonClickFeedback();
setupDesktopTitlebar();
renderNav();
wireEvents();
if (STARTUP_LOADER_PREVIEW) {
  window.__VOIDFM_READY__ = true;
} else {
  loadInitialData().catch((error) => {
    showStartupLoaderError(error);
  });
}
