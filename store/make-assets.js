// Membuat bahan Play Store: ikon 512, feature graphic 1024x500, dan tangkapan layar 1080x1920.
// Font: tangkapan layar memakai Inter/Lora lokal karena Google Fonts tidak bisa diunduh di lingkungan build.
const { chromium } = require("playwright");
const path = require("path");
const out = path.join(__dirname);
const root = path.join(__dirname, "..");
const FONT_CSS = ":root{--font-body:'Inter',system-ui,sans-serif;--font-display:'Lora',Georgia,serif}";
const ICON_SVG = (size, round) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 108 108">
  ${round ? '<circle cx="54" cy="54" r="54" fill="#1F6F6A"/>' : '<rect width="108" height="108" fill="#1F6F6A"/>'}
  <circle cx="54" cy="56" r="20" fill="#fff"/>
  <path d="M54,36c-2,-6 4,-10 8,-6" stroke="#fff" stroke-width="4" stroke-linecap="round" fill="none"/>
  <circle cx="47" cy="56.5" r="2.5" fill="#1F6F6A"/><circle cx="61" cy="56.5" r="2.5" fill="#1F6F6A"/>
  <path d="M49,64q5,4 10,0" stroke="#1F6F6A" stroke-width="2.5" stroke-linecap="round" fill="none"/></svg>`;

(async () => {
  const browser = await chromium.launch();
  // Ikon 512 (Play memotong sudut sendiri, jadi persegi penuh)
  let p = await browser.newPage({ viewport: { width: 512, height: 512 } });
  await p.setContent(`<body style="margin:0">${ICON_SVG(512, false)}</body>`);
  await p.screenshot({ path: path.join(out, "icon-512.png") });
  // Feature graphic
  p = await browser.newPage({ viewport: { width: 1024, height: 500 } });
  await p.setContent(`<body style="margin:0;width:1024px;height:500px;background:#1F6F6A;display:flex;align-items:center;gap:56px;padding:0 80px;box-sizing:border-box;font-family:Inter,sans-serif;color:#fff">
    <div style="flex:none;width:220px;height:220px;border-radius:50%;background:#2A847E;display:grid;place-items:center">${ICON_SVG(200, true)}</div>
    <div><div style="font-family:Lora,serif;font-size:68px;font-weight:600;line-height:1.05">Asisten Bayi</div>
    <div style="font-size:30px;line-height:1.35;margin-top:18px;max-width:560px;color:#DDEFEC">Cek gejala bayi &amp; anak langkah demi langkah, sesuai pedoman WHO, IDAI, dan Kemenkes.</div></div></body>`);
  await p.screenshot({ path: path.join(out, "feature-1024x500.png") });

  // Tangkapan layar
  const ctx = await browser.newContext({ viewport: { width: 360, height: 640 }, deviceScaleFactor: 3 });
  await ctx.addInitScript(() => {
    localStorage.setItem("ab.ack", "1");
    const d = new Date(Date.now() - 16 * 864e5);
    localStorage.setItem("ab.profile", JSON.stringify({ nama: "Adik", lahir: d.toISOString().slice(0, 10) }));
  });
  const page = await ctx.newPage();
  const url = "file://" + path.join(root, "offline.html");
  const shot = async (name, hash, prep) => {
    await page.goto(url + "#" + hash);
    await page.addStyleTag({ content: FONT_CSS });
    await page.waitForSelector("h1");
    if (prep) await prep();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(150);
    await page.screenshot({ path: path.join(out, name) });
  };
  await shot("layar-1-beranda.png", "beranda");
  await shot("layar-2-tanda-bahaya.png", "cek-gumoh");
  await shot("layar-3-pertanyaan.png", "cek-gumoh", async () => { await page.click('[data-act="danger-ok"]'); });
  await shot("layar-4-hasil.png", "cek-gumoh", async () => {
    for (let i = 0; i < 20 && !(await page.locator(".result").count()); i++) {
      const b = page.locator('[data-ans][data-v="tidak"]');
      if (await b.count()) await b.first().click(); else await page.click('[data-act="skip"]');
    }
  });
  await shot("layar-5-perkembangan.png", "tumbuh");
  await shot("layar-6-panduan.png", "panduan-tidur");
  await browser.close();
  console.log("selesai");
})();
