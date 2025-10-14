/**
 * Evo Theme - Disclosure Animation Plugin
 * Smooth collapsible content with advanced animations
 * 
 * @description Accessible disclosure widget with smooth height transitions
 * @version 1.0.0
 */

export default function disclosurePlugin(Alpine) {
  Alpine.directive('disclosure', (el, { expression, modifiers }, { evaluateLater, effect, cleanup }) => {
    let isOpen = false
    let isAnimating = false
    let content = null
    let trigger = null
    
    // Find trigger and content elements
    trigger = el.querySelector('[data-disclosure-trigger]') || el
    content = el.querySelector('[data-disclosure-content]')
    
    if (!content) {
      console.warn('Disclosure: content element not found')
      return
    }
    
    // Parse initial state from expression
    if (expression) {
      const getInitialState = evaluateLater(expression)
      effect(() => {
        getInitialState((value) => {
          if (typeof value === 'boolean') {
            setDisclosureState(value, false)
          }
        })
      })
    }
    
    // Set initial state
    const initialState = modifiers.includes('open') || 
                        el.dataset.disclosureOpen === 'true' ||
                        trigger.getAttribute('aria-expanded') === 'true'
    
    setDisclosureState(initialState, false)
    
    // Handle trigger click
    const handleTriggerClick = (e) => {
      e.preventDefault()
      toggle()
    }
    
    // Handle keyboard navigation
    const handleKeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        toggle()
      }
    }
    
    // Set disclosure state
    function setDisclosureState(open, animate = true) {
      if (isAnimating) return
      
      isOpen = open
      
      // Update ARIA attributes
      trigger.setAttribute('aria-expanded', isOpen)
      content.setAttribute('aria-hidden', !isOpen)
      
      // Update classes
      el.classList.toggle('is-open', isOpen)
      trigger.classList.toggle('is-expanded', isOpen)
      
      if (animate && !modifiers.includes('no-animate')) {
        animateDisclosure(isOpen)
      } else {
        content.style.display = isOpen ? '' : 'none'
        content.style.height = ''
        content.style.overflow = ''
      }
      
      // Dispatch events
      el.dispatchEvent(new CustomEvent(isOpen ? 'disclosure:opened' : 'disclosure:closed', {
        detail: { disclosure: el, isOpen }
      }))
    }
    
    // Animate disclosure
    function animateDisclosure(open) {
      isAnimating = true
      
      if (open) {
        content.style.display = ''
        content.style.height = '0px'
        content.style.overflow = 'hidden'
        
        requestAnimationFrame(() => {
          const height = content.scrollHeight
          content.style.height = height + 'px'
          
          const handleTransitionEnd = () => {
            content.removeEventListener('transitionend', handleTransitionEnd)
            content.style.height = ''
            content.style.overflow = ''
            isAnimating = false
          }
          
          content.addEventListener('transitionend', handleTransitionEnd)
        })
      } else {
        const height = content.scrollHeight
        content.style.height = height + 'px'
        content.style.overflow = 'hidden'
        
        requestAnimationFrame(() => {
          content.style.height = '0px'
          
          const handleTransitionEnd = () => {
            content.removeEventListener('transitionend', handleTransitionEnd)
            content.style.display = 'none'
            content.style.height = ''
            content.style.overflow = ''
            isAnimating = false
          }
          
          content.addEventListener('transitionend', handleTransitionEnd)
        })
      }
    }
    
    // Toggle disclosure
    function toggle() {
      setDisclosureState(!isOpen)
    }
    
    // Open disclosure
    function open() {
      setDisclosureState(true)
    }
    
    // Close disclosure
    function close() {
      setDisclosureState(false)
    }
    
    // Add event listeners
    trigger.addEventListener('click', handleTriggerClick)
    trigger.addEventListener('keydown', handleKeydown)
    
    // Add methods to element
    el._disclosure = {
      toggle,
      open,
      close,
      get isOpen() { return isOpen },
      get isAnimating() { return isAnimating }
    }
    
    // Cleanup
    cleanup(() => {
      trigger.removeEventListener('click', handleTriggerClick)
      trigger.removeEventListener('keydown', handleKeydown)
    })
  })
  
  // Magic property for accessing disclosure methods
  Alpine.magic('disclosure', (el) => {
    return el._disclosure || null
  })
}
