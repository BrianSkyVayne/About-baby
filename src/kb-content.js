// Panduan, milestone, imunisasi, keamanan obat.
const guides = [
  { id: "asi", order: 1, title: "ASI", aliases: ["asi", "menyusui", "nyusu", "asi eksklusif", "asip", "asi kurang", "pumping", "laktasi", "menyusu", "asi perah", "puting lecet", "asi seret", "asi sedikit", "asi ga keluar", "asi tidak keluar", "kurang asi"], examples: ["asi eksklusif sampe kapan", "bayi 1 bln nyusu brp kali sehari", "asi kurang gmn ya bun", "bayi boleh minum air putih sblm 6 bln", "tanda bayi cukup asi apa"], sections: [
    { h: "Rekomendasi WHO", items: [
      { t: "Mulai menyusu dalam 1 jam pertama setelah lahir.", src: ["who_bf"] },
      { t: "ASI saja selama 6 bulan pertama, tanpa makanan atau minuman lain, termasuk air.", src: ["who_bf"] },
      { t: "Lanjutkan menyusu bersama MPASI sampai 2 tahun atau lebih, sesuai permintaan bayi.", src: ["who_bf"] }
    ] },
    { h: "Tanda asupan cukup (bayi baru lahir)", items: [
      { t: "Menyusu 8–12 kali dalam 24 jam.", src: ["cdc_newborn"] },
      { t: "Mulai hari ke-5: minimal 6 popok basah sehari.", src: ["cdc_newborn"] },
      { t: "Berat sedikit turun di minggu pertama itu normal pada bayi ASI; bayi seharusnya kembali ke berat lahir di hari ke-10–14. Bila belum, periksakan ke bidan atau dokter.", src: ["cdc_newborn"] }
    ] }
  ] },
  { id: "mpasi", order: 2, title: "MPASI", aliases: ["mpasi", "makanan pendamping", "makan bayi", "bubur bayi", "mulai makan", "bayi mulai makan", "tekstur makan", "finger food", "bayi susah makan", "gtm", "porsi makan bayi", "bayi tolak makan"], examples: ["mpasi mulai umur brp", "bb 7bln porsi mpasi brp sdm", "anak gtm mpasi gmn", "bayi 10 bln tekstur makanan apa", "boleh kasih garam gula di mpasi ga"], sections: [
    { h: "Pedoman WHO 2023", items: [
      { t: "Mulai MPASI di usia 6 bulan (180 hari) sambil tetap menyusu.", src: ["who_cf"] },
      { t: "Makanan hewani (daging, ikan, telur) setiap hari.", src: ["who_cf"] },
      { t: "Hindari makanan dan minuman tinggi gula, garam, lemak trans, dan pemanis non-gula; batasi jus.", src: ["who_cf"] },
      { t: "Ikuti tanda lapar dan kenyang anak (responsive feeding).", src: ["who_cf"] },
      { t: "Tanpa ASI: usia 6–11 bulan boleh susu formula atau susu hewani; usia 12–23 bulan susu hewani, follow-up formula tidak direkomendasikan WHO. Sebagian perhimpunan gastroenterologi anak tidak setuju dengan poin susu hewani ini.", src: ["who_cf", "jpgn2024"] }
    ] },
    { h: "Tabel praktis (Kemenkes)", table: { head: ["Usia", "Tekstur", "Frekuensi", "Porsi per makan"], rows: [
      ["6–8 bulan", "Lumat / bubur kental", "2–3× makan + 1–2× selingan", "Mulai 2–3 sdm sampai ½ mangkuk 250 ml"],
      ["9–11 bulan", "Cincang halus/kasar, finger food", "3–4× makan + 1–2× selingan", "½ sampai ¾ mangkuk"],
      ["12–23 bulan", "Makanan keluarga", "3–4× makan + 1–2× selingan", "¾ sampai 1 mangkuk"]
    ] }, src: ["mpasi_kemenkes"] },
    { h: "Keamanan makanan", items: [
      { t: "Madu dilarang sebelum usia 12 bulan dalam bentuk apa pun, termasuk produk olahan seperti kue atau madu yang dioleskan ke dot (risiko botulisme bayi). Ibu menyusui yang makan madu tidak menularkan spora lewat ASI.", src: ["honey", "honey_sfa", "honey_fsai"] },
      { t: "Di bawah 1 tahun jangan beri jus. Usia 1–3 tahun: jus tidak wajib; bila diberi, maksimal ±120 ml (4 ons) jus buah 100% per hari.", src: ["aap_juice"] }
    ] }
  ] },
  { id: "suplemen", order: 3, title: "Vitamin & suplemen", aliases: ["vitamin", "suplemen", "vit d", "vitamin d", "zat besi", "vitamin a", "kapsul biru", "kapsul merah", "tetes vitamin", "vit bayi", "sangobion", "anemia"], examples: ["bayi asi perlu vit d ga", "vitamin a kapan dikasih di posyandu", "zat besi bayi umur brp mulai", "kapsul biru buat usia brp", "bayi 5 bln perlu suplemen apa"], sections: [
    { h: "Vitamin D", items: [
      { t: "400 IU per hari untuk bayi sampai usia 1 tahun (bayi ASI atau ASI sebagian); 600 IU per hari di atas 1 tahun.", src: ["aap_vitd"] },
      { t: "IDAI menganjurkan vitamin D sejak lahir dengan dosis yang sama.", src: ["idai_vitd"] }
    ] },
    { h: "Zat besi (rekomendasi IDAI)", items: [
      { t: "Bayi cukup bulan: 2 mg/kgBB/hari, usia 4 bulan–2 tahun, maksimal 15 mg/hari.", src: ["idai_besi"] },
      { t: "Bayi berat lahir rendah (< 2.500 g): 3 mg/kgBB/hari, usia 1 bulan–2 tahun.", src: ["idai_besi"] },
      { t: "AAP: bayi ASI 1 mg/kgBB/hari mulai 4 bulan sampai makanan kaya besi masuk; skrining anemia di usia 12 bulan.", src: ["aap_vitd"] },
      { t: "Suplementasi besi rutin untuk semua bayi ASI masih diperdebatkan; beberapa lembaga di Kanada, Inggris, Eropa, dan Selandia Baru tidak menganjurkannya secara rutin. Untuk Indonesia ikuti IDAI dan konsultasikan ke dokter.", src: ["dga_iron"] }
    ] },
    { h: "Vitamin A (gratis, program Kemenkes)", items: [
      { t: "Diberikan setiap Februari dan Agustus di posyandu atau puskesmas.", src: ["kemenkes_vita"] },
      { t: "Kapsul biru 100.000 IU untuk bayi 6–11 bulan (1 kali). Kapsul merah 200.000 IU untuk anak 12–59 bulan (2 kali setahun).", src: ["kemenkes_vita"] }
    ] }
  ] },
  { id: "tidur", order: 4, title: "Tidur aman", aliases: ["tidur", "tidur bayi", "tidur aman", "tengkurap", "bedong", "sids", "jam tidur", "tidur telentang", "bayi tidur tengkurap", "sleep", "tidur miring", "bayi susah tidur", "bantal bayi", "tidur sama ortu"], examples: ["bayi tidur tengkurap boleh ga", "bayi 3bln harusnya tidur brp jam", "boleh bedong bayi pas tidur", "bayi tidur seranjang sama ortu aman ga", "bumper box bayi perlu ga"], sections: [
    { h: "Rekomendasi AAP 2022", items: [
      { t: "Telentang setiap kali tidur sampai usia 1 tahun. Miring dan tengkurap tidak aman.", src: ["aap_sleep"] },
      { t: "Alas datar, keras, tidak miring. Area tidur kosong: tanpa selimut longgar, bantal, bumper, atau boneka.", src: ["aap_sleep"] },
      { t: "Sekamar dengan orang tua tetapi tidak seranjang, idealnya minimal 6 bulan pertama.", src: ["aap_sleep"] },
      { t: "Hindari tempat tidur miring, bedong atau selimut berpemberat, dan tidur di sofa atau kursi.", src: ["aap_sleep"] },
      { t: "Tummy time saat bayi bangun dan diawasi.", src: ["aap_sleep"] }
    ] },
    { h: "Durasi tidur (WHO, termasuk tidur siang)", table: { head: ["Usia", "Tidur per hari"], rows: [["0–3 bulan", "14–17 jam"], ["4–11 bulan", "12–16 jam"], ["1–2 tahun", "11–14 jam"], ["3–4 tahun", "10–13 jam"]] }, src: ["who_activity"] }
  ] },
  { id: "layar", order: 5, title: "Layar & aktivitas", aliases: ["layar", "gadget", "hp", "nonton tv", "screen time", "youtube", "tablet", "main hp", "tv", "tontonan", "aktivitas anak", "gawai", "cocomelon"], examples: ["anak 1thn boleh nonton youtube ga", "screen time anak 3 thn brp jam", "bayi 8bln nonton tv bahaya", "anak kecanduan gadget", "aktivitas fisik anak 2thn brp menit"], sections: [
    { h: "WHO 2019", table: { head: ["Usia", "Aktivitas", "Layar"], rows: [
      ["< 1 tahun", "Aktif beberapa kali sehari; tummy time minimal 30 menit/hari bagi yang belum bisa bergerak sendiri", "Tidak dianjurkan"],
      ["1–2 tahun", "Minimal 180 menit/hari", "1 tahun: tidak dianjurkan; 2 tahun: maksimal 1 jam"],
      ["3–4 tahun", "Minimal 180 menit/hari, 60 menit di antaranya intensitas sedang–berat", "Maksimal 1 jam"]
    ] }, src: ["who_activity"] },
    { h: "Catatan", items: [
      { t: "Jangan biarkan anak terikat di stroller, kursi makan, atau gendongan lebih dari 1 jam sekaligus.", src: ["who_activity"] },
      { t: "WHO: layar tidak dianjurkan untuk bayi dan anak usia 1 tahun; usia 2 tahun maksimal 1 jam sehari.", src: ["who_screen"] }
    ] }
  ] },
  { id: "tersedak", order: 6, title: "Tersedak", aliases: ["tersedak", "keselek", "ke selek", "kesedak", "nyangkut di tenggorokan", "heimlich", "bayi keselek", "anak tersedak", "tertelan benda", "menelan koin", "rjp", "bayi tidak bisa napas"], examples: ["bayi keselek ga bisa nangis gmn", "anak tersedak kacang tolong", "bayi 8 bln tersedak mpasi", "tepuk punggung bayi tersedak caranya", "anak keselek tapi masih batuk"], sections: [
    { h: "Bayi di bawah 1 tahun yang tidak bisa menangis atau batuk", items: [
      { t: "1. Telungkupkan bayi di lengan Anda, kepala lebih rendah dari badan, lalu beri hingga 5 tepukan di punggung di antara tulang belikat.", src: ["medline_choke_infant", "nhs_choke"] },
      { t: "2. Bila belum keluar, balikkan bayi telentang dengan kepala lebih rendah, lalu beri hingga 5 tekanan dada dengan 2 jari di tengah dada, tepat di bawah garis puting.", src: ["nhs_choke"] },
      { t: "3. Ulangi bergantian sampai benda keluar. Bila bayi tidak sadar, panggil bantuan (119/112) dan mulai RJP di alas datar dan keras.", src: ["medline_choke_infant", "nhs_choke"] },
      { t: "Jangan lakukan hentakan perut pada bayi di bawah 1 tahun, dan jangan mencolok jari ke mulut bila bendanya tidak terlihat.", src: ["acep_choke"] }
    ] },
    { h: "Anak 1 tahun ke atas", items: [
      { t: "Bila anak masih bisa batuk kuat, dorong ia terus batuk.", src: ["medline_choke_child", "nhs_choke"] },
      { t: "Bila tidak bisa bernapas, bicara, atau batuk: 5 tepukan punggung lalu 5 hentakan perut, bergantian.", src: ["medline_choke_child"] }
    ] }
  ] },
  { id: "gigi", order: 7, title: "Tumbuh gigi", aliases: ["tumbuh gigi", "gigi", "teething", "gigi pertama", "ngences", "gusi bengkak", "gigit gigit", "gigi tumbuh", "anak mau tumbuh gigi", "kalung gigi", "dokter gigi anak", "gusi"], examples: ["bayi 6 bln gigi mau tumbuh rewel", "gel gusi buat bayi tumbuh gigi aman ga", "kalung amber buat gigi bayi", "kapan bawa anak ke dokter gigi", "bayi ngences gigit gigit apa mau tumbuh gigi"], sections: [
    { h: "Yang perlu dihindari (FDA)", items: [
      { t: "Jangan pakai gel atau obat oles benzokain untuk anak di bawah 2 tahun.", src: ["fda_teething"] },
      { t: "Jangan pakai perhiasan tumbuh gigi seperti kalung amber: FDA menerima laporan kematian dan cedera serius akibat tercekik dan tersedak.", src: ["fda_jewelry"] }
    ] },
    { h: "Kontrol gigi", items: [
      { t: "Kontrol pertama ke dokter gigi saat gigi pertama tumbuh atau menjelang usia 12 bulan.", src: ["gigi_idai"] }
    ] }
  ] },
  { id: "bbl", order: 8, title: "Bayi baru lahir", aliases: ["baru lahir", "skrining", "shk", "tali pusat", "perawatan bayi baru lahir", "tumit", "skrining pendengaran", "pusar bayi", "hipotiroid", "bayi lahir", "bbl", "perawatan tali pusat"], examples: ["skrining shk bayi kapan", "tali pusat bayi belum lepas", "bayi baru lahir dites pendengaran perlu ga", "perawatan pusar bayi gmn", "bayi 3 hari kuning perlu cek bilirubin"], sections: [
    { h: "Skrining", items: [
      { t: "SHK (Skrining Hipotiroid Kongenital): 2–3 tetes darah tumit di usia 48–72 jam, gratis di fasilitas kesehatan. Bila positif, diobati sebelum usia 1 bulan.", src: ["kemenkes_shk", "kemenkes_shk_2022"] },
      { t: "Skrining pendengaran: sebelum usia 1 bulan; bila tidak lolos, diagnosis sebelum 3 bulan dan intervensi sebelum 6 bulan.", src: ["jcih"] }
    ] },
    { h: "Perawatan", items: [
      { t: "Tali pusat dirawat bersih dan kering.", src: ["who_cord"] },
      { t: "Kuning: AAP menganjurkan semua bayi diperiksa bilirubin di usia 24–48 jam. Kuning dalam 24 jam pertama, urin gelap, atau tinja pucat perlu diperiksa.", src: ["aap_bili", "nhs_jaundice"] }
    ] }
  ] },
  { id: "tumbuh", order: 9, title: "Pertumbuhan", aliases: ["stunting", "pertumbuhan", "berat badan", "bb", "tinggi badan", "tb", "kurus", "gizi", "bb tidak naik", "pendek", "kurva", "growth", "bb turun", "gizi buruk"], examples: ["bb anak ga naik 2 bulan", "stunting itu apa", "anak 2thn tinggi 80cm pendek ga", "bayi kurus gmn", "cara ukur panjang badan bayi"], sections: [
    { h: "Stunting (standar WHO)", items: [
      { t: "Stunting: panjang/tinggi badan menurut umur di bawah −2 SD median WHO; stunting berat di bawah −3 SD.", src: ["stunting"] },
      { t: "Ukur panjang berbaring untuk anak di bawah 2 tahun, tinggi berdiri untuk 2 tahun ke atas.", src: ["stunting"] },
      { t: "Ukur tinggi juga, bukan hanya berat. Masa paling menentukan adalah sejak kehamilan sampai usia 2 tahun.", src: ["stunting"] }
    ] }
  ] },
  { id: "aman", order: 10, title: "Pencegahan cedera", aliases: ["cedera", "jatuh", "tenggelam", "kecelakaan", "luka bakar", "keracunan", "bahaya rumah", "child proofing", "jatuh dari kasur", "kepala kebentur", "terjatuh", "obat terkunci", "baby proofing"], examples: ["bayi jatuh dari kasur gmn", "anak deket kolam bahaya", "bayi minum sabun keracunan", "cara aman simpen obat dr anak", "anak kebentur kepala muntah"], sections: [
    { h: "WHO", items: [
      { t: "Anak usia 0–4 tahun punya angka tenggelam tertinggi. Risiko naik saat anak dekat air tanpa pengawasan aktif orang dewasa.", src: ["who_drowning"] },
      { t: "Penyebab utama kematian akibat cedera pada anak: kecelakaan lalu lintas, tenggelam, luka bakar, jatuh, dan keracunan.", src: ["who_injury"] },
      { t: "Simpan obat, bahan kimia, dan pembersih terkunci dan jauh dari jangkauan anak.", src: ["aap_poison"] }
    ] }
  ] },
  { id: "ibu", order: 11, title: "Kesehatan ibu", aliases: ["baby blues", "depresi pascapersalinan", "ppd", "ibu sedih", "stres ibu", "postpartum", "capek mental", "nangis terus ibu", "kesehatan ibu", "ibu baru", "burnout", "mood swing"], examples: ["baby blues sampe kapan", "aku sering nangis habis lahiran normal ga", "ppd tanda tandanya apa", "ibu pengen nyakitin bayi", "stres ngurus bayi gmn"], sections: [
    { h: "Baby blues atau depresi pascapersalinan?", table: { head: ["", "Baby blues", "Depresi pascapersalinan"], rows: [
      ["Kejadian", "Sekitar 8 dari 10 ibu", "Sekitar 1–2 dari 10 ibu"],
      ["Mulai", "2–3 hari setelah melahirkan", "Beberapa minggu sampai 1 tahun setelah melahirkan"],
      ["Lama", "Sampai ± 2 minggu", "Berbulan-bulan atau lebih"],
      ["Gejala", "Mood naik-turun, cemas, menangis, sulit tidur", "Lebih berat: putus asa, kehilangan minat, mudah marah, sulit konsentrasi, pikiran menyakiti bayi"]
    ] }, src: ["ppd"] },
    { h: "Kapan mencari bantuan", items: [
      { t: "Gejala lebih dari 2 minggu, makin berat, atau mengganggu merawat diri dan bayi: hubungi dokter, bidan, atau psikolog.", src: ["nimh_ppd", "ppd"] },
      { t: "Ada pikiran menyakiti diri atau bayi: cari bantuan hari ini.", src: ["nimh_ppd"] }
    ] }
  ] },
  { id: "skrining", order: 12, title: "Skrining perkembangan", aliases: ["skrining perkembangan", "autis", "mchat", "m-chat", "speech delay", "telat bicara", "terlambat bicara", "tumbuh kembang", "kembang anak", "autisme", "anak telat jalan", "developmental"], examples: ["anak 2thn belum bicara autis ga", "mchat itu apa", "skrining perkembangan umur brp", "anak 18 bln gak nunjuk benda", "speech delay gmn"], sections: [
    { h: "Jadwal (AAP)", items: [
      { t: "Skrining perkembangan umum di usia 9, 18, dan 30 bulan.", src: ["cdc_autism"] },
      { t: "Skrining autisme (misalnya M-CHAT-R) di usia 18 dan 24 bulan untuk semua anak.", src: ["cdc_autism"] }
    ] }
  ] },
  { id: "lapar", order: 13, title: "Tanda lapar & kenyang", aliases: ["tanda lapar", "tanda kenyang", "masih lapar", "masih haus", "bayi lapar", "bayi kenyang", "ngemut tangan", "emut tangan", "isap tangan", "tangan dimasukin mulut", "ngenyot tangan", "nyusu terus", "kapan berhenti nyusu", "overfeeding"], examples: ["bayi ngemut tangan berarti lapar ya", "gimana tau bayi udah kenyang", "abis nyusu masih emut tangan, kasih lagi?", "bayi nyusu terus tiap nangis", "bayi masih haus padahal udah gumoh"], sections: [
    { h: "Tanda lapar (0–5 bulan)", items: [
      { t: "Tanda awal: mengecap atau menjilat bibir, menjulurkan lidah, membuka mulut, menoleh mencari payudara atau botol (rooting), berulang memasukkan tangan ke mulut, tangan mengepal, mulai gelisah.", src: ["aap_cues", "cdc_cues"] },
      { t: "Menangis adalah tanda lapar yang sudah terlambat. Susui saat tanda awal muncul.", src: ["aap_cues"] }
    ] },
    { h: "Tanda kenyang (0–5 bulan)", items: [
      { t: "Menutup mulut, memalingkan kepala dari payudara atau botol, dan tangan menjadi rileks.", src: ["cdc_cues"] },
      { t: "Bayi yang minum dari botol kadang terus mengisap walau sudah kenyang. Perhatikan tanda kenyang, jangan hanya menunggu botol habis.", src: ["aap_cues"] }
    ] },
    { h: "Mengisap tidak selalu berarti lapar", items: [
      { t: "Bayi mengisap bukan hanya karena lapar, tetapi juga untuk menenangkan diri. Tidak setiap tangis atau isapan berarti lapar; bisa jadi ia ingin digendong atau popoknya perlu diganti.", src: ["aap_cues"] },
      { t: "Bayi juga mengisap untuk menenangkan diri, jadi isapan saja belum tentu berarti lapar. Perhatikan tanda lapar lainnya.", src: ["aap_cues"] }
    ] }
  ] }
];

// Milestone CDC 2022: yang dicapai minimal 75% anak.
const milestones = [
  { id: "m02", months: 2, label: "2 bulan", d: {
    sosial: ["Tenang saat diajak bicara atau digendong", "Melihat wajah Anda", "Tampak senang saat Anda mendekat", "Tersenyum saat diajak bicara atau disenyumi"],
    bahasa: ["Bersuara selain menangis", "Bereaksi terhadap suara keras"],
    kognitif: ["Memperhatikan Anda saat bergerak", "Melihat mainan beberapa detik"],
    gerak: ["Mengangkat kepala saat tengkurap", "Menggerakkan kedua tangan dan kedua kaki", "Membuka tangan sebentar"] } },
  { id: "m04", months: 4, label: "4 bulan", d: {
    sosial: ["Tersenyum sendiri untuk menarik perhatian", "Terkekeh saat diajak bercanda", "Melihat, bergerak, atau bersuara untuk mendapat perhatian"],
    bahasa: ["Bersuara \"oooo\", \"aahh\"", "Membalas saat diajak bicara", "Menoleh ke arah suara Anda"],
    kognitif: ["Membuka mulut saat melihat payudara/botol bila lapar", "Memperhatikan tangannya sendiri"],
    gerak: ["Kepala tegak stabil saat digendong", "Memegang mainan yang diletakkan di tangannya", "Mengayunkan tangan ke arah mainan", "Memasukkan tangan ke mulut", "Bertumpu pada siku saat tengkurap"] } },
  { id: "m06", months: 6, label: "6 bulan", d: {
    sosial: ["Mengenali orang yang dikenal", "Suka melihat dirinya di cermin", "Tertawa"],
    bahasa: ["Bergantian bersuara dengan Anda", "Meniup bibir (\"raspberry\")", "Memekik"],
    kognitif: ["Memasukkan benda ke mulut untuk mengenalinya", "Meraih mainan yang diinginkan", "Menutup bibir tanda tidak mau makan lagi"],
    gerak: ["Berguling dari tengkurap ke telentang", "Bertumpu dengan lengan lurus saat tengkurap", "Bertumpu pada tangan saat duduk"] } },
  { id: "m09", months: 9, label: "9 bulan", d: {
    sosial: ["Malu atau takut pada orang asing", "Menunjukkan beberapa ekspresi wajah", "Menoleh saat dipanggil namanya", "Bereaksi saat Anda pergi", "Tersenyum atau tertawa saat main cilukba"],
    bahasa: ["Bersuara \"mamama\", \"bababa\"", "Mengangkat tangan minta digendong"],
    kognitif: ["Mencari benda yang jatuh dari pandangan", "Membenturkan dua benda"],
    gerak: ["Duduk sendiri dari berbaring", "Memindahkan benda dari satu tangan ke tangan lain", "Menarik makanan dengan jari", "Duduk tanpa sandaran"] } },
  { id: "m12", months: 12, label: "12 bulan", d: {
    sosial: ["Bermain \"pok ame-ame\" dengan Anda"],
    bahasa: ["Melambai dadah", "Memanggil \"mama\", \"papa\", atau sebutan khusus", "Paham kata \"jangan\""],
    kognitif: ["Memasukkan benda ke wadah", "Mencari benda yang Anda sembunyikan"],
    gerak: ["Berdiri berpegangan", "Berjalan berpegangan pada perabot", "Minum dari gelas tanpa tutup yang Anda pegangi", "Menjumput benda kecil dengan ibu jari dan telunjuk"] } },
  { id: "m15", months: 15, label: "15 bulan", d: {
    sosial: ["Meniru anak lain saat bermain", "Menunjukkan benda yang disukainya", "Bertepuk tangan saat senang", "Memeluk boneka atau mainan", "Menunjukkan kasih sayang (memeluk, mencium)"],
    bahasa: ["Mencoba mengucapkan 1–2 kata selain mama/papa", "Melihat benda yang dikenal saat disebut", "Mengikuti perintah yang disertai isyarat", "Menunjuk untuk meminta atau minta tolong"],
    kognitif: ["Memakai benda dengan benar (telepon, gelas, buku)", "Menumpuk minimal 2 balok"],
    gerak: ["Berjalan beberapa langkah sendiri", "Makan sendiri dengan jari"] } },
  { id: "m18", months: 18, label: "18 bulan", d: {
    sosial: ["Menjauh tapi memastikan Anda tetap dekat", "Menunjuk untuk memperlihatkan hal menarik", "Menyodorkan tangan untuk dicuci", "Melihat-lihat buku bersama Anda", "Membantu saat dipakaikan baju"],
    bahasa: ["Mencoba mengucapkan 3 kata atau lebih selain mama/papa", "Mengikuti perintah satu langkah tanpa isyarat"],
    kognitif: ["Meniru pekerjaan rumah, misalnya menyapu", "Bermain sederhana, misalnya mendorong mobil-mobilan"],
    gerak: ["Berjalan tanpa berpegangan", "Mencoret-coret", "Minum dari gelas tanpa tutup", "Makan sendiri dengan jari", "Mencoba memakai sendok", "Naik-turun sofa atau kursi sendiri"] } },
  { id: "m24", months: 24, label: "2 tahun", d: {
    sosial: ["Memperhatikan orang yang terluka atau sedih", "Melihat wajah Anda untuk tahu cara bereaksi di situasi baru"],
    bahasa: ["Menunjuk gambar di buku saat ditanya", "Menggabungkan 2 kata, misalnya \"mau susu\"", "Menunjuk minimal 2 bagian tubuh", "Memakai isyarat selain melambai dan menunjuk"],
    kognitif: ["Memegang benda dengan satu tangan sambil memakai tangan lain", "Mencoba tombol atau sakelar mainan", "Bermain dengan lebih dari satu mainan sekaligus"],
    gerak: ["Menendang bola", "Berlari", "Naik beberapa anak tangga", "Makan dengan sendok"] } },
  { id: "m30", months: 30, label: "30 bulan", d: {
    sosial: ["Bermain di dekat anak lain dan kadang bersama", "Memamerkan kemampuannya (\"lihat aku!\")", "Mengikuti rutinitas sederhana, misalnya membereskan mainan"],
    bahasa: ["Mengucapkan sekitar 50 kata", "Menggabungkan 2 kata atau lebih dengan kata kerja", "Menyebut benda di buku saat ditanya", "Memakai kata \"aku\" atau \"kita\""],
    kognitif: ["Bermain pura-pura", "Memecahkan masalah sederhana", "Mengikuti perintah 2 langkah", "Mengenal minimal 1 warna"],
    gerak: ["Memutar gagang pintu atau tutup", "Melepas baju longgar sendiri", "Melompat dengan dua kaki", "Membalik halaman buku satu per satu"] } },
  { id: "m36", months: 36, label: "3 tahun", d: {
    sosial: ["Tenang dalam 10 menit setelah ditinggal", "Mendekati dan bermain dengan anak lain"],
    bahasa: ["Bercakap minimal 2 giliran bolak-balik", "Bertanya siapa, apa, di mana, atau kenapa", "Menyebut kegiatan di gambar", "Menyebut nama depannya", "Ucapannya dimengerti orang lain hampir selalu"],
    kognitif: ["Menggambar lingkaran bila dicontohkan", "Menghindari benda panas setelah diperingatkan"],
    gerak: ["Merangkai manik-manik besar", "Memakai sebagian baju sendiri", "Memakai garpu"] } },
  { id: "m48", months: 48, label: "4 tahun", d: {
    sosial: ["Bermain peran", "Mengajak anak lain bermain", "Menghibur teman yang sedih", "Menghindari bahaya", "Senang membantu", "Menyesuaikan perilaku dengan tempat"],
    bahasa: ["Berbicara dengan kalimat 4 kata atau lebih", "Mengucapkan sebagian lagu atau cerita", "Menceritakan satu kejadian hari itu", "Menjawab pertanyaan sederhana, misalnya \"jaket untuk apa?\""],
    kognitif: ["Menyebut beberapa warna", "Menebak kelanjutan cerita yang dikenal", "Menggambar orang dengan 3 bagian tubuh atau lebih"],
    gerak: ["Menangkap bola besar", "Mengambil makanan atau menuang air sendiri dengan diawasi", "Membuka beberapa kancing", "Memegang krayon dengan jari, bukan digenggam"] } },
  { id: "m60", months: 60, label: "5 tahun", d: {
    sosial: ["Mengikuti aturan atau bergiliran saat bermain", "Bernyanyi, menari, atau berakting untuk Anda", "Mengerjakan tugas rumah sederhana"],
    bahasa: ["Bercerita dengan minimal 2 kejadian", "Menjawab pertanyaan sederhana tentang cerita", "Bercakap lebih dari 3 giliran", "Mengenal rima sederhana"],
    kognitif: ["Berhitung sampai 10", "Menyebut beberapa angka 1–5", "Memakai kata waktu (kemarin, besok, pagi, malam)", "Fokus 5–10 menit saat kegiatan", "Menulis beberapa huruf namanya", "Menyebut beberapa huruf"],
    gerak: ["Mengancingkan beberapa kancing", "Melompat dengan satu kaki"] } }
];

const imunisasi = {
  note: "Sumber sekunder (Bio Farma mengutip IDAI 2024). Cocokkan dengan jadwal resmi IDAI atau buku KIA sebelum dijadikan patokan; IDAI merevisi jadwal sekitar tiap 3 tahun. Hepatitis B-0 dalam 24 jam setelah lahir sesuai anjuran WHO.",
  src: ["idai_imun", "who_hepb"],
  rows: [
    ["Lahir (< 24 jam)", "Hepatitis B-0, Polio-0"],
    ["< 1 bulan", "BCG"],
    ["2 bulan", "DTP-1, Polio-1, Hepatitis B-1, Hib-1, PCV-1, Rotavirus-1"],
    ["3 bulan", "DTP-2, Polio-2, Hepatitis B-2, Hib-2"],
    ["4 bulan", "DTP-3, Polio-3, Hepatitis B-3, Hib-3, PCV-2, Rotavirus-2"],
    ["6 bulan", "PCV-3, Influenza-1, Rotavirus-3 (bila vaksin pentavalen)"],
    ["9 bulan", "MR/campak, JE-1"],
    ["12–18 bulan", "PCV booster (12–15 bln), Varisela 2 dosis, Hepatitis A 2 dosis"],
    ["18 bulan", "DTP-4, Polio-4, Hepatitis B booster, Hib-4, MMR/MR lanjutan"],
    ["24 bulan", "JE-2, Tifoid-1, Influenza (tiap tahun)"],
    ["5 tahun", "DTP-5, Polio-5, MMR-2"],
    ["6 tahun", "Dengue (2 dosis, jarak 3 bulan)"],
    ["9 tahun", "HPV (2 dosis)"],
    ["10 tahun", "DTP-6 (Tdap/Td)"],
    ["Rutin", "Influenza tiap tahun; Tifoid diulang tiap 3 tahun"]
  ]
};

// Keamanan obat: yang dilarang/diwaspadai dan dosis program resmi. Dosis obat umum sengaja tidak dimuat.
const obat = [
  { id: "batukpilek", order: 1, name: "Obat batuk-pilek bebas (OTC)", aliases: ["obat batuk", "obat pilek", "obat batpil", "sirup batuk", "dekongestan", "antihistamin", "obat flu anak", "obat batuk bayi", "woods", "obat batuk anak", "tolak angin anak", "obat flu"], examples: ["boleh kasih obat batuk bayi 1 thn", "obat flu buat anak 3 thn aman ga", "sirup batuk pilek anak umur brp boleh", "dekongestan buat bayi", "anak batuk pilek kasih obat apa"], status: "hindari", age: "< 2 tahun (label produsen: < 4 tahun)", t: "Jangan beri obat batuk-pilek bebas yang mengandung dekongestan atau antihistamin untuk anak di bawah 2 tahun karena efek samping serius, termasuk kejang dan kematian. Produsen melabeli \"jangan dipakai di bawah 4 tahun\". Menurut AAP, risikonya lebih besar daripada manfaatnya.", src: ["fda_cough", "coughhoney"] },
  { id: "benzokain", order: 2, name: "Gel/obat oles benzokain (tumbuh gigi)", aliases: ["benzokain", "gel gigi", "obat oles gusi", "bonjela", "kamistad", "gel gusi", "obat gusi bayi", "salep gusi", "gel tumbuh gigi", "anbesol", "oles gusi", "obat teething"], examples: ["gel gusi benzokain aman buat bayi ga", "bayi 8 bln boleh dioles kamistad", "obat oles gusi bayi tumbuh gigi", "bonjela buat bayi bahaya ga", "anak 1 thn gusi sakit kasih apa"], status: "hindari", age: "< 2 tahun", t: "Risiko methemoglobinemia yang bisa fatal, dengan manfaat kecil.", src: ["fda_teething"] },
  { id: "madu", order: 3, name: "Madu", aliases: ["madu", "honey", "madu bayi", "botulisme", "madu buat batuk", "madu dioles dot", "madu hangat", "madu murni", "madu dimasak", "madu anak", "madu 1 tahun", "madu sumbawa"], examples: ["bayi 8 bln boleh madu ga", "madu buat batuk anak 2thn boleh", "madu dicampur mpasi aman", "botulisme bayi apa", "anak 11 bln dikasih madu dikit"], status: "hindari", age: "< 12 bulan", t: "Risiko botulisme bayi, dalam bentuk apa pun. Usia 1 tahun ke atas boleh, termasuk untuk batuk.", src: ["honey", "honey_sfa", "coughhoney"] },
  { id: "antidiare", order: 4, name: "Obat anti-diare", aliases: ["obat diare", "obat mencret", "diapet", "entrostop", "loperamid", "obat anti diare", "obat berhentiin diare", "obat mencret anak", "norit", "attapulgite", "obat bab cair", "new diatabs"], examples: ["anak mencret kasih diapet boleh", "obat mencret bayi apa", "entrostop buat anak aman ga", "norit buat diare bayi", "kasih obat berhentiin diare anak 2thn"], status: "hindari", age: "Anak", t: "WHO menganjurkan oralit dan zinc, bukan obat anti-diare.", src: ["who_ors"] },
  { id: "antibiotik-diare", order: 5, name: "Antibiotik untuk diare", aliases: ["antibiotik", "antibiotik diare", "amoxicillin", "amoksisilin", "obat antibiotik", "antibiotik mencret", "kasih antibiotik", "disentri", "diare darah", "puyer antibiotik", "antibiotik anak", "antibiotic"], examples: ["anak diare perlu antibiotik ga", "mencret kasih amoxicillin boleh", "diare berdarah apa harus antibiotik", "antibiotik buat bayi mencret", "kapan diare butuh antibiotik"], status: "dokter", age: "Anak", t: "Menurut WHO hanya untuk diare berdarah/disentri, dan diputuskan dokter.", src: ["who_ors"] },
  { id: "simetikon", order: 6, name: "Simetikon / obat GERD untuk kolik", aliases: ["simetikon", "simethicone", "obat kembung", "obat kolik", "kembung bayi", "infacol", "sab simplex", "obat perut kembung", "obat gerd bayi", "gas bayi", "bayi kembung", "obat gumoh"], examples: ["bayi kolik kasih simetikon boleh", "obat kembung bayi 2 bln apa", "infacol efektif ga", "bayi kembung rewel kasih apa", "obat gerd bayi perlu ga"], status: "info", age: "Bayi", t: "Umumnya tidak efektif untuk kolik.", src: ["amboss_colic"] },
  { id: "oralit", order: 7, name: "Oralit", aliases: ["oralit", "larutan gula garam", "ors", "rehidrasi", "cairan elektrolit", "pedialyte", "oralit cair", "oralit bayi", "carolit", "renalyte", "oralit berapa", "minum oralit"], examples: ["oralit berapa ml tiap bab cair", "bayi mencret kasih oralit boleh", "oralit buat anak 3thn berapa", "pedialyte sama oralit samakah", "cara bikin oralit"], status: "program", age: "Anak dengan diare", t: "Setiap kali BAB cair: usia < 2 tahun 50–100 ml, usia 2–10 tahun 100–200 ml.", src: ["who_ors", "unicef_ors"] },
  { id: "zinc", order: 8, name: "Zinc", aliases: ["zinc", "zink", "seng", "zinc diare", "tablet zinc", "zinkid", "obat zinc", "zinc 10 hari", "zinc bayi", "zinc anak", "zn", "sirup zinc"], examples: ["zinc buat diare berapa hari", "bayi 5 bln zinc dosisnya", "zinc harus dihabiskan walau diare berhenti", "anak 2 thn zinc 20 mg", "zinc itu buat apa"], status: "program", age: "Anak dengan diare", t: "10–14 hari sejak awal diare: usia < 6 bulan 10 mg/hari, usia ≥ 6 bulan 20 mg/hari.", src: ["who_zinc", "who_ors"] },
  { id: "vita", order: 9, name: "Vitamin A", aliases: ["vitamin a", "vit a", "kapsul vitamin a", "kapsul biru", "kapsul merah", "vita", "posyandu vitamin a", "bulan vitamin a", "vitamin a bayi", "vitamin a februari", "vitamin a agustus", "kapsul vit a"], examples: ["vitamin a kapan dibagi posyandu", "kapsul biru buat bayi umur brp", "kapsul merah 2 kali setahun ya", "bayi 8 bln dpt vit a ga", "anak 3 thn vitamin a apa"], status: "program", age: "6–59 bulan", t: "Kapsul biru 100.000 IU (6–11 bulan, 1 kali); kapsul merah 200.000 IU (12–59 bulan, Februari dan Agustus).", src: ["kemenkes_vita"] },
  { id: "vitd", order: 10, name: "Vitamin D", aliases: ["vitamin d", "vit d", "d3", "tetes vit d", "vitamin d bayi", "vit d3", "vitamin d asi", "sinar matahari bayi", "jemur bayi", "vit d berapa iu", "vitamin d 400", "tetes d"], examples: ["bayi asi perlu vit d berapa iu", "vit d 400 iu sampe umur brp", "jemur bayi cukup ga ganti vit d", "anak 2 thn vit d berapa", "tetes vitamin d bayi baru lahir"], status: "program", age: "0–1 tahun & di atasnya", t: "400 IU/hari sampai 1 tahun, 600 IU/hari di atas 1 tahun.", src: ["aap_vitd", "idai_vitd"] },
  { id: "besi", order: 11, name: "Zat besi", aliases: ["zat besi", "besi", "fe", "tablet besi", "sangobion bayi", "anemia bayi", "tetes besi", "iron", "kurang darah", "suplemen besi", "anemia anak", "sirup besi"], examples: ["bayi cukup bulan zat besi berapa", "bayi bblr zat besi dosis", "mulai zat besi umur brp", "anak pucat kurang darah", "bayi asi perlu zat besi ga"], status: "program", age: "4 bulan–2 tahun", t: "IDAI: bayi cukup bulan 2 mg/kgBB/hari (maks. 15 mg/hari); BBLR 3 mg/kgBB/hari mulai 1 bulan.", src: ["idai_besi"] },
  { id: "penurunpanas", order: 12, name: "Paracetamol, ibuprofen, dan obat lain", aliases: ["parasetamol", "paracetamol", "sanmol", "tempra", "pct", "obat panas", "penurun panas", "ibuprofen", "proris", "obat demam", "bodrex anak", "panadol anak", "dosis parasetamol", "pamol"], examples: ["dosis sanmol bayi 8 kg berapa", "tempra boleh tiap berapa jam", "ibuprofen buat bayi umur brp", "parasetamol atau ibuprofen", "obat panas bayi 3 bulan boleh ga"], status: "dokter", age: "Semua usia", t: "Dosis bergantung berat badan dan sediaan. Aplikasi ini tidak memuat dosis; ikuti label kemasan, apoteker, atau dokter.", src: [] }
];

// Mitos: klaim populer beserta putusannya. Hanya klaim yang sudah didukung entri KB dan sumber yang ada.
const mitos = [
  { id: "madu-bayi", order: 1, claim: "Madu aman untuk bayi di bawah 1 tahun", verdict: "tidak", text: "Madu dilarang sebelum usia 12 bulan dalam bentuk apa pun karena risiko botulisme bayi. Usia 1 tahun ke atas boleh.", src: ["honey", "coughhoney"], aliases: ["madu", "madu bayi", "botulisme", "madu dioles dot"], examples: ["bayi 8 bln boleh madu dikit ga", "madu dioles ke dot aman gak"] },
  { id: "madu-batuk", order: 2, claim: "Madu bisa meredakan batuk anak", verdict: "benar", text: "Untuk anak usia 1 tahun ke atas, madu boleh diberikan, termasuk untuk batuk. Di bawah 12 bulan tetap dilarang.", src: ["honey", "coughhoney"], aliases: ["madu buat batuk", "madu batuk anak", "madu hangat"], examples: ["anak 2thn batuk boleh madu ga", "madu buat batuk bayi 6 bln"] },
  { id: "gel-gigi", order: 3, claim: "Gel oles benzokain aman untuk meredakan sakit tumbuh gigi", verdict: "tidak", text: "Jangan pakai gel atau obat oles benzokain untuk anak di bawah 2 tahun: risiko methemoglobinemia yang bisa fatal, manfaatnya kecil.", src: ["fda_teething"], aliases: ["gel gigi", "gel gusi", "bonjela", "kamistad", "benzokain"], examples: ["gel gusi buat bayi tumbuh gigi aman ga", "oles kamistad ke gusi bayi boleh"] },
  { id: "kalung-gigi", order: 4, claim: "Kalung atau gelang tumbuh gigi (amber, kayu) aman untuk bayi", verdict: "tidak", text: "Jangan pakai kalung atau gelang tumbuh gigi karena risiko tercekik dan tersedak.", src: ["fda_jewelry"], aliases: ["kalung amber", "gelang gigi", "kalung gigi", "kalung tumbuh gigi"], examples: ["kalung amber buat gigi bayi aman ga", "gelang amber bayi bahaya ga"] },
  { id: "obat-diare", order: 5, claim: "Anak mencret perlu diberi obat anti-diare", verdict: "tidak", text: "WHO menganjurkan oralit dan zinc, bukan obat anti-diare.", src: ["who_ors"], aliases: ["obat mencret", "diapet", "entrostop", "anti diare", "obat diare"], examples: ["anak mencret kasih diapet boleh ga", "obat berhentiin mencret bayi apa"] },
  { id: "antibiotik-diare", order: 6, claim: "Diare anak harus diberi antibiotik", verdict: "tidak", text: "Menurut WHO antibiotik hanya untuk diare berdarah/disentri, dan diputuskan dokter.", src: ["who_ors"], aliases: ["antibiotik mencret", "amoxicillin diare", "antibiotik diare"], examples: ["mencret kasih amoxicillin boleh", "diare perlu antibiotik ga bun"] },
  { id: "obat-batpil", order: 7, claim: "Obat batuk-pilek bebas aman untuk bayi dan balita", verdict: "tidak", text: "Jangan beri obat batuk-pilek bebas yang mengandung dekongestan atau antihistamin untuk anak di bawah 2 tahun karena efek samping serius. Menurut AAP, risikonya lebih besar daripada manfaatnya.", src: ["fda_cough", "coughhoney"], aliases: ["obat batuk bayi", "obat flu bayi", "sirup batuk", "dekongestan"], examples: ["bayi 1thn batuk pilek kasih obat flu boleh", "sirup batuk buat balita aman ga"] },
  { id: "simetikon-kolik", order: 8, claim: "Simetikon atau obat GERD efektif untuk kolik", verdict: "tidak", text: "Simetikon dan obat GERD umumnya tidak efektif untuk kolik.", src: ["amboss_colic"], aliases: ["obat kolik", "simetikon", "infacol", "obat kembung bayi"], examples: ["bayi kolik kasih infacol manjur ga", "obat gerd buat kolik bayi"] },
  { id: "air-putih", order: 9, claim: "Bayi di bawah 6 bulan perlu diberi air putih atau makanan lain", verdict: "tidak", text: "ASI saja selama 6 bulan pertama, tanpa makanan atau minuman lain, termasuk air.", src: ["who_bf"], aliases: ["air putih bayi", "bayi minum air", "kasih air", "pisang bayi 4 bulan"], examples: ["bayi 3 bln boleh minum air putih ga", "bayi 4bln udah dikasih pisang boleh ga"] },
  { id: "emut-tangan", order: 11, claim: "Bayi mengemut tangan pasti masih lapar", verdict: "tidak", text: "Tangan ke mulut memang salah satu tanda lapar, tetapi bayi juga mengisap untuk menenangkan diri. Lihat tanda lain (mencari puting, mengecap, gelisah) dan tanda kenyang (menutup mulut, memalingkan kepala, tangan rileks).", src: ["aap_cues", "cdc_cues"], aliases: ["ngemut tangan", "emut tangan", "isap tangan", "tangan diemut", "ngenyot tangan", "jempol"], examples: ["bayi ngemut tangan berarti lapar kan", "tangan diemut terus abis nyusu, kasih lagi?"] },
  { id: "tidur-tengkurap", order: 10, claim: "Bayi aman tidur tengkurap, miring, atau dengan bantal dan bumper", verdict: "tidak", text: "Telentang setiap kali tidur sampai usia 1 tahun; miring dan tengkurap tidak aman. Area tidur harus kosong tanpa bantal, bumper, atau selimut longgar.", src: ["aap_sleep"], aliases: ["tidur tengkurap", "bantal bayi", "bumper", "tidur miring", "bantal peyang"], examples: ["bayi tidur tengkurap boleh ga", "pasang bumper di box bayi aman gak"] },
];

const meta = {
  version: "2026.11.08-1",
  verifiedDate: "2026-11-07",
  lastCheck: "2026-11-07",
  reviewMonths: 12,
  note: "Basis pengetahuan awal dari riset 7 November 2026. Setiap fakta punya sumber; sumber sekunder ditandai."
};

module.exports = { guides, milestones, imunisasi, obat, mitos, meta };
