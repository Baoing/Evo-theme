/**
 * Evo Theme - Slideshow Plugin
 * Advanced slideshow with auto-play and navigation
 * 
 * @description Full-featured slideshow with touch support
 * @version 1.0.0
 */

export default function slideshowPlugin(Alpine) {
  Alpine.directive('slideshow', (el, { expression, modifiers }, { evaluateLater, cleanup }) => {
    let currentSlide = 0
    let slides = []
    let autoplayInterval = null
    let config = { autoplay: false, duration: 5000 }
    
    if (expression) {
      const getConfig = evaluateLater(expression)
      getConfig((value) => {
        config = { ...config, ...value }
      })
    }
    
    const init = () => {
      slides = Array.from(el.querySelectorAll('[data-slide]'))
      if (slides.length === 0) return
      
      showSlide(0)
      
      if (config.autoplay || modifiers.includes('autoplay')) {
        startAutoplay()
      }
    }
    
    const showSlide = (index) => {
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index)
        slide.setAttribute('aria-hidden', i !== index)
      })
      
      currentSlide = index
      el.dispatchEvent(new CustomEvent('slideshow:changed', {
        detail: { currentSlide, totalSlides: slides.length }
      }))
    }
    
    const nextSlide = () => {
      const next = (currentSlide + 1) % slides.length
      showSlide(next)
    }
    
    const prevSlide = () => {
      const prev = currentSlide > 0 ? currentSlide - 1 : slides.length - 1
      showSlide(prev)
    }
    
    const startAutoplay = () => {
      stopAutoplay()
      autoplayInterval = setInterval(nextSlide, config.duration)
    }
    
    const stopAutoplay = () => {
      if (autoplayInterval) {
        clearInterval(autoplayInterval)
        autoplayInterval = null
      }
    }
    
    // Add navigation methods to element
    el._slideshow = {
      next: nextSlide,
      prev: prevSlide,
      goTo: showSlide,
      startAutoplay,
      stopAutoplay,
      get currentSlide() { return currentSlide },
      get totalSlides() { return slides.length }
    }
    
    init()
    
    // Cleanup
    cleanup(() => {
      stopAutoplay()
    })
  })
  
  Alpine.magic('slideshow', (el) => {
    return el._slideshow || null
  })
}


