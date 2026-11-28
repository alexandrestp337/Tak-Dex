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
