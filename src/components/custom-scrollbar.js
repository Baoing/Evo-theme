/**
 * Custom Scrollbar Component
 * Handles custom scrollbar functionality
 */

const selectors = {
  holderItems: '[data-custom-scrollbar-items]',
  scrollbar: '[data-custom-scrollbar]',
  scrollbarTrack: '[data-custom-scrollbar-track]'
}

const classes = {
  hide: 'hide'
}

export function initCustomScrollbar(container) {
  const scrollbarElements = container.querySelectorAll(selectors.scrollbar)
  
  scrollbarElements.forEach((scrollbar) => {
    const items = scrollbar.querySelector(selectors.holderItems)
    const track = scrollbar.querySelector(selectors.scrollbarTrack)
    
    if (!items || !track) return

    const updateScrollbar = () => {
      const scrollWidth = items.scrollWidth
      const clientWidth = items.clientWidth
      const scrollLeft = items.scrollLeft
      
      // Hide scrollbar if content fits
      if (scrollWidth <= clientWidth) {
        scrollbar.classList.add(classes.hide)
        return
      } else {
        scrollbar.classList.remove(classes.hide)
      }
      
      // Update track position
      const scrollPercentage = scrollLeft / (scrollWidth - clientWidth)
      const trackWidth = track.offsetWidth
      const maxTrackPosition = scrollbar.offsetWidth - trackWidth
      
      track.style.transform = `translateX(${scrollPercentage * maxTrackPosition}px)`
    }

    // Handle scroll events
    items.addEventListener('scroll', updateScrollbar)
    
    // Handle window resize
    window.addEventListener('resize', updateScrollbar)
    
    // Initialize
    updateScrollbar()
  })
}

// Auto-initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
  initCustomScrollbar(document)
})

export default initCustomScrollbar


