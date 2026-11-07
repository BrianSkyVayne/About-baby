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

## Memperbarui data di APK atau versi offline

1. Di versi online, setujui usulan pembaruan (menu Lainnya → Sumber & pembaruan).
2. Ketuk **Unduh data untuk APK** (file `.json`) atau **Unduh versi offline** (file `.html`).
3. Di APK: Lainnya → Sumber & pembaruan → **Impor file data**.
   Atau taruh `kb.json` di alamat https (misalnya GitHub raw) dan isi alamatnya; aplikasi memeriksa versi baru setiap kali dibuka.

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
