#!/bin/sh
# Bundle + minify the readable sources (assets/site.css, assets/site.js) into the files the pages load.
set -e
cd "$(dirname "$0")"
npx -y esbuild assets/site.css --minify --log-level=warning --outfile=assets/css/events.bundle.css
npx -y esbuild assets/site.js --minify --log-level=warning --outfile=assets/js/events.bundle.js
