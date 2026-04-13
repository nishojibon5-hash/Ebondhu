# APK Build Guide - amarcash Android App

এই গাইড আপনাকে amarcash অ্যাপের Android APK তৈরি করতে সাহায্য করবে।

## 📋 পূর্ব-প্রয়োজনীয়তা (Requirements)

### সিস্টেম প্রয়োজনীয়তা:
- **Java 17** বা তার উপরে
- **Node.js 18+**
- **Android SDK** (API level 34+)
- **Android Build Tools 34.0.0+**
- **Gradle 8.0+**

### ইনস্টলেশন ধাপ:

#### 1. Java 17 ইনস্টল করুন:
```bash
# Ubuntu/Debian
sudo apt-get install openjdk-17-jdk

# macOS (Homebrew)
brew install openjdk@17

# Windows - Download from oracle.com
```

#### 2. Android SDK ইনস্টল করুন:
```bash
# Ubuntu/Debian তে Android SDK Tools
sudo apt-get install android-sdk

# অথবা Android Studio ডাউনলোড করুন:
# https://developer.android.com/studio
```

#### 3. Environment Variables সেট করুন:
```bash
# ~/.bashrc বা ~/.zshrc তে যোগ করুন:
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64  # Linux এর জন্য
```

---

## 🔨 স্থানীয়ভাবে APK বিল্ড করুন (Local Build)

### ধাপ 1: রিপোজিটরি ক্লোন করুন
```bash
git clone <repository-url>
cd amarcash
```

### ধাপ 2: ডিপেন্ডেন্সি ইনস্টল করুন
```bash
pnpm install
# অথবা npm install
```

### ধাপ 3: ওয়েব অ্যাপ বিল্ড করুন
```bash
npm run build:client
```

**প্রত্যাশিত আউটপুট:**
```
✓ built in 7.13s
dist/spa/index.html                     0.46 kB
dist/spa/assets/index-CTswtMI7.css     91.09 kB
dist/spa/assets/index-DTkpAbfs.js   1,149.46 kB
```

### ধাপ 4: Android প্ল্যাটফর্ম যোগ করুন (প্রথম বার)
```bash
npx @capacitor/cli@latest add android
```

**এটি তৈরি করবে:**
- `android/` ডিরেক্টরি
- `android/gradlew` (Gradle wrapper)
- প্রয়োজনীয় Gradle কনফিগ ফাইলগুলি

### ধাপ 5: Android সিঙ্ক করুন
```bash
npx @capacitor/cli@latest sync android
```

**এটি করবে:**
- ওয়েব অ্যাপ কপি করবে Android প্রজেক্টে
- ক্যাপাসিটর কনফিগ সিঙ্ক করবে
- প্লাগইন আপডেট করবে

### ধাপ 6: Debug APK বিল্ড করুন
```bash
cd android
chmod +x gradlew
./gradlew assembleDebug --stacktrace
```

**বিল্ড সময়:** 5-15 মিনিট (নির্ভর করে সিস্টেমের উপর)

**প্রত্যাশিত আউটপুট:**
```
BUILD SUCCESSFUL in 5m 30s
app/build/outputs/apk/debug/app-debug.apk created successfully
```

### ধাপ 7: APK খুঁজুন
```bash
ls -lh app/build/outputs/apk/debug/app-debug.apk
```

---

## 📱 Release APK বিল্ড করুন

### ধাপ 1: Signing Key তৈরি করুন (প্রথম বার)
```bash
cd android
keytool -genkey -v -keystore amarcash-release.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias amarcash
```

**প্রশ্নাবলীর উত্তর দিন:**
```
Keystore password: [আপনার পাসওয়ার্ড]
Key password: [একই পাসওয়ার্ড]
Common Name: amarcash
Organization: amarcash
City: Dhaka
State: Bangladesh
Country Code: BD
```

### ধাপ 2: Signing Configuration যোগ করুন

`android/app/build.gradle.kts` এ যোগ করুন:

```gradle
signingConfigs {
    release {
        storeFile = file("amarcash-release.keystore")
        storePassword = System.getenv("KEYSTORE_PASSWORD") ?: "password"
        keyAlias = "amarcash"
        keyPassword = System.getenv("KEYSTORE_PASSWORD") ?: "password"
    }
}

buildTypes {
    release {
        signingConfig = signingConfigs.release
        minifyEnabled = true
        proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
    }
}
```

### ধাপ 3: Release APK বিল্ড করুন
```bash
cd android
export KEYSTORE_PASSWORD="your-password"
./gradlew assembleRelease --stacktrace
```

**আউটপুট:**
```
app/build/outputs/apk/release/app-release.apk
```

---

## ☁️ GitHub Actions দিয়ে স্বয়ংক্রিয় বিল্ড

### GitHub Secrets সেট আপ করুন:

1. **GitHub রিপোজিটরিতে যান** → Settings → Secrets and variables → Actions
2. **এই Secrets যোগ করুন:**

```
VITE_GOOGLE_SHEETS_ID: your-google-sheets-id
VITE_GOOGLE_DRIVE_FOLDER_ID: your-google-drive-folder-id
VITE_GOOGLE_CLIENT_ID: your-google-client-id
KEYSTORE_PASSWORD: your-keystore-password (optional)
```

### বিল্ড ট্রিগার করুন:

**Option 1 - স্বয়ংক্রিয় (main branch এ push এর সময):**
```bash
git push origin main
```

**Option 2 - ম্যানুয়ালি GitHub UI থেকে:**
1. Actions ট্যাব যান
2. "Build Android APK" ওয়ার্কফ্লো নির্বাচন করুন
3. "Run workflow" ক্লিক করুন

### বিল্ড প্রগতি দেখুন:

```
✓ Checkout Code                    (5s)
✓ Setup Java 17                    (10s)
✓ Setup Android SDK                (15s)
✓ Setup Node.js                    (5s)
✓ Install pnpm                     (3s)
✓ Install dependencies             (30s)
✓ Build Web Application            (15s)
✓ Verify Web Build Output          (2s)
✓ Initialize Android Platform      (10s)
✓ Sync Android Project             (5s)
✓ Setup Gradle Wrapper             (3s)
✓ Build Debug APK                  (5-15 min)
✓ Verify APK Output                (2s)
✓ Upload APK Artifact              (10s)

Total Time: ~20-35 minutes
```

---

## 🔍 সমস্যা সমাধান

### সমস্যা 1: "Android directory not found"
```bash
# সমাধান:
npx @capacitor/cli@latest add android
```

### সমস্যা 2: "gradlew: Permission denied"
```bash
# সমাধান:
chmod +x android/gradlew
```

### সমস্যা 3: "JAVA_HOME not set"
```bash
# সমাধান:
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
# অথবা Windows এ:
# set JAVA_HOME=C:\Program Files\Java\jdk-17
```

### সমস্যা 4: "Gradle build failed"
```bash
# সমাধান - Gradle cache পরিষ্কার করুন:
cd android
./gradlew clean
./gradlew assembleDebug --stacktrace
```

### সমস্যা 5: "dist/spa not found"
```bash
# সমাধান:
npm run build:client
```

---

## 📦 APK ফাইল বিবরণ

### Debug APK:
- **পাথ:** `android/app/build/outputs/apk/debug/app-debug.apk`
- **সাইজ:** ~50-100 MB
- **উদ্দেশ্য:** টেস্টিং এবং ডেভেলপমেন্ট
- **স্বাক্ষর:** স্বয়ংক্রিয় debug key দ্বারা স্বাক্ষরিত
- **ইনস্টল করা সহজ:** হ্যাঁ (যেকোনো ডিভাইসে)

### Release APK:
- **পাথ:** `android/app/build/outputs/apk/release/app-release.apk`
- **সাইজ:** ~40-60 MB (অপ্টিমাইজড)
- **উদ্দেশ্য:** Google Play Store তে আপলোড করার জন্য
- **স্বাক্ষর:** আপনার keystore দ্বারা স্বাক্ষরিত
- **মিনিফিকেশন:** সক্ষম করা (দ্রুত লোডিং)

---

## 🚀 Google Play Store এ আপলোড করুন

### পূর্বশর্ত:
1. Google Play Developer অ্যাকাউন্ট ($25 এককালীন)
2. Release APK (উপরে দেখুন)
3. অ্যাপ আইকন, স্ক্রীনশট, বিবরণ

### আপলোড প্রক্রিয়া:
1. Google Play Console (play.google.com/apps/publish) খুলুন
2. নতুন অ্যাপ তৈরি করুন
3. APK আপলোড করুন
4. স্টোর তথ্য পূরণ করুন
5. পর্যালোচনার জন্য জমা দিন

---

## ✅ চেকলিস্ট

APK বিল্ড এর আগে নিশ্চিত করুন:

- [ ] সব কোড পরিবর্তন committed এবং pushed
- [ ] `npm run build:client` সফল হয়
- [ ] `dist/spa/` ডিরেক্টরি বিদ্যমান
- [ ] Android SDK installed
- [ ] Java 17+ installed
- [ ] `android/` ডিরেক্টরি বিদ্যমান
- [ ] `android/gradlew` executable
- [ ] পর্যাপ্ত ডিস্ক স্থান (10+ GB)
- [ ] ইন্টারনেট সংযোগ (gradle dependencies ডাউনলোড করার জন্য)

---

## 📞 সহায়তা

যদি সমস্যা হয়:

1. **বিল্ড লগ পড়ুন** - সবসময় বিস্তারিত ত্রুটি বার্তা থাকে
2. **Gradle cache পরিষ্কার করুন:** `./gradlew clean`
3. **আবার চেষ্টা করুন:** `./gradlew assembleDebug`
4. **স্ট্যাক ট্রেস সহ চালান:** `./gradlew assembleDebug --stacktrace`

---

**সফলভাবে APK তৈরি করুন!** 🎉
