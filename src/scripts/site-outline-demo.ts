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
// Presentation palette from the private visual fixture, with no runtime imports.
const ACCENTS: Record<string, [string, string]> = {
  caramel: ["#c65d00", "#e88a34"],
  ube: ["#7950b5", "#bb99ed"],
  blueberry: ["#2463b5", "#7bb6fa"],
  velvet: ["#ba3649", "#f38b9a"],
  custard: ["#8a6800", "#e9c75b"],
  matcha: ["#4c752d", "#a5ca79"],
};

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
  return (
    document.querySelector<HTMLElement>(
      `[data-crumbs-demo-target="${CSS.escape(item.id)}"]`,
    ) ?? document.getElementById(item.id)
  );
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

  // The header has its own translucent backdrop. Keep the trigger there, but
  // mount the demo surface at the page level so its glass samples the actual
  // page behind it, matching the extension fixture's isolated host.
  outline.dataset.crumbsDemoPortal = "true";
  document.body.append(outline);

  const panel = outline.querySelector<HTMLElement>(".crumbs-demo-panel")!;
  const expandedParts = [
    ...panel.querySelectorAll<HTMLElement>(
      ".crumbs-demo-panel-header, .crumbs-demo-depth-row, .crumbs-demo-list-wrap",
    ),
  ];
  const listWrap = panel.querySelector<HTMLElement>(".crumbs-demo-list-wrap")!;
  const tooltip = document.createElement("div");
  tooltip.className = "crumbs-demo-tooltip";
  tooltip.setAttribute("role", "tooltip");
  tooltip.hidden = true;
  outline.append(tooltip);

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
  let tooltipTimer = 0;
  let collapseTimer = 0;
  let railExpansionTimer = 0;
  let searchHeight: number | null = null;
  let observedShadowRoot: ShadowRoot | undefined;
  let shadowObserver: MutationObserver | undefined;

  function announce(message: string) {
    window.clearTimeout(statusTimer);
    status.textContent = message;
    statusTimer = window.setTimeout(() => {
      status.textContent = "";
    }, 2200);
  }

  // Controlled website surfaces only. No extension page sampler or heuristics.
  const demoSurfaces = [
    ...document.querySelectorAll<HTMLElement>("[data-crumbs-demo-surface]"),
  ];
  function resolveTheme() {
    const pageIsDark =
      document.documentElement.dataset.theme === "dark" ||
      (!document.documentElement.dataset.theme && darkScheme.matches);
    const bounds = panel.getBoundingClientRect();
    const x = bounds.left + bounds.width / 2;
    const y = bounds.top + bounds.height / 2;
    const surface = demoSurfaces.find((element) => {
      const rect = element.getBoundingClientRect();
      return (
        x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
      );
    });
    const theme =
      surface?.dataset.crumbsDemoSurface ?? (pageIsDark ? "dark" : "light");
    outline.dataset.resolvedTheme = theme;
    const page = getComputedStyle(document.documentElement);
    const tint =
      surface?.dataset.crumbsDemoTint ||
      page.getPropertyValue("--page").trim() ||
      page.getPropertyValue("--sl-color-black").trim() ||
      (pageIsDark ? "#171c24" : "#f7f7f5");
    outline.style.setProperty("--crumbs-page-tint", tint);
    const index = theme === "dark" ? 1 : 0;
    outline.style.setProperty(
      "--crumbs-accent",
      (ACCENTS[preferences.accent] ?? ACCENTS.caramel)[index],
    );
    outline
      .querySelectorAll<HTMLElement>("[data-crumbs-demo-accent-options] button")
      .forEach((button) => {
        button.style.setProperty(
          "--swatch",
          (ACCENTS[button.dataset.value ?? ""] ?? ACCENTS.caramel)[index],
        );
      });
  }

  function hideTooltip() {
    window.clearTimeout(tooltipTimer);
    tooltip.hidden = true;
  }

  function showTooltip(element: HTMLElement, text: string) {
    hideTooltip();
    tooltipTimer = window.setTimeout(() => {
      if (!element.isConnected) return;
      tooltip.textContent = text;
      tooltip.hidden = false;
      const rect = element.getBoundingClientRect();
      const rootRect = outline.getBoundingClientRect();
      const tip = tooltip.getBoundingClientRect();
      const left =
        preferences.dock === "right"
          ? rect.left - tip.width - 12
          : rect.right + 12;
      tooltip.style.left = `${Math.max(8, Math.min(innerWidth - tip.width - 8, left)) - rootRect.left}px`;
      tooltip.style.top = `${Math.max(8, Math.min(innerHeight - tip.height - 8, rect.top + rect.height / 2 - tip.height / 2)) - rootRect.top}px`;
    }, 120);
  }

  function setCollapsed(collapsed: boolean) {
    hideTooltip();
    outline.classList.toggle("is-collapsed", collapsed);
    expandedParts.forEach((part) => {
      part.hidden = collapsed;
      part.inert = collapsed;
    });
    rail.hidden = !collapsed;
    if (
      !collapsed &&
      depthRow.dataset.searchActive === "true" &&
      searchHeight !== null
    )
      panel.style.height = `${searchHeight}px`;
    else panel.style.removeProperty("height");
    requestAnimationFrame(resolveTheme);
  }

  function scheduleCollapse() {
    window.clearTimeout(collapseTimer);
    collapseTimer = window.setTimeout(() => {
      if (
        !pinned &&
        settings.hidden &&
        !outline.matches(":hover") &&
        !outline.querySelector(":focus-visible")
      )
        setCollapsed(true);
    }, 120);
  }

  function applyPreferences() {
    outline.dataset.accent = preferences.accent;
    root.dataset.accent = preferences.accent;
    outline.dataset.dock = preferences.dock;
    resolveTheme();
    outline.style.setProperty(
      "--crumbs-quick-height",
      `${Math.max(0, Object.values(preferences.quick).filter(Boolean).length * 40 - 10)}px`,
    );
    const dockButton = outline.querySelector<HTMLElement>(
      "[data-crumbs-demo-dock]",
    );
    if (dockButton)
      dockButton.dataset.tooltip = `Dock ${preferences.dock === "right" ? "left" : "right"}`;

    outline
      .querySelectorAll<HTMLButtonElement>(
        "[data-crumbs-demo-accent-options] button",
      )
      .forEach((button) => {
        button.setAttribute(
          "aria-pressed",
          String(button.dataset.value === preferences.accent),
        );
      });
    outline
      .querySelectorAll<HTMLInputElement>("[data-quick]")
      .forEach((input) => {
        const key = input.dataset.quick as keyof Preferences["quick"];
        input.checked = preferences.quick[key];
      });
    outline
      .querySelector<HTMLButtonElement>("[data-crumbs-demo-top]")
      ?.toggleAttribute("hidden", !preferences.quick.top);
    outline
      .querySelector<HTMLButtonElement>("[data-crumbs-demo-bottom]")
      ?.toggleAttribute("hidden", !preferences.quick.bottom);
    outline
      .querySelector<HTMLButtonElement>("[data-crumbs-demo-dock]")
      ?.toggleAttribute("hidden", !preferences.quick.dock);
    outline
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
    pin.dataset.tooltip = pinned ? "Unpin sidebar" : "Pin sidebar";
    setCollapsed(
      !pinned &&
        !outline.matches(":hover") &&
        !outline.querySelector(":focus-visible"),
    );
    announce(pinned ? "Outline pinned" : "Outline unpinned");
  }

  function renderRail() {
    const widths = [28, 22, 16, 12, 10, 8];
    const previousScroll = rail.scrollTop;
    rail.replaceChildren(
      ...flatItems
        .filter((item) => item.level <= maxDepth)
        .map((item) => {
          const button = document.createElement("button");
          button.type = "button";
          button.setAttribute("aria-label", item.label);
          button.dataset.id = item.id;
          if (item.id === activeId)
            button.setAttribute("aria-current", "location");
          const bar = document.createElement("span");
          bar.style.width = `${widths[item.level - 1] ?? 8}px`;
          button.append(bar);
          button.addEventListener("click", () => navigateTo(item));
          return button;
        }),
    );
    rail.scrollTop = previousScroll;
  }

  function updateActiveRows() {
    list.querySelectorAll<HTMLElement>(".crumbs-demo-row").forEach((row) => {
      const active = row.dataset.id === activeId;
      row.classList.toggle("is-active", active);
      if (active)
        row.querySelector("a")?.setAttribute("aria-current", "location");
      else row.querySelector("a")?.removeAttribute("aria-current");
    });
    rail.querySelectorAll<HTMLElement>("button").forEach((button) => {
      if (button.dataset.id === activeId)
        button.setAttribute("aria-current", "location");
      else button.removeAttribute("aria-current");
    });
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
      const accent =
        getComputedStyle(outline).getPropertyValue("--crumbs-accent");
      target.style.setProperty(
        "--crumbs-target-highlight",
        `color-mix(in srgb, ${accent} 30%, transparent)`,
      );
      target.classList.add("crumbs-demo-target-highlight");
      window.setTimeout(() => {
        target.classList.remove("crumbs-demo-target-highlight");
        target.style.removeProperty("--crumbs-target-highlight");
      }, 1400);
    }
    updateActiveRows();
  }

  function createItem(item: OutlineItem) {
    const li = document.createElement("li");
    const row = document.createElement("div");
    const toggle = document.createElement("button");
    const link = document.createElement("a");
    const copy = document.createElement("button");

    row.className = "crumbs-demo-row";
    row.dataset.id = item.id;
    row.style.fontSize = `${12.35 - (item.level - 1) * 0.475}px`;
    row.classList.toggle("is-active", item.id === activeId);
    row.style.setProperty(
      "--crumbs-item-indent",
      `${7.6 + Math.max(0, item.level - 1) * 11.4}px`,
    );

    toggle.type = "button";
    const collapsed = collapsedIds.has(item.id);
    toggle.innerHTML = `<svg viewBox="0 -960 960 960" aria-hidden="true"><path fill="currentColor" d="${collapsed ? "M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" : "M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z"}"/></svg>`;
    toggle.dataset.tooltip = collapsed ? "Expand" : "Collapse";
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
    link.dataset.fullLabel = item.label;
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
    copy.innerHTML =
      '<svg viewBox="0 -960 960 960" aria-hidden="true"><path fill="currentColor" d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/></svg>';
    copy.dataset.tooltip = "Copy section link";
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

    if (item.children.length) {
      const children = document.createElement("ul");
      children.className = "crumbs-demo-list";
      children.append(...item.children.map(createItem));
      li.append(children);
    }
    return li;
  }

  function renderOutline() {
    const clear = outline.querySelector<HTMLButtonElement>(
      "[data-crumbs-demo-search-clear]",
    );
    if (clear) clear.hidden = !search.value;
    const visible = filterOutlineItems(items, {
      query: search.value,
      maxLevel: maxDepth,
      collapsedIds,
    }) as OutlineItem[];
    const scrollTop = listWrap.scrollTop;
    list.replaceChildren(...visible.map(createItem));
    listWrap.scrollTop = scrollTop;
    updateActiveRows();
    empty.hidden = visible.length > 0;
    renderRail();
  }

  function updateActiveSection() {
    scrollFrame = 0;
    resolveTheme();
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
      updateActiveRows();
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
      setCollapsed(false);
      settings.querySelector<HTMLElement>("button, input, select")?.focus();
    } else {
      settingsButton.focus();
    }
  }

  function setSearchOpen(open: boolean) {
    if (open && depthRow.dataset.searchActive !== "true") {
      setCollapsed(false);
      // Measure at the expanded width, even when invoked from the narrow rail.
      panel.style.width = "228.36px";
      searchHeight = panel.getBoundingClientRect().height;
      panel.style.removeProperty("width");
      panel.style.height = `${searchHeight}px`;
    }
    if (!open) {
      searchHeight = null;
      panel.style.removeProperty("height");
    }
    depthRow.dataset.searchActive = String(open);
    outline.querySelector<HTMLElement>(".crumbs-demo-depth-track")!.inert =
      open;
    searchToggle.dataset.active = String(open);
    searchToggle.setAttribute(
      "aria-label",
      open ? "Hide search" : "Show search",
    );
    searchToggle.dataset.tooltip = open ? "Hide search" : "Show search";
    if (open) requestAnimationFrame(() => search.focus());
    else {
      search.value = "";
      renderOutline();
    }
  }

  function setMaxDepth(nextDepth: number) {
    maxDepth = Math.max(1, Math.min(3, nextDepth));
    const track = outline.querySelector<HTMLElement>(
      ".crumbs-demo-depth-track",
    )!;
    track.setAttribute("aria-valuenow", String(maxDepth));
    track.setAttribute("aria-label", `Show headings up to level H${maxDepth}`);
    depthButtons.forEach((button) => {
      const level = Number(button.dataset.crumbsDemoDepth);
      button.dataset.enabled = String(level <= maxDepth);
      button.dataset.active = String(level === maxDepth);
    });
    const fill = outline.querySelector<HTMLElement>(".crumbs-demo-depth-fill");
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
      setCollapsed(!pinned);
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
  outline
    .querySelector("[data-crumbs-demo-close]")
    ?.addEventListener("click", () => setDemoEnabled(false));
  pin.addEventListener("click", () => setPinned(!pinned));
  settingsButton.addEventListener("click", () =>
    setSettingsOpen(settings.hidden),
  );
  outline
    .querySelector("[data-crumbs-demo-settings-close]")
    ?.addEventListener("click", () => setSettingsOpen(false));
  search.addEventListener("input", renderOutline);
  search.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      if (search.value) {
        search.value = "";
        renderOutline();
      } else {
        setSearchOpen(false);
        searchToggle.focus();
      }
    } else if (event.key === "Enter") {
      event.preventDefault();
      const first = filterOutlineItems(items, {
        query: search.value,
        maxLevel: maxDepth,
        collapsedIds,
      })[0];
      if (first) navigateTo(first);
    }
  });
  searchToggle.addEventListener("click", () =>
    setSearchOpen(depthRow.dataset.searchActive !== "true"),
  );
  outline
    .querySelector("[data-crumbs-demo-search-clear]")
    ?.addEventListener("click", () => {
      search.value = "";
      renderOutline();
      search.focus();
    });
  const depthTrack = outline.querySelector<HTMLElement>(
    ".crumbs-demo-depth-track",
  )!;
  depthTrack.addEventListener("keydown", (event) => {
    const next =
      event.key === "Home"
        ? 1
        : event.key === "End"
          ? 3
          : ["ArrowRight", "ArrowUp"].includes(event.key)
            ? maxDepth + 1
            : ["ArrowLeft", "ArrowDown"].includes(event.key)
              ? maxDepth - 1
              : null;
    if (next !== null) {
      event.preventDefault();
      setMaxDepth(next);
    }
  });
  depthButtons.forEach((button) => {
    button.addEventListener("click", () =>
      setMaxDepth(Number(button.dataset.crumbsDemoDepth)),
    );
    button.addEventListener("pointerdown", (event) => {
      if (button.dataset.active !== "true" || event.button !== 0) return;
      event.preventDefault();
      button.setPointerCapture(event.pointerId);
      const update = (move: PointerEvent) => {
        const rect = depthTrack.getBoundingClientRect();
        const ratio = Math.max(
          0,
          Math.min(1, (move.clientX - rect.left) / Math.max(1, rect.width)),
        );
        setMaxDepth(1 + Math.round(ratio * 2));
      };
      const finish = () => {
        button.removeEventListener("pointermove", update);
      };
      button.addEventListener("pointermove", update);
      button.addEventListener("lostpointercapture", finish, { once: true });
    });
  });
  outline.addEventListener("mouseenter", () => {
    window.clearTimeout(collapseTimer);
    // Retain the rail briefly so a rail click remains possible before expansion.
    railExpansionTimer = window.setTimeout(() => setCollapsed(false), 160);
  });
  outline.addEventListener("mouseleave", () => {
    window.clearTimeout(railExpansionTimer);
    window.clearTimeout(hoverTimer);
    hideTooltip();
    scheduleCollapse();
  });
  outline.addEventListener("focusin", (event) => {
    window.clearTimeout(collapseTimer);
    if (!rail.contains(event.target as Node)) setCollapsed(false);
    const target = event.target as HTMLElement;
    const text =
      target.dataset.tooltip ??
      target.dataset.fullLabel ??
      (rail.contains(target) ? target.getAttribute("aria-label") : null);
    if (text) showTooltip(target, text);
  });
  outline.addEventListener("focusout", scheduleCollapse);
  outline.addEventListener("pointerover", (event) => {
    const target = (event.target as Element).closest<HTMLElement>(
      "[data-tooltip], [data-full-label], .crumbs-demo-rail button",
    );
    if (!target) return;
    if (target.contains((event as PointerEvent).relatedTarget as Node)) return;
    if (
      target.dataset.fullLabel &&
      target.scrollWidth <= target.clientWidth + 1
    )
      return;
    showTooltip(
      target,
      target.dataset.tooltip ??
        target.dataset.fullLabel ??
        target.getAttribute("aria-label") ??
        "",
    );
  });
  outline.addEventListener("pointerout", hideTooltip);
  outline
    .querySelectorAll<HTMLElement>("button[aria-label]")
    .forEach((button) => {
      if (!button.dataset.tooltip && !button.closest(".crumbs-demo-settings"))
        button.dataset.tooltip = button.getAttribute("aria-label")!;
      button.removeAttribute("title");
    });
  outline
    .querySelector("[data-crumbs-demo-top]")
    ?.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: reducedMotion.matches ? "auto" : "smooth",
      });
    });
  outline
    .querySelector("[data-crumbs-demo-bottom]")
    ?.addEventListener("click", () => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: reducedMotion.matches ? "auto" : "smooth",
      });
    });
  outline
    .querySelector("[data-crumbs-demo-dock]")
    ?.addEventListener("click", () => {
      preferences.dock = preferences.dock === "right" ? "left" : "right";
      savePreferences(preferences);
      applyPreferences();
    });
  outline
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
  outline
    .querySelectorAll<HTMLInputElement>("[data-quick]")
    .forEach((input) => {
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
      setCollapsed(false);
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
