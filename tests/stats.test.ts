import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { EVENTS, Stats } from '../server/stats';

describe('usage counts', () => {
  it('counts daily totals and works out the two funnel rates', () => {
    let day = new Date('2026-11-01T10:00:00Z');
    const s = new Stats(undefined, () => day);
    s.count('created'); s.count('created'); s.count('joined');
    s.count('nights'); s.count('finished');
    day = new Date('2026-11-02T09:00:00Z');
    s.count('created'); s.count('joined'); s.count('nights');
    const r = s.report();
    expect(r.days.map(d => d.day)).toEqual(['2026-11-02', '2026-11-01']);
    expect(r.total.created).toBe(3);
    expect(r.funnel.partnerJoinRate).toBe(67);
    expect(r.funnel.nightFinishRate).toBe(50);
  });
  it('ignores unknown events and keeps only totals, never anything about a person or a night', () => {
    const s = new Stats();
    s.count('level7' as never); s.count('created');
    const r = s.report();
    expect(Object.keys(r.total)).toEqual(['created']);
    for (const day of r.days) for (const k of Object.keys(day)) expect(k === 'day' || k in EVENTS).toBe(true);
    expect(Object.keys(EVENTS).join(' ')).not.toMatch(/level|vote|card|curious|ceiling|ip|name|code/i);
  });
  it('forgets days older than 120 days', () => {
    let day = new Date('2026-01-01T00:00:00Z');
    const s = new Stats(undefined, () => day);
    s.count('landing');
    day = new Date('2026-06-01T00:00:00Z');
    s.count('landing');
    expect(s.report(365).days.map(d => d.day)).toEqual(['2026-06-01']);
  });
  it('survives a restart when STATS_FILE is set', () => {
    const file = join(mkdtempSync(join(tmpdir(), 'stats-')), 'sub', 'stats.json');
    const a = new Stats(file); a.count('created'); a.count('joined'); a.save();
    expect(JSON.parse(readFileSync(file, 'utf8'))).toBeTruthy();
    const b = new Stats(file);
    expect(b.report().total).toEqual({ created: 1, joined: 1 });
  });
});
