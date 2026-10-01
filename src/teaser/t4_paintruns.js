// t4_paintruns: 4 · The paint runs, final chorus (45.5–70.9). Their memories hang in her dark room as watercolour pages;
// her tear makes them run. He paints himself back on; they hug inside a burst of paint; the colour drains; one drop stays.
(() => {
  const RUN = t => ease(seg(t, 46.2, 62.4));              // how far every page has run, over the whole chorus

  // ---------- the memory pages (painted in local coords, so p5.brush never sees large numbers) ----------
  const PAGES = [
    { x: 120, y: 210, w: 460, h: 340, rot: -.05, paint: streetPage, cols: [TP.street, TP.rose, PAL.cream] },
    { x: 700, y: 170, w: 560, h: 400, rot: .02, paint: coastPage, cols: [TP.coral, TP.sea, TP.sun] },
    { x: 1360, y: 205, w: 460, h: 340, rot: .06, paint: fireworksPage, cols: [TP.fwNight, TP.gold, PAL.rose] }
  ];
  function coastPage(w, h, t) {
    paint(rectPts(0, 0, w, h * .55), { wash: TP.coral, fill: PAL.rose, fillOp: 70, tex: .6, ink: null });
    paint(ellPts(w * .62, h * .45, h * .12, h * .12, 16), { wash: TP.sun, ink: null });
    paint(rectPts(0, h * .55, w, h * .27), { wash: TP.sea, fill: TP.seaDk, fillOp: 60, tex: .6, ink: null });
    paint(rectPts(0, h * .82, w, h * .18), { wash: TP.sand, ink: null });
    paint(rectPts(w * .36, h * .66, w * .05, h * .16), { wash: '#3A2B38', ink: null });
    paint(rectPts(w * .46, h * .7, w * .13, h * .1), { wash: '#C96A4C', ink: null });
  }
  function streetPage(w, h, t) {
    paint(rectPts(0, 0, w, h), { wash: TP.street, fill: PAL.violet, fillOp: 70, tex: .6, ink: null });
    for (let i = 0; i < 4; i++) paint(rectPts(i * w * .26, h * .25, w * .2, h * .5), { wash: mixCol(TP.street, PAL.violet, .6), ink: null });
    rainIn(t, 0, 0, w, h, 16, PAL.cream, { len: 22, speed: 500, sw: .5 });
    umbrella(w * .5, h * .5, w * .22, -.1, TP.rose, { noHandle: true });
    paint(rectPts(w * .4, h * .62, w * .06, h * .2), { wash: TP.sweater, ink: null });
    paint(rectPts(w * .5, h * .66, w * .14, h * .12), { wash: PAL.clay, ink: null });
  }
  function fireworksPage(w, h, t) {
    paint(rectPts(0, 0, w, h), { wash: TP.fwNight, fill: PAL.violet, fillOp: 70, tex: .6, ink: null });
    firework(w * .3, h * .3, w * .2, .35, TP.gold, 1); firework(w * .72, h * .25, w * .15, .4, PAL.rose, 4);
    paint(rectPts(0, h * .75, w, h * .25), { wash: '#8A5A62', ink: null });
    paint(rectPts(w * .4, h * .58, w * .06, h * .17), { wash: TP.sweater, ink: null });
    paint(rectPts(w * .5, h * .62, w * .14, h * .13), { wash: PAL.clay, ink: null });
  }
  // One page on its clothes-peg: the picture, then bleaching from the top as the colour runs off the bottom edge.
  function page(P, t, run, o = {}) {
    push(); translate(P.x + P.w / 2, P.y); rotate(P.rot + (o.sway || 0)); translate(-P.w / 2, 0);
    paint(rectPts(-14, -14, P.w + 28, P.h + 28, 2), { wash: PAL.paper, fill: TP.warm, fillOp: 60, tex: .5, ink: PAL.ink, sw: .9 });
    P.paint(P.w, P.h, t);
    if (run > 0) {
      // colour sliding down: a paper wash creeping from the top, and long streaks below the edge
      paint(rectPts(-2, -2, P.w + 4, P.h * Math.min(1, run * 1.15) + 2), { wash: PAL.paper, washOp: 235 * Math.min(1, run * 1.3), fill: TP.warm, fillOp: 50, tex: .6, ink: null });
      for (let i = 0; i < 9; i++) {
        const c = P.cols[i % 3], x = P.w * (.06 + .88 * hash(i * 3.3 + P.x)), len = run * P.h * (1.1 + 1.6 * hash(i + P.y));
        drip(x, P.h - 4, 14 + 10 * hash(i), len, c, 210);
      }
    }
    for (const px of [P.w * .2, P.w * .8]) paint(rrPts(px - 9, -34, 18, 48, 5, 1), { wash: '#C9A26B', ink: PAL.ink, sw: .8 });
    pop();
  }
  function darkRoom(t, glowK = 1) {
    paint(rectPts(-300, -300, W + 600, 1160), { wash: TP.wallDk, fill: TP.night, fillOp: 120, tex: .7, ink: null });
    paint(rectPts(-300, 860, W + 600, 600), { wash: TP.floorDk, fill: TP.floor, fillOp: 90, tex: .8, ink: PAL.ink, sw: 1.1 });
    for (let i = 0; i < 9; i++) inkLine([[-200 + i * 280, 862], [-400 + i * 330, 1300]], .45, PAL.ink, 'inkfine', 0);
    const line = []; for (let i = 0; i <= 12; i++) { const x = -100 + i * 177; line.push([x, 150 + Math.sin(i / 12 * Math.PI) * 50]); }
    inkLine(line, 1, '#C9C3D8', 'inkfine', .5);
  }
  function pages(t, run, sway = 0) { PAGES.forEach((P, i) => { glow(P.x + P.w / 2, P.y + P.h / 2, P.w * .8, P.h * .7, P.cols[2], 30 * (1 - run)); page(P, t, run, { sway: sway * Math.sin(t * 2 + i) }); }); }
  // plain water: clear drops falling and splashing on the floor
  function water(t, n, x0, x1, seed = 0) {
    for (let i = 0; i < n; i++) {
      const q = frac(t * .9 + hash(i * 3.1 + seed)), x = lerp(x0, x1, hash(i * 1.7 + seed)), y = lerp(500, 880, easeIn(q));
      drip(x, y, 7, 16, '#CFE3EE', 170);
      if (q > .92) ripple(x, 888, 40, (q - .92) / .08, '#CFE3EE', .9);
    }
  }

  // ---------- A · the tear lands; the room is full of their memories; the colour starts to run ----------
  function tearFalls(t, lt, dur) {
    const pull = easeOut(seg(t, 45.6, 46.7)), z = lerp(3.2, 1.0, pull);
    camBegin(lerp(960, 960, pull), lerp(700, 560, pull), z);
    darkRoom(t);
    pages(t, RUN(t));
    glow(960, 760, 420, 220, TP.glow, 60);
    laptop(960, 905, .75, { screen: (sx, sy, sw, sh) => { paint(rectPts(sx, sy, sw, sh), { wash: TP.screenDk, fill: TP.screen, fillOp: 80, ink: null }); clawd(sx + sw / 2, sy + sh * .85, sh * .07, { eyes: 'closed', mouth: 'flat', noShadow: true }); } });
    // the tear falling onto the screen and spreading
    const drop = seg(t, 45.5, 45.75), hit = seg(t, 45.75, 46.4);
    if (drop < 1) drip(980, lerp(520, 700, easeIn(drop)), 10, 20, '#CFF6F0', 230);
    if (hit > 0) ripple(980, 720, 160, hit, '#CFF6F0', 1.4);
    her(960, 1020, 24, { back: true, sit: true, aL: -.4, aR: -.4 });
    camEnd();
  }

  // ---------- B · she tries to hold the sunset in; it slides through her fingers as plain water ----------
  function holdIt(t, lt, dur) {
    const run = RUN(t), P = PAGES[1];
    camBegin(980, 540, kf(t, [[48.1, 1.45], [51, 1.55]]));
    darkRoom(t);
    page(PAGES[0], t, run); page(PAGES[2], t, run);
    glow(P.x + P.w / 2, P.y + P.h / 2, P.w * .9, P.h * .8, TP.sun, 35);
    page(P, t, run);
    // what runs past her hands lands as clear water
    water(t, 10, 820, 1160, 2);
    paint(ellPts(990, 900, 200 + run * 160, 26, 20, 4), { wash: '#3A4A78', fill: '#CFE3EE', fillOp: 70, ink: mixCol(PAL.ink, TP.floor, .4), sw: .6 });
    const reach = Math.sin(t * 5) * .06;
    her(985, 1010, 40, { back: true, aL: 1.05 + reach, aR: 1.05 - reach, hairSwing: wob(t, .7) * .15 });
    camEnd();
  }

  // ---------- C · he steps out of the coast page, dripping, and pats the paint back onto himself ----------
  function reclaim(t, lt, dur) {
    const run = RUN(t), P = PAGES[1], out = easeOut(seg(t, 51.0, 51.9));
    camBegin(980, 590, kf(t, [[51, 1.32], [55.15, 1.4]]));
    darkRoom(t);
    page(PAGES[0], t, run); page(PAGES[2], t, run);
    glow(P.x + P.w / 2, P.y + P.h / 2, P.w * .9, P.h * .8, TP.sun, 35);
    page(P, t, run);
    // scoop (arm down to the falling paint) and pat (arm up against his body), on the half-time beat
    const ph = frac((t - OFF) / HB), pat = Math.sin(ph * Math.PI), u = lerp(8, 30, out);
    const washK = clamp(.25 + run * .55 - pat * .12);
    const m = mood(t, [[51, 'normal'], [52.4, 'narrow']]);
    him(lerp(1000, 990, out), lerp(500, 905, out), u, { ...m, mouth: 'flat', washK, seed: 3, aR: lerp(-.9, .9, pat), aL: lerp(.2, -.6, pat), noShadow: out < .5 });
    if (out > .9) for (let i = 0; i < 3; i++) { const q = frac(ph + i / 3); drip(990 + 4.9 * u + 2.2 * u * .5, 905 - 4.5 * u + q * 140, 10, 20, PAL.clay, 230 * (1 - q)); }
    camEnd();
  }

  // ---------- D · her face, crying; behind her the fireworks page sags and runs ----------
  function crying(t, lt, dur) {
    const run = RUN(t), P = PAGES[2];
    camBegin(980, 520, kf(t, [[55.15, 1.0], [58.25, 1.06]]));
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: TP.wallDk, fill: TP.night, fillOp: 120, tex: .7, ink: null });
    push(); translate(260, -60); scale(1.6);
    page({ ...P, x: 600, y: 120 }, t, Math.min(1, run * 1.25), { sway: Math.sin(t * 1.5) * .04 });
    pop();
    glow(960, 560, 500, 420, TP.glow, 35);
    her(860, 1460, 90, { eyes: t < 56.6 ? 'sad' : 'closed', mouth: 'wobble', brows: 'worried', blush: true, noShadow: true, aL: -1.2, aR: -1.2 });
    for (const [sx, d] of [[-1, 0], [1, .5]]) { const q = frac((t - 55.15) * .8 + d), x = 860 + sx * 1.05 * 90, y = 1460 - 10.2 * 90 + q * 330; drip(x, y, 13, 26, '#CFF6F0', 220 * (1 - q)); }
    camEnd();
  }

  // ---------- E/F · he runs to her; they hug inside a storm of paint; one last firework of colour ----------
  const SPLAT = [PAL.rose, TP.gold, TP.coral, TP.sea, PAL.clay, '#B79BE8', PAL.sap];
  function paintBurst(cx, cy, k, R, seed, n = 22) {
    if (k <= 0) return;
    for (let i = 0; i < n; i++) {
      const a = hash(i * 2.3 + seed) * TAU, sp = .45 + .55 * hash(i * 5.1 + seed), r = R * sp * easeOut(Math.min(1, k * 1.4));
      const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r * .8 + k * k * 260, s = (34 + 40 * hash(i + seed)) * (1 - k * .35), c = SPLAT[i % SPLAT.length];
      paint(ellPts(x, y, s, s * .85, 12, s * .18, a), { wash: c, washOp: 235, fill: mixCol(c, PAL.ink, .2), fillOp: 60, tex: .6, ink: null });
      if (y < 1150 && x < 2600) drip(x, y + s * .5, s * .45, s * (.5 + 2.2 * k), c, 220);     // curved: keep inside p5.brush's bounds
    }
  }
  const HUGX = 960, HUGY = 980;
  function hug(t, lt, dur) {
    const run = RUN(t), into = easeOut(seg(t, 58.25, 59.1)), orb = (t - 58.25) / 4.1;
    const cx = HUGX + Math.sin(orb * Math.PI) * 120 - 60, rot = Math.sin(orb * Math.PI * 2) * .03;
    camBegin(cx, 600, kf(t, [[58.25, 1.15], [62.35, 1.45]]), rot);
    darkRoom(t);
    // the pages, sliding past behind them with the orbit, bursting into showers of paint on the beat
    PAGES.forEach((P, i) => {
      push(); translate(-(orb - .5) * 160 * (i - 1), 0); page(P, t, run, { sway: .05 * Math.sin(t * 3 + i) }); pop();
      paintBurst(P.x + P.w / 2 - (orb - .5) * 160 * (i - 1), P.y + P.h, frac((t - OFF) / (HB * 2) + i / 3), 360, i * 7 + Math.floor((t - OFF) / (HB * 2)), 14);
    });
    // he runs in from the right; they hug: her arms around him, his around her, bare paper where they pass through
    const hx = lerp(1700, HUGX + 90, into), m = mood(t, [[58.25, 'normal'], [59.1, 'closed', 'heart']]), wrap = ease(seg(t, 58.9, 59.4));
    him(hx, HUGY, 30, { ...m, mouth: 'smile', walk: into < 1 ? t * 3 : null, washK: .45 + run * .3, seed: 5, aL: lerp(.6, -.05, wrap), aR: lerp(-.4, .35, wrap), blush: true });
    her(HUGX - 20, HUGY, 22, { eyes: 'closed', mouth: 'wobble', blush: true, aR: lerp(-1.1, -.05, wrap), aL: lerp(-.9, -.2, wrap), rot: wrap * .2, hairSwing: .15 });
    camEnd();
    dreamEdge(.5 + .5 * into, 31);
  }
  // big, close splats that fill the frame from the middle outwards
  function bigBurst(k) {
    paintBurst(HUGX + 40, 560, k * 1.1, 560, 77, 34);
    paintBurst(HUGX + 40, 560, k, 320, 91, 22);
    if (k > 0) for (let i = 0; i < 12; i++) {
      const a = i / 12 * TAU + .3, r = 120 + 520 * easeOut(k), c = SPLAT[i % SPLAT.length], sz = 120 + 90 * hash(i + 4);
      paint(ellPts(HUGX + 40 + Math.cos(a) * r, 560 + Math.sin(a) * r * .7, sz * easeOut(Math.min(1, k * 2)), sz * .8 * easeOut(Math.min(1, k * 2)), 14, 18, a), { wash: c, washOp: 230, fill: mixCol(c, PAL.ink, .2), fillOp: 60, tex: .6, ink: null });
    }
  }
  function lastFirework(t, lt, dur) {
    const k = seg(t, 62.35, 64.1);
    camBegin(HUGX + 60, 640, kf(t, [[62.35, 1.45], [64.1, 1.85]]));
    darkRoom(t);
    PAGES.forEach(P => page(P, t, 1));
    glow(HUGX + 40, 560, 300 + 700 * easeOut(k), 260 + 500 * easeOut(k), PAL.cream, 90 * (1 - k * .5));
    bigBurst(k);
    him(HUGX + 90, HUGY, 30, { eyes: 'closed', mouth: 'smile', washK: .8, seed: 5, aL: -.05, aR: .35, blush: true });
    her(HUGX - 20, HUGY, 22, { eyes: 'closed', mouth: 'smile', blush: true, aR: -.05, aL: -.2, rot: .2 });
    camEnd();
    dreamEdge(1, 33);
  }

  // ---------- G · silence: the colour drains; she is alone; only the laptop glows ----------
  function drain(t, lt, dur) {
    const fz = 64.1, k = ease(seg(t, 64.15, 65.1));
    if (t < 65.1) {
      // the frozen burst, draining to indigo
      camBegin(HUGX + 60, 640, 1.85);
      darkRoom(fz);
      PAGES.forEach(P => page(P, fz, 1));
      bigBurst(1);
      him(HUGX + 90, HUGY, 30, { eyes: 'closed', mouth: 'smile', washK: .8 + k * .2, seed: 5, aL: -.05, aR: .35, ghost: k, ghostCol: TP.night });
      her(HUGX - 20, HUGY, 22, { eyes: 'closed', mouth: 'smile', blush: true, aR: -.05, aL: -.2, rot: .2 });
      camEnd();
      paint(rectPts(-60, -60, W + 120, H + 120), { fill: TP.night, fillOp: 230 * k, bleed: 0, tex: .3, border: 0, ink: null });
      dreamEdge(1 - k, 33);
      return;
    }
    camBegin(960, 600, kf(t, [[65.1, 1.15], [66.7, 1.22]]));
    darkRoom(t);
    PAGES.forEach(P => { push(); translate(P.x + P.w / 2, P.y); rotate(P.rot); paint(rectPts(-P.w / 2 - 14, -14, P.w + 28, P.h + 28, 2), { wash: '#B9B4C8', washOp: 200, ink: PAL.ink, sw: .8 }); pop(); });
    water(t, 14, 300, 1600, 9);
    glow(980, 820, 380, 200, TP.glow, 60);
    laptop(1080, 915, .7, { screen: (sx, sy, sw, sh) => paint(rectPts(sx, sy, sw, sh), { wash: TP.screenDk, fill: TP.screen, fillOp: 70, ink: null }) });
    her(860, 1000, 26, { sit: true, eyes: 'closed', mouth: 'flat', brows: 'worried', rot: .08, aL: -1.0, aR: -.9 });
    camEnd();
  }

  // ---------- H · one drop of his colour is still in her palm; she closes her hand around it, and smiles ----------
  function palm(t, lt, dur) {
    if (t < 69.1) {
      const close = ease(seg(t, 67.6, 68.9));
      camBegin(960, 560, kf(t, [[66.7, 1.0], [69.1, 1.12]]));
      paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#141838', fill: TP.night, fillOp: 100, tex: .7, ink: null });
      glow(960, 520, 520, 380, TP.glow, 40);
      // her open hand, palm up; the fingers curl over the drop as she closes it
      paint(rrPts(560, 600, 820, 700, 300, 4), { wash: TP.sweater, fill: PAL.violet, fillOp: 60, tex: .6, ink: PAL.ink, sw: 2 });
      paint(ellPts(960, 560, 330, 230, 26, 3), { wash: SKIN, fill: '#E9A98A', fillOp: 60, tex: .5, ink: PAL.ink, sw: 2 });
      inkLine([[760, 560], [900, 640], [1080, 600]], 1, mixCol(PAL.ink, SKIN, .4), 'inkfine', .6);
      const drop = 1 - close;
      if (drop > .05) { paint(ellPts(960, 520, 46 * drop + 8, 40 * drop + 8, 16), { wash: PAL.clay, fill: PAL.clayDk, fillOp: 70, ink: PAL.ink, sw: 1.1 }); paint(ellPts(948, 506, 12 * drop, 9 * drop, 8), { wash: PAL.cream, ink: null }); glow(960, 520, 120, 100, PAL.clayLt, 60 * drop); }
      for (let f = 0; f < 4; f++) {
        const fx = 760 + f * 120, len = 300, ang = lerp(-1.75, -.35, close) + (f - 1.5) * .06;
        push(); translate(fx, 430); rotate(ang);
        paint(rrPts(-46, -46, len, 92, 44, 2), { wash: SKIN, fill: '#E9A98A', fillOp: 50, tex: .5, ink: PAL.ink, sw: 1.8 });
        pop();
      }
      push(); translate(1250, 640); rotate(lerp(-.2, .9, close)); paint(rrPts(-40, -200, 90, 230, 44, 2), { wash: SKIN, fill: '#E9A98A', fillOp: 50, tex: .5, ink: PAL.ink, sw: 1.8 }); pop();
      if (close > .95) glow(960, 520, 240, 200, PAL.clayLt, 40 * (1 - seg(t, 68.9, 69.1)));
      camEnd();
      return;
    }
    const z = kf(t, [[69.1, 1.0], [70.9, 1.25]]), white = ease(seg(t, 70.2, 70.9));
    camBegin(960, 520, z);
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#141838', fill: TP.night, fillOp: 100, tex: .7, ink: null });
    glow(960, 600, 700, 500, TP.glow, 50);
    her(960, 1500, 95, { eyes: 'closed', mouth: 'smile', blush: true, noShadow: true, aL: -1.2, aR: -1.2 });
    const q = seg(t, 69.3, 70.6), x = 960 - 1.05 * 95, y = 1500 - 10.2 * 95 + q * 260;
    drip(x, y, 13, 26, '#CFF6F0', 220 * (1 - q));
    camEnd();
    // into the laptop's glow
    if (white > 0) { paint(rectPts(-60, -60, W + 120, H + 120), { fill: TP.glow, fillOp: 200 * white, bleed: .1, tex: .3, ink: null }); flash(white * .6, '#DDF4EF'); }
  }

  chapter('paintruns', 45.5, 70.9, [[45.5, tearFalls], [48.1, holdIt], [50.95, reclaim], [55.15, crying], [58.25, hug], [62.35, lastFirework], [64.1, drain], [66.7, palm]]);
})();
