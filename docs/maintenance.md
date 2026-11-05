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
