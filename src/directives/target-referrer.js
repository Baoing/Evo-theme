/**
 * Target Referrer Alpine.js Directive
 * Handles referrer-based targeting for elements
 */

export default function targetReferrer(Alpine) {
  Alpine.directive('target-referrer', (el, { expression }, { evaluateLater, effect }) => {
    if (!expression) return
    
    const getReferrerConfig = evaluateLater(expression)
    
    effect(() => {
      getReferrerConfig((config) => {
        if (!config || typeof config !== 'object') return
        
        const referrer = document.referrer
        const currentHost = window.location.hostname
        
        // Check if referrer matches any of the configured patterns
        let shouldShow = false
        
        if (config.external && referrer && !referrer.includes(currentHost)) {
          shouldShow = true
        }
        
        if (config.internal && referrer && referrer.includes(currentHost)) {
          shouldShow = true
        }
        
        if (config.direct && !referrer) {
          shouldShow = true
        }
        
        if (config.domains && Array.isArray(config.domains)) {
          shouldShow = config.domains.some(domain => referrer.includes(domain))
        }
        
        if (config.patterns && Array.isArray(config.patterns)) {
          shouldShow = config.patterns.some(pattern => {
            const regex = new RegExp(pattern, 'i')
            return regex.test(referrer)
          })
        }
        
        // Apply visibility
        if (config.hide) {
          el.style.display = shouldShow ? 'none' : ''
        } else {
          el.style.display = shouldShow ? '' : 'none'
        }
        
        // Add class for styling
        el.classList.toggle('referrer-match', shouldShow)
        
        // Dispatch event
        el.dispatchEvent(new CustomEvent('referrer:evaluated', {
          detail: { shouldShow, referrer, config }
        }))
      })
    })
  })
}


