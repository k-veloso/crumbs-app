---
title: Getting Started
description: Learn page navigation, site rules, appearance controls, and section links in Crumbs.
---

Crumbs requires Chrome 127 or newer. After installing it, open a page with headings. A narrow rail appears at the edge of supported pages.

## Try the Quick Start Guide

Crumbs opens an interactive Quick Start Guide when you first install it. Use it to practice expanding the outline, jumping between headings, pinning it open, and copying section links. It also includes optional setup for local Markdown and JSON files.

To open it again:

1. Open Crumbs from Chrome’s extension toolbar.
2. Select the **info icon** to open **About Crumbs**.
3. Select **Quick Start Guide**.

## Navigate a page

1. Expand the rail to see the page outline.
2. Select a heading to jump to that section.
3. Use search to narrow the outline by heading text. The search shortcut opens the outline even when it is collapsed.
4. Filter by heading level when you only want the document's major sections. Increase the depth to reveal deeper headings.
5. Pin the outline to keep it expanded, or unpin it to return to its hover behavior.

Crumbs tracks the section you are currently reading. You can dock the rail on either side of the page. Unpinning while your pointer is over the outline keeps it open until you move away. Pinning is separate from **Show/Hide** in the popup, which controls whether the floating outline appears at all.

Open settings from the browser toolbar or the **Settings** button beside Pin/Unpin in the expanded outline.

## Navigate a ChatGPT conversation

On **chatgpt.com**, Crumbs provides a conversation outline instead of a general page-heading outline. Jump between questions, answers, and headings inside answers. The three outline filters select these content types rather than H1–H3 depth. Open **AI Chat → ChatGPT** in settings to enable the conversation outline and choose whether to show question times.

Long conversations may only have some messages loaded. Use **Jump to Top**, or **Go to top** in the older-messages notice, to help ChatGPT load earlier messages. Wait for loading to finish and repeat if needed. See [ChatGPT Conversations](../chatgpt/) for the full workflow.

## Expand or collapse heading groups

Use the arrow beside a parent heading to hide or reveal its child headings. This lets you focus on one part of a long document without changing the page itself.

Groups stay collapsed when you close and reopen the outline, until the page reloads. Search temporarily reveals matching descendants; clearing search restores your collapsed groups. The open panel avoids shrinking as you change groups or heading depth; closing the outline resets its sizing.

## Preview a section while hovering

Hold <kbd>Shift</kbd> and pause over a heading in the expanded outline. After a short delay, Crumbs scrolls instantly to that section without a heading highlight or a URL change. The outline list stays in place as you move between headings.

Release the key to stop previewing. Hover preview is enabled by default. In **General → Controls → Keyboard shortcuts**, find **Hover preview** below Search to turn it off, edit its modifier key, or reset it to Shift.

You can choose Shift, Alt/Option, Control/Ctrl, or Command on Mac. Hold only the selected modifier, without other keys. Preview does not run while you are typing; Caps Lock is not supported as a preview key.

## Copy a section link

Use **Copy section link** beside a heading to copy a link you can paste elsewhere. Crumbs uses a page's own section anchor when available, or a text-fragment link when it can identify the heading reliably. Markdown links target the original source document rather than temporary reader IDs.

The control is hidden when Crumbs cannot create a reliable target, including local files, some pages that use the URL fragment for routing, and ambiguous repeated headings. Whether a pasted link jumps to the section depends on the destination page and the receiving browser's support.

## Choose where Crumbs appears

Crumbs starts with **All sites** selected, so the outline appears automatically on supported pages. You can keep that default or choose where it stays out of the way.

- **All sites:** show the outline on every supported page.
- **Specific sites:** show it automatically only on listed domains or URL patterns. Leave the list empty if you prefer to show it manually.
- **Except these:** show it automatically everywhere except your listed sites.

Open settings from the outline’s **gear icon** or Chrome’s extension toolbar, then go to **General → Where outlines appear**.

For a temporary change, use **Show/Hide** in the current-page card. Reloading the page resets that choice and applies your saved site rules again.

<span id="domain-and-pattern-examples"></span>

See [Choose where Crumbs appears](../choose-where-crumbs-appears/) for setup tips, domain and wildcard examples, and ways to manage your lists.

## Find your settings

- **General:** accent, outline appearance, where outlines appear, and Controls. Expand **Keyboard shortcuts** or **Quick buttons** under Controls to customize them.
- **Readers:** a shared reader appearance plus separate Markdown and JSON switches, local-file controls, and More options.
- **AI Chat:** ChatGPT conversation display and question-time settings.

The popup’s current-page card identifies the page type. Its **Show/Hide** control affects floating navigation, not a reader’s Rendered/Raw view.

## Find your extension version

Open the Crumbs settings popup and select the **info icon** at the top right. The **About Crumbs** panel shows your installed extension version and a link to help. Include that version when reporting a problem so we can check the right release.

## Appearance and quick buttons

- **Glazed** adapts its light/dark appearance and subtle tint to the page background.
- **Plain** provides solid Light, Dark, and System themes.

Choose from Toast, Ube, Blueberry, Velvet, Custard, and Matcha accents. The accent applies across the popup, outline, and heading-jump highlights.

Under **General → Controls → Quick buttons**, independently show or hide **Jump to Top**, **Jump to Bottom**, and **Dock Left / Right**. Markdown's Rendered/Raw control is separate.

Markdown and JSON documents share a Light/Dark/System reader setting, independent of the floating outline's appearance. See the [Markdown](../markdown-reader/#choose-a-reading-theme) and [JSON](../json-reader/#theme-and-saved-preferences) guides.

## Next steps

- [Learn about keyboard shortcuts](../shortcuts/)
- [Navigate ChatGPT conversations](../chatgpt/)
- [Read standalone Markdown](../markdown-reader/)
- [Explore standalone JSON](../json-reader/)
- [Troubleshoot common issues](../troubleshooting/)

Have an idea for Crumbs? [Send a feature request](../../contact/#feature-requests) through GitHub or email.
