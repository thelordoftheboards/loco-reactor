import {
  BRANDING_APPLICATION_DESCRIPTION,
  BRANDING_APPLICATION_TITLE, // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
} from './src/data/branding-strings'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig } from 'vite'
import handlebars from 'vite-plugin-handlebars'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    handlebars({
      context: {
        BRANDING_APPLICATION_DESCRIPTION,
        BRANDING_APPLICATION_TITLE,
      },
    }),
  ],

  server: {
    port: 3001,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        configure: (proxy, _options) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          proxy.on('error', (err, _req, _res) => {
            console.error('proxy error', err)
          })
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url)
          })
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log(
              'Received Response from the Target:',
              proxyRes.statusCode,
              req.url
            )
          })
        },
      },
    },
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
