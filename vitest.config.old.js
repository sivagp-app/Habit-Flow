import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Test environment (jsdom simulates browser)
    environment: 'jsdom',
    
    // Global test utilities
    globals: true,
    
    // Setup file to run before tests
    setupFiles: ['./tests/setup.js'],
    
    // Coverage settings
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['js/**/*.js'],
      exclude: [
        'js/main.js', // Integration file
        'node_modules/**',
        'tests/**'
      ],
      lines: 85,
      functions: 85,
      branches: 80,
      statements: 85
    },
    
    // Test file patterns
    include: ['tests/**/*.test.js'],
    
    // Watch mode
    watch: false,
    
    // Reporter
    reporter: 'verbose',
    
    // Timeout
    testTimeout: 5000
  }
});
