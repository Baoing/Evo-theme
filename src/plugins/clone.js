/**
 * Clone Alpine.js Plugin
 * Provides cloning functionality for elements
 */

export default function clonePlugin(Alpine) {
  Alpine.directive('clone', (el, { expression, modifiers }, { evaluateLater, cleanup }) => {
    let cloneTarget = null
    let cloneContainer = null
    
    // Parse configuration
    if (expression) {
      const getConfig = evaluateLater(expression)
      getConfig((config) => {
        if (typeof config === 'string') {
          cloneTarget = document.querySelector(config)
        } else if (config && typeof config === 'object') {
          cloneTarget = config.target ? document.querySelector(config.target) : null
          cloneContainer = config.container ? document.querySelector(config.container) : el
        }
      })
    }
    
    // Default to cloning the element itself
    if (!cloneTarget) {
      cloneTarget = el
    }
    
    if (!cloneContainer) {
      cloneContainer = el.parentElement
    }
    
    const cloneElement = () => {
      if (!cloneTarget || !cloneContainer) return null
      
      const clone = cloneTarget.cloneNode(true)
      
      // Remove ID to avoid duplicates
      if (clone.id) {
        clone.removeAttribute('id')
      }
      
      // Add clone class
      clone.classList.add('is-clone')
      
      // Handle modifiers
      if (modifiers.includes('append')) {
        cloneContainer.appendChild(clone)
      } else if (modifiers.includes('prepend')) {
        cloneContainer.insertBefore(clone, cloneContainer.firstChild)
      } else {
        cloneContainer.appendChild(clone)
      }
      
      // Dispatch event
      el.dispatchEvent(new CustomEvent('clone:created', {
        detail: { clone, target: cloneTarget, container: cloneContainer }
      }))
      
      return clone
    }
    
    // Auto-clone if specified
    if (modifiers.includes('auto')) {
      cloneElement()
    }
    
    // Add clone method to element
    el._clone = {
      create: cloneElement,
      target: cloneTarget,
      container: cloneContainer
    }
  })
  
  // Magic property for accessing clone functionality
  Alpine.magic('clone', (el) => {
    return el._clone || null
  })
}


