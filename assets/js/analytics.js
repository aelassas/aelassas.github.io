(function () {
  var ID = 'G-9C49146FEV';
  var loaded = false;
  var events = ['pointerdown', 'touchstart', 'keydown', 'scroll', 'mousemove'];

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', ID);

  // gtag.js is loaded lazily; queued commands are sent once it arrives
  function load() {
    if (loaded) return;
    loaded = true;
    events.forEach(function (e) { window.removeEventListener(e, load); });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
    document.head.appendChild(s);
  }

  events.forEach(function (e) { window.addEventListener(e, load, { passive: true }); });

  // Fallback so visitors who never interact are still counted
  function schedule() { setTimeout(load, 4000); }
  if (document.readyState === 'complete') schedule();
  else window.addEventListener('load', schedule);
})();
