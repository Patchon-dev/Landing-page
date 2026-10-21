# D-Lopes — Portfolio & Component Library

**Private, proprietary project. External contributions are closed. Changes and reuse require prior written permission from the owner. See [the contribution policy](CONTRIBUTING.md) and [LICENSE](LICENSE).**

A responsive portfolio and interactive UI component library built with React and TypeScript. Originally a static HTML page, the project now includes reusable components, client-side routing, multilingual content, light and dark themes, and configurable live examples.

## Features

- Animated portfolio landing page with projects, profile, contact links and a downloadable résumé.
- Searchable component navigation with preview and code tabs.
- Syntax-highlighted JSX and TypeScript examples using a VS Code Dark Modern palette.
- Responsive layouts, with native mobile controls for dropdowns and supported date/time picker modes.
- English as the default and fallback language, with Portuguese, German, French, Spanish, Dutch and Italian translations. Missing translations fall back to English.

### Component catalogue

| Component | Route | Features |
| --- | --- | --- |
| Button | `/components/button` | Colour variants, gradients, sizes and disabled states |
| Card | `/components/card` | Content layout and avatar initials |
| Input | `/components/input` | Primary and secondary variants, sizes and disabled state |
| Switch | `/components/switch` | Interactive toggle and disabled state |
| Dropdown | `/components/dropdown` | Styled desktop menu and native mobile select |
| Date picker | `/components/date-picker` | Year, month, week, day and time modes; optional date and time selection |
| Forms | `/components/forms` | Formik state, Yup validation, field errors and submission feedback |
| Toast | `/components/toast` | Notification variants and placement controls |
| Modal | `/components/modal` | Responsive dialogs, custom children, submit and cancel callbacks |
| Data view | `/components/data-view` | Table and card layouts, 200 sample users, search, filters, pagination and actions |
| Charts | `/components/charts` | Chart.js line and doughnut charts, multiple line series, two palettes and two styles |
| Scheduler | `/components/scheduler` | Calendar views, event creation, drag and resize, and urgency colours |
| Map | `/components/map` | Country/capital lookup, custom marker and click-to-move coordinate popup |

## Technology

| Purpose | Libraries |
| --- | --- |
| Application | React 19, TypeScript 6, React Router 7 |
| Build and styling | Vite 8, Tailwind CSS 4, Skeleton 5 |
| Translations | i18next, react-i18next |
| Forms | Formik, Yup |
| Dates and scheduling | Day.js, FullCalendar |
| Maps | Leaflet, country-coder, countries-list |
| Charts | Chart.js, react-chartjs-2 |
| Code highlighting | Prism |
| Validation tools | ESLint, TypeScript, Node.js test runner |

## Getting started

Use **Node.js 24** and npm. The test suite uses Node's built-in TypeScript support and test runner.

Install the locked dependencies:

```sh
npm ci
```

Start the development server:

```sh
npm run dev
```

Open the local URL printed by Vite. No environment variables or backend configuration are required for the current application.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Vite with hot module replacement |
| `npm run lint` | Run ESLint |
| `npm test` | Run the automated tests in `tests/` |
| `npm run build` | Check TypeScript and generate production assets in `dist/` |
| `npm run optimize:images` | Regenerate optimised profile images and flag assets |
| `npm run preview` | Serve the production build locally for review |

The automated tests cover data filtering and pagination, date/time parsing, form schemas, map country detection, scheduler event handling and shared utilities.

## Production build and deployment

Run the checks and create the build:

```sh
npm ci
npm run lint
npm test
npm run build
```

Deploy the contents of **`dist/`** to a static web host. A Node.js application server is not required at runtime. Install development dependencies during the build stage because Vite, TypeScript and the styling tools are needed to generate the assets.

Configure the host with:

- **Build command:** `npm run build`
- **Output directory:** `dist`
- **SPA fallback:** serve `index.html` for application routes such as `/components/charts`, while serving existing asset files directly.

The current configuration targets deployment at the domain root. For deployment under a subdirectory, update Vite's `base`, the router basename and root-relative public asset URLs together.

To review the output locally:

```sh
npm run preview
```

`preview` is for local build verification; deploy the generated files through your hosting platform for production.

## Demo data and external services

Forms simulate submission locally, including an optional error response. They do not create real accounts or send form data to a backend. Data view actions modify sample data in memory. Scheduler changes are also kept in memory and discarded when leaving its page or reloading.

The language preference is stored in local storage. Demo scheduler events are not stored there.

The map makes browser requests to the following services:

| Service | Usage |
| --- | --- |
| OpenStreetMap (`tile.openstreetmap.org`) | Map tiles |
| ipapi (`ipapi.co`) | Initial country lookup using the visitor's public IP |
| Photon (`photon.komoot.io`) | Locate the country's capital |

Initial map positioning falls back to Lisbon when lookup fails. Country detection after moving the marker uses bundled geographic data. Internet access is required for external map services; their availability and usage limits apply. Preserve the map's OpenStreetMap attribution when customising it.

## Project structure

```text
src/
  assets/                Images, flags and résumé
  lib/
    components/          Shared UI components
    hooks/               Shared React hooks
    layouts/             Site and component catalogue layouts
    locales/             Translation JSON files
    themes/              Theme tokens and palettes
    utils/               Shared utilities
  pages/
    components/          Component previews and usage examples
    error/               Error pages
    Index.tsx            Portfolio landing page
  App.tsx                Application routes
  i18n.ts                Translation configuration
  index.css              Global styles
public/                  Static public assets
tests/                  Automated tests
```

## Customisation for authorised maintainers

- Update portfolio content and contact details in `src/pages/Index.tsx` and the translation files.
- Replace the profile image and résumé in `src/assets/`.
- Adjust colours and theme tokens in `src/lib/themes/`.
- Add reusable components in `src/lib/components/`, create their catalogue pages in `src/pages/components/`, then register the route and sidebar entry.
- Keep English translation keys complete so other languages can use the configured fallback.

## Project documentation

- [Contribution policy](CONTRIBUTING.md): access restrictions and the workflow for authorised maintainers.
- [Production deployment](docs/DEPLOYMENT.md): hosting, routing, external services and release checks.
- [Colour reference](docs/cores-fixas.md): theme tokens and intentional fixed palettes.

## Licence

Proprietary — all rights reserved. No open-source licence is granted. See [LICENSE](LICENSE). Third-party dependencies and assets retain their own licences.

## Image assets

The portfolio loads responsive WebP profile images at 60, 120 and 180 pixels wide. Language flags use small WebP assets sized for high-density screens. Original assets remain in `src/assets/`; generated files in `src/assets/optimized/` are committed so production builds do not need to process images.

After replacing the original profile photo or flag SVGs, regenerate the web assets and commit them:

```sh
npm run optimize:images
```

The profile image loads immediately because it appears above the fold. User avatar images and dropdown flag options use lazy loading. Images include asynchronous decoding, and the profile and flags reserve their display dimensions.
