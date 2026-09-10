(() => {
  "use strict";
  const checkpoints = window.HISTORY_REVIEW_DATA.checkpoints;
  const storageKey = "gov-history-review-v1";
  const select = document.getElementById("checkpoint-select");
  const grid = document.getElementById("checkpoint-grid");
  const workspace = document.getElementById("workspace");
  const finish = document.getElementById("finish");
  const answers = document.getElementById("answers");
  const feedback = document.getElementById("feedback");
  const nextButton = document.getElementById("next-button");
  let completed = loadProgress();
  let active = null;
  let questionIndex = 0;
  let answered = false;
  let selectedSortItem = null;

  function loadProgress() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
      return Array.isArray(saved) ? saved.filter(id => checkpoints.some(checkpoint => checkpoint.id === id)) : [];
    } catch (error) {
      return [];
    }
  }

  function saveProgress() {
    try { localStorage.setItem(storageKey, JSON.stringify(completed)); }
    catch (error) { console.warn("History review progress could not be saved.", error); }
  }

  function renderProgress() {
    const stars = document.getElementById("stars");
    stars.replaceChildren();
    checkpoints.forEach(checkpoint => {
      const earned = completed.includes(checkpoint.id);
      const star = document.createElement("div");
      star.className = `star${earned ? " earned" : ""}`;
      star.innerHTML = `<span aria-hidden="true">${earned ? "★" : "☆"}</span><small></small>`;
      star.querySelector("small").textContent = checkpoint.number;
      star.setAttribute("aria-label", `${checkpoint.title}: ${earned ? "complete" : "not complete"}`);
      stars.append(star);
    });
    document.getElementById("progress-status").textContent = `${completed.length} OF 6 COMPLETE`;
  }

  function renderCheckpoints() {
    grid.replaceChildren();
    checkpoints.forEach(checkpoint => {
      const complete = completed.includes(checkpoint.id);
      const button = document.createElement("button");
      button.type = "button";
      button.className = `checkpoint${complete ? " complete" : ""}`;
      button.innerHTML = `<span class="number"></span><strong></strong><p></p><small></small>`;
      button.querySelector(".number").textContent = checkpoint.number;
      button.querySelector("strong").textContent = checkpoint.title;
      button.querySelector("p").textContent = checkpoint.question;
      button.querySelector("small").textContent = complete ? "★ COMPLETE" : (checkpoint.sort ? "SORTING CHALLENGE" : "2 QUESTIONS");
      button.addEventListener("click", () => start(checkpoint));
      grid.append(button);
    });
  }

  function start(checkpoint) {
    active = checkpoint;
    questionIndex = 0;
    select.hidden = true;
    finish.hidden = true;
    workspace.hidden = false;
    if (checkpoint.sort) renderSort();
    else renderQuestion();
    workspace.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  }

  function renderSort() {
    answered = false;
    selectedSortItem = null;
    const activity = active.sort;
    document.getElementById("checkpoint-label").textContent = `${active.number} · ${active.title}`;
    document.getElementById("question-title").textContent = activity.prompt;
    document.getElementById("question-progress").textContent = "SORT ALL 6 POWERS";
    document.getElementById("question-progress-bar").style.width = "0%";
    feedback.hidden = true;
    nextButton.hidden = true;
    answers.replaceChildren();
    answers.className = "answers sort-activity";

    const directions = document.createElement("p");
    directions.className = "sort-directions";
    directions.textContent = "Drag each power to a box. On a phone or keyboard, select a power and then select a box.";
    const bank = document.createElement("div");
    bank.className = "power-bank";
    bank.setAttribute("aria-label", "Powers to sort");
    const bins = document.createElement("div");
    bins.className = "sort-bins";
    [
      ["could", "CONGRESS COULD"],
      ["could-not", "CONGRESS COULD NOT"]
    ].forEach(([group, label]) => {
      const bin = document.createElement("div");
      bin.className = `sort-bin ${group}`;
      bin.dataset.group = group;
      bin.tabIndex = 0;
      bin.setAttribute("role", "button");
      bin.setAttribute("aria-label", `${label}. Select this box to place the chosen power.`);
      const heading = document.createElement("h3");
      heading.textContent = label;
      const list = document.createElement("div");
      list.className = "sorted-list";
      bin.append(heading, list);
      bin.addEventListener("click", () => placeSelected(bin));
      bin.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") { event.preventDefault(); placeSelected(bin); }
      });
      bin.addEventListener("dragover", event => event.preventDefault());
      bin.addEventListener("drop", event => {
        event.preventDefault();
        const item = document.getElementById(event.dataTransfer.getData("text/plain"));
        if (item) placeItem(item, bin);
      });
      bins.append(bin);
    });
    activity.items.forEach((item, index) => {
      const power = document.createElement("button");
      power.type = "button";
      power.id = `power-${index}`;
      power.className = "power-card";
      power.textContent = item.text;
      power.dataset.answer = item.group;
      power.draggable = true;
      power.addEventListener("dragstart", event => event.dataTransfer.setData("text/plain", power.id));
      power.addEventListener("click", () => selectSortItem(power));
      bank.append(power);
    });
    answers.append(directions, bank, bins);
  }

  function selectSortItem(item) {
    document.querySelectorAll(".power-card.selected").forEach(card => card.classList.remove("selected"));
    selectedSortItem = item;
    item.classList.add("selected");
    document.querySelectorAll(".sort-bin").forEach(bin => bin.classList.add("ready"));
  }

  function placeSelected(bin) {
    if (selectedSortItem) placeItem(selectedSortItem, bin);
  }

  function placeItem(item, bin) {
    if (bin.dataset.group !== item.dataset.answer) {
      item.classList.remove("selected");
      item.classList.add("incorrect");
      selectedSortItem = null;
      document.querySelectorAll(".sort-bin").forEach(target => target.classList.remove("ready"));
      feedback.className = "feedback try-again";
      feedback.textContent = `NOT THERE. “${item.textContent}” BELONGS IN THE OTHER BOX.`;
      feedback.hidden = false;
      item.focus();
      return;
    }
    bin.querySelector(".sorted-list").append(item);
    item.dataset.placed = bin.dataset.group;
    item.classList.remove("selected", "incorrect");
    item.disabled = true;
    selectedSortItem = null;
    document.querySelectorAll(".sort-bin").forEach(target => target.classList.remove("ready"));
    const placed = answers.querySelectorAll(".power-card[data-placed]").length;
    document.getElementById("question-progress-bar").style.width = `${placed / active.sort.items.length * 100}%`;
    if (placed !== active.sort.items.length) {
      feedback.className = "feedback correct";
      feedback.textContent = `CORRECT. ${placed} OF ${active.sort.items.length} POWERS SORTED.`;
      feedback.hidden = false;
      return;
    }
    answered = true;
    feedback.className = "feedback correct";
    feedback.innerHTML = "<strong>SORT COMPLETE</strong>";
    feedback.append(document.createTextNode(active.sort.feedback));
    feedback.hidden = false;
    nextButton.textContent = "FINISH CHECKPOINT →";
    nextButton.hidden = false;
    nextButton.focus();
  }

  function renderQuestion() {
    answered = false;
    const question = active.questions[questionIndex];
    document.getElementById("checkpoint-label").textContent = `${active.number} · ${active.title}`;
    document.getElementById("question-title").textContent = question.prompt;
    document.getElementById("question-progress").textContent = `QUESTION ${questionIndex + 1} OF 2`;
    document.getElementById("question-progress-bar").style.width = `${questionIndex * 50}%`;
    feedback.hidden = true;
    nextButton.hidden = true;
    nextButton.textContent = questionIndex === 1 ? "FINISH CHECKPOINT →" : "NEXT QUESTION →";
    answers.replaceChildren();
    answers.className = "answers";
    question.options.forEach((option, optionIndex) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = option;
      button.addEventListener("click", () => checkAnswer(button, optionIndex, question));
      answers.append(button);
    });
  }

  function checkAnswer(button, optionIndex, question) {
    if (answered) return;
    if (optionIndex !== question.answer) {
      button.disabled = true;
      button.classList.add("wrong");
      feedback.className = "feedback try-again";
      feedback.textContent = "NOT YET. USE THE WORDS FROM YOUR NOTES AND TRY AGAIN.";
      feedback.hidden = false;
      return;
    }
    answered = true;
    button.classList.add("correct");
    answers.querySelectorAll("button").forEach(choice => { choice.disabled = true; });
    feedback.className = "feedback correct";
    feedback.innerHTML = "<strong>CORRECT</strong>";
    feedback.append(document.createTextNode(question.feedback));
    feedback.hidden = false;
    nextButton.hidden = false;
    nextButton.focus();
  }

  function advance() {
    if (!answered) return;
    if (active.sort) {
      completeCheckpoint();
      return;
    }
    if (questionIndex === 0) {
      questionIndex = 1;
      renderQuestion();
      return;
    }
    completeCheckpoint();
  }

  function completeCheckpoint() {
    if (!completed.includes(active.id)) completed.push(active.id);
    saveProgress();
    renderProgress();
    renderCheckpoints();
    workspace.hidden = true;
    finish.hidden = false;
    document.getElementById("finish-title").textContent = active.title;
    document.getElementById("finish-message").textContent = completed.length === 6 ? "You saved the new nation by completing all six checkpoints." : `${completed.length} of 6 checkpoints complete.`;
    finish.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  }

  function showCheckpoints() {
    workspace.hidden = true;
    finish.hidden = true;
    select.hidden = false;
    select.scrollIntoView({ behavior: "auto", block: "start" });
  }

  document.getElementById("back-button").addEventListener("click", showCheckpoints);
  document.getElementById("continue-review").addEventListener("click", showCheckpoints);
  document.getElementById("reset-button").addEventListener("click", () => {
    completed = [];
    saveProgress();
    renderProgress();
    renderCheckpoints();
    showCheckpoints();
  });
  nextButton.addEventListener("click", advance);
  renderProgress();
  renderCheckpoints();
})();
