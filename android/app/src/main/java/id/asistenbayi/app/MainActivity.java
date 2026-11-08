package id.asistenbayi.app;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Insets;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.WindowInsets;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.LinearLayout;

/**
 * Satu layar WebView yang menampilkan halaman yang sama dengan versi online,
 * dari aset aplikasi. Data dibaca lewat jembatan {@link KbBridge}.
 */
public class MainActivity extends Activity {

    static final String HOST = "appassets.androidplatform.net";
    static final String START_URL = "https://" + HOST + "/assets/www/index.html";
    static final int REQ_PICK = 41;

    private WebView webView;
    private KbBridge bridge;
    private AdController ads;
    private TipController tips;
    private BackNavigation back;
    private final AssetServer assets = new AssetServer(this);

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        webView = new WebView(this);
        root.addView(webView, new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, 0, 1f));
        FrameLayout adBox = new FrameLayout(this);
        root.addView(adBox, new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT));
        setContentView(root);
        applySystemBarPadding(root);

        ads = new AdController(this, adBox);
        ads.init();
        tips = new TipController(this);
        tips.connect();

        WebSettings s = webView.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(false);
        s.setSupportMultipleWindows(false);

        bridge = new KbBridge(this, webView, new KnowledgeStore(this), ads, tips);
        webView.addJavascriptInterface(bridge, "AndroidKB");
        back = new BackNavigation(this, webView);
        webView.setWebViewClient(new AppClient());

        if (savedInstanceState != null) webView.restoreState(savedInstanceState);
        else webView.loadUrl(START_URL);
    }

    /** Tautan ke luar aplikasi dibuka di peramban; aset aplikasi dilayani dari APK. */
    private class AppClient extends WebViewClient {
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            Uri uri = request.getUrl();
            if (HOST.equals(uri.getHost())) return false;
            openExternal(uri.toString());
            return true;
        }

        @Override
        public void doUpdateVisitedHistory(WebView view, String url, boolean isReload) {
            back.update();
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
            startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url)));
        } catch (Exception ignored) {
            // Tidak ada aplikasi yang bisa membuka tautan ini.
        }
    }

    /** Android 15 menggambar sampai tepi layar; beri ruang untuk status bar dan navigasi. */
    @SuppressWarnings("deprecation")
    private void applySystemBarPadding(View v) {
        v.setOnApplyWindowInsetsListener((view, insets) -> {
            if (Build.VERSION.SDK_INT >= 30) {
                Insets bars = insets.getInsets(WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout());
                view.setPadding(bars.left, bars.top, bars.right, bars.bottom);
            } else {
                //noinspection deprecation
                view.setPadding(insets.getSystemWindowInsetLeft(), insets.getSystemWindowInsetTop(),
                        insets.getSystemWindowInsetRight(), insets.getSystemWindowInsetBottom());
            }
            return insets;
        });
    }

    void startPicker() {
        Intent i = new Intent(Intent.ACTION_OPEN_DOCUMENT);
        i.addCategory(Intent.CATEGORY_OPENABLE);
        i.setType("*/*");
        i.putExtra(Intent.EXTRA_MIME_TYPES, new String[]{"application/json", "text/plain", "application/octet-stream"});
        startActivityForResult(i, REQ_PICK);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == REQ_PICK) bridge.onFilePicked(resultCode == RESULT_OK && data != null ? data.getData() : null);
    }

    /** Hanya dipakai di Android 12 ke bawah; versi baru memakai {@link BackNavigation}. */
    @Override
    @SuppressWarnings("deprecation")
    public void onBackPressed() {
        if (!back.handleLegacy()) super.onBackPressed();
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        webView.saveState(outState);
    }

    @Override
    protected void onPause() {
        ads.pause();
        super.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        ads.resume();
    }

    @Override
    protected void onDestroy() {
        ads.destroy();
        tips.destroy();
        bridge.shutdown();
        webView.destroy();
        super.onDestroy();
    }
}
