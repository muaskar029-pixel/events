// Text this script writes into the page, in the page's language (<html lang>).
function tr(en, id, ar) {
  var lang = document.documentElement.lang;
  return lang === "id" ? id : lang === "ar" ? ar : en;
}

(function () {
  "use strict";

  // Pin persistent header links to their resolved URLs before htmx pushState changes the path depth.
  document.querySelectorAll(".brand-lockup, .nav-list a, .events-nav a, .lang-list a").forEach(function (link) {
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

  // Relative hrefs in swapped-in content belong to the response URL, not the page that requested it.
  function pinLinks(root, base) {
    root.querySelectorAll(".events-nav a, a[href]:not([href^='#']):not([href^='http'])").forEach(function (link) {
      link.setAttribute("href", new URL(link.getAttribute("href"), base).href);
    });
  }

  document.addEventListener("htmx:afterSettle", function (event) {
    var target = event.detail.target;
    // outerHTML swaps detach the old target; work on the element now in the document.
    if (target && !target.isConnected && target.id) {
      target = document.getElementById(target.id);
    }
    var info = event.detail.pathInfo;
    var path = info && (info.responsePath || info.finalRequestPath || info.requestPath);
    if (target && path) {
      var base = new URL(path, window.location.href).href;
      pinLinks(target, base);
      if (event.detail.xhr && event.detail.xhr.responseText) {
        var incomingLang = new DOMParser().parseFromString(event.detail.xhr.responseText, "text/html").getElementById("lang-list");
        var langList = document.getElementById("lang-list");
        if (incomingLang && langList) {
          pinLinks(incomingLang, base);
          langList.innerHTML = incomingLang.innerHTML;
        }
      }
    }
    syncActiveNav();
    if (target && target.id === "main") {
      target.focus({ preventScroll: false });
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
        ? tr("Loaded " + added + " more past events.", "Menampilkan " + added + " acara selesai lagi.", "تم تحميل فعاليات سابقة إضافية: " + added)
        : tr("No more past events.", "Tidak ada lagi acara selesai.", "لا توجد فعاليات سابقة أخرى.");
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

// The bundle is injected after first interaction, usually after DOMContentLoaded has fired.
function onReady(fn) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fn);
  } else {
    fn();
  }
}

onReady(function () {
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
    toggleBtn.setAttribute("aria-label", open ? tr("Close navigation menu", "Tutup menu navigasi", "إغلاق قائمة التنقل") : tr("Open navigation menu", "Buka menu navigasi", "فتح قائمة التنقل"));
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

  // Language menu: the list holds plain links to this page in each language; this only opens and closes it.
  var langBtn = document.getElementById("lang-toggle");
  var langList = document.getElementById("lang-list");
  if (langBtn && langList) {
    var setLangOpen = function (open) {
      langBtn.setAttribute("aria-expanded", String(open));
      langList.hidden = !open;
    };
    langBtn.addEventListener("click", function () {
      setLangOpen(langList.hidden);
    });
    document.addEventListener("click", function (e) {
      if (!langList.hidden && !langBtn.parentNode.contains(e.target)) setLangOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !langList.hidden) {
        setLangOpen(false);
        langBtn.focus();
      }
    });
  }
});


// Dark Mode Controller (vanilla JS; the inline <head> script applies the saved theme before first paint)
(function () {
  "use strict";
  var THEME_KEY = "radova-theme";
  var SUN_SVG = '<svg width="16" height="16" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="128" cy="128" r="56"/><line x1="128" y1="36" x2="128" y2="16"/><line x1="128" y1="240" x2="128" y2="220"/><line x1="36" y1="128" x2="16" y2="128"/><line x1="240" y1="128" x2="220" y2="128"/><line x1="63" y1="63" x2="49" y2="49"/><line x1="207" y1="207" x2="193" y2="193"/><line x1="193" y1="63" x2="207" y2="49"/><line x1="49" y1="207" x2="63" y2="193"/></svg>';
  var MOON_SVG = '<svg width="16" height="16" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M216.7 152.6A91.9 91.9 0 0 1 103.4 39.3a92 92 0 1 0 113.3 113.3Z"/></svg>';

  function syncButton(isDark) {
    var btn = document.getElementById("theme-toggle");
    if (!btn) return;
    var label = isDark ? tr("Switch to light mode", "Beralih ke mode terang", "التبديل إلى الوضع الفاتح") : tr("Switch to dark mode", "Beralih ke mode gelap", "التبديل إلى الوضع الداكن");
    btn.setAttribute("aria-pressed", String(isDark));
    btn.setAttribute("aria-label", label);
    btn.setAttribute("title", label);
    btn.innerHTML = isDark ? SUN_SVG : MOON_SVG;
  }

  function applyTheme(theme) {
    var isDark = theme === "dark";
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    try { localStorage.setItem(THEME_KEY, isDark ? "dark" : "light"); } catch (_) {}
    syncButton(isDark);
  }

  onReady(function () {
    syncButton(document.documentElement.getAttribute("data-theme") === "dark");
    var btn = document.getElementById("theme-toggle");
    if (btn) {
      btn.addEventListener("click", function () {
        applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
      });
    }
  });
})();

// Replay a button click that landed before this bundle finished loading (see the inline loader).
window.radovaReady = true;
if (window.radovaPendingClick) {
  var pending = window.radovaPendingClick;
  window.radovaPendingClick = null;
  pending.click();
}
