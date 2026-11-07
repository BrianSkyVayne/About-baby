// Menyusun halaman: index.html (artifak online), offline.html (file lokal dengan data tertanam),
// dan android/app/src/main/assets/www/index.html (tampilan sama untuk APK).
const fs = require("fs"), path = require("path");
const R = p => fs.readFileSync(path.join(__dirname, p), "utf8");
const root = path.join(__dirname, "..");
const head = R("page-head.html");
const body = R("page-body.html").replace("/*ENGINE*/", () => R("engine.js"));
const esc = t => t.replace(/</g, "\\u003c");

// Template lokal: dokumen lengkap, data diisi di penanda /*KB_EMBED*/.
const localTpl = '<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">' +
  head + "</head><body>" +
  body.replace("<!--KB_EMBED_TAG-->", '<script id="kb-embed" type="application/json">/*KB_EMBED*/</script>').replace("<!--OFFLINE_TPL-->", "") +
  "</body></html>";

// Artifak online: menyimpan template lokal agar bisa mengunduh versi offline.
const online = head +
  body.replace("<!--KB_EMBED_TAG-->", "").replace("<!--OFFLINE_TPL-->", () => '<script id="offline-tpl" type="application/json">' + esc(JSON.stringify(localTpl)) + "</script>");
const kbText = esc(fs.readFileSync(path.join(root, "kb.json"), "utf8"));
const offline = localTpl.replace("/*KB_EMBED*/", () => kbText);

fs.writeFileSync(path.join(root, "index.html"), online);
fs.writeFileSync(path.join(root, "offline.html"), offline);
const apk = path.join(root, "android", "app", "src", "main", "assets", "www");
fs.mkdirSync(apk, { recursive: true });
fs.writeFileSync(path.join(apk, "index.html"), offline);
fs.copyFileSync(path.join(root, "kb.json"), path.join(apk, "kb.json"));

for (const [name, html] of [["index.html", online], ["offline.html", offline]]) {
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
  scripts.forEach(code => new Function(code));
  const json = [...html.matchAll(/<script id="[^"]+" type="application\/json">([\s\S]*?)<\/script>/g)].map(m => m[1]);
  json.forEach(j => JSON.parse(j));
  console.log(name, html.length, "byte;", scripts.length, "script +", json.length, "json OK");
}
