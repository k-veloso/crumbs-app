# Crumbs website

Public landing page, help center, privacy policy, and support information for **Crumbs — Navigate Any Page**.

The site is built with Astro and Starlight and is published at <https://k-veloso.github.io/crumbs-app/>.

This public repository does not contain the Crumbs extension source, privileged logic, credentials, or private user data.

## Routes

- `/` — product landing page
- `/help/` — searchable Starlight help center
- `/help/getting-started/` — page navigation, rules, and appearance
- `/help/markdown-reader/` — Markdown rendering and local files
- `/help/json-reader/` — JSON rendering, search, copying, and limits
- `/help/shortcuts/` — keyboard shortcuts and hover preview
- `/help/troubleshooting/` — common problems and fixes
- `/privacy/` — privacy policy
- `/contact/` — public support route
- `/onboarding/` — future onboarding scaffold; no extension integration is active

The previous top-level guide paths are generated as redirect pages. See [the URL migration table](docs/url-migration.md) for details.

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

### One-time repository setting

After this branch is merged:

1. Open **Settings → Pages** in `k-veloso/crumbs-app`.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Confirm Actions are enabled under **Settings → Actions → General**.
4. Push or merge to `main`, then watch the **Deploy to GitHub Pages** workflow.
5. Open <https://k-veloso.github.io/crumbs-app/> after the deployment finishes.

The repository currently uses the legacy branch-based Pages build; it must be changed to GitHub Actions for this workflow to become the publishing source.

## Content and contact maintenance

Help articles live in `src/content/docs/help/`. Landing, privacy, contact, redirects, and onboarding routes live in `src/pages/`.

No verified Chrome Web Store URL or working support email is published. Add an install CTA only after verifying the store URL. When a support inbox is ready, add it to `src/pages/contact.md`; do not use a placeholder address.

The [October 24 extension review](_audit/2026-10-24-extension-pr-review.md) maps merged extension work to the preserved help content. Files under `_audit/` and `docs/` are maintenance records and are not published by Astro.
