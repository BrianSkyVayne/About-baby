package id.asistenbayi.app;

import android.app.Activity;
import android.util.DisplayMetrics;
import android.view.View;
import android.widget.FrameLayout;

import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.AdSize;
import com.google.android.gms.ads.AdView;
import com.google.android.gms.ads.MobileAds;

/**
 * Banner AdMob di bawah layar. Halaman yang menentukan kapan banner boleh tampil:
 * hanya di layar yang dibuka saat tenang (panduan, perkembangan, imunisasi), tidak pernah
 * di beranda, cek gejala, atau hitung napas.
 */
final class AdController {
    private final Activity activity;
    private final FrameLayout container;
    private AdView adView;
    private boolean initialized;
    private boolean allowed;

    AdController(Activity activity, FrameLayout container) {
        this.activity = activity;
        this.container = container;
        container.setVisibility(View.GONE);
    }

    void init() {
        new Thread(() -> MobileAds.initialize(activity, status -> activity.runOnUiThread(() -> {
            initialized = true;
            apply();
        }))).start();
    }

    /** Dipanggil dari halaman setiap kali layar berganti. */
    void setAllowed(boolean value) {
        allowed = value;
        activity.runOnUiThread(this::apply);
    }

    private void apply() {
        if (!allowed || !initialized) {
            container.setVisibility(View.GONE);
            return;
        }
        if (adView == null) {
            adView = new AdView(activity);
            adView.setAdUnitId(BuildConfig.ADMOB_BANNER_ID);
            adView.setAdSize(bannerSize());
            container.addView(adView);
            adView.loadAd(new AdRequest.Builder().build());
        }
        container.setVisibility(View.VISIBLE);
    }

    private AdSize bannerSize() {
        DisplayMetrics m = activity.getResources().getDisplayMetrics();
        int widthDp = (int) (m.widthPixels / m.density);
        return AdSize.getLargeAnchoredAdaptiveBannerAdSize(activity, widthDp);
    }

    void pause() { if (adView != null) adView.pause(); }

    void resume() { if (adView != null) adView.resume(); }

    void destroy() { if (adView != null) adView.destroy(); }
}
