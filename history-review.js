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
      button.querySelector("small").textContent = complete ? "★ COMPLETE" : "2 QUESTIONS";
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
    renderQuestion();
    workspace.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
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
    if (questionIndex === 0) {
      questionIndex = 1;
      renderQuestion();
      return;
    }
    if (!completed.includes(active.id)) completed.push(active.id);
    saveProgress();
    renderProgress();
    renderCheckpoints();
    workspace.hidden = true;
    finish.hidden = false;
    document.getElementById("finish-title").textContent = active.title;
    document.getElementById("finish-message").textContent = completed.length === 6 ? "You completed all six History Lesson checkpoints." : `${completed.length} of 6 checkpoints complete.`;
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
