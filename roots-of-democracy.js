(function () {
  "use strict";

  const roots = window.DEMOCRACY_ROOTS || [];
  const grid = document.getElementById("root-grid");
  const progress = document.getElementById("root-progress");
  const explored = new Set();

  roots.forEach((root, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "root-card";
    card.setAttribute("aria-pressed", "false");
    card.setAttribute("aria-label", `Open root ${index + 1}: ${root.name}`);

    const inner = document.createElement("span");
    inner.className = "root-card-inner";

    const front = document.createElement("span");
    front.className = "root-face root-front";
    front.innerHTML = `<span class="root-number">ROOT ${index + 1}</span><strong>${root.name}</strong><span class="root-action">TURN OVER →</span>`;

    const back = document.createElement("span");
    back.className = "root-face root-back";
    const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    icon.setAttribute("viewBox", "0 0 120 120");
    icon.setAttribute("role", "img");
    icon.setAttribute("aria-label", root.imageAlt);
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", `#${root.icon}`);
    icon.append(use);
    const name = document.createElement("strong");
    name.textContent = root.name;
    const influence = document.createElement("span");
    influence.className = "root-explanation";
    influence.innerHTML = `<b>HOW IT INFLUENCED AMERICA</b>${root.influence}`;
    const unitedStates = document.createElement("span");
    unitedStates.className = "root-explanation root-us";
    unitedStates.innerHTML = `<b>WHAT IT MEANS FOR THE UNITED STATES</b>${root.unitedStates}`;
    const ideas = document.createElement("span");
    ideas.className = "root-ideas";
    ideas.innerHTML = `<b>CONNECTS TO</b>${root.treeIdeas.join(" · ")}`;
    const close = document.createElement("span");
    close.className = "root-action";
    close.textContent = "TURN BACK ↩";
    back.append(icon, name, influence, unitedStates, ideas, close);

    inner.append(front, back);
    card.append(inner);
    card.addEventListener("click", () => {
      const open = card.getAttribute("aria-pressed") !== "true";
      card.setAttribute("aria-pressed", String(open));
      card.setAttribute("aria-label", `${open ? "Close" : "Open"} root ${index + 1}: ${root.name}`);
      if (open) explored.add(root.id);
      progress.textContent = `${explored.size} OF ${roots.length} ROOTS EXPLORED`;
    });
    grid.append(card);
  });
})();
