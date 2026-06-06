(function () {
  var projects = {
    javajam: {
      title: "Case Study 1: Java Jam",
      chapters: [
        { label: "Ch 2", src: "javajam/ch2/index.html" },
        { label: "Ch 3", src: "javajam/ch3/index.html" },
        { label: "Ch 4", src: "javajam/ch4/index.html" },
        { label: "Ch 6", src: "javajam/ch6/index.html" },
        { label: "Ch 7", src: "javajam/ch7/index.html" },
        { label: "Ch 8", src: "javajam/ch8/index.html" },
        { label: "Ch 9", src: "javajam/ch9/index.html" },
        { label: "Ch 11", src: "javajam/ch11/index.html" },
        { label: "Ch 12", src: "javajam/ch12/index.html" },
        { label: "Ch 13", src: "javajam/ch13/index.html" },
        { label: "Ch 14", src: "javajam/ch14/index.html" }
      ]
    },
    yoga: {
      title: "Case Study 2: Path of Light Yoga",
      chapters: [
        { label: "Ch 2", src: "yoga/ch2/index.html" },
        { label: "Ch 3", src: "yoga/ch3/index.html" },
        { label: "Ch 4", src: "yoga/ch4/index.html" }
      ]
    }
  };

  var existingHtmlFiles = [
    "firstdraft/schoolportfoliov1.html",
    "index.html",
    "javajam/ch11/index.html",
    "javajam/ch11/jobs.html",
    "javajam/ch11/menu.html",
    "javajam/ch11/music.html",
    "javajam/ch12/gear.html",
    "javajam/ch12/index.html",
    "javajam/ch12/jobs.html",
    "javajam/ch12/menu.html",
    "javajam/ch12/music.html",
    "javajam/ch13/index.html",
    "javajam/ch13/jobs.html",
    "javajam/ch13/menu.html",
    "javajam/ch13/music.html",
    "javajam/ch14/index.html",
    "javajam/ch14/jobs.html",
    "javajam/ch14/menu.html",
    "javajam/ch14/music.html",
    "javajam/ch2/index.html",
    "javajam/ch2/menu.html",
    "javajam/ch3/index.html",
    "javajam/ch3/menu.html",
    "javajam/ch4/index.html",
    "javajam/ch4/menu.html",
    "javajam/ch4/music.html",
    "javajam/ch6/index.html",
    "javajam/ch6/menu.html",
    "javajam/ch6/music.html",
    "javajam/ch7/index.html",
    "javajam/ch7/menu.html",
    "javajam/ch7/music.html",
    "javajam/ch8/index.html",
    "javajam/ch8/menu.html",
    "javajam/ch8/music.html",
    "javajam/ch9/index.html",
    "javajam/ch9/jobs.html",
    "javajam/ch9/menu.html",
    "javajam/ch9/music.html",
    "schoolportfoliov2.html",
    "yoga/ch2/classes.html",
    "yoga/ch2/index.html",
    "yoga/ch3/classes.html",
    "yoga/ch3/index.html",
    "yoga/ch4/classes.html",
    "yoga/ch4/index.html",
    "yoga/ch4/schedule.html"
  ].reduce(function (set, filePath) {
    set[filePath] = true;
    return set;
  }, {});

  var state = {
    draft: window.localStorage.getItem("schoolPortfolioDraft") || "v2",
    view: "portfolio",
    project: null,
    chapterIndex: 0
  };

  var frames = {
    v1: document.getElementById("draftV1"),
    v2: document.getElementById("draftV2")
  };

  var portfolioView = document.getElementById("portfolioView");
  var caseStudyView = document.getElementById("caseStudyView");
  var caseStudyFrames = document.getElementById("caseStudyFrames");
  var draftToggleButton = document.getElementById("draftToggleButton");
  var timelineControls = document.getElementById("timelineControls");
  var timelineBackButton = document.getElementById("timelineBackButton");
  var timelinePreviousButton = document.getElementById("timelinePreviousButton");
  var timelineNextButton = document.getElementById("timelineNextButton");
  var timelineChapters = document.getElementById("timelineChapters");
  var projectFrameCache = {};

  function setDraft(nextDraft) {
    state.draft = nextDraft;
    window.localStorage.setItem("schoolPortfolioDraft", nextDraft);

    frames.v1.classList.toggle("is-active", nextDraft === "v1");
    frames.v2.classList.toggle("is-active", nextDraft === "v2");
    draftToggleButton.textContent = nextDraft === "v1" ? "View v2" : "View v1";
    draftToggleButton.setAttribute(
      "aria-label",
      nextDraft === "v1" ? "Switch to final draft" : "Switch to first draft"
    );
    draftToggleButton.classList.toggle("is-v1", nextDraft === "v1");
  }

  function showPortfolio() {
    state.view = "portfolio";
    portfolioView.classList.add("is-active");
    caseStudyView.classList.remove("is-active");
    draftToggleButton.hidden = false;
    timelineControls.hidden = true;
  }

  function openCaseStudy(projectName, chapterIndex) {
    var project = projects[projectName];

    if (!project) {
      return;
    }

    state.view = "case-study";
    state.project = projectName;
    state.chapterIndex = clampChapterIndex(project, chapterIndex || 0);

    portfolioView.classList.remove("is-active");
    caseStudyView.classList.add("is-active");
    draftToggleButton.hidden = true;
    timelineControls.hidden = false;

    renderTimeline();
    preloadProjectFrames(projectName);
    showChapterFrame();
  }

  function clampChapterIndex(project, chapterIndex) {
    return Math.max(0, Math.min(chapterIndex, project.chapters.length - 1));
  }

  function renderTimeline() {
    var project = projects[state.project];

    timelineChapters.innerHTML = "";
    timelineControls.setAttribute("aria-label", project.title + " timeline");

    project.chapters.forEach(function (chapter, index) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "timeline-chapter";
      button.textContent = chapter.label;
      button.setAttribute("aria-label", project.title + " " + chapter.label);
      button.classList.toggle("is-active", index === state.chapterIndex);
      button.addEventListener("click", function () {
        state.chapterIndex = index;
        renderTimeline();
        showChapterFrame();
      });
      timelineChapters.appendChild(button);
    });
  }

  function showChapterFrame() {
    var key = state.project + "-" + state.chapterIndex;

    Object.keys(projectFrameCache).forEach(function (cacheKey) {
      projectFrameCache[cacheKey].classList.remove("is-active");
    });

    ensureChapterFrame(state.project, state.chapterIndex);
    projectFrameCache[key].classList.add("is-active");
  }

  function preloadProjectFrames(projectName) {
    projects[projectName].chapters.forEach(function (chapter, index) {
      ensureChapterFrame(projectName, index);
    });
  }

  function ensureChapterFrame(projectName, chapterIndex) {
    var project = projects[projectName];
    var chapter = project.chapters[chapterIndex];
    var key = projectName + "-" + chapterIndex;

    if (!projectFrameCache[key]) {
      var iframe = document.createElement("iframe");
      iframe.className = "case-study-frame";
      iframe.title = project.title + " " + chapter.label;
      iframe.src = chapter.src;
      iframe.addEventListener("load", function () {
        prepareCaseStudyFrame(iframe, projectName);
      });
      projectFrameCache[key] = iframe;
      caseStudyFrames.appendChild(iframe);
    }
  }

  function moveChapter(delta) {
    if (state.view !== "case-study") {
      return;
    }

    var project = projects[state.project];
    state.chapterIndex = clampChapterIndex(project, state.chapterIndex + delta);
    renderTimeline();
    showChapterFrame();
  }

  function prepareDraftFrame(iframe, draftName) {
    var doc = getFrameDocument(iframe);

    if (!doc || doc.body.dataset.cleanupReady === "true") {
      return;
    }

    doc.body.dataset.cleanupReady = "true";
    injectDraftStyles(doc);

    if (draftName === "v1") {
      simplifyV1Assignments(doc);
    } else {
      simplifyV2Assignments(doc);
    }

    interceptProjectLinks(doc);
  }

  function injectDraftStyles(doc) {
    var style = doc.createElement("style");
    style.textContent = [
      ".case-study-launcher{display:inline-flex;align-items:center;justify-content:center;min-height:42px;padding:10px 16px;border-radius:999px;border:0;background:#111;color:#fff;font-family:Arial,Helvetica,sans-serif;font-weight:700;text-decoration:none;box-shadow:0 4px 12px rgba(0,0,0,.25);}",
      ".case-study-launcher:hover,.case-study-launcher:focus-visible{background:#333;}",
      ".cleanup-note{margin-top:8px;opacity:.72;font-size:.92em;}",
      "a[data-dead-link='true']{opacity:.45;cursor:not-allowed;text-decoration:line-through;}"
    ].join("");
    doc.head.appendChild(style);
  }

  function simplifyV1Assignments(doc) {
    var container = doc.getElementById("div2");

    if (!container) {
      return;
    }

    container.innerHTML = "";
    container.appendChild(createLauncherBlock(doc, "javajam"));
    container.appendChild(createLauncherBlock(doc, "yoga"));
  }

  function simplifyV2Assignments(doc) {
    var assignments = doc.getElementById("assignments");

    if (!assignments) {
      return;
    }

    var title = assignments.querySelector("h2");
    assignments.innerHTML = "";

    if (title) {
      assignments.appendChild(title);
    }

    var note = doc.createElement("p");
    note.className = "muted cleanup-note";
    note.textContent = "Quick links to coursework projects.";
    assignments.appendChild(note);
    assignments.appendChild(createLauncherBlock(doc, "javajam"));
    assignments.appendChild(createLauncherBlock(doc, "yoga"));
  }

  function createLauncherBlock(doc, projectName) {
    var project = projects[projectName];
    var block = doc.createElement("div");
    var title = doc.createElement("h3");
    var link = doc.createElement("a");

    block.className = "assignment-section";
    block.id = "case-study-" + projectName;
    title.textContent = project.title;
    link.href = isFirstDraftDocument(doc) ? "../" + project.chapters[0].src : project.chapters[0].src;
    link.className = "case-study-launcher";
    link.dataset.caseStudy = projectName;
    link.textContent = "Open " + project.title;
    link.removeAttribute("target");

    block.appendChild(title);
    block.appendChild(link);
    return block;
  }

  function isFirstDraftDocument(doc) {
    return /\/firstdraft\//i.test(doc.location.pathname.replace(/\\/g, "/"));
  }

  function interceptProjectLinks(doc) {
    doc.addEventListener("click", function (event) {
      var link = event.target.closest("a[data-case-study]");

      if (!link) {
        return;
      }

      event.preventDefault();
      openCaseStudy(link.dataset.caseStudy, 0);
    });

    disableBrokenLinks(doc);
  }

  function prepareCaseStudyFrame(iframe, projectName) {
    var doc = getFrameDocument(iframe);

    if (!doc || doc.body.dataset.timelineReady === "true") {
      return;
    }

    doc.body.dataset.timelineReady = "true";
    injectDeadLinkStyles(doc);
    disableBrokenLinks(doc);

    doc.addEventListener("click", function (event) {
      var link = event.target.closest("a[href]");
      var target = link ? matchChapterFromHref(projectName, link.getAttribute("href")) : null;

      if (link && link.dataset.deadLink === "true") {
        event.preventDefault();
        return;
      }

      if (!target) {
        return;
      }

      event.preventDefault();
      state.chapterIndex = target.index;
      renderTimeline();
      showChapterFrame();
    });
  }

  function matchChapterFromHref(projectName, href) {
    if (!href || /^https?:\/\//i.test(href)) {
      return null;
    }

    var project = projects[projectName];
    var match = href.match(/ch(\d+)/i);

    if (!match) {
      return null;
    }

    for (var index = 0; index < project.chapters.length; index += 1) {
      if (project.chapters[index].src.indexOf("ch" + match[1] + "/") !== -1) {
        return { index: index };
      }
    }

    return null;
  }

  function injectDeadLinkStyles(doc) {
    if (doc.getElementById("cleanupDeadLinkStyles")) {
      return;
    }

    var style = doc.createElement("style");
    style.id = "cleanupDeadLinkStyles";
    style.textContent = "a[data-dead-link='true']{opacity:.45;cursor:not-allowed;text-decoration:line-through;}";
    doc.head.appendChild(style);
  }

  function disableBrokenLinks(doc) {
    Array.prototype.forEach.call(doc.querySelectorAll("a[href]"), function (link) {
      if (!isBrokenLocalLink(link, doc)) {
        return;
      }

      link.dataset.deadLink = "true";
      link.setAttribute("aria-disabled", "true");
      link.setAttribute("title", "This original project link points to a missing page.");
      link.addEventListener("click", function (event) {
        event.preventDefault();
      });
    });
  }

  function isBrokenLocalLink(link, doc) {
    var href = link.getAttribute("href");
    var targetUrl;
    var schoolPath;

    if (href === "") {
      return true;
    }

    if (/^\.\.\/(?:\.\.\/)?index\.html#school$/i.test(href)) {
      return true;
    }

    if (!href || href.charAt(0) === "#" || href.indexOf("javascript:") === 0) {
      return false;
    }

    try {
      targetUrl = new URL(href, doc.location.href);
    } catch (error) {
      return true;
    }

    if (/^(mailto|tel):$/i.test(targetUrl.protocol)) {
      return false;
    }

    if (/^https?:$/i.test(targetUrl.protocol) && targetUrl.origin !== doc.location.origin) {
      return false;
    }

    if (targetUrl.protocol !== "file:" && targetUrl.protocol !== "http:" && targetUrl.protocol !== "https:") {
      return false;
    }

    if (!/\.html?$/i.test(targetUrl.pathname)) {
      return false;
    }

    schoolPath = getSchoolPath(targetUrl);

    if (!schoolPath) {
      return true;
    }

    return !existingHtmlFiles[schoolPath];
  }

  function getSchoolPath(url) {
    var path = decodeURIComponent(url.pathname).replace(/\\/g, "/").toLowerCase();
    var marker = "/school/";
    var markerIndex = path.lastIndexOf(marker);

    if (markerIndex !== -1) {
      return path.slice(markerIndex + marker.length);
    }

    return path.replace(/^\/+/, "");
  }

  function getFrameDocument(iframe) {
    try {
      return iframe.contentDocument || iframe.contentWindow.document;
    } catch (error) {
      return null;
    }
  }

  frames.v1.addEventListener("load", function () {
    prepareDraftFrame(frames.v1, "v1");
  });

  frames.v2.addEventListener("load", function () {
    prepareDraftFrame(frames.v2, "v2");
  });

  draftToggleButton.addEventListener("click", function () {
    setDraft(state.draft === "v1" ? "v2" : "v1");
  });

  timelineBackButton.addEventListener("click", showPortfolio);
  timelinePreviousButton.addEventListener("click", function () {
    moveChapter(-1);
  });
  timelineNextButton.addEventListener("click", function () {
    moveChapter(1);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
      moveChapter(-1);
    }

    if (event.key === "ArrowRight") {
      moveChapter(1);
    }
  });

  window.PortfolioClean = {
    openCaseStudy: openCaseStudy,
    showPortfolio: showPortfolio
  };

  setDraft(state.draft === "v1" ? "v1" : "v2");
  showPortfolio();
}());
