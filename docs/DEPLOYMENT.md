# Production deployment

## Build contract

| Setting | Value |
| --- | --- |
| Node.js | 24, matching `.nvmrc` |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Publish directory | `dist/` |
| Application type | Static single-page application |
| Environment variables | None required by the current application |

Install development dependencies in the build environment. TypeScript, Vite and the styling tools are required to produce the application bundle. The deployed output consists of static files and does not require Node.js at runtime.

## Release checks

```sh
npm ci
npm run lint
npm test
npm run build
npm run preview
```

Use the URL printed by the preview server to review the generated build. The preview server is a local verification tool, not the production server.

## Hosting configuration

Publish the contents of `dist/` at the domain root over HTTPS. Configure the host to serve existing files normally and fall back to `/index.html` for application routes.

For example, an Nginx location serving the deployed directory can use:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

Set the server's document root to the directory containing the deployed `index.html`. Preserve the appropriate content types for JavaScript, CSS, JSON, SVG and the web manifest.

After deployment, open `/components/charts` directly and refresh it. Both requests must load the application. Also check the résumé download, icons, language switching and map loading.

## Paths and metadata

The current build assumes deployment at `/`. A subdirectory deployment requires coordinated changes to Vite's `base`, React Router's basename, public asset references and the manifest's `id`, `scope`, `start_url` and icon paths.

Page metadata lives in `index.html`; application metadata and icons are declared in `public/site.webmanifest`. The current metadata is shared across routes. Canonical URLs and absolute social preview image URLs should only be added once the deployment domain and image are known.

## External map requests

The map uses OpenStreetMap tiles, ipapi for the initial country lookup and Photon for capital geocoding. The visitor's browser contacts these services directly. Country detection after marker movement uses bundled geographic data.

If the host applies a Content Security Policy, account for these map requests and test the resulting policy against the actual application. Preserve OpenStreetMap attribution. The application falls back to Lisbon if initial country lookup fails; tile loading still depends on connectivity to the tile service.

## Demo behaviour

Forms do not send data to a backend. Submission success and failure are simulated. Changes to data view sample users and scheduler events are temporary. Language selection uses local storage; scheduler events do not.

The web manifest provides application metadata and icons. The project does not include a service worker or an offline cache.

## Updates and rollback

Retain the previous build artifact before publishing an update. Deploy each build as a complete set of files, including its generated assets. If a release fails verification, restore the previous complete artifact. When configuring caching, allow `index.html` to revalidate so clients can discover new asset filenames.
