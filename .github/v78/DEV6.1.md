# DEV6.1 · Generation VI foundation and X/Y database

Web baseline `0db535bd8b3c3945052489f75997e1d4987669d9` (`V78-STABLE`). Development branch `v78-database-development`. [Android V11 RC1 delivery](https://github.com/alexandrestp337/Tak-Dex-Android/releases/tag/v11-rc1-86282d77) verified read-only as a prerequisite.

## Checkpoint 1 · Source inventory

| Cohort | Status | Baseline and next action |
| --- | --- | --- |
| X/Y learnset source parity | Pass | 42,886 unique Pokémon/move/method/level tuples match exactly, including 12,344 level-up, 27,179 machine, 3,225 egg and 131 tutor tuples. The source includes no reminder-method rows. Cross-check reminder access and special methods separately. |
| X/Y machine assignments | Pass | All 105 assignments match the pinned snapshot. Location, access and field-use prerequisites are separate records. |
| X/Y direct encounter inventory | Partial | X 1,470 source rows, 947 bundled groups and 358 bundled IDs. Y 1,470, 946 and 357. Raw counts include Friend Safari, hordes, fishing, surfing, gifts and static entries. They do not establish coverage of all local acquisition, version conditions, trades or progression. Next compare grouped keys and special cohorts. |
| Historical data, forms and evolution | Partial | Compact records are indexed by Pokémon ID and include historical types, abilities and stats when supplied. Form-level legality and evolution rules still need validation. Form identities shared under one Pokémon ID cannot be counted independently from this inventory. |
| Trainers | Untouched | Check story roster, level and move evidence against version-specific references before adding complete cohorts. |
| ORAS | Deferred | The encounter index has 526 rows, 407 groups and 146 IDs per version. Pinned ORAS learnsets and all 107 machine assignments match the bundle. Verify source gaps and acquisition in DEV6.2. |
| Kalos map | Blocked for artwork | Existing registry has Kalos places but no approved detailed map surface or supported named-target resolver for X/Y. Keep new acquisition text unlinked. |
| Gen V | Preserved | Black and White each have 2,696 source rows, 969 groups and 243 IDs. Black 2 has 3,850/1,566/294 and White 2 has 3,850/1,567/293. These counts leave special acquisition and version coverage unresolved outside this checkpoint. |

Sources retrieved November 28, 2026. [Pinned PokéAPI CSV commit](https://github.com/PokeAPI/pokeapi/tree/de6760be38b60a3024f1d9054330ff265f0dc619/data/v2/csv) supplies a reproducible comparison set. Learnset parity ignores order within a level and compares the fields stored by the current compact schema. The existing bundle license is `db74/LICENSE-PokeAPI.md`. Source parity does not establish retail completeness.

Verification executed with `python .github/v78/dev61-inventory.py /workspace/scratch/dev61-source` against downloaded source CSVs. No application or data pack files changed in this checkpoint. The executor exposes no reliable quota percentage.

## Checkpoint 2 · X/Y story machine sources

[Draft PR #7](https://github.com/alexandrestp337/Tak-Dex/pull/7) tracks the dedicated database branch. X and Y now have shared, version-scoped acquisition references for all five HMs, all eight Gym TM rewards and TM94 Rock Smash. The checker distinguishes acquisition from the badge needed for field use. There are now 14 of 105 supported machine locations per version, up from zero in the local machine location provider. Remaining TMs and exact planner timing are still unknown in that provider. ORAS receives no X/Y fallback.

Sources retrieved November 28, 2026. [Bulbapedia Gen VI machine list](https://bulbapedia.bulbagarden.net/wiki/List_of_TM_and_HM_locations_in_Generation_VI) supplies X/Y locations and field-use badge requirements. [PokémonDB X/Y TMs](https://pokemondb.net/x-y/tms) corroborates gym rewards and Rock Smash. [Serebii X/Y machine list](https://www.serebii.net/xy/tmhm.shtml) corroborates the HM recipients and locations. New records render as plain text because a compatible Kalos detail map remains pending.

Verification passed in the integrated Move Checker TM/HM view at 360 and 412 CSS px in light and dark themes. Examples include Surf in Shalour City with the Rumble Badge field-use restriction, and Dazzling Gleam from Valerie. Confirmed no Kalos map action, no horizontal overflow and no cross-version location fallback. The 412 px light context reloaded the development shell offline and resolved the new data. Syntax, release shell asset parity and footer metadata checks passed. The changed scripts use `78.0.0-dev6.1` URLs and the shell uses `takdex-v78.0.0-dev6.1`. Existing offline-pack namespaces are retained.

## Checkpoint 3 · Full X/Y machine location set

The local X/Y provider now resolves 105/105 machine locations for both versions (previous checkpoint 14/105). Machine assignments and learnsets remain byte-identical to the baseline. The location cohort uses the same triangulated sources above, with factual shop costs, field requirements, time windows and postgame labels where documented. PokémonDB lists TM21 under Cyllage City, while Bulbapedia identifies Connecting Cave. The label uses the Cyllage side of Connecting Cave. Exact numeric Planner timing and exhaustive secondary prerequisites remain partial even when the location is known.

The focused Chromium test verified all 105 location keys against the bundled assignments and exercised Surf, Sludge Wave (Battle Maison and BP), Waterfall, and Roost (Surf required) across both tested widths and themes. It also reloaded shell `takdex-v78.0.0-dev6.1.2` offline and verified the acquisition provider was available.

## Checkpoint 4 · X/Y opening encounters and Move Reminder

The existing acquisition engine now times all 31 bundled encounter groups per version covering Route 2, Santalune Forest and Route 3. The 23 walking groups are pre-badge. The eight Route 3 water groups have separate Surf or rod gates. Route 2 preserves Weedle in X and Caterpie in Y, with separate Santalune Forest records for both. Coverage changed from 0 to 31 verified timing groups per version within this three-area cohort. The raw encounter packs and stored plans were untouched. The Move Reminder reference adds Dendemille Town, one Heart Scale and the Route 15 story access.

Evidence retrieved November 28, 2026. [PokémonDB Route 2](https://pokemondb.net/location/kalos-route-2), [Santalune Forest](https://bulbapedia.bulbagarden.net/wiki/Santalune_Forest) and [Route 3](https://bulbapedia.bulbagarden.net/wiki/Kalos_Route_3) establish the cohort. [Old Rod](https://bulbapedia.bulbagarden.net/wiki/Old_Rod), [Good Rod](https://bulbapedia.bulbagarden.net/wiki/Good_Rod), [Super Rod](https://bulbapedia.bulbagarden.net/wiki/Super_Rod), [Route 16 factory gate](https://bulbapedia.bulbagarden.net/wiki/Kalos_Route_16#Trivia) and [Dendemille Move Reminder](https://bulbapedia.bulbagarden.net/wiki/Dendemille_Town#Move_Reminder_and_Move_Deleter's_house) establish method and service timing.

Chromium checked the grouped counts, X/Y exclusives, the reminder lookup, and the actual Masquerain Pokédex encounter row with the Rumble Badge requirement and no false map action. Machine flows and an offline shell reload also passed. Full pack download, later routes, source corrections to raw levels, special encounters, tutor locations, legal forms and trainer rosters remain open. The cache namespace is `takdex-v78.0.0-dev6.1.3`.

## Checkpoint 5 · X/Y tutor locations and conditional Safari access

Both versions now have 9/9 local tutor location references for the distinct tutor moves in the pinned X/Y learnset cohort (previously 0/9). The new data covers the pledge tutors in Laverre, advanced starters and the two Mythical tutors in Snowbelle, and Draco Meteor on Route 21. Legal learnset tuples remain unchanged. The reminder remains its own acquisition method.

Both versions now display verified postgame and registered-friend prerequisites on all 194 bundled Friend Safari groups, covering 189 distinct Pokémon IDs. Slot 3 also identifies the additional unlocking condition. The Planner does not count this conditional access as a confirmed ordinary catch route. The comparison establishes coverage of existing groups, not a completeness claim for the retail Safari table.

Sources retrieved November 28, 2026. [Serebii X/Y tutor locations](https://www.serebii.net/xy/movetutor.shtml) and [Bulbapedia Gen VI tutors](https://bulbapedia.bulbagarden.net/wiki/Move_Tutor#Pok%C3%A9mon_X_and_Y) corroborate the nine records. [Bulbapedia Friend Safari](https://bulbapedia.bulbagarden.net/wiki/Friend_Safari) documents postgame access, registered friends, and local Slot 3 unlocking after the online service shutdown.

Syntax and release asset parity passed. Chromium confirmed the counts, ORAS isolation, the actual Masquerain Friend Safari row, machine flows and an offline reload with cache `takdex-v78.0.0-dev6.1.4`. No encounter packs or map assets changed.

## Checkpoint 6 · X/Y first Gym challenges

Both versions now have 8/8 first-challenge Kalos Gym presets (previously 0/8), with 22 opponent slots each. The existing 6v6 and Coverage providers consume the same roster. Olympia's preset uses female Meowstic. Confirmed held-item fields are empty; consumable trainer healing items are outside these fields. Conflicting Mienfoo ability and Jumpluff's disputed attack are omitted. The other moves and abilities are carried over from matching trainer references. Levels remain the battle levels; any calculated stats continue through the existing estimate path.

Sources retrieved November 28, 2026. [Serebii Kalos Gyms](https://www.serebii.net/xy/gyms.shtml), [PokémonDB roster summary](https://pokemondb.net/x-y/gymleaders-elitefour), and individual Bulbapedia trainer pages were compared. Bulbapedia's retail order is used for Grant, Korrina and Ramos. [Korrina](https://bulbapedia.bulbagarden.net/wiki/Korrina) lists Inner Focus for Mienfoo while Serebii lists Regenerator. [Ramos](https://bulbapedia.bulbagarden.net/wiki/Ramos) lists Grass Knot for Jumpluff while Serebii lists Bullet Seed. League was reviewed for handoff: Malva uses female Pyroar while the bundled species uses the male canonical ID. Drasna's last Noivern move and Diantha's Gardevoir starting ability conflict by source. League, rivals, bosses and rematches are not included in this Gym checkpoint. Mega evolution and stance changes are not verified as simulated.

Chromium exercised both X/Y 6v6 Gym dropdowns, all eight preset names and the rendered Olympia opponent with level 48 and Psychic. The acquisition scenarios and offline shell reload also passed. Shell `takdex-v78.0.0-dev6.1.5`.
