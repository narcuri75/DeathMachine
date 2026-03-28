const STORAGE_KEY = "bubble-borough-save-v1";
const SAVE_FILE_FORMAT = "bubble-borough-save";
const SAVE_FILE_EXPORT_VERSION = 1;
const STATE_VERSION = 8;
const STARTING_COINS = 20;
const DEBUG_MODE = false;
const MAX_HEALTH_UNITS = 6;
const RECOVERY_FEED_STREAK = 4;
const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_MS = 7 * DAY_MS;
const HOUR_MS = 60 * 60 * 1000;
const POOP_FALL_MS = 18 * 1000;
const TANK_WIDTH = 1280;
const TANK_HEIGHT = 720;
const SCRUB_GRID_COLS = 72;
const SCRUB_GRID_ROWS = 40;
const SCRUB_THRESHOLD = 0.8;
const SCRUB_BRUSH_RADIUS = 124;
const SCRUB_STROKE_STEP = 34;
const CLEAN_FADE_MS = 950;
const CLEAN_SPARKLE_MS = 1550;
const DEFAULT_THEME = "dark";
const DEFAULT_BACKGROUND_ASSET_KEY = "classic-sand.png";
const DEFAULT_GRAVEL_ASSET_KEY = "classic-sand.png";
const DEFAULT_DECOR_SCALE = 1.5;
const DECOR_SCALE_MIN = 0.5;
const DECOR_SCALE_MAX = 3;
const DEFAULT_FISH_SCALE = 1;
const FISH_SCALE_MIN = 0.5;
const FISH_SCALE_MAX = 3;
const SIZE_STEP = 0.05;
const GRAVEL_COLOR_SWATCHES = [
  "#F5C185",
  "#F19A76",
  "#E07A9C",
  "#B98DEB",
  "#8AA8F7",
  "#67C8E0",
  "#6FD7B8",
  "#8FD368",
  "#D7C56A",
  "#BFC7D2",
  "#81909F",
  "#4E5966"
];
const DEFAULT_GRAVEL_PALETTE = ["#F5C185", "#E07A9C", "#81909F"];
const AMBIENT_BUBBLE_DEPTH_LAYERS = 5;
const TANK_DEPTH_LAYERS = 5;
const DEFAULT_TANK_LAYER = 3;
const GRAVEL_BED_STAMP_COUNT = 7600;
const GRAVEL_LIVE_PEBBLE_COUNT = 220;
const GRAVEL_SPRITE_CACHE_SIZE = 256;
const GRAVEL_PEBBLE_SIZE_MIN = 7;
const GRAVEL_PEBBLE_SIZE_MAX = 14;
const GRAVEL_BED_DEPTH_PX = 92;
const GRAVEL_LIVE_LAYER_DEPTH_PX = 10;
const GRAVEL_SURFACE_CAP_DEPTH_PX = 18;
const GRAVEL_SURFACE_EMBED_PX = 3.5;
const GRAVEL_SURFACE_RISE_PX = 28;
const GRAVEL_PULL_ZONE_PX = 30;
const GRAVEL_VARIANT_BUCKETS = 7;
const GRAVEL_FISH_DISTURB_RADIUS_PX = 56;
const GRAVEL_FISH_DISTURB_MS_MIN = 1600;
const GRAVEL_FISH_DISTURB_MS_MAX = 3200;
const GRAVEL_CACHE_OVERSAMPLE = 1.08;
const SUBSTRATE_CONTOUR_POINTS = 26;
const ALPHA_HIT_THRESHOLD = 26;
const ALPHA_COLLISION_THRESHOLD = 40;
const ALPHA_MASK_GRID_SIZE = 28;
const GLASS_MARGIN_X = 0;
const GLASS_MARGIN_BOTTOM = 0;
const WATER_SURFACE_Y = 56;
const FLOOR_Y = TANK_HEIGHT * 0.83;
const CAVE_CENTER_TARGET_SIZE_PX = 50;
const CAVE_NAV_MAX_SIZE = 220;
const CAVE_PATH_NODE_STEP = 10;
const CAVE_STRICT_SAMPLE_STEP_PX = 2;
const CAVE_PLAN_SAMPLE_STEP_PX = 4;
const CAVE_PLAN_SEGMENT_STEP_PX = 10;
const CAVE_PORTAL_SCAN_RADIUS_PX = 28;
const CAVE_APPROACH_SCAN_RADIUS_PX = 44;
const CAVE_GENERAL_REACHED_DISTANCE_NORM = 0.018;
const CAVE_MOUTH_REACHED_DISTANCE_NORM = 0.014;
const CAVE_TRIGGER_COOLDOWN_MS = 10 * 1000;
const CAVE_IDLE_TARGET_MIN_MS = 2400;
const CAVE_IDLE_TARGET_MAX_MS = 4200;
const FISH_DIRECTION_TARGET_DEADZONE_NORM = 0.006;
const FISH_TURN_MIN_SCALE_X = 0.42;
const FISH_TURN_MAX_SCALE_Y = 1.12;
const FISH_TURN_MIN_MS = 130;
const FISH_TURN_MAX_MS = 210;
const CAVE_ALLOWED_OUTSIDE_LAYERS = Object.freeze([1, 2, 4]);
const MAX_CAVE_PLAN_ATTEMPTS_PER_EVAL = 2;
const MAX_VALID_CAVE_PLANS_PER_EVAL = 2;
const MAX_FISH_RETARGETS_PER_FRAME = 2;
const FILTER_X = TANK_WIDTH - 118;
const FILTER_Y = 30;
const FILTER_WIDTH = 72;
const FILTER_HEIGHT = 164;
const FISH_MOTION_SCALE = 3.35;
const FEED_CHASE_MULTIPLIER = 2.5;
const BETTA_ATTACK_PASS_CHANCE = 0.001;
const BETTA_ATTACK_TRIGGER_RANGE_NORM = 0.052;
const BETTA_ATTACK_RELEASE_RANGE_NORM = 0.074;
const CAVE_NIGHT_ENTRY_CHANCE = 0.8;
const CAVE_NIGHT_START_HOUR = 17;
const CAVE_NIGHT_END_HOUR = 6;
const CAVE_ENTRY_CHANCE_BY_STYLE = {
  peaceful: 0.5,
  steady: 0.5,
  sporadic: 0.5
};
const STATIC_ASSET_MANIFEST = "assets/asset-manifest.json";
let assetManifestPromise = null;

function resolveAppUrl(path) {
  if (typeof path !== "string") {
    return "";
  }

  const trimmed = path.trim();
  if (!trimmed) {
    return "";
  }

  if (/^(?:https?:|data:|blob:)/i.test(trimmed)) {
    return trimmed;
  }

  return new URL(trimmed.replace(/^\/+/, ""), document.baseURI).toString();
}

const DEFAULT_CAVE_BEHAVIOR_PROFILE = {
  portals: [
    { id: "left", approachX: 0.34, approachY: 0.76, mouthX: 0.38, mouthY: 0.69 },
    { id: "center", approachX: 0.5, approachY: 0.76, mouthX: 0.5, mouthY: 0.68 },
    { id: "right", approachX: 0.66, approachY: 0.76, mouthX: 0.62, mouthY: 0.69 }
  ],
  insideSlots: [
    { id: "center", x: 0.5, y: 0.54, layer: 4 }
  ],
  interiorZones: [
    { id: "center", xMin: 0.38, xMax: 0.62, yMin: 0.46, yMax: 0.66 },
    { id: "left", xMin: 0.28, xMax: 0.48, yMin: 0.5, yMax: 0.7 },
    { id: "right", xMin: 0.52, xMax: 0.72, yMin: 0.5, yMax: 0.7 }
  ],
  lingerMinMs: 4200,
  lingerMaxMs: 8600
};
const CAVE_BEHAVIOR_OVERRIDES = {
  "bathysphere-wreck-cave": {
    insideLayer: 4,
    portals: [
      {
        id: "main_hatch",
        approachX: 0.56,
        approachY: 0.71,
        mouthX: 0.58,
        mouthY: 0.60,
        outsideLayer: 2,
        insideLayer: 4,
        path: [
          { x: 0.54, y: 0.57 },
          { x: 0.50, y: 0.52 }
        ]
      }
    ],
    insideSlots: [
      {
        id: "cabin",
        x: 0.47,
        y: 0.47,
        layer: 4,
        portalIds: ["main_hatch"]
      }
    ],
    lingerMinMs: 12000,
    lingerMaxMs: 22000
  }
};

const FISH_TYPES = [
  {
    id: "goldfish",
    name: "Goldfish",
    cost: 10,
    mealCoins: 1,
    asset: "/assets/fish/goldfish.png",
    description: "The classic round buddy. Big, cheerful, and always hungry.",
    width: 124,
    cycleSeconds: 28,
    bobSpeed: 1.25,
    swimStyle: "peaceful",
    speedMin: 0.02,
    speedMax: 0.024,
    targetMinMs: 4400,
    targetMaxMs: 7600
  },
  {
    id: "guppy",
    name: "Guppy",
    cost: 4,
    mealCoins: 2,
    asset: "/assets/fish/guppy.png",
    description: "A ribbon-tailed coin helper with a fast little wiggle.",
    width: 112,
    cycleSeconds: 23,
    bobSpeed: 1.45,
    swimStyle: "sporadic",
    speedMin: 0.024,
    speedMax: 0.072,
    targetMinMs: 1400,
    targetMaxMs: 3600
  },
  {
    id: "betta",
    name: "Betta",
    cost: 9,
    mealCoins: 4,
    asset: "/assets/fish/betta.png",
    description: "A dramatic, fluttery fish with elegant fins and better payouts.",
    width: 140,
    cycleSeconds: 30,
    bobSpeed: 1.15,
    swimStyle: "peaceful",
    speedMin: 0.018,
    speedMax: 0.022,
    targetMinMs: 5200,
    targetMaxMs: 8200
  },
  {
    id: "clownfish",
    name: "Clownfish",
    cost: 18,
    mealCoins: 6,
    asset: "/assets/fish/clownfish.png",
    description: "Bright stripes, playful swimming, and a solid meal bonus.",
    width: 136,
    cycleSeconds: 24,
    bobSpeed: 1.35,
    swimStyle: "steady",
    speedMin: 0.032,
    speedMax: 0.042,
    targetMinMs: 2400,
    targetMaxMs: 5200
  },
  {
    id: "angelfish",
    name: "Angelfish",
    cost: 30,
    mealCoins: 9,
    asset: "/assets/fish/angelfish.png",
    description: "Tall fins and graceful turns. Fancy fish, fancy coins.",
    width: 156,
    cycleSeconds: 33,
    bobSpeed: 1.05,
    swimStyle: "peaceful",
    speedMin: 0.017,
    speedMax: 0.021,
    targetMinMs: 5400,
    targetMaxMs: 8600
  },
  {
    id: "pufferfish",
    name: "Pufferfish",
    cost: 48,
    mealCoins: 12,
    asset: "/assets/fish/pufferfish.png",
    description: "The round little oddball. Expensive, adorable, and profitable.",
    width: 150,
    cycleSeconds: 27,
    bobSpeed: 1.55,
    swimStyle: "steady",
    speedMin: 0.026,
    speedMax: 0.034,
    targetMinMs: 2600,
    targetMaxMs: 5600
  },
  {
    id: "suckerfish",
    name: "Sucker Fish",
    cost: 12,
    mealCoins: 0,
    asset: "/assets/fish/pufferfish.png",
    fallbackAsset: "/assets/fish/pufferfish.png",
    description: "A slow back-glass grazer that ignores pellets and lives off grime and waste.",
    width: 122,
    cycleSeconds: 42,
    bobSpeed: 0.2,
    swimStyle: "peaceful",
    speedMin: 0.00022,
    speedMax: 0.0004,
    targetMinMs: 18000,
    targetMaxMs: 34000,
    behavior: "sucker",
    diet: "detritus",
    cleanupMinMs: 11 * 60 * 1000,
    cleanupMaxMs: 22 * 60 * 1000,
    cleanupStrength: 0.16
  }
];

const FISH_NAME_POOL = {
  goldfish: ["Sunny", "Pebble", "Marmalade", "Pip"],
  guppy: ["Ribbon", "Skipper", "Twinkle", "Bubbles"],
  betta: ["Velvet", "Nova", "Flare", "Satin"],
  clownfish: ["Coral", "Dash", "Tango", "Patch"],
  angelfish: ["Halo", "Opal", "Glint", "Pearl"],
  pufferfish: ["Puffin", "Marsh", "Button", "Plum"]
  ,
  suckerfish: ["Mochi", "Peb", "Smudge", "Suction"]
};

const BACKGROUND_META = {
  "classic-sand.png": {
    name: "Classic Sand",
    blurb: "Warm shallows, pale stone, and a calm gold-tinted glow that suits the starter tank floor."
  },
  "rose-quartz.png": {
    name: "Rose Quartz",
    blurb: "Blush-pink water light with soft plants and dreamy rose rockwork."
  },
  "lagoon-blue.png": {
    name: "Lagoon Blue",
    blurb: "A serene blue lagoon with cool stone, long leaves, and crisp glassy light."
  },
  "mint-reef.png": {
    name: "Mint Reef",
    blurb: "Fresh mint tones, planted shadows, and a gentle reef-garden feel."
  },
  "midnight-river.png": {
    name: "Midnight River",
    blurb: "Deep slate water, moonlit plants, and a quiet riverbank mood."
  }
};

const TANK_META = {
  "brass-parlor.png": {
    name: "Brass Parlor",
    blurb: "Warm brass trim and old-aquarium charm."
  },
  "midnight-curve.png": {
    name: "Midnight Curve",
    blurb: "A darker rounded shell that keeps the focus on the water."
  },
  "modern-glass.png": {
    name: "Modern Glass",
    blurb: "A clean rimless look with crisp icy trim."
  }
};

const FILTER_META = {
  "charcoal-filter.png": {
    name: "Charcoal Filter",
    blurb: "A strong all-round filter that slows haze buildup and gives fish waste more breathing room.",
    grimeDelay: 0.26,
    wasteCapacity: 0.34,
    flow: 1.08
  },
  "porcelain-filter.png": {
    name: "Porcelain Filter",
    blurb: "A softer, quieter filter profile that still buys you extra time before the tank turns green.",
    grimeDelay: 0.18,
    wasteCapacity: 0.22,
    flow: 0.94
  },
  "reef-filter.png": {
    name: "Reef Filter",
    blurb: "A lively high-flow filter that keeps suspended gunk from stacking up so fast.",
    grimeDelay: 0.22,
    wasteCapacity: 0.28,
    flow: 1.18
  }
};

const BUBBLE_META = {
  "glass-orbs.png": {
    name: "Glass Orbs",
    blurb: "Larger glossy bubbles with a slower, dreamy look."
  },
  "micro-fizz.png": {
    name: "Micro Fizz",
    blurb: "Tiny fizzy bubbles for a busy planted tank feel."
  },
  "soft-pearls.png": {
    name: "Soft Pearls",
    blurb: "Rounded pearly bubbles with a gentle shimmer."
  }
};

const SWIM_STYLE_DEFAULTS = {
  peaceful: {
    speedMin: 0.018,
    speedMax: 0.024,
    targetMinMs: 4600,
    targetMaxMs: 7600,
    speedMode: "steady"
  },
  steady: {
    speedMin: 0.03,
    speedMax: 0.042,
    targetMinMs: 2400,
    targetMaxMs: 5200,
    speedMode: "steady"
  },
  sporadic: {
    speedMin: 0.022,
    speedMax: 0.074,
    targetMinMs: 1400,
    targetMaxMs: 3600,
    speedMode: "dynamic"
  }
};

const DECOR_META = {
  "castle-tower.png": {
    name: "Castle Ruin",
    cost: 16,
    width: 198,
    defaultScale: DEFAULT_DECOR_SCALE
  },
  "coral-bloom.png": {
    name: "Coral Bloom",
    cost: 6,
    width: 140,
    defaultScale: DEFAULT_DECOR_SCALE
  },
  "rock-arch.png": {
    name: "Rock Arch",
    cost: 9,
    width: 168,
    defaultScale: DEFAULT_DECOR_SCALE
  },
  "seaweed-bunch.png": {
    name: "Seaweed Bunch",
    cost: 4,
    width: 120,
    defaultScale: DEFAULT_DECOR_SCALE
  },
  "shell-cluster.png": {
    name: "Shell Cluster",
    cost: 3,
    width: 110,
    defaultScale: DEFAULT_DECOR_SCALE
  },
  "treasure-chest.png": {
    name: "Treasure Chest",
    cost: 10,
    width: 150,
    defaultScale: DEFAULT_DECOR_SCALE
  },
  "anubias-rock.png": {
    name: "Anubias Rock",
    cost: 8,
    width: 146,
    defaultScale: DEFAULT_DECOR_SCALE
  },
  "driftwood-root.png": {
    name: "Driftwood Root",
    cost: 14,
    width: 204,
    defaultScale: DEFAULT_DECOR_SCALE
  },
  "moss-bridge.png": {
    name: "Moss Bridge",
    cost: 13,
    width: 188,
    defaultScale: DEFAULT_DECOR_SCALE
  },
  "pagoda-lantern.png": {
    name: "Pagoda Lantern",
    cost: 15,
    width: 176,
    defaultScale: DEFAULT_DECOR_SCALE
  },
  "slate-cave.png": {
    name: "Slate Cave",
    cost: 11,
    width: 182,
    defaultScale: DEFAULT_DECOR_SCALE
  },
  "terracotta-hide.png": {
    name: "Terracotta Hide",
    cost: 9,
    width: 158,
    defaultScale: DEFAULT_DECOR_SCALE
  }
};

const dom = {
  coinCount: document.querySelector("#coinCount"),
  cleanlinessLabel: document.querySelector("#cleanlinessLabel"),
  mealWindowLabel: document.querySelector("#mealWindowLabel"),
  tankStatus: document.querySelector("#tankStatus"),
  mealStatus: document.querySelector("#mealStatus"),
  nextMealCountdown: document.querySelector("#nextMealCountdown"),
  scrubProgressLabel: document.querySelector("#scrubProgressLabel"),
  scrubProgressBar: document.querySelector("#scrubProgressBar"),
  nextMealCountdownMirror: document.querySelector("#nextMealCountdownMirror"),
  feedButton: document.querySelector("#feedButton"),
  resetMealsButton: document.querySelector("#resetMealsButton"),
  spongeButton: document.querySelector("#spongeButton"),
  scoopButton: document.querySelector("#scoopButton"),
  debugDamageFishButton: document.querySelector("#debugDamageFishButton"),
  addCoinsButton: document.querySelector("#addCoinsButton"),
  maxDirtButton: document.querySelector("#maxDirtButton"),
  deleteAllButton: document.querySelector("#deleteAllButton"),
  debugCaveButton: document.querySelector("#debugCaveButton"),
  tankStage: document.querySelector("#tankStage"),
  tankSidebar: document.querySelector("#tankSidebar"),
  tankCanvas: document.querySelector("#tankCanvas"),
  grimeCanvas: document.querySelector("#grimeCanvas"),
  glassCanvas: document.querySelector("#glassCanvas"),
  placementHint: document.querySelector("#placementHint"),
  editQuickRef: document.querySelector("#editQuickRef"),
  editQuickRefCard: document.querySelector("#editQuickRefCard"),
  editDecorTray: document.querySelector("#editDecorTray"),
  editDecorTrayScroller: document.querySelector("#editDecorTrayScroller"),
  editDecorTrayPrev: document.querySelector("#editDecorTrayPrev"),
  editDecorTrayNext: document.querySelector("#editDecorTrayNext"),
  editFishTray: document.querySelector("#editFishTray"),
  editFishTrayScroller: document.querySelector("#editFishTrayScroller"),
  editFishTrayPrev: document.querySelector("#editFishTrayPrev"),
  editFishTrayNext: document.querySelector("#editFishTrayNext"),
  toolCursor: document.querySelector("#toolCursor"),
  mealTrack: document.querySelector("#mealTrack"),
  summaryGrid: document.querySelector("#summaryGrid"),
  eventFeed: document.querySelector("#eventFeed"),
  resetProgressButton: document.querySelector("#resetProgressButton"),
  exportDataButton: document.querySelector("#exportDataButton"),
  importDataButton: document.querySelector("#importDataButton"),
  importDataInput: document.querySelector("#importDataInput"),
  fishList: document.querySelector("#fishList"),
  fishShop: document.querySelector("#fishShop"),
  decorWorkspace: document.querySelector("#decorWorkspace"),
  decorInventory: document.querySelector("#decorInventory"),
  decorShop: document.querySelector("#decorShop"),
  storeOverlay: document.querySelector("#storeOverlay"),
  storeFishTab: document.querySelector("#storeFishTab"),
  storeDecorTab: document.querySelector("#storeDecorTab"),
  storeCoinCounter: document.querySelector("#storeCoinCounter"),
  closeStoreOverlay: document.querySelector("#closeStoreOverlay"),
  openStoreButton: document.querySelector("#openStoreButton"),
  placedDecorList: document.querySelector("#placedDecorList"),
  backgroundList: document.querySelector("#backgroundList"),
  tankAssetList: document.querySelector("#tankAssetList"),
  filterAssetList: document.querySelector("#filterAssetList"),
  //gravelPaletteSlots: document.querySelector("#gravelPaletteSlots"),
  //gravelPaletteChoices: document.querySelector("#gravelPaletteChoices"),
  gravelAssetList: document.querySelector("#gravelAssetList"),
  fishInspector: document.querySelector("#fishInspector"),
  closeInspector: document.querySelector("#closeInspector"),
  inspectorDisposeFish: document.querySelector("#inspectorDisposeFish"),
  saveFishName: document.querySelector("#saveFishName"),
  fishNameInput: document.querySelector("#fishNameInput"),
  inspectorTitle: document.querySelector("#inspectorTitle"),
  inspectorSpecies: document.querySelector("#inspectorSpecies"),
  inspectorHealth: document.querySelector("#inspectorHealth"),
  inspectorComfort: document.querySelector("#inspectorComfort"),
  inspectorAge: document.querySelector("#inspectorAge"),
  toast: document.querySelector("#toast"),
  tabButtons: [...document.querySelectorAll(".tab-button")],
  tabPanels: [...document.querySelectorAll(".tab-panel")],
  toggleFishShop: document.querySelector("#toggleFishShop"),
  fishEditModeDockButton: document.querySelector("#fishEditModeDockButton"),
  editModeDockButton: document.querySelector("#editModeDockButton"),
  toggleEditMode: document.querySelector("#toggleEditMode"),
  toggleDecorShop: document.querySelector("#toggleDecorShop"),
  toggleSidebar: document.querySelector("#toggleSidebar")
};

const tankContext = dom.tankCanvas.getContext("2d");
const grimeContext = dom.grimeCanvas.getContext("2d");
const glassContext = dom.glassCanvas.getContext("2d");

const runtime = {
  activeTab: "overview",
  storeOverlayOpen: false,
  storeTab: "fish",
  sidebarCollapsed: true,
  editTankMode: false,
  fishEditMode: false,
  placementMode: null,
  placementPreview: null,
  cleaningMode: false,
  scoopMode: false,
  dragState: null,
  fishDragState: null,
  pebbleDragState: null,
  selectedFishId: null,
  suppressNextTankClick: false,
  pointerDown: false,
  pointerStagePx: null,
  lastScrubPoint: null,
  scrubCells: new Uint8Array(SCRUB_GRID_COLS * SCRUB_GRID_ROWS),
  scrubbedCount: 0,
  scrubStamps: [],
  cleaningTransition: null,
  backgroundCatalog: [],
  tankCatalog: [],
  filterCatalog: [],
  gravelCatalog: [],
  bubbleCatalog: [],
  suckerFishCatalog: [],
  decorCatalog: [],
  decorMeta: { ...DECOR_META },
  fishCatalog: [...FISH_TYPES],
  fishMap: new Map(FISH_TYPES.map((fish) => [fish.id, fish])),
  decorMap: new Map(),
  backgroundMap: new Map(),
  tankMap: new Map(),
  filterMap: new Map(),
  gravelMap: new Map(),
  bubbleMap: new Map(),
  images: new Map(),
  alphaMaskCache: new Map(),
  maskRegionCache: new Map(),
  caveInteriorMaskCache: new Map(),
  caveShellMaskCache: new Map(),
  caveNavCache: new Map(),
  activeFishCavePlans: new Map(),
  gravelTintCache: new Map(),
  gravelSourceStats: new Map(),
  gravelBedCacheKey: "",
  gravelBedCanvas: null,
  gravelCapCanvas: null,
  shadowCanvas: document.createElement("canvas"),
  renderedMarkup: Object.create(null),
  renderedDataKeys: Object.create(null),
  toastHandle: null,
  lastAnimationFrameAt: 0,
  lastTankPoint: null,
  resizeObserver: null,
  splashBursts: [],
  fallingGravelPebbles: [],
  bloodClouds: [],
  bettaPassLocks: new Set(),
  gravelStateDirty: false,
  decorHangoutZonesKey: "",
  decorHangoutZones: [],
  activeGravelPaletteSlot: 0,
  decorPlacementLayer: DEFAULT_TANK_LAYER,
  debugNightCaveMode: false,
  collapsedSections: {
    fishTank: true,
    fishDead: true,
    fishStorage: true,
    decorPlaced: true,
    decorStorage: true,
    decorBackgrounds: true,
    decorTankShell: true,
    decorFilter: true,
    decorGravel: true
  },
  scene: null
};

let state = null;

function isSidebarSectionCollapsed(key) {
  return Boolean(runtime.collapsedSections[key]);
}

function toggleSidebarSection(key) {
  if (!Object.prototype.hasOwnProperty.call(runtime.collapsedSections, key)) {
    return;
  }

  if (key === "fishDead" && !state.fish.some((fish) => isFishDead(fish)) && !state.storedFish.some((fish) => isFishDead(fish))) {
    return;
  }

  runtime.collapsedSections[key] = !runtime.collapsedSections[key];
  renderUi(Date.now());
}

function openStoreOverlay(tab = "fish") {
  runtime.storeOverlayOpen = true;
  runtime.storeTab = tab === "decor" ? "decor" : "fish";
  renderUi(Date.now());
}

function closeStoreOverlay() {
  runtime.storeOverlayOpen = false;
  renderUi(Date.now());
}

function handleEditDecorTrayWheel(event) {
  if (dom.editDecorTray?.hidden || !dom.editDecorTrayScroller) {
    return;
  }

  const scroller = dom.editDecorTrayScroller;
  const maxScroll = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
  if (maxScroll <= 0) {
    return;
  }

  const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
  if (!delta) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  scroller.scrollLeft += delta;
  syncEditDecorTrayScrollControls();
}

function toggleEditTankMode(force = null) {
  const nextMode = typeof force === "boolean" ? force : !runtime.editTankMode;
  runtime.editTankMode = nextMode;
  if (runtime.editTankMode) {
    runtime.fishEditMode = false;
  }

  if (!runtime.editTankMode) {
    runtime.placementMode = null;
    runtime.placementPreview = null;
    runtime.dragState = null;
    runtime.fishDragState = null;
    runtime.pebbleDragState = null;
  }

  renderUi(Date.now());
}

function handleEditFishTrayWheel(event) {
  if (dom.editFishTray?.hidden || !dom.editFishTrayScroller) {
    return;
  }

  const scroller = dom.editFishTrayScroller;
  const maxScroll = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
  if (maxScroll <= 0) {
    return;
  }

  const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
  if (!delta) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  scroller.scrollLeft += delta;
  syncEditFishTrayScrollControls();
}

function toggleFishEditMode(force = null) {
  const nextMode = typeof force === "boolean" ? force : !runtime.fishEditMode;
  runtime.fishEditMode = nextMode;
  if (runtime.fishEditMode) {
    runtime.editTankMode = false;
    runtime.placementMode = null;
    runtime.placementPreview = null;
    runtime.dragState = null;
  }

  renderUi(Date.now());
}

function renderCollapsibleSections() {
  const deadFishExists = state.fish.some((fish) => isFishDead(fish));

  document.querySelectorAll("[data-collapsible-section]").forEach((section) => {
    const key = section.dataset.collapsibleSection;
    const button = section.querySelector("[data-collapsible-toggle]");
    const body = section.querySelector("[data-collapsible-body]");
    const icon = section.querySelector("[data-collapsible-icon]");

    if (!button || !body) {
      return;
    }

    const disabled = false;
    const collapsed = disabled ? true : isSidebarSectionCollapsed(key);

    section.classList.toggle("is-collapsed", collapsed);
    button.disabled = disabled;
    button.classList.toggle("is-disabled", disabled);
    button.setAttribute("aria-expanded", String(!collapsed));

    if (disabled) {
      button.setAttribute("aria-disabled", "true");
    } else {
      button.removeAttribute("aria-disabled");
    }

    body.hidden = collapsed;

    if (icon) {
      icon.textContent = collapsed ? "⬇️" : "⬆️";
    }
  });
}

const shadowContext = runtime.shadowCanvas.getContext("2d");

runtime.shadowCanvas.width = TANK_WIDTH;
runtime.shadowCanvas.height = TANK_HEIGHT;
configureCanvasContext(tankContext);
configureCanvasContext(grimeContext);
configureCanvasContext(shadowContext);

init().catch((error) => {
  console.error(error);
  showToast("The aquarium hit a snag while loading.");
});

async function init() {
  bindEvents();

  const [backgroundResponse, tankResponse, filterResponse, gravelResponse, bubbleResponse, decorResponse, suckerFishResponse, fishCatalog, decorCatalog] = await Promise.all([
    fetchAssetList("backgrounds"),
    fetchAssetList("tank"),
    fetchAssetList("filter"),
    fetchAssetList("gravel"),
    fetchAssetList("bubbles"),
    fetchAssetList("decor"),
    fetchAssetList("sucker-fish"),
    fetchFishCatalog(),
    fetchDecorCatalog()
  ]);

  runtime.suckerFishCatalog = suckerFishResponse;
  runtime.decorMeta = {
    ...DECOR_META,
    ...normalizeDecorMeta(decorCatalog)
  };
  runtime.fishCatalog = normalizeFishCatalog(fishCatalog, {
    assetFolders: {
      "sucker-fish": suckerFishResponse
    }
  });
  runtime.fishMap = new Map(runtime.fishCatalog.map((fish) => [fish.id, fish]));
  runtime.backgroundCatalog = buildBackgroundCatalog(backgroundResponse);
  runtime.tankCatalog = buildSimpleAssetCatalog(tankResponse, TANK_META, "A tank shell PNG from your assets folder.");
  runtime.filterCatalog = buildSimpleAssetCatalog(filterResponse, FILTER_META, "A filter skin PNG from your assets folder.");
  runtime.gravelCatalog = buildSimpleAssetCatalog(gravelResponse, {}, "A gravel pebble PNG from your assets folder.");
  runtime.bubbleCatalog = buildSimpleAssetCatalog(bubbleResponse, BUBBLE_META, "A bubble sprite PNG from your assets folder.");
  runtime.decorCatalog = buildDecorCatalog(decorResponse);
  runtime.backgroundMap = new Map(runtime.backgroundCatalog.map((item) => [item.key, item]));
  runtime.tankMap = new Map(runtime.tankCatalog.map((item) => [item.key, item]));
  runtime.filterMap = new Map(runtime.filterCatalog.map((item) => [item.key, item]));
  runtime.gravelMap = new Map(runtime.gravelCatalog.map((item) => [item.key, item]));
  runtime.bubbleMap = new Map(runtime.bubbleCatalog.map((item) => [item.key, item]));
  runtime.decorMap = new Map(runtime.decorCatalog.map((item) => [item.key, item]));
  runtime.scene = createSceneSeeds();

  state = reconcileState(loadState());

  await preloadImages([
    ...runtime.backgroundCatalog.map((item) => item.path),
    ...runtime.tankCatalog.map((item) => item.path),
    ...runtime.filterCatalog.map((item) => item.path),
    ...runtime.gravelCatalog.map((item) => item.path),
    ...runtime.bubbleCatalog.map((item) => item.path),
    ...runtime.decorCatalog.flatMap((item) => [
      item.path,
      item.bgPath,
      item.midPath,
      item.maskPath,
      item.triggerPath,
      item.seatsPath
    ].filter(Boolean)),
    ...runtime.fishCatalog.map((fish) => fish.asset)
  ]);

  resizeDisplayCanvases();
  const now = Date.now();
  const decorPlacementChanged = normalizePlacedDecorState();
  const stateChanged = syncState(now);
  if (decorPlacementChanged || stateChanged) {
    saveState();
  }
  renderUi(now);
  window.setInterval(() => tick(), 1000);
  window.requestAnimationFrame(animationLoop);
}

function bindEvents() {
  window.addEventListener("resize", () => resizeDisplayCanvases());
  window.addEventListener("keydown", (event) => {
    const tagName = event.target instanceof Element ? event.target.tagName : "";
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(tagName) || event.target?.isContentEditable) {
      return;
    }

    const keyRaw = String(event.key || "");
    const key = keyRaw.toLowerCase();
    if (!runtime.editTankMode || (!runtime.placementMode && !runtime.dragState)) {
      return;
    }

    if (keyRaw === "+" || keyRaw === "-" || keyRaw === "_" || event.code === "NumpadAdd" || event.code === "NumpadSubtract") {
      event.preventDefault();
      const direction = (keyRaw === "+" || event.code === "NumpadAdd") ? 1 : -1;
      const nextScale = stepActiveDecorScale(direction);
      if (nextScale !== null) {
        showToast(`Decor size ${formatDecorScale(nextScale)}.`);
      }
      return;
    }

    if (key === "z") {
      event.preventDefault();
      if (stepActiveDecorLayer(1)) {
        showToast(`Layer ${runtime.decorPlacementLayer} of ${TANK_DEPTH_LAYERS}.`);
      }
      return;
    }

    if (key === "x") {
      event.preventDefault();
      if (stepActiveDecorLayer(-1)) {
        showToast(`Layer ${runtime.decorPlacementLayer} of ${TANK_DEPTH_LAYERS}.`);
      }
    }
  });
  if (window.ResizeObserver) {
    runtime.resizeObserver?.disconnect?.();
    runtime.resizeObserver = new ResizeObserver(() => resizeDisplayCanvases());
    runtime.resizeObserver.observe(dom.tankStage);
  }

  dom.feedButton.addEventListener("click", () => feedFish());
  dom.resetProgressButton?.addEventListener("click", () => resetAllProgress());
  dom.exportDataButton?.addEventListener("click", () => exportSaveData());
  dom.importDataButton?.addEventListener("click", () => openImportDataPicker());
  dom.importDataInput?.addEventListener("change", (event) => {
    void importSaveDataFromPicker(event);
  });
  dom.resetMealsButton.addEventListener("click", () => resetMealsDebug());
  dom.spongeButton.addEventListener("click", () => toggleCleaningMode());
  dom.scoopButton?.addEventListener("click", () => toggleScoopMode());
  dom.debugDamageFishButton.addEventListener("click", () => damageSelectedFish());
  dom.addCoinsButton.addEventListener("click", () => addDebugCoins());
  dom.maxDirtButton.addEventListener("click", () => makeTankMaxDirty());
  dom.deleteAllButton.addEventListener("click", () => deleteAllFishAndDecor());
  dom.debugCaveButton.addEventListener("click", () => toggleDebugNightCaveMode());
  dom.toggleFishShop.addEventListener("click", () => openStoreOverlay("fish"));
  dom.toggleDecorShop.addEventListener("click", () => openStoreOverlay("decor"));
  dom.openStoreButton.addEventListener("click", () => openStoreOverlay("fish"));
  dom.editModeDockButton?.addEventListener("click", () => toggleEditTankMode());
  dom.fishEditModeDockButton?.addEventListener("click", () => toggleFishEditMode());
  dom.closeStoreOverlay.addEventListener("click", () => closeStoreOverlay());
  dom.storeFishTab.addEventListener("click", () => {
    runtime.storeTab = "fish";
    renderUi(Date.now());
  });
  dom.storeDecorTab.addEventListener("click", () => {
    runtime.storeTab = "decor";
    renderUi(Date.now());
  });
  dom.toggleEditMode.addEventListener("click", () => toggleEditTankMode());
  dom.editDecorTray?.addEventListener("pointerdown", (event) => {
    event.stopPropagation();
  });
  dom.editDecorTray?.addEventListener("click", (event) => {
    event.stopPropagation();
  });
  dom.editDecorTray?.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    event.stopPropagation();
  });
  dom.editDecorTray?.addEventListener("wheel", handleEditDecorTrayWheel, { passive: false });
  dom.editDecorTrayScroller?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-tray-place-decor]");
    if (button) {
      event.stopPropagation();
      startPlacingDecor(button.dataset.trayPlaceDecor);
    }
  });
  dom.editDecorTrayScroller?.addEventListener("scroll", () => syncEditDecorTrayScrollControls());
  dom.editDecorTrayPrev?.addEventListener("click", () => scrollEditDecorTray(-1));
  dom.editDecorTrayNext?.addEventListener("click", () => scrollEditDecorTray(1));
  dom.editFishTray?.addEventListener("pointerdown", (event) => {
    event.stopPropagation();
  });
  dom.editFishTray?.addEventListener("click", (event) => {
    event.stopPropagation();
  });
  dom.editFishTray?.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    event.stopPropagation();
  });
  dom.editFishTray?.addEventListener("wheel", handleEditFishTrayWheel, { passive: false });
  dom.editFishTrayScroller?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-tray-restore-fish]");
    if (button) {
      event.stopPropagation();
      restoreFishToTank(button.dataset.trayRestoreFish);
    }
  });
  dom.editFishTrayScroller?.addEventListener("scroll", () => syncEditFishTrayScrollControls());
  dom.editFishTrayPrev?.addEventListener("click", () => scrollEditFishTray(-1));
  dom.editFishTrayNext?.addEventListener("click", () => scrollEditFishTray(1));
  dom.toggleSidebar.addEventListener("click", () => {
    runtime.sidebarCollapsed = !runtime.sidebarCollapsed;
    renderUi(Date.now());
  });

  for (const button of dom.tabButtons) {
    button.addEventListener("click", () => {
      runtime.activeTab = button.dataset.tab;
      renderTabs();
      renderUi(Date.now());
    });
  }

  dom.fishShop.addEventListener("click", (event) => {
    const button = event.target.closest("[data-buy-fish]");
    if (button) {
      buyFish(button.dataset.buyFish);
    }
  });

  dom.decorShop.addEventListener("click", (event) => {
    const button = event.target.closest("[data-buy-decor]");
    if (button) {
      buyDecor(button.dataset.buyDecor);
    }
  });

  dom.decorWorkspace.addEventListener("click", (event) => {
    const toggleButton = event.target.closest("[data-collapsible-toggle]");
    if (toggleButton) {
      toggleSidebarSection(toggleButton.dataset.collapsibleToggle);
    }
  });

  dom.decorInventory.addEventListener("click", (event) => {
    const sizeButton = event.target.closest("[data-size-decor]");
    if (sizeButton) {
      adjustDecorDefaultSize(sizeButton.dataset.sizeDecor, Number(sizeButton.dataset.sizeDirection) || 0);
      return;
    }

    const sellButton = event.target.closest("[data-sell-decor-inventory]");
    if (sellButton) {
      sellStoredDecor(sellButton.dataset.sellDecorInventory);
      return;
    }

    const button = event.target.closest("[data-place-decor]");
    if (button) {
      startPlacingDecor(button.dataset.placeDecor);
    }
  });

  dom.placedDecorList.addEventListener("click", (event) => {
    const resizeButton = event.target.closest("[data-resize-placed]");
    if (resizeButton) {
      adjustPlacedDecorSize(resizeButton.dataset.resizePlaced, Number(resizeButton.dataset.sizeDirection) || 0);
      return;
    }

    const sellButton = event.target.closest("[data-sell-decor-placed]");
    if (sellButton) {
      sellPlacedDecor(sellButton.dataset.sellDecorPlaced);
      return;
    }

    const defaultButton = event.target.closest("[data-copy-size]");
    if (defaultButton) {
      savePlacedDecorSizeAsDefault(defaultButton.dataset.copySize);
      return;
    }

    const button = event.target.closest("[data-store-decor]");
    if (button) {
      storeDecor(button.dataset.storeDecor);
    }
  });

  dom.fishList.addEventListener("click", (event) => {
    const toggleButton = event.target.closest("[data-collapsible-toggle]");
    if (toggleButton) {
      toggleSidebarSection(toggleButton.dataset.collapsibleToggle);
      return;
    }

    const disposeButton = event.target.closest("[data-dispose-fish]");
    if (disposeButton) {
      disposeFish(disposeButton.dataset.disposeFish);
      return;
    }

    const disposeAllDeadButton = event.target.closest("[data-dispose-all-dead]");
    if (disposeAllDeadButton) {
      disposeAllDeadFish();
      return;
    }

    const sellButton = event.target.closest("[data-sell-fish]");
    if (sellButton) {
      sellFish(sellButton.dataset.sellFish);
      return;
    }

    const storeButton = event.target.closest("[data-store-fish]");
    if (storeButton) {
      storeFish(storeButton.dataset.storeFish);
      return;
    }

    const restoreButton = event.target.closest("[data-restore-fish]");
    if (restoreButton) {
      restoreFishToTank(restoreButton.dataset.restoreFish);
      return;
    }

    const sizeButton = event.target.closest("[data-size-fish]");
    if (sizeButton) {
      adjustFishSize(sizeButton.dataset.sizeFish, Number(sizeButton.dataset.sizeDirection) || 0);
      return;
    }

    const defaultButton = event.target.closest("[data-copy-fish-size]");
    if (defaultButton) {
      saveFishSizeAsDefault(defaultButton.dataset.copyFishSize);
      return;
    }

    const button = event.target.closest("[data-open-fish]");
    if (button) {
      openFishInspector(button.dataset.openFish);
    }
  });

  dom.backgroundList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-select-background]");
    if (button) {
      selectBackground(button.dataset.selectBackground);
    }
  });

  dom.tankAssetList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-select-tank]");
    if (button) {
      selectTankAsset(button.dataset.selectTank);
    }
  });

  dom.filterAssetList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-select-filter]");
    if (button) {
      selectFilterAsset(button.dataset.selectFilter);
    }
  });

  dom.gravelAssetList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-select-gravel]");
    if (button) {
      selectGravelAsset(button.dataset.selectGravel);
    }
  });

  dom.tankStage.addEventListener("pointerdown", (event) => {
    if (isTankOverlayTarget(event.target)) {
      return;
    }

    const point = getTankPoint(event);
    if (!point) {
      return;
    }
    renderToolCursor();
    runtime.lastTankPoint = point;

    if (runtime.cleaningMode) {
      runtime.suppressNextTankClick = true;
      runtime.pointerDown = true;
      dom.tankStage.setPointerCapture(event.pointerId);
      scrubGlass(point.x, point.y);
      return;
    }

    if (runtime.scoopMode) {
      runtime.suppressNextTankClick = true;
      const hitFish = findFishAtPoint(point.x, point.y, Date.now());
      if (hitFish) {
        storeFish(hitFish.id, { allowDead: true });
      }
      return;
    }

    if (runtime.editTankMode && runtime.placementMode) {
      placeDecorAtPoint(point.x / TANK_WIDTH, point.y / TANK_HEIGHT);
      return;
    }

    const hitFish = findFishAtPoint(point.x, point.y, Date.now());
    if (hitFish && !isFishDead(hitFish)) {
      beginFishDrag(hitFish, point, event.pointerId);
      return;
    }

    if (runtime.editTankMode) {
      const hitDecor = findPlacedDecorAtPoint(point.x, point.y);
      if (hitDecor) {
        beginDecorDrag(hitDecor, point, event.pointerId);
        return;
      }

      //  const hitPebble = findLiveGravelPebbleAtPoint(point.x, point.y);
      //  if (hitPebble) {
      //    beginGravelPebbleDrag(hitPebble, point, event.pointerId, { existing: true });
      //    return;
      //  }
      //
      //  if (isPointNearGravelBed(point.x, point.y)) {
      //    const pluckedPebble = createLoosePebbleFromBed(point.x, point.y);
      //    beginGravelPebbleDrag(pluckedPebble, point, event.pointerId, { existing: false });
      //  }
    }
  });

  dom.tankStage.addEventListener("click", (event) => {
    if (runtime.suppressNextTankClick) {
      runtime.suppressNextTankClick = false;
      return;
    }

    if (isTankOverlayTarget(event.target) || runtime.cleaningMode || runtime.scoopMode || runtime.placementMode || runtime.dragState || runtime.fishDragState || runtime.pebbleDragState) {
      return;
    }

    const point = getTankPoint(event);
    if (!point) {
      return;
    }
    runtime.lastTankPoint = point;

    const hitFish = findFishAtPoint(point.x, point.y, Date.now());
    if (hitFish) {
      openFishInspector(hitFish.id);
    }
  });

  dom.tankStage.addEventListener("contextmenu", (event) => {
    if (isTankOverlayTarget(event.target) || runtime.placementMode || runtime.dragState || runtime.fishDragState) {
      return;
    }

    const point = getTankPoint(event);
    if (!point) {
      return;
    }

    if (runtime.fishEditMode) {
      const hitFish = findFishAtPoint(point.x, point.y, Date.now());
      if (!hitFish || isFishDead(hitFish)) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      storeFish(hitFish.id);
      return;
    }

    if (runtime.editTankMode) {
      const hitDecor = findPlacedDecorAtPoint(point.x, point.y);
      if (!hitDecor) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      storeDecor(hitDecor.id);
    }
  });

  dom.tankStage.addEventListener("pointermove", (event) => {
    const point = getTankPoint(event);
    renderToolCursor();

    if (runtime.dragState) {
      if (point) {
        updateDraggedDecor(point);
      }
      return;
    }

    if (runtime.fishDragState) {
      if (point) {
        updateDraggedFish(point);
      }
      return;
    }

    //if (runtime.pebbleDragState) {
    //  if (point) {
    //    updateDraggedGravelPebble(point);
    //  }
    //  return;
    //}

    if (runtime.cleaningMode && runtime.pointerDown) {
      if (point) {
        scrubGlass(point.x, point.y);
      }
      return;
    }

    if (runtime.editTankMode && runtime.placementMode) {
      if (isTankOverlayTarget(event.target)) {
        runtime.placementPreview = null;
        return;
      }

      runtime.lastTankPoint = point;
      runtime.placementPreview = point ? clampDecorPlacement(point.x / TANK_WIDTH, point.y / TANK_HEIGHT, {
        decorKey: runtime.placementMode.decorKey,
        scale: runtime.placementMode.scale
      }) : null;
    }
  });

  dom.tankStage.addEventListener("pointerleave", () => {
    runtime.pointerStagePx = null;
    renderToolCursor();
    if (!runtime.pointerDown && runtime.placementMode && !runtime.dragState && !runtime.fishDragState && !runtime.pebbleDragState) {
      runtime.placementPreview = null;
    }
  });

  dom.closeInspector.addEventListener("click", () => closeFishInspector());
  dom.inspectorDisposeFish?.addEventListener("click", () => {
    const fishId = dom.inspectorDisposeFish?.dataset.disposeFish;
    if (fishId) {
      disposeFish(fishId);
    }
  });
  dom.saveFishName.addEventListener("click", () => saveInspectorName());
  dom.fishNameInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      saveInspectorName();
    }
  });

  const releasePointer = (event) => {
    runtime.pointerDown = false;
    runtime.lastScrubPoint = null;
    if (runtime.dragState) {
      finalizeDecorDrag();
    }
    if (runtime.fishDragState) {
      finalizeFishDrag();
    }
    // if (runtime.pebbleDragState) {
    //   finalizeGravelPebbleDrag();
    // }

    if (
      event &&
      Number.isInteger(event.pointerId) &&
      typeof dom.tankStage.hasPointerCapture === "function" &&
      dom.tankStage.hasPointerCapture(event.pointerId)
    ) {
      try {
        dom.tankStage.releasePointerCapture(event.pointerId);
      } catch (error) {
        console.debug("Pointer release skipped.", error);
      }
    }

    if (!runtime.cleaningMode) {
      runtime.pointerStagePx = null;
    }
    renderToolCursor();
  };

  dom.tankStage.addEventListener("pointerup", releasePointer);
  dom.tankStage.addEventListener("pointercancel", releasePointer);
  window.addEventListener("blur", releasePointer);
  window.addEventListener("beforeunload", saveState);
}

function configureCanvasContext(context) {
  if (!context) {
    return;
  }

  context.imageSmoothingEnabled = true;
  if ("imageSmoothingQuality" in context) {
    context.imageSmoothingQuality = "high";
  }
}

function resizeDisplayCanvases() {
  const rect = dom.tankStage.getBoundingClientRect();
  if (!rect.width || !rect.height) {
    return;
  }

  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const displayWidth = Math.max(1, Math.round(rect.width * dpr));
  const displayHeight = Math.max(1, Math.round(rect.height * dpr));

  const tankSizeChanged = dom.tankCanvas.width !== displayWidth || dom.tankCanvas.height !== displayHeight;
  if (tankSizeChanged) {
    dom.tankCanvas.width = displayWidth;
    dom.tankCanvas.height = displayHeight;
  }
  if (dom.grimeCanvas.width !== displayWidth || dom.grimeCanvas.height !== displayHeight) {
    dom.grimeCanvas.width = displayWidth;
    dom.grimeCanvas.height = displayHeight;
  }
  if (dom.glassCanvas.width !== displayWidth || dom.glassCanvas.height !== displayHeight) {
    dom.glassCanvas.width = displayWidth;
    dom.glassCanvas.height = displayHeight;
  }

  const scaleX = displayWidth / TANK_WIDTH;
  const scaleY = displayHeight / TANK_HEIGHT;

  tankContext.setTransform(scaleX, 0, 0, scaleY, 0, 0);
  grimeContext.setTransform(scaleX, 0, 0, scaleY, 0, 0);
  glassContext.setTransform(scaleX, 0, 0, scaleY, 0, 0);
  configureCanvasContext(tankContext);
  configureCanvasContext(grimeContext);
  configureCanvasContext(glassContext);

  if (tankSizeChanged) {
    invalidateGravelBedCache(false);
  }
}

async function fetchAssetList(type) {
  try {
    const manifest = await fetchAssetManifest();
    return Array.isArray(manifest[type]) ? manifest[type] : [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function fetchAssetManifest() {
  if (!assetManifestPromise) {
    assetManifestPromise = (async () => {
      const response = await fetch(resolveAppUrl(STATIC_ASSET_MANIFEST), { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Could not load the asset manifest");
      }

      const payload = await response.json();
      return payload && typeof payload === "object" ? payload : {};
    })().catch((error) => {
      console.error(error);
      return {};
    });
  }

  return assetManifestPromise;
}

async function fetchFishCatalog() {
  try {
    const response = await fetch(resolveAppUrl("assets/fish/fish-types.json"), { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Could not load fish catalog");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return { fish: FISH_TYPES };
  }
}

async function fetchDecorCatalog() {
  try {
    const response = await fetch(resolveAppUrl("assets/decor/decor_types.json"), { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Could not load decor catalog");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return { decor: [] };
  }
}

function normalizeDecorMeta(payload) {
  const entries = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.decor)
      ? payload.decor
      : [];

  const map = {};

  for (const entry of entries) {
    if (!entry || typeof entry !== "object") {
      continue;
    }

    const key = String(entry.file || entry.key || "").trim();
    if (!key) {
      continue;
    }

    map[key] = {
      name: typeof entry.name === "string" && entry.name.trim()
        ? entry.name.trim()
        : titleFromFile(key),
      cost: Number.isFinite(entry.cost) ? entry.cost : 8,
      width: Number.isFinite(entry.width) ? entry.width : 140,
      defaultScale: Number.isFinite(entry.defaultScale) ? entry.defaultScale : DEFAULT_DECOR_SCALE,
      caveBehavior: normalizeCaveBehaviorMeta(entry.caveBehavior)
    };
  }

  return map;
}

function normalizeCavePortalMeta(entry) {
  if (!entry || typeof entry !== "object") {
    return null;
  }

  const approachX = Number(entry.approachX);
  const approachY = Number(entry.approachY);
  const mouthX = Number(entry.mouthX);
  const mouthY = Number(entry.mouthY);
  if (![approachX, approachY, mouthX, mouthY].every(Number.isFinite)) {
    return null;
  }

  const path = Array.isArray(entry.path)
    ? entry.path
      .map((node) => {
        if (!node || typeof node !== "object") {
          return null;
        }

        const x = Number.isFinite(Number(node.x)) ? Number(node.x) : Number(node.xNorm);
        const y = Number.isFinite(Number(node.y)) ? Number(node.y) : Number(node.yNorm);
        if (!Number.isFinite(x) || !Number.isFinite(y)) {
          return null;
        }

        return {
          x: clamp(x, 0.02, 0.98),
          y: clamp(y, 0.02, 0.98)
        };
      })
      .filter(Boolean)
    : [];

  return {
    id: typeof entry.id === "string" && entry.id.trim() ? entry.id.trim() : createId("portal"),
    approachX: clamp(approachX, 0.02, 0.98),
    approachY: clamp(approachY, 0.02, 0.98),
    mouthX: clamp(mouthX, 0.02, 0.98),
    mouthY: clamp(mouthY, 0.02, 0.98),
    outsideLayer: clampTankLayer(Number.isFinite(Number(entry.outsideLayer)) ? Number(entry.outsideLayer) : 2),
    insideLayer: clampTankLayer(Number.isFinite(Number(entry.insideLayer)) ? Number(entry.insideLayer) : 4),
    path
  };
}

function normalizeCaveInsideSlotMeta(entry) {
  if (!entry || typeof entry !== "object") {
    return null;
  }

  const x = Number.isFinite(Number(entry.x)) ? Number(entry.x) : Number(entry.xNorm);
  const y = Number.isFinite(Number(entry.y)) ? Number(entry.y) : Number(entry.yNorm);
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    return null;
  }

  const portalIds = Array.isArray(entry.portalIds)
    ? entry.portalIds.map((value) => String(value).trim()).filter(Boolean)
    : [];

  return {
    id: typeof entry.id === "string" && entry.id.trim() ? entry.id.trim() : createId("slot"),
    x: clamp(x, 0.04, 0.96),
    y: clamp(y, 0.04, 0.96),
    layer: clampTankLayer(Number.isFinite(Number(entry.layer)) ? Number(entry.layer) : 4),
    portalIds
  };
}

function normalizeCaveBehaviorMeta(entry) {
  if (!entry || typeof entry !== "object") {
    return null;
  }

  const portals = Array.isArray(entry.portals)
    ? entry.portals.map((portal) => normalizeCavePortalMeta(portal)).filter(Boolean)
    : [];

  const interiorZones = Array.isArray(entry.interiorZones)
    ? entry.interiorZones
      .map((zone) => {
        if (!zone || typeof zone !== "object") {
          return null;
        }

        const xMin = Number(zone.xMin);
        const xMax = Number(zone.xMax);
        const yMin = Number(zone.yMin);
        const yMax = Number(zone.yMax);
        if (![xMin, xMax, yMin, yMax].every(Number.isFinite)) {
          return null;
        }

        return {
          id: typeof zone.id === "string" && zone.id.trim() ? zone.id.trim() : createId("zone"),
          xMin: clamp(Math.min(xMin, xMax), 0, 1),
          xMax: clamp(Math.max(xMin, xMax), 0, 1),
          yMin: clamp(Math.min(yMin, yMax), 0, 1),
          yMax: clamp(Math.max(yMin, yMax), 0, 1)
        };
      })
      .filter(Boolean)
    : [];

  const insideSlots = Array.isArray(entry.insideSlots)
    ? entry.insideSlots.map((slot) => normalizeCaveInsideSlotMeta(slot)).filter(Boolean)
    : [];

  return {
    portals,
    insideSlots,
    interiorZones,
    lingerMinMs: Number.isFinite(entry.lingerMinMs) ? entry.lingerMinMs : undefined,
    lingerMaxMs: Number.isFinite(entry.lingerMaxMs) ? entry.lingerMaxMs : undefined
  };
}

function buildBackgroundCatalog(items) {
  return items.map((item) => {
    const meta = BACKGROUND_META[item.key] || {};
    return {
      key: item.key,
      path: item.path,
      name: meta.name || titleFromFile(item.key),
      blurb: meta.blurb || "A custom aquarium backdrop from your assets folder."
    };
  });
}

function buildSimpleAssetCatalog(items, meta, fallbackBlurb) {
  return items.map((item) => {
    const details = meta[item.key] || {};
    return {
      ...details,
      key: item.key,
      path: item.path,
      name: details.name || titleFromFile(item.key),
      blurb: details.blurb || fallbackBlurb
    };
  });
}

function getDecorCompanionType(decorKey = "") {
  const key = String(decorKey || "").toLowerCase();

  if (/_(?:triggers|trigger)\.[^.]+$/.test(key)) {
    return "trigger";
  }

  if (/_(?:seats|seat)\.[^.]+$/.test(key)) {
    return "seats";
  }

  if (/_bg\.[^.]+$/.test(key)) {
    return "bg";
  }

  if (/_mask\.[^.]+$/.test(key)) {
    return "mask";
  }

  if (/_mid\.[^.]+$/.test(key)) {
    return "mid";
  }

  return "base";
}

function getDecorBaseKey(decorKey = "") {
  const key = String(decorKey || "").toLowerCase();
  return key
    .replace(/_(?:triggers|trigger)(?=\.[^.]+$)/, "")
    .replace(/_(?:seats|seat)(?=\.[^.]+$)/, "")
    .replace(/_bg(?=\.[^.]+$)/, "")
    .replace(/_mask(?=\.[^.]+$)/, "")
    .replace(/_mid(?=\.[^.]+$)/, "");
}

function buildDecorCatalog(items) {
  const grouped = new Map();

  for (const item of items) {
    const type = getDecorCompanionType(item.key);
    const baseKey = getDecorBaseKey(item.key);

    if (!grouped.has(baseKey)) {
      grouped.set(baseKey, {
        base: null,
        bg: null,
        mask: null,
        mid: null,
        trigger: null,
        seats: null
      });
    }

    const entry = grouped.get(baseKey);
    entry[type] = item;
  }

  return [...grouped.entries()]
    .map(([baseKey, group]) => {
      if (!group.base) {
        return null;
      }

      const meta = runtime.decorMeta[group.base.key] || runtime.decorMeta[baseKey] || {};

      return {
        key: group.base.key,
        path: group.base.path,
        bgPath: group.bg?.path || null,
        maskPath: group.mask?.path || null,
        midPath: group.mid?.path || null,
        triggerPath: group.trigger?.path || null,
        seatsPath: group.seats?.path || null,
        hasBg: Boolean(group.bg),
        hasMask: Boolean(group.mask),
        hasMid: Boolean(group.mid),
        hasTrigger: Boolean(group.trigger),
        hasSeats: Boolean(group.seats),
        name: meta.name || titleFromFile(group.base.key),
        cost: Number.isFinite(meta.cost) ? meta.cost : 8,
        width: Number.isFinite(meta.width) ? meta.width : 140,
        defaultScale: Number.isFinite(meta.defaultScale) ? meta.defaultScale : DEFAULT_DECOR_SCALE,
        caveBehavior: meta.caveBehavior || null
      };
    })
    .filter(Boolean);
}

function normalizeFishCatalog(payload, options = {}) {
  const entries = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.fish)
      ? payload.fish
      : FISH_TYPES;

  return entries
    .map((entry, index) => normalizeFishDefinition(entry, index, options))
    .filter(Boolean);
}

function normalizeFishDefinition(entry, index, options = {}) {
  if (!entry || typeof entry !== "object") {
    return null;
  }

  const id = typeof entry.id === "string" && entry.id.trim() ? entry.id.trim() : `fish-${index + 1}`;
  const swimStyleSource = typeof entry.swimStyle === "string" ? entry.swimStyle : entry.style;
  const swimStyle = typeof swimStyleSource === "string" ? swimStyleSource.trim().toLowerCase() : "steady";
  const defaults = SWIM_STYLE_DEFAULTS[swimStyle] || SWIM_STYLE_DEFAULTS.steady;
  const rawAssetFile = [entry.asset, entry.image, entry.file].find((value) => typeof value === "string" && value.trim());
  const assetFile = rawAssetFile ? rawAssetFile.trim() : `${id}.png`;
  const assetFolder = typeof entry.assetFolder === "string" && entry.assetFolder.trim()
    ? entry.assetFolder.trim().replace(/^\/+|\/+$/g, "")
    : "fish";
  const behavior = typeof entry.behavior === "string" && entry.behavior.trim() ? entry.behavior.trim().toLowerCase() : "free";
  const diet = typeof entry.diet === "string" && entry.diet.trim() ? entry.diet.trim().toLowerCase() : "pellet";
  const folderAssets = Array.isArray(options.assetFolders?.[assetFolder]) ? options.assetFolders[assetFolder] : [];
  const fallbackAssetSource = typeof entry.fallbackAsset === "string" && entry.fallbackAsset.trim()
    ? entry.fallbackAsset.trim()
    : null;
  const fallbackAsset = fallbackAssetSource
    ? (/[\\/]/.test(fallbackAssetSource) || /^[a-z]+:/i.test(fallbackAssetSource)
      ? resolveAppUrl(fallbackAssetSource)
      : resolveAppUrl(`assets/fish/${encodeURIComponent(fallbackAssetSource)}`))
    : null;
  const normalizedAssetKey = assetFile
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[\s_-]+/g, "");
  const matchedFolderAsset = assetFolder === "fish"
    ? null
    : (
      folderAssets.find((item) => item.key.toLowerCase() === assetFile.toLowerCase()) ||
      folderAssets.find((item) => (
        item.key
          .toLowerCase()
          .replace(/\.[^.]+$/, "")
          .replace(/[\s_-]+/g, "") === normalizedAssetKey
      ))
    );
  const resolvedAsset = /[\\/]/.test(assetFile) || /^[a-z]+:/i.test(assetFile)
    ? resolveAppUrl(assetFile)
    : assetFolder === "fish"
      ? resolveAppUrl(`assets/fish/${encodeURIComponent(assetFile)}`)
      : matchedFolderAsset?.path || fallbackAsset || resolveAppUrl(`assets/fish/${encodeURIComponent(assetFile)}`);

  const speedMinFloor = behavior === "sucker" ? 0.00005 : 0.012;
  const speedMaxCeiling = behavior === "sucker" ? 0.006 : 0.095;

  return {
    id,
    name: typeof entry.name === "string" && entry.name.trim() ? entry.name.trim() : titleFromFile(id),
    cost: Math.max(1, Math.floor(Number(entry.cost ?? entry.price) || 1)),
    mealCoins: Math.max(0, Math.floor(Number(entry.mealCoins ?? entry.coinsPerMeal) || (diet === "detritus" ? 0 : 1))),
    asset: resolvedAsset,
    fallbackAsset,
    assetFolder,
    description: typeof entry.description === "string" && entry.description.trim()
      ? entry.description.trim()
      : "A custom fish from your fish catalog.",
    width: clamp(Number(entry.width) || 128, 84, 240),
    cycleSeconds: clamp(Number(entry.cycleSeconds) || 26, 12, 60),
    bobSpeed: clamp(Number(entry.bobSpeed) || 1.2, 0.6, 2.2),
    swimStyle,
    speedMode: entry.speedMode === "dynamic" ? "dynamic" : defaults.speedMode,
    speedMin: clamp(Number(entry.speedMin) || defaults.speedMin, speedMinFloor, speedMaxCeiling),
    speedMax: clamp(Number(entry.speedMax) || defaults.speedMax, Math.max(speedMinFloor, speedMinFloor * 1.25), speedMaxCeiling),
    targetMinMs: Math.max(800, Math.floor(Number(entry.targetMinMs) || defaults.targetMinMs)),
    targetMaxMs: Math.max(1400, Math.floor(Number(entry.targetMaxMs) || defaults.targetMaxMs)),
    behavior,
    diet,
    cleanupMinMs: Math.max(60 * 1000, Math.floor(Number(entry.cleanupMinMs) || Number(entry.cleanupMinutesMin) * 60 * 1000 || 12 * 60 * 1000)),
    cleanupMaxMs: Math.max(2 * 60 * 1000, Math.floor(Number(entry.cleanupMaxMs) || Number(entry.cleanupMinutesMax) * 60 * 1000 || 24 * 60 * 1000)),
    cleanupStrength: clamp(Number(entry.cleanupStrength) || 0.12, 0.02, 0.45),
    shadowScale: clamp(Number(entry.shadowScale) || 0.28, 0.14, 0.5),
    defaultScale: clamp(Number(entry.defaultScale) || DEFAULT_FISH_SCALE, FISH_SCALE_MIN, FISH_SCALE_MAX),
    caveEnabled: entry.caveEnabled !== false,
    defaultNames: Array.isArray(entry.defaultNames) && entry.defaultNames.length
      ? entry.defaultNames.map((name) => String(name).trim()).filter(Boolean)
      : (FISH_NAME_POOL[id] || [])
  };
}

function resolveDecorBaseScale(decorKey) {
  const rawScale = Number(runtime.decorMap.get(decorKey)?.defaultScale) || DEFAULT_DECOR_SCALE;
  return clamp(rawScale, DECOR_SCALE_MIN, DECOR_SCALE_MAX);
}

function resolveFishBaseScale(speciesId) {
  const rawScale = Number(runtime.fishMap.get(speciesId)?.defaultScale) || DEFAULT_FISH_SCALE;
  return clamp(rawScale, FISH_SCALE_MIN, FISH_SCALE_MAX);
}

function getDecorScaleDefault(decorKey) {
  const storedScale = Number(state?.decorScaleDefaults?.[decorKey]);
  return clamp(Number.isFinite(storedScale) ? storedScale : resolveDecorBaseScale(decorKey), DECOR_SCALE_MIN, DECOR_SCALE_MAX);
}

function getFishScaleDefault(speciesId) {
  const storedScale = Number(state?.fishScaleDefaults?.[speciesId]);
  return clamp(Number.isFinite(storedScale) ? storedScale : resolveFishBaseScale(speciesId), FISH_SCALE_MIN, FISH_SCALE_MAX);
}

function getSpeciesForFish(fish) {
  return fish ? runtime.fishMap.get(fish.speciesId) || null : null;
}

function isDetritusFish(target) {
  const species = target?.speciesId ? getSpeciesForFish(target) : target;
  return species?.diet === "detritus";
}

function getFeedableLivingFish() {
  return state.fish.filter((fish) => !isFishDead(fish) && !isDetritusFish(fish));
}

function fishNeedsMealWindow(target) {
  return !isDetritusFish(target);
}

function hasActiveSuckerFish() {
  return state.fish.some((fish) => !isFishDead(fish) && isDetritusFish(fish));
}

function normalizeHexColor(value) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  if (/^#[0-9a-f]{6}$/i.test(trimmed)) {
    return trimmed.toUpperCase();
  }
  if (/^#[0-9a-f]{3}$/i.test(trimmed)) {
    return `#${trimmed[1]}${trimmed[1]}${trimmed[2]}${trimmed[2]}${trimmed[3]}${trimmed[3]}`.toUpperCase();
  }
  return null;
}

function hexToRgb(color) {
  const normalized = normalizeHexColor(color);
  if (!normalized) {
    return null;
  }

  return {
    r: Number.parseInt(normalized.slice(1, 3), 16),
    g: Number.parseInt(normalized.slice(3, 5), 16),
    b: Number.parseInt(normalized.slice(5, 7), 16)
  };
}

function rgbToHex({ r, g, b }) {
  return `#${[r, g, b].map((channel) => clamp(Math.round(channel), 0, 255).toString(16).padStart(2, "0")).join("")}`.toUpperCase();
}

function rgbToHsl({ r, g, b }) {
  const red = clamp(r, 0, 255) / 255;
  const green = clamp(g, 0, 255) / 255;
  const blue = clamp(b, 0, 255) / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const lightness = (max + min) / 2;
  const delta = max - min;

  if (delta === 0) {
    return { h: 0, s: 0, l: lightness };
  }

  const saturation = lightness > 0.5
    ? delta / (2 - max - min)
    : delta / (max + min);
  let hue;
  switch (max) {
    case red:
      hue = ((green - blue) / delta + (green < blue ? 6 : 0)) / 6;
      break;
    case green:
      hue = ((blue - red) / delta + 2) / 6;
      break;
    default:
      hue = ((red - green) / delta + 4) / 6;
      break;
  }

  return { h: hue, s: saturation, l: lightness };
}

function hslToRgb({ h, s, l }) {
  const hue = ((h % 1) + 1) % 1;
  const saturation = clamp(s, 0, 1);
  const lightness = clamp(l, 0, 1);
  if (saturation === 0) {
    const channel = Math.round(lightness * 255);
    return { r: channel, g: channel, b: channel };
  }

  const q = lightness < 0.5
    ? lightness * (1 + saturation)
    : lightness + saturation - lightness * saturation;
  const p = 2 * lightness - q;
  const hueToChannel = (offset) => {
    let t = hue + offset;
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  return {
    r: Math.round(hueToChannel(1 / 3) * 255),
    g: Math.round(hueToChannel(0) * 255),
    b: Math.round(hueToChannel(-1 / 3) * 255)
  };
}

function normalizeHueUnit(value) {
  if (!Number.isFinite(Number(value))) {
    return 0;
  }
  return ((Number(value) % 1) + 1) % 1;
}

function getHueDeltaUnit(fromHue, toHue) {
  const from = normalizeHueUnit(fromHue);
  const to = normalizeHueUnit(toHue);
  let delta = to - from;
  if (delta > 0.5) {
    delta -= 1;
  } else if (delta < -0.5) {
    delta += 1;
  }
  return delta;
}

function mixColors(colorA, colorB, amount = 0.5) {
  const rgbA = hexToRgb(colorA);
  const rgbB = hexToRgb(colorB);
  if (!rgbA && !rgbB) {
    return DEFAULT_GRAVEL_PALETTE[0];
  }
  if (!rgbA) {
    return normalizeHexColor(colorB) || DEFAULT_GRAVEL_PALETTE[0];
  }
  if (!rgbB) {
    return normalizeHexColor(colorA) || DEFAULT_GRAVEL_PALETTE[0];
  }

  const weight = clamp(amount, 0, 1);
  return rgbToHex({
    r: rgbA.r + (rgbB.r - rgbA.r) * weight,
    g: rgbA.g + (rgbB.g - rgbA.g) * weight,
    b: rgbA.b + (rgbB.b - rgbA.b) * weight
  });
}

function withAlpha(color, alpha) {
  const rgb = hexToRgb(color) || hexToRgb(DEFAULT_GRAVEL_PALETTE[0]);
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${clamp(alpha, 0, 1).toFixed(3)})`;
}

function getDefaultGravelPalette() {
  return [...DEFAULT_GRAVEL_PALETTE];
}

function getCatalogDefaultKey(catalog, preferredKey) {
  return catalog.find((item) => item.key === preferredKey)?.key || catalog[0]?.key || null;
}

function sanitizeGravelPalette(palette) {
  const fallback = getDefaultGravelPalette();
  const candidate = Array.isArray(palette) ? palette.slice(0, 3).map((value) => normalizeHexColor(value)) : [];
  return Array.from({ length: 3 }, (_, index) => candidate[index] || fallback[index]);
}

function getActiveGravelPalette() {
  return sanitizeGravelPalette(state?.gravelPalette);
}

function getGravelPaletteChoices() {
  return GRAVEL_COLOR_SWATCHES.map((color, index) => ({
    key: `gravel-choice-${index + 1}`,
    color,
    label: `Gravel color ${index + 1}`
  }));
}

function formatDecorScale(scale) {
  return `${Math.round(clamp(scale, DECOR_SCALE_MIN, DECOR_SCALE_MAX) * 100)}%`;
}

function formatFishScale(scale) {
  return `${Math.round(clamp(scale, FISH_SCALE_MIN, FISH_SCALE_MAX) * 100)}%`;
}

function setMarkupIfChanged(cacheKey, element, markup) {
  if (!element) {
    return;
  }

  if (runtime.renderedMarkup[cacheKey] === markup) {
    return;
  }

  const scrollTop = element.scrollTop;
  element.innerHTML = markup;
  runtime.renderedMarkup[cacheKey] = markup;
  if (element.scrollHeight > element.clientHeight) {
    element.scrollTop = scrollTop;
  }
}

function shouldRebuildRenderSection(sectionKey, dataKey) {
  if (runtime.renderedDataKeys[sectionKey] === dataKey) {
    return false;
  }

  runtime.renderedDataKeys[sectionKey] = dataKey;
  return true;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

function reconcileState(rawState) {
  const now = Date.now();
  const base = {
    version: STATE_VERSION,
    coins: STARTING_COINS,
    lifetimeDeaths: 0,
    lastCorpseSicknessAt: null,
    fish: [],
    storedFish: [],
    feedHistory: {},
    pendingPoops: [],
    poops: [],
    decorInventory: {},
    decorScaleDefaults: {},
    fishScaleDefaults: {},
    placedDecor: [],
    gravelPalette: getDefaultGravelPalette(),
    gravelSeed: Math.floor(Math.random() * 0x7fffffff),
    gravelLivePebbles: [],
    floatingPellets: [],
    selectedBackground: getCatalogDefaultKey(runtime.backgroundCatalog, DEFAULT_BACKGROUND_ASSET_KEY),
    selectedTankAsset: runtime.tankCatalog.find((item) => item.key === "midnight-curve.png")?.key || runtime.tankCatalog[0]?.key || null,
    selectedFilterAsset: runtime.filterCatalog.find((item) => item.key === "charcoal-filter.png")?.key || runtime.filterCatalog[0]?.key || null,
    selectedGravelAsset: getCatalogDefaultKey(runtime.gravelCatalog, DEFAULT_GRAVEL_ASSET_KEY),
    selectedBubbleAsset: runtime.bubbleCatalog[0]?.key || null,
    theme: DEFAULT_THEME,
    lastCleanedAt: now,
    lastSimulatedAt: now,
    events: []
  };

  const incoming = rawState && typeof rawState === "object" ? rawState : {};
  const incomingVersion = Number.isFinite(incoming.version) ? incoming.version : 0;

  const nextState = {
    ...base,
    coins: Number.isFinite(incoming.coins) ? Math.max(0, Math.floor(incoming.coins)) : base.coins,
    lifetimeDeaths: Number.isFinite(incoming.lifetimeDeaths) ? Math.max(0, Math.floor(incoming.lifetimeDeaths)) : base.lifetimeDeaths,
    lastCorpseSicknessAt: Number.isFinite(incoming.lastCorpseSicknessAt) ? incoming.lastCorpseSicknessAt : null,
    fish: Array.isArray(incoming.fish) ? incoming.fish.map(sanitizeFish).filter(Boolean) : [],
    storedFish: Array.isArray(incoming.storedFish) ? incoming.storedFish.map(sanitizeFish).filter(Boolean) : [],
    feedHistory: sanitizeHistory(incoming.feedHistory),
    pendingPoops: Array.isArray(incoming.pendingPoops) ? incoming.pendingPoops.map(sanitizePoop).filter(Boolean) : [],
    poops: Array.isArray(incoming.poops) ? incoming.poops.map(sanitizePoop).filter(Boolean) : [],
    decorInventory: sanitizeInventory(incoming.decorInventory),
    decorScaleDefaults: sanitizeDecorScaleDefaults(incoming.decorScaleDefaults),
    fishScaleDefaults: sanitizeFishScaleDefaults(incoming.fishScaleDefaults),
    placedDecor: Array.isArray(incoming.placedDecor) ? incoming.placedDecor.map(sanitizePlacedDecor).filter(Boolean) : [],
    gravelPalette: sanitizeGravelPalette(incoming.gravelPalette),
    gravelSeed: Number.isFinite(incoming.gravelSeed) ? Math.abs(Math.floor(incoming.gravelSeed)) : base.gravelSeed,
    gravelLivePebbles: [],
    floatingPellets: Array.isArray(incoming.floatingPellets)
      ? incoming.floatingPellets.map(sanitizePellet).filter(Boolean)
      : [],
    selectedBackground: runtime.backgroundMap.has(incoming.selectedBackground)
      ? incoming.selectedBackground
      : base.selectedBackground,
    selectedTankAsset: runtime.tankMap.has(incoming.selectedTankAsset)
      ? incoming.selectedTankAsset
      : base.selectedTankAsset,
    selectedFilterAsset: runtime.filterMap.has(incoming.selectedFilterAsset)
      ? incoming.selectedFilterAsset
      : base.selectedFilterAsset,
    selectedGravelAsset: runtime.gravelMap.has(incoming.selectedGravelAsset)
      ? incoming.selectedGravelAsset
      : base.selectedGravelAsset,
    selectedBubbleAsset: runtime.bubbleMap.has(incoming.selectedBubbleAsset)
      ? incoming.selectedBubbleAsset
      : base.selectedBubbleAsset,
    theme: DEFAULT_THEME,
    lastCleanedAt: Number.isFinite(incoming.lastCleanedAt) ? incoming.lastCleanedAt : base.lastCleanedAt,
    lastSimulatedAt: Number.isFinite(incoming.lastSimulatedAt) ? incoming.lastSimulatedAt : base.lastSimulatedAt,
    events: Array.isArray(incoming.events) ? incoming.events.map(sanitizeEvent).filter(Boolean).slice(0, 12) : [],
    version: STATE_VERSION
  };

  if (!nextState.selectedBackground && runtime.backgroundCatalog.length) {
    nextState.selectedBackground = getCatalogDefaultKey(runtime.backgroundCatalog, DEFAULT_BACKGROUND_ASSET_KEY);
  }
  if (!nextState.selectedTankAsset && runtime.tankCatalog.length) {
    nextState.selectedTankAsset = runtime.tankCatalog[0].key;
  }
  if (!nextState.selectedFilterAsset && runtime.filterCatalog.length) {
    nextState.selectedFilterAsset = runtime.filterCatalog[0].key;
  }
  if (!nextState.selectedGravelAsset && runtime.gravelCatalog.length) {
    nextState.selectedGravelAsset = getCatalogDefaultKey(runtime.gravelCatalog, DEFAULT_GRAVEL_ASSET_KEY);
  }
  if (!nextState.selectedBubbleAsset && runtime.bubbleCatalog.length) {
    nextState.selectedBubbleAsset = runtime.bubbleCatalog[0].key;
  }

  const hasStartedPlaying = nextState.fish.length
    || nextState.storedFish.length
    || nextState.placedDecor.length
    || Object.keys(nextState.decorInventory).length
    || Object.keys(nextState.feedHistory).length
    || nextState.pendingPoops.length
    || nextState.poops.length;
  if (!hasStartedPlaying && nextState.coins < STARTING_COINS) {
    nextState.coins = STARTING_COINS;
  }

  if (incomingVersion < STATE_VERSION) {
    nextState.placedDecor = nextState.placedDecor.map((item) => ({
      ...item,
      scale: clamp(item.scale * 1.5, DECOR_SCALE_MIN, DECOR_SCALE_MAX)
    }));
    if (!Number.isFinite(incoming.lifetimeDeaths)) {
      nextState.lifetimeDeaths = nextState.fish.filter((fish) => isFishDead(fish)).length
        + nextState.storedFish.filter((fish) => isFishDead(fish)).length;
    }
  }

  const corpseCount = nextState.fish.filter((fish) => isFishDead(fish)).length
    + nextState.storedFish.filter((fish) => isFishDead(fish)).length;

  if (!Number.isFinite(incoming.lifetimeDeaths) || nextState.lifetimeDeaths < corpseCount) {
    nextState.lifetimeDeaths = corpseCount;
  }

  if (!nextState.events.length) {
    nextState.events = [
      {
        id: createId("event"),
        time: now,
        text: "Welcome to Bubble Borough. Buy your first fish to get the aquarium humming."
      }
    ];
  }

  pruneState(now, nextState);
  return nextState;
}

function isLikelySaveStateObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  return [
    "version",
    "coins",
    "fish",
    "storedFish",
    "placedDecor",
    "decorInventory",
    "feedHistory"
  ].some((key) => Object.prototype.hasOwnProperty.call(value, key));
}

function extractImportedSaveState(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("That save file is not valid.");
  }

  if (payload.format === SAVE_FILE_FORMAT) {
    if (!payload.state || typeof payload.state !== "object" || Array.isArray(payload.state)) {
      throw new Error("That save file is missing aquarium data.");
    }
    return payload.state;
  }

  if (isLikelySaveStateObject(payload)) {
    return payload;
  }

  throw new Error("That file is not a Bubble Borough save.");
}

function createSaveExportFilename(timestamp = Date.now()) {
  const exportedAt = new Date(timestamp);
  const pad = (value) => String(value).padStart(2, "0");
  return `bubble-borough-save-${exportedAt.getFullYear()}-${pad(exportedAt.getMonth() + 1)}-${pad(exportedAt.getDate())}-${pad(exportedAt.getHours())}${pad(exportedAt.getMinutes())}${pad(exportedAt.getSeconds())}.json`;
}

function downloadTextFile(contents, filename, type = "application/json") {
  const blob = new Blob([contents], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function resetTransientAquariumUiState() {
  runtime.storeOverlayOpen = false;
  runtime.storeTab = "fish";
  runtime.editTankMode = false;
  runtime.fishEditMode = false;
  runtime.placementMode = null;
  runtime.placementPreview = null;
  runtime.cleaningMode = false;
  runtime.scoopMode = false;
  runtime.dragState = null;
  runtime.fishDragState = null;
  runtime.pebbleDragState = null;
  runtime.selectedFishId = null;
  runtime.pointerDown = false;
  runtime.pointerStagePx = null;
  runtime.lastTankPoint = null;
  runtime.lastScrubPoint = null;
  runtime.suppressNextTankClick = false;
  runtime.splashBursts = [];
  runtime.fallingGravelPebbles = [];
  runtime.bloodClouds = [];
  runtime.activeFishCavePlans.clear();
  runtime.bettaPassLocks.clear();
  runtime.decorPlacementLayer = DEFAULT_TANK_LAYER;
  runtime.activeGravelPaletteSlot = 0;
  runtime.decorHangoutZonesKey = "";
  runtime.decorHangoutZones = [];
  runtime.renderedMarkup = Object.create(null);
  runtime.renderedDataKeys = Object.create(null);
  runtime.gravelStateDirty = true;

  clearScrubProgress();
  runtime.cleaningTransition = null;
  renderToolCursor();
}

function applyImportedSaveData(rawState) {
  resetTransientAquariumUiState();
  const now = Date.now();
  state = reconcileState(rawState);
  const decorPlacementChanged = normalizePlacedDecorState();
  const stateChanged = syncState(now);
  if (decorPlacementChanged || stateChanged) {
    runtime.gravelStateDirty = true;
  }
  saveState();
  renderUi(now);
}

function exportSaveData() {
  if (!state) {
    showToast("No aquarium data is loaded yet.");
    return;
  }

  try {
    const exportedAt = Date.now();
    const payload = {
      format: SAVE_FILE_FORMAT,
      exportVersion: SAVE_FILE_EXPORT_VERSION,
      exportedAt,
      state
    };
    downloadTextFile(JSON.stringify(payload, null, 2), createSaveExportFilename(exportedAt));
    showToast("Save file exported.");
  } catch (error) {
    console.error(error);
    showToast("Could not export save data.");
  }
}

function openImportDataPicker() {
  dom.importDataInput?.click();
}

async function importSaveDataFromPicker(event) {
  const input = event?.currentTarget instanceof HTMLInputElement
    ? event.currentTarget
    : dom.importDataInput;
  const file = input?.files?.[0];
  if (!file) {
    return;
  }

  try {
    const confirmed = window.confirm("Importing a save file will replace your current progress. Continue?");
    if (!confirmed) {
      return;
    }

    const rawText = await file.text();
    const payload = JSON.parse(rawText.replace(/^\uFEFF/, ""));
    const importedState = extractImportedSaveState(payload);
    applyImportedSaveData(importedState);
    showToast("Save file imported.");
  } catch (error) {
    console.error(error);
    if (error instanceof SyntaxError) {
      showToast("That save file could not be read.");
    } else {
      showToast(error?.message || "Could not import save data.");
    }
  } finally {
    if (input) {
      input.value = "";
    }
  }
}

function sanitizeFish(fish) {
  if (!fish || !runtime.fishMap.has(fish.speciesId)) {
    return null;
  }

  const species = runtime.fishMap.get(fish.speciesId);
  const spawnX = clamp(Number(fish.xNorm) || randomSwimX(), 0.08, 0.92);
  const spawnY = clamp(Number(fish.yNorm) || randomSwimY(), 0.14, 0.8);
  const swimSpeed = normalizeFishSpeed(species, Number(fish.swimSpeed));
  const displayAngle = Number.isFinite(Number(fish.displayAngle))
    ? normalizeAngle(Number(fish.displayAngle))
    : (Number(fish.direction) < 0 ? Math.PI : 0);
  const displayDirection = Number.isFinite(Number(fish.displayDirection))
    ? (Number(fish.displayDirection) < 0 ? -1 : 1)
    : (Math.cos(displayAngle) < 0 ? -1 : 1);
  const turnFromAngle = Number.isFinite(Number(fish.turnFromAngle))
    ? normalizeAngle(Number(fish.turnFromAngle))
    : displayAngle;
  const turnToAngle = Number.isFinite(Number(fish.turnToAngle))
    ? normalizeAngle(Number(fish.turnToAngle))
    : displayAngle;
  const baseTankLayer = species.behavior === "sucker"
    ? TANK_DEPTH_LAYERS
    : clampTankLayer(Number.isFinite(Number(fish.tankLayer))
      ? Number(fish.tankLayer)
      : (fish.drawLayer === "back" ? 4 : DEFAULT_TANK_LAYER));
  const desiredTankLayer = species.behavior === "sucker"
    ? TANK_DEPTH_LAYERS
    : clampTankLayer(Number.isFinite(Number(fish.desiredTankLayer))
      ? Number(fish.desiredTankLayer)
      : (fish.desiredDrawLayer === "back" ? Math.max(baseTankLayer, 4) : baseTankLayer));
  return {
    id: String(fish.id || createId("fish")),
    speciesId: fish.speciesId,
    name: typeof fish.name === "string" && fish.name.trim() ? fish.name : buildFishName(fish.speciesId, []),
    acquiredAt: Number.isFinite(fish.acquiredAt) ? fish.acquiredAt : Date.now(),
    deadAt: Number.isFinite(fish.deadAt) ? fish.deadAt : null,
    healthUnits: clamp(
      Number.isFinite(Number(fish.healthUnits))
        ? Math.round(Number(fish.healthUnits))
        : MAX_HEALTH_UNITS,
      0,
      MAX_HEALTH_UNITS
    ),
    fedStreak: clamp(Math.round(Number(fish.fedStreak) || 0), 0, 999),
    xNorm: spawnX,
    yNorm: spawnY,
    targetXNorm: clamp(Number(fish.targetXNorm) || randomSwimX(), 0.08, 0.92),
    targetYNorm: clamp(Number(fish.targetYNorm) || randomSwimY(), 0.14, 0.8),
    targetAt: Number.isFinite(fish.targetAt) ? fish.targetAt : Date.now() + species.targetMinMs + Math.random() * (species.targetMaxMs - species.targetMinMs),
    direction: Number(fish.direction) < 0 ? -1 : 1,
    swimSpeed,
    phase: clamp(Number(fish.phase) || Math.random(), 0, 1),
    motionLevel: clamp(Number(fish.motionLevel) || 0.18, 0.04, 1),
    wiggleClock: Number.isFinite(fish.wiggleClock) ? fish.wiggleClock : Math.random() * Math.PI * 2,
    scale: clamp(Number(fish.scale) || resolveFishBaseScale(fish.speciesId), FISH_SCALE_MIN, FISH_SCALE_MAX),
    activity: fish.activity === "feeding" && !isDetritusFish(species) ? "feeding" : "roam",
    feedingPelletId: typeof fish.feedingPelletId === "string" ? fish.feedingPelletId : null,
    tankLayer: baseTankLayer,
    desiredTankLayer,
    drawLayer: tankLayerToLegacy(baseTankLayer),
    desiredDrawLayer: tankLayerToLegacy(desiredTankLayer),
    hangoutDecorId: typeof fish.hangoutDecorId === "string" ? fish.hangoutDecorId : null,
    entryStartedAt: Number.isFinite(fish.entryStartedAt) ? fish.entryStartedAt : null,
    entryDurationMs: Number.isFinite(fish.entryDurationMs) ? fish.entryDurationMs : 0,
    entryFromYNorm: Number.isFinite(fish.entryFromYNorm) ? clamp(fish.entryFromYNorm, 0.02, 0.18) : null,
    entrySplashTriggered: Boolean(fish.entrySplashTriggered),
    nextDetritusSnackAt: Number.isFinite(fish.nextDetritusSnackAt) ? fish.nextDetritusSnackAt : Date.now() + species.cleanupMinMs,
    displayDirection,
    displayAngle,
    turnStartedAt: Number.isFinite(fish.turnStartedAt) ? fish.turnStartedAt : null,
    turnDurationMs: Number.isFinite(fish.turnDurationMs) ? fish.turnDurationMs : 0,
    turnFromDirection: Number.isFinite(Number(fish.turnFromDirection))
      ? (Number(fish.turnFromDirection) < 0 ? -1 : 1)
      : displayDirection,
    turnToDirection: Number.isFinite(Number(fish.turnToDirection))
      ? (Number(fish.turnToDirection) < 0 ? -1 : 1)
      : displayDirection,
    turnFromAngle,
    turnToAngle,
    turnSpinDirection: Number.isFinite(Number(fish.turnSpinDirection))
      ? (Number(fish.turnSpinDirection) < 0 ? -1 : 1)
      : (displayDirection < 0 ? 1 : -1),
    caveState: typeof fish.caveState === "string" ? fish.caveState : null,
    caveDecorId: typeof fish.caveDecorId === "string" ? fish.caveDecorId : null,
    cavePortalId: typeof fish.cavePortalId === "string" ? fish.cavePortalId : null,
    caveTriggerId: typeof fish.caveTriggerId === "string" ? fish.caveTriggerId : null,
    caveSeatId: typeof fish.caveSeatId === "string" ? fish.caveSeatId : null,
    caveFrontLayer: Number.isFinite(Number(fish.caveFrontLayer)) ? clampTankLayer(Number(fish.caveFrontLayer)) : null,
    caveBackLayer: Number.isFinite(Number(fish.caveBackLayer)) ? clampTankLayer(Number(fish.caveBackLayer)) : null,
    caveApproachXNorm: Number.isFinite(Number(fish.caveApproachXNorm)) ? clamp(Number(fish.caveApproachXNorm), 0.08, 0.92) : null,
    caveApproachYNorm: Number.isFinite(Number(fish.caveApproachYNorm)) ? clamp(Number(fish.caveApproachYNorm), 0.14, 0.8) : null,
    caveEntryXNorm: Number.isFinite(Number(fish.caveEntryXNorm)) ? clamp(Number(fish.caveEntryXNorm), 0.08, 0.92) : null,
    caveEntryYNorm: Number.isFinite(Number(fish.caveEntryYNorm)) ? clamp(Number(fish.caveEntryYNorm), 0.14, 0.8) : null,
    caveInsideXNorm: Number.isFinite(Number(fish.caveInsideXNorm)) ? clamp(Number(fish.caveInsideXNorm), 0.08, 0.92) : null,
    caveInsideYNorm: Number.isFinite(Number(fish.caveInsideYNorm)) ? clamp(Number(fish.caveInsideYNorm), 0.14, 0.8) : null,
    caveInsideUntil: Number.isFinite(Number(fish.caveInsideUntil)) ? Number(fish.caveInsideUntil) : null,
    caveTriggerCooldownUntil: Number.isFinite(Number(fish.caveTriggerCooldownUntil)) ? Number(fish.caveTriggerCooldownUntil) : null,
    cavePathIndex: Number.isFinite(Number(fish.cavePathIndex)) ? Math.max(0, Math.floor(Number(fish.cavePathIndex))) : null,
    caveIdleTargetXNorm: Number.isFinite(Number(fish.caveIdleTargetXNorm)) ? clamp(Number(fish.caveIdleTargetXNorm), 0.08, 0.92) : null,
    caveIdleTargetYNorm: Number.isFinite(Number(fish.caveIdleTargetYNorm)) ? clamp(Number(fish.caveIdleTargetYNorm), 0.14, 0.8) : null,
    caveIdleTargetAt: Number.isFinite(Number(fish.caveIdleTargetAt)) ? Number(fish.caveIdleTargetAt) : null
  };
}

function sanitizeHistory(feedHistory) {
  if (!feedHistory || typeof feedHistory !== "object") {
    return {};
  }

  const entries = Object.entries(feedHistory)
    .filter(([, value]) => value && Number.isFinite(value.fedAt))
    .map(([key, value]) => [
      key,
      {
        fedAt: value.fedAt,
        coinsEarned: Number.isFinite(value.coinsEarned) ? Math.max(0, Math.floor(value.coinsEarned)) : 0
      }
    ]);

  return Object.fromEntries(entries);
}

function sanitizePoop(poop) {
  if (!poop || !Number.isFinite(poop.dueAt || poop.createdAt)) {
    return null;
  }

  return {
    id: String(poop.id || createId("poop")),
    fishId: String(poop.fishId || ""),
    dueAt: Number.isFinite(poop.dueAt) ? poop.dueAt : undefined,
    createdAt: Number.isFinite(poop.createdAt) ? poop.createdAt : undefined,
    xNorm: clamp(Number(poop.xNorm) || 0.5, 0.06, 0.94),
    yNorm: clamp(Number(poop.yNorm) || 0.86, 0.76, 0.96),
    startYNorm: clamp(Number(poop.startYNorm) || 0.54, 0.18, 0.82)
  };
}

function sanitizeInventory(inventory) {
  if (!inventory || typeof inventory !== "object") {
    return {};
  }

  const nextInventory = {};
  for (const [key, value] of Object.entries(inventory)) {
    const count = Math.max(0, Math.floor(Number(value) || 0));
    if (count > 0) {
      nextInventory[key] = count;
    }
  }

  return nextInventory;
}

function sanitizeDecorScaleDefaults(defaults) {
  if (!defaults || typeof defaults !== "object") {
    return {};
  }

  const nextDefaults = {};
  for (const [key, value] of Object.entries(defaults)) {
    if (typeof key !== "string" || !key.trim()) {
      continue;
    }
    nextDefaults[key] = clamp(Number(value) || resolveDecorBaseScale(key), DECOR_SCALE_MIN, DECOR_SCALE_MAX);
  }
  return nextDefaults;
}

function sanitizeFishScaleDefaults(defaults) {
  if (!defaults || typeof defaults !== "object") {
    return {};
  }

  const nextDefaults = {};
  for (const [key, value] of Object.entries(defaults)) {
    if (typeof key !== "string" || !key.trim()) {
      continue;
    }
    nextDefaults[key] = clamp(Number(value) || resolveFishBaseScale(key), FISH_SCALE_MIN, FISH_SCALE_MAX);
  }
  return nextDefaults;
}

function sanitizePlacedDecor(item) {
  if (!item || typeof item.decorKey !== "string") {
    return null;
  }

  return {
    id: String(item.id || createId("placed")),
    decorKey: item.decorKey,
    xNorm: clamp(Number(item.xNorm) || 0.5, 0, 1),
    yNorm: clamp(Number(item.yNorm) || 0.86, 0, 1),
    scale: clamp(Number(item.scale) || resolveDecorBaseScale(item.decorKey), DECOR_SCALE_MIN, DECOR_SCALE_MAX),
    tankLayer: clampTankLayer(Number(item.tankLayer) || DEFAULT_TANK_LAYER)
  };
}

function normalizePlacedDecorState(targetState = state) {
  if (!targetState || !Array.isArray(targetState.placedDecor) || !targetState.placedDecor.length || !runtime.images.size) {
    return false;
  }

  let changed = false;
  const nextPlacedDecor = targetState.placedDecor
    .map((item) => sanitizePlacedDecor(item))
    .filter(Boolean)
    .map((item) => {
      const normalizedLayer = getDecorFrontLayer(item.decorKey, item.tankLayer);
      const placement = clampDecorPlacement(item.xNorm, item.yNorm, { item });
      if (
        normalizedLayer !== item.tankLayer
        || Math.abs(placement.xNorm - item.xNorm) > 0.000001
        || Math.abs(placement.yNorm - item.yNorm) > 0.000001
      ) {
        changed = true;
      }

      return {
        ...item,
        xNorm: placement.xNorm,
        yNorm: placement.yNorm,
        tankLayer: normalizedLayer
      };
    });

  if (nextPlacedDecor.length !== targetState.placedDecor.length) {
    changed = true;
  }

  if (!changed) {
    return false;
  }

  targetState.placedDecor = nextPlacedDecor;
  if (Array.isArray(targetState.gravelLivePebbles)) {
    targetState.gravelLivePebbles = reconcileLooseGravelPebbles(targetState.gravelLivePebbles, targetState.placedDecor);
  }
  return true;
}

function clampTankLayer(layer) {
  return clamp(Math.round(Number(layer) || DEFAULT_TANK_LAYER), 1, TANK_DEPTH_LAYERS);
}

function tankLayerToLegacy(layer) {
  return clampTankLayer(layer) >= 4 ? "back" : "front";
}

function getFishTankLayer(fish) {
  return clampTankLayer(fish?.tankLayer || DEFAULT_TANK_LAYER);
}

function getDesiredFishTankLayer(fish) {
  return clampTankLayer(fish?.desiredTankLayer || fish?.tankLayer || DEFAULT_TANK_LAYER);
}

function setFishTankLayers(fish, tankLayer, desiredTankLayer = tankLayer) {
  if (!fish) {
    return;
  }

  const species = getSpeciesForFish(fish);
  const clampRegularFishLayer = (value) =>
    Math.max(1, Math.min(TANK_DEPTH_LAYERS - 1, Math.round(Number(value) || 1)));

  if (species?.behavior === "sucker") {
    fish.tankLayer = TANK_DEPTH_LAYERS;
    fish.desiredTankLayer = TANK_DEPTH_LAYERS;
  } else {
    fish.tankLayer = clampRegularFishLayer(tankLayer);
    fish.desiredTankLayer = clampRegularFishLayer(desiredTankLayer);
  }

  fish.drawLayer = tankLayerToLegacy(fish.tankLayer);
  fish.desiredDrawLayer = tankLayerToLegacy(fish.desiredTankLayer);
}

function setFishDesiredTankLayer(fish, desiredTankLayer) {
  if (!fish) {
    return;
  }

  setFishTankLayers(fish, getFishTankLayer(fish), desiredTankLayer);
}

function getDecorTankLayer(item) {
  return clampTankLayer(item?.tankLayer || DEFAULT_TANK_LAYER);
}

function isCaveDecorKey(decorKey = "") {
  const key = String(decorKey || "").toLowerCase();
  return key.includes("cave") && !key.includes("_bg") && !key.includes("_mid");
}

function getDecorFrontLayer(decorKey, layer) {
  const clamped = clampTankLayer(layer);
  if (!isCaveDecorKey(decorKey)) {
    return clamped;
  }

  return 3;
}

function getDecorLayerSpan(decorKey, layer) {
  const frontLayer = getDecorFrontLayer(decorKey, layer);

  if (!isCaveDecorKey(decorKey)) {
    return {
      front: frontLayer,
      mid: null,
      back: null,
      min: frontLayer,
      max: frontLayer,
      label: `Layer ${frontLayer}`
    };
  }

  const mid = frontLayer + 1;
  const back = frontLayer + 2;

  return {
    front: frontLayer,
    mid,
    back,
    min: frontLayer,
    max: back,
    label: `Layers ${frontLayer}-${back}`
  };
}

function isCaveNightWindow(timestamp = Date.now()) {
  if (runtime.debugNightCaveMode) {
    return true;
  }

  const hours = new Date(timestamp).getHours();
  return hours >= CAVE_NIGHT_START_HOUR || hours < CAVE_NIGHT_END_HOUR;
}

function getCaveBehaviorChance(species, timestamp = Date.now()) {
  if (!species || species.behavior === "sucker" || species.caveEnabled === false) {
    return 0;
  }

  if (runtime.debugNightCaveMode) {
    return 1;
  }

  if (isCaveNightWindow(timestamp)) {
    return CAVE_NIGHT_ENTRY_CHANCE;
  }

  return CAVE_ENTRY_CHANCE_BY_STYLE[species.swimStyle] || 0.3;
}

function getCaveBehaviorProfile(decorKey = "") {
  const directMeta = runtime.decorMap.get(decorKey)?.caveBehavior || runtime.decorMeta[decorKey]?.caveBehavior;
  const key = String(decorKey || "").toLowerCase();
  const overrideEntry = Object.entries(CAVE_BEHAVIOR_OVERRIDES).find(([matchKey]) => key.includes(matchKey.toLowerCase()));
  const override = overrideEntry?.[1] || null;
  const base = {
    portals: Array.isArray(directMeta?.portals) && directMeta.portals.length
      ? directMeta.portals
      : DEFAULT_CAVE_BEHAVIOR_PROFILE.portals,
    insideSlots: Array.isArray(directMeta?.insideSlots) && directMeta.insideSlots.length
      ? directMeta.insideSlots
      : DEFAULT_CAVE_BEHAVIOR_PROFILE.insideSlots,
    interiorZones: Array.isArray(directMeta?.interiorZones) && directMeta.interiorZones.length
      ? directMeta.interiorZones
      : DEFAULT_CAVE_BEHAVIOR_PROFILE.interiorZones,
    lingerMinMs: Number.isFinite(directMeta?.lingerMinMs)
      ? directMeta.lingerMinMs
      : DEFAULT_CAVE_BEHAVIOR_PROFILE.lingerMinMs,
    lingerMaxMs: Number.isFinite(directMeta?.lingerMaxMs)
      ? directMeta.lingerMaxMs
      : DEFAULT_CAVE_BEHAVIOR_PROFILE.lingerMaxMs,
    insideLayer: clampTankLayer(
      Number.isFinite(directMeta?.insideLayer)
        ? directMeta.insideLayer
        : (
          directMeta?.insideSlots?.find?.((slot) => Number.isFinite(slot?.layer))?.layer ??
          directMeta?.portals?.find?.((portal) => Number.isFinite(portal?.insideLayer))?.insideLayer ??
          4
        )
    )
  };

  if (!override) {
    return base;
  }

  return {
    portals: Array.isArray(override.portals) && override.portals.length
      ? override.portals
      : base.portals,
    insideSlots: Array.isArray(override.insideSlots) && override.insideSlots.length
      ? override.insideSlots
      : base.insideSlots,
    interiorZones: Array.isArray(override.interiorZones) && override.interiorZones.length
      ? override.interiorZones
      : base.interiorZones,
    lingerMinMs: Number.isFinite(override.lingerMinMs)
      ? override.lingerMinMs
      : base.lingerMinMs,
    lingerMaxMs: Number.isFinite(override.lingerMaxMs)
      ? override.lingerMaxMs
      : base.lingerMaxMs,
    insideLayer: clampTankLayer(
      Number.isFinite(override.insideLayer)
        ? override.insideLayer
        : base.insideLayer
    )
  };
}

function getCaveInsideSlots(profile) {
  if (Array.isArray(profile?.insideSlots) && profile.insideSlots.length) {
    return profile.insideSlots;
  }

  if (Array.isArray(profile?.interiorZones) && profile.interiorZones.length) {
    return profile.interiorZones.map((zone) => ({
      id: zone.id,
      x: (zone.xMin + zone.xMax) / 2,
      y: (zone.yMin + zone.yMax) / 2,
      layer: 4,
      portalIds: []
    }));
  }

  return DEFAULT_CAVE_BEHAVIOR_PROFILE.insideSlots;
}

function mapDecorLocalPointToTankNorm(item, localX, localY) {
  const bounds = getPlacedDecorBounds(item);
  if (!bounds) {
    return null;
  }

  const x = bounds.left + (bounds.right - bounds.left) * clamp(localX, 0, 1);
  const y = bounds.top + (bounds.bottom - bounds.top) * clamp(localY, 0, 1);
  return {
    xNorm: clamp(x / TANK_WIDTH, 0.08, 0.92),
    yNorm: clamp(y / TANK_HEIGHT, 0.14, 0.8)
  };
}

function getCaveInteriorContainmentDescriptor(item) {
  if (!item || !isCaveDecorKey(item.decorKey)) {
    return null;
  }

  return getCaveAllowedSpaceDescriptor(item);
}

function getCaveAllowedSpaceDescriptor(item) {
  if (!item || !isCaveDecorKey(item.decorKey)) {
    return null;
  }

  const decor = runtime.decorMap.get(item.decorKey);
  if (!decor) {
    return null;
  }

  const mask = getDerivedCaveInteriorMask(decor);
  if (!mask) {
    return null;
  }

  return createDecorShapeDescriptorFromMask(item, decor, decor.maskPath || decor.bgPath || decor.path, mask);
}

function isPointInsideCaveInteriorDescriptor(item, point) {
  if (!point) {
    return false;
  }

  const descriptor = getCaveInteriorContainmentDescriptor(item);
  if (!descriptor) {
    return true;
  }

  return pointHitsShapeDescriptor(descriptor, point.x, point.y, ALPHA_COLLISION_THRESHOLD);
}

function getCaveFrontDescriptor(item) {
  if (!item || !isCaveDecorKey(item.decorKey)) {
    return null;
  }

  return getDecorShapeDescriptor(item);
}

function getCaveShellDescriptor(item) {
  if (!item || !isCaveDecorKey(item.decorKey)) {
    return null;
  }

  const decor = runtime.decorMap.get(item.decorKey);
  if (!decor) {
    return null;
  }

  const shellMask = getDerivedCaveShellMask(decor);
  if (!shellMask) {
    return null;
  }

  return createDecorShapeDescriptorFromMask(item, decor, decor.bgPath || decor.path || decor.maskPath, shellMask);
}

function getCaveBlockingDescriptorForLayer(item, layer) {
  if (!item || !isCaveDecorKey(item.decorKey)) {
    return null;
  }

  const span = getDecorLayerSpan(item.decorKey, getDecorTankLayer(item));
  const testLayer = clampTankLayer(layer);
  if (testLayer < span.front) {
    return null;
  }

  if (testLayer === span.front) {
    return getCaveFrontDescriptor(item);
  }

  if (testLayer !== span.mid) {
    return null;
  }

  return getCaveShellDescriptor(item);
}

function doesFishFitAtCavePoint(item, fish, species, now, point, direction = null, sampleSpacingPx = CAVE_STRICT_SAMPLE_STEP_PX) {
  if (!item || !fish || !species || !point) {
    return false;
  }

  const allowedDescriptor = getCaveAllowedSpaceDescriptor(item);
  if (!allowedDescriptor) {
    return false;
  }

  const pose = getFishCollisionPose(
    fish,
    species,
    now,
    point.xNorm,
    point.yNorm,
    direction == null ? (fish.direction || 1) : direction
  );
  const fishDescriptor = getFishShapeDescriptor(fish, species, now, pose);
  if (!fishDescriptor) {
    return false;
  }

  if (!shapeContainedByMaskStrict(allowedDescriptor, fishDescriptor, sampleSpacingPx)) {
    return false;
  }

  return true;
}

function pathStaysInsideCave(
  item,
  fish,
  species,
  now,
  fromPoint,
  toPoint,
  sampleSpacingPx = CAVE_STRICT_SAMPLE_STEP_PX,
  segmentStepPx = 6
) {
  if (!item || !fish || !species || !fromPoint || !toPoint) {
    return false;
  }

  const dx = toPoint.xNorm - fromPoint.xNorm;
  const dy = toPoint.yNorm - fromPoint.yNorm;
  const distancePx = Math.hypot(dx * TANK_WIDTH, dy * TANK_HEIGHT);
  const steps = Math.max(2, Math.ceil(distancePx / Math.max(2, segmentStepPx)));
  const direction = Math.abs(dx) > 0.0001 ? (dx >= 0 ? 1 : -1) : (fish.direction || 1);

  for (let index = 1; index <= steps; index += 1) {
    const t = index / steps;
    const samplePoint = {
      xNorm: fromPoint.xNorm + dx * t,
      yNorm: fromPoint.yNorm + dy * t
    };
    if (!doesFishFitAtCavePoint(item, fish, species, now, samplePoint, direction, sampleSpacingPx)) {
      return false;
    }
  }

  return true;
}

function portalOpeningFitsFish(item, fish, species, now, mouth, direction = null) {
  if (!item || !fish || !species || !mouth) {
    return false;
  }

  const pose = getFishCollisionPose(
    fish,
    species,
    now,
    mouth.xNorm,
    mouth.yNorm,
    direction == null ? (fish.direction || 1) : direction
  );
  const fishDescriptor = getFishShapeDescriptor(fish, species, now, pose);
  if (!fishDescriptor) {
    return false;
  }

  const frontDescriptor = getCaveFrontDescriptor(item);
  if (frontDescriptor && shapesOverlapByMaskStrict(fishDescriptor, frontDescriptor, CAVE_STRICT_SAMPLE_STEP_PX)) {
    return false;
  }

  return true;
}

function buildTriggerSeatCavePlan(item, fish, now = Date.now()) {
  if (!item || !fish) {
    return null;
  }

  const species = getSpeciesForFish(fish);
  if (!species || species.behavior === "sucker" || species.caveEnabled === false) {
    return null;
  }

  const decor = runtime.decorMap.get(item.decorKey);
  if (!decor?.triggerPath) {
    return null;
  }

  const triggerRegions = getCaveTriggerRegions(item);
  const seatRegions = getCaveSeatRegions(item);
  if (!triggerRegions.length || !seatRegions.length) {
    return null;
  }

  const currentLayer = getFishTankLayer(fish);
  const profile = getCaveBehaviorProfile(item.decorKey);
  const candidates = [];
  const sourceLayer = CAVE_ALLOWED_OUTSIDE_LAYERS.includes(currentLayer) ? currentLayer : 2;
  const profileInsideLayer = clampTankLayer(profile?.insideLayer || 4);

  for (const trigger of triggerRegions) {
    if (!doesFishFitCaveRegionSize(trigger, fish, species, 0.42)) {
      continue;
    }

    const entryDirection = Math.abs(trigger.xNorm - fish.xNorm) > 0.0001
      ? (trigger.xNorm >= fish.xNorm ? 1 : -1)
      : (fish.direction || 1);

    const availableSeats = seatRegions
      .filter((seat) => !isCaveSeatOccupied(item.id, seat.id, fish.id))
      .filter((seat) => doesFishFitCaveRegionSize(seat, fish, species, 0.45))
      .filter((seat) => doesFishFitAtCavePoint(item, fish, species, now, seat, entryDirection, CAVE_PLAN_SAMPLE_STEP_PX))
      .sort((left, right) => {
        const leftScore = Math.hypot(left.xNorm - trigger.xNorm, left.yNorm - trigger.yNorm) - left.areaPx / 12000;
        const rightScore = Math.hypot(right.xNorm - trigger.xNorm, right.yNorm - trigger.yNorm) - right.areaPx / 12000;
        return leftScore - rightScore;
      });

    const seat = availableSeats[0];
    if (!seat) {
      continue;
    }
    const triggerPath = buildTriggerSeatEntryNodes(item, trigger, seat, fish, species, now);
    if (!triggerPath) {
      continue;
    }

    const distanceScore = Math.hypot(fish.xNorm - trigger.xNorm, fish.yNorm - trigger.yNorm);
    const layerPenalty = Math.abs(currentLayer - sourceLayer) * 0.08;
    const lingerMinMs = Math.max(CAVE_TRIGGER_COOLDOWN_MS + 2000, Number.isFinite(profile?.lingerMinMs) ? profile.lingerMinMs : 12000);
    const lingerMaxMs = Math.max(lingerMinMs + 2000, Number.isFinite(profile?.lingerMaxMs) ? profile.lingerMaxMs : 22000);

    candidates.push({
      decorId: item.id,
      portalId: trigger.id,
      triggerId: trigger.id,
      seatId: seat.id,
      frontLayer: sourceLayer,
      backLayer: profileInsideLayer,
      approach: {
        xNorm: trigger.xNorm,
        yNorm: trigger.yNorm
      },
      mouth: {
        xNorm: trigger.xNorm,
        yNorm: trigger.yNorm
      },
      inside: triggerPath.inside,
      entryPathNodes: triggerPath.entryPathNodes,
      exitPathNodes: triggerPath.exitPathNodes,
      lingerMs: lingerMinMs + Math.random() * Math.max(400, lingerMaxMs - lingerMinMs),
      score: distanceScore + layerPenalty
    });
  }

  candidates.sort((left, right) => left.score - right.score);
  return candidates[0] || null;
}

function buildSimpleCaveDockingPlan(item, fish, now = Date.now()) {
  const triggerSeatPlan = buildTriggerSeatCavePlan(item, fish, now);
  if (triggerSeatPlan) {
    return triggerSeatPlan;
  }

  const profile = getCaveBehaviorProfile(item.decorKey);
  if (!profile?.portals?.length) {
    return null;
  }

  const insideSlots = getCaveInsideSlots(profile);
  if (!insideSlots.length) {
    return null;
  }

  const currentLayer = getFishTankLayer(fish);
  const species = getSpeciesForFish(fish);
  if (!species) {
    return null;
  }
  const candidates = [];

  for (const portal of profile.portals) {
    const approach = mapDecorLocalPointToTankNorm(item, portal.approachX, portal.approachY);
    const mouth = mapDecorLocalPointToTankNorm(item, portal.mouthX, portal.mouthY);
    if (!approach || !mouth) {
      continue;
    }

    const portalOutsideLayer = clampTankLayer(portal.outsideLayer || 2);
    const portalInsideLayer = clampTankLayer(portal.insideLayer || profile.insideLayer || 4);
    if (!CAVE_ALLOWED_OUTSIDE_LAYERS.includes(portalOutsideLayer)) {
      continue;
    }

    const frontLayer = portalOutsideLayer;
    const backLayer = portalInsideLayer;
    const entryDirection = Math.abs(mouth.xNorm - approach.xNorm) > 0.0001
      ? (mouth.xNorm >= approach.xNorm ? 1 : -1)
      : (fish.direction || 1);
    if (!portalOpeningFitsFish(item, fish, species, now, mouth, entryDirection)) {
      continue;
    }

    const matchingSlots = insideSlots.filter((slot) => !slot.portalIds?.length || slot.portalIds.includes(portal.id));
    const slotPool = matchingSlots.length ? matchingSlots : insideSlots;

    for (const slot of slotPool) {
      const inside = mapDecorLocalPointToTankNorm(item, slot.x, slot.y);
      const slotLayer = clampTankLayer(slot.layer || portalInsideLayer);
      if (!inside) {
        continue;
      }
      if (!isPointInsideCaveInteriorDescriptor(item, inside) || !doesFishFitAtCavePoint(item, fish, species, now, inside, entryDirection, CAVE_PLAN_SAMPLE_STEP_PX)) {
        continue;
      }

      const rawEntryPathNodes = Array.isArray(portal.path)
        ? portal.path
          .map((node) => mapDecorLocalPointToTankNorm(item, node.x, node.y))
          .filter(Boolean)
        : [];
      const entryPathNodes = [];
      let previousInsidePoint = null;
      let validInsideRoute = true;

      for (const node of [...rawEntryPathNodes, inside]) {
        if (!isPointInsideCaveInteriorDescriptor(item, node) || !doesFishFitAtCavePoint(item, fish, species, now, node, entryDirection, CAVE_PLAN_SAMPLE_STEP_PX)) {
          validInsideRoute = false;
          break;
        }

        if (previousInsidePoint && !pathStaysInsideCave(item, fish, species, now, previousInsidePoint, node, CAVE_PLAN_SAMPLE_STEP_PX, CAVE_PLAN_SEGMENT_STEP_PX)) {
          validInsideRoute = false;
          break;
        }

        if (node !== inside) {
          entryPathNodes.push(node);
        }
        previousInsidePoint = node;
      }

      const firstInsidePoint = entryPathNodes[0] || inside;
      if (!validInsideRoute || !pathStaysInsideCave(item, fish, species, now, mouth, firstInsidePoint, CAVE_PLAN_SAMPLE_STEP_PX, CAVE_PLAN_SEGMENT_STEP_PX)) {
        continue;
      }

      const exitPathNodes = entryPathNodes.slice().reverse();
      const distanceScore = Math.hypot(fish.xNorm - approach.xNorm, fish.yNorm - approach.yNorm);
      const layerPenalty = Math.abs(currentLayer - frontLayer) * 0.08;

      candidates.push({
        decorId: item.id,
        portalId: portal.id,
        slotId: slot.id,
        frontLayer,
        backLayer: slotLayer,
        approach,
        mouth,
        inside,
        entryPathNodes,
        exitPathNodes,
        lingerMs: profile.lingerMinMs + Math.random() * Math.max(200, profile.lingerMaxMs - profile.lingerMinMs),
        score: distanceScore + layerPenalty
      });
    }
  }

  candidates.sort((left, right) => left.score - right.score);
  return candidates[0] || null;
}

function collectCaveBehaviorPlansForFish(fish, now = Date.now(), options = {}) {
  if (!fish) {
    return [];
  }

  const ignoreBlockedDecor = options.ignoreBlockedDecor === true;
  const plans = state.placedDecor
    .filter((item) => isCaveDecorKey(item.decorKey))
    .filter((item) => !(
      !ignoreBlockedDecor &&
      fish.blockedDecorId &&
      item.id === fish.blockedDecorId &&
      Number.isFinite(fish.blockedDecorUntil) &&
      now < fish.blockedDecorUntil
    ))
    .map((item) => buildSimpleCaveDockingPlan(item, fish, now))
    .filter(Boolean)
    .sort((left, right) => left.score - right.score);

  return plans.slice(0, MAX_VALID_CAVE_PLANS_PER_EVAL);
}

function clearFishCaveBehavior(fish) {
  if (!fish) {
    return;
  }

  runtime.activeFishCavePlans.delete(fish.id);
  fish.caveState = null;
  fish.caveDecorId = null;
  fish.cavePortalId = null;
  fish.caveTriggerId = null;
  fish.caveSeatId = null;
  fish.caveFrontLayer = null;
  fish.caveBackLayer = null;
  fish.caveApproachXNorm = null;
  fish.caveApproachYNorm = null;
  fish.caveEntryXNorm = null;
  fish.caveEntryYNorm = null;
  fish.caveInsideXNorm = null;
  fish.caveInsideYNorm = null;
  fish.caveInsideUntil = null;
  fish.cavePathIndex = null;
  fish.caveIdleTargetXNorm = null;
  fish.caveIdleTargetYNorm = null;
  fish.caveIdleTargetAt = null;
}

function getCaveBehaviorDecorById(decorId) {
  if (!decorId) {
    return null;
  }

  return state.placedDecor.find((item) => item.id === decorId) || null;
}

function getActiveFishCavePlan(fish) {
  if (!fish) {
    return null;
  }

  return runtime.activeFishCavePlans.get(fish.id) || null;
}

function getActiveFishCaveTriggerRegion(fish) {
  if (!fish?.caveDecorId) {
    return null;
  }

  const decor = getCaveBehaviorDecorById(fish.caveDecorId);
  if (!decor) {
    return null;
  }

  return findRegionById(getCaveTriggerRegions(decor), fish.caveTriggerId || fish.cavePortalId);
}

function getActiveFishCaveSeatRegion(fish) {
  if (!fish?.caveDecorId || !fish?.caveSeatId) {
    return null;
  }

  const decor = getCaveBehaviorDecorById(fish.caveDecorId);
  if (!decor) {
    return null;
  }

  return findRegionById(getCaveSeatRegions(decor), fish.caveSeatId);
}

function buildCaveNavigationCacheKey(item, frontDescriptor, barrierDescriptor) {
  const frontBounds = frontDescriptor?.bounds;
  const barrierBounds = barrierDescriptor?.bounds;
  return [
    item.id,
    item.decorKey,
    item.scale?.toFixed?.(4) ?? item.scale,
    item.xNorm?.toFixed?.(5) ?? item.xNorm,
    item.yNorm?.toFixed?.(5) ?? item.yNorm,
    getDecorTankLayer(item),
    frontBounds ? [frontBounds.left, frontBounds.top, frontBounds.right, frontBounds.bottom].map((value) => Math.round(value)).join(",") : "front",
    barrierBounds ? [barrierBounds.left, barrierBounds.top, barrierBounds.right, barrierBounds.bottom].map((value) => Math.round(value)).join(",") : "barrier"
  ].join("|");
}

function getCaveNavigationData(item) {
  if (!item || !isCaveDecorKey(item.decorKey)) {
    return null;
  }

  const frontDescriptor = getDecorShapeDescriptor(item);
  const barrierDescriptor = getCaveBarrierDescriptor(item);
  if (!frontDescriptor || !barrierDescriptor) {
    return null;
  }

  const cacheKey = buildCaveNavigationCacheKey(item, frontDescriptor, barrierDescriptor);
  const cached = runtime.caveNavCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const rect = {
    left: Math.floor(Math.min(frontDescriptor.bounds.left, barrierDescriptor.bounds.left)),
    right: Math.ceil(Math.max(frontDescriptor.bounds.right, barrierDescriptor.bounds.right)),
    top: Math.floor(Math.min(frontDescriptor.bounds.top, barrierDescriptor.bounds.top)),
    bottom: Math.ceil(Math.max(frontDescriptor.bounds.bottom, barrierDescriptor.bounds.bottom))
  };
  const widthPx = Math.max(24, rect.right - rect.left);
  const heightPx = Math.max(24, rect.bottom - rect.top);
  const cellSize = Math.max(2, Math.ceil(Math.max(widthPx, heightPx) / CAVE_NAV_MAX_SIZE));
  const cols = Math.max(12, Math.ceil(widthPx / cellSize));
  const rows = Math.max(12, Math.ceil(heightPx / cellSize));
  const total = cols * rows;
  const frontSolid = new Uint8Array(total);
  const midSolid = new Uint8Array(total);
  const mouthOpen = new Uint8Array(total);

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const index = row * cols + col;
      const worldX = rect.left + (col + 0.5) * cellSize;
      const worldY = rect.top + (row + 0.5) * cellSize;
      const hitsFront = pointHitsShapeDescriptor(frontDescriptor, worldX, worldY, ALPHA_COLLISION_THRESHOLD);
      const hitsMid = pointHitsShapeDescriptor(barrierDescriptor, worldX, worldY, ALPHA_COLLISION_THRESHOLD);
      frontSolid[index] = hitsFront ? 1 : 0;
      midSolid[index] = hitsMid ? 1 : 0;
      mouthOpen[index] = hitsMid && !hitsFront ? 1 : 0;
    }
  }

  const nav = {
    key: cacheKey,
    itemId: item.id,
    rect,
    cellSize,
    cols,
    rows,
    frontDescriptor,
    barrierDescriptor,
    frontSolid,
    midSolid,
    mouthOpen
  };

  runtime.caveNavCache.set(cacheKey, nav);
  return nav;
}

function getCaveNavIndex(nav, col, row) {
  return row * nav.cols + col;
}

function isCaveNavCellInBounds(nav, col, row) {
  return Boolean(nav && col >= 0 && row >= 0 && col < nav.cols && row < nav.rows);
}

function getCaveNavCellCenter(nav, col, row) {
  const x = nav.rect.left + (col + 0.5) * nav.cellSize;
  const y = nav.rect.top + (row + 0.5) * nav.cellSize;
  return {
    x,
    y,
    xNorm: clamp(x / TANK_WIDTH, 0.08, 0.92),
    yNorm: clamp(y / TANK_HEIGHT, 0.14, 0.8)
  };
}

function getCaveNavCellFromWorldPoint(nav, x, y) {
  if (!nav || !Number.isFinite(x) || !Number.isFinite(y)) {
    return null;
  }

  const col = Math.floor((x - nav.rect.left) / nav.cellSize);
  const row = Math.floor((y - nav.rect.top) / nav.cellSize);
  if (!isCaveNavCellInBounds(nav, col, row)) {
    return null;
  }

  return {
    col,
    row,
    index: getCaveNavIndex(nav, col, row)
  };
}

function collectCaveNavCandidatesNearWorldPoint(nav, x, y, radiusPx, predicate) {
  const center = getCaveNavCellFromWorldPoint(nav, x, y);
  if (!center) {
    return [];
  }

  const radiusCells = Math.max(1, Math.ceil(radiusPx / nav.cellSize));
  const candidates = [];

  for (let row = center.row - radiusCells; row <= center.row + radiusCells; row += 1) {
    for (let col = center.col - radiusCells; col <= center.col + radiusCells; col += 1) {
      if (!isCaveNavCellInBounds(nav, col, row)) {
        continue;
      }

      const point = getCaveNavCellCenter(nav, col, row);
      const distancePx = Math.hypot(point.x - x, point.y - y);
      if (distancePx > radiusPx) {
        continue;
      }

      const index = getCaveNavIndex(nav, col, row);
      const result = predicate(index, point, distancePx, col, row);
      if (result === false || result == null) {
        continue;
      }

      candidates.push({
        index,
        point,
        score: typeof result === "number" ? result : distancePx
      });
    }
  }

  candidates.sort((left, right) => left.score - right.score);
  return candidates;
}

function getFishDescriptorAtPoint(fish, species, now, xNorm, yNorm, directionOverride = null) {
  const pose = getFishCollisionPose(fish, species, now, xNorm, yNorm, directionOverride);
  return getFishShapeDescriptor(fish, species, now, pose);
}

function canFishOccupyCavePoint(nav, fish, species, now, xNorm, yNorm) {
  if (!nav || !fish || !species) {
    return false;
  }

  const direction = Math.abs(xNorm - fish.xNorm) > 0.001
    ? (xNorm >= fish.xNorm ? 1 : -1)
    : (fish.direction || 1);
  const fishDescriptor = getFishDescriptorAtPoint(fish, species, now, xNorm, yNorm, direction);
  if (!fishDescriptor) {
    return false;
  }

  return shapeContainedByMaskStrict(nav.barrierDescriptor, fishDescriptor, CAVE_STRICT_SAMPLE_STEP_PX);
}

function canFishOccupyCaveNavIndex(nav, index, fish, species, now, fitCache) {
  if (!nav?.midSolid?.[index]) {
    return false;
  }

  if (fitCache && fitCache[index] !== -1) {
    return fitCache[index] === 1;
  }

  const col = index % nav.cols;
  const row = Math.floor(index / nav.cols);
  const point = getCaveNavCellCenter(nav, col, row);
  const fits = canFishOccupyCavePoint(nav, fish, species, now, point.xNorm, point.yNorm);

  if (fitCache) {
    fitCache[index] = fits ? 1 : 0;
  }

  return fits;
}

function buildReachableCaveRegion(nav, mouthIndex, fish, species, now, fitCache) {
  const total = nav.cols * nav.rows;
  const visited = new Uint8Array(total);
  const parents = new Int32Array(total);
  parents.fill(-1);

  if (!canFishOccupyCaveNavIndex(nav, mouthIndex, fish, species, now, fitCache)) {
    return null;
  }

  const queue = [mouthIndex];
  visited[mouthIndex] = 1;

  for (let head = 0; head < queue.length; head += 1) {
    const index = queue[head];
    const col = index % nav.cols;
    const row = Math.floor(index / nav.cols);

    for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
      for (let colOffset = -1; colOffset <= 1; colOffset += 1) {
        if (rowOffset === 0 && colOffset === 0) {
          continue;
        }

        const nextCol = col + colOffset;
        const nextRow = row + rowOffset;
        if (!isCaveNavCellInBounds(nav, nextCol, nextRow)) {
          continue;
        }

        const nextIndex = getCaveNavIndex(nav, nextCol, nextRow);
        if (visited[nextIndex]) {
          continue;
        }

        if (rowOffset !== 0 && colOffset !== 0) {
          const sideIndexA = getCaveNavIndex(nav, nextCol, row);
          const sideIndexB = getCaveNavIndex(nav, col, nextRow);
          if (
            !canFishOccupyCaveNavIndex(nav, sideIndexA, fish, species, now, fitCache) ||
            !canFishOccupyCaveNavIndex(nav, sideIndexB, fish, species, now, fitCache)
          ) {
            continue;
          }
        }

        if (!canFishOccupyCaveNavIndex(nav, nextIndex, fish, species, now, fitCache)) {
          continue;
        }

        visited[nextIndex] = 1;
        parents[nextIndex] = index;
        queue.push(nextIndex);
      }
    }
  }

  return {
    visited,
    parents
  };
}

function buildReachableCaveClearanceMap(nav, reachable) {
  if (!nav || !reachable?.visited) {
    return null;
  }

  const total = nav.cols * nav.rows;
  const distance = new Int16Array(total);
  distance.fill(-1);
  const queue = [];

  for (let index = 0; index < total; index += 1) {
    if (!reachable.visited[index]) {
      continue;
    }

    const col = index % nav.cols;
    const row = Math.floor(index / nav.cols);
    let isBoundary = false;

    for (let rowOffset = -1; rowOffset <= 1 && !isBoundary; rowOffset += 1) {
      for (let colOffset = -1; colOffset <= 1; colOffset += 1) {
        if (rowOffset === 0 && colOffset === 0) {
          continue;
        }

        const nextCol = col + colOffset;
        const nextRow = row + rowOffset;
        if (!isCaveNavCellInBounds(nav, nextCol, nextRow)) {
          isBoundary = true;
          break;
        }

        const nextIndex = getCaveNavIndex(nav, nextCol, nextRow);
        if (!reachable.visited[nextIndex]) {
          isBoundary = true;
          break;
        }
      }
    }

    if (isBoundary) {
      distance[index] = 0;
      queue.push(index);
    }
  }

  for (let head = 0; head < queue.length; head += 1) {
    const index = queue[head];
    const col = index % nav.cols;
    const row = Math.floor(index / nav.cols);
    const nextDistance = distance[index] + 1;

    for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
      for (let colOffset = -1; colOffset <= 1; colOffset += 1) {
        if (rowOffset === 0 && colOffset === 0) {
          continue;
        }

        const nextCol = col + colOffset;
        const nextRow = row + rowOffset;
        if (!isCaveNavCellInBounds(nav, nextCol, nextRow)) {
          continue;
        }

        const nextIndex = getCaveNavIndex(nav, nextCol, nextRow);
        if (!reachable.visited[nextIndex] || distance[nextIndex] !== -1) {
          continue;
        }

        distance[nextIndex] = nextDistance;
        queue.push(nextIndex);
      }
    }
  }

  return distance;
}

function findReachableCaveInteriorTarget(nav, reachable, fish, species, now, fitCache) {
  if (!nav || !reachable?.visited) {
    return null;
  }

  let sumX = 0;
  let sumY = 0;
  let count = 0;
  let minY = Number.POSITIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;
  for (let index = 0; index < reachable.visited.length; index += 1) {
    if (!reachable.visited[index]) {
      continue;
    }

    const col = index % nav.cols;
    const row = Math.floor(index / nav.cols);
    const point = getCaveNavCellCenter(nav, col, row);
    sumX += point.x;
    sumY += point.y;
    if (point.y < minY) {
      minY = point.y;
    }
    if (point.y > maxY) {
      maxY = point.y;
    }
    count += 1;
  }

  if (!count) {
    return null;
  }

  const centerX = sumX / count;
  const centerY = sumY / count;
  const verticalSpan = Number.isFinite(minY) && Number.isFinite(maxY) ? Math.max(0, maxY - minY) : 0;
  const preferredY = clamp(
    centerY - Math.max(14, verticalSpan * 0.16),
    Number.isFinite(minY) ? minY + Math.min(18, verticalSpan * 0.08) : centerY,
    centerY
  );
  const clearanceMap = buildReachableCaveClearanceMap(nav, reachable);
  let maxClearanceCells = 0;
  if (clearanceMap) {
    for (let index = 0; index < clearanceMap.length; index += 1) {
      if (clearanceMap[index] > maxClearanceCells) {
        maxClearanceCells = clearanceMap[index];
      }
    }
  }

  const preferredClearanceCells = maxClearanceCells > 0
    ? Math.max(1, Math.floor(maxClearanceCells * 0.68))
    : 0;
  let bestIndex = -1;
  let bestScore = Number.POSITIVE_INFINITY;

  for (let index = 0; index < reachable.visited.length; index += 1) {
    if (!reachable.visited[index]) {
      continue;
    }

    if (!canFishOccupyCaveNavIndex(nav, index, fish, species, now, fitCache)) {
      continue;
    }

    const col = index % nav.cols;
    const row = Math.floor(index / nav.cols);
    const point = getCaveNavCellCenter(nav, col, row);
    const clearanceCells = clearanceMap ? Math.max(0, clearanceMap[index]) : 0;
    if (preferredClearanceCells > 0 && clearanceCells < preferredClearanceCells) {
      continue;
    }

    const centerDistance = Math.hypot(point.x - centerX, point.y - preferredY);
    const bottomPenalty = Math.max(0, point.y - preferredY) * 0.5;
    const clearanceBonus = clearanceCells * nav.cellSize * 1.6;
    const score = centerDistance + bottomPenalty - clearanceBonus;
    if (score < bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  }

  if (bestIndex < 0 && clearanceMap) {
    for (let index = 0; index < reachable.visited.length; index += 1) {
      if (!reachable.visited[index]) {
        continue;
      }

      if (!canFishOccupyCaveNavIndex(nav, index, fish, species, now, fitCache)) {
        continue;
      }

      const col = index % nav.cols;
      const row = Math.floor(index / nav.cols);
      const point = getCaveNavCellCenter(nav, col, row);
      const clearanceCells = Math.max(0, clearanceMap[index]);
      const centerDistance = Math.hypot(point.x - centerX, point.y - preferredY);
      const bottomPenalty = Math.max(0, point.y - preferredY) * 0.5;
      const clearanceBonus = clearanceCells * nav.cellSize * 1.6;
      const score = centerDistance + bottomPenalty - clearanceBonus;
      if (score < bestScore) {
        bestScore = score;
        bestIndex = index;
      }
    }
  }

  if (bestIndex < 0) {
    return null;
  }

  const col = bestIndex % nav.cols;
  const row = Math.floor(bestIndex / nav.cols);
  return {
    index: bestIndex,
    point: getCaveNavCellCenter(nav, col, row)
  };
}

function buildCavePathIndices(parents, startIndex, endIndex) {
  const path = [];
  let index = endIndex;

  while (index !== -1) {
    path.push(index);
    if (index === startIndex) {
      break;
    }
    index = parents[index];
  }

  if (!path.length || path[path.length - 1] !== startIndex) {
    return [];
  }

  return path.reverse();
}

function compressCavePathNodes(nodes) {
  if (!Array.isArray(nodes) || nodes.length <= 2) {
    return Array.isArray(nodes) ? nodes : [];
  }

  const compressed = [nodes[0]];
  let lastKept = nodes[0];

  for (let index = 1; index < nodes.length - 1; index += 1) {
    const node = nodes[index];
    if (Math.hypot(node.x - lastKept.x, node.y - lastKept.y) >= CAVE_PATH_NODE_STEP) {
      compressed.push(node);
      lastKept = node;
    }
  }

  compressed.push(nodes[nodes.length - 1]);
  return compressed.map((node) => ({
    xNorm: clamp(node.x / TANK_WIDTH, 0.08, 0.92),
    yNorm: clamp(node.y / TANK_HEIGHT, 0.14, 0.8)
  }));
}

function sanitizeGravelPebble(pebble) {
  if (!pebble) {
    return null;
  }

  const colorIndex = clamp(Math.floor(Number(pebble.colorIndex) || 0), 0, 2);
  const spriteCount = Math.max(1, runtime.gravelCatalog.length || 1);
  return {
    id: String(pebble.id || createId("gravel")),
    xNorm: clamp(Number(pebble.xNorm) || randomBetween(0.08, 0.92), 0.08, 0.92),
    yNorm: clamp(Number(pebble.yNorm) || 0.88, 0.2, 0.98),
    size: clamp(Number(pebble.size) || randomBetween(GRAVEL_PEBBLE_SIZE_MIN, GRAVEL_PEBBLE_SIZE_MAX), GRAVEL_PEBBLE_SIZE_MIN, GRAVEL_PEBBLE_SIZE_MAX + 4),
    rotation: Number.isFinite(Number(pebble.rotation)) ? Number(pebble.rotation) : randomBetween(-Math.PI, Math.PI),
    spriteIndex: ((Math.floor(Number(pebble.spriteIndex) || 0) % spriteCount) + spriteCount) % spriteCount,
    colorIndex,
    variantIndex: clamp(Math.floor(Number(pebble.variantIndex) || 0), 0, GRAVEL_VARIANT_BUCKETS - 1),
    alpha: clamp(Number(pebble.alpha) || randomBetween(0.88, 1), 0.6, 1),
    stretchY: clamp(Number(pebble.stretchY) || randomBetween(0.86, 1.18), 0.72, 1.32),
    surfaceKind: pebble.surfaceKind === "decor" ? "decor" : "floor",
    decorId: typeof pebble.decorId === "string" ? pebble.decorId : null,
    anchorRatio: clamp(Number(pebble.anchorRatio) || 0.5, 0.05, 0.95),
    liftPx: clamp(Number(pebble.liftPx) || 0, 0, GRAVEL_LIVE_LAYER_DEPTH_PX)
  };
}

function createDefaultLooseGravelPebbles(seed, placedDecor = []) {
  const rand = mulberry32((Math.abs(Math.floor(seed || 1)) || 1) ^ 0x41c64e6d);
  const spriteCount = Math.max(1, runtime.gravelCatalog.length || 1);
  const loosePebbles = [];
  const decorTargets = buildLoosePebbleDecorTargets(placedDecor);
  const decorPebbleCount = Math.min(Math.floor(GRAVEL_LIVE_PEBBLE_COUNT * 0.18), decorTargets.length * 4);

  for (let index = 0; index < GRAVEL_LIVE_PEBBLE_COUNT; index += 1) {
    const floorBiasedXNorm = clamp(0.08 + Math.pow(rand(), 0.92) * 0.84, 0.08, 0.92);
    const x = floorBiasedXNorm * TANK_WIDTH;
    const floorSurfaceY = getTankFloorSurfaceYAtX(x);
    const useDecorSurface = index < decorPebbleCount && decorTargets.length && rand() < 0.72;
    const basePebble = {
      id: createId("gravel"),
      spriteIndex: Math.floor(rand() * spriteCount),
      colorIndex: Math.floor(rand() * 3),
      variantIndex: Math.floor(rand() * GRAVEL_VARIANT_BUCKETS),
      size: randomBetweenWith(rand, GRAVEL_PEBBLE_SIZE_MIN, GRAVEL_PEBBLE_SIZE_MAX + 1.8),
      rotation: randomBetweenWith(rand, -Math.PI, Math.PI),
      alpha: randomBetweenWith(rand, 0.84, 1),
      stretchY: randomBetweenWith(rand, 0.84, 1.2)
    };

    if (useDecorSurface) {
      const decorTarget = decorTargets[Math.floor(rand() * decorTargets.length)];
      const decorProfile = getDecorPebbleProfile(decorTarget.decorKey);
      const surface = getDecorPebbleSurfacePose(
        decorTarget,
        randomBetweenWith(rand, 0.16, 0.84),
        randomBetweenWith(rand, 0, decorProfile.maxLiftPx * 0.78)
      );
      if (surface) {
        loosePebbles.push(sanitizeGravelPebble({
          ...basePebble,
          xNorm: clamp(surface.x / TANK_WIDTH, 0.08, 0.92),
          yNorm: clamp(surface.y / TANK_HEIGHT, 0.2, 0.98),
          surfaceKind: "decor",
          decorId: decorTarget.id,
          anchorRatio: surface.anchorRatio,
          liftPx: surface.liftPx
        }));
        continue;
      }
    }

    const liftPx = randomBetweenWith(rand, 0, GRAVEL_LIVE_LAYER_DEPTH_PX * 0.72);
    loosePebbles.push(sanitizeGravelPebble({
      ...basePebble,
      xNorm: floorBiasedXNorm,
      yNorm: clamp((floorSurfaceY + liftPx) / TANK_HEIGHT, 0.2, 0.98),
      surfaceKind: "floor",
      decorId: null,
      anchorRatio: 0.5,
      liftPx
    }));
  }

  return loosePebbles;
}

function reconcileLooseGravelPebbles(pebbles, placedDecor = state?.placedDecor || []) {
  if (!Array.isArray(pebbles)) {
    return [];
  }

  const nextPebbles = [];
  const seen = new Set();
  for (const rawPebble of pebbles) {
    const pebble = sanitizeGravelPebble(rawPebble);
    if (!pebble || seen.has(pebble.id)) {
      continue;
    }
    seen.add(pebble.id);

    if (pebble.surfaceKind === "decor") {
      const decorItem = placedDecor.find((item) => item.id === pebble.decorId);
      const surface = decorItem ? getDecorPebbleSurfacePose(decorItem, pebble.anchorRatio, pebble.liftPx) : null;
      if (surface) {
        pebble.xNorm = clamp(surface.x / TANK_WIDTH, 0.08, 0.92);
        pebble.yNorm = clamp(surface.y / TANK_HEIGHT, 0.2, 0.98);
        pebble.anchorRatio = surface.anchorRatio;
        pebble.liftPx = surface.liftPx;
      } else {
        pebble.surfaceKind = "floor";
        pebble.decorId = null;
        pebble.liftPx = clamp(pebble.liftPx, 0, GRAVEL_LIVE_LAYER_DEPTH_PX);
        const floorSurfaceY = getTankFloorSurfaceYAtX(pebble.xNorm * TANK_WIDTH);
        pebble.yNorm = clamp((floorSurfaceY + pebble.liftPx) / TANK_HEIGHT, 0.2, 0.98);
      }
    } else {
      pebble.surfaceKind = "floor";
      pebble.decorId = null;
      pebble.liftPx = clamp(
        Number.isFinite(Number(pebble.liftPx))
          ? Number(pebble.liftPx)
          : pebble.yNorm * TANK_HEIGHT - getTankFloorSurfaceYAtX(pebble.xNorm * TANK_WIDTH),
        0,
        GRAVEL_LIVE_LAYER_DEPTH_PX
      );
      const floorSurfaceY = getTankFloorSurfaceYAtX(pebble.xNorm * TANK_WIDTH);
      pebble.yNorm = clamp((floorSurfaceY + pebble.liftPx) / TANK_HEIGHT, 0.2, 0.98);
    }

    nextPebbles.push(pebble);
  }

  return nextPebbles;
}

function buildLoosePebbleDecorTargets(placedDecor = state?.placedDecor || []) {
  return placedDecor
    .map((item) => ({
      item,
      surface: getDecorPebbleSurfacePose(item, 0.5, 0)
    }))
    .filter((entry) => Boolean(entry.surface))
    .map((entry) => entry.item);
}

function getDecorPebbleProfile(decorKey = "") {
  const key = decorKey.toLowerCase();
  if (/(castle|cave|terracotta|bridge|arch|hide|pagoda)/.test(key)) {
    return { insetRatio: 0.16, baseHeightRatio: 0.13, maxLiftPx: 16 };
  }
  if (/(rock|shell|driftwood|root|chest)/.test(key)) {
    return { insetRatio: 0.18, baseHeightRatio: 0.1, maxLiftPx: 13 };
  }
  if (/(coral|seaweed|grass|anubias|moss|bloom|bunch)/.test(key)) {
    return { insetRatio: 0.22, baseHeightRatio: 0.075, maxLiftPx: 10 };
  }
  return { insetRatio: 0.18, baseHeightRatio: 0.09, maxLiftPx: 12 };
}

function getDecorPebbleSurfacePose(item, anchorRatio = 0.5, desiredLiftPx = 0) {
  const bounds = getPlacedDecorBounds(item);
  if (!bounds) {
    return null;
  }

  const profile = getDecorPebbleProfile(item.decorKey);
  const width = bounds.right - bounds.left;
  const height = bounds.bottom - bounds.top;
  const clampedRatio = clamp(anchorRatio, profile.insetRatio, 1 - profile.insetRatio);
  const x = bounds.left + width * clampedRatio;
  const baseHeightPx = clamp(height * profile.baseHeightRatio, 8, 24);
  const liftPx = clamp(desiredLiftPx, 0, profile.maxLiftPx);
  return {
    x,
    y: bounds.bottom - baseHeightPx + liftPx,
    anchorRatio: clampedRatio,
    liftPx,
    maxLiftPx: profile.maxLiftPx
  };
}

function getLooseGravelFloorPose(xNorm, desiredLiftPx = 0) {
  const clampedXNorm = clamp(xNorm, 0.08, 0.92);
  const x = clampedXNorm * TANK_WIDTH;
  const floorSurfaceY = getTankFloorSurfaceYAtX(x);
  const liftPx = clamp(desiredLiftPx, 0, GRAVEL_LIVE_LAYER_DEPTH_PX);
  const embeddedY = floorSurfaceY + GRAVEL_SURFACE_EMBED_PX + liftPx * 0.58;
  return {
    x,
    y: embeddedY,
    xNorm: clampedXNorm,
    yNorm: clamp(embeddedY / TANK_HEIGHT, 0.2, 0.98),
    surfaceY: floorSurfaceY,
    liftPx
  };
}

function resolveLiveGravelPebblePose(pebble) {
  if (!pebble) {
    return null;
  }

  if (pebble.surfaceKind === "decor" && pebble.decorId) {
    const decorItem = state.placedDecor.find((item) => item.id === pebble.decorId);
    const decorPose = decorItem ? getDecorPebbleSurfacePose(decorItem, pebble.anchorRatio, pebble.liftPx) : null;
    if (decorPose) {
      return { x: decorPose.x, y: decorPose.y };
    }
  }

  const floorPose = getLooseGravelFloorPose(pebble.xNorm, pebble.liftPx);
  return { x: floorPose.x, y: floorPose.y };
}

function getPebbleDropTarget(x, startY) {
  const floorPose = getLooseGravelFloorPose(x / TANK_WIDTH, randomBetween(0, GRAVEL_LIVE_LAYER_DEPTH_PX * 0.68));
  let bestTarget = {
    surfaceKind: "floor",
    decorId: null,
    anchorRatio: 0.5,
    x: floorPose.x,
    y: floorPose.y,
    xNorm: floorPose.xNorm,
    yNorm: floorPose.yNorm,
    liftPx: floorPose.liftPx
  };

  for (const item of state.placedDecor) {
    const bounds = getPlacedDecorBounds(item);
    if (!bounds) {
      continue;
    }

    const profile = getDecorPebbleProfile(item.decorKey);
    const width = bounds.right - bounds.left;
    const leftLimit = bounds.left + width * profile.insetRatio;
    const rightLimit = bounds.right - width * profile.insetRatio;
    if (x < leftLimit || x > rightLimit) {
      continue;
    }

    const candidate = getDecorPebbleSurfacePose(item, (x - bounds.left) / width, randomBetween(0, profile.maxLiftPx * 0.6));
    if (!candidate) {
      continue;
    }

    if (candidate.y + 2 < startY || candidate.y > floorPose.y + 3) {
      continue;
    }

    if (candidate.y < bestTarget.y) {
      bestTarget = {
        surfaceKind: "decor",
        decorId: item.id,
        anchorRatio: candidate.anchorRatio,
        x: candidate.x,
        y: candidate.y,
        xNorm: clamp(candidate.x / TANK_WIDTH, 0.08, 0.92),
        yNorm: clamp(candidate.y / TANK_HEIGHT, 0.2, 0.98),
        liftPx: candidate.liftPx
      };
    }
  }

  return bestTarget;
}

function findLiveGravelPebbleAtPoint(x, y) {
  const draggedId = runtime.pebbleDragState?.existingId || null;
  const candidates = [...state.gravelLivePebbles]
    .filter((pebble) => pebble.id !== draggedId)
    .map((pebble) => ({ pebble, descriptor: getPebbleShapeDescriptor(pebble) }))
    .filter((entry) => Boolean(entry.descriptor))
    .sort((left, right) => right.descriptor.pose.y - left.descriptor.pose.y);

  for (const { pebble, descriptor } of candidates) {
    if (pointHitsShapeDescriptor(descriptor, x, y)) {
      return pebble;
    }
  }

  return null;
}

function isPointNearGravelBed(x, y) {
  const floorSurfaceY = getTankFloorSurfaceYAtX(x);
  return y >= floorSurfaceY - GRAVEL_PULL_ZONE_PX && y <= TANK_HEIGHT - GLASS_MARGIN_BOTTOM + 2;
}

function createLoosePebbleFromBed(x, y) {
  return sanitizeGravelPebble({
    id: createId("gravel"),
    xNorm: clamp(x / TANK_WIDTH, 0.08, 0.92),
    yNorm: clamp(y / TANK_HEIGHT, 0.12, 0.98),
    size: randomBetween(GRAVEL_PEBBLE_SIZE_MIN, GRAVEL_PEBBLE_SIZE_MAX + 1.5),
    rotation: randomBetween(-Math.PI, Math.PI),
    spriteIndex: Math.floor(Math.random() * Math.max(1, runtime.gravelCatalog.length || 1)),
    colorIndex: Math.floor(Math.random() * 3),
    variantIndex: Math.floor(Math.random() * GRAVEL_VARIANT_BUCKETS),
    alpha: randomBetween(0.9, 1),
    stretchY: randomBetween(0.84, 1.2),
    surfaceKind: "floor",
    decorId: null,
    anchorRatio: 0.5,
    liftPx: randomBetween(0, GRAVEL_LIVE_LAYER_DEPTH_PX * 0.28)
  });
}

function beginGravelPebbleDrag(pebble, point, pointerId, options = {}) {
  if (!pebble) {
    return;
  }

  const pose = options.existing ? resolveLiveGravelPebblePose(pebble) : {
    x: pebble.xNorm * TANK_WIDTH,
    y: pebble.yNorm * TANK_HEIGHT
  };
  const dragPebble = sanitizeGravelPebble({
    ...pebble,
    xNorm: clamp((pose?.x ?? point.x) / TANK_WIDTH, 0.08, 0.92),
    yNorm: clamp((pose?.y ?? point.y) / TANK_HEIGHT, 0.12, 0.98),
    surfaceKind: "floor",
    decorId: null
  });

  runtime.pointerDown = true;
  runtime.suppressNextTankClick = true;
  runtime.pebbleDragState = {
    existingId: options.existing ? pebble.id : null,
    pebble: dragPebble,
    offsetXNorm: dragPebble.xNorm - point.x / TANK_WIDTH,
    offsetYNorm: dragPebble.yNorm - point.y / TANK_HEIGHT,
    moved: false
  };

  try {
    dom.tankStage.setPointerCapture(pointerId);
  } catch (error) {
    console.debug("Pointer capture skipped.", error);
  }

  applyLocalGravelDisturbance(point.x, point.y, {
    radiusPx: options.existing ? 34 : 72,
    force: options.existing ? 0.24 : 0.78
  });
  updateDraggedGravelPebble(point);
  renderUi(Date.now());
}

function updateDraggedGravelPebble(point) {
  const drag = runtime.pebbleDragState;
  if (!drag || !point) {
    return;
  }

  const nextXNorm = clamp(point.x / TANK_WIDTH + drag.offsetXNorm, 0.08, 0.92);
  const nextYNorm = clamp(point.y / TANK_HEIGHT + drag.offsetYNorm, 0.1, 0.96);
  const movedDistance = Math.hypot((drag.pebble.xNorm - nextXNorm) * TANK_WIDTH, (drag.pebble.yNorm - nextYNorm) * TANK_HEIGHT);
  if (movedDistance >= 3) {
    drag.moved = true;
    runtime.suppressNextTankClick = true;
  }

  drag.pebble.xNorm = nextXNorm;
  drag.pebble.yNorm = nextYNorm;
  drag.pebble.surfaceKind = "floor";
  drag.pebble.decorId = null;
}

function finalizeGravelPebbleDrag() {
  const drag = runtime.pebbleDragState;
  if (!drag) {
    return;
  }

  runtime.pebbleDragState = null;
  const now = Date.now();
  if (!drag.moved && drag.existingId) {
    renderUi(now);
    return;
  }

  const startX = drag.pebble.xNorm * TANK_WIDTH;
  const target = getPebbleDropTarget(startX, drag.pebble.yNorm * TANK_HEIGHT);
  const startY = Math.min(drag.pebble.yNorm * TANK_HEIGHT, target.y - 8);
  const landingPebble = sanitizeGravelPebble({
    ...drag.pebble,
    xNorm: target.xNorm,
    yNorm: target.yNorm,
    surfaceKind: target.surfaceKind,
    decorId: target.decorId,
    anchorRatio: target.anchorRatio,
    liftPx: target.liftPx
  });

  if (drag.existingId) {
    state.gravelLivePebbles = state.gravelLivePebbles.filter((pebble) => pebble.id !== drag.existingId);
  }

  runtime.fallingGravelPebbles.push({
    id: createId("gravel-fall"),
    pebble: landingPebble,
    startX,
    startY,
    endX: target.x,
    endY: target.y,
    driftX: randomBetween(-12, 12),
    sway: Math.random(),
    startedAt: now,
    durationMs: 1100 + Math.hypot(target.x - startX, target.y - startY) * 2.8
  });

  applyLocalGravelDisturbance(target.x, target.y, {
    radiusPx: 42,
    force: 0.36
  });
  markGravelStateDirty();

  renderUi(now);
}

function updateFallingGravelPebbles(now) {
  if (!runtime.fallingGravelPebbles.length) {
    return;
  }

  let landedAny = false;
  runtime.fallingGravelPebbles = runtime.fallingGravelPebbles.filter((falling) => {
    if (now < falling.startedAt + falling.durationMs) {
      return true;
    }

    state.gravelLivePebbles.push(falling.pebble);
    landedAny = true;
    return false;
  });

  if (landedAny) {
    state.gravelLivePebbles = reconcileLooseGravelPebbles(state.gravelLivePebbles, state.placedDecor);
    markGravelStateDirty();
  }
}

function getFallingGravelPebblePose(falling, now) {
  const progress = clamp((now - falling.startedAt) / Math.max(1, falling.durationMs), 0, 1);
  const eased = 1 - Math.pow(1 - progress, 2.1);
  const sway = Math.sin(progress * Math.PI * 2 + falling.sway * Math.PI * 2) * (1 - progress) * 5;
  return {
    x: falling.startX + (falling.endX - falling.startX) * eased + falling.driftX * (1 - progress) * 0.16 + sway,
    y: falling.startY + (falling.endY - falling.startY) * eased
  };
}

function markGravelStateDirty() {
  runtime.gravelStateDirty = true;
}

function applyLocalGravelDisturbance(originX, originY, options = {}) {
  const radiusPx = Math.max(18, Number(options.radiusPx) || 52);
  const force = clamp(Number(options.force) || 0.35, 0.05, 1.6);
  let changed = false;

  for (const pebble of state.gravelLivePebbles) {
    const pose = resolveLiveGravelPebblePose(pebble);
    if (!pose) {
      continue;
    }

    const dx = pose.x - originX;
    const dy = pose.y - originY;
    const distancePx = Math.hypot(dx, dy);
    if (distancePx > radiusPx) {
      continue;
    }

    const distanceRatio = distancePx / radiusPx;
    const falloff = 1 - distanceRatio;
    const ringLift = Math.max(0, 1 - Math.abs(distanceRatio - 0.62) / 0.24) * force * 1.55;
    const centerDip = Math.max(0, 1 - distanceRatio / 0.42) * force * 3.05;
    const unitX = distancePx > 0.01 ? dx / distancePx : (Math.random() > 0.5 ? 1 : -1);
    const horizontalPushPx = (pebble.size * 0.35 + 6) * falloff * force * (0.8 + Math.abs(unitX) * 0.6);

    if (pebble.surfaceKind === "decor" && pebble.decorId) {
      const decorItem = state.placedDecor.find((item) => item.id === pebble.decorId);
      if (!decorItem) {
        pebble.surfaceKind = "floor";
        pebble.decorId = null;
      } else {
        const profile = getDecorPebbleProfile(decorItem.decorKey);
        pebble.anchorRatio = clamp(pebble.anchorRatio + (unitX * horizontalPushPx) / 160, profile.insetRatio, 1 - profile.insetRatio);
        pebble.liftPx = clamp(pebble.liftPx + ringLift - centerDip, 0, profile.maxLiftPx);
        changed = true;
        continue;
      }
    }

    pebble.xNorm = clamp(pebble.xNorm + (unitX * horizontalPushPx) / TANK_WIDTH, 0.08, 0.92);
    pebble.liftPx = clamp(pebble.liftPx + ringLift - centerDip, 0, GRAVEL_LIVE_LAYER_DEPTH_PX);
    changed = true;
  }

  if (changed) {
    state.gravelLivePebbles = reconcileLooseGravelPebbles(state.gravelLivePebbles, state.placedDecor);
    markGravelStateDirty();
  }
}

function applyDecorGravelInsertion(item) {
  const bounds = getPlacedDecorBounds(item);
  if (!bounds) {
    return;
  }

  const width = bounds.right - bounds.left;
  const radiusPx = clamp(width * 0.44, 52, 168);
  const centerX = item.xNorm * TANK_WIDTH;
  const baseY = bounds.bottom - 4;
  applyLocalGravelDisturbance(centerX, baseY, {
    radiusPx,
    force: clamp(width / 180, 0.5, 1.15)
  });

  let changed = false;
  const profile = getDecorPebbleProfile(item.decorKey);
  for (const pebble of state.gravelLivePebbles) {
    if (pebble.surfaceKind === "decor" && pebble.decorId === item.id) {
      continue;
    }

    const pose = resolveLiveGravelPebblePose(pebble);
    if (!pose) {
      continue;
    }

    const insideFootprint = pose.x >= bounds.left && pose.x <= bounds.right && pose.y >= bounds.bottom - 32 && pose.y <= bounds.bottom + 18;
    if (!insideFootprint) {
      continue;
    }

    const footprintRatio = clamp(Math.abs(pose.x - centerX) / Math.max(18, width * 0.5), 0, 1);
    const edgeDirection = pose.x >= centerX ? 1 : -1;
    if (Math.random() < 0.18) {
      const surface = getDecorPebbleSurfacePose(item, (pose.x - bounds.left) / Math.max(1, width), randomBetween(0, profile.maxLiftPx * 0.46));
      if (surface) {
        pebble.surfaceKind = "decor";
        pebble.decorId = item.id;
        pebble.anchorRatio = surface.anchorRatio;
        pebble.liftPx = surface.liftPx;
        pebble.xNorm = clamp(surface.x / TANK_WIDTH, 0.08, 0.92);
        pebble.yNorm = clamp(surface.y / TANK_HEIGHT, 0.2, 0.98);
        changed = true;
        continue;
      }
    }

    pebble.surfaceKind = "floor";
    pebble.decorId = null;
    pebble.xNorm = clamp(pebble.xNorm + edgeDirection * (0.008 + (1 - footprintRatio) * 0.01), 0.08, 0.92);
    pebble.liftPx = clamp(pebble.liftPx + 0.9 + (1 - footprintRatio) * 1.45, 0, GRAVEL_LIVE_LAYER_DEPTH_PX);
    changed = true;
  }

  if (changed) {
    state.gravelLivePebbles = reconcileLooseGravelPebbles(state.gravelLivePebbles, state.placedDecor);
    markGravelStateDirty();
  }
}

function maybeDisturbGravelByFish(fish, species, now, moveDistance) {
  if (!fish || !species || isFishDead(fish) || moveDistance <= 0.001) {
    return;
  }

  const fishX = fish.xNorm * TANK_WIDTH;
  const fishY = fish.yNorm * TANK_HEIGHT;
  const floorY = getTankFloorSurfaceYAtX(fishX);
  if (floorY - fishY > 44) {
    return;
  }

  if (now < (fish.nextGravelDisturbAt || 0)) {
    return;
  }

  applyLocalGravelDisturbance(fishX, floorY - 4, {
    radiusPx: GRAVEL_FISH_DISTURB_RADIUS_PX + species.width * 0.08,
    force: species.behavior === "sucker" ? 0.12 : 0.2 + fish.motionLevel * 0.24
  });
  fish.nextGravelDisturbAt = now + GRAVEL_FISH_DISTURB_MS_MIN + Math.random() * (GRAVEL_FISH_DISTURB_MS_MAX - GRAVEL_FISH_DISTURB_MS_MIN);
}

function sanitizePellet(pellet) {
  if (!pellet || !Number.isFinite(pellet.createdAt) || !Number.isFinite(pellet.expiresAt)) {
    return null;
  }

  return {
    id: String(pellet.id || createId("pellet")),
    xNorm: clamp(Number(pellet.xNorm) || 0.5, 0.08, 0.92),
    yNorm: clamp(Number(pellet.yNorm) || 0.12, 0.09, 0.2),
    sway: clamp(Number(pellet.sway) || Math.random(), 0, 1),
    targetFishId: typeof pellet.targetFishId === "string" ? pellet.targetFishId : "",
    createdAt: pellet.createdAt,
    expiresAt: pellet.expiresAt
  };
}

function sanitizeEvent(entry) {
  if (!entry || typeof entry.text !== "string") {
    return null;
  }

  return {
    id: String(entry.id || createId("event")),
    time: Number.isFinite(entry.time) ? entry.time : Date.now(),
    text: entry.text
  };
}

function preloadImages(paths) {
  return Promise.all(
    [...new Set(paths)]
      .filter(Boolean)
      .map(
        (path) =>
          new Promise((resolve) => {
            const image = new Image();
            image.onload = () => {
              runtime.images.set(path, image);
              resolve();
            };
            image.onerror = () => resolve();
            image.src = path;
          })
      )
  );
}

function buildAlphaMaskFromBuffer(width, height, alphaBuffer) {
  if (!width || !height || !alphaBuffer?.length) {
    return null;
  }

  const gridWidth = ALPHA_MASK_GRID_SIZE;
  const gridHeight = ALPHA_MASK_GRID_SIZE;
  const grid = new Uint8Array(gridWidth * gridHeight);
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const alpha = alphaBuffer[(y * width + x) * 4 + 3];
      if (alpha < ALPHA_HIT_THRESHOLD) {
        continue;
      }

      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;

      const gridX = clamp(Math.floor((x / width) * gridWidth), 0, gridWidth - 1);
      const gridY = clamp(Math.floor((y / height) * gridHeight), 0, gridHeight - 1);
      grid[gridY * gridWidth + gridX] = 1;
    }
  }

  return {
    width,
    height,
    alpha: alphaBuffer,
    grid,
    gridWidth,
    gridHeight,
    bounds: maxX >= minX && maxY >= minY
      ? {
        minX,
        minY,
        maxX,
        maxY
      }
      : {
        minX: 0,
        minY: 0,
        maxX: width - 1,
        maxY: height - 1
      }
  };
}

function getImageAlphaMask(path) {
  if (!path) {
    return null;
  }

  const cached = runtime.alphaMaskCache.get(path);
  if (cached) {
    return cached;
  }

  const image = runtime.images.get(path);
  if (!image?.width || !image?.height) {
    return null;
  }

  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    return null;
  }

  context.clearRect(0, 0, image.width, image.height);
  context.drawImage(image, 0, 0);
  const imageData = context.getImageData(0, 0, image.width, image.height);
  const mask = buildAlphaMaskFromBuffer(image.width, image.height, imageData.data);
  if (!mask) {
    return null;
  }

  runtime.alphaMaskCache.set(path, mask);
  return mask;
}

function getDerivedCaveInteriorMask(decor) {
  if (!decor) {
    return null;
  }

  const cacheKey = [decor.path || "", decor.bgPath || "", decor.maskPath || ""].join("|");
  const cached = runtime.caveInteriorMaskCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  if (decor.maskPath) {
    const explicitMask = getImageAlphaMask(decor.maskPath);
    if (explicitMask) {
      runtime.caveInteriorMaskCache.set(cacheKey, explicitMask);
      return explicitMask;
    }
  }

  const bgMask = decor.bgPath ? getImageAlphaMask(decor.bgPath) : null;
  const frontMask = decor.path ? getImageAlphaMask(decor.path) : null;
  const fallbackMask = bgMask || frontMask;
  if (!fallbackMask) {
    return null;
  }

  runtime.caveInteriorMaskCache.set(cacheKey, fallbackMask);
  return fallbackMask;
}

function getDerivedCaveShellMask(decor) {
  if (!decor) {
    return null;
  }

  const cacheKey = [decor.path || "", decor.bgPath || "", decor.maskPath || ""].join("|");
  const cached = runtime.caveShellMaskCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const frontMask = decor.path ? getImageAlphaMask(decor.path) : null;
  const bgMask = decor.bgPath ? getImageAlphaMask(decor.bgPath) : null;
  const fallbackMask = bgMask || frontMask || (decor.maskPath ? getImageAlphaMask(decor.maskPath) : null);
  if (!fallbackMask) {
    return null;
  }

  if (!frontMask || !bgMask || frontMask.width !== bgMask.width || frontMask.height !== bgMask.height) {
    runtime.caveShellMaskCache.set(cacheKey, fallbackMask);
    return fallbackMask;
  }

  const alpha = new Uint8ClampedArray(frontMask.alpha.length);
  for (let index = 0; index < alpha.length; index += 4) {
    const frontAlpha = frontMask.alpha[index + 3];
    const bgAlpha = bgMask.alpha[index + 3];
    const solid = frontAlpha >= ALPHA_HIT_THRESHOLD || bgAlpha >= ALPHA_HIT_THRESHOLD;
    alpha[index] = 255;
    alpha[index + 1] = 255;
    alpha[index + 2] = 255;
    alpha[index + 3] = solid ? 255 : 0;
  }

  const shellMask = buildAlphaMaskFromBuffer(frontMask.width, frontMask.height, alpha);
  if (!shellMask) {
    return null;
  }

  runtime.caveShellMaskCache.set(cacheKey, shellMask);
  return shellMask;
}

function getMaskRegions(path, threshold = ALPHA_HIT_THRESHOLD) {
  if (!path) {
    return [];
  }

  const cacheKey = `${path}|${threshold}`;
  const cached = runtime.maskRegionCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const mask = getImageAlphaMask(path);
  if (!mask?.width || !mask?.height) {
    runtime.maskRegionCache.set(cacheKey, []);
    return [];
  }

  const width = mask.width;
  const height = mask.height;
  const visited = new Uint8Array(width * height);
  const regions = [];
  const minX = clamp(mask.bounds?.minX ?? 0, 0, width - 1);
  const maxX = clamp(mask.bounds?.maxX ?? (width - 1), 0, width - 1);
  const minY = clamp(mask.bounds?.minY ?? 0, 0, height - 1);
  const maxY = clamp(mask.bounds?.maxY ?? (height - 1), 0, height - 1);

  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const pixelIndex = y * width + x;
      if (visited[pixelIndex]) {
        continue;
      }

      visited[pixelIndex] = 1;
      if (mask.alpha[pixelIndex * 4 + 3] < threshold) {
        continue;
      }

      const queue = [pixelIndex];
      let componentMinX = x;
      let componentMaxX = x;
      let componentMinY = y;
      let componentMaxY = y;
      let sumX = 0;
      let sumY = 0;
      let count = 0;

      for (let head = 0; head < queue.length; head += 1) {
        const currentIndex = queue[head];
        const currentX = currentIndex % width;
        const currentY = Math.floor(currentIndex / width);

        if (currentX < componentMinX) {
          componentMinX = currentX;
        }
        if (currentX > componentMaxX) {
          componentMaxX = currentX;
        }
        if (currentY < componentMinY) {
          componentMinY = currentY;
        }
        if (currentY > componentMaxY) {
          componentMaxY = currentY;
        }

        sumX += currentX;
        sumY += currentY;
        count += 1;

        for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
          for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
            if (offsetX === 0 && offsetY === 0) {
              continue;
            }

            const nextX = currentX + offsetX;
            const nextY = currentY + offsetY;
            if (nextX < minX || nextX > maxX || nextY < minY || nextY > maxY) {
              continue;
            }

            const nextIndex = nextY * width + nextX;
            if (visited[nextIndex]) {
              continue;
            }

            visited[nextIndex] = 1;
            if (mask.alpha[nextIndex * 4 + 3] < threshold) {
              continue;
            }

            queue.push(nextIndex);
          }
        }
      }

      if (count < 12) {
        continue;
      }

      const centerX = sumX / count;
      const centerY = sumY / count;
      const denomX = Math.max(1, width - 1);
      const denomY = Math.max(1, height - 1);

      regions.push({
        id: `${path}#${regions.length + 1}`,
        areaPx: count,
        minX: componentMinX,
        maxX: componentMaxX,
        minY: componentMinY,
        maxY: componentMaxY,
        centerX,
        centerY,
        centerU: centerX / denomX,
        centerV: centerY / denomY,
        minU: componentMinX / denomX,
        maxU: componentMaxX / denomX,
        minV: componentMinY / denomY,
        maxV: componentMaxY / denomY
      });
    }
  }

  regions.sort((left, right) => right.areaPx - left.areaPx);
  runtime.maskRegionCache.set(cacheKey, regions);
  return regions;
}

function mapMaskRegionToTank(item, imagePath, region) {
  if (!item || !imagePath || !region) {
    return null;
  }

  const decor = runtime.decorMap.get(item.decorKey);
  const image = runtime.images.get(imagePath);
  if (!decor || !image?.width || !image?.height) {
    return null;
  }

  const width = decor.width * item.scale;
  const height = width * (image.height / image.width);
  const x = item.xNorm * TANK_WIDTH;
  const y = item.yNorm * TANK_HEIGHT;
  const left = x - width / 2;
  const top = y - height;
  const regionLeft = left + region.minU * width;
  const regionRight = left + region.maxU * width;
  const regionTop = top + region.minV * height;
  const regionBottom = top + region.maxV * height;
  const regionCenterX = left + region.centerU * width;
  const regionCenterY = top + region.centerV * height;

  return {
    ...region,
    x: regionCenterX,
    y: regionCenterY,
    xNorm: clamp(regionCenterX / TANK_WIDTH, 0.08, 0.92),
    yNorm: clamp(regionCenterY / TANK_HEIGHT, 0.14, 0.8),
    left: regionLeft,
    right: regionRight,
    top: regionTop,
    bottom: regionBottom,
    widthPx: Math.max(1, regionRight - regionLeft),
    heightPx: Math.max(1, regionBottom - regionTop)
  };
}

function getPlacedMaskRegions(item, imagePath) {
  if (!item || !imagePath) {
    return [];
  }

  return getMaskRegions(imagePath)
    .map((region) => mapMaskRegionToTank(item, imagePath, region))
    .filter(Boolean);
}

function getPseudoRegionAtPoint(item, localX, localY, id, radiusPx = 26) {
  const point = mapDecorLocalPointToTankNorm(item, localX, localY);
  if (!point) {
    return null;
  }

  const worldX = point.xNorm * TANK_WIDTH;
  const worldY = point.yNorm * TANK_HEIGHT;
  return {
    id,
    x: worldX,
    y: worldY,
    xNorm: point.xNorm,
    yNorm: point.yNorm,
    left: worldX - radiusPx,
    right: worldX + radiusPx,
    top: worldY - radiusPx,
    bottom: worldY + radiusPx,
    widthPx: radiusPx * 2,
    heightPx: radiusPx * 2,
    areaPx: radiusPx * radiusPx * Math.PI
  };
}

function getCaveTriggerRegions(item) {
  if (!item || !isCaveDecorKey(item.decorKey)) {
    return [];
  }

  const decor = runtime.decorMap.get(item.decorKey);
  if (!decor) {
    return [];
  }

  if (decor.triggerPath) {
    return getPlacedMaskRegions(item, decor.triggerPath);
  }

  const profile = getCaveBehaviorProfile(item.decorKey);
  if (!profile?.portals?.length) {
    return [];
  }

  return profile.portals
    .map((portal, index) => getPseudoRegionAtPoint(item, portal.mouthX, portal.mouthY, portal.id || `trigger-${index + 1}`))
    .filter(Boolean);
}

function getCaveSeatRegions(item) {
  if (!item || !isCaveDecorKey(item.decorKey)) {
    return [];
  }

  const decor = runtime.decorMap.get(item.decorKey);
  if (!decor) {
    return [];
  }

  if (decor.seatsPath) {
    return getPlacedMaskRegions(item, decor.seatsPath);
  }

  const profile = getCaveBehaviorProfile(item.decorKey);
  if (!profile?.insideSlots?.length) {
    return [];
  }

  return profile.insideSlots
    .map((slot, index) => getPseudoRegionAtPoint(item, slot.x, slot.y, slot.id || `seat-${index + 1}`, 22))
    .filter(Boolean);
}

function findRegionById(regions, regionId) {
  if (!Array.isArray(regions) || !regionId) {
    return null;
  }

  return regions.find((region) => region.id === regionId) || null;
}

function getFishBodySizePx(fish, species) {
  if (!fish || !species) {
    return null;
  }

  const image = runtime.images.get(species.asset);
  if (!image?.width || !image?.height) {
    return null;
  }

  const width = species.width * fish.scale;
  const height = width * (image.height / image.width);
  return {
    width,
    height,
    bodyWidth: width * 0.54,
    bodyHeight: height * 0.5,
    bodyThickness: Math.min(width * 0.5, height * 0.68)
  };
}

function doesFishFitCaveRegionSize(region, fish, species, multiplier = 1) {
  if (!region || !fish || !species) {
    return false;
  }

  if (species.caveEnabled === false) {
    return false;
  }

  const bodySize = getFishBodySizePx(fish, species);
  if (!bodySize) {
    return true;
  }

  return (
    region.widthPx >= bodySize.bodyWidth * multiplier &&
    region.heightPx >= bodySize.bodyHeight * multiplier
  );
}

function isFishWithinRegionBounds(fish, region, paddingPx = 6) {
  if (!fish || !region) {
    return false;
  }

  const x = fish.xNorm * TANK_WIDTH;
  const y = fish.yNorm * TANK_HEIGHT;
  return (
    x >= region.left - paddingPx &&
    x <= region.right + paddingPx &&
    y >= region.top - paddingPx &&
    y <= region.bottom + paddingPx
  );
}

function isCaveSeatOccupied(decorId, seatId, excludingFishId = null) {
  if (!decorId || !seatId) {
    return false;
  }

  return state.fish.some((fish) => (
    fish.id !== excludingFishId &&
    !isFishDead(fish) &&
    fish.caveDecorId === decorId &&
    fish.caveSeatId === seatId &&
    ["approach", "align", "enter", "inside", "exit", "leave"].includes(fish.caveState)
  ));
}

function pickCaveSeatIdleTarget(item, seatRegion, fish, species, now = Date.now()) {
  if (!item || !seatRegion || !fish || !species) {
    return null;
  }

  const centerPoint = {
    xNorm: seatRegion.xNorm,
    yNorm: seatRegion.yNorm
  };
  const centerFits = doesFishFitAtCavePoint(item, fish, species, now, centerPoint, fish.direction || 1);

  const maxOffsetX = Math.min(0.014, Math.max(0.003, (seatRegion.widthPx / TANK_WIDTH) * 0.18));
  const maxOffsetY = Math.min(0.012, Math.max(0.003, (seatRegion.heightPx / TANK_HEIGHT) * 0.18));
  let bestPoint = centerFits ? centerPoint : null;
  let bestScore = centerFits ? 0 : Number.POSITIVE_INFINITY;

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const point = {
      xNorm: clamp(seatRegion.xNorm + randomBetween(-maxOffsetX, maxOffsetX), 0.08, 0.92),
      yNorm: clamp(seatRegion.yNorm + randomBetween(-maxOffsetY, maxOffsetY), 0.14, 0.8)
    };
    if (!doesFishFitAtCavePoint(item, fish, species, now, point, fish.direction || 1)) {
      continue;
    }
    const score = Math.hypot(point.xNorm - seatRegion.xNorm, point.yNorm - seatRegion.yNorm);
    if (score < bestScore) {
      bestPoint = point;
      bestScore = score;
    }
  }

  return bestPoint;
}

function findCaveInteriorEntryPoint(item, triggerRegion, insidePoint, fish, species, now = Date.now()) {
  if (!item || !triggerRegion || !insidePoint || !fish || !species) {
    return null;
  }

  const triggerPoint = {
    xNorm: triggerRegion.xNorm,
    yNorm: triggerRegion.yNorm
  };

  if (doesFishFitAtCavePoint(item, fish, species, now, triggerPoint, fish.direction || 1, CAVE_PLAN_SAMPLE_STEP_PX)) {
    return triggerPoint;
  }

  const steps = 20;
  let firstValidPoint = null;

  for (let step = 1; step <= steps; step += 1) {
    const t = step / steps;
    const point = {
      xNorm: triggerPoint.xNorm + (insidePoint.xNorm - triggerPoint.xNorm) * t,
      yNorm: triggerPoint.yNorm + (insidePoint.yNorm - triggerPoint.yNorm) * t
    };
    if (!doesFishFitAtCavePoint(item, fish, species, now, point, fish.direction || 1, CAVE_PLAN_SAMPLE_STEP_PX)) {
      continue;
    }
    firstValidPoint = point;
    break;
  }

  return firstValidPoint;
}

function buildTriggerSeatEntryNodes(item, triggerRegion, seatRegion, fish, species, now = Date.now()) {
  if (!item || !triggerRegion || !seatRegion || !fish || !species) {
    return null;
  }

  const seatPoint = {
    xNorm: seatRegion.xNorm,
    yNorm: seatRegion.yNorm
  };
  const entryPoint = findCaveInteriorEntryPoint(item, triggerRegion, seatPoint, fish, species, now);
  if (!entryPoint) {
    return null;
  }

  const entryPathNodes = [entryPoint];
  let previousPoint = entryPoint;
  for (const t of [0.45, 0.72]) {
    const point = {
      xNorm: entryPoint.xNorm + (seatPoint.xNorm - entryPoint.xNorm) * t,
      yNorm: entryPoint.yNorm + (seatPoint.yNorm - entryPoint.yNorm) * t
    };
    if (!doesFishFitAtCavePoint(item, fish, species, now, point, fish.direction || 1, CAVE_PLAN_SAMPLE_STEP_PX)) {
      continue;
    }
    if (!pathStaysInsideCave(item, fish, species, now, previousPoint, point, CAVE_PLAN_SAMPLE_STEP_PX, CAVE_PLAN_SEGMENT_STEP_PX)) {
      continue;
    }
    entryPathNodes.push(point);
    previousPoint = point;
  }

  if (!pathStaysInsideCave(item, fish, species, now, previousPoint, seatPoint, CAVE_PLAN_SAMPLE_STEP_PX, CAVE_PLAN_SEGMENT_STEP_PX)) {
    return null;
  }

  return {
    inside: seatPoint,
    entryPathNodes,
    exitPathNodes: entryPathNodes.slice().reverse()
  };
}

function sampleAlphaMask(mask, u, v, threshold = ALPHA_HIT_THRESHOLD) {
  if (!mask || !Number.isFinite(u) || !Number.isFinite(v) || u < 0 || u > 1 || v < 0 || v > 1) {
    return false;
  }

  const pixelX = clamp(Math.floor(u * (mask.width - 1)), 0, mask.width - 1);
  const pixelY = clamp(Math.floor(v * (mask.height - 1)), 0, mask.height - 1);
  const bounds = mask.bounds;
  if (
    pixelX < bounds.minX ||
    pixelX > bounds.maxX ||
    pixelY < bounds.minY ||
    pixelY > bounds.maxY
  ) {
    return false;
  }

  return mask.alpha[(pixelY * mask.width + pixelX) * 4 + 3] >= threshold;
}

function sampleMaskGrid(mask, u, v) {
  if (!mask || !Number.isFinite(u) || !Number.isFinite(v) || u < 0 || u > 1 || v < 0 || v > 1) {
    return false;
  }

  const gridX = clamp(Math.floor(u * mask.gridWidth), 0, mask.gridWidth - 1);
  const gridY = clamp(Math.floor(v * mask.gridHeight), 0, mask.gridHeight - 1);
  return mask.grid[gridY * mask.gridWidth + gridX] === 1;
}

function pointHitsShapeDescriptor(descriptor, x, y, threshold = ALPHA_HIT_THRESHOLD) {
  if (!descriptor || !descriptor.bounds) {
    return false;
  }

  const { bounds } = descriptor;
  if (x < bounds.left || x > bounds.right || y < bounds.top || y > bounds.bottom) {
    return false;
  }

  const uv = descriptor.worldToUv(x, y);
  if (!uv) {
    return false;
  }

  return sampleAlphaMask(descriptor.mask, uv.u, uv.v, threshold);
}

function shapesOverlapByMask(leftDescriptor, rightDescriptor, sampleSpacingPx = 10) {
  if (!leftDescriptor || !rightDescriptor || !leftDescriptor.bounds || !rightDescriptor.bounds) {
    return false;
  }

  if (!boundsIntersect(leftDescriptor.bounds, rightDescriptor.bounds)) {
    return false;
  }

  const overlapLeft = Math.max(leftDescriptor.bounds.left, rightDescriptor.bounds.left);
  const overlapRight = Math.min(leftDescriptor.bounds.right, rightDescriptor.bounds.right);
  const overlapTop = Math.max(leftDescriptor.bounds.top, rightDescriptor.bounds.top);
  const overlapBottom = Math.min(leftDescriptor.bounds.bottom, rightDescriptor.bounds.bottom);
  const width = overlapRight - overlapLeft;
  const height = overlapBottom - overlapTop;
  if (width <= 0 || height <= 0) {
    return false;
  }

  const step = Math.max(4, Math.min(sampleSpacingPx, Math.max(width, height) / 2));
  for (let y = overlapTop + step * 0.5; y < overlapBottom; y += step) {
    for (let x = overlapLeft + step * 0.5; x < overlapRight; x += step) {
      const leftUv = leftDescriptor.worldToUv(x, y);
      const rightUv = rightDescriptor.worldToUv(x, y);
      if (!leftUv || !rightUv) {
        continue;
      }

      if (!sampleMaskGrid(leftDescriptor.mask, leftUv.u, leftUv.v) || !sampleMaskGrid(rightDescriptor.mask, rightUv.u, rightUv.v)) {
        continue;
      }

      if (
        sampleAlphaMask(leftDescriptor.mask, leftUv.u, leftUv.v, ALPHA_COLLISION_THRESHOLD) &&
        sampleAlphaMask(rightDescriptor.mask, rightUv.u, rightUv.v, ALPHA_COLLISION_THRESHOLD)
      ) {
        return true;
      }
    }
  }

  return false;
}

function shapeContainedByMask(containerDescriptor, innerDescriptor, sampleSpacingPx = 8) {
  if (!containerDescriptor || !innerDescriptor || !containerDescriptor.bounds || !innerDescriptor.bounds) {
    return false;
  }

  if (
    innerDescriptor.bounds.left < containerDescriptor.bounds.left ||
    innerDescriptor.bounds.right > containerDescriptor.bounds.right ||
    innerDescriptor.bounds.top < containerDescriptor.bounds.top ||
    innerDescriptor.bounds.bottom > containerDescriptor.bounds.bottom
  ) {
    return false;
  }

  const width = innerDescriptor.bounds.right - innerDescriptor.bounds.left;
  const height = innerDescriptor.bounds.bottom - innerDescriptor.bounds.top;
  if (width <= 0 || height <= 0) {
    return false;
  }

  const step = Math.max(4, Math.min(sampleSpacingPx, Math.max(width, height) / 2));
  let sampledSolidPixel = false;

  for (let y = innerDescriptor.bounds.top + step * 0.5; y < innerDescriptor.bounds.bottom; y += step) {
    for (let x = innerDescriptor.bounds.left + step * 0.5; x < innerDescriptor.bounds.right; x += step) {
      const innerUv = innerDescriptor.worldToUv(x, y);
      if (!innerUv) {
        continue;
      }

      if (!sampleMaskGrid(innerDescriptor.mask, innerUv.u, innerUv.v)) {
        continue;
      }

      if (!sampleAlphaMask(innerDescriptor.mask, innerUv.u, innerUv.v, ALPHA_COLLISION_THRESHOLD)) {
        continue;
      }

      sampledSolidPixel = true;
      const containerUv = containerDescriptor.worldToUv(x, y);
      if (!containerUv) {
        return false;
      }

      if (!sampleAlphaMask(containerDescriptor.mask, containerUv.u, containerUv.v, ALPHA_COLLISION_THRESHOLD)) {
        return false;
      }
    }
  }

  return sampledSolidPixel;
}

function shapesOverlapByMaskStrict(leftDescriptor, rightDescriptor, sampleSpacingPx = CAVE_STRICT_SAMPLE_STEP_PX) {
  if (!leftDescriptor || !rightDescriptor || !leftDescriptor.bounds || !rightDescriptor.bounds) {
    return false;
  }

  if (!boundsIntersect(leftDescriptor.bounds, rightDescriptor.bounds)) {
    return false;
  }

  const overlapLeft = Math.max(leftDescriptor.bounds.left, rightDescriptor.bounds.left);
  const overlapRight = Math.min(leftDescriptor.bounds.right, rightDescriptor.bounds.right);
  const overlapTop = Math.max(leftDescriptor.bounds.top, rightDescriptor.bounds.top);
  const overlapBottom = Math.min(leftDescriptor.bounds.bottom, rightDescriptor.bounds.bottom);
  if (overlapRight <= overlapLeft || overlapBottom <= overlapTop) {
    return false;
  }

  const step = Math.max(1, sampleSpacingPx);
  for (let y = overlapTop; y <= overlapBottom; y += step) {
    for (let x = overlapLeft; x <= overlapRight; x += step) {
      const leftUv = leftDescriptor.worldToUv(x, y);
      const rightUv = rightDescriptor.worldToUv(x, y);
      if (!leftUv || !rightUv) {
        continue;
      }

      if (
        sampleAlphaMask(leftDescriptor.mask, leftUv.u, leftUv.v, ALPHA_COLLISION_THRESHOLD) &&
        sampleAlphaMask(rightDescriptor.mask, rightUv.u, rightUv.v, ALPHA_COLLISION_THRESHOLD)
      ) {
        return true;
      }
    }
  }

  return false;
}

function shapeContainedByMaskStrict(containerDescriptor, innerDescriptor, sampleSpacingPx = CAVE_STRICT_SAMPLE_STEP_PX) {
  if (!containerDescriptor || !innerDescriptor || !containerDescriptor.bounds || !innerDescriptor.bounds) {
    return false;
  }

  if (
    innerDescriptor.bounds.left < containerDescriptor.bounds.left ||
    innerDescriptor.bounds.right > containerDescriptor.bounds.right ||
    innerDescriptor.bounds.top < containerDescriptor.bounds.top ||
    innerDescriptor.bounds.bottom > containerDescriptor.bounds.bottom
  ) {
    return false;
  }

  const step = Math.max(1, sampleSpacingPx);
  let sampledSolidPixel = false;

  for (let y = innerDescriptor.bounds.top; y <= innerDescriptor.bounds.bottom; y += step) {
    for (let x = innerDescriptor.bounds.left; x <= innerDescriptor.bounds.right; x += step) {
      const innerUv = innerDescriptor.worldToUv(x, y);
      if (!innerUv) {
        continue;
      }

      if (!sampleAlphaMask(innerDescriptor.mask, innerUv.u, innerUv.v, ALPHA_COLLISION_THRESHOLD)) {
        continue;
      }

      sampledSolidPixel = true;
      const containerUv = containerDescriptor.worldToUv(x, y);
      if (!containerUv) {
        return false;
      }

      if (!sampleAlphaMask(containerDescriptor.mask, containerUv.u, containerUv.v, ALPHA_COLLISION_THRESHOLD)) {
        return false;
      }
    }
  }

  return sampledSolidPixel;
}

function createDecorShapeDescriptorFromMask(item, decor, imagePath, mask) {
  const image = runtime.images.get(imagePath);
  if (!image || !mask) {
    return null;
  }

  const width = decor.width * item.scale;
  const height = width * (image.height / image.width);
  const x = item.xNorm * TANK_WIDTH;
  const y = item.yNorm * TANK_HEIGHT;
  const left = x - width / 2;
  const top = y - height;

  return {
    mask,
    bounds: {
      left,
      right: left + width,
      top,
      bottom: top + height
    },
    worldToUv(worldX, worldY) {
      return {
        u: (worldX - left) / width,
        v: (worldY - top) / height
      };
    }
  };
}

function tick() {
  const now = Date.now();
  const changed = syncState(now) || runtime.gravelStateDirty;
  renderTickUi(now, { stateChanged: changed });
  if (changed) {
    saveState();
    runtime.gravelStateDirty = false;
  }
}

function renderTickUi(now, options = {}) {
  const stateChanged = Boolean(options.stateChanged);
  renderHeader(now);
  renderMealTrack(now);
  renderFishInspector(now);
  renderControls(now);
  if (stateChanged) {
    renderSummary(now);
    renderEvents();
    renderStoreOverlay();
    renderVisiblePanels(now);
  }
  positionToast();
}

function renderVisiblePanels(now) {
  const showingFishTab = runtime.activeTab === "fish" || runtime.selectedFishId !== null || runtime.fishEditMode;
  const showingDecorTab = runtime.activeTab === "decor" || runtime.editTankMode;
  const showingFishStore = runtime.storeOverlayOpen && runtime.storeTab === "fish";
  const showingDecorStore = runtime.storeOverlayOpen && runtime.storeTab === "decor";

  if (showingFishTab) {
    renderFishList(now);
  }

  if (showingFishStore) {
    renderFishShop();
  }

  if (showingDecorStore) {
    renderDecorShop();
  }

  if (showingDecorTab) {
    renderDecorInventory();
    renderPlacedDecor();
    renderBackgrounds();
    renderTankAssets();
    renderFilterAssets();
    renderGravelAssets();
  }

  if (showingFishTab || showingDecorTab) {
    renderCollapsibleSections();
  }
}

function syncState(now) {
  if (!state) {
    return false;
  }

  let changed = false;
  if (now < state.lastSimulatedAt) {
    state.lastSimulatedAt = now;
    changed = true;
  }

  const completedSlots = getCompletedMealSlots(state.lastSimulatedAt, now);
  for (const slot of completedSlots) {
    const wasFed = Boolean(state.feedHistory[slot.key]);
    let missedCount = 0;
    let recoveredCount = 0;
    let deathCount = 0;

    for (const fish of state.fish) {
      if (fish.acquiredAt > slot.start || isFishDead(fish) || !fishNeedsMealWindow(fish)) {
        continue;
      }

      if (wasFed) {
        fish.fedStreak += 1;
        if (fish.healthUnits < MAX_HEALTH_UNITS && fish.fedStreak >= RECOVERY_FEED_STREAK) {
          fish.healthUnits += 1;
          fish.fedStreak = 0;
          recoveredCount += 1;
        }
      } else {
        fish.healthUnits = Math.max(0, fish.healthUnits - 1);
        fish.fedStreak = 0;
        missedCount += 1;
        if (fish.healthUnits <= 0 && markFishAsDead(fish, slot.end, `${fish.name} died after missing too many meals.`)) {
          deathCount += 1;
        }
      }
    }

    if (!wasFed && missedCount > 0) {
      pushEvent(`${missedCount} fish skipped the ${slot.label.toLowerCase()} meal and lost half a heart.`, slot.end);
    }

    if (wasFed && recoveredCount > 0) {
      pushEvent(`${recoveredCount} fish recovered half a heart thanks to regular feeding.`, slot.end);
    }

    if (deathCount > 0) {
      pushEvent(`${deathCount} ${pluralize("fish", deathCount)} died and floated to the surface.`, slot.end);
    }

    changed = changed || missedCount > 0 || recoveredCount > 0 || deathCount > 0;
  }

  const droppedPoops = [];
  state.pendingPoops = state.pendingPoops.filter((poop) => {
    if (poop.dueAt <= now) {
      const fish = state.fish.find((entry) => entry.id === poop.fishId);
      if (!fish || isFishDead(fish)) {
        return false;
      }
      state.poops.push({
        id: poop.id,
        fishId: poop.fishId,
        createdAt: poop.dueAt,
        xNorm: clamp((fish?.xNorm ?? randomSwimX()) + (Math.random() - 0.5) * 0.06, 0.08, 0.92),
        yNorm: 0.84 + Math.random() * 0.05,
        startYNorm: fish ? clamp(fish.yNorm + 0.04, 0.14, 0.8) : randomSwimY()
      });
      droppedPoops.push(poop);
      return false;
    }

    return true;
  });

  if (droppedPoops.length > 0) {
    pushEvent(`${droppedPoops.length} little fishy ${pluralize("poop", droppedPoops.length)} plopped onto the tank floor.`, now);
    changed = true;
  }

  const pelletsBefore = state.floatingPellets.length;
  state.floatingPellets = state.floatingPellets.filter((pellet) => pellet.expiresAt > now);
  for (const fish of state.fish) {
    if (fish.feedingPelletId && !state.floatingPellets.some((pellet) => pellet.id === fish.feedingPelletId)) {
      fish.feedingPelletId = null;
      if (!isFishDead(fish)) {
        fish.activity = "roam";
        fish.targetAt = now + 1200 + Math.random() * 1800;
      }
    }
  }
  changed = changed || pelletsBefore !== state.floatingPellets.length;

  changed = processDetritusFish(now) || changed;
  changed = applyCorpseSickness(now) || changed;

  pruneState(now, state);
  state.lastSimulatedAt = now;
  return changed || completedSlots.length > 0;
}

function pruneState(now, target = state) {
  const historyCutoff = now - 45 * DAY_MS;
  for (const [key, value] of Object.entries(target.feedHistory)) {
    if (value.fedAt < historyCutoff) {
      delete target.feedHistory[key];
    }
  }

  target.pendingPoops = target.pendingPoops.filter((poop) => (poop.dueAt || 0) >= now - DAY_MS);
  target.poops = target.poops.filter((poop) => (poop.createdAt || 0) >= target.lastCleanedAt);
  target.floatingPellets = target.floatingPellets.filter((pellet) => pellet.expiresAt > now - 5 * 60 * 1000);
  target.gravelLivePebbles = [];
  target.events = target.events.slice(0, 12);
}

function applyCorpseSickness(now) {
  const deadFish = getDeadTankFish();
  if (!deadFish.length) {
    if (state.lastCorpseSicknessAt !== null) {
      state.lastCorpseSicknessAt = null;
      return true;
    }
    return false;
  }

  const earliestDeadAt = Math.min(...deadFish.map((fish) => Number.isFinite(fish.deadAt) ? fish.deadAt : now));
  let anchor = Number.isFinite(state.lastCorpseSicknessAt) ? Math.max(state.lastCorpseSicknessAt, earliestDeadAt) : earliestDeadAt;
  let changed = anchor !== state.lastCorpseSicknessAt;
  const elapsedDays = Math.floor((now - anchor) / DAY_MS);
  if (elapsedDays <= 0) {
    state.lastCorpseSicknessAt = anchor;
    return changed;
  }

  for (let dayIndex = 0; dayIndex < elapsedDays; dayIndex += 1) {
    const tickAt = anchor + DAY_MS;
    const livingFish = getLivingTankFish();
    let sickCount = 0;
    let deathCount = 0;

    for (const fish of livingFish) {
      fish.healthUnits = Math.max(0, fish.healthUnits - 1);
      fish.fedStreak = 0;
      sickCount += 1;
      if (fish.healthUnits <= 0 && markFishAsDead(fish, tickAt, `${fish.name} got sick from a dead tankmate and died.`)) {
        deathCount += 1;
      }
    }

    if (sickCount > 0) {
      pushEvent(`A dead fish was left in the tank too long. ${sickCount} ${pluralize("fish", sickCount)} got sick and lost half a heart.`, tickAt);
      changed = true;
    }
    if (deathCount > 0) {
      changed = true;
    }

    anchor = tickAt;
  }

  state.lastCorpseSicknessAt = anchor;
  return changed;
}

function processDetritusFish(now) {
  let changed = false;

  for (const fish of state.fish) {
    const species = getSpeciesForFish(fish);
    if (!species || !isDetritusFish(species) || isFishDead(fish)) {
      continue;
    }

    if (now < (fish.nextDetritusSnackAt || 0)) {
      continue;
    }

    const nearbyPoopIndex = state.poops.findIndex((poop) => Math.abs((poop.xNorm || 0.5) - fish.xNorm) <= 0.18);
    if (nearbyPoopIndex !== -1) {
      state.poops.splice(nearbyPoopIndex, 1);
      changed = true;
    } else {
      const dirtiness = getBaseTankDirtiness(now);
      if (dirtiness > 0.03) {
        state.lastCleanedAt = Math.min(now, state.lastCleanedAt + species.cleanupStrength * HOUR_MS);
        changed = true;
      }
    }

    fish.nextDetritusSnackAt = now + species.cleanupMinMs + Math.random() * Math.max(1000, species.cleanupMaxMs - species.cleanupMinMs);
  }

  return changed;
}

function feedFish() {
  const now = Date.now();
  syncState(now);
  const livingFish = getLivingTankFish();
  const feedableFish = getFeedableLivingFish();

  if (!state.fish.length) {
    showToast("Buy a fish first so there is somebody to feed.");
    return;
  }

  if (!livingFish.length) {
    showToast("There are no living fish left to feed.");
    return;
  }

  if (!feedableFish.length) {
    showToast("Only sucker fish are in the tank right now. They graze on grime and poop instead of pellets.");
    return;
  }

  const slot = getCurrentMealSlot(now);
  if (state.feedHistory[slot.key]) {
    showToast("This meal is already served.");
    return;
  }

  let earnedCoins = 0;
  for (const fish of feedableFish) {
    const species = runtime.fishMap.get(fish.speciesId);
    earnedCoins += species.mealCoins;
    state.pendingPoops.push({
      id: createId("poop"),
      fishId: fish.id,
      dueAt: now + HOUR_MS + Math.random() * (2 * HOUR_MS)
    });
  }

  state.coins += earnedCoins;
  state.floatingPellets = createFloatingPellets(now, feedableFish);
  for (const fish of feedableFish) {
    const pellet = state.floatingPellets.find((entry) => entry.targetFishId === fish.id);
    if (!pellet) {
      continue;
    }

    fish.activity = "feeding";
    fish.feedingPelletId = pellet.id;
    fish.targetAt = now + 4 * 60 * 1000;
    fish.targetXNorm = pellet.xNorm;
    fish.targetYNorm = pellet.yNorm;
  }
  state.feedHistory[slot.key] = {
    fedAt: now,
    coinsEarned: earnedCoins
  };

  pushEvent(`Fed ${feedableFish.length} fish for ${earnedCoins} ${pluralize("coin", earnedCoins)}.`, now);
  saveState();
  renderUi(now);
  showToast(`Meal served. +${earnedCoins} coins.`);
}

function createFloatingPellets(now, fishList) {
  return fishList.map((fish, index) => ({
    id: createId(`pellet-${index}`),
    targetFishId: fish.id,
    xNorm: clamp(fish.xNorm + (Math.random() - 0.5) * 0.05, 0.12, 0.88),
    yNorm: 0.114 + Math.random() * 0.018,
    sway: Math.random(),
    createdAt: now,
    expiresAt: now + 10 * 60 * 1000
  }));
}

function getResaleValue(cost) {
  const price = Math.max(1, Math.floor(Number(cost) || 0));

  if (price <= 1) {
    return 1;
  }

  if (price <= 3) {
    return price - 1;
  }

  return Math.max(1, Math.floor(price * 0.75));
}

function buyFish(speciesId) {
  const species = runtime.fishMap.get(speciesId);
  if (!species) {
    return;
  }

  const purchaseCost = getFishPurchaseCost(speciesId);
  if (state.coins < purchaseCost) {
    showToast(`You need ${purchaseCost} ${pluralize("coin", purchaseCost)} for a ${species.name}.`);
    return;
  }

  state.coins -= purchaseCost;
  const takenNames = state.fish.map((fish) => fish.name);
  const fish = {
    id: createId("fish"),
    speciesId,
    name: buildFishName(speciesId, takenNames),
    acquiredAt: Date.now(),
    deadAt: null,
    healthUnits: MAX_HEALTH_UNITS,
    fedStreak: 0,
    xNorm: randomSwimX(),
    yNorm: randomSwimY(),
    targetXNorm: randomSwimX(),
    targetYNorm: randomSwimY(),
    targetAt: Date.now() + species.targetMinMs + Math.random() * (species.targetMaxMs - species.targetMinMs),
    direction: Math.random() > 0.5 ? 1 : -1,
    swimSpeed: normalizeFishSpeed(species),
    phase: Math.random(),
    motionLevel: 0.2,
    wiggleClock: Math.random() * Math.PI * 2,
    scale: getFishScaleDefault(speciesId),
    activity: "roam",
    feedingPelletId: null,
    tankLayer: species.behavior === "sucker" ? TANK_DEPTH_LAYERS : clampTankLayer(1 + Math.floor(Math.random() * TANK_DEPTH_LAYERS)),
    desiredTankLayer: species.behavior === "sucker" ? TANK_DEPTH_LAYERS : DEFAULT_TANK_LAYER,
    drawLayer: "front",
    desiredDrawLayer: "front",
    hangoutDecorId: null,
    nextDetritusSnackAt: Date.now() + species.cleanupMinMs,
    displayDirection: Math.random() > 0.5 ? 1 : -1,
    displayAngle: 0,
    turnStartedAt: null,
    turnDurationMs: 0,
    turnFromDirection: 1,
    turnToDirection: 1,
    turnFromAngle: 0,
    turnToAngle: 0,
    turnSpinDirection: 1,
    caveState: null,
    caveDecorId: null,
    cavePortalId: null,
    caveTriggerId: null,
    caveSeatId: null,
    caveFrontLayer: null,
    caveBackLayer: null,
    caveApproachXNorm: null,
    caveApproachYNorm: null,
    caveEntryXNorm: null,
    caveEntryYNorm: null,
    caveInsideXNorm: null,
    caveInsideYNorm: null,
    caveInsideUntil: null,
    caveTriggerCooldownUntil: null,
    cavePathIndex: null,
    caveIdleTargetXNorm: null,
    caveIdleTargetYNorm: null,
    caveIdleTargetAt: null
  };
  fish.direction = fish.displayDirection;
  fish.displayAngle = fish.displayDirection < 0 ? Math.PI : 0;
  fish.turnFromDirection = fish.displayDirection;
  fish.turnToDirection = fish.displayDirection;
  fish.turnFromAngle = fish.displayAngle;
  fish.turnToAngle = fish.displayAngle;
  fish.turnSpinDirection = fish.displayDirection < 0 ? 1 : -1;
  setFishTankLayers(fish, fish.tankLayer, fish.tankLayer);

  state.fish.push(fish);
  pushEvent(`${fish.name} the ${species.name} splashed into the tank.`, fish.acquiredAt);
  saveState();
  renderUi(Date.now());
  showToast(`${fish.name} joined the aquarium.`);
}

function buyDecor(decorKey) {
  const decor = runtime.decorMap.get(decorKey);
  if (!decor) {
    return;
  }

  if (state.coins < decor.cost) {
    showToast(`You need ${decor.cost} coins for ${decor.name}.`);
    return;
  }

  state.coins -= decor.cost;
  state.decorInventory[decorKey] = (state.decorInventory[decorKey] || 0) + 1;
  pushEvent(`Bought ${decor.name}.`, Date.now());
  saveState();
  renderUi(Date.now());
  showToast(`${decor.name} is waiting in storage.`);
}

function startPlacingDecor(decorKey) {
  if (!state.decorInventory[decorKey]) {
    return;
  }

  if (runtime.placementMode?.decorKey === decorKey) {
    runtime.placementMode = null;
    runtime.placementPreview = null;
    renderUi(Date.now());
    showToast("Placement preview cleared.");
    return;
  }

  const initialLayer = getDecorFrontLayer(decorKey, runtime.decorPlacementLayer);
  const span = getDecorLayerSpan(decorKey, initialLayer);

  runtime.editTankMode = true;
  runtime.fishEditMode = false;
  runtime.placementMode = {
    decorKey,
    tankLayer: initialLayer,
    scale: getDecorScaleDefault(decorKey)
  };
  runtime.placementPreview = runtime.lastTankPoint
    ? clampDecorPlacement(runtime.lastTankPoint.x / TANK_WIDTH, runtime.lastTankPoint.y / TANK_HEIGHT, {
      decorKey,
      scale: runtime.placementMode.scale
    })
    : clampDecorPlacement(0.5, 0.8, {
      decorKey,
      scale: runtime.placementMode.scale
    });
  runtime.cleaningMode = false;
  runtime.dragState = null;
  runtime.fishDragState = null;
  runtime.activeTab = "decor";
  runtime.sidebarCollapsed = true;
  renderUi(Date.now());

  showToast(
    isCaveDecorKey(decorKey)
      ? `Move over the tank to preview it, then click to place. Z/X changes cave range (${span.label}).`
      : `Move over the tank to preview it, then click to place. Z/X changes layer (${initialLayer}/5).`
  );
}

function createPlacedDecor(decorKey, xNorm, yNorm, tankLayer = runtime.placementMode?.tankLayer ?? runtime.decorPlacementLayer) {
  if (!state.decorInventory[decorKey]) {
    return null;
  }

  const decor = runtime.decorMap.get(decorKey);
  const scaleBase = clamp(Number(runtime.placementMode?.scale) || getDecorScaleDefault(decorKey), DECOR_SCALE_MIN, DECOR_SCALE_MAX);
  const placement = clampDecorPlacement(xNorm, yNorm, {
    decorKey,
    scale: scaleBase
  });
  const finalLayer = getDecorFrontLayer(decorKey, tankLayer);

  state.decorInventory[decorKey] -= 1;
  if (state.decorInventory[decorKey] <= 0) {
    delete state.decorInventory[decorKey];
  }

  const placedItem = {
    id: createId("placed"),
    decorKey,
    xNorm: placement.xNorm,
    yNorm: placement.yNorm,
    scale: scaleBase,
    tankLayer: finalLayer
  };

  state.placedDecor.push(placedItem);
  applyDecorGravelInsertion(placedItem);
  return { decor, placedItem };
}

function placeDecorAtPoint(xNorm, yNorm) {
  const placement = runtime.placementMode;
  if (!placement) {
    return;
  }

  if (!state.decorInventory[placement.decorKey]) {
    runtime.placementMode = null;
    runtime.placementPreview = null;
    renderUi(Date.now());
    return;
  }

  const created = createPlacedDecor(placement.decorKey, xNorm, yNorm, placement.tankLayer);
  if (!created) {
    runtime.placementMode = null;
    runtime.placementPreview = null;
    renderUi(Date.now());
    return;
  }

  runtime.placementMode = null;
  runtime.placementPreview = null;
  runtime.suppressNextTankClick = true;
  const now = Date.now();
  pushEvent(`Placed ${created.decor?.name || titleFromFile(created.placedItem.decorKey)} in the aquarium.`, now);
  saveState();
  renderUi(now);
  showToast(`${created.decor?.name || "Decor"} placed.`);
}

function stepActiveDecorLayer(direction) {
  const step = Number(direction) || 0;
  if (!step) {
    return false;
  }

  let changed = false;
  let nextLayer = runtime.decorPlacementLayer;

  if (runtime.placementMode) {
    const decorKey = runtime.placementMode.decorKey;
    const currentLayer = runtime.placementMode.tankLayer || runtime.decorPlacementLayer;
    runtime.placementMode.tankLayer = getDecorFrontLayer(decorKey, currentLayer + step);
    nextLayer = runtime.placementMode.tankLayer;
    changed = true;
  }

  if (runtime.dragState) {
    const item = state.placedDecor.find((placed) => placed.id === runtime.dragState.placedId);
    if (item) {
      const currentLayer = runtime.dragState.tankLayer || item.tankLayer || DEFAULT_TANK_LAYER;
      const itemLayer = getDecorFrontLayer(item.decorKey, currentLayer + step);
      runtime.dragState.tankLayer = itemLayer;
      item.tankLayer = itemLayer;
      nextLayer = itemLayer;
      changed = true;
    }
  }

  if (!changed) {
    return false;
  }

  runtime.decorPlacementLayer = nextLayer;
  renderUi(Date.now());
  return true;
}

function stepActiveDecorScale(direction) {
  const step = Number(direction) || 0;
  if (!step) {
    return null;
  }

  let changed = false;
  let nextScale = null;

  if (runtime.placementMode) {
    const decorKey = runtime.placementMode.decorKey;
    const currentScale = Number(runtime.placementMode.scale) || getDecorScaleDefault(decorKey);
    const placementScale = clamp(currentScale + step * SIZE_STEP, DECOR_SCALE_MIN, DECOR_SCALE_MAX);
    if (placementScale !== currentScale) {
      runtime.placementMode.scale = placementScale;
      if (runtime.placementPreview) {
        runtime.placementPreview = clampDecorPlacement(runtime.placementPreview.xNorm, runtime.placementPreview.yNorm, {
          decorKey,
          scale: placementScale
        });
      }
      nextScale = placementScale;
      changed = true;
    }
  }

  if (runtime.dragState) {
    const item = state.placedDecor.find((placed) => placed.id === runtime.dragState.placedId);
    if (item) {
      const currentScale = Number(item.scale) || getDecorScaleDefault(item.decorKey);
      const itemScale = clamp(currentScale + step * SIZE_STEP, DECOR_SCALE_MIN, DECOR_SCALE_MAX);
      if (itemScale !== currentScale) {
        item.scale = itemScale;
        const placement = clampDecorPlacement(item.xNorm, item.yNorm, {
          item
        });
        item.xNorm = placement.xNorm;
        item.yNorm = placement.yNorm;
        nextScale = itemScale;
        changed = true;
      }
    }
  }

  if (!changed) {
    return null;
  }

  renderUi(Date.now(), { full: false });
  return nextScale;
}

function getPlacementHintText() {
  if (runtime.cleaningMode) {
    return "Scrub until 80% of the glass is clear to reset the haze.";
  }

  if (runtime.scoopMode) {
    return "Click any fish to move it into storage. Dead fish can be flushed from storage or details.";
  }

  if (runtime.editTankMode) {
    return "";
  }

  if (runtime.dragState) {
    return !isCaveDecorKey(runtime.dragState.decorKey)
      ? "Press [z] or [x] to change layer."
      : "";
  }

  if (runtime.fishDragState) {
    return "Drag the fish anywhere inside the tank, then release to let it swim again.";
  }

  return "";
}

function renderPlacementHint() {
  const hintText = getPlacementHintText();
  const hintContainer = dom.placementHint?.parentElement;
  dom.placementHint.textContent = hintText;
  dom.placementHint.style.opacity = hintText ? "1" : "0";
  dom.placementHint.style.visibility = hintText ? "visible" : "hidden";
  if (hintContainer) {
    hintContainer.hidden = !hintText;
  }
}

function renderEditQuickRef() {
  if (!dom.editQuickRef) {
    return;
  }

  const visible = runtime.editTankMode || runtime.fishEditMode;
  dom.editQuickRef.hidden = !visible;
  if (!visible || !dom.editQuickRefCard) {
    return;
  }

  const markup = runtime.fishEditMode
    ? `
      <div><strong>Right Click</strong> - Move to Storage</div>
      <div><strong>Drag Fish</strong> - Reposition in Tank</div>
    `
    : `
      <div><strong>[Z]/[X]</strong> - Change Layer</div>
      <div><strong>[-]/[+]</strong> - Change Size</div>
      <div><strong>Right Click</strong> - Move to Storage</div>
    `;
  setMarkupIfChanged("edit-quick-ref", dom.editQuickRefCard, markup);
}

function beginDecorDrag(item, point, pointerId, options = {}) {
  runtime.pointerDown = true;
  runtime.suppressNextTankClick = true;
  runtime.dragState = {
    placedId: item.id,
    offsetXNorm: item.xNorm - point.x / TANK_WIDTH,
    offsetYNorm: item.yNorm - point.y / TANK_HEIGHT,
    isNewPlacement: Boolean(options.isNewPlacement),
    tankLayer: getDecorTankLayer(item),
    decorName: options.decorName || runtime.decorMap.get(item.decorKey)?.name || titleFromFile(item.decorKey),
    decorKey: item.decorKey
  };

  try {
    dom.tankStage.setPointerCapture(pointerId);
  } catch (error) {
    console.debug("Pointer capture skipped.", error);
  }

  updateDraggedDecor(point);
  renderPlacementHint();
  renderUi(Date.now());
}

function updateDraggedDecor(point) {
  const drag = runtime.dragState;
  if (!drag) {
    return;
  }

  const item = state.placedDecor.find((placed) => placed.id === drag.placedId);
  if (!item) {
    runtime.dragState = null;
    renderUi(Date.now());
    return;
  }

  const placement = clampDecorPlacement(point.x / TANK_WIDTH + drag.offsetXNorm, point.y / TANK_HEIGHT + drag.offsetYNorm, {
    item
  });
  item.xNorm = placement.xNorm;
  item.yNorm = placement.yNorm;
  item.tankLayer = clampTankLayer(drag.tankLayer || item.tankLayer || DEFAULT_TANK_LAYER);
  renderPlacementHint();
}

function finalizeDecorDrag() {
  const drag = runtime.dragState;
  if (!drag) {
    return;
  }

  const item = state.placedDecor.find((placed) => placed.id === drag.placedId);
  runtime.dragState = null;
  const now = Date.now();

  if (drag.isNewPlacement) {
    pushEvent(`Placed ${drag.decorName} in the aquarium.`, now);
    showToast(`${drag.decorName} placed.`);
  }

  if (item) {
    applyDecorGravelInsertion(item);
  }

  saveState();
  renderUi(now);
}

function clampFishPlacement(xNorm, yNorm, species = null) {
  if (species?.behavior === "sucker") {
    return {
      xNorm: clamp(xNorm, 0.08, 0.92),
      yNorm: clamp(yNorm, 0.18, 0.76)
    };
  }

  return {
    xNorm: clamp(xNorm, 0.08, 0.92),
    yNorm: clamp(yNorm, 0.14, 0.8)
  };
}

function beginFishDrag(fish, point, pointerId) {
  if (!fish || isFishDead(fish)) {
    return;
  }

  const species = runtime.fishMap.get(fish.speciesId);
  if (!species) {
    return;
  }

  const now = Date.now();
  fish.activity = "roam";
  fish.feedingPelletId = null;
  clearFishCaveBehavior(fish);
  fish.hangoutDecorId = null;
  fish.targetAt = now + 1200;
  fish.targetXNorm = fish.xNorm;
  fish.targetYNorm = fish.yNorm;
  setFishTankLayers(fish, species.behavior === "sucker" ? TANK_DEPTH_LAYERS : getFishTankLayer(fish), species.behavior === "sucker" ? TANK_DEPTH_LAYERS : getFishTankLayer(fish));

  runtime.pointerDown = true;
  runtime.fishDragState = {
    fishId: fish.id,
    offsetXNorm: fish.xNorm - point.x / TANK_WIDTH,
    offsetYNorm: fish.yNorm - point.y / TANK_HEIGHT,
    moved: false
  };

  try {
    dom.tankStage.setPointerCapture(pointerId);
  } catch (error) {
    console.debug("Pointer capture skipped.", error);
  }

  updateDraggedFish(point);
  renderUi(now);
}

function updateDraggedFish(point) {
  const drag = runtime.fishDragState;
  if (!drag || !point) {
    return;
  }

  const fish = state.fish.find((entry) => entry.id === drag.fishId);
  if (!fish || isFishDead(fish)) {
    runtime.fishDragState = null;
    renderUi(Date.now());
    return;
  }

  const species = runtime.fishMap.get(fish.speciesId);
  const placement = clampFishPlacement(
    point.x / TANK_WIDTH + drag.offsetXNorm,
    point.y / TANK_HEIGHT + drag.offsetYNorm,
    species
  );
  const movedDistance = Math.hypot((placement.xNorm - fish.xNorm) * TANK_WIDTH, (placement.yNorm - fish.yNorm) * TANK_HEIGHT);
  if (movedDistance >= 4) {
    drag.moved = true;
    runtime.suppressNextTankClick = true;
  }

  fish.xNorm = placement.xNorm;
  fish.yNorm = placement.yNorm;
  fish.targetXNorm = placement.xNorm;
  fish.targetYNorm = placement.yNorm;
  fish.targetAt = Date.now() + 1200;
  clearFishCaveBehavior(fish);
  fish.hangoutDecorId = null;
  if (species?.behavior === "sucker") {
    setFishTankLayers(fish, TANK_DEPTH_LAYERS, TANK_DEPTH_LAYERS);
  }
}

function finalizeFishDrag() {
  const drag = runtime.fishDragState;
  if (!drag) {
    return;
  }

  runtime.fishDragState = null;
  const now = Date.now();
  const fish = state.fish.find((entry) => entry.id === drag.fishId);
  if (!fish || isFishDead(fish)) {
    renderUi(now);
    return;
  }

  const species = runtime.fishMap.get(fish.speciesId);
  fish.targetAt = now + 900 + Math.random() * 1400;
  fish.hangoutDecorId = null;
  if (species?.behavior === "sucker") {
    setFishTankLayers(fish, TANK_DEPTH_LAYERS, TANK_DEPTH_LAYERS);
  } else {
    setFishTankLayers(fish, getFishTankLayer(fish), getFishTankLayer(fish));
  }

  if (drag.moved) {
    saveState();
  }
  renderUi(now);
}

function storeDecor(placedId) {
  const index = state.placedDecor.findIndex((item) => item.id === placedId);
  if (index === -1) {
    return;
  }

  const [removed] = state.placedDecor.splice(index, 1);
  if (runtime.dragState?.placedId === removed.id) {
    runtime.dragState = null;
  }
  state.gravelLivePebbles = [];
  state.decorInventory[removed.decorKey] = (state.decorInventory[removed.decorKey] || 0) + 1;
  pushEvent(`Stored ${runtime.decorMap.get(removed.decorKey)?.name || titleFromFile(removed.decorKey)} for later.`, Date.now());
  saveState();
  renderUi(Date.now());
}

function storeFish(fishId, options = {}) {
  const allowDead = Boolean(options.allowDead);
  const index = state.fish.findIndex((entry) => entry.id === fishId);
  if (index === -1) {
    return;
  }

  const fish = state.fish[index];
  const dead = isFishDead(fish);
  if (dead && !allowDead) {
    showToast("Use the toilet button to dispose of a deceased fish.");
    return;
  }

  state.fish.splice(index, 1);
  fish.feedingPelletId = null;
  clearFishCaveBehavior(fish);
  if (dead) {
    fish.activity = "dead";
  } else {
    fish.activity = "roam";
    setFishTankLayers(
      fish,
      runtime.fishMap.get(fish.speciesId)?.behavior === "sucker" ? TANK_DEPTH_LAYERS : fish.tankLayer || DEFAULT_TANK_LAYER,
      runtime.fishMap.get(fish.speciesId)?.behavior === "sucker" ? TANK_DEPTH_LAYERS : fish.tankLayer || DEFAULT_TANK_LAYER
    );
  }
  fish.hangoutDecorId = null;
  fish.entryStartedAt = null;
  fish.entryDurationMs = 0;
  fish.entryFromYNorm = null;
  fish.entrySplashTriggered = false;
  fish.turnStartedAt = null;
  fish.turnDurationMs = 0;
  fish.displayDirection = Number(fish.direction) < 0 ? -1 : 1;
  fish.displayAngle = fish.displayDirection < 0 ? Math.PI : 0;
  fish.turnFromDirection = fish.displayDirection;
  fish.turnToDirection = fish.displayDirection;
  fish.turnFromAngle = fish.displayAngle;
  fish.turnToAngle = fish.displayAngle;
  fish.turnSpinDirection = fish.displayDirection < 0 ? 1 : -1;
  state.pendingPoops = state.pendingPoops.filter((poop) => poop.fishId !== fishId);
  state.floatingPellets = state.floatingPellets.filter((pellet) => pellet.targetFishId !== fishId);
  state.storedFish.push(fish);
  if (runtime.selectedFishId === fishId) {
    runtime.selectedFishId = null;
  }

  const now = Date.now();
  pushEvent(`${fish.name} was moved into fish storage.`, now);
  saveState();
  renderUi(now);
  showToast(dead ? `${fish.name} moved to storage.` : `${fish.name} stored.`);
}

function sellFish(fishId) {
  const activeIndex = state.fish.findIndex((entry) => entry.id === fishId);
  const storedIndex = state.storedFish.findIndex((entry) => entry.id === fishId);
  const isActive = activeIndex !== -1;
  const index = isActive ? activeIndex : storedIndex;
  const list = isActive ? state.fish : state.storedFish;

  if (index === -1) {
    return;
  }

  const fish = list[index];
  if (isFishDead(fish)) {
    showToast("Dead fish cannot be sold.");
    return;
  }

  const species = runtime.fishMap.get(fish.speciesId);
  if (!species) {
    return;
  }

  const resaleValue = getResaleValue(species.cost);

  list.splice(index, 1);
  state.pendingPoops = state.pendingPoops.filter((poop) => poop.fishId !== fishId);
  state.floatingPellets = state.floatingPellets.filter((pellet) => pellet.targetFishId !== fishId);

  if (runtime.selectedFishId === fishId) {
    runtime.selectedFishId = null;
  }

  state.coins += resaleValue;

  const now = Date.now();
  pushEvent(`Sold ${fish.name} for ${resaleValue} ${pluralize("coin", resaleValue)}.`, now);
  saveState();
  renderUi(now);
  showToast(`Sold ${fish.name} for ${resaleValue} ${pluralize("coin", resaleValue)}.`);
}

function sellStoredDecor(decorKey) {
  const count = Math.max(0, Number(state.decorInventory[decorKey]) || 0);
  if (count <= 0) {
    return;
  }

  const decor = runtime.decorMap.get(decorKey);
  const resaleValue = getResaleValue(decor?.cost || 0);

  if (count <= 1) {
    delete state.decorInventory[decorKey];
  } else {
    state.decorInventory[decorKey] = count - 1;
  }

  state.coins += resaleValue;

  const now = Date.now();
  pushEvent(`Sold ${decor?.name || titleFromFile(decorKey)} for ${resaleValue} ${pluralize("coin", resaleValue)}.`, now);
  saveState();
  renderUi(now);
  showToast(`Sold ${decor?.name || titleFromFile(decorKey)} for ${resaleValue} ${pluralize("coin", resaleValue)}.`);
}

function sellPlacedDecor(placedId) {
  const index = state.placedDecor.findIndex((item) => item.id === placedId);
  if (index === -1) {
    return;
  }

  const [removed] = state.placedDecor.splice(index, 1);
  if (runtime.dragState?.placedId === removed.id) {
    runtime.dragState = null;
  }
  state.gravelLivePebbles = [];

  const decor = runtime.decorMap.get(removed.decorKey);
  const resaleValue = getResaleValue(decor?.cost || 0);
  state.coins += resaleValue;

  const now = Date.now();
  pushEvent(`Sold ${decor?.name || titleFromFile(removed.decorKey)} for ${resaleValue} ${pluralize("coin", resaleValue)}.`, now);
  saveState();
  renderUi(now);
  showToast(`Sold ${decor?.name || titleFromFile(removed.decorKey)} for ${resaleValue} ${pluralize("coin", resaleValue)}.`);
}

function disposeFish(fishId) {
  const activeIndex = state.fish.findIndex((entry) => entry.id === fishId);
  const storedIndex = state.storedFish.findIndex((entry) => entry.id === fishId);
  const isActive = activeIndex !== -1;
  const index = isActive ? activeIndex : storedIndex;
  const list = isActive ? state.fish : state.storedFish;
  if (index === -1) {
    return;
  }

  const fish = list[index];
  if (!isFishDead(fish)) {
    showToast("Only deceased fish can be disposed of.");
    return;
  }

  list.splice(index, 1);
  state.pendingPoops = state.pendingPoops.filter((poop) => poop.fishId !== fishId);
  state.floatingPellets = state.floatingPellets.filter((pellet) => pellet.targetFishId !== fishId);
  if (!getDeadTankFish().length) {
    state.lastCorpseSicknessAt = null;
  }
  if (runtime.selectedFishId === fishId) {
    runtime.selectedFishId = null;
  }

  const now = Date.now();
  pushEvent(`${fish.name} was disposed of.`, now);
  saveState();
  renderUi(now);
  showToast(`${fish.name} was disposed of.`);
}

function disposeAllDeadFish() {
  const deadFish = [
    ...state.fish.filter((fish) => isFishDead(fish)),
    ...state.storedFish.filter((fish) => isFishDead(fish))
  ];
  if (!deadFish.length) {
    showToast("There are no dead fish to dispose of.");
    return;
  }

  const deadIds = new Set(deadFish.map((fish) => fish.id));
  state.fish = state.fish.filter((fish) => !deadIds.has(fish.id));
  state.storedFish = state.storedFish.filter((fish) => !deadIds.has(fish.id));
  state.pendingPoops = state.pendingPoops.filter((poop) => !deadIds.has(poop.fishId));
  state.floatingPellets = state.floatingPellets.filter((pellet) => !deadIds.has(pellet.targetFishId));

  if (!getDeadTankFish().length) {
    state.lastCorpseSicknessAt = null;
  }

  if (runtime.selectedFishId && deadIds.has(runtime.selectedFishId)) {
    runtime.selectedFishId = null;
  }

  const now = Date.now();
  pushEvent(`${deadFish.length} dead ${pluralize("fish", deadFish.length)} were disposed of.`, now);
  saveState();
  renderUi(now);
  showToast(`Disposed of ${deadFish.length} dead ${pluralize("fish", deadFish.length)}.`);
}

function restoreFishToTank(fishId) {
  const index = state.storedFish.findIndex((entry) => entry.id === fishId);
  if (index === -1) {
    return;
  }

  const fish = state.storedFish[index];
  if (isFishDead(fish)) {
    showToast("Use the toilet button to dispose of a deceased fish.");
    return;
  }

  state.storedFish.splice(index, 1);
  const now = Date.now();
  fish.xNorm = randomSwimX();
  fish.yNorm = randomBetween(0.2, 0.72);
  fish.targetXNorm = randomSwimX();
  fish.targetYNorm = randomSwimY();
  fish.targetAt = now + 2200;
  fish.direction = Math.random() > 0.5 ? 1 : -1;
  fish.displayDirection = fish.direction;
  fish.displayAngle = fish.displayDirection < 0 ? Math.PI : 0;
  fish.activity = "roam";
  fish.feedingPelletId = null;
  clearFishCaveBehavior(fish);
  const returnLayer = runtime.fishMap.get(fish.speciesId)?.behavior === "sucker"
    ? TANK_DEPTH_LAYERS
    : clampTankLayer(1 + Math.floor(Math.random() * TANK_DEPTH_LAYERS));
  setFishTankLayers(fish, returnLayer, returnLayer);
  fish.hangoutDecorId = null;
  fish.entryStartedAt = now;
  fish.entryDurationMs = 1450;
  fish.entryFromYNorm = 0.03;
  fish.entrySplashTriggered = false;
  fish.nextDetritusSnackAt = now + (runtime.fishMap.get(fish.speciesId)?.cleanupMinMs || 12 * 60 * 1000);
  fish.turnStartedAt = null;
  fish.turnDurationMs = 0;
  fish.turnFromDirection = fish.displayDirection;
  fish.turnToDirection = fish.displayDirection;
  fish.turnFromAngle = fish.displayAngle;
  fish.turnToAngle = fish.displayAngle;
  fish.turnSpinDirection = fish.displayDirection < 0 ? 1 : -1;
  if (runtime.fishMap.get(fish.speciesId)?.speedMode === "dynamic") {
    fish.swimSpeed = normalizeFishSpeed(runtime.fishMap.get(fish.speciesId));
  }

  state.fish.push(fish);
  pushEvent(`${fish.name} splashed back into the aquarium.`, now);
  saveState();
  renderUi(now);
  showToast(`${fish.name} returned to the tank.`);
}

function adjustDecorDefaultSize(decorKey, direction) {
  if (!runtime.decorMap.has(decorKey)) {
    return;
  }

  const nextScale = clamp(getDecorScaleDefault(decorKey) + direction * SIZE_STEP, DECOR_SCALE_MIN, DECOR_SCALE_MAX);
  state.decorScaleDefaults[decorKey] = nextScale;
  saveState();
  renderUi(Date.now());
}

function adjustPlacedDecorSize(placedId, direction) {
  const item = state.placedDecor.find((entry) => entry.id === placedId);
  if (!item) {
    return;
  }

  item.scale = clamp(item.scale + direction * SIZE_STEP, DECOR_SCALE_MIN, DECOR_SCALE_MAX);
  saveState();
  renderUi(Date.now());
}

function savePlacedDecorSizeAsDefault(placedId) {
  const item = state.placedDecor.find((entry) => entry.id === placedId);
  if (!item) {
    return;
  }

  state.decorScaleDefaults[item.decorKey] = clamp(item.scale, DECOR_SCALE_MIN, DECOR_SCALE_MAX);
  saveState();
  renderUi(Date.now());
}

function getManagedFishById(fishId) {
  const activeFish = state.fish.find((entry) => entry.id === fishId);
  if (activeFish) {
    return { fish: activeFish, inStorage: false };
  }

  const storedFish = state.storedFish.find((entry) => entry.id === fishId);
  if (storedFish) {
    return { fish: storedFish, inStorage: true };
  }

  return null;
}

function isFishDead(fish) {
  return !fish || fish.healthUnits <= 0;
}

function getLivingTankFish() {
  return state.fish.filter((fish) => !isFishDead(fish));
}

function getDeadTankFish() {
  return state.fish.filter((fish) => isFishDead(fish));
}

function getNearestDeadFish(fish) {
  const deadFish = getDeadTankFish();
  if (!deadFish.length) {
    return null;
  }

  let nearest = null;
  for (const corpse of deadFish) {
    if (!corpse || corpse.id === fish.id) {
      continue;
    }

    const distanceNorm = Math.hypot((corpse.xNorm || 0) - fish.xNorm, (corpse.yNorm || 0) - fish.yNorm);
    if (!nearest || distanceNorm < nearest.distanceNorm) {
      nearest = { fish: corpse, distanceNorm };
    }
  }

  return nearest;
}

function pickDeadFishVigilTarget(fish, species, now) {
  const nearest = getNearestDeadFish(fish);
  if (!nearest) {
    return null;
  }

  const corpse = nearest.fish;
  const orbitDirection = Math.random() < 0.5 ? -1 : 1;
  return {
    xNorm: clamp(corpse.xNorm + orbitDirection * randomBetween(0.035, 0.09), 0.08, 0.92),
    yNorm: clamp(corpse.yNorm + randomBetween(-0.015, 0.085), 0.14, 0.34),
    lingerMs: 1500 + Math.random() * (species.swimStyle === "peaceful" ? 2200 : 1500),
    corpseXNorm: corpse.xNorm,
    targetLayer: getFishTankLayer(corpse)
  };
}

function getOwnedFishCount() {
  return state.fish.length + state.storedFish.length;
}

function compareFishCatalogBySize(left, right) {
  const leftWidth = Number.isFinite(left?.width) ? left.width : Number.MAX_SAFE_INTEGER;
  const rightWidth = Number.isFinite(right?.width) ? right.width : Number.MAX_SAFE_INTEGER;
  return leftWidth - rightWidth
    || (left?.cost ?? Number.MAX_SAFE_INTEGER) - (right?.cost ?? Number.MAX_SAFE_INTEGER)
    || String(left?.name || "").localeCompare(String(right?.name || ""));
}

function getStarterFishSpecies() {
  return [...runtime.fishCatalog].sort(compareFishCatalogBySize)[0] || null;
}

function getFishPurchaseCost(speciesId) {
  const starterSpeciesId = getStarterFishSpecies()?.id;
  if (speciesId === starterSpeciesId && state.coins <= 0 && getOwnedFishCount() === 0) {
    return 0;
  }

  return runtime.fishMap.get(speciesId)?.cost ?? 0;
}

function markFishAsDead(fish, now = Date.now(), reasonText = null) {
  if (!fish) {
    return false;
  }

  const alreadyDead = fish.activity === "dead" || isFishDead(fish);
  fish.deadAt = alreadyDead && Number.isFinite(fish.deadAt) ? fish.deadAt : now;
  fish.healthUnits = 0;
  fish.fedStreak = 0;

  const pelletId = fish.feedingPelletId;
  const species = runtime.fishMap.get(fish.speciesId);
  fish.activity = "dead";
  fish.feedingPelletId = null;
  clearFishCaveBehavior(fish);
  setFishTankLayers(fish, species?.behavior === "sucker" ? TANK_DEPTH_LAYERS : getFishTankLayer(fish), species?.behavior === "sucker" ? TANK_DEPTH_LAYERS : getFishTankLayer(fish));
  fish.hangoutDecorId = null;
  fish.entryStartedAt = null;
  fish.entryDurationMs = 0;
  fish.entryFromYNorm = null;
  fish.entrySplashTriggered = false;
  fish.turnStartedAt = null;
  fish.turnDurationMs = 0;
  fish.displayDirection = Number(fish.direction) < 0 ? -1 : 1;
  fish.displayAngle = fish.displayDirection < 0 ? Math.PI : 0;
  fish.turnFromDirection = fish.displayDirection;
  fish.turnToDirection = fish.displayDirection;
  fish.turnFromAngle = fish.displayAngle;
  fish.turnToAngle = fish.displayAngle;
  fish.turnSpinDirection = fish.displayDirection < 0 ? 1 : -1;
  state.pendingPoops = state.pendingPoops.filter((poop) => poop.fishId !== fish.id);
  state.floatingPellets = state.floatingPellets.filter((pellet) => pellet.targetFishId !== fish.id && pellet.id !== pelletId);

  if (!alreadyDead && reasonText) {
    state.lifetimeDeaths = Math.max(0, (Number(state.lifetimeDeaths) || 0) + 1);
    pushEvent(reasonText, now);
  }

  saveState();
  return !alreadyDead;
}

function applyFishDamage(fish, amount = 1, now = Date.now(), injuryText = null, deathText = null) {
  if (!fish || isFishDead(fish)) {
    return { changed: false, dead: true };
  }

  const damageUnits = Math.max(1, Math.round(Number(amount) || 1));
  fish.healthUnits = Math.max(0, fish.healthUnits - damageUnits);
  fish.fedStreak = 0;

  if (fish.healthUnits <= 0) {
    markFishAsDead(fish, now, deathText || `${fish.name} died.`);
    return { changed: true, dead: true };
  }

  if (injuryText) {
    pushEvent(injuryText, now);
  }
  return { changed: true, dead: false };
}

function adjustFishSize(fishId, direction) {
  const managed = getManagedFishById(fishId);
  if (!managed) {
    return;
  }

  const { fish } = managed;
  fish.scale = clamp(fish.scale + direction * SIZE_STEP, FISH_SCALE_MIN, FISH_SCALE_MAX);
  saveState();
  renderUi(Date.now());
}

function saveFishSizeAsDefault(fishId) {
  const managed = getManagedFishById(fishId);
  if (!managed) {
    return;
  }

  const { fish } = managed;
  state.fishScaleDefaults[fish.speciesId] = clamp(fish.scale, FISH_SCALE_MIN, FISH_SCALE_MAX);
  saveState();
  renderUi(Date.now());
}

function openFishInspector(fishId) {
  if (!getManagedFishById(fishId)) {
    return;
  }

  runtime.selectedFishId = fishId;
  renderUi(Date.now());
}

function closeFishInspector() {
  runtime.selectedFishId = null;
  renderUi(Date.now());
}

function saveInspectorName() {
  const managed = getManagedFishById(runtime.selectedFishId);
  if (!managed) {
    return;
  }

  const { fish } = managed;
  const nextName = dom.fishNameInput.value.trim().slice(0, 20);
  if (!nextName) {
    showToast("Fish names cannot be blank.");
    dom.fishNameInput.value = fish.name;
    return;
  }

  fish.name = nextName;
  pushEvent(`${nextName} got a fresh new name tag.`, Date.now());
  saveState();
  renderUi(Date.now());
  showToast(`${nextName} has been renamed.`);
}

function selectGravelAsset(gravelKey) {
  if (!runtime.gravelMap.has(gravelKey)) {
    return;
  }

  state.selectedGravelAsset = gravelKey;
  invalidateGravelBedCache(false);
  saveState();
  renderUi(Date.now());
}

function selectBackground(backgroundKey) {
  if (!runtime.backgroundMap.has(backgroundKey)) {
    return;
  }

  state.selectedBackground = backgroundKey;
  pushEvent(`Switched the tank background to ${runtime.backgroundMap.get(backgroundKey).name}.`, Date.now());
  saveState();
  renderUi(Date.now());
}

function selectTankAsset(tankKey) {
  if (!runtime.tankMap.has(tankKey)) {
    return;
  }

  state.selectedTankAsset = tankKey;
  pushEvent(`Swapped the tank shell to ${runtime.tankMap.get(tankKey).name}.`, Date.now());
  saveState();
  renderUi(Date.now());
}

function selectFilterAsset(filterKey) {
  if (!runtime.filterMap.has(filterKey)) {
    return;
  }

  state.selectedFilterAsset = filterKey;
  const filter = runtime.filterMap.get(filterKey);
  pushEvent(`Changed the filter to ${filter.name}. It now slows grime buildup by about ${getFilterAssistPercent(filterKey)}%.`, Date.now());
  saveState();
  renderUi(Date.now());
}

function setGravelPaletteColor(slotIndex, color) {
  const normalizedColor = normalizeHexColor(color);
  if (!normalizedColor) {
    return;
  }

  const palette = getActiveGravelPalette();
  palette[clamp(slotIndex, 0, 2)] = normalizedColor;
  state.gravelPalette = palette;
  invalidateGravelBedCache();
  saveState();
  renderUi(Date.now());
}

function selectBubbleAsset(bubbleKey) {
  if (!runtime.bubbleMap.has(bubbleKey)) {
    return;
  }

  state.selectedBubbleAsset = bubbleKey;
  pushEvent(`Changed the bubble style to ${runtime.bubbleMap.get(bubbleKey).name}.`, Date.now());
  saveState();
  renderUi(Date.now());
}

function toggleCleaningMode() {
  const nextMode = !runtime.cleaningMode;

  runtime.cleaningMode = nextMode;
  runtime.scoopMode = false;

  if (runtime.cleaningMode) {
    runtime.placementMode = null;
    runtime.placementPreview = null;
    runtime.dragState = null;
    runtime.fishDragState = null;
    runtime.pebbleDragState = null;
    showToast("Scrub the glass until 80% is clear.");
  }

  runtime.pointerDown = false;
  runtime.lastScrubPoint = null;

  renderToolCursor();
  renderUi(Date.now());
}

function toggleScoopMode() {
  const nextMode = !runtime.scoopMode;

  runtime.scoopMode = nextMode;
  runtime.cleaningMode = false;
  runtime.pointerDown = false;
  runtime.lastScrubPoint = null;

  if (runtime.scoopMode) {
    runtime.placementMode = null;
    runtime.placementPreview = null;
    runtime.dragState = null;
    runtime.fishDragState = null;
    runtime.pebbleDragState = null;
    showToast("Click a fish to move it into storage.");
  }

  renderToolCursor();
  renderUi(Date.now());
}

function makeTankMaxDirty() {
  const now = Date.now();
  syncState(now);

  const currentBaseDirtiness = getBaseTankDirtiness(now);
  if (currentBaseDirtiness >= 0.995) {
    showToast("The tank is already at maximum dirtiness.");
    return;
  }

  const filterProfile = getFilterProfile();
  const suckerSlowdown = hasActiveSuckerFish() ? 1.25 : 1;
  const targetBaseDirtiness = clamp(currentBaseDirtiness + 0.1, 0, 1);
  const algaeWindowMs = WEEK_MS * (1 + filterProfile.grimeDelay) * suckerSlowdown;
  const poopScale = Math.max(14, state.fish.length * 12) * (1 + filterProfile.wasteCapacity) * suckerSlowdown;
  const currentAlgae = clamp((now - state.lastCleanedAt) / algaeWindowMs, 0, 1);
  const currentPoopFactor = clamp(state.poops.length / poopScale, 0, 1);
  const currentAlgaeContribution = currentAlgae * 0.72;
  const currentPoopContribution = currentPoopFactor * 0.35;
  const currentContribution = currentAlgaeContribution + currentPoopContribution;

  let remainingContribution = Math.max(0, targetBaseDirtiness - currentContribution);
  let algaeAdd = Math.min(Math.max(0, 0.72 - currentAlgaeContribution), remainingContribution * 0.55);
  remainingContribution -= algaeAdd;
  let poopAdd = Math.min(Math.max(0, 0.35 - currentPoopContribution), remainingContribution);
  remainingContribution -= poopAdd;

  if (remainingContribution > 0) {
    const extraAlgae = Math.min(Math.max(0, 0.72 - currentAlgaeContribution - algaeAdd), remainingContribution);
    algaeAdd += extraAlgae;
    remainingContribution -= extraAlgae;
  }
  if (remainingContribution > 0) {
    poopAdd += Math.min(Math.max(0, 0.35 - currentPoopContribution - poopAdd), remainingContribution);
  }

  const nextAlgaeRatio = clamp((currentAlgaeContribution + algaeAdd) / 0.72, 0, 1);
  const desiredPoopFactor = clamp((currentPoopContribution + poopAdd) / 0.35, 0, 1);
  const desiredPoopCount = Math.max(state.poops.length, Math.ceil(desiredPoopFactor * poopScale));
  const fishCount = Math.max(1, state.fish.length);
  const nextPoops = [...state.poops];

  for (let index = nextPoops.length; index < desiredPoopCount; index += 1) {
    const spread = desiredPoopCount > 1 ? index / (desiredPoopCount - 1) : 0.5;
    const xNorm = clamp(0.09 + spread * 0.82 + (Math.random() - 0.5) * 0.03, 0.08, 0.92);
    const floorYNorm = clamp(getTankFloorSurfaceYAtX(xNorm * TANK_WIDTH) / TANK_HEIGHT + 0.008 + Math.random() * 0.02, 0.82, 0.94);
    const fish = state.fish[index % fishCount] || null;
    nextPoops.push({
      id: createId("poop"),
      fishId: fish?.id || "",
      createdAt: now - POOP_FALL_MS - Math.random() * (7 * 60 * 1000),
      xNorm,
      yNorm: floorYNorm,
      startYNorm: fish ? clamp(fish.yNorm + 0.05, 0.2, 0.78) : randomBetween(0.24, 0.62)
    });
  }

  state.pendingPoops = [];
  state.poops = nextPoops;
  state.lastCleanedAt = now - nextAlgaeRatio * algaeWindowMs;
  runtime.cleaningTransition = null;
  runtime.cleaningMode = false;
  runtime.pointerDown = false;
  clearScrubProgress();
  renderToolCursor();
  const nextCleanliness = Math.max(0, Math.round((1 - getBaseTankDirtiness(now)) * 100));
  pushEvent(`Debug grime increased. Tank cleanliness dropped to ${nextCleanliness}%.`, now);
  saveState();
  renderUi(now);
  showToast("-10% cleanliness.");
}

function addDebugCoins() {
  const now = Date.now();
  state.coins += 10;
  pushEvent("Debug coins added. +10 coins.", now);
  saveState();
  renderUi(now);
  showToast("+10 coins.");
}

function resetMealsDebug() {
  const now = Date.now();
  const slots = getTodaysMealSlots(now);
  let cleared = 0;

  for (const slot of slots) {
    if (state.feedHistory[slot.key]) {
      delete state.feedHistory[slot.key];
      cleared += 1;
    }
  }

  if (!cleared) {
    showToast("Today's meals are already reset.");
    return;
  }

  pushEvent("Debug meal reset cleared today's feeding record.", now);
  saveState();
  renderUi(now);
  showToast("Today's meals reset.");
}

function toggleDebugNightCaveMode() {
  const now = Date.now();
  const activelyDraggedFishId = runtime.fishDragState?.fishId || null;
  const hasCaveDecor = state.placedDecor.some((item) => isCaveDecorKey(item.decorKey));
  const hasEligibleFish = state.fish.some((fish) => {
    const species = runtime.fishMap.get(fish.speciesId);
    return species && species.behavior !== "sucker" && species.caveEnabled !== false && !isFishDead(fish) && fish.id !== activelyDraggedFishId;
  });

  if (!hasCaveDecor || !hasEligibleFish) {
    showToast("Add a cave and a cave-enabled living fish to test cave entry.");
    return;
  }

  runtime.debugNightCaveMode = !runtime.debugNightCaveMode;

  if (runtime.debugNightCaveMode) {
    for (const fish of state.fish) {
      const species = runtime.fishMap.get(fish.speciesId);
      if (!species || species.behavior === "sucker" || species.caveEnabled === false || isFishDead(fish) || fish.id === activelyDraggedFishId) {
        continue;
      }

      if (fish.activity === "roam" && !fish.caveState) {
        fish.hangoutDecorId = null;
        fish.targetAt = Math.min(Number(fish.targetAt) || Infinity, now + 250 + Math.random() * 1500);
      }
    }
    const immediateCaveToast = sendRandomFishIntoCaveNow(now, { ignoreBlockedDecor: true, silentFailure: true });
    pushEvent("Debug forced cave behavior enabled.", now);
    showToast(immediateCaveToast || "Forced cave behavior enabled. No cave route started yet.");
  } else {
    pushEvent("Debug forced cave behavior disabled.", now);
    showToast("Forced cave behavior disabled.");
  }

  renderUi(now);
}

function sendRandomFishIntoCaveNow(now = Date.now(), options = {}) {
  const { ignoreBlockedDecor = true, silentFailure = false } = options;
  const activelyDraggedFishId = runtime.fishDragState?.fishId || null;
  const candidates = state.fish
    .map((fish) => {
      const species = runtime.fishMap.get(fish.speciesId);
      if (!species || species.behavior === "sucker" || species.caveEnabled === false || isFishDead(fish) || fish.id === activelyDraggedFishId) {
        return null;
      }

      const plans = collectCaveBehaviorPlansForFish(fish, now, { ignoreBlockedDecor });
      if (!plans.length) {
        return null;
      }

      return { fish, species, plans };
    })
    .filter(Boolean);

  if (!candidates.length) {
    if (!silentFailure) {
      showToast("No simple cave slot is configured for the current cave art.");
    }
    return null;
  }

  const chosen = candidates[Math.floor(Math.random() * candidates.length)];
  const plan = chosen.plans[Math.floor(Math.random() * chosen.plans.length)];
  const decor = state.placedDecor.find((item) => item.id === plan.decorId);
  const decorName = decor ? (runtime.decorMap.get(decor.decorKey)?.name || titleFromFile(decor.decorKey)) : "the cave";
  const fish = chosen.fish;

  fish.activity = "roam";
  fish.feedingPelletId = null;
  clearFishCaveBehavior(fish);
  fish.hangoutDecorId = null;
  fish.targetAt = now;
  state.floatingPellets = state.floatingPellets.filter((pellet) => pellet.targetFishId !== fish.id);

  if (chosen.species.speedMode === "dynamic") {
    fish.swimSpeed = normalizeFishSpeed(chosen.species);
  }

  beginFishCaveBehavior(fish, plan, now);
  runtime.selectedFishId = fish.id;
  pushEvent(`Debug sent ${fish.name} toward ${decorName}.`, now);
  return `${fish.name} is heading into ${decorName}.`;
}

function damageSelectedFish() {
  const managed = getManagedFishById(runtime.selectedFishId);
  if (!managed) {
    showToast("Select a fish in the tank first.");
    return;
  }

  if (managed.inStorage) {
    showToast("Take the fish out of storage before using the kill switch.");
    return;
  }

  const { fish } = managed;
  const now = Date.now();
  if (isFishDead(fish)) {
    showToast(`${fish.name} is already dead.`);
    return;
  }

  const result = applyFishDamage(
    fish,
    1,
    now,
    `${fish.name} lost half a heart.`,
    `${fish.name} died and floated to the surface.`
  );
  const toast = result.dead ? `${fish.name} died.` : `${fish.name} lost half a heart.`;

  saveState();
  renderUi(now);
  showToast(toast);
}

function deleteAllFishAndDecor() {
  const now = Date.now();
  state.fish = [];
  state.storedFish = [];
  state.lastCorpseSicknessAt = null;
  state.pendingPoops = [];
  state.poops = [];
  state.floatingPellets = [];
  state.decorInventory = {};
  state.placedDecor = [];
  state.gravelLivePebbles = [];
  runtime.selectedFishId = null;
  runtime.dragState = null;
  runtime.fishDragState = null;
  runtime.pebbleDragState = null;
  runtime.placementMode = null;
  runtime.placementPreview = null;
  runtime.splashBursts = [];
  runtime.fallingGravelPebbles = [];
  runtime.bettaPassLocks.clear();
  pushEvent("Debug reset cleared all fish and decor.", now);
  saveState();
  renderUi(now);
  showToast("Fish and decor cleared.");
}

function resetAllProgress() {
  const confirmed = window.confirm("Are you sure you wish to reset all progress? This cannot be undone.");
  if (!confirmed) {
    return;
  }

  localStorage.removeItem(STORAGE_KEY);
  resetTransientAquariumUiState();

  state = reconcileState(null);
  saveState();
  renderUi(Date.now());
  showToast("All progress reset.");
}

function scrubGlass(x, y) {
  const points = [];
  if (runtime.lastScrubPoint) {
    const strokeDistance = distance(runtime.lastScrubPoint.x, runtime.lastScrubPoint.y, x, y);
    const steps = Math.max(1, Math.ceil(strokeDistance / SCRUB_STROKE_STEP));
    for (let step = 1; step <= steps; step += 1) {
      const progress = step / steps;
      points.push({
        x: runtime.lastScrubPoint.x + (x - runtime.lastScrubPoint.x) * progress,
        y: runtime.lastScrubPoint.y + (y - runtime.lastScrubPoint.y) * progress
      });
    }
  } else {
    points.push({ x, y });
  }

  let changed = false;
  for (const point of points) {
    changed = markScrubStamp(point.x, point.y) || changed;
  }
  runtime.lastScrubPoint = { x, y };

  if (!changed) {
    return;
  }

  const coverage = getScrubCoverage();
  renderUi(Date.now());

  if (coverage >= SCRUB_THRESHOLD) {
    completeCleaning();
  }
}

function markScrubStamp(x, y) {
  const scrubX = clamp(x, GLASS_MARGIN_X + 6, TANK_WIDTH - GLASS_MARGIN_X - 6);
  const scrubY = clamp(y, WATER_SURFACE_Y + 6, TANK_HEIGHT - GLASS_MARGIN_BOTTOM - 6);
  const cellWidth = TANK_WIDTH / SCRUB_GRID_COLS;
  const cellHeight = TANK_HEIGHT / SCRUB_GRID_ROWS;
  const startCol = clamp(Math.floor((scrubX - SCRUB_BRUSH_RADIUS) / cellWidth), 0, SCRUB_GRID_COLS - 1);
  const endCol = clamp(Math.ceil((scrubX + SCRUB_BRUSH_RADIUS) / cellWidth), 0, SCRUB_GRID_COLS - 1);
  const startRow = clamp(Math.floor((scrubY - SCRUB_BRUSH_RADIUS) / cellHeight), 0, SCRUB_GRID_ROWS - 1);
  const endRow = clamp(Math.ceil((scrubY + SCRUB_BRUSH_RADIUS) / cellHeight), 0, SCRUB_GRID_ROWS - 1);

  let changed = false;
  for (let row = startRow; row <= endRow; row += 1) {
    for (let col = startCol; col <= endCol; col += 1) {
      const cellCenterX = col * cellWidth + cellWidth / 2;
      const cellCenterY = row * cellHeight + cellHeight / 2;
      const index = row * SCRUB_GRID_COLS + col;
      if (!runtime.scrubCells[index] && distance(cellCenterX, cellCenterY, scrubX, scrubY) <= SCRUB_BRUSH_RADIUS) {
        runtime.scrubCells[index] = 1;
        runtime.scrubbedCount += 1;
        changed = true;
      }
    }
  }

  runtime.scrubStamps.push({
    x: scrubX,
    y: scrubY,
    radius: SCRUB_BRUSH_RADIUS * (0.92 + Math.random() * 0.1)
  });
  if (runtime.scrubStamps.length > 900) {
    runtime.scrubStamps.splice(0, runtime.scrubStamps.length - 900);
  }

  return changed;
}

function completeCleaning() {
  const now = Date.now();
  const fromDirtiness = getBaseTankDirtiness(now);
  state.lastCleanedAt = now;
  state.poops = [];
  runtime.cleaningTransition = {
    startedAt: now,
    fadeEndsAt: now + CLEAN_FADE_MS,
    sparkleEndsAt: now + CLEAN_FADE_MS + CLEAN_SPARKLE_MS,
    fromDirtiness,
    sparkles: createCleaningSparkles()
  };
  runtime.cleaningMode = false;
  runtime.pointerDown = false;
  runtime.lastScrubPoint = null;
  renderToolCursor();
  pushEvent("The tank sparkled back to life after a deep sponge scrub.", now);
  saveState();
  renderUi(now);
  showToast("Tank cleaned. The haze is gone.");
}

function clearScrubProgress() {
  runtime.scrubCells.fill(0);
  runtime.scrubbedCount = 0;
  runtime.scrubStamps = [];
  runtime.lastScrubPoint = null;
}

function getScrubCoverage() {
  return runtime.scrubbedCount / runtime.scrubCells.length;
}

function createCleaningSparkles() {
  const sparkleHues = [190, 204, 162, 48, 22, 320, 278];
  return Array.from({ length: 42 }, (_, index) => ({
    x: randomBetween(GLASS_MARGIN_X + 46, TANK_WIDTH - GLASS_MARGIN_X - 46),
    y: randomBetween(WATER_SURFACE_Y + 26, FLOOR_Y - 56),
    size: randomBetween(10, 26),
    delay: randomBetween(0, 0.68),
    twinkle: randomBetween(0.95, 2.1),
    hue: sparkleHues[index % sparkleHues.length] + randomBetween(-8, 8),
    rotation: randomBetween(0, Math.PI),
    glow: randomBetween(0.72, 1.22),
    diagonal: Math.random() < 0.82
  }));
}

function updateSplashBursts(now) {
  runtime.splashBursts = runtime.splashBursts.filter((burst) => now <= burst.endsAt);
}

function spawnFishReturnSplash(xNorm) {
  const x = clamp(xNorm * TANK_WIDTH, GLASS_MARGIN_X + 34, TANK_WIDTH - GLASS_MARGIN_X - 34);
  const startedAt = Date.now();
  runtime.splashBursts.push({
    id: createId("splash"),
    x,
    y: WATER_SURFACE_Y + 4,
    startedAt,
    endsAt: startedAt + 1250,
    droplets: Array.from({ length: 14 }, (_, index) => ({
      drift: randomBetween(-58, 58),
      lift: randomBetween(18, 64),
      size: randomBetween(2.4, 6.4),
      delay: index * 0.016 + randomBetween(0, 0.04),
      fall: randomBetween(12, 34)
    })),
    bubbles: Array.from({ length: 10 }, (_, index) => ({
      drift: randomBetween(-30, 30),
      rise: randomBetween(24, 82),
      radius: randomBetween(2.8, 7.4),
      delay: 0.06 + index * 0.024 + randomBetween(0, 0.05),
      wobble: randomBetween(1.2, 4.8)
    }))
  });
}

function updateCleaningTransition(now) {
  if (!runtime.cleaningTransition) {
    return;
  }

  if (now >= runtime.cleaningTransition.sparkleEndsAt) {
    runtime.cleaningTransition = null;
    clearScrubProgress();
    renderUi(now);
  }
}

function pushEvent(text, time = Date.now()) {
  state.events.unshift({
    id: createId("event"),
    time,
    text
  });
  state.events = state.events.slice(0, 12);
}

function saveState() {
  if (!state) {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    runtime.gravelStateDirty = false;
  } catch (error) {
    console.error(error);
  }
}

function renderUi(now, options = {}) {
  const full = options.full !== false;
  renderTheme();
  renderSidebar();
  renderTabs();
  renderHeader(now);
  renderMealTrack(now);
  renderSummary(now);
  renderEvents();
  renderStoreOverlay();
  renderEditQuickRef();
  renderEditDecorTray();
  renderEditFishTray();
  renderFishInspector(now);
  renderControls(now);
  if (full) {
    renderFishShop();
    renderFishList(now);
    renderDecorShop();
    renderDecorInventory();
    renderPlacedDecor();
    renderBackgrounds();
    renderTankAssets();
    renderFilterAssets();
    renderGravelAssets();
    renderCollapsibleSections();
  }
  positionToast();
}

function renderTheme() {
  document.documentElement.dataset.theme = DEFAULT_THEME;
}

function renderSidebar() {
  dom.tankSidebar.classList.toggle("is-collapsed", runtime.sidebarCollapsed);
  dom.toggleSidebar.textContent = runtime.sidebarCollapsed ? ">" : "<";
  dom.toggleSidebar.setAttribute("aria-expanded", String(!runtime.sidebarCollapsed));
  dom.toggleSidebar.setAttribute("aria-label", runtime.sidebarCollapsed ? "Show sidebar" : "Hide sidebar");
}

function renderTabs() {
  for (const button of dom.tabButtons) {
    button.classList.toggle("active", button.dataset.tab === runtime.activeTab);
  }

  for (const panel of dom.tabPanels) {
    panel.classList.toggle("active", panel.dataset.panel === runtime.activeTab);
  }
}

function renderHeader(now) {
  const dirtiness = getTankDirtiness(now);
  const cleanliness = Math.max(0, Math.round((1 - dirtiness) * 100));
  const servedToday = getTodaysMealSlots(now).filter((slot) => Boolean(state.feedHistory[slot.key])).length;

  dom.coinCount.textContent = formatNumber(state.coins);
  dom.cleanlinessLabel.textContent = `${cleanliness}%`;
  dom.mealWindowLabel.textContent = `${servedToday} / 2`;

  const currentSlot = getCurrentMealSlot(now);
  if (dom.nextMealCountdownMirror) {
    dom.nextMealCountdownMirror.textContent = `Next deadline in ${formatDuration(currentSlot.end - now)}`;
  }
}

function renderMealTrack(now) {
  const slots = getTodaysMealSlots(now);
  const markup = slots
    .map((slot) => {
      const served = Boolean(state.feedHistory[slot.key]);
      const neededByAnyFish = state.fish.some((fish) => fish.acquiredAt <= slot.start && !isFishDead(fish) && fishNeedsMealWindow(fish));
      const missed = slot.end <= now && !served && neededByAnyFish;
      const future = slot.start > now;
      const status = served
        ? "Served"
        : future
          ? "Upcoming"
          : missed
            ? "Missed"
            : neededByAnyFish
              ? "Hungry"
              : state.fish.length
                ? "Not needed"
                : "No fish yet";
      const statusIcon = served
        ? "✅"
        : missed
          ? "❌"
          : future || neededByAnyFish
            ? "⏳"
            : "—";

      return `
        <div class="meal-line">
          <span class="meal-line-label">${slot.label}:</span>
          <strong class="meal-line-status" aria-label="${status}" title="${status}">${statusIcon}</strong>
        </div>
      `;
    })
    .join("");
  setMarkupIfChanged("meal-track", dom.mealTrack, markup);
}

function renderSummary(now) {
  const dirtiness = getTankDirtiness(now);
  const coinsPerMeal = getLivingTankFish().reduce((total, fish) => total + runtime.fishMap.get(fish.speciesId).mealCoins, 0);
  const lowHealthCount = state.fish.filter((fish) => !isFishDead(fish) && fish.healthUnits < MAX_HEALTH_UNITS).length;
  const filterAssist = getFilterAssistPercent();

  const rows = [
    { label: "Fish in Tank", value: state.fish.filter((fish) => !isFishDead(fish)).length },
    { label: "Coin per meal", value: coinsPerMeal },
    { label: "Current Grime", value: `${Math.round(dirtiness * 100)}%` },
    { label: "Waste on floor", value: state.poops.length },
    { label: "Filter Assist", value: `+${filterAssist}%` },
    { label: "Fish Injured/Healing", value: lowHealthCount },
    { label: "Deaths in Care", value: state.lifetimeDeaths }
  ];

  const markup = rows
    .map(
      (row) => `
        <div class="summary-row">
          <span>${row.label}</span>
          <strong>${row.value}</strong>
        </div>
      `
    )
    .join("");
  setMarkupIfChanged("summary-grid", dom.summaryGrid, markup);
}

function renderEvents() {
  const markup = state.events.length
    ? state.events
      .map(
        (event) => `
            <div class="event-line">
              <strong>${timeAgo(event.time)}</strong>
              <div>${event.text}</div>
            </div>
          `
      )
      .join("")
    : `<div class="empty-state">Nothing has happened yet.</div>`;
  setMarkupIfChanged("event-feed", dom.eventFeed, markup);
}

function renderFishShop() {
  const markup = [...runtime.fishCatalog]
    .sort(compareFishCatalogBySize)
    .map((fish) => {
      const purchaseCost = getFishPurchaseCost(fish.id);
      const affordable = state.coins >= purchaseCost;
      const fishCareLine = fish.diet === "detritus"
        ? "Back-glass grazer. Ignores pellets and slowly cleans grime plus poop."
        : `Earns ${fish.mealCoins} ${pluralize("coin", fish.mealCoins)} every feeding. Swim: ${formatSwimStyle(fish.swimStyle)}.`;
      return `
        <article class="shop-card">
          <img class="shop-thumb" src="${fish.asset}" alt="${fish.name}" />
          <div class="shop-meta">
            <div>
              <strong>${fish.name}</strong>
              <div class="fish-meta">${fish.description}</div>
            </div>
            <div class="fish-meta">${fishCareLine}</div>
          </div>
          <div class="shop-meta">
            <span class="price-tag">${purchaseCost === 0 ? "Free" : `${purchaseCost} ${pluralize("coin", purchaseCost)}`}</span>
            <button class="buy-button" data-buy-fish="${fish.id}" ${affordable ? "" : "disabled"}>
              Buy Fish
            </button>
          </div>
        </article>
      `;
    })
    .join("");

  setMarkupIfChanged("fish-shop", dom.fishShop, markup);
}

function renderStoreOverlay() {
  const showingFish = runtime.storeTab === "fish";
  const showingDecor = runtime.storeTab === "decor";

  dom.storeOverlay.hidden = !runtime.storeOverlayOpen;
  dom.storeOverlay.classList.toggle("is-open", runtime.storeOverlayOpen);

  dom.storeFishTab.classList.toggle("is-active", showingFish);
  dom.storeDecorTab.classList.toggle("is-active", showingDecor);

  dom.storeFishTab.setAttribute("aria-selected", String(showingFish));
  dom.storeDecorTab.setAttribute("aria-selected", String(showingDecor));

  dom.storeCoinCounter.textContent = `🪙 ${formatNumber(state.coins)}`;

  dom.fishShop.hidden = !runtime.storeOverlayOpen || !showingFish;
  dom.decorShop.hidden = !runtime.storeOverlayOpen || !showingDecor;
}

function getStoredDecorEntries() {
  return Object.entries(state.decorInventory)
    .filter(([, count]) => count > 0)
    .sort(([leftKey], [rightKey]) => {
      const left = runtime.decorMap.get(leftKey)?.name || leftKey;
      const right = runtime.decorMap.get(rightKey)?.name || rightKey;
      return left.localeCompare(right);
    });
}

function syncEditDecorTrayScrollControls() {
  if (!dom.editDecorTrayScroller || !dom.editDecorTrayPrev || !dom.editDecorTrayNext) {
    return;
  }

  const scroller = dom.editDecorTrayScroller;
  const maxScroll = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
  const visible = !dom.editDecorTray?.hidden;

  dom.editDecorTrayPrev.disabled = !visible || maxScroll <= 2 || scroller.scrollLeft <= 2;
  dom.editDecorTrayNext.disabled = !visible || maxScroll <= 2 || scroller.scrollLeft >= maxScroll - 2;
}

function scrollEditDecorTray(direction) {
  if (!dom.editDecorTrayScroller) {
    return;
  }

  const distance = Math.max(180, Math.round(dom.editDecorTrayScroller.clientWidth * 0.72));
  dom.editDecorTrayScroller.scrollBy({
    left: distance * direction,
    behavior: "smooth"
  });

  window.setTimeout(() => syncEditDecorTrayScrollControls(), 180);
}

function renderEditDecorTray() {
  const visible = runtime.editTankMode;
  if (dom.editDecorTray) {
    dom.editDecorTray.hidden = !visible;
  }
  dom.tankStage?.classList.toggle("has-edit-decor-tray", visible || runtime.fishEditMode);

  if (!visible || !dom.editDecorTrayScroller) {
    syncEditDecorTrayScrollControls();
    return;
  }

  const ownedItems = getStoredDecorEntries();
  const dataKey = [
    runtime.editTankMode ? "1" : "0",
    runtime.placementMode?.decorKey || "",
    ...ownedItems.map(([key, count]) => `${key}:${count}:${formatDecorScale(getDecorScaleDefault(key))}`)
  ].join("|");

  if (shouldRebuildRenderSection("edit-decor-tray-data", dataKey)) {
    const markup = ownedItems.length
      ? ownedItems
        .map(([key, count]) => {
          const decor = runtime.decorMap.get(key) || {
            name: titleFromFile(key),
            path: resolveAppUrl(`assets/decor/${encodeURIComponent(key)}`)
          };
          const placing = runtime.placementMode?.decorKey === key;
          return `
            <button
              class="edit-decor-tile ${placing ? "is-active" : ""}"
              type="button"
              data-tray-place-decor="${key}"
              data-decor-name="${decor.name}"
              title="${decor.name}"
              aria-label="${placing ? `Cancel preview for ${decor.name}` : `Preview and place ${decor.name}`}"
            >
              <span class="edit-decor-tile-surface">
                <img class="edit-decor-tile-thumb" src="${decor.path}" alt="${decor.name}" />
                <span class="edit-decor-tile-count">x${count}</span>
              </span>
            </button>
          `;
        })
        .join("")
      : `<div class="edit-decor-tray-empty">No decor is in storage yet. Open the store to buy something to place.</div>`;

    setMarkupIfChanged("edit-decor-tray", dom.editDecorTrayScroller, markup);
  }

  syncEditDecorTrayScrollControls();
}

function getStoredFishEntries() {
  return [...state.storedFish].filter((fish) => !isFishDead(fish)).sort((left, right) => {
    const leftName = String(left.name || "").toLowerCase();
    const rightName = String(right.name || "").toLowerCase();
    return leftName.localeCompare(rightName) || left.acquiredAt - right.acquiredAt;
  });
}

function syncEditFishTrayScrollControls() {
  if (!dom.editFishTrayScroller || !dom.editFishTrayPrev || !dom.editFishTrayNext) {
    return;
  }

  const scroller = dom.editFishTrayScroller;
  const maxScroll = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
  const visible = !dom.editFishTray?.hidden;

  dom.editFishTrayPrev.disabled = !visible || maxScroll <= 2 || scroller.scrollLeft <= 2;
  dom.editFishTrayNext.disabled = !visible || maxScroll <= 2 || scroller.scrollLeft >= maxScroll - 2;
}

function scrollEditFishTray(direction) {
  if (!dom.editFishTrayScroller) {
    return;
  }

  const distance = Math.max(180, Math.round(dom.editFishTrayScroller.clientWidth * 0.72));
  dom.editFishTrayScroller.scrollBy({
    left: distance * direction,
    behavior: "smooth"
  });

  window.setTimeout(() => syncEditFishTrayScrollControls(), 180);
}

function renderEditFishTray() {
  const visible = runtime.fishEditMode;
  if (dom.editFishTray) {
    dom.editFishTray.hidden = !visible;
  }

  if (!visible || !dom.editFishTrayScroller) {
    syncEditFishTrayScrollControls();
    return;
  }

  const storedFish = getStoredFishEntries();
  const dataKey = [
    runtime.fishEditMode ? "1" : "0",
    ...storedFish.map((fish) => [fish.id, fish.name, fish.speciesId, Number(fish.scale || 1).toFixed(2)].join(":"))
  ].join("|");

  if (shouldRebuildRenderSection("edit-fish-tray-data", dataKey)) {
    const markup = storedFish.length
      ? storedFish.map((fish) => {
        const species = runtime.fishMap.get(fish.speciesId);
        const label = `${fish.name}${species?.name ? ` • ${species.name}` : ""}`;
        return `
          <button
            class="edit-decor-tile"
            type="button"
            data-tray-restore-fish="${fish.id}"
            data-decor-name="${label}"
            title="${label}"
            aria-label="Return ${fish.name} to the tank"
          >
            <span class="edit-decor-tile-surface">
              <img class="edit-decor-tile-thumb" src="${species?.asset || ""}" alt="${label}" />
            </span>
          </button>
        `;
      }).join("")
      : `<div class="edit-decor-tray-empty">No living fish are in storage right now.</div>`;

    setMarkupIfChanged("edit-fish-tray", dom.editFishTrayScroller, markup);
  }

  syncEditFishTrayScrollControls();
}

function renderFishList(now) {
  const currentSlot = getCurrentMealSlot(now);
  const currentFed = Boolean(state.feedHistory[currentSlot.key]);
  const starterSpecies = getStarterFishSpecies();
  const starterName = starterSpecies?.name || "starter fish";
  const emergencyStarter = starterSpecies ? getFishPurchaseCost(starterSpecies.id) === 0 : false;
  const starterCost = starterSpecies ? starterSpecies.cost : 1;
  const fishListDataKey = [
    currentSlot.key,
    currentFed ? 1 : 0,
    starterSpecies?.id || "",
    starterCost,
    emergencyStarter ? 1 : 0,
    runtime.collapsedSections.fishTank ? 1 : 0,
    runtime.collapsedSections.fishDead ? 1 : 0,
    runtime.collapsedSections.fishStorage ? 1 : 0,
    Math.round(getTankDirtiness(now) * 100),
    state.fish.map((fish) => [
      fish.id,
      fish.name,
      fish.speciesId,
      fish.healthUnits,
      Number(fish.scale).toFixed(2),
      fish.acquiredAt,
      fish.deadAt || "",
      fish.fedStreak || 0
    ].join(",")).join(";"),
    state.storedFish.map((fish) => [
      fish.id,
      fish.name,
      fish.speciesId,
      fish.healthUnits,
      Number(fish.scale).toFixed(2),
      fish.acquiredAt,
      fish.deadAt || "",
      fish.fedStreak || 0
    ].join(",")).join(";")
  ].join("|");
  if (!shouldRebuildRenderSection("fish-list-data", fishListDataKey)) {
    return;
  }

  const livingTankFish = state.fish.filter((fish) => !isFishDead(fish));
  const deadTankFish = state.fish.filter((fish) => isFishDead(fish));
  const deadStoredFish = state.storedFish.filter((fish) => isFishDead(fish));
  const livingStoredFish = getStoredFishEntries();
  const deadFishEntries = [
    ...deadTankFish.map((fish) => ({ fish, inStorage: false })),
    ...deadStoredFish.map((fish) => ({ fish, inStorage: true }))
  ];

  const tankCollapsed = isSidebarSectionCollapsed("fishTank");
  const deadCollapsed = deadFishEntries.length ? isSidebarSectionCollapsed("fishDead") : true;
  const storageCollapsed = isSidebarSectionCollapsed("fishStorage");

  const activeMarkup = livingTankFish.length
    ? [...livingTankFish]
      .sort((left, right) => left.healthUnits - right.healthUnits || left.acquiredAt - right.acquiredAt)
      .map((fish) => renderManagedFishCard(fish, now, {
        currentSlot,
        currentFed,
        inStorage: false
      }))
      .join("")
    : `<div class="empty-state">The tank is empty. Open the cart and ${emergencyStarter ? `grab a free ${starterName} to get back on your feet.` : `grab a ${starterName} for ${starterCost} ${pluralize("coin", starterCost)} to get started.`}</div>`;

  const deadMarkup = deadFishEntries.length
    ? [...deadFishEntries]
      .sort((left, right) => (left.fish.deadAt || 0) - (right.fish.deadAt || 0))
      .map((entry) => renderManagedFishCard(entry.fish, now, {
        currentSlot,
        currentFed,
        inStorage: entry.inStorage
      }))
      .join("")
    : `<div class="empty-state">No dead fish are in the tank or storage.</div>`;

  const storedMarkup = livingStoredFish.length
    ? [...livingStoredFish]
      .sort((left, right) => left.acquiredAt - right.acquiredAt)
      .map((fish) => renderManagedFishCard(fish, now, {
        currentSlot,
        currentFed,
        inStorage: true
      }))
      .join("")
    : `<div class="empty-state">No living fish are in storage.</div>`;

  setMarkupIfChanged("fish-list", dom.fishList, `
    <section class="info-card stack-section collapsible-section ${tankCollapsed ? "is-collapsed" : ""}" data-collapsible-section="fishTank">
      <div class="collapsible-header">
        <button
          class="collapsible-toggle"
          type="button"
          data-collapsible-toggle="fishTank"
          aria-expanded="${String(!tankCollapsed)}"
        >
          <span class="collapsible-title">In Tank</span>
          <span class="collapsible-icon" data-collapsible-icon>${tankCollapsed ? "⬇️" : "⬆️"}</span>
        </button>
        <div class="collapsible-meta">
          <strong>${livingTankFish.length}</strong>
        </div>
      </div>
      <div class="card-stack" data-collapsible-body ${tankCollapsed ? "hidden" : ""}>${activeMarkup}</div>
    </section>

    ${deadFishEntries.length ? `
      <section class="info-card stack-section collapsible-section ${deadCollapsed ? "is-collapsed" : ""}" data-collapsible-section="fishDead">
        <div class="collapsible-header">
          <button
            class="collapsible-toggle"
            type="button"
            data-collapsible-toggle="fishDead"
            aria-expanded="${String(!deadCollapsed)}"
          >
            <span class="collapsible-title">Dead Fish</span>
            <span class="collapsible-icon" data-collapsible-icon>${deadCollapsed ? "⬇️" : "⬆️"}</span>
          </button>
          <div class="collapsible-meta">
            <button class="small-button warn" data-dispose-all-dead title="Dispose of all dead fish" aria-label="Dispose of all dead fish">&#128701;</button>
            <strong>${deadFishEntries.length}</strong>
          </div>
        </div>
        <div class="card-stack" data-collapsible-body ${deadCollapsed ? "hidden" : ""}>${deadMarkup}</div>
      </section>
    ` : ""}

    <section class="info-card stack-section collapsible-section ${storageCollapsed ? "is-collapsed" : ""}" data-collapsible-section="fishStorage">
      <div class="collapsible-header">
        <button
          class="collapsible-toggle"
          type="button"
          data-collapsible-toggle="fishStorage"
          aria-expanded="${String(!storageCollapsed)}"
        >
          <span class="collapsible-title">Storage</span>
          <span class="collapsible-icon" data-collapsible-icon>${storageCollapsed ? "⬇️" : "⬆️"}</span>
        </button>
        <div class="collapsible-meta">
          <strong>${livingStoredFish.length}</strong>
        </div>
      </div>
      <div class="card-stack" data-collapsible-body ${storageCollapsed ? "hidden" : ""}>${storedMarkup}</div>
    </section>
  `);
}

function renderManagedFishCard(fish, now, options = {}) {
  const species = runtime.fishMap.get(fish.speciesId);
  if (!species) {
    return "";
  }

  const dead = isFishDead(fish);
  const comfort = getFishComfort(fish, now);
  const age = formatFishAge(fish.acquiredAt, now);
  const defaultScale = getFishScaleDefault(fish.speciesId);
  const usesDefaultScale = Math.abs(defaultScale - fish.scale) < 0.001;
  const inStorage = Boolean(options.inStorage);
  const detritusFish = isDetritusFish(species);
  const nearbyCorpse = !inStorage && !dead ? getNearestDeadFish(fish) : null;
  const currentSlot = options.currentSlot || getCurrentMealSlot(now);
  const currentFed = Boolean(options.currentFed);
  const hungry = !detritusFish && !currentFed && fish.acquiredAt <= currentSlot.start;
  const settling = fish.acquiredAt > currentSlot.start;
  const status = inStorage
    ? (dead ? "Stored for disposal." : "Stored safely outside the tank.")
    : dead
      ? "Upside down at the surface."
      : detritusFish
        ? "Suctioned to the back glass."
        : nearbyCorpse
          ? "Drawn toward a dead tankmate."
          : currentFed
            ? "Fed for this meal"
            : settling
              ? "Starts care next meal"
              : hungry
                ? "Hungry right now"
                : "Waiting";
  const healthNote = dead
    ? "Passed away. It no longer eats, poops, or earns coins."
    : detritusFish
      ? "Feeds on grime and poop instead of pellets."
      : nearbyCorpse
        ? "Stress is elevated while a dead fish remains in the tank."
        : fish.healthUnits < MAX_HEALTH_UNITS
          ? `Recovery streak: ${Math.min(fish.fedStreak, RECOVERY_FEED_STREAK)}/${RECOVERY_FEED_STREAK}`
          : "Full hearts and thriving.";
  const rewardLabel = dead
    ? "No meal coins"
    : detritusFish
      ? "Cleans tank"
      : `+${species.mealCoins} / meal`;

  return `
    <article class="fish-card">
      <img class="fish-thumb" src="${species.asset}" alt="${fish.name}" />
      <div class="fish-card-main">
        <div class="fish-card-heading">
          <div class="fish-card-title">
            <strong>${fish.name}</strong>
            <div class="fish-species">${species.name}</div>
          </div>
          ${dead ? `<button class="small-button warn" data-dispose-fish="${fish.id}" title="Dispose of ${fish.name}" aria-label="Dispose of ${fish.name}">&#128701;</button>` : ""}
        </div>
        <div class="hearts">${renderHearts(fish.healthUnits)}</div>
        <div class="fish-status-line">${status}</div>
        <div class="fish-trait-row">
          <span class="fish-trait">${inStorage ? (dead ? "Status: Deceased" : "Storage") : dead ? "Status: Deceased" : `Comfort: ${comfort.label}`}</span>
          ${detritusFish ? `<span class="fish-trait">Diet: grime + waste</span>` : ""}
          <span class="fish-trait">Swim: ${formatSwimStyle(species.swimStyle)}</span>
          <span class="fish-trait">Age: ${age}</span>
        </div>
        <div class="mini-note fish-health-note">${healthNote}</div>
      </div>
      <div class="fish-actions fish-card-actions">
        <div class="size-controls">
          <button class="small-button icon alt" data-size-fish="${fish.id}" data-size-direction="-1" aria-label="Make ${fish.name} smaller">-</button>
          <span class="size-badge">${formatFishScale(fish.scale)}</span>
          <button class="small-button icon alt" data-size-fish="${fish.id}" data-size-direction="1" aria-label="Make ${fish.name} larger">+</button>
        </div>
        <div class="fish-card-button-row">
          <span class="price-tag">${rewardLabel}</span>
          <button class="small-button" data-copy-fish-size="${fish.id}" title="Use ${formatFishScale(fish.scale)} as the default size for future ${species.name.toLowerCase()}s">
            ${usesDefaultScale ? "Default Set" : "Set Default"}
          </button>
          <button class="small-button alt" data-open-fish="${fish.id}">Details</button>
          ${dead ? "" : `
            <button class="small-button alt" data-sell-fish="${fish.id}">
              Sell
            </button>
            <button class="small-button ${inStorage ? "" : "warn"}" data-${inStorage ? "restore-fish" : "store-fish"}="${fish.id}">
              ${inStorage ? "Return to Tank" : "Put Away"}
            </button>
          `}
        </div>
      </div>
    </article>
  `;
}

function renderFishInspector(now) {
  const managed = getManagedFishById(runtime.selectedFishId);
  if (!managed) {
    runtime.selectedFishId = null;
    dom.fishInspector.hidden = true;
    if (dom.inspectorDisposeFish) {
      dom.inspectorDisposeFish.hidden = true;
      delete dom.inspectorDisposeFish.dataset.disposeFish;
    }
    return;
  }

  const { fish, inStorage } = managed;
  const species = runtime.fishMap.get(fish.speciesId);
  const dead = isFishDead(fish);
  const comfort = inStorage ? { label: "Stored", value: 1 } : getFishComfort(fish, now);
  dom.fishInspector.hidden = false;
  dom.inspectorTitle.textContent = fish.name;
  dom.inspectorSpecies.textContent = species?.name || "Fish";
  dom.inspectorHealth.innerHTML = renderHearts(fish.healthUnits);
  dom.inspectorComfort.textContent = inStorage
    ? (dead ? "Stored for disposal" : "Stored safely")
    : dead
      ? "Deceased"
      : `${comfort.label} (${Math.round(comfort.value * 100)}%)`;
  dom.inspectorAge.textContent = formatFishAge(fish.acquiredAt, now);
  if (dom.inspectorDisposeFish) {
    dom.inspectorDisposeFish.hidden = !dead;
    dom.inspectorDisposeFish.disabled = !dead;
    if (dead) {
      dom.inspectorDisposeFish.dataset.disposeFish = fish.id;
      dom.inspectorDisposeFish.title = `Dispose of ${fish.name}`;
      dom.inspectorDisposeFish.setAttribute("aria-label", `Dispose of ${fish.name}`);
    } else {
      delete dom.inspectorDisposeFish.dataset.disposeFish;
      dom.inspectorDisposeFish.removeAttribute("title");
      dom.inspectorDisposeFish.setAttribute("aria-label", "Dispose of fish");
    }
  }

  if (document.activeElement !== dom.fishNameInput || dom.fishNameInput.dataset.fishId !== fish.id) {
    dom.fishNameInput.value = fish.name;
    dom.fishNameInput.dataset.fishId = fish.id;
  }
}

function renderDecorShop() {
  if (!runtime.decorCatalog.length) {
    setMarkupIfChanged("decor-shop", dom.decorShop, `<div class="empty-state">No decor PNGs were found in the decor folder yet.</div>`);
    return;
  }

  const markup = [...runtime.decorCatalog]
    .sort((left, right) => left.cost - right.cost || left.name.localeCompare(right.name))
    .map((decor) => {
      const affordable = state.coins >= decor.cost;
      const owned = state.decorInventory[decor.key] || 0;
      return `
        <article class="shop-card">
          <img class="shop-thumb" src="${decor.path}" alt="${decor.name}" />
          <div class="shop-meta">
            <div>
              <strong>${decor.name}</strong>
              <div class="fish-meta">${owned} in storage</div>
            </div>
            <div class="fish-meta"></div>
          </div>
          <div class="shop-meta">
            <span class="price-tag">${decor.cost} ${pluralize("coin", decor.cost)}</span>
            <button class="buy-button" data-buy-decor="${decor.key}" ${affordable ? "" : "disabled"}>
              Buy Decor
            </button>
          </div>
        </article>
      `;
    })
    .join("");

  setMarkupIfChanged("decor-shop", dom.decorShop, markup);
}

function renderDecorInventory() {
  const inventoryDataKey = [
    runtime.placementMode?.decorKey || "",
    ...Object.entries(state.decorInventory)
      .filter(([, count]) => count > 0)
      .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
      .map(([key, count]) => `${key}:${count}:${formatDecorScale(getDecorScaleDefault(key))}`)
  ].join("|");
  if (!shouldRebuildRenderSection("decor-inventory-data", inventoryDataKey)) {
    return;
  }

  const ownedItems = Object.entries(state.decorInventory)
    .filter(([, count]) => count > 0)
    .sort(([leftKey], [rightKey]) => {
      const left = runtime.decorMap.get(leftKey)?.name || leftKey;
      const right = runtime.decorMap.get(rightKey)?.name || rightKey;
      return left.localeCompare(right);
    });

  if (!ownedItems.length) {
    setMarkupIfChanged("decor-inventory", dom.decorInventory, `
      <div class="empty-state">
        Storage is empty. Open the decor cart to buy cute plants, shells, and props.
      </div>
    `);
    return;
  }

  const markup = ownedItems
    .map(([key, count]) => {
      const decor = runtime.decorMap.get(key) || {
        name: titleFromFile(key),
        path: resolveAppUrl(`assets/decor/${encodeURIComponent(key)}`)
      };
      const placing = runtime.placementMode?.decorKey === key;
      const defaultScale = getDecorScaleDefault(key);

      return `
        <article class="mini-card">
          <img class="decor-thumb" src="${decor.path}" alt="${decor.name}" />
          <div>
            <strong>${decor.name}</strong>
            <div class="fish-meta">${count} in storage.</div>
            <div class="mini-note">Default size: ${formatDecorScale(defaultScale)}</div>
          </div>
          <div class="mini-card-actions">
            <div class="size-controls">
              <button class="small-button icon alt" data-size-decor="${key}" data-size-direction="-1" aria-label="Make ${decor.name} smaller">-</button>
              <span class="size-badge">${formatDecorScale(defaultScale)}</span>
              <button class="small-button icon alt" data-size-decor="${key}" data-size-direction="1" aria-label="Make ${decor.name} larger">+</button>
            </div>
            <button class="small-button alt" data-sell-decor-inventory="${key}">Sell</button>
            <button class="small-button ${placing ? "alt" : ""}" data-place-decor="${key}">
              ${placing ? "Cancel Preview" : "Preview & Place"}
            </button>
          </div>
        </article>
      `;
    })
    .join("");
  setMarkupIfChanged("decor-inventory", dom.decorInventory, markup);
}

function renderPlacedDecor() {
  const placedDecorDataKey = state.placedDecor
    .map((item) => [
      item.id,
      item.decorKey,
      getDecorTankLayer(item),
      Number(item.xNorm).toFixed(4),
      Number(item.yNorm).toFixed(4),
      Number(item.scale).toFixed(2)
    ].join(","))
    .join("|");
  if (!shouldRebuildRenderSection("placed-decor-data", placedDecorDataKey)) {
    return;
  }

  if (!state.placedDecor.length) {
    setMarkupIfChanged("placed-decor", dom.placedDecorList, `
      <div class="empty-state">
        Nothing is placed yet.
      </div>
    `);
    return;
  }

  const sorted = [...state.placedDecor].sort((left, right) => {
    if (getDecorTankLayer(left) !== getDecorTankLayer(right)) {
      return getDecorTankLayer(right) - getDecorTankLayer(left);
    }
    return left.yNorm - right.yNorm;
  });
  const markup = sorted
    .map((item) => {
      const decor = runtime.decorMap.get(item.decorKey) || {
        name: titleFromFile(item.decorKey),
        path: resolveAppUrl(`assets/decor/${encodeURIComponent(item.decorKey)}`)
      };

      return `
        <article class="mini-card">
          <img class="decor-thumb" src="${decor.path}" alt="${decor.name}" />
          <div>
            <strong>${decor.name}</strong>
            <div class="fish-meta">Placed in the tank.</div>
            <div class="mini-note">Layer ${getDecorTankLayer(item)}. Current size: ${formatDecorScale(item.scale)}</div>
          </div>
          <div class="mini-card-actions">
            <div class="size-controls">
              <button class="small-button icon alt" data-resize-placed="${item.id}" data-size-direction="-1" aria-label="Make ${decor.name} smaller">-</button>
              <span class="size-badge">${formatDecorScale(item.scale)}</span>
              <button class="small-button icon alt" data-resize-placed="${item.id}" data-size-direction="1" aria-label="Make ${decor.name} larger">+</button>
            </div>
            <button class="small-button" data-copy-size="${item.id}">Set Default</button>
            <button class="small-button alt" data-sell-decor-placed="${item.id}">Sell</button>
            <button class="small-button alt" data-store-decor="${item.id}">Put Away</button>
          </div>
        </article>
      `;
    })
    .join("");
  setMarkupIfChanged("placed-decor", dom.placedDecorList, markup);
}

function renderBackgrounds() {
  if (!runtime.backgroundCatalog.length) {
    setMarkupIfChanged("background-list", dom.backgroundList, `<div class="empty-state">No background PNGs were found.</div>`);
    return;
  }

  const markup = runtime.backgroundCatalog
    .map((background) => {
      const selected = state.selectedBackground === background.key;
      return `
        <article class="background-card ${selected ? "is-selected" : ""}">
          <img class="background-thumb" src="${background.path}" alt="${background.name}" />
          <div>
            <strong>${background.name}</strong>
            <div class="fish-meta">${background.blurb}</div>
          </div>
          <button data-select-background="${background.key}">
            ${selected ? "Using This Background" : "Use Background"}
          </button>
        </article>
      `;
    })
    .join("");
  setMarkupIfChanged("background-list", dom.backgroundList, markup);
}

function renderTankAssets() {
  renderSceneAssetCards(dom.tankAssetList, runtime.tankCatalog, state.selectedTankAsset, "data-select-tank", "Use Tank", "Using This Tank");
}

function renderFilterAssets() {
  renderSceneAssetCards(dom.filterAssetList, runtime.filterCatalog, state.selectedFilterAsset, "data-select-filter", "Use Filter", "Using This Filter");
}

function renderGravelAssets() {
  renderSceneAssetCards(
    dom.gravelAssetList,
    runtime.gravelCatalog,
    state.selectedGravelAsset,
    "data-select-gravel",
    "Use Gravel",
    "Using This Gravel"
  );
}

function renderBubbleAssets() {
  renderSceneAssetCards(dom.bubbleAssetList, runtime.bubbleCatalog, state.selectedBubbleAsset, "data-select-bubble", "Use Bubbles", "Using These Bubbles");
}

function renderSceneAssetCards(container, items, selectedKey, attributeName, useLabel, activeLabel) {
  if (!container) {
    return;
  }

  if (!items.length) {
    setMarkupIfChanged(`scene-assets-${attributeName}`, container, `<div class="empty-state">No PNG assets were found in this folder yet.</div>`);
    return;
  }

  const markup = items
    .map((item) => {
      const selected = selectedKey === item.key;
      return `
        <article class="background-card ${selected ? "is-selected" : ""}">
          <img class="scene-thumb" src="${item.path}" alt="${item.name}" />
          <div>
            <strong>${item.name}</strong>
            <div class="fish-meta">${item.blurb}</div>
          </div>
          <button ${attributeName}="${item.key}">
            ${selected ? activeLabel : useLabel}
          </button>
        </article>
      `;
    })
    .join("");
  setMarkupIfChanged(`scene-assets-${attributeName}`, container, markup);
}

function renderControls(now) {
  const currentSlot = getCurrentMealSlot(now);
  const currentMealServed = Boolean(state.feedHistory[currentSlot.key]);
  const selectedActiveFish = state.fish.find((fish) => fish.id === runtime.selectedFishId);
  const hasCaveDecor = state.placedDecor.some((item) => isCaveDecorKey(item.decorKey));
  const hasCaveFishCandidate = hasCaveDecor && state.fish.some((fish) => {
    const species = runtime.fishMap.get(fish.speciesId);
    return species && species.behavior !== "sucker" && species.caveEnabled !== false && !isFishDead(fish);
  });

  dom.feedButton.disabled = !getFeedableLivingFish().length || currentMealServed;

  dom.resetMealsButton.hidden = !DEBUG_MODE;
  dom.debugDamageFishButton.hidden = !DEBUG_MODE;
  dom.addCoinsButton.hidden = !DEBUG_MODE;
  dom.maxDirtButton.hidden = !DEBUG_MODE;
  dom.deleteAllButton.hidden = !DEBUG_MODE;
  dom.debugCaveButton.hidden = !DEBUG_MODE;

  dom.resetMealsButton.disabled = !DEBUG_MODE;
  dom.addCoinsButton.disabled = !DEBUG_MODE;
  dom.maxDirtButton.disabled = !DEBUG_MODE;
  dom.deleteAllButton.disabled = !DEBUG_MODE;
  dom.debugDamageFishButton.disabled = !DEBUG_MODE || !selectedActiveFish || isFishDead(selectedActiveFish);
  dom.debugCaveButton.disabled = !DEBUG_MODE || (!hasCaveFishCandidate && !runtime.debugNightCaveMode);
  dom.debugCaveButton.classList.toggle("is-active", runtime.debugNightCaveMode);
  dom.debugCaveButton.title = runtime.debugNightCaveMode
    ? "Debug: Disable Forced Cave Behavior"
    : "Debug: Force Cave Behavior";
  dom.debugCaveButton.setAttribute(
    "aria-label",
    runtime.debugNightCaveMode
      ? "Debug: Disable Forced Cave Behavior"
      : "Debug: Force Cave Behavior"
  );

  dom.spongeButton.classList.toggle("is-active", runtime.cleaningMode);
  dom.scoopButton?.classList.toggle("is-active", runtime.scoopMode);
  dom.editModeDockButton?.classList.toggle("is-active", runtime.editTankMode);
  if (dom.editModeDockButton) {
    dom.editModeDockButton.title = runtime.editTankMode ? "Edit Decor (Active)" : "Edit Decor";
    dom.editModeDockButton.setAttribute("aria-label", runtime.editTankMode ? "Edit Decor (Active)" : "Edit Decor");
  }
  dom.fishEditModeDockButton?.classList.toggle("is-active", runtime.fishEditMode);
  if (dom.fishEditModeDockButton) {
    dom.fishEditModeDockButton.title = runtime.fishEditMode ? "Manage Fish (Active)" : "Manage Fish";
    dom.fishEditModeDockButton.setAttribute("aria-label", runtime.fishEditMode ? "Manage Fish (Active)" : "Manage Fish");
  }
  dom.toggleEditMode.classList.toggle("is-active", runtime.editTankMode);
  dom.toggleEditMode.textContent = runtime.editTankMode ? "Editing" : "Edit";
  if (dom.scrubProgressLabel) {
    dom.scrubProgressLabel.textContent = `${Math.round(getScrubCoverage() * 100)}%`;
  }
  if (dom.scrubProgressBar) {
    dom.scrubProgressBar.style.width = `${Math.round(getScrubCoverage() * 100)}%`;
  }

  renderPlacementHint();

  dom.tankStage.style.cursor = (runtime.cleaningMode || runtime.scoopMode)
    ? "none"
    : (runtime.dragState || runtime.fishDragState)
      ? "grabbing"
      : (runtime.editTankMode || runtime.fishEditMode)
        ? "grab"
        : "default";
  renderToolCursor();
}

function renderToolCursor() {
  const visible = (runtime.cleaningMode || runtime.scoopMode) && runtime.pointerStagePx;
  dom.toolCursor.hidden = !visible;

  if (!visible) {
    dom.toolCursor.textContent = "";
    return;
  }

  dom.toolCursor.textContent = runtime.scoopMode ? "🥄" : "🧽";
  dom.toolCursor.style.left = `${runtime.pointerStagePx.x}px`;
  dom.toolCursor.style.top = `${runtime.pointerStagePx.y}px`;
}

function animationLoop(frameTime) {
  const now = Date.now();
  const deltaSeconds = runtime.lastAnimationFrameAt
    ? Math.min(0.05, (frameTime - runtime.lastAnimationFrameAt) / 1000)
    : 0.016;
  runtime.lastAnimationFrameAt = frameTime;
  updateCleaningTransition(now);
  updateSplashBursts(now);
  updateFishMotion(now, deltaSeconds);
  renderTank(now);
  window.requestAnimationFrame(animationLoop);
}

function handleBettaPassAttacks(now) {
  if (!state?.fish?.length) {
    runtime.bettaPassLocks.clear();
    return;
  }

  const draggedFishId = runtime.fishDragState?.fishId || null;
  const livingFish = state.fish.filter((fish) => !isFishDead(fish));
  if (livingFish.length < 2) {
    runtime.bettaPassLocks.clear();
    return;
  }

  const nextLocks = new Set();
  const landedMessages = [];

  for (const attacker of livingFish) {
    if (attacker.id === draggedFishId || attacker.speciesId !== "betta" || attacker.activity !== "roam" || Number(attacker.motionLevel) < 0.18) {
      continue;
    }

    const travelDistance = Math.hypot(attacker.targetXNorm - attacker.xNorm, attacker.targetYNorm - attacker.yNorm);
    if (travelDistance < 0.01) {
      continue;
    }

    for (const target of livingFish) {
      if (target.id === attacker.id || target.id === draggedFishId || isFishDead(target)) {
        continue;
      }

      const pairKey = `${attacker.id}:${target.id}`;
      const isLocked = runtime.bettaPassLocks.has(pairKey);
      const distanceNorm = Math.hypot(attacker.xNorm - target.xNorm, attacker.yNorm - target.yNorm);
      const proximityLimit = isLocked ? BETTA_ATTACK_RELEASE_RANGE_NORM : BETTA_ATTACK_TRIGGER_RANGE_NORM;
      if (distanceNorm > proximityLimit) {
        continue;
      }

      nextLocks.add(pairKey);
      if (isLocked || Math.random() >= BETTA_ATTACK_PASS_CHANCE) {
        continue;
      }

      const outcome = applyFishDamage(
        target,
        1,
        now,
        `${attacker.name} attacked ${target.name} for half a heart.`,
        `${target.name} died after an attack from ${attacker.name}.`
      );
      if (!outcome.changed) {
        continue;
      }

      if (!outcome.dead) {
        makeFishScurryFromAttack(target, attacker, now);
      } else {
        spawnBloodCloud(target.xNorm, target.yNorm, 1.5);
      }

      landedMessages.push(outcome.dead ? `${attacker.name} killed ${target.name}.` : `${attacker.name} nipped ${target.name}.`);
    }
  }

  runtime.bettaPassLocks = nextLocks;
  if (!landedMessages.length) {
    return;
  }

  saveState();
  renderUi(now);
  showToast(landedMessages.length === 1 ? landedMessages[0] : `${landedMessages.length} betta attacks landed.`);
}

function spawnBloodCloud(xNorm, yNorm, intensity = 1) {
  const count = Math.round(42 + intensity * 36);

  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = randomBetween(0.00006, 0.00034) * intensity;
    const drift = randomBetween(0.00002, 0.0001);

    runtime.bloodClouds.push({
      xNorm: xNorm + randomBetween(-0.003, 0.003),
      yNorm: yNorm + randomBetween(-0.003, 0.003),
      vx: Math.cos(angle) * speed + randomBetween(-drift, drift),
      vy: Math.sin(angle) * speed + randomBetween(-drift, drift) - randomBetween(0.000005, 0.00003),
      radiusNorm: randomBetween(0.0018, 0.0046) * randomBetween(0.9, 1.4),
      alpha: randomBetween(0.22, 0.5),
      lifeMs: randomBetween(2200, 4600),
      ageMs: 0
    });
  }
}

function updateBloodClouds(deltaSeconds) {
  if (!runtime.bloodClouds.length) {
    return;
  }

  for (let i = runtime.bloodClouds.length - 1; i >= 0; i -= 1) {
    const cloud = runtime.bloodClouds[i];
    cloud.ageMs += deltaSeconds * 1000;

    if (cloud.ageMs >= cloud.lifeMs) {
      runtime.bloodClouds.splice(i, 1);
      continue;
    }

    const t = cloud.ageMs / cloud.lifeMs;

    cloud.xNorm += cloud.vx * deltaSeconds * 60;
    cloud.yNorm += cloud.vy * deltaSeconds * 60;

    cloud.vx *= 0.992;
    cloud.vy *= 0.992;

    cloud.radiusNorm *= 1.006;

    if (t < 0.25) {
      cloud.alpha *= 0.997;
    } else if (t < 0.65) {
      cloud.alpha *= 0.991;
    } else {
      cloud.alpha *= 0.972;
    }
  }
}

function drawBloodClouds() {
  if (!runtime.bloodClouds.length) {
    return;
  }

  tankContext.save();
  tankContext.globalCompositeOperation = "source-over";

  for (const cloud of runtime.bloodClouds) {
    const x = cloud.xNorm * TANK_WIDTH;
    const y = cloud.yNorm * TANK_HEIGHT;
    const radius = cloud.radiusNorm * Math.min(TANK_WIDTH, TANK_HEIGHT);

    const gradient = tankContext.createRadialGradient(x, y, 0, x, y, radius);

    gradient.addColorStop(0, `rgba(110, 0, 0, ${clamp(cloud.alpha * 1.15, 0, 1)})`);
    gradient.addColorStop(0.22, `rgba(92, 0, 0, ${clamp(cloud.alpha * 0.9, 0, 1)})`);
    gradient.addColorStop(0.55, `rgba(58, 0, 0, ${clamp(cloud.alpha * 0.42, 0, 1)})`);
    gradient.addColorStop(1, "rgba(20, 0, 0, 0)");

    tankContext.fillStyle = gradient;
    tankContext.beginPath();
    tankContext.arc(x, y, radius, 0, Math.PI * 2);
    tankContext.fill();
  }

  tankContext.restore();
}

function makeFishScurryFromAttack(victim, attacker, now) {
  if (!victim || !attacker || isFishDead(victim)) {
    return;
  }

  const species = runtime.fishMap.get(victim.speciesId);
  if (!species) {
    return;
  }

  const dx = victim.xNorm - attacker.xNorm;
  const dy = victim.yNorm - attacker.yNorm;
  const distance = Math.max(0.0001, Math.hypot(dx, dy));
  const nx = dx / distance;
  const ny = dy / distance;

  victim.activity = "roam";
  victim.feedingPelletId = null;
  clearFishCaveBehavior(victim);
  victim.hangoutDecorId = null;
  victim.blockedDecorId = null;
  victim.blockedDecorUntil = null;
  victim.wallAvoidUntil = now + 450;

  victim.panicUntil = now + randomBetween(1100, 1900);
  victim.panicSpeedBoost = randomBetween(1.9, 2.5);
  victim.targetXNorm = clamp(victim.xNorm + nx * randomBetween(0.16, 0.26), 0.08, 0.92);
  victim.targetYNorm = clamp(victim.yNorm + ny * randomBetween(0.08, 0.16), 0.14, 0.8);
  victim.targetAt = victim.panicUntil;

  if (Math.abs(victim.targetXNorm - victim.xNorm) > 0.001) {
    setFishDirection(victim, victim.targetXNorm >= victim.xNorm ? 1 : -1, species, now);
  }

  spawnBloodCloud(
    clamp(victim.xNorm + randomBetween(-0.004, 0.004), 0.08, 0.92),
    clamp(victim.yNorm + randomBetween(-0.004, 0.004), 0.14, 0.8),
    0.9
  );
}

function retargetFishAfterBlockedMove(fish, species, resolvedMove, attemptedXNorm, attemptedYNorm, now) {
  if (!fish || !species || fish.activity !== "roam") {
    return;
  }

  const blockedX = Math.abs(resolvedMove.xNorm - attemptedXNorm) > 0.0005;
  const blockedY = Math.abs(resolvedMove.yNorm - attemptedYNorm) > 0.0005;

  if (!blockedX && !blockedY) {
    return;
  }

  if (fish.caveState) {
    fish.targetAt = Math.max(Number(fish.targetAt) || 0, now + 1200);
    fish.wallAvoidUntil = now + 220;
    return;
  }

  if (resolvedMove?.blockingCave) {
    const blocking = resolvedMove.blockingCave;
    const safeFrontLayer = Math.max(1, clampTankLayer((blocking.span?.front || 3) - 1));
    setFishTankLayers(fish, safeFrontLayer, safeFrontLayer);
    setFishDesiredTankLayer(fish, safeFrontLayer);
    fish.hangoutDecorId = null;
    fish.blockedDecorId = blocking.item?.id || null;
    fish.blockedDecorUntil = now + 2400;
    fish.wallAvoidUntil = now + 420;
    fish.targetXNorm = clamp(attemptedXNorm, 0.08, 0.92);
    fish.targetYNorm = clamp(attemptedYNorm, 0.14, 0.8);
    fish.targetAt = now + 1400 + Math.hypot(fish.xNorm - fish.targetXNorm, fish.yNorm - fish.targetYNorm) * 12000;
    if (Math.abs(fish.targetXNorm - fish.xNorm) > 0.002) {
      setFishDirection(fish, fish.targetXNorm >= fish.xNorm ? 1 : -1, species, now);
    }
    return;
  }

  if (Number.isFinite(fish.wallAvoidUntil) && now < fish.wallAvoidUntil) {
    return;
  }

  const awayX = blockedX
    ? (attemptedXNorm >= fish.xNorm ? -1 : 1)
    : (Math.random() < 0.5 ? -1 : 1);

  const awayY = blockedY
    ? (attemptedYNorm >= fish.yNorm ? -1 : 1)
    : (Math.random() < 0.5 ? -1 : 1);

  const horizontalDistance = blockedX
    ? randomBetween(0.1, 0.2)
    : randomBetween(0.04, 0.1);

  const verticalDistance = blockedY
    ? randomBetween(0.08, 0.16)
    : randomBetween(0.03, 0.08);

  const blockedDecorId = fish.hangoutDecorId || fish.blockedDecorId || null;

  fish.targetXNorm = clamp(fish.xNorm + awayX * horizontalDistance, 0.08, 0.92);
  fish.targetYNorm = clamp(fish.yNorm + awayY * verticalDistance, 0.14, 0.8);
  fish.targetAt = now + 900 + Math.random() * 900;
  fish.wallAvoidUntil = now + 650;
  fish.hangoutDecorId = null;
  fish.blockedDecorId = blockedDecorId;
  fish.blockedDecorUntil = now + 3200;

  if (species.speedMode === "dynamic") {
    fish.swimSpeed = normalizeFishSpeed(
      species,
      randomBetween(
        Math.max(species.speedMin, species.speedMax * 0.58),
        species.speedMax
      )
    );
  }

  if (Math.abs(fish.targetXNorm - fish.xNorm) > 0.002) {
    setFishDirection(fish, fish.targetXNorm >= fish.xNorm ? 1 : -1, species, now);
  }
}

function updateFishMotion(now, deltaSeconds) {
  if (!state?.fish.length) {
    runtime.bettaPassLocks.clear();
    return;
  }
  const activelyDraggedFishId = runtime.fishDragState?.fishId || null;
  let retargetsThisFrame = 0;

  for (const fish of state.fish) {
    const species = runtime.fishMap.get(fish.speciesId);
    if (!species) {
      continue;
    }

    if (fish.id === activelyDraggedFishId) {
      fish.activity = "roam";
      fish.feedingPelletId = null;
      fish.targetXNorm = fish.xNorm;
      fish.targetYNorm = fish.yNorm;
      fish.targetAt = now + 1200;
      fish.hangoutDecorId = null;
      fish.motionLevel = clamp(fish.motionLevel + (0.18 - fish.motionLevel) * Math.min(1, deltaSeconds * 6), 0.04, 0.4);
      fish.wiggleClock += deltaSeconds * 0.42;
      setFishTankLayers(
        fish,
        species.behavior === "sucker" ? TANK_DEPTH_LAYERS : getFishTankLayer(fish),
        species.behavior === "sucker" ? TANK_DEPTH_LAYERS : getFishTankLayer(fish)
      );
      continue;
    }

    if (isFishDead(fish)) {
      fish.activity = "dead";
      fish.feedingPelletId = null;
      setFishTankLayers(
        fish,
        species.behavior === "sucker" ? TANK_DEPTH_LAYERS : getFishTankLayer(fish),
        species.behavior === "sucker" ? TANK_DEPTH_LAYERS : getFishTankLayer(fish)
      );
      fish.hangoutDecorId = null;
      fish.panicUntil = null;
      fish.panicSpeedBoost = null;
      fish.entryStartedAt = null;
      fish.entryDurationMs = 0;
      fish.entryFromYNorm = null;
      fish.entrySplashTriggered = false;
      fish.turnStartedAt = null;
      fish.turnDurationMs = 0;
      fish.displayDirection = Number(fish.direction) < 0 ? -1 : 1;
      fish.displayAngle = fish.displayDirection < 0 ? Math.PI : 0;
      fish.turnFromDirection = fish.displayDirection;
      fish.turnToDirection = fish.displayDirection;
      fish.turnFromAngle = fish.displayAngle;
      fish.turnToAngle = fish.displayAngle;
      fish.turnSpinDirection = fish.displayDirection < 0 ? 1 : -1;
      const surfaceYNorm = clamp((WATER_SURFACE_Y + 18) / TANK_HEIGHT, 0.12, 0.2);
      fish.yNorm = clamp(fish.yNorm + (surfaceYNorm - fish.yNorm) * Math.min(1, deltaSeconds * 1.05), 0.12, 0.8);
      fish.xNorm = clamp(
        fish.xNorm + Math.sin(now / 2600 + fish.phase * Math.PI * 2) * deltaSeconds * 0.0036,
        0.08,
        0.92
      );
      fish.motionLevel = clamp(fish.motionLevel + (0.05 - fish.motionLevel) * Math.min(1, deltaSeconds * 3), 0.02, 0.18);
      fish.wiggleClock += deltaSeconds * 0.18;
      continue;
    }

    updateFishTurnState(fish, species, now);

    if (species.behavior === "sucker") {
      setFishTankLayers(fish, TANK_DEPTH_LAYERS, TANK_DEPTH_LAYERS);
      fish.hangoutDecorId = null;
      if (fish.activity === "feeding") {
        fish.activity = "roam";
        fish.feedingPelletId = null;
      }
    }

    if (pushFishOutOfBlockingCave(fish, species, now)) {
      fish.motionLevel = clamp(fish.motionLevel + (0.42 - fish.motionLevel) * Math.min(1, deltaSeconds * 5), 0.08, 0.7);
    }

    if (fish.entryStartedAt && fish.entryDurationMs > 0) {
      const progress = clamp((now - fish.entryStartedAt) / fish.entryDurationMs, 0, 1);
      fish.motionLevel = clamp(fish.motionLevel + (0.2 - fish.motionLevel) * Math.min(1, deltaSeconds * 6), 0.04, 0.4);
      fish.wiggleClock += deltaSeconds * 1.15;
      setFishTankLayers(
        fish,
        species.behavior === "sucker" ? TANK_DEPTH_LAYERS : getFishTankLayer(fish),
        species.behavior === "sucker" ? TANK_DEPTH_LAYERS : getFishTankLayer(fish)
      );
      fish.hangoutDecorId = null;

      if (!fish.entrySplashTriggered && progress >= 0.22) {
        fish.entrySplashTriggered = true;
        spawnFishReturnSplash(fish.xNorm);
      }

      if (progress < 1) {
        continue;
      }

      fish.entryStartedAt = null;
      fish.entryDurationMs = 0;
      fish.entryFromYNorm = null;
      fish.entrySplashTriggered = false;
      fish.targetAt = now + 900 + Math.random() * 1400;
    }

    const pellet = fish.feedingPelletId ? state.floatingPellets.find((entry) => entry.id === fish.feedingPelletId) : null;
    if (fish.activity === "feeding" && pellet) {
      if (fish.caveState) {
        abortFishCaveBehavior(fish, now, false);
      }
      const pelletPose = getPelletPose(pellet, now);
      fish.targetXNorm = pelletPose.xNorm;
      fish.targetYNorm = clamp(pelletPose.yNorm + 0.014, 0.1, 0.24);
      fish.targetAt = now + 1000;
      setFishDesiredTankLayer(
        fish,
        species.behavior === "sucker" ? TANK_DEPTH_LAYERS : clampTankLayer(Math.min(getFishTankLayer(fish), 2))
      );
      fish.hangoutDecorId = null;
    } else if (fish.activity === "feeding" && !pellet) {
      fish.activity = "roam";
      fish.feedingPelletId = null;
      fish.targetAt = now + 800 + Math.random() * 1200;
      fish.swimSpeed = normalizeFishSpeed(species);
      setFishDesiredTankLayer(fish, species.behavior === "sucker" ? TANK_DEPTH_LAYERS : getFishTankLayer(fish));
      fish.hangoutDecorId = null;
    }

    const caveBehaviorOwnsMovement = fish.activity === "roam" && updateFishCaveBehavior(fish, species, now);
    if (fish.activity === "roam" && !caveBehaviorOwnsMovement && now >= fish.targetAt) {
      if (retargetsThisFrame >= MAX_FISH_RETARGETS_PER_FRAME) {
        fish.targetAt = now + 30 + Math.random() * 60;
      } else {
        assignSwimTarget(fish, species, now);
        retargetsThisFrame += 1;
      }
    }

    const moveDx = fish.targetXNorm - fish.xNorm;
    const moveDy = fish.targetYNorm - fish.yNorm;
    const moveDistance = Math.hypot(moveDx, moveDy);
    const isDirectedSwim = fish.activity === "feeding";
    let motionTarget = fish.activity === "feeding" ? 1 : 0.08;
    let handledDirectionThisFrame = false;

    if (moveDistance > 0.0001) {
      let speedMultiplier = fish.activity === "feeding" ? FEED_CHASE_MULTIPLIER : 1;

      if (Number.isFinite(fish.panicUntil)) {
        if (now < fish.panicUntil) {
          speedMultiplier *= Number(fish.panicSpeedBoost) || 2;
        } else {
          fish.panicUntil = null;
          fish.panicSpeedBoost = null;
        }
      }

      const speed = fish.swimSpeed * FISH_MOTION_SCALE * speedMultiplier;
      const step = Math.min(moveDistance, speed * deltaSeconds);

      const nextXNorm = clamp(fish.xNorm + (moveDx / moveDistance) * step, 0.08, 0.92);
      const nextYNorm = clamp(fish.yNorm + (moveDy / moveDistance) * step, 0.14, 0.8);

      if (species.behavior === "sucker") {
        fish.xNorm = nextXNorm;
        fish.yNorm = nextYNorm;
      } else {
        const resolvedMove = resolveFishCaveCollision(fish, nextXNorm, nextYNorm, now);
        fish.xNorm = resolvedMove.xNorm;
        fish.yNorm = resolvedMove.yNorm;

        if (resolvedMove.blocked && fish.activity === "roam") {
          if (fish.hangoutDecorId) {
            fish.blockedDecorId = fish.hangoutDecorId;
          }
          retargetFishAfterBlockedMove(fish, species, resolvedMove, nextXNorm, nextYNorm, now);
          handledDirectionThisFrame = true;
        }

        if (fish.caveState) {
          enforceActiveCaveMaskRule(fish, species, now);
        }
      }

      const travelRatio = clamp(step / Math.max(0.00001, speed * deltaSeconds), 0, 1);
      motionTarget = fish.activity === "feeding"
        ? 1
        : clamp(0.44 + travelRatio * 0.5 + Math.min(0.16, moveDistance * 4.5), 0.16, 0.92);

      if (species.behavior === "sucker") {
        setSuckerFishAngle(fish, Math.atan2(moveDy, moveDx), now);
      } else if (!handledDirectionThisFrame) {
        const facingDx = fish.targetXNorm - fish.xNorm;
        if (Math.abs(facingDx) > FISH_DIRECTION_TARGET_DEADZONE_NORM) {
          setFishDirection(fish, facingDx >= 0 ? 1 : -1, species, now);
          handledDirectionThisFrame = true;
        }
      }
    }

    if (
      fish.activity === "roam" &&
      !fish.caveState &&
      !handledDirectionThisFrame &&
      !(Number.isFinite(fish.wallAvoidUntil) && now < fish.wallAvoidUntil)
    ) {
      const nearbyCorpse = getNearestDeadFish(fish);
      if (nearbyCorpse && nearbyCorpse.distanceNorm <= 0.16) {
        if (species.behavior === "sucker") {
          setSuckerFishAngle(
            fish,
            Math.atan2(nearbyCorpse.fish.yNorm - fish.yNorm, nearbyCorpse.fish.xNorm - fish.xNorm),
            now
          );
        } else {
          setFishDirection(fish, nearbyCorpse.fish.xNorm >= fish.xNorm ? 1 : -1, species, now);
        }
      }
    }

    fish.motionLevel = clamp(
      fish.motionLevel + (motionTarget - fish.motionLevel) * Math.min(1, deltaSeconds * (isDirectedSwim ? 6.2 : 4.2)),
      0.04,
      1
    );
    fish.wiggleClock += deltaSeconds * (0.35 + fish.motionLevel * (1.85 + fish.swimSpeed * 18));

    if (fish.activity === "feeding" && pellet) {
      const pelletPose = getPelletPose(pellet, now);
      if (Math.hypot(fish.xNorm - pelletPose.xNorm, fish.yNorm - pelletPose.yNorm) < 0.024) {
        state.floatingPellets = state.floatingPellets.filter((entry) => entry.id !== pellet.id);
        fish.activity = "roam";
        fish.feedingPelletId = null;
        setFishDesiredTankLayer(fish, species.behavior === "sucker" ? TANK_DEPTH_LAYERS : getFishTankLayer(fish));
        fish.hangoutDecorId = null;
        fish.targetXNorm = clamp(fish.xNorm + (Math.random() - 0.5) * 0.18, 0.08, 0.92);
        fish.targetYNorm = clamp(0.14 + Math.random() * 0.66, 0.14, 0.8);
        fish.targetAt = now + 1500 + Math.random() * 2400;
        fish.swimSpeed = normalizeFishSpeed(species);
      }
    }

    syncFishDrawLayer(fish, species, now);
  }

  handleBettaPassAttacks(now);
  updateBloodClouds(deltaSeconds);
}

function assignSwimTarget(fish, species, now) {
  const vigilTarget = pickDeadFishVigilTarget(fish, species, now);
  if (vigilTarget) {
    fish.targetXNorm = vigilTarget.xNorm;
    fish.targetYNorm = vigilTarget.yNorm;
    fish.targetAt = now + vigilTarget.lingerMs;
    setFishDesiredTankLayer(fish, species.behavior === "sucker" ? TANK_DEPTH_LAYERS : vigilTarget.targetLayer);
    fish.hangoutDecorId = null;
    if (species.speedMode === "dynamic") {
      fish.swimSpeed = normalizeFishSpeed(species, randomBetween(species.speedMin, Math.max(species.speedMin, species.speedMax * 0.86)));
    }
    return;
  }

  if (Number.isFinite(fish.blockedDecorUntil) && now >= fish.blockedDecorUntil) {
    fish.blockedDecorUntil = null;
    fish.blockedDecorId = null;
  }

  if (species.behavior === "sucker") {
    const currentFacing = Math.cos(getFishFacingAngle(fish)) < 0 ? -1 : 1;
    const nearLeftWall = fish.xNorm <= 0.12;
    const nearRightWall = fish.xNorm >= 0.88;
    const nearTopWall = fish.yNorm <= 0.24;
    const nearBottomWall = fish.yNorm >= 0.7;
    const shouldReverse = nearLeftWall || nearRightWall || Math.random() < 0.12;
    const crawlDirection = nearLeftWall
      ? 1
      : nearRightWall
        ? -1
        : (shouldReverse ? -currentFacing : currentFacing);
    const crawlDistance = randomBetween(
      shouldReverse ? 0.14 : 0.22,
      shouldReverse ? 0.24 : 0.4
    );
    const nextXNorm = clamp(fish.xNorm + crawlDirection * crawlDistance + randomBetween(-0.01, 0.01), 0.1, 0.9);
    const verticalShift = nearTopWall
      ? randomBetween(0.05, 0.16)
      : nearBottomWall
        ? -randomBetween(0.05, 0.16)
        : randomBetween(-0.14, 0.14);
    const nextYNorm = clamp(fish.yNorm + verticalShift + randomBetween(-0.015, 0.015), 0.22, 0.72);
    const crawlSpeed = normalizeFishSpeed(species, randomBetween(species.speedMin, species.speedMax));
    const travelDistance = Math.hypot(nextXNorm - fish.xNorm, nextYNorm - fish.yNorm);
    const travelSeconds = travelDistance / Math.max(0.00001, crawlSpeed * FISH_MOTION_SCALE);
    const lingerMultiplier = shouldReverse ? randomBetween(1.12, 1.34) : randomBetween(1.35, 1.7);
    fish.targetXNorm = nextXNorm;
    fish.targetYNorm = nextYNorm;
    fish.targetAt = now + Math.max(
      species.targetMinMs,
      travelSeconds * 1000 * lingerMultiplier,
      species.targetMinMs + Math.random() * Math.max(2400, species.targetMaxMs - species.targetMinMs)
    );
    setFishTankLayers(fish, TANK_DEPTH_LAYERS, TANK_DEPTH_LAYERS);
    fish.hangoutDecorId = null;
    fish.swimSpeed = crawlSpeed;
    return;
  }

  const cavePlan = pickCaveEntryBehavior(species, fish, now);
  if (cavePlan) {
    beginFishCaveBehavior(fish, cavePlan, now);
    if (species.speedMode === "dynamic") {
      fish.swimSpeed = normalizeFishSpeed(species);
    }
    return;
  }

  const hangout = pickDecorHangoutTarget(species, fish, now);
  if (hangout) {
    fish.targetXNorm = hangout.xNorm;
    fish.targetYNorm = hangout.yNorm;
    fish.targetAt = now + hangout.lingerMs;
    setFishDesiredTankLayer(fish, hangout.targetLayer);
    fish.hangoutDecorId = hangout.decorId;
    if (species.speedMode === "dynamic") {
      fish.swimSpeed = normalizeFishSpeed(species);
    }
    return;
  }

  fish.targetXNorm = randomSwimX();
  fish.targetYNorm = randomSwimY();
  fish.targetAt = now + species.targetMinMs + Math.random() * Math.max(200, species.targetMaxMs - species.targetMinMs);
  setFishDesiredTankLayer(
    fish,
    species.behavior === "sucker"
      ? TANK_DEPTH_LAYERS
      : clampTankLayer(1 + Math.floor(Math.random() * TANK_DEPTH_LAYERS))
  );
  fish.hangoutDecorId = null;
  if (species.speedMode === "dynamic") {
    fish.swimSpeed = normalizeFishSpeed(species);
  }
}

function pickDecorHangoutTarget(species, fish = null, now = Date.now()) {
  const chanceByStyle = {
    peaceful: 0.62,
    steady: 0.46,
    sporadic: 0.34
  };

  if (!state.placedDecor.length || Math.random() > (chanceByStyle[species.swimStyle] || 0.4)) {
    return null;
  }

  const zones = getCachedDecorHangoutZones().filter((zone) => {
    if (!fish) {
      return true;
    }

    if (
      fish.blockedDecorId &&
      zone.decorId === fish.blockedDecorId &&
      Number.isFinite(fish.blockedDecorUntil) &&
      now < fish.blockedDecorUntil
    ) {
      return false;
    }

    return true;
  });

  if (!zones.length) {
    return null;
  }

  const zone = zones[Math.floor(Math.random() * zones.length)];
  const targetLayer = clampTankLayer(
    zone.targetLayerMin + Math.floor(Math.random() * (zone.targetLayerMax - zone.targetLayerMin + 1))
  );
  return {
    xNorm: clamp(randomBetween(zone.xMin, zone.xMax), 0.08, 0.92),
    yNorm: clamp(randomBetween(zone.yMin, zone.yMax), 0.16, 0.8),
    targetLayer,
    decorId: zone.decorId,
    lingerMs: zone.lingerMinMs + Math.random() * (zone.lingerMaxMs - zone.lingerMinMs)
  };
}

function getDecorHangoutZonesCacheKey() {
  if (!state?.placedDecor?.length) {
    return "none";
  }

  return state.placedDecor
    .map((item) => [
      item.id,
      item.decorKey,
      Number(item.xNorm).toFixed(4),
      Number(item.yNorm).toFixed(4),
      Number(item.scale).toFixed(4),
      getDecorTankLayer(item)
    ].join("|"))
    .join("::");
}

function getCachedDecorHangoutZones() {
  const cacheKey = getDecorHangoutZonesCacheKey();
  if (runtime.decorHangoutZonesKey === cacheKey && Array.isArray(runtime.decorHangoutZones)) {
    return runtime.decorHangoutZones;
  }

  const zones = buildDecorHangoutZones();
  runtime.decorHangoutZonesKey = cacheKey;
  runtime.decorHangoutZones = zones;
  return zones;
}

function buildDecorHangoutZones() {
  const zones = [];

  for (const item of state.placedDecor) {
    const bounds = getPlacedDecorBounds(item);
    if (!bounds) {
      continue;
    }

    const key = item.decorKey.toLowerCase();
    const decorLayer = getDecorTankLayer(item);
    const behindLayer = clampTankLayer(Math.min(TANK_DEPTH_LAYERS, decorLayer + 1));
    const widthNorm = (bounds.right - bounds.left) / TANK_WIDTH;
    const heightNorm = (bounds.bottom - bounds.top) / TANK_HEIGHT;

    if (/(castle|terracotta|bridge|arch|hide|pagoda)/.test(key)) {
      zones.push({
        decorId: item.id,
        targetLayerMin: behindLayer,
        targetLayerMax: behindLayer,
        xMin: item.xNorm - widthNorm * 0.14,
        xMax: item.xNorm + widthNorm * 0.14,
        yMin: item.yNorm - heightNorm * 0.32,
        yMax: item.yNorm - heightNorm * 0.12,
        lingerMinMs: 6000,
        lingerMaxMs: 11000
      });
    }

    if (/(coral|seaweed|grass|anubias|moss|bloom|bunch)/.test(key)) {
      zones.push({
        decorId: item.id,
        targetLayerMin: behindLayer,
        targetLayerMax: behindLayer,
        xMin: item.xNorm - widthNorm * 0.2,
        xMax: item.xNorm + widthNorm * 0.2,
        yMin: item.yNorm - heightNorm * 0.5,
        yMax: item.yNorm - heightNorm * 0.16,
        lingerMinMs: 5000,
        lingerMaxMs: 9000
      });
    }

    if (/(driftwood|root|shell|chest|rock)/.test(key)) {
      zones.push({
        decorId: item.id,
        targetLayerMin: decorLayer,
        targetLayerMax: behindLayer,
        xMin: item.xNorm - widthNorm * 0.24,
        xMax: item.xNorm + widthNorm * 0.24,
        yMin: item.yNorm - heightNorm * 0.46,
        yMax: item.yNorm - heightNorm * 0.12,
        lingerMinMs: 4600,
        lingerMaxMs: 8200
      });
    }
  }

  return zones;
}

function renderTank(now) {
  const dirtiness = getTankDirtiness(now);
  drawTankBackdrop();
  tankContext.save();
  clipToTankShellBounds(tankContext);
  drawBackground();
  drawFish(now, TANK_DEPTH_LAYERS, { onlyBehavior: "sucker" });
  drawAmbientBubbles(now, 1);
  drawWaterFilter(now);
  drawPellets(now);
  drawTankFloor();
  //drawLooseGravelCap();
  drawGroundShadows(now);
  //drawLooseGravel(now, { surfaceKind: "floor" });
  for (let layer = TANK_DEPTH_LAYERS; layer >= 1; layer -= 1) {
    if (layer === 3) {
      drawAmbientBubbles(now, 2);
    }
    drawDecor(layer, now);
    //drawLooseGravel(now, { surfaceKind: "decor", decorLayer: layer });
    if (layer < TANK_DEPTH_LAYERS) {
      drawFish(now, layer, { excludeBehavior: "sucker" });
    }
  }
  drawDecorBubbleStreams(now);
  drawAmbientBubbles(now, 3);
  //drawLooseGravel(now, { transientOnly: true });
  drawPoops(now);
  drawBloodClouds();
  drawDecorPreview();
  drawActiveDecorLayerCue();
  drawWaterSurface(now);
  drawSplashBursts(now);
  drawForegroundLight();
  tankContext.restore();
  drawGrime(dirtiness);
  drawCleaningSparkles(now);
  glassContext.clearRect(0, 0, TANK_WIDTH, TANK_HEIGHT);
  dom.tankCanvas.style.filter = "none";
  dom.grimeCanvas.style.filter = dirtiness > 0.02
    ? `blur(${(0.18 + dirtiness * 0.7).toFixed(2)}px)`
    : "none";
}

function getTankShellBounds() {
  const outerLeft = 0;
  const outerTop = 0;
  const outerWidth = TANK_WIDTH;
  const outerHeight = TANK_HEIGHT;
  const innerLeft = 0;
  const innerTop = 0;
  const innerWidth = TANK_WIDTH;
  const innerHeight = TANK_HEIGHT;
  return {
    outerLeft,
    outerTop,
    outerWidth,
    outerHeight,
    innerLeft,
    innerTop,
    innerWidth,
    innerHeight
  };
}

function clipToTankShellBounds(context = tankContext) {
  const { outerLeft, outerTop, outerWidth, outerHeight } = getTankShellBounds();
  context.beginPath();
  context.rect(outerLeft, outerTop, outerWidth, outerHeight);
  context.clip();
}

function drawTankBackdrop() {
  tankContext.clearRect(0, 0, TANK_WIDTH, TANK_HEIGHT);
  const background = tankContext.createLinearGradient(0, 0, 0, TANK_HEIGHT);
  background.addColorStop(0, "#09121d");
  background.addColorStop(1, "#03080f");
  tankContext.fillStyle = background;
  tankContext.fillRect(0, 0, TANK_WIDTH, TANK_HEIGHT);
}

function drawBackground() {
  const background = runtime.backgroundMap.get(state.selectedBackground);
  const image = background ? runtime.images.get(background.path) : null;
  const width = TANK_WIDTH - GLASS_MARGIN_X * 2;
  const height = TANK_HEIGHT - WATER_SURFACE_Y - GLASS_MARGIN_BOTTOM;

  tankContext.save();
  tankContext.beginPath();
  tankContext.rect(GLASS_MARGIN_X, WATER_SURFACE_Y, width, height);
  tankContext.clip();

  if (image) {
    tankContext.drawImage(image, GLASS_MARGIN_X, WATER_SURFACE_Y, width, height);
  } else {
    const gradient = tankContext.createLinearGradient(0, WATER_SURFACE_Y, 0, TANK_HEIGHT);
    gradient.addColorStop(0, "#90e0ff");
    gradient.addColorStop(1, "#0d84b4");
    tankContext.fillStyle = gradient;
    tankContext.fillRect(GLASS_MARGIN_X, WATER_SURFACE_Y, width, height);
  }

  const waterTint = tankContext.createLinearGradient(0, WATER_SURFACE_Y, 0, TANK_HEIGHT);
  waterTint.addColorStop(0, "rgba(142, 224, 255, 0.12)");
  waterTint.addColorStop(0.58, "rgba(32, 121, 167, 0.04)");
  waterTint.addColorStop(1, "rgba(4, 28, 44, 0.04)");
  tankContext.fillStyle = waterTint;
  tankContext.fillRect(GLASS_MARGIN_X, WATER_SURFACE_Y, width, height);

  const midWaterMist = tankContext.createLinearGradient(0, WATER_SURFACE_Y + height * 0.28, 0, WATER_SURFACE_Y + height * 0.72);
  midWaterMist.addColorStop(0, "rgba(118, 193, 222, 0)");
  midWaterMist.addColorStop(0.55, "rgba(118, 193, 222, 0.07)");
  midWaterMist.addColorStop(1, "rgba(118, 193, 222, 0)");
  tankContext.fillStyle = midWaterMist;
  tankContext.fillRect(GLASS_MARGIN_X, WATER_SURFACE_Y + height * 0.18, width, height * 0.58);
  tankContext.restore();
}

function drawAmbientBubbles(now, layer = 3) {
  const layerProfile = getAmbientBubbleLayerProfile(layer);
  if (!layerProfile) {
    return;
  }

  tankContext.save();
  tankContext.beginPath();
  tankContext.rect(GLASS_MARGIN_X, WATER_SURFACE_Y + 2, TANK_WIDTH - GLASS_MARGIN_X * 2, TANK_HEIGHT - WATER_SURFACE_Y - GLASS_MARGIN_BOTTOM - 2);
  tankContext.clip();

  for (const bubble of runtime.scene.bubbles) {
    if (getAmbientBubbleRenderPass(bubble.layer || 3) !== layer) {
      continue;
    }

    const bubbleImage = getBubbleSpriteByIndex(bubble.spriteIndex);
    const progress = ((now / 1000) * bubble.speed + bubble.offset) % 1;
    const travelPhase = progress * bubble.wave + bubble.offset * 8;
    const x = bubble.x * TANK_WIDTH
      + Math.sin(travelPhase) * bubble.wobble * layerProfile.wobbleScale
      + Math.cos(now / layerProfile.parallaxMs + bubble.offset * 11) * layerProfile.parallaxPx;
    const y = TANK_HEIGHT - GLASS_MARGIN_BOTTOM - 8 - progress * (TANK_HEIGHT - WATER_SURFACE_Y - 20);
    if (y <= WATER_SURFACE_Y + 2) {
      continue;
    }

    if (bubbleImage && bubble.style === "sprite") {
      const size = bubble.size * bubble.spriteScale * layerProfile.sizeScale;
      tankContext.save();
      tankContext.translate(x, y);
      tankContext.rotate(Math.sin(now / 1600 + bubble.offset * 12) * 0.14);
      tankContext.globalAlpha = bubble.alpha * layerProfile.alphaScale;
      tankContext.drawImage(bubbleImage, -size / 2, -size / 2, size, size);
      tankContext.restore();
      continue;
    }

    if (bubble.style === "cluster") {
      drawBubbleOrb(x, y, bubble.size * 0.78 * layerProfile.sizeScale, bubble.alpha * layerProfile.alphaScale, bubble.stretch);
      drawBubbleOrb(
        x + bubble.size * 0.74 * layerProfile.sizeScale,
        y - bubble.size * 0.48 * layerProfile.sizeScale,
        bubble.size * 0.5 * layerProfile.sizeScale,
        bubble.alpha * 0.84 * layerProfile.alphaScale,
        1.04
      );
      drawBubbleOrb(
        x - bubble.size * 0.6 * layerProfile.sizeScale,
        y + bubble.size * 0.46 * layerProfile.sizeScale,
        bubble.size * 0.42 * layerProfile.sizeScale,
        bubble.alpha * 0.74 * layerProfile.alphaScale,
        0.92
      );
      continue;
    }

    if (bubble.style === "fizz") {
      for (let index = 0; index < bubble.count; index += 1) {
        const offsetY = index * (bubble.size * 0.95 * layerProfile.sizeScale);
        const offsetX = Math.sin(now / 460 + bubble.offset * 14 + index) * 1.8 * layerProfile.wobbleScale;
        drawBubbleOrb(
          x + offsetX,
          y + offsetY,
          bubble.size * (0.26 + index * 0.08) * layerProfile.sizeScale,
          bubble.alpha * (0.85 - index * 0.1) * layerProfile.alphaScale,
          1
        );
      }
      continue;
    }

    drawBubbleOrb(x, y, bubble.size * layerProfile.sizeScale, bubble.alpha * layerProfile.alphaScale, bubble.stretch);
  }

  tankContext.restore();
}

function getAmbientBubbleRenderPass(sourceLayer = 3) {
  const normalizedLayer = clamp(Math.round(Number(sourceLayer) || 3), 1, 5);
  if (normalizedLayer <= 2) {
    return 1;
  }
  if (normalizedLayer === 3) {
    return 2;
  }
  return 3;
}

function getAmbientBubbleLayerProfile(layer = 3) {
  const profiles = {
    1: { alphaScale: 0.42, sizeScale: 0.84, wobbleScale: 0.76, parallaxPx: 3.5, parallaxMs: 7600 },
    2: { alphaScale: 0.68, sizeScale: 1, wobbleScale: 0.94, parallaxPx: 6.2, parallaxMs: 6100 },
    3: { alphaScale: 0.94, sizeScale: 1.15, wobbleScale: 1.12, parallaxPx: 8.4, parallaxMs: 4700 }
  };
  return profiles[layer] || profiles[3];
}

function drawWaterFilter(now) {
  tankContext.save();
  const filterAsset = runtime.filterMap.get(state.selectedFilterAsset);
  const filterImage = filterAsset ? runtime.images.get(filterAsset.path) : null;
  if (!filterImage) {
    tankContext.restore();
    return;
  }
  const filterProfile = getFilterProfile();

  const filterDrawX = FILTER_X - 42;
  const filterDrawY = FILTER_Y - 29;
  const filterDrawWidth = 148;
  const filterDrawHeight = 220;
  // Anchor the flow to the rendered outlet nozzle rather than the full image bounds.
  const outletX = filterDrawX + filterDrawWidth * 0.2 - 8;
  const outletY = filterDrawY + filterDrawHeight * (90 / 260) + 4;
  const flowIntensity = 0.86 + filterProfile.flow * 0.22;

  tankContext.save();
  tankContext.beginPath();
  tankContext.rect(
    GLASS_MARGIN_X,
    WATER_SURFACE_Y - 10,
    TANK_WIDTH - GLASS_MARGIN_X * 2,
    TANK_HEIGHT - WATER_SURFACE_Y - GLASS_MARGIN_BOTTOM + 10
  );
  tankContext.clip();

  const bubbleCount = 16 + Math.round(filterProfile.flow * 5);
  for (let index = 0; index < bubbleCount; index += 1) {
    const lane = index % 4;
    const phase = ((now / (150 + lane * 20)) + index * 0.14) % 1;
    const drift = phase * (242 + filterProfile.flow * 18);
    const x = outletX - drift + Math.sin(now / 170 + index * 1.7) * (1.1 + lane * 0.25);
    const y = outletY + (lane - 1.5) * 1.55 + Math.sin(now / 210 + index * 1.35) * 0.55;
    const radius = 1.1 + (index % 3) * 0.45 + filterProfile.flow * 0.14;
    const alpha = 0.2 + (1 - phase) * 0.28 * flowIntensity;
    drawBubbleOrb(x, y, radius, alpha, 1 + lane * 0.03);
  }

  for (let index = 0; index < 7; index += 1) {
    const pulse = ((now / 120) + index * 0.21) % 1;
    const x = outletX - pulse * (222 + filterProfile.flow * 10);
    const y = outletY + Math.sin(now / 150 + index * 1.2) * 0.65;
    tankContext.fillStyle = `rgba(214, 247, 255, ${(0.08 + (1 - pulse) * 0.12).toFixed(3)})`;
    tankContext.beginPath();
    tankContext.ellipse(x, y, 1.2 + pulse * 1.2, 0.6 + pulse * 0.42, 0, 0, Math.PI * 2);
    tankContext.fill();
  }
  tankContext.restore();

  if (filterImage) {
    tankContext.globalAlpha = 1;
    tankContext.drawImage(filterImage, filterDrawX, filterDrawY, filterDrawWidth, filterDrawHeight);
    tankContext.globalAlpha = 1;
  }
  tankContext.restore();
}

function drawPellets(now) {
  if (!state.floatingPellets.length) {
    return;
  }

  tankContext.save();
  for (const pellet of state.floatingPellets) {
    const pose = getPelletPose(pellet, now);
    const x = pose.xNorm * TANK_WIDTH;
    const y = pose.yNorm * TANK_HEIGHT;
    const surfaceY = WATER_SURFACE_Y + 7 + Math.sin(now / 420 + pellet.sway * Math.PI * 8) * 1.6;

    tankContext.strokeStyle = "rgba(227, 250, 255, 0.42)";
    tankContext.lineWidth = 1.4;
    tankContext.beginPath();
    tankContext.ellipse(x, surfaceY, 10.5, 3.1, 0, 0, Math.PI * 2);
    tankContext.stroke();

    tankContext.globalAlpha = 0.9;
    tankContext.fillStyle = "#825930";
    tankContext.beginPath();
    tankContext.roundRect(x - 5.8, y - 3.3, 11.6, 6.6, 3.2);
    tankContext.fill();

    tankContext.fillStyle = "#a7713b";
    tankContext.beginPath();
    tankContext.roundRect(x - 3.8, y - 2.2, 7.4, 4.4, 2.2);
    tankContext.fill();

    tankContext.fillStyle = "rgba(255,255,255,0.24)";
    tankContext.beginPath();
    tankContext.ellipse(x - 1.6, y - 1.1, 1.8, 1.2, 0.1, 0, Math.PI * 2);
    tankContext.fill();
  }
  tankContext.restore();
}

function drawTankFloor() {
  const gravel = runtime.gravelMap.get(state.selectedGravelAsset) || runtime.gravelCatalog[0] || null;
  const gravelImage = gravel ? runtime.images.get(gravel.path) : null;
  if (!gravelImage) {
    return;
  }

  const left = GLASS_MARGIN_X;
  const right = TANK_WIDTH - GLASS_MARGIN_X;
  const bottom = TANK_HEIGHT - GLASS_MARGIN_BOTTOM;

  const baseTop = getTankFloorSurfaceYAtX(TANK_WIDTH * 0.5) - 26;
  const floorHeight = Math.max(40, bottom - baseTop);

  tankContext.save();

  tankContext.beginPath();
  tankContext.moveTo(left, bottom);

  for (let x = left; x <= right; x += 8) {
    const t = (x - left) / Math.max(1, right - left);

    const wave1 = Math.sin(t * Math.PI * 2 * 1.2) * 8;
    const wave2 = Math.sin(t * Math.PI * 2 * 3.4 + 0.8) * 3;
    const crestBias = Math.sin(t * Math.PI) * 4;

    const y = baseTop + wave1 + wave2 - crestBias;
    tankContext.lineTo(x, y);
  }

  tankContext.lineTo(right, bottom);
  tankContext.closePath();
  tankContext.clip();

  tankContext.drawImage(
    gravelImage,
    left,
    baseTop - 10,
    right - left,
    floorHeight + 20
  );

  tankContext.restore();
}

function invalidateGravelBedCache(clearTintCache = true) {
  runtime.gravelBedCacheKey = "";
  runtime.gravelBedCanvas = null;
  runtime.gravelCapCanvas = null;
  if (clearTintCache) {
    runtime.gravelTintCache.clear();
  }
}

function ensureGravelLayouts() {
  if (!runtime.scene) {
    return;
  }

  const assetKey = runtime.gravelCatalog.map((item) => item.key).join("|");
  const layoutKey = `${state.gravelSeed}|${assetKey}`;
  const contourKey = `${state.gravelSeed}|surface`;
  if (runtime.scene.gravelSurfaceContourKey !== contourKey) {
    runtime.scene.gravelSurfaceContourKey = contourKey;
    runtime.scene.gravelSurfaceContour = buildGravelSurfaceContour(state.gravelSeed || 1);
  }
  if (runtime.scene.gravelLayoutKey === layoutKey) {
    return;
  }

  const rand = mulberry32((state.gravelSeed || 1) ^ 0x6d2b79f5);
  const spriteCount = Math.max(1, runtime.gravelCatalog.length || 1);
  const stamps = [];
  const capStamps = [];
  const floorLeft = GLASS_MARGIN_X - 28;
  const floorRight = TANK_WIDTH - GLASS_MARGIN_X + 28;

  const pushStamp = (stamp, capMultiplier = 0.92) => {
    const nextStamp = {
      ...stamp,
      sortKey: stamp.y + stamp.size * 0.24
    };
    stamps.push(nextStamp);
    const surfaceY = getTankFloorSurfaceYAtX(nextStamp.x);
    if (nextStamp.y - nextStamp.size * 0.18 <= surfaceY + GRAVEL_SURFACE_CAP_DEPTH_PX + nextStamp.size * 0.18) {
      capStamps.push({
        ...nextStamp,
        alpha: clamp(nextStamp.alpha * capMultiplier, 0.6, 1)
      });
    }
  };

  const layRowPass = ({
    rowStepPx,
    depthPx,
    startOffsetPx,
    sizeMin,
    sizeMax,
    advanceMin,
    advanceMax,
    alphaMin,
    alphaMax,
    jitterX,
    jitterY,
    stretchMin,
    stretchMax,
    capMultiplier = 0.92
  }) => {
    const rowCount = Math.max(4, Math.ceil((depthPx + 16) / rowStepPx));
    for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
      const depthRatio = rowIndex / Math.max(1, rowCount - 1);
      let cursorX = floorLeft + randomBetweenWith(rand, -10, 10);
      while (cursorX < floorRight) {
        const sizeBias = 0.92 + depthRatio * 0.22;
        const size = randomBetweenWith(rand, sizeMin * sizeBias, sizeMax * sizeBias);
        const x = cursorX + size * 0.5 + randomBetweenWith(rand, -jitterX, jitterX);
        const surfaceY = getTankFloorSurfaceYAtX(x);
        const y = surfaceY + startOffsetPx + depthRatio * depthPx + randomBetweenWith(rand, -jitterY, jitterY);
        pushStamp({
          x,
          y,
          size,
          rotation: randomBetweenWith(rand, -Math.PI, Math.PI),
          alpha: randomBetweenWith(rand, alphaMin, alphaMax),
          spriteIndex: Math.floor(rand() * spriteCount),
          colorIndex: Math.floor(rand() * 3),
          variantIndex: Math.floor(rand() * GRAVEL_VARIANT_BUCKETS),
          stretchY: randomBetweenWith(rand, stretchMin, stretchMax)
        }, capMultiplier);
        cursorX += Math.max(2.8, size * randomBetweenWith(rand, advanceMin, advanceMax));
      }
    }
  };

  layRowPass({
    rowStepPx: 7,
    depthPx: GRAVEL_BED_DEPTH_PX + 18,
    startOffsetPx: 2,
    sizeMin: GRAVEL_PEBBLE_SIZE_MIN * 0.92,
    sizeMax: GRAVEL_PEBBLE_SIZE_MAX * 1.1,
    advanceMin: 0.8,
    advanceMax: 1.12,
    alphaMin: 0.88,
    alphaMax: 1,
    jitterX: 4.6,
    jitterY: 2.2,
    stretchMin: 0.84,
    stretchMax: 1.2,
    capMultiplier: 0.95
  });

  layRowPass({
    rowStepPx: 6.2,
    depthPx: GRAVEL_BED_DEPTH_PX * 0.7,
    startOffsetPx: 0.5,
    sizeMin: GRAVEL_PEBBLE_SIZE_MIN * 0.62,
    sizeMax: GRAVEL_PEBBLE_SIZE_MAX * 0.84,
    advanceMin: 0.85,
    advanceMax: 1.18,
    alphaMin: 0.78,
    alphaMax: 0.95,
    jitterX: 4.2,
    jitterY: 1.9,
    stretchMin: 0.82,
    stretchMax: 1.24,
    capMultiplier: 0.92
  });

  layRowPass({
    rowStepPx: 4.8,
    depthPx: GRAVEL_SURFACE_CAP_DEPTH_PX + 10,
    startOffsetPx: -1.2,
    sizeMin: GRAVEL_PEBBLE_SIZE_MIN * 0.42,
    sizeMax: GRAVEL_PEBBLE_SIZE_MAX * 0.68,
    advanceMin: 0.92,
    advanceMax: 1.28,
    alphaMin: 0.72,
    alphaMax: 0.9,
    jitterX: 3.1,
    jitterY: 1.35,
    stretchMin: 0.8,
    stretchMax: 1.26,
    capMultiplier: 0.88
  });

  const fillerCount = Math.max(900, Math.ceil(GRAVEL_BED_STAMP_COUNT * 0.18));
  for (let index = 0; index < fillerCount; index += 1) {
    const x = GLASS_MARGIN_X + rand() * (TANK_WIDTH - GLASS_MARGIN_X * 2);
    const surfaceY = getTankFloorSurfaceYAtX(x);
    const depthRatio = Math.pow(rand(), 1.18);
    const nearSurface = rand() < 0.55;
    const size = nearSurface
      ? randomBetweenWith(rand, GRAVEL_PEBBLE_SIZE_MIN * 0.4, GRAVEL_PEBBLE_SIZE_MAX * 0.62)
      : randomBetweenWith(rand, GRAVEL_PEBBLE_SIZE_MIN * 0.56, GRAVEL_PEBBLE_SIZE_MAX * 0.88);
    const y = surfaceY
      + (nearSurface ? randomBetweenWith(rand, -1.2, GRAVEL_SURFACE_CAP_DEPTH_PX + 6) : 5 + depthRatio * (GRAVEL_BED_DEPTH_PX + 14))
      + randomBetweenWith(rand, -1.6, 2.2);
    pushStamp({
      x: x + randomBetweenWith(rand, -7, 7),
      y,
      size,
      rotation: randomBetweenWith(rand, -Math.PI, Math.PI),
      alpha: randomBetweenWith(rand, nearSurface ? 0.72 : 0.8, nearSurface ? 0.9 : 0.96),
      spriteIndex: Math.floor(rand() * spriteCount),
      colorIndex: Math.floor(rand() * 3),
      variantIndex: Math.floor(rand() * GRAVEL_VARIANT_BUCKETS),
      stretchY: randomBetweenWith(rand, 0.82, 1.24)
    }, nearSurface ? 0.86 : 0.9);
  }

  runtime.scene.gravelLayoutKey = layoutKey;
  runtime.scene.gravelBedStamps = stamps.sort((left, right) => left.sortKey - right.sortKey);
  runtime.scene.gravelCapStamps = capStamps.sort((left, right) => left.sortKey - right.sortKey);
}

function getGravelBedCacheKey() {
  const palette = getActiveGravelPalette().join("|");
  const assets = runtime.gravelCatalog.map((item) => item.key).join("|");
  const resolution = getGravelCacheDimensions();
  return `${state.gravelSeed}|${palette}|${assets}|${resolution.width}x${resolution.height}`;
}

function getGravelBedCanvas() {
  ensureGravelLayouts();
  const cacheKey = getGravelBedCacheKey();
  if (runtime.gravelBedCanvas && runtime.gravelCapCanvas && runtime.gravelBedCacheKey === cacheKey) {
    return runtime.gravelBedCanvas;
  }

  const resolution = getGravelCacheDimensions();
  const scaleX = resolution.width / TANK_WIDTH;
  const scaleY = resolution.height / TANK_HEIGHT;
  const canvas = document.createElement("canvas");
  canvas.width = resolution.width;
  canvas.height = resolution.height;
  const context = canvas.getContext("2d");
  if (!context) {
    return null;
  }

  context.setTransform(scaleX, 0, 0, scaleY, 0, 0);
  configureCanvasContext(context);
  renderGravelBedToCanvas(context);

  const capCanvas = document.createElement("canvas");
  capCanvas.width = resolution.width;
  capCanvas.height = resolution.height;
  const capContext = capCanvas.getContext("2d");
  if (!capContext) {
    return null;
  }

  capContext.setTransform(scaleX, 0, 0, scaleY, 0, 0);
  configureCanvasContext(capContext);
  renderGravelCapToCanvas(capContext);
  runtime.gravelBedCanvas = canvas;
  runtime.gravelCapCanvas = capCanvas;
  runtime.gravelBedCacheKey = cacheKey;
  return canvas;
}

function getGravelCapCanvas() {
  if (!getGravelBedCanvas()) {
    return null;
  }
  return runtime.gravelCapCanvas;
}

function getGravelCacheDimensions() {
  const baseWidth = Math.max(TANK_WIDTH, dom.tankCanvas?.width || 0);
  const baseHeight = Math.max(TANK_HEIGHT, dom.tankCanvas?.height || 0);
  return {
    width: Math.max(TANK_WIDTH, Math.round(baseWidth * GRAVEL_CACHE_OVERSAMPLE)),
    height: Math.max(TANK_HEIGHT, Math.round(baseHeight * GRAVEL_CACHE_OVERSAMPLE))
  };
}

function renderGravelBedToCanvas(context) {
  context.clearRect(0, 0, TANK_WIDTH, TANK_HEIGHT);
  if (!runtime.scene?.gravelBedStamps?.length) {
    return;
  }

  context.save();
  traceTankFloorPath(context);
  context.clip();

  const palette = getActiveGravelPalette();
  for (const stamp of runtime.scene.gravelBedStamps) {
    const color = palette[stamp.colorIndex] || palette[0];
    drawGravelPebbleSprite(
      context,
      stamp.x,
      stamp.y,
      stamp.size,
      stamp.rotation,
      stamp.spriteIndex,
      color,
      stamp.alpha,
      stamp.stretchY,
      stamp.variantIndex
    );
  }

  context.restore();
}

function renderGravelCapToCanvas(context) {
  context.clearRect(0, 0, TANK_WIDTH, TANK_HEIGHT);
  if (!runtime.scene?.gravelCapStamps?.length) {
    return;
  }

  context.save();
  traceTankFloorSurfaceBandPath(context);
  context.clip();

  const palette = getActiveGravelPalette();
  for (const stamp of runtime.scene.gravelCapStamps) {
    const color = palette[stamp.colorIndex] || palette[0];
    drawGravelPebbleSprite(
      context,
      stamp.x,
      stamp.y,
      stamp.size,
      stamp.rotation,
      stamp.spriteIndex,
      color,
      stamp.alpha,
      stamp.stretchY,
      stamp.variantIndex
    );
  }

  context.restore();
}

function drawLooseGravel(now, options = {}) {
  const { surfaceKind = null, decorLayer = null, transientOnly = false } = options;
  const loosePebbles = [];
  const draggedExistingId = runtime.pebbleDragState?.existingId || null;

  if (!transientOnly) {
    for (const pebble of state.gravelLivePebbles) {
      if (pebble.id === draggedExistingId) {
        continue;
      }
      if (surfaceKind && pebble.surfaceKind !== surfaceKind) {
        continue;
      }
      if (surfaceKind === "decor" && decorLayer !== null) {
        const decorItem = state.placedDecor.find((item) => item.id === pebble.decorId);
        if (!decorItem || getDecorTankLayer(decorItem) !== decorLayer) {
          continue;
        }
      }
      const pose = resolveLiveGravelPebblePose(pebble);
      if (!pose) {
        continue;
      }
      loosePebbles.push({ pebble, pose, alpha: 1, grounded: true });
    }
  }

  if (transientOnly) {
    for (const falling of runtime.fallingGravelPebbles) {
      loosePebbles.push({ pebble: falling.pebble, pose: getFallingGravelPebblePose(falling, now), alpha: 0.96, grounded: false });
    }

    if (runtime.pebbleDragState) {
      loosePebbles.push({
        pebble: runtime.pebbleDragState.pebble,
        pose: {
          x: runtime.pebbleDragState.pebble.xNorm * TANK_WIDTH,
          y: runtime.pebbleDragState.pebble.yNorm * TANK_HEIGHT
        },
        alpha: 0.98,
        grounded: false
      });
    }
  }

  loosePebbles
    .sort((left, right) => left.pose.y - right.pose.y)
    .forEach(({ pebble, pose, alpha, grounded }) => {
      if (grounded) {
        drawLoosePebbleGrounding(pose, pebble, alpha);
      }
      drawGravelPebbleSprite(
        tankContext,
        pose.x,
        pose.y,
        pebble.size,
        pebble.rotation,
        pebble.spriteIndex,
        getActiveGravelPalette()[pebble.colorIndex] || getActiveGravelPalette()[0],
        alpha * (pebble.alpha || 1),
        pebble.stretchY,
        pebble.variantIndex
      );
    });
}

function drawLoosePebbleGrounding(pose, pebble, alpha) {
  if (!pose || !pebble) {
    return;
  }

  const contactOpacity = pebble.surfaceKind === "decor"
    ? 0.06
    : 0.09 + (1 - clamp(pebble.liftPx / Math.max(1, GRAVEL_LIVE_LAYER_DEPTH_PX), 0, 1)) * 0.1;
  const rx = pebble.size * 0.34;
  const ry = Math.max(1.2, pebble.size * 0.14);
  const offsetY = pebble.surfaceKind === "decor" ? pebble.size * 0.12 : pebble.size * 0.16;

  tankContext.save();
  tankContext.globalAlpha = alpha * contactOpacity;
  tankContext.fillStyle = "rgba(10, 14, 18, 0.88)";
  tankContext.beginPath();
  tankContext.ellipse(pose.x, pose.y + offsetY, rx, ry, 0, 0, Math.PI * 2);
  tankContext.fill();
  tankContext.restore();
}

function drawLooseGravelCap() {
  const capCanvas = getGravelCapCanvas();
  if (!capCanvas) {
    return;
  }

  tankContext.save();
  traceTankFloorSurfaceBandPath(tankContext);
  tankContext.clip();
  tankContext.drawImage(capCanvas, 0, 0, TANK_WIDTH, TANK_HEIGHT);
  tankContext.restore();
}

function drawGravelPebbleSprite(context, x, y, size, rotation, spriteIndex, color, alpha = 1, stretchY = 1, variantIndex = 0) {
  const asset = getGravelPebbleAsset(spriteIndex);
  const tintedSprite = asset ? getTintedGravelPebbleSprite(asset.path, color, variantIndex) : null;
  if (!tintedSprite) {
    return;
  }

  const width = size;
  const height = Math.max(4, width * (tintedSprite.height / tintedSprite.width) * clamp(stretchY, 0.72, 1.32));
  context.save();
  context.translate(x, y);
  context.rotate(rotation);
  context.globalAlpha = alpha;
  context.drawImage(tintedSprite, -width / 2, -height / 2, width, height);
  context.restore();
}

function getGravelPebbleAsset(index = 0) {
  const assets = runtime.gravelCatalog;
  if (!assets.length) {
    return null;
  }

  const normalizedIndex = Number.isFinite(Number(index)) ? Math.floor(Number(index)) : 0;
  const wrappedIndex = ((normalizedIndex % assets.length) + assets.length) % assets.length;
  return assets[wrappedIndex] || assets[0];
}

function getPebbleShapeDescriptor(pebble, poseOverride = null) {
  const asset = getGravelPebbleAsset(pebble?.spriteIndex);
  if (!asset) {
    return null;
  }

  const mask = getImageAlphaMask(asset.path);
  if (!mask) {
    return null;
  }

  const pose = poseOverride || resolveLiveGravelPebblePose(pebble);
  if (!pose) {
    return null;
  }

  const width = pebble.size;
  const height = Math.max(4, width * (mask.height / mask.width) * clamp(pebble.stretchY, 0.72, 1.32));
  const rotation = pebble.rotation || 0;
  const cos = Math.cos(-rotation);
  const sin = Math.sin(-rotation);
  const worldCos = Math.cos(rotation);
  const worldSin = Math.sin(rotation);
  const localToWorld = (localX, localY) => ({
    x: pose.x + localX * worldCos - localY * worldSin,
    y: pose.y + localX * worldSin + localY * worldCos
  });
  const corners = [
    localToWorld(-width / 2, -height / 2),
    localToWorld(width / 2, -height / 2),
    localToWorld(width / 2, height / 2),
    localToWorld(-width / 2, height / 2)
  ];

  return {
    mask,
    pose,
    bounds: {
      left: Math.min(...corners.map((corner) => corner.x)),
      right: Math.max(...corners.map((corner) => corner.x)),
      top: Math.min(...corners.map((corner) => corner.y)),
      bottom: Math.max(...corners.map((corner) => corner.y))
    },
    worldToUv(worldX, worldY) {
      let localX = worldX - pose.x;
      let localY = worldY - pose.y;
      const rotatedX = localX * cos - localY * sin;
      const rotatedY = localX * sin + localY * cos;
      localX = rotatedX;
      localY = rotatedY;
      return {
        u: (localX + width / 2) / width,
        v: (localY + height / 2) / height
      };
    }
  };
}

function getTintedGravelPebbleSprite(spritePath, color, variantIndex = 0) {
  if (!spritePath) {
    return null;
  }

  const normalizedColor = normalizeHexColor(color) || DEFAULT_GRAVEL_PALETTE[0];
  const normalizedVariantIndex = clamp(Math.floor(Number(variantIndex) || 0), 0, GRAVEL_VARIANT_BUCKETS - 1);
  const cacheKey = `${spritePath}|${normalizedColor}|${normalizedVariantIndex}`;
  const cached = runtime.gravelTintCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const image = runtime.images.get(spritePath);
  if (!image?.width || !image?.height) {
    return null;
  }

  const scale = Math.min(GRAVEL_SPRITE_CACHE_SIZE / image.width, GRAVEL_SPRITE_CACHE_SIZE / image.height, 1);
  const width = Math.max(18, Math.round(image.width * scale));
  const height = Math.max(18, Math.round(image.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    return null;
  }

  context.clearRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);
  const imageData = context.getImageData(0, 0, width, height);
  const sourceStats = getPebbleSourceStats(spritePath, width, height, imageData.data);
  const targetHsl = rgbToHsl(hexToRgb(normalizedColor) || hexToRgb(DEFAULT_GRAVEL_PALETTE[0]));
  const variantCenter = (GRAVEL_VARIANT_BUCKETS - 1) / 2;
  const variantOffset = (normalizedVariantIndex - variantCenter) / Math.max(1, variantCenter);
  const targetHue = normalizeHueUnit(targetHsl.h + variantOffset * 0.022);
  const hueDelta = getHueDeltaUnit(sourceStats.avgHue, targetHue);
  const satNudge = variantOffset * 0.055;
  const lightNudge = variantOffset * 0.016;
  const pixels = imageData.data;

  for (let index = 0; index < pixels.length; index += 4) {
    const alpha = pixels[index + 3];
    if (alpha <= 6) {
      continue;
    }

    const hsl = rgbToHsl({
      r: pixels[index],
      g: pixels[index + 1],
      b: pixels[index + 2]
    });

    let nextHue = targetHue;
    let nextSat = hsl.s;
    let nextLight = hsl.l;

    if (hsl.s > 0.035) {
      nextHue = normalizeHueUnit(hsl.h + hueDelta);
      nextSat = clamp(hsl.s * (0.96 + targetHsl.s * 0.16 + satNudge) + targetHsl.s * 0.05, 0.05, 1);
      nextLight = clamp(hsl.l * (1 + lightNudge), 0, 1);
    } else if (targetHsl.s > 0.08) {
      nextSat = clamp(hsl.s + targetHsl.s * 0.08, 0, 0.16);
    }

    const rgb = hslToRgb({ h: nextHue, s: nextSat, l: nextLight });
    pixels[index] = rgb.r;
    pixels[index + 1] = rgb.g;
    pixels[index + 2] = rgb.b;
  }

  context.putImageData(imageData, 0, 0);

  runtime.gravelTintCache.set(cacheKey, canvas);
  return canvas;
}

function getPebbleSourceStats(spritePath, width, height, sourcePixels = null) {
  const cacheKey = `${spritePath}|${width}x${height}`;
  const cached = runtime.gravelSourceStats.get(cacheKey);
  if (cached) {
    return cached;
  }

  let pixels = sourcePixels;
  if (!pixels) {
    const image = runtime.images.get(spritePath);
    if (!image?.width || !image?.height) {
      return { avgHue: 0 };
    }
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) {
      return { avgHue: 0 };
    }
    context.drawImage(image, 0, 0, width, height);
    pixels = context.getImageData(0, 0, width, height).data;
  }

  let sumX = 0;
  let sumY = 0;
  let weightTotal = 0;
  for (let index = 0; index < pixels.length; index += 4) {
    const alpha = pixels[index + 3] / 255;
    if (alpha <= 0.03) {
      continue;
    }

    const hsl = rgbToHsl({
      r: pixels[index],
      g: pixels[index + 1],
      b: pixels[index + 2]
    });
    if (hsl.s <= 0.035) {
      continue;
    }

    const weight = alpha * (0.3 + hsl.s * 0.7) * (0.55 + Math.abs(hsl.l - 0.5));
    sumX += Math.cos(hsl.h * Math.PI * 2) * weight;
    sumY += Math.sin(hsl.h * Math.PI * 2) * weight;
    weightTotal += weight;
  }

  const stats = {
    avgHue: weightTotal > 0 ? normalizeHueUnit(Math.atan2(sumY, sumX) / (Math.PI * 2)) : 0
  };
  runtime.gravelSourceStats.set(cacheKey, stats);
  return stats;
}

function decorKeyHasTag(item, tag) {
  return String(item?.decorKey || "").toLowerCase().includes(String(tag || "").toLowerCase());
}

function drawDecorWarped(image, drawX, drawY, width, height, item, now, motion = null) {
  const resolvedMotion = motion || getDecorMotion(item, now);
  const sliceCount = Math.max(16, Math.round(height / 8));
  const sliceHeight = height / sliceCount;

  for (let i = 0; i < sliceCount; i += 1) {
    const srcY = (i / sliceCount) * image.height;
    const srcH = image.height / sliceCount;
    const t = (i + 0.5) / sliceCount;
    const sliceOffset = getDecorSliceOffset(item, now, t, resolvedMotion);
    const destY = drawY + i * sliceHeight + sliceOffset.y;

    tankContext.drawImage(
      image,
      0,
      srcY,
      image.width,
      srcH,
      drawX + sliceOffset.x,
      destY,
      width,
      sliceHeight + 0.6
    );
  }
}

function getDecorSliceOffset(item, now, t, motion = null) {
  const resolvedMotion = motion || getDecorMotion(item, now);
  const motionPhase = resolvedMotion.phase;
  let offsetX = 0;
  let offsetY = 0;

  if (resolvedMotion.isLure) {
    const bodyStart = 0.7;
    if (t >= bodyStart) {
      offsetX += resolvedMotion.bobX;
      offsetY += resolvedMotion.bobY;
    } else {
      const progress = clamp(t / bodyStart, 0, 1);
      const eased = Math.pow(progress, 1.35);
      const lineArc = Math.sin(progress * Math.PI);
      const lineSway = Math.sin(now / 1220 + motionPhase * 0.9 + progress * 2.4) * 1.35 * lineArc;
      offsetX += resolvedMotion.bobX * eased + lineSway;
      offsetY += resolvedMotion.bobY * eased;
    }

    return { x: offsetX, y: offsetY };
  }

  const phase = resolvedMotion.phase;

  if (resolvedMotion.isSeaweed && !resolvedMotion.isFloating && t <= 0.75) {
    const local = 1 - (t / 0.75);
    const strength = local * local;
    offsetX += Math.sin(now / 860 + phase) * 5.5 * strength;
  }

  if (resolvedMotion.isFloating && t >= 0.25) {
    const local = (t - 0.25) / 0.75;
    const strength = local * local;
    offsetX += Math.sin(now / 1080 + phase * 1.15) * 2.4 * strength;
  }

  offsetX += resolvedMotion.isFloating ? resolvedMotion.bobX : 0;
  offsetY += resolvedMotion.isFloating ? resolvedMotion.bobY : 0;
  return { x: offsetX, y: offsetY };
}

function getDecorMotion(item, now) {
  const key = String(item?.decorKey || "").toLowerCase();
  const phase = item.xNorm * 11.73 + item.yNorm * 7.19;
  const isFloating = key.includes("floating");
  const isSeaweed = key.includes("seaweed");
  const isLure = key.includes("lure");
  const lureBobX = isLure
    ? Math.sin(now / 980 + phase * 0.85) * 2.1 + Math.sin(now / 1630 + phase * 1.4) * 0.7
    : 0;
  const lureBobY = isLure
    ? Math.sin(now / 790 + phase) * 2.2 + Math.cos(now / 1280 + phase * 0.7) * 0.85
    : 0;

  return {
    isFloating,
    isSeaweed,
    isLure,
    phase,
    bobX: isLure ? lureBobX : isFloating ? Math.sin(now / 980 + phase * 0.85) * 0.8 : 0,
    bobY: isLure ? lureBobY : isFloating ? Math.sin(now / 760 + phase) * 1.4 : 0
  };
}

function drawGroundShadows(now) {
  shadowContext.clearRect(0, 0, TANK_WIDTH, TANK_HEIGHT);
  shadowContext.save();
  traceTankFloorPath(shadowContext);
  shadowContext.clip();

  const decorShadowItems = [...state.placedDecor].sort((left, right) => left.yNorm - right.yNorm);
  for (const item of decorShadowItems) {
    const decor = runtime.decorMap.get(item.decorKey);
    const image = decor ? runtime.images.get(decor.path) : null;
    if (!decor || !image) {
      continue;
    }

    const width = decor.width * item.scale;
    const height = width * (image.height / image.width);
    const motion = getDecorMotion(item, now);
    const x = item.xNorm * TANK_WIDTH + ((motion.isFloating || motion.isLure) ? motion.bobX : 0);
    const y = item.yNorm * TANK_HEIGHT + ((motion.isFloating || motion.isLure) ? motion.bobY : 0);
    drawProjectedShadow(shadowContext, x, y, width, height, 0.18, 0.24);
  }

  const fishShadowItems = [...state.fish].sort((left, right) => left.yNorm - right.yNorm);
  for (const fish of fishShadowItems) {
    const species = runtime.fishMap.get(fish.speciesId);
    const image = species ? runtime.images.get(species.asset) : null;
    if (!species || !image || species.behavior === "sucker") {
      continue;
    }

    const pose = getFishPose(fish, species, now);
    const width = species.width * fish.scale;
    const height = width * (image.height / image.width);
    drawFishProjectedShadow(shadowContext, pose.x, pose.y + height * 0.14, width, height, 0.15, species.shadowScale || 0.28);
  }
  shadowContext.restore();

  tankContext.save();
  tankContext.globalCompositeOperation = "multiply";
  tankContext.drawImage(runtime.shadowCanvas, 0, 0);
  tankContext.restore();
}

function drawProjectedShadow(context, x, objectBottomY, width, height, opacity, widthScale) {
  const floorY = getTankFloorSurfaceYAtX(x) + 8;
  const heightAboveFloor = Math.max(0, floorY - objectBottomY);
  const shadowWidth = Math.max(16, width * (widthScale + Math.min(0.12, heightAboveFloor / 640)));
  const shadowHeight = Math.max(8, shadowWidth * 0.18);
  const offsetX = 12 + Math.min(30, heightAboveFloor * 0.08);
  const alpha = clamp(opacity - heightAboveFloor / 1500, 0.05, opacity);
  // context.fillStyle = `rgba(6, 15, 24, ${alpha.toFixed(3)})`;
  // context.beginPath();
  // context.ellipse(x + offsetX, floorY, shadowWidth, shadowHeight, -0.08, 0, Math.PI * 2);
  // context.fill();
}

function drawFishProjectedShadow(context, x, objectBottomY, width, height, opacity, widthScale) {
  const floorY = getTankFloorSurfaceYAtX(x) + 7;
  const heightAboveFloor = Math.max(0, floorY - objectBottomY);
  const baseWidth = width * clamp(widthScale, 0.14, 0.3) * 0.82;
  const altitudeStretch = Math.min(width * 0.04, heightAboveFloor * 0.022);
  const shadowWidth = clamp(baseWidth + altitudeStretch, 12, Math.max(26, width * 0.3));
  const shadowHeight = Math.max(5, shadowWidth * 0.14);
  const offsetX = 8 + Math.min(18, heightAboveFloor * 0.045);
  const alpha = clamp(opacity - heightAboveFloor / 1800, 0.04, opacity * 0.92);
  context.fillStyle = `rgba(6, 15, 24, ${alpha.toFixed(3)})`;
  context.beginPath();
  context.ellipse(x + offsetX, floorY, shadowWidth, shadowHeight, -0.08, 0, Math.PI * 2);
  context.fill();
}

function drawDecor(layer = null, now = Date.now()) {
  const sorted = [...state.placedDecor]
    .filter((item) => {
      if (layer === null) {
        return true;
      }

      const span = getDecorLayerSpan(item.decorKey, getDecorTankLayer(item));
      return layer >= span.min && layer <= span.max;
    })
    .sort((left, right) => left.yNorm - right.yNorm);

  for (const item of sorted) {
    const decor = runtime.decorMap.get(item.decorKey);
    if (!decor) {
      continue;
    }

    const span = getDecorLayerSpan(item.decorKey, getDecorTankLayer(item));

    let imagePath = decor.path;

    if (isCaveDecorKey(item.decorKey)) {
      if (layer === span.back && decor.bgPath) {
        imagePath = decor.bgPath;
      } else if (layer === span.mid) {
        continue;
      } else if (layer === span.front) {
        imagePath = decor.path;
      } else {
        continue;
      }
    } else if (layer !== null && layer !== span.front) {
      continue;
    }

    const image = runtime.images.get(imagePath);
    if (!image) {
      continue;
    }

    const width = decor.width * item.scale;
    const height = width * (image.height / image.width);
    const x = item.xNorm * TANK_WIDTH;
    const y = item.yNorm * TANK_HEIGHT;
    const drawX = x - width / 2;
    const drawY = y - height;
    const motion = getDecorMotion(item, now);

    if (motion.isFloating || motion.isSeaweed || motion.isLure) {
      drawDecorWarped(image, drawX, drawY, width, height, item, now, motion);
    } else {
      tankContext.drawImage(image, drawX, drawY, width, height);
    }
  }
}

function drawDecorPreview() {
  if (!runtime.placementMode || runtime.dragState || !runtime.placementPreview) {
    return;
  }

  const decor = runtime.decorMap.get(runtime.placementMode.decorKey);
  if (!decor) {
    return;
  }

  const image = runtime.images.get(decor.path);
  if (!image) {
    return;
  }

  const width = decor.width * (Number(runtime.placementMode.scale) || getDecorScaleDefault(decor.key));
  const height = width * (image.height / image.width);
  const x = runtime.placementPreview.xNorm * TANK_WIDTH;
  const y = runtime.placementPreview.yNorm * TANK_HEIGHT;

  tankContext.save();
  tankContext.globalAlpha = 0.72;
  tankContext.fillStyle = "rgba(120, 215, 235, 0.18)";
  tankContext.beginPath();
  tankContext.ellipse(x, y + 3, width * 0.34, Math.max(10, width * 0.08), 0, 0, Math.PI * 2);
  tankContext.fill();
  tankContext.drawImage(image, x - width / 2, y - height, width, height);
  tankContext.restore();
}

function drawActiveDecorLayerCue() {
  if (runtime.placementMode && runtime.placementPreview && !runtime.dragState) {
    const decor = runtime.decorMap.get(runtime.placementMode.decorKey);
    const image = decor ? runtime.images.get(decor.path) : null;
    if (decor && image) {
      const width = decor.width * (Number(runtime.placementMode.scale) || getDecorScaleDefault(decor.key));
      const height = width * (image.height / image.width);
      drawDecorLayerBadge(
        runtime.placementPreview.xNorm * TANK_WIDTH,
        runtime.placementPreview.yNorm * TANK_HEIGHT - height - 16,
        runtime.placementMode.tankLayer || runtime.decorPlacementLayer,
        runtime.placementMode.decorKey
      );
    }
  }

  if (runtime.dragState) {
    const item = state.placedDecor.find((entry) => entry.id === runtime.dragState.placedId);
    const decor = item ? runtime.decorMap.get(item.decorKey) : null;
    const image = decor ? runtime.images.get(decor.path) : null;
    if (item && decor && image) {
      const width = decor.width * item.scale;
      const height = width * (image.height / image.width);
      drawDecorLayerBadge(
        item.xNorm * TANK_WIDTH,
        item.yNorm * TANK_HEIGHT - height - 16,
        runtime.dragState.tankLayer || item.tankLayer || DEFAULT_TANK_LAYER,
        item.decorKey
      );
    }
  }
}

function drawDecorLayerBadge(x, y, layer, decorKey = "") {
  tankContext.save();
  tankContext.font = "700 12px Trebuchet MS";
  tankContext.textAlign = "center";
  tankContext.textBaseline = "middle";

  const span = getDecorLayerSpan(decorKey, layer);
  const text = span.label;

  const width = Math.ceil(tankContext.measureText(text).width) + 16;
  const height = 20;
  tankContext.fillStyle = "rgba(6, 16, 24, 0.78)";
  tankContext.beginPath();
  tankContext.roundRect(x - width / 2, y - height / 2, width, height, 9);
  tankContext.fill();
  tankContext.strokeStyle = "rgba(198, 236, 247, 0.32)";
  tankContext.lineWidth = 1;
  tankContext.stroke();
  tankContext.fillStyle = "rgba(234, 248, 255, 0.96)";
  tankContext.fillText(text, x, y + 0.5);
  tankContext.restore();
}

function drawPoops(now) {
  for (const poop of state.poops) {
    const sinkProgress = clamp((now - poop.createdAt) / POOP_FALL_MS, 0, 1);
    const x = poop.xNorm * TANK_WIDTH + Math.sin(now / 520 + poop.xNorm * 11) * (1 - sinkProgress) * 6;
    const y = (poop.startYNorm + (poop.yNorm - poop.startYNorm) * sinkProgress) * TANK_HEIGHT;
    tankContext.save();
    tankContext.fillStyle = "#70513b";
    tankContext.strokeStyle = "rgba(92, 67, 48, 0.88)";
    tankContext.lineWidth = 2.2;
    tankContext.beginPath();
    tankContext.moveTo(x - 2, y - 18);
    tankContext.quadraticCurveTo(x + 4, y - 10, x + 2, y - 3);
    tankContext.stroke();
    tankContext.beginPath();
    tankContext.ellipse(x, y, 5, 4, 0.1, 0, Math.PI * 2);
    tankContext.ellipse(x - 6, y + 6, 6, 4.4, -0.18, 0, Math.PI * 2);
    tankContext.ellipse(x + 5, y + 7, 5.5, 4, 0.08, 0, Math.PI * 2);
    tankContext.fill();
    tankContext.restore();
  }
}

function drawFish(now, layer = null, options = {}) {
  if (!state.fish.length) {
    return;
  }

  const sortedFish = [...state.fish]
    .filter((fish) => {
      if (layer !== null && getFishTankLayer(fish) !== layer) {
        return false;
      }

      const species = runtime.fishMap.get(fish.speciesId);
      if (!species) {
        return false;
      }

      if (options.onlyBehavior && species.behavior !== options.onlyBehavior) {
        return false;
      }

      if (options.excludeBehavior && species.behavior === options.excludeBehavior) {
        return false;
      }

      return true;
    })
    .sort((left, right) => left.yNorm - right.yNorm);

  for (const fish of sortedFish) {
    const species = runtime.fishMap.get(fish.speciesId);
    const image = runtime.images.get(species.asset);
    if (!image) {
      continue;
    }

    const pose = getFishPose(fish, species, now);
    const width = species.width * fish.scale;
    const height = width * (image.height / image.width);
    const shellBounds = getTankShellBounds();
    const topFrameBottomY = shellBounds.outerTop + 28;

    tankContext.save();
    tankContext.translate(pose.x + pose.swayX, pose.y);
    tankContext.scale(pose.facingScaleX ?? (pose.direction < 0 ? -1 : 1), 1);
    tankContext.rotate(pose.tilt);
    tankContext.scale(pose.bodyScaleX, pose.bodyScaleY);

    const healthRatio = clamp(fish.healthUnits / MAX_HEALTH_UNITS, 0, 1);
    const grayscalePercent = Math.round((1 - healthRatio) * 100);
    tankContext.filter = `grayscale(${grayscalePercent}%)`;
    tankContext.drawImage(image, -width / 2 + pose.wiggle * width * 0.018, -height / 2, width, height);
    tankContext.filter = "none";
    tankContext.restore();

    if (pose.isDead || fish.healthUnits <= 2) {
      const statusY = Math.max(topFrameBottomY + 12, pose.y - height * 0.72);
      tankContext.save();
      tankContext.font = "22px sans-serif";
      tankContext.textAlign = "center";
      tankContext.textBaseline = "middle";
      tankContext.fillText(
        pose.isDead ? "☠️" : "💔",
        pose.x + pose.swayX,
        statusY
      );
      tankContext.restore();
    }

    if (runtime.selectedFishId === fish.id) {
      tankContext.save();
      tankContext.font = "600 13px Trebuchet MS";
      tankContext.textAlign = "center";
      tankContext.textBaseline = "middle";
      const labelWidth = Math.ceil(tankContext.measureText(fish.name).width) + 18;
      const labelHeight = 22;
      const labelY = pose.isDead
        ? Math.max(topFrameBottomY + labelHeight / 2 + 18, pose.y - height * 0.62)
        : pose.y - height * 0.62;
      tankContext.fillStyle = "rgba(5, 14, 22, 0.5)";
      tankContext.beginPath();
      tankContext.roundRect(pose.x - labelWidth / 2, labelY - labelHeight / 2, labelWidth, labelHeight, 11);
      tankContext.fill();
      tankContext.strokeStyle = "rgba(232, 247, 255, 0.16)";
      tankContext.lineWidth = 1;
      tankContext.stroke();
      tankContext.fillStyle = "rgba(240, 251, 255, 0.92)";
      tankContext.fillText(fish.name, pose.x, labelY + 0.5);
      tankContext.restore();
    }
  }
}

function drawForegroundLight() {
  tankContext.save();
  tankContext.beginPath();
  tankContext.rect(GLASS_MARGIN_X, WATER_SURFACE_Y, TANK_WIDTH - GLASS_MARGIN_X * 2, Math.max(40, FLOOR_Y - WATER_SURFACE_Y - 54));
  tankContext.clip();
  const gradient = tankContext.createLinearGradient(0, 0, TANK_WIDTH, TANK_HEIGHT);
  gradient.addColorStop(0, "rgba(255,255,255,0.08)");
  gradient.addColorStop(0.25, "rgba(255,255,255,0.012)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  tankContext.fillStyle = gradient;
  tankContext.beginPath();
  tankContext.moveTo(120, 0);
  tankContext.lineTo(360, 0);
  tankContext.lineTo(720, TANK_HEIGHT);
  tankContext.lineTo(420, TANK_HEIGHT);
  tankContext.closePath();
  tankContext.fill();
  tankContext.restore();
}

function drawWaterSurface(now) {
  tankContext.save();
  const surfaceStartX = GLASS_MARGIN_X - 8;
  const surfaceEndX = TANK_WIDTH - GLASS_MARGIN_X + 8;
  tankContext.strokeStyle = "rgba(213, 244, 255, 0.95)";
  tankContext.lineWidth = 3.5;
  tankContext.beginPath();
  for (let x = surfaceStartX; x <= surfaceEndX; x += 18) {
    const y = WATER_SURFACE_Y + Math.sin(now / 460 + x / 86) * 3.2;
    if (x === surfaceStartX) {
      tankContext.moveTo(x, y);
    } else {
      tankContext.lineTo(x, y);
    }
  }
  tankContext.stroke();

  const highlight = tankContext.createLinearGradient(0, WATER_SURFACE_Y - 6, 0, WATER_SURFACE_Y + 20);
  highlight.addColorStop(0, "rgba(255,255,255,0.22)");
  highlight.addColorStop(1, "rgba(255,255,255,0)");
  tankContext.fillStyle = highlight;
  tankContext.fillRect(surfaceStartX, WATER_SURFACE_Y - 4, surfaceEndX - surfaceStartX, 26);
  tankContext.restore();
}

function drawSplashBursts(now) {
  if (!runtime.splashBursts.length) {
    return;
  }

  tankContext.save();
  tankContext.beginPath();
  tankContext.rect(GLASS_MARGIN_X, WATER_SURFACE_Y - 72, TANK_WIDTH - GLASS_MARGIN_X * 2, TANK_HEIGHT - WATER_SURFACE_Y - GLASS_MARGIN_BOTTOM + 72);
  tankContext.clip();

  for (const burst of runtime.splashBursts) {
    const progress = clamp((now - burst.startedAt) / Math.max(1, burst.endsAt - burst.startedAt), 0, 1);
    if (progress >= 1) {
      continue;
    }

    const rippleAlpha = (1 - progress) * 0.52;
    tankContext.save();
    tankContext.strokeStyle = `rgba(224, 247, 255, ${rippleAlpha.toFixed(3)})`;
    tankContext.lineWidth = 2.4 - progress * 1.2;
    tankContext.beginPath();
    tankContext.ellipse(
      burst.x,
      burst.y + 1,
      14 + progress * 48,
      3 + progress * 10,
      0,
      0,
      Math.PI * 2
    );
    tankContext.stroke();
    tankContext.restore();

    for (const droplet of burst.droplets) {
      const dropletProgress = clamp((progress - droplet.delay) / 0.34, 0, 1);
      if (dropletProgress <= 0 || dropletProgress >= 1) {
        continue;
      }

      const x = burst.x + droplet.drift * dropletProgress;
      const y = burst.y - droplet.lift * Math.sin(dropletProgress * Math.PI) + droplet.fall * dropletProgress * dropletProgress;
      tankContext.fillStyle = `rgba(229, 249, 255, ${(0.9 - dropletProgress * 0.5).toFixed(3)})`;
      tankContext.beginPath();
      tankContext.ellipse(x, y, droplet.size * 0.82, droplet.size * 1.18, 0, 0, Math.PI * 2);
      tankContext.fill();
    }

    for (const bubble of burst.bubbles) {
      const bubbleProgress = clamp((progress - bubble.delay) / 0.62, 0, 1);
      if (bubbleProgress <= 0 || bubbleProgress >= 1) {
        continue;
      }

      const bubbleY = burst.y + 18 + bubble.rise * (1 - bubbleProgress);
      drawBubbleOrb(
        burst.x + bubble.drift * bubbleProgress + Math.sin(progress * 18 + bubble.drift) * bubble.wobble,
        bubbleY,
        bubble.radius * (0.84 + bubbleProgress * 0.28),
        0.16 + (1 - bubbleProgress) * 0.22,
        1
      );
    }
  }

  tankContext.restore();
}

function drawGlassFrame() {
  glassContext.save();
  const {
    outerLeft,
    outerTop,
    outerWidth,
    outerHeight,
    innerLeft,
    innerTop,
    innerWidth,
    innerHeight
  } = getTankShellBounds();

  const topFrame = glassContext.createLinearGradient(0, outerTop, 0, outerTop + 32);
  topFrame.addColorStop(0, "rgba(24, 34, 43, 0.98)");
  topFrame.addColorStop(1, "rgba(8, 13, 18, 0.98)");
  const sideFrame = glassContext.createLinearGradient(0, outerTop, outerLeft, outerTop);
  sideFrame.addColorStop(0, "rgba(38, 52, 64, 0.94)");
  sideFrame.addColorStop(1, "rgba(8, 13, 18, 0.98)");
  const bottomFrame = glassContext.createLinearGradient(0, outerHeight + outerTop - 30, 0, outerHeight + outerTop);
  bottomFrame.addColorStop(0, "rgba(26, 36, 47, 0.98)");
  bottomFrame.addColorStop(1, "rgba(6, 10, 14, 0.98)");

  glassContext.shadowColor = "rgba(0, 0, 0, 0.34)";
  glassContext.shadowBlur = 24;
  glassContext.fillStyle = topFrame;
  glassContext.fillRect(outerLeft, outerTop, outerWidth, 28);
  glassContext.fillStyle = bottomFrame;
  glassContext.fillRect(outerLeft, TANK_HEIGHT - GLASS_MARGIN_BOTTOM - 2, outerWidth, 28);
  glassContext.fillStyle = sideFrame;
  glassContext.fillRect(outerLeft, outerTop + 24, 16, outerHeight - 52);
  glassContext.fillRect(TANK_WIDTH - outerLeft - 16, outerTop + 24, 16, outerHeight - 52);
  glassContext.shadowBlur = 0;

  glassContext.strokeStyle = "rgba(220, 236, 244, 0.2)";
  glassContext.lineWidth = 2;
  glassContext.strokeRect(innerLeft, innerTop, innerWidth, innerHeight);
  glassContext.strokeStyle = "rgba(255,255,255,0.1)";
  glassContext.lineWidth = 1.5;
  glassContext.beginPath();
  glassContext.moveTo(innerLeft + 12, innerTop + 12);
  glassContext.lineTo(innerLeft + 12, innerTop + innerHeight - 20);
  glassContext.moveTo(TANK_WIDTH - innerLeft - 12, innerTop + 12);
  glassContext.lineTo(TANK_WIDTH - innerLeft - 12, innerTop + innerHeight - 20);
  glassContext.stroke();

  const glare = glassContext.createLinearGradient(innerLeft, 0, innerLeft + 120, 0);
  glare.addColorStop(0, "rgba(255,255,255,0.18)");
  glare.addColorStop(1, "rgba(255,255,255,0)");
  glassContext.fillStyle = glare;
  glassContext.fillRect(innerLeft + 10, innerTop + 12, 22, innerHeight - 22);

  const tankAsset = runtime.tankMap.get(state.selectedTankAsset);
  const tankImage = tankAsset ? runtime.images.get(tankAsset.path) : null;
  if (tankImage) {
    glassContext.globalAlpha = 1;
    glassContext.drawImage(tankImage, 0, 0, TANK_WIDTH, TANK_HEIGHT);
    glassContext.restore();
    return;
  }
  glassContext.restore();
}

function drawGrime(dirtiness) {
  grimeContext.clearRect(0, 0, TANK_WIDTH, TANK_HEIGHT);
  if (dirtiness <= 0.01 && runtime.scrubStamps.length === 0) {
    return;
  }

  grimeContext.save();
  grimeContext.beginPath();
  grimeContext.rect(GLASS_MARGIN_X, WATER_SURFACE_Y, TANK_WIDTH - GLASS_MARGIN_X * 2, TANK_HEIGHT - WATER_SURFACE_Y - GLASS_MARGIN_BOTTOM);
  grimeContext.clip();
  grimeContext.fillStyle = `rgba(113, 161, 83, ${0.08 + dirtiness * 0.26})`;
  grimeContext.fillRect(0, 0, TANK_WIDTH, TANK_HEIGHT);

  grimeContext.globalAlpha = 0.1 + dirtiness * 0.32;
  for (const mark of runtime.scene.grimeMarks.slice(0, Math.max(10, Math.floor(dirtiness * runtime.scene.grimeMarks.length)))) {
    grimeContext.fillStyle = mark.color;
    grimeContext.filter = `blur(${6 + dirtiness * 16}px)`;
    grimeContext.beginPath();
    grimeContext.ellipse(mark.x * TANK_WIDTH, mark.y * TANK_HEIGHT, mark.rx, mark.ry, mark.rotation, 0, Math.PI * 2);
    grimeContext.fill();
  }

  grimeContext.filter = "none";
  const topGlow = grimeContext.createLinearGradient(0, 0, 0, TANK_HEIGHT);
  topGlow.addColorStop(0, `rgba(236, 255, 223, ${0.14 + dirtiness * 0.12})`);
  topGlow.addColorStop(1, "rgba(236, 255, 223, 0)");
  grimeContext.fillStyle = topGlow;
  grimeContext.fillRect(0, 0, TANK_WIDTH, TANK_HEIGHT);

  if (runtime.scrubStamps.length) {
    grimeContext.globalCompositeOperation = "destination-out";
    for (const stamp of runtime.scrubStamps) {
      const gradient = grimeContext.createRadialGradient(
        stamp.x,
        stamp.y,
        stamp.radius * 0.2,
        stamp.x,
        stamp.y,
        stamp.radius
      );
      gradient.addColorStop(0, "rgba(0,0,0,1)");
      gradient.addColorStop(0.72, "rgba(0,0,0,0.94)");
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      grimeContext.fillStyle = gradient;
      grimeContext.beginPath();
      grimeContext.arc(stamp.x, stamp.y, stamp.radius, 0, Math.PI * 2);
      grimeContext.fill();
    }
    grimeContext.globalCompositeOperation = "source-over";
  }
  grimeContext.restore();
}

function drawCleaningSparkles(now) {
  if (!runtime.cleaningTransition) {
    return;
  }

  const { startedAt, fadeEndsAt, sparkleEndsAt, sparkles } = runtime.cleaningTransition;
  const fadeProgress = clamp((now - startedAt) / Math.max(1, fadeEndsAt - startedAt), 0, 1);
  const sparkleFade = now <= fadeEndsAt
    ? fadeProgress
    : clamp(1 - (now - fadeEndsAt) / Math.max(1, sparkleEndsAt - fadeEndsAt), 0, 1);

  if (sparkleFade <= 0) {
    return;
  }

  tankContext.save();
  tankContext.beginPath();
  tankContext.rect(GLASS_MARGIN_X, WATER_SURFACE_Y + 2, TANK_WIDTH - GLASS_MARGIN_X * 2, TANK_HEIGHT - WATER_SURFACE_Y - GLASS_MARGIN_BOTTOM - 2);
  tankContext.clip();
  tankContext.globalCompositeOperation = "screen";

  for (const sparkle of sparkles) {
    const life = clamp((now - startedAt) / CLEAN_SPARKLE_MS - sparkle.delay, 0, 1);
    if (life <= 0 || life >= 1) {
      continue;
    }

    const pulse = Math.sin((life * Math.PI + sparkle.delay) * sparkle.twinkle * Math.PI);
    const burst = Math.sin(life * Math.PI);
    const alpha = Math.max(0, pulse) * sparkleFade * (0.7 + sparkle.glow * 0.38);
    if (alpha <= 0.02) {
      continue;
    }

    const size = sparkle.size * (0.86 + pulse * 0.22 + burst * 0.16);
    const glowRadius = size * (1.8 + sparkle.glow * 0.65);
    const coreColor = `hsla(${sparkle.hue.toFixed(1)}, 92%, 78%, ${Math.min(0.98, alpha).toFixed(3)})`;
    const glowGradient = tankContext.createRadialGradient(
      sparkle.x,
      sparkle.y,
      0,
      sparkle.x,
      sparkle.y,
      glowRadius
    );
    glowGradient.addColorStop(0, `hsla(${sparkle.hue.toFixed(1)}, 100%, 86%, ${(alpha * 0.34).toFixed(3)})`);
    glowGradient.addColorStop(0.45, `hsla(${sparkle.hue.toFixed(1)}, 96%, 70%, ${(alpha * 0.2).toFixed(3)})`);
    glowGradient.addColorStop(1, `hsla(${sparkle.hue.toFixed(1)}, 96%, 60%, 0)`);
    tankContext.fillStyle = glowGradient;
    tankContext.beginPath();
    tankContext.arc(sparkle.x, sparkle.y, glowRadius, 0, Math.PI * 2);
    tankContext.fill();

    tankContext.save();
    tankContext.translate(sparkle.x, sparkle.y);
    tankContext.rotate(sparkle.rotation + pulse * 0.12);
    tankContext.strokeStyle = coreColor;
    tankContext.lineWidth = 1.5 + sparkle.glow * 0.85;
    tankContext.beginPath();
    tankContext.moveTo(-size, 0);
    tankContext.lineTo(size, 0);
    tankContext.moveTo(0, -size);
    tankContext.lineTo(0, size);
    tankContext.stroke();
    if (sparkle.diagonal) {
      const diag = size * 0.72;
      tankContext.beginPath();
      tankContext.moveTo(-diag, -diag);
      tankContext.lineTo(diag, diag);
      tankContext.moveTo(diag, -diag);
      tankContext.lineTo(-diag, diag);
      tankContext.stroke();
    }
    tankContext.restore();

    tankContext.fillStyle = `hsla(${sparkle.hue.toFixed(1)}, 100%, 92%, ${(alpha * 0.92).toFixed(3)})`;
    tankContext.beginPath();
    tankContext.arc(sparkle.x, sparkle.y, Math.max(1.6, size * 0.18), 0, Math.PI * 2);
    tankContext.fill();

    tankContext.fillStyle = `rgba(255,255,255, ${(alpha * 0.74).toFixed(3)})`;
    tankContext.beginPath();
    tankContext.arc(
      sparkle.x - size * 0.14,
      sparkle.y - size * 0.18,
      Math.max(1.1, size * 0.08),
      0,
      Math.PI * 2
    );
    tankContext.fill();
  }

  tankContext.restore();
}

function getFishPose(fish, species, now) {
  if (isFishDead(fish)) {
    const floatClock = now / 1000;
    const facing = getFishFacingDirection(fish);
    return {
      x: fish.xNorm * TANK_WIDTH + Math.sin(floatClock * 0.34 + fish.phase * Math.PI * 2) * 3.2,
      y: fish.yNorm * TANK_HEIGHT + Math.sin(floatClock * 0.82 + fish.phase * Math.PI * 1.6) * 1.8,
      direction: facing,
      facingScaleX: facing,
      tilt: Math.PI + Math.sin(floatClock * 0.48 + fish.phase * Math.PI) * 0.06,
      wiggle: Math.sin(floatClock * 0.18 + fish.phase * Math.PI) * 0.05,
      bodyScaleX: 1,
      bodyScaleY: 1,
      swayX: 0,
      isDead: true
    };
  }

  const motionLevel = clamp(Number(fish.motionLevel) || 0.12, 0.04, 1);
  const wiggleClock = Number.isFinite(fish.wiggleClock) ? fish.wiggleClock : (now / 1000) * (0.45 + fish.swimSpeed * 14);
  if (species.behavior === "sucker") {
    const facing = getFishFacingDirection(fish);
    const turnProgress = fish.turnStartedAt && fish.turnDurationMs > 0
      ? clamp((now - fish.turnStartedAt) / fish.turnDurationMs, 0, 1)
      : null;
    const currentAngle = getFishFacingAngle(fish);
    const turnFromAngle = Number.isFinite(Number(fish.turnFromAngle))
      ? normalizeAngle(Number(fish.turnFromAngle))
      : currentAngle;
    const turnToAngle = Number.isFinite(Number(fish.turnToAngle))
      ? normalizeAngle(Number(fish.turnToAngle))
      : currentAngle;
    const turnSpinDirection = Number(fish.turnSpinDirection) < 0 ? -1 : 1;
    const clingMotion = clamp(motionLevel * 0.18, 0.01, 0.12);
    const clingWiggle = Math.sin(wiggleClock * 0.18 + fish.phase * Math.PI) * clingMotion;
    const turnDelta = turnProgress === null ? 0 : getDirectedAngleDelta(turnFromAngle, turnToAngle, turnSpinDirection);
    const turnAngle = turnProgress === null
      ? currentAngle
      : normalizeAngle(turnFromAngle + turnDelta * turnProgress);
    const turnLift = turnProgress === null ? 0 : Math.sin(turnProgress * Math.PI) * 2.6;
    const crawlTilt = clamp((fish.targetYNorm - fish.yNorm) * 0.18, -0.18, 0.18);
    return {
      x: fish.xNorm * TANK_WIDTH,
      y: fish.yNorm * TANK_HEIGHT - turnLift,
      direction: facing,
      facingScaleX: 1,
      tilt: normalizeAngle(turnAngle + (turnProgress === null ? crawlTilt : crawlTilt * 0.35)),
      wiggle: clingWiggle,
      bodyScaleX: 1 - Math.abs(clingWiggle) * 0.008,
      bodyScaleY: 1 + Math.abs(clingWiggle) * 0.006,
      swayX: clingWiggle * 0.18,
      isDead: false
    };
  }
  const wiggle = Math.sin(wiggleClock + fish.phase * Math.PI * 2);
  const glide = Math.sin(wiggleClock * 0.48 + fish.phase * Math.PI * 1.4);
  const entryProgress = fish.entryStartedAt && fish.entryDurationMs > 0
    ? clamp((now - fish.entryStartedAt) / fish.entryDurationMs, 0, 1)
    : null;
  const easedEntry = entryProgress === null ? null : 1 - Math.pow(1 - entryProgress, 3);
  const renderYNorm = easedEntry === null || fish.entryFromYNorm === null
    ? fish.yNorm
    : fish.entryFromYNorm + (fish.yNorm - fish.entryFromYNorm) * easedEntry;
  const x = fish.xNorm * TANK_WIDTH;
  const y = renderYNorm * TANK_HEIGHT
    + Math.sin(wiggleClock * (0.2 + species.bobSpeed * 0.16) + fish.phase * Math.PI * 2) * (0.9 + motionLevel * 4.4)
    + glide * (0.45 + motionLevel * 1.35)
    + (entryProgress === null ? 0 : Math.sin(entryProgress * Math.PI * 2.4 + fish.phase * Math.PI) * (1 - entryProgress) * 9);
  const wiggleStretch = 0.008 + motionLevel * 0.018;
  const turnProgress = fish.turnStartedAt && fish.turnDurationMs > 0
    ? clamp((now - fish.turnStartedAt) / fish.turnDurationMs, 0, 1)
    : null;
  const turnAmount = turnProgress === null ? 0 : Math.sin(turnProgress * Math.PI);
  const turnFromDirection = Number(fish.turnFromDirection) < 0 ? -1 : 1;
  const turnToDirection = Number(fish.turnToDirection) < 0 ? -1 : 1;
  const renderDirection = turnProgress === null
    ? getFishFacingDirection(fish)
    : (turnProgress < 0.5 ? turnFromDirection : turnToDirection);
  const turnLean = turnProgress === null
    ? 0
    : (Number(fish.turnSpinDirection) < 0 ? -1 : 1) * turnAmount * 0.14;
  const tilt = clamp(
    (fish.targetYNorm - fish.yNorm) * (0.9 + motionLevel * 0.35)
      + wiggle * (0.008 + motionLevel * 0.04)
      + turnLean,
    -0.26,
    0.26
  );
  const bodyScaleX = (1 - Math.abs(wiggle) * wiggleStretch) * (1 - turnAmount * (1 - FISH_TURN_MIN_SCALE_X));
  const bodyScaleY = (1 + Math.abs(wiggle) * (wiggleStretch * 0.78)) * (1 + turnAmount * (FISH_TURN_MAX_SCALE_Y - 1));
  const turnSway = turnProgress === null
    ? 0
    : (Number(fish.turnSpinDirection) < 0 ? -1 : 1) * turnAmount * (0.35 + motionLevel * 0.95);
  return {
    x,
    y,
    direction: fish.direction || 1,
    facingScaleX: renderDirection,
    tilt,
    wiggle,
    bodyScaleX,
    bodyScaleY,
    swayX: wiggle * (0.7 + motionLevel * 1.55) + turnSway,
    isDead: false
  };
}

function getTankDirtiness(now) {
  const cleanDirtiness = getBaseTankDirtiness(now);
  if (!runtime.cleaningTransition) {
    return cleanDirtiness;
  }

  const progress = clamp((now - runtime.cleaningTransition.startedAt) / CLEAN_FADE_MS, 0, 1);
  const eased = 1 - (1 - progress) * (1 - progress);
  return clamp(
    runtime.cleaningTransition.fromDirtiness + (cleanDirtiness - runtime.cleaningTransition.fromDirtiness) * eased,
    0,
    1
  );
}

function getBaseTankDirtiness(now) {
  const filterProfile = getFilterProfile();
  const suckerSlowdown = hasActiveSuckerFish() ? 1.25 : 1;
  const algae = clamp((now - state.lastCleanedAt) / (WEEK_MS * (1 + filterProfile.grimeDelay) * suckerSlowdown), 0, 1);
  const poopScale = Math.max(14, state.fish.length * 12) * (1 + filterProfile.wasteCapacity) * suckerSlowdown;
  const poopFactor = clamp(state.poops.length / poopScale, 0, 1);
  return clamp(algae * 0.72 + poopFactor * 0.35, 0, 1);
}

function getFilterProfile(filterKey = state?.selectedFilterAsset) {
  const filter = runtime.filterMap.get(filterKey) || {};
  return {
    grimeDelay: clamp(Number(filter.grimeDelay) || 0, 0, 0.45),
    wasteCapacity: clamp(Number(filter.wasteCapacity) || 0, 0, 0.45),
    flow: clamp(Number(filter.flow) || 1, 0.8, 1.3)
  };
}

function getFilterAssistPercent(filterKey = state?.selectedFilterAsset) {
  const profile = getFilterProfile(filterKey);
  return Math.round((profile.grimeDelay * 0.56 + profile.wasteCapacity * 0.44) * 100);
}

function normalizeFishSpeed(species, explicitValue) {
  if (Number.isFinite(explicitValue)) {
    return clamp(explicitValue, species.speedMin, species.speedMax);
  }

  if (species.speedMode === "dynamic") {
    return clamp(species.speedMin + Math.random() * (species.speedMax - species.speedMin), species.speedMin, species.speedMax);
  }

  return species.speedMin;
}

function getFishTurnDurationMs(fish, species) {
  if (!fish || !species) {
    return FISH_TURN_MIN_MS + Math.random() * (FISH_TURN_MAX_MS - FISH_TURN_MIN_MS);
  }

  const speedMin = Math.max(0.00001, Number(species.speedMin) || 0.00001);
  const speedMax = Math.max(speedMin, Number(species.speedMax) || speedMin);
  const currentSpeed = normalizeFishSpeed(species, Number(fish.swimSpeed));
  const speedBlend = speedMax <= speedMin
    ? 0.5
    : clamp((currentSpeed - speedMin) / Math.max(0.00001, speedMax - speedMin), 0, 1);
  const slowBias = 1 - speedBlend;
  const minMs = FISH_TURN_MIN_MS + slowBias * 55;
  const maxMs = FISH_TURN_MAX_MS + slowBias * 130;
  return minMs + Math.random() * Math.max(1, maxMs - minMs);
}

function formatSwimStyle(swimStyle) {
  switch (swimStyle) {
    case "peaceful":
      return "peaceful and slow";
    case "sporadic":
      return "sporadic and quick";
    default:
      return "steady";
  }
}

function describeGrime(dirtiness) {
  if (dirtiness < 0.14) {
    return "Tank is crystal clear.";
  }
  if (dirtiness < 0.34) {
    return "A little haze is starting to creep in.";
  }
  if (dirtiness < 0.62) {
    return "The glass is getting fuzzy and green.";
  }
  return "The tank is murky and really needs a sponge run.";
}

function getCurrentMealSlot(timestamp) {
  const date = new Date(timestamp);
  const morning = date.getHours() < 12;
  const start = new Date(date);
  start.setHours(morning ? 0 : 12, 0, 0, 0);
  return buildMealSlot(start);
}

function getTodaysMealSlots(timestamp) {
  const date = new Date(timestamp);
  const morning = new Date(date);
  morning.setHours(0, 0, 0, 0);
  const evening = new Date(date);
  evening.setHours(12, 0, 0, 0);
  return [buildMealSlot(morning), buildMealSlot(evening)];
}

function buildMealSlot(startDate) {
  const start = new Date(startDate);
  const end = new Date(start);
  end.setHours(end.getHours() + 12, 0, 0, 0);
  const part = start.getHours() < 12 ? "Morning" : "Evening";
  return {
    key: `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}-${String(start.getDate()).padStart(2, "0")}-${part.toLowerCase()}`,
    label: part,
    start: start.getTime(),
    end: end.getTime()
  };
}

function getCompletedMealSlots(startTs, endTs) {
  const slots = [];
  let boundary = getNextMealBoundary(startTs);
  while (boundary.getTime() <= endTs) {
    const slotStart = new Date(boundary);
    slotStart.setHours(slotStart.getHours() - 12, 0, 0, 0);
    slots.push(buildMealSlot(slotStart));
    boundary = new Date(boundary);
    boundary.setHours(boundary.getHours() + 12, 0, 0, 0);
  }
  return slots;
}

function getNextMealBoundary(timestamp) {
  const date = new Date(timestamp);
  const boundary = new Date(date);

  if (date.getHours() < 12 || (date.getHours() === 12 && (date.getMinutes() > 0 || date.getSeconds() > 0 || date.getMilliseconds() > 0))) {
    boundary.setHours(12, 0, 0, 0);
    if (boundary.getTime() <= timestamp) {
      boundary.setDate(boundary.getDate() + 1);
      boundary.setHours(0, 0, 0, 0);
    }
  } else {
    boundary.setDate(boundary.getDate() + 1);
    boundary.setHours(0, 0, 0, 0);
  }

  return boundary;
}

function getTankPoint(event) {
  const rect = dom.tankStage.getBoundingClientRect();
  if (!rect.width || !rect.height) {
    return null;
  }

  runtime.pointerStagePx = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };

  return {
    x: ((event.clientX - rect.left) / rect.width) * TANK_WIDTH,
    y: ((event.clientY - rect.top) / rect.height) * TANK_HEIGHT
  };
}

function getPelletPose(pellet, now) {
  const lifeProgress = clamp((now - pellet.createdAt) / Math.max(1, pellet.expiresAt - pellet.createdAt), 0, 1);
  const dropProgress = clamp((now - pellet.createdAt) / 900, 0, 1);
  const easedDrop = 1 - (1 - dropProgress) * (1 - dropProgress);
  const floatingY = pellet.yNorm + (Math.sin(now / 520 + pellet.sway * 12) * 2.4 + lifeProgress * 2.4) / TANK_HEIGHT;
  return {
    xNorm: clamp(pellet.xNorm + (Math.sin(now / 640 + pellet.sway * Math.PI * 2) * 9) / TANK_WIDTH, 0.08, 0.92),
    yNorm: clamp((0.032 + pellet.sway * 0.018) * (1 - easedDrop) + floatingY * easedDrop, 0.06, 0.2)
  };
}

function drawBubbleOrb(x, y, radius, alpha, stretch = 1) {
  tankContext.save();
  tankContext.globalAlpha = alpha;
  tankContext.beginPath();
  tankContext.ellipse(x, y, radius * stretch, radius, 0, 0, Math.PI * 2);
  tankContext.fillStyle = "rgba(255,255,255,0.12)";
  tankContext.fill();
  tankContext.lineWidth = Math.max(1, radius * 0.18);
  tankContext.strokeStyle = "rgba(235, 250, 255, 0.62)";
  tankContext.stroke();
  tankContext.fillStyle = "rgba(255,255,255,0.35)";
  tankContext.beginPath();
  tankContext.ellipse(x - radius * 0.3, y - radius * 0.32, radius * 0.2, radius * 0.16, -0.2, 0, Math.PI * 2);
  tankContext.fill();
  tankContext.restore();
}

function drawDecorBubbleStreams(now) {
  if (!state.placedDecor.length) {
    return;
  }

  for (const item of state.placedDecor) {
    const decor = runtime.decorMap.get(item.decorKey);
    const image = decor ? runtime.images.get(decor.path) : null;
    if (!decor || !image) {
      continue;
    }

    const intensity = getDecorBubbleIntensity(item.decorKey);
    if (intensity <= 0) {
      continue;
    }

    const width = decor.width * item.scale;
    const height = width * (image.height / image.width);
    const sourceX = item.xNorm * TANK_WIDTH;
    const sourceY = item.yNorm * TANK_HEIGHT - height * 0.2;
    const streamCount = intensity >= 1.3 ? 2 : 1;

    for (let streamIndex = 0; streamIndex < streamCount; streamIndex += 1) {
      const laneOffset = (streamIndex - (streamCount - 1) / 2) * (12 + width * 0.03);
      const bubbleCount = 2 + Math.round(intensity);
      for (let bubbleIndex = 0; bubbleIndex < bubbleCount; bubbleIndex += 1) {
        const cycle = (now / 1000) * (0.055 + bubbleIndex * 0.008 + streamIndex * 0.006) + item.xNorm * 7 + bubbleIndex * 0.19;
        const progress = cycle % 1;
        const x = sourceX + laneOffset + Math.sin(cycle * 8) * (3.2 + bubbleIndex * 0.9);
        const y = sourceY - progress * (70 + bubbleIndex * 28 + intensity * 12);
        if (y <= WATER_SURFACE_Y + 6) {
          continue;
        }

        const radius = 1.8 + bubbleIndex * 0.7;
        drawBubbleOrb(x, y, radius, 0.14 + bubbleIndex * 0.05, 1);
      }
    }
  }
}

function getDecorBubbleIntensity(decorKey) {
  const key = decorKey.toLowerCase();
  if (/(coral|seaweed|grass|moss|anubias|bloom|bunch)/.test(key)) {
    return 1.45;
  }
  if (/(castle|cave|terracotta|pagoda|bridge|arch)/.test(key)) {
    return 1.05;
  }
  if (/(rock|driftwood|chest|shell)/.test(key)) {
    return 0.6;
  }
  return 0.35;
}

function getBubbleSpriteByIndex(index) {
  if (!runtime.bubbleCatalog.length) {
    return null;
  }

  const item = runtime.bubbleCatalog[index % runtime.bubbleCatalog.length];
  return item ? runtime.images.get(item.path) : null;
}

function findFishAtPoint(x, y, now) {
  const sortedFish = [...state.fish].sort((left, right) => {
    if (getFishTankLayer(left) !== getFishTankLayer(right)) {
      return getFishTankLayer(left) - getFishTankLayer(right);
    }
    return right.yNorm - left.yNorm;
  });
  for (const fish of sortedFish) {
    const species = runtime.fishMap.get(fish.speciesId);
    const descriptor = species ? getFishShapeDescriptor(fish, species, now) : null;
    if (descriptor && pointHitsShapeDescriptor(descriptor, x, y)) {
      return fish;
    }
  }

  return null;
}

function getFishComfort(fish, now) {
  if (isFishDead(fish)) {
    return { value: 0, label: "Deceased" };
  }

  const dirtiness = getTankDirtiness(now);
  const cleanlinessScore = 1 - dirtiness;
  const healthScore = fish.healthUnits / MAX_HEALTH_UNITS;
  const servedToday = getTodaysMealSlots(now).filter((slot) => Boolean(state.feedHistory[slot.key])).length / 2;
  const decorScore = clamp(state.placedDecor.length / Math.max(1, state.fish.length + 1), 0, 1);
  const nearestCorpse = getNearestDeadFish(fish);
  const corpseStress = nearestCorpse
    ? clamp(0.12 + Math.max(0, 0.18 - nearestCorpse.distanceNorm) * 1.9, 0.12, 0.46)
    : 0;
  const comfortValue = clamp(healthScore * 0.46 + cleanlinessScore * 0.32 + servedToday * 0.12 + decorScore * 0.1 - corpseStress, 0, 1);
  const label = comfortValue >= 0.84 ? "Cozy" : comfortValue >= 0.64 ? "Content" : comfortValue >= 0.42 ? "Restless" : "Stressed";
  return { value: comfortValue, label };
}

function formatFishAge(acquiredAt, now = Date.now()) {
  const diff = Math.max(0, now - acquiredAt);
  const days = Math.floor(diff / DAY_MS);
  if (days >= 1) {
    return `${days}d`;
  }

  const hours = Math.max(1, Math.floor(diff / HOUR_MS));
  return `${hours}h`;
}

function clampDecorPlacement(xNorm, yNorm, options = {}) {
  const shellBounds = getTankShellBounds();
  const minXNorm = shellBounds.innerLeft / TANK_WIDTH;
  const maxXNorm = (shellBounds.innerLeft + shellBounds.innerWidth) / TANK_WIDTH;
  const minYNorm = shellBounds.innerTop / TANK_HEIGHT;
  const maxYNorm = (shellBounds.innerTop + shellBounds.innerHeight) / TANK_HEIGHT;
  const normalizedX = clamp(Number.isFinite(Number(xNorm)) ? Number(xNorm) : 0.5, 0, 1);
  const normalizedY = clamp(Number.isFinite(Number(yNorm)) ? Number(yNorm) : 0.8, 0, 1);
  const decorKey = options.item?.decorKey || options.decorKey || runtime.placementMode?.decorKey || null;

  if (!decorKey) {
    return {
      xNorm: clamp(normalizedX, minXNorm, maxXNorm),
      yNorm: clamp(normalizedY, minYNorm, maxYNorm)
    };
  }

  const resolvedScale = clamp(
    Number.isFinite(Number(options.item?.scale))
      ? Number(options.item.scale)
      : Number.isFinite(Number(options.scale))
        ? Number(options.scale)
        : Number.isFinite(Number(runtime.placementMode?.scale))
          ? Number(runtime.placementMode.scale)
          : getDecorScaleDefault(decorKey),
    DECOR_SCALE_MIN,
    DECOR_SCALE_MAX
  );
  const candidate = {
    ...(options.item || {}),
    decorKey,
    scale: resolvedScale,
    xNorm: normalizedX,
    yNorm: normalizedY
  };
  const opaqueBounds = getPlacedDecorOpaqueBounds(candidate);
  if (!opaqueBounds) {
    return {
      xNorm: clamp(normalizedX, minXNorm, maxXNorm),
      yNorm: clamp(normalizedY, minYNorm, maxYNorm)
    };
  }

  const anchorX = normalizedX * TANK_WIDTH;
  const anchorY = normalizedY * TANK_HEIGHT;
  const relLeft = opaqueBounds.left - anchorX;
  const relRight = opaqueBounds.right - anchorX;
  const relTop = opaqueBounds.top - anchorY;
  const relBottom = opaqueBounds.bottom - anchorY;
  const minAnchorX = shellBounds.innerLeft - relLeft;
  const maxAnchorX = shellBounds.innerLeft + shellBounds.innerWidth - relRight;
  const minAnchorY = shellBounds.innerTop - relTop;
  const maxAnchorY = shellBounds.innerTop + shellBounds.innerHeight - relBottom;
  const clampedX = minAnchorX <= maxAnchorX
    ? clamp(anchorX, minAnchorX, maxAnchorX)
    : (minAnchorX + maxAnchorX) / 2;
  const clampedY = minAnchorY <= maxAnchorY
    ? clamp(anchorY, minAnchorY, maxAnchorY)
    : (minAnchorY + maxAnchorY) / 2;

  return {
    xNorm: clamp(clampedX / TANK_WIDTH, minXNorm, maxXNorm),
    yNorm: clamp(clampedY / TANK_HEIGHT, minYNorm, maxYNorm)
  };
}

function findPlacedDecorAtPoint(x, y) {
  const sorted = [...state.placedDecor].sort((left, right) => {
    if (getDecorTankLayer(left) !== getDecorTankLayer(right)) {
      return getDecorTankLayer(left) - getDecorTankLayer(right);
    }
    return right.yNorm - left.yNorm;
  });
  for (const item of sorted) {
    const descriptor = getDecorShapeDescriptor(item);
    if (descriptor && pointHitsShapeDescriptor(descriptor, x, y)) {
      return item;
    }
  }

  return null;
}

function getPlacedDecorBounds(item) {
  const decor = runtime.decorMap.get(item.decorKey);
  if (!decor) {
    return null;
  }

  const image = runtime.images.get(decor.path);
  const width = decor.width * item.scale;
  const height = width * (image ? image.height / image.width : 1);
  const x = item.xNorm * TANK_WIDTH;
  const y = item.yNorm * TANK_HEIGHT;

  return {
    left: x - width / 2,
    right: x + width / 2,
    top: y - height,
    bottom: y
  };
}

function getDecorVisibleImagePaths(decor) {
  if (!decor) {
    return [];
  }

  return [...new Set([
    decor.bgPath,
    decor.path,
    decor.midPath
  ].filter(Boolean))];
}

function getPlacedDecorOpaqueBoundsForImagePath(item, decor, imagePath) {
  const image = runtime.images.get(imagePath);
  const mask = getImageAlphaMask(imagePath);
  if (!image || !mask) {
    return null;
  }

  const width = decor.width * item.scale;
  const height = width * (image.height / image.width);
  const x = item.xNorm * TANK_WIDTH;
  const y = item.yNorm * TANK_HEIGHT;
  const left = x - width / 2;
  const top = y - height;

  return {
    left: left + (mask.bounds.minX / image.width) * width,
    right: left + ((mask.bounds.maxX + 1) / image.width) * width,
    top: top + (mask.bounds.minY / image.height) * height,
    bottom: top + ((mask.bounds.maxY + 1) / image.height) * height
  };
}

function getPlacedDecorOpaqueBounds(item, imagePathOverride = null) {
  const decor = runtime.decorMap.get(item?.decorKey);
  if (!decor) {
    return null;
  }

  const imagePaths = imagePathOverride
    ? [imagePathOverride]
    : getDecorVisibleImagePaths(decor);
  if (!imagePaths.length) {
    return getPlacedDecorBounds(item);
  }

  let mergedBounds = null;
  for (const imagePath of imagePaths) {
    const bounds = getPlacedDecorOpaqueBoundsForImagePath(item, decor, imagePath);
    if (!bounds) {
      continue;
    }

    if (!mergedBounds) {
      mergedBounds = { ...bounds };
      continue;
    }

    mergedBounds.left = Math.min(mergedBounds.left, bounds.left);
    mergedBounds.right = Math.max(mergedBounds.right, bounds.right);
    mergedBounds.top = Math.min(mergedBounds.top, bounds.top);
    mergedBounds.bottom = Math.max(mergedBounds.bottom, bounds.bottom);
  }

  return mergedBounds || getPlacedDecorBounds(item);
}

function getDecorShapeDescriptor(item, imagePathOverride = null) {
  const decor = runtime.decorMap.get(item?.decorKey);
  if (!decor) {
    return null;
  }

  const imagePath = imagePathOverride || decor.path;
  const image = runtime.images.get(imagePath);
  const mask = getImageAlphaMask(imagePath);
  if (!image || !mask) {
    return null;
  }

  return createDecorShapeDescriptorFromMask(item, decor, imagePath, mask);
}

function localDecorPointToTankNorm(item, localX, localY) {
  const bounds = getPlacedDecorBounds(item);
  if (!bounds) {
    return null;
  }

  const clampedX = clamp(localX, 0.02, 0.98);
  const clampedY = clamp(localY, 0.02, 0.98);
  const worldX = bounds.left + (bounds.right - bounds.left) * clampedX;
  const worldY = bounds.top + (bounds.bottom - bounds.top) * clampedY;

  return {
    x: worldX,
    y: worldY,
    xNorm: clamp(worldX / TANK_WIDTH, 0.08, 0.92),
    yNorm: clamp(worldY / TANK_HEIGHT, 0.14, 0.8)
  };
}

function resolveOpenCavePoint(
  item,
  seedX,
  seedY,
  frontDescriptor,
  barrierDescriptor,
  fish = null,
  species = null,
  now = Date.now(),
  options = {}
) {
  const rangeX = Math.max(0.02, Number(options.rangeX) || 0.12);
  const rangeY = Math.max(0.02, Number(options.rangeY) || 0.1);
  const step = Math.max(0.01, Number(options.step) || 0.02);
  const allowFallback = options.allowFallback !== false;
  const barrierMode = options.barrierMode === "hit"
    ? "hit"
    : options.barrierMode === "clear"
      ? "clear"
      : "either";
  let bestPoint = null;
  let bestScore = Number.POSITIVE_INFINITY;

  for (let dy = -rangeY; dy <= rangeY + 0.0001; dy += step) {
    for (let dx = -rangeX; dx <= rangeX + 0.0001; dx += step) {
      const localX = clamp(seedX + dx, 0.08, 0.92);
      const localY = clamp(seedY + dy, 0.18, 0.9);
      const point = localDecorPointToTankNorm(item, localX, localY);
      if (!point) {
        continue;
      }

      if (frontDescriptor && pointHitsShapeDescriptor(frontDescriptor, point.x, point.y, ALPHA_COLLISION_THRESHOLD)) {
        continue;
      }

      const hitsBarrier = barrierDescriptor
        ? pointHitsShapeDescriptor(barrierDescriptor, point.x, point.y, ALPHA_COLLISION_THRESHOLD)
        : false;

      if (barrierMode === "hit" && !hitsBarrier) {
        continue;
      }

      if (barrierMode === "clear" && hitsBarrier) {
        continue;
      }

      if (fish && species) {
        const direction = Math.abs(point.xNorm - fish.xNorm) > 0.001
          ? (point.xNorm >= fish.xNorm ? 1 : -1)
          : (fish.direction || 1);
        const pose = getFishCollisionPose(fish, species, now, point.xNorm, point.yNorm, direction);
        const fishDescriptor = getFishShapeDescriptor(fish, species, now, pose);
        if (!fishDescriptor) {
          continue;
        }

        if (
          (frontDescriptor && shapesOverlapByMaskStrict(fishDescriptor, frontDescriptor, CAVE_STRICT_SAMPLE_STEP_PX)) ||
          (barrierMode === "clear" && barrierDescriptor && shapesOverlapByMaskStrict(fishDescriptor, barrierDescriptor, CAVE_STRICT_SAMPLE_STEP_PX))
        ) {
          continue;
        }

        if (barrierMode === "hit" && barrierDescriptor && !shapeContainedByMaskStrict(barrierDescriptor, fishDescriptor, CAVE_STRICT_SAMPLE_STEP_PX)) {
          continue;
        }
      }

      const score = Math.abs(dx) + Math.abs(dy) * 1.35 + Math.hypot(dx, dy) * 0.4;
      if (score < bestScore) {
        bestScore = score;
        bestPoint = point;
      }
    }
  }

  return bestPoint || (allowFallback ? localDecorPointToTankNorm(item, seedX, seedY) : null);
}

function resolveCaveInteriorPoint(item, fish, species, now, frontDescriptor, barrierDescriptor) {
  if (!item || !fish || !species || !barrierDescriptor?.bounds) {
    return null;
  }

  const centerX = (barrierDescriptor.bounds.left + barrierDescriptor.bounds.right) / 2;
  const centerY = (barrierDescriptor.bounds.top + barrierDescriptor.bounds.bottom) / 2;
  const half = CAVE_CENTER_TARGET_SIZE_PX / 2;
  const minX = Math.max(barrierDescriptor.bounds.left, centerX - half);
  const maxX = Math.min(barrierDescriptor.bounds.right, centerX + half);
  const minY = Math.max(barrierDescriptor.bounds.top, centerY - half);
  const maxY = Math.min(barrierDescriptor.bounds.bottom, centerY + half);
  let bestPoint = null;
  let bestScore = Number.POSITIVE_INFINITY;

  for (let y = minY; y <= maxY + 0.1; y += 5) {
    for (let x = minX; x <= maxX + 0.1; x += 5) {
      const xNorm = clamp(x / TANK_WIDTH, 0.08, 0.92);
      const yNorm = clamp(y / TANK_HEIGHT, 0.14, 0.8);
      const direction = Math.abs(xNorm - fish.xNorm) > 0.001
        ? (xNorm >= fish.xNorm ? 1 : -1)
        : (fish.direction || 1);
      const pose = getFishCollisionPose(fish, species, now, xNorm, yNorm, direction);
      const fishDescriptor = getFishShapeDescriptor(fish, species, now, pose);
      if (!fishDescriptor) {
        continue;
      }

      if (frontDescriptor && shapesOverlapByMask(fishDescriptor, frontDescriptor, 5)) {
        continue;
      }

      if (!shapeContainedByMask(barrierDescriptor, fishDescriptor, 5)) {
        continue;
      }

      const score = Math.hypot(x - centerX, y - centerY);
      if (score >= bestScore) {
        continue;
      }

      bestScore = score;
      bestPoint = {
        x,
        y,
        xNorm,
        yNorm
      };
    }
  }

  return bestPoint;
}

function retargetFishCaveBehavior(fish, species, now = Date.now()) {
  if (!fish?.caveState || !fish.caveDecorId || !species || species.behavior === "sucker") {
    return false;
  }

  const decor = getCaveBehaviorDecorById(fish.caveDecorId);
  if (!decor) {
    return false;
  }

  const plan = buildCaveNavigationPlan(decor, fish, now);
  if (!plan) {
    return false;
  }

  fish.cavePortalId = plan.portalId;
  fish.caveFrontLayer = clampTankLayer(plan.frontLayer);
  fish.caveBackLayer = clampTankLayer(plan.backLayer);
  fish.caveApproachXNorm = plan.approach.xNorm;
  fish.caveApproachYNorm = plan.approach.yNorm;
  fish.caveEntryXNorm = plan.mouth.xNorm;
  fish.caveEntryYNorm = plan.mouth.yNorm;
  fish.caveInsideXNorm = plan.inside.xNorm;
  fish.caveInsideYNorm = plan.inside.yNorm;
  fish.caveInsideUntil = Math.max(Number(fish.caveInsideUntil) || 0, now + 2600);
  fish.hangoutDecorId = plan.decorId;

  if (fish.caveState === "approach") {
    fish.targetXNorm = plan.approach.xNorm;
    fish.targetYNorm = plan.approach.yNorm;
    fish.targetAt = now + 1800 + Math.hypot(fish.xNorm - plan.approach.xNorm, fish.yNorm - plan.approach.yNorm) * 16000;
    setFishDesiredTankLayer(fish, plan.frontLayer);
    return true;
  }

  if (fish.caveState === "align") {
    fish.targetXNorm = plan.mouth.xNorm;
    fish.targetYNorm = plan.mouth.yNorm;
    fish.targetAt = now + 1800 + Math.hypot(fish.xNorm - plan.mouth.xNorm, fish.yNorm - plan.mouth.yNorm) * 14000;
    setFishDesiredTankLayer(fish, plan.frontLayer);
    return true;
  }

  if (fish.caveState === "enter") {
    const nodeIndex = Number.isFinite(fish.cavePathIndex) ? fish.cavePathIndex : 0;
    const node = plan.entryPathNodes[nodeIndex] || plan.inside;
    fish.targetXNorm = node.xNorm;
    fish.targetYNorm = node.yNorm;
    fish.targetAt = now + 2200 + Math.hypot(fish.xNorm - fish.targetXNorm, fish.yNorm - fish.targetYNorm) * 14000;
    setFishDesiredTankLayer(fish, plan.backLayer);
    return true;
  }

  if (fish.caveState === "inside") {
    fish.targetXNorm = plan.inside.xNorm;
    fish.targetYNorm = plan.inside.yNorm;
    fish.targetAt = Math.max(Number(fish.caveInsideUntil) || 0, now + 2200);
    setFishDesiredTankLayer(fish, plan.backLayer);
    return true;
  }

  if (fish.caveState === "exit") {
    const nodeIndex = Number.isFinite(fish.cavePathIndex) ? fish.cavePathIndex : 0;
    const node = plan.exitPathNodes[nodeIndex] || plan.mouth;
    fish.targetXNorm = node.xNorm;
    fish.targetYNorm = node.yNorm;
    fish.targetAt = now + 2200 + Math.hypot(fish.xNorm - fish.targetXNorm, fish.yNorm - fish.targetYNorm) * 14000;
    setFishDesiredTankLayer(fish, plan.backLayer);
    return true;
  }

  if (fish.caveState === "depart") {
    fish.targetXNorm = plan.mouth.xNorm;
    fish.targetYNorm = plan.mouth.yNorm;
    fish.targetAt = now + 1800 + Math.hypot(fish.xNorm - plan.mouth.xNorm, fish.yNorm - plan.mouth.yNorm) * 14000;
    setFishDesiredTankLayer(fish, plan.backLayer);
    return true;
  }

  if (fish.caveState === "leave") {
    fish.targetXNorm = plan.approach.xNorm;
    fish.targetYNorm = plan.approach.yNorm;
    fish.targetAt = now + 1800 + Math.hypot(fish.xNorm - plan.approach.xNorm, fish.yNorm - plan.approach.yNorm) * 14000;
    setFishDesiredTankLayer(fish, plan.frontLayer);
    return true;
  }

  return false;
}

function buildCaveNavigationPlan(item, fish, now = Date.now()) {
  if (!item || !isCaveDecorKey(item.decorKey)) {
    return null;
  }

  const species = fish ? runtime.fishMap.get(fish.speciesId) : null;
  const nav = getCaveNavigationData(item);
  if (!nav || !species || species.behavior === "sucker") {
    return null;
  }

  const span = getDecorLayerSpan(item.decorKey, getDecorTankLayer(item));
  const profile = getCaveBehaviorProfile(item.decorKey);
  const portals = [];

  for (const portal of profile.portals) {
    const approach = resolveOpenCavePoint(
      item,
      portal.approachX,
      portal.approachY,
      nav.frontDescriptor,
      nav.barrierDescriptor,
      fish,
      species,
      now,
      { rangeX: 0.14, rangeY: 0.1, step: 0.02, allowFallback: true, barrierMode: "clear" }
    );
    if (!approach) {
      continue;
    }

    const mouth = resolveOpenCavePoint(
      item,
      portal.mouthX,
      portal.mouthY,
      nav.frontDescriptor,
      null,
      fish,
      species,
      now,
      { rangeX: 0.1, rangeY: 0.1, step: 0.02, allowFallback: false, barrierMode: "clear" }
    );
    if (!mouth) {
      continue;
    }

    const fitCache = new Int8Array(nav.cols * nav.rows);
    fitCache.fill(-1);
    const interiorCandidates = collectCaveNavCandidatesNearWorldPoint(
      nav,
      mouth.x,
      mouth.y,
      Math.max(CAVE_PORTAL_SCAN_RADIUS_PX * 4, 120),
      (index, point, distancePx) => {
        if (!canFishOccupyCaveNavIndex(nav, index, fish, species, now, fitCache)) {
          return false;
        }

        return distancePx;
      }
    );
    if (!interiorCandidates.length) {
      continue;
    }

    const interiorStart = interiorCandidates[0];
    const reachable = buildReachableCaveRegion(nav, interiorStart.index, fish, species, now, fitCache);
    if (!reachable) {
      continue;
    }

    const centerCandidate = findReachableCaveInteriorTarget(nav, reachable, fish, species, now, fitCache);
    if (!centerCandidate) {
      continue;
    }

    const pathIndices = buildCavePathIndices(reachable.parents, interiorStart.index, centerCandidate.index);
    if (!pathIndices.length) {
      continue;
    }

    const pathNodes = compressCavePathNodes(
      pathIndices.map((index) => {
        const col = index % nav.cols;
        const row = Math.floor(index / nav.cols);
        return getCaveNavCellCenter(nav, col, row);
      })
    );
    if (!pathNodes.length) {
      continue;
    }

    const distanceNorm = fish
      ? Math.hypot(fish.xNorm - approach.xNorm, fish.yNorm - approach.yNorm)
      : 0;

    portals.push({
      id: portal.id,
      approach,
      mouth,
      inside: centerCandidate.point,
      entryPathNodes: pathNodes,
      exitPathNodes: [...pathNodes].reverse(),
      outsideLayer: clampTankLayer(Number.isFinite(Number(portal.outsideLayer)) ? Number(portal.outsideLayer) : Math.max(1, span.front - 1)),
      insideLayer: clampTankLayer(Number.isFinite(Number(portal.insideLayer)) ? Number(portal.insideLayer) : (span.mid || span.front)),
      distanceNorm
    });
  }

  if (!portals.length) {
    return null;
  }

  portals.sort((left, right) => left.distanceNorm - right.distanceNorm);
  const bestPortal = portals[0];

  return {
    decorId: item.id,
    portalId: bestPortal.id,
    frontLayer: clampTankLayer(bestPortal.outsideLayer),
    backLayer: clampTankLayer(bestPortal.insideLayer),
    approach: bestPortal.approach,
    mouth: bestPortal.mouth,
    inside: bestPortal.inside,
    entryPathNodes: bestPortal.entryPathNodes,
    exitPathNodes: bestPortal.exitPathNodes,
    lingerMs: profile.lingerMinMs + Math.random() * Math.max(200, profile.lingerMaxMs - profile.lingerMinMs)
  };
}

function pickCaveEntryBehavior(species, fish, now = Date.now()) {
  if (
    !fish ||
    species?.behavior === "sucker" ||
    species?.caveEnabled === false ||
    (Number.isFinite(fish.caveTriggerCooldownUntil) && now < fish.caveTriggerCooldownUntil)
  ) {
    return null;
  }

  if (Math.random() > getCaveBehaviorChance(species, now)) {
    return null;
  }

  const candidates = collectCaveBehaviorPlansForFish(fish, now);
  if (!candidates.length) {
    return null;
  }

  return candidates[0];
}

function setFishTargetToCaveNode(fish, node, now = Date.now(), extraMs = 1800) {
  if (!fish || !node) {
    return false;
  }

  fish.targetXNorm = clamp(node.xNorm, 0.08, 0.92);
  fish.targetYNorm = clamp(node.yNorm, 0.14, 0.8);
  fish.targetAt = now + extraMs + Math.hypot(fish.xNorm - fish.targetXNorm, fish.yNorm - fish.targetYNorm) * 18000;
  return true;
}

function beginFishCaveBehavior(fish, plan, now = Date.now()) {
  if (!fish || !plan) {
    return false;
  }

  runtime.activeFishCavePlans.set(fish.id, {
    decorId: plan.decorId,
    portalId: plan.portalId,
    triggerId: plan.triggerId || plan.portalId,
    seatId: plan.seatId || null,
    frontLayer: clampTankLayer(plan.frontLayer),
    backLayer: clampTankLayer(plan.backLayer),
    approach: { ...plan.approach },
    mouth: { ...plan.mouth },
    inside: { ...plan.inside },
    entryPathNodes: Array.isArray(plan.entryPathNodes) ? plan.entryPathNodes.map((node) => ({ ...node })) : [],
    exitPathNodes: Array.isArray(plan.exitPathNodes) ? plan.exitPathNodes.map((node) => ({ ...node })) : []
  });
  fish.caveState = "approach";
  fish.caveDecorId = plan.decorId;
  fish.cavePortalId = plan.portalId;
  fish.caveTriggerId = plan.triggerId || plan.portalId || null;
  fish.caveSeatId = plan.seatId || null;
  fish.caveFrontLayer = clampTankLayer(plan.frontLayer);
  fish.caveBackLayer = clampTankLayer(plan.backLayer);
  fish.caveApproachXNorm = plan.approach.xNorm;
  fish.caveApproachYNorm = plan.approach.yNorm;
  fish.caveEntryXNorm = plan.mouth.xNorm;
  fish.caveEntryYNorm = plan.mouth.yNorm;
  fish.caveInsideXNorm = plan.inside.xNorm;
  fish.caveInsideYNorm = plan.inside.yNorm;
  fish.caveInsideUntil = now + plan.lingerMs;
  fish.cavePathIndex = null;
  fish.caveIdleTargetXNorm = null;
  fish.caveIdleTargetYNorm = null;
  fish.caveIdleTargetAt = null;
  fish.hangoutDecorId = plan.decorId;
  fish.targetXNorm = plan.approach.xNorm;
  fish.targetYNorm = plan.approach.yNorm;
  fish.targetAt = now + 2200 + Math.hypot(fish.xNorm - plan.approach.xNorm, fish.yNorm - plan.approach.yNorm) * 18000;
  setFishTankLayers(fish, plan.frontLayer, plan.frontLayer);
  return true;
}

function abortFishCaveBehavior(fish, now = Date.now(), blockCurrentDecor = false) {
  if (!fish) {
    return;
  }

  if (blockCurrentDecor && fish.caveDecorId) {
    fish.blockedDecorId = fish.caveDecorId;
    fish.blockedDecorUntil = now + 4200;
  }

  clearFishCaveBehavior(fish);
  fish.hangoutDecorId = null;
}

function isFishWithinCaveCenterTarget(fish) {
  const seatRegion = getActiveFishCaveSeatRegion(fish);
  if (seatRegion) {
    return isFishWithinRegionBounds(fish, seatRegion, 10);
  }

  if (!fish || !Number.isFinite(fish.caveInsideXNorm) || !Number.isFinite(fish.caveInsideYNorm)) {
    return false;
  }

  const toleranceX = (CAVE_CENTER_TARGET_SIZE_PX / 2) / TANK_WIDTH;
  const toleranceY = (CAVE_CENTER_TARGET_SIZE_PX / 2) / TANK_HEIGHT;
  return (
    Math.abs(fish.xNorm - fish.caveInsideXNorm) <= toleranceX &&
    Math.abs(fish.yNorm - fish.caveInsideYNorm) <= toleranceY
  );
}

function fishShapeLeavesActiveCaveInterior(fish, species, now, xNorm, yNorm) {
  if (!fish?.caveState || !["enter", "inside", "exit", "depart"].includes(fish.caveState) || !fish.caveDecorId || !species) {
    return false;
  }

  const plan = getActiveFishCavePlan(fish);
  if (!plan) {
    return true;
  }

  const decor = getCaveBehaviorDecorById(plan.decorId);
  if (!decor) {
    return false;
  }

  const direction = Math.abs(xNorm - fish.xNorm) > 0.001
    ? (xNorm >= fish.xNorm ? 1 : -1)
    : (fish.direction || 1);
  const pose = getFishCollisionPose(fish, species, now, xNorm, yNorm, direction);
  const fishDescriptor = getFishShapeDescriptor(fish, species, now, pose);
  if (!fishDescriptor) {
    return true;
  }

  if (fish.caveState === "enter") {
    return false;
  }

  const interiorDescriptor = getCaveInteriorContainmentDescriptor(decor);
  if (interiorDescriptor && !shapeContainedByMaskStrict(interiorDescriptor, fishDescriptor, CAVE_STRICT_SAMPLE_STEP_PX)) {
    return true;
  }

  const barrierDescriptor = getCaveBarrierDescriptor(decor);
  if (barrierDescriptor && shapesOverlapByMaskStrict(fishDescriptor, barrierDescriptor, CAVE_STRICT_SAMPLE_STEP_PX)) {
    return true;
  }

  return false;
}

function forceFishToCaveFrontLayer(fish, species, now = Date.now()) {
  if (!fish || !species) {
    return false;
  }

  const plan = getActiveFishCavePlan(fish);
  const frontLayer = clampTankLayer(fish.caveFrontLayer || plan?.frontLayer || 2);
  const fallbackXNorm = clamp(
    Number.isFinite(fish.caveApproachXNorm)
      ? fish.caveApproachXNorm
      : (plan?.approach?.xNorm ?? fish.xNorm),
    0.08,
    0.92
  );
  const fallbackYNorm = clamp(
    Number.isFinite(fish.caveApproachYNorm)
      ? fish.caveApproachYNorm
      : (plan?.approach?.yNorm ?? fish.yNorm),
    0.14,
    0.8
  );

  abortFishCaveBehavior(fish, now, true);
  setFishTankLayers(fish, frontLayer, frontLayer);
  setFishDesiredTankLayer(fish, frontLayer);
  fish.targetXNorm = fallbackXNorm;
  fish.targetYNorm = fallbackYNorm;
  fish.targetAt = now + 1400 + Math.hypot(fish.xNorm - fallbackXNorm, fish.yNorm - fallbackYNorm) * 14000;
  fish.hangoutDecorId = null;

  if (Math.abs(fallbackXNorm - fish.xNorm) > 0.001) {
    setFishDirection(fish, fallbackXNorm >= fish.xNorm ? 1 : -1, species, now);
  }

  return true;
}

function retargetFishToSafeCaveInteriorPoint(fish, species, point, now = Date.now(), stateOverride = "enter") {
  if (!fish || !species || !point) {
    return false;
  }

  const backLayer = clampTankLayer(fish.caveBackLayer || DEFAULT_TANK_LAYER);
  if (stateOverride) {
    fish.caveState = stateOverride;
  }
  fish.cavePathIndex = null;
  fish.caveIdleTargetXNorm = null;
  fish.caveIdleTargetYNorm = null;
  fish.caveIdleTargetAt = null;
  fish.targetXNorm = clamp(point.xNorm, 0.08, 0.92);
  fish.targetYNorm = clamp(point.yNorm, 0.14, 0.8);
  fish.targetAt = now + 900 + Math.hypot(fish.xNorm - fish.targetXNorm, fish.yNorm - fish.targetYNorm) * 14000;
  setFishTankLayers(fish, backLayer, backLayer);
  setFishDesiredTankLayer(fish, backLayer);

  if (Math.abs(fish.targetXNorm - fish.xNorm) > FISH_DIRECTION_TARGET_DEADZONE_NORM) {
    setFishDirection(fish, fish.targetXNorm >= fish.xNorm ? 1 : -1, species, now);
  }

  return true;
}

function enforceActiveCaveMaskRule(fish, species, now = Date.now()) {
  if (!fish?.caveState || !species || species.behavior === "sucker") {
    return false;
  }

  if (!["enter", "inside", "exit", "depart"].includes(fish.caveState)) {
    return false;
  }

  if (!fishShapeLeavesActiveCaveInterior(fish, species, now, fish.xNorm, fish.yNorm)) {
    return false;
  }

  const decor = getCaveBehaviorDecorById(fish.caveDecorId);
  const decorMeta = decor ? runtime.decorMap.get(decor.decorKey) : null;
  if (decor && decorMeta?.triggerPath && fish.caveState === "inside") {
    const seatRegion = getActiveFishCaveSeatRegion(fish);
    const settlePoint = seatRegion
      ? (pickCaveSeatIdleTarget(decor, seatRegion, fish, species, now) || {
        xNorm: seatRegion.xNorm,
        yNorm: seatRegion.yNorm
      })
      : (
        Number.isFinite(fish.caveInsideXNorm) && Number.isFinite(fish.caveInsideYNorm)
          ? { xNorm: fish.caveInsideXNorm, yNorm: fish.caveInsideYNorm }
          : null
      );

    if (settlePoint) {
      return retargetFishToSafeCaveInteriorPoint(fish, species, settlePoint, now, "enter");
    }
  }

  return forceFishToCaveFrontLayer(fish, species, now);
}

function updateFishCaveBehavior(fish, species, now = Date.now()) {
  if (!fish?.caveState || !fish.caveDecorId || species?.behavior === "sucker" || fish.activity !== "roam") {
    return false;
  }

  const plan = getActiveFishCavePlan(fish);
  if (!plan || plan.decorId !== fish.caveDecorId) {
    abortFishCaveBehavior(fish, now, false);
    return false;
  }

  const decorItem = getCaveBehaviorDecorById(plan.decorId);
  if (!decorItem) {
    abortFishCaveBehavior(fish, now, false);
    return false;
  }

  const triggerRegion = getActiveFishCaveTriggerRegion(fish);
  const seatRegion = getActiveFishCaveSeatRegion(fish);
  const mouthNode = triggerRegion || plan.mouth;
  const insideNode = seatRegion || plan.inside;
  const distanceToTarget = Math.hypot(fish.targetXNorm - fish.xNorm, fish.targetYNorm - fish.yNorm);
  const reachedTarget = distanceToTarget <= CAVE_GENERAL_REACHED_DISTANCE_NORM;
  const reachedMouth = distanceToTarget <= CAVE_MOUTH_REACHED_DISTANCE_NORM;
  const reachedTrigger = triggerRegion ? isFishWithinRegionBounds(fish, triggerRegion, 8) : reachedMouth;

  if (fish.caveState === "approach") {
    fish.hangoutDecorId = fish.caveDecorId;
    setFishTankLayers(
      fish,
      clampTankLayer(fish.caveFrontLayer || DEFAULT_TANK_LAYER),
      clampTankLayer(fish.caveFrontLayer || DEFAULT_TANK_LAYER)
    );
    if (reachedTarget) {
      fish.caveState = "align";
      fish.cavePathIndex = null;
      setFishTankLayers(
        fish,
        clampTankLayer(fish.caveFrontLayer || DEFAULT_TANK_LAYER),
        clampTankLayer(fish.caveFrontLayer || DEFAULT_TANK_LAYER)
      );
      if (!setFishTargetToCaveNode(fish, mouthNode, now, 1200)) {
        abortFishCaveBehavior(fish, now, true);
        return false;
      }
      return true;
    }

    return true;
  }

  if (fish.caveState === "align") {
    fish.hangoutDecorId = fish.caveDecorId;
    setFishTankLayers(
      fish,
      clampTankLayer(fish.caveFrontLayer || DEFAULT_TANK_LAYER),
      clampTankLayer(fish.caveFrontLayer || DEFAULT_TANK_LAYER)
    );
    if (reachedTrigger) {
      fish.xNorm = clamp(mouthNode.xNorm, 0.08, 0.92);
      fish.yNorm = clamp(mouthNode.yNorm, 0.14, 0.8);
      fish.targetXNorm = fish.xNorm;
      fish.targetYNorm = fish.yNorm;
      const mouthPose = getFishCollisionPose(fish, species, now, fish.xNorm, fish.yNorm, fish.direction || 1);
      if (!canFishChangeToLayer(fish, species, now, clampTankLayer(fish.caveBackLayer || DEFAULT_TANK_LAYER), mouthPose)) {
        setFishTankLayers(
          fish,
          clampTankLayer(fish.caveFrontLayer || DEFAULT_TANK_LAYER),
          clampTankLayer(fish.caveFrontLayer || DEFAULT_TANK_LAYER)
        );
        setFishDesiredTankLayer(fish, clampTankLayer(fish.caveFrontLayer || DEFAULT_TANK_LAYER));
        fish.targetAt = now + 900;
        return true;
      }
      fish.caveTriggerCooldownUntil = now + CAVE_TRIGGER_COOLDOWN_MS;
      fish.caveIdleTargetXNorm = null;
      fish.caveIdleTargetYNorm = null;
      fish.caveIdleTargetAt = null;
      setFishTankLayers(
        fish,
        clampTankLayer(fish.caveBackLayer || DEFAULT_TANK_LAYER),
        clampTankLayer(fish.caveBackLayer || DEFAULT_TANK_LAYER)
      );

      fish.caveState = "enter";
      fish.cavePathIndex = 0;

      if (!setFishTargetToCaveNode(fish, plan.entryPathNodes[0] || insideNode, now, 1200)) {
        abortFishCaveBehavior(fish, now, true);
        return false;
      }
      return true;
    }

    return true;
  }

  if (fish.caveState === "enter") {
    fish.hangoutDecorId = fish.caveDecorId;
    setFishTankLayers(
      fish,
      clampTankLayer(fish.caveBackLayer || TANK_DEPTH_LAYERS),
      clampTankLayer(fish.caveBackLayer || TANK_DEPTH_LAYERS)
    );
    if (reachedTarget) {
      const nextIndex = (Number.isFinite(fish.cavePathIndex) ? fish.cavePathIndex : 0) + 1;
      if (nextIndex < plan.entryPathNodes.length) {
        fish.cavePathIndex = nextIndex;
        setFishTargetToCaveNode(fish, plan.entryPathNodes[nextIndex], now, 1300);
        return true;
      }

      fish.caveState = "inside";
      fish.cavePathIndex = null;
      fish.caveInsideUntil = Math.max(Number(fish.caveInsideUntil) || 0, now + CAVE_TRIGGER_COOLDOWN_MS);
      fish.caveIdleTargetXNorm = null;
      fish.caveIdleTargetYNorm = null;
      fish.caveIdleTargetAt = null;
      fish.targetXNorm = fish.xNorm;
      fish.targetYNorm = fish.yNorm;
      fish.targetAt = Math.max(fish.caveInsideUntil || 0, now + 1200);
      setFishDesiredTankLayer(fish, clampTankLayer(fish.caveBackLayer || TANK_DEPTH_LAYERS));
      return true;
    }

    return true;
  }

  if (fish.caveState === "inside") {
    fish.hangoutDecorId = fish.caveDecorId;
    setFishTankLayers(
      fish,
      clampTankLayer(fish.caveBackLayer || TANK_DEPTH_LAYERS),
      clampTankLayer(fish.caveBackLayer || TANK_DEPTH_LAYERS)
    );
    const shouldRetargetSeatIdle =
      !Number.isFinite(fish.caveIdleTargetAt) ||
      now >= fish.caveIdleTargetAt ||
      !Number.isFinite(fish.caveIdleTargetXNorm) ||
      !Number.isFinite(fish.caveIdleTargetYNorm) ||
      Math.hypot(
        fish.xNorm - (fish.caveIdleTargetXNorm ?? insideNode.xNorm),
        fish.yNorm - (fish.caveIdleTargetYNorm ?? insideNode.yNorm)
      ) <= 0.006;

    if (seatRegion && shouldRetargetSeatIdle) {
      const decor = getCaveBehaviorDecorById(fish.caveDecorId);
      const idlePoint = decor ? pickCaveSeatIdleTarget(decor, seatRegion, fish, species, now) : insideNode;
      fish.caveIdleTargetXNorm = idlePoint?.xNorm ?? insideNode.xNorm;
      fish.caveIdleTargetYNorm = idlePoint?.yNorm ?? insideNode.yNorm;
      fish.caveIdleTargetAt = now + randomBetween(CAVE_IDLE_TARGET_MIN_MS, CAVE_IDLE_TARGET_MAX_MS);
    }

    fish.targetXNorm = Number.isFinite(fish.caveIdleTargetXNorm) ? fish.caveIdleTargetXNorm : insideNode.xNorm;
    fish.targetYNorm = Number.isFinite(fish.caveIdleTargetYNorm) ? fish.caveIdleTargetYNorm : insideNode.yNorm;
    if (
      isFishWithinCaveCenterTarget(fish) &&
      now >= (fish.caveInsideUntil || fish.targetAt) &&
      now >= (fish.caveTriggerCooldownUntil || 0)
    ) {
      fish.caveState = "exit";
      fish.cavePathIndex = 0;
      fish.caveIdleTargetXNorm = null;
      fish.caveIdleTargetYNorm = null;
      fish.caveIdleTargetAt = null;
      setFishDesiredTankLayer(fish, clampTankLayer(fish.caveBackLayer || TANK_DEPTH_LAYERS));
      if (!setFishTargetToCaveNode(fish, plan.exitPathNodes[0] || mouthNode, now, 1300)) {
        abortFishCaveBehavior(fish, now, true);
        return false;
      }
      return true;
    }

    return true;
  }

  if (fish.caveState === "exit") {
    fish.hangoutDecorId = fish.caveDecorId;
    setFishTankLayers(
      fish,
      clampTankLayer(fish.caveBackLayer || TANK_DEPTH_LAYERS),
      clampTankLayer(fish.caveBackLayer || TANK_DEPTH_LAYERS)
    );
    if (reachedTrigger || reachedTarget) {
      const nextIndex = (Number.isFinite(fish.cavePathIndex) ? fish.cavePathIndex : 0) + 1;
      if (nextIndex < plan.exitPathNodes.length) {
        fish.cavePathIndex = nextIndex;
        setFishTargetToCaveNode(fish, plan.exitPathNodes[nextIndex], now, 1300);
        return true;
      }

      fish.xNorm = clamp(mouthNode.xNorm, 0.08, 0.92);
      fish.yNorm = clamp(mouthNode.yNorm, 0.14, 0.8);
      fish.targetXNorm = fish.xNorm;
      fish.targetYNorm = fish.yNorm;
      const mouthPose = getFishCollisionPose(fish, species, now, fish.xNorm, fish.yNorm, fish.direction || 1);
      if (!canFishChangeToLayer(fish, species, now, clampTankLayer(fish.caveFrontLayer || DEFAULT_TANK_LAYER), mouthPose)) {
        fish.targetAt = now + 900;
        return true;
      }
      fish.caveState = "leave";
      fish.cavePathIndex = null;
      fish.caveTriggerCooldownUntil = now + CAVE_TRIGGER_COOLDOWN_MS;
      fish.targetXNorm = fish.caveApproachXNorm;
      fish.targetYNorm = fish.caveApproachYNorm;
      fish.targetAt = now + 5000;
      setFishTankLayers(
        fish,
        clampTankLayer(fish.caveFrontLayer || DEFAULT_TANK_LAYER),
        clampTankLayer(fish.caveFrontLayer || DEFAULT_TANK_LAYER)
      );
      return true;
    }

    return true;
  }

  if (fish.caveState === "depart") {
    fish.hangoutDecorId = fish.caveDecorId;
    setFishTankLayers(
      fish,
      clampTankLayer(fish.caveBackLayer || DEFAULT_TANK_LAYER),
      clampTankLayer(fish.caveBackLayer || DEFAULT_TANK_LAYER)
    );
    if (reachedMouth) {
      fish.xNorm = clamp(plan.mouth.xNorm, 0.08, 0.92);
      fish.yNorm = clamp(plan.mouth.yNorm, 0.14, 0.8);
      fish.targetXNorm = fish.xNorm;
      fish.targetYNorm = fish.yNorm;
      fish.caveState = "leave";
      fish.targetXNorm = fish.caveApproachXNorm;
      fish.targetYNorm = fish.caveApproachYNorm;
      fish.targetAt = now + 5000;
      setFishTankLayers(
        fish,
        clampTankLayer(fish.caveFrontLayer || DEFAULT_TANK_LAYER),
        clampTankLayer(fish.caveFrontLayer || DEFAULT_TANK_LAYER)
      );
      return true;
    }

    return true;
  }

  if (fish.caveState === "leave") {
    fish.hangoutDecorId = fish.caveDecorId;
    setFishTankLayers(
      fish,
      clampTankLayer(fish.caveFrontLayer || DEFAULT_TANK_LAYER),
      clampTankLayer(fish.caveFrontLayer || DEFAULT_TANK_LAYER)
    );
    if (reachedTarget || now > fish.targetAt + 2400) {
      abortFishCaveBehavior(fish, now, false);
      fish.targetAt = now;
      return false;
    }

    return true;
  }

  abortFishCaveBehavior(fish, now, false);
  return false;
}



function getCaveBarrierDescriptor(item) {
  if (!item || !isCaveDecorKey(item.decorKey)) {
    return null;
  }

  const span = getDecorLayerSpan(item.decorKey, getDecorTankLayer(item));
  const descriptor = getCaveShellDescriptor(item);
  if (!descriptor) {
    return null;
  }

  return {
    ...descriptor,
    decorId: item.id,
    frontLayer: span.front,
    barrierLayer: span.mid,
    backLayer: span.back
  };
}

function segmentHitsShapeDescriptor(
  descriptor,
  fromX,
  fromY,
  toX,
  toY,
  threshold = ALPHA_COLLISION_THRESHOLD,
  sampleStepPx = 8
) {
  if (!descriptor) {
    return false;
  }

  if (
    !boundsIntersect(
      descriptor.bounds,
      {
        left: Math.min(fromX, toX),
        right: Math.max(fromX, toX),
        top: Math.min(fromY, toY),
        bottom: Math.max(fromY, toY)
      }
    )
  ) {
    return false;
  }

  const dx = toX - fromX;
  const dy = toY - fromY;
  const distance = Math.hypot(dx, dy);
  const steps = Math.max(1, Math.ceil(distance / Math.max(2, sampleStepPx)));

  for (let index = 0; index <= steps; index += 1) {
    const t = index / steps;
    const x = fromX + dx * t;
    const y = fromY + dy * t;

    if (pointHitsShapeDescriptor(descriptor, x, y, threshold)) {
      return true;
    }
  }

  return false;
}

function getFishCollisionPose(fish, species, now, xNorm, yNorm, directionOverride = null) {
  const pose = getFishPose(fish, species, now);
  const direction = directionOverride == null
    ? (Math.abs(fish.targetXNorm - fish.xNorm) > 0.0001 ? (fish.targetXNorm >= fish.xNorm ? 1 : -1) : (fish.direction || 1))
    : directionOverride;

  return {
    ...pose,
    x: xNorm * TANK_WIDTH,
    y: yNorm * TANK_HEIGHT,
    direction,
    facingScaleX: direction < 0 ? -1 : 1
  };
}

function fishPoseHitsCaveBarrier(fish, species, now, pose, barrierDescriptor) {
  const fishDescriptor = getFishShapeDescriptor(fish, species, now, pose);
  if (!fishDescriptor || !barrierDescriptor) {
    return false;
  }

  return shapesOverlapByMaskStrict(fishDescriptor, barrierDescriptor, CAVE_STRICT_SAMPLE_STEP_PX);
}

function getFishFootprintBoundsAtPose(fish, species, now, pose) {
  const image = runtime.images.get(species?.asset);
  if (!fish || !species || !pose || !image) {
    return null;
  }

  const width = species.width * fish.scale;
  const height = width * (image.height / image.width);
  const centerX = pose.x + (pose.swayX || 0);
  const centerY = pose.y;
  const radiusX = width * 0.38;
  const radiusY = height * 0.32;

  return {
    left: centerX - radiusX,
    right: centerX + radiusX,
    top: centerY - radiusY,
    bottom: centerY + radiusY
  };
}

function getBlockingCaveFootprint(item) {
  if (!item || !isCaveDecorKey(item.decorKey)) {
    return null;
  }

  return getPlacedDecorOpaqueBounds(item);
}

function findBlockingCaveForFishPose(fish, species, now, pose, layerOverride = null) {
  if (!fish || !species || species.behavior === "sucker") {
    return null;
  }

  const testLayer = clampTankLayer(layerOverride ?? getFishTankLayer(fish));
  if (testLayer < 3) {
    return null;
  }

  const fishDescriptor = getFishShapeDescriptor(fish, species, now, pose);
  if (!fishDescriptor) {
    return null;
  }

  for (const item of state.placedDecor) {
    if (!isCaveDecorKey(item.decorKey)) {
      continue;
    }

    const descriptor = getCaveBlockingDescriptorForLayer(item, testLayer);
    if (!descriptor) {
      continue;
    }

    if (boundsIntersect(fishDescriptor.bounds, descriptor.bounds) && shapesOverlapByMaskStrict(fishDescriptor, descriptor, CAVE_STRICT_SAMPLE_STEP_PX)) {
      return {
        item,
        span: getDecorLayerSpan(item.decorKey, getDecorTankLayer(item)),
        descriptor
      };
    }
  }

  return null;
}

function pushFishOutOfBlockingCave(fish, species, now) {
  if (!fish || !species || fish.caveState) {
    return false;
  }

  const pose = getFishPose(fish, species, now);
  const blocking = findBlockingCaveForFishPose(fish, species, now, pose);
  if (!blocking) {
    return false;
  }

  const fishX = fish.xNorm * TANK_WIDTH;
  const fishY = fish.yNorm * TANK_HEIGHT;
  const footprint = blocking.descriptor?.bounds;
  if (!footprint) {
    return false;
  }
  const leftEscapePx = Math.abs(fishX - footprint.left);
  const rightEscapePx = Math.abs(footprint.right - fishX);
  const escapeLeft = leftEscapePx <= rightEscapePx;
  const targetX = escapeLeft ? footprint.left - 36 : footprint.right + 36;
  const targetY = Math.min(footprint.bottom + 18, TANK_HEIGHT * 0.79);

  const safeFrontLayer = Math.max(1, clampTankLayer((blocking.span?.front || 3) - 1));
  setFishTankLayers(fish, safeFrontLayer, safeFrontLayer);
  fish.targetXNorm = clamp(targetX / TANK_WIDTH, 0.08, 0.92);
  fish.targetYNorm = clamp(targetY / TANK_HEIGHT, 0.14, 0.8);
  fish.targetAt = now + 1800 + Math.hypot(fish.xNorm - fish.targetXNorm, fish.yNorm - fish.targetYNorm) * 14000;
  fish.hangoutDecorId = null;
  fish.blockedDecorId = blocking.item.id;
  fish.blockedDecorUntil = now + 5200;
  if (Math.abs(fish.targetXNorm - fish.xNorm) > 0.002) {
    setFishDirection(fish, fish.targetXNorm >= fish.xNorm ? 1 : -1, species, now);
  }
  return true;
}

function pathHitsShapeAtLayer(fish, species, fromXNorm, fromYNorm, toXNorm, toYNorm, now, descriptor) {
  if (!descriptor) {
    return false;
  }

  const direction = Math.abs(toXNorm - fromXNorm) > 0.0001
    ? (toXNorm >= fromXNorm ? 1 : -1)
    : (fish.direction || 1);
  const fullDx = toXNorm - fromXNorm;
  const fullDy = toYNorm - fromYNorm;
  const fullDistancePx = Math.hypot(fullDx * TANK_WIDTH, fullDy * TANK_HEIGHT);
  const samples = Math.max(2, Math.ceil(fullDistancePx / 4));

  for (let i = 1; i <= samples; i += 1) {
    const t = i / samples;
    const sampleXNorm = fromXNorm + fullDx * t;
    const sampleYNorm = fromYNorm + fullDy * t;
    const pose = getFishCollisionPose(fish, species, now, sampleXNorm, sampleYNorm, direction);
    const fishDescriptor = getFishShapeDescriptor(fish, species, now, pose);
    if (fishDescriptor && shapesOverlapByMask(fishDescriptor, descriptor, 5)) {
      return true;
    }
  }

  return false;
}

function pathHitsActiveCaveFront(fish, species, fromXNorm, fromYNorm, toXNorm, toYNorm, now) {
  if (!fish?.caveState || ["approach", "align", "leave"].includes(fish.caveState) || !fish.caveDecorId) {
    return false;
  }

  const decor = getCaveBehaviorDecorById(fish.caveDecorId);
  if (!decor) {
    return false;
  }

  const frontDescriptor = getDecorShapeDescriptor(decor);
  return pathHitsShapeAtLayer(fish, species, fromXNorm, fromYNorm, toXNorm, toYNorm, now, frontDescriptor);
}

function pathHitsAnyCaveBarrierAtLayer(fish, species, fromXNorm, fromYNorm, toXNorm, toYNorm, now, testLayer) {
  const direction = Math.abs(toXNorm - fromXNorm) > 0.0001
    ? (toXNorm >= fromXNorm ? 1 : -1)
    : (fish.direction || 1);

  for (const item of state.placedDecor) {
    const barrier = getCaveBarrierDescriptor(item);
    if (!barrier) {
      continue;
    }

    if (fish?.caveDecorId && item.id === fish.caveDecorId && fish.caveState && !["approach", "align", "leave"].includes(fish.caveState)) {
      continue;
    }

    if (testLayer < barrier.barrierLayer) {
      continue;
    }

    const fullDx = toXNorm - fromXNorm;
    const fullDy = toYNorm - fromYNorm;
    const fullDistancePx = Math.hypot(fullDx * TANK_WIDTH, fullDy * TANK_HEIGHT);
    const samples = Math.max(2, Math.ceil(fullDistancePx / 4));

    for (let i = 1; i <= samples; i += 1) {
      const t = i / samples;
      const sampleXNorm = fromXNorm + fullDx * t;
      const sampleYNorm = fromYNorm + fullDy * t;
      const pose = getFishCollisionPose(fish, species, now, sampleXNorm, sampleYNorm, direction);

      if (fishPoseHitsCaveBarrier(fish, species, now, pose, barrier)) {
        return true;
      }
    }
  }

  return false;
}

function resolveFishCaveCollision(fish, nextXNorm, nextYNorm, now = Date.now()) {
  const species = runtime.fishMap.get(fish.speciesId);
  if (!species || species.behavior === "sucker") {
    return {
      xNorm: nextXNorm,
      yNorm: nextYNorm,
      blocked: false
    };
  }

  const currentLayer = getFishTankLayer(fish);
  const effectiveLayer = currentLayer;
  const startXNorm = fish.xNorm;
  const startYNorm = fish.yNorm;
  let resolvedXNorm = clamp(nextXNorm, 0.08, 0.92);
  let resolvedYNorm = clamp(nextYNorm, 0.14, 0.8);

  if (effectiveLayer < 3) {
    return {
      xNorm: resolvedXNorm,
      yNorm: resolvedYNorm,
      blocked: false
    };
  }

  const nextPose = getFishCollisionPose(
    fish,
    species,
    now,
    resolvedXNorm,
    resolvedYNorm,
    Math.abs(resolvedXNorm - startXNorm) > 0.0001
      ? (resolvedXNorm >= startXNorm ? 1 : -1)
      : (fish.direction || 1)
  );
  const blockingCave = findBlockingCaveForFishPose(fish, species, now, nextPose, effectiveLayer);
  if (!blockingCave) {
    return {
      xNorm: resolvedXNorm,
      yNorm: resolvedYNorm,
      blocked: false,
      blockingCave: null
    };
  }

  if (!fish.caveState) {
    return {
      xNorm: startXNorm,
      yNorm: startYNorm,
      blocked: true,
      blockingCave
    };
  }

  return {
    xNorm: startXNorm,
    yNorm: startYNorm,
    blocked: true,
    blockingCave
  };
}

function getFishShapeDescriptor(fish, species, now, poseOverride = null) {
  const image = runtime.images.get(species?.asset);
  const mask = species ? getImageAlphaMask(species.asset) : null;
  if (!species || !image || !mask) {
    return null;
  }

  const pose = poseOverride || getFishPose(fish, species, now);
  const width = species.width * fish.scale;
  const height = width * (image.height / image.width);
  const centerX = pose.x + pose.swayX;
  const centerY = pose.y;
  const facingScaleX = pose.facingScaleX ?? (pose.direction < 0 ? -1 : 1);
  const bodyScaleX = pose.bodyScaleX || 1;
  const bodyScaleY = pose.bodyScaleY || 1;
  const tilt = pose.tilt || 0;
  const drawX = -width / 2 + pose.wiggle * width * 0.018;
  const drawY = -height / 2;
  const cos = Math.cos(-tilt);
  const sin = Math.sin(-tilt);
  const worldCos = Math.cos(tilt);
  const worldSin = Math.sin(tilt);
  const localToWorld = (localX, localY) => {
    const sx = localX * bodyScaleX;
    const sy = localY * bodyScaleY;
    const rx = sx * worldCos - sy * worldSin;
    const ry = sx * worldSin + sy * worldCos;
    return {
      x: centerX + rx * facingScaleX,
      y: centerY + ry
    };
  };
  const corners = [
    localToWorld(drawX, drawY),
    localToWorld(drawX + width, drawY),
    localToWorld(drawX + width, drawY + height),
    localToWorld(drawX, drawY + height)
  ];

  return {
    mask,
    bounds: {
      left: Math.min(...corners.map((corner) => corner.x)),
      right: Math.max(...corners.map((corner) => corner.x)),
      top: Math.min(...corners.map((corner) => corner.y)),
      bottom: Math.max(...corners.map((corner) => corner.y))
    },
    worldToUv(worldX, worldY) {
      let localX = worldX - centerX;
      let localY = worldY - centerY;
      localX /= Math.abs(facingScaleX) < 0.0001 ? 1 : facingScaleX;
      const rotatedX = localX * cos - localY * sin;
      const rotatedY = localX * sin + localY * cos;
      localX = rotatedX / (Math.abs(bodyScaleX) < 0.0001 ? 1 : bodyScaleX);
      localY = rotatedY / (Math.abs(bodyScaleY) < 0.0001 ? 1 : bodyScaleY);
      return {
        u: (localX - drawX) / width,
        v: (localY - drawY) / height
      };
    }
  };
}

function getOverlappingDecorForFish(fish, species, now, poseOverride = null, options = null) {
  const fishDescriptor = getFishShapeDescriptor(fish, species, now, poseOverride);
  if (!fishDescriptor) {
    return [];
  }

  const minLayer = Number.isFinite(options?.minLayer) ? clampTankLayer(options.minLayer) : 1;
  const maxLayer = Number.isFinite(options?.maxLayer) ? clampTankLayer(options.maxLayer) : TANK_DEPTH_LAYERS;
  const overlaps = [];
  for (const item of state.placedDecor) {
    const itemLayer = getDecorTankLayer(item);
    if (itemLayer < minLayer || itemLayer > maxLayer) {
      continue;
    }

    const opaqueBounds = getPlacedDecorOpaqueBounds(item);
    if (opaqueBounds && !boundsIntersect(fishDescriptor.bounds, opaqueBounds)) {
      continue;
    }

    const decorDescriptor = getDecorShapeDescriptor(item);
    if (!decorDescriptor || !shapesOverlapByMask(fishDescriptor, decorDescriptor, 10)) {
      continue;
    }

    overlaps.push({
      item,
      layer: itemLayer,
      descriptor: decorDescriptor
    });
  }

  return overlaps;
}

function getOverlappingFishForLayerChange(fish, species, now, poseOverride = null, options = null) {
  const fishDescriptor = getFishShapeDescriptor(fish, species, now, poseOverride);
  if (!fishDescriptor) {
    return [];
  }

  const minLayer = Number.isFinite(options?.minLayer) ? clampTankLayer(options.minLayer) : 1;
  const maxLayer = Number.isFinite(options?.maxLayer) ? clampTankLayer(options.maxLayer) : TANK_DEPTH_LAYERS;
  const overlaps = [];

  for (const otherFish of state.fish) {
    if (!otherFish || otherFish.id === fish.id || isFishDead(otherFish)) {
      continue;
    }

    const otherLayer = getFishTankLayer(otherFish);
    if (otherLayer < minLayer || otherLayer > maxLayer) {
      continue;
    }

    const otherSpecies = runtime.fishMap.get(otherFish.speciesId);
    if (!otherSpecies) {
      continue;
    }

    const otherPose = getFishPose(otherFish, otherSpecies, now);
    const otherBounds = getFishOcclusionBounds(otherFish, otherSpecies, otherPose);
    if (otherBounds && !boundsIntersect(fishDescriptor.bounds, otherBounds)) {
      continue;
    }

    const otherDescriptor = getFishShapeDescriptor(otherFish, otherSpecies, now, otherPose);
    if (!otherDescriptor || !shapesOverlapByMask(fishDescriptor, otherDescriptor, 10)) {
      continue;
    }

    overlaps.push({
      fish: otherFish,
      layer: otherLayer,
      descriptor: otherDescriptor
    });
  }

  return overlaps;
}

function canFishChangeToLayer(fish, species, now, desiredLayer, poseOverride = null) {
  const currentLayer = getFishTankLayer(fish);
  const targetLayer = clampTankLayer(desiredLayer);
  if (targetLayer === currentLayer) {
    return true;
  }

  const pose = poseOverride || getFishPose(fish, species, now);
  if (findBlockingCaveForFishPose(fish, species, now, pose, targetLayer)) {
    return false;
  }

  const minLayer = Math.min(currentLayer, targetLayer);
  const maxLayer = Math.max(currentLayer, targetLayer);
  const decorOverlaps = getOverlappingDecorForFish(fish, species, now, pose, {
    minLayer,
    maxLayer
  });
  const fishOverlaps = getOverlappingFishForLayerChange(fish, species, now, pose, {
    minLayer,
    maxLayer
  });

  if (targetLayer > currentLayer) {
    return !decorOverlaps.some(({ layer }) => layer >= currentLayer && layer <= targetLayer) &&
      !fishOverlaps.some(({ layer }) => layer >= currentLayer && layer <= targetLayer);
  }

  return !decorOverlaps.some(({ layer }) => layer <= currentLayer && layer >= targetLayer) &&
    !fishOverlaps.some(({ layer }) => layer <= currentLayer && layer >= targetLayer);
}

function syncFishDrawLayer(fish, species, now) {
  if (species.behavior === "sucker") {
    setFishTankLayers(fish, TANK_DEPTH_LAYERS, TANK_DEPTH_LAYERS);
    return;
  }

  if (fish.caveState) {
    const lockedLayer = ["approach", "align", "leave"].includes(fish.caveState)
      ? clampTankLayer(fish.caveFrontLayer || DEFAULT_TANK_LAYER)
      : clampTankLayer(fish.caveBackLayer || DEFAULT_TANK_LAYER);
    setFishTankLayers(fish, lockedLayer, lockedLayer);
    return;
  }

  const currentLayer = getFishTankLayer(fish);
  const desiredLayer = getDesiredFishTankLayer(fish);
  setFishTankLayers(fish, currentLayer, desiredLayer);
  if (desiredLayer === currentLayer) {
    return;
  }

  const pose = getFishPose(fish, species, now);
  if (canFishChangeToLayer(fish, species, now, desiredLayer, pose)) {
    setFishTankLayers(fish, desiredLayer, desiredLayer);
  }
}

function isFishInsideTargetDecor(fish, species, pose) {
  const currentLayer = getFishTankLayer(fish);
  if (!fish.hangoutDecorId) {
    return !isFishOccludedByDecor(fish, species, pose);
  }

  const overlap = getOverlappingDecorForFish(fish, species, Date.now(), pose).find(({ item }) => item.id === fish.hangoutDecorId);
  return Boolean(overlap && currentLayer > overlap.layer);
}

function isFishOccludedByDecor(fish, species, pose) {
  const currentLayer = getFishTankLayer(fish);
  return getOverlappingDecorForFish(fish, species, Date.now(), pose).some(({ layer }) => layer < currentLayer);
}

function getFishOcclusionBounds(fish, species, pose) {
  const image = runtime.images.get(species.asset);
  const width = species.width * fish.scale;
  const height = width * (image ? image.height / image.width : 0.65);
  const bodyWidth = width * 0.52;
  const bodyHeight = height * 0.36;

  return {
    left: pose.x - bodyWidth / 2,
    right: pose.x + bodyWidth / 2,
    top: pose.y - bodyHeight / 2,
    bottom: pose.y + bodyHeight / 2
  };
}

function boundsIntersect(leftBounds, rightBounds) {
  return !(
    leftBounds.right <= rightBounds.left ||
    leftBounds.left >= rightBounds.right ||
    leftBounds.bottom <= rightBounds.top ||
    leftBounds.top >= rightBounds.bottom
  );
}

function isTankOverlayTarget(target) {
  return (
    target instanceof Element &&
    Boolean(target.closest("#tankSidebar, .tank-display, .tank-bottom-dock, #editDecorTray, #editFishTray, .tank-overlay-hints, .store-overlay, .fish-inspector, .tab-buttons"))
  );
}

function randomSwimX() {
  return 0.08 + Math.random() * 0.84;
}

function randomSwimY() {
  return 0.14 + Math.random() * 0.66;
}

function getFishFacingDirection(fish) {
  return Number(fish?.displayDirection) < 0 ? -1 : 1;
}

function normalizeAngle(angle) {
  let next = Number.isFinite(Number(angle)) ? Number(angle) : 0;
  while (next > Math.PI) {
    next -= Math.PI * 2;
  }
  while (next <= -Math.PI) {
    next += Math.PI * 2;
  }
  return next;
}

function getFishFacingAngle(fish) {
  return Number.isFinite(Number(fish?.displayAngle))
    ? normalizeAngle(Number(fish.displayAngle))
    : (getFishFacingDirection(fish) < 0 ? Math.PI : 0);
}

function getDirectedAngleDelta(fromAngle, toAngle, spinDirection = 1) {
  const start = normalizeAngle(fromAngle);
  const end = normalizeAngle(toAngle);
  const clockwiseDelta = (end - start + Math.PI * 2) % (Math.PI * 2);
  const counterClockwiseDelta = clockwiseDelta - Math.PI * 2;
  const shortestDelta = Math.abs(clockwiseDelta) <= Math.abs(counterClockwiseDelta)
    ? clockwiseDelta
    : counterClockwiseDelta;
  if (Math.abs(shortestDelta) <= Math.PI * 0.55) {
    return shortestDelta;
  }
  return spinDirection < 0 ? counterClockwiseDelta : clockwiseDelta;
}

function updateFishTurnState(fish, species, now) {
  if (species.behavior !== "sucker") {
    const liveDirection = Number(fish.direction) < 0 ? -1 : 1;
    if (!fish.turnStartedAt || fish.turnDurationMs <= 0) {
      fish.displayDirection = liveDirection;
      fish.displayAngle = liveDirection < 0 ? Math.PI : 0;
      fish.turnStartedAt = null;
      fish.turnDurationMs = 0;
      fish.turnFromDirection = fish.displayDirection;
      fish.turnToDirection = fish.displayDirection;
      fish.turnFromAngle = fish.displayAngle;
      fish.turnToAngle = fish.displayAngle;
      fish.turnSpinDirection = fish.displayDirection < 0 ? 1 : -1;
      return;
    }

    const progress = clamp((now - fish.turnStartedAt) / fish.turnDurationMs, 0, 1);
    const fromDirection = Number(fish.turnFromDirection) < 0 ? -1 : 1;
    const toDirection = Number(fish.turnToDirection) < 0 ? -1 : 1;
    const visibleDirection = progress < 0.5 ? fromDirection : toDirection;
    fish.displayDirection = visibleDirection;
    fish.displayAngle = visibleDirection < 0 ? Math.PI : 0;

    if (progress >= 1) {
      fish.displayDirection = liveDirection;
      fish.displayAngle = liveDirection < 0 ? Math.PI : 0;
      fish.turnStartedAt = null;
      fish.turnDurationMs = 0;
      fish.turnFromDirection = fish.displayDirection;
      fish.turnToDirection = fish.displayDirection;
      fish.turnFromAngle = fish.displayAngle;
      fish.turnToAngle = fish.displayAngle;
      fish.turnSpinDirection = fish.displayDirection < 0 ? 1 : -1;
    }
    return;
  }

  if (!fish.turnStartedAt || fish.turnDurationMs <= 0) {
    fish.displayAngle = getFishFacingAngle(fish);
    fish.displayDirection = Math.cos(fish.displayAngle) < 0 ? -1 : 1;
    return;
  }

  if (now >= fish.turnStartedAt + fish.turnDurationMs) {
    fish.displayAngle = Number.isFinite(Number(fish.turnToAngle))
      ? normalizeAngle(Number(fish.turnToAngle))
      : getFishFacingAngle(fish);
    fish.displayDirection = Math.cos(fish.displayAngle) < 0 ? -1 : 1;
    fish.turnStartedAt = null;
    fish.turnDurationMs = 0;
    fish.turnFromDirection = fish.displayDirection;
    fish.turnToDirection = fish.displayDirection;
    fish.turnFromAngle = fish.displayAngle;
    fish.turnToAngle = fish.displayAngle;
    fish.turnSpinDirection = fish.displayDirection < 0 ? 1 : -1;
  }
}

function setSuckerFishAngle(fish, desiredAngle, now) {
  const nextAngle = normalizeAngle(desiredAngle);
  const currentAngle = getFishFacingAngle(fish);
  if (Math.abs(getDirectedAngleDelta(currentAngle, nextAngle, fish.turnSpinDirection || 1)) < 0.06) {
    fish.displayAngle = nextAngle;
    fish.displayDirection = Math.cos(nextAngle) < 0 ? -1 : 1;
    fish.direction = fish.displayDirection;
    return;
  }

  const pendingAngle = fish.turnStartedAt && fish.turnDurationMs > 0
    ? normalizeAngle(Number.isFinite(Number(fish.turnToAngle)) ? Number(fish.turnToAngle) : currentAngle)
    : currentAngle;
  if (Math.abs(getDirectedAngleDelta(pendingAngle, nextAngle, fish.turnSpinDirection || 1)) < 0.08) {
    return;
  }

  if (fish.turnStartedAt && fish.turnDurationMs > 0) {
    return;
  }

  const spinDirection = Math.random() < 0.5 ? -1 : 1;
  const turnDelta = getDirectedAngleDelta(currentAngle, nextAngle, spinDirection);
  fish.turnStartedAt = now;
  fish.turnDurationMs = 900 + Math.abs(turnDelta) * 620 + Math.random() * 420;
  fish.turnFromAngle = currentAngle;
  fish.turnToAngle = nextAngle;
  fish.turnSpinDirection = spinDirection;
  fish.turnFromDirection = Math.cos(currentAngle) < 0 ? -1 : 1;
  fish.turnToDirection = Math.cos(nextAngle) < 0 ? -1 : 1;
  fish.direction = fish.turnToDirection;
}

function setFishDirection(fish, desiredDirection, species, now) {
  const nextDirection = Number(desiredDirection) < 0 ? -1 : 1;
  if (species.behavior !== "sucker") {
    const currentDisplayDirection = getFishFacingDirection(fish);
    const currentDisplayAngle = currentDisplayDirection < 0 ? Math.PI : 0;
    fish.direction = nextDirection;

    if (fish.turnStartedAt && fish.turnDurationMs > 0) {
      const pendingDirection = Number(fish.turnToDirection) < 0 ? -1 : 1;
      if (nextDirection === pendingDirection) {
        return;
      }

      if (nextDirection === currentDisplayDirection) {
        fish.displayDirection = nextDirection;
        fish.displayAngle = currentDisplayAngle;
        fish.turnStartedAt = null;
        fish.turnDurationMs = 0;
        fish.turnFromDirection = nextDirection;
        fish.turnToDirection = nextDirection;
        fish.turnFromAngle = currentDisplayAngle;
        fish.turnToAngle = currentDisplayAngle;
        fish.turnSpinDirection = nextDirection < 0 ? 1 : -1;
      }
      return;
    }

    if (nextDirection === currentDisplayDirection) {
      fish.displayDirection = nextDirection;
      fish.displayAngle = currentDisplayAngle;
      fish.turnStartedAt = null;
      fish.turnDurationMs = 0;
      fish.turnFromDirection = nextDirection;
      fish.turnToDirection = nextDirection;
      fish.turnFromAngle = currentDisplayAngle;
      fish.turnToAngle = currentDisplayAngle;
      fish.turnSpinDirection = nextDirection < 0 ? 1 : -1;
      return;
    }

    fish.displayDirection = currentDisplayDirection;
    fish.displayAngle = currentDisplayAngle;
    fish.turnStartedAt = now;
    fish.turnDurationMs = getFishTurnDurationMs(fish, species);
    fish.turnFromDirection = currentDisplayDirection;
    fish.turnToDirection = nextDirection;
    fish.turnFromAngle = currentDisplayAngle;
    fish.turnToAngle = nextDirection < 0 ? Math.PI : 0;
    fish.turnSpinDirection = Math.random() < 0.5 ? -1 : 1;
    return;
  }

  fish.direction = nextDirection;
  setSuckerFishAngle(fish, nextDirection < 0 ? Math.PI : 0, now);
}

function getActiveGravelContour() {
  if (runtime.scene?.gravelSurfaceContour?.length) {
    return runtime.scene.gravelSurfaceContour;
  }
  return runtime.scene?.substrateContour || [0, 0];
}

function getGravelSurfacePointY(point) {
  return FLOOR_Y - GRAVEL_SURFACE_RISE_PX + point * 11;
}

function traceTankFloorPath(context = tankContext, ridge = getActiveGravelContour()) {
  context.beginPath();
  context.moveTo(GLASS_MARGIN_X, TANK_HEIGHT - GLASS_MARGIN_BOTTOM);
  context.lineTo(GLASS_MARGIN_X, getGravelSurfacePointY(ridge[0]));
  ridge.forEach((point, index) => {
    const x = GLASS_MARGIN_X + (index / (ridge.length - 1)) * (TANK_WIDTH - GLASS_MARGIN_X * 2);
    const y = getGravelSurfacePointY(point);
    context.lineTo(x, y);
  });
  context.lineTo(TANK_WIDTH - GLASS_MARGIN_X, TANK_HEIGHT - GLASS_MARGIN_BOTTOM);
  context.closePath();
}

function traceTankFloorSurfaceBandPath(context = tankContext, ridge = getActiveGravelContour(), bandDepthPx = GRAVEL_SURFACE_CAP_DEPTH_PX + 7) {
  const points = ridge.map((point, index) => ({
    x: GLASS_MARGIN_X + (index / (ridge.length - 1)) * (TANK_WIDTH - GLASS_MARGIN_X * 2),
    y: getGravelSurfacePointY(point)
  }));

  context.beginPath();
  context.moveTo(points[0].x, points[0].y - 2);
  points.forEach((point) => {
    context.lineTo(point.x, point.y - 2);
  });
  for (let index = points.length - 1; index >= 0; index -= 1) {
    const point = points[index];
    context.lineTo(point.x, point.y + bandDepthPx);
  }
  context.closePath();
}

function getTankFloorSurfaceYAtX(x) {
  const ridge = getActiveGravelContour();
  const width = TANK_WIDTH - GLASS_MARGIN_X * 2;
  const normalized = clamp((x - GLASS_MARGIN_X) / width, 0, 1) * (ridge.length - 1);
  const leftIndex = Math.floor(normalized);
  const rightIndex = Math.min(ridge.length - 1, leftIndex + 1);
  const blend = normalized - leftIndex;
  const heightPoint = ridge[leftIndex] * (1 - blend) + ridge[rightIndex] * blend;
  return getGravelSurfacePointY(heightPoint);
}

function buildGravelSurfaceContour(seed = 1) {
  const rand = mulberry32((Math.abs(Math.floor(seed || 1)) || 1) ^ 0x3c6ef35f);
  const contour = Array.from({ length: SUBSTRATE_CONTOUR_POINTS }, (_, index) => {
    const t = index / Math.max(1, SUBSTRATE_CONTOUR_POINTS - 1);
    const longWave = Math.sin(t * Math.PI * (1.12 + rand() * 0.26) + rand() * Math.PI * 2) * 0.3;
    const midWave = Math.sin(t * Math.PI * (2.45 + rand() * 0.9) + rand() * Math.PI * 2) * 0.11;
    const ripple = Math.sin(t * Math.PI * (5.4 + rand() * 1.1) + rand() * Math.PI * 2) * 0.035;
    return longWave + midWave + ripple + (rand() - 0.5) * 0.05;
  });

  for (let pass = 0; pass < 2; pass += 1) {
    for (let index = 1; index < contour.length - 1; index += 1) {
      contour[index] = contour[index - 1] * 0.24 + contour[index] * 0.52 + contour[index + 1] * 0.24;
    }
  }

  contour[0] *= 0.3;
  contour[contour.length - 1] *= 0.3;
  return contour.map((value) => clamp(value, -0.42, 0.42));
}

function createSceneSeeds() {
  const rand = mulberry32(34127);
  const contour = Array.from({ length: SUBSTRATE_CONTOUR_POINTS }, (_, index) => {
    const t = index / (SUBSTRATE_CONTOUR_POINTS - 1);
    const longWave = Math.sin(t * Math.PI * 1.12 + 0.3) * 0.18;
    const shortWave = Math.sin(t * Math.PI * 3.4 + 1.1) * 0.06;
    return longWave + shortWave + (rand() - 0.5) * 0.04;
  });
  return {
    bubbles: Array.from({ length: 34 }, () => {
      const styleRoll = rand();
      return {
        x: 0.08 + rand() * 0.84,
        size: 3.2 + rand() * 9.2,
        speed: 0.03 + rand() * 0.08,
        offset: rand(),
        wobble: 6 + rand() * 18,
        wave: 4 + rand() * 6,
        stretch: 0.84 + rand() * 0.42,
        alpha: 0.18 + rand() * 0.32,
        spriteScale: 2.8 + rand() * 2.6,
        spriteIndex: Math.floor(rand() * Math.max(1, runtime.bubbleCatalog.length || 3)),
        count: 2 + Math.floor(rand() * 3),
        style: styleRoll < 0.22 ? "sprite" : styleRoll < 0.52 ? "cluster" : styleRoll < 0.78 ? "fizz" : "ring",
        layer: 1 + Math.min(AMBIENT_BUBBLE_DEPTH_LAYERS - 1, Math.floor(Math.pow(rand(), 0.86) * AMBIENT_BUBBLE_DEPTH_LAYERS))
      };
    }),
    substrateContour: contour,
    grimeMarks: Array.from({ length: 70 }, () => ({
      x: rand(),
      y: rand(),
      rx: 36 + rand() * 120,
      ry: 10 + rand() * 46,
      rotation: rand() * Math.PI,
      color: rand() > 0.5 ? "rgba(124, 173, 74, 0.36)" : "rgba(96, 148, 69, 0.28)"
    }))
  };
}

function buildFishName(speciesId, takenNames) {
  const pool = runtime.fishMap.get(speciesId)?.defaultNames || FISH_NAME_POOL[speciesId] || [];
  const unused = pool.find((name) => !takenNames.includes(name));
  if (unused) {
    return unused;
  }

  const species = runtime.fishMap.get(speciesId);
  const count = takenNames.filter((name) => name.startsWith(species?.name || "Fish")).length + 1;
  return `${species?.name || "Fish"} ${count}`;
}

function renderHearts(units) {
  return Array.from({ length: 3 }, (_, index) => {
    const remaining = units - index * 2;
    const klass = remaining >= 2 ? "full" : remaining === 1 ? "half" : "";
    return `<span class="heart ${klass}">&#9829;</span>`;
  }).join("");
}

function createId(prefix) {
  if (window.crypto?.randomUUID) {
    return `${prefix}-${window.crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

function formatNumber(value) {
  return new Intl.NumberFormat().format(value);
}

function formatDuration(ms) {
  if (ms <= 0) {
    return "0m";
  }

  const totalMinutes = Math.ceil(ms / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return `${days}d ${hours}h`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

function timeAgo(timestamp) {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) {
    return "Just now";
  }
  if (minutes < 60) {
    return `${minutes}m ago`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function titleFromFile(fileName) {
  return fileName
    .replace(/\.[^.]+$/, "")
    .split(/[-_]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function pluralize(word, amount) {
  return amount === 1 ? word : `${word}s`;
}

function getBottomDockOffsetPx() {
  const dock = document.querySelector(".tank-bottom-dock");
  if (!dock) {
    return 24;
  }

  const rect = dock.getBoundingClientRect();
  return Math.max(24, Math.round(window.innerHeight - rect.top + 12));
}

function positionToast() {
  if (!dom.toast) {
    return;
  }

  dom.toast.style.left = "50%";
  dom.toast.style.top = "24px";
  dom.toast.style.bottom = "auto";
}

function showToast(message) {
  dom.toast.textContent = message;
  positionToast();
  dom.toast.classList.add("is-visible");

  if (runtime.toastHandle) {
    clearTimeout(runtime.toastHandle);
  }

  runtime.toastHandle = setTimeout(() => {
    dom.toast.classList.remove("is-visible");
  }, 2200);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function randomBetweenWith(rand, min, max) {
  const sample = typeof rand === "function" ? rand() : Math.random();
  return min + sample * (max - min);
}

function distance(x1, y1, x2, y2) {
  return Math.hypot(x1 - x2, y1 - y2);
}

function mulberry32(seed) {
  let current = seed;
  return () => {
    current |= 0;
    current = (current + 0x6d2b79f5) | 0;
    let t = Math.imul(current ^ (current >>> 15), 1 | current);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
