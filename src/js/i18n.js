/**
 * Base URL.
 *
 * @type {string}
 */
const base = import.meta.env.BASE_URL || '/'

/**
 * Current language code used on the website.
 * @type {string}
 */
window.currentLang = 'en'

/**
 * List of supported language codes.
 * @type {string[]}
 */
export const supportedLangs = ['en', 'fr', 'de', 'es', 'pt', 'it', 'zh', 'ja']

/**
 * The key used to store language translations in sessionStorage.
 * @type {string}
 */
const CACHE_KEY = 'i18n-cache'

/**
 * Time-to-live (TTL) for cached translations in milliseconds.
 * After this duration, the cached translations are considered stale.
 * Currently set to 10 minutes.
 * @type {number}
 */
const CACHE_TTL = 10 * 60 * 1000

/**
 * Applies the given translations to all elements with
 * `data-i18n` and `data-i18n-placeholder` attributes.
 * For `data-i18n`, sets `textContent` or `innerHTML` based on content.
 * For `data-i18n-placeholder`, sets the placeholder attribute.
 *
 * @param {Object.<string,string>} translations
 */
export function applyTranslations(translations) {
  window.translations = translations

  // Apply translations for text content (supports HTML)
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n')
    // eslint-disable-next-line security/detect-object-injection
    const translation = translations[key]
    if (!translation) return

    const hasHTML = /<\/?[a-z][\s\S]*>/i.test(translation) || /&[a-z]+;/.test(translation)
    if (hasHTML) {
      el.innerHTML = translation
    } else {
      el.textContent = translation
    }
  })

  // Apply translations for placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder')
    // eslint-disable-next-line security/detect-object-injection
    const translation = translations[key]
    if (translation) {
      el.setAttribute('placeholder', translation)
    }
  })
}

/**
 * Get translations from cache (if valid).
 * @param {string} lang
 * @returns {Object|null}
 */
function getCachedTranslations(lang) {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null

    const cache = JSON.parse(raw)
    // eslint-disable-next-line security/detect-object-injection
    const entry = cache[lang]
    if (!entry) return null

    if (Date.now() - entry.timestamp > CACHE_TTL) return null
    return entry.translations
  } catch {
    return null
  }
}

/**
 * Store translations in sessionStorage cache.
 * @param {string} lang
 * @param {Object} translations
 */
function setCachedTranslations(lang, translations) {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    const cache = raw ? JSON.parse(raw) : {}
    // eslint-disable-next-line security/detect-object-injection
    cache[lang] = {
      timestamp: Date.now(),
      translations,
    }
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(cache))
  } catch (err) {
    console.warn(`Failed to cache translations for "${lang}":`, err)
  }
}

/**
 * Clear i18n cache on page unload.
 */
window.addEventListener('beforeunload', () => {
  sessionStorage.removeItem(CACHE_KEY)
})

/**
 * Highlights the currently selected language button by
 * setting the `data-selected` attribute.
 *
 * @param {string} lang - The language code to highlight.
 */
function highlightSelectedLang(lang) {
  document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.removeAttribute('data-selected')
    if (btn.getAttribute('data-lang') === lang) {
      btn.setAttribute('data-selected', 'true')
    }
  })
}

/**
 * Changes the website language to the specified `lang`,
 * fetches corresponding translation JSON,
 * applies translations, updates page title, canonical link, and URL,
 * and highlights the selected language button.
 *
 * @param {string} lang - Language code to switch to.
 * @param {boolean} [keepQueryParam=true] - Whether to include `?lang=xx` in the address bar.
 * @returns {Promise<void>}
 */
export async function setLang(lang, keepQueryParam = true) {
  try {
    // Persist selected language in local storage
    localStorage.setItem('lang', lang)

    // Update the document's <html lang="..."> attribute
    document.documentElement.lang = lang

    // Load translations from cache or fetch from server
    let translations = getCachedTranslations(lang)

    if (!translations) {
      const res = await fetch(`${base}locales/${lang}.json`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      translations = await res.json()
      setCachedTranslations(lang, translations)
    }

    // Apply translations to the current page
    applyTranslations(translations)

    // Store current language globally
    window.currentLang = lang

    // Set the document <title> using i18n key if available
    const titleEl = document.querySelector('title')
    const titleKey = titleEl?.getAttribute('data-i18n')
    if (titleEl) {
      // eslint-disable-next-line security/detect-object-injection
      if (titleKey && translations[titleKey]) {
        // eslint-disable-next-line security/detect-object-injection
        titleEl.textContent = translations[titleKey]
      } else if (translations['website.title']) {
        document.title = translations['website.title']
      }
    }

    // Update <meta name="description"> content for localized SEO indexing
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc && translations['website.description']) {
      metaDesc.setAttribute('content', translations['website.description'])
    }

    // Update URL query parameter if requested
    const url = new URL(window.location)
    if (keepQueryParam) {
      url.searchParams.set('lang', lang)
    } else {
      url.searchParams.delete('lang')
    }

    // Remove any hash fragment from the URL when changing language
    url.hash = ''

    window.history.replaceState({}, '', url)

    // Update <link rel="canonical"> so each language variant is self-canonicalized for indexing
    const canonicalEl = document.querySelector('link[rel="canonical"]')
    if (canonicalEl) {
      const canonicalUrl = keepQueryParam
        ? `https://wexdev.com/?lang=${lang}`
        : 'https://wexdev.com/'
      canonicalEl.setAttribute('href', canonicalUrl)
    }

    // Visually highlight the selected language in the UI
    highlightSelectedLang(lang)
  } catch (err) {
    console.error(`Failed to load ${lang} translations:`, err)
  }
}

/**
 * Loads initial language.
 * Keeps `?lang` in URL if present on load or changed via dropdown.
 * Strips `?lang` only when visiting root without query params.
 *
 * @returns {Promise<void>}
 */
export async function loadInitialLanguage() {
  document.documentElement.setAttribute('data-loading', '')

  const params = new URLSearchParams(window.location.search)
  const urlLang = params.get('lang')
  const storedLang = localStorage.getItem('lang')

  const hasUrlLang = supportedLangs.includes(urlLang)
  const lang = hasUrlLang
    ? urlLang
    : supportedLangs.includes(storedLang)
      ? storedLang
      : 'en'

  // Keep ?lang in URL if present in request, otherwise keep clean
  await setLang(lang, hasUrlLang)

  document.documentElement.removeAttribute('data-loading')
}

// Listen for browser back/forward buttons or hash changes to reflect language state
window.addEventListener('popstate', () => {
  const params = new URLSearchParams(window.location.search)
  const urlLang = params.get('lang')
  const storedLang = localStorage.getItem('lang')

  const lang = supportedLangs.includes(urlLang)
    ? urlLang
    : supportedLangs.includes(storedLang)
      ? storedLang
      : 'en'

  setLang(lang, supportedLangs.includes(urlLang))
})

// Intercept nav anchor link clicks to scroll smoothly without resetting language
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href')
    if (targetId === '#') return

    const targetElem = document.querySelector(targetId)
    if (targetElem) {
      e.preventDefault()

      // Smooth scroll to target
      targetElem.scrollIntoView({ behavior: 'smooth' })

      // Properly construct URL with query params BEFORE hash
      const url = new URL(window.location.href)
      url.hash = targetId

      window.history.pushState({}, '', url)
    }
  })
})
