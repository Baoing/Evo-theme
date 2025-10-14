/**
 * Evo Theme - Product Quick View Component
 * Advanced product preview with modal integration
 * 
 * @description Fast product preview without page reload
 * @version 1.0.0
 */

export default function productQuickViewButton() {
  return {
    isLoading: false,
    isOpen: false,
    productData: null,
    
    init() {
      this.productHandle = this.$el.dataset.productHandle
    },
    
    async openQuickView() {
      if (this.isLoading) return
      
      this.isLoading = true
      
      try {
        const response = await fetch(`/products/${this.productHandle}.js`)
        this.productData = await response.json()
        
        this.isOpen = true
        this.$dispatch('quickview:opened', { product: this.productData })
      } catch (error) {
        console.error('Quick view error:', error)
        this.$dispatch('quickview:error', { error })
      } finally {
        this.isLoading = false
      }
    },
    
    closeQuickView() {
      this.isOpen = false
      this.$dispatch('quickview:closed')
    }
  }
}


