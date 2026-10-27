import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const dist = path.join(root, "dist");
const basePath = "/crumbs-app/";

const requiredRoutes = [
  "",
  "help/",
  "help/getting-started/",
  "help/markdown-reader/",
  "help/shortcuts/",
  "help/troubleshooting/",
  "privacy/",
  "contact/",
  "onboarding/",
  "getting-started/",
  "markdown-reader/",
  "shortcuts/",
  "troubleshooting/",
];

async function exists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const entryPath = path.join(directory, entry.name);
      return entry.isDirectory() ? walk(entryPath) : entryPath;
    }),
  );
  return files.flat();
}

function routeForHtml(filePath) {
  const relative = path.relative(dist, filePath).split(path.sep).join("/");
  return relative === "index.html"
    ? basePath
    : `${basePath}${relative.replace(/index\.html$/, "")}`;
}

function targetFileForUrl(url) {
  const relative = decodeURIComponent(url.pathname.slice(basePath.length));
  if (!relative || relative.endsWith("/"))
    return path.join(dist, relative, "index.html");
  return path.join(dist, relative);
}

test("all public routes are generated", async () => {
  for (const route of requiredRoutes) {
    const filePath = path.join(dist, route, "index.html");
    assert.equal(
      await exists(filePath),
      true,
      `Missing generated route: ${basePath}${route}`,
    );
  }
});

test("the build contains no stale repository base paths", async () => {
  const htmlFiles = (await walk(dist)).filter((file) => file.endsWith(".html"));
  for (const file of htmlFiles) {
    const html = await readFile(file, "utf8");
    assert.equal(
      html.includes("/crumbs-help/"),
      false,
      `${file} contains /crumbs-help/`,
    );
    assert.equal(
      html.includes("/crumbs-site/"),
      false,
      `${file} contains /crumbs-site/`,
    );
  }
});

test("internal links and base-prefixed assets resolve in the static build", async () => {
  const htmlFiles = (await walk(dist)).filter((file) => file.endsWith(".html"));
  const failures = [];

  for (const file of htmlFiles) {
    const html = await readFile(file, "utf8");
    const route = routeForHtml(file);
    const references = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(
      (match) => match[1],
    );

    for (const reference of references) {
      if (
        reference.startsWith("#") ||
        reference.startsWith("data:") ||
        reference.startsWith("mailto:") ||
        reference.startsWith("tel:") ||
        reference.startsWith("javascript:")
      ) {
        continue;
      }

      const url = new URL(reference, `https://example.test${route}`);
      if (url.origin !== "https://example.test") continue;
      if (!url.pathname.startsWith(basePath)) {
        failures.push(`${route} points outside the project base: ${reference}`);
        continue;
      }

      const target = targetFileForUrl(url);
      if (!(await exists(target)))
        failures.push(`${route} has a missing target: ${reference}`);
    }
  }

  assert.deepEqual(failures, []);
});

test("help pages include the desktop Crumbs outline integration", async () => {
  const html = await readFile(path.join(dist, "help", "index.html"), "utf8");
  const scriptPath = path.join(dist, "crumbs-docs-outline.js");

  assert.match(html, /\/crumbs-app\/crumbs-docs-outline\.js/);
  assert.equal(await exists(scriptPath), true);

  const script = await readFile(scriptPath, "utf8");
  assert.match(script, /\(min-width: 72rem\)/);
  assert.match(script, /crumbs-extension-host/);
  assert.match(script, /\.crumbs-root/);
  assert.match(script, /Crumbs is hidden on this site/);
});

test("legacy guide routes identify their new help-center destinations", async () => {
  const mappings = {
    "getting-started": "help/getting-started",
    "markdown-reader": "help/markdown-reader",
    shortcuts: "help/shortcuts",
    troubleshooting: "help/troubleshooting",
  };

  for (const [legacy, destination] of Object.entries(mappings)) {
    const html = await readFile(path.join(dist, legacy, "index.html"), "utf8");
    assert.match(html, new RegExp(`${basePath}${destination}/`));
  }
});
