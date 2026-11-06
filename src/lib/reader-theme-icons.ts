// Presentation icons reused from Crumbs public/markdownTheme.js.
export const markdownThemes = ["light", "dark", "system"] as const;
export type MarkdownTheme = (typeof markdownThemes)[number];
export const themeNames = { light: "Light", dark: "Dark", system: "System" };
const shapes = {
  light:
    '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41"/>',
  dark: '<path d="M20.2 15.2A8.5 8.5 0 0 1 8.8 3.8 8.5 8.5 0 1 0 20.2 15.2Z"/>',
  system:
    '<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 21h8M12 18v3"/>',
};
export const themeIcon = (theme: MarkdownTheme) =>
  `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${shapes[theme]}</svg>`;
