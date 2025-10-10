## Purpose

This repository is a small static website (HTML/CSS/JS + Sass) intended to be served from MAMP/Apache with SSI enabled. The following concise instructions help an AI coding agent be immediately productive and avoid breaking site conventions.

### Big picture

- Root HTML files in the repo (e.g. `index.html`, `season_terrace.html`) are the pages served. Shared/layout fragments are injected via SSI includes in `include/` (look for <!--#include FILE="include/xxx.html"-->).
- Styles are authored in `sass/` and compiled to `css/`. The repo commits the compiled CSS; after editing SCSS run `npm run build:sass` or `sass` locally.
- JavaScript lives in `javascript/`. Global behaviors and UI glue are primarily in `javascript/common.js`. The site relies on jQuery plus Splide and Featherlight plugins.

### Key files to read first

- `include/head.html` — page <head> (fonts, meta, CSS links)
- `include/script.html` — script imports and initialization (Splide, inview integrations)
- `javascript/common.js` — header nav, hamburger, anchor scrolling, YouTube autoplay triggers, and other global interactions
- `sass/_mixin.scss`, `sass/common.scss`, `sass/_fonts.scss` — mixins, responsive helpers, font setup (BEM-like CSS naming)
- `analyze-css.js` and `package.json` — CSS quality check and available npm scripts

### Build & dev workflow (concrete)

1. Local preview: copy repository into MAMP's DocumentRoot. Apache must have mod_include enabled for SSI; file:// previews will not render includes.
2. After editing SCSS run: npm run build:sass (this runs: sass --no-source-map sass:css). For continuous edit use npm run watch:sass.
3. Run CSS quality checks: npm run analyze-css (node analyze-css.js). CI uses Node 18; local Node 16+ recommended.
4. CI (see .github/workflows/ci.yml): push/PR runs npm ci → npm run build:sass → npm run analyze-css.

### Project-specific conventions (do not invent alternatives)

- Shared HTML fragments belong in `include/`. Edit shared content there; only change page-level HTML when the change is page-specific.
- Do not change the load order in `include/script.html`; Splide and other initializers expect specific ordering.
- Many JS behaviors depend on DOM selectors/structure (examples: `#top_splide`, `.fade`, `.js-nav`). When you change markup, search for selector usages in `javascript/` and `include/script.html`.
- Naming follows a BEM-like approach. Reuse existing mixins in `sass/_mixin.scss` instead of adding custom responsive rules.
- Avoid creating global vars; prefer `const`/`let` in `javascript/common.js` and follow existing script patterns.

### Concrete examples and patterns

- New page: add a root-level HTML file and include fragments:
  <!--#include FILE="include/head.html"-->
  <!--#include FILE="include/header.html"-->
  <!-- page content -->
  <!--#include FILE="include/footer.html"-->

- Add a slider: follow existing Splide conventions — add a DOM element with an id like `id="top_splide"` and review `include/script.html` for breakpoint/initialization options.

- Edit SCSS: prefer adding small partials or editing `sass/common.scss` and reuse mixins from `sass/_mixin.scss`. After editing, rebuild CSS and commit the generated files if your team requires it.

### Quick checklist before creating a PR

1. If change affects multiple pages, edit `include/` fragments.
2. If you changed SCSS, run `npm run build:sass` and include updated files in `css/` per repo convention.
3. If you changed JS or markup, confirm `include/script.html` initializers and update selectors in `javascript/` where necessary.
4. Preview with MAMP + mod_include to validate SSI rendering.

### Files to always inspect for cross-cutting effects

- `include/script.html`, `javascript/common.js` — JS initialization and global behaviors
- `sass/_mixin.scss`, `sass/common.scss` — CSS mixins and shared styles
- `package.json`, `analyze-css.js`, `.github/workflows/ci.yml` — build/test automation

If anything here is unclear or you'd like me to expand specific examples (e.g., a short checklist for adding a Splide slider or a sample SCSS mixin usage), tell me which area and I'll iterate.
