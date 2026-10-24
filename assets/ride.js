/* The ride: a New Haven Line train travels from the Bronx to New Haven along the bottom of the screen as you scroll.
   The landscape is drawn here in code (same every visit), in layers that move at different speeds. Each region's
   scenery fades in and out over its stretch of the trip: Bronx, Westchester, the Connecticut coast, New Haven.
   Purely decorative: it is hidden from screen readers, and the "Scenery" button switches it off. */
(function(){
  "use strict";
  document.addEventListener("DOMContentLoaded", init);

  var NS = "http://www.w3.org/2000/svg";
  var VB = 200, RAIL = 166, D = 7200;          // scene height in units, rail height, distance travelled top to bottom
  var CAR = 172, GAP = 6;
  var STATIONS = [[0, "Fordham"], [.3, "New Rochelle"], [.54, "Stamford"], [.75, "Bridgeport"], [1, "New Haven"]];
  var BRIDGE = .64;

  // Time of day along the trip: dawn in the Bronx, golden hour in New Haven
  var KEYS = [0, .3, .55, .8, 1];
  var PAL = {
    sky:  ["#f2d3b8", "#dce8e8", "#cde3ec", "#e9dccb", "#f1ba90"],
    sun:  ["#fff0dc", "#fffaf0", "#fffdf6", "#fff2dc", "#ffe1b0"],
    far:  ["#c6b4bc", "#b5c6c5", "#a9c4cf", "#c7b5ae", "#c79a8e"],
    mid:  ["#8e7a86", "#7e978c", "#6e94a3", "#8f7b7a", "#8a6670"],
    near: ["#4d3f4b", "#3e5048", "#3a5461", "#4b4048", "#4a3540"]
  };
  // When each region's scenery is showing: fade in between the first two values, out between the last two
  var FADE = { bronx: "-9 -9 .26 .34", westchester: ".2 .29 .52 .59", coast: ".47 .55 .8 .87", newhaven: ".75 .84 9 9" };

  function rgb(c){ return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)]; }
  function mix(a, b, t){ var x = rgb(a), y = rgb(b); return "#" + [0, 1, 2].map(function(i){ return ("0" + Math.round(x[i] + (y[i] - x[i]) * t).toString(16)).slice(-2); }).join(""); }
  function pal(name, p){
    p = Math.max(0, Math.min(1, p));
    for (var i = 1; i < KEYS.length; i++) if (p <= KEYS[i]) return mix(PAL[name][i - 1], PAL[name][i], (p - KEYS[i - 1]) / (KEYS[i] - KEYS[i - 1]));
    return PAL[name][KEYS.length - 1];
  }
  function rng(seed){ return function(){ seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function n(v){ return Math.round(v * 10) / 10; }
  function rect(x, y, w, h, fill, extra){ return '<rect x="' + n(x) + '" y="' + n(y) + '" width="' + n(w) + '" height="' + n(h) + '" fill="' + fill + '"' + (extra || "") + "/>"; }
  function poly(pts, fill){ return '<polygon points="' + pts.map(function(p){ return n(p[0]) + "," + n(p[1]); }).join(" ") + '" fill="' + fill + '"/>'; }
  function line(x1, y1, x2, y2, stroke, w){ return '<line x1="' + n(x1) + '" y1="' + n(y1) + '" x2="' + n(x2) + '" y2="' + n(y2) + '" stroke="' + stroke + '" stroke-width="' + (w || 1) + '"/>'; }
  function circ(cx, cy, r, fill){ return '<circle cx="' + n(cx) + '" cy="' + n(cy) + '" r="' + n(r) + '" fill="' + fill + '"/>'; }
  function zone(name, body){ return '<g data-fade="' + FADE[name] + '">' + body + "</g>"; }
  function ridge(x0, x1, base, wave){ var d = "M" + n(x0) + " " + RAIL; for (var x = x0; x <= x1; x += 18) d += " L" + n(x) + " " + n(RAIL - base - wave(x)); return d + " L" + n(x1) + " " + RAIL + " Z"; }

  /* ---------- far: Manhattan towers, Westchester hills, Long Island across the Sound, East Rock ---------- */
  function far(W, P, X){
    var r = rng(11), s = "", x = -60, W2 = W + 60;
    while (x < W2) { var w = 12 + r() * 26, h = 26 + r() * 78, c = pal("far", .08);
      s += rect(x, RAIL - 8 - h, w, h + 8, c); if (r() < .22) s += rect(x + w / 2 - .6, RAIL - 22 - h, 1.2, 14, c); x += w + r() * 10; }
    var e = X(.93) - 120, rock = mix("#9c5a43", pal("far", .95), .45);
    return zone("bronx", s) +
      zone("westchester", '<path d="' + ridge(-60, W2, 36, function(x){ return 12 * Math.sin(x / 90) + 7 * Math.sin(x / 31); }) + '" fill="' + pal("far", .42) + '"/>') +
      zone("coast", '<path d="' + ridge(-60, W2, 20, function(x){ return 4 * Math.sin(x / 120); }) + '" fill="' + pal("far", .66) + '"/>') +
      zone("newhaven", '<path d="' + ridge(-60, W2, 18, function(x){ return 8 * Math.sin(x / 70); }) + '" fill="' + pal("far", .92) + '"/>' +
        poly([[e, RAIL - 10], [e + 26, RAIL - 74], [e + 60, RAIL - 82], [e + 150, RAIL - 86], [e + 230, RAIL - 76], [e + 330, RAIL - 30], [e + 380, RAIL - 12]], rock) +
        rect(e + 118, RAIL - 112, 4, 26, rock) + poly([[e + 116, RAIL - 112], [e + 120, RAIL - 120], [e + 124, RAIL - 112]], rock));
  }

  /* ---------- mid: Bronx apartment blocks, Westchester houses and trees, the Sound, Yale ---------- */
  function mid(W, P, X){
    var r = rng(23), x, p, c, s;
    var bricks = ["#9c5b4a", "#8a4e40", "#a86a55", "#7d5246", "#b07a60"];
    s = ""; x = -60;
    while (x < X(.5)) {
      p = Math.min(.3, P(x)); var w = 64 + r() * 90, h = 44 + r() * 52, top = RAIL - h;
      c = mix(bricks[Math.floor(r() * bricks.length)], pal("mid", p), .38);
      s += rect(x, top, w, h + 4, c) + rect(x, top, w, h + 4, "url(#win)") + rect(x - 2, top - 3, w + 4, 4, mix(c, "#000000", .25));
      if (r() < .4) { var tx = x + 12 + r() * (w - 36), tc = mix("#5b4636", pal("mid", p), .35);   // a rooftop water tower
        s += rect(tx + 2, top - 12, 1.6, 12, tc) + rect(tx + 12, top - 12, 1.6, 12, tc) + rect(tx, top - 26, 16, 14, tc) + poly([[tx - 1, top - 26], [tx + 8, top - 34], [tx + 17, top - 26]], tc); }
      x += w + r() * 6;
    }
    var out = zone("bronx", s);

    s = ""; x = X(.12);
    while (x < X(.78)) {
      p = Math.max(.3, Math.min(.52, P(x)));
      if (r() < .45) { var hw = 34 + r() * 20, hh = 18 + r() * 9, hc = mix(["#efe6d6", "#d8c9b0", "#c9d2d6", "#e2cfc4"][Math.floor(r() * 4)], pal("mid", p), .45);
        s += rect(x, RAIL - hh, hw, hh, hc) + poly([[x - 3, RAIL - hh], [x + hw / 2, RAIL - hh - 14 - r() * 6], [x + hw + 3, RAIL - hh]], mix(hc, "#000000", .3)) + rect(x + hw * .3, RAIL - hh + 6, 6, 6, "url(#win)");
        x += hw + 6;
      } else { var tr = 10 + r() * 9, tg = mix("#4f7a52", pal("mid", p), .45);
        s += rect(x + tr - 1.5, RAIL - 16, 3, 16, mix(tg, "#3b2a20", .5)) + circ(x + tr, RAIL - 16 - tr * .7, tr, tg) + circ(x + tr * .4, RAIL - 12 - tr * .4, tr * .7, tg) + circ(x + tr * 1.6, RAIL - 12 - tr * .5, tr * .75, tg);
        x += tr * 2 + r() * 8; }
    }
    out += zone("westchester", s);

    // Long Island Sound: water, sailboats and a lighthouse
    var w0 = X(.38), w1 = X(1.06), water = mix("#5f97ad", pal("mid", .66), .3);
    s = rect(w0, RAIL - 24, w1 - w0, 30, water);
    for (x = w0; x < w1; x += 26 + r() * 30) s += rect(x, RAIL - 18 + r() * 14, 10 + r() * 22, 1.2, "#ffffff", ' opacity=".35"');
    for (x = w0 + 60; x < w1 - 40; x += 120 + r() * 160) { var by = RAIL - 20 + r() * 8, sh = 16 + r() * 10;
      s += poly([[x, by], [x + 26, by], [x + 22, by + 4], [x + 4, by + 4]], mix("#3a3a44", water, .3)) + poly([[x + 12, by - sh], [x + 12, by - 1], [x + 24, by - 1]], "#fbf6ec") + poly([[x + 11, by - sh + 4], [x + 11, by - 1], [x + 3, by - 1]], "#efe6d6"); }
    var lx = X(.67);
    s += poly([[lx, RAIL - 18], [lx + 4, RAIL - 74], [lx + 14, RAIL - 74], [lx + 18, RAIL - 18]], "#f4efe6") + rect(lx + 2, RAIL - 50, 14, 7, "#d93a26") + rect(lx + 3, RAIL - 32, 12, 7, "#d93a26") + rect(lx + 3, RAIL - 84, 12, 10, "#3a3a44") + poly([[lx + 1, RAIL - 84], [lx + 9, RAIL - 92], [lx + 17, RAIL - 84]], "#d93a26");
    out += zone("coast", s);

    // New Haven: Gothic college blocks and Harkness Tower
    var stone = mix("#b9a98c", pal("mid", .92), .4);
    s = ""; x = X(.62);
    while (x < W) {
      var gw = 56 + r() * 70, gh = 34 + r() * 34, gt = RAIL - gh;
      s += rect(x, gt, gw, gh + 4, stone) + rect(x, gt, gw, gh + 4, "url(#arch)");
      for (var k = x; k < x + gw - 4; k += 9) s += rect(k, gt - 5, 5, 5, stone);
      if (r() < .3) s += rect(x + gw - 16, gt - 30, 12, 30, stone) + poly([[x + gw - 18, gt - 30], [x + gw - 10, gt - 44], [x + gw - 2, gt - 30]], mix(stone, "#000000", .25));
      x += gw + 2 + r() * 10;
    }
    var hx = X(.9);
    s += rect(hx, RAIL - 120, 26, 124, stone) + rect(hx - 4, RAIL - 132, 34, 12, stone) + rect(hx + 2, RAIL - 150, 22, 18, stone) + rect(hx + 6, RAIL - 100, 14, 30, "url(#arch)");
    [[hx - 4, 132], [hx + 26, 132], [hx + 2, 150], [hx + 20, 150]].forEach(function(t){ s += poly([[t[0], RAIL - t[1]], [t[0] + 2, RAIL - t[1] - 14], [t[0] + 4, RAIL - t[1]]], stone); });
    s += poly([[hx + 6, RAIL - 150], [hx + 13, RAIL - 172], [hx + 20, RAIL - 150]], mix(stone, "#000000", .2));
    return out + zone("newhaven", s);
  }

  /* ---------- near: the elevated subway in the Bronx, trees, marsh grass, lamp posts ---------- */
  function near(W, P, X){
    var r = rng(37), s, x, c;
    var v1 = X(.36); c = pal("near", .05);
    s = rect(-60, 96, v1 + 60, 10, c) + rect(-60, 92, v1 + 60, 4, mix(c, "#000000", .3));
    for (x = -40; x < v1; x += 58) s += rect(x, 106, 5, RAIL - 104, c) + line(x + 5, 110, x + 58, 156, c, 1.6) + line(x + 58, 110, x + 5, 156, c, 1.6);
    var sx = X(.12);   // a Bronx elevated subway train
    for (var k = 0; k < 5; k++) { var cx = sx + k * 64; s += rect(cx, 74, 60, 18, "#b9bec4", ' rx="2"') + rect(cx + 3, 78, 54, 5, "#2b3138") + rect(cx, 88, 60, 2, "#7c8389"); }
    var out = zone("bronx", s);
    s = ""; c = pal("near", .4);
    for (x = X(.2); x < X(.65); x += 30 + r() * 50) {
      if (r() < .5) s += poly([[x, RAIL], [x + 10, RAIL - 46 - r() * 20], [x + 20, RAIL]], c);
      else { var tr = 12 + r() * 8; s += rect(x + tr - 2, RAIL - 18, 4, 18, c) + circ(x + tr, RAIL - 24 - tr * .6, tr, c); } }
    out += zone("westchester", s);
    s = ""; c = pal("near", .66);
    for (x = X(.45); x < X(.92); x += 6 + r() * 12) s += line(x, RAIL, x - 2 + r() * 4, RAIL - 6 - r() * 12, c, 1.4);
    out += zone("coast", s);
    s = ""; c = pal("near", .92);
    for (x = X(.7); x < W; x += 90) s += rect(x, RAIL - 46, 2.4, 46, c) + rect(x - 4, RAIL - 50, 10, 5, c);
    return out + zone("newhaven", s);
  }

  /* ---------- track: embankment, rails, catenary, platforms and station signs ---------- */
  function track(W, P, X){
    var s = "", x, wire = "#2f2f35";
    s += rect(-60, RAIL + 2, W + 120, VB - RAIL, "#5e554d") + rect(-60, RAIL + 1, W + 120, 6, "url(#ties)") + rect(-60, RAIL - 1.5, W + 120, 3, "#2b2b30");
    var b0 = X(BRIDGE), b1 = b0 + 520;   // a river under the truss bridge
    s += rect(b0 - 10, RAIL + 3, b1 - b0 + 20, VB - RAIL, mix("#5f97ad", "#3a5461", .3)) + rect(b0, RAIL - 1, b1 - b0, 8, "#2f2f35");
    for (x = b0 + 130; x < b1; x += 130) s += rect(x - 6, RAIL + 7, 12, VB - RAIL, "#45454d");
    STATIONS.forEach(function(st){   // platforms behind the train
      var cx = X(st[0]);
      s += rect(cx - 330, RAIL - 18, 660, 18, "#a69d91") + rect(cx - 330, RAIL - 19, 660, 2, "#e0c662");
      if (st[0] === 1) { s += rect(cx - 340, 44, 680, 7, "#3b3b42"); for (var k = cx - 320; k <= cx + 320; k += 80) s += rect(k, 51, 4, RAIL - 69, "#3b3b42"); }
    });
    var span = 250, poles = [];
    for (x = -40; x < W + span; x += span) poles.push(x);
    var mess = "M" + poles[0] + " 72";
    poles.forEach(function(px, i){
      s += rect(px, 62, 4, RAIL - 62, wire) + line(px + 4, 70, px + 36, 70, wire, 1.6);
      if (i) { var mx = (poles[i - 1] + px) / 2 + 2; mess += " Q" + n(mx) + " 86 " + n(px + 2) + " 72"; for (var d = poles[i - 1] + 26; d < px - 10; d += 26) s += line(d, 72 + 10 * (1 - Math.pow((d - mx) / (span / 2), 2)) * .55, d, 92, wire, .6); }
    });
    s += '<path d="' + mess + '" fill="none" stroke="' + wire + '" stroke-width="1"/>' + line(-60, 92, W + 60, 92, wire, 1.2);
    STATIONS.forEach(function(st){
      var cx = X(st[0]), name = st[1].toUpperCase(), big = st[0] === 1 || st[0] === 0, fs = big ? 15 : 12, bw = name.length * fs * .56 + 26, bh = fs + 12, by = big ? 18 : 24;
      s += rect(cx - bw / 2 + 10, by + bh, 3, 64 - by - bh, "#3b3b42") + rect(cx + bw / 2 - 13, by + bh, 3, 64 - by - bh, "#3b3b42");
      s += rect(cx - bw / 2, by, bw, bh, "#15171c", ' rx="2"') + rect(cx - bw / 2, by + bh - 3, bw, 3, "#d93a26");
      s += '<text x="' + n(cx) + '" y="' + n(by + bh - 7) + '" fill="#f4efe6" font-family="Big Shoulders Display, Arial Narrow, sans-serif" font-weight="800" font-size="' + fs + '" letter-spacing="1" text-anchor="middle">' + name + "</text>";
    });
    return s;
  }

  /* ---------- front: the truss bridge, drawn over the train ---------- */
  function front(W, P, X){
    var b0 = X(BRIDGE), b1 = b0 + 520, c = "#2f2f35", s = rect(b0, 58, b1 - b0, 5, c);
    for (var x = b0; x <= b1; x += 52) { s += rect(x - 1.5, 58, 3, RAIL - 58, c); if (x + 52 <= b1) s += line(x, 62, x + 52, RAIL - 2, c, 2.4); }
    return s;
  }

  /* ---------- the train: a stainless New Haven Line multiple unit ---------- */
  function trainSVG(x0, cars){
    var s = "", body = "#d3d7db", shade = "#aeb4ba", glass = "#27313a";
    for (var i = 0; i < cars; i++) {
      var x = x0 + i * (CAR + GAP), head = i === cars - 1, tail = i === 0;
      if (i) s += rect(x - GAP, 136, GAP, 10, "#2b2b30");
      var pts = [[x + (tail ? 14 : 0), 118], [x + CAR - (head ? 14 : 0), 118], [x + CAR, head ? 134 : 118], [x + CAR, 156], [x, 156], [x, tail ? 134 : 118]];
      s += poly(pts, body) + rect(x + (tail ? 12 : 2), 114, CAR - (tail ? 14 : 0) - (head ? 14 : 2), 5, "#9ca3aa", ' rx="2"');
      s += rect(x, 150, CAR, 6, shade) + rect(x, 142, CAR, 4, "#d93a26");
      s += rect(x + (tail ? 18 : 6), 124, CAR - (tail ? 18 : 6) - (head ? 18 : 6), 11, glass);
      for (var w = x + (tail ? 30 : 18); w < x + CAR - (head ? 26 : 14); w += 15) s += rect(w, 124, 2.5, 11, body);
      [x + 40, x + CAR - 50].forEach(function(dx){ s += rect(dx, 121, 11, 33, "#c2c7cc") + rect(dx + 2, 124, 7, 11, glass) + line(dx + 5.5, 121, dx + 5.5, 154, "#9ca3aa", .6); });
      if (head) s += poly([[x + CAR - 13, 120], [x + CAR - 1, 134], [x + CAR - 13, 134]], glass) + rect(x + CAR - 5, 146, 4, 3, "#fff6d8");
      if (tail) s += poly([[x + 13, 120], [x + 1, 134], [x + 13, 134]], glass) + rect(x + 1, 146, 4, 3, "#ff5a4a");
      if (i === Math.floor((cars - 1) / 2)) { var px = x + CAR / 2 - 20;   // pantograph up to the contact wire
        s += rect(px - 4, 111, 30, 3, "#3b3b42") + line(px, 111, px + 20, 100, "#2b2b30", 1.6) + line(px + 20, 100, px + 4, 92.6, "#2b2b30", 1.6) + rect(px - 8, 91.4, 26, 2, "#2b2b30"); }
      [x + 28, x + CAR - 28].forEach(function(bx){
        s += rect(bx - 17, 155, 34, 6, "#2b2b30", ' rx="2"');
        [bx - 9, bx + 9].forEach(function(wx){ s += '<g class="wheel" data-c="' + n(wx) + ' 161">' + circ(wx, 161, 5, "#1f1f24") + line(wx - 4, 161, wx + 4, 161, "#6b6b73", 1) + "</g>"; });
      });
    }
    return s;
  }

  var DEFS = '<defs>' +
    '<pattern id="win" width="9" height="11" patternUnits="userSpaceOnUse"><rect x="2" y="3" width="4" height="5" fill="#fff4e0" opacity=".4"/></pattern>' +
    '<pattern id="arch" width="10" height="16" patternUnits="userSpaceOnUse"><path d="M3 14V7l2-3 2 3v7z" fill="#3a3340" opacity=".35"/></pattern>' +
    '<pattern id="ties" width="10" height="6" patternUnits="userSpaceOnUse"><rect width="10" height="6" fill="#7a7066"/><rect x="2" width="5" height="4" fill="#3d3631"/></pattern>' +
    '</defs>';

  function init(){
    var band = document.getElementById("ride"), toggle = document.getElementById("scenery");
    if (!band) return;
    var root = document.documentElement, reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    band.innerHTML = '<div class="sun"></div><div class="ride-sign"><span class="b"></span><span class="t"></span></div>';
    var sun = band.querySelector(".sun"), signText = band.querySelector(".ride-sign .t"), signBullet = band.querySelector(".ride-sign .b");
    var layers = [["clouds", .04], ["far", .12], ["mid", .32], ["near", .62], ["track", 1], ["train", 0], ["front", 1]].map(function(l){
      var svg = document.createElementNS(NS, "svg"); svg.setAttribute("class", "layer " + l[0]); svg.setAttribute("preserveAspectRatio", "xMinYMax meet");
      band.append(svg); return { id: l[0], f: l[1], svg: svg };
    });
    var s = 1, wheels = [], fades = [], p = -1, ticking = false;

    function clouds(W){ var r = rng(5), out = ""; for (var x = 40; x < W; x += 180 + r() * 220) { var y = 20 + r() * 40, w = 40 + r() * 40; out += '<g fill="#ffffff" opacity=".6"><ellipse cx="' + n(x) + '" cy="' + n(y) + '" rx="' + n(w / 2) + '" ry="7"/><ellipse cx="' + n(x - w * .12) + '" cy="' + n(y - 6) + '" rx="' + n(w / 4) + '" ry="8"/><ellipse cx="' + n(x + w * .15) + '" cy="' + n(y - 5) + '" rx="' + n(w / 5) + '" ry="6"/></g>'; } return out; }

    function layout(){
      var H = band.clientHeight || 160; s = H / VB;
      var Vu = window.innerWidth / s, cars = Vu < 900 ? 2 : 3, L = cars * CAR + (cars - 1) * GAP;
      var trainX = Math.max(14, Math.min(Vu * .18, Vu - L - 14)), anchor = trainX + L / 2;
      layers.forEach(function(lay){
        var W = lay.f ? Vu + D * lay.f + 400 : Vu;
        var X = function(q){ return anchor + q * D * lay.f; }, P = function(x){ return lay.f ? (x - anchor) / (D * lay.f) : 0; };
        var body = lay.id === "clouds" ? clouds(W) : lay.id === "far" ? far(W, P, X) : lay.id === "mid" ? mid(W, P, X) : lay.id === "near" ? near(W, P, X) : lay.id === "track" ? track(W, P, X) : lay.id === "front" ? front(W, P, X) : trainSVG(trainX, cars);
        var suffix = "-" + lay.id;   // pattern ids must be unique across the page
        lay.svg.setAttribute("viewBox", "0 0 " + n(W) + " " + VB);
        lay.svg.style.width = n(W * s) + "px"; lay.svg.style.height = H + "px";
        lay.svg.innerHTML = DEFS.replace(/id="(\w+)"/g, 'id="$1' + suffix + '"') + body.replace(/url\(#(\w+)\)/g, "url(#$1" + suffix + ")");
      });
      wheels = [].slice.call(band.querySelectorAll(".wheel")).map(function(g){ return { g: g, c: g.getAttribute("data-c") }; });
      fades = [].slice.call(band.querySelectorAll("[data-fade]")).map(function(g){ return { g: g, k: g.getAttribute("data-fade").split(" ").map(Number) }; });
      p = -1; render();
    }

    // The page marks the current stop on <html data-stop="…"> (site.js); the destination display and reduced motion follow it
    function sections(){ return [].slice.call(document.querySelectorAll("#col > section.stop")); }
    function stopIndex(){ return +root.getAttribute("data-stop") || 0; }
    function progress(){
      var max = root.scrollHeight - window.innerHeight;
      if (!reduce.matches) return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      var count = sections().length;   // reduced motion: no continuous movement, the scene jumps from stop to stop
      return count > 1 ? stopIndex() / (count - 1) : 0;
    }
    function ease(t){ t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); }
    function render(){
      ticking = false;
      if (root.classList.contains("no-ride")) return;
      var here = currentStop();
      if (here) { signBullet.textContent = here.n; signText.textContent = here.text; }
      var q = progress(); if (q === p) return; p = q;
      layers.forEach(function(lay){ if (lay.f) lay.svg.style.transform = "translate3d(" + n(-p * D * lay.f * s) + "px,0,0)"; });
      fades.forEach(function(f){ var k = f.k, o = Math.min(ease((p - k[0]) / (k[1] - k[0] || 1) + (k[1] === k[0] ? 1 : 0)), 1 - ease((p - k[2]) / (k[3] - k[2]))); f.g.setAttribute("opacity", n(o * 100) / 100); });
      band.style.backgroundColor = pal("sky", p);
      sun.style.background = pal("sun", p);
      sun.style.transform = "translate(" + n((.08 + p * .78) * band.clientWidth) + "px," + n((.62 - Math.sin(Math.PI * p) * .45) * band.clientHeight) + "px)";
      if (!reduce.matches) { var deg = n(p * D / 5 * 57.3 % 360); wheels.forEach(function(w){ w.g.setAttribute("transform", "rotate(" + deg + " " + w.c + ")"); }); }
    }
    // The destination display: "Next stop · Research", and at the last stop, the end of the line
    function currentStop(){
      var secs = sections(); if (!secs.length) return null;
      var idx = Math.min(stopIndex(), secs.length - 1);
      var name = function(i){ return secs[i].getAttribute("data-stop") || secs[i].id; };
      return { n: idx + 1, text: idx === secs.length - 1 ? name(idx) + " · end of the line" : "Next stop · " + name(idx + 1) };
    }
    function onScroll(){ if (!ticking) { ticking = true; requestAnimationFrame(render); } }

    function setScenery(on){
      root.classList.toggle("no-ride", !on);
      if (toggle) toggle.setAttribute("aria-pressed", on ? "true" : "false");
      try { localStorage.setItem("scenery", on ? "on" : "off"); } catch (e) {}
      if (on) layout();
    }
    var on = true; try { on = localStorage.getItem("scenery") !== "off"; } catch (e) {}
    if (toggle) toggle.addEventListener("click", function(){ setScenery(toggle.getAttribute("aria-pressed") !== "true"); });
    setScenery(on);
    window.addEventListener("scroll", onScroll, { passive: true });
    var t; window.addEventListener("resize", function(){ clearTimeout(t); t = setTimeout(function(){ if (!root.classList.contains("no-ride")) layout(); }, 150); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ p = -1; render(); });
    if (reduce.addEventListener) reduce.addEventListener("change", function(){ p = -1; render(); });
  }
})();
