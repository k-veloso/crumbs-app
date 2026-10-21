---
layout: page
title: Reading Markdown
permalink: /markdown-reader/
---

# Reading Markdown with Crumbs

Crumbs formats eligible standalone Markdown documents and provides heading navigation. Choose **Rendered** for the reading view or **Raw** for the original Markdown text.

Crumbs remembers Raw-view choices locally for up to 500 documents. Choosing Rendered removes that document's exception. Document contents are never saved.

## Supported formatting

Crumbs supports common Markdown features including:

- Headings, lists, links, images, and block quotes
- Fenced code blocks with syntax highlighting and copying
- Tables, task lists, strikethrough, and automatic links
- Footnotes, definition lists, and GitHub-style alerts
- Mermaid diagrams with pan, zoom, and source copying
- Mathematical notation
- Theme-aware images and common README layouts

The rendered document follows your system's light or dark appearance.

## Automatic rendering

Open the popup's **Markdown** tab to manage automatic rendering. You can render all detected web Markdown documents or limit rendering with domain, URL-contains, and full-URL wildcard rules.

These rules do not convert ordinary HTML pages. Manual Rendered and Raw switching remains available for detected Markdown documents.

## Local Markdown files

Local Markdown is off by default:

1. Open the Crumbs popup.
2. Choose **Local Markdown files → Enable**.
3. Open Chrome's extension settings for Crumbs.
4. Enable **Allow access to file URLs**.
5. Refresh the Markdown file.

Both settings are required. Crumbs does not edit files or watch the disk for changes, so refresh the page after editing a local file.

## HTML and safety

Crumbs renders a supported subset of HTML. Unsafe attributes and URLs are removed. Restricted elements such as scripts, embedded frames, and forms are displayed as readable source rather than made interactive.

Markdown dialects vary, so some site-specific syntax may remain plain text. If a diagram or formula cannot be rendered, Crumbs keeps its source readable.
