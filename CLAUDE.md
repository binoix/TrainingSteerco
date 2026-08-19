# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

TrainingSteerco is a static, dependency-free front-end MVP that maps SOC (Security Operations Center) detection coverage onto the MITRE ATT&CK matrix, weighted by a selected threat scenario (ransomware, BEC, APT, insider). It outputs a prioritized action plan and a steering-committee-ready summary.

There is no backend, no bundler, no npm dependencies (`package.json` was deliberately removed — see git history). The app is three files: `index.html`, `src/main.js`, `src/styles.css`.

## Commands

```bash
python3 -m http.server 5173    # serve the app at http://localhost:5173/
node --check src/main.js       # validate JS syntax (the only "build" step)
```

There is no test suite and no linter configured. Manual verification in a browser is the only validation path — see "Verification" below.

## Architecture

Everything lives in `src/main.js` (~425 lines), structured as: static data → state → persistence → pure scoring functions → render → event binding → initial `loadState()` / `render()` calls at the bottom of the file. There is no framework; `app.innerHTML` is fully re-rendered on every state change.

- **`techniques`** — the in-code ATT&CK dataset: 29 representative techniques covering all 14 ATT&CK Enterprise tactics (2 per tactic, except Initial Access which has 3), each with a stable `id` (real ATT&CK ID, e.g. `T1566`), `tactic`, `name`, `dataSources` (log sources needed to detect it), and a `weight` map (`ransomware`/`bec`/`apt`/`insider`, 1–5) expressing relevance per threat scenario.
- **`state.coverage`** — per-technique status (`blind` | `partial` | `covered`), alongside `state.context` and `state.threatProfile`. Cycling through statuses happens by clicking a heatmap cell (`statusOrder` defines the cycle order).
- **Persistence** — the whole `state` is mirrored to `localStorage` under `trainingsteerco-state`. `saveState()` is called explicitly from each of the three mutation sites in `bindEvents()` (not from `render()`, because the context inputs deliberately do *not* re-render, to avoid stealing focus mid-typing). `loadState()` **validates every value before adopting it** — unknown threat profiles, unknown statuses and techniques no longer in the dataset are discarded — so a stale or corrupted store can never break rendering or scoring. `resetState()` clears the store and rebuilds the defaults (`defaultContext`, `defaultThreatProfile`, `buildInitialCoverage()`).
- **`escapeHtml()`** — the render path is string interpolation, so user-supplied values must be escaped. `state.context` reaches the DOM in exactly one place (`contextInput`); everything else interpolated is static in-file data. Escape any *new* user-controlled value you interpolate.
- **Scoring is threat-relative, not absolute**: `priorityScore(technique)` = `weight[selectedThreatProfile] × gapFactor(status)`. Changing `state.threatProfile` re-weights every technique and re-sorts the action plan — this is the central mechanic of the app, more important than any individual technique's data.
- **`weightedCoveragePct()`** drives the hero "couverture pondérée" number; it's a weighted average over the *currently selected threat profile only*, not a global score.
- Render pipeline: `render()` rebuilds the whole DOM tree (hero, context inputs, threat-profile picker, heatmap grouped by tactic via `tacticColumn`/`techniqueCell`, the action list, and the steering-committee summary), then calls `bindEvents()` to (re)attach listeners — every interaction triggers a full `render()`. Because the tree is destroyed on each render, the heatmap click handler **re-focuses the activated cell afterwards**; without it keyboard users are thrown back to the top of the page.
- Accessibility invariants: status is conveyed by a visible `.technique-status` label, not by colour alone; relevance (a coloured border) is carried in each cell's `aria-label`; the three status background colours are paired with text colours meeting WCAG AA (4.5:1). Keep all three properties when touching `techniqueCell` or the `.status-*` rules.

When adding a technique or threat scenario, follow the structural rules already encoded in `AGENTS.md` (kept in sync with this file): techniques need a real ATT&CK `id`, a `tactic` matching an existing heatmap column, realistic `dataSources`, and a `weight` entry for every threat profile; adding a new threat profile means updating `threatProfiles`, every technique's `weight` map, and the profile picker UI.

## Verification

No automated tests exist. Before considering a change done:
1. `node --check src/main.js`
2. `python3 -m http.server 5173` and manually confirm in a browser: threat-profile switching re-sorts the action plan and changes the coverage %, clicking a heatmap cell cycles its status color, and the JSON export button produces valid JSON.

## Deployment

The app is served as-is via GitHub Pages (`index.html` at repo root, `.nojekyll` present to skip Jekyll processing). Keep asset paths relative and avoid introducing client-side routing or anything requiring server-side configuration, since there is no backend behind GitHub Pages.
