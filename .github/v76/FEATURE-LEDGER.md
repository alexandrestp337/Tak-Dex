# Tak-Dex master feature ledger

V76 corrected web candidate for acceptance. Approved baseline `V75-STABLE` at `3a97d5acbc4d434e3fb24aaced1dad5534188531` reports V74 in the app. V76 reports V76 in About.

| Feature | V76 status | Evidence or remaining work |
| --- | --- | --- |
| Team Builder and saved teams | Retained | Existing localStorage keys, team JSON flow, manual editor, and Team Planner entry. Team Builder retains its Pokédex shortcut. Save import replaces the party of the selected team. |
| Generation V save parsing | Implemented | Read-only 512 KiB snapshots for all four games. CRC and mirrored checksum validation, bank fallback, Pokémon checksum, and source immutability checks. |
| Party data | Implemented with partial form and evolution presentation | Stats, current HP, level, move IDs and PP, item, ability, IVs, EVs, nature, shiny state, raw form and egg state. Mapped PokéAPI forms have distinct identities. Cosmetic and unsupported form indexes are retained. Bundled parent links supply evolution candidates. Evolution requirements still use the existing reference lookup. |
| Save synchronization | Web bridge ready | Changed snapshots update the same team. Wrong-game, invalid, stale and identical snapshots retain existing data. Team Builder shows saved-game timestamp. Chromium covered background updates in Battle and fullscreen Maps. |
| Battle stat sources | Implemented with estimates for trainers | Imported stats at the saved level, imported IV/EV/nature deltas for level edits, manual offsets, and BW2 Challenge Mode underlying level. Verified trainer move and item data does not establish exact trainer stats. |
| Survival-aware 6v6 | Implemented with bounded model | Immediate KO threat, priority, effective Speed and ties, accuracy, current HP, conditional power, Sturdy and Focus Sash. The recommendation considers two turns of entered attacks. Move cards prioritize first-turn OHKO and genuine two-hit KO probabilities, with separate damage-potential wording for blocked or uncertain execution. |
| Conditional moves | Partial | Revenge, Avalanche, Payback, Assurance, Hidden Power, and several context-dependent moves use known inputs. Full mechanics and every move across all generations remain open. |
| Battle and 6v6 interfaces | Implemented | Team strip above opponent search, restored V75 gold crown treatment, shared move cards, combined STAB display, aligned 6v6 moves and roll bars, actionable matchup warnings, V75-STABLE effectiveness accents and badge contrast, shared color-coded turn-order placement, Move Checker links and return state. Double Battle retains its existing pairing flow. |
| Stat editor | Implemented | Both sides reuse the horizontal level step controls with tap-to-select. Saved player team offsets persist. Custom opponent offsets can be stored with the existing saved-opponent presets. |
| Visual consistency | Partial | Battle move cards, expanded editor borders, compact controls, and centered equal Pokédex actions with matching icons received targeted updates. Full visual parity across every tool and on-device rendering remain open. |
| Pokédex | Implemented | Move Checker return restores learnset scroll. Bundled Pokémon and learnsets render when evolution details are unavailable. |
| Maps | Implemented with partial Emerald coverage | Accepted Hoenn schematic, Pokédex encounter navigation, fitting all plotted encounter pins, live collapsible fullscreen details, and compact toolbar with contained zoom readout. Existing Sinnoh and Unova artwork and data remain in place. |
| Offline Packs and cache | Retained | Game dropdown status dots are scoped to Offline Packs. V76 shell assets are precached. Browser tested offline cold reload with local move and encounter records. |
| Unova trainer database | Targeted corrections | English cartridge-derived boss move lists and held items take precedence for matched entries. Existing records provide fallback coverage. |
| Branding and feedback | Retained | WHOASP footer credit, branding assets, and feedback configuration. |
| Unified Move Checker | Implemented | All Moves, TM and HM modes share one tool. Existing By Type, acquisition, map links, game-specific team and individual compatibility, and evolution indicators remain available. |
| Android V9 | Subsequent stage | Waiting for web acceptance and the separate Android V8 source. Native behavior and Samsung Galaxy S25 Ultra validation are untested. |
