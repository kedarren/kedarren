/* Renders every page of the site from content.js. You shouldn't need to edit this file: change content.js instead. */
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
  var main = document.getElementById("main");

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
  /* A single value counts as a one-item list, so a forgotten [ ] in content.js still shows up */
  var arr = function(x){ return Array.isArray(x) ? x : (x == null || x === "" ? [] : [x]); };
  function pad(n){ return ("0" + n).slice(-2); }
  function slug(s){ return String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""); }
  function ext(url){ return /^https?:/i.test(url) ? { target: "_blank", rel: "noopener" } : {}; }
  function inner(href, cls, text){ return h("a", { href: href, class: cls || null, "data-link": true }, text); }

  if (!window.SITE) {
    var E = window.SITE_ERROR;
    main.append(h("section", { class: "page" }, h("div", { class: "notice" },
      h("h1", { class: "page-title" }, E && E.line ? "content.js has a typo" : "content.js didn't load"),
      E && E.line
        ? [h("p", null, "The browser stopped reading content.js at line " + E.line + ". The mistake is usually on that line or the one just above it: a missing comma, quote mark or bracket."),
           h("p", { class: "mono" }, "Browser message: " + E.message)]
        : h("p", null, "Check that content.js is uploaded next to index.html and has no missing commas or quote marks."))));
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
  var projects = arr(S.projects).filter(function(p){ return p.title; });
  projects.forEach(function(p){ p._slug = slug(p.title); });
  var research = arr(S.research).filter(function(r){ return r.org || r.title; });
  var email = S.email || "";

  /* ---------- shared pieces ---------- */
  var TABS = [["about", "About"], ["education", "Education"], ["resume", "Resume"], ["projects", "Projects"], ["research", "Research"], ["contact", "Contact"]];
  function head(key, title, lead){
    var i = TABS.findIndex(function(t){ return t[0] === key; });
    return h("div", { class: "page-head" },
      h("p", { class: "index" }, pad(i + 1) + " / " + TABS[i][1]),
      h("div", { class: "head-body" }, h("h1", { class: "page-title", tabindex: "-1" }, title), lead ? h("p", { class: "lead" }, lead) : null));
  }
  function section(title, more){ return h("div", { class: "section-head" }, h("h2", null, title), more || null); }
  function row(label, body, cls){ return h("div", { class: "row" + (cls ? " " + cls : "") }, h("div", { class: "row-label" }, label), h("div", { class: "row-body" }, body)); }
  function tags(list){ return arr(list).length ? h("ul", { class: "tags", "aria-label": "Tools and methods" }, arr(list).map(function(t){ return h("li", null, t); })) : null; }
  function bullets(list){ return arr(list).length ? h("ul", null, arr(list).map(function(p){ return h("li", null, p); })) : null; }
  function entry(title, org, points){ return h("div", { class: "entry" }, h("h3", null, title), org ? h("p", { class: "org" }, org) : null, bullets(points)); }

  /* ---------- pages ---------- */
  function home(){
    var facts = arr(S.facts).filter(function(f){ return f.value; });
    var listed = projects.filter(function(p){ return p.featured; }).concat(projects.filter(function(p){ return !p.featured; }));
    var now = research.filter(function(r){ return r.current; })[0] || research[0];
    return h("div", { class: "home" },
      h("div", { class: "home-hero" }, h("h1", { class: "statement", tabindex: "-1" }, h("span", { class: "vh" }, (S.name || "") + ": "), S.statement || S.name)),
      facts.length ? h("div", { class: "facts" }, facts.map(function(f, i){
        return h("div", { class: "fact" }, h("p", { class: "label" }, h("span", { class: "index" }, pad(i + 1)), f.label), h("p", null, f.value));
      })) : null,
      listed.length ? h("section", { class: "section", "aria-labelledby": "work-h" },
        h("div", { class: "section-head" }, h("h2", { id: "work-h" }, "Selected work"), inner("/projects", "more", "All projects")),
        h("ul", { class: "work-list" }, listed.slice(0, 4).map(function(p, i){
          return h("li", { class: "work-item" }, h("a", { class: "work-link", href: "/projects/" + p._slug, "data-link": true },
            h("span", { class: "index" }, pad(i + 1)),
            h("span", { class: "w-title" }, p.title),
            h("span", { class: "w-meta" }, [p.context, p.dates].filter(Boolean).join(" · ")),
            h("span", { class: "w-go", "aria-hidden": "true" }, "View →")));
        }))) : null,
      now ? h("section", { class: "section", "aria-labelledby": "now-h" },
        h("div", { class: "section-head" }, h("h2", { id: "now-h" }, now.current ? "Current research" : "Research"), inner("/research", "more", "Research")),
        h("div", { class: "feature" },
          h("div", { class: "f-meta" }, h("p", { class: "dates" }, now.dates), now.current ? h("p", { class: "status" }, "Current") : null),
          h("div", { class: "f-body" }, h("h3", null, now.org), h("p", null, now.summary || arr(now.points)[0])))) : null);
  }

  function about(){
    var photo = S.photo ? h("img", { src: "/" + S.photo.replace(/^\//, ""), alt: "Portrait of " + (S.name || ""), width: 480, height: 600 }) : null;
    var fig = photo ? h("figure", { class: "portrait" }, photo) : null;
    if (photo) photo.addEventListener("error", function(){ fig.remove(); });
    var exp = arr(S.experience).filter(function(x){ return x.title; });
    var skills = arr(S.skills).filter(function(g){ return arr(g.items).length; });
    return h("section", { class: "page" },
      head("about", "About"),
      h("div", { class: "about-grid" }, fig, h("div", { class: "about-text" }, arr(S.about).map(function(p){ return h("p", null, p); }))),
      exp.length ? h("section", { class: "section", "aria-labelledby": "exp-h" }, h("div", { class: "section-head" }, h("h2", { id: "exp-h" }, "Experience and leadership")),
        exp.map(function(x){ return row(h("p", { class: "dates" }, x.dates), entry(x.title, x.org, x.points)); })) : null,
      skills.length ? h("section", { class: "section", "aria-labelledby": "skills-h" }, h("div", { class: "section-head" }, h("h2", { id: "skills-h" }, "Skills")),
        skills.map(function(g){ return row(h("p", { class: "label" }, g.group), h("p", null, arr(g.items).join(" · "))); })) : null);
  }

  function education(){
    return h("section", { class: "page" },
      head("education", "Education"),
      arr(S.education).filter(function(e){ return e.school; }).map(function(e){
        return [
          row(h("p", { class: "dates" }, e.dates), h("div", { class: "school" },
            h("h2", null, e.school), h("p", { class: "degree" }, e.degree),
            h("div", { class: "meta" }, e.place ? h("span", null, e.place) : null, arr(e.details).map(function(d){ return h("span", null, d); }))), "strong"),
          arr(e.distinctions).length ? row(h("p", { class: "label" }, "Distinctions and activities"), h("ul", { class: "plain-list" }, arr(e.distinctions).map(function(d){ return h("li", null, d); }))) : null,
          arr(e.semesters).filter(function(s){ return s.term; }).length ? h("section", { class: "section", "aria-labelledby": "courses-h" },
            h("div", { class: "section-head" }, h("h2", { id: "courses-h" }, "Coursework")),
            arr(e.semesters).filter(function(s){ return s.term; }).map(function(s){
              return row(h("p", { class: "label" }, s.term), h("ul", { class: "courses" }, arr(s.courses).map(function(c){
                // "MENG 3125: Machine Elements" -> course code in mono beside the title
                var m = /^([A-Z]{2,5} [A-Z]?\d{2,4}[A-Z]?):\s*(.+)$/.exec(c);
                return h("li", null, m ? [h("span", { class: "code" }, m[1]), h("span", null, m[2])] : h("span", null, c));
              })));
            })) : null
        ];
      }));
  }

  function resume(){
    var R = S.resume || {}, pdf = "/" + String(R.pdf || "resume.pdf").replace(/^\//, "");
    return h("section", { class: "page" },
      head("resume", "Resume", R.updated ? "One page, updated " + R.updated + "." : null),
      h("div", { class: "resume-grid" },
        h("div", { class: "resume-side" },
          h("p", { class: "label" }, "PDF"),
          h("div", { class: "actions" },
            h("a", { class: "btn primary", href: pdf, download: (S.name || "Resume").replace(/\s+/g, "-") + "-Resume.pdf" }, "Download PDF"),
            h("a", { class: "btn", href: pdf, target: "_blank", rel: "noopener" }, "Open in a new tab"))),
        R.preview ? h("a", { class: "resume-sheet", href: pdf, target: "_blank", rel: "noopener", "aria-label": "Open the resume PDF" },
          h("img", { src: "/" + R.preview.replace(/^\//, ""), alt: "Page one of " + (S.name || "the") + " resume", width: 1445, height: 1870 })) : null));
  }

  function projectsPage(){
    return h("section", { class: "page" },
      head("projects", "Engineering projects", "Design, fabrication and testing work from labs, teams and coursework."),
      projects.length ? h("ul", { class: "project-list" }, projects.map(function(p, i){
        var thumb = p.image ? h("div", { class: "thumb" }, h("img", { src: "/" + p.image.replace(/^\//, ""), alt: "", loading: "lazy" })) : null;
        return h("li", { class: "project-item" }, h("a", { class: "project-link", href: "/projects/" + p._slug, "data-link": true },
          h("div", { class: "p-meta" }, h("span", { class: "index" }, pad(i + 1)), h("span", { class: "dates" }, p.dates), h("span", { class: "label" }, p.context)),
          h("div", { class: "p-body" }, thumb, h("h2", null, p.title), p.summary ? h("p", null, p.summary) : null, tags(p.tags)),
          h("span", { class: "p-go", "aria-hidden": "true" }, "Read →")));
      })) : h("p", { class: "lead" }, "Projects coming soon."));
  }

  function projectPage(p){
    var i = projects.indexOf(p), prev = projects[i - 1], next = projects[i + 1];
    var reasons = arr(p.reasoning).filter(function(r){ return r.title || arr(r.text).length; });
    var spec = [["Role", p.role], ["Context", p.context], ["Dates", p.dates], ["Tools", arr(p.tags).join(", ")]].filter(function(s){ return s[1]; });
    return h("article", { class: "page" },
      h("p", { class: "crumbs" }, inner("/projects", null, "Projects"), h("span", { "aria-hidden": "true" }, "/"), h("span", null, pad(i + 1))),
      h("div", { class: "page-head" }, h("p", { class: "index" }, pad(i + 1) + " / Projects"),
        h("div", { class: "head-body" }, h("h1", { class: "page-title", tabindex: "-1" }, p.title), p.summary ? h("p", { class: "lead" }, p.summary) : null)),
      spec.length ? h("dl", { class: "spec" }, spec.map(function(s){ return h("div", null, h("dt", { class: "label" }, s[0]), h("dd", null, s[1])); })) : null,
      p.image ? h("figure", { class: "figure" }, zoomable(p.image, p.title, p.caption), p.caption ? h("figcaption", null, p.caption) : null) : null,
      arr(p.overview).length ? h("section", { class: "section" }, section("Overview"), h("div", { class: "row" }, h("div", { class: "row-label" }), h("div", { class: "row-body prose" }, arr(p.overview).map(function(t){ return h("p", null, t); })))) : null,
      arr(p.points).length ? h("section", { class: "section" }, section("Highlights"), h("div", { class: "row" }, h("div", { class: "row-label" }), h("div", { class: "row-body" }, h("ul", { class: "check" }, arr(p.points).map(function(t){ return h("li", null, t); }))))) : null,
      reasons.length ? h("section", { class: "section" }, section("Design decisions"), h("div", { class: "row" }, h("div", { class: "row-label" }), h("div", { class: "row-body" },
        h("ol", { class: "decisions" }, reasons.map(function(r, k){
          var li = h("li", { class: "decision" + (r.image ? " has-fig" : "") },
            h("span", { class: "index d-no" }, pad(k + 1)),
            h("div", { class: "d-text" }, r.title ? h("h3", null, r.title) : null, arr(r.text).map(function(t){ return h("p", null, t); })),
            r.image ? h("figure", { class: "d-fig" }, zoomable(r.image, r.title, r.caption), r.caption ? h("figcaption", null, "Fig. " + (k + 1) + " · " + r.caption) : null) : null);
          var pt = r.point; li._point = Array.isArray(pt) && pt.length === 2 && isFinite(pt[0]) && isFinite(pt[1]) ? [+pt[0], +pt[1]] : null;
          return li;
        }))))) : null,
      arr(p.links).length ? h("div", { class: "section actions" }, arr(p.links).map(function(l){ return h("a", Object.assign({ class: "btn", href: l.url }, ext(l.url)), l.label); })) : null,
      (prev || next) ? h("nav", { class: "pager", "aria-label": "More projects" },
        prev ? h("a", { href: "/projects/" + prev._slug, "data-link": true }, h("span", { class: "label" }, "Previous"), h("span", null, prev.title)) : h("span"),
        next ? h("a", { href: "/projects/" + next._slug, "data-link": true }, h("span", { class: "label" }, "Next"), h("span", null, next.title)) : null) : null);
  }

  function researchPage(){
    return h("section", { class: "page" },
      head("research", "Research"),
      research.map(function(r, i){
        return row([h("p", { class: "dates" }, r.dates), r.current ? h("p", { class: "status" }, "Current") : null],
          h("div", { class: "entry" }, h("h2", null, r.org), h("p", { class: "org" }, r.title), r.summary ? h("p", { class: "summary" }, r.summary) : null, bullets(r.points), tags(r.methods)), i === 0 ? "strong" : "");
      }));
  }

  function contact(){
    var copy = h("button", { class: "btn copy", type: "button" }, "Copy email address");
    copy.addEventListener("click", function(){
      var done = function(t){ copy.textContent = t; setTimeout(function(){ copy.textContent = "Copy email address"; }, 2000); };
      try { navigator.clipboard.writeText(email).then(function(){ done("Copied"); }, function(){ done("Copy failed: select the address instead"); }); } catch (e) { done("Copy failed: select the address instead"); }
    });
    var rows = arr(S.links).map(function(l){ return [l.label, h("a", Object.assign({ href: l.url }, ext(l.url)), l.url.replace(/^https?:\/\/(www\.)?/i, ""))]; })
      .concat([["Location", S.location], ["Resume", S.resume ? inner("/resume", null, "View or download") : null]])
      .filter(function(r){ return r[1]; });
    return h("section", { class: "page" },
      head("contact", "Contact", S.contactNote),
      email ? h("div", { class: "row strong" }, h("div", { class: "row-label" }, h("p", { class: "label" }, "Write to")), h("div", { class: "row-body" }, h("a", { class: "contact-email", href: "mailto:" + email }, email), h("div", null, copy))) : null,
      h("div", { class: "contact-rows" }, rows.map(function(r){ return row(h("p", { class: "label" }, r[0]), h("p", null, r[1])); })));
  }

  function notFound(){
    return h("section", { class: "page" }, h("div", { class: "notice" },
      h("p", { class: "index" }, "404"),
      h("h1", { class: "page-title", tabindex: "-1" }, "Page not found"),
      h("p", null, "The link may have a typo, or the page may have moved."),
      h("div", { class: "actions" }, inner("/", "btn primary", "Go to the home page"), inner("/projects", "btn", "See projects"))));
  }

  /* ---------- pictures, the full-size viewer and decision lines ---------- */
  var lb = h("dialog", { class: "lightbox", "aria-label": "Full-size image" });
  var lbImg = h("img", { alt: "" }), lbCap = h("p");
  var lbClose = h("button", { class: "close", type: "button" }, "Close");
  lb.append(lbClose, h("div", { class: "lb-in" }, lbImg, lbCap));
  document.body.append(lb);
  var lbFrom = null;
  lb.addEventListener("click", function(e){ if (e.target !== lbImg) lb.close(); });
  lb.addEventListener("close", function(){ if (lbFrom) lbFrom.focus(); });
  function zoomable(src, alt, caption){
    src = "/" + src.replace(/^\//, "");
    var img = h("img", { src: src, alt: alt || "" });
    var btn = h("button", { class: "zoom", type: "button", "aria-label": "View full size" + (alt ? ": " + alt : "") }, img);
    img.addEventListener("load", drawLeaders);
    img.addEventListener("error", function(){ btn.replaceWith(h("div", { class: "ph" }, "Couldn't find " + src + ". Check that it's uploaded and the name matches exactly.")); drawLeaders(); });
    btn.addEventListener("click", function(){ lbImg.src = src; lbImg.alt = alt || ""; lbCap.textContent = caption || ""; lbFrom = btn; lb.showModal(); });
    return btn;
  }
  var NS = "http://www.w3.org/2000/svg";
  function svgEl(tag, attrs){ var e = document.createElementNS(NS, tag); Object.keys(attrs).forEach(function(k){ e.setAttribute(k, attrs[k]); }); return e; }
  function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }
  // From each decision's text to its spot on the photo (point: [percent from left, percent from top])
  function drawLeaders(){
    main.querySelectorAll(".decision.has-fig").forEach(function(row){
      var old = row.querySelector(".leader"); if (old) old.remove();
      var box = row.querySelector(".d-text"), t = row.querySelector(".d-fig img, .d-fig .ph");
      if (!box || !t) return;
      var R = row.getBoundingClientRect(), b = box.getBoundingClientRect(), m = t.getBoundingClientRect();
      if (!m.width || !m.height) return;
      var pt = row._point, tx, ty, pts;
      if (pt) { tx = m.left + clamp(pt[0], 0, 100) / 100 * m.width; ty = m.top + clamp(pt[1], 0, 100) / 100 * m.height; }
      if (m.top >= b.bottom - 1) {
        if (!pt) { tx = m.left + m.width / 2; ty = m.top; }
        var sx = clamp(tx, b.left + 12, b.right - 12);
        pts = [[sx, b.bottom + 4], [tx, ty]];
      } else {
        var sy = pt ? clamp(ty, b.top + 12, b.bottom - 12) : b.top + 14;
        if (!pt) { tx = m.left; ty = clamp(sy, m.top + 12, m.bottom - 12); }
        pts = [[b.right + 6, sy], [b.right + 18, sy], [tx, ty]];
      }
      var X = function(p){ return (p[0] - R.left).toFixed(1); }, Y = function(p){ return (p[1] - R.top).toFixed(1); };
      var svg = svgEl("svg", { class: "leader", "aria-hidden": "true", width: R.width.toFixed(1), height: R.height.toFixed(1) });
      svg.append(svgEl("path", { d: pts.map(function(p, k){ return (k ? "L" : "M") + X(p) + " " + Y(p); }).join(" ") }));
      svg.append(svgEl("circle", { class: "tail", cx: X(pts[0]), cy: Y(pts[0]), r: 2.5 }));
      svg.append(svgEl("circle", { class: "tip", cx: X(pts[pts.length - 1]), cy: Y(pts[pts.length - 1]), r: pt ? 5 : 3.5 }));
      row.append(svg);
    });
  }
  window.addEventListener("resize", drawLeaders);

  /* ---------- routing: each tab has its own address, like darrenke.com/projects ---------- */
  var canonical = document.querySelector('link[rel="canonical"]');
  var baseTitle = document.title;
  function resolve(path){
    var parts = path.replace(/\/index\.html$/, "").split("/").filter(Boolean);
    var key = parts[0] || "";
    if (!key) return { key: "", view: home, title: baseTitle };
    if (key === "projects" && parts[1]) {
      // Old addresses listed under "aliases" in content.js still find the project
      var p = projects.filter(function(x){ return x._slug === parts[1] || arr(x.aliases).indexOf(parts[1]) > -1; })[0];
      if (p && p._slug !== parts[1]) history.replaceState(null, "", "/projects/" + p._slug);
      return p ? { key: "projects", view: function(){ return projectPage(p); }, title: p.title + " · " + (S.name || "") } : { key: "", view: notFound, title: "Page not found · " + (S.name || "") };
    }
    var views = { about: about, education: education, resume: resume, projects: projectsPage, research: researchPage, contact: contact };
    var tab = TABS.filter(function(t){ return t[0] === key; })[0];
    if (!views[key] || parts.length > 1) return { key: "", view: notFound, title: "Page not found · " + (S.name || "") };
    return { key: key, view: views[key], title: tab[1] + " · " + (S.name || "") };
  }
  function render(focus){
    var r = resolve(location.pathname);
    var page;
    try { page = r.view(); } catch (err) { console.error(err); page = h("section", { class: "page" }, h("div", { class: "notice" }, h("h1", { class: "page-title", tabindex: "-1" }, "This page couldn't be shown"), h("p", null, "Check this part of content.js for a mistake."))); }
    main.replaceChildren(page);
    document.title = r.title;
    if (canonical) canonical.href = "https://darrenke.com" + (location.pathname === "/" ? "/" : location.pathname.replace(/\/+$/, ""));
    var bar = document.querySelector(".tabs"), current = null;
    document.querySelectorAll(".tabs a").forEach(function(a){ var on = a.getAttribute("href") === "/" + r.key; a.setAttribute("aria-current", on ? "page" : "false"); if (on) current = a; });
    // On phones the tab row scrolls sideways: bring the current tab into view
    if (bar && current && bar.scrollWidth > bar.clientWidth) bar.scrollLeft = Math.max(0, current.offsetLeft - (bar.clientWidth - current.offsetWidth) / 2);
    drawLeaders();
    if (focus) { var t = main.querySelector("h1"); if (t) t.focus({ preventScroll: true }); }
  }
  function navigate(href){
    if (href === location.pathname) { window.scrollTo(0, 0); return; }
    history.pushState(null, "", href);
    window.scrollTo(0, 0);
    render(true);
  }
  document.addEventListener("click", function(e){
    var a = e.target.closest && e.target.closest("a[data-link]");
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(a.getAttribute("href"));
  });
  window.addEventListener("popstate", function(){ render(true); });

  // Links from the old site (darrenke.com/#projects, /#project-name) still land in the right place
  var legacy = /^#project-(.+)$/.exec(location.hash) ? "/projects/" + location.hash.slice(9) : /^#(about|education|projects|research|contact)$/.test(location.hash) ? "/" + location.hash.slice(1) : null;
  if (legacy && location.pathname === "/") history.replaceState(null, "", legacy);

  /* ---------- footer ---------- */
  var footer = document.getElementById("footer");
  add(footer, [
    h("p", null, "© " + new Date().getFullYear() + " " + (S.name || "")),
    h("nav", { "aria-label": "Elsewhere" },
      email ? h("a", { href: "mailto:" + email }, "Email") : null,
      arr(S.links).map(function(l){ return h("a", Object.assign({ href: l.url }, ext(l.url)), l.label); }),
      S.resume ? h("a", { href: "/" + String(S.resume.pdf || "resume.pdf").replace(/^\//, "") }, "Resume (PDF)") : null)
  ]);

  render(false);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawLeaders);
  }
})();
