/**
 * Evo Theme - Announcement Component
 * Smart announcement bar with persistence and user interaction
 * 
 * @description Advanced announcement system with local storage integration
 * @version 1.0.0
 */

export default function announcement() {
  return {
    // Component state
    isVisible: true,
    isDismissed: false,
    
    // Initialize component
    init() {
      // Check if announcement was previously dismissed
      const dismissed = localStorage.getItem('announcement-dismissed')
      if (dismissed) {
        this.isDismissed = true
        this.isVisible = false
      }
    },
    
    // Dismiss announcement
    dismiss() {
      this.isVisible = false
      this.isDismissed = true
      localStorage.setItem('announcement-dismissed', 'true')
      
      // Dispatch custom event
      this.$dispatch('announcement:dismissed')
    },
    
    // Show announcement
    show() {
      this.isVisible = true
      this.isDismissed = false
      localStorage.removeItem('announcement-dismissed')
      
      // Dispatch custom event
      this.$dispatch('announcement:shown')
    },
    
    // Toggle announcement
    toggle() {
      if (this.isVisible) {
        this.dismiss()
      } else {
        this.show()
      }
    }
  }
}
