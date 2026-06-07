# VoidFM GitHub Pages Web App

This folder is the self-contained browser-only VoidFM package for GitHub Pages.

Upload or publish the contents of this `Web app` folder as static files. GitHub Pages does not run Node, so the app stores user data in the visitor's browser instead of using `server.js`.

## Included Runtime Files

- `static/index.html` - app entrypoint
- `static/styles.css` - full UI styling
- `static/browser-api.js` - IndexedDB-backed browser API shim that replaces `/api/...`
- `static/service-worker.js` - app-shell cache for static assets
- `static/app.js` and engine files - VoidFM UI and playback logic
- `static/assets/` - icons and images
- `static/site.webmanifest`, popout pages, and favicon
- `verify-web-app.js` - optional local dependency/reference checker

## Browser Storage

VoidFM stores app data locally in the user's browser:

- IndexedDB: Plex connection, Plex library cache, local library metadata, playlists, rules, shuffle profiles, listening history, playback state, metadata, lyrics, and chords.
- localStorage: small UI preferences.
- Cache Storage: static app shell via the service worker.

Use the in-app export backup action to download a browser backup file. Browser storage can be cleared by the user, private browsing mode, storage pressure, or browser settings.

## Plex Direct Mode

This static version attempts direct browser-to-Plex requests. Plex features can be blocked by:

- CORS restrictions
- mixed-content rules when a HTTPS website tries to access HTTP Plex URLs
- Plex server/network visibility
- browser media codec support

When direct mode is blocked, the app should keep running and show the relevant failure. Server-only features from the desktop app are not available here: proxy streaming, HLS rewriting, server transcoding, server audio cache, and server artwork proxy.

## Local Media

On browsers that support the File System Access API, use the browser folder picker to add a local music folder. The app stores the folder handle and rescans locally through the browser.

Unsupported browsers should use file/import workflows instead. iOS Safari does not currently support persistent folder handles.

## Verify Before Upload

From this folder:

```powershell
npm.cmd run check
```

The check verifies JavaScript syntax and scans local HTML/CSS/JS/manifest references to catch missing files before deployment.

## GitHub Pages Notes

The app uses relative paths so it can run from a root site or a project subpath. Publish the whole folder contents together; do not publish only `index.html`.
