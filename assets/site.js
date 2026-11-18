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
  var navBtn = document.getElementById("test2");
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
      "footer.top": "Ke atas ↑"
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
