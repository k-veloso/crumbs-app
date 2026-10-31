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
  "help/json-reader/",
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

test("landing and help pages include the controlled outline demo", async () => {
  const landing = await readFile(path.join(dist, "index.html"), "utf8");
  const help = await readFile(path.join(dist, "help", "index.html"), "utf8");
  const scripts = await Promise.all(
    (await walk(path.join(dist, "_astro")))
      .filter((file) => file.endsWith(".js"))
      .map((file) => readFile(file, "utf8")),
  );
  const bundledScripts = scripts.join("\n");

  assert.match(landing, /data-crumbs-demo-root/);
  assert.match(landing, /data-crumbs-demo-activate/);
  assert.match(landing, /data-crumbs-demo-heading/);
  assert.doesNotMatch(landing, /data-crumbs-demo-level="3"/);
  assert.match(landing, /class="crumbs-demo-lockup"/);
  assert.match(landing, /data-crumbs-demo-depth="3"/);
  assert.match(landing, /class="crumbs-demo-settings"/);
  assert.match(landing, /data-crumbs-demo-settings-close/);
  assert.match(landing, /data-tooltip="Caramel"/);
  assert.match(landing, /data-tooltip="Matcha"/);
  assert.doesNotMatch(landing, />Dock side</);
  assert.doesNotMatch(landing, />Glazed theme</);
  assert.match(help, /crumbs-demo-outline-data/);
  assert.match(help, /Try the Crumbs outline on this page/);
  assert.match(help, /The Crumbs extension is hidden on this site/);
  assert.match(bundledScripts, /\(min-width: 72rem\)/);
  assert.match(bundledScripts, /crumbs-extension-host/);
  assert.match(bundledScripts, /\.crumbs-root/);
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

test("production glass surfaces retain the standard backdrop filter", async () => {
  const files = (await walk(path.join(dist, "_astro"))).filter((file) =>
    file.endsWith(".css"),
  );
  const css = (
    await Promise.all(files.map((file) => readFile(file, "utf8")))
  ).join("\n");
  for (const selector of [
    "crumbs-demo-panel",
    "crumbs-demo-quick-buttons button",
    "crumbs-demo-settings",
  ]) {
    const escaped = selector.replaceAll(" ", "\\s*");
    const rule = css.match(new RegExp(`\\.${escaped}\\{([^}]+)\\}`));
    assert.ok(rule, `Missing ${selector} rule`);
    assert.match(
      rule[1],
      /(?:^|;)backdrop-filter:var\(--crumbs-glass-filter\)/,
      `${selector} lost its standard backdrop-filter during the build`,
    );
  }
});
