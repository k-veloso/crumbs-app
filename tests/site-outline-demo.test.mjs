import assert from "node:assert/strict";
import test from "node:test";

import {
  buildSectionLink,
  filterOutlineItems,
  flattenOutlineItems,
  getDemoShortcutAction,
  nestOutlineItems,
  reduceControllerState,
} from "../src/lib/site-outline-demo.mjs";

const flat = [
  { id: "top", label: "Page title", level: 1 },
  { id: "outline", label: "Page outline", level: 2 },
  { id: "collapse", label: "Collapse nested groups", level: 3 },
  { id: "search", label: "Search headings", level: 3 },
  { id: "privacy", label: "Private by design", level: 2 },
];

test("explicit outline targets become a nested tree", () => {
  const tree = nestOutlineItems(flat);

  assert.equal(tree.length, 1);
  assert.equal(tree[0].id, "top");
  assert.deepEqual(
    tree[0].children.map((item) => item.id),
    ["outline", "privacy"],
  );
  assert.deepEqual(
    tree[0].children[0].children.map((item) => item.id),
    ["collapse", "search"],
  );
  assert.deepEqual(
    flattenOutlineItems(tree).map((item) => item.id),
    flat.map((item) => item.id),
  );
});

test("search reveals matching descendants while depth and collapse remain bounded", () => {
  const tree = nestOutlineItems(flat);
  const collapsed = filterOutlineItems(tree, {
    maxLevel: 3,
    collapsedIds: new Set(["outline"]),
  });
  assert.equal(collapsed[0].children[0].children.length, 0);
  assert.equal(collapsed[0].children[0].hasChildren, true);

  const searched = filterOutlineItems(tree, {
    query: "search",
    maxLevel: 3,
    collapsedIds: new Set(["outline"]),
  });
  assert.deepEqual(
    flattenOutlineItems(searched).map((item) => item.id),
    ["top", "outline", "search"],
  );

  const shallow = filterOutlineItems(tree, { maxLevel: 2 });
  assert.deepEqual(
    flattenOutlineItems(shallow).map((item) => item.id),
    ["top", "outline", "privacy"],
  );
});

test("section links combine a stable anchor with an encoded text fragment", () => {
  const link = buildSectionLink("https://example.test/guide/?mode=demo#old", {
    id: "copy-links",
    label: "Copy a link—to this section.",
  });

  assert.equal(
    link,
    "https://example.test/guide/?mode=demo#copy-links:~:text=Copy%20a%20link%E2%80%94to%20this%20section.",
  );
});

test("the controller never keeps the demo active beside the extension", () => {
  let state = { environment: "demo-available", demoEnabled: false };
  state = reduceControllerState(state, { type: "demo", enabled: true });
  assert.equal(state.demoEnabled, true);

  state = reduceControllerState(state, {
    type: "environment",
    environment: "extension-active",
  });
  assert.deepEqual(state, {
    environment: "extension-active",
    demoEnabled: false,
  });

  const ignored = reduceControllerState(state, { type: "demo", enabled: true });
  assert.deepEqual(ignored, state);
});

test("fixed shortcuts use physical key codes across keyboard layouts", () => {
  const modifiers = {
    altKey: true,
    shiftKey: true,
    ctrlKey: false,
    metaKey: false,
  };

  assert.equal(getDemoShortcutAction({ ...modifiers, code: "KeyC" }), "pin");
  assert.equal(getDemoShortcutAction({ ...modifiers, code: "KeyV" }), "search");
  assert.equal(
    getDemoShortcutAction({ ...modifiers, altKey: false, code: "KeyC" }),
    null,
  );
});
