(() => {
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
