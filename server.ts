import express from 'express'
import compression from 'compression'
import sirv from 'sirv'
import { createServer as createViteServer } from 'vite'

const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 3000

async function createServer() {
  const app = express()
  
  app.use(compression())
  
  if (isProduction) {
    app.use('/', sirv('dist/client', { extensions: [] }))
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom'
    })
    app.use(vite.middlewares)
  }
  
  app.get('*', async (req, res) => {
    try {
      const url = req.originalUrl
      
      // Rotas que devem usar SSR (páginas públicas)
      const ssrRoutes = ['/', '/products', '/about']
      const shouldUseSSR = ssrRoutes.some(route => url.startsWith(route))
      
      if (shouldUseSSR) {
        // SSR para páginas públicas
        const { render } = await import('./src/entry-server')
        const { html } = render(url)
        
        const template = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Dream Shops</title>
            </head>
            <body>
              <div id="root">${html}</div>
              <script type="module" src="/src/entry-client.tsx"></script>
            </body>
          </html>
        `
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template)
      } else {
        // SPA para páginas privadas
        const template = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Dream Shops</title>
            </head>
            <body>
              <div id="root"></div>
              <script type="module" src="/src/entry-client.tsx"></script>
            </body>
          </html>
        `
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template)
      }
    } catch (error) {
      console.error(error)
      res.status(500).end('Internal Server Error')
    }
  })
  
  app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`)
  })
}

createServer()