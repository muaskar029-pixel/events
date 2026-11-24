#!/bin/sh
# Bundle + minify the readable sources (assets/site.css, assets/site.js) into the files the pages load,
# then inline the CSS bundle into every served page so first paint needs no extra request.
set -e
cd "$(dirname "$0")"
npx -y esbuild assets/site.css --minify --log-level=warning --outfile=assets/css/events.bundle.css
npx -y esbuild assets/site.js --minify --log-level=warning --outfile=assets/js/events.bundle.js
node - <<'EOF'
const fs = require("fs");
const path = require("path");
const css = fs.readFileSync("assets/css/events.bundle.css", "utf8").trim();
if (/<\/style/i.test(css)) throw new Error("bundle contains </style>");
// Served pages only; templates/ keep the <link> until a page generated from them is built here.
const pages = ["index.html", "404.html"];
for (const dir of ["workshop", "bootcamp"]) {
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name === "index.html") pages.push(p);
    }
  })(dir);
}
const re = /<link rel="stylesheet" href="[^"]*events\.bundle\.css">|<style data-bundle>[\s\S]*?<\/style>/;
for (const p of pages) {
  const html = fs.readFileSync(p, "utf8");
  if (!re.test(html)) throw new Error(p + ": no CSS bundle tag");
  fs.writeFileSync(p, html.replace(re, () => "<style data-bundle>" + css + "</style>"));
}
console.log("inlined CSS into " + pages.length + " pages");
EOF
