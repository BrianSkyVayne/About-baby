// Panduan, milestone, imunisasi, keamanan obat.
const guides = [
  { id: "asi", order: 1, title: "ASI", sections: [
    { h: "Rekomendasi WHO", items: [
      { t: "Mulai menyusu dalam 1 jam pertama setelah lahir.", src: ["who_bf"] },
      { t: "ASI saja selama 6 bulan pertama, tanpa makanan atau minuman lain, termasuk air.", src: ["who_bf", "cdc_milestones"] },
      { t: "Lanjutkan menyusu bersama MPASI sampai 2 tahun atau lebih, sesuai permintaan bayi.", src: ["who_bf"] }
    ] },
    { h: "Tanda asupan cukup (bayi baru lahir)", items: [
      { t: "Menyusu 8–12 kali dalam 24 jam.", src: ["newborn_intake"] },
      { t: "Mulai hari ke-5: minimal 6 popok basah sehari.", src: ["newborn_intake"] },
      { t: "Berat turun di hari-hari awal itu normal; kebanyakan bayi kembali ke berat lahir di hari ke-10–14. Penurunan 10% atau lebih perlu dievaluasi.", src: ["newborn_intake"] }
    ] }
  ] },
  { id: "mpasi", order: 2, title: "MPASI", sections: [
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
      { t: "Madu dilarang sebelum usia 12 bulan dalam bentuk apa pun, termasuk yang dimasak atau dioleskan ke dot (risiko botulisme bayi). Ibu menyusui yang makan madu tidak menularkan spora lewat ASI.", src: ["honey"] },
      { t: "Usia 12 bulan ke atas: jus tidak perlu. Bila diberi, maksimal ±120 ml jus buah 100% per hari; hindari minuman manis lain.", src: ["cdc_milestones"] }
    ] }
  ] },
  { id: "suplemen", order: 3, title: "Vitamin & suplemen", sections: [
    { h: "Vitamin D", items: [
      { t: "400 IU per hari untuk bayi sampai usia 1 tahun (bayi ASI atau ASI sebagian, mulai hari-hari pertama); 600 IU per hari di atas 1 tahun.", src: ["aap_vitd"] },
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
      { t: "Kapsul biru 100.000 IU untuk bayi 6–11 bulan (1 kali). Kapsul merah 200.000 IU untuk anak 12–59 bulan (2 kali setahun) dan ibu nifas.", src: ["kemenkes_vita"] }
    ] }
  ] },
  { id: "tidur", order: 4, title: "Tidur aman", sections: [
    { h: "Rekomendasi AAP 2022", items: [
      { t: "Telentang setiap kali tidur sampai usia 1 tahun. Miring dan tengkurap tidak aman.", src: ["aap_sleep"] },
      { t: "Alas datar, keras, tidak miring. Area tidur kosong: tanpa selimut longgar, bantal, bumper, atau boneka.", src: ["aap_sleep"] },
      { t: "Sekamar dengan orang tua tetapi tidak seranjang, idealnya minimal 6 bulan pertama.", src: ["aap_sleep"] },
      { t: "Hindari tempat tidur miring, bedong atau selimut berpemberat, dan tidur di sofa atau kursi.", src: ["aap_sleep"] },
      { t: "Tummy time saat bayi bangun dan diawasi, sejak pulang dari rumah sakit.", src: ["aap_sleep"] }
    ] },
    { h: "Durasi tidur (WHO, termasuk tidur siang)", table: { head: ["Usia", "Tidur per hari"], rows: [["0–3 bulan", "14–17 jam"], ["4–11 bulan", "12–16 jam"], ["1–2 tahun", "11–14 jam"], ["3–4 tahun", "10–13 jam"]] }, src: ["who_activity"] }
  ] },
  { id: "layar", order: 5, title: "Layar & aktivitas", sections: [
    { h: "WHO 2019", table: { head: ["Usia", "Aktivitas", "Layar"], rows: [
      ["< 1 tahun", "Aktif beberapa kali sehari; tummy time minimal 30 menit/hari bagi yang belum bisa bergerak sendiri", "Tidak dianjurkan"],
      ["1–2 tahun", "Minimal 180 menit/hari", "1 tahun: tidak dianjurkan; 2 tahun: maksimal 1 jam"],
      ["3–4 tahun", "Minimal 180 menit/hari, 60 menit di antaranya intensitas sedang–berat", "Maksimal 1 jam"]
    ] }, src: ["who_activity"] },
    { h: "Catatan", items: [
      { t: "Jangan biarkan anak terikat di stroller, kursi makan, atau gendongan lebih dari 1 jam sekaligus.", src: ["who_activity"] },
      { t: "CDC: layar tidak dianjurkan di bawah 2 tahun kecuali video call dengan keluarga.", src: ["cdc_milestones"] }
    ] }
  ] },
  { id: "tersedak", order: 6, title: "Tersedak", sections: [
    { h: "Bayi di bawah 1 tahun yang tidak bisa menangis atau batuk", items: [
      { t: "1. Telungkupkan bayi di lengan Anda, kepala lebih rendah dari dada, lalu beri 5 tepukan di punggung di antara tulang belikat.", src: ["medline_choke", "acep_choke"] },
      { t: "2. Bila belum keluar, balikkan bayi telentang dan beri 5 tekanan dada dengan 2 jari di tengah tulang dada.", src: ["medline_choke"] },
      { t: "3. Ulangi bergantian sampai benda keluar. Bila bayi tidak sadar, panggil bantuan dan mulai RJP.", src: ["medline_choke", "acep_choke"] },
      { t: "Jangan lakukan hentakan perut pada bayi di bawah 1 tahun, dan jangan mencolok jari ke mulut bila bendanya tidak terlihat.", src: ["acep_choke"] }
    ] },
    { h: "Anak 1 tahun ke atas", items: [
      { t: "Bila anak masih bisa batuk kuat, biarkan ia terus batuk.", src: ["redcross_choke"] },
      { t: "Bila tidak bisa bernapas, bicara, atau batuk: 5 tepukan punggung lalu 5 hentakan perut, bergantian.", src: ["redcross_choke"] }
    ] }
  ] },
  { id: "gigi", order: 7, title: "Tumbuh gigi", sections: [
    { h: "Yang perlu dihindari (FDA)", items: [
      { t: "Jangan pakai gel atau obat oles benzokain untuk anak di bawah 2 tahun.", src: ["fda_teething"] },
      { t: "Jangan pakai kalung atau gelang tumbuh gigi (amber, kayu, dan lainnya) karena risiko tercekik dan tersedak.", src: ["fda_jewelry"] }
    ] },
    { h: "Kontrol gigi", items: [
      { t: "Kontrol pertama ke dokter gigi saat gigi pertama tumbuh atau menjelang usia 12 bulan.", src: ["gigi_idai"] }
    ] }
  ] },
  { id: "bbl", order: 8, title: "Bayi baru lahir", sections: [
    { h: "Skrining", items: [
      { t: "SHK (Skrining Hipotiroid Kongenital): 2–3 tetes darah tumit di usia 48–72 jam, gratis di fasilitas kesehatan. Bila positif, diobati sebelum usia 1 bulan.", src: ["kemenkes_shk"] },
      { t: "Skrining pendengaran: sebelum usia 1 bulan; bila tidak lolos, diagnosis sebelum 3 bulan dan intervensi sebelum 6 bulan.", src: ["jcih"] }
    ] },
    { h: "Perawatan", items: [
      { t: "Tali pusat dirawat bersih dan kering.", src: ["who_cord"] },
      { t: "Kuning: AAP menganjurkan semua bayi diperiksa bilirubin di usia 24–48 jam. Kuning dalam 24 jam pertama, urin gelap, atau tinja pucat perlu diperiksa.", src: ["aap_bili"] }
    ] }
  ] },
  { id: "tumbuh", order: 9, title: "Pertumbuhan", sections: [
    { h: "Stunting (standar WHO)", items: [
      { t: "Stunting: panjang/tinggi badan menurut umur di bawah −2 SD median WHO; stunting berat di bawah −3 SD.", src: ["stunting"] },
      { t: "Ukur panjang berbaring untuk anak di bawah 2 tahun, tinggi berdiri untuk 2 tahun ke atas.", src: ["stunting"] },
      { t: "Ukur tinggi juga, bukan hanya berat. Masa paling menentukan adalah sejak kehamilan sampai usia 2 tahun.", src: ["stunting"] }
    ] }
  ] },
  { id: "aman", order: 10, title: "Pencegahan cedera", sections: [
    { h: "WHO", items: [
      { t: "Anak usia 0–4 tahun punya angka tenggelam tertinggi. Risiko naik saat anak dekat air tanpa pengawasan aktif orang dewasa.", src: ["who_drowning"] },
      { t: "Penyebab utama kematian akibat cedera pada anak: kecelakaan lalu lintas, tenggelam, luka bakar, jatuh, dan keracunan.", src: ["who_injury"] },
      { t: "Simpan obat, bahan kimia, dan pembersih terkunci dan jauh dari jangkauan anak.", src: ["cdc_milestones"] }
    ] }
  ] },
  { id: "ibu", order: 11, title: "Kesehatan ibu", sections: [
    { h: "Baby blues atau depresi pascapersalinan?", table: { head: ["", "Baby blues", "Depresi pascapersalinan"], rows: [
      ["Kejadian", "Sekitar 8 dari 10 ibu", "Sekitar 1–2 dari 10 ibu"],
      ["Mulai", "2–3 hari setelah melahirkan", "Beberapa minggu sampai 1 tahun setelah melahirkan"],
      ["Lama", "Sampai ± 2 minggu", "Berbulan-bulan atau lebih"],
      ["Gejala", "Mood naik-turun, cemas, menangis, sulit tidur", "Lebih berat: putus asa, kehilangan minat, mudah marah, sulit konsentrasi, pikiran menyakiti bayi"]
    ] }, src: ["ppd"] },
    { h: "Kapan mencari bantuan", items: [
      { t: "Gejala lebih dari 2 minggu, makin berat, atau mengganggu merawat diri dan bayi: hubungi dokter, bidan, atau psikolog.", src: ["ppd"] },
      { t: "Ada pikiran menyakiti diri atau bayi: cari bantuan hari ini.", src: ["ppd"] }
    ] }
  ] },
  { id: "skrining", order: 12, title: "Skrining perkembangan", sections: [
    { h: "Jadwal (AAP)", items: [
      { t: "Skrining perkembangan umum di usia 9, 18, dan 24 atau 30 bulan.", src: ["cdc_autism"] },
      { t: "Skrining autisme (misalnya M-CHAT-R) di usia 18 dan 24 bulan untuk semua anak.", src: ["cdc_autism"] }
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
  note: "Sumber sekunder (Bio Farma mengutip IDAI 2024). Cocokkan dengan jadwal resmi IDAI atau buku KIA sebelum dijadikan patokan; IDAI merevisi jadwal sekitar tiap 3 tahun.",
  src: ["idai_imun"],
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
  { id: "batukpilek", order: 1, name: "Obat batuk-pilek bebas (OTC)", status: "hindari", age: "< 2 tahun (label produsen: < 4 tahun)", t: "Jangan beri obat batuk-pilek bebas yang mengandung dekongestan atau antihistamin untuk anak di bawah 2 tahun karena efek samping serius, termasuk kejang dan kematian. Produsen melabeli \"jangan dipakai di bawah 4 tahun\". Obat ini hanya meredakan gejala.", src: ["fda_cough"] },
  { id: "benzokain", order: 2, name: "Gel/obat oles benzokain (tumbuh gigi)", status: "hindari", age: "< 2 tahun", t: "Risiko methemoglobinemia yang bisa fatal, dengan manfaat kecil.", src: ["fda_teething"] },
  { id: "madu", order: 3, name: "Madu", status: "hindari", age: "< 12 bulan", t: "Risiko botulisme bayi, dalam bentuk apa pun. Usia 1 tahun ke atas boleh, termasuk untuk batuk.", src: ["honey", "coughhoney"] },
  { id: "antidiare", order: 4, name: "Obat anti-diare", status: "hindari", age: "Anak", t: "WHO menganjurkan oralit dan zinc, bukan obat anti-diare.", src: ["who_ors"] },
  { id: "antibiotik-diare", order: 5, name: "Antibiotik untuk diare", status: "dokter", age: "Anak", t: "Menurut WHO hanya untuk diare berdarah/disentri, dan diputuskan dokter.", src: ["who_ors"] },
  { id: "simetikon", order: 6, name: "Simetikon / obat GERD untuk kolik", status: "info", age: "Bayi", t: "Umumnya tidak efektif untuk kolik.", src: ["amboss_colic"] },
  { id: "oralit", order: 7, name: "Oralit", status: "program", age: "Anak dengan diare", t: "Setiap kali BAB cair: usia < 2 tahun 50–100 ml, usia 2–10 tahun 100–200 ml.", src: ["who_ors", "unicef_ors"] },
  { id: "zinc", order: 8, name: "Zinc", status: "program", age: "Anak dengan diare", t: "10–14 hari sejak awal diare: usia < 6 bulan 10 mg/hari, usia ≥ 6 bulan 20 mg/hari.", src: ["who_ors"] },
  { id: "vita", order: 9, name: "Vitamin A", status: "program", age: "6–59 bulan", t: "Kapsul biru 100.000 IU (6–11 bulan, 1 kali); kapsul merah 200.000 IU (12–59 bulan, Februari dan Agustus).", src: ["kemenkes_vita"] },
  { id: "vitd", order: 10, name: "Vitamin D", status: "program", age: "0–1 tahun & di atasnya", t: "400 IU/hari sampai 1 tahun, 600 IU/hari di atas 1 tahun.", src: ["aap_vitd", "idai_vitd"] },
  { id: "besi", order: 11, name: "Zat besi", status: "program", age: "4 bulan–2 tahun", t: "IDAI: bayi cukup bulan 2 mg/kgBB/hari (maks. 15 mg/hari); BBLR 3 mg/kgBB/hari mulai 1 bulan.", src: ["idai_besi"] },
  { id: "penurunpanas", order: 12, name: "Paracetamol, ibuprofen, dan obat lain", status: "dokter", age: "Semua usia", t: "Dosis bergantung berat badan dan sediaan. Aplikasi ini tidak memuat dosis; ikuti label kemasan, apoteker, atau dokter.", src: [] }
];

const meta = {
  version: "2026.11.07-2",
  verifiedDate: "2026-11-07",
  lastCheck: "2026-11-07",
  reviewMonths: 12,
  note: "Basis pengetahuan awal dari riset 7 November 2026. Setiap fakta punya sumber; sumber sekunder ditandai."
};

module.exports = { guides, milestones, imunisasi, obat, meta };
