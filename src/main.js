/**
 * Evo Theme - Main Entry Point
 * Modern Shopify Theme Development Framework
 * 
 * @description High-performance theme built for modern e-commerce
 * @version 1.0.0
 * @author Evo Development Team
 */

import Alpine from 'alpinejs'

// Import vendor dependencies first
import '@/vendor'

// Import utilities
import '@utils/polyfills'
import '@utils/theme-globals'
import '@utils/resolution'

// Import Alpine.js data components
import announcement from '@data/announcement'
import announcementSlider from '@data/announcement-slider'
import announcementTicker from '@data/announcement-ticker'
import productAddButtonForm from '@data/product-add-button-form'
import productQuickViewButton from '@data/product-quick-view-button'
import productGridItemQuickAddMenu from '@data/product-grid-item-quick-add-menu'
import toggle from '@data/toggle'
import tabs from '@data/tabs'
import overflow from '@data/overflow'

// Import Alpine.js directives
import targetReferrer from '@directives/target-referrer'

// Import Alpine.js plugins
import flickity from '@plugins/flickity'
import section from '@plugins/section'
import ensemble from '@plugins/ensemble'
import hold from '@plugins/hold'
import marquee from '@plugins/marquee'
import themeEditor from '@plugins/theme-editor'
import disclosure from '@plugins/disclosure'
import animationUtils from '@plugins/animation-utils'
import motion from '@plugins/motion'
import listState from '@plugins/list-state'
import slideshow from '@plugins/slideshow'
import sliderReveal from '@plugins/slider-reveal'
import clone from '@plugins/clone'

// Import components
import '@components/modals'
import '@components/float-labels'
import '@components/error-tab-index'
import '@components/custom-scrollbar'

// Register Alpine.js data components
Alpine.data('announcement', announcement)
Alpine.data('announcementSlider', announcementSlider)
Alpine.data('announcementTicker', announcementTicker)
Alpine.data('productAddButtonForm', productAddButtonForm)
Alpine.data('productQuickViewButton', productQuickViewButton)
Alpine.data('productGridItemQuickAddMenu', productGridItemQuickAddMenu)
Alpine.data('toggle', toggle)
Alpine.data('tabs', tabs)
Alpine.data('overflow', overflow)

// Register Alpine.js directives
Alpine.directive('target-referrer', targetReferrer)

// Register Alpine.js plugins
Alpine.plugin(flickity)
Alpine.plugin(section)
Alpine.plugin(ensemble)
Alpine.plugin(hold)
Alpine.plugin(marquee)
Alpine.plugin(themeEditor)
Alpine.plugin(disclosure)
Alpine.plugin(animationUtils)
Alpine.plugin(motion)
Alpine.plugin(listState)
Alpine.plugin(slideshow)
Alpine.plugin(sliderReveal)
Alpine.plugin(clone)

// Initialize Alpine.js
Alpine.start()

// Export Alpine for devtools
window.Alpine = Alpine
