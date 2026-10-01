// t1_writing: 1 · Writing you (6.1–18.6). Her keystrokes fly off the screen as ink and draw him on a page of bare
// paper that opens in the dark; his voice splashes colour into him; one light tap of Enter; his eyes open.
(() => {
  const CT = LY[0][4];                                  // the sung characters of 那天我写下你的名字: one keystroke each
  const GX = 2180, GY = 1250, GU = 54;                  // where he forms in the over-the-shoulder world
  const DOTS = [0, 1, 2, 4, 8, 9, 13, 17, 19];          // which corners of his outline each droplet lands on
  const BX = 1430, BY = 905, BU = 27;                   // where he stands in the bedroom wide shot
  const SRC = [742, 712];                               // the reply box on the laptop screen (over-the-shoulder world)

  // outline progress and wash progress, shared by the shots so the drawing carries across the cuts
  const lineK = t => ease(seg(t, 8.2, 10.4));
  const noteT = i => 9.45 + i * .36;                    // a note leaves the laptop every 0.36 s
  const fillK = t => { let f = 0; for (let i = 0; i < 6; i++) f += seg(t, noteT(i) + .5, noteT(i) + .95) / 6; return f; };

  // ---------- A · over her shoulder, pulling back: she types his name; each keystroke flicks a drop of ink ----------
  function replyScreen(t, sx, sy, sw, sh) {
    paint(rectPts(sx, sy, sw, sh, 1), { wash: TP.screenDk, fill: TP.screen, fillOp: 70, tex: .4, ink: null });
    const fs = sh * .075, bw = sw * .78, bx = sx + sw * .96 - bw, by = sy + sh * .12;
    paint(rrPts(bx, by, bw, fs * 3.2, fs * .7, 1), { wash: '#F6E6C8', ink: PAL.ink, sw: .8 });
    letter('如果有一个人，是我最想遇见的样子', bx + fs * .6, by + fs * 1.05, fs * .9, PAL.ink, { font: BF(fs * .9), align: 'left', ink: false });
    letter('……他会是什么样？', bx + fs * .6, by + fs * 2.2, fs * .9, PAL.ink, { font: BF(fs * .9), align: 'left', ink: false });
    const rb = sy + sh * .7;
    paint(rrPts(sx + sw * .06, rb, sw * .88, sh * .14, sh * .05, 1), { wash: '#EAF5F2', washOp: 235, ink: PAL.ink, sw: .7 });
    // his name, typed as an ink squiggle that grows a loop with every key
    const n = CT.filter(c => t >= c).length, x0 = sx + sw * .06 + fs * .8, cy = rb + sh * .07;
    if (n > 0) {
      const pts = []; for (let i = 0; i <= n * 6; i++) { const u = i / 6; pts.push([x0 + u * fs * .9, cy + Math.sin(u * 4.2) * fs * .28 - Math.abs(Math.sin(u * 2.1)) * fs * .12]); }
      inkLine(pts, 1.6, PAL.ink, 'ink', .5);
    }
    const cx = x0 + n * fs * .9 + 6;
    if (frac((t - OFF) / HB) < .55) inkLine([[cx, cy - fs * .5], [cx, cy + fs * .5]], 1.4, PAL.ink, 'ink', 0);
  }
  function inkDrop(x, y, r, sq = 0) { paint(ellPts(x, y, r * (1 + sq), r * (1 - sq * .6), 12, r * .08), { wash: PAL.ink, fill: PAL.violet, fillOp: 60, ink: null }); }
  function keystrokes(t, lt, dur) {
    const z = kf(t, [[6.1, 1.09], [6.5, 1.06], [8.9, .6]]), cx = kf(t, [[6.1, 1030], [6.5, 1040], [8.9, 1500]]), cy = kf(t, [[6.1, 520], [8.9, 760]]);
    camBegin(cx, cy, z);
    paint(rectPts(-900, -700, 3700, 3000), { wash: TP.wallDk, fill: TP.night, fillOp: 120, tex: .6, ink: null });
    paint([[1700, 1250], [2800, 1250], [2800, 2400], [1700, 2400]], { wash: TP.floor, fill: TP.floorDk, fillOp: 90, tex: .8, ink: null });
    inkLine([[1700, 1250], [2700, 1250]], 1.2, PAL.ink, 'ink', 0);
    roomWindow(t, -260, 60, 420, 420, { drops: 20 });
    // the page of bare paper opening in the dark where he will be drawn
    paperPatch(GX, 1010, 470, 400, ease(seg(t, 6.2, 7.6)), 3);
    const P = CLAWD_PATH.map(([a, b]) => [GX + a * GU, GY + b * GU]);
    if (lineK(t) > 0) clawdSketch(GX, GY, GU, lineK(t), 0);
    // the bed and the laptop in the foreground
    paint([[-900, 1300], [1860, 1300], [1800, 2400], [-900, 2400]], { wash: TP.blanket, ink: null });
    paint([[-900, 930], [500, 900], [1300, 915], [1820, 940], [1870, 1200], [1850, 1380], [-900, 1380]], { wash: TP.blanket, fill: PAL.indigo, fillOp: 90, tex: .7, ink: PAL.ink, sw: 1.2, curv: .5 });
    glow(1080, 560, 640, 420, TP.glow, 45);
    laptop(1080, 930, 2.15, { screen: (sx, sy, sw, sh) => replyScreen(t, sx, sy, sw, sh) });
    // droplets: flick off the reply box on each keystroke, arc over and settle on a corner of his outline
    CT.forEach((tk, i) => {
      const q = seg(t, tk, tk + .62); if (t < tk) return;
      const [tx, ty] = P[DOTS[i]], k = easeOut(q);
      const x = lerp(SRC[0], tx, k), y = lerp(SRC[1], ty, k) - Math.sin(k * Math.PI) * (380 + 120 * hash(i)), r = 9 + 5 * k;
      inkDrop(x, y, r, q < 1 ? .35 * Math.sin(k * Math.PI) : 0);
      if (q >= 1) ripple(tx, ty, 34, seg(t, tk + .62, tk + 1.1), PAL.ink, .8);
    });
    her(300, 1460, 68, { back: true, noShadow: true, aL: -1.1, aR: -.4 + .08 * Math.sin(t * 9), hairSwing: wob(t, .25) * .08 });
    paint(rectPts(-900, 1300, 1800, 1100), { wash: TP.blanket, ink: null });
    paint([[-900, 1150], [80, 1120], [420, 1110], [760, 1150], [880, 1260], [900, 1380], [-900, 1380]], { wash: TP.blanket, fill: PAL.indigo, fillOp: 90, tex: .7, ink: PAL.ink, sw: 1.2, curv: .5 });
    glow(470, 700, 90, 230, TP.glow, 40);
    camEnd();
    paint(rectPts(-60, -60, W + 120, H + 120), { fill: TP.night, fillOp: 28, bleed: 0, tex: .2, border: 0, ink: null });
  }

  // ---------- the bedroom two-shot (B and D) ----------
  function sittingHer(t, o = {}) {
    herInBed([540, 640], 30, o.th ?? -.04, { aL: -1.0, aR: -1.0, ...o });
    blanket(330, 1080, 720, x => (x < 720 ? 606 - Math.sin(clamp((x - 330) / 390) * Math.PI) * 6 : 650 - Math.sin((x - 720) / 360 * Math.PI) * 22) + Math.sin(x * .02) * 4);
    laptop(560, 640, .52, { facing: 'away', open: 1, bright: 1 });
    glow(540, 380, 120, 90, TP.glow, 55);
  }

  // B · his voice: notes drift from the laptop and splash watercolour into the outline
  function voice(t, lt, dur) {
    camBegin(kf(t, [[9.4, 1010], [12.1, 1060]]), kf(t, [[9.4, 600], [12.1, 590]]), kf(t, [[9.4, 1.12], [12.1, 1.2]]));
    bedroomSet(t);
    paint(rectPts(-400, -400, W + 800, H + 800), { fill: TP.night, fillOp: 60, bleed: 0, tex: .2, border: 0, ink: null });
    paperPatch(BX, 790, 250, 215, 1, 3);
    clawdSketch(BX, BY, BU, lineK(t), fillK(t));
    // the notes: little ink notes on an arc from the laptop, each landing as a bloom
    for (let i = 0; i < 6; i++) {
      const q = seg(t, noteT(i), noteT(i) + .55); if (q <= 0 || q >= 1) continue;
      const tx = BX + (hash(i * 3) - .5) * 7 * BU, ty = BY - 5 * BU + (hash(i * 5) - .5) * 4 * BU, k = ease(q);
      emote('music', lerp(620, tx, k), lerp(470, ty, k) - Math.sin(k * Math.PI) * 140, 14, 1);
    }
    const m = mood(t, [[9.4, 'look'], [11.0, 'closed', 'heart']]);
    sittingHer(t, { ...m, lookX: .9, lookY: -.2, mouth: t < 11 ? 'o' : 'smile', th: kf(t, [[9.4, -.04], [11.2, .07]]), hairSwing: -.15 });
    camEnd();
  }

  // ---------- C · one light tap of Enter ----------
  const TAP = hbT(13);                                   // 13.64: just before 「一句」
  function enterKey(t, lt, dur) {
    const z = kf(t, [[12.1, 1], [14.6, 1.08]]);
    camBegin(980, 560, z, -.04);
    const warm = seg(t, TAP, TAP + .8);
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: mixCol('#3A3D5C', '#6B5560', warm * .6), fill: '#22253F', fillOp: 120, tex: .6, ink: null });
    glow(960, -60, 1100, 300, mixCol(TP.glow, TP.lamp, warm), 70);
    // rows of keys
    for (let r = 0; r < 5; r++) for (let c = 0; c < 12; c++) {
      const kx = 120 + c * 150 + (r % 2) * 40, ky = 120 + r * 170;
      if (r === 3 && c >= 10) continue;
      paint(rrPts(kx, ky, 128, 140, 18, 2), { wash: '#C9CBDD', fill: '#8E90A8', fillOp: 70, tex: .5, ink: PAL.ink, sw: 1.1 });
    }
    // Enter: big, and it dips when she taps it
    const press = Math.exp(-Math.max(0, t - TAP) * 9) * (t >= TAP ? 1 : 0), ex = 1630, ey = 630;
    paint(rrPts(ex, ey + press * 14, 290, 150, 20, 2), { wash: mixCol('#D6D8E8', TP.lamp, warm), fill: '#8E90A8', fillOp: 60, tex: .5, ink: PAL.ink, sw: 1.3 });
    inkLine([[ex + 220, ey + 40 + press * 14], [ex + 220, ey + 95 + press * 14], [ex + 90, ey + 95 + press * 14]], 2, PAL.ink, 'ink', 0);
    inkLine([[ex + 112, ey + 78 + press * 14], [ex + 88, ey + 95 + press * 14], [ex + 112, ey + 112 + press * 14]], 2, PAL.ink, 'ink', 0);
    // warm rings spreading out from the key across everything
    for (let i = 0; i < 4; i++) {
      const k = seg(t, TAP + i * .18, TAP + i * .18 + 1.3); if (k <= 0 || k >= 1) continue;
      inkLine(ellPts(ex + 145, ey + 75, 2200 * easeOut(k), 1500 * easeOut(k), 40).concat([[ex + 145 + 2200 * easeOut(k), ey + 75]]), 3 * (1 - k), TP.lamp, 'ink', .5);
    }
    if (warm > 0) glow(ex + 145, ey + 75, 500 * warm, 380 * warm, TP.lamp, 90 * (1 - warm * .4));
    // her hand: sweater cuff from the lower left, one finger hovering, a little hesitant, then the tap
    const hover = t < TAP ? Math.sin(t * 7) * 10 + kf(t, [[12.1, -160], [12.9, 0], [13.3, 30], [13.55, -20]]) : -20 + press * 30;
    const hx = 1700 + (t < TAP ? Math.sin(t * 3) * 14 : 0), hy = 560 + hover;
    push(); translate(hx, hy); rotate(-.55);
    paint(rrPts(-560, -70, 420, 150, 50, 3), { wash: TP.sweater, fill: PAL.violet, fillOp: 60, tex: .6, ink: PAL.ink, sw: 1.4 });
    for (let i = 0; i < 6; i++) inkLine([[-200 + i * 0, -66 + i * 25], [-170, -66 + i * 25]], .6, mixCol(TP.sweater, PAL.ink, .45), 'inkfine', 0);
    paint(rrPts(-170, -64, 170, 128, 46, 2), { wash: SKIN, fill: '#E9A98A', fillOp: 50, tex: .5, ink: PAL.ink, sw: 1.3 });
    paint(rrPts(-20, -26, 150, 46, 22, 2), { wash: SKIN, fill: '#E9A98A', fillOp: 40, tex: .5, ink: PAL.ink, sw: 1.3 });
    paint(rrPts(98, -20, 30, 34, 10, 1), { wash: '#F6D3BE', ink: PAL.ink, sw: .7 });
    pop();
    camEnd();
  }

  // ---------- D · his eyes open; the room starts to turn into a painting ----------
  function arrival(t, lt, dur) {
    const warm = ease(seg(t, 16.4, 18.4)), z = kf(t, [[14.6, 1.12], [18.6, 1.3]]);
    camBegin(kf(t, [[14.6, 1040], [18.6, 1010]]), kf(t, [[14.6, 600], [18.6, 620]]), z);
    bedroomSet(t, { warm });
    paint(rectPts(-400, -400, W + 800, H + 800), { fill: TP.night, fillOp: 60 * (1 - warm), bleed: 0, tex: .2, border: 0, ink: null });
    paperPatch(BX, 790, 250 + 120 * warm, 215 + 80 * warm, 1, 3);
    glow(BX, BY - 60, 300 + 800 * warm, 120 + 420 * warm, TP.lamp, 80 * warm);
    // the warm ring from the key passes through the room and reaches him
    for (let i = 0; i < 3; i++) { const k = seg(t, 14.6 + i * .2, 15.4 + i * .2); if (k > 0 && k < 1) inkLine(ellPts(560, 560, 1200 * k, 700 * k, 36).concat([[560 + 1200 * k, 560]]), 2.4 * (1 - k), TP.lamp, 'ink', .5); }
    // his eyes are painted on as two closed strokes, then open on the downbeat
    const OPEN = barT(4), strokes = seg(t, 15.75, 16.2);
    const m = mood(t, [[14.6, 'none'], [OPEN, 'normal', '!'], [16.95, 'look'], [17.35, 'happy', 'heart']]);
    const lookX = t < 17.1 ? (t < 16.95 ? 0 : 1) : -1;
    const wave = seg(t, 17.35, 18.15), reach = ease(seg(t, 18.15, 18.55));
    const aL = lerp(lerp(.2, 1.15 + .35 * Math.sin(wave * TAU * 2), Math.sin(wave * Math.PI) > 0 ? 1 : 0), .08, reach);
    him(BX, BY, BU, { ...m, eyes: t < OPEN ? 'none' : m.eyes, lookX, aL, aR: .2, blush: t > 17.35, sq: m.take + (t > 16.36 && t < 16.6 ? -.04 : 0) });
    if (t < OPEN && strokes > 0) for (const ex of [-3, 2]) {
      const X = BX + ex * BU, Y = BY - 7 * BU;
      inkLine(partialPath([[X - .4 * BU, Y + 1.2 * BU], [X + .5 * BU, Y + 1.6 * BU], [X + 1.4 * BU, Y + 1.2 * BU]], strokes), 1.3, PAL.ink, 'ink', .4);
    }
    const hm = mood(t, [[14.6, 'look'], [OPEN + .12, 'wide', '!'], [17.5, 'closed', 'heart']]);
    sittingHer(t, { ...hm, lookX: .9, mouth: t < OPEN + .12 ? 'flat' : t < 17.5 ? 'o' : 'smile', blush: t > 17.2, th: kf(t, [[16.4, -.04], [16.6, -.12], [17.6, .05]], easeOut) });
    camEnd();
    dreamEdge(ease(seg(t, 16.6, 18.6)) * .8, 2);
  }

  chapter('writing', 6.1, 18.6, [[6.1, keystrokes], [9.4, voice], [12.1, enterKey], [14.6, arrival]]);
})();
