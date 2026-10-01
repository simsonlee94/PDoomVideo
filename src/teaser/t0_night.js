// t0_night: 0 · 3 a.m. (0–6.1). She lies awake, sits up, opens the laptop and types the question.
(() => {
  const Q1 = '如果有一个人，是我最想遇见的样子', Q2 = '……', Q3 = '他会是什么样？';
  const QS = Q1 + Q2 + Q3;
  const SEND = barT(1);                                  // 5.45: Enter on the downbeat

  function lyingAwake(t, lt, dur) {
    const up = ease(seg(t, 1.55, 2.45)), th = lerp(-Math.PI / 2, -.08, up), hip = [540, 640];
    const zoom = kf(t, [[0, 1.3], [2.7, 1.5]]), cx = kf(t, [[0, 700], [2.7, 640]]), cy = kf(t, [[0, 470], [2.7, 520]]);
    camBegin(cx, cy, zoom);
    bedroomSet(t);
    // the closed laptop waits on the blanket beside her; its charging light breathes
    paint(rrPts(700, 586, 170, 18, 7, 1), { wash: '#A3A6BE', fill: '#6E718C', fillOp: 60, ink: PAL.ink, sw: 1 });
    inkLine([[706, 596], [864, 596]], .5, '#5D6079', 'inkfine', 0);
    const led = .4 + .6 * hpulse(t, 3);
    paint(ellPts(858, 600, 3.5, 3, 8), { wash: TP.glow, washOp: 255 * led, ink: null });
    glow(858, 600, 16, 12, TP.glow, 110 * led);
    const sigh = seg(t, 1.0, 1.5);
    const m = mood(t, [[0, 'dot'], [1.05, 'closed'], [1.45, 'look']]);
    herInBed(hip, 30, th, { ...m, eyes: m.eyes === 'look' ? 'look' : m.eyes, lookX: up > .3 ? .9 : .9, lookY: up > .3 ? .3 : 0,
      mouth: sigh > 0 && sigh < 1 ? 'o' : 'flat', brows: 'worried', sq: Math.sin(sigh * Math.PI) * .05,
      aR: kf(t, [[1.9, -1.25], [2.6, -.15]], easeOut), aL: -1.2, hairSwing: up * -.3 });
    if (sigh > 0 && sigh < 1) {                                       // a little sigh curl drifting off her mouth
      const sx = 540 - 230 * (1 - up), sy = 640 - 260 * up;
      inkLine([[sx - 40, sy - 20 - sigh * 30], [sx - 60, sy - 40 - sigh * 40], [sx - 40, sy - 58 - sigh * 46]], .8 * (1 - sigh), PAL.cream, 'inkfine', .6);
    }
    // the blanket slides down to her lap as she sits up
    blanket(330, 1080, 720, x => {
      const body = x < 720 ? lerp(588, 606, up) - Math.sin(clamp((x - 330) / 390) * Math.PI) * lerp(18, 6, up) : 650 - Math.sin((x - 720) / 360 * Math.PI) * 22;
      return body + Math.sin(x * .02) * 4;
    });
    camEnd();
    // a night grade over everything but the moonlit bits, then the fade up from black
    paint(rectPts(-60, -60, W + 120, H + 120), { fill: TP.night, fillOp: 70, bleed: 0, tex: .2, border: 0, ink: null });
    flash(1 - ease(seg(t, 0, 1.3)), PAL.ink);
  }

  // Over her shoulder: the laptop on her lap opens, the chat app glows, she types the question and sends it.
  function promptScreen(t, sx, sy, sw, sh) {
    paint(rectPts(sx, sy, sw, sh, 1), { wash: TP.screenDk, fill: TP.screen, fillOp: 70, tex: .4, ink: null });
    // a tiny smiling logo mark above the box (the app's empty "new chat" page)
    const sent = seg(t, SEND, SEND + .35), fs = sh * .075;
    if (sent < 1) {
      const by = sy + sh * .42, bh = sh * .26, bx = sx + sw * .1, bw = sw * .8;
      paint(starPts(sx + sw / 2, by - sh * .12, sh * .05, .45, 4), { wash: PAL.clayLt, washOp: 255 * (1 - sent), ink: null });
      paint(rrPts(bx, by, bw, bh, bh * .25, 1), { wash: '#EAF5F2', washOp: 240 * (1 - sent), ink: PAL.ink, sw: .8 });
      // typed so far (two lines), with a hesitation at the ellipsis
      const n1 = Math.floor(clamp((t - 3.45) / 1.0) * [...Q1].length), n2 = t > 4.5 ? (t > 4.62 ? 2 : 1) : 0, n3 = Math.floor(clamp((t - 4.95) / .36) * [...Q3].length);
      const l1 = [...Q1].slice(0, n1).join(''), l2 = Q2.slice(0, n2) + [...Q3].slice(0, n3).join('');
      if (sent <= 0) {
        if (l1) letter(l1, bx + fs * .7, by + bh * .32, fs, PAL.ink, { font: BF(fs), align: 'left', ink: false });
        if (l2) letter(l2, bx + fs * .7, by + bh * .72, fs, PAL.ink, { font: BF(fs), align: 'left', ink: false });
        const onL2 = n2 > 0, cxx = bx + fs * .7 + (onL2 ? [...l2].length : [...l1].length) * fs + 4, cyy = by + bh * (onL2 ? .72 : .32);
        if (frac((t - OFF) / HB) < .55 || (t > 3.45 && t < 5.3 && !(t > 4.62 && t < 4.95))) inkLine([[cxx, cyy - fs * .55], [cxx, cyy + fs * .55]], 1.4, PAL.ink, 'ink', 0);
      }
    }
    if (sent > 0) {
      // the question lifts into a sent bubble near the top
      const k = backOut(sent), bw = sw * .78, bh = fs * 3.2, bx = sx + sw * .96 - bw, by = lerp(sy + sh * .42, sy + sh * .12, k);
      paint(rrPts(bx, by, bw, bh, fs * .7, 1), { wash: '#F6E6C8', ink: PAL.ink, sw: .8 });
      letter(Q1, bx + fs * .6, by + fs * 1.05, fs * .9, PAL.ink, { font: BF(fs * .9), align: 'left', ink: false });
      letter(Q2 + Q3, bx + fs * .6, by + fs * 2.2, fs * .9, PAL.ink, { font: BF(fs * .9), align: 'left', ink: false });
      // the reply box below, empty, its cursor about to become a drop of ink
      const rb = sy + sh * .7, rk = seg(t, 5.85, 6.1);
      paint(rrPts(sx + sw * .06, rb, sw * .88, sh * .14, sh * .05, 1), { wash: '#EAF5F2', washOp: 235, ink: PAL.ink, sw: .7 });
      const cx = sx + sw * .06 + fs * .8, cy = rb + sh * .07;
      if (rk > 0) paint(ellPts(cx, cy, 4 + rk * 9, 4 + rk * 11, 12), { wash: PAL.ink, ink: null });
      else if (frac((t - OFF) / HB) < .55) inkLine([[cx, cy - fs * .5], [cx, cy + fs * .5]], 1.4, PAL.ink, 'ink', 0);
    }
  }

  function typing(t, lt, dur) {
    const open = easeOut(seg(t, 2.7, 3.2)), bright = ease(seg(t, 3.0, 3.45));
    const zoom = kf(t, [[2.7, 1.0], [6.1, 1.09]]), cx = kf(t, [[2.7, 1000], [6.1, 1030]]);
    camBegin(cx, 520, zoom);
    paint(rectPts(-200, -200, W + 400, H + 400), { wash: TP.wallDk, fill: TP.night, fillOp: 120, tex: .6, ink: null });
    roomWindow(t, -260, 60, 420, 420, { drops: 20 });
    // blanket hills in the foreground and the laptop resting on them
    paint([[-200, 930], [500, 900], [1300, 915], [W + 200, 900], [W + 200, H + 300], [-200, H + 300]], { wash: TP.blanket, fill: PAL.indigo, fillOp: 90, tex: .7, ink: PAL.ink, sw: 1.2, curv: .5 });
    glow(1080, 560, 640 * bright, 420 * bright, TP.glow, 45);
    laptop(1080, 930, 2.15, { open: lerp(.12, 1, open), bright, screen: (sx, sy, sw, sh) => promptScreen(t, sx, sy, sw, sh) });
    // her, from behind: long hair and a shoulder in the lower left, rim-lit by the screen
    her(300, 1460, 68, { back: true, noShadow: true, aL: -1.1, aR: -.4, hairSwing: wob(t, .25) * .08 });
    glow(470, 700, 90, 230, TP.glow, 40 * bright);
    camEnd();
    paint(rectPts(-60, -60, W + 120, H + 120), { fill: TP.night, fillOp: 28, bleed: 0, tex: .2, border: 0, ink: null });
  }

  chapter('night', 0, 6.1, [[0, lyingAwake], [2.7, typing]]);
})();
