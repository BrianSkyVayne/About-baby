# Worker "Tanya" (Cloudflare)

Menerima `POST /ask` berisi JSON `{ "question": "...", "ageDays": 120, "deviceId": "abcd1234" }`
lalu mengalirkan jawaban Claude sebagai teks biasa (`text/plain; charset=utf-8`). CORS terbuka (`*`).

Jawaban hanya boleh dari `kb.json` (diambil dari `KB_URL`, di-cache 1 jam). Aturan prompt sama dengan
`AskPrompt` di `src/page-body.html`; bila salah satu diubah, ubah juga yang lain.

## Pasang
1. `npx wrangler kv namespace create RL` lalu salin `id` ke `wrangler.toml` (ganti `REPLACE_WITH_KV_NAMESPACE_ID`).
2. `npx wrangler secret put ANTHROPIC_API_KEY` (kunci API Anthropic, jangan ditulis di file).
3. Periksa `KB_URL` di `wrangler.toml`.
4. `npx wrangler deploy` dari folder `worker/`. Alamat worker yang muncul dipakai halaman untuk fitur Tanya.

## Aturan
- `question` 1-1000 huruf; `deviceId` 8-64 karakter `A-Z a-z 0-9 -`; `ageDays` bilangan bulat atau `null`.
- Batas 20 pertanyaan per perangkat per hari (KV `RL`, kunci `rl:<tanggal UTC>:<deviceId>`, kedaluwarsa 2 hari).
- Kode galat: 400 (permintaan salah), 429 (batas harian), 502 (database atau layanan jawaban bermasalah). Pesan berbahasa Indonesia.
- Isi pertanyaan tidak pernah dicatat di log, apalagi bersama `deviceId`.
- Model `claude-haiku-5-5`, `max_tokens` 800, database di prompt sistem dengan `cache_control` agar murah.
