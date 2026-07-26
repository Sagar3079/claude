/* TOLERANCE - checkout.html only. Vanilla, no dependencies, loaded with
   `defer` after js/main.js so window.TOLERANCE already exists.

   Everything here is client-side. There is no network call anywhere in this
   file, no payment processing, and no data is persisted beyond the cart key
   that main.js owns (`tolerance_cart`). The cart is read and written only
   through the public TOLERANCE API documented in CONTRACT.md section 5. */
(function () {
  "use strict";

  /* Course table. Authoritative data from CONTRACT.md section 10. The cart
     stores course codes only, so prices are looked up here at render time. */
  var COURSES = {
    "TL-301": { title: "Systems Under Load", format: "SELF-PACED", price: 249 },
    "TL-204": { title: "Interface Physics", format: "SELF-PACED", price: 229 },
    "TL-112": { title: "The Type System, Fully", format: "SELF-PACED", price: 189 },
    "TL-317": { title: "Design for Density", format: "SELF-PACED", price: 279 },
    "TL-410": { title: "From Parser to Production", format: "COHORT, 8 WEEKS", price: 1450 },
    "TL-405": { title: "The Staff Engineer Brief", format: "COHORT, 6 WEEKS", price: 980 }
  };

  var CART_KEY = "tolerance_cart";

  var order = document.querySelector("[data-co-order]");
  var empty = document.querySelector("[data-co-empty]");
  var done = document.querySelector("[data-co-done]");
  if (!order || !empty || !done) return;

  var list = order.querySelector("[data-co-list]");
  var form = order.querySelector("[data-co-form]");
  var submit = order.querySelector("[data-co-submit]");
  var elCount = order.querySelector("[data-co-count]");
  var elSubtotal = order.querySelector("[data-co-subtotal]");
  var elTotal = order.querySelector("[data-co-total]");

  var doneList = done.querySelector("[data-co-done-list]");
  var doneTotal = done.querySelector("[data-co-done-total]");
  var doneNo = done.querySelector("[data-co-order-no]");
  var doneEmail = done.querySelector("[data-co-email]");

  var settled = false; // true once the mock payment has been confirmed

  /* ---------------------------------------------------------------------
     Formatting
     --------------------------------------------------------------------- */

  function group(intText) {
    return intText.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function money(n) {
    var parts = n.toFixed(2).split(".");
    return "$" + group(parts[0]) + "." + parts[1];
  }

  function moneyRound(n) {
    return "$" + group(String(Math.round(n)));
  }

  /* ---------------------------------------------------------------------
     Cart reading. Unknown codes are dropped, and the cleaned list is
     written back so the badge count matches what is actually billable.
     --------------------------------------------------------------------- */

  function readCodes() {
    var api = window.TOLERANCE;
    if (!api) return [];
    var codes = api.readCart();
    var known = codes.filter(function (c) {
      return Object.prototype.hasOwnProperty.call(COURSES, c);
    });
    if (known.length !== codes.length) api.writeCart(known);
    return known;
  }

  function subtotalOf(codes) {
    return codes.reduce(function (sum, c) { return sum + COURSES[c].price; }, 0);
  }

  /* ---------------------------------------------------------------------
     Receipt lines
     --------------------------------------------------------------------- */

  function lineFor(code, removable) {
    var course = COURSES[code];

    var li = document.createElement("li");
    li.className = "co-line";

    var elCode = document.createElement("span");
    elCode.className = "co-line__code";
    elCode.textContent = code;

    var title = document.createElement("span");
    title.className = "co-line__title";
    title.textContent = course.title;

    var leader = document.createElement("span");
    leader.className = "co-line__leader";
    leader.setAttribute("aria-hidden", "true");

    var amount = document.createElement("span");
    amount.className = "co-line__amount";
    amount.textContent = money(course.price);

    li.appendChild(elCode);
    li.appendChild(title);
    li.appendChild(leader);
    li.appendChild(amount);

    if (removable) {
      var btn = document.createElement("button");
      btn.className = "co-remove";
      btn.type = "button";
      btn.setAttribute("data-co-remove", code);
      btn.textContent = "Remove";
      btn.setAttribute("aria-label", "Remove " + course.title + " from the order");
      li.appendChild(btn);
    }

    return li;
  }

  function fill(target, codes, removable) {
    target.textContent = "";
    codes.forEach(function (code) {
      target.appendChild(lineFor(code, removable));
    });
  }

  /* ---------------------------------------------------------------------
     State: order / empty / confirmed
     --------------------------------------------------------------------- */

  function show(state) {
    order.hidden = state !== "order";
    empty.hidden = state !== "empty";
    done.hidden = state !== "done";
  }

  function render() {
    if (settled) return;

    var codes = readCodes();

    if (!codes.length) {
      fill(list, [], true);
      show("empty");
      return;
    }

    var subtotal = subtotalOf(codes);

    fill(list, codes, true);
    elCount.textContent = String(codes.length);
    elSubtotal.textContent = money(subtotal);
    elTotal.textContent = money(subtotal);
    submit.querySelector(".btn__label").textContent = "Pay " + moneyRound(subtotal);

    show("order");
  }

  /* Remove controls are rendered after main.js has bound its declarative
     handlers, so this page uses its own attribute and its own delegation. */
  list.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-co-remove]");
    if (!btn) return;
    var api = window.TOLERANCE;
    if (api) api.removeFromCart(btn.getAttribute("data-co-remove"));
    render();
  });

  /* ---------------------------------------------------------------------
     Validation. Static states only: the first invalid field gets .is-error
     and focus, which also keeps the page inside its two-red-elements budget.
     --------------------------------------------------------------------- */

  var RULES = [
    {
      id: "co-email",
      ok: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); }
    },
    {
      id: "co-card",
      ok: function (v) { return /^\d{16}$/.test(v.replace(/[\s-]/g, "")); }
    },
    {
      id: "co-expiry",
      ok: function (v) { return /^(0[1-9]|1[0-2])\s*\/\s*\d{2}$/.test(v.trim()); }
    },
    {
      id: "co-cvc",
      ok: function (v) { return /^\d{3,4}$/.test(v.trim()); }
    },
    {
      id: "co-name",
      ok: function (v) { return v.trim().length > 1; }
    }
  ];

  function fieldOf(input) {
    return input.closest(".field");
  }

  function clearErrors() {
    order.querySelectorAll(".field.is-error").forEach(function (f) {
      f.classList.remove("is-error");
    });
  }

  function firstInvalid() {
    for (var i = 0; i < RULES.length; i++) {
      var input = document.getElementById(RULES[i].id);
      if (input && !RULES[i].ok(input.value)) return input;
    }
    return null;
  }

  RULES.forEach(function (rule) {
    var input = document.getElementById(rule.id);
    if (!input) return;
    input.addEventListener("input", function () {
      var field = fieldOf(input);
      if (field && rule.ok(input.value)) field.classList.remove("is-error");
    });
  });

  /* ---------------------------------------------------------------------
     Confirm. Mock only: no network, no payment, no persistence.
     --------------------------------------------------------------------- */

  function orderNumber() {
    var n = Math.floor(Math.random() * 9000) + 1000;
    return "TLC-2026-" + n;
  }

  function disableForm() {
    form.querySelectorAll("input, select, button").forEach(function (el) {
      el.disabled = true;
    });
    list.querySelectorAll(".co-remove").forEach(function (el) {
      el.disabled = true;
    });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (settled) return;

    var codes = readCodes();
    if (!codes.length) {
      render();
      return;
    }

    clearErrors();
    var bad = firstInvalid();
    if (bad) {
      var field = fieldOf(bad);
      if (field) field.classList.add("is-error");
      bad.focus();
      return;
    }

    var subtotal = subtotalOf(codes);
    var email = document.getElementById("co-email").value.trim();

    submit.classList.add("is-loading");

    window.setTimeout(function () {
      settled = true;

      // Stage 1: the button reports the outcome and the form locks.
      submit.classList.remove("is-loading");
      submit.querySelector(".btn__label").textContent = "Paid. Check your email.";
      disableForm();

      // The order is done, so the cart is emptied through the public API.
      var api = window.TOLERANCE;
      if (api) api.writeCart([]);

      // Stage 2: the receipt replaces the order.
      fill(doneList, codes, false);
      doneTotal.textContent = money(subtotal);
      doneNo.textContent = orderNumber();
      doneEmail.textContent = email;

      window.setTimeout(function () { show("done"); }, 900);
    }, 700);
  });

  /* Another tab changed the cart: re-render, unless this one is settled. */
  window.addEventListener("storage", function (e) {
    if (e.key === CART_KEY) render();
  });

  /* This file is deferred, so the document is already parsed: render now
     rather than on DOMContentLoaded, so the correct state is the first one
     painted and no empty shell flashes. */
  render();
})();
