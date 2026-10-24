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
})();
