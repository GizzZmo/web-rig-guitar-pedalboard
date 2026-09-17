# Assets

Tracked design and preview files for Web Rig.

| Path | Purpose |
|---|---|
| `assets/screenshots/desktop.svg` | Static preview used in the README |
| `artifacts/screenshots/` | PNG captures produced by CI (not committed) |

CI uploads three artifact bundles on every run:

- **assets** — `index.html`, `vercel.json`, `LICENSE`, and this folder
- **artifacts** — packaged `dist/` tree plus `web-rig-assets.tar.gz`
- **screenshots** — desktop, laptop, and mobile PNGs
