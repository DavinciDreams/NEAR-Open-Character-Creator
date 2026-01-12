import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174
  },
  // optimizeDeps.disabled removed for Vite 5.1+ compatibility
  build: {
    commonjsOptions: {
      include: ['bn.js'],
      namedExports: {
        'bn.js': ['BN']
      }
    }
  }
})
