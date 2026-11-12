---
layout: ../layouts/ArticleLayout.astro
title: Privacy Policy
description: How Crumbs handles page and ChatGPT content, question timestamps, preferences, local storage, network requests, and clipboard access.
---

# Privacy Policy for Crumbs – Page & ChatGPT Outline, Markdown & JSON Reader

Last updated: November 12, 2026

Crumbs helps people navigate structured web pages and supported AI conversations, and read standalone Markdown and JSON documents. It processes page headings and eligible Markdown and JSON content in the current browser tab to provide these features.

## Information Crumbs Handles

Crumbs handles the following information locally on the user's device:

- Website content: visible page headings and the contents of eligible standalone Markdown and JSON documents are read to build the outline and rendered reader.
- AI conversations: on supported ChatGPT pages, questions, user-facing answers, and answer headings are processed in memory for the current conversation outline and search. Native user-message creation times are read from page state when they can be matched to the current conversation. No additional conversation API request is made.
- Question timestamp records: conversation/message identifiers, timestamps, whether the time is native or locally recorded, and retention metadata are saved locally. With fallback recording enabled, Crumbs records an approximate time only for a matching new send observed while it is active; newly loaded history is not assigned a guessed time. AI Chat settings can disable recording or clear saved times. The timestamp store has a 2 MB budget and evicts older records as needed. Question and answer text is not persisted.
- User preferences: appearance, accent, theme, keyboard shortcuts, visible quick buttons, site rules, Markdown and JSON reader settings, and AI Chat settings.
- Browsing-related preferences: when a user chooses Raw view for a Markdown or JSON document, Crumbs stores a SHA-256 identifier derived from its URL or local-file path, together with the Raw preference and selection timestamp. The readable URL/path is not saved in new Raw-view entries. URL fragments are excluded before hashing; query strings remain part of document identity. Crumbs keeps at most 500 entries. Hashing reduces readable URL retention but is not encryption or a guarantee of anonymity.

Crumbs does not save the contents of web pages, Markdown or JSON documents.

## Local Storage

Preferences and saved question timestamp records are stored using Chrome's local extension storage. They remain on the user's device and are not synchronized by Crumbs or sent to a Crumbs server.

Site rules can be removed in the Crumbs popup. Choosing Rendered view removes the saved Raw-view preference for that document. Saved question times remain after a conversation or tab is closed. They are kept until cleared in AI Chat settings, evicted to meet the 2 MB storage budget, or removed when the extension is uninstalled. Disabling fallback recording stops new approximate times from being recorded; it does not delete existing records or prevent available native times from being saved. Clearing suppresses immediate saving again for conversations currently open in Crumbs. Other locally stored information is removed when the extension is uninstalled.

User-entered site and URL-pattern rules remain readable so they can be displayed, edited, and matched. Hashing happens locally, with no hashing service or new permissions.

## Network Requests and Third Parties

Crumbs has no account system, analytics, advertising, telemetry, or developer-operated backend. It does not sell or share user information with third parties.

When rendered Markdown references an image or another web resource, the browser may request that resource directly from the host named in the document. Those requests behave like ordinary browser requests and are subject to the referenced host's privacy practices. Clicking a link in a document navigates normally. Mermaid diagrams, syntax highlighting, math and JSON rendering run from code packaged with the extension and do not use a rendering service. JSON is read from the text already loaded in the tab; Crumbs does not request the response URL again.

This documentation site is hosted by GitHub Pages. Visiting it is subject to [GitHub's Privacy Statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement).

## Clipboard

Crumbs can write code, diagram source, Markdown text, JSON source values or JSON Pointer paths to the clipboard only after the user selects a Copy control. Crumbs does not read the clipboard.

## Data Use and Sharing

Information handled by Crumbs is used only to provide the page and conversation outlines, Markdown and JSON readers, and user-selected settings. It is not used for advertising, profiling, creditworthiness, lending, or purposes unrelated to the extension's single purpose.

Crumbs' use of information received from Google APIs adheres to the Chrome Web Store User Data Policy, including the Limited Use requirements.

## Security

Crumbs does not transmit handled page content or saved preferences to the developer. Because the extension processes information locally, users should still avoid enabling extensions on pages containing sensitive content unless they are comfortable granting the browser access described during installation.

## Changes to This Policy

This policy will be updated when Crumbs' data practices change. The updated date at the top of this document will identify the latest revision. Material changes will also be disclosed in the Chrome Web Store listing and extension interface when required.

## Contact

For privacy questions, email [karl.ext.dev@gmail.com](mailto:karl.ext.dev@gmail.com). You can also see our [contact page](../contact/) for support options. GitHub issues are public, so do not include passwords, private documents, health or financial information, or other sensitive personal information.
