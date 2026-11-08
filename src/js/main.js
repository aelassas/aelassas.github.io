import { loadInitialLanguage, setLang } from './i18n.js'
import {
  initHamburgerMenu,
  initLanguageMenu,
  initThemeToggle,
  updateFooterYear
} from './utils.js'

// Wait for DOM to be fully loaded before initializing the app
window.addEventListener('DOMContentLoaded', async () => {
  try {
    // Load and apply the correct language based on ?lang or localStorage, then clean URL
    await loadInitialLanguage()

    // Initialize UI components
    initHamburgerMenu()        // Mobile nav toggle
    initLanguageMenu(setLang)  // Language dropdown logic
    initThemeToggle()          // Light/dark mode toggle
    updateFooterYear()         // Set current year in footer
  } catch (err) {
    console.error('Error during app initialization:', err)
  }
})
