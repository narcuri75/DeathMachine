(function attachRecommendationEngine(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.VoidFMRecommendations = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function makeRecommendationEngine() {
  const artistSimilarityIndexCache = typeof WeakMap === "function" ? new WeakMap() : null;

  function cleanText(value) {
    return String(value || "").trim();
  }

  function lowerText(value) {
    return cleanText(value).toLowerCase();
  }

  function normalizedName(value) {
    return lowerText(value)
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\bthe\b/g, " ")
      .replace(/[^a-z0-9]+/g, " ")
      .trim()
      .replace(/\s+/g, " ");
  }

  function arrayFrom(value) {
    if (Array.isArray(value)) return value;
    if (value === undefined || value === null || value === "") return [];
    return [value];
  }

  function uniqueValues(values) {
    const seen = new Set();
    const items = [];
    for (const value of values.map(cleanText).filter(Boolean)) {
      const key = normalizedName(value);
      if (!key || seen.has(key)) continue;
      seen.add(key);
      items.push(value);
    }
    return items;
  }

  function addCount(map, value, amount = 1) {
    const label = cleanText(value);
    const key = normalizedName(label);
    if (!key) return;
    const existing = map.get(key) || { label, count: 0 };
    existing.count += amount;
    map.set(key, existing);
  }

  function numericValue(value) {
    const number = Number(value);
    return Number.isFinite(number) && number > 0 ? number : 0;
  }

  function median(values) {
    const numbers = values.map(numericValue).filter(Boolean).sort((left, right) => left - right);
    if (!numbers.length) return 0;
    const midpoint = Math.floor(numbers.length / 2);
    return numbers.length % 2 ? numbers[midpoint] : (numbers[midpoint - 1] + numbers[midpoint]) / 2;
  }

  function albumArtistFor(track) {
    return track?.albumArtist || track?.artist || "Unknown Artist";
  }

  function releaseDateFor(track) {
    return track?.releaseDate || (track?.year ? `${track.year}-01-01` : "");
  }

  function dateValue(value) {
    const time = Date.parse(value || "");
    return Number.isFinite(time) ? time : 0;
  }

  function trackNumberValue(track) {
    const disc = Number(track?.discNumber || 0);
    const number = Number(track?.trackNumber || 0);
    return (Number.isFinite(disc) ? disc : 0) * 1000 + (Number.isFinite(number) ? number : 0);
  }

  function mapScore(map, values, weight) {
    let score = 0;
    for (const value of arrayFrom(values)) {
      const item = map.get(normalizedName(value));
      if (!item) continue;
      score += weight + Math.min(6, item.count);
    }
    return score;
  }

  function hasMapValue(map, value) {
    return map.has(normalizedName(value));
  }

  function mapTotal(map) {
    return Array.from(map.values()).reduce((total, item) => total + Number(item.count || 0), 0);
  }

  function weightedOverlap(leftMap, rightMap, weight) {
    let score = 0;
    for (const [key, left] of leftMap.entries()) {
      const right = rightMap.get(key);
      if (!right) continue;
      score += weight + Math.min(4, Math.log2(1 + Math.min(Number(left.count || 0), Number(right.count || 0))));
    }
    return score;
  }

  const BROAD_ARTIST_SIMILARITY_TERMS = new Set([
    "acoustic",
    "aggressive",
    "danceable",
    "electronic",
    "happy",
    "heavy metal",
    "hip hop",
    "hip hop music",
    "hip hop rap",
    "metal",
    "party",
    "pop",
    "pop rock",
    "rap",
    "rap and hip hop",
    "relaxed",
    "rock",
    "sad"
  ]);

  function isSpecificArtistSignal(value) {
    const key = normalizedName(value);
    return key.length > 2 && !BROAD_ARTIST_SIMILARITY_TERMS.has(key);
  }

  function playlistProfile(playlistTracks = []) {
    const tracks = playlistTracks.filter(Boolean);
    const profile = {
      total: tracks.length,
      artists: new Map(),
      albumArtists: new Map(),
      albums: new Map(),
      genres: new Map(),
      moods: new Map(),
      tags: new Map(),
      similarArtists: new Map(),
      bpm: 0,
      energy: 0,
      year: 0
    };

    const bpms = [];
    const energies = [];
    const years = [];
    for (const track of tracks) {
      addCount(profile.artists, track.artist);
      addCount(profile.albumArtists, albumArtistFor(track));
      addCount(profile.albums, track.album);
      arrayFrom(track.genres).filter(isSpecificArtistSignal).forEach((value) => addCount(profile.genres, value));
      arrayFrom(track.moods).forEach((value) => addCount(profile.moods, value));
      arrayFrom(track.tags).forEach((value) => addCount(profile.tags, value));
      arrayFrom(track.similarArtists).forEach((value) => addCount(profile.similarArtists, value));
      if (numericValue(track.bpm)) bpms.push(Number(track.bpm));
      if (numericValue(track.energy)) energies.push(Number(track.energy));
      if (numericValue(track.year)) years.push(Number(track.year));
    }

    profile.bpm = median(bpms);
    profile.energy = median(energies);
    profile.year = median(years);
    return profile;
  }

  function candidateScore(track, profile, stats = {}) {
    if (!track || !profile?.total) return 0;
    let score = 0;

    if (hasMapValue(profile.similarArtists, track.artist)) score += 34;
    if (arrayFrom(track.similarArtists).some((name) => hasMapValue(profile.artists, name) || hasMapValue(profile.albumArtists, name))) {
      score += 26;
    }

    score += mapScore(profile.artists, [track.artist], 12);
    score += mapScore(profile.albumArtists, [albumArtistFor(track)], 9);
    score += mapScore(profile.albums, [track.album], 5);
    score += mapScore(profile.genres, track.genres, 11);
    score += mapScore(profile.moods, track.moods, 8);
    score += mapScore(profile.tags, track.tags, 6);

    const bpm = numericValue(track.bpm);
    if (profile.bpm && bpm) {
      const gap = Math.abs(profile.bpm - bpm);
      if (gap <= 6) score += 10;
      else if (gap <= 12) score += 7;
      else if (gap <= 24) score += 3;
    }

    const energy = numericValue(track.energy);
    if (profile.energy && energy) {
      const gap = Math.abs(profile.energy - energy);
      if (gap <= 1) score += 7;
      else if (gap <= 2) score += 4;
    }

    const year = numericValue(track.year);
    if (profile.year && year) {
      const gap = Math.abs(profile.year - year);
      if (gap <= 3) score += 4;
      else if (gap <= 8) score += 2;
    }

    const plays = Number(stats.playCount ?? track.playCount ?? 0);
    const skips = Number(stats.skipCount ?? track.skipCount ?? 0);
    const rating = Number(track.rating || 0);
    if (track.liked || rating >= 8) score += 5;
    else if (rating >= 6) score += 2;
    if (plays > 0) score += Math.min(5, Math.log2(plays + 1));
    if (skips > 0) score -= Math.min(6, skips);

    return score;
  }

  function playlistRecommendations(options = {}) {
    const playlistTracks = options.playlistTracks || [];
    const candidateTracks = options.candidateTracks || [];
    const existingIds = new Set(arrayFrom(options.existingTrackIds).map(String));
    const statsById = options.statsById || {};
    const limit = Math.max(1, Number(options.limit || 12));
    const maxPerArtist = Math.max(1, Number(options.maxPerArtist || 3));
    const minimumScore = Number(options.minimumScore || 18);
    const profile = playlistProfile(playlistTracks);
    if (!profile.total) return [];

    const scored = candidateTracks
      .filter((track) => track?.id && !existingIds.has(String(track.id)))
      .map((track) => ({ track, score: candidateScore(track, profile, statsById[track.id] || {}) }))
      .filter((item) => item.score >= minimumScore)
      .sort((left, right) => right.score - left.score || cleanText(left.track.title).localeCompare(cleanText(right.track.title), undefined, { sensitivity: "base", numeric: true }));

    const selected = [];
    const artistCounts = new Map();
    const deferred = [];
    for (const item of scored) {
      const artistKey = normalizedName(item.track.artist || "Unknown Artist");
      const count = artistCounts.get(artistKey) || 0;
      if (count >= maxPerArtist) {
        deferred.push(item);
        continue;
      }
      artistCounts.set(artistKey, count + 1);
      selected.push(item);
      if (selected.length >= limit) return selected;
    }

    for (const item of deferred) {
      selected.push(item);
      if (selected.length >= limit) break;
    }
    return selected;
  }

  function trackPopularityScore(track, stats = {}) {
    const plays = Number(stats.playCount ?? track?.playCount ?? 0);
    const listenedMinutes = Number(stats.totalListenMs || 0) / 60000;
    const skips = Number(stats.skipCount ?? track?.skipCount ?? 0);
    const rating = Number(track?.rating || 0);
    return listenedMinutes + plays * 8 + rating * 6 + (track?.liked ? 18 : 0) - skips * 3;
  }

  function artistTopTracks(tracks = [], options = {}) {
    const statsById = options.statsById || {};
    const limit = Math.max(1, Number(options.limit || 10));
    return tracks
      .filter(Boolean)
      .slice()
      .sort((left, right) => {
        const score = trackPopularityScore(right, statsById[right.id] || {}) - trackPopularityScore(left, statsById[left.id] || {});
        return score || cleanText(left.title).localeCompare(cleanText(right.title), undefined, { sensitivity: "base", numeric: true });
      })
      .slice(0, limit);
  }

  function artistAlbums(tracks = []) {
    const groups = new Map();
    for (const track of tracks.filter(Boolean)) {
      const key = `${normalizedName(albumArtistFor(track))}\u001f${normalizedName(track.album || "Unknown Album")}`;
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
      if (!album.year && track.year) album.year = track.year;
      if (!album.releaseDate && releaseDateFor(track)) album.releaseDate = releaseDateFor(track);
    }

    return Array.from(groups.values())
      .map((album) => ({
        ...album,
        tracks: album.tracks.slice().sort((left, right) => {
          const leftNumber = trackNumberValue(left);
          const rightNumber = trackNumberValue(right);
          if (leftNumber || rightNumber) return leftNumber - rightNumber || cleanText(left.title).localeCompare(cleanText(right.title), undefined, { sensitivity: "base", numeric: true });
          return cleanText(left.title).localeCompare(cleanText(right.title), undefined, { sensitivity: "base", numeric: true });
        })
      }))
      .sort((left, right) => cleanText(left.title).localeCompare(cleanText(right.title), undefined, { sensitivity: "base", numeric: true })
        || dateValue(left.releaseDate) - dateValue(right.releaseDate));
  }

  function artistSummariesFromTracks(tracks = []) {
    const groups = new Map();
    for (const track of tracks.filter(Boolean)) {
      const name = track.artist || "Unknown Artist";
      const key = normalizedName(name);
      if (!groups.has(key)) {
        groups.set(key, { name, tracks: [], albums: new Set(), cover: track });
      }
      const group = groups.get(key);
      group.tracks.push(track);
      group.albums.add(track.album || "Unknown Album");
      if (!group.cover?.thumb && track.thumb) group.cover = track;
    }
    return groups;
  }

  function artistSimilarityIndex(allTracks = []) {
    if (artistSimilarityIndexCache && allTracks && typeof allTracks === "object") {
      const cached = artistSimilarityIndexCache.get(allTracks);
      if (cached) return cached;
    }

    const groups = artistSummariesFromTracks(allTracks);
    const profiles = new Map();
    for (const [key, summary] of groups.entries()) {
      profiles.set(key, artistProfile(summary.tracks));
    }
    const index = { groups, profiles };
    if (artistSimilarityIndexCache && allTracks && typeof allTracks === "object") {
      artistSimilarityIndexCache.set(allTracks, index);
    }
    return index;
  }

  function artistProfile(tracks = []) {
    const profile = {
      total: 0,
      genres: new Map(),
      moods: new Map(),
      tags: new Map(),
      similarArtists: new Map(),
      bpm: 0,
      energy: 0,
      year: 0
    };
    const bpms = [];
    const energies = [];
    const years = [];
    for (const track of tracks.filter(Boolean)) {
      profile.total += 1;
      arrayFrom(track.genres).filter(isSpecificArtistSignal).forEach((value) => addCount(profile.genres, value));
      arrayFrom(track.moods).filter(isSpecificArtistSignal).forEach((value) => addCount(profile.moods, value));
      arrayFrom(track.tags).filter(isSpecificArtistSignal).forEach((value) => addCount(profile.tags, value));
      arrayFrom(track.similarArtists).forEach((value) => addCount(profile.similarArtists, value));
      if (numericValue(track.bpm)) bpms.push(Number(track.bpm));
      if (numericValue(track.energy)) energies.push(Number(track.energy));
      if (numericValue(track.year)) years.push(Number(track.year));
    }
    profile.bpm = median(bpms);
    profile.energy = median(energies);
    profile.year = median(years);
    profile.signalCount = mapTotal(profile.genres) + mapTotal(profile.moods) + mapTotal(profile.tags);
    return profile;
  }

  function playlistArtistAffinity(artistName, allTracks = [], playlists = []) {
    const selectedKey = normalizedName(artistName);
    const trackArtistById = new Map(allTracks.filter(Boolean).map((track) => [String(track.id), track.artist || "Unknown Artist"]));
    const scores = new Map();
    for (const playlist of arrayFrom(playlists)) {
      const artists = new Set(arrayFrom(playlist?.trackIds).map((trackId) => normalizedName(trackArtistById.get(String(trackId)))).filter(Boolean));
      if (artists.size <= 1 || artists.size > 80 || arrayFrom(playlist?.trackIds).length > 250) continue;
      if (!artists.has(selectedKey)) continue;
      const contribution = Math.min(24, 120 / artists.size);
      for (const key of artists) {
        if (key && key !== selectedKey) scores.set(key, (scores.get(key) || 0) + contribution);
      }
    }
    return scores;
  }

  function profileSimilarityScore(selectedProfile, candidateProfile) {
    if (!selectedProfile?.total || !candidateProfile?.total) return 0;
    if (candidateProfile.total < 2) return 0;
    return weightedOverlap(selectedProfile.genres, candidateProfile.genres, 12)
      + weightedOverlap(selectedProfile.tags, candidateProfile.tags, 9);
  }

  function similarLibraryArtists(artistName, artistTracks = [], allTracks = [], options = {}) {
    const limit = Math.max(1, Number(options.limit || 8));
    const selectedKey = normalizedName(artistName);
    const { groups: artistGroups, profiles: artistProfiles } = artistSimilarityIndex(allTracks);
    const selectedProfile = artistProfile(artistTracks);
    const minimumScore = options.minimumScore === undefined
      ? selectedProfile.signalCount > 0 ? 18 : 7
      : Number(options.minimumScore || 0);
    const playlistScores = playlistArtistAffinity(artistName, allTracks, options.playlists || []);
    const explicitNames = new Set();
    for (const track of artistTracks) {
      for (const name of uniqueValues(track?.similarArtists || [])) {
        const key = normalizedName(name);
        if (key && key !== selectedKey) explicitNames.add(key);
      }
    }

    const scored = [];
    for (const [key, summary] of artistGroups.entries()) {
      if (!key || key === selectedKey) continue;
      let score = explicitNames.has(key) ? 30 : 0;
      if (summary.tracks.some((track) => arrayFrom(track.similarArtists).some((name) => normalizedName(name) === selectedKey))) {
        score += 24;
      }
      score += profileSimilarityScore(selectedProfile, artistProfiles.get(key) || artistProfile(summary.tracks));
      score += Math.min(18, playlistScores.get(key) || 0);
      if (score >= minimumScore) scored.push({ ...summary, score });
    }

    return scored
      .sort((left, right) => right.score - left.score || cleanText(left.name).localeCompare(cleanText(right.name), undefined, { sensitivity: "base", numeric: true }))
      .slice(0, limit);
  }

  return {
    playlistProfile,
    playlistRecommendations,
    candidateScore,
    artistTopTracks,
    artistAlbums,
    similarLibraryArtists,
    artistProfile,
    normalizedName
  };
});
