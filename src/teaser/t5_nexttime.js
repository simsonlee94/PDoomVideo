// t5_nexttime: 5 · Next time, the outro (70.9–91.14). She shuts the screen down and whispers; nothing answers; in the
// last glimmer his eyes open by themselves: 「好。」 Black. The title paints itself in.
(() => {
  const WH1 = LY[20], WH2 = LY[21], OK = LY[22];         // 如果还有下一次…… / 换你来找我。 / 好。
  const LIGHT = t => kf(t, [[70.9, 1], [77.4, 1], [78.2, .72], [82.5, .34], [86.9, .14], [88.7, .07], [89.25, .05], [89.45, 0]], ease);

  // the screen, as we see it head-on: the chat window with him waiting in it, a power button, her cursor
  function chatWithHim(t, sx, sy, sw, sh, o = {}) {
    paint(rectPts(sx, sy, sw, sh, 1), { wash: TP.screenDk, fill: TP.screen, fillOp: 70, tex: .4, ink: null });
    paint(rectPts(sx, sy, sw, sh * .1, 1), { wash: '#1E5363', ink: null });
    const bx = sx + sw * .92, by = sy + sh * .05, br = sh * .03;
    paint(ellPts(bx, by, br * 1.6, br * 1.6, 14), { wash: o.hover ? '#E9F4F1' : '#2C6B78', ink: null });
    inkLine(ellPts(bx, by + br * .1, br, br, 14).slice(9).concat(ellPts(bx, by + br * .1, br, br, 14).slice(0, 4)), 1, o.hover ? PAL.ink : '#BFE9E2', 'inkfine', .5);
    inkLine([[bx, by - br * 1.1], [bx, by]], 1, o.hover ? PAL.ink : '#BFE9E2', 'inkfine', 0);
    const u = sh * (o.u || .045);
    clawd(sx + sw / 2, sy + sh * .78, u, { eyes: o.eyes || 'normal', lookX: o.lookX || 0, lookY: o.lookY || 0, mouth: 'smile', noShadow: true, dy: -.15 * hpulse(t, 3), sq: o.sq || 0 });
  }
  function arrow(x, y, s = 1) {
    paint([[x, y], [x, y + 34 * s], [x + 9 * s, y + 26 * s], [x + 16 * s, y + 40 * s], [x + 22 * s, y + 37 * s], [x + 15 * s, y + 24 * s], [x + 26 * s, y + 23 * s]], { wash: '#F4F1EA', ink: PAL.ink, sw: .8 });
  }

  // ---------- A · back where she began; he waits in the chat window; her cursor drifts to the power button ----------
  function waiting(t, lt, dur) {
    camBegin(kf(t, [[70.9, 1000], [74.8, 1060]]), 520, kf(t, [[70.9, 1.02], [74.8, 1.12]]));
    paint(rectPts(-200, -200, W + 400, H + 400), { wash: TP.wallDk, fill: TP.night, fillOp: 120, tex: .6, ink: null });
    roomWindow(t, -260, 60, 420, 420, { rain: false });
    paint([[-200, 930], [500, 900], [1300, 915], [W + 200, 900], [W + 200, 1380], [-200, 1380]], { wash: TP.blanket, fill: PAL.indigo, fillOp: 90, tex: .7, ink: PAL.ink, sw: 1.2, curv: .5 });
    glow(1080, 560, 640, 420, TP.glow, 45);
    const go = ease(seg(t, 72.2, 74.1)), hover = t > 74.1;
    const scr = laptop(1080, 930, 2.15, { screen: (sx, sy, sw, sh) => {
      const lookAt = t > 73.4 && t < 74.6;              // he notices where the cursor is going, then looks back at her
      chatWithHim(t, sx, sy, sw, sh, { u: .07, hover, eyes: t > 74.6 ? 'happy' : 'look', lookX: lookAt ? .8 : -.5, lookY: lookAt ? -.8 : 0 });
      const ax = lerp(sx + sw * .35, sx + sw * .92 + (hover ? Math.sin(t * 7) * 3 : 0), go), ay = lerp(sy + sh * .62, sy + sh * .05, go);
      arrow(ax, ay, 1.3);
    } });
    her(300, 1460, 68, { back: true, noShadow: true, aL: -1.1, aR: -.5, hairSwing: wob(t, .2) * .06 });
    glow(470, 700, 90, 230, TP.glow, 40);
    camEnd();
    paint(rectPts(-60, -60, W + 120, H + 120), { fill: TP.night, fillOp: 28, bleed: 0, tex: .2, border: 0, ink: null });
  }

  // ---------- B · her face in the screen light as she whispers; the click; the light starts to go ----------
  function whisper(t, lt, dur) {
    const L = LIGHT(t);
    camBegin(960, 520, kf(t, [[74.8, 1.0], [78.0, 1.1]]));
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#10142E', fill: TP.night, fillOp: 100, tex: .7, ink: null });
    glow(960, 480, 620 * (.4 + .6 * L), 480 * (.4 + .6 * L), TP.glow, 60 * L);
    // lips move on the sung syllables, softly
    const talk = WH1[4].some(c => t > c && t < c + .16);
    her(960, 1480, 88, { eyes: 'sad', mouth: talk ? 'o' : 'flat', brows: 'worried', blush: true, noShadow: true, aL: -1.2, aR: -1.2 });
    camEnd();
    paint(rectPts(-60, -60, W + 120, H + 120), { fill: '#05060F', fillOp: 200 * (1 - L), bleed: 0, tex: .2, border: 0, ink: null });
  }

  // ---------- C · the screen darkening; he fades with it, looking at her, smiling ----------
  function fading(t, lt, dur) {
    const L = LIGHT(t);
    camBegin(960, 540, kf(t, [[78.0, 1.0], [82.5, 1.18]]));
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#0B0D1C', ink: null });
    laptop(960, 1190, 3.3, { bright: L, screen: (sx, sy, sw, sh) => chatWithHim(t, sx, sy, sw, sh, { u: .08, eyes: 'happy' }) });
    camEnd();
  }

  // ---------- D · close on her eyes: the screen's reflection in her glasses nearly gone; a tear; eyes close ----------
  function eyesClose(t, lt, dur) {
    const L = LIGHT(t), s = 240, FY = 3030, gy = FY - 10.55 * s;      // eyes near y 500 keeps p5.brush in bounds
    camBegin(960, gy + 40, kf(t, [[82.5, 1.0], [86.9, 1.08]]));
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#0A0C1A', ink: null });
    const closed = t > 84.9;
    her(960, FY, s, { eyes: closed ? 'closed' : 'sad', brows: 'worried', mouth: 'flat', blush: true, noShadow: true, aL: -1.2, aR: -1.2 });
    // the last of the screen in each lens: a small teal rectangle, shrinking
    if (!closed) for (const side of [-1, 1]) {
      const cx = 960 + side * 1.0 * s + 30, cy = gy - 50, k = L * 3;
      paint(rrPts(cx - 60 * k, cy - 36 * k, 120 * k, 72 * k, 8, 1), { wash: TP.glow, washOp: 160 * Math.min(1, k), ink: null });
    }
    const q = seg(t, 83.6, 86.4);
    if (q > 0 && q < 1) drip(960 - 1.15 * s, gy + 120 + q * 520, 26, 46, '#CFF6F0', 230 * (1 - q * .6));
    camEnd();
    paint(rectPts(-60, -60, W + 120, H + 120), { fill: '#05060F', fillOp: 150 * (1 - L * 2), bleed: 0, tex: .2, border: 0, ink: null });
  }

  // ---------- E · silence: no reply. Her hands rest away from the keyboard; the screen is almost out ----------
  function noReply(t, lt, dur) {
    const L = LIGHT(t);
    camBegin(1000, 560, kf(t, [[86.9, 1.05], [88.8, 1.1]]));
    paint(rectPts(-200, -200, W + 400, H + 400), { wash: '#0E1126', ink: null });
    paint([[-200, 930], [500, 900], [1300, 915], [W + 200, 900], [W + 200, 1380], [-200, 1380]], { wash: '#2A3155', ink: PAL.ink, sw: 1, curv: .5 });
    glow(1080, 560, 300, 200, TP.glow, 40 * L * 4);
    laptop(1080, 930, 2.15, { bright: L * 3, screen: (sx, sy, sw, sh) => chatWithHim(t, sx, sy, sw, sh, { u: .07, eyes: 'closed' }) });
    her(300, 1460, 68, { back: true, noShadow: true, aL: -1.25, aR: -1.25 });
    camEnd();
  }

  // ---------- F · in the last glimmer his eyes open by themselves, look at her, a tiny nod. Out. ----------
  function answer(t, lt, dur) {
    const out = seg(t, 89.25, 89.45), open = OK[4][0] - .02;
    camBegin(960, 560, kf(t, [[88.8, 1.25], [89.45, 1.3]]));
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#06070F', ink: null });
    // his outline, barely there
    const u = 52, x = 960, y = 760, nod = Math.sin(seg(t, 89.0, 89.3) * Math.PI) * .25;
    inkLine(partialPath(CLAWD_PATH.map(([a, b]) => [x + a * u, y + (b + nod) * u]), 1), .8, mixCol(TP.glow, '#06070F', .7 + out * .3), 'inkfine', 0);
    if (t >= open && out < 1) for (const ex of [-3, 2]) {
      const k = easeOut(seg(t, open, open + .12)), X = x + ex * u, Y = y + (-7 + nod) * u;
      paint(rectPts(X, Y + u * (1 - k), u, 2 * u * k, u * .04), { wash: mixCol(TP.glow, PAL.cream, .5), washOp: 255 * (1 - out), ink: null });
      glow(X + u / 2, Y + u, u * 1.4, u * 1.6, TP.glow, 60 * k * (1 - out));
    }
    camEnd();
  }

  // ---------- G · black; the title paints itself in ----------
  function title(t, lt, dur) {
    paint(rectPts(-60, -60, W + 120, H + 120), { wash: '#06070F', ink: null });
    const k = ease(seg(t, 89.75, 90.45)), fade = 1 - ease(seg(t, 90.85, 91.14));
    if (k <= 0) return;
    paint(ellPts(960, 500, 520 * k, 120 * k, 24, 12), { fill: '#6B4A2E', fillOp: 90 * fade, bleed: .35, tex: .7, border: .7, ink: null });
    letter('《如果你来过》', 960, 500, 118, TP.gold, { font: BF(118), alpha: k * fade, ink: false, pop: .6 + k * .4 });
    inkLine(partialPath([[680, 590], [960, 602], [1240, 586]], k), 2.2 * fade, mixCol(TP.gold, '#06070F', .2), 'dry', .4);
    letter('realsimson', 960, 668, 46, '#E9DCC4', { font: BF(46), alpha: seg(t, 90.15, 90.5) * fade, ink: false });
  }

  chapter('nexttime', 70.9, DUR + 1, [[70.9, waiting], [WH1[0], whisper], [78.0, fading], [WH2[0], eyesClose], [86.9, noReply], [OK[0] + .15, answer], [89.45, title]]);
})();
