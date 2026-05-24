const clips = {
  day: document.querySelector('[data-clip="day"]'),
  night: document.querySelector('[data-clip="night"]'),
};

const stage = document.querySelector('.video-stage');
const projectBack = document.querySelector('#projectBack');
const centerPlay = document.querySelector('#centerPlay');
const playToggle = document.querySelector('#playToggle');
const switchMode = document.querySelector('#switchMode');
const muteToggle = document.querySelector('#muteToggle');
const fullscreenToggle = document.querySelector('#fullscreenToggle');
const volumeSlider = document.querySelector('#volumeSlider');
const timeline = document.querySelector('#timeline');
const timeReadout = document.querySelector('#timeReadout');
const modeStatus = document.querySelector('#modeStatus');

const state = {
  active: 'day',
  muted: false,
  volume: 1,
  previousVolume: 1,
  seeking: false,
  ready: false,
};

const SYNC_TOLERANCE = 0.08;
const SOFT_SYNC_TOLERANCE = 0.026;
const TOGGLE_SYNC_TOLERANCE = 0.045;

function otherMode(mode = state.active) {
  return mode === 'day' ? 'night' : 'day';
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return '0:00';
  }

  const total = Math.floor(seconds);
  const minutes = Math.floor(total / 60);
  const remainder = String(total % 60).padStart(2, '0');
  return `${minutes}:${remainder}`;
}

function activeClip() {
  return clips[state.active];
}

function inactiveClip() {
  return clips[otherMode()];
}

function syncMuteState() {
  const effectiveMuted = state.muted || state.volume === 0;

  clips.day.volume = state.volume;
  clips.night.volume = state.volume;
  clips.day.muted = effectiveMuted || state.active !== 'day';
  clips.night.muted = effectiveMuted || state.active !== 'night';

  muteToggle.classList.toggle('is-muted', state.muted);
  muteToggle.setAttribute('aria-label', state.muted ? 'Unmute' : 'Mute');
  volumeSlider.value = String(state.volume);
  volumeSlider.style.setProperty('--volume', `${state.volume * 100}%`);
}

function syncPlayUi() {
  const playing = !activeClip().paused && !activeClip().ended;
  document.body.classList.toggle('is-playing', playing);
  centerPlay.classList.toggle('is-hidden', playing);
  playToggle.setAttribute('aria-label', playing ? 'Pause' : 'Play');
  centerPlay.setAttribute('aria-label', playing ? 'Pause' : 'Play');
}

function setMode(nextMode) {
  if (!clips[nextMode] || nextMode === state.active) {
    return;
  }

  const from = activeClip();
  const to = clips[nextMode];
  const targetTime = from.currentTime || 0;
  const wasPlaying = !from.paused && !from.ended;

  if (Math.abs(to.currentTime - targetTime) > TOGGLE_SYNC_TOLERANCE) {
    to.currentTime = targetTime;
  }

  clips[state.active].classList.remove('is-active');
  to.classList.add('is-active');
  state.active = nextMode;
  document.body.dataset.mode = nextMode;
  modeStatus.textContent = `${nextMode === 'day' ? 'Day' : 'Night'} mode`;
  syncMuteState();

  if (wasPlaying && to.paused) {
    to.play().catch(() => {
      syncPlayUi();
    });
  }

  syncPlayUi();
}

async function playBoth() {
  const targetTime = activeClip().currentTime || 0;

  for (const clip of Object.values(clips)) {
    if (Math.abs(clip.currentTime - targetTime) > TOGGLE_SYNC_TOLERANCE) {
      clip.currentTime = targetTime;
    }
  }

  syncMuteState();
  await Promise.allSettled(Object.values(clips).map((clip) => clip.play()));
  syncPlayUi();
}

function pauseBoth() {
  Object.values(clips).forEach((clip) => clip.pause());
  syncPlayUi();
}

function togglePlay() {
  if (activeClip().paused || activeClip().ended) {
    playBoth();
  } else {
    pauseBoth();
  }
}

function toggleMode() {
  setMode(otherMode());
}

function seekTo(seconds) {
  Object.values(clips).forEach((clip) => {
    if (Number.isFinite(clip.duration)) {
      clip.currentTime = Math.min(seconds, clip.duration);
    }
  });
}

function updateTimeline() {
  if (!state.seeking) {
    const clip = activeClip();
    const duration = clip.duration || 0;
    const current = clip.currentTime || 0;
    const progress = duration ? (current / duration) * 100 : 0;

    timeline.value = duration ? Math.round((current / duration) * 1000) : 0;
    timeline.style.setProperty('--progress', `${progress}%`);
    const readableTime = formatTime(current);
    timeReadout.value = readableTime;
    timeReadout.textContent = readableTime;
  }

  requestAnimationFrame(updateTimeline);
}

function syncHiddenClip() {
  const master = activeClip();
  const follower = inactiveClip();

  if (!master || !follower || master.readyState < 2 || follower.readyState < 2) {
    return;
  }

  if (master.paused || master.ended) {
    follower.pause();
    follower.currentTime = master.currentTime;
    follower.playbackRate = master.playbackRate;
    return;
  }

  if (follower.paused) {
    follower.play().catch(() => {});
  }

  const drift = master.currentTime - follower.currentTime;

  if (Math.abs(drift) > SYNC_TOLERANCE) {
    follower.currentTime = master.currentTime;
    follower.playbackRate = master.playbackRate;
    return;
  }

  if (Math.abs(drift) > SOFT_SYNC_TOLERANCE) {
    follower.playbackRate = Math.min(1.06, Math.max(0.94, master.playbackRate + drift * 0.35));
  } else {
    follower.playbackRate = master.playbackRate;
  }
}

function wireClipEvents(clip) {
  clip.addEventListener('play', syncPlayUi);
  clip.addEventListener('pause', syncPlayUi);
  clip.addEventListener('ended', () => {
    pauseBoth();
    syncPlayUi();
  });
}

function markReadyWhenLoaded() {
  const canPlay = Object.values(clips).every((clip) => clip.readyState >= 3);
  state.ready = canPlay;
  centerPlay.disabled = !canPlay;
  playToggle.disabled = !canPlay;
}

Object.values(clips).forEach((clip) => {
  clip.controls = false;
  clip.preload = 'auto';
  wireClipEvents(clip);
  clip.addEventListener('canplay', markReadyWhenLoaded);
  clip.addEventListener('loadedmetadata', markReadyWhenLoaded);
  clip.load();
});

centerPlay.disabled = true;
playToggle.disabled = true;
syncMuteState();
syncPlayUi();
markReadyWhenLoaded();
setInterval(syncHiddenClip, 180);
requestAnimationFrame(updateTimeline);

centerPlay.addEventListener('click', togglePlay);
playToggle.addEventListener('click', togglePlay);
switchMode.addEventListener('click', toggleMode);

muteToggle.addEventListener('click', () => {
  if (state.muted || state.volume === 0) {
    state.muted = false;
    state.volume = state.previousVolume || 1;
  } else {
    state.previousVolume = state.volume;
    state.muted = true;
  }

  syncMuteState();
});

volumeSlider.addEventListener('input', () => {
  const nextVolume = Number(volumeSlider.value);

  state.volume = Number.isFinite(nextVolume) ? nextVolume : 1;
  state.muted = state.volume === 0;

  if (state.volume > 0) {
    state.previousVolume = state.volume;
  }

  syncMuteState();
});

fullscreenToggle.addEventListener('click', () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    stage.requestFullscreen();
  }
});

timeline.addEventListener('input', () => {
  state.seeking = true;
  const percent = Number(timeline.value) / 1000;
  const duration = activeClip().duration || 0;
  const previewTime = duration * percent;

  timeline.style.setProperty('--progress', `${percent * 100}%`);
  const readableTime = formatTime(previewTime);
  timeReadout.value = readableTime;
  timeReadout.textContent = readableTime;
});

timeline.addEventListener('change', () => {
  const percent = Number(timeline.value) / 1000;
  const duration = activeClip().duration || 0;
  seekTo(duration * percent);
  state.seeking = false;
  syncHiddenClip();
});

window.addEventListener('keydown', (event) => {
  const tag = event.target.tagName.toLowerCase();

  if (tag === 'input' || tag === 'textarea' || event.target.isContentEditable) {
    return;
  }

  if (event.key.toLowerCase() === 'r') {
    event.preventDefault();
    toggleMode();
    return;
  }

  if (event.code === 'Space') {
    event.preventDefault();
    togglePlay();
  }
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    pauseBoth();
  }
});

window.addEventListener('load', () => {
  setTimeout(() => {
    projectBack.classList.add('is-dimmed');
  }, 5000);
});
