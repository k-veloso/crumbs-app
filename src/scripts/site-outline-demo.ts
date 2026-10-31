import {
  buildSectionLink,
  filterOutlineItems,
  flattenOutlineItems,
  getDemoShortcutAction,
  initialControllerState,
  nestOutlineItems,
  normalizeStarlightItems,
  reduceControllerState,
} from "../lib/site-outline-demo.mjs";

type OutlineItem = {
  id: string;
  label: string;
  level: number;
  children: OutlineItem[];
  hasChildren?: boolean;
};

type Preferences = {
  accent: string;
  dock: "left" | "right";
  quick: { top: boolean; bottom: boolean; dock: boolean };
};

const DESKTOP_QUERY = "(min-width: 72rem)";
const EXTENSION_HOST_ID = "crumbs-extension-host";
const EXTENSION_ROOT_SELECTOR = ".crumbs-root";
const SESSION_KEY = "crumbs-site-demo-enabled";
const PREFERENCES_KEY = "crumbs-site-demo-preferences-v1";
const DETECTION_GRACE_PERIOD = 500;

const defaultPreferences: Preferences = {
  accent: "caramel",
  dock: "right",
  quick: { top: true, bottom: true, dock: true },
};

declare global {
  interface Window {
    __crumbsSiteDemoInitialized?: boolean;
  }
}

function readStoredPreferences(): Preferences {
  try {
    const stored = JSON.parse(localStorage.getItem(PREFERENCES_KEY) ?? "null");
    return {
      ...defaultPreferences,
      ...stored,
      quick: { ...defaultPreferences.quick, ...stored?.quick },
    };
  } catch {
    return structuredClone(defaultPreferences);
  }
}

function savePreferences(preferences: Preferences) {
  try {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
  } catch {}
}

function readSessionPreference() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "true";
  } catch {
    return false;
  }
}

function saveSessionPreference(enabled: boolean) {
  try {
    if (enabled) sessionStorage.setItem(SESSION_KEY, "true");
    else sessionStorage.removeItem(SESSION_KEY);
  } catch {}
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(
    target.closest(
      'input, textarea, select, [contenteditable="true"], [role="textbox"]',
    ),
  );
}

function copyText(text: string) {
  if (navigator.clipboard?.writeText)
    return navigator.clipboard.writeText(text);

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.append(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
  return Promise.resolve();
}

function readOutlineItems(): OutlineItem[] {
  const data = document.getElementById("crumbs-demo-outline-data");
  if (data?.textContent) {
    try {
      const pageTitle =
        document.querySelector<HTMLElement>("main h1")?.textContent ?? "";
      return normalizeStarlightItems(
        JSON.parse(data.textContent),
        pageTitle,
      ) as OutlineItem[];
    } catch {}
  }

  const declared = [
    ...document.querySelectorAll<HTMLElement>("[data-crumbs-demo-heading]"),
  ]
    .map((element) => {
      const id = element.dataset.crumbsDemoTarget ?? element.id;
      const label =
        element.dataset.crumbsDemoLabel ?? element.textContent?.trim() ?? "";
      const level = Number(element.dataset.crumbsDemoLevel ?? 2);
      return { id, label, level };
    })
    .filter((item) => item.id && item.label && Number.isFinite(item.level));

  return nestOutlineItems(declared) as OutlineItem[];
}

function targetFor(item: OutlineItem) {
  if (item.id === "_top") {
    return (
      document.querySelector<HTMLElement>("main h1") ??
      document.querySelector<HTMLElement>("main")
    );
  }
  return document.getElementById(item.id);
}

export function initSiteOutlineDemo() {
  if (window.__crumbsSiteDemoInitialized) return;
  window.__crumbsSiteDemoInitialized = true;

  const rootCandidate = document.querySelector<HTMLElement>(
    "[data-crumbs-demo-root]",
  );
  if (!rootCandidate) return;
  const root = rootCandidate;

  function requireElement<T extends Element>(selector: string) {
    const element = root.querySelector<T>(selector);
    if (!element) throw new Error(`Missing Crumbs demo element: ${selector}`);
    return element;
  }

  const trigger = requireElement<HTMLButtonElement>(
    "[data-crumbs-demo-trigger]",
  );
  const triggerLabel = requireElement<HTMLElement>(
    "[data-crumbs-demo-trigger-label]",
  );
  const outline = requireElement<HTMLElement>("[data-crumbs-demo-outline]");
  const list = requireElement<HTMLUListElement>("[data-crumbs-demo-list]");
  const rail = requireElement<HTMLElement>("[data-crumbs-demo-rail]");
  const empty = requireElement<HTMLElement>("[data-crumbs-demo-empty]");
  const search = requireElement<HTMLInputElement>("[data-crumbs-demo-search]");
  const depthButtons = [
    ...root.querySelectorAll<HTMLButtonElement>("[data-crumbs-demo-depth]"),
  ];
  const depthRow = requireElement<HTMLElement>(".crumbs-demo-depth-row");
  const searchToggle = requireElement<HTMLButtonElement>(
    "[data-crumbs-demo-search-toggle]",
  );
  const pin = requireElement<HTMLButtonElement>("[data-crumbs-demo-pin]");
  const settings = requireElement<HTMLElement>("[data-crumbs-demo-settings]");
  const settingsButton = requireElement<HTMLButtonElement>(
    "[data-crumbs-demo-settings-button]",
  );
  const status = requireElement<HTMLElement>("[data-crumbs-demo-status]");

  const items = readOutlineItems();
  if (items.length === 0) return;

  const flatItems = flattenOutlineItems(items) as OutlineItem[];
  const desktop = window.matchMedia(DESKTOP_QUERY);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const darkScheme = window.matchMedia("(prefers-color-scheme: dark)");
  const collapsedIds = new Set<string>();
  const preferences = readStoredPreferences();
  let controller: { environment: string; demoEnabled: boolean } = {
    ...initialControllerState,
    demoEnabled: readSessionPreference(),
  };
  let pinned = false;
  let maxDepth = 3;
  let activeId = flatItems[0]?.id ?? "";
  let hoverTimer = 0;
  let statusTimer = 0;
  let scrollFrame = 0;
  let detectionTimer = 0;
  let observedShadowRoot: ShadowRoot | undefined;
  let shadowObserver: MutationObserver | undefined;

  function announce(message: string) {
    window.clearTimeout(statusTimer);
    status.textContent = message;
    statusTimer = window.setTimeout(() => {
      status.textContent = "";
    }, 2200);
  }

  function resolveTheme() {
    const pageIsDark =
      document.documentElement.dataset.theme === "dark" ||
      (!document.documentElement.dataset.theme && darkScheme.matches);
    outline.dataset.resolvedTheme = pageIsDark ? "dark" : "light";
  }

  function applyPreferences() {
    outline.dataset.accent = preferences.accent;
    root.dataset.accent = preferences.accent;
    outline.dataset.dock = preferences.dock;
    resolveTheme();

    root
      .querySelectorAll<HTMLButtonElement>(
        "[data-crumbs-demo-accent-options] button",
      )
      .forEach((button) => {
        button.setAttribute(
          "aria-pressed",
          String(button.dataset.value === preferences.accent),
        );
      });
    root
      .querySelectorAll<HTMLButtonElement>(
        "[data-crumbs-demo-dock-options] button",
      )
      .forEach((button) => {
        button.setAttribute(
          "aria-pressed",
          String(button.dataset.value === preferences.dock),
        );
      });
    root.querySelectorAll<HTMLInputElement>("[data-quick]").forEach((input) => {
      const key = input.dataset.quick as keyof Preferences["quick"];
      input.checked = preferences.quick[key];
    });
    root
      .querySelector<HTMLButtonElement>("[data-crumbs-demo-top]")
      ?.toggleAttribute("hidden", !preferences.quick.top);
    root
      .querySelector<HTMLButtonElement>("[data-crumbs-demo-bottom]")
      ?.toggleAttribute("hidden", !preferences.quick.bottom);
    root
      .querySelector<HTMLButtonElement>("[data-crumbs-demo-dock]")
      ?.toggleAttribute("hidden", !preferences.quick.dock);
    root
      .querySelector<HTMLButtonElement>("[data-crumbs-demo-dock]")
      ?.setAttribute(
        "aria-label",
        `Dock outline on the ${preferences.dock === "right" ? "left" : "right"}`,
      );
  }

  function setPinned(nextPinned: boolean) {
    pinned = nextPinned;
    pin.setAttribute("aria-pressed", String(pinned));
    pin.setAttribute("aria-label", pinned ? "Unpin outline" : "Pin outline");
    outline.classList.toggle(
      "is-collapsed",
      !pinned && outline.matches(":not(:hover)"),
    );
    announce(pinned ? "Outline pinned" : "Outline unpinned");
  }

  function renderRail() {
    const visibleItems = flatItems.filter((item) => item.level <= maxDepth);
    rail.replaceChildren(
      ...visibleItems.map((item) => {
        const bar = document.createElement("i");
        bar.style.setProperty("--rail-level", String(Math.min(item.level, 4)));
        bar.classList.toggle("is-active", item.id === activeId);
        return bar;
      }),
    );
  }

  function navigateTo(item: OutlineItem, preview = false) {
    const target = targetFor(item);
    if (!target) return;

    if (item.id === "_top") {
      window.scrollTo({
        top: 0,
        behavior: preview || reducedMotion.matches ? "auto" : "smooth",
      });
    } else {
      target.scrollIntoView({
        block: "start",
        behavior: preview || reducedMotion.matches ? "auto" : "smooth",
      });
    }

    activeId = item.id;
    if (!preview) {
      const accent = getComputedStyle(outline).getPropertyValue(
        "--crumbs-accent-soft",
      );
      target.style.setProperty("--crumbs-accent-soft", accent);
      target.classList.add("crumbs-demo-target-highlight");
      window.setTimeout(() => {
        target.classList.remove("crumbs-demo-target-highlight");
        target.style.removeProperty("--crumbs-accent-soft");
      }, 1400);
    }
    renderOutline();
  }

  function createItem(item: OutlineItem) {
    const li = document.createElement("li");
    const row = document.createElement("div");
    const toggle = document.createElement("button");
    const link = document.createElement("a");
    const copy = document.createElement("button");

    row.className = "crumbs-demo-row";
    row.classList.toggle("is-active", item.id === activeId);
    row.style.setProperty(
      "--crumbs-item-indent",
      `${7.6 + Math.max(0, item.level - 1) * 15.2}px`,
    );

    toggle.type = "button";
    toggle.textContent = collapsedIds.has(item.id) ? "›" : "⌄";
    const hasChildren = item.hasChildren ?? item.children.length > 0;
    toggle.classList.toggle("is-placeholder", !hasChildren);
    toggle.disabled = !hasChildren;
    toggle.tabIndex = hasChildren ? 0 : -1;
    toggle.setAttribute("aria-hidden", String(!hasChildren));
    toggle.setAttribute(
      "aria-label",
      `${collapsedIds.has(item.id) ? "Expand" : "Collapse"} ${item.label}`,
    );
    toggle.setAttribute("aria-expanded", String(!collapsedIds.has(item.id)));
    toggle.addEventListener("click", () => {
      if (collapsedIds.has(item.id)) collapsedIds.delete(item.id);
      else collapsedIds.add(item.id);
      renderOutline();
    });

    link.href = `#${encodeURIComponent(item.id)}`;
    link.textContent = item.label;
    link.title = item.label;
    link.addEventListener("click", (event) => {
      event.preventDefault();
      navigateTo(item);
    });
    link.addEventListener("mouseenter", (event) => {
      if (!(event as MouseEvent).shiftKey) return;
      window.clearTimeout(hoverTimer);
      hoverTimer = window.setTimeout(() => navigateTo(item, true), 260);
    });
    link.addEventListener("mouseleave", () => window.clearTimeout(hoverTimer));

    copy.type = "button";
    copy.className = "crumbs-demo-copy";
    copy.textContent = "⧉";
    copy.setAttribute("aria-label", `Copy link to ${item.label}`);
    copy.addEventListener("click", async () => {
      try {
        await copyText(buildSectionLink(window.location.href, item));
        announce("Section link copied");
      } catch {
        announce("Could not copy the section link");
      }
    });

    row.append(toggle, link, copy);
    li.append(row);

    if (item.children.length && !collapsedIds.has(item.id)) {
      const children = document.createElement("ul");
      children.className = "crumbs-demo-list";
      children.append(...item.children.map(createItem));
      li.append(children);
    }
    return li;
  }

  function renderOutline() {
    const visible = filterOutlineItems(items, {
      query: search.value,
      maxLevel: maxDepth,
      collapsedIds,
    }) as OutlineItem[];
    list.replaceChildren(...visible.map(createItem));
    empty.hidden = visible.length > 0;
    renderRail();
  }

  function updateActiveSection() {
    scrollFrame = 0;
    const threshold = window.innerHeight * 0.34;
    const visibleItems = flatItems.filter((item) => item.level <= maxDepth);
    let next = visibleItems[0]?.id ?? "";
    for (const item of visibleItems) {
      const target = targetFor(item);
      if (target && target.getBoundingClientRect().top <= threshold)
        next = item.id;
    }
    if (next !== activeId) {
      activeId = next;
      renderOutline();
    }
  }

  function scheduleActiveSectionUpdate() {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(updateActiveSection);
  }

  function setSettingsOpen(open: boolean) {
    settings.hidden = !open;
    settingsButton.setAttribute("aria-expanded", String(open));
    if (open) {
      outline.classList.remove("is-collapsed");
      settings.querySelector<HTMLElement>("button, input, select")?.focus();
    } else {
      settingsButton.focus();
    }
  }

  function setSearchOpen(open: boolean) {
    depthRow.dataset.searchActive = String(open);
    searchToggle.dataset.active = String(open);
    searchToggle.setAttribute(
      "aria-label",
      open ? "Hide search" : "Show search",
    );
    if (open) requestAnimationFrame(() => search.focus());
    else {
      search.value = "";
      renderOutline();
    }
  }

  function setMaxDepth(nextDepth: number) {
    maxDepth = nextDepth;
    depthButtons.forEach((button) => {
      const level = Number(button.dataset.crumbsDemoDepth);
      button.dataset.enabled = String(level <= maxDepth);
      button.dataset.active = String(level === maxDepth);
    });
    const fill = root.querySelector<HTMLElement>(".crumbs-demo-depth-fill");
    if (fill) {
      const progress = (maxDepth - 1) / 2;
      fill.style.width =
        progress === 0 ? "0px" : `calc((100% - 15px) * ${progress})`;
    }
    renderOutline();
  }

  function setDemoEnabled(enabled: boolean) {
    controller = reduceControllerState(controller, {
      type: "demo",
      enabled,
    });
    saveSessionPreference(controller.demoEnabled);
    applyControllerState();
  }

  function applyControllerState() {
    const state = controller.environment;
    const visualState = controller.demoEnabled ? "demo-active" : state;
    document.documentElement.dataset.crumbsOutlineState = visualState;

    trigger.hidden = state === "detecting" || state === "mobile";
    outline.hidden = !controller.demoEnabled;
    trigger.setAttribute("aria-pressed", String(controller.demoEnabled));
    document
      .querySelectorAll<HTMLElement>(".crumbs-demo-hero-activate")
      .forEach((button) => {
        button.hidden = state !== "demo-available" || controller.demoEnabled;
      });

    if (state === "extension-active") {
      triggerLabel.textContent = "Crumbs active";
      trigger.title = "The Crumbs extension outline is active on this page.";
    } else if (state === "extension-hidden") {
      triggerLabel.textContent = "Crumbs hidden";
      trigger.title = "The Crumbs extension is hidden on this site.";
    } else if (controller.demoEnabled) {
      triggerLabel.textContent = "Hide demo outline";
      trigger.title = "Hide the site-powered Crumbs outline demo.";
    } else {
      triggerLabel.textContent = "Show demo outline";
      trigger.title = "Try the site-powered Crumbs outline on this page.";
    }

    if (controller.demoEnabled) {
      outline.classList.remove("is-collapsed");
      renderOutline();
    } else {
      settings.hidden = true;
      settingsButton.setAttribute("aria-expanded", "false");
    }
  }

  function setEnvironment(environment: string) {
    const wasEnabled = controller.demoEnabled;
    controller = reduceControllerState(controller, {
      type: "environment",
      environment,
    });
    if (wasEnabled && !controller.demoEnabled) saveSessionPreference(false);
    applyControllerState();
  }

  function watchShadowRoot(shadowRoot?: ShadowRoot) {
    if (observedShadowRoot === shadowRoot) return;
    shadowObserver?.disconnect();
    observedShadowRoot = shadowRoot;
    shadowObserver = undefined;
    if (!shadowRoot) return;
    shadowObserver = new MutationObserver(evaluateEnvironment);
    shadowObserver.observe(shadowRoot, { childList: true, subtree: true });
  }

  function evaluateEnvironment() {
    window.clearTimeout(detectionTimer);
    if (!desktop.matches) {
      watchShadowRoot();
      setEnvironment("mobile");
      return;
    }

    const host = document.getElementById(EXTENSION_HOST_ID);
    if (!host) {
      watchShadowRoot();
      setEnvironment("detecting");
      detectionTimer = window.setTimeout(
        () => setEnvironment("demo-available"),
        DETECTION_GRACE_PERIOD,
      );
      return;
    }

    watchShadowRoot(host.shadowRoot ?? undefined);
    if (host.shadowRoot?.querySelector(EXTENSION_ROOT_SELECTOR)) {
      setEnvironment("extension-active");
      return;
    }

    setEnvironment("detecting");
    detectionTimer = window.setTimeout(() => {
      const currentHost = document.getElementById(EXTENSION_HOST_ID);
      if (currentHost?.shadowRoot?.querySelector(EXTENSION_ROOT_SELECTOR)) {
        setEnvironment("extension-active");
      } else if (currentHost) {
        setEnvironment("extension-hidden");
      } else {
        setEnvironment("demo-available");
      }
    }, DETECTION_GRACE_PERIOD);
  }

  trigger.addEventListener("click", () => {
    if (controller.environment === "demo-available") {
      setDemoEnabled(!controller.demoEnabled);
    } else if (controller.environment === "extension-hidden") {
      announce("Open the Crumbs toolbar button and choose Show.");
    } else if (controller.environment === "extension-active") {
      announce("The Crumbs extension outline is active.");
    }
  });
  document.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    if (target.closest("[data-crumbs-demo-activate]")) setDemoEnabled(true);
  });
  root
    .querySelector("[data-crumbs-demo-close]")
    ?.addEventListener("click", () => setDemoEnabled(false));
  pin.addEventListener("click", () => setPinned(!pinned));
  settingsButton.addEventListener("click", () =>
    setSettingsOpen(settings.hidden),
  );
  root
    .querySelector("[data-crumbs-demo-settings-close]")
    ?.addEventListener("click", () => setSettingsOpen(false));
  search.addEventListener("input", renderOutline);
  searchToggle.addEventListener("click", () =>
    setSearchOpen(depthRow.dataset.searchActive !== "true"),
  );
  root
    .querySelector("[data-crumbs-demo-search-clear]")
    ?.addEventListener("click", () => {
      search.value = "";
      renderOutline();
      search.focus();
    });
  depthButtons.forEach((button) =>
    button.addEventListener("click", () =>
      setMaxDepth(Number(button.dataset.crumbsDemoDepth)),
    ),
  );
  outline.addEventListener("mouseenter", () =>
    outline.classList.remove("is-collapsed"),
  );
  outline.addEventListener("mouseleave", () => {
    if (!pinned && settings.hidden) outline.classList.add("is-collapsed");
  });
  root
    .querySelector("[data-crumbs-demo-top]")
    ?.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: reducedMotion.matches ? "auto" : "smooth",
      });
    });
  root
    .querySelector("[data-crumbs-demo-bottom]")
    ?.addEventListener("click", () => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: reducedMotion.matches ? "auto" : "smooth",
      });
    });
  root
    .querySelector("[data-crumbs-demo-dock]")
    ?.addEventListener("click", () => {
      preferences.dock = preferences.dock === "right" ? "left" : "right";
      savePreferences(preferences);
      applyPreferences();
    });
  root
    .querySelectorAll<HTMLButtonElement>(
      "[data-crumbs-demo-accent-options] button",
    )
    .forEach((button) => {
      button.addEventListener("click", () => {
        preferences.accent = button.dataset.value ?? "caramel";
        savePreferences(preferences);
        applyPreferences();
      });
    });
  root
    .querySelectorAll<HTMLButtonElement>(
      "[data-crumbs-demo-dock-options] button",
    )
    .forEach((button) => {
      button.addEventListener("click", () => {
        preferences.dock = button.dataset.value as Preferences["dock"];
        savePreferences(preferences);
        applyPreferences();
      });
    });
  root.querySelectorAll<HTMLInputElement>("[data-quick]").forEach((input) => {
    input.addEventListener("change", () => {
      const key = input.dataset.quick as keyof Preferences["quick"];
      preferences.quick[key] = input.checked;
      savePreferences(preferences);
      applyPreferences();
    });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !settings.hidden) {
      event.preventDefault();
      setSettingsOpen(false);
      return;
    }
    if (!controller.demoEnabled || isEditableTarget(event.target)) return;
    const action = getDemoShortcutAction(event);
    if (action === "pin") {
      event.preventDefault();
      setPinned(!pinned);
    } else if (action === "search") {
      event.preventDefault();
      outline.classList.remove("is-collapsed");
      setSearchOpen(true);
    }
  });

  const hostObserver = new MutationObserver(evaluateEnvironment);
  hostObserver.observe(document.documentElement, { childList: true });
  const themeObserver = new MutationObserver(resolveTheme);
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  desktop.addEventListener("change", evaluateEnvironment);
  darkScheme.addEventListener("change", resolveTheme);
  window.addEventListener("scroll", scheduleActiveSectionUpdate, {
    passive: true,
  });
  window.addEventListener("resize", scheduleActiveSectionUpdate, {
    passive: true,
  });

  applyPreferences();
  setMaxDepth(maxDepth);
  evaluateEnvironment();
  scheduleActiveSectionUpdate();
}
