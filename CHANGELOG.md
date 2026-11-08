# Changelog

### [2026.11.08-5] — 2026-11-08
- Commit: feat: tampilan Material 3 dan kartu jawaban ringkas bersumber bernomor
- Detail:
  - T2 feat: token Material Design 3 (skema SchemeTonalSpot dari seed #1f6f6a via material-color-utilities, tipografi/bentuk/state dari @material/web), font Roboto — src/page-head.html
  - T1 fix: status bar dan bar navigasi gestur tidak lagi menimpa halaman (WebView dibungkus FrameLayout yang diberi padding inset) — android/app/src/main/java/id/asistenbayi/app/MainActivity.java
  - T1 feat: kartu jawaban ringkas, rujukan [n] dan daftar "Sumber" yang bisa dibuka; kotak "Periksakan ke dokter bila muncul" — src/page-body.html
  - T1 feat: baris umpan balik satu baris, target sentuh 48px — src/page-body.html
  - T1 feat: umur di pertanyaan dibawa ke cek gejala, dengan banner penjelas — src/page-body.html
  - Build versionCode 7 — android/app/build.gradle
- Rollback: <pending-sha, fill post-commit>

### [2026.11.08-4] — 2026-11-08
- Commit: feat: topik tanda lapar & kenyang, jawaban gumoh yang menenangkan
- Detail:
  - T2 feat: panduan "Tanda lapar & kenyang" dan mitos "ngemut tangan pasti lapar" (AAP HealthyChildren, CDC) — src/kb-content.js, src/kb-sources.js
  - T1 fix: sumber tanda lapar/kenyang di perawatan gumoh diganti dari checklist milestone CDC ke CDC & AAP; tambah poin overfeeding dan tidur telentang setelah gumoh (MedlinePlus) — src/kb-checkers.js
  - T1 feat: kartu jawaban cek gejala memuat penjelasan umum, perawatan, dan kapan ke dokter — src/page-body.html
  - T1 test: 4 soal uji baru (2 dari pertanyaan ortu nyata) — test/search-gold.json
  - KB meta 2026.11.08-1
- Rollback: git revert c780785

### [2026.11.08-3] — 2026-11-08
- Commit: fix: aplikasi crash saat dibuka karena izin ACCESS_NETWORK_STATE hilang
- Detail:
  - T1 fix: tambah izin ACCESS_NETWORK_STATE yang wajib untuk job auto-update ber-syarat jaringan (crash SecurityException di KbUpdateJob.schedule) — android/app/src/main/AndroidManifest.xml
- Rollback: git revert 3af3172

### [2026.11.08-2] — 2026-11-08
- Commit: feat: chatbot Tanya offline tanpa token (mesin pencari KB lokal)
- Detail:
  - T2 feat: mesin TextNormalizer/QueryExtractor/DangerDetector/KbSearch(BM25)/AskEngine — src/engine.js
  - T2 feat: alias, contoh pertanyaan, koleksi mitos bersumber — src/kb-checkers.js, src/kb-content.js, src/build-kb.js
  - T2 feat: layar Tanya pakai mesin lokal (bahaya/yakin/pilihan/tidak ada), prefill cek, Claude jadi opsional, catatan pertanyaan tak terjawab — src/page-body.html
  - T1 test: 209 soal sintetis + skrip evaluasi — test/search-gold.json, test/search-eval.js
- Rollback: git revert e8f2348

### [2026.11.08-1] — 2026-11-08
- Commit: feat: chatbot Tanya di APK, update data otomatis bertanda tangan, tombol darurat, bagikan WA
- Detail:
  - T3 feat: tombol Telepon 119 & Cari IGD di hasil level 3-4, halaman #darurat, tombol Darurat di beranda — src/page-body.html
  - T2 feat: beranda disederhanakan, bahasa awam, legenda pindah ke hasil, Bagikan ke WA, footer "Powered by PT. SkyDreamer Software", font menu 0.8rem — src/page-body.html, src/page-head.html
  - T2 fix: perbandingan versi data numerik (sebelumnya teks: "-10" < "-2") — src/page-body.html, android/.../KnowledgeStore.java
  - T3 feat: chatbot Tanya di APK (stream, chip topik, mikrofon, umpan balik, laporkan) — src/page-body.html, android/.../KbBridge.java, MainActivity.java
  - T3 feat: server perantara Claude (Cloudflare Worker, prompt caching, batas 20/hari/perangkat) — worker/
  - T3 feat: update KB otomatis via JobScheduler 24 jam, ETag, tanda tangan ECDSA P-256, simpan atomik + kb.prev.json — android/.../KbUpdateJob.java, AndroidManifest.xml, src/sign-kb.js
  - T2 feat: link tel:/wa.me/maps/mailto dibuka di aplikasi luar — android/.../MainActivity.java
- Rollback: git revert e8f2348
