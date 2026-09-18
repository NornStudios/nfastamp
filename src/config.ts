/**
 * NFA public launch config — single place to swap CA / socials / domain-related URLs.
 *
 * CURRENT (7-day traction test — see docs/decision-ca-seven-day-test.md):
 *   1. contract = live RH CA on Pons (set below).
 *   2. Review ~2026-09-25: if no traction → relaunch Pons+ETH/WETH and swap CA.
 *   3. Set dexscreener when the pair indexes.
 *   4. Leave contractBase as TBD until Base companion sitting.
 *   5. Leave x / telegram as '#' until handles exist.
 *
 * DOMAIN:
 *   Canonical site: https://nfastamp.fun (locked).
 *   Keep absolute og:url / og:image in index.html in sync — see docs/decision-domain.md
 *
 * OPTIONAL ENV (Vite) — non-empty values override the literals below:
 *   VITE_CA_RH, VITE_CA_BASE, VITE_URL_X, VITE_URL_TELEGRAM,
 *   VITE_URL_DEXSCREENER, VITE_URL_SITE, VITE_URL_LAUNCHPAD_RH, VITE_URL_LAUNCHPAD_BASE,
 *   VITE_URL_LAUNCHPAD_PAIR_BACKUP, VITE_URL_EXPLORER_RH, VITE_URL_PONS_TOKEN
 *
 * Do not invent a Base CA. Redeploy claimed Vercel when CA/config changes.
 */

function env(key: keyof ImportMetaEnv): string | undefined {
  const v = import.meta.env[key]
  return typeof v === 'string' && v.trim() !== '' ? v.trim() : undefined
}

/** Live RH Chain CA — 7-day traction test primary (review ~2026-09-25). */
export const CA_RH = '0x4E26Fc35985037Fd30E2e7aFb0d37695b7E58D62' as const

export const LINKS = {
  // TBD — set when X handle exists (full profile URL)
  x: env('VITE_URL_X') ?? '#',

  // TBD — set when Telegram exists (https://t.me/…)
  telegram: env('VITE_URL_TELEGRAM') ?? '#',

  // TBD — DexScreener (or Gecko) when pair indexes
  dexscreener: env('VITE_URL_DEXSCREENER') ?? '#',

  // Primary pad — Pons on Robinhood Chain
  launchpad: env('VITE_URL_LAUNCHPAD_RH') ?? 'https://pons.fun/launchpad',

  // Direct Pons token/market URL
  ponsToken:
    env('VITE_URL_PONS_TOKEN') ??
    'https://www.ponsfamily.com/launchpad/0x4E26Fc35985037Fd30E2e7aFb0d37695b7E58D62',

  // RH backup pad — PAIR (if Pons fails); not primary
  launchpadPairBackup:
    env('VITE_URL_LAUNCHPAD_PAIR_BACKUP') ?? 'https://pair.fund/',

  // Companion pad — Stonks on Base (later sitting only)
  launchpadBase:
    env('VITE_URL_LAUNCHPAD_BASE') ?? 'https://www.thestonks.exchange/',

  // Robinhood Chain CA — primary for traction window
  contract: env('VITE_CA_RH') ?? CA_RH,

  // TBD — Base CA only when companion ships
  contractBase: env('VITE_CA_BASE') ?? 'TBD',

  // Blockscout address page
  explorer:
    env('VITE_URL_EXPLORER_RH') ??
    `https://robinhoodchain.blockscout.com/address/${CA_RH}`,

  // Locked canonical domain
  siteUrl: env('VITE_URL_SITE') ?? 'https://nfastamp.fun',
} as const

/** Primary buy/CTA href: specific Pons market if set, else launchpad. */
export const PONS_CTA =
  LINKS.ponsToken.trim() !== '' ? LINKS.ponsToken : LINKS.launchpad

export type Links = typeof LINKS
