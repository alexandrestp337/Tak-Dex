# PokéTact V5
- Evolution buttons hide once species is confirmed to have no available evolution for the selected game; while checking, the button is disabled.
- Double battle now ranks pairs, proposes attacks and targets, recognizes common spread move targets and potential friendly-fire, balances type-based offense and incoming STAB risk, and uses base Speed as a minor tie-breaker.
- Existing saved moves from earlier versions do not have power/target metadata. Re-select those moves in the editor for more informative pair recommendations.
- This is a heuristic, not a turn simulator or damage calculator. It cannot predict opponent moves, Protect, switching, abilities, items, actual turn order, or accurate damage. Move targets and evolution conditions are not exhaustively modeled.
- First lookups still require internet; full offline database remains future work.
