/**
 * Evo Theme - Theme Editor Integration Plugin
 * Shopify theme editor event handling and live preview
 * 
 * @description Seamless integration with Shopify's theme editor
 * @version 1.0.0
 */

export default function themeEditorPlugin(Alpine) {
  // Theme editor event handlers
  Alpine.directive('theme-editor', (el, { expression }, { evaluateLater, cleanup }) => {
    let config = {}
    
    if (expression) {
      const getConfig = evaluateLater(expression)
      getConfig((value) => {
        config = value || {}
      })
    }
    
    // Handle theme editor events
    const handleSectionSelect = (event) => {
      if (config.onSelect) {
        config.onSelect(event.detail)
      }
      el.classList.add('theme-editor-selected')
    }
    
    const handleSectionDeselect = (event) => {
      if (config.onDeselect) {
        config.onDeselect(event.detail)
      }
      el.classList.remove('theme-editor-selected')
    }
    
    const handleSectionLoad = (event) => {
      if (config.onLoad) {
        config.onLoad(event.detail)
      }
    }
    
    const handleSectionUnload = (event) => {
      if (config.onUnload) {
        config.onUnload(event.detail)
      }
    }
    
    // Listen for Shopify theme editor events
    document.addEventListener('shopify:section:select', handleSectionSelect)
    document.addEventListener('shopify:section:deselect', handleSectionDeselect)
    document.addEventListener('shopify:section:load', handleSectionLoad)
    document.addEventListener('shopify:section:unload', handleSectionUnload)
    
    // Cleanup
    cleanup(() => {
      document.removeEventListener('shopify:section:select', handleSectionSelect)
      document.removeEventListener('shopify:section:deselect', handleSectionDeselect)
      document.removeEventListener('shopify:section:load', handleSectionLoad)
      document.removeEventListener('shopify:section:unload', handleSectionUnload)
    })
  })
}


