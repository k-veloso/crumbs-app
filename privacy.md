---
layout: page
title: Privacy Policy
permalink: /privacy/
---

# Privacy Policy for Crumbs - Navigate Any Page

Last updated: October 21, 2026

Crumbs helps people navigate structured web pages and read standalone Markdown documents. It processes page headings and eligible Markdown content in the current browser tab to provide these features.

## Information Crumbs handles

Crumbs handles the following information locally on the user's device:

- **Website content:** Visible page headings and the contents of eligible standalone Markdown documents are read to build the outline and rendered reader.
- **User preferences:** Appearance, accent, theme, keyboard shortcuts, visible quick buttons, site rules, and Markdown rendering settings.
- **Browsing-related preferences:** When a user chooses Raw view for a Markdown document, Crumbs stores that document's URL or local-file path so the choice can be restored. URL fragments are removed, while query strings remain part of the stored document identity. Crumbs keeps at most 500 of these entries.

Crumbs does not save the contents of web pages or Markdown documents.

## Local storage

Preferences are stored using Chrome's local extension storage. They remain on the user's device and are not synchronized by Crumbs or sent to a Crumbs server.

Site rules can be removed in the Crumbs popup. Choosing Rendered view removes the saved Raw-view preference for that document. Other locally stored information is removed when the extension is uninstalled.

## Network requests and third parties

The Crumbs extension has no account system, analytics, advertising, telemetry, or developer-operated backend. It does not sell or share user information with third parties.

When rendered Markdown references an image or another web resource, the browser may request that resource directly from the host named in the document. Those requests behave like ordinary browser requests and are subject to the referenced host's privacy practices. Clicking a link in a document navigates normally. Mermaid diagrams, syntax highlighting, and math rendering run from code packaged with the extension and do not use a rendering service.

This documentation site is hosted by GitHub Pages. Visiting it is subject to [GitHub's Privacy Statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement).

## Clipboard

Crumbs can write code, diagram source, or Markdown text to the clipboard only after the user selects a Copy control. Crumbs does not read the clipboard.

## Data use and sharing

Information handled by Crumbs is used only to provide the page outline, Markdown reader, and user-selected settings. It is not used for advertising, profiling, creditworthiness, lending, or purposes unrelated to the extension's single purpose.

Crumbs' use of information received from Google APIs adheres to the Chrome Web Store User Data Policy, including the Limited Use requirements.

## Security

Crumbs does not transmit handled page content or saved preferences to the developer. Because the extension processes information locally, users should still avoid enabling extensions on pages containing sensitive content unless they are comfortable granting the browser access described during installation.

## Changes to this policy

This policy will be updated when Crumbs' data practices change. The updated date at the top of this document identifies the latest revision. Material changes will also be disclosed in the Chrome Web Store listing and extension interface when required.

## Contact

For privacy questions, [open an issue in the Crumbs Help repository](https://github.com/k-veloso/crumbs-help/issues). Issues are public, so do not include passwords, private documents, health or financial information, or other sensitive personal information.
