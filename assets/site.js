(function () {
  "use strict";

  // Pin persistent header links to their resolved URLs before htmx pushState changes the path depth.
  document.querySelectorAll(".brand-lockup, .nav-list a, .events-nav a").forEach(function (link) {
    var attr = link.getAttribute("href");
    if (attr) {
      link.setAttribute("href", new URL(attr, window.location.href).href);
    }
  });

  function syncActiveNav() {
    var currentPath = window.location.pathname.replace(/index\.html$/, "");
    var navLinks = document.querySelectorAll(".events-nav a");
    navLinks.forEach(function (link, index) {
      var linkPath = new URL(link.href, window.location.href).pathname.replace(/index\.html$/, "");
      var isMatch =
        linkPath === currentPath ||
        (index > 0 && linkPath.length > 1 && currentPath.indexOf(linkPath) === 0);
      if (isMatch) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  document.addEventListener("htmx:afterSettle", function (event) {
    syncActiveNav();
    if (event.detail.target && event.detail.target.id === "main") {
      event.detail.target.focus({ preventScroll: false });
    }
  });
  window.addEventListener("popstate", syncActiveNav);

  document.addEventListener("htmx:beforeSwap", function (event) {
    if (!event.detail.target || event.detail.target.id !== "past-events-list") {
      return;
    }
    event.detail.target.dataset.prevCount = String(event.detail.target.children.length);
  });

  document.addEventListener("htmx:afterSwap", function (event) {
    var target = event.detail.target;
    if (!target || target.id !== "past-events-list") {
      return;
    }

    var prevCount = parseInt(target.dataset.prevCount || "0", 10);
    var firstNew = target.children[prevCount];
    if (firstNew) {
      var focusTarget = firstNew.querySelector("a") || firstNew;
      if (!focusTarget.hasAttribute("tabindex") && focusTarget === firstNew) {
        focusTarget.setAttribute("tabindex", "-1");
      }
      focusTarget.focus();
    }

    var added = target.children.length - prevCount;
    var status = document.getElementById("past-events-status");
    if (status) {
      status.textContent = added > 0
        ? "Loaded " + added + " more past events."
        : "No more past events.";
    }

    var nextLink = document.querySelector('.pagination a[rel="next"]');
    if (nextLink && event.detail.xhr && event.detail.xhr.responseText) {
      var doc = new DOMParser().parseFromString(event.detail.xhr.responseText, "text/html");
      var incomingNext = doc.querySelector('.pagination a[rel="next"]');
      if (incomingNext) {
        var href = incomingNext.getAttribute("href");
        nextLink.setAttribute("href", href);
        nextLink.setAttribute("hx-get", href);
        if (window.htmx) {
          window.htmx.process(nextLink);
        }
      } else {
        nextLink.remove();
      }
    }
  });
})();

document.addEventListener("DOMContentLoaded", function () {
  var navBtn = document.getElementById("about-menu-btn");
  var dropdownContainer = document.querySelector(".dropdown");
  var backBtn = document.querySelector(".d-content-back");
  var isTouchDevice = ("ontouchstart" in window) || (navigator.maxTouchPoints > 0) || window.matchMedia("(pointer: coarse)").matches;

  function closeDropdown() {
    if (!navBtn) return;
    navBtn.classList.remove("active");
    navBtn.setAttribute("aria-expanded", "false");
    if (document.activeElement && dropdownContainer && dropdownContainer.contains(document.activeElement)) {
      document.activeElement.blur();
    }
  }

  if (navBtn && dropdownContainer) {
    if (isTouchDevice) {
      navBtn.addEventListener("click", function (e) {
        e.preventDefault();
        var open = navBtn.classList.toggle("active");
        navBtn.setAttribute("aria-expanded", String(open));
      });
      document.addEventListener("click", function (e) {
        if (!dropdownContainer.contains(e.target)) closeDropdown();
      });
    } else {
      dropdownContainer.addEventListener("mouseenter", function () {
        navBtn.classList.add("active");
        navBtn.setAttribute("aria-expanded", "true");
      });
      dropdownContainer.addEventListener("mouseleave", closeDropdown);
      navBtn.addEventListener("click", function (e) {
        e.preventDefault();
        var open = navBtn.classList.toggle("active");
        navBtn.setAttribute("aria-expanded", String(open));
      });
    }

    if (backBtn) {
      backBtn.addEventListener("click", function (e) {
        e.preventDefault();
        closeDropdown();
      });
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeDropdown();
    });
  }

  var toggleBtn = document.querySelector(".nav-toggle");
  var primaryNav = document.getElementById("primary-nav");
  if (!toggleBtn || !primaryNav) return;

  function setMenuState(open) {
    toggleBtn.setAttribute("aria-expanded", String(open));
    toggleBtn.setAttribute("aria-label", open ? "Tutup menu navigasi" : "Buka menu navigasi");
    primaryNav.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  }

  toggleBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    setMenuState(toggleBtn.getAttribute("aria-expanded") !== "true");
  });

  primaryNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () { setMenuState(false); });
  });

  document.addEventListener("click", function (e) {
    if (!primaryNav.contains(e.target) && !toggleBtn.contains(e.target)) {
      setMenuState(false);
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth >= 768) setMenuState(false);
  });

  // language switcher (EN <-> ID)
  var langBtn = document.getElementById("lang-toggle");
  if (langBtn) {
    var LANG_KEY = "radova-lang";
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
      "events.schedule.title": "Jadwal",
      "events.schedule.lead": "Lab Linux langsung dan kohort rekayasa multi-minggu. Pilih praktik satu malam atau jalani jalur penuh.",
      "events.bootcamp.title": "Bootcamp",
      "events.bootcamp.lead": "Kohort intensif empat minggu. Bangun paket produksi, perkuat systemd, dan lulus review mentor langsung.",
      "events.workshop.title": "Workshop",
      "events.workshop.lead": "Satu malam. Satu masalah Linux nyata. Praktik terminal langsung dengan perkakas produksi—tanpa slide bertele-tele.",
      "events.all": "Semua Acara",
      "events.workshop": "Workshop",
      "events.bootcamp": "Bootcamp",
      "events.slot2": "2 Jadwal Mendatang",
      "events.slot1": "1 Jadwal Mendatang",
      "events.slot0": "0 Jadwal Mendatang",
      "events.pastJump": "Arsip Sesi ↓",
      "events.upcoming": "Jadwal Mendatang",
      "events.closest": "Terdekat",
      "events.open": "Terbuka",
      "events.card.seats30": "Online · 30 kursi",
      "events.card.seats20": "Online · 20 kursi",
      "events.card.bcAll": "Bootcamp · 4 Minggu",
      "events.card.bcMeta": "Lanjutan · 4 Minggu",
      "events.past": "Arsip Sesi",
      "events.newest": "Terbaru",
      "events.empty.all": "Belum ada sesi selesai. Arsip acara tampil di sini.",
      "events.empty.bootcamp": "Belum ada kohort mendatang. Lihat Workshop atau Semua Acara terlebih dahulu.",
      "events.empty.bootcampPast": "Belum ada kohort selesai. Arsip bootcamp tampil di sini.",
      "events.empty.workshopPast": "Belum ada arsip workshop. Sesi lab selesai tampil di sini.",
      "events.single.back": "← Semua Workshop",
      "events.single.level": "Menengah",
      "events.single.lead": "Lacak syscall, latensi disk I/O, dan bottleneck kernel langsung di produksi dengan eBPF dan BCC.",
      "events.single.when": "Kapan",
      "events.single.where": "Di mana",
      "events.single.quota": "Kuota",
      "events.single.quotaVal": "30 peserta",
      "events.single.price": "Biaya",
      "events.single.free": "Gratis",
      "events.single.overview": "Ringkasan",
      "events.single.overviewDesc": "Inspeksi kernel Linux langsung tanpa modul khusus atau overhead berat. Diagnosis latensi syscall, disk I/O, dan TCP nyata dengan BCC dan bpftrace.",
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
      "events.bc.lead": "Empat minggu menguasai packaging Linux reprodusibel, hardening systemd, dan penyimpanan arsip di Radova.",
      "events.bc.whereVal": "Kohort Online",
      "events.bc.quotaVal": "20 peserta",
      "events.bc.overview": "Naik kelas dari pengguna Linux menjadi maintainer sistem. Bangun, tandatangani, dan pertahankan repositori paket Radova produksi dalam empat minggu.",
      "events.bc.s1": "Build reprodusibel, clean chroot, dan manifest paket Radova.",
      "events.bc.s2": "Isolasi systemd, filter seccomp, dan daemon least-privilege.",
      "events.bc.s3": "Penyimpanan arsip ber-checksum, snapshot, dan latihan pemulihan.",
      "events.bc.s4": "Sidang akhir: rilis dan pertahankan repositori paket Radova bertanda tangan.",
      "events.bc.p1": "Fasih Linux CLI, Git, dan shell scripting.",
      "events.bc.p2": "Menjalankan Radova Linux 2026.11+ secara lokal atau di VM.",
      "events.bc.p3": "Hadir di empat sesi live Senin malam (19:00–21:00 WIB).",
      "events.bc.mentorDesc": "Tim Inti Radova · Maintainer infrastruktur packaging Radova, Memora, dan Coretez.",
      "events.bc.note": "Dipandu oleh Tim Inti Radova · Kohort Online · Gratis · 20 peserta"
    };

    var nodes = [];
    var enList = [];

    function snapshotNodes() {
      nodes = Array.prototype.slice.call(document.querySelectorAll("[data-i18n], [data-i18n-prefix]"));
      enList = nodes.map(function (node) {
        return node.hasAttribute("data-i18n")
          ? node.textContent
          : (node.firstChild ? node.firstChild.nodeValue : "");
      });
    }

    function applyLang(lang) {
      nodes.forEach(function (el, i) {
        if (el.hasAttribute("data-i18n")) {
          var key = el.getAttribute("data-i18n");
          el.textContent = lang === "id" && ID_TEXT[key] != null ? ID_TEXT[key] : enList[i];
        } else if (el.firstChild) {
          var pkey = el.getAttribute("data-i18n-prefix");
          el.firstChild.nodeValue = lang === "id" && ID_TEXT[pkey] != null ? ID_TEXT[pkey] + " " : enList[i];
        }
      });
      document.documentElement.lang = lang;
      langBtn.textContent = lang.toUpperCase();
      langBtn.setAttribute("aria-label", lang === "id" ? "Switch language to English" : "Switch language to Indonesian");
    }

    snapshotNodes();
    var currentLang = "en";
    try {
      var saved = localStorage.getItem(LANG_KEY);
      if (saved === "id" || saved === "en") currentLang = saved;
    } catch (_) {}

    if (currentLang !== "en") applyLang(currentLang);

    langBtn.addEventListener("click", function () {
      currentLang = currentLang === "en" ? "id" : "en";
      applyLang(currentLang);
      try {
        localStorage.setItem(LANG_KEY, currentLang);
      } catch (_) {}
    });

    document.addEventListener("htmx:afterSettle", function () {
      snapshotNodes();
      if (currentLang !== "en") applyLang(currentLang);
    });
  }
});
