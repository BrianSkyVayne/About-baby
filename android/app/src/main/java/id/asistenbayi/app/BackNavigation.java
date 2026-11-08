package id.asistenbayi.app;

import android.app.Activity;
import android.os.Build;
import android.webkit.WebView;
import android.window.OnBackInvokedCallback;
import android.window.OnBackInvokedDispatcher;

/**
 * Tombol kembali: mundur di riwayat halaman; bila sudah di awal, biarkan sistem menutup aplikasi.
 * Android 13+ memakai OnBackInvokedCallback (Android 16 tidak lagi memanggil onBackPressed
 * untuk aplikasi yang menargetkan API 36). Callback hanya didaftarkan saat halaman bisa mundur,
 * sehingga animasi "kembali ke beranda" bawaan sistem tetap berjalan.
 */
final class BackNavigation {
    private final Activity activity;
    private final WebView webView;
    private Object callback;
    private boolean registered;

    BackNavigation(Activity activity, WebView webView) {
        this.activity = activity;
        this.webView = webView;
        if (Build.VERSION.SDK_INT >= 33) {
            callback = (OnBackInvokedCallback) () -> {
                if (webView.canGoBack()) webView.goBack();
                update();
            };
        }
    }

    /** Dipanggil setiap riwayat halaman berubah. */
    void update() {
        if (Build.VERSION.SDK_INT < 33) return;
        boolean want = webView.canGoBack();
        if (want == registered) return;
        OnBackInvokedDispatcher d = activity.getOnBackInvokedDispatcher();
        if (want) d.registerOnBackInvokedCallback(OnBackInvokedDispatcher.PRIORITY_DEFAULT, (OnBackInvokedCallback) callback);
        else d.unregisterOnBackInvokedCallback((OnBackInvokedCallback) callback);
        registered = want;
    }

    /** Untuk Android 12 ke bawah, dipanggil dari onBackPressed. */
    boolean handleLegacy() {
        if (webView.canGoBack()) { webView.goBack(); return true; }
        return false;
    }
}
