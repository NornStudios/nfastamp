/**
 * Vercel serverless — NFA price for the site ticker.
 * Tries GeckoTerminal, then DexScreener, then Pons HTML scrape (bonding curve).
 */

const CA = '0x4E26Fc35985037Fd30E2e7aFb0d37695b7E58D62'
const PONS = `https://www.ponsfamily.com/launchpad/${CA}`
const GECKO = `https://api.geckoterminal.com/api/v2/networks/robinhood/tokens/${CA.toLowerCase()}`
const GECKO_POOL =
  'https://api.geckoterminal.com/api/v2/networks/robinhood/pools/0x19ba3545d0edcd2aafb47cfca97572b9ffc1c1b4'
const DEX = `https://api.dexscreener.com/latest/dex/tokens/${CA}`

function num(v) {
  if (v == null || v === '') return null
  const n = typeof v === 'number' ? v : Number(String(v).replace(/[$,]/g, ''))
  return Number.isFinite(n) ? n : null
}

async function fromGecko() {
  const [tRes, pRes] = await Promise.all([fetch(GECKO), fetch(GECKO_POOL)])
  if (!tRes.ok) return null
  const t = (await tRes.json())?.data?.attributes || {}
  const p = pRes.ok ? (await pRes.json())?.data?.attributes || {} : {}
  const priceUsd = num(t.price_usd) ?? num(p.base_token_price_usd)
  if (priceUsd == null) return null
  return {
    symbol: 'NFA',
    priceUsd,
    marketCapUsd: num(t.market_cap_usd) ?? num(t.fdv_usd) ?? num(p.fdv_usd),
    change24h: num(p.price_change_percentage?.h24),
    source: 'geckoterminal',
    market: 'Robinhood Chain',
    href: `https://www.geckoterminal.com/robinhood/tokens/${CA}`,
    updatedAt: Date.now(),
  }
}

async function fromDex() {
  const res = await fetch(DEX)
  if (!res.ok) return null
  const pairs = (await res.json())?.pairs || []
  if (!pairs.length) return null
  const best = pairs[0]
  return {
    symbol: 'NFA',
    priceUsd: num(best.priceUsd),
    marketCapUsd: num(best.marketCap) ?? num(best.fdv),
    change24h: num(best.priceChange?.h24),
    source: 'dexscreener',
    market: best.chainId || 'dex',
    href: best.url || '#',
    updatedAt: Date.now(),
  }
}

async function fromPons() {
  const res = await fetch(PONS, {
    headers: { 'user-agent': 'nfastamp-ticker/1.0' },
  })
  if (!res.ok) return null
  const html = await res.text()
  const priceMatch = html.match(/<dt>Price<\/dt><dd>\$([0-9.,]+)<\/dd>/i)
  const mcapMatch = html.match(/<dt>Market cap<\/dt><dd>\$([0-9.,]+)<\/dd>/i)
  const priceUsd = priceMatch ? num(priceMatch[1]) : null
  if (priceUsd == null) return null
  return {
    symbol: 'NFA',
    priceUsd,
    marketCapUsd: mcapMatch ? num(mcapMatch[1]) : null,
    change24h: null,
    source: 'pons',
    market: 'Bonding curve',
    href: PONS,
    updatedAt: Date.now(),
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=90')

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }

  try {
    const quote =
      (await fromGecko()) || (await fromDex()) || (await fromPons()) || {
        symbol: 'NFA',
        priceUsd: null,
        marketCapUsd: null,
        change24h: null,
        source: 'none',
        market: 'Pons bonding',
        href: PONS,
        updatedAt: Date.now(),
      }
    res.status(200).json(quote)
  } catch (e) {
    res.status(200).json({
      symbol: 'NFA',
      priceUsd: null,
      marketCapUsd: null,
      change24h: null,
      source: 'none',
      market: 'Pons bonding',
      href: PONS,
      updatedAt: Date.now(),
      error: String(e?.message || e),
    })
  }
}
