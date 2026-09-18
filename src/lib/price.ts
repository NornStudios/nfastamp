/**
 * NFA price fetch helpers (browser + shared types).
 * Prefer /api/nfa-price on Vercel (can scrape Pons); fall back to public APIs.
 */

import { CA_RH, LINKS, PONS_CTA } from '../config'

export type NfaPriceQuote = {
  symbol: string
  priceUsd: number | null
  marketCapUsd: number | null
  change24h: number | null
  source: 'geckoterminal' | 'dexscreener' | 'pons' | 'none'
  market: string
  href: string
  updatedAt: number
}

const GECKO_TOKEN = `https://api.geckoterminal.com/api/v2/networks/robinhood/tokens/${CA_RH.toLowerCase()}`
const GECKO_POOL = `https://api.geckoterminal.com/api/v2/networks/robinhood/pools/0x19ba3545d0edcd2aafb47cfca97572b9ffc1c1b4`
const DEX_TOKEN = `https://api.dexscreener.com/latest/dex/tokens/${CA_RH}`

function num(v: unknown): number | null {
  if (v == null || v === '') return null
  const n = typeof v === 'number' ? v : Number(String(v).replace(/[$,]/g, ''))
  return Number.isFinite(n) ? n : null
}

export async function fetchGeckoQuote(): Promise<NfaPriceQuote | null> {
  try {
    const [tokenRes, poolRes] = await Promise.all([
      fetch(GECKO_TOKEN),
      fetch(GECKO_POOL),
    ])
    if (!tokenRes.ok) return null
    const tokenJson = (await tokenRes.json()) as {
      data?: { attributes?: Record<string, unknown> }
    }
    const poolJson = poolRes.ok
      ? ((await poolRes.json()) as {
          data?: { attributes?: Record<string, unknown> }
        })
      : null
    const t = tokenJson.data?.attributes ?? {}
    const p = poolJson?.data?.attributes ?? {}
    const priceUsd =
      num(t.price_usd) ?? num(p.base_token_price_usd)
    const marketCapUsd = num(t.market_cap_usd) ?? num(t.fdv_usd) ?? num(p.fdv_usd)
    const changeRaw = p.price_change_percentage as
      | Record<string, string>
      | undefined
    const change24h = num(changeRaw?.h24)
    if (priceUsd == null && marketCapUsd == null) return null
    return {
      symbol: 'NFA',
      priceUsd,
      marketCapUsd,
      change24h,
      source: 'geckoterminal',
      market: 'Robinhood Chain',
      href:
        LINKS.dexscreener !== '#'
          ? LINKS.dexscreener
          : `https://www.geckoterminal.com/robinhood/tokens/${CA_RH}`,
      updatedAt: Date.now(),
    }
  } catch {
    return null
  }
}

export async function fetchDexQuote(): Promise<NfaPriceQuote | null> {
  try {
    const res = await fetch(DEX_TOKEN)
    if (!res.ok) return null
    const json = (await res.json()) as {
      pairs?: Array<{
        priceUsd?: string
        fdv?: number
        marketCap?: number
        priceChange?: { h24?: number }
        url?: string
        chainId?: string
      }> | null
    }
    const pairs = json.pairs ?? []
    if (!pairs.length) return null
    const best = pairs[0]
    return {
      symbol: 'NFA',
      priceUsd: num(best.priceUsd),
      marketCapUsd: num(best.marketCap) ?? num(best.fdv),
      change24h: num(best.priceChange?.h24),
      source: 'dexscreener',
      market: best.chainId ?? 'dex',
      href: best.url ?? LINKS.dexscreener,
      updatedAt: Date.now(),
    }
  } catch {
    return null
  }
}

export async function fetchApiQuote(): Promise<NfaPriceQuote | null> {
  try {
    const res = await fetch('/api/nfa-price', { headers: { accept: 'application/json' } })
    if (!res.ok) return null
    const q = (await res.json()) as NfaPriceQuote
    if (!q || q.source === 'none') return null
    return q
  } catch {
    return null
  }
}

export async function loadNfaPrice(): Promise<NfaPriceQuote> {
  const fromApi = await fetchApiQuote()
  if (fromApi?.priceUsd != null) return fromApi

  const gecko = await fetchGeckoQuote()
  if (gecko?.priceUsd != null) return gecko

  const dex = await fetchDexQuote()
  if (dex?.priceUsd != null) return dex

  return (
    fromApi ??
    gecko ??
    dex ?? {
      symbol: 'NFA',
      priceUsd: null,
      marketCapUsd: null,
      change24h: null,
      source: 'none',
      market: 'Pons bonding',
      href: PONS_CTA,
      updatedAt: Date.now(),
    }
  )
}

export function formatUsdPrice(n: number | null): string {
  if (n == null) return '—'
  if (n >= 1) return `$${n.toFixed(2)}`
  if (n >= 0.01) return `$${n.toFixed(4)}`
  if (n >= 0.0001) return `$${n.toFixed(6)}`
  // very small meme prices
  return `$${n.toPrecision(3)}`
}

export function formatUsdCompact(n: number | null): string {
  if (n == null) return '—'
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}k`
  return `$${n.toFixed(0)}`
}

export function formatChange(n: number | null): string {
  if (n == null) return ''
  const sign = n > 0 ? '+' : ''
  return `${sign}${n.toFixed(1)}%`
}
