/* TOLERANCE - shared behaviour. Vanilla, no dependencies.
   Loaded with `defer` on every page. All behaviour is opt-in via data
   attributes, so a page that lacks a component costs nothing. */
(function () {
  "use strict";

  /* ---------------------------------------------------------------------
     Cart. localStorage key `tolerance_cart` = JSON array of course codes,
     e.g. ["TL-301","TL-112"]. Duplicates are not stored.
     --------------------------------------------------------------------- */
  var CART_KEY = "tolerance_cart";

  function readCart() {
    try {
      var raw = JSON.parse(localStorage.getItem(CART_KEY));
      return Array.isArray(raw) ? raw.filter(function (c) { return typeof c === "string"; }) : [];
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
  }

  function addToCart(code) {
    var codes = readCart();
    if (codes.indexOf(code) === -1) codes.push(code);
    writeCart(codes);
  }

  function removeFromCart(code) {
    writeCart(readCart().filter(function (c) { return c !== code; }));
  }

  function renderCart() {
    var count = readCart().length;
    document.querySelectorAll("[data-cart-count]").forEach(function (el) {
      el.textContent = String(count);
    });
    document.querySelectorAll("[data-cart-link]").forEach(function (el) {
      el.hidden = count === 0;
    });
  }

  /* ---------------------------------------------------------------------
     Mobile nav panel
     --------------------------------------------------------------------- */
  function initNav() {
    var toggle = document.querySelector("[data-nav-toggle]");
    var panel = document.querySelector("[data-nav-panel]");
    if (!toggle || !panel) return;

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      panel.classList.toggle("is-open", open);
      document.body.style.overflow = open ? "hidden" : "";
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
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

        // e.detail === 0 means the click came from Enter/Space, not a pointer.
        if (e.detail === 0) {
          item.classList.add("no-anim");
          requestAnimationFrame(function () {
            requestAnimationFrame(function () { item.classList.remove("no-anim"); });
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
      targets.forEach(function (el) { el.classList.add("is-in"); });
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

    targets.forEach(function (el) { io.observe(el); });
  }

  /* ---------------------------------------------------------------------
     Any control carrying data-add-to-cart="TL-301" adds that code to the
     cart. The badge re-renders itself.
     --------------------------------------------------------------------- */
  function initCartControls() {
    document.querySelectorAll("[data-add-to-cart]").forEach(function (el) {
      el.addEventListener("click", function () {
        addToCart(el.getAttribute("data-add-to-cart"));
      });
    });
    document.querySelectorAll("[data-remove-from-cart]").forEach(function (el) {
      el.addEventListener("click", function () {
        removeFromCart(el.getAttribute("data-remove-from-cart"));
      });
    });
  }

  /* ---------------------------------------------------------------------
     Hero load-in, once, on the element carrying [data-hero].
     --------------------------------------------------------------------- */
  function initHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) return;
    requestAnimationFrame(function () { hero.classList.add("is-loaded"); });
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderCart();
    initNav();
    initAccordions();
    initCartControls();
    initReveals();
    initHero();
  });

  // Keep the badge in sync when another tab changes the cart.
  window.addEventListener("storage", function (e) {
    if (e.key === CART_KEY) renderCart();
  });

  window.TOLERANCE = {
    readCart: readCart,
    writeCart: writeCart,
    addToCart: addToCart,
    removeFromCart: removeFromCart,
    renderCart: renderCart
  };
})();
