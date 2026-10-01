// t2_paintings: 2 · Everyday paintings, chorus 1 (18.6–33.6). The room melts into rain; one rose umbrella; a crowd that
// walks straight through him; one pair of earphones on a rooftop; fireworks, and a selfie that only shows her.
(() => {
  const DOWN = barT(5);                                  // 20.0: the chorus downbeat

  // ---------- A · her hand takes his; the walls melt into rain ----------
  function touch(t, lt, dur) {
    const melt = ease(seg(t, 19.15, 20.0)), meet = easeOut(seg(t, 18.6, 19.15));
    camBegin(960, 540, kf(t, [[18.6, 1.05], [20, 1.15]]));
    // behind the wall: the rainy night that is waiting
    paint(rectPts(-200, -200, W + 400, H + 400), { wash: TP.street, fill: PAL.violet, fillOp: 90, tex: .7, ink: null });
    if (melt > 0) rainIn(t, -100, -100, W + 200, H + 200, 70, mixCol(TP.glow, PAL.cream, .4), { len: 50, speed: 1300, sw: .7 });
    // the warm wall in vertical strips that run down and thin out like wet paint
    for (let i = 0; i < 14; i++) {
      const x0 = -120 + i * 160, w = 175, d = melt * (900 + 600 * hash(i * 3.1)), th = 1 - melt * (.55 + .4 * hash(i));
      const top = -200 + d, bot = H + 200 + d * .4, cx = x0 + w / 2, ww = w * th;
      if (top > H + 100) continue;
      paint([[cx - ww / 2, top], [cx + ww / 2, top], [cx + ww / 2, bot], [cx + ww * .1, bot + 60 * melt], [cx - ww / 2, bot]],
        { wash: mixCol('#D9A88A', '#E6B98F', hash(i)), washOp: 255, fill: '#B9806A', fillOp: 60, tex: .6, border: .4, ink: null });
      if (melt > 0) drip(cx + (hash(i + 7) - .5) * ww * .6, top - 10, 18 * th, 80 + 200 * melt * hash(i + 2), '#D9A88A');
    }
    // the hands: her fingers close around the tip of his stubby arm
    const hx = lerp(-260, 860, meet), cx = lerp(2160, 1000, meet), sq = seg(t, 19.15, 19.45);
    push(); translate(cx, 560); rotate(-.08);
    paint(rrPts(0, -70, 900, 140, 20, 4), { wash: PAL.clay, fill: PAL.clayDk, fillOp: 60, tex: .6, ink: PAL.ink, sw: 2.2 });
    pop();
    push(); translate(hx, 610); rotate(-.12);
    paint(rrPts(-700, -80, 560, 170, 60, 4), { wash: TP.sweater, fill: PAL.violet, fillOp: 60, tex: .6, ink: PAL.ink, sw: 2 });
    paint(rrPts(-170, -78, 210, 150, 60, 3), { wash: SKIN, fill: '#E9A98A', fillOp: 50, tex: .5, ink: PAL.ink, sw: 2 });
    // fingers wrap over the top of his arm once they touch
    for (let f = 0; f < 4; f++) {
      const curl = sq, fy = -60 + f * 34;
      paint(rrPts(20, fy - 6 - curl * 40, 150 - curl * 60, 32, 15, 2), { wash: SKIN, fill: '#E9A98A', fillOp: 40, tex: .5, ink: PAL.ink, sw: 1.6 });
    }
    pop();
    if (sq > 0) emote('heart', 1010, 400, 22, seg(t, 19.2, 19.6) * (1 - seg(t, 19.8, 20)));
    camEnd();
    dreamEdge(lerp(.8, 1, melt), 2);
  }

  // ---------- B · one rose umbrella on a rainy street, tracking alongside ----------
  const UX = 960;
  function street(t, scroll) {
    paint(rectPts(-200, -200, W + 400, 1100), { wash: TP.street, fill: PAL.violet, fillOp: 100, tex: .7, ink: null });
    for (let i = 0; i < 9; i++) {                        // far buildings, slow parallax
      const x = ((i * 300 - scroll * .3) % 2700 + 2700) % 2700 - 400, h = 260 + hash(i * 4) * 300;
      paint(rectPts(x, 780 - h, 250, h + 20, 4), { wash: mixCol(TP.street, PAL.violet, .5 + .3 * hash(i)), ink: null });
      for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) if (hash(i * 31 + r * 7 + c) > .45)
        paint(rectPts(x + 30 + c * 70, 780 - h + 40 + r * 60, 34, 34, 2), { wash: hash(i + r + c) > .5 ? TP.lamp : PAL.rose, washOp: 170, ink: null });
    }
    paint(rectPts(-200, 780, W + 400, 420), { wash: '#3B3F78', fill: TP.street, fillOp: 90, tex: .7, ink: null });
    inkLine([[-200, 790], [W + 200, 790]], 1.2, PAL.ink, 'ink', 0);
    for (let i = 0; i < 4; i++) {                        // street lamps with warm cones and long wet reflections
      const x = ((i * 640 - scroll) % 2560 + 2560) % 2560 - 300;
      paint([[x - 8, 790], [x + 8, 790], [x + 8, 300], [x - 8, 300]], { wash: '#2A2A4A', ink: PAL.ink, sw: .8 });
      paint(ellPts(x, 290, 26, 18, 12), { wash: TP.lamp, ink: PAL.ink, sw: .8 });
      paint([[x - 30, 300], [x + 30, 300], [x + 170, 790], [x - 170, 790]], { fill: TP.lamp, fillOp: 45, bleed: .1, tex: .3, border: .1, ink: null });
      paint([[x - 20, 800], [x + 20, 800], [x + 34, 1080], [x - 34, 1080]], { fill: TP.lamp, fillOp: 60, bleed: .2, tex: .5, ink: null });
    }
    for (let i = 0; i < 5; i++) {                        // puddles drift by
      const x = ((i * 520 + 200 - scroll) % 2600 + 2600) % 2600 - 300, y = 900 + hash(i) * 120;
      paint(ellPts(x, y, 120 + hash(i + 3) * 60, 22, 18, 3), { wash: '#2A2E62', fill: TP.glow, fillOp: 40, ink: mixCol(PAL.ink, TP.street, .4), sw: .6 });
    }
  }
  function umbrellaWalk(t, lt, dur) {
    const scroll = (t - 20) * 230, tilt = kf(t, [[20, -.28], [21.3, -.28], [21.8, .14], [22.3, 0]], ease);
    const shift = kf(t, [[20, -70], [21.3, -70], [21.8, 40], [22.3, 0]]);
    camBegin(960 + Math.sin(t * .8) * 10, 560, kf(t, [[20, 1.05], [22.7, 1.12]]));
    street(t, scroll);
    rainIn(t, -100, -100, W + 200, H + 200, 90, mixCol(TP.glow, PAL.cream, .3), { len: 46, speed: 1400, sw: .6 });
    const hx = 800, cx = 1090, gy = 905, u = 25, s = 16.5, ph = (t - 20) / HB;
    // splashes at their feet on every half-time beat
    for (let k = 0; k < 2; k++) { const age = frac((t - OFF) / HB); if (age < .5) for (const fx of [hx, cx]) ripple(fx + (k ? 40 : -40), gy + 8, 70, age * 2, mixCol(TP.glow, PAL.cream, .4), 1.2); }
    const laugh = t > 21.85, hm = mood(t, [[20, 'look'], [21.15, 'wide', '!'], [21.85, 'closed']]);
    her(hx, gy, s, { ...hm, lookX: 1, lookY: -.6, walk: ph * .5, mouth: laugh ? 'grin' : 'smile', blush: true, aR: kf(t, [[21.2, -1.1], [21.4, .9], [21.9, .9], [22.2, -1.1]]), aL: -1.1 });
    const cm = mood(t, [[20, 'happy'], [20.55, 'happy', 'sweat'], [21.85, 'happy', 'music']]);
    const aL = 1.15 + tilt * .5;
    him(cx, gy, u, { ...cm, walk: ph * .5, aL, aR: .1, blush: laugh, mouth: laugh ? 'grin' : 'smile' });
    // the umbrella in his near hand: tilted over her at first, so rain drips on his head
    const pivX = cx - 4.9 * u, pivY = gy - 4.5 * u, tipX = pivX - 2.2 * u * Math.cos(aL), tipY = pivY - 2.2 * u * Math.sin(aL);
    umbrella(tipX + shift + 20, tipY - 210, 250, tilt, TP.rose);
    if (t < 21.8) for (let i = 0; i < 6; i++) { const q = frac(t * 1.6 + i / 6); drip(cx + 20 + i * 18, gy - 8 * u - 160 + q * 150, 9, 18, mixCol(TP.glow, PAL.cream, .4), 200); }
    camEnd();
    dreamEdge(1, 5);
  }

  // ---------- C · from above: a grey crowd streams past; one walks straight through him ----------
  const WALKERS = [[360, 1, 100], [420, -1, 500], [500, 1, -700], [560, -1, 1100], [640, 1, 300], [700, -1, -200], [780, 1, -300, true], [860, -1, 1500],
    [930, 1, -900], [1000, -1, 700], [1060, 1, 600]];
  function crowd(t, lt, dur) {
    camBegin(960, 560, kf(t, [[22.7, 1.18], [26, 1.0]]));
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: TP.street, fill: PAL.indigo, fillOp: 110, tex: .8, ink: null });
    for (let i = 0; i < 9; i++) paint([[-300 + i * 300, 260], [-160 + i * 300, 260], [-60 + i * 380 - 300, 1400], [-260 + i * 380 - 300, 1400]], { wash: '#454A82', washOp: 170, ink: null });   // crosswalk
    for (let i = 0; i < 7; i++) paint(ellPts(150 + hash(i * 9) * 1600, 320 + hash(i * 5) * 760, 170, 46, 16, 4), { wash: '#262A58', fill: TP.lamp, fillOp: 40, ink: null });
    for (let i = 0; i < 4; i++) glow(200 + i * 520, 420 + (i % 2) * 400, 160, 60, TP.lamp, 40);
    rainIn(t, -200, -200, W + 400, H + 400, 70, mixCol(TP.glow, PAL.cream, .3), { len: 34, speed: 1100, sw: .5 });
    const CY = 790, CX = 1060, u = 21, s = 14;
    const draw = filter => WALKERS.forEach(([y, dir, x0, through], i) => {
      if (!filter(y, through)) return;
      const sc = .95 + .85 * (y - 360) / 700, x = through ? lerp(-150, 2100, seg(t, 22.7, 25.4)) : x0 + dir * (t - 22.7) * 330 + (dir < 0 ? 1800 : 0);
      passerby(x, y, sc, (t - 22.7) * 1.6 + i * .3, i, dir > 0 ? TP.grey : '#9A9CB4');
    });
    draw((y, th) => y < CY && !th);
    // he goes see-through, like wet paint, while the stranger passes through him
    const thx = lerp(-150, 2100, seg(t, 22.7, 25.4)), ghost = clamp(1 - Math.abs(thx - CX) / 260);
    const hm = mood(t, [[22.7, 'look'], [24.1, 'look', '?'], [25.0, 'closed']]);
    her(CX - 250, CY, s, { ...hm, lookX: 1, lookY: -.5, brows: t > 24.1 && t < 25 ? 'worried' : null, mouth: t > 24.1 && t < 25 ? 'flat' : 'smile', blush: true, aL: -1.1, aR: -1.1 });
    const cm = mood(t, [[22.7, 'happy'], [24.6, 'normal'], [25.0, 'happy', 'music']]);
    const shrug = Math.sin(seg(t, 24.7, 25.3) * Math.PI);
    him(CX, CY, u, { ...cm, aL: 1.2 - .4 * shrug, aR: .2 + 1.1 * shrug, ghost: ghost * .85, ghostCol: TP.street, mouth: 'grin' });
    umbrella(CX - 140, CY - 350, 230, -.1, TP.rose);
    draw((y, th) => y >= CY || th);
    // nobody looks; she does
    camEnd();
    // out: grey umbrellas close in from every side until the street is gone
    const close = easeIn(seg(t, 25.35, 26.0));
    if (close > 0) for (let i = 0; i < 12; i++) {
      const a = i / 12 * TAU + .2, r = lerp(1400, 260, close);
      paint(ellPts(960 + Math.cos(a) * r, 540 + Math.sin(a) * r * .7, 520, 420, 20, 6), { wash: TP.greyDk, fill: '#3A3C55', fillOp: 120, ink: PAL.ink, sw: 1.2 });
    }
    if (close > .9) flash((close - .9) * 10, PAL.ink);
    dreamEdge(1, 7);
  }

  // ---------- D/E · the rooftop: earphones, then fireworks and a selfie ----------
  const FW = [[28.35, 1480, 260, PAL.ochre], [28.9, 430, 220, PAL.rose], [29.6, 1250, 170, TP.gold], [30.2, 700, 150, '#B79BE8'], [30.75, 1600, 330, TP.gold],
    [31.3, 300, 280, PAL.rose], [31.9, 1350, 220, '#B79BE8'], [32.4, 900, 160, PAL.ochre], [32.9, 1550, 240, PAL.rose]];
  function rooftopSet(t) {
    paint(rectPts(-300, -300, W + 600, 1100), { wash: TP.fwNight, fill: PAL.violet, fillOp: 110, tex: .7, ink: null });
    for (let i = 0; i < 18; i++) paint(starPts(hash(i * 3) * W, hash(i * 7) * 420, 4 + 4 * hash(i), .4, 4), { wash: PAL.cream, washOp: 150 + 100 * Math.sin(t * 3 + i), ink: null });
    FW.forEach(([t0, x, y, c], i) => firework(x, y, 190, (t - t0) / 1.6, c, i));
    for (let i = 0; i < 11; i++) {                       // skyline
      const x = -200 + i * 210, h = 120 + hash(i * 5) * 220;
      paint(rectPts(x, 760 - h, 200, h + 20, 3), { wash: mixCol(TP.fwNight, PAL.indigo, .6), ink: null });
      for (let r = 0; r < 3; r++) if (hash(i * 13 + r) > .4) paint(rectPts(x + 30 + r * 50, 790 - h, 26, 26, 2), { wash: TP.lamp, washOp: 160, ink: null });
    }
    // string lights in two sagging rows, twinkling on the beat
    for (const [y0, sag] of [[90, 120], [170, 90]]) {
      const pts = []; for (let i = 0; i <= 20; i++) { const x = -100 + i * 106; pts.push([x, y0 + Math.sin(i / 20 * Math.PI) * sag]); }
      inkLine(pts, .8, PAL.ink, 'inkfine', .5);
      pts.forEach(([x, y], i) => { if (i % 2) return; const on = .6 + .4 * hpulse(t + i * .1, 3); glow(x, y + 12, 26, 22, TP.lamp, 90 * on); paint(ellPts(x, y + 12, 8, 10, 8), { wash: TP.lamp, ink: PAL.ink, sw: .5 }); });
    }
    paint(rectPts(-300, 760, W + 600, 140, 3), { wash: '#8A5A62', fill: '#5A3846', fillOp: 70, tex: .8, ink: PAL.ink, sw: 1.2 });      // parapet
    for (let i = 0; i < 16; i++) inkLine([[-200 + i * 140, 760], [-200 + i * 140, 900]], .5, '#5A3846', 'inkfine', 0);
    paint(rectPts(-300, 900, W + 600, 400, 3), { wash: '#3A2E50', fill: TP.fwNight, fillOp: 60, tex: .7, ink: null });
  }
  const HX = 820, CX2 = 1110, GY2 = 790, HS = 18, CU = 25;
  function couple(t, o = {}) {
    const nod = -.18 * hpulse(t, 6);
    her(HX, GY2, HS, { sit: true, dy: nod, lookX: .8, blush: true, eyes: 'closed', mouth: 'smile', aL: -1.1, aR: -.9, ...o.her });
    him(CX2, GY2, CU, { dy: nod * 1.2, eyes: 'happy', mouth: 'smile', aL: -.2, aR: .2, blush: true, ...o.him });
  }
  function earphones(t, lt, dur) {
    camBegin(960, kf(t, [[26, 520], [29.5, 560]]), kf(t, [[26, 1.0], [29.5, 1.14]]));
    rooftopSet(t);
    couple(t);
    // one pair of earphones: a bud in her ear, a bud on his side, one wire looping between them
    const ex = HX + 2.3 * HS, ey = GY2 - 10.4 * HS - .18 * hpulse(t, 6) * HS, bx = CX2 - 5.1 * CU, by = GY2 - 6.4 * CU - .18 * hpulse(t, 6) * CU * 1.2;
    inkLine([[ex, ey], [ex + 30, ey + 110], [(ex + bx) / 2, GY2 - 20], [bx - 30, by + 100], [bx, by]], 1.6, '#F4F1EA', 'ink', .7);
    for (const [x, y] of [[ex, ey], [bx, by]]) paint(ellPts(x, y, 9, 9, 10), { wash: '#F4F1EA', ink: PAL.ink, sw: .6 });
    for (let i = 0; i < 4; i++) { const q = frac((t - 26) / 1.8 + i / 4); emote('music', (ex + bx) / 2 + Math.sin(q * 5 + i) * 60, GY2 - 60 - q * 340, 13, Math.min(1, (1 - q) * 3)); }
    camEnd();
    dreamEdge(1, 9);
  }
  // her phone: o.photo paints the screen (world rect), else a dark glass
  function phone(x, y, w, h, rot, o = {}) {
    push(); translate(x, y); rotate(rot);
    paint(rrPts(-w / 2, -h / 2, w, h, w * .14, 2), { wash: '#2E2F45', ink: PAL.ink, sw: 1.4 });
    pop();
  }
  function selfie(t, lt, dur) {
    camBegin(kf(t, [[29.5, 960], [31.4, 950]]), 610, kf(t, [[29.5, 1.75], [31.4, 1.9]]));
    rooftopSet(t);
    const up = easeOut(seg(t, 29.6, 30.2)), lean = ease(seg(t, 29.9, 30.5));
    // the phone goes up in her outer hand, away from him, so it isn't hidden behind his body
    couple(t, { her: { aL: lerp(-1.1, .5, up), aR: -.9, rot: lean * .12, eyes: 'closed', mouth: 'grin', handL: (s, sw) => { push(); rotate(-1.0); paint(rrPts(-1.2 * s, -4.6 * s, 2.6 * s, 4.6 * s, .5 * s, 1), { wash: '#3A3C58', fill: TP.glow, fillOp: 50, ink: PAL.ink, sw: sw * .7 }); pop(); } },
      him: { rot: -lean * .1, dy: -.1 * lean, eyes: t > 30.9 && t < 31.1 ? 'closed' : 'happy', mouth: 'grin', aL: lerp(-.2, .9, lean) } });
    camEnd();
    flash(Math.exp(-Math.max(0, t - barT(8)) * 6) * (t >= barT(8) ? 1 : 0), '#FFF8EC');
    dreamEdge(1, 11);
  }
  // close on the phone: the photo shows only her under the fireworks. She hasn't looked at it; she's looking at him.
  function photo(t, lt, dur) {
    const z = kf(t, [[31.4, 1], [33.6, 1.22]]);
    camBegin(960, 560, z);
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#141238', fill: TP.fwNight, fillOp: 90, tex: .7, ink: null });
    for (let i = 0; i < 16; i++) glow(hash(i * 3) * W, hash(i * 7) * H, 70 + 60 * hash(i), 70 + 60 * hash(i), [TP.lamp, PAL.rose, TP.gold][i % 3], 50 + 30 * Math.sin(t * 2 + i));
    // the phone, big, in her hand
    const dim = ease(seg(t, 32.85, 33.15)), sunset = ease(seg(t, 33.2, 33.6));
    const px = 960, py = 560, pw = 560, ph = 900;
    push(); translate(px, py); rotate(-.06);
    paint(rrPts(-pw / 2 - 34, -ph / 2 - 34, pw + 68, ph + 68, 80, 3), { wash: '#C9CCDD', fill: '#8E90A8', fillOp: 70, tex: .5, ink: PAL.ink, sw: 2.2 });
    paint(rrPts(-pw / 2 - 16, -ph / 2 - 16, pw + 32, ph + 32, 62, 3), { wash: '#1C1D2E', ink: null });
    pop();
    const sx = px - pw / 2, sy = py - ph / 2;
    // the photo: violet sky, a golden burst, and her, alone, smiling at the empty space beside her
    paint(rectPts(sx, sy, pw, ph, 2), { wash: TP.fwNight, fill: PAL.violet, fillOp: 100, tex: .6, ink: null });
    firework(sx + pw * .35, sy + ph * .25, 170, .35, TP.gold, 3);
    firework(sx + pw * .75, sy + ph * .18, 110, .4, PAL.rose, 5);
    paint(rectPts(sx, sy + ph * .72, pw, ph * .28, 2), { wash: '#8A5A62', ink: null });
    her(sx + pw * .36, sy + ph * .98, 30, { sit: true, eyes: 'closed', mouth: 'grin', blush: true, lookX: .8, aR: 1.25, aL: -1.1, noShadow: true });
    paint(rectPts(sx, sy, pw, ph, 2), { wash: '#0B0F22', washOp: 230 * dim * (1 - sunset), ink: null });
    if (sunset > 0) { paint(rectPts(sx, sy, pw, ph, 2), { wash: TP.coral, washOp: 255 * sunset, fill: TP.sun, fillOp: 120 * sunset, tex: .6, ink: null }); glow(px, py, 600 * sunset, 500 * sunset, TP.sun, 80 * sunset); }
    // her thumb on the edge of the phone
    push(); translate(px - pw / 2 - 30, py + 260); rotate(.3);
    paint(rrPts(-60, -40, 130, 80, 38, 2), { wash: SKIN, fill: '#E9A98A', fillOp: 50, ink: PAL.ink, sw: 1.6 });
    pop();
    camEnd();
    dreamEdge(lerp(1, .6, sunset), 13);
  }

  chapter('paintings', 18.6, 33.6, [[18.6, touch], [DOWN, umbrellaWalk], [22.7, crowd], [26.0, earphones], [29.5, selfie], [31.4, photo]]);
})();
