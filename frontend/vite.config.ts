import {
  BRANDING_APPLICATION_DESCRIPTION,
  BRANDING_APPLICATION_TITLE,
  BRANDING_APPLICATION_URL,
  BRANDING_APPLICATION_IMAGE_URL,
  BRANDING_APPLICATION_THEME_COLOR, // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
} from './src/data/branding-strings'
import react from '@vitejs/plugin-react-swc'
import chalk from 'chalk'
import path from 'path'
import { defineConfig } from 'vite'
import handlebars from 'vite-plugin-handlebars'

const getPostData = (req) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return new Promise((resolve, _reject) => {
    let data = ''
    req.on('data', (chunk) => {
      data += chunk.toString()
    })

    req.on('end', () => {
      if (!data) {
        resolve({})
      }

      resolve(data)
    })
  })
}

let current_request_seq_no = 0
const getRequestSeqNo = () => {
  current_request_seq_no++
  if (current_request_seq_no > 999) current_request_seq_no = 1

  return chalk.white(('' + current_request_seq_no).padStart(3))
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    handlebars({
      context: {
        BRANDING_APPLICATION_DESCRIPTION,
        BRANDING_APPLICATION_TITLE,
        BRANDING_APPLICATION_URL,
        BRANDING_APPLICATION_IMAGE_URL,
        BRANDING_APPLICATION_THEME_COLOR,
      },
    }),
  ],

  server: {
    host: '0.0.0.0',
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
            console.error('PROXY ERROR', err)
          })
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          proxy.on('proxyReq', async (_proxyReq, req, _res) => {
            const req_seq_no = getRequestSeqNo()
            req['req_seq_no'] = req_seq_no
            const requestBody = await getPostData(req)
            console.log(
              chalk.gray('[API ' + req_seq_no + ']') + chalk.yellow(' -->'),
              req.method,
              req.url,
              requestBody
            )
          })
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log(
              chalk.gray('[API ' + req['req_seq_no'] + ']'),
              proxyRes.statusCode,
              req.method,
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
