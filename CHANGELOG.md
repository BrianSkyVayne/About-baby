# Changelog

### [2026.11.08-3] — 2026-11-08
- Commit: fix: aplikasi crash saat dibuka karena izin ACCESS_NETWORK_STATE hilang
- Detail:
  - T1 fix: tambah izin ACCESS_NETWORK_STATE yang wajib untuk job auto-update ber-syarat jaringan (crash SecurityException di KbUpdateJob.schedule) — android/app/src/main/AndroidManifest.xml
- Rollback: git revert <sha commit ini>

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
