/* Bindwell - checkout page.
   Everything here reads the cart through window.BINDWELL and looks prices
   and titles up in js/data.js. Nothing is stored beyond the course codes
   the shared cart already keeps, and nothing leaves the page: the payment
   step is a local timeout, not a request. */
(function () {
  "use strict";

  var D = window.BINDWELL_DATA;
  var CART = window.BINDWELL;
  if (!D || !CART) return;

  var reduced = false;
  try {
    reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (e) {
    reduced = false;
  }

  /* Matches --dur-fast (150ms) with a little slack for transitionend. */
  var FADE = reduced ? 0 : 150;
  var PAY_MS = reduced ? 0 : 700;

  var root = document.querySelector("main");
  if (!root) return;

  var states = {};
  root.querySelectorAll("[data-state]").forEach(function (el) {
    states[el.getAttribute("data-state")] = el;
  });

  var linesEl = root.querySelector("[data-cart-lines]");
  var sumLinesEl = root.querySelector("[data-summary-lines]");
  var subtotalEl = root.querySelector("[data-summary-subtotal]");
  var totalEl = root.querySelector("[data-summary-total]");
  var payForm = root.querySelector("[data-pay-form]");
  var payButton = root.querySelector("[data-pay-button]");
  var payLabel = root.querySelector("[data-pay-label]");
  var titleEl = root.querySelector("[data-page-title]");
  var ledeEl = root.querySelector("[data-page-lede]");
  var orderEl = root.querySelector("[data-order-number]");

  var confirmed = false;
  var attempted = false;

  /* UPI is the default here; Card is the second option. Nothing about either
     leaves the page. */
  var method = "upi";

  /* ---------------------------------------------------------------------
     State switching. Three mutually exclusive blocks, 150ms crossfade.
     --------------------------------------------------------------------- */
  function currentState() {
    for (var name in states) {
      if (!states[name].hidden) return name;
    }
    return null;
  }

  function fadeIn(el) {
    el.classList.add("is-out");
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        el.classList.remove("is-out");
      });
    });
  }

  function showState(name, animate) {
    Object.keys(states).forEach(function (key) {
      var el = states[key];
      if (key !== name) {
        el.hidden = true;
        el.classList.remove("is-out");
        return;
      }
      el.hidden = false;
      if (animate) fadeIn(el);
      else el.classList.remove("is-out");
    });
  }

  function swapState(name) {
    var from = currentState();
    if (!from || from === name || !FADE) {
      showState(name, false);
      return;
    }
    states[from].classList.add("is-out");
    window.setTimeout(function () {
      showState(name, true);
    }, FADE);
  }

  /* ---------------------------------------------------------------------
     Rendering. Titles, instructors, prices and thumbnails all come from
     data.js; the cart only ever holds course codes.
     --------------------------------------------------------------------- */
  function coursesFor(codes) {
    var out = [];
    for (var i = 0; i < codes.length; i++) {
      var course = D.byCode(codes[i]);
      if (course) out.push(course);
    }
    return out;
  }

  function lineMarkup(course) {
    return (
      '<div class="line" data-line-code="' +
      D.escapeHtml(course.code) +
      '">' +
      D.thumbMarkup(course, "thumb--line") +
      '<span class="line__main">' +
      '<a class="line__title" href="course.html?c=' +
      encodeURIComponent(course.code) +
      '">' +
      D.escapeHtml(course.title) +
      "</a>" +
      '<span class="meta">' +
      D.escapeHtml(course.instructor) +
      "</span>" +
      '<span class="meta">' +
      D.escapeHtml(D.metaLine(course)) +
      "</span>" +
      "</span>" +
      '<span class="line__side">' +
      '<span class="price">' +
      D.formatPrice(course.price) +
      "</span>" +
      '<button class="btn btn--ghost btn--danger btn--sm" type="button" data-remove-from-cart="' +
      D.escapeHtml(course.code) +
      '">Remove</button>' +
      "</span>" +
      "</div>"
    );
  }

  function renderLines(courses) {
    if (!linesEl) return;
    linesEl.innerHTML = courses.map(lineMarkup).join("");
  }

  function renderSummary(courses) {
    var sum = D.subtotal(
      courses.map(function (c) {
        return c.code;
      })
    );

    if (sumLinesEl) {
      sumLinesEl.innerHTML = courses
        .map(function (c) {
          return (
            '<div class="summary-row co-summary-row"><span>' +
            D.escapeHtml(c.title) +
            "</span><span>" +
            D.formatMoney(c.price) +
            "</span></div>"
          );
        })
        .join("");
    }

    if (subtotalEl) subtotalEl.textContent = D.formatMoney(sum);
    if (totalEl) totalEl.textContent = D.formatMoney(sum);
    if (payLabel) payLabel.textContent = "Pay " + D.formatPrice(sum);
  }

  function renderAll(codes, animate) {
    var courses = coursesFor(codes);
    renderSummary(courses);
    if (!courses.length) {
      if (animate) swapState("empty");
      else showState("empty", false);
      return;
    }
    renderLines(courses);
    if (animate) swapState("cart");
    else showState("cart", false);
  }

  /* ---------------------------------------------------------------------
     Removal. main.js owns the delegated [data-remove-from-cart] click and
     the write; this only plays the row out so the list does not jump.
     --------------------------------------------------------------------- */
  function collapse(row) {
    row.classList.add("is-removing");
    window.setTimeout(function () {
      row.classList.add("is-collapsed");
      if (row.parentNode) row.parentNode.removeChild(row);
      if (linesEl && !linesEl.querySelector(".line")) swapState("empty");
    }, FADE);
  }

  function domCodes() {
    var out = [];
    if (!linesEl) return out;
    linesEl.querySelectorAll("[data-line-code]").forEach(function (row) {
      if (!row.classList.contains("is-removing")) {
        out.push(row.getAttribute("data-line-code"));
      }
    });
    return out;
  }

  function onCartChange(codes) {
    if (confirmed) return;

    var courses = coursesFor(codes);
    renderSummary(courses);

    var shown = domCodes();
    var added = codes.filter(function (c) {
      return shown.indexOf(c) === -1;
    });

    /* Anything new, or a cold list: render from scratch. */
    if (added.length || (!shown.length && courses.length)) {
      renderAll(codes, true);
      return;
    }

    var stale = shown.filter(function (c) {
      return codes.indexOf(c) === -1;
    });

    stale.forEach(function (code) {
      var row = linesEl.querySelector('[data-line-code="' + code + '"]');
      if (row) collapse(row);
    });
  }

  /* ---------------------------------------------------------------------
     Payment method. Two panels, one visible at a time, swapped by the chip
     row. The hidden panel's rules are skipped so a blank card number never
     blocks a UPI payment.
     --------------------------------------------------------------------- */
  function panelFor(name) {
    return root.querySelector('[data-pay-fields="' + name + '"]');
  }

  function clearErrors(panel) {
    if (!panel) return;
    panel.querySelectorAll(".field.is-error").forEach(function (field) {
      field.classList.remove("is-error");
    });
    panel.querySelectorAll("[aria-invalid]").forEach(function (input) {
      input.removeAttribute("aria-invalid");
    });
  }

  function setMethod(name, focusFirst) {
    if (name !== "upi" && name !== "card") return;
    method = name;

    root.querySelectorAll("[data-pay-method-option]").forEach(function (chip) {
      var on = chip.getAttribute("data-pay-method-option") === name;
      chip.setAttribute("aria-pressed", on ? "true" : "false");
    });

    ["upi", "card"].forEach(function (key) {
      var panel = panelFor(key);
      if (!panel) return;
      var on = key === name;
      panel.hidden = !on;
      if (!on) clearErrors(panel);
    });

    if (focusFirst) {
      var next = panelFor(name);
      var input = next && next.querySelector(".field__input");
      if (input) input.focus();
    }
  }

  function initMethod() {
    var row = root.querySelector("[data-pay-method]");
    if (!row) return;
    row.addEventListener("click", function (e) {
      var chip = e.target.closest("[data-pay-method-option]");
      if (!chip) return;
      var name = chip.getAttribute("data-pay-method-option");
      if (name === method) return;
      setMethod(name, true);
    });
    setMethod(method, false);
  }

  /* ---------------------------------------------------------------------
     Validation. Static shape checks only: no card and no UPI ID is checked
     against anything. Runs on submit, then on blur once a submit has been
     attempted.
     --------------------------------------------------------------------- */
  var RULES = [
    {
      id: "email",
      method: null,
      test: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
      }
    },
    {
      /* Shape only: a handle, an @, and a provider suffix. */
      id: "upi",
      method: "upi",
      test: function (v) {
        return /^[a-zA-Z0-9](?:[a-zA-Z0-9._-]{1,48}[a-zA-Z0-9])?@[a-zA-Z][a-zA-Z0-9]{1,29}$/.test(
          v.trim()
        );
      }
    },
    {
      id: "card",
      method: "card",
      test: function (v) {
        return /^[0-9]{16}$/.test(v.replace(/[\s-]/g, ""));
      }
    },
    {
      id: "expiry",
      method: "card",
      test: function (v) {
        return /^(0[1-9]|1[0-2])\/?[0-9]{2}$/.test(v.replace(/[\s]/g, ""));
      }
    },
    {
      id: "cvc",
      method: "card",
      test: function (v) {
        return /^[0-9]{3}$/.test(v.trim());
      }
    },
    {
      id: "cardname",
      method: "card",
      test: function (v) {
        return v.trim().length >= 2;
      }
    }
  ];

  function activeRule(rule) {
    return !rule.method || rule.method === method;
  }

  function fieldOf(input) {
    return input.closest(".field");
  }

  function mark(input, valid) {
    var field = fieldOf(input);
    if (field) field.classList.toggle("is-error", !valid);
    if (valid) input.removeAttribute("aria-invalid");
    else input.setAttribute("aria-invalid", "true");
  }

  function validate() {
    var firstBad = null;
    for (var i = 0; i < RULES.length; i++) {
      if (!activeRule(RULES[i])) continue;
      var input = document.getElementById(RULES[i].id);
      if (!input) continue;
      var ok = RULES[i].test(input.value);
      mark(input, ok);
      if (!ok && !firstBad) firstBad = input;
    }
    return firstBad;
  }

  function initValidation() {
    RULES.forEach(function (rule) {
      var input = document.getElementById(rule.id);
      if (!input) return;
      input.addEventListener("blur", function () {
        if (attempted && activeRule(rule)) mark(input, rule.test(input.value));
      });
    });
  }

  /* ---------------------------------------------------------------------
     Submit. Local only: a short loading state, then the confirmation, then
     the cart is emptied through the public API.
     --------------------------------------------------------------------- */
  function orderNumber() {
    var letters = "ACDEFHJKLMNPQRTVWXY";
    var out = "";
    for (var i = 0; i < 4; i++) {
      out += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return out + "-" + String(1000 + Math.floor(Math.random() * 9000));
  }

  function complete() {
    confirmed = true;
    if (payButton) payButton.classList.remove("is-loading");
    if (orderEl) {
      orderEl.textContent =
        "Order " +
        orderNumber() +
        ", paid by " +
        (method === "upi" ? "UPI" : "card") +
        ". A fictional receipt for a fictional purchase.";
    }
    if (titleEl) titleEl.textContent = "Order confirmed";
    if (ledeEl) ledeEl.hidden = true;
    swapState("done");
    CART.writeCart([]);
  }

  function initSubmit() {
    if (!payForm) return;
    payForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (confirmed) return;
      attempted = true;

      var firstBad = validate();
      if (firstBad) {
        firstBad.focus();
        return;
      }

      if (payButton) payButton.classList.add("is-loading");
      window.setTimeout(complete, PAY_MS);
    });
  }

  /* --------------------------------------------------------------------- */
  function init() {
    renderAll(CART.readCart(), false);
    initMethod();
    initValidation();
    initSubmit();
  }

  document.addEventListener("bindwell:cart", function (e) {
    onCartChange((e.detail && e.detail.codes) || []);
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
