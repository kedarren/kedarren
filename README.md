# darrenke.com

Darren Ke's personal site. Hand-built HTML, CSS and JavaScript with no framework, hosted on Vercel.

## Editing the site

Everything the site says lives in **`content.js`**. To change it:

1. Open `content.js` on GitHub and click the pencil icon.
2. Edit the text between the quote marks.
3. Click **Commit changes**. The live site updates in about a minute.

If an edit has a typo (a missing comma, quote mark or bracket), the update doesn't go live and the site stays exactly as it was. Vercel emails you, and the failed check on the commit says which line to fix.

Anything still written as a `"[placeholder in square brackets]"` is hidden on the site until you replace it.

## Adding photos

1. Save photos as JPG or WebP, about 1600px wide and under 500 KB. Phone photos are usually too big; [squoosh.app](https://squoosh.app) shrinks them in the browser.
2. On GitHub, open the `images` folder (or create it), then **Add file → Upload files**.
3. Point to the file in `content.js` with the same name and capitalization, e.g. `image: "images/knife.jpg"`.

Your headshot goes next to `index.html` as `headshot.png` (or change the `image:` line at the top of `content.js`).

In a project's `reasoning` list, give a decision an `image` and a `point: [left %, top %]` and a line is drawn from the text box to that spot on the photo.

## Sharing

- Each project has its own link: `darrenke.com/#project-` followed by its title in lowercase with dashes, e.g. `darrenke.com/#project-foot-operated-kitchen-knife`.
- "Save as PDF" in the footer prints the whole site as a clean one-column resume.
- When a link is shared (LinkedIn, iMessage, Slack), the preview uses `assets/og.png`.

## What each file does

| File | What it is | Edit it? |
| --- | --- | --- |
| `content.js` | All the words, links, projects, courses | Yes |
| `images/` | Your photos | Yes |
| `index.html` | Page skeleton, search-engine and link-preview info | Rarely (title and description at the top) |
| `assets/site.css`, `assets/site.js` | Design and behavior | No |
| `assets/fonts/` | Archivo, self-hosted (SIL Open Font License) | No |
| `404.html` | The "station not in service" page | No |
| `vercel.json` | Hosting settings and security headers | No |
| `scripts/build.mjs` | Checks `content.js` before each update goes live | No |
| `favicon.*`, `apple-touch-icon.png`, `site.webmanifest`, `robots.txt` | Browser icons and search-engine files | No |
