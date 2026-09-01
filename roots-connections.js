(() => {
  "use strict";
  const data = window.ROOTS_CONNECTIONS_DATA;
  const storageKey = "gov-roots-connections-v1";
  const picker = document.getElementById("root-picker");
  const rootButtons = document.getElementById("root-buttons");
  const workspace = document.getElementById("workspace");
  const finish = document.getElementById("finish");
  const idealOptions = document.getElementById("ideal-options");
  const idealFeedback = document.getElementById("ideal-feedback");
  const usStation = document.getElementById("us-station");
  const phraseBank = document.getElementById("phrase-bank");
  const connectionSlots = document.getElementById("connection-slots");
  const connectionFeedback = document.getElementById("connection-feedback");
  const checkIdealsButton = document.getElementById("check-ideals");
  const checkConnectionButton = document.getElementById("check-connection");
  const undoButton = document.getElementById("undo-tile");
  const nextButton = document.getElementById("next-root");
  let state = loadState();
  let activeIndex = 0;
  let selectedIdeals = new Set();
  let selectedParts = [];

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
      button.innerHTML = `<span></span><strong></strong><small></small>`;
      button.querySelector("span").textContent = `ROOT ${index + 1}`;
      button.querySelector("strong").textContent = root.name;
      button.querySelector("small").textContent = complete ? "★ CONNECTION COMPLETE" : "BUILD THIS CONNECTION →";
      button.addEventListener("click", () => startRoot(index));
      rootButtons.append(button);
    });
    document.getElementById("overall-progress").textContent = `${state.completed.length} OF ${data.roots.length} COMPLETE`;
  }

  function startRoot(index) {
    activeIndex = index;
    selectedIdeals = new Set();
    selectedParts = [];
    picker.hidden = true;
    finish.hidden = true;
    workspace.hidden = false;
    const root = data.roots[activeIndex];
    document.getElementById("root-number").textContent = `ROOT ${activeIndex + 1} OF ${data.roots.length}`;
    document.getElementById("root-name").textContent = root.name;
    document.getElementById("root-idea").textContent = root.rootIdea;
    idealFeedback.hidden = true;
    connectionFeedback.hidden = true;
    usStation.hidden = true;
    nextButton.hidden = true;
    checkIdealsButton.disabled = true;
    renderIdealOptions();
    renderConnection();
    workspace.scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth", block: "start" });
  }

  function renderIdealOptions() {
    idealOptions.replaceChildren();
    data.ideals.forEach(ideal => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "ideal-option";
      button.textContent = ideal;
      button.setAttribute("aria-pressed", String(selectedIdeals.has(ideal)));
      button.addEventListener("click", () => {
        if (selectedIdeals.has(ideal)) selectedIdeals.delete(ideal); else selectedIdeals.add(ideal);
        button.setAttribute("aria-pressed", String(selectedIdeals.has(ideal)));
        checkIdealsButton.disabled = selectedIdeals.size === 0;
        idealFeedback.hidden = true;
      });
      idealOptions.append(button);
    });
  }

  function checkIdeals() {
    const root = data.roots[activeIndex];
    const selected = [...selectedIdeals].sort().join("|");
    const correct = [...root.ideals].sort().join("|");
    idealFeedback.hidden = false;
    if (selected !== correct) {
      idealFeedback.className = "feedback try-again";
      idealFeedback.innerHTML = "<b>NOT YET</b>Check the root reminder. Add or remove an ideal, then try again.";
      return;
    }
    idealFeedback.className = "feedback correct";
    idealFeedback.innerHTML = `<b>IDEALS CONNECTED</b>${root.ideals.join(" · ")}`;
    idealOptions.querySelectorAll("button").forEach(button => { button.disabled = true; });
    checkIdealsButton.disabled = true;
    usStation.hidden = false;
    renderConnection();
    usStation.scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth", block: "start" });
  }

  function renderConnection() {
    const root = data.roots[activeIndex];
    connectionSlots.replaceChildren();
    for (let index = 0; index < root.usParts.length; index += 1) {
      const slot = document.createElement("div");
      slot.className = `connection-slot${selectedParts[index] === undefined ? " empty" : ""}`;
      slot.innerHTML = `<span>${index + 1}</span><p></p>`;
      slot.querySelector("p").textContent = selectedParts[index] === undefined ? "Choose a phrase tile" : root.usParts[selectedParts[index]];
      connectionSlots.append(slot);
    }
    phraseBank.replaceChildren();
    root.tileOrder.forEach(partIndex => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = root.usParts[partIndex];
      button.disabled = selectedParts.includes(partIndex);
      button.addEventListener("click", () => {
        if (selectedParts.length >= root.usParts.length) return;
        selectedParts.push(partIndex);
        connectionFeedback.hidden = true;
        renderConnection();
      });
      phraseBank.append(button);
    });
    undoButton.disabled = selectedParts.length === 0;
    checkConnectionButton.disabled = selectedParts.length !== root.usParts.length;
  }

  function checkConnection() {
    const root = data.roots[activeIndex];
    const correct = selectedParts.every((partIndex, index) => partIndex === index);
    connectionFeedback.hidden = false;
    if (!correct) {
      connectionFeedback.className = "feedback try-again";
      connectionFeedback.innerHTML = "<b>TRY A DIFFERENT ORDER</b>Read the statement aloud. Undo tiles until the sentence begins clearly.";
      return;
    }
    connectionFeedback.className = "feedback correct";
    connectionFeedback.innerHTML = `<b>CONNECTION BUILT</b>${root.usParts.join(" ")}`;
    phraseBank.querySelectorAll("button").forEach(button => { button.disabled = true; });
    checkConnectionButton.disabled = true;
    undoButton.disabled = true;
    if (!state.completed.includes(root.id)) state.completed.push(root.id);
    saveState();
    renderPicker();
    nextButton.textContent = state.completed.length === data.roots.length ? "SEE MY RESULTS →" : "NEXT ROOT →";
    nextButton.hidden = false;
    nextButton.focus();
  }

  function showPicker() {
    workspace.hidden = true;
    finish.hidden = true;
    picker.hidden = false;
    picker.scrollIntoView({ behavior: "auto", block: "start" });
  }

  function goNext() {
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

  checkIdealsButton.addEventListener("click", checkIdeals);
  checkConnectionButton.addEventListener("click", checkConnection);
  undoButton.addEventListener("click", () => { selectedParts.pop(); connectionFeedback.hidden = true; renderConnection(); });
  nextButton.addEventListener("click", goNext);
  document.getElementById("back-roots").addEventListener("click", showPicker);
  document.getElementById("review-again").addEventListener("click", showPicker);
  document.getElementById("reset-progress").addEventListener("click", () => {
    state = { completed: [] };
    saveState();
    renderPicker();
    showPicker();
  });

  renderPicker();
})();
