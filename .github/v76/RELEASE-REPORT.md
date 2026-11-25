# V76 web development and automated test report

The candidate started from the annotated `V75-STABLE` tag at commit `3a97d5acbc4d434e3fb24aaced1dad5534188531`. Both `Development` and `main` pointed there at verification. About displayed V74 in that baseline. The dedicated work branch is `v76-development`. GitHub Pages uses `main` at the repository root. This candidate is for draft review against `Development`.

## Stage results

| Stage | Changes and regression gates |
| --- | --- |
| DEV1 | Implemented the read-only parser, saved-party bridge, imported stat calculation, and survival-aware 6v6 model. Passed 13 Node checks with synthetic saves and both Chromium smoke widths before DEV2. |
| DEV2 | Reworked Battle and 6v6 layouts, added stat controls and linked moves to Move Checker. Re-ran the 13 Node checks and 412 px and 1280 px smoke checks before DEV3. |
| DEV3 | Added Emerald encounter navigation, group viewport fitting, fullscreen details, compact map controls and dropdown cleanup. Re-ran the same stage gates before the full release suite. The release hardening pass added cartridge-backed Unova trainer corrections and Dex behavior when evolution lookup is unavailable. |
| DEV4 | Compared four public Gen V saves against PKTool. Expanded Chromium coverage of import, navigation, both stat editors, persistence, maps, and offline reload. Added automated coverage for historical moves and types, trainer entries, and cache manifest files. |

## Final automated coverage

| Check | Result | Scope |
| --- | --- | --- |
| Synthetic parser | Pass | All four titles, shuffled encrypted records, shiny, form, EVs/IVs, PP, party stats, corrupted primary fallback, blank format rejection and counter wraparound. |
| Public save reference comparison | Pass | 4 raw saves and 24 party slots. Compared species, forms, level, HP and stats, IVs, EVs, nature, item, ability, shiny, moves and PP/PP Ups against an independent PKTool build. Both the synthetic and public tests verify input bytes are preserved. |
| Battle model | Pass | First-hit lethal prevention, Speed reversal, ties, HP gating, Revenge and Avalanche with misses, Payback and Assurance context, Hyper Beam versus Overheat, and full-HP survival items and abilities. |
| Stat calculation | Pass | Imported stat baselines, offsets when leveling, BW2 underlying stat level, mobile tap-to-select, both sides' step buttons, player offset and level persistence. |
| Historical references | Pass | Assurance power in Gen V and Gen VI, Gen V Steel resistance to Ghost, verified Black and Black 2 spot checks. |
| Browser save sync | Pass | Real Chromium file picker, saved-game data, rejection and no-op behavior, changed snapshot, retained Battle and fullscreen Map state. |
| Browser navigation | Pass | Regular Battle layout, 6v6 expanded moves, Move Checker round-trips, Pokédex learnset scroll and equal action button sizes. |
| Browser map and offline | Pass | Emerald multi-pin viewport fit at 412 px, changing fullscreen selection, clearing details, keeping map viewport during save update, offline cold reload with saved party and bundled references. |
| Baseline comparison | Pass | V75-STABLE and candidate at 412 px and 1280 px. Navigation, footer credit, viewport overflow check, historical move/type values. |
| Android WebView, native storage and Samsung phone | Untested | Linux Chromium supplied the browser evidence. Android V9 is a separate post-acceptance stage. |

The Node suite comprises **21 checks**, including four public fixtures. Chromium 156 ran the baseline and candidate smoke harnesses at 412 px and 1280 px and the detailed touch-enabled candidate scenario at 412 × 860 px. No uncaught page errors occurred in those runs. The service-worker manifest was checked against the page URLs and local files. Existing database records, map artwork, and feedback configuration were checked for byte-level preservation by the branch diff.

## Reproduction

Run the Node tests with `TAKDEX_REFERENCE_SAVES` pointing to a directory containing the four named 512 KiB saves listed in `reference.json`. Without that setting, the public fixture cases are skipped. The raw saves are omitted from the repository. `pktool-reference.cpp` is the read-only comparison driver used with PKTool's portable core.

```sh
TAKDEX_REFERENCE_SAVES=/path/to/reference-saves node --test .github/v76/*.test.cjs
node .github/v76/smoke.cjs http://127.0.0.1:8764
node .github/v76/smoke.cjs http://127.0.0.1:8765
node .github/v76/browser.cjs http://127.0.0.1:8765
```

Serve an untouched V75-STABLE checkout on port 8764 and the candidate on 8765 with a local static server. Browser scripts resolve `playwright-core` and default to `/usr/bin/chromium`. Set `CHROMIUM_PATH` for other Chromium installations.

## Incomplete items and assumptions

- The web picker reads raw 512 KiB exports. Emulator state containers, persistent file grants, and resume detection require a native provider. A successful import describes the last saved party. Unsaved emulator HP, switches, stat stages and moves are outside the snapshot.
- Read validation covers the footer, trainer block, party block and each Pokémon in the selected bank. Other boxes and game blocks are outside the import. Public saves exercised six occupied slots per title. Additional retail fixtures are needed for more non-default forms, partial parties and pre-starter saves.
- Trainer IV difficulty and the Challenge level behavior were investigated. The reference export verifies move IDs, items and underlying levels for matching entries. It omits per-Pokémon IV difficulty, EVs and natures. Unsupported trainer stat profiles retain the labeled 15-IV neutral estimate or the existing 30-IV Challenge estimate and can be adjusted. The exact Cynthia/Lucario percentages require the user's actual stats and confirmed opponent setup.
- Rankings are estimates across two turns with three representative damage rolls, fixed entered move choices, and supported mechanics. AI move selection, switching, doubles turn interactions, critical hits, damage flooring across all generations, held-item and ability edge cases, and all remaining conditional effects require further coverage. Some cosmetics retain a raw form index with base-species presentation. Evolution requirements are available through the existing checker when its reference can be fetched or was previously cached.
- The Emerald map is a schematic based on Hoenn map-section coordinates. Locations without matched coordinates remain encounter records. Existing Sinnoh and Unova visuals retain their original data. Extended mobile and visual acceptance remains necessary, especially long movesets, extreme text scaling, double Battle, and WebView keyboard behavior.
- The web bridge entry point is `window.takDexSaveSync.synchronize({teamId, bytes, modifiedAt})`. A native provider should call it with a local raw byte buffer and the file timestamp after the user authorizes access. It resolves to `updated`, `unchanged`, `stale`, or `superseded`, and rejects invalid snapshots. Validate native timing, Android V8 identity and signing, storage-grant persistence, emulator switching, context menus, keyboard behavior, Hold to Compare, the floating bubble, export, and offline behavior on the Galaxy S25 Ultra.

## Original Move Checker proposal

The correction pass below supersedes this proposal. The original plan was to use a single result identity per move and resolve machine numbers within the selected game. Include All Moves, TM and HM filters. Keep the current move-detail and generation history views. Append the existing acquisition and map actions when verified records exist, and reuse the team strip with separate direct compatibility and after-evolution indicators. Retain both More menu entries during acceptance, with the TM/HM entry able to preselect its filter after approval. Compare all existing search, offline, acquisition, and compatibility flows before retiring the separate TM/HM Checker.

## References

- Generation V layouts, offsets, block cryptography and indexed names. [PKHeX source at a5311f9](https://github.com/kwsch/PKHeX/tree/a5311f9f55a84376fd2e2499b25d9fb9640d9f2d)
- Independent party decoding and checksum reference. [PKTool source at dbb6db0](https://github.com/pioacosta/PKTool/tree/dbb6db01486287ebde05aa1ead803aa9279f5a87)
- Four raw saves used in the automated corpus. [RoC's PC public saves at 49ea657](https://github.com/ReignOfComputer/RoCs-PC/tree/49ea65771b8777fc4f4098c36c125bf1af039d4f)
- Generation V save block structure. [Project Pokémon B2W2 documentation](https://projectpokemon.org/docs/gen-5/b2w2-save-structure-r72/)
- Hoenn map-section coordinates. [pret/pokeemerald at 8cf5188](https://github.com/pret/pokeemerald/blob/8cf518839e529eeb2477905ede1df7213ac134b8/src/data/region_map/region_map_sections.json)
- English cartridge trainer, item and move evidence. [PokeDaisy Gen V guide generator at 717f4f4](https://github.com/lidor30/pokedaisy/blob/717f4f49979f4aa5c4c8f4cd64638a0fa935d844/scripts/gen_gen5_guide.py)
- Trainer difficulty format and related investigation. [TrainerTyrant](https://github.com/ThirdLemon/TrainerTyrant) · [BW2 PWT research](https://github.com/DavidAGInnovation/bw2-pwt-research)

## V76 correction pass

The correction pass continues draft PR #1 on `v76-development`. The original acceptance recorded 3 Pass, 0 Fail and 5 Need work. Its installation, saved-data and import results carried forward into this pass.

- Battle and 6v6 use the V75-STABLE gold treatment for selected and unselected recommendations and one move renderer. The renderer keeps pure type effectiveness for color and combines it with STAB for the displayed multiplier.
- Regular Battle shows type-based threats, known ability immunities, base offensive stats and an estimated turn-order badge for clearly separated Speeds. 6v6 uses shared move rows, two-tone damage bars, and compact warnings for relevant modeled outcomes. Its underlying survival model remains the same.
- The stat editor shares the level editor's horizontal controls. The Pokédex action buttons use matching dimensions and icon sizes. Team Builder and Team Planner use the same expanded-panel outline.
- Move Checker retains its general search, game-specific details, effect text, historical data, and By Type workflow. The TM and HM catalogs mount the existing machine index, acquisition guide and compatibility workflows inside the same tool. The old menu entry was removed after the integrated flow passed. Compatibility retains exact game method labels, machine numbers and evolution indicators. The offline shell was versioned for the updated scripts and CSS.
- Map controls stay inside their toolbar in regular and fullscreen layouts. The accepted Hoenn schematic and fullscreen location details remain available.

### Correction regression results

Chromium correction tests exercise 320, 412 and 1280 px with real layout geometry. They check baseline gold styling, 1.5×/3×/0.75× display and damage arithmetic, defensive tones, estimated Speed and close-match suppression, eight aligned move cards, a lethal Hyper Beam warning and alternative team recommendation, long labels beside badges, horizontal stat controls, expanded-panel border parity, name and machine number search, direct and evolution compatibility, contextual map return and normal/fullscreen toolbar bounds. The existing 21 Node checks and detailed 412 px browser suite were rerun for save, battle, persistence and offline regressions.

```sh
TAKDEX_REFERENCE_SAVES=/path/to/reference-saves node --test .github/v76/*.test.cjs
node .github/v76/browser.cjs http://127.0.0.1:8775
TAKDEX_SCREENSHOTS=.github/v76/screenshots node .github/v76/corrections.cjs http://127.0.0.1:8775
```

Screenshots from Chromium are available for [mobile 6v6](screenshots/battle-412.png), [desktop 6v6](screenshots/battle-1280.png) and the [fullscreen mobile map](screenshots/map-412.png).

### Remaining limits

The two-turn battle estimates, exact trainer stats, and Android V9 validation limits above still apply. Chromium tested representative machine and compatibility flows. Complete enumeration across every game, move, species, ROM and dataset is outside the tested matrix. When evolution data is incomplete, unresolved compatibility stays unknown. Quick Battle omits the Speed badge on close comparisons and estimates turn order at comparable levels and training. The accepted Emerald schematic remains. No phone or Android WebView was used.

## Third correction pass

This pass starts at `8b7a975`. The second acceptance approved the gold recommendation highlight, stat steppers, unified Move Checker, and fullscreen map controls. The changes target the remaining four acceptance areas.

- Battle and 6v6 show one turn-order indicator below the types and ability. Green identifies the player's Pokémon, red identifies the opponent, and neutral text describes close comparisons, ties or uncertain order. The warning box keeps specific threats and better team alternatives.
- The approved move card layout and aligned 6v6 rows use the original V75-STABLE 3 px effectiveness edges and white type badges with black shadow. Effectiveness colors use the ability-adjusted multiplier before STAB.
- Battle rankings still use the two-turn model. Move cards use first-turn KO probability and the probability of a KO after two landed attacks. First-turn OHKO labels take precedence, and charged moves are distinguished from two-hit sequences. Incomplete opponent information or a lethal hit before execution can limit the display to damage potential.
- Team Planner omits the Pokédex shortcut. Team Builder keeps its button. The Pokédex action pair spans the hero grid and centers within the card with its prior button and icon dimensions.

### Verification

- All 25 Node checks passed, including the four public save reference cases. The new KO assertions cover guaranteed and probabilistic OHKOs, damage rolls, misses, preemptive KOs, genuine 2HKOs, charge, recharge and conditional power.
- Chromium ran the targeted correction suite at 320, 412 and 1280 px. The browser compared computed effect-edge width/color and the Electric badge's foreground, shadow, weight and background directly against V75-STABLE. It also checked turn-order placement and tone, neutral STAB, an ability immunity, aligned move rows, a lethal Thunderbolt at 10% actual OHKO odds, the zero-execution case, and the edited shortcut and button positions.
- The existing save-import, synchronization, offline and mobile/desktop smoke checks were rerun. The acceptance matrix continues to cover gold highlighting, the unified checker, stat steppers and fullscreen map toolbar.

[Battle at 412 px](screenshots/quick-battle-412.png) · [Battle at 1280 px](screenshots/quick-battle-1280.png) · [6v6 at 412 px](screenshots/battle-412.png) · [6v6 at 1280 px](screenshots/battle-1280.png)

The probability labels describe the modeled moves and damage rolls. The earlier trainer-stat and battle-model limits still apply. Native Android V9 and hardware validation remain a subsequent stage.
