/**
 * Evo Theme - Vendor Dependencies
 * External libraries and third-party integrations
 * 
 * @description Manages all external dependencies for optimal performance
 * @version 1.0.0
 */

import AOS from 'aos'
import FlickityFade from 'flickity-fade'
import ScrollLock from 'scroll-lock'
import Flickity from 'flickity'
import MicroModal from 'micromodal'
import Rellax from 'rellax'
import axios from 'axios'

// Theme-specific vendor modules (these would need to be implemented or sourced)
// import themeCurrency from './vendor/theme-currency'
// import FlickitySync from './vendor/flickity-sync'
// import themeAddresses from './vendor/theme-addresses'
// import Sqrl from './vendor/sqrl'

// Create theme vendor namespace
window.themeVendor = {
  AOS,
  FlickityFade,
  ScrollLock,
  Flickity,
  MicroModal,
  Rellax,
  axios,
  // themeCurrency,
  // FlickitySync,
  // themeAddresses,
  // Sqrl
}

// Initialize AOS (Animate On Scroll)
AOS.init({
  duration: 800,
  easing: 'ease-in-out',
  once: true
})

export {
  AOS,
  FlickityFade,
  ScrollLock,
  Flickity,
  MicroModal,
  Rellax,
  axios
}
