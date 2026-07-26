/* Bindwell - shared behaviour. Vanilla, no dependencies.
   Loaded with `defer` on every page, AFTER js/data.js. All behaviour is
   opt-in via data attributes, so a page that lacks a component costs
   nothing. */
(function () {
  "use strict";

  /* ---------------------------------------------------------------------
     Cart. localStorage key `tolerance_cart` (kept verbatim for
     compatibility; never shown to users) = JSON array of course codes,
     e.g. ["TL-301","BW-224"]. Duplicates are not stored.
     --------------------------------------------------------------------- */
  var CART_KEY = "tolerance_cart";

  function readCart() {
    try {
      var raw = JSON.parse(localStorage.getItem(CART_KEY));
      return Array.isArray(raw)
        ? raw.filter(function (c) {
            return typeof c === "string";
          })
        : [];
    } catch (e) {
      return [];
    }
  }

  function writeCart(codes) {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(codes));
    } catch (e) {
      /* storage unavailable: badge simply stays at its last value */
    }
    renderCart();
    emitCartChange();
  }

  function addToCart(code) {
    var codes = readCart();
    if (codes.indexOf(code) === -1) codes.push(code);
    writeCart(codes);
  }

  function removeFromCart(code) {
    writeCart(
      readCart().filter(function (c) {
        return c !== code;
      })
    );
  }

  /* The count pill hides at zero; the cart icon itself always shows. */
  function renderCart() {
    var count = readCart().length;
    document.querySelectorAll("[data-cart-count]").forEach(function (el) {
      el.textContent = String(count);
      el.hidden = count === 0;
    });
  }

  function emitCartChange() {
    try {
      document.dispatchEvent(
        new CustomEvent("bindwell:cart", { detail: { codes: readCart() } })
      );
    } catch (e) {
      /* CustomEvent unavailable: page scripts fall back to polling */
    }
  }

  /* ---------------------------------------------------------------------
     Course grids. Any element carrying
       data-course-grid="BW-118,BW-224,TL-204,TL-410"
     is filled with course cards from js/data.js, in that order.
     --------------------------------------------------------------------- */
  function initCourseGrids() {
    var data = window.BINDWELL_DATA;
    if (!data) return;
    document.querySelectorAll("[data-course-grid]").forEach(function (grid) {
      var codes = grid.getAttribute("data-course-grid").split(",");
      var html = "";
      for (var i = 0; i < codes.length; i++) {
        var course = data.byCode(codes[i].trim());
        if (course) html += data.courseCard(course);
      }
      grid.innerHTML = html;
    });
  }

  /* ---------------------------------------------------------------------
     Nav: mobile panel + mobile search row.
     --------------------------------------------------------------------- */
  function initNav() {
    var toggle = document.querySelector("[data-nav-toggle]");
    var panel = document.querySelector("[data-nav-panel]");
    var backdrop = document.querySelector("[data-nav-backdrop]");

    if (toggle && panel) {
      var setOpen = function (open) {
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        panel.classList.toggle("is-open", open);
        if (backdrop) backdrop.classList.toggle("is-open", open);
        document.body.style.overflow = open ? "hidden" : "";
      };

      toggle.addEventListener("click", function () {
        setOpen(toggle.getAttribute("aria-expanded") !== "true");
      });

      if (backdrop) {
        backdrop.addEventListener("click", function () {
          setOpen(false);
          toggle.focus();
        });
      }

      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
          setOpen(false);
          toggle.focus();
        }
        var row = document.querySelector("[data-search-row].is-open");
        var rowToggle = document.querySelector("[data-search-toggle]");
        if (e.key === "Escape" && row && rowToggle) {
          row.classList.remove("is-open");
          rowToggle.setAttribute("aria-expanded", "false");
          rowToggle.focus();
        }
      });
    }

    var searchToggle = document.querySelector("[data-search-toggle]");
    var searchRow = document.querySelector("[data-search-row]");
    if (searchToggle && searchRow) {
      searchToggle.addEventListener("click", function () {
        var open = searchToggle.getAttribute("aria-expanded") !== "true";
        searchToggle.setAttribute("aria-expanded", open ? "true" : "false");
        searchRow.classList.toggle("is-open", open);
        if (open) {
          var input = searchRow.querySelector("input");
          if (input) input.focus();
        }
      });
    }
  }

  /* ---------------------------------------------------------------------
     Search. The forms are plain GET forms pointed at courses.html, so they
     work without JS. This only strips an empty `q` from the resulting URL.
     --------------------------------------------------------------------- */
  function initSearch() {
    document.querySelectorAll("[data-search-form]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        var input = form.querySelector("input[name='q']");
        if (input && !input.value.trim()) {
          e.preventDefault();
          window.location.href = form.getAttribute("action") || "courses.html";
        }
      });
    });
  }

  /* ---------------------------------------------------------------------
     Accordion. Items are independent. Keyboard toggles are unanimated.
     --------------------------------------------------------------------- */
  function initAccordions() {
    document.querySelectorAll("[data-accordion] .acc__trigger").forEach(function (trigger) {
      trigger.addEventListener("click", function (e) {
        var item = trigger.closest(".acc__item");
        if (!item) return;
        var open = trigger.getAttribute("aria-expanded") !== "true";

        /* e.detail === 0 means the click came from Enter/Space, not a pointer. */
        if (e.detail === 0) {
          item.classList.add("no-anim");
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              item.classList.remove("no-anim");
            });
          });
        }

        trigger.setAttribute("aria-expanded", open ? "true" : "false");
        item.classList.toggle("is-open", open);
      });
    });
  }

  /* ---------------------------------------------------------------------
     Scroll reveal. Permitted by the motion table: section headline + first
     content block, once, at 30% visibility. Nothing else observes scroll.
     --------------------------------------------------------------------- */
  function initReveals() {
    var targets = document.querySelectorAll(".reveal");
    if (!targets.length) return;

    if (!("IntersectionObserver" in window)) {
      targets.forEach(function (el) {
        el.classList.add("is-in");
      });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    targets.forEach(function (el) {
      io.observe(el);
    });
  }

  /* ---------------------------------------------------------------------
     Declarative cart controls. Delegated, so controls rendered later by a
     page script (catalog, checkout) are wired without re-init.
     --------------------------------------------------------------------- */
  function initCartControls() {
    document.addEventListener("click", function (e) {
      var add = e.target.closest ? e.target.closest("[data-add-to-cart]") : null;
      if (add) {
        addToCart(add.getAttribute("data-add-to-cart"));
        return;
      }
      var remove = e.target.closest ? e.target.closest("[data-remove-from-cart]") : null;
      if (remove) {
        removeFromCart(remove.getAttribute("data-remove-from-cart"));
      }
    });
  }

  /* ---------------------------------------------------------------------
     Hero load-in, once, on the element carrying [data-hero].
     --------------------------------------------------------------------- */
  function initHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) return;
    requestAnimationFrame(function () {
      hero.classList.add("is-loaded");
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initCourseGrids();
    renderCart();
    initNav();
    initSearch();
    initAccordions();
    initCartControls();
    initReveals();
    initHero();
  });

  /* Keep the badge in sync when another tab changes the cart. */
  window.addEventListener("storage", function (e) {
    if (e.key === CART_KEY) {
      renderCart();
      emitCartChange();
    }
  });

  var api = {
    readCart: readCart,
    writeCart: writeCart,
    addToCart: addToCart,
    removeFromCart: removeFromCart,
    renderCart: renderCart,
    renderCourseGrids: initCourseGrids
  };

  window.BINDWELL = api;
  /* Legacy alias. New code should use window.BINDWELL. */
  window.TOLERANCE = api;
})();
