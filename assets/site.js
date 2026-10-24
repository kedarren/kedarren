/* Builds the site from content.js. You shouldn't need to edit this file: change content.js instead. */
(function(){
  "use strict";

  // If content.js has a typo, remember the line number so the page can say where to look
  window.addEventListener("error", function(e){
    if (e.filename && e.filename.indexOf("content.js") > -1) window.SITE_ERROR = { line: e.lineno, message: e.message };
  });
  // Queue for Vercel Web Analytics events until its script loads (the script tag is added at build time)
  window.va = window.va || function(){ (window.vaq = window.vaq || []).push(arguments); };
  // content.js loads right after this file; both finish before DOMContentLoaded
  document.addEventListener("DOMContentLoaded", start);

  function start(){
  var col = document.getElementById("col");
  var root = document.documentElement;

  /* ---------- tiny element helper ---------- */
  function h(tag, attrs){
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function(k){
      var v = attrs[k];
      if (v == null || v === false) return;
      if (k === "class") e.className = v;
      else e.setAttribute(k, v === true ? "" : v);
    });
    for (var i = 2; i < arguments.length; i++) add(e, arguments[i]);
    return e;
  }
  function add(e, k){
    if (k == null || k === false || k === "") return;
    if (Array.isArray(k)) { k.forEach(function(x){ add(e, x); }); return; }
    e.append(k.nodeType ? k : document.createTextNode(String(k)));
  }
  function ext(url){ return /^https?:/i.test(url) ? { target: "_blank", rel: "noopener" } : {}; }
  function link(l, cls){ return h("a", Object.assign({ href: l.url, class: cls || null }, ext(l.url)), l.label); }
  /* A single value counts as a one-item list, so a forgotten [ ] in content.js still shows up */
  var arr = function(x){ return Array.isArray(x) ? x : (x == null || x === "" ? [] : [x]); };
  function slug(s){ return String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""); }
  function pad(n){ return ("0" + n).slice(-2); }
  var ICON = {
    x: '<svg viewBox="0 0 16 16"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9"/></svg>',
    expand: '<svg viewBox="0 0 16 16"><path d="M9.5 2.5h4v4M6.5 13.5h-4v-4M13.5 2.5L9 7M2.5 13.5L7 9"/></svg>'
  };
  function icon(name){ var s = h("span", { class: "ico", "aria-hidden": "true" }); s.innerHTML = ICON[name]; return s; }

  if (!window.SITE) {
    var E = window.SITE_ERROR;
    col.append(h("section", { class: "stop about oops" },
      h("h1", null, E && E.line ? "content.js has a typo" : "content.js didn't load"),
      E && E.line
        ? [h("p", null, "The browser stopped reading content.js at line " + E.line + ". The mistake is usually on that line or the one just above it: a missing comma, quote mark or bracket."),
           h("p", { class: "muted" }, "Browser message: " + E.message)]
        : h("p", null, "Check that content.js is uploaded next to index.html and has no missing commas or quote marks.")));
    return;
  }

  /* Text still in [square brackets] is a placeholder: leave it off the page until it's filled in */
  var PLACEHOLDER = /^\s*\[[^\]]*\]\s*$/;
  function clean(v){
    if (typeof v === "string") return PLACEHOLDER.test(v) ? "" : v;
    if (Array.isArray(v)) return v.map(clean).filter(function(x){ return x !== "" && x != null; });
    if (v && typeof v === "object") { var o = {}; Object.keys(v).forEach(function(k){ o[k] = clean(v[k]); }); return o; }
    return v;
  }
  var S = clean(window.SITE);
  var J = S.journey || {};

  var stations = arr(S.stations), N = stations.length;
  // A station sign over a short stretch of track: route bullet, "Stop 3 of 7", the name
  function heading(st){
    var i = stations.indexOf(st) + 1;
    return h("div", { class: "stop-head" },
      h("span", { class: "stop-bullet", "aria-hidden": "true" }, i),
      h("div", null, h("p", { class: "stop-no" }, "Stop " + i + " of " + N), h("h2", null, st.label)));
  }
  function section(st, cls){ var s = h("section", { class: "stop " + (cls || ""), id: st.id, "data-stop": st.label }); for (var i = 2; i < arguments.length; i++) add(s, arguments[i]); return s; }
  function tagList(t){ return arr(t).length ? h("div", { class: "tags" }, arr(t).map(function(x){ return h("span", { class: "tag" }, x); })) : null; }
  function labeled(label, items){ return arr(items).length ? [h("div", { class: "lbl" }, label), tagList(items)] : null; }
  function missing(src){ return h("div", { class: "ph" }, "Couldn't find " + src + ". Check that it's uploaded and the name matches exactly, including capital letters."); }

  // Research and experience: each role is a stop on a short branch line
  function jobs(st, list){
    return section(st, "", heading(st), h("ol", { class: "jobs" }, arr(list).filter(function(j){ return j.title || j.org; }).map(function(j){
      return h("li", null,
        h("div", { class: "job-top" },
          h("h3", null, j.title || j.org),
          j.title ? h("span", { class: "job-org" }, j.org) : null,
          h("span", { class: "job-dates" }, j.dates)),
        arr(j.points).length ? h("ul", null, arr(j.points).map(function(p){ return h("li", null, p); })) : null);
    })));
  }

  // Education: a timetable, one row per semester
  function semesterTabs(semesters){
    semesters = arr(semesters).filter(function(s){ return s.term; });
    if (!semesters.length) return null;
    var buttons = [], panels = [];
    var rows = semesters.map(function(s, i){
      var id = "term-" + i + "-" + Math.random().toString(36).slice(2, 7), courses = arr(s.courses);
      var panel = h("div", { class: "term-panel", id: id, hidden: true },
        h("ul", null, courses.map(function(c){
          // "MENG 3125: Machine Elements" -> course code set in mono beside the title
          var m = /^([A-Z]{2,5} [A-Z]?\d{2,4}[A-Z]?):\s*(.+)$/.exec(c);
          return h("li", null, m ? [h("span", { class: "code" }, m[1]), h("span", null, m[2])] : c);
        })));
      var btn = h("button", { class: "term-btn", type: "button", "aria-expanded": "false", "aria-controls": id },
        h("span", { class: "term-name" }, s.term),
        h("span", { class: "term-count" }, courses.length + (courses.length === 1 ? " course" : " courses")));
      btn.addEventListener("click", function(){
        var opening = btn.getAttribute("aria-expanded") !== "true";
        buttons.forEach(function(b, k){ b.setAttribute("aria-expanded", "false"); panels[k].hidden = true; });
        if (opening) { btn.setAttribute("aria-expanded", "true"); panel.hidden = false; }
      });
      buttons.push(btn); panels.push(panel);
      return h("div", { class: "term" }, btn, panel);
    });
    return [h("div", { class: "lbl" }, "Coursework"), h("div", { class: "terms" }, rows)];
  }

  /* ---------- the ticket ---------- */
  function hash(s){ var x = 2166136261; for (var i = 0; i < s.length; i++) { x ^= s.charCodeAt(i); x = Math.imul(x, 16777619); } return x >>> 0; }
  function barcode(seed){
    var x = 0, bars = "", r = seed || 1;
    while (x < 206) { r = Math.imul(r ^ (r >>> 13), 1274126177) >>> 0; var w = 1 + (r % 3), gap = 1 + ((r >>> 4) % 3); bars += '<rect x="' + x + '" width="' + w + '" height="40"/>'; x += w + gap; }
    var b = h("span", { "aria-hidden": "true" }); b.innerHTML = '<svg class="barcode" viewBox="0 0 210 40" preserveAspectRatio="none" fill="#15171c">' + bars + "</svg>"; return b.firstChild;
  }
  function ticket(photo){
    var rows = arr(S.ticket).filter(function(r){ return r.label && r.value; });
    if (!rows.length && !(J.from && J.to)) return null;
    var seed = hash((S.name || "") + (J.from || "") + (J.to || ""));
    return h("aside", { class: "ticket", "aria-label": "Ticket" },
      h("div", { class: "t-top" },
        h("span", { class: "t-type" }, h("span", { class: "t-bullet", "aria-hidden": "true" }, (S.name || "?").charAt(0)), "One way"),
        h("span", null, "Non-transferable")),
      (J.from && J.to) ? h("p", { class: "t-route" }, h("span", null, J.from), h("span", { class: "arrow", "aria-hidden": "true" }, "→"), h("span", { class: "vh" }, "to"), h("span", null, J.to)) : null,
      h("div", { class: "t-perf", "aria-hidden": "true" }),
      rows.length ? h("dl", { class: "t-rows" }, rows.map(function(r){ return [h("dt", null, r.label), h("dd", null, r.value)]; })) : null,
      h("div", { class: "t-foot" },
        h("div", null, barcode(seed), h("p", { class: "t-no", "aria-hidden": "true" }, "No. " + String(seed % 10000000).padStart(7, "0"))),
        photo));
  }

  /* ---------- project window ---------- */
  function lock(){ root.classList.add("locked"); }
  function unlock(){ if (!document.querySelector("dialog[open]")) root.classList.remove("locked"); }

  // Full-size image viewer, shared by every picture in the project window
  var lb = h("dialog", { class: "lightbox", "aria-label": "Full-size image" });
  var lbImg = h("img", { alt: "" }), lbCap = h("p", { class: "lb-cap" });
  var lbClose = h("button", { class: "x", type: "button", "aria-label": "Close image" }, icon("x"));
  lb.append(lbClose, h("div", { class: "lb-wrap" }, lbImg, lbCap));
  document.body.append(lb);
  var lbFrom = null;
  lb.addEventListener("click", function(e){ if (e.target !== lbImg) lb.close(); });
  lb.addEventListener("close", function(){ unlock(); if (lbFrom) lbFrom.focus(); });
  function openImage(src, alt, caption, from){
    lbImg.src = src; lbImg.alt = alt || "";
    lbCap.textContent = caption || ""; lbCap.hidden = !caption;
    lbFrom = from; lb.showModal(); lock();
  }

  // A picture you can click to see full size
  function zoomable(src, alt, caption){
    var img = h("img", { src: src, alt: alt || "" });
    var btn = h("button", { class: "zoom", type: "button", "aria-label": "View full size" + (alt ? ": " + alt : "") }, img, h("span", { class: "zoom-ico" }, icon("expand")));
    img.addEventListener("load", drawLeaders);
    img.addEventListener("error", function(){ btn.replaceWith(missing(src)); drawLeaders(); });
    btn.addEventListener("click", function(){
      if (performance.now() - pdOpenedAt < 450) return;   // a double-click on the card shouldn't also open the big photo
      openImage(src, alt, caption, btn);
    });
    return btn;
  }

  var pd = h("dialog", { class: "proj", "aria-labelledby": "proj-title" });
  document.body.append(pd);
  var pdFrom = null, pdOpenedAt = 0, pushed = false;
  var watcher = "ResizeObserver" in window ? new ResizeObserver(function(){ drawLeaders(); }) : null;
  pd.addEventListener("click", function(e){ if (e.target === pd) pd.close(); });
  pd.addEventListener("close", function(){
    if (watcher) watcher.disconnect();
    pd.replaceChildren(); unlock();
    // Take the project off the address bar: step back if we added it, otherwise just tidy it
    if (/^#project-/.test(location.hash)) {
      if (pushed) { pushed = false; history.back(); }
      else history.replaceState(null, "", location.pathname + location.search + "#projects");
    }
    if (pdFrom) pdFrom.focus();
  });
  window.addEventListener("resize", function(){ if (pd.open) drawLeaders(); });

  function reasonRow(r, i){
    var row = h("li", { class: "why-row" + (r.image ? (i % 2 ? " flip" : "") : " solo") },
      h("div", { class: "why-box" },
        h("span", { class: "why-num", "aria-hidden": "true" }, i + 1),
        r.title ? h("h4", null, r.title) : null,
        arr(r.text).map(function(t){ return h("p", null, t); })),
      r.image ? h("figure", { class: "why-fig" },
        zoomable(r.image, r.title, r.caption),
        r.caption ? h("figcaption", null, h("b", null, "Fig. " + (i + 1)), r.caption) : null) : null);
    var p = r.point;
    row._point = Array.isArray(p) && p.length === 2 && isFinite(p[0]) && isFinite(p[1]) ? [+p[0], +p[1]] : null;
    return row;
  }

  function openProject(p, from, fromHistory){
    var overview = arr(p.overview), points = arr(p.points), links = arr(p.links);
    var reasons = arr(p.reasoning).filter(function(r){ return r.title || arr(r.text).length; });
    var pictures = reasons.some(function(r){ return r.image; });
    var side = (points.length || links.length) ? h("div", { class: "side-box" },
      points.length ? [h("h3", { class: "kicker" }, "Highlights"), h("ul", null, points.map(function(x){ return h("li", null, x); }))] : null,
      links.length ? h("div", { class: "actions" }, links.map(function(l){ return link(l, "btn go"); })) : null) : null;
    var close = h("button", { class: "x", type: "button", "aria-label": "Close project" }, icon("x"));
    close.addEventListener("click", function(){ pd.close(); });
    // Focusable so keyboard users can scroll it with the arrow keys
    var body = h("div", { class: "proj-body", tabindex: "0", role: "region", "aria-label": "Project details" },
      p.image ? h("figure", { class: "proj-hero" }, zoomable(p.image, p.title, p.summary)) : null,
      (p.role || arr(p.tags).length) ? h("div", { class: "proj-meta" }, p.role ? h("span", { class: "proj-role" }, p.role) : null, tagList(p.tags)) : null,
      p.summary ? h("p", { class: "proj-lead" }, p.summary) : null,
      (overview.length || side) ? h("div", { class: "proj-cols" + (overview.length && side ? " two" : "") },
        overview.length ? h("div", null, h("h3", { class: "kicker" }, "Overview"), overview.map(function(t){ return h("p", null, t); })) : null,
        side) : null,
      reasons.length ? h("section", { class: "why", "aria-labelledby": "why-title" },
        h("h3", { id: "why-title" }, "Why I built it this way"),
        pictures ? h("p", null, "Click any image to see it full size.") : null,
        h("ol", { class: "why-list" + (pictures ? "" : " solo") }, reasons.map(reasonRow))) : null);
    pd.replaceChildren(h("div", { class: "proj-panel" },
      h("div", { class: "proj-head" }, h("span", { class: "bullet", "aria-hidden": "true" }), h("h2", { id: "proj-title" }, p.title), close),
      body));
    pdFrom = from; pdOpenedAt = performance.now();
    pd.showModal(); lock();
    body.scrollTop = 0;
    // Give each project its own link (darrenke.com/#project-name); the Back button closes it
    if (!fromHistory && location.hash !== "#project-" + p._slug) { history.pushState({ project: p._slug }, "", "#project-" + p._slug); pushed = true; }
    if (watcher) pd.querySelectorAll(".why-row").forEach(function(r){ watcher.observe(r); });
    drawLeaders();
  }

  /* ---------- leader lines: from each reasoning box to its spot on the image ---------- */
  var NS = "http://www.w3.org/2000/svg";
  function svgEl(tag, attrs){ var e = document.createElementNS(NS, tag); Object.keys(attrs).forEach(function(k){ e.setAttribute(k, attrs[k]); }); return e; }
  function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
  function drawLeaders(){
    if (!pd.open) return;
    pd.querySelectorAll(".why-row").forEach(function(row){
      var old = row.querySelector(".leader"); if (old) old.remove();
      var box = row.querySelector(".why-box"), t = row.querySelector(".why-fig img, .why-fig .ph");
      if (!box || !t) return;
      var R = row.getBoundingClientRect(), b = box.getBoundingClientRect(), m = t.getBoundingClientRect();
      if (!m.width || !m.height) return;
      var pt = row._point, tx, ty, pts;
      if (pt) { tx = m.left + clamp(pt[0], 0, 100) / 100 * m.width; ty = m.top + clamp(pt[1], 0, 100) / 100 * m.height; }
      if (m.top >= b.bottom - 1) {
        // Stacked (phones): straight down out of the box into the image
        if (!pt) { tx = m.left + m.width / 2; ty = m.top; }
        var sx = clamp(tx, b.left + 18, b.right - 18);
        pts = [[sx, b.bottom], [tx, ty]];
      } else {
        // Side by side: out of the box's inner edge, a short level shoulder, then to the spot
        var right = b.left < m.left, dir = right ? 1 : -1, edge = right ? b.right : b.left;
        var sy;
        if (pt) sy = clamp(ty, b.top + 22, b.bottom - 22);
        else { sy = b.top + b.height / 2; tx = right ? m.left : m.right; ty = clamp(sy, m.top + 14, m.bottom - 14); }
        var shoulder = Math.min(28, Math.abs((right ? m.left : m.right) - edge) * 0.45);
        pts = [[edge, sy], [edge + dir * shoulder, sy], [tx, ty]];
      }
      var X = function(p){ return (p[0] - R.left).toFixed(1); }, Y = function(p){ return (p[1] - R.top).toFixed(1); };
      var svg = svgEl("svg", { class: "leader", "aria-hidden": "true", width: R.width.toFixed(1), height: R.height.toFixed(1) });
      svg.append(svgEl("path", { d: pts.map(function(p, k){ return (k ? "L" : "M") + X(p) + " " + Y(p); }).join(" ") }));
      var s = pts[0], e = pts[pts.length - 1];
      svg.append(svgEl("circle", { class: "tail", cx: X(s), cy: Y(s), r: 4 }));
      svg.append(svgEl("circle", { class: "tip", cx: X(e), cy: Y(e), r: pt ? 7 : 5 }));
      row.append(svg);
    });
  }

  /* ---------- sections ---------- */
  var projects = arr(S.projects).filter(function(p){ return p.title; });
  var bySlug = {};
  projects.forEach(function(p){ p._slug = slug(p.title); bySlug[p._slug] = p; });
  var mailto = arr(S.links).filter(function(l){ return /^mailto:/i.test(l.url || ""); })[0];
  var email = S.email || (mailto ? mailto.url.replace(/^mailto:/i, "") : "");

  var R = {
    about: function(st){
      var photoSrc = S.photo || S.image;
      var photo = photoSrc ? h("img", { class: "t-photo", src: photoSrc, alt: S.name ? "Photo of " + S.name : "" }) : null;
      if (photo) photo.addEventListener("error", function(){ photo.remove(); });
      // "Hello, my name is Darren Ke!" -> a small kicker, then the name as a big sign with the last word in red
      var line = S.headline || S.name || "", at = S.name ? line.indexOf(S.name) : -1;
      var kicker = at > 0 ? line.slice(0, at).replace(/[\s,:;]+$/, "") : "";
      var shown = at >= 0 ? line.slice(at) : line, cut = shown.lastIndexOf(" ");
      return section(st, "about", h("div", { class: "hero" },
        h("div", null,
          kicker ? h("p", { class: "hero-kicker" }, kicker) : null,
          h("h1", { class: "hero-name" }, cut > 0 ? [shown.slice(0, cut + 1), h("span", { class: "last" }, shown.slice(cut + 1))] : shown),
          (S.major || S.school || S.classOf) ? h("div", { class: "sub" }, S.major ? h("span", null, S.major) : null, S.school ? h("span", null, S.school) : null, S.classOf ? h("span", null, S.classOf) : null) : null,
          S.bio ? h("p", { class: "bio" }, S.bio) : null,
          h("div", { class: "actions" },
            S.resumePdf ? h("a", { class: "btn primary go", href: S.resumePdf, target: "_blank", rel: "noopener" }, "Resume (PDF)") : null,
            arr(S.links).map(function(l, i){ return link(l, "btn go" + (i || S.resumePdf ? "" : " primary")); })),
          // Only shows on paper: contact details where the buttons were
          h("p", { class: "print-only" }, [email, location.host].concat(arr(S.links).filter(function(l){ return /^https?:/i.test(l.url); }).map(function(l){ return l.url.replace(/^https?:\/\/(www\.)?/i, ""); })).filter(Boolean).join("  ·  "))),
        ticket(photo)));
    },

    experience: function(st){ return jobs(st, S.experience); },

    projects: function(st){
      var tags = [];
      projects.forEach(function(p){ arr(p.tags).forEach(function(t){ if (tags.indexOf(t) < 0) tags.push(t); }); });
      var cards = projects.map(function(p, n){
        var det = (arr(p.points).length || p.role || arr(p.links).length) ? h("details", null,
          h("summary", null, "Details"),
          p.role ? h("div", { class: "role" }, p.role) : null,
          arr(p.points).length ? h("ul", null, arr(p.points).map(function(x){ return h("li", null, x); })) : null,
          arr(p.links).length ? h("div", { class: "plinks" }, arr(p.links).map(function(l){ return link(l); })) : null) : null;
        var img = p.image ? h("img", { src: p.image, alt: "", loading: "lazy" }) : null;
        // No photo yet: a platform sign with the project's name
        var sign = h("span", { class: "sign", "aria-hidden": "true" }, h("span", { class: "sign-no" }, "Project " + pad(n + 1)), h("span", { class: "sign-name" }, p.title));
        var media = h("button", { class: "media", type: "button", "aria-label": "Open full project: " + p.title },
          img || sign,
          h("span", { class: "open-hint", "aria-hidden": "true" }, "View project", icon("expand")));
        var card = h("article", { class: "card" + (img ? "" : " has-sign") },
          media,
          h("div", { class: "card-body" },
            h("h3", { class: img ? null : "vh" }, p.title),
            p.summary ? h("p", null, p.summary) : null,
            tagList(p.tags),
            det));
        if (img) img.addEventListener("error", function(){ img.replaceWith(sign); card.classList.add("has-sign"); card.querySelector("h3").className = "vh"; });
        media.addEventListener("click", function(){ openProject(p, media); });
        card._tags = arr(p.tags);
        return card;
      });
      var filters = null;
      if (projects.length > 1 && tags.length > 1) {
        var chips = [];
        var mk = function(label, val){
          var b = h("button", { class: "chip", type: "button", "aria-pressed": val === null ? "true" : "false" }, label);
          b.addEventListener("click", function(){
            chips.forEach(function(c){ c.setAttribute("aria-pressed", c === b ? "true" : "false"); });
            cards.forEach(function(c){ c.hidden = val !== null && c._tags.indexOf(val) < 0; });
          });
          chips.push(b); return b;
        };
        filters = h("div", { class: "filters", role: "group", "aria-label": "Filter projects by skill" }, mk("All", null), tags.map(function(t){ return mk(t, t); }));
      }
      return section(st, "", heading(st), filters, projects.length ? h("div", { class: "cards" }, cards) : h("p", { class: "empty" }, "Projects coming soon."));
    },

    skills: function(st){
      return section(st, "", heading(st), h("div", { class: "skills" }, arr(S.skills).filter(function(g){ return arr(g.items).length; }).map(function(g){
        return h("div", { class: "skill-group" }, h("h3", null, g.group || ""), h("ul", null, arr(g.items).map(function(x){ return h("li", null, x); })));
      })));
    },

    education: function(st){
      return section(st, "", heading(st), h("div", { class: "edu" }, arr(S.education).map(function(e){
        return h("div", null,
          h("h3", null, e.school || ""),
          h("div", { class: "deg" }, e.degree),
          h("div", { class: "meta" }, e.dates ? h("span", null, e.dates) : null, arr(e.details).map(function(d){ return h("span", null, d); })),
          labeled("Honors", e.honors),
          labeled("Activities", e.activities),
          semesterTabs(e.semesters),
          labeled("Relevant coursework", e.courses));
      })));
    },

    contact: function(st){
      var addr = h("a", { class: "email", href: "mailto:" + email }, email);
      var copy = h("button", { class: "btn", type: "button" }, "Copy email");
      copy.addEventListener("click", function(){
        var reset = function(ms){ setTimeout(function(){ copy.textContent = "Copy email"; }, ms); };
        var fallback = function(){
          var r = document.createRange(); r.selectNodeContents(addr);
          var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
          copy.textContent = "Selected. Press Ctrl+C"; reset(2600);
        };
        try { navigator.clipboard.writeText(email).then(function(){ copy.textContent = "Copied"; reset(1800); }, fallback); } catch (e) { fallback(); }
      });
      return section(st, "contact", heading(st),
        S.contactNote ? h("p", { class: "lead" }, S.contactNote) : null,
        email ? h("div", { class: "email-row" }, addr, copy) : null,
        h("div", { class: "actions" }, arr(S.links).map(function(l){ return link(l, "btn go"); })));
    }
  };

  // "By the numbers": a destination-board panel right after the intro, from stats: [ ... ] in content.js
  function statsBand(){
    var stats = arr(S.stats).filter(function(s){ return s.value; });
    if (!stats.length) return null;
    return h("div", { class: "stats", role: "region", "aria-label": "By the numbers" },
      h("p", { class: "stats-label" }, "By the numbers"),
      h("ul", null, stats.map(function(s){ return h("li", null, h("span", { class: "stat-value" }, s.value), h("span", { class: "stat-label" }, s.label)); })));
  }

  /* ---------- build ---------- */
  var list = document.getElementById("stations");
  var anchors = [], sections = [];
  stations.forEach(function(st){
    var a = h("a", { class: "stop-link", href: "#" + st.id, "aria-current": "false", "aria-label": st.label },
      h("span", { class: "dot", "aria-hidden": "true" }),
      h("span", { class: "name", "aria-hidden": "true" }, h("span", { class: "long" }, st.label), h("span", { class: "short" }, st.short || st.label)));
    list.append(h("li", null, a)); anchors.push(a);
    var sec;
    // A station with no special layout shows the list in content.js with the same name (research: [...]) like Experience
    var render = R[st.id] || (Array.isArray(S[st.id]) ? function(st){ return jobs(st, S[st.id]); } : null);
    try { sec = render ? render(st) : section(st, "", heading(st)); }
    catch (err) {
      console.error(err);
      sec = section(st, "", heading(st), h("p", { class: "empty" }, "This section couldn't be shown. Check the " + st.id + " part of content.js."));
    }
    col.append(sec); sections.push(sec);
    if (st.id === "about") { var band = statsBand(); if (band) sec.append(band); }
  });
  document.getElementById("from").textContent = J.from || "";
  document.getElementById("to").textContent = J.to || "";
  document.getElementById("marker").innerHTML = '<svg viewBox="0 0 34 19"><rect x="1" y="2" width="32" height="12" rx="3.5" fill="#d3d7db" stroke="#15171c" stroke-width="1.5"/><rect x="5" y="5" width="21" height="3.6" rx="1" fill="#27313a"/><rect x="1.8" y="10" width="30.4" height="1.8" fill="#d93a26"/><circle cx="8" cy="16" r="2.2" fill="#15171c"/><circle cx="26" cy="16" r="2.2" fill="#15171c"/></svg>';

  var foot = document.getElementById("foot");
  var printBtn = h("button", { class: "linkish", type: "button" }, "Save as PDF");
  printBtn.addEventListener("click", function(){ window.print(); });
  add(foot, [
    h("span", { class: "grow" }, "© " + new Date().getFullYear() + " " + (S.name || "") + (J.from && J.to ? " · " + J.from + " → " + J.to : "")),
    arr(S.links).map(function(l){ return link(l); }),
    printBtn]);

  // On paper, show everything: project details and every semester
  var opened = [];
  window.addEventListener("beforeprint", function(){
    opened = [].slice.call(document.querySelectorAll("details:not([open])"));
    opened.forEach(function(d){ d.open = true; });
  });
  window.addEventListener("afterprint", function(){ opened.forEach(function(d){ d.open = false; }); });

  /* ---------- where you are on the line ---------- */
  var marker = document.getElementById("marker"), active = -1, stopsAt = [];
  // The scroll position at which each section becomes the current stop
  function measure(){
    var max = root.scrollHeight - window.innerHeight;
    stopsAt = sections.map(function(sec, i){ return i === 0 ? 0 : Math.min(max, sec.getBoundingClientRect().top + window.scrollY - window.innerHeight * .45); });
  }
  function track(){
    ticking = false;
    var y = window.scrollY, max = root.scrollHeight - window.innerHeight, i = 0;
    while (i < stopsAt.length - 1 && y >= stopsAt[i + 1]) i++;
    var frac = i < stopsAt.length - 1 ? Math.max(0, Math.min(1, (y - stopsAt[i]) / Math.max(1, stopsAt[i + 1] - stopsAt[i]))) : 0;
    if (y >= max - 2) { i = stopsAt.length - 1; frac = 0; }
    marker.style.left = (N > 1 ? (i + frac) / (N - 1) * 100 : 0) + "%";
    if (i !== active) {
      active = i;
      root.setAttribute("data-stop", String(i));
      anchors.forEach(function(a, k){ a.setAttribute("aria-current", k === i ? "true" : "false"); });
    }
  }
  var ticking = false;
  window.addEventListener("scroll", function(){ if (!ticking) { ticking = true; requestAnimationFrame(track); } }, { passive: true });
  window.addEventListener("resize", function(){ measure(); track(); });
  if ("ResizeObserver" in window) new ResizeObserver(function(){ measure(); track(); }).observe(col);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ measure(); track(); });

  // Opening and closing projects with the browser's Back and Forward buttons
  function projectFromHash(){ var m = /^#project-(.+)$/.exec(location.hash); return m ? bySlug[m[1]] : null; }
  window.addEventListener("popstate", function(){
    var p = projectFromHash();
    if (p) { if (!pd.open) openProject(p, null, true); }
    else if (pd.open) { pushed = false; pd.close(); }
  });

  /* ---------- start ---------- */
  var linked = projectFromHash();
  var startAt = stations.findIndex(function(s){ return "#" + s.id === location.hash || (linked && s.id === "projects"); });
  // Links like darrenke.com/#projects: the sections didn't exist yet when the browser looked for them
  if (startAt > 0) { root.style.scrollBehavior = "auto"; sections[startAt].scrollIntoView(); root.style.scrollBehavior = ""; }
  measure(); track();
  if (linked) openProject(linked, null, true);
  }
})();
