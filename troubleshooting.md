---
layout: page
title: Troubleshooting
permalink: /troubleshooting/
---

# Troubleshooting

## The outline does not appear

- Open the Crumbs popup and confirm the outline is set to **Show**. Pin/unpin does not turn the outline on or off.
- Check whether the current site is excluded by your site rules.
- Refresh tabs that were already open when Crumbs was installed or updated.
- Chrome blocks extensions on some protected browser pages, including the Chrome Web Store and `chrome://` pages.
- **No headings found** means the page may not contain visible, meaningful headings that Crumbs can use.

## A heading is missing

Check the heading-level filter and increase its depth. If the heading is inside a collapsed group, expand its parent; searching can temporarily reveal matching descendants. **Only H1** indicates that only top-level headings are available.

Crumbs intentionally excludes hidden headings and page controls such as navigation, footers, sidebars, promotional sections, and duplicate tables of contents. It keeps article titles and substantive content headings when it can distinguish them from page controls. Dynamically loaded headings may take a moment to appear.

## A shortcut does not work

The current search default is **Option/Alt + Shift + V**, including when the outline is collapsed. Pin/unpin defaults to **Option/Alt + Shift + C**. Check **General → Shortcuts** for disabled or customized bindings, and use Reset if needed.

In-page shortcuts do not run while you are typing in an input or editor. Browser or operating-system shortcuts may take priority. Chrome manages the separate Settings shortcut: use **Set in Chrome shortcuts** to inspect **Activate the extension**. The suggested Option/Alt + Shift + X may be unassigned if it conflicts.

## Hover preview does not work

In **General → Shortcuts**, confirm **Hover preview** is enabled and check its selected key. Hold only that modifier, pause over a heading in the expanded outline, and avoid additional keys. The default is Shift; preview does not run while typing. Caps Lock is not supported.

Preview scrolls without changing the URL or showing a heading highlight, so the absence of those effects is expected. Release the modifier to stop previewing.

## Copy section link is missing or does not jump correctly

Crumbs hides the control for local files, some pages that use URL fragments for routing, or headings it cannot identify reliably. Repeated text may need enough surrounding context to create an unambiguous link.

Copied links use the page's own anchor where possible, or a text fragment. Their behavior depends on the destination page and browser. A page edit, access restriction, or browser without text-fragment support can prevent the expected jump. Markdown links target the original source document.

## A site or Markdown rule does not match

New rules use shared domains and wildcard patterns. `example.com/*` does not include subdomains; use `*.example.com/*` for those. `localhost/*` matches any port, while `localhost:5173/*` limits it to one port. Paths are case-sensitive, and new rules ignore query strings and fragments.

A bare path such as `/blog/` needs a domain or wildcards, such as `*/blog/*`. Invalid batches are not partially added, so fix the reported entry before submitting again. Open **Pattern examples** in the popup or see the [pattern guide]({{ '/getting-started/' | relative_url }}#domain-and-pattern-examples).

Older Markdown rules keep their original matching behavior and labels until removed. Check which type you are editing before comparing it with a new rule.

## Local Markdown is not rendered

Two controls must be enabled:

1. **Local Markdown files** in the Crumbs popup's Markdown tab.
2. **Allow access to file URLs** on Chrome's extension Details page.

**One more step required** means Chrome's permission is still off. Select **Open extension settings**, grant file access, and refresh the Markdown file. A green permission dot indicates that browser file access is granted.

Crumbs only renders eligible Markdown files. It does not edit files or watch the disk, so refresh after changing the file.

## Markdown stays in Raw view

Use the Rendered/Raw control to select **Rendered**. That removes the locally saved Raw preference for the document. Automatic-rendering URL rules can affect the initial view of detected web Markdown. **Show/Hide** controls the floating outline separately from the document's reading view.

## Markdown and the outline have different themes

This is expected: the document has its own Light/Dark/System preference. Change it from the document's palette icon or **Markdown → Style** in the popup. Glazed/Plain and Plain's theme control the floating outline separately. Mermaid diagrams retain a light canvas in either document theme.

## A Markdown image does not load

Images are requested from the location referenced by the document. The host may require authentication, block loading, or no longer contain the resource. Local images also require Chrome's file-access permission. Relative images resolve against the original document URL.

## HTML appears as code with an information icon

Hover over or focus the icon for an explanation. The markup may be restricted, such as a script or form, or simply outside Crumbs' supported HTML subset. The icon alone does not mean the document is harmful. Raw view preserves the original source.

## Still need help?

[Open a GitHub issue](https://github.com/k-veloso/crumbs-help/issues) with the page type, expected behavior, and what happened. Do not paste private page contents or credentials into a public issue.
