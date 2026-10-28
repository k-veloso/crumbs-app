---
title: Reading JSON with Crumbs
description: Explore standalone JSON responses with collapsible fields, search, exact copying, and Raw view.
---

Crumbs turns eligible standalone JSON responses into a collapsible reading view without requesting the endpoint again. Choose **Rendered** to explore the structure or **Raw** to see the original decoded response text.

## Supported JSON documents

Crumbs recognizes standalone JSON content types such as `application/json`, `text/json`, and `application/*+json`. It also recognizes plain-text responses whose path ends in `.json`.

HTML pages containing JSON examples, already-rendered repository pages, downloads, streaming NDJSON, JSON with comments, and custom HTML JSON viewers are left alone. Crumbs does not repair, edit, or convert JSON.

Local `.json` files work after Chrome's **Allow access to file URLs** permission is enabled for Crumbs. The separate **Local Markdown files** setting applies only to Markdown. Refresh a local JSON file after editing it elsewhere.

## Rendered and Raw views

**Rendered** displays syntax-colored objects and arrays with expandable branches. Crumbs initially opens up to three levels below the root, showing the first 20 keys or items at each level and 200 visible lines overall. Large collections continue in batches with **Show more**.

**Raw** preserves the original decoded text, including whitespace, line breaks, large numbers, and escape sequences. A one-line response stays on one line with horizontal scrolling. Switching to Raw stops any expansion in progress.

Use **Copy raw JSON** to copy the entire response from either view.

## Explore large responses

- Select a branch chevron to expand or collapse it.
- **Shift-click** a collapsed branch to expand all of its descendants within the remaining visible-line budget.
- **Expand all** opens branches up to 20,000 visible lines.
- **Expand to depth** lists the levels available in the current document and uses the same line budget.
- **Collapse all** closes every branch and cancels expansion in progress.

When the visible-line limit is reached, collapse branches or use the Crumbs outline search to reveal a specific field.

## Search and grouped fields

Expand the Crumbs rail to search keys, values, or JSON Pointer paths such as `/orders/2/customer/email`. Search includes fields inside collapsed or not-yet-mounted branches. Press Enter or select a result to reveal and focus it; choosing a result from Raw view opens Rendered view first.

Repeated fields inside arrays are grouped. For example, `email ×200` represents occurrences at the same structural path. Selecting the group again advances to the next occurrence. Type, occurrence count, and small distinct-value counts help summarize repeated records.

Browser Find only searches currently mounted Rendered lines. Use Crumbs search or Raw view to search the complete response.

## Copy values and paths

Each Rendered line offers **Copy value** and a menu with additional actions:

- **Copy property** preserves an object field's key and value. It is unavailable for array entries and the document root.
- **Copy Pointer** copies a plain JSON Pointer such as `/orders/0/customer/email`.
- **Copy Path** copies a JSONPath-style location such as `$.orders[0].customer.email`.

Copies use the original source text, so large integers are not rounded and escape sequences are preserved. Duplicate keys are shown separately; pointer and path actions are disabled when a location would be ambiguous.

## Theme and saved preferences

The document palette selects **Light**, **Dark**, or **System** for both JSON and Markdown readers. Reader appearance is independent of the floating outline's Glazed or Plain appearance.

Crumbs can remember that a document was left in Raw view using a hashed document identifier stored locally. It never saves the JSON contents.

## Rendering limits

Rendered view accepts up to:

- 5 million source characters
- 250,000 syntax tokens
- 128 levels of nested containers
- 20,000 visible lines during expansion

Invalid or oversized responses remain available in Raw with an explanation. Search and the outline use bounded result lists, while accepted fields outside those lists remain searchable.

Raw view is not virtualized, so very large responses can still take time for Chrome to load and lay out.

## Privacy and network behavior

Crumbs reads the response already loaded in the tab. It does not refetch the endpoint, transmit the response to a Crumbs service, or save its contents. Raw preserves the browser's decoded text, not transport bytes, headers, or encoding metadata.

For related issues, see [Troubleshooting](../troubleshooting/).
