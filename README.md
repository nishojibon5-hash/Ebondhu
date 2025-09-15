# amarcash — React + Vite + Tailwind + Express + Serverless + Capacitor (Android)

A complete mobile-first wallet-style app with admin dashboard, ready for web (Vercel/Netlify) and Android (Play Store AAB via Capacitor). Includes feature flags controlled from Admin.

Live-ready stack:
- Frontend: React 18, Vite, Tailwind
- Mobile wrapper: Capacitor (Android)
- API: Express (dev) + Serverless functions (Vercel/Netlify)
- Auth (admin): HMAC JWT (env-driven)
- Optional DB: Supabase (recommended for production persistence)

## 1) Features
- User app: Login/Register, Send Money, Recharge, Loans, Tasks, Profile, etc.
- Admin: /admin-login → /admin; toggle feature visibility; secure with env keys.
- Serverless endpoints for admin login/verify: `/api/admin/login`, `/api/admin/verify`.

## 2) Requirements
- Node 18+ / PNPM or NPM
- For Android builds: Android Studio (Arctic+), JDK 17, Android SDK/Platform-Tools
- Play Console account (for publishing)

## 3) Environment Variables
Create `.env` from `.env.example` and configure in your host (Vercel/Netlify):
- ADMIN_PASSWORD
- ADMIN_JWT_SECRET
- SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE (server-only)

On Vercel: Settings → Environment Variables → set for Production (Sensitive ON) → Redeploy.

## 4) Run locally
```
pnpm i
pnpm dev
```
Dev server: http://localhost:8080

## 5) Build (web) + Deploy
- Vercel: repo → “Import Project” → build command: `npm run build:client` → output: `dist/spa` (already configured via vercel.json)
- Netlify: command `npm run build:client`, publish `dist/spa`, functions `netlify/functions`

## 6) Android (Capacitor) — Generate Play Store AAB
1) Install deps (once):
```
pnpm i @capacitor/core @capacitor/cli -D
pnpm i @capacitor/android -D
```
2) Ensure web build outputs to `dist/spa` (already set). Build web:
```
pnpm run build:client
```
3) Add Android platform (once):
```
pnpm run android:add
```
4) Sync web -> Android project:
```
pnpm run android:sync
```
5) Open Android Studio:
```
pnpm run android:open
```
6) In Android Studio: Build → Generate Signed Bundle/APK → Android App Bundle (AAB)
   - Create/Use Keystore; set passwords; remember them
   - Build Release AAB

7) Testing on device:
- Build debug APK from Android Studio, install on device

## 7) Play Store Submission Checklist
- AAB file (release, signed)
- App name, short/long description, screenshots (phone 6.7", 6.3"), feature graphic 1024×500, hi‑res icon 512×512
- Privacy Policy URL
- Content rating, target audience, ads declaration
- Versioning: update versionCode/versionName in Android before each release

## 8) Supabase (optional but recommended)
- Create project → copy URL + anon key (+ service role key for server)
- Add RLS-enabled tables: `profiles`, `balances`, `transactions`, `recharges`, `tasks`, `referrals`
- Configure simple policies for authenticated users
- Add envs on host, then swap localStorage reads/writes to Supabase (scoped services can be added in `server/` and used from client via API)

## 9) Admin
- Login: `/admin-login` with ADMIN_PASSWORD
- Dashboard: `/admin` (requires JWT from login)
- Feature flags persist in localStorage (can be ported to DB by wiring endpoints)

## 10) Packaging for Marketplace (e.g., CodeCanyon)
Include:
- Full source code
- This README with step-by-step web deploy + Android build
- `.env.example` (no real secrets)
- Changelog and version tags
- License + third-party notices (Radix UI, Tailwind, etc.)
- Demo credentials (if any) and live demo URL
- Support policy and contact

## 11) Common Commands
```
pnpm dev                 # run web dev server
pnpm build               # server + client build
pnpm build:client        # client-only (webDir for Capacitor)
pnpm android:add         # add Android platform (once)
pnpm android:sync        # sync built web to Android project
pnpm android:open        # open Android Studio
```

## 12) Notes
- AAB building requires Android Studio (not available on server CI by default)
- Do not expose SERVICE_ROLE to the client; keep it on serverless only
- Update `capacitor.config.ts` if you change `webDir` or appId/appName
