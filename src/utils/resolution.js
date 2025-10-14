/**
 * Evo Theme - Responsive Resolution Manager
 * Advanced responsive breakpoint and device detection system
 * 
 * @description Intelligent responsive behavior for optimal user experience
 * @version 1.0.0
 */

const resolution = {}

function initResolution() {
  const touchQuery = '(hover: none) and (pointer: coarse)'
  const mobileQuery = `(max-width: ${window.theme.sizes.medium}px)`
  const tabletQuery = `(min-width: ${window.theme.sizes.medium + 1}px) and (max-width: ${window.theme.sizes.large}px)`
  const desktopQuery = `(min-width: ${window.theme.sizes.large + 1}px)`

  resolution.isTouch = () => {
    const touchMatches = window.matchMedia(touchQuery).matches
    document.documentElement.classList.toggle('supports-touch', touchMatches)
    return touchMatches
  }

  resolution.isMobile = () => window.matchMedia(mobileQuery).matches
  resolution.isTablet = () => window.matchMedia(tabletQuery).matches
  resolution.isDesktop = () => window.matchMedia(desktopQuery).matches

  const queries = [
    [touchQuery, resolution.isTouch],
    [mobileQuery, resolution.isMobile],
    [tabletQuery, resolution.isTablet],
    [desktopQuery, resolution.isDesktop]
  ]

  resolution.onChange = (callback) => {
    queries.forEach((query) => {
      window.matchMedia(query[0]).addEventListener('change', () => {
        if (query[1]() && callback) callback()
      })
    })
  }

  // Initialize on load
  resolution.isTouch()
}

// Initialize resolution utilities
initResolution()

export default resolution
