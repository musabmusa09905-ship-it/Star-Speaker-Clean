# Project Structure

This repository remains a static HTML/CSS/JavaScript website for GitHub Pages. It has not been converted to React, Next.js, Vite, or another framework.

## Root

The repository root keeps GitHub Pages entry points and routing-sensitive files:

- `index.html` is the main homepage.
- `about.html`, `apply.html`, `level-test.html`, `login.html`, `method.html`, `program.html`, `programs.html`, `resources.html`, `results.html`, `reset-password.html`, and `student-workspace.html` remain root-level pages so existing navigation and direct URLs keep working.
- `about`, `method`, `program`, and `results` are extensionless redirect/helper files and remain in root for clean URL compatibility.
- `CNAME` remains in root and controls the live custom domain for GitHub Pages. Do not edit, move, or delete it casually.

## `public/`

Public static assets that should be served directly by GitHub Pages live here.

- `public/assets/logo/` contains brand logo files used by active pages.
- `public/assets/images/` contains active website imagery, such as homepage/about/resources hero images.
- `public/assets/icons/` contains active icon-like image assets, including the page transition emblem.
- `public/favicon/` contains favicon and web app manifest files referenced by the active pages.

## `src/`

Source files used by the static pages live here.

- `src/styles/` contains active CSS files.
- `src/scripts/` contains active JavaScript files, including shared behavior, forms, student access scripts, and Supabase client/config scripts.
- `src/pages/` is reserved for future page source organization, but active HTML pages currently stay in root to preserve GitHub Pages routing.
- `src/components/` is reserved for future shared static HTML/CSS/JS component snippets if the site starts using them.

## `supabase/`

Supabase-related database files live here.

- `supabase/schemas/` contains the current SQL schema files that were previously in the repository root.
- `supabase/migrations/` is reserved for chronological migration files if the project starts tracking Supabase changes that way.

## `docs/`

Project documentation and design evidence live here.

- `docs/PROJECT_STRUCTURE.md` explains the folder structure.
- `docs/CLEANUP_MANIFEST.md` documents every moved file and important files left untouched.
- `docs/cleanup-move-log.csv` is a machine-readable move log.
- `docs/screenshots-archive/` contains generated screenshots, previews, and visual checks from previous design work.
- `docs/design-references/` is reserved for curated design reference material.

## `archive/`

Non-active files kept for safety live here.

- `archive/old-pages/` contains duplicate copied HTML/CSS page variants that are not active navigation targets.
- `archive/unused-assets/` contains duplicate root assets and stray local data files that were not active website dependencies.
- `archive/old-generated-files/` is reserved for generated files that are not useful as design screenshots.

## Files To Treat Carefully

- `CNAME`: live custom domain configuration for GitHub Pages.
- Root HTML pages: active website routes and form pages.
- `src/scripts/supabase-config.js` and `src/scripts/supabase-client.js`: Supabase connection/client behavior used by forms and student access pages.
- `supabase/schemas/`: database schema references for backend data structures.
