/**
 * @file theme-toggle.js
 * @description Controls theme switching (light/dark mode), mobile navigation menu 
 * toggling, and active scroll section highlighting for the site header.
 */
(function () {
  var root = document.documentElement;

  var themeButton = document.getElementById('theme-toggle');
  if (themeButton) {
    var syncTheme = function () {
      var dark = root.getAttribute('data-theme') === 'dark';
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', dark ? '#0b0b0e' : '#f3f3f4');
      themeButton.setAttribute('aria-pressed', String(dark));
      themeButton.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    };

    themeButton.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) { /* storage unavailable */ }
      syncTheme();
    });

    syncTheme();
  }

  var menuButton = document.getElementById('menu-toggle');
  var nav = document.getElementById('site-nav');
  if (menuButton && nav) {
    var setMenu = function (open) {
      nav.classList.toggle('is-open', open);
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };

    menuButton.addEventListener('click', function () {
      setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        menuButton.focus();
      }
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest('.site-header__inner')) setMenu(false);
    });

    var desktop = window.matchMedia('(min-width: 641px)');
    var onChange = function (e) { if (e.matches) setMenu(false); };
    if (desktop.addEventListener) desktop.addEventListener('change', onChange);
    else if (desktop.addListener) desktop.addListener(onChange);
  }

  // Highlight the nav link of the section currently in view
  const highlightNavLink = () => {
    var links = nav ? Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]')) : [];
    var sections = links.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); });
    if (links.length) {
      var ticking = false;
      var update = function () {
        ticking = false;
        var current = -1;
        var atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
        if (atBottom) {
          current = links.length - 1;
        } else {
          sections.forEach(function (s, i) {
            if (s && s.getBoundingClientRect().top <= 140) current = i;
          });
        }
        links.forEach(function (a, i) {
          if (i === current) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      };
      window.addEventListener('scroll', function () {
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(update);
        }
      }, { passive: true });
      update();
    }
  };

  // Uncomment the line below to enable highlighting of nav links based on scroll position + set header position to sticky
  // highlightNavLink();
})();
