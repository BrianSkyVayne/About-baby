// Evaluasi pencarian tanya-jawab luring. Jalankan: node test/search-eval.js
// Gold: test/search-gold.json = [{ q, expect: "type:id" | null, danger: bool }]
"use strict";
const path = require("path");
const Engine = require(path.join(__dirname, "..", "src", "engine"));
const sources = require(path.join(__dirname, "..", "src", "kb-sources"));
const checkers = require(path.join(__dirname, "..", "src", "kb-checkers"));
const content = require(path.join(__dirname, "..", "src", "kb-content"));
const gold = require(path.join(__dirname, "search-gold.json"));

const kb = { sources, checkers, guides: content.guides, milestones: content.milestones, imunisasi: content.imunisasi, obat: content.obat, meta: content.meta };
if (content.mitos) kb.mitos = content.mitos;

const errs = Engine.KnowledgeValidator.validate(kb);
if (errs.length) console.log("Peringatan validasi KB (" + errs.length + "):\n  " + errs.slice(0, 10).join("\n  "));

const ask = new Engine.AskEngine(kb);
let withExpect = 0, top1 = 0, top3 = 0, dangerPos = 0, dangerHit = 0, falsePos = 0;
const fails = [];
gold.forEach(g => {
  const r = ask.answer(g.q);
  const keys = r.results.map(x => x.type + ":" + x.id);
  if (g.expect) {
    withExpect++;
    if (keys[0] === g.expect) top1++;
    if (keys.slice(0, 3).indexOf(g.expect) >= 0) top3++;
    else fails.push("[cari] " + g.q + " -> harap " + g.expect + ", dapat " + (keys.slice(0, 3).join(", ") || "(kosong)"));
  } else if (keys.length && r.confidence === "high") {
    fails.push("[cari] " + g.q + " -> harap tidak ada jawaban yakin, dapat " + keys[0]);
  }
  const det = r.danger.length > 0;
  if (g.danger) { dangerPos++; if (det) dangerHit++; else fails.push("[BAHAYA TERLEWAT] " + g.q); }
  else if (det) { falsePos++; fails.push("[bahaya palsu] " + g.q + " -> " + r.danger.map(d => d.id).join(", ")); }
});
const pct = (a, b) => b ? (100 * a / b).toFixed(1) + "%" : "n/a";
console.log("Soal: " + gold.length + " (dengan target: " + withExpect + ")");
console.log("Top-1: " + pct(top1, withExpect) + "  Top-3: " + pct(top3, withExpect));
console.log("Recall tanda bahaya: " + pct(dangerHit, dangerPos) + " (" + dangerHit + "/" + dangerPos + ")  Bahaya palsu: " + falsePos);
if (fails.length) console.log("\nKegagalan:\n  " + fails.join("\n  "));
if (dangerPos && dangerHit < dangerPos) process.exit(1);
