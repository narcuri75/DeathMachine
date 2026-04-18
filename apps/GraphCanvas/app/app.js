(function () {
  "use strict";

  const PAGE = {
    inchWidth: 8.5,
    inchHeight: 11,
    squaresPerInch: 4,
    width: 34,
    height: 44
  };
  const BASE_SQUARE_PX = 16;
  const EXPORT_SQUARE_PX = 64;
  const MAX_SNAP_DIV = 64;
  const MIN_TEXT_SIZE = 3;
  const AREA_FILL_DIV = 96;
  const AREA_FILL_MIN_DIV = 16;
  const MAX_AREA_FILL_GRID_CELLS = 16000000;
  const MAX_AREA_FILL_VISITED_CELLS = 4000000;
  const MAX_SELECTION_CELLS = 200000;
  const FILL_CACHE_SQUARE_PX = 128;
  const MAX_FILL_CACHE_PIXELS = 32000000;
  const HISTORY_ENTRY_LIMIT = 50;
  const HISTORY_MEMORY_LIMIT_BYTES = 256 * 1024 * 1024;
  const HISTORY_MIN_USABLE_ENTRIES = 2;
  const MIN_SCALE = 4;
  const MAX_SCALE = 1024;
  const CACHE_DB_NAME = "JSArtWorkspace";
  const CACHE_DB_VERSION = 1;
  const CACHE_STORE = "projects";
  const ACTIVE_PROJECT_KEY = "jsart.activeProjectId";
  const BACKUP_PROJECT_KEY = "jsart.currentProjectBackup";
  const LOCAL_BACKUP_LIMIT_BYTES = 2 * 1024 * 1024;
  const AUTOSAVE_DELAY = 250;
  const SWATCHES = [
    "#000000", "#FFFFFF", "#E2463D", "#18A16F",
    "#2F7DD1", "#F2C744", "#8E44AD", "#FF7A30",
    "#303030", "#8C8C8C", "#B8E0D2", "#F6F6F6",
    "#D93B72", "#2BB3A3", "#5A5A5A", "#F0F0F0"
  ];

  const canvas = document.getElementById("paperCanvas");
  const ctx = canvas.getContext("2d");
  const hud = document.getElementById("hud");
  const tools = Array.from(document.querySelectorAll(".tool"));
  const colorChip = document.getElementById("colorChip");
  const colorPanel = document.getElementById("colorPanel");
  const svPicker = document.getElementById("svPicker");
  const svCtx = svPicker.getContext("2d");
  const hueSlider = document.getElementById("hueSlider");
  const hexColor = document.getElementById("hexColor");
  const eyedropperButton = document.getElementById("eyedropperButton");
  const eyedropperButtons = Array.from(document.querySelectorAll("[data-eyedropper-target]"));
  const swatches = document.getElementById("swatches");
  const textPanel = document.getElementById("textPanel");
  const textValue = document.getElementById("textValue");
  const textFont = document.getElementById("textFont");
  const textSize = document.getElementById("textSize");
  const textColor = document.getElementById("textColor");
  const textHighlight = document.getElementById("textHighlight");
  const textHighlightColor = document.getElementById("textHighlightColor");
  const textBold = document.getElementById("textBold");
  const textItalic = document.getElementById("textItalic");
  const textUnderline = document.getElementById("textUnderline");
  const textStrike = document.getElementById("textStrike");
  const textAlignLeft = document.getElementById("textAlignLeft");
  const textAlignCenter = document.getElementById("textAlignCenter");
  const textAlignRight = document.getElementById("textAlignRight");
  const textGlow = document.getElementById("textGlow");
  const textGlowColor = document.getElementById("textGlowColor");
  const textGlowSize = document.getElementById("textGlowSize");
  const textApply = document.getElementById("textApply");
  const textDelete = document.getElementById("textDelete");
  const textClose = document.getElementById("textClose");
  const strokeSize = document.getElementById("strokeSize");
  const detailReadout = document.getElementById("detailReadout");
  const detailDown = document.getElementById("detailDown");
  const detailUp = document.getElementById("detailUp");
  const fontFamily = document.getElementById("fontFamily");
  const fontSize = document.getElementById("fontSize");
  const projectTabsEl = document.getElementById("projectTabs");
  const newProject = document.getElementById("newProject");
  const rotateView = document.getElementById("rotateView");
  const fitView = document.getElementById("fitView");
  const extendOpen = document.getElementById("extendOpen");
  const extendClose = document.getElementById("extendClose");
  const extendModal = document.getElementById("extendModal");
  const extendMap = document.getElementById("extendMap");
  const ioOpen = document.getElementById("ioOpen");
  const ioClose = document.getElementById("ioClose");
  const ioModal = document.getElementById("ioModal");
  const exportCode = document.getElementById("exportCode");
  const exportPreview = document.getElementById("exportPreview");
  const saveProject = document.getElementById("saveProject");
  const loadProject = document.getElementById("loadProject");
  const importCode = document.getElementById("importCode");
  const closeProjectAfterExport = document.getElementById("closeProjectAfterExport");
  const codeOutput = document.getElementById("codeOutput");
  const imageInput = document.getElementById("imageInput");
  const projectInput = document.getElementById("projectInput");
  const codeInput = document.getElementById("codeInput");

  let project = createProject();
  let tool = "pencil";
  let currentColor = "#000000";
  let currentHue = 0;
  let currentSat = 0;
  let currentVal = 0;
  let snapDiv = 1;
  let previewStroke = null;
  let pendingImageAsset = null;
  let pendingImagePoint = null;
  let selectedImageIndex = -1;
  let imageAction = null;
  let rangeAction = null;
  let selectionMoveAction = null;
  let activePointer = null;
  let bucketAction = null;
  let eraserAction = null;
  let panState = null;
  let textDraft = null;
  let textAction = null;
  let selectedTextIndex = -1;
  let selectedRange = null;
  let clipboardRange = null;
  let lastPointerWorld = null;
  let pendingCloseProjectId = "";
  let spaceDown = false;
  let eyedropperMode = false;
  let eyedropperTarget = "current";
  let activeEyedropperButton = null;
  let history = [];
  let historyIndex = -1;
  let historyBytes = 0;
  let projectTabs = [];
  let currentProjectId = "";
  let cacheReady = false;
  let cacheSaveTimer = 0;
  let cacheDbPromise = null;
  let fillCache = null;
  let fillCacheVersion = 0;
  const historyAssetStore = new Map();
  const imageCache = new Map();
  const textAlignButtons = [textAlignLeft, textAlignCenter, textAlignRight];

  const view = {
    x: -2,
    y: -2,
    scale: 16,
    rotation: 0,
    dpr: 1,
    width: 1,
    height: 1
  };

  function createProject(name) {
    return {
      app: "GraphCanvas",
      version: 1,
      name: name || "Canvas 1",
      page: { ...PAGE },
      sheets: [{ col: 0, row: 0 }],
      view: { rotation: 0 },
      fills: [],
      regions: [],
      strokes: [],
      texts: [],
      assets: [],
      images: []
    };
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function setHud(message) {
    hud.textContent = message;
  }

  function syncProjectView() {
    project.view = {
      ...(project.view || {}),
      rotation: view.rotation
    };
  }

  function makeProjectId() {
    return `project-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function currentTab() {
    return projectTabs.find((tab) => tab.id === currentProjectId) || null;
  }

  function tabName(index) {
    return `Canvas ${index + 1}`;
  }

  function renderProjectTabs() {
    projectTabsEl.textContent = "";
    for (const tab of projectTabs) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "project-tab";
      button.classList.toggle("active", tab.id === currentProjectId);
      button.title = tab.name || "Canvas";

      const title = document.createElement("span");
      title.className = "project-tab-title";
      title.textContent = tab.name || "Canvas";
      button.appendChild(title);

      const close = document.createElement("span");
      close.className = "project-tab-close";
      close.textContent = "X";
      close.title = "Close tab";
      close.addEventListener("click", (event) => {
        event.stopPropagation();
        closeProjectTab(tab.id).catch(() => setHud("Could not close tab"));
      });
      button.appendChild(close);

      button.addEventListener("click", () => switchProjectTab(tab.id));
      projectTabsEl.appendChild(button);
    }
  }

  function openCacheDb() {
    if (cacheDbPromise) return cacheDbPromise;
    cacheDbPromise = new Promise((resolve, reject) => {
      if (!("indexedDB" in window)) {
        reject(new Error("Browser storage unavailable"));
        return;
      }
      const request = indexedDB.open(CACHE_DB_NAME, CACHE_DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(CACHE_STORE)) {
          db.createObjectStore(CACHE_STORE, { keyPath: "id" });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("Could not open cache"));
    });
    return cacheDbPromise;
  }

  async function getCachedProjectRecords() {
    const db = await openCacheDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(CACHE_STORE, "readonly");
      const store = tx.objectStore(CACHE_STORE);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error || new Error("Could not read cache"));
    });
  }

  async function putCachedProject(record) {
    const db = await openCacheDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(CACHE_STORE, "readwrite");
      tx.objectStore(CACHE_STORE).put(record);
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error || new Error("Could not write cache"));
    });
  }

  async function getCachedProject(id) {
    const db = await openCacheDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(CACHE_STORE, "readonly");
      const request = tx.objectStore(CACHE_STORE).get(id);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error || new Error("Could not read project"));
    });
  }

  async function deleteCachedProject(id) {
    const db = await openCacheDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(CACHE_STORE, "readwrite");
      tx.objectStore(CACHE_STORE).delete(id);
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error || new Error("Could not delete project"));
    });
  }

  function projectRecord() {
    syncProjectView();
    const tab = currentTab();
    const now = Date.now();
    const name = project.name || (tab && tab.name) || tabName(projectTabs.length);
    project.name = name;
    return {
      id: currentProjectId,
      name,
      order: tab ? tab.order : projectTabs.length,
      updated: now,
      project
    };
  }

  function writeActiveProjectId() {
    if (!currentProjectId) return;
    try {
      localStorage.setItem(ACTIVE_PROJECT_KEY, currentProjectId);
    } catch (error) {
      // Best effort only.
    }
  }

  function writeLocalBackup(record) {
    if (!currentProjectId) return;
    try {
      writeActiveProjectId();
      const backupRecord = record || projectRecord();
      if (estimateProjectBytes(backupRecord.project) > LOCAL_BACKUP_LIMIT_BYTES) {
        localStorage.removeItem(BACKUP_PROJECT_KEY);
        return;
      }
      const backup = JSON.stringify(backupRecord);
      if (backup.length * 2 > LOCAL_BACKUP_LIMIT_BYTES) {
        localStorage.removeItem(BACKUP_PROJECT_KEY);
        return;
      }
      localStorage.setItem(BACKUP_PROJECT_KEY, backup);
    } catch (error) {
      // Best effort only; large embedded image projects may exceed localStorage.
    }
  }

  function estimateProjectBytes(source) {
    if (!source) return 0;
    let bytes = 4096;
    bytes += (source.sheets || []).length * 80;
    bytes += (source.fills || []).length * 120;
    bytes += (source.texts || []).length * 700;
    bytes += (source.images || []).length * 240;

    for (const asset of source.assets || []) {
      bytes += 600 + (asset.dataUrl ? asset.dataUrl.length * 2 : 0);
    }

    for (const stroke of source.strokes || []) {
      bytes += 180 + (stroke.points || []).length * 48;
    }

    for (const region of source.regions || []) {
      bytes += 160;
      for (const path of region.paths || []) {
        bytes += path.length * 56;
      }
    }

    return bytes;
  }

  async function persistCurrentToCache() {
    if (!currentProjectId) return;
    const record = projectRecord();
    const tab = currentTab();
    if (tab) {
      tab.name = record.name;
      tab.updated = record.updated;
    }
    renderProjectTabs();
    writeLocalBackup(record);
    await putCachedProject(record);
  }

  function queueCacheSave() {
    if (!currentProjectId) return;
    writeActiveProjectId();
    if (!cacheReady) {
      writeLocalBackup();
      return;
    }
    window.clearTimeout(cacheSaveTimer);
    cacheSaveTimer = window.setTimeout(() => {
      persistCurrentToCache().catch(() => setHud("Autosave failed"));
    }, AUTOSAVE_DELAY);
  }

  async function flushCacheSave() {
    window.clearTimeout(cacheSaveTimer);
    if (!currentProjectId) return;
    writeActiveProjectId();
    if (!cacheReady) {
      writeLocalBackup();
      return;
    }
    try {
      await persistCurrentToCache();
    } catch (error) {
      setHud("Autosave failed");
    }
  }

  function loadProjectIntoEditor(next, options) {
    const keepName = options && options.keepName;
    project = normalizeProject(next);
    if (keepName && !project.name) project.name = keepName;
    view.rotation = project.view.rotation || 0;
    updateRotateButton();
    imageCache.clear();
    invalidateFillCache();
    pendingImageAsset = null;
    pendingImagePoint = null;
    selectedImageIndex = -1;
    selectedRange = null;
    rangeAction = null;
    selectionMoveAction = null;
    selectedTextIndex = -1;
    textDraft = null;
    textAction = null;
    textPanel.classList.add("hidden");
    resetHistory();
    fitToSheets();
    draw();
  }

  async function initProjectCache() {
    try {
      const records = await getCachedProjectRecords();
      const sorted = records.sort((a, b) => (a.order || 0) - (b.order || 0));
      if (sorted.length) {
        projectTabs = sorted.map((record, index) => ({
          id: record.id,
          name: record.name || tabName(index),
          order: Number.isInteger(record.order) ? record.order : index,
          updated: record.updated || 0
        }));
        const active = localStorage.getItem(ACTIVE_PROJECT_KEY);
        const record = sorted.find((entry) => entry.id === active) || sorted[0];
        currentProjectId = record.id;
        loadProjectIntoEditor(record.project, { keepName: record.name });
        cacheReady = true;
        renderProjectTabs();
        setHud(`Restored ${record.name || "Canvas"}`);
        return;
      }
    } catch (error) {
      const backup = loadLocalBackup();
      if (backup) {
        currentProjectId = backup.id || makeProjectId();
        projectTabs = [{
          id: currentProjectId,
          name: backup.name || "Recovered",
          order: 0,
          updated: backup.updated || Date.now()
        }];
        loadProjectIntoEditor(backup.project, { keepName: backup.name });
        cacheReady = false;
        renderProjectTabs();
        setHud("Recovered local backup");
        return;
      }
      currentProjectId = makeProjectId();
      project = createProject("Canvas 1");
      projectTabs = [{ id: currentProjectId, name: project.name, order: 0, updated: Date.now() }];
      cacheReady = false;
      renderProjectTabs();
      resetHistory();
      setHud("Autosave unavailable");
      return;
    }

    currentProjectId = makeProjectId();
    project = createProject("Canvas 1");
    projectTabs = [{ id: currentProjectId, name: project.name, order: 0, updated: Date.now() }];
    cacheReady = true;
    renderProjectTabs();
    resetHistory();
    await flushCacheSave();
  }

  function loadLocalBackup() {
    try {
      const raw = localStorage.getItem(BACKUP_PROJECT_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  async function newProjectTab() {
    await flushCacheSave();
    const nextIndex = projectTabs.length;
    currentProjectId = makeProjectId();
    project = createProject(tabName(nextIndex));
    view.rotation = 0;
    updateRotateButton();
    imageCache.clear();
    invalidateFillCache();
    selectedImageIndex = -1;
    selectedRange = null;
    rangeAction = null;
    selectionMoveAction = null;
    selectedTextIndex = -1;
    textDraft = null;
    textAction = null;
    textPanel.classList.add("hidden");
    projectTabs.push({
      id: currentProjectId,
      name: project.name,
      order: nextIndex,
      updated: Date.now()
    });
    renderProjectTabs();
    resetHistory();
    fitToSheets();
    setHud(`${project.name} ready`);
    await flushCacheSave();
  }

  async function switchProjectTab(id) {
    if (id === currentProjectId) return;
    await flushCacheSave();
    try {
      const record = await getCachedProject(id);
      if (!record) {
        setHud("Project tab not found");
        return;
      }
      currentProjectId = id;
      localStorage.setItem(ACTIVE_PROJECT_KEY, currentProjectId);
      loadProjectIntoEditor(record.project, { keepName: record.name });
      renderProjectTabs();
      setHud(`Opened ${record.name || "Canvas"}`);
    } catch (error) {
      setHud("Could not open tab");
    }
  }

  async function closeProjectTab(id) {
    const tab = projectTabs.find((entry) => entry.id === id);
    if (!tab) return;
    const shouldExport = window.confirm(`Export "${tab.name || "Canvas"}" before closing?`);
    if (shouldExport) {
      pendingCloseProjectId = id;
      if (id !== currentProjectId) {
        await switchProjectTab(id);
      }
      openIoModal();
      setHud("Export what you need, then Close tab");
      return;
    }
    await removeProjectTab(id);
  }

  async function removeProjectTab(id) {
    await flushCacheSave();
    const closingIndex = projectTabs.findIndex((entry) => entry.id === id);
    if (closingIndex < 0) return;
    const closingCurrent = id === currentProjectId;
    const remaining = projectTabs.filter((entry) => entry.id !== id);
    const nextTab = remaining[Math.max(0, Math.min(closingIndex, remaining.length - 1))] || null;

    if (cacheReady) {
      try {
        await deleteCachedProject(id);
      } catch (error) {
        setHud("Could not delete cached tab");
      }
    }

    projectTabs = remaining.map((entry, index) => ({
      ...entry,
      order: index
    }));

    if (!projectTabs.length) {
      currentProjectId = makeProjectId();
      project = createProject("Canvas 1");
      projectTabs = [{ id: currentProjectId, name: project.name, order: 0, updated: Date.now() }];
      view.rotation = 0;
      updateRotateButton();
      imageCache.clear();
      selectedImageIndex = -1;
      selectedTextIndex = -1;
      selectedRange = null;
      textDraft = null;
      resetHistory();
      fitToSheets();
      renderProjectTabs();
      await flushCacheSave();
      setHud("New canvas ready");
      return;
    }

    if (closingCurrent && nextTab) {
      currentProjectId = nextTab.id;
      localStorage.setItem(ACTIVE_PROJECT_KEY, currentProjectId);
      try {
        const record = await getCachedProject(nextTab.id);
        if (record) {
          loadProjectIntoEditor(record.project, { keepName: record.name });
        }
      } catch (error) {
        project = createProject(nextTab.name || "Canvas");
        resetHistory();
      }
    }

    renderProjectTabs();
    await flushCacheSave();
    setHud("Tab closed");
  }

  function snapshotProject() {
    syncProjectView();
    rememberHistoryAssets(project);
    return JSON.stringify(compactProjectForHistory(project));
  }

  function compactProjectForHistory(source) {
    return {
      ...source,
      assets: Array.isArray(source.assets)
        ? source.assets.map((asset) => {
          const { dataUrl, ...rest } = asset;
          return rest;
        })
        : []
    };
  }

  function rememberHistoryAssets(source) {
    if (!source || !Array.isArray(source.assets)) return;
    for (const asset of source.assets) {
      if (asset && asset.id && asset.dataUrl && !historyAssetStore.has(asset.id)) {
        historyAssetStore.set(asset.id, { ...asset });
      }
    }
  }

  function expandHistorySnapshot(snapshot) {
    const next = JSON.parse(snapshot);
    if (Array.isArray(next.assets)) {
      next.assets = next.assets.map((asset) => {
        if (!asset || asset.dataUrl) return asset;
        const stored = historyAssetStore.get(asset.id);
        return stored ? { ...asset, dataUrl: stored.dataUrl } : asset;
      });
    }
    return next;
  }

  function historyEntryBytes(snapshot) {
    return snapshot.length * 2;
  }

  function recalcHistoryBytes() {
    historyBytes = history.reduce((sum, snapshot) => sum + historyEntryBytes(snapshot), 0);
  }

  function pruneHistory() {
    let pruned = 0;
    const allowedEntries = historyAllowedEntries();
    while (history.length > HISTORY_MIN_USABLE_ENTRIES &&
      (history.length > allowedEntries || historyBytes > HISTORY_MEMORY_LIMIT_BYTES)) {
      const removed = history.shift();
      historyBytes -= historyEntryBytes(removed);
      historyIndex = Math.max(0, historyIndex - 1);
      pruned += 1;
    }
    return pruned;
  }

  function historyAllowedEntries() {
    if (!history.length) return HISTORY_ENTRY_LIMIT;
    const averageBytes = Math.max(1, Math.ceil(historyBytes / history.length));
    return clamp(
      Math.floor(HISTORY_MEMORY_LIMIT_BYTES / averageBytes),
      HISTORY_MIN_USABLE_ENTRIES,
      HISTORY_ENTRY_LIMIT
    );
  }

  function resetHistory() {
    historyAssetStore.clear();
    const first = snapshotProject();
    history = [first];
    historyIndex = 0;
    historyBytes = historyEntryBytes(first);
  }

  function commitHistory() {
    const next = snapshotProject();
    if (history[historyIndex] === next) return false;
    history = history.slice(0, historyIndex + 1);
    recalcHistoryBytes();
    history.push(next);
    historyBytes += historyEntryBytes(next);
    historyIndex = history.length - 1;
    const pruned = pruneHistory();
    queueCacheSave();
    if (pruned) setHud(`History limited to ${history.length} steps`);
    return true;
  }

  function restoreProjectSnapshot(snapshot, rotation) {
    project = normalizeProject(expandHistorySnapshot(snapshot));
    view.rotation = Number.isInteger(rotation) ? rotation : project.view.rotation || 0;
    syncProjectView();
    updateRotateButton();
    imageCache.clear();
    invalidateFillCache();
    pendingImageAsset = null;
    pendingImagePoint = null;
    selectedImageIndex = -1;
    imageAction = null;
    selectedRange = null;
    rangeAction = null;
    selectionMoveAction = null;
    eraserAction = null;
    selectedTextIndex = -1;
    textDraft = null;
    textAction = null;
    textPanel.classList.add("hidden");
    previewStroke = null;
    activePointer = null;
    draw();
  }

  function undoProject() {
    if (historyIndex <= 0) {
      setHud("Nothing to undo");
      return;
    }
    const rotation = view.rotation;
    historyIndex -= 1;
    restoreProjectSnapshot(history[historyIndex], rotation);
    queueCacheSave();
    setHud(`Undo ${historyIndex + 1}/${history.length}`);
  }

  function redoProject() {
    if (historyIndex >= history.length - 1) {
      setHud("Nothing to redo");
      return;
    }
    const rotation = view.rotation;
    historyIndex += 1;
    restoreProjectSnapshot(history[historyIndex], rotation);
    queueCacheSave();
    setHud(`Redo ${historyIndex + 1}/${history.length}`);
  }

  function setTool(nextTool) {
    tool = nextTool;
    tools.forEach((button) => button.classList.toggle("active", button.dataset.tool === tool));
    canvas.style.cursor = getToolCursor();

    rangeAction = null;
    selectionMoveAction = null;

    if (tool === "image") {
      setHud("Image: import, select, move, resize corners");
    } else if (tool === "hand") {
      setHud("Hand: move assets, resize corners");
    } else if (tool === "eraser") {
      setHud("Eraser: drag exactly over filled cells or drawn lines");
    } else if (tool === "bucket") {
      setHud("Bucket: click or drag cells, shift-click enclosed area");
    } else if (tool === "text") {
      setHud("Text: drag a grid box, then type");
    } else {
      setHud("Pencil: drag a straight or diagonal line");
    }
  }

  function getToolCursor() {
    if (tool === "text") return "text";
    if (tool === "hand" || tool === "image") return "grab";
    if (tool === "eraser") return "cell";
    return "crosshair";
  }

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    view.width = Math.max(1, rect.width);
    view.height = Math.max(1, rect.height);
    view.dpr = dpr;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  function sheetWorld(sheet) {
    return {
      x: sheet.col * PAGE.width,
      y: sheet.row * PAGE.height,
      width: PAGE.width,
      height: PAGE.height
    };
  }

  function getSheetBounds() {
    const sheets = project.sheets.length ? project.sheets : [{ col: 0, row: 0 }];
    const minCol = Math.min(...sheets.map((sheet) => sheet.col));
    const maxCol = Math.max(...sheets.map((sheet) => sheet.col));
    const minRow = Math.min(...sheets.map((sheet) => sheet.row));
    const maxRow = Math.max(...sheets.map((sheet) => sheet.row));
    return {
      minCol,
      maxCol,
      minRow,
      maxRow,
      minX: minCol * PAGE.width,
      minY: minRow * PAGE.height,
      maxX: (maxCol + 1) * PAGE.width,
      maxY: (maxRow + 1) * PAGE.height,
      width: (maxCol - minCol + 1) * PAGE.width,
      height: (maxRow - minRow + 1) * PAGE.height
    };
  }

  function fitToSheets() {
    const bounds = getSheetBounds();
    const pad = 28;
    const rotated = view.rotation % 2 === 1;
    const fitWidth = rotated ? bounds.height : bounds.width;
    const fitHeight = rotated ? bounds.width : bounds.height;
    const scaleX = (view.width - pad * 2) / fitWidth;
    const scaleY = (view.height - pad * 2) / fitHeight;
    view.scale = clamp(Math.min(scaleX, scaleY), MIN_SCALE, MAX_SCALE);
    setViewCenter({
      x: bounds.minX + bounds.width / 2,
      y: bounds.minY + bounds.height / 2
    });
    draw();
  }

  function getViewCenter() {
    return {
      x: view.x + view.width / (2 * view.scale),
      y: view.y + view.height / (2 * view.scale)
    };
  }

  function setViewCenter(center) {
    view.x = center.x - view.width / (2 * view.scale);
    view.y = center.y - view.height / (2 * view.scale);
  }

  function rotateOffset(dx, dy) {
    const turn = ((view.rotation % 4) + 4) % 4;
    if (turn === 1) return { x: -dy, y: dx };
    if (turn === 2) return { x: -dx, y: -dy };
    if (turn === 3) return { x: dy, y: -dx };
    return { x: dx, y: dy };
  }

  function unrotateOffset(dx, dy) {
    const turn = ((view.rotation % 4) + 4) % 4;
    if (turn === 1) return { x: dy, y: -dx };
    if (turn === 2) return { x: -dx, y: -dy };
    if (turn === 3) return { x: -dy, y: dx };
    return { x: dx, y: dy };
  }

  function worldToScreen(point) {
    const center = getViewCenter();
    const rotated = rotateOffset(
      (point.x - center.x) * view.scale,
      (point.y - center.y) * view.scale
    );
    return {
      x: view.width / 2 + rotated.x,
      y: view.height / 2 + rotated.y
    };
  }

  function screenToWorld(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const center = getViewCenter();
    const unrotated = unrotateOffset(
      clientX - rect.left - view.width / 2,
      clientY - rect.top - view.height / 2
    );
    return {
      x: center.x + unrotated.x / view.scale,
      y: center.y + unrotated.y / view.scale
    };
  }

  function screenDeltaToWorldDelta(dx, dy) {
    const unrotated = unrotateOffset(dx, dy);
    return {
      x: unrotated.x / view.scale,
      y: unrotated.y / view.scale
    };
  }

  function rotationRadians() {
    return view.rotation * Math.PI / 2;
  }

  function normalizeRotation(value) {
    const next = Number.isFinite(value) ? Math.round(value) : 0;
    return ((next % 4) + 4) % 4;
  }

  function itemRotation(item) {
    return normalizeRotation(item && item.rotation);
  }

  function itemScreenAngle(item) {
    return (view.rotation + itemRotation(item)) * Math.PI / 2;
  }

  function itemCenter(item) {
    return {
      x: item.x + item.width / 2,
      y: item.y + item.height / 2
    };
  }

  function rotateLocal(point, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
      x: point.x * cos - point.y * sin,
      y: point.x * sin + point.y * cos
    };
  }

  function unrotateLocal(point, angle) {
    return rotateLocal(point, -angle);
  }

  function screenPointFromEvent(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  function screenPointToWorld(point) {
    const center = getViewCenter();
    const unrotated = unrotateOffset(
      point.x - view.width / 2,
      point.y - view.height / 2
    );
    return {
      x: center.x + unrotated.x / view.scale,
      y: center.y + unrotated.y / view.scale
    };
  }

  function getItemScreenCorners(item) {
    const center = worldToScreen(itemCenter(item));
    const width = item.width * view.scale;
    const height = item.height * view.scale;
    const angle = itemScreenAngle(item);
    return [
      { name: "nw", x: -width / 2, y: -height / 2 },
      { name: "ne", x: width / 2, y: -height / 2 },
      { name: "se", x: width / 2, y: height / 2 },
      { name: "sw", x: -width / 2, y: height / 2 }
    ].map((corner) => {
      const rotated = rotateLocal(corner, angle);
      return {
        name: corner.name,
        x: center.x + rotated.x,
        y: center.y + rotated.y
      };
    });
  }

  function screenPointInItem(screen, item) {
    const center = worldToScreen(itemCenter(item));
    const local = unrotateLocal({
      x: screen.x - center.x,
      y: screen.y - center.y
    }, itemScreenAngle(item));
    return Math.abs(local.x) <= item.width * view.scale / 2 &&
      Math.abs(local.y) <= item.height * view.scale / 2;
  }

  function drawRotatedSelection(item, color) {
    const corners = getItemScreenCorners(item);
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.setLineDash([7, 5]);
    ctx.beginPath();
    ctx.moveTo(corners[0].x, corners[0].y);
    for (let i = 1; i < corners.length; i += 1) {
      ctx.lineTo(corners[i].x, corners[i].y);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }

  function worldRectPath(x, y, width, height) {
    const points = [
      worldToScreen({ x, y }),
      worldToScreen({ x: x + width, y }),
      worldToScreen({ x: x + width, y: y + height }),
      worldToScreen({ x, y: y + height })
    ];
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i += 1) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
  }

  function pointInSheet(point) {
    return project.sheets.some((sheet) => {
      const rect = sheetWorld(sheet);
      return point.x >= rect.x &&
        point.x <= rect.x + rect.width &&
        point.y >= rect.y &&
        point.y <= rect.y + rect.height;
    });
  }

  function sheetAtPoint(point) {
    return project.sheets.find((sheet) => {
      const rect = sheetWorld(sheet);
      return point.x >= rect.x &&
        point.x <= rect.x + rect.width &&
        point.y >= rect.y &&
        point.y <= rect.y + rect.height;
    }) || null;
  }

  function snapPoint(point) {
    const step = 1 / snapDiv;
    return {
      x: Math.round(point.x / step) * step,
      y: Math.round(point.y / step) * step
    };
  }

  function snapLength(value) {
    const step = 1 / snapDiv;
    return Math.max(step, Math.round(value / step) * step);
  }

  function snapCell(point) {
    const step = 1 / snapDiv;
    return {
      x: Math.floor(point.x / step) * step,
      y: Math.floor(point.y / step) * step,
      size: step
    };
  }

  function constrainEightWay(start, rawEnd) {
    const dx = rawEnd.x - start.x;
    const dy = rawEnd.y - start.y;
    if (Math.abs(dx) < 0.00001 && Math.abs(dy) < 0.00001) {
      return { ...start };
    }

    const angle = Math.atan2(dy, dx);
    const oct = Math.round(angle / (Math.PI / 4));
    const snappedAngle = oct * Math.PI / 4;
    const len = Math.max(Math.abs(dx), Math.abs(dy));
    const end = {
      x: start.x + Math.cos(snappedAngle) * len,
      y: start.y + Math.sin(snappedAngle) * len
    };
    return snapPoint(end);
  }

  function pxForDoc(value) {
    return value * (view.scale / BASE_SQUARE_PX);
  }

  function applyWorldTransform(drawCtx) {
    const center = getViewCenter();
    drawCtx.translate(view.width / 2, view.height / 2);
    drawCtx.rotate(rotationRadians());
    drawCtx.scale(view.scale, view.scale);
    drawCtx.translate(-center.x, -center.y);
  }

  function getVisibleWorldRect() {
    const corners = [
      screenPointToWorld({ x: 0, y: 0 }),
      screenPointToWorld({ x: view.width, y: 0 }),
      screenPointToWorld({ x: view.width, y: view.height }),
      screenPointToWorld({ x: 0, y: view.height })
    ];
    const minX = Math.min(...corners.map((point) => point.x));
    const maxX = Math.max(...corners.map((point) => point.x));
    const minY = Math.min(...corners.map((point) => point.y));
    const maxY = Math.max(...corners.map((point) => point.y));
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }

  function draw() {
    ctx.clearRect(0, 0, view.width, view.height);
    ctx.fillStyle = "#262626";
    ctx.fillRect(0, 0, view.width, view.height);

    drawSheets();
    drawFills();
    drawRegions();
    drawImages();
    drawStrokes(project.strokes);
    drawTexts();

    if (previewStroke) {
      drawStrokes([previewStroke], true);
    }
    drawRangeSelection();
    drawTextSelection();
    drawImageSelection();
  }

  function drawSheets() {
    for (const sheet of project.sheets) {
      const rect = sheetWorld(sheet);

      ctx.save();
      worldRectPath(rect.x, rect.y, rect.width, rect.height);
      ctx.fillStyle = "#fbfbfb";
      ctx.fill();
      ctx.strokeStyle = "#909090";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      drawGrid(rect);
    }
  }

  function drawGrid(rect) {
    const startX = rect.x;
    const startY = rect.y;
    const endX = rect.x + rect.width;
    const endY = rect.y + rect.height;

    ctx.save();
    worldRectPath(rect.x, rect.y, rect.width, rect.height);
    ctx.clip();

    if (snapDiv > 1 && view.scale / snapDiv >= 3) {
      ctx.strokeStyle = "#e7eeee";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = startX; x <= endX + 0.0001; x += 1 / snapDiv) {
        if (Math.abs(x - Math.round(x)) < 0.0001) continue;
        const a = worldToScreen({ x, y: startY });
        const b = worldToScreen({ x, y: endY });
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
      }
      for (let y = startY; y <= endY + 0.0001; y += 1 / snapDiv) {
        if (Math.abs(y - Math.round(y)) < 0.0001) continue;
        const a = worldToScreen({ x: startX, y });
        const b = worldToScreen({ x: endX, y });
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
      }
      ctx.stroke();
    }

    ctx.strokeStyle = "#bad8d2";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = startX; x <= endX + 0.0001; x += 1) {
      const a = worldToScreen({ x, y: startY });
      const b = worldToScreen({ x, y: endY });
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
    }
    for (let y = startY; y <= endY + 0.0001; y += 1) {
      const a = worldToScreen({ x: startX, y });
      const b = worldToScreen({ x: endX, y });
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
    }
    ctx.stroke();

    ctx.strokeStyle = "#86aaa3";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = startX; x <= endX + 0.0001; x += PAGE.squaresPerInch) {
      const a = worldToScreen({ x, y: startY });
      const b = worldToScreen({ x, y: endY });
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
    }
    for (let y = startY; y <= endY + 0.0001; y += PAGE.squaresPerInch) {
      const a = worldToScreen({ x: startX, y });
      const b = worldToScreen({ x: endX, y });
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
    }
    ctx.stroke();
    ctx.restore();
  }

  function drawFills() {
    if (!project.fills.length) return;
    if (bucketAction || eraserAction) {
      drawFillsDirect();
      return;
    }
    const cache = getFillCache();
    if (!cache) {
      drawFillsDirect();
      return;
    }

    ctx.save();
    applyWorldTransform(ctx);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(
      cache.canvas,
      cache.bounds.minX,
      cache.bounds.minY,
      cache.bounds.width,
      cache.bounds.height
    );
    ctx.restore();
  }

  function drawFillsDirect() {
    const visible = getVisibleWorldRect();
    ctx.save();
    applyWorldTransform(ctx);
    let lastColor = "";
    for (const fill of project.fills) {
      if (!rectsOverlap({
        x: fill.x,
        y: fill.y,
        width: fill.size,
        height: fill.size
      }, visible)) {
        continue;
      }
      if (fill.color !== lastColor) {
        ctx.fillStyle = fill.color;
        lastColor = fill.color;
      }
      ctx.fillRect(fill.x, fill.y, fill.size, fill.size);
    }
    ctx.restore();
  }

  function getFillCache() {
    const bounds = getFillBounds();
    if (!bounds) return null;
    const width = Math.ceil(bounds.width * FILL_CACHE_SQUARE_PX);
    const height = Math.ceil(bounds.height * FILL_CACHE_SQUARE_PX);
    if (width <= 0 || height <= 0 || width * height > MAX_FILL_CACHE_PIXELS) {
      return null;
    }

    const key = [
      fillCacheVersion,
      project.fills.length,
      bounds.minX,
      bounds.minY,
      bounds.width,
      bounds.height,
      FILL_CACHE_SQUARE_PX
    ].join("|");
    if (fillCache && fillCache.key === key) {
      return fillCache;
    }

    const cacheCanvas = document.createElement("canvas");
    cacheCanvas.width = width;
    cacheCanvas.height = height;
    const cacheCtx = cacheCanvas.getContext("2d");
    cacheCtx.imageSmoothingEnabled = false;

    let lastColor = "";
    for (const fill of project.fills) {
      if (fill.color !== lastColor) {
        cacheCtx.fillStyle = fill.color;
        lastColor = fill.color;
      }
      cacheCtx.fillRect(
        Math.round((fill.x - bounds.minX) * FILL_CACHE_SQUARE_PX),
        Math.round((fill.y - bounds.minY) * FILL_CACHE_SQUARE_PX),
        Math.max(1, Math.round(fill.size * FILL_CACHE_SQUARE_PX)),
        Math.max(1, Math.round(fill.size * FILL_CACHE_SQUARE_PX))
      );
    }

    fillCache = {
      key,
      canvas: cacheCanvas,
      bounds
    };
    return fillCache;
  }

  function getFillBounds() {
    if (!project.fills.length) return null;
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const fill of project.fills) {
      const x = Number(fill && fill.x);
      const y = Number(fill && fill.y);
      const size = Number(fill && fill.size);
      if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(size) || size <= 0) continue;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x + size);
      maxY = Math.max(maxY, y + size);
    }

    if (!Number.isFinite(minX)) return null;
    return {
      minX,
      minY,
      width: Math.max(1 / MAX_SNAP_DIV, maxX - minX),
      height: Math.max(1 / MAX_SNAP_DIV, maxY - minY)
    };
  }

  function invalidateFillCache() {
    fillCacheVersion += 1;
    fillCache = null;
  }

  function drawRegions() {
    if (!project.regions || !project.regions.length) return;
    ctx.save();
    applyWorldTransform(ctx);
    for (const region of project.regions) {
      drawRegionPath(ctx, region, 1);
    }
    ctx.restore();
  }

  function drawRegionPath(drawCtx, region, scale) {
    const normalized = normalizeRegion(region);
    if (!normalized || !normalized.paths.length) return;
    drawCtx.beginPath();
    for (const path of normalized.paths) {
      if (!path || path.length < 3) continue;
      drawCtx.moveTo(path[0].x * scale, path[0].y * scale);
      for (let i = 1; i < path.length; i += 1) {
        drawCtx.lineTo(path[i].x * scale, path[i].y * scale);
      }
      drawCtx.closePath();
    }
    if (normalized.fill) {
      drawCtx.fillStyle = normalized.color;
      drawCtx.fill("evenodd");
    }
    if (normalized.stroke) {
      drawCtx.save();
      drawCtx.strokeStyle = normalized.strokeColor;
      drawCtx.lineWidth = Math.max(0.001, normalized.strokeWidth / BASE_SQUARE_PX * scale);
      drawCtx.lineCap = normalized.lineCap;
      drawCtx.lineJoin = normalized.lineJoin;
      drawCtx.miterLimit = normalized.miterLimit;
      drawCtx.globalAlpha = normalized.globalAlpha;
      drawCtx.stroke();
      drawCtx.restore();
    }
  }

  function drawStrokes(strokes, preview) {
    ctx.save();
    for (const stroke of strokes) {
      if (stroke.points.length < 2) continue;
      ctx.beginPath();
      const start = worldToScreen(stroke.points[0]);
      ctx.moveTo(start.x, start.y);
      for (let i = 1; i < stroke.points.length; i += 1) {
        const point = worldToScreen(stroke.points[i]);
        ctx.lineTo(point.x, point.y);
      }
      ctx.strokeStyle = strokeColor(stroke);
      ctx.globalAlpha = preview ? 0.68 : strokeAlpha(stroke);
      ctx.lineCap = strokeLineCap(stroke);
      ctx.lineJoin = strokeLineJoin(stroke);
      ctx.miterLimit = strokeMiterLimit(stroke);
      ctx.lineWidth = Math.max(0.7, pxForDoc(strokeWidth(stroke)));
      ctx.stroke();
    }
    ctx.restore();
  }

  function strokeColor(stroke) {
    return exportCanvasColor(
      stroke && (stroke.color || stroke.strokeColor || stroke.strokeStyle),
      "#000000"
    );
  }

  function strokeWidth(stroke) {
    return clamp(Number(stroke && (stroke.width ?? stroke.strokeWidth ?? stroke.lineWidth)) || 1, 0.1, 256);
  }

  function strokeAlpha(stroke) {
    const value = Number(stroke && (stroke.globalAlpha ?? stroke.alpha ?? stroke.opacity));
    return Number.isFinite(value) ? clamp(value, 0, 1) : 1;
  }

  function strokeLineCap(stroke) {
    const value = String(stroke && (stroke.lineCap || stroke.cap) || "round");
    return ["butt", "round", "square"].includes(value) ? value : "round";
  }

  function strokeLineJoin(stroke) {
    const value = String(stroke && (stroke.lineJoin || stroke.join) || "round");
    return ["bevel", "round", "miter"].includes(value) ? value : "round";
  }

  function strokeMiterLimit(stroke) {
    const value = Number(stroke && stroke.miterLimit);
    return Number.isFinite(value) && value > 0 ? value : 10;
  }

  function drawTexts() {
    ctx.save();
    for (const item of project.texts) {
      drawTextItem(item);
    }
    if (textDraft) {
      drawTextItem(textDraft, true);
    }
    ctx.restore();
  }

  function drawTextItem(item, isDraft) {
    const normalized = normalizeTextItem(item);
    const p = worldToScreen(itemCenter(normalized));
    const width = normalized.width * view.scale;
    const height = normalized.height * view.scale;
    const pad = Math.max(3, view.scale * 0.12);
    const size = pxForDoc(normalized.size);
    const lineHeight = size * 1.18;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(itemScreenAngle(normalized));

    if (normalized.highlight) {
      ctx.fillStyle = normalized.highlightColor;
      ctx.fillRect(-width / 2, -height / 2, width, height);
    }

    if (isDraft && !normalized.text) {
      ctx.fillStyle = "rgba(24, 161, 111, 0.08)";
      ctx.fillRect(-width / 2, -height / 2, width, height);
    }

    ctx.beginPath();
    ctx.rect(-width / 2, -height / 2, width, height);
    ctx.clip();
    ctx.fillStyle = normalized.color;
    ctx.font = textFontString(normalized, size);
    ctx.textBaseline = "top";
    ctx.textAlign = normalized.align;

    if (normalized.glow) {
      ctx.shadowColor = normalized.glowColor;
      ctx.shadowBlur = pxForDoc(normalized.glowSize);
    }

    const lines = wrapTextLines(ctx, normalized.text || "", Math.max(1, width - pad * 2));
    let y = -height / 2 + pad;
    for (const line of lines) {
      if (y + lineHeight > height / 2 + 0.1) break;
      const x = -width / 2 + textLineX(normalized.align, width, pad);
      ctx.fillText(line, x, y);
      drawTextDecorations(normalized, line, x, y, size);
      y += lineHeight;
    }

    ctx.restore();
  }

  function drawTextDecorations(item, line, x, y, size) {
    if (!item.underline && !item.strike) return;
    const metrics = ctx.measureText(line);
    let startX = x;
    if (item.align === "center") startX = x - metrics.width / 2;
    if (item.align === "right") startX = x - metrics.width;
    ctx.save();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = item.color;
    ctx.lineWidth = Math.max(1, size / 16);
    if (item.underline) {
      ctx.beginPath();
      ctx.moveTo(startX, y + size * 1.03);
      ctx.lineTo(startX + metrics.width, y + size * 1.03);
      ctx.stroke();
    }
    if (item.strike) {
      ctx.beginPath();
      ctx.moveTo(startX, y + size * 0.56);
      ctx.lineTo(startX + metrics.width, y + size * 0.56);
      ctx.stroke();
    }
    ctx.restore();
  }

  function textLineX(align, width, pad) {
    if (align === "center") return width / 2;
    if (align === "right") return width - pad;
    return pad;
  }

  function wrapTextLines(drawCtx, text, maxWidth) {
    const sourceLines = String(text || "").split(/\r?\n/);
    const lines = [];
    for (const source of sourceLines) {
      const words = source.split(/(\s+)/).filter(Boolean);
      if (!words.length) {
        lines.push("");
        continue;
      }
      let line = "";
      for (const word of words) {
        const test = line + word;
        if (line && drawCtx.measureText(test).width > maxWidth) {
          lines.push(line.trimEnd());
          line = word.trimStart();
        } else {
          line = test;
        }
      }
      lines.push(line.trimEnd());
    }
    return lines.length ? lines : [""];
  }

  function textFontString(item, size) {
    const weight = item.bold ? "700" : "400";
    const style = item.italic ? "italic" : "normal";
    return `${style} ${weight} ${size}px ${cssFont(item.font)}`;
  }

  function drawTextSelection() {
    const item = textDraft || project.texts[selectedTextIndex];
    if (!item) return;
    drawRotatedSelection(normalizeTextItem(item), "#18a16f");
  }

  function normalizeTextItem(item) {
    return {
      x: roundUnit(item.x || 0),
      y: roundUnit(item.y || 0),
      width: roundUnit(item.width || 8),
      height: roundUnit(item.height || 3),
      text: item.text || "",
      color: normalizeHex(item.color) || "#000000",
      font: item.font || "Arial",
      size: clamp(Number(item.size) || 28, MIN_TEXT_SIZE, 240),
      highlight: Boolean(item.highlight),
      highlightColor: normalizeHex(item.highlightColor) || "#FFFF66",
      align: ["left", "center", "right"].includes(item.align) ? item.align : "left",
      rotation: normalizeRotation(item.rotation),
      bold: Boolean(item.bold),
      italic: Boolean(item.italic),
      underline: Boolean(item.underline),
      strike: Boolean(item.strike),
      glow: Boolean(item.glow),
      glowColor: normalizeHex(item.glowColor) || "#18A16F",
      glowSize: clamp(Number(item.glowSize) || 8, 0, 30)
    };
  }

  function drawImages() {
    ctx.save();
    for (const item of project.images) {
      const asset = project.assets.find((entry) => entry.id === item.assetId);
      if (!asset) continue;
      const img = getImage(asset);
      if (!img.complete) continue;
      const p = worldToScreen(itemCenter(item));
      const width = item.width * view.scale;
      const height = item.height * view.scale;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(itemScreenAngle(item));
      ctx.drawImage(img, -width / 2, -height / 2, width, height);
      ctx.restore();
    }
    ctx.restore();
  }

  function drawImageSelection() {
    const item = project.images[selectedImageIndex];
    if (!item) return;
    drawRotatedSelection(item, "#18a16f");
    const corners = getItemScreenCorners(item);
    ctx.save();
    ctx.fillStyle = "#18a16f";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    for (const corner of corners) {
      ctx.beginPath();
      ctx.rect(corner.x - 5, corner.y - 5, 10, 10);
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
  }

  function getImage(asset) {
    if (imageCache.has(asset.id)) {
      return imageCache.get(asset.id);
    }
    const img = new Image();
    img.onload = draw;
    img.src = asset.dataUrl;
    imageCache.set(asset.id, img);
    return img;
  }

  function normalizeImageItem(item) {
    return {
      assetId: item.assetId,
      x: roundUnit(item.x || 0),
      y: roundUnit(item.y || 0),
      width: roundUnit(Math.max(1 / MAX_SNAP_DIV, Number(item.width) || 4)),
      height: roundUnit(Math.max(1 / MAX_SNAP_DIV, Number(item.height) || 4)),
      rotation: normalizeRotation(item.rotation)
    };
  }

  function normalizeRegion(region) {
    if (!region || !Array.isArray(region.paths)) return null;
    const paths = region.paths
      .map((path) => Array.isArray(path)
        ? path
          .map((point) => ({
            x: roundUnit(Number(point.x) || 0),
            y: roundUnit(Number(point.y) || 0)
          }))
          .filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y))
        : [])
      .filter((path) => path.length >= 3);
    if (!paths.length) return null;
    const fill = region.fill !== false && region.fillEnabled !== false;
    const strokeDisabled = region.stroke === false ||
      region.strokeEnabled === false ||
      region.outline === false ||
      region.outlineEnabled === false;
    const stroke = !strokeDisabled && Boolean(
      region.stroke ||
      region.strokeEnabled ||
      region.outline ||
      region.outlineEnabled ||
      region.strokeColor ||
      region.strokeStyle ||
      region.lineWidth ||
      region.strokeWidth
    );
    const strokeObject = region.stroke && typeof region.stroke === "object" ? region.stroke : {};
    const strokeColorValue = typeof region.stroke === "string" ? region.stroke : null;
    const next = {
      color: exportCanvasColor(region.color, "#000000"),
      fill,
      paths
    };
    if (stroke) {
      next.stroke = true;
      next.strokeColor = exportCanvasColor(
        region.strokeColor || region.strokeStyle || region.outlineColor ||
        strokeColorValue || strokeObject.color || strokeObject.strokeStyle || "#000000",
        "#000000"
      );
      next.strokeWidth = strokeWidth({
        width: region.strokeWidth ?? region.lineWidth ?? region.outlineWidth ?? region.width ??
          strokeObject.width ?? strokeObject.strokeWidth ?? strokeObject.lineWidth
      });
      next.lineCap = strokeLineCap({ lineCap: region.lineCap ?? region.cap ?? strokeObject.lineCap ?? strokeObject.cap });
      next.lineJoin = strokeLineJoin({ lineJoin: region.lineJoin ?? region.join ?? strokeObject.lineJoin ?? strokeObject.join });
      next.miterLimit = strokeMiterLimit({ miterLimit: region.miterLimit ?? strokeObject.miterLimit });
      next.globalAlpha = strokeAlpha({
        globalAlpha: region.globalAlpha ?? region.strokeAlpha ?? strokeObject.globalAlpha ??
          strokeObject.alpha ?? strokeObject.opacity
      });
    }
    if (!next.fill && !next.stroke) return null;
    return next;
  }

  function cssFont(name) {
    return name.includes(" ") ? `"${name.replace(/"/g, "")}"` : name;
  }

  function beginPencil(event) {
    const start = snapPoint(screenToWorld(event.clientX, event.clientY));
    if (!pointInSheet(start)) return;
    activePointer = {
      id: event.pointerId,
      start
    };
    previewStroke = {
      color: currentColor,
      width: getStrokeWidth(),
      points: [start, start]
    };
    canvas.setPointerCapture(event.pointerId);
  }

  function movePencil(event) {
    if (!activePointer || activePointer.id !== event.pointerId) return;
    const raw = snapPoint(screenToWorld(event.clientX, event.clientY));
    const end = constrainEightWay(activePointer.start, raw);
    previewStroke.points = [activePointer.start, end];
    draw();
  }

  function endPencil(event) {
    if (!activePointer || activePointer.id !== event.pointerId) return;
    const raw = snapPoint(screenToWorld(event.clientX, event.clientY));
    const end = constrainEightWay(activePointer.start, raw);
    let changed = false;
    if (distance(activePointer.start, end) > 0) {
      project.strokes.push({
        color: currentColor,
        width: getStrokeWidth(),
        points: [activePointer.start, end]
      });
      changed = true;
    }
    previewStroke = null;
    activePointer = null;
    if (changed) commitHistory();
    draw();
  }

  function distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function getStrokeWidth() {
    return clamp(Number(strokeSize.value) || 1, 1, 64);
  }

  function fillAt(event) {
    const point = screenToWorld(event.clientX, event.clientY);
    if (!pointInSheet(point)) return;
    if (event.shiftKey) {
      areaFill(point);
    } else if (selectedRange && pointInSelection(point, selectedRange)) {
      fillSelection(currentColor);
    } else {
      setFill(snapCell(point), currentColor);
    }
    commitHistory();
    draw();
  }

  function fillSelection(color) {
    const cells = cellsForSelection(selectedRange);
    if (!cells || !cells.length) return false;
    setFills(cells, color);
    return true;
  }

  function beginBucket(event) {
    const point = screenToWorld(event.clientX, event.clientY);
    if (!pointInSheet(point)) return;
    if (event.shiftKey) {
      areaFill(point);
      commitHistory();
      draw();
      return;
    }
    if (selectedRange && pointInSelection(point, selectedRange)) {
      if (fillSelection(currentColor)) {
        commitHistory();
        setHud("Selection filled");
      }
      draw();
      return;
    }

    bucketAction = {
      id: event.pointerId,
      last: point,
      cells: new Set(),
      indexes: new Map(project.fills.map((fill, index) => [fillKey(fill), index])),
      changed: false
    };
    canvas.setPointerCapture(event.pointerId);
    fillBucketAlong(point, point);
    draw();
  }

  function moveBucket(event) {
    if (!bucketAction || bucketAction.id !== event.pointerId) return;
    const point = screenToWorld(event.clientX, event.clientY);
    fillBucketAlong(bucketAction.last, point);
    bucketAction.last = point;
    draw();
  }

  function endBucket(event) {
    if (!bucketAction || bucketAction.id !== event.pointerId) return;
    const changed = bucketAction.changed;
    bucketAction = null;
    if (changed) {
      invalidateFillCache();
      commitHistory();
      setHud("Cells filled");
    }
    draw();
  }

  function cancelBucket(event) {
    if (!bucketAction || bucketAction.id !== event.pointerId) return;
    bucketAction = null;
    invalidateFillCache();
    draw();
  }

  function fillBucketAlong(start, end) {
    const step = 1 / snapDiv;
    const distance = Math.hypot(end.x - start.x, end.y - start.y);
    const samples = Math.max(1, Math.ceil(distance / Math.max(step / 2, 0.01)));
    for (let i = 0; i <= samples; i += 1) {
      const t = samples === 0 ? 0 : i / samples;
      fillBucketAt({
        x: start.x + (end.x - start.x) * t,
        y: start.y + (end.y - start.y) * t
      });
    }
  }

  function fillBucketAt(point) {
    if (!pointInSheet(point) || !bucketAction) return;
    const cell = snapCell(point);
    const key = fillKey(cell);
    if (bucketAction.cells.has(key)) return;
    bucketAction.cells.add(key);
    if (setFill(cell, currentColor, true, bucketAction.indexes)) {
      bucketAction.changed = true;
    }
  }

  function beginEraser(event) {
    const point = screenToWorld(event.clientX, event.clientY);
    if (!pointInSheet(point)) return;
    eraserAction = {
      id: event.pointerId,
      last: point,
      cells: new Set(),
      changed: false
    };
    canvas.setPointerCapture(event.pointerId);
    eraseAlong(point, point);
    draw();
  }

  function moveEraser(event) {
    if (!eraserAction || eraserAction.id !== event.pointerId) return;
    const point = screenToWorld(event.clientX, event.clientY);
    eraseAlong(eraserAction.last, point);
    eraserAction.last = point;
    draw();
  }

  function endEraser(event) {
    if (!eraserAction || eraserAction.id !== event.pointerId) return;
    const changed = eraserAction.changed;
    eraserAction = null;
    if (changed) {
      commitHistory();
      setHud("Erased");
    }
    draw();
  }

  function cancelEraser(event) {
    if (!eraserAction || eraserAction.id !== event.pointerId) return;
    eraserAction = null;
    draw();
  }

  function eraseAlong(start, end) {
    const step = Math.max(1 / (snapDiv * 4), 3 / Math.max(view.scale, 1));
    const distance = Math.hypot(end.x - start.x, end.y - start.y);
    const samples = Math.max(1, Math.ceil(distance / step));
    for (let i = 0; i <= samples; i += 1) {
      const t = samples === 0 ? 0 : i / samples;
      eraseAt({
        x: start.x + (end.x - start.x) * t,
        y: start.y + (end.y - start.y) * t
      });
    }
  }

  function eraseAt(point) {
    if (!pointInSheet(point)) return;
    const cell = snapCell(point);
    const key = fillKey(cell);
    if (eraserAction && eraserAction.cells.has(key)) return;
    if (eraserAction) eraserAction.cells.add(key);

    const strokesAtPointChanged = eraseStrokesAtPoint(point);
    const fillsChanged = strokesAtPointChanged ? false : eraseFillsInCell(cell);
    const regionsChanged = strokesAtPointChanged || fillsChanged ? false : eraseRegionsAtPoint(point);
    const strokesInCellChanged = strokesAtPointChanged || fillsChanged || regionsChanged ? false : eraseStrokesInCell(cell);

    if (eraserAction && (strokesAtPointChanged || fillsChanged || regionsChanged || strokesInCellChanged)) {
      eraserAction.changed = true;
    }
  }

  function eraseFillsInCell(cell) {
    const before = project.fills.length;
    project.fills = project.fills.filter((fill) => !rectsOverlap({
      x: fill.x,
      y: fill.y,
      width: fill.size,
      height: fill.size
    }, {
      x: cell.x,
      y: cell.y,
      width: cell.size,
      height: cell.size
    }));
    const changed = project.fills.length !== before;
    if (changed) invalidateFillCache();
    return changed;
  }

  function eraseRegionsAtPoint(point) {
    if (!project.regions || !project.regions.length) return false;
    const before = project.regions.length;
    project.regions = project.regions.filter((region) => !pointInRegion(point, region));
    return project.regions.length !== before;
  }

  function pointInRegion(point, region) {
    let inside = false;
    for (const path of region.paths || []) {
      if (pointInPolygon(point, path)) {
        inside = !inside;
      }
    }
    return inside;
  }

  function pointInPolygon(point, path) {
    let inside = false;
    for (let i = 0, j = path.length - 1; i < path.length; j = i, i += 1) {
      const a = path[i];
      const b = path[j];
      const intersects = ((a.y > point.y) !== (b.y > point.y)) &&
        point.x < (b.x - a.x) * (point.y - a.y) / ((b.y - a.y) || 0.000001) + a.x;
      if (intersects) inside = !inside;
    }
    return inside;
  }

  function eraseStrokesAtPoint(point) {
    const before = project.strokes.length;
    project.strokes = project.strokes.filter((stroke) => !strokeHitAtPoint(stroke, point));
    return project.strokes.length !== before;
  }

  function strokeHitAtPoint(stroke, point) {
    if (!stroke.points || stroke.points.length < 2) return false;
    const radius = eraserStrokeRadius(stroke);
    for (let i = 1; i < stroke.points.length; i += 1) {
      if (pointSegmentDistance(point, stroke.points[i - 1], stroke.points[i]) <= radius) {
        return true;
      }
    }
    return false;
  }

  function eraseStrokesInCell(cell) {
    const before = project.strokes.length;
    const rect = {
      x: cell.x,
      y: cell.y,
      width: cell.size,
      height: cell.size
    };
    project.strokes = project.strokes.filter((stroke) => !strokeIntersectsRect(stroke, rect));
    return project.strokes.length !== before;
  }

  function strokeIntersectsRect(stroke, rect) {
    if (!stroke.points || stroke.points.length < 2) return false;
    for (let i = 1; i < stroke.points.length; i += 1) {
      if (segmentIntersectsRect(stroke.points[i - 1], stroke.points[i], rect)) {
        return true;
      }
    }
    return false;
  }

  function eraserStrokeRadius(stroke) {
    const halfStrokeWidth = ((stroke.width || 1) / BASE_SQUARE_PX) / 2;
    const screenSlop = 2 / Math.max(view.scale, 1);
    return halfStrokeWidth + screenSlop;
  }

  function rectsOverlap(a, b) {
    return a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y;
  }

  function pointSegmentDistance(point, a, b) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const lenSq = dx * dx + dy * dy;
    if (lenSq === 0) return Math.hypot(point.x - a.x, point.y - a.y);
    const t = clamp(((point.x - a.x) * dx + (point.y - a.y) * dy) / lenSq, 0, 1);
    return Math.hypot(point.x - (a.x + dx * t), point.y - (a.y + dy * t));
  }

  function fillKey(cell) {
    return `${roundUnit(cell.x)},${roundUnit(cell.y)},${roundUnit(cell.size)}`;
  }

  function roundUnit(value) {
    return Math.round(value * 100000) / 100000;
  }

  function setFill(cell, color, skipInvalidate, indexes) {
    const key = fillKey(cell);
    const index = indexes ? indexes.get(key) : project.fills.findIndex((fill) => fillKey(fill) === key);
    const next = {
      x: roundUnit(cell.x),
      y: roundUnit(cell.y),
      size: roundUnit(cell.size),
      color
    };
    if (index >= 0) {
      const current = project.fills[index];
      if (current.x === next.x && current.y === next.y && current.size === next.size && current.color === next.color) {
        return false;
      }
      project.fills[index] = next;
    } else {
      if (indexes) indexes.set(key, project.fills.length);
      project.fills.push(next);
    }
    if (!skipInvalidate) invalidateFillCache();
    return true;
  }

  function setFills(cells, color) {
    const indexes = new Map(project.fills.map((fill, index) => [fillKey(fill), index]));
    for (const cell of cells) {
      const next = {
        x: roundUnit(cell.x),
        y: roundUnit(cell.y),
        size: roundUnit(cell.size),
        color
      };
      const key = fillKey(next);
      const index = indexes.get(key);
      if (index >= 0) {
        project.fills[index] = next;
      } else {
        indexes.set(key, project.fills.length);
        project.fills.push(next);
      }
    }
    invalidateFillCache();
  }

  function areaFill(point) {
    const bounds = getSheetBounds();
    const requestedFillDiv = Math.max(snapDiv, AREA_FILL_DIV);
    const fillDiv = fitAreaFillDiv(bounds, requestedFillDiv);
    const step = 1 / fillDiv;
    const columns = Math.round(bounds.width / step);
    const rows = Math.round(bounds.height / step);
    if (columns * rows > MAX_AREA_FILL_GRID_CELLS) {
      setHud("Area fill skipped: detail is too tiny");
      return;
    }

    const sx = clamp(Math.floor((point.x - bounds.minX) / step), 0, columns - 1);
    const sy = clamp(Math.floor((point.y - bounds.minY) / step), 0, rows - 1);
    if (!isInsideAnySheet(bounds.minX + (sx + 0.5) * step, bounds.minY + (sy + 0.5) * step)) {
      setHud("No paper there");
      return;
    }

    const mask = buildAreaFillMask(bounds, step, columns, rows);
    const data = mask.data;
    let startIndex = sy * columns + sx;
    if (data[startIndex] < 20) {
      startIndex = nearestOpenMaskCell(sx, sy, bounds, step, columns, rows, data);
    }
    if (startIndex < 0) {
      setHud("Start point is on a line");
      return;
    }

    const fill = floodMask(data, startIndex, bounds, step, columns, rows);
    if (!fill.count) {
      setHud("No enclosed area found");
      return;
    }
    if (fill.stopped) {
      setHud("Area fill too large");
      return;
    }

    const paths = traceFilledMaskToPaths(fill.visited, columns, rows, bounds, step)
      .map((path) => simplifyClosedPath(path, step * 1.1))
      .filter((path) => path.length >= 3);

    if (!paths.length) {
      setHud("No region found");
      return;
    }

    project.regions.push({
      color: currentColor,
      paths
    });
    setHud(`Region filled (${paths.reduce((sum, path) => sum + path.length, 0)} points)`);
  }

  function fitAreaFillDiv(bounds, requestedFillDiv) {
    let fillDiv = requestedFillDiv;
    while (fillDiv > AREA_FILL_MIN_DIV &&
      Math.round(bounds.width * fillDiv) * Math.round(bounds.height * fillDiv) > MAX_AREA_FILL_GRID_CELLS) {
      fillDiv = Math.max(AREA_FILL_MIN_DIV, Math.floor(fillDiv / 2));
    }
    return fillDiv;
  }

  function floodMask(data, startIndex, bounds, step, columns, rows) {
    const visited = new Uint8Array(columns * rows);
    const queue = [startIndex];
    let count = 0;
    let stopped = false;
    visited[startIndex] = 1;

    while (queue.length) {
      const current = queue.pop();
      const cx = current % columns;
      const cy = Math.floor(current / columns);
      count += 1;

      if (count > MAX_AREA_FILL_VISITED_CELLS) {
        stopped = true;
        break;
      }

      visit(cx + 1, cy);
      visit(cx - 1, cy);
      visit(cx, cy + 1);
      visit(cx, cy - 1);
    }

    return { visited, count, stopped };

    function visit(x, y) {
      if (x < 0 || y < 0 || x >= columns || y >= rows) return;
      const index = y * columns + x;
      if (visited[index] || data[index] < 20) return;
      const center = {
        x: bounds.minX + (x + 0.5) * step,
        y: bounds.minY + (y + 0.5) * step
      };
      if (!isInsideAnySheet(center.x, center.y)) return;
      visited[index] = 1;
      queue.push(index);
    }
  }

  function traceFilledMaskToPaths(filled, columns, rows, bounds, step) {
    const edges = new Map();
    let edgeCount = 0;

    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < columns; x += 1) {
        if (!filled[y * columns + x]) continue;
        if (!filledAt(x, y - 1)) addEdge({ x, y }, { x: x + 1, y });
        if (!filledAt(x + 1, y)) addEdge({ x: x + 1, y }, { x: x + 1, y: y + 1 });
        if (!filledAt(x, y + 1)) addEdge({ x: x + 1, y: y + 1 }, { x, y: y + 1 });
        if (!filledAt(x - 1, y)) addEdge({ x, y: y + 1 }, { x, y });
      }
    }

    const paths = [];
    while (edgeCount > 0) {
      const startKey = firstEdgeKey();
      if (!startKey) break;
      const first = takeEdge(startKey);
      if (!first) break;
      const start = first.a;
      let current = first.b;
      const vertices = [start];
      let guard = 0;
      let closed = pointKey(current) === pointKey(start);

      while (guard < edgeCount + columns * rows && pointKey(current) !== pointKey(start)) {
        vertices.push(current);
        const next = takeEdge(pointKey(current));
        if (!next) break;
        current = next.b;
        closed = pointKey(current) === pointKey(start);
        guard += 1;
      }

      if (closed && vertices.length >= 3) {
        paths.push(vertices.map((vertex) => ({
          x: roundUnit(bounds.minX + vertex.x * step),
          y: roundUnit(bounds.minY + vertex.y * step)
        })));
      }
    }

    return paths;

    function filledAt(x, y) {
      return x >= 0 && y >= 0 && x < columns && y < rows && filled[y * columns + x];
    }

    function addEdge(a, b) {
      const key = pointKey(a);
      if (!edges.has(key)) edges.set(key, []);
      edges.get(key).push({ a, b });
      edgeCount += 1;
    }

    function firstEdgeKey() {
      for (const [key, list] of edges) {
        if (list.length) return key;
      }
      return "";
    }

    function takeEdge(key) {
      const list = edges.get(key);
      if (!list || !list.length) return null;
      const edge = list.pop();
      edgeCount -= 1;
      if (!list.length) edges.delete(key);
      return edge;
    }

    function pointKey(point) {
      return `${point.x},${point.y}`;
    }
  }

  function simplifyClosedPath(path, tolerance) {
    let next = removeCollinearPoints(path);
    let changed = true;

    while (changed && next.length > 3) {
      changed = false;
      const simplified = [];
      for (let i = 0; i < next.length; i += 1) {
        const prev = next[(i - 1 + next.length) % next.length];
        const point = next[i];
        const following = next[(i + 1) % next.length];
        if (pointSegmentDistance(point, prev, following) <= tolerance) {
          changed = true;
          continue;
        }
        simplified.push(point);
      }
      if (simplified.length < 3) break;
      changed = simplified.length !== next.length;
      next = simplified;
    }

    return next;
  }

  function removeCollinearPoints(path) {
    const result = [];
    const epsilon = 0.000001;
    for (let i = 0; i < path.length; i += 1) {
      const prev = path[(i - 1 + path.length) % path.length];
      const point = path[i];
      const next = path[(i + 1) % path.length];
      const cross = (point.x - prev.x) * (next.y - point.y) -
        (point.y - prev.y) * (next.x - point.x);
      if (Math.abs(cross) > epsilon) {
        result.push(point);
      }
    }
    return result.length >= 3 ? result : path;
  }

  function localAreaFillFallback(point, bounds, step, columns, rows, data, globalCells) {
    const clickedCell = snapCell(point);
    const fillDiv = Math.max(1, Math.round(1 / step));
    const threshold = Math.max(900, fillDiv * fillDiv * 4);
    if (globalCells.length <= threshold || !cellHasDrawnStroke(clickedCell)) {
      return null;
    }

    const minX = clamp(Math.floor((clickedCell.x - bounds.minX) / step), 0, columns - 1);
    const maxX = clamp(Math.ceil((clickedCell.x + clickedCell.size - bounds.minX) / step) - 1, 0, columns - 1);
    const minY = clamp(Math.floor((clickedCell.y - bounds.minY) / step), 0, rows - 1);
    const maxY = clamp(Math.ceil((clickedCell.y + clickedCell.size - bounds.minY) / step) - 1, 0, rows - 1);
    let sx = clamp(Math.floor((point.x - bounds.minX) / step), minX, maxX);
    let sy = clamp(Math.floor((point.y - bounds.minY) / step), minY, maxY);
    let startIndex = sy * columns + sx;

    if (data[startIndex] < 20) {
      const nearest = nearestOpenMaskCellInRect(sx, sy, minX, maxX, minY, maxY, columns, data);
      if (nearest < 0) return null;
      startIndex = nearest;
      sx = startIndex % columns;
      sy = Math.floor(startIndex / columns);
    }

    const visited = new Uint8Array(columns * rows);
    const queue = [startIndex];
    const cells = [];
    visited[startIndex] = 1;

    while (queue.length) {
      const current = queue.pop();
      const cx = current % columns;
      const cy = Math.floor(current / columns);
      cells.push({
        x: roundUnit(bounds.minX + cx * step),
        y: roundUnit(bounds.minY + cy * step),
        size: step
      });

      visitLocal(cx + 1, cy);
      visitLocal(cx - 1, cy);
      visitLocal(cx, cy + 1);
      visitLocal(cx, cy - 1);
    }

    return cells.length ? cells : null;

    function visitLocal(x, y) {
      if (x < minX || x > maxX || y < minY || y > maxY) return;
      const index = y * columns + x;
      if (visited[index] || data[index] < 20) return;
      visited[index] = 1;
      queue.push(index);
    }
  }

  function cellHasDrawnStroke(cell) {
    const rect = {
      x: cell.x,
      y: cell.y,
      width: cell.size,
      height: cell.size
    };
    for (const stroke of project.strokes) {
      if (!stroke.points || stroke.points.length < 2) continue;
      for (let i = 1; i < stroke.points.length; i += 1) {
        if (segmentIntersectsRect(stroke.points[i - 1], stroke.points[i], rect)) {
          return true;
        }
      }
    }
    return false;
  }

  function buildAreaFillMask(bounds, step, columns, rows) {
    const barrier = document.createElement("canvas");
    barrier.width = columns;
    barrier.height = rows;
    const bctx = barrier.getContext("2d", { willReadFrequently: true });
    bctx.fillStyle = "#fff";
    bctx.fillRect(0, 0, columns, rows);
    bctx.strokeStyle = "#000";
    bctx.lineCap = "round";
    bctx.lineJoin = "round";

    for (const stroke of project.strokes) {
      if (!stroke.points || stroke.points.length < 2) continue;
      bctx.lineWidth = Math.max(2, ((stroke.width || 1) / BASE_SQUARE_PX) / step);
      bctx.beginPath();
      bctx.moveTo(
        (stroke.points[0].x - bounds.minX) / step,
        (stroke.points[0].y - bounds.minY) / step
      );
      for (let i = 1; i < stroke.points.length; i += 1) {
        bctx.lineTo(
          (stroke.points[i].x - bounds.minX) / step,
          (stroke.points[i].y - bounds.minY) / step
        );
      }
      bctx.stroke();
    }

    const image = bctx.getImageData(0, 0, columns, rows).data;
    const data = new Uint8Array(columns * rows);
    for (let i = 0; i < data.length; i += 1) {
      data[i] = image[i * 4];
    }
    return { data };
  }

  function nearestOpenMaskCell(sx, sy, bounds, step, columns, rows, data) {
    const maxRadius = Math.min(12, Math.max(columns, rows));
    for (let radius = 1; radius <= maxRadius; radius += 1) {
      for (let y = sy - radius; y <= sy + radius; y += 1) {
        for (let x = sx - radius; x <= sx + radius; x += 1) {
          if (Math.abs(x - sx) !== radius && Math.abs(y - sy) !== radius) continue;
          if (x < 0 || y < 0 || x >= columns || y >= rows) continue;
          const index = y * columns + x;
          if (data[index] < 20) continue;
          const center = {
            x: bounds.minX + (x + 0.5) * step,
            y: bounds.minY + (y + 0.5) * step
          };
          if (isInsideAnySheet(center.x, center.y)) return index;
        }
      }
    }
    return -1;
  }

  function nearestOpenMaskCellInRect(sx, sy, minX, maxX, minY, maxY, columns, data) {
    const maxRadius = Math.max(maxX - minX, maxY - minY);
    for (let radius = 1; radius <= maxRadius; radius += 1) {
      for (let y = sy - radius; y <= sy + radius; y += 1) {
        for (let x = sx - radius; x <= sx + radius; x += 1) {
          if (Math.abs(x - sx) !== radius && Math.abs(y - sy) !== radius) continue;
          if (x < minX || x > maxX || y < minY || y > maxY) continue;
          const index = y * columns + x;
          if (data[index] >= 20) return index;
        }
      }
    }
    return -1;
  }

  function buildStrokeWallIndex(bounds, step) {
    const bucketSize = Math.max(1, step * 8);
    const bucketColumns = Math.max(1, Math.ceil(bounds.width / bucketSize));
    const bucketRows = Math.max(1, Math.ceil(bounds.height / bucketSize));
    const buckets = new Map();
    const segments = [];
    let maxTolerance = 0;

    for (const stroke of project.strokes) {
      if (!stroke.points || stroke.points.length < 2) continue;
      const tolerance = Math.max(0.001, ((stroke.width || 1) / BASE_SQUARE_PX) / 2);
      maxTolerance = Math.max(maxTolerance, tolerance);

      for (let i = 1; i < stroke.points.length; i += 1) {
        const a = stroke.points[i - 1];
        const b = stroke.points[i];
        const index = segments.length;
        segments.push({ a, b, tolerance });

        const minBucketX = clamp(Math.floor((Math.min(a.x, b.x) - bounds.minX - tolerance) / bucketSize), 0, bucketColumns - 1);
        const maxBucketX = clamp(Math.floor((Math.max(a.x, b.x) - bounds.minX + tolerance) / bucketSize), 0, bucketColumns - 1);
        const minBucketY = clamp(Math.floor((Math.min(a.y, b.y) - bounds.minY - tolerance) / bucketSize), 0, bucketRows - 1);
        const maxBucketY = clamp(Math.floor((Math.max(a.y, b.y) - bounds.minY + tolerance) / bucketSize), 0, bucketRows - 1);

        for (let by = minBucketY; by <= maxBucketY; by += 1) {
          for (let bx = minBucketX; bx <= maxBucketX; bx += 1) {
            const key = `${bx},${by}`;
            if (!buckets.has(key)) buckets.set(key, []);
            buckets.get(key).push(index);
          }
        }
      }
    }

    return {
      bucketColumns,
      bucketRows,
      bucketSize,
      buckets,
      maxTolerance,
      segments
    };
  }

  function drawnWallBetweenCells(cx, cy, nx, ny, bounds, step, wallIndex) {
    if (!wallIndex.segments.length) return false;

    const a = {
      x: bounds.minX + (cx + 0.5) * step,
      y: bounds.minY + (cy + 0.5) * step
    };
    const b = {
      x: bounds.minX + (nx + 0.5) * step,
      y: bounds.minY + (ny + 0.5) * step
    };
    const expand = wallIndex.maxTolerance + 0.001;
    const minBucketX = clamp(Math.floor((Math.min(a.x, b.x) - bounds.minX - expand) / wallIndex.bucketSize), 0, wallIndex.bucketColumns - 1);
    const maxBucketX = clamp(Math.floor((Math.max(a.x, b.x) - bounds.minX + expand) / wallIndex.bucketSize), 0, wallIndex.bucketColumns - 1);
    const minBucketY = clamp(Math.floor((Math.min(a.y, b.y) - bounds.minY - expand) / wallIndex.bucketSize), 0, wallIndex.bucketRows - 1);
    const maxBucketY = clamp(Math.floor((Math.max(a.y, b.y) - bounds.minY + expand) / wallIndex.bucketSize), 0, wallIndex.bucketRows - 1);
    const seen = new Set();

    for (let by = minBucketY; by <= maxBucketY; by += 1) {
      for (let bx = minBucketX; bx <= maxBucketX; bx += 1) {
        const bucket = wallIndex.buckets.get(`${bx},${by}`);
        if (!bucket) continue;
        for (const index of bucket) {
          if (seen.has(index)) continue;
          seen.add(index);
          const segment = wallIndex.segments[index];
          if (segmentSegmentDistance(a, b, segment.a, segment.b) <= segment.tolerance + 0.001) {
            return true;
          }
        }
      }
    }

    return false;
  }

  function isInsideAnySheet(x, y) {
    return project.sheets.some((sheet) => {
      const rect = sheetWorld(sheet);
      return x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;
    });
  }

  function beginRangeSelection(event, start, kind) {
    const next = rangeFromPoints(start, start, sheetAtPoint(start), kind || "grid");
    const additive = event.shiftKey && selectedRange;
    const base = additive ? selectedRange : null;
    rangeAction = {
      id: event.pointerId,
      start,
      sheet: sheetAtPoint(start),
      kind: kind || "grid",
      additive,
      base
    };
    selectedRange = additive ? mergeSelections(base, next, kind || "grid") || base : next;
    canvas.setPointerCapture(event.pointerId);
    setHud(additive ? "Select: adding range" : "Select: drag a range, Ctrl+C copies");
    draw();
  }

  function moveRangeSelection(event) {
    if (!rangeAction || rangeAction.id !== event.pointerId) return;
    const point = snapPoint(screenToWorld(event.clientX, event.clientY));
    const next = rangeFromPoints(rangeAction.start, point, rangeAction.sheet, rangeAction.kind);
    selectedRange = rangeAction.additive ? mergeSelections(rangeAction.base, next, rangeAction.kind) || rangeAction.base : next;
    draw();
  }

  function endRangeSelection(event) {
    if (!rangeAction || rangeAction.id !== event.pointerId) return;
    const added = rangeAction.additive;
    rangeAction = null;
    setHud(added ? "Selection added" : "Range selected: Ctrl+C copies, Ctrl+V pastes");
    draw();
  }

  function cancelRangeSelection(event) {
    if (!rangeAction || rangeAction.id !== event.pointerId) return;
    if (rangeAction.additive && rangeAction.base) {
      selectedRange = rangeAction.base;
      rangeAction = null;
      draw();
      return;
    }
    clearRangeSelection();
  }

  function clearRangeSelection(message) {
    if (!selectedRange && !rangeAction) return false;
    rangeAction = null;
    selectedRange = null;
    setHud(message || "Selection cleared");
    draw();
    return true;
  }

  function rangeFromPoints(start, end, sheet, kind) {
    const step = 1 / snapDiv;
    const rect = sheetWorld(sheet || sheetAtPoint(start) || project.sheets[0]);
    let x = Math.min(start.x, end.x);
    let y = Math.min(start.y, end.y);
    let width = Math.abs(end.x - start.x);
    let height = Math.abs(end.y - start.y);

    x = clamp(x, rect.x, rect.x + rect.width - step);
    y = clamp(y, rect.y, rect.y + rect.height - step);
    width = clamp(snapLength(width), step, rect.x + rect.width - x);
    height = clamp(snapLength(height), step, rect.y + rect.height - y);

    return {
      x: roundUnit(x),
      y: roundUnit(y),
      width: roundUnit(width),
      height: roundUnit(height),
      kind: kind || "grid",
      step
    };
  }

  function drawRangeSelection() {
    if (!selectedRange) return;
    if (selectedRange.cells && selectedRange.cells.length) {
      drawCellSelection(selectedRange);
      return;
    }
    ctx.save();
    worldRectPath(selectedRange.x, selectedRange.y, selectedRange.width, selectedRange.height);
    ctx.fillStyle = "rgba(24, 161, 111, 0.08)";
    ctx.fill();
    ctx.strokeStyle = "#18a16f";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 4]);
    ctx.stroke();
    ctx.restore();
  }

  function drawCellSelection(selection) {
    const visible = getVisibleWorldRect();
    ctx.save();
    applyWorldTransform(ctx);
    ctx.fillStyle = "rgba(24, 161, 111, 0.13)";
    for (const cell of selection.cells) {
      if (!rectsOverlap({
        x: cell.x,
        y: cell.y,
        width: cell.size,
        height: cell.size
      }, visible)) {
        continue;
      }
      ctx.fillRect(cell.x, cell.y, cell.size, cell.size);
    }
    ctx.restore();

    drawCellSelectionOutline(selection);
  }

  function drawCellSelectionOutline(selection) {
    if (!selection.outlineSegments) {
      selection.outlineSegments = cellOutlineSegments(selection.cells);
    }
    const visible = getVisibleWorldRect();
    ctx.save();
    ctx.strokeStyle = "#18a16f";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    for (const segment of selection.outlineSegments) {
      if (!segmentIntersectsRect(segment.a, segment.b, visible)) continue;
      const a = worldToScreen(segment.a);
      const b = worldToScreen(segment.b);
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
    }
    ctx.stroke();
    ctx.restore();
  }

  function cellOutlineSegments(cells) {
    const keys = new Set(cells.map((cell) => fillKey(cell)));
    const segments = [];
    for (const cell of cells) {
      const size = cell.size;
      const x = cell.x;
      const y = cell.y;
      if (!keys.has(fillKey({ x, y: y - size, size }))) {
        segments.push({ a: { x, y }, b: { x: x + size, y } });
      }
      if (!keys.has(fillKey({ x: x + size, y, size }))) {
        segments.push({ a: { x: x + size, y }, b: { x: x + size, y: y + size } });
      }
      if (!keys.has(fillKey({ x, y: y + size, size }))) {
        segments.push({ a: { x: x + size, y: y + size }, b: { x, y: y + size } });
      }
      if (!keys.has(fillKey({ x: x - size, y, size }))) {
        segments.push({ a: { x, y: y + size }, b: { x, y } });
      }
    }
    return segments;
  }

  function selectionFromCells(cells, kind, step) {
    if (!cells.length) return null;
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const cell of cells) {
      minX = Math.min(minX, cell.x);
      minY = Math.min(minY, cell.y);
      maxX = Math.max(maxX, cell.x + cell.size);
      maxY = Math.max(maxY, cell.y + cell.size);
    }
    const normalizedCells = cells.map((cell) => ({
      x: roundUnit(cell.x),
      y: roundUnit(cell.y),
      size: roundUnit(cell.size)
    }));
    return {
      x: roundUnit(minX),
      y: roundUnit(minY),
      width: roundUnit(maxX - minX),
      height: roundUnit(maxY - minY),
      kind,
      step,
      cells: normalizedCells,
      cellKeys: new Set(normalizedCells.map((cell) => fillKey(cell))),
      outlineSegments: cellOutlineSegments(normalizedCells)
    };
  }

  function mergeSelections(base, addition, kind) {
    if (!base) return addition;
    if (!addition) return base;
    const step = roundUnit(Math.min(base.step || (1 / snapDiv), addition.step || (1 / snapDiv)));
    const baseCells = cellsForSelectionAtStep(base, step);
    const addedCells = cellsForSelectionAtStep(addition, step);
    if (!baseCells || !addedCells) return null;
    if (baseCells.length + addedCells.length > MAX_SELECTION_CELLS) {
      setHud("Selection too large to add at this detail");
      return null;
    }

    const merged = new Map();
    for (const cell of baseCells) merged.set(fillKey(cell), cell);
    for (const cell of addedCells) merged.set(fillKey(cell), cell);
    return selectionFromCells(Array.from(merged.values()), kind || base.kind || addition.kind || "grid", step);
  }

  function cellsForSelection(selection) {
    if (!selection) return [];
    if (selection.cells && selection.cells.length) return selection.cells;
    const step = selection.step || (1 / snapDiv);
    const total = Math.ceil(selection.width / step) * Math.ceil(selection.height / step);
    if (total > MAX_SELECTION_CELLS) {
      setHud("Selection too large to fill at this detail");
      return null;
    }
    const cells = [];
    const endX = selection.x + selection.width - 0.000001;
    const endY = selection.y + selection.height - 0.000001;
    for (let y = selection.y; y <= endY; y += step) {
      for (let x = selection.x; x <= endX; x += step) {
        cells.push({
          x: roundUnit(x),
          y: roundUnit(y),
          size: roundUnit(step)
        });
      }
    }
    return cells;
  }

  function cellsForSelectionAtStep(selection, targetStep) {
    const cells = cellsForSelection(selection);
    if (!cells) return null;
    const normalized = [];
    for (const cell of cells) {
      const size = roundUnit(cell.size || targetStep);
      if (Math.abs(size - targetStep) < 0.000001) {
        normalized.push({
          x: roundUnit(cell.x),
          y: roundUnit(cell.y),
          size: roundUnit(targetStep)
        });
        continue;
      }

      const divisions = Math.max(1, Math.round(size / targetStep));
      if (normalized.length + divisions * divisions > MAX_SELECTION_CELLS) {
        setHud("Selection too large to add at this detail");
        return null;
      }
      for (let y = 0; y < divisions; y += 1) {
        for (let x = 0; x < divisions; x += 1) {
          normalized.push({
            x: roundUnit(cell.x + x * targetStep),
            y: roundUnit(cell.y + y * targetStep),
            size: roundUnit(targetStep)
          });
        }
      }
    }
    return normalized;
  }

  function snapCellAtStep(point, step) {
    return {
      x: roundUnit(Math.floor(point.x / step) * step),
      y: roundUnit(Math.floor(point.y / step) * step),
      size: roundUnit(step)
    };
  }

  function pointInSelection(point, selection) {
    if (!selection || !pointInRect(point, selection)) return false;
    if (!selection.cells || !selection.cellKeys) return true;
    return selection.cellKeys.has(fillKey(snapCellAtStep(point, selection.step || (1 / snapDiv))));
  }

  function rectFromItem(item) {
    return {
      x: item.x,
      y: item.y,
      width: item.width,
      height: item.height
    };
  }

  function pointInRect(point, rect) {
    return point.x >= rect.x &&
      point.x <= rect.x + rect.width &&
      point.y >= rect.y &&
      point.y <= rect.y + rect.height;
  }

  function segmentIntersectsRect(a, b, rect) {
    if (pointInRect(a, rect) || pointInRect(b, rect)) return true;
    const edges = [
      [{ x: rect.x, y: rect.y }, { x: rect.x + rect.width, y: rect.y }],
      [{ x: rect.x + rect.width, y: rect.y }, { x: rect.x + rect.width, y: rect.y + rect.height }],
      [{ x: rect.x + rect.width, y: rect.y + rect.height }, { x: rect.x, y: rect.y + rect.height }],
      [{ x: rect.x, y: rect.y + rect.height }, { x: rect.x, y: rect.y }]
    ];
    return edges.some((edge) => segmentsIntersect(a, b, edge[0], edge[1]));
  }

  function segmentsIntersect(a, b, c, d) {
    const ab1 = orient(a, b, c);
    const ab2 = orient(a, b, d);
    const cd1 = orient(c, d, a);
    const cd2 = orient(c, d, b);
    const epsilon = 0.000001;

    if (Math.abs(ab1) <= epsilon && pointOnSegment(c, a, b)) return true;
    if (Math.abs(ab2) <= epsilon && pointOnSegment(d, a, b)) return true;
    if (Math.abs(cd1) <= epsilon && pointOnSegment(a, c, d)) return true;
    if (Math.abs(cd2) <= epsilon && pointOnSegment(b, c, d)) return true;

    return ((ab1 > epsilon && ab2 < -epsilon) || (ab1 < -epsilon && ab2 > epsilon)) &&
      ((cd1 > epsilon && cd2 < -epsilon) || (cd1 < -epsilon && cd2 > epsilon));
  }

  function segmentSegmentDistance(a, b, c, d) {
    if (segmentsIntersect(a, b, c, d)) return 0;
    return Math.min(
      pointSegmentDistance(a, c, d),
      pointSegmentDistance(b, c, d),
      pointSegmentDistance(c, a, b),
      pointSegmentDistance(d, a, b)
    );
  }

  function pointOnSegment(point, a, b) {
    const epsilon = 0.000001;
    return point.x >= Math.min(a.x, b.x) - epsilon &&
      point.x <= Math.max(a.x, b.x) + epsilon &&
      point.y >= Math.min(a.y, b.y) - epsilon &&
      point.y <= Math.max(a.y, b.y) + epsilon;
  }

  function orient(a, b, c) {
    return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
  }

  function cloneRelativeItem(item, origin) {
    return {
      ...item,
      x: roundUnit(item.x - origin.x),
      y: roundUnit(item.y - origin.y)
    };
  }

  function cloneRelativeCell(cell, origin) {
    return {
      x: roundUnit(cell.x - origin.x),
      y: roundUnit(cell.y - origin.y),
      size: cell.size
    };
  }

  function regionBounds(region) {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const path of region.paths || []) {
      for (const point of path) {
        minX = Math.min(minX, point.x);
        minY = Math.min(minY, point.y);
        maxX = Math.max(maxX, point.x);
        maxY = Math.max(maxY, point.y);
      }
    }
    if (!Number.isFinite(minX)) return null;
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }

  function cloneRelativeRegion(region, origin) {
    return {
      ...region,
      paths: region.paths.map((path) => path.map((point) => ({
        x: roundUnit(point.x - origin.x),
        y: roundUnit(point.y - origin.y)
      })))
    };
  }

  function selectionIntersectsRect(selection, rect) {
    if (!selection || !rectsOverlap(selection, rect)) return false;
    if (!selection.cells || !selection.cells.length) return true;
    return selection.cells.some((cell) => rectsOverlap({
      x: cell.x,
      y: cell.y,
      width: cell.size,
      height: cell.size
    }, rect));
  }

  function cloneSelectionAt(selection, x, y) {
    const dx = x - selection.x;
    const dy = y - selection.y;
    const next = {
      ...selection,
      x: roundUnit(x),
      y: roundUnit(y)
    };
    if (selection.cells && selection.cells.length) {
      next.cells = selection.cells.map((cell) => ({
        x: roundUnit(cell.x + dx),
        y: roundUnit(cell.y + dy),
        size: cell.size
      }));
      next.cellKeys = new Set(next.cells.map((cell) => fillKey(cell)));
      next.outlineSegments = cellOutlineSegments(next.cells);
    }
    return next;
  }

  function copySelection() {
    if (!selectedRange) {
      if (selectedImageIndex >= 0 && project.images[selectedImageIndex]) {
        const image = project.images[selectedImageIndex];
        clipboardRange = {
          width: image.width,
          height: image.height,
          assets: project.assets.filter((asset) => asset.id === image.assetId),
          fills: [],
          strokes: [],
          images: [cloneRelativeItem(image, image)],
          texts: []
        };
        setHud("Image copied");
        return true;
      }
      if (selectedTextIndex >= 0 && project.texts[selectedTextIndex]) {
        const text = normalizeTextItem(project.texts[selectedTextIndex]);
        clipboardRange = {
          width: text.width,
          height: text.height,
          assets: [],
          fills: [],
          strokes: [],
          images: [],
          texts: [cloneRelativeItem(text, text)]
        };
        setHud("Text copied");
        return true;
      }
      setHud("Select an image or text first");
      return false;
    }

    const origin = { x: selectedRange.x, y: selectedRange.y };
    const fills = project.fills
      .filter((fill) => selectionIntersectsRect(selectedRange, {
        x: fill.x,
        y: fill.y,
        width: fill.size,
        height: fill.size
      }))
      .map((fill) => cloneRelativeItem(fill, origin));
    const strokes = project.strokes
      .filter((stroke) => {
        if (!stroke.points || stroke.points.length < 2) return false;
        for (let i = 1; i < stroke.points.length; i += 1) {
          if (segmentIntersectsRect(stroke.points[i - 1], stroke.points[i], selectedRange)) return true;
        }
        return false;
      })
      .map((stroke) => ({
        ...stroke,
        points: stroke.points.map((point) => ({
          x: roundUnit(point.x - origin.x),
          y: roundUnit(point.y - origin.y)
        }))
      }));
    const images = project.images
      .filter((image) => selectionIntersectsRect(selectedRange, rectFromItem(image)))
      .map((image) => cloneRelativeItem(image, origin));
    const assetIds = new Set(images.map((image) => image.assetId));
    const assets = project.assets.filter((asset) => assetIds.has(asset.id));
    const texts = project.texts
      .map((item) => normalizeTextItem(item))
      .filter((text) => selectionIntersectsRect(selectedRange, rectFromItem(text)))
      .map((text) => cloneRelativeItem(text, origin));
    const regions = (project.regions || [])
      .map((region) => normalizeRegion(region))
      .filter(Boolean)
      .filter((region) => {
        const bounds = regionBounds(region);
        return bounds && selectionIntersectsRect(selectedRange, bounds);
      })
      .map((region) => cloneRelativeRegion(region, origin));

    clipboardRange = {
      width: selectedRange.width,
      height: selectedRange.height,
      kind: selectedRange.kind || "grid",
      step: selectedRange.step || (1 / snapDiv),
      cells: selectedRange.cells ? selectedRange.cells.map((cell) => cloneRelativeCell(cell, origin)) : null,
      assets,
      fills,
      regions,
      strokes,
      images,
      texts
    };
    setHud(`Copied ${fills.length + regions.length + strokes.length + images.length + texts.length} items`);
    return true;
  }

  function pasteClipboard() {
    if (!clipboardRange) {
      setHud("Nothing to paste");
      return false;
    }

    const step = 1 / snapDiv;
    const target = lastPointerWorld && pointInSheet(lastPointerWorld)
      ? snapPoint(lastPointerWorld)
      : snapPoint({
        x: step,
        y: step
      });

    pastePayloadAt(clipboardRange, target, true);
    setHud("Pasted");
    draw();
    return true;
  }

  function pastePayloadAt(payload, target, shouldCommit) {
    for (const asset of payload.assets || []) {
      if (!project.assets.some((entry) => entry.id === asset.id)) {
        project.assets.push({ ...asset });
      }
    }

    const pastedFills = (payload.fills || []).map((fill) => ({
      color: fill.color,
      cell: {
        x: roundUnit(target.x + fill.x),
        y: roundUnit(target.y + fill.y),
        size: fill.size
      }
    }));
    for (const fill of pastedFills) {
      setFill(fill.cell, fill.color, true);
    }
    if (pastedFills.length) invalidateFillCache();

    for (const region of payload.regions || []) {
      const pastedRegion = normalizeRegion({
        ...region,
        paths: region.paths.map((path) => path.map((point) => ({
          x: roundUnit(target.x + point.x),
          y: roundUnit(target.y + point.y)
        })))
      });
      if (pastedRegion) project.regions.push(pastedRegion);
    }

    for (const stroke of payload.strokes || []) {
      project.strokes.push({
        ...stroke,
        points: stroke.points.map((point) => ({
          x: roundUnit(target.x + point.x),
          y: roundUnit(target.y + point.y)
        }))
      });
    }

    const firstNewImage = project.images.length;
    for (const image of payload.images || []) {
      project.images.push(normalizeImageItem({
        ...image,
        x: roundUnit(target.x + image.x),
        y: roundUnit(target.y + image.y)
      }));
    }

    const firstNewText = project.texts.length;
    for (const text of payload.texts || []) {
      project.texts.push(normalizeTextItem({
        ...text,
        x: roundUnit(target.x + text.x),
        y: roundUnit(target.y + text.y)
      }));
    }

    selectedRange = null;
    selectedImageIndex = (payload.images || []).length ? firstNewImage : -1;
    selectedTextIndex = !(payload.images || []).length && (payload.texts || []).length ? firstNewText : -1;
    if (shouldCommit) commitHistory();
    return true;
  }

  function cutSelection() {
    if (!selectedRange) {
      if (copySelection() && deleteSelectedObject()) {
        setHud("Cut");
        return true;
      }
      return false;
    }
    if (!copySelection()) return false;
    const changed = deleteSelectionContents(selectedRange);
    if (changed) {
      commitHistory();
      setHud("Cut selection");
      draw();
    }
    return changed;
  }

  function deleteSelectionContents(selection) {
    if (!selection) return false;
    let changed = false;
    const beforeFills = project.fills.length;
    project.fills = project.fills.filter((fill) => !selectionIntersectsRect(selection, {
      x: fill.x,
      y: fill.y,
      width: fill.size,
      height: fill.size
    }));
    if (project.fills.length !== beforeFills) {
      invalidateFillCache();
      changed = true;
    }

    const beforeRegions = project.regions.length;
    project.regions = (project.regions || []).filter((region) => {
      const bounds = regionBounds(region);
      return !bounds || !selectionIntersectsRect(selection, bounds);
    });
    changed = changed || project.regions.length !== beforeRegions;

    const beforeStrokes = project.strokes.length;
    project.strokes = project.strokes.filter((stroke) => !strokeIntersectsSelection(stroke, selection));
    changed = changed || project.strokes.length !== beforeStrokes;

    const beforeImages = project.images.length;
    project.images = project.images.filter((image) => !selectionIntersectsRect(selection, rectFromItem(image)));
    changed = changed || project.images.length !== beforeImages;

    const beforeTexts = project.texts.length;
    project.texts = project.texts
      .map((item) => normalizeTextItem(item))
      .filter((text) => !selectionIntersectsRect(selection, rectFromItem(text)));
    changed = changed || project.texts.length !== beforeTexts;

    selectedImageIndex = -1;
    selectedTextIndex = -1;
    textDraft = null;
    return changed;
  }

  function strokeIntersectsSelection(stroke, selection) {
    if (!stroke.points || stroke.points.length < 2) return false;
    if (!selection.cells || !selection.cells.length) {
      return strokeIntersectsRect(stroke, selection);
    }
    for (let i = 1; i < stroke.points.length; i += 1) {
      if (segmentIntersectsRect(stroke.points[i - 1], stroke.points[i], selection)) return true;
    }
    return false;
  }

  function beginSelectionMove(event, point) {
    if (!selectedRange || !pointInSelection(point, selectedRange)) return false;
    const previousClipboard = clipboardRange;
    if (!copySelection()) return false;
    const payload = clipboardRange;
    clipboardRange = previousClipboard;
    const originalSelection = selectedRange;
    deleteSelectionContents(originalSelection);
    selectionMoveAction = {
      id: event.pointerId,
      start: point,
      origin: { x: originalSelection.x, y: originalSelection.y },
      target: { x: originalSelection.x, y: originalSelection.y },
      originalSelection,
      payload,
      changed: false
    };
    canvas.setPointerCapture(event.pointerId);
    setHud("Move selection: drag, release to place");
    draw();
    return true;
  }

  function moveSelectionMove(event) {
    if (!selectionMoveAction || selectionMoveAction.id !== event.pointerId) return;
    const point = snapPoint(screenToWorld(event.clientX, event.clientY));
    const target = snapPoint({
      x: selectionMoveAction.origin.x + point.x - selectionMoveAction.start.x,
      y: selectionMoveAction.origin.y + point.y - selectionMoveAction.start.y
    });
    selectionMoveAction.changed = selectionMoveAction.changed ||
      target.x !== selectionMoveAction.target.x ||
      target.y !== selectionMoveAction.target.y;
    selectionMoveAction.target = target;
    selectedRange = cloneSelectionAt(selectionMoveAction.originalSelection, target.x, target.y);
    draw();
  }

  function endSelectionMove(event) {
    if (!selectionMoveAction || selectionMoveAction.id !== event.pointerId) return;
    const action = selectionMoveAction;
    pastePayloadAt(action.payload, action.target, false);
    selectionMoveAction = null;
    if (action.changed) {
      commitHistory();
      setHud("Selection moved");
    } else {
      setHud("Selection ready");
    }
    draw();
  }

  function cancelSelectionMove(event) {
    if (!selectionMoveAction || selectionMoveAction.id !== event.pointerId) return;
    cancelActiveSelectionMove();
  }

  function cancelActiveSelectionMove() {
    if (!selectionMoveAction) return false;
    const action = selectionMoveAction;
    pastePayloadAt(action.payload, action.origin, false);
    selectedRange = action.originalSelection;
    selectionMoveAction = null;
    setHud("Move canceled");
    draw();
    return true;
  }

  function shouldKeepSelectionForUiClick(target) {
    return target && target.closest &&
      Boolean(target.closest(".tools, .topbar, .color-panel, .text-panel, .modal"));
  }

  function clearSelectionFromOutsidePointer(event) {
    if (!selectedRange && !rangeAction) return false;
    if (event.target === canvas || canvas.contains(event.target)) return false;
    if (shouldKeepSelectionForUiClick(event.target)) return false;
    return clearRangeSelection("Selection cleared");
  }

  function handleImageImportPointerDown(event) {
    const point = snapPoint(screenToWorld(event.clientX, event.clientY));
    if (!pointInSheet(point)) return;
    handleAssetPointerDown(event, true);
  }

  function handleHandPointerDown(event) {
    const point = snapPoint(screenToWorld(event.clientX, event.clientY));
    if (!pointInSheet(point)) return;
    handleAssetPointerDown(event, false);
  }

  function handleAssetPointerDown(event, allowImport) {
    const point = snapPoint(screenToWorld(event.clientX, event.clientY));
    if (!pointInSheet(point)) return;
    if (pendingImageAsset) {
      placePendingImage(point);
      return;
    }

    const selected = project.images[selectedImageIndex];
    const handle = selected ? imageHandleHit(event, selected) : "";
    if (selected && handle) {
      beginImageAction(event, "resize", selectedImageIndex, handle);
      return;
    }

    const hitIndex = findImageAt(event);
    if (hitIndex >= 0) {
      selectedImageIndex = hitIndex;
      selectedTextIndex = -1;
      selectedRange = null;
      beginImageAction(event, "move", hitIndex);
      draw();
      return;
    }

    const textIndex = findTextAt(event);
    if (textIndex >= 0) {
      selectedTextIndex = textIndex;
      selectedImageIndex = -1;
      selectedRange = null;
      textDraft = null;
      setHud("Text selected: R rotates, Del deletes");
      draw();
      return;
    }

    selectedImageIndex = -1;
    selectedTextIndex = -1;
    textDraft = null;

    if (allowImport) {
      placePendingImage(point);
    } else {
      setHud("Hand: click an image or text to move it");
      draw();
    }
  }

  function placePendingImage(point) {
    pendingImagePoint = point;
    if (!pendingImageAsset) {
      imageInput.click();
      return;
    }
    addImageInstance(pendingImageAsset, point);
  }

  function addImageInstance(asset, point) {
    const naturalRatio = asset.width && asset.height ? asset.width / asset.height : 1;
    const width = snapLength(Math.min(10, Math.max(3, naturalRatio >= 1 ? 6 : 6 * naturalRatio)));
    const height = snapLength(width / naturalRatio);
    const sheet = sheetAtPoint(point);
    const image = snapImageBox({
      assetId: asset.id,
      x: point.x,
      y: point.y,
      width,
      height,
      rotation: normalizeRotation(-view.rotation)
    }, sheet, false);
    project.images.push(image);
    selectedImageIndex = project.images.length - 1;
    pendingImageAsset = null;
    pendingImagePoint = null;
    commitHistory();
    setHud("Image placed");
    draw();
  }

  function findImageAt(event) {
    const screen = screenPointFromEvent(event);
    for (let i = project.images.length - 1; i >= 0; i -= 1) {
      const item = project.images[i];
      if (screenPointInItem(screen, item)) {
        return i;
      }
    }
    return -1;
  }

  function imageHandleHit(event, item) {
    const screen = screenPointFromEvent(event);
    const corners = getItemScreenCorners(item);
    for (const corner of corners) {
      if (Math.abs(screen.x - corner.x) <= 12 &&
        Math.abs(screen.y - corner.y) <= 12) {
        return corner.name;
      }
    }
    return "";
  }

  function beginImageAction(event, mode, index, handle) {
    const item = project.images[index];
    if (!item) return;
    imageAction = {
      id: event.pointerId,
      mode,
      handle: handle || "se",
      index,
      start: screenToWorld(event.clientX, event.clientY),
      original: { ...item }
    };
    canvas.setPointerCapture(event.pointerId);
    canvas.style.cursor = "grabbing";
    setHud(mode === "resize" ? "Image: drag corner to resize" : "Image: drag to move");
  }

  function resizeImageFromCorner(original, event) {
    const screen = screenPointFromEvent(event);
    const step = 1 / snapDiv;
    const handle = imageAction.handle || "se";
    const sx = handle.includes("e") ? 1 : -1;
    const sy = handle.includes("s") ? 1 : -1;
    const angle = itemScreenAngle(original);
    const center = worldToScreen(itemCenter(original));
    const originalWidth = original.width * view.scale;
    const originalHeight = original.height * view.scale;
    const anchorLocal = {
      x: -sx * originalWidth / 2,
      y: -sy * originalHeight / 2
    };
    const anchorRotated = rotateLocal(anchorLocal, angle);
    const anchorScreen = {
      x: center.x + anchorRotated.x,
      y: center.y + anchorRotated.y
    };
    const local = unrotateLocal({
      x: screen.x - anchorScreen.x,
      y: screen.y - anchorScreen.y
    }, angle);

    let width = Math.max(step, Math.abs(local.x / view.scale));
    let height = Math.max(step, Math.abs(local.y / view.scale));

    if (event.shiftKey) {
      const ratio = original.width / Math.max(step, original.height);
      if (width / Math.max(step, height) > ratio) {
        height = width / ratio;
      } else {
        width = height * ratio;
      }
    } else {
      width = snapLength(width);
      height = snapLength(height);
    }

    width = Math.max(step, width);
    height = Math.max(step, height);

    const nextWidth = width * view.scale;
    const nextHeight = height * view.scale;
    const centerLocal = {
      x: sx * nextWidth / 2,
      y: sy * nextHeight / 2
    };
    const centerRotated = rotateLocal(centerLocal, angle);
    const nextCenterWorld = screenPointToWorld({
      x: anchorScreen.x + centerRotated.x,
      y: anchorScreen.y + centerRotated.y
    });

    const sheet = sheetAtPoint(itemCenter(original)) ||
      sheetAtPoint({ x: original.x + 0.0001, y: original.y + 0.0001 }) ||
      project.sheets[0];
    const rect = sheetWorld(sheet);
    let x = nextCenterWorld.x - width / 2;
    let y = nextCenterWorld.y - height / 2;
    width = Math.min(width, rect.width);
    height = Math.min(height, rect.height);
    x = clamp(x, rect.x, rect.x + rect.width - width);
    y = clamp(y, rect.y, rect.y + rect.height - height);

    return {
      ...original,
      x: roundUnit(x),
      y: roundUnit(y),
      width: roundUnit(width),
      height: roundUnit(height),
      rotation: itemRotation(original)
    };
  }

  function moveImageAction(event) {
    if (!imageAction || imageAction.id !== event.pointerId) return;
    const item = project.images[imageAction.index];
    if (!item) return;
    const point = screenToWorld(event.clientX, event.clientY);
    const original = imageAction.original;

    if (imageAction.mode === "resize") {
      Object.assign(item, resizeImageFromCorner(original, event));
    } else {
      const moved = snapPoint({
        x: original.x + point.x - imageAction.start.x,
        y: original.y + point.y - imageAction.start.y
      });
      const sheet = sheetAtPoint({ x: moved.x + 0.0001, y: moved.y + 0.0001 }) ||
        sheetAtPoint({ x: original.x + 0.0001, y: original.y + 0.0001 });
      const next = snapImageBox({
        ...original,
        x: moved.x,
        y: moved.y
      }, sheet, true);
      Object.assign(item, next);
    }
    draw();
  }

  function endImageAction(event) {
    if (!imageAction || imageAction.id !== event.pointerId) return;
    const item = project.images[imageAction.index];
    const changed = item && JSON.stringify(item) !== JSON.stringify(imageAction.original);
    imageAction = null;
    if (changed) {
      commitHistory();
      setHud("Image updated");
    }
    canvas.style.cursor = getToolCursor();
    draw();
  }

  function cancelImageAction(event) {
    if (!imageAction || imageAction.id !== event.pointerId) return;
    const item = project.images[imageAction.index];
    if (item) Object.assign(item, imageAction.original);
    imageAction = null;
    canvas.style.cursor = getToolCursor();
    draw();
  }

  function snapImageBox(box, preferredSheet, snapPosition) {
    const step = 1 / snapDiv;
    const sheet = preferredSheet ||
      sheetAtPoint({ x: box.x + 0.0001, y: box.y + 0.0001 }) ||
      project.sheets[0];
    const rect = sheetWorld(sheet);
    let width = snapLength(box.width);
    let height = snapLength(box.height);
    width = clamp(width, step, rect.width);
    height = clamp(height, step, rect.height);

    let x = snapPosition ? snapPoint(box).x : roundUnit(box.x);
    let y = snapPosition ? snapPoint(box).y : roundUnit(box.y);
    x = clamp(x, rect.x, rect.x + rect.width - step);
    y = clamp(y, rect.y, rect.y + rect.height - step);
    width = clamp(width, step, rect.x + rect.width - x);
    height = clamp(height, step, rect.y + rect.height - y);

    return {
      ...box,
      x: roundUnit(x),
      y: roundUnit(y),
      width: roundUnit(width),
      height: roundUnit(height)
    };
  }

  function beginText(event) {
    const point = snapPoint(screenToWorld(event.clientX, event.clientY));
    if (!pointInSheet(point)) return;
    closeTextPanel(false);

    const hitIndex = findTextAt(event);
    if (hitIndex >= 0 && !event.shiftKey) {
      selectedTextIndex = hitIndex;
      textDraft = normalizeTextItem(project.texts[hitIndex]);
      openTextPanel(textDraft, hitIndex);
      draw();
      return;
    }

    const sheet = sheetAtPoint(point);
    textAction = {
      id: event.pointerId,
      start: point,
      startScreen: screenPointFromEvent(event),
      sheet,
      moved: false,
      originalIndex: -1
    };
    textDraft = makeTextDraft(textBoxFromScreenPoints(textAction.startScreen, textAction.startScreen, sheet, false));
    selectedTextIndex = -1;
    canvas.setPointerCapture(event.pointerId);
    setHud("Text: drag the box");
    draw();
  }

  function moveText(event) {
    if (!textAction || textAction.id !== event.pointerId) return;
    const screen = screenPointFromEvent(event);
    if (Math.hypot(screen.x - textAction.startScreen.x, screen.y - textAction.startScreen.y) > 3) {
      textAction.moved = true;
    }
    textDraft = makeTextDraft(textBoxFromScreenPoints(textAction.startScreen, screen, textAction.sheet, false), textDraft);
    draw();
  }

  function endText(event) {
    if (!textAction || textAction.id !== event.pointerId) return;
    const screen = screenPointFromEvent(event);
    textDraft = makeTextDraft(textBoxFromScreenPoints(
      textAction.startScreen,
      screen,
      textAction.sheet,
      !textAction.moved
    ), textDraft);
    textAction = null;
    openTextPanel(textDraft, -1);
    draw();
  }

  function cancelText(event) {
    if (!textAction || textAction.id !== event.pointerId) return;
    textAction = null;
    textDraft = null;
    draw();
  }

  function textBoxFromScreenPoints(startScreen, endScreen, sheet, useDefaultSize) {
    const step = 1 / snapDiv;
    const rawStartWorld = snapPoint(screenPointToWorld(startScreen));
    const rect = sheetWorld(sheet || sheetAtPoint(rawStartWorld) || project.sheets[0]);
    const startWorld = clampPointToRect(rawStartWorld, rect);

    if (useDefaultSize) {
      const width = Math.min(snapLength(6), rect.width);
      const height = Math.min(snapLength(2), rect.height);
      return clampTextBoxToSheet({
        x: startWorld.x,
        y: startWorld.y,
        width,
        height
      }, rect, step, true);
    }

    const endWorld = clampPointToRect(snapPoint(screenPointToWorld(endScreen)), rect);
    const snappedStartScreen = worldToScreen(startWorld);
    const snappedEndScreen = worldToScreen(endWorld);
    const left = Math.min(snappedStartScreen.x, snappedEndScreen.x);
    const right = Math.max(snappedStartScreen.x, snappedEndScreen.x);
    const top = Math.min(snappedStartScreen.y, snappedEndScreen.y);
    const bottom = Math.max(snappedStartScreen.y, snappedEndScreen.y);
    const width = snapLength(Math.max(step, (right - left) / view.scale));
    const height = snapLength(Math.max(step, (bottom - top) / view.scale));
    const centerWorld = screenPointToWorld({
      x: left + (right - left) / 2,
      y: top + (bottom - top) / 2
    });

    return clampTextBoxToSheet({
      x: centerWorld.x - width / 2,
      y: centerWorld.y - height / 2,
      width,
      height
    }, rect, step, false);
  }

  function clampPointToRect(point, rect) {
    return {
      x: roundUnit(clamp(point.x, rect.x, rect.x + rect.width)),
      y: roundUnit(clamp(point.y, rect.y, rect.y + rect.height))
    };
  }

  function textBoxFromPoints(start, end, sheet) {
    const step = 1 / snapDiv;
    const rect = sheetWorld(sheet || sheetAtPoint(start) || project.sheets[0]);
    let x = Math.min(start.x, end.x);
    let y = Math.min(start.y, end.y);
    let width = Math.abs(end.x - start.x);
    let height = Math.abs(end.y - start.y);

    if (width < step) width = Math.min(8, rect.width);
    if (height < step) height = Math.min(3, rect.height);

    x = clamp(x, rect.x, rect.x + rect.width - step);
    y = clamp(y, rect.y, rect.y + rect.height - step);
    width = clamp(snapLength(width), step, rect.x + rect.width - x);
    height = clamp(snapLength(height), step, rect.y + rect.height - y);

    return {
      x: roundUnit(x),
      y: roundUnit(y),
      width: roundUnit(width),
      height: roundUnit(height)
    };
  }

  function clampTextBoxToSheet(box, rect, step, snapPosition) {
    let width = clamp(snapLength(box.width), step, rect.width);
    let height = clamp(snapLength(box.height), step, rect.height);
    let x = snapPosition ? snapPoint(box).x : roundUnit(box.x);
    let y = snapPosition ? snapPoint(box).y : roundUnit(box.y);

    x = clamp(x, rect.x, rect.x + rect.width - width);
    y = clamp(y, rect.y, rect.y + rect.height - height);

    return {
      x: roundUnit(x),
      y: roundUnit(y),
      width: roundUnit(width),
      height: roundUnit(height)
    };
  }

  function makeTextDraft(box, previous) {
    const base = previous ? normalizeTextItem(previous) : {
      text: "",
      color: currentColor,
      font: fontFamily.value,
      size: clamp(Number(fontSize.value) || 28, MIN_TEXT_SIZE, 240),
      highlight: false,
      highlightColor: "#FFFF66",
      align: "left",
      rotation: normalizeRotation(-view.rotation),
      bold: false,
      italic: false,
      underline: false,
      strike: false,
      glow: false,
      glowColor: "#18A16F",
      glowSize: 8
    };
    return normalizeTextItem({ ...base, ...box });
  }

  function findTextAt(eventOrPoint) {
    const screen = eventOrPoint && Number.isFinite(eventOrPoint.clientX)
      ? screenPointFromEvent(eventOrPoint)
      : null;
    for (let i = project.texts.length - 1; i >= 0; i -= 1) {
      const item = normalizeTextItem(project.texts[i]);
      if (screen && screenPointInItem(screen, item)) {
        return i;
      }
      const point = eventOrPoint;
      if (!screen && point.x >= item.x &&
        point.x <= item.x + item.width &&
        point.y >= item.y &&
        point.y <= item.y + item.height) {
        return i;
      }
    }
    return -1;
  }

  function openTextPanel(item, index) {
    selectedTextIndex = index;
    textDraft = normalizeTextItem(item);
    loadTextPanel(textDraft);
    textPanel.classList.remove("hidden");
    if (index < 0) {
      textValue.focus();
    } else {
      textValue.blur();
    }
    setHud("Text: style, type, Apply");
  }

  function closeTextPanel(save) {
    if (textPanel.classList.contains("hidden") && !textDraft) return;
    if (save) {
      applyTextPanel();
      return;
    }
    textPanel.classList.add("hidden");
    textDraft = null;
    textAction = null;
    selectedTextIndex = -1;
    draw();
  }

  function loadTextPanel(item) {
    textValue.value = item.text;
    textFont.value = item.font;
    textSize.value = String(item.size);
    textColor.value = normalizeHex(item.color) || "#000000";
    textHighlight.checked = item.highlight;
    textHighlightColor.value = normalizeHex(item.highlightColor) || "#FFFF66";
    textGlow.checked = item.glow;
    textGlowColor.value = normalizeHex(item.glowColor) || "#18A16F";
    textGlowSize.value = String(item.glowSize);
    setTextAlign(item.align);
    setTextToggle(textBold, item.bold);
    setTextToggle(textItalic, item.italic);
    setTextToggle(textUnderline, item.underline);
    setTextToggle(textStrike, item.strike);
    textDelete.disabled = selectedTextIndex < 0;
  }

  function setTextToggle(button, active) {
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  }

  function setTextAlign(align) {
    for (const button of textAlignButtons) {
      const active = button.dataset.align === align;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    }
  }

  function getTextAlign() {
    const active = textAlignButtons.find((button) => button.classList.contains("active"));
    return active ? active.dataset.align : "left";
  }

  function updateTextDraftFromPanel() {
    if (!textDraft) return;
    textDraft = normalizeTextItem({
      ...textDraft,
      text: textValue.value,
      font: textFont.value,
      size: clamp(Number(textSize.value) || 28, MIN_TEXT_SIZE, 240),
      color: textColor.value,
      highlight: textHighlight.checked,
      highlightColor: textHighlightColor.value,
      align: getTextAlign(),
      bold: textBold.classList.contains("active"),
      italic: textItalic.classList.contains("active"),
      underline: textUnderline.classList.contains("active"),
      strike: textStrike.classList.contains("active"),
      glow: textGlow.checked,
      glowColor: textGlowColor.value,
      glowSize: clamp(Number(textGlowSize.value) || 0, 0, 30)
    });
    draw();
  }

  function applyTextPanel() {
    if (!textDraft) return;
    updateTextDraftFromPanel();
    const item = normalizeTextItem(textDraft);
    if (!item.text.trim()) {
      closeTextPanel(false);
      return;
    }

    if (selectedTextIndex >= 0) {
      project.texts[selectedTextIndex] = item;
    } else {
      project.texts.push(item);
      selectedTextIndex = project.texts.length - 1;
    }
    fontFamily.value = item.font;
    fontSize.value = String(item.size);
    setColor(item.color);
    commitHistory();
    textPanel.classList.add("hidden");
    textDraft = null;
    textAction = null;
    selectedTextIndex = -1;
    setHud("Text applied");
    draw();
  }

  function deleteSelectedText() {
    if (selectedTextIndex < 0) {
      closeTextPanel(false);
      return;
    }
    project.texts.splice(selectedTextIndex, 1);
    commitHistory();
    textPanel.classList.add("hidden");
    textDraft = null;
    textAction = null;
    selectedTextIndex = -1;
    setHud("Text deleted");
    draw();
  }

  function deleteSelectedImage() {
    if (selectedImageIndex < 0 || !project.images[selectedImageIndex]) return false;
    project.images.splice(selectedImageIndex, 1);
    selectedImageIndex = -1;
    imageAction = null;
    commitHistory();
    setHud("Image deleted");
    draw();
    return true;
  }

  function deleteSelectedObject() {
    if (selectedRange) {
      const changed = deleteSelectionContents(selectedRange);
      if (changed) {
        commitHistory();
        setHud("Selection deleted");
        draw();
        return true;
      }
    }
    if (deleteSelectedImage()) return true;
    if (selectedTextIndex >= 0 && project.texts[selectedTextIndex]) {
      deleteSelectedText();
      return true;
    }
    if (textDraft) {
      closeTextPanel(false);
      setHud("Text draft deleted");
      return true;
    }
    return false;
  }

  function rotateSelectedObject(delta) {
    if (selectedImageIndex >= 0 && project.images[selectedImageIndex]) {
      const item = project.images[selectedImageIndex];
      item.rotation = normalizeRotation(itemRotation(item) + delta);
      commitHistory();
      setHud(`Image rotated ${item.rotation * 90}`);
      draw();
      return true;
    }

    if (selectedTextIndex >= 0 && project.texts[selectedTextIndex]) {
      const item = normalizeTextItem(project.texts[selectedTextIndex]);
      item.rotation = normalizeRotation(itemRotation(item) + delta);
      project.texts[selectedTextIndex] = item;
      commitHistory();
      setHud(`Text rotated ${item.rotation * 90}`);
      draw();
      return true;
    }

    if (textDraft) {
      textDraft.rotation = normalizeRotation(itemRotation(textDraft) + delta);
      updateTextDraftFromPanel();
      setHud(`Text rotated ${textDraft.rotation * 90}`);
      draw();
      return true;
    }

    return false;
  }

  function addSheet(direction) {
    const center = {
      x: view.x + view.width / view.scale / 2,
      y: view.y + view.height / view.scale / 2
    };
    let col = Math.floor(center.x / PAGE.width);
    let row = Math.floor(center.y / PAGE.height);
    if (!project.sheets.some((sheet) => sheet.col === col && sheet.row === row)) {
      const nearest = nearestSheet(center);
      col = nearest.col;
      row = nearest.row;
    }

    let next = { col, row };
    if (direction === "left") next = { col: col - 1, row };
    if (direction === "right") next = { col: col + 1, row };
    if (direction === "top") next = { col, row: row - 1 };
    if (direction === "bottom") next = { col, row: row + 1 };

    while (project.sheets.some((sheet) => sheet.col === next.col && sheet.row === next.row)) {
      if (direction === "left") next.col -= 1;
      if (direction === "right") next.col += 1;
      if (direction === "top") next.row -= 1;
      if (direction === "bottom") next.row += 1;
    }

    project.sheets.push(next);
    commitHistory();
    setHud(`Sheet added ${direction}`);
    draw();
  }

  function sheetKey(col, row) {
    return `${col},${row}`;
  }

  function hasSheetAt(col, row) {
    return project.sheets.some((sheet) => sheet.col === col && sheet.row === row);
  }

  function openExtendModal() {
    extendModal.classList.remove("hidden");
    renderExtendMap();
  }

  function closeExtendModal() {
    extendModal.classList.add("hidden");
  }

  function addSheetAt(col, row) {
    if (hasSheetAt(col, row)) return;
    project.sheets.push({ col, row });
    commitHistory();
    draw();
    renderExtendMap();
    setHud(`Sheet added ${col}, ${row}`);
  }

  function renderExtendMap() {
    extendMap.textContent = "";
    const bounds = getSheetBounds();
    const availableWidth = Math.max(360, extendMap.clientWidth || 820);
    const availableHeight = Math.max(320, extendMap.clientHeight || 560);
    const margin = 82;
    const scale = clamp(
      Math.min(
        (availableWidth - margin * 2) / bounds.width,
        (availableHeight - margin * 2) / bounds.height
      ),
      4,
      18
    );
    const stageWidth = Math.max(availableWidth, bounds.width * scale + margin * 2);
    const stageHeight = Math.max(availableHeight, bounds.height * scale + margin * 2);
    const offsetX = (stageWidth - bounds.width * scale) / 2 - bounds.minX * scale;
    const offsetY = (stageHeight - bounds.height * scale) / 2 - bounds.minY * scale;
    const stage = document.createElement("div");
    stage.className = "extend-stage";
    stage.style.width = `${stageWidth}px`;
    stage.style.height = `${stageHeight}px`;
    extendMap.appendChild(stage);

    const sheetSet = new Set(project.sheets.map((sheet) => sheetKey(sheet.col, sheet.row)));
    for (const sheet of project.sheets) {
      const x = sheet.col * PAGE.width * scale + offsetX;
      const y = sheet.row * PAGE.height * scale + offsetY;
      const width = PAGE.width * scale;
      const height = PAGE.height * scale;
      const node = document.createElement("div");
      node.className = "extend-sheet";
      node.style.left = `${x}px`;
      node.style.top = `${y}px`;
      node.style.width = `${width}px`;
      node.style.height = `${height}px`;
      stage.appendChild(node);

      addExtendControl(stage, sheetSet, sheet.col, sheet.row - 1, x + width / 2, y - 18, "top");
      addExtendControl(stage, sheetSet, sheet.col - 1, sheet.row, x - 18, y + height / 2, "left");
      addExtendControl(stage, sheetSet, sheet.col + 1, sheet.row, x + width + 18, y + height / 2, "right");
      addExtendControl(stage, sheetSet, sheet.col, sheet.row + 1, x + width / 2, y + height + 18, "bottom");
    }
  }

  function addExtendControl(stage, sheetSet, col, row, x, y, side) {
    if (sheetSet.has(sheetKey(col, row))) return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = `extend-add ${side}`;
    button.textContent = "+";
    button.title = `Add sheet ${side}`;
    button.style.left = `${x}px`;
    button.style.top = `${y}px`;
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      addSheetAt(col, row);
    });
    stage.appendChild(button);
  }

  function nearestSheet(point) {
    let best = project.sheets[0];
    let bestDistance = Infinity;
    for (const sheet of project.sheets) {
      const rect = sheetWorld(sheet);
      const cx = rect.x + rect.width / 2;
      const cy = rect.y + rect.height / 2;
      const d = Math.hypot(cx - point.x, cy - point.y);
      if (d < bestDistance) {
        best = sheet;
        bestDistance = d;
      }
    }
    return best;
  }

  function updateSnap(next) {
    snapDiv = clamp(next, 1, MAX_SNAP_DIV);
    detailReadout.textContent = `1/${snapDiv}`;
    setHud(`Snap ${detailReadout.textContent}`);
    draw();
  }

  function rotateCanvasView() {
    view.rotation = (view.rotation + 1) % 4;
    project.view = { ...(project.view || {}), rotation: view.rotation };
    updateRotateButton();
    queueCacheSave();
    setHud(`Canvas rotated ${view.rotation * 90}`);
    draw();
  }

  function updateRotateButton() {
    rotateView.textContent = `Rot ${view.rotation * 90}`;
    rotateView.title = `Rotate canvas view (${view.rotation * 90})`;
  }

  function setColor(hex) {
    currentColor = normalizeHex(hex) || "#000000";
    colorChip.style.background = currentColor;
    hexColor.value = currentColor.toUpperCase();
    const hsv = hexToHsv(currentColor);
    currentHue = hsv.h;
    currentSat = hsv.s;
    currentVal = hsv.v;
    hueSlider.value = String(Math.round(currentHue));
    drawSvPicker();
  }

  function normalizeHex(value) {
    const raw = String(value || "").trim();
    if (/^#[0-9a-fA-F]{6}$/.test(raw)) return raw.toUpperCase();
    if (/^#[0-9a-fA-F]{3}$/.test(raw)) {
      return `#${raw[1]}${raw[1]}${raw[2]}${raw[2]}${raw[3]}${raw[3]}`.toUpperCase();
    }
    return null;
  }

  function drawSvPicker() {
    const width = svPicker.width;
    const height = svPicker.height;
    const hueColor = hsvToHex(currentHue, 1, 1);
    svCtx.clearRect(0, 0, width, height);

    const satGradient = svCtx.createLinearGradient(0, 0, width, 0);
    satGradient.addColorStop(0, "#ffffff");
    satGradient.addColorStop(1, hueColor);
    svCtx.fillStyle = satGradient;
    svCtx.fillRect(0, 0, width, height);

    const valGradient = svCtx.createLinearGradient(0, 0, 0, height);
    valGradient.addColorStop(0, "rgba(0,0,0,0)");
    valGradient.addColorStop(1, "rgba(0,0,0,1)");
    svCtx.fillStyle = valGradient;
    svCtx.fillRect(0, 0, width, height);

    const x = currentSat * width;
    const y = (1 - currentVal) * height;
    svCtx.strokeStyle = "#fff";
    svCtx.lineWidth = 2;
    svCtx.beginPath();
    svCtx.arc(x, y, 5, 0, Math.PI * 2);
    svCtx.stroke();
    svCtx.strokeStyle = "#000";
    svCtx.lineWidth = 1;
    svCtx.beginPath();
    svCtx.arc(x, y, 6, 0, Math.PI * 2);
    svCtx.stroke();
  }

  function pickSv(event) {
    const rect = svPicker.getBoundingClientRect();
    currentSat = clamp((event.clientX - rect.left) / rect.width, 0, 1);
    currentVal = clamp(1 - (event.clientY - rect.top) / rect.height, 0, 1);
    setColor(hsvToHex(currentHue, currentSat, currentVal));
  }

  function startEyedropper(target, button) {
    beginCanvasEyedropper(target, button);
  }

  function beginCanvasEyedropper(target, button) {
    eyedropperMode = true;
    eyedropperTarget = target || "current";
    activeEyedropperButton = button || eyedropperButton;
    eyedropperButtons.forEach((entry) => entry.classList.toggle("active", entry === activeEyedropperButton));
    colorPanel.classList.add("hidden");
    canvas.style.cursor = "copy";
    setHud(`${eyedropperTargetLabel(eyedropperTarget)} eyedropper: click the artwork`);
  }

  function eyedropperTargetLabel(target) {
    if (target === "text") return "Text";
    if (target === "highlight") return "Highlight";
    if (target === "glow") return "Glow";
    return "Color";
  }

  function clearEyedropperMode() {
    eyedropperMode = false;
    activeEyedropperButton = null;
    eyedropperButtons.forEach((entry) => entry.classList.remove("active"));
    canvas.style.cursor = getToolCursor();
  }

  function applyPickedColor(hex, target) {
    const normalized = normalizeHex(hex) || "#000000";
    if (target === "text") {
      textColor.value = normalized;
      updateTextDraftFromPanel();
      return;
    }
    if (target === "highlight") {
      textHighlightColor.value = normalized;
      updateTextDraftFromPanel();
      return;
    }
    if (target === "glow") {
      textGlowColor.value = normalized;
      updateTextDraftFromPanel();
      return;
    }
    setColor(normalized);
  }

  function pickCanvasColor(event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = clamp(Math.floor((event.clientX - rect.left) * scaleX), 0, canvas.width - 1);
    const y = clamp(Math.floor((event.clientY - rect.top) * scaleY), 0, canvas.height - 1);
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const hex = `#${toHex(pixel[0] / 255)}${toHex(pixel[1] / 255)}${toHex(pixel[2] / 255)}`.toUpperCase();

    applyPickedColor(hex, eyedropperTarget);
    clearEyedropperMode();
    setHud(`Color ${hex}`);
  }

  function hexToHsv(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    let h = 0;
    if (delta !== 0) {
      if (max === r) h = 60 * (((g - b) / delta) % 6);
      if (max === g) h = 60 * ((b - r) / delta + 2);
      if (max === b) h = 60 * ((r - g) / delta + 4);
    }
    if (h < 0) h += 360;
    return {
      h,
      s: max === 0 ? 0 : delta / max,
      v: max
    };
  }

  function hsvToHex(h, s, v) {
    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;
    let r = 0;
    let g = 0;
    let b = 0;
    if (h < 60) [r, g, b] = [c, x, 0];
    else if (h < 120) [r, g, b] = [x, c, 0];
    else if (h < 180) [r, g, b] = [0, c, x];
    else if (h < 240) [r, g, b] = [0, x, c];
    else if (h < 300) [r, g, b] = [x, 0, c];
    else[r, g, b] = [c, 0, x];
    return `#${toHex(r + m)}${toHex(g + m)}${toHex(b + m)}`.toUpperCase();
  }

  function toHex(value) {
    return Math.round(clamp(value, 0, 1) * 255).toString(16).padStart(2, "0");
  }

  function download(name, text, type) {
    const blob = new Blob([text], { type });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = name;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  function saveProjectFile() {
    syncProjectView();
    download(`graphcanvas-${stamp()}.graphcanvas`, JSON.stringify(project), "application/json");
  }

  function openIoModal() {
    ioModal.classList.remove("hidden");
    codeOutput.value = "";
    codeOutput.placeholder = "Choose an export option.";
    if (closeProjectAfterExport) {
      closeProjectAfterExport.classList.toggle("hidden", !pendingCloseProjectId);
    }
  }

  function closeIoModal() {
    ioModal.classList.add("hidden");
    pendingCloseProjectId = "";
    if (closeProjectAfterExport) {
      closeProjectAfterExport.classList.add("hidden");
    }
  }

  function stamp() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  }

  function generateCanvasCode() {
    return buildProceduralCanvasCode(getExportProjectSnapshot());
  }

  function getExportProjectSnapshot() {
    syncProjectView();
    if (textDraft) {
      updateTextDraftFromPanel();
    }

    const snapshot = {
      ...project,
      page: { ...project.page },
      view: { ...(project.view || {}) },
      sheets: (project.sheets || []).map((sheet) => ({ ...sheet })),
      fills: (project.fills || []).map((fill) => ({ ...fill })),
      regions: (project.regions || []).map((region) => ({
        ...region,
        paths: (region.paths || []).map((path) => path.map((point) => ({ ...point })))
      })),
      strokes: (project.strokes || []).map((stroke) => ({
        ...stroke,
        points: (stroke.points || []).map((point) => ({ ...point }))
      })),
      texts: (project.texts || []).map((item) => normalizeTextItem(item)),
      assets: (project.assets || []).map((asset) => ({ ...asset })),
      images: (project.images || []).map((item) => normalizeImageItem(item))
    };

    if (textDraft) {
      const draft = normalizeTextItem(textDraft);
      if (draft.text || draft.highlight || draft.glow) {
        if (selectedTextIndex >= 0 && selectedTextIndex < snapshot.texts.length) {
          snapshot.texts[selectedTextIndex] = draft;
        } else if (!snapshot.texts.some((item) => textItemsMatch(item, draft))) {
          snapshot.texts.push(draft);
        }
      }
    }

    return snapshot;
  }

  function textItemsMatch(a, b) {
    return a &&
      b &&
      a.x === b.x &&
      a.y === b.y &&
      a.width === b.width &&
      a.height === b.height &&
      a.text === b.text;
  }

  function buildProceduralCanvasCode(source) {
    const scene = getProceduralExportScene(source);
    const bounds = getProceduralExportBounds(scene.sheets, scene.page);
    const rotation = normalizeRotation(scene.view.rotation);
    const imageSourceIds = Object.keys(scene.imageSources);
    const lines = [];

    lines.push(`// Procedural GraphCanvas export: ${exportCommentText(scene.name)}`);
    lines.push("// This redraws the artwork with Canvas 2D commands instead of embedding a raster snapshot.");
    lines.push("\"use strict\";");
    lines.push("");

    if (imageSourceIds.length) {
      lines.push("// Source images stay external so the export remains a drawing recipe.");
      lines.push("// Put imported image files beside this script, or update these paths.");
      lines.push("const IMAGE_SOURCES = Object.freeze({");
      imageSourceIds.forEach((id, index) => {
        const comma = index === imageSourceIds.length - 1 ? "" : ",";
        appendCodeLine(lines, 1, `${codeLiteral(id)}: ${codeLiteral(scene.imageSources[id])}${comma}`);
      });
      lines.push("});");
      lines.push("");
    }

    lines.push("async function drawGraphCanvas(canvas, options = {}) {");
    appendCodeLine(lines, 1, `const square = options.squareSize || ${EXPORT_SQUARE_PX};`);
    appendCodeLine(lines, 1, `const baseSquare = options.baseSquareSize || ${BASE_SQUARE_PX};`);
    appendCodeLine(lines, 1, "const graphLinesEnabled = options.graphLinesEnabled !== false;");
    appendCodeLine(lines, 1, "const ctx = canvas.getContext(\"2d\");");
    appendCodeLine(lines, 1, `const bounds = { minX: ${formatExportNumber(bounds.minX)}, minY: ${formatExportNumber(bounds.minY)}, width: ${formatExportNumber(bounds.width)}, height: ${formatExportNumber(bounds.height)} };`);
    appendCodeLine(lines, 1, `const rotation = ${rotation};`);
    appendCodeLine(lines, 1, "const contentWidth = Math.round(bounds.width * square);");
    appendCodeLine(lines, 1, "const contentHeight = Math.round(bounds.height * square);");
    appendCodeLine(lines, 1, "const rotated = rotation % 2 === 1;");
    lines.push("");
    appendCodeLine(lines, 1, "canvas.width = rotated ? contentHeight : contentWidth;");
    appendCodeLine(lines, 1, "canvas.height = rotated ? contentWidth : contentHeight;");
    lines.push("");
    appendCodeLine(lines, 1, "ctx.imageSmoothingEnabled = true;");
    appendCodeLine(lines, 1, "if (\"imageSmoothingQuality\" in ctx) ctx.imageSmoothingQuality = \"high\";");
    appendCodeLine(lines, 1, "ctx.clearRect(0, 0, canvas.width, canvas.height);");
    appendCodeLine(lines, 1, "ctx.save();");
    appendCodeLine(lines, 1, "applyExportRotation(ctx, rotation, contentWidth, contentHeight);");
    appendCodeLine(lines, 1, `ctx.translate(${scaledExportExpr(-bounds.minX)}, ${scaledExportExpr(-bounds.minY)});`);
    lines.push("");

    appendExportSheets(lines, scene);
    appendExportFills(lines, scene);
    appendExportRegions(lines, scene);
    appendExportImages(lines, scene);
    appendExportStrokes(lines, scene);
    appendExportTexts(lines, scene);

    appendCodeLine(lines, 1, "ctx.restore();");
    appendCodeLine(lines, 1, "return canvas;");
    lines.push("}");

    appendExportRuntime(lines, {
      hasImages: imageSourceIds.length > 0,
      hasTexts: scene.texts.length > 0
    });

    return `${lines.join("\n")}\n`;
  }

  function getProceduralExportScene(source) {
    const page = {
      ...PAGE,
      ...(source.page || {})
    };
    page.width = Number(page.width) || PAGE.width;
    page.height = Number(page.height) || PAGE.height;
    page.squaresPerInch = Number(page.squaresPerInch) || PAGE.squaresPerInch;

    const sheets = (Array.isArray(source.sheets) && source.sheets.length ? source.sheets : [{ col: 0, row: 0 }])
      .map((sheet) => ({
        col: Number.isFinite(Number(sheet && sheet.col)) ? Math.round(Number(sheet.col)) : 0,
        row: Number.isFinite(Number(sheet && sheet.row)) ? Math.round(Number(sheet.row)) : 0
      }));

    const assets = Array.isArray(source.assets) ? source.assets.filter((asset) => asset && asset.id) : [];
    const assetMap = new Map(assets.map((asset) => [String(asset.id), asset]));
    const imageSources = {};
    const usedImageNames = new Set();

    const images = (Array.isArray(source.images) ? source.images : [])
      .map((item) => normalizeImageItem(item || {}))
      .filter((item) => item.assetId && assetMap.has(String(item.assetId)))
      .map((item) => {
        const asset = assetMap.get(String(item.assetId));
        if (!imageSources[String(item.assetId)]) {
          imageSources[String(item.assetId)] = proceduralExportImageSource(asset, usedImageNames);
        }
        return {
          ...item,
          assetId: String(item.assetId),
          assetName: asset.name || "image"
        };
      });

    return {
      name: source.name || "GraphCanvas Artwork",
      page,
      sheets,
      view: {
        rotation: Number.isInteger(source.view && source.view.rotation)
          ? normalizeRotation(source.view.rotation)
          : 0
      },
      fills: proceduralExportFills(source.fills),
      regions: Array.isArray(source.regions)
        ? source.regions.map((region) => normalizeRegion(region)).filter(Boolean)
        : [],
      strokes: proceduralExportStrokes(source.strokes),
      texts: Array.isArray(source.texts) ? source.texts.map((item) => normalizeTextItem(item)) : [],
      images,
      imageSources,
      assets
    };
  }

  function proceduralExportFills(fills) {
    if (!Array.isArray(fills)) return [];
    return fills
      .map((fill) => {
        const x = Number(fill && fill.x);
        const y = Number(fill && fill.y);
        const size = Number(fill && fill.size);
        if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(size) || size <= 0) return null;
        return {
          x: roundUnit(x),
          y: roundUnit(y),
          size: roundUnit(size),
          color: exportCanvasColor(fill.color, "#000000")
        };
      })
      .filter(Boolean);
  }

  function proceduralExportStrokes(strokes) {
    if (!Array.isArray(strokes)) return [];
    return strokes
      .map((stroke) => {
        const points = Array.isArray(stroke && stroke.points)
          ? stroke.points
            .map((point) => ({
              x: roundUnit(Number(point && point.x) || 0),
              y: roundUnit(Number(point && point.y) || 0)
            }))
            .filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y))
          : [];
        if (points.length < 2) return null;
        return {
          color: strokeColor(stroke),
          width: strokeWidth(stroke),
          globalAlpha: strokeAlpha(stroke),
          lineCap: strokeLineCap(stroke),
          lineJoin: strokeLineJoin(stroke),
          miterLimit: strokeMiterLimit(stroke),
          points
        };
      })
      .filter(Boolean);
  }

  function getProceduralExportBounds(sheets, page) {
    const safeSheets = sheets.length ? sheets : [{ col: 0, row: 0 }];
    const minCol = Math.min(...safeSheets.map((sheet) => sheet.col));
    const maxCol = Math.max(...safeSheets.map((sheet) => sheet.col));
    const minRow = Math.min(...safeSheets.map((sheet) => sheet.row));
    const maxRow = Math.max(...safeSheets.map((sheet) => sheet.row));
    return {
      minX: minCol * page.width,
      minY: minRow * page.height,
      width: (maxCol - minCol + 1) * page.width,
      height: (maxRow - minRow + 1) * page.height
    };
  }

  function proceduralExportImageSource(asset, usedImageNames) {
    const candidates = [
      asset.source,
      asset.sourceUrl,
      asset.src,
      asset.url,
      asset.href,
      asset.path,
      asset.dataUrl
    ];
    for (const candidate of candidates) {
      const source = String(candidate || "").trim();
      if (source && !/^data:/i.test(source)) return source;
    }
    return `./${uniqueProceduralExportImageFileName(asset, usedImageNames)}`;
  }

  function uniqueProceduralExportImageFileName(asset, usedImageNames) {
    const baseName = proceduralExportImageFileName(asset);
    if (!usedImageNames) return baseName;
    const parts = baseName.match(/^(.*?)(\.[^.]*)?$/);
    const stem = (parts && parts[1] ? parts[1] : "image").replace(/[<>:"|?*]/g, "_") || "image";
    const ext = parts && parts[2] ? parts[2] : "";
    let name = `${stem}${ext}`;
    let index = 2;
    while (usedImageNames.has(name.toLowerCase())) {
      name = `${stem}-${index}${ext}`;
      index += 1;
    }
    usedImageNames.add(name.toLowerCase());
    return name;
  }

  function proceduralExportImageFileName(asset) {
    const fallbackExt = imageExtensionFromDataUrl(asset && asset.dataUrl) || "png";
    const raw = String((asset && asset.name) || `image.${fallbackExt}`).trim();
    const leaf = raw.split(/[\\/]/).pop() || `image.${fallbackExt}`;
    return leaf.replace(/[\r\n]/g, "").trim() || `image.${fallbackExt}`;
  }

  function imageExtensionFromDataUrl(dataUrl) {
    const match = String(dataUrl || "").match(/^data:image\/([a-z0-9.+-]+)[;,]/i);
    if (!match) return "";
    if (match[1].toLowerCase() === "jpeg") return "jpg";
    if (match[1].toLowerCase() === "svg+xml") return "svg";
    return match[1].toLowerCase();
  }

  function exportCanvasColor(value, fallback) {
    return normalizeHex(value) || String(value || fallback);
  }

  function appendExportSheets(lines, scene) {
    if (!scene.sheets.length) return;
    appendCodeLine(lines, 1, "// Paper sheets and optional graph grid");
    for (const [index, sheet] of scene.sheets.entries()) {
      const x = sheet.col * scene.page.width;
      const y = sheet.row * scene.page.height;
      appendCodeLine(lines, 1, `// Sheet ${index + 1}: col ${sheet.col}, row ${sheet.row}`);
      appendCodeLine(lines, 1, "ctx.fillStyle = \"#fbfbfb\";");
      appendCodeLine(lines, 1, `ctx.fillRect(${scaledExportExpr(x)}, ${scaledExportExpr(y)}, ${scaledExportExpr(scene.page.width)}, ${scaledExportExpr(scene.page.height)});`);
      appendCodeLine(lines, 1, "if (graphLinesEnabled) {");
      appendCodeLine(lines, 2, `drawGrid(ctx, ${formatExportNumber(x)}, ${formatExportNumber(y)}, ${formatExportNumber(scene.page.width)}, ${formatExportNumber(scene.page.height)}, ${formatExportNumber(scene.page.squaresPerInch)}, square);`);
      appendCodeLine(lines, 1, "}");
      appendCodeLine(lines, 1, "ctx.strokeStyle = \"#909090\";");
      appendCodeLine(lines, 1, "ctx.lineWidth = 1;");
      appendCodeLine(lines, 1, `ctx.strokeRect(${scaledExportExpr(x)} + 0.5, ${scaledExportExpr(y)} + 0.5, ${scaledExportExpr(scene.page.width)}, ${scaledExportExpr(scene.page.height)});`);
      lines.push("");
    }
  }

  function appendExportFills(lines, scene) {
    if (!scene.fills.length) return;
    appendCodeLine(lines, 1, "// Cell fills");
    for (const [index, fill] of scene.fills.entries()) {
      appendCodeLine(lines, 1, `// Fill ${index + 1}`);
      appendCodeLine(lines, 1, `ctx.fillStyle = ${codeLiteral(fill.color)};`);
      appendCodeLine(lines, 1, `ctx.fillRect(${scaledExportExpr(fill.x)}, ${scaledExportExpr(fill.y)}, ${scaledExportExpr(fill.size)}, ${scaledExportExpr(fill.size)});`);
    }
    lines.push("");
  }

  function appendExportRegions(lines, scene) {
    if (!scene.regions.length) return;
    appendCodeLine(lines, 1, "// Filled regions");
    for (const [index, region] of scene.regions.entries()) {
      appendCodeLine(lines, 1, `// Region ${index + 1}`);
      appendCodeLine(lines, 1, "ctx.beginPath();");
      for (const path of region.paths) {
        if (!path.length) continue;
        appendCodeLine(lines, 1, `ctx.moveTo(${scaledExportExpr(path[0].x)}, ${scaledExportExpr(path[0].y)});`);
        for (let i = 1; i < path.length; i += 1) {
          appendCodeLine(lines, 1, `ctx.lineTo(${scaledExportExpr(path[i].x)}, ${scaledExportExpr(path[i].y)});`);
        }
        appendCodeLine(lines, 1, "ctx.closePath();");
      }
      if (region.fill) {
        appendCodeLine(lines, 1, `ctx.fillStyle = ${codeLiteral(region.color || "#000000")};`);
        appendCodeLine(lines, 1, "ctx.fill(\"evenodd\");");
      }
      if (region.stroke) {
        appendCodeLine(lines, 1, "ctx.save();");
        appendCodeLine(lines, 1, `ctx.strokeStyle = ${codeLiteral(region.strokeColor)};`);
        appendCodeLine(lines, 1, `ctx.lineWidth = Math.max(0.7, ${scaledExportExpr(region.strokeWidth)} / baseSquare);`);
        appendCodeLine(lines, 1, `ctx.lineCap = ${codeLiteral(region.lineCap)};`);
        appendCodeLine(lines, 1, `ctx.lineJoin = ${codeLiteral(region.lineJoin)};`);
        appendCodeLine(lines, 1, `ctx.miterLimit = ${formatExportNumber(region.miterLimit)};`);
        appendCodeLine(lines, 1, `ctx.globalAlpha = ${formatExportNumber(region.globalAlpha)};`);
        appendCodeLine(lines, 1, "ctx.stroke();");
        appendCodeLine(lines, 1, "ctx.restore();");
      }
    }
    lines.push("");
  }

  function appendExportImages(lines, scene) {
    if (!scene.images.length) return;
    appendCodeLine(lines, 1, "// Placed images");
    for (const [index, item] of scene.images.entries()) {
      appendCodeLine(lines, 1, `// Image ${index + 1}: ${exportCommentText(item.assetName)}`);
      appendCodeLine(lines, 1, "{");
      appendCodeLine(lines, 2, `const source = IMAGE_SOURCES[${codeLiteral(item.assetId)}];`);
      appendCodeLine(lines, 2, "const image = await loadImage(source);");
      appendCodeLine(lines, 2, "if (image) {");
      appendCodeLine(lines, 3, `const width = ${scaledExportExpr(item.width)};`);
      appendCodeLine(lines, 3, `const height = ${scaledExportExpr(item.height)};`);
      appendCodeLine(lines, 3, "ctx.save();");
      appendCodeLine(lines, 3, `ctx.translate(${scaledExportExpr(roundUnit(item.x + item.width / 2))}, ${scaledExportExpr(roundUnit(item.y + item.height / 2))});`);
      appendCodeLine(lines, 3, `ctx.rotate(${rotationExportExpr(item.rotation)});`);
      appendCodeLine(lines, 3, "ctx.drawImage(image, -width / 2, -height / 2, width, height);");
      appendCodeLine(lines, 3, "ctx.restore();");
      appendCodeLine(lines, 2, "} else {");
      appendCodeLine(lines, 3, `console.warn("Skipped missing image asset:", ${codeLiteral(item.assetName)}, source);`);
      appendCodeLine(lines, 2, "}");
      appendCodeLine(lines, 1, "}");
    }
    lines.push("");
  }

  function appendExportStrokes(lines, scene) {
    if (!scene.strokes.length) return;
    appendCodeLine(lines, 1, "// Brush and line strokes");
    appendCodeLine(lines, 1, "ctx.save();");
    for (const [index, stroke] of scene.strokes.entries()) {
      appendCodeLine(lines, 1, `// Stroke ${index + 1}`);
      appendCodeLine(lines, 1, "ctx.beginPath();");
      appendCodeLine(lines, 1, `ctx.moveTo(${scaledExportExpr(stroke.points[0].x)}, ${scaledExportExpr(stroke.points[0].y)});`);
      for (let i = 1; i < stroke.points.length; i += 1) {
        appendCodeLine(lines, 1, `ctx.lineTo(${scaledExportExpr(stroke.points[i].x)}, ${scaledExportExpr(stroke.points[i].y)});`);
      }
      appendCodeLine(lines, 1, `ctx.strokeStyle = ${codeLiteral(stroke.color)};`);
      appendCodeLine(lines, 1, `ctx.lineWidth = Math.max(0.7, ${scaledExportExpr(stroke.width)} / baseSquare);`);
      appendCodeLine(lines, 1, `ctx.lineCap = ${codeLiteral(stroke.lineCap)};`);
      appendCodeLine(lines, 1, `ctx.lineJoin = ${codeLiteral(stroke.lineJoin)};`);
      appendCodeLine(lines, 1, `ctx.miterLimit = ${formatExportNumber(stroke.miterLimit)};`);
      appendCodeLine(lines, 1, `ctx.globalAlpha = ${formatExportNumber(stroke.globalAlpha)};`);
      appendCodeLine(lines, 1, "ctx.stroke();");
    }
    appendCodeLine(lines, 1, "ctx.globalAlpha = 1;");
    appendCodeLine(lines, 1, "ctx.restore();");
    lines.push("");
  }

  function appendExportTexts(lines, scene) {
    if (!scene.texts.length) return;
    appendCodeLine(lines, 1, "// Text blocks");
    for (const [index, item] of scene.texts.entries()) {
      appendCodeLine(lines, 1, `// Text ${index + 1}`);
      appendCodeLine(lines, 1, "{");
      appendCodeLine(lines, 2, `const text = ${codeLiteral(item.text || "")};`);
      appendCodeLine(lines, 2, `const boxWidth = ${scaledExportExpr(item.width)};`);
      appendCodeLine(lines, 2, `const boxHeight = ${scaledExportExpr(item.height)};`);
      appendCodeLine(lines, 2, "const pad = Math.max(3, square * 0.12);");
      appendCodeLine(lines, 2, `const fontSize = ${scaledExportExpr(item.size)} / baseSquare;`);
      appendCodeLine(lines, 2, `const textAlign = ${codeLiteral(item.align)};`);
      appendCodeLine(lines, 2, `const textColor = ${codeLiteral(item.color)};`);
      appendCodeLine(lines, 2, "ctx.save();");
      appendCodeLine(lines, 2, `ctx.translate(${scaledExportExpr(roundUnit(item.x + item.width / 2))}, ${scaledExportExpr(roundUnit(item.y + item.height / 2))});`);
      appendCodeLine(lines, 2, `ctx.rotate(${rotationExportExpr(item.rotation)});`);
      if (item.highlight) {
        appendCodeLine(lines, 2, `ctx.fillStyle = ${codeLiteral(item.highlightColor)};`);
        appendCodeLine(lines, 2, "ctx.fillRect(-boxWidth / 2, -boxHeight / 2, boxWidth, boxHeight);");
      }
      appendCodeLine(lines, 2, "ctx.beginPath();");
      appendCodeLine(lines, 2, "ctx.rect(-boxWidth / 2, -boxHeight / 2, boxWidth, boxHeight);");
      appendCodeLine(lines, 2, "ctx.clip();");
      appendCodeLine(lines, 2, "ctx.fillStyle = textColor;");
      appendCodeLine(lines, 2, `ctx.font = textFontString(${codeLiteral(item.font)}, fontSize, ${Boolean(item.bold)}, ${Boolean(item.italic)});`);
      appendCodeLine(lines, 2, "ctx.textBaseline = \"top\";");
      appendCodeLine(lines, 2, "ctx.textAlign = textAlign;");
      if (item.glow) {
        appendCodeLine(lines, 2, `ctx.shadowColor = ${codeLiteral(item.glowColor)};`);
        appendCodeLine(lines, 2, `ctx.shadowBlur = ${scaledExportExpr(item.glowSize)} / baseSquare;`);
      }
      appendCodeLine(lines, 2, "const lines = wrapTextLines(ctx, text, Math.max(1, boxWidth - pad * 2));");
      appendCodeLine(lines, 2, "const lineHeight = fontSize * 1.18;");
      appendCodeLine(lines, 2, "let y = -boxHeight / 2 + pad;");
      appendCodeLine(lines, 2, "for (const line of lines) {");
      appendCodeLine(lines, 3, "if (y + lineHeight > boxHeight / 2 + 0.1) break;");
      appendCodeLine(lines, 3, "const x = -boxWidth / 2 + textLineX(textAlign, boxWidth, pad);");
      appendCodeLine(lines, 3, "ctx.fillText(line, x, y);");
      if (item.underline || item.strike) {
        appendCodeLine(lines, 3, `drawTextDecorations(ctx, line, x, y, fontSize, textAlign, textColor, ${Boolean(item.underline)}, ${Boolean(item.strike)});`);
      }
      appendCodeLine(lines, 3, "y += lineHeight;");
      appendCodeLine(lines, 2, "}");
      appendCodeLine(lines, 2, "ctx.restore();");
      appendCodeLine(lines, 1, "}");
    }
    lines.push("");
  }

  function appendExportRuntime(lines, flags) {
    lines.push(`
function applyExportRotation(ctx, rotation, contentWidth, contentHeight) {
  if (rotation === 1) {
    ctx.translate(contentHeight, 0);
    ctx.rotate(Math.PI / 2);
    return;
  }

  if (rotation === 2) {
    ctx.translate(contentWidth, contentHeight);
    ctx.rotate(Math.PI);
    return;
  }

  if (rotation === 3) {
    ctx.translate(0, contentWidth);
    ctx.rotate(-Math.PI / 2);
  }
}

function drawGrid(ctx, x, y, pageWidth, pageHeight, squaresPerInch, square) {
  ctx.save();
  ctx.strokeStyle = "#bad8d2";
  ctx.lineWidth = 1;
  ctx.beginPath();

  for (let gx = 0; gx <= pageWidth; gx += 1) {
    ctx.moveTo((x + gx) * square + 0.5, y * square);
    ctx.lineTo((x + gx) * square + 0.5, (y + pageHeight) * square);
  }

  for (let gy = 0; gy <= pageHeight; gy += 1) {
    ctx.moveTo(x * square, (y + gy) * square + 0.5);
    ctx.lineTo((x + pageWidth) * square, (y + gy) * square + 0.5);
  }

  ctx.stroke();
  ctx.strokeStyle = "#86aaa3";
  ctx.beginPath();

  for (let gx = 0; gx <= pageWidth; gx += squaresPerInch) {
    ctx.moveTo((x + gx) * square + 0.5, y * square);
    ctx.lineTo((x + gx) * square + 0.5, (y + pageHeight) * square);
  }

  for (let gy = 0; gy <= pageHeight; gy += squaresPerInch) {
    ctx.moveTo(x * square, (y + gy) * square + 0.5);
    ctx.lineTo((x + pageWidth) * square, (y + gy) * square + 0.5);
  }

  ctx.stroke();
  ctx.restore();
}`);

    if (flags.hasImages) {
      lines.push(`
const IMAGE_CACHE = new Map();

function loadImage(src) {
  return new Promise((resolve, reject) => {
    if (!src) {
      resolve(null);
      return;
    }

    if (IMAGE_CACHE.has(src)) {
      resolve(IMAGE_CACHE.get(src));
      return;
    }

    const image = new Image();
    image.onload = () => {
      IMAGE_CACHE.set(src, image);
      resolve(image);
    };
    image.onerror = () => resolve(null);
    image.src = src;
  });
}`);
    }

    if (flags.hasTexts) {
      lines.push(`
function textFontString(font, size, bold, italic) {
  const weight = bold ? "700" : "400";
  const style = italic ? "italic" : "normal";
  return style + " " + weight + " " + size + "px " + cssFont(font);
}

function cssFont(name) {
  return name && name.includes(" ")
    ? "\\"" + name.replace(/"/g, "") + "\\""
    : (name || "Arial");
}

function wrapTextLines(drawCtx, text, maxWidth) {
  const sourceLines = String(text || "").split(/\\r?\\n/);
  const lines = [];

  for (const source of sourceLines) {
    const words = source.split(/(\\s+)/).filter(Boolean);

    if (!words.length) {
      lines.push("");
      continue;
    }

    let line = "";
    for (const word of words) {
      const test = line + word;
      if (line && drawCtx.measureText(test).width > maxWidth) {
        lines.push(line.trimEnd());
        line = word.trimStart();
      } else {
        line = test;
      }
    }

    lines.push(line.trimEnd());
  }

  return lines.length ? lines : [""];
}

function textLineX(align, width, pad) {
  if (align === "center") return width / 2;
  if (align === "right") return width - pad;
  return pad;
}

function drawTextDecorations(drawCtx, line, x, y, size, align, color, underline, strike) {
  if (!underline && !strike) return;

  const metrics = drawCtx.measureText(line);
  let startX = x;
  if (align === "center") startX = x - metrics.width / 2;
  if (align === "right") startX = x - metrics.width;

  drawCtx.save();
  drawCtx.shadowBlur = 0;
  drawCtx.strokeStyle = color;
  drawCtx.lineWidth = Math.max(1, size / 16);

  if (underline) {
    drawCtx.beginPath();
    drawCtx.moveTo(startX, y + size * 1.03);
    drawCtx.lineTo(startX + metrics.width, y + size * 1.03);
    drawCtx.stroke();
  }

  if (strike) {
    drawCtx.beginPath();
    drawCtx.moveTo(startX, y + size * 0.56);
    drawCtx.lineTo(startX + metrics.width, y + size * 0.56);
    drawCtx.stroke();
  }

  drawCtx.restore();
}`);
    }

    lines.push(`
const drawJSArt = drawGraphCanvas;

if (typeof window !== "undefined") {
  window.drawGraphCanvas = drawGraphCanvas;
  window.drawJSArt = drawJSArt;
}

if (typeof module !== "undefined") {
  module.exports = { drawGraphCanvas, drawJSArt };
}

if (typeof document !== "undefined") {
  const autoCanvas = document.getElementById("paperCanvasExport");
  if (autoCanvas) {
    drawGraphCanvas(autoCanvas, { graphLinesEnabled: false }).catch((error) => {
      console.error("GraphCanvas export render failed:", error);
    });
  }
}`);
  }

  function appendCodeLine(lines, indent, text) {
    lines.push(`${"  ".repeat(indent)}${text}`);
  }

  function codeLiteral(value) {
    return JSON.stringify(value)
      .replace(/</g, "\\u003C")
      .replace(/\u2028/g, "\\u2028")
      .replace(/\u2029/g, "\\u2029");
  }

  function exportCommentText(value) {
    return String(value || "")
      .replace(/[\r\n]+/g, " ")
      .replace(/\*\//g, "* /")
      .trim();
  }

  function formatExportNumber(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return "0";
    const rounded = Math.abs(number) < 0.0000001 ? 0 : Math.round(number * 100000) / 100000;
    return Object.is(rounded, -0) ? "0" : String(rounded);
  }

  function scaledExportExpr(value) {
    const number = formatExportNumber(value);
    if (number === "0") return "0";
    if (number === "1") return "square";
    if (number === "-1") return "-square";
    return `${number} * square`;
  }

  function rotationExportExpr(value) {
    const rotation = normalizeRotation(value);
    if (rotation === 1) return "Math.PI / 2";
    if (rotation === 2) return "Math.PI";
    if (rotation === 3) return "Math.PI * 1.5";
    return "0";
  }

  function generateLegacyCanvasCode() {
    syncProjectView();
    const cleanProject = JSON.stringify(project);
    const encoded = toBase64(cleanProject);
    const encodedLiteral = JSON.stringify(encoded);

    return `const GRAPHCANVAS_PROJECT_BASE64 = ${encodedLiteral};
let graphCanvasProjectCache = null;

async function drawGraphCanvas(canvas, options = {}) {
  const project = getGraphCanvasProject();
  const square = options.squareSize || ${EXPORT_SQUARE_PX};
  const baseSquare = options.baseSquareSize || ${BASE_SQUARE_PX};
  const graphLinesEnabled = options.graphLinesEnabled !== false;
  const ctx = canvas.getContext("2d");
  const page = project.page;
  const bounds = getBounds(project.sheets, page);
  const rotation = Number.isInteger(project.view && project.view.rotation)
    ? ((project.view.rotation % 4) + 4) % 4
    : 0;

  const contentWidth = Math.round(bounds.width * square);
  const contentHeight = Math.round(bounds.height * square);
  const rotated = rotation % 2 === 1;

  canvas.width = rotated ? contentHeight : contentWidth;
  canvas.height = rotated ? contentWidth : contentHeight;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();

  applyExportRotation(ctx, rotation, contentWidth, contentHeight);
  ctx.translate(-bounds.minX * square, -bounds.minY * square);

  drawSheets(ctx, project, square, graphLinesEnabled);
  drawFills(ctx, project, square);
  drawRegions(ctx, project, square);
  await drawImages(ctx, project, square);
  drawStrokes(ctx, project, square, baseSquare);
  drawTexts(ctx, project, square, baseSquare);

  ctx.restore();
  return canvas;
}

function getGraphCanvasProject() {
  if (!graphCanvasProjectCache) {
    graphCanvasProjectCache = JSON.parse(decodeGraphCanvasProject(GRAPHCANVAS_PROJECT_BASE64));
  }
  return graphCanvasProjectCache;
}

function decodeGraphCanvasProject(encoded) {
  const binary = typeof atob === "function"
    ? atob(encoded)
    : Buffer.from(encoded, "base64").toString("binary");
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

function getBounds(sheets, page) {
  const minCol = Math.min(...sheets.map((sheet) => sheet.col));
  const maxCol = Math.max(...sheets.map((sheet) => sheet.col));
  const minRow = Math.min(...sheets.map((sheet) => sheet.row));
  const maxRow = Math.max(...sheets.map((sheet) => sheet.row));
  return {
    minX: minCol * page.width,
    minY: minRow * page.height,
    width: (maxCol - minCol + 1) * page.width,
    height: (maxRow - minRow + 1) * page.height
  };
}

function applyExportRotation(ctx, rotation, contentWidth, contentHeight) {
  if (rotation === 1) {
    ctx.translate(contentHeight, 0);
    ctx.rotate(Math.PI / 2);
    return;
  }

  if (rotation === 2) {
    ctx.translate(contentWidth, contentHeight);
    ctx.rotate(Math.PI);
    return;
  }

  if (rotation === 3) {
    ctx.translate(0, contentWidth);
    ctx.rotate(-Math.PI / 2);
  }
}

function drawSheets(ctx, project, square, graphLinesEnabled) {
  const page = project.page;
  for (const sheet of project.sheets) {
    const x = sheet.col * page.width;
    const y = sheet.row * page.height;
    ctx.fillStyle = "#fbfbfb";
    ctx.fillRect(x * square, y * square, page.width * square, page.height * square);

    if (graphLinesEnabled) {
      drawGrid(ctx, x, y, page, square);
    }

    ctx.strokeStyle = "#909090";
    ctx.lineWidth = 1;
    ctx.strokeRect(x * square + 0.5, y * square + 0.5, page.width * square, page.height * square);
  }
}

function drawGrid(ctx, x, y, page, square) {
  ctx.save();

  ctx.strokeStyle = "#bad8d2";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let gx = 0; gx <= page.width; gx += 1) {
    ctx.moveTo((x + gx) * square + 0.5, y * square);
    ctx.lineTo((x + gx) * square + 0.5, (y + page.height) * square);
  }
  for (let gy = 0; gy <= page.height; gy += 1) {
    ctx.moveTo(x * square, (y + gy) * square + 0.5);
    ctx.lineTo((x + page.width) * square, (y + gy) * square + 0.5);
  }
  ctx.stroke();

  ctx.strokeStyle = "#86aaa3";
  ctx.beginPath();
  for (let gx = 0; gx <= page.width; gx += page.squaresPerInch) {
    ctx.moveTo((x + gx) * square + 0.5, y * square);
    ctx.lineTo((x + gx) * square + 0.5, (y + page.height) * square);
  }
  for (let gy = 0; gy <= page.height; gy += page.squaresPerInch) {
    ctx.moveTo(x * square, (y + gy) * square + 0.5);
    ctx.lineTo((x + page.width) * square, (y + gy) * square + 0.5);
  }
  ctx.stroke();

  ctx.restore();
}

function drawFills(ctx, project, square) {
  for (const fill of project.fills) {
    ctx.fillStyle = fill.color;
    ctx.fillRect(fill.x * square, fill.y * square, fill.size * square, fill.size * square);
  }
}

function drawRegions(ctx, project, square) {
  for (const region of project.regions || []) {
    if (!region.paths || !region.paths.length) continue;
    ctx.beginPath();
    for (const path of region.paths) {
      if (!path || path.length < 3) continue;
      ctx.moveTo(path[0].x * square, path[0].y * square);
      for (let i = 1; i < path.length; i += 1) {
        ctx.lineTo(path[i].x * square, path[i].y * square);
      }
      ctx.closePath();
    }
    ctx.fillStyle = region.color || "#000000";
    ctx.fill("evenodd");
  }
}

function drawStrokes(ctx, project, square, baseSquare) {
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  for (const stroke of project.strokes) {
    if (!stroke.points || stroke.points.length < 2) continue;

    ctx.beginPath();
    ctx.moveTo(stroke.points[0].x * square, stroke.points[0].y * square);

    for (let i = 1; i < stroke.points.length; i += 1) {
      ctx.lineTo(stroke.points[i].x * square, stroke.points[i].y * square);
    }

    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = Math.max(0.7, (stroke.width || 1) * square / baseSquare);
    ctx.stroke();
  }

  ctx.restore();
}

function drawTexts(ctx, project, square, baseSquare) {
  ctx.save();

  for (const item of project.texts) {
    const text = normalizeTextItem(item);
    const width = text.width * square;
    const height = text.height * square;
    const pad = Math.max(3, square * 0.12);
    const size = text.size * square / baseSquare;
    const angle = itemRotation(text) * Math.PI / 2;

    ctx.save();
    ctx.translate((text.x + text.width / 2) * square, (text.y + text.height / 2) * square);
    ctx.rotate(angle);

    if (text.highlight) {
      ctx.fillStyle = text.highlightColor;
      ctx.fillRect(-width / 2, -height / 2, width, height);
    }

    ctx.beginPath();
    ctx.rect(-width / 2, -height / 2, width, height);
    ctx.clip();

    ctx.fillStyle = text.color;
    ctx.font = textFontString(text, size);
    ctx.textBaseline = "top";
    ctx.textAlign = text.align;

    if (text.glow) {
      ctx.shadowColor = text.glowColor;
      ctx.shadowBlur = text.glowSize * square / baseSquare;
    }

    const lines = wrapTextLines(ctx, text.text, Math.max(1, width - pad * 2));
    const lineHeight = size * 1.18;
    let y = -height / 2 + pad;

    for (const line of lines) {
      if (y + lineHeight > height / 2 + 0.1) break;
      const x = -width / 2 + textLineX(text.align, width, pad);
      ctx.fillText(line, x, y);
      drawTextDecorations(ctx, text, line, x, y, size);
      y += lineHeight;
    }

    ctx.restore();
  }

  ctx.restore();
}

function normalizeTextItem(item) {
  return {
    x: item.x || 0,
    y: item.y || 0,
    width: item.width || 8,
    height: item.height || 3,
    text: item.text || "",
    color: item.color || "#000000",
    font: item.font || "Arial",
    size: Number(item.size) || 28,
    highlight: Boolean(item.highlight),
    highlightColor: item.highlightColor || "#FFFF66",
    align: ["left", "center", "right"].includes(item.align) ? item.align : "left",
    rotation: itemRotation(item),
    bold: Boolean(item.bold),
    italic: Boolean(item.italic),
    underline: Boolean(item.underline),
    strike: Boolean(item.strike),
    glow: Boolean(item.glow),
    glowColor: item.glowColor || "#18A16F",
    glowSize: Number(item.glowSize) || 8
  };
}

function textFontString(item, size) {
  const weight = item.bold ? "700" : "400";
  const style = item.italic ? "italic" : "normal";
  return style + " " + weight + " " + size + "px " + cssFont(item.font);
}

function wrapTextLines(drawCtx, text, maxWidth) {
  const sourceLines = String(text || "").split(/\\r?\\n/);
  const lines = [];

  for (const source of sourceLines) {
    const words = source.split(/(\\s+)/).filter(Boolean);

    if (!words.length) {
      lines.push("");
      continue;
    }

    let line = "";
    for (const word of words) {
      const test = line + word;
      if (line && drawCtx.measureText(test).width > maxWidth) {
        lines.push(line.trimEnd());
        line = word.trimStart();
      } else {
        line = test;
      }
    }

    lines.push(line.trimEnd());
  }

  return lines.length ? lines : [""];
}

function textLineX(align, width, pad) {
  if (align === "center") return width / 2;
  if (align === "right") return width - pad;
  return pad;
}

function itemRotation(item) {
  const value = Number.isFinite(item && item.rotation) ? Math.round(item.rotation) : 0;
  return ((value % 4) + 4) % 4;
}

function drawTextDecorations(drawCtx, item, line, x, y, size) {
  if (!item.underline && !item.strike) return;

  const metrics = drawCtx.measureText(line);
  let startX = x;
  if (item.align === "center") startX = x - metrics.width / 2;
  if (item.align === "right") startX = x - metrics.width;
  drawCtx.save();
  drawCtx.shadowBlur = 0;
  drawCtx.strokeStyle = item.color;
  drawCtx.lineWidth = Math.max(1, size / 16);

  if (item.underline) {
    drawCtx.beginPath();
    drawCtx.moveTo(startX, y + size * 1.03);
    drawCtx.lineTo(startX + metrics.width, y + size * 1.03);
    drawCtx.stroke();
  }

  if (item.strike) {
    drawCtx.beginPath();
    drawCtx.moveTo(startX, y + size * 0.56);
    drawCtx.lineTo(startX + metrics.width, y + size * 0.56);
    drawCtx.stroke();
  }

  drawCtx.restore();
}

async function drawImages(ctx, project, square) {
  for (const item of project.images) {
    const asset = project.assets.find((entry) => entry.id === item.assetId);
    if (!asset) continue;
    const image = await loadImage(asset.dataUrl);
    const width = item.width * square;
    const height = item.height * square;
    const angle = itemRotation(item) * Math.PI / 2;
    ctx.save();
    ctx.translate((item.x + item.width / 2) * square, (item.y + item.height / 2) * square);
    ctx.rotate(angle);
    ctx.drawImage(
      image,
      -width / 2,
      -height / 2,
      width,
      height
    );
    ctx.restore();
  }
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function cssFont(name) {
  return name && name.includes(" ")
    ? '"' + name.replace(/"/g, "") + '"'
    : (name || "Arial");
}

const drawJSArt = drawGraphCanvas;

if (typeof window !== "undefined") {
  window.drawGraphCanvas = drawGraphCanvas;
  window.drawJSArt = drawJSArt;
}

if (typeof module !== "undefined") {
  module.exports = { drawGraphCanvas, drawJSArt };
}

if (typeof document !== "undefined") {
  const autoCanvas = document.getElementById("paperCanvasExport");
  if (autoCanvas) {
    drawGraphCanvas(autoCanvas, { graphLinesEnabled: false }).catch((error) => {
      console.error("GraphCanvas export render failed:", error);
    });
  }
}
`;
  }

  function generatePreviewHtml() {
    const js = generateCanvasCode();

    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${project.name || "GraphCanvas Preview"}</title>
  <style>
    html, body {
      margin: 0;
      padding: 0;
      background: #1a1a1a;
      color: #f0f0f0;
      font-family: Arial, Helvetica, sans-serif;
    }

    .page {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 24px;
    }

    h1 {
      margin: 0;
      font-size: 20px;
    }

    .frame {
      background: #2a2a2a;
      border: 1px solid #444;
      border-radius: 10px;
      padding: 16px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.35);
      overflow: auto;
      max-width: calc(100vw - 48px);
    }

    canvas {
      display: block;
      background: #fff;
    }
  </style>
</head>
<body>
  <div class="page">
    <h1>${project.name || "GraphCanvas Preview"}</h1>
    <div class="frame">
      <canvas id="paperCanvasExport"></canvas>
    </div>
  </div>

  <script>
${js}
  </script>
</body>
</html>`;
  }

  function exportImageAssetDownloads() {
    const snapshot = getExportProjectSnapshot();
    const scene = getProceduralExportScene(snapshot);
    const assets = new Map((snapshot.assets || []).map((asset) => [String(asset.id), asset]));
    const downloads = [];
    const seen = new Set();

    for (const [assetId, source] of Object.entries(scene.imageSources)) {
      const asset = assets.get(String(assetId));
      if (!asset || !asset.dataUrl || !source.startsWith("./")) continue;
      const name = source.slice(2);
      if (!name || seen.has(name.toLowerCase())) continue;
      seen.add(name.toLowerCase());
      downloads.push({ name, dataUrl: asset.dataUrl });
    }

    return downloads;
  }

  function downloadExportImageAssets() {
    const downloads = exportImageAssetDownloads();
    for (const asset of downloads) {
      downloadDataUrl(asset.name, asset.dataUrl);
    }
    return downloads.length;
  }

  function downloadDataUrl(name, dataUrl) {
    const anchor = document.createElement("a");
    anchor.href = dataUrl;
    anchor.download = name;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  }

  function runExportTask(label, task) {
    codeOutput.value = "";
    codeOutput.placeholder = `${label}...`;
    setHud(`${label}...`);
    setIoBusy(true);
    requestAnimationFrame(() => {
      setTimeout(() => {
        try {
          task();
        } catch (error) {
          setHud(error && error.message ? error.message : "Export failed");
        } finally {
          setIoBusy(false);
        }
      }, 0);
    });
  }

  function setIoBusy(busy) {
    exportCode.disabled = busy;
    exportPreview.disabled = busy;
    saveProject.disabled = busy;
    loadProject.disabled = busy;
    importCode.disabled = busy;
    if (closeProjectAfterExport) closeProjectAfterExport.disabled = busy;
  }

  function toBase64(text) {
    const bytes = new TextEncoder().encode(text);
    let binary = "";
    const chunk = 8192;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode(...bytes.slice(i, i + chunk));
    }
    return btoa(binary);
  }

  function fromBase64(encoded) {
    const binary = atob(encoded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  }

  function loadProjectText(text) {
    const next = JSON.parse(text);
    if (!next || !["GraphCanvas", "JSArt"].includes(next.app) || !Array.isArray(next.sheets)) {
      throw new Error("Not a GraphCanvas project");
    }
    const tab = currentTab();
    if (!next.name && tab) next.name = tab.name;
    loadProjectIntoEditor(next, { keepName: tab && tab.name });
    if (tab) {
      tab.name = project.name || tab.name;
      renderProjectTabs();
    }
    queueCacheSave();
    setHud("Project loaded");
  }

  function normalizeProject(next) {
    return {
      app: "GraphCanvas",
      version: 1,
      name: next.name || "Canvas",
      page: { ...PAGE, ...(next.page || {}) },
      sheets: Array.isArray(next.sheets) && next.sheets.length ? next.sheets : [{ col: 0, row: 0 }],
      view: {
        rotation: Number.isInteger(next.view && next.view.rotation) ? ((next.view.rotation % 4) + 4) % 4 : 0
      },
      fills: Array.isArray(next.fills) ? next.fills : [],
      regions: Array.isArray(next.regions) ? next.regions.map((region) => normalizeRegion(region)).filter(Boolean) : [],
      strokes: Array.isArray(next.strokes) ? next.strokes : [],
      texts: Array.isArray(next.texts) ? next.texts.map((item) => normalizeTextItem(item)) : [],
      assets: Array.isArray(next.assets) ? next.assets : [],
      images: Array.isArray(next.images) ? next.images.map((item) => normalizeImageItem(item)) : []
    };
  }

  function loadCodeText(text) {
    const match = text.match(/(?:GRAPHCANVAS|JSART)_PROJECT_BASE64:([A-Za-z0-9+/=]+)/) ||
      text.match(/(?:GRAPHCANVAS|JSART)_PROJECT_BASE64\s*=\s*["']([A-Za-z0-9+/=]+)["']/);
    if (!match) {
      throw new Error("No embedded GraphCanvas project found");
    }
    loadProjectText(fromBase64(match[1]));
  }

  function readFile(file, handler) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        handler(String(reader.result || ""));
      } catch (error) {
        setHud(error.message);
      }
    };
    reader.readAsText(file);
  }

  function readImageFile(file) {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || "");
      const img = new Image();
      img.onload = () => {
        const asset = {
          id: `asset-${Date.now()}-${Math.random().toString(16).slice(2)}`,
          name: file.name || "image",
          dataUrl,
          width: img.naturalWidth,
          height: img.naturalHeight
        };
        project.assets.push(asset);
        imageCache.set(asset.id, img);
        pendingImageAsset = asset;
        setHud("Image ready: click paper to place");
        if (pendingImagePoint) {
          addImageInstance(asset, pendingImagePoint);
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }

  function startPan(event) {
    panState = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      center: getViewCenter()
    };
    canvas.setPointerCapture(event.pointerId);
    canvas.style.cursor = "grabbing";
  }

  function movePan(event) {
    if (!panState || panState.id !== event.pointerId) return;
    const delta = screenDeltaToWorldDelta(event.clientX - panState.x, event.clientY - panState.y);
    setViewCenter({
      x: panState.center.x - delta.x,
      y: panState.center.y - delta.y
    });
    draw();
  }

  function endPan(event) {
    if (!panState || panState.id !== event.pointerId) return;
    panState = null;
    canvas.style.cursor = getToolCursor();
  }

  function isTypingTarget(target) {
    return target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement;
  }

  function bindEvents() {
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("pagehide", () => {
      writeLocalBackup();
      persistCurrentToCache().catch(() => { });
    });
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        writeLocalBackup();
        persistCurrentToCache().catch(() => { });
      }
    });
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && eyedropperMode) {
        clearEyedropperMode();
        setHud("Eyedropper canceled");
        event.preventDefault();
        return;
      }
      if (isTypingTarget(event.target)) return;
      if (event.key === "Escape") {
        if (cancelActiveSelectionMove() || clearRangeSelection("Selection cleared")) {
          event.preventDefault();
          return;
        }
      }
      const key = event.key.toLowerCase();
      if (event.key === "Delete" || event.key === "Backspace") {
        if (deleteSelectedObject()) {
          event.preventDefault();
        }
        return;
      }
      if ((event.ctrlKey || event.metaKey) && key === "z") {
        event.preventDefault();
        if (event.shiftKey) redoProject();
        else undoProject();
        return;
      }
      if ((event.ctrlKey || event.metaKey) && key === "c") {
        if (copySelection()) event.preventDefault();
        return;
      }
      if ((event.ctrlKey || event.metaKey) && key === "x") {
        if (cutSelection()) event.preventDefault();
        return;
      }
      if ((event.ctrlKey || event.metaKey) && key === "v") {
        if (pasteClipboard()) event.preventDefault();
        return;
      }
      if ((event.ctrlKey || event.metaKey) && key === "y") {
        event.preventDefault();
        redoProject();
        return;
      }
      if (!event.ctrlKey && !event.metaKey && key === "r") {
        if (!rotateSelectedObject(event.shiftKey ? -1 : 1)) {
          rotateCanvasView();
        }
        return;
      }
      if (event.code === "Space") {
        spaceDown = true;
        event.preventDefault();
        canvas.style.cursor = "grab";
      }
    });
    window.addEventListener("keyup", (event) => {
      if (isTypingTarget(event.target)) return;
      if (event.code === "Space") {
        spaceDown = false;
        canvas.style.cursor = getToolCursor();
      }
    });

    tools.forEach((button) => {
      button.addEventListener("click", () => setTool(button.dataset.tool));
    });

    detailDown.addEventListener("click", () => updateSnap(snapDiv * 2));
    detailUp.addEventListener("click", () => updateSnap(Math.max(1, snapDiv / 2)));
    newProject.addEventListener("click", () => {
      newProjectTab().catch(() => setHud("Could not create project"));
    });
    rotateView.addEventListener("click", rotateCanvasView);
    fitView.addEventListener("click", fitToSheets);
    extendOpen.addEventListener("click", openExtendModal);
    extendClose.addEventListener("click", closeExtendModal);
    extendModal.addEventListener("pointerdown", (event) => {
      if (event.target === extendModal) closeExtendModal();
    });

    textApply.addEventListener("click", applyTextPanel);
    textDelete.addEventListener("click", deleteSelectedText);
    textClose.addEventListener("click", () => closeTextPanel(false));
    textValue.addEventListener("keydown", (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        applyTextPanel();
      } else if (event.key === "Escape") {
        event.preventDefault();
        closeTextPanel(false);
      }
    });
    textValue.addEventListener("input", updateTextDraftFromPanel);
    textFont.addEventListener("change", updateTextDraftFromPanel);
    textSize.addEventListener("input", updateTextDraftFromPanel);
    textColor.addEventListener("input", updateTextDraftFromPanel);
    textHighlight.addEventListener("change", updateTextDraftFromPanel);
    textHighlightColor.addEventListener("input", updateTextDraftFromPanel);
    textGlow.addEventListener("change", updateTextDraftFromPanel);
    textGlowColor.addEventListener("input", updateTextDraftFromPanel);
    textGlowSize.addEventListener("input", updateTextDraftFromPanel);
    [textBold, textItalic, textUnderline, textStrike].forEach((button) => {
      button.addEventListener("click", () => {
        setTextToggle(button, !button.classList.contains("active"));
        updateTextDraftFromPanel();
      });
    });
    textAlignButtons.forEach((button) => {
      button.addEventListener("click", () => {
        setTextAlign(button.dataset.align);
        updateTextDraftFromPanel();
      });
    });

    colorChip.addEventListener("click", () => {
      colorPanel.classList.toggle("hidden");
      drawSvPicker();
    });
    hueSlider.addEventListener("input", () => {
      currentHue = Number(hueSlider.value);
      setColor(hsvToHex(currentHue, currentSat, currentVal));
    });
    hexColor.addEventListener("change", () => {
      const normalized = normalizeHex(hexColor.value);
      if (normalized) setColor(normalized);
      else hexColor.value = currentColor;
    });
    eyedropperButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        startEyedropper(button.dataset.eyedropperTarget, button);
      });
    });
    svPicker.addEventListener("pointerdown", (event) => {
      pickSv(event);
      svPicker.setPointerCapture(event.pointerId);
    });
    svPicker.addEventListener("pointermove", (event) => {
      if (event.buttons) pickSv(event);
    });

    document.addEventListener("pointerdown", (event) => {
      if (eyedropperMode) {
        const pickerButton = event.target.closest && event.target.closest("[data-eyedropper-target]");
        if (!pickerButton) {
          const rect = canvas.getBoundingClientRect();
          if (event.clientX >= rect.left && event.clientX <= rect.right &&
            event.clientY >= rect.top && event.clientY <= rect.bottom) {
            event.preventDefault();
            pickCanvasColor(event);
            return;
          }
          setHud("Eyedropper: click the artwork");
        }
      }
      if (!colorPanel.contains(event.target) && event.target !== colorChip) {
        colorPanel.classList.add("hidden");
      }
      clearSelectionFromOutsidePointer(event);
    });

    for (const swatch of SWATCHES) {
      const button = document.createElement("button");
      button.type = "button";
      button.style.background = swatch;
      button.title = swatch;
      button.addEventListener("click", () => setColor(swatch));
      swatches.appendChild(button);
    }

    canvas.addEventListener("pointerdown", (event) => {
      lastPointerWorld = screenToWorld(event.clientX, event.clientY);
      if (eyedropperMode) {
        event.preventDefault();
        pickCanvasColor(event);
        return;
      }
      if (tool !== "text") closeTextPanel(false);
      if (event.button === 1 || event.button === 2 || event.altKey || spaceDown) {
        event.preventDefault();
        startPan(event);
        return;
      }
      if (tool === "pencil") beginPencil(event);
      if (tool === "bucket") beginBucket(event);
      if (tool === "image") handleImageImportPointerDown(event);
      if (tool === "eraser") beginEraser(event);
      if (tool === "hand") handleHandPointerDown(event);
      if (tool === "text") beginText(event);
    });

    canvas.addEventListener("pointermove", (event) => {
      lastPointerWorld = screenToWorld(event.clientX, event.clientY);
      if (panState) movePan(event);
      else if (imageAction) moveImageAction(event);
      else if (selectionMoveAction) moveSelectionMove(event);
      else if (rangeAction) moveRangeSelection(event);
      else if (bucketAction) moveBucket(event);
      else if (eraserAction) moveEraser(event);
      else if (textAction) moveText(event);
      else if (tool === "pencil") movePencil(event);
    });
    canvas.addEventListener("pointerup", (event) => {
      if (panState) endPan(event);
      else if (imageAction) endImageAction(event);
      else if (selectionMoveAction) endSelectionMove(event);
      else if (rangeAction) endRangeSelection(event);
      else if (bucketAction) endBucket(event);
      else if (eraserAction) endEraser(event);
      else if (textAction) endText(event);
      else if (tool === "pencil") endPencil(event);
    });
    canvas.addEventListener("pointercancel", (event) => {
      if (panState) endPan(event);
      if (imageAction) cancelImageAction(event);
      if (selectionMoveAction) cancelSelectionMove(event);
      if (rangeAction) cancelRangeSelection(event);
      if (bucketAction) cancelBucket(event);
      if (eraserAction) cancelEraser(event);
      if (textAction) cancelText(event);
      previewStroke = null;
      activePointer = null;
      draw();
    });
    canvas.addEventListener("contextmenu", (event) => event.preventDefault());
    canvas.addEventListener("wheel", (event) => {
      event.preventDefault();
      const before = screenToWorld(event.clientX, event.clientY);
      const center = getViewCenter();
      const factor = event.deltaY < 0 ? 1.22 : 1 / 1.22;
      view.scale = clamp(view.scale * factor, MIN_SCALE, MAX_SCALE);
      setViewCenter(center);
      const after = screenToWorld(event.clientX, event.clientY);
      setViewCenter({
        x: center.x + before.x - after.x,
        y: center.y + before.y - after.y
      });
      draw();
    }, { passive: false });

    imageInput.addEventListener("change", () => {
      const file = imageInput.files && imageInput.files[0];
      imageInput.value = "";
      if (file) readImageFile(file);
    });

    ioOpen.addEventListener("click", openIoModal);
    ioClose.addEventListener("click", closeIoModal);
    ioModal.addEventListener("pointerdown", (event) => {
      if (event.target === ioModal) closeIoModal();
    });
    if (closeProjectAfterExport) {
      closeProjectAfterExport.addEventListener("click", () => {
        const id = pendingCloseProjectId;
        pendingCloseProjectId = "";
        closeIoModal();
        if (id) {
          removeProjectTab(id).catch(() => setHud("Could not close tab"));
        }
      });
    }

    exportCode.addEventListener("click", () => {
      runExportTask("Generating canvas JS", () => {
        const code = generateCanvasCode();
        codeOutput.value = code;
        setHud("Canvas JS exported");
      });
    });

    exportPreview.addEventListener("click", () => {
      runExportTask("Generating preview HTML", () => {
        const html = generatePreviewHtml();
        const imageCount = downloadExportImageAssets();
        codeOutput.value = html;
        download(`graphcanvas-preview-${stamp()}.html`, html, "text/html");
        setHud(imageCount ? `Preview HTML and ${imageCount} image file${imageCount === 1 ? "" : "s"} exported` : "Preview HTML exported");
      });
    });

    saveProject.addEventListener("click", saveProjectFile);
    loadProject.addEventListener("click", () => projectInput.click());
    importCode.addEventListener("click", () => codeInput.click());
    projectInput.addEventListener("change", () => {
      const file = projectInput.files && projectInput.files[0];
      projectInput.value = "";
      if (file) readFile(file, loadProjectText);
    });
    codeInput.addEventListener("change", () => {
      const file = codeInput.files && codeInput.files[0];
      codeInput.value = "";
      if (file) readFile(file, loadCodeText);
    });
  }

  bindEvents();
  setColor("#000000");
  updateSnap(1);
  updateRotateButton();
  resetHistory();
  setHud("Pencil: drag a straight or diagonal line");
  resizeCanvas();
  fitToSheets();
  initProjectCache().catch(() => setHud("Autosave unavailable"));
})();
