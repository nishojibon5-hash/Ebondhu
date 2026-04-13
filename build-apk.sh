#!/bin/bash

# amarcash APK Build Helper Script
# এই স্ক্রিপ্টটি সম্পূর্ণ APK বিল্ড প্রক্রিয়া স্বয়ংক্রিয় করে

set -e

# রঙিন আউটপুট
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# লগিং ফাংশন
log_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

log_success() {
    echo -e "${GREEN}✓${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# প্রধান মেনু
show_menu() {
    echo ""
    echo -e "${BLUE}======================================${NC}"
    echo -e "${BLUE}   amarcash APK Builder${NC}"
    echo -e "${BLUE}======================================${NC}"
    echo ""
    echo "আপনার পছন্দ নির্বাচন করুন:"
    echo ""
    echo "1) Debug APK তৈরি করুন (Fast)"
    echo "2) Release APK তৈরি করুন (Optimized)"
    echo "3) সম্পূর্ণ পুনর্নির্মাণ (Clean Build)"
    echo "4) শুধুমাত্র ওয়েব বিল্ড"
    echo "5) Android সিঙ্ক করুন"
    echo "6) পরিবেশ পরীক্ষা করুন"
    echo "7) Exit"
    echo ""
    echo -n "আপনার পছন্দ লিখুন (1-7): "
}

# পরিবেশ পরীক্ষা করুন
check_environment() {
    log_info "পরিবেশ পরীক্ষা করছি..."
    
    local issues=0
    
    # Java চেক করুন
    if command -v java &> /dev/null; then
        java_version=$(java -version 2>&1 | head -1)
        log_success "Java: $java_version"
    else
        log_error "Java পাওয়া যায়নি। Java 17+ ইনস্টল করুন।"
        issues=$((issues + 1))
    fi
    
    # Node চেক করুন
    if command -v node &> /dev/null; then
        node_version=$(node --version)
        log_success "Node.js: $node_version"
    else
        log_error "Node.js পাওয়া যায়নি। Node.js 18+ ইনস্টল করুন।"
        issues=$((issues + 1))
    fi
    
    # pnpm চেক করুন
    if command -v pnpm &> /dev/null; then
        pnpm_version=$(pnpm --version)
        log_success "pnpm: $pnpm_version"
    else
        log_warning "pnpm পাওয়া যায়নি। npm install -g pnpm চালান"
    fi
    
    # Android SDK চেক করুন
    if [ -n "$ANDROID_HOME" ] && [ -d "$ANDROID_HOME" ]; then
        log_success "ANDROID_HOME: $ANDROID_HOME"
    else
        log_error "ANDROID_HOME সেট করা নেই। Android SDK ইনস্টল করুন।"
        issues=$((issues + 1))
    fi
    
    # dist/spa চেক করুন
    if [ -d "dist/spa" ]; then
        log_success "Web build পাওয়া যায়েছে (dist/spa)"
    else
        log_warning "Web build পাওয়া যায় না। build-apk.sh এ '4' চয়ন করুন।"
    fi
    
    # android চেক করুন
    if [ -d "android" ]; then
        log_success "Android প্রজেক্ট পাওয়া যায়েছে"
    else
        log_warning "Android প্রজেক্ট পাওয়া যায় না। ইনিশিয়ালাইজ করা প্রয়োজন।"
    fi
    
    if [ $issues -gt 0 ]; then
        log_error "$issues সমস্যা পাওয়া গেছে"
        return 1
    else
        log_success "সব চেক সফল"
        return 0
    fi
}

# ওয়েব বিল্ড করুন
build_web() {
    log_info "ওয়েব অ্যাপ্লিকেশন বিল্ড করছি..."
    
    if ! npm run build:client; then
        log_error "ওয়েব বিল্ড ব্যর্থ"
        return 1
    fi
    
    if [ ! -d "dist/spa" ]; then
        log_error "dist/spa ডিরেক্টরি তৈরি হয়নি"
        return 1
    fi
    
    log_success "ওয়েব বিল্ড সম্পূর্ণ"
    return 0
}

# Android প্ল্যাটফর্ম যোগ করুন
add_android() {
    log_info "Android প্ল্যাটফর্ম যোগ করছি..."
    
    if [ ! -d "android" ]; then
        npx @capacitor/cli@latest add android
        log_success "Android প্ল্যাটফর্ম যোগ হয়েছে"
    else
        log_warning "Android প্ল্যাটফর্ম ইতিমধ্যে বিদ্যমান"
    fi
}

# Android সিঙ্ক করুন
sync_android() {
    log_info "Android প্রজেক্ট সিঙ্ক করছি..."
    
    if [ ! -d "android" ]; then
        log_error "Android প্রজেক্ট পাওয়া যায় না। প্রথমে যোগ করুন।"
        add_android
    fi
    
    npx @capacitor/cli@latest sync android
    
    # gradlew permissions সেট করুন
    if [ -f "android/gradlew" ]; then
        chmod +x android/gradlew
        log_success "Gradlew permissions সেট হয়েছে"
    fi
    
    log_success "Android সিঙ্ক সম্পূর্ণ"
}

# Debug APK বিল্ড করুন
build_debug_apk() {
    log_info "Debug APK তৈরি করছি..."
    
    if [ ! -d "dist/spa" ]; then
        log_warning "ওয়েব বিল্ড পাওয়া যায় না। প্রথমে বিল্ড করুন।"
        build_web || return 1
    fi
    
    if [ ! -d "android" ]; then
        log_warning "Android প্রজেক্ট পাওয়া যায় না। যোগ করুন।"
        add_android
    fi
    
    sync_android
    
    cd android
    
    log_info "Gradle assembleDebug চালাচ্ছি..."
    echo ""
    echo "⏳ এটি 5-15 মিনিট সময় লাগতে পারে..."
    echo ""
    
    ./gradlew assembleDebug --stacktrace
    
    if [ $? -eq 0 ]; then
        APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
        if [ -f "$APK_PATH" ]; then
            APK_SIZE=$(ls -lh "$APK_PATH" | awk '{print $5}')
            log_success "Debug APK তৈরি সফল!"
            echo ""
            echo "📦 APK বিবরণ:"
            echo "   পাথ: $APK_PATH"
            echo "   সাইজ: $APK_SIZE"
            echo ""
            echo "🔗 Android ডিভাইসে ইনস্টল করতে:"
            echo "   adb install -r \"$APK_PATH\""
        else
            log_error "APK ফাইল পাওয়া যায় না"
            return 1
        fi
    else
        log_error "Debug APK বিল্ড ব্যর্থ"
        return 1
    fi
    
    cd - > /dev/null
}

# Release APK বিল্ড করুন
build_release_apk() {
    log_info "Release APK তৈরি করছি..."
    
    if [ ! -d "dist/spa" ]; then
        log_warning "ওয়েব বিল্ড পাওয়া যায় না। প্রথমে বিল্ড করুন।"
        build_web || return 1
    fi
    
    if [ ! -d "android" ]; then
        log_warning "Android প্রজেক্ট পাওয়া যায় না। যোগ করুন।"
        add_android
    fi
    
    sync_android
    
    cd android
    
    log_info "Gradle assembleRelease চালাচ্ছি..."
    echo ""
    echo "⏳ এটি 10-20 মিনিট সময় লাগতে পারে..."
    echo ""
    
    ./gradlew assembleRelease --stacktrace 2>&1 || {
        log_warning "Release বিল্ড ব্যর্থ, Debug দিয়ে চেষ্টা করছি..."
        ./gradlew assembleDebug --stacktrace
    }
    
    if [ $? -eq 0 ]; then
        if [ -f "app/build/outputs/apk/release/app-release.apk" ]; then
            APK_PATH="app/build/outputs/apk/release/app-release.apk"
        elif [ -f "app/build/outputs/apk/debug/app-debug.apk" ]; then
            APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
        else
            log_error "APK ফাইল পাওয়া যায় না"
            cd - > /dev/null
            return 1
        fi
        
        APK_SIZE=$(ls -lh "$APK_PATH" | awk '{print $5}')
        log_success "APK তৈরি সফল!"
        echo ""
        echo "📦 APK বিবরণ:"
        echo "   পাথ: $APK_PATH"
        echo "   সাইজ: $APK_SIZE"
    else
        log_error "Release APK বিল্ড ব্যর্থ"
        cd - > /dev/null
        return 1
    fi
    
    cd - > /dev/null
}

# সম্পূর্ণ পুনর্নির্মাণ
clean_build() {
    log_info "সম্পূর্ণ পুনর্নির্মাণ শুরু করছি..."
    
    if [ -d "android" ]; then
        log_info "Gradle cache পরিষ্কার করছি..."
        cd android
        ./gradlew clean
        cd - > /dev/null
    fi
    
    log_info "ওয়েব বিল্ড পুনর্নির্মাণ করছি..."
    rm -rf dist/spa
    build_web || return 1
    
    log_info "Android সিঙ্ক করছি..."
    sync_android || return 1
    
    log_success "পুনর্নির্মাণ সম্পূর্ণ"
}

# মূল স্ক্রিপ্ট লুপ
main() {
    while true; do
        show_menu
        read -r choice
        
        case $choice in
            1)
                echo ""
                build_debug_apk
                ;;
            2)
                echo ""
                build_release_apk
                ;;
            3)
                echo ""
                clean_build
                ;;
            4)
                echo ""
                build_web
                ;;
            5)
                echo ""
                sync_android
                ;;
            6)
                echo ""
                check_environment
                ;;
            7)
                log_info "বিদায়!"
                exit 0
                ;;
            *)
                log_error "অবৈধ পছন্দ। 1-7 এর মধ্যে নির্বাচন করুন।"
                ;;
        esac
        
        echo ""
        echo -n "Enter চাপ পরবর্তী কমান্ড চালাতে..."
        read -r
    done
}

# স্ক্রিপ্ট শুরু করুন
main
