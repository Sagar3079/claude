/* Bindwell - courses.html only. Vanilla, no dependencies, loaded with defer
   after js/data.js and js/main.js.

   The twelve cards are rendered ONCE from js/data.js into .card-slot
   wrappers. Filtering never re-renders: it reads the state off the chips,
   writes it to data attributes, and toggles slot visibility
   (.is-fading for 150ms, then .is-filtered-out removes it from layout).

   State:
     ?q=      free text against title + instructor + category
     ?cat=    engineering | design | data | career
     ?level=  Beginner | Intermediate | Advanced
     ?format= Self-paced | Cohort
   All four combine with AND. A course marked "All levels" matches every
   level filter, because it does. */
(function () {
  "use strict";

  var data = window.BINDWELL_DATA;
  var courses = window.BINDWELL_COURSES;
  var grid = document.querySelector("[data-catalog-grid]");
  if (!data || !courses || !grid) return;

  var FADE = 150;

  var pageTitle = document.querySelector("[data-page-title]");
  var pageLede = document.querySelector("[data-page-lede]");
  var searchActions = document.querySelector("[data-search-actions]");
  var countEl = document.querySelector("[data-result-count]");
  var empty = document.querySelector("[data-empty]");
  var emptyTitle = document.querySelector("[data-empty-title]");
  var chips = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));

  var LEDE_DEFAULT = pageLede ? pageLede.textContent : "";

  /* ------------------------------------------------------------------ */
  /* URL state                                                          */
  /* ------------------------------------------------------------------ */

  function param(name) {
    try {
      var v = new URLSearchParams(window.location.search).get(name);
      return v ? v.trim() : "";
    } catch (e) {
      return "";
    }
  }

  /* Accept a slug or a display name for ?cat=, and a case-insensitive
     ?level= / ?format=, so a hand-typed URL still lands somewhere sensible. */
  function normaliseCat(raw) {
    if (!raw) return "all";
    var want = raw.toLowerCase();
    var cats = window.BINDWELL_CATEGORIES || [];
    for (var i = 0; i < cats.length; i++) {
      if (cats[i].slug === want || cats[i].name.toLowerCase() === want) return cats[i].slug;
    }
    return "all";
  }

  function normaliseFrom(raw, allowed) {
    if (!raw) return "any";
    var want = raw.toLowerCase();
    for (var i = 0; i < allowed.length; i++) {
      if (allowed[i].toLowerCase() === want) return allowed[i];
    }
    return "any";
  }

  var state = {
    q: param("q"),
    cat: normaliseCat(param("cat")),
    level: normaliseFrom(param("level"), ["Beginner", "Intermediate", "Advanced"]),
    format: normaliseFrom(param("format"), ["Self-paced", "Cohort"])
  };

  /* ------------------------------------------------------------------ */
  /* Render once                                                        */
  /* ------------------------------------------------------------------ */

  var html = "";
  for (var i = 0; i < courses.length; i++) {
    var c = courses[i];
    var haystack = (c.title + " " + c.instructor + " " + c.category).toLowerCase();
    html +=
      '<div class="card-slot" data-slot data-cat="' +
      data.escapeHtml(c.slug) +
      '" data-level="' +
      data.escapeHtml(c.level) +
      '" data-format="' +
      data.escapeHtml(c.format) +
      '" data-text="' +
      data.escapeHtml(haystack) +
      '">' +
      data.courseCard(c) +
      "</div>";
  }
  grid.innerHTML = html;

  var slots = Array.prototype.slice.call(grid.querySelectorAll("[data-slot]"));
  var timers = [];

  /* ------------------------------------------------------------------ */
  /* Filtering                                                          */
  /* ------------------------------------------------------------------ */

  function matches(slot) {
    if (state.cat !== "all" && slot.getAttribute("data-cat") !== state.cat) return false;

    if (state.level !== "any") {
      var level = slot.getAttribute("data-level");
      if (level !== state.level && level !== "All levels") return false;
    }

    if (state.format !== "any" && slot.getAttribute("data-format") !== state.format) return false;

    if (state.q && slot.getAttribute("data-text").indexOf(state.q.toLowerCase()) === -1) {
      return false;
    }

    return true;
  }

  function show(slot, instant) {
    slot.classList.remove("is-filtered-out");
    if (instant) {
      slot.classList.remove("is-fading");
      return;
    }
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        if (slot.getAttribute("data-visible") === "true") slot.classList.remove("is-fading");
      });
    });
  }

  function hide(slot, instant) {
    if (instant) {
      slot.classList.add("is-fading", "is-filtered-out");
      return;
    }
    slot.classList.add("is-fading");
    timers.push(
      window.setTimeout(function () {
        if (slot.getAttribute("data-visible") === "false") slot.classList.add("is-filtered-out");
      }, FADE)
    );
  }

  function apply(instant) {
    while (timers.length) window.clearTimeout(timers.pop());

    var visible = 0;
    for (var i = 0; i < slots.length; i++) {
      var slot = slots[i];
      var wanted = matches(slot);
      var was = slot.getAttribute("data-visible");
      slot.setAttribute("data-visible", wanted ? "true" : "false");
      if (wanted) visible++;

      if (was === null) {
        /* First pass: place them, no transition. */
        if (wanted) {
          slot.classList.remove("is-fading", "is-filtered-out");
        } else {
          slot.classList.add("is-fading", "is-filtered-out");
        }
        continue;
      }

      if (wanted && was === "false") show(slot, instant);
      if (!wanted && was === "true") hide(slot, instant);
    }

    render(visible);
  }

  /* ------------------------------------------------------------------ */
  /* Header, count, empty state                                         */
  /* ------------------------------------------------------------------ */

  function plural(n) {
    return n + (n === 1 ? " course" : " courses");
  }

  function quoted(term) {
    return "“" + term + "”";
  }

  function render(visible) {
    if (countEl) countEl.textContent = plural(visible);

    if (state.q) {
      if (pageTitle) pageTitle.textContent = "Results for " + quoted(state.q);
      if (pageLede) pageLede.textContent = plural(visible) + " for " + quoted(state.q) + ".";
      if (searchActions) searchActions.hidden = false;
    } else {
      if (pageTitle) pageTitle.textContent = "All courses";
      if (pageLede) pageLede.textContent = LEDE_DEFAULT;
      if (searchActions) searchActions.hidden = true;
    }

    if (empty) empty.hidden = visible !== 0;
    if (emptyTitle) {
      emptyTitle.textContent = state.q
        ? "Nothing matches " + quoted(state.q) + "."
        : "Nothing matches that combination.";
    }
  }

  /* ------------------------------------------------------------------ */
  /* Chips                                                              */
  /* ------------------------------------------------------------------ */

  function paintChips() {
    for (var i = 0; i < chips.length; i++) {
      var chip = chips[i];
      var group = chip.getAttribute("data-filter");
      var on = state[group] === chip.getAttribute("data-value");
      chip.setAttribute("aria-pressed", on ? "true" : "false");
    }
  }

  function syncUrl() {
    if (!window.history || !window.history.replaceState) return;
    try {
      var params = new URLSearchParams();
      if (state.q) params.set("q", state.q);
      if (state.cat !== "all") params.set("cat", state.cat);
      if (state.level !== "any") params.set("level", state.level);
      if (state.format !== "any") params.set("format", state.format);
      var query = params.toString();
      window.history.replaceState(null, "", query ? "courses.html?" + query : "courses.html");
    } catch (e) {
      /* History unavailable: filtering still works, the URL just stays put. */
    }
  }

  for (var ci = 0; ci < chips.length; ci++) {
    chips[ci].addEventListener("click", function (e) {
      var group = this.getAttribute("data-filter");
      var value = this.getAttribute("data-value");
      if (state[group] === value) return;
      state[group] = value;
      paintChips();
      /* e.detail === 0 means Enter/Space, not a pointer: no fade. */
      apply(e.detail === 0);
      syncUrl();
    });
  }

  /* Carry the search term into the nav fields so it is visible and editable. */
  if (state.q) {
    document.querySelectorAll("[data-search-form] input[name='q']").forEach(function (input) {
      input.value = state.q;
    });
  }

  paintChips();
  apply(true);

  /* ------------------------------------------------------------------ */
  /* Sticky filter bar: the hairline appears only once it is stuck.     */
  /* ------------------------------------------------------------------ */

  var bar = document.querySelector("[data-filters]");
  var sentinel = document.querySelector("[data-filter-sentinel]");
  if (bar && sentinel && "IntersectionObserver" in window) {
    var navH = 72;
    var io = new IntersectionObserver(
      function (entries) {
        bar.classList.toggle("is-stuck", !entries[0].isIntersecting);
      },
      { rootMargin: "-" + navH + "px 0px 0px 0px", threshold: 0 }
    );
    io.observe(sentinel);
  }
})();
