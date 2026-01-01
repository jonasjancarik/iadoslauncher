---
trigger: always_on
glob:
description:
---

- The app is an Electron application.
- To inspect layout and verify UI changes in a browser, use `npm run dev:web`.
- The renderer is located in `src/renderer`.
- Electron and Node.js APIs are mocked in `src/renderer/src/electron-shim.js` for browser compatibility.
- Avoid using `window.require` directly for new features if possible; wrap it in an adapter that can be easily mocked.