# Contributing

## Local setup

Use Node.js 24, as recorded in `.nvmrc`, and npm. If you use nvm, run `nvm use` before installing dependencies.

```sh
npm ci
npm run dev
```

## Working on components

1. Place shared components in `src/lib/components/` and their examples in `src/pages/components/`.
2. Use existing theme tokens and shared controls to keep the interface consistent.
3. Register new catalogue pages in `src/App.tsx` and `src/lib/components/sidebar/Sidebar.tsx`.
4. Add translation keys to `src/lib/locales/en/translation.json` and translate them in the other supported languages when possible. English supplies fallback text.
5. Update the preview, code example and properties table together. Code examples omit import statements.
6. Keep preview data local to the page. Form submissions are simulated, and scheduler events must not be persisted to local storage.

## Validation

Before submitting a change, run:

```sh
npm run lint
npm test
npm run build
```

For interface changes, also review desktop and mobile layouts, both colour themes, keyboard operation and accessible labels. Check that native mobile controls continue to work where applicable. Add automated tests when changing validation, parsing, filtering or other shared behaviour.

## Dependencies

Use npm and commit `package.json` and `package-lock.json` together when dependencies change. Check whether existing components or libraries already cover the feature before adding another package.

## Change descriptions

Describe the problem, resulting behaviour and validation performed. Include screenshots for visual changes when useful. Keep unrelated formatting and dependency updates separate from the feature or fix.

## Documentation and licence

Update the README catalogue when adding a public component page. Keep operational details in [the deployment guide](docs/DEPLOYMENT.md) and colour guidance in [the colour reference](docs/cores-fixas.md).

The project is distributed under the [MIT licence](LICENSE). Preserve existing copyright and third-party attribution, including the OpenStreetMap attribution in the map.
