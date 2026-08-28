(() => {
  "use strict";
  const data = window.FOUNDING_IDEALS_REVIEW_DATA;
  const storageKey = "gov-founding-ideals-review-v1";
  const idealMap = Object.fromEntries(data.ideals.map(ideal => [ideal.id, ideal]));
  const badges = document.getElementById("ideal-badges");
  const masteryStatus = document.getElementById("mastery-status");
  const missionSelect = document.getElementById("mission-select");
  const missionGrid = document.getElementById("mission-grid");
  const workspace = document.getElementById("workspace");
  const finish = document.getElementById("finish");
  const answerGrid = document.getElementById("answer-grid");
  const feedback = document.getElementById("feedback");
  const continueButton = document.getElementById("continue-button");
  let state = loadState();
  let activeMission = null;
  let questionIndex = 0;
  let answered = false;

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
      return { mastered: Array.isArray(saved.mastered) ? saved.mastered : [], completed: Array.isArray(saved.completed) ? saved.completed : [] };
    } catch (error) {
      return { mastered: [], completed: [] };
    }
  }

  function saveState() {
    try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch (error) { console.warn("Review progress could not be saved.", error); }
  }

  function renderBadges() {
    badges.replaceChildren();
    data.ideals.forEach(ideal => {
      const earned = state.mastered.includes(ideal.id);
      const badge = document.createElement("div");
      badge.className = `ideal-badge${earned ? " mastered" : ""}`;
      badge.innerHTML = `<span aria-hidden="true">${earned ? "★" : "☆"}</span><strong></strong>`;
      badge.querySelector("strong").textContent = ideal.name;
      badge.title = ideal.meaning;
      badges.append(badge);
    });
    masteryStatus.textContent = `${state.mastered.length} OF 6 IDEALS FOUND`;
  }

  function renderMissions() {
    missionGrid.replaceChildren();
    data.missions.forEach(mission => {
      const complete = state.completed.includes(mission.id);
      const button = document.createElement("button");
      button.type = "button";
      button.className = `mission-card${complete ? " complete" : ""}`;
      button.innerHTML = `<span class="number"></span><strong></strong><p></p><small></small>`;
      button.querySelector(".number").textContent = mission.number;
      button.querySelector("strong").textContent = mission.title;
      button.querySelector("p").textContent = mission.description;
      button.querySelector("small").textContent = complete ? "★ MISSION COMPLETE" : `${mission.questions.length} EVIDENCE FILES`;
      button.addEventListener("click", () => startMission(mission));
      missionGrid.append(button);
    });
  }

  function startMission(mission) {
    activeMission = mission;
    questionIndex = 0;
    finish.hidden = true;
    missionSelect.hidden = true;
    workspace.hidden = false;
    renderQuestion();
    workspace.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  }

  function renderQuestion() {
    answered = false;
    const question = activeMission.questions[questionIndex];
    document.getElementById("mission-progress").textContent = `${activeMission.title} · ${questionIndex + 1} OF ${activeMission.questions.length}`;
    document.getElementById("mission-progress-bar").style.width = `${questionIndex / activeMission.questions.length * 100}%`;
    document.getElementById("question-source").textContent = question.source;
    document.getElementById("question-excerpt").textContent = `“${question.excerpt}”`;
    feedback.hidden = true;
    feedback.className = "feedback";
    continueButton.hidden = true;
    continueButton.textContent = questionIndex === activeMission.questions.length - 1 ? "FINISH MISSION →" : "NEXT EVIDENCE →";
    answerGrid.replaceChildren();
    question.options.forEach(idealId => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "answer-button";
      button.textContent = idealMap[idealId].name;
      button.addEventListener("click", () => checkAnswer(button, idealId, question));
      answerGrid.append(button);
    });
  }

  function checkAnswer(button, idealId, question) {
    if (answered) return;
    if (idealId !== question.answer) {
      button.classList.add("wrong");
      button.disabled = true;
      feedback.className = "feedback try-again";
      feedback.innerHTML = "<b>TRY AGAIN</b>";
      feedback.append(document.createTextNode(question.hint));
      feedback.hidden = false;
      return;
    }
    answered = true;
    button.classList.add("correct");
    answerGrid.querySelectorAll("button").forEach(option => { option.disabled = true; });
    if (!state.mastered.includes(question.answer)) state.mastered.push(question.answer);
    saveState();
    renderBadges();
    feedback.className = "feedback correct";
    feedback.innerHTML = "<b>CONNECTION FOUND</b>";
    feedback.append(document.createTextNode(question.explanation));
    feedback.hidden = false;
    continueButton.hidden = false;
    continueButton.focus();
  }

  function nextQuestion() {
    if (!answered) return;
    if (questionIndex < activeMission.questions.length - 1) {
      questionIndex += 1;
      renderQuestion();
      document.getElementById("question-source").scrollIntoView({ behavior: "auto", block: "center" });
      return;
    }
    if (!state.completed.includes(activeMission.id)) state.completed.push(activeMission.id);
    saveState();
    renderMissions();
    workspace.hidden = true;
    finish.hidden = false;
    document.getElementById("finish-title").textContent = activeMission.title;
    document.getElementById("finish-message").textContent = state.mastered.length === 6 ? "You found all six ideals across the founding texts." : `You have found ${state.mastered.length} of 6 ideals. Choose another text to keep building your badges.`;
    finish.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  }

  function showMissions() {
    workspace.hidden = true;
    finish.hidden = true;
    missionSelect.hidden = false;
    missionSelect.scrollIntoView({ behavior: "auto", block: "start" });
  }

  document.getElementById("back-missions").addEventListener("click", showMissions);
  continueButton.addEventListener("click", nextQuestion);
  document.getElementById("choose-another").addEventListener("click", showMissions);
  document.getElementById("replay-mission").addEventListener("click", () => startMission(activeMission));
  document.getElementById("reset-progress").addEventListener("click", () => {
    state = { mastered: [], completed: [] };
    saveState();
    renderBadges();
    renderMissions();
    showMissions();
  });

  renderBadges();
  renderMissions();
})();
