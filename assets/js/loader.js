// Loads css/fonts.css, htmx.min.js, and js/events.bundle.js?v=2 on first interaction.
(function () {
  "use strict";
  var base = document.currentScript.src;
  var loaded = false;

  function add(tag, attrs) {
    var el = document.createElement(tag);
    for (var k in attrs) el[k] = attrs[k];
    (tag === "link" ? document.head : document.body).appendChild(el);
  }

  function load() {
    if (loaded) return;
    loaded = true;
    // ponytail: fonts.css already loaded non-blocking in <head>
    function inject() {
      add("script", { src: new URL("../htmx.min.js", base).href, async: false });
      add("script", { src: new URL("events.bundle.js?v=2", base).href, async: false });
    }
    if (document.readyState === "complete") inject();
    else addEventListener("load", inject, { once: true });
  }

  document.addEventListener("click", function (e) {
    var b = !window.radovaReady && e.target.closest && e.target.closest("button");
    if (b) window.radovaPendingClick = b;
  }, true);

  ["pointerdown", "keydown", "touchstart", "scroll"].forEach(function (type) {
    addEventListener(type, load, { once: true, passive: true });
  });

  try {
    if (localStorage.getItem("radova-theme") === "dark" || localStorage.getItem("radova-lang") === "id") load();
  } catch (_) {}
})();
