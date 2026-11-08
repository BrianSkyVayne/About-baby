# Asisten Bayi

Cek gejala bayi dan anak, panduan, perkembangan, imunisasi, dan keamanan obat.
Setiap fakta punya sumber (WHO, IDAI, Kemenkes, AAP, CDC, FDA). Hasil berupa kemungkinan, bukan vonis.

Ada tiga cara memakai tampilan yang sama:

| Versi | Data | Tanya Claude & setujui usulan |
|---|---|---|
| Online (artifak claude.ai) | Database online, diperbarui lewat usulan bulanan | Ya |
| `offline.html` | Tertanam di file; bisa impor file data baru | Tidak |
| Aplikasi Android (APK) | Tersimpan di HP; bisa impor file atau ambil dari alamat https | Tidak |

## Membuat APK

**Lewat GitHub (tanpa memasang apa pun):**
1. Buat repositori baru di GitHub, unggah seluruh isi folder ini (termasuk folder `.github`).
2. Buka tab **Actions** → **Build APK** → **Run workflow**.
3. Setelah selesai (sekitar 5 menit), unduh `asisten-bayi-apk` di bagian *Artifacts*, ekstrak, lalu pasang `app-debug.apk` di HP (izinkan "pasang dari sumber tidak dikenal").

**Lewat Android Studio:** buka folder `android`, tunggu sinkronisasi Gradle, lalu **Build → Build APK(s)**.

## Kunci tanda tangan, rilis, dan Play Store

Tanpa secret, GitHub Actions membuat APK **debug** (artifact `asisten-bayi-apk-debug`).
Setelah empat secret kunci diisi (Settings → Secrets and variables → Actions), setiap push ke `main` membuat:

- **APK rilis bertanda tangan** di halaman Releases, dengan tautan unduh tetap:
  https://github.com/BrianSkyVayne/About-baby/releases/latest/download/asisten-bayi.apk
- **AAB untuk Play Store** (artifact `asisten-bayi-play-store`).

| Secret | Isi |
|---|---|
| `KEYSTORE_BASE64` | isi `KEYSTORE_BASE64.txt` |
| `KEYSTORE_PASSWORD` | kata sandi keystore |
| `KEY_ALIAS` | `upload` |
| `KEY_PASSWORD` | kata sandi kunci |
| `ADMOB_APP_ID`, `ADMOB_BANNER_ID` | ID dari akun AdMob (tanpa ini dipakai ID uji Google) |

Bahan halaman toko ada di `store/` (`listing.md`, ikon, feature graphic, tangkapan layar). Kebijakan privasi: `PRIVACY.md`.

Iklan hanya tampil di layar yang dibuka saat tenang (panduan, perkembangan, imunisasi, Lainnya, Tentang); daftar layarnya ada di kelas `AdPolicy` di `src/page-body.html`. Tombol "Traktir kopi" memakai produk Play Billing `traktir_kopi` dan hanya muncul bila aplikasi dipasang dari Play Store.

## Memperbarui data di APK atau versi offline

1. Di versi online, setujui usulan pembaruan (menu Lainnya → Sumber & pembaruan).
2. Ketuk **Unduh data untuk APK** (file `.json`) atau **Unduh versi offline** (file `.html`).
3. Di APK: Lainnya → Sumber & pembaruan → **Impor file data**.
   Atau perbarui `kb.json` di repo ini: aplikasi memeriksa
   `https://raw.githubusercontent.com/BrianSkyVayne/About-baby/main/kb.json` setiap kali dibuka.

Data baru selalu diperiksa dulu: file yang memuat pernyataan tanpa sumber ditolak, dan versi yang lebih lama diabaikan.

## Struktur

- `src/engine.js`: mesin penilaian (OOP): `Level`, `ConditionEvaluator`, `SymptomChecker`, `Assessment`, `Age`, `KnowledgeValidator`.
- `src/kb-*.js`: basis pengetahuan (sumber, penilai gejala, panduan, obat, imunisasi, perkembangan).
- `src/page-head.html`, `src/page-body.html`: tampilan (OOP): `KnowledgeBase`, `CheckerSession`, `BreathCounter`, sumber data `CloudSource` / `AndroidSource` / `StaticSource`, kelas tampilan per layar, `Router`, `App`.
- `src/build-kb.js` → `kb/` dan `kb.json`; `src/build-page.js` → `index.html`, `offline.html`, dan aset APK.
- `android/`: aplikasi Java tanpa pustaka tambahan (WebView + jembatan `AndroidKB`).
- `test/`: `engine.test.js` (Node), `browser*.js` (Playwright/Chromium).

```
node --test test/engine.test.js
node src/build-kb.js && node src/build-page.js
node test/browser.js && node test/browser-online.js && node test/browser-android.js
```
