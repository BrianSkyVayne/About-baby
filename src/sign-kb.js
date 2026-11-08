#!/usr/bin/env node
// Tanda tangan kb.json (ECDSA P-256, SHA-256), hanya modul bawaan Node.
//   node src/sign-kb.js genkey <path-di-luar-repo/kb-private.pem>
//     -> menulis kunci privat PEM, mencetak kunci publik base64 (SPKI) untuk PUBLIC_KEY_B64 di KbUpdateJob.java
//   node src/sign-kb.js sign <kb-private.pem> [kb.json]
//     -> menulis kb.json.sig (base64 tanda tangan DER) di sebelah kb.json
"use strict";
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const repo = path.resolve(__dirname, "..");
const [cmd, a1, a2] = process.argv.slice(2);

function die(msg) { console.error(msg); process.exit(1); }

if (cmd === "genkey") {
  if (!a1) die("Pakai: node src/sign-kb.js genkey <path-kunci-privat.pem>");
  const out = path.resolve(a1);
  if (out.startsWith(repo + path.sep)) die("Simpan kunci privat DI LUAR folder repo.");
  if (fs.existsSync(out)) die("File sudah ada, tidak ditimpa: " + out);
  const { privateKey, publicKey } = crypto.generateKeyPairSync("ec", { namedCurve: "prime256v1" });
  fs.writeFileSync(out, privateKey.export({ type: "pkcs8", format: "pem" }), { mode: 0o600 });
  console.log("Kunci privat: " + out);
  console.log("PUBLIC_KEY_B64 = " + publicKey.export({ type: "spki", format: "der" }).toString("base64"));
} else if (cmd === "sign") {
  if (!a1) die("Pakai: node src/sign-kb.js sign <kunci-privat.pem> [kb.json]");
  const kbPath = path.resolve(a2 || path.join(repo, "kb.json"));
  const data = fs.readFileSync(kbPath);
  const key = crypto.createPrivateKey(fs.readFileSync(path.resolve(a1)));
  const sig = crypto.sign("sha256", data, { key, dsaEncoding: "der" });
  if (!crypto.verify("sha256", data, { key: crypto.createPublicKey(key), dsaEncoding: "der" }, sig)) die("Verifikasi gagal.");
  fs.writeFileSync(kbPath + ".sig", sig.toString("base64") + "\n");
  console.log("Ditulis: " + kbPath + ".sig");
} else {
  die("Perintah: genkey <path.pem> | sign <path.pem> [kb.json]");
}
