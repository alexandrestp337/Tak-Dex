# Tak-Dex

**Plan · Train · Battle**

[Open Tak-Dex](https://alexandrestp337.github.io/Tak-Dex/)

Tak-Dex is a free, unofficial Pokémon team builder, battle calculator and playthrough companion. It combines team planning, generation-specific matchup analysis, move and evolution reference information, and interactive region maps in one mobile-friendly web app. Saved teams and plans stay on the device.

> **V77.2.1-STABLE.** Save synchronization recognizes acquired Pokémon while preserving the selected team plan. [Release notes](.github/v77/REPORT.md#v7721-stable-release)

## Tools

| Tool | Features |
| --- | --- |
| Team Builder | Save up to six Pokémon per team, select game, moves, nickname and actual ability; evolve Pokémon, inline single-Pokémon editor with unsaved roster preview, move PWR/ACC and explicit Save, import/export team JSON. |
| Team Planner | Separate current and planned teams, game-specific goal moves, coverage-preserving recommendations and legal alternatives, replacement candidates, acquisition timing where verified, HM planning, actual/planned League coverage. |
| Battle | Base-stat matchup and attack scoring, type effectiveness, STAB, known abilities, conditional power and move reliability. |
| 6v6 Battle Planner | Saved or custom teams, trainer presets, save/rename custom opponents with one Save action, manual levels, held items, abilities and final stat adjustments, estimated damage, attack ranking and turn order. |
| Pokédex | Search Pokémon, view types, abilities, base stats, evolution paths, learnsets, encounters and suggested moves. |
| Comparison | Compare two Pokémon and their evolution branches side by side. |
| Move Checker | Move details, historical stats, game-specific learning methods, By Type filters and evolution compatibility. |
| TM/HM Compatibility | Team compatibility indicators for current species and eligible evolutions, machine locations where indexed. |
| Interactive Maps | Platinum, Black, White, Black 2 and White 2. Search indexed locations, Pokémon, items, TM/HMs, tutors, NPCs, services and story events. Zoom, fullscreen and linked reference tools. |
| Offline Data | Download and manage game reference and artwork packs. Initial downloads need connectivity; incomplete packs and missing reference records are reported. |

## Bundled database

Version-pinned PokéAPI CSV data supplies core Pokémon, move, learnset, machine and encounter records. The source snapshot contains 88,755 encounter rows, 574,073 learnset rows and 1,841 machine assignments across supported game groups. The published catalog excludes the unobtainable FireRed/LeafGreen HM08 Dive assignment and its 76 machine-learnset rows (573,997 learnset rows and 1,840 machine assignments remain). BDSP and Scarlet/Violet have no encounter rows in this snapshot; lack of records is not evidence of unavailability. Species/evolution details, artwork, and trainer data still use existing sources and offline downloads. See `db74/LICENSE-PokeAPI.md` for the data source license.

## Supported game selections

34 game selections: Red, Blue, Yellow; Gold, Silver, Crystal; Ruby, Sapphire, Emerald, FireRed, LeafGreen; Diamond, Pearl, Platinum, HeartGold, SoulSilver; Black, White, Black 2, White 2; X, Y, Omega Ruby, Alpha Sapphire; Sun, Moon, Ultra Sun, Ultra Moon; Sword, Shield, Brilliant Diamond, Shining Pearl; Scarlet, Violet.

Maps are currently available for Platinum and the four Unova versions. Normal and Challenge Mode first-challenge and League rematch presets for Black 2 / White 2 are included. Challenge presets estimate stats using the underlying Normal Mode level and 30 IVs; nature and EVs remain estimates. Other trainer rematches, progression prerequisites and encounter/search coverage are not exhaustive. Battle scores and damage are estimates, not a complete battle simulator. Pokémon form availability is generation-filtered; game-specific exceptions remain subject to verification.

## Getting started

1. Open the website and create a Team Builder team with the game you are playing.
2. Add Pokémon, moves and actual abilities; open Team Planner for goals, acquisition, HM and League coverage.
3. Use Battle for fast type matchups or More → 6v6 for detailed opponent presets and level-based estimates.
4. Use Pokédex, Move Checker and Maps for in-game reference. Tap linked entries to open the corresponding tool. Contextual Back in Pokédex restores the originating screen.
5. Export your team JSON before clearing browser storage or changing devices. Offline data and teams are stored locally; deleting browser storage can remove both.

## Development and installation

Vanilla HTML, CSS and JavaScript, served from GitHub Pages. Keep all existing assets when applying replacement archives. Test the Development branch via Live Server or `python -m http.server 8000`; do not run the app directly as a `file://` page if testing service workers. Use a secure origin (HTTPS or localhost) for offline functionality.

Android builds use Capacitor and Android Studio. Preserve the existing package ID `io.github.alexandrestp337.takdex` and original signing key when updating. The Android V7 source includes a floating shortcut and return-to-emulator workflow; V74 native customization and APK validation are still pending. After replacing web assets in the configured web directory, use `npx cap sync android` and build/sign in Android Studio. A web replacement ZIP is not an APK.

## Feedback and privacy

More → Send feedback is designed to submit bug reports, feature requests and suggestions directly in the app without exposing the developer's recipient email. It requires a configured Formspree form identifier in `feedback-config.js` (configure the public form ID locally; never commit private credentials). Until configured, sending is disabled. The category, message, optional reply email and app version go to the external delivery service only when Send is pressed. Do not include private credentials or sensitive information.

## Sources and credits

- [PokéAPI](https://pokeapi.co/) — Pokémon, moves, sprites and version-specific reference data.
- [Pokémon Database](https://pokemondb.net/), [Bulbapedia](https://bulbapedia.bulbagarden.net/) and [Serebii](https://www.serebii.net/) — game-specific mechanics, trainer, move and location reference checks.
- [MewMaps](https://www.mewmaps.org/) — approved original Unova region map artwork for Black, White, Black 2 and White 2. Preserve source attribution and original image resolution.
- Pokémon and associated names, images and trademarks belong to their respective owners. This is an unofficial fan project, not affiliated with Nintendo, Game Freak or The Pokémon Company.

**Developed by WHOASP**
