/**
 * Evo Theme - Browser Polyfills
 * Cross-browser compatibility layer
 * 
 * @description Ensures consistent behavior across all modern browsers
 * @version 1.0.0
 */

// RequestIdleCallback polyfill
// From https://developer.chrome.com/blog/using-requestidlecallback/#checking-for-requestidlecallback
window.requestIdleCallback = window.requestIdleCallback || function(cb) {
  const start = Date.now()
  return setTimeout(function() {
    cb({
      didTimeout: false,
      timeRemaining: function() {
        return Math.max(0, 50 - (Date.now() - start))
      }
    })
  }, 1)
}

window.cancelIdleCallback = window.cancelIdleCallback || function(id) {
  clearTimeout(id)
}

// Process environment polyfill for browser
;(function() {
  const env = {"NODE_ENV": process.env.NODE_ENV || "production"}
  try {
    if (process) {
      process.env = Object.assign({}, process.env)
      Object.assign(process.env, env)
      return
    }
  } catch (e) {} // avoid ReferenceError: process is not defined
  globalThis.process = { env: env }
})()
