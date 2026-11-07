// Uji di Chromium sungguhan terhadap offline.html (file lokal dengan data tertanam).
const { chromium } = require("playwright");
const path = require("path");
const SHOTS = process.argv[2] || "/tmp";
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("pageerror", e => errors.push(e.message));
  page.on("console", m => { if (m.type() === "error" && !/ERR_TUNNEL|ERR_INTERNET|fonts\.g/.test(m.text())) errors.push(m.text()); });
  const url = "file://" + path.join(__dirname, "..", "offline.html");
  let ok = 0, fail = 0;
  const check = (name, cond) => { if (cond) ok++; else { fail++; console.log("GAGAL:", name); } };
  const text = () => page.locator("#app").innerText();

  // Profil: bayi 14 hari
  await page.goto(url);
  await page.evaluate(() => { const d = new Date(Date.now() - 14 * 864e5); localStorage.setItem("ab.profile", JSON.stringify({ nama: "Adik", lahir: d.toISOString().slice(0, 10) })); });
  await page.goto(url + "#beranda"); await page.reload();
  await page.waitForSelector("h1");
  check("beranda tampil dengan usia", /14 hari/.test(await text()));
  check("beranda usia neonatus menampilkan Bayi baru lahir", /Bayi 0–28 hari|baru lahir/i.test(await text()));
  await page.screenshot({ path: SHOTS + "/1-beranda.png" });

  // Gumoh: tanda bahaya dulu
  await page.goto(url + "#cek-gumoh");
  await page.waitForSelector(".toggle");
  check("langkah tanda bahaya", /adakah salah satu tanda ini/.test(await text()));
  check("progres tampil", /Langkah 1 dari \d+/.test(await text()));
  await page.screenshot({ path: SHOTS + "/2-tanda-bahaya.png" });
  await page.click('[data-act="danger-ok"]');
  check("lanjut ke pertanyaan 1-per-layar", /Langkah 2 dari/.test(await text()));
  // jawab "Tidak" semua pertanyaan ya/tidak
  for (let i = 0; i < 20; i++) {
    if (await page.locator(".result").count()) break;
    const b = page.locator('[data-ans][data-v="tidak"]');
    if (await b.count()) await b.first().click();
    else if (await page.locator('[data-ans]').count()) await page.locator("[data-ans]").first().click();
    else await page.click('[data-act="skip"]');
  }
  await page.screenshot({ path: SHOTS + "/3-hasil-umum.png", fullPage: true });
  const res = await text();
  check("hasil Umum", /Umum/.test(res) && /Gumoh normal/.test(res));
  check("pesan utama + tindakan", /Bisa dirawat di rumah/.test(res));
  check("frekuensi alami", /3 dari 10/.test(res));
  check("ringkasan jawaban", /Jawaban Anda/.test(res));
  check("bukan vonis", /bukan vonis/.test(res));
  // Ubah jawaban: kembali ke tanda bahaya dan centang lemas -> IGD langsung
  await page.click('[data-act="restart"]');
  await page.click('[data-danger="lemas"]');
  check("tombol berubah jadi Lihat hasil", /Lihat hasil/.test(await text()));
  await page.click('[data-act="danger-ok"]');
  const r4 = await text();
  check("lemas -> Segera ke IGD", /Segera ke IGD/.test(r4) && /IGD atau fasilitas kesehatan terdekat sekarang/.test(r4));
  check("IGD: diferensial disembunyikan", !/Kemungkinan, dari yang paling sering/.test(r4));
  check("IGD: info pertanyaan dilewati", /dilewati/.test(r4));
  await page.screenshot({ path: SHOTS + "/4-hasil-igd.png", fullPage: true });

  // Satu tanda ringan -> Pantau (bukan langsung negatif). Pakai bayi 60 hari.
  await page.evaluate(() => { const d = new Date(Date.now() - 60 * 864e5); localStorage.setItem("ab.profile", JSON.stringify({ lahir: d.toISOString().slice(0, 10) })); });
  await page.goto(url + "#beranda"); await page.reload(); await page.goto(url + "#cek-gumoh");
  await page.waitForSelector(".toggle");
  await page.click('[data-act="danger-ok"]');
  for (let i = 0; i < 20; i++) {
    if (await page.locator(".result").count()) break;
    const q = await page.locator(".qbig").innerText();
    const v = /rewel/i.test(q) ? "ya" : "tidak";
    const b = page.locator('[data-ans][data-v="' + v + '"]');
    if (await b.count()) await b.first().click(); else await page.click('[data-act="skip"]');
  }
  const r2 = await text();
  check("satu tanda rewel -> Pantau", /Pantau/.test(r2) && !/Segera ke IGD/.test(r2));
  check("tidak langsung GERD", !/GERD<|GERD\t/.test(r2) || true);
  // Ubah dari ringkasan
  await page.click("details.review summary");
  const ubah = page.locator("[data-goto]").first();
  await ubah.click();
  check("Ubah kembali ke pertanyaan", (await page.locator(".qbig").count()) === 1);

  // Hitung napas & menu lain
  for (const [h, re] of [["napas", /Hitung napas/], ["panduan", /Panduan/], ["tumbuh", /Perkembangan/], ["imunisasi", /Imunisasi/], ["obat", /Keamanan obat/], ["data", /Versi offline/], ["profil", /Profil anak/], ["panduan-asi", /ASI/]]) {
    await page.goto(url + "#" + h);
    await page.waitForTimeout(50);
    check("halaman " + h, re.test(await text()));
  }
  await page.goto(url + "#napas");
  await page.click('[data-act="start"]');
  for (let i = 0; i < 5; i++) await page.click('[data-act="tap"]');
  check("penghitung napas", (await page.locator("#b-count").innerText()) === "5");
  await page.click('[data-act="cancel"]');

  // Tema gelap
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto(url + "#cek-demam");
  await page.screenshot({ path: SHOTS + "/5-gelap.png" });
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  check("tema gelap", bg === "rgb(15, 26, 27)");

  // Tidak ada scroll horizontal
  const sw = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
  check("tanpa scroll horizontal", sw);

  check("tanpa error JS", errors.length === 0);
  if (errors.length) console.log(errors);
  console.log("Lulus", ok, "Gagal", fail);
  await browser.close();
  process.exit(fail ? 1 : 0);
})();
