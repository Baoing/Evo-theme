/**
 * Evo Theme - Ensemble Plugin
 * Coordinated component interactions and state sharing
 * 
 * @description Manages coordinated interactions between multiple components
 * @version 1.0.0
 */

export default function ensemblePlugin(Alpine) {
  Alpine.directive('ensemble', (el, { expression }, { evaluateLater, effect }) => {
    let ensembleId = null
    let config = {}
    
    if (expression) {
      const getConfig = evaluateLater(expression)
      effect(() => {
        getConfig((value) => {
          if (typeof value === 'string') {
            ensembleId = value
          } else if (value && typeof value === 'object') {
            ensembleId = value.id
            config = value
          }
        })
      })
    }
    
    if (!ensembleId) {
      ensembleId = el.dataset.ensembleId || 'default'
    }
    
    // Create or get ensemble registry
    if (!window._ensembles) {
      window._ensembles = {}
    }
    
    if (!window._ensembles[ensembleId]) {
      window._ensembles[ensembleId] = {
        members: new Set(),
        state: {},
        events: new EventTarget()
      }
    }
    
    const ensemble = window._ensembles[ensembleId]
    
    // Register this element as a member
    ensemble.members.add(el)
    
    // Ensemble methods
    const ensembleMethods = {
      // Broadcast to all members
      broadcast(eventName, data) {
        ensemble.events.dispatchEvent(new CustomEvent(eventName, {
          detail: { ...data, sender: el }
        }))
      },
      
      // Listen for ensemble events
      listen(eventName, callback) {
        ensemble.events.addEventListener(eventName, callback)
      },
      
      // Set shared state
      setState(key, value) {
        ensemble.state[key] = value
        this.broadcast('state:changed', { key, value })
      },
      
      // Get shared state
      getState(key) {
        return ensemble.state[key]
      },
      
      // Get all members
      getMembers() {
        return Array.from(ensemble.members)
      },
      
      // Get other members (excluding self)
      getPeers() {
        return Array.from(ensemble.members).filter(member => member !== el)
      }
    }
    
    // Store methods on element
    el._ensemble = ensembleMethods
    
    // Auto-sync with initial config
    if (config.initialState) {
      Object.entries(config.initialState).forEach(([key, value]) => {
        ensembleMethods.setState(key, value)
      })
    }
    
    // Cleanup on element removal
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.removedNodes.forEach((node) => {
          if (node === el) {
            ensemble.members.delete(el)
            observer.disconnect()
          }
        })
      })
    })
    
    if (el.parentNode) {
      observer.observe(el.parentNode, { childList: true, subtree: true })
    }
  })
  
  Alpine.magic('ensemble', (el) => {
    return el._ensemble || null
  })
}


