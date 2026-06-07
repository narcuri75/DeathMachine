const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const staticRoot = path.join(root, "static");
const checked = new Set();
const missing = [];

function normalizeReference(reference) {
  const value = String(reference || "").trim();
  if (!value || value.startsWith("#")) return "";
  if (value.includes("${")) return "";
  if (/^(?:https?:|data:|blob:|mailto:|tel:|javascript:)/i.test(value)) return "";
  if (!/[/.]/.test(value)) return "";
  return value.split("#")[0].split("?")[0].replace(/^\/+/, "");
}

function checkReference(fromFile, reference) {
  const normalized = normalizeReference(reference);
  if (!normalized) return;
  const base = path.dirname(fromFile);
  const candidate = normalized.startsWith(".")
    ? path.resolve(base, normalized)
    : path.resolve(staticRoot, normalized);
  const relative = path.relative(root, candidate);
  if (relative.startsWith("..")) return;
  if (checked.has(candidate)) return;
  checked.add(candidate);
  if (!fs.existsSync(candidate)) missing.push(`${path.relative(root, fromFile)} -> ${reference}`);
}

function scanFile(filePath) {
  const text = fs.readFileSync(filePath, "utf8");
  const ext = path.extname(filePath).toLowerCase();
  if ([".html", ".js"].includes(ext)) {
    for (const match of text.matchAll(/\b(?:src|href)\s*=\s*["']([^"']+)["']/g)) checkReference(filePath, match[1]);
    for (const match of text.matchAll(/new URL\(["']([^"']+)["']/g)) checkReference(filePath, match[1]);
  }
  if (ext === ".css") {
    for (const match of text.matchAll(/url\((["']?)([^"')]+)\1\)/g)) checkReference(filePath, match[2]);
  }
  if (ext === ".json" || ext === ".webmanifest") {
    const json = JSON.parse(text);
    const visit = (value, key = "") => {
      if (Array.isArray(value)) value.forEach((item) => visit(item, key));
      else if (value && typeof value === "object") Object.entries(value).forEach(([childKey, childValue]) => visit(childValue, childKey));
      else if (typeof value === "string" && ["src", "start_url", "scope"].includes(key)) checkReference(filePath, value);
    };
    visit(json);
  }
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(fullPath);
    else if (/\.(?:html|css|js|json|webmanifest)$/i.test(entry.name)) scanFile(fullPath);
  }
}

walk(staticRoot);

const required = [
  "static/index.html",
  "static/styles.css",
  "static/browser-api.js",
  "static/service-worker.js",
  "static/app.js",
  "static/shuffle-engine.js",
  "static/recommendation-engine.js",
  "static/chord-engine.js",
  "static/shared-normalizers.js",
  "static/assets/voidfm-icon.png",
  "static/assets/loading_bg.png"
];

for (const item of required) {
  if (!fs.existsSync(path.join(root, item))) missing.push(`required -> ${item}`);
}

if (missing.length) {
  console.error("Missing Web app dependencies:");
  for (const item of missing) console.error(`- ${item}`);
  process.exit(1);
}

console.log(`Web app dependency check passed (${checked.size} references checked).`);
