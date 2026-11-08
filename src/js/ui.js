/**
 * Initializes the hamburger menu toggle.
 * Toggles the 'active' class on the hamburger button and the navigation menu,
 * and updates the aria-expanded attribute for accessibility.
 */
export function initHamburgerMenu() {
  const hamburger = document.querySelector('.menu-toggle')
  const nav = document.getElementById('site-nav')

  if (!hamburger || !nav) return

  hamburger.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true'
    hamburger.setAttribute('aria-expanded', !expanded)
    hamburger.classList.toggle('active')
    nav.classList.toggle('is-open', !expanded)
  })
}

/**
 * Initializes the language selection menu.
 * Toggles the language menu visibility, sets the selected language,
 * and navigates to /?lang=language on selection.
 * 
 * @param {function(string): Promise<void>} setLang - Async function to change the app language.
 */
export function initLanguageMenu(setLang) {
  const langToggle = document.getElementById('lang-toggle')
  const langMenu = document.getElementById('lang-menu')

  if (!langToggle || !langMenu) return

  langToggle.addEventListener('click', (e) => {
    e.stopPropagation()
    const expanded = langToggle.getAttribute('aria-expanded') === 'true'
    langToggle.setAttribute('aria-expanded', !expanded)
    langMenu.hidden = expanded
  })

  langMenu.querySelectorAll('button').forEach(item => {
    item.addEventListener('click', async () => {
      const lang = item.getAttribute('data-lang')
      if (lang) {
        localStorage.setItem('lang', lang)
        window.location.href = `/?lang=${lang}`
      }
      langToggle.setAttribute('aria-expanded', 'false')
      langMenu.hidden = true
    })
  })

  document.addEventListener('click', (e) => {
    if (!langToggle.contains(e.target) && !langMenu.contains(e.target)) {
      langToggle.setAttribute('aria-expanded', 'false')
      langMenu.hidden = true
    }
  })

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      langToggle.setAttribute('aria-expanded', 'false')
      langMenu.hidden = true
    }
  })
}

/**
 * Initializes the light/dark theme toggle button.
 * Loads saved theme from localStorage and updates the UI accordingly.
 * Toggles between 'light' and 'dark' themes and updates localStorage.
 *
 */
export function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle')
  if (!themeToggleBtn) return

  const iconSun = themeToggleBtn.querySelector('.icon-sun')
  const iconMoon = themeToggleBtn.querySelector('.icon-moon')

  function updateToggleIcon(theme) {
    if (!iconSun || !iconMoon) return

    if (theme === 'dark') {
      iconSun.style.display = 'block'
      iconMoon.style.display = 'none'
      themeToggleBtn.setAttribute('aria-pressed', 'true')
    } else {
      iconSun.style.display = 'none'
      iconMoon.style.display = 'block'
      themeToggleBtn.setAttribute('aria-pressed', 'false')
    }
  }

  const savedTheme = localStorage.getItem('theme') || 'light'
  document.documentElement.setAttribute('data-theme', savedTheme)
  updateToggleIcon(savedTheme)

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme')
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
    updateToggleIcon(newTheme)
  })
}

/**
 * Loads the GitHub buttons script once the page has finished its own DOM updates
 * (translations, theme, etc.) and the browser is idle. The script reads layout, so
 * loading it while layout is dirty would cause a forced reflow.
 */
export function initGitHubButton() {
  if (!document.querySelector('.github-button')) return

  const load = () => {
    const script = document.createElement('script')
    script.src = 'https://buttons.github.io/buttons.js'
    script.async = true
    document.body.appendChild(script)
  }

  const onIdle = () => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(load, { timeout: 2000 })
    } else {
      setTimeout(load, 200)
    }
  }

  // Wait for a rendered frame so pending style/layout work is flushed first
  requestAnimationFrame(() => setTimeout(onIdle, 0))
}

/**
 * Updates the footer year element with the current year.
 */
export function updateFooterYear() {
  const yearElem = document.getElementById('year')
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear()
  }
}
