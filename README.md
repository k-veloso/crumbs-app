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
