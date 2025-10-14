/**
 * Evo Theme - Modal Management System
 * Advanced modal handling with centralized container management
 * 
 * @description Optimized modal system for better performance and UX
 * @version 1.0.0
 */

export function moveModals(container) {
  const modals = container.querySelectorAll('[data-modal]')
  const modalBin = document.querySelector('[data-modal-container]')
  
  if (!modalBin) {
    console.warn('Modal container not found. Please add [data-modal-container] to your layout.')
    return
  }

  modals.forEach((element) => {
    const alreadyAdded = modalBin.querySelector(`[id="${element.id}"]`)
    if (!alreadyAdded) {
      modalBin.appendChild(element)
    }
  })
}

// Auto-initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
  moveModals(document)
})

export default moveModals
