---
layout: page
title: Troubleshooting
permalink: /troubleshooting/
---

# Troubleshooting

## The outline does not appear

- Open the Crumbs popup and confirm the outline is set to **Show**.
- Check whether the current site is excluded by your site rules.
- Refresh tabs that were already open when Crumbs was installed or updated.
- Chrome blocks extensions on some protected browser pages, including the Chrome Web Store and `chrome://` pages.
- Pages without visible, meaningful headings may not produce an outline.

## A heading is missing

Crumbs intentionally excludes hidden headings and headings inside page chrome such as navigation, headers, footers, sidebars, promotional areas, breadcrumbs, and duplicate table-of-contents blocks. Dynamically loaded headings may take a moment to appear.

## Local Markdown is not rendered

Two controls must be enabled:

1. **Local Markdown files** in the Crumbs popup.
2. **Allow access to file URLs** on Chrome's extension details page.

Refresh the file after changing either setting. Crumbs only renders eligible Markdown files; it ignores other local file types.

## Markdown stays in Raw view

Use the Rendered/Raw control to select **Rendered**. That removes the locally saved Raw preference for the document. Automatic-rendering URL rules can affect the initial view of detected web Markdown.

## A Markdown image does not load

Images are requested from the location referenced by the document. The host may require authentication, block cross-origin loading, or no longer contain the resource. Local images also require Chrome's file-access permission.

## Still need help?

[Open a GitHub issue](https://github.com/k-veloso/crumbs-help/issues) with the page type, expected behavior, and what happened. Do not paste private page contents or credentials into a public issue.
