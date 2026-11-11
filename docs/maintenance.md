# Crumbs website maintenance

## Routes

- `/` — product landing page
- `/help/` — searchable Starlight help center
- `/help/getting-started/` — page navigation, rules, and appearance
- `/help/chatgpt/` — conversation outlines, older messages, and question times
- `/help/markdown-reader/` — Markdown rendering and local files
- `/help/json-reader/` — JSON rendering, search, copying, and limits
- `/help/shortcuts/` — keyboard shortcuts and hover preview
- `/help/troubleshooting/` — common problems and fixes
- `/changelog/` — release notes
- `/privacy/` — privacy policy
- `/contact/` — public support route
- `/onboarding/` — future onboarding scaffold; no extension integration is active

The previous top-level guide paths are generated as redirect pages. See [the URL migration table](url-migration.md) for details.

## Local development

Requires Node.js 24 and npm.

```sh
npm ci
npm run dev
```

Astro serves the project with the configured `/crumbs-app` base path. Follow the local URL printed in the terminal.

## Validation

```sh
npm run lint
npm run build
npm test
```

- `npm run lint` runs Astro's type/content checks and Prettier's formatting check.
- `npm run build` creates the static site in `dist/`.
- `npm test` validates generated routes, project-base URLs, internal links, assets, and legacy redirects. Run it after the build.

The dependency versions are pinned in `package.json`; commit `package-lock.json` whenever dependencies change.

## GitHub Pages deployment

`.github/workflows/deploy.yml` runs on pushes to `main` and by manual dispatch. It installs with `npm ci`, validates the project, builds the static site, checks the generated routes, uploads the Pages artifact, and deploys it with GitHub's official Pages actions.

Astro is configured with:

```js
site: "https://k-veloso.github.io";
base: "/crumbs-app";
```

GitHub Pages uses **GitHub Actions** as its publishing source. After merging to `main`, check the **Deploy to GitHub Pages** workflow and verify the [published site](https://k-veloso.github.io/crumbs-app/).

## Content and contact maintenance

Help articles live in `src/content/docs/help/`. Landing, privacy, contact, redirects, and onboarding routes live in `src/pages/`.

The public support and privacy contact email is [karl.ext.dev@gmail.com](mailto:karl.ext.dev@gmail.com). Keep the contact page, privacy policy, and help contact references consistent when it changes. The homepage currently links to the Chrome Web Store homepage. Use a direct install link once the Crumbs listing URL is verified.

The [October 24 extension review](../_audit/2026-10-24-extension-pr-review.md) maps merged extension work to the preserved help content. Files under `_audit/` and `docs/` are maintenance records and are not published by Astro.

## Help control icons

Help articles use `HelpControl.astro` from MDX to pair a control label with its actual extension icon. Keep the visible label: the adjacent SVG is decorative, hidden from assistive technology, and not interactive. Preserve plain-text headings so guide anchors stay stable.

`src/lib/help-control-icons.json` contains local copies of vectors from the Crumbs extension: `public/welcome.html` (settings and section copy), `src/ui/App.tsx` (pin, unpin, top, bottom, dock, Rendered/Raw view switch), `src/ui/components/OutlineList.tsx` (heading chevron), `src/markdown/themeControls.ts` (reader palette), `src/markdown/copyControls.ts` (document copy), `src/json/controls.ts` (JSON controls), and `public/popup.html` (About info). Search matches the shared outline demo and extension search control. The restricted-HTML notice uses the extension’s `ⓘ` text glyph instead of the About icon.

When an extension control changes, refresh its vector here and check the affected guide in light and dark themes. These are static presentation assets; the site does not import extension runtime code.
