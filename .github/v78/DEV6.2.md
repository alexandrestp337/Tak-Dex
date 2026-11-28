# DEV6.2 · Gen VI database expansion

Base checkpoint `cebc7f1ac45859e9d88cea238a5bf756cc9f667f`, [DEV6.1 verification](DEV6.1.md). Stable ancestor `0db535bd8b3c3945052489f75997e1d4987669d9`. Development branch `v78-database-development`, [draft PR #7](https://github.com/alexandrestp337/Tak-Dex/pull/7). Work continues from the validated checkpoint with acceptance pending. The executor does not expose a reliable allowance percentage.

## Checkpoint 1 · X/Y fossil revival

Two groups per version now name Ambrette Town as the Pokémon revival location and distinguish that from the mutually exclusive Jaw or Sail Fossil choice in Glittering Cave. Raw encounter packs and existing downloaded caches are preserved. The correction applies when rendering either cached or bundled data, without implying a second independently obtainable fossil. No map target was added. [Ambrette Town Fossil Lab](https://bulbapedia.bulbagarden.net/wiki/Ambrette_Town) · [Glittering Cave](https://bulbapedia.bulbagarden.net/wiki/Glittering_Cave)

Chromium passed the Tyrunt and Amaura Pokédex flow at 360 and 412 CSS px in both themes. Each shows one Ambrette revival row with level 20, choice requirements and plain text. Syntax, shell metadata parity and footer check passed with `takdex-v78.0.0-dev6.2.1`. Evidence retrieved November 28, 2026.

## Checkpoint 2 · ORAS inventory and 107 machine locations

Pinned comparisons found 54,392/54,392 ORAS learnset tuples and 107/107 machine assignments already present. Each version has 407/407 grouped encounters matching the pinned source, without duplicate keys or level-range differences. These denominators describe the snapshot only. DexNav, Mirage and special acquisitions are not uniformly covered. No ORAS Pokémon, move or raw encounter data was replaced.

The shared acquisition provider now resolves 107/107 ORAS machine locations per version, up from zero. Dark Pulse correctly names Team Magma Hideout in Omega Ruby and Team Aqua Hideout in Alpha Sapphire. All seven HMs have version-appropriate locations and separate field-use badge requirements. The Fallarbor Move Reminder is documented with the Dynamo Badge route and Heart Scale cost. [Bulbapedia Gen VI machine locations](https://bulbapedia.bulbagarden.net/wiki/List_of_TM_and_HM_locations_in_Generation_VI) · [Serebii ORAS machines](https://www.serebii.net/omegarubyalphasapphire/tmhm.shtml) · [Serebii ORAS reminder](https://www.serebii.net/omegarubyalphasapphire/movetutor.shtml)

Chromium passed the location registry count and the normal TM/HM flow for ORAS Dark Pulse and Rock Smash at 360/412 CSS px across both themes. There are no unverified Hoenn links. Machine prices, complete story gates and temporary-form legality remain separate work. Evidence retrieved November 28, 2026.

## Checkpoint 3 · ORAS tutors

The location provider now covers all 70 distinct ORAS tutor moves in the pinned version-group learnsets, up from 0/70 per version. It separates the 60 BP moves at the post-Delta Episode Battle Resort from 10 special moves. This includes Dragon Ascent relearning at Meteor Falls and does not offer Dragon Ascent in X/Y. Existing learnset eligibility remains in effect. The Move Checker uses plain text for Gen VI tutor locations while map artwork is unresolved. Executed Chromium provider checks at both widths and themes, including Iron Head at 8 BP and the Dragon Ascent requirement. [Serebii ORAS tutors and BP prices](https://www.serebii.net/omegarubyalphasapphire/movetutor.shtml) · [Bulbapedia Gen VI tutors](https://bulbapedia.bulbagarden.net/wiki/Move_Tutor#Generation_VI)

## Checkpoint 4 · ORAS opening and story encounters

Timing now resolves 79/407 bundled groups per version, up from 0/407. The opening cohort covers Routes 101–104 and 110 walking and hordes plus the audited Surf, Old Rod and Good Rod gates. Unverified Super Rod route access remains unknown. Named story routes distinguish Weather Institute Castform (empty party slot), post-League Beldum, Delta Episode Rayquaza, and the version-specific Cave of Origin encounter. The Deoxys row explains the difference between the first battle in space and the Sky Pillar retry. Raw record sets, individual version restrictions and condition strings remain in place. [Hoenn Route 101](https://bulbapedia.bulbagarden.net/wiki/Hoenn_Route_101) · [Hoenn Route 110](https://bulbapedia.bulbagarden.net/wiki/Hoenn_Route_110) · [Hoenn Route 118](https://bulbapedia.bulbagarden.net/wiki/Hoenn_Route_118) · [Weather Institute](https://bulbapedia.bulbagarden.net/wiki/Weather_Institute) · [Cave of Origin](https://bulbapedia.bulbagarden.net/wiki/Cave_of_Origin) · [Delta Episode](https://bulbapedia.bulbagarden.net/wiki/Delta_Episode)

Chromium confirmed the per-version counts, the Route 102 land/Surf distinction, and Groudon versus Kyogre source selection. The DEV6.1 browser regression also passed, including historical checks and the offline shell reload. The DEV6.1 script now uses Sun for isolation checks because ORAS intentionally gained coverage.

## Checkpoint 5 · ORAS Gym and League rosters

Both editions now expose eight first Gym challenges and five first League rosters plus all five League rematches. The shipped registry resolves each party slot's known moves, ability and held item with the existing 6v6 provider. Rematches retain Mega Stones as held items and base-form records. The simulator's in-battle Mega transitions and double-battle behavior are outside the validated cohort. No rival, boss or ordinary-trainer roster is inferred. [Serebii ORAS Gyms](https://www.serebii.net/omegarubyalphasapphire/gyms.shtml) · [Serebii ORAS League](https://www.serebii.net/omegarubyalphasapphire/elitefour.shtml) · [PokémonDB roster comparison](https://pokemondb.net/omega-ruby-alpha-sapphire/gymleaders-elitefour) · [Bulbapedia Steven party and moves](https://bulbapedia.bulbagarden.net/wiki/Steven_Stone)

Compared species and levels across Serebii and the ORAS battle tables on the individual Bulbapedia trainer pages. Used the latter for abilities and League moves missing from the Serebii table. All species and attack identifiers resolve in the bundled index. Chromium passed in both ORAS versions, both themes and both widths, including the selector counts and Steven's level-79 Metagross with four attacks and Metagrossite.

## Checkpoint 6 · ORAS horde gates, starters and targeted verification

Added 13 timing groups per edition across Petalburg Woods, Rusturf Tunnel, Granite Cave 1F, Fiery Path, Meteor Falls main cavern and Jagged Pass. Later floors with separate navigation gates remain outside this cohort. The twelve Route 101 starter gift rows distinguish the initial Hoenn choice from the three different postgame gates. A Pokédex test verified the actual Snivy row shows the Delta Episode requirement. Checked bundled Primal Groudon, Primal Kyogre and Mega Rayquaza types and abilities for both editions. That check does not certify form eligibility, in-battle transformation, weather mechanics or acquisition. [Hoenn Route 101](https://bulbapedia.bulbagarden.net/wiki/Hoenn_Route_101) · [Granite Cave](https://bulbapedia.bulbagarden.net/wiki/Granite_Cave) · [Fiery Path](https://bulbapedia.bulbagarden.net/wiki/Fiery_Path) · [Jagged Pass](https://bulbapedia.bulbagarden.net/wiki/Jagged_Pass)

### Coverage and resume table

| Cohort | Status | Result and remaining work |
| --- | --- | --- |
| X/Y fossil revival | Pass for the two bundled groups per version | Corrected location, fossil choice and level. Other restored fossils, hotel trades, late story gates and transfer-only coverage remain partial. |
| X/Y League, rivals and bosses | Blocked for exact League configuration, otherwise untouched | Malva's female Pyroar has no female species record under the current bundled identity contract. Sources disagree on Drasna's last Noivern attack (Super Fang or Boomburst) and Diantha's starting Gardevoir ability (Trace or Synchronize). Preserve these field gaps until corroborated. Rival and boss variants still require research and tests. |
| ORAS core data and historical mechanics | Partial | 54,392 pinned learnset tuples, 107 machines and 407 grouped encounters per version match the current bundle. Three historical forms passed representative checks. Wider form eligibility, evolution rules, breeding provenance and transfer boundaries need validation. |
| ORAS machine, tutor and reminder location references | Pass for listed locations, partial timing | 0 → 107 machine and 0 → 70 tutor location records per edition. Verified protected version differences and benchmark requirements. Remaining independent gate, condition and price verification is incomplete. |
| ORAS encounters | Partial | 0 → 92 documented timing groups out of 407 bundled groups per game, plus 13 conditional notes per game for starters and the Deoxys retry. Full retail denominator is unknown. Remaining dense cohorts include later routes, caves, dive, fishing, Mirage, DexNav, fossils and version-exclusive events. The Southern Island source records need reconciliation against Eon Ticket eligibility before classifying their static encounters. |
| ORAS Gym and League presets | Pass for recorded trainer cohorts | 0 → 8 Gyms and 0 → 10 League variants per game. Rival, story boss and ordinary trainer rosters remain open. Double battles and automatic Mega/Primal transitions are outside tested simulation behavior. |
| Maps | Pending owner selection | No new links or artwork. Use verified place text until compatible map targets are approved. |
| Offline | Pass for tested shell and rollback flows | Essential failure retained the prior shell, optional map failure did not block activation, corrupt optional JSON was repaired, offline reload preserved storage. Full regional pack downloads and physical Android remain untested. |
| Next scope | Pending owner review | Continue the open Gen VI cohorts above. Gen VII requires its own authorization, version-group inventory and map decisions. |

Evidence was retrieved November 28, 2026. Ran focused `dev62-browser.cjs` and `dev61-browser.cjs` in Chromium at 360/412 CSS px in both themes, the existing `dev5-worker.cjs` on an archive of the DEV6.1 checkpoint, and the release metadata assertion from `dev5-offline.test.cjs`. Cache namespace `takdex-v78.0.0-dev6.2.6`. The [private build stamp](https://tak-dex-v77-development.freeclout8.chatgpt.site/preview-build.json) records the exact GitHub SHA. Owner acceptance is pending.
