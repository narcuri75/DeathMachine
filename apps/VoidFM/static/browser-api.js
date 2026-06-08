(function () {
  "use strict";

  const DB_NAME = "voidfm-browser";
  const DB_VERSION = 1;
  const APP_VERSION = "20260605-cleanup-normalizers";
  const STATIC_CACHE = "voidfm-static-v3";
  const AUDIO_EXTENSIONS = new Set(["mp3", "flac", "m4a", "aac", "wav", "ogg", "opus", "wma", "aif", "aiff"]);
  const originalFetch = window.fetch.bind(window);
  const objectUrls = new Map();
  let dbPromise = null;

  function uuid(prefix = "id") {
    if (crypto?.randomUUID) return crypto.randomUUID();
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  }

  function now() {
    return new Date().toISOString();
  }

  function jsonResponse(payload, status = 200) {
    return new Response(JSON.stringify(payload), {
      status,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store"
      }
    });
  }

  function textError(message, status = 400, detail = "") {
    return jsonResponse({ error: message, detail: detail || message }, status);
  }

  function parseBody(options = {}) {
    const body = options.body;
    if (!body) return Promise.resolve({});
    if (typeof body === "string") {
      try {
        return Promise.resolve(JSON.parse(body || "{}"));
      } catch {
        return Promise.resolve({});
      }
    }
    if (body instanceof Blob) {
      return body.text().then((text) => {
        try {
          return JSON.parse(text || "{}");
        } catch {
          return {};
        }
      });
    }
    return Promise.resolve(body && typeof body === "object" ? body : {});
  }

  function defaultEq() {
    return {
      mode: "standard",
      standardPresetName: "Flat",
      standardPresetId: "",
      advancedPresetName: "Flat",
      advancedPresetId: "",
      standard: {},
      advanced: {},
      preamp: 0,
      bypass: false,
      autoHeadroom: true,
      limiter: true,
      userPresets: [],
      playlistDefaults: {}
    };
  }

  function defaultDb() {
    return {
      settings: {
        configured: false,
        plexBaseUrl: "",
        plexToken: "",
        tokenSet: false,
        plexPlaybackMode: "auto",
        musicSectionKeys: [],
        localLibraries: [],
        accentColor: "#7d3cff",
        musicBrainzContact: "",
        metadataProviders: { musicBrainz: true, acousticBrainz: true, listenBrainz: true },
        eq: defaultEq(),
        advancedPlayback: { softSkip: false, softSkipConfigured: false, abLoops: [], abLoopPadLayouts: {} },
        chordSync: { onlineLookup: false, analysisFallback: false },
        clientId: `voidfm-${uuid("client")}`
      },
      playlists: [],
      customShuffles: [],
      blacklist: [],
      links: [],
      tracks: [],
      sections: [],
      localHandles: {},
      metadata: { tracks: {}, manual: {}, lyrics: {}, chords: {}, lastEnrichedAt: null, lastLyricsScannedAt: null },
      playbackState: {
        trackId: "",
        queueIds: [],
        currentIndex: -1,
        currentTime: 0,
        volume: 0.5,
        muted: false,
        shuffle: true,
        repeat: "all",
        activeShuffleProfileId: "",
        queueContext: { type: "", playlistId: "", shuffleProfileId: "", fadeSeconds: 0 },
        updatedAt: null
      },
      listeningStats: {},
      listeningEvents: [],
      diagnostics: [],
      updatedAt: now()
    };
  }

  function openDb() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        request.result.createObjectStore("state");
      };
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
    return dbPromise;
  }

  async function idbGet(key) {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("state", "readonly");
      const request = tx.objectStore("state").get(key);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async function idbSet(key, value) {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("state", "readwrite");
      const request = tx.objectStore("state").put(value, key);
      request.onerror = () => reject(request.error);
      tx.oncomplete = () => resolve(value);
    });
  }

  async function loadDb() {
    const stored = await idbGet("db");
    const merged = mergeDb(defaultDb(), stored || {});
    merged.settings.localLibraries = (merged.settings.localLibraries || []).filter((library) => !String(library.id || "").startsWith("file-import"));
    merged.tracks = (merged.tracks || []).filter((track) => !String(track.localLibraryId || "").startsWith("file-import"));
    await refreshLocalObjectUrls(merged);
    return merged;
  }

  async function saveDb(db) {
    db.updatedAt = now();
    await idbSet("db", db);
    return db;
  }

  function mergeDb(base, stored) {
    return {
      ...base,
      ...stored,
      settings: { ...base.settings, ...(stored.settings || {}) },
      metadata: { ...base.metadata, ...(stored.metadata || {}) },
      playbackState: { ...base.playbackState, ...(stored.playbackState || {}) },
      playlists: Array.isArray(stored.playlists) ? stored.playlists : base.playlists,
      customShuffles: Array.isArray(stored.customShuffles) ? stored.customShuffles : base.customShuffles,
      blacklist: Array.isArray(stored.blacklist) ? stored.blacklist : base.blacklist,
      links: Array.isArray(stored.links) ? stored.links : base.links,
      tracks: Array.isArray(stored.tracks) ? stored.tracks : base.tracks,
      sections: Array.isArray(stored.sections) ? stored.sections : base.sections,
      localHandles: stored.localHandles && typeof stored.localHandles === "object" ? stored.localHandles : {}
    };
  }

  function publicSettings(db) {
    const settings = db.settings || {};
    const plexBaseUrl = normalizeBaseUrl(settings.plexBaseUrl || "");
    return {
      configured: Boolean(plexBaseUrl && settings.plexToken),
      plexBaseUrl,
      tokenSet: Boolean(settings.plexToken || settings.tokenSet),
      plexPlaybackMode: "auto",
      musicSectionKeys: Array.isArray(settings.musicSectionKeys) ? settings.musicSectionKeys : [],
      localLibraries: Array.isArray(settings.localLibraries) ? settings.localLibraries : [],
      accentColor: settings.accentColor || "#7d3cff",
      musicBrainzContact: settings.musicBrainzContact || "",
      metadataProviders: { musicBrainz: true, acousticBrainz: true, listenBrainz: true, ...(settings.metadataProviders || {}) },
      eq: { ...defaultEq(), ...(settings.eq || {}) },
      advancedPlayback: settings.advancedPlayback || { softSkip: false, softSkipConfigured: false, abLoops: [], abLoopPadLayouts: {} },
      chordSync: { onlineLookup: false, analysisFallback: false, ...(settings.chordSync || {}) },
      clientId: settings.clientId || `voidfm-${uuid("client")}`,
      lastSyncedAt: db.lastSyncedAt || null,
      cachedTracks: visibleTracks(db).length,
      lastPlexRefreshStartedAt: db.lastPlexRefreshStartedAt || null,
      lastPlexRefreshFinishedAt: db.lastPlexRefreshFinishedAt || null,
      lastPlexRefreshError: db.lastPlexRefreshError || "",
      recoveryNotice: null
    };
  }

  function normalizeBaseUrl(value) {
    const raw = String(value || "").trim();
    if (!raw) return "";
    try {
      const url = new URL(raw);
      url.pathname = url.pathname.replace(/\/+$/, "");
      url.search = "";
      url.hash = "";
      return url.toString().replace(/\/$/, "");
    } catch {
      return raw.replace(/\/+$/, "");
    }
  }

  function plexUrl(db, path, params = {}) {
    const base = normalizeBaseUrl(db.settings.plexBaseUrl || "");
    if (!base) throw new Error("Plex URL is not configured.");
    const url = new URL(path, `${base}/`);
    const token = db.settings.plexToken || "";
    if (token) url.searchParams.set("X-Plex-Token", token);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, String(value));
    });
    return url.toString();
  }

  async function plexFetchJson(db, path, params = {}) {
    const response = await originalFetch(plexUrl(db, path, params), {
      headers: {
        "Accept": "application/json",
        "X-Plex-Product": "VoidFM",
        "X-Plex-Client-Identifier": db.settings.clientId || "voidfm-browser"
      },
      cache: "no-store"
    });
    if (!response.ok) throw new Error(`Plex request failed (${response.status}). Browser direct mode may be blocked by CORS or network access.`);
    return response.json();
  }

  function plexItems(payload) {
    return payload?.MediaContainer?.Metadata || payload?.MediaContainer?.Directory || [];
  }

  function normalizeSection(section) {
    return {
      key: String(section.key || ""),
      title: String(section.title || section.name || "Music"),
      type: String(section.type || "artist"),
      trackCount: Number(section.leafCount || section.trackCount || 0)
    };
  }

  function normalizePlexTrack(item, section = {}) {
    const media = Array.isArray(item.Media) ? item.Media[0] || {} : {};
    const part = Array.isArray(media.Part) ? media.Part[0] || {} : {};
    const id = `plex-${item.ratingKey || item.key || uuid("plex")}`;
    const durationMs = Number(item.duration || media.duration || 0);
    return {
      id,
      ratingKey: String(item.ratingKey || id),
      source: "plex",
      title: String(item.title || "Unknown Title"),
      artist: String(item.grandparentTitle || item.originalTitle || item.artist || "Unknown Artist"),
      album: String(item.parentTitle || item.album || "Unknown Album"),
      albumArtist: String(item.parentTitle ? item.grandparentTitle || "" : item.albumArtist || ""),
      year: Number(item.year || 0) || null,
      duration: durationMs,
      durationMs,
      thumb: item.thumb || item.parentThumb || item.grandparentThumb || "",
      art: item.art || "",
      streamKey: part.key || item.key || "",
      key: item.key || "",
      fileType: String(part.container || media.container || "").toLowerCase(),
      audioCodec: String(media.audioCodec || part.audioCodec || "").toLowerCase(),
      sectionKey: String(section.key || item.librarySectionID || ""),
      sectionTitle: String(section.title || item.librarySectionTitle || "Plex"),
      dateAdded: item.addedAt ? new Date(Number(item.addedAt) * 1000).toISOString() : "",
      updatedAt: item.updatedAt ? new Date(Number(item.updatedAt) * 1000).toISOString() : now(),
      genres: Array.isArray(item.Genre) ? item.Genre.map((genre) => genre.tag).filter(Boolean) : []
    };
  }

  function absolutizePlexMediaFields(db, track) {
    const next = { ...track };
    for (const key of ["thumb", "art"]) {
      if (next[key] && !/^(https?:|blob:|data:)/i.test(next[key])) {
        try {
          next[key] = plexUrl(db, next[key]);
        } catch {}
      }
    }
    return next;
  }

  async function refreshPlex(db) {
    db.lastPlexRefreshStartedAt = now();
    db.lastPlexRefreshError = "";
    try {
      const sectionsPayload = await plexFetchJson(db, "/library/sections");
      const sections = plexItems(sectionsPayload)
        .map(normalizeSection)
        .filter((section) => section.key && (!section.type || section.type === "artist"));
      db.sections = sections;
      const selected = new Set((db.settings.musicSectionKeys || []).map(String));
      const activeSections = sections.filter((section) => !selected.size || selected.has(String(section.key)));
      const tracks = [];
      for (const section of activeSections) {
        const payload = await plexFetchJson(db, `/library/sections/${encodeURIComponent(section.key)}/all`, { type: 10 });
        tracks.push(...plexItems(payload).map((item) => absolutizePlexMediaFields(db, normalizePlexTrack(item, section))));
      }
      db.tracks = [...db.tracks.filter((track) => track.source !== "plex"), ...tracks];
      db.lastPlexRefreshFinishedAt = now();
      db.lastSyncedAt = db.lastPlexRefreshFinishedAt;
    } catch (error) {
      db.lastPlexRefreshError = error.message || "Plex direct browser refresh failed.";
      db.lastPlexRefreshFinishedAt = now();
      throw error;
    } finally {
      await saveDb(db);
    }
    return libraryPayload(db);
  }

  function repairTrackDuration(track) {
    const durationMs = Number(track?.durationMs || 0);
    const duration = Number(track?.duration || 0);
    if (durationMs > 0 && (!duration || duration < durationMs / 10)) {
      return { ...track, duration: durationMs };
    }
    return track;
  }

  function repairCachedDurations(db) {
    let changed = false;
    db.tracks = (db.tracks || []).map((track) => {
      const repaired = repairTrackDuration(track);
      if (repaired !== track) changed = true;
      return repaired;
    });
    return changed;
  }

  function lyricsDurationSeconds(track = {}) {
    const durationMs = Number(track.durationMs || 0);
    const duration = Number(track.duration || 0);
    const ms = durationMs || (duration > 1000 ? duration : duration * 1000);
    return ms > 0 ? Math.round(ms / 1000) : 0;
  }

  function parseSyncedLyrics(text = "") {
    return String(text || "")
      .split(/\r?\n/)
      .flatMap((line) => {
        const lyric = line.replace(/\[[0-9:.]+\]/g, "").trim();
        const matches = [...line.matchAll(/\[(\d{1,2}):(\d{2})(?:[.:](\d{1,3}))?\]/g)];
        return matches.map((match) => {
          const minutes = Number(match[1] || 0);
          const seconds = Number(match[2] || 0);
          const fraction = String(match[3] || "0").padEnd(3, "0").slice(0, 3);
          return { timeMs: (minutes * 60 + seconds) * 1000 + Number(fraction), text: lyric };
        });
      })
      .filter((line) => line.text)
      .sort((a, b) => a.timeMs - b.timeMs);
  }

  function normalizeLyricsResult(result, track) {
    const syncedLines = parseSyncedLyrics(result?.syncedLyrics || "");
    const plainLyrics = String(result?.plainLyrics || "").trim();
    const searchedAt = now();
    if (syncedLines.length) {
      return {
        status: "available",
        provider: "lrclib",
        lookupVersion: 3,
        searchedAt,
        syncedLines,
        plainLyrics,
        source: result?.source || "lrclib"
      };
    }
    if (plainLyrics) {
      return {
        status: "plain_only",
        provider: "lrclib",
        lookupVersion: 3,
        searchedAt,
        plainLyrics,
        syncedLines: [],
        source: result?.source || "lrclib"
      };
    }
    return {
      status: track?.fileType === "instrumental" ? "instrumental" : "not_found",
      provider: "lrclib",
      lookupVersion: 3,
      searchedAt,
      syncedLines: [],
      plainLyrics: ""
    };
  }

  async function fetchLrclibLyrics(track) {
    const title = String(track?.title || "").trim();
    const artist = String(track?.artist || "").trim();
    if (!title || !artist) return normalizeLyricsResult(null, track);
    const album = String(track?.album || "").trim();
    const duration = lyricsDurationSeconds(track);
    const exact = new URL("https://lrclib.net/api/get");
    exact.searchParams.set("track_name", title);
    exact.searchParams.set("artist_name", artist);
    if (album) exact.searchParams.set("album_name", album);
    if (duration) exact.searchParams.set("duration", String(duration));
    let response = await originalFetch(exact.toString(), { headers: { "Accept": "application/json" }, cache: "no-store" });
    if (response.ok) return normalizeLyricsResult(await response.json(), track);
    const search = new URL("https://lrclib.net/api/search");
    search.searchParams.set("track_name", title);
    search.searchParams.set("artist_name", artist);
    if (album) search.searchParams.set("album_name", album);
    response = await originalFetch(search.toString(), { headers: { "Accept": "application/json" }, cache: "no-store" });
    if (!response.ok) throw new Error(`Lyrics lookup failed (${response.status}).`);
    const results = await response.json();
    const items = Array.isArray(results) ? results : [];
    const titleLower = title.toLowerCase();
    const artistLower = artist.toLowerCase();
    const best = items.find((item) => String(item.trackName || "").toLowerCase() === titleLower
      && String(item.artistName || "").toLowerCase() === artistLower)
      || items[0];
    return normalizeLyricsResult(best, track);
  }

  async function lookupAndCacheLyrics(db, trackId) {
    const track = visibleTracks(db).find((item) => item.id === trackId || item.ratingKey === trackId) || { id: trackId };
    let lyrics;
    try {
      lyrics = await fetchLrclibLyrics(track);
    } catch (error) {
      lyrics = {
        status: "error",
        provider: "lrclib",
        lookupVersion: 3,
        searchedAt: now(),
        detail: error.message || "Lyrics lookup failed in this browser.",
        syncedLines: [],
        plainLyrics: ""
      };
    }
    db.metadata.lyrics = db.metadata.lyrics || {};
    db.metadata.lyrics[trackId] = lyrics;
    await saveDb(db);
    return { lyrics, track };
  }

  function visibleTracks(db) {
    repairCachedDurations(db);
    const enabled = new Set((db.settings.localLibraries || []).filter((library) => library.enabled !== false).map((library) => library.id));
    return (db.tracks || []).filter((track) => track.source !== "local" || enabled.has(track.localLibraryId));
  }

  function applyMetadata(db, track) {
    const meta = db.metadata?.manual?.[track.id] || db.metadata?.tracks?.[track.id] || {};
    return { ...track, ...meta };
  }

  function libraryPayload(db) {
    return {
      tracks: visibleTracks(db).map((track) => applyMetadata(db, track)),
      settings: publicSettings(db),
      sections: db.sections || [],
      demo: visibleTracks(db).length === 0,
      plexError: db.lastPlexRefreshError || "",
      sectionErrors: {},
      lastPlexRefreshStartedAt: db.lastPlexRefreshStartedAt || null,
      lastPlexRefreshFinishedAt: db.lastPlexRefreshFinishedAt || null
    };
  }

  async function getFileFromHandle(handle) {
    try {
      if (!handle) return null;
      const permission = await handle.queryPermission?.({ mode: "read" });
      if (permission !== "granted") {
        const requested = await handle.requestPermission?.({ mode: "read" });
        if (requested !== "granted") return null;
      }
      return await handle.getFile();
    } catch {
      return null;
    }
  }

  async function scanDirectoryHandle(directoryHandle, library) {
    const tracks = [];
    let index = 0;
    async function walk(dir, parts = []) {
      for await (const entry of dir.values()) {
        if (entry.kind === "directory") {
          await walk(entry, [...parts, entry.name]);
          continue;
        }
        const ext = entry.name.split(".").pop().toLowerCase();
        if (!AUDIO_EXTENSIONS.has(ext)) continue;
        const file = await entry.getFile();
        const id = `local-${library.id}-${index++}`;
        if (objectUrls.has(id)) URL.revokeObjectURL(objectUrls.get(id));
        const objectUrl = URL.createObjectURL(file);
        objectUrls.set(id, objectUrl);
        const title = entry.name.replace(/\.[^.]+$/, "");
        tracks.push({
          id,
          source: "local",
          title,
          artist: "Local Library",
          album: parts.at(-1) || library.name || "Local Music",
          albumArtist: "Local Library",
          duration: 0,
          durationMs: 0,
          thumb: "",
          streamKey: "",
          fileType: ext,
          audioCodec: ext,
          localLibraryId: library.id,
          localPath: [...parts, entry.name].join("/"),
          objectUrl,
          dateAdded: now(),
          updatedAt: file.lastModified ? new Date(file.lastModified).toISOString() : now()
        });
      }
    }
    await walk(directoryHandle);
    return tracks;
  }

  async function refreshLocalObjectUrls(db) {
    for (const library of db.settings.localLibraries || []) {
      const handle = db.localHandles?.[library.id];
      if (!handle) continue;
      try {
        const tracks = await scanDirectoryHandle(handle, library);
        library.trackCount = tracks.length;
        library.error = "";
        library.lastScannedAt = now();
        db.tracks = [...db.tracks.filter((track) => track.source !== "local" || track.localLibraryId !== library.id), ...tracks];
      } catch (error) {
        library.error = error.message || "Could not rescan this browser folder.";
      }
    }
  }

  async function addPickedDirectory() {
    if (!window.showDirectoryPicker) {
      throw new Error("Folder picking is not supported in this browser. Use a Chromium-based browser or import files manually.");
    }
    const handle = await window.showDirectoryPicker({ mode: "read" });
    const db = await loadDb();
    const library = {
      id: uuid("local-library"),
      name: handle.name || "Local Music",
      path: `Browser folder: ${handle.name || "Local Music"}`,
      enabled: true,
      trackCount: 0,
      lastScannedAt: null,
      error: ""
    };
    db.localHandles[library.id] = handle;
    db.settings.localLibraries = [...(db.settings.localLibraries || []), library];
    const tracks = await scanDirectoryHandle(handle, library);
    library.trackCount = tracks.length;
    library.lastScannedAt = now();
    db.tracks = [...db.tracks.filter((track) => track.localLibraryId !== library.id), ...tracks];
    await saveDb(db);
    if (typeof window.applyLibraryPayload === "function") window.applyLibraryPayload(libraryPayload(db));
    else location.reload();
  }

  async function addImportedAudioFiles(fileList) {
    const files = Array.from(fileList || []).filter((file) => {
      const ext = String(file.name || "").split(".").pop().toLowerCase();
      return file.type.startsWith("audio/") || AUDIO_EXTENSIONS.has(ext);
    });
    if (!files.length) throw new Error("Choose one or more audio files.");
    const db = await loadDb();
    const library = {
      id: uuid("file-import"),
      name: "Imported Audio Files",
      path: "Browser file import",
      enabled: true,
      trackCount: files.length,
      lastScannedAt: now(),
      error: "Imported files must be selected again after a full page reload."
    };
    const tracks = files.map((file, index) => {
      const id = `local-${library.id}-${index}`;
      const objectUrl = URL.createObjectURL(file);
      objectUrls.set(id, objectUrl);
      const ext = String(file.name || "").split(".").pop().toLowerCase();
      return {
        id,
        source: "local",
        title: String(file.name || `Track ${index + 1}`).replace(/\.[^.]+$/, ""),
        artist: "Imported Files",
        album: "Imported Audio Files",
        albumArtist: "Imported Files",
        duration: 0,
        durationMs: 0,
        thumb: "",
        streamKey: "",
        fileType: ext,
        audioCodec: ext,
        localLibraryId: library.id,
        localPath: file.name,
        objectUrl,
        dateAdded: now(),
        updatedAt: file.lastModified ? new Date(file.lastModified).toISOString() : now()
      };
    });
    db.settings.localLibraries.push(library);
    db.tracks = [...db.tracks, ...tracks];
    await saveDb(db);
    if (typeof window.applyLibraryPayload === "function") window.applyLibraryPayload(libraryPayload(db));
    else alert("Audio files are ready. If they do not appear, refresh and import them again.");
  }

  function directStreamUrl(track) {
    if (!track) return "";
    if (track.source === "local") return track.objectUrl || objectUrls.get(track.id) || "";
    if (track.source !== "plex") return "";
    return loadDb().then ? "" : "";
  }

  async function directPlexStreamUrl(track) {
    const db = await loadDb();
    if (!track || track.source !== "plex") return "";
    try {
      return plexUrl(db, track.streamKey || track.key || "");
    } catch {
      return "";
    }
  }

  async function artworkUrl(path) {
    const value = String(path || "");
    if (!value) return "";
    if (/^(https?:|blob:|data:)/i.test(value)) return value;
    const db = await loadDb();
    try {
      return plexUrl(db, value);
    } catch {
      return "";
    }
  }

  function syncArtworkUrl(path) {
    const value = String(path || "");
    if (!value || /^(https?:|blob:|data:)/i.test(value)) return value;
    return "";
  }

  function normalizePlaylist(input = {}) {
    return {
      id: String(input.id || uuid("playlist")),
      name: String(input.name || "New Playlist").trim() || "New Playlist",
      description: String(input.description || ""),
      trackIds: Array.isArray(input.trackIds) ? input.trackIds.map(String) : [],
      trackTrims: input.trackTrims && typeof input.trackTrims === "object" ? input.trackTrims : {},
      photo: input.photo || "",
      color: input.color || "",
      createdAt: input.createdAt || now(),
      updatedAt: now(),
      ...input
    };
  }

  function normalizeShuffleProfile(input = {}) {
    return {
      id: String(input.id || uuid("shuffle")),
      name: String(input.name || "Custom Shuffle").trim() || "Custom Shuffle",
      rules: Array.isArray(input.rules) ? input.rules : [],
      createdAt: input.createdAt || now(),
      updatedAt: now(),
      ...input
    };
  }

  function routeParts(pathname) {
    return pathname.replace(/^\/+/, "").split("/").map(decodeURIComponent);
  }

  const crcTable = (() => {
    const table = new Uint32Array(256);
    for (let index = 0; index < 256; index += 1) {
      let value = index;
      for (let bit = 0; bit < 8; bit += 1) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
      table[index] = value >>> 0;
    }
    return table;
  })();

  function crc32(bytes) {
    let value = 0xffffffff;
    for (const byte of bytes) value = crcTable[(value ^ byte) & 0xff] ^ (value >>> 8);
    return (value ^ 0xffffffff) >>> 0;
  }

  function dosDateTime(date = new Date()) {
    const year = Math.max(1980, date.getFullYear());
    return {
      time: (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2),
      day: ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate()
    };
  }

  function concatBytes(parts) {
    const size = parts.reduce((sum, part) => sum + part.length, 0);
    const output = new Uint8Array(size);
    let offset = 0;
    for (const part of parts) {
      output.set(part, offset);
      offset += part.length;
    }
    return output;
  }

  function createStoredZip(entries, date = new Date()) {
    const encoder = new TextEncoder();
    const { time, day } = dosDateTime(date);
    const localParts = [];
    const centralParts = [];
    let offset = 0;
    for (const entry of entries) {
      const name = String(entry.name || "").replace(/\\/g, "/").replace(/^\/+/, "");
      if (!name) continue;
      const nameBytes = encoder.encode(name);
      const data = entry.data instanceof Uint8Array ? entry.data : encoder.encode(String(entry.data || ""));
      const crc = crc32(data);
      const local = new Uint8Array(30);
      const localView = new DataView(local.buffer);
      localView.setUint32(0, 0x04034b50, true);
      localView.setUint16(4, 20, true);
      localView.setUint16(6, 0x0800, true);
      localView.setUint16(8, 0, true);
      localView.setUint16(10, time, true);
      localView.setUint16(12, day, true);
      localView.setUint32(14, crc, true);
      localView.setUint32(18, data.length, true);
      localView.setUint32(22, data.length, true);
      localView.setUint16(26, nameBytes.length, true);
      localParts.push(local, nameBytes, data);

      const central = new Uint8Array(46);
      const centralView = new DataView(central.buffer);
      centralView.setUint32(0, 0x02014b50, true);
      centralView.setUint16(4, 20, true);
      centralView.setUint16(6, 20, true);
      centralView.setUint16(8, 0x0800, true);
      centralView.setUint16(10, 0, true);
      centralView.setUint16(12, time, true);
      centralView.setUint16(14, day, true);
      centralView.setUint32(16, crc, true);
      centralView.setUint32(20, data.length, true);
      centralView.setUint32(24, data.length, true);
      centralView.setUint16(28, nameBytes.length, true);
      centralView.setUint32(42, offset, true);
      centralParts.push(central, nameBytes);
      offset += local.length + nameBytes.length + data.length;
    }
    const centralOffset = offset;
    const central = concatBytes(centralParts);
    const end = new Uint8Array(22);
    const endView = new DataView(end.buffer);
    endView.setUint32(0, 0x06054b50, true);
    endView.setUint16(8, entries.length, true);
    endView.setUint16(10, entries.length, true);
    endView.setUint32(12, central.length, true);
    endView.setUint32(16, centralOffset, true);
    return concatBytes([...localParts, central, end]);
  }

  async function inflateRaw(bytes) {
    if (!("DecompressionStream" in window)) {
      throw new Error("This browser cannot import compressed ZIP backups. Import a web-exported VoidFM ZIP or use a newer Chromium browser.");
    }
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  }

  async function readZipEntries(file) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    let eocd = -1;
    for (let index = bytes.length - 22; index >= Math.max(0, bytes.length - 65558); index -= 1) {
      if (view.getUint32(index, true) === 0x06054b50) {
        eocd = index;
        break;
      }
    }
    if (eocd < 0) throw new Error("Could not read this ZIP file.");
    const total = view.getUint16(eocd + 10, true);
    let offset = view.getUint32(eocd + 16, true);
    const decoder = new TextDecoder();
    const entries = [];
    for (let entryIndex = 0; entryIndex < total; entryIndex += 1) {
      if (view.getUint32(offset, true) !== 0x02014b50) throw new Error("ZIP central directory is invalid.");
      const method = view.getUint16(offset + 10, true);
      const compressedSize = view.getUint32(offset + 20, true);
      const nameLength = view.getUint16(offset + 28, true);
      const extraLength = view.getUint16(offset + 30, true);
      const commentLength = view.getUint16(offset + 32, true);
      const localOffset = view.getUint32(offset + 42, true);
      const name = decoder.decode(bytes.slice(offset + 46, offset + 46 + nameLength));
      const localNameLength = view.getUint16(localOffset + 26, true);
      const localExtraLength = view.getUint16(localOffset + 28, true);
      const dataStart = localOffset + 30 + localNameLength + localExtraLength;
      const compressed = bytes.slice(dataStart, dataStart + compressedSize);
      const data = method === 0 ? compressed : method === 8 ? await inflateRaw(compressed) : null;
      if (!data) throw new Error(`Unsupported ZIP compression method ${method}.`);
      entries.push({ name, text: decoder.decode(data) });
      offset += 46 + nameLength + extraLength + commentLength;
    }
    return entries;
  }

  async function exportBackup() {
    const db = await loadDb();
    const exportedAt = now();
    const cleanDb = {
      ...db,
      localHandles: {},
      tracks: db.tracks.map((track) => {
        const { objectUrl, ...rest } = track;
        return rest;
      })
    };
    const payload = {
      type: "voidfm-browser-backup",
      version: 1,
      exportedAt,
      db: cleanDb,
      browserPreferences: Object.fromEntries(Object.keys(localStorage)
        .filter((key) => key.startsWith("voidfm."))
        .map((key) => [key, localStorage.getItem(key) || ""]))
    };
    const suffix = exportedAt.replace(/\D/g, "").slice(0, 14);
    const zip = createStoredZip([
      { name: `VoidFM_UserData_Backup_${suffix}/VoidFM_BrowserBackup_${suffix}.json`, data: JSON.stringify(payload, null, 2) },
      { name: `VoidFM_UserData_Backup_${suffix}/VoidFM_FullDatabase_${suffix}.json`, data: JSON.stringify({ type: "voidfm-full-database-backup", schemaVersion: 1, exportedAt, data: cleanDb }, null, 2) }
    ], new Date(exportedAt));
    return new Blob([zip], { type: "application/zip" });
  }

  async function importBackupFile(file) {
    let payload = null;
    if (/\.zip$/i.test(file.name || "") || /zip/i.test(file.type || "")) {
      const entries = await readZipEntries(file);
      const jsonEntries = entries
        .filter((entry) => /\.json$/i.test(entry.name))
        .map((entry) => {
          try {
            return JSON.parse(entry.text);
          } catch {
            return null;
          }
        })
        .filter(Boolean);
      payload = jsonEntries.find((entry) => entry.type === "voidfm-browser-backup")
        || jsonEntries.find((entry) => entry.type === "voidfm-full-database-backup")
        || jsonEntries.find((entry) => entry.data || entry.db);
    } else {
      payload = JSON.parse(await file.text());
    }
    if (!payload) throw new Error("No VoidFM backup data was found in this file.");
    const restored = payload?.db || payload;
    const database = payload.type === "voidfm-full-database-backup" ? payload.data : restored;
    if (!database || typeof database !== "object") throw new Error("This does not look like a VoidFM browser backup.");
    const db = mergeDb(defaultDb(), database.cache ? {
      ...database,
      tracks: database.cache?.tracks || [],
      sections: database.cache?.sections || []
    } : database);
    db.localHandles = {};
    db.settings.localLibraries = (db.settings.localLibraries || []).map((library) => ({
      ...library,
      error: "Browser folder permission must be re-selected after backup restore."
    }));
    db.tracks = (db.tracks || []).filter((track) => track.source !== "local");
    await saveDb(db);
    const preferences = payload.browserPreferences || {};
    Object.entries(preferences).forEach(([key, value]) => {
      if (String(key).startsWith("voidfm.")) localStorage.setItem(key, String(value || ""));
    });
    location.reload();
  }

  async function handleApi(pathname, options = {}) {
    const method = String(options.method || "GET").toUpperCase();
    const parts = routeParts(pathname);
    const db = await loadDb();

    if (method === "GET" && pathname === "/api/runtime") {
      return jsonResponse({
        app: "VoidFM",
        runtimeApiVersion: 2,
        localApiToken: "",
        embeddedServer: false,
        browserOnly: true,
        versions: { assetVersion: APP_VERSION, preloadImplementation: "plex-warm-v2", fingerprintMode: "startup" }
      });
    }

    if (method === "GET" && pathname === "/api/settings") return jsonResponse(publicSettings(db));
    if (method === "POST" && pathname === "/api/settings") {
      const body = await parseBody(options);
      db.settings = { ...db.settings, ...body };
      db.settings.plexBaseUrl = normalizeBaseUrl(db.settings.plexBaseUrl);
      db.settings.plexPlaybackMode = "auto";
      db.settings.tokenSet = Boolean(db.settings.plexToken || db.settings.tokenSet);
      await saveDb(db);
      sessionStorage.setItem("voidfm.lastSettings", JSON.stringify({
        plexBaseUrl: db.settings.plexBaseUrl,
        plexToken: db.settings.plexToken
      }));
      return jsonResponse(publicSettings(db));
    }

    if (method === "GET" && pathname === "/api/library/sections") {
      if (db.settings.plexBaseUrl && db.settings.plexToken && !db.sections.length) {
        try {
          const payload = await plexFetchJson(db, "/library/sections");
          db.sections = plexItems(payload).map(normalizeSection).filter((section) => section.key);
          await saveDb(db);
        } catch (error) {
          db.lastPlexRefreshError = error.message;
          await saveDb(db);
        }
      }
      return jsonResponse({ sections: db.sections, settings: publicSettings(db), demo: false, plexError: db.lastPlexRefreshError || "", sectionErrors: {} });
    }
    if (method === "GET" && pathname === "/api/library/tracks") return jsonResponse(libraryPayload(db));
    if (method === "POST" && pathname === "/api/library/refresh") {
      if (db.settings.plexBaseUrl && db.settings.plexToken) {
        try {
          return jsonResponse(await refreshPlex(db));
        } catch (error) {
          return textError(error.message, 409);
        }
      }
      await refreshLocalObjectUrls(db);
      await saveDb(db);
      return jsonResponse(libraryPayload(db));
    }

    if (method === "POST" && pathname === "/api/local-libraries") {
      const body = await parseBody(options);
      const library = {
        id: uuid("local-library"),
        name: String(body.name || "Local Music"),
        path: String(body.path || "Browser folder required"),
        enabled: true,
        trackCount: 0,
        lastScannedAt: null,
        error: "Use the Choose Browser Folder button for GitHub Pages/browser-only local libraries."
      };
      db.settings.localLibraries.push(library);
      await saveDb(db);
      return jsonResponse({ library, ...libraryPayload(db) }, 201);
    }
    if ((method === "PUT" || method === "DELETE") && parts[1] === "local-libraries" && parts[2]) {
      const id = parts[2];
      if (method === "DELETE") {
        db.settings.localLibraries = db.settings.localLibraries.filter((item) => item.id !== id);
        db.tracks = db.tracks.filter((track) => track.localLibraryId !== id);
        delete db.localHandles[id];
      } else {
        const body = await parseBody(options);
        db.settings.localLibraries = db.settings.localLibraries.map((item) => item.id === id ? { ...item, ...body } : item);
      }
      await saveDb(db);
      return jsonResponse(libraryPayload(db));
    }
    if (method === "POST" && parts[1] === "local-libraries" && (parts[2] === "scan" || parts[3] === "scan")) {
      await refreshLocalObjectUrls(db);
      await saveDb(db);
      return jsonResponse(libraryPayload(db));
    }

    if (method === "GET" && pathname === "/api/playlists") return jsonResponse({ playlists: db.playlists });
    if (method === "POST" && pathname === "/api/playlists") {
      const playlist = normalizePlaylist(await parseBody(options));
      db.playlists.push(playlist);
      await saveDb(db);
      return jsonResponse(playlist, 201);
    }
    if (method === "PUT" && pathname === "/api/playlists/order") {
      const body = await parseBody(options);
      const ids = Array.isArray(body.playlistIds) ? body.playlistIds : Array.isArray(body.ids) ? body.ids : [];
      db.playlists = ids.map((id) => db.playlists.find((playlist) => playlist.id === id)).filter(Boolean)
        .concat(db.playlists.filter((playlist) => !ids.includes(playlist.id)));
      await saveDb(db);
      return jsonResponse({ playlists: db.playlists });
    }
    if ((method === "PUT" || method === "DELETE") && parts[1] === "playlists" && parts[2]) {
      const id = parts[2];
      if (method === "DELETE") {
        db.playlists = db.playlists.filter((playlist) => playlist.id !== id);
        await saveDb(db);
        return jsonResponse({ playlists: db.playlists });
      }
      const body = await parseBody(options);
      const index = db.playlists.findIndex((playlist) => playlist.id === id);
      if (index < 0) return textError("Playlist not found.", 404);
      db.playlists[index] = normalizePlaylist({ ...db.playlists[index], ...body, id });
      await saveDb(db);
      return jsonResponse(db.playlists[index]);
    }

    if (method === "GET" && pathname === "/api/rules") return jsonResponse({ blacklist: db.blacklist, links: db.links });
    if (method === "POST" && pathname === "/api/blacklist") {
      const rule = { id: uuid("rule"), createdAt: now(), ...(await parseBody(options)) };
      db.blacklist.push(rule);
      await saveDb(db);
      return jsonResponse(rule, 201);
    }
    if (method === "DELETE" && parts[1] === "blacklist" && parts[2]) {
      db.blacklist = db.blacklist.filter((rule) => rule.id !== parts[2]);
      await saveDb(db);
      return jsonResponse({ blacklist: db.blacklist });
    }
    if (method === "POST" && pathname === "/api/links") {
      const link = { id: uuid("link"), createdAt: now(), ...(await parseBody(options)) };
      db.links.push(link);
      await saveDb(db);
      return jsonResponse(link, 201);
    }
    if (method === "DELETE" && parts[1] === "links" && parts[2]) {
      db.links = db.links.filter((link) => link.id !== parts[2]);
      await saveDb(db);
      return jsonResponse({ links: db.links });
    }

    if (method === "GET" && pathname === "/api/shuffle-profiles") return jsonResponse({ profiles: db.customShuffles });
    if (method === "POST" && pathname === "/api/shuffle-profiles") {
      const profile = normalizeShuffleProfile(await parseBody(options));
      db.customShuffles.push(profile);
      await saveDb(db);
      return jsonResponse(profile, 201);
    }
    if ((method === "PUT" || method === "DELETE") && parts[1] === "shuffle-profiles" && parts[2]) {
      const id = parts[2];
      if (method === "DELETE") {
        db.customShuffles = db.customShuffles.filter((profile) => profile.id !== id);
        await saveDb(db);
        return jsonResponse({ profiles: db.customShuffles });
      }
      const body = await parseBody(options);
      const index = db.customShuffles.findIndex((profile) => profile.id === id);
      if (index < 0) return textError("Shuffle profile not found.", 404);
      db.customShuffles[index] = normalizeShuffleProfile({ ...db.customShuffles[index], ...body, id });
      await saveDb(db);
      return jsonResponse(db.customShuffles[index]);
    }

    if (method === "GET" && pathname === "/api/playback-state") return jsonResponse(db.playbackState);
    if (method === "POST" && pathname === "/api/playback-state") {
      db.playbackState = { ...db.playbackState, ...(await parseBody(options)), updatedAt: now() };
      await saveDb(db);
      return jsonResponse(db.playbackState);
    }
    if (method === "POST" && pathname === "/api/listening-events") {
      const event = { id: uuid("listen"), receivedAt: now(), ...(await parseBody(options)) };
      db.listeningEvents.push(event);
      const trackId = String(event.trackId || "");
      if (trackId) {
        const stat = db.listeningStats[trackId] || { trackId, playCount: 0, skipCount: 0, totalListenMs: 0 };
        if (event.type === "skip") stat.skipCount += 1;
        else stat.playCount += 1;
        stat.updatedAt = now();
        db.listeningStats[trackId] = stat;
      }
      await saveDb(db);
      return jsonResponse(event, 201);
    }
    if (method === "GET" && pathname === "/api/listening-stats") return jsonResponse({ stats: db.listeningStats, events: db.listeningEvents });

    if (method === "GET" && pathname === "/api/backup/status") {
      return jsonResponse({ browserOnly: true, latestAutoBackupAt: db.updatedAt || null, counts: { cachedTracks: visibleTracks(db).length } });
    }
    if (method === "POST" && pathname === "/api/export-user-data") return new Response(await exportBackup(), {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="VoidFM Browser Backup ${new Date().toISOString().slice(0, 10)}.zip"`
      }
    });

    if (method === "GET" && pathname === "/api/metadata/status") return jsonResponse({ browserOnly: true, providerStatus: {}, runningJob: null });
    if (method === "POST" && pathname === "/api/metadata/enrich") return jsonResponse({ job: { id: uuid("metadata"), status: "complete", done: visibleTracks(db).length, total: visibleTracks(db).length } }, 202);
    if (method === "GET" && parts[1] === "metadata" && parts[2] === "enrich") return jsonResponse({ id: parts[3] || "", status: "complete" });
    if (method === "PUT" && parts[1] === "metadata" && parts[2] === "manual" && parts[3]) {
      db.metadata.manual[parts[3]] = await parseBody(options);
      await saveDb(db);
      return jsonResponse(applyMetadata(db, db.tracks.find((track) => track.id === parts[3]) || { id: parts[3] }));
    }

    if (method === "GET" && pathname === "/api/lyrics/status") return jsonResponse({ browserOnly: true, runningJob: null });
    if (method === "POST" && pathname === "/api/lyrics/scan") return jsonResponse({ job: { id: uuid("lyrics"), status: "complete" } }, 202);
    if (method === "GET" && parts[1] === "lyrics" && parts[2] === "scan") return jsonResponse({ id: parts[3] || "", status: "complete" });
    if (parts[1] === "lyrics" && parts[2]) {
      const id = parts[2];
      if (method === "POST" && parts[3] === "sync") return jsonResponse(await lookupAndCacheLyrics(db, id));
      const track = visibleTracks(db).find((item) => item.id === id || item.ratingKey === id) || { id };
      return jsonResponse({ lyrics: db.metadata.lyrics?.[id] || null, track });
    }

    if (parts[1] === "chords" && parts[2]) {
      const id = parts[2];
      if (method === "DELETE") {
        delete db.metadata.chords[id];
        await saveDb(db);
      } else if (method === "POST") {
        db.metadata.chords[id] = { status: "manual", sourceType: "manual", ...(await parseBody(options)) };
        await saveDb(db);
      }
      const track = db.tracks.find((item) => item.id === id || item.ratingKey === id) || { id };
      return jsonResponse({ chords: db.metadata.chords?.[id] || null, track });
    }

    if ((method === "GET" || method === "POST") && parts[1] === "preload" && parts[2]) return jsonResponse({ status: "browser-direct", cached: false });
    if (method === "POST" && pathname === "/api/playback-diagnostics") return jsonResponse({ accepted: 0 }, 202);
    if (method === "GET" && pathname === "/api/playback-diagnostics") return jsonResponse({ events: [] });
    if (method === "POST" && parts[1] === "year-review") return jsonResponse({ review: null, created: false });
    if (method === "POST" && pathname === "/api/recovery-notice/ack") return jsonResponse({ recoveryNotice: null, settings: publicSettings(db) });

    return textError(`Browser-only VoidFM does not support ${method} ${pathname}.`, 404);
  }

  function isApiUrl(input) {
    const raw = typeof input === "string" ? input : input?.url || "";
    try {
      const url = new URL(raw, location.href);
      return url.origin === location.origin && url.pathname.startsWith("/api/");
    } catch {
      return String(raw).startsWith("/api/");
    }
  }

  window.fetch = async function browserFetch(input, options = {}) {
    if (!isApiUrl(input)) return originalFetch(input, options);
    const url = new URL(typeof input === "string" ? input : input.url, location.href);
    try {
      return await handleApi(url.pathname, options);
    } catch (error) {
      return textError(error.message || "Browser API request failed.", 500);
    }
  };

  function installUiHelpers() {
    const enhance = () => {
      const form = document.getElementById("localLibraryForm");
      if (form && !form.querySelector("[data-browser-folder-picker]")) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "tool-button browser-folder-picker";
        button.dataset.browserFolderPicker = "true";
        button.innerHTML = "<span>Choose Browser Folder</span>";
        button.addEventListener("click", async () => {
          button.disabled = true;
          try {
            await addPickedDirectory();
          } catch (error) {
            alert(error.message || "Could not add browser folder.");
            button.disabled = false;
          }
        });
        form.appendChild(button);
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "audio/*,.mp3,.flac,.m4a,.aac,.wav,.ogg,.opus,.wma,.aif,.aiff";
        fileInput.multiple = true;
        fileInput.hidden = true;
        fileInput.dataset.browserAudioImportInput = "true";
        fileInput.addEventListener("change", async () => {
          try {
            await addImportedAudioFiles(fileInput.files);
          } catch (error) {
            alert(error.message || "Could not import audio files.");
          } finally {
            fileInput.value = "";
          }
        });
        const fileButton = document.createElement("button");
        fileButton.type = "button";
        fileButton.className = "tool-button browser-file-import";
        fileButton.dataset.browserFileImport = "true";
        fileButton.innerHTML = "<span>Import Audio Files</span>";
        fileButton.addEventListener("click", () => fileInput.click());
        form.appendChild(fileButton);
        form.appendChild(fileInput);
      }
      document.querySelectorAll("[data-action='open-backup-folder']").forEach((button) => {
        button.setAttribute("disabled", "disabled");
        button.title = "GitHub Pages uses browser storage. Export a backup file instead.";
      });
      document.querySelectorAll("[data-browser-import-backup]").forEach((button) => {
        if (button.dataset.browserImportReady) return;
        button.dataset.browserImportReady = "true";
        const input = document.querySelector("[data-browser-import-backup-input]");
        if (!input) return;
        if (!input.dataset.browserImportReady) {
          input.dataset.browserImportReady = "true";
          input.addEventListener("change", async () => {
            const status = document.querySelector("[data-import-user-data-status]");
            if (status) status.textContent = "Importing backup...";
          const file = input.files?.[0];
          if (!file) return;
          try {
            await importBackupFile(file);
          } catch (error) {
            if (status) status.textContent = error.message || "Could not import backup.";
            alert(error.message || "Could not import backup.");
          } finally {
            input.value = "";
          }
          });
        }
        button.addEventListener("click", () => input.click());
      });
    };
    enhance();
    new MutationObserver(enhance).observe(document.documentElement, { childList: true, subtree: true });
  }

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register(new URL("service-worker.js", document.currentScript?.src || location.href)).catch(() => {});
  }
  document.addEventListener("DOMContentLoaded", installUiHelpers);

  window.VoidFMBrowserApi = {
    enabled: true,
    staticCacheName: STATIC_CACHE,
    getStreamUrl(track) {
      if (!track) return "";
      if (track.source === "local") return track.objectUrl || objectUrls.get(track.id) || "";
      if (track.source === "plex") {
        const settings = JSON.parse(sessionStorage.getItem("voidfm.lastSettings") || "null");
        if (settings?.plexBaseUrl && track.streamKey) {
          const url = new URL(track.streamKey, `${settings.plexBaseUrl.replace(/\/+$/, "")}/`);
          if (settings.plexToken) url.searchParams.set("X-Plex-Token", settings.plexToken);
          return url.toString();
        }
      }
      return "";
    },
    syncArtworkUrl,
    async artworkUrl(path) {
      return artworkUrl(path);
    },
    addPickedDirectory,
    addImportedAudioFiles,
    importBackupFile,
    async rememberSettings() {
      const db = await loadDb();
      sessionStorage.setItem("voidfm.lastSettings", JSON.stringify({
        plexBaseUrl: db.settings.plexBaseUrl,
        plexToken: db.settings.plexToken
      }));
    }
  };

  loadDb().then((db) => {
    sessionStorage.setItem("voidfm.lastSettings", JSON.stringify({
      plexBaseUrl: db.settings.plexBaseUrl,
      plexToken: db.settings.plexToken
    }));
  }).catch(() => {});
})();
