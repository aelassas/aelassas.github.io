# aelassas.github.io

Source code for [aelassas.github.io](https://aelassas.github.io). Built with Vite, ES Modules, native CSS variables, and modern web standards.

## Prerequisites

- **Node.js**: LTS release recommended
- **npm**: v10+

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/aelassas/aelassas.github.io.git
   cd aelassas.github.io
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

## Available Scripts

In the project directory, you can run:

* `npm run dev`: Starts the Vite development server with local network access enabled (`--host`).
* `npm run build`: Bundles the application for production using Vite and runs asset preloading optimization.
* `npm run preview`: Locally previews the production build generated in the `dist` folder.
* `npm run lint`: Runs ESLint across project files using cached results for speed.
* `npm run lint:fix`: Runs ESLint and automatically fixes fixable code formatting and linting issues.
* `npm run validate:html`: Validates all HTML files in the project against `html-validate` rules.
* `npm run size`: Displays the bundle size of generated assets in `dist/assets`.
* `npm run ncu`: Upgrades all dependencies in `package.json` to their latest versions via `npm-check-updates`.

## Project Structure

```text
aelassas.github.io/
├── contact/
│   └── index.html        # Contact page HTML markup, SEO tags, and JSON-LD schema
├── public/
│   ├── assets/           # Static assets (images, self-hosted fonts)
│   ├── locales/          # i18n translation JSON files (en, fr, de, es, pt-br, pt-pt, it, zh, ja, ko)
│   ├── site.webmanifest  # Web app manifest
│   └── sitemap.xml       # Multilingual XML sitemap
├── scripts/              # Build post-processing scripts
├── src/
│   ├── css/
│   │   ├── base.css      # Shared layout, theme variables, header, and footer styles
│   │   ├── home.css      # Home page specific styles
│   │   └── contact.css   # Contact page form styles
│   └── js/               # UI handlers, analytics, and i18n module logic
├── index.html            # Home page HTML markup, SEO tags, and JSON-LD schema
├── vite.config.js        # Vite multi-page build & asset optimization settings
└── package.json          # Project metadata and script definitions
```
