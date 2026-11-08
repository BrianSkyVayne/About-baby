# Changelog

### [2026.11.08-24] — 2026-11-08
- Commit: feat: riset dalam semua tentang bayi (27 panduan baru, sumber AAP/NHS/CDC/WHO dll)
- Detail:
  - T2 feat: 27 panduan baru (merangkak, tummy time, duduk/berdiri, berjalan, baby walker, bicara terlambat, kepala peyang, mandi, potong kuku, kerak kepala, biang keringat, eksim, mata belekan, cegukan/bersin, sembelit, sariawan putih, matahari/nyamuk, susu formula, empeng, alergi makanan, kursi mobil, kepala terbentur, luka bakar, pasca imunisasi, sunat/penis, hernia umbilikalis, toilet training); 35 sumber baru; perawatan tali pusat (AAP) di bbl; KB 2026.11.08-9 — src/kb-content.js, src/kb-sources.js, src/kb-checkers.js
  - T2 feat: tanda bahaya tali pusat bernanah/bau/berdarah (level hari, AAP) dan aturan keyakinan satu-kata-badan — src/engine.js
  - T1 test: set uji search-semua (39 kueri), label lama disesuaikan ke panduan baru, expect boleh beberapa jawaban — test/*
  - docs: kutipan verbatim 172 butir — research/kutipan-riset-2026-11-08.json
- Rollback: <pending-sha, fill post-commit>

### [2026.11.08-23] — 2026-11-08
- Commit: fix: sisa kegagalan uji cari (napas, neonatus, topik di luar KB, kancing)
- Detail:
  - T2 fix: pokok pertanyaan yang tidak dikenal KB (kerokan, bawang merah, akta) tidak lagi dijawab "yakin"; kata lemah (cara/bikin/gimana) diabaikan saat menentukan pokok — src/engine.js
  - T1 fix: alias napas ("ngos ngosan", "bibir biru", "napas tersengal"), neonatus ("bayi 3/5 hari", "bayi seminggu"), m12 ("belum bisa jalan"), lapar ("nyari puting", "buka mulut"); KB 2026.11.08-8 — src/kb-checkers.js, src/kb-content.js
  - T1 test: "nelen kancing" berlabel bahaya (baterai kancing) — test/search-emak.json
- Rollback: <pending-sha, fill post-commit>

### [2026.11.08-22] — 2026-11-08
- Commit: fix: tanda bahaya dari uji emak-emak (dada cekung, mendelik, ruam tidak pudar, bintik dengue)
- Detail:
  - T2 fix: sesak menangkap "dadanya cekung" dan "ngos2an" (dinormalisasi "ngosan") — src/engine.js
  - T2 fix: kejang menangkap "mendelik"; pertanyaan "kejang lagi ga nanti" tidak lagi dianggap kejang sekarang — src/engine.js
  - T2 fix: "bintik merah" dikeluarkan dari aturan perdarahan dengue (WHO 2009: ruam/uji torniket = dengue tanpa tanda bahaya; perdarahan mukosa = tanda bahaya); aturan baru ruamkaca: ruam yang tidak pudar ditekan = IGD (NHS fever, "call 999") — src/engine.js
  - T1 feat: alias MPASI untuk buah/pisang; KB meta 2026.11.08-7 — src/kb-content.js
  - T1 test: set baru test/search-emak.json (40 soal ala emak); label ortu2 "hari ke 4 bintik merah di kaki" dikoreksi jadi bukan bahaya sesuai WHO 2009
- Rollback: <pending-sha, fill post-commit>

### [2026.11.08-21] — 2026-11-08
- Commit: feat: contoh kasus emut tangan lalu menyembur, tautan gambar dan video tanda lapar
- Detail:
  - T2 feat: panduan "Tanda lapar & kenyang" mendapat bagian contoh kasus (emut tangan, disusui lagi terus, lalu menyembur) dengan sumber per butir (AAP cues, AAP Why Babies Spit Up, CDC cues, RCH pyloric) dan bagian tautan gambar (CDC) & video (AAP); butir "mengisap" yang dobel digabung; sumber baru aap_cues_video; KB meta 2026.11.08-6 — src/kb-content.js, src/kb-sources.js
  - T1 test: 4 pertanyaan ortu soal lapar/emut tangan ke test/search-ortu2.json
- Rollback: <pending-sha, fill post-commit>

### [2026.11.08-20] — 2026-11-08
- Commit: fix: pertanyaan muntah semua tidak terbaca seperti gumoh biasa
- Detail:
  - T1 fix: teks tanda bahaya "muntahsemua" (cek gumoh, demam, napas) diubah jadi "Setiap kali diberi minum atau menyusu, semuanya dimuntahkan lagi (tidak ada yang tertahan sama sekali)?"; sebelumnya ortu bayi gumoh menjawab "ya" karena "susunya keluar semua" lalu dapat hasil IGD. Aturan dan sumber (who_imci_danger) tidak berubah; KB meta 2026.11.08-5 — src/kb-checkers.js, src/kb-content.js
- Rollback: <pending-sha, fill post-commit>

### [2026.11.08-19] — 2026-11-08
- Commit: fix: tingkat bahaya bersumber, luka bakar, sumber dengue, normalisasi bb, keyakinan pencarian
- Detail:
  - T2 fix: aturan bahaya ubun-ubun bersumber MedlinePlus (cekung: "check the infant right away"; menonjol: "immediate, emergency care") — tetap igd — src/engine.js, src/kb-sources.js
  - T2 fix: kuning < 24 jam dan telapak kuning bersumber WHO IMCI Chart Booklet hal. 46 ("SEVERE JAUNDICE … Refer URGENTLY to hospital") — tetap igd — src/engine.js, src/kb-checkers.js, src/kb-sources.js
  - T2 fix: who_dengue kembali menunjuk klasifikasi WHO 2009 (salinan fact sheet yang menimpanya dihapus); aturan perdarahan dan "bawa ke RS sekarang" kini juga mengutip who_dengue_fs ("seek care immediately") — src/engine.js, src/kb-checkers.js, src/kb-sources.js
  - T2 feat: aturan bahaya luka bakar (level hari, kriteria IGD dalam teks) dan bagian pertolongan pertama luka bakar di panduan Pencegahan cedera, bersumber NHS Burns and scalds — src/engine.js, src/kb-content.js, src/kb-sources.js
  - T2 fix: "bb" dibaca "berat badan" bila diikuti kata tentang berat ("bb ga naik", "bb anak segini"); selain itu tetap "bayi" — src/engine.js
  - T2 fix: alias yang isinya hanya kata umum tidak memberi bonus frasa; jawaban tidak yakin bila kata tak dikenal KB sebanyak kata yang cocok ("kuku bayi panjang cara potong") — src/engine.js
  - T1 test: label bahaya "anak kena air panas melepuh" dan "bayi muntah tiap habis nyusu" (IMCI vomits everything) diperbaiki — test/search-ortu.json, test/search-ortu2.json
  - T1 chore: KB meta 2026.11.08-4; bangun ulang kb.json, kb/, halaman; versi 21 / 2026.11.08-19 — android/app/build.gradle
- Rollback: git revert e2dce0e

### [2026.11.08-18] — 2026-11-08
- Commit: feat: UI bahaya sesuai level, kotak tanya di Beranda, gulir ke hasil
- Detail:
  - T2 feat: kotak tanda bahaya mengikuti level tertinggi — igd: merah + tombol 119/IGD; hari: "Periksakan ke dokter hari ini" + cari puskesmas, 119 jadi tautan kecil; pantau: "Pantau di rumah" (AskView.dangerBox) — src/page-body.html
  - T2 feat: kotak "Keluhan anak" di Beranda langsung menjawab di layar Tanya (HomeView.onSubmit) — src/page-body.html
  - T1 feat: setelah Tanya, layar menggulir ke tanda bahaya/hasil (sebelumnya di y=879, di bawah layar 818) (AskView.revealResult) — src/page-body.html
  - T1 style: "Isi tanggal lahir" jadi tautan, tidak bersaing dengan tombol Darurat — src/page-body.html
  - T1 chore: bangun ulang halaman; versi 20 / 2026.11.08-18 — android/app/build.gradle
- Rollback: git revert 5efe496

### [2026.11.08-17] — 2026-11-08
- Commit: feat: tingkat urgensi per tanda bahaya (igd / hari / pantau)
- Detail:
  - T2 feat: setiap hasil DangerDetector membawa level "igd" | "hari" | "pantau", diambil dari kalimat aturan yang sudah ada ("hari ini", "periksakan", "pantau 24 jam"); aturan yang kalimatnya tidak menyebut waktu tetap "igd" (lebih aman) — src/engine.js
  - T1 chore: bangun ulang halaman; versi 19 / 2026.11.08-17 — android/app/build.gradle
- Rollback: git revert 031047e

### [2026.11.08-16] — 2026-11-08
- Commit: chore: hapus sumber dobel, tambah soal uji tertahan baru
- Detail:
  - T1 chore: hapus entri sumber identik yang dobel (nhs_fever, who_dengue fact sheet, who_zinc); kb.json dan halaman hasil bangun tidak berubah — src/kb-sources.js
  - T1 test: 30 soal uji tertahan baru, dijalankan sekali tanpa penyetelan (Top-1 82,6%, Top-3 100%, recall bahaya 3/4, bahaya palsu 1) — test/search-ortu2.json
  - T1 chore: versi 18 / 2026.11.08-16 — android/app/build.gradle
- Rollback: git revert fa76d72

### [2026.11.08-15] — 2026-11-08
- Commit: fix: panduan ruam popok, alias keracunan, peringatan kejang palsu, keyakinan kata umum
- Detail:
  - T2 fix: AskEngine tidak menghitung kata umum (df > 1/3 entri, mis. "bayi") sebagai kecocokan bermakna saat menilai keyakinan ("ubun2 bayi cekung" tidak lagi yakin ke checker diare) — src/engine.js
  - T2 fix: peringatan kejang tidak muncul untuk pertanyaan "kejang ... bisa kambuh/berulang" — src/engine.js
  - T2 feat: panduan "Ruam popok" dari NHS (sumber baru nhs_nappy) — src/kb-content.js, src/kb-sources.js
  - T1 fix: alias panduan Pencegahan cedera mengikuti kosakata aturan bahaya keracunan (tertelan, minyak tanah, bensin, pemutih, obat nyamuk, deterjen) — src/kb-content.js
  - T1 test: target soal "ruam popok merah lecet" null → guide:ruampopok karena KB kini punya isinya — test/search-ortu.json
  - T1 chore: meta.version KB 2026.11.08-3; bangun ulang kb.json, kb/, halaman; versi 17 / 2026.11.08-15 — android/app/build.gradle
- Rollback: git revert 517b813

### [2026.11.08-14] — 2026-11-08
- Commit: fix: tangkap tanda bahaya ketikan ortu panik, turunkan keyakinan jawaban salah topik
- Detail:
  - T2 fix: DangerDetector menangkap mata cekung (who_dehid), kuning sampai telapak/kaki (who_newborn), tali pusat bernanah/bau (sumber belum ada), kepala terbentur, muntah setelah jatuh/terbentur; ubun-ubun boleh berselang kata ("ubun2 bayi cekung"); slang jatoh/kebentur/kejedot/choking/air panas/melepuh — src/engine.js
  - T2 fix: AskEngine tidak lagi "yakin" bila hasil teratas hanya cocok 1 kata tanpa frasa dan ada kata yang tak dikenal KB (mis. "digigit anjing" -> panduan gigi) — src/engine.js
  - T2 fix: kartu checker di Tanya tidak lagi menampilkan kesimpulan default ("Tidak ada tanda bahaya", "tanpa dehidrasi") sebelum pertanyaan dijawab, yang bertentangan dengan peringatan bahaya di atasnya (dicek di Safari) — src/page-body.html (AskView.card)
  - T1 test: soal uji terpisah 50 ketikan ortu buru-buru (test/search-ortu.json), search-eval.js menerima path file — test/
  - T1 chore: bangun ulang halaman — index.html, offline.html, android/app/src/main/assets/www/index.html; versi 16 / 2026.11.08-14 — android/app/build.gradle
- Rollback: git revert 624d38d

### [2026.11.08-13] — 2026-11-08
- Commit: fix: naikkan versi KB agar koreksi medis sampai ke HP terpasang
- Detail:
  - T2 fix: meta.version KB 2026.11.08-1 → 2026.11.08-2; tanpa ini KbUpdateJob.java:106 menolak KB baru dan KnowledgeStore.java:41 tetap memakai KB lama tersimpan, sehingga koreksi medis be49540/ceb7a40/45432bf tak pernah sampai — src/kb-content.js
  - T1 chore: bangun ulang kb.json dan halaman — kb.json, kb/kb/meta.json, offline.html, android/app/src/main/assets/www/{index.html,kb.json}; versi 15 / 2026.11.08-13 — android/app/build.gradle
- Rollback: git revert e418f55

### [2026.11.08-12] — 2026-11-08
- Commit: fix: predictive back ke layar utama, hapus checklist anak yang dihapus
- Detail:
  - T1 fix: callback back Android 13+ hanya terpasang selama WebView punya riwayat, sehingga di halaman pertama sistem menampilkan animasi back ke layar utama — MainActivity.java
  - T1 fix: menghapus anak ikut menghapus checklist perkembangannya — src/page-body.html
- Rollback: git revert a2d0988

### [2026.11.08-11] — 2026-11-08
- Commit: fix: sumber tersedak, imunisasi HB-0, dan kolik
- Detail:
  - T2 fix: tekanan dada tersedak bayi (2 jari) hanya bersumber NHS; MedlinePlus (pangkal telapak tangan) dilepas karena bertentangan — src/kb-content.js
  - T2 fix: jadwal imunisasi menyebut HB-0 dalam 24 jam setelah lahir sesuai WHO (sumber baru who_hepb) — src/kb-content.js, src/kb-sources.js
  - T1 fix: puncak kolik 6 minggu kini juga bersumber AAP HealthyChildren (aap_colic) — src/kb-checkers.js, src/kb-sources.js
  - T1 chore: bangun ulang kb.json dan halaman; versi 13 / 2026.11.08-11 — android/app/build.gradle
- Rollback: git revert 45432bf

### [2026.11.08-10] — 2026-11-08
- Commit: fix: status bar ikut tema aplikasi, checklist perkembangan per anak
- Detail:
  - T2 fix: status bar & navigasi Android mengikuti tema di dalam app (jembatan AndroidKB.setDark) — src/page-body.html, KbBridge.java, MainActivity.java
  - T1 fix: checklist perkembangan disimpan per anak (anak baru punya id; anak lama tetap memakai "ab.ms") — src/page-body.html
- Rollback: git revert 02e1412

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
- Rollback: git revert c466944

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
