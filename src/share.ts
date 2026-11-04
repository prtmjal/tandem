// Share cards: a story-sized image (1080x1920) drawn on the phone. It shows only a Level 1-3 question you played
// tonight and how many nights you've played. No names, no levels, nothing private. Nothing is uploaded.
import { VIBES } from '../shared/theme';
import type { VibeId } from '../shared/protocol';

const W = 1080, H = 1920;
const DISPLAY = '"Bricolage Grotesque Variable", "Bricolage Grotesque", system-ui, sans-serif';
const BODY = '"Figtree Variable", Figtree, system-ui, sans-serif';

function wrap(ctx: CanvasRenderingContext2D, text: string, max: number) {
  const lines: string[] = []; let line = '';
  for (const w of text.split(/\s+/)) {
    const t = line ? line + ' ' + w : w;
    if (ctx.measureText(t).width > max && line) { lines.push(line); line = w; } else line = t;
  }
  if (line) lines.push(line);
  return lines;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}

export async function drawShareCard(o: { question: string; nights: number; vibes: [VibeId, VibeId]; host: string }): Promise<Blob> {
  try { await Promise.all([document.fonts.load(`700 64px ${DISPLAY}`), document.fonts.load(`600 32px ${BODY}`)]); } catch { /* fall back to system fonts */ }
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const ctx = cv.getContext('2d')!;
  const [a, b] = o.vibes.map(v => VIBES[v]);

  // Background: the two partners' colours, blended. This is the "blend" brand mark.
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, a.chip.light[0]); g.addColorStop(1, b.chip.light[0] === a.chip.light[0] ? a.chip.light[1] : b.chip.light[0]);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // Soft glows and paper grain so it reads as an object, not a flat screenshot.
  for (const [x, y, r] of [[200, 300, 520], [900, 1600, 640]]) {
    const rg = ctx.createRadialGradient(x, y, 0, x, y, r); rg.addColorStop(0, 'rgba(255,255,255,.22)'); rg.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H);
  }
  const img = ctx.getImageData(0, 0, W, H);
  for (let i = 0; i < img.data.length; i += 4) { const n = (Math.random() - 0.5) * 18; img.data[i] += n; img.data[i + 1] += n; img.data[i + 2] += n; }
  ctx.putImageData(img, 0, 0);

  // Both partners' glyphs, top centre.
  ctx.fillStyle = 'rgba(254,249,246,.95)'; ctx.font = `600 64px ${BODY}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(`${a.glyph}  ${b.glyph}`, W / 2, 230);

  // The card.
  const cx = 110, cy = 380, cw = W - 220, ch = 1080;
  ctx.save(); ctx.shadowColor = 'rgba(30,10,20,.35)'; ctx.shadowBlur = 80; ctx.shadowOffsetY = 30;
  roundRect(ctx, cx, cy, cw, ch, 56); ctx.fillStyle = '#FAF2EC'; ctx.fill(); ctx.restore();
  ctx.save(); ctx.translate(cx, cy);
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.fillStyle = '#695959';
  ctx.font = `700 30px ${BODY}`; ctx.fillText('OUR QUESTION TONIGHT', 80, 130);
  ctx.fillStyle = '#281C1B'; ctx.font = `650 76px ${DISPLAY}`;
  let size = 76, lines = wrap(ctx, o.question, cw - 160);
  while (lines.length > 7 && size > 52) { size -= 6; ctx.font = `650 ${size}px ${DISPLAY}`; lines = wrap(ctx, o.question, cw - 160); }
  const lh = size * 1.22, top = 260 + Math.max(0, (7 - lines.length) * lh * 0.5);
  lines.forEach((l, i) => ctx.fillText(l, 80, top + i * lh));
  ctx.fillStyle = '#695959'; ctx.font = `600 34px ${BODY}`;
  ctx.fillText(o.nights === 1 ? 'Our first night of Tandem' : `Night ${o.nights} of Tandem, together`, 80, ch - 90);
  ctx.restore();

  // Footer: what it is and where to find it.
  ctx.fillStyle = '#FEF9F6'; ctx.textAlign = 'center';
  ctx.font = `750 64px ${DISPLAY}`; ctx.fillText('Tandem', W / 2, 1620);
  ctx.font = `500 36px ${BODY}`; ctx.fillText('The question game you play on two phones', W / 2, 1690);
  ctx.font = `600 32px ${BODY}`; ctx.globalAlpha = 0.85; ctx.fillText(o.host, W / 2, 1760); ctx.globalAlpha = 1;

  return new Promise((res, rej) => cv.toBlob(bl => (bl ? res(bl) : rej(new Error('Could not make the image'))), 'image/png'));
}

/** Opens the phone's share sheet with the image, or downloads it where sharing files isn't supported. */
export async function shareImage(blob: Blob) {
  const file = new File([blob], 'tandem-tonight.png', { type: 'image/png' });
  const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
  if (nav.canShare?.({ files: [file] })) {
    try { await nav.share({ files: [file], text: 'The question game you play on two phones', url: location.origin }); return 'shared'; }
    catch (e) { if ((e as Error).name === 'AbortError') return 'cancelled'; }
  }
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = file.name;
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  return 'saved';
}
