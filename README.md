# Tak-Dex V15

## Changes
- Wallpaper now uses a fixed viewport-sized `background-size: cover` layer with preserved aspect ratio; removes the exposed right border without stretching. Small cropping is possible depending on phone proportions.
- Better battle ranking: base Attack/Special Attack and opponent base Defense/Special Defense used as a *lightly weighted relative estimate*, along with power, accuracy, type multiplier, STAB and defensive weaknesses.
- Status, unknown-power, fixed/variable-power moves are not eligible for Best Move; double-battle power scoring also excludes these.
- Old teams receive base stat metadata in the background when opened.
- Corrects historical Gen 1 Ghost/Psychic immunity and excludes unavailable types.

**Not actual damage**: no Pokémon levels, EVs, IVs, natures, abilities, held items, real opponent attacks or most special effects. Conditional moves are excluded rather than guessed. No complete offline database yet.

Upload all 7 files to the existing GitHub Pages repo. Existing local team storage is preserved.
