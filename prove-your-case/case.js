(() => {
  const id = document.body.dataset.case;
  const item = window.PROVE_CASES.find(entry => entry.id === id);
  if (!item) return;
  const $ = selector => document.querySelector(selector);
  function addTaskCue(stageSelector, instruction) {
    const heading = document.querySelector(`${stageSelector} h2`);
    if (!heading) return;
    const cue = document.createElement("p");
    cue.className = "task-cue";
    const label = document.createElement("strong");
    label.textContent = "DO THIS: ";
    cue.append(label, instruction);
    heading.after(cue);
  }
  document.title = `${item.name} · Prove Your Case`;
  $("#case-topic").textContent = item.topic;
  $("#case-name").textContent = item.name;
  $("#case-year").textContent = `${item.year} · ${item.amendments}`;
  $("#case-image").src = item.image;
  $("#case-image").alt = item.alt;
  $("#case-question").textContent = item.question;
  const list = (target, values) => values.forEach(value => { const li = document.createElement("li"); li.textContent = value; $(target).append(li); });
  list("#case-story", item.story); list("#case-notice", item.notice); list("#side-a", item.sideA.points); list("#side-b", item.sideB.points); list("#case-prompts", item.prompts);
  $("#side-a-title").textContent = item.sideA.title; $("#side-b-title").textContent = item.sideB.title;
  item.constitution.forEach(part => {
    const section = document.createElement("section"); section.className = "constitution-part";
    const heading = document.createElement("h3"); heading.textContent = part.label;
    const quote = document.createElement("blockquote"); quote.textContent = part.text;
    const explain = document.createElement("p"); explain.textContent = part.explain;
    section.append(heading, quote, explain); $("#constitution").append(section);
  });
  $("#toolbox-rule").textContent = item.toolbox.rule;
  $("#toolbox-decide").textContent = item.toolbox.decide;
  $("#toolbox-remember").textContent = item.toolbox.remember;
  item.toolbox.terms.forEach(([term, meaning]) => {
    const name = document.createElement("dt"); name.textContent = term;
    const definition = document.createElement("dd"); definition.textContent = meaning;
    $("#toolbox-terms").append(name, definition);
  });
  addTaskCue("#story-step", "Read the story. On your worksheet, write who acted, what happened, and three facts.");
  addTaskCue("#question-step", "Write the constitutional question in your own words.");
  addTaskCue("#constitution-step", "Find the amendment. Copy its most important words. Explain them in your own words.");
  addTaskCue("#ruling-step", "Choose a ruling. Support it with two facts and the Constitution.");
  const rulingNote = document.querySelector("#ruling-step > p:not(.step):not(.task-cue)");
  if (rulingNote) rulingNote.textContent = "Use the buttons for your quick choice. Write your evidence on the worksheet.";
  const choiceKey = `prove-case-choice-${id}`;
  let choice = localStorage.getItem(choiceKey) || "";
  const choiceStatus = $("#choice-status");
  function renderChoice() {
    document.querySelectorAll("[data-ruling-choice]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.rulingChoice === choice)));
    choiceStatus.textContent = choice ? `YOUR QUICK RULING: THE RIGHT ${choice === "violated" ? "WAS" : "WAS NOT"} VIOLATED. RECORD YOUR EVIDENCE ON THE WORKSHEET.` : "CHOOSE A QUICK RULING, THEN RECORD YOUR EVIDENCE ON THE WORKSHEET.";
    renderComparison();
  }
  document.querySelectorAll("[data-ruling-choice]").forEach(button => button.addEventListener("click", () => { choice = button.dataset.rulingChoice; localStorage.setItem(choiceKey, choice); renderChoice(); }));
  let isUnlocked = false;
  function renderComparison() {
    const comparison = $("#comparison");
    if (!isUnlocked || !choice) { comparison.hidden = true; return; }
    comparison.hidden = false;
    const agreed = (choice === "violated") === item.ruling.violated;
    comparison.textContent = agreed ? "YOU RULED WITH THE COURT." : "YOU DISSENTED FROM THE COURT. A DISSENT IS A REASONED DISAGREEMENT—NOT AN AUTOMATICALLY WRONG ANSWER.";
  }
  async function loadUnlock() {
    try {
      const response = await fetch("../site-content.json", {cache:"no-store"});
      if (!response.ok) throw new Error();
      let config = await response.json();
      const preview = JSON.parse(localStorage.getItem("pad-site-content-v2") || "null");
      if (preview?.proveCaseUnlocks) config.proveCaseUnlocks = {...(config.proveCaseUnlocks || {}), ...preview.proveCaseUnlocks};
      isUnlocked = Boolean(config.proveCaseUnlocks?.[id]);
    } catch { isUnlocked = false; }
    if (!isUnlocked) return;
    $("#decision-locked").hidden = true; $("#decision-open").hidden = false;
    $("#decision-vote").textContent = `${item.ruling.vote} DECISION`;
    $("#decision-holding").textContent = item.ruling.holding;
    $("#decision-reason").textContent = item.ruling.reason;
    $("#decision-nuance").textContent = item.ruling.nuance;
    $("#decision-source").href = item.ruling.source;
    renderComparison();
  }
  renderChoice(); loadUnlock();
})();
