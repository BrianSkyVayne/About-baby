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
      if (!kb.meta || !kb.meta.verifiedDate) this.errors.push("meta: verifiedDate kosong");
      return this.errors;
    }
    static validate(kb) { return new KnowledgeValidator(kb).validate(); }
  }

  return { Level, ConditionEvaluator, Assessment, SymptomChecker, Age, KnowledgeValidator };
});
