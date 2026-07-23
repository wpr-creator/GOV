(function () {
  "use strict";
  const data = window.COURSE_DATA;
  const foundations = window.FOUNDATIONS_DATA;
  const views = Array.from(document.querySelectorAll("[data-view]"));
  const nav = document.getElementById("site-nav");
  const menuButton = document.querySelector(".menu-button");
  const unitGrid = document.getElementById("unit-grid");
  const wordGrid = document.getElementById("word-grid");
  const dialog = document.getElementById("word-dialog");
  const foundationDialog = document.getElementById("foundation-dialog");
  const adminOverlay = document.getElementById("admin-overlay");
  const CONTENT_STORAGE_KEY = "pad-site-content-v1";
  let currentUnitId = "gov-0";
  let lastFocused = null;
  let siteContent = { currentUnit: "gov-0", exitQuestion: "", upcoming: [], classroomUrl: "" };
  let historyEvents = [];
  let historyIndex = 0;
  let devKeys = "";
  let amendmentFilter = "current";
  let glossaryFilter = "current";
  let glossaryQuery = "";

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
    const valid = ["home", "units", "foundations", "words", "help"].includes(routeName) || data.units.some(unit => unit.id === routeName);
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
    const matches = data.words.filter(word => {
      const inUnit = glossaryFilter === "all" || word[4] === currentUnitId;
      const text = `${word[0]} ${word[2]} ${word[3]}`.toLowerCase();
      return inUnit && text.includes(glossaryQuery);
    });
    matches.forEach(word => {
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
    const status = document.getElementById("glossary-status");
    status.textContent = `${matches.length} ${matches.length === 1 ? "TERM" : "TERMS"} SHOWN`;
    document.querySelectorAll("[data-glossary-filter]").forEach(button => {
      button.setAttribute("aria-pressed", String(button.dataset.glossaryFilter === glossaryFilter));
    });
    if (!matches.length) {
      const empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent = "NO MATCH YET. TRY A SHORTER WORD OR CHOOSE ALL TERMS.";
      wordGrid.appendChild(empty);
    }
  }

  function renderDocuments() {
    const grid = document.getElementById("document-grid");
    grid.replaceChildren();
    foundations.documents.forEach(documentData => {
      const card = document.createElement("article");
      card.className = "document-card";
      const meta = document.createElement("p");
      meta.className = "document-meta";
      meta.textContent = `${documentData.year} · ${documentData.author}`;
      const title = document.createElement("h3");
      title.textContent = documentData.title.toUpperCase();
      const idea = document.createElement("p");
      idea.textContent = documentData.bigIdea;
      const standard = document.createElement("span");
      standard.className = "standard-tag";
      standard.textContent = documentData.standards;
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = "OPEN DOCUMENT GUIDE →";
      button.addEventListener("click", () => openDocument(documentData, button));
      card.append(meta, title, idea, standard, button);
      grid.appendChild(card);
    });
  }

  function openDocument(documentData, source) {
    lastFocused = source;
    const content = document.getElementById("foundation-dialog-content");
    content.replaceChildren();
    const eyebrow = document.createElement("p");
    eyebrow.className = "eyebrow";
    eyebrow.textContent = `${documentData.year} · ${documentData.author} · ${documentData.standards}`;
    const title = document.createElement("h2");
    title.id = "foundation-dialog-title";
    title.textContent = documentData.title.toUpperCase();
    const blocks = [
      ["THE BIG IDEA", documentData.bigIdea],
      ["READ THIS SHORT EXCERPT", `“${documentData.excerpt}”`],
      ["IN PLAIN LANGUAGE", documentData.plain],
      ["WHY IT MATTERS", documentData.why],
      ["TRY ONE QUESTION", documentData.question]
    ];
    content.append(eyebrow, title);
    blocks.forEach(([labelText, bodyText]) => {
      const block = document.createElement("section");
      block.className = "document-detail-block";
      const label = document.createElement("h3");
      label.textContent = labelText;
      const body = document.createElement("p");
      body.textContent = bodyText;
      block.append(label, body);
      content.appendChild(block);
    });
    foundationDialog.hidden = false;
    document.body.style.overflow = "hidden";
    foundationDialog.querySelector(".foundation-dialog-close").focus();
  }

  function closeFoundationDialog() {
    foundationDialog.hidden = true;
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  function amendmentMatches(amendment) {
    const number = amendment[0];
    if (amendmentFilter === "all") return true;
    if (amendmentFilter === "current") return amendment[4].includes(currentUnitId);
    if (amendmentFilter === "rights") return number >= 1 && number <= 10;
    if (amendmentFilter === "voting") return [12, 15, 17, 19, 23, 24, 26].includes(number);
    return true;
  }

  function renderAmendments() {
    const filterContainer = document.getElementById("amendment-filters");
    filterContainer.replaceChildren();
    [["current", "CURRENT UNIT"], ["rights", "BILL OF RIGHTS"], ["voting", "VOTING"], ["all", "ALL 27"]].forEach(([id, label]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = label;
      button.setAttribute("aria-pressed", String(amendmentFilter === id));
      button.addEventListener("click", () => { amendmentFilter = id; renderAmendments(); });
      filterContainer.appendChild(button);
    });
    const grid = document.getElementById("amendment-grid");
    grid.replaceChildren();
    const matches = foundations.amendments.filter(amendmentMatches);
    matches.forEach(amendment => {
      const [number, titleText, plain, why, , standards] = amendment;
      const card = document.createElement("article");
      card.className = "amendment-card";
      const numberEl = document.createElement("div");
      numberEl.className = "amendment-number";
      numberEl.textContent = number;
      const content = document.createElement("div");
      const title = document.createElement("h3");
      title.textContent = `${ordinal(number)} AMENDMENT · ${titleText}`;
      const description = document.createElement("p");
      description.textContent = plain;
      const details = document.createElement("details");
      const summary = document.createElement("summary");
      summary.textContent = "WHY IT MATTERS";
      const whyText = document.createElement("p");
      whyText.textContent = why;
      const tag = document.createElement("span");
      tag.className = "standard-tag";
      tag.textContent = standards;
      details.append(summary, whyText, tag);
      content.append(title, description, details);
      card.append(numberEl, content);
      grid.appendChild(card);
    });
    if (!matches.length) {
      const empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent = "NO AMENDMENTS ARE MAPPED TO THIS UNIT YET. CHOOSE ALL 27.";
      grid.appendChild(empty);
    }
  }

  function ordinal(number) {
    const mod100 = number % 100;
    if (mod100 >= 11 && mod100 <= 13) return `${number}TH`;
    return `${number}${number % 10 === 1 ? "ST" : number % 10 === 2 ? "ND" : number % 10 === 3 ? "RD" : "TH"}`;
  }

  function renderSkills() {
    const grid = document.getElementById("skills-grid");
    grid.replaceChildren();
    foundations.skills.forEach(skill => {
      const card = document.createElement("article");
      card.className = "skill-card";
      const title = document.createElement("h3");
      title.textContent = skill.title;
      const summary = document.createElement("p");
      summary.textContent = skill.summary;
      const levels = document.createElement("div");
      levels.className = "skill-levels";
      const unlockedThrough = Number(siteContent.foundationUnlocks?.[skill.id] || 3);
      skill.levels.forEach((level, index) => {
        const levelNumber = index + 1;
        const button = document.createElement("button");
        button.type = "button";
        button.disabled = levelNumber > unlockedThrough;
        button.textContent = button.disabled ? `◇ LEVEL ${levelNumber} · LOCKED` : `${levelNumber === 1 ? "START HERE" : levelNumber === 2 ? "TRY IT" : "USE IT"} · ${level.title}`;
        if (!button.disabled) button.addEventListener("click", () => openSkill(skill, index));
        levels.appendChild(button);
      });
      card.append(title, summary, levels);
      grid.appendChild(card);
    });
  }

  function openSkill(skill, levelIndex) {
    const level = skill.levels[levelIndex];
    const workspace = document.getElementById("skill-workspace");
    workspace.replaceChildren();
    workspace.hidden = false;
    const eyebrow = document.createElement("p");
    eyebrow.className = "eyebrow";
    eyebrow.textContent = `${skill.title} · LEVEL ${levelIndex + 1}`;
    const title = document.createElement("h3");
    title.textContent = level.title;
    const prompt = document.createElement("p");
    prompt.className = "skill-prompt";
    prompt.textContent = level.prompt;
    const options = document.createElement("div");
    options.className = "skill-options";
    const feedback = document.createElement("p");
    feedback.className = "skill-feedback";
    feedback.setAttribute("role", "status");
    level.options.forEach((optionText, optionIndex) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = optionText;
      button.addEventListener("click", () => {
        options.querySelectorAll("button").forEach(item => { item.disabled = true; });
        button.dataset.result = optionIndex === level.answer ? "correct" : "incorrect";
        feedback.textContent = `${optionIndex === level.answer ? "CORRECT." : "NOT YET."} ${level.explain}`;
      });
      options.appendChild(button);
    });
    workspace.append(eyebrow, title, prompt, options, feedback);
    workspace.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function renderMadison(selectedId = foundations.debates[0].id) {
    const topics = document.getElementById("madison-topics");
    topics.replaceChildren();
    foundations.debates.forEach(debate => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = debate.title;
      button.setAttribute("aria-pressed", String(debate.id === selectedId));
      button.addEventListener("click", () => renderMadison(debate.id));
      topics.appendChild(button);
    });
    const debate = foundations.debates.find(item => item.id === selectedId);
    const workspace = document.getElementById("madison-workspace");
    workspace.replaceChildren();
    const question = document.createElement("h3");
    question.textContent = debate.question;
    const sides = document.createElement("div");
    sides.className = "madison-sides";
    [["MADISON · FEDERALIST VIEW", debate.federalist, debate.federalistSource], ["BRUTUS · ANTI-FEDERALIST VIEW", debate.anti, debate.antiSource]].forEach(([labelText, argument, source]) => {
      const side = document.createElement("section");
      side.className = "madison-side";
      const label = document.createElement("h4");
      label.textContent = labelText;
      const text = document.createElement("p");
      text.textContent = argument;
      const sourceEl = document.createElement("strong");
      sourceEl.textContent = source;
      side.append(label, text, sourceEl);
      sides.appendChild(side);
    });
    const connection = document.createElement("div");
    connection.className = "madison-connection";
    connection.innerHTML = "<h4>CONSTITUTIONAL CONNECTION</h4>";
    const connectionText = document.createElement("p");
    connectionText.textContent = debate.connection;
    const standard = document.createElement("span");
    standard.className = "standard-tag";
    standard.textContent = debate.standards;
    connection.append(connectionText, standard);
    const turn = document.createElement("div");
    turn.className = "madison-turn";
    const turnTitle = document.createElement("h4");
    turnTitle.textContent = "YOUR TURN";
    const turnPrompt = document.createElement("p");
    turnPrompt.textContent = debate.prompt;
    const choiceRow = document.createElement("div");
    choiceRow.className = "madison-choices";
    const response = document.createElement("textarea");
    response.rows = 4;
    response.placeholder = "I AGREE MORE WITH THE ___ VIEW BECAUSE ___. THE DOCUMENT SHOWS ___.";
    ["FEDERALIST", "ANTI-FEDERALIST"].forEach(choice => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = `I CHOOSE THE ${choice} VIEW`;
      button.addEventListener("click", () => {
        choiceRow.querySelectorAll("button").forEach(item => item.setAttribute("aria-pressed", String(item === button)));
        response.value = `I AGREE MORE WITH THE ${choice} VIEW BECAUSE `;
        response.focus();
      });
      choiceRow.appendChild(button);
    });
    turn.append(turnTitle, turnPrompt, choiceRow, response);
    workspace.append(question, sides, connection, turn);
  }

  function switchFoundationTab(tabName) {
    document.querySelectorAll("[data-foundation-tab]").forEach(button => button.setAttribute("aria-selected", String(button.dataset.foundationTab === tabName)));
    document.querySelectorAll(".foundation-panel").forEach(panel => { panel.hidden = panel.id !== `foundation-${tabName}`; });
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
      siteContent.foundationUnlocks = siteContent.foundationUnlocks || { source: 3, argument: 3, language: 3 };
      const local = localStorage.getItem(CONTENT_STORAGE_KEY);
      if (local) siteContent = { ...siteContent, ...JSON.parse(local) };
      if (data.units.some(unit => unit.id === siteContent.currentUnit)) currentUnitId = siteContent.currentUnit;
    } catch (error) {
      console.warn("Using default course content.", error);
    }
    const current = data.units.find(unit => unit.id === currentUnitId);
    document.getElementById("current-unit-number").textContent = `${current.number} · PRINCIPLES OF AMERICAN DEMOCRACY`;
    document.getElementById("now-title").textContent = current.title.toUpperCase();
    document.getElementById("current-action").href = `#${current.id}`;
    document.getElementById("current-action").firstChild.textContent = `OPEN ${current.number.toUpperCase()} `;
    renderSiteContent();
    renderUnits();
    renderWords();
    renderAmendments();
    renderSkills();
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
    const unlockContainer = document.getElementById("admin-foundation-unlocks");
    unlockContainer.replaceChildren();
    foundations.skills.forEach(skill => {
      const row = document.createElement("label");
      row.className = "admin-unlock-row";
      row.textContent = skill.title;
      const select = document.createElement("select");
      select.dataset.skillUnlock = skill.id;
      [1, 2, 3].forEach(level => {
        const option = document.createElement("option");
        option.value = level;
        option.textContent = `LEVELS 1–${level} OPEN`;
        option.selected = level === Number(siteContent.foundationUnlocks?.[skill.id] || 3);
        select.appendChild(option);
      });
      row.appendChild(select);
      unlockContainer.appendChild(row);
    });
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
    const foundationUnlocks = {};
    document.querySelectorAll("[data-skill-unlock]").forEach(select => { foundationUnlocks[select.dataset.skillUnlock] = Number(select.value); });
    return {
      currentUnit: document.getElementById("admin-current-unit").value,
      exitQuestion: document.getElementById("admin-exit-question").value.trim(),
      upcoming,
      classroomUrl: document.getElementById("admin-classroom-link").value.trim(),
      foundationUnlocks
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
  document.querySelectorAll("[data-foundation-tab]").forEach(button => button.addEventListener("click", () => switchFoundationTab(button.dataset.foundationTab)));
  foundationDialog.querySelector(".foundation-dialog-close").addEventListener("click", closeFoundationDialog);
  foundationDialog.addEventListener("click", event => { if (event.target === foundationDialog) closeFoundationDialog(); });
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
  document.getElementById("glossary-search").addEventListener("input", event => {
    glossaryQuery = event.target.value.trim().toLowerCase();
    renderWords();
  });
  document.getElementById("glossary-filters").addEventListener("click", event => {
    const button = event.target.closest("[data-glossary-filter]");
    if (!button) return;
    glossaryFilter = button.dataset.glossaryFilter;
    renderWords();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !dialog.hidden) closeWord();
    if (event.key === "Escape" && !foundationDialog.hidden) closeFoundationDialog();
    if (event.key === "Escape" && !adminOverlay.hidden) closeAdmin();
    if (event.key === "Tab" && !dialog.hidden) {
      event.preventDefault();
      dialog.querySelector(".dialog-close").focus();
    }
    if (event.key === "Tab" && !foundationDialog.hidden) {
      event.preventDefault();
      foundationDialog.querySelector(".foundation-dialog-close").focus();
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
  renderDocuments();
  renderMadison();
  loadConfig();
  loadHistory();
  route();
})();
