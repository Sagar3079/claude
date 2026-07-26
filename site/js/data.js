/* Bindwell - catalog data and render helpers.
   Single source of truth for every page. Load with `defer` BEFORE js/main.js.

   Public surface:
     window.BINDWELL_COURSES        array of 12 course objects, display order
     window.BINDWELL_CATEGORIES     array of 4 category objects
     window.BINDWELL_REVIEWS        pool of fictional reviews
     window.BINDWELL_DATA           helper functions (see bottom of file)

   All people, numbers, ratings and reviews are fictional demo data. */
(function () {
  "use strict";

  /* ---------------------------------------------------------------------
     Categories. slug is used for thumbnails, filters and ?cat= links.
     --------------------------------------------------------------------- */
  var CATEGORIES = [
    { name: "Engineering", slug: "engineering" },
    { name: "Design", slug: "design" },
    { name: "Data & AI", slug: "data" },
    { name: "Product & Career", slug: "career" }
  ];

  /* ---------------------------------------------------------------------
     The catalog. Twelve courses.
     --------------------------------------------------------------------- */
  var COURSES = [
    {
      code: "TL-112",
      title: "TypeScript, All the Way Down",
      category: "Engineering",
      slug: "engineering",
      instructor: "Rohan Chandrasekar",
      instructorCred: "Compiler-team alum; maintains a typed-SQL library.",
      instructorBio:
        "Rohan spent six years on a compiler team before moving to library work. He now maintains a typed-SQL client used by a few thousand projects, and he still reads every type error twice.",
      rating: 4.8,
      reviews: 2140,
      learners: 18420,
      hours: 9.5,
      length: "9.5h",
      lengthLong: "9.5h video",
      level: "Advanced",
      format: "Self-paced",
      price: 79,
      priceCents: 7900,
      badge: null,
      updated: "Updated February 2026",
      desc:
        "Advanced TypeScript from variance to the compiler API, taught through a real library you publish at the end.",
      bullets: [
        "Read any type error calmly and fix its cause, not its symptom",
        "Design generic APIs that document themselves",
        "Use conditional, mapped, and template-literal types where they earn their keep",
        "Model impossible states out of existence",
        "Publish a fully typed library to npm"
      ],
      requirements: [
        "Two years of TypeScript, or solid JavaScript plus the basics.",
        "A machine with Node 20 or newer.",
        "Comfort reading other people's source code."
      ],
      syllabus: [
        { title: "A working mental model of the type system", lessons: 6, minutes: 100 },
        { title: "Generics that carry intent", lessons: 7, minutes: 130 },
        { title: "Conditional and mapped types", lessons: 8, minutes: 150 },
        { title: "The compiler API and codegen", lessons: 6, minutes: 110 },
        { title: "Ship it: building the library", lessons: 5, minutes: 80 }
      ]
    },
    {
      code: "TL-301",
      title: "Systems Under Load",
      category: "Engineering",
      slug: "engineering",
      instructor: "Dario Ferrentino",
      instructorCred: "Ex-infra lead, nine years on payment-scale queues.",
      instructorBio:
        "Dario led infrastructure for a payments platform through three orders of magnitude of growth. He is unromantic about performance work: measure, then change one thing.",
      rating: 4.7,
      reviews: 1893,
      learners: 12077,
      hours: 11.5,
      length: "11.5h",
      lengthLong: "11.5h video",
      level: "Advanced",
      format: "Self-paced",
      price: 89,
      priceCents: 8900,
      badge: null,
      updated: "Updated January 2026",
      desc:
        "Performance engineering for distributed backends: measure first, then fix the queue, the allocator, and the network, in that order.",
      bullets: [
        "Build a repeatable measurement harness before touching code",
        "Read flame graphs without guessing",
        "Apply queueing theory to real services",
        "Tame allocator and GC pressure",
        "Design timeouts and retries that don't storm"
      ],
      requirements: [
        "Two years running a backend service in production.",
        "Familiarity with one profiler, even a bad one.",
        "No queueing theory required. It is taught here."
      ],
      syllabus: [
        { title: "Measurement before change", lessons: 4, minutes: 150 },
        { title: "Queues, backpressure, fairness", lessons: 3, minutes: 130 },
        { title: "Allocators and memory pressure", lessons: 3, minutes: 130 },
        { title: "The network is the slowest part", lessons: 3, minutes: 120 },
        { title: "Case study: a checkout service at 40x load", lessons: 4, minutes: 160 }
      ]
    },
    {
      code: "TL-410",
      title: "Build a Programming Language",
      category: "Engineering",
      slug: "engineering",
      instructor: "Efe Demirci",
      instructorCred: "Wrote the parsing course notes half this industry learned from.",
      instructorBio:
        "Efe has taught parsing and compilation for a decade, mostly to people who were told it was too hard. The course notes have been passed around long enough to have their own folklore.",
      rating: 4.9,
      reviews: 312,
      learners: 1480,
      hours: null,
      length: "8 weeks, 16 live sessions",
      lengthLong: "8 weeks, 16 live sessions",
      level: "Advanced",
      format: "Cohort",
      price: 399,
      priceCents: 39900,
      badge: null,
      updated: "Next run starts September 2026",
      desc:
        "Build a small compiled language end to end, with weekly live code review of your implementation.",
      bullets: [
        "Write a lexer and recursive-descent parser by hand",
        "Design an AST you won't regret",
        "Type-check and lower to bytecode",
        "Build a small VM and a garbage collector",
        "Defend your design decisions in review"
      ],
      requirements: [
        "Fluency in one systems-flavoured language: Rust, Go, C, C++, or Java.",
        "Six to eight hours a week for the run of the cohort.",
        "Willingness to have your code read aloud."
      ],
      syllabus: [
        { title: "Lexing and parsing", weekly: "Week 1" },
        { title: "AST and pretty-printing", weekly: "Week 2" },
        { title: "Type checking", weekly: "Weeks 3-4" },
        { title: "Compilation and the VM", weekly: "Weeks 5-6" },
        { title: "Garbage collection", weekly: "Week 7" },
        { title: "Ship and demo day", weekly: "Week 8" }
      ]
    },
    {
      code: "TL-204",
      title: "Interface Motion",
      category: "Design",
      slug: "design",
      instructor: "Anneke Visser",
      instructorCred: "Design engineer; shipped three widely used open-source interaction libraries.",
      instructorBio:
        "Anneke builds interaction libraries and then argues with people about when to use them. Her first lesson in any course is about the animations you should not build.",
      rating: 4.8,
      reviews: 3204,
      learners: 27910,
      hours: 8.5,
      length: "8.5h",
      lengthLong: "8.5h video",
      level: "Intermediate",
      format: "Self-paced",
      price: 69,
      priceCents: 6900,
      badge: "Bestseller",
      updated: "Updated March 2026",
      desc:
        "Motion, gesture, and state transitions for design engineers who want interfaces that feel considered, not decorated.",
      bullets: [
        "Decide when NOT to animate",
        "Choose easing and duration by purpose",
        "Build interruptible transitions with plain CSS",
        "Design drag and swipe with momentum",
        "Respect reduced-motion without losing character"
      ],
      requirements: [
        "Working CSS and a little JavaScript.",
        "A project you can practise on, even a small one.",
        "No animation library required. Plain CSS throughout."
      ],
      syllabus: [
        { title: "The animation decision framework", lessons: 5, minutes: 90 },
        { title: "Easing, duration, perception", lessons: 6, minutes: 120 },
        { title: "Enter, exit, and interruption", lessons: 6, minutes: 120 },
        { title: "Gestures and physics", lessons: 5, minutes: 105 },
        { title: "A motion system for a real product", lessons: 4, minutes: 75 }
      ]
    },
    {
      code: "TL-317",
      title: "Designing Data-Dense Interfaces",
      category: "Design",
      slug: "design",
      instructor: "Louisa Okereke",
      instructorCred: "Led design on two monitoring products.",
      instructorBio:
        "Louisa has spent most of her career on screens that people stare at during incidents. She treats density as a decision, not an accident, and can defend every row height.",
      rating: 4.7,
      reviews: 954,
      learners: 8340,
      hours: 7.5,
      length: "7.5h",
      lengthLong: "7.5h video",
      level: "Intermediate",
      format: "Self-paced",
      price: 75,
      priceCents: 7500,
      badge: null,
      updated: "Updated December 2025",
      desc: "Tables, monitoring views, and editors that stay legible at 200 rows and 4 a.m.",
      bullets: [
        "Choose density on purpose, not by accident",
        "Typography and spacing systems for tables",
        "Progressive disclosure that doesn't hide the truth",
        "Color as signal, never decoration",
        "Audit a dense screen with a checklist you'll keep"
      ],
      requirements: [
        "Some product design experience, any tool.",
        "Access to one dense screen you are allowed to criticise."
      ],
      syllabus: [
        { title: "Why dense is different", lessons: 4, minutes: 80 },
        { title: "The table, mastered", lessons: 6, minutes: 130 },
        { title: "Dashboards and monitoring", lessons: 5, minutes: 110 },
        { title: "Editors and inspectors", lessons: 4, minutes: 85 },
        { title: "Density audit workshop", lessons: 3, minutes: 45 }
      ]
    },
    {
      code: "BW-118",
      title: "Typography from First Principles",
      category: "Design",
      slug: "design",
      instructor: "Miriam Kessler-Ode",
      instructorCred: "Book designer turned product designer; teaches type at two design schools.",
      instructorBio:
        "Miriam set books for eleven years before her first interface. She teaches type the way she learned it, starting with the shapes of letters and ending with a spec a developer can build.",
      rating: 4.9,
      reviews: 4102,
      learners: 38650,
      hours: 6,
      length: "6h",
      lengthLong: "6h video",
      level: "Beginner",
      format: "Self-paced",
      price: 55,
      priceCents: 5500,
      badge: "Bestseller",
      updated: "Updated March 2026",
      desc:
        "Everything a screen designer needs to know about type, starting from why letters look the way they do.",
      bullets: [
        "Pair typefaces with a method instead of taste roulette",
        "Set a type scale that survives real content",
        "Master line-height, measure, and rhythm",
        "Handle numerals, small caps, and punctuation properly",
        "Build a typography spec a developer can implement"
      ],
      requirements: [
        "None. This course starts at the beginning.",
        "A browser and any design tool you already like."
      ],
      syllabus: [
        { title: "How letters work", lessons: 5, minutes: 70 },
        { title: "Choosing and pairing", lessons: 5, minutes: 70 },
        { title: "Scale, rhythm, hierarchy", lessons: 6, minutes: 85 },
        { title: "Typography in the browser", lessons: 6, minutes: 95 },
        { title: "The spec", lessons: 3, minutes: 40 }
      ]
    },
    {
      code: "BW-210",
      title: "Machine Learning, Plainly",
      category: "Data & AI",
      slug: "data",
      instructor: "Priya Raghunathan",
      instructorCred: "Applied ML lead; spent a decade explaining models to executives.",
      instructorBio:
        "Priya leads an applied ML group and spends about half her week translating. She thinks most ML courses start with the wrong subject, which is math, instead of the right one, which is the problem.",
      rating: 4.6,
      reviews: 2876,
      learners: 31200,
      hours: 12,
      length: "12h",
      lengthLong: "12h video",
      level: "Beginner",
      format: "Self-paced",
      price: 65,
      priceCents: 6500,
      badge: null,
      updated: "Updated February 2026",
      desc:
        "A first ML course that prefers plain language and honest evaluation over math intimidation.",
      bullets: [
        "Frame a problem so ML can actually help",
        "Train and evaluate models without fooling yourself",
        "Know when a spreadsheet beats a neural network",
        "Explain a model's behavior to a non-technical room",
        "Ship a small end-to-end project"
      ],
      requirements: [
        "Basic Python: loops, functions, and a little pandas.",
        "High-school algebra. Nothing beyond it.",
        "Curiosity about being wrong in measurable ways."
      ],
      syllabus: [
        { title: "What ML is and isn't", lessons: 4, minutes: 85 },
        { title: "Data, honestly", lessons: 6, minutes: 140 },
        { title: "Classic models that still win", lessons: 7, minutes: 170 },
        { title: "Neural networks, gently", lessons: 6, minutes: 140 },
        { title: "Evaluation and communication", lessons: 5, minutes: 120 },
        { title: "Capstone", lessons: 3, minutes: 65 }
      ]
    },
    {
      code: "BW-224",
      title: "SQL for People Who Think in Spreadsheets",
      category: "Data & AI",
      slug: "data",
      instructor: "Tomás Iriarte",
      instructorCred: "Analytics engineer; unteaches spreadsheet habits for a living.",
      instructorBio:
        "Tomás works in analytics engineering and has rebuilt more spreadsheets as queries than he can count. He believes the fastest way into SQL is through what you already know.",
      rating: 4.8,
      reviews: 5437,
      learners: 42380,
      hours: 5.5,
      length: "5.5h",
      lengthLong: "5.5h video",
      level: "Beginner",
      format: "Self-paced",
      price: 45,
      priceCents: 4500,
      badge: "Bestseller",
      updated: "Updated March 2026",
      desc: "Translate everything you already know about spreadsheets into confident, correct SQL.",
      bullets: [
        "Map VLOOKUP thinking to JOINs",
        "Aggregate with GROUP BY without double-counting",
        "Window functions for running totals and rankings",
        "Clean messy data in the query, not by hand",
        "Read a query plan well enough to fix slowness"
      ],
      requirements: [
        "None. If you can write a spreadsheet formula, you're ready.",
        "A browser. The practice database runs in the lessons."
      ],
      syllabus: [
        { title: "From cells to tables", lessons: 4, minutes: 55 },
        { title: "Joins are lookups", lessons: 5, minutes: 80 },
        { title: "Grouping and pivoting", lessons: 5, minutes: 75 },
        { title: "Window functions", lessons: 4, minutes: 65 },
        { title: "Cleaning and performance", lessons: 4, minutes: 55 }
      ]
    },
    {
      code: "BW-305",
      title: "Building with Language Model APIs",
      category: "Data & AI",
      slug: "data",
      instructor: "Ada Nwosu-Bell",
      instructorCred: "Built LLM features at three products you've used; writes the evals first.",
      instructorBio:
        "Ada has shipped model-backed features in three products and cleaned up after a few more. Her rule is simple: if you cannot measure the feature, you are not building it yet.",
      rating: 4.7,
      reviews: 1642,
      learners: 14890,
      hours: 9,
      length: "9h",
      lengthLong: "9h video",
      level: "Intermediate",
      format: "Self-paced",
      price: 85,
      priceCents: 8500,
      badge: "New",
      updated: "Updated April 2026",
      desc:
        "From first API call to a shipped, evaluated feature: prompts, tools, retrieval, and the engineering around them.",
      bullets: [
        "Design prompts as versioned, testable artifacts",
        "Add tool use and structured output safely",
        "Build retrieval that actually retrieves",
        "Write evals before scaling anything",
        "Handle cost, latency, and failure like an engineer"
      ],
      requirements: [
        "Comfortable writing an HTTP client in Python or JavaScript.",
        "An API key from any model provider you like.",
        "No machine learning background needed."
      ],
      syllabus: [
        { title: "The API mental model", lessons: 5, minutes: 80 },
        { title: "Prompting as engineering", lessons: 6, minutes: 110 },
        { title: "Tools and structured output", lessons: 6, minutes: 110 },
        { title: "Retrieval done honestly", lessons: 5, minutes: 90 },
        { title: "Evals and observability", lessons: 5, minutes: 90 },
        { title: "Shipping a feature", lessons: 4, minutes: 60 }
      ]
    },
    {
      code: "TL-405",
      title: "The Staff Engineer Brief",
      category: "Product & Career",
      slug: "career",
      instructor: "Marta Kovanen",
      instructorCred: "Former staff engineer at a 400-person logistics firm.",
      instructorBio:
        "Marta spent four years as the person everyone sent their RFC to. She teaches the writing and the process together, because one without the other just makes longer documents.",
      rating: 4.9,
      reviews: 268,
      learners: 1120,
      hours: null,
      length: "6 weeks, 12 live sessions",
      lengthLong: "6 weeks, 12 live sessions",
      level: "Advanced",
      format: "Cohort",
      price: 299,
      priceCents: 29900,
      badge: null,
      updated: "Next run starts September 2026",
      desc:
        "Technical writing, RFC strategy, and decision records for engineers moving from output to leverage.",
      bullets: [
        "Write RFCs that get decided, not just read",
        "Run a decision process that survives disagreement",
        "Give feedback that lands across levels",
        "Build a personal writing system you'll actually keep",
        "Present technical trade-offs to executives"
      ],
      requirements: [
        "Five or more years in engineering, or a senior title.",
        "A real decision at work that you can write up during the run.",
        "Four hours a week, including one live session."
      ],
      syllabus: [
        { title: "The leverage mindset", weekly: "Week 1" },
        { title: "The RFC, drafted and reviewed live", weekly: "Weeks 2-3" },
        { title: "Decision records", weekly: "Week 4" },
        { title: "Feedback and influence", weekly: "Week 5" },
        { title: "The executive brief", weekly: "Week 6" }
      ]
    },
    {
      code: "BW-402",
      title: "Product Discovery in Practice",
      category: "Product & Career",
      slug: "career",
      instructor: "Jonah Albescu",
      instructorCred: "Product lead; ran discovery for two zero-to-one products.",
      instructorBio:
        "Jonah has launched two products from nothing and killed four more before they cost anyone a year. He teaches discovery as a set of habits, not a ceremony.",
      rating: 4.6,
      reviews: 1108,
      learners: 9760,
      hours: 7,
      length: "7h",
      lengthLong: "7h video",
      level: "Intermediate",
      format: "Self-paced",
      price: 65,
      priceCents: 6500,
      badge: null,
      updated: "Updated November 2025",
      desc:
        "Interview users, size opportunities, and kill bad ideas early, with templates you can use the same week.",
      bullets: [
        "Run user interviews that don't lead the witness",
        "Turn interview notes into opportunity maps",
        "Prototype the riskiest assumption first",
        "Say no with evidence instead of opinion",
        "Present discovery work that changes the roadmap"
      ],
      requirements: [
        "You work near a product decision, in any role.",
        "Access to five people who use something you make."
      ],
      syllabus: [
        { title: "Discovery vs delivery", lessons: 4, minutes: 65 },
        { title: "Interviewing", lessons: 6, minutes: 120 },
        { title: "Mapping opportunities", lessons: 5, minutes: 90 },
        { title: "Prototypes and tests", lessons: 5, minutes: 90 },
        { title: "The discovery brief", lessons: 4, minutes: 55 }
      ]
    },
    {
      code: "BW-260",
      title: "Writing That Gets Read at Work",
      category: "Product & Career",
      slug: "career",
      instructor: "Hana Okafor-Lindqvist",
      instructorCred: "Editor turned engineering manager; reads your memo so others will.",
      instructorBio:
        "Hana edited nonfiction before she managed engineers, and the two jobs turned out to be closer than expected. She cuts drafts in front of the class, which is the whole point.",
      rating: 4.8,
      reviews: 2301,
      learners: 21540,
      hours: 4.5,
      length: "4.5h",
      lengthLong: "4.5h video",
      level: "All levels",
      format: "Self-paced",
      price: 49,
      priceCents: 4900,
      badge: null,
      updated: "Updated January 2026",
      desc: "Short course, big lever: memos, updates, and proposals people actually finish.",
      bullets: [
        "Lead with the point (and mean it)",
        "Cut a draft by 40% without losing substance",
        "Structure a proposal for a skimming reader",
        "Match tone to stakes",
        "Build a 20-minute weekly writing habit"
      ],
      requirements: [
        "You write things at work that other people read.",
        "One recent draft you are willing to cut in half."
      ],
      syllabus: [
        { title: "Why work writing fails", lessons: 3, minutes: 45 },
        { title: "The point-first method", lessons: 4, minutes: 65 },
        { title: "Editing ruthlessly", lessons: 4, minutes: 65 },
        { title: "Proposals and updates", lessons: 4, minutes: 65 },
        { title: "The habit", lessons: 2, minutes: 30 }
      ]
    }
  ];

  /* Fictional review pool. Pick three per course with pickReviews(code). */
  var REVIEWS = [
    {
      name: "Dana Whitfield",
      date: "March 2026",
      rating: 5,
      body:
        "Paced exactly right. I did two lessons a night for a week and had something working by the weekend."
    },
    {
      name: "Ravi Menon-Clarke",
      date: "February 2026",
      rating: 5,
      body:
        "The syllabus was accurate down to the lesson. I knew what I was buying and that is what I got."
    },
    {
      name: "Ingrid Solheim",
      date: "February 2026",
      rating: 4,
      body:
        "Dense in the best way. I rewound a few times in the middle section, which is a compliment."
    },
    {
      name: "Kwame Ansah-Berg",
      date: "January 2026",
      rating: 5,
      body:
        "No filler. The exercises are the course, and the videos are the explanation around them."
    },
    {
      name: "Noor Haddadi",
      date: "January 2026",
      rating: 5,
      body:
        "I have taken four courses on this subject. This is the first one I finished."
    },
    {
      name: "Peter Lindqvist-Roe",
      date: "December 2025",
      rating: 4,
      body:
        "Clear, unhurried, and honest about what the material will not cover. I would take another."
    }
  ];

  /* ---------------------------------------------------------------------
     Helpers
     --------------------------------------------------------------------- */

  var BY_CODE = {};
  for (var i = 0; i < COURSES.length; i++) BY_CODE[COURSES[i].code] = COURSES[i];

  var DEFAULT_CODE = "TL-301";

  function byCode(code) {
    if (!code) return null;
    return BY_CODE[String(code).trim().toUpperCase()] || null;
  }

  /* Detail routing: unknown or missing code falls back to TL-301. */
  function resolveCode(code) {
    return byCode(code) ? String(code).trim().toUpperCase() : DEFAULT_CODE;
  }

  function courseFromQuery(search) {
    var raw = null;
    try {
      raw = new URLSearchParams(search || window.location.search).get("c");
    } catch (e) {
      raw = null;
    }
    return byCode(raw) || BY_CODE[DEFAULT_CODE];
  }

  function formatPrice(value) {
    var n = typeof value === "number" ? value : Number(value) || 0;
    return "$" + (n % 1 === 0 ? String(n) : n.toFixed(2));
  }

  function formatMoney(value) {
    var n = typeof value === "number" ? value : Number(value) || 0;
    return "$" + n.toFixed(2);
  }

  function formatCount(n) {
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function formatDuration(minutes) {
    var h = Math.floor(minutes / 60);
    var m = minutes % 60;
    if (!h) return m + "m";
    if (!m) return h + "h";
    return h + "h " + m + "m";
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function initials(name) {
    var parts = String(name).split(/[\s-]+/).filter(Boolean);
    var first = parts[0] ? parts[0].charAt(0) : "";
    var last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";
    return (first + last).toUpperCase();
  }

  /* Category helpers. `slug` doubles as the thumbnail motif key. */
  function slugFor(category) {
    for (var j = 0; j < CATEGORIES.length; j++) {
      if (CATEGORIES[j].name === category) return CATEGORIES[j].slug;
    }
    return "engineering";
  }

  function thumbClass(category) {
    return "thumb thumb--" + slugFor(category);
  }

  function thumbSrc(category) {
    return "img/motif-" + slugFor(category) + ".svg";
  }

  /* Thumbnail: tinted plate (CSS) + line-art motif (SVG) + ghosted serif
     initial from the course title. Entirely decorative; the title carries
     the meaning. */
  function thumbMarkup(course, extraClass) {
    var letter = escapeHtml(String(course.title).trim().charAt(0).toUpperCase());
    return (
      '<span class="' +
      thumbClass(course.category) +
      (extraClass ? " " + extraClass : "") +
      '">' +
      '<img class="thumb__art" src="' +
      thumbSrc(course.category) +
      '" alt="" width="320" height="200" loading="lazy" decoding="async">' +
      '<span class="thumb__initial" aria-hidden="true">' +
      letter +
      "</span>" +
      "</span>"
    );
  }

  /* Star display. Static, never an input. A coral row is clipped to the
     honest fraction over a hairline row. */
  var STAR_PATH =
    "M10 1.7l2.5 5.1 5.6.8-4.05 3.95.96 5.6L10 14.5l-5.01 2.65.96-5.6L1.9 7.6l5.6-.8z";

  function starRow(cls) {
    var out = '<svg class="' + cls + '" viewBox="0 0 100 20" aria-hidden="true" focusable="false">';
    for (var k = 0; k < 5; k++) {
      out += '<path transform="translate(' + k * 20 + ' 0)" d="' + STAR_PATH + '"></path>';
    }
    return out + "</svg>";
  }

  function starMarkup(rating, size, count) {
    var pct = Math.max(0, Math.min(100, (Number(rating) / 5) * 100));
    var label =
      "Rated " +
      rating +
      " out of 5" +
      (count ? " by " + formatCount(count) + " learners" : "");
    return (
      '<span class="stars stars--' +
      (size || "sm") +
      '" role="img" aria-label="' +
      escapeHtml(label) +
      '" style="--star-fill:' +
      pct.toFixed(2) +
      '%">' +
      starRow("stars__glyphs stars__glyphs--track") +
      '<span class="stars__fill">' +
      starRow("stars__glyphs stars__glyphs--fill") +
      "</span>" +
      "</span>"
    );
  }

  function badgeMarkup(badge) {
    if (!badge) return "";
    var mod = badge === "Bestseller" ? "bestseller" : badge === "New" ? "new" : "cohort";
    return '<span class="badge badge--' + mod + '">' + escapeHtml(badge) + "</span>";
  }

  function metaLine(course) {
    return escapeHtml(course.length) + " · " + escapeHtml(course.level);
  }

  /* The workhorse. Whole card is one link to course.html?c=CODE. */
  function courseCard(course) {
    if (!course) return "";
    return (
      '<a class="card" href="course.html?c=' +
      encodeURIComponent(course.code) +
      '">' +
      thumbMarkup(course, "card__thumb") +
      '<span class="card__body">' +
      (course.badge ? '<span class="card__badge">' + badgeMarkup(course.badge) + "</span>" : "") +
      '<span class="card__title">' +
      escapeHtml(course.title) +
      "</span>" +
      '<span class="card__instructor meta">' +
      escapeHtml(course.instructor) +
      "</span>" +
      '<span class="card__rating">' +
      '<span class="card__score">' +
      course.rating.toFixed(1) +
      "</span>" +
      starMarkup(course.rating, "sm", course.reviews) +
      '<span class="meta">(' +
      formatCount(course.reviews) +
      ")</span>" +
      "</span>" +
      '<span class="card__meta meta">' +
      metaLine(course) +
      "</span>" +
      '<span class="card__price price">' +
      formatPrice(course.price) +
      "</span>" +
      "</span>" +
      "</a>"
    );
  }

  function totalLessons(course) {
    var n = 0;
    for (var m = 0; m < course.syllabus.length; m++) n += course.syllabus[m].lessons || 0;
    return n;
  }

  function curriculumSummary(course) {
    var mods = course.syllabus.length;
    if (course.format === "Cohort") {
      return mods + " modules · " + course.length;
    }
    return (
      mods + " sections · " + totalLessons(course) + " lessons · " + course.length + " total"
    );
  }

  /* Deterministic three-review slice so a course always shows the same set. */
  function pickReviews(code) {
    var h = 0;
    for (var c = 0; c < code.length; c++) h = (h * 31 + code.charCodeAt(c)) >>> 0;
    var start = h % REVIEWS.length;
    var out = [];
    for (var r = 0; r < 3; r++) out.push(REVIEWS[(start + r) % REVIEWS.length]);
    return out;
  }

  function subtotal(codes) {
    var sum = 0;
    for (var s = 0; s < codes.length; s++) {
      var course = byCode(codes[s]);
      if (course) sum += course.price;
    }
    return sum;
  }

  function inCategory(category) {
    return COURSES.filter(function (c) {
      return c.category === category;
    });
  }

  window.BINDWELL_COURSES = COURSES;
  window.BINDWELL_CATEGORIES = CATEGORIES;
  window.BINDWELL_REVIEWS = REVIEWS;
  window.BINDWELL_DATA = {
    COURSES: COURSES,
    CATEGORIES: CATEGORIES,
    REVIEWS: REVIEWS,
    DEFAULT_CODE: DEFAULT_CODE,
    byCode: byCode,
    resolveCode: resolveCode,
    courseFromQuery: courseFromQuery,
    inCategory: inCategory,
    slugFor: slugFor,
    initials: initials,
    escapeHtml: escapeHtml,
    formatPrice: formatPrice,
    formatMoney: formatMoney,
    formatCount: formatCount,
    formatDuration: formatDuration,
    thumbClass: thumbClass,
    thumbSrc: thumbSrc,
    thumbMarkup: thumbMarkup,
    starMarkup: starMarkup,
    badgeMarkup: badgeMarkup,
    metaLine: metaLine,
    courseCard: courseCard,
    totalLessons: totalLessons,
    curriculumSummary: curriculumSummary,
    pickReviews: pickReviews,
    subtotal: subtotal
  };
})();
