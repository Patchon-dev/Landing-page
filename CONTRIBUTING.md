# Contribution policy

This is a privately maintained, proprietary project. External pull requests, patches and other contributions are not accepted unless the owner has given prior written approval.

Source access does not grant permission to copy, modify or redistribute the project. See [LICENSE](LICENSE) for the applicable terms. Repository write access must be limited to people explicitly authorised by the owner.

The following workflow is for the owner and authorised maintainers only.

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

Before applying an authorised change, run:

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

The project is proprietary and all rights are reserved under [LICENSE](LICENSE). Preserve existing copyright and third-party licence notices and attribution, including OpenStreetMap attribution in the map.
