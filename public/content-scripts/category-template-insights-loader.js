// Loader: injects category-template-insights.js into the MAIN world so it
// can access Actual Budget's window.$q and window.$query.
(function () {
  'use strict';

  function injectScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = chrome.runtime.getURL(src);
      script.onload = () => { script.remove(); resolve(); };
      script.onerror = reject;
      document.documentElement.appendChild(script);
    });
  }

  injectScript('content-scripts/category-template-insights.js').catch((err) => {
    console.error('[ABT CTI] Failed to inject script:', err);
  });
})();
