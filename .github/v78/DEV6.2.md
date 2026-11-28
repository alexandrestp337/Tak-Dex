# DEV6.2 · Gen VI database expansion

Base checkpoint `cebc7f1ac45859e9d88cea238a5bf756cc9f667f`, [DEV6.1 verification](DEV6.1.md). Stable ancestor `0db535bd8b3c3945052489f75997e1d4987669d9`. Development branch `v78-database-development`, [draft PR #7](https://github.com/alexandrestp337/Tak-Dex/pull/7). Work continues from the validated checkpoint with acceptance pending. The executor does not expose a reliable allowance percentage.

## Checkpoint 1 · X/Y fossil revival

Two groups per version now name Ambrette Town as the Pokémon revival location and distinguish that from the mutually exclusive Jaw or Sail Fossil choice in Glittering Cave. Raw encounter packs and existing downloaded caches are preserved. The correction applies when rendering either cached or bundled data, without implying a second independently obtainable fossil. No map target was added. [Ambrette Town Fossil Lab](https://bulbapedia.bulbagarden.net/wiki/Ambrette_Town) · [Glittering Cave](https://bulbapedia.bulbagarden.net/wiki/Glittering_Cave)

Chromium passed the Tyrunt and Amaura Pokédex flow at 360 and 412 CSS px in both themes. Each shows one Ambrette revival row with level 20, choice requirements and plain text. Syntax, shell metadata parity and footer check passed with `takdex-v78.0.0-dev6.2.1`. Evidence retrieved November 28, 2026.

## Checkpoint 2 · ORAS inventory and 107 machine locations

Pinned comparisons found 54,392/54,392 ORAS learnset tuples and 107/107 machine assignments already present. Each version has 407/407 grouped encounters matching the pinned source, without duplicate keys or level-range differences. These denominators describe the snapshot only. DexNav, Mirage and special acquisitions are not uniformly covered. No ORAS Pokémon, move or raw encounter data was replaced.

The shared acquisition provider now resolves 107/107 ORAS machine locations per version, up from zero. Dark Pulse correctly names Team Magma Hideout in Omega Ruby and Team Aqua Hideout in Alpha Sapphire. All seven HMs have version-appropriate locations and separate field-use badge requirements. The Fallarbor Move Reminder is documented with the Dynamo Badge route and Heart Scale cost. [Bulbapedia Gen VI machine locations](https://bulbapedia.bulbagarden.net/wiki/List_of_TM_and_HM_locations_in_Generation_VI) · [Serebii ORAS machines](https://www.serebii.net/omegarubyalphasapphire/tmhm.shtml) · [Serebii ORAS reminder](https://www.serebii.net/omegarubyalphasapphire/movetutor.shtml)

Chromium passed the location registry count and the normal TM/HM flow for ORAS Dark Pulse and Rock Smash at 360/412 CSS px across both themes. There are no unverified Hoenn links. Machine prices, complete story gates and temporary-form legality remain separate work. Evidence retrieved November 28, 2026.
