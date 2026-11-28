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
