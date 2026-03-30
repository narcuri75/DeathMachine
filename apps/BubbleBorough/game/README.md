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

From inside the `assets` folder, you can also just run:

```bat
generate-asset-manifest.bat
```

If you ever need a manifest key to differ from the actual PNG filename, add that mapping to `assets/asset-manifest-key-overrides.json`.

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

Decor metadata lives in `assets/decor/decor_types.json`. Any decor PNG whose file name ends with `_bubbler.png` is treated as a bubbler decor item, locked to layer 5, and its bubbles render behind the main image. You can configure bubbler spouts with a `bubbler` block like this:

```json
{
  "file": "volcano_bubbler.png",
  "name": "Volcano",
  "cost": 20,
  "width": 260,
  "defaultScale": 1,
  "bubbler": {
    "spoutQty": 1,
    "spouts": [
      {
        "horizontalLocation": 0.5,
        "intensity": 2.6,
        "speed": 0.7,
        "spread": 12,
        "fadeDistance": 200,
        "bubbleColor": "#FF533D",
        "bubbleOpacity": 1.6
      }
    ]
  }
}
```

For bubbler spouts, `spread` means the width of the vent opening that bubbles come out of, not how far the bubbles drift side to side while rising.
`speed` controls how fast the bubbles rise. Around `1.0` keeps the default motion for that intensity, `0.5` is much slower, and `2.0` is much faster.
`bubbleOpacity` controls how visible the bubbles are. Around `1.0` is normal, `1.5` to `2.0` is much more obvious, and `2.5+` is very bold.
To randomize colors per emitted bubble, you can use either `"bubbleColors": ["#FF2A00", "#FFD000", "#FFFFFF"]` or a comma-separated string in `"bubbleColor"`.

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
