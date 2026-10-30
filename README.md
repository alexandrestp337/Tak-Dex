# PokéTact — Android-first offline prototype

This is a first working shell for the PokéTact project. It is an installable-web-app (PWA) prototype, not yet a Play Store APK.

## Run locally
Serve this folder from a local web server (service workers require HTTPS or localhost). For example:
`python -m http.server 8080`
Then open `http://localhost:8080`.

On Android, deploy the folder to an HTTPS host, open it in Chrome, then use **Add to Home screen / Install app**.

## Current prototype features
- Create multiple teams and choose a game/version.
- Store teams locally in browser storage.
- Add/edit up to six Pokémon, levels, types and moves.
- Light/dark theme.
- Offline shell caching.
- Basic incoming type-effectiveness preview.
- Demonstration evolution actions for a small set of evolution lines.

## Important limitations
This is intentionally a prototype. It does NOT yet contain the complete Pokémon database, full game-specific evolution logic, complete move learnsets, sprites, or the Smogon damage engine. The demo evolution/type data must not be treated as authoritative. In particular, some listed type combinations reflect modern types and need generation-aware handling.

## Next implementation milestones
1. Integrate curated, versioned local game data and source attribution.
2. Add generation-aware type charts (Gen 1–6, Gen 7+).
3. Integrate `@smogon/calc` and package its data locally for full damage ranges.
4. Add move-by-move offense/defense matchup cards and recommended switch-ins.
5. Replace demo evolution map with per-version evolution requirements and move-preservation rules.
6. Add IndexedDB, import/export backup and automated validation tests.

## Data and engine references
- PokéAPI: https://pokeapi.co/docs/v2
- Pokémon Showdown damage calculator: https://github.com/smogon/damage-calc
- `@smogon/calc` is MIT-licensed; preserve upstream license notices when bundling.
