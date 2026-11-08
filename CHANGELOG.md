# Changelog

### [2026.11.08-11] — 2026-11-08
- Commit: fix: sumber tersedak, imunisasi HB-0, dan kolik
- Detail:
  - T2 fix: tekanan dada tersedak bayi (2 jari) hanya bersumber NHS; MedlinePlus (pangkal telapak tangan) dilepas karena bertentangan — src/kb-content.js
  - T2 fix: jadwal imunisasi menyebut HB-0 dalam 24 jam setelah lahir sesuai WHO (sumber baru who_hepb) — src/kb-content.js, src/kb-sources.js
  - T1 fix: puncak kolik 6 minggu kini juga bersumber AAP HealthyChildren (aap_colic) — src/kb-checkers.js, src/kb-sources.js
  - T1 chore: bangun ulang kb.json dan halaman; versi 13 / 2026.11.08-11 — android/app/build.gradle
- Rollback: <pending-sha, fill post-commit>

### [2026.11.08-10] — 2026-11-08
- Commit: fix: status bar ikut tema aplikasi, checklist perkembangan per anak
- Detail:
  - T2 fix: status bar & navigasi Android mengikuti tema di dalam app (jembatan AndroidKB.setDark) — src/page-body.html, KbBridge.java, MainActivity.java
  - T1 fix: checklist perkembangan disimpan per anak (anak baru punya id; anak lama tetap memakai "ab.ms") — src/page-body.html
- Rollback: git revert <sha commit ini>

### [2026.11.08-9] — 2026-11-08
- Commit: fix: lanjutan koreksi fakta medis dan bersihkan sumber mati
- Detail:
  - T3 fix: bayi kuning yang sama sekali tidak mau menyusu, lebih mengantuk, atau sulit dibangunkan diarahkan ke IGD (NHS "Call 999 or go to A&E"); sumber diganti dari aap_bili yang tidak memuat klaim itu ke nhs_jaundice — src/kb-checkers.js
  - T3 fix: tanda bahaya lemas memakai istilah bagan IMCI "letargis atau tidak sadar", definisi yang tak terverifikasi dihapus — src/kb-checkers.js
  - T2 fix: anjuran "lebih sedikit tapi lebih sering" dibatasi untuk susu formula sesuai MedlinePlus — src/kb-checkers.js
  - T1 chore: hapus 5 sumber yang tak lagi dirujuk (redcross_choke, banner_pyloric, newborn_intake, medstar_bili, febrile_5min) — src/kb-sources.js, kb/sources/
  - T1 chore: bangun ulang kb.json dan halaman; versi 11 / 2026.11.08-9 — android/app/build.gradle
- Rollback: git revert ceb7a40

### [2026.11.08-8] — 2026-11-08
- Commit: feat: Beranda dan Profil diringkas dari sudut pandang ortu
- Detail:
  - T1 feat: Beranda hanya Darurat + keluhan sesuai usia; kartu Tanya dobel (sudah di menu bawah) dihapus, "Semua keluhan" jadi tautan "Keluhan lain", teks pembuka satu kalimat — src/page-body.html, src/page-head.html
  - T1 feat: pilihan tema pindah dari Profil ke Lainnya — src/page-body.html
- Rollback: git revert <sha commit ini>

### [2026.11.08-7] — 2026-11-08
- Commit: feat: UI/UX ramah ortu (audit Web Interface Guidelines, beberapa anak, mode gelap, back Android 13+)
- Detail:
  - T2 feat: beberapa anak per perangkat (pilih, tambah, hapus dengan konfirmasi di halaman); "ab.profile" lama dipindah ke "ab.kids" dan tetap disinkronkan — src/page-body.html
  - T1 feat: pilihan tampilan Ikuti HP / Terang / Gelap — src/page-body.html
  - T1 feat: hasil cek gejala memperingatkan pertanyaan wajib yang dilewati — src/page-body.html
  - T1 feat: hitung napas bergetar tiap ketukan dan saat selesai, layar dijaga menyala; dihentikan bila pindah halaman — src/page-body.html, android/app/src/main/AndroidManifest.xml (VIBRATE)
  - T1 fix: toast diumumkan pembaca layar; sasaran sentuh tab/"Ubah" 48px, checkbox 24px dengan label bisa diketuk, touch-action: manipulation — src/page-body.html, src/page-head.html
  - T1 fix: back lewat OnBackInvokedCallback di Android 13+ — android/app/src/main/java/id/asistenbayi/app/MainActivity.java, android/app/src/main/AndroidManifest.xml
- Rollback: git revert <sha commit ini>

### [2026.11.08-6] — 2026-11-08
- Commit: fix: koreksi fakta medis sesuai sumber resmi
- Detail:
  - T3 fix: audit seluruh klaim medis terhadap sumber yang benar-benar dibaca; teks yang tak didukung sumber dikoreksi atau dihapus — src/kb-checkers.js, src/kb-content.js
  - T3 fix: stenosis pilorus usia 2–6 minggu (RCH, MedlinePlus), angka kejadian tak bersumber diganti "Jarang"; gumoh: tidur tetap telentang datar (AAP), muntah darah/ampas kopi (MedlinePlus) — src/kb-checkers.js
  - T3 fix: kuning (batas ASI vs formula, NHS/Health Canada), berat kembali ke lahir hari 10–14 (CDC), oralit+zinc 10–14 hari (WHO 2005/2004), demam (NHS), DBD fase kritis hari ke-4 (WHO), madu (CDC/AAP/SFA/FSAI), obat batuk (AAP), tersedak bayi ≤5 tepukan kepala lebih rendah (MedlinePlus, NHS), pneumonia IMCI, kejang demam, kolik/jangan mengguncang (CDC AHT, Health Canada), layar (WHO), jus (AAP), racun (AAP), PPD (NIMH), SHK (Kemenkes) — src/kb-checkers.js, src/kb-content.js
  - T2 fix: judul/URL sumber yang salah atau mati diganti tautan resmi; sumber baru ditambahkan — src/kb-sources.js
  - T1 test: tes frekuensi menerima kata tanpa angka bila angka tak bersumber — test/engine.test.js
  - T1 chore: bangun ulang kb.json dan halaman — kb.json, index.html, offline.html, android/app/src/main/assets/www/index.html; versi 8 / 2026.11.08-6 — android/app/build.gradle
- Rollback: git revert be49540

### [2026.11.08-5] — 2026-11-08
- Commit: feat: tampilan Material 3 dan kartu jawaban ringkas bersumber bernomor
- Detail:
  - T2 feat: token Material Design 3 (skema SchemeTonalSpot dari seed #1f6f6a via material-color-utilities, tipografi/bentuk/state dari @material/web), font Roboto — src/page-head.html
  - T1 fix: status bar dan bar navigasi gestur tidak lagi menimpa halaman (WebView dibungkus FrameLayout yang diberi padding inset) — android/app/src/main/java/id/asistenbayi/app/MainActivity.java
  - T1 feat: kartu jawaban ringkas, rujukan [n] dan daftar "Sumber" yang bisa dibuka; kotak "Periksakan ke dokter bila muncul" — src/page-body.html
  - T1 feat: baris umpan balik satu baris, target sentuh 48px — src/page-body.html
  - T1 feat: umur di pertanyaan dibawa ke cek gejala, dengan banner penjelas — src/page-body.html
  - Build versionCode 7 — android/app/build.gradle
- Rollback: git revert 470ae04

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
