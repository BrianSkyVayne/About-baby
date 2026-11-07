// Uji mode Android: halaman di APK memakai jembatan AndroidKB (ditiru di sini).
const { chromium } = require("playwright");
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const kb = fs.readFileSync(path.join(root, "kb.json"), "utf8");
const newer = JSON.parse(kb); newer.meta.version = "2099.01.01-1";
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = []; page.on("pageerror", e => errors.push(e.message));
  await page.addInitScript(([kb, newer]) => {
    let saved = null, url = "";
    window.__log = [];
    window.AndroidKB = {
      getKb: () => saved || kb,
      save: t => { saved = t; window.__log.push("save"); return true; },
      getUrl: () => url, setUrl: u => { url = u; },
      openUrl: u => window.__log.push("open " + u),
      fetchText: (u, id) => setTimeout(() => window.__androidCb(id, true, newer), 20),
      pickFile: id => setTimeout(() => window.__androidCb(id, true, "{rusak"), 20)
    };
  }, [kb, JSON.stringify(newer)]);
  await page.goto("file://" + path.join(root, "android/app/src/main/assets/www/index.html") + "#data");
  await page.waitForSelector("h1");
  let ok = 0, fail = 0; const check = (n, c) => { if (c) ok++; else { fail++; console.log("GAGAL:", n); } };
  const text = () => page.locator("#app").innerText();
  check("mode android: blok perbarui", /Perbarui data di perangkat ini/.test(await text()));
  await page.click('[data-act="import"]'); await page.waitForTimeout(100);
  check("file rusak ditolak", /bukan JSON/.test(await text()));
  await page.fill("#k-url", "https://contoh.id/kb.json");
  await page.click('[data-act="refresh"]'); await page.waitForTimeout(150);
  check("pembaruan dari URL diterima", /2099\.01\.01-1/.test(await text()));
  check("disimpan di perangkat", await page.evaluate(() => window.__log.includes("save")));
  await page.click('[data-act="online"]');
  check("buka versi online lewat peramban", await page.evaluate(() => window.__log.some(l => l.startsWith("open https://claude.ai"))));
  check("tanpa error JS", !errors.length); if (errors.length) console.log(errors);
  console.log("Lulus", ok, "Gagal", fail);
  await browser.close(); process.exit(fail ? 1 : 0);
})();
