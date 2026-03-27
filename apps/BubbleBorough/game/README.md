# Bubble Borough

A real-time fish tank idle game built as a static web app.

## Run It

Publish the repository root to any static host and open `/`.

For local preview without Node, serve the repo root with any static file server. One simple option is Python:

```powershell
py -m http.server 3000
```

Then open [http://localhost:3000](http://localhost:3000).

## Asset Manifest

Static hosts cannot scan folders at runtime, so Bubble Borough now reads from `assets/asset-manifest.json`.

If you add, remove, or replace PNG assets in `assets/backgrounds`, `assets/bubbles`, `assets/decor`, `assets/filter`, `assets/gravel`, `assets/sucker-fish`, or `assets/tank`, regenerate the manifest:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\generate-asset-manifest.ps1
```

If you want to refresh the starter artwork as well, run:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\generate-assets.ps1
```

## Asset Folders

- Background PNGs: `assets/backgrounds`
- Bubble PNGs: `assets/bubbles`
- Decor PNGs: `assets/decor`
- Filter PNGs: `assets/filter`
- Fish PNGs: `assets/fish`
- Gravel PNGs: `assets/gravel`
- Tank shell PNGs: `assets/tank`

The game discovers these PNG folders through the generated asset manifest, so if you add more assets there and regenerate the manifest, they will appear in the decor/customization menu.

Fish types are defined in `assets/fish/fish-types.json`. To add another fish, add a PNG to `assets/fish` and a matching JSON entry with its id, price, meal coins, swim style, width, and image file name.

## Game Rules

- Fish need one feeding in each 12-hour meal window.
- Missing a meal removes half a heart.
- Four clean feeds in a row restore half a heart.
- Feeding fish earns coins.
- Fed fish poop one hour later.
- The tank gets green and hazy over the week.
- Scrub 80% of the glass with the sponge tool to fully clean the tank.

## Save Data

The game saves to `localStorage` in your browser.
