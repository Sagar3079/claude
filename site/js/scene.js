/* TOLERANCE - instrument viewports.
   A small WebGL engine that draws a fictional machined component as a
   monochrome wireframe, in the palette of the rest of the site.

   Two scene types, one engine, one animation frame loop:
     data-scene="hero"    index hero, part TL-301
     data-scene="course"  course page, part parameterised from ?c=

   No dependency other than the vendored three.js build. If anything here
   fails, the <img> plate inside the container stays visible and nothing
   else on the page is affected. */

import * as THREE from "./vendor/three.module.min.js";

/* --------------------------------------------------------------------------
   Constants. Colours are the design system's line tokens, nothing else.
   -------------------------------------------------------------------------- */

const DPR_CAP = 2;
const SPIN_RATE = 0.15;                 /* rad/s about the part axis */
const TILT_MAX = (6 * Math.PI) / 180;   /* parallax ceiling */
const TILT_EASE = 3.2;                  /* approach per second */
const STATIC_AZIMUTH = 0.62;            /* reduced-motion 3/4 angle */
const FOV = 24;                         /* long lens: technical, not wide */
const ELEVATION = 0.38;                 /* camera rise, ~21 degrees */

const COL_LINE = 0x3a3a3a;              /* --line-strong */
const COL_HI = 0x6a6a6a;                /* highlight edges */
const COL_FILL = 0x121212;              /* --surface: hidden-line removal */

const CODES = ["TL-112", "TL-204", "TL-301", "TL-317", "TL-405", "TL-410"];
const DEFAULT_CODE = "TL-301";

const reduceMotion =
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ?no3d=1 forces the fallback path. Used to verify the no-WebGL route. */
const forcedOff = /(^|[?&])no3d=1(&|$)/.test(window.location.search);

/* --------------------------------------------------------------------------
   Deterministic parameters from a course code
   -------------------------------------------------------------------------- */

function hashCode(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

function makeRng(seed) {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* Every course code yields a visibly different part: fin count, bolt count,
   ring radius, hub proportions and collar all move. */
function paramsFor(code) {
  const rand = makeRng(hashCode(code));
  const span = (a, b) => a + (b - a) * rand();
  const spanInt = (a, b) => Math.round(span(a, b));

  const flangeR = span(1.24, 1.62);
  const hubR = span(0.46, 0.78);

  return {
    flangeR: flangeR,
    flangeH: span(0.13, 0.2),
    ringR: flangeR + span(0.1, 0.26),
    ringTube: span(0.045, 0.075),
    grooveR: flangeR * span(0.6, 0.78),
    boltCount: spanInt(6, 12),
    boltR: span(0.07, 0.105),
    boltCircleR: flangeR * span(0.72, 0.84),
    boltH: span(0.24, 0.34),
    finCount: spanInt(5, 11),
    finH: span(0.34, 0.78),
    finThick: span(0.07, 0.13),
    hubR: hubR,
    hubH: span(0.68, 1.34),
    collarR: hubR * span(0.6, 0.82),
    collarH: span(0.18, 0.36),
    spindleR: hubR * span(0.24, 0.38),
    spindleOver: span(0.3, 0.72)
  };
}

/* --------------------------------------------------------------------------
   Geometry. Built once per viewport, merged into three draw calls:
   one hidden-line fill, one line set, one highlight line set.
   -------------------------------------------------------------------------- */

function place(geom, x, y, angle) {
  if (x) geom.translate(x, 0, 0);
  if (angle) geom.rotateY(angle);
  if (y) geom.translate(0, y, 0);
  return geom;
}

/* A radial fin: a box whose outer end is shorter than its inner end, so the
   part reads as cast-and-machined rather than as a stack of blocks. */
function finGeometry(len, hInner, hOuter, thick) {
  const g = new THREE.BoxGeometry(len, hInner, thick, 1, 1, 1);
  const pos = g.attributes.position;
  const k = hOuter / hInner;
  for (let i = 0; i < pos.count; i++) {
    if (pos.getX(i) > 0) pos.setY(i, pos.getY(i) * k);
  }
  pos.needsUpdate = true;
  return g;
}

function buildPieces(p) {
  const S = 56;
  const pieces = [];
  const push = (geom, hi) => pieces.push({ geom: geom, hi: !!hi });

  const plateY = -0.66;
  const plateTop = plateY + p.flangeH / 2;
  const hubY = plateTop + p.hubH / 2;
  const hubTop = plateTop + p.hubH;
  const chamferH = 0.14;
  const collarY = hubTop + chamferH + p.collarH / 2;
  const collarTop = hubTop + chamferH + p.collarH;

  /* Base flange plate */
  push(place(new THREE.CylinderGeometry(p.flangeR, p.flangeR, p.flangeH, S), 0, plateY, 0));

  /* Machined circular groove on the plate face */
  push(
    place(
      new THREE.TorusGeometry(p.grooveR, 0.022, 4, 72).rotateX(Math.PI / 2),
      0,
      plateTop,
      0
    )
  );

  /* Outer retaining ring, sitting proud of the plate rim */
  push(
    place(
      new THREE.TorusGeometry(p.ringR, p.ringTube, 6, 96).rotateX(Math.PI / 2),
      0,
      plateY,
      0
    ),
    true
  );

  /* Bolt circle */
  for (let i = 0; i < p.boltCount; i++) {
    const a = (i / p.boltCount) * Math.PI * 2;
    push(
      place(
        new THREE.CylinderGeometry(p.boltR, p.boltR, p.boltH, 14),
        p.boltCircleR,
        plateY,
        a
      )
    );
  }

  /* Radial fins between hub wall and plate rim */
  const finInner = p.hubR * 0.94;
  const finOuter = p.flangeR * 0.9;
  const finLen = Math.max(0.2, finOuter - finInner);
  for (let i = 0; i < p.finCount; i++) {
    const a = (i / p.finCount) * Math.PI * 2 + Math.PI / p.finCount;
    push(
      place(
        finGeometry(finLen, p.finH, p.finH * 0.42, p.finThick),
        finInner + finLen / 2,
        plateTop + (p.finH / 2) * 0.98,
        a
      )
    );
  }

  /* Hub barrel, chamfer, collar */
  push(place(new THREE.CylinderGeometry(p.hubR, p.hubR, p.hubH, S), 0, hubY, 0));
  push(
    place(
      new THREE.CylinderGeometry(p.collarR * 1.06, p.hubR, chamferH, S),
      0,
      hubTop + chamferH / 2,
      0
    )
  );
  push(
    place(new THREE.CylinderGeometry(p.collarR, p.collarR, p.collarH, S), 0, collarY, 0),
    true
  );

  /* Through spindle */
  const spindleLen = collarTop - plateY + p.flangeH + p.spindleOver * 2;
  push(
    place(
      new THREE.CylinderGeometry(p.spindleR, p.spindleR, spindleLen, 24),
      0,
      collarTop + p.spindleOver - spindleLen / 2,
      0
    ),
    true
  );

  return pieces;
}

function concatPositions(list) {
  let total = 0;
  for (let i = 0; i < list.length; i++) total += list[i].attributes.position.count * 3;
  const arr = new Float32Array(total);
  let offset = 0;
  for (let i = 0; i < list.length; i++) {
    const a = list[i].attributes.position.array;
    arr.set(a, offset);
    offset += a.length;
  }
  const geom = new THREE.BufferGeometry();
  geom.setAttribute("position", new THREE.BufferAttribute(arr, 3));
  return geom;
}

function buildPart(p, materials) {
  const pieces = buildPieces(p);
  const fills = [];
  const lines = [];
  const highlights = [];

  for (let i = 0; i < pieces.length; i++) {
    const geom = pieces[i].geom;
    fills.push(geom.toNonIndexed());
    const edges = new THREE.EdgesGeometry(geom, 20);
    (pieces[i].hi ? highlights : lines).push(edges);
  }

  const group = new THREE.Group();

  const fillMesh = new THREE.Mesh(concatPositions(fills), materials.fill);
  fillMesh.renderOrder = 0;
  group.add(fillMesh);

  if (lines.length) {
    const l = new THREE.LineSegments(concatPositions(lines), materials.line);
    l.renderOrder = 1;
    group.add(l);
  }
  if (highlights.length) {
    const h = new THREE.LineSegments(concatPositions(highlights), materials.highlight);
    h.renderOrder = 2;
    group.add(h);
  }

  /* Intermediates are not kept. */
  for (let i = 0; i < pieces.length; i++) pieces[i].geom.dispose();
  for (let i = 0; i < fills.length; i++) fills[i].dispose();
  for (let i = 0; i < lines.length; i++) lines[i].dispose();
  for (let i = 0; i < highlights.length; i++) highlights[i].dispose();

  return group;
}

/* --------------------------------------------------------------------------
   Shared materials and shared pointer state
   -------------------------------------------------------------------------- */

const materials = {
  fill: new THREE.MeshBasicMaterial({
    color: COL_FILL,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1
  }),
  line: new THREE.LineBasicMaterial({ color: COL_LINE }),
  highlight: new THREE.LineBasicMaterial({ color: COL_HI })
};

let pointerX = 0;
let pointerY = 0;

/* --------------------------------------------------------------------------
   Loop. One requestAnimationFrame for every viewport on the page.
   -------------------------------------------------------------------------- */

const views = [];
let rafId = 0;
let lastTime = 0;

function anyVisible() {
  for (let i = 0; i < views.length; i++) if (views[i].visible) return true;
  return false;
}

function startLoop() {
  if (rafId || reduceMotion) return;
  lastTime = 0;
  rafId = window.requestAnimationFrame(tick);
}

function stopLoop() {
  if (!rafId) return;
  window.cancelAnimationFrame(rafId);
  rafId = 0;
}

function syncLoop() {
  if (!document.hidden && anyVisible()) startLoop();
  else stopLoop();
}

function tick(now) {
  rafId = window.requestAnimationFrame(tick);
  const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0.016;
  lastTime = now;
  for (let i = 0; i < views.length; i++) {
    const v = views[i];
    if (v.visible) step(v, dt);
  }
}

function step(v, dt) {
  v.azimuth += SPIN_RATE * dt;
  v.part.rotation.y = v.azimuth;

  const k = Math.min(1, TILT_EASE * dt);
  v.tiltX += (pointerY * TILT_MAX - v.tiltX) * k;
  v.tiltZ += (-pointerX * TILT_MAX - v.tiltZ) * k;
  v.root.rotation.x = v.tiltX;
  v.root.rotation.z = v.tiltZ;

  v.renderer.render(v.scene, v.camera);
}

/* --------------------------------------------------------------------------
   Framing. Distance is derived from the part's own bounds so every seed and
   every container aspect ratio is composed the same way.
   -------------------------------------------------------------------------- */

function frameCamera(v) {
  const w = v.el.clientWidth;
  const h = v.el.clientHeight;
  if (!w || !h) return false;

  const aspect = w / h;
  const halfV = Math.tan((FOV * Math.PI) / 360);
  const needH = v.fitH / halfV;
  const needW = v.fitW / (halfV * aspect);
  const dist = Math.max(needH, needW);

  v.camera.aspect = aspect;
  v.camera.position.set(0, dist * ELEVATION, dist);
  v.camera.lookAt(0, 0, 0);
  v.camera.updateProjectionMatrix();
  return true;
}

function resize(v) {
  const w = v.el.clientWidth;
  const h = v.el.clientHeight;
  if (!w || !h) return;
  v.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, DPR_CAP));
  v.renderer.setSize(w, h, false);
  frameCamera(v);
  if (reduceMotion || !v.visible) v.renderer.render(v.scene, v.camera);
}

/* --------------------------------------------------------------------------
   Viewport construction
   -------------------------------------------------------------------------- */

const boundsBox = new THREE.Box3();
const boundsSize = new THREE.Vector3();
const boundsCenter = new THREE.Vector3();

function createView(el) {
  const canvas = el.querySelector("canvas");
  if (!canvas) return null;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
      powerPreference: "low-power"
    });
    if (!renderer.getContext()) return null;
  } catch (err) {
    return null;
  }

  renderer.setClearAlpha(0);
  renderer.sortObjects = true;

  const code = el.getAttribute("data-code") || DEFAULT_CODE;
  const part = buildPart(paramsFor(code), materials);

  /* Recentre on the part's own bounds, then record the extents used for
     framing. Horizontal extent uses the larger of x/z because the part
     turns about its axis. */
  boundsBox.setFromObject(part);
  boundsBox.getSize(boundsSize);
  boundsBox.getCenter(boundsCenter);
  part.position.set(-boundsCenter.x, -boundsCenter.y, -boundsCenter.z);

  const radius = Math.max(boundsSize.x, boundsSize.z) / 2;
  const halfHeight = boundsSize.y / 2;

  const root = new THREE.Group();
  root.add(part);

  const scene = new THREE.Scene();
  scene.add(root);

  const view = {
    el: el,
    canvas: canvas,
    renderer: renderer,
    scene: scene,
    camera: new THREE.PerspectiveCamera(FOV, 1.5, 0.1, 100),
    root: root,
    part: part,
    azimuth: reduceMotion ? STATIC_AZIMUTH : 0.35,
    tiltX: 0,
    tiltZ: 0,
    visible: false,
    /* Margins: the view looks down on the part, so the projected height is
       taller than the part is. */
    fitW: radius * 1.16,
    fitH: (halfHeight * 0.94 + radius * 0.38) * 1.1
  };

  part.rotation.y = view.azimuth;
  view.camera.position.set(0, 3, 8);

  if (!frameCamera(view)) {
    /* Container has no layout yet: fall back to a sane distance and let the
       ResizeObserver correct it. */
    view.camera.position.set(0, 3, 8);
    view.camera.lookAt(0, 0, 0);
  }

  return view;
}

function activate(el, view, label) {
  view.canvas.setAttribute("role", "img");
  view.canvas.setAttribute("aria-label", label);
  view.canvas.removeAttribute("aria-hidden");

  const img = el.querySelector("img");
  if (img) img.hidden = true;

  el.classList.add("is-live");
}

/* --------------------------------------------------------------------------
   Boot
   -------------------------------------------------------------------------- */

function readCourseCode() {
  try {
    const raw = new URLSearchParams(window.location.search).get("c");
    if (!raw) return DEFAULT_CODE;
    const code = raw.trim().toUpperCase();
    return CODES.indexOf(code) === -1 ? DEFAULT_CODE : code;
  } catch (err) {
    return DEFAULT_CODE;
  }
}

function init() {
  if (forcedOff) return;

  const nodes = document.querySelectorAll("[data-scene]");
  if (!nodes.length) return;

  const courseCode = readCourseCode();

  for (let i = 0; i < nodes.length; i++) {
    const el = nodes[i];
    if (el.getAttribute("data-scene") === "course") {
      el.setAttribute("data-code", courseCode);
      const tag = el.querySelector("[data-v3d-code]");
      if (tag) tag.textContent = courseCode;
    }

    const view = createView(el);
    if (!view) continue;

    const code = el.getAttribute("data-code") || DEFAULT_CODE;
    views.push(view);
    activate(
      el,
      view,
      "Wireframe viewport of the reference machined assembly for course " +
        code +
        ": bolted flange, radial fins, hub and spindle."
    );
    resize(view);
  }

  if (!views.length) return;

  /* Pause when offscreen. */
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      function (entries) {
        for (let i = 0; i < entries.length; i++) {
          const entry = entries[i];
          for (let j = 0; j < views.length; j++) {
            if (views[j].el === entry.target) {
              views[j].visible = entry.isIntersecting;
              break;
            }
          }
        }
        syncLoop();
      },
      { rootMargin: "64px" }
    );
    for (let i = 0; i < views.length; i++) io.observe(views[i].el);
  } else {
    for (let i = 0; i < views.length; i++) views[i].visible = true;
  }

  if ("ResizeObserver" in window) {
    const ro = new ResizeObserver(function (entries) {
      for (let i = 0; i < entries.length; i++) {
        for (let j = 0; j < views.length; j++) {
          if (views[j].el === entries[i].target) {
            resize(views[j]);
            break;
          }
        }
      }
    });
    for (let i = 0; i < views.length; i++) ro.observe(views[i].el);
  } else {
    window.addEventListener("resize", function () {
      for (let i = 0; i < views.length; i++) resize(views[i]);
    });
  }

  document.addEventListener("visibilitychange", syncLoop);

  if (!reduceMotion) {
    window.addEventListener(
      "pointermove",
      function (e) {
        pointerX = (e.clientX / window.innerWidth) * 2 - 1;
        pointerY = (e.clientY / window.innerHeight) * 2 - 1;
      },
      { passive: true }
    );
    syncLoop();
  } else {
    /* One static frame, held. */
    for (let i = 0; i < views.length; i++) {
      views[i].visible = true;
      views[i].renderer.render(views[i].scene, views[i].camera);
    }
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
