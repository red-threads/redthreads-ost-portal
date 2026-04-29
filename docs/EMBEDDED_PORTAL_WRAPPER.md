# Embedded Portal Wrapper

This is the current production Squarespace `/portal` code block for the Red Threads Portal.

The wrapper uses direct iframe query passthrough:

- No visible loading overlay.
- No `postMessage` token bridge required.
- The iframe `src` is set dynamically to the stable Apps Script deployment URL.
- The wrapper forwards these query parameters into the iframe URL when present:
  - `t`
  - `checkoutResult`
  - `stripeSessionId`

Raw Apps Script token links remain supported separately by the Apps Script web app.

## Production Squarespace `/portal` Code Block

```html
<!-- /portal PAGE Code Block — Fullscreen Apps Script + branded token passthrough -->
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
</style>

<div class="rt-portal-fullscreen">
  <iframe
    id="rtPortalFrame"
    title="Red Threads Portal"
    allow="clipboard-read; clipboard-write"
    referrerpolicy="strict-origin-when-cross-origin"
    loading="eager">
  </iframe>
</div>

<script>
  (function () {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    var APP_URL = "https://script.google.com/macros/s/AKfycbz9qDgp65f5S3RWhSxGftioMXKKU9O1N0mpHh3waoKY2YyvE72F-cJk-0XYr5YXg4bw/exec";

    var queryParams = new URLSearchParams(window.location.search);
    var iframeParams = new URLSearchParams();

    var token = queryParams.get("t");
    var checkoutResult = queryParams.get("checkoutResult");
    var stripeSessionId = queryParams.get("stripeSessionId");

    if (token) {
      iframeParams.set("t", token);
    }

    if (checkoutResult) {
      iframeParams.set("checkoutResult", checkoutResult);
    }

    if (stripeSessionId) {
      iframeParams.set("stripeSessionId", stripeSessionId);
    }

    var iframe = document.getElementById("rtPortalFrame");

    iframe.src = iframeParams.toString()
      ? APP_URL + "?" + iframeParams.toString()
      : APP_URL;
  })();
</script>
```

## Manual Test Checklist

1. Load `https://www.redthreads.com/portal` and confirm the Apps Script portal fills the page.
2. Load `https://www.redthreads.com/portal?t=<token>` and confirm the tokenized project loads inside the iframe.
3. Load `https://www.redthreads.com/portal?t=<token>&checkoutResult=success&stripeSessionId=<session_id>` and confirm all three parameters are present on the iframe URL.
4. Confirm a paid/locked project lands on the Invoice/Summary tab.
5. Confirm there is no visible wrapper loading overlay and no dependency on a parent/iframe `postMessage` token bridge.
