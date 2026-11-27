/**
 * Base URL.
 *
 * @type {string}
 */
const base = import.meta.env?.BASE_URL || '/'

/**
 * Current language code used on the website.
 * @type {string}
 */
window.currentLang = 'en'

/**
 * List of supported language codes.
 * @type {string[]}
 */
export const supportedLangs = ['en', 'fr', 'de', 'es', 'pt-br', 'pt-pt', 'it', 'zh', 'ja', 'ko', 'ru']

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
 * Safely reads the stored language preference from localStorage.
 * @returns {string|null}
 */
function getStoredLang() {
  try {
    return localStorage.getItem('lang')
  } catch {
    return null
  }
}

/**
 * Safely stores the selected language preference in localStorage.
 * @param {string} lang
 */
function storeLang(lang) {
  try {
    localStorage.setItem('lang', lang)
  } catch {
    // Storage may be unavailable in privacy-restricted browsing contexts.
  }
}

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
// window.addEventListener('beforeunload', () => {
//   try {
//     sessionStorage.removeItem(CACHE_KEY)
//   } catch {
//     // Ignore storage errors on unload
//   }
// })

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
  const targetLang = supportedLangs.includes(lang) ? lang : 'en'

  try {
    // Persist selected language in local storage
    storeLang(targetLang)

    // Update the document's <html lang="..."> attribute
    document.documentElement.lang = targetLang

    // Load translations from cache or fetch from server
    let translations = getCachedTranslations(targetLang)

    if (!translations) {
      const res = await fetch(`${base}locales/${targetLang}.json`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      translations = await res.json()
      setCachedTranslations(targetLang, translations)
    }

    // Apply translations to the current page
    applyTranslations(translations)

    // Store current language globally
    window.currentLang = targetLang

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
    const descKey = metaDesc?.getAttribute('data-i18n-content') || 'website.description'
    // eslint-disable-next-line security/detect-object-injection
    if (metaDesc && translations[descKey]) {
      // eslint-disable-next-line security/detect-object-injection
      metaDesc.setAttribute('content', translations[descKey])
    }

    // Update URL query parameter if requested
    const url = new URL(window.location.href)
    if (keepQueryParam) {
      url.searchParams.set('lang', targetLang)
    } else {
      url.searchParams.delete('lang')
    }

    // Remove any hash fragment from the URL when changing language
    url.hash = ''

    window.history.replaceState({}, '', url)

    // Update <link rel="canonical"> so each language variant is self-canonicalized for indexing
    const canonicalEl = document.querySelector('link[rel="canonical"]')
    if (canonicalEl) {
      const pathname = window.location.pathname.endsWith('/')
        ? window.location.pathname
        : `${window.location.pathname}/`
      const pageUrl = `https://wexdev.com${pathname}`
      const canonicalUrl = keepQueryParam
        ? `${pageUrl}?lang=${targetLang}`
        : pageUrl
      canonicalEl.setAttribute('href', canonicalUrl)
    }

    // Visually highlight the selected language in the UI
    highlightSelectedLang(targetLang)
  } catch (err) {
    console.error(`Failed to load ${targetLang} translations:`, err)
  }
}

/**
 * Wrapper around window.location.assign for testability in jsdom.
 * @type {{ assign: (url: string) => void }}
 */
export const navigation = {
  assign: (url) => window.location.assign(url),
}

/**
 * Persists the selected language and reloads the page with `?lang=<targetLang>`
 * so Google Analytics registers a distinct pageview for the new language.
 *
 * @param {string} lang - Language code to switch to.
 * @returns {void}
 */
export function switchLang(lang) {
  const targetLang = supportedLangs.includes(lang) ? lang : 'en'
  storeLang(targetLang)

  const url = new URL(window.location.href)
  url.searchParams.set('lang', targetLang)
  url.hash = ''

  navigation.assign(url.toString())
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

  try {
    const params = new URLSearchParams(window.location.search)
    const urlLang = params.get('lang')
    const storedLang = getStoredLang()

    const hasUrlLang = supportedLangs.includes(urlLang)
    const lang = hasUrlLang
      ? urlLang
      : supportedLangs.includes(storedLang)
        ? storedLang
        : 'en'

    // Keep ?lang in URL if present in request, otherwise keep clean
    await setLang(lang, hasUrlLang)
  } finally {
    document.documentElement.removeAttribute('data-loading')
  }
}

// Listen for browser back/forward buttons or hash changes to reflect language state
window.addEventListener('popstate', () => {
  const params = new URLSearchParams(window.location.search)
  const urlLang = params.get('lang')
  const storedLang = getStoredLang()

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
