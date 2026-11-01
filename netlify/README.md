# Bella Restaurant

Restaurant ordering frontend built with React and Vite.

## Requirements

- Node.js 20
- npm

## Local development

```bash
npm ci
npm run dev
```

## Quality checks

```bash
npm run lint
npm run build
```

## Netlify

Connect this repository to Netlify. The build command is `npm run build` and the
publish directory is `dist` (configured in `netlify.toml`). Netlify handles
deployment; the GitHub Actions workflow runs lint and build checks on pushes and
pull requests.
