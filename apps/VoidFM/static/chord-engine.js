(function attachChordEngine(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.VoidFMChords = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function makeChordEngine() {
  const NOTE_NAMES = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];
  const NOTE_ALIASES = {
    "B#": "C",
    Cb: "B",
    Db: "C#",
    "D#": "Eb",
    "E#": "F",
    Fb: "E",
    Gb: "F#",
    "G#": "Ab",
    "A#": "Bb"
  };
  const CHORD_TYPES = [
    { suffix: "", intervals: [0, 4, 7] },
    { suffix: "m", intervals: [0, 3, 7] },
    { suffix: "7", intervals: [0, 4, 7, 10] },
    { suffix: "maj7", intervals: [0, 4, 7, 11] },
    { suffix: "m7", intervals: [0, 3, 7, 10] },
    { suffix: "sus2", intervals: [0, 2, 7] },
    { suffix: "sus4", intervals: [0, 5, 7] },
    { suffix: "dim", intervals: [0, 3, 6] },
    { suffix: "aug", intervals: [0, 4, 8] }
  ];
  const ALLOWED_PROVIDERS = new Set(["voidfm-detector", "isophonics", "manual"]);
  const ALLOWED_SOURCE_TYPES = new Set(["generated", "annotation", "manual"]);
  const ALIGNMENT_VERSION = 5;
  const windowCache = new Map();
  const SECTION_DIRECTIVE_PATTERN = /^\{(?:start_of_|s)?(?:verse|chorus|bridge|intro|outro|section|part)(?:_of_[^:]+)?(?::\s*([^}]+))?\}$/i;
  const METADATA_DIRECTIVE_PATTERN = /^\{([^:}]+):\s*([^}]+)\}$/;

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function cleanText(value) {
    return String(value || "").trim();
  }

  function compactWhitespace(value) {
    return cleanText(value).replace(/\s+/g, " ");
  }

  function normalizeRoot(letter, accidental = "") {
    const raw = `${String(letter || "").toUpperCase()}${accidental || ""}`;
    return NOTE_ALIASES[raw] || raw;
  }

  function normalizeChordSuffix(value = "") {
    const compact = String(value || "")
      .replace(/\([^)]*\)/g, "")
      .replace(/\s+/g, "")
      .replace(/^:/, "")
      .replace(/^maj$/i, "")
      .replace(/^major$/i, "")
      .replace(/^min$/i, "m")
      .replace(/^minor$/i, "m")
      .replace(/^mmaj7$/i, "m7")
      .replace(/^mmin7$/i, "m7");
    const lower = compact.toLowerCase();
    if (!lower || lower === "maj") return "";
    if (lower === "m" || lower === "-") return "m";
    if (lower === "7" || lower === "dom7") return "7";
    if (lower === "maj7" || lower === "ma7" || lower === "m7+") return "maj7";
    if (lower === "m7" || lower === "min7" || lower === "-7") return "m7";
    if (/^m?add(?:2|4|6|9|11|13)$/i.test(compact)) {
      const match = lower.match(/^(m?)add(2|4|6|9|11|13)$/);
      return `${match[1]}add${match[2]}`;
    }
    if (/^m?(?:6|9|11|13)$/i.test(compact)) {
      const match = lower.match(/^(m?)(6|9|11|13)$/);
      return `${match[1]}${match[2]}`;
    }
    if (lower === "sus2") return "sus2";
    if (lower === "sus" || lower === "sus4") return "sus4";
    if (lower === "5") return "5";
    if (lower === "dim7") return "dim7";
    if (lower === "m7b5" || lower === "min7b5" || lower === "\u00f8") return "m7b5";
    if (lower === "dim" || lower === "o") return "dim";
    if (lower === "aug" || lower === "+") return "aug";
    return "";
  }

  function normalizeChordLabel(value) {
    const raw = cleanText(value)
      .replace(/\u266d/g, "b")
      .replace(/\u266f/g, "#");
    if (!raw || /^n(?:o\s*chord)?$/i.test(raw) || /^none$/i.test(raw)) return "N";
    const withoutBass = raw.split("/")[0];
    const colonNormalized = withoutBass
      .replace(/:maj7/i, "maj7")
      .replace(/:min7/i, "m7")
      .replace(/:maj/i, "")
      .replace(/:min/i, "m")
      .replace(/:dim/i, "dim")
      .replace(/:aug/i, "aug");
    const match = colonNormalized.match(/^([A-Ga-g])([#b]?)(.*)$/);
    if (!match) return "N";
    const root = normalizeRoot(match[1], match[2]);
    if (!NOTE_NAMES.includes(root)) return "N";
    return `${root}${normalizeChordSuffix(match[3])}`;
  }

  function cleanChordToken(value = "") {
    return String(value || "")
      .trim()
      .replace(/^[|([{]+/, "")
      .replace(/[|\])},;:]+$/g, "")
      .replace(/\u266d/g, "b")
      .replace(/\u266f/g, "#");
  }

  function isChordToken(value) {
    const token = cleanChordToken(value);
    if (!token || /^x\d+$/i.test(token) || /^%+$/.test(token)) return false;
    return /^[A-Ga-g][#b]?(?::?(?:maj|min|m|major|minor|7|maj7|min7|m7|m?add(?:2|4|6|9|11|13)|m?(?:6|9|11|13)|sus|sus2|sus4|5|dim|dim7|m7b5|min7b5|\u00f8|aug|\+|o|-)?)(?:\/[A-Ga-g][#b]?)?$/.test(token)
      && normalizeChordLabel(token) !== "N";
  }

  function summaryChords(changes = []) {
    const seen = new Set();
    const output = [];
    for (const change of changes) {
      const chord = normalizeChordLabel(change?.chord);
      if (!chord || chord === "N" || seen.has(chord)) continue;
      seen.add(chord);
      output.push(chord);
    }
    return output;
  }

  function normalizeLyricText(value = "") {
    return String(value || "")
      .toLowerCase()
      .replace(/\[[^\]]+\]/g, " ")
      .replace(/\{[^}]+\}/g, " ")
      .replace(/&/g, " and ")
      .replace(/[''`]/g, "")
      .replace(/[^a-z0-9]+/g, " ")
      .trim()
      .replace(/\s+/g, " ");
  }

  function lyricMatchScore(left = "", right = "") {
    const a = normalizeLyricText(left);
    const b = normalizeLyricText(right);
    if (!a || !b) return 0;
    if (a === b) return 1;
    if (a.length > 8 && b.includes(a)) return 0.94;
    if (b.length > 8 && a.includes(b)) return 0.9;
    const leftTokens = new Set(a.split(" ").filter((token) => token.length > 1));
    const rightTokens = new Set(b.split(" ").filter((token) => token.length > 1));
    if (!leftTokens.size || !rightTokens.size) return 0;
    let overlap = 0;
    for (const token of leftTokens) {
      if (rightTokens.has(token)) overlap += 1;
    }
    return (2 * overlap) / (leftTokens.size + rightTokens.size);
  }

  function isMetadataLine(line = "") {
    const text = cleanText(line);
    return /^(?:tuning|capo|key|difficulty|author|submitted|rating|tempo|bpm)\b/i.test(text)
      || /\btuning\b/i.test(text)
      || /\bcapo\b/i.test(text);
  }

  function sectionNameFromLine(line = "") {
    const trimmed = cleanText(line);
    const bracket = trimmed.match(/^\[([^\]]+)\]$/);
    if (bracket && !isChordToken(bracket[1])) return bracket[1].trim();
    const directive = trimmed.match(SECTION_DIRECTIVE_PATTERN);
    if (directive) return compactWhitespace(directive[1] || trimmed.replace(/[{}]/g, ""));
    return "";
  }

  function chordSheetMetadataFromLine(line = "") {
    const match = cleanText(line).match(METADATA_DIRECTIVE_PATTERN);
    if (!match) return null;
    return {
      key: cleanText(match[1]).toLowerCase(),
      value: compactWhitespace(match[2])
    };
  }

  function chordPositionsFromLine(line = "") {
    const positions = [];
    const pattern = /\S+/g;
    for (const match of String(line || "").matchAll(pattern)) {
      const token = cleanChordToken(match[0]);
      if (!isChordToken(token)) continue;
      positions.push({
        chord: normalizeChordLabel(token),
        charIndex: match.index || 0,
        source: "over-lyrics"
      });
    }
    return positions;
  }

  function isChordOnlyLine(line = "") {
    const trimmed = cleanText(line);
    if (!trimmed || isMetadataLine(trimmed) || sectionNameFromLine(trimmed)) return false;
    const tokens = trimmed.split(/\s+/)
      .map(cleanChordToken)
      .filter((token) => token && !/^x\d+$/i.test(token) && token !== "|");
    if (!tokens.length) return false;
    const chordCount = tokens.filter(isChordToken).length;
    return chordCount > 0 && chordCount / tokens.length >= 0.7;
  }

  function parseChordProLine(line = "") {
    const chords = [];
    let lyric = "";
    let foundChord = false;
    const pattern = /\[([^\]]+)\]/g;
    let cursor = 0;
    for (const match of String(line || "").matchAll(pattern)) {
      lyric += String(line || "").slice(cursor, match.index);
      const label = match[1];
      if (isChordToken(label)) {
        chords.push({
          chord: normalizeChordLabel(label),
          charIndex: lyric.length,
          source: "inline"
        });
        foundChord = true;
      } else if (!lyric.trim() && !String(line || "").slice((match.index || 0) + match[0].length).trim()) {
        cursor = (match.index || 0) + match[0].length;
        continue;
      } else {
        lyric += match[0];
      }
      cursor = (match.index || 0) + match[0].length;
    }
    lyric += String(line || "").slice(cursor);
    if (!foundChord) return null;
    return {
      lyric: compactWhitespace(lyric),
      chords
    };
  }

  function nextMeaningfulLine(lines, startIndex) {
    for (let index = startIndex; index < lines.length; index += 1) {
      const raw = String(lines[index] || "");
      if (raw.trim()) return { raw, index };
    }
    return null;
  }

  function parseChordSheet(text = "") {
    const rawSheet = String(text || "").replace(/\r\n/g, "\n");
    const rawLines = rawSheet.split("\n");
    const lines = [];
    const metadata = {};
    let section = "";

    function pushLine(line) {
      const chords = (line.chords || [])
        .map((chord) => ({
          chord: normalizeChordLabel(chord.chord),
          charIndex: Math.max(0, Math.round(Number(chord.charIndex || 0))),
          source: chord.source || "manual"
        }))
        .filter((chord) => chord.chord && chord.chord !== "N");
      const lyric = compactWhitespace(line.lyric || "");
      const raw = String(line.raw || lyric || chords.map((chord) => chord.chord).join(" "));
      if (!lyric && !chords.length) return;
      lines.push({
        section,
        lyric,
        raw,
        chords
      });
    }

    for (let index = 0; index < rawLines.length; index += 1) {
      const raw = String(rawLines[index] || "");
      const trimmed = raw.trim();
      if (!trimmed) continue;

      const directive = chordSheetMetadataFromLine(trimmed);
      if (directive) {
        metadata[directive.key] = directive.value;
        if (directive.key === "key") metadata.key = directive.value;
        if (directive.key === "title") metadata.title = directive.value;
        if (directive.key === "artist" || directive.key === "subtitle") metadata.artist = directive.value;
        continue;
      }

      const nextSection = sectionNameFromLine(trimmed);
      if (nextSection) {
        section = nextSection;
        continue;
      }

      const chordPro = parseChordProLine(raw);
      if (chordPro) {
        pushLine({ ...chordPro, raw });
        continue;
      }

      if (isChordOnlyLine(raw)) {
        const next = nextMeaningfulLine(rawLines, index + 1);
        if (next && !isChordOnlyLine(next.raw) && !sectionNameFromLine(next.raw)) {
          pushLine({
            lyric: next.raw,
            raw: `${raw}\n${next.raw}`,
            chords: chordPositionsFromLine(raw)
          });
          index = next.index;
        } else {
          pushLine({
            lyric: "",
            raw,
            chords: chordPositionsFromLine(raw).map((chord, chordIndex) => ({
              ...chord,
              charIndex: chordIndex * 4
            }))
          });
        }
        continue;
      }

      if (!isMetadataLine(raw)) pushLine({ lyric: raw, raw, chords: [] });
    }

    return {
      rawSheet,
      metadata,
      lines,
      summaryChords: summaryChords(lines.flatMap((line) => line.chords))
    };
  }

  function matchChordSheetLinesToSyncedLyrics(sheetLines = [], syncedLines = []) {
    const matches = new Map();
    let lastMatch = -1;
    for (let lineIndex = 0; lineIndex < sheetLines.length; lineIndex += 1) {
      const sheetLine = sheetLines[lineIndex];
      if (!sheetLine?.lyric || normalizeLyricText(sheetLine.lyric).length < 3) continue;
      let best = null;
      const searchStart = Math.max(0, lastMatch + 1);
      for (let lyricIndex = searchStart; lyricIndex < syncedLines.length; lyricIndex += 1) {
        const synced = syncedLines[lyricIndex];
        const baseScore = lyricMatchScore(sheetLine.lyric, synced?.text || "");
        if (baseScore < 0.52) continue;
        const distancePenalty = Math.min(0.18, Math.max(0, lyricIndex - searchStart - 8) * 0.01);
        const score = baseScore - distancePenalty;
        if (!best || score > best.score) best = { lineIndex, lyricIndex, score: clamp(score, 0, 1) };
      }
      if (best && best.score >= 0.55) {
        matches.set(lineIndex, best);
        lastMatch = best.lyricIndex;
      }
    }
    return matches;
  }

  function inferSplitChordSheetLineMatches(sheetLines = [], syncedLines = [], matches = new Map()) {
    for (let lineIndex = 0; lineIndex < sheetLines.length; lineIndex += 1) {
      const match = matches.get(lineIndex);
      if (!match) continue;
      const lyricText = normalizeLyricText(syncedLines[match.lyricIndex]?.text || "");
      if (lyricText.length < 8) continue;

      let cursor = 0;
      const currentText = normalizeLyricText(sheetLines[lineIndex]?.lyric || "");
      const currentStart = currentText ? lyricText.indexOf(currentText) : -1;
      if (currentStart >= 0) cursor = currentStart + currentText.length;

      for (let nextIndex = lineIndex + 1; nextIndex < sheetLines.length; nextIndex += 1) {
        if (matches.has(nextIndex)) break;
        const nextText = normalizeLyricText(sheetLines[nextIndex]?.lyric || "");
        if (nextText.length < 3) break;
        const start = lyricText.indexOf(nextText, cursor);
        if (start < 0) break;
        const end = start + nextText.length;
        matches.set(nextIndex, {
          lineIndex: nextIndex,
          lyricIndex: match.lyricIndex,
          score: 0.72,
          splitStartRatio: clamp(start / lyricText.length, 0, 0.96),
          splitEndRatio: clamp(end / lyricText.length, 0.04, 1),
          splitLyricLine: true
        });
        cursor = end;
      }
    }
    return matches;
  }

  function alignChordSheetToSyncedLyrics(parsedSheet = {}, syncedLines = [], options = {}) {
    const sheetLines = Array.isArray(parsedSheet.lines) ? parsedSheet.lines : [];
    const lyricLines = Array.isArray(syncedLines) ? syncedLines : [];
    const durationMs = Math.max(0, Math.round(Number(options.durationMs || 0)));
    const matches = matchChordSheetLinesToSyncedLyrics(sheetLines, lyricLines);
    inferSplitChordSheetLineMatches(sheetLines, lyricLines, matches);
    const alignedSheetLines = sheetLines.map((line) => ({ ...line }));
    const starts = [];

    for (let lineIndex = 0; lineIndex < sheetLines.length; lineIndex += 1) {
      const line = sheetLines[lineIndex];
      const match = matches.get(lineIndex);
      if (!match) continue;
      const synced = lyricLines[match.lyricIndex];
      const nextSynced = lyricLines[match.lyricIndex + 1];
      const lyricStart = Math.max(0, Math.round(Number(synced?.timeMs || 0)));
      const fallbackEnd = durationMs > lyricStart ? durationMs : lyricStart + 4000;
      const lyricEnd = Math.max(lyricStart + 700, Math.round(Number(nextSynced?.timeMs || fallbackEnd)));
      const nextSplitMatch = matches.get(lineIndex + 1);
      const splitStart = Number.isFinite(Number(match.splitStartRatio)) ? clamp(Number(match.splitStartRatio), 0, 0.96) : 0;
      const splitEnd = Number.isFinite(Number(nextSplitMatch?.splitStartRatio)) && nextSplitMatch.lyricIndex === match.lyricIndex
        ? clamp(Number(nextSplitMatch.splitStartRatio), splitStart + 0.03, 1)
        : Number.isFinite(Number(match.splitEndRatio))
          ? clamp(Number(match.splitEndRatio), splitStart + 0.03, 1)
          : 1;
      const lineStart = Math.round(lyricStart + (lyricEnd - lyricStart) * splitStart);
      const lineEnd = Math.max(lineStart + 700, Math.round(lyricStart + (lyricEnd - lyricStart) * splitEnd));
      alignedSheetLines[lineIndex] = {
        ...alignedSheetLines[lineIndex],
        timeMs: lineStart,
        endTimeMs: lineEnd,
        matchedLyricIndex: match.lyricIndex,
        matchConfidence: clamp(match.score, 0, 1),
        splitLyricLine: Boolean(match.splitLyricLine)
      };
      if (!line?.chords?.length) continue;
      const lyricLength = Math.max(1, String(line.lyric || "").length);
      for (let chordIndex = 0; chordIndex < line.chords.length; chordIndex += 1) {
        const chord = line.chords[chordIndex];
        const ratio = clamp(Number(chord.charIndex || 0) / lyricLength, 0, 0.96);
        starts.push({
          timeMs: Math.round(lineStart + (lineEnd - lineStart) * ratio),
          chord: normalizeChordLabel(chord.chord),
          confidence: clamp(match.score * 0.96, 0.55, 0.98),
          lineIndex,
          lyric: line.lyric,
          section: line.section || ""
        });
      }
    }

    starts.sort((left, right) => left.timeMs - right.timeMs);
    const changes = [];
    for (let index = 0; index < starts.length; index += 1) {
      const start = starts[index];
      if (!start.chord || start.chord === "N") continue;
      const next = starts[index + 1];
      const endTimeMs = Math.max(start.timeMs + 500, next ? next.timeMs : (durationMs > start.timeMs ? durationMs : start.timeMs + 4000));
      changes.push({ ...start, endTimeMs });
    }

    return {
      changes,
      sheetLines: alignedSheetLines,
      alignment: {
        version: ALIGNMENT_VERSION,
        method: lyricLines.length ? "synced-lyrics" : "none",
        matchedLines: sheetLines.filter((line, index) => line?.chords?.length && matches.has(index)).length,
        totalChordLines: sheetLines.filter((line) => line?.chords?.length).length,
        totalMatchedLines: matches.size,
        totalSheetLines: sheetLines.length,
        totalLyricLines: lyricLines.length
      }
    };
  }

  function chordIndexForTime(changes = [], currentMs = 0, lookaheadMs = 120) {
    const position = Number(currentMs || 0) + lookaheadMs;
    let active = -1;
    for (let index = 0; index < changes.length; index += 1) {
      const change = changes[index];
      const start = Number(change.timeMs || 0);
      const end = Number(change.endTimeMs || 0);
      if (start <= position && (!end || end > position)) return index;
      if (start <= position) active = index;
      else break;
    }
    return active;
  }

  function hannWindow(size) {
    if (windowCache.has(size)) return windowCache.get(size);
    const window = new Float32Array(size);
    for (let index = 0; index < size; index += 1) {
      window[index] = 0.5 * (1 - Math.cos((2 * Math.PI * index) / Math.max(1, size - 1)));
    }
    windowCache.set(size, window);
    return window;
  }

  function reverseBits(value, bits) {
    let reversed = 0;
    for (let index = 0; index < bits; index += 1) {
      reversed = (reversed << 1) | (value & 1);
      value >>= 1;
    }
    return reversed;
  }

  function fft(real, imag) {
    const size = real.length;
    const bits = Math.round(Math.log2(size));
    for (let index = 0; index < size; index += 1) {
      const reversed = reverseBits(index, bits);
      if (reversed > index) {
        const realTemp = real[index];
        const imagTemp = imag[index];
        real[index] = real[reversed];
        imag[index] = imag[reversed];
        real[reversed] = realTemp;
        imag[reversed] = imagTemp;
      }
    }

    for (let length = 2; length <= size; length *= 2) {
      const angle = (-2 * Math.PI) / length;
      const wlenReal = Math.cos(angle);
      const wlenImag = Math.sin(angle);
      for (let start = 0; start < size; start += length) {
        let wReal = 1;
        let wImag = 0;
        for (let offset = 0; offset < length / 2; offset += 1) {
          const even = start + offset;
          const odd = even + length / 2;
          const oddReal = real[odd] * wReal - imag[odd] * wImag;
          const oddImag = real[odd] * wImag + imag[odd] * wReal;
          real[odd] = real[even] - oddReal;
          imag[odd] = imag[even] - oddImag;
          real[even] += oddReal;
          imag[even] += oddImag;
          const nextReal = wReal * wlenReal - wImag * wlenImag;
          wImag = wReal * wlenImag + wImag * wlenReal;
          wReal = nextReal;
        }
      }
    }
  }

  function chromaFromFrame(samples, sampleRate, start, size) {
    const real = new Float32Array(size);
    const imag = new Float32Array(size);
    const window = hannWindow(size);
    let energy = 0;
    for (let offset = 0; offset < size; offset += 1) {
      const value = samples[start + offset] || 0;
      real[offset] = value * window[offset];
      energy += value * value;
    }
    const rms = Math.sqrt(energy / size);
    fft(real, imag);

    const chroma = new Array(12).fill(0);
    const half = size / 2;
    for (let bin = 1; bin < half; bin += 1) {
      const frequency = (bin * sampleRate) / size;
      if (frequency < 65 || frequency > 2000) continue;
      const midi = 69 + 12 * Math.log2(frequency / 440);
      const nearest = Math.round(midi);
      const cents = Math.abs(midi - nearest);
      if (cents > 0.45) continue;
      const pitchClass = ((nearest % 12) + 12) % 12;
      const magnitude = Math.sqrt(real[bin] * real[bin] + imag[bin] * imag[bin]);
      chroma[pitchClass] += magnitude * (1 - cents);
    }

    const max = Math.max(...chroma);
    if (max > 0) {
      for (let index = 0; index < chroma.length; index += 1) chroma[index] /= max;
    }
    return { chroma, rms };
  }

  function scoreChord(chroma, rootIndex, intervals) {
    const active = new Set(intervals.map((interval) => (rootIndex + interval) % 12));
    let activeSum = 0;
    let inactiveSum = 0;
    for (let index = 0; index < 12; index += 1) {
      if (active.has(index)) activeSum += chroma[index] || 0;
      else inactiveSum += chroma[index] || 0;
    }
    const activeAvg = activeSum / active.size;
    const inactiveAvg = inactiveSum / Math.max(1, 12 - active.size);
    return activeAvg + (chroma[rootIndex] || 0) * 0.28 - inactiveAvg * 0.62;
  }

  function detectChordFromChroma(chroma, rms) {
    if (!Number.isFinite(rms) || rms < 0.006) return { chord: "N", confidence: 0 };
    const scored = [];
    for (let root = 0; root < NOTE_NAMES.length; root += 1) {
      for (const type of CHORD_TYPES) {
        scored.push({
          chord: `${NOTE_NAMES[root]}${type.suffix}`,
          score: scoreChord(chroma, root, type.intervals)
        });
      }
    }
    scored.sort((left, right) => right.score - left.score);
    const best = scored[0] || { chord: "N", score: 0 };
    const second = scored[1] || { score: 0 };
    const confidence = clamp(0.38 + (best.score - second.score) * 1.2 + best.score * 0.22, 0, 0.98);
    if (best.score < 0.18 || confidence < 0.35) return { chord: "N", confidence: clamp(confidence, 0, 0.45) };
    return { chord: best.chord, confidence };
  }

  function smoothChordFrames(frames = [], minRunFrames = 2) {
    const output = frames.map((frame) => ({ ...frame, chord: normalizeChordLabel(frame.chord) }));
    for (let index = 1; index < output.length - 1; index += 1) {
      const previous = output[index - 1];
      const current = output[index];
      const next = output[index + 1];
      if (previous.chord && previous.chord === next.chord && current.chord !== previous.chord && current.confidence < 0.74) {
        current.chord = previous.chord;
        current.confidence = Math.min(previous.confidence || 0.6, next.confidence || 0.6);
      }
    }

    if (minRunFrames <= 1) return output;
    let runStart = 0;
    while (runStart < output.length) {
      let runEnd = runStart + 1;
      while (runEnd < output.length && output[runEnd].chord === output[runStart].chord) runEnd += 1;
      const runLength = runEnd - runStart;
      if (runLength < minRunFrames) {
        const previous = output[runStart - 1];
        const next = output[runEnd];
        const replacement = previous?.chord && next?.chord && previous.chord === next.chord
          ? previous.chord
          : previous?.chord || next?.chord;
        if (replacement) {
          for (let index = runStart; index < runEnd; index += 1) output[index].chord = replacement;
        }
      }
      runStart = runEnd;
    }
    return output;
  }

  function mergeConfidence(left, right) {
    const leftDuration = Math.max(1, Number(left.endTimeMs || 0) - Number(left.timeMs || 0));
    const rightDuration = Math.max(1, Number(right.endTimeMs || 0) - Number(right.timeMs || 0));
    return ((Number(left.confidence || 0) * leftDuration) + (Number(right.confidence || 0) * rightDuration)) / (leftDuration + rightDuration);
  }

  function compressFramesToChanges(frames = [], durationMs = 0, hopMs = 1000, minSegmentMs = 1200) {
    const changes = [];
    for (let index = 0; index < frames.length; index += 1) {
      const frame = frames[index];
      const timeMs = Math.max(0, Math.round(Number(frame.timeMs || index * hopMs)));
      const endTimeMs = Math.max(timeMs + 1, Math.round(index + 1 < frames.length ? Number(frames[index + 1].timeMs || ((index + 1) * hopMs)) : (durationMs || timeMs + hopMs)));
      const chord = normalizeChordLabel(frame.chord);
      const confidence = clamp(Number(frame.confidence || 0), 0, 1);
      const previous = changes[changes.length - 1];
      if (previous && previous.chord === chord) {
        previous.confidence = mergeConfidence(previous, { timeMs, endTimeMs, confidence });
        previous.endTimeMs = endTimeMs;
      } else {
        changes.push({ timeMs, endTimeMs, chord, confidence });
      }
    }

    for (let index = 0; index < changes.length; index += 1) {
      const change = changes[index];
      if (change.chord === "N") continue;
      if (change.endTimeMs - change.timeMs >= minSegmentMs) continue;
      const previous = changes[index - 1];
      const next = changes[index + 1];
      if (previous && previous.chord !== "N") {
        previous.confidence = mergeConfidence(previous, change);
        previous.endTimeMs = change.endTimeMs;
        changes.splice(index, 1);
        index -= 1;
      } else if (next && next.chord !== "N") {
        next.confidence = mergeConfidence(next, change);
        next.timeMs = change.timeMs;
        changes.splice(index, 1);
        index -= 1;
      }
    }

    return changes.filter((change) => change.endTimeMs > change.timeMs);
  }

  function inferKey(changes = []) {
    const weights = new Map();
    for (const change of changes) {
      const chord = normalizeChordLabel(change.chord);
      if (!chord || chord === "N") continue;
      const match = chord.match(/^([A-G](?:#|b)?)(m?)/);
      if (!match) continue;
      const duration = Math.max(1, Number(change.endTimeMs || 0) - Number(change.timeMs || 0));
      const key = `${match[1]} ${match[2] === "m" ? "minor" : "major"}`;
      weights.set(key, (weights.get(key) || 0) + duration);
    }
    return Array.from(weights.entries()).sort((left, right) => right[1] - left[1])[0]?.[0] || "";
  }

  function averageConfidence(changes = []) {
    let weighted = 0;
    let total = 0;
    for (const change of changes) {
      const duration = Math.max(1, Number(change.endTimeMs || 0) - Number(change.timeMs || 0));
      weighted += clamp(Number(change.confidence || 0), 0, 1) * duration;
      total += duration;
    }
    return total ? weighted / total : 0;
  }

  function validateChordResult(result = {}) {
    const rawChanges = Array.isArray(result.changes) ? result.changes : [];
    const changes = [];
    let lastEnd = 0;
    for (const raw of rawChanges) {
      const chord = normalizeChordLabel(raw?.chord);
      const timeMs = Math.max(lastEnd, Math.round(Number(raw?.timeMs || 0)));
      const endTimeMs = Math.round(Number(raw?.endTimeMs || raw?.timeMs || 0));
      if (!Number.isFinite(timeMs) || !Number.isFinite(endTimeMs) || endTimeMs <= timeMs) continue;
      const change = {
        timeMs,
        endTimeMs,
        chord,
        confidence: clamp(Number(raw?.confidence ?? result.confidence ?? 0), 0, 1)
      };
      if (Number.isFinite(Number(raw?.lineIndex))) change.lineIndex = Math.max(0, Math.round(Number(raw.lineIndex)));
      if (raw?.lyric) change.lyric = cleanText(raw.lyric);
      if (raw?.section) change.section = cleanText(raw.section);
      changes.push(change);
      lastEnd = change.endTimeMs;
    }

    const provider = ALLOWED_PROVIDERS.has(result.provider) ? result.provider : "voidfm-detector";
    const sourceType = ALLOWED_SOURCE_TYPES.has(result.sourceType) ? result.sourceType : "generated";
    const hasSheet = Array.isArray(result.sheetLines) && result.sheetLines.some((line) => Array.isArray(line.chords) && line.chords.length);
    const status = changes.length
      ? "available"
      : (result.status === "sheet_only" && hasSheet)
        ? "sheet_only"
        : (["not_found", "error"].includes(result.status) ? result.status : "not_found");
    const normalized = {
      status,
      provider,
      sourceType,
      summaryChords: summaryChords(changes).length ? summaryChords(changes) : (Array.isArray(result.summaryChords) ? result.summaryChords.map(normalizeChordLabel).filter((chord) => chord !== "N") : []),
      key: cleanText(result.key) || inferKey(changes),
      confidence: clamp(Number(result.confidence ?? averageConfidence(changes)), 0, 1),
      changes,
      analyzedAt: cleanText(result.analyzedAt) || new Date().toISOString()
    };
    if (result.detail) normalized.detail = cleanText(result.detail);
    if (result.rawSheet) normalized.rawSheet = String(result.rawSheet || "");
    if (Array.isArray(result.sheetLines)) normalized.sheetLines = result.sheetLines.map((line) => {
      const normalizedLine = {
        section: cleanText(line.section || ""),
        lyric: compactWhitespace(line.lyric || ""),
        raw: String(line.raw || ""),
        chords: Array.isArray(line.chords)
          ? line.chords.map((chord) => ({
          chord: normalizeChordLabel(chord.chord),
          charIndex: Math.max(0, Math.round(Number(chord.charIndex || 0))),
          source: chord.source || "manual"
          })).filter((chord) => chord.chord !== "N")
          : []
      };
      if (Number.isFinite(Number(line.timeMs))) normalizedLine.timeMs = Math.max(0, Math.round(Number(line.timeMs)));
      if (Number.isFinite(Number(line.endTimeMs))) normalizedLine.endTimeMs = Math.max(Number(normalizedLine.timeMs || 0), Math.round(Number(line.endTimeMs)));
      if (Number.isFinite(Number(line.matchedLyricIndex))) normalizedLine.matchedLyricIndex = Math.max(0, Math.round(Number(line.matchedLyricIndex)));
      if (Number.isFinite(Number(line.matchConfidence))) normalizedLine.matchConfidence = clamp(Number(line.matchConfidence), 0, 1);
      return normalizedLine;
    }).filter((line) => line.lyric || line.chords.length);
    if (result.alignment && typeof result.alignment === "object") {
      normalized.alignment = {
        version: Math.max(0, Math.round(Number(result.alignment.version || 0))),
        method: cleanText(result.alignment.method || ""),
        matchedLines: Math.max(0, Math.round(Number(result.alignment.matchedLines || 0))),
        totalChordLines: Math.max(0, Math.round(Number(result.alignment.totalChordLines || 0))),
        totalMatchedLines: Math.max(0, Math.round(Number(result.alignment.totalMatchedLines || result.alignment.matchedLines || 0))),
        totalSheetLines: Math.max(0, Math.round(Number(result.alignment.totalSheetLines || 0))),
        totalLyricLines: Math.max(0, Math.round(Number(result.alignment.totalLyricLines || 0)))
      };
    }
    return normalized;
  }

  function mixAudioBuffer(audioBuffer) {
    const length = audioBuffer.length;
    const channelCount = Math.max(1, audioBuffer.numberOfChannels || 1);
    if (channelCount === 1) return audioBuffer.getChannelData(0);
    const mono = new Float32Array(length);
    for (let channel = 0; channel < channelCount; channel += 1) {
      const data = audioBuffer.getChannelData(channel);
      for (let index = 0; index < length; index += 1) mono[index] += data[index] / channelCount;
    }
    return mono;
  }

  function analyzePcm(samples, sampleRate, options = {}) {
    const durationMs = Math.round((samples.length / sampleRate) * 1000);
    const hopMs = Math.max(500, Number(options.hopMs || 1000));
    const windowSize = Math.max(2048, Number(options.windowSize || 8192));
    const minRunFrames = Math.max(1, Number(options.minRunFrames || 2));
    const minSegmentMs = Math.max(0, Number(options.minSegmentMs || 1200));
    const hopSamples = Math.max(1, Math.round((hopMs / 1000) * sampleRate));
    const frames = [];

    for (let start = 0; start < samples.length; start += hopSamples) {
      const { chroma, rms } = chromaFromFrame(samples, sampleRate, start, windowSize);
      const detected = detectChordFromChroma(chroma, rms);
      frames.push({
        timeMs: Math.round((start / sampleRate) * 1000),
        chord: detected.chord,
        confidence: detected.confidence
      });
    }

    const changes = compressFramesToChanges(smoothChordFrames(frames, minRunFrames), durationMs, hopMs, minSegmentMs);
    return validateChordResult({
      status: changes.length ? "available" : "not_found",
      provider: "voidfm-detector",
      sourceType: "generated",
      confidence: averageConfidence(changes),
      changes
    });
  }

  function analyzeAudioBuffer(audioBuffer, options = {}) {
    return analyzePcm(mixAudioBuffer(audioBuffer), audioBuffer.sampleRate, options);
  }

  async function analyzeTrackFromUrl(url, options = {}) {
    const maxBytes = Number(options.maxBytes || 80 * 1024 * 1024);
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`Audio fetch failed: ${response.status}`);
    const contentLength = Number(response.headers.get("content-length") || 0);
    if (contentLength > maxBytes) throw new Error("Audio file is too large for browser chord analysis.");
    const arrayBuffer = await response.arrayBuffer();
    if (arrayBuffer.byteLength > maxBytes) throw new Error("Audio file is too large for browser chord analysis.");
    const AudioContextClass = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!AudioContextClass) throw new Error("This browser cannot decode audio for chord analysis.");
    const context = new AudioContextClass();
    try {
      const audioBuffer = await context.decodeAudioData(arrayBuffer.slice(0));
      return analyzeAudioBuffer(audioBuffer, options);
    } finally {
      if (typeof context.close === "function") context.close().catch(() => {});
    }
  }

  return {
    NOTE_NAMES,
    CHORD_TYPES,
    ALIGNMENT_VERSION,
    normalizeChordLabel,
    summaryChords,
    normalizeLyricText,
    lyricMatchScore,
    parseChordSheet,
    matchChordSheetLinesToSyncedLyrics,
    alignChordSheetToSyncedLyrics,
    chordIndexForTime,
    smoothChordFrames,
    compressFramesToChanges,
    inferKey,
    validateChordResult,
    analyzePcm,
    analyzeAudioBuffer,
    analyzeTrackFromUrl
  };
});
