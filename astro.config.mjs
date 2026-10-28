// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

const base = "/crumbs-app";

export default defineConfig({
  site: "https://k-veloso.github.io",
  base,
  output: "static",
  trailingSlash: "always",
  integrations: [
    starlight({
      title: "Crumbs Help",
      description: "Guides and support for Crumbs — Navigate Any Page.",
      favicon: "/favicon.svg",
      logo: {
        light: "./src/assets/images/crumbs-lockup-horizontal.svg",
        dark: "./src/assets/images/crumbs-lockup-horizontal-dark.svg",
        alt: "Crumbs",
        replacesTitle: true,
      },
      social: [
        {
          icon: "github",
          label: "Crumbs on GitHub",
          href: "https://github.com/k-veloso/crumbs-app",
        },
      ],
      sidebar: [
        {
          label: "Help center",
          items: [
            { label: "Overview", slug: "help" },
            { label: "Getting Started", slug: "help/getting-started" },
            { label: "Reading Markdown", slug: "help/markdown-reader" },
            { label: "Reading JSON", slug: "help/json-reader" },
            { label: "Keyboard Shortcuts", slug: "help/shortcuts" },
            { label: "Troubleshooting", slug: "help/troubleshooting" },
          ],
        },
        {
          label: "More",
          items: [
            { label: "Privacy Policy", link: "/privacy/" },
            { label: "Contact", link: "/contact/" },
            { label: "Product home", link: "/" },
          ],
        },
      ],
      disable404Route: true,
      customCss: ["./src/styles/starlight.css"],
      head: [
        {
          tag: "script",
          attrs: {
            src: `${base}/crumbs-docs-outline.js`,
            defer: true,
          },
        },
      ],
      editLink: {
        baseUrl: "https://github.com/k-veloso/crumbs-app/edit/main/",
      },
    }),
  ],
});
