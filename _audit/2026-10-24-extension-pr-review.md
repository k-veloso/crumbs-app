# Extension and help-center content review — October 24, 2026

## Scope and source of truth

Reviewed all 11 extension PRs updated since October 20, 2026: #4–#14, all merged.
Verified the resulting behavior against `k-veloso/crumbs` main at
[`30585ae`](https://github.com/k-veloso/crumbs/commit/30585ae37ebbf67a336b8f16af89126ffa9470e3),
including its README, Markdown guide, popup controls, shortcut defaults, hover-preview
implementation, heading groups, section-link selection, and manifest.

No GitHub releases were listed at review time. This audit describes the current
merged extension, rather than asserting that a Chrome Web Store release already
contains every change.

## Findings and changes

| Extension PR | Help-center finding | Resolution |
| --- | --- | --- |
| [#4 — Markdown reader, accents, UI](https://github.com/k-veloso/crumbs/pull/4) | Basic coverage existed; rendering and outline visibility needed clearer separation. | Clarified Rendered/Raw, Show/Hide, settings access, and quick-button controls. |
| [#5 — Customizable shortcuts](https://github.com/k-veloso/crumbs/pull/5) | Shortcut editing was covered, but later defaults superseded the original behavior. | Retained editing/reset guidance and documented the current defaults from #13. |
| [#6 — README layout compatibility](https://github.com/k-veloso/crumbs/pull/6) | Images and README layouts were mentioned without useful detail. | Added supported image dimensions, alignment, picture sources, wide tables, and limitations. |
| [#7 — Markdown copying](https://github.com/k-veloso/crumbs/pull/7) | Full-source copying was missing. | Added Copy raw Markdown in both views, code/diagram copying, and feedback. |
| [#8 — Store release preparation](https://github.com/k-veloso/crumbs/pull/8) | Release metadata did not require a new guide. | Documented the Chrome 127 minimum; checked existing privacy disclosures and avoided claiming store publication. |
| [#9 — Published help/privacy links](https://github.com/k-veloso/crumbs/pull/9) | Support and privacy URLs were already represented. | Confirmed existing help-center support routes and GitHub Pages hosting disclosure. |
| [#10 — Markdown themes, rules, controls](https://github.com/k-veloso/crumbs/pull/10) | Help incorrectly implied system-only Markdown themes and a rule-type editor for new entries. | Added independent document themes, shared patterns, comma-separated batches, list actions/Undo, legacy-rule semantics, and local-file permission feedback. |
| [#11 — Heading collapse and section links](https://github.com/k-veloso/crumbs/pull/11) | Both user-facing features were missing. | Added group collapse, session lifetime, search behavior, Copy section link, original Markdown targets, and link limitations. |
| [#12 — Heading detection/default depth](https://github.com/k-veloso/crumbs/pull/12) | Missing-heading advice omitted depth filtering and collapsed groups. | Expanded troubleshooting while preserving the distinction between article content and page controls. |
| [#13 — Hover preview, shortcuts, detection](https://github.com/k-veloso/crumbs/pull/13) | Search and Settings defaults were outdated; hover preview was missing. | Corrected search to Alt/Option+Shift+V, documented Chrome's suggested Settings binding, collapsed-outline search, hover preview/customization, and current shortcut hints. |
| [#14 — Outline spacing](https://github.com/k-veloso/crumbs/pull/14) | A visual density improvement, with no new setup requirement. | Reviewed; no standalone help instruction needed. |

The homepage summary and guide descriptions now mention the added navigation
capabilities. Troubleshooting covers shortcuts, hover preview, section links,
pattern matching, document themes, file access, and unsupported HTML.

## Still accurate

- Local-only preferences, the 500 Raw-view exception limit, click-only clipboard
  writes, and the lack of accounts, analytics, or a developer backend remain
  consistent with the extension's privacy policy and implementation.
- Group collapse is page-session state, not new persistent browsing history.
- No substantive privacy-policy change was required by the extension review. The
  contact route was subsequently updated to offer email alongside GitHub.

## Validation

Passed a Jekyll 3.10.0 / Minima 2.5.1 build and checked all seven published pages,
internal links, image/style/script assets, one H1 per page, and section-link targets.
`git diff --check` passed. The local `crumbs/` extension checkout is a reference only
and is not part of the help-center changes or preview source.

## Contact follow-up

Added a Contact page with a clearly marked `support@example.com` placeholder and
the existing GitHub issue route. Home, article, footer, troubleshooting, and
privacy contact links now lead to those choices. Replace the configured address
and clear the placeholder flag before treating email as a working support inbox.

## Homepage wording follow-up

Simplified the homepage into a guide directory with short descriptions and direct
support/privacy links. Removed the promotional headline, illustration, small
captions, product overview, privacy pitch, and footer tagline. Product marketing
copy is reserved for a separate landing page.
