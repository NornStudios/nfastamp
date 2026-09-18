/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CA_RH?: string
  readonly VITE_CA_BASE?: string
  readonly VITE_URL_X?: string
  readonly VITE_URL_TELEGRAM?: string
  readonly VITE_URL_DEXSCREENER?: string
  readonly VITE_URL_SITE?: string
  readonly VITE_URL_LAUNCHPAD_RH?: string
  readonly VITE_URL_LAUNCHPAD_PAIR_BACKUP?: string
  readonly VITE_URL_LAUNCHPAD_BASE?: string
  readonly VITE_URL_EXPLORER_RH?: string
  readonly VITE_URL_PONS_TOKEN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
