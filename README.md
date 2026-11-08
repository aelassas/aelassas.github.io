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
* `npm run build`: Bundles the application for production using Vite and runs asset preloading optimization (`scripts/inject-preload.js`).
* `npm run preview`: Locally previews the production build generated in the `dist` folder.
* `npm run lint`: Runs ESLint across project files using cached results for speed.
* `npm run lint:fix`: Runs ESLint and automatically fixes fixable code formatting and linting issues.
* `npm run validate:html`: Validates all HTML files in the project against `html-validate` rules.
* `npm run size`: Displays the bundle size of generated assets in `dist/assets`.
* `npm run ncu`: Upgrades all dependencies in `package.json` to their latest versions via `npm-check-updates`.

## Project Structure

```text
aelassas.github.io/
├── public/
|   └── assets/           # Static assets like images, fonts, etc.
|   └── locales/          # i18n translation JSON files (en, fr, de, es, pt, it, zh, ja)
|   └── favicon.ico       # Site favicon
├── scripts/              # Build post-processing scripts
├── src/
│   ├── css/              # Global visual stylesheets & variables
│   └── js/               # UI handlers, analytics, and i18n module logic
├── index.html            # Main HTML markup, SEO tags, and JSON-LD schema
├── vite.config.js        # Vite build & asset optimization settings
└── package.json          # Project metadata and script definitions
```
