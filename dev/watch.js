#!/usr/bin/env node

/**
 * Evo Theme - Development Watch Script
 * Advanced file watching with hot reload capabilities
 * 
 * @description Intelligent development server with real-time compilation
 * @version 1.0.0
 */

import { spawn } from 'child_process'
import { watch } from 'fs'
import { resolve } from 'path'

const srcDir = resolve(process.cwd(), 'src')
const assetsDir = resolve(process.cwd(), 'assets')

console.log('🚀 Starting Evo Theme development server...')
console.log(`📂 Watching: ${srcDir}`)
console.log(`📦 Output: ${assetsDir}`)

// Start Vite in watch mode
const viteProcess = spawn('npx', ['vite', 'build', '--watch', '--mode', 'development'], {
  stdio: 'inherit',
  shell: true
})

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping development server...')
  viteProcess.kill('SIGINT')
  process.exit(0)
})

process.on('SIGTERM', () => {
  viteProcess.kill('SIGTERM')
  process.exit(0)
})

viteProcess.on('error', (error) => {
  console.error('❌ Error starting Vite:', error)
  process.exit(1)
})

console.log('✅ Development server started!')
console.log('💡 Press Ctrl+C to stop')
