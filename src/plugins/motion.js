/**
 * Evo Theme - Motion Plugin
 * Advanced motion and scroll-based animations
 * 
 * @description Smooth motion effects with intersection observer
 * @version 1.0.0
 */

export default function motionPlugin(Alpine) {
  Alpine.directive('motion', (el, { expression, modifiers }, { evaluateLater, cleanup }) => {
    let observer = null
    let config = { threshold: 0.1, rootMargin: '0px' }
    
    if (expression) {
      const getConfig = evaluateLater(expression)
      getConfig((value) => {
        config = { ...config, ...value }
      })
    }
    
    // Create intersection observer
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          el.classList.add('in-view')
          el.dispatchEvent(new CustomEvent('motion:enter'))
        } else {
          el.classList.remove('in-view')
          el.dispatchEvent(new CustomEvent('motion:leave'))
        }
      })
    }, config)
    
    observer.observe(el)
    
    // Cleanup
    cleanup(() => {
      if (observer) {
        observer.disconnect()
      }
    })
  })
}


