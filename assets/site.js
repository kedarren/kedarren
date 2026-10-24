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
  var ICON = {
    x: '<svg viewBox="0 0 16 16"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9"/></svg>',
    expand: '<svg viewBox="0 0 16 16"><path d="M9.5 2.5h4v4M6.5 13.5h-4v-4M13.5 2.5L9 7M2.5 13.5L7 9"/></svg>'
  };
  function icon(name){ var s = h("span", { class: "ico", "aria-hidden": "true" }); s.innerHTML = ICON[name]; return s; }

  if (!window.SITE) {
    var E = window.SITE_ERROR;
    document.getElementById("rail").hidden = true;
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

  if (S.lineColor) root.style.setProperty("--line", S.lineColor);

  var stations = arr(S.stations), N = stations.length;
  var bigDots = [];
  function dot(){ var d = h("span", { class: "st-dot", "aria-hidden": "true" }); bigDots.push(d); return d; }
  function small(){ return h("span", { class: "sm-dot", "aria-hidden": "true" }); }
  function heading(st){ return h("h2", { class: "has-dot" }, dot(), st.label); }
  function section(st, cls){ var s = h("section", { class: "stop " + (cls || ""), id: st.id }); for (var i = 2; i < arguments.length; i++) add(s, arguments[i]); return s; }
  function tagList(t){ return arr(t).length ? h("div", { class: "tags" }, arr(t).map(function(x){ return h("span", { class: "tag" }, x); })) : null; }
  function labeled(label, items){ return arr(items).length ? [h("div", { class: "lbl" }, label), tagList(items)] : null; }
  function missing(src){ return h("div", { class: "ph" }, "Couldn't find " + src + ". Check that it's uploaded and the name matches exactly, including capital letters."); }

  function jobs(st, list){
    return section(st, "", heading(st), h("ol", { class: "jobs" }, arr(list).filter(function(j){ return j.title || j.org; }).map(function(j){
      return h("li", null,
        h("div", { class: "job-top" },
          h("h3", { class: "has-dot" }, small(), j.title || j.org),
          j.title ? h("span", { class: "job-org" }, j.org) : null,
          h("span", { class: "job-dates" }, j.dates)),
        arr(j.points).length ? h("ul", null, arr(j.points).map(function(p){ return h("li", null, p); })) : null);
    })));
  }

  function semesterTabs(semesters){
    semesters = arr(semesters).filter(function(s){ return s.term; });
    if (!semesters.length) return null;
    var buttons = [], panels = [];
    var rows = semesters.map(function(s, i){
      var id = "term-" + i + "-" + Math.random().toString(36).slice(2, 7);
      var panel = h("div", { class: "term-panel", id: id, hidden: true },
        h("ul", null, arr(s.courses).map(function(c){ return h("li", null, c); })));
      var btn = h("button", { class: "term-btn", type: "button", "aria-expanded": "false", "aria-controls": id }, s.term);
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
    var n = ("0" + (i + 1)).slice(-2);
    var row = h("li", { class: "why-row" + (r.image ? (i % 2 ? " flip" : "") : " solo") },
      h("div", { class: "why-box" },
        h("div", { class: "why-num" }, n),
        r.title ? h("h4", null, r.title) : null,
        arr(r.text).map(function(t){ return h("p", null, t); })),
      r.image ? h("figure", { class: "why-fig" },
        zoomable(r.image, r.title, r.caption),
        r.caption ? h("figcaption", null, h("b", null, "FIG. " + (i + 1)), r.caption) : null) : null);
    var p = r.point;
    row._point = Array.isArray(p) && p.length === 2 && isFinite(p[0]) && isFinite(p[1]) ? [+p[0], +p[1]] : null;
    return row;
  }

  function openProject(p, from, fromHistory){
    var overview = arr(p.overview), points = arr(p.points), links = arr(p.links);
    var reasons = arr(p.reasoning).filter(function(r){ return r.title || arr(r.text).length; });
    var pictures = reasons.some(function(r){ return r.image; });
    var side = (points.length || links.length) ? h("div", null,
      points.length ? [h("h3", { class: "kicker" }, "Highlights"), h("ul", null, points.map(function(x){ return h("li", null, x); }))] : null,
      links.length ? h("div", { class: "actions" }, links.map(function(l){ return link(l, "btn"); })) : null) : null;
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
      if (pt) svg.append(svgEl("circle", { class: "halo", cx: X(e), cy: Y(e), r: 15 }));
      svg.append(svgEl("circle", { class: "tip", cx: X(e), cy: Y(e), r: pt ? 6.5 : 5 }));
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
      var photo = photoSrc ? h("img", { class: "headshot", src: photoSrc, alt: S.name ? "Photo of " + S.name : "", fetchpriority: "high" }) : null;
      var hero = h("div", { class: "hero" + (photo ? " has-photo" : "") },
        h("div", null,
          h("h1", { class: "has-dot" }, dot(), S.headline || S.name || ""),
          (S.major || S.school || S.classOf) ? h("div", { class: "sub" },
            S.major ? h("span", null, S.major) : null,
            S.school ? [h("span", { class: "sep", "aria-hidden": "true" }, "/"), h("span", null, S.school)] : null,
            S.classOf ? [h("span", { class: "sep", "aria-hidden": "true" }, "/"), h("span", null, S.classOf)] : null) : null,
          S.bio ? h("p", { class: "bio" }, S.bio) : null,
          h("div", { class: "actions" },
            S.resumePdf ? h("a", { class: "btn primary", href: S.resumePdf, target: "_blank", rel: "noopener" }, "Resume (PDF)") : null,
            arr(S.links).map(function(l){ return link(l, "btn"); })),
          // Only shows on paper: contact details where the buttons were
          h("p", { class: "print-only" }, [email, location.host].concat(arr(S.links).filter(function(l){ return /^https?:/i.test(l.url); }).map(function(l){ return l.url.replace(/^https?:\/\/(www\.)?/i, ""); })).filter(Boolean).join("  ·  "))),
        photo);
      if (photo) photo.addEventListener("error", function(){ photo.remove(); hero.classList.remove("has-photo"); });
      return section(st, "about", hero);
    },

    experience: function(st){ return jobs(st, S.experience); },

    projects: function(st){
      var tags = [];
      projects.forEach(function(p){ arr(p.tags).forEach(function(t){ if (tags.indexOf(t) < 0) tags.push(t); }); });
      var cards = projects.map(function(p){
        var det = (arr(p.points).length || p.role || arr(p.links).length) ? h("details", null,
          h("summary", null, "Details"),
          p.role ? h("div", { class: "role" }, p.role) : null,
          arr(p.points).length ? h("ul", null, arr(p.points).map(function(x){ return h("li", null, x); })) : null,
          arr(p.links).length ? h("div", { class: "plinks" }, arr(p.links).map(function(l){ return link(l); })) : null) : null;
        var img = p.image ? h("img", { src: p.image, alt: "", loading: "lazy" }) : null;
        // No photo yet: show the project's name on a station sign
        var sign = h("span", { class: "sign", "aria-hidden": "true" }, h("span", { class: "sign-bullet" }), h("span", { class: "sign-name" }, p.title));
        var media = h("button", { class: "media", type: "button", "aria-label": "Open full project: " + p.title },
          img || sign,
          h("span", { class: "open-hint", "aria-hidden": "true" }, "Full project", icon("expand")));
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
        return h("div", null, h("h3", null, g.group || ""), h("ul", null, arr(g.items).map(function(x){ return h("li", null, x); })));
      })));
    },

    education: function(st){
      return section(st, "", heading(st), h("div", { class: "edu" }, arr(S.education).map(function(e){
        return h("div", null,
          h("h3", { class: "has-dot" }, small(), e.school || ""),
          h("div", { class: "deg" }, e.degree),
          h("div", { class: "meta" }, e.dates ? h("span", null, e.dates) : null, arr(e.details).map(function(d){ return h("span", null, d); })),
          labeled("Honors", e.honors),
          labeled("Activities", e.activities),
          semesterTabs(e.semesters),
          labeled("Relevant coursework", e.courses));
      })));
    },

    contact: function(st){
      var addr = h("span", { class: "email" }, email);
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
        S.contactNote ? h("p", null, S.contactNote) : null,
        email ? h("div", { class: "email-row" }, addr, copy) : null,
        h("div", { class: "actions" }, arr(S.links).map(function(l){ return link(l, "btn"); })));
    }
  };

  /* ---------- build ---------- */
  var list = document.getElementById("stations"), map = document.getElementById("map");
  map.style.setProperty("--n", N);
  var anchors = [], sections = [], sectionDots = [];
  stations.forEach(function(st){
    var a = h("a", { class: "station", href: "#" + st.id, "aria-current": "false", "aria-label": st.label },
      h("span", { class: "dot", "aria-hidden": "true" }),
      h("span", { class: "name" }, h("span", { class: "long" }, st.label), h("span", { class: "short", "aria-hidden": "true" }, st.short || st.label)));
    list.append(h("li", null, a)); anchors.push(a);
    var before = bigDots.length, sec;
    // A station with no special layout shows the list in content.js with the same name (research: [...]) like Experience
    var render = R[st.id] || (Array.isArray(S[st.id]) ? function(st){ return jobs(st, S[st.id]); } : null);
    try { sec = render ? render(st) : section(st, "", heading(st)); }
    catch (err) {
      console.error(err);
      bigDots.length = before;
      sec = section(st, "", heading(st), h("p", { class: "empty" }, "This section couldn't be shown. Check the " + st.id + " part of content.js."));
    }
    col.append(sec); sections.push(sec);
    sectionDots.push(bigDots[before] || null);
  });

  var foot = document.getElementById("foot");
  var printBtn = h("button", { class: "linkish", type: "button" }, "Save as PDF");
  printBtn.addEventListener("click", function(){ window.print(); });
  foot.append(
    h("span", { class: "grow" }, "© " + new Date().getFullYear() + " " + (S.name || "")),
    arr(S.links).map(function(l){ return link(l); }),
    printBtn);

  // On paper, show everything: project details and every semester
  var opened = [];
  window.addEventListener("beforeprint", function(){
    opened = [].slice.call(document.querySelectorAll("details:not([open])"));
    opened.forEach(function(d){ d.open = true; });
  });
  window.addEventListener("afterprint", function(){ opened.forEach(function(d){ d.open = false; }); });

  /* ---------- rail: runs from the first station dot to the last ---------- */
  var rail = document.getElementById("rail");
  function sizeRail(){
    if (!bigDots.length) { rail.hidden = true; return; }
    var cr = col.getBoundingClientRect();
    var f = bigDots[0].getBoundingClientRect(), l = bigDots[bigDots.length - 1].getBoundingClientRect();
    rail.style.top = (f.top + f.height / 2 - cr.top) + "px";
    rail.style.bottom = (cr.bottom - (l.top + l.height / 2)) + "px";
  }

  /* ---------- the train (stainless subway cars) ---------- */
  var train = document.getElementById("train");
  function car(x, lead){
    var L = 62, s = "";
    s += '<rect class="t-under" x="' + (x + 3) + '" y="16" width="' + (L - 6) + '" height="2.6"/>';
    [[x + 6, x + 16], [x + 46, x + 56]].forEach(function(t){
      s += '<rect class="t-under" x="' + t[0] + '" y="17.6" width="' + (t[1] - t[0]) + '" height="1.6" rx=".8"/>';
      s += '<circle class="t-under" cx="' + (t[0] + 2) + '" cy="19.6" r="1.9"/><circle class="t-under" cx="' + (t[1] - 2) + '" cy="19.6" r="1.9"/>';
    });
    s += '<rect class="t-roof" x="' + (x + 1) + '" y="2" width="' + (L - 2) + '" height="2" rx="1"/>';
    s += '<rect class="t-body" x="' + x + '" y="3" width="' + L + '" height="13.4" rx="1.2"/>';
    s += '<line class="t-belt" x1="' + (x + .5) + '" y1="5" x2="' + (x + L - .5) + '" y2="5"/>';
    s += '<line class="t-belt" x1="' + (x + .5) + '" y1="13.6" x2="' + (x + L - .5) + '" y2="13.6"/>';
    var centers = [7.75, 23.25, 38.75, 54.25];
    centers.forEach(function(c){
      var cx = x + c;
      s += '<rect class="t-door" x="' + (cx - 2.6) + '" y="4.4" width="5.2" height="11.6"/>';
      s += '<rect class="t-glass t-door-glass" x="' + (cx - 2.1) + '" y="6" width="1.6" height="3.8" rx=".3"/>';
      s += '<rect class="t-glass t-door-glass" x="' + (cx + .5) + '" y="6" width="1.6" height="3.8" rx=".3"/>';
      s += '<line class="t-seam" x1="' + cx + '" y1="4.4" x2="' + cx + '" y2="16"/>';
    });
    for (var k = 0; k < 3; k++) {
      var a = x + centers[k] + 3.2, b = x + centers[k + 1] - 3.2, w = (b - a - 1) / 2;
      s += '<rect class="t-glass" x="' + a + '" y="6" width="' + w + '" height="3.8" rx=".4"/>';
      s += '<rect class="t-glass" x="' + (a + w + 1) + '" y="6" width="' + w + '" height="3.8" rx=".4"/>';
    }
    s += '<circle class="t-route" cx="' + (x + 31) + '" cy="11.6" r="1.1"/>';
    s += '<rect class="t-cab" x="' + (x + .9) + '" y="6" width="1.8" height="3.8" rx=".3"/>';
    if (lead) {
      s += '<rect class="t-cab" x="' + (x + L - 2.6) + '" y="5.4" width="2.2" height="5" rx=".4"/>';
      s += '<circle class="t-lamp" cx="' + (x + L - .9) + '" cy="14.6" r=".8"/>';
    } else {
      s += '<rect class="t-cab" x="' + (x + L - 2.7) + '" y="6" width="1.8" height="3.8" rx=".3"/>';
    }
    return s;
  }
  train.innerHTML = '<svg viewBox="0 0 126 22" xmlns="http://www.w3.org/2000/svg">' +
    '<defs><linearGradient id="steel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3f5f6"/><stop offset=".55" stop-color="#cfd4d8"/><stop offset="1" stop-color="#b4babf"/></linearGradient></defs>' +
    car(0, false) +
    '<rect class="t-under" x="62" y="6" width="2" height="9"/><rect class="t-under" x="61" y="13" width="4" height="1.4"/>' +
    car(64, true) + '</svg>';

  /* ---------- train motion ---------- */
  var pauseBtn = document.getElementById("pause");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var T = { x: 0, v: 0, at: 0, target: 0, dir: 1, face: 1, dwellUntil: 0, held: false, paused: false, last: 0, active: -1 };
  var C = [], W = 0, TW = 150;
  try { T.paused = localStorage.getItem("trainPaused") === "1"; } catch (e) {}

  function measure(){
    var mr = map.getBoundingClientRect(), oldW = W;
    W = mr.width; TW = train.offsetWidth || 150;
    C = anchors.map(function(a){ var d = a.querySelector(".dot").getBoundingClientRect(); return d.left + d.width / 2 - mr.left; });
    if (oldW && W) T.x = T.x * (W / oldW);
    sizeRail();
  }
  function xFor(i){ return Math.max(0, Math.min(W - TW, C[i] - TW / 2)); }
  function place(){ train.style.transform = "translateX(" + T.x.toFixed(1) + "px)"; train.classList.toggle("flip", T.face < 0); }
  function doors(open){ train.classList.toggle("open", open); }
  function arrive(now){
    T.at = T.target; T.x = xFor(T.at); T.v = 0; place(); doors(true);
    T.dwellUntil = now + (T.held ? 6500 : 2400); T.held = false;
  }
  function pickNext(){
    if (T.at + T.dir > N - 1 || T.at + T.dir < 0) T.dir = -T.dir;
    T.target = T.at + T.dir;
  }
  function dispatch(i){
    if (N < 2) return;
    T.target = i; T.held = true; T.dwellUntil = 0; doors(false);
    if (i > T.at) T.dir = 1; else if (i < T.at) T.dir = -1;
    if (reduce.matches || T.paused) { T.at = i; T.x = xFor(i); place(); }
  }
  function frame(now){
    requestAnimationFrame(frame);
    var dt = T.last ? Math.min(0.05, (now - T.last) / 1000) : 0; T.last = now;
    if (T.paused || reduce.matches || N < 2 || !W) return;
    if (now < T.dwellUntil) return;
    if (train.classList.contains("open")) { doors(false); pickNext(); }
    var d = xFor(T.target) - T.x, s = d >= 0 ? 1 : -1;
    var vmax = Math.max(70, W * 0.16), a = vmax * 1.3;
    if (Math.abs(d) < 0.8) { arrive(now); return; }
    if (s !== T.face) { T.face = s; T.v = 0; }
    if (Math.abs(d) <= (T.v * T.v) / (2 * a) + 1) T.v = Math.max(8, T.v - a * dt);
    else T.v = Math.min(vmax, T.v + a * dt);
    var step = s * T.v * dt;
    if (Math.abs(step) >= Math.abs(d)) step = d;
    T.x += step; place();
  }
  function setPaused(p){
    T.paused = p;
    pauseBtn.setAttribute("aria-pressed", p ? "true" : "false");
    pauseBtn.setAttribute("aria-label", p ? "Resume train" : "Pause train");
    pauseBtn.querySelector(".txt").textContent = p ? "Resume train" : "Pause train";
    pauseBtn.querySelector("svg").innerHTML = p ? '<path d="M2 1l9 5-9 5z"/>' : '<rect x="1" y="1" width="3.5" height="10"/><rect x="7.5" y="1" width="3.5" height="10"/>';
    if (!p) { T.last = 0; T.dwellUntil = 0; }
    try { localStorage.setItem("trainPaused", p ? "1" : "0"); } catch (e) {}
  }
  pauseBtn.addEventListener("click", function(){ setPaused(!T.paused); });

  /* ---------- active station (map + page) ---------- */
  function setActive(i){
    if (T.active === i) return;
    T.active = i;
    anchors.forEach(function(a, k){ a.setAttribute("aria-current", k === i ? "true" : "false"); });
    sectionDots.forEach(function(d, k){ if (d) d.classList.toggle("on", k === i); });
  }
  var scrollTimer = null;
  anchors.forEach(function(a, i){ a.addEventListener("click", function(){ setActive(i); dispatch(i); }); });
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (!en.isIntersecting) return;
        var i = sections.indexOf(en.target);
        if (i < 0 || i === T.active) return;
        setActive(i);
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(function(){ dispatch(i); }, 350);
      });
    }, { rootMargin: "-35% 0px -60% 0px" });
    sections.forEach(function(s){ io.observe(s); });
  }

  // Opening and closing projects with the browser's Back and Forward buttons
  function projectFromHash(){ var m = /^#project-(.+)$/.exec(location.hash); return m ? bySlug[m[1]] : null; }
  window.addEventListener("popstate", function(){
    var p = projectFromHash();
    if (p) { if (!pd.open) openProject(p, null, true); }
    else if (pd.open) { pushed = false; pd.close(); }
  });

  /* ---------- start ---------- */
  measure();
  var linked = projectFromHash();
  var start = Math.max(0, stations.findIndex(function(s){ return "#" + s.id === location.hash || (linked && s.id === "projects"); }));
  // Links like darrenke.com/#projects: the sections didn't exist yet when the browser looked for them
  if (start > 0) { root.style.scrollBehavior = "auto"; sections[start].scrollIntoView(); root.style.scrollBehavior = ""; }
  setActive(start);
  T.at = start; T.x = xFor(start); place();
  T.dir = start >= N - 1 ? -1 : 1; T.target = T.at;
  doors(true); T.dwellUntil = performance.now() + 1200;
  setPaused(T.paused);
  requestAnimationFrame(frame);
  if (linked) openProject(linked, null, true);
  window.addEventListener("resize", function(){ measure(); if (T.paused || reduce.matches) { T.x = xFor(T.at); place(); } });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ measure(); place(); });
  col.addEventListener("toggle", sizeRail, true);
  // Keeps the line the right length when photos load or semesters open
  if ("ResizeObserver" in window) new ResizeObserver(function(){ sizeRail(); }).observe(col);
  }
})();
