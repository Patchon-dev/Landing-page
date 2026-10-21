# Colour reference

The application uses shared CSS tokens for its interface. This document describes where colours are defined and where explicit colour values are intentional. It replaces the earlier line-by-line inventory, which became outdated as components were added.

## Theme definitions

| File | Responsibility |
| --- | --- |
| [`shared.css`](../src/lib/themes/shared.css) | Skeleton palettes, shared tokens and button gradients |
| [`dark.css`](../src/lib/themes/dark.css) | Dark theme semantic colours |
| [`light.css`](../src/lib/themes/light.css) | Light theme semantic colours |
| [`App.postcss`](../src/App.postcss) | Tailwind mappings for the active theme tokens |

Use semantic tokens such as `--site-bg`, `--site-panel`, `--site-ink`, `--site-muted`, `--site-border` and `--site-accent` for application surfaces and text. Theme selection is applied through `data-theme` on the root HTML element.

## Intentional explicit colours

| Location | Reason |
| --- | --- |
| [`code.css`](../src/lib/components/code/code.css) | VS Code Dark Modern syntax palette; the editor stays dark in both application themes |
| [`Charts.tsx`](../src/lib/components/charts/Charts.tsx) | Distinct series colours for the Primary and Secondary chart palettes; chart labels and grid lines follow theme tokens |
| [`helpers.ts`](../src/lib/utils/helpers.ts) | Caption/status colours returned by shared utility functions |
| [`index.html`](../index.html) | Initial browser theme colour |
| [`site.webmanifest`](../public/site.webmanifest) | Browser/application background and theme colours |
| Icons and other visual assets in `public/` | Artwork colours are part of the assets |

Code blocks use `--color-surface-950`, matching the dark page background. Their syntax palette is separate from the application theme to preserve the requested editor appearance.

Browser metadata uses concrete colour values because those fields do not resolve CSS variables. Update the metadata and manifest together when changing the initial dark background.

## Maintaining colours

Prefer theme tokens for new interface elements. Keep fixed series and syntax palettes in their owning components. Review changes in both light and dark modes, including hover, focus, disabled and validation states.

Transparency, masks and decorative effects may use `transparent`, alpha channels or mask colours without representing additional interface palette colours.
