---
title: Reading Markdown with Crumbs
description: Render, theme, copy, and safely read standalone Markdown documents with Crumbs.
---

Crumbs formats eligible standalone Markdown documents and provides heading navigation in both views. Choose **Rendered** for the reading view or **Raw** for the original Markdown text.

Crumbs remembers Raw-view choices locally for up to 500 documents. Choosing Rendered removes that document's exception. Document contents are never saved.

## Supported formatting

Crumbs supports common Markdown features including:

- Headings, lists, links, images, and block quotes
- Fenced code blocks with syntax highlighting and copying
- Tables, task lists, strikethrough, and automatic web and email links
- Footnotes, definition lists, and GitHub-style alerts
- Mermaid diagrams with pan, zoom, and source copying
- Mathematical notation
- Theme-aware images and common README layouts

Code blocks show their declared language. Blocks without a declared language show `plaintext`; Crumbs does not guess the language.

README layouts can preserve supported image sizes, centered headings and paragraphs, table cell widths, and vertical alignment. Theme-aware `<picture>` images can choose light/dark sources. Relative images resolve against the original document URL. Wide tables scroll horizontally, including with the keyboard, while prose stays in a readable column.

## Choose a reading theme

Markdown defaults to **System**, following your system's light or dark appearance. Select **Light**, **Dark**, or **System** from the palette icon at the document's top right, or under **Markdown → Style** in the extension popup.

This preference saves locally and applies across open Markdown documents in both Rendered and Raw views. It is independent of the Glazed/Plain style and Plain theme used by the floating outline. Mermaid diagrams use a light canvas in either reading theme.

## Copy Markdown, code, or diagram source

- **Copy raw Markdown**, at the document's top right in either view, copies the entire original source, including formatting and front matter. It remains available when the floating outline is hidden.
- The copy button above a code block copies its text with indentation and line breaks, without Markdown fence markers.
- The copy button beside a Mermaid diagram's zoom controls copies the original diagram source, rather than an image.

Copy controls show hints on hover or focus and a short confirmation after success. Crumbs writes to the clipboard only after you select a Copy control; it does not read the clipboard.

For Mermaid diagrams, drag to pan, use the zoom controls, or select the percentage to reset to fit.

## Automatic rendering

Open the popup's **Markdown** tab and turn on **Render Markdown automatically**. Under **Websites**, choose **All detected Markdown** or **Only matching URLs**.

For matching URLs, enter domains or wildcard patterns separated by commas. These use the same [domain and pattern syntax](../getting-started/#domain-and-pattern-examples) as General's Specific sites and Except these lists. For example, `example.com/*` matches one domain, `*.example.com/*` includes its subdomains, and `localhost/*` matches localhost on any port.

Use **Add current site**, remove entries individually, or open the list menu for **Copy all** and **Clear all**. **Undo** can restore a cleared list while its feedback is visible. Invalid batches are not partially added; duplicates are ignored.

Older saved Domain, URL contains, and URL wildcard rules retain their original labels and matching behavior until removed. New entries use the shared pattern syntax. In particular, older Domain rules may include subdomains, and older URL contains rules may match query strings; new rules ignore query strings and fragments.

These settings do not convert ordinary HTML pages, GitHub's already-rendered file pages, code snippets inside web pages, or files delivered as downloads. Manual Rendered and Raw switching remains available for detected Markdown documents when automatic rendering is off. Rendering settings are separate from **Show/Hide**, which controls the floating outline.

## Local Markdown files

Local Markdown is off by default:

1. Open the Crumbs popup's **Markdown** tab.
2. Enable **Local Markdown files**.
3. Select **Open extension settings** if **One more step required** appears.
4. On Crumbs' Chrome Details page, enable **Allow access to file URLs**.
5. Refresh the Markdown file.

Both settings are required. A green permission dot indicates that Chrome's file access is granted. Local Markdown works independently of the Specific sites and Except these lists. **Show/Hide** does not remove the formatted document; you can still choose Rendered or Raw in the popup.

Crumbs does not edit files or watch the disk for changes, so refresh the page after editing a local file. Local images also need Chrome's file-access permission.

## HTML shown as source

Markdown can include HTML. Crumbs renders a supported subset, including tables and expandable disclosures. Unsupported or restricted HTML appears as its original markup with an information icon. Hover over or focus the icon for details.

The icon does not necessarily mean the document is harmful. Scripts, embedded frames, and forms are restricted intentionally; other elements can be harmless but outside the supported formatting. Code examples inside backticks or fenced blocks stay ordinary code examples.

Unsafe attributes, event handlers, and links are removed. Arbitrary source CSS is not preserved. Original markup remains available in Raw view, and Crumbs does not change the source file.

## Formatting limitations

Markdown dialects vary, so site-specific mentions, issue references, and custom syntax may remain plain text. Crumbs does not promise identical results for every GitHub page or Markdown extension.

Image dimensions are bounded. Theme-aware picture sources support light/dark color-scheme queries, rather than arbitrary media queries or CSS. Images may still depend on access to their original host.

Document-supplied Mermaid configuration and interactive callbacks are not enabled. If a diagram or formula cannot be rendered, Crumbs keeps its source readable. Code languages without highlighting support remain plain code.
