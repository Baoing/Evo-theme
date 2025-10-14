/**
 * Product Add Button Form Alpine.js Data Component
 */

export default function productAddButtonForm() {
  return {
    isLoading: false,
    isAdded: false,
    quantity: 1,
    variantId: null,
    
    init() {
      this.variantId = this.$el.dataset.variantId
    },
    
    async addToCart() {
      if (this.isLoading) return
      
      this.isLoading = true
      
      try {
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: this.variantId,
            quantity: this.quantity
          })
        })
        
        if (response.ok) {
          this.isAdded = true
          this.$dispatch('cart:added', { variantId: this.variantId, quantity: this.quantity })
          
          setTimeout(() => {
            this.isAdded = false
          }, 2000)
        } else {
          throw new Error('Failed to add to cart')
        }
      } catch (error) {
        console.error('Add to cart error:', error)
        this.$dispatch('cart:error', { error })
      } finally {
        this.isLoading = false
      }
    },
    
    incrementQuantity() {
      this.quantity++
    },
    
    decrementQuantity() {
      if (this.quantity > 1) {
        this.quantity--
      }
    }
  }
}


