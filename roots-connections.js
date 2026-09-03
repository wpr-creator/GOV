(() => {
  "use strict";
  const data = window.ROOTS_CONNECTIONS_DATA;
  const storageKey = "gov-roots-connections-v2";
  const picker = document.getElementById("root-picker");
  const rootButtons = document.getElementById("root-buttons");
  const workspace = document.getElementById("workspace");
  const finish = document.getElementById("finish");
  const idealOptions = document.getElementById("ideal-options");
  const idealFeedback = document.getElementById("ideal-feedback");
  const matchedIdeals = document.getElementById("matched-ideals");
  const usStation = document.getElementById("us-station");
  const nextRootButton = document.getElementById("next-root");
  let state = loadState();
  let activeIndex = 0;
  let roundIndex = 0;
  let matched = [];

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
      return { completed: Array.isArray(saved.completed) ? saved.completed.filter(id => data.roots.some(root => root.id === id)) : [] };
    } catch (error) {
      return { completed: [] };
    }
  }

  function saveState() {
    try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch (error) { console.warn("Practice progress could not be saved.", error); }
  }

  function renderPicker() {
    rootButtons.replaceChildren();
    data.roots.forEach((root, index) => {
      const complete = state.completed.includes(root.id);
      const button = document.createElement("button");
      button.type = "button";
      button.className = `root-button${complete ? " complete" : ""}`;
      button.innerHTML = `<span class="picker-symbol" aria-hidden="true"></span><span class="picker-copy"><small></small><strong></strong><em></em></span>`;
      button.querySelector(".picker-symbol").textContent = root.symbol;
      button.querySelector("small").textContent = `ROOT ${index + 1}`;
      button.querySelector("strong").textContent = root.name;
      button.querySelector("em").textContent = complete ? "★ CONNECTION COMPLETE" : "PRACTICE THIS ROOT →";
      button.addEventListener("click", () => startRoot(index));
      rootButtons.append(button);
    });
    document.getElementById("overall-progress").textContent = `${state.completed.length} OF ${data.roots.length} COMPLETE`;
  }

  function startRoot(index) {
    activeIndex = index;
    roundIndex = 0;
    matched = [];
    picker.hidden = true;
    finish.hidden = true;
    workspace.hidden = false;
    usStation.hidden = true;
    const root = data.roots[activeIndex];
    document.getElementById("root-number").textContent = `ROOT ${activeIndex + 1} OF ${data.roots.length}`;
    document.getElementById("root-symbol").textContent = root.symbol;
    document.getElementById("root-name").textContent = root.name;
    document.getElementById("us-meaning").textContent = root.usMeaning;
    renderRound();
    workspace.scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth", block: "start" });
  }

  function renderRound() {
    const root = data.roots[activeIndex];
    const round = root.rounds[roundIndex];
    idealFeedback.hidden = true;
    document.getElementById("round-help").textContent = round.clue;
    idealOptions.replaceChildren();
    round.options.forEach(idealName => {
      const ideal = data.ideals[idealName];
      const button = document.createElement("button");
      button.type = "button";
      button.className = "ideal-option";
      button.innerHTML = `<span aria-hidden="true"></span><strong></strong><small></small>`;
      button.querySelector("span").textContent = ideal.symbol;
      button.querySelector("strong").textContent = idealName;
      button.querySelector("small").textContent = ideal.meaning;
      button.addEventListener("click", () => checkIdeal(button, idealName, round.answer));
      idealOptions.append(button);
    });
    renderMatched();
  }

  function checkIdeal(button, selected, answer) {
    const ideal = data.ideals[answer];
    if (selected !== answer) {
      button.classList.add("wrong");
      button.disabled = true;
      idealFeedback.className = "feedback try-again";
      idealFeedback.innerHTML = `<b>TRY AGAIN</b>Read the historical clue again. Which ideal expresses the same idea?`;
      idealFeedback.hidden = false;
      return;
    }
    matched.push(answer);
    idealOptions.querySelectorAll("button").forEach(option => { option.disabled = true; });
    button.classList.add("correct");
    idealFeedback.className = "feedback correct";
    idealFeedback.innerHTML = `<b>CONNECTED</b>${ideal.symbol} ${answer}: ${ideal.meaning}`;
    idealFeedback.hidden = false;
    renderMatched();
    const root = data.roots[activeIndex];
    if (roundIndex < root.rounds.length - 1) {
      roundIndex += 1;
      renderRound();
      document.getElementById("ideals-title").scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth", block: "center" });
      return;
    }
    completeRoot();
  }

  function renderMatched() {
    matchedIdeals.replaceChildren();
    const root = data.roots[activeIndex];
    matched.forEach((idealName, index) => {
      const badge = document.createElement("div");
      badge.className = "completed-connection";
      badge.innerHTML = `<span class="completed-clue"></span><b aria-hidden="true">→</b><span class="completed-ideal"><i aria-hidden="true"></i><strong></strong><small></small></span>`;
      badge.querySelector(".completed-clue").textContent = root.rounds[index].clue;
      badge.querySelector("i").textContent = data.ideals[idealName].symbol;
      badge.querySelector("strong").textContent = idealName;
      badge.querySelector("small").textContent = data.ideals[idealName].meaning;
      matchedIdeals.append(badge);
    });
  }

  function completeRoot() {
    const root = data.roots[activeIndex];
    if (!state.completed.includes(root.id)) state.completed.push(root.id);
    saveState();
    renderPicker();
    usStation.hidden = false;
    nextRootButton.textContent = state.completed.length === data.roots.length ? "SEE MY RESULTS →" : "NEXT ROOT →";
    usStation.scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth", block: "start" });
    nextRootButton.focus();
  }

  function showPicker() {
    workspace.hidden = true;
    finish.hidden = true;
    picker.hidden = false;
    picker.scrollIntoView({ behavior: "auto", block: "start" });
  }

  function goNextRoot() {
    if (state.completed.length === data.roots.length) {
      workspace.hidden = true;
      picker.hidden = true;
      finish.hidden = false;
      finish.scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth", block: "start" });
      return;
    }
    const nextIncomplete = data.roots.findIndex((root, index) => index > activeIndex && !state.completed.includes(root.id));
    const anyIncomplete = data.roots.findIndex(root => !state.completed.includes(root.id));
    startRoot(nextIncomplete >= 0 ? nextIncomplete : anyIncomplete);
  }

  function reduceMotion() { return matchMedia("(prefers-reduced-motion: reduce)").matches; }

  nextRootButton.addEventListener("click", goNextRoot);
  document.getElementById("back-roots").addEventListener("click", showPicker);
  document.getElementById("review-again").addEventListener("click", showPicker);
  document.getElementById("reset-progress").addEventListener("click", () => { state = { completed: [] }; saveState(); renderPicker(); showPicker(); });

  renderPicker();
})();
