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
 * handles click-outside, and closes on Escape key press.
 * 
 * @param {function(string, boolean=): Promise<void>} setLang - Async function to change the app language.
 */
export function initLanguageMenu(setLang) {
  const langToggle = document.getElementById('lang-toggle')
  const langMenu = document.getElementById('lang-menu')

  if (!langToggle || !langMenu) return

  const closeMenu = () => {
    langToggle.setAttribute('aria-expanded', 'false')
    langMenu.hidden = true
  }

  langToggle.addEventListener('click', () => {
    const expanded = langToggle.getAttribute('aria-expanded') === 'true'
    langToggle.setAttribute('aria-expanded', !expanded)
    langMenu.hidden = expanded
  })

  langMenu.querySelectorAll('button').forEach(item => {
    item.addEventListener('click', async () => {
      const lang = item.getAttribute('data-lang')
      if (lang) {
        await setLang(lang, true)
      }
      closeMenu()
    })
  })

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!langToggle.contains(e.target) && !langMenu.contains(e.target)) {
      closeMenu()
    }
  })

  // Close on Escape key press and return focus to trigger button
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !langMenu.hidden) {
      closeMenu()
      langToggle.focus()
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

  const themeMeta = document.querySelector('meta[name="theme-color"]')

  function updateThemeState(theme) {
    document.documentElement.setAttribute('data-theme', theme)
    themeToggleBtn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false')
    themeToggleBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme')
    if (themeMeta) {
      themeMeta.setAttribute('content', theme === 'dark' ? '#0b0b0e' : '#f3f3f4')
    }
  }

  const savedTheme = localStorage.getItem('theme') || 'light'
  updateThemeState(savedTheme)

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme')
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
    localStorage.setItem('theme', newTheme)
    updateThemeState(newTheme)
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
