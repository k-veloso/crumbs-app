(() => {
  const DESKTOP_QUERY = "(min-width: 72rem)";
  const HOST_ID = "crumbs-extension-host";
  const ACTIVE_ROOT_SELECTOR = ".crumbs-root";
  const STATE_ATTRIBUTE = "data-crumbs-outline";
  const HIDDEN_GRACE_PERIOD = 500;

  const desktop = window.matchMedia(DESKTOP_QUERY);
  let observedShadowRoot;
  let shadowObserver;
  let hiddenTimer;
  let frame;

  function findNotice() {
    return document.querySelector(".crumbs-toc-notice");
  }

  function createNotice() {
    const container = document.querySelector(
      ".right-sidebar-panel .sl-container",
    );
    if (!container) return null;

    const existing = findNotice();
    if (existing) return existing;

    const notice = document.createElement("aside");
    notice.className = "crumbs-toc-notice";
    notice.hidden = true;
    notice.setAttribute("role", "note");
    notice.setAttribute("aria-label", "Crumbs outline status");

    const title = document.createElement("strong");
    title.textContent = "Crumbs is hidden on this site";

    const message = document.createElement("span");
    message.append("Open Crumbs from the browser toolbar and choose ");
    const showLabel = document.createElement("kbd");
    showLabel.textContent = "Show";
    message.append(showLabel, " to use its outline.");

    notice.append(title, message);
    container.prepend(notice);
    return notice;
  }

  function setState(state) {
    if (state === "mobile" || state === "absent") {
      document.documentElement.removeAttribute(STATE_ATTRIBUTE);
    } else {
      document.documentElement.setAttribute(STATE_ATTRIBUTE, state);
    }

    const notice = state === "hidden" ? createNotice() : findNotice();
    if (notice) notice.hidden = state !== "hidden";
  }

  function watchShadowRoot(shadowRoot) {
    if (shadowRoot === observedShadowRoot) return;

    shadowObserver?.disconnect();
    observedShadowRoot = shadowRoot;
    shadowObserver = undefined;

    if (!shadowRoot) return;

    shadowObserver = new MutationObserver(scheduleEvaluation);
    shadowObserver.observe(shadowRoot, { childList: true, subtree: true });
  }

  function evaluate() {
    frame = undefined;
    window.clearTimeout(hiddenTimer);

    if (!desktop.matches) {
      watchShadowRoot(undefined);
      setState("mobile");
      return;
    }

    const host = document.getElementById(HOST_ID);
    if (!host) {
      watchShadowRoot(undefined);
      setState("absent");
      return;
    }

    const shadowRoot = host.shadowRoot;
    watchShadowRoot(shadowRoot);

    if (shadowRoot?.querySelector(ACTIVE_ROOT_SELECTOR)) {
      setState("active");
      return;
    }

    hiddenTimer = window.setTimeout(() => {
      const currentHost = document.getElementById(HOST_ID);
      const isActive =
        currentHost?.shadowRoot?.querySelector(ACTIVE_ROOT_SELECTOR);

      if (currentHost && !isActive && desktop.matches) setState("hidden");
      else scheduleEvaluation();
    }, HIDDEN_GRACE_PERIOD);
  }

  function scheduleEvaluation() {
    if (frame !== undefined) return;
    frame = window.requestAnimationFrame(evaluate);
  }

  const hostObserver = new MutationObserver(scheduleEvaluation);
  hostObserver.observe(document.documentElement, { childList: true });
  desktop.addEventListener("change", scheduleEvaluation);
  scheduleEvaluation();
})();
