/* Mesin penilaian Asisten Bayi (berorientasi objek).
   Dipakai di halaman web, aplikasi Android (WebView), dan tes Node. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.Engine = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  /** Empat tingkat triase + catatan. */
  class Level {
    constructor(value, key, name, action) { this.value = value; this.key = key; this.name = name; this.action = action; Object.freeze(this); }
    static of(v) { return Level.ALL[v] || Level.ALL[1]; }
  }
  Level.ALL = {
    0: new Level(0, "info", "Catatan", ""),
    1: new Level(1, "umum", "Umum", "Bisa dirawat di rumah sambil dipantau."),
    2: new Level(2, "pantau", "Pantau", "Perhatikan beberapa jam ke depan."),
    3: new Level(3, "periksa", "Periksa hari ini", "Bawa ke dokter, puskesmas, atau bidan hari ini."),
    4: new Level(4, "igd", "Segera ke IGD", "Bawa ke IGD atau fasilitas kesehatan terdekat sekarang.")
  };

  /** Menilai satu kondisi aturan terhadap jawaban dan konteks (usia). */
  class ConditionEvaluator {
    constructor(answers, ctx) { this.answers = answers || {}; this.ctx = ctx || {}; }
    static compare(a, op, b) {
      switch (op) { case ">": return a > b; case ">=": return a >= b; case "<": return a < b; case "<=": return a <= b; case "==": return a === b; default: return false; }
    }
    static toNumber(v) {
      if (v === null || v === undefined || v === "") return NaN;
      return typeof v === "number" ? v : parseFloat(String(v).replace(",", "."));
    }
    test(c) {
      if (!c || typeof c !== "object") return false;
      const a = this.answers;
      if ("yes" in c) return a[c.yes] === "ya";
      if ("no" in c) return a[c.no] === "tidak";
      if ("eq" in c) return a[c.eq[0]] === c.eq[1];
      if ("num" in c) { const n = ConditionEvaluator.toNumber(a[c.num[0]]); return Number.isFinite(n) && ConditionEvaluator.compare(n, c.num[1], c.num[2]); }
      if ("age" in c) { const d = this.ctx.ageDays; return typeof d === "number" && Number.isFinite(d) && ConditionEvaluator.compare(d, c.age[0], c.age[1]); }
      if ("all" in c) return c.all.every(x => this.test(x));
      if ("any" in c) return c.any.some(x => this.test(x));
      if ("not" in c) return !this.test(c.not);
      if ("count" in c) return c.count.of.filter(x => this.test(x)).length >= c.count.min;
      return false;
    }
    /** Id pertanyaan yang dirujuk sebuah kondisi. */
    static refs(c, out) {
      out = out || [];
      if (!c || typeof c !== "object") return out;
      if ("yes" in c) out.push(c.yes);
      else if ("no" in c) out.push(c.no);
      else if ("eq" in c) out.push(c.eq[0]);
      else if ("num" in c) out.push(c.num[0]);
      else if ("all" in c) c.all.forEach(x => ConditionEvaluator.refs(x, out));
      else if ("any" in c) c.any.forEach(x => ConditionEvaluator.refs(x, out));
      else if ("not" in c) ConditionEvaluator.refs(c.not, out);
      else if ("count" in c) c.count.of.forEach(x => ConditionEvaluator.refs(x, out));
      return out;
    }
  }

  /** Hasil penilaian yang siap ditampilkan. */
  class Assessment {
    constructor(props) { Object.assign(this, props); Object.freeze(this); }
    get levelInfo() { return Level.of(this.level); }
    get isUrgent() { return this.level >= 4; }
  }

  /** Penilai gejala untuk satu definisi checker dari basis pengetahuan. */
  class SymptomChecker {
    constructor(def) { this.def = def; }
    get id() { return this.def.id; }
    get title() { return this.def.title; }
    get dangerIds() { return this.def.danger || []; }
    visibleQuestions(answers, ctx) {
      const ev = new ConditionEvaluator(answers, ctx);
      return (this.def.questions || []).filter(q => !q.showIf || ev.test(q.showIf));
    }
    /** Pertanyaan tanda bahaya (ditanyakan bersama di langkah pertama) dan sisanya (satu per layar). */
    split(answers, ctx) {
      const vis = this.visibleQuestions(answers, ctx);
      const d = new Set(this.dangerIds);
      return { danger: vis.filter(q => d.has(q.id)), rest: vis.filter(q => !d.has(q.id)) };
    }
    assess(answers, ctx) {
      const visible = new Set(this.visibleQuestions(answers, ctx).map(q => q.id));
      const clean = {};
      Object.keys(answers || {}).forEach(k => { if (visible.has(k) && answers[k] !== undefined && answers[k] !== "") clean[k] = answers[k]; });
      const ev = new ConditionEvaluator(clean, ctx);
      const def = this.def;
      const matched = (def.rules || []).filter(r => ev.test(r.when));
      const graded = matched.filter(r => r.level > 0).sort((a, b) => b.level - a.level);
      const notes = matched.filter(r => r.level === 0);
      const fallback = def.default || { level: 1, title: "Umum", text: "", src: [] };
      const level = graded.length ? graded[0].level : fallback.level;

      let differentials = (def.differentials || []).filter(d => d.when && ev.test(d.when));
      if (level <= 2) differentials = (def.differentials || []).filter(d => d.baseline).concat(differentials.filter(d => !d.baseline));

      const src = new Set();
      const add = l => (l || []).forEach(s => src.add(s));
      if (!graded.length) add(fallback.src);
      graded.forEach(r => add(r.src)); notes.forEach(r => add(r.src)); differentials.forEach(d => add(d.src)); (def.care || []).forEach(c => add(c.src));

      return new Assessment({
        level,
        headline: graded.length ? Level.of(level).name : (fallback.title || Level.of(level).name),
        summary: graded.length ? null : fallback.text,
        summarySrc: graded.length ? [] : (fallback.src || []),
        reasons: graded, notes, differentials,
        care: def.care || [], escalate: def.escalate || [],
        sources: Array.from(src),
        answered: Object.keys(clean).length
      });
    }
  }

  /** Perhitungan usia. */
  class Age {
    static days(birth, today) {
      if (!birth) return null;
      const b = new Date(birth + "T00:00:00");
      const t = today ? new Date(today + "T00:00:00") : new Date();
      if (isNaN(b)) return null;
      const tt = new Date(t.getFullYear(), t.getMonth(), t.getDate());
      const d = Math.round((tt - b) / 86400000);
      return d >= 0 ? d : null;
    }
    static label(days) {
      if (days === null || days === undefined) return "";
      if (days < 31) return days + " hari";
      const months = Math.floor(days / 30.4375);
      if (months < 24) return months + " bulan";
      const y = Math.floor(months / 12), m = months % 12;
      return y + " tahun" + (m ? " " + m + " bulan" : "");
    }
    static monthsSince(dateStr, today) {
      const a = new Date(dateStr + "T00:00:00"), b = today ? new Date(today + "T00:00:00") : new Date();
      if (isNaN(a)) return Infinity;
      return (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
    }
  }

  /** Penjaga anti-halusinasi: setiap pernyataan wajib bersumber terdaftar. */
  class KnowledgeValidator {
    constructor(kb) { this.kb = kb || {}; this.errors = []; }
    static honestEmpty(t) { return /belum (punya|diverifikasi|ada)|sengaja tidak|tidak memuat|belum dihitung/i.test(t || ""); }
    checkSrc(where, list, allowEmpty) {
      const sources = this.kb.sources || {};
      if (!Array.isArray(list)) { this.errors.push(where + ": src bukan array"); return; }
      if (!list.length && !allowEmpty) this.errors.push(where + ": tanpa sumber");
      list.forEach(s => { if (!sources[s]) this.errors.push(where + ": sumber tidak dikenal '" + s + "'"); });
    }
    validate() {
      const kb = this.kb, H = KnowledgeValidator.honestEmpty;
      (kb.checkers || []).forEach(c => {
        const qids = new Set((c.questions || []).map(q => q.id));
        (c.danger || []).forEach(q => { if (!qids.has(q)) this.errors.push("checker " + c.id + ": tanda bahaya tidak ada '" + q + "'"); });
        (c.rules || []).forEach(r => {
          const w = "checker " + c.id + " rule " + r.id;
          this.checkSrc(w, r.src, H(r.text));
          if (![0, 1, 2, 3, 4].includes(r.level)) this.errors.push(w + ": level tidak valid");
          ConditionEvaluator.refs(r.when).forEach(q => { if (!qids.has(q)) this.errors.push(w + ": pertanyaan tidak ada '" + q + "'"); });
        });
        this.checkSrc("checker " + c.id + " default", (c.default || {}).src, false);
        (c.differentials || []).forEach(d => this.checkSrc("checker " + c.id + " diferensial " + d.name, d.src, false));
        (c.care || []).forEach((x, i) => this.checkSrc("checker " + c.id + " care " + i, x.src, H(x.t)));
      });
      (kb.guides || []).forEach(g => (g.sections || []).forEach(s => {
        if (s.items) s.items.forEach((it, i) => this.checkSrc("panduan " + g.id + " / " + s.h + " #" + i, it.src, false));
        if (s.table) this.checkSrc("panduan " + g.id + " / " + s.h + " tabel", s.src, false);
      }));
      (kb.obat || []).forEach(o => this.checkSrc("obat " + o.id, o.src, H(o.t)));
      if (kb.imunisasi) this.checkSrc("imunisasi", kb.imunisasi.src, false);
      const strArr = (where, v) => {
        if (v === undefined) return;
        if (!Array.isArray(v) || v.some(x => typeof x !== "string" || !x.trim())) this.errors.push(where + ": harus array string tidak kosong");
      };
      [["checker", kb.checkers], ["panduan", kb.guides], ["obat", kb.obat], ["mitos", kb.mitos]].forEach(p => (p[1] || []).forEach(e => {
        strArr(p[0] + " " + e.id + " aliases", e.aliases); strArr(p[0] + " " + e.id + " examples", e.examples);
      }));
      if (kb.mitos !== undefined && !Array.isArray(kb.mitos)) this.errors.push("mitos: bukan array");
      (Array.isArray(kb.mitos) ? kb.mitos : []).forEach((m, i) => {
        const w = "mitos " + (m && m.id ? m.id : "#" + i);
        if (!m || !m.id) this.errors.push(w + ": id kosong");
        if (!m || typeof m.claim !== "string" || !m.claim.trim()) this.errors.push(w + ": claim kosong");
        if (!m || ["benar", "tidak", "belum"].indexOf(m.verdict) < 0) this.errors.push(w + ": verdict harus benar/tidak/belum");
        if (!m || typeof m.text !== "string" || !m.text.trim()) this.errors.push(w + ": text kosong");
        this.checkSrc(w, m ? m.src : undefined, false);
      });
      if (!kb.meta || !kb.meta.verifiedDate) this.errors.push("meta: verifiedDate kosong");
      return this.errors;
    }
    static validate(kb) { return new KnowledgeValidator(kb).validate(); }
  }


  /* ===== Tanya-jawab luring: hanya menelusuri entri basis pengetahuan (tanpa LLM). ===== */

  /** Normalisasi teks bahasa Indonesia sehari-hari + stemmer ringan gaya Nazief-Adriani (tanpa kamus akar). */
  class TextNormalizer {
    /** Ganti frasa/kata gaul menjadi istilah baku (frasa multi-kata dicek lebih dulu). */
    static applySlang(words) {
      const out = [];
      let i = 0;
      while (i < words.length) {
        let hit = null;
        for (let n = TextNormalizer.MAX_PHRASE; n >= 1; n--) {
          if (i + n > words.length) continue;
          const key = words.slice(i, i + n).join(" ");
          if (Object.prototype.hasOwnProperty.call(TextNormalizer.SLANG, key)) { hit = { n, v: TextNormalizer.SLANG[key] }; break; }
        }
        if (hit) { if (hit.v) out.push.apply(out, hit.v.split(" ")); i += hit.n; }
        else { out.push(words[i]); i++; }
      }
      return out;
    }
    /** Teks -> string kata baku (huruf kecil, tanpa tanda baca kecuali desimal "38.5"). */
    static normalize(text) {
      let s = String(text || "").toLowerCase();
      s = s.replace(/°\s*c?/g, " derajat ");
      s = s.replace(/(\d)[.,](\d)/g, "$1\u0001$2");      // lindungi desimal
      s = s.replace(/([a-z]{2,})2(?![0-9])/g, "$1");     // muntah2 -> muntah (reduplikasi)
      s = s.replace(/[^a-z0-9\u0001\s]/g, " ");
      s = s.replace(/\u0001/g, ".");
      s = s.replace(/(\d)([a-z])/g, "$1 $2").replace(/([a-z])(\d)/g, "$1 $2"); // 8bln -> 8 bln
      s = s.replace(/([a-z])\1{2,}/g, "$1");              // panasss -> panas
      // "bb" = berat badan bila diikuti kata tentang berat ("bb ga naik", "bb anak segini"); selain itu "bb" = bayi.
      s = s.replace(/(^|\s)bb(?=\s+(tidak|ga|gak|nggak|ngga|naik|turun|anak|bayi|segini|kurang|normal|ideal|susah|seret|stuck|berapa|lahir)\b)/g, "$1berat badan");
      const words = s.split(/\s+/).filter(Boolean);
      return TextNormalizer.applySlang(words).join(" ");
    }
    static stem(w) {
      if (w.length < 4 || /\d/.test(w) || TextNormalizer.PROTECTED.has(w)) return w;
      const ok = r => r.length >= 4;
      let x = w, m;
      if ((m = /^(.+?)(lah|kah|pun)$/.exec(x)) && ok(m[1])) x = m[1];
      if ((m = /^(.+?)(ku|mu|nya)$/.exec(x)) && ok(m[1])) x = m[1];
      if (TextNormalizer.PROTECTED.has(x)) return x;
      if ((m = /^(.+?)(kan|an)$/.exec(x)) && ok(m[1])) x = m[1];
      else if ((m = /^(.+)i$/.exec(x)) && ok(m[1])) x = m[1];
      if (TextNormalizer.PROTECTED.has(x)) return x;
      for (let k = 0; k < 2; k++) {
        let r = null;
        if ((m = /^(di|ke|se)(.+)$/.exec(x))) r = m[2];
        else if ((m = /^(ber|ter)(.+)$/.exec(x))) r = m[2];
        else if ((m = /^(me|pe)ny([aiueo].*)$/.exec(x))) r = "s" + m[2];
        else if ((m = /^(me|pe)ng([aiueo].*)$/.exec(x))) r = m[2];
        else if ((m = /^(me|pe)ng(.+)$/.exec(x))) r = m[2];
        else if ((m = /^(me|pe)m([aiueo].*)$/.exec(x))) r = "p" + m[2];
        else if ((m = /^(me|pe)m(.+)$/.exec(x))) r = m[2];
        else if ((m = /^(me|pe)n([aiueo].*)$/.exec(x))) r = "t" + m[2];
        else if ((m = /^(me|pe)n(.+)$/.exec(x))) r = m[2];
        else if ((m = /^(me|pe)(.+)$/.exec(x))) r = m[2];
        if (!r || !ok(r)) break;
        x = r;
        if (TextNormalizer.PROTECTED.has(x)) break;
      }
      return x;
    }
    /** Teks mentah -> token ber-stem tanpa stopword. */
    static tokens(text) { return TextNormalizer.tokensOfNorm(TextNormalizer.normalize(text)); }
    static tokensOfNorm(norm) {
      return norm.split(" ").filter(w => w && !TextNormalizer.STOP.has(w)).map(TextNormalizer.stem);
    }
  }
  TextNormalizer.SLANG = {
    "bb": "bayi", "baby": "bayi", "bayik": "bayi", "dedek": "bayi", "debay": "bayi",
    "dmm": "demam", "dmam": "demam", "panas": "demam", "anget": "demam", "meriang": "demam", "febris": "demam",
    "mencret": "diare", "menceret": "diare", "mencret mencret": "diare", "bab cair": "diare", "berak cair": "diare", "pup cair": "diare", "eek cair": "diare",
    "mencrit": "diare", "diare": "diare", "muntaber": "muntah diare",
    "gmn": "bagaimana", "gimana": "bagaimana", "bgmn": "bagaimana", "gmana": "bagaimana", "gmna": "bagaimana",
    "udh": "sudah", "udah": "sudah", "sdh": "sudah", "dah": "sudah", "blm": "belum", "blom": "belum",
    "gak": "tidak", "ga": "tidak", "nggak": "tidak", "ngga": "tidak", "enggak": "tidak", "engga": "tidak", "tdk": "tidak", "tak": "tidak", "gk": "tidak",
    "bln": "bulan", "th": "tahun", "thn": "tahun", "taun": "tahun", "mgg": "minggu", "hr": "hari", "jm": "jam",
    "brp": "berapa", "bnr": "benar", "obt": "obat", "bs": "bisa", "bsa": "bisa", "jd": "jadi", "krn": "karena", "dgn": "dengan", "sm": "sama", "yg": "yang", "aja": "saja", "aj": "saja",
    "pct": "parasetamol", "sanmol": "parasetamol", "tempra": "parasetamol", "paracetamol": "parasetamol", "parasetamol": "parasetamol", "proris": "ibuprofen",
    "ibu profen": "ibuprofen", "ibuprofen": "ibuprofen",
    "sesek": "sesak", "ngik": "mengi", "ngik ngik": "mengi", "cepet": "cepat", "telen": "menelan", "nelen": "menelan", "ketelen": "tertelan", "ngomong": "bicara", "amox": "antibiotik", "amoxicillin": "antibiotik", "amoksisilin": "antibiotik", "lemes": "lemas", "pilek": "pilek", "flu": "pilek", "meler": "pilek", "ingus": "pilek", "ingusan": "pilek",
    "batpil": "batuk pilek", "btk": "batuk", "ngeden": "mengejan", "mengejan": "mengejan", "gumoh": "gumoh", "gumo": "gumoh",
    "rewel": "rewel", "nangis": "menangis", "nenen": "menyusu", "mimik": "menyusu", "mimi": "menyusu", "gw": "aku", "gue": "aku", "gua": "aku", "mulu": "terus", "melulu": "terus", "abis": "habis", "menyusui": "menyusu", "nyusu": "menyusu", "netek": "menyusu", "asip": "asi perah",
    "sufor": "susu formula", "mpasi": "mpasi", "mp asi": "mpasi", "imun": "imunisasi", "vaksin": "imunisasi", "vaksinasi": "imunisasi", "suntik imunisasi": "imunisasi",
    "step": "kejang", "stip": "kejang", "stuip": "kejang", "kejeng": "kejang",
    "nafas": "napas", "bernafas": "bernapas", "tersedak": "tersedak", "keselek": "tersedak", "kesedak": "tersedak",
    "pup": "bab", "eek": "bab", "berak": "bab", "poop": "bab", "pipis": "bak", "kencing": "bak", "ompol": "bak",
    "ruam popok": "ruam popok", "biang keringat": "biang keringat", "biduran": "ruam",
    "loyo": "lemas", "kuning": "kuning", "kunig": "kuning",
    "tumbuh gigi": "tumbuh gigi", "tumgi": "tumbuh gigi", "teething": "tumbuh gigi",
    "bobok": "tidur", "bobo": "tidur", "bubu": "tidur", "begadang": "tidur",
    "vit": "vitamin", "suplemen": "suplemen", "zink": "zinc", "zing": "zinc",
    "termometer": "termometer", "derajat celcius": "derajat", "celcius": "derajat", "celsius": "derajat",
    "bgt": "sekali", "banget": "sekali", "bngt": "sekali", "amat": "sekali", "trs": "terus", "terus terusan": "terus", "trus": "terus",
    "mual": "mual", "muntah muntah": "muntah", "kembung": "kembung", "sembelit": "sembelit", "susah bab": "sembelit", "konstipasi": "sembelit",
    "kolik": "kolik", "cegukan": "cegukan", "ubun ubun": "ubun", "ubunubun": "ubun",
    "choking": "tersedak", "choke": "tersedak", "choked": "tersedak",
    "jatoh": "jatuh", "jatuhh": "jatuh", "kebentur": "terbentur", "kejedot": "terbentur", "kejeduk": "terbentur", "jedot": "terbentur", "kepentok": "terbentur",
    "sampe": "sampai", "nanahnya": "nanah", "bernanah": "nanah",
    "air panas": "luka bakar", "melepuh": "luka bakar", "kesiram": "tersiram", "knalpot": "luka bakar"
  };
  TextNormalizer.MAX_PHRASE = 3;
  TextNormalizer.PROTECTED = new Set(["demam", "minum", "makan", "bayi", "diare", "kejang", "tangan", "badan", "ruam", "pilek",
    "batuk", "muntah", "gumoh", "kuning", "sesak", "menyusu", "napas", "susu", "mpasi", "imunisasi", "parasetamol", "ibuprofen",
    "oralit", "zinc", "madu", "darah", "lemas", "tidur", "gigi", "telinga", "mata", "kulit", "perut", "kepala", "kaki", "dada",
    "minggu", "bulan", "tahun", "hari", "berat", "tinggi", "panas", "pertama", "keluar", "benar", "belum", "sudah", "tidak",
    "kolik", "rewel", "obat", "vitamin", "besi", "asi", "biru", "pucat", "dengue", "campak", "cacar", "sembelit", "kembung",
    "tenggelam", "keracunan", "tersedak", "ubun", "jatuh", "luka", "bakar", "tertelan", "pusar", "bersin", "menangis", "mengejan", "dokter", "perkembangan", "pertumbuhan", "tengkurap", "merangkak", "berjalan", "bicara", "suhu", "termometer"]);
  TextNormalizer.STOP = new Set(["yang", "dan", "di", "ke", "dari", "ini", "itu", "apa", "apakah", "saya", "anak", "anakku", "aku", "ya", "sih", "dong", "kok", "nih", "tuh",
    "bun", "bunda", "mom", "moms", "dok", "dokter", "kak", "sus", "min", "admin", "pak", "bu", "mas", "mbak", "deh", "loh", "lho", "kah", "pun", "lah", "juga", "jadi",
    "ada", "adalah", "untuk", "buat", "dengan", "pada", "atau", "tapi", "tetapi", "karena", "kalau", "kalo", "klo", "kl", "jika", "bila", "saja", "sudah", "lagi", "masih",
    "mau", "bisa", "boleh", "harus", "perlu", "kenapa", "mengapa", "bagaimana", "berapa", "kapan", "sama", "sangat", "sekali", "agak", "aja", "nya", "gitu", "begitu",
    "tolong", "mohon", "tanya", "nanya", "mau", "si", "para", "kami", "kita", "dia", "beliau", "punya", "oleh", "akan", "telah", "sedang", "lagi", "baru", "terus",
    "hai", "halo", "permisi", "terima", "kasih", "makasih", "hal", "seperti", "kayak", "kaya", "gak", "pas", "waktu", "saat", "tadi", "sekarang", "barusan"]);

  /** Ekstraksi angka penting dari pertanyaan: usia, suhu, lama sakit, nama obat. */
  class QueryExtractor {
    static wordsToDays(n, unit) {
      return unit === "tahun" ? Math.round(n * 365) : unit === "bulan" ? Math.round(n * 30.4375) : unit === "minggu" ? Math.round(n * 7) : Math.round(n);
    }
    /** @param {string} text  @param {Array} obat entri kb.obat (opsional, untuk nama obat) */
    static extract(text, obat) {
      const norm = TextNormalizer.normalize(text);
      return QueryExtractor.fromNorm(norm, obat);
    }
    static fromNorm(norm, obat) {
      const w = norm.split(" ").filter(Boolean);
      const out = { ageDays: null, tempC: null, days: null, drugs: [] };
      const UNITS = { hari: 1, minggu: 1, bulan: 1, tahun: 1 };
      const AGE_CTX = { umur: 1, usia: 1, bayi: 1, anak: 1, baru: 1, berumur: 1, berusia: 1, lahir: 1 };
      const ILL_CTX = { demam: 1, sakit: 1, sudah: 1, selama: 1, diare: 1, batuk: 1, pilek: 1, muntah: 1, sejak: 1, lebih: 1, hampir: 1, kurang: 1 };
      for (let i = 0; i < w.length; i++) {
        const num = parseFloat(w[i]);
        if (!/^\d+(\.\d+)?$/.test(w[i]) || !Number.isFinite(num)) continue;
        const prev = w[i - 1] || "", prev2 = w[i - 2] || "", next = w[i + 1] || "";
        // "hari ke 3" -> lama sakit
        if (prev === "ke" && prev2 === "hari") { if (out.days === null) out.days = Math.round(num); continue; }
        // Suhu
        const tempCtx = next === "derajat" || next === "c" || prev === "suhu" || prev2 === "suhu" || prev === "demam" || prev === "panas";
        if (num >= 35 && num <= 43 && !UNITS[next] && (tempCtx || /\./.test(w[i]))) { if (out.tempC === null) out.tempC = num; continue; }
        if (!UNITS[next]) continue;
        const ageCtx = !!(AGE_CTX[prev] || AGE_CTX[prev2]);
        const illCtx = !!(ILL_CTX[prev] || ILL_CTX[prev2] || ILL_CTX[w[i + 2] || ""]);
        const asDays = QueryExtractor.wordsToDays(num, next);
        let isAge;
        if (ageCtx) isAge = true;
        else if (next === "hari") isAge = false;
        else if (next === "minggu") isAge = !illCtx;
        else isAge = !(prev === "selama" || prev === "sejak");   // bulan/tahun biasanya usia
        if (isAge) { if (out.ageDays === null) out.ageDays = asDays; }
        else if (out.days === null) out.days = asDays;
        i++;
      }
      // Obat: kata gaul sudah dibakukan; cocokkan juga dengan nama/alias entri kb.obat.
      const padded = " " + norm + " ";
      const seen = new Set();
      QueryExtractor.DRUGS.forEach(d => { if (padded.indexOf(" " + d + " ") >= 0 && !seen.has(d)) { seen.add(d); out.drugs.push(d); } });
      (obat || []).forEach(o => {
        [o.name].concat(o.aliases || []).forEach(n => {
          const nn = TextNormalizer.normalize(n);
          if (nn && nn.split(" ").length <= 3 && padded.indexOf(" " + nn + " ") >= 0 && !seen.has(o.id)) { seen.add(o.id); out.drugs.push(o.id); }
        });
      });
      return out;
    }
  }
  QueryExtractor.DRUGS = ["parasetamol", "ibuprofen", "oralit", "zinc", "madu", "simetikon", "benzokain", "antibiotik", "vitamin", "besi", "domperidon", "loperamid", "aspirin", "puyer"];

  /** Pendeteksi tanda bahaya pada pertanyaan bebas. Setiap butir menyebut id sumber kb-sources bila ada (null = belum bersumber). */
  class DangerDetector {
    /** Disangkal bila kata tepat sebelumnya penyangkal/riwayat ("tidak kejang", "pernah kejang"), atau "tidak ada X". */
    static negated(norm, idx) {
      const b = norm.slice(0, idx).trim().split(" ");
      const p1 = b[b.length - 1] || "", p2 = b[b.length - 2] || "";
      const NEG = { tidak: 1, belum: 1, bukan: 1, jangan: 1, tanpa: 1, pernah: 1, riwayat: 1 };
      return !!(NEG[p1] || (NEG[p2] && (p1 === "ada" || p1 === "sampai" || p1 === "terlalu")));
    }
    /** @param {string} normText hasil TextNormalizer.normalize  @param {{ageDays:number|null,tempC:number|null}} ex */
    static detect(normText, ex) {
      ex = ex || {};
      const norm = " " + String(normText || "") + " ";
      const out = [];
      DangerDetector.RULES.forEach(r => {
        let m = null;
        const re = new RegExp(r.re.source, "g");
        let found = false;
        while ((m = re.exec(norm))) {
          if (r.neg === false || !DangerDetector.negated(norm, m.index)) { found = true; break; }
        }
        if (found && r.unless && r.unless.test(norm)) found = false;
        if (found) out.push({ id: r.id, level: r.level, text: r.text, src: r.src });
      });
      const fm = / demam /.exec(norm);
      const fever = (fm && !DangerDetector.negated(norm, fm.index + 1)) || (typeof ex.tempC === "number" && ex.tempC >= 38);
      if (fever && typeof ex.ageDays === "number" && ex.ageDays < 90)
        out.push({ id: "demam3bln", level: "hari", text: "Bayi di bawah 3 bulan yang demam perlu dibawa ke dokter, apa pun keadaan umumnya.", src: "idai_demam" });
      const drugs = ex.drugs || [];
      if (typeof ex.ageDays === "number" && ex.ageDays < 90 && (drugs.indexOf("parasetamol") >= 0 || drugs.indexOf("ibuprofen") >= 0) && !out.some(d => d.id === "demam3bln"))
        out.push({ id: "obat3bln", level: "hari", text: "Bayi di bawah 3 bulan yang perlu obat penurun panas berarti demam: bawa ke dokter dulu.", src: "idai_demam" });
      if (typeof ex.tempC === "number" && ex.tempC >= 40)
        out.push({ id: "suhu40", level: "hari", text: "Suhu 40 °C atau lebih: segera periksakan ke dokter.", src: null });
      return out;
    }
  }
  DangerDetector.RULES = [
    { id: "kejang", level: "igd", re: /\s(kejang|kelojotan|mendelik)\s/, unless: /\s(kejang|kelojotan) (\S+ ){0,2}(bisa|apakah|apa|akan) (kambuh|berulang|terulang)|\s(kejang|kelojotan) lagi tidak nanti|\snanti (bisa )?(kejang|kelojotan) lagi/, text: "Kejang termasuk tanda bahaya umum WHO.", src: "who_imci_danger" },
    { id: "biru", level: "igd", re: /\s((bibir|kulit|wajah|muka|kuku|lidah|badan|tubuh|mulut|bayi|lahir) (\S+ )?biru|membiru|kebiruan)\s/, text: "Bibir atau kulit kebiruan: segera ke IGD.", src: null },
    { id: "sesak", level: "igd", re: /\s(sesak|napas cepat|tarikan dada|dada(nya)? tertarik|dada(nya)? (\S+ ){0,3}cekung|susah napas|sulit napas|susah bernapas|sulit bernapas|napas berat|ngos ngosan|ngosan|tersengal)/, text: "Sesak atau napas cepat/tarikan dada termasuk tanda bahaya WHO.", src: "who_imci_pneu" },
    { id: "lemas", level: "igd", re: /\s(tidak sadar|pingsan|sulit dibangunkan|susah dibangunkan|tidak bisa dibangunkan|lemas|lunglai|tidak merespons|tidak respon|tidak responsif)/, text: "Lemas sekali atau sulit dibangunkan termasuk tanda bahaya umum WHO.", src: "who_imci_danger" },
    { id: "tdkminum", level: "igd", re: /\stidak (mau|bisa|kuat) (minum|menyusu|asi)/, text: "Tidak bisa minum atau menyusu termasuk tanda bahaya umum WHO.", src: "who_imci_danger", neg: false },
    { id: "muntahsemua", level: "igd", re: /\s(muntah (terus|semua|setiap|tiap)|semua (dimuntahkan|keluar lagi)|apa pun dimuntahkan)/, text: "Memuntahkan semua yang diminum termasuk tanda bahaya umum WHO.", src: "who_imci_danger" },
    { id: "muntahdarah", level: "hari", re: /\s(muntah (\S+ ){0,2}(ber)?darah|muntah (seperti )?(ampas )?kopi)/, text: "Muntah berdarah atau seperti ampas kopi perlu diperiksa dokter hari ini.", src: "idai_gumoh" },
    { id: "babdarah", level: "hari", re: /\s((bab|diare|tinja|feses) (\S+ ){0,3}(ber)?darah|darah (di|pada|dalam) (bab|tinja|feses))/, text: "Darah di BAB perlu diperiksakan ke dokter.", src: "who_ors" },
    { id: "ubun", level: "igd", re: /\subun (\S+ ){0,2}(cekung|menonjol|cembung|tegang|melesak)/, text: "Ubun-ubun cekung bisa tanda bayi kekurangan cairan; ubun-ubun yang tetap menonjol saat bayi tenang dan tegak perlu pemeriksaan darurat. Bawa ke IGD sekarang.", src: ["medline_fontanel_sunken", "medline_fontanel_bulge"] },
    { id: "tersedak", level: "igd", re: /\s(tersedak|tercekik)\s/, unless: /masih bisa batuk/, text: "Tersedak: lakukan pertolongan pertama tersedak dan panggil bantuan bila tidak bisa bernapas.", src: "medline_choke" },
    { id: "tenggelam", level: "igd", re: /\s(tenggelam|kelelep)\s/, text: "Tenggelam: segera ke IGD walau tampak pulih.", src: "who_drowning" },
    { id: "keracunan", level: "igd", re: /\s(keracunan|tertelan|menelan (\S+ )?(baterai|obat|magnet|koin|sabun|deterjen|minyak|kancing)|minum (obat nyamuk|minyak tanah|bensin|pemutih))/, text: "Dugaan keracunan atau benda tertelan: segera ke IGD.", src: "who_injury" },
    { id: "pusar", level: "hari", re: /\s(pusar|tali pusat)( \S+){0,2} (bernanah|nanah|bau|berbau|berdarah|merah)\s|\snanah( \S+){0,2} (pusar|tali pusat)\s/, text: "Tali pusat yang mengeluarkan cairan kekuningan berbau, kulit di pangkalnya merah, atau bayi menangis saat disentuh perlu diperiksakan ke dokter. Bila tali pusat terus berdarah, segera hubungi dokter.", src: "aap_cord" },
    { id: "lukabakar", level: "hari", re: /\s(luka bakar|tersiram|melepuh)\s/, text: "Luka bakar: segera siram air mengalir yang sejuk selama 20 menit. Ke IGD bila luas atau dalam, mengenai wajah, kelamin, atau bokong, atau akibat bahan kimia atau listrik. Untuk anak di bawah 5 tahun, mintalah saran tenaga kesehatan.", src: "nhs_burns" },
    { id: "muntahhijau", level: "hari", re: /\smuntah (\S+ )?hijau/, text: "Muntah berwarna hijau perlu diperiksakan ke dokter hari ini, sesegera mungkin.", src: "orami_gumoh" },
    { id: "kuning24", level: "igd", re: /\skuning (\S+ ){0,3}(24 jam|hari pertama)/, text: "Kuning sebelum bayi berumur 24 jam: bawa ke rumah sakit sekarang.", src: ["who_imci_jaundice", "aap_bili"] },
    { id: "tinjapucat", level: "hari", re: /\s(tinja|bab|feses) (\S+ ){0,2}(pucat|putih|dempul)/, text: "Tinja pucat pada bayi kuning perlu pemeriksaan bilirubin direk.", src: "aap_bili" },
    { id: "ruamkaca", level: "igd", re: /\s(bintik|ruam|bercak)( \S+){0,4} tidak (hilang|ilang|pudar|memudar)( \S+){0,3} (ditekan|tekan|gelas)/, text: "Demam dengan ruam atau bintik yang tidak memudar saat ditekan dengan gelas termasuk tanda darurat: segera ke IGD.", src: "nhs_fever" },
    { id: "perdarahan", level: "igd", re: /\s(mimisan|gusi berdarah|muntah darah)/, text: "Perdarahan (mimisan, gusi berdarah) saat atau setelah demam bisa tanda bahaya dengue: segera cari pertolongan medis.", src: "who_dengue_fs" },
    { id: "cederakepala", level: "igd", re: /\s((jatuh|terjatuh|terbentur) (\S+ ){0,4}(muntah|mengantuk|ngantuk|pingsan|kejang)|muntah (\S+ ){0,3}(jatuh|terjatuh|terbentur))/, text: "Jatuh lalu muntah, mengantuk, atau pingsan: segera ke IGD.", src: null },
    { id: "kepala", level: "pantau", re: /\s(kepala (\S+ ){0,2}terbentur|terbentur (\S+ ){0,2}kepala|jatuh (\S+ ){0,3}kepala)/, unless: /\s(jatuh|terjatuh|terbentur) (\S+ ){0,4}(muntah|mengantuk|ngantuk|pingsan|kejang)|muntah (\S+ ){0,3}(jatuh|terjatuh|terbentur)/, text: "Kepala terbentur: pantau 24 jam. Segera ke IGD bila muntah, sangat mengantuk, pingsan, kejang, atau menangis tak bisa ditenangkan.", src: null },
    { id: "matacekung", level: "hari", re: /\smata (\S+ ){0,2}cekung/, text: "Mata cekung bisa tanda dehidrasi, apalagi saat diare atau muntah. Nilai dengan penilai \"Diare & dehidrasi\" dan periksakan hari ini.", src: "who_dehid" },
    { id: "kuningtelapak", level: "igd", re: /\s(kuning (\S+ ){0,3}(telapak|kaki)|telapak (\S+ ){0,3}kuning)/, text: "Telapak tangan atau kaki yang kuning termasuk kuning berat menurut WHO: bawa ke rumah sakit sekarang.", src: ["who_imci_jaundice", "who_newborn"] },
    { id: "pusar", level: "hari", re: /\s(pusar|pusat) (\S+ ){0,3}(nanah|bau|kemerahan|merah|bengkak)/, text: "Tali pusat bernanah, berbau, atau kemerahan meluas perlu diperiksakan ke dokter atau bidan hari ini.", src: null },
    { id: "pikiranmenyakiti", level: "hari", re: /\s(menyakiti|nyakitin|melukai|bunuh) (\S+ )?(diri|bayi)/, text: "Ada pikiran menyakiti diri atau bayi: cari bantuan hari ini.", src: "ppd" }
  ];

  /** Indeks BM25 atas entri KB (checker, panduan, obat, mitos, tonggak perkembangan, imunisasi). */
  class KbSearch {
    constructor(kb) {
      kb = kb || {};
      this.k1 = KbSearch.K1; this.b = KbSearch.B;
      this.docs = [];
      const T = TextNormalizer;
      const add = (type, id, title, fields, aliases) => {
        const tf = {}; let len = 0;
        fields.forEach(f => (Array.isArray(f.t) ? f.t : [f.t]).forEach(txt => {
          if (typeof txt !== "string" || !txt) return;
          T.tokens(txt).forEach(tok => { tf[tok] = (tf[tok] || 0) + f.w; len += f.w; });
        }));
        const phrases = (aliases || []).map(a => T.normalize(a)).filter(a => a && a.length >= 3);
        this.docs.push({ type, id, title, tf, len, phrases });
      };
      const W = KbSearch.WEIGHTS;
      (kb.checkers || []).forEach(c => add("checker", c.id, c.title, [
        { t: c.title, w: W.title }, { t: c.aliases || [], w: W.aliases }, { t: c.examples || [], w: W.examples },
        { t: c.short, w: W.other }, { t: (c.questions || []).map(q => q.text), w: W.other }], c.aliases));
      (kb.guides || []).forEach(g => {
        const texts = [];
        (g.sections || []).forEach(s => { texts.push(s.h); if (typeof s.text === "string") texts.push(s.text); (s.items || []).forEach(it => texts.push(it.t)); });
        add("guide", g.id, g.title, [{ t: g.title, w: W.title }, { t: g.aliases || [], w: W.aliases }, { t: g.examples || [], w: W.examples }, { t: texts, w: W.other }], g.aliases);
      });
      (kb.obat || []).forEach(o => add("obat", o.id, o.name, [
        { t: o.name, w: W.title }, { t: o.aliases || [], w: W.aliases }, { t: o.examples || [], w: W.examples }, { t: [o.t, o.age], w: W.other }], o.aliases));
      (Array.isArray(kb.mitos) ? kb.mitos : []).forEach(m => add("mitos", m.id, m.claim, [
        { t: m.claim, w: W.title }, { t: m.aliases || [], w: W.aliases }, { t: m.examples || [], w: W.examples }, { t: m.text, w: W.other }], m.aliases));
      (kb.milestones || []).forEach(m => {
        const texts = [];
        Object.keys(m.d || {}).forEach(k => (m.d[k] || []).forEach(x => texts.push(x)));
        add("milestone", m.id, "Perkembangan " + m.label, [{ t: "perkembangan tonggak " + m.label, w: W.title }, { t: m.aliases || [], w: W.aliases }, { t: texts, w: W.other }], m.aliases);
      });
      if (kb.imunisasi) {
        const im = kb.imunisasi;
        add("imunisasi", "imunisasi", "Jadwal imunisasi", [{ t: "jadwal imunisasi vaksin", w: W.title }, { t: im.aliases || [], w: W.aliases },
          { t: im.examples || [], w: W.examples }, { t: (im.rows || []).map(r => Array.isArray(r) ? r.join(" ") : String(r)), w: W.other }], im.aliases);
      }
      this.N = this.docs.length;
      this.avgLen = this.N ? this.docs.reduce((a, d) => a + d.len, 0) / this.N : 1;
      this.df = {};
      this.docs.forEach(d => Object.keys(d.tf).forEach(t => { this.df[t] = (this.df[t] || 0) + 1; }));
      // Alias yang setelah dinormalisasi hanya berisi kata umum (mis. "bayi") tidak boleh memberi bonus frasa.
      const common = t => (this.df[t] || 0) > this.N / 3;
      this.docs.forEach(d => { d.phrases = d.phrases.filter(p => !TextNormalizer.tokensOfNorm(p).every(common)); });
    }
    idf(t) { const df = this.df[t] || 0; return Math.log(1 + (this.N - df + 0.5) / (df + 0.5)); }
    /** @returns {Array<{type,id,title,score}>} urut skor menurun, hanya skor > 0. */
    search(query, n) {
      n = n || 5;
      const norm = TextNormalizer.normalize(query);
      const q = Array.from(new Set(TextNormalizer.tokensOfNorm(norm)));
      const padded = " " + norm + " ";
      const res = [];
      this.docs.forEach(d => {
        let s = 0, hits = 0, phrase = false;
        q.forEach(t => {
          const f = d.tf[t]; if (!f) return;
          hits++;
          s += this.idf(t) * (f * (this.k1 + 1)) / (f + this.k1 * (1 - this.b + this.b * d.len / this.avgLen));
        });
        d.phrases.forEach(p => { if (padded.indexOf(" " + p + " ") >= 0) { s += KbSearch.PHRASE_BONUS; phrase = true; } });
        if (s > 0) res.push({ type: d.type, id: d.id, title: d.title, score: Math.round(s * 1000) / 1000, hits, phrase });
      });
      res.sort((a, b) => b.score - a.score);
      return res.slice(0, n);
    }
  }
  KbSearch.K1 = 1.2; KbSearch.B = 0.75;
  KbSearch.WEIGHTS = { title: 3, aliases: 3, examples: 2, other: 1 };
  KbSearch.PHRASE_BONUS = 3;

  /** Penjawab: tanda bahaya lebih dulu, lalu entri KB paling cocok. Tidak pernah mengarang jawaban. */
  class AskEngine {
    constructor(kb) { this.kb = kb || {}; this.index = new KbSearch(this.kb); }
    static prefill(checker, ex) {
      const pre = {};
      (checker.questions || []).forEach(q => {
        if (q.type !== "number") return;
        if (q.unit === "°C" && typeof ex.tempC === "number") pre[q.id] = ex.tempC;
        else if (q.unit === "hari" && typeof ex.days === "number") pre[q.id] = ex.days;
      });
      return pre;
    }
    answer(text, profileAgeDays) {
      const norm = TextNormalizer.normalize(text);
      const extracted = QueryExtractor.fromNorm(norm, this.kb.obat);
      const ageDays = extracted.ageDays !== null ? extracted.ageDays : (typeof profileAgeDays === "number" ? profileAgeDays : null);
      const danger = DangerDetector.detect(norm, { ageDays, tempC: extracted.tempC, drugs: extracted.drugs });
      let results = this.index.search(text, 1000);
      const ms = this.kb.milestones || [];
      if (ageDays !== null && ms.length && norm.split(" ").some(x => AskEngine.DEV_WORDS[x])) {
        const months = ageDays / 30.4375;
        let near = ms[0];
        ms.forEach(m => { if (Math.abs(m.months - months) < Math.abs(near.months - months)) near = m; });
        const hit = results.filter(r => r.type === "milestone" && r.id === near.id)[0];
        if (hit) hit.score = Math.round((hit.score + AskEngine.MILESTONE_BONUS) * 1000) / 1000;
        else results.push({ type: "milestone", id: near.id, title: "Perkembangan " + near.label, score: AskEngine.MILESTONE_BONUS });
        results.sort((a, b) => b.score - a.score);
      }
      results = results.slice(0, 5);
      let confidence = "none";
      if (results.length) {
        const top = results[0].score, second = results.length > 1 ? results[1].score : 0;
        confidence = top >= AskEngine.HIGH_SCORE && top >= AskEngine.HIGH_RATIO * second ? "high" : "low";
        // Satu kata cocok + ada kata yang sama sekali tidak dikenal KB ("digigit anjing" -> gigi): jangan yakin.
        const r0 = results[0];
        const qt = Array.from(new Set(TextNormalizer.tokensOfNorm(norm))).filter(t => !/^\d/.test(t));
        const unknown = qt.filter(t => !this.index.df[t]).length;
        // Kata umum (muncul di > 1/3 entri, mis. "bayi") tidak dihitung sebagai kecocokan yang bermakna.
        const common = t => (this.index.df[t] || 0) > this.index.N / 3;
        const doc = this.index.docs.filter(d => d.type === r0.type && d.id === r0.id)[0];
        const hits = doc ? qt.filter(t => doc.tf[t] && !common(t)).length : r0.hits;
        if (confidence === "high" && typeof hits === "number" && !r0.phrase && unknown > 0 && (hits < 2 || unknown >= hits)) confidence = "low";
        // Pokok pertanyaan (kata isi pertama) sama sekali tidak dikenal KB ("kerokan ...", "bawang merah ...", "cara bikin akta ..."):
        // KB tidak membahas topik itu, jadi jangan tampilkan satu jawaban seolah yakin.
        const head = qt.filter(t => !AskEngine.WEAK_WORDS[t] && !common(t))[0];
        if (confidence === "high" && head && head.length >= 4 && !this.index.df[head]) confidence = "low";
        // Hanya satu kata bermakna yang cocok, dan kata itu cuma muncul di isi (bukan judul/alias) entri teratas
        // ("kapan anak boleh sekolah" -> empeng karena satu kalimat menyebut sekolah): jangan yakin.
        if (confidence === "high" && doc && !r0.phrase && hits === 1) {
          const t1 = qt.filter(t => doc.tf[t] && !common(t))[0];
          const label = " " + TextNormalizer.normalize(doc.title || "") + " " + doc.phrases.join(" ") + " ";
          if (t1 && label.indexOf(" " + t1 + " ") < 0) confidence = "low";
        }
      }
      let best = results.length ? Object.assign({}, results[0]) : null;
      if (best && best.type === "checker") {
        const c = (this.kb.checkers || []).filter(x => x.id === best.id)[0];
        if (c) best.prefill = AskEngine.prefill(c, extracted);
      }
      return { danger, extracted, ageDays, results, confidence, best };
    }
  }
  /** Ambang "yakin": skor BM25 teratas >= 4 (kira-kira dua kata kunci jarang cocok di judul/alias)
      DAN >= 1,5x skor kedua. Di bawah itu UI menampilkan beberapa pilihan, bukan satu jawaban. */
  AskEngine.HIGH_SCORE = 4;
  AskEngine.WEAK_WORDS = { cara: 1, bikin: 1, buat: 1, membuat: 1, gimana: 1, bagaimana: 1, apa: 1, apakah: 1, boleh: 1, kenapa: 1, mengapa: 1, tolong: 1 };
  AskEngine.HIGH_RATIO = 1.5;
  /** Pertanyaan perkembangan + usia -> tonggak terdekat usia diberi bonus skor. */
  AskEngine.MILESTONE_BONUS = 4;
  AskEngine.DEV_WORDS = { bisa: 1, belum: 1, jalan: 1, berjalan: 1, lari: 1, bicara: 1, merangkak: 1, tengkurap: 1, duduk: 1, berdiri: 1, perkembangan: 1, harusnya: 1, seharusnya: 1, tonggak: 1, milestone: 1, lancar: 1, merespons: 1, senyum: 1, tersenyum: 1, mengoceh: 1 };

  return { Level, ConditionEvaluator, Assessment, SymptomChecker, Age, KnowledgeValidator,
    TextNormalizer, QueryExtractor, DangerDetector, KbSearch, AskEngine };
});
