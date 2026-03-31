const STORAGE_KEY = "bubble-borough-save-v1";
const HARDWARE_ACCELERATION_NOTICE_STORAGE_KEY = "bubble-borough-hardware-acceleration-dismissed";
const SAVE_FILE_FORMAT = "bubble-borough-save";
const SAVE_FILE_EXPORT_VERSION = 1;
const STATE_VERSION = 12;
const STARTING_COINS = 20;
const DEBUG_MODE = false;
const LEGACY_MAX_HEALTH_UNITS = 6;
const HEALTH_MODEL_VERSION = 3;
const LEGACY_HEALTH_SCALE_MODEL_VERSION = 2;
const MIN_FISH_HEARTS = 2;
const MAX_FISH_HEARTS = 10;
const FISH_HEALTH_SIZE_BASE_MAX_HEARTS = 8;
const PREMIUM_FISH_HEART_COST_THRESHOLD = 20;
const ULTRA_PREMIUM_FISH_HEART_COST_THRESHOLD = 40;
const PREMIUM_FISH_HEART_BONUS = 1;
const ULTRA_PREMIUM_FISH_HEART_BONUS = 2;
const FISH_MEAL_COIN_COST_DIVISOR = 4;
const MAX_FISH_MEAL_COINS = 10;
const RECOVERY_FEED_STREAK = 4;
const STARVATION_DAMAGE_MISSED_MEALS_THRESHOLD = 4;
const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_MS = 7 * DAY_MS;
const HOUR_MS = 60 * 60 * 1000;
const CRITICAL_COMFORT_HEALTH_TICK_MS = 6 * HOUR_MS;
const POOP_FALL_MS = 18 * 1000;
const TANK_WIDTH = 1280;
const TANK_HEIGHT = 720;
const SCRUB_GRID_COLS = 72;
const SCRUB_GRID_ROWS = 40;
const SCRUB_THRESHOLD = 0.8;
const SCRUB_BRUSH_RADIUS = 124;
const SCRUB_STROKE_STEP = 34;
const GRIME_CACHE_PRECISION = 1000;
const GRIME_VISUAL_START_DIRTINESS = 0.1;
const SEVERE_GRIME_VISUAL_THRESHOLD = 0.72;
const CLEAN_FADE_MS = 950;
const CLEAN_SPARKLE_MS = 1550;
const DEFAULT_THEME = "dark";
const NONE_BACKGROUND_ASSET_KEY = "none.png";
const DEFAULT_BACKGROUND_ASSET_KEY = "classic-sand.png";
const DEFAULT_GRAVEL_ASSET_KEY = "classic-sand.png";
const CUSTOM_GRAVEL_LAYER_COUNT = 3;
const DEFAULT_CUSTOM_GRAVEL_LAYER_COLOR = "#2F80FF";
const CUSTOM_GRAVEL_LAYER_SPECS = Object.freeze([
  {
    id: "layer-1",
    label: "Layer 1",
    drawOrderLabel: "Draws first",
    fileName: "Gravel_L1.png",
    manifestKeys: ["Gravel_L1.png", "Gravel_1.png"]
  },
  {
    id: "layer-2",
    label: "Layer 2",
    drawOrderLabel: "Draws second",
    fileName: "Gravel_L2.png",
    manifestKeys: ["Gravel_L2.png", "Gravel_2.png"]
  },
  {
    id: "layer-3",
    label: "Layer 3",
    drawOrderLabel: "Draws third",
    fileName: "Gravel_L3.png",
    manifestKeys: ["Gravel_L3.png", "Gravel_3.png"]
  }
]);
const CUSTOM_GRAVEL_TOP_PEBBLE_SPECS = Object.freeze([
  { id: "top-pebble-1", fileName: "pebble_1.png", manifestKeys: ["pebble_1.png"] },
  { id: "top-pebble-2", fileName: "pebble_2.png", manifestKeys: ["pebble_2.png"] },
  { id: "top-pebble-3", fileName: "pebble_3.png", manifestKeys: ["pebble_3.png"] }
]);
const CUSTOM_GRAVEL_TOP_PEBBLE_COUNT = 1000;
const CUSTOM_GRAVEL_TOP_PEBBLE_DEPTH_PX = 200;
const CUSTOM_GRAVEL_TOP_PEBBLE_SIZE_MIN_PX = 10;
const CUSTOM_GRAVEL_TOP_PEBBLE_SIZE_MAX_PX = 10;
const CUSTOM_GRAVEL_TOP_PEBBLE_SPRITE_CACHE_SIZE = 96;
const FISH_GRAVEL_PEBBLE_ACTIVITY = "gravel-play";
const FISH_GRAVEL_PEBBLE_CHANCE_PER_SECOND = 0.0026;
const MAX_ACTIVE_FISH_GRAVEL_PEBBLE_ACTIONS = 1;
const MAX_ACTIVE_FISH_GRAVEL_PEBBLE_TOSSES = 6;
const FISH_GRAVEL_PEBBLE_PICKUP_REACHED_DISTANCE_NORM = 0.026;
const FISH_GRAVEL_PEBBLE_SPIT_REACHED_DISTANCE_NORM = 0.03;
const FISH_GRAVEL_PEBBLE_PICKUP_Y_OFFSET_MIN_PX = 12;
const FISH_GRAVEL_PEBBLE_PICKUP_Y_OFFSET_MAX_PX = 20;
const FISH_GRAVEL_PEBBLE_CARRY_RISE_MIN_NORM = 0.18;
const FISH_GRAVEL_PEBBLE_CARRY_RISE_MAX_NORM = 0.32;
const FISH_GRAVEL_PEBBLE_HOLD_SIZE_MIN_PX = 12;
const FISH_GRAVEL_PEBBLE_HOLD_SIZE_MAX_PX = 18;
const CUSTOM_GRAVEL_COLOR_OPTIONS = Object.freeze([
  { key: "electric-blue", label: "Electric Blue", color: "#2F80FF" },
  { key: "cyan-pop", label: "Cyan Pop", color: "#18D6FF" },
  { key: "aqua-burst", label: "Aqua Burst", color: "#1FE7C9" },
  { key: "seafoam-glow", label: "Seafoam Glow", color: "#42F5A1" },
  { key: "neon-green", label: "Neon Green", color: "#57F000" },
  { key: "lime-spark", label: "Lime Spark", color: "#A8FF2A" },
  { key: "sun-yellow", label: "Sun Yellow", color: "#FFD93D" },
  { key: "gold-flare", label: "Gold Flare", color: "#FFB703" },
  { key: "orange-zing", label: "Orange Zing", color: "#FF8C42" },
  { key: "tangerine-pop", label: "Tangerine Pop", color: "#FF6B35" },
  { key: "coral-punch", label: "Coral Punch", color: "#FF5E78" },
  { key: "hot-pink", label: "Hot Pink", color: "#FF4FBF" },
  { key: "bubblegum", label: "Bubblegum", color: "#FF77E1" },
  { key: "magenta-flash", label: "Magenta Flash", color: "#E83DFF" },
  { key: "violet-burst", label: "Violet Burst", color: "#B55CFF" },
  { key: "ultraviolet", label: "Ultraviolet", color: "#8E5BFF" },
  { key: "royal-purple", label: "Royal Purple", color: "#6D3DFF" },
  { key: "crimson-wave", label: "Crimson Wave", color: "#E63946" },
  { key: "ruby-red", label: "Ruby Red", color: "#FF3355" },
  { key: "cherry-pop", label: "Cherry Pop", color: "#FF1744" },
  { key: "teal-current", label: "Teal Current", color: "#00B8A9" },
  { key: "jade-flash", label: "Jade Flash", color: "#10D98B" },
  { key: "orchid-glow", label: "Orchid Glow", color: "#C65BFF" },
  { key: "indigo-pulse", label: "Indigo Pulse", color: "#4F46E5" },
  { key: "white-glow", label: "White", color: "#FFFFFF" },
  { key: "stone-gray", label: "Gray", color: "#8C96A8" },
  { key: "deep-black", label: "Black", color: "#212121" }
]);
const DEFAULT_CUSTOM_GRAVEL_LAYER_COLORS = Object.freeze(
  Array.from({ length: CUSTOM_GRAVEL_LAYER_COUNT }, () => DEFAULT_CUSTOM_GRAVEL_LAYER_COLOR)
);
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
const BUBBLER_LAYER = TANK_DEPTH_LAYERS;
const DEFAULT_BUBBLER_SPOUT_QTY = 1;
const DEFAULT_BUBBLER_INTENSITY = 1;
const MAX_BUBBLER_INTENSITY = 24;
const DEFAULT_BUBBLER_SPREAD_PX = 14;
const DEFAULT_BUBBLER_FADE_DISTANCE_PX = 140;
const DEFAULT_BUBBLER_BUBBLE_COLOR = "#FFFFFF";
const DEFAULT_BUBBLER_BUBBLE_OPACITY = 1.35;
const DEFAULT_BUBBLER_SPEED = 1;
const MIN_BUBBLER_SPEED = 0.2;
const MAX_BUBBLER_SPEED = 4;
const MAX_BUBBLER_VISIBLE_BUBBLES_PER_SPOUT = 72;
const MIN_BUBBLER_STREAM_CADENCE_MS = 120;
const MAX_BUBBLER_STREAM_CADENCE_MS = 1350;
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
const CAVE_POST_EXIT_COOLDOWN_MS = 24 * 1000;
const CAVE_IDLE_TARGET_MIN_MS = 2400;
const CAVE_IDLE_TARGET_MAX_MS = 4200;
const CAVE_NORMAL_ROAM_SIT_CHANCE_DAY = 0.25;
const CAVE_NORMAL_ROAM_LEAVE_CHANCE_DAY = 0.25;
const CAVE_NORMAL_ROAM_SIT_CHANCE_NIGHT = 0.5;
const CAVE_NORMAL_ROAM_LEAVE_CHANCE_NIGHT = 0.25;
const CAVE_NORMAL_SEAT_HOLD_MIN_MS = 12 * 1000;
const CAVE_NORMAL_SEAT_HOLD_MAX_MS = 22 * 1000;
const CAVE_NORMAL_SEAT_SETTLE_DISTANCE_NORM = 0.008;
const CAVE_DEBUG_TEST_ROAM_MS = 5 * 1000;
const CAVE_DEBUG_TEST_SEAT_MS = 2 * 1000;
const CAVE_DEBUG_TEST_SEAT_SETTLE_DISTANCE_NORM = 0.008;
const CAVE_SEAT_LOCKED_LAYER = 4;
const CAVE_TRIGGER_STALL_FORCE_MS = 250;
const CAVE_TRIGGER_STALL_FORCE_DISTANCE_NORM = 0.034;
const CAVE_SEAT_MARKER_MAX_SIZE_PX = 18;
const CAVE_SEAT_MARKER_EXPAND_RADIUS_PX = 22;
const OPTIONAL_BUBBLE_ORB_ASSET_PATH = "assets/misc/bubble.png";
const BASIC_FILTER_KEY = "basic-filter.png";
const DEFAULT_FILTER_ASSET_KEY = BASIC_FILTER_KEY;
const BASE_TANK_DIRTY_DAYS = 3.5;
const FISH_DIRTINESS_BONUS_MIN = 0.01;
const FISH_DIRTINESS_BONUS_MAX = 0.10;
const DEAD_FISH_DIRTINESS_BONUS = 0.5;
const CRITICAL_TANK_DIRTINESS = 0.999;
const SICK_FISH_HEALTH_RATIO_THRESHOLD = 0.5;
const POOP_ASSET_PATH = "assets/misc/fishpoops.png";
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
const SAME_SPECIES_FOLLOW_RADIUS_NORM = 0.34;
const SAME_SPECIES_FOLLOW_BASE_CHANCE = 0.08;
const SAME_SPECIES_FOLLOW_NEIGHBOR_BONUS = 0.035;
const SAME_SPECIES_FOLLOW_MAX_CHANCE = 0.42;
const SAME_SPECIES_FOLLOW_MIN_MS = 2200;
const SAME_SPECIES_FOLLOW_MAX_MS = 4800;
const SAME_SPECIES_FOLLOW_SPACING_MIN_NORM = 0.024;
const SAME_SPECIES_FOLLOW_SPACING_MAX_NORM = 0.07;
const SAME_SPECIES_FOLLOW_VERTICAL_JITTER_NORM = 0.03;
const BABY_FISH_SCALE_MULTIPLIER = 0.25;
const BABY_FISH_GROWTH_DURATION_MS = 3 * DAY_MS;
const BREEDING_MIN_TANK_TIME_MS = 2 * DAY_MS;
const BREEDING_BASE_CHANCE_PER_WINDOW = 0.15;
const BREEDING_EXTRA_PAIR_BONUS_CHANCE = 0.06;
const BREEDING_MAX_CHANCE_PER_WINDOW = 0.45;
const BREEDING_COOLDOWN_MS = 2 * DAY_MS;
const DEBUG_BREEDING_HOLD_MS = 60 * 1000;
const DEBUG_BREEDING_REACHED_DISTANCE_NORM = 0.024;
const BETTA_ATTACK_PASS_CHANCE = 0.001;
const BETTA_ATTACK_TRIGGER_RANGE_NORM = 0.052;
const BETTA_ATTACK_RELEASE_RANGE_NORM = 0.074;
const CAVE_NIGHT_ENTRY_CHANCE = 0.5;
const CAVE_NIGHT_START_HOUR = 21;
const CAVE_NIGHT_END_HOUR = 4;
const CAVE_ENTRY_CHANCE_BY_STYLE = {
  peaceful: 0.1,
  steady: 0.1,
  sporadic: 0.1
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
    id: "brine-shrimp",
    name: "Brine Shrimp",
    cost: 2,
    mealCoins: 0,
    asset: "/assets/fish/brineshrimp_1.png",
    assetVariants: [
      "/assets/fish/brineshrimp_1.png",
      "/assets/fish/brineshrimp_2.png"
    ],
    description: "A tiny drifting scavenger that hangs low and pecks at trace grime.",
    width: 84,
    defaultScale: 0.5,
    shadowScale: 0.14,
    bobSpeed: 1.65,
    swimStyle: "sporadic",
    speedMin: 0.014,
    speedMax: 0.028,
    targetMinMs: 1800,
    targetMaxMs: 4200,
    behavior: "shrimp",
    diet: "detritus",
    cleanupMinMs: 28 * 60 * 1000,
    cleanupMaxMs: 54 * 60 * 1000,
    cleanupStrength: 0.012,
    poopCleanupChance: 0.08,
    defaultNames: ["Briny", "Speck", "Mote", "Pip"]
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
  "none.png": {
    name: "None",
    blurb: "Skip the backdrop image and let the tank render without a background art layer."
  },
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
  "basic-filter.png": {
    name: "Basic Filter",
    blurb: "The starter filter. It is always installed by default and keeps an empty tank clean for about 3.5 days.",
    cleanDays: BASE_TANK_DIRTY_DAYS,
    comfortBoost: 0,
    cost: 0,
    purchasable: false,
    tier: 0,
    flow: 1
  },
  "charcoal-filter.png": {
    name: "Charcoal Filter",
    blurb: "A sturdier cartridge that buys more time before haze takes over and gives fish a small comfort boost.",
    cleanDays: 5.25,
    comfortBoost: 0.04,
    cost: 50,
    purchasable: true,
    tier: 1,
    flow: 1.04
  },
  "porcelain-filter.png": {
    name: "Porcelain Filter",
    blurb: "A cleaner, calmer filter bed that stretches out grime buildup and noticeably lifts fish comfort.",
    cleanDays: 7,
    comfortBoost: 0.08,
    cost: 100,
    purchasable: true,
    tier: 2,
    flow: 1.08
  },
  "reef-filter.png": {
    name: "Reef Filter",
    blurb: "The strongest filter in town. An empty tank can stay clean for about a week and a half with this one running.",
    cleanDays: 10.5,
    comfortBoost: 0.12,
    cost: 150,
    purchasable: true,
    tier: 3,
    flow: 1.14
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
  debugBreedButton: document.querySelector("#debugBreedButton"),
  resetFishHealthButton: document.querySelector("#resetFishHealthButton"),
  addCoinsButton: document.querySelector("#addCoinsButton"),
  maxDirtButton: document.querySelector("#maxDirtButton"),
  deleteAllButton: document.querySelector("#deleteAllButton"),
  debugGravelPebbleButton: document.querySelector("#debugGravelPebbleButton"),
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
  equipmentShop: document.querySelector("#equipmentShop"),
  storeOverlay: document.querySelector("#storeOverlay"),
  hardwareAccelerationNotice: document.querySelector("#hardwareAccelerationNotice"),
  hardwareAccelerationDontShow: document.querySelector("#hardwareAccelerationDontShow"),
  hardwareAccelerationOkay: document.querySelector("#hardwareAccelerationOkay"),
  storeFishTab: document.querySelector("#storeFishTab"),
  storeDecorTab: document.querySelector("#storeDecorTab"),
  storeEquipmentTab: document.querySelector("#storeEquipmentTab"),
  storeCoinCounter: document.querySelector("#storeCoinCounter"),
  closeStoreOverlay: document.querySelector("#closeStoreOverlay"),
  openStoreButton: document.querySelector("#openStoreButton"),
  openEquipmentShopButton: document.querySelector("#openEquipmentShopButton"),
  placedDecorList: document.querySelector("#placedDecorList"),
  backgroundList: document.querySelector("#backgroundList"),
  tankAssetList: document.querySelector("#tankAssetList"),
  filterAssetList: document.querySelector("#filterAssetList"),
  //gravelPaletteSlots: document.querySelector("#gravelPaletteSlots"),
  //gravelPaletteChoices: document.querySelector("#gravelPaletteChoices"),
  gravelAssetList: document.querySelector("#gravelAssetList"),
  customGravelPanel: document.querySelector("#customGravelPanel"),
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
  hardwareAccelerationNoticeOpen: false,
  storeTab: "fish",
  sidebarCollapsed: true,
  editTankMode: false,
  fishEditMode: false,
  toolModeSource: null,
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
  customGravelLayerCatalog: [],
  customGravelPebbleCatalog: [],
  bubbleCatalog: [],
  suckerFishCatalog: [],
  decorCatalog: [],
  decorMeta: { ...DECOR_META },
  fishCatalog: [...FISH_TYPES],
  fishMap: new Map(FISH_TYPES.map((fish) => [fish.id, fish])),
  fishSizeRange: {
    min: Math.min(...FISH_TYPES.map((fish) => fish.width)),
    max: Math.max(...FISH_TYPES.map((fish) => fish.width))
  },
  fishCostRange: {
    min: Math.min(...FISH_TYPES.map((fish) => fish.cost)),
    max: Math.max(...FISH_TYPES.map((fish) => fish.cost))
  },
  decorMap: new Map(),
  backgroundMap: new Map(),
  tankMap: new Map(),
  filterMap: new Map(),
  gravelMap: new Map(),
  bubbleMap: new Map(),
  images: new Map(),
  alphaMaskCache: new Map(),
  bubblerSpoutOriginCache: new Map(),
  maskRegionCache: new Map(),
  caveInteriorMaskCache: new Map(),
  caveShellMaskCache: new Map(),
  caveNavCache: new Map(),
  activeFishCavePlans: new Map(),
  gravelTintCache: new Map(),
  bubbleOrbTintCache: new Map(),
  customGravelTintCache: new Map(),
  gravelSourceStats: new Map(),
  customGravelTopLayerCacheKey: "",
  customGravelTopLayerCanvas: null,
  gravelBedCacheKey: "",
  gravelBedCanvas: null,
  gravelCapCanvas: null,
  scrubMaskCanvas: document.createElement("canvas"),
  grimeBaseCanvas: document.createElement("canvas"),
  grimeBaseCacheKey: "",
  shadowCanvas: document.createElement("canvas"),
  fishGravelPebbleActions: new Map(),
  fishPebbleTosses: [],
  renderedMarkup: Object.create(null),
  renderedDataKeys: Object.create(null),
  lastGrimeCanvasFilter: "",
  lastTankCanvasFilter: "",
  toastHandle: null,
  lastAnimationFrameAt: 0,
  debugBreedingSequence: null,
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
  debugForcedCaveFishId: null,
  debugForcedCaveDecorId: null,
  collapsedSections: {
    fishTank: true,
    fishDead: true,
    fishStorage: true,
    decorPlaced: true,
    decorStorage: true,
    decorBackgrounds: true,
    decorTankShell: true,
    decorFilter: true,
    decorGravel: true,
    decorCustomGravel: true
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
  runtime.storeTab = ["fish", "decor", "equipment"].includes(tab) ? tab : "fish";
  renderUi(Date.now());
}

function closeStoreOverlay() {
  runtime.storeOverlayOpen = false;
  renderUi(Date.now());
}

function hasDismissedHardwareAccelerationNotice() {
  try {
    return localStorage.getItem(HARDWARE_ACCELERATION_NOTICE_STORAGE_KEY) === "1";
  } catch (error) {
    console.error(error);
    return false;
  }
}

function setHardwareAccelerationNoticeDismissed(dismissed) {
  try {
    if (dismissed) {
      localStorage.setItem(HARDWARE_ACCELERATION_NOTICE_STORAGE_KEY, "1");
    } else {
      localStorage.removeItem(HARDWARE_ACCELERATION_NOTICE_STORAGE_KEY);
    }
  } catch (error) {
    console.error(error);
  }
}

function dismissHardwareAccelerationNotice() {
  const dismissed = Boolean(dom.hardwareAccelerationDontShow?.checked);
  setHardwareAccelerationNoticeDismissed(dismissed);
  runtime.hardwareAccelerationNoticeOpen = false;
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

function toggleEditTankMode(force = null, options = {}) {
  const nextMode = typeof force === "boolean" ? force : !runtime.editTankMode;
  clearPrimaryToolModes();

  if (nextMode) {
    runtime.editTankMode = true;
    runtime.toolModeSource = options.source || "toolbar";
    if (options.collapseSidebar) {
      runtime.sidebarCollapsed = true;
    }
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

function clearPrimaryToolModes() {
  runtime.editTankMode = false;
  runtime.fishEditMode = false;
  runtime.toolModeSource = null;
  runtime.placementMode = null;
  runtime.placementPreview = null;
  runtime.cleaningMode = false;
  runtime.scoopMode = false;
  runtime.dragState = null;
  runtime.fishDragState = null;
  runtime.pebbleDragState = null;
  runtime.pointerDown = false;
  runtime.lastScrubPoint = null;
}

function hasToolbarTriggeredToolMode() {
  return runtime.cleaningMode
    || runtime.scoopMode
    || runtime.fishEditMode
    || (runtime.editTankMode && runtime.toolModeSource === "toolbar");
}

function toggleFishEditMode(force = null, options = {}) {
  const nextMode = typeof force === "boolean" ? force : !runtime.fishEditMode;
  clearPrimaryToolModes();

  if (nextMode) {
    runtime.fishEditMode = true;
    runtime.toolModeSource = options.source || "toolbar";
    if (options.collapseSidebar) {
      runtime.sidebarCollapsed = true;
    }
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
const scrubMaskContext = runtime.scrubMaskCanvas.getContext("2d");
const grimeBaseContext = runtime.grimeBaseCanvas.getContext("2d");

runtime.shadowCanvas.width = TANK_WIDTH;
runtime.shadowCanvas.height = TANK_HEIGHT;
runtime.scrubMaskCanvas.width = TANK_WIDTH;
runtime.scrubMaskCanvas.height = TANK_HEIGHT;
runtime.grimeBaseCanvas.width = TANK_WIDTH;
runtime.grimeBaseCanvas.height = TANK_HEIGHT;
configureCanvasContext(tankContext);
configureCanvasContext(grimeContext);
configureCanvasContext(glassContext);
configureCanvasContext(shadowContext);
configureCanvasContext(scrubMaskContext);
configureCanvasContext(grimeBaseContext);

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
  runtime.fishSizeRange = buildFishSizeRange(runtime.fishCatalog);
  runtime.fishCostRange = buildFishCostRange(runtime.fishCatalog);
  runtime.backgroundCatalog = buildBackgroundCatalog(backgroundResponse);
  runtime.tankCatalog = buildSimpleAssetCatalog(tankResponse, TANK_META, "A tank shell PNG from your assets folder.");
  runtime.filterCatalog = buildFilterCatalog(filterResponse);
  runtime.customGravelLayerCatalog = buildCustomGravelLayerCatalog(gravelResponse);
  runtime.customGravelPebbleCatalog = buildCustomGravelPebbleCatalog(gravelResponse);
  runtime.gravelCatalog = buildSimpleAssetCatalog(gravelResponse, {}, "A gravel pebble PNG from your assets folder.")
    .filter((item) => !isCustomGravelReservedAssetKey(item.key));
  runtime.bubbleCatalog = buildSimpleAssetCatalog(bubbleResponse, BUBBLE_META, "A bubble sprite PNG from your assets folder.");
  runtime.decorCatalog = buildDecorCatalog(decorResponse);
  runtime.backgroundMap = new Map(runtime.backgroundCatalog.map((item) => [item.key, item]));
  runtime.tankMap = new Map(runtime.tankCatalog.map((item) => [item.key, item]));
  runtime.filterMap = new Map(runtime.filterCatalog.map((item) => [item.key, item]));
  runtime.gravelMap = new Map(runtime.gravelCatalog.map((item) => [item.key, item]));
  runtime.bubbleMap = new Map(runtime.bubbleCatalog.map((item) => [item.key, item]));
  runtime.decorMap = new Map(runtime.decorCatalog.map((item) => [item.key, item]));
  runtime.scene = createSceneSeeds();

  const rawState = loadState();
  const needsReconcileSave = shouldPersistReconciledState(rawState);
  state = reconcileState(rawState);
  runtime.hardwareAccelerationNoticeOpen = !hasDismissedHardwareAccelerationNotice();

  await preloadImages([
    ...runtime.backgroundCatalog.map((item) => item.path),
    ...runtime.tankCatalog.map((item) => item.path),
    ...runtime.filterCatalog.map((item) => item.path),
    ...runtime.gravelCatalog.map((item) => item.path),
    ...runtime.customGravelLayerCatalog.map((item) => item.path),
    ...runtime.customGravelPebbleCatalog.map((item) => item.path),
    ...runtime.bubbleCatalog.map((item) => item.path),
    resolveAppUrl(OPTIONAL_BUBBLE_ORB_ASSET_PATH),
    resolveAppUrl(POOP_ASSET_PATH),
    ...runtime.decorCatalog.flatMap((item) => [
      item.path,
      item.bgPath,
      item.midPath,
      item.maskPath,
      item.triggerPath,
      item.seatsPath
    ].filter(Boolean)),
    ...new Set(runtime.fishCatalog.flatMap((fish) => getFishAssetVariants(fish)))
  ]);

  resizeDisplayCanvases();
  const now = Date.now();
  const decorPlacementChanged = normalizePlacedDecorState();
  const stateChanged = syncState(now);
  if (needsReconcileSave || decorPlacementChanged || stateChanged) {
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

    if (runtime.hardwareAccelerationNoticeOpen) {
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
dom.spongeButton.addEventListener("click", () => toggleCleaningMode({ source: "toolbar", collapseSidebar: true }));
dom.scoopButton?.addEventListener("click", () => toggleScoopMode({ source: "toolbar", collapseSidebar: true }));
dom.debugDamageFishButton.addEventListener("click", () => damageSelectedFish());
dom.debugBreedButton?.addEventListener("click", () => triggerDebugBabySequence());
dom.resetFishHealthButton?.addEventListener("click", () => restoreAllFishHealthDebug());
  dom.addCoinsButton.addEventListener("click", () => addDebugCoins());
  dom.maxDirtButton.addEventListener("click", () => makeTankMaxDirty());
  dom.deleteAllButton.addEventListener("click", () => deleteAllFishAndDecor());
  dom.debugGravelPebbleButton?.addEventListener("click", () => triggerDebugGravelPebbleTest());
  dom.debugCaveButton.addEventListener("click", () => toggleDebugNightCaveMode());
  dom.hardwareAccelerationOkay?.addEventListener("click", () => dismissHardwareAccelerationNotice());
  dom.toggleFishShop.addEventListener("click", () => openStoreOverlay("fish"));
  dom.toggleDecorShop.addEventListener("click", () => openStoreOverlay("decor"));
  dom.openStoreButton.addEventListener("click", () => openStoreOverlay("fish"));
  dom.openEquipmentShopButton?.addEventListener("click", () => openStoreOverlay("equipment"));
  dom.editModeDockButton?.addEventListener("click", () => toggleEditTankMode(null, { source: "toolbar", collapseSidebar: true }));
  dom.fishEditModeDockButton?.addEventListener("click", () => toggleFishEditMode(null, { source: "toolbar", collapseSidebar: true }));
  dom.closeStoreOverlay.addEventListener("click", () => closeStoreOverlay());
  dom.storeFishTab.addEventListener("click", () => {
    runtime.storeTab = "fish";
    renderUi(Date.now());
  });
  dom.storeDecorTab.addEventListener("click", () => {
    runtime.storeTab = "decor";
    renderUi(Date.now());
  });
  dom.storeEquipmentTab?.addEventListener("click", () => {
    runtime.storeTab = "equipment";
    renderUi(Date.now());
  });
  dom.toggleEditMode.addEventListener("click", () => toggleEditTankMode(null, { source: "sidebar" }));
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

  dom.tankSidebar.addEventListener("click", () => {
    if (!hasToolbarTriggeredToolMode()) {
      return;
    }

    clearPrimaryToolModes();
    renderToolCursor();
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

  dom.equipmentShop?.addEventListener("click", (event) => {
    const buyButton = event.target.closest("[data-buy-filter]");
    if (buyButton) {
      buyFilter(buyButton.dataset.buyFilter);
      return;
    }

    const equipButton = event.target.closest("[data-equip-filter]");
    if (equipButton) {
      selectFilterAsset(equipButton.dataset.equipFilter);
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

  dom.customGravelPanel?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-toggle-custom-gravel]");
    if (button) {
      setCustomGravelEnabled(!state?.customGravelEnabled);
      return;
    }

    const swatchButton = event.target.closest("[data-custom-gravel-color]");
    if (swatchButton) {
      setCustomGravelLayerColor(
        Number(swatchButton.dataset.customGravelLayer),
        swatchButton.dataset.customGravelColor
      );
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
  const scrubMaskSizeChanged = runtime.scrubMaskCanvas.width !== displayWidth || runtime.scrubMaskCanvas.height !== displayHeight;
  if (scrubMaskSizeChanged) {
    runtime.scrubMaskCanvas.width = displayWidth;
    runtime.scrubMaskCanvas.height = displayHeight;
  }
  const grimeBaseSizeChanged = runtime.grimeBaseCanvas.width !== displayWidth || runtime.grimeBaseCanvas.height !== displayHeight;
  if (grimeBaseSizeChanged) {
    runtime.grimeBaseCanvas.width = displayWidth;
    runtime.grimeBaseCanvas.height = displayHeight;
  }

  const scaleX = displayWidth / TANK_WIDTH;
  const scaleY = displayHeight / TANK_HEIGHT;

  tankContext.setTransform(scaleX, 0, 0, scaleY, 0, 0);
  grimeContext.setTransform(scaleX, 0, 0, scaleY, 0, 0);
  glassContext.setTransform(scaleX, 0, 0, scaleY, 0, 0);
  scrubMaskContext?.setTransform(scaleX, 0, 0, scaleY, 0, 0);
  grimeBaseContext?.setTransform(scaleX, 0, 0, scaleY, 0, 0);
  configureCanvasContext(tankContext);
  configureCanvasContext(grimeContext);
  configureCanvasContext(glassContext);
  configureCanvasContext(scrubMaskContext);
  configureCanvasContext(grimeBaseContext);
  positionToast();

  if (tankSizeChanged) {
    invalidateGravelBedCache(false);
  }
  if (scrubMaskSizeChanged) {
    rebuildScrubMaskCanvas();
  }
  if (grimeBaseSizeChanged) {
    runtime.grimeBaseCacheKey = "";
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
      caveBehavior: normalizeCaveBehaviorMeta(entry.caveBehavior),
      bubbler: normalizeBubblerMeta(
        entry?.bubbler && typeof entry.bubbler === "object"
          ? entry.bubbler
          : (hasBubblerMetaFields(entry) ? entry : null),
        key
      )
    };
  }

  return map;
}

function hasBubblerMetaFields(entry) {
  if (!entry || typeof entry !== "object") {
    return false;
  }

  return Number.isFinite(Number(entry.spoutQty))
    || Number.isFinite(Number(entry.spoutCount))
    || Array.isArray(entry.spouts)
    || hasBubblerSpoutMetaFields(entry);
}

function hasBubblerSpoutMetaFields(entry) {
  if (!entry || typeof entry !== "object") {
    return false;
  }

  return [
    entry.horizontalLocation,
    entry.spoutHorizontalLocation,
    entry.horizontal,
    entry.x,
    entry.xNorm,
    entry.offsetPx,
    entry.horizontalOffsetPx,
    entry.spoutOffsetPx,
    entry.intensity,
    entry.bubblerIntensity,
    entry.spread,
    entry.bubblerSpread,
    entry.fadeDistance,
    entry.bubblerFadeDistance,
    entry.bubbleColor,
    entry.bubbleColors,
    entry.color,
    entry.colors,
    entry.bubbleOpacity,
    entry.opacity,
    entry.alpha,
    entry.speed,
    entry.bubbleSpeed,
    entry.bubblerSpeed
  ].some((value) => value !== undefined && value !== null && String(value).trim() !== "");
}

function isBubblerDecorFileKey(decorKey = "") {
  return /_bubbler\.[^.]+$/i.test(String(decorKey || "").trim());
}

function normalizeBubblerHorizontalPosition(value) {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) {
      return { horizontalLocation: null, horizontalOffsetPx: null };
    }

    if (trimmed.endsWith("%")) {
      const percent = Number.parseFloat(trimmed.slice(0, -1));
      if (Number.isFinite(percent)) {
        return {
          horizontalLocation: clamp(percent / 100, 0, 1),
          horizontalOffsetPx: null
        };
      }
    }
  }

  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return { horizontalLocation: null, horizontalOffsetPx: null };
  }

  if (numeric >= 0 && numeric <= 1) {
    return {
      horizontalLocation: clamp(numeric, 0, 1),
      horizontalOffsetPx: null
    };
  }

  return {
    horizontalLocation: null,
    horizontalOffsetPx: Math.max(0, numeric)
  };
}

function getBubblerCadenceFromIntensity(intensity = DEFAULT_BUBBLER_INTENSITY) {
  const resolvedIntensity = clamp(Number(intensity) || DEFAULT_BUBBLER_INTENSITY, 0.15, MAX_BUBBLER_INTENSITY);
  const intensityRatio = clamp(
    (resolvedIntensity - 0.15) / Math.max(0.0001, MAX_BUBBLER_INTENSITY - 0.15),
    0,
    1
  );
  const speedRatio = Math.pow(intensityRatio, 0.74);
  return clamp(
    MAX_BUBBLER_STREAM_CADENCE_MS
      + (MIN_BUBBLER_STREAM_CADENCE_MS - MAX_BUBBLER_STREAM_CADENCE_MS) * speedRatio,
    MIN_BUBBLER_STREAM_CADENCE_MS,
    MAX_BUBBLER_STREAM_CADENCE_MS
  );
}

function buildDefaultBubblerSpoutMeta(index = 0, spoutQty = DEFAULT_BUBBLER_SPOUT_QTY) {
  const resolvedSpoutQty = Math.max(1, Math.floor(Number(spoutQty) || DEFAULT_BUBBLER_SPOUT_QTY));
  return {
    horizontalLocation: resolvedSpoutQty === 1
      ? 0.5
      : clamp((index + 1) / (resolvedSpoutQty + 1), 0.05, 0.95),
    horizontalOffsetPx: null,
    intensity: DEFAULT_BUBBLER_INTENSITY,
    spread: DEFAULT_BUBBLER_SPREAD_PX,
    fadeDistance: DEFAULT_BUBBLER_FADE_DISTANCE_PX,
    bubbleColor: DEFAULT_BUBBLER_BUBBLE_COLOR,
    bubbleColors: [DEFAULT_BUBBLER_BUBBLE_COLOR],
    bubbleOpacity: DEFAULT_BUBBLER_BUBBLE_OPACITY,
    speed: DEFAULT_BUBBLER_SPEED
  };
}

function normalizeBubblerSpoutMeta(entry, index = 0, spoutQty = DEFAULT_BUBBLER_SPOUT_QTY) {
  if (!entry || typeof entry !== "object") {
    return buildDefaultBubblerSpoutMeta(index, spoutQty);
  }

  const defaultSpout = buildDefaultBubblerSpoutMeta(index, spoutQty);
  const horizontalInput = entry.horizontalLocation
    ?? entry.spoutHorizontalLocation
    ?? entry.horizontal
    ?? entry.xNorm
    ?? entry.horizontalOffsetPx
    ?? entry.spoutOffsetPx
    ?? entry.offsetPx
    ?? entry.x;
  const horizontalPosition = normalizeBubblerHorizontalPosition(horizontalInput);
  const bubbleColors = normalizeHexColorList(
    entry.bubbleColors
    ?? entry.colors
    ?? entry.bubbleColor
    ?? entry.color
  );
  const resolvedBubbleColors = bubbleColors.length ? bubbleColors : defaultSpout.bubbleColors;
  const resolvedIntensity = clamp(
    Number.isFinite(Number(entry.intensity))
      ? Number(entry.intensity)
      : Number.isFinite(Number(entry.bubblerIntensity))
        ? Number(entry.bubblerIntensity)
        : defaultSpout.intensity,
    0.15,
    MAX_BUBBLER_INTENSITY
  );

  return {
    horizontalLocation: horizontalPosition.horizontalLocation ?? defaultSpout.horizontalLocation,
    horizontalOffsetPx: Number.isFinite(horizontalPosition.horizontalOffsetPx)
      ? horizontalPosition.horizontalOffsetPx
      : defaultSpout.horizontalOffsetPx,
    intensity: resolvedIntensity,
    spread: clamp(
      Number.isFinite(Number(entry.spread))
        ? Number(entry.spread)
        : Number.isFinite(Number(entry.bubblerSpread))
          ? Number(entry.bubblerSpread)
          : defaultSpout.spread,
      0,
      320
    ),
    fadeDistance: clamp(
      Number.isFinite(Number(entry.fadeDistance))
        ? Number(entry.fadeDistance)
        : Number.isFinite(Number(entry.bubblerFadeDistance))
          ? Number(entry.bubblerFadeDistance)
          : defaultSpout.fadeDistance,
      24,
      TANK_HEIGHT
    ),
    bubbleColor: resolvedBubbleColors[0] || defaultSpout.bubbleColor,
    bubbleColors: resolvedBubbleColors,
    bubbleOpacity: clamp(
      Number.isFinite(Number(entry.bubbleOpacity))
        ? Number(entry.bubbleOpacity)
        : Number.isFinite(Number(entry.opacity))
          ? Number(entry.opacity)
          : Number.isFinite(Number(entry.alpha))
            ? Number(entry.alpha)
            : defaultSpout.bubbleOpacity,
      0.1,
      3
    ),
    speed: clamp(
      Number.isFinite(Number(entry.speed))
        ? Number(entry.speed)
        : Number.isFinite(Number(entry.bubbleSpeed))
          ? Number(entry.bubbleSpeed)
          : Number.isFinite(Number(entry.bubblerSpeed))
            ? Number(entry.bubblerSpeed)
            : defaultSpout.speed,
      MIN_BUBBLER_SPEED,
      MAX_BUBBLER_SPEED
    )
  };
}

function normalizeBubblerMeta(entry, decorKey = "") {
  const isSuffixBubbler = isBubblerDecorFileKey(decorKey);
  const candidate = entry && typeof entry === "object" ? entry : null;
  if (!candidate && !isSuffixBubbler) {
    return null;
  }

  const declaredSpoutQty = Number.isFinite(Number(candidate?.spoutQty))
    ? Math.max(0, Math.floor(Number(candidate.spoutQty)))
    : Number.isFinite(Number(candidate?.spoutCount))
      ? Math.max(0, Math.floor(Number(candidate.spoutCount)))
      : 0;
  const sourceSpouts = Array.isArray(candidate?.spouts)
    ? candidate.spouts
    : hasBubblerSpoutMetaFields(candidate)
      ? [candidate]
      : [];
  const spoutQty = Math.max(
    declaredSpoutQty,
    sourceSpouts.length,
    isSuffixBubbler ? DEFAULT_BUBBLER_SPOUT_QTY : 0
  );
  if (!spoutQty) {
    return null;
  }

  const spouts = Array.from({ length: spoutQty }, (_, index) =>
    normalizeBubblerSpoutMeta(sourceSpouts[index], index, spoutQty)
  );

  return {
    spoutQty,
    spouts
  };
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
  return items
    .map((item) => {
      const meta = BACKGROUND_META[item.key] || {};
      return {
        key: item.key,
        path: item.path,
        name: meta.name || titleFromFile(item.key),
        blurb: meta.blurb || "A custom aquarium backdrop from your assets folder."
      };
    })
    .sort((left, right) => {
      if (left.key === NONE_BACKGROUND_ASSET_KEY) {
        return -1;
      }
      if (right.key === NONE_BACKGROUND_ASSET_KEY) {
        return 1;
      }
      return 0;
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

function matchesCustomGravelAssetKey(specs = [], key = "") {
  const normalizedKey = String(key || "").trim().toLowerCase();
  return specs.some((spec) => (spec.manifestKeys || [spec.fileName]).some((fileName) => fileName.toLowerCase() === normalizedKey));
}

function isCustomGravelLayerAssetKey(key = "") {
  return matchesCustomGravelAssetKey(CUSTOM_GRAVEL_LAYER_SPECS, key);
}

function isCustomGravelPebbleAssetKey(key = "") {
  return matchesCustomGravelAssetKey(CUSTOM_GRAVEL_TOP_PEBBLE_SPECS, key);
}

function isCustomGravelReservedAssetKey(key = "") {
  return isCustomGravelLayerAssetKey(key) || isCustomGravelPebbleAssetKey(key);
}

function buildCustomGravelAssetCatalog(specs = [], items = []) {
  const itemMap = new Map(
    (Array.isArray(items) ? items : [])
      .filter((item) => item?.key)
      .map((item) => [String(item.key).toLowerCase(), item])
  );

  return specs.map((asset, index) => {
    const manifestItem = (asset.manifestKeys || [asset.fileName])
      .map((fileName) => itemMap.get(fileName.toLowerCase()))
      .find(Boolean);
    const path = manifestItem?.path || resolveAppUrl(`assets/gravel/${encodeURIComponent(asset.fileName)}`);

    return {
      ...asset,
      assetIndex: index,
      key: manifestItem?.key || asset.fileName,
      path
    };
  });
}

function buildCustomGravelLayerCatalog(items = []) {
  return buildCustomGravelAssetCatalog(CUSTOM_GRAVEL_LAYER_SPECS, items).map((layer, index) => ({
    ...layer,
    layerIndex: index
  }));
}

function buildCustomGravelPebbleCatalog(items = []) {
  return buildCustomGravelAssetCatalog(CUSTOM_GRAVEL_TOP_PEBBLE_SPECS, items).map((pebble, index) => ({
    ...pebble,
    pebbleIndex: index
  }));
}

function buildFilterCatalog(items) {
  const itemMap = new Map((Array.isArray(items) ? items : []).map((item) => [item.key, item]));
  return Object.entries(FILTER_META)
    .sort((left, right) => (left[1].tier || 0) - (right[1].tier || 0))
    .map(([key, details]) => ({
      ...details,
      key,
      path: itemMap.get(key)?.path || resolveAppUrl(`assets/filter/${encodeURIComponent(key)}`),
      name: details.name || titleFromFile(key),
      blurb: details.blurb || "A filter upgrade."
    }));
}

function buildFishSizeRange(entries = runtime.fishCatalog) {
  const sizes = (Array.isArray(entries) ? entries : [])
    .map((entry) => clamp(Number(entry?.width) || 128, 84, 240))
    .filter(Number.isFinite);
  if (!sizes.length) {
    return { min: 84, max: 240 };
  }

  return {
    min: Math.min(...sizes),
    max: Math.max(...sizes)
  };
}

function buildFishCostRange(entries = runtime.fishCatalog) {
  const costs = (Array.isArray(entries) ? entries : [])
    .map((entry) => Math.max(1, Math.floor(Number(entry?.cost) || 1)))
    .filter(Number.isFinite);
  if (!costs.length) {
    return { min: 1, max: 1 };
  }

  return {
    min: Math.min(...costs),
    max: Math.max(...costs)
  };
}

function resolveSpeciesMealCoins(species) {
  if (!species || isDetritusFish(species)) {
    return 0;
  }

  const explicitOverride = Number(species.mealCoinOverride ?? species.coinsPerMealOverride);
  if (Number.isFinite(explicitOverride)) {
    return clamp(Math.max(0, Math.round(explicitOverride)), 0, MAX_FISH_MEAL_COINS);
  }

  const cost = Math.max(1, Math.floor(Number(species.cost) || 1));
  return clamp(Math.ceil(cost / FISH_MEAL_COIN_COST_DIVISOR), 1, MAX_FISH_MEAL_COINS);
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
        caveBehavior: meta.caveBehavior || null,
        bubbler: meta.bubbler || normalizeBubblerMeta(null, group.base.key)
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

function resolveFishCatalogAsset(assetFile, assetFolder, folderAssets, fallbackAsset) {
  if (typeof assetFile !== "string" || !assetFile.trim()) {
    return fallbackAsset || null;
  }

  const normalizedAssetFile = assetFile.trim();
  const normalizedAssetKey = normalizedAssetFile
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[\s_-]+/g, "");
  const matchedFolderAsset = assetFolder === "fish"
    ? null
    : (
      folderAssets.find((item) => item.key.toLowerCase() === normalizedAssetFile.toLowerCase()) ||
      folderAssets.find((item) => (
        item.key
          .toLowerCase()
          .replace(/\.[^.]+$/, "")
          .replace(/[\s_-]+/g, "") === normalizedAssetKey
      ))
    );
  return /[\\/]/.test(normalizedAssetFile) || /^[a-z]+:/i.test(normalizedAssetFile)
    ? resolveAppUrl(normalizedAssetFile)
    : assetFolder === "fish"
      ? resolveAppUrl(`assets/fish/${encodeURIComponent(normalizedAssetFile)}`)
      : matchedFolderAsset?.path || fallbackAsset || resolveAppUrl(`assets/fish/${encodeURIComponent(normalizedAssetFile)}`);
}

function normalizeFishDefinition(entry, index, options = {}) {
  if (!entry || typeof entry !== "object") {
    return null;
  }

  const id = typeof entry.id === "string" && entry.id.trim() ? entry.id.trim() : `fish-${index + 1}`;
  const swimStyleSource = typeof entry.swimStyle === "string" ? entry.swimStyle : entry.style;
  const swimStyle = typeof swimStyleSource === "string" ? swimStyleSource.trim().toLowerCase() : "steady";
  const defaults = SWIM_STYLE_DEFAULTS[swimStyle] || SWIM_STYLE_DEFAULTS.steady;
  const rawAssetVariantFiles = Array.isArray(entry.assetVariants)
    ? entry.assetVariants
    : Array.isArray(entry.assets)
      ? entry.assets
      : [];
  const rawAssetFile = [entry.asset, entry.image, entry.file, ...rawAssetVariantFiles].find((value) => typeof value === "string" && value.trim());
  const assetFile = rawAssetFile ? rawAssetFile.trim() : `${id}.png`;
  const assetFolder = typeof entry.assetFolder === "string" && entry.assetFolder.trim()
    ? entry.assetFolder.trim().replace(/^\/+|\/+$/g, "")
    : "fish";
  const behavior = typeof entry.behavior === "string" && entry.behavior.trim() ? entry.behavior.trim().toLowerCase() : "free";
  const diet = typeof entry.diet === "string" && entry.diet.trim() ? entry.diet.trim().toLowerCase() : "pellet";
  const explicitHeartCount = Number(entry.heartCount ?? entry.hearts);
  const explicitMealCoinOverride = Number(entry.mealCoinOverride ?? entry.coinsPerMealOverride);
  const folderAssets = Array.isArray(options.assetFolders?.[assetFolder]) ? options.assetFolders[assetFolder] : [];
  const explicitCleanupStrength = Number(entry.cleanupStrength);
  const explicitPoopCleanupChance = Number(entry.poopCleanupChance);
  const fallbackAssetSource = typeof entry.fallbackAsset === "string" && entry.fallbackAsset.trim()
    ? entry.fallbackAsset.trim()
    : null;
  const fallbackAsset = fallbackAssetSource
    ? (/[\\/]/.test(fallbackAssetSource) || /^[a-z]+:/i.test(fallbackAssetSource)
      ? resolveAppUrl(fallbackAssetSource)
      : resolveAppUrl(`assets/fish/${encodeURIComponent(fallbackAssetSource)}`))
    : null;
  const resolvedAsset = resolveFishCatalogAsset(assetFile, assetFolder, folderAssets, fallbackAsset);
  const resolvedAssetVariants = [resolvedAsset, ...rawAssetVariantFiles
    .map((value) => resolveFishCatalogAsset(value, assetFolder, folderAssets, fallbackAsset))
    .filter(Boolean)]
    .filter((value, assetIndex, list) => list.indexOf(value) === assetIndex);

  const speedMinFloor = behavior === "sucker" ? 0.00005 : 0.012;
  const speedMaxCeiling = behavior === "sucker" ? 0.006 : 0.095;

  const normalized = {
    id,
    name: typeof entry.name === "string" && entry.name.trim() ? entry.name.trim() : titleFromFile(id),
    cost: Math.max(1, Math.floor(Number(entry.cost ?? entry.price) || 1)),
    mealCoins: 0,
    mealCoinOverride: Number.isFinite(explicitMealCoinOverride) ? Math.max(0, Math.round(explicitMealCoinOverride)) : null,
    asset: resolvedAsset,
    assetVariants: resolvedAssetVariants,
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
    cleanupStrength: clamp(Number.isFinite(explicitCleanupStrength) ? explicitCleanupStrength : 0.12, 0.005, 0.45),
    poopCleanupChance: Number.isFinite(explicitPoopCleanupChance)
      ? clamp(explicitPoopCleanupChance, 0, 1)
      : (diet === "detritus" ? 1 : 0),
    shadowScale: clamp(Number(entry.shadowScale) || 0.28, 0.14, 0.5),
    defaultScale: clamp(Number(entry.defaultScale) || DEFAULT_FISH_SCALE, FISH_SCALE_MIN, FISH_SCALE_MAX),
    heartCount: Number.isFinite(explicitHeartCount)
      ? clamp(Math.round(explicitHeartCount), MIN_FISH_HEARTS, MAX_FISH_HEARTS)
      : null,
    caveEnabled: entry.caveEnabled !== false,
    defaultNames: Array.isArray(entry.defaultNames) && entry.defaultNames.length
      ? entry.defaultNames.map((name) => String(name).trim()).filter(Boolean)
      : (FISH_NAME_POOL[id] || [])
  };

  normalized.mealCoins = resolveSpeciesMealCoins(normalized);
  return normalized;
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

function getFishAssetVariants(species) {
  if (!species) {
    return [];
  }

  const variants = Array.isArray(species.assetVariants)
    ? species.assetVariants.filter((value) => typeof value === "string" && value.trim())
    : [];
  return variants.length
    ? variants
    : (typeof species.asset === "string" && species.asset ? [species.asset] : []);
}

function getSpeciesForFish(fish) {
  return fish ? runtime.fishMap.get(fish.speciesId) || null : null;
}

function getFishAppearanceVariantSeed(fish, species = getSpeciesForFish(fish)) {
  const key = `${fish?.id || ""}|${fish?.name || ""}|${species?.id || ""}`;
  return hashStringToUint32(key);
}

function hashStringToUint32(key = "") {
  let hash = 0;
  for (const character of String(key || "")) {
    hash = ((hash * 33) + character.charCodeAt(0)) >>> 0;
  }
  return hash >>> 0;
}

function normalizeFishAppearanceVariantIndex(value, species, fallbackFish = null) {
  const variants = getFishAssetVariants(species);
  if (variants.length <= 1) {
    return 0;
  }

  const fallbackIndex = fallbackFish
    ? getFishAppearanceVariantSeed(fallbackFish, species) % variants.length
    : 0;
  const rawIndex = Number.isFinite(Number(value))
    ? Math.floor(Number(value))
    : fallbackIndex;
  return ((rawIndex % variants.length) + variants.length) % variants.length;
}

function getFishAssetPath(fish, species = getSpeciesForFish(fish)) {
  const variants = getFishAssetVariants(species);
  if (!variants.length) {
    return species?.asset || null;
  }

  return variants[normalizeFishAppearanceVariantIndex(fish?.appearanceVariant, species, fish)] || variants[0];
}

function getFishAdultScale(fish, species = getSpeciesForFish(fish)) {
  if (!fish) {
    return DEFAULT_FISH_SCALE;
  }

  const speciesId = fish.speciesId || species?.id;
  const baseScale = Number.isFinite(Number(fish.scale))
    ? Number(fish.scale)
    : getFishScaleDefault(speciesId);
  return clamp(baseScale, FISH_SCALE_MIN, FISH_SCALE_MAX);
}

function getFishGrowthProgress(fish, now = Date.now()) {
  if (
    !fish
    || !Number.isFinite(Number(fish.growthStartedAt))
    || !Number.isFinite(Number(fish.growthEndsAt))
    || Number(fish.growthEndsAt) <= Number(fish.growthStartedAt)
  ) {
    return 1;
  }

  return clamp(
    (now - Number(fish.growthStartedAt)) / Math.max(1, Number(fish.growthEndsAt) - Number(fish.growthStartedAt)),
    0,
    1
  );
}

function getFishGrowthScaleMultiplier(fish, now = Date.now()) {
  const progress = getFishGrowthProgress(fish, now);
  return BABY_FISH_SCALE_MULTIPLIER + (1 - BABY_FISH_SCALE_MULTIPLIER) * progress;
}

function getFishEffectiveScale(fish, species = getSpeciesForFish(fish), now = Date.now()) {
  return getFishAdultScale(fish, species) * getFishGrowthScaleMultiplier(fish, now);
}

function isFishJuvenile(fish, now = Date.now()) {
  return getFishGrowthProgress(fish, now) < 1;
}

function isFishAdult(fish, now = Date.now()) {
  return !isFishJuvenile(fish, now);
}

function hasFishBeenInTankLongEnoughToBreed(fish, now = Date.now()) {
  return Number.isFinite(Number(fish?.tankAddedAt))
    && now - Number(fish.tankAddedAt) >= BREEDING_MIN_TANK_TIME_MS;
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

function normalizeHexColorList(value) {
  const rawValues = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(",")
      : [];
  const normalized = rawValues
    .map((entry) => normalizeHexColor(entry))
    .filter(Boolean);
  return [...new Set(normalized)];
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

function getDefaultCustomGravelLayerColors() {
  return [...DEFAULT_CUSTOM_GRAVEL_LAYER_COLORS];
}

function getCatalogDefaultKey(catalog, preferredKey) {
  return catalog.find((item) => item.key === preferredKey)?.key || catalog[0]?.key || null;
}

function getDefaultFilterKey() {
  return getCatalogDefaultKey(runtime.filterCatalog, DEFAULT_FILTER_ASSET_KEY);
}

function sanitizeOwnedFilterAssets(ownedFilterAssets, fallbackSelectedKey = null) {
  const source = Array.isArray(ownedFilterAssets)
    ? ownedFilterAssets
    : Array.isArray(ownedFilterAssets?.filters)
      ? ownedFilterAssets.filters
      : [];
  const keys = new Set([getDefaultFilterKey()]);

  for (const key of source) {
    if (runtime.filterMap.has(key)) {
      keys.add(key);
    }
  }

  if (runtime.filterMap.has(fallbackSelectedKey)) {
    keys.add(fallbackSelectedKey);
  }

  return [...keys]
    .filter(Boolean)
    .sort((left, right) => (runtime.filterMap.get(left)?.tier || 0) - (runtime.filterMap.get(right)?.tier || 0));
}

function isFilterOwned(filterKey) {
  return Boolean(filterKey && state?.ownedFilterAssets?.includes(filterKey));
}

function getOwnedFilterCatalog() {
  const owned = new Set(state?.ownedFilterAssets || []);
  return runtime.filterCatalog.filter((item) => owned.has(item.key));
}

function sanitizeGravelPalette(palette) {
  const fallback = getDefaultGravelPalette();
  const candidate = Array.isArray(palette) ? palette.slice(0, 3).map((value) => normalizeHexColor(value)) : [];
  return Array.from({ length: 3 }, (_, index) => candidate[index] || fallback[index]);
}

function getActiveGravelPalette() {
  return sanitizeGravelPalette(state?.gravelPalette);
}

function sanitizeCustomGravelLayerColors(colors) {
  const fallback = getDefaultCustomGravelLayerColors();
  const candidate = Array.isArray(colors)
    ? colors.slice(0, CUSTOM_GRAVEL_LAYER_COUNT).map((value) => normalizeHexColor(value))
    : [];
  return Array.from({ length: CUSTOM_GRAVEL_LAYER_COUNT }, (_, index) => candidate[index] || fallback[index]);
}

function getActiveCustomGravelLayerColors() {
  return sanitizeCustomGravelLayerColors(state?.customGravelLayerColors);
}

function getCustomGravelColorChoices() {
  return CUSTOM_GRAVEL_COLOR_OPTIONS.map((choice) => ({
    ...choice,
    color: normalizeHexColor(choice.color) || DEFAULT_CUSTOM_GRAVEL_LAYER_COLOR
  }));
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

function setTextIfChanged(element, text) {
  if (!element) {
    return;
  }

  const nextText = String(text ?? "");
  if (element.textContent !== nextText) {
    element.textContent = nextText;
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

function shouldPersistReconciledState(rawState) {
  const incoming = rawState && typeof rawState === "object" ? rawState : {};
  const incomingVersion = Number.isFinite(incoming.version) ? incoming.version : 0;
  const incomingHealthModelVersion = Number.isFinite(incoming.healthModelVersion) ? incoming.healthModelVersion : 1;
  return incomingVersion !== STATE_VERSION || incomingHealthModelVersion < HEALTH_MODEL_VERSION;
}

function reconcileState(rawState) {
  const now = Date.now();
  const base = {
    version: STATE_VERSION,
    healthModelVersion: HEALTH_MODEL_VERSION,
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
    customGravelEnabled: false,
    customGravelLayerColors: getDefaultCustomGravelLayerColors(),
    gravelPalette: getDefaultGravelPalette(),
    gravelSeed: Math.floor(Math.random() * 0x7fffffff),
    gravelLivePebbles: [],
    floatingPellets: [],
    ownedFilterAssets: sanitizeOwnedFilterAssets([getDefaultFilterKey()]),
    selectedBackground: getCatalogDefaultKey(runtime.backgroundCatalog, DEFAULT_BACKGROUND_ASSET_KEY),
    selectedTankAsset: runtime.tankCatalog.find((item) => item.key === "midnight-curve.png")?.key || runtime.tankCatalog[0]?.key || null,
    selectedFilterAsset: getDefaultFilterKey(),
    selectedGravelAsset: getCatalogDefaultKey(runtime.gravelCatalog, DEFAULT_GRAVEL_ASSET_KEY),
    selectedBubbleAsset: runtime.bubbleCatalog[0]?.key || null,
    theme: DEFAULT_THEME,
    lastCleanedAt: now,
    lastSimulatedAt: now,
    events: []
  };

  const incoming = rawState && typeof rawState === "object" ? rawState : {};
  const incomingVersion = Number.isFinite(incoming.version) ? incoming.version : 0;
  const incomingHealthModelVersion = Number.isFinite(incoming.healthModelVersion) ? incoming.healthModelVersion : 1;
  const legacyHealthModel = incomingHealthModelVersion < LEGACY_HEALTH_SCALE_MODEL_VERSION;
  const sanitizeFishEntry = (fish) => sanitizeFish(fish, { legacyHealthModel });

  const nextState = {
    ...base,
    coins: Number.isFinite(incoming.coins) ? Math.max(0, Math.floor(incoming.coins)) : base.coins,
    lifetimeDeaths: Number.isFinite(incoming.lifetimeDeaths) ? Math.max(0, Math.floor(incoming.lifetimeDeaths)) : base.lifetimeDeaths,
    lastCorpseSicknessAt: Number.isFinite(incoming.lastCorpseSicknessAt) ? incoming.lastCorpseSicknessAt : null,
    fish: Array.isArray(incoming.fish) ? incoming.fish.map(sanitizeFishEntry).filter(Boolean) : [],
    storedFish: Array.isArray(incoming.storedFish) ? incoming.storedFish.map(sanitizeFishEntry).filter(Boolean) : [],
    feedHistory: sanitizeHistory(incoming.feedHistory),
    pendingPoops: Array.isArray(incoming.pendingPoops) ? incoming.pendingPoops.map(sanitizePoop).filter(Boolean) : [],
    poops: Array.isArray(incoming.poops) ? incoming.poops.map(sanitizePoop).filter(Boolean) : [],
    decorInventory: sanitizeInventory(incoming.decorInventory),
    decorScaleDefaults: sanitizeDecorScaleDefaults(incoming.decorScaleDefaults),
    fishScaleDefaults: sanitizeFishScaleDefaults(incoming.fishScaleDefaults),
    placedDecor: Array.isArray(incoming.placedDecor) ? incoming.placedDecor.map(sanitizePlacedDecor).filter(Boolean) : [],
    customGravelEnabled: Boolean(incoming.customGravelEnabled),
    customGravelLayerColors: sanitizeCustomGravelLayerColors(incoming.customGravelLayerColors),
    gravelPalette: sanitizeGravelPalette(incoming.gravelPalette),
    gravelSeed: Number.isFinite(incoming.gravelSeed) ? Math.abs(Math.floor(incoming.gravelSeed)) : base.gravelSeed,
    gravelLivePebbles: [],
    floatingPellets: Array.isArray(incoming.floatingPellets)
      ? incoming.floatingPellets.map(sanitizePellet).filter(Boolean)
      : [],
    ownedFilterAssets: sanitizeOwnedFilterAssets(incoming.ownedFilterAssets, incoming.selectedFilterAsset),
    selectedBackground: runtime.backgroundMap.has(incoming.selectedBackground)
      ? incoming.selectedBackground
      : base.selectedBackground,
    selectedTankAsset: runtime.tankMap.has(incoming.selectedTankAsset)
      ? incoming.selectedTankAsset
      : base.selectedTankAsset,
    selectedFilterAsset: runtime.filterMap.has(incoming.selectedFilterAsset)
      && sanitizeOwnedFilterAssets(incoming.ownedFilterAssets, incoming.selectedFilterAsset).includes(incoming.selectedFilterAsset)
      ? incoming.selectedFilterAsset
      : base.selectedFilterAsset,
    selectedGravelAsset: runtime.gravelMap.has(incoming.selectedGravelAsset)
      ? incoming.selectedGravelAsset
      : base.selectedGravelAsset,
    selectedBubbleAsset: runtime.bubbleMap.has(incoming.selectedBubbleAsset)
      ? incoming.selectedBubbleAsset
      : base.selectedBubbleAsset,
    healthModelVersion: HEALTH_MODEL_VERSION,
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
  if (!nextState.ownedFilterAssets.length) {
    nextState.ownedFilterAssets = sanitizeOwnedFilterAssets([getDefaultFilterKey()]);
  }
  if (!nextState.selectedFilterAsset || !nextState.ownedFilterAssets.includes(nextState.selectedFilterAsset)) {
    nextState.selectedFilterAsset = nextState.ownedFilterAssets[0] || getDefaultFilterKey();
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
    || nextState.poops.length
    || nextState.ownedFilterAssets.length > 1
    || nextState.selectedFilterAsset !== getDefaultFilterKey();
  if (!hasStartedPlaying && nextState.coins < STARTING_COINS) {
    nextState.coins = STARTING_COINS;
  }

  if (incomingVersion < 9) {
    nextState.placedDecor = nextState.placedDecor.map((item) => ({
      ...item,
      scale: clamp(item.scale * 1.5, DECOR_SCALE_MIN, DECOR_SCALE_MAX)
    }));
    if (!Number.isFinite(incoming.lifetimeDeaths)) {
      nextState.lifetimeDeaths = nextState.fish.filter((fish) => isFishDead(fish)).length
        + nextState.storedFish.filter((fish) => isFishDead(fish)).length;
    }
  }

  if (incomingVersion >= 10 && incomingHealthModelVersion < LEGACY_HEALTH_SCALE_MODEL_VERSION) {
    nextState.placedDecor = nextState.placedDecor.map((item) => ({
      ...item,
      scale: clamp(item.scale / 1.5, DECOR_SCALE_MIN, DECOR_SCALE_MAX)
    }));
    nextState.decorScaleDefaults = Object.fromEntries(
      Object.entries(nextState.decorScaleDefaults).map(([key, value]) => [
        key,
        clamp(Number(value) / 1.5, DECOR_SCALE_MIN, DECOR_SCALE_MAX)
      ])
    );
  }

  if (incomingHealthModelVersion < HEALTH_MODEL_VERSION) {
    nextState.fish = nextState.fish.map((fish) => rebalanceFishHealthForCurrentModel(fish));
    nextState.storedFish = nextState.storedFish.map((fish) => rebalanceFishHealthForCurrentModel(fish));
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
  runtime.toolModeSource = null;
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
  runtime.fishGravelPebbleActions.clear();
  runtime.fishPebbleTosses = [];
  runtime.bloodClouds = [];
  runtime.activeFishCavePlans.clear();
  runtime.bettaPassLocks.clear();
  runtime.debugBreedingSequence = null;
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

function sanitizeFish(fish, options = {}) {
  if (!fish || !runtime.fishMap.has(fish.speciesId)) {
    return null;
  }

  const species = runtime.fishMap.get(fish.speciesId);
  const legacyHealthModel = Boolean(options.legacyHealthModel);
  const maxHealthUnits = getFishMaxHealthUnits(fish, species);
  const rawHealthUnits = Number.isFinite(Number(fish.healthUnits))
    ? Math.round(Number(fish.healthUnits))
    : null;
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
      ? (species.behavior === "shrimp" ? Math.min(TANK_DEPTH_LAYERS - 1, Number(fish.tankLayer)) : Number(fish.tankLayer))
      : (species.behavior === "shrimp" ? TANK_DEPTH_LAYERS - 1 : (fish.drawLayer === "back" ? 4 : DEFAULT_TANK_LAYER)));
  const desiredTankLayer = species.behavior === "sucker"
    ? TANK_DEPTH_LAYERS
    : clampTankLayer(Number.isFinite(Number(fish.desiredTankLayer))
      ? (species.behavior === "shrimp" ? Math.min(TANK_DEPTH_LAYERS - 1, Number(fish.desiredTankLayer)) : Number(fish.desiredTankLayer))
      : (species.behavior === "shrimp" ? baseTankLayer : (fish.desiredDrawLayer === "back" ? Math.max(baseTankLayer, 4) : baseTankLayer)));
  return {
    id: String(fish.id || createId("fish")),
    speciesId: fish.speciesId,
    name: typeof fish.name === "string" && fish.name.trim() ? fish.name : buildFishName(fish.speciesId, []),
    acquiredAt: Number.isFinite(fish.acquiredAt) ? fish.acquiredAt : Date.now(),
    tankAddedAt: Number.isFinite(fish.tankAddedAt) ? fish.tankAddedAt : (Number.isFinite(fish.acquiredAt) ? fish.acquiredAt : Date.now()),
    deadAt: Number.isFinite(fish.deadAt) ? fish.deadAt : null,
    breedCooldownUntil: Number.isFinite(fish.breedCooldownUntil) ? fish.breedCooldownUntil : 0,
    healthUnits: rawHealthUnits === null
      ? maxHealthUnits
      : legacyHealthModel
        ? scaleLegacyFishHealthUnits(rawHealthUnits, maxHealthUnits)
        : clamp(rawHealthUnits, 0, maxHealthUnits),
    fedStreak: clamp(Math.round(Number(fish.fedStreak) || 0), 0, 999),
    missedMealsInRow: clamp(Math.round(Number(fish.missedMealsInRow) || 0), 0, 999),
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
    appearanceVariant: normalizeFishAppearanceVariantIndex(fish.appearanceVariant, species, fish),
    scale: clamp(Number(fish.scale) || resolveFishBaseScale(fish.speciesId), FISH_SCALE_MIN, FISH_SCALE_MAX),
    growthStartedAt: Number.isFinite(fish.growthStartedAt) ? fish.growthStartedAt : null,
    growthEndsAt: Number.isFinite(fish.growthEndsAt) ? fish.growthEndsAt : null,
    activity: fish.activity === "feeding" && !isDetritusFish(species) ? "feeding" : "roam",
    feedingPelletId: typeof fish.feedingPelletId === "string" ? fish.feedingPelletId : null,
    comfortDamageProgressMs: Math.max(0, Number(fish.comfortDamageProgressMs) || 0),
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

  const xNorm = clamp(Number(poop.xNorm) || 0.5, 0.06, 0.94);

  return {
    id: String(poop.id || createId("poop")),
    fishId: String(poop.fishId || ""),
    dueAt: Number.isFinite(poop.dueAt) ? poop.dueAt : undefined,
    createdAt: Number.isFinite(poop.createdAt) ? poop.createdAt : undefined,
    xNorm,
    yNorm: clamp(
      Number.isFinite(Number(poop.yNorm))
        ? Number(poop.yNorm)
        : getPoopFloorYNormAtXNorm(xNorm),
      0.76,
      0.96
    ),
    startYNorm: clamp(Number(poop.startYNorm) || 0.54, 0.18, 0.82),
    asset: resolveAppUrl(typeof poop.asset === "string" && poop.asset.trim() ? poop.asset : POOP_ASSET_PATH)
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
  if (fish?.caveState) {
    if (["approach", "align", "leave"].includes(fish.caveState)) {
      return clampTankLayer(fish.caveFrontLayer || fish.tankLayer || DEFAULT_TANK_LAYER);
    }

    return getFishActiveCaveInsideLayer(fish, fish?.tankLayer || DEFAULT_TANK_LAYER);
  }

  return clampTankLayer(fish?.tankLayer || DEFAULT_TANK_LAYER);
}

function getDesiredFishTankLayer(fish) {
  if (fish?.caveState) {
    if (["approach", "align", "leave"].includes(fish.caveState)) {
      return clampTankLayer(fish.caveFrontLayer || fish.desiredTankLayer || fish.tankLayer || DEFAULT_TANK_LAYER);
    }

    return getFishActiveCaveInsideLayer(fish, fish?.desiredTankLayer || fish?.tankLayer || DEFAULT_TANK_LAYER);
  }

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
  if (/_bubbler\.[^.]+$/.test(key)) {
    return false;
  }
  return key.includes("cave") && !key.includes("_bg") && !key.includes("_mid");
}

function getDecorBubblerMeta(decorKey = "") {
  const directDecor = runtime.decorMap.get(decorKey)?.bubbler;
  if (directDecor) {
    return directDecor;
  }

  return runtime.decorMeta[decorKey]?.bubbler || null;
}

function isBubblerDecorKey(decorKey = "") {
  return Boolean(getDecorBubblerMeta(decorKey));
}

function getDecorFrontLayer(decorKey, layer) {
  const clamped = clampTankLayer(layer);
  if (isBubblerDecorKey(decorKey)) {
    return BUBBLER_LAYER;
  }
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
  const hours = new Date(timestamp).getHours();
  return hours >= CAVE_NIGHT_START_HOUR || hours < CAVE_NIGHT_END_HOUR;
}

function getCaveBehaviorChance(species, timestamp = Date.now()) {
  if (!species || species.behavior === "sucker" || species.caveEnabled === false) {
    return 0;
  }

  if (isCaveNightWindow(timestamp)) {
    return CAVE_NIGHT_ENTRY_CHANCE;
  }

  return CAVE_ENTRY_CHANCE_BY_STYLE[species.swimStyle] || 0.1;
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

  const worldX = Number.isFinite(Number(point.x))
    ? Number(point.x)
    : (Number.isFinite(Number(point.xNorm)) ? Number(point.xNorm) * TANK_WIDTH : Number.NaN);
  const worldY = Number.isFinite(Number(point.y))
    ? Number(point.y)
    : (Number.isFinite(Number(point.yNorm)) ? Number(point.yNorm) * TANK_HEIGHT : Number.NaN);

  if (!Number.isFinite(worldX) || !Number.isFinite(worldY)) {
    return false;
  }

  return pointHitsShapeDescriptor(descriptor, worldX, worldY, ALPHA_COLLISION_THRESHOLD);
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
      .sort((left, right) => {
        const leftScore = Math.hypot(left.xNorm - trigger.xNorm, left.yNorm - trigger.yNorm) - left.areaPx / 12000;
        const rightScore = Math.hypot(right.xNorm - trigger.xNorm, right.yNorm - trigger.yNorm) - right.areaPx / 12000;
        return leftScore - rightScore;
      });

    let seat = null;
    let triggerPath = null;
    for (const candidateSeat of availableSeats) {
      const candidatePath = buildTriggerSeatEntryNodes(item, trigger, candidateSeat, fish, species, now, entryDirection);
      if (!candidatePath) {
        continue;
      }

      seat = candidateSeat;
      triggerPath = candidatePath;
      break;
    }

    if (!seat || !triggerPath) {
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
  if (!fish?.caveDecorId || fish.caveState !== "inside" || !fish?.caveSeatId) {
    return null;
  }

  const decor = getCaveBehaviorDecorById(fish.caveDecorId);
  if (!decor) {
    return null;
  }

  return findRegionById(getCaveSeatRegions(decor), fish.caveSeatId);
}

function getReservedFishCaveSeatId(fish) {
  if (!fish?.id || !fish?.caveDecorId || !fish?.caveState) {
    return null;
  }

  const activePlan = runtime.activeFishCavePlans.get(fish.id) || null;
  if (activePlan?.debugTestLoop) {
    return activePlan.debugSeatId || null;
  }

  return activePlan?.seatId || fish.caveSeatId || null;
}

function getFishActiveCaveInsideLayer(fish, fallbackLayer = DEFAULT_TANK_LAYER) {
  const baseLayer = clampTankLayer(
    Number.isFinite(Number(fish?.caveBackLayer))
      ? Number(fish.caveBackLayer)
      : fallbackLayer
  );
  if (!fish || !["enter", "inside", "exit", "depart"].includes(fish.caveState)) {
    return baseLayer;
  }

  return clampTankLayer(CAVE_SEAT_LOCKED_LAYER);
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

function getMaskRegions(path, options = ALPHA_HIT_THRESHOLD) {
  if (!path) {
    return [];
  }

  const threshold = typeof options === "number"
    ? options
    : (
      Number.isFinite(Number(options?.threshold))
        ? Number(options.threshold)
        : ALPHA_HIT_THRESHOLD
    );
  const minAreaPx = typeof options === "object" && options
    ? Math.max(1, Math.floor(Number(options.minAreaPx) || 12))
    : 12;
  const cacheKey = `${path}|${threshold}|${minAreaPx}`;
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

      if (count < minAreaPx) {
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

function getPlacedMaskRegions(item, imagePath, options = undefined) {
  if (!item || !imagePath) {
    return [];
  }

  return getMaskRegions(imagePath, options)
    .map((region) => mapMaskRegionToTank(item, imagePath, region))
    .filter(Boolean);
}

function annotateSeatMarkerRegion(region, minRadiusPx = CAVE_SEAT_MARKER_EXPAND_RADIUS_PX) {
  if (!region) {
    return null;
  }

  if (region.widthPx > CAVE_SEAT_MARKER_MAX_SIZE_PX && region.heightPx > CAVE_SEAT_MARKER_MAX_SIZE_PX) {
    return region;
  }

  const radiusX = Math.max(minRadiusPx, region.widthPx / 2);
  const radiusY = Math.max(minRadiusPx, region.heightPx / 2);
  return {
    ...region,
    fitWidthPx: radiusX * 2,
    fitHeightPx: radiusY * 2,
    fitAreaPx: Math.max(region.areaPx, Math.PI * radiusX * radiusY),
    markerRegion: {
      left: region.left,
      right: region.right,
      top: region.top,
      bottom: region.bottom,
      widthPx: region.widthPx,
      heightPx: region.heightPx,
      areaPx: region.areaPx
    }
  };
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
    return getPlacedMaskRegions(item, decor.seatsPath)
      .map((region) => annotateSeatMarkerRegion(region))
      .filter(Boolean);
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

  const image = runtime.images.get(getFishAssetPath(fish, species) || species.asset);
  if (!image?.width || !image?.height) {
    return null;
  }

  const width = species.width * getFishEffectiveScale(fish, species);
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

  const regionWidthPx = Number.isFinite(Number(region.fitWidthPx)) ? Number(region.fitWidthPx) : region.widthPx;
  const regionHeightPx = Number.isFinite(Number(region.fitHeightPx)) ? Number(region.fitHeightPx) : region.heightPx;
  return (
    regionWidthPx >= bodySize.bodyWidth * multiplier &&
    regionHeightPx >= bodySize.bodyHeight * multiplier
  );
}

function isFishWithinRegionBounds(fish, region, paddingPx = 6) {
  if (!fish || !region) {
    return false;
  }

  const x = fish.xNorm * TANK_WIDTH;
  const y = fish.yNorm * TANK_HEIGHT;
  const halfWidth = (Number.isFinite(Number(region.fitWidthPx)) ? Number(region.fitWidthPx) : region.widthPx) / 2;
  const halfHeight = (Number.isFinite(Number(region.fitHeightPx)) ? Number(region.fitHeightPx) : region.heightPx) / 2;
  const left = Number.isFinite(Number(region.fitWidthPx)) ? region.x - halfWidth : region.left;
  const right = Number.isFinite(Number(region.fitWidthPx)) ? region.x + halfWidth : region.right;
  const top = Number.isFinite(Number(region.fitHeightPx)) ? region.y - halfHeight : region.top;
  const bottom = Number.isFinite(Number(region.fitHeightPx)) ? region.y + halfHeight : region.bottom;
  return (
    x >= left - paddingPx &&
    x <= right + paddingPx &&
    y >= top - paddingPx &&
    y <= bottom + paddingPx
  );
}

function isCaveSeatOccupied(decorId, seatId, excludingFishId = null) {
  if (!decorId || !seatId) {
    return false;
  }

  const decor = getCaveBehaviorDecorById(decorId);
  const seatRegion = decor ? findRegionById(getCaveSeatRegions(decor), seatId) : null;
  const seatRadiusXNorm = seatRegion
    ? Math.max(
      0.006,
      ((Number.isFinite(Number(seatRegion.fitWidthPx)) ? Number(seatRegion.fitWidthPx) : seatRegion.widthPx) / TANK_WIDTH) * 0.42
    )
    : 0.006;
  const seatRadiusYNorm = seatRegion
    ? Math.max(
      0.006,
      ((Number.isFinite(Number(seatRegion.fitHeightPx)) ? Number(seatRegion.fitHeightPx) : seatRegion.heightPx) / TANK_HEIGHT) * 0.42
    )
    : 0.006;

  return state.fish.some((fish) => (
    fish.id !== excludingFishId &&
    !isFishDead(fish) &&
    (
      (
        fish.caveDecorId === decorId &&
        getReservedFishCaveSeatId(fish) === seatId &&
        ["approach", "align", "enter", "inside", "exit", "depart", "leave"].includes(fish.caveState)
      ) ||
      (
        seatRegion &&
        fish.caveDecorId === decorId &&
        ["inside", "exit", "depart"].includes(fish.caveState) &&
        Math.abs(fish.xNorm - seatRegion.xNorm) <= seatRadiusXNorm &&
        Math.abs(fish.yNorm - seatRegion.yNorm) <= seatRadiusYNorm
      )
    )
  ));
}

function pickCaveSeatIdleTarget(item, seatRegion, fish, species, now = Date.now(), directionOverride = null) {
  if (!item || !seatRegion || !fish || !species) {
    return null;
  }

  const direction = directionOverride == null ? (fish.direction || 1) : (directionOverride < 0 ? -1 : 1);
  const centerPoint = {
    xNorm: seatRegion.xNorm,
    yNorm: seatRegion.yNorm
  };
  const effectiveWidthPx = Number.isFinite(Number(seatRegion.fitWidthPx)) ? Number(seatRegion.fitWidthPx) : seatRegion.widthPx;
  const effectiveHeightPx = Number.isFinite(Number(seatRegion.fitHeightPx)) ? Number(seatRegion.fitHeightPx) : seatRegion.heightPx;
  const maxOffsetX = Math.min(0.03, Math.max(0.003, (effectiveWidthPx / TANK_WIDTH) * 0.42));
  const maxOffsetY = Math.min(0.024, Math.max(0.003, (effectiveHeightPx / TANK_HEIGHT) * 0.42));
  const sampledOffsets = [
    [0, 0],
    [-0.3, 0],
    [0.3, 0],
    [0, -0.3],
    [0, 0.3],
    [-0.48, -0.2],
    [0.48, -0.2],
    [-0.48, 0.2],
    [0.48, 0.2],
    [-0.68, 0],
    [0.68, 0],
    [0, -0.5]
  ];
  const seen = new Set();
  let bestPoint = null;
  let bestScore = Number.POSITIVE_INFINITY;
  const considerPoint = (point) => {
    if (!point) {
      return;
    }

    const cacheKey = `${point.xNorm.toFixed(4)}|${point.yNorm.toFixed(4)}`;
    if (seen.has(cacheKey)) {
      return;
    }
    seen.add(cacheKey);

    if (!doesFishFitAtCavePoint(item, fish, species, now, point, direction)) {
      return;
    }

    const score = Math.hypot(point.xNorm - seatRegion.xNorm, point.yNorm - seatRegion.yNorm);
    if (score < bestScore) {
      bestPoint = point;
      bestScore = score;
    }
  };

  for (const [offsetX, offsetY] of sampledOffsets) {
    considerPoint({
      xNorm: clamp(seatRegion.xNorm + maxOffsetX * offsetX, 0.08, 0.92),
      yNorm: clamp(seatRegion.yNorm + maxOffsetY * offsetY, 0.14, 0.8)
    });
  }

  for (let attempt = 0; attempt < 8; attempt += 1) {
    considerPoint({
      xNorm: clamp(seatRegion.xNorm + randomBetween(-maxOffsetX, maxOffsetX), 0.08, 0.92),
      yNorm: clamp(seatRegion.yNorm + randomBetween(-maxOffsetY, maxOffsetY), 0.14, 0.8)
    });
  }

  return bestPoint;
}

function pickAvailableCaveSeatAssignment(item, fish, species, now = Date.now(), anchorPoint = null) {
  if (!item || !fish || !species) {
    return null;
  }

  const origin = anchorPoint || {
    xNorm: fish.xNorm,
    yNorm: fish.yNorm
  };

  return getCaveSeatRegions(item)
    .filter((seat) => !isCaveSeatOccupied(item.id, seat.id, fish.id))
    .filter((seat) => doesFishFitCaveRegionSize(seat, fish, species, 0.45))
    .map((seat) => {
      const direction = Math.abs(seat.xNorm - origin.xNorm) > 0.001
        ? (seat.xNorm >= origin.xNorm ? 1 : -1)
        : (fish.direction || 1);
      const point = pickCaveSeatIdleTarget(item, seat, fish, species, now, direction);
      if (!point || !doesFishFitAtCavePoint(item, fish, species, now, point, direction, CAVE_PLAN_SAMPLE_STEP_PX)) {
        return null;
      }

      return {
        seatId: seat.id,
        seatRegion: seat,
        point,
        distance: Math.hypot(point.xNorm - origin.xNorm, point.yNorm - origin.yNorm)
      };
    })
    .filter(Boolean)
    .sort((left, right) => left.distance - right.distance)[0] || null;
}

function findCaveInteriorEntryPoint(item, triggerRegion, insidePoint, fish, species, now = Date.now(), directionOverride = null) {
  if (!item || !triggerRegion || !insidePoint || !fish || !species) {
    return null;
  }

  const direction = directionOverride == null ? (fish.direction || 1) : (directionOverride < 0 ? -1 : 1);
  const triggerPoint = {
    xNorm: triggerRegion.xNorm,
    yNorm: triggerRegion.yNorm
  };

  if (doesFishFitAtCavePoint(item, fish, species, now, triggerPoint, direction, CAVE_PLAN_SAMPLE_STEP_PX)) {
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
    if (!doesFishFitAtCavePoint(item, fish, species, now, point, direction, CAVE_PLAN_SAMPLE_STEP_PX)) {
      continue;
    }
    firstValidPoint = point;
    break;
  }

  return firstValidPoint;
}

function buildTriggerSeatEntryNodes(item, triggerRegion, seatRegion, fish, species, now = Date.now(), directionOverride = null) {
  if (!item || !triggerRegion || !seatRegion || !fish || !species) {
    return null;
  }

  const direction = directionOverride == null ? (fish.direction || 1) : (directionOverride < 0 ? -1 : 1);
  const seatPoint = pickCaveSeatIdleTarget(item, seatRegion, fish, species, now, direction);
  if (!seatPoint) {
    return null;
  }

  const entryPoint = findCaveInteriorEntryPoint(item, triggerRegion, seatPoint, fish, species, now, direction);
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
    if (!doesFishFitAtCavePoint(item, fish, species, now, point, direction, CAVE_PLAN_SAMPLE_STEP_PX)) {
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
    let starvationDamageCount = 0;
    let starvationDamageUnits = 0;
    let recoveredCount = 0;
    let deathCount = 0;

    for (const fish of state.fish) {
      if (fish.acquiredAt > slot.start || isFishDead(fish) || !fishNeedsMealWindow(fish)) {
        continue;
      }

      if (wasFed) {
        fish.fedStreak += 1;
        fish.missedMealsInRow = 0;
        if (fish.healthUnits < getFishMaxHealthUnits(fish) && fish.fedStreak >= RECOVERY_FEED_STREAK) {
          fish.healthUnits += 1;
          fish.fedStreak = 0;
          recoveredCount += 1;
        }
      } else {
        fish.fedStreak = 0;
        fish.missedMealsInRow = Math.max(0, Number(fish.missedMealsInRow) || 0) + 1;
        missedCount += 1;

        if (fish.missedMealsInRow >= STARVATION_DAMAGE_MISSED_MEALS_THRESHOLD) {
          fish.healthUnits = Math.max(0, fish.healthUnits - 1);
          starvationDamageCount += 1;
          starvationDamageUnits += 1;
          if (fish.healthUnits <= 0 && markFishAsDead(fish, slot.end, `${fish.name} died after going unfed for too long.`)) {
            deathCount += 1;
          }
        }
      }
    }

    if (!wasFed && missedCount > 0) {
      pushEvent(`${missedCount} fish missed the ${slot.label.toLowerCase()} meal.`, slot.end);
    }

    if (!wasFed && starvationDamageCount > 0) {
      pushEvent(`${starvationDamageCount} fish went too long without food and lost ${starvationDamageUnits} half-heart ${pluralize("step", starvationDamageUnits)}.`, slot.end);
    }

    if (wasFed && recoveredCount > 0) {
      pushEvent(`${recoveredCount} fish recovered half a heart thanks to regular feeding.`, slot.end);
    }

    if (deathCount > 0) {
      pushEvent(`${deathCount} ${pluralize("fish", deathCount)} died and floated to the surface.`, slot.end);
    }

    const bredThisSlot = processFishBreedingForSlot(slot);
    changed = changed || missedCount > 0 || starvationDamageCount > 0 || recoveredCount > 0 || deathCount > 0 || bredThisSlot;
  }

  const droppedPoops = [];
  state.pendingPoops = state.pendingPoops.filter((poop) => {
    if (poop.dueAt <= now) {
      const fish = state.fish.find((entry) => entry.id === poop.fishId);
      if (!fish || isFishDead(fish)) {
        return false;
      }
      state.poops.push(createPoopRecord({
        fishId: poop.fishId,
        createdAt: poop.dueAt,
        xNorm: clamp((fish?.xNorm ?? randomSwimX()) + (Math.random() - 0.5) * 0.06, 0.08, 0.92),
        startYNorm: fish ? clamp(fish.yNorm + 0.04, 0.14, 0.8) : randomSwimY()
      }));
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
  changed = applyCriticalComfortHealthEffects(now) || changed;

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

function getCriticalTankConditionStartAt(now) {
  const startCandidates = [];
  const deadFish = getDeadTankFish();
  if (deadFish.length) {
    startCandidates.push(
      Math.min(...deadFish.map((fish) => Number.isFinite(fish.deadAt) ? fish.deadAt : now))
    );
  }

  const dirtyAt = state.lastCleanedAt + getFilterMaxDirtyDurationMs();
  if (dirtyAt <= now) {
    startCandidates.push(dirtyAt);
  }

  return startCandidates.length ? Math.min(...startCandidates) : null;
}

function applyCriticalComfortHealthEffects(now) {
  const livingFish = getLivingTankFish();
  if (!livingFish.length) {
    return false;
  }

  const criticalStart = getCriticalTankConditionStartAt(now);
  if (!Number.isFinite(criticalStart)) {
    return resetLivingFishComfortDamageProgress();
  }

  const exposureStart = Math.max(state.lastSimulatedAt || now, criticalStart);
  const exposureMs = Math.max(0, now - exposureStart);
  if (exposureMs <= 0) {
    return false;
  }

  let changed = false;
  let hurtFishCount = 0;
  let totalDamageUnits = 0;
  let deathCount = 0;
  const corpsesPresent = getDeadTankFish().length > 0;

  for (const fish of livingFish) {
    fish.comfortDamageProgressMs = Math.max(0, Number(fish.comfortDamageProgressMs) || 0) + exposureMs;
    const damageTickMs = getFishCriticalHealthTickMs(fish);
    const damageUnits = Math.min(
      fish.healthUnits,
      Math.floor(fish.comfortDamageProgressMs / Math.max(1, damageTickMs))
    );

    if (damageUnits <= 0) {
      continue;
    }

    fish.comfortDamageProgressMs -= damageUnits * damageTickMs;
    fish.healthUnits = Math.max(0, fish.healthUnits - damageUnits);
    fish.fedStreak = 0;
    totalDamageUnits += damageUnits;
    hurtFishCount += 1;
    changed = true;

    if (fish.healthUnits <= 0 && markFishAsDead(
      fish,
      now,
      corpsesPresent
        ? `${fish.name} died after a dead fish poisoned the whole tank.`
        : `${fish.name} died after the tank stayed filthy for too long.`
    )) {
      deathCount += 1;
    }
  }

  if (hurtFishCount > 0) {
    pushEvent(
      corpsesPresent
        ? `A dead fish left in the tank made the water critical. ${hurtFishCount} ${pluralize("fish", hurtFishCount)} lost ${totalDamageUnits} half-heart ${pluralize("step", totalDamageUnits)}.`
        : `The tank sat at maximum dirtiness too long. ${hurtFishCount} ${pluralize("fish", hurtFishCount)} lost ${totalDamageUnits} half-heart ${pluralize("step", totalDamageUnits)}.`,
      now
    );
  }

  if (deathCount > 0) {
    changed = true;
  }

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
    const canClearNearbyPoop = nearbyPoopIndex !== -1
      && Math.random() <= (Number.isFinite(species.poopCleanupChance) ? species.poopCleanupChance : 1);
    if (canClearNearbyPoop) {
      state.poops.splice(nearbyPoopIndex, 1);
      changed = true;
    } else {
      const dirtiness = getBaseTankDirtiness(now);
      if (dirtiness > 0.03) {
        const cleanupStrength = species.cleanupStrength * (nearbyPoopIndex !== -1 ? 0.35 : 1);
        state.lastCleanedAt = Math.min(now, state.lastCleanedAt + cleanupStrength * HOUR_MS);
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
    showToast("Only detritus grazers are in the tank right now. They live off grime and trace waste instead of pellets.");
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

    clearFishSchoolFollowState(fish);
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

function createFishRecord(speciesId, options = {}) {
  const species = runtime.fishMap.get(speciesId);
  if (!species) {
    return null;
  }

  const now = Number.isFinite(Number(options.now)) ? Number(options.now) : Date.now();
  const fishId = String(options.id || createId("fish"));
  const xNorm = clamp(Number.isFinite(Number(options.xNorm)) ? Number(options.xNorm) : randomSwimX(), 0.08, 0.92);
  const yNorm = clamp(
    Number.isFinite(Number(options.yNorm))
      ? Number(options.yNorm)
      : (species.behavior === "shrimp" ? 0.42 + Math.random() * 0.36 : randomSwimY()),
    0.14,
    0.8
  );
  const targetXNorm = clamp(Number.isFinite(Number(options.targetXNorm)) ? Number(options.targetXNorm) : randomSwimX(), 0.08, 0.92);
  const targetYNorm = clamp(
    Number.isFinite(Number(options.targetYNorm))
      ? Number(options.targetYNorm)
      : (species.behavior === "shrimp" ? 0.4 + Math.random() * 0.4 : randomSwimY()),
    0.14,
    0.8
  );
  const direction = Number.isFinite(Number(options.direction))
    ? (Number(options.direction) < 0 ? -1 : 1)
    : (Math.random() > 0.5 ? 1 : -1);
  const tankLayer = species.behavior === "sucker"
    ? TANK_DEPTH_LAYERS
    : species.behavior === "shrimp"
      ? clampTankLayer(
        Number.isFinite(Number(options.tankLayer))
          ? Number(options.tankLayer)
          : TANK_DEPTH_LAYERS - 1
      )
    : clampTankLayer(
      Number.isFinite(Number(options.tankLayer))
        ? Number(options.tankLayer)
        : (1 + Math.floor(Math.random() * TANK_DEPTH_LAYERS))
    );
  const desiredTankLayer = species.behavior === "sucker"
    ? TANK_DEPTH_LAYERS
    : species.behavior === "shrimp"
      ? clampTankLayer(
        Number.isFinite(Number(options.desiredTankLayer))
          ? Number(options.desiredTankLayer)
          : tankLayer
      )
    : clampTankLayer(
      Number.isFinite(Number(options.desiredTankLayer))
        ? Number(options.desiredTankLayer)
        : DEFAULT_TANK_LAYER
    );
  const scale = clamp(
    Number.isFinite(Number(options.scale)) ? Number(options.scale) : getFishScaleDefault(speciesId),
    FISH_SCALE_MIN,
    FISH_SCALE_MAX
  );
  const takenNames = [
    ...(state?.fish || []),
    ...(state?.storedFish || [])
  ]
    .map((fish) => fish?.name)
    .filter((name) => typeof name === "string" && name.trim());
  const growthStartedAt = Number.isFinite(Number(options.growthStartedAt))
    ? Number(options.growthStartedAt)
    : (options.juvenile ? now : null);
  const growthEndsAt = Number.isFinite(Number(options.growthEndsAt))
    ? Number(options.growthEndsAt)
    : (options.juvenile ? now + BABY_FISH_GROWTH_DURATION_MS : null);
  const appearanceVariant = normalizeFishAppearanceVariantIndex(options.appearanceVariant, species, {
    id: fishId,
    name: options.name,
    speciesId
  });
  const fish = {
    id: fishId,
    speciesId,
    name: typeof options.name === "string" && options.name.trim()
      ? options.name.trim()
      : buildFishName(speciesId, takenNames),
    acquiredAt: now,
    tankAddedAt: Number.isFinite(Number(options.tankAddedAt)) ? Number(options.tankAddedAt) : now,
    deadAt: null,
    breedCooldownUntil: Number.isFinite(Number(options.breedCooldownUntil)) ? Number(options.breedCooldownUntil) : 0,
    healthUnits: clamp(
      Number.isFinite(Number(options.healthUnits)) ? Number(options.healthUnits) : getSpeciesMaxHealthUnits(species),
      0,
      getSpeciesMaxHealthUnits(species)
    ),
    fedStreak: 0,
    missedMealsInRow: 0,
    xNorm,
    yNorm,
    targetXNorm,
    targetYNorm,
    targetAt: Number.isFinite(Number(options.targetAt))
      ? Number(options.targetAt)
      : now + species.targetMinMs + Math.random() * Math.max(200, species.targetMaxMs - species.targetMinMs),
    direction,
    swimSpeed: normalizeFishSpeed(species, Number(options.swimSpeed)),
    phase: Math.random(),
    motionLevel: 0.2,
    wiggleClock: Math.random() * Math.PI * 2,
    appearanceVariant,
    scale,
    growthStartedAt,
    growthEndsAt,
    activity: "roam",
    feedingPelletId: null,
    comfortDamageProgressMs: 0,
    tankLayer,
    desiredTankLayer,
    drawLayer: tankLayerToLegacy(tankLayer),
    desiredDrawLayer: tankLayerToLegacy(desiredTankLayer),
    hangoutDecorId: null,
    nextDetritusSnackAt: now + species.cleanupMinMs,
    displayDirection: direction,
    displayAngle: direction < 0 ? Math.PI : 0,
    turnStartedAt: null,
    turnDurationMs: 0,
    turnFromDirection: direction,
    turnToDirection: direction,
    turnFromAngle: direction < 0 ? Math.PI : 0,
    turnToAngle: direction < 0 ? Math.PI : 0,
    turnSpinDirection: direction < 0 ? 1 : -1,
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
    caveIdleTargetAt: null,
    entryStartedAt: Number.isFinite(Number(options.entryStartedAt)) ? Number(options.entryStartedAt) : null,
    entryDurationMs: Number.isFinite(Number(options.entryDurationMs)) ? Number(options.entryDurationMs) : 0,
    entryFromYNorm: Number.isFinite(Number(options.entryFromYNorm)) ? clamp(Number(options.entryFromYNorm), 0.02, 0.18) : null,
    entrySplashTriggered: false
  };
  setFishTankLayers(fish, tankLayer, desiredTankLayer);
  return fish;
}

function addFishToTank(fish, now = Date.now()) {
  if (!fish) {
    return null;
  }

  preserveTankDirtinessThroughChange(now, () => {
    state.fish.push(fish);
  });
  return fish;
}

function getBreedableFishGroups(now = Date.now(), options = {}) {
  const groups = new Map();
  const requireReady = options.requireReady !== false;
  const excludeDebugPair = options.excludeDebugPair !== false;
  const debugSequence = runtime.debugBreedingSequence;
  const debugFishIds = debugSequence
    ? new Set([debugSequence.leftFishId, debugSequence.rightFishId].filter(Boolean))
    : null;

  for (const fish of state.fish) {
    if (!fish || isFishDead(fish) || !isFishAdult(fish, now)) {
      continue;
    }

    if (excludeDebugPair && debugFishIds?.has(fish.id)) {
      continue;
    }

    if (requireReady) {
      if (!hasFishBeenInTankLongEnoughToBreed(fish, now)) {
        continue;
      }
      if ((Number(fish.breedCooldownUntil) || 0) > now) {
        continue;
      }
    }

    const bucket = groups.get(fish.speciesId) || [];
    bucket.push(fish);
    groups.set(fish.speciesId, bucket);
  }

  return [...groups.entries()].filter(([, fishList]) => fishList.length >= 2);
}

function pickRandomItems(items, count = 1) {
  const pool = Array.isArray(items) ? [...items] : [];
  for (let index = pool.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [pool[index], pool[swapIndex]] = [pool[swapIndex], pool[index]];
  }
  return pool.slice(0, Math.max(0, Math.min(pool.length, Math.floor(count))));
}

function createBabyFishFromSpecies(speciesId, now = Date.now(), options = {}) {
  const species = runtime.fishMap.get(speciesId);
  if (!species) {
    return null;
  }

  const anchorXNorm = clamp(Number.isFinite(Number(options.anchorXNorm)) ? Number(options.anchorXNorm) : randomSwimX(), 0.12, 0.88);
  const anchorYNorm = clamp(Number.isFinite(Number(options.anchorYNorm)) ? Number(options.anchorYNorm) : randomSwimY(), 0.18, 0.76);
  const tankLayer = species.behavior === "sucker"
    ? TANK_DEPTH_LAYERS
    : clampTankLayer(Number.isFinite(Number(options.tankLayer)) ? Number(options.tankLayer) : DEFAULT_TANK_LAYER);
  return createFishRecord(speciesId, {
    now,
    juvenile: true,
    tankLayer,
    desiredTankLayer: tankLayer,
    xNorm: clamp(anchorXNorm + randomBetween(-0.014, 0.014), 0.08, 0.92),
    yNorm: clamp(anchorYNorm + randomBetween(-0.012, 0.012), 0.14, 0.8),
    targetXNorm: clamp(anchorXNorm + randomBetween(-0.05, 0.05), 0.08, 0.92),
    targetYNorm: clamp(anchorYNorm + randomBetween(-0.04, 0.04), 0.14, 0.8)
  });
}

function processFishBreedingForSlot(slot) {
  const breedingGroups = getBreedableFishGroups(slot.end, { requireReady: true });
  if (!breedingGroups.length) {
    return false;
  }

  let changed = false;
  for (const [speciesId, eligibleFish] of breedingGroups) {
    const pairCount = Math.floor(eligibleFish.length / 2);
    if (pairCount < 1) {
      continue;
    }

    const spawnChance = clamp(
      BREEDING_BASE_CHANCE_PER_WINDOW + Math.max(0, pairCount - 1) * BREEDING_EXTRA_PAIR_BONUS_CHANCE,
      0,
      BREEDING_MAX_CHANCE_PER_WINDOW
    );
    if (Math.random() > spawnChance) {
      continue;
    }

    const parents = pickRandomItems(eligibleFish, 2);
    if (parents.length < 2) {
      continue;
    }

    const species = runtime.fishMap.get(speciesId);
    const anchorXNorm = clamp((parents[0].xNorm + parents[1].xNorm) / 2 + randomBetween(-0.015, 0.015), 0.12, 0.88);
    const anchorYNorm = clamp((parents[0].yNorm + parents[1].yNorm) / 2 + randomBetween(-0.012, 0.012), 0.18, 0.76);
    const targetLayer = species?.behavior === "sucker"
      ? TANK_DEPTH_LAYERS
      : clampTankLayer(Math.round((getFishTankLayer(parents[0]) + getFishTankLayer(parents[1])) / 2));
    const baby = createBabyFishFromSpecies(speciesId, slot.end, {
      anchorXNorm,
      anchorYNorm,
      tankLayer: targetLayer
    });
    if (!baby) {
      continue;
    }

    addFishToTank(baby, slot.end);
    const cooldownUntil = slot.end + BREEDING_COOLDOWN_MS;
    for (const parent of parents) {
      parent.breedCooldownUntil = cooldownUntil;
    }

    pushEvent(`A baby ${species?.name || "fish"} appeared after ${parents[0].name} and ${parents[1].name} paired up.`, slot.end);
    changed = true;
  }

  return changed;
}

function hasDebugBreedingPairCandidate(now = Date.now()) {
  return getBreedableFishGroups(now, { requireReady: false }).length > 0;
}

function clearDebugBreedingSequence() {
  runtime.debugBreedingSequence = null;
}

function getActiveDebugBreedingSequenceFish() {
  const sequence = runtime.debugBreedingSequence;
  if (!sequence) {
    return null;
  }

  const leftFish = state.fish.find((fish) => fish.id === sequence.leftFishId) || null;
  const rightFish = state.fish.find((fish) => fish.id === sequence.rightFishId) || null;
  if (
    !leftFish
    || !rightFish
    || leftFish.speciesId !== rightFish.speciesId
    || isFishDead(leftFish)
    || isFishDead(rightFish)
  ) {
    clearDebugBreedingSequence();
    return null;
  }

  return { sequence, leftFish, rightFish };
}

function getDebugBreedingTarget(sequence, role) {
  const direction = role === "left" ? -1 : 1;
  return {
    xNorm: clamp(sequence.anchorXNorm + direction * sequence.spacingNorm, 0.08, 0.92),
    yNorm: clamp(sequence.anchorYNorm, 0.14, 0.8)
  };
}

function hasFishReachedNormTarget(fish, target) {
  if (!fish || !target) {
    return false;
  }

  return Math.hypot((fish.xNorm || 0) - target.xNorm, (fish.yNorm || 0) - target.yNorm) <= DEBUG_BREEDING_REACHED_DISTANCE_NORM;
}

function updateDebugBreedingSequence(now) {
  const activeSequence = getActiveDebugBreedingSequenceFish();
  if (!activeSequence) {
    return null;
  }

  const { sequence, leftFish, rightFish } = activeSequence;
  if (!Number.isFinite(sequence.cuddleStartedAt)) {
    const leftTarget = getDebugBreedingTarget(sequence, "left");
    const rightTarget = getDebugBreedingTarget(sequence, "right");
    if (hasFishReachedNormTarget(leftFish, leftTarget) && hasFishReachedNormTarget(rightFish, rightTarget)) {
      sequence.cuddleStartedAt = now;
      sequence.cuddleEndsAt = now + DEBUG_BREEDING_HOLD_MS;
    }
    return activeSequence;
  }

  if (now < sequence.cuddleEndsAt) {
    return activeSequence;
  }

  const species = runtime.fishMap.get(sequence.speciesId);
  const baby = createBabyFishFromSpecies(sequence.speciesId, now, {
    anchorXNorm: sequence.anchorXNorm,
    anchorYNorm: sequence.anchorYNorm,
    tankLayer: sequence.targetLayer
  });
  if (baby) {
    addFishToTank(baby, now);
    const cooldownUntil = now + BREEDING_COOLDOWN_MS;
    leftFish.breedCooldownUntil = cooldownUntil;
    rightFish.breedCooldownUntil = cooldownUntil;
    leftFish.targetAt = now;
    rightFish.targetAt = now;
    pushEvent(`A baby ${species?.name || "fish"} joined ${leftFish.name} and ${rightFish.name}.`, now);
    clearDebugBreedingSequence();
    saveState();
    renderUi(now);
    showToast(`A baby ${species?.name || "fish"} arrived.`);
    return null;
  }

  clearDebugBreedingSequence();
  return null;
}

function setFishBreedingTarget(fish, species, sequence, role, now) {
  const target = getDebugBreedingTarget(sequence, role);
  fish.activity = "roam";
  fish.feedingPelletId = null;
  fish.hangoutDecorId = null;
  fish.panicUntil = null;
  fish.panicSpeedBoost = null;
  clearFishSchoolFollowState(fish);
  fish.targetXNorm = target.xNorm;
  fish.targetYNorm = target.yNorm;
  fish.targetAt = Math.max(now + 500, Number(sequence.cuddleEndsAt) || (now + 1800));
  setFishDesiredTankLayer(fish, sequence.targetLayer);
  if (Number.isFinite(sequence.cuddleStartedAt)) {
    setFishDirection(fish, role === "left" ? 1 : -1, species, now);
  } else if (species.speedMode === "dynamic") {
    fish.swimSpeed = normalizeFishSpeed(
      species,
      randomBetween(
        Math.max(species.speedMin, species.speedMax * 0.74),
        species.speedMax
      )
    );
  }
}

function triggerDebugBabySequence() {
  const now = Date.now();
  syncState(now);

  if (runtime.debugBreedingSequence) {
    showToast("A baby sequence is already running.");
    return;
  }

  const groups = getBreedableFishGroups(now, { requireReady: false });
  if (!groups.length) {
    showToast("You need two grown fish of the same species in the tank.");
    return;
  }

  const [speciesId, candidates] = groups[Math.floor(Math.random() * groups.length)];
  const parents = pickRandomItems(candidates, 2);
  if (parents.length < 2) {
    showToast("A same-species pair could not be lined up right now.");
    return;
  }

  const species = runtime.fishMap.get(speciesId);
  const [leftFish, rightFish] = parents;
  const anchorXNorm = clamp((leftFish.xNorm + rightFish.xNorm) / 2 + randomBetween(-0.02, 0.02), 0.18, 0.82);
  const anchorYNorm = clamp((leftFish.yNorm + rightFish.yNorm) / 2 + randomBetween(-0.018, 0.018), 0.2, 0.72);
  const spacingNorm = clamp(
    (getFishVisualSize(leftFish, species, now) + getFishVisualSize(rightFish, species, now)) / TANK_WIDTH * 0.1,
    0.018,
    0.042
  );
  const targetLayer = species?.behavior === "sucker"
    ? TANK_DEPTH_LAYERS
    : clampTankLayer(Math.round((getFishTankLayer(leftFish) + getFishTankLayer(rightFish)) / 2));

  runtime.debugBreedingSequence = {
    id: createId("breed-seq"),
    speciesId,
    leftFishId: leftFish.id,
    rightFishId: rightFish.id,
    anchorXNorm,
    anchorYNorm,
    spacingNorm,
    targetLayer,
    startedAt: now,
    cuddleStartedAt: null,
    cuddleEndsAt: null
  };

  state.floatingPellets = state.floatingPellets.filter((pellet) => pellet.targetFishId !== leftFish.id && pellet.targetFishId !== rightFish.id);
  for (const fish of parents) {
    if (fish.caveState) {
      abortFishCaveBehavior(fish, now, false);
    }
    clearFishSchoolFollowState(fish);
    fish.activity = "roam";
    fish.feedingPelletId = null;
    fish.hangoutDecorId = null;
    fish.targetAt = now;
  }

  saveState();
  renderUi(now);
  showToast(`${species?.name || "Fish"} pair test started.`);
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
  const now = Date.now();
  const fish = createFishRecord(speciesId, { now });
  addFishToTank(fish, now);
  pushEvent(`${fish.name} the ${species.name} splashed into the tank.`, fish.acquiredAt);
  saveState();
  renderUi(now);
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

function buyFilter(filterKey) {
  const filter = runtime.filterMap.get(filterKey);
  if (!filter || !filter.purchasable) {
    return;
  }

  if (isFilterOwned(filterKey)) {
    showToast(`${filter.name} has already been purchased.`);
    return;
  }

  if (state.coins < filter.cost) {
    showToast(`You need ${filter.cost} ${pluralize("coin", filter.cost)} for the ${filter.name}.`);
    return;
  }

  const now = Date.now();
  state.coins -= filter.cost;
  state.ownedFilterAssets = sanitizeOwnedFilterAssets([...state.ownedFilterAssets, filterKey], filterKey);
  preserveTankDirtinessThroughChange(now, () => {
    state.selectedFilterAsset = filterKey;
  });
  pushEvent(`Bought and equipped the ${filter.name}.`, now);
  saveState();
  renderUi(now);
  showToast(`${filter.name} installed.`);
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
    isBubblerDecorKey(decorKey)
      ? "Move over the tank to preview it, then click to place. Bubblers stay on layer 5."
      : isCaveDecorKey(decorKey)
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
    const placementLayer = getDecorFrontLayer(decorKey, currentLayer + step);
    if (placementLayer !== currentLayer) {
      runtime.placementMode.tankLayer = placementLayer;
      nextLayer = placementLayer;
      changed = true;
    }
  }

  if (runtime.dragState) {
    const item = state.placedDecor.find((placed) => placed.id === runtime.dragState.placedId);
    if (item) {
      const currentLayer = runtime.dragState.tankLayer || item.tankLayer || DEFAULT_TANK_LAYER;
      const itemLayer = getDecorFrontLayer(item.decorKey, currentLayer + step);
      if (itemLayer !== currentLayer) {
        runtime.dragState.tankLayer = itemLayer;
        item.tankLayer = itemLayer;
        nextLayer = itemLayer;
        changed = true;
      }
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

  const activeDecorKey = runtime.dragState?.decorKey || runtime.placementMode?.decorKey || "";
  const layerHintMarkup = activeDecorKey && isBubblerDecorKey(activeDecorKey)
    ? `<div><strong>Layer</strong> - Bubblers stay on layer 5</div>`
    : `<div><strong>[Z]/[X]</strong> - Change Layer</div>`;
  const markup = runtime.fishEditMode
    ? `
      <div><strong>Right Click</strong> - Move to Storage</div>
      <div><strong>Drag Fish</strong> - Reposition in Tank</div>
    `
    : `
      ${layerHintMarkup}
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

  if (runtime.debugForcedCaveFishId === fishId) {
    clearDebugCaveTestSelection();
  }

  const now = Date.now();
  preserveTankDirtinessThroughChange(now, () => {
    state.fish.splice(index, 1);
    fish.feedingPelletId = null;
    fish.comfortDamageProgressMs = 0;
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
  });
  if (dead && !getDeadTankFish().length && getBaseTankDirtiness(now) < CRITICAL_TANK_DIRTINESS) {
    resetLivingFishComfortDamageProgress();
  }
  if (runtime.selectedFishId === fishId) {
    runtime.selectedFishId = null;
  }

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
  if (isFishJuvenile(fish)) {
    showToast("Baby fish need time to grow before they can be sold.");
    return;
  }

  const species = runtime.fishMap.get(fish.speciesId);
  if (!species) {
    return;
  }

  const resaleValue = getResaleValue(species.cost);
  const now = Date.now();

  if (isActive) {
    preserveTankDirtinessThroughChange(now, () => {
      list.splice(index, 1);
      state.pendingPoops = state.pendingPoops.filter((poop) => poop.fishId !== fishId);
      state.floatingPellets = state.floatingPellets.filter((pellet) => pellet.targetFishId !== fishId);
    });
  } else {
    list.splice(index, 1);
    state.pendingPoops = state.pendingPoops.filter((poop) => poop.fishId !== fishId);
    state.floatingPellets = state.floatingPellets.filter((pellet) => pellet.targetFishId !== fishId);
  }

  if (runtime.selectedFishId === fishId) {
    runtime.selectedFishId = null;
  }

  state.coins += resaleValue;
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

  if (runtime.debugForcedCaveFishId === fishId) {
    clearDebugCaveTestSelection();
  }

  list.splice(index, 1);
  state.pendingPoops = state.pendingPoops.filter((poop) => poop.fishId !== fishId);
  state.floatingPellets = state.floatingPellets.filter((pellet) => pellet.targetFishId !== fishId);
  if (!getDeadTankFish().length) {
    state.lastCorpseSicknessAt = null;
    if (getBaseTankDirtiness(Date.now()) < CRITICAL_TANK_DIRTINESS) {
      resetLivingFishComfortDamageProgress();
    }
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
    if (getBaseTankDirtiness(Date.now()) < CRITICAL_TANK_DIRTINESS) {
      resetLivingFishComfortDamageProgress();
    }
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

  const now = Date.now();
  preserveTankDirtinessThroughChange(now, () => {
    state.storedFish.splice(index, 1);
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
    fish.comfortDamageProgressMs = 0;
    fish.tankAddedAt = now;
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
  });
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

function isFishSickOrDying(fish) {
  return Boolean(fish && !isFishDead(fish) && fish.healthUnits <= getFishSickHealthUnitsThreshold(fish));
}

function getFishVisualSize(fish, species = getSpeciesForFish(fish), now = Date.now()) {
  if (!species) {
    return runtime.fishSizeRange?.min || 84;
  }

  return species.width * getFishEffectiveScale(fish, species, now);
}

function getFishSizeRatio(fish, species = getSpeciesForFish(fish)) {
  const sizeRange = runtime.fishSizeRange || buildFishSizeRange();
  const minSize = Number(sizeRange.min) || 84;
  const maxSize = Number(sizeRange.max) || 240;
  if (maxSize <= minSize) {
    return 0;
  }

  return clamp((getFishVisualSize(fish, species) - minSize) / (maxSize - minSize), 0, 1);
}

function getFishHealthSizeRatio(species) {
  if (!species) {
    return 0;
  }

  const sizeRange = runtime.fishSizeRange || buildFishSizeRange();
  const minSize = Number(sizeRange.min) || 84;
  const maxSize = Number(sizeRange.max) || 240;
  if (maxSize <= minSize) {
    return 0;
  }

  const speciesWidth = clamp(Number(species.width) || minSize, minSize, maxSize);
  return clamp((speciesWidth - minSize) / (maxSize - minSize), 0, 1);
}

function getFishHealthCostRatio(species) {
  if (!species) {
    return 0;
  }

  const costRange = runtime.fishCostRange || buildFishCostRange();
  const minCost = Number(costRange.min) || 1;
  const maxCost = Number(costRange.max) || minCost;
  if (maxCost <= minCost) {
    return 0;
  }

  const speciesCost = clamp(Math.max(1, Math.floor(Number(species.cost) || 1)), minCost, maxCost);
  return clamp((speciesCost - minCost) / (maxCost - minCost), 0, 1);
}

function getSpeciesMaxHealthUnits(species) {
  if (!species) {
    return MIN_FISH_HEARTS * 2;
  }

  const explicitHeartCount = Number(species.heartCount ?? species.hearts);
  if (Number.isFinite(explicitHeartCount)) {
    return clamp(Math.round(explicitHeartCount), MIN_FISH_HEARTS, MAX_FISH_HEARTS) * 2;
  }

  const sizeHearts = MIN_FISH_HEARTS + Math.round(
    getFishHealthSizeRatio(species) * (FISH_HEALTH_SIZE_BASE_MAX_HEARTS - MIN_FISH_HEARTS)
  );
  const cost = Math.max(1, Math.floor(Number(species.cost) || 1));
  const costBonus = (cost >= PREMIUM_FISH_HEART_COST_THRESHOLD ? PREMIUM_FISH_HEART_BONUS : 0)
    + (cost >= ULTRA_PREMIUM_FISH_HEART_COST_THRESHOLD ? ULTRA_PREMIUM_FISH_HEART_BONUS : 0);
  const hearts = clamp(sizeHearts + costBonus, MIN_FISH_HEARTS, MAX_FISH_HEARTS);
  return hearts * 2;
}

function getFishMaxHealthUnits(fish, species = getSpeciesForFish(fish)) {
  return getSpeciesMaxHealthUnits(species);
}

function getFishHealthRatio(fish, species = getSpeciesForFish(fish)) {
  return clamp((Number(fish?.healthUnits) || 0) / Math.max(1, getFishMaxHealthUnits(fish, species)), 0, 1);
}

function getFishSickHealthUnitsThreshold(fish, species = getSpeciesForFish(fish)) {
  return Math.max(1, Math.ceil(getFishMaxHealthUnits(fish, species) * SICK_FISH_HEALTH_RATIO_THRESHOLD));
}

function scaleLegacyFishHealthUnits(rawUnits, maxHealthUnits) {
  const legacyUnits = clamp(Math.round(Number(rawUnits) || 0), 0, LEGACY_MAX_HEALTH_UNITS);
  if (legacyUnits <= 0) {
    return 0;
  }

  if (legacyUnits >= LEGACY_MAX_HEALTH_UNITS) {
    return maxHealthUnits;
  }

  return clamp(Math.round((legacyUnits / LEGACY_MAX_HEALTH_UNITS) * maxHealthUnits), 1, maxHealthUnits);
}

function rebalanceFishHealthForCurrentModel(fish, species = getSpeciesForFish(fish)) {
  if (!fish || isFishDead(fish)) {
    return fish;
  }

  const maxHealthUnits = getFishMaxHealthUnits(fish, species);
  return {
    ...fish,
    healthUnits: clamp((Math.round(Number(fish.healthUnits) || 0) + 1), 1, maxHealthUnits),
    missedMealsInRow: 0
  };
}

function getFishDirtinessBonus(fish, species = getSpeciesForFish(fish)) {
  const sizeRatio = getFishSizeRatio(fish, species);
  return FISH_DIRTINESS_BONUS_MIN + sizeRatio * (FISH_DIRTINESS_BONUS_MAX - FISH_DIRTINESS_BONUS_MIN);
}

function getDeadFishDirtinessBonus(deadFishList = getDeadTankFish()) {
  const deadFish = Array.isArray(deadFishList) ? deadFishList.filter((fish) => fish && isFishDead(fish)) : [];
  return deadFish.length * DEAD_FISH_DIRTINESS_BONUS;
}

function getTankFishDirtinessMultiplier(fishList = getLivingTankFish(), deadFishList = getDeadTankFish()) {
  const activeFish = Array.isArray(fishList) ? fishList.filter((fish) => fish && !isFishDead(fish)) : [];
  return 1
    + activeFish.reduce((total, fish) => total + getFishDirtinessBonus(fish), 0)
    + getDeadFishDirtinessBonus(deadFishList);
}

function getFilterMaxDirtyDurationMs(filterKey = state?.selectedFilterAsset, fishList = getLivingTankFish()) {
  const filterProfile = getFilterProfile(filterKey);
  return filterProfile.cleanDays * DAY_MS / Math.max(1, getTankFishDirtinessMultiplier(fishList));
}

function getFishCriticalHealthTickMs(fish, species = getSpeciesForFish(fish)) {
  return CRITICAL_COMFORT_HEALTH_TICK_MS;
}

function resetLivingFishComfortDamageProgress() {
  let changed = false;
  for (const fish of getLivingTankFish()) {
    if ((Number(fish.comfortDamageProgressMs) || 0) > 0) {
      fish.comfortDamageProgressMs = 0;
      changed = true;
    }
  }
  return changed;
}

function rebaseTankDirtiness(now, dirtiness = getBaseTankDirtiness(now)) {
  state.lastCleanedAt = now - clamp(dirtiness, 0, 1) * getFilterMaxDirtyDurationMs(state.selectedFilterAsset, getLivingTankFish());
}

function preserveTankDirtinessThroughChange(now, applyChange) {
  const currentDirtiness = getBaseTankDirtiness(now);
  applyChange();
  rebaseTankDirtiness(now, currentDirtiness);
}

function getPoopFloorYNormAtXNorm(xNorm) {
  return clamp((getTankFloorSurfaceYAtX(clamp(xNorm, 0.08, 0.92) * TANK_WIDTH) + 4) / TANK_HEIGHT, 0.8, 0.96);
}

function createPoopRecord({ fishId = "", createdAt = Date.now(), xNorm = 0.5, startYNorm = 0.54 } = {}) {
  const clampedXNorm = clamp(xNorm, 0.08, 0.92);
  return {
    id: createId("poop"),
    fishId,
    createdAt,
    xNorm: clampedXNorm,
    yNorm: getPoopFloorYNormAtXNorm(clampedXNorm),
    startYNorm: clamp(startYNorm, 0.14, 0.82),
    asset: resolveAppUrl(POOP_ASSET_PATH)
  };
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

  const orbitSeed = clamp(Number(fish.phase) || 0.5, 0, 1);
  const ringRadius = 0.05 + orbitSeed * 0.06;
  const orbitAngle = orbitSeed * Math.PI * 2;
  return {
    xNorm: clamp(nearest.fish.xNorm + Math.cos(orbitAngle) * ringRadius, 0.08, 0.92),
    yNorm: clamp(
      nearest.fish.yNorm + 0.02 + Math.abs(Math.sin(orbitAngle)) * Math.min(0.06, ringRadius * 0.9),
      0.14,
      0.8
    ),
    lingerMs: 1200 + Math.random() * 1800,
    targetLayer: clampTankLayer(Math.min(2, Math.max(1, getFishTankLayer(fish))))
  };
}

function clearFishSchoolFollowState(fish) {
  if (!fish) {
    return;
  }

  fish.followFishId = null;
  fish.followUntil = null;
  fish.followOffsetXNorm = null;
  fish.followOffsetYNorm = null;
}

function pruneFishGravelPebbleRuntimeState(now = Date.now()) {
  const activeFishIds = new Set((state?.fish || []).map((fish) => fish.id));
  for (const [fishId] of runtime.fishGravelPebbleActions) {
    if (!activeFishIds.has(fishId)) {
      runtime.fishGravelPebbleActions.delete(fishId);
    }
  }

  runtime.fishPebbleTosses = (runtime.fishPebbleTosses || []).filter((toss) => {
    if (!toss?.assetPath || !toss?.color) {
      return false;
    }

    return now < toss.startedAt + toss.durationMs;
  });
}

function isFishSpeciesEligibleForGravelPebble(species) {
  return Boolean(species) && species.behavior !== "sucker" && species.behavior !== "shrimp";
}

function isFishEligibleForGravelPebbleAction(fish, species, now = Date.now(), options = {}) {
  if (!canUseFishGravelPebblePlay() || !fish || !isFishSpeciesEligibleForGravelPebble(species) || isFishDead(fish)) {
    return false;
  }

  if (!(state?.fish || []).some((entry) => entry.id === fish.id)) {
    return false;
  }

  if (runtime.fishDragState?.fishId === fish.id || fish.caveState) {
    return false;
  }

  if (options.requireRoaming !== false && fish.activity !== "roam") {
    return false;
  }

  if (runtime.debugBreedingSequence) {
    const breedingFishIds = new Set([
      runtime.debugBreedingSequence.leftFishId,
      runtime.debugBreedingSequence.rightFishId
    ].filter(Boolean));
    if (breedingFishIds.has(fish.id)) {
      return false;
    }
  }

  if (Number.isFinite(fish.wallAvoidUntil) && now < fish.wallAvoidUntil) {
    return false;
  }

  return true;
}

function countActiveFishGravelPebbleActions(excludeFishId = null) {
  pruneFishGravelPebbleRuntimeState();
  let count = 0;
  for (const fishId of runtime.fishGravelPebbleActions.keys()) {
    if (excludeFishId && fishId === excludeFishId) {
      continue;
    }
    count += 1;
  }
  return count;
}

function hasFishGravelPebbleCandidate(now = Date.now()) {
  pruneFishGravelPebbleRuntimeState(now);
  return (state?.fish || []).some((fish) => {
    const species = getSpeciesForFish(fish);
    return isFishEligibleForGravelPebbleAction(fish, species, now);
  });
}

function pickFishGravelPebbleDebugCandidate(now = Date.now()) {
  pruneFishGravelPebbleRuntimeState(now);
  const selectedFish = state?.fish?.find((fish) => fish.id === runtime.selectedFishId) || null;
  const selectedSpecies = getSpeciesForFish(selectedFish);
  if (isFishEligibleForGravelPebbleAction(selectedFish, selectedSpecies, now)) {
    return selectedFish;
  }

  const candidates = (state?.fish || []).filter((fish) => {
    const species = getSpeciesForFish(fish);
    return isFishEligibleForGravelPebbleAction(fish, species, now);
  });
  if (!candidates.length) {
    return null;
  }

  return candidates[Math.floor(Math.random() * candidates.length)] || candidates[0];
}

function getFishGravelPebbleAction(fish) {
  return fish?.id ? runtime.fishGravelPebbleActions.get(fish.id) || null : null;
}

function getFishGravelPebbleMouthLocalPoint(width, height, pose) {
  return {
    x: width * 0.29 + (pose?.wiggle || 0) * width * 0.018,
    y: -height * 0.02
  };
}

function getFishGravelPebbleMouthPoint(fish, species, now = Date.now()) {
  if (!fish || !species) {
    return null;
  }

  const image = runtime.images.get(getFishAssetPath(fish, species) || species.asset);
  if (!image) {
    return null;
  }

  const pose = getFishPose(fish, species, now);
  const width = species.width * getFishEffectiveScale(fish, species, now);
  const height = width * (image.height / image.width);
  const localPoint = getFishGravelPebbleMouthLocalPoint(width, height, pose);
  const bodyScaleX = pose.bodyScaleX || 1;
  const bodyScaleY = pose.bodyScaleY || 1;
  const tilt = pose.tilt || 0;
  const facingScaleX = pose.facingScaleX ?? (pose.direction < 0 ? -1 : 1);
  return {
    x: pose.x + (pose.swayX || 0) + facingScaleX * (Math.cos(tilt) * bodyScaleX * localPoint.x - Math.sin(tilt) * bodyScaleY * localPoint.y),
    y: pose.y + Math.sin(tilt) * bodyScaleX * localPoint.x + Math.cos(tilt) * bodyScaleY * localPoint.y
  };
}

function clearFishGravelPebbleAction(fish, species, now = Date.now(), options = {}) {
  if (fish?.id) {
    runtime.fishGravelPebbleActions.delete(fish.id);
  }

  if (!fish || fish.activity !== FISH_GRAVEL_PEBBLE_ACTIVITY) {
    return;
  }

  fish.activity = "roam";
  fish.feedingPelletId = null;
  fish.hangoutDecorId = null;
  if (options.resetTarget === false) {
    return;
  }

  fish.targetXNorm = clamp(fish.xNorm + randomBetween(-0.12, 0.12), 0.08, 0.92);
  fish.targetYNorm = clamp(fish.yNorm + randomBetween(-0.06, 0.03), 0.2, 0.76);
  fish.targetAt = now + 900 + Math.random() * 1100;
  if (species) {
    fish.swimSpeed = normalizeFishSpeed(species);
  }
}

function clearAllFishGravelPebbleActions(now = Date.now()) {
  for (const fish of state?.fish || []) {
    clearFishGravelPebbleAction(fish, getSpeciesForFish(fish), now);
  }
  runtime.fishGravelPebbleActions.clear();
}

function createFishGravelPebbleAction(fish, species, now = Date.now()) {
  const pebbleAssets = getCustomGravelLoosePebbleAssets();
  if (!pebbleAssets.length) {
    return null;
  }

  const colors = getActiveCustomGravelLayerColors();
  const pebbleAsset = pebbleAssets[Math.floor(Math.random() * pebbleAssets.length)] || pebbleAssets[0];
  const color = colors[Math.floor(Math.random() * colors.length)] || DEFAULT_CUSTOM_GRAVEL_LAYER_COLOR;
  const pickupXNorm = clamp(fish.xNorm + randomBetween(-0.12, 0.12), 0.1, 0.9);
  const pickupX = pickupXNorm * TANK_WIDTH;
  const pickupSurfaceY = getTankFloorMaskSurfaceYAtX(pickupX);
  const pickupYNorm = clamp(
    (pickupSurfaceY - randomBetween(FISH_GRAVEL_PEBBLE_PICKUP_Y_OFFSET_MIN_PX, FISH_GRAVEL_PEBBLE_PICKUP_Y_OFFSET_MAX_PX)) / TANK_HEIGHT,
    0.24,
    0.78
  );
  const carryTargetXNorm = clamp(pickupXNorm + randomBetween(-0.1, 0.1), 0.12, 0.88);
  const carryTargetYNorm = clamp(
    pickupYNorm - randomBetween(FISH_GRAVEL_PEBBLE_CARRY_RISE_MIN_NORM, FISH_GRAVEL_PEBBLE_CARRY_RISE_MAX_NORM),
    0.16,
    0.68
  );

  return {
    stage: "dive",
    assetPath: pebbleAsset.path,
    color,
    holdSizePx: randomBetween(FISH_GRAVEL_PEBBLE_HOLD_SIZE_MIN_PX, FISH_GRAVEL_PEBBLE_HOLD_SIZE_MAX_PX),
    pickupXNorm,
    pickupYNorm,
    carryTargetXNorm,
    carryTargetYNorm,
    startedAt: now
  };
}

function startFishGravelPebbleAction(fish, species, now = Date.now(), options = {}) {
  if (!isFishEligibleForGravelPebbleAction(fish, species, now)) {
    return false;
  }

  if (!options.force && countActiveFishGravelPebbleActions(fish.id) >= MAX_ACTIVE_FISH_GRAVEL_PEBBLE_ACTIONS) {
    return false;
  }

  const action = createFishGravelPebbleAction(fish, species, now);
  if (!action) {
    return false;
  }

  runtime.fishGravelPebbleActions.set(fish.id, action);
  fish.activity = FISH_GRAVEL_PEBBLE_ACTIVITY;
  fish.feedingPelletId = null;
  fish.hangoutDecorId = null;
  fish.panicUntil = null;
  fish.panicSpeedBoost = null;
  clearFishSchoolFollowState(fish);
  fish.targetXNorm = action.pickupXNorm;
  fish.targetYNorm = action.pickupYNorm;
  fish.targetAt = now + 5200;
  fish.swimSpeed = normalizeFishSpeed(
    species,
    randomBetween(Math.max(species.speedMin, species.speedMax * 0.72), species.speedMax)
  );
  setFishDesiredTankLayer(fish, getFishTankLayer(fish));
  if (Math.abs(fish.targetXNorm - fish.xNorm) > FISH_DIRECTION_TARGET_DEADZONE_NORM) {
    setFishDirection(fish, fish.targetXNorm >= fish.xNorm ? 1 : -1, species, now);
  }
  return true;
}

function maybeStartFishGravelPebbleAction(fish, species, now, deltaSeconds) {
  if (!isFishEligibleForGravelPebbleAction(fish, species, now) || countActiveFishGravelPebbleActions(fish.id) >= MAX_ACTIVE_FISH_GRAVEL_PEBBLE_ACTIONS) {
    return false;
  }

  const styleMultiplier = species.swimStyle === "sporadic"
    ? 1.2
    : species.swimStyle === "peaceful"
      ? 0.82
      : 1;
  const chance = deltaSeconds * FISH_GRAVEL_PEBBLE_CHANCE_PER_SECOND * styleMultiplier;
  if (Math.random() >= chance) {
    return false;
  }

  return startFishGravelPebbleAction(fish, species, now);
}

function spawnFishGravelPebbleToss(fish, species, action, now = Date.now()) {
  if (!fish || !species || !action?.assetPath || !action?.color) {
    return;
  }

  if (runtime.fishPebbleTosses.length >= MAX_ACTIVE_FISH_GRAVEL_PEBBLE_TOSSES) {
    runtime.fishPebbleTosses.shift();
  }

  const mouthPoint = getFishGravelPebbleMouthPoint(fish, species, now);
  if (!mouthPoint) {
    return;
  }

  const landingX = clamp(mouthPoint.x + randomBetween(-56, 56), GLASS_MARGIN_X + 10, TANK_WIDTH - GLASS_MARGIN_X - 10);
  const landingY = getTankFloorMaskSurfaceYAtX(landingX) + randomBetween(4, 12);
  runtime.fishPebbleTosses.push({
    id: createId("fish-gravel-pebble"),
    fishId: fish.id,
    assetPath: action.assetPath,
    color: action.color,
    sizePx: action.holdSizePx,
    startX: mouthPoint.x,
    startY: mouthPoint.y,
    endX: landingX,
    endY: landingY,
    sway: Math.random(),
    driftAmplitudePx: randomBetween(12, 24),
    arcLiftPx: randomBetween(18, 34),
    rotation: randomBetween(-Math.PI, Math.PI),
    spin: randomBetween(-0.85, 0.85),
    startedAt: now,
    durationMs: 2800 + Math.hypot(landingX - mouthPoint.x, landingY - mouthPoint.y) * 2.2
  });
}

function updateFishGravelPebbleAction(fish, species, now = Date.now()) {
  const action = getFishGravelPebbleAction(fish);
  if (!action) {
    if (fish?.activity === FISH_GRAVEL_PEBBLE_ACTIVITY) {
      clearFishGravelPebbleAction(fish, species, now);
    }
    return false;
  }

  if (!canUseFishGravelPebblePlay() || !isFishSpeciesEligibleForGravelPebble(species) || isFishDead(fish)) {
    clearFishGravelPebbleAction(fish, species, now);
    return false;
  }

  if (now - action.startedAt > 12000) {
    clearFishGravelPebbleAction(fish, species, now);
    return false;
  }

  fish.activity = FISH_GRAVEL_PEBBLE_ACTIVITY;
  fish.feedingPelletId = null;
  fish.hangoutDecorId = null;

  if (action.stage === "dive") {
    fish.targetXNorm = action.pickupXNorm;
    fish.targetYNorm = action.pickupYNorm;
    fish.targetAt = now + 2600;
    if (Math.hypot(fish.xNorm - action.pickupXNorm, fish.yNorm - action.pickupYNorm) <= FISH_GRAVEL_PEBBLE_PICKUP_REACHED_DISTANCE_NORM) {
      action.stage = "carry";
      fish.targetXNorm = action.carryTargetXNorm;
      fish.targetYNorm = action.carryTargetYNorm;
      fish.targetAt = now + 3000;
    }
  } else if (action.stage === "carry") {
    fish.targetXNorm = action.carryTargetXNorm;
    fish.targetYNorm = action.carryTargetYNorm;
    fish.targetAt = now + 2400;
    if (Math.hypot(fish.xNorm - action.carryTargetXNorm, fish.yNorm - action.carryTargetYNorm) <= FISH_GRAVEL_PEBBLE_SPIT_REACHED_DISTANCE_NORM) {
      spawnFishGravelPebbleToss(fish, species, action, now);
      clearFishGravelPebbleAction(fish, species, now);
      return false;
    }
  } else {
    clearFishGravelPebbleAction(fish, species, now);
    return false;
  }

  if (Math.abs(fish.targetXNorm - fish.xNorm) > FISH_DIRECTION_TARGET_DEADZONE_NORM) {
    setFishDirection(fish, fish.targetXNorm >= fish.xNorm ? 1 : -1, species, now);
  }

  return true;
}

function updateFishPebbleTosses(now = Date.now()) {
  pruneFishGravelPebbleRuntimeState(now);
}

function getFishPebbleTossPose(toss, now = Date.now()) {
  const progress = clamp((now - toss.startedAt) / Math.max(1, toss.durationMs), 0, 1);
  const horizontalProgress = 1 - Math.pow(1 - progress, 1.45);
  const verticalProgress = Math.pow(progress, 1.8);
  const sway = Math.sin(progress * Math.PI * 2.4 + toss.sway * Math.PI * 2) * toss.driftAmplitudePx * (0.86 - progress * 0.22);
  const flutterY = Math.sin(progress * Math.PI * 3.2 + toss.sway * Math.PI * 4) * (1 - progress) * 2.6;
  return {
    x: toss.startX + (toss.endX - toss.startX) * horizontalProgress + sway,
    y: toss.startY + (toss.endY - toss.startY) * verticalProgress - Math.sin(progress * Math.PI) * toss.arcLiftPx + flutterY,
    rotation: toss.rotation + toss.spin * horizontalProgress,
    alpha: 1
  };
}

function getFishSchoolFollowLeader(fish) {
  if (!fish?.followFishId) {
    return null;
  }

  return state.fish.find((entry) => entry.id === fish.followFishId) || null;
}

function isFishEligibleSchoolLeader(leader, follower, species, now = Date.now()) {
  if (
    !leader ||
    !follower ||
    leader.id === follower.id ||
    leader.speciesId !== follower.speciesId ||
    isFishDead(leader) ||
    leader.activity !== "roam" ||
    leader.caveState ||
    leader.entryStartedAt ||
    isFishSickOrDying(leader)
  ) {
    return false;
  }

  if (Number.isFinite(leader.followUntil) && now < leader.followUntil && leader.followFishId === follower.id) {
    return false;
  }

  if (species?.behavior === "sucker") {
    return false;
  }

  return true;
}

function getFishSchoolFollowAnchor(fish, leader) {
  if (!fish || !leader) {
    return null;
  }

  const leaderDirection = Number(leader.direction) < 0 ? -1 : 1;
  const spacingNorm = clamp(
    (Math.max(80, getFishVisualSize(fish)) + Math.max(80, getFishVisualSize(leader))) / TANK_WIDTH * 0.2,
    SAME_SPECIES_FOLLOW_SPACING_MIN_NORM,
    SAME_SPECIES_FOLLOW_SPACING_MAX_NORM
  );
  const leadBlend = clamp(
    Math.hypot(
      (Number(leader.targetXNorm) || leader.xNorm) - leader.xNorm,
      (Number(leader.targetYNorm) || leader.yNorm) - leader.yNorm
    ) * 2.8,
    0.12,
    0.42
  );
  const anchorXNorm = leader.xNorm + ((Number(leader.targetXNorm) || leader.xNorm) - leader.xNorm) * leadBlend;
  const anchorYNorm = leader.yNorm + ((Number(leader.targetYNorm) || leader.yNorm) - leader.yNorm) * leadBlend;
  const offsetXNorm = Number.isFinite(fish.followOffsetXNorm)
    ? Number(fish.followOffsetXNorm)
    : clamp(
      -leaderDirection * spacingNorm + randomBetween(-0.012, 0.012),
      -SAME_SPECIES_FOLLOW_SPACING_MAX_NORM,
      SAME_SPECIES_FOLLOW_SPACING_MAX_NORM
    );
  const offsetYNorm = Number.isFinite(fish.followOffsetYNorm)
    ? Number(fish.followOffsetYNorm)
    : randomBetween(-SAME_SPECIES_FOLLOW_VERTICAL_JITTER_NORM, SAME_SPECIES_FOLLOW_VERTICAL_JITTER_NORM);

  return {
    xNorm: clamp(anchorXNorm + offsetXNorm, 0.08, 0.92),
    yNorm: clamp(anchorYNorm + offsetYNorm, 0.14, 0.8),
    targetLayer: clampTankLayer(getFishTankLayer(leader)),
    offsetXNorm,
    offsetYNorm
  };
}

function updateFishSchoolFollowTarget(fish, species, now = Date.now()) {
  if (
    !fish ||
    !species ||
    species.behavior === "sucker" ||
    fish.activity !== "roam" ||
    fish.caveState ||
    !Number.isFinite(fish.followUntil) ||
    now >= fish.followUntil
  ) {
    clearFishSchoolFollowState(fish);
    return false;
  }

  const leader = getFishSchoolFollowLeader(fish);
  if (!isFishEligibleSchoolLeader(leader, fish, species, now)) {
    clearFishSchoolFollowState(fish);
    return false;
  }

  const anchor = getFishSchoolFollowAnchor(fish, leader);
  if (!anchor) {
    clearFishSchoolFollowState(fish);
    return false;
  }

  fish.targetXNorm = anchor.xNorm;
  fish.targetYNorm = anchor.yNorm;
  fish.targetAt = Math.max(now + 500, fish.followUntil);
  setFishDesiredTankLayer(fish, anchor.targetLayer);
  return true;
}

function pickSameSpeciesFollowTarget(fish, species, now = Date.now()) {
  if (
    !fish ||
    !species ||
    species.behavior === "sucker" ||
    fish.activity !== "roam" ||
    fish.caveState ||
    isFishSickOrDying(fish)
  ) {
    return null;
  }

  const nearbySchoolmates = state.fish
    .filter((otherFish) => isFishEligibleSchoolLeader(otherFish, fish, species, now))
    .map((otherFish) => ({
      fish: otherFish,
      distanceNorm: Math.hypot(otherFish.xNorm - fish.xNorm, otherFish.yNorm - fish.yNorm)
    }))
    .filter((entry) => entry.distanceNorm <= SAME_SPECIES_FOLLOW_RADIUS_NORM)
    .sort((left, right) => left.distanceNorm - right.distanceNorm);

  if (!nearbySchoolmates.length) {
    return null;
  }

  const followChance = clamp(
    SAME_SPECIES_FOLLOW_BASE_CHANCE + Math.max(0, nearbySchoolmates.length - 1) * SAME_SPECIES_FOLLOW_NEIGHBOR_BONUS,
    0,
    SAME_SPECIES_FOLLOW_MAX_CHANCE
  );
  if (Math.random() > followChance) {
    return null;
  }

  const leaderPool = nearbySchoolmates.slice(0, Math.min(4, nearbySchoolmates.length));
  const leaderIndex = Math.min(
    leaderPool.length - 1,
    Math.floor(Math.pow(Math.random(), 1.35) * leaderPool.length)
  );
  const leader = leaderPool[leaderIndex]?.fish || null;
  if (!leader) {
    return null;
  }

  const followUntil = now + randomBetween(SAME_SPECIES_FOLLOW_MIN_MS, SAME_SPECIES_FOLLOW_MAX_MS);
  fish.followFishId = leader.id;
  fish.followUntil = followUntil;
  fish.followOffsetXNorm = null;
  fish.followOffsetYNorm = null;
  const anchor = getFishSchoolFollowAnchor(fish, leader);
  if (!anchor) {
    clearFishSchoolFollowState(fish);
    return null;
  }

  fish.followOffsetXNorm = anchor.offsetXNorm;
  fish.followOffsetYNorm = anchor.offsetYNorm;

  return {
    leaderId: leader.id,
    xNorm: anchor.xNorm,
    yNorm: anchor.yNorm,
    targetLayer: anchor.targetLayer,
    lingerMs: followUntil - now
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
  const shouldRebase = !alreadyDead && state.fish.some((entry) => entry.id === fish.id);
  const previousDirtiness = shouldRebase ? getBaseTankDirtiness(now) : null;
  fish.deadAt = alreadyDead && Number.isFinite(fish.deadAt) ? fish.deadAt : now;
  fish.healthUnits = 0;
  fish.fedStreak = 0;
  fish.comfortDamageProgressMs = 0;
  clearFishSchoolFollowState(fish);

  const pelletId = fish.feedingPelletId;
  const species = runtime.fishMap.get(fish.speciesId);
  if (runtime.debugForcedCaveFishId === fish.id) {
    clearDebugCaveTestSelection();
  }
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

  if (shouldRebase) {
    rebaseTankDirtiness(now, previousDirtiness);
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

  const { fish, inStorage } = managed;
  const now = Date.now();
  const nextScale = clamp(fish.scale + direction * SIZE_STEP, FISH_SCALE_MIN, FISH_SCALE_MAX);
  if (Math.abs(nextScale - fish.scale) < 0.0001) {
    return;
  }

  if (inStorage) {
    fish.scale = nextScale;
  } else {
    preserveTankDirtinessThroughChange(now, () => {
      fish.scale = nextScale;
    });
  }
  saveState();
  renderUi(now);
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

function setCustomGravelEnabled(enabled) {
  if (!hasReadyCustomGravelLayers()) {
    return;
  }

  const nextEnabled = Boolean(enabled);
  if (state.customGravelEnabled === nextEnabled) {
    return;
  }

  state.customGravelEnabled = nextEnabled;
  if (!nextEnabled) {
    clearAllFishGravelPebbleActions(Date.now());
  }
  saveState();
  renderUi(Date.now());
}

function setCustomGravelLayerColor(layerIndex, color) {
  const normalizedColor = normalizeHexColor(color);
  if (!normalizedColor || !Number.isFinite(layerIndex)) {
    return;
  }

  const nextIndex = clamp(Math.floor(layerIndex), 0, CUSTOM_GRAVEL_LAYER_COUNT - 1);
  const nextColors = getActiveCustomGravelLayerColors();
  if (nextColors[nextIndex] === normalizedColor) {
    return;
  }

  nextColors[nextIndex] = normalizedColor;
  state.customGravelLayerColors = nextColors;
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

  if (!isFilterOwned(filterKey)) {
    showToast("Buy this filter in the equipment shop first.");
    return;
  }

  if (state.selectedFilterAsset === filterKey) {
    return;
  }

  const now = Date.now();
  preserveTankDirtinessThroughChange(now, () => {
    state.selectedFilterAsset = filterKey;
  });
  const filter = runtime.filterMap.get(filterKey);
  pushEvent(
    `Equipped ${filter.name}. At the current tank load, the tank now takes about ${formatDuration(getFilterMaxDirtyDurationMs(filterKey))} to hit maximum dirtiness.`,
    now
  );
  saveState();
  renderUi(now);
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

function toggleCleaningMode(options = {}) {
  const nextMode = !runtime.cleaningMode;
  clearPrimaryToolModes();

  if (nextMode) {
    runtime.cleaningMode = true;
    runtime.toolModeSource = options.source || "toolbar";
    if (options.collapseSidebar) {
      runtime.sidebarCollapsed = true;
    }
  }

  renderToolCursor();
  renderUi(Date.now());
}

function toggleScoopMode(options = {}) {
  const nextMode = !runtime.scoopMode;
  clearPrimaryToolModes();

  if (nextMode) {
    runtime.scoopMode = true;
    runtime.toolModeSource = options.source || "toolbar";
    if (options.collapseSidebar) {
      runtime.sidebarCollapsed = true;
    }
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

  const targetBaseDirtiness = clamp(currentBaseDirtiness + 0.1, 0, 1);
  rebaseTankDirtiness(now, targetBaseDirtiness);
  const livingFish = getLivingTankFish();
  const desiredPoopCount = livingFish.length
    ? Math.max(state.poops.length, Math.min(28, Math.ceil(livingFish.length * (1.2 + targetBaseDirtiness * 1.6))))
    : state.poops.length;

  for (let index = state.poops.length; index < desiredPoopCount; index += 1) {
    const fish = livingFish[index % livingFish.length] || null;
    const xNorm = fish
      ? clamp((fish.xNorm || 0.5) + randomBetween(-0.08, 0.08), 0.08, 0.92)
      : clamp(0.09 + (index / Math.max(1, desiredPoopCount - 1)) * 0.82 + randomBetween(-0.02, 0.02), 0.08, 0.92);
    state.poops.push(createPoopRecord({
      fishId: fish?.id || "",
      createdAt: now - randomBetween(POOP_FALL_MS * 0.6, POOP_FALL_MS + 7 * 60 * 1000),
      xNorm,
      startYNorm: fish ? clamp((fish.yNorm || 0.5) + 0.04, 0.14, 0.8) : randomSwimY()
    }));
  }

  runtime.cleaningTransition = null;
  runtime.cleaningMode = false;
  runtime.toolModeSource = null;
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

function restoreAllFishHealthDebug() {
  const now = Date.now();
  let healedCount = 0;

  for (const fish of [...state.fish, ...state.storedFish]) {
    if (!fish || isFishDead(fish)) {
      continue;
    }

    const maxHealthUnits = getFishMaxHealthUnits(fish);
    const nextHealthUnits = clamp(maxHealthUnits, 0, maxHealthUnits);
    const nextComfortDamageProgressMs = 0;
    const nextMissedMealsInRow = 0;
    const nextFedStreak = 0;
    const changed = fish.healthUnits !== nextHealthUnits
      || (Number(fish.comfortDamageProgressMs) || 0) !== nextComfortDamageProgressMs
      || (Number(fish.missedMealsInRow) || 0) !== nextMissedMealsInRow
      || (Number(fish.fedStreak) || 0) !== nextFedStreak;

    fish.healthUnits = nextHealthUnits;
    fish.comfortDamageProgressMs = nextComfortDamageProgressMs;
    fish.missedMealsInRow = nextMissedMealsInRow;
    fish.fedStreak = nextFedStreak;

    if (changed) {
      healedCount += 1;
    }
  }

  if (!healedCount) {
    showToast("All living fish are already at full health.");
    return;
  }

  pushEvent(`Debug health reset restored ${healedCount} ${pluralize("fish", healedCount)} to full hearts.`, now);
  saveState();
  renderUi(now);
  showToast(`Full hearts restored for ${healedCount} ${pluralize("fish", healedCount)}.`);
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

function triggerDebugGravelPebbleTest() {
  const now = Date.now();
  if (!canUseFishGravelPebblePlay()) {
    showToast("Enable Custom Gravel Test to use the gravel pebble debug.");
    return;
  }

  const fish = pickFishGravelPebbleDebugCandidate(now);
  if (!fish) {
    showToast("Keep a living non-sucker fish in the tank to test gravel pebble play.");
    return;
  }

  const species = getSpeciesForFish(fish);
  if (!species) {
    return;
  }

  clearAllFishGravelPebbleActions(now);
  if (!startFishGravelPebbleAction(fish, species, now, { force: true })) {
    showToast("That fish could not start a gravel pebble test right now.");
    return;
  }

  runtime.selectedFishId = fish.id;
  pushEvent(`Debug sent ${fish.name} to toss a gravel pebble.`, now);
  renderUi(now);
  showToast(`${fish.name} is heading down to grab a pebble.`);
}

function isDebugCaveTestFish(fish) {
  return Boolean(runtime.debugNightCaveMode && fish?.id && runtime.debugForcedCaveFishId === fish.id);
}

function clearDebugCaveTestSelection() {
  runtime.debugForcedCaveFishId = null;
  runtime.debugForcedCaveDecorId = null;
}

function buildDebugFallbackCavePathNodes(item, mouthPoint, insidePoint) {
  if (!item || !mouthPoint || !insidePoint) {
    return [];
  }

  const nodes = [];
  for (const t of [0.35, 0.68, 1]) {
    const point = {
      xNorm: mouthPoint.xNorm + (insidePoint.xNorm - mouthPoint.xNorm) * t,
      yNorm: mouthPoint.yNorm + (insidePoint.yNorm - mouthPoint.yNorm) * t
    };
    if (t < 1 && !isPointInsideCaveInteriorDescriptor(item, point)) {
      continue;
    }
    nodes.push(point);
  }

  if (!nodes.length) {
    nodes.push({ ...insidePoint });
  }

  const lastNode = nodes[nodes.length - 1];
  if (Math.hypot(lastNode.xNorm - insidePoint.xNorm, lastNode.yNorm - insidePoint.yNorm) > 0.0005) {
    nodes.push({ ...insidePoint });
  }

  return nodes;
}

function buildDebugFallbackCavePlan(item, fish, now = Date.now()) {
  if (!item || !fish) {
    return null;
  }

  const species = getSpeciesForFish(fish);
  if (!species || species.behavior === "sucker" || species.caveEnabled === false) {
    return null;
  }

  const triggerRegions = getCaveTriggerRegions(item);
  const seatRegions = getCaveSeatRegions(item);
  if (!triggerRegions.length || !seatRegions.length) {
    return null;
  }

  const trigger = [...triggerRegions]
    .sort((left, right) => Math.hypot(left.xNorm - fish.xNorm, left.yNorm - fish.yNorm) - Math.hypot(right.xNorm - fish.xNorm, right.yNorm - fish.yNorm))[0];
  const seat = [...seatRegions]
    .sort((left, right) => Math.hypot(left.xNorm - trigger.xNorm, left.yNorm - trigger.yNorm) - Math.hypot(right.xNorm - trigger.xNorm, right.yNorm - trigger.yNorm))[0];
  if (!trigger || !seat) {
    return null;
  }

  const profile = getCaveBehaviorProfile(item.decorKey);
  const matchedPortal = Array.isArray(profile?.portals)
    ? profile.portals
      .map((portal) => {
        const mouth = mapDecorLocalPointToTankNorm(item, portal.mouthX, portal.mouthY);
        const approach = mapDecorLocalPointToTankNorm(item, portal.approachX, portal.approachY);
        if (!mouth || !approach) {
          return null;
        }

        return {
          portal,
          mouth,
          approach,
          score: Math.hypot(mouth.xNorm - trigger.xNorm, mouth.yNorm - trigger.yNorm)
        };
      })
      .filter(Boolean)
      .sort((left, right) => left.score - right.score)[0]
    : null;

  const approach = matchedPortal?.approach || {
    xNorm: trigger.xNorm,
    yNorm: clamp(trigger.yNorm + 0.08, 0.14, 0.8)
  };
  const mouth = matchedPortal?.mouth || {
    xNorm: trigger.xNorm,
    yNorm: trigger.yNorm
  };
  const inside = pickCaveSeatIdleTarget(item, seat, fish, species, now) || {
    xNorm: seat.xNorm,
    yNorm: seat.yNorm
  };
  const entryPathNodes = buildDebugFallbackCavePathNodes(item, mouth, inside);
  const exitPathNodes = entryPathNodes.slice().reverse();
  const currentLayer = getFishTankLayer(fish);
  const frontLayer = clampTankLayer(matchedPortal?.portal?.outsideLayer || (CAVE_ALLOWED_OUTSIDE_LAYERS.includes(currentLayer) ? currentLayer : 2));
  const backLayer = clampTankLayer(matchedPortal?.portal?.insideLayer || profile?.insideLayer || 4);

  return {
    decorId: item.id,
    portalId: matchedPortal?.portal?.id || trigger.id,
    triggerId: trigger.id,
    seatId: seat.id,
    frontLayer,
    backLayer,
    approach,
    mouth,
    inside,
    entryPathNodes,
    exitPathNodes,
    lingerMs: Math.max(CAVE_TRIGGER_COOLDOWN_MS + 3000, Number(profile?.lingerMinMs) || 14000),
    score: Math.hypot(fish.xNorm - trigger.xNorm, fish.yNorm - trigger.yNorm),
    debugForced: true
  };
}

function collectDebugCaveTestPlansForFish(fish, now = Date.now(), options = {}) {
  const normalPlans = collectCaveBehaviorPlansForFish(fish, now, options);
  if (normalPlans.length) {
    return normalPlans;
  }

  const ignoreBlockedDecor = options.ignoreBlockedDecor === true;
  return state.placedDecor
    .filter((item) => isCaveDecorKey(item.decorKey))
    .filter((item) => !(
      !ignoreBlockedDecor &&
      fish.blockedDecorId &&
      item.id === fish.blockedDecorId &&
      Number.isFinite(fish.blockedDecorUntil) &&
      now < fish.blockedDecorUntil
    ))
    .map((item) => buildDebugFallbackCavePlan(item, fish, now))
    .filter(Boolean)
    .sort((left, right) => left.score - right.score);
}

function getDebugCaveTestAssignment(now = Date.now(), options = {}) {
  if (!runtime.debugNightCaveMode) {
    return null;
  }

  const ignoreBlockedDecor = options.ignoreBlockedDecor !== false;
  const activelyDraggedFishId = runtime.fishDragState?.fishId || null;
  const buildCandidate = (fish) => {
    if (!fish || fish.id === activelyDraggedFishId || isFishDead(fish)) {
      return null;
    }

    const species = runtime.fishMap.get(fish.speciesId);
    if (!species || species.behavior === "sucker" || species.caveEnabled === false) {
      return null;
    }

    let plans = collectDebugCaveTestPlansForFish(fish, now, { ignoreBlockedDecor });
    if (runtime.debugForcedCaveDecorId) {
      plans = plans.filter((plan) => plan.decorId === runtime.debugForcedCaveDecorId);
    }
    if (!plans.length) {
      return null;
    }

    return { fish, species, plans };
  };

  const currentFish = state.fish.find((fish) => fish.id === runtime.debugForcedCaveFishId);
  const currentCandidate = buildCandidate(currentFish);
  if (currentCandidate) {
    return currentCandidate;
  }

  clearDebugCaveTestSelection();

  const candidates = state.fish
    .map((fish) => buildCandidate(fish))
    .filter(Boolean);
  if (!candidates.length) {
    return null;
  }

  const chosen = candidates[Math.floor(Math.random() * candidates.length)];
  const chosenPlan = chosen.plans[Math.floor(Math.random() * chosen.plans.length)];
  runtime.debugForcedCaveFishId = chosen.fish.id;
  runtime.debugForcedCaveDecorId = chosenPlan.decorId;
  return {
    fish: chosen.fish,
    species: chosen.species,
    plans: chosen.plans.filter((plan) => plan.decorId === chosenPlan.decorId)
  };
}

function startDebugCaveLoopCycle(now = Date.now(), options = {}) {
  const { silentFailure = false, suppressEvent = false } = options;
  const assignment = getDebugCaveTestAssignment(now, { ignoreBlockedDecor: true });
  if (!assignment?.plans?.length) {
    if (!silentFailure) {
      showToast("Add a cave and a cave-enabled living fish to test cave behavior.");
    }
    return null;
  }

  const fish = assignment.fish;
  const plan = assignment.plans[Math.floor(Math.random() * assignment.plans.length)];
  const decor = state.placedDecor.find((item) => item.id === plan.decorId);
  const decorName = decor ? (runtime.decorMap.get(decor.decorKey)?.name || titleFromFile(decor.decorKey)) : "the cave";

  fish.activity = "roam";
  fish.feedingPelletId = null;
  fish.blockedDecorId = null;
  fish.blockedDecorUntil = null;
  fish.caveTriggerCooldownUntil = null;
  clearFishCaveBehavior(fish);
  fish.hangoutDecorId = null;
  fish.targetAt = now;
  state.floatingPellets = state.floatingPellets.filter((pellet) => pellet.targetFishId !== fish.id);

  if (assignment.species.speedMode === "dynamic") {
    fish.swimSpeed = normalizeFishSpeed(assignment.species);
  }

  beginFishCaveBehavior(fish, plan, now);
  runtime.selectedFishId = fish.id;

  if (!suppressEvent) {
    pushEvent(`Debug sent ${fish.name} to test ${decorName}.`, now);
  }

  return `${fish.name} is testing ${decorName}.`;
}

function toggleDebugNightCaveMode() {
  const now = Date.now();
  runtime.debugNightCaveMode = !runtime.debugNightCaveMode;

  if (runtime.debugNightCaveMode) {
    clearDebugCaveTestSelection();
    const immediateCaveToast = startDebugCaveLoopCycle(now, { silentFailure: true, suppressEvent: true });
    pushEvent("Debug cave test loop enabled.", now);
    showToast(immediateCaveToast || "Cave test loop enabled, but no cave test assignment was found yet.");
  } else {
    const debugFish = state.fish.find((fish) => fish.id === runtime.debugForcedCaveFishId) || null;
    clearDebugCaveTestSelection();
    if (debugFish?.caveState) {
      abortFishCaveBehavior(debugFish, now, false);
      debugFish.targetAt = now;
    }
    pushEvent("Debug cave test loop disabled.", now);
    showToast("Cave test loop disabled.");
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
  runtime.fishGravelPebbleActions.clear();
  runtime.fishPebbleTosses = [];
  runtime.bettaPassLocks.clear();
  runtime.debugBreedingSequence = null;
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
  renderScrubProgress();

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

  const stamp = {
    x: scrubX,
    y: scrubY,
    radius: SCRUB_BRUSH_RADIUS * (0.92 + Math.random() * 0.1)
  };
  runtime.scrubStamps.push(stamp);
  paintScrubMaskStamp(stamp);
  if (runtime.scrubStamps.length > 900) {
    runtime.scrubStamps.splice(0, runtime.scrubStamps.length - 900);
    rebuildScrubMaskCanvas();
  }

  return changed;
}

function completeCleaning() {
  const now = Date.now();
  const fromDirtiness = getBaseTankDirtiness(now);
  state.lastCleanedAt = now;
  state.poops = [];
  if (!getDeadTankFish().length) {
    resetLivingFishComfortDamageProgress();
  }
  runtime.cleaningTransition = {
    startedAt: now,
    fadeEndsAt: now + CLEAN_FADE_MS,
    sparkleEndsAt: now + CLEAN_FADE_MS + CLEAN_SPARKLE_MS,
    fromDirtiness,
    sparkles: createCleaningSparkles()
  };
  runtime.cleaningMode = false;
  runtime.toolModeSource = null;
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
  if (scrubMaskContext) {
    scrubMaskContext.clearRect(0, 0, TANK_WIDTH, TANK_HEIGHT);
  }
  renderScrubProgress();
}

function getScrubCoverage() {
  return runtime.scrubbedCount / runtime.scrubCells.length;
}

function paintScrubMaskStamp(stamp) {
  if (!scrubMaskContext || !stamp) {
    return;
  }

  const gradient = scrubMaskContext.createRadialGradient(
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
  scrubMaskContext.fillStyle = gradient;
  scrubMaskContext.beginPath();
  scrubMaskContext.arc(stamp.x, stamp.y, stamp.radius, 0, Math.PI * 2);
  scrubMaskContext.fill();
}

function rebuildScrubMaskCanvas() {
  if (!scrubMaskContext) {
    return;
  }

  scrubMaskContext.clearRect(0, 0, TANK_WIDTH, TANK_HEIGHT);
  for (const stamp of runtime.scrubStamps) {
    paintScrubMaskStamp(stamp);
  }
}

function getGrimeBaseCacheKey(dirtiness) {
  return String(Math.round(getVisibleGrimeDirtiness(dirtiness) * GRIME_CACHE_PRECISION));
}

function getVisibleGrimeDirtiness(dirtiness) {
  const normalizedDirtiness = clamp(Number(dirtiness) || 0, 0, 1);
  return clamp(
    (normalizedDirtiness - GRIME_VISUAL_START_DIRTINESS) / Math.max(0.001, 1 - GRIME_VISUAL_START_DIRTINESS),
    0,
    1
  );
}

function getLightGrimeVisualIntensity(dirtiness) {
  return Math.pow(getVisibleGrimeDirtiness(dirtiness), 1.35);
}

function getSevereGrimeVisualIntensity(dirtiness) {
  const normalizedDirtiness = getVisibleGrimeDirtiness(dirtiness);
  return clamp(
    (normalizedDirtiness - SEVERE_GRIME_VISUAL_THRESHOLD) / Math.max(0.001, 1 - SEVERE_GRIME_VISUAL_THRESHOLD),
    0,
    1
  );
}

function renderGrimeBaseCanvas(dirtiness) {
  if (!grimeBaseContext) {
    return;
  }

  const lightGrime = getLightGrimeVisualIntensity(dirtiness);
  const severeGrime = getSevereGrimeVisualIntensity(dirtiness);
  grimeBaseContext.clearRect(0, 0, TANK_WIDTH, TANK_HEIGHT);
  grimeBaseContext.save();
  grimeBaseContext.beginPath();
  grimeBaseContext.rect(GLASS_MARGIN_X, WATER_SURFACE_Y, TANK_WIDTH - GLASS_MARGIN_X * 2, TANK_HEIGHT - WATER_SURFACE_Y - GLASS_MARGIN_BOTTOM);
  grimeBaseContext.clip();
  grimeBaseContext.fillStyle = `rgba(108, 148, 74, ${(lightGrime * 0.16 + severeGrime * 0.18).toFixed(3)})`;
  grimeBaseContext.fillRect(0, 0, TANK_WIDTH, TANK_HEIGHT);

  const murkGradient = grimeBaseContext.createLinearGradient(0, WATER_SURFACE_Y, 0, TANK_HEIGHT);
  murkGradient.addColorStop(0, `rgba(170, 210, 78, ${(lightGrime * 0.05 + severeGrime * 0.26).toFixed(3)})`);
  murkGradient.addColorStop(0.18, `rgba(132, 171, 58, ${(lightGrime * 0.07 + severeGrime * 0.28).toFixed(3)})`);
  murkGradient.addColorStop(0.62, `rgba(74, 100, 36, ${(lightGrime * 0.06 + severeGrime * 0.2).toFixed(3)})`);
  murkGradient.addColorStop(1, `rgba(32, 44, 20, ${(lightGrime * 0.02 + severeGrime * 0.16).toFixed(3)})`);
  grimeBaseContext.fillStyle = murkGradient;
  grimeBaseContext.fillRect(0, 0, TANK_WIDTH, TANK_HEIGHT);

  const grimeMarks = runtime.scene?.grimeMarks || [];
  const visibleMarkCount = Math.min(grimeMarks.length, Math.floor(lightGrime * grimeMarks.length));
  grimeBaseContext.globalAlpha = lightGrime * 0.22 + severeGrime * 0.14;
  grimeBaseContext.filter = `blur(${4 + lightGrime * 12 + severeGrime * 20}px)`;
  for (let index = 0; index < visibleMarkCount; index += 1) {
    const mark = grimeMarks[index];
    if (!mark) {
      break;
    }
    grimeBaseContext.fillStyle = mark.color;
    grimeBaseContext.beginPath();
    grimeBaseContext.ellipse(mark.x * TANK_WIDTH, mark.y * TANK_HEIGHT, mark.rx, mark.ry, mark.rotation, 0, Math.PI * 2);
    grimeBaseContext.fill();
  }

  if (severeGrime > 0.01) {
    grimeBaseContext.globalAlpha = 0.08 + severeGrime * 0.3;
    grimeBaseContext.filter = `blur(${22 + severeGrime * 34}px)`;
    for (let index = 0; index < visibleMarkCount; index += 2) {
      const mark = grimeMarks[index];
      if (!mark) {
        break;
      }
      const cloudScale = 2.2 + severeGrime * 1.9;
      grimeBaseContext.fillStyle = index % 4 === 0
        ? "rgba(88, 130, 40, 0.74)"
        : "rgba(54, 84, 28, 0.76)";
      grimeBaseContext.beginPath();
      grimeBaseContext.ellipse(
        mark.x * TANK_WIDTH,
        mark.y * TANK_HEIGHT,
        mark.rx * cloudScale,
        mark.ry * cloudScale * 1.18,
        mark.rotation,
        0,
        Math.PI * 2
      );
      grimeBaseContext.fill();
    }
  }

  grimeBaseContext.filter = "none";
  const scumGlow = grimeBaseContext.createLinearGradient(0, WATER_SURFACE_Y, 0, WATER_SURFACE_Y + TANK_HEIGHT * 0.34);
  scumGlow.addColorStop(0, `rgba(224, 255, 166, ${(severeGrime * 0.22).toFixed(3)})`);
  scumGlow.addColorStop(0.42, `rgba(160, 205, 79, ${(severeGrime * 0.16).toFixed(3)})`);
  scumGlow.addColorStop(1, "rgba(160, 205, 79, 0)");
  grimeBaseContext.fillStyle = scumGlow;
  grimeBaseContext.fillRect(0, WATER_SURFACE_Y, TANK_WIDTH, TANK_HEIGHT - WATER_SURFACE_Y);

  const topGlow = grimeBaseContext.createLinearGradient(0, 0, 0, TANK_HEIGHT);
  topGlow.addColorStop(0, `rgba(236, 255, 223, ${(lightGrime * 0.08 + severeGrime * 0.12).toFixed(3)})`);
  topGlow.addColorStop(1, "rgba(236, 255, 223, 0)");
  grimeBaseContext.fillStyle = topGlow;
  grimeBaseContext.fillRect(0, 0, TANK_WIDTH, TANK_HEIGHT);
  grimeBaseContext.restore();
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
  renderHardwareAccelerationNotice();
  renderEditQuickRef();
  renderEditDecorTray();
  renderEditFishTray();
  renderFishInspector(now);
  renderControls(now);
  if (full) {
    renderFishShop();
    renderFishList(now);
    renderDecorShop();
    renderEquipmentShop();
    renderDecorInventory();
    renderPlacedDecor();
    renderBackgrounds();
    renderTankAssets();
    renderFilterAssets();
    renderGravelAssets();
    renderCustomGravelControls();
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

  setTextIfChanged(dom.coinCount, formatNumber(state.coins));
  setTextIfChanged(dom.cleanlinessLabel, `${cleanliness}%`);
  setTextIfChanged(dom.mealWindowLabel, `${servedToday} / 2`);

  const currentSlot = getCurrentMealSlot(now);
  if (dom.nextMealCountdownMirror) {
    setTextIfChanged(dom.nextMealCountdownMirror, `Next deadline in ${formatDuration(currentSlot.end - now)}`);
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
  const lowHealthCount = state.fish.filter((fish) => !isFishDead(fish) && fish.healthUnits < getFishMaxHealthUnits(fish)).length;
  const grimeLoad = Math.round((getTankFishDirtinessMultiplier() - 1) * 100);
  const maxDirtyIn = formatDuration(getFilterMaxDirtyDurationMs());

  const rows = [
    { label: "Fish in Tank", value: state.fish.filter((fish) => !isFishDead(fish)).length },
    { label: "Coin per meal", value: coinsPerMeal },
    { label: "Current Grime", value: `${Math.round(dirtiness * 100)}%` },
    { label: "Waste on floor", value: state.poops.length },
    { label: "Tank Grime Load", value: `+${grimeLoad}%` },
    { label: "Max Grime In", value: maxDirtyIn },
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

function renderFishShopIcons(icon, count, options = {}) {
  const safeCount = Math.max(0, Math.round(Number(count) || 0));
  if (safeCount <= 0) {
    return options.emptyLabel || "None";
  }

  const collapseAt = Math.max(1, Math.round(Number(options.collapseAt) || 5));
  if (safeCount > collapseAt) {
    return `${icon}x${safeCount}`;
  }

  return icon.repeat(safeCount);
}

function formatFishShopBehavior(species) {
  if (!species) {
    return "Steady";
  }

  if (species.behavior === "sucker") {
    return "Back-glass grazer";
  }

  if (species.behavior === "shrimp") {
    return "Micro scavenger";
  }

  if (species.diet === "detritus") {
    return "Detritus grazer";
  }

  return formatSwimStyle(species.swimStyle)
    .replace(/^./, (letter) => letter.toUpperCase());
}

function renderFishShop() {
  const markup = [...runtime.fishCatalog]
    .sort(compareFishCatalogBySize)
    .map((fish) => {
      const purchaseCost = getFishPurchaseCost(fish.id);
      const affordable = state.coins >= purchaseCost;
      const maxHealthUnits = getSpeciesMaxHealthUnits(fish);
      const heartCount = Math.ceil(maxHealthUnits / 2);
      const healthDisplay = renderFishShopIcons("❤️", heartCount, { collapseAt: 5 });
      const coinsDisplay = fish.diet === "detritus"
        ? "None"
        : renderFishShopIcons("🪙", fish.mealCoins, { collapseAt: 5 });
      const dirtinessLoadPercent = Math.round(getFishDirtinessBonus({ scale: getFishScaleDefault(fish.id) }, fish) * 100);
      return `
        <article class="shop-card">
          <img class="shop-thumb" src="${fish.asset}" alt="${fish.name}" />
          <div class="shop-meta shop-card-main">
            <div>
              <strong>${fish.name}</strong>
            </div>
            <div class="shop-stat-list">
              <div class="shop-stat-row"><span class="shop-stat-label">Health:</span><span class="shop-stat-value">${healthDisplay}</span></div>
              <div class="shop-stat-row"><span class="shop-stat-label">Coins Per Meal:</span><span class="shop-stat-value">${coinsDisplay}</span></div>
              <div class="shop-stat-row"><span class="shop-stat-label">Grime Multiplier:</span><span class="shop-stat-value">+${dirtinessLoadPercent}%</span></div>
              <div class="shop-stat-row"><span class="shop-stat-label">Behavior:</span><span class="shop-stat-value">${formatFishShopBehavior(fish)}</span></div>
            </div>
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
  const showingEquipment = runtime.storeTab === "equipment";

  dom.storeOverlay.hidden = !runtime.storeOverlayOpen;
  dom.storeOverlay.classList.toggle("is-open", runtime.storeOverlayOpen);

  dom.storeFishTab.classList.toggle("is-active", showingFish);
  dom.storeDecorTab.classList.toggle("is-active", showingDecor);
  dom.storeEquipmentTab?.classList.toggle("is-active", showingEquipment);

  dom.storeFishTab.setAttribute("aria-selected", String(showingFish));
  dom.storeDecorTab.setAttribute("aria-selected", String(showingDecor));
  dom.storeEquipmentTab?.setAttribute("aria-selected", String(showingEquipment));

  dom.storeCoinCounter.textContent = `🪙 ${formatNumber(state.coins)}`;

  dom.fishShop.hidden = !runtime.storeOverlayOpen || !showingFish;
  dom.decorShop.hidden = !runtime.storeOverlayOpen || !showingDecor;
  if (dom.equipmentShop) {
    dom.equipmentShop.hidden = !runtime.storeOverlayOpen || !showingEquipment;
  }
}

function renderHardwareAccelerationNotice() {
  if (!dom.hardwareAccelerationNotice) {
    return;
  }

  dom.hardwareAccelerationNotice.hidden = !runtime.hardwareAccelerationNoticeOpen;
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
              <img class="edit-decor-tile-thumb" src="${getFishAssetPath(fish, species) || species?.asset || ""}" alt="${label}" />
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
    state.selectedFilterAsset,
    state.fish.map((fish) => [
      fish.id,
      fish.name,
      fish.speciesId,
      fish.healthUnits,
      Number(fish.scale).toFixed(2),
      fish.acquiredAt,
      fish.growthEndsAt || "",
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
      fish.growthEndsAt || "",
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
      .sort((left, right) => getFishHealthRatio(left) - getFishHealthRatio(right) || left.healthUnits - right.healthUnits || left.acquiredAt - right.acquiredAt)
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
  const juvenile = !dead && isFishJuvenile(fish, now);
  const comfort = getFishComfort(fish, now);
  const age = formatFishAge(fish.acquiredAt, now);
  const defaultScale = getFishScaleDefault(fish.speciesId);
  const usesDefaultScale = Math.abs(defaultScale - fish.scale) < 0.001;
  const inStorage = Boolean(options.inStorage);
  const detritusFish = isDetritusFish(species);
  const maxHealthUnits = getFishMaxHealthUnits(fish, species);
  const criticalComfort = !inStorage && !dead && comfort.value <= 0;
  const currentSlot = options.currentSlot || getCurrentMealSlot(now);
  const currentFed = Boolean(options.currentFed);
  const hungry = !detritusFish && !currentFed && fish.acquiredAt <= currentSlot.start;
  const settling = fish.acquiredAt > currentSlot.start;
  const fishAsset = getFishAssetPath(fish, species) || species.asset;
  const status = inStorage
    ? (dead ? "Stored for disposal." : "Stored safely outside the tank.")
    : dead
      ? "Upside down at the surface."
      : criticalComfort
        ? getDeadTankFish().length
          ? "Panicking while a dead fish fouls the water."
          : "Tank conditions are dangerously filthy."
      : juvenile
        ? "Growing into full size."
      : detritusFish
        ? (species.behavior === "shrimp" ? "Picking through the lower water." : "Suctioned to the back glass.")
        : currentFed
            ? "Fed for this meal"
            : settling
              ? "Starts care next meal"
              : hungry
                ? "Hungry right now"
                : "Waiting";
  const healthNote = dead
    ? "Passed away. It no longer eats, poops, or earns coins."
    : criticalComfort
      ? getDeadTankFish().length
        ? "Comfort is 0% while a dead fish stays in the tank. Remove it fast."
        : "Comfort is 0% at maximum dirtiness. Clean the tank before health keeps dropping."
    : juvenile
      ? "Baby fish start at 25% size and grow to full size over a few days."
    : detritusFish
      ? (species.behavior === "shrimp"
        ? "Scavenges trace grime and waste instead of pellets."
        : "Feeds on grime and poop instead of pellets.")
        : fish.healthUnits < maxHealthUnits
          ? `Recovery streak: ${Math.min(fish.fedStreak, RECOVERY_FEED_STREAK)}/${RECOVERY_FEED_STREAK}`
          : "Full hearts and thriving.";
  const rewardLabel = dead
    ? "No meal coins"
    : detritusFish
      ? (species.behavior === "shrimp" ? "Tiny cleanup" : "Cleans tank")
      : `+${species.mealCoins} / meal`;
  const dirtinessLoadPercent = Math.round(getFishDirtinessBonus(fish, species) * 100);

  return `
    <article class="fish-card">
      <img class="fish-thumb" src="${fishAsset}" alt="${fish.name}" />
      <div class="fish-card-main">
        <div class="fish-card-heading">
          <div class="fish-card-title">
            <strong>${fish.name}</strong>
            <div class="fish-species">${species.name}</div>
          </div>
          ${dead ? `<button class="small-button warn" data-dispose-fish="${fish.id}" title="Dispose of ${fish.name}" aria-label="Dispose of ${fish.name}">&#128701;</button>` : ""}
        </div>
        <div class="hearts">${renderHearts(fish.healthUnits, maxHealthUnits)}</div>
        <div class="fish-status-line">${status}</div>
        <div class="fish-trait-row">
          <span class="fish-trait">${inStorage ? (dead ? "Status: Deceased" : "Storage") : dead ? "Status: Deceased" : `Comfort: ${comfort.label}`}</span>
          ${juvenile ? `<span class="fish-trait">Stage: Baby</span>` : ""}
          ${detritusFish ? `<span class="fish-trait">Diet: ${species.behavior === "shrimp" ? "trace grime + waste" : "grime + waste"}</span>` : ""}
          ${!dead ? `<span class="fish-trait">Grime load: +${dirtinessLoadPercent}%</span>` : ""}
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
  setTextIfChanged(dom.inspectorTitle, fish.name);
  setTextIfChanged(dom.inspectorSpecies, species?.name || "Fish");
  const inspectorHeartsMarkup = renderHearts(fish.healthUnits, getFishMaxHealthUnits(fish, species));
  if (dom.inspectorHealth.innerHTML !== inspectorHeartsMarkup) {
    dom.inspectorHealth.innerHTML = inspectorHeartsMarkup;
  }
  setTextIfChanged(
    dom.inspectorComfort,
    inStorage
      ? (dead ? "Stored for disposal" : "Stored safely")
      : dead
        ? "Deceased"
        : `${comfort.label} (${Math.round(comfort.value * 100)}%)`
  );
  setTextIfChanged(dom.inspectorAge, formatFishAge(fish.acquiredAt, now));
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

function renderEquipmentShop() {
  if (!dom.equipmentShop) {
    return;
  }

  const shopFilters = runtime.filterCatalog.filter((filter) => filter.purchasable && filter.key !== BASIC_FILTER_KEY);

  const markup = shopFilters.map((filter) => {
    const owned = isFilterOwned(filter.key);
    const equipped = state.selectedFilterAsset === filter.key;
    const affordable = state.coins >= filter.cost;
    const buttonMarkup = owned
      ? `<button class="buy-button" disabled>Purchased</button>`
      : `<button class="buy-button" data-buy-filter="${filter.key}" ${affordable ? "" : "disabled"}>Buy & Equip</button>`;
    const statusText = equipped
      ? "Purchased and installed"
      : owned
        ? "Purchased"
        : "Locked in the shop";
    return `
      <article class="shop-card">
        <img class="shop-thumb" src="${filter.path}" alt="${filter.name}" />
        <div class="shop-meta">
          <div>
            <strong>${filter.name}</strong>
            <div class="fish-meta">${statusText}</div>
          </div>
          <div class="fish-meta">${filter.blurb}</div>
          <div class="fish-meta">Empty tank max grime: ${formatDuration(filter.cleanDays * DAY_MS)}. Mood boost: +${Math.round(filter.comfortBoost * 100)}%.</div>
        </div>
        <div class="shop-meta">
          <span class="price-tag">${filter.cost} ${pluralize("coin", filter.cost)}</span>
          ${buttonMarkup}
        </div>
      </article>
    `;
  }).join("");

  setMarkupIfChanged("equipment-shop", dom.equipmentShop, markup || `<div class="empty-state">No equipment upgrades are available yet.</div>`);
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
  renderSceneAssetCards(dom.filterAssetList, getOwnedFilterCatalog(), state.selectedFilterAsset, "data-select-filter", "Equip Filter", "Equipped");
}

function renderGravelAssets() {
  if (!dom.gravelAssetList) {
    return;
  }

  if (!runtime.gravelCatalog.length) {
    setMarkupIfChanged("scene-assets-gravel", dom.gravelAssetList, `<div class="empty-state">No PNG assets were found in this folder yet.</div>`);
    return;
  }

  const customEnabled = Boolean(state.customGravelEnabled);
  const statusMarkup = customEnabled
    ? `<div class="custom-gravel-status">Custom Gravel Test is enabled, so the regular gravel image is currently disabled.</div>`
    : "";
  const cardsMarkup = runtime.gravelCatalog
    .map((item) => {
      const selected = state.selectedGravelAsset === item.key;
      const buttonLabel = customEnabled
        ? "Disabled While Custom Gravel Is On"
        : selected
          ? "Using This Gravel"
          : "Use Gravel";
      return `
        <article class="background-card ${selected ? "is-selected" : ""}">
          <img class="scene-thumb" src="${item.path}" alt="${item.name}" />
          <div>
            <strong>${item.name}</strong>
            <div class="fish-meta">${item.blurb}</div>
          </div>
          <button data-select-gravel="${item.key}" ${customEnabled ? "disabled" : ""}>
            ${buttonLabel}
          </button>
        </article>
      `;
    })
    .join("");

  setMarkupIfChanged("scene-assets-gravel", dom.gravelAssetList, `${statusMarkup}${cardsMarkup}`);
}

function renderCustomGravelControls() {
  if (!dom.customGravelPanel) {
    return;
  }

  const layerCatalog = runtime.customGravelLayerCatalog || [];
  const layersReady = hasReadyCustomGravelLayers();
  const enabled = Boolean(state.customGravelEnabled);

  if (!layersReady) {
    setMarkupIfChanged(
      "custom-gravel-panel",
      dom.customGravelPanel,
      `<div class="empty-state">Custom gravel layers were not found. Add the three layer PNGs to <code>assets/gravel</code>.</div>`
    );
    return;
  }

  const choices = getCustomGravelColorChoices();
  const activeColors = getActiveCustomGravelLayerColors();
  const layerMarkup = enabled
    ? layerCatalog
      .map((layer, index) => {
        const activeColor = activeColors[index] || DEFAULT_CUSTOM_GRAVEL_LAYER_COLOR;
        const activeChoice = choices.find((choice) => choice.color === activeColor) || { label: activeColor, color: activeColor };
        const swatchMarkup = choices
          .map((choice) => {
            const selected = choice.color === activeColor;
            return `
              <button
                class="custom-gravel-color-swatch ${selected ? "is-selected" : ""}"
                type="button"
                data-custom-gravel-layer="${index}"
                data-custom-gravel-color="${choice.color}"
                aria-pressed="${selected}"
                aria-label="Set ${layer.label} to ${choice.label}"
                title="${choice.label}"
                style="--swatch:${choice.color};">
              </button>
            `;
          })
          .join("");

        return `
          <article class="custom-gravel-layer-card">
            <div class="custom-gravel-layer-header">
              <div>
                <strong>${layer.label}</strong>
                <div class="fish-meta">${layer.drawOrderLabel}</div>
              </div>
              <span class="custom-gravel-layer-swatch" style="--swatch:${activeColor};"></span>
            </div>
            <div class="custom-gravel-choice-summary">
              <span>Selected Color</span>
              <strong>${activeChoice.label}</strong>
            </div>
            <div class="custom-gravel-swatches" role="group" aria-label="${layer.label} color choices">
              ${swatchMarkup}
            </div>
          </article>
        `;
      })
      .join("")
    : "";

  const markup = `
    <div class="custom-gravel-panel-shell">
      <div class="custom-gravel-toggle-row">
        <div class="compact-heading">
          <strong>Layered Gravel Override</strong>
          <p>${enabled
            ? "Regular gravel is off while Custom Gravel Test is enabled."
            : "Turn this on to replace the standard gravel image with three stacked colorized layers."}</p>
        </div>
        <button
          class="custom-gravel-toggle ${enabled ? "is-active" : ""}"
          type="button"
          data-toggle-custom-gravel="true"
          aria-pressed="${enabled}">
          <span>Enable</span>
          <strong>${enabled ? "On" : "Off"}</strong>
        </button>
      </div>
      ${enabled ? `<div class="custom-gravel-layer-list">${layerMarkup}</div>` : ""}
    </div>
  `;

  setMarkupIfChanged("custom-gravel-panel", dom.customGravelPanel, markup);
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
  const hasGravelPebbleCandidate = hasFishGravelPebbleCandidate(now);

  dom.feedButton.disabled = !getFeedableLivingFish().length || currentMealServed;

  dom.resetMealsButton.hidden = !DEBUG_MODE;
  dom.debugDamageFishButton.hidden = !DEBUG_MODE;
  dom.debugBreedButton.hidden = !DEBUG_MODE;
  dom.resetFishHealthButton.hidden = !DEBUG_MODE;
  dom.addCoinsButton.hidden = !DEBUG_MODE;
  dom.maxDirtButton.hidden = !DEBUG_MODE;
  dom.deleteAllButton.hidden = !DEBUG_MODE;
  dom.debugGravelPebbleButton.hidden = !DEBUG_MODE;
  dom.debugCaveButton.hidden = !DEBUG_MODE;

  dom.resetMealsButton.disabled = !DEBUG_MODE;
  dom.resetFishHealthButton.disabled = !DEBUG_MODE;
  dom.addCoinsButton.disabled = !DEBUG_MODE;
  dom.maxDirtButton.disabled = !DEBUG_MODE;
  dom.deleteAllButton.disabled = !DEBUG_MODE;
  dom.debugGravelPebbleButton.disabled = !DEBUG_MODE || !hasGravelPebbleCandidate;
  dom.debugDamageFishButton.disabled = !DEBUG_MODE || !selectedActiveFish || isFishDead(selectedActiveFish);
  dom.debugBreedButton.disabled = !DEBUG_MODE || (!hasDebugBreedingPairCandidate(now) && !runtime.debugBreedingSequence);
  dom.debugBreedButton.classList.toggle("is-active", Boolean(runtime.debugBreedingSequence));
  dom.debugBreedButton.title = runtime.debugBreedingSequence
    ? "Debug: Baby Sequence Running"
    : "Debug: Make a Baby";
  dom.debugBreedButton.setAttribute(
    "aria-label",
    runtime.debugBreedingSequence
      ? "Debug: Baby Sequence Running"
      : "Debug: Make a Baby"
  );
  dom.debugCaveButton.disabled = !DEBUG_MODE || (!hasCaveFishCandidate && !runtime.debugNightCaveMode);
  dom.debugCaveButton.classList.toggle("is-active", runtime.debugNightCaveMode);
  dom.debugCaveButton.title = runtime.debugNightCaveMode
    ? "Debug: Disable Cave Test Loop"
    : "Debug: Force Cave Test Loop";
  dom.debugCaveButton.setAttribute(
    "aria-label",
    runtime.debugNightCaveMode
      ? "Debug: Disable Cave Test Loop"
      : "Debug: Force Cave Test Loop"
  );
  if (dom.debugGravelPebbleButton) {
    dom.debugGravelPebbleButton.title = hasGravelPebbleCandidate
      ? "Debug: Force Gravel Pebble Toss"
      : "Debug: Enable Custom Gravel Test and keep a living non-sucker fish in the tank";
    dom.debugGravelPebbleButton.setAttribute(
      "aria-label",
      hasGravelPebbleCandidate
        ? "Debug: Force Gravel Pebble Toss"
        : "Debug: Enable Custom Gravel Test and keep a living non-sucker fish in the tank"
    );
  }

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
  renderScrubProgress();

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

function renderScrubProgress() {
  const scrubPercent = Math.round(getScrubCoverage() * 100);
  if (dom.scrubProgressLabel) {
    dom.scrubProgressLabel.textContent = `${scrubPercent}%`;
  }
  if (dom.scrubProgressBar) {
    dom.scrubProgressBar.style.width = `${scrubPercent}%`;
  }
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
  const breedingFishIds = runtime.debugBreedingSequence
    ? new Set([runtime.debugBreedingSequence.leftFishId, runtime.debugBreedingSequence.rightFishId].filter(Boolean))
    : null;
  const livingFish = state.fish.filter((fish) => !isFishDead(fish));
  if (livingFish.length < 2) {
    runtime.bettaPassLocks.clear();
    return;
  }

  const nextLocks = new Set();
  const landedMessages = [];

  for (const attacker of livingFish) {
    if (
      attacker.id === draggedFishId
      || breedingFishIds?.has(attacker.id)
      || attacker.speciesId !== "betta"
      || attacker.activity !== "roam"
      || Number(attacker.motionLevel) < 0.18
    ) {
      continue;
    }

    const travelDistance = Math.hypot(attacker.targetXNorm - attacker.xNorm, attacker.targetYNorm - attacker.yNorm);
    if (travelDistance < 0.01) {
      continue;
    }

    for (const target of livingFish) {
      if (target.id === attacker.id || target.id === draggedFishId || breedingFishIds?.has(target.id) || isFishDead(target)) {
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
  clearFishSchoolFollowState(victim);
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

  clearFishSchoolFollowState(fish);

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
    runtime.fishGravelPebbleActions.clear();
    runtime.fishPebbleTosses = [];
    runtime.bettaPassLocks.clear();
    return;
  }
  pruneFishGravelPebbleRuntimeState(now);
  const activelyDraggedFishId = runtime.fishDragState?.fishId || null;
  const activeDebugBreedingSequence = updateDebugBreedingSequence(now);
  let retargetsThisFrame = 0;

  for (const fish of state.fish) {
    const species = runtime.fishMap.get(fish.speciesId);
    if (!species) {
      continue;
    }
    const debugCaveTestFish = isDebugCaveTestFish(fish);
    const breedingRole = activeDebugBreedingSequence
      ? (fish.id === activeDebugBreedingSequence.leftFish.id
        ? "left"
        : (fish.id === activeDebugBreedingSequence.rightFish.id ? "right" : null))
      : null;

    if (fish.id === activelyDraggedFishId) {
      clearFishGravelPebbleAction(fish, species, now, { resetTarget: false });
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
      clearFishGravelPebbleAction(fish, species, now, { resetTarget: false });
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

    if (!breedingRole && isFishSickOrDying(fish) && fish.activity === "roam" && Math.random() < deltaSeconds * 0.35) {
      fish.panicUntil = now + randomBetween(1600, 3200);
      fish.panicSpeedBoost = randomBetween(1.45, 2.15);
      fish.targetAt = now;
      if (species.speedMode === "dynamic") {
        fish.swimSpeed = normalizeFishSpeed(species, randomBetween(Math.max(species.speedMin, species.speedMax * 0.72), species.speedMax));
      }
    }

    if (species.behavior === "sucker") {
      setFishTankLayers(fish, TANK_DEPTH_LAYERS, TANK_DEPTH_LAYERS);
      fish.hangoutDecorId = null;
      if (fish.activity === "feeding") {
        fish.activity = "roam";
        fish.feedingPelletId = null;
      }
    }

    if (debugCaveTestFish && fish.activity === "feeding") {
      fish.activity = "roam";
      fish.feedingPelletId = null;
      state.floatingPellets = state.floatingPellets.filter((pellet) => pellet.targetFishId !== fish.id);
      fish.targetAt = now;
    }

    if (breedingRole) {
      clearFishGravelPebbleAction(fish, species, now, { resetTarget: false });
      if (fish.caveState) {
        abortFishCaveBehavior(fish, now, false);
      }
      setFishBreedingTarget(fish, species, activeDebugBreedingSequence.sequence, breedingRole, now);
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

    if (fish.activity !== FISH_GRAVEL_PEBBLE_ACTIVITY && getFishGravelPebbleAction(fish)) {
      clearFishGravelPebbleAction(fish, species, now, { resetTarget: false });
    }

    if (fish.activity === "roam" && !breedingRole && !fish.caveState && !debugCaveTestFish) {
      maybeStartFishGravelPebbleAction(fish, species, now, deltaSeconds);
    }

    const gravelPebbleOwnsMovement = !breedingRole && updateFishGravelPebbleAction(fish, species, now);
    const caveBehaviorOwnsMovement = !breedingRole && !gravelPebbleOwnsMovement && fish.activity === "roam" && updateFishCaveBehavior(fish, species, now);
    if (fish.activity === "roam" && !breedingRole && !caveBehaviorOwnsMovement && now >= fish.targetAt) {
      if (retargetsThisFrame >= MAX_FISH_RETARGETS_PER_FRAME) {
        fish.targetAt = now + 30 + Math.random() * 60;
      } else {
        assignSwimTarget(fish, species, now);
        retargetsThisFrame += 1;
      }
    }

    if (fish.activity === "roam" && !fish.caveState && !breedingRole) {
      updateFishSchoolFollowTarget(fish, species, now);
    }

    const moveDx = fish.targetXNorm - fish.xNorm;
    const moveDy = fish.targetYNorm - fish.yNorm;
    const moveDistance = Math.hypot(moveDx, moveDy);
    const isDirectedSwim = fish.activity === "feeding" || fish.activity === FISH_GRAVEL_PEBBLE_ACTIVITY;
    let motionTarget = fish.activity === "feeding"
      ? 1
      : fish.activity === FISH_GRAVEL_PEBBLE_ACTIVITY
        ? 0.76
        : (isFishSickOrDying(fish) ? 0.22 : 0.08);
    let handledDirectionThisFrame = false;

    if (moveDistance > 0.0001) {
      let speedMultiplier = fish.activity === "feeding"
        ? FEED_CHASE_MULTIPLIER
        : fish.activity === FISH_GRAVEL_PEBBLE_ACTIVITY
          ? 1.14
          : 1;

      if (Number.isFinite(fish.panicUntil)) {
        if (now < fish.panicUntil) {
          speedMultiplier *= Number(fish.panicSpeedBoost) || 2;
        } else {
          fish.panicUntil = null;
          fish.panicSpeedBoost = null;
        }
      }

      if (isFishSickOrDying(fish) && fish.activity !== "feeding" && fish.activity !== FISH_GRAVEL_PEBBLE_ACTIVITY) {
        speedMultiplier *= 1.22;
      }

      const speed = fish.swimSpeed * FISH_MOTION_SCALE * speedMultiplier;
      const step = Math.min(moveDistance, speed * deltaSeconds);

      const nextXNorm = clamp(fish.xNorm + (moveDx / moveDistance) * step, 0.08, 0.92);
      const nextYNorm = clamp(fish.yNorm + (moveDy / moveDistance) * step, 0.14, 0.8);

      if (species.behavior === "sucker") {
        fish.xNorm = nextXNorm;
        fish.yNorm = nextYNorm;
      } else {
        const activeCavePlan = fish.caveState ? getActiveFishCavePlan(fish) : null;
        const skipDebugCaveCollision = Boolean(
          activeCavePlan?.debugForced &&
          isDebugCaveTestFish(fish) &&
          ["enter", "inside", "exit", "depart"].includes(fish.caveState) &&
          fish.caveDecorId &&
          activeCavePlan.decorId === fish.caveDecorId
        );

        if (skipDebugCaveCollision) {
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
          } else if (resolvedMove.blocked && fish.activity === FISH_GRAVEL_PEBBLE_ACTIVITY) {
            clearFishGravelPebbleAction(fish, species, now);
            handledDirectionThisFrame = true;
          }
        }

        if (fish.caveState && !skipDebugCaveCollision) {
          enforceActiveCaveMaskRule(fish, species, now);
        }
      }

      const travelRatio = clamp(step / Math.max(0.00001, speed * deltaSeconds), 0, 1);
      motionTarget = fish.activity === "feeding"
        ? 1
        : fish.activity === FISH_GRAVEL_PEBBLE_ACTIVITY
          ? clamp(0.54 + travelRatio * 0.38 + Math.min(0.12, moveDistance * 3), 0.34, 0.86)
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
    fish.wiggleClock += deltaSeconds * (0.35 + fish.motionLevel * (1.85 + fish.swimSpeed * 18)) * (isFishSickOrDying(fish) ? 1.22 : 1);

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
  updateFishPebbleTosses(now);
  updateBloodClouds(deltaSeconds);
}

function assignSwimTarget(fish, species, now) {
  clearFishSchoolFollowState(fish);

  if (runtime.debugNightCaveMode && isDebugCaveTestFish(fish)) {
    if (startDebugCaveLoopCycle(now, { silentFailure: true, suppressEvent: true })) {
      return;
    }
  } else if (runtime.debugNightCaveMode && !runtime.debugForcedCaveFishId) {
    if (
      startDebugCaveLoopCycle(now, { silentFailure: true, suppressEvent: true })
      && runtime.debugForcedCaveFishId === fish.id
    ) {
      return;
    }
  }

  const vigilTarget = pickDeadFishVigilTarget(fish, species, now);
  if (vigilTarget) {
    fish.targetXNorm = vigilTarget.xNorm;
    fish.targetYNorm = vigilTarget.yNorm;
    fish.targetAt = now + vigilTarget.lingerMs;
    fish.panicUntil = Math.max(Number(fish.panicUntil) || 0, now + Math.min(vigilTarget.lingerMs, randomBetween(1400, 2400)));
    fish.panicSpeedBoost = Math.max(Number(fish.panicSpeedBoost) || 0, randomBetween(1.35, 1.8));
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

  if (isFishSickOrDying(fish) && species.behavior !== "sucker") {
    const hideout = pickDecorHangoutTarget(species, fish, now, {
      chanceMultiplier: 2.3,
      lingerMultiplier: 2.7,
      preferBackLayer: true
    });
    if (hideout) {
      fish.targetXNorm = hideout.xNorm;
      fish.targetYNorm = hideout.yNorm;
      fish.targetAt = now + hideout.lingerMs;
      setFishDesiredTankLayer(fish, hideout.targetLayer);
      fish.hangoutDecorId = hideout.decorId;
      fish.swimSpeed = normalizeFishSpeed(species, randomBetween(Math.max(species.speedMin, species.speedMax * 0.76), species.speedMax));
      return;
    }
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

  if (species.behavior === "shrimp") {
    const plantHangout = pickDecorHangoutTarget(species, fish, now, {
      chanceMultiplier: 1.75,
      lingerMultiplier: 0.7,
      preferBackLayer: true
    });
    if (plantHangout) {
      fish.targetXNorm = plantHangout.xNorm;
      fish.targetYNorm = clamp(Math.max(0.36, plantHangout.yNorm), 0.34, 0.82);
      fish.targetAt = now + Math.max(species.targetMinMs, plantHangout.lingerMs);
      setFishDesiredTankLayer(fish, clampTankLayer(Math.max(TANK_DEPTH_LAYERS - 1, plantHangout.targetLayer)));
      fish.hangoutDecorId = plantHangout.decorId;
      fish.swimSpeed = normalizeFishSpeed(species, randomBetween(species.speedMin, species.speedMax));
      return;
    }

    const currentFacing = getFishFacingDirection(fish);
    const nearLeftWall = fish.xNorm <= 0.12;
    const nearRightWall = fish.xNorm >= 0.88;
    const nearFloor = fish.yNorm >= 0.74;
    const tooHigh = fish.yNorm <= 0.42;
    const dartDirection = nearLeftWall
      ? 1
      : nearRightWall
        ? -1
        : (Math.random() < 0.32 ? -currentFacing : currentFacing);
    const dartDistance = randomBetween(0.05, 0.14);
    const nextXNorm = clamp(fish.xNorm + dartDirection * dartDistance + randomBetween(-0.015, 0.015), 0.1, 0.9);
    const verticalShift = nearFloor
      ? -randomBetween(0.02, 0.08)
      : tooHigh
        ? randomBetween(0.03, 0.08)
        : randomBetween(-0.05, 0.05);
    const nextYNorm = clamp(fish.yNorm + verticalShift + randomBetween(-0.012, 0.012), 0.36, 0.82);
    fish.targetXNorm = nextXNorm;
    fish.targetYNorm = nextYNorm;
    fish.targetAt = now + randomBetween(species.targetMinMs, species.targetMaxMs);
    setFishDesiredTankLayer(
      fish,
      clampTankLayer(Math.random() < 0.72 ? TANK_DEPTH_LAYERS - 1 : TANK_DEPTH_LAYERS - 2)
    );
    fish.hangoutDecorId = null;
    fish.swimSpeed = normalizeFishSpeed(species, randomBetween(species.speedMin, species.speedMax));
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

  const socialFollow = pickSameSpeciesFollowTarget(fish, species, now);
  if (socialFollow) {
    fish.targetXNorm = socialFollow.xNorm;
    fish.targetYNorm = socialFollow.yNorm;
    fish.targetAt = now + socialFollow.lingerMs;
    setFishDesiredTankLayer(fish, socialFollow.targetLayer);
    fish.hangoutDecorId = null;
    if (species.speedMode === "dynamic") {
      fish.swimSpeed = normalizeFishSpeed(species);
    }
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

  fish.targetXNorm = randomSwimX();
  fish.targetYNorm = randomSwimY();
  fish.targetAt = isFishSickOrDying(fish)
    ? now + randomBetween(900, Math.max(1400, species.targetMaxMs * 0.45))
    : now + species.targetMinMs + Math.random() * Math.max(200, species.targetMaxMs - species.targetMinMs);
  setFishDesiredTankLayer(
    fish,
    species.behavior === "sucker"
      ? TANK_DEPTH_LAYERS
      : clampTankLayer(1 + Math.floor(Math.random() * TANK_DEPTH_LAYERS))
  );
  fish.hangoutDecorId = null;
  if (species.speedMode === "dynamic" || isFishSickOrDying(fish)) {
    fish.swimSpeed = normalizeFishSpeed(
      species,
      isFishSickOrDying(fish)
        ? randomBetween(Math.max(species.speedMin, species.speedMax * 0.72), species.speedMax)
        : undefined
    );
  }
}

function pickDecorHangoutTarget(species, fish = null, now = Date.now(), options = {}) {
  const chanceByStyle = {
    peaceful: 0.62,
    steady: 0.46,
    sporadic: 0.34
  };
  const chanceMultiplier = Number.isFinite(Number(options.chanceMultiplier)) ? Number(options.chanceMultiplier) : 1;

  if (
    !state.placedDecor.length
    || (!options.force && Math.random() > clamp((chanceByStyle[species.swimStyle] || 0.4) * chanceMultiplier, 0, 1))
  ) {
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
  const targetLayer = options.preferBackLayer
    ? clampTankLayer(zone.targetLayerMax)
    : clampTankLayer(zone.targetLayerMin + Math.floor(Math.random() * (zone.targetLayerMax - zone.targetLayerMin + 1)));
  const lingerMultiplier = Number.isFinite(Number(options.lingerMultiplier)) ? Number(options.lingerMultiplier) : 1;
  return {
    xNorm: clamp(randomBetween(zone.xMin, zone.xMax), 0.08, 0.92),
    yNorm: clamp(randomBetween(zone.yMin, zone.yMax), 0.16, 0.8),
    targetLayer,
    decorId: zone.decorId,
    lingerMs: (zone.lingerMinMs + Math.random() * (zone.lingerMaxMs - zone.lingerMinMs)) * lingerMultiplier
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
  drawFishPebbleTosses(now);
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
    if (layer === TANK_DEPTH_LAYERS) {
      drawPoops(now);
    }
    //drawLooseGravel(now, { surfaceKind: "decor", decorLayer: layer });
    if (layer < TANK_DEPTH_LAYERS) {
      drawFish(now, layer, { excludeBehavior: "sucker" });
    }
  }
  drawDecorBubbleStreams(now);
  drawAmbientBubbles(now, 3);
  //drawLooseGravel(now, { transientOnly: true });
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
  const visibleDirtiness = getVisibleGrimeDirtiness(dirtiness);
  const lightGrime = getLightGrimeVisualIntensity(dirtiness);
  const severeGrime = getSevereGrimeVisualIntensity(dirtiness);
  const tankCanvasFilter = severeGrime > 0
    ? `blur(${(severeGrime * 1.8).toFixed(2)}px) saturate(${(1 - severeGrime * 0.18).toFixed(3)}) brightness(${(1 - severeGrime * 0.12).toFixed(3)})`
    : "none";
  if (runtime.lastTankCanvasFilter !== tankCanvasFilter) {
    dom.tankCanvas.style.filter = tankCanvasFilter;
    runtime.lastTankCanvasFilter = tankCanvasFilter;
  }
  const grimeCanvasFilter = visibleDirtiness > 0
    ? `blur(${(0.12 + lightGrime * 0.48 + severeGrime * 1.6).toFixed(2)}px)`
    : "none";
  if (runtime.lastGrimeCanvasFilter !== grimeCanvasFilter) {
    dom.grimeCanvas.style.filter = grimeCanvasFilter;
    runtime.lastGrimeCanvasFilter = grimeCanvasFilter;
  }
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
  const flowActive = isFilterBubbleFlowActive(now);

  if (flowActive) {
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
  }

  if (filterImage) {
    tankContext.globalAlpha = 1;
    tankContext.drawImage(filterImage, filterDrawX, filterDrawY, filterDrawWidth, filterDrawHeight);
    tankContext.globalAlpha = 1;
  }
  tankContext.restore();
}

function isFilterBubbleFlowActive(now = Date.now()) {
  return getBaseTankDirtiness(now) < CRITICAL_TANK_DIRTINESS;
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

function getTankFloorDrawBounds() {
  const left = GLASS_MARGIN_X;
  const right = TANK_WIDTH - GLASS_MARGIN_X;
  const bottom = TANK_HEIGHT - GLASS_MARGIN_BOTTOM;
  const baseTop = getTankFloorSurfaceYAtX(TANK_WIDTH * 0.5) - 26;
  const floorHeight = Math.max(40, bottom - baseTop);

  return {
    left,
    right,
    bottom,
    baseTop,
    floorHeight,
    drawTop: baseTop - 10,
    drawHeight: floorHeight + 20,
    drawWidth: right - left
  };
}

function getTankFloorMaskSurfaceYAtX(x, bounds = getTankFloorDrawBounds()) {
  const { left, right, baseTop } = bounds;
  const t = clamp((x - left) / Math.max(1, right - left), 0, 1);
  const wave1 = Math.sin(t * Math.PI * 2 * 1.2) * 8;
  const wave2 = Math.sin(t * Math.PI * 2 * 3.4 + 0.8) * 3;
  const crestBias = Math.sin(t * Math.PI) * 4;
  return baseTop + wave1 + wave2 - crestBias;
}

function traceTankFloorMaskPath(context, bounds = getTankFloorDrawBounds()) {
  const { left, right, bottom } = bounds;

  context.beginPath();
  context.moveTo(left, bottom);

  for (let x = left; x <= right; x += 8) {
    context.lineTo(x, getTankFloorMaskSurfaceYAtX(x, bounds));
  }

  context.lineTo(right, bottom);
  context.closePath();
}

function drawSelectedGravelFloorImage(bounds) {
  const gravel = runtime.gravelMap.get(state.selectedGravelAsset) || runtime.gravelCatalog[0] || null;
  const gravelImage = gravel ? runtime.images.get(gravel.path) : null;
  if (!gravelImage) {
    return false;
  }

  tankContext.drawImage(
    gravelImage,
    bounds.left,
    bounds.drawTop,
    bounds.drawWidth,
    bounds.drawHeight
  );
  return true;
}

function getCustomGravelAssetImage(asset) {
  if (!asset) {
    return { image: null, path: "" };
  }

  const resolvedPath = typeof asset.path === "string" ? asset.path : "";
  return {
    image: resolvedPath ? runtime.images.get(resolvedPath) || null : null,
    path: resolvedPath
  };
}

function getCustomGravelLayerImage(layer) {
  return getCustomGravelAssetImage(layer);
}

function getTintedCustomGravelAsset(asset, color, options = {}) {
  const normalizedColor = normalizeHexColor(color) || DEFAULT_CUSTOM_GRAVEL_LAYER_COLOR;
  const { image, path } = getCustomGravelAssetImage(asset);
  if (!image?.width || !image?.height || !path) {
    return null;
  }

  const maxDimension = Number.isFinite(options.maxDimension) && options.maxDimension > 0
    ? Math.max(1, Math.round(options.maxDimension))
    : 0;
  const scale = maxDimension
    ? Math.min(1, maxDimension / Math.max(image.width, image.height))
    : 1;
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  const cacheScope = typeof options.cacheScope === "string" && options.cacheScope ? options.cacheScope : "base";
  const cacheKey = `${cacheScope}|${path}|${normalizedColor}|${width}x${height}`;
  const cached = runtime.customGravelTintCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    return null;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  const targetRgb = hexToRgb(normalizedColor) || hexToRgb(DEFAULT_CUSTOM_GRAVEL_LAYER_COLOR);
  if (!targetRgb) {
    return null;
  }

  for (let index = 0; index < pixels.length; index += 4) {
    const alpha = pixels[index + 3];
    if (alpha <= 0) {
      continue;
    }

    const luminance = (pixels[index] * 0.299 + pixels[index + 1] * 0.587 + pixels[index + 2] * 0.114) / 255;
    const shade = Math.pow(luminance, 0.92);
    pixels[index] = Math.round(targetRgb.r * shade);
    pixels[index + 1] = Math.round(targetRgb.g * shade);
    pixels[index + 2] = Math.round(targetRgb.b * shade);
  }

  context.putImageData(imageData, 0, 0);
  runtime.customGravelTintCache.set(cacheKey, canvas);
  return canvas;
}

function getTintedCustomGravelLayer(layer, color) {
  return getTintedCustomGravelAsset(layer, color, { cacheScope: "layer" });
}

function getTintedCustomGravelPebble(asset, color) {
  return getTintedCustomGravelAsset(asset, color, {
    cacheScope: "pebble",
    maxDimension: CUSTOM_GRAVEL_TOP_PEBBLE_SPRITE_CACHE_SIZE
  });
}

function hasReadyCustomGravelLayers() {
  return runtime.customGravelLayerCatalog.length === CUSTOM_GRAVEL_LAYER_COUNT
    && runtime.customGravelLayerCatalog.every((layer) => Boolean(getCustomGravelLayerImage(layer).image));
}

function getCustomGravelLoosePebbleAssets() {
  return (runtime.customGravelPebbleCatalog || [])
    .filter((asset) => Boolean(getCustomGravelAssetImage(asset).image));
}

function canUseFishGravelPebblePlay() {
  return Boolean(state?.customGravelEnabled) && getCustomGravelLoosePebbleAssets().length > 0;
}

function getCustomGravelPebbleSpriteByPath(path, color) {
  if (typeof path !== "string" || !path) {
    return null;
  }

  return getTintedCustomGravelAsset(
    { path },
    color,
    {
      cacheScope: "pebble",
      maxDimension: CUSTOM_GRAVEL_TOP_PEBBLE_SPRITE_CACHE_SIZE
    }
  );
}

function getCustomGravelTopLayerCacheKey(bounds) {
  const colors = getActiveCustomGravelLayerColors().join("|");
  const assets = getCustomGravelLoosePebbleAssets().map((asset) => asset.key).join("|");
  return [
    state.gravelSeed || 1,
    colors,
    assets,
    bounds.left,
    bounds.right,
    bounds.bottom,
    bounds.baseTop
  ].join("|");
}

function getCustomGravelTopLayerCanvas(bounds) {
  const pebbleAssets = getCustomGravelLoosePebbleAssets();
  if (!pebbleAssets.length) {
    return null;
  }

  const cacheKey = getCustomGravelTopLayerCacheKey(bounds);
  if (runtime.customGravelTopLayerCanvas && runtime.customGravelTopLayerCacheKey === cacheKey) {
    return runtime.customGravelTopLayerCanvas;
  }

  const colors = getActiveCustomGravelLayerColors();
  const canvas = document.createElement("canvas");
  canvas.width = TANK_WIDTH;
  canvas.height = TANK_HEIGHT;
  const context = canvas.getContext("2d");
  if (!context) {
    return null;
  }

  const rand = mulberry32((Math.abs(Math.floor(state.gravelSeed || 1)) || 1) ^ 0x51f2e34d);
  const stamps = [];

  for (let index = 0; index < CUSTOM_GRAVEL_TOP_PEBBLE_COUNT; index += 1) {
    const asset = pebbleAssets[Math.floor(rand() * pebbleAssets.length)] || pebbleAssets[0];
    const color = colors[Math.floor(rand() * colors.length)] || DEFAULT_CUSTOM_GRAVEL_LAYER_COLOR;
    const sprite = getTintedCustomGravelPebble(asset, color);
    if (!sprite?.width || !sprite?.height) {
      continue;
    }

    const size = randomBetweenWith(rand, CUSTOM_GRAVEL_TOP_PEBBLE_SIZE_MIN_PX, CUSTOM_GRAVEL_TOP_PEBBLE_SIZE_MAX_PX);
    const aspect = sprite.width / Math.max(1, sprite.height);
    const drawWidth = aspect >= 1 ? size : size * aspect;
    const drawHeight = aspect >= 1 ? size / aspect : size;
    const x = randomBetweenWith(rand, bounds.left + drawWidth * 0.5, bounds.right - drawWidth * 0.5);
    const surfaceY = getTankFloorMaskSurfaceYAtX(x, bounds);
    const depthOffset = Math.pow(rand(), 1.8) * CUSTOM_GRAVEL_TOP_PEBBLE_DEPTH_PX;

    stamps.push({
      sprite,
      x,
      y: surfaceY + depthOffset,
      width: drawWidth,
      height: drawHeight,
      rotation: randomBetweenWith(rand, -Math.PI, Math.PI)
    });
  }

  stamps.sort((left, right) => left.y - right.y);
  for (const stamp of stamps) {
    context.save();
    context.translate(stamp.x, stamp.y);
    context.rotate(stamp.rotation);
    context.globalAlpha = 1;
    context.drawImage(
      stamp.sprite,
      -stamp.width * 0.5,
      -stamp.height * 0.5,
      stamp.width,
      stamp.height
    );
    context.restore();
  }

  runtime.customGravelTopLayerCanvas = canvas;
  runtime.customGravelTopLayerCacheKey = cacheKey;
  return canvas;
}

function drawCustomGravelLoosePebbles(bounds) {
  const canvas = getCustomGravelTopLayerCanvas(bounds);
  if (!canvas) {
    return false;
  }

  tankContext.drawImage(canvas, 0, 0);
  return true;
}

function drawCustomGravelFloor(bounds) {
  const layerColors = getActiveCustomGravelLayerColors();
  let drewLayer = false;

  for (let index = 0; index < runtime.customGravelLayerCatalog.length; index += 1) {
    const layer = runtime.customGravelLayerCatalog[index];
    const tintedLayer = getTintedCustomGravelLayer(layer, layerColors[index] || DEFAULT_CUSTOM_GRAVEL_LAYER_COLOR);
    if (!tintedLayer) {
      continue;
    }

    tankContext.drawImage(
      tintedLayer,
      bounds.left,
      bounds.drawTop,
      bounds.drawWidth,
      bounds.drawHeight
    );
    drewLayer = true;
  }

  return drewLayer;
}

function drawTankFloor() {
  const bounds = getTankFloorDrawBounds();

  tankContext.save();
  traceTankFloorMaskPath(tankContext, bounds);
  tankContext.clip();

  const usedCustomGravel = state.customGravelEnabled && drawCustomGravelFloor(bounds);
  if (!usedCustomGravel) {
    drawSelectedGravelFloorImage(bounds);
  }

  tankContext.restore();

  if (usedCustomGravel) {
    drawCustomGravelLoosePebbles(bounds);
  }
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
    const image = species ? runtime.images.get(getFishAssetPath(fish, species) || species.asset) : null;
    if (!species || !image || species.behavior === "sucker") {
      continue;
    }

    const pose = getFishPose(fish, species, now);
    const width = species.width * getFishEffectiveScale(fish, species, now);
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

function drawDecorImageLayer(image, drawX, drawY, width, height, item, now, motion = null, alpha = 1) {
  if (!image) {
    return;
  }

  const resolvedMotion = motion || getDecorMotion(item, now);
  tankContext.save();
  tankContext.globalAlpha = clamp(alpha, 0, 1);
  if (resolvedMotion.isFloating || resolvedMotion.isSeaweed || resolvedMotion.isLure) {
    drawDecorWarped(image, drawX, drawY, width, height, item, now, resolvedMotion);
  } else {
    tankContext.drawImage(image, drawX, drawY, width, height);
  }
  tankContext.restore();
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
    if (layer === span.front && decor.bubbler && getDecorTankLayer(item) === BUBBLER_LAYER) {
      const bgImage = decor.bgPath ? runtime.images.get(decor.bgPath) : null;
      if (bgImage) {
        const bgHeight = width * (bgImage.height / bgImage.width);
        drawDecorImageLayer(bgImage, drawX, y - bgHeight, width, bgHeight, item, now, motion);
      }
      drawDecorBubblerEffect(item, decor, image, now);
      drawDecorImageLayer(image, drawX, drawY, width, height, item, now, motion);
      continue;
    }

    drawDecorImageLayer(image, drawX, drawY, width, height, item, now, motion);
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
  const previewItem = {
    id: "placement-preview",
    decorKey: decor.key,
    xNorm: runtime.placementPreview.xNorm,
    yNorm: runtime.placementPreview.yNorm,
    scale: Number(runtime.placementMode.scale) || getDecorScaleDefault(decor.key),
    tankLayer: BUBBLER_LAYER
  };
  const previewMotion = getDecorMotion(previewItem, Date.now());
  if (decor.bubbler && decor.bgPath && (runtime.placementMode.tankLayer || runtime.decorPlacementLayer) === BUBBLER_LAYER) {
    const bgImage = runtime.images.get(decor.bgPath);
    if (bgImage) {
      const bgHeight = width * (bgImage.height / bgImage.width);
      drawDecorImageLayer(bgImage, x - width / 2, y - bgHeight, width, bgHeight, previewItem, Date.now(), previewMotion, 0.72);
    }
  }
  if (decor.bubbler && (runtime.placementMode.tankLayer || runtime.decorPlacementLayer) === BUBBLER_LAYER) {
    drawDecorBubblerEffect(
      previewItem,
      decor,
      image,
      Date.now(),
      { alphaScale: 0.72 }
    );
  }
  drawDecorImageLayer(image, x - width / 2, y - height, width, height, previewItem, Date.now(), previewMotion, 0.72);
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
    const poopSprite = runtime.images.get(poop.asset || resolveAppUrl(POOP_ASSET_PATH));
    if (!poopSprite) {
      continue;
    }

    const sinkProgress = clamp((now - poop.createdAt) / POOP_FALL_MS, 0, 1);
    const x = poop.xNorm * TANK_WIDTH + Math.sin(now / 520 + poop.xNorm * 11) * (1 - sinkProgress) * 6;
    const targetYNorm = Number.isFinite(Number(poop.yNorm)) ? Number(poop.yNorm) : getPoopFloorYNormAtXNorm(poop.xNorm);
    const y = (poop.startYNorm + (targetYNorm - poop.startYNorm) * sinkProgress) * TANK_HEIGHT;
    const wobble = Math.sin(now / 720 + poop.xNorm * 17) * (1 - sinkProgress) * 0.12;
    const width = 36;
    const height = width * (poopSprite.height / Math.max(1, poopSprite.width));

    tankContext.save();
    tankContext.translate(x, y + 4);
    tankContext.rotate(wobble);
    tankContext.globalAlpha = 0.9;
    tankContext.drawImage(poopSprite, -width / 2, -height * 0.88, width, height);
    tankContext.restore();
  }
}

function drawFishHeldGravelPebble(fish, species, now, pose, width, height) {
  const action = getFishGravelPebbleAction(fish);
  if (!action || action.stage !== "carry") {
    return;
  }

  const sprite = getCustomGravelPebbleSpriteByPath(action.assetPath, action.color);
  if (!sprite?.width || !sprite?.height) {
    return;
  }

  const aspect = sprite.width / Math.max(1, sprite.height);
  const size = Number.isFinite(action.holdSizePx) ? action.holdSizePx : FISH_GRAVEL_PEBBLE_HOLD_SIZE_MIN_PX;
  const drawWidth = aspect >= 1 ? size : size * aspect;
  const drawHeight = aspect >= 1 ? size / aspect : size;
  const mouth = getFishGravelPebbleMouthLocalPoint(width, height, pose);

  tankContext.save();
  tankContext.globalAlpha = 1;
  tankContext.drawImage(
    sprite,
    mouth.x - drawWidth * 0.42,
    mouth.y - drawHeight * 0.5,
    drawWidth,
    drawHeight
  );
  tankContext.restore();
}

function drawFishPebbleTosses(now) {
  if (!runtime.fishPebbleTosses.length) {
    return;
  }

  for (const toss of runtime.fishPebbleTosses) {
    const sprite = getCustomGravelPebbleSpriteByPath(toss.assetPath, toss.color);
    if (!sprite?.width || !sprite?.height) {
      continue;
    }

    const pose = getFishPebbleTossPose(toss, now);
    const aspect = sprite.width / Math.max(1, sprite.height);
    const size = Number.isFinite(toss.sizePx) ? toss.sizePx : FISH_GRAVEL_PEBBLE_HOLD_SIZE_MIN_PX;
    const drawWidth = aspect >= 1 ? size : size * aspect;
    const drawHeight = aspect >= 1 ? size / aspect : size;

    tankContext.save();
    tankContext.translate(pose.x, pose.y);
    tankContext.rotate(pose.rotation);
    tankContext.globalAlpha = 1;
    tankContext.drawImage(
      sprite,
      -drawWidth * 0.5,
      -drawHeight * 0.5,
      drawWidth,
      drawHeight
    );
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
    const image = runtime.images.get(getFishAssetPath(fish, species) || species.asset);
    if (!image) {
      continue;
    }

    const pose = getFishPose(fish, species, now);
    const width = species.width * getFishEffectiveScale(fish, species, now);
    const height = width * (image.height / image.width);
    const shellBounds = getTankShellBounds();
    const topFrameBottomY = shellBounds.outerTop + 28;

    tankContext.save();
    tankContext.translate(pose.x + pose.swayX, pose.y);
    tankContext.scale(pose.facingScaleX ?? (pose.direction < 0 ? -1 : 1), 1);
    tankContext.rotate(pose.tilt);
    tankContext.scale(pose.bodyScaleX, pose.bodyScaleY);

    const healthRatio = getFishHealthRatio(fish, species);
    const grayscalePercent = Math.round((1 - healthRatio) * 100);
    tankContext.filter = `grayscale(${grayscalePercent}%)`;
    tankContext.drawImage(image, -width / 2 + pose.wiggle * width * 0.018, -height / 2, width, height);
    tankContext.filter = "none";
    drawFishHeldGravelPebble(fish, species, now, pose, width, height);
    tankContext.restore();

    if (pose.isDead || fish.healthUnits === 1) {
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
  if (getVisibleGrimeDirtiness(dirtiness) <= 0 && runtime.scrubStamps.length === 0) {
    return;
  }

  const grimeBaseCacheKey = getGrimeBaseCacheKey(dirtiness);
  if (runtime.grimeBaseCacheKey !== grimeBaseCacheKey) {
    renderGrimeBaseCanvas(dirtiness);
    runtime.grimeBaseCacheKey = grimeBaseCacheKey;
  }

  grimeContext.drawImage(runtime.grimeBaseCanvas, 0, 0, TANK_WIDTH, TANK_HEIGHT);

  if (runtime.scrubStamps.length) {
    grimeContext.save();
    grimeContext.globalCompositeOperation = "destination-out";
    grimeContext.drawImage(runtime.scrubMaskCanvas, 0, 0, TANK_WIDTH, TANK_HEIGHT);
    grimeContext.restore();
  }
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
  const sickMotionBoost = isFishSickOrDying(fish) ? 1.22 : 1;
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
  const wiggle = Math.sin(wiggleClock + fish.phase * Math.PI * 2) * sickMotionBoost;
  const glide = Math.sin(wiggleClock * 0.48 + fish.phase * Math.PI * 1.4) * sickMotionBoost;
  const entryProgress = fish.entryStartedAt && fish.entryDurationMs > 0
    ? clamp((now - fish.entryStartedAt) / fish.entryDurationMs, 0, 1)
    : null;
  const easedEntry = entryProgress === null ? null : 1 - Math.pow(1 - entryProgress, 3);
  const renderYNorm = easedEntry === null || fish.entryFromYNorm === null
    ? fish.yNorm
    : fish.entryFromYNorm + (fish.yNorm - fish.entryFromYNorm) * easedEntry;
  const x = fish.xNorm * TANK_WIDTH;
  const y = renderYNorm * TANK_HEIGHT
    + Math.sin(wiggleClock * (0.2 + species.bobSpeed * 0.16) + fish.phase * Math.PI * 2) * (0.9 + motionLevel * 4.4) * sickMotionBoost
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
  return clamp((now - state.lastCleanedAt) / getFilterMaxDirtyDurationMs(), 0, 1);
}

function getFilterProfile(filterKey = state?.selectedFilterAsset) {
  const filter = runtime.filterMap.get(filterKey) || runtime.filterMap.get(getDefaultFilterKey()) || {};
  return {
    cleanDays: Math.max(BASE_TANK_DIRTY_DAYS, Number(filter.cleanDays) || BASE_TANK_DIRTY_DAYS),
    comfortBoost: clamp(Number(filter.comfortBoost) || 0, 0, 0.25),
    cost: Math.max(0, Math.floor(Number(filter.cost) || 0)),
    flow: clamp(Number(filter.flow) || 1, 0.8, 1.3),
    purchasable: Boolean(filter.purchasable),
    tier: Math.max(0, Math.floor(Number(filter.tier) || 0))
  };
}

function getFilterAssistPercent(filterKey = state?.selectedFilterAsset) {
  const profile = getFilterProfile(filterKey);
  return Math.round((1 - BASE_TANK_DIRTY_DAYS / Math.max(BASE_TANK_DIRTY_DAYS, profile.cleanDays)) * 100);
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

function rgbaString({ r, g, b }, alpha = 1) {
  return `rgba(${clamp(Math.round(r), 0, 255)}, ${clamp(Math.round(g), 0, 255)}, ${clamp(Math.round(b), 0, 255)}, ${clamp(alpha, 0, 1).toFixed(3)})`;
}

function getBubbleOrbPalette(color = DEFAULT_BUBBLER_BUBBLE_COLOR) {
  const normalizedColor = normalizeHexColor(color) || DEFAULT_BUBBLER_BUBBLE_COLOR;
  const baseRgb = hexToRgb(normalizedColor) || hexToRgb(DEFAULT_BUBBLER_BUBBLE_COLOR);
  const fillRgb = hexToRgb(mixColors(normalizedColor, "#FFFFFF", 0.18)) || baseRgb;
  const strokeRgb = hexToRgb(mixColors(normalizedColor, "#FFFFFF", 0.34)) || baseRgb;
  const highlightRgb = hexToRgb(mixColors(normalizedColor, "#FFF8EE", 0.58)) || strokeRgb;
  const glowRgb = hexToRgb(mixColors(normalizedColor, "#000000", 0.08)) || baseRgb;
  return {
    tint: rgbaString(baseRgb, 0.98),
    glow: rgbaString(glowRgb, 0.16),
    fill: rgbaString(fillRgb, 0.28),
    stroke: rgbaString(strokeRgb, 0.86),
    highlight: rgbaString(highlightRgb, 0.34)
  };
}

function getOptionalBubbleOrbSprite() {
  return runtime.images.get(resolveAppUrl(OPTIONAL_BUBBLE_ORB_ASSET_PATH)) || null;
}

function getTintedBubbleOrbSprite(palette) {
  const sprite = getOptionalBubbleOrbSprite();
  if (!sprite?.width || !sprite?.height) {
    return null;
  }

  const cacheKey = [
    palette?.tint || "",
    palette?.fill || "",
    palette?.stroke || "",
    palette?.highlight || ""
  ].join("|");
  const cached = runtime.bubbleOrbTintCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const canvas = document.createElement("canvas");
  canvas.width = sprite.width;
  canvas.height = sprite.height;
  const context = canvas.getContext("2d");
  if (!context) {
    return null;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(sprite, 0, 0, canvas.width, canvas.height);

  const tintColor = palette?.tint || palette?.stroke || palette?.fill || null;
  if (tintColor) {
    context.save();
    context.globalCompositeOperation = "source-in";
    context.fillStyle = tintColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.restore();
  }

  if (palette?.stroke) {
    context.save();
    context.globalCompositeOperation = "screen";
    context.globalAlpha = 0.18;
    context.fillStyle = palette.stroke;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.restore();
  }

  // Bring back a small amount of the source sprite so the result still reads as glass.
  context.save();
  context.globalCompositeOperation = "screen";
  context.globalAlpha = 0.1;
  context.drawImage(sprite, 0, 0, canvas.width, canvas.height);
  context.restore();

  if (palette?.highlight) {
    context.save();
    context.globalCompositeOperation = "screen";
    context.globalAlpha = 0.12;
    context.fillStyle = palette.highlight;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.restore();
  }

  // Re-apply the source sprite alpha so tint passes cannot leak into the transparent bounds.
  context.save();
  context.globalCompositeOperation = "destination-in";
  context.drawImage(sprite, 0, 0, canvas.width, canvas.height);
  context.restore();

  runtime.bubbleOrbTintCache.set(cacheKey, canvas);
  return canvas;
}

function drawBubbleOrb(x, y, radius, alpha, stretch = 1, palette = null) {
  const resolvedPalette = palette || {
    tint: "rgba(255, 255, 255, 0.98)",
    glow: "rgba(220, 240, 255, 0.080)",
    fill: "rgba(255, 255, 255, 0.16)",
    stroke: "rgba(240, 250, 255, 0.700)",
    highlight: "rgba(250, 253, 255, 0.400)"
  };
  const bubbleSprite = getTintedBubbleOrbSprite(resolvedPalette);
  tankContext.save();
  tankContext.globalAlpha = alpha;
  if (!bubbleSprite && resolvedPalette.glow) {
    tankContext.beginPath();
    tankContext.ellipse(x, y, radius * stretch * 1.45, radius * 1.45, 0, 0, Math.PI * 2);
    tankContext.fillStyle = resolvedPalette.glow;
    tankContext.fill();
  }
  if (bubbleSprite) {
    const drawWidth = Math.max(2, radius * stretch * 2.3);
    const drawHeight = Math.max(2, radius * 2.3);
    tankContext.drawImage(bubbleSprite, x - drawWidth / 2, y - drawHeight / 2, drawWidth, drawHeight);
    tankContext.restore();
    return;
  }
  tankContext.beginPath();
  tankContext.ellipse(x, y, radius * stretch, radius, 0, 0, Math.PI * 2);
  tankContext.fillStyle = resolvedPalette.fill;
  tankContext.fill();
  tankContext.lineWidth = Math.max(1, radius * 0.18);
  tankContext.strokeStyle = resolvedPalette.stroke;
  tankContext.stroke();
  tankContext.fillStyle = resolvedPalette.highlight;
  tankContext.beginPath();
  tankContext.ellipse(x - radius * 0.3, y - radius * 0.32, radius * 0.2, radius * 0.16, -0.2, 0, Math.PI * 2);
  tankContext.fill();
  tankContext.restore();
}

function getBubblerSpoutSourceOffsetRatio(imagePath, spout) {
  const cacheKey = `${imagePath}|${spout.horizontalLocation ?? ""}|${spout.horizontalOffsetPx ?? ""}`;
  const cached = runtime.bubblerSpoutOriginCache.get(cacheKey);
  if (Number.isFinite(cached)) {
    return cached;
  }

  const mask = getImageAlphaMask(imagePath);
  if (!mask?.width || !mask?.height) {
    runtime.bubblerSpoutOriginCache.set(cacheKey, 0.18);
    return 0.18;
  }

  const sampleX = Number.isFinite(spout.horizontalOffsetPx)
    ? clamp(Math.round(spout.horizontalOffsetPx), 0, mask.width - 1)
    : clamp(Math.round((spout.horizontalLocation ?? 0.5) * (mask.width - 1)), 0, mask.width - 1);
  let offsetRatio = 0.18;

  for (let y = 0; y < mask.height; y += 1) {
    const alpha = mask.alpha[(y * mask.width + sampleX) * 4 + 3];
    if (alpha >= ALPHA_HIT_THRESHOLD) {
      offsetRatio = clamp((y + 1) / mask.height, 0.02, 0.95);
      break;
    }
  }

  runtime.bubblerSpoutOriginCache.set(cacheKey, offsetRatio);
  return offsetRatio;
}

function drawDecorBubblerEffect(item, decor, image, now = Date.now(), options = {}) {
  const bubbler = decor?.bubbler || getDecorBubblerMeta(item?.decorKey);
  if (!item || !decor || !image || !bubbler?.spouts?.length || getDecorTankLayer(item) !== BUBBLER_LAYER) {
    return;
  }

  const alphaScale = clamp(Number.isFinite(Number(options.alphaScale)) ? Number(options.alphaScale) : 1, 0, 1);
  const width = decor.width * item.scale;
  const height = width * (image.height / image.width);
  const drawX = item.xNorm * TANK_WIDTH - width / 2;
  const drawY = item.yNorm * TANK_HEIGHT - height;

  bubbler.spouts.forEach((spout, spoutIndex) => {
    const spoutBubbleColors = Array.isArray(spout.bubbleColors) && spout.bubbleColors.length
      ? spout.bubbleColors
      : [spout.bubbleColor || DEFAULT_BUBBLER_BUBBLE_COLOR];
    const spoutPalettes = spoutBubbleColors.map((color) => getBubbleOrbPalette(color));
    const intensity = clamp(Number(spout.intensity) || DEFAULT_BUBBLER_INTENSITY, 0.15, MAX_BUBBLER_INTENSITY);
    const bubbleOpacity = clamp(Number(spout.bubbleOpacity) || DEFAULT_BUBBLER_BUBBLE_OPACITY, 0.1, 3);
    const speed = clamp(Number(spout.speed) || DEFAULT_BUBBLER_SPEED, MIN_BUBBLER_SPEED, MAX_BUBBLER_SPEED);
    const sourceX = Number.isFinite(spout.horizontalOffsetPx)
      ? drawX + spout.horizontalOffsetPx * item.scale
      : drawX + width * (spout.horizontalLocation ?? 0.5);
    const sourceYOffsetRatio = getBubblerSpoutSourceOffsetRatio(
      decor.path,
      {
        horizontalLocation: spout.horizontalLocation,
        horizontalOffsetPx: Number.isFinite(spout.horizontalOffsetPx)
          ? spout.horizontalOffsetPx
          : null
      }
    );
    const sourceY = drawY + height * sourceYOffsetRatio + Math.max(2, item.scale * 2);
    const spoutWidthPx = Math.max(0, spout.spread * item.scale);
    const fadeDistancePx = Math.max(24, spout.fadeDistance);
    const totalBubbleCount = clamp(
      Math.round(8 + intensity * 4.2 + spoutWidthPx / 18),
      8,
      MAX_BUBBLER_VISIBLE_BUBBLES_PER_SPOUT
    );
    const cadenceMs = clamp(
      getBubblerCadenceFromIntensity(intensity) / speed,
      MIN_BUBBLER_STREAM_CADENCE_MS,
      MAX_BUBBLER_STREAM_CADENCE_MS
    );
    const wobblePx = Math.min(2.1, 0.55 + intensity * 0.06);
    const availableTravelPx = Math.max(24, sourceY - (WATER_SURFACE_Y + 6));
    const renderedBubbles = [];

    for (let slotIndex = 0; slotIndex < totalBubbleCount; slotIndex += 1) {
      const slotSeed = hashStringToUint32(
        `${item.id}|${item.decorKey}|${spoutIndex}|slot|${slotIndex}`
      );
      const slotRand = mulberry32(slotSeed ^ 0x27d4eb2d);
      const slotCadenceMs = cadenceMs * randomBetweenWith(slotRand, 0.84, 1.16);
      const slotWobbleCadenceMs = Math.max(
        180,
        slotCadenceMs * randomBetweenWith(slotRand, 0.78, 1.28)
      );
      const slotPhaseOffset = randomBetweenWith(slotRand, 0, 1);
      const slotWobblePx = wobblePx * randomBetweenWith(slotRand, 0.45, 1.15);

      const rawPhase = (now / slotCadenceMs) + slotPhaseOffset;
      const emissionCycle = Math.floor(rawPhase);
      const phase = rawPhase - emissionCycle;
      const riseProgress = Math.pow(phase, 0.94);
      const emissionSeed = hashStringToUint32(
        `${item.id}|${item.decorKey}|${spoutIndex}|${slotIndex}|${emissionCycle}`
      );
      const emissionRand = mulberry32(emissionSeed ^ 0x5f3759df);
      const colorRand = mulberry32(emissionSeed ^ 0x85ebca6b);
      const depthRand = mulberry32(emissionSeed ^ 0x9e3779b9);
      const palette = spoutPalettes[
        clamp(Math.floor(randomBetweenWith(colorRand, 0, 1) * spoutPalettes.length), 0, spoutPalettes.length - 1)
      ] || spoutPalettes[0] || getBubbleOrbPalette(DEFAULT_BUBBLER_BUBBLE_COLOR);
      const depth = Math.pow(randomBetweenWith(depthRand, 0, 1), 0.88);
      const depthScale = 0.72 + depth * 0.52;
      const depthAlphaScale = 0.48 + depth * 0.74;
      const depthWobblePx = slotWobblePx * (0.58 + depth * 0.62);
      const spawnSpreadBias = (randomBetweenWith(emissionRand, -1, 1) + randomBetweenWith(emissionRand, -1, 1)) * 0.5;
      const spawnOffsetX = spawnSpreadBias * spoutWidthPx * 0.5;
      const trajectoryDriftPx = randomBetweenWith(emissionRand, -1, 1) * Math.min(4.5, spoutWidthPx * 0.2);
      const sway = Math.sin(
        now / (slotWobbleCadenceMs + (slotIndex % 5) * 24) + slotIndex * 0.93 + spoutIndex * 0.9
      ) * depthWobblePx
        + Math.sin(phase * 10.2 + slotIndex * 0.31) * depthWobblePx * 0.28;
      const x = sourceX + spawnOffsetX + trajectoryDriftPx * riseProgress + sway;
      const travelPx = Math.min(
        fadeDistancePx * randomBetweenWith(emissionRand, 0.88, 1.06),
        availableTravelPx
      );
      const y = sourceY - riseProgress * travelPx;

      const spawnFade = phase < 0.08 ? phase / 0.08 : 1;
      const fadeWindowPx = clamp(travelPx * 0.34, 26, 110);
      const fadeStartProgress = clamp(1 - fadeWindowPx / Math.max(1, travelPx), 0.35, 0.92);
      const distanceFade = riseProgress <= fadeStartProgress
        ? 1
        : Math.pow(clamp(1 - (riseProgress - fadeStartProgress) / Math.max(0.0001, 1 - fadeStartProgress), 0, 1), 1.8);
      const alpha = clamp(
        (0.16 + intensity * 0.018) * distanceFade * spawnFade * alphaScale * bubbleOpacity * depthAlphaScale,
        0,
        1
      );
      if (alpha <= 0.008) {
        continue;
      }

      const sizeBias = Math.pow(randomBetweenWith(emissionRand, 0, 1), 1.45);
      const occasionalLargeBubble = randomBetweenWith(emissionRand, 0, 1) > 0.9 ? 1.18 : 1;
      const radiusMin = 0.95 + intensity * 0.03;
      const radiusMax = 1.65 + intensity * 0.08 + Math.min(0.8, spoutWidthPx * 0.02);
      const radius = clamp(
        (radiusMin + (radiusMax - radiusMin) * sizeBias) * occasionalLargeBubble,
        1,
        5.4
      );
      const fadeScale = 0.72 + distanceFade * 0.28;
      const fadedRadius = radius * fadeScale * depthScale;
      const stretch = 1
        + riseProgress * 0.2
        + Math.min(0.34, intensity * 0.015)
        + depth * 0.06
        + randomBetweenWith(emissionRand, -0.04, 0.06);
      renderedBubbles.push({
        depth,
        x,
        y,
        radius: fadedRadius,
        alpha,
        stretch,
        palette
      });
    }

    renderedBubbles
      .sort((left, right) => left.depth - right.depth || left.y - right.y)
      .forEach((bubble) => {
        drawBubbleOrb(bubble.x, bubble.y, bubble.radius, bubble.alpha, bubble.stretch, bubble.palette);
      });
  });
}

function drawDecorBubbleStreams(now) {
  if (!state.placedDecor.length) {
    return;
  }

  for (const item of state.placedDecor) {
    if (isBubblerDecorKey(item.decorKey)) {
      continue;
    }

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
  const overrideSprite = getOptionalBubbleOrbSprite();
  if (overrideSprite) {
    return overrideSprite;
  }

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
  if (getDeadTankFish().length || dirtiness >= CRITICAL_TANK_DIRTINESS) {
    return { value: 0, label: "Critical" };
  }

  const cleanlinessScore = clamp(1 - dirtiness * 1.08, 0, 1);
  const healthScore = getFishHealthRatio(fish);
  const servedToday = getTodaysMealSlots(now).filter((slot) => Boolean(state.feedHistory[slot.key])).length / 2;
  const decorScore = clamp(state.placedDecor.length / Math.max(1, state.fish.length + 1), 0, 1);
  const filterBoost = getFilterProfile().comfortBoost;
  const comfortValue = clamp(
    healthScore * 0.38
      + cleanlinessScore * 0.34
      + servedToday * 0.12
      + decorScore * 0.08
      + filterBoost,
    0,
    1
  );
  const label = comfortValue >= 0.84
    ? "Cozy"
    : comfortValue >= 0.64
      ? "Content"
      : comfortValue >= 0.4
        ? "Uneasy"
        : comfortValue >= 0.16
          ? "Stressed"
          : "Panicked";
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
    setFishDesiredTankLayer(fish, getFishActiveCaveInsideLayer(fish, plan.backLayer));
    return true;
  }

  if (fish.caveState === "inside") {
    fish.targetXNorm = plan.inside.xNorm;
    fish.targetYNorm = plan.inside.yNorm;
    fish.targetAt = Math.max(Number(fish.caveInsideUntil) || 0, now + 2200);
    setFishDesiredTankLayer(fish, getFishActiveCaveInsideLayer(fish, plan.backLayer));
    return true;
  }

  if (fish.caveState === "exit") {
    const nodeIndex = Number.isFinite(fish.cavePathIndex) ? fish.cavePathIndex : 0;
    const node = plan.exitPathNodes[nodeIndex] || plan.mouth;
    fish.targetXNorm = node.xNorm;
    fish.targetYNorm = node.yNorm;
    fish.targetAt = now + 2200 + Math.hypot(fish.xNorm - fish.targetXNorm, fish.yNorm - fish.targetYNorm) * 14000;
    setFishDesiredTankLayer(fish, getFishActiveCaveInsideLayer(fish, plan.backLayer));
    return true;
  }

  if (fish.caveState === "depart") {
    fish.targetXNorm = plan.mouth.xNorm;
    fish.targetYNorm = plan.mouth.yNorm;
    fish.targetAt = now + 1800 + Math.hypot(fish.xNorm - plan.mouth.xNorm, fish.yNorm - plan.mouth.yNorm) * 14000;
    setFishDesiredTankLayer(fish, getFishActiveCaveInsideLayer(fish, plan.backLayer));
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

function getDebugCaveSeatSequence(item, fish, species, now = Date.now(), anchorPoint = null) {
  if (!item || !fish || !species) {
    return [];
  }

  const origin = anchorPoint || {
    xNorm: fish.xNorm,
    yNorm: fish.yNorm
  };

  return getCaveSeatRegions(item)
    .filter((seat) => !isCaveSeatOccupied(item.id, seat.id, fish.id))
    .filter((seat) => doesFishFitCaveRegionSize(seat, fish, species, 0.45))
    .map((seat) => {
      const idlePoint = pickCaveSeatIdleTarget(item, seat, fish, species, now) || {
        xNorm: seat.xNorm,
        yNorm: seat.yNorm
      };
      if (!doesFishFitAtCavePoint(item, fish, species, now, idlePoint, fish.direction || 1, CAVE_PLAN_SAMPLE_STEP_PX)) {
        return null;
      }

      return {
        id: seat.id,
        distance: Math.hypot(idlePoint.xNorm - origin.xNorm, idlePoint.yNorm - origin.yNorm),
        xNorm: idlePoint.xNorm,
        yNorm: idlePoint.yNorm
      };
    })
    .filter(Boolean)
    .sort((left, right) => {
      if (Math.abs(left.distance - right.distance) > 0.0005) {
        return left.distance - right.distance;
      }

      if (Math.abs(left.yNorm - right.yNorm) > 0.0005) {
        return left.yNorm - right.yNorm;
      }

      return left.xNorm - right.xNorm;
    })
    .map((seat) => seat.id);
}

function findClosestCaveNavCandidate(nav, point, fish, species, now, fitCache, radiusPx = 96) {
  if (!nav || !point || !fish || !species) {
    return null;
  }

  const worldX = Number.isFinite(Number(point.x))
    ? Number(point.x)
    : (Number.isFinite(Number(point.xNorm)) ? Number(point.xNorm) * TANK_WIDTH : Number.NaN);
  const worldY = Number.isFinite(Number(point.y))
    ? Number(point.y)
    : (Number.isFinite(Number(point.yNorm)) ? Number(point.yNorm) * TANK_HEIGHT : Number.NaN);

  if (!Number.isFinite(worldX) || !Number.isFinite(worldY)) {
    return null;
  }

  return collectCaveNavCandidatesNearWorldPoint(nav, worldX, worldY, radiusPx, (index, candidatePoint, distancePx) => {
    if (!canFishOccupyCaveNavIndex(nav, index, fish, species, now, fitCache)) {
      return false;
    }

    return distancePx;
  })[0] || null;
}

function buildCaveInteriorRouteNodes(item, fish, species, fromPoint, toPoint, now = Date.now()) {
  if (!item || !fish || !species || !fromPoint || !toPoint) {
    return null;
  }

  const startPoint = {
    xNorm: clamp(fromPoint.xNorm, 0.08, 0.92),
    yNorm: clamp(fromPoint.yNorm, 0.14, 0.8)
  };
  const endPoint = {
    xNorm: clamp(toPoint.xNorm, 0.08, 0.92),
    yNorm: clamp(toPoint.yNorm, 0.14, 0.8)
  };

  if (pathStaysInsideCave(item, fish, species, now, startPoint, endPoint, CAVE_PLAN_SAMPLE_STEP_PX, CAVE_PLAN_SEGMENT_STEP_PX)) {
    return [endPoint];
  }

  const nav = getCaveNavigationData(item);
  if (!nav) {
    return null;
  }

  const fitCache = new Int8Array(nav.cols * nav.rows);
  fitCache.fill(-1);
  const scanRadius = Math.max(CAVE_PORTAL_SCAN_RADIUS_PX * 6, 96);
  const startCandidate = findClosestCaveNavCandidate(nav, startPoint, fish, species, now, fitCache, scanRadius);
  if (!startCandidate) {
    return null;
  }

  const reachable = buildReachableCaveRegion(nav, startCandidate.index, fish, species, now, fitCache);
  if (!reachable) {
    return null;
  }

  const endCandidate = collectCaveNavCandidatesNearWorldPoint(
    nav,
    endPoint.xNorm * TANK_WIDTH,
    endPoint.yNorm * TANK_HEIGHT,
    scanRadius,
    (index, candidatePoint, distancePx) => {
      if (!reachable.visited[index] || !canFishOccupyCaveNavIndex(nav, index, fish, species, now, fitCache)) {
        return false;
      }

      return distancePx;
    }
  )[0] || null;
  if (!endCandidate) {
    return null;
  }

  const pathIndices = buildCavePathIndices(reachable.parents, startCandidate.index, endCandidate.index);
  if (!pathIndices.length) {
    return null;
  }

  let nodes = compressCavePathNodes(
    pathIndices.map((index) => {
      const col = index % nav.cols;
      const row = Math.floor(index / nav.cols);
      return getCaveNavCellCenter(nav, col, row);
    })
  );
  if (!nodes.length) {
    nodes = [{ ...endCandidate.point }];
  }

  while (
    nodes.length > 1 &&
    Math.hypot(nodes[0].xNorm - startPoint.xNorm, nodes[0].yNorm - startPoint.yNorm) <= 0.012
  ) {
    nodes.shift();
  }

  const lastNode = nodes[nodes.length - 1];
  if (!lastNode) {
    return null;
  }

  if (
    Math.hypot(lastNode.xNorm - endPoint.xNorm, lastNode.yNorm - endPoint.yNorm) > 0.006 &&
    pathStaysInsideCave(item, fish, species, now, lastNode, endPoint, CAVE_PLAN_SAMPLE_STEP_PX, CAVE_PLAN_SEGMENT_STEP_PX)
  ) {
    nodes.push(endPoint);
  } else if (Math.hypot(lastNode.xNorm - endPoint.xNorm, lastNode.yNorm - endPoint.yNorm) <= 0.006) {
    nodes[nodes.length - 1] = endPoint;
  }

  return nodes;
}

function clearDebugCavePathState(plan) {
  if (!plan) {
    return;
  }

  plan.debugPathNodes = [];
  plan.debugPathIndex = null;
}

function appendUniqueDebugCaveNodes(targetNodes, nodes) {
  if (!Array.isArray(targetNodes) || !Array.isArray(nodes)) {
    return targetNodes;
  }

  for (const node of nodes) {
    if (!node) {
      continue;
    }

    const nextNode = {
      xNorm: clamp(node.xNorm, 0.08, 0.92),
      yNorm: clamp(node.yNorm, 0.14, 0.8)
    };
    const previousNode = targetNodes[targetNodes.length - 1] || null;
    if (previousNode && Math.hypot(previousNode.xNorm - nextNode.xNorm, previousNode.yNorm - nextNode.yNorm) <= 0.003) {
      continue;
    }

    targetNodes.push(nextNode);
  }

  return targetNodes;
}

function buildCheapDebugCaveSegmentNodes(item, fish, species, fromPoint, toPoint, now = Date.now(), viaPoint = null) {
  if (!item || !fish || !species || !fromPoint || !toPoint) {
    return [];
  }

  const startPoint = {
    xNorm: clamp(fromPoint.xNorm, 0.08, 0.92),
    yNorm: clamp(fromPoint.yNorm, 0.14, 0.8)
  };
  const endPoint = {
    xNorm: clamp(toPoint.xNorm, 0.08, 0.92),
    yNorm: clamp(toPoint.yNorm, 0.14, 0.8)
  };

  if (Math.hypot(startPoint.xNorm - endPoint.xNorm, startPoint.yNorm - endPoint.yNorm) <= 0.0035) {
    return [endPoint];
  }

  if (pathStaysInsideCave(item, fish, species, now, startPoint, endPoint, CAVE_PLAN_SAMPLE_STEP_PX, CAVE_PLAN_SEGMENT_STEP_PX)) {
    return [endPoint];
  }

  const normalizedViaPoint = viaPoint
    ? {
      xNorm: clamp(viaPoint.xNorm, 0.08, 0.92),
      yNorm: clamp(viaPoint.yNorm, 0.14, 0.8)
    }
    : null;
  if (
    normalizedViaPoint &&
    Math.hypot(startPoint.xNorm - normalizedViaPoint.xNorm, startPoint.yNorm - normalizedViaPoint.yNorm) > 0.004 &&
    Math.hypot(normalizedViaPoint.xNorm - endPoint.xNorm, normalizedViaPoint.yNorm - endPoint.yNorm) > 0.004 &&
    pathStaysInsideCave(item, fish, species, now, startPoint, normalizedViaPoint, CAVE_PLAN_SAMPLE_STEP_PX, CAVE_PLAN_SEGMENT_STEP_PX) &&
    pathStaysInsideCave(item, fish, species, now, normalizedViaPoint, endPoint, CAVE_PLAN_SAMPLE_STEP_PX, CAVE_PLAN_SEGMENT_STEP_PX)
  ) {
    return [normalizedViaPoint, endPoint];
  }

  const fallbackNodes = buildDebugFallbackCavePathNodes(item, startPoint, endPoint);
  if (!fallbackNodes.length) {
    return [];
  }

  const validatedNodes = [];
  let previousPoint = startPoint;
  for (const node of fallbackNodes) {
    const normalizedNode = {
      xNorm: clamp(node.xNorm, 0.08, 0.92),
      yNorm: clamp(node.yNorm, 0.14, 0.8)
    };
    if (Math.hypot(previousPoint.xNorm - normalizedNode.xNorm, previousPoint.yNorm - normalizedNode.yNorm) <= 0.0035) {
      continue;
    }

    if (!pathStaysInsideCave(item, fish, species, now, previousPoint, normalizedNode, CAVE_PLAN_SAMPLE_STEP_PX, CAVE_PLAN_SEGMENT_STEP_PX)) {
      return [];
    }

    validatedNodes.push(normalizedNode);
    previousPoint = normalizedNode;
  }

  return validatedNodes;
}

function collectCheapDebugCaveRoamCandidates(item, fish, species, plan, seatRegions, now = Date.now()) {
  if (!item || !fish || !species || !plan) {
    return [];
  }

  const profile = getCaveBehaviorProfile(item.decorKey);
  const seen = new Set();
  const candidates = [];
  const interiorCenter = plan.inside || plan.mouth || {
    xNorm: fish.xNorm,
    yNorm: fish.yNorm
  };
  const seatList = Array.isArray(seatRegions) ? seatRegions : [];
  const addCandidate = (point, weight = 0) => {
    if (!point || !Number.isFinite(point.xNorm) || !Number.isFinite(point.yNorm)) {
      return;
    }

    const candidatePoint = {
      xNorm: clamp(point.xNorm, 0.08, 0.92),
      yNorm: clamp(point.yNorm, 0.14, 0.8)
    };
    const cacheKey = `${candidatePoint.xNorm.toFixed(4)}|${candidatePoint.yNorm.toFixed(4)}`;
    if (seen.has(cacheKey)) {
      return;
    }
    seen.add(cacheKey);

    const candidateDirection = Math.abs(candidatePoint.xNorm - interiorCenter.xNorm) > 0.001
      ? (candidatePoint.xNorm >= interiorCenter.xNorm ? 1 : -1)
      : (fish.direction || 1);
    if (!doesFishFitAtCavePoint(item, fish, species, now, candidatePoint, candidateDirection, CAVE_PLAN_SAMPLE_STEP_PX)) {
      return;
    }

    const distanceFromSeat = seatList.length
      ? seatList.reduce((bestDistance, seat) => Math.min(bestDistance, Math.hypot(candidatePoint.xNorm - seat.xNorm, candidatePoint.yNorm - seat.yNorm)), Number.POSITIVE_INFINITY)
      : Number.POSITIVE_INFINITY;
    if (distanceFromSeat < 0.018) {
      return;
    }

    const distanceFromCenter = Math.hypot(candidatePoint.xNorm - interiorCenter.xNorm, candidatePoint.yNorm - interiorCenter.yNorm);
    if (distanceFromCenter < 0.012) {
      return;
    }

    candidates.push({
      point: candidatePoint,
      score: distanceFromCenter + weight + Math.random() * 0.002
    });
  };

  if (Array.isArray(profile?.interiorZones)) {
    for (const zone of profile.interiorZones) {
      addCandidate(mapDecorLocalPointToTankNorm(item, (zone.xMin + zone.xMax) / 2, (zone.yMin + zone.yMax) / 2), 0.05);
      addCandidate(mapDecorLocalPointToTankNorm(item, zone.xMin + (zone.xMax - zone.xMin) * 0.22, (zone.yMin + zone.yMax) / 2), 0.03);
      addCandidate(mapDecorLocalPointToTankNorm(item, zone.xMin + (zone.xMax - zone.xMin) * 0.78, (zone.yMin + zone.yMax) / 2), 0.03);
    }
  }

  for (const slot of getCaveInsideSlots(profile)) {
    addCandidate(mapDecorLocalPointToTankNorm(item, slot.x, slot.y), 0.04);
  }

  const interiorDescriptor = getCaveInteriorContainmentDescriptor(item);
  if (interiorDescriptor?.bounds) {
    const spanXNorm = clamp(((interiorDescriptor.bounds.right - interiorDescriptor.bounds.left) / TANK_WIDTH) * 0.18, 0.014, 0.06);
    const spanYNorm = clamp(((interiorDescriptor.bounds.bottom - interiorDescriptor.bounds.top) / TANK_HEIGHT) * 0.16, 0.012, 0.045);
    const offsets = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 0.8],
      [-0.65, -0.55],
      [0.65, -0.55]
    ];
    for (const [offsetX, offsetY] of offsets) {
      addCandidate({
        xNorm: interiorCenter.xNorm + spanXNorm * offsetX,
        yNorm: interiorCenter.yNorm + spanYNorm * offsetY
      }, 0.02);
    }
  }

  candidates.sort((left, right) => right.score - left.score);
  const selectedPoints = [];
  for (const candidate of candidates) {
    if (selectedPoints.some((point) => Math.hypot(point.xNorm - candidate.point.xNorm, point.yNorm - candidate.point.yNorm) < 0.015)) {
      continue;
    }

    selectedPoints.push(candidate.point);
    if (selectedPoints.length >= 3) {
      break;
    }
  }

  return selectedPoints;
}

function ensureDebugCaveSequencePrepared(fish, species, decorItem, plan, mouthNode, now = Date.now()) {
  if (!fish || !species || !decorItem || !plan) {
    return false;
  }

  if (plan.debugPrepared) {
    return true;
  }

  const seatRegions = getCaveSeatRegions(decorItem);
  if (!Array.isArray(plan.debugSeatOrder)) {
    plan.debugSeatOrder = getDebugCaveSeatSequence(decorItem, fish, species, now, plan.inside || mouthNode);
  }

  const interiorCenter = plan.inside || mouthNode || {
    xNorm: fish.xNorm,
    yNorm: fish.yNorm
  };
  const roamPathNodes = [];
  let anchorPoint = interiorCenter;
  for (const roamPoint of collectCheapDebugCaveRoamCandidates(decorItem, fish, species, plan, seatRegions, now)) {
    const segmentNodes = buildCheapDebugCaveSegmentNodes(decorItem, fish, species, anchorPoint, roamPoint, now, interiorCenter);
    if (!segmentNodes.length) {
      continue;
    }

    appendUniqueDebugCaveNodes(roamPathNodes, segmentNodes);
    anchorPoint = roamPathNodes[roamPathNodes.length - 1] || anchorPoint;
  }

  if (!roamPathNodes.length && interiorCenter) {
    roamPathNodes.push({
      xNorm: clamp(interiorCenter.xNorm, 0.08, 0.92),
      yNorm: clamp(interiorCenter.yNorm, 0.14, 0.8)
    });
  }

  const seatSteps = [];
  for (const seatId of plan.debugSeatOrder) {
    const seatRegion = findRegionById(seatRegions, seatId);
    if (!seatRegion || !doesFishFitCaveRegionSize(seatRegion, fish, species, 0.45)) {
      continue;
    }

    const seatDirection = Math.abs(seatRegion.xNorm - anchorPoint.xNorm) > 0.001
      ? (seatRegion.xNorm >= anchorPoint.xNorm ? 1 : -1)
      : (fish.direction || 1);
    const seatPoint = pickCaveSeatIdleTarget(decorItem, seatRegion, fish, species, now, seatDirection) || {
      xNorm: seatRegion.xNorm,
      yNorm: seatRegion.yNorm
    };
    if (!doesFishFitAtCavePoint(decorItem, fish, species, now, seatPoint, seatDirection, CAVE_PLAN_SAMPLE_STEP_PX)) {
      continue;
    }

    const pathNodes = buildCheapDebugCaveSegmentNodes(decorItem, fish, species, anchorPoint, seatPoint, now, interiorCenter);
    seatSteps.push({
      id: seatRegion.id,
      point: {
        xNorm: clamp(seatPoint.xNorm, 0.08, 0.92),
        yNorm: clamp(seatPoint.yNorm, 0.14, 0.8)
      },
      pathNodes: pathNodes.length ? pathNodes : [{
        xNorm: clamp(seatPoint.xNorm, 0.08, 0.92),
        yNorm: clamp(seatPoint.yNorm, 0.14, 0.8)
      }]
    });
    anchorPoint = seatSteps[seatSteps.length - 1].point;
  }

  plan.debugPrepared = true;
  plan.debugRoamStarted = false;
  plan.debugRoamPathNodes = roamPathNodes;
  plan.debugSeatSteps = seatSteps;
  return true;
}

function startDebugCavePath(fish, plan, nodes, now = Date.now(), extraMs = 900) {
  clearDebugCavePathState(plan);
  if (!fish || !plan || !Array.isArray(nodes) || !nodes.length) {
    return false;
  }

  plan.debugPathNodes = nodes.map((node) => ({
    xNorm: clamp(node.xNorm, 0.08, 0.92),
    yNorm: clamp(node.yNorm, 0.14, 0.8)
  }));
  plan.debugPathIndex = 0;
  return setFishTargetToCaveNode(fish, plan.debugPathNodes[0], now, extraMs);
}

function advanceDebugCavePath(fish, plan, now = Date.now(), extraMs = 900) {
  const nodes = Array.isArray(plan?.debugPathNodes) ? plan.debugPathNodes : [];
  if (!fish || !plan || !nodes.length) {
    return false;
  }

  const nodeIndex = Number.isFinite(plan.debugPathIndex)
    ? clamp(Math.floor(plan.debugPathIndex), 0, nodes.length - 1)
    : 0;
  const node = nodes[nodeIndex];
  if (!node) {
    clearDebugCavePathState(plan);
    return false;
  }

  if (
    !Number.isFinite(fish.targetXNorm) ||
    !Number.isFinite(fish.targetYNorm) ||
    Math.hypot(fish.targetXNorm - node.xNorm, fish.targetYNorm - node.yNorm) > 0.0005
  ) {
    setFishTargetToCaveNode(fish, node, now, extraMs);
  }

  if (Math.hypot(fish.xNorm - node.xNorm, fish.yNorm - node.yNorm) > CAVE_GENERAL_REACHED_DISTANCE_NORM) {
    return true;
  }

  const nextIndex = nodeIndex + 1;
  if (nextIndex < nodes.length) {
    plan.debugPathIndex = nextIndex;
    setFishTargetToCaveNode(fish, nodes[nextIndex], now, extraMs);
    return true;
  }

  clearDebugCavePathState(plan);
  return false;
}

function pickDebugCaveRoamPathNodes(item, fish, species, plan, now = Date.now()) {
  if (!item || !fish || !species || !plan) {
    return null;
  }

  const nav = getCaveNavigationData(item);
  if (!nav) {
    return plan.inside
      ? buildCaveInteriorRouteNodes(item, fish, species, { xNorm: fish.xNorm, yNorm: fish.yNorm }, plan.inside, now)
      : null;
  }

  const fitCache = new Int8Array(nav.cols * nav.rows);
  fitCache.fill(-1);
  const startCandidate = findClosestCaveNavCandidate(
    nav,
    { xNorm: fish.xNorm, yNorm: fish.yNorm },
    fish,
    species,
    now,
    fitCache,
    Math.max(CAVE_PORTAL_SCAN_RADIUS_PX * 7, 120)
  );
  if (!startCandidate) {
    return null;
  }

  const reachable = buildReachableCaveRegion(nav, startCandidate.index, fish, species, now, fitCache);
  if (!reachable) {
    return null;
  }

  const clearanceMap = buildReachableCaveClearanceMap(nav, reachable);
  const seatRegions = getCaveSeatRegions(item);
  let bestPoint = null;
  let bestScore = Number.NEGATIVE_INFINITY;

  for (let index = 0; index < reachable.visited.length; index += 1) {
    if (!reachable.visited[index] || !canFishOccupyCaveNavIndex(nav, index, fish, species, now, fitCache)) {
      continue;
    }

    const col = index % nav.cols;
    const row = Math.floor(index / nav.cols);
    const point = getCaveNavCellCenter(nav, col, row);
    const distanceFromFish = Math.hypot(point.xNorm - fish.xNorm, point.yNorm - fish.yNorm);
    if (distanceFromFish < 0.018) {
      continue;
    }

    const distanceFromLastTarget = plan.debugLastRoamTarget
      ? Math.hypot(point.xNorm - plan.debugLastRoamTarget.xNorm, point.yNorm - plan.debugLastRoamTarget.yNorm)
      : distanceFromFish;
    if (plan.debugLastRoamTarget && distanceFromLastTarget < 0.012) {
      continue;
    }

    const distanceFromSeat = seatRegions.length
      ? seatRegions.reduce((bestDistance, seat) => Math.min(bestDistance, Math.hypot(point.xNorm - seat.xNorm, point.yNorm - seat.yNorm)), Number.POSITIVE_INFINITY)
      : Number.POSITIVE_INFINITY;
    if (distanceFromSeat < 0.018) {
      continue;
    }

    const clearance = clearanceMap ? Math.max(0, clearanceMap[index]) : 0;
    const distanceFromInside = plan.inside
      ? Math.hypot(point.xNorm - plan.inside.xNorm, point.yNorm - plan.inside.yNorm)
      : 0;
    const score =
      distanceFromFish * 85 +
      distanceFromLastTarget * 60 +
      clearance * nav.cellSize * 2 +
      Math.min(distanceFromInside, 0.06) * 24 +
      Math.random() * 18;
    if (score > bestScore) {
      bestScore = score;
      bestPoint = point;
    }
  }

  if (!bestPoint) {
    const fallbackTarget = findReachableCaveInteriorTarget(nav, reachable, fish, species, now, fitCache);
    bestPoint = fallbackTarget?.point || plan.inside || null;
  }

  if (!bestPoint) {
    return null;
  }

  const pathNodes = buildCaveInteriorRouteNodes(
    item,
    fish,
    species,
    { xNorm: fish.xNorm, yNorm: fish.yNorm },
    bestPoint,
    now
  );
  if (!pathNodes?.length) {
    return null;
  }

  plan.debugLastRoamTarget = {
    xNorm: bestPoint.xNorm,
    yNorm: bestPoint.yNorm
  };
  return pathNodes;
}

function beginFishDebugCaveExit(fish, plan, mouthNode, now = Date.now()) {
  if (!fish || !plan || !mouthNode) {
    return false;
  }

  clearDebugCavePathState(plan);
  plan.debugPhase = "exit";
  plan.debugSeatId = null;
  plan.debugSeatPoint = null;
  plan.debugSeatHoldUntil = null;
  fish.caveSeatId = null;
  fish.caveState = "exit";
  fish.cavePathIndex = 0;
  fish.caveIdleTargetXNorm = null;
  fish.caveIdleTargetYNorm = null;
  fish.caveIdleTargetAt = null;
  setFishDesiredTankLayer(fish, getFishActiveCaveInsideLayer(fish, TANK_DEPTH_LAYERS));

  if (!setFishTargetToCaveNode(fish, plan.exitPathNodes[0] || mouthNode, now, 1300)) {
    abortFishCaveBehavior(fish, now, true);
    return false;
  }

  return true;
}

function updateDebugFishCaveInsideBehavior(fish, species, decorItem, plan, mouthNode, now = Date.now()) {
  if (!fish || !species || !decorItem || !plan || !mouthNode) {
    return false;
  }

  ensureDebugCaveSequencePrepared(fish, species, decorItem, plan, mouthNode, now);
  if (!Number.isFinite(plan.debugRoamUntil)) {
    plan.debugRoamUntil = now + CAVE_DEBUG_TEST_ROAM_MS;
  }
  if (!Number.isFinite(plan.debugSeatIndex)) {
    plan.debugSeatIndex = 0;
  }
  if (!plan.debugPhase) {
    plan.debugPhase = "roam";
  }

  fish.caveInsideUntil = Math.max(
    Number(fish.caveInsideUntil) || 0,
    plan.debugRoamUntil + plan.debugSeatOrder.length * CAVE_DEBUG_TEST_SEAT_MS + 1200
  );
  fish.caveIdleTargetXNorm = null;
  fish.caveIdleTargetYNorm = null;
  fish.caveIdleTargetAt = null;

  if (plan.debugPhase === "roam") {
    fish.caveSeatId = null;

    if (now >= plan.debugRoamUntil) {
      clearDebugCavePathState(plan);
      plan.debugPhase = "seat-move";
    } else {
      if (!plan.debugRoamStarted) {
        plan.debugRoamStarted = true;
        if (Array.isArray(plan.debugRoamPathNodes) && plan.debugRoamPathNodes.length) {
          startDebugCavePath(fish, plan, plan.debugRoamPathNodes, now, 850);
        }
      }

      if (advanceDebugCavePath(fish, plan, now, 850)) {
        return true;
      }

      if (plan.inside) {
        const holdPoint = Array.isArray(plan.debugRoamPathNodes) && plan.debugRoamPathNodes.length
          ? plan.debugRoamPathNodes[plan.debugRoamPathNodes.length - 1]
          : plan.inside;
        fish.targetXNorm = holdPoint.xNorm;
        fish.targetYNorm = holdPoint.yNorm;
        fish.targetAt = Math.min(plan.debugRoamUntil, now + 900);
      }
      return true;
    }
  }

  if (plan.debugPhase === "seat-hold") {
    const holdPoint = plan.debugSeatPoint || plan.inside || mouthNode;
    if (holdPoint) {
      fish.targetXNorm = holdPoint.xNorm;
      fish.targetYNorm = holdPoint.yNorm;
    }
    fish.targetAt = Math.max(Number(plan.debugSeatHoldUntil) || 0, now + 200);
    if (Number.isFinite(plan.debugSeatHoldUntil) && now < plan.debugSeatHoldUntil) {
      return true;
    }

    plan.debugSeatIndex += 1;
    plan.debugSeatId = null;
    plan.debugSeatPoint = null;
    plan.debugSeatHoldUntil = null;
    fish.caveSeatId = null;
    plan.debugPhase = "seat-move";
  }

  if (plan.debugPhase === "seat-move") {
    const seatSteps = Array.isArray(plan.debugSeatSteps) ? plan.debugSeatSteps : [];
    let activeSeatStep = seatSteps[plan.debugSeatIndex] || null;
    while (activeSeatStep && isCaveSeatOccupied(plan.decorId, activeSeatStep.id, fish.id)) {
      plan.debugSeatIndex += 1;
      plan.debugSeatId = null;
      plan.debugSeatPoint = null;
      fish.caveSeatId = null;
      activeSeatStep = seatSteps[plan.debugSeatIndex] || null;
    }
    if (!activeSeatStep) {
      return beginFishDebugCaveExit(fish, plan, mouthNode, now);
    }

    if (plan.debugSeatId !== activeSeatStep.id) {
      plan.debugSeatId = activeSeatStep.id;
      plan.debugSeatPoint = activeSeatStep.point;
      fish.caveSeatId = activeSeatStep.id;
      startDebugCavePath(fish, plan, activeSeatStep.pathNodes, now, 850);
    } else if (advanceDebugCavePath(fish, plan, now, 850)) {
      return true;
    }

    const seatReached = Boolean(
      plan.debugSeatPoint &&
      Math.hypot(fish.xNorm - plan.debugSeatPoint.xNorm, fish.yNorm - plan.debugSeatPoint.yNorm) <= CAVE_DEBUG_TEST_SEAT_SETTLE_DISTANCE_NORM
    );
    if (seatReached) {
      plan.debugPhase = "seat-hold";
      plan.debugSeatHoldUntil = now + CAVE_DEBUG_TEST_SEAT_MS;
      if (plan.debugSeatPoint) {
        fish.targetXNorm = plan.debugSeatPoint.xNorm;
        fish.targetYNorm = plan.debugSeatPoint.yNorm;
      }
      fish.targetAt = plan.debugSeatHoldUntil;
      return true;
    }

    if (plan.debugSeatPoint) {
      fish.targetXNorm = plan.debugSeatPoint.xNorm;
      fish.targetYNorm = plan.debugSeatPoint.yNorm;
      fish.targetAt = now + 900;
      return true;
    }

    plan.debugSeatIndex += 1;
    plan.debugSeatId = null;
    plan.debugSeatPoint = null;
    fish.caveSeatId = null;
    return true;
  }

  return beginFishDebugCaveExit(fish, plan, mouthNode, now);
}

function clearNormalCavePathState(plan) {
  if (!plan) {
    return;
  }

  plan.normalPathNodes = [];
  plan.normalPathIndex = null;
}

function buildNormalCaveInsideTravelNodes(item, fish, species, fromPoint, toPoint, now = Date.now(), viaPoint = null) {
  if (!item || !fish || !species || !fromPoint || !toPoint) {
    return [];
  }

  const routeNodes = buildCaveInteriorRouteNodes(item, fish, species, fromPoint, toPoint, now);
  if (Array.isArray(routeNodes) && routeNodes.length) {
    return routeNodes;
  }

  return buildCheapDebugCaveSegmentNodes(item, fish, species, fromPoint, toPoint, now, viaPoint);
}

function pickNormalCaveRoamAssignment(item, fish, species, plan, mouthNode, now = Date.now()) {
  if (!item || !fish || !species || !plan) {
    return null;
  }

  const origin = {
    xNorm: clamp(fish.xNorm, 0.08, 0.92),
    yNorm: clamp(fish.yNorm, 0.14, 0.8)
  };
  const interiorAnchor = plan.inside || mouthNode || origin;
  const seatRegions = getCaveSeatRegions(item);
  const candidates = collectCheapDebugCaveRoamCandidates(item, fish, species, plan, seatRegions, now);
  const lastRoamTarget = plan.normalLastRoamTarget || null;
  const pickCandidatePool = (excludeLastTarget = true) => candidates.filter((point) => (
    Math.hypot(point.xNorm - origin.xNorm, point.yNorm - origin.yNorm) > 0.012
    && (!excludeLastTarget || !lastRoamTarget || Math.hypot(point.xNorm - lastRoamTarget.xNorm, point.yNorm - lastRoamTarget.yNorm) > 0.014)
  ));
  let pool = pickCandidatePool(true);
  if (!pool.length) {
    pool = pickCandidatePool(false);
  }
  if (!pool.length && interiorAnchor) {
    pool = [interiorAnchor];
  }
  if (!pool.length) {
    return null;
  }

  const targetPoint = pool[Math.floor(Math.random() * Math.min(pool.length, 3))];
  if (!targetPoint) {
    return null;
  }

  const pathNodes = buildNormalCaveInsideTravelNodes(item, fish, species, origin, targetPoint, now, interiorAnchor);
  if (!pathNodes.length && Math.hypot(targetPoint.xNorm - origin.xNorm, targetPoint.yNorm - origin.yNorm) > 0.012) {
    return null;
  }

  return {
    point: {
      xNorm: clamp(targetPoint.xNorm, 0.08, 0.92),
      yNorm: clamp(targetPoint.yNorm, 0.14, 0.8)
    },
    pathNodes
  };
}

function startNormalCavePath(fish, plan, nodes, now = Date.now(), extraMs = 900) {
  clearNormalCavePathState(plan);
  if (!fish || !plan || !Array.isArray(nodes) || !nodes.length) {
    return false;
  }

  plan.normalPathNodes = nodes.map((node) => ({
    xNorm: clamp(node.xNorm, 0.08, 0.92),
    yNorm: clamp(node.yNorm, 0.14, 0.8)
  }));
  plan.normalPathIndex = 0;
  return setFishTargetToCaveNode(fish, plan.normalPathNodes[0], now, extraMs);
}

function advanceNormalCavePath(fish, plan, now = Date.now(), extraMs = 900) {
  const nodes = Array.isArray(plan?.normalPathNodes) ? plan.normalPathNodes : [];
  if (!fish || !plan || !nodes.length) {
    return false;
  }

  const nodeIndex = Number.isFinite(plan.normalPathIndex)
    ? clamp(Math.floor(plan.normalPathIndex), 0, nodes.length - 1)
    : 0;
  const node = nodes[nodeIndex];
  if (!node) {
    clearNormalCavePathState(plan);
    return false;
  }

  if (
    !Number.isFinite(fish.targetXNorm) ||
    !Number.isFinite(fish.targetYNorm) ||
    Math.hypot(fish.targetXNorm - node.xNorm, fish.targetYNorm - node.yNorm) > 0.0005
  ) {
    setFishTargetToCaveNode(fish, node, now, extraMs);
  }

  if (Math.hypot(fish.xNorm - node.xNorm, fish.yNorm - node.yNorm) > CAVE_GENERAL_REACHED_DISTANCE_NORM) {
    return true;
  }

  const nextIndex = nodeIndex + 1;
  if (nextIndex < nodes.length) {
    plan.normalPathIndex = nextIndex;
    setFishTargetToCaveNode(fish, nodes[nextIndex], now, extraMs);
    return true;
  }

  clearNormalCavePathState(plan);
  return false;
}

function beginFishNormalCaveExit(fish, plan, mouthNode, now = Date.now()) {
  if (!fish || !plan || !mouthNode) {
    return false;
  }

  clearNormalCavePathState(plan);
  plan.normalInsideMode = null;
  plan.normalTargetPoint = null;
  plan.normalSeatPoint = null;
  plan.normalSeatHoldUntil = null;
  plan.seatId = null;
  fish.caveSeatId = null;
  fish.caveState = "exit";
  fish.cavePathIndex = 0;
  fish.caveIdleTargetXNorm = null;
  fish.caveIdleTargetYNorm = null;
  fish.caveIdleTargetAt = null;
  setFishDesiredTankLayer(fish, getFishActiveCaveInsideLayer(fish, TANK_DEPTH_LAYERS));

  if (!setFishTargetToCaveNode(fish, plan.exitPathNodes[0] || mouthNode, now, 1300)) {
    abortFishCaveBehavior(fish, now, true);
    return false;
  }

  return true;
}

function updateNormalFishCaveInsideBehavior(fish, species, decorItem, plan, mouthNode, now = Date.now()) {
  if (!fish || !species || !decorItem || !plan || !mouthNode) {
    return false;
  }

  const currentPoint = {
    xNorm: clamp(fish.xNorm, 0.08, 0.92),
    yNorm: clamp(fish.yNorm, 0.14, 0.8)
  };
  const interiorAnchor = plan.inside || mouthNode || currentPoint;
  const setInsideTarget = (point) => {
    if (!point) {
      return;
    }

    const normalizedPoint = {
      xNorm: clamp(point.xNorm, 0.08, 0.92),
      yNorm: clamp(point.yNorm, 0.14, 0.8)
    };
    plan.normalTargetPoint = normalizedPoint;
    fish.caveInsideXNorm = normalizedPoint.xNorm;
    fish.caveInsideYNorm = normalizedPoint.yNorm;
  };
  const clearSeatReservation = () => {
    plan.seatId = null;
    plan.normalSeatPoint = null;
    plan.normalSeatHoldUntil = null;
    fish.caveSeatId = null;
  };
  const beginRoam = () => {
    clearSeatReservation();
    const roamAssignment = pickNormalCaveRoamAssignment(decorItem, fish, species, plan, mouthNode, now);
    if (!roamAssignment?.point) {
      return beginFishNormalCaveExit(fish, plan, mouthNode, now);
    }

    plan.normalInsideMode = "roam";
    plan.normalLastRoamTarget = roamAssignment.point;
    setInsideTarget(roamAssignment.point);
    if (!startNormalCavePath(fish, plan, roamAssignment.pathNodes, now, 900) && plan.normalTargetPoint) {
      setFishTargetToCaveNode(fish, plan.normalTargetPoint, now, 900);
    }
    return true;
  };
  const beginSeatMove = (seatAssignment) => {
    if (!seatAssignment?.seatId || !seatAssignment?.point) {
      return beginRoam();
    }

    const pathNodes = buildNormalCaveInsideTravelNodes(
      decorItem,
      fish,
      species,
      currentPoint,
      seatAssignment.point,
      now,
      interiorAnchor
    );
    if (!pathNodes.length && Math.hypot(currentPoint.xNorm - seatAssignment.point.xNorm, currentPoint.yNorm - seatAssignment.point.yNorm) > 0.012) {
      return beginRoam();
    }

    plan.normalInsideMode = "seat-move";
    plan.seatId = seatAssignment.seatId;
    plan.normalSeatPoint = {
      xNorm: clamp(seatAssignment.point.xNorm, 0.08, 0.92),
      yNorm: clamp(seatAssignment.point.yNorm, 0.14, 0.8)
    };
    plan.normalSeatHoldUntil = null;
    fish.caveSeatId = null;
    setInsideTarget(plan.normalSeatPoint);
    if (!startNormalCavePath(fish, plan, pathNodes, now, 900) && plan.normalSeatPoint) {
      setFishTargetToCaveNode(fish, plan.normalSeatPoint, now, 900);
    }
    return true;
  };
  const chooseNextAction = () => {
    if (!plan.normalHasRoamed) {
      plan.normalHasRoamed = true;
      return beginRoam();
    }

    const seatAssignment = pickAvailableCaveSeatAssignment(decorItem, fish, species, now, currentPoint);
    const sitChance = isCaveNightWindow(now) ? CAVE_NORMAL_ROAM_SIT_CHANCE_NIGHT : CAVE_NORMAL_ROAM_SIT_CHANCE_DAY;
    const leaveChance = isCaveNightWindow(now) ? CAVE_NORMAL_ROAM_LEAVE_CHANCE_NIGHT : CAVE_NORMAL_ROAM_LEAVE_CHANCE_DAY;
    const canLeaveCave = now >= (fish.caveTriggerCooldownUntil || 0);
    const roll = Math.random();

    if (roll < leaveChance) {
      return canLeaveCave
        ? beginFishNormalCaveExit(fish, plan, mouthNode, now)
        : beginRoam();
    }

    if (roll < leaveChance + sitChance && seatAssignment) {
      return beginSeatMove(seatAssignment);
    }

    return beginRoam();
  };

  fish.caveIdleTargetXNorm = null;
  fish.caveIdleTargetYNorm = null;
  fish.caveIdleTargetAt = null;

  if (plan.normalInsideMode === "seat-hold") {
    if (plan.seatId && isCaveSeatOccupied(plan.decorId, plan.seatId, fish.id)) {
      clearNormalCavePathState(plan);
      clearSeatReservation();
      plan.normalInsideMode = null;
      return chooseNextAction();
    }

    if (!plan.seatId || !plan.normalSeatPoint) {
      clearNormalCavePathState(plan);
      clearSeatReservation();
      plan.normalInsideMode = null;
      return chooseNextAction();
    }

    fish.caveSeatId = plan.seatId;
    setInsideTarget(plan.normalSeatPoint);
    fish.targetXNorm = plan.normalSeatPoint.xNorm;
    fish.targetYNorm = plan.normalSeatPoint.yNorm;
    fish.targetAt = Math.max(Number(plan.normalSeatHoldUntil) || 0, now + 250);
    if (Number.isFinite(plan.normalSeatHoldUntil) && now < plan.normalSeatHoldUntil) {
      return true;
    }

    clearSeatReservation();
    plan.normalInsideMode = null;
    return chooseNextAction();
  }

  if (plan.normalInsideMode === "seat-move") {
    if (!plan.seatId || !plan.normalSeatPoint) {
      clearNormalCavePathState(plan);
      clearSeatReservation();
      plan.normalInsideMode = null;
      return chooseNextAction();
    }

    if (isCaveSeatOccupied(plan.decorId, plan.seatId, fish.id)) {
      clearNormalCavePathState(plan);
      clearSeatReservation();
      plan.normalInsideMode = null;
      return chooseNextAction();
    }

    if (advanceNormalCavePath(fish, plan, now, 900)) {
      return true;
    }

    fish.targetXNorm = plan.normalSeatPoint.xNorm;
    fish.targetYNorm = plan.normalSeatPoint.yNorm;
    fish.targetAt = now + 900;
    if (Math.hypot(fish.xNorm - plan.normalSeatPoint.xNorm, fish.yNorm - plan.normalSeatPoint.yNorm) > CAVE_NORMAL_SEAT_SETTLE_DISTANCE_NORM) {
      return true;
    }

    fish.caveSeatId = plan.seatId;
    plan.normalSeatHoldUntil = now + randomBetween(CAVE_NORMAL_SEAT_HOLD_MIN_MS, CAVE_NORMAL_SEAT_HOLD_MAX_MS);
    plan.normalInsideMode = "seat-hold";
    fish.targetAt = plan.normalSeatHoldUntil;
    return true;
  }

  if (plan.normalInsideMode === "roam") {
    clearSeatReservation();
    if (advanceNormalCavePath(fish, plan, now, 900)) {
      return true;
    }

    if (plan.normalTargetPoint) {
      fish.targetXNorm = plan.normalTargetPoint.xNorm;
      fish.targetYNorm = plan.normalTargetPoint.yNorm;
      fish.targetAt = now + 800;
      if (Math.hypot(fish.xNorm - plan.normalTargetPoint.xNorm, fish.yNorm - plan.normalTargetPoint.yNorm) > CAVE_GENERAL_REACHED_DISTANCE_NORM) {
        return true;
      }
    }

    plan.normalInsideMode = null;
    plan.normalTargetPoint = null;
    return chooseNextAction();
  }

  clearNormalCavePathState(plan);
  clearSeatReservation();
  plan.normalInsideMode = null;
  return chooseNextAction();
}

function beginFishCaveBehavior(fish, plan, now = Date.now()) {
  if (!fish || !plan) {
    return false;
  }

  const debugTestLoop = isDebugCaveTestFish(fish);
  const debugForced = debugTestLoop || plan.debugForced === true;
  const decorItem = getCaveBehaviorDecorById(plan.decorId);
  const species = getSpeciesForFish(fish);
  const debugSeatOrder = debugTestLoop && decorItem && species
    ? getDebugCaveSeatSequence(decorItem, fish, species, now, plan.inside || plan.mouth || plan.approach)
    : [];

  runtime.activeFishCavePlans.set(fish.id, {
    decorId: plan.decorId,
    portalId: plan.portalId,
    triggerId: plan.triggerId || plan.portalId,
    seatId: null,
    debugForced,
    frontLayer: clampTankLayer(plan.frontLayer),
    backLayer: clampTankLayer(plan.backLayer),
    approach: { ...plan.approach },
    mouth: { ...plan.mouth },
    inside: { ...plan.inside },
    entryPathNodes: Array.isArray(plan.entryPathNodes) ? plan.entryPathNodes.map((node) => ({ ...node })) : [],
    exitPathNodes: Array.isArray(plan.exitPathNodes) ? plan.exitPathNodes.map((node) => ({ ...node })) : [],
    debugTestLoop,
    debugPhase: debugTestLoop ? "roam" : null,
    debugRoamUntil: debugTestLoop ? now + CAVE_DEBUG_TEST_ROAM_MS : null,
    debugPrepared: false,
    debugRoamStarted: false,
    debugRoamPathNodes: [],
    debugSeatSteps: [],
    debugPathNodes: [],
    debugPathIndex: null,
    debugLastRoamTarget: null,
    debugSeatOrder,
    debugSeatIndex: 0,
    debugSeatId: null,
    debugSeatPoint: null,
    debugSeatHoldUntil: null,
    normalInsideMode: null,
    normalPathNodes: [],
    normalPathIndex: null,
    normalTargetPoint: null,
    normalSeatPoint: null,
    normalSeatHoldUntil: null,
    normalLastRoamTarget: null,
    normalHasRoamed: false
  });
  fish.caveState = "approach";
  fish.caveDecorId = plan.decorId;
  fish.cavePortalId = plan.portalId;
  fish.caveTriggerId = plan.triggerId || plan.portalId || null;
  fish.caveSeatId = null;
  fish.caveFrontLayer = clampTankLayer(plan.frontLayer);
  fish.caveBackLayer = clampTankLayer(plan.backLayer);
  fish.caveApproachXNorm = plan.approach.xNorm;
  fish.caveApproachYNorm = plan.approach.yNorm;
  fish.caveEntryXNorm = plan.mouth.xNorm;
  fish.caveEntryYNorm = plan.mouth.yNorm;
  fish.caveInsideXNorm = plan.inside.xNorm;
  fish.caveInsideYNorm = plan.inside.yNorm;
  fish.caveInsideUntil = now + Math.max(
    Number(plan.lingerMs) || 0,
    debugTestLoop ? CAVE_DEBUG_TEST_ROAM_MS + debugSeatOrder.length * CAVE_DEBUG_TEST_SEAT_MS + 1200 : 0
  );
  fish.cavePathIndex = null;
  fish.caveIdleTargetXNorm = null;
  fish.caveIdleTargetYNorm = null;
  fish.caveIdleTargetAt = null;
  fish.hangoutDecorId = plan.decorId;
  fish.targetXNorm = plan.approach.xNorm;
  fish.targetYNorm = plan.approach.yNorm;
  fish.targetAt = now + 2200 + Math.hypot(fish.xNorm - plan.approach.xNorm, fish.yNorm - plan.approach.yNorm) * 18000;
  setFishTankLayers(fish, plan.frontLayer, plan.frontLayer);

  if (debugTestLoop) {
    const activePlan = runtime.activeFishCavePlans.get(fish.id) || null;
    if (activePlan && decorItem && species) {
      ensureDebugCaveSequencePrepared(fish, species, decorItem, activePlan, activePlan.mouth, now);
    }
  }

  return true;
}

function abortFishCaveBehavior(fish, now = Date.now(), blockCurrentDecor = false) {
  if (!fish) {
    return;
  }

  const priorState = fish.caveState;
  const wasInsideCave = ["enter", "inside", "exit", "depart"].includes(priorState);
  const fallbackFrontLayer = clampTankLayer(fish.caveFrontLayer || DEFAULT_TANK_LAYER);
  const fallbackXNorm = clamp(
    Number.isFinite(fish.caveApproachXNorm)
      ? fish.caveApproachXNorm
      : fish.xNorm,
    0.08,
    0.92
  );
  const fallbackYNorm = clamp(
    Number.isFinite(fish.caveApproachYNorm)
      ? fish.caveApproachYNorm
      : fish.yNorm,
    0.14,
    0.8
  );

  if (blockCurrentDecor && fish.caveDecorId) {
    fish.blockedDecorId = fish.caveDecorId;
    fish.blockedDecorUntil = now + 4200;
  }

  clearFishCaveBehavior(fish);
  fish.hangoutDecorId = null;

  if (wasInsideCave) {
    setFishTankLayers(fish, fallbackFrontLayer, fallbackFrontLayer);
    setFishDesiredTankLayer(fish, fallbackFrontLayer);
    fish.targetXNorm = fallbackXNorm;
    fish.targetYNorm = fallbackYNorm;
    fish.targetAt = now + 1200 + Math.hypot(fish.xNorm - fallbackXNorm, fish.yNorm - fallbackYNorm) * 14000;
  }
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

  if (stateOverride) {
    fish.caveState = stateOverride;
  }
  const backLayer = getFishActiveCaveInsideLayer(fish, DEFAULT_TANK_LAYER);
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

  const activePlan = getActiveFishCavePlan(fish);
  if (activePlan?.debugForced && isDebugCaveTestFish(fish)) {
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
  const debugForcedPlan = Boolean(plan.debugForced) && isDebugCaveTestFish(fish);
  const debugTestLoop = Boolean(plan.debugTestLoop) && isDebugCaveTestFish(fish);

  const triggerRegion = getActiveFishCaveTriggerRegion(fish);
  let seatRegion = getActiveFishCaveSeatRegion(fish);
  const mouthNode = triggerRegion || plan.mouth;
  let insideNode = seatRegion || plan.inside;
  const distanceToTarget = Math.hypot(fish.targetXNorm - fish.xNorm, fish.targetYNorm - fish.yNorm);
  const distanceToMouth = mouthNode
    ? Math.hypot(fish.xNorm - mouthNode.xNorm, fish.yNorm - mouthNode.yNorm)
    : Number.POSITIVE_INFINITY;
  const reachedTarget = distanceToTarget <= CAVE_GENERAL_REACHED_DISTANCE_NORM;
  const reachedMouth = distanceToTarget <= CAVE_MOUTH_REACHED_DISTANCE_NORM;
  const reachedTrigger = triggerRegion ? isFishWithinRegionBounds(fish, triggerRegion, 8) : reachedMouth;
  const stalledAtTrigger = (
    Number.isFinite(fish.targetAt) &&
    now >= fish.targetAt + CAVE_TRIGGER_STALL_FORCE_MS &&
    distanceToMouth <= CAVE_TRIGGER_STALL_FORCE_DISTANCE_NORM
  );

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
    if (reachedTrigger || stalledAtTrigger) {
      fish.xNorm = clamp(mouthNode.xNorm, 0.08, 0.92);
      fish.yNorm = clamp(mouthNode.yNorm, 0.14, 0.8);
      fish.targetXNorm = fish.xNorm;
      fish.targetYNorm = fish.yNorm;
      const mouthPose = getFishCollisionPose(fish, species, now, fish.xNorm, fish.yNorm, fish.direction || 1);
      if (!debugForcedPlan && !stalledAtTrigger && !canFishChangeToLayer(fish, species, now, clampTankLayer(fish.caveBackLayer || DEFAULT_TANK_LAYER), mouthPose)) {
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
      fish.caveState = "enter";
      const interiorLayer = getFishActiveCaveInsideLayer(fish, DEFAULT_TANK_LAYER);
      setFishTankLayers(fish, interiorLayer, interiorLayer);
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
    const interiorLayer = getFishActiveCaveInsideLayer(fish, TANK_DEPTH_LAYERS);
    setFishTankLayers(
      fish,
      interiorLayer,
      interiorLayer
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
      plan.seatId = null;
      plan.normalInsideMode = null;
      plan.normalTargetPoint = null;
      plan.normalSeatPoint = null;
      plan.normalSeatHoldUntil = null;
      plan.normalLastRoamTarget = null;
      plan.normalHasRoamed = false;
      clearNormalCavePathState(plan);
      fish.caveSeatId = null;
      fish.caveInsideUntil = Math.max(Number(fish.caveInsideUntil) || 0, now + CAVE_TRIGGER_COOLDOWN_MS);
      fish.caveIdleTargetXNorm = null;
      fish.caveIdleTargetYNorm = null;
      fish.caveIdleTargetAt = null;
      fish.targetXNorm = fish.xNorm;
      fish.targetYNorm = fish.yNorm;
      fish.targetAt = Math.max(fish.caveInsideUntil || 0, now + 1200);
      setFishDesiredTankLayer(fish, getFishActiveCaveInsideLayer(fish, TANK_DEPTH_LAYERS));
      return true;
    }

    return true;
  }

  if (fish.caveState === "inside") {
    const insideLayer = getFishActiveCaveInsideLayer(fish, TANK_DEPTH_LAYERS);
    fish.hangoutDecorId = fish.caveDecorId;
    setFishTankLayers(
      fish,
      insideLayer,
      insideLayer
    );
    if (debugTestLoop) {
      return updateDebugFishCaveInsideBehavior(fish, species, decorItem, plan, mouthNode, now);
    }
    return updateNormalFishCaveInsideBehavior(fish, species, decorItem, plan, mouthNode, now);
  }

  if (fish.caveState === "exit") {
    fish.hangoutDecorId = fish.caveDecorId;
    const interiorLayer = getFishActiveCaveInsideLayer(fish, TANK_DEPTH_LAYERS);
    setFishTankLayers(
      fish,
      interiorLayer,
      interiorLayer
    );
    if (reachedTrigger || reachedTarget || stalledAtTrigger) {
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
      if (!debugForcedPlan && !stalledAtTrigger && !canFishChangeToLayer(fish, species, now, clampTankLayer(fish.caveFrontLayer || DEFAULT_TANK_LAYER), mouthPose)) {
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
    const interiorLayer = getFishActiveCaveInsideLayer(fish, DEFAULT_TANK_LAYER);
    setFishTankLayers(
      fish,
      interiorLayer,
      interiorLayer
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
      fish.caveTriggerCooldownUntil = Math.max(
        Number(fish.caveTriggerCooldownUntil) || 0,
        now + CAVE_POST_EXIT_COOLDOWN_MS
      );
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
  const image = runtime.images.get(getFishAssetPath(fish, species) || species?.asset);
  if (!fish || !species || !pose || !image) {
    return null;
  }

  const width = species.width * getFishEffectiveScale(fish, species, now);
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

  const activePlan = fish.caveState ? getActiveFishCavePlan(fish) : null;
  if (
    activePlan?.debugForced &&
    isDebugCaveTestFish(fish) &&
    blockingCave.item?.id === fish.caveDecorId
  ) {
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
  const fishAsset = getFishAssetPath(fish, species) || species?.asset;
  const image = runtime.images.get(fishAsset);
  const mask = fishAsset ? getImageAlphaMask(fishAsset) : null;
  if (!species || !image || !mask) {
    return null;
  }

  const pose = poseOverride || getFishPose(fish, species, now);
  const width = species.width * getFishEffectiveScale(fish, species, now);
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
      : getFishActiveCaveInsideLayer(fish, DEFAULT_TANK_LAYER);
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
  const image = runtime.images.get(getFishAssetPath(fish, species) || species.asset);
  const width = species.width * getFishEffectiveScale(fish, species);
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
    Boolean(target.closest("#tankSidebar, .tank-display, .tank-bottom-dock, #editDecorTray, #editFishTray, .tank-overlay-hints, .store-overlay, .hardware-accel-overlay, .fish-inspector, .tab-buttons"))
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

function renderHearts(units, maxUnits = Math.max(2, Math.round(Number(units) || 0))) {
  const clampedUnits = Math.max(0, Math.round(Number(units) || 0));
  const heartCount = Math.max(1, Math.ceil(Math.max(0, Number(maxUnits) || clampedUnits) / 2));
  return Array.from({ length: heartCount }, (_, index) => {
    const remaining = clampedUnits - index * 2;
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
    .replace(/_bubbler$/i, "")
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

  const stageRect = dom.tankStage?.getBoundingClientRect?.();
  if (stageRect?.width && stageRect?.height) {
    dom.toast.style.left = `${Math.round(stageRect.left + stageRect.width / 2)}px`;
    dom.toast.style.top = `${Math.round(stageRect.top + 24)}px`;
  } else {
    dom.toast.style.left = "50%";
    dom.toast.style.top = "24px";
  }
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
