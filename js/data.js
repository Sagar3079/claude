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
        {
          title: "A working mental model of the type system",
          lessonCount: 6,
          minutes: 100,
          lessons: [
            "Types are sets, and why that changes everything",
            "Structural typing, and where it surprises you",
            "Assignability and variance, without the jargon",
            "Narrowing: what the compiler actually knows",
            "Reading a forty-line type error from the inside out",
            "unknown, any, and never, and when each is right"
          ]
        },
        {
          title: "Generics that carry intent",
          lessonCount: 7,
          minutes: 130,
          lessons: [
            "Type parameters are arguments, not decoration",
            "Inference sites: where TypeScript looks first",
            "Constraints that state the contract out loud",
            "Default type arguments and their quiet failures",
            "Overloads versus one honest signature",
            "Generic builders that stay readable",
            "Designing an API a stranger can call correctly"
          ]
        },
        {
          title: "Conditional and mapped types",
          lessonCount: 8,
          minutes: 150,
          lessons: [
            "Conditional types and the extends keyword",
            "infer, and pulling a type back out",
            "Distributive conditionals, and turning them off",
            "Mapped types and key remapping with as",
            "Template literal types for string-shaped APIs",
            "Recursive types and the depth limit",
            "Modeling impossible states out of existence",
            "A type-level test suite that runs in CI"
          ]
        },
        {
          title: "The compiler API and codegen",
          lessonCount: 6,
          minutes: 110,
          lessons: [
            "The program, the checker, and the source file",
            "Walking an AST without losing your place",
            "Writing a lint rule that reads types",
            "Generating types from a JSON schema",
            "Transformers, and emitting output you trust",
            "Keeping generated code reviewable by humans"
          ]
        },
        {
          title: "Ship it: building the library",
          lessonCount: 5,
          minutes: 80,
          lessons: [
            "Package layout, exports map, and dual builds",
            "Declaration files that stay stable",
            "Testing types alongside runtime behavior",
            "Versioning a type change without breaking users",
            "Publishing to npm and reading the fallout"
          ]
        }
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
        {
          title: "Measurement before change",
          lessonCount: 4,
          minutes: 150,
          lessons: [
            "Choosing a workload that represents production",
            "Sampling profilers and what they miss",
            "Reading a flame graph without guessing",
            "Building a baseline harness with repeatable runs"
          ]
        },
        {
          title: "Queues, backpressure, fairness",
          lessonCount: 3,
          minutes: 130,
          lessons: [
            "Little's Law, applied to a service you run",
            "Bounded queues and the shape of backpressure",
            "Fair scheduling when one caller misbehaves"
          ]
        },
        {
          title: "Allocators and memory pressure",
          lessonCount: 3,
          minutes: 130,
          lessons: [
            "Finding where the allocations actually come from",
            "Pause times, generations, and tuning that helps",
            "Object pools: when they pay and when they lie"
          ]
        },
        {
          title: "The network is the slowest part",
          lessonCount: 3,
          minutes: 120,
          lessons: [
            "Connection pools, keepalive, and head-of-line blocking",
            "Timeouts, retries, and jitter that avoids storms",
            "Serialization cost nobody thought to measure"
          ]
        },
        {
          title: "Case study: a checkout service at 40x load",
          lessonCount: 4,
          minutes: 160,
          lessons: [
            "The incident timeline and the first wrong guess",
            "Finding the real bottleneck in the payment path",
            "The three changes that moved the number",
            "What we would do differently next quarter"
          ]
        }
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
        {
          title: "Lexing and parsing",
          weekly: "Week 1",
          lessonCount: 2,
          lessons: [
            "Session 1: A hand-written lexer and its tests",
            "Session 2: Recursive descent and precedence climbing"
          ]
        },
        {
          title: "AST and pretty-printing",
          weekly: "Week 2",
          lessonCount: 2,
          lessons: [
            "Session 3: Designing nodes you will not regret",
            "Session 4: A pretty-printer that round-trips"
          ]
        },
        {
          title: "Type checking",
          weekly: "Weeks 3-4",
          lessonCount: 4,
          lessons: [
            "Session 5: Scopes, bindings, and a symbol table",
            "Session 6: Checking expressions, reporting errors well",
            "Session 7: Functions, returns, and control flow",
            "Session 8: Live review of your checker"
          ]
        },
        {
          title: "Compilation and the VM",
          weekly: "Weeks 5-6",
          lessonCount: 4,
          lessons: [
            "Session 9: Designing a bytecode instruction set",
            "Session 10: Lowering the AST to instructions",
            "Session 11: A stack VM and its dispatch loop",
            "Session 12: Call frames, locals, and closures"
          ]
        },
        {
          title: "Garbage collection",
          weekly: "Week 7",
          lessonCount: 2,
          lessons: [
            "Session 13: Mark and sweep, written from scratch",
            "Session 14: Roots, safepoints, and the bugs they hide"
          ]
        },
        {
          title: "Ship and demo day",
          weekly: "Week 8",
          lessonCount: 2,
          lessons: [
            "Session 15: Benchmarks, README, and a language spec",
            "Session 16: Demo day and design defence"
          ]
        }
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
        {
          title: "The animation decision framework",
          lessonCount: 5,
          minutes: 90,
          lessons: [
            "Three questions to ask before any animation",
            "Motion that explains versus motion that decorates",
            "The cases where a plain fade is the right answer",
            "Auditing a screen for motion you should delete",
            "Writing a motion brief your team can argue with"
          ]
        },
        {
          title: "Easing, duration, perception",
          lessonCount: 6,
          minutes: 120,
          lessons: [
            "Why 200ms reads as instant and 500ms reads as slow",
            "Reading a bezier curve like a sentence",
            "Choosing easing by direction of travel",
            "Scaling duration with distance and size",
            "Spring feel without a physics library",
            "Building the duration and easing scale you reuse"
          ]
        },
        {
          title: "Enter, exit, and interruption",
          lessonCount: 6,
          minutes: 120,
          lessons: [
            "Enter and exit are not the same animation reversed",
            "Making transitions interruptible in plain CSS",
            "Animating height without measuring it",
            "The FLIP technique, one step at a time",
            "View transitions and their honest limits",
            "Testing a transition by mashing the button"
          ]
        },
        {
          title: "Gestures and physics",
          lessonCount: 5,
          minutes: 105,
          lessons: [
            "Pointer events and picking up a drag cleanly",
            "Momentum, friction, and where a swipe lands",
            "Rubber-banding at the edges",
            "A bottom sheet that follows the finger",
            "Handing off from gesture to animation"
          ]
        },
        {
          title: "A motion system for a real product",
          lessonCount: 4,
          minutes: 75,
          lessons: [
            "Tokens: durations, easings, and named patterns",
            "Documenting motion so engineers can build it",
            "Reduced motion without losing the character",
            "Reviewing a shipped product's motion together"
          ]
        }
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
        {
          title: "Why dense is different",
          lessonCount: 4,
          minutes: 80,
          lessons: [
            "Who reads this screen, and at what hour",
            "Density as a decision with a cost you name",
            "How people scan a 200-row table",
            "Borrowing from spreadsheets, cockpits, and trading desks"
          ]
        },
        {
          title: "The table, mastered",
          lessonCount: 6,
          minutes: 130,
          lessons: [
            "Row height, padding, and the 4 a.m. legibility test",
            "Aligning numbers, dates, and mixed units",
            "Column priority when the viewport shrinks",
            "Sorting and filtering that show their own state",
            "Sticky headers, frozen columns, and their bugs",
            "Empty, loading, and truncated cell states"
          ]
        },
        {
          title: "Dashboards and monitoring",
          lessonCount: 5,
          minutes: 110,
          lessons: [
            "One screen, one question",
            "Color as signal: normal, warning, alert, stale",
            "Sparklines, thresholds, and honest axes",
            "Designing for the incident, not the demo",
            "Refresh rates, and telling people what is stale"
          ]
        },
        {
          title: "Editors and inspectors",
          lessonCount: 4,
          minutes: 85,
          lessons: [
            "Inspector panels that survive deep nesting",
            "Inline editing without losing your place in the row",
            "Keyboard paths for people who live in this screen",
            "Undo, dirty state, and saving honestly"
          ]
        },
        {
          title: "Density audit workshop",
          lessonCount: 3,
          minutes: 45,
          lessons: [
            "The twelve-point density checklist",
            "Auditing a real screen, top to bottom",
            "Writing findings in a form that gets them fixed"
          ]
        }
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
        {
          title: "How letters work",
          lessonCount: 5,
          minutes: 70,
          lessons: [
            "Strokes, counters, and why letters look the way they do",
            "Serifs and sans serifs, and what the difference is for",
            "x-height, cap height, and apparent size",
            "Weight, width, and the optical size axis",
            "Reading a type specimen properly"
          ]
        },
        {
          title: "Choosing and pairing",
          lessonCount: 5,
          minutes: 70,
          lessons: [
            "Start from the job, not the mood board",
            "A pairing method: contrast without clash",
            "Superfamilies, and when one family is enough",
            "Licensing, hosting, and the weight of a font file",
            "Testing a pairing against real content"
          ]
        },
        {
          title: "Scale, rhythm, hierarchy",
          lessonCount: 6,
          minutes: 85,
          lessons: [
            "Building a type scale from a ratio",
            "Repairing a scale that real content broke",
            "Line height, measure, and comfortable reading",
            "Hierarchy with three sizes instead of seven",
            "Vertical rhythm without the dogma",
            "Spacing as part of the type system"
          ]
        },
        {
          title: "Typography in the browser",
          lessonCount: 6,
          minutes: 95,
          lessons: [
            "font-size, rem, and clamp without surprises",
            "Loading fonts: swap, fallback, and layout shift",
            "The OpenType features you will actually use",
            "Numerals: tabular, lining, and old style",
            "Quotes, apostrophes, and punctuation set properly",
            "Variable fonts and optical sizing on the web"
          ]
        },
        {
          title: "The spec",
          lessonCount: 3,
          minutes: 40,
          lessons: [
            "What a developer needs from a type spec",
            "Writing tokens instead of handing over screenshots",
            "Reviewing the built page against the spec"
          ]
        }
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
        {
          title: "What ML is and isn't",
          lessonCount: 4,
          minutes: 85,
          lessons: [
            "Three questions that decide whether ML helps",
            "Prediction, explanation, and automation are different jobs",
            "The problems where a rule or a spreadsheet wins",
            "Framing a problem as inputs, an output, and a cost"
          ]
        },
        {
          title: "Data, honestly",
          lessonCount: 6,
          minutes: 140,
          lessons: [
            "Where your data came from, and who is missing from it",
            "Labels, leakage, and the result that looks too good",
            "Train, validation, and test without cheating",
            "Missing values and the stories they tell",
            "Features you can explain out loud in a meeting",
            "Assembling a small dataset you actually trust"
          ]
        },
        {
          title: "Classic models that still win",
          lessonCount: 7,
          minutes: 170,
          lessons: [
            "Linear regression, read as a sentence",
            "Logistic regression and what a coefficient means",
            "Decision trees, and how they memorise",
            "Random forests and gradient boosting, plainly",
            "Nearest neighbours and the baseline you must beat",
            "Clustering when you have no labels at all",
            "Choosing a model by the constraint that binds"
          ]
        },
        {
          title: "Neural networks, gently",
          lessonCount: 6,
          minutes: 140,
          lessons: [
            "A neuron is a weighted sum and a bend",
            "Layers, loss, and gradient descent in pictures",
            "Reading a training curve and believing it",
            "Overfitting, regularisation, and stopping early",
            "When to fine-tune something already trained",
            "What a neural network really costs to run"
          ]
        },
        {
          title: "Evaluation and communication",
          lessonCount: 5,
          minutes: 120,
          lessons: [
            "Accuracy is usually the wrong number",
            "Precision, recall, and choosing a threshold on purpose",
            "A confusion matrix your stakeholders can read",
            "Error analysis: sitting with fifty wrong predictions",
            "Presenting a model to a room without math"
          ]
        },
        {
          title: "Capstone",
          lessonCount: 3,
          minutes: 65,
          lessons: [
            "Scoping a project small enough to finish",
            "Building it end to end in one sitting",
            "Writing the one-page model report"
          ]
        }
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
        {
          title: "From cells to tables",
          lessonCount: 4,
          minutes: 55,
          lessons: [
            "A sheet is a table with looser rules",
            "SELECT, FROM, and WHERE as a filtered view",
            "Sorting and limiting instead of scrolling",
            "Data types, nulls, and the empty cell problem"
          ]
        },
        {
          title: "Joins are lookups",
          lessonCount: 5,
          minutes: 80,
          lessons: [
            "VLOOKUP, translated line by line into a JOIN",
            "Inner and left joins, and which rows disappear",
            "Joining on the wrong key, and how you notice",
            "Many-to-many joins and accidental duplication",
            "Self-joins for comparing rows to other rows"
          ]
        },
        {
          title: "Grouping and pivoting",
          lessonCount: 5,
          minutes: 75,
          lessons: [
            "GROUP BY is a pivot table",
            "COUNT, SUM, and AVG, and counting the wrong thing",
            "HAVING versus WHERE, settled for good",
            "Turning rows into columns with CASE",
            "Checking a query total against the spreadsheet"
          ]
        },
        {
          title: "Window functions",
          lessonCount: 4,
          minutes: 65,
          lessons: [
            "OVER and PARTITION BY, in spreadsheet terms",
            "Running totals and moving averages",
            "Ranking, dense ranking, and handling ties",
            "LAG and LEAD for month-over-month comparisons"
          ]
        },
        {
          title: "Cleaning and performance",
          lessonCount: 4,
          minutes: 55,
          lessons: [
            "Trimming, casting, and fixing dates in the query",
            "Deduplicating without deleting real rows",
            "Reading a query plan to find the slow part",
            "Indexes, and the two that would help you today"
          ]
        }
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
        {
          title: "The API mental model",
          lessonCount: 5,
          minutes: 80,
          lessons: [
            "Requests, tokens, and what you are paying for",
            "System, user, and assistant turns in practice",
            "Sampling settings and getting repeatable runs",
            "Streaming a response without breaking your UI",
            "Your first call, wrapped in a function you can test"
          ]
        },
        {
          title: "Prompting as engineering",
          lessonCount: 6,
          minutes: 110,
          lessons: [
            "Prompts are code: version them, review them",
            "Instructions and examples, and where each earns its place",
            "Asking for output you can parse safely",
            "Long inputs, and deciding what to leave out",
            "Prompt injection and text you did not write",
            "A prompt test file that runs on every commit"
          ]
        },
        {
          title: "Tools and structured output",
          lessonCount: 6,
          minutes: 110,
          lessons: [
            "Describing a tool so the model calls it correctly",
            "Schemas, validation, and rejecting a bad call",
            "The agent loop, written by hand once",
            "Side effects, confirmation, and blast radius",
            "Parallel calls and keeping state straight",
            "Debugging a tool call that keeps going wrong"
          ]
        },
        {
          title: "Retrieval done honestly",
          lessonCount: 5,
          minutes: 90,
          lessons: [
            "Chunking documents without shredding the meaning",
            "Embeddings, similarity, and what they miss",
            "Keyword search and vector search, together",
            "Measuring retrieval before you blame the model",
            "Citations that point at the real source"
          ]
        },
        {
          title: "Evals and observability",
          lessonCount: 5,
          minutes: 90,
          lessons: [
            "Writing the eval set before the feature",
            "Graders: exact match, rubric, and model as judge",
            "Logging prompts, outputs, and cost per request",
            "Catching a regression when you change one line",
            "Reading production traces on a bad afternoon"
          ]
        },
        {
          title: "Shipping a feature",
          lessonCount: 4,
          minutes: 60,
          lessons: [
            "Latency budgets and where the time actually goes",
            "Caching, batching, and cutting the bill in half",
            "Fallbacks for timeouts, refusals, and outages",
            "The launch checklist and the rollback plan"
          ]
        }
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
        {
          title: "The leverage mindset",
          weekly: "Week 1",
          lessonCount: 2,
          lessons: [
            "Session 1: Where writing actually changes a decision",
            "Session 2: Choosing the document the situation needs"
          ]
        },
        {
          title: "The RFC, drafted and reviewed live",
          weekly: "Weeks 2-3",
          lessonCount: 4,
          lessons: [
            "Session 3: The problem statement, before any solution",
            "Session 4: Options and trade-offs in an honest table",
            "Session 5: Live review of your first draft",
            "Session 6: Rewriting after the room disagreed"
          ]
        },
        {
          title: "Decision records",
          weekly: "Week 4",
          lessonCount: 2,
          lessons: [
            "Session 7: A record someone will thank you for in a year",
            "Session 8: Writing down a decision you argued against"
          ]
        },
        {
          title: "Feedback and influence",
          weekly: "Week 5",
          lessonCount: 2,
          lessons: [
            "Session 9: Feedback that lands up, down, and sideways",
            "Session 10: Disagreeing in writing without a fight"
          ]
        },
        {
          title: "The executive brief",
          weekly: "Week 6",
          lessonCount: 2,
          lessons: [
            "Session 11: One page, one decision, one ask",
            "Session 12: Presenting trade-offs and taking questions"
          ]
        }
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
        {
          title: "Discovery vs delivery",
          lessonCount: 4,
          minutes: 65,
          lessons: [
            "What discovery is for, and what it is not",
            "Fitting discovery into a delivery team's week",
            "Listing assumptions and ranking them by risk",
            "Setting up a discovery week you can repeat"
          ]
        },
        {
          title: "Interviewing",
          lessonCount: 6,
          minutes: 120,
          lessons: [
            "Recruiting five people who really use the thing",
            "Writing questions that do not lead the witness",
            "Asking about the last time, not the general case",
            "Silence, follow-ups, and the second why",
            "Taking notes without leaving the conversation",
            "A full practice interview, with critique"
          ]
        },
        {
          title: "Mapping opportunities",
          lessonCount: 5,
          minutes: 90,
          lessons: [
            "Turning raw notes into opportunities in one pass",
            "Building an opportunity solution tree",
            "Sizing an opportunity with the evidence you have",
            "Choosing what to pursue and what to park",
            "Keeping the map alive after the workshop ends"
          ]
        },
        {
          title: "Prototypes and tests",
          lessonCount: 5,
          minutes: 90,
          lessons: [
            "Prototyping only the riskiest assumption",
            "Fidelity: paper, clickable, or half-built",
            "Running a test that can actually prove you wrong",
            "Reading results without wishful thinking",
            "Killing an idea and writing down why"
          ]
        },
        {
          title: "The discovery brief",
          lessonCount: 4,
          minutes: 55,
          lessons: [
            "Structuring a brief for a stakeholder who skims",
            "Evidence, confidence, and saying what you do not know",
            "Presenting work that changes the roadmap",
            "The templates, and how to adapt them"
          ]
        }
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
        {
          title: "Why work writing fails",
          lessonCount: 3,
          minutes: 45,
          lessons: [
            "Your reader is busy, skimming, and slightly annoyed",
            "Three real memos that failed, and why",
            "Deciding whether to write the thing at all"
          ]
        },
        {
          title: "The point-first method",
          lessonCount: 4,
          minutes: 65,
          lessons: [
            "Leading with the point, and meaning it",
            "The one-sentence summary you write last",
            "Structuring for a reader who stops halfway",
            "Headings and bullets, and when prose is better"
          ]
        },
        {
          title: "Editing ruthlessly",
          lessonCount: 4,
          minutes: 65,
          lessons: [
            "Cutting forty percent on the first pass",
            "Weak verbs, hedges, and throat clearing",
            "Reading a draft aloud to find the seams",
            "A real memo, edited line by line on camera"
          ]
        },
        {
          title: "Proposals and updates",
          lessonCount: 4,
          minutes: 65,
          lessons: [
            "A proposal built to survive a skim",
            "Weekly updates nobody dreads",
            "Bad news, written early and plainly",
            "Matching the tone to what is at stake"
          ]
        },
        {
          title: "The habit",
          lessonCount: 2,
          minutes: 30,
          lessons: [
            "A twenty-minute writing block that holds",
            "Keeping a file of pieces you can reuse"
          ]
        }
      ]
    }
  ];

  /* Fictional review pool. Thirty-six entries, three per course, handed out
     by course position in pickReviews(code) so that no two course pages ever
     show the same quote. Keep the length a multiple of three when editing. */
  var REVIEWS = [
    {
      name: "Dana Whitfield",
      role: "Operations analyst",
      date: "March 2026",
      rating: 5,
      body:
        "Paced exactly right. I did two lessons a night for a week and had something working by the weekend."
    },
    {
      name: "Ravi Menon-Clarke",
      role: "Frontend engineer",
      date: "February 2026",
      rating: 5,
      body:
        "The syllabus was accurate down to the lesson. I knew what I was buying and that is what I got."
    },
    {
      name: "Ingrid Solheim",
      role: "Data analyst",
      date: "February 2026",
      rating: 4,
      body:
        "Dense in the best way. I rewound a few times in the middle section, which is a compliment."
    },
    {
      name: "Kwame Ansah-Berg",
      role: "Backend engineer",
      date: "January 2026",
      rating: 5,
      body:
        "No filler. The exercises are the course, and the videos are the explanation around them."
    },
    {
      name: "Noor Haddadi",
      role: "Product manager",
      date: "January 2026",
      rating: 5,
      body:
        "I have taken four courses on this subject. This is the first one I finished."
    },
    {
      name: "Peter Lindqvist-Roe",
      role: "Engineering manager",
      date: "December 2025",
      rating: 4,
      body:
        "Clear, unhurried, and honest about what the material will not cover. I would take another."
    },
    {
      name: "Sofia Marchetti",
      role: "Platform engineer",
      date: "March 2026",
      rating: 5,
      body:
        "The first module answered a question I had been carrying around for two years. I stopped the video and wrote it down."
    },
    {
      name: "Emeka Adeyinka",
      role: "Design engineer",
      date: "February 2026",
      rating: 5,
      body:
        "Watching someone work through the messy version first is worth more to me than any finished example."
    },
    {
      name: "Helene Dubois-Ward",
      role: "Analytics lead",
      date: "November 2025",
      rating: 4,
      body:
        "I skipped the opening section because I thought I knew it. That was a mistake and I went back."
    },
    {
      name: "Tobias Reinholt",
      role: "Senior developer",
      date: "April 2026",
      rating: 5,
      body:
        "Every exercise has a worked solution, including the parts I got wrong for what turned out to be good reasons."
    },
    {
      name: "Aisha Rahman-Coyle",
      role: "Product designer",
      date: "December 2025",
      rating: 5,
      body:
        "It respects your time. Nothing is said three times to fill out a runtime."
    },
    {
      name: "Marcus Oyelaran",
      role: "Staff engineer",
      date: "March 2026",
      rating: 5,
      body:
        "I passed this to two people on my team and both of them finished it, which basically never happens."
    },
    {
      name: "Yuki Tanaka-Brooks",
      role: "UX researcher",
      date: "October 2025",
      rating: 4,
      body:
        "Good material, though the pace picks up sharply in the fourth section. Budget more time there than you expect to need."
    },
    {
      name: "Bruno Castellanos",
      role: "Site reliability engineer",
      date: "February 2026",
      rating: 5,
      body:
        "The worked examples are real. You can tell because the awkward parts are still in them."
    },
    {
      name: "Freya Lindholm",
      role: "Technical writer",
      date: "January 2026",
      rating: 5,
      body:
        "I bought it on a Sunday and had used two things from it by Wednesday. That is the whole review."
    },
    {
      name: "Omar Bensalem",
      role: "Data engineer",
      date: "March 2026",
      rating: 5,
      body:
        "It never talks down to you and it never assumes you already know. That balance is harder than it looks."
    },
    {
      name: "Clara Nwachukwu-Reid",
      role: "Interaction designer",
      date: "November 2025",
      rating: 4,
      body:
        "A couple of the later videos could be tighter, but the thinking underneath them is solid all the way through."
    },
    {
      name: "Jasper Vandermolen",
      role: "Software architect",
      date: "April 2026",
      rating: 5,
      body:
        "The section on trade-offs changed how I write proposals at work, which is not what I bought it for."
    },
    {
      name: "Leila Farahani",
      role: "Product analyst",
      date: "December 2025",
      rating: 5,
      body:
        "Clear enough that I watched at normal speed instead of skipping ahead, and I always skip ahead."
    },
    {
      name: "Andres Quintanilla",
      role: "Full stack developer",
      date: "February 2026",
      rating: 5,
      body:
        "I keep the exercise files open in a second tab and I am still going back to them a month later."
    },
    {
      name: "Meredith Achebe-Ross",
      role: "Engineering lead",
      date: "September 2025",
      rating: 4,
      body:
        "Honest about what it does not cover, which saved me from waiting for a chapter that was never coming."
    },
    {
      name: "Sung-min Park",
      role: "Mobile engineer",
      date: "March 2026",
      rating: 5,
      body:
        "Short lessons and no throat clearing. I finished the whole thing in a week of commutes."
    },
    {
      name: "Valentina Rossi-Okoye",
      role: "Design lead",
      date: "January 2026",
      rating: 5,
      body:
        "The instructor answers the question you were about to ask, roughly a minute after you think of it."
    },
    {
      name: "Declan Murtagh",
      role: "Infrastructure engineer",
      date: "October 2025",
      rating: 5,
      body:
        "I took notes for the first hour and then stopped, because the course notes were already better than mine."
    },
    {
      name: "Priyanka Deshmukh-Hall",
      role: "Business analyst",
      date: "February 2026",
      rating: 4,
      body:
        "Worth the money. I would have paid the same again for a second course from the same person."
    },
    {
      name: "Nils Aabye",
      role: "Backend developer",
      date: "April 2026",
      rating: 5,
      body:
        "It gave me the vocabulary for things I had been doing by feel. Now I can argue for them in a review."
    },
    {
      name: "Rosalind Ekwueme",
      role: "Product manager",
      date: "December 2025",
      rating: 5,
      body:
        "My team watched the third section together and we changed a decision that same afternoon."
    },
    {
      name: "Gareth Pemberton-Ilesanmi",
      role: "QA engineer",
      date: "November 2025",
      rating: 4,
      body:
        "Solid throughout. The audio dips a little in one lesson, and that is the only complaint I have."
    },
    {
      name: "Amara Diallo-Stern",
      role: "Data scientist",
      date: "March 2026",
      rating: 5,
      body:
        "Nothing here is hand-waved. When something is genuinely hard, the course says so and then slows down."
    },
    {
      name: "Theo Van Rijn",
      role: "Frontend developer",
      date: "January 2026",
      rating: 5,
      body:
        "I came for one specific technique and stayed for the reasoning that surrounded it."
    },
    {
      name: "Sinead O'Halloran-Baptiste",
      role: "Program manager",
      date: "September 2025",
      rating: 5,
      body:
        "The templates alone covered the price. I use two of them every single week now."
    },
    {
      name: "Rafael Monteiro-Whitby",
      role: "Principal engineer",
      date: "February 2026",
      rating: 4,
      body:
        "Pitched slightly below where I am, and I still came away with four pages of notes."
    },
    {
      name: "Junko Halvorsen",
      role: "Design systems lead",
      date: "April 2026",
      rating: 5,
      body:
        "It made me delete work rather than add more, which is the highest compliment I have got."
    },
    {
      name: "Adebayo Krishnan",
      role: "Solutions engineer",
      date: "October 2025",
      rating: 5,
      body:
        "The final project is a real thing you can show someone, not a toy that only works in the video."
    },
    {
      name: "Marguerite Osei-Fenwick",
      role: "Content strategist",
      date: "December 2025",
      rating: 5,
      body:
        "I have been doing this for eleven years and still found three habits worth fixing."
    },
    {
      name: "Lars Ntumba-Reid",
      role: "Systems engineer",
      date: "March 2026",
      rating: 4,
      body:
        "Rigorous and calm. It assumes you are an adult who can sit with a hard idea for ten minutes."
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

  /* Every module carries `lessons` (an array of real lesson titles) and
     `lessonCount` (the number those titles must match). moduleLessons is the
     one place that reconciles them. */
  function moduleLessons(mod) {
    if (!mod) return 0;
    if (typeof mod.lessonCount === "number") return mod.lessonCount;
    return mod.lessons && mod.lessons.length ? mod.lessons.length : 0;
  }

  function totalLessons(course) {
    var n = 0;
    for (var m = 0; m < course.syllabus.length; m++) n += moduleLessons(course.syllabus[m]);
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

  /* Deterministic three-review slice. Each course gets its own block of three
     from the pool, keyed on its position in the catalog, so a page always
     shows the same set and no two courses ever share a quote. Codes outside
     the catalog fall back to a hash of the code. */
  function pickReviews(code) {
    var key = String(code || "").trim().toUpperCase();
    var idx = -1;
    for (var c = 0; c < COURSES.length; c++) {
      if (COURSES[c].code === key) {
        idx = c;
        break;
      }
    }
    if (idx < 0) {
      var h = 0;
      for (var p = 0; p < key.length; p++) h = (h * 31 + key.charCodeAt(p)) >>> 0;
      idx = h % Math.max(1, Math.floor(REVIEWS.length / 3));
    }
    var start = (idx * 3) % REVIEWS.length;
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
    moduleLessons: moduleLessons,
    totalLessons: totalLessons,
    curriculumSummary: curriculumSummary,
    pickReviews: pickReviews,
    subtotal: subtotal
  };
})();
