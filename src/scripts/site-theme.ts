// Presentation menu adapted from Crumbs src/markdown/themeControls.ts.
import {
  markdownThemes,
  themeIcon,
  themeNames,
  type MarkdownTheme,
} from "../lib/reader-theme-icons";
const PALETTE_PATH =
  "M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 32.5-156t88-127Q256-817 330-848.5T488-880q80 0 151 27.5t124.5 76q53.5 48.5 85 115T880-518q0 115-70 176.5T640-280h-74q-9 0-12.5 5t-3.5 11q0 12 15 34.5t15 51.5q0 50-27.5 74T480-80Zm0-400Zm-177 23q17-17 17-43t-17-43q-17-17-43-17t-43 17q-17 17-17 43t17 43q17 17 43 17t43-17Zm120-160q17-17 17-43t-17-43q-17-17-43-17t-43 17q-17 17-17 43t17 43q17 17 43 17t43-17Zm200 0q17-17 17-43t-17-43q-17-17-43-17t-43 17q-17 17-17 43t17 43q17 17 43 17t43-17Zm120 160q17-17 17-43t-17-43q-17-17-43-17t-43 17q-17 17-17 43t17 43q17 17 43 17t43-17ZM480-160q9 0 14.5-5t5.5-13q0-14-15-33t-15-57q0-42 29-67t71-25h70q66 0 113-38.5T800-518q0-121-92.5-201.5T488-800q-136 0-232 93t-96 227q0 133 93.5 226.5T480-160Z";
export const attachThemeControls = (
  host: HTMLElement,
  signal: AbortSignal,
  select: (theme: MarkdownTheme) => Promise<void>,
  label = "Theme",
) => {
  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "crumbs-reader-theme-button";
  trigger.setAttribute("aria-label", label);
  trigger.setAttribute("aria-haspopup", "menu");
  trigger.setAttribute("aria-expanded", "false");
  trigger.innerHTML = `<svg aria-hidden="true" viewBox="0 -960 960 960" fill="currentColor"><path d="${PALETTE_PATH}"/></svg>`;
  const menu = document.createElement("div");
  menu.className = "crumbs-reader-theme-menu";
  menu.hidden = true;
  menu.id = "site-theme-menu";
  menu.setAttribute("role", "menu");
  menu.setAttribute("aria-label", label);
  trigger.setAttribute("aria-controls", menu.id);
  host.append(trigger, menu);
  const buttons = markdownThemes.map((theme) => {
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("role", "menuitemradio");
    button.tabIndex = -1;
    button.innerHTML = `${themeIcon(theme)}<span>${themeNames[theme]}</span>`;
    menu.append(button);
    button.addEventListener(
      "click",
      () => {
        close(true);
        void select(theme);
      },
      { signal },
    );
    return button;
  });
  const close = (focus = false) => {
    menu.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
    if (focus) trigger.focus({ preventScroll: true });
  };
  const open = () => {
    menu.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
    (
      buttons.find(
        (button) => button.getAttribute("aria-checked") === "true",
      ) ?? buttons[0]
    ).focus({ preventScroll: true });
  };
  trigger.addEventListener("click", () => (menu.hidden ? open() : close()), {
    signal,
  });
  trigger.addEventListener(
    "keydown",
    (event) => {
      if (["ArrowDown", "ArrowUp"].includes(event.key)) {
        event.preventDefault();
        open();
      }
    },
    { signal },
  );
  menu.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        close(true);
      }
      if (event.key === "Tab") close();
      if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const current = buttons.indexOf(
        document.activeElement as HTMLButtonElement,
      );
      const index =
        event.key === "Home"
          ? 0
          : event.key === "End"
            ? 2
            : (current + (event.key === "ArrowDown" ? 1 : -1) + 3) % 3;
      buttons[index].focus({ preventScroll: true });
    },
    { signal },
  );
  document.addEventListener(
    "pointerdown",
    (event) => {
      if (!host.contains(event.target as Node)) close();
    },
    { signal },
  );
  document.addEventListener(
    "focusin",
    (event) => {
      if (!host.contains(event.target as Node)) close();
    },
    { signal },
  );
  window.addEventListener("scroll", () => close(), { capture: true, signal });
  window.addEventListener("resize", () => close(), { signal });
  return (theme: MarkdownTheme) =>
    buttons.forEach((button, index) =>
      button.setAttribute(
        "aria-checked",
        String(markdownThemes[index] === theme),
      ),
    );
};

export function initSiteTheme() {
  const host = document.querySelector<HTMLElement>("[data-site-theme]");
  if (!host) return;
  const root = document.documentElement;
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)");
  const isHelp = host.hasAttribute("data-starlight-theme");
  let preference: MarkdownTheme = "system";
  try {
    const saved = localStorage.getItem("starlight-theme");
    if (saved === "light" || saved === "dark") preference = saved;
  } catch {
    if (root.dataset.theme === "light" || root.dataset.theme === "dark")
      preference = root.dataset.theme;
  }
  function applyTheme() {
    if (preference !== "system") root.dataset.theme = preference;
    else if (isHelp) root.dataset.theme = systemDark.matches ? "dark" : "light";
    else delete root.dataset.theme;
  }
  const update = attachThemeControls(
    host,
    new AbortController().signal,
    async (theme) => {
      preference = theme;
      applyTheme();
      update(preference);
      try {
        localStorage.setItem(
          "starlight-theme",
          theme === "system" ? "" : theme,
        );
      } catch {}
    },
  );
  systemDark.addEventListener("change", () => {
    if (preference === "system") applyTheme();
  });
  applyTheme();
  update(preference);
}
