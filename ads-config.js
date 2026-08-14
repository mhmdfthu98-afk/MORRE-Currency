// =============================================
// ADS CONFIGURATION - الإصدار النهائي
// =============================================

// بيئة التشغيل
export const ENV = {
    DEVELOPMENT: 'development',
    STAGING: 'staging',
    PRODUCTION: 'production'
};

// الإعدادات الحالية
export const CURRENT_ENV = 
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.includes('netlify.app') ||
    window.location.hostname.includes('vercel.app')
    ? ENV.DEVELOPMENT 
    : ENV.PRODUCTION;

// إعدادات الإعلانات حسب البيئة
export const ADS_CONFIG = {
    [ENV.DEVELOPMENT]: {
        // Test Ad Unit IDs (Google Test IDs)
        banner: 'ca-app-pub-3940256099942544/6300978111',
        interstitial: 'ca-app-pub-3940256099942544/1033173712',
        rewarded: 'ca-app-pub-3940256099942544/5224354917',
        native: 'ca-app-pub-3940256099942544/2247696110',
        testMode: true,
        enabled: true
    },
    [ENV.STAGING]: {
        banner: 'ca-app-pub-3940256099942544/6300978111',
        interstitial: 'ca-app-pub-3940256099942544/1033173712',
        rewarded: 'ca-app-pub-3940256099942544/5224354917',
        native: 'ca-app-pub-3940256099942544/2247696110',
        testMode: true,
        enabled: true
    },
    [ENV.PRODUCTION]: {
        banner: 'ca-app-pub-3940256099942544/6300978111',
        interstitial: 'ca-app-pub-3940256099942544/1033173712',
        rewarded: 'ca-app-pub-3940256099942544/5224354917',
        native: 'ca-app-pub-3940256099942544/2247696110',
        testMode: false,
        enabled: false
    }
};

// الإعدادات الافتراضية الآمنة
export const DEFAULT_ADS_SETTINGS = {
    enabled: false,
    bannerEnabled: true,
    interstitialEnabled: true,
    rewardedEnabled: false,
    nativeEnabled: false,
    cooldownSeconds: 60,
    dailyLimit: 5,
    sessionLimit: 3,
    placements: {
        home: true,
        rates: true,
        converter: false,
        currencyDetails: true,
        news: true
    },
    frequencyCap: {
        impressionsPerHour: 10,
        impressionsPerDay: 20
    }
};

// أزرار الكميات السريعة للمحول
export const QUICK_AMOUNTS = [100, 500, 1000, 5000, 10000, 50000, 100000];

// العملات السريعة للمحول
export const QUICK_CURRENCIES = ['USD', 'EUR', 'SAR', 'AED', 'EGP', 'GBP', 'ETB'];

// إعدادات الإعلانات الافتراضية
export const AD_UNIT_IDS = {
    banner: 'ca-app-pub-3940256099942544/6300978111',
    interstitial: 'ca-app-pub-3940256099942544/1033173712',
    rewarded: 'ca-app-pub-3940256099942544/5224354917',
    native: 'ca-app-pub-3940256099942544/2247696110'
};