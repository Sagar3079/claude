/* TOLERANCE - courses.html only. Vanilla, no dependencies, loaded with defer
   after js/main.js.

   Two filter groups, ANDed. Nothing is re-rendered: the six rows are authored
   in the page, and filtering only toggles state on them.
     - state lives on each [data-filter-group] (data-active-filter) and on the
       rows ([data-format], [data-topic])
     - a row leaving the list fades (.is-fading, 150ms opacity) and is then
       removed from layout with the `hidden` attribute plus .is-filtered-out
     - a cluster with no visible rows is hidden too, so no hairline is left
       separating nothing
   The container itself never animates and never moves. */
(function () {
  "use strict";

  var FADE = 150;

  var groups = Array.prototype.slice.call(document.querySelectorAll("[data-filter-group]"));
  var list = document.querySelector("[data-filter-target]");
  if (!groups.length || !list) return;

  var rows = Array.prototype.slice.call(list.querySelectorAll("[data-format]"));
  var clusters = Array.prototype.slice.call(list.querySelectorAll(".rows__cluster"));
  var timer = null;

  var state = { format: "all", topic: "all" };

  function shows(row) {
    var formatOk = state.format === "all" || row.getAttribute("data-format") === state.format;
    var topicOk = state.topic === "all" || row.getAttribute("data-topic") === state.topic;
    return formatOk && topicOk;
  }

  function apply(kind, value) {
    if (state[kind] === value) return;
    state[kind] = value;

    groups.forEach(function (group) {
      if (group.getAttribute("data-filter-group") !== kind) return;
      group.setAttribute("data-active-filter", value);
      Array.prototype.forEach.call(group.querySelectorAll("[data-filter]"), function (toggle) {
        toggle.setAttribute(
          "aria-pressed",
          toggle.getAttribute("data-filter") === value ? "true" : "false"
        );
      });
    });

    var arriving = [];

    rows.forEach(function (row) {
      var show = shows(row);
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
        if (!shows(row)) {
          row.hidden = true;
          row.classList.add("is-filtered-out");
        }
      });
      clusters.forEach(function (cluster) {
        cluster.hidden = !cluster.querySelector("[data-format]:not([hidden])");
      });
    }, FADE);
  }

  groups.forEach(function (group) {
    var kind = group.getAttribute("data-filter-group");
    Array.prototype.forEach.call(group.querySelectorAll("[data-filter]"), function (toggle) {
      toggle.addEventListener("click", function () {
        apply(kind, toggle.getAttribute("data-filter"));
      });
    });
  });
})();
