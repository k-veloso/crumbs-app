(() => {
  const root = document.documentElement;
  const button = document.querySelector('.theme-toggle');
  const options = ['system', 'light', 'dark'];
  let preference = root.dataset.theme || 'system';
  function updateTheme() {
    if (preference === 'system') delete root.dataset.theme;
    else root.dataset.theme = preference;
    const label = preference.charAt(0).toUpperCase() + preference.slice(1);
    button.textContent = `Theme: ${label}`;
    button.setAttribute('aria-label', `Color theme: ${label}. Switch to ${options[(options.indexOf(preference) + 1) % options.length]}.`);
  }
  if (button) {
    button.hidden = false;
    updateTheme();
    button.addEventListener('click', () => {
      preference = options[(options.indexOf(preference) + 1) % options.length];
      updateTheme();
      try { localStorage.setItem('crumbs-help-theme', preference); } catch (error) {}
    });
  }
  const outline = document.querySelector('.page-outline');
  const headings = [...document.querySelectorAll('.doc-content h2[id]')];
  if (!outline || headings.length === 0) return;
  const nav = outline.querySelector('nav');
  const links = headings.map((heading) => {
    const link = document.createElement('a');
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent;
    nav.append(link);
    return link;
  });
  outline.hidden = false;
  if (!('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      links.forEach((link) => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }
  }, { rootMargin: '-12% 0px -65% 0px' });
  headings.forEach((heading) => observer.observe(heading));
})();
