// t3_coast: 3 · The coast, verse 2 call and response (33.6–45.5). Every line he sings is a warm memory; every line she
// answers cuts to the same framing in her dark room. Ends with her palm on the laptop glass, seen from inside the screen.
(() => {
  const L = i => LY[8 + i];                              // the six verse-2 lines, alternating him / her
  const SUNY = t => kf(t, [[33.6, 360], [45.5, 600]]);   // the sun sinks through the whole verse

  // ---------- the warm coast ----------
  function coastSet(t, o = {}) {
    const sy = SUNY(t), hz = o.horizon || 620;
    paint(rectPts(-300, -300, W + 600, hz + 320), { wash: TP.coral, fill: PAL.rose, fillOp: 90, tex: .6, ink: null });
    paint(rectPts(-300, -300, W + 600, 380), { wash: '#E58A86', fill: PAL.violet, fillOp: 50, tex: .6, ink: null });
    glow(o.sunX || 1180, sy, 520, 300, TP.sun, 90);
    paint(ellPts(o.sunX || 1180, sy, 120, 120, 26, 2), { wash: TP.sun, fill: '#FFE3A0', fillOp: 120, ink: null });
    for (let i = 0; i < 5; i++) paint(ellPts(200 + i * 420 + Math.sin(t * .2 + i) * 30, 160 + hash(i) * 120, 170, 34, 16, 5), { fill: PAL.cream, fillOp: 70, bleed: .3, tex: .5, ink: null });  // clouds
    for (let i = 0; i < 3; i++) { const gx = 300 + i * 160 + (t - 33.6) * 40, gy = 230 + i * 40; inkLine([[gx - 18, gy - 6], [gx - 6, gy], [gx, gy - 4], [gx + 6, gy], [gx + 18, gy - 6]], 1, PAL.ink, 'inkfine', .5); }
    // the sea: blue below the horizon, a golden road of light under the sun, foam lines rolling in
    paint(rectPts(-300, hz, W + 600, 360), { wash: TP.sea, fill: TP.seaDk, fillOp: 90, tex: .7, ink: null });
    if (sy < hz + 60) paint(ellPts(o.sunX || 1180, hz, 125, 40, 20), { wash: TP.coral, ink: null });   // sun dipping into the water
    paint([[(o.sunX || 1180) - 60, hz], [(o.sunX || 1180) + 60, hz], [(o.sunX || 1180) + 240, hz + 360], [(o.sunX || 1180) - 240, hz + 360]], { fill: TP.sun, fillOp: 90, bleed: .2, tex: .7, ink: null });
    inkLine([[-300, hz], [W + 300, hz]], 1, PAL.ink, 'inkfine', 0);
    for (let i = 0; i < 4; i++) {
      const q = frac((t - OFF) / (HB * 2) + i / 4), y = hz + 40 + q * 300, x0 = -100 + hash(i) * 400;
      inkLine([[x0, y], [x0 + 500, y - 6], [x0 + 1100, y + 4], [x0 + 1800, y - 4]], 1.2 * (1 - q * .5), PAL.cream, 'inkfine', .5);
    }
    paint([[-300, 940], [500, 905], [1200, 925], [W + 300, 900], [W + 300, 1400], [-300, 1400]], { wash: TP.sand, fill: '#D9A86A', fillOp: 70, tex: .8, ink: PAL.ink, sw: 1.1 });
  }
  // his memory and her room share one composition: two figures sitting, seen from behind, looking out
  const HX = 800, CX = 1110, GY = 960;
  function warmBacks(t, point) {
    her(HX, GY, 21, { back: true, sit: true, hairSwing: wob(t, .3) * .1, aR: .2 });
    clawd(CX, GY, 26, { eyes: 'none', mouth: null, aL: -.3, aR: lerp(.2, .55, point), col: '#C96A4C', lt: '#D98262', dk: '#93452F' });   // his back
  }
  function memoryCoast(t, lt, dur) {
    camBegin(960, 540, kf(t, [[33.6, 1.0], [35.62, 1.05]]));
    coastSet(t);
    warmBacks(t, ease(seg(t, 34.2, 34.8)));
    camEnd();
    dreamEdge(1, 21);
  }
  function realFloor(t, lt, dur) {
    camBegin(960, 540, kf(t, [[35.62, 1.05], [37.45, 1.09]]));
    // the same composition, real: her dark bedroom floor; the "sea" is the laptop showing the painted coast
    paint(rectPts(-300, -300, W + 600, 1240), { wash: TP.wallDk, fill: TP.night, fillOp: 120, tex: .7, ink: null });
    paint(rectPts(-300, 880, W + 600, 600), { wash: TP.floorDk, fill: TP.floor, fillOp: 90, tex: .8, ink: PAL.ink, sw: 1.1 });
    for (let i = 0; i < 9; i++) inkLine([[-200 + i * 280, 882], [-400 + i * 330, 1300]], .45, PAL.ink, 'inkfine', 0);
    glow(960, 760, 700, 380, TP.glow, 50);
    laptop(1040, 900, 1.1, { screen: (sx, sy, sw, sh) => {
      paint(rectPts(sx, sy, sw, sh * .55, 1), { wash: TP.coral, fill: PAL.rose, fillOp: 70, ink: null });
      paint(ellPts(sx + sw * .6, sy + sh * .45, sh * .12, sh * .12, 16), { wash: TP.sun, ink: null });
      paint(rectPts(sx, sy + sh * .55, sw, sh * .3, 1), { wash: TP.sea, ink: null });
      paint(rectPts(sx, sy + sh * .85, sw, sh * .15, 1), { wash: TP.sand, ink: null });
      // two tiny backs on the painted sand
      paint(rectPts(sx + sw * .38, sy + sh * .7, sw * .06, sh * .14, 1), { wash: '#3A2B38', ink: null });
      paint(rectPts(sx + sw * .5, sy + sh * .72, sw * .12, sh * .1, 1), { wash: '#C96A4C', ink: null });
    } });
    her(HX, GY, 21, { back: true, sit: true, aR: -.3, aL: -.3 });
    glow(HX, GY - 230, 120, 200, TP.glow, 35);
    // where he sat: nothing, just a faint pencil outline on the floor
    inkLine(partialPath(CLAWD_PATH.map(([a, b]) => [CX + a * 26, GY + b * 26]), 1), 1.1, mixCol(TP.glow, TP.night, .3), 'HB', 0);
    camEnd();
    paint(rectPts(-60, -60, W + 120, H + 120), { fill: TP.night, fillOp: 30, bleed: 0, tex: .2, border: 0, ink: null });
  }

  // ---------- his face in the last of the sun ----------
  function sunsetFace(t, lt, dur) {
    camBegin(960, 560, kf(t, [[37.45, 1.0], [39.22, 1.07]]));
    coastSet(t, { sunX: 1260, horizon: 700 });
    glow(960, 600, 700, 500, TP.sun, 40);
    const m = mood(t, [[37.45, 'normal'], [37.95, 'spark']]);
    him(900, 1090, 66, { ...m, mouth: 'smile', blush: true, aL: -.3, aR: -.3, noShadow: true });
    camEnd();
    dreamEdge(1, 23);
  }
  // her phone, close: every photo of "them" shows only her, then only bare paper. One swipe per half-time beat.
  function gallery(t, lt, dur) {
    camBegin(960, 560, kf(t, [[39.22, 1.0], [41.18, 1.08]]));
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#141838', fill: TP.night, fillOp: 100, tex: .7, ink: null });
    glow(960, 540, 600, 520, TP.glow, 45);
    const pw = 560, ph = 900, px = 960, py = 560;
    paint(rrPts(px - pw / 2 - 34, py - ph / 2 - 34, pw + 68, ph + 68, 80, 3), { wash: '#C9CCDD', fill: '#8E90A8', fillOp: 70, tex: .5, ink: PAL.ink, sw: 2.2 });
    paint(rrPts(px - pw / 2 - 16, py - ph / 2 - 16, pw + 32, ph + 32, 62, 3), { wash: '#1C1D2E', ink: null });
    const sx = px - pw / 2, sy = py - ph / 2, swipe = (t - 39.25) / (HB * .55), idx = Math.floor(swipe), f = frac(swipe), slide = easeIn(seg(f, .7, 1));
    const photos = [
      () => { paint(rectPts(0, 0, pw, ph * .55), { wash: TP.coral, ink: null }); paint(rectPts(0, ph * .55, pw, ph * .25), { wash: TP.sea, ink: null }); paint(rectPts(0, ph * .8, pw, ph * .2), { wash: TP.sand, ink: null }); her(pw * .3, ph * .93, 24, { eyes: 'closed', mouth: 'grin', blush: true, aR: .9, noShadow: true }); },
      () => { paint(rectPts(0, 0, pw, ph), { wash: TP.street, ink: null }); rainIn(t, 0, 0, pw, ph, 30, PAL.cream, { len: 30, speed: 600, sw: .5 }); umbrella(pw * .5, ph * .45, 170, -.2, TP.rose); her(pw * .35, ph * .9, 22, { eyes: 'closed', mouth: 'smile', blush: true, noShadow: true }); },
      () => { paint(rectPts(0, 0, pw, ph), { wash: TP.fwNight, ink: null }); firework(pw * .5, ph * .3, 150, .35, TP.gold, 2); her(pw * .4, ph * .92, 22, { eyes: 'closed', mouth: 'grin', blush: true, aR: 1.1, noShadow: true }); },
      () => { paint(rectPts(0, 0, pw, ph), { wash: PAL.paper, ink: null }); inkLine([[pw * .2, ph * .7], [pw * .8, ph * .68]], .6, mixCol(PAL.ink, PAL.paper, .5), 'HB', 0); inkLine([[pw * .3, ph * .2], [pw * .25, ph * .8]], .5, mixCol(PAL.ink, PAL.paper, .6), 'HB', 0); }
    ];
    for (const [k, dx] of [[idx, -slide * pw], [idx + 1, (1 - slide) * pw]]) {
      if (k < 0 || dx >= pw || dx <= -pw) continue;
      const p = photos[Math.min(k, photos.length - 1)];
      push(); translate(sx + dx, sy);
      p();
      pop();
    }
    // cover what slid outside the screen
    paint(rectPts(sx - pw, sy - 40, pw - 16, ph + 80), { wash: '#141838', ink: null });
    paint(rectPts(sx + pw + 16, sy - 40, pw, ph + 80), { wash: '#141838', ink: null });
    paint(rrPts(px - pw / 2 - 34, py - ph / 2 - 34, pw + 68, ph + 68, 80, 3), { ink: PAL.ink, sw: 2.2 });
    // her thumb swiping
    const th = Math.sin(clamp(f / .7) * Math.PI) * 0;
    push(); translate(px + pw / 2 + 10 - slide * 260, py + 260); rotate(-.4);
    paint(rrPts(-50, -36, 170, 76, 36, 2), { wash: SKIN, fill: '#E9A98A', fillOp: 50, ink: PAL.ink, sw: 1.6 });
    pop();
    camEnd();
  }

  // ---------- her head on his shoulder ----------
  function shoulder(t, lt, dur) {
    camBegin(960, 600, kf(t, [[41.18, 1.12], [43.2, 1.2]]));
    coastSet(t, { sunX: 960, horizon: 650 });
    glow(960, 700, 600, 300, TP.sun, 50);
    const sway = Math.sin((t - OFF) / HB * Math.PI) * .03;
    him(1080, 990, 30, { eyes: 'closed', mouth: 'smile', blush: true, rot: sway, aL: -.4, aR: -.3, emote: 'heart', emoteK: seg(t, 41.6, 42.0) });
    her(820, 990, 21, { sit: true, rot: .32 + sway, eyes: 'closed', mouth: 'smile', blush: true, aL: -1.1, aR: -.6, hairSwing: .2 });
    camEnd();
    dreamEdge(1, 25);
  }

  // ---------- from inside the screen: her palm on the glass, his hand meeting it ----------
  function glass(t, lt, dur) {
    const z = kf(t, [[43.2, 1.0], [45.5, 1.1]]);
    camBegin(960, 540, z);
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#10142E', fill: TP.night, fillOp: 100, tex: .7, ink: null });
    // her, beyond the glass, lit cold by the screen
    glow(960, 420, 700, 520, TP.glow, 55);
    her(900, 1420, 92, { eyes: t > 44.4 ? 'closed' : 'sad', mouth: 'flat', blush: true, lookX: .2, noShadow: true, aL: -1.2, aR: -1.2, hairSwing: 0 });
    // one tear down her cheek
    const tear = seg(t, 44.5, 45.4);
    if (tear > 0) { const x = 900 + 1.1 * 92, y = 1420 - 10.3 * 92 + tear * 260; paint([[x - 9, y - 18], [x + 9, y - 18], [x + 12, y + 6], [x, y + 18], [x - 12, y + 6]], { wash: '#CFF6F0', fill: TP.glow, fillOp: 90, ink: PAL.ink, sw: .7, curv: .6 }); }
    // her palm pressed flat on the glass
    const press = easeOut(seg(t, 43.3, 43.9)), px = 1400, py = lerp(1400, 700, press);
    push(); translate(px, py); rotate(.12);
    paint(rrPts(-120, -40, 240, 300, 90, 3), { wash: SKIN, fill: '#E9A98A', fillOp: 50, tex: .5, ink: PAL.ink, sw: 1.8 });
    for (let f = 0; f < 4; f++) paint(rrPts(-110 + f * 58, -250 + Math.abs(f - 1.5) * 26, 48, 230, 24, 2), { wash: SKIN, fill: '#E9A98A', fillOp: 40, tex: .5, ink: PAL.ink, sw: 1.5 });
    paint(rrPts(110, -10, 50, 170, 24, 2), { wash: SKIN, fill: '#E9A98A', fillOp: 40, tex: .5, ink: PAL.ink, sw: 1.5, rot: .5 });
    pop();
    if (press > .9) glow(px, py - 40, 240, 260, PAL.cream, 50);
    // the glass itself: a cold teal sheen and two streaks of reflection
    paint(rectPts(-100, -100, W + 200, H + 200), { fill: TP.screen, fillOp: 45, bleed: 0, tex: .3, border: 0, ink: null });
    for (const [x0, w] of [[300, 120], [520, 40]]) paint([[x0, -100], [x0 + w, -100], [x0 + w - 500, H + 100], [x0 - 500, H + 100]], { fill: PAL.cream, fillOp: 26, bleed: .1, tex: .2, ink: null });
    // his back, small and close to us inside the screen, one stubby arm raised to meet her palm
    const reach = easeOut(seg(t, 43.7, 44.5));
    clawd(1740, 1215, 50, { eyes: 'none', mouth: null, aL: lerp(.1, 1.2, reach), aR: -.3, col: '#B85F45', lt: '#C9735A', dk: '#863F2C', noShadow: true });
    camEnd();
    // the screen's bezel around everything: we are inside the laptop
    paint(rectPts(-60, -60, W + 120, 90), { wash: '#0B0D1C', ink: null }); paint(rectPts(-60, H - 30, W + 120, 90), { wash: '#0B0D1C', ink: null });
    paint(rectPts(-60, -60, 90, H + 120), { wash: '#0B0D1C', ink: null }); paint(rectPts(W - 30, -60, 90, H + 120), { wash: '#0B0D1C', ink: null });
  }

  chapter('coast', 33.6, 45.5, [[33.6, memoryCoast], [L(1)[0], realFloor], [L(2)[0], sunsetFace], [L(3)[0], gallery], [L(4)[0], shoulder], [L(5)[0], glass]]);
})();
