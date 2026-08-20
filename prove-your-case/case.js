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
  function makeWorksheetHelp(entries) {
    const box = document.createElement("section");
    box.className = "worksheet-help";
    const heading = document.createElement("h3");
    heading.textContent = "WRITE THIS ON YOUR WORKSHEET";
    box.append(heading);
    entries.forEach(([labelText, answerText]) => {
      const entry = document.createElement("div");
      const label = document.createElement("strong");
      label.textContent = labelText;
      const answer = document.createElement("p");
      answer.textContent = answerText;
      entry.append(label, answer);
      box.append(entry);
    });
    return box;
  }
  function makeRightsCheck() {
    const section = document.createElement("section");
    section.className = "rights-check";
    const heading = document.createElement("h3"); heading.textContent = "3 · KEEP THESE TWO THINGS SEPARATE";
    const intro = document.createElement("p"); intro.textContent = "The person's action explains why the government became involved. The government's action is what you test using the Constitution.";
    const grid = document.createElement("div"); grid.className = "rights-check-grid";
    const person = document.createElement("article");
    const personHeading = document.createElement("h4"); personHeading.textContent = item.id === "mahanoy" || item.id === "earls" ? "THE STUDENT'S ACTION" : "THE PERSON'S ACTION";
    const personText = document.createElement("p"); personText.textContent = item.worksheet.personAction;
    person.append(personHeading, personText);
    const government = document.createElement("article");
    const governmentHeading = document.createElement("h4"); governmentHeading.textContent = item.id === "mahanoy" || item.id === "earls" ? "THE PUBLIC SCHOOL'S ACTION" : "THE GOVERNMENT'S ACTION";
    const governmentText = document.createElement("p"); governmentText.textContent = item.worksheet.action;
    government.append(governmentHeading, governmentText);
    grid.append(person, government);
    const focus = document.createElement("p"); focus.className = "rights-focus";
    const focusLabel = document.createElement("strong"); focusLabel.textContent = "WHAT YOU ARE DECIDING: ";
    focus.append(focusLabel, item.worksheet.question);
    const reminder = document.createElement("p"); reminder.className = "rights-reminder"; reminder.textContent = "A person can do something wrong and still have constitutional rights. Finding a rights violation does not automatically mean the person is innocent or immediately goes free.";
    section.append(heading, intro, grid, focus, reminder);
    return section;
  }
  document.title = `${item.name} · Prove Your Case`;
  $("#case-topic").textContent = item.topic;
  $("#case-name").textContent = item.name;
  $("#case-year").textContent = `${item.year} · ${item.amendments}`;
  $("#case-image").src = item.image;
  $("#case-image").alt = item.alt;
  $("#case-question").textContent = item.worksheet.question;
  const list = (target, values) => values.forEach(value => { const li = document.createElement("li"); li.textContent = value; $(target).append(li); });
  list("#case-story", item.story); list("#case-notice", item.notice); list("#side-a", item.sideA.points); list("#side-b", item.sideB.points);
  $("#side-a-title").textContent = item.sideA.title; $("#side-b-title").textContent = item.sideB.title;
  item.constitution.forEach(part => {
    const section = document.createElement("section"); section.className = "constitution-part";
    const heading = document.createElement("h3"); heading.textContent = part.label;
    const quoteLabel = document.createElement("h4"); quoteLabel.textContent = "COPY THESE IMPORTANT WORDS";
    const quote = document.createElement("blockquote"); quote.textContent = part.text;
    const explainLabel = document.createElement("h4"); explainLabel.textContent = "WHAT THE WORDS MEAN";
    const explain = document.createElement("p"); explain.textContent = part.explain;
    section.append(heading, quoteLabel, quote, explainLabel, explain); $("#constitution").append(section);
  });
  $("#toolbox-rule").textContent = item.toolbox.rule;
  $("#toolbox-decide").textContent = item.toolbox.decide;
  $("#toolbox-remember").textContent = item.toolbox.remember;
  item.toolbox.terms.forEach(([term, meaning]) => {
    const name = document.createElement("dt"); name.textContent = term;
    const definition = document.createElement("dd"); definition.textContent = meaning;
    $("#toolbox-terms").append(name, definition);
  });
  addTaskCue("#story-step", "Follow the worksheet from top to bottom. Copy the government actor, read what happened, copy the government action, and choose three facts.");
  addTaskCue("#question-step", "Copy this complete question onto your worksheet.");
  addTaskCue("#constitution-step", "Follow the boxes in order: amendment, important words, meaning, and two legal words.");
  addTaskCue("#ruling-step", "Follow the worksheet in order. Choose your ruling before building your reasons.");
  const storyCue = document.querySelector("#story-step .task-cue");
  storyCue.after(makeWorksheetHelp([["1 · WHO TO WRITE:", item.worksheet.actor]]));
  $("#case-story").after(makeRightsCheck());
  document.querySelector("#story-step .panel h2").textContent = "2 · WHAT HAPPENED?";
  document.querySelector("#story-step .panel.dark h2").textContent = "4 · THREE FACTS THAT MATTER";
  document.querySelector("#question-step .task-cue").insertAdjacentHTML("afterend", '<p class="copy-label">WRITE THIS ON YOUR WORKSHEET</p>');
  const termsBox = document.querySelector(".terms-box");
  document.querySelector(".toolbox").prepend(termsBox);
  termsBox.querySelector("h3").textContent = "CHOOSE TWO LEGAL WORDS";
  const prompts = [
    ["USE THE FACTS", "Choose two facts from THREE FACTS THAT MATTER. Explain how each fact supports your ruling."],
    ["USE THE CONSTITUTION", `Finish the sentence: The ${item.amendments.replace("TH", "th").replace("ST", "st").replace("ND", "nd").replace("RD", "rd")} says or means…`],
    ["CONNECT THE FACTS AND THE CONSTITUTION", "Explain why the constitutional rule fits the facts of this case."],
    ["CONSIDER THE OTHER SIDE", "State the strongest reason someone might disagree with your ruling."],
    ["MY RESPONSE", "Explain why your ruling is still stronger."]
  ];
  prompts.forEach(([labelText, text]) => {
    const li = document.createElement("li");
    const label = document.createElement("strong"); label.textContent = labelText;
    const copy = document.createElement("span"); copy.textContent = text;
    li.append(label, copy); $("#case-prompts").append(li);
  });
  document.querySelector("#case-prompts").previousElementSibling.textContent = "BUILD YOUR OPINION";
  $("#ruling-step").append(document.querySelector(".my-rule"));
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
    const aftermath = document.createElement("section");
    aftermath.className = "aftermath";
    const aftermathHeading = document.createElement("h3"); aftermathHeading.textContent = "WHAT HAPPENED NEXT?";
    const aftermathStatus = document.createElement("span"); aftermathStatus.className = "aftermath-status"; aftermathStatus.textContent = item.aftermath.status;
    const aftermathText = document.createElement("p"); aftermathText.textContent = item.aftermath.text;
    const aftermathSource = document.createElement("a"); aftermathSource.href = item.aftermath.source; aftermathSource.target = "_blank"; aftermathSource.rel = "noopener"; aftermathSource.textContent = "CHECK THE FOLLOW-UP SOURCE ↗";
    aftermath.append(aftermathHeading, aftermathStatus, aftermathText, aftermathSource);
    $("#decision-source").before(aftermath);
    renderComparison();
  }
  renderChoice(); loadUnlock();
})();
