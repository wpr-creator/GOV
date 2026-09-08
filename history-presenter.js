(() => {
  const data = window.HISTORY_SECTION_DATA || {};
  const order = ["independence", "articles", "crisis", "convention", "compromises", "debate", "rights"];
  const slides = order.map(key => data[key]).filter(Boolean);
  let index = Math.min(Math.max(Number(new URLSearchParams(location.search).get("slide")) - 1 || 0, 0), slides.length - 1);

  const number = document.getElementById("slide-number");
  const label = document.getElementById("slide-label");
  const title = document.getElementById("slide-title");
  const bigIdea = document.getElementById("slide-big-idea");
  const current = document.getElementById("current-slide");
  const previous = document.getElementById("previous-button");
  const next = document.getElementById("next-button");
  const progress = document.getElementById("progress");
  const fullscreen = document.getElementById("fullscreen-button");

  slides.forEach((_, dotIndex) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Go to section ${dotIndex + 1}`);
    dot.addEventListener("click", () => show(dotIndex));
    progress.append(dot);
  });

  function show(nextIndex) {
    index = Math.min(Math.max(nextIndex, 0), slides.length - 1);
    const slide = slides[index];
    number.textContent = slide.number;
    label.textContent = `SECTION ${index + 1} · ${slide.years}`;
    title.textContent = slide.presenterTitle || slide.title;
    bigIdea.textContent = slide.bigIdea;
    current.textContent = index + 1;
    previous.disabled = index === 0;
    next.disabled = index === slides.length - 1;
    [...progress.children].forEach((dot, dotIndex) => {
      dot.classList.toggle("is-current", dotIndex === index);
      dot.setAttribute("aria-current", dotIndex === index ? "step" : "false");
    });
    history.replaceState(null, "", `${location.pathname}?slide=${index + 1}`);
  }

  previous.addEventListener("click", () => show(index - 1));
  next.addEventListener("click", () => show(index + 1));
  fullscreen.addEventListener("click", async () => {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen?.();
    else await document.exitFullscreen?.();
  });
  document.addEventListener("fullscreenchange", () => {
    fullscreen.textContent = document.fullscreenElement ? "EXIT FULL SCREEN" : "FULL SCREEN";
  });
  document.addEventListener("keydown", event => {
    if (["ArrowRight", "PageDown", " "].includes(event.key)) { event.preventDefault(); show(index + 1); }
    if (["ArrowLeft", "PageUp"].includes(event.key)) { event.preventDefault(); show(index - 1); }
    if (event.key === "Home") show(0);
    if (event.key === "End") show(slides.length - 1);
  });

  show(index);
})();
