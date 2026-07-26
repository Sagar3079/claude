# Claude Code Skills Pack

A curated `.claude/` setup that loads **52 skills**, **4 agents**, **3 MCP servers**, and **2 plugin marketplaces** into any Claude Code session opened in this repo.

## What's installed

### 🦸 Superpowers — [obra/superpowers](https://github.com/obra/superpowers)
Jesse Vincent's software-development methodology. 14 skills: `brainstorming`, `test-driven-development`, `systematic-debugging`, `writing-plans`, `executing-plans`, `requesting-code-review`, `receiving-code-review`, `subagent-driven-development`, `dispatching-parallel-agents`, `using-git-worktrees`, `finishing-a-development-branch`, `verification-before-completion`, `writing-skills`, `using-superpowers`.

### 🎨 Design & UI

| Source | Skills |
|---|---|
| [emilkowalski/skills](https://github.com/emilkowalski/skills) — Emil Kowalski (Sonner, Vaul, animations.dev) | `emil-design-eng`, `animation-vocabulary`, `apple-design`, `review-animations`, `improve-animations`, `find-animation-opportunities`, `pick-ui-library` |
| [pbakaus/impeccable](https://github.com/pbakaus/impeccable) — Paul Bakaus | `impeccable` (18 interconnected design rules, 7 pillars) + 4 agents (`impeccable-finish-reviewer`, `impeccable-documenter`, `impeccable-asset-producer`, `impeccable-manual-edit-applier`) |
| [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) | `taste-skill` (flagship v2), `redesign-skill`, `image-to-code-skill`, `imagegen-frontend-web`, `imagegen-frontend-mobile`, `minimalist-skill`, `brutalist-skill`, `soft-skill`, `stitch-skill`, `output-skill`, `brandkit` (skipped: `taste-skill-v1`, `gpt-tasteskill` — legacy/GPT-specific) |
| [superdesigndev/superdesign-skill](https://github.com/superdesigndev/superdesign-skill) | `superdesign` — AI design canvas. **Requires:** `npm i -g @superdesign/cli@latest && superdesign login` |

### 🔒 Security audit — [trailofbits/skills](https://github.com/trailofbits/skills)
Curated audit set: `audit-context-building`, `codeql`, `semgrep`, `sarif-parsing`, `differential-review`, `entry-point-analyzer`, `insecure-defaults`, `supply-chain-risk-auditor`, `variant-analysis`, `sharp-edges`.
The full 43-plugin marketplace is registered in `.claude/settings.json` — install more with `/plugin install <name>@trailofbits` (e.g. `c-review`, `rust-review`, `zeroize-audit`).

### 🧠 Coding style — [multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills)
`karpathy-guidelines` — Andrej Karpathy's LLM-coding principles: think before coding, simplicity first, surgical changes, goal-driven execution.

### 🌐 Browser & web

| Source | What |
|---|---|
| [microsoft/playwright-mcp](https://github.com/microsoft/playwright-mcp) | `playwright` MCP server (`.mcp.json`) — browser automation via accessibility snapshots |
| [ChromeDevTools/chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp) | `chrome-devtools` MCP server + 6 skills: `chrome-devtools`, `chrome-devtools-cli`, `a11y-debugging`, `debug-optimize-lcp`, `memory-leak-debugging`, `troubleshooting` |
| [firecrawl/firecrawl-mcp-server](https://github.com/firecrawl/firecrawl-mcp-server) | `firecrawl` MCP server — scrape/crawl/search/extract. **Requires:** `FIRECRAWL_API_KEY` env var ([get one](https://firecrawl.dev)) |

### 📝 Docs rendering — [rohansx/glyph](https://github.com/rohansx/glyph)
`glyph` — renders agent-written markdown into polished HTML. **Requires:** `cargo install --git https://github.com/rohansx/glyph glyph-cli` and `npm i -g @mermaid-js/mermaid-cli`.

### 💾 Memory — [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem)
Persistent memory across sessions. Registered as a plugin marketplace and enabled in `.claude/settings.json` — Claude Code will prompt to install it on first launch (or run `/plugin install claude-mem@claude-mem`).

## Post-install (optional)

1. **Firecrawl**: `export FIRECRAWL_API_KEY=fc-...`
2. **Superdesign**: `npm i -g @superdesign/cli@latest && superdesign login`
3. **Glyph CLI**: `cargo install --git https://github.com/rohansx/glyph glyph-cli`
4. **Impeccable auto-check hooks** — impeccable can run its design checker automatically after UI edits. Add this to `.claude/settings.json` yourself (hooks execute commands, so it's opt-in):

```json
"hooks": {
  "PostToolUse": [
    {
      "matcher": "Edit|Write|MultiEdit",
      "hooks": [
        {
          "type": "command",
          "command": "[ ! -f \"${CLAUDE_PROJECT_DIR}/.claude/skills/impeccable/scripts/hook.mjs\" ] || node \"${CLAUDE_PROJECT_DIR}/.claude/skills/impeccable/scripts/hook.mjs\"",
          "timeout": 5
        }
      ]
    }
  ],
  "Stop": [
    {
      "hooks": [
        {
          "type": "command",
          "command": "[ ! -f \"${CLAUDE_PROJECT_DIR}/.claude/skills/impeccable/scripts/hook.mjs\" ] || node \"${CLAUDE_PROJECT_DIR}/.claude/skills/impeccable/scripts/hook.mjs\"",
          "timeout": 30
        }
      ]
    }
  ]
}
```

## Licensing

Skills are vendored from their upstream repos; original licenses are preserved in `.claude/skills-licenses/`. Trail of Bits skills are CC-BY-SA-4.0; most others are MIT. `karpathy` and `glyph` upstreams publish no license file — treat those as all-rights-reserved and check upstream before redistributing.
