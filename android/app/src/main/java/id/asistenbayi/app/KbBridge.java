package id.asistenbayi.app;

import android.net.Uri;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;

import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Jembatan JavaScript bernama "AndroidKB".
 * Metode sinkron mengembalikan nilai langsung; metode asinkron memanggil
 * window.__androidCb(id, ok, teks) di halaman ketika selesai.
 */
final class KbBridge {
    private static final int MAX_BYTES = 5 * 1024 * 1024;

    private final MainActivity activity;
    private final WebView webView;
    private final KnowledgeStore store;
    private final AdController ads;
    private final TipController tips;
    private final ExecutorService io = Executors.newSingleThreadExecutor();
    private int pendingPickId = -1;

    KbBridge(MainActivity activity, WebView webView, KnowledgeStore store, AdController ads, TipController tips) {
        this.activity = activity;
        this.webView = webView;
        this.store = store;
        this.ads = ads;
        this.tips = tips;
    }

    /** Halaman memberi tahu apakah layar saat ini boleh menampilkan banner. */
    @JavascriptInterface public void setAdsAllowed(boolean allowed) { ads.setAllowed(allowed); }

    @JavascriptInterface public boolean canTip() { return tips.isReady(); }

    @JavascriptInterface public String tipPrice() { return tips.price(); }

    @JavascriptInterface public void tip(int id) { tips.launch((ok, message) -> callback(id, ok, message)); }

    @JavascriptInterface public String appVersion() { return BuildConfig.VERSION_NAME; }

    @JavascriptInterface public String getKb() { return store.read(); }

    @JavascriptInterface public boolean save(String text) { return store.save(text); }

    @JavascriptInterface public String getUrl() { return store.getUrl(); }

    @JavascriptInterface public void setUrl(String url) { store.setUrl(url); }

    @JavascriptInterface public void openUrl(String url) {
        activity.runOnUiThread(() -> activity.openExternal(url));
    }

    /** Mengambil file data dari alamat https. */
    @JavascriptInterface public void fetchText(String url, int id) {
        io.execute(() -> {
            if (url == null || !url.startsWith("https://")) { callback(id, false, "Alamat harus diawali https://"); return; }
            HttpURLConnection con = null;
            try {
                con = (HttpURLConnection) new URL(url).openConnection();
                con.setConnectTimeout(15000);
                con.setReadTimeout(20000);
                con.setRequestProperty("Accept", "application/json, text/plain");
                int code = con.getResponseCode();
                if (code != 200) { callback(id, false, "server menjawab " + code); return; }
                if (con.getContentLength() > MAX_BYTES) { callback(id, false, "file terlalu besar"); return; }
                callback(id, true, KnowledgeStore.readAll(con.getInputStream()));
            } catch (IOException e) {
                callback(id, false, "tidak ada koneksi atau alamat salah");
            } finally {
                if (con != null) con.disconnect();
            }
        });
    }

    /** Membuka pemilih file; hasilnya diteruskan lewat {@link #onFilePicked}. */
    @JavascriptInterface public void pickFile(int id) {
        activity.runOnUiThread(() -> {
            if (pendingPickId != -1) callback(pendingPickId, false, "");
            pendingPickId = id;
            try {
                activity.startPicker();
            } catch (Exception e) {
                pendingPickId = -1;
                callback(id, false, "Pemilih file tidak tersedia di perangkat ini.");
            }
        });
    }

    void onFilePicked(Uri uri) {
        final int id = pendingPickId;
        pendingPickId = -1;
        if (id == -1) return;
        if (uri == null) { callback(id, false, ""); return; }
        io.execute(() -> {
            try (InputStream in = activity.getContentResolver().openInputStream(uri)) {
                if (in == null) { callback(id, false, "File tidak bisa dibuka."); return; }
                callback(id, true, KnowledgeStore.readAll(in));
            } catch (IOException | SecurityException e) {
                callback(id, false, "File tidak bisa dibaca.");
            }
        });
    }

    private void callback(int id, boolean ok, String text) {
        final String js = "window.__androidCb && window.__androidCb(" + id + "," + ok + "," + JSONObject.quote(text == null ? "" : text) + ")";
        webView.post(() -> webView.evaluateJavascript(js, null));
    }

    void shutdown() { io.shutdownNow(); }
}
