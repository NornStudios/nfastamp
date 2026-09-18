import react from '@vitejs/plugin-react'
import type { Connect, Plugin } from 'vite'
import { defineConfig } from 'vite'

const CA = '0x4E26Fc35985037Fd30E2e7aFb0d37695b7E58D62'
const PONS = `https://www.ponsfamily.com/launchpad/${CA}`

function num(v: unknown): number | null {
  if (v == null || v === '') return null
  const n = typeof v === 'number' ? v : Number(String(v).replace(/[$,]/g, ''))
  return Number.isFinite(n) ? n : null
}

async function handlePrice(
  _req: Connect.IncomingMessage,
  res: Connect.ServerResponse,
  next: Connect.NextFunction,
) {
  try {
    const html = await fetch(PONS, {
      headers: { 'user-agent': 'nfastamp-ticker/1.0' },
    }).then((r) => r.text())
    const priceMatch = html.match(/<dt>Price<\/dt><dd>\$([0-9.,]+)<\/dd>/i)
    const mcapMatch = html.match(
      /<dt>Market cap<\/dt><dd>\$([0-9.,]+)<\/dd>/i,
    )
    const priceUsd = priceMatch ? num(priceMatch[1]) : null
    const body = JSON.stringify({
      symbol: 'NFA',
      priceUsd,
      marketCapUsd: mcapMatch ? num(mcapMatch[1]) : null,
      change24h: null,
      source: priceUsd != null ? 'pons' : 'none',
      market: 'Bonding curve',
      href: PONS,
      updatedAt: Date.now(),
    })
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(body)
  } catch (e) {
    next(e as Error)
  }
}

/** Local / preview stand-in for Vercel `/api/nfa-price`. */
function nfaPriceDevApi(): Plugin {
  return {
    name: 'nfa-price-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/nfa-price', handlePrice)
    },
    configurePreviewServer(server) {
      // Register before SPA fallback so /api is not rewritten to index.html
      server.middlewares.use('/api/nfa-price', handlePrice)
    },
  }
}

// Media is copied into public/media/nfa for a self-contained build.
export default defineConfig({
  plugins: [react(), nfaPriceDevApi()],
})
