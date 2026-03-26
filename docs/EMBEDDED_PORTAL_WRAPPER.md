# Embedded Portal Wrapper

This portal now supports two access patterns:

- Embedded first-party wrapper mode:
  - Parent page URL stays fixed on `redthreads.com`
  - Iframe stays on the stable base Apps Script `/exec` URL
  - Project snapshots are loaded in place via `postMessage`
- Direct token mode:
  - Raw Apps Script links like `/exec?t=<token>` still render snapshots directly

## Message contract

Parent -> iframe:

- `RT_PORTAL_PING`
- `RT_PORTAL_LOAD_TOKEN`

Iframe -> parent:

- `RT_PORTAL_READY`

Notes:

- The iframe app validates parent origins against:
  - `https://www.redthreads.com`
  - `https://redthreads.com`
- The parent wrapper should accept ready events from:
  - `https://script.google.com`
  - `https://*.googleusercontent.com`
- The parent should reply to the exact `event.source` / `event.origin` that emitted `RT_PORTAL_READY`.

## Fullscreen wrapper with loading state

Replace `YOUR_DEPLOYMENT_URL` with the current stable base `/exec` deployment URL.

```html
<!-- /portal PAGE Code Block — Fullscreen Apps Script + token bridge -->
<style>
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    height: 100% !important;
    overflow: hidden !important;
  }

  .rt-portal-fullscreen {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    z-index: 999999;
    background: #000;
  }

  .rt-portal-fullscreen iframe {
    width: 100%;
    height: 100%;
    border: 0;
    display: block;
    background: transparent;
  }

  .rt-portal-loading {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.72);
    color: #fff;
    font: 700 18px/1.4 system-ui, sans-serif;
    letter-spacing: 0.02em;
    transition: opacity 180ms ease;
  }

  .rt-portal-loading[hidden] {
    opacity: 0;
    pointer-events: none;
  }
</style>

<div class="rt-portal-fullscreen">
  <div id="rtPortalLoading" class="rt-portal-loading">Loading portal…</div>
  <iframe
    id="rtPortalFrame"
    title="Red Threads Portal"
    src="YOUR_DEPLOYMENT_URL"
    allow="clipboard-read; clipboard-write"
    referrerpolicy="strict-origin-when-cross-origin"
    loading="eager">
  </iframe>
</div>

<script>
  (function () {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    var token = new URLSearchParams(window.location.search).get("t");
    var loadingEl = document.getElementById("rtPortalLoading");
    var portalWindow = null;
    var portalOrigin = "";
    var tokenSent = false;

    function isPortalOrigin(origin) {
      try {
        var url = new URL(origin);
        return (
          url.origin === "https://script.google.com" ||
          /\.googleusercontent\.com$/i.test(url.hostname)
        );
      } catch (_) {
        return false;
      }
    }

    function hideLoading() {
      if (!loadingEl) return;
      loadingEl.hidden = true;
    }

    function sendTokenToPortal() {
      if (!token || !portalWindow || !portalOrigin || tokenSent) return;
      try {
        portalWindow.postMessage(
          {
            type: "RT_PORTAL_LOAD_TOKEN",
            payload: { token: token }
          },
          portalOrigin
        );
        tokenSent = true;
      } catch (_) {}
    }

    window.addEventListener("message", function (event) {
      if (!isPortalOrigin(event.origin)) return;
      if (!event.data || typeof event.data !== "object") return;

      if (event.data.type === "RT_PORTAL_READY") {
        portalWindow = event.source;
        portalOrigin = event.origin;
        sendTokenToPortal();
        hideLoading();
      }
    });

    setTimeout(hideLoading, 12000);
  })();
</script>
```

## Manual test checklist

1. Load `https://www.redthreads.com/portal` and confirm the iframe fills the page.
2. Log in and confirm the dashboard loads without changing the parent URL.
3. Open a project from the dashboard and confirm the parent URL and iframe URL both stay fixed.
4. Use `https://www.redthreads.com/portal?t=<token>` and confirm the exact snapshot loads in place.
5. Use a raw Apps Script URL `.../exec?t=<token>` and confirm direct token mode still renders the snapshot directly.
