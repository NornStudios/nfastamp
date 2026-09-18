/**
 * Demo chip wallet — localStorage only.
 * v1: swap DemoChipWallet for a paid adapter implementing ChipWallet.
 */

const STORAGE_KEY = 'nfa-arcade-demo-chips-v0'
const STARTING = 1000

export type Asset = 'NFA' | 'USDC'

export interface ChipWallet {
  balance: number
  asset: Asset
  debit(amount: number): boolean
  credit(amount: number): void
  setAsset(asset: Asset): void
  reset(): void
}

function readBalance(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw == null) return STARTING
    const n = Number(raw)
    return Number.isFinite(n) ? n : STARTING
  } catch {
    return STARTING
  }
}

function writeBalance(n: number) {
  try {
    localStorage.setItem(STORAGE_KEY, String(Math.max(0, +n.toFixed(2))))
  } catch {
    /* ignore */
  }
}

export function createDemoWallet(
  onChange?: (balance: number) => void,
): ChipWallet {
  let balance = typeof window === 'undefined' ? STARTING : readBalance()
  let asset: Asset = 'NFA'

  const notify = () => onChange?.(balance)

  return {
    get balance() {
      return balance
    },
    get asset() {
      return asset
    },
    debit(amount: number) {
      if (amount <= 0 || amount > balance) return false
      balance = +(balance - amount).toFixed(2)
      writeBalance(balance)
      notify()
      return true
    },
    credit(amount: number) {
      if (amount <= 0) return
      balance = +(balance + amount).toFixed(2)
      writeBalance(balance)
      notify()
    },
    setAsset(a: Asset) {
      asset = a
    },
    reset() {
      balance = STARTING
      writeBalance(balance)
      notify()
    },
  }
}

export { STARTING as DEMO_STARTING_CHIPS }
