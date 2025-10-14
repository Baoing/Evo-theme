/**
 * Evo Theme - Vite Build Configuration
 * Modern build system optimized for Shopify themes
 * 
 * @description High-performance build configuration with hot reload
 * @version 1.0.0
 */

import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development'
  
  return {
    root: 'src',
    build: {
      outDir: '../assets',
      emptyOutDir: false,
      rollupOptions: {
        input: resolve(__dirname, 'src/main.js'),
        output: {
          entryFileNames: 'theme.js',
          chunkFileNames: '[name].js',
          assetFileNames: '[name].[ext]',
          format: 'iife',
          inlineDynamicImports: true,
          globals: {
            'alpinejs': 'Alpine'
          }
        },
        external: isDev ? [] : []
      },
      minify: isDev ? false : 'terser',
      sourcemap: isDev,
      target: ['es2015', 'chrome58', 'firefox57', 'safari11'],
      cssCodeSplit: false
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@components': resolve(__dirname, 'src/components'),
        '@plugins': resolve(__dirname, 'src/plugins'),
        '@data': resolve(__dirname, 'src/data'),
        '@directives': resolve(__dirname, 'src/directives'),
        '@utils': resolve(__dirname, 'src/utils'),
        '@styles': resolve(__dirname, 'src/styles')
      }
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode)
    },
    server: {
      watch: {
        include: ['src/**/*']
      }
    }
  }
})
