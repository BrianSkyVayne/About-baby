// Penilai gejala. Level: 1 Umum, 2 Pantau, 3 Periksa hari ini, 4 Segera ke IGD, 0 = catatan (tidak mengubah tingkat).
// Kondisi: {yes:q} {no:q} {eq:[q,v]} {num:[q,op,n]} {age:[op,hari]} {all:[]} {any:[]} {not:c} {count:{of:[],min:n}}
const YN = "yn";

const tandaBahayaUmum = [
  { id: "lemas", text: "Anak lemas sekali, sulit dibangunkan, atau tidak merespons saat dipanggil?", type: YN },
  { id: "kejang", text: "Anak kejang sekarang atau barusan?", type: YN },
  { id: "tdkminum", text: "Anak tidak bisa minum atau menyusu sama sekali?", type: YN },
  { id: "muntahsemua", text: "Anak memuntahkan semua yang diminum (tidak ada yang tertahan)?", type: YN }
];
const rulesBahayaUmum = [
  { id: "r-lemas", when: { yes: "lemas" }, level: 4, text: "Lemas atau sulit dibangunkan termasuk tanda bahaya umum WHO. Anak yang letargis berbeda dengan anak yang sekadar tidur: ia tidak bisa dibangunkan sepenuhnya.", src: ["who_imci_danger", "who_dehid"] },
  { id: "r-kejang", when: { yes: "kejang" }, level: 4, text: "Kejang termasuk tanda bahaya umum WHO.", src: ["who_imci_danger"] },
  { id: "r-tdkminum", when: { yes: "tdkminum" }, level: 4, text: "Tidak bisa minum atau menyusu termasuk tanda bahaya umum WHO.", src: ["who_imci_danger", "who_newborn"] },
  { id: "r-muntahsemua", when: { yes: "muntahsemua" }, level: 4, text: "Memuntahkan semua yang diminum termasuk tanda bahaya umum WHO.", src: ["who_imci_danger"] }
];

module.exports = [
  {
    id: "gumoh",
    order: 1,
    title: "Gumoh & muntah bayi",
    short: "Bayi di bawah 1 tahun yang gumoh atau muntah",
    needsAge: true,
    danger: ["lemas", "tdkminum", "muntahsemua"],
    questions: [
      ...tandaBahayaUmum.filter(q => q.id !== "kejang"),
      { id: "hijau", text: "Muntahan berwarna hijau?", type: YN },
      { id: "darah", text: "Muntahan berdarah atau seperti ampas kopi?", type: YN },
      { id: "sembur", text: "Muntah menyembur kuat dan berulang hampir setiap selesai menyusu?", type: YN },
      { id: "memburuk", text: "Muntahnya makin sering atau makin kuat dari hari ke hari?", type: YN, showIf: { yes: "sembur" } },
      { id: "tolak", text: "Bayi menolak menyusu?", type: YN },
      { id: "popok", text: "Popok basah kurang dari 6 kali sehari?", type: YN, showIf: { age: [">=", 5] }, help: "Mulai hari ke-5, bayi umumnya membasahi minimal 6 popok sehari." },
      { id: "bb", text: "Berat badan tidak naik atau turun pada penimbangan terakhir?", type: YN, allowUnknown: true },
      { id: "rewel", text: "Rewel atau menangis berlebihan dalam waktu lama, atau sering melengkungkan punggung saat/sesudah menyusu?", type: YN },
      { id: "babdarah", text: "Ada darah di BAB?", type: YN },
      { id: "diare", text: "Diare (BAB cair lebih sering dari biasanya)?", type: YN },
      { id: "ruam", text: "Ada ruam kulit?", type: YN }
    ],
    rules: [
      ...rulesBahayaUmum.filter(r => r.id !== "r-kejang"),
      { id: "r-nb-tolak", when: { all: [{ age: ["<=", 28] }, { yes: "tolak" }] }, level: 4, text: "Pada bayi usia 0–28 hari, tidak mau menyusu dengan baik termasuk tanda bahaya bayi baru lahir menurut WHO.", src: ["who_newborn"] },
      { id: "r-hijau", when: { yes: "hijau" }, level: 3, text: "Muntah berwarna hijau perlu diperiksakan ke dokter hari ini, sesegera mungkin.", src: ["orami_gumoh"] },
      { id: "r-darah", when: { yes: "darah" }, level: 3, text: "Muntah berdarah atau seperti ampas kopi perlu diperiksakan ke dokter hari ini.", src: ["idai_gumoh", "orami_gumoh"] },
      { id: "r-sembur-sp", when: { all: [{ yes: "sembur" }, { age: [">=", 14] }, { age: ["<=", 56] }] }, level: 3, text: "Muntah menyembur yang berulang pada usia 2–8 minggu sebaiknya diperiksakan hari ini. Dokter akan menilai, salah satunya, kemungkinan stenosis pilorus (jarang).", src: ["rch_pyloric", "banner_pyloric"] },
      { id: "r-sembur", when: { all: [{ yes: "sembur" }, { not: { all: [{ age: [">=", 14] }, { age: ["<=", 56] }] } }] }, level: 3, text: "Muntah menyembur yang berulang hampir setiap menyusu sebaiknya diperiksakan hari ini.", src: ["rch_pyloric", "orami_gumoh"] },
      { id: "r-popok", when: { yes: "popok" }, level: 3, text: "Popok basah kurang dari 6 kali sehari setelah hari ke-5 bisa menandakan asupan kurang. Sebaiknya bayi ditimbang dan diperiksa hari ini.", src: ["newborn_intake"] },
      { id: "r-bb", when: { yes: "bb" }, level: 3, text: "Berat badan yang tidak naik termasuk tanda yang membedakan GERD dari gumoh biasa. Periksakan ke dokter.", src: ["idai_gumoh", "hegar"] },
      { id: "r-tolak", when: { all: [{ age: [">", 28] }, { yes: "tolak" }] }, level: 3, text: "Menolak menyusu termasuk tanda yang perlu diperiksakan ke dokter.", src: ["idai_gumoh"] },
      { id: "r-babdarah", when: { yes: "babdarah" }, level: 3, text: "Darah di BAB perlu diperiksakan ke dokter.", src: ["who_ors", "idai_alergi"] },
      { id: "r-rewel", when: { all: [{ yes: "rewel" }, { not: { any: [{ yes: "bb" }, { yes: "tolak" }] } }] }, level: 2, text: "Rewel atau menangis lama saja belum berarti GERD; menurut ahli gastroenterologi anak, gejala ini juga ditemukan pada bayi sehat. Pantau, dan sampaikan ke dokter bila berlanjut atau muncul tanda lain.", src: ["hegar"] },
      { id: "r-diare", when: { all: [{ yes: "diare" }, { no: "babdarah" }] }, level: 2, text: "Ada diare. Gunakan juga penilai \"Diare & dehidrasi\" untuk melihat tanda dehidrasi.", src: ["who_dehid"] },
      { id: "r-ruam", when: { all: [{ yes: "ruam" }, { no: "babdarah" }, { no: "diare" }] }, level: 2, text: "Ruam saja belum mengarah ke kondisi tertentu. Pantau, dan sampaikan ke dokter saat kontrol.", src: ["idai_alergi"] }
    ],
    default: { level: 1, title: "Umum", text: "Gumoh dialami sekitar 3 dari 10 bayi, paling sering di usia 3–4 bulan, dan berkurang sampai usia 12 bulan. Bayi yang gumoh tetapi tetap aktif, mau menyusu, dan beratnya naik disebut happy spitter.", src: ["hegar", "idai_gumoh"] },
    differentials: [
      { name: "Gumoh normal (regurgitasi)", freq: "Sekitar 3 dari 10 bayi", features: "Keluar pelan atau meleleh, bayi tetap aktif dan tumbuh.", baseline: true, src: ["hegar"] },
      { name: "GERD", freq: "3–8 dari 100 bayi", features: "Disertai berat badan tidak naik, menolak menyusu, rewel berkepanjangan, punggung melengkung, atau muntah darah.", when: { any: [{ yes: "bb" }, { count: { of: [{ yes: "rewel" }, { yes: "tolak" }, { yes: "darah" }], min: 2 } }] }, src: ["hegar", "idai_gumoh"] },
      { name: "Alergi protein susu sapi", freq: "3–4 dari 100 bayi", features: "Disertai gejala pencernaan (diare, bisa berdarah, kolik), kulit (ruam), atau napas. Dipastikan dokter lewat uji eliminasi lalu provokasi.", when: { any: [{ yes: "babdarah" }, { count: { of: [{ yes: "ruam" }, { yes: "diare" }, { yes: "rewel" }], min: 2 } }] }, src: ["idai_alergi"] },
      { name: "Stenosis pilorus", freq: "2–5 dari 1.000 bayi", features: "Usia 2–8 minggu, muntah menyembur yang makin kuat, tidak hijau, bayi tetap lapar, berat turun. Dipastikan dengan USG.", when: { all: [{ yes: "sembur" }, { age: [">=", 14] }, { age: ["<=", 56] }] }, src: ["rch_pyloric", "banner_pyloric"] }
    ],
    care: [
      { t: "Susui sebelum bayi sangat lapar.", src: ["aap_spitup"] },
      { t: "Sendawakan di sela-sela menyusu, bukan hanya di akhir.", src: ["aap_spitup"] },
      { t: "Setelah menyusu, gendong tegak minimal 20 menit dan hindari main aktif.", src: ["aap_spitup"] },
      { t: "Ikuti tanda lapar dan kenyang bayi. Bila masih ada tanda lapar setelah gumoh, boleh disusui lagi; bila sudah tampak kenyang, tidak perlu dipaksa.", src: ["cdc_milestones"] },
      { t: "Lanjutkan ASI dan hindari pemberian berlebihan. Penanganan awal gumoh tidak memakai obat.", src: ["hegar"] },
      { t: "Saat tidur, tetap telentang.", src: ["aap_sleep"] }
    ],
    escalate: ["Muntah mulai menyembur dan berulang hampir setiap menyusu", "Muntahan hijau atau berdarah", "Popok basah berkurang", "Bayi lemas atau menolak menyusu"]
  },

  {
    id: "demam",
    order: 2,
    title: "Demam",
    short: "Kapan demam cukup dipantau dan kapan perlu ke dokter",
    needsAge: true,
    danger: ["lemas", "kejang", "tdkminum", "muntahsemua", "tarikan"],
    questions: [
      { id: "demamya", text: "Suhu anak terukur demam dengan termometer?", type: YN },
      { id: "suhu", text: "Suhu terukur (°C)", type: "number", unit: "°C", step: 0.1, optional: true },
      { id: "hari", text: "Sudah berapa hari demam?", type: "number", unit: "hari", step: 1, optional: true, showIf: { yes: "demamya" } },
      ...tandaBahayaUmum,
      { id: "tarikan", text: "Dada bagian bawah tertarik ke dalam setiap kali menarik napas?", type: YN },
      { id: "napascepat", text: "Napas tampak cepat?", type: YN, help: "Hitung napas 60 detik di menu Hitung Napas untuk memastikan." }
    ],
    rules: [
      ...rulesBahayaUmum,
      { id: "r-nb-panas", when: { all: [{ age: ["<=", 28] }, { num: ["suhu", ">=", 37.5] }] }, level: 4, text: "Pada bayi usia 0–28 hari, suhu ≥ 37,5 °C termasuk tanda bahaya bayi baru lahir menurut WHO.", src: ["who_newborn"] },
      { id: "r-nb-dingin", when: { all: [{ age: ["<=", 28] }, { num: ["suhu", "<", 35.5] }] }, level: 4, text: "Pada bayi usia 0–28 hari, suhu < 35,5 °C termasuk tanda bahaya bayi baru lahir menurut WHO.", src: ["who_newborn"] },
      { id: "r-tarikan", when: { yes: "tarikan" }, level: 4, text: "Tarikan dinding dada bagian bawah termasuk tanda pneumonia berat menurut WHO, perlu dirujuk segera.", src: ["who_imci_pneu"] },
      { id: "r-3bln", when: { all: [{ age: ["<", 90] }, { yes: "demamya" }] }, level: 3, text: "Menurut IDAI, bayi di bawah 3 bulan yang demam dibawa ke dokter, apa pun keadaan umumnya.", src: ["idai_demam"] },
      { id: "r-3hari", when: { all: [{ age: [">=", 90] }, { age: ["<=", 1095] }, { num: ["hari", ">", 3] }] }, level: 3, text: "Menurut IDAI, anak usia 3–36 bulan yang demam lebih dari 3 hari dibawa ke dokter.", src: ["idai_demam"] },
      { id: "r-napascepat", when: { yes: "napascepat" }, level: 2, text: "Napas tampak cepat perlu dipastikan dengan menghitung 60 detik penuh saat anak tenang (menu Hitung Napas). Bila memenuhi ambang WHO untuk usianya, periksakan hari ini.", src: ["who_imci_pneu"] },
      { id: "r-tua", when: { all: [{ age: [">", 1095] }, { num: ["hari", ">", 3] }] }, level: 2, text: "Aplikasi belum punya pedoman terverifikasi untuk demam lebih dari 3 hari pada usia di atas 3 tahun. Bila ragu, konsultasikan ke dokter.", src: [] },
      { id: "n-dbd", when: { num: ["hari", ">=", 2] }, level: 0, text: "Di daerah DBD, perhatikan juga penilai \"DBD\": demam yang turun setelah sekitar 3 hari justru masuk fase kritis.", src: ["kemenkes_dbd"] }
    ],
    default: { level: 1, title: "Pantau di rumah", text: "Demam adalah gejala, bukan penyakit, dan tinggi suhu tidak selalu menunjukkan beratnya kondisi. Belum ada kriteria rujukan yang terpenuhi dari jawaban Anda.", src: ["idai_demam"] },
    differentials: [],
    care: [
      { t: "Obat penurun panas diberikan sesuai label kemasan atau arahan apoteker/dokter. Aplikasi ini sengaja tidak memberi dosis obat.", src: [] }
    ],
    escalate: ["Lemas atau sulit dibangunkan", "Kejang", "Tidak bisa minum atau menyusu", "Dada bawah tertarik ke dalam saat bernapas", "Usia di bawah 3 bulan", "Usia 3–36 bulan dan demam lebih dari 3 hari"]
  },

  {
    id: "diare",
    order: 3,
    title: "Diare & dehidrasi",
    short: "Menilai dehidrasi dengan tabel WHO",
    needsAge: true,
    questions: [
      { id: "kondisi", text: "Bagaimana kondisi anak?", type: "choice", options: [{ v: "baik", label: "Sadar dan aktif seperti biasa" }, { v: "gelisah", label: "Gelisah, rewel" }, { v: "lemas", label: "Lemas, sulit dibangunkan, atau tidak sadar" }] },
      { id: "mata", text: "Mata tampak cekung (lebih cekung dari biasanya)?", type: YN },
      { id: "minum", text: "Bagaimana anak minum?", type: "choice", options: [{ v: "biasa", label: "Minum seperti biasa" }, { v: "haus", label: "Haus, minum dengan lahap" }, { v: "buruk", label: "Minum sangat sedikit atau tidak bisa minum" }] },
      { id: "cubit", text: "Cubit kulit perut lalu lepaskan. Bagaimana kembalinya?", type: "choice", options: [{ v: "cepat", label: "Langsung kembali" }, { v: "lambat", label: "Kembali lambat" }, { v: "sangat", label: "Kembali sangat lambat (lebih dari 2 detik)" }], help: "Cara ini kurang akurat pada anak gizi buruk atau anak gemuk." },
      { id: "tinjadarah", text: "Ada darah di tinja?", type: YN },
      { id: "lama", text: "Diare sudah lebih dari 14 hari?", type: YN }
    ],
    rules: [
      { id: "r-berat", when: { count: { of: [{ eq: ["kondisi", "lemas"] }, { yes: "mata" }, { eq: ["minum", "buruk"] }, { eq: ["cubit", "sangat"] }], min: 2 } }, level: 4, text: "Sesuai kriteria dehidrasi berat WHO (minimal 2 tanda berat). Bawa ke IGD sekarang.", src: ["who_dehid"] },
      { id: "r-sedang", when: { all: [
        { count: { of: [{ any: [{ eq: ["kondisi", "gelisah"] }, { eq: ["kondisi", "lemas"] }] }, { yes: "mata" }, { any: [{ eq: ["minum", "haus"] }, { eq: ["minum", "buruk"] }] }, { any: [{ eq: ["cubit", "lambat"] }, { eq: ["cubit", "sangat"] }] }], min: 2 } },
        { not: { count: { of: [{ eq: ["kondisi", "lemas"] }, { yes: "mata" }, { eq: ["minum", "buruk"] }, { eq: ["cubit", "sangat"] }], min: 2 } } }
      ] }, level: 3, text: "Sesuai kriteria dehidrasi ringan–sedang WHO (minimal 2 tanda). Berikan oralit sedikit-sedikit tapi sering, dan bawa ke puskesmas atau dokter hari ini untuk dinilai.", src: ["who_dehid", "who_ors"] },
      { id: "r-lemas1", when: { all: [{ eq: ["kondisi", "lemas"] }] }, level: 4, text: "Lemas atau sulit dibangunkan termasuk tanda bahaya umum WHO, walaupun tanda dehidrasi lain belum lengkap.", src: ["who_imci_danger"] },
      { id: "r-buruk1", when: { eq: ["minum", "buruk"] }, level: 4, text: "Tidak bisa minum termasuk tanda bahaya umum WHO.", src: ["who_imci_danger"] },
      { id: "r-satu", when: { all: [
        { count: { of: [{ eq: ["kondisi", "gelisah"] }, { yes: "mata" }, { eq: ["minum", "haus"] }, { eq: ["cubit", "lambat"] }], min: 1 } },
        { not: { count: { of: [{ any: [{ eq: ["kondisi", "gelisah"] }, { eq: ["kondisi", "lemas"] }] }, { yes: "mata" }, { any: [{ eq: ["minum", "haus"] }, { eq: ["minum", "buruk"] }] }, { any: [{ eq: ["cubit", "lambat"] }, { eq: ["cubit", "sangat"] }] }], min: 2 } } }
      ] }, level: 2, text: "Ada 1 tanda, belum memenuhi kriteria dehidrasi WHO (butuh minimal 2). Lanjutkan oralit dan pantau.", src: ["who_dehid"] },
      { id: "r-darah", when: { yes: "tinjadarah" }, level: 3, text: "Diare berdarah perlu diperiksakan ke dokter. Menurut WHO, antibiotik hanya untuk diare berdarah/disentri, dan diputuskan dokter.", src: ["who_ors"] },
      { id: "r-lama", when: { yes: "lama" }, level: 3, text: "Diare lebih dari 14 hari berada di luar protokol perawatan rumah WHO. Periksakan ke dokter.", src: ["unicef_ors"] }
    ],
    default: { level: 1, title: "Tanpa tanda dehidrasi", text: "Sesuai kolom \"tanpa dehidrasi\" pada tabel WHO. Diare tanpa darah dan kurang dari 14 hari bisa dirawat di rumah dengan oralit dan zinc.", src: ["who_dehid", "unicef_ors"] },
    differentials: [],
    care: [
      { t: "Oralit setiap kali BAB cair: usia < 2 tahun 50–100 ml, usia 2–10 tahun 100–200 ml.", src: ["who_ors", "unicef_ors"] },
      { t: "Zinc selama 10–14 hari sejak awal diare: usia < 6 bulan 10 mg/hari, usia ≥ 6 bulan 20 mg/hari. Habiskan walau diare sudah berhenti.", src: ["who_ors"] },
      { t: "Lanjutkan ASI dan makan seperti biasa.", src: ["who_ors"] },
      { t: "Jangan beri obat anti-diare.", src: ["who_ors"] }
    ],
    escalate: ["Anak lemas atau tidak bisa minum", "Mata makin cekung, cubitan kulit kembali lambat", "Ada darah di tinja", "Diare lebih dari 14 hari"]
  },

  {
    id: "napas",
    order: 4,
    title: "Batuk & napas",
    short: "Membedakan batuk pilek biasa dari pneumonia (kriteria WHO)",
    needsAge: true,
    danger: ["tarikan", "stridor", "lemas", "kejang", "tdkminum", "muntahsemua"],
    questions: [
      { id: "rr", text: "Jumlah napas dalam 60 detik (hitung saat anak tenang)", type: "number", unit: "×/menit", step: 1, optional: true, help: "Gunakan menu Hitung Napas bila belum menghitung." },
      { id: "tarikan", text: "Dada bagian bawah tertarik ke dalam setiap kali menarik napas?", type: YN },
      { id: "stridor", text: "Ada bunyi napas kasar (stridor) saat anak tenang?", type: YN },
      ...tandaBahayaUmum
    ],
    rules: [
      ...rulesBahayaUmum,
      { id: "r-tarikan", when: { yes: "tarikan" }, level: 4, text: "Tarikan dinding dada bagian bawah: sesuai kriteria pneumonia berat WHO, perlu dirujuk segera.", src: ["who_imci_pneu"] },
      { id: "r-stridor", when: { yes: "stridor" }, level: 4, text: "Stridor saat anak tenang termasuk tanda penyakit berat menurut WHO, perlu dirujuk segera.", src: ["who_imci_pneu"] },
      { id: "r-nb", when: { all: [{ age: ["<=", 28] }, { num: ["rr", ">", 60] }] }, level: 4, text: "Pada bayi usia 0–28 hari, napas lebih dari 60×/menit termasuk tanda bahaya bayi baru lahir menurut WHO.", src: ["who_newborn"] },
      { id: "r-gap", when: { all: [{ age: [">", 28] }, { age: ["<", 60] }, { num: ["rr", ">", 0] }] }, level: 2, text: "Aplikasi belum punya ambang napas cepat yang terverifikasi untuk usia 29–59 hari. Bila napas tampak cepat atau berat, periksakan.", src: [] },
      { id: "r-bayi", when: { all: [{ age: [">=", 60] }, { age: ["<", 365] }, { num: ["rr", ">=", 50] }] }, level: 3, text: "Napas ≥ 50×/menit pada usia 2–12 bulan: sesuai kriteria pneumonia WHO. Periksakan hari ini.", src: ["who_imci_pneu"] },
      { id: "r-balita", when: { all: [{ age: [">=", 365] }, { age: ["<=", 1825] }, { num: ["rr", ">=", 40] }] }, level: 3, text: "Napas ≥ 40×/menit pada usia 1–5 tahun: sesuai kriteria pneumonia WHO. Periksakan hari ini.", src: ["who_imci_pneu"] },
      { id: "r-norr", when: { all: [{ not: { num: ["rr", ">", 0] } }, { no: "tarikan" }, { no: "stridor" }] }, level: 2, text: "Jumlah napas belum dihitung. Kriteria WHO bergantung pada hitungan 60 detik, jadi hitung dulu di menu Hitung Napas.", src: ["who_imci_pneu"] }
    ],
    default: { level: 1, title: "Batuk/pilek biasa", text: "Tanpa napas cepat dan tanpa tarikan dada, gambaran ini sesuai klasifikasi \"batuk atau pilek, bukan pneumonia\" menurut WHO.", src: ["who_imci_pneu"] },
    differentials: [],
    care: [
      { t: "Jangan beri obat batuk-pilek bebas yang mengandung dekongestan atau antihistamin untuk anak di bawah 2 tahun.", src: ["fda_cough"] },
      { t: "Produsen melabeli obat batuk-pilek bebas \"jangan dipakai di bawah 4 tahun\". Obat ini hanya meredakan gejala, tidak mempercepat sembuh.", src: ["fda_cough"] },
      { t: "Madu boleh untuk batuk pada usia 1 tahun ke atas. Di bawah 1 tahun, madu dilarang dalam bentuk apa pun.", src: ["coughhoney", "honey"] }
    ],
    escalate: ["Dada bawah tertarik ke dalam", "Napas di atas ambang WHO untuk usianya", "Stridor saat tenang", "Lemas, kejang, atau tidak bisa minum"]
  },

  {
    id: "tangis",
    order: 5,
    title: "Tangisan & kolik",
    short: "Bayi rewel atau menangis lama",
    needsAge: true,
    danger: ["lemas"],
    questions: [
      { id: "pola", text: "Menangis atau rewel sekitar 3 jam sehari atau lebih, pada 3 hari atau lebih dalam seminggu?", type: YN },
      { id: "tumbuh", text: "Berat badan naik dengan baik?", type: YN, allowUnknown: true },
      { id: "demam", text: "Demam?", type: YN },
      { id: "muntah", text: "Muntah hijau atau menyembur?", type: YN },
      { id: "diare", text: "Diare hebat atau BAB berdarah?", type: YN },
      { id: "kembung", text: "Perut tampak kembung atau keras?", type: YN },
      { id: "malas", text: "Malas minum atau menyusu?", type: YN },
      { id: "lemas", text: "Lemas atau sulit dibangunkan?", type: YN },
      { id: "melengking", text: "Tangisan melengking yang tidak biasa?", type: YN }
    ],
    rules: [
      { id: "r-lemas", when: { yes: "lemas" }, level: 4, text: "Lemas atau sulit dibangunkan termasuk tanda bahaya umum WHO.", src: ["who_imci_danger"] },
      { id: "r-flag", when: { any: [{ yes: "demam" }, { yes: "muntah" }, { yes: "diare" }, { yes: "kembung" }, { yes: "malas" }, { yes: "melengking" }] }, level: 3, text: "Tangisan yang disertai tanda ini tidak termasuk kolik dan perlu diperiksakan ke dokter.", src: ["amboss_colic", "rome4"] },
      { id: "r-bb", when: { eq: ["tumbuh", "tidak"] }, level: 3, text: "Kolik hanya ditegakkan bila pertumbuhan baik. Berat badan yang tidak naik perlu diperiksakan.", src: ["rome4"] },
      { id: "r-usia", when: { all: [{ yes: "pola" }, { age: [">=", 150] }] }, level: 2, text: "Pola menangis ini terjadi di luar batas usia kolik menurut Rome IV (gejala mulai dan berhenti sebelum 5 bulan). Konsultasikan ke dokter.", src: ["rome4"] },
      { id: "n-kolik", when: { all: [{ yes: "pola" }, { age: ["<", 150] }, { not: { eq: ["tumbuh", "tidak"] } }] }, level: 0, text: "Gambaran ini sesuai kriteria kolik Rome IV bila bayi tetap tumbuh baik dan tidak demam atau sakit. Kolik memuncak sekitar usia 6 minggu dan membaik sampai 5 bulan.", src: ["rome4", "amboss_colic"] }
    ],
    default: { level: 1, title: "Umum", text: "Tangisan bayi sering paling berat di bulan-bulan pertama, lalu membaik.", src: ["cdc_milestones"] },
    differentials: [],
    care: [
      { t: "Jangan pernah mengguncang bayi. Bila mulai emosi, letakkan bayi di tempat tidur yang aman, menjauh sebentar, dan cek setiap 5–10 menit.", src: ["cdc_milestones"] },
      { t: "Menggendong dan merespons bayi tidak membuatnya manja.", src: ["cdc_milestones"] },
      { t: "Obat seperti simetikon atau obat GERD umumnya tidak efektif untuk kolik.", src: ["amboss_colic"] }
    ],
    escalate: ["Demam", "Muntah hijau atau menyembur", "BAB berdarah", "Malas menyusu", "Lemas", "Berat badan tidak naik"]
  },

  {
    id: "kejang",
    order: 6,
    title: "Kejang demam",
    short: "Mengenali kejang demam sederhana dan kompleks (AAP)",
    needsAge: true,
    questions: [
      { id: "demam", text: "Kejang terjadi saat demam (suhu ≥ 38 °C)?", type: YN },
      { id: "durasi", text: "Kejang berlangsung 15 menit atau lebih?", type: YN },
      { id: "fokal", text: "Kejang hanya di satu sisi atau satu bagian tubuh?", type: YN },
      { id: "ulang", text: "Kejang terjadi lebih dari sekali dalam 24 jam?", type: YN },
      { id: "sadar", text: "Anak sudah kembali sadar dan merespons seperti biasa?", type: YN }
    ],
    rules: [
      { id: "r-kejang", when: { any: [{ yes: "demam" }, { no: "demam" }] }, level: 4, text: "Kejang termasuk tanda bahaya umum WHO, jadi anak dibawa ke fasilitas kesehatan.", src: ["who_imci_danger"] },
      { id: "n-sederhana", when: { all: [{ yes: "demam" }, { age: [">=", 180] }, { age: ["<=", 1825] }, { no: "durasi" }, { no: "fokal" }, { no: "ulang" }] }, level: 0, text: "Gambaran ini sesuai kriteria kejang demam sederhana AAP: usia 6–60 bulan, seluruh tubuh, kurang dari 15 menit, tidak berulang dalam 24 jam. Kejang demam terjadi pada 2–5 dari 100 anak. Kejang demam sederhana umumnya tidak memerlukan EEG, tes darah, atau pencitraan; dokter fokus mencari sumber demam.", src: ["aap_febrile"] },
      { id: "n-kompleks", when: { all: [{ yes: "demam" }, { age: [">=", 180] }, { age: ["<=", 1825] }, { any: [{ yes: "durasi" }, { yes: "fokal" }, { yes: "ulang" }] }] }, level: 0, text: "Gambaran ini sesuai kriteria kejang demam kompleks AAP (fokal, 15 menit atau lebih, atau berulang dalam 24 jam).", src: ["aap_febrile"] },
      { id: "n-usia", when: { all: [{ yes: "demam" }, { any: [{ age: ["<", 180] }, { age: [">", 1825] }] }] }, level: 0, text: "Definisi kejang demam AAP berlaku untuk usia 6–60 bulan. Usia anak di luar rentang itu, jadi dokter perlu menilai penyebab lain.", src: ["aap_febrile"] },
      { id: "n-ulang", when: { yes: "demam" }, level: 0, text: "Sekitar 1 dari 3 anak mengalami kejang demam lagi. Obat penurun panas tidak mengurangi risiko kejang demam berulang.", src: ["aap_febrile", "febrile_5min"] }
    ],
    default: { level: 4, title: "Bawa ke fasilitas kesehatan", text: "Kejang termasuk tanda bahaya umum WHO.", src: ["who_imci_danger"] },
    differentials: [],
    care: [
      { t: "Pertolongan pertama kejang di rumah dan batas waktu memanggil ambulans belum diverifikasi di aplikasi ini. Ikuti arahan tenaga kesehatan.", src: [] }
    ],
    escalate: []
  },

  {
    id: "dbd",
    order: 7,
    title: "Demam berdarah (DBD)",
    short: "Tanda bahaya dengue menurut WHO",
    needsAge: true,
    danger: ["syok", "perut", "muntah", "cairan", "darah", "lemas"],
    questions: [
      { id: "hari", text: "Demam hari ke berapa?", type: "number", unit: "hari", step: 1, optional: true },
      { id: "turun", text: "Demam tinggi beberapa hari lalu turun (sekitar hari ke-3 sampai ke-5)?", type: YN },
      { id: "perut", text: "Nyeri perut, atau perut sakit saat ditekan?", type: YN },
      { id: "muntah", text: "Muntah terus-menerus?", type: YN },
      { id: "cairan", text: "Perut tampak membesar atau anak sesak?", type: YN },
      { id: "darah", text: "Perdarahan: gusi berdarah, mimisan, BAB hitam/berdarah, atau muntah darah?", type: YN },
      { id: "lemas", text: "Lemas atau gelisah?", type: YN },
      { id: "syok", text: "Tangan dan kaki dingin, kulit lembap dan pucat?", type: YN }
    ],
    rules: [
      { id: "r-syok", when: { yes: "syok" }, level: 4, text: "Kulit dingin, lembap, dan pucat bisa menandakan syok. Bawa ke IGD sekarang.", src: ["who_dengue"] },
      { id: "r-ws", when: { any: [{ yes: "perut" }, { yes: "muntah" }, { yes: "cairan" }, { yes: "darah" }, { yes: "lemas" }] }, level: 4, text: "Ada tanda bahaya dengue menurut WHO. Bawa ke rumah sakit sekarang.", src: ["who_dengue"] },
      { id: "r-turun", when: { yes: "turun" }, level: 2, text: "Menurut Kemenkes, demam yang turun setelah sekitar 3 hari (pola pelana kuda) justru fase kritis, bukan tanda sembuh. Pantau ketat tanda bahaya di bawah.", src: ["kemenkes_dbd"] },
      { id: "r-3hari", when: { all: [{ age: [">=", 90] }, { age: ["<=", 1095] }, { num: ["hari", ">", 3] }] }, level: 3, text: "Menurut IDAI, anak usia 3–36 bulan yang demam lebih dari 3 hari dibawa ke dokter.", src: ["idai_demam"] },
      { id: "r-3bln", when: { age: ["<", 90] }, level: 3, text: "Menurut IDAI, bayi di bawah 3 bulan yang demam dibawa ke dokter.", src: ["idai_demam"] }
    ],
    default: { level: 2, title: "Pantau", text: "Belum ada tanda bahaya dengue. Demam punya banyak penyebab, dan DBD hanya bisa dipastikan lewat pemeriksaan darah oleh dokter.", src: ["who_dengue"] },
    differentials: [],
    care: [
      { t: "Pastikan anak cukup minum dan pantau tanda bahaya setiap hari, terutama saat demam mulai turun.", src: ["kemenkes_dbd"] }
    ],
    escalate: ["Nyeri perut", "Muntah terus-menerus", "Perdarahan", "Lemas atau gelisah", "Tangan kaki dingin"]
  },

  {
    id: "kuning",
    order: 8,
    title: "Kuning bayi baru lahir",
    short: "Ikterus pada bayi usia 0–2 bulan",
    needsAge: true,
    danger: ["awal", "telapak"],
    questions: [
      { id: "awal", text: "Kuning sudah tampak dalam 24 jam pertama setelah lahir?", type: YN },
      { id: "telapak", text: "Telapak tangan atau telapak kaki ikut kuning?", type: YN },
      { id: "urin", text: "Urin berwarna gelap atau tinja pucat (keputihan/abu-abu)?", type: YN },
      { id: "lama", text: "Kuning masih ada setelah usia 2 minggu?", type: YN },
      { id: "malas", text: "Bayi malas menyusu atau sangat mengantuk sampai sulit dibangunkan untuk menyusu?", type: YN }
    ],
    rules: [
      { id: "r-awal", when: { yes: "awal" }, level: 4, text: "Kuning dalam 24 jam pertama termasuk tanda bahaya bayi baru lahir WHO, dan menurut AAP kadar bilirubinnya perlu diperiksa segera.", src: ["who_newborn", "aap_bili"] },
      { id: "r-telapak", when: { yes: "telapak" }, level: 4, text: "Telapak tangan atau kaki yang kuning termasuk tanda bahaya bayi baru lahir WHO.", src: ["who_newborn"] },
      { id: "r-malas-nb", when: { all: [{ yes: "malas" }, { age: ["<=", 28] }] }, level: 4, text: "Tidak mau menyusu dengan baik termasuk tanda bahaya bayi baru lahir WHO.", src: ["who_newborn"] },
      { id: "r-malas", when: { all: [{ yes: "malas" }, { age: [">", 28] }] }, level: 3, text: "Malas menyusu disertai kuning perlu diperiksakan hari ini.", src: ["aap_bili"] },
      { id: "r-urin", when: { yes: "urin" }, level: 3, text: "Menurut AAP, urin gelap atau tinja pucat bisa menandakan gangguan hati atau saluran empedu, sehingga perlu pemeriksaan bilirubin direk. Periksakan hari ini.", src: ["aap_bili"] },
      { id: "r-lama", when: { yes: "lama" }, level: 3, text: "Kuning yang menetap lewat usia 2 minggu perlu diperiksa bilirubin total dan direk.", src: ["medstar_bili", "aap_bili"] }
    ],
    default: { level: 2, title: "Pantau", text: "Tidak ada tanda bahaya dari jawaban Anda. Sampaikan kuningnya ke bidan atau dokter saat kontrol; AAP menganjurkan semua bayi diperiksa bilirubin di usia 24–48 jam. Menyusu sering membantu.", src: ["aap_bili", "newborn_intake"] },
    differentials: [],
    care: [
      { t: "Susui 8–12 kali dalam 24 jam.", src: ["newborn_intake", "aap_bili"] }
    ],
    escalate: ["Kuning menjalar sampai telapak tangan/kaki", "Urin gelap atau tinja pucat", "Malas menyusu atau sulit dibangunkan", "Kuning masih ada setelah 2 minggu"]
  },

  {
    id: "neonatus",
    order: 9,
    title: "Cek bayi baru lahir",
    short: "Tanda bahaya WHO untuk bayi usia 0–28 hari",
    needsAge: false,
    danger: ["menyusu", "kejang", "napas", "tarikan", "gerak", "kuning"],
    questions: [
      { id: "menyusu", text: "Tidak mau atau tidak bisa menyusu dengan baik?", type: YN },
      { id: "kejang", text: "Kejang, atau pernah kejang?", type: YN },
      { id: "napas", text: "Napas lebih dari 60 kali per menit (dihitung 60 detik)?", type: YN },
      { id: "tarikan", text: "Dada tertarik ke dalam dengan kuat saat bernapas?", type: YN },
      { id: "gerak", text: "Tidak bergerak sendiri (hanya bergerak bila dirangsang, atau tidak sama sekali)?", type: YN },
      { id: "suhu", text: "Suhu tubuh (°C)", type: "number", unit: "°C", step: 0.1, optional: true },
      { id: "kuning", text: "Kuning dalam 24 jam pertama, atau telapak tangan/kaki kuning?", type: YN }
    ],
    rules: [
      { id: "r-any", when: { any: [{ yes: "menyusu" }, { yes: "kejang" }, { yes: "napas" }, { yes: "tarikan" }, { yes: "gerak" }, { yes: "kuning" }, { num: ["suhu", ">=", 37.5] }, { all: [{ num: ["suhu", ">", 0] }, { num: ["suhu", "<", 35.5] }] }] }, level: 4, text: "Ada tanda bahaya bayi baru lahir menurut WHO. Menurut WHO, satu tanda saja sudah cukup untuk dibawa ke fasilitas kesehatan.", src: ["who_newborn"] }
    ],
    default: { level: 1, title: "Tidak ada tanda bahaya WHO", text: "Tidak ada tanda bahaya bayi baru lahir dari jawaban Anda.", src: ["who_newborn"] },
    differentials: [],
    care: [
      { t: "Bayi baru lahir menyusu 8–12 kali dalam 24 jam.", src: ["newborn_intake"] },
      { t: "Mulai hari ke-5, umumnya minimal 6 popok basah sehari.", src: ["newborn_intake"] },
      { t: "Kebanyakan bayi kembali ke berat lahir di hari ke-10 sampai ke-14.", src: ["newborn_intake"] },
      { t: "Rawat tali pusat tetap bersih dan kering.", src: ["who_cord"] }
    ],
    escalate: []
  }
];
