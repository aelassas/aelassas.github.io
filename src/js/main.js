/**
 * @file main.js
 * @description Main application entry point for wexdev.com. Initializes analytics,
 * theme toggling, language menu interaction, and mobile navigation.
 */
import { initGA } from './ga.js'
import { initThemeToggle, initLanguageMenu, initHamburgerMenu, updateFooterYear } from './ui.js'
import { loadInitialLanguage, setLang } from './i18n.js'

// Initialize GA4 lazily on first interaction
initGA('G-9C49146FEV')

// Initialize UI helpers
initThemeToggle()
initLanguageMenu(setLang)
initHamburgerMenu()
updateFooterYear()

// Load initial language from URL, localStorage, or fallback
loadInitialLanguage()
