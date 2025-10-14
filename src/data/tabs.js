/**
 * Evo Theme - Advanced Tabs System
 * Accessible tabbed interface with keyboard navigation
 * 
 * @description Full-featured tabs component with ARIA compliance
 * @version 1.0.0
 */

export default function tabs() {
  return {
    // Component state
    activeTab: 0,
    tabs: [],
    panels: [],
    
    // Initialize component
    init() {
      // Find all tab buttons and panels
      this.tabs = Array.from(this.$el.querySelectorAll('[data-tab]'))
      this.panels = Array.from(this.$el.querySelectorAll('[data-tab-panel]'))
      
      // Set initial active tab from data attribute or default to first
      const initialTab = parseInt(this.$el.dataset.activeTab) || 0
      this.setActiveTab(initialTab)
      
      // Add click handlers to tabs
      this.tabs.forEach((tab, index) => {
        tab.addEventListener('click', (e) => {
          e.preventDefault()
          this.setActiveTab(index)
        })
        
        // Add keyboard navigation
        tab.addEventListener('keydown', (e) => {
          this.handleKeydown(e, index)
        })
      })
    },
    
    // Set active tab
    setActiveTab(index) {
      if (index < 0 || index >= this.tabs.length) return
      
      const previousTab = this.activeTab
      this.activeTab = index
      
      // Update tab states
      this.tabs.forEach((tab, i) => {
        const isActive = i === index
        tab.setAttribute('aria-selected', isActive)
        tab.setAttribute('tabindex', isActive ? '0' : '-1')
        tab.classList.toggle('active', isActive)
      })
      
      // Update panel states
      this.panels.forEach((panel, i) => {
        const isActive = i === index
        panel.setAttribute('aria-hidden', !isActive)
        panel.classList.toggle('active', isActive)
      })
      
      // Focus active tab
      if (document.activeElement !== this.tabs[index]) {
        this.tabs[index].focus()
      }
      
      // Dispatch events
      this.$dispatch('tabs:changed', {
        activeTab: index,
        previousTab: previousTab,
        tab: this.tabs[index],
        panel: this.panels[index]
      })
    },
    
    // Handle keyboard navigation
    handleKeydown(event, currentIndex) {
      let newIndex = currentIndex
      
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault()
          newIndex = currentIndex > 0 ? currentIndex - 1 : this.tabs.length - 1
          break
        case 'ArrowRight':
          event.preventDefault()
          newIndex = currentIndex < this.tabs.length - 1 ? currentIndex + 1 : 0
          break
        case 'Home':
          event.preventDefault()
          newIndex = 0
          break
        case 'End':
          event.preventDefault()
          newIndex = this.tabs.length - 1
          break
        default:
          return
      }
      
      this.setActiveTab(newIndex)
    },
    
    // Go to next tab
    nextTab() {
      const nextIndex = this.activeTab < this.tabs.length - 1 ? this.activeTab + 1 : 0
      this.setActiveTab(nextIndex)
    },
    
    // Go to previous tab
    prevTab() {
      const prevIndex = this.activeTab > 0 ? this.activeTab - 1 : this.tabs.length - 1
      this.setActiveTab(prevIndex)
    },
    
    // Computed properties
    get currentTab() {
      return this.tabs[this.activeTab]
    },
    
    get currentPanel() {
      return this.panels[this.activeTab]
    }
  }
}
