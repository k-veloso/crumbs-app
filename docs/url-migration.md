# URL migration: `crumbs-help` to `crumbs-app`

Updated: October 26, 2026.

The GitHub repository is now `k-veloso/crumbs-app`. The live project-pages base is therefore `/crumbs-app`, not `/crumbs-help` or the earlier planned `/crumbs-site` name.

| Previous URL                                 | Current URL                              | Handling                                                                                                                         |
| -------------------------------------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `https://k-veloso.github.io/crumbs-help/`    | `https://k-veloso.github.io/crumbs-app/` | Repository-level move. GitHub may redirect the renamed repository, but Pages redirects are not guaranteed; update inbound links. |
| `/crumbs-app/` (old help index after rename) | `/crumbs-app/`                           | The root is now the product landing page. Help moved to `/help/`.                                                                |
| `/crumbs-app/getting-started/`               | `/crumbs-app/help/getting-started/`      | Static compatibility redirect generated.                                                                                         |
| `/crumbs-app/markdown-reader/`               | `/crumbs-app/help/markdown-reader/`      | Static compatibility redirect generated.                                                                                         |
| `/crumbs-app/shortcuts/`                     | `/crumbs-app/help/shortcuts/`            | Static compatibility redirect generated.                                                                                         |
| `/crumbs-app/troubleshooting/`               | `/crumbs-app/help/troubleshooting/`      | Static compatibility redirect generated.                                                                                         |
| `/crumbs-app/privacy/`                       | `/crumbs-app/privacy/`                   | Route preserved.                                                                                                                 |
| `/crumbs-app/contact/`                       | `/crumbs-app/contact/`                   | Route preserved; repository issue links now target `crumbs-app`.                                                                 |
| —                                            | `/crumbs-app/onboarding/`                | New public scaffold. No extension integration or trusted message API is implemented.                                             |

## Inbound-link follow-up

The separate private extension repository is intentionally outside this migration. Update any help/privacy links there from `https://k-veloso.github.io/crumbs-help/` to `https://k-veloso.github.io/crumbs-app/` when its next release is prepared.

GitHub Pages cannot create redirects for the old `/crumbs-help/` project path from this repository. Keep repository rename forwarding in mind, but do not rely on it as the only migration mechanism.
