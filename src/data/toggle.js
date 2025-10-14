/**
 * Evo Theme - Universal Toggle Component
 * Flexible toggle system with animation and state management
 * 
 * @description Reusable toggle component with smooth animations
 * @version 1.0.0
 */

export default function toggle() {
  return {
    // Component state
    isOpen: false,
    isAnimating: false,
    
    // Initialize component
    init() {
      // Set initial state from data attribute
      const initialState = this.$el.dataset.toggleOpen
      if (initialState === 'true') {
        this.isOpen = true
      }
      
      // Listen for external toggle events
      this.$el.addEventListener('toggle:open', () => this.open())
      this.$el.addEventListener('toggle:close', () => this.close())
      this.$el.addEventListener('toggle:toggle', () => this.toggle())
    },
    
    // Open toggle
    open() {
      if (this.isOpen || this.isAnimating) return
      
      this.isAnimating = true
      this.isOpen = true
      
      // Dispatch events
      this.$dispatch('toggle:opening')
      
      // Handle animation end
      this.$nextTick(() => {
        setTimeout(() => {
          this.isAnimating = false
          this.$dispatch('toggle:opened')
        }, 300) // Adjust timing based on CSS transition
      })
    },
    
    // Close toggle
    close() {
      if (!this.isOpen || this.isAnimating) return
      
      this.isAnimating = true
      this.isOpen = false
      
      // Dispatch events
      this.$dispatch('toggle:closing')
      
      // Handle animation end
      this.$nextTick(() => {
        setTimeout(() => {
          this.isAnimating = false
          this.$dispatch('toggle:closed')
        }, 300) // Adjust timing based on CSS transition
      })
    },
    
    // Toggle state
    toggle() {
      if (this.isOpen) {
        this.close()
      } else {
        this.open()
      }
    },
    
    // Computed properties
    get toggleClass() {
      return {
        'is-open': this.isOpen,
        'is-animating': this.isAnimating,
        'is-closed': !this.isOpen
      }
    }
  }
}
