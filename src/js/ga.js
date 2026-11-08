/**
 * @file ga.js
 * @description Provides a performance-optimized loader for Google Analytics (GA4) 
 * using an interaction-based lazy loading strategy.
 */

/**
 * Initializes Google Analytics tracking IDs using a lazy-loading strategy.
 * @param {...string} ids One or more Google tracking IDs (e.g., 'G-XXXXX').
 * @returns {void}
 */
export function initGA(...ids) {
  if (ids.length === 0) {
    console.warn('Google Analytics ID is required')
    return
  }

  let loaded = false

  const loadAnalytics = () => {
    if (loaded || !ids[0]) return
    loaded = true

    window.dataLayer = window.dataLayer || []
    window.gtag = function gtag() {
      window.dataLayer.push(arguments)
    }

    const script = document.createElement('script')
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ids[0]}`
    script.async = true

    script.onload = () => {
      window.gtag('js', new Date())
      ids.forEach((id) => {
        window.gtag('config', id)
      })
    }

    document.head.appendChild(script)
  }

  const startAnalytics = () => {
    window.removeEventListener('mousemove', startAnalytics)
    window.removeEventListener('touchstart', startAnalytics)
    window.removeEventListener('scroll', startAnalytics)
    window.removeEventListener('keydown', startAnalytics)

    loadAnalytics()
  }

  window.addEventListener('mousemove', startAnalytics, { once: true, passive: true })
  window.addEventListener('touchstart', startAnalytics, { once: true, passive: true })
  window.addEventListener('scroll', startAnalytics, { once: true, passive: true })
  window.addEventListener('keydown', startAnalytics, { once: true, passive: true })
}
