const test = require("node:test");
const assert = require("node:assert");
const E = require("../src/engine");
const checkers = require("../src/kb-checkers");
const sources = require("../src/kb-sources");
const content = require("../src/kb-content");
const C = id => new E.SymptomChecker(checkers.find(c => c.id === id));
const A = (c, ans, ctx) => c.assess(ans, ctx);

test("basis pengetahuan lolos validasi sumber", () => {
  const errs = E.KnowledgeValidator.validate({ sources, checkers, ...content });
  assert.deepStrictEqual(errs, []);
});

test("gumoh bayi 14 hari tanpa tanda bahaya = Umum, hanya gumoh normal yang ditampilkan", () => {
  const r = A(C("gumoh"), { lemas: "tidak", hijau: "tidak", darah: "tidak", sembur: "tidak", tolak: "tidak", popok: "tidak", bb: "tidak", rewel: "tidak" }, { ageDays: 14 });
  assert.strictEqual(r.level, 1);
  assert.deepStrictEqual(r.differentials.map(d => d.name), ["Gumoh normal (regurgitasi)"]);
});

test("satu tanda ringan (rewel) = Pantau, tidak langsung GERD", () => {
  const r = A(C("gumoh"), { rewel: "ya" }, { ageDays: 60 });
  assert.strictEqual(r.level, 2);
  assert.ok(!r.differentials.some(d => d.name === "GERD"));
});

test("menyembur berulang di usia 3 minggu = Periksa hari ini, stenosis pilorus disebut dengan angka kejadian", () => {
  const r = A(C("gumoh"), { sembur: "ya" }, { ageDays: 21 });
  assert.strictEqual(r.level, 3);
  const sp = r.differentials.find(d => d.name === "Stenosis pilorus");
  assert.ok(sp && /dari 1\.000/.test(sp.freq));
});

test("stenosis pilorus tidak disebut bila tidak menyembur", () => {
  const r = A(C("gumoh"), { sembur: "tidak", bb: "ya" }, { ageDays: 21 });
  assert.ok(!r.differentials.some(d => d.name === "Stenosis pilorus"));
  assert.ok(r.differentials.some(d => d.name === "GERD"));
});

test("bayi 0–28 hari menolak menyusu = IGD (tanda bahaya WHO)", () => {
  assert.strictEqual(A(C("gumoh"), { tolak: "ya" }, { ageDays: 10 }).level, 4);
  assert.strictEqual(A(C("gumoh"), { tolak: "ya" }, { ageDays: 90 }).level, 3);
});

test("pertanyaan popok tersembunyi sebelum hari ke-5 dan jawabannya diabaikan", () => {
  const r = A(C("gumoh"), { popok: "ya" }, { ageDays: 3 });
  assert.strictEqual(r.level, 1);
});

test("demam: bayi 20 hari suhu 37,6 = IGD; bayi 2 bulan demam = Periksa; anak 1 tahun demam 2 hari = Umum", () => {
  assert.strictEqual(A(C("demam"), { demamya: "ya", suhu: "37,6" }, { ageDays: 20 }).level, 4);
  assert.strictEqual(A(C("demam"), { demamya: "ya", suhu: "38.2" }, { ageDays: 60 }).level, 3);
  assert.strictEqual(A(C("demam"), { demamya: "ya", suhu: "38.5", hari: "2" }, { ageDays: 365 }).level, 1);
  assert.strictEqual(A(C("demam"), { demamya: "ya", hari: "4" }, { ageDays: 365 }).level, 3);
});

test("dehidrasi mengikuti jumlah tanda WHO", () => {
  const d = C("diare");
  assert.strictEqual(A(d, { kondisi: "baik", mata: "tidak", minum: "biasa", cubit: "cepat" }, { ageDays: 400 }).level, 1);
  assert.strictEqual(A(d, { kondisi: "baik", mata: "ya", minum: "biasa", cubit: "cepat" }, { ageDays: 400 }).level, 2);
  assert.strictEqual(A(d, { kondisi: "gelisah", mata: "ya", minum: "haus", cubit: "lambat" }, { ageDays: 400 }).level, 3);
  assert.strictEqual(A(d, { kondisi: "gelisah", mata: "ya", minum: "haus", cubit: "sangat" }, { ageDays: 400 }).level, 4);
});

test("napas cepat sesuai ambang usia WHO", () => {
  const n = C("napas");
  assert.strictEqual(A(n, { rr: "52", tarikan: "tidak", stridor: "tidak" }, { ageDays: 200 }).level, 3);
  assert.strictEqual(A(n, { rr: "45", tarikan: "tidak", stridor: "tidak" }, { ageDays: 200 }).level, 1);
  assert.strictEqual(A(n, { rr: "45", tarikan: "tidak", stridor: "tidak" }, { ageDays: 800 }).level, 3);
  assert.strictEqual(A(n, { rr: "30", tarikan: "ya" }, { ageDays: 800 }).level, 4);
  assert.strictEqual(A(n, { rr: "62" }, { ageDays: 10 }).level, 4);
  assert.strictEqual(A(n, { rr: "55", tarikan: "tidak", stridor: "tidak" }, { ageDays: 40 }).level, 2);
});

test("kejang demam sederhana diklasifikasikan, tingkat tetap ke fasilitas kesehatan", () => {
  const r = A(C("kejang"), { demam: "ya", durasi: "tidak", fokal: "tidak", ulang: "tidak" }, { ageDays: 500 });
  assert.strictEqual(r.level, 4);
  assert.ok(r.notes.some(n => n.id === "n-sederhana"));
  assert.ok(!r.notes.some(n => n.id === "n-kompleks"));
});

test("kolik: pola Rome IV tanpa tanda bahaya = Umum dengan catatan kolik", () => {
  const r = A(C("tangis"), { pola: "ya", tumbuh: "ya", demam: "tidak" }, { ageDays: 42 });
  assert.strictEqual(r.level, 1);
  assert.ok(r.notes.some(n => n.id === "n-kolik"));
});

test("usia dihitung dari tanggal lahir", () => {
  assert.strictEqual(E.Age.days("2026-10-24", "2026-11-07"), 14);
  assert.strictEqual(E.Age.label(14), "14 hari");
  assert.strictEqual(E.Age.label(400), "13 bulan");
});

test("langkah tanda bahaya dipisah dari pertanyaan lain", () => {
  const sp = C("gumoh").split({}, { ageDays: 3 });
  assert.deepStrictEqual(sp.danger.map(q => q.id), ["lemas", "tdkminum", "muntahsemua"]);
  assert.ok(!sp.rest.some(q => q.id === "popok"));
  assert.ok(C("gumoh").split({}, { ageDays: 10 }).rest.some(q => q.id === "popok"));
});

test("angka kejadian memakai frekuensi alami (x dari y), bukan persen", () => {
  checkers.forEach(c => (c.differentials || []).forEach(d => assert.ok(/dari \d/.test(d.freq) && !/%/.test(d.freq), c.id + ": " + d.freq)));
});
