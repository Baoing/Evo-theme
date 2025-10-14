/**
 * Evo Theme - Product Grid Quick Add Menu Component
 * Quick add functionality for product grid items
 * 
 * @description Fast add to cart from product grid with variant selection
 * @version 1.0.0
 */

export default function productGridItemQuickAddMenu() {
  return {
    isOpen: false,
    isLoading: false,
    selectedVariant: null,
    variants: [],
    
    init() {
      this.productId = this.$el.dataset.productId
      this.loadVariants()
    },
    
    async loadVariants() {
      try {
        const response = await fetch(`/products/${this.productId}.js`)
        const product = await response.json()
        this.variants = product.variants
        this.selectedVariant = this.variants[0]
      } catch (error) {
        console.error('Failed to load variants:', error)
      }
    },
    
    openMenu() {
      this.isOpen = true
      this.$dispatch('quickadd:opened')
    },
    
    closeMenu() {
      this.isOpen = false
      this.$dispatch('quickadd:closed')
    },
    
    selectVariant(variant) {
      this.selectedVariant = variant
    },
    
    async addToCart() {
      if (!this.selectedVariant || this.isLoading) return
      
      this.isLoading = true
      
      try {
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: this.selectedVariant.id,
            quantity: 1
          })
        })
        
        if (response.ok) {
          this.$dispatch('cart:added', { variant: this.selectedVariant })
          this.closeMenu()
        }
      } catch (error) {
        console.error('Add to cart error:', error)
        this.$dispatch('cart:error', { error })
      } finally {
        this.isLoading = false
      }
    }
  }
}


