# V78 DEV3 RC1 implementation report

DEV3 continues from DEV2 RC1, commit `deadce6b639083fee2bc7699e5e59c18169154f2`, on `v78-development`. The candidate is reviewed in [draft PR #6](https://github.com/alexandrestp337/Tak-Dex/pull/6). The [private preview build stamp](https://tak-dex-v77-development.freeclout8.chatgpt.site/preview-build.json) records the delivered GitHub commit. The branch app cache is `takdex-v78.0.0-dev3-rc1`. The owner-only preview uses its commit-specific cache. Production is V77.2.1-STABLE at `7046e533ec9d01a8ca520068d7b5cfb092d1ccc2`.

## Battle

| Scope | Behavior and evidence |
| --- | --- |
| WEB-008 · Quick Battle | The DEV2 reproduction mixed calculated player Speed with species base Speed for the opponent. Raising Ferrothorn from level 10 to 85 changed Gyro Ball from 150 to 40 power and reversed its score against Iron Head. Under the shared base policy, the same fixture stays at 101 power, about 154 score, and the same move order and Speed estimate. The renderer, ranking, and turn indicator use the same source. Actual selected ability, weight, known held item, and type/STAB remain meaningful. When HP is unknown, Eruption, Reversal and Brine show ranges and the quick ranking uses the lower power. |
| WEB-011 · Damage rolls | The original three-point sample produced 25% at the 91-max/90-HP threshold. The pinned independent Stoutland Return fixture gives two qualifying rolls out of 16, so the revised estimate is 12.5% at 100% accuracy and 11.25% at 90% accuracy. Gen V applies power and Attack modifiers, base damage, weather, random factor, STAB, typing, burn and final damage modifiers at their tested stages. The cards and outcome estimator use the same roll function. Fixed-damage moves keep one value. |
| WEB-011 · 6v6 estimates | The two-turn estimator weights actual rolls and misses, applies priority, modeled Speed modifiers and ties, uses current HP, and handles the verified damage-triggered conditions, first-turn execution, recharge, Sturdy, Focus Sash and Focus Band. Gen V party status uses the existing stored status bits. Burn and paralysis receive their modeled effects. The move cards label matchup win estimates and retain the color-coded damage bars. Conditional uncertainty suppresses certainty labels where the model can identify an unsupported effect. |

The battle engine models two repeated entered moves against the entered damaging replies. Exact Gen V roll results are conditional on the supplied stats, move and supported modifiers. Outcome estimates depend on the known matchup. Critical hits, switching, many changing field effects, most secondary effects, recoil, thaw/wake timing and residual damage are outside the two-turn model. Status-only replies are outside the general simulation, although known guards can suppress the green preemptive recommendation. A multi-hit move with known hit metadata can show a one-hit estimate. For generations outside V, verified random-factor counts are applied to the existing approximate maximum formula. Full historical rounding and other mechanics remain in the DEV6/DEV7 backlog.

The fixture arrays were generated with `@smogon/calc@0.11.0`. `generate-gen5-golden.cjs` documents the inputs and reproduces them with the reference package installed outside the repository. The test runner uses frozen arrays with no application dependency on that package. The records include Sheer Force with Charcoal and Life Orb, Mold Breaker against Levitate, burn and Guts, Adaptability, Choice Specs, Multiscale, Torrent with rain, Brine, Choice Scarf with Gyro Ball, and active Intimidate with Choice Band. Gen V saved status fields use the existing parser and PKHeX’s documented field and enum. [Smogon damage calculator](https://github.com/smogon/damage-calc) · [PKHeX Gen V party record](https://github.com/kwsch/PKHeX/blob/master/PKHeX.Core/PKM/PK5.cs) · [PKHeX status flags](https://github.com/kwsch/PKHeX/blob/master/PKHeX.Core/PKM/Enums/StatusCondition.cs)

## DEV2 carry-forward

| Correction | Behavior |
| --- | --- |
| A · Acquisition | Expanded groups use the existing inset background. Natural acquisition selects a grouped path. Route locations link independently to Maps, and encounter methods appear as text. Black 2 Route 7 groups Walk and Dark Grass, and postgame Route 3 adds Hidden Grotto. A previously chosen exact method remains selected. An unrestricted verified Walk is preferred to a random Grotto when either satisfies the same choice. A compact chooser remains for material method prerequisites. Link trades remain separate. |
| B · Inline editor | The search, 44 px funnel, filters, actions and results share one red outline. The active funnel remains red with filters applied. Opening the editor leaves the search unfocused. |
| C · Separate move actions | Historical DEV2 result markup used a single replacement button for the whole suggestion. The suggestion name now opens Move Checker as its own focusable button. The rest of the card selects the move. Returning restores the same planner context, filters, search text, suggestion and page scroll, and leaves search unfocused. The existing Checker button remains. |
| D · Stat reset | The visible red reset button is a 32 px square with a 15 px icon. The padded hit region retains approximately 44 px of touch area, with room for the stat source line. The accessible name and reset action are preserved. |
| E · Map Back | The single contextual Back uses the same normal row and height as fullscreen, zoom, Clear and Reset, at the right edge. Fullscreen return and the general Maps More entry retain their original actions. |

## Targeted checks

- The frozen Gen V arrays and existing outcome suite run with `node --test .github/v76/battle.test.cjs .github/v78/dev3-battle.test.cjs`. Thirty cases passed. This includes the independent threshold and its accuracy weighting, cumulative two-hit outcomes, priority, ties, contextual Speed, defensive items, conditional power and relevant historical behavior.
- `node .github/v78/dev3-browser.cjs http://127.0.0.1:8914 --baseline` reproduced both audited failures using the DEV2 files. The candidate `TAKDEX_FOCUS=battle` run passed. It exercised invariant Quick Battle cards, rank and Speed with changed level, overrides and imported HP. In 6v6 the rendered Gyro Ball result changed with level, and the 91/90 fixture showed 12.5%, the probabilistic green notice and both damage colors.
- `node .github/v78/dev3-browser.cjs http://127.0.0.1:8914` exercises the five carry-forward corrections. `TAKDEX_EVIDENCE` saves screenshots at 360, 412 and 1280 CSS px in both themes. All six viewport/theme cases passed. Geometry checks inspect real bounding boxes, control sizes, spacing and horizontal overflow. The focused toolbar palette and geometry recheck also passed at all six sizes and themes.
- The existing [Map origins runner](dev2-integration.cjs) verifies Village Bridge via Pokédex, tutor, TM/HM, fullscreen and More with `TAKDEX_FOCUS=maps`. The existing Flame Wheel checker regression passed and confirms the editor and both scroll positions survive contextual Back.
- The prior DEV2 preview shell upgraded to DEV3 in the existing cache test, then started offline with its saved team, plan and reference-pack fixture intact. Syntax and diff checks passed.
- The canonical DEV1 store, import and save ordering files are outside this change. No Android or physical Samsung testing was performed.

## Private acceptance checklist

1. In Quick Battle, compare Ferrothorn’s Gyro Ball against Stoutland at two saved levels. Power, ranking and Speed indication should stay the same. In 6v6, change the level and check that contextual damage and estimates respond.
2. Open Zebstrika’s Black 2 acquisition picker. Check the grouped methods, map links, postgame grouping and distinct Blitzle trade path.
3. Open a planned move, apply filters, then tap a suggestion’s name and return. Verify the original editor state. Tap the rest of a suggestion to select it. Check the compact stat reset and use a linked map’s Back in the controls row.

Changed runtime assets are `app.js`, `battle-outcomes.js`, `v74-ux.js`, `maps.js`, `styles.css`, `index.html`, and `sw.js`. Tests and this report remain outside the hosted bundle. The DEV8 native handoff and DEV4 backlog remain in their existing scope.

The live stamp and served-file checks use ordinary owner sign-in when available. The deployment record and local package hashes can be verified separately without changing preview access.
