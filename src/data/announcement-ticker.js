/**
 * Announcement Ticker Alpine.js Data Component
 */

export default function announcementTicker() {
  return {
    isPaused: false,
    speed: 1,
    
    init() {
      // Initialize ticker animation
      this.setupTicker()
    },
    
    setupTicker() {
      const ticker = this.$el.querySelector('[data-ticker-content]')
      if (!ticker) return
      
      // Calculate animation duration based on content width
      const contentWidth = ticker.scrollWidth
      const containerWidth = this.$el.offsetWidth
      const duration = (contentWidth / 50) * this.speed // Adjust speed as needed
      
      ticker.style.animationDuration = `${duration}s`
    },
    
    pause() {
      this.isPaused = true
      const ticker = this.$el.querySelector('[data-ticker-content]')
      if (ticker) {
        ticker.style.animationPlayState = 'paused'
      }
    },
    
    resume() {
      this.isPaused = false
      const ticker = this.$el.querySelector('[data-ticker-content]')
      if (ticker) {
        ticker.style.animationPlayState = 'running'
      }
    },
    
    toggle() {
      if (this.isPaused) {
        this.resume()
      } else {
        this.pause()
      }
    },
    
    setSpeed(newSpeed) {
      this.speed = newSpeed
      this.setupTicker()
    }
  }
}


