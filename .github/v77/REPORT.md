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
