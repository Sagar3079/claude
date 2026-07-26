/* Bindwell - course.html only. Vanilla, no dependencies, loaded with defer
   after js/data.js and js/main.js.

   Everything on the page comes from js/data.js, keyed on ?c=CODE with the
   TL-301 fallback that BINDWELL_DATA.courseFromQuery() applies.

   Ordering note: deferred scripts run in document order BEFORE
   DOMContentLoaded, so this renders first and main.js then wires the
   accordion, the [data-course-grid] related row and the cart controls on
   its own DOMContentLoaded pass. The one late-load case is handled at the
   bottom of the file. */
(function () {
  "use strict";

  var data = window.BINDWELL_DATA;
  var courses = window.BINDWELL_COURSES;
  if (!data || !courses) return;

  var course = data.courseFromQuery();
  var esc = data.escapeHtml;
  var isCohort = course.format === "Cohort";
  /* The 3D viewport is a brand flourish, not a per-course illustration:
     two placements only, and this is the second one. */
  var SCENE_CODES = ["TL-301", "TL-410"];

  document.title = "Bindwell - " + course.title;
  var descTag = document.querySelector("meta[name='description']");
  if (descTag) descTag.setAttribute("content", course.desc);

  /* ------------------------------------------------------------------ */
  /* Icons (contract section 12)                                        */
  /* ------------------------------------------------------------------ */

  var ICON = {
    check:
      '<svg class="icon icon--sm" viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10.5l4 4 8-9"></path></svg>',
    video:
      '<svg class="icon icon--sm" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="7"></circle><path d="M8.5 7l4.5 3-4.5 3z"></path></svg>',
    list:
      '<svg class="icon icon--sm" viewBox="0 0 20 20" aria-hidden="true"><path d="M7 6h9M7 10h9M7 14h9M4 6h.01M4 10h.01M4 14h.01"></path></svg>',
    file:
      '<svg class="icon icon--sm" viewBox="0 0 20 20" aria-hidden="true"><path d="M11 2H5.5A1.5 1.5 0 0 0 4 3.5v13A1.5 1.5 0 0 0 5.5 18h9a1.5 1.5 0 0 0 1.5-1.5V7z"></path><path d="M11 2v5h5"></path></svg>',
    refund:
      '<svg class="icon icon--sm" viewBox="0 0 20 20" aria-hidden="true"><path d="M16 7A7 7 0 1 0 16.5 10"></path><path d="M16.5 3v4h-4"></path></svg>',
    lifetime:
      '<svg class="icon icon--sm" viewBox="0 0 20 20" aria-hidden="true"><path d="M7 7a3 3 0 1 0 0 6c2 0 3-3 6-3a3 3 0 1 1 0 6c-3 0-4-3-6-3"></path></svg>',
    person:
      '<svg class="icon icon--sm" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5"></circle><path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6"></path></svg>',
    chevron:
      '<svg class="icon acc__chevron" viewBox="0 0 20 20" aria-hidden="true"><path d="M5 8l5 5 5-5"></path></svg>'
  };

  /* ------------------------------------------------------------------ */
  /* Breadcrumb                                                         */
  /* ------------------------------------------------------------------ */

  var crumbs = document.querySelector("[data-crumbs]");
  if (crumbs) {
    crumbs.innerHTML =
      '<a href="index.html">Home</a><span class="crumbs__sep">/</span>' +
      '<a href="courses.html?cat=' +
      encodeURIComponent(course.slug) +
      '">' +
      esc(course.category) +
      "</a>" +
      '<span class="crumbs__sep">/</span><span>' +
      esc(course.title) +
      "</span>";
  }

  /* ------------------------------------------------------------------ */
  /* Title block                                                        */
  /* ------------------------------------------------------------------ */

  function titleBadge() {
    if (course.badge) return data.badgeMarkup(course.badge);
    if (isCohort) return data.badgeMarkup("Cohort");
    return "";
  }

  function detailMeta() {
    var bits = [course.lengthLong, course.level, course.format, course.updated];
    return bits
      .map(function (bit) {
        return esc(bit);
      })
      .join(" · ");
  }

  var titleBlock = document.querySelector("[data-title-block]");
  if (titleBlock) {
    var badge = titleBadge();
    titleBlock.innerHTML =
      (badge ? "<div>" + badge + "</div>" : "") +
      '<h1 class="h1">' +
      esc(course.title) +
      "</h1>" +
      '<p class="body t-2">' +
      esc(course.desc) +
      "</p>" +
      '<div class="rating-row">' +
      '<span class="rating-row__score">' +
      course.rating.toFixed(1) +
      "</span>" +
      data.starMarkup(course.rating, "md", course.reviews) +
      "<span>(" +
      data.formatCount(course.reviews) +
      " ratings)</span><span>· " +
      data.formatCount(course.learners) +
      " learners</span>" +
      "</div>" +
      '<p class="meta">Created by <a class="link" href="#instructor">' +
      esc(course.instructor) +
      "</a></p>" +
      '<p class="meta">' +
      detailMeta() +
      "</p>";
  }

  /* ------------------------------------------------------------------ */
  /* Curriculum                                                         */
  /* ------------------------------------------------------------------ */

  /* Lesson rows are numbered straight through the course, so the last row
     matches the "26 lessons" summary. Each module's minutes are split over
     its lessons on a fixed uneven weighting, so the rows read like a real
     module instead of a division; the remainder lands on the last lesson. */
  var WEIGHTS = [1.18, 0.82, 1.06, 0.9, 1.12, 0.86, 1.0, 1.08];

  function lessonRows(mod, offset) {
    var n = mod.lessons || 0;
    var total = mod.minutes || 0;
    var used = 0;
    var out = "";
    for (var i = 0; i < n; i++) {
      var mins =
        i === n - 1 ? total - used : Math.max(4, Math.round((total / n) * WEIGHTS[i % 8]));
      used += mins;
      out +=
        '<li class="acc__lesson"><span>Lesson ' +
        (offset + i + 1) +
        "</span><span>" +
        (mins < 10 ? "0" + mins : mins) +
        ":00</span></li>";
    }
    return "<ul>" + out + "</ul>";
  }

  function curriculumMarkup() {
    var out = '<div class="acc" data-accordion>';
    var counted = 0;
    for (var i = 0; i < course.syllabus.length; i++) {
      var mod = course.syllabus[i];
      var open = i === 0;
      var id = "mod-" + (i + 1);
      var meta = mod.weekly
        ? esc(mod.weekly)
        : mod.lessons + " lessons · " + data.formatDuration(mod.minutes);
      var body = mod.weekly
        ? '<p class="acc__text">' +
          esc(mod.weekly) +
          ": one live session, then a review of the work you bring." +
          "</p>"
        : lessonRows(mod, counted);
      counted += mod.lessons || 0;

      out +=
        '<div class="acc__item' +
        (open ? " is-open" : "") +
        '">' +
        '<button class="acc__trigger" type="button" aria-expanded="' +
        (open ? "true" : "false") +
        '" aria-controls="' +
        id +
        '">' +
        '<span class="acc__title">' +
        esc(mod.title) +
        "</span>" +
        '<span class="acc__right"><span class="acc__meta">' +
        meta +
        "</span>" +
        ICON.chevron +
        "</span></button>" +
        '<div class="acc__panel" id="' +
        id +
        '"><div class="acc__clip"><div class="acc__inner">' +
        body +
        "</div></div></div>" +
        "</div>";
    }
    return out + "</div>";
  }

  /* ------------------------------------------------------------------ */
  /* Sections                                                           */
  /* ------------------------------------------------------------------ */

  function learnMarkup() {
    var items = course.bullets
      .map(function (b) {
        return '<li class="check-list__item">' + ICON.check + esc(b) + "</li>";
      })
      .join("");
    return (
      '<div class="panel stack-16">' +
      "<h2 class=\"h3\">What you'll learn</h2>" +
      '<ul class="check-list check-list--2">' +
      items +
      "</ul></div>"
    );
  }

  function requirementsMarkup() {
    var items = course.requirements
      .map(function (r) {
        return "<li>" + esc(r) + "</li>";
      })
      .join("");
    return (
      '<div class="stack-12"><h2 class="h3">Requirements</h2>' +
      '<ul class="bullet-list">' +
      items +
      "</ul></div>"
    );
  }

  function instructorMarkup() {
    var peers = courses.filter(function (c) {
      return c.instructor === course.instructor;
    });
    var learners = peers.reduce(function (sum, c) {
      return sum + c.learners;
    }, 0);
    var line =
      course.rating.toFixed(1) +
      " instructor rating · " +
      peers.length +
      (peers.length === 1 ? " course · " : " courses · ") +
      data.formatCount(learners) +
      " learners";

    return (
      '<div class="stack-16" id="instructor">' +
      '<h2 class="h3">About the instructor</h2>' +
      '<div class="instructor">' +
      '<span class="avatar avatar--lg" aria-hidden="true">' +
      esc(data.initials(course.instructor)) +
      "</span>" +
      '<div class="instructor__body">' +
      '<h3 class="h3">' +
      esc(course.instructor) +
      "</h3>" +
      '<p class="meta">' +
      esc(course.instructorCred) +
      "</p>" +
      '<p class="body-sm t-2 mt-8">' +
      esc(course.instructorBio) +
      "</p>" +
      '<p class="meta mt-8">' +
      line +
      "</p>" +
      "</div></div></div>"
    );
  }

  function reviewsMarkup() {
    var picked = data.pickReviews(course.code);
    var cards = picked
      .map(function (r) {
        return (
          '<article class="review">' +
          data.starMarkup(r.rating, "sm") +
          '<p class="review__name">' +
          esc(r.name) +
          "</p>" +
          '<p class="meta">' +
          esc(r.date) +
          "</p>" +
          '<p class="body-sm t-2">' +
          esc(r.body) +
          "</p></article>"
        );
      })
      .join("");

    return (
      '<div class="stack-24">' +
      '<h2 class="h2">Reviews</h2>' +
      '<div class="row-16">' +
      '<span class="price-lg">' +
      course.rating.toFixed(1) +
      "</span>" +
      data.starMarkup(course.rating, "md", course.reviews) +
      '<span class="meta">(' +
      data.formatCount(course.reviews) +
      " ratings)</span>" +
      "</div>" +
      '<div class="grid-3">' +
      cards +
      "</div></div>"
    );
  }

  /* Same category first (there are two others), then the next neighbour in
     catalog order, so the row is always three. */
  function relatedCodes() {
    var out = [];
    var i;
    for (i = 0; i < courses.length; i++) {
      if (courses[i].code !== course.code && courses[i].category === course.category) {
        out.push(courses[i].code);
      }
    }
    var start = courses.indexOf(course);
    for (i = 1; i < courses.length && out.length < 3; i++) {
      var next = courses[(start + i) % courses.length];
      if (next.code !== course.code && out.indexOf(next.code) === -1) out.push(next.code);
    }
    return out.slice(0, 3);
  }

  function relatedMarkup() {
    return (
      "<div>" +
      '<div class="section__head"><div class="section__heading">' +
      '<h2 class="h2">Related courses</h2>' +
      '<p class="section__lede">More in ' +
      esc(course.category) +
      ", and courses learners pair with this one.</p>" +
      "</div>" +
      '<a class="section__link" href="courses.html?cat=' +
      encodeURIComponent(course.slug) +
      '">Browse ' +
      esc(course.category) +
      " &rarr;</a></div>" +
      '<div class="grid-3" data-course-grid="' +
      relatedCodes().join(",") +
      '"></div></div>'
    );
  }

  var sections = document.querySelector("[data-sections]");
  if (sections) {
    sections.innerHTML =
      learnMarkup() +
      '<div class="stack-16"><h2 class="h2">Curriculum</h2>' +
      '<p class="meta">' +
      esc(data.curriculumSummary(course)) +
      "</p>" +
      curriculumMarkup() +
      "</div>" +
      requirementsMarkup() +
      instructorMarkup() +
      reviewsMarkup() +
      relatedMarkup();
  }

  /* ------------------------------------------------------------------ */
  /* Buy card + mobile buy bar                                          */
  /* ------------------------------------------------------------------ */

  function mediaMarkup() {
    if (SCENE_CODES.indexOf(course.code) !== -1) {
      return (
        '<div class="v3d-view v3d-view--card" data-scene="course" data-scene-fill="card">' +
        '<canvas class="v3d-canvas" aria-hidden="true"></canvas>' +
        '<img class="v3d-fallback" src="' +
        data.thumbSrc(course.category) +
        '" width="320" height="200" alt="">' +
        "</div>"
      );
    }
    return data.thumbMarkup(course);
  }

  function includesMarkup() {
    var rows = isCohort
      ? [
          [ICON.person, course.length],
          [ICON.list, course.syllabus.length + " modules, reviewed live"],
          [ICON.file, "Source files and exercises"],
          [ICON.lifetime, "Recordings and materials to keep"],
          [ICON.refund, "14-day refund, one click"]
        ]
      : [
          [ICON.video, course.lengthLong],
          [ICON.list, data.totalLessons(course) + " lessons"],
          [ICON.file, "Source files and exercises"],
          [ICON.lifetime, "Lifetime access and updates"],
          [ICON.refund, "14-day refund, one click"]
        ];
    return rows
      .map(function (row) {
        return '<li class="buy__item">' + row[0] + esc(row[1]) + "</li>";
      })
      .join("");
  }

  function inCart() {
    var codes = window.BINDWELL ? window.BINDWELL.readCart() : [];
    return codes.indexOf(course.code) !== -1;
  }

  function ctaMarkup(block) {
    var size = block ? "btn--block" : "btn--sm";
    if (inCart()) {
      return '<a class="btn btn--primary ' + size + '" href="checkout.html">Go to cart</a>';
    }
    return (
      '<button class="btn btn--primary ' +
      size +
      '" type="button" data-add-to-cart="' +
      esc(course.code) +
      '">Add to cart</button>'
    );
  }

  var buy = document.querySelector("[data-buy]");
  if (buy) {
    buy.innerHTML =
      '<aside class="buy sticky">' +
      '<div class="buy__media">' +
      mediaMarkup() +
      "</div>" +
      '<div class="buy__body">' +
      '<div class="buy__price"><span class="price-lg">' +
      data.formatPrice(course.price) +
      "</span>" +
      (isCohort ? '<span class="meta">per seat</span>' : "") +
      "</div>" +
      '<div data-buy-cta>' +
      ctaMarkup(true) +
      "</div>" +
      "<p class=\"buy__note\" data-buy-note>Added. It'll wait for you.</p>" +
      '<a class="btn btn--secondary btn--block" href="pricing.html">Buy with the plan</a>' +
      '<span class="label">This course includes</span>' +
      '<ul class="buy__list">' +
      includesMarkup() +
      "</ul>" +
      '<p class="buy__foot">Prices are demo data.</p>' +
      "</div></aside>";
  }

  var buybar = document.querySelector("[data-buybar]");
  if (buybar) {
    buybar.innerHTML =
      '<div class="buybar">' +
      '<span class="price">' +
      data.formatPrice(course.price) +
      "</span>" +
      '<span data-buybar-cta>' +
      ctaMarkup(false) +
      "</span></div>";
  }

  /* Cart state: primary swaps to "Go to cart" and the note fades in. */
  function paintCart() {
    var slot = document.querySelector("[data-buy-cta]");
    if (slot) slot.innerHTML = ctaMarkup(true);
    var barSlot = document.querySelector("[data-buybar-cta]");
    if (barSlot) barSlot.innerHTML = ctaMarkup(false);
    var note = document.querySelector("[data-buy-note]");
    if (note) note.classList.toggle("is-visible", inCart());
  }

  document.addEventListener("bindwell:cart", paintCart);
  paintCart();

  /* ------------------------------------------------------------------ */
  /* Late-load safety net                                                */
  /* ------------------------------------------------------------------ */

  /* Normal path: main.js has not run its DOMContentLoaded pass yet, so it
     picks up everything above. If this file somehow runs after that pass,
     wire the two things it would have missed. */
  if (document.readyState === "complete") {
    if (window.BINDWELL) window.BINDWELL.renderCourseGrids();
    document.querySelectorAll("[data-accordion] .acc__trigger").forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        var item = trigger.closest(".acc__item");
        if (!item) return;
        var open = trigger.getAttribute("aria-expanded") !== "true";
        trigger.setAttribute("aria-expanded", open ? "true" : "false");
        item.classList.toggle("is-open", open);
      });
    });
  }
})();
