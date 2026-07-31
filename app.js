(function () {
  "use strict";
  const data = window.COURSE_DATA;
  const foundations = window.FOUNDATIONS_DATA;
  const explorerSituations = window.CONSTITUTION_EXPLORER_DATA;
  const rightsCases = window.RIGHTS_REFEREE_DATA;
  const electionData = window.ELECTION_2026_DATA;
  const presidentialPowerCases = window.PRESIDENTIAL_POWER_DATA;
  const billJourneyData = window.BILL_JOURNEY_DATA;
  const federalismMapData = window.FEDERALISM_MAP_DATA;
  const foundingPowerIdeas = window.FOUNDING_POWER_DATA;
  const views = Array.from(document.querySelectorAll("[data-view]"));
  const nav = document.getElementById("site-nav");
  const menuButton = document.querySelector(".menu-button");
  const unitGrid = document.getElementById("unit-grid");
  const wordGrid = document.getElementById("word-grid");
  const dialog = document.getElementById("word-dialog");
  const foundationDialog = document.getElementById("foundation-dialog");
  const adminOverlay = document.getElementById("admin-overlay");
  const CONTENT_STORAGE_KEY = "pad-site-content-v2";
  const GITHUB_TOKEN_STORAGE_KEY = "pad-github-token-v1";
  const GITHUB_CONTENT_URL = "https://api.github.com/repos/wpr-creator/GOV/contents/site-content.json";
  let currentUnitId = "gov-0";
  let lastFocused = null;
  let siteContent = { currentUnit: "gov-0", unitUnlocks: {}, exitQuestion: "", upcoming: [], classroomUrl: "", agendaTitle: "AGENDA", agendaText: "COMING SOON.", assignmentUnlocks: {}, assignmentUrls: {} };
  let historyEvents = [];
  let historyIndex = 0;
  let devKeys = "";
  let amendmentFilter = "current";
  let glossaryFilter = "current";
  let glossaryQuery = "";
  let presidentFacts = [];
  let presidentQuery = "";
  let explorerIndex = 0;
  let rightsIndex = 0;
  let presidentialPowerIndex = 0;
  let billJourneyState = { proposal: null, stageIndex: 0, history: [], amended: false, outcome: null };
  let federalismLocationId = "school";
  const federalismVisited = new Set();

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
    const valid = ["home", "agenda", "units", "foundations", "words", "skills", "madison", "constitution-explorer", "rights-referee", "election-2026", "presidential-power", "bill-journey", "federalism-map", "founding-power", "presidents", "help"].includes(routeName) || data.units.some(unit => unit.id === routeName);
    if (routeName === "founding-power" && unitState(data.units.find(unit => unit.id === "gov-1")) === "locked") {
      location.hash = "units";
      return;
    }
    if (["madison", "constitution-explorer", "federalism-map"].includes(routeName) && unitState(data.units.find(unit => unit.id === "gov-2")) === "locked") {
      location.hash = "units";
      return;
    }
    if (routeName === "rights-referee" && unitState(data.units.find(unit => unit.id === "gov-5")) === "locked") {
      location.hash = "units";
      return;
    }
    if (routeName === "election-2026" && unitState(data.units.find(unit => unit.id === "gov-3")) === "locked") {
      location.hash = "units";
      return;
    }
    if (["presidential-power", "bill-journey"].includes(routeName) && unitState(data.units.find(unit => unit.id === "gov-4")) === "locked") {
      location.hash = "units";
      return;
    }
    showView(valid ? routeName : "home");
  }

  function unitState(unit) {
    if (unit.id === currentUnitId) return "current";
    if (Object.prototype.hasOwnProperty.call(siteContent.unitUnlocks || {}, unit.id)) {
      return siteContent.unitUnlocks[unit.id] ? "open" : "locked";
    }
    const currentIndex = data.units.findIndex(item => item.id === currentUnitId);
    const unitIndex = data.units.findIndex(item => item.id === unit.id);
    if (unitIndex < currentIndex) return "open";
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
      standards.textContent = `${unit.timing ? `${unit.timing.toUpperCase()} · ` : ""}${unit.standards}`;
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
    eyebrow.textContent = `${unit.number}${unit.timing ? ` · ${unit.timing.toUpperCase()}` : ""}`;
    const title = document.createElement("h1");
    title.textContent = unit.title.toUpperCase();
    const question = document.createElement("p");
    question.textContent = unit.question;
    header.append(eyebrow, title, question);

    const unitSources = document.createElement("section");
    unitSources.className = "unit-sources";
    unitSources.setAttribute("aria-label", "Sources for this unit");
    const sourceHeading = document.createElement("div");
    sourceHeading.className = "section-heading";
    sourceHeading.innerHTML = "<div><p class=\"eyebrow\">OPEN AS YOU NEED THEM</p><h2>UNIT SOURCES</h2></div>";
    const sourceGrid = document.createElement("div");
    sourceGrid.className = "unit-source-grid";
    foundations.documents.filter(documentData => documentData.units.includes(unit.id)).forEach(documentData => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "unit-source";
      const label = document.createElement("strong");
      label.textContent = documentData.title.toUpperCase();
      const meta = document.createElement("span");
      meta.textContent = `${documentData.year} · DOCUMENT GUIDE`;
      button.append(label, meta);
      button.addEventListener("click", () => openDocument(documentData, button));
      sourceGrid.appendChild(button);
    });
    if (foundations.amendments.some(amendment => amendment[4].includes(unit.id))) {
      const amendmentsButton = document.createElement("button");
      amendmentsButton.type = "button";
      amendmentsButton.className = "unit-source";
      const label = document.createElement("strong");
      label.textContent = unit.id === "gov-2" ? "BILL OF RIGHTS · AMENDMENTS 1–10" : "AMENDMENTS FOR THIS UNIT";
      const meta = document.createElement("span");
      meta.textContent = "OPEN AMENDMENT GUIDE";
      amendmentsButton.append(label, meta);
      amendmentsButton.addEventListener("click", () => {
        amendmentFilter = unit.id === "gov-2" ? "rights" : `unit:${unit.id}`;
        renderAmendments();
        switchFoundationTab("amendments");
        location.hash = "foundations";
      });
      sourceGrid.appendChild(amendmentsButton);
    }
    unitSources.append(sourceHeading, sourceGrid);

    const resources = document.createElement("section");
    resources.className = "unit-resources";
    resources.setAttribute("aria-label", "Assignments by lesson");
    if (unit.resources?.length) {
      const resourceGroups = new Map();
      unit.resources.forEach(resource => {
        const lesson = resource.lesson || "ASSIGNMENTS";
        if (!resourceGroups.has(lesson)) resourceGroups.set(lesson, []);
        resourceGroups.get(lesson).push(resource);
      });
      resourceGroups.forEach((lessonResources, lesson) => {
        const group = document.createElement("section");
        group.className = "unit-resource-group";
        const lessonTitle = document.createElement("h2");
        lessonTitle.textContent = lesson;
        const resourceGrid = document.createElement("div");
        resourceGrid.className = "unit-resource-grid";
        lessonResources.forEach(resource => {
          const resourceUrl = siteContent.assignmentUrls?.[resource.id] ?? resource.url;
          const unlocked = Boolean(resourceUrl && siteContent.assignmentUnlocks?.[resource.id]);
          const card = document.createElement(unlocked ? "a" : "div");
          card.className = "unit-resource";
          if (unlocked) {
            card.href = resourceUrl;
            if (!resourceUrl.startsWith("#")) {
              card.target = "_blank";
              card.rel = "noopener";
            }
            if (resource.id === "course-site") {
              card.addEventListener("click", event => {
                event.preventDefault();
                const device = `${navigator.platform || ""} ${navigator.userAgent || ""}`;
                const appleDevice = /Mac|iPhone|iPad|iPod/i.test(device);
                const chromebook = /CrOS/i.test(device);
                const shortcut = appleDevice ? "⌘D" : "Ctrl+D";
                const deviceNote = chromebook ? " on your Chromebook" : "";
                window.alert(`Press ${shortcut}${deviceNote} to bookmark this course website.`);
              });
            }
          } else {
            card.classList.add("placeholder");
            card.setAttribute("aria-disabled", "true");
          }
          const resourceTitle = document.createElement("strong");
          resourceTitle.textContent = resource.title;
          card.append(resourceTitle);
          if (resource.note) {
            const resourceNote = document.createElement("span");
            resourceNote.textContent = resource.note;
            card.append(resourceNote);
          }
          if (!unlocked) {
            const resourceStatus = document.createElement("span");
            resourceStatus.textContent = "COMING SOON";
            card.append(resourceStatus);
          }
          resourceGrid.appendChild(card);
        });
        group.append(lessonTitle, resourceGrid);
        resources.append(group);
      });
    }

    container.appendChild(header);
    if (unit.id !== "gov-0" && sourceGrid.children.length) container.append(unitSources);
    if (unit.resources?.length) container.append(resources);
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

  function renderElection2026() {
    const container = document.getElementById("election-2026-content");
    container.replaceChildren();

    const ballotHeader = document.createElement("section");
    ballotHeader.className = "ballot-header";
    ballotHeader.innerHTML = `
      <div>
        <p class="eyebrow">ELECTION DAY</p>
        <h2>${electionData.electionDate}</h2>
      </div>
      <dl>
        <div><dt>REGISTER BY</dt><dd>${electionData.registrationDeadline}</dd></div>
        <div><dt>BALLOTS MAILED BY</dt><dd>${electionData.ballotMailingDeadline}</dd></div>
      </dl>`;

    const locationCard = document.createElement("section");
    locationCard.className = "ballot-location";
    const locationCopy = document.createElement("div");
    locationCopy.innerHTML = `<p class="eyebrow">YOUR AREA</p><h2>${electionData.location.zip} · ${electionData.location.district}</h2><p>${electionData.location.note}</p>`;
    const mapLink = document.createElement("a");
    mapLink.href = electionData.location.mapSource;
    mapLink.target = "_blank";
    mapLink.rel = "noopener";
    mapLink.textContent = "CHECK THE OFFICIAL DISTRICT MAP ↗";
    locationCard.append(locationCopy, mapLink);

    const races = document.createElement("section");
    races.className = "ballot-section";
    races.innerHTML = `<div class="section-heading"><div><p class="eyebrow">CANDIDATE RACES</p><h2>WHO GETS THE JOB?</h2></div></div>`;
    const raceGrid = document.createElement("div");
    raceGrid.className = "race-grid";
    electionData.races.forEach(race => {
      const article = document.createElement("article");
      article.className = "race-card";
      if (race.local) article.classList.add("local-race");
      const localLabel = race.local ? `<span class="local-label">YOUR CONGRESSIONAL RACE</span>` : "";
      article.innerHTML = `${localLabel}<p class="eyebrow">${race.office}</p><h3>${race.question}</h3><p>${race.note}</p>`;
      const candidateList = document.createElement("div");
      candidateList.className = "candidate-list";
      race.candidates.forEach(candidate => {
        const candidateCard = document.createElement("section");
        candidateCard.innerHTML = `<h4>${candidate.name}</h4><strong>${candidate.party}</strong><p>${candidate.fact}</p>`;
        candidateList.appendChild(candidateCard);
      });
      const source = document.createElement("a");
      source.href = race.source;
      source.target = "_blank";
      source.rel = "noopener";
      source.textContent = "CHECK THE RACE SOURCE ↗";
      article.append(candidateList, source);
      raceGrid.appendChild(article);
    });
    races.appendChild(raceGrid);

    const propositions = document.createElement("section");
    propositions.className = "ballot-section";
    propositions.innerHTML = `<div class="section-heading"><div><p class="eyebrow">STATEWIDE PROPOSITIONS</p><h2>VOTERS MAKE THE LAW</h2></div><p>YES CHANGES THE LAW. NO KEEPS CURRENT LAW.</p></div>`;
    const featuredGrid = document.createElement("div");
    featuredGrid.className = "proposition-grid";
    electionData.propositions.filter(proposition => proposition.featured).forEach(proposition => {
      const details = document.createElement("details");
      details.className = "proposition-card";
      const summary = document.createElement("summary");
      summary.innerHTML = `<span>PROP ${proposition.number}</span><strong>${proposition.title}</strong><small>${proposition.short}</small>`;
      const choices = document.createElement("div");
      choices.className = "proposition-choices";
      choices.innerHTML = `<p><b>YES</b>${proposition.yes}</p><p><b>NO</b>${proposition.no}</p>`;
      details.append(summary, choices);
      featuredGrid.appendChild(details);
    });

    const more = document.createElement("section");
    more.className = "more-propositions";
    more.innerHTML = "<h3>ALSO ON THE BALLOT</h3>";
    const moreList = document.createElement("ul");
    electionData.propositions.filter(proposition => !proposition.featured).forEach(proposition => {
      const item = document.createElement("li");
      item.innerHTML = `<strong>PROP ${proposition.number} · ${proposition.title}</strong><span>${proposition.short}</span>`;
      moreList.appendChild(item);
    });
    more.appendChild(moreList);
    propositions.append(featuredGrid, more);

    const sources = document.createElement("footer");
    sources.className = "ballot-sources";
    sources.innerHTML = `<p><strong>CHECKED ${electionData.updated}</strong> · BALLOT INFORMATION CAN CHANGE BEFORE ELECTION DAY.</p>`;
    [
      ["CALIFORNIA SECRETARY OF STATE · PROPOSITIONS", electionData.sources.officialMeasures],
      ["DRAFT OFFICIAL VOTER GUIDE", electionData.sources.voterGuide],
      ["ELECTION DATES", electionData.sources.dates],
      ["BALLOTPEDIA", electionData.sources.ballotpedia]
    ].forEach(([label, url]) => {
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = `${label} ↗`;
      sources.appendChild(link);
    });

    container.append(ballotHeader, locationCard, races, propositions, sources);
  }

  function renderPresidents() {
    const grid = document.getElementById("president-grid");
    grid.replaceChildren();
    const matches = presidentFacts.filter(president =>
      `${president.name} ${president.order} ${president.yearsInOffice}`.toLowerCase().includes(presidentQuery)
    );
    document.getElementById("president-status").textContent = `${matches.length} ${matches.length === 1 ? "PRESIDENT" : "PRESIDENTS"} SHOWN`;
    matches.forEach(president => {
      const card = document.createElement("article");
      card.className = "president-card";
      const image = document.createElement("img");
      image.src = president.portrait;
      image.alt = `Portrait of ${president.name}`;
      image.loading = "lazy";
      image.width = 450;
      image.height = 540;
      const heading = document.createElement("div");
      heading.className = "president-card-heading";
      const order = document.createElement("p");
      order.className = "eyebrow";
      order.textContent = `PRESIDENT ${president.order}`;
      const name = document.createElement("h2");
      name.textContent = president.name.toUpperCase();
      const years = document.createElement("strong");
      years.textContent = president.yearsInOffice;
      heading.append(order, name, years);
      const details = document.createElement("details");
      const summary = document.createElement("summary");
      summary.textContent = "OPEN KEY FACTS";
      const facts = document.createElement("div");
      facts.className = "president-facts";
      [
        ["BORN IN", president.birthplace],
        ["RELIGION OR TRADITION", president.religion],
        ["EDUCATION", president.education],
        ["WORK BEFORE BECOMING PRESIDENT", president.careerBeforePresidency]
      ].forEach(([labelText, value]) => {
        const fact = document.createElement("p");
        const label = document.createElement("b");
        label.textContent = labelText;
        const text = document.createElement("span");
        text.textContent = value;
        fact.append(label, text);
        facts.appendChild(fact);
      });
      const accomplishmentsTitle = document.createElement("h3");
      accomplishmentsTitle.textContent = "KEY ACTIONS AS PRESIDENT";
      const accomplishments = document.createElement("ul");
      president.keyAccomplishments.forEach(item => {
        const bullet = document.createElement("li");
        bullet.textContent = item;
        accomplishments.appendChild(bullet);
      });
      const quoteTitle = document.createElement("h3");
      quoteTitle.textContent = "CHOOSE A QUOTE";
      const quotes = document.createElement("div");
      quotes.className = "president-quotes";
      (president.importantQuotes || [president.importantQuote]).forEach(quoteData => {
        const quoteText = typeof quoteData === "string" ? quoteData : quoteData.text;
        const quoteWrap = document.createElement("div");
        quoteWrap.className = "president-quote";
        const quote = document.createElement("blockquote");
        quote.textContent = `“${quoteText}”`;
        quoteWrap.appendChild(quote);
        if (quoteData?.sourceUrl) {
          const quoteSource = document.createElement("a");
          quoteSource.href = quoteData.sourceUrl;
          quoteSource.target = "_blank";
          quoteSource.rel = "noopener";
          quoteSource.textContent = `${quoteData.sourceLabel || "QUOTE SOURCE"} ↗`;
          quoteWrap.appendChild(quoteSource);
        }
        quotes.appendChild(quoteWrap);
      });
      facts.append(accomplishmentsTitle, accomplishments, quoteTitle, quotes);
      if (president.presentDayConnection) {
        const connection = document.createElement("aside");
        connection.className = "president-connection";
        const connectionTitle = document.createElement("h3");
        connectionTitle.textContent = "WHY THIS STILL MATTERS";
        const connectionText = document.createElement("p");
        connectionText.textContent = `* ${president.presentDayConnection.text}`;
        const connectionSource = document.createElement("a");
        connectionSource.href = president.presentDayConnection.sourceUrl;
        connectionSource.target = "_blank";
        connectionSource.rel = "noopener";
        connectionSource.textContent = `${president.presentDayConnection.sourceLabel} ↗`;
        connection.append(connectionTitle, connectionText, connectionSource);
        if (president.presentDayConnection.secondSourceUrl) {
          const secondSource = document.createElement("a");
          secondSource.href = president.presentDayConnection.secondSourceUrl;
          secondSource.target = "_blank";
          secondSource.rel = "noopener";
          secondSource.textContent = `${president.presentDayConnection.secondSourceLabel} ↗`;
          connection.appendChild(secondSource);
        }
        facts.appendChild(connection);
      }
      const source = document.createElement("a");
      source.href = president.sources.biographyAndQuote;
      source.target = "_blank";
      source.rel = "noopener";
      source.textContent = "READ THE PRESIDENT’S BIOGRAPHY ↗";
      facts.appendChild(source);
      details.append(summary, facts);
      card.append(image, heading, details);
      grid.appendChild(card);
    });
  }

  async function loadPresidentFacts() {
    try {
      const response = await fetch("assets/presidents/president-facts.json");
      if (!response.ok) throw new Error("President facts unavailable");
      const payload = await response.json();
      presidentFacts = payload.presidents || [];
      renderPresidents();
    } catch (error) {
      document.getElementById("president-status").textContent = "PRESIDENT FACT CARDS ARE TEMPORARILY UNAVAILABLE.";
      console.warn(error);
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
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = "OPEN DOCUMENT GUIDE →";
      button.addEventListener("click", () => openDocument(documentData, button));
      card.append(meta, title, idea, button);
      grid.appendChild(card);
    });
  }

  function openDocument(documentData, source) {
    lastFocused = source;
    const content = document.getElementById("foundation-dialog-content");
    content.replaceChildren();
    const eyebrow = document.createElement("p");
    eyebrow.className = "eyebrow";
    eyebrow.textContent = `${documentData.year} · ${documentData.author}`;
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
    if (amendmentFilter.startsWith("unit:")) return amendment[4].includes(amendmentFilter.slice(5));
    if (amendmentFilter === "rights") return number >= 1 && number <= 10;
    if (amendmentFilter === "voting") return [12, 15, 17, 19, 23, 24, 26].includes(number);
    return true;
  }

  function renderAmendments() {
    const filterContainer = document.getElementById("amendment-filters");
    filterContainer.replaceChildren();
    const unitFilterId = amendmentFilter.startsWith("unit:") ? amendmentFilter : null;
    const unitFilter = unitFilterId ? data.units.find(unit => unit.id === unitFilterId.slice(5)) : null;
    const filters = unitFilter ? [[unitFilterId, `${unitFilter.number.toUpperCase()} AMENDMENTS`]] : [["current", "CURRENT UNIT"]];
    filters.push(["rights", "BILL OF RIGHTS"], ["voting", "VOTING"], ["all", "ALL 27"]);
    filters.forEach(([id, label]) => {
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
      const [number, titleText, plain, why] = amendment;
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
      details.append(summary, whyText);
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
      const title = document.createElement("h2");
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
    const title = document.createElement("h2");
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
    const question = document.createElement("h2");
    question.textContent = debate.question;
    const sides = document.createElement("div");
    sides.className = "madison-sides";
    [["MADISON · FEDERALIST VIEW", debate.federalist, debate.federalistSource], ["BRUTUS · ANTI-FEDERALIST VIEW", debate.anti, debate.antiSource]].forEach(([labelText, argument, source]) => {
      const side = document.createElement("section");
      side.className = "madison-side";
      const label = document.createElement("h3");
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
    connection.innerHTML = "<h3>CONSTITUTIONAL CONNECTION</h3>";
    const connectionText = document.createElement("p");
    connectionText.textContent = debate.connection;
    connection.append(connectionText);
    const turn = document.createElement("div");
    turn.className = "madison-turn";
    const turnTitle = document.createElement("h3");
    turnTitle.textContent = "YOUR TURN";
    const turnPrompt = document.createElement("p");
    turnPrompt.textContent = debate.prompt;
    const choiceRow = document.createElement("div");
    choiceRow.className = "madison-choices";
    const responseLabel = document.createElement("label");
    responseLabel.htmlFor = "madison-response";
    responseLabel.textContent = "WRITE YOUR RESPONSE";
    const response = document.createElement("textarea");
    response.id = "madison-response";
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
    turn.append(turnTitle, turnPrompt, choiceRow, responseLabel, response);
    workspace.append(question, sides, connection, turn);
  }

  function renderExplorer() {
    const workspace = document.getElementById("explorer-workspace");
    const progress = document.getElementById("explorer-progress");
    workspace.replaceChildren();
    if (explorerIndex >= explorerSituations.length) {
      progress.textContent = `${explorerSituations.length} OF ${explorerSituations.length}`;
      const finish = document.createElement("div");
      finish.className = "explorer-finish";
      const heading = document.createElement("h2");
      heading.id = "explorer-question";
      heading.textContent = "WHAT THESE SITUATIONS SHOW";
      const summary = document.createElement("p");
      summary.textContent = "The Constitution gives government power, divides that power, and creates ways to stop its misuse.";
      const restart = document.createElement("button");
      restart.type = "button";
      restart.textContent = "START AGAIN";
      restart.addEventListener("click", () => {
        explorerIndex = 0;
        renderExplorer();
      });
      finish.append(heading, summary, restart);
      workspace.appendChild(finish);
      restart.focus();
      return;
    }

    const item = explorerSituations[explorerIndex];
    progress.textContent = `${explorerIndex + 1} OF ${explorerSituations.length}`;
    const scenario = document.createElement("p");
    scenario.className = "explorer-situation";
    scenario.textContent = item.situation;
    const question = document.createElement("h2");
    question.id = "explorer-question";
    question.textContent = item.question;
    const options = document.createElement("div");
    options.className = "explorer-options";
    options.setAttribute("aria-label", "Answer choices");
    const feedback = document.createElement("div");
    feedback.className = "explorer-feedback";
    feedback.setAttribute("role", "status");
    feedback.hidden = true;
    const next = document.createElement("button");
    next.type = "button";
    next.className = "explorer-next";
    next.textContent = explorerIndex === explorerSituations.length - 1 ? "FINISH" : "NEXT SITUATION →";
    next.hidden = true;
    next.addEventListener("click", () => {
      explorerIndex += 1;
      renderExplorer();
      document.getElementById("explorer-question").focus({ preventScroll: true });
    });

    item.options.forEach((optionText, optionIndex) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = optionText;
      button.addEventListener("click", () => {
        options.querySelectorAll("button").forEach((optionButton, index) => {
          optionButton.disabled = true;
          if (index === item.answer) optionButton.dataset.answer = "correct";
          if (index === optionIndex && index !== item.answer) optionButton.dataset.answer = "selected";
        });
        const result = document.createElement("strong");
        result.textContent = optionIndex === item.answer ? "CORRECT." : `THE ANSWER IS ${item.options[item.answer]}.`;
        const power = document.createElement("p");
        power.textContent = item.power;
        const check = document.createElement("p");
        check.innerHTML = "<strong>WHAT LIMITS IT?</strong> ";
        check.append(item.check);
        const source = document.createElement("p");
        source.className = "explorer-source";
        source.textContent = item.source;
        feedback.replaceChildren(result, power, check, source);
        feedback.hidden = false;
        next.hidden = false;
        next.focus();
      });
      options.appendChild(button);
    });

    workspace.append(scenario, question, options, feedback, next);
    question.tabIndex = -1;
  }

  function renderRightsReferee() {
    const workspace = document.getElementById("rights-workspace");
    const progress = document.getElementById("rights-progress");
    workspace.replaceChildren();
    if (rightsIndex >= rightsCases.length) {
      progress.textContent = `${rightsCases.length} OF ${rightsCases.length}`;
      const finish = document.createElement("div");
      finish.className = "explorer-finish";
      const heading = document.createElement("h2");
      heading.id = "rights-question";
      heading.textContent = "WHAT THE CASES SHOW";
      const summary = document.createElement("p");
      summary.textContent = "Rights protect people, but the result often depends on where an action happened, who acted, and what government could prove.";
      const restart = document.createElement("button");
      restart.type = "button";
      restart.textContent = "START AGAIN";
      restart.addEventListener("click", () => { rightsIndex = 0; renderRightsReferee(); });
      finish.append(heading, summary, restart);
      workspace.appendChild(finish);
      restart.focus();
      return;
    }
    const item = rightsCases[rightsIndex];
    progress.textContent = `${rightsIndex + 1} OF ${rightsCases.length}`;
    const card = document.createElement("article");
    card.className = "rights-case";
    const visual = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    visual.setAttribute("viewBox", "0 0 160 120");
    visual.setAttribute("role", "img");
    visual.setAttribute("aria-label", item.iconAlt);
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", `assets/cases/rights-referee-icons.svg#${item.icon}`);
    visual.appendChild(use);
    const copy = document.createElement("div");
    const meta = document.createElement("p");
    meta.className = "eyebrow";
    meta.textContent = `${item.caseName} · ${item.year}`;
    const facts = document.createElement("p");
    facts.className = "rights-facts";
    facts.textContent = item.facts;
    const question = document.createElement("h2");
    question.id = "rights-question";
    question.tabIndex = -1;
    question.textContent = item.question;
    const options = document.createElement("div");
    options.className = "rights-options";
    const feedback = document.createElement("div");
    feedback.className = "explorer-feedback";
    feedback.setAttribute("role", "status");
    feedback.hidden = true;
    const next = document.createElement("button");
    next.type = "button";
    next.className = "explorer-next";
    next.textContent = rightsIndex === rightsCases.length - 1 ? "FINISH" : "NEXT CASE →";
    next.hidden = true;
    next.addEventListener("click", () => {
      rightsIndex += 1;
      renderRightsReferee();
      document.getElementById("rights-question").focus({ preventScroll: true });
    });
    item.options.forEach((optionText, optionIndex) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = optionText;
      button.addEventListener("click", () => {
        options.querySelectorAll("button").forEach((optionButton, index) => {
          optionButton.disabled = true;
          if (index === item.answer) optionButton.dataset.answer = "correct";
          if (index === optionIndex && index !== item.answer) optionButton.dataset.answer = "selected";
        });
        const result = document.createElement("strong");
        result.textContent = optionIndex === item.answer ? "YOUR RULING MATCHES THE COURT." : "YOUR RULING DIFFERS FROM THE COURT.";
        const ruling = document.createElement("p");
        ruling.textContent = item.ruling;
        const fact = document.createElement("p");
        const factLabel = document.createElement("strong");
        factLabel.textContent = "FACT THAT MATTERED: ";
        fact.append(factLabel, item.keyFact);
        const source = document.createElement("a");
        source.href = item.source;
        source.target = "_blank";
        source.rel = "noopener";
        source.textContent = `${item.amendment} · READ THE CASE SOURCE ↗`;
        feedback.replaceChildren(result, ruling, fact, source);
        feedback.hidden = false;
        next.hidden = false;
        next.focus();
      });
      options.appendChild(button);
    });
    copy.append(meta, facts, question, options);
    card.append(visual, copy);
    workspace.append(card, feedback, next);
  }

  function renderPresidentialPower() {
    const workspace = document.getElementById("power-workspace");
    const progress = document.getElementById("power-progress");
    workspace.replaceChildren();
    if (presidentialPowerIndex >= presidentialPowerCases.length) {
      progress.textContent = `${presidentialPowerCases.length} OF ${presidentialPowerCases.length}`;
      const finish = document.createElement("div");
      finish.className = "explorer-finish";
      const heading = document.createElement("h2");
      heading.id = "power-question";
      heading.textContent = "WHAT THESE ACTIONS SHOW";
      const summary = document.createElement("p");
      summary.textContent = "Presidential power can be strong, but laws, Congress, and the courts place limits on what a president may do alone.";
      const restart = document.createElement("button");
      restart.type = "button";
      restart.textContent = "START AGAIN";
      restart.addEventListener("click", () => {
        presidentialPowerIndex = 0;
        renderPresidentialPower();
      });
      finish.append(heading, summary, restart);
      workspace.appendChild(finish);
      restart.focus();
      return;
    }

    const item = presidentialPowerCases[presidentialPowerIndex];
    progress.textContent = `${presidentialPowerIndex + 1} OF ${presidentialPowerCases.length}`;
    const card = document.createElement("article");
    card.className = "power-case";
    const visual = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    visual.setAttribute("viewBox", "0 0 160 120");
    visual.setAttribute("role", "img");
    visual.setAttribute("aria-label", item.iconAlt);
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", `assets/power/presidential-power-icons.svg#${item.icon}`);
    visual.appendChild(use);
    const copy = document.createElement("div");
    const meta = document.createElement("p");
    meta.className = "eyebrow";
    meta.textContent = `${item.president} · ${item.year}`;
    const action = document.createElement("p");
    action.className = "power-action";
    action.textContent = item.action;
    const question = document.createElement("h2");
    question.id = "power-question";
    question.tabIndex = -1;
    question.textContent = item.question;
    const options = document.createElement("div");
    options.className = "power-options";
    const feedback = document.createElement("div");
    feedback.className = "power-feedback";
    feedback.setAttribute("role", "status");
    feedback.hidden = true;
    const next = document.createElement("button");
    next.type = "button";
    next.className = "explorer-next";
    next.textContent = presidentialPowerIndex === presidentialPowerCases.length - 1 ? "FINISH" : "NEXT ACTION →";
    next.hidden = true;
    next.addEventListener("click", () => {
      presidentialPowerIndex += 1;
      renderPresidentialPower();
      document.getElementById("power-question").focus({ preventScroll: true });
    });

    item.options.forEach((optionText, optionIndex) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = optionText;
      button.addEventListener("click", () => {
        options.querySelectorAll("button").forEach((optionButton, index) => {
          optionButton.disabled = true;
          if (index === item.answer) optionButton.dataset.answer = "correct";
          if (index === optionIndex && index !== item.answer) optionButton.dataset.answer = "selected";
        });
        const result = document.createElement("strong");
        result.textContent = optionIndex === item.answer ? "YOUR CALL MATCHES THE CONSTITUTIONAL RESULT." : `THE RESULT WAS ${item.options[item.answer]}.`;
        const ruling = document.createElement("p");
        ruling.textContent = item.ruling;
        const limits = document.createElement("div");
        limits.className = "power-limits";
        limits.innerHTML = `<p><b>THE POWER</b>${item.power}</p><p><b>THE CHECK</b>${item.check}</p>`;
        const source = document.createElement("a");
        source.href = item.source;
        source.target = "_blank";
        source.rel = "noopener";
        source.textContent = `${item.sourceLabel} · SOURCE ↗`;
        feedback.replaceChildren(result, ruling, limits, source);
        feedback.hidden = false;
        next.hidden = false;
        next.focus();
      });
      options.appendChild(button);
    });
    copy.append(meta, action, question, options);
    card.append(visual, copy);
    workspace.append(card, feedback, next);
  }

  function resetBillJourney() {
    billJourneyState = { proposal: null, stageIndex: 0, history: [], amended: false, outcome: null };
    renderBillJourney();
  }

  function appendGovernmentLevels(container, levelIds) {
    levelIds.forEach(levelId => {
      const level = federalismMapData.levels.find(item => item.id === levelId);
      const chip = document.createElement("span");
      chip.className = "government-level";
      chip.dataset.level = levelId;
      chip.textContent = level.label;
      container.appendChild(chip);
    });
  }

  function renderFederalismDetail() {
    const location = federalismMapData.locations.find(item => item.id === federalismLocationId);
    const detail = document.getElementById("federalism-detail");
    detail.replaceChildren();
    const top = document.createElement("div");
    top.className = "federalism-detail-top";
    const count = document.createElement("p");
    count.className = "eyebrow";
    count.textContent = `${federalismVisited.size} OF ${federalismMapData.locations.length} EXPLORED`;
    const title = document.createElement("h2");
    title.id = "federalism-location-title";
    title.tabIndex = -1;
    title.textContent = location.mapLabel;
    const levelRow = document.createElement("div");
    levelRow.className = "government-levels";
    appendGovernmentLevels(levelRow, location.levels);
    top.append(count, title, levelRow);

    const sections = [
      ["WHO ACTS?", location.who],
      ["WHAT DO THEY DO?", location.what],
      ["WHY THIS LEVEL?", location.why]
    ];
    const facts = document.createElement("div");
    facts.className = "federalism-facts";
    sections.forEach(([headingText, bodyText]) => {
      const section = document.createElement("section");
      const heading = document.createElement("h3");
      heading.textContent = headingText;
      const body = document.createElement("p");
      body.textContent = bodyText;
      section.append(heading, body);
      facts.appendChild(section);
    });
    const connection = document.createElement("blockquote");
    connection.textContent = location.connection;
    const source = document.createElement("a");
    source.href = location.source;
    source.target = "_blank";
    source.rel = "noopener";
    source.textContent = `${location.sourceLabel} · CHECK THE SOURCE ↗`;
    detail.append(top, facts, connection, source);
  }

  function openFederalismLocation(locationId, moveFocus = true) {
    federalismLocationId = locationId;
    federalismVisited.add(locationId);
    document.querySelectorAll(".map-location").forEach(button => {
      button.setAttribute("aria-pressed", String(button.dataset.locationId === locationId));
      button.dataset.visited = String(federalismVisited.has(button.dataset.locationId));
    });
    renderFederalismDetail();
    if (moveFocus) document.getElementById("federalism-location-title").focus({ preventScroll: true });
  }

  function renderFederalismMap() {
    const key = document.getElementById("federalism-key");
    const map = document.getElementById("community-map");
    key.replaceChildren();
    map.replaceChildren();
    federalismMapData.levels.forEach(level => {
      const item = document.createElement("div");
      item.className = "federalism-key-item";
      const chip = document.createElement("span");
      chip.className = "government-level";
      chip.dataset.level = level.id;
      chip.textContent = level.label;
      const meaning = document.createElement("p");
      meaning.textContent = level.meaning;
      item.append(chip, meaning);
      key.appendChild(item);
    });
    const mapHeading = document.createElement("div");
    mapHeading.className = "community-map-heading";
    const mapEyebrow = document.createElement("p");
    mapEyebrow.className = "eyebrow";
    mapEyebrow.textContent = "SAN DIEGO COMMUNITY";
    const mapTitle = document.createElement("h2");
    mapTitle.textContent = "OPEN A LOCATION";
    mapHeading.append(mapEyebrow, mapTitle);
    map.appendChild(mapHeading);
    federalismMapData.locations.forEach((location, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "map-location";
      button.dataset.locationId = location.id;
      button.dataset.mapPosition = String(index + 1);
      button.dataset.icon = location.icon;
      button.dataset.visited = String(federalismVisited.has(location.id));
      button.setAttribute("aria-pressed", String(location.id === federalismLocationId));
      const structure = document.createElement("span");
      structure.className = "map-structure";
      structure.setAttribute("aria-hidden", "true");
      const name = document.createElement("strong");
      name.textContent = location.mapLabel;
      const levels = document.createElement("span");
      levels.className = "map-location-levels";
      levels.textContent = location.levels.filter(level => level !== "shared").map(level => level.toUpperCase()).join(" · ");
      button.append(structure, name, levels);
      button.addEventListener("click", () => openFederalismLocation(location.id));
      map.appendChild(button);
    });
    openFederalismLocation(federalismLocationId, false);
  }

  function renderBillRoute() {
    const routeMap = document.getElementById("bill-route");
    routeMap.replaceChildren();
    const visibleStages = billJourneyData.stages.filter(stage => stage.id !== "conference" || billJourneyState.history.some(item => item.id === "second-vote" && item.conference));
    visibleStages.forEach((stage, index) => {
      const marker = document.createElement("div");
      marker.className = "bill-route-stop";
      const actualIndex = billJourneyData.stages.findIndex(item => item.id === stage.id);
      if (billJourneyState.proposal && actualIndex === billJourneyState.stageIndex && !billJourneyState.outcome) marker.dataset.state = "current";
      if (billJourneyState.history.some(item => item.id === stage.id)) marker.dataset.state = "passed";
      const number = document.createElement("span");
      number.textContent = String(index + 1).padStart(2, "0");
      const label = document.createElement("strong");
      if (stage.id === "first-vote" && billJourneyState.chamber) label.textContent = billJourneyState.chamber.toUpperCase();
      else if (stage.id === "second-vote" && billJourneyState.chamber) label.textContent = billJourneyState.chamber === "House" ? "SENATE" : "HOUSE";
      else label.textContent = stage.place;
      marker.append(number, label);
      routeMap.appendChild(marker);
    });
  }

  function renderBillFolder() {
    const proposal = billJourneyState.proposal;
    const folder = document.createElement("aside");
    folder.className = "bill-folder";
    folder.setAttribute("aria-label", "Your bill record");
    const tab = document.createElement("span");
    tab.className = "bill-folder-tab";
    tab.textContent = proposal.shortTitle;
    const label = document.createElement("p");
    label.className = "eyebrow";
    label.textContent = "YOUR BILL";
    const title = document.createElement("h2");
    title.textContent = proposal.title;
    const billNumber = document.createElement("strong");
    billNumber.className = "bill-number";
    billNumber.textContent = billJourneyState.chamber === "Senate" ? "S. 142" : billJourneyState.chamber === "House" ? "H.R. 142" : "DRAFT";
    const purpose = document.createElement("p");
    purpose.textContent = proposal.purpose;
    folder.append(tab, label, title, billNumber, purpose);
    if (billJourneyState.amended) {
      const change = document.createElement("div");
      change.className = "bill-change";
      const changeLabel = document.createElement("strong");
      changeLabel.textContent = "CHANGE ADDED";
      const changeText = document.createElement("p");
      changeText.textContent = proposal.amendment;
      change.append(changeLabel, changeText);
      folder.appendChild(change);
    }
    const stamps = document.createElement("div");
    stamps.className = "bill-stamps";
    billJourneyState.history.forEach(item => {
      const stamp = document.createElement("span");
      stamp.textContent = item.stamp;
      stamps.appendChild(stamp);
    });
    folder.appendChild(stamps);
    return folder;
  }

  function renderBillOutcome() {
    const workspace = document.getElementById("bill-workspace");
    const outcome = billJourneyState.outcome;
    const panel = document.createElement("div");
    panel.className = `bill-outcome ${outcome.law ? "became-law" : "bill-stopped"}`;
    const mark = document.createElement("div");
    mark.className = "bill-outcome-mark";
    mark.setAttribute("aria-hidden", "true");
    mark.textContent = outcome.law ? "LAW" : "STOP";
    const copy = document.createElement("div");
    const eyebrow = document.createElement("p");
    eyebrow.className = "eyebrow";
    eyebrow.textContent = outcome.law ? "THE PROCESS IS COMPLETE" : "THIS BILL’S JOURNEY ENDED";
    const title = document.createElement("h2");
    title.id = "bill-stage-title";
    title.tabIndex = -1;
    title.textContent = outcome.law ? "YOUR BILL BECAME A LAW" : outcome.stamp;
    const result = document.createElement("p");
    result.textContent = outcome.result;
    const truth = document.createElement("p");
    truth.className = "bill-outcome-note";
    truth.textContent = outcome.law
      ? "Every federal law must pass both chambers in the same form. It then needs the president’s signature or a successful veto override."
      : "Stopping is normal. Members of Congress introduce thousands of bills, but only a small share complete every step.";
    const restart = document.createElement("button");
    restart.type = "button";
    restart.className = "primary-action";
    restart.textContent = "TRY ANOTHER BILL";
    restart.addEventListener("click", resetBillJourney);
    copy.append(eyebrow, title, result, truth, restart);
    panel.append(mark, copy);
    workspace.replaceChildren(panel, renderBillFolder());
    renderBillRoute();
    title.focus({ preventScroll: true });
  }

  function renderBillStage() {
    const workspace = document.getElementById("bill-workspace");
    const stage = billJourneyData.stages[billJourneyState.stageIndex];
    const layout = document.createElement("div");
    layout.className = "bill-stage-layout";
    const stageCard = document.createElement("article");
    stageCard.className = `bill-stage bill-stage-${stage.id}`;
    const place = document.createElement("p");
    place.className = "eyebrow";
    if (stage.id === "first-vote" && billJourneyState.chamber) place.textContent = billJourneyState.chamber.toUpperCase();
    else if (stage.id === "second-vote" && billJourneyState.chamber) place.textContent = billJourneyState.chamber === "House" ? "SENATE" : "HOUSE";
    else place.textContent = stage.place;
    const title = document.createElement("h2");
    title.id = "bill-stage-title";
    title.tabIndex = -1;
    title.textContent = stage.title;
    const explanation = document.createElement("p");
    explanation.className = "bill-stage-explanation";
    explanation.textContent = stage.explanation;
    if (stage.id === "committee") {
      const note = document.createElement("div");
      note.className = "bill-hearing-note";
      note.innerHTML = `<strong>CHANGE UNDER DISCUSSION</strong><p>${billJourneyState.proposal.amendment}</p>`;
      stageCard.append(place, title, explanation, note);
    } else if (stage.id === "president") {
      const note = document.createElement("div");
      note.className = "bill-hearing-note";
      note.innerHTML = `<strong>THE PRESIDENT’S CONCERN</strong><p>${billJourneyState.proposal.concern}</p>`;
      stageCard.append(place, title, explanation, note);
    } else {
      stageCard.append(place, title, explanation);
    }
    const prompt = document.createElement("h3");
    prompt.textContent = stage.prompt;
    const choices = document.createElement("div");
    choices.className = "bill-choices";
    const feedback = document.createElement("div");
    feedback.className = "bill-feedback";
    feedback.setAttribute("role", "status");
    feedback.hidden = true;
    const next = document.createElement("button");
    next.type = "button";
    next.className = "explorer-next";
    next.hidden = true;
    next.textContent = "MOVE THE BILL →";

    stage.choices.forEach(choice => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = choice.label;
      button.addEventListener("click", () => {
        choices.querySelectorAll("button").forEach(item => { item.disabled = true; });
        button.dataset.selected = "true";
        if (choice.chamber) billJourneyState.chamber = choice.chamber;
        if (choice.amend) billJourneyState.amended = true;
        billJourneyState.history.push({ id: stage.id, stamp: choice.stamp, conference: Boolean(choice.conference) });
        const stamp = document.createElement("strong");
        stamp.textContent = choice.stamp;
        const result = document.createElement("p");
        result.textContent = choice.result;
        feedback.replaceChildren(stamp, result);
        feedback.hidden = false;
        next.textContent = choice.stop || choice.law ? "SEE THE RESULT →" : "MOVE THE BILL →";
        next.hidden = false;
        next.onclick = () => {
          if (choice.stop || choice.law) {
            billJourneyState.outcome = choice;
            renderBillOutcome();
            return;
          }
          if (stage.id === "second-vote") billJourneyState.stageIndex = choice.conference ? 4 : 5;
          else if (stage.id === "president" && choice.veto) billJourneyState.stageIndex = 6;
          else billJourneyState.stageIndex += 1;
          renderBillJourney();
          document.getElementById("bill-stage-title").focus({ preventScroll: true });
        };
        next.focus();
        renderBillRoute();
      });
      choices.appendChild(button);
    });
    stageCard.append(prompt, choices, feedback, next);
    layout.append(stageCard, renderBillFolder());
    workspace.replaceChildren(layout);
  }

  function renderBillJourney() {
    renderBillRoute();
    const workspace = document.getElementById("bill-workspace");
    if (billJourneyState.outcome) {
      renderBillOutcome();
      return;
    }
    if (billJourneyState.proposal) {
      renderBillStage();
      return;
    }
    const start = document.createElement("div");
    start.className = "bill-start";
    const heading = document.createElement("h2");
    heading.id = "bill-stage-title";
    heading.textContent = "CHOOSE A PROPOSAL";
    const copy = document.createElement("p");
    copy.textContent = "You will guide one idea through the federal lawmaking process.";
    const grid = document.createElement("div");
    grid.className = "bill-proposal-grid";
    billJourneyData.proposals.forEach((proposal, index) => {
      const button = document.createElement("button");
      button.type = "button";
      const number = document.createElement("span");
      number.textContent = String(index + 1).padStart(2, "0");
      const title = document.createElement("strong");
      title.textContent = proposal.title;
      const purpose = document.createElement("p");
      purpose.textContent = proposal.purpose;
      button.append(number, title, purpose);
      button.addEventListener("click", () => {
        billJourneyState.proposal = proposal;
        renderBillJourney();
        document.getElementById("bill-stage-title").focus({ preventScroll: true });
      });
      grid.appendChild(button);
    });
    start.append(heading, copy, grid);
    workspace.replaceChildren(start);
  }

  function renderFoundingPower() {
    const workspace = document.getElementById("founding-power-workspace");
    workspace.replaceChildren();
    const ideals = [
      ["NATURAL RIGHTS", "RIGHTS YOU ARE BORN WITH", "Every person is born with basic rights. Government does not create these rights and should not take them away."],
      ["SOCIAL CONTRACT", "AN AGREEMENT ABOUT POWER", "People agree to live under shared rules. In return, government protects their safety and rights."],
      ["POPULAR SOVEREIGNTY", "POWER BEGINS WITH THE PEOPLE", "The people are the source of government power. Leaders govern only with the people’s consent, or permission."],
      ["LIMITED GOVERNMENT", "GOVERNMENT HAS BOUNDARIES", "Government must follow the Constitution and the law. No leader or branch has unlimited power."]
    ];
    const designs = [
      ["SEPARATION OF POWERS", "DIFFERENT PARTS HAVE DIFFERENT JOBS", "The Constitution gives different responsibilities to Congress, the president, and the courts."],
      ["CHECKS AND BALANCES", "BRANCHES CAN LIMIT ONE ANOTHER", "Each branch can limit actions taken by the other branches. This makes it harder for one branch to control the government."],
      ["FEDERALISM", "POWER IS SHARED ACROSS LEVELS", "The national government and state governments share power. Each level has its own responsibilities."],
      ["REPUBLICANISM", "PEOPLE CHOOSE REPRESENTATIVES", "Voters choose representatives to make laws and govern on their behalf."]
    ];
    const opening = document.createElement("section");
    opening.className = "founding-story-opening";
    opening.innerHTML = "<p class=\"eyebrow\">EUROPE AND THE ATLANTIC WORLD · 1600s</p><h2>IMAGINE YOU LIVE UNDER A KING</h2><p>He rules for life, and most people do not choose him. Laws and taxes come from above. Questioning the ruler can be dangerous. Government is something done to you, not something you expect to control.</p><p>War, religious conflict, trade, and life in new settlements begin to test that system. Writers and political leaders look at the world around them and ask what government is for, where its power comes from, and what should happen when it fails.</p>";

    const story = document.createElement("div");
    story.className = "founding-story";
    let activeStoryIndex = -1;
    const visual = document.createElement("figure");
    visual.className = "founding-story-visual";
    visual.setAttribute("aria-live", "polite");
    const visualMedia = document.createElement("div");
    visualMedia.className = "founding-story-media";
    const visualCaption = document.createElement("figcaption");
    visual.append(visualMedia, visualCaption);
    const chapters = document.createElement("div");
    chapters.className = "founding-story-chapters";

    foundingPowerIdeas.forEach((item, index) => {
      const chapter = document.createElement("section");
      chapter.className = `founding-story-chapter story-type-${index % 3}`;
      chapter.dataset.storyIndex = String(index);
      chapter.tabIndex = 0;
      const question = storyQuestion(item.document);
      const mobileVisual = document.createElement("div");
      mobileVisual.className = "founding-story-mobile-visual";
      appendStoryMedia(mobileVisual, item, index === 0);
      const meta = document.createElement("p");
      meta.className = "eyebrow";
      meta.textContent = `${item.year} · ${item.thinker}`;
      const heading = document.createElement("h2");
      heading.textContent = question;
      const title = document.createElement("h3");
      title.textContent = item.document;
      const excerpt = document.createElement("blockquote");
      excerpt.textContent = item.excerpt;
      const help = document.createElement("p");
      help.className = "founding-word-help";
      help.textContent = item.wordHelp;
      const explanation = document.createElement("p");
      explanation.textContent = item.explanation;
      const connection = document.createElement("p");
      connection.className = "founding-story-connection";
      connection.innerHTML = "<b>WHAT MOVES FORWARD</b>";
      connection.append(document.createTextNode(`This source helps explain ${formatConceptList(item.ideas)}.`));
      const caution = document.createElement("p");
      caution.className = "founding-caution";
      caution.textContent = item.caution || "";
      caution.hidden = !item.caution;
      const source = document.createElement("a");
      source.href = item.source;
      source.target = "_blank";
      source.rel = "noopener";
      source.textContent = `${item.sourceLabel} · VIEW THE SOURCE ↗`;
      chapter.append(mobileVisual, meta, heading, title, excerpt, help, explanation, connection, caution, source);
      chapter.addEventListener("focus", () => activateChapter(index));
      chapters.appendChild(chapter);
    });
    story.append(visual, chapters);

    const conclusion = document.createElement("section");
    conclusion.className = "founding-story-conclusion";
    conclusion.innerHTML = "<p class=\"eyebrow\">THE REVOLUTION CHANGES THE QUESTION</p><h2>POWER NOW HAS TO EXPLAIN ITSELF</h2><p>The Declaration uses these ideas to defend independence. The Constitution then tries to build a government strong enough to act but divided enough to control. The result is not perfect trust. It is a set of standards people can use to judge government.</p>";
    const framework = document.createElement("div");
    framework.className = "founding-story-framework";
    const idealColumn = document.createElement("section");
    idealColumn.className = "founding-column founding-ideals";
    idealColumn.innerHTML = "<h2>DEMOCRATIC IDEALS</h2>";
    ideals.forEach(([name, bridge, definition]) => {
      const card = document.createElement("article");
      card.innerHTML = `<h3>${name}</h3><span>${bridge}</span><p>${definition}</p>`;
      idealColumn.appendChild(card);
    });
    const designColumn = document.createElement("section");
    designColumn.className = "founding-column founding-designs";
    designColumn.innerHTML = "<h2>HOW POWER IS LIMITED</h2>";
    designs.forEach(([name, bridge, definition]) => {
      const card = document.createElement("article");
      card.innerHTML = `<h3>${name}</h3><span>${bridge}</span><p>${definition}</p>`;
      designColumn.appendChild(card);
    });
    framework.append(idealColumn, designColumn);
    conclusion.appendChild(framework);
    workspace.append(opening, story, conclusion);

    function activateChapter(index) {
      if (index === activeStoryIndex) return;
      activeStoryIndex = index;
      chapters.querySelectorAll(".founding-story-chapter").forEach((chapter, chapterIndex) => {
        chapter.dataset.active = String(chapterIndex === index);
      });
      const item = foundingPowerIdeas[index];
      visualMedia.replaceChildren();
      appendStoryMedia(visualMedia, item, true);
      visualCaption.textContent = `${item.thinker} · ${item.year} · ${item.document}`;
    }
    activateChapter(0);

    if ("IntersectionObserver" in window) {
      const updateVisibleChapter = () => {
        const screenCenter = window.innerHeight * .5;
        const nearest = Array.from(chapters.querySelectorAll(".founding-story-chapter")).reduce((best, chapter) => {
          const bounds = chapter.getBoundingClientRect();
          const distance = Math.abs((bounds.top + bounds.height / 2) - screenCenter);
          return !best || distance < best.distance ? { chapter, distance } : best;
        }, null);
        if (nearest) activateChapter(Number(nearest.chapter.dataset.storyIndex));
      };
      let storyScrollFrame = 0;
      const observer = new IntersectionObserver(updateVisibleChapter, { rootMargin: "-28% 0px -42% 0px", threshold: [0.1, 0.35, 0.65] });
      chapters.querySelectorAll(".founding-story-chapter").forEach(chapter => observer.observe(chapter));
      window.addEventListener("scroll", () => {
        if (storyScrollFrame) return;
        storyScrollFrame = requestAnimationFrame(() => {
          storyScrollFrame = 0;
          updateVisibleChapter();
        });
      }, { passive: true });
    }

    function appendStoryMedia(container, item, eager) {
      if (item.image) {
        const image = document.createElement("img");
        image.src = item.image;
        image.alt = item.imageAlt;
        image.loading = eager ? "eager" : "lazy";
        container.appendChild(image);
        return;
      }
      const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      icon.setAttribute("viewBox", "0 0 160 120");
      icon.setAttribute("role", "img");
      icon.setAttribute("aria-label", item.iconAlt);
      const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
      use.setAttribute("href", `assets/foundations/founding-power-icons.svg#${item.icon}`);
      icon.appendChild(use);
      container.appendChild(icon);
    }

    function storyQuestion(documentName) {
      const questions = {
        "MAYFLOWER COMPACT": "CAN PEOPLE CREATE GOVERNMENT BY AGREEMENT?",
        "LEVIATHAN": "WHAT HAPPENS WHEN NO POWER CAN ENFORCE THE RULES?",
        "SECOND TREATISE OF GOVERNMENT": "WHAT DOES GOVERNMENT OWE THE PEOPLE?",
        "THE SPIRIT OF THE LAWS": "HOW CAN POWER BE KEPT FROM ONE SET OF HANDS?",
        "DECLARATION OF INDEPENDENCE": "WHEN MAY PEOPLE REJECT THEIR GOVERNMENT?",
        "UNITED STATES CONSTITUTION": "HOW DO YOU BUILD POWER AND STILL LIMIT IT?",
        "FEDERALIST NOS. 39 AND 51": "HOW CAN GOVERNMENT CONTROL ITSELF?"
      };
      return questions[documentName];
    }

    function formatConceptList(items) {
      const readable = items.map(item => item.toLowerCase());
      if (readable.length === 1) return readable[0];
      if (readable.length === 2) return `${readable[0]} and ${readable[1]}`;
      return `${readable.slice(0, -1).join(", ")}, and ${readable.at(-1)}`;
    }
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
    document.getElementById("exit-question").textContent = siteContent.exitQuestion || "NO EXIT TICKET TODAY.";
    const classroom = document.getElementById("classroom-link");
    classroom.href = siteContent.classroomUrl || "https://classroom.google.com/";
    const agendaTitle = (siteContent.agendaTitle || "AGENDA").trim();
    document.getElementById("agenda-page-title").textContent = agendaTitle;
    document.getElementById("agenda-nav-link").textContent = agendaTitle;
    document.getElementById("agenda-page-text").textContent = siteContent.agendaText || "";
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

  function renderAgendaDate() {
    const nowParts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Los_Angeles",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    }).formatToParts(new Date());
    const part = type => nowParts.find(item => item.type === type)?.value || "";
    const year = Number(part("year"));
    const monthName = part("month");
    const monthIndex = new Date(`${monthName} 1, 2000`).getMonth();
    const day = Number(part("day"));
    const weekday = part("weekday");
    const todayUtc = Date.UTC(year, monthIndex, day);
    const electionUtc = Date.UTC(2026, 10, 3);
    const daysUntil = Math.max(0, Math.round((electionUtc - todayUtc) / 86400000));
    document.getElementById("agenda-weekday").textContent = weekday;
    const dateElement = document.getElementById("agenda-date");
    dateElement.textContent = `${monthName} ${day}`;
    dateElement.dateTime = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    document.getElementById("election-count").textContent = daysUntil;
    const label = document.getElementById("election-count-label");
    label.textContent = todayUtc === electionUtc ? "ELECTION DAY" : todayUtc > electionUtc ? "THE 2026 MIDTERM ELECTIONS HAVE PASSED" : `DAY${daysUntil === 1 ? "" : "S"} UNTIL THE MIDTERM ELECTIONS`;
    const progress = Math.max(0, Math.min(100, 100 - daysUntil));
    const progressElement = document.getElementById("election-progress");
    progressElement.setAttribute("aria-valuenow", String(progress));
    progressElement.setAttribute("aria-valuetext", `${daysUntil} days until the 2026 midterm elections`);
    document.getElementById("election-progress-fill").style.width = `${progress}%`;
  }

  function renderPortraitRain() {
    const portraits = [
      "george-washington.jpg",
      "abraham-lincoln.jpg",
      "theodore-roosevelt.jpg",
      "franklin-d-roosevelt.jpg",
      "dwight-d-eisenhower.jpg",
      "john-f-kennedy.jpg",
      "ronald-reagan.jpg",
      "barack-obama.jpg",
      "george-washington.jpg",
      "abraham-lincoln.jpg"
    ];
    const positions = [4, 17, 31, 46, 61, 76, 89, 11, 54, 83];
    const sizes = [118, 92, 134, 104, 126, 88, 112, 138, 82, 102];
    document.querySelectorAll("#home, .agenda-view").forEach(view => {
      const layer = document.createElement("div");
      layer.className = "portrait-rain";
      layer.setAttribute("aria-hidden", "true");
      portraits.forEach((portrait, index) => {
        const cameo = document.createElement("span");
        cameo.style.setProperty("--portrait", `url("assets/presidents/${portrait}")`);
        cameo.style.setProperty("--left", `${positions[index]}%`);
        cameo.style.setProperty("--size", `${sizes[index]}px`);
        cameo.style.setProperty("--duration", `${27 + (index % 4) * 5}s`);
        cameo.style.setProperty("--delay", `${-index * 4.3}s`);
        cameo.style.setProperty("--rest", `${8 + index * 9}vh`);
        layer.appendChild(cameo);
      });
      view.prepend(layer);
    });
  }

  async function loadConfig() {
    try {
      const response = await fetch("site-content.json", { cache: "no-store" });
      if (!response.ok) throw new Error("Site content unavailable");
      siteContent = await response.json();
      const local = localStorage.getItem(CONTENT_STORAGE_KEY);
      if (local) {
        const preview = JSON.parse(local);
        const previewAssignmentUrls = { ...(preview.assignmentUrls || {}) };
        const oldClassroomUrl = "https://classroom.google.com/c/ODcxMDI4ODY2NDUy";
        if (preview.classroomUrl === oldClassroomUrl) delete preview.classroomUrl;
        if (previewAssignmentUrls.classroom === oldClassroomUrl) delete previewAssignmentUrls.classroom;
        if (previewAssignmentUrls["course-site"] === "#home") delete previewAssignmentUrls["course-site"];
        if (previewAssignmentUrls["presidential-yearbook"] === "#presidents") {
          delete previewAssignmentUrls["presidential-yearbook"];
        }
        siteContent = {
          ...siteContent,
          ...preview,
          foundationUnlocks: { ...(siteContent.foundationUnlocks || {}), ...(preview.foundationUnlocks || {}) },
          assignmentUnlocks: { ...(siteContent.assignmentUnlocks || {}), ...(preview.assignmentUnlocks || {}) },
          assignmentUrls: { ...(siteContent.assignmentUrls || {}), ...previewAssignmentUrls },
          unitUnlocks: { ...(siteContent.unitUnlocks || {}), ...(preview.unitUnlocks || {}) }
        };
      }
      siteContent.foundationUnlocks = siteContent.foundationUnlocks || { source: 3, argument: 3, language: 3 };
      siteContent.assignmentUnlocks = siteContent.assignmentUnlocks || {};
      siteContent.assignmentUrls = siteContent.assignmentUrls || {};
      siteContent.unitUnlocks = siteContent.unitUnlocks || {};
      if (data.units.some(unit => unit.id === siteContent.currentUnit)) currentUnitId = siteContent.currentUnit;
      if (!data.words.some(word => word[4] === currentUnitId)) glossaryFilter = "all";
    } catch (error) {
      console.warn("Using default course content.", error);
    }
    const current = data.units.find(unit => unit.id === currentUnitId);
    document.getElementById("current-unit-number").textContent = `${current.number} · PRINCIPLES OF AMERICAN DEMOCRACY`;
    document.getElementById("now-title").textContent = current.title.toUpperCase();
    document.getElementById("current-action").href = `#${current.id}`;
    document.getElementById("current-action").firstChild.textContent = `OPEN ${current.number.toUpperCase()} `;
    renderSiteContent();
    renderAgendaDate();
    renderUnits();
    renderWords();
    renderAmendments();
    renderSkills();
    route();
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
    const historyConnection = plainHistoryConnection(event.ap_connection || "");
    document.getElementById("history-connection").textContent = historyConnection ? `WHY IT MATTERS: ${historyConnection}` : "";
    const source = document.getElementById("history-source");
    if (event.source_url) {
      source.href = event.source_url;
      source.textContent = `${event.source_label || "SOURCE"} ↗`;
      source.hidden = false;
    } else {
      source.hidden = true;
    }
  }

  function plainHistoryConnection(connection) {
    const replacements = new Map([
      ["constitutional foundations", "the Constitution"],
      ["founding ideals", "ideas behind American government"],
      ["national policymaking", "how national policy is made"],
      ["agenda setting", "choosing which issues government acts on"],
      ["linkage institutions", "groups that connect people and government"],
      ["federal bureaucracy", "federal agencies"],
      ["implementation", "putting policy into action"],
      ["administrative power", "power of government agencies"],
      ["american political development", "how American government changed"],
      ["institutions", "government institutions"],
      ["selective incorporation", "applying Bill of Rights protections to states"],
      ["continuity of government", "keeping government working during a crisis"],
      ["collective action", "people working together"],
      ["political culture", "public beliefs about government"],
      ["suffrage", "voting rights"]
    ]);
    return connection
      .split(";")
      .map(item => item.trim())
      .filter(item => item && !/^Unit \d+$/i.test(item))
      .map(item => replacements.get(item.toLowerCase()) || item)
      .join(" · ");
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
    document.getElementById("admin-current-unit").onchange = event => {
      document.querySelectorAll("[data-unit-unlock]").forEach(checkbox => {
        const isCurrent = checkbox.dataset.unitUnlock === event.target.value;
        checkbox.disabled = isCurrent;
        if (isCurrent) checkbox.checked = true;
        const label = checkbox.nextElementSibling;
        const unit = data.units.find(item => item.id === checkbox.dataset.unitUnlock);
        label.textContent = `${unit.number.toUpperCase()} · ${unit.title.toUpperCase()}${isCurrent ? " · CURRENT" : ""}`;
      });
    };
    document.getElementById("admin-exit-question").value = siteContent.exitQuestion || "";
    document.getElementById("admin-classroom-link").value = siteContent.classroomUrl || "";
    document.getElementById("admin-agenda-title").value = siteContent.agendaTitle || "AGENDA";
    document.getElementById("admin-agenda-text").value = siteContent.agendaText || "";
    const unitUnlockContainer = document.getElementById("admin-unit-unlocks");
    unitUnlockContainer.replaceChildren();
    data.units.forEach(unit => {
      const row = document.createElement("label");
      row.className = "admin-unlock-row admin-unit-unlock-row";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.dataset.unitUnlock = unit.id;
      checkbox.checked = unit.id === currentUnitId || Boolean(siteContent.unitUnlocks?.[unit.id]);
      checkbox.disabled = unit.id === currentUnitId;
      const labelText = document.createElement("span");
      labelText.textContent = `${unit.number.toUpperCase()} · ${unit.title.toUpperCase()}${unit.id === currentUnitId ? " · CURRENT" : ""}`;
      row.append(checkbox, labelText);
      unitUnlockContainer.appendChild(row);
    });
    document.getElementById("admin-upcoming").replaceChildren();
    (siteContent.upcoming || []).forEach(addAdminUpcoming);
    const assignmentUnlockContainer = document.getElementById("admin-assignment-unlocks");
    assignmentUnlockContainer.replaceChildren();
    data.units.flatMap(unit => unit.resources || []).forEach(resource => {
      const row = document.createElement("div");
      row.className = "admin-unlock-row admin-assignment-unlock-row";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.dataset.assignmentUnlock = resource.id;
      const currentUrl = siteContent.assignmentUrls?.[resource.id] ?? resource.url;
      checkbox.checked = Boolean(currentUrl && siteContent.assignmentUnlocks?.[resource.id]);
      const labelText = document.createElement("span");
      labelText.textContent = resource.title;
      const urlInput = document.createElement("input");
      urlInput.type = "text";
      urlInput.inputMode = "url";
      urlInput.placeholder = "PASTE A LINK OR USE #PAGE-NAME";
      urlInput.value = currentUrl || "";
      urlInput.dataset.assignmentUrl = resource.id;
      checkbox.disabled = !currentUrl;
      urlInput.addEventListener("input", () => {
        checkbox.disabled = !urlInput.value.trim();
        if (checkbox.disabled) checkbox.checked = false;
      });
      row.append(checkbox, labelText, urlInput);
      assignmentUnlockContainer.appendChild(row);
    });
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
    document.getElementById("admin-github-token").value = "";
    renderGitHubConnection();
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
    const assignmentUnlocks = {};
    document.querySelectorAll("[data-assignment-unlock]").forEach(checkbox => {
      assignmentUnlocks[checkbox.dataset.assignmentUnlock] = checkbox.checked && !checkbox.disabled;
    });
    const assignmentUrls = {};
    document.querySelectorAll("[data-assignment-url]").forEach(input => {
      assignmentUrls[input.dataset.assignmentUrl] = input.value.trim();
    });
    const unitUnlocks = {};
    document.querySelectorAll("[data-unit-unlock]").forEach(checkbox => {
      unitUnlocks[checkbox.dataset.unitUnlock] = checkbox.checked || checkbox.dataset.unitUnlock === document.getElementById("admin-current-unit").value;
    });
    return {
      currentUnit: document.getElementById("admin-current-unit").value,
      unitUnlocks,
      exitQuestion: document.getElementById("admin-exit-question").value.trim(),
      upcoming,
      classroomUrl: document.getElementById("admin-classroom-link").value.trim(),
      agendaTitle: document.getElementById("admin-agenda-title").value.trim().toUpperCase() || "AGENDA",
      agendaText: document.getElementById("admin-agenda-text").value.trim(),
      assignmentUnlocks,
      assignmentUrls,
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

  function renderGitHubConnection(message = "") {
    const connected = Boolean(localStorage.getItem(GITHUB_TOKEN_STORAGE_KEY));
    const status = document.getElementById("admin-connection-status");
    status.textContent = message || (connected ? "GITHUB CONNECTED ON THIS DEVICE." : "GITHUB IS NOT CONNECTED.");
    status.dataset.connected = String(connected);
    document.getElementById("admin-token-remove").disabled = !connected;
    document.getElementById("admin-publish").disabled = !connected;
    document.getElementById("admin-github-token").placeholder = connected ? "TOKEN SAVED ON THIS DEVICE" : "PASTE TOKEN";
  }

  function encodeBase64(text) {
    const bytes = new TextEncoder().encode(text);
    let binary = "";
    bytes.forEach(byte => { binary += String.fromCharCode(byte); });
    return btoa(binary);
  }

  async function publishAdminContent() {
    const token = localStorage.getItem(GITHUB_TOKEN_STORAGE_KEY);
    if (!token) {
      renderGitHubConnection("ADD AND SAVE A GITHUB TOKEN FIRST.");
      document.getElementById("admin-github-token").focus();
      return;
    }
    const publishButton = document.getElementById("admin-publish");
    const status = document.getElementById("admin-status");
    publishButton.disabled = true;
    publishButton.textContent = "PUBLISHING…";
    status.textContent = "CONNECTING TO GITHUB…";
    try {
      const headers = {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2026-03-10"
      };
      const currentResponse = await fetch(`${GITHUB_CONTENT_URL}?ref=main`, { headers, cache: "no-store" });
      if (!currentResponse.ok) {
        if (currentResponse.status === 401) throw new Error("TOKEN NOT ACCEPTED. CHECK OR REPLACE THE SAVED TOKEN.");
        if (currentResponse.status === 403) throw new Error("TOKEN NEEDS CONTENTS: READ AND WRITE ACCESS TO THE GOV REPOSITORY.");
        throw new Error(`GITHUB COULD NOT READ THE SETTINGS FILE (${currentResponse.status}).`);
      }
      const currentFile = await currentResponse.json();
      const nextContent = buildAdminContent();
      const output = `${JSON.stringify(nextContent, null, 2)}\n`;
      const updateResponse = await fetch(GITHUB_CONTENT_URL, {
        method: "PUT",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "Update course settings",
          content: encodeBase64(output),
          sha: currentFile.sha,
          branch: "main"
        })
      });
      if (!updateResponse.ok) {
        if (updateResponse.status === 401) throw new Error("TOKEN NOT ACCEPTED. CHECK OR REPLACE THE SAVED TOKEN.");
        if (updateResponse.status === 403) throw new Error("TOKEN NEEDS CONTENTS: READ AND WRITE ACCESS TO THE GOV REPOSITORY.");
        if (updateResponse.status === 409) throw new Error("THE SETTINGS CHANGED ON GITHUB. RESET TO LIVE, REOPEN DEV MODE, AND TRY AGAIN.");
        throw new Error(`GITHUB COULD NOT PUBLISH THE SETTINGS (${updateResponse.status}).`);
      }
      siteContent = nextContent;
      currentUnitId = siteContent.currentUnit;
      localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(siteContent));
      status.textContent = "PUBLISHED. GITHUB PAGES SHOULD UPDATE IN ABOUT A MINUTE.";
      loadConfig();
    } catch (error) {
      status.textContent = error.message || "THE SETTINGS COULD NOT BE PUBLISHED.";
    } finally {
      publishButton.textContent = "SAVE & PUBLISH";
      publishButton.disabled = !localStorage.getItem(GITHUB_TOKEN_STORAGE_KEY);
    }
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
  document.getElementById("admin-save-preview").addEventListener("click", saveAdminPreview);
  document.getElementById("admin-publish").addEventListener("click", publishAdminContent);
  document.getElementById("admin-token-save").addEventListener("click", () => {
    const tokenInput = document.getElementById("admin-github-token");
    const token = tokenInput.value.trim();
    if (!token) {
      renderGitHubConnection("PASTE A TOKEN BEFORE SAVING.");
      tokenInput.focus();
      return;
    }
    localStorage.setItem(GITHUB_TOKEN_STORAGE_KEY, token);
    tokenInput.value = "";
    renderGitHubConnection("TOKEN SAVED. SAVE & PUBLISH IS READY.");
  });
  document.getElementById("admin-token-remove").addEventListener("click", () => {
    localStorage.removeItem(GITHUB_TOKEN_STORAGE_KEY);
    document.getElementById("admin-github-token").value = "";
    renderGitHubConnection("TOKEN REMOVED FROM THIS DEVICE.");
  });
  document.getElementById("admin-reset").addEventListener("click", () => {
    localStorage.removeItem(CONTENT_STORAGE_KEY);
    location.reload();
  });
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
  document.getElementById("president-search").addEventListener("input", event => {
    presidentQuery = event.target.value.trim().toLowerCase();
    renderPresidents();
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
  window.setInterval(renderAgendaDate, 60000);

  renderWords();
  renderDocuments();
  renderMadison();
  renderExplorer();
  renderRightsReferee();
  renderPresidentialPower();
  renderBillJourney();
  renderFederalismMap();
  renderFoundingPower();
  renderElection2026();
  renderPortraitRain();
  loadConfig();
  loadHistory();
  loadPresidentFacts();
})();
