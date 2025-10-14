/**
 * Error Tab Index Component
 * Handles accessibility for error messages
 */

export function errorTabIndex(container) {
  const errata = container.querySelectorAll('.errors')
  
  errata.forEach((element) => {
    element.setAttribute('tabindex', '0')
    element.setAttribute('aria-live', 'assertive')
    element.setAttribute('role', 'alert')
  })
}

// Auto-initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
  errorTabIndex(document)
})

export default errorTabIndex


