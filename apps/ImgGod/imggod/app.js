const dom = {
  imageInput: document.getElementById("imageInput"),
  uploadDropzone: document.getElementById("uploadDropzone"),
  outputWidth: document.getElementById("outputWidth"),
  outputHeight: document.getElementById("outputHeight"),
  outputSizeSummary: document.getElementById("outputSizeSummary"),
  masterRandomness: document.getElementById("masterRandomness"),
  masterRandomnessValue: document.getElementById("masterRandomnessValue"),
  masterDensity: document.getElementById("masterDensity"),
  masterDensityValue: document.getElementById("masterDensityValue"),
  layerCount: document.getElementById("layerCount"),
  layersList: document.getElementById("layersList"),
  imagesList: document.getElementById("imagesList"),
  generateButton: document.getElementById("generateButton"),
  regenerateButton: document.getElementById("regenerateButton"),
  exportButton: document.getElementById("exportButton"),
  exportFormat: document.getElementById("exportFormat"),
  exportQuality: document.getElementById("exportQuality"),
  exportQualityValue: document.getElementById("exportQualityValue"),
  exportQualityField: document.getElementById("exportQualityField"),
  previewCanvas: document.getElementById("previewCanvas"),
  previewSurface: document.getElementById("previewSurface"),
  previewEmptyState: document.getElementById("previewEmptyState"),
  renderCanvas: document.getElementById("renderCanvas"),
  statusMessage: document.getElementById("statusMessage"),
  renderStats: document.getElementById("renderStats"),
  generationBlockReason: document.getElementById("generationBlockReason"),
  sourceCountBadge: document.getElementById("sourceCountBadge"),
  renderStateBadge: document.getElementById("renderStateBadge")
};

const PRESET_LAYERS = [
  { density: 100, randomness: 90, overlap: "none", scaleMultiplier: 100, spacingPx: 10 },
  { density: 78, randomness: 95, overlap: "slight", scaleMultiplier: 88, spacingPx: 6 },
  { density: 38, randomness: 100, overlap: "heavy", scaleMultiplier: 74, spacingPx: 3 }
];

const OVERLAP_MODES = {
  none: {
    label: "No overlap / tight contact",
    allowedOverlap: 0.01,
    highDensitySpacing: 1.03,
    randomScatter: 0.02
  },
  slight: {
    label: "Slight overlap",
    allowedOverlap: 0.12,
    highDensitySpacing: 0.91,
    randomScatter: 0.08
  },
  heavy: {
    label: "Heavy overlap",
    allowedOverlap: 0.34,
    highDensitySpacing: 0.7,
    randomScatter: 0.18
  }
};

const state = {
  images: [],
  layers: [],
  nextImageId: 1,
  nextLayerId: 1,
  masterRandomness: 60,
  masterDensity: 70,
  outputWidth: 2048,
  outputHeight: 2048,
  exportFormat: "image/png",
  exportQuality: 0.95,
  currentRender: null,
  renderVersion: 0,
  lastSeed: null,
  isRendering: false,
  dirty: false
};

class SpatialHash {
  constructor(cellSize) {
    this.cellSize = Math.max(12, cellSize);
    this.cells = new Map();
    this.itemKeys = new Map();
  }

  key(x, y) {
    return `${x},${y}`;
  }

  insert(item) {
    const minX = Math.floor((item.x - item.radius) / this.cellSize);
    const maxX = Math.floor((item.x + item.radius) / this.cellSize);
    const minY = Math.floor((item.y - item.radius) / this.cellSize);
    const maxY = Math.floor((item.y + item.radius) / this.cellSize);
    const keys = [];

    for (let gx = minX; gx <= maxX; gx += 1) {
      for (let gy = minY; gy <= maxY; gy += 1) {
        const key = this.key(gx, gy);
        keys.push(key);
        if (!this.cells.has(key)) {
          this.cells.set(key, []);
        }
        this.cells.get(key).push(item);
      }
    }

    this.itemKeys.set(item.id, keys);
  }

  remove(item) {
    const keys = this.itemKeys.get(item.id);
    if (!keys) {
      return;
    }

    for (const key of keys) {
      const bucket = this.cells.get(key);
      if (!bucket) {
        continue;
      }
      const index = bucket.findIndex((entry) => entry.id === item.id);
      if (index !== -1) {
        bucket.splice(index, 1);
      }
      if (!bucket.length) {
        this.cells.delete(key);
      }
    }

    this.itemKeys.delete(item.id);
  }

  update(item) {
    this.remove(item);
    this.insert(item);
  }

  query(x, y, radius) {
    const minX = Math.floor((x - radius) / this.cellSize);
    const maxX = Math.floor((x + radius) / this.cellSize);
    const minY = Math.floor((y - radius) / this.cellSize);
    const maxY = Math.floor((y + radius) / this.cellSize);
    const results = [];
    const seen = new Set();

    for (let gx = minX; gx <= maxX; gx += 1) {
      for (let gy = minY; gy <= maxY; gy += 1) {
        const bucket = this.cells.get(this.key(gx, gy));
        if (!bucket) {
          continue;
        }
        for (const item of bucket) {
          if (!seen.has(item.id)) {
            seen.add(item.id);
            results.push(item);
          }
        }
      }
    }

    return results;
  }
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function lerp(start, end, amount) {
  return start + (end - start) * amount;
}

function randomInRange(min, max, random) {
  return min + (max - min) * random();
}

function centeredRandom(random) {
  return (random() - 0.5) * 2;
}

function waitForFrame() {
  return new Promise((resolve) => requestAnimationFrame(resolve));
}

function createRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createLayer(index) {
  const preset = PRESET_LAYERS[index] || {
    density: clamp(100 - index * 8, 20, 100),
    randomness: clamp(88 + index * 4, 10, 100),
    overlap: index < 2 ? "slight" : "heavy",
    scaleMultiplier: clamp(100 - index * 7, 45, 160),
    spacingPx: clamp(10 - index * 2, 0, 60)
  };

  return {
    id: state.nextLayerId++,
    name: `Layer ${index + 1}`,
    enabled: true,
    density: preset.density,
    randomness: preset.randomness,
    overlap: preset.overlap,
    scaleMultiplier: preset.scaleMultiplier,
    spacingPx: preset.spacingPx,
    hueShift: 0
  };
}

function syncLayers(count) {
  const targetCount = clamp(Number(count) || 1, 1, 8);
  while (state.layers.length < targetCount) {
    state.layers.push(createLayer(state.layers.length));
  }
  while (state.layers.length > targetCount) {
    state.layers.pop();
  }
}

function decodeImage(image) {
  if (image.decode) {
    return image.decode();
  }

  return new Promise((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("Image decode failed."));
  });
}

async function analyzeOpaqueBounds(image) {
  const sampleMax = 128;
  const maxSide = Math.max(image.naturalWidth, image.naturalHeight);
  const scale = Math.min(1, sampleMax / maxSide);
  const sampleWidth = Math.max(1, Math.round(image.naturalWidth * scale));
  const sampleHeight = Math.max(1, Math.round(image.naturalHeight * scale));

  const canvas = document.createElement("canvas");
  canvas.width = sampleWidth;
  canvas.height = sampleHeight;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.drawImage(image, 0, 0, sampleWidth, sampleHeight);

  const pixels = context.getImageData(0, 0, sampleWidth, sampleHeight).data;
  let minX = sampleWidth;
  let minY = sampleHeight;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < sampleHeight; y += 1) {
    for (let x = 0; x < sampleWidth; x += 1) {
      const alpha = pixels[(y * sampleWidth + x) * 4 + 3];
      if (alpha > 10) {
        if (x < minX) {
          minX = x;
        }
        if (y < minY) {
          minY = y;
        }
        if (x > maxX) {
          maxX = x;
        }
        if (y > maxY) {
          maxY = y;
        }
      }
    }
  }

  if (maxX < minX || maxY < minY) {
    return { x: 0, y: 0, width: 1, height: 1 };
  }

  return {
    x: minX / sampleWidth,
    y: minY / sampleHeight,
    width: (maxX - minX + 1) / sampleWidth,
    height: (maxY - minY + 1) / sampleHeight
  };
}

function getDefaultSizeRange() {
  const reference = Math.min(state.outputWidth, state.outputHeight);
  const minSize = clamp(Math.round(reference * 0.06), 18, 4000);
  const maxSize = clamp(Math.round(reference * 0.18), minSize + 4, 8000);
  return { minSize, maxSize };
}

async function loadSourceImage(file) {
  const objectUrl = URL.createObjectURL(file);
  const image = new Image();
  image.decoding = "async";
  image.src = objectUrl;
  await decodeImage(image);

  const bounds = await analyzeOpaqueBounds(image);
  const defaults = getDefaultSizeRange();

  return {
    id: state.nextImageId++,
    name: file.name,
    file,
    objectUrl,
    image,
    width: image.naturalWidth,
    height: image.naturalHeight,
    minSize: defaults.minSize,
    maxSize: defaults.maxSize,
    minRotation: 0,
    maxRotation: 0,
    opaqueBounds: bounds
  };
}

function readBoundedIntegerInput(input, fallback, min, max) {
  const rawValue = input.value.trim();
  const parsed = Number(rawValue);
  if (!rawValue || !Number.isFinite(parsed)) {
    input.value = String(fallback);
    return fallback;
  }

  const nextValue = clamp(Math.round(parsed), min, max);
  input.value = String(nextValue);
  return nextValue;
}

function updateSummaryText() {
  dom.masterRandomnessValue.textContent = `${state.masterRandomness}%`;
  dom.masterDensityValue.textContent = `${state.masterDensity}%`;
  dom.exportQualityValue.textContent = `${Math.round(state.exportQuality * 100)}%`;
  dom.outputSizeSummary.textContent = `${state.outputWidth} x ${state.outputHeight} px`;
  dom.sourceCountBadge.textContent = `${state.images.length} source image${state.images.length === 1 ? "" : "s"}`;
  dom.exportQualityField.style.display = state.exportFormat === "image/png" ? "none" : "grid";
}

function getGenerationBlockReason() {
  if (!state.images.length) {
    return "Upload at least one source image to generate a composite.";
  }
  if (state.outputWidth < 64 || state.outputHeight < 64) {
    return "Output width and height must both be at least 64 pixels.";
  }
  if (state.outputWidth > 12000 || state.outputHeight > 12000) {
    return "The browser canvas limit is safest at 12000 pixels or below in either dimension.";
  }
  if (!state.layers.some((layer) => layer.enabled)) {
    return "Enable at least one layer before generating.";
  }
  return "";
}

function setStatus(message, isError = false) {
  dom.statusMessage.textContent = message;
  dom.statusMessage.style.color = isError ? "var(--danger)" : "var(--text)";
}

function updateRenderStateBadge() {
  let text = "Waiting for images";
  if (state.isRendering) {
    text = "Generating...";
  } else if (state.currentRender && state.dirty) {
    text = "Preview out of date";
  } else if (state.currentRender) {
    text = "Preview ready";
  } else if (state.images.length) {
    text = "Ready to generate";
  }
  dom.renderStateBadge.textContent = text;
}

function updateActionState() {
  const reason = getGenerationBlockReason();
  dom.generationBlockReason.textContent = reason || "Generation uses the original uploaded image data for placement and export.";

  const canGenerate = !state.isRendering && !reason;
  const canExport = !state.isRendering && !!state.currentRender && !state.dirty;

  dom.generateButton.disabled = !canGenerate;
  dom.regenerateButton.disabled = !canGenerate;
  dom.exportButton.disabled = !canExport;

  updateRenderStateBadge();
  syncLayerActionState();
  syncImageActionState();
}

function getRenderedLayer(layerId) {
  return state.currentRender?.layers?.find((entry) => entry.id === layerId) || null;
}

function getRenderedSourceOverlay(imageId) {
  return state.currentRender?.sources?.find((entry) => entry.id === imageId) || null;
}

function syncLayerActionState() {
  const cards = dom.layersList.querySelectorAll(".layer-card");
  for (const card of cards) {
    const layerId = Number(card.dataset.layerId);
    const saveButton = card.querySelector(".save-layer");
    if (saveButton) {
      saveButton.disabled = !(!state.isRendering && !!state.currentRender && !state.dirty && !!getRenderedLayer(layerId));
    }
  }
}

function syncImageActionState() {
  const cards = dom.imagesList.querySelectorAll(".image-card");
  for (const card of cards) {
    const imageId = Number(card.dataset.imageId);
    const saveButton = card.querySelector(".save-image-overlay");
    if (saveButton) {
      saveButton.disabled = !(!state.isRendering && !!state.currentRender && !state.dirty && !!getRenderedSourceOverlay(imageId));
    }
  }
}

function markDirty() {
  if (state.currentRender) {
    state.dirty = true;
  }
  updateActionState();
  updateRenderStats();
}

function updateRenderStats() {
  if (!state.currentRender) {
    dom.renderStats.textContent = "No render yet.";
    return;
  }

  const layerSummary = state.currentRender.stats
    .map((entry) => `${entry.name}: ${entry.count}`)
    .join(" | ");

  const suffix = state.dirty ? " Regenerate to update export." : "";
  dom.renderStats.textContent =
    `${state.currentRender.width} x ${state.currentRender.height}px | ${state.currentRender.total} placements | seed ${state.currentRender.seed}${layerSummary ? ` | ${layerSummary}` : ""}.${suffix}`;
}

function getLayerSpacingPx(layer) {
  return clamp(Math.round(Number(layer.spacingPx) || 0), 0, 2000);
}

function getLayerBadgeText(layer) {
  const gapPx = getLayerSpacingPx(layer);
  const overlapLabels = {
    none: "No overlap",
    slight: "Slight overlap",
    heavy: "Heavy overlap"
  };
  const overlapLabel = overlapLabels[layer.overlap] || OVERLAP_MODES[layer.overlap].label;
  return gapPx ? `${overlapLabel} | ${gapPx}px gap` : overlapLabel;
}

function getImageControlSummary(source) {
  return `${source.minSize}-${source.maxSize}px | rot ${source.minRotation} to ${source.maxRotation}deg`;
}

function renderLayers() {
  dom.layersList.innerHTML = "";

  for (const layer of state.layers) {
    const card = document.createElement("article");
    card.className = "layer-card";
    card.dataset.layerId = String(layer.id);
    card.innerHTML = `
      <div class="layer-header">
        <div class="layer-title">
          <label class="toggle">
            <input type="checkbox" class="layer-enabled" ${layer.enabled ? "checked" : ""}>
            <span>
              <strong>${layer.name}</strong>
              <span>Separate pass for depth.</span>
            </span>
          </label>
        </div>
        <span class="badge badge-muted">${getLayerBadgeText(layer)}</span>
      </div>
      <div class="layer-grid">
        <label>
          Density
          <input class="layer-density" type="number" min="1" max="100" value="${layer.density}">
        </label>
        <label>
          Randomness
          <input class="layer-randomness" type="number" min="1" max="100" value="${layer.randomness}">
        </label>
        <label>
          Overlap
          <select class="layer-overlap">
            <option value="none" ${layer.overlap === "none" ? "selected" : ""}>No overlap / tight contact</option>
            <option value="slight" ${layer.overlap === "slight" ? "selected" : ""}>Slight overlap</option>
            <option value="heavy" ${layer.overlap === "heavy" ? "selected" : ""}>Heavy overlap</option>
          </select>
        </label>
        <label>
          Scale Multiplier
          <input class="layer-scale" type="number" min="25" max="200" value="${layer.scaleMultiplier}">
        </label>
        <label>
          Min Gap (px)
          <input class="layer-spacing" type="number" min="0" max="2000" value="${getLayerSpacingPx(layer)}">
        </label>
      </div>
      <p class="helper-text layer-note">Gap keeps minimum edge-to-edge space between placed images. Later passes interlock instead of repeating the same pattern.</p>
      <div class="range-field layer-hue-field">
        <div class="range-labels">
          <label for="layer-hue-${layer.id}">Hue Shift</label>
          <output class="layer-hue-value">${layer.hueShift}deg</output>
        </div>
        <input id="layer-hue-${layer.id}" class="layer-hue" type="range" min="0" max="360" value="${layer.hueShift}">
      </div>
      <div class="inline-actions">
        <button type="button" class="secondary-button save-layer">Save This Layer</button>
      </div>
    `;

    dom.layersList.appendChild(card);
  }

  syncLayerActionState();
}

function createImageCard(source) {
  const card = document.createElement("article");
  card.className = "image-card";
  card.dataset.imageId = String(source.id);
  card.innerHTML = `
    <div class="image-card-header">
      <div class="image-title">
        <div>
          <strong>${source.name}</strong>
          <p class="image-metadata">${getImageControlSummary(source)}</p>
        </div>
      </div>
      <button type="button" class="danger-button remove-image">Remove</button>
    </div>
    <div class="image-preview-frame">
      <canvas class="source-preview" width="640" height="420"></canvas>
    </div>
    <div class="image-grid">
      <label>
        Min px
        <input class="image-min-size" type="number" min="1" max="12000" value="${source.minSize}">
      </label>
      <label>
        Max px
        <input class="image-max-size" type="number" min="1" max="12000" value="${source.maxSize}">
      </label>
      <label>
        Min deg
        <input class="image-min-rotation" type="number" min="-180" max="180" step="1" value="${source.minRotation}">
      </label>
      <label>
        Max deg
        <input class="image-max-rotation" type="number" min="-180" max="180" step="1" value="${source.maxRotation}">
      </label>
    </div>
    <div class="inline-actions">
      <button type="button" class="secondary-button save-image-overlay">Save Used Overlay</button>
      <button type="button" class="pill-button zero-rotation">Keep Rotation At 0</button>
    </div>
  `;
  return card;
}

function renderImages() {
  dom.imagesList.innerHTML = "";

  if (!state.images.length) {
    dom.imagesList.classList.add("empty-library");
    dom.imagesList.innerHTML = `<div class="empty-state compact">No source images loaded yet.</div>`;
    return;
  }

  dom.imagesList.classList.remove("empty-library");

  for (const source of state.images) {
    dom.imagesList.appendChild(createImageCard(source));
  }

  for (const source of state.images) {
    const card = dom.imagesList.querySelector(`[data-image-id="${source.id}"]`);
    const canvas = card.querySelector(".source-preview");
    drawSourcePreview(source, canvas);
  }

  syncImageActionState();
}

function drawSourcePreview(source, canvas) {
  const context = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  context.clearRect(0, 0, width, height);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  const referenceSize = Math.max(...state.images.map((image) => image.maxSize), source.maxSize, 64);
  const sampleSizes = [
    source.minSize,
    Math.round((source.minSize + source.maxSize) / 2),
    source.maxSize
  ];
  const sampleRotations = [
    source.minRotation,
    Math.round((source.minRotation + source.maxRotation) / 2),
    source.maxRotation
  ];
  const anchors = [
    { x: width * 0.26, y: height * 0.62 },
    { x: width * 0.52, y: height * 0.47 },
    { x: width * 0.77, y: height * 0.62 }
  ];

  context.strokeStyle = "rgba(255,255,255,0.12)";
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(width * 0.08, height * 0.78);
  context.lineTo(width * 0.92, height * 0.78);
  context.stroke();

  sampleSizes.forEach((size, index) => {
    const anchor = anchors[index];
    const rotation = sampleRotations[index] * (Math.PI / 180);
    const scale = (size / referenceSize) * (width * 0.28 / Math.max(source.width, source.height));
    const drawWidth = Math.max(2, source.width * scale);
    const drawHeight = Math.max(2, source.height * scale);

    context.save();
    context.translate(anchor.x, anchor.y);
    context.rotate(rotation);
    context.drawImage(source.image, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    context.restore();
  });

  context.fillStyle = "rgba(255,255,255,0.55)";
  context.font = "22px Segoe UI Variable, Bahnschrift, Segoe UI, sans-serif";
  context.fillText(`min ${source.minSize}px`, width * 0.08, height * 0.18);
  context.fillText(`max ${source.maxSize}px`, width * 0.58, height * 0.18);
}

function updatePreviewCanvasFromRender() {
  if (!state.currentRender) {
    dom.previewCanvas.style.display = "none";
    dom.previewEmptyState.style.display = "grid";
    return;
  }

  const maxDisplayWidth = Math.max(220, dom.previewSurface.clientWidth - 24);
  const maxDisplayHeight = Math.max(220, dom.previewSurface.clientHeight - 24);
  const scale = Math.min(maxDisplayWidth / state.outputWidth, maxDisplayHeight / state.outputHeight, 1);
  const displayWidth = Math.max(1, Math.floor(state.outputWidth * scale));
  const displayHeight = Math.max(1, Math.floor(state.outputHeight * scale));
  const deviceRatio = window.devicePixelRatio || 1;

  dom.previewCanvas.width = Math.max(1, Math.floor(displayWidth * deviceRatio));
  dom.previewCanvas.height = Math.max(1, Math.floor(displayHeight * deviceRatio));
  dom.previewCanvas.style.width = `${displayWidth}px`;
  dom.previewCanvas.style.height = `${displayHeight}px`;
  dom.previewCanvas.style.display = "block";
  dom.previewEmptyState.style.display = "none";

  const context = dom.previewCanvas.getContext("2d");
  context.setTransform(deviceRatio, 0, 0, deviceRatio, 0, 0);
  context.clearRect(0, 0, displayWidth, displayHeight);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(dom.renderCanvas, 0, 0, displayWidth, displayHeight);
}

function sanitizeFileFragment(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "layer";
}

function getExportExtension(format) {
  if (format === "image/png") {
    return "png";
  }
  if (format === "image/jpeg") {
    return "jpg";
  }
  return "webp";
}

async function downloadCanvas(canvas, fileStem) {
  const extension = getExportExtension(state.exportFormat);
  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, state.exportFormat, state.exportQuality)
  );

  if (!blob) {
    throw new Error("Export failed in this browser.");
  }

  const downloadUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = downloadUrl;
  anchor.download = `${fileStem}.${extension}`;
  anchor.click();
  URL.revokeObjectURL(downloadUrl);

  return extension;
}

function createHueShiftedLayerCanvas(sourceCanvas, layer) {
  if (!layer.hueShift) {
    return sourceCanvas;
  }

  const targetCanvas = document.createElement("canvas");
  targetCanvas.width = sourceCanvas.width;
  targetCanvas.height = sourceCanvas.height;
  const context = targetCanvas.getContext("2d", { alpha: true });
  context.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
  context.filter = `hue-rotate(${layer.hueShift}deg) saturate(1.18)`;
  context.drawImage(sourceCanvas, 0, 0);
  context.filter = "none";
  return targetCanvas;
}

function readAlpha(data, width, height, x, y) {
  const px = clamp(Math.round(x), 0, width - 1);
  const py = clamp(Math.round(y), 0, height - 1);
  return data[(py * width + px) * 4 + 3];
}

function scoreCoverageHole(data, width, height, x, y, step) {
  let emptyCount = 0;
  for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
    for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
      if (readAlpha(data, width, height, x + offsetX * step * 0.5, y + offsetY * step * 0.5) < 16) {
        emptyCount += 1;
      }
    }
  }
  return emptyCount;
}

function drawPlacementToContext(context, placement, options = {}) {
  const hueShift = options.hueShift || 0;
  context.save();
  if (hueShift) {
    context.filter = `hue-rotate(${hueShift}deg) saturate(1.18)`;
  }
  context.translate(placement.x, placement.y);
  if (placement.flipX) {
    context.scale(-1, 1);
  }
  context.rotate((placement.rotation * Math.PI) / 180);
  context.drawImage(
    placement.source.image,
    -placement.drawWidth / 2,
    -placement.drawHeight / 2,
    placement.drawWidth,
    placement.drawHeight
  );
  context.restore();
}

async function fillVisualCoverageGaps(layer, canvas, placements, token) {
  const density = clamp((state.masterDensity * layer.density) / 10000, 0.01, 1);
  if (density < 0.98 || !state.images.length || getLayerSpacingPx(layer) > 0) {
    return { count: 0, placements: [] };
  }

  const scaleMultiplier = clamp(layer.scaleMultiplier / 100, 0.25, 2);
  const context = canvas.getContext("2d", { alpha: true, willReadFrequently: true });
  const fillRandom = createRandom((state.lastSeed || 1) ^ layer.id ^ placements.length);
  const fillCandidates = [...state.images]
    .map((source) => {
      const metrics = computePlacementMetrics(source, source.minSize, scaleMultiplier);
      return { source, metrics };
    })
    .sort((left, right) => left.metrics.collisionRadius - right.metrics.collisionRadius);

  if (!fillCandidates.length) {
    return { count: 0, placements: [] };
  }

  const minRadius = fillCandidates[0].metrics.collisionRadius;
  const passSteps = density >= 0.995
    ? [Math.max(6, Math.round(minRadius * 1.35)), Math.max(4, Math.round(minRadius * 0.9)), 2]
    : [Math.max(8, Math.round(minRadius * 1.5)), Math.max(4, Math.round(minRadius * 1.0))];

  let added = 0;
  const addedPlacements = [];

  for (const step of passSteps) {
    if (token !== state.renderVersion) {
      throw new Error("Render superseded.");
    }

    const width = canvas.width;
    const height = canvas.height;
    const alphaData = context.getImageData(0, 0, width, height).data;
    const targets = [];

    for (let y = step / 2; y < height; y += step) {
      for (let x = step / 2; x < width; x += step) {
        if (readAlpha(alphaData, width, height, x, y) >= 16) {
          continue;
        }
        const score = scoreCoverageHole(alphaData, width, height, x, y, step);
        if (score >= (density >= 0.995 ? 2 : 4)) {
          targets.push({ x, y, score });
        }
      }
    }

    targets.sort((left, right) => right.score - left.score);
    const maxAddsThisPass = Math.min(
      Math.ceil((width * height) / Math.max(step * step, 1)),
      density >= 0.995 ? 5000 : 1800
    );
    let addedThisPass = 0;
    let liveAlphaData = context.getImageData(0, 0, width, height).data;

    for (let index = 0; index < targets.length && addedThisPass < maxAddsThisPass; index += 1) {
      if (token !== state.renderVersion) {
        throw new Error("Render superseded.");
      }

      const target = targets[index];
      const freshAlpha = readAlpha(liveAlphaData, width, height, target.x, target.y);
      if (freshAlpha >= 16) {
        continue;
      }

      const candidateIndex = Math.floor(fillRandom() * Math.min(4, fillCandidates.length));
      const candidateSource = fillCandidates[candidateIndex].source;
      const sizeMax = Math.min(candidateSource.maxSize, candidateSource.minSize * (density >= 0.995 ? 1.15 : 1.3));
      const instanceSize = randomInRange(candidateSource.minSize, Math.max(candidateSource.minSize, sizeMax), fillRandom);
      const metrics = computePlacementMetrics(candidateSource, instanceSize, scaleMultiplier);
      const placement = {
        source: candidateSource,
        x: target.x,
        y: target.y,
        drawWidth: metrics.drawWidth,
        drawHeight: metrics.drawHeight,
        rotation: randomInRange(candidateSource.minRotation, candidateSource.maxRotation, fillRandom),
        flipX: false,
        hueShift: layer.hueShift
      };

      drawPlacementToContext(context, placement);
      added += 1;
      addedThisPass += 1;
      addedPlacements.push(placement);

      if (addedThisPass % 120 === 0) {
        await waitForFrame();
        liveAlphaData = context.getImageData(0, 0, width, height).data;
      }
    }

    await waitForFrame();
  }

  return { count: added, placements: addedPlacements };
}

async function exportLayer(layerId) {
  if (!state.currentRender || state.dirty) {
    setStatus("Generate the latest settings before saving a layer.", true);
    return;
  }

  const layerRender = getRenderedLayer(layerId);
  if (!layerRender) {
    setStatus("This layer has not been rendered yet.", true);
    return;
  }

  setStatus(`Exporting ${layerRender.name}...`);
  const fileStem = `imggod-${sanitizeFileFragment(layerRender.name)}-${state.outputWidth}x${state.outputHeight}`;
  try {
    const extension = await downloadCanvas(layerRender.canvas, fileStem);
    setStatus(`Exported ${layerRender.name} as ${extension.toUpperCase()}.`);
  } catch (error) {
    setStatus(error.message || "Layer export failed.", true);
  }
}

function appendRenderedPlacementsToSourceGroups(sourceGroups, renderedPlacements) {
  for (const placement of renderedPlacements) {
    const imageId = placement.source.id;
    if (!sourceGroups.has(imageId)) {
      sourceGroups.set(imageId, {
        id: imageId,
        name: placement.source.name,
        count: 0,
        placements: []
      });
    }

    const sourceGroup = sourceGroups.get(imageId);
    sourceGroup.count += 1;
    sourceGroup.placements.push(placement);
  }
}

async function renderSourceOverlayCanvas(sourceRender) {
  const canvas = document.createElement("canvas");
  canvas.width = state.currentRender.width;
  canvas.height = state.currentRender.height;
  const context = canvas.getContext("2d", { alpha: true });
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  for (let index = 0; index < sourceRender.placements.length; index += 1) {
    const placement = sourceRender.placements[index];
    drawPlacementToContext(context, placement, { hueShift: placement.hueShift });

    if (index % 300 === 0) {
      await waitForFrame();
    }
  }

  return canvas;
}

async function exportSourceOverlay(imageId) {
  if (!state.currentRender || state.dirty) {
    setStatus("Generate the latest settings before saving an image overlay.", true);
    return;
  }

  const sourceRender = getRenderedSourceOverlay(imageId);
  if (!sourceRender) {
    setStatus("This source image was not used in the latest render.", true);
    return;
  }

  setStatus(`Exporting overlay for ${sourceRender.name}...`);
  try {
    const canvas = await renderSourceOverlayCanvas(sourceRender);
    const extension = await downloadCanvas(
      canvas,
      `imggod-overlay-${sanitizeFileFragment(sourceRender.name)}-${state.currentRender.width}x${state.currentRender.height}`
    );
    setStatus(`Exported overlay for ${sourceRender.name} as ${extension.toUpperCase()}.`);
  } catch (error) {
    setStatus(error.message || "Overlay export failed.", true);
  }
}

function computePlacementMetrics(source, longestEdge, scaleMultiplier) {
  const adjustedLongest = Math.max(1, longestEdge * scaleMultiplier);
  const baseLongest = Math.max(source.width, source.height);
  const drawScale = adjustedLongest / baseLongest;
  const drawWidth = source.width * drawScale;
  const drawHeight = source.height * drawScale;
  const opaqueWidth = Math.max(1, drawWidth * source.opaqueBounds.width);
  const opaqueHeight = Math.max(1, drawHeight * source.opaqueBounds.height);
  const collisionRadius = Math.max(4, Math.max(opaqueWidth, opaqueHeight) * 0.42);

  return {
    drawWidth,
    drawHeight,
    collisionRadius
  };
}

function shuffleInPlace(items, random) {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
  }
}

function getMinimumDistance(radiusA, radiusB, overlapMode, spacingPx) {
  const touchDistance = radiusA + radiusB;
  const overlapDistance = touchDistance * (1 - overlapMode.allowedOverlap);
  return spacingPx > 0 ? Math.max(overlapDistance, touchDistance + spacingPx) : overlapDistance;
}

function getNeighborQueryRadius(radius, spacingPx) {
  return radius * 2.8 + spacingPx;
}

function getLayerAnchorPattern(layer, spacing, rowStep) {
  const layerIndex = Math.max(0, state.layers.findIndex((entry) => entry.id === layer.id));
  const phase = layerIndex % 3;

  if (phase === 1) {
    return { rowParityOffset: 1, xShift: 0, yShift: 0 };
  }

  if (phase === 2) {
    return { rowParityOffset: 0, xShift: spacing * 0.25, yShift: rowStep * 0.5 };
  }

  return { rowParityOffset: 0, xShift: 0, yShift: 0 };
}

function createEdgeCoverageTargets(spacing, rowStep, averageRadius, spacingPx) {
  const width = state.outputWidth;
  const height = state.outputHeight;
  const sampleStep = Math.max(10, Math.min(spacing * 0.92, averageRadius * 1.45 + spacingPx * 0.85));
  const insetBase = clamp(sampleStep * 0.48, 2, Math.max(width, height));
  const secondaryInset = clamp(
    insetBase + Math.max(3, Math.min(sampleStep * 0.72, averageRadius + spacingPx)),
    2,
    Math.max(width, height)
  );
  const horizontalMax = Math.max(sampleStep / 2, width - sampleStep / 2);
  const verticalMax = Math.max(sampleStep / 2, height - sampleStep / 2);
  const targets = [];
  const seen = new Set();

  const pushTarget = (x, y) => {
    const clampedX = clamp(x, sampleStep / 2, Math.max(sampleStep / 2, width - sampleStep / 2));
    const clampedY = clamp(y, sampleStep / 2, Math.max(sampleStep / 2, height - sampleStep / 2));
    const key = `${Math.round(clampedX)},${Math.round(clampedY)}`;
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    targets.push({ x: clampedX, y: clampedY });
  };

  const verticalInsets = [insetBase, secondaryInset].filter((value, index, values) => values.indexOf(value) === index);
  const horizontalInsets = verticalInsets;

  for (const inset of verticalInsets) {
    for (let x = sampleStep / 2; x <= horizontalMax; x += sampleStep) {
      pushTarget(x, inset);
      pushTarget(x, height - inset);
    }
  }

  for (const inset of horizontalInsets) {
    for (let y = sampleStep / 2; y <= verticalMax; y += rowStep) {
      pushTarget(inset, y);
      pushTarget(width - inset, y);
    }
  }

  pushTarget(insetBase, insetBase);
  pushTarget(width - insetBase, insetBase);
  pushTarget(insetBase, height - insetBase);
  pushTarget(width - insetBase, height - insetBase);

  return targets;
}

function canOccupyPosition(placement, x, y, spatialHash, overlapMode, spacingPx, width, height) {
  const margin = Math.max(placement.drawWidth, placement.drawHeight) * 0.22;
  const clampedX = clamp(x, -margin, width + margin);
  const clampedY = clamp(y, -margin, height + margin);
  const neighbors = spatialHash.query(clampedX, clampedY, getNeighborQueryRadius(placement.radius, spacingPx));

  for (const neighbor of neighbors) {
    if (neighbor.id === placement.id) {
      continue;
    }

    const dx = clampedX - neighbor.x;
    const dy = clampedY - neighbor.y;
    const distance = Math.hypot(dx, dy) || 0.0001;
    const minimumDistance = getMinimumDistance(placement.radius, neighbor.radius, overlapMode, spacingPx);
    if (distance < minimumDistance - 0.35) {
      return null;
    }
  }

  return { x: clampedX, y: clampedY };
}

function movePlacementAlongVector(placement, vectorX, vectorY, travelDistance, spatialHash, overlapMode, spacingPx, width, height) {
  const length = Math.hypot(vectorX, vectorY);
  if (!length || !travelDistance) {
    return false;
  }

  const unitX = vectorX / length;
  const unitY = vectorY / length;
  let step = travelDistance;
  let moved = false;

  while (step > 0.5) {
    const target = canOccupyPosition(
      placement,
      placement.x + unitX * step,
      placement.y + unitY * step,
      spatialHash,
      overlapMode,
      spacingPx,
      width,
      height
    );

    if (target) {
      if (Math.abs(target.x - placement.x) < 0.01 && Math.abs(target.y - placement.y) < 0.01) {
        step *= 0.5;
        continue;
      }
      placement.x = target.x;
      placement.y = target.y;
      spatialHash.update(placement);
      moved = true;
    } else {
      step *= 0.5;
    }
  }

  return moved;
}

async function compactPlacements(placements, spatialHash, overlapMode, spacingPx, density, averageRadius, token) {
  if (placements.length < 2 || density < 0.78) {
    return;
  }

  const passes = density >= 0.99 ? 8 : density >= 0.92 ? 6 : 3;
  const sweepDirections = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
    [1, 1],
    [-1, 1],
    [1, -1],
    [-1, -1]
  ];
  const centerX = state.outputWidth / 2;
  const centerY = state.outputHeight / 2;
  const baseTravel = Math.max(8, averageRadius * (density >= 0.99 ? 1.8 : 1.1) + spacingPx * 0.35);

  for (let pass = 0; pass < passes; pass += 1) {
    for (const [directionX, directionY] of sweepDirections) {
      if (token !== state.renderVersion) {
        throw new Error("Render superseded.");
      }

      const ordered = [...placements].sort(
        (left, right) =>
          right.x * directionX + right.y * directionY - (left.x * directionX + left.y * directionY)
      );

      for (let index = 0; index < ordered.length; index += 1) {
        const placement = ordered[index];
        movePlacementAlongVector(
          placement,
          directionX,
          directionY,
          baseTravel,
          spatialHash,
          overlapMode,
          spacingPx,
          state.outputWidth,
          state.outputHeight
        );
      }
    }

    const centerOrdered = [...placements].sort(
      (left, right) =>
        Math.hypot(right.x - centerX, right.y - centerY) - Math.hypot(left.x - centerX, left.y - centerY)
    );

    for (let index = 0; index < centerOrdered.length; index += 1) {
      if (token !== state.renderVersion) {
        throw new Error("Render superseded.");
      }

      const placement = centerOrdered[index];
      movePlacementAlongVector(
        placement,
        centerX - placement.x,
        centerY - placement.y,
        baseTravel * 0.75,
        spatialHash,
        overlapMode,
        spacingPx,
        state.outputWidth,
        state.outputHeight
      );
    }

    await waitForFrame();
  }
}

async function fillPackingGaps(layer, placements, spatialHash, random, density, scaleMultiplier, averageRadius, spacingPx, token) {
  const overlapMode = OVERLAP_MODES[layer.overlap];
  if (density < 0.9 || (!spacingPx && overlapMode.allowedOverlap > 0.16) || !state.images.length) {
    return;
  }

  const sourcesBySmallest = [...state.images].sort((left, right) => left.minSize - right.minSize);
  const sampleStep = Math.max(10 + spacingPx * 0.45, averageRadius * (density >= 0.99 ? 0.9 : 1.15) + spacingPx);
  let added = 0;

  for (let y = sampleStep / 2; y <= state.outputHeight; y += sampleStep) {
    if (token !== state.renderVersion) {
      throw new Error("Render superseded.");
    }

    for (let x = sampleStep / 2; x <= state.outputWidth; x += sampleStep) {
      const neighbors = spatialHash.query(x, y, sampleStep * 1.45);
      const covered = neighbors.some(
        (neighbor) => Math.hypot(x - neighbor.x, y - neighbor.y) < neighbor.radius * 0.94 + spacingPx * 0.5
      );
      if (covered) {
        continue;
      }

      for (let attempt = 0; attempt < Math.min(4, sourcesBySmallest.length); attempt += 1) {
        const source = sourcesBySmallest[(attempt + Math.floor(random() * Math.min(3, sourcesBySmallest.length))) % sourcesBySmallest.length];
        const sizeBias = density >= 0.99 ? 0.18 : 0.32;
        const instanceSize = lerp(source.minSize, source.maxSize, random() * sizeBias);
        const rotation = randomInRange(source.minRotation, source.maxRotation, random);
        const metrics = computePlacementMetrics(source, instanceSize, scaleMultiplier);
        const candidate = {
          id: `${layer.id}-gap-${added}-${attempt}-${Math.floor(x)}-${Math.floor(y)}`,
          source,
          x,
          y,
          radius: metrics.collisionRadius,
          drawWidth: metrics.drawWidth,
          drawHeight: metrics.drawHeight,
          rotation,
          flipX: false
        };

        const placed = resolvePlacement(
          candidate,
          spatialHash,
          state.outputWidth,
          state.outputHeight,
          overlapMode,
          spacingPx,
          0.12,
          density,
          x,
          y
        );

        if (placed) {
          placements.push(candidate);
          spatialHash.insert(candidate);
          added += 1;
          break;
        }
      }
    }

    await waitForFrame();
  }
}

async function fillEdgeCoverageGaps(layer, placements, spatialHash, random, density, scaleMultiplier, averageRadius, spacingPx, spacing, rowStep, token) {
  if (!state.images.length) {
    return;
  }

  const overlapMode = OVERLAP_MODES[layer.overlap];
  const sourcesBySmallest = [...state.images].sort((left, right) => left.minSize - right.minSize);
  const targets = createEdgeCoverageTargets(spacing, rowStep, averageRadius, spacingPx);
  const maxAdds = Math.min(
    Math.max(24, Math.ceil((state.outputWidth + state.outputHeight) / Math.max(Math.min(spacing, rowStep), 1)) * 3),
    targets.length
  );
  let added = 0;

  for (let index = 0; index < targets.length && added < maxAdds; index += 1) {
    if (token !== state.renderVersion) {
      throw new Error("Render superseded.");
    }

    const target = targets[index];
    const neighbors = spatialHash.query(
      target.x,
      target.y,
      Math.max(averageRadius * 1.8 + spacingPx, spacing * 0.7)
    );
    const covered = neighbors.some((neighbor) => {
      const distance = Math.hypot(target.x - neighbor.x, target.y - neighbor.y);
      return distance < neighbor.radius * 0.88 + spacingPx * 0.35;
    });
    if (covered) {
      continue;
    }

    for (let attempt = 0; attempt < Math.min(5, sourcesBySmallest.length); attempt += 1) {
      const sourceIndex =
        (attempt + Math.floor(random() * Math.min(4, sourcesBySmallest.length))) % sourcesBySmallest.length;
      const source = sourcesBySmallest[sourceIndex];
      const sizeBias = density >= 0.85 ? 0.42 : density >= 0.6 ? 0.55 : 0.7;
      const instanceSize = lerp(source.minSize, source.maxSize, random() * sizeBias);
      const metrics = computePlacementMetrics(source, instanceSize, scaleMultiplier);
      const candidate = {
        id: `${layer.id}-edge-${added}-${attempt}-${Math.floor(target.x)}-${Math.floor(target.y)}`,
        source,
        x: target.x + centeredRandom(random) * Math.min(spacing * 0.12, averageRadius * 0.5),
        y: target.y + centeredRandom(random) * Math.min(rowStep * 0.12, averageRadius * 0.5),
        radius: metrics.collisionRadius,
        drawWidth: metrics.drawWidth,
        drawHeight: metrics.drawHeight,
        rotation: randomInRange(source.minRotation, source.maxRotation, random),
        flipX: false
      };

      const placed = resolvePlacement(
        candidate,
        spatialHash,
        state.outputWidth,
        state.outputHeight,
        overlapMode,
        spacingPx,
        0.08,
        density,
        target.x,
        target.y
      );

      if (placed) {
        placements.push(candidate);
        spatialHash.insert(candidate);
        added += 1;
        break;
      }
    }

    if (index % 120 === 0) {
      await waitForFrame();
    }
  }
}

function resolvePlacement(candidate, spatialHash, width, height, overlapMode, spacingPx, randomness, density, anchorX, anchorY) {
  const margin = Math.max(candidate.drawWidth, candidate.drawHeight) * 0.22;
  const allowedOverlap = overlapMode.allowedOverlap;
  const prefersSeparatedPacking = spacingPx > 0 || allowedOverlap <= 0.12;
  let x = clamp(candidate.x, -margin, width + margin);
  let y = clamp(candidate.y, -margin, height + margin);

  for (let attempt = 0; attempt < 12; attempt += 1) {
    const neighbors = spatialHash.query(x, y, getNeighborQueryRadius(candidate.radius, spacingPx));
    let pushX = 0;
    let pushY = 0;
    let hasOverlap = false;
    let nearestGap = Infinity;
    let nearestVector = null;

    for (const neighbor of neighbors) {
      const dx = x - neighbor.x;
      const dy = y - neighbor.y;
      const distance = Math.hypot(dx, dy) || 0.0001;
      const minimumDistance = getMinimumDistance(candidate.radius, neighbor.radius, overlapMode, spacingPx);

      if (distance < minimumDistance) {
        hasOverlap = true;
        const push = minimumDistance - distance + 0.35;
        pushX += (dx / distance) * push;
        pushY += (dy / distance) * push;
      } else if (prefersSeparatedPacking) {
        const gap = distance - minimumDistance;
        if (gap < nearestGap) {
          nearestGap = gap;
          nearestVector = { dx, dy, distance };
        }
      }
    }

    if (hasOverlap) {
      x = clamp(x + pushX, -margin, width + margin);
      y = clamp(y + pushY, -margin, height + margin);
      continue;
    }

    if (prefersSeparatedPacking && nearestVector && nearestGap < candidate.radius * (0.85 - density * 0.22) + spacingPx) {
      const snapDistance = Math.min(
        nearestGap,
        candidate.radius * (0.18 + density * 0.18 + (1 - randomness) * 0.14) + spacingPx * 0.65
      );
      x = clamp(x - (nearestVector.dx / nearestVector.distance) * snapDistance, -margin, width + margin);
      y = clamp(y - (nearestVector.dy / nearestVector.distance) * snapDistance, -margin, height + margin);
    } else {
      break;
    }
  }

  if (randomness < 0.4) {
    const settleAmount = (0.4 - randomness) * 0.18;
    x = lerp(x, anchorX, settleAmount);
    y = lerp(y, anchorY, settleAmount);
  }

  const finalNeighbors = spatialHash.query(x, y, getNeighborQueryRadius(candidate.radius, spacingPx));
  for (const neighbor of finalNeighbors) {
    const dx = x - neighbor.x;
    const dy = y - neighbor.y;
    const distance = Math.hypot(dx, dy) || 0.0001;
    const minimumDistance = getMinimumDistance(candidate.radius, neighbor.radius, overlapMode, spacingPx);
    if (distance < minimumDistance - 0.6) {
      return false;
    }
  }

  candidate.x = x;
  candidate.y = y;
  return true;
}

async function buildLayerPlacements(layer, random, token) {
  const overlapMode = OVERLAP_MODES[layer.overlap];
  const density = clamp((state.masterDensity * layer.density) / 10000, 0.01, 1);
  const randomness = clamp((state.masterRandomness * layer.randomness) / 10000, 0.01, 1);
  const scaleMultiplier = clamp(layer.scaleMultiplier / 100, 0.25, 2);
  const spacingPx = getLayerSpacingPx(layer);

  const sampleMetrics = state.images.map((source) => {
    const midpoint = (source.minSize + source.maxSize) / 2;
    const metrics = computePlacementMetrics(source, midpoint, scaleMultiplier);
    return {
      averageArea: metrics.drawWidth * metrics.drawHeight,
      collisionRadius: metrics.collisionRadius
    };
  });

  const averageArea =
    sampleMetrics.reduce((sum, entry) => sum + entry.averageArea, 0) / Math.max(sampleMetrics.length, 1);
  const averageRadius =
    sampleMetrics.reduce((sum, entry) => sum + entry.collisionRadius, 0) / Math.max(sampleMetrics.length, 1);
  const averageFootprintArea = Math.max(averageArea, Math.PI * (averageRadius + spacingPx * 0.5) ** 2);

  const nearSolidPacking = density >= 0.98 && overlapMode.allowedOverlap <= 0.12;
  const packedSpacing = nearSolidPacking
    ? overlapMode.highDensitySpacing * 0.78
    : lerp(2.15, overlapMode.highDensitySpacing, density);
  const spacing = Math.max(12 + spacingPx, averageRadius * 2 * packedSpacing + spacingPx);
  const rowStep = spacing * 0.866;
  const fillProbability = nearSolidPacking ? 1 : clamp(lerp(0.12, 1, density), 0.12, 1);
  const edgeMargin = spacing * 1.2 + spacingPx;
  const anchorPattern = getLayerAnchorPattern(layer, spacing, rowStep);
  const gridAnchors = [];

  let row = anchorPattern.rowParityOffset;
  for (let y = -edgeMargin + anchorPattern.yShift; y <= state.outputHeight + edgeMargin; y += rowStep) {
    const offset = row % 2 ? spacing / 2 : 0;
    for (let x = -edgeMargin + anchorPattern.xShift; x <= state.outputWidth + edgeMargin; x += spacing) {
      if (random() <= fillProbability) {
        gridAnchors.push({ x: x + offset, y });
      }
    }
    row += 1;
  }

  const boundaryAnchors = createEdgeCoverageTargets(spacing, rowStep, averageRadius, spacingPx).map((target) => ({
    x: target.x,
    y: target.y
  }));
  const scatterAnchors = [];
  const extraScatterCount = Math.round(
    gridAnchors.length * randomness * (0.05 + overlapMode.randomScatter + density * 0.05)
  );
  for (let index = 0; index < extraScatterCount; index += 1) {
    scatterAnchors.push({
      x: randomInRange(-edgeMargin, state.outputWidth + edgeMargin, random),
      y: randomInRange(-edgeMargin, state.outputHeight + edgeMargin, random)
    });
  }

  if (randomness > 0.35 || gridAnchors.length > 200) {
    shuffleInPlace(gridAnchors, random);
  }

  if (scatterAnchors.length) {
    shuffleInPlace(scatterAnchors, random);
  }

  const targetPlacements = Math.min(
    Math.max(
      12,
      Math.round(
        (state.outputWidth * state.outputHeight * (0.16 + density * (nearSolidPacking ? 1.9 : 1.28))) /
          Math.max(averageFootprintArea, 1)
      )
    ),
    nearSolidPacking ? 22000 : 16000
  );

  const placements = [];
  const spatialHash = new SpatialHash(Math.max(24, averageRadius * 1.5 + spacingPx));
  const tryPlaceAnchorSet = async (anchors, idPrefix, jitterScale, stopAtTarget = false) => {
    for (let index = 0; index < anchors.length; index += 1) {
      if (stopAtTarget && placements.length >= targetPlacements) {
        return;
      }
      if (token !== state.renderVersion) {
        throw new Error("Render superseded.");
      }

      const anchor = anchors[index];
      const source = state.images[Math.floor(random() * state.images.length)];
      const instanceSize = randomInRange(source.minSize, source.maxSize, random);
      const rotation = randomInRange(source.minRotation, source.maxRotation, random);
      const metrics = computePlacementMetrics(source, instanceSize, scaleMultiplier);
      const jitterAmount =
        spacing * (0.04 + randomness * (0.48 + overlapMode.randomScatter)) * jitterScale;

      const candidate = {
        id: `${layer.id}-${idPrefix}-${index}`,
        source,
        x: anchor.x + centeredRandom(random) * jitterAmount,
        y: anchor.y + centeredRandom(random) * jitterAmount,
        radius: metrics.collisionRadius,
        drawWidth: metrics.drawWidth,
        drawHeight: metrics.drawHeight,
        rotation,
        flipX: false
      };

      const placed = resolvePlacement(
        candidate,
        spatialHash,
        state.outputWidth,
        state.outputHeight,
        overlapMode,
        spacingPx,
        randomness,
        density,
        anchor.x,
        anchor.y
      );

      if (placed) {
        placements.push(candidate);
        spatialHash.insert(candidate);
      }

      if (index % 250 === 0) {
        await waitForFrame();
      }
    }
  };

  await tryPlaceAnchorSet(boundaryAnchors, "edge-anchor", 0.28, false);
  await tryPlaceAnchorSet(gridAnchors, "grid", 1, true);
  await tryPlaceAnchorSet(scatterAnchors, "scatter", 1.15, true);

  if (placements.length && (spacingPx > 0 || overlapMode.allowedOverlap <= 0.12)) {
    await compactPlacements(placements, spatialHash, overlapMode, spacingPx, density, averageRadius, token);
    await fillPackingGaps(layer, placements, spatialHash, random, density, scaleMultiplier, averageRadius, spacingPx, token);
    if (density >= 0.9) {
      await compactPlacements(placements, spatialHash, overlapMode, spacingPx, density, averageRadius, token);
    }
  }

  await fillEdgeCoverageGaps(
    layer,
    placements,
    spatialHash,
    random,
    density,
    scaleMultiplier,
    averageRadius,
    spacingPx,
    spacing,
    rowStep,
    token
  );

  return placements;
}

async function renderLayerToCanvas(layer, placements, token) {
  const baseCanvas = document.createElement("canvas");
  baseCanvas.width = state.outputWidth;
  baseCanvas.height = state.outputHeight;
  const context = baseCanvas.getContext("2d", { alpha: true });
  context.clearRect(0, 0, baseCanvas.width, baseCanvas.height);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  for (let index = 0; index < placements.length; index += 1) {
    if (token !== state.renderVersion) {
      throw new Error("Render superseded.");
    }

    const placement = placements[index];
    drawPlacementToContext(context, placement);

    if (index % 300 === 0) {
      await waitForFrame();
    }
  }

  const visualFill = await fillVisualCoverageGaps(layer, baseCanvas, placements, token);
  const renderedPlacements = placements
    .map((placement) => ({ ...placement, hueShift: layer.hueShift }))
    .concat(visualFill.placements);

  return {
    canvas: createHueShiftedLayerCanvas(baseCanvas, layer),
    visualFillCount: visualFill.count,
    renderedPlacements
  };
}

async function generateComposite() {
  const reason = getGenerationBlockReason();
  if (reason) {
    setStatus(reason, true);
    updateActionState();
    return;
  }

  state.isRendering = true;
  state.renderVersion += 1;
  const token = state.renderVersion;
  updateActionState();
  setStatus("Preparing full-resolution composite...");

  try {
    const seed = Math.floor(Math.random() * 0xffffffff);
    const random = createRandom(seed);
    const renderContext = dom.renderCanvas.getContext("2d", { alpha: true });
    dom.renderCanvas.width = state.outputWidth;
    dom.renderCanvas.height = state.outputHeight;
    renderContext.clearRect(0, 0, state.outputWidth, state.outputHeight);
    renderContext.imageSmoothingEnabled = true;
    renderContext.imageSmoothingQuality = "high";

    const enabledLayers = state.layers.filter((layer) => layer.enabled);
    const stats = [];
    const layerRenders = [];
    const sourcePlacementMap = new Map();
    let totalPlacements = 0;

    for (const layer of enabledLayers) {
      setStatus(`Generating ${layer.name}...`);
      const placements = await buildLayerPlacements(layer, random, token);
      const { canvas: layerCanvas, visualFillCount, renderedPlacements } = await renderLayerToCanvas(layer, placements, token);
      renderContext.drawImage(layerCanvas, 0, 0);
      stats.push({ name: layer.name, count: placements.length + visualFillCount });
      appendRenderedPlacementsToSourceGroups(sourcePlacementMap, renderedPlacements);
      layerRenders.push({
        id: layer.id,
        name: layer.name,
        canvas: layerCanvas,
        count: placements.length + visualFillCount,
        hueShift: layer.hueShift
      });
      totalPlacements += placements.length + visualFillCount;
      await waitForFrame();
    }

    state.lastSeed = seed;
    state.currentRender = {
      width: state.outputWidth,
      height: state.outputHeight,
      seed,
      total: totalPlacements,
      stats,
      layers: layerRenders,
      sources: Array.from(sourcePlacementMap.values())
    };
    state.dirty = false;

    updatePreviewCanvasFromRender();
    updateRenderStats();
    setStatus(`Generated ${totalPlacements} placed instances across ${enabledLayers.length} layer${enabledLayers.length === 1 ? "" : "s"}.`);
  } catch (error) {
    if (error && error.message === "Render superseded.") {
      return;
    }
    console.error(error);
    setStatus(error.message || "Generation failed.", true);
  } finally {
    state.isRendering = false;
    updateActionState();
  }
}

async function exportComposite() {
  if (!state.currentRender || state.dirty) {
    setStatus("Generate the latest settings before exporting.", true);
    return;
  }

  const extension = getExportExtension(state.exportFormat);
  setStatus(`Exporting ${extension.toUpperCase()}...`);
  try {
    await downloadCanvas(dom.renderCanvas, `imggod-${state.outputWidth}x${state.outputHeight}-${Date.now()}`);
    setStatus(`Exported ${extension.toUpperCase()} at ${state.outputWidth} x ${state.outputHeight}px.`);
  } catch (error) {
    setStatus(error.message || "Export failed.", true);
  }
}

function updateImageFromCard(card) {
  const imageId = Number(card.dataset.imageId);
  const source = state.images.find((entry) => entry.id === imageId);
  if (!source) {
    return;
  }

  const minSizeInput = card.querySelector(".image-min-size");
  const maxSizeInput = card.querySelector(".image-max-size");
  const minRotationInput = card.querySelector(".image-min-rotation");
  const maxRotationInput = card.querySelector(".image-max-rotation");

  source.minSize = readBoundedIntegerInput(minSizeInput, source.minSize, 1, 12000);
  source.maxSize = readBoundedIntegerInput(maxSizeInput, source.maxSize, source.minSize, 12000);
  source.minRotation = readBoundedIntegerInput(minRotationInput, source.minRotation, -180, 180);
  source.maxRotation = readBoundedIntegerInput(maxRotationInput, source.maxRotation, source.minRotation, 180);

  minSizeInput.value = String(source.minSize);
  maxSizeInput.value = String(source.maxSize);
  minRotationInput.value = String(source.minRotation);
  maxRotationInput.value = String(source.maxRotation);

  const metadata = card.querySelector(".image-metadata");
  if (metadata) {
    metadata.textContent = getImageControlSummary(source);
  }

  drawSourcePreview(source, card.querySelector(".source-preview"));
  markDirty();
}

function updateLayerFromCard(card) {
  const layerId = Number(card.dataset.layerId);
  const layer = state.layers.find((entry) => entry.id === layerId);
  if (!layer) {
    return;
  }

  layer.enabled = card.querySelector(".layer-enabled").checked;
  layer.density = readBoundedIntegerInput(card.querySelector(".layer-density"), layer.density, 1, 100);
  layer.randomness = readBoundedIntegerInput(card.querySelector(".layer-randomness"), layer.randomness, 1, 100);
  layer.overlap = card.querySelector(".layer-overlap").value;
  layer.scaleMultiplier = readBoundedIntegerInput(card.querySelector(".layer-scale"), layer.scaleMultiplier, 25, 200);
  layer.spacingPx = readBoundedIntegerInput(card.querySelector(".layer-spacing"), layer.spacingPx, 0, 2000);
  layer.hueShift = readBoundedIntegerInput(card.querySelector(".layer-hue"), layer.hueShift, 0, 360);

  const badge = card.querySelector(".badge");
  if (badge) {
    badge.textContent = getLayerBadgeText(layer);
  }
  const hueOutput = card.querySelector(".layer-hue-value");
  if (hueOutput) {
    hueOutput.textContent = `${layer.hueShift}deg`;
  }
  markDirty();
}

function commitOutputDimension(input, dimensionKey) {
  state[dimensionKey] = readBoundedIntegerInput(input, state[dimensionKey], 64, 12000);
  updateSummaryText();
  markDirty();
}

function commitLayerCount() {
  const count = readBoundedIntegerInput(dom.layerCount, state.layers.length || 1, 1, 8);
  syncLayers(count);
  renderLayers();
  markDirty();
}

async function handleFiles(fileList) {
  const files = Array.from(fileList).filter((file) => file.type.startsWith("image/"));
  if (!files.length) {
    setStatus("Select PNG, JPG, or WEBP files to start.", true);
    return;
  }

  setStatus(`Loading ${files.length} image${files.length === 1 ? "" : "s"} at full resolution...`);
  for (const file of files) {
    const source = await loadSourceImage(file);
    state.images.push(source);
  }

  renderImages();
  updateSummaryText();
  markDirty();
  updateActionState();
  setStatus(`Loaded ${files.length} image${files.length === 1 ? "" : "s"}.`);
}

function removeImage(imageId) {
  const index = state.images.findIndex((entry) => entry.id === imageId);
  if (index === -1) {
    return;
  }

  const [removed] = state.images.splice(index, 1);
  URL.revokeObjectURL(removed.objectUrl);
  renderImages();

  if (!state.images.length) {
    state.currentRender = null;
    state.dirty = false;
    dom.renderCanvas.width = 0;
    dom.renderCanvas.height = 0;
    updatePreviewCanvasFromRender();
    updateRenderStats();
  } else {
    markDirty();
  }

  updateSummaryText();
  updateActionState();
  setStatus(`Removed ${removed.name}.`);
}

function onResize() {
  if (state.currentRender) {
    updatePreviewCanvasFromRender();
  }
}

function bindEvents() {
  dom.imageInput.addEventListener("change", async (event) => {
    await handleFiles(event.target.files);
    dom.imageInput.value = "";
  });

  ["dragenter", "dragover"].forEach((eventName) => {
    dom.uploadDropzone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dom.uploadDropzone.classList.add("dragover");
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    dom.uploadDropzone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dom.uploadDropzone.classList.remove("dragover");
    });
  });

  dom.uploadDropzone.addEventListener("drop", async (event) => {
    const files = event.dataTransfer?.files;
    if (files && files.length) {
      await handleFiles(files);
    }
  });

  dom.outputWidth.addEventListener("change", () => {
    commitOutputDimension(dom.outputWidth, "outputWidth");
  });

  dom.outputWidth.addEventListener("blur", () => {
    commitOutputDimension(dom.outputWidth, "outputWidth");
  });

  dom.outputHeight.addEventListener("change", () => {
    commitOutputDimension(dom.outputHeight, "outputHeight");
  });

  dom.outputHeight.addEventListener("blur", () => {
    commitOutputDimension(dom.outputHeight, "outputHeight");
  });

  dom.masterRandomness.addEventListener("input", () => {
    state.masterRandomness = clamp(Number(dom.masterRandomness.value) || 1, 1, 100);
    updateSummaryText();
    markDirty();
  });

  dom.masterDensity.addEventListener("input", () => {
    state.masterDensity = clamp(Number(dom.masterDensity.value) || 1, 1, 100);
    updateSummaryText();
    markDirty();
  });

  dom.layerCount.addEventListener("change", () => {
    commitLayerCount();
  });

  dom.layerCount.addEventListener("blur", () => {
    commitLayerCount();
  });

  dom.exportFormat.addEventListener("change", () => {
    state.exportFormat = dom.exportFormat.value;
    updateSummaryText();
    updateActionState();
  });

  dom.exportQuality.addEventListener("input", () => {
    state.exportQuality = clamp(Number(dom.exportQuality.value) / 100, 0.8, 1);
    updateSummaryText();
  });

  dom.layersList.addEventListener("change", (event) => {
    const card = event.target.closest(".layer-card");
    if (card) {
      updateLayerFromCard(card);
    }
  });

  dom.layersList.addEventListener("input", (event) => {
    if (!event.target.matches(".layer-hue")) {
      return;
    }
    const card = event.target.closest(".layer-card");
    if (card) {
      updateLayerFromCard(card);
    }
  });

  dom.layersList.addEventListener("focusout", (event) => {
    const card = event.target.closest(".layer-card");
    if (card && event.target.matches('input[type="number"]')) {
      updateLayerFromCard(card);
    }
  });

  dom.imagesList.addEventListener("change", (event) => {
    const card = event.target.closest(".image-card");
    if (card) {
      updateImageFromCard(card);
    }
  });

  dom.imagesList.addEventListener("focusout", (event) => {
    const card = event.target.closest(".image-card");
    if (card && event.target.matches('input[type="number"]')) {
      updateImageFromCard(card);
    }
  });

  dom.imagesList.addEventListener("click", (event) => {
    const card = event.target.closest(".image-card");
    if (!card) {
      return;
    }

    if (event.target.closest(".save-image-overlay")) {
      exportSourceOverlay(Number(card.dataset.imageId));
      return;
    }

    if (event.target.closest(".remove-image")) {
      removeImage(Number(card.dataset.imageId));
      return;
    }

    if (event.target.closest(".zero-rotation")) {
      card.querySelector(".image-min-rotation").value = "0";
      card.querySelector(".image-max-rotation").value = "0";
      updateImageFromCard(card);
    }
  });

  dom.layersList.addEventListener("click", (event) => {
    const card = event.target.closest(".layer-card");
    if (!card) {
      return;
    }

    if (event.target.closest(".save-layer")) {
      exportLayer(Number(card.dataset.layerId));
    }
  });

  dom.generateButton.addEventListener("click", async () => {
    await generateComposite();
  });

  dom.regenerateButton.addEventListener("click", async () => {
    await generateComposite();
  });

  dom.exportButton.addEventListener("click", async () => {
    await exportComposite();
  });

  window.addEventListener("resize", onResize);
  window.addEventListener("beforeunload", () => {
    state.images.forEach((source) => URL.revokeObjectURL(source.objectUrl));
  });
}

function initialize() {
  syncLayers(Number(dom.layerCount.value));
  renderLayers();
  renderImages();
  updateSummaryText();
  updateRenderStats();
  updateActionState();
  bindEvents();
}

initialize();
