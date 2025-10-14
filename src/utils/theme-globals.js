/**
 * Evo Theme - Global Configuration
 * Central configuration and global variables
 * 
 * @description Manages theme-wide settings and responsive breakpoints
 * @version 1.0.0
 */

// Initialize theme global object
window.theme = window.theme || {}

// Theme configuration
window.theme.config = {
  mqlSmall: false,
  mediaQuerySmall: 'screen and (max-width: 749px)',
  mediaQueryMedium: 'screen and (min-width: 750px) and (max-width: 999px)',
  mediaQueryLarge: 'screen and (min-width: 1000px)',
  isTouch: ('ontouchstart' in window) || window.DocumentTouch && window.document instanceof DocumentTouch || window.navigator.maxTouchPoints || window.navigator.msMaxTouchPoints ? true : false,
  rtl: document.documentElement.getAttribute('dir') === 'rtl' ? true : false
}

// Theme sizes (breakpoints)
window.theme.sizes = {
  mobile: 749,
  small: 750,
  medium: 999,
  large: 1000,
  widescreen: 1400
}

// Theme settings (configured for optimal performance)
window.theme.settings = {
  cartType: 'drawer',
  isCustomerTemplate: false,
  moneyFormat: '${{amount}}',
  predictiveSearch: true,
  predictiveSearchType: 'product,page,article',
  quickAdd: true,
  themeName: 'Evo',
  themeVersion: '1.0.0',
  themeAuthor: 'Evo Development Team',
  performanceMode: true
}

// Theme strings for localization
window.theme.strings = {
  addToCart: 'Add to cart',
  soldOut: 'Sold out',
  unavailable: 'Unavailable',
  regularPrice: 'Regular price',
  salePrice: 'Sale price',
  unitPrice: 'Unit price',
  unitPriceSeparator: 'per',
  onSale: 'Sale',
  quantity: 'Quantity',
  quantityMinimumMessage: 'Quantity must be 1 or more',
  quantityMaximumMessage: 'You can only add [quantity] of this item to your cart',
  cartError: 'There was an error while updating your cart. Please try again.',
  cartTermsConfirmation: 'You must agree to the terms and conditions before checking out.',
  searchNoResults: 'No results found for "[terms]". Check the spelling or use a different word or phrase.',
  searchResults: 'Search results for "[terms]"',
  searchResultsCount: {
    one: '[count] result for "[terms]"',
    other: '[count] results for "[terms]"'
  }
}

// Theme routes
window.theme.routes = {
  root: '/',
  account: '/account',
  cart: '/cart',
  cartAdd: '/cart/add.js',
  cartChange: '/cart/change.js',
  cartUpdate: '/cart/update.js',
  predictiveSearch: '/search/suggest.json',
  productRecommendations: '/recommendations/products.json'
}

export default window.theme
