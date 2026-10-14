// Observatorio de memecoins: registra pools nuevos de Solana (GeckoTerminal, API pública sin clave)
// y cómo evolucionan a las 6 h, 24 h, 3 días y 7 días. Nadie opera aquí: solo se mira y se apunta.
// Reglas fijadas de antemano:
//  - Se apunta un pool nuevo solo si ya tiene al menos 1.000 USD de liquidez (si no, nadie podría comprar de verdad).
//  - Máximo 40 pools nuevos por pasada. El precio inicial es el del primer registro (no el del minuto cero).
//  - "Muerto" = liquidez menor de 1.000 USD, precio un 90 % o más por debajo del inicial, o pool desaparecido.
//  - "Se duplica" = precio al menos el doble del inicial.
import fs from 'node:fs';
import path from 'node:path';

const API = 'https://api.geckoterminal.com/api/v2';
const NET = 'solana';
const HOURS = [6, 24, 72, 168];
const MIN_LIQ = 1000, MAX_NEW = 40, HOUR = 3600000;

const num = x => (x === null || x === undefined || x === '' || !isFinite(+x)) ? null : +x;
export function parsePool(d) {
  const a = (d && d.attributes) || {};
  const tx = (a.transactions && a.transactions.h24) || {};
  return {
    addr: a.address || null, name: a.name || null,
    created: a.pool_created_at ? Date.parse(a.pool_created_at) : null,
    price: num(a.base_token_price_usd), liq: num(a.reserve_in_usd), fdv: num(a.fdv_usd),
    v24: num(a.volume_usd && a.volume_usd.h24), buys: num(tx.buys), sells: num(tx.sells)
  };
}
const median = a => { if (!a.length) return null; const s = a.slice().sort((x, y) => x - y), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };

export function isDead(cp, p0) {
  if (cp.missing) return true;
  if (cp.liq !== null && cp.liq < MIN_LIQ) return true;
  if (cp.price !== null && p0 > 0 && cp.price <= 0.1 * p0) return true;
  return false;
}
export function summarize(state, now) {
  const pools = Object.values(state.pools);
  const out = { updated: now, tracked: pools.length, last24h: pools.filter(p => now - p.first <= 24 * HOUR).length, rules: { minLiq: MIN_LIQ, deadDrop: 0.9 }, checkpoints: [], latest: [] };
  HOURS.forEach(h => {
    const rows = pools.filter(p => p.cps && p.cps[h]).map(p => ({ p0: p.p0, cp: p.cps[h] }));
    const dead = rows.filter(r => isDead(r.cp, r.p0)).length;
    const x2 = rows.filter(r => !r.cp.missing && r.cp.price !== null && r.p0 > 0 && r.cp.price >= 2 * r.p0).length;
    const ratios = rows.filter(r => !r.cp.missing && r.cp.price !== null && r.p0 > 0).map(r => r.cp.price / r.p0 - 1);
    out.checkpoints.push({ hours: h, n: rows.length, dead: rows.length ? dead / rows.length : null, x2: rows.length ? x2 / rows.length : null, medianChange: median(ratios), medianLiq: median(rows.filter(r => !r.cp.missing && r.cp.liq !== null).map(r => r.cp.liq)) });
  });
  out.latest = pools.sort((a, b) => b.first - a.first).slice(0, 8).map(p => ({ name: p.name, first: p.first, liq: p.l0, fdv: p.f0 }));
  return out;
}

export async function run(opt = {}) {
  const fetchFn = opt.fetchFn || fetch, now = opt.now || Date.now(), dir = opt.dir || 'data/memes', sleep = opt.sleep || (ms => new Promise(r => setTimeout(r, ms)));
  const statePath = path.join(dir, 'tracked.json');
  let state = { pools: {} };
  try { state = JSON.parse(fs.readFileSync(statePath, 'utf8')); } catch (e) {}
  async function get(p) {
    for (let i = 0; i < 3; i++) {
      try {
        const r = await fetchFn(API + p, { headers: { accept: 'application/json;version=20230302' } });
        if (r.status === 429) { await sleep(6000 * (i + 1)); continue; }
        if (!r.ok) throw new Error('http ' + r.status);
        return await r.json();
      } catch (e) { if (i === 2) throw e; await sleep(2000); }
    }
  }
  // 1) seguimiento de los ya apuntados
  const due = {};
  Object.entries(state.pools).forEach(([addr, p]) => {
    HOURS.forEach(h => {
      if (!p.cps[h] && now - p.first >= h * HOUR && now - p.first <= (h + 36) * HOUR) (due[addr] = due[addr] || []).push(h);
      else if (!p.cps[h] && now - p.first > (h + 36) * HOUR) p.cps[h] = { skipped: true }; // se perdió la ventana: no se inventa
    });
  });
  const addrs = Object.keys(due);
  for (let i = 0; i < addrs.length; i += 30) {
    const chunk = addrs.slice(i, i + 30), seen = {};
    try {
      const j = await get('/networks/' + NET + '/pools/multi/' + chunk.join(','));
      ((j && j.data) || []).forEach(d => { const q = parsePool(d); if (q.addr) seen[q.addr] = q; });
      chunk.forEach(addr => {
        const q = seen[addr];
        due[addr].forEach(h => { state.pools[addr].cps[h] = q ? { price: q.price, liq: q.liq, v24: q.v24, t: now } : { missing: true, t: now }; });
      });
    } catch (e) { console.error('seguimiento', e.message); }
    await sleep(2500);
  }
  // 2) pools nuevos
  let added = 0;
  for (let page = 1; page <= 3 && added < MAX_NEW; page++) {
    try {
      const j = await get('/networks/' + NET + '/new_pools?page=' + page);
      for (const d of ((j && j.data) || [])) {
        const q = parsePool(d);
        if (!q.addr || state.pools[q.addr] || !(q.price > 0) || !(q.liq >= MIN_LIQ) || added >= MAX_NEW) continue;
        state.pools[q.addr] = { name: q.name, first: now, created: q.created, p0: q.price, l0: q.liq, f0: q.fdv, cps: {} };
        added++;
      }
    } catch (e) { console.error('nuevos', e.message); }
    await sleep(2500);
  }
  // 3) limpiar lo muy viejo y guardar
  Object.keys(state.pools).forEach(a => { if (now - state.pools[a].first > 40 * 24 * HOUR) delete state.pools[a]; });
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(statePath, JSON.stringify(state));
  const sum = summarize(state, now);
  fs.writeFileSync(path.join(dir, 'summary.json'), JSON.stringify(sum, null, 1));
  return { added, followed: addrs.length, summary: sum };
}

if (process.argv[1] && process.argv[1].endsWith('collect.mjs')) {
  run().then(r => console.log('nuevos', r.added, '· seguidos', r.followed, '· total', r.summary.tracked)).catch(e => { console.error(e); process.exit(1); });
}
