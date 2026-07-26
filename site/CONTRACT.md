# TOLERANCE - integration contract

Foundation built by agent 1. Agents 2 and 3 copy from this file verbatim.
Design authority is `DESIGN-B.md`; this file is its implementation surface.

Files already in place:

```
site/
  index.html      built (landing page)
  css/main.css    built (complete design system, do not fork)
  js/main.js      built (nav, accordion, reveals, cart badge)
  CONTRACT.md     this file
```

Pages still to build (link to them by exactly these names):
`courses.html`, `course.html`, `pricing.html`, `checkout.html`.

## 0. Non-negotiables

1. **Every path is relative.** `href="courses.html"`, `src="js/main.js"`,
   `href="css/main.css"`. A URL must never begin with `/`. The site deploys
   under a subpath.
2. **Do not add CSS files, JS files, frameworks, or external scripts.** If a
   page needs a new component, add it to `css/main.css` in the matching
   numbered section and document it here.
3. **No inline `style=` attributes.** Use the utilities in section 8.
4. **Banned absolutely:** border-radius, box-shadow, gradients, backdrop-blur,
   em-dash (`—`), en-dash (`–`), emoji, italics, a third font family, terminal
   green, purple, star ratings, logo walls, invented counts, fake terminals,
   crosshair or registration decoration, count-up numbers, parallax.
   Hyphen (`-`) only. Grep your page for `—` and `–` before you finish.
5. **Red rationing:** at most 2 elements using `--accent` visible in one
   viewport. Small red text always uses `--accent-text` (`#FF6B57`), never
   `--accent`. Focus outlines do not count (transient).
6. **Eyebrow budget:** `.eyebrow` above a headline is capped at
   `ceil(sections / 3)` per page. Mono labels *inside* components (table
   headers, card metadata, form labels, footer column titles) are unlimited.
7. **One `<h1>` per page**, uppercase (`.display` or `.h1`).
8. **Buttons:** label max 3 words, one label per intent per page.
9. All prices, durations, dates and course codes use a mono class
   (`.mono-data`, `.price`, `.mono-label`) so they get tabular figures.

## 1. Shared `<head>` boilerplate

Copy exactly. Only `<title>` and the description change per page.

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>TOLERANCE - Catalog</title>
<meta name="description" content="One sentence, plain, no marketing verbs.">
<script>document.documentElement.className += " has-js";</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap">
<link rel="stylesheet" href="css/main.css">
<script src="js/main.js" defer></script>
</head>
```

The one-line inline script is required: it sets `has-js` before first paint so
reveal animations do not flash. Do not remove it, do not add other inline JS.

Titles to use: `TOLERANCE - Catalog`, `TOLERANCE - Systems Under Load`,
`TOLERANCE - Pricing`, `TOLERANCE - Checkout`.

## 2. Page skeleton

```html
<body>

<div class="frame">

  <!-- NAV (section 3) -->
  <!-- NAV PANEL (section 3.2) -->

  <main id="main">
    <section class="section"> ... </section>
    <section class="section"> ... </section>
  </main>

  <!-- FOOTER (section 4) -->

</div>

</body>
</html>
```

`.frame` draws the 1px site frame (max 1408px). Sections stack inside it and
`.section + .section` draws the hairline between them automatically: never add
your own divider between sections.

Section variants: add `.section--flush` when the section contains a `.split`
whose vertical hairline must reach the frame edges, or a full-bleed image.

## 3. Canonical nav

### 3.1 Full nav (courses.html, course.html, pricing.html)

Copy verbatim. On the current page, add `aria-current="page"` to that link and
remove it from the others (index.html has none, since Method is an anchor).

```html
  <header class="nav">
    <a class="wordmark" href="index.html">TOLERANCE<sup>&reg;</sup></a>
    <nav class="nav__links" aria-label="Primary">
      <a class="nav__link" href="courses.html">Courses</a>
      <a class="nav__link" href="pricing.html">Pricing</a>
      <a class="nav__link" href="index.html#method">Method</a>
    </nav>
    <div class="nav__actions">
      <a class="nav__cart" href="checkout.html" data-cart-link hidden>Cart [<span data-cart-count>0</span>]</a>
      <a class="nav__signin" href="#">Sign in</a>
      <a class="btn btn--primary btn--sm" href="courses.html">Browse courses</a>
    </div>
    <button class="nav__toggle" type="button" aria-label="Menu" aria-expanded="false" aria-controls="nav-panel" data-nav-toggle>
      <svg class="icon icon--open" viewBox="0 0 256 256" aria-hidden="true"><line x1="40" y1="64" x2="216" y2="64"></line><line x1="40" y1="128" x2="216" y2="128"></line><line x1="40" y1="192" x2="216" y2="192"></line></svg>
      <svg class="icon icon--close" viewBox="0 0 256 256" aria-hidden="true"><line x1="200" y1="56" x2="56" y2="200"></line><line x1="200" y1="200" x2="56" y2="56"></line></svg>
    </button>
  </header>
```

### 3.2 Mobile panel (ships with the full nav, always immediately after it)

```html
  <div class="nav__panel" id="nav-panel" data-nav-panel>
    <a class="nav__panel-link" href="courses.html">Courses</a>
    <a class="nav__panel-link" href="pricing.html">Pricing</a>
    <a class="nav__panel-link" href="index.html#method">Method</a>
    <div class="nav__panel-actions">
      <a class="btn btn--primary" href="courses.html">Browse courses</a>
      <a class="btn btn--secondary" href="#">Sign in</a>
    </div>
  </div>
```

The panel is hidden above 720px and driven entirely by `main.js`
(`[data-nav-toggle]` / `[data-nav-panel]`, Escape closes it). Nothing to wire up.

### 3.3 Reduced nav (checkout.html only)

Still 64px, no links, no panel, no toggle.

```html
  <header class="nav">
    <a class="wordmark" href="index.html">TOLERANCE<sup>&reg;</sup></a>
    <span class="mono-label nav__status">Secure checkout</span>
  </header>
```

## 4. Canonical footer

### 4.1 Full footer (courses.html, course.html, pricing.html)

Copy verbatim.

```html
  <footer class="footer">
    <div class="footer__grid">
      <div class="footer__brand">
        <a class="wordmark" href="index.html">TOLERANCE<sup>&reg;</sup></a>
        <p class="body-sm footer__tag">Courses machined to spec.</p>
        <p class="mono-data footer__legal">&copy; 2026 Tolerance Courses</p>
        <p class="mono-data footer__legal">A fictional demo site.</p>
      </div>

      <div class="footer__col">
        <span class="mono-label footer__title">Catalog</span>
        <ul class="footer__list">
          <li><a class="footer__link" href="course.html">Systems Under Load</a></li>
          <li><a class="footer__link" href="course.html">Interface Physics</a></li>
          <li><a class="footer__link" href="course.html">The Type System, Fully</a></li>
          <li><a class="footer__link" href="course.html">Design for Density</a></li>
          <li><a class="footer__link" href="course.html">From Parser to Production</a></li>
          <li><a class="footer__link" href="course.html">The Staff Engineer Brief</a></li>
        </ul>
      </div>

      <div class="footer__col">
        <span class="mono-label footer__title">Company</span>
        <ul class="footer__list">
          <li><a class="footer__link" href="index.html#method">Method</a></li>
          <li><a class="footer__link" href="index.html#instructors">Instructors</a></li>
          <li><a class="footer__link" href="#">Contact</a></li>
        </ul>
      </div>

      <div class="footer__col">
        <span class="mono-label footer__title">Legal</span>
        <ul class="footer__list">
          <li><a class="footer__link" href="#">Terms</a></li>
          <li><a class="footer__link" href="#">Privacy</a></li>
          <li><a class="footer__link" href="#">Refunds</a></li>
        </ul>
      </div>

      <div class="footer__col">
        <span class="mono-label footer__title">Elsewhere</span>
        <ul class="footer__list">
          <li><a class="footer__link" href="#">RSS</a></li>
          <li><a class="footer__link" href="#">YouTube</a></li>
          <li><a class="footer__link" href="#">GitHub</a></li>
        </ul>
      </div>
    </div>
  </footer>
```

`href="#"` marks a destination that does not exist in this five-page demo. Do
not invent pages for them. No newsletter form, no social icons, no version
string.

### 4.2 Reduced footer (checkout.html only)

```html
  <footer class="footer footer--reduced">
    <p class="mono-data t-3">&copy; 2026 Tolerance Courses. A fictional demo site.</p>
    <p class="mono-data"><a class="footer__link" href="#">Terms</a> <a class="footer__link" href="#">Privacy</a></p>
  </footer>
```

## 5. localStorage cart schema

- **Key:** `tolerance_cart`
- **Value:** JSON array of course code strings, no duplicates, order preserved.
  Example: `["TL-301","TL-112"]`
- Nothing else is stored. No prices, no quantities, no user data. Prices are
  looked up from the course table in section 10 at render time.
- Malformed or missing values are treated as `[]` (main.js is defensive).

`main.js` renders the badge on `DOMContentLoaded` and on cross-tab `storage`
events:

- every `[data-cart-count]` element gets `textContent = count`
- every `[data-cart-link]` element gets `hidden = (count === 0)`

Public API on `window.TOLERANCE` (call it, do not re-implement it):

```js
TOLERANCE.readCart()            // -> ["TL-301"]
TOLERANCE.writeCart(["TL-301"]) // replaces, then re-renders the badge
TOLERANCE.addToCart("TL-301")   // adds if absent, then re-renders
TOLERANCE.removeFromCart("TL-301")
TOLERANCE.renderCart()          // force badge re-render
```

Declarative shortcut, already wired in main.js. Any element with these
attributes updates the cart on click, no JS needed from you:

```html
<button class="btn btn--primary" type="button" data-add-to-cart="TL-301">Buy this course</button>
<button class="btn btn--accent" type="button" data-remove-from-cart="TL-301">Remove from order</button>
```

If you need page-specific behaviour, add a small `init...()` function to
`js/main.js` guarded by a `data-` attribute lookup that returns early when the
element is absent, exactly like `initHero()`. Do not create a second JS file.

## 6. Icons

One family, Phosphor "regular" geometry, inlined as SVG (no icon library is
possible without a build step). Always `viewBox="0 0 256 256"`,
`class="icon"`, `aria-hidden="true"`. `.icon` supplies 16px size,
`fill:none`, `stroke:currentColor`, `stroke-width:16`. Do not draw new icons;
these four are the whole set.

```html
<!-- ArrowRight -->
<svg class="icon" viewBox="0 0 256 256" aria-hidden="true"><line x1="40" y1="128" x2="216" y2="128"></line><polyline points="144 56 216 128 144 200"></polyline></svg>

<!-- Plus (accordion; rotates to a cross when open) -->
<svg class="icon" viewBox="0 0 256 256" aria-hidden="true"><line x1="40" y1="128" x2="216" y2="128"></line><line x1="128" y1="40" x2="128" y2="216"></line></svg>

<!-- List (hamburger) -->
<svg class="icon icon--open" viewBox="0 0 256 256" aria-hidden="true"><line x1="40" y1="64" x2="216" y2="64"></line><line x1="40" y1="128" x2="216" y2="128"></line><line x1="40" y1="192" x2="216" y2="192"></line></svg>

<!-- X (close) -->
<svg class="icon icon--close" viewBox="0 0 256 256" aria-hidden="true"><line x1="200" y1="56" x2="56" y2="200"></line><line x1="200" y1="200" x2="56" y2="56"></line></svg>
```

For the solid play triangle in `.play`, `.play .icon` switches to
`fill:currentColor; stroke:none`:

```html
<button class="play" type="button" aria-label="Play sample lesson">
  <svg class="icon" viewBox="0 0 256 256" aria-hidden="true"><path d="M228,128a15.74,15.74,0,0,1-7.6,13.51L88.32,222.8a15.91,15.91,0,0,1-16.2.3A15.74,15.74,0,0,1,64,209.28V46.72a15.74,15.74,0,0,1,8.12-13.82,15.91,15.91,0,0,1,16.2.3L220.4,114.49A15.74,15.74,0,0,1,228,128Z"></path></svg>
</button>
```

## 7. Component snippets

### 7.1 Buttons

```html
<!-- primary -->
<a class="btn btn--primary" href="courses.html">Browse courses</a>
<button class="btn btn--primary" type="submit">Buy this course</button>

<!-- small (nav) -->
<a class="btn btn--primary btn--sm" href="courses.html">Browse courses</a>

<!-- secondary -->
<a class="btn btn--secondary" href="pricing.html">See pricing</a>

<!-- disabled: use the attribute on <button>, the class on <a> -->
<button class="btn btn--primary" type="button" disabled>Buy this course</button>
<a class="btn btn--secondary is-disabled" href="#" aria-disabled="true">Buy this course</a>

<!-- accent, text only, at most once per flow. Never a filled red button. -->
<button class="btn btn--accent" type="button">Remove from order</button>

<!-- full width (checkout submit) -->
<button class="btn btn--primary btn--block" type="submit"> ... </button>
```

**Loading state.** A button that can load must carry both spans. The two spans
share one grid cell, so the button is already as wide as its widest state and
never jumps. Add `.is-loading` to swap (150ms opacity crossfade); the glyph
cycles `/ - \ |` at 80ms per frame.

```html
<button class="btn btn--primary btn--block" type="submit">
  <span class="btn__label">Pay $189</span>
  <span class="btn__loading" aria-hidden="true"><span class="btn__glyph"><span>/-\|</span></span>Working</span>
</button>
```

```js
btn.classList.add("is-loading");   // shows spinner, blocks pointer events
btn.classList.remove("is-loading");
// mock success: swap the label text, keep the crossfade
btn.querySelector(".btn__label").textContent = "Paid. Check your email.";
```

### 7.2 Course row (catalog, related, pricing cohorts)

The whole row is the link. Rows live in `.rows__cluster` groups; the hairline
is drawn between clusters, never under every row.

```html
<div class="rows">
  <div class="rows__cluster">
    <a class="row" href="course.html">
      <span class="row__code mono-data"><span>TL-301</span><span>SELF-PACED</span></span>
      <span class="row__main">
        <span class="h3">Systems Under Load</span>
        <span class="row__desc body-sm">Performance engineering for distributed backends: measure first, then fix the queue, the allocator, and the network, in that order.</span>
      </span>
      <span class="row__meta mono-data">11H 20M / 07 MODULES</span>
      <span class="row__price">$249
        <svg class="icon row__arrow" viewBox="0 0 256 256" aria-hidden="true"><line x1="40" y1="128" x2="216" y2="128"></line><polyline points="144 56 216 128 144 200"></polyline></svg>
      </span>
    </a>
    <!-- more .row here -->
  </div>
  <div class="rows__cluster"> <!-- cohort rows --> </div>
</div>
```

Filtering (courses.html): fade with `.is-fading` (150ms opacity), then set
`.is-filtered-out` to remove it from layout. Never animate the container, never
add a layout spring.

### 7.3 Course card

```html
<a class="card" href="course.html">
  <div class="card__media">
    <img class="img-treat img-cover" src="https://picsum.photos/seed/tolerance-tl301-cover/900/600" width="900" height="600" alt="..." loading="lazy">
  </div>
  <div class="card__body">
    <p class="mono-data card__meta">TL-301 / SELF-PACED</p>
    <h2 class="h3">Systems Under Load</h2>
    <p class="body-sm card__desc">One-line description.</p>
    <div class="card__foot">
      <span class="mono-data t-2">11H 20M / 07 MODULES</span>
      <span class="price">$249</span>
    </div>
  </div>
</a>
```

### 7.4 Accordion (syllabus and FAQ, same component)

Wrapper needs `data-accordion`. Items are independent. The open item carries
`.is-open` on `.acc__item` **and** `aria-expanded="true"` on the trigger. Both
must be set in the markup for anything open on load. The four nested elements
(`.acc__panel > .acc__clip > .acc__inner`) are required for the
`grid-template-rows` transition; do not flatten them.

```html
<div class="acc" data-accordion>
  <div class="acc__item is-open">
    <button class="acc__trigger" type="button" aria-expanded="true" aria-controls="mod-01">
      <span><span class="acc__code">01</span>Measurement before change</span>
      <svg class="icon acc__icon" viewBox="0 0 256 256" aria-hidden="true"><line x1="40" y1="128" x2="216" y2="128"></line><line x1="128" y1="40" x2="128" y2="216"></line></svg>
    </button>
    <div class="acc__panel" id="mod-01">
      <div class="acc__clip">
        <div class="acc__inner">
          <ul>
            <li class="acc__lesson"><span>Lesson title</span><span class="mono-data">18:40</span></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>
```

For FAQ items drop `.acc__code` and put a paragraph inside `.acc__inner`.
`aria-controls` ids must be unique per page.

### 7.5 Testimonial

```html
<div class="grid-12">
  <figure class="quote quote--wide col-7 reveal">
    <blockquote class="quote__body">&ldquo;Real typographic quotes only.&rdquo;</blockquote>
    <figcaption class="mono-label quote__attr"><strong>Ines Duarte-Vogel</strong>Staff Engineer, freight-routing platform</figcaption>
  </figure>
  <figure class="quote quote--narrow col-5 reveal">
    <blockquote class="quote__body">&ldquo;Short one.&rdquo;</blockquote>
    <figcaption class="mono-label quote__attr"><strong>Malik Osei</strong>Design Engineer, fintech tooling</figcaption>
  </figure>
</div>
```

`.quote--wide` carries a 2px `--accent` left border and counts against the
two-red-elements-per-viewport budget. Attribution is always name plus role, in
that order, never name only.

### 7.6 Form field

Label above input, helper text always present in markup, error text below.
Error state = add `.is-error` to `.field` (border switches to `--accent`, the
error line appears). Placeholders are format hints only, never labels.

```html
<div class="field">
  <label class="mono-label field__label" for="card">Card number</label>
  <input class="field__input" id="card" name="card" type="text" inputmode="numeric" placeholder="4242 4242 4242 4242" aria-describedby="card-help">
  <p class="field__help" id="card-help">Mock checkout. No card is charged.</p>
  <p class="field__error">Enter a 16-digit card number.</p>
</div>

<!-- two-up (expiry + CVC), collapses to one column under 720px -->
<div class="field-grid">
  <div class="field"> ... </div>
  <div class="field"> ... </div>
</div>

<!-- native select, styled sharp -->
<div class="field">
  <label class="mono-label field__label" for="country">Country</label>
  <select class="field__select" id="country" name="country">
    <option>United States</option>
  </select>
</div>
```

### 7.7 Plan card (pricing)

```html
<div class="plan plan--featured">
  <span class="mono-label plan__name">All-access</span>
  <p class="plan__price">$384/yr</p>
  <ul class="plan__list">
    <li>Every course, including future releases.</li>
  </ul>
  <div class="plan__cta"><a class="btn btn--primary" href="checkout.html">Start all-access</a></div>
</div>
```

`.plan--featured` adds the 2px `--accent` top border. That is the only
highlight a plan gets: no badge, no pill, no "most popular".

For the asymmetric plans grid use `.grid-12` with `.col-6` / `.col-3` /
`.col-3`, or `.split` with 1px hairlines if the compartments should touch.

### 7.8 Spec sheet cell (course.html)

```html
<div class="spec-grid">
  <div class="spec-cell">
    <span class="mono-label spec-cell__label">Total runtime</span>
    <p class="spec-cell__value">11h 20m</p>
    <p class="spec-cell__note">Recorded at final pace, no padding.</p>
  </div>
</div>
```

### 7.9 Filter toggles (courses.html)

Active toggle = `aria-pressed="true"` (inverts to `--text-1` background).

```html
<div class="toggles" role="group" aria-label="Format">
  <button class="toggle" type="button" aria-pressed="true">All</button>
  <button class="toggle" type="button" aria-pressed="false">Self-paced</button>
  <button class="toggle" type="button" aria-pressed="false">Cohort</button>
</div>
```

### 7.10 Order summary rows (checkout.html)

```html
<div class="compartment sticky">
  <span class="mono-label">Order</span>
  <div class="summary-row"><span>TL-112 The Type System, Fully</span><span>$189.00</span></div>
  <hr class="rule">
  <div class="summary-row"><span>Subtotal</span><span>$189.00</span></div>
  <div class="summary-row"><span>Tax</span><span>$0.00</span></div>
  <hr class="rule">
  <div class="summary-row summary-row--total"><span>Total</span><span>$189.00</span></div>
</div>
```

### 7.11 Live status indicator (courses.html cohort note only)

The single semantic indicator allowed on the site. A 6px square, never a
circle, never used decoratively, and only when the mock data says open.

```html
<p class="status mono-label"><span class="status__dot"></span>Enrollment open: Sep cohort</p>
```

## 8. Class reference

### Typography
| Class | Purpose |
|---|---|
| `.display` | Hero headline, Archivo 800, clamp 56-104px, uppercase. |
| `.h1` | Page title, Archivo 800, 44px, uppercase. |
| `.h2` | Section headline, Archivo 700, 30px, sentence case. |
| `.h3` | Sub-headline / card and row title, Archivo 600, 20px. |
| `.body` | 16px body copy, capped at 65ch. |
| `.body-sm` | 14px body copy. |
| `.mono-data` | JetBrains Mono 13px tabular: prices, durations, codes, dates. |
| `.mono-label` | JetBrains Mono 12px uppercase +0.08em: data labels and eyebrows. |
| `.mono-btn` | JetBrains Mono 13px uppercase +0.06em (button type, if needed outside `.btn`). |
| `.eyebrow` | Makes a `.mono-label` a section eyebrow (block, `--text-2`, 24px below). Budget-limited. |
| `.link` | Inline text link: `--text-1` with a 1px accent underline revealed on hover. |
| `.t-1` `.t-2` `.t-3` `.t-accent` | Text colour: primary, secondary, tertiary, accent (`#FF6B57`). |
| `.visually-hidden` | Screen-reader only text. |

### Layout
| Class | Purpose |
|---|---|
| `.frame` | The drawn site frame: max 1408px, 1px left/right border. One per page, wraps everything. |
| `.section` | Page section: 96px vertical (64 at 1080, 56 at 720) and `--pad-x` horizontal padding. Consecutive sections get the dividing hairline automatically. |
| `.section--flush` | Removes horizontal padding so a `.split` hairline or full-bleed image reaches the frame edge. |
| `.section--hero` | Caps top padding at 64px. Hero only. |
| `.section--ruled` | Forces the top hairline on a section that is not preceded by one. |
| `.section__head` | Headline block above section content; 48px below, styles a nested `.body` as secondary. |
| `.rule` | A standalone 1px hairline. Only between two pieces of real content. |
| `.grid-12` | 12-column grid, 24px gap, no dividers. Children use `.col-*`. |
| `.col-3` `.col-4` `.col-5` `.col-6` `.col-7` `.col-8` `.col-12` | Column spans inside `.grid-12`. All collapse to full width under 720px. |
| `.split` | Hairline-divided grid: 1px gap over `--line`, children painted `--bg`. |
| `.split--7-5` `.split--5-7` `.split--4-8` `.split--2-1` `.split--3` `.split--2` | Split ratios. All collapse to one column at 1080px (the hairline becomes horizontal). |
| `.pad` | 32px vertical, `--pad-x` horizontal padding (split children). |
| `.pad-x` | Horizontal `--pad-x` only (split children in a section that already pads vertically). |
| `.pad-dense` | 24px padding. |
| `.compartment` | `--surface` panel with a 1px `--line` border and 32px padding. |
| `.compartment--dense` | Same at 24px padding. |
| `.sticky` | `position: sticky; top: 65px`. Auto-disabled below 1080px. |
| `.stack` `.stack-24` `.stack-32` | Vertical rhythm of 16 / 24 / 32px between children. |
| `.mt-8` `.mt-16` `.mt-24` `.mt-32` `.mt-48` | Top margin, on-scale only. |
| `.img-treat` | Sitewide image treatment: `grayscale(1) contrast(1.05)`, transitions to `grayscale(0.4)` inside a hovered `.card` or `.person`. |
| `.img-cover` | `width/height:100%; object-fit:cover` for a sized media box. |

### Buttons
| Class | Purpose |
|---|---|
| `.btn` | Button base: 44px tall, radius 0, mono 13px uppercase, all transitions. |
| `.btn--primary` | Filled `#EAEAEA` on `#0A0A0A`; hover `#FFFFFF`; active 1px press; disabled `--line-strong`. |
| `.btn--secondary` | Outlined `--line-strong`; hover border `#EAEAEA`. |
| `.btn--accent` | Text-only `--accent-text` with hover underline. Max once per flow. |
| `.btn--sm` | 36px height (nav). |
| `.btn--block` | Full width. |
| `.btn--block-mobile` | Full width under 720px only. |
| `.btn__label` | The default label span (required if the button can load). |
| `.btn__loading` | The loading span: glyph plus the word Working. |
| `.btn__glyph` | 1ch window over `/-\|`, stepped 4-frame cycle at 80ms. |
| `.is-loading` | On `.btn`: crossfades to the loading state and blocks pointer events. |
| `.is-disabled` | Disabled styling for `<a>` elements (use the `disabled` attribute on `<button>`). |
| `.btn-row` | Horizontal 16px-gap row of buttons or a button plus mono text. |

### Nav
| Class | Purpose |
|---|---|
| `.nav` | 64px sticky header with structural bottom hairline. |
| `.wordmark` | `TOLERANCE®` wordmark, Archivo 800 uppercase 16px. |
| `.nav__links` | Primary link cluster (hidden under 720px). |
| `.nav__link` | Mono 12px nav link; hover and `aria-current="page"` add the accent underline. |
| `.nav__actions` | Right-aligned cluster (hidden under 720px). |
| `.nav__cart` | Cart indicator; keep the `hidden` attribute in markup, main.js reveals it. |
| `.nav__signin` | Text-only Sign in link. |
| `.nav__status` | Right-aligned mono status text for the reduced checkout nav. |
| `.nav__toggle` | Hamburger button, visible under 720px; swaps its own icons via `aria-expanded`. |
| `.nav__panel` | Full-height mobile panel; slides from the top, 240ms open / 180ms close. |
| `.nav__panel-link` | H2-scale link inside the panel, hairline-divided. |
| `.nav__panel-actions` | Button row at the bottom of the panel. |
| `.is-open` | On `.nav__panel` (open) and on `.acc__item` (expanded). Set by main.js. |

### Course row and card
| Class | Purpose |
|---|---|
| `.rows` | Container for all row clusters; the element a filter operates on. |
| `.rows__cluster` | A group of rows; the hairline is drawn between clusters, not under rows. |
| `.row` | Full-width 12-col course row; the whole row is the link. Hover paints `--surface`. |
| `.row__code` | Cols 1-2: course code and format, `--text-3`, stacked (inline with a slash under 720px). |
| `.row__main` | Cols 3-8: title plus description. |
| `.row__desc` | The one-line description, `--text-2`. |
| `.row__meta` | Cols 9-10: right-aligned mono runtime and module count. |
| `.row__price` | Cols 11-12: right-aligned mono price plus the arrow icon. |
| `.row__arrow` | Arrow icon; translates 4px right on row hover. |
| `.is-fading` | 150ms opacity fade for filtering. |
| `.is-filtered-out` | Removes a filtered row from layout. |
| `.card` | Featured course card: `--surface` compartment, whole card is a link. |
| `.card__media` | 3:2 image box with the bottom hairline. |
| `.card__body` | 24px padded body. |
| `.card__meta` | Mono code and format line. |
| `.card__desc` | One-line description. |
| `.card__foot` | Hairline-topped bottom row: metadata left, price right. |
| `.price` | Mono tabular price. |
| `.price--lg` | 30px 700 price (buy panel, plans). |
| `.price--struck` | Struck-through price in `--accent-text`. Rationed. |

### Accordion
| Class | Purpose |
|---|---|
| `.acc` | Hairline-divided accordion list; needs `data-accordion` to be wired. |
| `.acc__item` | One item; `.is-open` when expanded. |
| `.acc__trigger` | Full-width trigger button; `aria-expanded` drives the icon. |
| `.acc__code` | Mono module code before the title. |
| `.acc__icon` | Plus icon; rotates 45deg to a cross when open. |
| `.acc__panel` | The `grid-template-rows: 0fr -> 1fr` wrapper. |
| `.acc__clip` | `overflow: hidden` inner wrapper. Required. |
| `.acc__inner` | Panel content; fades in 150ms after a 60ms delay. |
| `.acc__lesson` | Lesson line: title left, mono duration right. |
| `.no-anim` | Temporary class main.js sets so keyboard toggles are instant. Do not author it. |

### Testimonial
| Class | Purpose |
|---|---|
| `.quote` | Testimonial base. |
| `.quote--wide` | Wide variant: 20px quote, 2px `--accent` left border. |
| `.quote--narrow` | Narrow variant: 16px quote, top hairline. |
| `.quote__body` | The quote text (real typographic quotes). |
| `.quote__attr` | Attribution: `<strong>` name on its own line, then role and company. |

### Form
| Class | Purpose |
|---|---|
| `.field` | One field block. |
| `.field__label` | Mono label above the input. |
| `.field__input` | Text input: `--surface`, 1px `--line`, 12/16 padding, mono 14px. |
| `.field__select` | Native select, same treatment. |
| `.field__help` | Helper text under the input, `--text-3`. |
| `.field__error` | Error text in `--accent-text`; hidden until `.is-error`. |
| `.is-error` | On `.field`: border switches to `--accent` and the error line shows. |
| `.field-grid` | Two-up field row (expiry plus CVC); one column under 720px. |

### Plans and page parts
| Class | Purpose |
|---|---|
| `.plan` | Plan compartment: `--surface`, 1px border, 32px padding, CTA pinned to the bottom. |
| `.plan--featured` | Adds the 2px `--accent` top border. The only plan highlight. |
| `.plan__name` | Mono label plan name. |
| `.plan__price` | Mono 30px 700 tabular price. |
| `.plan__list` | 4-6 plain list items, `--text-2`. |
| `.plan__cta` | Bottom-aligned button holder. |
| `.toggles` | Hairline-joined filter toggle group. |
| `.toggle` | One toggle; `aria-pressed="true"` inverts it. |
| `.spec-grid` | 2-column spec sheet grid (1 column under 720px). |
| `.spec-cell` | One `--surface` spec cell. |
| `.spec-cell__label` | Mono label. |
| `.spec-cell__value` | Large mono tabular value. |
| `.spec-cell__note` | One-line "why it matters", `--text-2`. |
| `.media` | 16:9 bordered media box for the sample-lesson placeholder. |
| `.play` | 64px square play control, all states including disabled. |
| `.summary-row` | Mono order-summary line: label left, amount right. |
| `.summary-row--total` | 20px 700 total line. |
| `.status` | The single live indicator line. |
| `.status__dot` | 6px `--accent` square. Never decorative, never a circle. |
| `.people` | Asymmetric instructor grid, hairline-divided. |
| `.person` | One instructor cell, whole cell is a link. |
| `.person--lg` `.person--sm` | 6-col (3:2 photo) and 3-col (1:1 photo) cells. |
| `.person__media` | Photo box. |
| `.person__cred` | One-line credential, `--text-2`. |

### Footer
| Class | Purpose |
|---|---|
| `.footer` | Footer with top hairline and 64px vertical padding. |
| `.footer__grid` | 12-col footer grid. |
| `.footer__brand` | Wordmark column (4 cols). |
| `.footer__col` | Link column (2 cols). |
| `.footer__tag` | "Courses machined to spec." line. |
| `.footer__legal` | Copyright and the fictional-site line, `--text-3`. |
| `.footer__title` | Mono column title. |
| `.footer__list` | Link list with 12px rhythm. |
| `.footer__link` | Mono 13px link; hover lifts `--text-2` to `--text-1`. |
| `.footer--reduced` | Single-row checkout footer. |

### Motion
| Class | Purpose |
|---|---|
| `.reveal` | Scroll reveal (opacity plus 10px rise, 220ms, once at 30% visible). **Only for a section headline and its first content block. Never on every row or cell.** |
| `.is-in` | Set by main.js when a `.reveal` enters view. |
| `.hero-item` | Hero load-in child; staggered 50ms by position, max 5 per hero. |
| `.hero-item--last` | Explicit 200ms delay for the featured card (5th element, but first child of its own column). |
| `.is-loaded` | Set by main.js on `[data-hero]` after first frame. |
| `.has-js` | On `<html>`, set by the inline head script. Reveal states only apply under it. |

### Data attributes main.js reads
| Attribute | Effect |
|---|---|
| `data-nav-toggle` | The hamburger button. |
| `data-nav-panel` | The mobile panel it opens. |
| `data-accordion` | Wires every `.acc__trigger` inside. |
| `data-hero` | Runs the hero load-in on this element's children. |
| `data-cart-count` | Element whose text is set to the cart item count. |
| `data-cart-link` | Element whose `hidden` state follows an empty cart. |
| `data-add-to-cart="TL-301"` | Click adds that course code to the cart. |
| `data-remove-from-cart="TL-301"` | Click removes that course code from the cart. |

## 9. Motion rules for new pages

Only these animate. Everything else is static.

| Element | Trigger | Animation |
|---|---|---|
| Hero children plus featured card | Load, once | opacity and 12px rise, 50ms stagger, 250ms |
| Section headline plus first block | First scroll into view, once | opacity and 10px rise, 220ms |
| Buttons | hover / active | colour shift / 1px press |
| Nav and footer links | hover | colour, underline reveal, 150ms |
| Course rows and cards | hover | surface, border, arrow +4px, grayscale 1 to 0.4 |
| Accordion | pointer open/close | grid rows plus icon rotate, 240 / 180ms |
| Mobile nav panel | open/close | translateY, 240 / 180ms |
| Catalog filter | toggle | 150ms opacity only |
| Checkout submit | click | 150ms label crossfade |

Never animated: keyboard-triggered anything, page transitions, scroll-linked
effects, numbers, the nav itself, images at rest, backgrounds. Never use
`transition: all`. `prefers-reduced-motion` is already handled globally in
section 18 of `main.css`: do not add transforms that bypass it.

## 10. Course data (authoritative)

| Code | Title | Instructor | Format | Price | Metadata | One-liner |
|---|---|---|---|---|---|---|
| TL-301 | Systems Under Load | Dario Ferrentino | SELF-PACED | $249 | 11H 20M / 07 MODULES | Performance engineering for distributed backends: measure first, then fix the queue, the allocator, and the network, in that order. |
| TL-204 | Interface Physics | Anneke Visser | SELF-PACED | $229 | 8H 45M / 06 MODULES | Motion, gesture, and state transitions for design engineers who want interfaces that feel machined, not decorated. |
| TL-112 | The Type System, Fully | Rohan Chandrasekar | SELF-PACED | $189 | 9H 10M / 08 MODULES | Advanced TypeScript from variance to the compiler API, taught through a real library you publish at the end. |
| TL-317 | Design for Density | Louisa Okereke | SELF-PACED | $279 | 7H 30M / 05 MODULES | Data-dense product UI: tables, monitoring views, and editors that stay legible at 200 rows and 4 a.m. |
| TL-410 | From Parser to Production | Efe Demirci | COHORT, 8 WEEKS | $1,450 | 16 LIVE SESSIONS / 20 SEATS | Build a small compiled language end to end, with weekly code review of your implementation. |
| TL-405 | The Staff Engineer Brief | Marta Kovanen | COHORT, 6 WEEKS | $980 | 12 LIVE SESSIONS / 24 SEATS | Technical writing, RFC strategy, and decision records for engineers moving from output to leverage. |

Instructor credentials: Ferrentino, "Ex-infra lead, 9 years on payment-scale
queues." Visser, "Design engineer; shipped three widely used open-source
interaction libraries." Chandrasekar, "Compiler-team alum; maintains a
typed-SQL library." Okereke, "Led design on two monitoring products." Demirci,
"Wrote the parsing course notes half this industry learned from." Kovanen,
"Former staff engineer at a 400-person logistics firm."

Pricing: All-access `$384/yr`, Single course `FROM $189`, Team `$290/seat/yr`.

Image seeds (picsum, always with `.img-treat`):
`tolerance-tl301-cover`, `tolerance-method-bench`,
`tolerance-instructor-ferrentino`, `-visser`, `-chandrasekar`, `-okereke`,
`-demirci`, `-kovanen`. Add new descriptive seeds in the same pattern, for
example `tolerance-tl204-cover`.

Course links: every course currently points at `course.html`, which documents
TL-301. If you add `?code=TL-204` style parameters, keep `course.html` valid
without them; `main.js` does not read the query string.

### TL-301 syllabus, modules 01-04 (shared with index.html, keep identical)

- **01 Measurement before change**: Choosing a workload that represents
  production (18:40), Sampling profilers and what they miss (22:10), Reading a
  flame graph without guessing (16:05), Building a baseline harness with
  repeatable runs (25:30)
- **02 Queues, backpressure, and fairness**: Little's law in production terms
  (14:20), Bounded queues and shedding load on purpose (21:45), Fairness under
  mixed traffic (19:15)
- **03 Allocators and memory pressure**: Where allocation cost actually lands
  (17:50), Arena and pool strategies (23:05), Collector pauses you can predict
  (20:35)
- **04 The network is the slowest part**: Connection reuse and head-of-line
  blocking (18:25), Batching without adding latency (22:40), Timeouts, retries,
  and the retry storm (26:15)

Modules 05-07 are yours to write in the same voice for `course.html`. Keep
runtimes consistent with the 11h 20m total.

## 11. Before you finish

- [ ] Grep the page for `—` and `–`. Zero hits.
- [ ] Every `href` and `src` is relative; none starts with `/`.
- [ ] Every class you used exists in `css/main.css`.
- [ ] One `<h1>`; tags balanced; unique ids.
- [ ] Eyebrow count <= ceil(sections / 3).
- [ ] At most 2 accent elements per viewport.
- [ ] Every button has a label of 3 words or fewer; loading and disabled states
      exist wherever they can occur.
- [ ] Mobile collapse checked at 720px and 1080px.
- [ ] No new CSS or JS files; additions went into `main.css` / `main.js` and
      were documented here.
