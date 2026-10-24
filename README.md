# Crumbs Help

Public help and privacy documentation for **Crumbs - Navigate Any Page**.

The published site is available at <https://k-veloso.github.io/crumbs-help/>.

## Content

- Getting started
- Reading Markdown
- Keyboard shortcuts
- Troubleshooting
- Privacy policy

This repository contains documentation only. The Crumbs extension source is maintained separately.

## Header logo

The header displays the local SVG configured by `logo` in `_config.yml`. Keep
`title` as text for page metadata and the logo's accessible label. Remove `logo`
to show the text title again.

The logo is copied from `k-veloso/crumbs` at
`public/brand/crumbs-lockup-horizontal.svg`. Its display size is set in
`assets/main.scss`; `_includes/header.html` preserves Minima's navigation and
uses `relative_url` so the image works under the GitHub Pages project path.

## Site styling

The help site keeps Minima as its Jekyll theme and overrides its layouts locally:

- `_layouts/home.html` supplies the homepage, guide cards, and outline illustration.
- `_layouts/page.html` supplies the article layout and guide navigation sidebar.
- `assets/main.scss` defines the extension-inspired Plain surfaces, Caramel accent,
  responsive layouts, and light/dark colors.
- `assets/site.js` enables the System/Light/Dark switch.
  The theme preference is stored locally in the browser. Without JavaScript, the
  site follows the system appearance and guide navigation remains available.

Guide content remains in the Markdown files at the repository root. Internal links
use `relative_url` to support the `/crumbs-help/` GitHub Pages project path.

## Content maintenance

The [October 24 extension review](_audit/2026-10-24-extension-pr-review.md) maps
merged extension PRs #4–#14 to the help-center updates and records the reviewed
source revision. Files in `_audit/` are maintenance notes, not published pages.
