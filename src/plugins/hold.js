/**
 * Evo Theme - Hold Plugin
 * Long press and hold interaction handling
 * 
 * @description Advanced touch and mouse hold interactions
 * @version 1.0.0
 */

export default function holdPlugin(Alpine) {
  Alpine.directive('hold', (el, { expression, modifiers }, { evaluateLater, cleanup }) => {
    let holdTimer = null
    let holdDuration = 500 // Default hold duration
    let callback = null
    
    if (expression) {
      const getCallback = evaluateLater(expression)
      callback = () => getCallback()
    }
    
    // Parse modifiers for duration
    modifiers.forEach(modifier => {
      if (modifier.includes('ms')) {
        holdDuration = parseInt(modifier.replace('ms', ''))
      }
    })
    
    const startHold = (event) => {
      event.preventDefault()
      
      holdTimer = setTimeout(() => {
        if (callback) callback()
        el.dispatchEvent(new CustomEvent('hold:triggered', {
          detail: { duration: holdDuration, originalEvent: event }
        }))
      }, holdDuration)
      
      el.classList.add('holding')
    }
    
    const endHold = () => {
      if (holdTimer) {
        clearTimeout(holdTimer)
        holdTimer = null
      }
      el.classList.remove('holding')
    }
    
    // Add event listeners
    el.addEventListener('mousedown', startHold)
    el.addEventListener('touchstart', startHold, { passive: false })
    el.addEventListener('mouseup', endHold)
    el.addEventListener('mouseleave', endHold)
    el.addEventListener('touchend', endHold)
    el.addEventListener('touchcancel', endHold)
    
    // Cleanup
    cleanup(() => {
      endHold()
      el.removeEventListener('mousedown', startHold)
      el.removeEventListener('touchstart', startHold)
      el.removeEventListener('mouseup', endHold)
      el.removeEventListener('mouseleave', endHold)
      el.removeEventListener('touchend', endHold)
      el.removeEventListener('touchcancel', endHold)
    })
  })
}


