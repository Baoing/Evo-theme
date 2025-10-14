/**
 * Evo Theme - Shopify Section Manager
 * Advanced section handling for theme editor integration
 * 
 * @description Seamless Shopify theme editor integration with event handling
 * @version 1.0.0
 */

export default function sectionPlugin(Alpine) {
  Alpine.directive('section', (el, { expression }, { evaluateLater, effect, cleanup }) => {
    let sectionId = null
    let sectionType = null
    
    // Get section configuration
    if (expression) {
      const getSectionConfig = evaluateLater(expression)
      effect(() => {
        getSectionConfig((config) => {
          if (typeof config === 'string') {
            sectionId = config
          } else if (config && typeof config === 'object') {
            sectionId = config.id
            sectionType = config.type
          }
        })
      })
    }
    
    // Auto-detect section ID from data attributes
    if (!sectionId) {
      sectionId = el.dataset.sectionId || el.id
    }
    
    // Auto-detect section type
    if (!sectionType) {
      sectionType = el.dataset.sectionType || 'generic'
    }
    
    // Handle Shopify theme editor events
    const handleSectionSelect = (event) => {
      if (event.detail.sectionId === sectionId) {
        el.dispatchEvent(new CustomEvent('section:selected', {
          detail: { sectionId, sectionType }
        }))
      }
    }
    
    const handleSectionDeselect = (event) => {
      if (event.detail.sectionId === sectionId) {
        el.dispatchEvent(new CustomEvent('section:deselected', {
          detail: { sectionId, sectionType }
        }))
      }
    }
    
    const handleSectionLoad = (event) => {
      if (event.detail.sectionId === sectionId) {
        el.dispatchEvent(new CustomEvent('section:loaded', {
          detail: { sectionId, sectionType }
        }))
      }
    }
    
    const handleSectionUnload = (event) => {
      if (event.detail.sectionId === sectionId) {
        el.dispatchEvent(new CustomEvent('section:unloaded', {
          detail: { sectionId, sectionType }
        }))
      }
    }
    
    // Listen for Shopify theme editor events
    document.addEventListener('shopify:section:select', handleSectionSelect)
    document.addEventListener('shopify:section:deselect', handleSectionDeselect)
    document.addEventListener('shopify:section:load', handleSectionLoad)
    document.addEventListener('shopify:section:unload', handleSectionUnload)
    
    // Add section metadata to element
    el._section = {
      id: sectionId,
      type: sectionType,
      element: el
    }
    
    // Cleanup
    cleanup(() => {
      document.removeEventListener('shopify:section:select', handleSectionSelect)
      document.removeEventListener('shopify:section:deselect', handleSectionDeselect)
      document.removeEventListener('shopify:section:load', handleSectionLoad)
      document.removeEventListener('shopify:section:unload', handleSectionUnload)
    })
  })
  
  // Magic property for accessing section data
  Alpine.magic('section', (el) => {
    return el._section || null
  })
}
