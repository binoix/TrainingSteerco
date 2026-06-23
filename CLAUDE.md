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

Everything lives in `src/main.js` (~400 lines), structured as: static data → state → pure scoring functions → render → event binding → initial `render()` call at the bottom of the file. There is no framework; `app.innerHTML` is fully re-rendered on every state change.

- **`techniques`** — the in-code ATT&CK dataset: ~29 representative techniques (2 per ATT&CK Enterprise tactic), each with a stable `id` (real ATT&CK ID, e.g. `T1566`), `tactic`, `name`, `dataSources` (log sources needed to detect it), and a `weight` map (`ransomware`/`bec`/`apt`/`insider`, 1–5) expressing relevance per threat scenario.
- **`state.coverage`** — per-technique status (`blind` | `partial` | `covered`), the only persistent-in-memory user input besides `state.context` and `state.threatProfile`. Cycling through statuses happens by clicking a heatmap cell (`statusOrder` defines the cycle order).
- **Scoring is threat-relative, not absolute**: `priorityScore(technique)` = `weight[selectedThreatProfile] × gapFactor(status)`. Changing `state.threatProfile` re-weights every technique and re-sorts the action plan — this is the central mechanic of the app, more important than any individual technique's data.
- **`weightedCoveragePct()`** drives the hero "couverture pondérée" number; it's a weighted average over the *currently selected threat profile only*, not a global score.
- Render pipeline: `render()` rebuilds the whole DOM tree (hero, context inputs, threat-profile picker, heatmap grouped by tactic via `tacticColumn`/`techniqueCell`, the action list, and the steering-committee summary), then calls `bindEvents()` to (re)attach listeners — every interaction triggers a full `render()`.

When adding a technique or threat scenario, follow the structural rules already encoded in `AGENTS.md` (kept in sync with this file): techniques need a real ATT&CK `id`, a `tactic` matching an existing heatmap column, realistic `dataSources`, and a `weight` entry for every threat profile; adding a new threat profile means updating `threatProfiles`, every technique's `weight` map, and the profile picker UI.

## Verification

No automated tests exist. Before considering a change done:
1. `node --check src/main.js`
2. `python3 -m http.server 5173` and manually confirm in a browser: threat-profile switching re-sorts the action plan and changes the coverage %, clicking a heatmap cell cycles its status color, and the JSON export button produces valid JSON.

## Deployment

The app is served as-is via GitHub Pages (`index.html` at repo root, `.nojekyll` present to skip Jekyll processing). Keep asset paths relative and avoid introducing client-side routing or anything requiring server-side configuration, since there is no backend behind GitHub Pages.
