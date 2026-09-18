# NFA — nfastamp.fun

Official marketing site for **NFA** (`nfastamp.fun`). Vite + React + TypeScript.

Live: https://nfastamp.fun  
CA (Robinhood Chain): `0x4E26Fc35985037Fd30E2e7aFb0d37695b7E58D62`  
Pons: https://www.ponsfamily.com/launchpad/0x4E26Fc35985037Fd30E2e7aFb0d37695b7E58D62

Config (CA, socials, pad URLs) lives in `src/config.ts`.

## Local

```bash
npm i
npm run dev      # http://localhost:5173
npm run build    # output → dist/
npm run preview  # preview production build
```

## Vercel (Git connect)

1. [Vercel Dashboard](https://vercel.com/new) → **Add New…** → **Project** → **Import** this Git repo (or the `nfastamp` branch if still hosted on `deadline-duel`).
2. Framework Preset: **Vite**
3. Root Directory: `.` (site is at repo / branch root)
4. Build Command: `npm run build` · Output: `dist`
5. Deploy → **Settings → Domains** → add `nfastamp.fun` (and `www` if used)
6. Push to the connected branch → auto redeploy

Optional Vite env overrides: `VITE_CA_RH`, `VITE_URL_PONS_TOKEN`, `VITE_URL_X`, `VITE_URL_TELEGRAM`, etc. (see `src/config.ts`).

## Note on hosting location

If this content is on branch `nfastamp` of `Norn-Studios/deadline-duel` (temporary until a dedicated `nfastamp` repo exists): set **Production Branch** to `nfastamp` and Root Directory `.`. Prefer creating empty public repo `Norn-Studios/nfastamp` in the GitHub UI, then push this tree to `main` there for a clean Vercel import.
