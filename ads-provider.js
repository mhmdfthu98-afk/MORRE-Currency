// =============================================
// AD PROVIDER - AdMob Integration - الإصدار النهائي
// =============================================

import { ADS_CONFIG, CURRENT_ENV, ENV, AD_UNIT_IDS } from './ads-config.js';

class AdProvider {
    constructor() {
        this.isInitialized = false;
        this.config = ADS_CONFIG[CURRENT_ENV] || ADS_CONFIG[ENV.DEVELOPMENT];
        this.testMode = this.config.testMode;
        this.adUnits = {
            banner: this.config.banner || AD_UNIT_IDS.banner,
            interstitial: this.config.interstitial || AD_UNIT_IDS.interstitial,
            rewarded: this.config.rewarded || AD_UNIT_IDS.rewarded,
            native: this.config.native || AD_UNIT_IDS.native
        };
        this.callbacks = {
            onRewarded: null,
            onInterstitialClosed: null,
            onBannerLoaded: null
        };
    }

    // =========================================
    // INITIALIZATION
    // =========================================

    async init() {
        try {
            // تهيئة AdMob إذا كان متاحاً
            if (typeof window !== 'undefined') {
                if (window.AdMob) {
                    await window.AdMob.initialize();
                }
                console.log('✅ Ad Provider initialized (Test Mode:', this.testMode, ')');
            }
            this.isInitialized = true;
            return true;
        } catch (error) {
            console.warn('⚠️ Ad Provider init failed:', error);
            this.isInitialized = true;
            return false;
        }
    }

    // =========================================
    // BANNER
    // =========================================

    showBanner(placement = 'home') {
        try {
            console.log(`📢 Showing banner ad at: ${placement}`);
            
            // توزيع الحدث لتطبيق الإعلان
            if (typeof window !== 'undefined') {
                const event = new CustomEvent('ad_banner_shown', { 
                    detail: { placement, unitId: this.adUnits.banner, testMode: this.testMode }
                });
                window.dispatchEvent(event);
                
                // استدعاء callback
                if (this.callbacks.onBannerLoaded) {
                    this.callbacks.onBannerLoaded({ placement, unitId: this.adUnits.banner });
                }
            }
            return true;
        } catch (error) {
            console.error('❌ Failed to show banner:', error);
            return false;
        }
    }

    hideBanner() {
        try {
            console.log('📢 Hiding banner ad');
            if (typeof window !== 'undefined') {
                const event = new CustomEvent('ad_banner_hidden', {});
                window.dispatchEvent(event);
            }
            return true;
        } catch (error) {
            console.error('❌ Failed to hide banner:', error);
            return false;
        }
    }

    // =========================================
    // INTERSTITIAL
    // =========================================

    showInterstitial(placement = 'general') {
        return new Promise((resolve) => {
            try {
                console.log(`📢 Showing interstitial ad at: ${placement}`);
                
                if (typeof window !== 'undefined') {
                    const event = new CustomEvent('ad_interstitial_shown', { 
                        detail: { placement, unitId: this.adUnits.interstitial, testMode: this.testMode }
                    });
                    window.dispatchEvent(event);
                    
                    // محاكاة إغلاق الإعلان بعد 3-5 ثواني
                    const duration = this.testMode ? 1500 : 3000 + Math.random() * 2000;
                    setTimeout(() => {
                        const closeEvent = new CustomEvent('ad_interstitial_closed', {
                            detail: { placement }
                        });
                        window.dispatchEvent(closeEvent);
                        
                        if (this.callbacks.onInterstitialClosed) {
                            this.callbacks.onInterstitialClosed({ placement });
                        }
                        resolve(true);
                    }, duration);
                } else {
                    resolve(false);
                }
            } catch (error) {
                console.error('❌ Failed to show interstitial:', error);
                resolve(false);
            }
        });
    }

    // =========================================
    // REWARDED
    // =========================================

    showRewarded() {
        return new Promise((resolve) => {
            try {
                console.log('📢 Showing rewarded ad');
                
                if (typeof window !== 'undefined') {
                    const event = new CustomEvent('ad_rewarded_started', {});
                    window.dispatchEvent(event);
                    
                    // محاكاة إكمال الإعلان بعد 3-6 ثواني
                    const duration = this.testMode ? 2000 : 3000 + Math.random() * 3000;
                    setTimeout(() => {
                        const reward = Math.random() > 0.1; // 90% نجاح
                        if (reward) {
                            const completeEvent = new CustomEvent('ad_rewarded_completed', {});
                            window.dispatchEvent(completeEvent);
                            
                            if (this.callbacks.onRewarded) {
                                this.callbacks.onRewarded({ success: true });
                            }
                            resolve(true);
                        } else {
                            const failEvent = new CustomEvent('ad_rewarded_failed', {});
                            window.dispatchEvent(failEvent);
                            
                            if (this.callbacks.onRewarded) {
                                this.callbacks.onRewarded({ success: false });
                            }
                            resolve(false);
                        }
                    }, duration);
                } else {
                    resolve(false);
                }
            } catch (error) {
                console.error('❌ Failed to show rewarded ad:', error);
                resolve(false);
            }
        });
    }

    // =========================================
    // NATIVE
    // =========================================

    showNative(containerId, options = {}) {
        try {
            console.log(`📢 Showing native ad in: ${containerId}`);
            
            const container = document.getElementById(containerId);
            if (container) {
                const isTestMode = this.testMode;
                container.innerHTML = `
                    <div style="background: var(--card-bg); border-radius: 12px; padding: 16px; 
                         border: 1px solid var(--bg); text-align: center; position: relative;">
                        ${isTestMode ? '<div style="position:absolute; top:4px; left:8px; font-size:10px; color:var(--text-secondary); opacity:0.5;">🧪 TEST</div>' : ''}
                        <div style="font-size: 14px; color: var(--text-secondary); margin-bottom:4px;">${options.title || 'إعلان'}</div>
                        <div style="font-size: 18px; font-weight: 600; color: var(--primary);">
                            ${options.headline || 'MORRE Currency'}
                        </div>
                        <div style="font-size: 13px; color: var(--text-secondary); margin:4px 0 8px;">
                            ${options.description || 'تابع أسعار العملات لحظة بلحظة'}
                        </div>
                        <button style="padding: 8px 32px; background: var(--primary); 
                                color: white; border: none; border-radius: 8px; cursor: pointer;
                                transition: var(--transition);"
                                onclick="this.style.opacity='0.8'">
                            ${options.cta || 'تحميل التطبيق'}
                        </button>
                    </div>
                `;
            }
            return true;
        } catch (error) {
            console.error('❌ Failed to show native ad:', error);
            return false;
        }
    }

    // =========================================
    // CALLBACKS
    // =========================================

    on(event, callback) {
        if (event === 'rewarded') this.callbacks.onRewarded = callback;
        if (event === 'interstitialClosed') this.callbacks.onInterstitialClosed = callback;
        if (event === 'bannerLoaded') this.callbacks.onBannerLoaded = callback;
    }

    // =========================================
    // UTILITY
    // =========================================

    isTestMode() {
        return this.testMode;
    }

    getAdUnitId(type) {
        return this.adUnits[type] || null;
    }

    getEnvironment() {
        return CURRENT_ENV;
    }
}

// Singleton
const adProvider = new AdProvider();
export default adProvider;