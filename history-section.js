(() => {
  const order = ["independence", "articles", "crisis", "convention", "compromises", "debate", "rights"];
  const requestedTopic = new URLSearchParams(location.search).get("topic");
  const topic = order.includes(requestedTopic) ? requestedTopic : order[0];
  const content = window.HISTORY_SECTION_DATA[topic];
  const setText = (id, value) => { document.getElementById(id).textContent = value; };

  document.title = `${content.title} · The History Lesson`;
  setText("section-label", `${content.label} · ${content.years}`);
  setText("section-title", content.title);
  setText("section-big-idea", content.bigIdea);
  setText("section-number", `SECTION ${content.number}`);
  setText("section-opening", content.opening);
  setText("story-heading", `THE STORY IN ${content.sections.length === 3 ? "THREE" : "FOUR"} PARTS`);
  const image = document.getElementById("section-image");
  image.src = content.image;
  image.alt = content.imageAlt;

  const sections = document.getElementById("reader-sections");
  content.sections.forEach((section, index) => {
    const article = document.createElement("article");
    article.className = "reader-card";
    const part = document.createElement("p");
    part.className = "teaching-point";
    part.textContent = `TEACHING POINT ${index + 1} OF ${content.sections.length}`;
    const heading = document.createElement("h2");
    heading.textContent = section.heading;
    const notesCue = document.createElement("p");
    notesCue.className = "notes-cue";
    const notesLabel = document.createElement("strong");
    const isExtraDetail = section.notesCue.startsWith("EXTRA DETAIL · ");
    notesLabel.textContent = isExtraDetail ? "EXTRA DETAIL" : "ON YOUR NOTES";
    const notesLocation = document.createElement("span");
    notesLocation.textContent = isExtraDetail ? section.notesCue.replace("EXTRA DETAIL · ", "") : section.notesCue;
    notesCue.append(notesLabel, notesLocation);
    article.append(part, notesCue, heading);
    if (section.text) {
      const paragraph = document.createElement("p");
      paragraph.textContent = section.text;
      article.append(paragraph);
    }
    if (section.bullets) {
      const list = document.createElement("ul");
      section.bullets.forEach(text => {
        const item = document.createElement("li");
        item.textContent = text;
        list.append(item);
      });
      article.append(list);
    }
    const check = document.createElement("aside");
    check.className = "explain-check";
    const checkHeading = document.createElement("strong");
    checkHeading.textContent = "CAN YOU EXPLAIN IT?";
    const checkText = document.createElement("p");
    checkText.textContent = content.teach[index];
    check.append(checkHeading, checkText);
    article.append(check);
    sections.append(article);
  });

  const vocabulary = document.getElementById("vocabulary-list");
  content.vocabulary.forEach(([term, definition]) => {
    const wrapper = document.createElement("div");
    const name = document.createElement("dt");
    const meaning = document.createElement("dd");
    name.textContent = term;
    meaning.textContent = definition;
    wrapper.append(name, meaning);
    vocabulary.append(wrapper);
  });
  const index = order.indexOf(topic);
  const previous = document.getElementById("previous-section");
  const next = document.getElementById("next-section");
  if (index === 0) previous.hidden = true;
  else previous.href = `history-section.html?topic=${order[index - 1]}`;
  if (index === order.length - 1) next.hidden = true;
  else next.href = `history-section.html?topic=${order[index + 1]}`;

  const glossaryWords = Array.isArray(window.COURSE_DATA?.words) ? [...window.COURSE_DATA.words].sort((a, b) => b[0].length - a[0].length) : [];
  if (!glossaryWords.length) return;
  const pattern = new RegExp(`\\b(${glossaryWords.map(word => word[0].replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`, "gi");
  const byTerm = new Map(glossaryWords.map(word => [word[0].toLowerCase(), word]));
  const walker = document.createTreeWalker(document.querySelector("main"), NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue.trim() || node.parentElement.closest("a, script, style, #vocabulary-list")) return NodeFilter.FILTER_REJECT;
      pattern.lastIndex = 0;
      return pattern.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(node => {
    pattern.lastIndex = 0;
    const fragment = document.createDocumentFragment();
    let cursor = 0;
    for (const match of node.nodeValue.matchAll(pattern)) {
      const word = byTerm.get(match[0].toLowerCase());
      fragment.append(node.nodeValue.slice(cursor, match.index));
      const link = document.createElement("a");
      link.className = "glossary-link";
      link.href = `./?glossary=${encodeURIComponent(word[0])}#words`;
      link.dataset.definition = word[2];
      link.setAttribute("aria-label", `${match[0]}: ${word[2]} Open this glossary entry.`);
      link.textContent = match[0];
      fragment.append(link);
      cursor = match.index + match[0].length;
    }
    fragment.append(node.nodeValue.slice(cursor));
    node.replaceWith(fragment);
  });
})();
