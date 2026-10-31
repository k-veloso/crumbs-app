/**
 * @typedef {Object} OutlineItem
 * @property {string} id
 * @property {string} label
 * @property {number} level
 * @property {OutlineItem[]} children
 * @property {boolean} [hasChildren]
 */

/**
 * Convert an ordered list of explicitly declared targets into a nested outline.
 * The site supplies every target and level; this helper never inspects page headings.
 *
 * @param {Array<Omit<OutlineItem, "children"> & {children?: OutlineItem[]}>} items
 * @returns {OutlineItem[]}
 */
export function nestOutlineItems(items) {
  /** @type {OutlineItem[]} */
  const roots = [];
  /** @type {OutlineItem[]} */
  const stack = [];

  for (const source of items) {
    const item = {
      id: source.id,
      label: source.label.trim(),
      level: source.level,
      children: source.children ? structuredClone(source.children) : [],
    };

    while (stack.length && stack.at(-1).level >= item.level) stack.pop();

    if (stack.length) stack.at(-1).children.push(item);
    else roots.push(item);

    stack.push(item);
  }

  return roots;
}

/** @param {OutlineItem[]} items */
export function flattenOutlineItems(items) {
  return items.flatMap((item) => [item, ...flattenOutlineItems(item.children)]);
}

/**
 * Normalize Starlight's serialized table-of-contents data for the demo.
 * Starlight represents the page title as a synthetic level-two "Overview"
 * entry, so replace that entry with the real page H1 supplied by the caller.
 *
 * @param {unknown} items
 * @param {string} [pageTitle]
 * @returns {OutlineItem[]}
 */
export function normalizeStarlightItems(items, pageTitle = "") {
  if (!Array.isArray(items)) return [];

  return items.flatMap((candidate) => {
    if (!candidate || typeof candidate !== "object") return [];
    const item = /** @type {Record<string, unknown>} */ (candidate);
    if (typeof item.slug !== "string" || typeof item.text !== "string") {
      return [];
    }

    const isPageTitle = item.slug === "_top";
    return [
      {
        id: item.slug,
        label: isPageTitle && pageTitle.trim() ? pageTitle.trim() : item.text,
        level: isPageTitle || typeof item.depth !== "number" ? 1 : item.depth,
        children: normalizeStarlightItems(item.children, pageTitle),
      },
    ];
  });
}

/**
 * Return the visible tree for the current search, depth, and collapsed groups.
 * Searching shows matching rows only and ignores collapsed state.
 *
 * @param {OutlineItem[]} items
 * @param {{query?: string, maxLevel?: number, collapsedIds?: Set<string>}} options
 * @returns {OutlineItem[]}
 */
export function filterOutlineItems(
  items,
  { query = "", maxLevel = 6, collapsedIds = new Set() } = {},
) {
  const normalizedQuery = query.trim().toLocaleLowerCase();

  if (normalizedQuery) {
    return flattenOutlineItems(items)
      .filter(
        (item) =>
          item.level <= maxLevel &&
          item.label.toLocaleLowerCase().includes(normalizedQuery),
      )
      .map((item) => ({ ...item, hasChildren: false, children: [] }));
  }

  return items.flatMap((item) => {
    if (item.level > maxLevel) return [];

    const children = filterOutlineItems(item.children, {
      query,
      maxLevel,
      collapsedIds,
    });
    return [
      {
        ...item,
        hasChildren: item.children.length > 0,
        children: !collapsedIds.has(item.id) ? children : [],
      },
    ];
  });
}

/** @param {string} text */
export function encodeTextFragment(text) {
  return encodeURIComponent(text.trim())
    .replace(/-/g, "%2D")
    .replace(/'/g, "%27")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29");
}

/**
 * Create an anchor-first URL so unsupported browsers still reach the section.
 *
 * @param {string} href
 * @param {{id: string, label: string}} item
 */
export function buildSectionLink(href, item) {
  const url = new URL(href);
  url.hash = `${encodeURIComponent(item.id)}:~:text=${encodeTextFragment(item.label)}`;
  return url.toString();
}

/**
 * Resolve a fixed demo shortcut from physical key information so Option-modified
 * characters behave consistently across operating systems.
 *
 * @param {{code: string, altKey: boolean, shiftKey: boolean, ctrlKey: boolean, metaKey: boolean}} event
 * @returns {"pin" | "search" | null}
 */
export function getDemoShortcutAction(event) {
  if (!event.altKey || !event.shiftKey || event.ctrlKey || event.metaKey) {
    return null;
  }
  if (event.code === "KeyC") return "pin";
  if (event.code === "KeyV") return "search";
  return null;
}

export const initialControllerState = Object.freeze({
  environment: "detecting",
  demoEnabled: false,
});

/**
 * @param {{environment: string, demoEnabled: boolean}} state
 * @param {{type: string, environment?: string, enabled?: boolean}} event
 */
export function reduceControllerState(state, event) {
  switch (event.type) {
    case "environment": {
      const environment = event.environment ?? "detecting";
      return {
        environment,
        demoEnabled:
          environment === "demo-available" ? state.demoEnabled : false,
      };
    }
    case "demo":
      return state.environment === "demo-available"
        ? { ...state, demoEnabled: Boolean(event.enabled) }
        : state;
    default:
      return state;
  }
}
