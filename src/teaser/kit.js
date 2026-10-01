// kit.js: shared timing, palette, characters, sets and effects for the 《如果你来过》 teaser (src/teaser/*.js).
//
// Two kinds of picture (see TEASER_STORYBOARD.md): real life is dark and still; imagination is painted while we
// watch, with loose bare-paper edges (dreamEdge). He is only life-size inside imagination paint.
//
// Note: p5.brush mangles ink strokes past about x 2800, and curved shapes (paint with curv) past about x 2800 or
// y 1450, even when a camera brings them on screen. Keep those inside x < 2700 and y < 1400; straight shapes are fine.

// ---------- timing: 132 BPM played as a 66 BPM ballad ----------
const HB = 2 * BEAT;                                   // half-time beat, 0.909 s: the pulse everything breathes on
const BARL = 8 * BEAT;                                 // one bar, 3.636 s
const barT = n => OFF + n * BARL;                      // bar n starts here (bar 0 = 1.82 s, bar 5 = 20.0 s ...)
const hbT = n => OFF + n * HB;                         // half-time beat n
const hpulse = (t, k = 5) => Math.exp(-frac((t - OFF) / HB) * k);   // 1 on each half-time beat, decays

// ---------- palette ----------
const TP = {
  night: '#1A1F48', wall: '#262E63', wallDk: '#1C2250', floor: '#2B2648', floorDk: '#1E1A36',
  screen: '#2B8A8C', screenDk: '#173E52', glow: '#9BE7DD', lamp: '#F3C66E', warm: '#F6D9A6',
  sweater: '#B9A6D9', pants: '#463C64', sheet: '#C9D3EA', blanket: '#6E7FB8',
  rose: '#E27A92', coral: '#F08A6B', sun: '#F9C25A', sea: '#4F86BE', seaDk: '#30588E', sand: '#EBCB98',
  fwNight: '#2A2360', gold: '#F2C04A', grey: '#8E90A8', greyDk: '#5F617B', street: '#2D3463'
};
const BF = px => `${px}px "Ma Shan Zheng Local", "Ma Shan Zheng", serif`;   // brush lettering for Chinese text

// ---------- characters ----------
// Her: the Researcher with long hair, a lavender sweater, lashes and rosy cheeks.
function her(x, y, s, o = {}) {
  researcher(x, y, s, { hair: 'long', top: 'sweater', sweater: TP.sweater, pants: TP.pants, lashes: true, blush: true, ...o });
}
// Him: Clawd, plus washK (0..1: patches wash away to bare paper, with drips) and ghost (0..1: see-through like wet paint).
function him(x, y, u, o = {}) {
  clawd(x, y, u, o);
  const by = y + (o.dy || 0) * u;
  if (o.ghost > .01) paint(rectPts(x - 5.4 * u, by - 8.4 * u, 10.8 * u, 8.8 * u, u * .3), { fill: o.ghostCol || PAL.cream, fillOp: 230 * o.ghost, bleed: .25, tex: .4, border: .2, ink: null });
  if (o.washK > .01) washHoles(x, by, u, o.washK, o.seed || 0, o.dripCol || PAL.clay);
}
// Bare-paper patches eating into a painted body (x, y = ground point, body 10u x 6u above y - 2u), plus paint drips.
function washHoles(x, y, u, k, seed = 0, dripCol = PAL.clay) {
  for (let i = 0; i < 9; i++) {
    const h1 = hash(i * 7.3 + seed), h2 = hash(i * 3.1 + seed + 9), h3 = hash(i * 5.7 + seed + 4);
    const r = u * (.9 + 1.7 * h3) * clamp(k * 1.7 - h1 * .7);
    if (r < u * .15) continue;
    const cx = x + (h1 - .5) * 9 * u, cy = y - 2.8 * u - h2 * 5 * u;
    const pts = ellPts(cx, cy, r, r * (.75 + .3 * h2), 16, r * .18, h1 * 3);
    paint(pts, { wash: PAL.paper, washOp: 255, fill: PAL.paper, fillOp: 160, bleed: .25, tex: .6, border: .6, ink: null });
    inkLine(pts.slice(0, 9), .5, mixCol(PAL.ink, PAL.paper, .55), 'HB', .5);
    // a drip running down from the bottom of the patch
    const dl = r * (1 + 2.5 * k) * h2;
    if (dl > u * .3) paint([[cx - r * .18, cy + r * .7], [cx + r * .18, cy + r * .7], [cx + r * .1, cy + r * .7 + dl], [cx, cy + r * .78 + dl + r * .15], [cx - r * .1, cy + r * .7 + dl]],
      { wash: dripCol, washOp: 200, ink: null, curv: .5 });
  }
}

// ---------- full-frame looks ----------
// Imagination is a sketchbook page painted while we watch: ragged bare paper around the edges and a few pencil
// construction lines. k = 0 none .. 1 full border. Call in screen space (outside camBegin).
function dreamEdge(k, seed = 0, t = T) {
  if (k < .01) return;
  const n = 46, pts = [], inset = lerp(-40, 64, k);
  for (let i = 0; i < n; i++) {
    const a = i / n * TAU, c = Math.cos(a), s = Math.sin(a);
    // a superellipse so the page edge hugs the frame corners
    const ex = Math.sign(c) * Math.pow(Math.abs(c), .32), ey = Math.sign(s) * Math.pow(Math.abs(s), .32);
    const rag = (hash(i * 3.3 + seed) - .5) * 70 * k + Math.sin(i * 1.7 + seed) * 18 * k;
    pts.push([W / 2 + ex * (W / 2 - inset + rag), H / 2 + ey * (H / 2 - inset + rag * .8)]);
  }
  irisShape(pts, PAL.paper);
  for (let i = 0; i < n; i += 2) {
    const [px, py] = pts[i], r = (26 + 40 * hash(i + seed)) * k;
    paint(ellPts(px, py, r, r * .8, 12, 6), { fill: PAL.paper, fillOp: 200, bleed: .35, tex: .5, border: .5, ink: null });
  }
  // pencil construction lines that overshoot the corners
  const c = mixCol(PAL.ink, PAL.paper, .6), m = inset + 30;
  for (const [a, b] of [[[m - 90, m + 6], [W * .42, m - 4]], [[W - m + 70, H - m - 8], [W * .55, H - m + 6]], [[m + 4, H - m + 60], [m - 6, H * .6]], [[W - m - 2, m - 70], [W - m + 8, H * .35]]])
    inkLine([a, b], .6 * k, c, 'HB', 0);
}
// Warm light pool (lamps, sunsets, his glow) and cold screen light.
function glow(x, y, rx, ry, col, op = 80) { paint(ellPts(x, y, rx, ry, 24, rx * .05), { fill: col, fillOp: op, bleed: .3, tex: .3, border: .15, ink: null }); }
// Rain streaks inside a box. Pure function of t: each drop falls through the box and wraps.
function rainIn(t, x0, y0, w, h, n, col, o = {}) {
  const len = o.len || 46, sp = o.speed || 1500, ang = o.ang ?? .12, sw = o.sw || .55;
  for (let i = 0; i < n; i++) {
    const fx = hash(i * 1.37 + (o.seed || 0)), fy = frac(hash(i * 2.11 + 5) + t * sp / h * (.8 + .4 * hash(i)));
    const x = x0 + fx * w, y = y0 + fy * h;
    inkLine([[x, y], [x - ang * len, y + len]], sw, col, 'inkfine', 0);
  }
}
// Expanding ring on a puddle or a key press.
function ripple(x, y, r, k, col, sw = 1) { if (k > 0 && k < 1) inkLine(ellPts(x, y, r * k, r * k * .35, 22).concat([[x + r * k, y]]), sw * (1 - k), col, 'inkfine', .5); }

// ---------- her apartment (world coords of the wide shot; cameras frame parts of it) ----------
// Back wall to y 760, floor below. Window x 250-650; clock at 930; bed on the left; desk on the right.
function roomWall(t, o = {}) {
  const warm = o.warm || 0;
  paint(rectPts(-900, -900, W + 1800, 1660), { wash: mixCol(TP.wall, '#D9A88A', warm * .85), washOp: 255, fill: TP.wallDk, fillOp: 120, bleed: .06, tex: .7, border: .3, ink: null });
  paint([[-900, 760 + jit(2)], [W + 900, 760 + jit(2)], [W + 900, 2000], [-900, 2000]], { wash: mixCol(TP.floor, '#A87562', warm * .8), fill: TP.floorDk, fillOp: 90, bleed: .05, tex: .8, border: .5, ink: PAL.ink, sw: 1.1 });
  for (let i = -6; i <= 12; i++) inkLine([[i * 190, 762], [i * 190 * 1.25 - 120, 1400]], .45, mixCol(TP.floorDk, PAL.ink, .4), 'inkfine', 0);
}
function roomWindow(t, x, y, w, h, o = {}) {
  paint(rectPts(x - 18, y - 18, w + 36, h + 36, 3), { wash: '#3B3F70', ink: PAL.ink, sw: 1.2 });
  paint(rectPts(x, y, w, h, 2), { wash: TP.night, fill: PAL.indigo, fillOp: 120, tex: .6, ink: null });
  // a few lit windows across the street, blurred by the rain
  for (let i = 0; i < 9; i++) {
    const bx = x + 20 + hash(i + 40) * (w - 60), by = y + h * .35 + hash(i + 50) * h * .55, c = [TP.lamp, TP.glow, '#E9A15B'][i % 3];
    paint(rectPts(bx, by, 16 + hash(i) * 12, 20, 2), { wash: c, washOp: 150, ink: null });
    glow(bx + 12, by + 10, 30, 26, c, 40);
  }
  paint([[x, y + h * .78], [x + w * .2, y + h * .62], [x + w * .45, y + h * .7], [x + w * .7, y + h * .55], [x + w, y + h * .66], [x + w, y + h], [x, y + h]], { wash: '#141836', washOp: 200, ink: null });
  if (o.rain !== false) rainIn(t, x, y, w, h, o.drops || 34, mixCol(TP.glow, TP.night, .35), { len: 30, speed: 620, ang: .06, sw: .5 });
  inkLine([[x + w / 2, y], [x + w / 2, y + h]], 1.4, PAL.ink, 'ink', 0);
  inkLine([[x, y + h / 2], [x + w, y + h / 2]], 1.4, PAL.ink, 'ink', 0);
  paint(rectPts(x - 30, y + h + 6, w + 60, 22, 2), { wash: '#4A4878', ink: PAL.ink, sw: 1 });
}
function roomClock(t, x, y, r, hour = 3) {
  paint(ellPts(x, y, r, r, 24, 1), { wash: '#C8C3D8', fill: TP.wall, fillOp: 80, ink: PAL.ink, sw: 1.1 });
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; inkLine([[x + Math.cos(a) * r * .78, y + Math.sin(a) * r * .78], [x + Math.cos(a) * r * .88, y + Math.sin(a) * r * .88]], .5, PAL.ink, 'inkfine', 0); }
  const ha = (hour / 12) * TAU - Math.PI / 2, ma = (frac(t / 60) + .02) * TAU - Math.PI / 2;
  inkLine([[x, y], [x + Math.cos(ha) * r * .5, y + Math.sin(ha) * r * .5]], 1.1, PAL.ink, 'ink', 0);
  inkLine([[x, y], [x + Math.cos(ma) * r * .75, y + Math.sin(ma) * r * .75]], .8, PAL.ink, 'ink', 0);
}
// Bed seen from the front-side: frame, mattress, pillow; the blanket is drawn separately (over her).
function roomBed(x, y, w) {
  paint(rectPts(x - 30, y - 210, 40, 250, 3), { wash: '#5A4A6E', ink: PAL.ink, sw: 1.1 });               // headboard post
  paint(rrPts(x - 30, y - 230, 120, 60, 26, 2), { wash: '#5A4A6E', ink: PAL.ink, sw: 1.1 });
  paint(rectPts(x, y - 70, w, 70, 3), { wash: TP.sheet, fill: TP.blanket, fillOp: 60, tex: .6, ink: PAL.ink, sw: 1.1 });
  paint(rectPts(x - 10, y, w + 20, 34, 3), { wash: '#4A3D5E', ink: PAL.ink, sw: 1.1 });
  for (const lx of [x + 10, x + w - 34]) paint(rectPts(lx, y + 34, 24, 50, 2), { wash: '#3A2F4C', ink: PAL.ink, sw: .9 });
}
function pillow(x, y, w, h) { paint(rrPts(x, y, w, h, h * .45, 3), { wash: '#E6E9F5', fill: TP.sheet, fillOp: 90, tex: .5, ink: PAL.ink, sw: 1 }); }
// Blanket: a soft lump from x0 to x1 whose top runs along `top(x)`.
function blanket(x0, x1, y, top, col = TP.blanket) {
  const pts = []; for (let i = 0; i <= 14; i++) { const x = lerp(x0, x1, i / 14); pts.push([x, top(x)]); }
  pts.push([x1 + 14, y + 20], [x0 - 14, y + 20]);
  paint(pts, { wash: col, fill: PAL.indigo, fillOp: 70, bleed: .05, tex: .7, border: .5, ink: PAL.ink, sw: 1.2, curv: .5 });
  for (let i = 1; i < 4; i++) inkLine([[lerp(x0, x1, i / 4) - 20, top(lerp(x0, x1, i / 4)) + 30], [lerp(x0, x1, i / 4) + 10, y - 10]], .45, mixCol(col, PAL.ink, .4), 'inkfine', .4);
}
function nightstand(x, y) {
  paint(rectPts(x, y - 130, 150, 130, 3), { wash: '#4E3F62', fill: PAL.ink, fillOp: 30, tex: .6, ink: PAL.ink, sw: 1.1 });
  inkLine([[x + 10, y - 66], [x + 140, y - 66]], .6, PAL.ink, 'inkfine', 0);
  paint(ellPts(x + 75, y - 98, 8, 5, 8), { wash: TP.gold, ink: null });
}

// ---------- the laptop: the door between the two worlds ----------
// laptop(x, y, s, o): (x, y) = front-centre of the keyboard deck on the table; s = scale (1 = 420 px wide screen).
// o.open 0..1 lid angle, o.facing 'us' (screen visible) or 'away' (lid back + sticker), o.bright 0..1 screen light,
// o.screen(sx, sy, sw, sh): world-space screen rect painter (call kit painters from it; letters in world coords).
function laptop(x, y, s, o = {}) {
  const sw = 420 * s, sh = 270 * s, open = o.open ?? 1, bright = o.bright ?? 1;
  const deck = [[x - sw * .56, y], [x + sw * .56, y], [x + sw * .5, y - 26 * s], [x - sw * .5, y - 26 * s]];
  const lidH = sh * open, top = y - 26 * s - lidH;
  if (o.facing === 'away') {
    paint(deck, { wash: '#8C8FA8', ink: PAL.ink, sw: 1.1 * s + .3 });
    if (open > .02) {
      paint(rrPts(x - sw / 2, top, sw, lidH, 14 * s, 1), { wash: '#A3A6BE', fill: '#6E718C', fillOp: 70, tex: .6, ink: PAL.ink, sw: 1.2 * s + .3 });
      if (open > .4 && !o.noSticker) clawd(x, top + lidH * .62, 5.2 * s, { noShadow: true, noLegs: false, eyes: 'normal', swMul: .7 });   // a little Clawd sticker
      if (bright > .02) glow(x, top - 40 * s, sw * .75, 120 * s, TP.glow, 60 * bright);    // light spilling over the top edge
    }
    return { sx: x - sw / 2, sy: top, sw, sh: lidH };
  }
  paint(deck, { wash: '#9A9CB6', fill: '#6E718C', fillOp: 50, ink: PAL.ink, sw: 1.1 * s + .3 });
  for (let r = 0; r < 3; r++) inkLine([[x - sw * .4, y - 7 * s - r * 6 * s], [x + sw * .4, y - 7 * s - r * 6 * s]], .4, '#5D6079', 'inkfine', 0);
  if (open < .02) return { sx: x - sw / 2, sy: y - 26 * s, sw, sh: 0 };
  paint(rrPts(x - sw / 2, top, sw, lidH, 14 * s, 1), { wash: '#3E4160', ink: PAL.ink, sw: 1.2 * s + .3 });
  const ix = x - sw / 2 + 14 * s, iy = top + 14 * s, iw = sw - 28 * s, ih = lidH - 26 * s;
  if (ih > 4) {
    paint(rectPts(ix, iy, iw, ih, 1), { wash: mixCol('#0E1530', TP.screenDk, bright), ink: null });
    if (o.screen && bright > .01) o.screen(ix, iy, iw, ih);
    if (bright < 1) paint(rectPts(ix, iy, iw, ih, 1), { wash: '#0B0F22', washOp: 255 * (1 - bright) * .92, ink: null });
  }
  return { sx: ix, sy: iy, sw: iw, sh: ih };
}
// The chat app on the laptop screen: a header, message bubbles, a text box with a blinking cursor.
// msgs = [{ me: true/false, txt, k (0..1 appear) }]; typing = text in the box so far (shown with a cursor).
function chatScreen(t, sx, sy, sw, sh, o = {}) {
  paint(rectPts(sx, sy, sw, sh, 1), { wash: TP.screenDk, fill: TP.screen, fillOp: 90, tex: .4, ink: null });
  paint(rectPts(sx, sy, sw, sh * .1, 1), { wash: '#1E5363', ink: null });
  for (let i = 0; i < 3; i++) paint(ellPts(sx + sh * .05 + i * sh * .055, sy + sh * .05, sh * .016, sh * .016, 8), { wash: [TP.rose, TP.gold, PAL.sap][i], ink: null });
  const fs = sh * .062, bx = sx + sw * .05, by = sy + sh * .84, bw = sw * .9, bh = sh * .1;
  paint(rrPts(bx, by, bw, bh, bh * .4, 1), { wash: '#E9F4F1', washOp: 235, ink: PAL.ink, sw: .6 });
  let yy = sy + sh * .18;
  for (const m of o.msgs || []) {
    const k = m.k ?? 1; if (k <= 0) continue;
    const lines = m.lines || [m.txt], lw = Math.max(...lines.map(l => [...l].length)) * fs * 1.02 + fs * 1.2, lh = lines.length * fs * 1.35 + fs * .6;
    const mx = m.me ? sx + sw * .95 - lw : sx + sw * .05;
    const yb = yy + (1 - backOut(k)) * 20;
    paint(rrPts(mx, yb, lw, lh, fs * .6, 1), { wash: m.me ? '#F6E6C8' : '#BFE9E2', washOp: 255 * clamp(k * 2), ink: PAL.ink, sw: .6 });
    lines.forEach((l, i) => letter(l, mx + fs * .6, yb + fs * .95 + i * fs * 1.35, fs, PAL.ink, { font: BF(fs), align: 'left', ink: false, alpha: clamp(k * 2) }));
    yy += lh + fs * .7;
  }
  const typing = o.typing || '';
  if (typing) letter(typing, bx + fs * .6, by + bh / 2 + 1, fs * .95, PAL.ink, { font: BF(fs * .95), align: 'left', ink: false });
  if (o.cursor !== false && frac((t - OFF) / HB) < .55) {
    const cx = bx + fs * .6 + [...typing].length * fs * .95 * 1.0 + 3;
    inkLine([[cx, by + bh * .22], [cx, by + bh * .78]], 1.1, PAL.ink, 'ink', 0);
  }
}

// ---------- imagination props ----------
function umbrella(x, y, r, rot = 0, col = TP.rose, o = {}) {
  push(); translate(x, y); rotate(rot);
  const pts = [];
  for (let i = 0; i <= 16; i++) { const a = Math.PI + i / 16 * Math.PI; pts.push([Math.cos(a) * r, Math.sin(a) * r * .62]); }   // dome, left to right
  for (let i = 1; i < 6; i++) pts.push([r - i * r / 3, i % 2 ? 14 : 3]);                                                        // scalloped hem back
  paint(pts, { wash: col, fill: mixCol(col, PAL.ink, .3), fillOp: 70, tex: .6, ink: PAL.ink, sw: 1.2, curv: .2 });
  for (const k of [-.55, 0, .55]) inkLine([[0, -r * .62], [k * r, 6]], .6, mixCol(col, PAL.ink, .5), 'inkfine', .3);
  if (!o.noHandle) { inkLine([[0, -r * .62 - 18], [0, r * .9]], 2, PAL.ink, 'ink', 0); inkLine([[0, r * .9], [0, r * .9 + 18], [-14, r * .9 + 20]], 2, PAL.ink, 'ink', .6); }
  pop();
}
// One firework: k = age 0..1 (burst, then droop and fade). Painted as ink rays with watercolour sparks.
function firework(x, y, r, k, col, seed = 0) {
  if (k <= 0 || k >= 1) return;
  const e = easeOut(k * 1.6), fade = 1 - seg(k, .55, 1), n = 14;
  glow(x, y, r * e * 1.2, r * e * 1.2, col, 50 * fade);
  for (let i = 0; i < n; i++) {
    const a = i / n * TAU + seed, rr = r * e * (.8 + .3 * hash(i + seed)), droop = k * k * r * .25;
    const x1 = x + Math.cos(a) * rr * .45, y1 = y + Math.sin(a) * rr * .45, x2 = x + Math.cos(a) * rr, y2 = y + Math.sin(a) * rr + droop;
    if (fade > .1) inkLine([[x1, y1], [x2, y2]], 1.2 * fade, col, 'ink', .3);
    paint(ellPts(x2, y2, 7 * fade + 2, 7 * fade + 2, 8), { wash: mixCol(col, PAL.cream, .4), washOp: 255 * fade, ink: null });
  }
}
// A paint drip: a narrow tear of colour from (x, y) running down len px.
function drip(x, y, w, len, col, op = 230) {
  if (len < 2) return;
  paint([[x - w / 2, y], [x + w / 2, y], [x + w * .32, y + len], [x, y + len + w * .7], [x - w * .32, y + len]], { wash: col, washOp: op, ink: null, curv: .6 });
}
// A grey passer-by under a grey umbrella (the world that never sees him). walk = phase.
function passerby(x, y, s, walk, seed = 0, col = TP.grey) {
  const bob = Math.abs(Math.sin(walk * TAU)) * 4 * s;
  paint(rrPts(x - 26 * s, y - 150 * s - bob, 52 * s, 120 * s, 22 * s, 2), { wash: col, washOp: 235, ink: mixCol(col, PAL.ink, .5), sw: .7 });
  paint(ellPts(x, y - 168 * s - bob, 20 * s, 21 * s, 14), { wash: col, washOp: 235, ink: mixCol(col, PAL.ink, .5), sw: .6 });
  for (const sd of [-1, 1]) inkLine([[x + sd * 10 * s, y - 32 * s - bob], [x + sd * 12 * s + Math.sin((walk + (sd > 0 ? .5 : 0)) * TAU) * 12 * s, y]], 3 * s, mixCol(col, PAL.ink, .3), 'ink', 0);
  umbrella(x + 8 * s, y - 200 * s - bob, 64 * s, -.08 + (hash(seed) - .5) * .2, TP.greyDk, { noHandle: true });
}

// A patch of bare paper opening in the dark (imagination starting a page). k = 0..1 size.
function paperPatch(cx, cy, rx, ry, k, seed = 0) {
  if (k < .01) return;
  const pts = []; for (let i = 0; i < 26; i++) { const a = i / 26 * TAU, r = 1 + (hash(i * 2.7 + seed) - .5) * .22 + Math.sin(i * 1.3 + seed) * .06; pts.push([cx + Math.cos(a) * rx * k * r, cy + Math.sin(a) * ry * k * r]); }
  paint(pts, { wash: PAL.paper, washOp: 250, fill: mixCol(PAL.paper, TP.warm, .4), fillOp: 120, bleed: .3, tex: .6, border: .7, ink: null, curv: .5 });
  for (let i = 0; i < 26; i += 3) paint(ellPts(pts[i][0], pts[i][1], 40 * k, 30 * k, 10, 5), { fill: PAL.paper, fillOp: 180, bleed: .4, tex: .5, border: .5, ink: null });
}
// Clawd's silhouette as one path in body units (x right, y up negative): body, then down and around the four legs.
const CLAWD_PATH = [[-5, -8], [5, -8], [5, -2], [4, -2], [4, -.2], [3, -.2], [3, -2], [2, -2], [2, -.2], [1, -.2], [1, -2], [-1, -2], [-1, -.2], [-2, -.2], [-2, -2],
  [-3, -2], [-3, -.2], [-4, -.2], [-4, -2], [-5, -2], [-5, -8]];
// The first fraction u of a polyline (by length).
function partialPath(p, u) {
  const d = []; let L = 0;
  for (let i = 1; i < p.length; i++) { d.push(Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1])); L += d[i - 1]; }
  let s = clamp(u) * L; const out = [p[0]];
  for (let i = 1; i < p.length; i++) {
    if (s >= d[i - 1]) { out.push(p[i]); s -= d[i - 1]; }
    else { const f = s / d[i - 1]; out.push([lerp(p[i - 1][0], p[i][0], f), lerp(p[i - 1][1], p[i][1], f)]); break; }
  }
  return out;
}
// Clawd being painted in: ink outline drawn to `line` (0..1), arms appear with the outline, washes bloom to `fill` (0..1).
// At fill = 1 it matches clawd(x, y, u, { eyes: 'none' }) exactly, so a shot can swap to the real thing.
function clawdSketch(x, y, u, line, fill, seed = 0) {
  const P = CLAWD_PATH.map(([a, b]) => [x + a * u, y + b * u]);
  if (fill > .01) {
    const body = rectPts(x - 5 * u, y - 8 * u, 10 * u, 6 * u, u * .07);
    for (let i = 0; i < 7; i++) {
      const k = clamp(fill * 1.6 - hash(i + seed) * .6), bx = x + (hash(i * 3 + seed) - .5) * 7 * u, byy = y - 5 * u + (hash(i * 5 + seed) - .5) * 4 * u;
      if (k > .01) paint(ellPts(bx, byy, 2.6 * u * k, 2.2 * u * k, 16, u * .3), { fill: PAL.clay, fillOp: 170, bleed: .3, tex: .7, border: .7, ink: null });
    }
    if (fill > .55) paint(body, { wash: PAL.clay, washOp: 255 * ease(seg(fill, .55, 1)), ink: null });
    for (const lx of [-4, -2, 1, 3]) if (fill > .3) paint(rectPts(x + lx * u, y - 2.4 * u, u, 2.2 * u, u * .04), { wash: PAL.clayDk, washOp: 255 * seg(fill, .3, .8), ink: null });
  }
  if (fill > .6) for (const sd of [-1, 1]) {
    const ax = x + sd * 4.9 * u, ay = y - 4.5 * u;
    paint([[ax, ay - .5 * u], [ax + sd * 2.2 * u, ay - .9 * u], [ax + sd * 2.3 * u, ay + .1 * u], [ax, ay + .5 * u]], { wash: PAL.clay, washOp: 255 * seg(fill, .6, 1), ink: null });
  }
  if (line > .01) inkLine(partialPath(P, line), clamp(u / 15, .45, 2.4) * 1.05, PAL.ink, 'ink', 0);
  if (line > .85) for (const sd of [-1, 1]) {
    const k = seg(line, .85, 1), ax = x + sd * 4.9 * u, ay = y - 4.5 * u;
    inkLine([[ax, ay - .5 * u], [ax + sd * 2.2 * u * k, ay - .5 * u - .4 * u * k], [ax + sd * 2.3 * u * k, ay + .5 * u - .4 * u * k], [ax, ay + .5 * u]], clamp(u / 15, .45, 2.4) * .85, PAL.ink, 'ink', 0);
  }
}

// ---------- the bedroom wide shot (chapters 0, 1, 5) ----------
// Her bedroom: the window, the clock and the bed she can't sleep in. World = the wide shot.
function bedroomSet(t, o = {}) {
  roomWall(t, o);
  roomWindow(t, 470, 120, 380, 410);
  roomClock(t, 1060, 230, 46, 3);
  // moonlight from the window across the bed and floor
  paint([[470, 530], [850, 530], [1010, 960], [520, 960]], { fill: mixCol(TP.glow, PAL.cream, .5), fillOp: 34, bleed: .15, tex: .3, border: .1, ink: null });
  roomBed(180, 720, 900);
  pillow(200, 596, 170, 58);
}

// Lying θ = -π/2 (head to the left) .. sitting θ ≈ 0, pivoting on the hip so she sits up in place.
function herInBed(hip, s, th, o) {
  const d = 2.3 * s, fx = hip[0] - d * Math.sin(th), fy = hip[1] + d * Math.cos(th);
  her(fx, fy, s, { rot: th, noShadow: true, ...o });
}

