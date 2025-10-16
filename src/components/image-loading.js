/**
 * Image Loading Handler
 * 处理图片加载状态和shimmer效果
 */

// Remove loading class from all already loaded images
function removeLoadingClassFromLoadedImages(container) {
    container.querySelectorAll('img').forEach((el) => {
        if (el.complete) {
            el.parentNode.classList.remove('loading-shimmer');
        }
    });
}

// Remove loading class from image on `load` event
function handleImageLoaded(el) {
    if (el.tagName === 'IMG' && el.parentNode.classList.contains('loading-shimmer')) {
        el.parentNode.classList.remove('loading-shimmer');
    }
}

// Initialize image loading handlers
function initImageLoading(container = document) {
    // Remove loading class from already loaded images
    removeLoadingClassFromLoadedImages(container);
    
    // Add load event listeners to all images
    container.querySelectorAll('img').forEach((img) => {
        if (!img.complete) {
            img.addEventListener('load', () => handleImageLoaded(img), { once: true });
            img.addEventListener('error', () => handleImageLoaded(img), { once: true });
        }
    });
}

// Export functions for use in other modules
export {
    removeLoadingClassFromLoadedImages,
    handleImageLoaded,
    initImageLoading
};

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initImageLoading());
} else {
    initImageLoading();
}
