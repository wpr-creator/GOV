(() => {
  "use strict";
  const $ = selector => document.querySelector(selector);
  const $$ = selector => Array.from(document.querySelectorAll(selector));
  const rules = window.ARTICLE_V_RULES;
  const scrollBehavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
  let proposalRoute = "";

  const proposalOptions = {
    congress: {
      explainer: "The House has 435 seats and the Senate has 100. Both chambers must separately reach two-thirds. Which pair clears the gate?",
      choices: [
        ["289 + 67", "HOUSE + SENATE", rules.congressProposal(289, 67), "The Senate cleared its threshold, but the House is one vote short. Both chambers must reach two-thirds."],
        ["290 + 66", "HOUSE + SENATE", rules.congressProposal(290, 66), "The House cleared its threshold, but the Senate is one vote short. Both chambers must reach two-thirds."],
        ["290 + 67", "HOUSE + SENATE", rules.congressProposal(290, 67), "Proposal passed: both the House and Senate reached two-thirds."]
      ]
    },
    states: {
      explainer: "There are 50 state legislatures. Which total reaches the two-thirds requirement to call a convention?",
      choices: [
        ["33", "STATES", rules.statesProposal(33), "One state short. Thirty-three is not two-thirds of 50."],
        ["34", "STATES", rules.statesProposal(34), "Proposal passed: 34 states reached the two-thirds threshold."],
        ["40", "STATES", rules.statesProposal(40), "Proposal passed: 40 states is more than the required 34."]
      ]
    }
  };

  function selectButton(button, selector) {
    $$(selector).forEach(item => item.setAttribute("aria-pressed", String(item === button)));
  }

  function chooseProposal(button) {
    proposalRoute = button.dataset.proposal;
    selectButton(button, "[data-proposal]");
    $("#ratification").classList.add("is-locked");
    $("#ratification-lock").hidden = false;
    $("#ratification-content").hidden = true;
    $("#ratification-test").hidden = true;
    $("#success").hidden = true;
    $("#proposal").classList.remove("is-complete");
    $("#ratification").classList.remove("is-complete");
    selectButton(null, "[data-ratification]");
    $("#proposal-test").hidden = false;
    $("#proposal-explainer").textContent = proposalOptions[proposalRoute].explainer;
    $("#proposal-verdict").textContent = "Choose a vote total to test the gate.";
    const numbers = $("#proposal-numbers");
    numbers.replaceChildren();
    proposalOptions[proposalRoute].choices.forEach(([number, label, passes, message]) => {
      const option = document.createElement("button");
      option.type = "button";
      option.innerHTML = `<strong>${number}</strong><span>${label}</span>`;
      option.addEventListener("click", () => testProposal(option, passes, message));
      numbers.append(option);
    });
    $("#proposal-test").scrollIntoView({ behavior: scrollBehavior, block: "center" });
  }

  function testProposal(button, passes, message) {
    selectButton(button, "#proposal-numbers button");
    const verdict = $("#proposal-verdict");
    verdict.textContent = (passes ? "✓ GATE OPEN — " : "✕ GATE CLOSED — ") + message;
    verdict.className = `verdict ${passes ? "pass" : "fail"}`;
    if (!passes) return;
    $("#proposal").classList.add("is-complete");
    $("#ratification").classList.remove("is-locked");
    $("#ratification-lock").hidden = true;
    $("#ratification-content").hidden = false;
    $("#ratification").scrollIntoView({ behavior: scrollBehavior, block: "start" });
  }

  function chooseRatification(button) {
    selectButton(button, "[data-ratification]");
    $("#success").hidden = true;
    $("#ratification-test").hidden = false;
    $("#ratification-verdict").textContent = "Choose a state total to test the gate.";
    $("#ratification-verdict").className = "verdict";
    $("#ratification-test").scrollIntoView({ behavior: scrollBehavior, block: "center" });
  }

  function testRatification(button) {
    selectButton(button, "[data-ratify-count]");
    const count = Number(button.dataset.ratifyCount);
    const passes = rules.ratification(count);
    const verdict = $("#ratification-verdict");
    verdict.textContent = passes
      ? `✓ GATE OPEN — ${count} states meets the three-fourths requirement.`
      : `✕ GATE CLOSED — ${count} states is one short of the 38 needed.`;
    verdict.className = `verdict ${passes ? "pass" : "fail"}`;
    if (passes) {
      $("#ratification").classList.add("is-complete");
      $("#success").hidden = false;
      $("#success").scrollIntoView({ behavior: scrollBehavior, block: "center" });
    }
  }

  $$('[data-proposal]').forEach(button => button.addEventListener("click", () => chooseProposal(button)));
  $$('[data-ratification]').forEach(button => button.addEventListener("click", () => chooseRatification(button)));
  $$('[data-ratify-count]').forEach(button => button.addEventListener("click", () => testRatification(button)));
  $("#reset").addEventListener("click", () => window.location.reload());
})();
