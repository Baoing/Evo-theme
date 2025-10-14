#!/usr/bin/env node

/**
 * Evo Theme - File Backup Utility
 * Smart backup system for theme file management
 * 
 * @description Automated backup system for safe development
 * @version 1.0.0
 */

import { copyFile, access } from 'fs/promises'
import { resolve } from 'path'

const assetsDir = resolve(process.cwd(), 'assets')
const filesToBackup = ['theme.js', 'vendor.js']

async function backupFiles() {
  console.log('📦 Creating backups of theme files for safe development...')
  
  for (const file of filesToBackup) {
    const originalPath = resolve(assetsDir, file)
    const backupPath = resolve(assetsDir, `${file}.original`)
    
    try {
      // Check if original file exists
      await access(originalPath)
      
      // Check if backup already exists
      try {
        await access(backupPath)
        console.log(`⚠️  Backup already exists: ${file}.original`)
      } catch {
        // Backup doesn't exist, create it
        await copyFile(originalPath, backupPath)
        console.log(`✅ Created backup: ${file}.original`)
      }
    } catch (error) {
      console.log(`⚠️  Original file not found: ${file}`)
    }
  }
  
  console.log('🎉 Backup process completed!')
}

backupFiles().catch(console.error)
