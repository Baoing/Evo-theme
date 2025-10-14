/**
 * Evo Theme - Animation Utilities Plugin
 * Helper functions for smooth animations and transitions
 * 
 * @description Provides animation utilities for enhanced user experience
 * @version 1.0.0
 */

export default function animationUtilsPlugin(Alpine) {
  // Animation utility functions
  Alpine.magic('animate', () => ({
    fadeIn: (el, duration = 300) => {
      el.style.opacity = '0'
      el.style.transition = `opacity ${duration}ms ease-in-out`
      requestAnimationFrame(() => {
        el.style.opacity = '1'
      })
    },
    
    fadeOut: (el, duration = 300) => {
      el.style.transition = `opacity ${duration}ms ease-in-out`
      el.style.opacity = '0'
      setTimeout(() => {
        el.style.display = 'none'
      }, duration)
    },
    
    slideDown: (el, duration = 300) => {
      el.style.height = '0px'
      el.style.overflow = 'hidden'
      el.style.transition = `height ${duration}ms ease-in-out`
      requestAnimationFrame(() => {
        el.style.height = el.scrollHeight + 'px'
      })
    },
    
    slideUp: (el, duration = 300) => {
      el.style.height = el.scrollHeight + 'px'
      el.style.overflow = 'hidden'
      el.style.transition = `height ${duration}ms ease-in-out`
      requestAnimationFrame(() => {
        el.style.height = '0px'
      })
    }
  }))
}


