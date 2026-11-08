// Worker "Tanya": POST /ask {question, ageDays, deviceId} -> jawaban Claude (teks biasa, mengalir).
const MODEL = "claude-haiku-5-5";
const DAILY_LIMIT = 20;
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};
// Sama dengan Level.ALL di src/engine.js (default ke 1 = Umum).
const LEVELS = { 0: "Catatan", 1: "Umum", 2: "Pantau", 3: "Periksa hari ini", 4: "Segera ke IGD" };

const text = (status, msg) =>
  new Response(msg, { status, headers: { ...CORS, "Content-Type": "text/plain; charset=utf-8" } });

async function loadKb(env, ctx) {
  const cache = caches.default;
  const key = new Request(env.KB_URL);
  let res = await cache.match(key);
  if (!res) {
    const up = await fetch(env.KB_URL);
    if (!up.ok) throw new Error("kb " + up.status);
    const body = await up.text();
    res = new Response(body, { headers: { "Content-Type": "application/json", "Cache-Control": "max-age=3600" } });
    ctx.waitUntil(cache.put(key, res.clone()));
  }
  return JSON.parse(await res.text());
}

// Port dari AskPrompt.database() di src/page-body.html.
function database(kb) {
  const levelName = l => LEVELS[l] || LEVELS[1];
  return {
    sources: Object.fromEntries(Object.entries(kb.sources || {}).map(([k, v]) => [k, (v.type === "sekunder" ? "[sekunder] " : "") + v.title])),
    penilai_gejala: (kb.checkers || []).map(c => ({ id: c.id, judul: c.title, aturan: (c.rules || []).map(r => ({ tingkat: levelName(r.level), teks: r.text, src: r.src })), default: c.default, kemungkinan: c.differentials, perawatan: c.care, naik_tingkat: c.escalate })),
    panduan: (kb.guides || []).map(g => ({ judul: g.title, bagian: g.sections })),
    obat: kb.obat, imunisasi: kb.imunisasi,
    perkembangan: (kb.milestones || []).map(m => ({ usia: m.label, kemampuan: m.d })),
  };
}

function ageLabel(d) {
  if (d < 31) return d + " hari";
  const months = Math.floor(d / 30.4375);
  if (months < 24) return months + " bulan";
  const y = Math.floor(months / 12), m = months % 12;
  return y + " tahun" + (m ? " " + m + " bulan" : "");
}

// Aturan sama dengan AskPrompt.build(); DATABASE di system (di-cache), pertanyaan di pesan user.
function systemPrompt(kb, ageDays) {
  const today = new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 10); // WIB
  const rules = [
    "Anda adalah asisten kesehatan bayi dan anak untuk orang tua di Indonesia. Jawab dalam Bahasa Indonesia yang tenang, jelas, dan sederhana.",
    "ATURAN WAJIB:",
    "1. Jawab HANYA dari DATABASE di bawah, jangan memakai pengetahuan lain. Bila tidak ada di database, tulis persis: \"Belum ada di database terverifikasi aplikasi ini.\" lalu sarankan konsultasi tenaga kesehatan bila menyangkut gejala.",
    "2. Setiap pernyataan fakta diberi kode sumber dalam kurung siku sesuai kunci sources, misalnya [who_newborn]. Jangan mengarang kode.",
    "3. Kalimat pertama adalah pesan utama: tingkat (Umum, Pantau, Periksa hari ini, atau Segera ke IGD) dan apa yang harus dilakukan, sesuai aturan penilai di database. Ikuti jumlah tanda sesuai kriteria; satu tanda yang belum memenuhi kriteria cukup disebut Pantau.",
    "4. Sebut kemungkinan dari yang paling sering, memakai frekuensi alami seperti \"3 dari 10 bayi\". Kondisi langka hanya disebut bila ciri pembedanya ada pada cerita pengguna, selalu dengan angka kejadiannya.",
    "5. Jangan memberi vonis pasti; sebut pemeriksaan yang memastikan bila ada di database. Jangan memberi dosis obat selain yang tertulis di database.",
    "6. Jangan menakut-nakuti; tanpa kata dramatis. Maksimal sekitar 180 kata, kalimat pendek, tanpa tabel.",
    "DATABASE (JSON):", JSON.stringify(database(kb)),
  ].join("\n");
  const ctxLine = "Usia anak menurut profil: " + (ageDays === null ? "tidak diketahui" : ageLabel(ageDays) + " (" + ageDays + " hari)") + ". Tanggal hari ini: " + today + ".";
  return [
    { type: "text", text: rules, cache_control: { type: "ephemeral" } },
    { type: "text", text: ctxLine },
  ];
}

async function rateLimit(env, deviceId) {
  const day = new Date().toISOString().slice(0, 10);
  const key = "rl:" + day + ":" + deviceId;
  const n = parseInt((await env.RL.get(key)) || "0", 10);
  if (n >= DAILY_LIMIT) return false;
  await env.RL.put(key, String(n + 1), { expirationTtl: 172800 });
  return true;
}

function streamAnswer(upstream) {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const enc = new TextEncoder();
  (async () => {
    const reader = upstream.body.getReader();
    const dec = new TextDecoder();
    let buf = "";
    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        let i;
        while ((i = buf.indexOf("\n")) >= 0) {
          const line = buf.slice(0, i).trim();
          buf = buf.slice(i + 1);
          if (!line.startsWith("data:")) continue;
          let ev;
          try { ev = JSON.parse(line.slice(5)); } catch { continue; }
          if (ev.type === "content_block_delta" && ev.delta && ev.delta.type === "text_delta") await writer.write(enc.encode(ev.delta.text));
          else if (ev.type === "error") await writer.write(enc.encode("\n\n[Jawaban terputus. Coba lagi.]"));
        }
      }
    } catch {
      await writer.write(enc.encode("\n\n[Jawaban terputus. Coba lagi.]")).catch(() => {});
    } finally {
      await writer.close().catch(() => {});
    }
  })();
  return new Response(readable, { headers: { ...CORS, "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
    if (url.pathname !== "/ask" || request.method !== "POST") return text(404, "Alamat tidak ditemukan.");

    let body;
    try { body = await request.json(); } catch { return text(400, "Permintaan tidak valid."); }
    const question = typeof body.question === "string" ? body.question.trim() : "";
    const deviceId = typeof body.deviceId === "string" ? body.deviceId : "";
    let ageDays = body.ageDays;
    ageDays = Number.isInteger(ageDays) && ageDays >= 0 && ageDays < 7300 ? ageDays : null;
    if (question.length < 1 || question.length > 1000) return text(400, "Pertanyaan harus 1 sampai 1000 huruf.");
    if (!/^[A-Za-z0-9-]{8,64}$/.test(deviceId)) return text(400, "Identitas perangkat tidak valid.");

    if (!(await rateLimit(env, deviceId))) return text(429, "Batas " + DAILY_LIMIT + " pertanyaan per hari sudah tercapai. Coba lagi besok.");

    let kb;
    try { kb = await loadKb(env, ctx); } catch { return text(502, "Database pengetahuan sedang tidak bisa diambil. Coba lagi nanti."); }

    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: MODEL, max_tokens: 800, stream: true,
        system: systemPrompt(kb, ageDays),
        messages: [{ role: "user", content: "PERTANYAAN ORANG TUA:\n" + question }],
      }),
    }).catch(() => null);
    if (!upstream || !upstream.ok || !upstream.body) {
      console.log("anthropic error", upstream ? upstream.status : "network"); // tanpa isi pertanyaan / deviceId
      return text(502, "Layanan jawaban sedang bermasalah. Coba lagi beberapa saat lagi.");
    }
    return streamAnswer(upstream);
  },
};
