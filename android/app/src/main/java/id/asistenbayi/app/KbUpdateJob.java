package id.asistenbayi.app;

import android.app.job.JobInfo;
import android.app.job.JobParameters;
import android.app.job.JobScheduler;
import android.app.job.JobService;
import android.content.ComponentName;
import android.content.Context;
import android.content.SharedPreferences;
import android.util.Base64;
import android.util.Log;

import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.Signature;
import java.security.spec.X509EncodedKeySpec;

/** Pembaruan data otomatis: tiap 24 jam (butuh jaringan, baterai tidak lemah) dan sekali saat aplikasi dibuka. */
public class KbUpdateJob extends JobService {
    static final String TAG = "KbUpdate";
    static final int JOB_ID = 7301;
    static final String DEFAULT_KB_URL = "https://raw.githubusercontent.com/BrianSkyVayne/About-baby/main/kb.json";
    /** Kunci publik SPKI base64 dari `node src/sign-kb.js genkey`. */
    static final String PUBLIC_KEY_B64 = "REPLACE_WITH_PUBLIC_KEY";
    private static final int MAX_BYTES = 5 * 1024 * 1024;
    private static final String PREFS = "asisten-bayi";
    private static final String KEY_ETAG = "kb_etag";

    private Thread worker;

    static void schedule(Context ctx) {
        JobScheduler js = (JobScheduler) ctx.getSystemService(Context.JOB_SCHEDULER_SERVICE);
        if (js == null) return;
        for (JobInfo j : js.getAllPendingJobs()) if (j.getId() == JOB_ID) return;
        JobInfo info = new JobInfo.Builder(JOB_ID, new ComponentName(ctx, KbUpdateJob.class))
                .setPeriodic(24L * 60 * 60 * 1000)
                .setRequiredNetworkType(JobInfo.NETWORK_TYPE_ANY)
                .setRequiresBatteryNotLow(true)
                .setPersisted(true)
                .build();
        js.schedule(info);
    }

    /** Sekali jalan di thread latar; dipanggil dari MainActivity saat dibuka. */
    static void checkNowAsync(Context ctx) {
        final Context app = ctx.getApplicationContext();
        new Thread(() -> runOnce(app), "kb-update").start();
    }

    @Override
    public boolean onStartJob(JobParameters params) {
        worker = new Thread(() -> {
            runOnce(getApplicationContext());
            jobFinished(params, false);
        }, "kb-update-job");
        worker.start();
        return true;
    }

    @Override
    public boolean onStopJob(JobParameters params) {
        if (worker != null) worker.interrupt();
        return true;
    }

    /** Mengembalikan true bila data baru tersimpan. */
    static synchronized boolean runOnce(Context ctx) {
        KnowledgeStore store = new KnowledgeStore(ctx);
        String userUrl = store.getUrl();
        boolean useDefault = userUrl == null || userUrl.isEmpty();
        String url = useDefault ? DEFAULT_KB_URL : userUrl;
        if (!url.startsWith("https://")) return false;
        boolean keyReady = !PUBLIC_KEY_B64.startsWith("REPLACE_");
        if (useDefault && !keyReady) { Log.w(TAG, "kunci publik belum diisi; pembaruan otomatis dari alamat bawaan ditolak"); return false; }
        SharedPreferences p = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        String etagKey = KEY_ETAG + ":" + url;
        HttpURLConnection con = null;
        try {
            con = open(url);
            String etag = p.getString(etagKey, "");
            if (!etag.isEmpty()) con.setRequestProperty("If-None-Match", etag);
            int code = con.getResponseCode();
            if (code == 304) return false;
            if (code != 200) { Log.w(TAG, "server menjawab " + code); return false; }
            byte[] body = readLimited(con.getInputStream());
            String newEtag = con.getHeaderField("ETag");
            con.disconnect(); con = null;

            if (keyReady) {
                byte[] sig = fetchSig(url + ".sig");
                if (sig == null || !verify(body, sig)) { Log.w(TAG, "tanda tangan tidak sah; data ditolak"); return false; }
            }
            String text = new String(body, StandardCharsets.UTF_8);
            String ver = new JSONObject(text).getJSONObject("meta").optString("version", "");
            String cur = KnowledgeStore.versionOf(store.read());
            if (ver.isEmpty() || compareVersion(ver, cur) <= 0) { saveEtag(p, etagKey, newEtag); return false; }
            if (!writeAtomic(ctx, body)) return false;
            saveEtag(p, etagKey, newEtag);
            Log.i(TAG, "data diperbarui ke versi " + ver);
            return true;
        } catch (Exception e) {
            Log.w(TAG, "pembaruan gagal: " + e.getClass().getSimpleName());
            return false;
        } finally {
            if (con != null) con.disconnect();
        }
    }

    private static void saveEtag(SharedPreferences p, String k, String v) {
        if (v != null && !v.isEmpty()) p.edit().putString(k, v).apply();
    }

    private static HttpURLConnection open(String url) throws IOException {
        HttpURLConnection con = (HttpURLConnection) new URL(url).openConnection();
        con.setConnectTimeout(15000);
        con.setReadTimeout(20000);
        con.setRequestProperty("Accept", "application/json, text/plain");
        return con;
    }

    private static byte[] fetchSig(String url) throws IOException {
        HttpURLConnection con = open(url);
        try {
            if (con.getResponseCode() != 200) return null;
            String b64 = new String(readLimited(con.getInputStream()), StandardCharsets.US_ASCII).trim();
            return Base64.decode(b64, Base64.DEFAULT);
        } catch (IllegalArgumentException e) {
            return null;
        } finally {
            con.disconnect();
        }
    }

    static boolean verify(byte[] data, byte[] sig) {
        try {
            PublicKey key = KeyFactory.getInstance("EC")
                    .generatePublic(new X509EncodedKeySpec(Base64.decode(PUBLIC_KEY_B64, Base64.DEFAULT)));
            Signature s = Signature.getInstance("SHA256withECDSA");
            s.initVerify(key);
            s.update(data);
            return s.verify(sig);
        } catch (Exception e) {
            return false;
        }
    }

    /** Bandingkan versi secara angka: dipecah pada '.' dan '-'. Bagian bukan angka dianggap 0. */
    static int compareVersion(String a, String b) {
        String[] x = a == null ? new String[0] : a.split("[.\\-]");
        String[] y = b == null ? new String[0] : b.split("[.\\-]");
        for (int i = 0; i < Math.max(x.length, y.length); i++) {
            long u = i < x.length ? num(x[i]) : 0, v = i < y.length ? num(y[i]) : 0;
            if (u != v) return u < v ? -1 : 1;
        }
        return 0;
    }

    private static long num(String s) {
        try { return Long.parseLong(s.trim()); } catch (NumberFormatException e) { return 0; }
    }

    private static byte[] readLimited(InputStream in) throws IOException {
        try (InputStream is = in; ByteArrayOutputStream buf = new ByteArrayOutputStream()) {
            byte[] b = new byte[16384];
            int n, total = 0;
            while ((n = is.read(b)) != -1) {
                total += n;
                if (total > MAX_BYTES) throw new IOException("terlalu besar");
                buf.write(b, 0, n);
            }
            return buf.toByteArray();
        }
    }

    /** Tulis ke kb.json.tmp, simpan salinan lama sebagai kb.prev.json, lalu ganti nama. */
    private static boolean writeAtomic(Context ctx, byte[] body) {
        File dir = ctx.getFilesDir();
        File tmp = new File(dir, "kb.json.tmp"), dst = new File(dir, "kb.json"), prev = new File(dir, "kb.prev.json");
        try (FileOutputStream out = new FileOutputStream(tmp)) {
            out.write(body);
            out.getFD().sync();
        } catch (IOException e) {
            tmp.delete();
            return false;
        }
        if (dst.isFile()) { prev.delete(); if (!dst.renameTo(prev)) { tmp.delete(); return false; } }
        if (tmp.renameTo(dst)) return true;
        prev.renameTo(dst);
        return false;
    }
}
