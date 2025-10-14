/**
 * Evo Theme - Floating Labels System
 * Smooth animated labels for enhanced form experience
 * 
 * @description Modern floating label implementation with accessibility support
 * @version 1.0.0
 */

export function floatLabels(container) {
  const floats = container.querySelectorAll('.float__wrapper')
  
  floats.forEach((element) => {
    const label = element.querySelector('label')
    const input = element.querySelector('input, textarea')
    
    if (!label || !input) return

    // Handle input events
    const handleInput = (event) => {
      if (event.target.value !== '') {
        label.classList.add('label--float')
      } else {
        label.classList.remove('label--float')
      }
    }

    // Add event listeners
    input.addEventListener('keyup', handleInput)
    input.addEventListener('change', handleInput)
    input.addEventListener('blur', handleInput)

    // Initialize state
    if (input.value && input.value.length) {
      label.classList.add('label--float')
    }
  })
}

// Auto-initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
  floatLabels(document)
})

export default floatLabels
