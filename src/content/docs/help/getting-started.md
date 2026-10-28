---
title: Getting Started
description: Learn page navigation, site rules, appearance controls, and section links in Crumbs.
---

Crumbs requires Chrome 127 or newer. After installing it, open a page with headings. A narrow rail appears at the edge of supported pages.

## Navigate a page

1. Expand the rail to see the page outline.
2. Select a heading to jump to that section.
3. Use search to narrow the outline by heading text. The search shortcut opens the outline even when it is collapsed.
4. Filter by heading level when you only want the document's major sections. Increase the depth to reveal deeper headings.
5. Pin the outline to keep it expanded, or unpin it to return to its hover behavior.

Crumbs tracks the section you are currently reading. You can dock the rail on either side of the page. Unpinning while your pointer is over the outline keeps it open until you move away. Pinning is separate from **Show/Hide** in the popup, which controls whether the floating outline appears at all.

Open settings from the browser toolbar or the **Settings** button beside Pin/Unpin in the expanded outline.

## Expand or collapse heading groups

Use the arrow beside a parent heading to hide or reveal its child headings. This lets you focus on one part of a long document without changing the page itself.

Groups stay collapsed when you close and reopen the outline, until the page reloads. Search temporarily reveals matching descendants; clearing search restores your collapsed groups. The open panel avoids shrinking as you change groups or heading depth; closing the outline resets its sizing.

## Preview a section while hovering

Hold <kbd>Shift</kbd> and pause over a heading in the expanded outline. After a short delay, Crumbs scrolls instantly to that section without a heading highlight or a URL change. The outline list stays in place as you move between headings.

Release the key to stop previewing. Hover preview is enabled by default. In **General → Shortcuts**, find **Hover preview** below Search to turn it off, edit its modifier key, or reset it to Shift.

You can choose Shift, Alt/Option, Control/Ctrl, or Command on Mac. Hold only the selected modifier, without other keys. Preview does not run while you are typing; Caps Lock is not supported as a preview key.

## Copy a section link

Use **Copy section link** beside a heading to copy a link you can paste elsewhere. Crumbs uses a page's own section anchor when available, or a text-fragment link when it can identify the heading reliably. Markdown links target the original source document rather than temporary reader IDs.

The control is hidden when Crumbs cannot create a reliable target, including local files, some pages that use the URL fragment for routing, and ambiguous repeated headings. Whether a pasted link jumps to the section depends on the destination page and the receiving browser's support.

## Choose where Crumbs appears

Open the Crumbs toolbar button and choose one of the site modes:

- **All sites** shows Crumbs wherever a supported page is available.
- **Specific sites** limits Crumbs to domains and URL patterns you add.
- **Except these** shows Crumbs everywhere except your listed sites.

Add one rule at a time or paste a comma-separated list. **Add current site** fills in the current site's domain. Rule lists show their counts; remove entries individually or open the list menu for **Copy all** and **Clear all**. After clearing, use **Undo** while the feedback is visible to restore the list.

### Domain and pattern examples

The outline site lists and Markdown's **Only matching URLs** setting use the same syntax:

| Rule                             | Matches                                           |
| -------------------------------- | ------------------------------------------------- |
| `example.com` or `example.com/*` | That domain and all its paths, without subdomains |
| `*.example.com/*`                | The domain and its subdomains                     |
| `example.com/blog/*`             | The `/blog/` section on that domain               |
| `*/blog*`                        | Paths containing `/blog`, including `/blogger`    |
| `*/blog/*`                       | Paths containing a `/blog/` section               |
| `localhost/*`                    | Localhost on any port                             |
| `localhost:5173/*`               | Localhost on port 5173                            |
| `127.0.0.1/*`                    | That local address                                |

`*` matches zero or more characters. Rules without a scheme match HTTP and HTTPS; include a scheme to restrict them. New rules ignore query strings and fragments, and paths are case-sensitive. A domain without a path matches all its paths.

For text anywhere in a hostname or path, use a pattern such as `*webmonitoring*`. To match a path section, use `*/webmonitoring/*`; `/webmonitoring/` alone needs wildcards or a domain. Broad wildcard rules can match beyond one domain, so use a literal domain when you need that boundary.

Duplicates are ignored. If any entry in a pasted batch is invalid, fix it and add the batch again; valid entries are not partially added. Open **Pattern examples** in the popup for a reminder.

## Appearance and quick buttons

- **Glazed** adapts its light/dark appearance and subtle tint to the page background.
- **Plain** provides solid Light, Dark, and System themes.

Choose from Caramel, Ube, Blueberry, Velvet, Custard, and Matcha accents. The accent applies across the popup, outline, and heading-jump highlights.

Under **General → Quick buttons**, independently show or hide **Jump to Top**, **Jump to Bottom**, and **Dock Left / Right**. Markdown's Rendered/Raw control is separate.

Markdown and JSON documents share a Light/Dark/System reader setting, independent of the floating outline's appearance. See the [Markdown](../markdown-reader/#choose-a-reading-theme) and [JSON](../json-reader/#theme-and-saved-preferences) guides.

## Next steps

- [Learn about keyboard shortcuts](../shortcuts/)
- [Read standalone Markdown](../markdown-reader/)
- [Explore standalone JSON](../json-reader/)
- [Troubleshoot common issues](../troubleshooting/)
