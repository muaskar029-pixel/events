// Progressive enhancement for Radova Events (loaded lazily on first interaction).
(function () {
  "use strict";

  var THEME_KEY = "radova-theme";
  var LANG_KEY = "radova-lang";
  var SUN_SVG = '<svg width="16" height="16" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="128" cy="128" r="56"/><line x1="128" y1="36" x2="128" y2="16"/><line x1="128" y1="240" x2="128" y2="220"/><line x1="36" y1="128" x2="16" y2="128"/><line x1="240" y1="128" x2="220" y2="128"/><line x1="63" y1="63" x2="49" y2="49"/><line x1="207" y1="207" x2="193" y2="193"/><line x1="193" y1="63" x2="207" y2="49"/><line x1="49" y1="207" x2="63" y2="193"/></svg>';
  var MOON_SVG = '<svg width="16" height="16" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M216.7 152.6A91.9 91.9 0 0 1 103.4 39.3a92 92 0 1 0 113.3 113.3Z"/></svg>';

  var ID_TEXT = {
    "skip": "Langsung ke konten",
    "nav.packages": "Paket",
    "nav.wiki": "Wiki",
    "nav.learning": "Belajar",
    "nav.events": "Acara",
    "nav.latest": "Terbaru",
    "nav.about": "Tentang",
    "nav.history": "Sejarah",
    "nav.contact": "Kontak",
    "nav.back": "Kembali",
    "footer.col1": "Tentang Radova",
    "footer.col2": "Sumber Daya",
    "footer.col3": "Pilar Utama",
    "footer.col4": "Bantuan & Spesifikasi",
    "footer.download": "Unduh ISO",
    "footer.specs": "Kebutuhan Sistem",
    "footer.security": "Info Keamanan",
    "footer.copy": "© 2026 yuros.org · Dirilis di bawah Lisensi MIT",
    "footer.top": "Ke atas ↑",
    "events.redirect.title": "Acara Radova",
    "events.redirect.lead": "Mengalihkan ke",
    "events.redirect.notice": "Jika tidak dialihkan otomatis, buka",
    "events.schedule.title": "Acara",
    "events.schedule.lead": "Workshop Linux dan bootcamp 4 minggu secara langsung. Semua jam dalam WIB (UTC+7).",
    "events.bootcamp.title": "Bootcamp",
    "events.bootcamp.lead": "Program 4 minggu dengan tugas mingguan dan review mentor langsung. Semua jam dalam WIB (UTC+7).",
    "events.workshop.title": "Workshop",
    "events.workshop.lead": "Sesi praktik Linux langsung selama 2 jam untuk satu topik teknis. Semua jam dalam WIB (UTC+7).",
    "events.all": "Semua Acara",
    "events.workshop": "Workshop",
    "events.bootcamp": "Bootcamp",
    "events.slot2": "2 Akan Datang",
    "events.slot1": "1 Akan Datang",
    "events.slot0": "0 Akan Datang",
    "events.pastJump": "Acara Selesai ↓",
    "events.upcoming": "Akan Datang",
    "events.closest": "Terdekat",
    "events.open": "Terbuka",
    "events.card.seats30": "Online · 30 kursi",
    "events.card.seats20": "Online · 20 kursi",
    "events.card.bcAll": "Bootcamp · 4 Minggu",
    "events.card.bcMeta": "Lanjutan · 4 Minggu",
    "events.past": "Acara Selesai",
    "events.newest": "Terbaru",
    "events.empty.all": "Belum ada acara selesai.",
    "events.empty.bootcamp": "Belum ada bootcamp mendatang.",
    "events.empty.bootcampPast": "Belum ada bootcamp selesai.",
    "events.empty.workshopPast": "Belum ada workshop selesai.",
    "events.single.back": "← Semua Workshop",
    "events.single.level": "Menengah",
    "events.single.lead": "Sesi praktik 2 jam melacak syscall, disk I/O, dan bottleneck kernel dengan eBPF dan BCC.",
    "events.single.when": "Kapan",
    "events.single.where": "Di mana",
    "events.single.quota": "Kuota",
    "events.single.quotaVal": "30 peserta",
    "events.single.price": "Biaya",
    "events.single.free": "Gratis",
    "events.single.overview": "Ringkasan",
    "events.single.overviewDesc": "Pelajari cara memeriksa kernel Linux langsung di produksi dengan aman memakai BCC dan bpftrace—tanpa modul kernel khusus.",
    "events.single.syllabus": "Silabus",
    "events.single.s1": "Arsitektur eBPF, model keamanan verifier, serta perbandingan tracepoint dan kprobe.",
    "events.single.s2": "Praktik BCC & bpftrace: melacak syscall, page cache miss, dan latensi block I/O.",
    "events.single.s3": "Membaca flamegraph, checklist keamanan produksi, dan tanya jawab.",
    "events.single.prereq": "Prasyarat",
    "events.single.p1": "Terbiasa menggunakan shell Linux (bash/zsh)",
    "events.single.p2": "Memahami dasar proses, filesystem, dan TCP/IP",
    "events.single.mentor": "Mentor",
    "events.single.mentorDesc": "Tim Inti Radova · Insinyur sistem yang mengelola infrastruktur Linux terproteksi dan perkakas penyimpanan arsip.",
    "events.single.register": "Daftar Sekarang →",
    "events.single.note": "Dipandu oleh Tim Inti Radova · Online · Gratis · 30 peserta",
    "events.bc.back": "← Semua Bootcamp",
    "events.bc.level": "Lanjutan",
    "events.bc.lead": "Program 4 minggu membahas packaging Linux reprodusibel, hardening systemd, dan penyimpanan arsip di Radova.",
    "events.bc.whereVal": "Kohort Online",
    "events.bc.quotaVal": "20 peserta",
    "events.bc.overview": "Bangun, tandatangani, dan presentasikan repositori paket Radova siap produksi dalam empat sesi live mingguan.",
    "events.bc.s1": "Build reprodusibel, clean chroot, dan manifest paket Radova.",
    "events.bc.s2": "Isolasi systemd, filter seccomp, dan daemon least-privilege.",
    "events.bc.s3": "Penyimpanan arsip ber-checksum, snapshot, dan latihan pemulihan.",
    "events.bc.s4": "Sidang akhir: rilis dan pertahankan repositori paket Radova bertanda tangan.",
    "events.bc.p1": "Fasih Linux CLI, Git, dan shell scripting.",
    "events.bc.p2": "Menjalankan Radova Linux 2026.11+ secara lokal atau di VM.",
    "events.bc.p3": "Hadir di empat sesi live hari Senin (19:00–21:00 WIB / UTC+7).",
    "events.bc.mentorDesc": "Tim Inti Radova · Maintainer infrastruktur packaging Radova, Memora, dan Coretez.",
    "events.bc.note": "Dipandu oleh Tim Inti Radova · Kohort Online · Gratis · 20 peserta",
    "events.upcomingFull": "Jadwal Akan Datang & Berlangsung",
    "events.closestFull": "Tanggal Terdekat Dulu",
    "events.newestPaged": "Terbaru Dulu · 10 / Halaman",
    "events.prev": "← Sebelumnya",
    "events.next": "Halaman Berikutnya →",
    "events.single.schedule": "Jadwal",
    "err.chip": "404 · Tidak Ditemukan",
    "err.title1": "Halaman tidak",
    "err.title2": "ditemukan.",
    "err.lead": "Halaman yang Anda cari sudah dipindahkan, diganti nama, atau belum pernah ada.",
    "err.cta": "Kembali ke Acara",
    "err.home": "Acara"
  };

  // Pin persistent header links before htmx pushState changes path depth.
  document.querySelectorAll(".brand-lockup, .nav-list a, .events-nav a").forEach(function (link) {
    var attr = link.getAttribute("href");
    if (attr) link.setAttribute("href", new URL(attr, location.href).href);
  });

  function syncActiveNav() {
    var cur = location.pathname.replace(/index\.html$/, "");
    document.querySelectorAll(".events-nav a").forEach(function (link, i) {
      var lp = new URL(link.href, location.href).pathname.replace(/index\.html$/, "");
      var match = lp === cur || (i > 0 && lp.length > 1 && cur.indexOf(lp) === 0);
      if (match) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }

  // ponytail: unified HTMX lifecycle + direct boot (no DOMContentLoaded wrapper needed for lazy bundle)
  document.addEventListener("htmx:afterSettle", function (e) {
    var t = e.detail.target;
    if (t && !t.isConnected && t.id) t = document.getElementById(t.id);
    var info = e.detail.pathInfo;
    var path = info && (info.responsePath || info.finalRequestPath || info.requestPath);
    if (t && path) {
      var base = new URL(path, location.href).href;
      t.querySelectorAll(".events-nav a, a[href]:not([href^='#']):not([href^='http'])").forEach(function (link) {
        link.setAttribute("href", new URL(link.getAttribute("href"), base).href);
      });
    }
    syncActiveNav();
    if (t && t.id === "main") t.focus({ preventScroll: false });
    snapshotI18n();
    if (currentLang !== "en") applyLang(currentLang);
  });
  addEventListener("popstate", syncActiveNav);

  document.addEventListener("htmx:beforeSwap", function (e) {
    if (e.detail.target && e.detail.target.id === "past-events-list") {
      e.detail.target.dataset.prevCount = String(e.detail.target.children.length);
    }
  });

  document.addEventListener("htmx:afterSwap", function (e) {
    var t = e.detail.target;
    if (!t || t.id !== "past-events-list") return;
    var prev = parseInt(t.dataset.prevCount || "0", 10);
    var first = t.children[prev];
    if (first) {
      var ft = first.querySelector("a") || first;
      if (ft === first && !ft.hasAttribute("tabindex")) ft.setAttribute("tabindex", "-1");
      ft.focus();
    }
    var added = t.children.length - prev;
    var status = document.getElementById("past-events-status");
    if (status) status.textContent = added > 0 ? "Loaded " + added + " more past events." : "No more past events.";
    var nextLink = document.querySelector('.pagination a[rel="next"]');
    if (nextLink && e.detail.xhr && e.detail.xhr.responseText) {
      var doc = new DOMParser().parseFromString(e.detail.xhr.responseText, "text/html");
      var inc = doc.querySelector('.pagination a[rel="next"]');
      if (inc) {
        var href = inc.getAttribute("href");
        nextLink.setAttribute("href", href);
        nextLink.setAttribute("hx-get", href);
        if (window.htmx) window.htmx.process(nextLink);
      } else {
        nextLink.remove();
      }
    }
  });

  // Navigation: About dropdown + mobile drawer
  var navBtn = document.getElementById("about-menu-btn");
  var dropdown = document.querySelector(".dropdown");
  var backBtn = document.querySelector(".d-content-back");
  function closeDropdown() {
    if (!navBtn) return;
    navBtn.classList.remove("active");
    navBtn.setAttribute("aria-expanded", "false");
    if (dropdown && dropdown.contains(document.activeElement)) document.activeElement.blur();
  }
  if (navBtn && dropdown) {
    navBtn.addEventListener("click", function (e) {
      e.preventDefault();
      navBtn.setAttribute("aria-expanded", String(navBtn.classList.toggle("active")));
    });
    if (!matchMedia("(pointer: coarse)").matches) {
      dropdown.addEventListener("mouseenter", function () { navBtn.classList.add("active"); navBtn.setAttribute("aria-expanded", "true"); });
      dropdown.addEventListener("mouseleave", closeDropdown);
    }
    if (backBtn) backBtn.addEventListener("click", function (e) { e.preventDefault(); closeDropdown(); });
    document.addEventListener("click", function (e) { if (!dropdown.contains(e.target)) closeDropdown(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeDropdown(); });
  }

  var toggleBtn = document.querySelector(".nav-toggle");
  var primaryNav = document.getElementById("primary-nav");
  if (toggleBtn && primaryNav) {
    function setMenu(open) {
      toggleBtn.setAttribute("aria-expanded", String(open));
      toggleBtn.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
      primaryNav.classList.toggle("is-open", open);
      document.body.style.overflow = open ? "hidden" : "";
    }
    toggleBtn.addEventListener("click", function (e) { e.stopPropagation(); setMenu(toggleBtn.getAttribute("aria-expanded") !== "true"); });
    primaryNav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("click", function (e) { if (!primaryNav.contains(e.target) && !toggleBtn.contains(e.target)) setMenu(false); });
    addEventListener("resize", function () { if (innerWidth >= 768) setMenu(false); });
  }

  // i18n (EN <-> ID)
  var i18nNodes = [];
  var currentLang = "en";
  try { if (localStorage.getItem(LANG_KEY) === "id") currentLang = "id"; } catch (_) {}

  function snapshotI18n() {
    i18nNodes = [].slice.call(document.querySelectorAll("[data-i18n], [data-i18n-prefix]"));
    i18nNodes.forEach(function (el) {
      if ("en" in el.dataset) return;
      el.dataset.en = el.hasAttribute("data-i18n") ? el.textContent : (el.firstChild ? el.firstChild.nodeValue : "");
    });
  }

  function applyLang(lang) {
    i18nNodes.forEach(function (el) {
      if (el.hasAttribute("data-i18n")) {
        var k = el.getAttribute("data-i18n");
        el.textContent = lang === "id" && ID_TEXT[k] != null ? ID_TEXT[k] : el.dataset.en;
      } else if (el.firstChild) {
        var pk = el.getAttribute("data-i18n-prefix");
        el.firstChild.nodeValue = lang === "id" && ID_TEXT[pk] != null ? ID_TEXT[pk] + " " : el.dataset.en;
      }
    });
    document.documentElement.lang = lang;
    var langBtn = document.getElementById("lang-toggle");
    if (langBtn) {
      langBtn.textContent = lang.toUpperCase();
      langBtn.setAttribute("aria-label", lang === "id" ? "ID: switch language to English" : "EN: switch language to Indonesian");
    }
  }

  // Theme toggle (Vanilla JS, localStorage)
  function applyTheme(theme) {
    var dark = theme === "dark";
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    try { localStorage.setItem(THEME_KEY, dark ? "dark" : "light"); } catch (_) {}
    var btn = document.getElementById("theme-toggle");
    if (!btn) return;
    var label = dark ? "Switch to light mode" : "Switch to dark mode";
    btn.setAttribute("aria-pressed", String(dark));
    btn.setAttribute("aria-label", label);
    btn.setAttribute("title", label);
    btn.innerHTML = dark ? SUN_SVG : MOON_SVG;
  }

  snapshotI18n();
  if (currentLang !== "en") applyLang(currentLang);
  applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light");

  document.addEventListener("click", function (e) {
    if (e.target.closest("#theme-toggle")) {
      applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
    } else if (e.target.closest("#lang-toggle")) {
      currentLang = currentLang === "en" ? "id" : "en";
      applyLang(currentLang);
      try { localStorage.setItem(LANG_KEY, currentLang); } catch (_) {}
    }
  });

  window.radovaReady = true;
  if (window.radovaPendingClick) {
    var pending = window.radovaPendingClick;
    window.radovaPendingClick = null;
    pending.click();
  }
})();
