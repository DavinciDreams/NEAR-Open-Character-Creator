import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
  },
  plugins: [react()],
  resolve: {
    alias: {
      buffer: 'buffer',
    },
  },
  optimizeDeps: {
    include: [
      'buffer',
      'bn.js',
      '@ethersproject/*',
      'ethers',
      'near-api-js',
      'js-sha3',
      '@web3-react/*',
      'hash.js',
      'inherits',
    ],
    exclude: ['html2canvas'],  // Fix content.js syntax error
  },
  define: {
    global: 'globalThis',
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
})
