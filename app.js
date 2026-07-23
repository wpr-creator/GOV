(function () {
  "use strict";
  const data = window.COURSE_DATA;
  const views = Array.from(document.querySelectorAll("[data-view]"));
  const nav = document.getElementById("site-nav");
  const menuButton = document.querySelector(".menu-button");
  const unitGrid = document.getElementById("unit-grid");
  const wordGrid = document.getElementById("word-grid");
  const dialog = document.getElementById("word-dialog");
  const adminOverlay = document.getElementById("admin-overlay");
  const CONTENT_STORAGE_KEY = "pad-site-content-v1";
  let currentUnitId = "gov-0";
  let lastFocused = null;
  let siteContent = { currentUnit: "gov-0", exitQuestion: "", upcoming: [], classroomUrl: "" };
  let historyEvents = [];
  let historyIndex = 0;
  let devKeys = "";

  function showView(name) {
    const isUnit = data.units.some(unit => unit.id === name);
    const viewName = isUnit ? "unit-detail" : name;
    views.forEach(view => { view.hidden = view.dataset.view !== viewName; });
    document.querySelectorAll("[data-view-link]").forEach(link => {
      const active = link.dataset.viewLink === (viewName === "unit-detail" ? "units" : viewName);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    nav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    window.scrollTo(0, 0);
    if (isUnit) renderUnitDetail(name);
  }

  function route() {
    const routeName = location.hash.slice(1) || "home";
    const valid = ["home", "units", "words", "help"].includes(routeName) || data.units.some(unit => unit.id === routeName);
    showView(valid ? routeName : "home");
  }

  function unitState(unit) {
    const currentIndex = data.units.findIndex(item => item.id === currentUnitId);
    const unitIndex = data.units.findIndex(item => item.id === unit.id);
    if (unitIndex < currentIndex) return "open";
    if (unitIndex === currentIndex) return "current";
    return "locked";
  }

  function renderUnits() {
    unitGrid.replaceChildren();
    data.units.forEach(unit => {
      const state = unitState(unit);
      const card = document.createElement("article");
      card.className = "unit-card " + state;
      const top = document.createElement("div");
      top.className = "unit-top";
      top.innerHTML = `<span class="unit-index">${unit.number}</span><span class="unit-state">${state === "locked" ? "◇ LOCKED" : state === "current" ? "● OPEN NOW" : "✓ OPEN"}</span>`;
      const title = document.createElement("h2");
      title.textContent = unit.title.toUpperCase();
      const question = document.createElement("p");
      question.textContent = unit.question;
      const standards = document.createElement("p");
      standards.className = "standards";
      standards.textContent = unit.standards;
      const button = document.createElement("button");
      button.type = "button";
      button.disabled = state === "locked";
      button.textContent = state === "locked" ? "NOT OPEN YET" : state === "current" ? "START THIS UNIT →" : "OPEN UNIT →";
      if (!button.disabled) button.addEventListener("click", () => { location.hash = unit.id; });
      card.append(top, title, question, standards, button);
      unitGrid.appendChild(card);
    });
  }

  function renderUnitDetail(id) {
    const unit = data.units.find(item => item.id === id);
    if (!unit || unitState(unit) === "locked") { location.hash = "units"; return; }
    const container = document.getElementById("unit-detail-content");
    container.replaceChildren();
    const header = document.createElement("header");
    header.className = "unit-detail-header";
    const eyebrow = document.createElement("p");
    eyebrow.className = "eyebrow";
    eyebrow.textContent = `${unit.number} · ${unit.standards}`;
    const title = document.createElement("h1");
    title.textContent = unit.title.toUpperCase();
    const question = document.createElement("p");
    question.textContent = unit.question;
    header.append(eyebrow, title, question);

    const flow = document.createElement("div");
    flow.className = "overview-flow";
    flow.setAttribute("aria-label", "Unit overview");
    unit.overview.forEach((step, index) => {
      const item = document.createElement("div");
      item.className = "overview-step";
      item.innerHTML = `<b>Step ${index + 1}</b><span></span>`;
      item.querySelector("span").textContent = step;
      flow.appendChild(item);
    });

    const list = document.createElement("section");
    list.className = "lesson-list";
    const heading = document.createElement("div");
    heading.className = "section-heading";
    heading.innerHTML = `<div><p class="eyebrow">LEARNING PATH</p><h2>${unit.lessons.length} FOCUSED TOPICS</h2></div>`;
    list.appendChild(heading);
    unit.lessons.forEach((lesson, index) => {
      const article = document.createElement("article");
      article.className = "lesson";
      const num = document.createElement("span");
      num.className = "lesson-num";
      num.textContent = index + 1;
      const copy = document.createElement("div");
      const lessonTitle = document.createElement("h3");
      lessonTitle.textContent = lesson[0].toUpperCase();
      const lessonQuestion = document.createElement("p");
      lessonQuestion.textContent = lesson[1];
      copy.append(lessonTitle, lessonQuestion);
      const standard = document.createElement("span");
      standard.className = "standard-tag";
      standard.textContent = lesson[2];
      const details = document.createElement("details");
      const summary = document.createElement("summary");
      summary.textContent = "WHAT WILL I DO?";
      const activity = document.createElement("p");
      activity.textContent = `${lesson[3]} Check: ${lesson[4]}.`;
      details.append(summary, activity);
      article.append(num, copy, standard, details);
      list.appendChild(article);
    });
    container.append(header, flow, list);
  }

  function renderWords() {
    wordGrid.replaceChildren();
    data.words.forEach(word => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "word-card";
      button.innerHTML = `<span class="word-symbol" aria-hidden="true"></span><h2></h2><p></p>`;
      button.querySelector(".word-symbol").textContent = word[1];
      button.querySelector("h2").textContent = word[0].toUpperCase();
      button.querySelector("p").textContent = word[2];
      button.addEventListener("click", () => openWord(word, button));
      wordGrid.appendChild(button);
    });
  }

  function openWord(word, source) {
    lastFocused = source;
    document.getElementById("dialog-term").textContent = word[0].toUpperCase();
    document.getElementById("dialog-definition").textContent = word[2];
    document.getElementById("dialog-example").textContent = word[3];
    dialog.hidden = false;
    document.body.style.overflow = "hidden";
    dialog.querySelector(".dialog-close").focus();
  }

  function closeWord() {
    dialog.hidden = true;
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  function renderSiteContent() {
    document.getElementById("exit-question").textContent = siteContent.exitQuestion || "EXIT TICKET SYSTEM WILL APPEAR HERE.";
    const classroom = document.getElementById("classroom-link");
    classroom.href = siteContent.classroomUrl || "https://classroom.google.com/c/ODcxMDI4ODY2NDUy";
    const list = document.getElementById("upcoming-list");
    list.replaceChildren();
    const items = Array.isArray(siteContent.upcoming) ? siteContent.upcoming : [];
    if (!items.length) {
      const empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent = "NO UPCOMING ASSIGNMENTS POSTED.";
      list.appendChild(empty);
    } else {
      items.forEach(item => {
        const row = document.createElement("div");
        row.className = "upcoming-row";
        const title = document.createElement("strong");
        title.textContent = item.title;
        const date = document.createElement("span");
        date.textContent = item.date;
        row.append(title, date);
        list.appendChild(row);
      });
    }
  }

  async function loadConfig() {
    try {
      const response = await fetch("site-content.json", { cache: "no-store" });
      if (!response.ok) throw new Error("Site content unavailable");
      siteContent = await response.json();
      const local = localStorage.getItem(CONTENT_STORAGE_KEY);
      if (local) siteContent = { ...siteContent, ...JSON.parse(local) };
      if (data.units.some(unit => unit.id === siteContent.currentUnit)) currentUnitId = siteContent.currentUnit;
    } catch (error) {
      console.warn("Using default course content.", error);
    }
    const current = data.units.find(unit => unit.id === currentUnitId);
    document.getElementById("current-unit-number").textContent = `${current.number} · PRINCIPLES OF AMERICAN DEMOCRACY`;
    document.getElementById("now-title").textContent = current.title.toUpperCase();
    document.getElementById("current-question").textContent = current.question;
    document.getElementById("current-action").href = `#${current.id}`;
    renderSiteContent();
    renderUnits();
  }

  function renderHistory() {
    const event = historyEvents[historyIndex];
    if (!event) {
      document.getElementById("history-year").textContent = "—";
      document.getElementById("history-text").textContent = "NO POLITICAL HISTORY ENTRY IS AVAILABLE.";
      return;
    }
    document.getElementById("history-year").textContent = String(event.year || "CIVIC MOMENT");
    document.getElementById("history-text").textContent = event.text || "";
    document.getElementById("history-connection").textContent = event.ap_connection ? `COURSE CONNECTION: ${event.ap_connection}` : "";
    const source = document.getElementById("history-source");
    if (event.source_url) {
      source.href = event.source_url;
      source.textContent = `${event.source_label || "SOURCE"} ↗`;
      source.hidden = false;
    } else {
      source.hidden = true;
    }
  }

  async function loadHistory() {
    const today = new Date();
    const key = `${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    document.getElementById("history-date").textContent = today.toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase();
    try {
      const response = await fetch("us-politics-events.json");
      if (!response.ok) throw new Error("History database unavailable");
      const database = await response.json();
      historyEvents = database[key] || [];
      historyIndex = 0;
      renderHistory();
    } catch (error) {
      console.warn("Could not load political history.", error);
      renderHistory();
    }
  }

  function addAdminUpcoming(item = {}) {
    const row = document.createElement("div");
    row.className = "admin-upcoming-row";
    const title = document.createElement("input");
    title.placeholder = "ASSIGNMENT TITLE";
    title.value = item.title || "";
    title.dataset.field = "title";
    const date = document.createElement("input");
    date.placeholder = "DATE";
    date.value = item.date || "";
    date.dataset.field = "date";
    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "×";
    remove.setAttribute("aria-label", "Remove assignment");
    remove.addEventListener("click", () => row.remove());
    row.append(title, date, remove);
    document.getElementById("admin-upcoming").appendChild(row);
  }

  function openAdmin() {
    document.getElementById("admin-current-unit").replaceChildren();
    data.units.forEach(unit => {
      const option = document.createElement("option");
      option.value = unit.id;
      option.textContent = `${unit.number.toUpperCase()} · ${unit.title.toUpperCase()}`;
      option.selected = unit.id === currentUnitId;
      document.getElementById("admin-current-unit").appendChild(option);
    });
    document.getElementById("admin-exit-question").value = siteContent.exitQuestion || "";
    document.getElementById("admin-classroom-link").value = siteContent.classroomUrl || "";
    document.getElementById("admin-upcoming").replaceChildren();
    (siteContent.upcoming || []).forEach(addAdminUpcoming);
    adminOverlay.hidden = false;
    document.body.style.overflow = "hidden";
    document.getElementById("admin-close").focus();
  }

  function closeAdmin() {
    adminOverlay.hidden = true;
    document.body.style.overflow = "";
  }

  function buildAdminContent() {
    const upcoming = Array.from(document.querySelectorAll(".admin-upcoming-row")).map(row => ({
      title: row.querySelector('[data-field="title"]').value.trim().toUpperCase(),
      date: row.querySelector('[data-field="date"]').value.trim().toUpperCase()
    })).filter(item => item.title);
    return {
      currentUnit: document.getElementById("admin-current-unit").value,
      exitQuestion: document.getElementById("admin-exit-question").value.trim(),
      upcoming,
      classroomUrl: document.getElementById("admin-classroom-link").value.trim()
    };
  }

  function saveAdminPreview() {
    siteContent = buildAdminContent();
    localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(siteContent));
    currentUnitId = siteContent.currentUnit;
    loadConfig();
    document.getElementById("admin-status").textContent = "PREVIEW SAVED IN THIS BROWSER.";
  }

  menuButton.addEventListener("click", () => {
    const open = !nav.classList.contains("open");
    nav.classList.toggle("open", open);
    menuButton.setAttribute("aria-expanded", String(open));
  });
  document.getElementById("back-to-units").addEventListener("click", () => { location.hash = "units"; });
  document.getElementById("history-prev").addEventListener("click", () => {
    if (!historyEvents.length) return;
    historyIndex = (historyIndex - 1 + historyEvents.length) % historyEvents.length;
    renderHistory();
  });
  document.getElementById("history-next").addEventListener("click", () => {
    if (!historyEvents.length) return;
    historyIndex = (historyIndex + 1) % historyEvents.length;
    renderHistory();
  });
  document.getElementById("admin-close").addEventListener("click", closeAdmin);
  document.getElementById("admin-add-upcoming").addEventListener("click", () => addAdminUpcoming());
  document.getElementById("admin-save").addEventListener("click", saveAdminPreview);
  document.getElementById("admin-copy").addEventListener("click", async () => {
    const output = JSON.stringify(buildAdminContent(), null, 2);
    await navigator.clipboard.writeText(output);
    document.getElementById("admin-status").textContent = "SITE-CONTENT.JSON COPIED.";
  });
  adminOverlay.addEventListener("click", event => { if (event.target === adminOverlay) closeAdmin(); });
  dialog.querySelector(".dialog-close").addEventListener("click", closeWord);
  dialog.addEventListener("click", event => { if (event.target === dialog) closeWord(); });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !dialog.hidden) closeWord();
    if (event.key === "Escape" && !adminOverlay.hidden) closeAdmin();
    if (event.key === "Tab" && !dialog.hidden) {
      event.preventDefault();
      dialog.querySelector(".dialog-close").focus();
    }
    if (!event.metaKey && !event.ctrlKey && !event.altKey && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) {
      devKeys = (devKeys + event.key.toLowerCase()).slice(-3);
      if (devKeys === "dev") {
        if (adminOverlay.hidden) openAdmin();
        else closeAdmin();
        devKeys = "";
      }
    }
  });
  window.addEventListener("hashchange", route);

  renderWords();
  loadConfig();
  loadHistory();
  route();
})();
