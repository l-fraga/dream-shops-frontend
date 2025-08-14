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
    
    // ✅ CORREÇÃO: Registrar Vite middleware para assets específicos
    app.use('/src', vite.middlewares)
    app.use('/@vite', vite.middlewares)
    app.use('/node_modules', vite.middlewares)
  }
  
  // ✅ Rota específica para a raiz ANTES do wildcard
  app.get('/', async (req, res) => {
    try {
      console.log('🔍 Processing HOME URL: /')
      
      // SSR para home page
      const { render } = await import('./src/entry-server')
      const { html } = render('/')
      
      const template = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Dream Shops - Home</title>
          </head>
          <body>
            <div id="root">${html}</div>
            <script type="module" src="/src/entry-client.tsx"></script>
          </body>
        </html>
      `
      
      console.log('✅ HOME SSR rendered successfully')
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template)
      
    } catch (error) {
      console.error('❌ HOME SSR Error:', error)
      
      // Fallback SPA para home
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
  })
  
  // ✅ Wildcard para outras rotas
  app.get('/*splat', async (req, res) => {
    try {
      const url = req.originalUrl
      
      console.log('🔍 Processing URL:', url)
      
      // Rotas que devem usar SSR (páginas públicas)
      const ssrRoutes = ['/products', '/about']
      const shouldUseSSR = ssrRoutes.some(route => url.startsWith(route))
      
      console.log('🔍 Should use SSR:', shouldUseSSR)
      
      if (shouldUseSSR) {
        try {
          // ✅ SSR para páginas públicas
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
          
          console.log('✅ SSR rendered successfully')
          res.status(200).set({ 'Content-Type': 'text/html' }).end(template)
          
        } catch (ssrError) {
          console.error('❌ SSR Error, falling back to SPA:', ssrError)
          
          // Fallback para SPA se SSR falhar
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
      } else {
        // SPA para páginas privadas (dashboard, etc.)
        console.log('✅ Using SPA for private route')
        
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
      console.error('❌ Server error:', error)
      res.status(500).end('Internal Server Error')
    }
  })
  
  app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`)
    console.log(`📋 SSR enabled for: /, /products, /about`)
    console.log(`📋 SPA for: /login, /dashboard`)
  })
}

createServer()