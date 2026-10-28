---
layout: ../layouts/ArticleLayout.astro
title: Privacy Policy
description: How Crumbs handles page, Markdown, and JSON content, preferences, local storage, network requests, and clipboard access.
---

# Privacy Policy for Crumbs - Navigate Any Page

Last updated: October 28, 2026

Crumbs helps people navigate structured web pages and read standalone Markdown and JSON documents. It processes page headings and eligible Markdown or JSON content in the current browser tab to provide these features.

## Information Crumbs handles

Crumbs handles the following information locally on the user's device:

- **Website content:** Visible page headings and the contents of eligible standalone Markdown or JSON documents are read to build the outline and rendered readers.
- **User preferences:** Appearance, accent, theme, keyboard shortcuts, visible quick buttons, site rules, Markdown rendering settings, and document reader choices.
- **Browsing-related preferences:** When a user chooses Raw view for a Markdown or JSON document, Crumbs stores a hashed identifier derived from that document's URL or local-file path so the choice can be restored. URL fragments are removed, while query strings remain part of the document identity. Crumbs keeps at most 500 of these entries.

Crumbs does not save the contents of web pages, Markdown documents, or JSON responses.

## Local storage

Preferences are stored using Chrome's local extension storage. They remain on the user's device and are not synchronized by Crumbs or sent to a Crumbs server.

Site rules can be removed in the Crumbs popup. Choosing Rendered view removes the saved Raw-view preference for that Markdown or JSON document. Other locally stored information is removed when the extension is uninstalled.

## Network requests and third parties

The Crumbs extension has no account system, analytics, advertising, telemetry, or developer-operated backend. It does not sell or share user information with third parties.

When rendered Markdown references an image or another web resource, the browser may request that resource directly from the host named in the document. Those requests behave like ordinary browser requests and are subject to the referenced host's privacy practices. Clicking a link in a document navigates normally. Mermaid diagrams, syntax highlighting, and math rendering run from code packaged with the extension and do not use a rendering service.

For JSON reading, Crumbs uses the response text already loaded by Chrome. It does not request the endpoint again or send the response to a rendering service.

This documentation site is hosted by GitHub Pages. Visiting it is subject to [GitHub's Privacy Statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement).

## Clipboard

Crumbs can write code, diagram source, Markdown text, raw JSON, JSON values, properties, pointers, or paths to the clipboard only after the user selects a Copy control. Crumbs does not read the clipboard.

## Data use and sharing

Information handled by Crumbs is used only to provide the page outline, Markdown and JSON readers, and user-selected settings. It is not used for advertising, profiling, creditworthiness, lending, or purposes unrelated to the extension's single purpose.

Crumbs' use of information received from Google APIs adheres to the Chrome Web Store User Data Policy, including the Limited Use requirements.

## Security

Crumbs does not transmit handled page content or saved preferences to the developer. Because the extension processes information locally, users should still avoid enabling extensions on pages containing sensitive content unless they are comfortable granting the browser access described during installation.

## Changes to this policy

This policy will be updated when Crumbs' data practices change. The updated date at the top of this document identifies the latest revision. Material changes will also be disclosed in the Chrome Web Store listing and extension interface when required.

## Contact

For privacy questions, see our [contact page](../contact/) for GitHub options. GitHub issues are public, so do not include passwords, private documents, health or financial information, or other sensitive personal information.
