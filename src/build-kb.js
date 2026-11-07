// Menyusun basis pengetahuan, memvalidasi, lalu menulis satu file JSON per dokumen database.
const fs = require("fs");
const path = require("path");
const Engine = require("./engine");
const sources = require("./kb-sources");
const checkers = require("./kb-checkers");
const { guides, milestones, imunisasi, obat, meta } = require("./kb-content");

const kb = { sources, checkers, guides, milestones, imunisasi, obat, meta };
const errors = Engine.KnowledgeValidator.validate(kb);
if (errors.length) {
  console.error("Validasi gagal:\n" + errors.join("\n"));
  process.exit(1);
}

const out = path.join(__dirname, "..", "kb");
fs.rmSync(out, { recursive: true, force: true });
const write = (coll, id, data) => {
  const dir = path.join(out, coll);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, id + ".json"), JSON.stringify(data));
};
Object.entries(sources).forEach(([id, s]) => write("sources", id, s));
checkers.forEach(c => write("checkers", c.id, c));
guides.forEach(g => write("guides", g.id, g));
milestones.forEach(m => write("milestones", m.id, m));
obat.forEach(o => write("obat", o.id, o));
write("kb", "meta", meta);
write("kb", "imunisasi", imunisasi);
write("changelog", "2026-11-07-awal", { date: "2026-11-07", title: "Basis pengetahuan awal", text: "Disusun dari riset sumber resmi (WHO, IDAI, Kemenkes, AAP, CDC, FDA). Setiap fakta bersumber; sumber sekunder ditandai.", by: "Claude" });
write("changelog", "2026-11-07-ux", { date: "2026-11-07", title: "Tanda bahaya ditanyakan lebih dulu; angka kejadian sebagai frekuensi alami", text: "Setiap penilai kini menandai tanda bahaya WHO/IMCI yang ditanyakan di langkah pertama. Angka kejadian ditulis sebagai \"x dari y\" (misalnya 3 dari 10 bayi), bukan persen, sesuai CDC Clear Communication Index.", by: "Claude" });
kb.changelog = fs.readdirSync(path.join(out, "changelog")).map(f => JSON.parse(fs.readFileSync(path.join(out, "changelog", f))));
fs.writeFileSync(path.join(__dirname, "..", "kb.json"), JSON.stringify(kb));

const count = d => fs.readdirSync(path.join(out, d)).length;
console.log("OK. Dokumen:", fs.readdirSync(out).map(d => d + "=" + count(d)).join(", "));
console.log("Ukuran kb.json:", fs.statSync(path.join(__dirname, "..", "kb.json")).size, "byte");
