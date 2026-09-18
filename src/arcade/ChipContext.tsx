import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  createDemoWallet,
  type Asset,
  type ChipWallet,
  DEMO_STARTING_CHIPS,
} from './chips'

type ChipCtx = {
  balance: number
  asset: Asset
  setAsset: (a: Asset) => void
  debit: (n: number) => boolean
  credit: (n: number) => void
  reset: () => void
  wallet: ChipWallet
}

const Ctx = createContext<ChipCtx | null>(null)

export function ChipProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(DEMO_STARTING_CHIPS)
  const [asset, setAssetState] = useState<Asset>('NFA')
  const [wallet] = useState(() =>
    createDemoWallet((b) => setBalance(b)),
  )

  useEffect(() => {
    setBalance(wallet.balance)
  }, [wallet])

  const value = useMemo<ChipCtx>(
    () => ({
      balance,
      asset,
      setAsset: (a) => {
        wallet.setAsset(a)
        setAssetState(a)
      },
      debit: (n) => wallet.debit(n),
      credit: (n) => wallet.credit(n),
      reset: () => wallet.reset(),
      wallet,
    }),
    [balance, asset, wallet],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useChips(): ChipCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useChips outside ChipProvider')
  return ctx
}
