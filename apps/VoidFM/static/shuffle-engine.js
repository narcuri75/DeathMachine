(function attachShuffleEngine(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.VoidFMShuffle = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function makeShuffleEngine() {
  const RULE_DEFINITIONS = [
    ["keyword", "Genre / keyword", "Value: rock, synth, night"],
    ["yearRange", "Year range", "Value: 1970-2000"],
    ["artistRun", "Artist Repeat", "Repeat an artist, then keep them out for a cooldown"],
    ["artistSpacing", "Artist Spacing", "Avoid same, similar, or grouped artists for a set distance"],
    ["titleChain", "Song Title Chain", "Last title letter leads the next title"],
    ["noArtistRepeat", "No artist repeat", "Number: tracks between repeats"],
    ["rivalArtists", "Rival artists", "Value: comma groups; Number: distance"],
    ["albumPairing", "Album pairing", "Number: window"],
    ["deepCut", "Deep cut balance", "Number: max plays for deep cuts"],
    ["discoveryBias", "Discovery Bias", "Favor deep cuts, never-played tracks, or neglected artists"],
    ["energyFlow", "Energy / BPM Flow", "Climb, drop, or wave by BPM and energy"],
    ["alphabetClimb", "Alphabet climb", "Title A-Z"],
    ["titlePattern", "Title pattern", "Value: one-word, question, or number"],
    ["energyRollercoaster", "Energy rollercoaster", "Low / medium / high movement"],
    ["rampUp", "Ramp-up", "Lower energy/BPM first"],
    ["cooldown", "Cooldown", "Higher energy/BPM first"],
    ["moodLock", "Mood lock", "Value: sad, happy, angry"],
    ["noVibeCrash", "No vibe crash", "Number: max energy jump"],
    ["decadeLadder", "Decade ladder", "Older decades first"],
    ["yearChain", "Year chain", "Adjacent years when possible"],
    ["birthday", "Birthday shuffle", "Value: YYYY or MM-DD"],
    ["releaseDateFlow", "Release Date Flow", "Decade ladder, year chain, or date match"],
    ["neglectedArtist", "Neglected artist", "Boost artists you rarely hear"],
    ["neverPlayed", "Never played", "Only zero-play tracks"],
    ["forbiddenGenreCombo", "Forbidden genre combo", "Value: metal>lofi, comedy>sad"],
    ["genreFlow", "Genre Flow", "Rotate genres and block disliked transitions"],
    ["genreTourist", "Genre tourist", "Value: rock, jazz; Number: per genre"],
    ["moodThemeFilter", "Mood / Theme Filter", "Filter by moods, weather, tags, or theme words"],
    ["bpmClimb", "BPM climb", "Increasing BPM"],
    ["bpmDrop", "BPM drop", "Decreasing BPM"],
    ["theme", "Themed quest", "Value: roadtrip, rain, neon"],
    ["weather", "Weather shuffle", "Value: rain, sunny, snow"],
    ["singalongEvery", "Singalong every X", "Number: interval"]
  ].map(([id, label, hint]) => ({ id, label, hint }));

  const PRESETS = [
    { id: "artist-repeat", name: "Artist Repeat", description: "Plays an artist in a short run, then keeps them out for a cooldown.", rules: [{ type: "artistRun", count: 2, distance: 20 }] },
    { id: "album-pairing", name: "Album Pairing", description: "Keeps album neighbors close together.", rules: [{ type: "albumPairing", window: 5 }] },
    { id: "artist-spacing", name: "Artist Spacing", description: "Spaces out repeated, rival, or similar artists.", rules: [{ type: "artistSpacing", count: 8, distance: 2, value: "" }] },
    { id: "discovery-bias", name: "Discovery Bias", description: "Favors deep cuts, never-played songs, or neglected artists.", rules: [{ type: "discoveryBias", value: "deep-cut", maxPlays: 2 }] },
    { id: "energy-bpm-flow", name: "Energy / BPM Flow", description: "Climbs, drops, or waves through BPM and energy.", rules: [{ type: "energyFlow", value: "bpm-climb", count: 4, threshold: 0 }] },
    { id: "genre-flow", name: "Genre Flow", description: "Rotates genres and blocks disliked genre transitions.", rules: [{ type: "genreFlow", value: "", count: 2, blockedTransitions: "" }] },
    { id: "mood-theme-filter", name: "Mood / Theme Filter", description: "Filters by moods, weather, tags, or theme words.", rules: [{ type: "moodThemeFilter", value: "" }] },
    { id: "release-date-flow", name: "Release Date Flow", description: "Uses decade ladder, year chain, or date matching.", rules: [{ type: "releaseDateFlow", value: "decade-ladder", date: "" }] },
    { id: "title-pattern", name: "Title Pattern", description: "Filters titles by word count, questions, numbers, or A-Z starts.", rules: [{ type: "titlePattern", value: "one-word", order: "" }] },
    { id: "song-title-chain", name: "Song Title Chain", description: "Each next title starts with the final letter of the previous title.", rules: [{ type: "titleChain", ignoreThe: true }] },
    { id: "singalong", name: "Singalong Every X Songs", description: "Places familiar songs at regular intervals.", rules: [{ type: "singalongEvery", interval: 5 }] }
  ];

  const WEATHER_TERMS = {
    rain: ["rain", "rainy", "storm", "gloomy", "soft", "acoustic", "sad", "dreamy"],
    sunny: ["sun", "sunny", "summer", "warm", "happy", "pop", "singalong"],
    snow: ["snow", "winter", "cold", "quiet", "ambient", "soft"],
    cloudy: ["cloud", "cloudy", "gray", "grey", "mellow", "moody"],
    night: ["night", "late", "dark", "dreamy", "spacey", "chill"],
    hot: ["hot", "summer", "dance", "hype", "latin", "funk"],
    windy: ["wind", "air", "open", "roadtrip", "folk"]
  };

  function cleanText(value) {
    return String(value || "").trim();
  }

  function lowerText(value) {
    return cleanText(value).toLowerCase();
  }

  function tokens(value) {
    return String(value || "")
      .split(/[,\n/|]+/)
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean);
  }

  function unique(items) {
    return Array.from(new Set(items.map(cleanText).filter(Boolean)));
  }

  function shuffleItems(items) {
    const shuffled = items.slice();
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }
    return shuffled;
  }

  function toNumber(value, fallback = null) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function fadeSeconds(value) {
    const seconds = toNumber(value, 0);
    return Math.round(Math.max(0, Math.min(10, seconds)) * 10) / 10;
  }

  function firstTrack(unit) {
    return Array.isArray(unit) ? unit[0] : unit;
  }

  function lastTrack(unit) {
    return Array.isArray(unit) ? unit[unit.length - 1] : unit;
  }

  function unitTracks(unit) {
    return Array.isArray(unit) ? unit.filter(Boolean) : [unit].filter(Boolean);
  }

  function statFor(track, statsById = {}) {
    return statsById?.[track?.id] || statsById?.[track?.ratingKey] || {};
  }

  function playCount(track, context = {}) {
    return Number(statFor(track, context.statsById).playCount || track?.playCount || 0);
  }

  function skipCount(track, context = {}) {
    return Number(statFor(track, context.statsById).skipCount || track?.skipCount || 0);
  }

  function lastPlayedAt(track, context = {}) {
    return statFor(track, context.statsById).lastPlayedAt || track?.lastPlayedAt || "";
  }

  function buildArtistSummaries(allTracks = [], statsById = {}) {
    const summaries = new Map();
    const statsContext = { statsById };
    for (const track of allTracks) {
      const artist = lowerText(track?.artist);
      if (!artist) continue;
      const summary = summaries.get(artist) || { trackCount: 0, playCount: 0 };
      summary.trackCount += 1;
      summary.playCount += playCount(track, statsContext);
      summaries.set(artist, summary);
    }
    return summaries;
  }

  function trackGenres(track) {
    return (track?.genres || []).map(lowerText).filter(Boolean);
  }

  function trackMoods(track) {
    return (track?.moods || []).map(lowerText).filter(Boolean);
  }

  function trackTags(track) {
    return (track?.tags || []).map(lowerText).filter(Boolean);
  }

  function haystack(track) {
    return [
      track?.title,
      track?.artist,
      track?.album,
      track?.albumArtist,
      track?.sectionTitle,
      track?.sourceLibrary,
      ...trackGenres(track),
      ...trackMoods(track),
      ...trackTags(track)
    ].join(" ").toLowerCase();
  }

  function trackYear(track) {
    const year = Number(track?.year || String(track?.releaseDate || "").slice(0, 4));
    return Number.isFinite(year) && year > 0 ? year : null;
  }

  function decade(track) {
    const year = trackYear(track);
    return year ? Math.floor(year / 10) * 10 : null;
  }

  function chainIgnoresThe(rule) {
    return Boolean(rule?.ignoreThe || rule?.ignoreTheWord || rule?.skipThe);
  }

  function titleLetters(title, options = {}) {
    const text = options.ignoreThe
      ? String(title || "").toLowerCase().replace(/\bthe\b/g, " ")
      : String(title || "").toLowerCase();
    const chars = text.match(/[a-z]/g) || [];
    return { first: chars[0] || "", last: chars[chars.length - 1] || "" };
  }

  function titleMatchesPattern(track, pattern) {
    const title = cleanText(track?.title);
    const lower = title.toLowerCase();
    const titleWithoutEdgePunctuation = title.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");
    if (pattern === "one-word") return /^[\p{L}\p{N}'-]+$/u.test(titleWithoutEdgePunctuation);
    if (pattern === "question") return title.includes("?");
    if (pattern === "number") return /\d/.test(title) || /\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|nineteen|twenty|ninety|hundred|thousand)\b/.test(lower);
    if (pattern === "starts-a-z") return titleStartsWithAsciiLetter(track);
    return true;
  }

  function titlePatternModes(rule) {
    const modes = tokens(rule?.value || "one-word")
      .map((mode) => mode === "az" || mode === "a-z" || mode === "alphabet" ? "starts-a-z" : mode)
      .filter((mode) => ["one-word", "question", "number", "starts-a-z"].includes(mode));
    return modes.length ? Array.from(new Set(modes)) : ["one-word"];
  }

  function titleMatchesPatterns(track, rule) {
    return titlePatternModes(rule).every((pattern) => titleMatchesPattern(track, pattern));
  }

  function titleStartsWithAsciiLetter(track) {
    return /^[A-Za-z]/.test(cleanText(track?.title));
  }

  function ruleStrictness(rule) {
    const value = lowerText(rule?.strictness);
    return ["relaxed", "strict"].includes(value) ? value : "normal";
  }

  function shouldEnforceRule(rule, pass, strictOnly = false) {
    const strictness = ruleStrictness(rule);
    if (strictness === "relaxed") return false;
    if (pass === "strictOnly") return strictness === "strict";
    if (strictOnly && pass === "normal") return strictness === "strict";
    return Boolean(pass);
  }

  function shouldEnforceHardRule(rule, pass, strictOnly = false) {
    if (["artistRun", "titleChain"].includes(rule?.type) && ruleStrictness(rule) !== "relaxed") return true;
    return shouldEnforceRule(rule, pass, strictOnly);
  }

  function trackBpm(track) {
    const bpm = Number(track?.bpm);
    return Number.isFinite(bpm) && bpm > 0 ? bpm : null;
  }

  function inferredEnergy(track) {
    const explicit = Number(track?.energy);
    if (Number.isFinite(explicit) && explicit > 0) return Math.max(1, Math.min(10, explicit));
    const bpm = trackBpm(track);
    if (bpm) {
      if (bpm < 80) return 2;
      if (bpm < 105) return 4;
      if (bpm < 128) return 6;
      if (bpm < 155) return 8;
      return 10;
    }
    const text = haystack(track);
    if (/\b(ambient|acoustic|piano|sleep|soft|chill|ballad)\b/.test(text)) return 3;
    if (/\b(metal|punk|hardcore|dance|edm|hype|gym|thrash)\b/.test(text)) return 8;
    return null;
  }

  function energyBucket(track) {
    const energy = inferredEnergy(track);
    if (!energy) return "unknown";
    if (energy <= 3) return "low";
    if (energy <= 7) return "medium";
    return "high";
  }

  function isFamiliar(track, context = {}) {
    return Boolean(track?.singalong)
      || (trackTags(track).includes("singalong"))
      || playCount(track, context) >= 5
      || Number(track?.rating || 0) >= 8
      || Boolean(track?.liked);
  }

  function isDeepCut(track, context = {}, maxPlays = 2) {
    return playCount(track, context) <= maxPlays && Number(track?.rating || 0) < 9;
  }

  function dateParts(track) {
    const releaseDate = cleanText(track?.releaseDate);
    const match = releaseDate.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) return { year: match[1], monthDay: `${match[2]}-${match[3]}` };
    const year = trackYear(track);
    return { year: year ? String(year) : "", monthDay: "" };
  }

  function metadataMissingFor(track, type) {
    if (type === "moodLock" || type === "moodThemeFilter") return !trackMoods(track).length && !trackTags(track).length;
    if (["genreInclude", "genreTourist", "forbiddenGenreCombo", "genreFlow"].includes(type)) return !trackGenres(track).length;
    if (["bpmClimb", "bpmDrop", "energyFlow"].includes(type)) return !trackBpm(track) && !inferredEnergy(track);
    if (["rampUp", "cooldown", "energyRollercoaster", "noVibeCrash"].includes(type)) return !inferredEnergy(track);
    return false;
  }

  function ruleNumber(rule, keys, fallback) {
    for (const key of keys) {
      const value = toNumber(rule?.[key], null);
      if (value !== null) return value;
    }
    return fallback;
  }

  function singalongInterval(rule) {
    const interval = Number(ruleNumber(rule, ["interval", "count"], 5));
    return Number.isFinite(interval) ? Math.max(1, Math.floor(interval)) : 5;
  }

  function artistRepeatCount(rule) {
    const count = Number(ruleNumber(rule, ["count"], 2));
    return Number.isFinite(count) ? Math.max(1, Math.floor(count)) : 2;
  }

  function artistRepeatCooldown(rule) {
    const distance = Number(ruleNumber(rule, ["distance", "cooldown"], 20));
    return Number.isFinite(distance) ? Math.max(0, Math.floor(distance)) : 20;
  }

  function ruleMode(rule, fallback = "") {
    return lowerText(rule?.mode || rule?.value || fallback);
  }

  function energyFlowMode(rule) {
    const mode = ruleMode(rule, "bpm-climb").replaceAll("_", "-");
    if (mode === "climb") return "bpm-climb";
    if (mode === "drop" || mode === "descend") return "bpm-drop";
    if (mode === "wave" || mode === "both") return "bpm-wave";
    if (mode === "rollercoaster") return "energy-wave";
    return mode;
  }

  function energyFlowSegment(rule) {
    const count = Number(ruleNumber(rule, ["count", "segment"], 4));
    return Number.isFinite(count) ? Math.max(1, Math.floor(count)) : 4;
  }

  function energyFlowThreshold(rule) {
    const threshold = Number(ruleNumber(rule, ["threshold", "maxJump"], 0));
    return Number.isFinite(threshold) ? Math.max(0, threshold) : 0;
  }

  function releaseDateMode(rule) {
    const mode = ruleMode(rule, "decade-ladder").replaceAll("_", "-");
    if (mode === "birthday" || mode === "date" || mode === "date-match") return "date-match";
    if (mode === "year" || mode === "year-chain") return "year-chain";
    return "decade-ladder";
  }

  function releaseDateTarget(rule) {
    return cleanText(rule?.date || rule?.target || rule?.match || "");
  }

  function discoveryMode(rule) {
    const mode = ruleMode(rule, "deep-cut").replaceAll("_", "-");
    if (mode === "never") return "never-played";
    if (mode === "neglected") return "neglected-artist";
    if (mode === "mixed") return "mix";
    return mode;
  }

  function genreFlowBlockedTransitions(rule) {
    return cleanText(rule?.blockedTransitions || rule?.blocked || rule?.blocks || "");
  }

  function artistSpacingSameDistance(rule) {
    const count = Number(ruleNumber(rule, ["count", "sameDistance"], 8));
    return Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 8;
  }

  function artistSpacingRivalDistance(rule) {
    const distance = Number(ruleNumber(rule, ["distance", "rivalDistance"], 2));
    return Number.isFinite(distance) ? Math.max(0, Math.floor(distance)) : 2;
  }

  function migrateProfile(profile = {}) {
    profile = profile || {};
    const rules = Array.isArray(profile.rules)
      ? profile.rules.map((rule) => ({ ...rule })).filter((rule) => rule.type)
      : [];

    if (!rules.length) {
      const terms = cleanText(profile.terms);
      if (terms) rules.push({ type: "keyword", value: terms });
      if (profile.yearMin || profile.yearMax) {
        rules.push({ type: "yearRange", min: profile.yearMin || "", max: profile.yearMax || "" });
      }
      if (Number(profile.artistRunLength || 1) > 1) {
        rules.push({
          type: "artistRun",
          count: Number(profile.artistRunLength || 1),
          requireFull: profile.requireFullArtistRun !== false
        });
      }
      if (profile.titleLetterChain) rules.push({ type: "titleChain" });
    }

    return {
      ...profile,
      schemaVersion: 2,
      rules,
      terms: cleanText(profile.terms),
      yearMin: profile.yearMin ?? null,
      yearMax: profile.yearMax ?? null,
      artistRunLength: Math.max(1, Number(profile.artistRunLength || 1)),
      requireFullArtistRun: profile.requireFullArtistRun !== false,
      titleLetterChain: Boolean(profile.titleLetterChain),
      fadeSeconds: fadeSeconds(profile.fadeSeconds)
    };
  }

  function profileRules(profile) {
    return migrateProfile(profile).rules;
  }

  function profileSummary(profile) {
    const rules = profileRules(profile);
    if (!rules.length) return "Default smart shuffle";
    return rules.slice(0, 5).map((rule) => {
      const definition = RULE_DEFINITIONS.find((item) => item.id === rule.type);
      const label = definition?.label || rule.type;
      const value = cleanText(rule.value || [rule.min, rule.max].filter(Boolean).join("-"));
      const number = ruleNumber(rule, ["count", "distance", "window", "interval", "threshold", "maxPlays"], null);
      if (value && number !== null) return `${label}: ${value} / ${number}`;
      if (value) return `${label}: ${value}`;
      if (number !== null) return `${label}: ${number}`;
      return label;
    }).join(" / ") + (rules.length > 5 ? ` / +${rules.length - 5}` : "");
  }

  function parseYearRange(rule) {
    if (rule.min || rule.max) return { min: toNumber(rule.min, null), max: toNumber(rule.max, null) };
    const match = cleanText(rule.value).match(/(\d{4})\D+(\d{4})/);
    if (match) return { min: Number(match[1]), max: Number(match[2]) };
    const single = toNumber(rule.value, null);
    return { min: single, max: single };
  }

  function unitPassesRule(unit, rule, context) {
    const tracks = unitTracks(unit);
    const type = rule.type;
    if (!type) return true;
    if (type === "singalongEvery" && singalongInterval(rule) === 1) {
      return tracks.length ? tracks.every((track) => isFamiliar(track, context)) : true;
    }

    return tracks.some((track) => {
      if (type === "keyword") {
        const terms = rule._tokens || tokens(rule.value);
        return !terms.length || terms.some((term) => haystack(track).includes(term));
      }
      if (type === "yearRange") {
        const range = rule._yearRange || parseYearRange(rule);
        const year = trackYear(track);
        if (!year) return true;
        if (range.min && year < range.min) return false;
        if (range.max && year > range.max) return false;
        return true;
      }
      if (type === "alphabetClimb") return titleStartsWithAsciiLetter(track);
      if (type === "titlePattern") return titleMatchesPatterns(track, rule);
      if (type === "moodLock") {
        const terms = rule._tokens || tokens(rule.value);
        if (!terms.length || metadataMissingFor(track, type)) return true;
        return terms.some((term) => trackMoods(track).includes(term) || trackTags(track).includes(term) || haystack(track).includes(term));
      }
      if (type === "moodThemeFilter") {
        const terms = rule._themeTerms || rule._tokens || tokens(rule.value);
        if (!terms.length || metadataMissingFor(track, type)) return true;
        return terms.some((term) => trackMoods(track).includes(term) || trackTags(track).includes(term) || haystack(track).includes(term));
      }
      if (type === "neverPlayed") return playCount(track, context) === 0;
      if (type === "discoveryBias" && discoveryMode(rule) === "never-played") return playCount(track, context) === 0;
      if (type === "birthday") {
        const value = cleanText(rule.value);
        if (!value) return true;
        const parts = dateParts(track);
        return parts.year === value || parts.monthDay === value || parts.monthDay === value.padStart(5, "0");
      }
      if (type === "releaseDateFlow" && releaseDateMode(rule) === "date-match") {
        const value = releaseDateTarget(rule);
        if (!value) return true;
        const parts = dateParts(track);
        return parts.year === value || parts.monthDay === value || parts.monthDay === value.padStart(5, "0");
      }
      if (type === "theme") {
        const terms = rule._tokens || tokens(rule.value);
        if (!terms.length) return true;
        return terms.some((term) => haystack(track).includes(term));
      }
      if (type === "weather") {
        const terms = rule._weatherTerms || tokens(rule.value || "rain").flatMap((item) => WEATHER_TERMS[item] || [item]);
        if (!terms.length) return true;
        return terms.some((term) => haystack(track).includes(term));
      }
      return true;
    });
  }

  function filterUnits(units, rules, context) {
    const hardFilters = rules.filter((rule) => (
      ["keyword", "yearRange", "alphabetClimb", "titlePattern", "moodLock", "moodThemeFilter", "neverPlayed", "birthday", "theme", "weather"].includes(rule.type)
      || (rule.type === "releaseDateFlow" && releaseDateMode(rule) === "date-match")
      || (rule.type === "discoveryBias" && discoveryMode(rule) === "never-played")
      || (rule.type === "singalongEvery" && singalongInterval(rule) === 1)
    ) && ruleStrictness(rule) !== "relaxed");
    if (!hardFilters.length) return units;
    const filtered = units.filter((unit) => hardFilters.every((rule) => unitPassesRule(unit, rule, context)));
    if (filtered.length) return filtered;
    return hardFilters.some((rule) => ruleStrictness(rule) === "strict" || rule.type === "alphabetClimb") ? filtered : units;
  }

  function compareByValue(units, valueFor, direction = "asc") {
    const copy = units.slice();
    copy.sort((left, right) => {
      const leftValue = valueFor(firstTrack(left));
      const rightValue = valueFor(firstTrack(right));
      const leftMissing = leftValue === null || leftValue === undefined || leftValue === "";
      const rightMissing = rightValue === null || rightValue === undefined || rightValue === "";
      if (leftMissing && rightMissing) return 0;
      if (leftMissing) return 1;
      if (rightMissing) return -1;
      if (typeof leftValue === "string") return direction === "desc"
        ? rightValue.localeCompare(leftValue, undefined, { numeric: true, sensitivity: "base" })
        : leftValue.localeCompare(rightValue, undefined, { numeric: true, sensitivity: "base" });
      return direction === "desc" ? rightValue - leftValue : leftValue - rightValue;
    });
    return copy;
  }

  function artistOf(unit) {
    return firstTrack(unit)?.artist || "Unknown Artist";
  }

  function artistKeyOf(unit) {
    return lowerText(artistOf(unit)) || "unknown artist";
  }

  function albumKeyOf(unit) {
    return lowerText(firstTrack(unit)?.album) || "unknown album";
  }

  function unitArtistSongCount(unit, artistKey) {
    return unitTracks(unit).filter((track) => (lowerText(track?.artist) || "unknown artist") === artistKey).length;
  }

  function unitStartLetter(unit, rule = null) {
    return titleLetters(firstTrack(unit)?.title, { ignoreThe: chainIgnoresThe(rule) }).first;
  }

  function unitEndLetter(unit, rule = null) {
    return titleLetters(lastTrack(unit)?.title, { ignoreThe: chainIgnoresThe(rule) }).last;
  }

  function makeArtistRunUnits(units, rule) {
    const count = artistRepeatCount(rule);
    if (count <= 1) return units.slice();
    const sameAlbum = Boolean(rule.sameAlbum || rule.byAlbum || rule.albumOnly);
    const groups = new Map();
    for (const unit of units) {
      const artist = artistKeyOf(unit);
      const album = sameAlbum ? albumKeyOf(unit) : "";
      const key = sameAlbum ? `${artist}\n${album}` : artist;
      if (!groups.has(key)) groups.set(key, { artist, units: [] });
      groups.get(key).units.push(unit);
    }
    const keys = Array.from(groups.keys()).sort(() => Math.random() - 0.5);
    const arranged = [];
    let guard = 0;
    while (keys.length && guard < 100000) {
      guard += 1;
      const key = keys.shift();
      const group = groups.get(key);
      if (!group) continue;
      let blockCount = 0;
      const block = [];
      while (group.units.length && blockCount < count) {
        const unit = group.units.shift();
        block.push(...unitTracks(unit));
        blockCount += unitArtistSongCount(unit, group.artist);
      }
      if (blockCount >= count) arranged.push(block);
      const remainingCount = group.units.reduce((sum, unit) => sum + unitArtistSongCount(unit, group.artist), 0);
      if (remainingCount >= count) {
        keys.push(key);
      }
    }
    return arranged;
  }

  function applyGenreTourist(units, rule) {
    const selected = tokens(rule.value);
    const count = Math.max(1, ruleNumber(rule, ["count"], 2));
    const genres = selected.length
      ? selected
      : unique(units.flatMap((unit) => trackGenres(firstTrack(unit)))).slice(0, 8);
    if (!genres.length) return units;
    const remaining = units.slice();
    const arranged = [];
    let guard = 0;
    while (remaining.length && guard < 100000) {
      guard += 1;
      let moved = false;
      for (const genre of genres) {
        for (let taken = 0; taken < count; taken += 1) {
          const index = remaining.findIndex((unit) => trackGenres(firstTrack(unit)).some((candidate) => candidate.includes(genre)));
          if (index === -1) break;
          arranged.push(remaining.splice(index, 1)[0]);
          moved = true;
        }
      }
      if (!moved) break;
    }
    return arranged.concat(remaining);
  }

  function applyInitialOrdering(units, rules, shuffle) {
    let ordered = shuffle ? shuffleItems(units) : units.slice();
    const artistRun = rules.find((rule) => rule.type === "artistRun");
    if (artistRun) ordered = makeArtistRunUnits(ordered, artistRun);
    const genreFlow = rules.find((rule) => rule.type === "genreFlow");
    if (rules.some((rule) => rule.type === "genreTourist")) ordered = applyGenreTourist(ordered, rules.find((rule) => rule.type === "genreTourist"));
    if (genreFlow) ordered = applyGenreTourist(ordered, genreFlow);
    if (rules.some((rule) => rule.type === "alphabetClimb")) ordered = compareByValue(ordered, (track) => cleanText(track?.title).toLowerCase(), "asc");
    const titlePattern = rules.find((rule) => rule.type === "titlePattern" && ["asc", "desc"].includes(lowerText(rule.order || rule.alphabetOrder)));
    if (titlePattern) ordered = compareByValue(ordered, (track) => cleanText(track?.title).toLowerCase(), lowerText(titlePattern.order || titlePattern.alphabetOrder));
    if (rules.some((rule) => rule.type === "decadeLadder")) ordered = compareByValue(ordered, decade, "asc");
    const releaseDate = rules.find((rule) => rule.type === "releaseDateFlow");
    if (releaseDate && releaseDateMode(releaseDate) === "decade-ladder") ordered = compareByValue(ordered, decade, "asc");
    if (rules.some((rule) => rule.type === "rampUp")) ordered = compareByValue(ordered, (track) => inferredEnergy(track) || trackBpm(track), "asc");
    if (rules.some((rule) => rule.type === "cooldown")) ordered = compareByValue(ordered, (track) => inferredEnergy(track) || trackBpm(track), "desc");
    if (rules.some((rule) => rule.type === "bpmClimb")) ordered = compareByValue(ordered, trackBpm, "asc");
    if (rules.some((rule) => rule.type === "bpmDrop")) ordered = compareByValue(ordered, trackBpm, "desc");
    const energyFlow = rules.find((rule) => rule.type === "energyFlow");
    if (energyFlow) {
      const mode = energyFlowMode(energyFlow);
      if (mode === "bpm-climb") ordered = compareByValue(ordered, trackBpm, "asc");
      if (mode === "bpm-drop") ordered = compareByValue(ordered, trackBpm, "desc");
      if (mode === "energy-climb") ordered = compareByValue(ordered, (track) => inferredEnergy(track) || trackBpm(track), "asc");
      if (mode === "energy-drop") ordered = compareByValue(ordered, (track) => inferredEnergy(track) || trackBpm(track), "desc");
    }
    return ordered;
  }

  function rivalGroups(rule) {
    if (Array.isArray(rule?._rivalGroups)) return rule._rivalGroups;
    return String(rule.value || "")
      .split(/\n|;/)
      .map(tokens)
      .filter((group) => group.length > 1);
  }

  function areRivals(left, right, rule) {
    const leftArtist = lowerText(left?.artist);
    const rightArtist = lowerText(right?.artist);
    if (!leftArtist || !rightArtist || leftArtist === rightArtist) return false;
    const groups = rivalGroups(rule);
    if (groups.some((group) => group.includes(leftArtist) && group.includes(rightArtist))) return true;
    const similarLeft = (left?.similarArtists || left?.similarArtistNames || []).map(lowerText);
    const similarRight = (right?.similarArtists || right?.similarArtistNames || []).map(lowerText);
    return similarLeft.includes(rightArtist) || similarRight.includes(leftArtist);
  }

  function forbiddenPairs(rule) {
    if (Array.isArray(rule?._forbiddenPairs)) return rule._forbiddenPairs;
    return String(rule.type === "genreFlow" ? genreFlowBlockedTransitions(rule) : rule.value || "")
      .split(/[,\n;]+/)
      .map((pair) => pair.split(/>|->|=>/).map(lowerText).filter(Boolean))
      .filter((pair) => pair.length === 2);
  }

  function prepareRules(rules) {
    return rules.map((rule) => {
      const prepared = { ...rule };
      if (["keyword", "moodLock", "theme", "weather", "moodThemeFilter"].includes(prepared.type)) {
        prepared._tokens = tokens(prepared.value || (prepared.type === "weather" ? "rain" : ""));
      }
      if (prepared.type === "yearRange") prepared._yearRange = parseYearRange(prepared);
      if (prepared.type === "rivalArtists" || prepared.type === "artistSpacing") prepared._rivalGroups = rivalGroups(prepared);
      if (prepared.type === "forbiddenGenreCombo" || prepared.type === "genreFlow") prepared._forbiddenPairs = forbiddenPairs(prepared);
      if (prepared.type === "weather") {
        prepared._weatherTerms = prepared._tokens.flatMap((item) => WEATHER_TERMS[item] || [item]);
      }
      if (prepared.type === "moodThemeFilter") {
        prepared._themeTerms = prepared._tokens.flatMap((item) => WEATHER_TERMS[item] || [item]);
      }
      return prepared;
    });
  }

  function hasGenre(track, genre) {
    return trackGenres(track).some((candidate) => candidate.includes(genre));
  }

  function violatesTransition(candidate, output, rules, context, pass) {
    const candidateFirst = firstTrack(candidate);
    const last = lastTrack(output[output.length - 1]);
    const flatOutput = context.outputTracks || output.flatMap(unitTracks);
    const candidateTracks = unitTracks(candidate);
    for (const rule of rules) {
      if (rule.type === "singalongEvery" && shouldEnforceRule(rule, pass)) {
        const interval = singalongInterval(rule);
        for (let index = 0; index < candidateTracks.length; index += 1) {
          const position = flatOutput.length + index + 1;
          if (position % interval === 0 && !isFamiliar(candidateTracks[index], context)) return true;
        }
      }
      if (rule.type === "noArtistRepeat" && shouldEnforceRule(rule, pass)) {
        const distance = Math.max(1, ruleNumber(rule, ["distance", "count"], 8));
        const recent = flatOutput.slice(-distance);
        if (recent.some((track) => lowerText(track.artist) === lowerText(candidateFirst.artist))) return true;
      }
      if (rule.type === "rivalArtists" && shouldEnforceRule(rule, pass)) {
        const distance = Math.max(1, ruleNumber(rule, ["distance", "count"], 2));
        const recent = flatOutput.slice(-distance);
        if (recent.some((track) => areRivals(track, candidateFirst, rule))) return true;
      }
      if (rule.type === "artistSpacing" && shouldEnforceRule(rule, pass)) {
        const artist = lowerText(candidateFirst.artist);
        const sameDistance = artistSpacingSameDistance(rule);
        if (artist && sameDistance > 0 && flatOutput.slice(-sameDistance).some((track) => lowerText(track.artist) === artist)) return true;
        const rivalDistance = artistSpacingRivalDistance(rule);
        if (rivalDistance > 0 && flatOutput.slice(-rivalDistance).some((track) => areRivals(track, candidateFirst, rule))) return true;
      }
      if (rule.type === "artistRun" && shouldEnforceHardRule(rule, pass)) {
        const distance = artistRepeatCooldown(rule);
        if (distance > 0) {
          const artist = lowerText(candidateFirst.artist);
          const recent = flatOutput.slice(-distance);
          if (artist && recent.some((track) => lowerText(track.artist) === artist)) return true;
        }
      }
      if ((rule.type === "forbiddenGenreCombo" || rule.type === "genreFlow") && last && shouldEnforceRule(rule, pass)) {
        for (const [left, right] of forbiddenPairs(rule)) {
          if (hasGenre(last, left) && hasGenre(candidateFirst, right)) return true;
        }
      }
      if (rule.type === "noVibeCrash" && last && shouldEnforceRule(rule, pass)) {
        const threshold = Math.max(1, ruleNumber(rule, ["threshold", "distance"], 4));
        const leftEnergy = inferredEnergy(last);
        const rightEnergy = inferredEnergy(candidateFirst);
        const sharedGenre = trackGenres(last).some((genre) => trackGenres(candidateFirst).includes(genre));
        const sharedMood = trackMoods(last).some((mood) => trackMoods(candidateFirst).includes(mood));
        if (leftEnergy && rightEnergy && Math.abs(leftEnergy - rightEnergy) > threshold && !sharedGenre && !sharedMood) return true;
      }
      if (rule.type === "yearChain" && last && shouldEnforceRule(rule, pass, true)) {
        const leftYear = trackYear(last);
        const rightYear = trackYear(candidateFirst);
        if (leftYear && rightYear && Math.abs(leftYear - rightYear) > 1) return true;
      }
      if (rule.type === "releaseDateFlow" && releaseDateMode(rule) === "year-chain" && last && shouldEnforceRule(rule, pass, true)) {
        const leftYear = trackYear(last);
        const rightYear = trackYear(candidateFirst);
        if (leftYear && rightYear && Math.abs(leftYear - rightYear) > 1) return true;
      }
      if (rule.type === "titleChain" && last && shouldEnforceHardRule(rule, pass, true)) {
        const needed = titleLetters(last.title, { ignoreThe: chainIgnoresThe(rule) }).last;
        if (needed && unitStartLetter(candidate, rule) !== needed) return true;
      }
      if (rule.type === "bpmClimb" && last && shouldEnforceRule(rule, pass, true)) {
        const leftBpm = trackBpm(last);
        const rightBpm = trackBpm(candidateFirst);
        if (leftBpm && rightBpm && rightBpm < leftBpm) return true;
      }
      if (rule.type === "bpmDrop" && last && shouldEnforceRule(rule, pass, true)) {
        const leftBpm = trackBpm(last);
        const rightBpm = trackBpm(candidateFirst);
        if (leftBpm && rightBpm && rightBpm > leftBpm) return true;
      }
      if (rule.type === "energyFlow" && last && shouldEnforceRule(rule, pass, true)) {
        const mode = energyFlowMode(rule);
        const position = flatOutput.length + 1;
        const segment = energyFlowSegment(rule);
        const waveDrops = mode.endsWith("-wave") && Math.floor((position - 1) / segment) % 2 === 1;
        const metric = mode.startsWith("energy") ? "energy" : "bpm";
        const direction = mode.endsWith("-drop") || waveDrops ? "drop" : mode.endsWith("-climb") || mode.endsWith("-wave") ? "climb" : "";
        const leftValue = metric === "energy" ? inferredEnergy(last) : trackBpm(last);
        const rightValue = metric === "energy" ? inferredEnergy(candidateFirst) : trackBpm(candidateFirst);
        if (leftValue && rightValue && direction === "climb" && rightValue < leftValue) return true;
        if (leftValue && rightValue && direction === "drop" && rightValue > leftValue) return true;
        const threshold = energyFlowThreshold(rule);
        const leftEnergy = inferredEnergy(last);
        const rightEnergy = inferredEnergy(candidateFirst);
        if (threshold > 0 && leftEnergy && rightEnergy && Math.abs(leftEnergy - rightEnergy) > threshold) return true;
      }
    }
    return false;
  }

  function scoreCandidate(candidate, output, rules, context, initialIndex) {
    const track = firstTrack(candidate);
    let score = -initialIndex / 1000;
    const position = (context.outputTracks || output.flatMap(unitTracks)).length + 1;
    const last = lastTrack(output[output.length - 1]);

    for (const rule of rules) {
      if (rule.type === "neglectedArtist") {
        const artistSummary = context.artistSummaries?.get(lowerText(track.artist));
        const trackCount = artistSummary?.trackCount || 0;
        const plays = artistSummary?.playCount || 0;
        score += Math.max(0, trackCount * 2 - plays);
        if (!lastPlayedAt(track, context)) score += 2;
      }
      if (rule.type === "discoveryBias" && ["neglected-artist", "mix"].includes(discoveryMode(rule))) {
        const artistSummary = context.artistSummaries?.get(lowerText(track.artist));
        const trackCount = artistSummary?.trackCount || 0;
        const plays = artistSummary?.playCount || 0;
        score += Math.max(0, trackCount * 2 - plays);
        if (!lastPlayedAt(track, context)) score += 2;
      }
      if (rule.type === "deepCut") {
        const maxPlays = Math.max(0, ruleNumber(rule, ["maxPlays", "count"], 2));
        if (isDeepCut(track, context, maxPlays)) score += 4;
        if (last && lowerText(last.artist) === lowerText(track.artist) && playCount(last, context) >= 5 && isDeepCut(track, context, maxPlays)) score += 8;
        if (playCount(track, context) >= 10) score -= 2;
      }
      if (rule.type === "discoveryBias" && ["deep-cut", "mix"].includes(discoveryMode(rule))) {
        const maxPlays = Math.max(0, ruleNumber(rule, ["maxPlays", "count"], 2));
        if (isDeepCut(track, context, maxPlays)) score += 4;
        if (playCount(track, context) >= 10) score -= 2;
      }
      if (rule.type === "albumPairing" && last && lowerText(last.album) === lowerText(track.album) && lowerText(last.title) !== lowerText(track.title)) score += 7;
      if (rule.type === "singalongEvery") {
        const interval = singalongInterval(rule);
        const familiar = isFamiliar(track, context);
        if (position % interval === 0) score += familiar ? 20 : -40;
        else if (familiar) score -= 8;
      }
      if (rule.type === "energyRollercoaster") {
        const pattern = ["low", "medium", "high", "medium"];
        const target = pattern[(position - 1) % pattern.length];
        score += energyBucket(track) === target ? 6 : 0;
      }
      if (rule.type === "yearChain" && last) {
        const leftYear = trackYear(last);
        const rightYear = trackYear(track);
        if (leftYear && rightYear) score += Math.max(0, 4 - Math.abs(leftYear - rightYear));
      }
      if (rule.type === "releaseDateFlow" && releaseDateMode(rule) === "year-chain" && last) {
        const leftYear = trackYear(last);
        const rightYear = trackYear(track);
        if (leftYear && rightYear) score += Math.max(0, 4 - Math.abs(leftYear - rightYear));
      }
      if (rule.type === "bpmClimb" && last) {
        const leftBpm = trackBpm(last);
        const rightBpm = trackBpm(track);
        if (leftBpm && rightBpm && rightBpm >= leftBpm) score += 20 - Math.min(20, rightBpm - leftBpm);
      }
      if (rule.type === "bpmClimb" && !last) {
        const bpm = trackBpm(track);
        if (bpm) score += 300 - bpm;
      }
      if (rule.type === "bpmDrop" && last) {
        const leftBpm = trackBpm(last);
        const rightBpm = trackBpm(track);
        if (leftBpm && rightBpm && rightBpm <= leftBpm) score += 20 - Math.min(20, leftBpm - rightBpm);
      }
      if (rule.type === "bpmDrop" && !last) {
        const bpm = trackBpm(track);
        if (bpm) score += bpm;
      }
      if (rule.type === "energyFlow") {
        const mode = energyFlowMode(rule);
        if (mode.endsWith("-wave")) {
          const pattern = mode.startsWith("energy") ? ["low", "medium", "high", "medium"] : null;
          if (pattern) score += energyBucket(track) === pattern[(position - 1) % pattern.length] ? 6 : 0;
        }
        if (!last && mode.startsWith("bpm")) {
          const bpm = trackBpm(track);
          if (bpm) score += mode.includes("drop") ? bpm : 300 - bpm;
        }
        if (last && mode.startsWith("bpm")) {
          const leftBpm = trackBpm(last);
          const rightBpm = trackBpm(track);
          if (leftBpm && rightBpm && mode.includes("climb") && rightBpm >= leftBpm) score += 20 - Math.min(20, rightBpm - leftBpm);
          if (leftBpm && rightBpm && mode.includes("drop") && rightBpm <= leftBpm) score += 20 - Math.min(20, leftBpm - rightBpm);
        }
      }
    }
    score += Math.random() / 100;
    return score;
  }

  function canUseFastTitleChain(rules) {
    const needsGreedyScoring = new Set([
      "albumPairing",
      "artistRun",
      "artistSpacing",
      "bpmClimb",
      "bpmDrop",
      "deepCut",
      "discoveryBias",
      "energyFlow",
      "energyRollercoaster",
      "forbiddenGenreCombo",
      "genreFlow",
      "neglectedArtist",
      "noArtistRepeat",
      "noVibeCrash",
      "releaseDateFlow",
      "rivalArtists",
      "singalongEvery",
      "yearChain"
    ]);
    return rules.some((rule) => rule.type === "titleChain")
      && !rules.some((rule) => needsGreedyScoring.has(rule.type));
  }

  function arrangeTitleChainFast(units, context, rule) {
    if (units.length <= 1) return units;
    const buckets = new Map();
    for (const unit of units) {
      const letter = unitStartLetter(unit, rule);
      if (!buckets.has(letter)) buckets.set(letter, []);
      buckets.get(letter).push(unit);
    }

    const arranged = [];
    const used = new Set();
    let fallbackIndex = 0;
    let previousUnit = context.seedUnit || null;
    let remaining = units.length;

    function takeFromBucket(letter) {
      const bucket = buckets.get(letter);
      while (bucket?.length) {
        const unit = bucket.shift();
        if (!used.has(unit)) {
          used.add(unit);
          remaining -= 1;
          return unit;
        }
      }
      return null;
    }

    function takeFallback() {
      while (fallbackIndex < units.length && used.has(units[fallbackIndex])) fallbackIndex += 1;
      const unit = units[fallbackIndex];
      if (!unit) return null;
      fallbackIndex += 1;
      used.add(unit);
      remaining -= 1;
      return unit;
    }

    while (remaining > 0) {
      const needed = previousUnit ? unitEndLetter(previousUnit, rule) : "";
      const unit = needed ? takeFromBucket(needed) : takeFallback();
      if (!unit) break;
      arranged.push(unit);
      previousUnit = unit;
    }

    return arranged;
  }

  function chooseCandidate(remaining, output, rules, context, pass) {
    let chosen = null;
    let bestScore = -Infinity;
    for (let index = 0; index < remaining.length; index += 1) {
      const unit = remaining[index];
      if (pass !== null && violatesTransition(unit, output, rules, context, pass)) continue;
      const score = scoreCandidate(unit, output, rules, context, index);
      if (!chosen || score > bestScore) {
        chosen = { unit, index };
        bestScore = score;
      }
    }
    return chosen;
  }

  function greedyArrange(units, rules, context) {
    if (units.length <= 1) return units;
    const remaining = units.slice();
    const output = [];
    if (context.seedUnit) output.push(context.seedUnit);
    const outputTracks = output.flatMap(unitTracks);
    const previousOutputTracks = context.outputTracks;

    try {
      context.outputTracks = outputTracks;
      while (remaining.length) {
        const chosen = chooseCandidate(remaining, output, rules, context, "ideal")
          || chooseCandidate(remaining, output, rules, context, "normal")
          || chooseCandidate(remaining, output, rules, context, "strictOnly")
          || chooseCandidate(remaining, output, rules, context, null);
        if (!chosen) break;
        const [unit] = remaining.splice(chosen.index, 1);
        output.push(unit);
        outputTracks.push(...unitTracks(unit));
      }
    } finally {
      if (previousOutputTracks === undefined) delete context.outputTracks;
      else context.outputTracks = previousOutputTracks;
    }

    return context.seedUnit ? output.slice(1) : output;
  }

  function buildQueueFromUnits(units, options = {}) {
    const profile = migrateProfile(options.profile || {});
    const rules = prepareRules(profile.rules);
    const allTracks = options.allTracks || units.flatMap(unitTracks);
    const context = {
      statsById: options.statsById || {},
      allTracks,
      artistSummaries: buildArtistSummaries(allTracks, options.statsById || {}),
      seedUnit: options.seedUnit || null
    };
    const seedIds = new Set(unitTracks(context.seedUnit).map((track) => track.id));
    let candidates = units.filter((unit) => !unitTracks(unit).some((track) => seedIds.has(track.id)));
    candidates = filterUnits(candidates, rules, context);
    candidates = applyInitialOrdering(candidates, rules, options.shuffle !== false);
    candidates = canUseFastTitleChain(rules) ? arrangeTitleChainFast(candidates, context, rules.find((rule) => rule.type === "titleChain")) : greedyArrange(candidates, rules, context);
    const queue = (context.seedUnit ? [context.seedUnit] : []).concat(candidates).flatMap(unitTracks);
    return queue;
  }

  function buildQueue(tracks, options = {}) {
    const units = tracks.map((track) => [track]);
    const seed = options.seedId ? tracks.find((track) => track.id === options.seedId || track.ratingKey === options.seedId) : null;
    return buildQueueFromUnits(units, {
      ...options,
      seedUnit: seed ? [seed] : null,
      allTracks: tracks
    });
  }

  return {
    PRESETS,
    RULE_DEFINITIONS,
    buildQueue,
    buildQueueFromUnits,
    migrateProfile,
    profileRules,
    profileSummary,
    tokens,
    inferredEnergy,
    titleMatchesPattern
  };
});
