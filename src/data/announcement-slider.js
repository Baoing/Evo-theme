/**
 * Announcement Slider Alpine.js Data Component
 */

export default function announcementSlider() {
  return {
    currentSlide: 0,
    totalSlides: 0,
    isPlaying: true,
    autoplayInterval: null,
    
    init() {
      this.totalSlides = this.$el.querySelectorAll('[data-slide]').length
      if (this.totalSlides > 1 && this.isPlaying) {
        this.startAutoplay()
      }
    },
    
    nextSlide() {
      this.currentSlide = (this.currentSlide + 1) % this.totalSlides
      this.$dispatch('slide:changed', { index: this.currentSlide })
    },
    
    prevSlide() {
      this.currentSlide = this.currentSlide > 0 ? this.currentSlide - 1 : this.totalSlides - 1
      this.$dispatch('slide:changed', { index: this.currentSlide })
    },
    
    goToSlide(index) {
      if (index >= 0 && index < this.totalSlides) {
        this.currentSlide = index
        this.$dispatch('slide:changed', { index: this.currentSlide })
      }
    },
    
    startAutoplay() {
      this.stopAutoplay()
      this.autoplayInterval = setInterval(() => {
        this.nextSlide()
      }, 5000)
    },
    
    stopAutoplay() {
      if (this.autoplayInterval) {
        clearInterval(this.autoplayInterval)
        this.autoplayInterval = null
      }
    },
    
    toggleAutoplay() {
      this.isPlaying = !this.isPlaying
      if (this.isPlaying) {
        this.startAutoplay()
      } else {
        this.stopAutoplay()
      }
    }
  }
}


