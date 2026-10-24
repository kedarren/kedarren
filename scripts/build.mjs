// Runs on Vercel before every update goes live (see vercel.json).
// 1. Checks content.js. If it has a typo, this stops the update and your live site stays as it was.
// 2. Copies the public files into dist/, which is what Vercel publishes, and writes the sitemap.
import { readFileSync, existsSync, mkdirSync, rmSync, cpSync, readdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "dist");
const SITE_URL = "https://darrenke.com";

function fail(lines) {
  console.error("\n" + lines.join("\n") + "\n\nYour live site has not changed. Fix this in content.js and commit again.\n");
  process.exit(1);
}

// ---- 1. content.js has to run and set window.SITE
const sandbox = { window: {} };
try {
  vm.runInNewContext(readFileSync(join(root, "content.js"), "utf8"), sandbox, { filename: "content.js" });
} catch (err) {
  const at = /content\.js:(\d+)/.exec(String(err.stack));
  fail([
    "✗ content.js has a typo" + (at ? " near line " + at[1] : "") + ": " + err.message,
    "  The mistake is usually on that line or the one just above it: a missing comma, quote mark or bracket."
  ]);
}
const S = sandbox.window.SITE;
if (!S || typeof S !== "object") fail(["✗ content.js ran, but it no longer starts with  window.SITE = {"]);

// Warnings only: things that won't break the site but are probably mistakes
const placeholder = (s) => /^\s*\[[^\]]*\]\s*$/.test(s);
const files = [];
(function walk(v, key) {
  if (typeof v === "string") {
    if (["image", "photo", "resumePdf"].includes(key) && v && !placeholder(v) && !/^https?:/i.test(v)) files.push(v);
  } else if (Array.isArray(v)) v.forEach((x) => walk(x, key));
  else if (v && typeof v === "object") Object.keys(v).forEach((k) => walk(v[k], k));
})(S);
for (const f of files) {
  if (!existsSync(join(root, f.replace(/^\//, "")))) console.warn(`! content.js mentions ${f}, but that file isn't uploaded yet. The site will leave it out.`);
}
for (const st of S.stations || []) {
  const builtIn = ["about", "experience", "projects", "skills", "education", "contact"];
  if (!builtIn.includes(st.id) && !Array.isArray(S[st.id])) console.warn(`! The "${st.id}" station has no matching ${st.id}: [ ... ] list, so its section will be empty.`);
}

// ---- 2. Copy everything visitors need into dist/
const keepOut = new Set(["dist", "scripts", "node_modules", "README.md", "vercel.json", "package.json"]);
rmSync(out, { recursive: true, force: true });
mkdirSync(out);
for (const name of readdirSync(root)) {
  if (keepOut.has(name) || name.startsWith(".")) continue;
  cpSync(join(root, name), join(out, name), { recursive: true });
}
// Vercel Web Analytics: Vercel gives each project its own script path at build time
if (process.env.VERCEL) {
  const basePath = (process.env.VERCEL_OBSERVABILITY_BASEPATH || "/_vercel").replace(/\/$/, "");
  const tag = `<script defer src="${basePath}/insights/script.js" data-endpoint="${basePath}/insights"></script>\n</body>`;
  for (const page of ["index.html", "404.html"]) {
    const file = join(out, page);
    writeFileSync(file, readFileSync(file, "utf8").replace("</body>", tag));
  }
  console.log(`✓ Web Analytics script added from ${basePath}/insights`);
}

const today = new Date().toISOString().slice(0, 10);
writeFileSync(join(out, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${SITE_URL}/</loc><lastmod>${today}</lastmod></url>\n</urlset>\n`);

const count = (k) => (Array.isArray(S[k]) ? S[k].length : 0);
console.log(`✓ content.js looks good: ${count("stations")} stations, ${count("projects")} project(s), ${count("research")} research and ${count("experience")} experience entries.`);
