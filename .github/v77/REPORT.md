# Tak-Dex Web V77 release candidate

Baseline verified against both `V76-STABLE` and remote `main` at `ddf951b`. This candidate targets review on `v77-development`. Existing save and plan storage keys stay in use. The service worker installs a new shell cache and retains existing data packs and local storage. No migration action is required.

## Scope and verification

| Area | Status | Evidence and limitations |
| --- | --- | --- |
| Generation V save progression | Pass for tested paths | Synthetic BW and B2W2 fixtures cover zero, mid-game, eight badges, story clear and corrupt optional progression blocks. Chromium covered a manual import, a progression-only automatic bridge update with identical party bytes, invalid-file preservation and separate hypothetical progress. Physical saves in the V76 reference suite also pass the parser. |
| Acquisition completeness | Need work | Added early Unova encounter routes, specific gifts and static encounters, version checks, some evolution requirements, and ten additional move-timing records per Unova version. Full evolution-item, seasonal, encounter-specific and hidden-ability acquisition catalog remains incomplete. |
| Shared accessibility | Pass for exercised paths | Team Planner, Pokédex and Maps share encounter timing. Machine acquisition in the unified checker uses the same documented timing. Area timing stays a lower bound; Surf and fishing requirements are separate. |
| Team Planner recommendations | Pass for exercised paths | Ranked empty-slot and replacement candidates, availability windows, lock persistence, preview and confirm, four legal moves in the exercised fixture. Existing planned moves migrate in place. Temporary alternatives require verified timing or a known owned Pokémon level. |
| Team optimization and readiness | Need work | Existing move proposals still require approval. Readiness includes game-specific Gym and League rosters. A complete opponent-by-opponent battle forecast and team-wide replacement optimizer were not implemented. Stat and coverage scoring is heuristic and the detailed comparison shortlist is bounded. |
| Hold to Compare | Pass for exercised paths | Chromium checked mouse and emulated touch, selected game and return to Team Planner. Native Android behavior remains untested. |
| Persistent plan identity | Need work | Newly seeded imported Pokémon retain a personality ID. Existing plans fall back to matching species or evolution lineage. Exact original identities cannot be reconstructed for ambiguous older slots and duplicate manually entered species. A full party reorder and evolution browser matrix remains untested. |
| Pokédex and Maps | Pass for exercised paths | Checked selectable hidden ability, single ability, no abilities in Gen I, automatic type-result scroll, Village Bridge in Black 2 and expanded section on return. Maps remain limited to supported atlases. A complete historical description and per-game map matrix remains untested. |
| V76 regressions | Pass for exercised paths | Node and Chromium suites covered existing save restore, Team Builder, team JSON, battle ranks, red and green KO notices, move checker, maps, offline reload and responsive layout. |
| Android-native | Not tested | The web sync entry point remains compatible. No Android files changed. |

## Progression evidence

The parser cross-checks each optional block with both its checksum and the selected bank's checksum table. Block 52 provides individual badge bits, block 45 provides documented event flags, block 25 provides HM inventory and the validated player block provides Hall of Fame metadata. Flag 2400 means first story clear against Ghetsis in BW and Hall of Fame in B2W2. BW Champion completion is only recorded with Hall of Fame evidence. Badge counts inform estimated story timing and do not mark adjacent scripted events as completed. The last valid data for an unreadable optional block is retained for the same trainer. [PKHeX block accessors and save structures](https://github.com/kwsch/PKHeX/tree/a5311f9f55a84376fd2e2499b25d9fb9640d9f2d/PKHeX.Core/Saves) · [PKHeX documented event flags](https://github.com/kwsch/PKHeX/tree/a5311f9f55a84376fd2e2499b25d9fb9640d9f2d/PKHeX.Core/Resources/text/script/gen5)

The expanded timing records cross-reference the bundled PokéAPI encounter rows, walkthrough order, game-specific HM and TM lists, and evolution conditions. Specific events are retained in the record when established. A lower-bound location match alone is classified as partial. Unresolved records include alternate entrances, trades, unverified special methods, evolution items, and games that lack audited gates. Zero indexed rows means no indexed coverage in this audit. [PokéAPI data](https://github.com/PokeAPI/pokeapi/tree/master/data/v2/csv) · [Black and White walkthrough](https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_Black_and_White) · [Black 2 and White 2 walkthrough](https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_Black_2_and_White_2) · [Gen V machine locations](https://bulbapedia.bulbagarden.net/wiki/List_of_TM_and_HM_locations_in_Generation_V) · [Evolution conditions](https://pokemondb.net/evolution)

## Acquisition coverage

The denominator is the set of indexed species with an encounter record or a documented timed or partial route. This is a reproducible index audit and does not count every legally obtainable species. The same denominator is used before and after. Verified means a confirmed timing record for a known route. It does not establish the earliest route where alternate methods remain undocumented. The location count measures lower-bound gates. Machine counts refer to the existing Unova machine catalogs. Tutor and level-up legality is available through the existing learnset and tutor records. Complete tutor, reminder and level-up timing coverage was not measured.

| Game | Indexed species assessed | Verified before | Verified after | Partial after | Unresolved | Locations with lower bound |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Red | 106 | 0 (0.0%) | 0 (0.0%) | 0 | 106 | 0/45 |
| Blue | 106 | 0 (0.0%) | 0 (0.0%) | 0 | 106 | 0/45 |
| Yellow | 106 | 0 (0.0%) | 0 (0.0%) | 0 | 106 | 0/45 |
| Gold | 151 | 0 (0.0%) | 0 (0.0%) | 0 | 151 | 0/84 |
| Silver | 151 | 0 (0.0%) | 0 (0.0%) | 0 | 151 | 0/84 |
| Crystal | 170 | 0 (0.0%) | 0 (0.0%) | 0 | 170 | 0/85 |
| Ruby | 129 | 0 (0.0%) | 0 (0.0%) | 0 | 129 | 0/68 |
| Sapphire | 129 | 0 (0.0%) | 0 (0.0%) | 0 | 129 | 0/69 |
| Emerald | 158 | 0 (0.0%) | 0 (0.0%) | 0 | 158 | 0/81 |
| FireRed | 140 | 0 (0.0%) | 0 (0.0%) | 0 | 140 | 0/83 |
| LeafGreen | 140 | 0 (0.0%) | 0 (0.0%) | 0 | 140 | 0/83 |
| Diamond | 277 | 0 (0.0%) | 0 (0.0%) | 0 | 277 | 0/74 |
| Pearl | 278 | 0 (0.0%) | 0 (0.0%) | 0 | 278 | 0/74 |
| Platinum | 290 | 0 (0.0%) | 0 (0.0%) | 0 | 290 | 0/76 |
| HeartGold | 284 | 0 (0.0%) | 0 (0.0%) | 0 | 284 | 0/99 |
| SoulSilver | 284 | 0 (0.0%) | 0 (0.0%) | 0 | 284 | 0/99 |
| Black | 247 | 4 (1.6%) | 25 (10.1%) | 196 | 26 | 47/52 |
| White | 247 | 4 (1.6%) | 25 (10.1%) | 196 | 26 | 47/52 |
| Black 2 | 304 | 0 (0.0%) | 33 (10.9%) | 211 | 60 | 62/68 |
| White 2 | 303 | 0 (0.0%) | 33 (10.9%) | 211 | 59 | 62/68 |
| X | 358 | 0 (0.0%) | 0 (0.0%) | 0 | 358 | 0/46 |
| Y | 357 | 0 (0.0%) | 0 (0.0%) | 0 | 357 | 0/46 |
| Omega Ruby | 146 | 0 (0.0%) | 0 (0.0%) | 0 | 146 | 0/62 |
| Alpha Sapphire | 146 | 0 (0.0%) | 0 (0.0%) | 0 | 146 | 0/62 |
| Sun | 253 | 0 (0.0%) | 0 (0.0%) | 0 | 253 | 0/68 |
| Moon | 251 | 0 (0.0%) | 0 (0.0%) | 0 | 251 | 0/68 |
| Ultra Sun | 378 | 0 (0.0%) | 0 (0.0%) | 0 | 378 | 0/75 |
| Ultra Moon | 377 | 0 (0.0%) | 0 (0.0%) | 0 | 377 | 0/75 |
| Sword | 396 | 0 (0.0%) | 0 (0.0%) | 0 | 396 | 0/47 |
| Shield | 397 | 0 (0.0%) | 0 (0.0%) | 0 | 397 | 0/47 |
| Brilliant Diamond | 0 | 0 | 0 | 0 | 0 | 0/0 |
| Shining Pearl | 0 | 0 | 0 | 0 | 0 | 0/0 |
| Scarlet | 0 | 0 | 0 | 0 | 0 | 0/0 |
| Violet | 0 | 0 | 0 | 0 | 0 | 0/0 |

| Game | Machines listed | Machine timing before | Machine timing after |
| --- | ---: | ---: | ---: |
| Black | 101 | 8 | 18 |
| White | 101 | 8 | 18 |
| Black 2 | 101 | 14 | 24 |
| White 2 | 101 | 14 | 24 |

## Commands

```sh
TAKDEX_REFERENCE_SAVES=../retail-saves node --test .github/v76/*.test.cjs .github/v77/*.test.cjs
node .github/v77/browser.cjs http://127.0.0.1:8795
node .github/v77/coverage.cjs
node .github/v76/browser.cjs http://127.0.0.1:8795
node .github/v76/team-management.cjs http://127.0.0.1:8795
node .github/v76/smoke.cjs http://127.0.0.1:8795
TAKDEX_BASELINE=http://127.0.0.1:8784 node .github/v76/corrections.cjs http://127.0.0.1:8795
```

## Correction round 1

Baseline `165f154` on `v77-development`. Draft PR #2 remains the review vehicle. No Android files, production branch, or deployment changed.

### Where to find the changes

- **Team Planner** shows read-only Actual story progression above the editable Planning progress. The Pokémon editor has Actual, During game and Final views. The Actual view uses the associated party member, and the two planning views retain independent choices. Change Pokémon contains the deadline and optional Legendary/Mythical toggle.
- **Recommended improvements** sits beneath Planned team. Verified immediate evolution routes open a preview, shared weaknesses can open a resistance-filtered replacement list, and compatible move changes with verified timing can be expanded and accepted. Locked Pokémon are excluded from replacement and evolution proposals. They can still receive move proposals.
- **Coverage, HM overview, Gym readiness and Elite Four readiness** are independent collapsed cards. Gym projections use documented acquisition gates and intermediate moves with level or move-timing evidence. Elite Four uses Final moves.
- **Team export/import** uses the existing buttons. JSON v2 includes the plan and an optional progression snapshot. Import generates a new team ID. Legacy team-only JSON still works. The export does not carry a live filesystem link. An old export cannot recover planning data it never contained.
- **Pokédex** search is always visible. Map links show Back in the map header and return to the originating screen. Hold to Compare opens directly from recommendations and previews.

### Ranking and evidence

Every eligible candidate is evaluated against the selected planned slot and the other five members. A compact offline index derived from the bundled PokéAPI records supplies historical base stats, rarity, ability signals and the type breadth of dependable level-up moves. The planner combines stats, strengths, bulk, speed, weak/resistant types, coverage, gym/League type matchups, known evolution paths and a small acquisition timing weight before selecting the visible results. Learnset breadth and trainer matchup scores are heuristics. Detailed move legality remains verified during moveset creation. Default deadline is Before Elite Four. Restrictive deadlines require verified routes. Broad views can display partially verified and unresolved routes with those labels. Postgame-only routes remain out of the main-story pool.

An eligible verified evolved form can replace intermediate forms in recommendations. Branch endpoints remain separate. The Gliscor entry documents both rustling grass on Route 11 and Gligar's Razor Fang path. The PWT/Subway BP purchase avoids assuming that the overworld Razor Fang is available before Surf and Waterfall. Psyduck's level-33 Golduck evolution has a verified Floccesy Ranch start. [Route 11](https://bulbapedia.bulbagarden.net/wiki/Unova_Route_11) · [Razor Fang](https://bulbapedia.bulbagarden.net/wiki/Razor_Fang) · [Route 7 in-game trade](https://bulbapedia.bulbagarden.net/wiki/Unova_Route_7) · [PokéAPI species index](https://github.com/PokeAPI/pokeapi/blob/master/data/v2/csv/pokemon_species.csv)

The audit uses version-specific records for reviewed land encounters. It excludes unsupported entrances, conditioned rows and water encounters from automatic promotion. Additional records cover evolution stones, fossils, Gigalith's in-game trade and one documented Hidden Grotto ability. The Water Stone on Route 19 is Surf-gated even though the route itself is accessible early. The Move Reminder is documented at Mistralton in BW and the PWT in B2W2, with a Heart Scale. [Route 19](https://bulbapedia.bulbagarden.net/wiki/Unova_Route_19) · [Fire Stone](https://bulbapedia.bulbagarden.net/wiki/Fire_Stone) · [Thunder Stone](https://bulbapedia.bulbagarden.net/wiki/Thunder_Stone) · [Sun Stone](https://bulbapedia.bulbagarden.net/wiki/Sun_Stone) · [Move Reminder](https://bulbapedia.bulbagarden.net/wiki/Move_Reminder) · [Hidden Grotto](https://bulbapedia.bulbagarden.net/wiki/Hidden_Grotto)

### Acquisition coverage after corrections

| Game | Original denominator | Verified before | Verified after | Partial after | Unresolved after | Expanded denominator | Verified in expanded set |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Black | 247 | 25 (10.1%) | 64 (25.9%) | 157 | 26 | 248 | 65 (26.2%) |
| White | 247 | 25 (10.1%) | 64 (25.9%) | 157 | 26 | 248 | 65 (26.2%) |
| Black 2 | 304 | 33 (10.9%) | 121 (39.8%) | 124 | 59 | 306 | 123 (40.2%) |
| White 2 | 303 | 33 (10.9%) | 121 (39.9%) | 124 | 58 | 305 | 123 (40.3%) |

Run `TAKDEX_FIXED_DENOMINATOR=1 node .github/v77/coverage.cjs` for the fixed set or omit the flag for the union of both sets. Verified means a documented route by the stated milestone, with individual prerequisites where established. Other possible earlier routes can remain unverified. Location lower bounds and machine counts are unchanged at 47/52 locations and 18/101 machines per original, and 62/68 locations and 24/101 machines per sequel. The round does not measure comprehensive tutor or move-reminder coverage per species.

### Acceptance and remaining limits

| Area | Status | Notes |
| --- | --- | --- |
| Progression and portability | Pass | Chromium exercised visible Team Planner, file-picker imports, unchanged-party progression updates, invalid save preservation, independent hypothetical progress and a v2 plan round trip into separate browser storage. V76 legacy import regression also passed. |
| Planner views and navigation | Pass | Chromium checked the three views, four move rows, empty-slot preview, persisted lock, replacement refresh, collapsed summaries and mouse recommendation/touch preview Hold to Compare. |
| Pokédex and Maps | Pass | Chromium checked redundant controls absent, multi-result `fr` suggestions and hit testing, ability views, type scrolling, Village Bridge and contextual Back. |
| Ranking and acquisition | Need work | The index supplies comparable inputs for all eligible candidates, but fairness has no exhaustive team matrix. Seasonal, mixed version, field and special-event requirements still need species-level research. Evolution grouping is strongest on documented Unova paths. |
| Movesets and team optimization | Need work | Automatic intermediate and final sets are bounded by available timing evidence. Older games lack many machine/tutor gates and single-use resource budgets are not modeled as a whole-team allocation. The improvements panel uses a limited move shortlist and does not automatically solve every late-acquisition or balance issue. |
| Readiness | Need work | Chronological Unova presets are used where indexed. Other rosters and badge ordering have gaps. Type coverage and intermediate move timing do not establish battle wins. |
| Untested | Not tested | Physical touch, Android-native comparison and file permissions, and an exhaustive party reorder/evolution and species acquisition matrix. |

The round uses the existing plan keys with additive move-stage fields and needs no manual migration.

## Correction Round 2

Review baseline `e2fdaf8` on `v77-development`, with the V76-STABLE web comparison at `ddf951b). Round 1 acceptance was 12 Pass, 14 Need work, 1 Fail and 1 Not tested. This round remains a candidate for user acceptance.

### Implementation and ranking evidence

- Team Planner now has a read-only Actual story progression and one persisted Planning deadline. The global During game / Final selector controls all the cards, the open editor and planned move coverage. Actual moves remain visible in the V76-style comparison. Changing modes or deadlines preserves both saved movesets. Earlier V77 progression and milestone fields remain in the stored plan for compatibility.
- The planner ranks the full eligible pool against the other five slots. The score uses marginal value from type and move coverage, first resistance and immunity coverage, unprotected shared weaknesses, repeated exact typings, physical/special balance, stat distribution and trainer roster coverage. Quality receives more weight than acquisition rank. A shared type can still win on other contributions. The owned-evolution convenience bonus is smaller than the exact-type redundancy penalty. Documented final forms suppress competitive intermediate recommendations; verified branching alternatives remain separate.
- A controlled Black 2 test reverses the preference between Golduck and Magnezone. Magnezone wins on a Water-heavy team with Vaporeon and Poliwrath. Golduck wins on the Steel-heavy fixture with Skarmory, Magneton and Metagross. This verifies the composition score. It is not an exhaustive assertion about exact UI ordering for every team.
- Recommended Improvements compares the best verified evolution and replacement for unlocked slots before choosing a preview. Move proposals follow the current mode. Coverage, HM, Gym and League cards stay separate. Gym analysis uses the milestone before each fight, with the three Striaton starter matchups sharing one Gym. Level-up evolution requirements are compared with the roster's documented levels. League summaries show coverage by trainer and skip explicitly postgame/rematch presets.
- A press-and-hold offers Compare or Cancel from recommendation and preview cards. Team Planner resumes after tab switching and displays refreshed actual data if the save changed while away. Ordinary Pokédex suggestions open their entry on selection without a View button. The Maps Back button shares the map toolbar, and replacement selection and confirmation scroll to the preview and editor respectively.

### Acquisition method and results

The fixed denominator uses the original V77 review cohort at `165f154` and compares Round 1 with Round 2. The expanded set is the union of species with indexed encounters or audited routes in those versions and the current candidate. Curated entries are game and method specific. Normal ground encounters use named audited areas or floors. Surf and Super Rod checks use separate location gates and item acquisition timing. Seasonal conditions are carried in the route. Other unknown conditions remain partial or unresolved. A verified row establishes a route by a milestone. Additional research may establish an earlier route.

Additional reviewed records include late and postgame land areas, Surf and fishing on audited routes, daily National Pokédex fossils, Route 6 Deerling, and the version-specific weekly Route 4 encounters. Move timing now covers BW Rock Tomb and B2W2 Frustration, Thief and Rock Smash. The latter requires defeating the three Workers; Frustration requires finding Herdier. Existing item evolution, Hidden Grotto, and Move Reminder evidence remains in the Round 1 section. [Black and White walkthrough](https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_Black_and_White) · [Black 2 and White 2 walkthrough](https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_Black_2_and_White_2) · [Super Rod](https://bulbapedia.bulbagarden.net/wiki/Super_Rod) · [Twist Mountain](https://bulbapedia.bulbagarden.net/wiki/Twist_Mountain) · [Route 4](https://bulbapedia.bulbagarden.net/wiki/Unova_Route_4) · [Route 6](https://bulbapedia.bulbagarden.net/wiki/Unova_Route_6) · [Virbank Complex](https://bulbapedia.bulbagarden.net/wiki/Virbank_Complex) · [Generation V TMs and HMs](https://bulbapedia.bulbagarden.net/wiki/List_of_TM_and_HM_locations_in_Generation_V)

| Game | Fixed assessed | Verified R1 → R2 | Partial R2 | Unresolved R2 | Expanded assessed | Expanded verified R1 → R2 | Expanded partial / unresolved R2 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Black | 247 | 64 → 158 (64.0%) | 70 | 19 | 248 | 65 → 159 (64.1%) | 70 / 19 |
| White | 247 | 64 → 158 (64.0%) | 70 | 19 | 248 | 65 → 159 (64.1%) | 70 / 19 |
| Black 2 | 304 | 121 → 204 (67.1%) | 49 | 51 | 306 | 123 → 206 (67.3%) | 49 / 51 |
| White 2 | 303 | 121 → 204 (67.3%) | 49 | 50 | 305 | 123 → 206 (67.5%) | 49 / 50 |

Machine timing is 19/101 per original and 27/101 per sequel. The lower-bound location index remains 47/52 and 62/68 respectively. Run `TAKDEX_FIXED_DENOMINATOR=1 node .github/v77/coverage.cjs` for the fixed cohort and omit the variable for the expanded set. Neither set proves the count of every legally obtainable species.

### Verification and known limits

| Status | Results |
| --- | --- |
| Pass | 36 Node tests, including composition ranking, seasonal and field requirements, version-specific statics, Gen V progression and legacy V76 data. |
| Pass | Chromium focused checks at 412 and 1280 px for progression, global settings, independent moves, preview scroll, mouse and emulated touch prompts, tab return, explicit exit, JSON transfer, autocomplete and Maps return. V76 regression suites cover Battle, 6v6, map controls, JSON, save reimport and offline reload, with responsive corrections at 320, 412 and 1280 px. |
| Need work | Complete cross-game acquisition and complete tutor, reminder and evolution-item prerequisite chains. Unresolved groups include conditioned spawns, subarea and entrance requirements, alternate evolution, breeding, trades and event-only routes. Game-specific records outside Gen V received limited research. |
| Need work | Complete whole-team budgeting for single-use TMs and other finite resources, and exhaustive legal moveset feasibility. Final selections use the known gate or practical level cap. Manual choices past an established gate are marked. Full trainer battle readiness and historical coverage for undocumented rosters remain open. |
| Not tested | Physical mobile touch, Android-native compare/selection and filesystem behavior, complete roster/availability matrix, and every save reorder/evolution scenario. |

### Manual acceptance checklist

1. **R2-01 Evolution paths**. Look for Gliscor and Golduck in Black 2. Check the named pre-evolution, location, milestone, evolution requirement and any direct alternative.
2. **R2-02 Marginal ranking**. Compare recommendations in two materially different teams. Replace one member and reopen another slot. Check that weaknesses, move coverage and typing overlap affect the alternatives and trade-offs.
3. **R2-03 Locks and rarity**. Lock a member and open Recommended Improvements. Confirm the member can receive move advice. Check that the Legendary/Mythical toggle is initially off and aligned with its text.
4. **R2-04 Global modes**. Toggle During game and Final above Planned team. All cards and the open editor change together. Actual moves remain in the left column and are read-only.
5. **R2-05 Independent edits**. Edit one move in each mode, switch twice, reload, and verify both saved choices. A fresh import updates actual moves without replacing either plan.
6. **R2-06 Global deadline**. Choose an early Gym and then Before Elite Four. Early filters require verified availability, and after-deadline manual choices remain visible with their warning.
7. **R2-07 Actual progression**. Import a save using Team Builder. Check the actual milestone and change the deadline. The save milestone stays the same. Repeat with an unchanged-party progression update or an invalid file.
8. **R2-08 Analysis sections**. Check the five separate disclosures. Compare the Gym list with the next badge and the League list with Final moves. Look for the planned coverage summary and per-trainer counts.
9. **R2-09 Compare popup**. Hold a candidate and a replacement preview. Cancel one and confirm the other. Check the comparison pair, selected game, return scroll and normal tap behavior.
10. **R2-10 Replacement scroll**. Tap a candidate, then confirm it. The preview and then the affected editor should come into view.
11. **R2-11 Retained navigation**. Switch tabs with a plan and editor open, then return to Team. The plan remains active. Exit explicitly with My Team.
12. **R2-12 Pokédex and Maps**. Search `fr`, select a result using the list, and open a known encounter map. Back is in the map toolbar and restores the source screen.
13. **R2-13 Acquisition quality**. Compare Route 19 land and Surf conditions, the Route 4 weekly encounters in both sequels, and a postgame fossil. An unknown condition must remain labeled.
14. **R2-14 Data portability**. Export and reimport in a separate browser profile. Confirm the new ID, both movesets, locks, deadline and progression snapshot. Try a legacy team-only file.
15. **R2-15 Existing tools**. Reopen Battle, 6v6 and Move Checker, then reload offline. Check layout, save data and navigation against V76.

## Correction Round 3

Review baseline `b987b3c` on `v77-development`. Production Web V76-STABLE remains at `ddf951b`. Round 2 manual acceptance recorded 32 Pass, 7 Need work, 2 Fail and 2 Not tested. Round 3 awaits manual acceptance.

### Ranking and interface

The old replacement score subtracted a constant for the selected member across candidates. Most of the remaining distinction came from intrinsic quality and static type coverage. In particular, replacing a member with a better moveset could leave the ordering largely intact. The new ranking recalculates against the surviving planned teammates, measures its coverage loss against the current slot’s planned moves and accounts for the remaining team's unanswered defensive weaknesses. Available candidate move quality, acquisition, stats, type overlap and League coverage still contribute. The current planned state feeds both the candidate list and improvement panel. A verified evolution within the deadline is shown separately with its score, even if the general replacement shortlist would omit it.

In the Black 2 browser fixture, Psyduck, Growlithe and Magnemite started with three, one and one actual moves. Golduck appeared explicitly as Psyduck’s evolution. Confirming it changed the same-slot score for Gliscor from 76.20 to 51.96 and its moves contribution from 35 to 27. After confirming Magnemite → Magnezone, the alternatives below Arcanine changed when Growlithe’s editor was reopened.

| Candidate | Before rank among replacements | After rank among replacements | Score before → after | Moves contribution before → after |
| --- | ---: | ---: | ---: | ---: |
| Gliscor | 1 | 1 | 84.33 → 76.82 | 27.5 → 20 |
| Salamence | 2 | 3 | 75.89 → 68.39 | 22.5 → 15 |
| Heracross | 3 | 2 | 71.67 → 69.17 | 20 → 17.5 |
| Vespiquen | 4 | 4 | 58.13 → 53.13 | 11 → 6 |

The Legendary/Mythical label inherited a more specific Planner `display: block` rule that overrode its inline checkbox layout. The corrected label uses a shared row layout and the selector now matches the actual cascade. During game and Final are compact equal-width tabs. Both modes retain four independent rows. Actual move chips use the available column width and wrap at word boundaries. Analysis disclosures have a bold title above a smaller summary and a right-aligned chevron. HM, Team Coverage and individual League metrics use contextual colors. Recommended Improvements shows ranked actions with previews, explicit acceptance and additional options when available.

Hold to Compare scrolls to the rendered results for Planner and Pokédex flows with a result. Pokédex acquisition descriptions link supported canonical atlas destinations, including Marvelous Bridge. Unsupported locations such as Nature Preserve are shown by name. Empty headings and generic disclaimers were removed. Map actions and contextual Back share a single compact row on mobile. The fullscreen toolbar retains the zoom percentage.

### Acquisition audit

| Game | Fixed verified before → after | Fixed partial / unresolved | Expanded verified before → after | Expanded partial / unresolved | Named location lower bounds |
| --- | ---: | ---: | ---: | ---: | ---: |
| Black | 158 → 158 / 247 (64.0%) | 70 / 19 | 159 → 160 / 249 (64.3%) | 70 / 19 | 47/52 |
| White | 158 → 158 / 247 (64.0%) | 70 / 19 | 159 → 160 / 249 (64.3%) | 70 / 19 | 47/52 |
| Black 2 | 204 → 207 / 304 (68.1%) | 47 / 50 | 206 → 212 / 309 (68.6%) | 47 / 50 | 62/68 |
| White 2 | 204 → 206 / 303 (68.0%) | 47 / 50 | 206 → 209 / 306 (68.3%) | 47 / 50 | 62/68 |

The fixed cohort stays anchored at `165f154`. The expanded cohort includes newly identified species. Both before and after counts use the same denominator within each row. Verified means a documented route by the cited milestone. Earlier alternate routes may still exist.

- Black 2’s Gible gift requires defeating Benga in Black Tower and visiting Alder in Floccesy Town. Gible evolves at levels 24 and 48. The gift differs by version. Black 2 also has Baltoy in the Volcarona chamber via the PWT entrance after Clay. Baltoy evolves at level 36. [Floccesy Town](https://bulbapedia.bulbagarden.net/wiki/Floccesy_Town) · [Relic Castle](https://bulbapedia.bulbagarden.net/wiki/Relic_Castle)
- Sequel Golurk has a documented Victory Road cave encounter at levels 48–50. The original pair has a Golett route via Dragonspiral Tower and level 43 evolution. Sequel Psyduck evolves at level 33, with a documented direct Golduck alternative on Route 11. Generic Hidden Grotto gates were added for Routes 5, 7 and 9, with the random spawn condition retained. Exact Victory Road cave room identifiers remain unresolved. [Sequel Victory Road](https://bulbapedia.bulbagarden.net/wiki/Victory_Road_(Black_2_and_White_2)) · [Dragonspiral Tower](https://bulbapedia.bulbagarden.net/wiki/Dragonspiral_Tower) · [Floccesy Ranch](https://bulbapedia.bulbagarden.net/wiki/Floccesy_Ranch) · [Route 11](https://bulbapedia.bulbagarden.net/wiki/Unova_Route_11) · [Hidden Grotto](https://bulbapedia.bulbagarden.net/wiki/Hidden_Grotto)
- Verified TM/HM timing rose from 19 to 43 of 101 in each original game and from 27 to 58 of 101 in each sequel. New machine records include audited shops and BP purchases with their facility requirements. Verified tutor locations and timing remain 67/67 in each sequel and 0 indexed ordinary tutor entries in each original. Previously documented Move Reminder locations still require a Heart Scale. Previously verified evolution-item gates were retained. There is no exhaustive denominator for evolution items or earliest repeatable Heart Scale access. [Gen V machines](https://bulbapedia.bulbagarden.net/wiki/List_of_TM_and_HM_locations_in_Generation_V) · [Move Reminder](https://bulbapedia.bulbagarden.net/wiki/Move_Reminder)

Run `TAKDEX_FIXED_DENOMINATOR=1 node .github/v77/coverage.cjs` or omit the variable for the expanded cohort and per-game output. Location counts measure the presence of an audited area gate. A Surf, rod, seasonal or encounter-specific prerequisite can be stricter.

### Verification and remaining limits

| Status | Evidence |
| --- | --- |
| Pass | Round 3 Chromium geometry at 320, 360, 390, 412 and 1280 px, including checkbox alignment, compact tabs, word wrapping, analysis hierarchy and contextual map controls. The 412 px sequence verifies actual replacement confirmation, reordering of common candidates and the comparison results viewport. The 1280 px full team changes the ranking from the three-member fixture, retains four planned rows in both modes for 0–4 actual moves and shows three improvements plus more. |
| Pass | 37 V76/V77 Node tests including acquisition paths, version exclusivity, Gen V progression, save round trips, ranking and battle mechanics. |
| Pass | Chromium V77 browser flow checks for save import and progression, unchanged-party detection, invalid-save preservation, persistence, JSON transfer, emulated touch and mouse comparison, Pokédex abilities and Village Bridge return. |
| Pass | V76 Chromium browser, visual corrections, team management and smoke suites. They cover Battle and 6v6, Gen V save reimport, locks and navigation, map viewport and fullscreen controls, historical data, branding and offline cold reload. Visual corrections include the V75 computed style reference and candidate checks at 320, 412 and 1280 px. |
| Need work | Acquisition audits were focused on the reported Unova cases, selected Hidden Grottos and machine gates. Additional encounter conditions, area entrances, special spawns, trades, breeding, evolution items and earlier alternative routes remain unresolved. Older games did not receive comparable timing research in this round. Nature Preserve has no supported sequel atlas target. |
| Need work | Planner identifies potential pre-Gen V machine-copy conflicts and the initial Cover/Plume fossil choice. The planner does not solve whole-team inventory and evolution-item allocation or count repeatable sources. Generation V TMs remain reusable. |
| Not tested | Physical Android touch, native selection or filesystem behavior, exhaustive acquisition and recommendation matrices, and gameplay confirmation of every new prerequisite. |

The cache version advances with the changed web assets. Existing plan keys and export formats are retained. No manual migration is required.

### Manual acceptance checklist

1. **R3-01, R3-16.** In Black 2 compare Garchomp, Claydol, Golurk, Psyduck and Golduck in Planner and Pokédex. Check the stated route, level, method, prerequisite, alternate route and version distinctions.
2. **R3-02, R3-03.** Open Psyduck’s recommendations, preview and confirm Golduck, then confirm a replacement in another slot. Reopen both editors and compare candidate order, defensive reasons and plan moves.
3. **R3-04.** Tap both the Legendary/Mythical checkbox and its text. Check side-by-side alignment in narrow and wide layouts.
4. **R3-05–07.** Check the tab indicator, four move slots in both modes, natural move-name wrapping, and independent persistence after a reload. Include a Pokémon with fewer than four actual moves.
5. **R3-08, R3-17.** Preview and accept one improvement. Reopen the panel and check the refreshed proposals, lock behavior and visible warnings where resources overlap.
6. **R3-09–11.** Check each analysis title above the summary, right-side chevron, planned-only coverage counts, and color changes as HM and opponent coverage change.
7. **R3-12.** Hold a Planner recommendation, a preview and a Pokédex entry. Compare should open at rendered results. Test Cancel and return to the original scroll position.
8. **R3-13–15.** Open Marvelous Bridge from Black 2 Magikarp acquisition text, check the map selection and one-row toolbar, then return. Check Nature Preserve’s name and that empty acquisition headings are absent.
9. **Regression.** Import a save and reload offline after creating a plan. Check the plan, actual progression, Team Builder, Battle and 6v6. Compare version-exclusive acquisition in Black 2 and White 2.

## Correction Round 4

The review baseline is `90e8432` on `v77-development`. This is a web review checkpoint for draft PR #2. Production and Android remain on their approved baselines.

### Team Planner

- **R4-01.** Ranking considers the acquisition effort of replacing an owned party member, the remaining training for an owned evolution, and the documented timing of credible TM and tutor attacks. In the Black 2 Psyduck fixture, the browser compared actual catalog entries for Golduck and Starmie. Golduck scored **55.34** and Starmie **45.13**. Starmie gained more on composition (25.98 vs. 16.24) and League coverage (4.2 vs. 0). Golduck gained more on attainable move coverage (31.75 vs. 15.65), with an effort adjustment of +0.20 versus −6.60. That result reflects the fixture and deadline. Starmie remains eligible where its contribution justifies the Surf encounter or Water Stone route.
- **R4-02.** The auto-fill pass had rejected every status move and sometimes discarded a verified acquisition route because a different learning method lacked timing. It now ranks dependable attacks first, retains useful known moves from the same evolution line and uses practical utility moves when needed. In the level 22 Psyduck scenario, the During game set contained Water Pulse, Confusion, Water Gun and Scratch. Golduck’s Final set contained Hydro Pump, Surf, Ice Beam and Scald. If a species has fewer than four supported choices, the remaining slots stay editable.
- **R4-03.** Final can project a single feasible endpoint and offer a choice for branching lines. During game uses the current documented stage and does not assume a future evolution. Final combines reachable earlier-stage moves with the target learnset and labels earlier-stage exclusives. It excludes moves the player already missed on an earlier owned stage unless they remain known. A tighter deadline suspends the projection in coverage and readiness, and leaves stored choices in place. Explicit target changes regenerate automatic suggestions and retain edited moves. Branches without verified routes are shown as unavailable. This models stage order and common acquisition gates. It does not solve every mutually exclusive move, egg or event inheritance sequence.
- **R4-10.** The plan checks documented single-copy TMs across member slots, including Kanto one-time machines and representative Johto and remake examples. It avoids duplicate automatic assignments where a move depends solely on that TM and warns for manual conflicts. Group rules cover the original Unova fossil choice, the Kanto fossil and gift choices, and Hoenn fossil alternatives. Reusable Generation V TMs remain unrestricted. Sequel Cover and Plume Fossils retain the one guaranteed choice and show the renewable Join Avenue alternative. A complete inventory of finite evolution items, gifts and switch-dependent resources across all games is still open. [Generation I TM/HM sources](https://bulbapedia.bulbagarden.net/wiki/List_of_TM_and_HM_locations_in_Generation_I) · [Cover Fossil](https://bulbapedia.bulbagarden.net/wiki/Cover_Fossil) · [Root Fossil](https://bulbapedia.bulbagarden.net/wiki/Root_Fossil)

### Acquisition, timing and Maps

- **R4-04 to R4-06.** Pokédex uses one two-line format for indexed encounter and acquisition entries. A verified same-location and same-method summary is merged with its individual entry. Alternate methods, evolution requirements and applicable encounter levels are retained. Different methods at the same location can show different gates. Unverified timing is marked for its own route.
- **R4-07.** Review began from the partial and unresolved rows in the Round 3 fixed cohort and grouped them by exact subarea or method. The audit cross-referenced version-specific item, encounter, trade and story sections. Land, Surf, fishing, Hidden Grotto, trades and statics use separate gates. Direct encounter evidence stays independent from evolution conditions. An expansion follows documented parent links for unconditional level evolutions and rejects branching or version-incompatible assumptions. A confirmed row establishes a documented route with its stated conditions. It does not establish every route or the earliest possible acquisition under every playthrough. [Black/White walkthrough](https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_Black_and_White) · [Black 2/White 2 walkthrough](https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_Black_2_and_White_2) · [In-game trades](https://bulbapedia.bulbagarden.net/wiki/In-game_trade) · [PokéAPI evolution source](https://github.com/PokeAPI/pokeapi/blob/master/data/v2/csv/pokemon_evolution.csv)
- **R4-08 and R4-09.** Black 2 and White 2 now each have **101/101** machine progression gates. Black and White each have **97/101** with a badge/story gate. Juniper’s remaining three TM rewards depend on 25, 60 or 115 seen Pokédex entries. Snarl requires the never-distributed Lock Capsule. The 67 indexed sequel tutor moves retain timing and currency data. Both original games have zero entries in that ordinary tutor index, which excludes special tutors. Red, Blue and Yellow now list all 55 TM/HM locations and documented price or field-badge conditions. There is no blanket badge-order rank for Kanto’s branching path. The Move Reminder gate is documented in each pair, with a daily Heart Scale source in Driftveil City. Evolution item research covers specific sources used by the audited routes, including the Water Stone on Route 19 and Razor Fang via BP. A complete item denominator, ordinary and specialty tutor catalog for every region, and per-species breeding, Reminder and move inheritance schedules are unverified. [Generation V machines](https://bulbapedia.bulbagarden.net/wiki/List_of_TM_and_HM_locations_in_Generation_V) · [Nuvema Town](https://bulbapedia.bulbagarden.net/wiki/Nuvema_Town) · [Driftveil City](https://bulbapedia.bulbagarden.net/wiki/Driftveil_City) · [Move Reminder](https://bulbapedia.bulbagarden.net/wiki/Move_Reminder)
- **R4-11.** Nature Preserve opens as a detached Maps destination with its Permit and flight requirements, indexed encounters and contextual Back. It has no mainland pin. Other unsupported locations remain searchable only where the atlas or directory has sufficient evidence. [Nature Preserve](https://bulbapedia.bulbagarden.net/wiki/Nature_Preserve)

| Game | Fixed baseline → Round 4 | Expanded baseline → Round 4 | Fixed remaining outside verified timing |
| --- | ---: | ---: | --- |
| Black | 158 → 239 / 247 (96.8%) | 160 → 261 / 269 (97.0%) | 3 starter choices, 2 trade evolutions, 3 distribution requirements |
| White | 158 → 239 / 247 (96.8%) | 160 → 261 / 269 (97.0%) | 3 starter choices, 2 trade evolutions, 3 distribution requirements |
| Black 2 | 207 → 300 / 304 (98.7%) | 212 → 330 / 334 (98.8%) | 3 starter choices, 1 trade evolution |
| White 2 | 206 → 299 / 303 (98.7%) | 209 → 327 / 331 (98.8%) | 3 starter choices, 1 trade evolution |

The fixed denominator remains anchored at `165f154`. Each expanded row uses the same expanded set before and after. Partial records in these two Unova cohorts fell to zero. The remaining count comprises the restrictions described above. This excludes unindexed encounters and species outside the audited cohorts. Location lower-bound counts are 47/52 and 62/68 for the original and sequel pairs, independent of verified method coverage.

The [fixed-cohort Unova ledger](round4-unova-ledger.jsonl) records the remaining starter, NPC trade, distribution and machine restrictions. The commands below generate a broader per-record inventory with version, species, bundled method, prerequisites and next research action, including outside the audited denominator. Unverified entries have not all been independently researched. Research is still open for the other generations and out-of-cohort Unova routes.

```sh
TAKDEX_FIXED_DENOMINATOR=1 node .github/v77/coverage.cjs
TAKDEX_ACQUISITION_LEDGER=/tmp/takdex-round4-ledger.jsonl node .github/v77/coverage.cjs
```

Set `TAKDEX_LEDGER_GAME` to a comma-separated list of game labels to narrow the inventory. Where bundles contain no source, the next step is to obtain a version-specific encounter or gift catalog before assigning gates. For populated regional bundles, verify encounter methods and enterable room or field-move prerequisites for each location. Alternate routes and progression codes should follow the same evidence bar used for Unova.

### Kanto follow-through

The Red, Blue and Yellow bundles now use location and encounter-method gates. This review checked named prerequisites such as Misty and Cut for Route 9, the Silph Scope for Pokémon Tower, the Poké Flute en route to Fuchsia, the individual fishing rods, and Surf and the Hall of Fame for Cerulean Cave. Named prerequisites matter because several gyms can be beaten out of order. The timing number is a lower bound. Version-specific gifts and in-game trades remain separate, including the Abra and Clefairy trades for Mr. Mime. [Route 9](https://bulbapedia.bulbagarden.net/wiki/Kanto_Route_9) · [Pokémon Tower](https://bulbapedia.bulbagarden.net/wiki/Pok%C3%A9mon_Tower) · [Safari Zone](https://bulbapedia.bulbagarden.net/wiki/Kanto_Safari_Zone) · [Cerulean Cave](https://bulbapedia.bulbagarden.net/wiki/Cerulean_Cave) · [In-game trades](https://bulbapedia.bulbagarden.net/wiki/In-game_trade)

| Game | Fixed baseline → verified | Expanded baseline → verified | Remaining in expanded cohort | Named location lower bounds |
| --- | ---: | ---: | --- | ---: |
| Red | 0 → 103 / 106 (97.2%) | 0 → 114 / 117 (97.4%) | 3 conditional starter choices | 42/45 |
| Blue | 0 → 103 / 106 (97.2%) | 0 → 114 / 117 (97.4%) | 3 conditional starter choices | 42/45 |
| Yellow | 0 → 106 / 106 (100%) | 0 → 120 / 120 (100%) | 0 within this cohort | 42/45 |

The Yellow cohort figure excludes out-of-cohort species and routes. Remaining location work includes the exact stretch of Route 23 where fishing is possible and individual event-gated Underground Path transactions. Regional catalogs after Johto outside Unova still need a comparable audit.

### Johto follow-through

Gold, Silver and Crystal now distinguish route access from fishing rods, daylight, tree encounters, field moves and phone-triggered swarms. The Gold Qwilfish row names the Old Rod and Fisher Ralph’s call. Union Cave Lapras requires access to the deepest room and a Friday visit. Silver's Lugia uses the Radio Tower Silver Wing, while Gold and Crystal use the postgame Pewter wing. Crystal’s Ho-Oh, randomized Odd Egg and Celebi event are separate from the Gold and Silver rules. Post-League Kanto follows the Johto access sequence. [Gold and Silver walkthrough](https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_Gold_and_Silver) · [Crystal walkthrough](https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_Crystal) · [Outbreaks](https://bulbapedia.bulbagarden.net/wiki/Pok%C3%A9mon_outbreak) · [Whirl Islands](https://bulbapedia.bulbagarden.net/wiki/Whirl_Islands) · [Bell Tower](https://bulbapedia.bulbagarden.net/wiki/Bell_Tower)

| Game | Fixed baseline → verified | Expanded baseline → verified | Remaining in expanded cohort | Named location lower bounds |
| --- | ---: | ---: | --- | ---: |
| Gold | 0 → 148 / 151 (98.0%) | 0 → 167 / 170 (98.2%) | 3 conditional starter choices | 75/84 |
| Silver | 0 → 148 / 151 (98.0%) | 0 → 167 / 170 (98.2%) | 3 conditional starter choices | 75/84 |
| Crystal | 0 → 166 / 170 (97.6%) | 0 → 176 / 180 (97.8%) | 3 conditional starter choices and Celebi distribution / platform | 75/85 |

All 57 machine locations are documented per title. The timing engine has **56/57** story or badge gates. Psych Up depends on a Generation I Abra and a Time Capsule trade, with no standalone in-game badge deadline. Crystal’s Goldenrod tutor costs 4,000 coins, requires a Coin Case and Hall of Fame entry, and appears Wednesday or Saturday. The planner tracks documented single-copy Johto TMs while recognizing repeatable shop sources. The [Kanto and Johto exception ledger](round4-kanto-johto-ledger.jsonl) records remaining conditional rows. [Generation II machines](https://bulbapedia.bulbagarden.net/wiki/List_of_TM_and_HM_locations_in_Generation_II) · [Move Tutor](https://bulbapedia.bulbagarden.net/wiki/Move_Tutor)

### Revised Unova-only scope

The user narrowed new acquisition and move timing research to Black 2 and White 2 first, followed by Black and White. The Kanto and Johto improvements above remain in the candidate. The unfinished Hoenn research and patch were saved separately for possible future work.

The Unova follow-through checked the previously unclassified regional and national entries against the version-specific encounter and transfer catalogs. It added National Pokédex swarms, resident-dependent White Forest encounters, the post-League Day Care gates, compatible parents and required incense, Nimbasa's Dropped Item trade sequence, evolution items, and separate restrictions for Dream Radar, Funfest Missions and historic distributions. A direct native route takes precedence over any transfer listing. A classification records a verified route or a documented restriction for each bundled catalog row. It does not imply every alternative has been timed or that the historical hardware and distribution programs remain accessible. [BW2 swarms](https://www.serebii.net/black2white2/swarms.shtml) · [BW swarms](https://www.serebii.net/blackwhite/swarms.shtml) · [BW2 in-game trades](https://www.serebii.net/black2white2/ingametrade.shtml) · [White Forest residents](https://bulbapedia.bulbagarden.net/wiki/White_Forest) · [Day Care](https://bulbapedia.bulbagarden.net/wiki/Day_Care) · [BW2 transfer catalog](https://www.serebii.net/black2white2/unobtainable.shtml) · [BW transfer catalog](https://www.serebii.net/blackwhite/unobtainable.shtml)

| Game | Fixed verified | Expanded baseline → verified | Transfer / event / conditional choice outside verified timing |
| --- | ---: | ---: | ---: |
| Black 2 | 300/304 | 212 → 406 / 410 (99.0%) | 224 / 11 / 9 |
| White 2 | 299/303 | 209 → 403 / 407 (99.0%) | 227 / 11 / 9 |
| Black | 239/247 | 160 → 332 / 340 (97.6%) | 303 / 6 / 9 |
| White | 239/247 | 160 → 424 / 432 (98.1%) | 211 / 6 / 9 |

Each title has 650 bundled catalog rows. Verified native timing and the three restriction categories partition those rows. The expanded percentage uses the audited positive-route cohort, with the same expanded denominator applied to the baseline. The [Unova exception ledger](round4-unova-ledger.jsonl) covers all non-timed rows and exceptions. The 97 original TM/HM story gates, three count-gated reward TMs and unavailable Snarl account for all 101 original machines. Each sequel has 101 story gates. Special-tutor coverage now includes **69** moves per sequel and **9** per original. The audit records friendship, species and event requirements separately from the route gate. [Generation V Move Tutors](https://bulbapedia.bulbagarden.net/wiki/Move_Tutor#Generation_V) · [Generation V machines](https://bulbapedia.bulbagarden.net/wiki/List_of_TM_and_HM_locations_in_Generation_V)

Automatic Unova Final recommendations schedule the selected moves across evolution stages. For example, a move needed at Lv 46 on the earlier stage and another learned at Lv 28 on the later stage cannot be combined through ordinary level-up. The latter may work via the Move Reminder if the deadline permits it. A linked save's actual level and retained moves constrain which levels can still be reached. Manual choices remain editable and keep their existing warnings. The scheduler does not prove every possible egg, event or alternate-form inheritance combination.

The resource review counts documented field copies of evolution items, currency costs for planned tutor-only moves, and Heart Scales for planned Reminder routes. It consolidates needs across the team, distinguishes version-specific copies and recommends documented repeatable supplies when a field copy is already committed. The Black 2 two-Fire-Stone browser plan showed one field copy and the BP alternative at the early deadline, then two field copies at the later deadline. Starter and fossil choices retain their version restrictions. This estimates supply and planned demand. The save parser does not read the bag or verify that the player has purchased, spent or traded their resources. [Fire Stone](https://bulbapedia.bulbagarden.net/wiki/Fire_Stone) · [Dusk Stone](https://bulbapedia.bulbagarden.net/wiki/Dusk_Stone) · [Electirizer](https://bulbapedia.bulbagarden.net/wiki/Electirizer) · [Magmarizer](https://bulbapedia.bulbagarden.net/wiki/Magmarizer)

### Automated verification

| Status | Verification |
| --- | --- |
| Pass | 48 V76 and V77 Node tests, including exact Unova gates, historical version restrictions, unconditional evolution paths, and bounded TM and species resources. |
| Pass | Focused Chromium at 390 and 412 CSS px. Automatic During and Final moves were populated with zero, one, two, three and four existing moves. The exact comparison exercised Golduck and Starmie through the real ranking code with a restricted candidate fixture. Full-catalog Round 3 coverage ran separately. |
| Pass | Browser projection covered Psyduck → Golduck, a tightened deadline, a retained manual move, Keep Psyduck, Eevee → Jolteon, Sandile → Krookodile and disabling the unverified local Conkeldurr evolution. Route 11 and off-atlas Nature Preserve navigation passed, including contextual return. A single TM copy was flagged in Red and Crystal, while the same repeated machine in Black 2 was accepted. The Red Mr. Mime entry displayed its level range, Abra trade and Diglett’s Cave approach. Gold Qwilfish displayed the fishing rod and swarm prerequisites. |
| Pass | Round 3 and V77 browser flows across 320, 360, 390, 412 and 1280 px included dynamic ranking, compact layouts, save synchronization, plan transfer, contextual return and toolbar geometry. V76 visual comparison, team management, Battle/6v6, historical data and offline cold reload also passed. |
| Deferred / limited | The user deferred further non-Unova research. Historical hardware, actual resource ownership and the earliest possible alternate route under every single playthrough remain outside the verified inference. |
| Not tested | Native Android, physical mobile touch and a playthrough of every documented encounter. |

### Essential acceptance checks

1. In Black 2, select Psyduck → Golduck. Check four useful choices in During and Final where legal. Then plan Psyduck with Golduck as its Final target, edit one move and change the deadline or choose Keep Psyduck. The manual choice should remain.
2. Compare Golduck and Starmie on the current team. Check that both retain meaningful strengths and that the recommendation explains the practical trade-off.
3. Check that Black 2 Golduck has two-line individual entries. Open Nature Preserve from Magikarp’s Pokédex, read the Permit requirement, then return to the same entry.
4. Set a Black 2 plan with two Fire Stone evolutions. Check that the early deadline shows one field copy and a renewable source, and that changing the deadline updates the count while preserving both choices.

## Correction Round 5

### Acquisition paths, resources and preserved data

The Team Planner stores a selected route key and starting species with the planned slot. The key identifies a version-specific source and survives leveling an owned Pokémon. Older plans keep their moves, locks and legacy temporary notes. The existing export includes the route and older exports still import. A route can begin with a wild encounter, a gift, an in-game trade or an owned Pokémon where the evidence supports it. The editor identifies later routes separately and retains the user’s choice when a deadline changes.

Flygon through Trapinch includes both the Lv 35 Vibrava step and the Lv 45 Flygon step. A Black 2 direct Golduck caught at Village Bridge starts at Lv 36–38 and uses Golduck’s learnset. Its recommendation does not borrow Psyduck’s moves. The resource budget counts the Fire Stone for a selected Growlithe or Vulpix evolution and excludes it for a direct Ninetales encounter. It shows how much documented supply is available by the deadline, any repeatable source and projected demand for blocked routes. This is the documented world supply. Bag inventory remains unverified by save import. The planning engine retains reusable Generation V machines and prior single-use machine accounting. [Black 2 and White 2 walkthrough](https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_Black_2_and_White_2) · [Village Bridge encounters](https://bulbapedia.bulbagarden.net/wiki/Village_Bridge_(location)) · [Desert Resort encounters](https://bulbapedia.bulbagarden.net/wiki/Desert_Resort) · [Fire Stone sources](https://bulbapedia.bulbagarden.net/wiki/Fire_Stone)

The Round 4 audited acquisition cohorts and denominators are retained. This round adds planner consumption of encounter levels and verified alternate routes without promoting a catalog row to verified acquisition. Archive status and Kanto and Johto data are unchanged.

| Game | Verified before and after | Machine timing before and after |
| --- | ---: | --- |
| Black 2 | 406/410 | 101/101 story gates |
| White 2 | 403/407 | 101/101 story gates |
| Black | 332/340 | 97 story gates, three Pokédex-count rewards, one unavailable event route |
| White | 424/432 | 97 story gates, three Pokédex-count rewards, one unavailable event route |

The prior [Unova exception ledger](round4-unova-ledger.jsonl) lists acquisition cases excluded from the verified cohort. For the Black 2 Emboar example, Hammer Arm appears as **Move Reminder**, with PWT, one Heart Scale and the first tournament prerequisite. The original games use Mistralton City. Level-one entries on basic forms retain normal starting-move handling. Exact egg, distribution and alternate-form inheritance remain subject to the documented exceptions. [Emboar’s Generation V learnset](https://pokemondb.net/pokedex/emboar/moves/5) · [Move Reminder](https://bulbapedia.bulbagarden.net/wiki/Move_Reminder) · [Pokémon World Tournament](https://bulbapedia.bulbagarden.net/wiki/Pok%C3%A9mon_World_Tournament)

### Ranking evidence

Round 4 selected moves greedily, so one Pokémon could receive high scores for several attacks covering the same types. Round 5 evaluates candidate sets of up to four moves. It uses game-specific power, accuracy, category, offensive stats, STAB, priority, effects and battle drawbacks. Each type and trainer matchup credits the strongest attack in the combination. Moves that duplicate a teammate’s strong answer or another attack in the set earn less. The search tests evolution and move-learning schedules before accepting a combination. Reserved one-use machines and stage access are checked separately.

Defensive suitability adjusts offensive coverage using incoming type multipliers, known abilities, bulk, priority and historic Speed where available. Named trainer types contribute where roster data exists. The model treats opposing STAB as a likely matchup consideration. A Water-resistant Golduck earns more credit for taking on Water opponents than a Water-weak Growlithe with an Electric attack. Shared weaknesses are classified by resistant and immune teammates, concentration, severity and bulk. No type-coverage score certifies a safe switch or battle result.

The Black 2 browser comparison used three badges, Psyduck Lv 22, Growlithe Lv 26, Magnemite Lv 22, Scraggy Lv 22 and two empty slots. The candidate index was unfiltered. Both evolutions used the owned pre-evolution. The following were observed on the Round 4 baseline and a Round 5 browser checkpoint.

| Pokémon and mode | Round 4 observed | Round 5 observed |
| --- | --- | --- |
| Golduck During game | Water Pulse, Zen Headbutt, Strength, Water Gun | Strength, Water Pulse, Zen Headbutt, Rock Smash |
| Golduck Final | Hydro Pump, Surf, Ice Beam, Scald | Surf, Ice Beam, Psychic, Brick Break |
| Arcanine During game | Flame Burst, Strength, Bite, Flame Wheel | Flame Burst, Strength, Bite, Rock Smash |
| Arcanine Final | Flare Blitz, Fire Blast, Flamethrower, Outrage | Flare Blitz, Crunch, Thunder Fang, Bulldoze |

Golduck retains Surf for reliable STAB and field access. Ice Beam covers Grass, Flying, Ground and Dragon. Psychic and Brick Break offer Fighting, Poison, Normal, Dark, Rock, Ice or Steel coverage depending on opponent typing. A strong Psychic or fighting alternative can displace the redundant Water attack. Arcanine retains Fire STAB, adds Dark coverage with Crunch and Ground coverage with Bulldoze, and can use Thunder Fang as secondary coverage with the Move Reminder gate. A Water-weak attacker receives reduced value for Electric coverage against Water opponents. Strength can still fill an early slot as a dependable attack while a target move is gated. The executed full-pool examples filled all four slots. The separate browser fixtures also covered owned Psyduck with zero, one, two and four recorded moves. Manual imported team entries with missing move names are treated as incomplete evidence of known moves.

### Interface and testing

Replacement recommendations rank the eligible catalog and render it progressively. Historical type filters apply to typed search and ranked results. Both moveset modes use the same searchable editor, with full-selection on focus and keyboard navigation. The planner restores the active editor slot, exposes valid map links and shows separate team progress and defensive coverage indicators. Contextual Pokémon actions open when the hold threshold is reached. Pokédex Quick Compare keeps both choices open while a slot changes. Move Checker retains its More destination, offers a separate contextual Back and combines the machine tabs.

The V76 and V77 Node suites include four independent PKTool comparisons against public retail saves. Chromium tests cover the selected branch’s save import and synchronization, ordinary Battle, 6v6, navigation, offline cold reload, older V77 planning cases and Round 5. The Round 5 browser script exercises normal UI flows at 320, 360, 390, 412 and 1280 CSS px. See the [requirement checklist](ROUND5-CHECKLIST.md) for evidence and remaining limits. Physical Android testing remains open for V10.

### Isolated development preview

[Open the Tak-Dex V77 development preview](https://tak-dex-v77-development.freeclout8.chatgpt.site) in the phone browser. Sign in with the ChatGPT account that owns the preview if prompted. The page shows the exact development checkpoint at the top. The preview has its own HTTPS origin and service worker cache. Import a team JSON in the preview to use a copy of production data.

The preview uses an allowlisted static package from a reviewed `v77-development` commit. The build script stages the website in the isolated hosting checkout, writes a development badge and `preview-build.json`, and uses a commit-scoped service worker cache. GitHub Pages continues to serve production from `main`. Site publication currently runs at review checkpoints. There is no continuously linked GitHub-to-Sites publication pipeline. No production hosting or Android change is required for web acceptance. [Preview packaging script](build-preview.py)

### Minimal manual acceptance

| Group | User status | Representative check |
| --- | --- | --- |
| Acquisition, maps and resources | Not tested | Set Flygon to Trapinch, open Desert Resort and return. Check the independent Fire Stone warning when Arcanine and Ninetales use their earlier forms. |
| Pokémon ranking and filters | Not tested | Open a replacement or an empty slot. Combine Ground and Dragon, switch between any and all, clear the filters and scroll through the ranks. |
| Movesets and move statistics | Not tested | Confirm Golduck or Arcanine, review both four-slot sets and type part of a move name to edit it. |
| Plan cards and summaries | Not tested | Compare the two sprites and move rows, confirm the editor title after reopening and review the separately colored coverage and progress metrics. |
| Hold and contextual navigation | Not tested | Hold a planned card or candidate, release without triggering an action and return from Pokédex or Compare. |
| Move Checker and phone preview | Not tested | Open the hosted preview on the phone, identify its build, search a machine and check the separate More and Back controls. |
