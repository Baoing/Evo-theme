/**
 * Evo Theme - Marquee Animation Plugin
 * Smooth scrolling text animations with performance optimization
 * 
 * @description Hardware-accelerated marquee with pause on hover
 * @version 1.0.0
 */

export default function marqueePlugin(Alpine) {
  Alpine.directive('marquee', (el, { expression, modifiers }, { evaluateLater, cleanup }) => {
    let animationId = null
    let isPaused = false
    let speed = 1
    
    // Parse configuration
    if (expression) {
      const getConfig = evaluateLater(expression)
      getConfig((config) => {
        if (typeof config === 'number') {
          speed = config
        } else if (config && typeof config === 'object') {
          speed = config.speed || 1
        }
      })
    }
    
    // Handle modifiers
    if (modifiers.includes('slow')) speed = 0.5
    if (modifiers.includes('fast')) speed = 2
    
    const startMarquee = () => {
      const content = el.querySelector('[data-marquee-content]') || el
      const containerWidth = el.offsetWidth
      const contentWidth = content.scrollWidth
      
      if (contentWidth <= containerWidth) return
      
      let position = containerWidth
      
      const animate = () => {
        if (!isPaused) {
          position -= speed
          
          if (position < -contentWidth) {
            position = containerWidth
          }
          
          content.style.transform = `translateX(${position}px)`
        }
        
        animationId = requestAnimationFrame(animate)
      }
      
      animate()
    }
    
    const pauseMarquee = () => {
      isPaused = true
    }
    
    const resumeMarquee = () => {
      isPaused = false
    }
    
    // Auto-pause on hover
    if (modifiers.includes('pause-on-hover')) {
      el.addEventListener('mouseenter', pauseMarquee)
      el.addEventListener('mouseleave', resumeMarquee)
    }
    
    // Initialize
    startMarquee()
    
    // Store methods on element
    el._marquee = {
      pause: pauseMarquee,
      resume: resumeMarquee,
      get isPaused() { return isPaused }
    }
    
    // Cleanup
    cleanup(() => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    })
  })
  
  // Magic property
  Alpine.magic('marquee', (el) => {
    return el._marquee || null
  })
}


