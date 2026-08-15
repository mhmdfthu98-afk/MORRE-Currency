package com.morre.currency;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.widget.ImageView;
import android.view.View;
import android.webkit.CookieManager;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import com.google.firebase.messaging.FirebaseMessaging;

import androidx.annotation.Nullable;
import androidx.webkit.WebViewAssetLoader;

public class MainActivity extends Activity {
    private WebView webView;
    private static final int NOTIFICATION_PERMISSION = 1001;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        getWindow().setStatusBarColor(0xFF0B1220);

        if (Build.VERSION.SDK_INT >= 23) {
            getWindow().getDecorView().setSystemUiVisibility(0);
        }

        // شاشة البداية
        ImageView splashImage = new ImageView(this);
        splashImage.setImageResource(R.drawable.morre_icon);
        splashImage.setScaleType(ImageView.ScaleType.CENTER_INSIDE);
        splashImage.setBackgroundColor(0xFF0B1220);

        setContentView(splashImage);

        // بعد ثانيتين نفتح التطبيق
        new Handler().postDelayed(() -> {

            webView = new WebView(this);
            setContentView(webView);

            configureWebView();

            webView.getSettings().setJavaScriptEnabled(true);

            webView.addJavascriptInterface(
                    new NativeBridge(),
                    "MORRENative"
            );

            webView.loadUrl(
                    "https://appassets.androidplatform.net/assets/index.html"
            );

            fetchAndExposeFcmToken();

            if (Build.VERSION.SDK_INT >= 33 &&
                    checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS)
                            != PackageManager.PERMISSION_GRANTED) {

                requestPermissions(
                        new String[]{Manifest.permission.POST_NOTIFICATIONS},
                        NOTIFICATION_PERMISSION
                );
            }

        }, 2000);
    }

    private void configureWebView() {
        WebSettings s = webView.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(false);
        s.setSupportZoom(false);
        s.setBuiltInZoomControls(false);
        s.setDisplayZoomControls(false);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setUserAgentString(
                s.getUserAgentString() + " MORRE-Currency-Android/1.0.0"
        );

        CookieManager.getInstance().setAcceptCookie(true);
        CookieManager.getInstance().setAcceptThirdPartyCookies(webView, true);

        final WebViewAssetLoader assetLoader =
                new WebViewAssetLoader.Builder()
                        .addPathHandler(
                                "/assets/",
                                new WebViewAssetLoader.AssetsPathHandler(this)
                        )
                        .build();

        webView.setWebViewClient(new WebViewClient() {

            @Nullable
            @Override
            public WebResourceResponse shouldInterceptRequest(
                    WebView view,
                    WebResourceRequest request
            ) {
                return assetLoader.shouldInterceptRequest(request.getUrl());
            }

            @Override
            public boolean shouldOverrideUrlLoading(
                    WebView view,
                    WebResourceRequest request
            ) {
                Uri uri = request.getUrl();
                String scheme = uri.getScheme();

                if (scheme != null &&
                        (scheme.equals("http") || scheme.equals("https"))) {

                    view.loadUrl(uri.toString());
                    return true;
                }

                try {
                    startActivity(
                            new Intent(Intent.ACTION_VIEW, uri)
                    );
                } catch (Exception ignored) {
                }

                return true;
            }
        });

        webView.setWebChromeClient(new WebChromeClient());
    }

    private void fetchAndExposeFcmToken() {
        FirebaseMessaging.getInstance().getToken().addOnCompleteListener(task -> {

            if (!task.isSuccessful()) return;

            String token = task.getResult();

            getSharedPreferences("morre_push", MODE_PRIVATE)
                    .edit()
                    .putString("fcm_token", token)
                    .apply();

            exposeTokenToWeb(token);
        });
    }

    private void exposeTokenToWeb(String token) {
        if (webView == null || token == null) return;

        String safe = token
                .replace("\\", "\\\\")
                .replace("'", "\\'");

        webView.post(() ->
                webView.evaluateJavascript(
                        "window.__MORRE_FCM_TOKEN__='" +
                                safe +
                                "';" +
                                "window.dispatchEvent(" +
                                "new Event('morre-fcm-token')" +
                                ");",
                        null
                )
        );
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    public class NativeBridge {

        @android.webkit.JavascriptInterface
        public String getFcmToken() {
            return getSharedPreferences(
                    "morre_push",
                    MODE_PRIVATE
            ).getString("fcm_token", "");
        }
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.loadUrl("about:blank");
            webView.destroy();
        }

        super.onDestroy();
    }
}
