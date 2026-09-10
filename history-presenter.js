(() => {
  const data = window.HISTORY_SECTION_DATA || {};
  const order = ["independence", "articles", "crisis", "convention", "compromises", "debate", "rights"];
  const sectionSlides = order.map(key => data[key]).filter(Boolean);
  const slides = [
    { type: "title", token: "title" },
    { type: "hook", token: "hook" },
    { type: "bridge", token: "bridge" },
    ...sectionSlides.map((section, sectionIndex) => ({ type: "section", token: String(sectionIndex + 1), section }))
  ];
  const requested = new URLSearchParams(location.search).get("slide");
  let index = Math.max(0, slides.findIndex(slide => slide.token === requested));

  const number = document.getElementById("slide-number");
  const label = document.getElementById("slide-label");
  const title = document.getElementById("slide-title");
  const bigIdea = document.getElementById("slide-big-idea");
  const keyPoints = document.getElementById("slide-key-points");
  const titleSlide = document.getElementById("title-slide");
  const hookSlide = document.getElementById("hook-slide");
  const bridgeSlide = document.getElementById("bridge-slide");
  const sectionSlide = document.getElementById("section-slide");
  const current = document.getElementById("current-slide");
  const total = document.getElementById("total-slides");
  const previous = document.getElementById("previous-button");
  const next = document.getElementById("next-button");
  const progress = document.getElementById("progress");
  const fullscreen = document.getElementById("fullscreen-button");
  total.textContent = slides.length;

  slides.forEach((slide, dotIndex) => {
    const dot = document.createElement("button");
    dot.type = "button";
    const name = slide.type === "section" ? `section ${slide.token}` : `${slide.type} slide`;
    dot.setAttribute("aria-label", `Go to ${name}`);
    dot.addEventListener("click", () => show(dotIndex));
    progress.append(dot);
  });

  function show(nextIndex) {
    index = Math.min(Math.max(nextIndex, 0), slides.length - 1);
    const slide = slides[index];
    titleSlide.hidden = slide.type !== "title";
    hookSlide.hidden = slide.type !== "hook";
    bridgeSlide.hidden = slide.type !== "bridge";
    sectionSlide.hidden = slide.type !== "section";
    if (slide.type === "section") {
      const section = slide.section;
      number.textContent = section.number;
      label.textContent = `SECTION ${slide.token} · ${section.years}`;
      title.textContent = section.presenterTitle || section.title;
      bigIdea.textContent = section.bigIdea;
      keyPoints.replaceChildren();
      (section.presenterPoints || []).forEach(point => {
        const item = document.createElement("li");
        item.textContent = point;
        keyPoints.append(item);
      });
    }
    current.textContent = index + 1;
    previous.disabled = index === 0;
    next.disabled = index === slides.length - 1;
    [...progress.children].forEach((dot, dotIndex) => {
      dot.classList.toggle("is-current", dotIndex === index);
      dot.setAttribute("aria-current", dotIndex === index ? "step" : "false");
    });
    history.replaceState(null, "", `${location.pathname}?slide=${slide.token}`);
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
