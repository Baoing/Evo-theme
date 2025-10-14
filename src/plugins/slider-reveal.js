/**
 * Evo Theme - Slider Reveal Plugin
 * Progressive content reveal with slider interaction
 * 
 * @description Smooth content reveal animations with slider controls
 * @version 1.0.0
 */

export default function sliderRevealPlugin(Alpine) {
  Alpine.directive('slider-reveal', (el, { expression, modifiers }, { evaluateLater, cleanup }) => {
    let config = { duration: 300, easing: 'ease-in-out' }
    let isRevealed = false
    let slider = null
    let content = null
    
    if (expression) {
      const getConfig = evaluateLater(expression)
      getConfig((value) => {
        config = { ...config, ...value }
      })
    }
    
    const init = () => {
      slider = el.querySelector('[data-slider]')
      content = el.querySelector('[data-reveal-content]')
      
      if (!slider || !content) {
        console.warn('Slider reveal: missing slider or content elements')
        return
      }
      
      // Set initial state
      content.style.height = '0px'
      content.style.overflow = 'hidden'
      content.style.transition = `height ${config.duration}ms ${config.easing}`
      
      // Handle slider interaction
      slider.addEventListener('input', handleSliderChange)
      slider.addEventListener('change', handleSliderChange)
    }
    
    const handleSliderChange = (event) => {
      const value = parseFloat(event.target.value)
      const max = parseFloat(event.target.max) || 100
      const percentage = value / max
      
      revealContent(percentage)
    }
    
    const revealContent = (percentage) => {
      if (!content) return
      
      const maxHeight = content.scrollHeight
      const targetHeight = maxHeight * Math.max(0, Math.min(1, percentage))
      
      content.style.height = `${targetHeight}px`
      
      // Update revealed state
      const wasRevealed = isRevealed
      isRevealed = percentage > 0.5
      
      if (isRevealed !== wasRevealed) {
        el.classList.toggle('is-revealed', isRevealed)
        el.dispatchEvent(new CustomEvent(isRevealed ? 'reveal:shown' : 'reveal:hidden', {
          detail: { percentage, height: targetHeight }
        }))
      }
      
      // Dispatch progress event
      el.dispatchEvent(new CustomEvent('reveal:progress', {
        detail: { percentage, height: targetHeight }
      }))
    }
    
    // Public methods
    el._sliderReveal = {
      reveal: (percentage = 1) => revealContent(percentage),
      hide: () => revealContent(0),
      toggle: () => revealContent(isRevealed ? 0 : 1),
      get isRevealed() { return isRevealed }
    }
    
    init()
    
    // Cleanup
    cleanup(() => {
      if (slider) {
        slider.removeEventListener('input', handleSliderChange)
        slider.removeEventListener('change', handleSliderChange)
      }
    })
  })
  
  Alpine.magic('sliderReveal', (el) => {
    return el._sliderReveal || null
  })
}


