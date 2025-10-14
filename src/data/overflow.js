/**
 * Overflow Alpine.js Data Component
 * Handles content overflow detection and management
 */

export default function overflow() {
  return {
    hasOverflow: false,
    isExpanded: false,
    maxHeight: null,
    
    init() {
      this.maxHeight = this.$el.dataset.maxHeight ? parseInt(this.$el.dataset.maxHeight) : 200
      this.checkOverflow()
      
      // Re-check on window resize
      window.addEventListener('resize', () => this.checkOverflow())
    },
    
    checkOverflow() {
      const contentHeight = this.$el.scrollHeight
      this.hasOverflow = contentHeight > this.maxHeight
      
      if (this.hasOverflow && !this.isExpanded) {
        this.$el.style.maxHeight = `${this.maxHeight}px`
        this.$el.style.overflow = 'hidden'
      }
    },
    
    expand() {
      this.isExpanded = true
      this.$el.style.maxHeight = 'none'
      this.$el.style.overflow = 'visible'
      this.$dispatch('overflow:expanded')
    },
    
    collapse() {
      this.isExpanded = false
      this.$el.style.maxHeight = `${this.maxHeight}px`
      this.$el.style.overflow = 'hidden'
      this.$dispatch('overflow:collapsed')
    },
    
    toggle() {
      if (this.isExpanded) {
        this.collapse()
      } else {
        this.expand()
      }
    }
  }
}


