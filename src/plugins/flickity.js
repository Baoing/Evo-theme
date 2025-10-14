/**
 * Evo Theme - Flickity Integration Plugin
 * Advanced carousel system with Alpine.js integration
 * 
 * @description High-performance carousel with touch support and accessibility
 * @version 1.0.0
 */

import Flickity from 'flickity'

export default function flickityPlugin(Alpine) {
  Alpine.directive('flickity', (el, { expression, modifiers }, { evaluateLater, cleanup }) => {
    let flickityInstance = null
    let options = {}
    
    // Parse options from expression
    if (expression) {
      const getOptions = evaluateLater(expression)
      getOptions((value) => {
        options = value || {}
      })
    }
    
    // Default options
    const defaultOptions = {
      cellAlign: 'left',
      contain: true,
      pageDots: false,
      prevNextButtons: true,
      accessibility: true,
      setGallerySize: false,
      ...options
    }
    
    // Handle modifiers
    if (modifiers.includes('fade')) {
      defaultOptions.fade = true
    }
    if (modifiers.includes('autoplay')) {
      defaultOptions.autoPlay = 3000
    }
    if (modifiers.includes('dots')) {
      defaultOptions.pageDots = true
    }
    if (modifiers.includes('no-arrows')) {
      defaultOptions.prevNextButtons = false
    }
    
    // Initialize Flickity
    const initFlickity = () => {
      if (flickityInstance) {
        flickityInstance.destroy()
      }
      
      flickityInstance = new Flickity(el, defaultOptions)
      
      // Store instance on element for external access
      el._flickity = flickityInstance
      
      // Dispatch events
      flickityInstance.on('ready', () => {
        el.dispatchEvent(new CustomEvent('flickity:ready', {
          detail: { flickity: flickityInstance }
        }))
      })
      
      flickityInstance.on('change', (index) => {
        el.dispatchEvent(new CustomEvent('flickity:change', {
          detail: { index, flickity: flickityInstance }
        }))
      })
      
      flickityInstance.on('select', (index) => {
        el.dispatchEvent(new CustomEvent('flickity:select', {
          detail: { index, flickity: flickityInstance }
        }))
      })
    }
    
    // Initialize when element is ready
    if (el.children.length > 0) {
      initFlickity()
    } else {
      // Wait for content to be added
      const observer = new MutationObserver(() => {
        if (el.children.length > 0) {
          initFlickity()
          observer.disconnect()
        }
      })
      observer.observe(el, { childList: true })
    }
    
    // Cleanup
    cleanup(() => {
      if (flickityInstance) {
        flickityInstance.destroy()
        flickityInstance = null
      }
    })
  })
  
  // Magic property for accessing Flickity instance
  Alpine.magic('flickity', (el) => {
    return el._flickity || null
  })
}
