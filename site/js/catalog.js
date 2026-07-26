/* TOLERANCE - courses.html only. Vanilla, no dependencies, loaded with defer
   after js/main.js.

   Format filter. Nothing is re-rendered: the six rows are authored in the
   page, and filtering only toggles state on them.
     - state lives on [data-active-filter] (group) and [data-format] (row)
     - a row leaving the list fades (.is-fading, 150ms opacity) and is then
       removed from layout with the `hidden` attribute plus .is-filtered-out
     - a cluster with no visible rows is hidden too, so no hairline is left
       separating nothing
   The container itself never animates and never moves. */
(function () {
  "use strict";

  var FADE = 150;

  var group = document.querySelector("[data-filter-group]");
  var list = document.querySelector("[data-filter-target]");
  if (!group || !list) return;

  var toggles = Array.prototype.slice.call(group.querySelectorAll("[data-filter]"));
  var rows = Array.prototype.slice.call(list.querySelectorAll("[data-format]"));
  var clusters = Array.prototype.slice.call(list.querySelectorAll(".rows__cluster"));
  var timer = null;

  function shows(row, value) {
    return value === "all" || row.getAttribute("data-format") === value;
  }

  function apply(value) {
    if (group.getAttribute("data-active-filter") === value) return;
    group.setAttribute("data-active-filter", value);

    toggles.forEach(function (toggle) {
      toggle.setAttribute(
        "aria-pressed",
        toggle.getAttribute("data-filter") === value ? "true" : "false"
      );
    });

    var arriving = [];

    rows.forEach(function (row) {
      var show = shows(row, value);
      if (show && row.hidden) {
        /* Back into layout at opacity 0, then faded up on the next frame. */
        row.hidden = false;
        row.classList.remove("is-filtered-out");
        row.classList.add("is-fading");
        arriving.push(row);
      } else if (!show && !row.hidden) {
        row.classList.add("is-fading");
      }
    });

    clusters.forEach(function (cluster) {
      if (cluster.querySelector("[data-format]:not([hidden])")) cluster.hidden = false;
    });

    if (arriving.length) {
      requestAnimationFrame(function () {
        arriving.forEach(function (row) { row.classList.remove("is-fading"); });
      });
    }

    window.clearTimeout(timer);
    timer = window.setTimeout(function () {
      rows.forEach(function (row) {
        if (!shows(row, value)) {
          row.hidden = true;
          row.classList.add("is-filtered-out");
        }
      });
      clusters.forEach(function (cluster) {
        cluster.hidden = !cluster.querySelector("[data-format]:not([hidden])");
      });
    }, FADE);
  }

  toggles.forEach(function (toggle) {
    toggle.addEventListener("click", function () {
      apply(toggle.getAttribute("data-filter"));
    });
  });

  /* "Cohort dates" in the cohort note selects the cohort filter before the
     browser follows the anchor to the cohort cluster. */
  document.querySelectorAll("[data-filter-jump]").forEach(function (el) {
    el.addEventListener("click", function () {
      apply(el.getAttribute("data-filter-jump"));
    });
  });
})();
