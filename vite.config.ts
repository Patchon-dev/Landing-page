import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: 'react', test: /node_modules\/(react|react-dom|scheduler)\//, priority: 20 },
            { name: 'ui-core', test: /node_modules\/(@floating-ui\/|@zag-js\/(anatomy|core|dom-query|react|store|utils)\/)/, priority: 15 },
            { name: 'skeleton', test: /node_modules\/(@skeletonlabs|@zag-js)\//, priority: 10 },
          ],
        },
      },
    },
  },
})
