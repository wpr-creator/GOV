(function () {
  "use strict";
  const data = window.COURSE_DATA;
  const views = Array.from(document.querySelectorAll("[data-view]"));
  const nav = document.getElementById("site-nav");
  const menuButton = document.querySelector(".menu-button");
  const unitGrid = document.getElementById("unit-grid");
  const wordGrid = document.getElementById("word-grid");
  const dialog = document.getElementById("word-dialog");
  let currentUnitId = "gov-0";
  let lastFocused = null;

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
      top.innerHTML = `<span class="unit-index">${unit.number}</span><span class="unit-state">${state === "locked" ? "◇ Locked" : state === "current" ? "● Open now" : "✓ Open"}</span>`;
      const title = document.createElement("h2");
      title.textContent = unit.title;
      const question = document.createElement("p");
      question.textContent = unit.question;
      const standards = document.createElement("p");
      standards.className = "standards";
      standards.textContent = unit.standards;
      const button = document.createElement("button");
      button.type = "button";
      button.disabled = state === "locked";
      button.textContent = state === "locked" ? "Not open yet" : state === "current" ? "Start this unit →" : "Open unit →";
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
    title.textContent = unit.title;
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
    heading.innerHTML = `<div><p class="eyebrow">Learning path</p><h2>${unit.lessons.length} focused topics</h2></div>`;
    list.appendChild(heading);
    unit.lessons.forEach((lesson, index) => {
      const article = document.createElement("article");
      article.className = "lesson";
      const num = document.createElement("span");
      num.className = "lesson-num";
      num.textContent = index + 1;
      const copy = document.createElement("div");
      const lessonTitle = document.createElement("h3");
      lessonTitle.textContent = lesson[0];
      const lessonQuestion = document.createElement("p");
      lessonQuestion.textContent = lesson[1];
      copy.append(lessonTitle, lessonQuestion);
      const standard = document.createElement("span");
      standard.className = "standard-tag";
      standard.textContent = lesson[2];
      const details = document.createElement("details");
      const summary = document.createElement("summary");
      summary.textContent = "What will I do?";
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
      button.querySelector("h2").textContent = word[0];
      button.querySelector("p").textContent = word[2];
      button.addEventListener("click", () => openWord(word, button));
      wordGrid.appendChild(button);
    });
  }

  function openWord(word, source) {
    lastFocused = source;
    document.getElementById("dialog-term").textContent = word[0];
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

  async function loadConfig() {
    try {
      const response = await fetch("course-config.json", { cache: "no-store" });
      if (!response.ok) throw new Error("Config unavailable");
      const config = await response.json();
      if (data.units.some(unit => unit.id === config.currentUnit)) currentUnitId = config.currentUnit;
    } catch (error) {
      console.warn("Using the default current unit.", error);
    }
    const current = data.units.find(unit => unit.id === currentUnitId);
    document.getElementById("current-unit-number").textContent = `${current.number} · Principles of Government`;
    document.getElementById("now-title").textContent = current.title;
    document.getElementById("current-question").textContent = current.question;
    document.getElementById("current-action").href = `#${current.id}`;
    renderUnits();
  }

  menuButton.addEventListener("click", () => {
    const open = !nav.classList.contains("open");
    nav.classList.toggle("open", open);
    menuButton.setAttribute("aria-expanded", String(open));
  });
  document.getElementById("back-to-units").addEventListener("click", () => { location.hash = "units"; });
  dialog.querySelector(".dialog-close").addEventListener("click", closeWord);
  dialog.addEventListener("click", event => { if (event.target === dialog) closeWord(); });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !dialog.hidden) closeWord();
    if (event.key === "Tab" && !dialog.hidden) {
      event.preventDefault();
      dialog.querySelector(".dialog-close").focus();
    }
  });
  window.addEventListener("hashchange", route);

  renderWords();
  loadConfig();
  route();
})();
