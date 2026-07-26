/* TOLERANCE - course.html only. Vanilla, no dependencies, loaded with defer
   after js/main.js.

   course.html ships as a complete, valid TL-301 page. This file reads the
   optional `?c=CODE` query parameter and repopulates that page from the course
   table below, so every catalog row can point at its own detail page
   (course.html?c=TL-112). An unknown, empty or malformed code falls back to
   TL-301, which is also what the static markup contains.

   Cart writes go through the contract API only: the buy control carries
   data-add-to-cart and the remove control data-remove-from-cart, both handled
   by main.js. This file only reads the cart to show whether the course is
   already in the order. */
(function () {
  "use strict";

  var DEFAULT_CODE = "TL-301";

  var ICON_PLUS =
    '<svg class="icon acc__icon" viewBox="0 0 256 256" aria-hidden="true">' +
    '<line x1="40" y1="128" x2="216" y2="128"></line>' +
    '<line x1="128" y1="40" x2="128" y2="216"></line></svg>';

  var ICON_ARROW =
    '<svg class="icon row__arrow" viewBox="0 0 256 256" aria-hidden="true">' +
    '<line x1="40" y1="128" x2="216" y2="128"></line>' +
    '<polyline points="144 56 216 128 144 200"></polyline></svg>';

  var OPEN_Q = "“";
  var CLOSE_Q = "”";

  /* -----------------------------------------------------------------------
     Course table. Authoritative data from CONTRACT.md section 10; syllabus
     runtimes sum to the published total for every self-paced course.
     Lessons are [title, duration].
     ----------------------------------------------------------------------- */
  var COURSES = {
    "TL-301": {
      code: "TL-301",
      title: "Systems Under Load",
      format: "SELF-PACED",
      price: "$249",
      meta: "11H 20M / 07 MODULES",
      panelLabel: "One-time purchase",
      desc: "Performance engineering for distributed backends: measure first, then fix the queue, the allocator, and the network, in that order.",
      standfirst: "Seven modules on making distributed backends fast under real traffic: measure the system, then fix the queue, the allocator, and the network, in that order.",
      seed: "tolerance-tl301-cover",
      cover: "Rack-mounted server hardware on a test bench",
      instructor: {
        name: "Dario Ferrentino",
        cred: "Ex-infra lead, 9 years on payment-scale queues.",
        seed: "tolerance-instructor-ferrentino",
        bio: [
          "Dario spent nine years on payment infrastructure, most of it on the queues that sit between authorisation and settlement.",
          "He now works on capacity planning, and teaches the measurement practice he wishes someone had handed him in his first year on call.",
          "He wrote this course after watching three teams optimise the wrong layer for a quarter each."
        ]
      },
      includes: [
        "11h 20m of video, streaming and download.",
        "24 exercises with reference solutions.",
        "Benchmark harness repository, yours to keep.",
        "Free revisions for the life of the course.",
        "Team licenses from 5 seats."
      ],
      specs: [
        ["Total runtime", "11h 20m", "Recorded at final pace, no padding."],
        ["Modules", "07", "Each one ends with a measured result."],
        ["Exercises", "24", "Harnesses and benchmarks you run locally."],
        ["Prerequisites", "One backend language", "You should be able to read a flame graph."],
        ["Last revised", "2026-05", "Allocator module re-recorded on current runtimes."],
        ["Format", "Self-paced", "Lifetime access, revisions included."]
      ],
      quote: {
        body: "I have taken four performance courses. This is the only one where the benchmarks in the videos reproduced on my machine.",
        name: "Ines Duarte-Vogel",
        role: "Staff Engineer, freight-routing platform"
      },
      adjacent: ["TL-410", "TL-317"],
      modules: [
        ["01", "Measurement before change", [
          ["Choosing a workload that represents production", "18:40"],
          ["Sampling profilers and what they miss", "22:10"],
          ["Reading a flame graph without guessing", "16:05"],
          ["Building a baseline harness with repeatable runs", "25:30"]
        ]],
        ["02", "Queues, backpressure, and fairness", [
          ["Little's law in production terms", "14:20"],
          ["Bounded queues and shedding load on purpose", "21:45"],
          ["Fairness under mixed traffic", "19:15"]
        ]],
        ["03", "Allocators and memory pressure", [
          ["Where allocation cost actually lands", "17:50"],
          ["Arena and pool strategies", "23:05"],
          ["Collector pauses you can predict", "20:35"]
        ]],
        ["04", "The network is the slowest part", [
          ["Connection reuse and head-of-line blocking", "18:25"],
          ["Batching without adding latency", "22:40"],
          ["Timeouts, retries, and the retry storm", "26:15"]
        ]],
        ["05", "Storage and the cost of durability", [
          ["Write amplification you can measure", "24:10"],
          ["Index choices under a read-heavy load", "21:35"],
          ["Fsync, batching, and honest durability", "26:40"],
          ["Read replicas and the lag you inherit", "22:15"],
          ["Cache invalidation as a queue problem", "19:50"],
          ["Rebuilding a hot table without downtime", "23:20"]
        ]],
        ["06", "Concurrency without contention", [
          ["Locks, and the ones you did not know you held", "22:45"],
          ["Work stealing and why it can lose", "20:30"],
          ["Thread pools sized from measurement", "18:55"],
          ["Async runtimes and blocking calls", "25:15"],
          ["Contention profiles on real hardware", "24:05"],
          ["Removing a lock and proving it", "26:20"]
        ]],
        ["07", "Load tests that predict production", [
          ["Traffic models built from real logs", "21:40"],
          ["Open versus closed load generation", "23:15"],
          ["Warm-up, steady state, and what to discard", "19:35"],
          ["Reading tail latency without lying", "27:10"],
          ["Capacity limits and the safe operating point", "25:50"],
          ["Writing the performance report", "20:15"]
        ]]
      ]
    },

    "TL-204": {
      code: "TL-204",
      title: "Interface Physics",
      format: "SELF-PACED",
      price: "$229",
      meta: "8H 45M / 06 MODULES",
      panelLabel: "One-time purchase",
      desc: "Motion, gesture, and state transitions for design engineers who want interfaces that feel machined, not decorated.",
      standfirst: "Six modules on motion, gesture, and state for design engineers, ending with an interaction library you build, test, and publish yourself.",
      seed: "tolerance-tl204-cover",
      cover: "Close view of a machined control surface",
      instructor: {
        name: "Anneke Visser",
        cred: "Design engineer; shipped three widely used open-source interaction libraries.",
        seed: "tolerance-instructor-visser",
        bio: [
          "Anneke is a design engineer who has shipped three widely used open-source interaction libraries.",
          "She works between design and engineering, mostly on the parts of an interface that move: sheets, drags, transitions, and the states in between.",
          "This course is the argument she has been having with product teams for a decade, written down and measured."
        ]
      },
      includes: [
        "8h 45m of video, streaming and download.",
        "18 exercises with reference solutions.",
        "Source repository for the interaction library.",
        "Free revisions for the life of the course.",
        "Team licenses from 5 seats."
      ],
      specs: [
        ["Total runtime", "8h 45m", "Recorded at final pace, no padding."],
        ["Modules", "06", "Each one ships a working interaction."],
        ["Exercises", "18", "Built and profiled in the browser."],
        ["Prerequisites", "CSS and JavaScript", "You should have shipped an interface before."],
        ["Last revised", "2026-04", "Gesture module updated for current pointer APIs."],
        ["Format", "Self-paced", "Lifetime access, revisions included."]
      ],
      quote: {
        body: "The module on interruption changed how I write every transition. We deleted a third of our animation code the week after.",
        name: "Sanne Rietveld",
        role: "Design Engineer, scheduling software"
      },
      adjacent: ["TL-317", "TL-112"],
      modules: [
        ["01", "The physics you are simulating", [
          ["What springs model and what they do not", "21:05"],
          ["Duration, easing, and perceived weight", "19:40"],
          ["Interruption: the state you forgot", "23:15"],
          ["Choosing a motion budget for a product", "18:30"]
        ]],
        ["02", "State transitions that survive users", [
          ["Enter, exit, and the states between", "22:20"],
          ["Animating layout without reflow cost", "24:10"],
          ["Shared element transitions, honestly", "25:35"],
          ["Cancelling motion mid-flight", "20:25"]
        ]],
        ["03", "Gesture", [
          ["Pointer events across three input types", "20:50"],
          ["Drag, threshold, and rubber banding", "24:45"],
          ["Velocity handoff into a spring", "22:15"],
          ["When a gesture should refuse", "19:40"]
        ]],
        ["04", "The performance of motion", [
          ["Compositor-only properties in practice", "23:30"],
          ["Measuring dropped frames on real devices", "21:20"],
          ["Paint cost of blur, filter, and clip", "22:10"],
          ["Budgeting animation on low-end hardware", "20:30"]
        ]],
        ["05", "Accessibility and restraint", [
          ["Reduced motion as a design input", "18:45"],
          ["Focus, order, and animated content", "21:35"],
          ["Motion that carries meaning", "20:20"],
          ["Removing an animation and proving it", "22:20"]
        ]],
        ["06", "Building the library", [
          ["API shape for an interaction primitive", "24:15"],
          ["Testing motion without flaky snapshots", "23:40"],
          ["Documenting behaviour, not implementation", "21:50"],
          ["Shipping and versioning the package", "22:15"]
        ]]
      ]
    },

    "TL-112": {
      code: "TL-112",
      title: "The Type System, Fully",
      format: "SELF-PACED",
      price: "$189",
      meta: "9H 10M / 08 MODULES",
      panelLabel: "One-time purchase",
      desc: "Advanced TypeScript from variance to the compiler API, taught through a real library you publish at the end.",
      standfirst: "Eight modules on TypeScript past the basics: variance, inference, conditional types, and the compiler API, taught through a library you publish.",
      seed: "tolerance-tl112-cover",
      cover: "Detail of a printed technical specification",
      instructor: {
        name: "Rohan Chandrasekar",
        cred: "Compiler-team alum; maintains a typed-SQL library.",
        seed: "tolerance-instructor-chandrasekar",
        bio: [
          "Rohan worked on a compiler team before moving to library work, and maintains a typed-SQL library used in production.",
          "He spends most of his time on inference: types that are strict at the boundary and invisible in the middle.",
          "The course ends where his working day starts, publishing types that other people depend on."
        ]
      },
      includes: [
        "9h 10m of video, streaming and download.",
        "32 exercises with reference solutions.",
        "Source repository for the published library.",
        "Free revisions for the life of the course.",
        "Team licenses from 5 seats."
      ],
      specs: [
        ["Total runtime", "9h 10m", "Recorded at final pace, no padding."],
        ["Modules", "08", "Each one adds to the library you publish."],
        ["Exercises", "32", "Type tests that fail before they pass."],
        ["Prerequisites", "TypeScript, daily", "You should have written generics in anger."],
        ["Last revised", "2026-06", "Compiler API module updated for the current release."],
        ["Format", "Self-paced", "Lifetime access, revisions included."]
      ],
      quote: {
        body: "I stopped guessing at inference. The variance module alone paid for the course twice over.",
        name: "Tomas Alarcon",
        role: "Platform Engineer, developer tools"
      },
      adjacent: ["TL-410", "TL-204"],
      modules: [
        ["01", "Foundations you thought you knew", [
          ["Structural typing and its edges", "22:40"],
          ["Widening, narrowing, and literal types", "24:05"],
          ["Reading an error from the inside out", "21:15"]
        ]],
        ["02", "Variance", [
          ["Covariance and contravariance in practice", "25:10"],
          ["Method bivariance and where it bites", "22:35"],
          ["Designing an API that varies correctly", "21:00"]
        ]],
        ["03", "Generics that stay readable", [
          ["Inference sites and why they fail", "23:20"],
          ["Constraints, defaults, and partial inference", "24:40"],
          ["Naming and documenting type parameters", "20:45"]
        ]],
        ["04", "Conditional and mapped types", [
          ["Distribution over unions", "24:15"],
          ["Key remapping without losing meaning", "22:50"],
          ["Recursion limits and how to stay under them", "21:40"]
        ]],
        ["05", "Type-level correctness for real data", [
          ["Parsing at the boundary, not in the core", "25:30"],
          ["Branded types for identifiers", "21:05"],
          ["Exhaustiveness the compiler enforces", "22:10"]
        ]],
        ["06", "The compiler API", [
          ["The program, the checker, and the source file", "26:20"],
          ["Writing a lint rule with type information", "24:35"],
          ["Codemods that do not corrupt formatting", "22:50"]
        ]],
        ["07", "Publishing types other people trust", [
          ["Declaration files, exports, and resolution", "23:15"],
          ["Compatibility across compiler versions", "21:30"],
          ["Type tests in continuous integration", "24:00"]
        ]],
        ["08", "The library, finished", [
          ["Cutting the public surface down", "20:40"],
          ["Performance of type checking at scale", "24:20"],
          ["Release, changelog, and deprecation policy", "19:30"]
        ]]
      ]
    },

    "TL-317": {
      code: "TL-317",
      title: "Design for Density",
      format: "SELF-PACED",
      price: "$279",
      meta: "7H 30M / 05 MODULES",
      panelLabel: "One-time purchase",
      desc: "Data-dense product UI: tables, monitoring views, and editors that stay legible at 200 rows and 4 a.m.",
      standfirst: "Five modules on data-dense product interfaces: tables, monitoring views, and editors that stay legible at 200 rows and at four in the morning.",
      seed: "tolerance-tl317-cover",
      cover: "Instrument panel with dense gauges and labels",
      instructor: {
        name: "Louisa Okereke",
        cred: "Led design on two monitoring products.",
        seed: "tolerance-instructor-okereke",
        bio: [
          "Louisa led design on two monitoring products, both of them screens people read while something is broken.",
          "Her work is mostly tables, charts, and editors: interfaces judged on how fast a tired person finds one number.",
          "She teaches density as a set of decisions, not a style."
        ]
      },
      includes: [
        "7h 30m of video, streaming and download.",
        "16 exercises with reference solutions.",
        "Design and code source files for every screen.",
        "Free revisions for the life of the course.",
        "Team licenses from 5 seats."
      ],
      specs: [
        ["Total runtime", "7h 30m", "Recorded at final pace, no padding."],
        ["Modules", "05", "Each one rebuilds a real screen."],
        ["Exercises", "16", "Redesigns critiqued against a checklist."],
        ["Prerequisites", "Product UI work", "You should have shipped a table someone uses daily."],
        ["Last revised", "2026-03", "Monitoring module rebuilt around current chart practice."],
        ["Format", "Self-paced", "Lifetime access, revisions included."]
      ],
      quote: {
        body: "Our monitoring table went from unreadable to the screen the on-call team keeps open all shift.",
        name: "Priya Raghunathan",
        role: "Product Designer, observability tooling"
      },
      adjacent: ["TL-204", "TL-405"],
      modules: [
        ["01", "Density is a decision", [
          ["Information per screen, measured", "21:40"],
          ["Type scale and rhythm at small sizes", "23:15"],
          ["Color as a data channel", "22:05"],
          ["Deciding what to remove", "23:00"]
        ]],
        ["02", "Tables that hold 200 rows", [
          ["Column priority and progressive disclosure", "24:10"],
          ["Alignment, tabular numerals, and scanning", "21:50"],
          ["Sorting, filtering, and state you can share", "22:35"],
          ["Virtualisation without breaking the keyboard", "21:25"]
        ]],
        ["03", "Monitoring views", [
          ["Charts that answer one question", "23:45"],
          ["Thresholds, alerts, and honest color", "22:20"],
          ["Time ranges and comparison views", "21:15"],
          ["Designing for the 4 a.m. reader", "22:40"]
        ]],
        ["04", "Editors and dense forms", [
          ["Inline editing without modal escape hatches", "24:30"],
          ["Validation that appears where it matters", "21:10"],
          ["Keyboard paths through a dense screen", "23:20"],
          ["Undo, history, and trust", "21:00"]
        ]],
        ["05", "Shipping the dense product", [
          ["Contrast and target size at density", "23:35"],
          ["Responsive rules for tables and panels", "22:25"],
          ["Performance budgets for data-heavy UI", "21:50"],
          ["Reviewing a dense screen with engineers", "22:10"]
        ]]
      ]
    },

    "TL-410": {
      code: "TL-410",
      title: "From Parser to Production",
      format: "COHORT, 8 WEEKS",
      price: "$1,450",
      meta: "16 LIVE SESSIONS / 20 SEATS",
      panelLabel: "Per cohort run",
      desc: "Build a small compiled language end to end, with weekly code review of your implementation.",
      standfirst: "Eight weeks of live sessions in which you build a small compiled language end to end, with weekly review of your own implementation.",
      seed: "tolerance-tl410-cover",
      cover: "Workshop bench with tooling and printed listings",
      instructor: {
        name: "Efe Demirci",
        cred: "Wrote the parsing course notes half this industry learned from.",
        seed: "tolerance-instructor-demirci",
        bio: [
          "Efe wrote the parsing course notes that half this industry learned from.",
          "He has built four language implementations, two of them in production, and reviews compiler code for a living.",
          "In this cohort he reads every implementation submitted, every week, and says what he would change."
        ]
      },
      includes: [
        "16 live sessions with the instructor.",
        "Weekly written review of your implementation.",
        "Recordings of every session, kept after the run.",
        "Cohort channel for the full eight weeks.",
        "Invoices and team seats on request."
      ],
      specs: [
        ["Live sessions", "16", "Two 90-minute sessions each week."],
        ["Cohort length", "8 weeks", "Runs twice a year, September and March."],
        ["Seats", "20", "Small enough that every submission is read."],
        ["Prerequisites", "One systems language", "You will write a compiler in it, from nothing."],
        ["Next cohort", "2026-09", "Enrollment closes when the seats are taken."],
        ["Format", "Cohort, live", "Recordings stay available after the run."]
      ],
      quote: {
        body: "Weekly review of my own parser was worth more than every compiler book I own.",
        name: "Jonas Weiler",
        role: "Backend Engineer, payments infrastructure"
      },
      adjacent: ["TL-112", "TL-301"],
      modules: [
        ["01", "Lexing and the shape of a language", [
          ["Tokens, spans, and error recovery", "90 MIN"],
          ["Workshop: your lexer, reviewed", "90 MIN"]
        ]],
        ["02", "Parsing without regret", [
          ["Recursive descent and precedence", "90 MIN"],
          ["Workshop: your parser, reviewed", "90 MIN"]
        ]],
        ["03", "Names, scopes, and trees", [
          ["Resolving names into a symbol table", "90 MIN"],
          ["Workshop: your resolver, reviewed", "90 MIN"]
        ]],
        ["04", "Types and diagnostics", [
          ["A small type checker that says useful things", "90 MIN"],
          ["Workshop: your diagnostics, reviewed", "90 MIN"]
        ]],
        ["05", "Intermediate representation", [
          ["Lowering the tree to an IR", "90 MIN"],
          ["Workshop: your IR, reviewed", "90 MIN"]
        ]],
        ["06", "Code generation", [
          ["Emitting bytecode you can debug", "90 MIN"],
          ["Workshop: your backend, reviewed", "90 MIN"]
        ]],
        ["07", "Runtime and memory", [
          ["A runtime with predictable pauses", "90 MIN"],
          ["Workshop: your runtime, reviewed", "90 MIN"]
        ]],
        ["08", "Production", [
          ["Packaging, tests, and error messages", "90 MIN"],
          ["Workshop: final implementation review", "90 MIN"]
        ]]
      ]
    },

    "TL-405": {
      code: "TL-405",
      title: "The Staff Engineer Brief",
      format: "COHORT, 6 WEEKS",
      price: "$980",
      meta: "12 LIVE SESSIONS / 24 SEATS",
      panelLabel: "Per cohort run",
      desc: "Technical writing, RFC strategy, and decision records for engineers moving from output to leverage.",
      standfirst: "Six weeks of live sessions on technical writing, RFC strategy, and decision records for engineers whose work now moves through other people.",
      seed: "tolerance-tl405-cover",
      cover: "Desk with printed documents and annotations",
      instructor: {
        name: "Marta Kovanen",
        cred: "Former staff engineer at a 400-person logistics firm.",
        seed: "tolerance-instructor-kovanen",
        bio: [
          "Marta was a staff engineer at a 400-person logistics firm, where most of her output was documents.",
          "She has written and defended enough proposals to know which arguments fail, and that they usually fail before the technical section.",
          "The cohort is built on your own writing: you bring a real document each week and it gets reviewed."
        ]
      },
      includes: [
        "12 live sessions with the instructor.",
        "Weekly written review of your documents.",
        "Recordings of every session, kept after the run.",
        "Cohort channel for the full six weeks.",
        "Invoices and team seats on request."
      ],
      specs: [
        ["Live sessions", "12", "Two 90-minute sessions each week."],
        ["Cohort length", "6 weeks", "Runs twice a year, October and April."],
        ["Seats", "24", "Every document submitted is read and marked up."],
        ["Prerequisites", "Two years shipping", "Bring a real document you need to land."],
        ["Next cohort", "2026-10", "Enrollment closes when the seats are taken."],
        ["Format", "Cohort, live", "Recordings stay available after the run."]
      ],
      quote: {
        body: "My last design document was approved without a meeting. That had never happened before.",
        name: "Chidi Nwosu",
        role: "Senior Engineer, logistics platform"
      },
      adjacent: ["TL-317", "TL-204"],
      modules: [
        ["01", "What leverage means on paper", [
          ["Writing that changes a decision", "90 MIN"],
          ["Workshop: rewrite your last document", "90 MIN"]
        ]],
        ["02", "The design document", [
          ["Structure, claims, and evidence", "90 MIN"],
          ["Workshop: your document, reviewed", "90 MIN"]
        ]],
        ["03", "Proposals and disagreement", [
          ["Proposing change to people who will push back", "90 MIN"],
          ["Workshop: your proposal, reviewed", "90 MIN"]
        ]],
        ["04", "Decision records", [
          ["Recording a decision so it survives the team", "90 MIN"],
          ["Workshop: your decision record, reviewed", "90 MIN"]
        ]],
        ["05", "Reviewing other people's work", [
          ["Technical review without rewriting", "90 MIN"],
          ["Workshop: review a peer proposal", "90 MIN"]
        ]],
        ["06", "The brief", [
          ["One page a director can act on", "90 MIN"],
          ["Workshop: final brief, reviewed", "90 MIN"]
        ]]
      ]
    }
  };

  /* -----------------------------------------------------------------------
     Which course is this page?
     ----------------------------------------------------------------------- */
  function requestedCode() {
    var match = /[?&]c=([^&]*)/.exec(window.location.search);
    if (!match) return "";
    try {
      return decodeURIComponent(match[1]).trim().toUpperCase();
    } catch (e) {
      return "";
    }
  }

  function resolve() {
    var code = requestedCode();
    return Object.prototype.hasOwnProperty.call(COURSES, code) ? code : DEFAULT_CODE;
  }

  /* -----------------------------------------------------------------------
     Small DOM helpers
     ----------------------------------------------------------------------- */
  function el(attr) {
    return document.querySelector("[" + attr + "]");
  }

  function setText(attr, value) {
    var node = el(attr);
    if (node) node.textContent = value;
  }

  function setHTML(attr, value) {
    var node = el(attr);
    if (node) node.innerHTML = value;
  }

  var LOCAL_IMG = {"tolerance-instructor-ferrentino": "img/ferrentino.svg", "tolerance-instructor-visser": "img/visser.svg", "tolerance-instructor-chandrasekar": "img/chandrasekar.svg", "tolerance-instructor-okereke": "img/okereke.svg", "tolerance-instructor-demirci": "img/demirci.svg", "tolerance-instructor-kovanen": "img/kovanen.svg", "tolerance-tl301-cover": "img/tl301-cover.svg", "tolerance-tl204-cover": "img/tl301-cover.svg", "tolerance-tl112-cover": "img/tl301-cover.svg", "tolerance-tl317-cover": "img/tl301-cover.svg", "tolerance-tl410-cover": "img/tl301-cover.svg", "tolerance-tl405-cover": "img/tl301-cover.svg"};

  function setImage(attr, seed, size, alt) {
    var node = el(attr);
    if (!node) return;
    node.src = LOCAL_IMG[seed] || "img/tl301-cover.svg";
    node.alt = alt;
  }

  function setCartCode(attr, code) {
    var node = el(attr);
    if (node) node.setAttribute(attr, code);
  }

  /* -----------------------------------------------------------------------
     Builders
     ----------------------------------------------------------------------- */
  function buildSpecs(course) {
    return course.specs
      .map(function (cell) {
        return (
          '<div class="spec-cell">' +
          '<span class="mono-label spec-cell__label">' + cell[0] + "</span>" +
          '<p class="spec-cell__value">' + cell[1] + "</p>" +
          '<p class="spec-cell__note">' + cell[2] + "</p>" +
          "</div>"
        );
      })
      .join("");
  }

  function buildSyllabus(course) {
    return course.modules
      .map(function (module, index) {
        var open = index === 0;
        var id = "mod-" + module[0];
        var lessons = module[2]
          .map(function (lesson) {
            return (
              '<li class="acc__lesson"><span>' + lesson[0] + "</span>" +
              '<span class="mono-data">' + lesson[1] + "</span></li>"
            );
          })
          .join("");

        return (
          '<div class="acc__item' + (open ? " is-open" : "") + '">' +
          '<button class="acc__trigger" type="button" aria-expanded="' +
          (open ? "true" : "false") + '" aria-controls="' + id + '">' +
          "<span><span class=\"acc__code\">" + module[0] + "</span>" + module[1] + "</span>" +
          ICON_PLUS +
          "</button>" +
          '<div class="acc__panel" id="' + id + '"><div class="acc__clip">' +
          '<div class="acc__inner"><ul>' + lessons + "</ul></div>" +
          "</div></div></div>"
        );
      })
      .join("");
  }

  function buildRow(course) {
    return (
      '<a class="row" href="course.html?c=' + course.code + '">' +
      '<span class="row__code mono-data"><span>' + course.code + "</span>" +
      "<span>" + course.format + "</span></span>" +
      '<span class="row__main"><span class="h3">' + course.title + "</span>" +
      '<span class="row__desc body-sm">' + course.desc + "</span></span>" +
      '<span class="row__meta mono-data">' + course.meta + "</span>" +
      '<span class="row__price">' + course.price + ICON_ARROW + "</span></a>"
    );
  }

  function buildAdjacent(course) {
    var rows = course.adjacent
      .map(function (code) {
        return COURSES[code] ? buildRow(COURSES[code]) : "";
      })
      .join("");
    return '<div class="rows__cluster">' + rows + "</div>";
  }

  function buildList(items) {
    return items
      .map(function (item) { return "<li>" + item + "</li>"; })
      .join("");
  }

  function buildBio(paragraphs) {
    return paragraphs
      .map(function (text) { return '<p class="body t-2">' + text + "</p>"; })
      .join("");
  }

  /* -----------------------------------------------------------------------
     Render
     ----------------------------------------------------------------------- */
  function render(course) {
    document.title = "TOLERANCE - " + course.title;

    /* Header */
    setText("data-c-meta", course.code + " / " + course.format);
    setText("data-c-title", course.title);
    setText("data-c-standfirst", course.standfirst);
    setImage("data-c-byline-img", course.instructor.seed, "200/200", course.instructor.name);
    setText("data-c-byline-name", course.instructor.name);
    setText("data-c-byline-cred", course.instructor.cred);

    /* Buy panel */
    setText("data-c-panel-label", course.panelLabel);
    setText("data-c-price", course.price);
    setHTML("data-c-includes", buildList(course.includes));
    setCartCode("data-add-to-cart", course.code);
    setCartCode("data-remove-from-cart", course.code);

    /* Body */
    setHTML("data-c-specs", buildSpecs(course));
    setHTML("data-c-syllabus", buildSyllabus(course));
    setImage("data-c-sample-img", course.seed, "1600/900", course.cover);
    setText("data-c-quote", OPEN_Q + course.quote.body + CLOSE_Q);
    setText("data-c-quote-name", course.quote.name);
    setText("data-c-quote-role", course.quote.role);
    setImage("data-c-inst-img", course.instructor.seed, "800/800", course.instructor.name);
    setText("data-c-inst-name", course.instructor.name);
    setHTML("data-c-inst-bio", buildBio(course.instructor.bio));
    setHTML("data-c-adjacent", buildAdjacent(course));
  }

  /* Cart state: read only. Writes go through main.js via the data attributes
     on the two controls. */
  function renderCartState(code) {
    var note = el("data-c-cart-note");
    if (!note || !window.TOLERANCE) return;
    note.hidden = window.TOLERANCE.readCart().indexOf(code) === -1;
  }

  var active = resolve();
  render(COURSES[active]);

  /* Bubbled listener, so it runs after the handlers main.js binds to the
     controls themselves, whatever order the two files initialise in. */
  document.addEventListener("click", function (event) {
    var target = event.target;
    if (!target || !target.closest) return;
    if (target.closest("[data-add-to-cart], [data-remove-from-cart]")) {
      renderCartState(active);
    }
  });

  document.addEventListener("DOMContentLoaded", function () {
    renderCartState(active);
  });
})();
