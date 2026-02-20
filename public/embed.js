/**
 * Quran Digital Widget Embed Script
 * 
 * Cara embed di website lain:
 * 
 * 1. Tambahkan script ini:
 *    <script src="https://quran-app.kajianislamsangatta.com/embed.js"></script>
 * 
 * 2. Tambahkan container:
 *    <div id="quran-digital-widget"></div>
 * 
 * 3. Atau dengan custom options:
 *    <div id="quran-widget" style="width: 400px; height: 700px;"></div>
 *    <script>
 *      QuranDigital.init({
 *        target: '#quran-widget',
 *        width: '400px',
 *        height: '700px'
 *      });
 *    </script>
 */
(function () {
  'use strict';

  // Base URL where the Quran Digital app is hosted
  // Change this to your actual deployment URL
  var BASE_URL = window.QURAN_DIGITAL_BASE_URL || 'https://quran-app.kajianislamsangatta.com';

  var defaultOptions = {
    target: '#quran-digital-widget',
    width: '100%',
    maxWidth: '430px',
    height: '700px',
    borderRadius: '16px',
    shadow: true,
  };

  function createWidget(userOptions) {
    var options = {};
    for (var key in defaultOptions) {
      options[key] = (userOptions && userOptions[key]) || defaultOptions[key];
    }

    var container = document.querySelector(options.target);
    if (!container) {
      console.error('[Quran Digital] Target element not found:', options.target);
      return;
    }

    var iframe = document.createElement('iframe');
    iframe.src = BASE_URL;
    iframe.title = 'Quran Digital';
    iframe.allow = 'geolocation; autoplay';
    iframe.style.width = options.width;
    iframe.style.maxWidth = options.maxWidth;
    iframe.style.height = options.height;
    iframe.style.border = 'none';
    iframe.style.borderRadius = options.borderRadius;
    iframe.style.display = 'block';
    iframe.style.margin = '0 auto';

    if (options.shadow) {
      iframe.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.15)';
    }

    container.innerHTML = '';
    container.appendChild(iframe);
  }

  // Auto-init if default container exists
  function autoInit() {
    var defaultContainer = document.querySelector(defaultOptions.target);
    if (defaultContainer) {
      createWidget();
    }
  }

  // Expose API globally
  window.QuranDigital = {
    init: createWidget,
  };

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }
})();
