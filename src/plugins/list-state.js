/**
 * Evo Theme - List State Plugin
 * State management for dynamic lists and collections
 * 
 * @description Advanced list state management with filtering and sorting
 * @version 1.0.0
 */

export default function listStatePlugin(Alpine) {
  Alpine.directive('list-state', (el, { expression }, { evaluateLater, effect }) => {
    let config = {}
    
    if (expression) {
      const getConfig = evaluateLater(expression)
      effect(() => {
        getConfig((value) => {
          config = value || {}
        })
      })
    }
    
    // Initialize list state
    const listState = {
      items: [],
      filteredItems: [],
      selectedItems: [],
      sortBy: null,
      sortOrder: 'asc',
      filters: {},
      
      // Filter items
      filter(filterFn) {
        this.filteredItems = this.items.filter(filterFn)
        this.updateDisplay()
      },
      
      // Sort items
      sort(key, order = 'asc') {
        this.sortBy = key
        this.sortOrder = order
        
        this.filteredItems.sort((a, b) => {
          const aVal = a[key]
          const bVal = b[key]
          
          if (order === 'asc') {
            return aVal > bVal ? 1 : -1
          } else {
            return aVal < bVal ? 1 : -1
          }
        })
        
        this.updateDisplay()
      },
      
      // Select item
      select(item) {
        if (!this.selectedItems.includes(item)) {
          this.selectedItems.push(item)
        }
      },
      
      // Deselect item
      deselect(item) {
        const index = this.selectedItems.indexOf(item)
        if (index > -1) {
          this.selectedItems.splice(index, 1)
        }
      },
      
      // Toggle selection
      toggle(item) {
        if (this.selectedItems.includes(item)) {
          this.deselect(item)
        } else {
          this.select(item)
        }
      },
      
      // Update display
      updateDisplay() {
        el.dispatchEvent(new CustomEvent('list:updated', {
          detail: {
            items: this.filteredItems,
            selected: this.selectedItems,
            total: this.items.length,
            filtered: this.filteredItems.length
          }
        }))
      }
    }
    
    // Store on element
    el._listState = listState
    
    // Initialize with data
    if (config.items) {
      listState.items = config.items
      listState.filteredItems = [...config.items]
      listState.updateDisplay()
    }
  })
  
  Alpine.magic('listState', (el) => {
    return el._listState || null
  })
}


