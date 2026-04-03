// Loader: Injects D3 and income-breakdown.js into the MAIN world
// so they can access Actual Budget's window.$q and window.$query.
(function () {
  'use strict';

  function injectScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = chrome.runtime.getURL(src);
      script.onload = () => {
        script.remove();
        resolve();
      };
      script.onerror = reject;
      document.documentElement.appendChild(script);
    });
  }

  async function load() {
    try {
      await injectScript('lib/d3.min.js');
      await injectScript('lib/d3-sankey.min.js');
      await injectScript('content-scripts/income-breakdown.js');
    } catch (err) {
      console.error('[ABT Income Breakdown] Failed to inject scripts:', err);
    }
  }

  load();
})();
