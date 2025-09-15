# amarcash — রিঅ্যাক্ট + Vite + Tailwind + Express + Serverless + Capacitor (অ্যান্ড্রয়েড)

এই প্রোজেক্টটি একটি পূর্ণাঙ্গ মোবাইল-ফার্স্ট ওয়ালেট অ্যাপ (ওয়েব + অ্যাপ) যার সাথে অ্যাডমিন ড্যাশবোর্ড রয়েছে। ওয়েবে (Vercel/Netlify) ডিপ্লয় করা যায় এবং Android Play Store‑এর জন্য AAB বানানো যায়। অ্যাডমিন থেকে ফিচার অন/অফ করা যায়।

লাইভ স্ট্যাক:

- Frontend: React 18, Vite, Tailwind
- Mobile wrapper: Capacitor (Android)
- API: Express (dev) + Serverless functions (Vercel/Netlify)
- Admin Auth: HMAC JWT (environment variables দ্বারা নিয়ন্ত্রিত)
- ঐচ্ছিক DB: Supabase (প্রোডাকশনে পারসিস্টেন্সের জন্য ভালো)

## ১) ফিচার

- ইউজার অ্যাপ: Login/Register, Send Money, Recharge, Loans, Tasks, Profile ইত্যাদি
- অ্যাডমিন: `/admin-login` → `/admin`; ফিচার ভিজিবিলিটি টগল; env দিয়ে সিকিউর
- Serverless endpoints: `/api/admin/login`, `/api/admin/verify`

## ২) পূর্বশর্ত

- Node 18+ / PNPM বা NPM
- Android বিল্ডের জন্য: Android Studio, JDK 17, Android SDK/Platform‑Tools
- Play Console অ্যাকাউন্ট (পাবলিশিংয়ের জন্য)

## ৩) Environment Variables

`.env.example` থেকে `.env` তৈরি করুন এবং হোস্টে (Vercel/Netlify) সেট করুন:

- ADMIN_PASSWORD
- ADMIN_JWT_SECRET
- SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE (server‑only)

Vercel‑এ: Settings → Environment Variables → Production‑এ সেট করুন (Sensitive ON) �� Redeploy।

## ৪) লোকাল রান

```
pnpm i
pnpm dev
```

Dev server: http://localhost:8080

## ৫) বিল্ড (ওয়েব) + ডিপ্লয়

- Vercel: build `npm run build:client`, output `dist/spa` (vercel.json কনফিগার্ড)
- Netlify: command `npm run build:client`, publish `dist/spa`, functions `netlify/functions`

## ৬) Android (Capacitor) — Play Store AAB

১) ডিপেন্ডেন্সি ইন্সটল (একবার):

```
pnpm i @capacitor/core @capacitor/cli -D
pnpm i @capacitor/android -D
```

২) ওয়েব বিল্ড (output: `dist/spa`):

```
pnpm run build:client
```

৩) অ্যান্ড্রয়েড প্ল্যাটফর্ম অ্যাড (একবার):

```
pnpm run android:add
```

৪) ওয়েব → অ্যান্ড্রয়েড সিঙ্ক:

```
pnpm run android:sync
```

৫) Android Studio ওপেন:

```
pnpm run android:open
```

৬) Android Studio: Build → Generate Signed Bundle/APK → AAB

- Keystore তৈরি/সিলেক্ট
- Release AAB বানিয়ে নিন

## ৭) Play Store সাবমিশন চেকলিস্ট

- Release AAB (signed)
- App name, short/long description
- Screenshots (৬.৭" ও ৬.���"), Feature graphic 1024×500, Icon 512×512
- Privacy Policy URL
- Content rating, target audience, ads declaration
- প্রতিটি রিলিজে versionCode/versionName আপডেট

## ৮) Supabase (ঐচ্ছিক কিন্তু সুপারিশকৃত)

- Project URL + anon key (+ service role key server‑এর জন্য)
- RLS ON টেবিল: `profiles`, `balances`, `transactions`, `recharges`, `tasks`, `referrals`
- Authenticated ব্যবহারকারীর জন্য সরল নীতি
- হোস্টে envs সেট করে localStorage → API/DB‑তে মাইগ্রেট

## ৯) অ্যাডমিন

- লগইন: `/admin-login` (ADMIN_PASSWORD)
- ড্যাশবোর্ড: `/admin` (JWT প্রয়োজন)
- ফিচার ফ্ল্যাগ localStorage‑এ সেভ (চাইলে DB‑তে তুলতে পারবেন)

## ১০) মার্কেটপ্লেস (যেমন CodeCanyon) প্যাকেজিং

- সম্পূর্ণ সোর্স
- এই README (বাংলা) + ইংরেজি README
- `.env.example` (কোনো রিয়েল সিক্রেট নয়)
- Changelog/ভার্সনিং
- লাইসেন্স + থার্ড‑পার্টি নোটিস
- লাইভ ডেমো URL + ডেমো ক্রেডেনশিয়াল
- সাপোর্ট পলিসি

## ১১) কমন কমান্ড

```
pnpm dev
pnpm build
pnpm build:client
pnpm android:add
pnpm android:sync
pnpm android:open
```

## ১২) নোট

- AAB বিল্ডের জন্য অ্যান্ড্রয়েড স্টুডিও লাগবে
- SERVICE_ROLE কখনও ক্লায়েন্টে এক্সপোজ করবেন না
- `capacitor.config.ts` এ appId/appName বা webDir বদলালে আপডেট করুন
