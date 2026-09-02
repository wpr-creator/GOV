(() => {
  const glossaryWords = Array.isArray(window.COURSE_DATA?.words)
    ? [...window.COURSE_DATA.words].sort((a, b) => b[0].length - a[0].length)
    : [];
  const glossaryPattern = glossaryWords.length
    ? new RegExp(`\\b(${glossaryWords.map(word => word[0].replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`, "gi")
    : null;
  const glossaryByTerm = new Map(glossaryWords.map(word => [word[0].toLowerCase(), word]));

  if (glossaryPattern) {
    const walker = document.createTreeWalker(document.querySelector("main"), NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue.trim() || node.parentElement.closest("a, script, style")) return NodeFilter.FILTER_REJECT;
        glossaryPattern.lastIndex = 0;
        return glossaryPattern.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    const matchingNodes = [];
    while (walker.nextNode()) matchingNodes.push(walker.currentNode);
    matchingNodes.forEach(node => {
      glossaryPattern.lastIndex = 0;
      const fragment = document.createDocumentFragment();
      let cursor = 0;
      for (const match of node.nodeValue.matchAll(glossaryPattern)) {
        const word = glossaryByTerm.get(match[0].toLowerCase());
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
  }

  const bar = document.getElementById("progress-bar");
  if (!bar) return;
  const update = () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const percent = total > 0 ? Math.min(100, Math.max(0, window.scrollY / total * 100)) : 0;
    bar.style.width = `${percent}%`;
  };
  update();
  addEventListener("scroll", update, { passive: true });
  addEventListener("resize", update);
})();
