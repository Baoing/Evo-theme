/**
 * Evo Theme - ESLint Configuration
 * Code quality rules for modern JavaScript development
 * 
 * @description Enforces consistent code style and best practices
 * @version 1.0.0
 */

module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    // Code style
    'indent': ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'never'],
    
    // Best practices
    'no-unused-vars': ['warn'],
    'no-console': ['warn'],
    'prefer-const': ['error'],
    'no-var': ['error'],
    
    // Modern JavaScript
    'arrow-spacing': ['error'],
    'object-shorthand': ['error'],
    'prefer-arrow-callback': ['error'],
    'prefer-template': ['error'],
    
    // Spacing and formatting
    'space-before-blocks': ['error'],
    'keyword-spacing': ['error'],
    'comma-spacing': ['error'],
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    
    // Function rules
    'func-call-spacing': ['error', 'never'],
    'no-trailing-spaces': ['error']
  },
  globals: {
    'Alpine': 'readonly',
    'Shopify': 'readonly',
    'theme': 'readonly',
    'themeVendor': 'readonly'
  }
}


