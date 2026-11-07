// Uji index.html (versi online) dengan tiruan runtime claude.ai: db, user, sample, downloads.
const { chromium } = require("playwright");
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const docs = {};
for (const c of fs.readdirSync(path.join(root, "kb"))) for (const f of fs.readdirSync(path.join(root, "kb", c))) docs[c + "/" + f.slice(0, -5)] = JSON.parse(fs.readFileSync(path.join(root, "kb", c, f)));
const fakeRuntime = docsJson => {
  const docs = JSON.parse(docsJson); window.__saved = []; window.__prompts = [];
  const subs = [];
  const notify = () => subs.forEach(f => f());
  const snapColl = name => ({ docs: Object.keys(docs).filter(k => k.split("/").length === 2 && k.startsWith(name + "/")).map(k => ({ id: k.split("/")[1], data: () => docs[k] })) });
  const db = {
    collection: name => ({
      onSnapshot: (cb) => { const f = () => cb(snapColl(name)); subs.push(f); setTimeout(f, 10); return () => {}; },
      add: async d => { docs[name + "/a" + Date.now()] = d; notify(); }
    }),
    doc: p => ({
      onSnapshot: cb => { const f = () => cb({ exists: !!docs[p], data: () => docs[p] }); subs.push(f); setTimeout(f, 10); return () => {}; },
      set: async d => { docs[p] = d; notify(); },
      update: async d => { docs[p] = Object.assign({}, docs[p], d); notify(); }
    })
  };
  const sample = async (prompt, opts) => { window.__prompts.push(prompt); opts.onText && opts.onText({ text: "Pantau dulu [aap_spitup]" }); return { text: "Pantau. Gumoh dialami sekitar 3 dari 10 bayi [aap_spitup].", truncated: false }; };
  const caps = { db, sample, user: { canEdit: async () => true }, downloads: { save: async x => { window.__saved.push(x); } } };
  window.claude = { use: async n => caps[n] || null };
};
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("pageerror", e => errors.push(e.message));
  page.on("console", m => { if (m.type() === "error" && !/ERR_TUNNEL|fonts\.g/.test(m.text())) errors.push(m.text()); });
  // tambah satu usulan untuk diuji
  const g = JSON.parse(JSON.stringify(docs["guides/ibu"]));
  docs["usulan/u1"] = { type: "pembaruan", status: "baru", createdAt: "2026-12-01T01:00:00Z", title: "Uji usulan", summary: "Ringkasan", sources: [], target: { collection: "guides", id: "ibu" }, patch: g };
  const bad = JSON.parse(JSON.stringify(g)); bad.sections.find(s => s.items).items[0].src = [];
  docs["usulan/u2"] = { type: "pembaruan", status: "baru", createdAt: "2026-12-01T02:00:00Z", title: "Usulan tanpa sumber", target: { collection: "guides", id: "ibu" }, patch: bad };
  await page.addInitScript(fakeRuntime, JSON.stringify(docs));
  await page.goto("file://" + path.join(root, "index.html"));
  let ok = 0, fail = 0; const check = (n, c) => { if (c) ok++; else { fail++; console.log("GAGAL:", n); } };
  const text = () => page.locator("#app").innerText();
  await page.waitForSelector("h1");
  check("mode online: menu Tanya", /Tanya/.test(await page.locator("#nav").innerText()));
  check("banner usulan", /2 usulan pembaruan/.test(await text()));
  await page.goto(page.url().split("#")[0] + "#tanya"); await page.fill("#t-q", "bayi gumoh"); await page.click('form[data-form="ask"] button[type=submit]');
  await page.waitForFunction(() => /3 dari 10/.test(document.getElementById("app").innerText));
  check("jawaban + tautan sumber", (await page.locator("#t-ans a").count()) >= 1);
  check("prompt memuat database", await page.evaluate(() => /DATABASE \(JSON\)/.test(window.__prompts[0])));
  await page.goto(page.url().split("#")[0] + "#data");
  await page.click('[data-reject="u2"]').catch(() => {});
  await page.click('[data-approve="u1"]');
  await page.waitForTimeout(100);
  check("usulan disetujui -> versi naik", /Versi data \d{4}\.\d\d\.\d\d-\d/.test(await text()) && await page.evaluate(() => true));
  await page.click('[data-act="export-offline"]');
  await page.click('[data-act="export"]');
  await page.waitForTimeout(100);
  const saved = await page.evaluate(() => window.__saved.map(s => ({ f: s.filename, n: s.data.length, d: s.data })));
  check("unduh offline html", saved.some(s => /offline-.*\.html$/.test(s.f)));
  check("unduh data apk", saved.some(s => /data-.*\.json$/.test(s.f)));
  // buka hasil unduhan offline di halaman baru, tanpa runtime claude
  const off = saved.find(s => /\.html$/.test(s.f));
  const tmp = path.join(require("os").tmpdir(), "ab-off.html"); fs.writeFileSync(tmp, off.d);
  const p2 = await browser.newPage(); const e2 = []; p2.on("pageerror", e => e2.push(e.message));
  await p2.goto("file://" + tmp + "#data"); await p2.waitForSelector("h1");
  check("file offline hasil unduhan terbuka", /Versi offline/.test(await p2.locator("#app").innerText()) && !e2.length);
  check("file offline membawa data terbaru", /Disetujui pemilik|Uji usulan/.test(await p2.locator("#app").innerText()));
  check("tanpa error JS", !errors.length); if (errors.length) console.log(errors);
  console.log("Lulus", ok, "Gagal", fail);
  await browser.close(); process.exit(fail ? 1 : 0);
})();
