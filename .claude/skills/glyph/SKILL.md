# glyph

use when generating a doc the user will read and share — specs, roadmaps,
pr explainers, research reports, plans, strategy docs. trigger words:
"glyph," "spec," "roadmap," "explainer," "report," "plan," "save as a doc."

## file structure
write two files when visuals are needed:
- <name>.md — pure markdown prose
- <name>.glyph.yaml — structured visuals

if no visuals are needed, just write the .md.

## prose source rules
- pure commonmark
- callouts use github admonitions: > [!note], > [!warning], > [!risk], > [!tip]
- visuals are referenced inline as: > [!visual] visual-name
- never embed json, custom directives, or html in the .md (use the sidecar)

## when to use a visual instead of prose

v0.1 ships two visual types: `grid` and `diagram`. for everything else, use plain markdown — it renders fine and stays rag-friendly.

- comparing 3+ options that aren't a flat table → `grid`
- explaining a flow / sequence / state machine → `diagram`
- showing before/after code → fenced code blocks (`diff` visual ships in v0.2)
- structured data → markdown tables (`data` visual ships in v0.2)
- interactive widgets → not yet (`island` ships in v0.2)
- otherwise: plain markdown. lists, tables, blockquotes, code fences first.

## sidecar schema (visuals key)

for canonical json schemas, run:

    glyph visuals --schema grid
    glyph visuals --schema diagram

abbreviated:
- grid: { type: grid, cols: N, cards: [{ title, badge?, body }] }
- diagram: { type: diagram, flow|sequence|state: [[from, to, label], ...] }

### diagram cell quoting
labels in diagram.{flow,sequence,state} that contain
`[`, `]`, `,`, `:`, `#`, or leading whitespace must be quoted strings.
unquoted alphanumeric content is allowed.

## after generating
run `glyph render <file>.md` via bash. mention the rendered .html path.
do not show html content inline.

## editing
- prose changes → edit .md only
- visual changes → edit .glyph.yaml only
- cross-cutting (renaming a thing mentioned in both) → edit both,
  keep names consistent

## bias
prefer plain markdown. visuals are the exception, not the default.
a typical doc has 0-3 visuals, not 6+.

a markdown table is almost always better than a `data` visual. a fenced code
block is almost always better than a `diff` visual. when in doubt, prose.
