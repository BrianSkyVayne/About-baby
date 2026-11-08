package id.asistenbayi.app;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Insets;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.speech.RecognizerIntent;
import android.view.View;
import android.view.WindowInsets;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.util.ArrayList;

/**
 * Satu layar WebView yang menampilkan halaman yang sama dengan versi online,
 * dari aset aplikasi. Data dibaca lewat jembatan {@link KbBridge}.
 */
public class MainActivity extends Activity {

    static final String HOST = "appassets.androidplatform.net";
    static final String START_URL = "https://" + HOST + "/assets/www/index.html";
    static final int REQ_PICK = 41;
    static final int REQ_SPEECH = 42;

    private WebView webView;
    private View root;
    private Object backCb; // OnBackInvokedCallback, hanya terdaftar selama WebView masih punya riwayat
    private KbBridge bridge;
    private final AssetServer assets = new AssetServer(this);

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        webView = new WebView(this);
        // WebView mengabaikan padding miliknya sendiri, jadi ruang status bar/navigasi dipasang di pembungkus.
        android.widget.FrameLayout root = new android.widget.FrameLayout(this);
        root.setBackgroundColor(0xFFF4FBF9);
        root.addView(webView, new android.widget.FrameLayout.LayoutParams(-1, -1));
        this.root = root;
        setContentView(root);
        applySystemBarPadding(root);
        registerBack();

        WebSettings s = webView.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(false);
        s.setSupportMultipleWindows(false);

        bridge = new KbBridge(this, webView, new KnowledgeStore(this));
        webView.addJavascriptInterface(bridge, "AndroidKB");
        webView.setWebViewClient(new AppClient());

        if (savedInstanceState != null) webView.restoreState(savedInstanceState);
        else webView.loadUrl(START_URL);

        KbUpdateJob.schedule(this);
        if (savedInstanceState == null) KbUpdateJob.checkNowAsync(this);
    }

    /** Tautan ke luar aplikasi dibuka di peramban; aset aplikasi dilayani dari APK. */
    private class AppClient extends WebViewClient {
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            Uri uri = request.getUrl();
            if ("https".equals(uri.getScheme()) && HOST.equals(uri.getHost())) return false;
            // tel:, mailto:, wa.me, Google Maps, dan semua host lain dibuka di aplikasi luar.
            openExternal(uri.toString());
            return true;
        }

        @Override
        public void doUpdateVisitedHistory(WebView view, String url, boolean isReload) {
            updateBack();
        }

        @Override
        public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
            Uri uri = request.getUrl();
            if (!HOST.equals(uri.getHost())) return null;
            return assets.serve(uri.getPath());
        }
    }

    void openExternal(String url) {
        try {
            Uri u = Uri.parse(url);
            String action = "tel".equals(u.getScheme()) ? Intent.ACTION_DIAL : Intent.ACTION_VIEW;
            startActivity(new Intent(action, u));
        } catch (Exception ignored) {
            // Tidak ada aplikasi yang bisa membuka tautan ini.
        }
    }

    /** Android 15 menggambar sampai tepi layar; beri ruang untuk status bar dan navigasi. */
    private void applySystemBarPadding(View v) {
        v.setOnApplyWindowInsetsListener((view, insets) -> {
            if (Build.VERSION.SDK_INT >= 30) {
                Insets bars = insets.getInsets(WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout());
                view.setPadding(bars.left, bars.top, bars.right, bars.bottom);
            } else {
                view.setPadding(insets.getSystemWindowInsetLeft(), insets.getSystemWindowInsetTop(),
                        insets.getSystemWindowInsetRight(), insets.getSystemWindowInsetBottom());
            }
            return insets;
        });
    }

    /** Latar di balik status bar/navigasi dan warna ikonnya, menyamai tema halaman (warna = --md-sys-color-surface). */
    @SuppressWarnings("deprecation")
    void applyBars(boolean dark) {
        int bg = dark ? 0xFF0E1514 : 0xFFF4FBF9;
        root.setBackgroundColor(bg);
        getWindow().setStatusBarColor(bg);
        getWindow().setNavigationBarColor(bg);
        if (Build.VERSION.SDK_INT >= 30) {
            int light = android.view.WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS
                    | android.view.WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS;
            getWindow().getInsetsController().setSystemBarsAppearance(dark ? 0 : light, light);
        } else {
            View d = getWindow().getDecorView();
            int f = d.getSystemUiVisibility();
            int light = View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR | (Build.VERSION.SDK_INT >= 26 ? View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR : 0);
            d.setSystemUiVisibility(dark ? f & ~light : f | light);
        }
    }

    void startPicker() {
        Intent i = new Intent(Intent.ACTION_OPEN_DOCUMENT);
        i.addCategory(Intent.CATEGORY_OPENABLE);
        i.setType("*/*");
        i.putExtra(Intent.EXTRA_MIME_TYPES, new String[]{"application/json", "text/plain", "application/octet-stream"});
        startActivityForResult(i, REQ_PICK);
    }

    /** Membuka pengenal suara; false bila tidak ada aplikasi pengenal di perangkat. */
    boolean startSpeech() {
        Intent i = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        i.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
        i.putExtra(RecognizerIntent.EXTRA_LANGUAGE, "id-ID");
        i.putExtra(RecognizerIntent.EXTRA_PROMPT, "Silakan bicara");
        if (i.resolveActivity(getPackageManager()) == null) return false;
        try {
            startActivityForResult(i, REQ_SPEECH);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == REQ_SPEECH) {
            ArrayList<String> r = resultCode == RESULT_OK && data != null ? data.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS) : null;
            bridge.onSpeech(r != null && !r.isEmpty() ? r.get(0) : null);
            return;
        }
        if (requestCode == REQ_PICK) bridge.onFilePicked(resultCode == RESULT_OK && data != null ? data.getData() : null);
    }

    /** Android 13+ (API 33): back lewat OnBackInvokedCallback. Callback hanya dipasang selama halaman punya
     *  riwayat; di halaman pertama dilepas supaya sistem bisa menampilkan animasi predictive back ke layar utama. */
    private void registerBack() {
        updateBack();
    }

    void updateBack() {
        if (Build.VERSION.SDK_INT < 33 || webView == null) return;
        android.window.OnBackInvokedDispatcher d = getOnBackInvokedDispatcher();
        boolean want = webView.canGoBack();
        if (want && backCb == null) {
            android.window.OnBackInvokedCallback cb = this::handleBack;
            d.registerOnBackInvokedCallback(android.window.OnBackInvokedDispatcher.PRIORITY_DEFAULT, cb);
            backCb = cb;
        } else if (!want && backCb != null) {
            d.unregisterOnBackInvokedCallback((android.window.OnBackInvokedCallback) backCb);
            backCb = null;
        }
    }

    private void handleBack() {
        if (webView.canGoBack()) webView.goBack();
        else finish();
        updateBack();
    }

    /** Android 12 ke bawah tetap lewat jalur lama. */
    @Override
    @SuppressWarnings("deprecation")
    public void onBackPressed() {
        handleBack();
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        webView.saveState(outState);
    }

    @Override
    protected void onDestroy() {
        bridge.shutdown();
        webView.destroy();
        super.onDestroy();
    }
}
