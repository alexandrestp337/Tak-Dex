# TAK-DEX V7
Redesigns battle recommendations to closely follow the dark red/gold mockup: compact ranked cards, gold winner, best move, collapsible attack details, and faded Poké Ball background.

Move selection now records move power, accuracy, type, and damage category, with generation-aware adjustments where PokéAPI supplies historical values. Existing saved team moves are upgraded in the background after opening a team or entering battle, with internet required on first lookup.

Best-move recommendations use a **relative move index** = listed base power × STAB × type effectiveness × accuracy probability, balancing offense against worst possible incoming STAB type weakness. This is **not actual damage** and cannot model stats, abilities, items, variable-power moves, fixed-damage moves, or conditional effects. The move accuracy probability is an approximation (ignores evasion and accuracy modifiers). Double battle pair ranking uses power and accuracy when metadata is present. Existing functionality retained. No offline database bundled yet.

Upload all six files to the same GitHub Pages repository root to retain locally saved teams.
