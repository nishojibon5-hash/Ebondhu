@echo off
REM amarcash APK Build Helper Script for Windows
REM এই স্ক্রিপ্টটি Windows এ APK বিল্ড করতে সাহায্য করে

setlocal enabledelayedexpansion

REM রঙিন আউটপুট (Windows 10+)
set "GREEN=[92m"
set "RED=[91m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "NC=[0m"

:show_menu
cls
echo.
echo ===============================================
echo    amarcash APK Builder (Windows)
echo ===============================================
echo.
echo আপনার পছন্দ নির্বাচন করুন:
echo.
echo 1) Debug APK তৈরি করুন (Fast)
echo 2) Release APK তৈরি করুন (Optimized)
echo 3) সম্পূর্ণ পুনর্নির্মাণ (Clean Build)
echo 4) শুধুমাত্র ওয়েব বিল্ড
echo 5) Android সিঙ্ক করুন
echo 6) পরিবেশ পরীক্ষা করুন
echo 7) Exit
echo.
set /p choice="আপনার পছন্দ লিখুন (1-7): "

if "%choice%"=="1" goto build_debug
if "%choice%"=="2" goto build_release
if "%choice%"=="3" goto clean_build
if "%choice%"=="4" goto build_web
if "%choice%"=="5" goto sync_android
if "%choice%"=="6" goto check_environment
if "%choice%"=="7" goto exit_script
goto invalid_choice

:check_environment
cls
echo.
echo পরিবেশ পরীক্ষা করছি...
echo.

REM Java চেক করুন
java -version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('java -version 2^>^&1') do (
        echo ✓ Java: %%i
        goto check_node
    )
) else (
    echo ✗ Java পাওয়া যায়নি। Java 17+ ইনস্টল করুন।
)

:check_node
node --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('node --version') do echo ✓ Node.js: %%i
) else (
    echo ✗ Node.js পাওয়া যায়নি। Node.js 18+ ইনস্টল করুন।
)

REM pnpm চেক করুন
pnpm --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('pnpm --version') do echo ✓ pnpm: %%i
) else (
    echo ⚠ pnpm পাওয়া যায়নি। npm install -g pnpm চালান
)

REM ANDROID_HOME চেক করুন
if defined ANDROID_HOME (
    echo ✓ ANDROID_HOME: %ANDROID_HOME%
) else (
    echo ✗ ANDROID_HOME সেট করা নেই। Android SDK ইনস্টল করুন।
)

REM dist/spa চেক করুন
if exist "dist\spa" (
    echo ✓ Web build পাওয়া যায়েছে
) else (
    echo ⚠ Web build পাওয়া যায় না। পহিলে বিল্ড করুন।
)

REM android চেক করুন
if exist "android" (
    echo ✓ Android প্রজেক্ট পাওয়া যায়েছে
) else (
    echo ⚠ Android প্রজেক্ট পাওয়া যায় না। ইনিশিয়ালাইজ করা প্রয়োজন।
)

echo.
pause
goto show_menu

:build_web
cls
echo.
echo ওয়েব অ্যাপ্লিকেশন বিল্ড করছি...
echo.
call npm run build:client
if errorlevel 1 (
    echo ✗ ওয়েব বিল্ড ব্যর্থ
    pause
    goto show_menu
)
if not exist "dist\spa" (
    echo ✗ dist\spa ডিরেক্টরি তৈরি হয়নি
    pause
    goto show_menu
)
echo ✓ ওয়েব বিল্ড সম্পূর্ণ
pause
goto show_menu

:sync_android
cls
echo.
echo Android প্রজেক্ট সিঙ্ক করছি...
echo.

if not exist "android" (
    echo ⚠ Android প্রজেক্ট পাওয়া যায় না। যোগ করছি...
    call npx @capacitor/cli@latest add android
)

call npx @capacitor/cli@latest sync android
if errorlevel 1 (
    echo ✗ সিঙ্ক ব্যর্থ
    pause
    goto show_menu
)

if exist "android\gradlew.bat" (
    echo ✓ Gradlew পাওয়া যায়েছে
) else (
    echo ⚠ Windows Gradlew প্রয়োজন
)

echo ✓ Android সিঙ্ক সম্পূর্ণ
pause
goto show_menu

:build_debug
cls
echo.
echo Debug APK তৈরি করছি...
echo.

if not exist "dist\spa" (
    echo ⚠ ওয়েব বিল্ড পাওয়া যায় না। প্রথমে বিল্ড করুন।
    call npm run build:client
)

if not exist "android" (
    echo ⚠ Android প্রজেক্ট পাওয়া যায় না। যোগ করছি...
    call npx @capacitor/cli@latest add android
)

call npx @capacitor/cli@latest sync android

cd android

echo.
echo ⏳ Gradle assembleDebug চালাচ্ছি...
echo এটি 5-15 মিনিট সময় লাগতে পারে...
echo.

call gradlew.bat assembleDebug --stacktrace
if errorlevel 1 (
    echo ✗ Debug APK বিল্ড ব্যর্থ
    cd ..
    pause
    goto show_menu
)

if exist "app\build\outputs\apk\debug\app-debug.apk" (
    echo.
    echo ✓ Debug APK তৈরি সফল!
    echo.
    echo 📦 APK বিবরণ:
    echo    পাথ: app\build\outputs\apk\debug\app-debug.apk
    echo.
    echo 🔗 Android ডিভাইসে ইনস্টল করতে:
    echo    adb install -r "app\build\outputs\apk\debug\app-debug.apk"
) else (
    echo ✗ APK ফাইল পাওয়া যায় না
)

cd ..
pause
goto show_menu

:build_release
cls
echo.
echo Release APK তৈরি করছি...
echo.

if not exist "dist\spa" (
    echo ⚠ ওয়েব বিল্ড পাওয়া যায় না। প্রথমে বিল্ড করুন।
    call npm run build:client
)

if not exist "android" (
    echo ⚠ Android প্রজেক্ট পাওয়া যায় না। যোগ করছি...
    call npx @capacitor/cli@latest add android
)

call npx @capacitor/cli@latest sync android

cd android

echo.
echo ⏳ Gradle assembleRelease চালাচ্ছি...
echo এটি 10-20 মিনিট সময় লাগতে পারে...
echo.

call gradlew.bat assembleRelease --stacktrace
if errorlevel 1 (
    echo ⚠ Release বিল্ড ব্যর্থ, Debug দিয়ে চেষ্টা করছি...
    call gradlew.bat assembleDebug --stacktrace
)

if exist "app\build\outputs\apk\release\app-release.apk" (
    echo.
    echo ✓ Release APK তৈরি সফল!
    echo    পাথ: app\build\outputs\apk\release\app-release.apk
) else if exist "app\build\outputs\apk\debug\app-debug.apk" (
    echo.
    echo ✓ Debug APK তৈরি সফল!
    echo    পাথ: app\build\outputs\apk\debug\app-debug.apk
) else (
    echo ✗ APK ফাইল পাওয়া যায় না
)

cd ..
pause
goto show_menu

:clean_build
cls
echo.
echo সম্পূর্ণ পুনর্নির্মাণ শুরু করছি...
echo.

if exist "android" (
    echo Gradle cache পরিষ্কার করছি...
    cd android
    call gradlew.bat clean
    cd ..
)

echo ওয়েব বিল্ড পুনর্নির্মাণ করছি...
if exist "dist\spa" rmdir /s /q "dist\spa"
call npm run build:client

echo Android সিঙ্ক করছি...
call npx @capacitor/cli@latest sync android

echo.
echo ✓ পুনর্নির্মাণ সম্পূর্ণ
pause
goto show_menu

:invalid_choice
cls
echo.
echo ✗ অবৈধ পছন্দ। 1-7 এর মধ্যে নির্বাচন করুন।
echo.
pause
goto show_menu

:exit_script
echo.
echo বিদায়!
echo.
endlocal
exit /b 0
