(() => {
  const root = new URL("./", document.currentScript.src);
  const page = location.pathname.slice(root.pathname.length);
  const isHome = !page || page === "index.html";
  const unit = /^(documents\/|roots-|history-|founding-ideals)/.test(page) ? "gov-1" : "gov-0";
  let context;
  try { context = JSON.parse(sessionStorage.getItem("gov-lesson-return") || "null"); } catch (_) {}
  const back = new URL("index.html", root);
  back.hash = unit;
  if (context?.unit === unit && typeof context.lesson === "string") back.searchParams.set("lesson", context.lesson);
  if (!isHome) {
    const header = document.createElement("header");
    header.className = "gov-shared-header";
    const brand = document.createElement("a");
    brand.className = "gov-brand";
    brand.href = `${root}#home`;
    brand.innerHTML = `<img alt="" width="44" height="44"><span>PRINCIPLES OF AMERICAN DEMOCRACY<small>MR. ROGERS</small></span>`;
    brand.querySelector("img").src = new URL("assets/course-mark.svg", root);
    const menu = document.createElement("button");
    menu.type = "button";
    menu.className = "gov-menu";
    menu.textContent = "MENU";
    menu.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-controls", "gov-shared-nav");
    const nav = document.createElement("nav");
    nav.id = "gov-shared-nav";
    nav.setAttribute("aria-label", "Main navigation");
    for (const [label, hash] of [["HOME", "home"], ["UNITS", "units"], ["FOUNDATIONS", "foundations"], ["GLOSSARY", "words"], ["SKILL BUILDERS", "skills"]]) {
      const link = document.createElement("a"); link.textContent = label; link.href = `${root}#${hash}`; nav.append(link);
    }
    menu.addEventListener("click", () => { const open = menu.getAttribute("aria-expanded") !== "true"; menu.setAttribute("aria-expanded", String(open)); nav.classList.toggle("is-open", open); });
    header.addEventListener("keydown", event => { if (event.key === "Escape") { nav.classList.remove("is-open"); menu.setAttribute("aria-expanded", "false"); menu.focus(); } });
    header.append(brand, menu, nav);
    const returnLink = document.createElement("a");
    returnLink.className = "gov-unit-return";
    returnLink.href = back;
    returnLink.textContent = `← BACK TO UNIT ${unit.slice(-1)}`;
    document.body.prepend(header, returnLink);
    // Keep document source links and activity-specific navigation, without duplicate unit links.
    document.querySelectorAll("body > .page-header strong").forEach(el => el.hidden = true);
    document.querySelectorAll('a[href]').forEach(link => {
      if (link === returnLink || header.contains(link)) return;
      const target = new URL(link.href);
      if (target.origin === root.origin && /^#(?:unit-)?gov-\d+$/.test(target.hash)) link.hidden = true;
    });
    document.querySelectorAll("body > .page-header").forEach(header => {
      if (![...header.children].some(child => !child.hidden)) header.hidden = true;
    });
  }
  document.addEventListener("click", event => {
    const link = event.target.closest("a[href]");
    if (!link) return;
    const target = new URL(link.href);
    if (!/^https?:$/.test(target.protocol)) return;
    if (target.origin === root.origin) link.removeAttribute("target");
    else { link.target = "_blank"; link.rel = "noopener"; }
  }, true);
})();
