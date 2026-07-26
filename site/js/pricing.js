/* Bindwell - pricing page.
   Two jobs only: keep the three numbers on this page honest by reading them
   out of js/data.js instead of hard-coding them, and show the one-line note
   explaining that the plan button is a demo. */
(function () {
  "use strict";

  var D = window.BINDWELL_DATA;

  function selfPaced() {
    return (window.BINDWELL_COURSES || []).filter(function (c) {
      return c.format === "Self-paced";
    });
  }

  function cohorts() {
    return (window.BINDWELL_COURSES || []).filter(function (c) {
      return c.format === "Cohort";
    });
  }

  function prices(list) {
    return list
      .map(function (c) {
        return c.price;
      })
      .sort(function (a, b) {
        return a - b;
      });
  }

  function initNumbers() {
    if (!D) return;

    var paced = prices(selfPaced());
    var seats = prices(cohorts());

    var countEl = document.querySelector("[data-plan-count]");
    if (countEl && paced.length) {
      countEl.textContent = "All " + paced.length + " self-paced courses";
    }

    var minEl = document.querySelector("[data-min-price]");
    if (minEl && paced.length) {
      minEl.textContent = "From " + D.formatPrice(paced[0]);
    }

    var rangeEl = document.querySelector("[data-cohort-range]");
    if (rangeEl && seats.length) {
      rangeEl.textContent =
        D.formatPrice(seats[0]) + " to " + D.formatPrice(seats[seats.length - 1]);
    }
  }

  function initPlanButton() {
    var button = document.querySelector("[data-plan-start]");
    var note = document.querySelector("[data-plan-note]");
    if (!button || !note) return;
    button.addEventListener("click", function () {
      note.classList.add("is-visible");
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNumbers();
    initPlanButton();
  });
})();
