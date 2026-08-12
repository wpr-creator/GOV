(() => {
  const slug = document.body.dataset.case;
  const cases = window.CP_CASE_GUIDES || [];
  const index = cases.findIndex(item => item.slug === slug);
  const item = cases[index];
  if (!item) return;
  document.title = `${item.title} · Principles of American Democracy`;
  document.querySelector("#case-meta").textContent = `${item.year} · ${item.topic}`;
  document.querySelector("#case-title").textContent = item.title;
  document.querySelector("#case-question").textContent = item.question;
  for (const key of ["facts", "decision", "meaning", "today"]) document.querySelector(`#case-${key}`).innerHTML = item[key];
  const source = document.querySelector("#case-source");
  source.href = item.source;
  const previous = document.querySelector("#previous-case");
  const next = document.querySelector("#next-case");
  if (index > 0) { previous.href = `${cases[index - 1].slug}.html`; previous.textContent = `← ${cases[index - 1].title.toUpperCase()}`; } else previous.hidden = true;
  if (index < cases.length - 1) { next.href = `${cases[index + 1].slug}.html`; next.textContent = `${cases[index + 1].title.toUpperCase()} →`; } else next.hidden = true;
})();
