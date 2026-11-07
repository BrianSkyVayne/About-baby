package id.asistenbayi.app;

import android.content.Context;
import android.content.SharedPreferences;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

/**
 * Penyimpanan data pengetahuan di perangkat.
 * Data yang diperbarui disimpan di penyimpanan internal; bila belum ada, dipakai salinan bawaan APK.
 * Pemeriksaan isi (setiap fakta wajib bersumber) dilakukan oleh halaman sebelum memanggil {@link #save}.
 */
final class KnowledgeStore {
    private static final String FILE = "kb.json";
    private static final String BUNDLED = "www/kb.json";
    private static final String PREFS = "asisten-bayi";
    private static final String KEY_URL = "kb_url";

    private final Context context;

    KnowledgeStore(Context context) { this.context = context.getApplicationContext(); }

    /** Mengembalikan data paling baru antara salinan di perangkat dan salinan bawaan APK. */
    String read() {
        String bundled = "", saved = "";
        try { bundled = readAll(context.getAssets().open(BUNDLED)); } catch (IOException ignored) { }
        File f = new File(context.getFilesDir(), FILE);
        if (f.isFile()) {
            try { saved = readAll(new FileInputStream(f)); } catch (IOException ignored) { }
        }
        if (saved.isEmpty()) return bundled;
        return versionOf(saved).compareTo(versionOf(bundled)) >= 0 ? saved : bundled;
    }

    static String versionOf(String text) {
        try {
            return new JSONObject(text).getJSONObject("meta").optString("version", "");
        } catch (JSONException e) {
            return "";
        }
    }

    /** Menulis ke file sementara lalu mengganti, supaya data lama tidak rusak bila gagal di tengah jalan. */
    boolean save(String text) {
        if (text == null || text.isEmpty()) return false;
        File dir = context.getFilesDir();
        File tmp = new File(dir, FILE + ".tmp");
        try (FileOutputStream out = new FileOutputStream(tmp)) {
            out.write(text.getBytes(StandardCharsets.UTF_8));
            out.getFD().sync();
        } catch (IOException e) {
            tmp.delete();
            return false;
        }
        return tmp.renameTo(new File(dir, FILE));
    }

    String getUrl() { return prefs().getString(KEY_URL, ""); }

    void setUrl(String url) { prefs().edit().putString(KEY_URL, url == null ? "" : url.trim()).apply(); }

    private SharedPreferences prefs() { return context.getSharedPreferences(PREFS, Context.MODE_PRIVATE); }

    static String readAll(InputStream in) throws IOException {
        try (InputStream is = in; ByteArrayOutputStream buf = new ByteArrayOutputStream()) {
            byte[] b = new byte[16384];
            int n;
            while ((n = is.read(b)) != -1) buf.write(b, 0, n);
            return buf.toString("UTF-8");
        }
    }
}
