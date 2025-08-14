import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import App from './App'

export function render(url: string) {
  console.log('🔍 SSR rendering URL:', url)
  
  // Validar URL antes de processar
  if (!url || url.includes('::') || url.endsWith(':')) {
    console.error('❌ Invalid URL for SSR:', url)
    return { html: '<div>Error: Invalid URL</div>' }
  }
  
  // Sanitizar URL para evitar problemas com query params
  const cleanUrl = url.split('?')[0].split('#')[0]
  
  try {
    const html = renderToString(
      <StaticRouter location={cleanUrl}>
        <App />
      </StaticRouter>
    )
    
    console.log('✅ SSR completed for:', cleanUrl)
    return { html }
    
  } catch (error) {
    console.error('❌ SSR Error:', error)
    return { html: '<div>SSR Error - Fallback to SPA</div>' }
  }
}