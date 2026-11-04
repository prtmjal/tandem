// Usage counts: daily totals only, so the founder can see whether the game works (do partners join? do nights
// finish?). No cookies, no IDs, no IP addresses, no room codes, and nothing about levels, votes or cards.
// Kept in memory; set STATS_FILE (e.g. on a Railway volume) to survive restarts. Read them at /stats with STATS_TOKEN.
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

export const EVENTS = {
  landing: 'Landing page visits',
  play: 'Game page opens',
  created: 'Games started (rooms created)',
  joined: 'Partners joined',
  joinedLink: '… of which by invite link or QR',
  nights: 'Nights started',
  nightsApart: '… of which apart, on a call',
  finished: 'Nights finished',
  shared: 'Share cards made (both said yes)',
  checkout: 'Couple Pass checkouts opened',
  purchased: 'Couple Pass purchases confirmed',
  newsSignup: 'Email list sign-ups',
} as const;
export type StatEvent = keyof typeof EVENTS;

type Days = Record<string, Partial<Record<StatEvent, number>>>;
const KEEP_DAYS = 120;

export class Stats {
  days: Days = {};
  private dirty = false;
  constructor(private file?: string, private now: () => Date = () => new Date()) {
    if (file && existsSync(file)) {
      try { const d = JSON.parse(readFileSync(file, 'utf8')); if (d && typeof d === 'object') this.days = d; } catch { /* start fresh */ }
    }
  }
  private today() { return this.now().toISOString().slice(0, 10); }

  count(e: StatEvent, n = 1) {
    if (!(e in EVENTS)) return;
    const d = (this.days[this.today()] ||= {});
    d[e] = (d[e] || 0) + n;
    this.dirty = true;
  }

  /** Drops days older than KEEP_DAYS. */
  prune() {
    const cutoff = new Date(this.now().getTime() - KEEP_DAYS * 86400_000).toISOString().slice(0, 10);
    for (const k of Object.keys(this.days)) if (k < cutoff) delete this.days[k];
  }

  /** Totals for the last `n` days, newest first, plus the sum and the two funnel ratios that matter most. */
  report(n = 30) {
    this.prune();
    const keys = Object.keys(this.days).sort().reverse().slice(0, n);
    const total: Partial<Record<StatEvent, number>> = {};
    for (const k of keys) for (const [e, v] of Object.entries(this.days[k])) total[e as StatEvent] = (total[e as StatEvent] || 0) + (v || 0);
    const pct = (a?: number, b?: number) => (a && b ? Math.round((a / b) * 100) : null);
    return {
      labels: EVENTS,
      days: keys.map(k => ({ day: k, ...this.days[k] })),
      total,
      funnel: {
        /** Of games started, how many got a partner: the real conversion. */
        partnerJoinRate: pct(total.joined, total.created),
        /** Of nights started, how many reached the end. */
        nightFinishRate: pct(total.finished, total.nights),
      },
    };
  }

  /** Writes to STATS_FILE if anything changed (atomic rename, so a crash never leaves half a file). */
  save() {
    if (!this.file || !this.dirty) return;
    try {
      mkdirSync(dirname(this.file), { recursive: true });
      writeFileSync(this.file + '.tmp', JSON.stringify(this.days));
      renameSync(this.file + '.tmp', this.file);
      this.dirty = false;
    } catch { /* keep counting in memory */ }
  }

  /** One line per day for the server log, so totals survive in host logs even without a volume. */
  logLine(day = this.today()) { return `[stats] ${day} ${JSON.stringify(this.days[day] || {})}`; }
}

/** A tiny private page: asks for the token (kept only for this browser tab), then shows the totals. */
export const STATS_PAGE = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>Usage counts</title>
<style>
:root{--bg:#FAF2EC;--ink:#281C1B;--muted:#695959;--line:#E6D6CF;--card:#FEF9F6;--accent:#9D3D59}
@media (prefers-color-scheme:dark){:root{--bg:#130D12;--ink:#F2EEE9;--muted:#B2A9A2;--line:#33282F;--card:#1E161D;--accent:#F7ACBC}}
body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.5 system-ui,sans-serif}
main{max-width:960px;margin:0 auto;padding:20px 16px 48px}h1{font-size:1.6rem;margin:0 0 4px}p{color:var(--muted);margin:0 0 16px}
.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;margin:16px 0}
.kpi{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:14px 16px}.kpi b{display:block;font-size:2rem;line-height:1.1}
.kpi span{color:var(--muted);font-size:.9rem}.wrap{overflow-x:auto;border:1px solid var(--line);border-radius:16px;background:var(--card)}
table{border-collapse:collapse;width:100%;font-variant-numeric:tabular-nums;font-size:.9rem}th,td{padding:8px 10px;border-bottom:1px solid var(--line);text-align:right;white-space:nowrap}
th:first-child,td:first-child{text-align:left;position:sticky;left:0;background:var(--card)}thead th{color:var(--muted);font-weight:600}
form{display:flex;gap:8px;flex-wrap:wrap}input{font:inherit;padding:10px 12px;border-radius:12px;border:1px solid var(--line);background:var(--card);color:var(--ink);min-width:0;flex:1}
button{font:inherit;font-weight:700;padding:10px 16px;border-radius:12px;border:0;background:var(--accent);color:var(--bg)}
</style></head><body><main>
<h1>Usage counts</h1><p>Daily totals only: no cookies, IDs or anything about what couples chose.</p>
<form id="f"><input id="t" type="password" placeholder="Stats token" autocomplete="off" aria-label="Stats token"><button>Show</button></form>
<div id="out"></div>
<script>
const out=document.getElementById('out'),t=document.getElementById('t');
try{t.value=sessionStorage.getItem('statsToken')||''}catch(e){}
async function load(){
  const r=await fetch('/api/stats?days=30',{headers:{Authorization:'Bearer '+t.value}});
  if(!r.ok){out.innerHTML='<p>'+(r.status===401?'Wrong token.':'Could not load.')+'</p>';return}
  try{sessionStorage.setItem('statsToken',t.value)}catch(e){}
  const d=await r.json(),L=d.labels,T=d.total,F=d.funnel,keys=Object.keys(L);
  const k=(v,l)=>'<div class="kpi"><b>'+(v==null?'–':v)+'</b><span>'+l+'</span></div>';
  let h='<div class="kpis">'+k(T.created||0,'Games started, last 30 days')+k(F.partnerJoinRate==null?null:F.partnerJoinRate+'%','Partner joined')+k(T.nights||0,'Nights started')+k(F.nightFinishRate==null?null:F.nightFinishRate+'%','Nights finished')+'</div>';
  h+='<div class="wrap"><table><thead><tr><th>Day</th>'+keys.map(x=>'<th title="'+L[x]+'">'+L[x].replace('… of which ','↳ ')+'</th>').join('')+'</tr></thead><tbody>';
  h+='<tr><td><b>Total</b></td>'+keys.map(x=>'<td><b>'+(T[x]||0)+'</b></td>').join('')+'</tr>';
  for(const row of d.days)h+='<tr><td>'+row.day+'</td>'+keys.map(x=>'<td>'+(row[x]||0)+'</td>').join('')+'</tr>';
  out.innerHTML=h+'</tbody></table></div>';
}
document.getElementById('f').addEventListener('submit',e=>{e.preventDefault();load()});
if(t.value)load();
</script></main></body></html>`;
